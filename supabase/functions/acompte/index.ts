// Acomptes Studio ES : une seule page de paiement pour tous les dossiers (plus de lien Stripe par total).
// POST {action:"creer"|"virement", dossier, devis, structure, nom, email, total, particulier, demarrage_anticipe, retour}
// GET  ?session=cs_...  -> état du paiement pour la page de retour du dossier
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ORIGINES = ["https://dossiers.studioes.fr", "https://studioes.fr"];
const cors = (req: Request) => {
  const o = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINES.includes(o) ? o : ORIGINES[0],
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
};
const json = (req: Request, d: unknown, status = 200) =>
  new Response(JSON.stringify(d), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
const net = (s: unknown, n = 200) => String(s ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);
const euros = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + " €";

async function courriel(a: { email: string; name?: string }[], sujet: string, titre: string, texte: string[], bouton?: { libelle: string; lien: string }, repondreA?: { email: string; name?: string }) {
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle || !a.length) return;
  const P = "margin:0 0 16px;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:#3D3A36";
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titre}</title></head><body style="margin:0;background:#F0EEE9"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0EEE9"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px"><tr><td style="padding:0 8px 18px;font:800 20px Arial,Helvetica,sans-serif;color:#141414">Studio ES</td></tr><tr><td style="background:#FFFFFF;border-radius:22px;padding:36px 32px 30px"><h1 style="margin:0 0 18px;font:700 24px/1.2 Arial,Helvetica,sans-serif;color:#141414">${titre}</h1>${texte.map((t) => `<p style="${P}">${t}</p>`).join("")}${bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px"><tr><td style="border-radius:999px;background:#141414"><a href="${bouton.lien}" style="display:inline-block;padding:15px 28px;font:700 15px Arial,Helvetica,sans-serif;color:#F0EEE9;text-decoration:none">${bouton.libelle}</a></td></tr></table>` : ""}<p style="margin:24px 0 0;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:#141414">Ewen Soupault<br><span style="color:#6B6560">Studio ES</span></p></td></tr><tr><td style="padding:18px 8px 0;font:400 13px/1.6 Arial,Helvetica,sans-serif;color:#8A847D">Studio ES, photographie et web en Bretagne · <a href="https://studioes.fr" style="color:#8A847D">studioes.fr</a> · <a href="mailto:contact@studioes.fr" style="color:#8A847D">contact@studioes.fr</a></td></tr></table></td></tr></table></body></html>`;
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Studio ES", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
      to: a, replyTo: repondreA ?? { email: "contact@studioes.fr", name: "Ewen Soupault, Studio ES" },
      subject: sujet, htmlContent: html,
    }),
  }).catch(() => null);
}

