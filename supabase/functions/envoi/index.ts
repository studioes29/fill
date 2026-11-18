// Envois automatiques de Hors-champ (prospection, campagnes, parcours clients).
// Appelée par pg_cron toutes les 10 minutes en semaine : envoie les messages arrivés à échéance,
// en arrêtant une séquence si l'adresse est en erreur, désinscrite ou a signalé un spam.
// 18 nov 2026 : Brevo a coupé l'envoi du compte (prospection à froid refusée par sa politique).
// Les messages partent désormais par la boîte MX Plan d'OVH (SMTP ssl0.ovh.net, port 465) dès que les secrets
// OVH_SMTP_USER et OVH_SMTP_PASS sont posés dans Supabase.
// 18 nov 2026 (suite) : par OVH, les images de la signature sont jointes au message (cid) au lieu d'être chargées
// depuis les sites : Outlook et les autres messageries bloquent les images distantes d'un expéditeur qu'elles ne
// connaissent pas encore, ce qui laissait une carte vide. Plus aucun appel à Brevo (compte clos) ; un message de
// séquence peut porter un HTML complet (vagues de lancement de Fill), envoyé tel quel avec le lien de désinscription.
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import nodemailer from "npm:nodemailer@6.9.16";
import { Buffer } from "node:buffer";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL")!;
const SMTP_HOTE = (Deno.env.get("OVH_SMTP_HOST") ?? "").trim() || "ssl0.ovh.net";
const SMTP_USER = (Deno.env.get("OVH_SMTP_USER") ?? "").trim();
const SMTP_PASS = Deno.env.get("OVH_SMTP_PASS") ?? "";
const PAR_SMTP = Boolean(SMTP_USER && SMTP_PASS);
const EXPEDITEUR = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";
// Adresse d'envoi distincte pour la prospection si le secret PROSPECTION_EXPEDITEUR est posé (avec OVH, ce doit être
// la même boîte que OVH_SMTP_USER ou un alias de celle-ci). Les réponses vont toujours à contact@studioes.fr (replyTo).
const EXPEDITEUR_PROSPECTION = (Deno.env.get("PROSPECTION_EXPEDITEUR") ?? "").trim() || EXPEDITEUR;
// Avec OVH, l'adresse d'envoi doit être la boîte authentifiée : sinon le message est refusé ou part mal signé.
const DE_SMTP = SMTP_USER;
const PAR_PASSAGE = 6;      // messages au plus par passage (toutes les 10 minutes)
const PAR_JOUR = 45;        // plafond quotidien, toutes séquences confondues
const sb = createClient(URL_SB, CLE, { auth: { persistSession: false } });
const smtp = PAR_SMTP ? nodemailer.createTransport({ host: SMTP_HOTE, port: 465, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS } }) : null;

const enc = new TextEncoder();
const signer = async (txt: string) => {
  const k = await crypto.subtle.importKey("raw", enc.encode(CLE), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(txt)));
  return btoa(String.fromCharCode(...s)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" } as Record<string, string>)[c]).slice(0, 32);
};
// lien de désinscription : la fonction « desinscription » demande une confirmation sur GET (les robots de sécurité des
// messageries cliquent sur tous les liens) et n'inscrit dans mail_stop que sur POST (bouton ou désabonnement en un clic)
const lienStop = async (email: string) => `${URL_SB}/functions/v1/desinscription?e=${encodeURIComponent(email)}&s=${await signer("stop:" + email)}`;
const echap = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as Record<string, string>)[c]);
// mesure des clics sans Brevo : les liens vers nos sites portent utm_source=prospection (ou la marque du suivi client),
// que GoatCounter range comme référent ; il ne compte que les visites qui exécutent la page, donc peu de robots.
const NOS_SITES = /^https:\/\/(www\.)?(studioes\.fr|fill\.studioes\.fr|dossiers\.studioes\.fr)(\/|$)/i;
const avecUtm = (u: string, source: string, campagne: string) => {
  if (!NOS_SITES.test(u) || /[?&]utm_source=/.test(u)) return u;
  const [base, frag] = u.split("#");
  return `${base}${base.includes("?") ? "&" : "?"}utm_source=${source}&utm_campaign=${encodeURIComponent(campagne)}${frag !== undefined ? "#" + frag : ""}`;
};
const marquerLiens = (t: string, source: string, campagne: string) => t.replace(/https?:\/\/[^\s<)"]+[^\s<).,;:!?"]/g, (u) => avecUtm(u, source, campagne));
const lierUrls = (t: string) => t.replace(/https?:\/\/[^\s<)]+[^\s<).,;:!?]/g, (u) => `<a href="${u}" style="color:#141414">${u}</a>`);

