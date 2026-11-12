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

// supabase/functions/_partage/regles/relecture.ts
var DUREE_JOURS = 7;
var JETON = /^[A-Za-z0-9_-]{43}$/;
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var b64url = (octets) => btoa(String.fromCharCode(...octets)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
var nouveauJeton = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
var empreinte = async (jeton) => {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(jeton)));
  return [...new Uint8Array(h)].map((o) => o.toString(16).padStart(2, "0")).join("");
};
var lienPage = (site, jeton) => `${String(site).replace(/\/$/, "")}/relecture/#j=${jeton}`;
var propre = (t, max) => String(t ?? "").replace(/\s+/g, " ").trim().slice(0, max);
var invitation = (s) => {
  const usage = s?.usage === "delegation" ? "delegation" : s?.usage === "avis" ? "avis" : null;
  const nom = propre(s?.nom, 120);
  const fonction = propre(s?.fonction, 120);
  const email = propre(s?.email, 254).toLowerCase();
  if (!usage) return { erreur: "Choisissez ce que vous attendez de cette personne." };
  if (nom.length < 2) return { erreur: "Indiquez le nom de la personne." };
  if (!EMAIL.test(email)) return { erreur: "Cette adresse e-mail n\u2019est pas valide." };
  return { usage, nom, fonction: fonction || null, email };
};
var reponse = (s) => {
  const r = s?.reponse === "accord" ? "accord" : s?.reponse === "correction" ? "correction" : null;
  const remarque = String(s?.remarque ?? "").trim().slice(0, 4e3);
  if (!r) return { erreur: "R\xE9ponse inconnue." };
  if (r === "correction" && remarque.length < 3) return { erreur: "Indiquez ce qui est \xE0 corriger." };
  return { reponse: r, remarque: remarque || null };
};
var peutInviter = (profil, organisationId, aujourdhui) => Boolean(profil?.actif) && profil.organisation_id === organisationId && (profil.role === "referent" || Boolean(profil.suppleant_jusqu_au) && String(profil.suppleant_jusqu_au) >= aujourdhui);
var mailInvitation = ({ usage, demandeur, organisation, titre }) => ({
  sujet: usage === "avis" ? `${demandeur} vous demande votre avis : ${titre}` : `${demandeur} vous confie une validation : ${titre}`,
  titre: usage === "avis" ? `${demandeur} vous demande votre avis` : `${demandeur} vous confie une validation`,
  texte: [
    usage === "avis" ? `${organisation} pr\xE9pare \xAB ${titre} \xBB. ${demandeur} souhaite votre avis avant de valider.` : `${organisation} pr\xE9pare \xAB ${titre} \xBB. ${demandeur} vous confie la validation de cette version : votre r\xE9ponse lance la suite.`,
    "La relecture se fait depuis ce lien, sans compte ni mot de passe : \xAB D\u2019accord \xBB si tout est bon, \xAB \xC0 corriger \xBB sinon."
  ],
  bouton: "Relire la version",
  apres: [
    `Ce lien vous est personnel et reste valable ${DUREE_JOURS} jours.`,
    `Ce message vous est envoy\xE9 par Fill, qui r\xE9alise la communication de ${organisation}. Pour toute question, r\xE9pondez \xE0 ce message : ${demandeur} le recevra.`
  ]
});
var mailRetour = ({ usage, qui, reponse: r, remarque, titre }) => {
  const verdict = r === "accord" ? "d\u2019accord" : "\xE0 corriger";
  return usage === "avis" ? {
    sujet: `Avis de ${qui} : ${titre}`,
    titre: `${qui} a donn\xE9 son avis : ${verdict}`,
    texte: [`Sur \xAB ${titre} \xBB.`, remarque ? `<i>${remarque}</i>` : "", "La d\xE9cision vous revient : vous pouvez valider ou demander des corrections depuis ce lien."].filter(Boolean),
    bouton: "D\xE9cider"
  } : {
    sujet: `${r === "accord" ? "Valid\xE9e" : "Corrections demand\xE9es"} par ${qui} : ${titre}`,
    titre: r === "accord" ? `${qui} a valid\xE9 la version` : `${qui} demande des corrections`,
    texte: [`Sur \xAB ${titre} \xBB, par d\xE9l\xE9gation.`, remarque ? `<i>${remarque}</i>` : "", r === "accord" ? "Fill prend la suite. Vous n\u2019avez rien \xE0 faire." : "Fill reprend la version et vous en remet une nouvelle \xE0 relire."].filter(Boolean),
    bouton: null
  };
};

