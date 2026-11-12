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
var POLICE = "Arial,Helvetica,sans-serif";
var TITRES = "'Bricolage Grotesque',Arial,Helvetica,sans-serif";
var P = `margin:0 0 16px;font:400 16px/1.6 ${POLICE};color:#2E2A27`;
var P2 = `margin:0 0 14px;font:400 15px/1.6 ${POLICE};color:#4A4540`;
var encart = (e) => e ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px"><tr><td style="background:#F1ECFF;border-radius:14px;padding:16px 18px">
        ${e.titre ? `<p style="margin:0 0 4px;font:700 13px/1.4 ${POLICE};letter-spacing:.04em;text-transform:uppercase;color:#5B3F9C">${e.titre}</p>` : ""}
        <p style="margin:0;font:400 16px/1.55 ${POLICE};color:#1A1A1A">${e.texte}</p>
      </td></tr></table>` : "";
var etapes = (l) => l?.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px">
        ${l.map((x, i) => `<tr>
          <td width="40" valign="top" style="padding:0 0 18px"><div style="width:30px;height:30px;border-radius:15px;background:${i % 2 ? "#FFE1D8" : "#E6DDFF"};color:#1A1A1A;font:700 15px/30px ${POLICE};text-align:center">${i + 1}</div></td>
          <td valign="top" style="padding:3px 0 18px">
            <p style="margin:0;font:700 16px/1.45 ${POLICE};color:#1A1A1A">${x.titre}</p>
            ${x.texte ? `<p style="margin:4px 0 0;font:400 15px/1.6 ${POLICE};color:#4A4540">${x.texte}</p>` : ""}
          </td></tr>`).join("")}
      </table>` : "";
