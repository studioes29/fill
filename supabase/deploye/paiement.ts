// supabase/functions/_partage/cles.ts
var lire = (nom) => {
  const v = Deno.env.get(nom);
  if (!v) return void 0;
  if (!v.trim().startsWith("{")) return v;
  try {
    const o = JSON.parse(v);
    return o.default ?? Object.values(o)[0];
  } catch {
    return void 0;
  }
};
var CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
var CLE_PUBLIABLE = lire("CLE_PUBLIABLE") ?? lire("SUPABASE_PUBLISHABLE_KEY") ?? lire("SUPABASE_PUBLISHABLE_KEYS") ?? lire("SUPABASE_ANON_KEY") ?? "";
var SITE = (Deno.env.get("SITE_URL") ?? "https://fill.studioes.fr/espace").replace(/\/$/, "");
var cors = {
  "Access-Control-Allow-Origin": (() => {
    try {
      return new URL(SITE).origin;
    } catch {
      return "*";
    }
  })(),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// supabase/functions/paiement/index.ts
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const cleStripe = Deno.env.get("STRIPE_SECRET_KEY");
  if (!cleStripe) return new Response("Paiement en ligne pas encore ouvert", { status: 503, headers: cors });
  const stripe = new Stripe(cleStripe);
  const sb = createClient(Deno.env.get("SUPABASE_URL"), CLE_PUBLIABLE, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } }
  });
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return new Response("Connexion requise", { status: 401, headers: cors });
  const { objet, id } = await req.json();
  let libelle = "", montant = 0, ref = "";
  if (objet === "commande") {
    const { data: c } = await sb.from("commande").select("id, unites, total, statut").eq("id", id).single();
    if (!c || c.statut !== "a_payer") return new Response("Commande introuvable", { status: 404, headers: cors });
    libelle = `Fill \xB7 ${c.unites} unit\xE9s suppl\xE9mentaires`;
    montant = Number(c.total);
    ref = `commande:${c.id}`;
  } else if (objet === "ouverture") {
    const { data: o } = await sb.from("organisation").select("id, formule, engagement_mois, statut").eq("id", id).single();
    const { data: f } = await sb.from("formule").select("nom, prix, unites, mise_en_place").eq("id", o?.formule).eq("offre_id", (await sb.rpc("offre_active")).data).single();
    if (!o || o.statut !== "a_activer" || !f) return new Response("Compte introuvable", { status: 404, headers: cors });
    const mep = o.engagement_mois >= 12 ? 0 : Number(f.mise_en_place);
    libelle = `Fill \xB7 formule ${f.nom}, premier mois (${f.unites} unit\xE9s)${mep ? " et mise en place" : ""}`;
    montant = Number(f.prix) + mep;
    ref = `ouverture:${o.id}`;
  } else return new Response("Objet inconnu", { status: 400, headers: cors });
  const site = SITE;
  const session = await stripe.checkout.sessions.create({
    mode: montant > 0 ? "payment" : "setup",
    currency: "eur",
    locale: "fr",
    customer_email: u.user.email,
    client_reference_id: ref,
    payment_method_types: ["card"],
    // carte, Apple Pay et Google Pay ; ajouter 'sepa_debit' une fois le prélèvement SEPA activé dans Stripe
    ...montant > 0 ? { line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(montant * 100), product_data: { name: libelle } } }] } : {},
    success_url: `${site}/#paiement-ok`,
    cancel_url: `${site}/#paiement-annule`
  });
  return new Response(JSON.stringify({ url: session.url }), { headers: { ...cors, "Content-Type": "application/json" } });
});