async function confirmerAcompte(sb: ReturnType<typeof createClient>, sessionId: string, montantPaye?: number) {
  const { data: a } = await sb.from("acompte").update({ statut: "paye", paye_le: new Date().toISOString() })
    .eq("stripe_session", sessionId).eq("statut", "en_attente").select("*").maybeSingle();
  if (!a) return null;
  const m = Number(montantPaye ?? a.montant);
  const lienDossier = a.dossier ? `https://dossiers.studioes.fr/${a.dossier}/` : "https://studioes.fr";
  await courriel([{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }],
    `Acompte reçu : ${a.structure || a.nom} (${euros(m)})`,
    `Acompte reçu : ${net(a.structure || a.nom)}`,
    [`${euros(m)} payés par carte pour le devis n° ${net(a.devis)} (total ponctuel ${euros(Number(a.total_ponctuel))}).`,
     `Client : ${net(a.nom)} &lt;${net(a.email)}&gt;${a.particulier ? ", particulier (démarrage anticipé demandé)" : ""}.`,
     "À faire : émettre la facture d'acompte sur Indy avec ce numéro de devis, puis lancer l'accueil depuis Hors-champ."],
    { libelle: "Ouvrir le dossier", lien: lienDossier }, a.email ? { email: a.email, name: a.nom } : undefined);
  if (a.email) await courriel([{ email: a.email, name: a.nom ?? undefined }],
    `Acompte bien reçu, devis n° ${a.devis}`,
    "Votre acompte est bien reçu",
    [`Bonjour${a.nom ? " " + net(String(a.nom).split(" ")[0]) : ""},`,
     `Votre acompte de ${euros(m)} pour le devis n° ${net(a.devis)} est bien reçu : la commande est ferme.`,
     "La facture d'acompte vous parvient sous 24 h. Je reviens vers vous pour caler le démarrage ; vous pouvez aussi choisir directement un créneau de 30 minutes."],
    { libelle: "Choisir un créneau", lien: "https://cal.com/studioes/30min" });
  return a;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, CLE_SECRETE, { auth: { persistSession: false } });
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const session = url.searchParams.get("session") ?? "";
    if (!/^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(session)) return json(req, { erreur: "Session invalide" }, 400);
    let { data: a } = await sb.from("acompte").select("devis, structure, montant, statut, dossier").eq("stripe_session", session).maybeSingle();
    if (!a) return json(req, { statut: "inconnu" }, 404);
    if (a.statut === "en_attente") {
      try {
        const s = await stripe.checkout.sessions.retrieve(session);
        if (s.payment_status === "paid") { await confirmerAcompte(sb, session, (s.amount_total ?? 0) / 100); a = { ...a, statut: "paye" }; }
      } catch { /* reste en attente */ }
    }
    return json(req, { statut: a.statut, devis: a.devis, structure: a.structure, montant: Number(a.montant) });
  }

  if (req.method !== "POST") return json(req, { erreur: "Méthode" }, 405);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json(req, { erreur: "Requête illisible" }, 400); }
  const action = String(b.action ?? "creer");
  const total = Math.round(Number(b.total) * 100) / 100;
  const devis = net(b.devis, 40), dossier = net(b.dossier, 80), structure = net(b.structure, 160), nom = net(b.nom, 120);
  const email = net(b.email, 160).toLowerCase();
  const particulier = Boolean(b.particulier);
  if (!devis || !/^[a-z0-9][a-z0-9-]{1,79}$/.test(dossier)) return json(req, { erreur: "Dossier ou devis manquant" }, 400);
  if (!(total >= 50 && total <= 30000)) return json(req, { erreur: "Montant hors limites" }, 400);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(req, { erreur: "E-mail invalide" }, 400);
  if (particulier && !b.demarrage_anticipe) return json(req, { erreur: "La demande de démarrage avant la fin du délai de rétractation doit être cochée" }, 400);
  const montant = Math.round(total * 30) / 100;

  const { data: dejaPaye } = await sb.from("acompte").select("id").eq("devis", devis).eq("statut", "paye").limit(1).maybeSingle();
  if (dejaPaye) return json(req, { erreur: "L'acompte de ce devis est déjà réglé" }, 409);

  if (action === "virement") {
    const { data: a, error } = await sb.from("acompte").insert({ devis, dossier, structure, nom, email, particulier, total_ponctuel: total, montant, mode: "virement" }).select("*").single();
    if (error) return json(req, { erreur: "Enregistrement impossible" }, 500);
    await courriel([{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }],
      `Acompte par virement demandé : ${structure || nom} (${euros(montant)})`,
      `Acompte par virement : ${structure || nom}`,
      [`Devis n° ${devis} accepté, total ponctuel ${euros(total)}, acompte de ${euros(montant)} à régler par virement.`,
       `Client : ${nom} &lt;${email}&gt;${particulier ? ", particulier" : ""}.`,
       "À faire sous 24 h : envoyer la facture d'acompte Indy (elle porte le RIB). La commande est ferme à réception du virement."],
      { libelle: "Ouvrir le dossier", lien: `https://dossiers.studioes.fr/${dossier}/` }, email ? { email, name: nom } : undefined);
    return json(req, { ok: true, montant, id: a.id });
  }

  let retour = String(b.retour ?? `https://dossiers.studioes.fr/${dossier}/`);
  if (!retour.startsWith("https://dossiers.studioes.fr/")) retour = `https://dossiers.studioes.fr/${dossier}/`;
  const [base, frag] = retour.split("#");
  const sep = base.includes("?") ? "&" : "?";
  const succes = `${base}${sep}paye={CHECKOUT_SESSION_ID}${frag ? "#" + frag : ""}`;
  const annule = `${base}${frag ? "#" + frag : ""}`;

  const { data: a, error } = await sb.from("acompte").insert({ devis, dossier, structure, nom, email, particulier, total_ponctuel: total, montant }).select("id").single();
  if (error) return json(req, { erreur: "Enregistrement impossible" }, 500);
  const session = await stripe.checkout.sessions.create({
    mode: "payment", locale: "fr", currency: "eur",
    payment_method_types: ["card"],
    ...(email ? { customer_email: email } : {}),
    client_reference_id: `acompte:${a.id}`,
    line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(montant * 100), product_data: { name: `Acompte de 30 %, devis n° ${devis}`, description: `${structure || nom}. Commande ferme selon le devis Studio ES accepté en ligne.` } } }],
    metadata: { type: "acompte", acompte: a.id, devis, dossier },
    payment_intent_data: { description: `Acompte 30 %, devis ${devis}, dossier ${dossier}`, metadata: { type: "acompte", devis, dossier } },
    consent_collection: { terms_of_service: "required" },
    custom_text: { terms_of_service_acceptance: { message: particulier
      ? "J'accepte le devis et les [conditions générales de Studio ES](https://studioes.fr/conditions/), et je demande que la prestation commence avant la fin du délai de rétractation."
      : "J'accepte le devis et les [conditions générales de Studio ES](https://studioes.fr/conditions/) : la commande est ferme." } },
    submit_type: "pay",
    success_url: succes, cancel_url: annule,
    expires_at: Math.floor(Date.now() / 1000) + 3600 * 23,
  });
  await sb.from("acompte").update({ stripe_session: session.id }).eq("id", a.id);
  return json(req, { url: session.url, montant });
});
