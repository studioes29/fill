// Envois automatiques de Hors-champ (prospection, campagnes, parcours clients).
// Appelée par pg_cron toutes les 10 minutes en semaine : envoie les messages arrivés à échéance via Brevo,
// en arrêtant une séquence si l'adresse est en erreur, désinscrite ou a signalé un spam.
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL")!;
const BREVO = Deno.env.get("BREVO_API_KEY") ?? "";
const EXPEDITEUR = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";
const PAR_PASSAGE = 6;      // messages au plus par passage (toutes les 10 minutes)
const PAR_JOUR = 45;        // plafond quotidien, toutes séquences confondues
const sb = createClient(URL_SB, CLE, { auth: { persistSession: false } });

const enc = new TextEncoder();
const signer = async (txt: string) => {
  const k = await crypto.subtle.importKey("raw", enc.encode(CLE), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(txt)));
  return btoa(String.fromCharCode(...s)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" } as Record<string, string>)[c]).slice(0, 32);
};
// même lien que la fonction « parcours » : il inscrit l'adresse dans mail_stop
const lienStop = async (email: string) => `${URL_SB}/functions/v1/parcours?a=stop&e=${encodeURIComponent(email)}&s=${await signer("stop:" + email)}`;
const echap = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as Record<string, string>)[c]);
const lierUrls = (t: string) => t.replace(/https?:\/\/[^\s<)]+[^\s<).,;:!?]/g, (u) => `<a href="${u}" style="color:#141414">${u}</a>`);

const SIGNATURE: Record<string, string> = {
  studio: "Ewen Soupault\nPhotographie de reportage, sites et applications\n06 51 22 21 07 · studioes.fr · Prendre rendez-vous : https://cal.com/studioes/30min",
  fill: "Ewen Soupault\nFill, service de communication externalisé\n06 51 22 21 07 · fill.studioes.fr · Prendre rendez-vous : https://cal.com/studioes/30min",
};
// signature HTML : carte aux couleurs de la marque (nom et métier en image pour garder les polices des sites,
// filigrane du logo à droite), contacts en vrai texte cliquable
const signatureHtml = (marque: string) => {
  const fill = marque === "fill";
  const bg = fill ? "#EFE9FF" : "#F0EEE9";
  const base = fill ? "https://fill.studioes.fr/assets/mail/signature" : "https://studioes.fr/images/signature";
  const alt = fill ? "Ewen Soupault, Fill, service de communication externalisé" : "Ewen Soupault, Studio ES, photographie, sites et applications";
  const site = fill ? ["fill.studioes.fr", "https://fill.studioes.fr/"] : ["studioes.fr", "https://studioes.fr/"];
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;border-collapse:separate;border-spacing:0">
<tr><td bgcolor="${bg}" style="background:${bg};border-radius:18px 0 0 0;padding:0;vertical-align:top;line-height:0"><img src="${base}-nom.png" width="370" height="84" alt="${alt}" style="display:block;width:370px;height:84px;border:0"></td>
<td rowspan="2" width="130" style="padding:0;vertical-align:top;line-height:0"><img src="${base}-filigrane.png" width="130" height="122" alt="" style="display:block;width:130px;height:122px;border:0"></td></tr>
<tr><td bgcolor="${bg}" style="background:${bg};border-radius:0 0 0 18px;padding:0 0 0 22px;height:38px;vertical-align:top;font:13px/1.4 Arial,Helvetica,sans-serif;color:#141414"><a href="tel:+33651222107" style="color:#141414;text-decoration:none">06 51 22 21 07</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${site[1]}" style="color:#141414;text-decoration:underline">${site[0]}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://cal.com/studioes/30min" style="color:#141414;text-decoration:underline">Prendre rendez-vous</a></td></tr></table>`;
};

