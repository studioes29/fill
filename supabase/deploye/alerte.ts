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

// supabase/functions/_partage/courriel.ts
var LOGO = "https://fill.studioes.fr/assets/mail/fill.png";
var P = "margin:0 0 16px;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:#4A4540";
var gabarit = (c) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${c.titre}</title></head>
<body style="margin:0;padding:0;background:#F8F5F2">
<div style="display:none;max-height:0;overflow:hidden;color:#F8F5F2">${c.aper\u00E7u ?? c.texte[0] ?? ""}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F2"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td style="padding:0 8px 22px"><a href="https://fill.studioes.fr"><img src="${LOGO}" width="88" height="46" alt="Fill" style="display:block;border:0"></a></td></tr>
    <tr><td style="background:#FFFFFF;border-radius:22px;padding:40px 36px 34px">
      <div style="width:44px;height:4px;border-radius:2px;background:#B8A4FF;margin:0 0 22px"></div>
      <h1 style="margin:0 0 18px;font:700 26px/1.2 Arial,Helvetica,sans-serif;letter-spacing:-.4px;color:#1A1A1A">${c.titre}</h1>
      ${c.texte.map((t) => `<p style="${P}">${t}</p>`).join("\n      ")}
      ${c.bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 24px"><tr><td style="border-radius:999px;background:#1A1A1A"><a href="${c.bouton.lien}" style="display:inline-block;padding:16px 30px;font:700 16px Arial,Helvetica,sans-serif;color:#F8F5F2;text-decoration:none;border-radius:999px">${c.bouton.libelle}&nbsp;&nbsp;&rarr;</a></td></tr></table>` : ""}
      ${(c.apres ?? []).map((t) => `<p style="${P};font-size:14px;color:#6B6560">${t}</p>`).join("\n      ")}
      <p style="margin:26px 0 0;font:400 16px/1.5 Arial,Helvetica,sans-serif;color:#1A1A1A">Ewen Soupault<br><span style="color:#6B6560">Fill</span></p>
    </td></tr>
    <tr><td style="padding:22px 8px 0;font:400 13px/1.6 Arial,Helvetica,sans-serif;color:#8A847D">
      Fill, la communication externalis\xE9e des collectivit\xE9s et des entreprises, est un service de Studio ES.<br>
      <a href="mailto:contact@studioes.fr" style="color:#8A847D">contact@studioes.fr</a> \xB7 06 51 22 21 07 \xB7 <a href="https://fill.studioes.fr" style="color:#8A847D">fill.studioes.fr</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

// supabase/functions/alerte/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL"), CLE_PUBLIABLE, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return new Response("Connexion requise", { status: 401, headers: cors });
  const { organisation, motif, commande } = await req.json();
  const { data: o } = await sb.from("organisation").select("id, nom, type, formule, engagement_mois, siret, statut, creee, bon_commande").eq("id", organisation).single();
  const { data: p } = await sb.from("profil").select("nom, email, fonction, telephone").eq("id", u.user.id).single();
  if (!o || !p) return new Response("Rien \xE0 signaler", { status: 404, headers: cors });
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle) return new Response("Envoi non configur\xE9", { status: 503, headers: cors });
  const site = SITE;
  const envoyer = (corps) => fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" }, ...corps })
  });
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  if (motif === "bon_commande") {
    let quoi = "";
    if (commande) {
      const { data: c } = await sb.from("commande").select("unites, total, statut, bon_commande").eq("id", commande).single();
      if (!c || c.statut !== "a_valider" || !c.bon_commande) return new Response("Rien \xE0 signaler", { status: 404, headers: cors });
      quoi = `${c.unites} unit\xE9s suppl\xE9mentaires (${Number(c.total).toLocaleString("fr-FR")} \u20AC HT)`;
    } else {
      if (o.statut !== "a_activer" || !o.bon_commande) return new Response("Rien \xE0 signaler", { status: 404, headers: cors });
      quoi = `les premi\xE8res unit\xE9s de la formule ${o.formule}`;
    }
    const html2 = gabarit({
      titre: `Bon de commande re\xE7u : ${echap(o.nom)}`,
      texte: [`${echap(p.nom)} a d\xE9pos\xE9 le bon de commande sign\xE9 pour ${echap(quoi)}.`, "V\xE9rifiez-le puis cr\xE9ditez les unit\xE9s depuis le pilotage."],
      bouton: { libelle: "Ouvrir le pilotage", lien: `${site}/#pilotage` }
    });
    const r2 = await envoyer({ to: [{ email: pourFill }], replyTo: { email: p.email, name: p.nom }, subject: `Bon de commande re\xE7u : ${o.nom}`, htmlContent: html2 });
    return new Response(r2.ok ? "ok" : "Envoi refus\xE9", { status: r2.ok ? 200 : 502, headers: cors });
  }
  if (o.statut !== "a_activer") return new Response("Rien \xE0 signaler", { status: 404, headers: cors });
  if (Date.now() - new Date(o.creee).getTime() > 10 * 60 * 1e3) return new Response("D\xE9j\xE0 signal\xE9", { status: 409, headers: cors });
  const type = o.type === "collectivite" ? "Collectivit\xE9" : "Entreprise";
  const lignes = [
    ["Structure", `${o.nom} (${type})`],
    ["SIRET", o.siret ?? ""],
    ["Formule choisie", `${o.formule}, engagement ${o.engagement_mois} mois`],
    ["Interlocuteur", `${p.nom}${p.fonction ? `, ${p.fonction}` : ""}`],
    ["E-mail", p.email],
    ["T\xE9l\xE9phone", p.telephone ?? "non renseign\xE9"]
  ];
  const suite = o.type === "collectivite" ? "\xC0 rappeler pour caler le volume d\u2019unit\xE9s, puis envoyer le devis et le bon de commande. Les unit\xE9s se cr\xE9ditent depuis le pilotage, \xE0 r\xE9ception du bon sign\xE9." : "Les unit\xE9s se cr\xE9ditent seules au premier r\xE8glement en ligne. Un appel reste utile pour caler le volume.";
  const html = gabarit({
    titre: `Nouvelle inscription : ${echap(o.nom)}`,
    texte: [`<table style="border-collapse:collapse">${lignes.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6B6560">${k}</td><td style="padding:4px 0;color:#1A1A1A"><b>${echap(v)}</b></td></tr>`).join("")}</table>`, suite],
    bouton: { libelle: "Ouvrir le pilotage", lien: `${site}/#pilotage` }
  });
  const prenom = String(p.nom).split(" ")[0];
  const bienvenue = gabarit({
    titre: `Bienvenue, ${echap(prenom)}`,
    aper\u00E7u: "Votre espace Fill est ouvert.",
    texte: [
      `L\u2019espace de ${echap(o.nom)} est ouvert. Vous pouvez d\xE8s maintenant inviter vos coll\xE8gues (menu \xC9quipe) et d\xE9poser vos premi\xE8res demandes.`,
      o.type === "collectivite" ? "Je vous appelle sous 24 h ouvr\xE9es pour caler avec vous le volume d\u2019unit\xE9s, puis je vous envoie le devis et le bon de commande. D\xE9posez le bon sign\xE9 dans votre espace : vos unit\xE9s sont cr\xE9dit\xE9es d\xE8s sa validation, et la production de vos demandes d\xE9marre." : "Vos unit\xE9s sont cr\xE9dit\xE9es d\xE8s le premier r\xE8glement, \xE0 faire en ligne depuis l\u2019accueil de votre espace, et la production de vos demandes d\xE9marre. Je vous appelle aussi pour caler le volume avec vous."
    ],
    bouton: { libelle: "Ouvrir mon espace", lien: `${site}/` },
    apres: ["Pour vous connecter : votre adresse e-mail et le mot de passe choisi \xE0 l\u2019inscription. Une question ? R\xE9pondez simplement \xE0 ce message."]
  });
  const [r] = await Promise.all([
    envoyer({ to: [{ email: pourFill }], replyTo: { email: p.email, name: p.nom }, subject: `Nouvelle inscription : ${o.nom}`, htmlContent: html }),
    envoyer({ to: [{ email: p.email, name: p.nom }], replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" }, subject: "Votre espace Fill est ouvert", htmlContent: bienvenue })
  ]);
  return new Response(r.ok ? "ok" : "Envoi refus\xE9", { status: r.ok ? 200 : 502, headers: cors });
});