const SIGNATURE: Record<string, string> = {
  studio: "Ewen Soupault\nPhotographie de reportage, sites et applications\n06 51 22 21 07 · studioes.fr · Prendre rendez-vous : https://cal.com/studioes/30min",
  fill: "Ewen Soupault\nFill, service de communication externalisé\n06 51 22 21 07 · fill.studioes.fr · Prendre rendez-vous : https://cal.com/studioes/30min",
};
const baseImages = (marque: string) => marque === "fill" ? "https://fill.studioes.fr/assets/mail/signature" : "https://studioes.fr/images/signature";
const CID_NOM = "signature-nom@studioes.fr";
const CID_FILIGRANE = "signature-filigrane@studioes.fr";
// signature HTML : carte aux couleurs de la marque (nom et métier en image pour garder les polices des sites,
// filigrane du logo à droite), contacts en vrai texte cliquable. joint = images jointes au message (cid).
// Si une messagerie n'affiche pas les images, le texte de remplacement garde la police et la couleur de la carte.
const signatureHtml = (marque: string, joint = false) => {
  const fill = marque === "fill";
  const bg = fill ? "#EFE9FF" : "#F0EEE9";
  const base = baseImages(marque);
  const nom = joint ? `cid:${CID_NOM}` : `${base}-nom.png`;
  const filigrane = joint ? `cid:${CID_FILIGRANE}` : `${base}-filigrane.png`;
  const alt = fill ? "Ewen Soupault, Fill, service de communication externalisé" : "Ewen Soupault, Studio ES, photographie, sites et applications";
  const site = fill ? ["fill.studioes.fr", "https://fill.studioes.fr/"] : ["studioes.fr", "https://studioes.fr/"];
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;border-collapse:separate;border-spacing:0">
<tr><td bgcolor="${bg}" style="background:${bg};border-radius:18px 0 0 0;padding:0;vertical-align:top;line-height:0"><img src="${nom}" width="370" height="84" alt="${alt}" style="display:block;width:370px;height:84px;border:0;font:700 15px/84px Arial,Helvetica,sans-serif;color:#141414;padding-left:0"></td>
<td rowspan="2" width="130" style="padding:0;vertical-align:top;line-height:0"><img src="${filigrane}" width="130" height="122" alt="" style="display:block;width:130px;height:122px;border:0"></td></tr>
<tr><td bgcolor="${bg}" style="background:${bg};border-radius:0 0 0 18px;padding:0 0 0 22px;height:38px;vertical-align:top;font:13px/1.4 Arial,Helvetica,sans-serif;color:#141414"><a href="tel:+33651222107" style="color:#141414;text-decoration:none">06 51 22 21 07</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${site[1]}" style="color:#141414;text-decoration:underline">${site[0]}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://cal.com/studioes/30min" style="color:#141414;text-decoration:underline">Prendre rendez-vous</a></td></tr></table>`;
};
// images de la signature, lues une fois par démarrage de la fonction et jointes à chaque message envoyé par OVH
const IMAGES: Record<string, Promise<{ nom: Buffer; filigrane: Buffer } | null>> = {};
const imagesSignature = (marque: string) => IMAGES[marque] ??= (async () => {
  try {
    const lireImg = async (u: string) => { const r = await fetch(u); if (!r.ok) throw new Error(`${u} : ${r.status}`); return Buffer.from(await r.arrayBuffer()); };
    const base = baseImages(marque);
    const [nom, filigrane] = await Promise.all([lireImg(`${base}-nom.png`), lireImg(`${base}-filigrane.png`)]);
    return { nom, filigrane };
  } catch { delete IMAGES[marque]; return null; }
})();

