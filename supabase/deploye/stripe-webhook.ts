// Webhook Stripe unique du compte Studio ES.
// Trie chaque paiement par sa référence : Fill (commande:, ouverture:, mensualite:), acompte Studio ES (acompte:),
// carte cadeau Pierceval (carte:). Seuls les paiements Fill créditent des unités.
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL")!;
const sb = createClient(URL_SB, CLE_SECRETE);

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
  let evt;
  try {
    evt = await stripe.webhooks.constructEventAsync(await req.text(), req.headers.get("stripe-signature")!, Deno.env.get("STRIPE_WEBHOOK_SECRET")!);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }
  if (evt.type === "checkout.session.completed" || evt.type === "checkout.session.async_payment_succeeded") {
    const s = evt.data.object as Stripe.Checkout.Session;
    if (s.payment_status === "unpaid" && s.mode === "payment") return new Response("ok");
    const [objet, id, periode] = (s.client_reference_id ?? "").split(":");

    if (objet === "commande" || objet === "ouverture") {
      if (objet === "commande") await sb.rpc("commande_payee", { p_commande: id, p_session: s.id });
      if (objet === "ouverture") await sb.rpc("activer_organisation", { p_organisation: id });
      await fetch(`${URL_SB}/functions/v1/notifier`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CLE_SECRETE}`, "Content-Type": "application/json" },
        body: JSON.stringify({ evenement: "paiement", ...(objet === "commande" ? { commande: id } : { organisation: id }) }),
      }).catch(() => null);
    } else if (objet === "mensualite" || s.metadata?.type === "fill-mensualite") {
      // Mensualité Fill (entreprise) payée avec le lien personnel de l'organisation
      const org = objet === "mensualite" ? id : s.metadata?.organisation;
      const per = objet === "mensualite" ? periode : s.metadata?.periode;
      const montant = (s.amount_total ?? 0) / 100;
      let resultat: Record<string, unknown>;
      if (org && per) {
        const { data, error } = await sb.rpc("mensualite_payee", { p_organisation: org, p_periode: per, p_session: s.id, p_montant: montant });
        if (error) {
          console.error("mensualite_payee", error);
          return new Response("Enregistrement impossible", { status: 500 }); // Stripe renverra l'événement
        }
        resultat = data;
      } else {
        // ancien lien générique, sans organisation : Fill rattache le paiement à la main
        resultat = { sans_organisation: true, session: s.id, montant, nouveau: true };
      }
      await fetch(`${URL_SB}/functions/v1/mensualite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CLE_SECRETE}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reglee", resultat }),
      }).catch(() => null);
    } else if (objet === "acompte" || s.metadata?.type === "acompte") {
      await fetch(`${URL_SB}/functions/v1/acompte?session=${encodeURIComponent(s.id)}`).catch(() => null);
    } else if (objet === "carte" || s.metadata?.type === "carte-cadeau-v2") {
      await fetch(`${URL_SB}/functions/v1/carte-cadeau?action=verify-gift&session=${encodeURIComponent(s.id)}`).catch(() => null);
    }
  }
  return new Response("ok");
});
