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

// supabase/functions/_partage/regles/cycle.ts
var EQUIPE = ["admin", "producteur"];
var T = {
  confirmer: { de: ["deposee"], vers: "confirmee", roles: ["admin"] },
  demander_accord: { de: ["deposee"], vers: "accord_requis", roles: ["admin"] },
  donner_accord: { de: ["accord_requis"], vers: "confirmee", roles: ["referent"] },
  refuser: { de: ["accord_requis"], vers: "annulee", roles: ["referent"] },
  demarrer: { de: ["confirmee"], vers: "production", roles: EQUIPE },
  livrer_version: { de: ["production", "correction", "confirmee"], vers: "a_valider", roles: EQUIPE },
  valider: { de: ["a_valider"], vers: "validee", roles: ["referent"] },
  demander_correction: { de: ["a_valider"], vers: "correction", roles: ["referent", "contributeur"] },
  livrer: { de: ["validee"], vers: "livree", roles: EQUIPE },
  suspendre: { de: ["confirmee", "production", "correction"], vers: "attente_client", roles: EQUIPE },
  reprendre: { de: ["attente_client"], vers: "production", roles: [...EQUIPE, "referent", "contributeur"] },
  annuler: { de: ["deposee", "accord_requis", "confirmee", "attente_client"], vers: "annulee", roles: ["admin", "referent", "contributeur"] }
};
var PUBLIEES = ["post", "actu", "agenda", "presse", "news", "page", "video"];
var SANS_LIVRABLE = ["point", "moder"];
var issue = (lignes) => {
  const pub = lignes.some((l) => PUBLIEES.includes(l.prestation));
  const fic = lignes.some((l) => !PUBLIEES.includes(l.prestation) && !SANS_LIVRABLE.includes(l.prestation));
  return pub && fic ? "mixte" : pub ? "publication" : "fichiers";
};

// supabase/functions/_partage/regles/relecture.ts
var DUREE_JOURS = 7;
var b64url = (octets) => btoa(String.fromCharCode(...octets)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
var nouveauJeton = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
var empreinte = async (jeton) => {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(jeton)));
  return [...new Uint8Array(h)].map((o) => o.toString(16).padStart(2, "0")).join("");
};
var lienPage = (site, jeton) => `${String(site).replace(/\/$/, "")}/relecture/#j=${jeton}`;

// supabase/functions/_partage/regles/transfert.ts
var DOMAINE_DEFAUT = "demandes.studioes.fr";
var adresseTransfert = (alias, domaine) => {
  const a = String(alias ?? "").trim().toLowerCase();
  const d = String(domaine || DOMAINE_DEFAUT).trim().toLowerCase();
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(a) ? `${a}@${d}` : null;
};
var phraseConfirmee = (adresse) => `Pour une prochaine demande, un mail suffit : \xE9crivez ou transf\xE9rez l\u2019information \xE0 <a href="mailto:${adresse}" style="color:#6B6560">${adresse}</a>.`;

