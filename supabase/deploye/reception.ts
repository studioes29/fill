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

// supabase/functions/_partage/regles/transfert.ts
var DOMAINE_DEFAUT = "demandes.studioes.fr";
var adresseTransfert = (alias, domaine) => {
  const a = String(alias ?? "").trim().toLowerCase();
  const d = String(domaine || DOMAINE_DEFAUT).trim().toLowerCase();
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(a) ? `${a}@${d}` : null;
};

// supabase/functions/_partage/regles/reception.ts
var LIMITES = {
  mails: 25,
  pieces: 8,
  octetsPiece: 15 * 1024 * 1024,
  octetsTotal: 30 * 1024 * 1024,
  brief: 6e3,
  texte: 6e4,
  titre: 140,
  joursLien: 30
};
var EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
var plat = (t) => String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\u2019\u2018`\u00b4]/g, "'");
var sain = (t) => String(t ?? "").replace(/\u0000/g, "").replace(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g, "");
var propre = (t, max) => sain(String(t ?? "").replace(/\s+/g, " ").trim().slice(0, max)).trim();
var liste = (v) => Array.isArray(v) ? v : v == null ? [] : [v];
var adresse = (v) => {
  const brut = typeof v === "string" ? v : v && typeof v === "object" ? v.Address ?? v.address ?? v.Email ?? v.email : null;
  if (typeof brut !== "string") return null;
  const m = brut.match(/<([^<>]+)>/);
  const a = (m ? m[1] : brut).trim().toLowerCase();
  return EMAIL.test(a) && a.length <= 254 ? a : null;
};
var ENTITES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", eacute: "\xE9", egrave: "\xE8", ecirc: "\xEA", agrave: "\xE0", acirc: "\xE2", ccedil: "\xE7", ugrave: "\xF9", ucirc: "\xFB", ocirc: "\xF4", icirc: "\xEE", iuml: "\xEF", euml: "\xEB", laquo: "\xAB", raquo: "\xBB", rsquo: "\u2019", lsquo: "\u2018", ldquo: "\u201C", rdquo: "\u201D", hellip: "\u2026", ndash: "-", mdash: "-", euro: "\u20AC", deg: "\xB0" };
var htmlVersTexte = (html) => String(html ?? "").replace(/<(style|script|head|title)\b[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|tr|h[1-6]|blockquote|table)>/gi, "\n").replace(/<li\b[^>]*>/gi, "- ").replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, (_, n) => {
  try {
    return String.fromCodePoint(Number(n));
  } catch {
    return "";
  }
}).replace(/&#x([0-9a-f]+);/gi, (_, n) => {
  try {
    return String.fromCodePoint(parseInt(n, 16));
  } catch {
    return "";
  }
}).replace(/&([a-z]+);/gi, (tout, n) => {
  const v = ENTITES[n.toLowerCase()];
  return v === void 0 ? tout : /^[A-Z]/.test(n) ? v.toUpperCase() : v;
});
var lignesNettes = (t) => String(t ?? "").replace(/\r\n?/g, "\n").replace(/[\u00a0\u2007\u202f]/g, " ").replace(/[\u200b-\u200d\ufeff]/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n{3,}/g, "\n\n").trim();
var empreinteCourte = (t) => {
  let h = 2166136261;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
};
var nomFichier = (n) => propre(String(n ?? "").replace(/[\\/]+/g, " ").replace(/[\u0000-\u001f]/g, ""), 120).replace(/[. ]+$/, "") || "piece-jointe";
var lireMail = (item, domaine = DOMAINE_DEFAUT) => {
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;
  const de = adresse(item.From);
  if (!de) return null;
  const dom = "@" + String(domaine || DOMAINE_DEFAUT).toLowerCase();
  const vers = [...liste(item.Recipients), ...liste(item.To), ...liste(item.Cc)].map(adresse).filter(Boolean);
  const destinataires = [...new Set(vers.filter((a) => a.endsWith(dom)).map((a) => a.slice(0, -dom.length).split("+")[0]))].slice(0, 10);
  const entetes = {};
  if (item.Headers && typeof item.Headers === "object" && !Array.isArray(item.Headers)) {
    for (const [k, v] of Object.entries(item.Headers)) entetes[String(k).toLowerCase()] = Array.isArray(v) ? v.map((x) => String(x ?? "")).join("\n") : String(v ?? "");
  }
  const sujet = propre(typeof item.Subject === "string" ? item.Subject : entetes.subject, 300);
  const brut = typeof item.RawTextBody === "string" && item.RawTextBody.trim() ? item.RawTextBody : typeof item.RawHtmlBody === "string" && item.RawHtmlBody.trim() ? htmlVersTexte(item.RawHtmlBody) : typeof item.ExtractedMarkdownMessage === "string" ? item.ExtractedMarkdownMessage : "";
  const texte = lignesNettes(sain(brut.slice(0, LIMITES.texte)));
  const pieces = liste(item.Attachments).filter((a) => a && typeof a === "object").slice(0, 40).map((a) => ({
    nom: nomFichier(a.Name),
    type: String(a.ContentType ?? "").toLowerCase().split(";")[0].trim(),
    taille: Math.max(0, Math.round(Number(a.ContentLength) || 0)),
    integree: Boolean(a.ContentID),
    jeton: typeof a.DownloadToken === "string" && a.DownloadToken ? a.DownloadToken : null
  }));
  const spam = Number(item.SpamScore ?? item.Spam?.Score);
  const date = typeof item.SentAtDate === "string" ? item.SentAtDate : "";
  const ident = propre(typeof item.MessageId === "string" ? item.MessageId : entetes["message-id"], 400);
  return {
    id: ident || `sans-id:${empreinteCourte(`${de}|${date}|${sujet}|${texte.length}|${texte.slice(0, 200)}`)}`,
    de,
    nom: propre(item.From?.Name, 120) || null,
    destinataires,
    sujet,
    texte,
    signature: typeof item.ExtractedMarkdownSignature === "string" ? lignesNettes(sain(item.ExtractedMarkdownSignature.slice(0, 4e3))) : "",
    entetes,
    pieces,
    spam: Number.isFinite(spam) ? spam : null
  };
};
var ROBOTS = /^(mailer-daemon|postmaster|no-?reply|noreply|ne-?pas-?repondre|nepasrepondre|do-?not-?reply|bounces?|notifications?|newsletter|news|mailer|daemon)([+._-]|$)/;
var SUJETS_AUTO = /^(reponse automatique|automatic reply|auto ?-?reply|autoreply|absen(t|te|ce) du bureau|out of (the )?office|message d'absence|absence\s*:|undeliverable|undelivered|non remis|non distribue|delivery status notification|mail delivery (failed|failure|subsystem)|echec de (la )?remise|returned mail|failure notice|accuse de (reception|lecture)|lu\s*:|read\s*:|message lu)/;
var SUJETS_FILL = /^(bien recu|a completer|adresse non reconnue|demande non enregistree)\s*:/;
var automatique = (mail, c = {}) => {
  const dom = "@" + String(c.domaine || DOMAINE_DEFAUT).toLowerCase();
  const fill = (c.adressesFill ?? []).map((a) => String(a ?? "").trim().toLowerCase()).filter(Boolean);
  if (mail.de.endsWith(dom) || fill.includes(mail.de)) return "boucle";
  if (ROBOTS.test(mail.de.split("@")[0])) return "automatique";
  const e = mail.entetes ?? {};
  const auto = plat(e["auto-submitted"]).trim();
  if (auto && auto !== "no") return "automatique";
  if (e["x-autoreply"] || e["x-autorespond"] || e["x-autoresponder"] || e["x-failed-recipients"]) return "automatique";
  if (/^\s*<>\s*$/.test(e["return-path"] ?? "")) return "automatique";
  if (/multipart\/report|delivery-status/i.test(e["content-type"] ?? "")) return "automatique";
  if (/\b(bulk|junk|list|auto_reply|auto-reply)\b/.test(plat(e.precedence))) return "automatique";
  if (e["list-id"] || e["list-unsubscribe"]) return "liste";
  const s = plat(mail.sujet).trim();
  if (SUJETS_AUTO.test(s)) return "automatique";
  const { titre, reponse, transfert } = sujetNettoye(mail.sujet);
  if ((reponse || transfert) && SUJETS_FILL.test(plat(titre))) return "boucle";
  return null;
};
var authentification = (entetes = {}, de = "") => {
  const domaine = String(de).split("@")[1] ?? "";
  const aligne = (d) => {
    const x = String(d ?? "").replace(/^.*@/, "").replace(/[^a-z0-9.-]/g, "");
    return Boolean(x) && Boolean(domaine) && (x === domaine || domaine.endsWith(`.${x}`) || x.endsWith(`.${domaine}`));
  };
  const valeurs = String(entetes["authentication-results"] ?? "").split("\n").map((v) => plat(v)).filter((v) => v.trim());
  const spfSeul = (plat(entetes["received-spf"]).trim().match(/^(\w+)/) ?? [])[1] ?? null;
  const lire2 = (v) => {
    const un = (cle) => (v.match(new RegExp(`\\b${cle}=(\\w+)`)) ?? [])[1] ?? null;
    const prop = (cle) => (v.match(new RegExp(`\\b${cle}=([^\\s;()]+)`)) ?? [])[1] ?? null;
    const dkimAligne = [...v.matchAll(/\bdkim=pass\b[^;]*/g)].some((m) => aligne((m[0].match(/header\.[di]=([^\s;()]+)/) ?? [])[1]));
    return { dmarc: un("dmarc"), spf: un("spf"), de: prop("header\\.from"), enveloppe: prop("smtp\\.mailfrom"), dkimAligne };
  };
  const lus = valeurs.map(lire2);
  if (lus.some((x) => x.dmarc === "fail")) return "echec";
  if (lus.some((x) => (x.spf === "fail" || x.spf === "softfail") && !x.dkimAligne) || (spfSeul === "fail" || spfSeul === "softfail") && !lus.some((x) => x.dkimAligne)) return "echec";
  const premier = lus[0];
  if (!premier) return "inconnue";
  if (premier.dmarc === "pass" && (!premier.de || aligne(premier.de))) return "ok";
  if (premier.dkimAligne) return "ok";
  if (premier.spf === "pass" && aligne(premier.enveloppe)) return "ok";
  return "inconnue";
};
var PREFIXE = /^\s*(?:(tr|fwd?|fw|wg|rv|transf\.?|re|ref|aw|sv)\s*:\s*|\[[^\]]{1,40}\]\s*)/i;
var sujetNettoye = (sujet) => {
  let s = propre(sujet, 300), transfert = false, reponse = false;
  for (let i = 0; i < 12; i++) {
    const m = s.match(PREFIXE);
    if (!m) break;
    const p = plat(m[1] ?? "");
    if (/^(tr|fwd?|fw|wg|rv|transf)/.test(p)) transfert = true;
    else if (p) reponse = true;
    s = s.slice(m[0].length);
  }
  return { titre: s.trim(), transfert, reponse };
};
var MARQUES = [
  /^-{2,}\s*(message transfere|forwarded message|message d'origine|message original|original message|courriel d'origine|mail d'origine|message reexpedie)\s*-{2,}$/,
  /^(debut du message (transfere|reexpedie)|begin forwarded message)\s*:?$/
];
var ENTETE_DE = /^\**(de|from|expediteur)\s*:\**\s*\S/;
var ENTETE_SUITE = /^\**(envoye|sent|date|a|to|objet|subject|cc)\s*:/;
var A_ECRIT = /^(le|on|el)\b.{4,160}\b(a ecrit|wrote)\s*:?$/;
var PIED_MOBILE = /^(envoye (depuis|de|a partir de) (mon|ma|l'|outlook)|sent from my|provenance\s*:\s*courrier pour windows|obtenir outlook pour|telecharger outlook pour|get outlook for)/;
var SALUT = /^(bonjour|bonsoir|salut|hello|coucou|madame|monsieur|mesdames|messieurs|cher|chere|chers)( (a|et|tous|toutes|[\w'-]+)){0,4}\s*[,!.]*$/;
var SALUT_DEBUT = /^\s*(bonjour|bonsoir|salut|hello|coucou)( [\p{L}'-]+){0,2}\s*[,!]\s*/iu;
var CONGE = /^(tres |bien )?(cordialement|cdlt|cdt|bien a vous|salutations( distinguees)?|sinceres salutations|bonne (journee|soiree|reception|fin de journee|semaine|fin de semaine)|merci( d'avance| par avance| beaucoup| a vous| bien)?|a bientot|respectueusement|amicalement|bien sincerement)( et (bonne (journee|soiree|semaine)|merci( d'avance)?|a bientot))?\s*[,.!]*$/;
var decouper = (texte) => {
  const lignes = String(texte ?? "").split("\n");
  const p = lignes.map((l) => plat(l).trim());
  const suivantes = (i, n) => p.slice(i + 1).filter(Boolean).slice(0, n);
  let coupe = -1, saute = 0;
  for (let i = 0; i < p.length; i++) {
    const l = p[i];
    if (!l) continue;
    if (MARQUES.some((m) => m.test(l))) {
      coupe = i;
      saute = 1;
      break;
    }
    if (/^_{8,}$/.test(l) && suivantes(i, 2).some((x) => ENTETE_DE.test(x))) {
      coupe = i;
      saute = 1;
      break;
    }
    if (ENTETE_DE.test(l) && suivantes(i, 4).some((x) => ENTETE_SUITE.test(x))) {
      coupe = i;
      break;
    }
    if (A_ECRIT.test(l) || /^(le|on)\b/.test(l) && A_ECRIT.test(`${l} ${suivantes(i, 1)[0] ?? ""}`)) {
      coupe = i;
      break;
    }
    if (l.startsWith(">")) {
      coupe = i;
      break;
    }
  }
  let haut = coupe < 0 ? lignes : lignes.slice(0, coupe);
  const cite = coupe < 0 ? "" : lignesNettes(lignes.slice(coupe + saute).map((l) => l.replace(/^\s*(>\s?)+/, "")).join("\n"));
  const sep = haut.findIndex((l) => /^--\s?$/.test(l));
  if (sep >= 0) haut = haut.slice(0, sep);
  haut = haut.filter((l) => !PIED_MOBILE.test(plat(l).trim()));
  return { note: lignesNettes(haut.join("\n")), cite, transfert: coupe >= 0 };
};
var consigne = (note, signature = "") => {
  const sig = new Set(String(signature ?? "").split("\n").map((l) => plat(l).replace(/[*_>#]/g, "").trim()).filter((l) => l.length >= 4));
  const garde = [];
  for (const l of String(note ?? "").split("\n")) {
    const x = plat(l).trim();
    if (!x) {
      garde.push("");
      continue;
    }
    if (CONGE.test(x)) break;
    if (SALUT.test(x) && x.length <= 60) continue;
    if (sig.has(x.replace(/[*_>#]/g, "").trim())) continue;
    garde.push(l.replace(SALUT_DEBUT, ""));
  }
  return lignesNettes(garde.join("\n"));
};
var SUPPORTS = [
  { id: "post", nom: "publication sur les r\xE9seaux sociaux", simple: true, motif: "facebook|instagram|linkedin|reseaux sociaux|(?:sur|pour) (?:les|nos|vos) reseaux(?! d)|posts?" },
  { id: "actu", nom: "actualit\xE9 sur le site", simple: true, motif: "site internet|site web|(?:sur|pour|dans) (?:le|notre|votre) site(?! d)|actus?|actualites?" },
  { id: "agenda", nom: "agenda en ligne", simple: true, motif: "agenda" },
  { id: "affiche", nom: "affiche", motif: "affiches?" },
  { id: "flyer", nom: "flyer ou programme", motif: "flyers?|tracts?|depliants?|programmes?" },
  { id: "news", nom: "newsletter", motif: "newsletters?|lettres? d'information|infolettres?" },
  { id: "page", nom: "page du site", motif: "page du site|(?:nouvelle|une) page(?! facebook| instagram| linkedin)" },
  { id: "bulletin", nom: "page de bulletin ou de magazine", motif: "bulletin|magazine" },
  { id: "presse", nom: "communiqu\xE9 de presse", motif: "communiques?|presse" },
  { id: "photo", nom: "reportage photo", motif: "reportages?|photographe" },
  { id: "gabarit", nom: "visuel", motif: "visuels?|bandeaux?|bannieres?" }
].map((s) => ({ ...s, re: new RegExp(`\\b(?:${s.motif})\\b`), pour: new RegExp(`\\bpour\\s+(?:le |la |les |l'|notre |nos |votre |vos |un |une |du |des )?(?:page |compte |profil )?(?:${s.motif})\\b`), un: new RegExp(`\\b(?:un|une|des|d'un|d'une)\\s+(?:nouvelle |nouveau |petite |petit |belle |beau )?(?:${s.motif})\\b`) }));
var nomSupport = (id) => SUPPORTS.find((s) => s.id === id)?.nom ?? id;
var PUBLIER = "publier|poster|mettre|diffuser|relayer|partager|annoncer|ajouter|passer|inserer|inscrire";
var DEMANDE = new RegExp(
  `\\ba (?:${PUBLIER})\\b|\\b(?:merci de|merci d'|pouvez[- ]vous|pourriez[- ]vous|peux[- ]tu|pourrais[- ]tu|il faut|il faudrait|faudrait|je souhaite(?:rais)?|nous souhait(?:ons|erions)|j'aimerais|nous aimerions|je voudrais|nous voudrions|possible de|possible d'|priere de|priere d')\\s*(?:[\\w'-]+\\s+){0,3}?(?:${PUBLIER})\\b|\\b(?:publiez|postez|diffusez|relayez|partagez|annoncez|ajoutez)\\b`
);
var EVOCATION = /\b(?:un|une|des)\s+(?:post|publication|actu|actualite|annonce)\b|^(?:post|publication|actu|actualite)\b/;
var CREATION = /\b(creer|creez|creation|realiser|realisez|preparer|preparez|concevoir|concevez|refaire|rediger|redigez|maquette|mettre a jour)\b/;
var RESERVE = /\b(ne|pas|plus|rien|sans|sauf|hors|ni|jamais|aucun|aucune|deja|inutile|seulement|uniquement|peut-etre|eventuellement|attendez|attendre|attends|finalement|hier)\b|\bsi\b(?! possible)|\bn'|\bavant de\b|\bce matin\b|\ben attente\b/;
var RETRAIT = /\b(retir\w*|supprim\w*|enlev\w*|annul\w*|corrig\w*|correction|correctif|rectifi\w*|modifi\w*|depubli\w*|erreur|erreurs|mot de passe|identifiants?)\b/;
var JOINT = /\b(ci-joint|ci joint|ci-jointe|ci jointe|en piece jointe|en pieces jointes|en pj|en attache|joint|jointe|joints|jointes)\b/;
var PUBLIC = /\b(suivez|retrouvez|rejoignez|abonnez|likez|aimez|visitez|consultez|rendez-vous sur|plus d'infos? sur|renseignements sur|inscriptions? sur)\b|www\.|https?:|@/;
var phrases = (t) => plat(t).split(/[.!?;]+(?:\s+|$)|\n+|,?\s+(?=mais\b)/).map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);
var supportsDemandes = ({ objet = "", texte = "" }) => {
  const toutes = [...phrases(objet), ...phrases(texte)];
  const demandes = /* @__PURE__ */ new Set(), evoques = /* @__PURE__ */ new Set();
  let ambigu = toutes.some((p) => RETRAIT.test(p));
  for (const phrase of toutes) {
    if (PUBLIC.test(phrase)) continue;
    for (const s of SUPPORTS) {
      if (!s.re.test(phrase)) continue;
      if (RESERVE.test(phrase)) {
        ambigu = true;
        continue;
      }
      if (s.simple) {
        if (DEMANDE.test(phrase)) demandes.add(s.id);
        else if (EVOCATION.test(phrase) || s.pour.test(phrase)) evoques.add(s.id);
      } else {
        const creation = CREATION.test(phrase);
        if (JOINT.test(phrase) && !creation) continue;
        if (creation || s.un.test(phrase)) evoques.add(s.id);
      }
    }
  }
  const retenus = SUPPORTS.filter((s) => demandes.has(s.id) || evoques.has(s.id));
  return {
    lignes: retenus.map((s) => ({ prestation: s.id, quantite: 1 })),
    lourds: retenus.filter((s) => !s.simple).map((s) => s.id),
    ambigu,
    sur: demandes.size > 0 && evoques.size === 0 && !ambigu
  };
};
var MOIS = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
var AVANT_DATE = "\\b(?:a publier|a paraitre|a diffuser|a poster|a mettre en ligne|a relayer|a annoncer|publier|poster|diffuser|relayer|annoncer|mettre en ligne|parution|mise en ligne)\\s+(?:[\\w'-]+\\s+){0,6}?(?:le|au|avant le|pour le|d'ici le|d'ici au|au plus tard le|des le)\\s+(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche) )?";
var DATE_LETTRES = new RegExp(`${AVANT_DATE}(\\d{1,2})(?:er)?\\s+(${MOIS.join("|")})(?:\\s+(\\d{4}))?\\b`, "g");
var DATE_CHIFFRES = new RegExp(`${AVANT_DATE}(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?(?![\\d/.])`, "g");
var dateSouhaitee = (texte, aujourdhui) => {
  const [a0, m0, j0] = String(aujourdhui).split("-").map(Number);
  const dates = /* @__PURE__ */ new Set();
  let douteuse = false;
  const retenir = (jour, mois, an) => {
    if (!(mois >= 1 && mois <= 12 && jour >= 1 && jour <= 31)) return;
    const iso = (a) => `${a}-${String(mois).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
    const valide = (a) => {
      const d2 = /* @__PURE__ */ new Date(`${iso(a)}T12:00:00Z`);
      return !Number.isNaN(d2.getTime()) && d2.getUTCDate() === jour && d2.getUTCMonth() + 1 === mois;
    };
    let an2 = an ? an < 100 ? 2e3 + an : an : a0;
    if (!an && (mois < m0 || mois === m0 && jour <= j0)) {
      if ((m0 - mois + 12) % 12 < 6) {
        douteuse = true;
        return;
      }
      an2 = a0 + 1;
    }
    if (!valide(an2)) return;
    const d = iso(an2);
    const ecart = (Date.parse(`${d}T12:00:00Z`) - Date.parse(`${aujourdhui}T12:00:00Z`)) / 864e5;
    if (ecart >= 1 && ecart <= 366) dates.add(d);
    else douteuse = true;
  };
  for (const t of phrases(texte)) {
    for (const m of t.matchAll(DATE_LETTRES)) retenir(Number(m[1]), MOIS.indexOf(m[2]) + 1, m[3] ? Number(m[3]) : null);
    for (const m of t.matchAll(DATE_CHIFFRES)) retenir(Number(m[1]), Number(m[2]), m[3] ? Number(m[3]) : null);
  }
  return dates.size === 1 && !douteuse ? [...dates][0] : null;
};
var TYPES_REFUSES = /\.(exe|bat|cmd|com|scr|js|jse|mjs|vbs|vbe|wsf|wsh|ps1|msi|msp|jar|lnk|hta|cpl|dll|iso|img|reg|apk|html?|xhtml|shtml|mht|mhtml)$/i;
var ANNEXES = /\.(ics|vcf|p7s|p7m|asc|sig)$|^winmail\.dat$|^smime\.p7s$/i;
var trierPieces = (pieces = []) => {
  const gardees = [], ecartees = [];
  let total = 0;
  for (const p of pieces) {
    if (ANNEXES.test(p.nom)) continue;
    if (p.integree && /^image\//.test(p.type) && p.taille < 20 * 1024) continue;
    if (TYPES_REFUSES.test(p.nom)) {
      ecartees.push({ nom: p.nom, motif: "type" });
      continue;
    }
    if (!p.jeton) {
      ecartees.push({ nom: p.nom, motif: "illisible" });
      continue;
    }
    if (p.taille > LIMITES.octetsPiece) {
      ecartees.push({ nom: p.nom, motif: "poids" });
      continue;
    }
    if (gardees.length >= LIMITES.pieces || total + p.taille > LIMITES.octetsTotal) {
      ecartees.push({ nom: p.nom, motif: "nombre" });
      continue;
    }
    total += p.taille;
    gardees.push(p);
  }
  return { gardees, ecartees };
};
var cheminPiece = (organisation, dossier, nom, horodatage) => `${organisation}/${dossier}/${horodatage}-${String(nom).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w.\-]+/g, "_").slice(0, 100)}`;
var couper = (t, max) => {
  if (t.length <= max) return t;
  const c = t.slice(0, max - 1);
  const e = c.lastIndexOf(" ");
  return sain(e > max * 0.6 ? c.slice(0, e) : c).trimEnd() + "\u2026";
};
var analyser = (mail, c = {}) => {
  const aujourdhui = c.aujourdhui;
  const s = sujetNettoye(mail.sujet);
  const d = decouper(mail.texte);
  const transfert = s.transfert || s.reponse || d.transfert;
  const mots = consigne(d.note, mail.signature);
  const { gardees, ecartees } = trierPieces(mail.pieces);
  let titre = couper(s.titre, LIMITES.titre);
  if ([...titre].length < 3) {
    const premiere = (mots || d.cite).split("\n").map((l) => l.trim()).find((l) => l.length >= 3 && !ENTETE_DE.test(plat(l)) && !ENTETE_SUITE.test(plat(l))) ?? "";
    titre = couper(premiere.replace(/\s+/g, " "), 90);
  }
  if ([...titre].length < 3) titre = "";
  const blocs = [d.note, d.cite ? `Message transf\xE9r\xE9 :
${d.cite}` : ""].filter(Boolean);
  let brief = blocs.join("\n\n");
  if (brief.length > LIMITES.brief) brief = sain(brief.slice(0, LIMITES.brief - 60)).trimEnd() + "\n[\u2026] Texte abr\xE9g\xE9 : le mail d\u2019origine \xE9tait plus long.";
  const matiere = (mots + d.cite).replace(/\s+/g, "").length;
  if (!brief && gardees.length) brief = "Information dans les pi\xE8ces jointes du mail.";
  const sup = supportsDemandes({ objet: transfert ? "" : s.titre, texte: mots });
  const parution = aujourdhui ? dateSouhaitee(`${transfert ? "" : s.titre}. ${mots}`, aujourdhui) : null;
  const base = { titre: titre || null, brief, parution, lignes: sup.lignes, pieces: gardees, piecesEcartees: ecartees, transfert };
  if (!base.titre || matiere < 20 && !gardees.length) return { ...base, decision: "completer", motif: "contenu_insuffisant" };
  if (c.authentification === "echec") return { ...base, decision: "completer", motif: "origine_en_echec" };
  if (c.authentification !== "ok" && c.origine !== "adresse") return { ...base, decision: "completer", motif: "origine_non_prouvee" };
  if (!sup.lignes.length) return { ...base, decision: "completer", motif: "support_manquant" };
  if (!sup.sur) return { ...base, decision: "completer", motif: "support_a_confirmer" };
  return { ...base, decision: "deposer", motif: null };
};
var pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;
var jourLong = (iso) => (/* @__PURE__ */ new Date(`${iso}T12:00:00Z`)).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
var enListe = (l) => l.length <= 1 ? l.join("") : `${l.slice(0, -1).join(", ")} et ${l[l.length - 1]}`;
var MOTIFS_PIECE = {
  poids: "trop lourde pour \xEAtre reprise d\u2019un mail (15 Mo au plus)",
  nombre: "au-del\xE0 de ce qu\u2019un mail peut apporter (8 pi\xE8ces, 30 Mo au total)",
  type: "d\u2019un type de fichier que Fill ne reprend pas",
  illisible: "illisible \xE0 la r\xE9ception",
  erreur: "non reprise \xE0 la r\xE9ception"
};
var phrasesPieces = (ecartees = []) => ecartees.slice(0, 6).map((p) => `La pi\xE8ce \xAB ${p.nom} \xBB n\u2019a pas \xE9t\xE9 reprise : ${MOTIFS_PIECE[p.motif] ?? MOTIFS_PIECE.erreur}. Envoyez-la par un lien de t\xE9l\xE9chargement, en r\xE9ponse \xE0 ce message.`);
var mailRecu = ({ titre, unites, supports, parution, pieces, ecartees, adresseInconnue }) => ({
  sujet: `Bien re\xE7u : ${titre}`,
  titre: "Votre demande est enregistr\xE9e",
  texte: [
    `\xAB ${titre} \xBB : ${enListe(supports)}, ${pluriel(unites, "unit\xE9")}${parution ? `, \xE0 publier le ${jourLong(parution)}` : ""}${pieces ? `, ${pluriel(pieces, "pi\xE8ce")} jointe${pieces > 1 ? "s" : ""}` : ""}.`,
    "Fill la confirme avec sa date de livraison. Vous relirez ensuite la version sur un lien."
  ],
  bouton: "Voir la demande",
  apres: [
    ...phrasesPieces(ecartees),
    "Ce n\u2019est pas ce que vous attendiez ? R\xE9pondez \xE0 ce message, ou annulez la demande dans votre espace : les unit\xE9s reviennent sur le compte.",
    adresseInconnue ? `L\u2019adresse utilis\xE9e n\u2019est pas celle de votre structure. La bonne adresse : ${adresseInconnue}.` : ""
  ].filter(Boolean)
});
var MANQUES = {
  support_manquant: (c) => [
    "Votre mail est bien arriv\xE9. Il ne dit pas sur quel support publier (r\xE9seaux sociaux, site, agenda, affiche\u2026) : rien n\u2019est donc engag\xE9.",
    `La demande est d\xE9j\xE0 remplie avec votre texte${c.pieces ? " et vos pi\xE8ces jointes" : ""}. Choisissez le support, puis envoyez.`
  ],
  support_a_confirmer: (c) => [
    `Votre mail est bien arriv\xE9. ${c.supports.length ? `Il semble demander : ${enListe(c.supports)}.` : ""} Ce choix se confirme dans votre espace, o\xF9 le nombre d\u2019unit\xE9s s\u2019affiche avant l\u2019envoi : rien n\u2019est engag\xE9 d\u2019ici l\xE0.`.replace(/\s+/g, " "),
    `La demande est d\xE9j\xE0 remplie avec votre texte${c.pieces ? " et vos pi\xE8ces jointes" : ""}. V\xE9rifiez les supports, puis envoyez.`
  ],
  contenu_insuffisant: () => [
    "Votre mail est bien arriv\xE9, mais il ne contient ni texte ni pi\xE8ce jointe \xE0 partir desquels travailler. Rien n\u2019est engag\xE9.",
    "Renvoyez l\u2019information \xE0 la m\xEAme adresse, ou d\xE9crivez la demande dans votre espace."
  ],
  sans_unites: (c) => [
    `Votre mail est bien arriv\xE9, mais il ne reste pas assez d\u2019unit\xE9s sur le compte pour cette demande${c.detail ? ` (${c.detail})` : ""}. Rien n\u2019est engag\xE9.`,
    "La demande est d\xE9j\xE0 remplie : elle pourra partir d\xE8s que le compte sera recharg\xE9, depuis votre espace."
  ],
  origine_non_prouvee: (c) => [
    "Votre mail est bien arriv\xE9. Son origine n\u2019a pas pu \xEAtre v\xE9rifi\xE9e automatiquement : par pr\xE9caution, rien n\u2019est engag\xE9.",
    `La demande est d\xE9j\xE0 remplie avec votre texte${c.pieces ? " et vos pi\xE8ces jointes" : ""}. Il reste \xE0 l\u2019envoyer depuis votre espace. Si ce mail ne vient pas de vous, ignorez ce message.`
  ],
  origine_en_echec: () => [
    "Un mail est arriv\xE9 \xE0 votre nom, mais le contr\xF4le de son origine a \xE9chou\xE9. Par pr\xE9caution, rien n\u2019est engag\xE9 et ses pi\xE8ces jointes n\u2019ont pas \xE9t\xE9 conserv\xE9es.",
    "Si ce mail vient bien de vous, la demande est d\xE9j\xE0 remplie avec son texte : il reste \xE0 l\u2019envoyer depuis votre espace. Sinon, ignorez ce message."
  ],
  depot_impossible: () => [
    "Votre mail est bien arriv\xE9, mais la demande n\u2019a pas pu \xEAtre enregistr\xE9e automatiquement. Rien n\u2019est engag\xE9.",
    "Elle est d\xE9j\xE0 remplie avec votre texte : il reste \xE0 l\u2019envoyer depuis votre espace."
  ]
};
var mailACompleter = ({ motif, titre, supports = [], pieces = 0, ecartees = [], detail = null }) => ({
  sujet: `\xC0 compl\xE9ter : ${titre || "votre demande"}`,
  titre: motif === "contenu_insuffisant" ? "Il manque l\u2019information" : motif === "sans_unites" ? "Il manque des unit\xE9s" : motif === "support_manquant" ? "Il manque le support" : "Votre confirmation est n\xE9cessaire",
  texte: (MANQUES[motif] ?? MANQUES.depot_impossible)({ supports, pieces, detail }),
  bouton: motif === "contenu_insuffisant" ? "Ouvrir mon espace" : "Terminer la demande",
  apres: [...phrasesPieces(ecartees), motif === "contenu_insuffisant" ? "" : `Ce lien reste valable ${LIMITES.joursLien} jours. Une question ? R\xE9pondez \xE0 ce message.`].filter(Boolean)
});
var MOTIFS_FILL = {
  support_manquant: "aucun support nomm\xE9",
  support_a_confirmer: "supports \xE0 confirmer (prestation \xE0 plusieurs unit\xE9s, r\xE9serve ou tournure incertaine)",
  contenu_insuffisant: "ni texte ni pi\xE8ce jointe",
  sans_unites: "unit\xE9s insuffisantes",
  origine_non_prouvee: "origine du mail non prouv\xE9e",
  origine_en_echec: "contr\xF4le d\u2019origine en \xE9chec (adresse peut-\xEAtre imit\xE9e)",
  depot_impossible: "d\xE9p\xF4t refus\xE9 par la base"
};
var mailPourFill = ({ motif, titre, organisation, expediteur, extrait, pieces = 0 }) => ({
  sujet: `Mail non d\xE9pos\xE9 : ${titre || "sans objet"} (${organisation})`,
  titre: `Un mail de ${organisation} attend son auteur`,
  texte: [
    `${expediteur} a \xE9crit \xE0 l\u2019adresse de transfert. Rien n\u2019est d\xE9pos\xE9 : ${MOTIFS_FILL[motif] ?? motif}. Le client a re\xE7u une r\xE9ponse avec le lien vers la demande pr\xE9-remplie${pieces ? `, ${pluriel(pieces, "pi\xE8ce")} conserv\xE9e${pieces > 1 ? "s" : ""}` : ""}.`,
    extrait ? `<i>${extrait}</i>` : "",
    "S\u2019il s\u2019agit d\u2019une question, d\u2019un retrait ou d\u2019une correction, r\xE9pondez directement : ce message r\xE9pond \xE0 son auteur."
  ].filter(Boolean),
  bouton: null
});
var mailRefus = ({ cas, expediteur, adressePropre }) => {
  const t = {
    inconnu: {
      sujet: "Adresse non reconnue : votre mail n\u2019a pas \xE9t\xE9 enregistr\xE9",
      titre: "Votre adresse n\u2019est pas reconnue",
      texte: [
        `Cette adresse re\xE7oit les demandes des personnes inscrites \xE0 l\u2019espace Fill de leur structure. ${expediteur} n\u2019y figure pas : rien n\u2019a \xE9t\xE9 enregistr\xE9.`,
        "\xC9crivez depuis l\u2019adresse de votre compte, ou demandez au r\xE9f\xE9rent de votre structure de vous inviter (menu \xC9quipe)."
      ],
      bouton: null
    },
    lecteur: {
      sujet: "Demande non enregistr\xE9e : compte en lecture seule",
      titre: "Votre compte permet de suivre, pas de demander",
      texte: ["Votre compte est en lecture seule : rien n\u2019a \xE9t\xE9 enregistr\xE9.", "Le r\xE9f\xE9rent de votre structure peut vous donner le droit de d\xE9poser des demandes (menu \xC9quipe), ou envoyer lui-m\xEAme ce mail."],
      bouton: "Ouvrir mon espace"
    },
    autre_structure: {
      sujet: "Demande non enregistr\xE9e : adresse d\u2019une autre structure",
      titre: "Cette adresse n\u2019est pas celle de votre structure",
      texte: ["L\u2019adresse \xE0 laquelle vous avez \xE9crit n\u2019est pas celle de votre structure : rien n\u2019a \xE9t\xE9 enregistr\xE9.", adressePropre ? `Renvoyez votre mail \xE0 ${adressePropre}.` : "Retrouvez l\u2019adresse de votre structure dans votre mail de bienvenue."],
      bouton: null
    },
    resiliee: {
      sujet: "Demande non enregistr\xE9e : abonnement termin\xE9",
      titre: "L\u2019abonnement de votre structure est termin\xE9",
      texte: ["Rien n\u2019a \xE9t\xE9 enregistr\xE9. Pour reprendre, r\xE9pondez simplement \xE0 ce message."],
      bouton: null
    }
  };
  return t[cas] ?? t.inconnu;
};

// supabase/functions/reception/traiter.ts
var refusBase = (e) => e?.code === "P0001" || /^(22|23)/.test(String(e?.code ?? ""));
var Panne = class extends Error {
};
var estPanne = (e) => e instanceof Panne;
var TYPES_SURS = /^(image\/(jpeg|png|gif|webp|heic|heif|tiff|bmp)|application\/pdf|video\/[\w.+-]+|audio\/[\w.+-]+|text\/plain|text\/csv)$/;
var rangerPieces = async (d, organisation, dossier, pieces) => {
  const rangees = [], ecartees = [];
  let rang = 0;
  for (const p of pieces) {
    try {
      const octets = await d.telecharger(p.jeton);
      if (!octets) {
        ecartees.push({ nom: p.nom, motif: "erreur" });
        continue;
      }
      if (octets.byteLength > LIMITES.octetsPiece) {
        ecartees.push({ nom: p.nom, motif: "poids" });
        continue;
      }
      const chemin = cheminPiece(organisation, dossier, p.nom, d.maintenant() + rang++);
      if (await d.ranger(chemin, octets, TYPES_SURS.test(p.type) ? p.type : "application/octet-stream")) rangees.push({ nom: p.nom, chemin, taille: octets.byteLength, type: p.type || null });
      else ecartees.push({ nom: p.nom, motif: "erreur" });
    } catch {
      ecartees.push({ nom: p.nom, motif: "erreur" });
    }
  }
  return { rangees, ecartees };
};
var traiter = async (item, d) => {
  const mail = lireMail(item, d.domaine);
  if (!mail) return { issue: "illisible" };
  const ecart = automatique(mail, { domaine: d.domaine, adressesFill: d.adressesFill });
  const origine = authentification(mail.entetes, mail.de);
  const ouv = await d.rpc("mail_ouvrir", {
    p_message_id: mail.id,
    p_expediteur: mail.de,
    p_destinataires: mail.destinataires,
    p_sujet: mail.sujet || null,
    p_ecarter: ecart
  });
  if (ouv.error) {
    if (refusBase(ouv.error)) return { issue: "illisible" };
    throw new Panne(ouv.error.message ?? "mail_ouvrir");
  }
  const r = ouv.data ?? {};
  if (r.cas === "en_cours") throw new Panne("message encore en cours de traitement");
  const e = d.echap;
  const enReponseA = /^<[^<>\s]+@[^<>\s]+>$/.test(mail.id) ? mail.id : null;
  const repondre = async (essai, sujet, t, lien) => {
    const parti = await d.envoyer({
      a: [{ email: mail.de, ...mail.nom ? { name: mail.nom } : {} }],
      essai,
      enReponseA,
      sujet,
      titre: t.titre,
      texte: t.texte,
      apres: t.apres,
      bouton: t.bouton && lien ? { libelle: t.bouton, lien } : null
    }).catch(() => false);
    if (parti) await d.rpc("mail_repondu", { p_mail: r.mail }).catch(() => null);
    return parti;
  };
  if (["doublon", "ecarte", "trop", "equipe"].includes(r.cas)) return { issue: "ignore", motif: r.cas === "ecarte" ? ecart : r.cas };
  if (r.cas !== "ok") {
    const muet = !r.repondre || r.cas === "inconnu" && ((mail.spam ?? 0) >= 5 || origine === "echec");
    const propre2 = r.organisation?.alias ? adresseTransfert(r.organisation.alias, d.domaine) : null;
    const suite2 = muet ? null : (async () => {
      const brut = mailRefus({ cas: r.cas, expediteur: mail.de, adressePropre: propre2 });
      await repondre(Boolean(r.organisation?.essai), brut.sujet, mailRefus({ cas: r.cas, expediteur: e(mail.de), adressePropre: propre2 }), brut.bouton ? `${d.site}/` : null);
    })();
    return { issue: "refuse", motif: r.cas, suite: suite2 };
  }
  const org = r.organisation;
  const a = analyser(mail, { aujourdhui: d.aujourdhui, authentification: origine, origine: d.origine });
  const supports = a.lignes.map((l) => nomSupport(l.prestation));
  let motif = a.motif, detail = null;
  if (a.decision === "deposer") {
    const dep = await d.rpc("mail_deposer", { p_mail: r.mail, p_titre: a.titre, p_lignes: a.lignes, p_parution: a.parution, p_brief: a.brief });
    if (!dep.error) {
      const demande = dep.data;
      const suite2 = (async () => {
        await d.notifier({ evenement: "depot", demande }).catch(() => null);
        let { rangees, ecartees } = await rangerPieces(d, org.id, demande, a.pieces);
        let toutes = [...a.piecesEcartees, ...ecartees];
        if (rangees.length || toutes.length) {
          const pj = await d.rpc("mail_pieces", { p_mail: r.mail, p_pieces: [...rangees, ...toutes] }).catch(() => ({ error: true }));
          if (pj?.error) {
            toutes = [...toutes, ...rangees.map((p) => ({ nom: p.nom, motif: "erreur" }))];
            rangees = [];
          }
        }
        const unites = await d.unites(demande).catch(() => null) ?? a.lignes.length;
        const c = { unites, supports, parution: a.parution, pieces: rangees.length, adresseInconnue: r.alias_inconnu ? adresseTransfert(org.alias, d.domaine) : null };
        const brut = mailRecu({ ...c, titre: a.titre, ecartees: toutes });
        await repondre(org.essai, brut.sujet, mailRecu({ ...c, titre: e(a.titre), ecartees: toutes.map((p) => ({ ...p, nom: e(p.nom) })) }), `${d.site}/#demande-${demande}`);
      })();
      return { issue: "deposee", demande, suite: suite2 };
    }
    if (!refusBase(dep.error)) throw new Panne(dep.error.message ?? "mail_deposer");
    const m = String(dep.error.message ?? "");
    motif = /^Unit\u00e9s insuffisantes/.test(m) ? "sans_unites" : "depot_impossible";
    detail = motif === "sans_unites" ? (m.match(/cette demande compte [^.]+/) ?? [null])[0] : null;
  }
  const vide = motif === "contenu_insuffisant";
  let cl = await d.rpc("mail_classer", {
    p_mail: r.mail,
    p_issue: vide ? "refuse" : "a_completer",
    p_motif: motif,
    p_titre: a.titre,
    p_texte: a.brief,
    p_parution: a.parution,
    p_lignes: a.lignes
  });
  if (cl.error && cl.error.code !== "P0001" && refusBase(cl.error)) {
    cl = await d.rpc("mail_classer", { p_mail: r.mail, p_issue: "refuse", p_motif: "depot_impossible", p_titre: null, p_texte: null, p_parution: null, p_lignes: [] });
    if (!cl.error) return { issue: "refuse", motif: "depot_impossible", suite: null };
  }
  if (cl.error && !refusBase(cl.error)) throw new Panne(cl.error.message ?? "mail_classer");
  if (cl.error) return { issue: "ignore", motif: "deja_traite" };
  const suite = (async () => {
    const sansPieces = vide || motif === "origine_en_echec";
    let { rangees, ecartees } = sansPieces ? { rangees: [], ecartees: [] } : await rangerPieces(d, org.id, `mail/${r.mail}`, a.pieces);
    let toutes = sansPieces ? [] : [...a.piecesEcartees, ...ecartees];
    if (rangees.length || toutes.length) {
      const pj = await d.rpc("mail_pieces", { p_mail: r.mail, p_pieces: [...rangees, ...toutes] }).catch(() => ({ error: true }));
      if (pj?.error) {
        toutes = [...toutes, ...rangees.map((p) => ({ nom: p.nom, motif: "erreur" }))];
        rangees = [];
      }
    }
    const c = { motif, supports, pieces: rangees.length, detail };
    const brut = mailACompleter({ ...c, titre: a.titre, ecartees: toutes });
    await repondre(
      org.essai,
      brut.sujet,
      mailACompleter({ ...c, titre: e(a.titre ?? ""), detail: detail ? e(detail) : null, ecartees: toutes.map((p) => ({ ...p, nom: e(p.nom) })) }),
      vide ? `${d.site}/#nouvelle` : `${d.site}/?mail=${r.mail}`
    );
    const extrait = a.brief.replace(/\s+/g, " ").trim().slice(0, 400);
    const pf = { motif, organisation: org.nom, expediteur: r.profil?.nom ?? mail.de, pieces: rangees.length };
    await d.alerter({
      essai: org.essai,
      repondreA: { email: mail.de, name: r.profil?.nom ?? mail.nom ?? mail.de },
      ...mailPourFill({ ...pf, organisation: e(org.nom), expediteur: e(pf.expediteur), titre: e(a.titre ?? ""), extrait: e(extrait) }),
      sujet: mailPourFill({ ...pf, titre: a.titre }).sujet
    }).catch(() => null);
  })();
  return { issue: vide ? "refuse" : "a_completer", motif, suite };
};