// pièces jointes (Hors-champ ne les met que sur le premier message) : liens https vers nos sites, PDF ou Word, 2 au plus.
const PJ_HOTES = new Set(["fill.studioes.fr", "studioes.fr", "www.studioes.fr"]);
const PJ_EXT = /\.(pdf|docx|doc|odt)$/i;
const piecesJointes = (pj: unknown) => (Array.isArray(pj) ? pj : []).map((p: any) => {
  try {
    const u = new URL(String(p?.url ?? "").trim());
    const ext = PJ_EXT.exec(u.pathname);
    if (u.protocol !== "https:" || !PJ_HOTES.has(u.hostname) || !ext) return null;
    let nom = String(p?.nom ?? "").replace(/\s*:\s*/g, ", ").replace(/[\\/*?"<>|\r\n]+/g, " ").replace(/\s+/g, " ").trim() || decodeURIComponent(u.pathname.split("/").pop() ?? "");
    if (!nom.toLowerCase().endsWith(ext[0].toLowerCase())) nom += ext[0].toLowerCase();
    return { url: u.href, name: nom.slice(-120) };
  } catch { return null; }
}).filter(Boolean).slice(0, 2) as { url: string; name: string }[];

async function envoyer(d: any) {
  const stop = await lienStop(d.email);
  // liens de nos sites marqués pour GoatCounter : prospection ou suivi client, campagne = la marque et le rang du message
  const source = d.type === "prospection" ? "prospection" : "suivi";
  const campagne = `${d.marque === "fill" ? "fill" : "studio"}-${d.rang ?? 1}`;
  d = { ...d, corps: marquerLiens(String(d.corps ?? ""), source, campagne), ...(d.html ? { html: marquerLiens(String(d.html), source, campagne) } : {}) };
  const sig = SIGNATURE[d.marque] ?? SIGNATURE.studio;
  // piste « diffusion » (mails d'information, candidatures) : ni pied ni en-tête de désinscription
  const desinscription = d.type === "prospection" && !d.sans_pied;
  const pied = desinscription ? `\n\nVous ne souhaitez plus recevoir de message de Studio ES ni de Fill ? Répondez simplement « stop », ou : ${stop}` : "";
  const texte = d.html ? `${d.corps.trim()}${pied}` : `${d.corps.trim()}\n\n${sig}${pied}`;
  const images = !d.html && smtp ? await imagesSignature(d.marque) : null;
  // message en HTML complet (vague de lancement) : envoyé tel quel, le lien de désinscription remplace {{ unsubscribe }}
  const htmlComplet = d.html ? String(d.html).replace(/<a href="\{\{ mirror \}\}"[^>]*>[\s\S]*?<\/a>/g, "").replace(/\{\{\s*unsubscribe\s*\}\}/g, stop) : null;
  const html = htmlComplet ?? `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body style="margin:0;padding:0">
<div style="font:15px/1.55 Arial,Helvetica,sans-serif;color:#141414;max-width:640px;padding:20px 18px 28px">${lierUrls(echap(d.corps.trim())).replace(/\n/g, "<br>")}
${signatureHtml(d.marque, Boolean(images))}
${desinscription ? `<p style="margin:28px 0 0;font-size:12px;color:#8A8680">Vous ne souhaitez plus recevoir de message de Studio ES ni de Fill ? Répondez simplement « stop », ou <a href="${stop}" style="color:#8A8680">cliquez ici</a>.</p>` : ""}
</div></body></html>`;
  const de = d.type === "prospection" ? EXPEDITEUR_PROSPECTION : EXPEDITEUR;
  const nomRetour = d.marque === "fill" ? "Ewen Soupault, Fill" : "Ewen Soupault, Studio ES";
  const enTetes: Record<string, string> = {
    ...(desinscription ? { "List-Unsubscribe": `<${stop}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : {}),
    // une relance arrive dans la même conversation que le premier message
    ...(d.precedent ? { "In-Reply-To": d.precedent, "References": d.precedent } : {}),
  };
  const pj = piecesJointes(d.pj);

  if (smtp) {
    const nomDest = d.nom ? String(d.nom).slice(0, 70).replace(/["<>]/g, "") : "";
    const jointes: any[] = pj.map((p) => ({ filename: p.name, path: p.url }));
    if (images) jointes.push(
      { filename: "signature.png", content: images.nom, contentType: "image/png", cid: CID_NOM, contentDisposition: "inline" },
      { filename: "logo.png", content: images.filigrane, contentType: "image/png", cid: CID_FILIGRANE, contentDisposition: "inline" },
    );
    const info = await smtp.sendMail({
      from: { name: "Ewen Soupault", address: DE_SMTP || de },
      replyTo: { name: nomRetour, address: "contact@studioes.fr" },
      to: nomDest ? { name: nomDest, address: d.email } : d.email,
      ...(d.cc ? { cc: d.cc } : {}),
      subject: d.objet, text: texte, html,
      headers: enTetes,
      ...(jointes.length ? { attachments: jointes } : {}),
    });
    const refuses = (info.rejected ?? []) as unknown[];
    if (refuses.length) throw new Error(`OVH : adresse refusée (${refuses.join(", ").slice(0, 150)})`);
    return String(info.messageId ?? "");
  }

  throw new Error("boîte OVH non réglée (OVH_SMTP_USER, OVH_SMTP_PASS)");
}

async function passage(forcer = false) {
  const jour = new Date().toLocaleDateString("en-GB", { timeZone: "Europe/Paris", weekday: "short" });
  const heure = Number(new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hour12: false }));
  if (!forcer && (["Sat", "Sun"].includes(jour) || heure < 8 || heure >= 18)) return { pause: `${jour} ${heure} h` };
  const deja = (await sb.rpc("sequence_envoyes_aujourdhui")).data ?? 0;
  const place = Math.max(0, Math.min(PAR_PASSAGE, PAR_JOUR - deja));
  if (!place) return { plafond: deja };
  const { data: dus, error } = await sb.rpc("sequence_dus", { lim: place });
  if (error) throw error;
  const bilan: any[] = [];
  for (const d of dus ?? []) {
    const stop = (await sb.from("mail_stop").select("email").eq("email", d.email).maybeSingle()).data;
    if (stop) { await sb.rpc("sequence_arreter", { p_email: d.email, p_statut: "desinscrit", p_raison: "ne souhaite plus de mails" }); bilan.push({ email: d.email, arrete: "desinscrit" }); continue; }
    try {
      // sequence_dus ne renvoie pas (encore) les pièces jointes : on les lit sur le message lui-même
      if (d.pj === undefined || d.html === undefined) {
        const m = (await sb.from("sequence_message").select("pj, html").eq("id", d.message_id).maybeSingle()).data;
        d.pj ??= m?.pj ?? null; d.html ??= m?.html ?? null;
      }
      if (d.sans_pied === undefined) d.sans_pied = (await sb.from("sequence").select("sans_pied").eq("id", d.sequence_id).maybeSingle()).data?.sans_pied === true;
      const id = await envoyer(d);
      await sb.from("sequence_message").update({ statut: "envoye", envoye_le: new Date().toISOString(), brevo_id: id }).eq("id", d.message_id);
      const reste = (await sb.from("sequence_message").select("id").eq("sequence_id", d.sequence_id).eq("statut", "prevu")).data ?? [];
      if (!reste.length) await sb.from("sequence").update({ statut: "terminee", maj: new Date().toISOString() }).eq("id", d.sequence_id).eq("statut", "active");
      bilan.push({ email: d.email, rang: d.rang, envoye: true });
    } catch (e) {
      await sb.from("sequence_message").update({ statut: "echec", erreur: String(e).slice(0, 300) }).eq("id", d.message_id);
      await sb.from("sequence").update({ statut: "erreur", raison: String(e).slice(0, 200), maj: new Date().toISOString() }).eq("id", d.sequence_id);
      bilan.push({ email: d.email, erreur: String(e) });
    }
  }
  return { envoyes: bilan, voie: "ovh", expediteur_prospection: EXPEDITEUR_PROSPECTION };
}

Deno.serve(async (req) => {
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const ok = Boolean(CLE) && jeton.length >= 32 && (jeton === CLE || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  if (!ok) return new Response("Réservé au serveur", { status: 401 });
  if (!smtp) return new Response(JSON.stringify({ erreur: "boîte OVH non réglée" }), { status: 500 });
  const corps = await req.json().catch(() => ({}));
  // { "test": "adresse", "marque"?: "studio" | "fill", "type"?: "prospection" } : un message d'essai par la voie en
  // place, sans toucher aux séquences
  if (typeof corps.test === "string" && corps.test.includes("@")) {
    const marque = corps.marque === "fill" ? "fill" : "studio";
    try {
      const id = await envoyer({ email: corps.test, marque, type: corps.type === "prospection" ? "prospection" : "test", objet: `Essai d'envoi Hors-champ (${marque === "fill" ? "Fill" : "Studio ES"})`, corps: "Bonjour,\n\nCeci est un essai d'envoi automatique depuis Hors-champ.\n\nBien cordialement" });
      return new Response(JSON.stringify({ test: "ok", voie: "ovh", marque, signature_jointe: Boolean(smtp && await imagesSignature(marque)), id }), { headers: { "content-type": "application/json" } });
    } catch (e) { return new Response(JSON.stringify({ test: "echec", voie: "ovh", erreur: String(e) }), { status: 500, headers: { "content-type": "application/json" } }); }
  }
  try { return new Response(JSON.stringify(await passage(corps.forcer === true)), { headers: { "content-type": "application/json" } }); }
  catch (e) { return new Response(JSON.stringify({ erreur: String(e) }), { status: 500, headers: { "content-type": "application/json" } }); }
});
