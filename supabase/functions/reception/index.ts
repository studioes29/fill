// Réception des mails envoyés aux adresses de transfert (nom-de-la-structure@demandes.studioes.fr).
//
// Brevo reçoit les mails du sous-domaine (enregistrements MX vers inbound1 et inbound2.sendinblue.com), puis les
// remet ici en JSON (webhook « inbound »). Un mail d'un membre reconnu devient une demande déposée, par les
// règles de deposer_demande ; sinon le client reçoit une réponse courte et un lien vers la demande pré-remplie.
//
//   POST ?cle=<RECEPTION_CLE>  {items:[…]}        webhook de Brevo (la clé peut aussi venir dans l'en-tête
//                                                 x-reception-cle ou en « Authorization: Bearer »)
//   POST {action:"webhook"}                       administration, protégée comme le pilote (clé secrète ou jeton
//                                                 verifier_jeton_pilote) : vérifie le webhook chez Brevo et les MX
//   POST {action:"webhook", creer:true}           le crée s'il manque ({remplacer:true} pour corriger son adresse)
//
// Base : organisation.alias_mail, table mail_recu et fonctions mail_* (migration 2026-11-adresse-de-transfert.sql).
// Règles : _partage/regles/reception.ts (analyse) et traiter.ts (déroulé), testées par tests/reception.test.mjs.
// Secrets : clés Supabase, BREVO_API_KEY, RECEPTION_CLE, EXPEDITEUR_EMAIL, ALERTE_EMAIL, SITE_URL ;
// DOMAINE_RECEPTION si le sous-domaine n'est pas demandes.studioes.fr ;
// RECEPTION_ORIGINE=adresse pour qu'un mail se dépose sur la seule foi de son adresse d'expéditeur. Sans ce réglage,
// le dépôt direct exige une preuve d'origine (en-tête Authentication-Results) ; à défaut, le lien pré-rempli.
import { CLE_SECRETE, SITE } from '../_partage/cles.ts';
import { gabarit } from '../_partage/courriel.ts';
import { LIMITES } from '../_partage/regles/reception.ts';
import { DOMAINE_DEFAUT } from '../_partage/regles/transfert.ts';
import { estPanne, traiter } from './traiter.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const json = (corps, status = 200) => new Response(JSON.stringify(corps), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const BREVO = "https://api.brevo.com/v3";