const MAUVAIS = new Set(["hardBounces", "hard_bounce", "blocked", "spam", "invalid", "unsubscribed", "unsubscribe", "error"]);
async function evenementsBloquants(messageId: string) {
  if (!messageId) return null;
  const r = await fetch(`https://api.brevo.com/v3/smtp/statistics/events?messageId=${encodeURIComponent(messageId)}&limit=50&sort=desc`, { headers: { "api-key": BREVO, accept: "application/json" } }).catch(() => null);
  if (!r?.ok) return null;
  const j = await r.json().catch(() => ({}));
  const ev = (j.events ?? []).find((e: any) => MAUVAIS.has(String(e.event)));
  return ev ? String(ev.event) : null;
}
async function bloqueBrevo(email: string) {
  const r = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, { headers: { "api-key": BREVO, accept: "application/json" } }).catch(() => null);
  if (!r?.ok) return false;
  return Boolean((await r.json().catch(() => ({}))).emailBlacklisted);
}

async function envoyer(d: any) {
  const stop = await lienStop(d.email);
  const sig = SIGNATURE[d.marque] ?? SIGNATURE.studio;
  const pied = d.type === "prospection" ? `\n\nVous ne souhaitez plus recevoir de message de ma part ? Répondez simplement « stop », ou : ${stop}` : "";
  const texte = `${d.corps.trim()}\n\n${sig}${pied}`;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body style="margin:0;padding:0">
<div style="font:15px/1.55 Arial,Helvetica,sans-serif;color:#141414;max-width:640px">${lierUrls(echap(d.corps.trim())).replace(/\n/g, "<br>")}
${signatureHtml(d.marque)}
${d.type === "prospection" ? `<p style="margin:28px 0 0;font-size:12px;color:#8A8680">Vous ne souhaitez plus recevoir de message de ma part ? Répondez simplement « stop », ou <a href="${stop}" style="color:#8A8680">cliquez ici</a>.</p>` : ""}
</div></body></html>`;
  const corps: any = {
    sender: { name: "Ewen Soupault", email: EXPEDITEUR },
    replyTo: { email: "contact@studioes.fr", name: d.marque === "fill" ? "Ewen Soupault, Fill" : "Ewen Soupault, Studio ES" },
    to: [{ email: d.email, ...(d.nom ? { name: String(d.nom).slice(0, 70) } : {}) }],
    subject: d.objet, textContent: texte, htmlContent: html,
    tags: ["horschamp", d.type, d.marque],
    headers: {
      ...(d.type === "prospection" ? { "List-Unsubscribe": `<${stop}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : {}),
      // une relance arrive dans la même conversation que le premier message
      ...(d.precedent ? { "In-Reply-To": d.precedent, "References": d.precedent } : {}),
    },
  };
  if (d.cc) corps.cc = [{ email: d.cc }];
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST", headers: { "api-key": BREVO, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(corps),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`Brevo ${r.status} : ${t.slice(0, 200)}`);
  try { return JSON.parse(t).messageId as string; } catch { return ""; }
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
    if (stop || await bloqueBrevo(d.email)) { await sb.rpc("sequence_arreter", { p_email: d.email, p_statut: "desinscrit", p_raison: "ne souhaite plus de mails" }); bilan.push({ email: d.email, arrete: "desinscrit" }); continue; }
    if (d.precedent) {
      const ev = await evenementsBloquants(d.precedent);
      if (ev) { await sb.rpc("sequence_arreter", { p_email: d.email, p_statut: ev === "unsubscribed" || ev === "spam" ? "desinscrit" : "erreur", p_raison: `Brevo : ${ev}` }); bilan.push({ email: d.email, arrete: ev }); continue; }
    }
    try {
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
  return { envoyes: bilan };
}

Deno.serve(async (req) => {
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const ok = Boolean(CLE) && jeton.length >= 32 && (jeton === CLE || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  if (!ok) return new Response("Réservé au serveur", { status: 401 });
  if (!BREVO) return new Response(JSON.stringify({ erreur: "clé Brevo absente" }), { status: 500 });
  const corps = await req.json().catch(() => ({}));
  try { return new Response(JSON.stringify(await passage(corps.forcer === true)), { headers: { "content-type": "application/json" } }); }
  catch (e) { return new Response(JSON.stringify({ erreur: String(e) }), { status: 500, headers: { "content-type": "application/json" } }); }
});
