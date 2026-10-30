// Cartes cadeaux Pierceval Tattoo : la carte n'existe qu'une fois le paiement confirmé par Stripe,
// au montant réellement payé. Vérification et passage en « utilisée » avec le code du salon.
// POST {action:"creer", amount, pour, de, msg, email}              -> {url}
// GET  ?action=verify-gift&session=cs_...                        -> {ok, code, amount, pour, de, msg, date, until}
// GET  ?action=gift-check&code=PT-XXXX-XXXX                       -> {found, paid, used, amount, pour, date}
// POST {action:"gift-check", code, pin}                           -> {ok} (marque utilisée)
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SITE = "https://piercevaltattoo.fr";
const cors = {
  "Access-Control-Allow-Origin": SITE,
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { ...cors, "Content-Type": "application/json" } });
const net = (s: unknown, n = 120) => String(s ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);
const nouveauCode = () => {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (const x of crypto.getRandomValues(new Uint32Array(8))) s += A[x % A.length];
  return `PT-${s.slice(0, 4)}-${s.slice(4)}`;
};

async function prevenirSalon(c: Record<string, unknown>) {
  const cle = Deno.env.get("BREVO_API_KEY");
  const salon = Deno.env.get("PIERCEVAL_EMAIL") ?? "piercevaltattoo@gmail.com";
  if (!cle) return;
  const t = `Carte n° ${c.code}, ${c.montant} €, pour ${net(c.beneficiaire)}${c.offert_par ? `, de la part de ${net(c.offert_par)}` : ""}. Valable jusqu'au ${new Date(String(c.expire_le)).toLocaleDateString("fr-FR")}. Paiement confirmé par Stripe.`;
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Site Pierceval Tattoo", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
      to: [{ email: salon }],
      subject: `Carte cadeau vendue : ${c.montant} € (${c.code})`,
      textContent: `${t}\n\nVérification au studio : ${SITE}/verifier.html`,
    }),
  }).catch(() => null);
}

async function confirmer(sb: ReturnType<typeof createClient>, stripe: Stripe, session: string) {
  const { data: c } = await sb.from("carte_cadeau").select("*").eq("stripe_session", session).maybeSingle();
  if (!c) return null;
  if (c.statut !== "en_attente") return c;
  const s = await stripe.checkout.sessions.retrieve(session);
  if (s.payment_status !== "paid") return c;
  const paye = (s.amount_total ?? 0) / 100;
  const expire = new Date();
  expire.setFullYear(expire.getFullYear() + 1);
  const { data: v } = await sb.from("carte_cadeau")
    .update({ statut: "valide", montant: paye, payee_le: new Date().toISOString(), expire_le: expire.toISOString().slice(0, 10) })
    .eq("id", c.id).eq("statut", "en_attente").select("*").maybeSingle();
  if (v) await prevenirSalon(v);
  return v ?? c;
}

