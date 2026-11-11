// Règles de l'adresse de transfert : lecture d'un mail entrant (format remis par Brevo), tri des mails
// automatiques, découpe entre ce qu'écrit le client et ce qu'il transfère, puis décision.
//
// Principe : rien n'est déposé à l'aveugle. Un mail ne devient une demande que si le client nomme lui-même,
// dans une consigne, un support courant à une unité (publication sur les réseaux, actualité du site, agenda).
// Tout support plus lourd (affiche, flyer, newsletter…), toute tournure négative ou incertaine, tout mail sans
// support nommé passe par le lien vers la nouvelle demande pré-remplie, où le total s'affiche avant l'envoi.
// Le texte transféré (le mail d'un service, d'une association) n'est jamais interprété : il devient le brief.
//
// Module sans dépendance au serveur : testé tel quel (tests/reception.test.mjs).
import { DOMAINE_DEFAUT } from './transfert.ts';

export const LIMITES = {
  mails: 25,                        // mails traités par appel du webhook
  pieces: 8,                        // pièces jointes reprises par mail
  octetsPiece: 15 * 1024 * 1024,    // au-delà, la pièce n'est pas reprise
  octetsTotal: 30 * 1024 * 1024,
  brief: 6000,
  texte: 60000,
  titre: 140,
  joursLien: 30,
};

export const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

