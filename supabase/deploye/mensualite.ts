// Mensualités Fill (entreprises) : lien de paiement stable par organisation.
// Chaque organisation a sa date anniversaire (jour du premier paiement) : la période mensuelle va de ce jour
// au jour précédent du mois suivant ; le libellé technique « AAAA-MM » est le mois où la période commence.
// GET  ?o=<jeton>[&p=AAAA-MM|AAAA-Sss]  calcule la période due et redirige vers Stripe Checkout
//      (client_reference_id mensualite:<organisation>:<période>, metadata type fill-mensualite),
//      ou vers la page fill.studioes.fr/reglement/ si rien n'est à régler.
// POST {action:"reglee", resultat}       (clé serveur, appelé par stripe-webhook) : prévient Fill
// POST {action:"attente", organisations:[{id, periode}], toujours:[{id, periode}]} (jeton pilote, appelé chaque jour
//      par traiter_echeances quand une période s'ouvre sans être réglée) : récapitulatif à Fill
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
const ESPACE = (Deno.env.get("SITE_URL") ?? "https://fill.studioes.fr/espace").replace(/\/$/, "");
const PAGE = "https://fill.studioes.fr/reglement/";
const LIEN = `${URL_SB}/functions/v1/mensualite`;
const ORIGINES = ["https://fill.studioes.fr", "https://www.fill.studioes.fr"];
const sb = createClient(URL_SB, CLE_SECRETE, { auth: { persistSession: false } });

const cors = (req: Request) => {
  const o = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINES.includes(o) ? o : ORIGINES[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  };
};

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const iso = (d: Date) => d.toISOString().slice(0, 10);
const jourMois = (s: string) => { const d = new Date(s + "T12:00:00Z"); return `${d.getUTCDate() === 1 ? "1er" : d.getUTCDate()} ${MOIS[d.getUTCMonth()]}`; };
const ajouter = (s: string, n: number) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const dernier = (an: number, mo: number) => new Date(Date.UTC(an, mo, 0)).getUTCDate();
const echeance = (anc: string | null | undefined, an: number, mo: number) =>
  `${an}-${String(mo).padStart(2, "0")}-${String(Math.min(anc ? +anc.slice(8, 10) : 1, dernier(an, mo))).padStart(2, "0")}`;
// premier et dernier jour d'une période, à partir de la date anniversaire (sans ancre : mois calendaire, semaine ISO)
const bornes = (p: string, anc?: string | null) => {
  const s = /^(\d{4})-S(\d{2})$/.exec(p);
  if (s) {
    const j4 = new Date(Date.UTC(+s[1], 0, 4));
    const lundi = new Date(j4);
    lundi.setUTCDate(j4.getUTCDate() - ((j4.getUTCDay() + 6) % 7) + (+s[2] - 1) * 7);
    const decal = anc ? (new Date(anc + "T12:00:00Z").getUTCDay() + 6) % 7 : 0;
    const debut = ajouter(iso(lundi), decal);
    return { debut, fin: ajouter(debut, 6), semaine: true };
  }
  const [a, m] = p.split("-").map(Number);
  const debut = echeance(anc, a, m);
  const fin = ajouter(m === 12 ? echeance(anc, a + 1, 1) : echeance(anc, a, m + 1), -1);
  return { debut, fin, semaine: false };
};
const duAu = (debut: string, fin: string) =>
  `du ${jourMois(debut)}${debut.slice(0, 4) !== fin.slice(0, 4) ? ` ${debut.slice(0, 4)}` : ""} au ${jourMois(fin)} ${fin.slice(0, 4)}`;
const libellePeriode = (p: string, b?: { debut?: string | null; fin?: string | null; anniversaire?: string | null }) => {
  if (!/^\d{4}-(\d{2}|S\d{2})$/.test(p)) return p;
  const x = b?.debut && b?.fin ? { debut: b.debut, fin: b.fin, semaine: /S/.test(p) } : bornes(p, b?.anniversaire);
  return `${x.semaine ? "semaine" : "période"} ${duAu(x.debut, x.fin)}`;
};
const euros = (n: number) => `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n)} €`;
const echap = (t: unknown) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const vers = (etat: string, extra: Record<string, string> = {}) =>
  new Response(null, { status: 302, headers: { Location: `${PAGE}?${new URLSearchParams({ etat, ...extra })}`, "Cache-Control": "no-store" } });