// supabase/functions/relecture/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var json = (corps, status = 200) => new Response(JSON.stringify(corps), { status, headers: { ...cors, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
var refus = (message, status = 409) => json({ erreur: message }, status);
var motif = (e) => e?.code === "P0001" && e.message ? e.message : "Cette action n\u2019a pas pu aboutir. R\xE9essayez dans un instant.";
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return refus("M\xE9thode refus\xE9e", 405);
  let s;
  try {
    s = await req.json();
  } catch {
    return refus("Requ\xEAte illisible", 400);
  }
  const url = Deno.env.get("SUPABASE_URL");
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  const envoyer = async (org, m) => {
    const cle = Deno.env.get("BREVO_API_KEY");
    if (!cle || !m?.a?.length) return false;
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
        to: m.a,
        replyTo: m.repondreA ?? { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
        subject: `${org?.essai ? "[Test] " : ""}${m.sujet}`,
        htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres })
      })
    }).catch(() => null);
    return Boolean(r?.ok);
  };
  const organisation = async (id) => (await admin.from("organisation").select("id, nom, essai").eq("id", id).single()).data;
  const profil = async (id) => id ? (await admin.from("profil").select("id, nom, email, role, organisation_id, actif, suppleant_jusqu_au").eq("id", id).maybeSingle()).data : null;
  const creer = async (demande, usage, nom, fonction, email, par, parent) => {
    const jeton = nouveauJeton();
    const { data, error } = await admin.rpc("relecture_creer", {
      p_demande: demande,
      p_usage: usage,
      p_nom: nom,
      p_fonction: fonction,
      p_email: email,
      p_empreinte: await empreinte(jeton),
      p_par: par ?? null,
      p_parent: parent ?? null,
      p_jours: DUREE_JOURS
    });
    return error ? { erreur: motif(error) } : { id: data, jeton };
  };
  const inviter = async (demandeId, de, saisie, parent) => {
    const v = invitation(saisie);
    if (v.erreur) return refus(v.erreur, 400);
    if (de?.email && v.email === String(de.email).toLowerCase()) return refus("Cette adresse est la v\xF4tre : indiquez celle de la personne qui doit relire.", 400);
    const { data: d } = await admin.from("demande").select("id, titre, organisation_id").eq("id", demandeId).single();
    if (!d) return refus("Demande introuvable", 404);
    const o = await organisation(d.organisation_id);
    const l2 = await creer(d.id, v.usage, v.nom, v.fonction, v.email, de?.id, parent);
    if (l2.erreur) return refus(l2.erreur);
    const t = mailInvitation({ usage: v.usage, demandeur: echap(de?.nom ?? o.nom), organisation: echap(o.nom), titre: echap(d.titre) });
    const parti = await envoyer(o, {
      a: [{ email: v.email, name: v.nom }],
      repondreA: de?.email ? { email: de.email, name: de.nom } : void 0,
      sujet: mailInvitation({ usage: v.usage, demandeur: de?.nom ?? o.nom, organisation: o.nom, titre: d.titre }).sujet,
      titre: t.titre,
      texte: t.texte,
      apres: t.apres,
      bouton: { libelle: t.bouton, lien: lienPage(SITE, l2.jeton) }
    });
    if (!parti) {
      await admin.rpc("relecture_retirer", { p_lien: l2.id });
      return refus("Le message n\u2019a pas pu partir. V\xE9rifiez l\u2019adresse et r\xE9essayez.", 502);
    }
    return json({ ok: true, lien: l2.id, nom: v.nom, usage: v.usage });
  };
  if (s.action === "creer") {
    const sb = createClient(url, CLE_PUBLIABLE, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: u } = await sb.auth.getUser();
    if (!u?.user) return refus("Connexion requise", 401);
    const moi = await profil(u.user.id);
    const { data: d } = await admin.from("demande").select("id, organisation_id").eq("id", s.demande).maybeSingle();
    if (!d || !peutInviter(moi, d.organisation_id, (/* @__PURE__ */ new Date()).toISOString().slice(0, 10))) return refus("Seul le r\xE9f\xE9rent peut faire relire une version.", 403);
    return inviter(d.id, moi, s);
  }
  if (typeof s.j !== "string" || !JETON.test(s.j)) return json({ etat: "inconnu" }, 404);
  const e = await empreinte(s.j);
  const { data: vue, error: errVue } = await admin.rpc("relecture_lire", { p_empreinte: e });
  if (errVue) return refus(motif(errVue), 500);
  if (!vue || vue.etat === "inconnu") return json({ etat: "inconnu" }, 404);
  if (s.action === "lire") {
    const ouvert = vue.etat === "ouvert";
    const fichiers = ouvert ? await Promise.all((vue.version.fichiers ?? []).map(async (f) => {
      const { chemin, ...reste } = f ?? {};
      return chemin ? { ...reste, src: (await admin.storage.from("fichiers").createSignedUrl(chemin, 3600)).data?.signedUrl } : reste;
    })) : [];
    const invitations = ouvert && vue.usage === "referent" ? ((await admin.from("lien_relecture").select("id, usage, nom, fonction, reponse, remarque, repondu_le, revoque_le, expire").eq("demande_id", vue.demande.id).eq("version_id", vue.version_id).in("usage", ["avis", "delegation"]).order("cree")).data ?? []).filter((x) => !x.revoque_le).map((x) => ({ id: x.id, usage: x.usage, nom: x.nom, fonction: x.fonction, reponse: x.reponse, remarque: x.remarque, ouvert: !x.reponse && new Date(x.expire).getTime() > Date.now() })) : [];
    return json({
      etat: vue.etat,
      usage: vue.usage,
      nom: vue.nom,
      reponse: vue.reponse,
      expire: vue.expire,
      demandeur: vue.demandeur,
      organisation: vue.organisation,
      cible: vue.type_organisation === "entreprise" ? "e" : "c",
      demande: ouvert ? { titre: vue.demande.titre, parution: vue.demande.parution, heure: vue.demande.heure, corrections_restantes: vue.demande.corrections_restantes } : { titre: vue.demande.titre },
      version: ouvert ? { numero: vue.version.numero, note: vue.version.note, date: vue.version.date, fichiers } : null,
      invitations,
      espace: SITE
    });
  }
  if (s.action === "repondre") {
    const v = reponse(s);
    if (v.erreur) return refus(v.erreur, 400);
    const { data: r, error } = await admin.rpc("relecture_repondre", { p_empreinte: e, p_reponse: v.reponse, p_remarque: v.remarque });
    if (error) return refus(motif(error));
    const { data: d } = await admin.from("demande").select("id, titre, organisation_id").eq("id", r.demande).single();
    const o = await organisation(d.organisation_id);
    const ref = await profil(r.par);
    const qui = echap(vue.nom);
    if (r.decision) {
      await fetch(`${url}/functions/v1/notifier`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CLE_SECRETE}`, "content-type": "application/json" },
        body: JSON.stringify({ evenement: "statut", demande: d.id })
      }).catch(() => null);
      if (vue.usage === "delegation" && ref?.email) {
        const t = mailRetour({ usage: "delegation", qui, reponse: v.reponse, remarque: echap(v.remarque ?? ""), titre: echap(d.titre) });
        await envoyer(o, { a: [{ email: ref.email, name: ref.nom }], sujet: mailRetour({ usage: "delegation", qui: vue.nom, reponse: v.reponse, titre: d.titre }).sujet, titre: t.titre, texte: t.texte, bouton: { libelle: "Voir la demande", lien: `${SITE}/#demande-${d.id}` } });
      }
    } else if (ref?.email) {
      const l2 = await creer(d.id, "referent", ref.nom, null, ref.email, ref.id, vue.lien);
      const t = mailRetour({ usage: "avis", qui, reponse: v.reponse, remarque: echap(v.remarque ?? ""), titre: echap(d.titre) });
      await envoyer(o, { a: [{ email: ref.email, name: ref.nom }], sujet: mailRetour({ usage: "avis", qui: vue.nom, reponse: v.reponse, titre: d.titre }).sujet, titre: t.titre, texte: t.texte, bouton: { libelle: t.bouton, lien: l2.jeton ? lienPage(SITE, l2.jeton) : `${SITE}/#demande-${d.id}` } });
    }
    return json({ ok: true, decision: r.decision, statut: r.statut, usage: vue.usage });
  }
  if (vue.usage !== "referent" || vue.etat !== "ouvert") return refus("Ce lien ne permet pas cette action.", 403);
  const { data: l } = await admin.from("lien_relecture").select("id, demande_id, cree_par, email, nom").eq("id", vue.lien).single();
  const referent = await profil(l.cree_par) ?? { id: null, nom: l.nom, email: l.email };
  if (s.action === "inviter") return inviter(l.demande_id, referent, s, l.id);
  if (s.action === "retirer") {
    const { data: cible } = await admin.from("lien_relecture").select("id, demande_id, usage").eq("id", s.lien).maybeSingle();
    if (!cible || cible.demande_id !== l.demande_id || cible.usage === "referent") return refus("Invitation introuvable", 404);
    await admin.rpc("relecture_retirer", { p_lien: cible.id });
    return json({ ok: true });
  }
  return refus("Action inconnue", 400);
});