async function tropDEssais(sb: ReturnType<typeof createClient>, req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  const depuis = new Date(Date.now() - 3600e3).toISOString();
  const { count } = await sb.from("verification_essai").select("id", { count: "exact", head: true }).eq("ip", ip).gte("date", depuis);
  await sb.from("verification_essai").insert({ ip });
  return (count ?? 0) >= 20;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, CLE_SECRETE, { auth: { persistSession: false } });
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const action = url.searchParams.get("action");
    if (action === "verify-gift") {
      const session = url.searchParams.get("session") ?? "";
      if (!/^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(session)) return json({ ok: false }, 400);
      const c = await confirmer(sb, stripe, session).catch(() => null);
      if (!c || c.statut === "en_attente") return json({ ok: false, statut: c ? "en_attente" : "inconnue" });
      return json({ ok: true, code: c.code, amount: Number(c.montant), pour: c.beneficiaire, de: c.offert_par, msg: c.message,
        date: Math.floor(new Date(c.payee_le).getTime() / 1000), until: c.expire_le });
    }
    if (action === "gift-check") {
      if (await tropDEssais(sb, req)) return json({ erreur: "Trop d'essais, réessayez dans une heure" }, 429);
      const code = net(url.searchParams.get("code"), 20).toUpperCase();
      const { data: c } = await sb.from("carte_cadeau").select("*").eq("code", code).maybeSingle();
      if (!c || c.statut === "en_attente" || c.statut === "annulee") return json({ found: false });
      return json({ found: true, paid: true, used: c.utilisee_le ? new Date(c.utilisee_le).toLocaleDateString("fr-FR") : null,
        amount: Number(c.montant), pour: c.beneficiaire, date: Math.floor(new Date(c.payee_le).getTime() / 1000), until: c.expire_le,
        expired: c.expire_le && new Date(c.expire_le) < new Date() });
    }
    return json({ erreur: "Action inconnue" }, 400);
  }

  if (req.method !== "POST") return json({ erreur: "Méthode" }, 405);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ erreur: "Requête illisible" }, 400); }

  if (b.action === "gift-check") {
    if (await tropDEssais(sb, req)) return json({ ok: false, erreur: "Trop d'essais" }, 429);
    const pin = Deno.env.get("CODE_SALON");
    if (!pin || String(b.pin ?? "") !== pin) return json({ ok: false, erreur: "Code du studio incorrect" }, 403);
    const code = net(b.code, 20).toUpperCase();
    const { data } = await sb.from("carte_cadeau").update({ statut: "utilisee", utilisee_le: new Date().toISOString() })
      .eq("code", code).eq("statut", "valide").select("id").maybeSingle();
    return json({ ok: Boolean(data) });
  }

  const montant = Math.round(Number(b.amount));
  if (!(montant >= 20 && montant <= 1000)) return json({ erreur: "Montant de 20 à 1 000 €" }, 400);
  const pour = net(b.pour, 80), de = net(b.de, 80), msg = net(b.msg, 160), email = net(b.email, 160).toLowerCase();
  if (!pour) return json({ erreur: "Indiquez à qui vous l'offrez" }, 400);
  const code = nouveauCode();
  const { data: c, error } = await sb.from("carte_cadeau").insert({ code, montant, beneficiaire: pour, offert_par: de || null, message: msg || null, email: email || null }).select("id").single();
  if (error) return json({ erreur: "Enregistrement impossible" }, 500);
  const session = await stripe.checkout.sessions.create({
    mode: "payment", locale: "fr", payment_method_types: ["card"],
    ...(email ? { customer_email: email } : {}),
    client_reference_id: `carte:${c.id}`,
    line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: montant * 100, product_data: { name: "Carte cadeau Pierceval Tattoo", description: `Pour ${pour}. Valable un an pour un tatouage ou un piercing au studio, 67 rue Jean-Jaurès, 29390 Scaër. Nominative, non remboursable.` } } }],
    metadata: { type: "carte-cadeau-v2", carte: c.id, client: "Pierceval Tattoo" },
    payment_intent_data: { description: `Carte cadeau Pierceval ${code} (encaissée par Studio ES pour le compte de Pierceval Tattoo)`, statement_descriptor_suffix: "PIERCEVAL", metadata: { type: "carte-cadeau-v2", client: "Pierceval Tattoo" } },
    custom_text: { submit: { message: "Carte cadeau valable au studio Pierceval Tattoo, 67 rue Jean-Jaurès, 29390 Scaër. Paiement encaissé par Studio ES pour le compte de Pierceval Tattoo. Votre carte et son numéro s'affichent sur le site juste après le paiement." } },
    submit_type: "pay",
    success_url: `${SITE}/?cadeau=ok&session={CHECKOUT_SESSION_ID}#cadeau`,
    cancel_url: `${SITE}/#cadeau`,
    expires_at: Math.floor(Date.now() / 1000) + 3600 * 2,
  });
  await sb.from("carte_cadeau").update({ stripe_session: session.id }).eq("id", c.id);
  return json({ url: session.url });
});
