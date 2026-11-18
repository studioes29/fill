// Réception des demandes envoyées par mail à fill@studioes.fr (boîte MX Plan d'OVH).
//
// Depuis le 18 nov 2026 (fin de Brevo) : la boîte est relevée en IMAP toutes les 15 minutes (tâche pg_cron
// « fill-reception ») ; chaque message non lu est mis au format qu'utilisaient les règles (champs de l'ancien webhook
// Brevo : From, To, Cc, Subject, RawTextBody, RawHtmlBody, Headers, Attachments…), traité, puis marqué lu. Un mail
// d'un membre reconnu devient une demande déposée, par les règles de deposer_demande ; sinon le client reçoit une
// réponse courte et un lien vers la demande pré-remplie.
//
//   POST {action:"relever"}     protégée comme le pilote (clé secrète ou jeton verifier_jeton_pilote)
//
// Base : table mail_recu et fonctions mail_* (migrations 2026-11-adresse-de-transfert.sql et 2026-11-18-sans-brevo.sql).
// Règles : _partage/regles/reception.ts (analyse) et traiter.ts (déroulé), testées par tests/reception.test.mjs.
// Secrets : clés Supabase, FILL_IMAP_USER (fill@studioes.fr) et FILL_IMAP_PASS, CONTACT_SMTP_USER et CONTACT_SMTP_PASS
// (réponses, _partage/smtp.ts), EXPEDITEUR_EMAIL, ALERTE_EMAIL, SITE_URL ;
// RECEPTION_ORIGINE=adresse pour qu'un mail se dépose sur la seule foi de son adresse d'expéditeur. Sans ce réglage,
// le dépôt direct exige une preuve d'origine (en-tête Authentication-Results) ; à défaut, le lien pré-rempli.
import { CLE_SECRETE, SITE } from '../_partage/cles.ts';
import { gabarit } from '../_partage/courriel.ts';
import { CLE_ENVOI, envoyerSmtp } from '../_partage/smtp.ts';
import { LIMITES } from '../_partage/regles/reception.ts';
import { ADRESSE_DEMANDES, DOMAINE_DEFAUT } from '../_partage/regles/transfert.ts';
import { estPanne, traiter } from './traiter.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { ImapFlow } from "npm:imapflow@1.0.164";
import { simpleParser } from "npm:mailparser@3.7.1";

const echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const json = (corps, status = 200) => new Response(JSON.stringify(corps), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// message IMAP analysé → élément au format des règles (champs de l'ancien webhook Brevo)
const versItem = (p, pieces) => {
  const adr = (a) => (a?.value ?? []).map((x) => ({ Address: x.address ?? "", Name: x.name ?? "" })).filter((x) => x.Address);
  const entetes = {};
  for (const h of p.headerLines ?? []) {
    const k = String(h.key ?? "").toLowerCase(), v = String(h.line ?? "").replace(/^[^:]*:\s?/, "").replace(/\r?\n\s+/g, " ");
    entetes[k] = entetes[k] ? `${entetes[k]}\n${v}` : v;
  }
  const spam = Number(String(entetes["x-spam-score"] ?? entetes["x-vr-spamscore"] ?? "").replace(",", "."));
  return {
    From: adr(p.from)[0] ?? null, To: adr(p.to), Cc: adr(p.cc),
    // tout ce qui arrive dans la boîte lui était adressé, même en copie cachée
    Recipients: [ADRESSE_DEMANDES, ...adr(p.to), ...adr(p.cc)].map((x) => typeof x === "string" ? x : x.Address),
    Subject: p.subject ?? "", RawTextBody: p.text ?? "", RawHtmlBody: typeof p.html === "string" ? p.html : "",
    Headers: entetes, SentAtDate: p.date ? p.date.toISOString() : "", MessageId: p.messageId ?? "",
    ...(Number.isFinite(spam) ? { SpamScore: spam } : {}),
    Attachments: (p.attachments ?? []).map((a) => {
      const jeton = crypto.randomUUID();
      pieces.set(jeton, new Uint8Array(a.content));
      return { Name: a.filename ?? "piece-jointe", ContentType: a.contentType ?? "", ContentLength: a.size ?? a.content?.length ?? 0, ContentID: a.related ? (a.cid ?? "") : "", DownloadToken: jeton };
    }),
  };
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ erreur: "Méthode refusée" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const domaine = (Deno.env.get("DOMAINE_RECEPTION") ?? DOMAINE_DEFAUT).trim().toLowerCase();
  const expediteur = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  const porteur = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  let s;
  try { s = await req.json(); } catch { s = null; }
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  const autorise = Boolean(CLE_SECRETE) && porteur.length >= 32 && (porteur === CLE_SECRETE || (await admin.rpc("verifier_jeton_pilote", { p: porteur })).data === true);
  if (!autorise) return json({ erreur: "Réservé au serveur" }, 401);
  if (s?.action !== "relever") return json({ erreur: "Action inconnue" }, 400);

  // --- relève de la boîte fill@studioes.fr -----------------------------------------------------------
  const boite = (Deno.env.get("FILL_IMAP_USER") ?? "").trim() || "fill@studioes.fr";
  const motDePasse = Deno.env.get("FILL_IMAP_PASS") ?? "";
  if (!motDePasse) return json({ erreur: "Boîte fill@ non réglée (FILL_IMAP_PASS)" }, 503);
  const imap = new ImapFlow({ host: (Deno.env.get("OVH_IMAP_HOST") ?? "").trim() || "ssl0.ovh.net", port: 993, secure: true, auth: { user: boite, pass: motDePasse }, logger: false });
  const pieces = new Map();
  const lus = [];         // [{uid, item}]
  try {
    await imap.connect();
    console.log("reception : connecté");
  } catch (e) { return json({ erreur: "Connexion IMAP impossible", detail: String(e).slice(0, 200) }, 502); }
  const verrou = await imap.getMailboxLock("INBOX");
  try {
    const uids = ((await imap.search({ seen: false }, { uid: true })) || []).slice(0, LIMITES.mails);
    console.log("reception : non lus", uids.length);
    for (const uid of uids) {
      const m = await imap.fetchOne(String(uid), { source: true }, { uid: true });
      console.log("reception : récupéré", uid, m?.source?.length ?? 0);
      if (!m?.source) continue;
      if (m.source.length > 25 * 1024 * 1024) { lus.push({ uid, item: null, trop: true }); continue; }
      lus.push({ uid, item: versItem(await simpleParser(m.source), pieces) });
      console.log("reception : analysé", uid);
    }
  } catch (e) {
    console.error("reception, lecture IMAP :", e?.message ?? e);
  }
  const items = lus.filter((x) => x.item).map((x) => x.item);
  if (!lus.length) { verrou.release(); await imap.logout().catch(() => null); return json({ ok: true, mails: [] }); }

  // « alerter » écrit à Fill quand le mail d'un membre n'est pas devenu une demande
  const d = {
    domaine, site: SITE, echap,
    origine: Deno.env.get("RECEPTION_ORIGINE") === "adresse" ? "adresse" : "preuve",
    adressesFill: [expediteur, pourFill, "contact@studioes.fr"],
    aujourdhui: new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }),
    maintenant: () => Date.now(),
    tracer: (t) => console.log(t),
    rpc: async (nom, args) => await admin.rpc(nom, args),
    unites: async (id) => (await admin.from("demande").select("unites").eq("id", id).single()).data?.unites ?? null,
    telecharger: async (jeton) => {
      const o = jeton ? pieces.get(jeton) : null;
      if (!o) return null;
      return o.length > LIMITES.octetsPiece ? new Uint8Array(LIMITES.octetsPiece + 1) : o;
    },
    ranger: async (chemin, octets, type) => !(await admin.storage.from("fichiers").upload(chemin, octets, { contentType: type, upsert: false })).error,
    notifier: (corps) => fetch(`${url}/functions/v1/notifier`, { method: "POST", headers: { Authorization: `Bearer ${CLE_SECRETE}`, "content-type": "application/json" }, body: JSON.stringify(corps) }),
    envoyer: async (m) => {
      if (!CLE_ENVOI || !m?.a?.length) return false;
      const corps = {
        sender: { name: "Fill", email: expediteur },
        to: m.a,
        replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
        subject: `${m.essai ? "[Test] " : ""}${m.sujet}`,
        htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres }),
      };
      // réponse automatique déclarée comme telle (aucun répondeur ne doit y répondre), rangée dans le fil du mail reçu
      const entetes = { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All", ...(m.enReponseA ? { "In-Reply-To": m.enReponseA, References: m.enReponseA } : {}) };
      const r = await envoyerSmtp({ ...corps, headers: entetes }).catch(() => null);
      return Boolean(r?.ok);
    },
    alerter: async (m) => {
      if (!CLE_ENVOI) return false;
      const r = await envoyerSmtp({
        body: JSON.stringify({
          sender: { name: "Fill", email: expediteur }, to: [{ email: pourFill }], replyTo: m.repondreA,
          subject: `${m.essai ? "[Test] " : ""}${m.sujet}`,
          htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres }),
        }),
      }).catch(() => null);
      return Boolean(r?.ok);
    },
  };

  const bilan = [], suites = [], lusOk = [];
  let panne = false;
  for (const x of lus) {
    if (!x.item) { lusOk.push(x.uid); bilan.push({ issue: "illisible", motif: x.trop ? "trop lourd" : null }); continue; }
    try {
      console.log("reception : traitement", x.uid);
      const r = await traiter(x.item, d);
      console.log("reception : traité", x.uid, r.issue);
      if (r.suite) suites.push(r.suite.catch((e) => console.error("reception, suite :", e?.message ?? e)));
      bilan.push({ issue: r.issue, motif: r.motif ?? null });
      lusOk.push(x.uid);
    } catch (e) {
      // panne de la base : le message reste non lu et sera repris au passage suivant ; une erreur de lecture ne se
      // rattrape pas en réessayant, le message est alors marqué lu
      if (estPanne(e)) panne = true; else lusOk.push(x.uid);
      console.error("reception :", e?.message ?? e);
      bilan.push({ issue: "erreur" });
    }
  }
  try { if (lusOk.length) await imap.messageFlagsAdd(lusOk.map(String).join(","), ["\\Seen"], { uid: true }); }
  catch (e) { console.error("reception, marquage lu :", e?.message ?? e); }
  verrou.release();
  await imap.logout().catch(() => null);
  // ménage, sans jamais gêner la réception
  suites.push((async () => {
    const { data: chemins } = await admin.rpc("mail_purger", { p_jours: LIMITES.joursLien });
    for (let i = 0; Array.isArray(chemins) && i < chemins.length; i += 100) await admin.storage.from("fichiers").remove(chemins.slice(i, i + 100));
  })().catch(() => null));
  // pièces jointes, alerte à Fill et réponses finissent après la réponse
  const fin = Promise.all(suites);
  const tache = globalThis.EdgeRuntime?.waitUntil;
  if (typeof tache === "function") tache.call(globalThis.EdgeRuntime, fin); else await fin;
  return json({ ok: !panne, mails: bilan }, panne ? 500 : 200);
});