// texte comparable : sans casse ni accents, apostrophes droites
export const plat = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’‘`´]/g, "'");
// texte que la base accepte : sans caractère nul ni moitié d'émoji laissée par une coupe
export const sain = (t) => String(t ?? "").replace(/\u0000/g, "").replace(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g, "");
const propre = (t, max) => sain(String(t ?? "").replace(/\s+/g, " ").trim().slice(0, max)).trim();
const liste = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);

// adresse d'une boîte : {Address, Name}, « Nom <a@b.fr> » ou « a@b.fr »
export const adresse = (v) => {
  const brut = typeof v === "string" ? v : v && typeof v === "object" ? (v.Address ?? v.address ?? v.Email ?? v.email) : null;
  if (typeof brut !== "string") return null;
  const m = brut.match(/<([^<>]+)>/);
  const a = (m ? m[1] : brut).trim().toLowerCase();
  return EMAIL.test(a) && a.length <= 254 ? a : null;
};

const ENTITES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", eacute: "é", egrave: "è", ecirc: "ê", agrave: "à", acirc: "â", ccedil: "ç", ugrave: "ù", ucirc: "û", ocirc: "ô", icirc: "î", iuml: "ï", euml: "ë", laquo: "«", raquo: "»", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", ndash: "-", mdash: "-", euro: "€", deg: "°" };
// mail sans version texte : le HTML est ramené à des lignes
export const htmlVersTexte = (html) =>
  String(html ?? "")
    .replace(/<(style|script|head|title)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h[1-6]|blockquote|table)>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCodePoint(Number(n)); } catch { return ""; } })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => { try { return String.fromCodePoint(parseInt(n, 16)); } catch { return ""; } })
    .replace(/&([a-z]+);/gi, (tout, n) => {
      const v = ENTITES[n.toLowerCase()];
      return v === undefined ? tout : /^[A-Z]/.test(n) ? v.toUpperCase() : v;
    });

const lignesNettes = (t) =>
  String(t ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[   ]/g, " ")
    .replace(/[​-‍﻿]/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// empreinte courte et stable, pour un mail arrivé sans identifiant
const empreinteCourte = (t) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
};

const nomFichier = (n) => propre(String(n ?? "").replace(/[\\/]+/g, " ").replace(/[\u0000-\u001f]/g, ""), 120).replace(/[. ]+$/, "") || "piece-jointe";

// Un élément de « items » du webhook Brevo → mail normalisé. Renvoie null si l'expéditeur est illisible :
// un mail mal formé ne fait jamais planter la réception.
export const lireMail = (item, domaine = DOMAINE_DEFAUT) => {
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
  const brut = typeof item.RawTextBody === "string" && item.RawTextBody.trim() ? item.RawTextBody
    : typeof item.RawHtmlBody === "string" && item.RawHtmlBody.trim() ? htmlVersTexte(item.RawHtmlBody)
    : typeof item.ExtractedMarkdownMessage === "string" ? item.ExtractedMarkdownMessage : "";
  const texte = lignesNettes(sain(brut.slice(0, LIMITES.texte)));
  const pieces = liste(item.Attachments).filter((a) => a && typeof a === "object").slice(0, 40).map((a) => ({
    nom: nomFichier(a.Name),
    type: String(a.ContentType ?? "").toLowerCase().split(";")[0].trim(),
    taille: Math.max(0, Math.round(Number(a.ContentLength) || 0)),
    integree: Boolean(a.ContentID),
    jeton: typeof a.DownloadToken === "string" && a.DownloadToken ? a.DownloadToken : null,
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
    signature: typeof item.ExtractedMarkdownSignature === "string" ? lignesNettes(sain(item.ExtractedMarkdownSignature.slice(0, 4000))) : "",
    entetes,
    pieces,
    spam: Number.isFinite(spam) ? spam : null,
  };
};

// --- mails automatiques et boucles -------------------------------------------------------------------

const ROBOTS = /^(mailer-daemon|postmaster|no-?reply|noreply|ne-?pas-?repondre|nepasrepondre|do-?not-?reply|bounces?|notifications?|newsletter|news|mailer|daemon)([+._-]|$)/;
const SUJETS_AUTO = /^(reponse automatique|automatic reply|auto ?-?reply|autoreply|absen(t|te|ce) du bureau|out of (the )?office|message d'absence|absence\s*:|undeliverable|undelivered|non remis|non distribue|delivery status notification|mail delivery (failed|failure|subsystem)|echec de (la )?remise|returned mail|failure notice|accuse de (reception|lecture)|lu\s*:|read\s*:|message lu)/;
// objets des réponses de Fill : y répondre ou les transférer (règle de renvoi automatique) ne relance jamais le traitement
const SUJETS_FILL = /^(bien recu|a completer|adresse non reconnue|demande non enregistree)\s*:/;

// Renvoie le motif pour lequel un mail est écarté sans réponse, ou null s'il se traite.
export const automatique = (mail, c = {}) => {
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

// Contrôle d'origine, lu dans l'en-tête Authentication-Results que pose le serveur de réception.
//   ok        preuve positive et alignée sur le domaine de l'expéditeur (DMARC, ou DKIM, ou SPF du même domaine)
//   echec     DMARC en échec, ou SPF en échec sans signature DKIM alignée
//   inconnue  aucune preuve : l'adresse d'expéditeur est alors la seule indication, et elle s'imite
// Seul le premier en-tête (le plus récent, celui du serveur de réception) peut prouver ; un échec compte où qu'il soit.
export const authentification = (entetes = {}, de = "") => {
  const domaine = String(de).split("@")[1] ?? "";
  const aligne = (d) => { const x = String(d ?? "").replace(/^.*@/, "").replace(/[^a-z0-9.-]/g, ""); return Boolean(x) && Boolean(domaine) && (x === domaine || domaine.endsWith(`.${x}`) || x.endsWith(`.${domaine}`)); };
  const valeurs = String(entetes["authentication-results"] ?? "").split("\n").map((v) => plat(v)).filter((v) => v.trim());
  const spfSeul = (plat(entetes["received-spf"]).trim().match(/^(\w+)/) ?? [])[1] ?? null;
  const lire = (v) => {
    const un = (cle) => (v.match(new RegExp(`\\b${cle}=(\\w+)`)) ?? [])[1] ?? null;
    const prop = (cle) => (v.match(new RegExp(`\\b${cle}=([^\\s;()]+)`)) ?? [])[1] ?? null;
    const dkimAligne = [...v.matchAll(/\bdkim=pass\b[^;]*/g)].some((m) => aligne((m[0].match(/header\.[di]=([^\s;()]+)/) ?? [])[1]));
    return { dmarc: un("dmarc"), spf: un("spf"), de: prop("header\\.from"), enveloppe: prop("smtp\\.mailfrom"), dkimAligne };
  };
  const lus = valeurs.map(lire);
  if (lus.some((x) => x.dmarc === "fail")) return "echec";
  if (lus.some((x) => (x.spf === "fail" || x.spf === "softfail") && !x.dkimAligne) || ((spfSeul === "fail" || spfSeul === "softfail") && !lus.some((x) => x.dkimAligne))) return "echec";
  const premier = lus[0];
  if (!premier) return "inconnue";
  if (premier.dmarc === "pass" && (!premier.de || aligne(premier.de))) return "ok";
  if (premier.dkimAligne) return "ok";
  if (premier.spf === "pass" && aligne(premier.enveloppe)) return "ok";
  return "inconnue";
};

// --- objet et corps -------------------------------------------------------------------------------------

const PREFIXE = /^\s*(?:(tr|fwd?|fw|wg|rv|transf\.?|re|ref|aw|sv)\s*:\s*|\[[^\]]{1,40}\]\s*)/i;
// « TR: RE: [EXTERNE] Marché de Noël » → titre sans préfixes, et ce que disent les préfixes
export const sujetNettoye = (sujet) => {
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

const MARQUES = [
  /^-{2,}\s*(message transfere|forwarded message|message d'origine|message original|original message|courriel d'origine|mail d'origine|message reexpedie)\s*-{2,}$/,
  /^(debut du message (transfere|reexpedie)|begin forwarded message)\s*:?$/,
];
const ENTETE_DE = /^\**(de|from|expediteur)\s*:\**\s*\S/;
const ENTETE_SUITE = /^\**(envoye|sent|date|a|to|objet|subject|cc)\s*:/;
const A_ECRIT = /^(le|on|el)\b.{4,160}\b(a ecrit|wrote)\s*:?$/;
const PIED_MOBILE = /^(envoye (depuis|de|a partir de) (mon|ma|l'|outlook)|sent from my|provenance\s*:\s*courrier pour windows|obtenir outlook pour|telecharger outlook pour|get outlook for)/;
const SALUT = /^(bonjour|bonsoir|salut|hello|coucou|madame|monsieur|mesdames|messieurs|cher|chere|chers)( (a|et|tous|toutes|[\w'-]+)){0,4}\s*[,!.]*$/;
const SALUT_DEBUT = /^\s*(bonjour|bonsoir|salut|hello|coucou)( [\p{L}'-]+){0,2}\s*[,!]\s*/iu;
const CONGE = /^(tres |bien )?(cordialement|cdlt|cdt|bien a vous|salutations( distinguees)?|sinceres salutations|bonne (journee|soiree|reception|fin de journee|semaine|fin de semaine)|merci( d'avance| par avance| beaucoup| a vous| bien)?|a bientot|respectueusement|amicalement|bien sincerement)( et (bonne (journee|soiree|semaine)|merci( d'avance)?|a bientot))?\s*[,.!]*$/;

// Sépare ce que le client écrit (note) de ce qu'il transfère ou cite (cite).
export const decouper = (texte) => {
  const lignes = String(texte ?? "").split("\n");
  const p = lignes.map((l) => plat(l).trim());
  const suivantes = (i, n) => p.slice(i + 1).filter(Boolean).slice(0, n);
  let coupe = -1, saute = 0;
  for (let i = 0; i < p.length; i++) {
    const l = p[i];
    if (!l) continue;
    if (MARQUES.some((m) => m.test(l))) { coupe = i; saute = 1; break; }
    if (/^_{8,}$/.test(l) && suivantes(i, 2).some((x) => ENTETE_DE.test(x))) { coupe = i; saute = 1; break; }
    if (ENTETE_DE.test(l) && suivantes(i, 4).some((x) => ENTETE_SUITE.test(x))) { coupe = i; break; }
    if (A_ECRIT.test(l) || (/^(le|on)\b/.test(l) && A_ECRIT.test(`${l} ${suivantes(i, 1)[0] ?? ""}`))) { coupe = i; break; }
    if (l.startsWith(">")) { coupe = i; break; }
  }
  let haut = coupe < 0 ? lignes : lignes.slice(0, coupe);
  const cite = coupe < 0 ? "" : lignesNettes(lignes.slice(coupe + saute).map((l) => l.replace(/^\s*(>\s?)+/, "")).join("\n"));
  // signature séparée par « -- », pieds ajoutés par les téléphones
  const sep = haut.findIndex((l) => /^--\s?$/.test(l));
  if (sep >= 0) haut = haut.slice(0, sep);
  haut = haut.filter((l) => !PIED_MOBILE.test(plat(l).trim()));
  return { note: lignesNettes(haut.join("\n")), cite, transfert: coupe >= 0 };
};

// la consigne du client : sa note, sans salutation, arrêtée à la formule de politesse (la signature qui suit
// mentionne souvent « Facebook » ou « notre site » sans rien demander)
export const consigne = (note, signature = "") => {
  const sig = new Set(String(signature ?? "").split("\n").map((l) => plat(l).replace(/[*_>#]/g, "").trim()).filter((l) => l.length >= 4));
  const garde = [];
  for (const l of String(note ?? "").split("\n")) {
    const x = plat(l).trim();
    if (!x) { garde.push(""); continue; }
    if (CONGE.test(x)) break;
    if (SALUT.test(x) && x.length <= 60) continue;
    if (sig.has(x.replace(/[*_>#]/g, "").trim())) continue;
    garde.push(l.replace(SALUT_DEBUT, ""));
  }
  return lignesNettes(garde.join("\n"));
};

// --- supports nommés par le client -------------------------------------------------------------------

// simple : prestation courante à une unité, la seule sorte qui se dépose par mail (la base le revérifie)
export const SUPPORTS = [
  { id: "post", nom: "publication sur les réseaux sociaux", simple: true, motif: "facebook|instagram|linkedin|reseaux sociaux|(?:sur|pour) (?:les|nos|vos) reseaux(?! d)|posts?" },
  { id: "actu", nom: "actualité sur le site", simple: true, motif: "site internet|site web|(?:sur|pour|dans) (?:le|notre|votre) site(?! d)|actus?|actualites?" },
  { id: "agenda", nom: "agenda en ligne", simple: true, motif: "agenda" },
  { id: "affiche", nom: "affiche", motif: "affiches?" },
  { id: "flyer", nom: "flyer ou programme", motif: "flyers?|tracts?|depliants?|programmes?" },
  { id: "news", nom: "newsletter", motif: "newsletters?|lettres? d'information|infolettres?" },
  { id: "page", nom: "page du site", motif: "page du site|(?:nouvelle|une) page(?! facebook| instagram| linkedin)" },
  { id: "bulletin", nom: "page de bulletin ou de magazine", motif: "bulletin|magazine" },
  { id: "presse", nom: "communiqué de presse", motif: "communiques?|presse" },
  { id: "photo", nom: "reportage photo", motif: "reportages?|photographe" },
  { id: "gabarit", nom: "visuel", motif: "visuels?|bandeaux?|bannieres?" },
].map((s) => ({ ...s, re: new RegExp(`\\b(?:${s.motif})\\b`), pour: new RegExp(`\\bpour\\s+(?:le |la |les |l'|notre |nos |votre |vos |un |une |du |des )?(?:page |compte |profil )?(?:${s.motif})\\b`), un: new RegExp(`\\b(?:un|une|des|d'un|d'une)\\s+(?:nouvelle |nouveau |petite |petit |belle |beau )?(?:${s.motif})\\b`) }));

export const nomSupport = (id) => SUPPORTS.find((s) => s.id === id)?.nom ?? id;

// Deux niveaux de lecture d'une phrase du client.
// DEMANDE : une consigne de publication adressée à Fill (« à publier », « merci de relayer », « pouvez-vous mettre »).
//   Avec un support courant dans la même phrase et sans réserve, elle seule permet le dépôt direct.
// EVOCATION : le support est évoqué comme un souhait (« un post », « pour Facebook »). Il est pré-coché dans la
//   nouvelle demande, jamais déposé.
const PUBLIER = "publier|poster|mettre|diffuser|relayer|partager|annoncer|ajouter|passer|inserer|inscrire";
const DEMANDE = new RegExp(
  `\\ba (?:${PUBLIER})\\b` +
  `|\\b(?:merci de|merci d'|pouvez[- ]vous|pourriez[- ]vous|peux[- ]tu|pourrais[- ]tu|il faut|il faudrait|faudrait|je souhaite(?:rais)?|nous souhait(?:ons|erions)|j'aimerais|nous aimerions|je voudrais|nous voudrions|possible de|possible d'|priere de|priere d')\\s*(?:[\\w'-]+\\s+){0,3}?(?:${PUBLIER})\\b` +
  `|\\b(?:publiez|postez|diffusez|relayez|partagez|annoncez|ajoutez)\\b`);
const EVOCATION = /\b(?:un|une|des)\s+(?:post|publication|actu|actualite|annonce)\b|^(?:post|publication|actu|actualite)\b/;
// une création demandée : seule tournure qui retient un support lourd
const CREATION = /\b(creer|creez|creation|realiser|realisez|preparer|preparez|concevoir|concevez|refaire|rediger|redigez|maquette|mettre a jour)\b/;
// toute réserve dans la phrase : rien n'est retenu, tout se confirme dans l'Espace
const RESERVE = /\b(ne|pas|plus|rien|sans|sauf|hors|ni|jamais|aucun|aucune|deja|inutile|seulement|uniquement|peut-etre|eventuellement|attendez|attendre|attends|finalement|hier)\b|\bsi\b(?! possible)|\bn'|\bavant de\b|\bce matin\b|\ben attente\b/;
// un retrait ou une correction n'importe où dans la consigne : ce n'est pas une nouvelle publication
const RETRAIT = /\b(retir\w*|supprim\w*|enlev\w*|annul\w*|corrig\w*|correction|correctif|rectifi\w*|modifi\w*|depubli\w*|erreur|erreurs|mot de passe|identifiants?)\b/;
const JOINT = /\b(ci-joint|ci joint|ci-jointe|ci jointe|en piece jointe|en pieces jointes|en pj|en attache|joint|jointe|joints|jointes)\b/;
// phrases destinées au public (texte à publier, pied de signature), jamais une consigne
const PUBLIC = /\b(suivez|retrouvez|rejoignez|abonnez|likez|aimez|visitez|consultez|rendez-vous sur|plus d'infos? sur|renseignements sur|inscriptions? sur)\b|www\.|https?:|@/;

// phrases, et propositions séparées par « mais » : « sur le site, mais pas sur Facebook » se lit en deux temps
const phrases = (t) => plat(t).split(/[.!?;]+(?:\s+|$)|\n+|,?\s+(?=mais\b)/).map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);

// Supports nommés dans les mots du client. objet : l'objet du mail s'il est de sa main (pas un transfert).
// Renvoie les lignes à pré-cocher et « sur » : vrai seulement si le dépôt direct est permis, c'est-à-dire si
// chaque support retenu est courant, demandé par une consigne de publication, et que rien dans le mail ne fait douter.
export const supportsDemandes = ({ objet = "", texte = "" }) => {
  const toutes = [...phrases(objet), ...phrases(texte)];
  const demandes = new Set(), evoques = new Set();
  let ambigu = toutes.some((p) => RETRAIT.test(p));
  for (const phrase of toutes) {
    if (PUBLIC.test(phrase)) continue;
    for (const s of SUPPORTS) {
      if (!s.re.test(phrase)) continue;
      if (RESERVE.test(phrase)) { ambigu = true; continue; }
      if (s.simple) {
        if (DEMANDE.test(phrase)) demandes.add(s.id);
        else if (EVOCATION.test(phrase) || s.pour.test(phrase)) evoques.add(s.id);
      } else {
        const creation = CREATION.test(phrase);
        if (JOINT.test(phrase) && !creation) continue;     // « l'affiche ci-jointe » : un document fourni, pas une commande
        if (creation || s.un.test(phrase)) evoques.add(s.id);
      }
    }
  }
  const retenus = SUPPORTS.filter((s) => demandes.has(s.id) || evoques.has(s.id));
  return {
    lignes: retenus.map((s) => ({ prestation: s.id, quantite: 1 })),
    lourds: retenus.filter((s) => !s.simple).map((s) => s.id),
    ambigu,
    sur: demandes.size > 0 && evoques.size === 0 && !ambigu,
  };
};

// --- date souhaitée -------------------------------------------------------------------------------------

const MOIS = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
// une date ne compte que derrière un verbe de publication, dans la même phrase : « à publier sur Facebook pour le 20/11 »
const AVANT_DATE = "\\b(?:a publier|a paraitre|a diffuser|a poster|a mettre en ligne|a relayer|a annoncer|publier|poster|diffuser|relayer|annoncer|mettre en ligne|parution|mise en ligne)\\s+(?:[\\w'-]+\\s+){0,6}?(?:le|au|avant le|pour le|d'ici le|d'ici au|au plus tard le|des le)\\s+(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche) )?";
const DATE_LETTRES = new RegExp(`${AVANT_DATE}(\\d{1,2})(?:er)?\\s+(${MOIS.join("|")})(?:\\s+(\\d{4}))?\\b`, "g");
const DATE_CHIFFRES = new RegExp(`${AVANT_DATE}(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?(?![\\d/.])`, "g");

// Date de parution demandée, seulement si le client l'écrit lui-même derrière un verbe de publication
// (« à publier le 5 décembre », « à paraître avant le 3 janvier »). La date d'un événement (« atelier pour le
// 14 décembre ») n'en est pas une. Deux dates différentes, une date passée ou trop lointaine : aucune.
export const dateSouhaitee = (texte, aujourdhui) => {
  const [a0, m0, j0] = String(aujourdhui).split("-").map(Number);
  const dates = new Set();
  let douteuse = false;
  const retenir = (jour, mois, an) => {
    if (!(mois >= 1 && mois <= 12 && jour >= 1 && jour <= 31)) return;
    const iso = (a) => `${a}-${String(mois).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
    const valide = (a) => { const d = new Date(`${iso(a)}T12:00:00Z`); return !Number.isNaN(d.getTime()) && d.getUTCDate() === jour && d.getUTCMonth() + 1 === mois; };
    let an2 = an ? (an < 100 ? 2000 + an : an) : a0;
    if (!an && (mois < m0 || (mois === m0 && jour <= j0))) {
      // sans année, une date déjà passée : l'an prochain seulement si elle est loin derrière (« le 15 janvier » écrit en novembre)
      if ((m0 - mois + 12) % 12 < 6) { douteuse = true; return; }
      an2 = a0 + 1;
    }
    if (!valide(an2)) return;
    const d = iso(an2);
    const ecart = (Date.parse(`${d}T12:00:00Z`) - Date.parse(`${aujourdhui}T12:00:00Z`)) / 864e5;
    if (ecart >= 1 && ecart <= 366) dates.add(d); else douteuse = true;
  };
  for (const t of phrases(texte)) {
    for (const m of t.matchAll(DATE_LETTRES)) retenir(Number(m[1]), MOIS.indexOf(m[2]) + 1, m[3] ? Number(m[3]) : null);
    for (const m of t.matchAll(DATE_CHIFFRES)) retenir(Number(m[1]), Number(m[2]), m[3] ? Number(m[3]) : null);
  }
  return dates.size === 1 && !douteuse ? [...dates][0] : null;
};

// --- pièces jointes -------------------------------------------------------------------------------------

const TYPES_REFUSES = /\.(exe|bat|cmd|com|scr|js|jse|mjs|vbs|vbe|wsf|wsh|ps1|msi|msp|jar|lnk|hta|cpl|dll|iso|img|reg|apk|html?|xhtml|shtml|mht|mhtml)$/i;
const ANNEXES = /\.(ics|vcf|p7s|p7m|asc|sig)$|^winmail\.dat$|^smime\.p7s$/i;

// Pièces reprises (dans la limite du nombre et du poids) et pièces écartées, avec le motif à dire au client.
export const trierPieces = (pieces = []) => {
  const gardees = [], ecartees = [];
  let total = 0;
  for (const p of pieces) {
    if (ANNEXES.test(p.nom)) continue;                                              // carte de visite, invitation d'agenda, signature
    if (p.integree && /^image\//.test(p.type) && p.taille < 20 * 1024) continue;       // logo de signature
    if (TYPES_REFUSES.test(p.nom)) { ecartees.push({ nom: p.nom, motif: "type" }); continue; }
    if (!p.jeton) { ecartees.push({ nom: p.nom, motif: "illisible" }); continue; }
    if (p.taille > LIMITES.octetsPiece) { ecartees.push({ nom: p.nom, motif: "poids" }); continue; }
    if (gardees.length >= LIMITES.pieces || total + p.taille > LIMITES.octetsTotal) { ecartees.push({ nom: p.nom, motif: "nombre" }); continue; }
    total += p.taille;
    gardees.push(p);
  }
  return { gardees, ecartees };
};

// nom de fichier rangé dans le stockage, comme le fait l'Espace
export const cheminPiece = (organisation, dossier, nom, horodatage) =>
  `${organisation}/${dossier}/${horodatage}-${String(nom).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w.\-]+/g, "_").slice(0, 100)}`;

// --- décision -----------------------------------------------------------------------------------------

const couper = (t, max) => {
  if (t.length <= max) return t;
  const c = t.slice(0, max - 1);
  const e = c.lastIndexOf(" ");
  return sain(e > max * 0.6 ? c.slice(0, e) : c).trimEnd() + "…";
};

// Analyse d'un mail reconnu. Renvoie le titre, le brief, la date, les lignes, les pièces et la décision :
//   deposer    l'origine du mail est établie et le client demande un support courant, sans réserve : la demande part
//   completer  il manque quelque chose : motif, et de quoi pré-remplir la nouvelle demande
// c.authentification : résultat de authentification() ; c.origine : « preuve » (défaut : dépôt direct seulement sur
// preuve d'origine) ou « adresse » (l'adresse d'expéditeur suffit tant qu'aucun contrôle n'échoue).
export const analyser = (mail, c = {}) => {
  const aujourdhui = c.aujourdhui;
  const s = sujetNettoye(mail.sujet);
  const d = decouper(mail.texte);
  const transfert = s.transfert || s.reponse || d.transfert;
  const mots = consigne(d.note, mail.signature);
  const { gardees, ecartees } = trierPieces(mail.pieces);

  // titre : l'objet sans ses préfixes ; à défaut, la première ligne de la consigne
  let titre = couper(s.titre, LIMITES.titre);
  if ([...titre].length < 3) {                            // la base compte en caractères : « 🎄🎄 » n'en fait que deux
    const premiere = (mots || d.cite).split("\n").map((l) => l.trim()).find((l) => l.length >= 3 && !ENTETE_DE.test(plat(l)) && !ENTETE_SUITE.test(plat(l))) ?? "";
    titre = couper(premiere.replace(/\s+/g, " "), 90);
  }
  if ([...titre].length < 3) titre = "";

  // brief : la note du client, puis le message transféré, sans interprétation
  const blocs = [d.note, d.cite ? `Message transféré :\n${d.cite}` : ""].filter(Boolean);
  let brief = blocs.join("\n\n");
  if (brief.length > LIMITES.brief) brief = sain(brief.slice(0, LIMITES.brief - 60)).trimEnd() + "\n[…] Texte abrégé : le mail d’origine était plus long.";
  const matiere = (mots + d.cite).replace(/\s+/g, "").length;
  if (!brief && gardees.length) brief = "Information dans les pièces jointes du mail.";

  const sup = supportsDemandes({ objet: transfert ? "" : s.titre, texte: mots });
  const parution = aujourdhui ? dateSouhaitee(`${transfert ? "" : s.titre}. ${mots}`, aujourdhui) : null;
  const base = { titre: titre || null, brief, parution, lignes: sup.lignes, pieces: gardees, piecesEcartees: ecartees, transfert };

  if (!base.titre || (matiere < 20 && !gardees.length)) return { ...base, decision: "completer", motif: "contenu_insuffisant" };
  // origine : un échec net ne dépose jamais ; sans preuve, le dépôt direct n'est permis que si Fill l'a réglé ainsi
  if (c.authentification === "echec") return { ...base, decision: "completer", motif: "origine_en_echec" };
  if (c.authentification !== "ok" && c.origine !== "adresse") return { ...base, decision: "completer", motif: "origine_non_prouvee" };
  if (!sup.lignes.length) return { ...base, decision: "completer", motif: "support_manquant" };
  if (!sup.sur) return { ...base, decision: "completer", motif: "support_a_confirmer" };
  return { ...base, decision: "deposer", motif: null };
};

// --- textes des réponses (gabarit des e-mails de Fill ; les valeurs sont échappées par l'appelant) ---

const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;
const jourLong = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const enListe = (l) => (l.length <= 1 ? l.join("") : `${l.slice(0, -1).join(", ")} et ${l[l.length - 1]}`);
const MOTIFS_PIECE = {
  poids: "trop lourde pour être reprise d’un mail (15 Mo au plus)",
  nombre: "au-delà de ce qu’un mail peut apporter (8 pièces, 30 Mo au total)",
  type: "d’un type de fichier que Fill ne reprend pas",
  illisible: "illisible à la réception",
  erreur: "non reprise à la réception",
};
// une phrase par pièce écartée, pour que rien ne se perde en silence
export const phrasesPieces = (ecartees = []) =>
  ecartees.slice(0, 6).map((p) => `La pièce « ${p.nom} » n’a pas été reprise : ${MOTIFS_PIECE[p.motif] ?? MOTIFS_PIECE.erreur}. Envoyez-la par un lien de téléchargement, en réponse à ce message.`);

// accusé d'un dépôt : ce qui a été compris, pour que le client puisse corriger avant la confirmation
export const mailRecu = ({ titre, unites, supports, parution, pieces, ecartees, adresseInconnue }) => ({
  sujet: `Bien reçu : ${titre}`,
  titre: "Votre demande est enregistrée",
  texte: [
    `« ${titre} » : ${enListe(supports)}, ${pluriel(unites, "unité")}${parution ? `, à publier le ${jourLong(parution)}` : ""}${pieces ? `, ${pluriel(pieces, "pièce")} jointe${pieces > 1 ? "s" : ""}` : ""}.`,
    "Fill la confirme avec sa date de livraison. Vous relirez ensuite la version sur un lien.",
  ],
  bouton: "Voir la demande",
  apres: [
    ...phrasesPieces(ecartees),
    "Ce n’est pas ce que vous attendiez ? Répondez à ce message, ou annulez la demande dans votre espace : les unités reviennent sur le compte.",
    adresseInconnue ? `L’adresse utilisée n’est pas celle de votre structure. La bonne adresse : ${adresseInconnue}.` : "",
  ].filter(Boolean),
});

const MANQUES = {
  support_manquant: (c) => [
    "Votre mail est bien arrivé. Il ne dit pas sur quel support publier (réseaux sociaux, site, agenda, affiche…) : rien n’est donc engagé.",
    `La demande est déjà remplie avec votre texte${c.pieces ? " et vos pièces jointes" : ""}. Choisissez le support, puis envoyez.`,
  ],
  support_a_confirmer: (c) => [
    `Votre mail est bien arrivé. ${c.supports.length ? `Il semble demander : ${enListe(c.supports)}.` : ""} Ce choix se confirme dans votre espace, où le nombre d’unités s’affiche avant l’envoi : rien n’est engagé d’ici là.`.replace(/\s+/g, " "),
    `La demande est déjà remplie avec votre texte${c.pieces ? " et vos pièces jointes" : ""}. Vérifiez les supports, puis envoyez.`,
  ],
  contenu_insuffisant: () => [
    "Votre mail est bien arrivé, mais il ne contient ni texte ni pièce jointe à partir desquels travailler. Rien n’est engagé.",
    "Renvoyez l’information à la même adresse, ou décrivez la demande dans votre espace.",
  ],
  sans_unites: (c) => [
    `Votre mail est bien arrivé, mais il ne reste pas assez d’unités sur le compte pour cette demande${c.detail ? ` (${c.detail})` : ""}. Rien n’est engagé.`,
    "La demande est déjà remplie : elle pourra partir dès que le compte sera rechargé, depuis votre espace.",
  ],
  origine_non_prouvee: (c) => [
    "Votre mail est bien arrivé. Son origine n’a pas pu être vérifiée automatiquement : par précaution, rien n’est engagé.",
    `La demande est déjà remplie avec votre texte${c.pieces ? " et vos pièces jointes" : ""}. Il reste à l’envoyer depuis votre espace. Si ce mail ne vient pas de vous, ignorez ce message.`,
  ],
  origine_en_echec: () => [
    "Un mail est arrivé à votre nom, mais le contrôle de son origine a échoué. Par précaution, rien n’est engagé et ses pièces jointes n’ont pas été conservées.",
    "Si ce mail vient bien de vous, la demande est déjà remplie avec son texte : il reste à l’envoyer depuis votre espace. Sinon, ignorez ce message.",
  ],
  depot_impossible: () => [
    "Votre mail est bien arrivé, mais la demande n’a pas pu être enregistrée automatiquement. Rien n’est engagé.",
    "Elle est déjà remplie avec votre texte : il reste à l’envoyer depuis votre espace.",
  ],
};

export const mailACompleter = ({ motif, titre, supports = [], pieces = 0, ecartees = [], detail = null }) => ({
  sujet: `À compléter : ${titre || "votre demande"}`,
  titre: motif === "contenu_insuffisant" ? "Il manque l’information" : motif === "sans_unites" ? "Il manque des unités" : motif === "support_manquant" ? "Il manque le support" : "Votre confirmation est nécessaire",
  texte: (MANQUES[motif] ?? MANQUES.depot_impossible)({ supports, pieces, detail }),
  bouton: motif === "contenu_insuffisant" ? "Ouvrir mon espace" : "Terminer la demande",
  apres: [...phrasesPieces(ecartees), motif === "contenu_insuffisant" ? "" : `Ce lien reste valable ${LIMITES.joursLien} jours. Une question ? Répondez à ce message.`].filter(Boolean),
});

// Fill est prévenu de tout mail d'un membre qui n'est pas devenu une demande : une question, un retrait demandé
// ou une précision ne doivent pas attendre dans un lien que le client n'ouvrira peut-être pas.
const MOTIFS_FILL = {
  support_manquant: "aucun support nommé",
  support_a_confirmer: "supports à confirmer (prestation à plusieurs unités, réserve ou tournure incertaine)",
  contenu_insuffisant: "ni texte ni pièce jointe",
  sans_unites: "unités insuffisantes",
  origine_non_prouvee: "origine du mail non prouvée",
  origine_en_echec: "contrôle d’origine en échec (adresse peut-être imitée)",
  depot_impossible: "dépôt refusé par la base",
};
export const mailPourFill = ({ motif, titre, organisation, expediteur, extrait, pieces = 0 }) => ({
  sujet: `Mail non déposé : ${titre || "sans objet"} (${organisation})`,
  titre: `Un mail de ${organisation} attend son auteur`,
  texte: [
    `${expediteur} a écrit à l’adresse de transfert. Rien n’est déposé : ${MOTIFS_FILL[motif] ?? motif}. Le client a reçu une réponse avec le lien vers la demande pré-remplie${pieces ? `, ${pluriel(pieces, "pièce")} conservée${pieces > 1 ? "s" : ""}` : ""}.`,
    extrait ? `<i>${extrait}</i>` : "",
    "S’il s’agit d’une question, d’un retrait ou d’une correction, répondez directement : ce message répond à son auteur.",
  ].filter(Boolean),
  bouton: null,
});

// expéditeur non reconnu, compte en lecture seule, adresse d'une autre structure, structure résiliée
export const mailRefus = ({ cas, expediteur, adressePropre }) => {
  const t = {
    inconnu: {
      sujet: "Adresse non reconnue : votre mail n’a pas été enregistré",
      titre: "Votre adresse n’est pas reconnue",
      texte: [
        `Cette adresse reçoit les demandes des personnes inscrites à l’espace Fill de leur structure. ${expediteur} n’y figure pas : rien n’a été enregistré.`,
        "Écrivez depuis l’adresse de votre compte, ou demandez au référent de votre structure de vous inviter (menu Équipe).",
      ],
      bouton: null,
    },
    lecteur: {
      sujet: "Demande non enregistrée : compte en lecture seule",
      titre: "Votre compte permet de suivre, pas de demander",
      texte: ["Votre compte est en lecture seule : rien n’a été enregistré.", "Le référent de votre structure peut vous donner le droit de déposer des demandes (menu Équipe), ou envoyer lui-même ce mail."],
      bouton: "Ouvrir mon espace",
    },
    autre_structure: {
      sujet: "Demande non enregistrée : adresse d’une autre structure",
      titre: "Cette adresse n’est pas celle de votre structure",
      texte: ["L’adresse à laquelle vous avez écrit n’est pas celle de votre structure : rien n’a été enregistré.", adressePropre ? `Renvoyez votre mail à ${adressePropre}.` : "Retrouvez l’adresse de votre structure dans votre mail de bienvenue."],
      bouton: null,
    },
    resiliee: {
      sujet: "Demande non enregistrée : abonnement terminé",
      titre: "L’abonnement de votre structure est terminé",
      texte: ["Rien n’a été enregistré. Pour reprendre, répondez simplement à ce message."],
      bouton: null,
    },
  };
  return t[cas] ?? t.inconnu;
};