const P = "margin:0 0 16px;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:#4A4540";
const gabarit = (c: { titre: string; texte: string[]; bouton?: { libelle: string; lien: string } }) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${c.titre}</title></head>
<body style="margin:0;padding:0;background:#F8F5F2">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F2"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
    <tr><td style="padding:0 8px 22px"><img src="https://fill.studioes.fr/assets/mail/fill.png" width="88" height="46" alt="Fill" style="display:block;border:0"></td></tr>
    <tr><td style="background:#FFFFFF;border-radius:22px;padding:36px 32px 30px">
      <h1 style="margin:0 0 18px;font:700 24px/1.25 Arial,Helvetica,sans-serif;color:#1A1A1A">${c.titre}</h1>
      ${c.texte.map((t) => `<p style="${P}">${t}</p>`).join("\n      ")}
      ${c.bouton ? `<p style="margin:24px 0 0"><a href="${c.bouton.lien}" style="display:inline-block;padding:14px 26px;font:700 15px Arial,Helvetica,sans-serif;color:#F8F5F2;background:#1A1A1A;text-decoration:none;border-radius:999px">${c.bouton.libelle}</a></p>` : ""}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

const envoyer = async (sujet: string, titre: string, texte: string[], bouton?: { libelle: string; lien: string }) => {
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle) return false;
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
      to: [{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }],
      subject: sujet,
      htmlContent: gabarit({ titre, texte, bouton }),
    }),
  });
  return r.ok;
};

const referent = async (org: string) =>
  (await sb.from("profil").select("nom, email").eq("organisation_id", org).eq("role", "referent").eq("actif", true).limit(1).maybeSingle()).data;