// supabase/functions/notifier/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var extrait = (t, n = 280) => t.length > n ? t.slice(0, n - 1).trimEnd() + "\u2026" : t;
var recent = (iso, minutes) => Boolean(iso) && Date.now() - new Date(iso).getTime() < minutes * 6e4;
var jour = (iso) => iso ? (/* @__PURE__ */ new Date(iso + "T12:00:00")).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "";
var EQUIPE2 = ["admin", "producteur"];
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = Deno.env.get("SUPABASE_URL");
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  const auth = req.headers.get("Authorization") ?? "";
  const serveur = Boolean(CLE_SECRETE) && auth === `Bearer ${CLE_SECRETE}`;
  let moi = null;
  if (!serveur) {
    const sb = createClient(url, CLE_PUBLIABLE, { global: { headers: { Authorization: auth } } });
    const { data: u } = await sb.auth.getUser();
    if (!u.user) return new Response("Connexion requise", { status: 401, headers: cors });
    moi = (await admin.from("profil").select("id, nom, email, role, organisation_id, actif").eq("id", u.user.id).single()).data;
    if (!moi?.actif) return new Response("Acc\xE8s refus\xE9", { status: 403, headers: cors });
  }
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle) return new Response("Envoi non configur\xE9", { status: 503, headers: cors });
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  const { evenement, demande: demandeId, commande: commandeId, organisation: orgId, canal } = await req.json();
  const estFill = serveur || EQUIPE2.includes(moi.role);
  const profils = async (org) => (await admin.from("profil").select("id, nom, email, role, organisation_id, actif, mails_etapes").eq("organisation_id", org).eq("actif", true)).data ?? [];
  const mails = [];
  let essai = false;
  if (evenement === "credit" || evenement === "paiement") {
    if (!estFill && evenement === "credit") return new Response("R\xE9serv\xE9 \xE0 Fill", { status: 403, headers: cors });
    const org = commandeId ? (await admin.from("commande").select("organisation_id").eq("id", commandeId).single()).data?.organisation_id : orgId;
    const { data: o } = await admin.from("organisation").select("id, nom, essai").eq("id", org).single();
    if (!o) return new Response("Rien \xE0 signaler", { status: 404, headers: cors });
    if (!serveur && moi.organisation_id && moi.organisation_id !== o.id) return new Response("Acc\xE8s refus\xE9", { status: 403, headers: cors });
    essai = o.essai;
    const { data: r } = await admin.from("registre").select("unites, motif, date").eq("organisation_id", o.id).in("type", ["credit", "ajustement"]).gt("unites", 0).order("date", { ascending: false }).limit(1).maybeSingle();
    if (!r || !recent(r.date, 10)) return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
    const ref = (await profils(o.id)).find((p) => p.role === "referent");
    if (ref) mails.push({
      a: [{ email: ref.email, name: ref.nom }],
      sujet: `${r.unites} unit\xE9s cr\xE9dit\xE9es sur votre espace Fill`,
      titre: `${r.unites} unit\xE9s cr\xE9dit\xE9es`,
      texte: [evenement === "paiement" ? "Votre paiement est bien re\xE7u, merci." : `${echap(r.motif ?? "Unit\xE9s ajout\xE9es par Fill")}.`, `Les ${r.unites} unit\xE9s sont disponibles d\xE8s maintenant dans l\u2019espace de ${echap(o.nom)} : vos demandes peuvent partir.`],
      bouton: { libelle: "D\xE9poser une demande", lien: `${SITE}/#nouvelle` }
    });
    if (evenement === "paiement") mails.push({ a: [{ email: pourFill }], sujet: `Paiement re\xE7u : ${o.nom}`, titre: `Paiement re\xE7u : ${echap(o.nom)}`, texte: [`${r.unites} unit\xE9s cr\xE9dit\xE9es automatiquement (${echap(r.motif ?? "")}).`], bouton: { libelle: "Ouvrir le pilotage", lien: `${SITE}/#pilotage` } });
  } else if (evenement === "acces") {
    const NOMS = { facebook: "Page Facebook", instagram: "Instagram", linkedin: "Page LinkedIn", site: "Site internet", newsletter: "Newsletter", google: "Fiche Google" };
    const { data: a } = await admin.from("acces_compte").select("statut, note, maj").eq("organisation_id", orgId).eq("canal", canal).maybeSingle();
    const { data: o } = await admin.from("organisation").select("id, nom, essai").eq("id", orgId).single();
    if (!a || !o || !recent(a.maj, 5)) return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
    if (!estFill && moi.organisation_id !== o.id) return new Response("Acc\xE8s refus\xE9", { status: 403, headers: cors });
    essai = o.essai;
    const nomC = NOMS[canal] ?? echap(canal);
    if (a.statut === "donne" && !estFill) {
      mails.push({
        a: [{ email: pourFill }],
        repondreA: { email: moi.email, name: moi.nom },
        sujet: `Acc\xE8s \xE0 v\xE9rifier : ${nomC} (${o.nom})`,
        titre: `${echap(o.nom)} vous a donn\xE9 l\u2019acc\xE8s : ${nomC}`,
        texte: ["Connectez-vous \xE0 l\u2019outil, v\xE9rifiez que vous pouvez publier, puis confirmez dans le pilotage. Le client voit l\u2019acc\xE8s comme \xAB en v\xE9rification \xBB d\u2019ici l\xE0."],
        bouton: { libelle: "Ouvrir le pilotage", lien: `${SITE}/#pilotage` }
      });
    } else if (a.statut === "a_donner" && a.note && estFill) {
      const ref = (await profils(o.id)).find((p) => p.role === "referent");
      if (ref) mails.push({
        a: [{ email: ref.email, name: ref.nom }],
        sujet: `Acc\xE8s \xE0 redonner : ${nomC}`,
        titre: `L\u2019acc\xE8s \xE0 votre ${nomC} ne fonctionne pas`,
        texte: [`<i>${echap(extrait(a.note, 300))}</i>`, "Tant que l\u2019acc\xE8s manque, Fill vous remet les contenus de ce canal pr\xEAts \xE0 publier."],
        bouton: { libelle: "Redonner l\u2019acc\xE8s", lien: `${SITE}/#comptes` }
      });
    } else return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
  } else {
    const { data: d } = await admin.from("demande").select("*").eq("id", demandeId).single();
    if (!d) return new Response("Demande introuvable", { status: 404, headers: cors });
    if (!estFill && moi.organisation_id !== d.organisation_id) return new Response("Acc\xE8s refus\xE9", { status: 403, headers: cors });
    const { data: o } = await admin.from("organisation").select("id, nom, essai").eq("id", d.organisation_id).single();
    essai = Boolean(o?.essai);
    const equipeClient = await profils(d.organisation_id);
    const auteur = equipeClient.find((p) => p.id === d.auteur_id);
    const referent = equipeClient.find((p) => p.role === "referent");
    const lienDemande = `${SITE}/#demande-${d.id}`;
    const lignes = (await admin.from("demande_ligne").select("prestation").eq("demande_id", d.id)).data ?? [];
    const iss = issue(lignes);
    const quand = d.heure ? ` \xE0 ${String(d.heure).replace(":", " h ")}` : "";
    const nom = `\xAB ${echap(d.titre)} \xBB`;
    const destClient = (qui) => [...new Map(qui.filter(Boolean).map((p) => [p.email, { email: p.email, name: p.nom }])).values()];
    const etapes2 = (qui) => qui.filter((p) => p && p.mails_etapes !== false);
    if (evenement === "jet") {
      if (!serveur) return new Response("R\xE9serv\xE9 au serveur", { status: 403, headers: cors });
      const { data: b } = await admin.from("brouillon").select("maj, contenu").eq("demande_id", d.id).maybeSingle();
      if (!b || !recent(b.maj, 10)) return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
      const n = Array.isArray(b.contenu?.fichiers) ? b.contenu.fichiers.length : 0;
      mails.push({
        a: [{ email: pourFill }],
        sujet: `Premier jet \xE0 relire : ${d.titre} (${o?.nom})`,
        titre: `Premier jet pr\xEAt : ${nom}`,
        texte: [`Le pilote a confirm\xE9 la demande${d.livraison ? `, livraison le ${jour(d.livraison)}` : ""}. L\u2019atelier a pr\xE9par\xE9 ${n || "les"} texte${n > 1 ? "s" : ""} \xE0 partir du brief.`, "Relisez, corrigez ou demandez une reprise dans la fiche, puis livrez la version au client. Rien ne part sans vous."],
        bouton: { libelle: "Relire le premier jet", lien: lienDemande }
      });
    } else if (evenement === "depot") {
      if (!recent(d.creee, 10)) return new Response("D\xE9j\xE0 signal\xE9", { status: 409, headers: cors });
      const auto = d.statut === "confirmee";
      mails.push({
        a: [{ email: pourFill }],
        repondreA: auteur ? { email: auteur.email, name: auteur.nom } : void 0,
        sujet: `${auto ? "Demande confirm\xE9e par le pilote" : "Nouvelle demande"} : ${d.titre} (${o?.nom})`,
        titre: `${auto ? "Confirm\xE9e par le pilote" : "Nouvelle demande"} : ${nom}`,
        texte: [
          `<b>${echap(o?.nom)}</b>, d\xE9pos\xE9e par ${echap(auteur?.nom ?? "le client")} \xB7 ${d.unites} unit\xE9${d.unites > 1 ? "s" : ""}${d.urgente ? " \xB7 urgente" : ""}${d.parution ? ` \xB7 parution le ${jour(d.parution)}${quand}` : quand ? ` \xB7 publication${quand}` : ""}.`,
          `<i>${echap(extrait(d.brief ?? ""))}</i>`,
          auto ? `Le pilote l\u2019a confirm\xE9e${d.livraison ? `, livraison le ${jour(d.livraison)}` : ""} ; le premier jet de l\u2019atelier vous attend dans la fiche.` : "Elle attend votre confirmation (co\xFBt et date de livraison)."
        ],
        bouton: { libelle: "Ouvrir la demande", lien: lienDemande }
      });
      const parMail = (await admin.from("mail_recu").select("id").eq("demande_id", d.id).limit(1)).data?.length;
      if (!auto && auteur && !parMail && auteur.mails_etapes !== false) {
        mails.push({
          a: destClient([auteur]),
          sujet: `Demande re\xE7ue : ${d.titre}`,
          titre: `${nom} est bien re\xE7ue`,
          texte: [
            `${d.unites} unit\xE9${d.unites > 1 ? "s" : ""}${d.parution ? `, parution souhait\xE9e le ${jour(d.parution)}${quand}` : ""}. Fill la confirme avec sa date de livraison.`,
            "D\u2019ici l\xE0, rien n\u2019est engag\xE9 : vous pouvez encore l\u2019annuler depuis votre espace."
          ],
          bouton: { libelle: "Suivre la demande", lien: lienDemande }
        });
      }
    } else if (evenement === "message") {
      const { data: msg } = await admin.from("message").select("texte, auteur_id, creee, systeme").eq("demande_id", d.id).order("creee", { ascending: false }).limit(1).maybeSingle();
      if (!msg || msg.systeme || !recent(msg.creee, 3) || moi && msg.auteur_id !== moi.id) return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
      if (estFill) {
        mails.push({ a: destClient([auteur, referent]), sujet: `Message de Fill : ${d.titre}`, titre: `Message de Fill sur ${nom}`, texte: [`<i>${echap(extrait(msg.texte, 600))}</i>`], bouton: { libelle: "R\xE9pondre dans l\u2019espace", lien: lienDemande } });
      } else {
        mails.push({ a: [{ email: pourFill }], repondreA: { email: moi.email, name: moi.nom }, sujet: `Message de ${o?.nom} : ${d.titre}`, titre: `Message de ${echap(moi.nom)}`, texte: [`Sur ${nom} (${echap(o?.nom)}) :`, `<i>${echap(extrait(msg.texte, 600))}</i>`], bouton: { libelle: "Ouvrir la demande", lien: lienDemande } });
      }
    } else if (evenement === "statut") {
      const { data: h } = await admin.from("historique").select("statut, type, detail, par, date").eq("demande_id", d.id).order("id", { ascending: false }).limit(1).maybeSingle();
      if (!h || !recent(h.date, 5) || h.statut !== d.statut) return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
      const parClient = equipeClient.some((p) => p.id === h.par);
      if (parClient) {
        const qui = equipeClient.find((p) => p.id === h.par);
        const quoi = {
          validee: iss === "fichiers" ? "a valid\xE9 la version propos\xE9e : les fichiers finaux sont \xE0 remettre" : iss === "publication" ? `a valid\xE9 la version propos\xE9e : elle est \xE0 publier${d.parution ? ` le ${jour(d.parution)}` : ""}${quand}` : `a valid\xE9 la version propos\xE9e : \xE0 publier${d.parution ? ` le ${jour(d.parution)}` : ""}${quand}, fichiers \xE0 remettre`,
          correction: "demande des corrections sur la version propos\xE9e",
          confirmee: "a donn\xE9 son accord : la demande peut \xEAtre lanc\xE9e",
          annulee: "a annul\xE9 la demande",
          production: "a fourni l\u2019\xE9l\xE9ment attendu : la production peut reprendre",
          deposee: "a modifi\xE9 la demande avant confirmation"
        };
        const texte = quoi[h.type === "modification" ? "deposee" : d.statut];
        if (!texte) return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
        if (qui.mails_etapes !== false && (d.statut === "validee" || d.statut === "correction")) {
          const date = d.parution ? ` le ${jour(d.parution)}${quand}` : "";
          const suite = iss === "fichiers" ? "Fill pr\xE9pare les fichiers finaux : ils seront \xE0 t\xE9l\xE9charger dans la demande." : iss === "publication" ? `Fill la publie sur vos comptes${date}.` : `Fill la publie sur vos comptes${date} et pr\xE9pare les fichiers des supports imprim\xE9s.`;
          mails.push({
            a: destClient([qui]),
            sujet: d.statut === "validee" ? `Version valid\xE9e : ${d.titre}` : `Corrections transmises : ${d.titre}`,
            titre: d.statut === "validee" ? "Votre validation est enregistr\xE9e" : "Vos corrections sont transmises",
            texte: [d.statut === "validee" ? `Merci. ${nom} est valid\xE9e. ${suite}` : `${nom} : Fill reprend la version et vous en remet une nouvelle \xE0 relire.`],
            bouton: { libelle: "Suivre la demande", lien: lienDemande }
          });
        }
        mails.push({ a: [{ email: pourFill }], repondreA: { email: qui.email, name: qui.nom }, sujet: `${o?.nom} : ${d.titre}`, titre: `${echap(qui.nom)} ${texte}`, texte: [`${nom}, ${echap(o?.nom)}.`, h.detail ? `<i>${echap(extrait(h.detail, 400))}</i>` : ""].filter(Boolean), bouton: { libelle: "Ouvrir la demande", lien: lienDemande } });
      } else {
        let transfert = null;
        if (d.statut === "confirmee") {
          const { data: al } = await admin.from("organisation").select("alias_mail").eq("id", d.organisation_id).maybeSingle();
          transfert = adresseTransfert(al?.alias_mail, Deno.env.get("DOMAINE_RECEPTION"));
        }
        const versClient = {
          confirmee: { sujet: `Demande confirm\xE9e : ${d.titre}`, titre: `${nom} est confirm\xE9e`, texte: `${d.unites} unit\xE9${d.unites > 1 ? "s" : ""}${d.livraison ? `, livraison pr\xE9vue le ${jour(d.livraison)}` : ""}. Vous suivez chaque \xE9tape dans votre espace.`, bouton: "Suivre la demande", qui: [auteur], etape: true, apres: transfert ? [phraseConfirmee(transfert)] : void 0 },
          a_valider: { sujet: `\xC0 relire : ${d.titre}`, titre: `Une version de ${nom} est pr\xEAte`, texte: "Relisez-la dans votre espace : validez-la, ou indiquez vos corrections au bon endroit. Deux allers-retours sont inclus.", bouton: "Relire la version", qui: [auteur, referent] },
          attente_client: { sujet: `Un \xE9l\xE9ment est attendu : ${d.titre}`, titre: `Fill attend un \xE9l\xE9ment pour ${nom}`, texte: "La production reprend d\xE8s votre r\xE9ponse. Le d\xE9tail est dans les \xE9changes de la demande.", bouton: "R\xE9pondre", qui: [auteur, referent] },
          accord_requis: { sujet: `Votre accord est demand\xE9 : ${d.titre}`, titre: `Votre accord est demand\xE9 pour ${nom}`, texte: "Cette demande d\xE9passe ce qui \xE9tait pr\xE9vu (unit\xE9s ou plafond du contributeur). Elle est lanc\xE9e d\xE8s votre accord.", bouton: "Donner mon accord", qui: [referent] },
          livree: iss === "fichiers" ? { sujet: `Fichiers livr\xE9s : ${d.titre}`, titre: `Les fichiers de ${nom} sont livr\xE9s`, texte: "Les fichiers finaux sont \xE0 t\xE9l\xE9charger dans la demande, pr\xEAts \xE0 imprimer ou \xE0 diffuser.", bouton: "R\xE9cup\xE9rer les fichiers", qui: [auteur, referent], etape: true } : { sujet: `C\u2019est publi\xE9 : ${d.titre}`, titre: `${nom} est publi\xE9e`, texte: iss === "mixte" ? "Fill l\u2019a publi\xE9e sur vos comptes ; les fichiers des supports imprim\xE9s sont \xE0 t\xE9l\xE9charger dans la demande." : "Fill l\u2019a publi\xE9e sur vos comptes. Les liens et les fichiers restent disponibles dans la demande.", bouton: "Voir la demande", qui: [auteur, referent], etape: true },
          annulee: { sujet: `Demande annul\xE9e : ${d.titre}`, titre: `${nom} est annul\xE9e`, texte: "Les unit\xE9s r\xE9serv\xE9es sont rendues \xE0 votre compte. Le motif est dans les \xE9changes de la demande.", bouton: "Voir la demande", qui: [auteur], etape: true }
        };
        const v = versClient[d.statut];
        if (!v) return new Response("Rien \xE0 signaler", { status: 409, headers: cors });
        const prefixe = h.type === "relance" ? "Rappel : " : "";
        let direct = null;
        if (d.statut === "a_valider" && referent) {
          const jeton = nouveauJeton();
          const { error: errLien } = await admin.rpc("relecture_creer", { p_demande: d.id, p_usage: "referent", p_nom: referent.nom, p_fonction: null, p_email: referent.email, p_empreinte: await empreinte(jeton), p_par: referent.id, p_parent: null, p_jours: DUREE_JOURS });
          if (!errLien) direct = lienPage(SITE, jeton);
        }
        if (direct) {
          mails.push({
            a: [{ email: referent.email, name: referent.nom }],
            sujet: `${prefixe}${v.sujet}`,
            titre: v.titre,
            texte: ["Relisez-la sans vous connecter : \xAB D\u2019accord \xBB si tout est bon, \xAB \xC0 corriger \xBB sinon. Deux allers-retours sont inclus."],
            bouton: { libelle: v.bouton, lien: direct },
            apres: [`Ce lien vous est personnel et reste valable ${DUREE_JOURS} jours. Depuis la m\xEAme page, vous pouvez aussi faire relire la version par un \xE9lu, un associ\xE9 ou un coll\xE8gue, sans lui cr\xE9er de compte.`]
          });
          const autres = destClient(v.qui.filter((p) => p && p.id !== referent.id));
          if (autres.length) mails.push({ a: autres, sujet: `${prefixe}${v.sujet}`, titre: v.titre, texte: [v.texte], bouton: { libelle: v.bouton, lien: lienDemande } });
        } else mails.push({ a: destClient(v.etape ? etapes2(v.qui) : v.qui), sujet: `${prefixe}${v.sujet}`, titre: v.titre, texte: [v.texte], bouton: { libelle: v.bouton, lien: lienDemande }, apres: v.apres });
      }
    } else return new Response("\xC9v\xE9nement inconnu", { status: 400, headers: cors });
  }
  const envois = mails.filter((m) => m.a.length).map((m) => fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
      to: m.a,
      replyTo: m.repondreA ?? { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
      subject: `${essai ? "[Test] " : ""}${m.sujet}`,
      htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres, etapes: m.etapes, encart: m.encart })
    })
  }));
  const res = await Promise.all(envois);
  return new Response(res.every((r) => r.ok) ? "ok" : "Envoi refus\xE9", { status: res.every((r) => r.ok) ? 200 : 502, headers: cors });
});