// comparaison sans fuite de durée : les deux valeurs passent par SHA-256
const egales = async (a, b) => {
  const h = async (t) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(t))));
  const [x, y] = await Promise.all([h(a), h(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ erreur: "Méthode refusée" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const domaine = (Deno.env.get("DOMAINE_RECEPTION") ?? DOMAINE_DEFAUT).trim().toLowerCase();
  const cleWebhook = Deno.env.get("RECEPTION_CLE") ?? "";
  const cleBrevo = Deno.env.get("BREVO_API_KEY") ?? "";
  const expediteur = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  const porteur = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  let s;
  try { s = await req.json(); } catch { s = null; }
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });

  // --- administration : le webhook chez Brevo ---------------------------------------------------------
  if (s && typeof s === "object" && typeof s.action === "string") {
    const autorise = Boolean(CLE_SECRETE) && porteur.length >= 32 && (porteur === CLE_SECRETE || (await admin.rpc("verifier_jeton_pilote", { p: porteur })).data === true);
    if (!autorise) return json({ erreur: "Réservé au serveur" }, 401);
    if (s.action !== "webhook") return json({ erreur: "Action inconnue" }, 400);
    if (!cleBrevo) return json({ erreur: "BREVO_API_KEY manquante" }, 503);
    if (cleWebhook.length < 24) return json({ erreur: "Secret RECEPTION_CLE manquant ou trop court (24 caractères au moins)" }, 503);
    const cible = `${url}/functions/v1/reception?cle=${encodeURIComponent(cleWebhook)}`;
    const brevo = (chemin, init = {}) => fetch(`${BREVO}${chemin}`, { ...init, headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" } });
    const masque = (u) => String(u ?? "").replace(/([?&]cle=)[^&]+/, "$1…");
    const lu = await brevo("/webhooks?type=inbound").catch(() => null);
    if (!lu?.ok) return json({ erreur: "Brevo ne répond pas à la lecture des webhooks", statut: lu?.status ?? null }, 502);
    const tous = ((await lu.json().catch(() => ({}))).webhooks ?? []).filter((w) => w?.type === "inbound");
    const dudomaine = tous.filter((w) => String(w.domain ?? "").toLowerCase() === domaine);
    let conforme = dudomaine.find((w) => w.url === cible) ?? null;
    let fait = "rien";
    if (!conforme && s.creer === true) {
      const corps = { type: "inbound", events: ["inboundEmailProcessed"], url: cible, domain: domaine, description: "Fill : adresses de transfert" };
      if (!dudomaine.length) {
        const r = await brevo("/webhooks", { method: "POST", body: JSON.stringify(corps) }).catch(() => null);
        if (!r?.ok) return json({ erreur: "Brevo a refusé la création du webhook", statut: r?.status ?? null, detail: await r?.text().catch(() => null) }, 502);
        conforme = { id: (await r.json().catch(() => ({}))).id ?? null, url: cible };
        fait = "cree";
      } else if (s.remplacer === true) {
        const r = await brevo(`/webhooks/${dudomaine[0].id}`, { method: "PUT", body: JSON.stringify({ url: cible, events: corps.events, domain: domaine, description: corps.description }) }).catch(() => null);
        if (!r?.ok) return json({ erreur: "Brevo a refusé la mise à jour du webhook", statut: r?.status ?? null, detail: await r?.text().catch(() => null) }, 502);
        conforme = { id: dudomaine[0].id, url: cible };
        fait = "remplace";
      }
    }
    // enregistrements MX du sous-domaine, pour information (résolveur public)
    const mx = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domaine)}&type=MX`).then((r) => r.json()).then((j) => (j.Answer ?? []).map((a) => String(a.data).toLowerCase().replace(/\.$/, ""))).catch(() => null);
    const attendus = ["10 inbound1.sendinblue.com", "20 inbound2.sendinblue.com"];
    return json({
      domaine, fait, conforme: Boolean(conforme), webhook: conforme ? { id: conforme.id, url: masque(conforme.url) } : null,
      autres: dudomaine.filter((w) => w.id !== conforme?.id).map((w) => ({ id: w.id, url: masque(w.url) })),
      mx, mx_ok: Array.isArray(mx) ? attendus.every((a) => mx.includes(a)) : null,
      conseil: conforme ? null : dudomaine.length ? "Un webhook existe pour ce domaine avec une autre adresse : relancer avec remplacer:true." : "Aucun webhook pour ce domaine : relancer avec creer:true.",
    });
  }

  // --- webhook de Brevo ---------------------------------------------------------------------------------
  const presentee = new URL(req.url).searchParams.get("cle") ?? req.headers.get("x-reception-cle") ?? porteur;
  if (cleWebhook.length < 24) return json({ erreur: "Réception non configurée" }, 503);
  if (!presentee || !(await egales(presentee, cleWebhook))) return json({ erreur: "Accès refusé" }, 401);
  const items = Array.isArray(s?.items) ? s.items : s && typeof s === "object" && s.From ? [s] : [];
  if (!items.length) return json({ ok: true, mails: [] });      // corps illisible ou vide : rien à refaire

  // « alerter » écrit à Fill quand le mail d'un membre n'est pas devenu une demande
  const d = {
    domaine, site: SITE, echap,
    origine: Deno.env.get("RECEPTION_ORIGINE") === "adresse" ? "adresse" : "preuve",
    adressesFill: [expediteur, pourFill, "contact@studioes.fr"],
    aujourdhui: new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }),
    maintenant: () => Date.now(),
    rpc: async (nom, args) => await admin.rpc(nom, args),
    unites: async (id) => (await admin.from("demande").select("unites").eq("id", id).single()).data?.unites ?? null,
    telecharger: async (jeton) => {
      if (!cleBrevo || !jeton) return null;
      const r = await fetch(`${BREVO}/inbound/attachments/${encodeURIComponent(jeton)}`, { headers: { "api-key": cleBrevo } });
      if (!r.ok) return null;
      if (Number(r.headers.get("content-length") ?? 0) > LIMITES.octetsPiece) { await r.body?.cancel(); return new Uint8Array(LIMITES.octetsPiece + 1); }
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
        htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres }),
      };
      // réponse automatique déclarée comme telle (aucun répondeur ne doit y répondre), rangée dans le fil du mail reçu
      const entetes = { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All", ...(m.enReponseA ? { "In-Reply-To": m.enReponseA, References: m.enReponseA } : {}) };
      const poster = (c) => fetch(`${BREVO}/smtp/email`, { method: "POST", headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(c) }).catch(() => null);
      let r = await poster({ ...corps, headers: entetes });
      if (r && !r.ok && r.status === 400) r = await poster(corps);      // en-têtes refusés : le message part sans eux
      return Boolean(r?.ok);
    },
    alerter: async (m) => {
      if (!cleBrevo) return false;
      const r = await fetch(`${BREVO}/smtp/email`, {
        method: "POST",
        headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { name: "Fill", email: expediteur }, to: [{ email: pourFill }], replyTo: m.repondreA,
          subject: `${m.essai ? "[Test] " : ""}${m.sujet}`,
          htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres }),
        }),
      }).catch(() => null);
      return Boolean(r?.ok);
    },
  };

  const bilan = [], suites = [];
  let panne = false;
  if (items.length > LIMITES.mails) console.error(`reception : ${items.length} mails dans un même appel, ${LIMITES.mails} traités`);
  for (const item of items.slice(0, LIMITES.mails)) {
    try {
      const r = await traiter(item, d);
      if (r.suite) suites.push(r.suite.catch((e) => console.error("reception, suite :", e?.message ?? e)));
      bilan.push({ issue: r.issue, motif: r.motif ?? null });
    } catch (e) {
      // panne de la base : Brevo représentera le mail ; une erreur de lecture ne se rattrape pas en réessayant
      if (estPanne(e)) panne = true;
      console.error("reception :", e?.message ?? e);
      bilan.push({ issue: "erreur" });
    }
  }
  // ménage, sans jamais gêner la réception
  suites.push((async () => {
    const { data: chemins } = await admin.rpc("mail_purger", { p_jours: LIMITES.joursLien });
    for (let i = 0; Array.isArray(chemins) && i < chemins.length; i += 100) await admin.storage.from("fichiers").remove(chemins.slice(i, i + 100));
  })().catch(() => null));
  // pièces jointes, alerte à Fill et réponses finissent après la réponse à Brevo
  const fin = Promise.all(suites);
  const tache = globalThis.EdgeRuntime?.waitUntil;
  if (typeof tache === "function") tache.call(globalThis.EdgeRuntime, fin); else await fin;
  return json({ ok: !panne, mails: bilan }, panne ? 500 : 200);
});