Deno.serve(async (req) => {
  const h = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: h });
  const url = new URL(req.url);

  if (req.method === "GET") {
    const jeton = (url.searchParams.get("o") ?? "").trim();
    const p = url.searchParams.get("p");
    if (!/^[0-9a-f]{20,64}$/.test(jeton)) return vers("invalide");
    if (p && !/^\d{4}-(\d{2}|S\d{2})$/.test(p)) return vers("invalide");
    const { data: d, error } = await sb.rpc("mensualite_a_regler", { p_jeton: jeton, p_periode: p ?? null });
    if (error || !d) return vers("erreur");
    if (d.etat === "inconnu" || d.etat === "periode_invalide") return vers("invalide");
    if (d.etat === "reglee") return vers("deja", { p: d.periode, ...(d.debut ? { du: d.debut, au: d.fin } : {}) });
    if (d.etat === "collectivite") return vers("collectivite");
    if (d.etat === "ouverture") return vers("ouverture");
    if (d.etat !== "a_regler") return vers("rien");
    const cleStripe = Deno.env.get("STRIPE_SECRET_KEY");
    if (!cleStripe) return vers("erreur");
    const stripe = new Stripe(cleStripe);
    const periode = String(d.periode);
    const lib = libellePeriode(periode, d);
    const quoi = d.semaine ? `Relais, ${lib}` : `formule ${d.formule}, ${lib}`;
    const ref = await referent(d.organisation);
    const meta = { type: "fill-mensualite", organisation: String(d.organisation), periode };
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        currency: "eur",
        locale: "fr",
        payment_method_types: ["card"],
        ...(ref?.email ? { customer_email: ref.email } : {}),
        client_reference_id: `mensualite:${d.organisation}:${periode}`,
        metadata: meta,
        payment_intent_data: { metadata: meta, description: `Fill · ${d.nom} · ${quoi}` },
        line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(Number(d.montant) * 100), product_data: { name: `Fill · ${quoi}`, description: `${d.nom} · ${d.unites} unités` } } }],
        submit_type: "pay",
        success_url: `${PAGE}?etat=merci&p=${encodeURIComponent(periode)}${d.debut ? `&du=${d.debut}&au=${d.fin}` : ""}`,
        cancel_url: `${PAGE}?etat=annule&o=${encodeURIComponent(jeton)}`,
      });
      return new Response(null, { status: 302, headers: { Location: session.url!, "Cache-Control": "no-store" } });
    } catch (e) {
      console.error("checkout", e);
      return vers("erreur");
    }
  }

  if (req.method !== "POST") return new Response("Méthode non prise en charge", { status: 405, headers: h });
  const auth = req.headers.get("Authorization") ?? "";
  const corps = await req.json().catch(() => ({}));

  if (corps.action === "reglee") {
    if (!CLE_SECRETE || auth !== `Bearer ${CLE_SECRETE}`) return new Response("Accès refusé", { status: 403, headers: h });
    const r = corps.resultat ?? {};
    const nom = r.nom ?? "structure inconnue";
    const per = r.periode ? libellePeriode(String(r.periode), r) : "période inconnue";
    const texte = [
      `<b>${echap(nom)}</b> a réglé ${r.montant != null ? euros(Number(r.montant)) : "sa mensualité"} par carte pour la ${echap(per)}.`,
      r.doublon
        ? "Attention : cette période était déjà réglée. Ce second paiement est à rembourser depuis Stripe."
        : r.credite > 0
          ? `${r.credite} unités créditées dans l’espace.`
          : r.credit_le || r.credit_au_1er
            ? `Les unités de cette période seront créditées ${r.credit_le ? `le ${jourMois(String(r.credit_le))}` : "à son premier jour"}, date de son échéance.`
            : r.nouveau === false ? "Paiement déjà enregistré (notification en double)." : "Unités déjà présentes sur l’espace pour cette période.",
      "Pensez à marquer la facture correspondante comme payée dans Indy.",
    ];
    if (r.sans_organisation) texte.splice(0, 2, `Paiement Fill reçu sans organisation rattachée (session ${echap(r.session)}, ${r.montant != null ? euros(Number(r.montant)) : ""}). À rattacher à la main.`);
    if (r.nouveau === false && !r.doublon) return new Response("ok", { headers: h });
    const ok = await envoyer(`Mensualité Fill réglée : ${nom} (${per})`, `Mensualité réglée : ${echap(nom)}`, texte, { libelle: "Ouvrir les règlements", lien: `${ESPACE}/admin-virements.html` });
    return new Response(ok ? "ok" : "Envoi refusé", { status: ok ? 200 : 502, headers: h });
  }

  if (corps.action === "attente") {
    const jeton = auth.replace(/^Bearer\s+/i, "");
    const { data: valide } = await sb.rpc("verifier_jeton_pilote", { p: jeton });
    if (!valide && !(CLE_SECRETE && jeton === CLE_SECRETE)) return new Response("Accès refusé", { status: 403, headers: h });
    // ancien format : liste d'identifiants et une période commune ; nouveau : [{id, periode}]
    const liste = (l: unknown) => (Array.isArray(l) ? l : []).map((x: any) => typeof x === "string" ? { id: x, periode: String(corps.periode ?? "") } : { id: String(x?.id ?? ""), periode: String(x?.periode ?? "") }).filter((x) => x.id);
    const nouvelles = liste(corps.organisations), toujours = liste(corps.toujours);
    if (!nouvelles.length) return new Response("Rien à signaler", { headers: h });
    const tous = [...nouvelles, ...toujours];
    const { data: orgs } = await sb.from("organisation").select("id, nom, formule, jeton_paiement, anniversaire").in("id", tous.map((x) => x.id));
    const { data: offre } = await sb.rpc("offre_active");
    const { data: formules } = await sb.from("formule").select("id, nom, prix").eq("offre_id", offre);
    const ligne = async (x: { id: string; periode: string }) => {
      const o = (orgs ?? []).find((y) => y.id === x.id);
      if (!o) return null;
      const f = (formules ?? []).find((y) => y.id === o.formule);
      const ref = await referent(o.id);
      const lien = `${LIEN}?o=${o.jeton_paiement}`;
      return `<b>${echap(o.nom)}</b> · ${echap(f?.nom ?? o.formule)}${f ? `, ${euros(Number(f.prix))}` : ""} · ${echap(libellePeriode(x.periode, { anniversaire: o.anniversaire }))}${ref ? ` · ${echap(ref.nom)}, <a href="mailto:${echap(ref.email)}">${echap(ref.email)}</a>` : ""}<br>Lien de paiement à renvoyer : <a href="${lien}">${lien}</a>`;
    };
    const L1 = (await Promise.all(nouvelles.map(ligne))).filter(Boolean) as string[];
    const L2 = (await Promise.all(toujours.map(ligne))).filter(Boolean) as string[];
    const noms = nouvelles.map((x) => (orgs ?? []).find((y) => y.id === x.id)?.nom).filter(Boolean).join(", ");
    const ok = await envoyer(
      `Mensualités en attente : ${noms}`,
      "Échéance du jour non réglée",
      [
        "La période de ces entreprises commence aujourd’hui, à leur date anniversaire, sans que la mensualité soit réglée : leurs unités de la période ne sont pas créditées (les reports et les unités supplémentaires restent disponibles).",
        ...L1,
        ...(L2.length ? ["<b>Toujours en attente</b> (période déjà commencée) :", ...L2] : []),
        "Dès le paiement par carte, les unités sont créditées seules. Pour un virement reçu, marquez-le dans l’écran des règlements.",
      ],
      { libelle: "Ouvrir les règlements", lien: `${ESPACE}/admin-virements.html` },
    );
    return new Response(ok ? "ok" : "Envoi refusé", { status: ok ? 200 : 502, headers: h });
  }

  return new Response("Action inconnue", { status: 400, headers: h });
});