var gabarit = (c) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${c.titre}</title>
<style>@font-face{font-family:'Bricolage Grotesque';font-weight:700;src:url(https://fill.studioes.fr/espace/assets/br-Cre6nC2_.woff2) format('woff2')}a{color:#5B3F9C}</style></head>
<body style="margin:0;padding:0;background:#F8F5F2">
<div style="display:none;max-height:0;overflow:hidden;color:#F8F5F2">${c.aper\u00E7u ?? c.texte[0] ?? ""}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F2"><tr><td align="center" style="padding:28px 14px 36px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td style="padding:0 6px 20px"><a href="https://fill.studioes.fr"><img src="${LOGO}" width="88" height="46" alt="Fill" style="display:block;border:0"></a></td></tr>
    <tr><td style="background:#FFFFFF;border-radius:22px;overflow:hidden">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="50%" style="height:6px;background:#B8A4FF;font-size:0;line-height:0">&nbsp;</td><td width="50%" style="height:6px;background:#FF8A6B;font-size:0;line-height:0">&nbsp;</td></tr></table>
      <div style="padding:32px 28px 30px">
      <h1 style="margin:0 0 18px;font:700 27px/1.2 ${TITRES};letter-spacing:-.4px;color:#1A1A1A">${c.titre}</h1>
      ${c.texte.map((t) => `<p style="${P}">${t}</p>`).join("\n      ")}
      ${etapes(c.etapes)}
      ${encart(c.encart)}
      ${c.bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 26px"><tr><td style="border-radius:999px;background:#1A1A1A"><a href="${c.bouton.lien}" style="display:inline-block;padding:16px 30px;font:700 16px ${POLICE};color:#F8F5F2;text-decoration:none;border-radius:999px">${c.bouton.libelle}&nbsp;&nbsp;&rarr;</a></td></tr></table>` : ""}
      ${(c.apres ?? []).map((t) => `<p style="${P2}">${t}</p>`).join("\n      ")}
      <p style="margin:24px 0 0;padding-top:18px;border-top:1px solid #EFEAE4;font:400 16px/1.5 ${POLICE};color:#1A1A1A">Ewen Soupault<br><span style="color:#6B6560;font-size:15px">Fill</span></p>
      </div>
    </td></tr>
    <tr><td style="padding:20px 6px 0;font:400 13px/1.6 ${POLICE};color:#7A746D">
      Fill, la communication externalis\xE9e des collectivit\xE9s et des entreprises, est un service de Studio ES.<br>
      <a href="mailto:contact@studioes.fr" style="color:#7A746D">contact@studioes.fr</a> \xB7 06 51 22 21 07 \xB7 <a href="https://fill.studioes.fr" style="color:#7A746D">fill.studioes.fr</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

// supabase/functions/_partage/regles/transfert.ts
var DOMAINE_DEFAUT = "demandes.studioes.fr";
var adresseTransfert = (alias, domaine) => {
  const a = String(alias ?? "").trim().toLowerCase();
  const d = String(domaine || DOMAINE_DEFAUT).trim().toLowerCase();
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(a) ? `${a}@${d}` : null;
};

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
      quoi = `${c.unites} unit\xE9s suppl\xE9mentaires (${Number(c.total).toLocaleString("fr-FR")} \u20AC, TVA non applicable)`;
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
  const { data: al } = await sb.from("organisation").select("alias_mail").eq("id", o.id).maybeSingle();
  const transfert = adresseTransfert(al?.alias_mail, Deno.env.get("DOMAINE_RECEPTION"));
  const bienvenue = gabarit({
    titre: `Bienvenue, ${echap(prenom)}`,
    aper\u00E7u: "Votre espace Fill est ouvert : trois gestes pour bien d\xE9marrer.",
    texte: [
      `L\u2019espace de ${echap(o.nom)} est ouvert.`,
      o.type === "collectivite" ? "Je vous appelle sous 24 h ouvr\xE9es pour caler avec vous le volume d\u2019unit\xE9s, puis je vous envoie le devis et le bon de commande. Vos unit\xE9s sont cr\xE9dit\xE9es d\xE8s r\xE9ception du bon sign\xE9, \xE0 d\xE9poser dans votre espace." : "Vos unit\xE9s sont cr\xE9dit\xE9es d\xE8s le premier r\xE8glement, \xE0 faire en ligne depuis l\u2019accueil de votre espace. Je vous appelle aussi pour caler le volume avec vous.",
      "<b>Pour bien d\xE9marrer, trois gestes :</b>"
    ],
    etapes: [
      { titre: "Donnez l\u2019acc\xE8s \xE0 vos canaux", texte: "Site, r\xE9seaux sociaux, lettre d\u2019information : depuis le menu Comptes de votre espace. Vous invitez Fill avec des droits limit\xE9s, sans communiquer de mot de passe, et vous retirez l\u2019acc\xE8s quand vous voulez." },
      { titre: "Envoyez votre logo et votre charte", texte: "R\xE9pondez simplement \xE0 ce message. Sans r\xE9ponse, je les reprends depuis votre site." },
      { titre: "D\xE9posez votre premi\xE8re demande", texte: transfert ? "Deux chemins, au choix : le formulaire de votre espace, ou un mail \xE0 l\u2019adresse ci-dessous." : "Depuis votre espace, en quelques minutes." }
    ],
    encart: transfert ? { titre: "Votre adresse pour les demandes", texte: `<a href="mailto:${transfert}" style="color:#1A1A1A;font-weight:700;text-decoration:none">${transfert}</a><br><span style="font-size:14.5px;color:#4A4540">Envoyez-y votre demande, ou transf\xE9rez-y simplement l\u2019information re\xE7ue, depuis l\u2019adresse de votre compte. Elle arrive dans votre espace comme une demande d\xE9pos\xE9e en ligne. Vous pouvez aussi passer directement par la plateforme : les deux m\xE8nent au m\xEAme endroit.</span>` } : null,
    bouton: { libelle: "Ouvrir mon espace", lien: `${site}/` },
    apres: [
      "Pour vous connecter : votre adresse e-mail et le mot de passe choisi \xE0 l\u2019inscription. Une question ? R\xE9pondez \xE0 ce message."
    ]
  });
  const [r] = await Promise.all([
    envoyer({ to: [{ email: pourFill }], replyTo: { email: p.email, name: p.nom }, subject: `Nouvelle inscription : ${o.nom}`, htmlContent: html }),
    envoyer({ to: [{ email: p.email, name: p.nom }], replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" }, subject: "Votre espace Fill est ouvert", htmlContent: bienvenue })
  ]);
  return new Response(r.ok ? "ok" : "Envoi refus\xE9", { status: r.ok ? 200 : 502, headers: cors });
});