// supabase/functions/reception/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var json = (corps, status = 200) => new Response(JSON.stringify(corps), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
var BREVO = "https://api.brevo.com/v3";
var egales = async (a, b) => {
  const h = async (t) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(t))));
  const [x, y] = await Promise.all([h(a), h(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
};
Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ erreur: "M\xE9thode refus\xE9e" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const domaine = (Deno.env.get("DOMAINE_RECEPTION") ?? DOMAINE_DEFAUT).trim().toLowerCase();
  const cleWebhook = Deno.env.get("RECEPTION_CLE") ?? "";
  const cleBrevo = Deno.env.get("BREVO_API_KEY") ?? "";
  const expediteur = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  const porteur = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  let s;
  try {
    s = await req.json();
  } catch {
    s = null;
  }
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  if (s && typeof s === "object" && typeof s.action === "string") {
    const autorise = Boolean(CLE_SECRETE) && porteur.length >= 32 && (porteur === CLE_SECRETE || (await admin.rpc("verifier_jeton_pilote", { p: porteur })).data === true);
    if (!autorise) return json({ erreur: "R\xE9serv\xE9 au serveur" }, 401);
    if (s.action !== "webhook") return json({ erreur: "Action inconnue" }, 400);
    if (!cleBrevo) return json({ erreur: "BREVO_API_KEY manquante" }, 503);
    if (cleWebhook.length < 24) return json({ erreur: "Secret RECEPTION_CLE manquant ou trop court (24 caract\xE8res au moins)" }, 503);
    const cible = `${url}/functions/v1/reception?cle=${encodeURIComponent(cleWebhook)}`;
    const brevo = (chemin, init = {}) => fetch(`${BREVO}${chemin}`, { ...init, headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" } });
    const masque = (u) => String(u ?? "").replace(/([?&]cle=)[^&]+/, "$1\u2026");
    const lu = await brevo("/webhooks?type=inbound").catch(() => null);
    if (!lu?.ok) return json({ erreur: "Brevo ne r\xE9pond pas \xE0 la lecture des webhooks", statut: lu?.status ?? null }, 502);
    const tous = ((await lu.json().catch(() => ({}))).webhooks ?? []).filter((w) => w?.type === "inbound");
    const dudomaine = tous.filter((w) => String(w.domain ?? "").toLowerCase() === domaine);
    let conforme = dudomaine.find((w) => w.url === cible) ?? null;
    let fait = "rien";
    if (!conforme && s.creer === true) {
      const corps = { type: "inbound", events: ["inboundEmailProcessed"], url: cible, domain: domaine, description: "Fill : adresses de transfert" };
      if (!dudomaine.length) {
        const r = await brevo("/webhooks", { method: "POST", body: JSON.stringify(corps) }).catch(() => null);
        if (!r?.ok) return json({ erreur: "Brevo a refus\xE9 la cr\xE9ation du webhook", statut: r?.status ?? null, detail: await r?.text().catch(() => null) }, 502);
        conforme = { id: (await r.json().catch(() => ({}))).id ?? null, url: cible };
        fait = "cree";
      } else if (s.remplacer === true) {
        const r = await brevo(`/webhooks/${dudomaine[0].id}`, { method: "PUT", body: JSON.stringify({ url: cible, events: corps.events, domain: domaine, description: corps.description }) }).catch(() => null);
        if (!r?.ok) return json({ erreur: "Brevo a refus\xE9 la mise \xE0 jour du webhook", statut: r?.status ?? null, detail: await r?.text().catch(() => null) }, 502);
        conforme = { id: dudomaine[0].id, url: cible };
        fait = "remplace";
      }
    }
    const mx = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domaine)}&type=MX`).then((r) => r.json()).then((j) => (j.Answer ?? []).map((a) => String(a.data).toLowerCase().replace(/\.$/, ""))).catch(() => null);
    const attendus = ["10 inbound1.sendinblue.com", "20 inbound2.sendinblue.com"];
    return json({
      domaine,
      fait,
      conforme: Boolean(conforme),
      webhook: conforme ? { id: conforme.id, url: masque(conforme.url) } : null,
      autres: dudomaine.filter((w) => w.id !== conforme?.id).map((w) => ({ id: w.id, url: masque(w.url) })),
      mx,
      mx_ok: Array.isArray(mx) ? attendus.every((a) => mx.includes(a)) : null,
      conseil: conforme ? null : dudomaine.length ? "Un webhook existe pour ce domaine avec une autre adresse : relancer avec remplacer:true." : "Aucun webhook pour ce domaine : relancer avec creer:true."
    });
  }
  const presentee = new URL(req.url).searchParams.get("cle") ?? req.headers.get("x-reception-cle") ?? porteur;
  if (cleWebhook.length < 24) return json({ erreur: "R\xE9ception non configur\xE9e" }, 503);
  if (!presentee || !await egales(presentee, cleWebhook)) return json({ erreur: "Acc\xE8s refus\xE9" }, 401);
  const items = Array.isArray(s?.items) ? s.items : s && typeof s === "object" && s.From ? [s] : [];
  if (!items.length) return json({ ok: true, mails: [] });
  const d = {
    domaine,
    site: SITE,
    echap,
    origine: Deno.env.get("RECEPTION_ORIGINE") === "adresse" ? "adresse" : "preuve",
    adressesFill: [expediteur, pourFill, "contact@studioes.fr"],
    aujourdhui: (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }),
    maintenant: () => Date.now(),
    rpc: async (nom, args) => await admin.rpc(nom, args),
    unites: async (id) => (await admin.from("demande").select("unites").eq("id", id).single()).data?.unites ?? null,
    telecharger: async (jeton) => {
      if (!cleBrevo || !jeton) return null;
      const r = await fetch(`${BREVO}/inbound/attachments/${encodeURIComponent(jeton)}`, { headers: { "api-key": cleBrevo } });
      if (!r.ok) return null;
      if (Number(r.headers.get("content-length") ?? 0) > LIMITES.octetsPiece) {
        await r.body?.cancel();
        return new Uint8Array(LIMITES.octetsPiece + 1);
      }
      return new Uint8Array(await r.arrayBuffer());
    },
    ranger: async (chemin, octets, type) => !(await admin.storage.from("fichiers").upload(chemin, octets, { contentType: type, upsert: false })).error,
    notifier: (corps) => fetch(`${url}/functions/v1/notifier`, { method: "POST", headers: { Authorization: `Bearer ${CLE_SECRETE}`, "content-type": "application/json" }, body: JSON.stringify(corps) }),
    envoyer: async (m) => {
      if (!cleBrevo || !m?.a?.length) return false;
      const corps = {
        sender: { name: "Fill", email: expediteur },
        to: m.a,
        replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
        subject: `${m.essai ? "[Test] " : ""}${m.sujet}`,
        htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres })
      };
      const entetes = { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All", ...m.enReponseA ? { "In-Reply-To": m.enReponseA, References: m.enReponseA } : {} };
      const poster = (c) => fetch(`${BREVO}/smtp/email`, { method: "POST", headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(c) }).catch(() => null);
      let r = await poster({ ...corps, headers: entetes });
      if (r && !r.ok && r.status === 400) r = await poster(corps);
      return Boolean(r?.ok);
    },
    alerter: async (m) => {
      if (!cleBrevo) return false;
      const r = await fetch(`${BREVO}/smtp/email`, {
        method: "POST",
        headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { name: "Fill", email: expediteur },
          to: [{ email: pourFill }],
          replyTo: m.repondreA,
          subject: `${m.essai ? "[Test] " : ""}${m.sujet}`,
          htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres })
        })
      }).catch(() => null);
      return Boolean(r?.ok);
    }
  };
  const bilan = [], suites = [];
  let panne = false;
  if (items.length > LIMITES.mails) console.error(`reception : ${items.length} mails dans un m\xEAme appel, ${LIMITES.mails} trait\xE9s`);
  for (const item of items.slice(0, LIMITES.mails)) {
    try {
      const r = await traiter(item, d);
      if (r.suite) suites.push(r.suite.catch((e) => console.error("reception, suite :", e?.message ?? e)));
      bilan.push({ issue: r.issue, motif: r.motif ?? null });
    } catch (e) {
      if (estPanne(e)) panne = true;
      console.error("reception :", e?.message ?? e);
      bilan.push({ issue: "erreur" });
    }
  }
  suites.push((async () => {
    const { data: chemins } = await admin.rpc("mail_purger", { p_jours: LIMITES.joursLien });
    for (let i = 0; Array.isArray(chemins) && i < chemins.length; i += 100) await admin.storage.from("fichiers").remove(chemins.slice(i, i + 100));
  })().catch(() => null));
  const fin = Promise.all(suites);
  const tache = globalThis.EdgeRuntime?.waitUntil;
  if (typeof tache === "function") tache.call(globalThis.EdgeRuntime, fin);
  else await fin;
  return json({ ok: !panne, mails: bilan }, panne ? 500 : 200);
});
