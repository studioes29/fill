// Parcours de mails automatiques de Fill et de Studio ES : fin de mission, relance à trois mois, demandes d'avis Google,
// prospects Brevo (vérification des adresses, segment recrutement) et campagne de lancement par vagues.
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL")!;
const MODELES = "https://fill.studioes.fr/assets/mail/tpl";
const POUR_EWEN = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
const EXPEDITEUR = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";

const REGLES = {
  avisAgeMinJours: 75,
  avisLivreesMin: 3,
  avisFraicheurJours: 3,
  avisIntervalleJours: 365,
  avisAvantFinJours: 30,
  finRattrapageJours: 7,
  relanceRelaisJours: 90,
};
const CREATIONS = ["affiche", "flyer", "news", "page", "video"];

const sb = createClient(URL_SB, CLE, { auth: { persistSession: false } });
const auj = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
const jours = (a: string, b: string) => Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a.slice(0, 10) + "T12:00:00Z")) / 864e5);
const dateFr = (s: string) => new Date(s + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
const echap = (t: unknown) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as Record<string, string>)[c]);
const prenom = (nom?: string) => (nom ?? "").trim().split(/\s+/)[0] || "";
const structure = (nom: string) => {
  const m = nom.match(/^(Commune|Ville|Mairie|Communauté de communes|Communauté d’agglomération|Communauté d'agglomération|Syndicat|Office de tourisme)\b/);
  return m ? "la " + m[1].charAt(0).toLowerCase() + nom.slice(1) : nom;
};
const duree = (mois: number) => mois >= 24 && mois % 12 === 0 ? `${mois / 12} ans` : mois === 12 ? "douze mois" : `${mois} mois`;

const enc = new TextEncoder();
const signer = async (txt: string) => {
  const k = await crypto.subtle.importKey("raw", enc.encode(CLE), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(txt)));
  return btoa(String.fromCharCode(...s)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" } as Record<string, string>)[c]).slice(0, 32);
};
const lien = async (a: string, email: string) => `${URL_SB}/functions/v1/parcours?a=${a}&e=${encodeURIComponent(email)}&s=${await signer(a + ":" + email)}`;

const BREVO = Deno.env.get("BREVO_API_KEY") ?? "";
const brevoBloque = async (email: string) => {
  if (!BREVO) return false;
  const r = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, { headers: { "api-key": BREVO, accept: "application/json" } }).catch(() => null);
  if (!r?.ok) return false;
  const c = await r.json();
  return Boolean(c.emailBlacklisted);
};
const envoyer = async (m: { a: { email: string; name?: string }[]; sujet: string; html: string; tags: string[]; marque?: "fill" | "studio" }) => {
  if (!BREVO) throw new Error("Clé Brevo absente");
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: m.marque === "studio" ? "Studio ES" : "Fill", email: EXPEDITEUR },
      replyTo: { email: "contact@studioes.fr", name: m.marque === "studio" ? "Ewen Soupault, Studio ES" : "Ewen Soupault, Fill" },
      to: m.a, subject: m.sujet, htmlContent: m.html, tags: m.tags,
    }),
  });
  if (!r.ok) throw new Error(`Brevo ${r.status} : ${(await r.text()).slice(0, 200)}`);
};

const cache = new Map<string, string>();
const modele = async (nom: string, params: Record<string, string>, avecAvis = true) => {
  let h = cache.get(nom);
  if (!h) {
    const r = await fetch(`${MODELES}/${nom}.html?v=${Date.now()}`);
    if (!r.ok) throw new Error(`Modèle ${nom} introuvable`);
    h = await r.text(); cache.set(nom, h);
  }
  let out = h.replace(/\{\{\s*params\.(\w+)\s*\}\}/g, (_, k) => echap(params[k] ?? ""));
  if (!avecAvis) out = out.replace(/<!--avis-->[\s\S]*?<!--\/avis-->/g, "");
  out = out.replace(/<a href="\{\{ mirror \}\}"[^>]*>Voir en ligne<\/a>/g, "");
  return out;
};

const dejaAvis = async (email: string) => Boolean((await sb.from("avis_google").select("email").eq("email", email).maybeSingle()).data);
const stop = async (email: string) => Boolean((await sb.from("mail_stop").select("email").eq("email", email).maybeSingle()).data);
const demandeRecente = async (email: string) => {
  const depuis = new Date(Date.now() - REGLES.avisIntervalleJours * 864e5).toISOString();
  const { data } = await sb.from("mail_envoi").select("id").eq("email", email).eq("statut", "envoye")
    .or("type.eq.avis_fill,type.eq.avis_studio,avec_avis.eq.true").gte("cree", depuis).limit(1);
  return Boolean(data?.length);
};
const freinAvis = async (email: string) => {
  if (await dejaAvis(email)) return "avis déjà laissé";
  if (await stop(email)) return "ne souhaite plus de mails";
  if (await demandeRecente(email)) return "avis déjà demandé il y a moins d’un an";
  if (await brevoBloque(email)) return "désinscrit dans Brevo";
  return null;
};
const journal = async (e: { cle: string; type: string; email: string; organisation_id?: string; statut: string; avec_avis?: boolean; detail?: string }) =>
  (await sb.from("mail_envoi").insert({ ...e, avec_avis: e.avec_avis ?? false })).error;

type Ligne = { quoi: string; qui: string; statut: string; detail?: string; avisRecu?: string };

async function quotidien(simuler: boolean): Promise<Ligne[]> {
  const j = auj();
  const bilan: Ligne[] = [];
  const [{ data: orgs }, { data: profils }, { data: demandes }, { data: hist }, { data: lignes }] = await Promise.all([
    sb.from("organisation").select("*").eq("essai", false),
    sb.from("profil").select("id, nom, email, role, organisation_id, actif"),
    sb.from("demande").select("id, organisation_id, titre, statut, creee"),
    sb.from("historique").select("demande_id, statut, date").eq("statut", "livree"),
    sb.from("demande_ligne").select("demande_id, prestation, quantite"),
  ]);
  for (const o of orgs ?? []) {
    if (!o.mails_auto) continue;
    const refs = (profils ?? []).filter((p) => p.organisation_id === o.id && p.role === "referent");
    const ref = refs.find((p) => p.actif) ?? refs[0];
    if (!ref?.email) continue;
    const email = ref.email.toLowerCase();
    const ds = (demandes ?? []).filter((d) => d.organisation_id === o.id);
    const livrees = ds.filter((d) => d.statut === "livree");
    const dateLivraison = (id: string) => (hist ?? []).filter((h) => h.demande_id === id).map((h) => h.date).sort().pop();

    if (o.fin && o.fin <= j && jours(o.fin, j) <= REGLES.finRattrapageJours) {
      const type = o.formule === "relais" ? "fin_relais" : "fin_abonnement";
      const cle = `${type}:${o.id}:${o.fin}`;
      const deja = (await sb.from("mail_envoi").select("statut").eq("cle", cle).maybeSingle()).data;
      if (!deja || deja.statut !== "envoye") {
        if (!o.dossier_url) {
          bilan.push({ quoi: type === "fin_relais" ? "Fin de Relais" : "Fin d’abonnement", qui: `${o.nom} (${ref.nom})`, statut: "bloqué", detail: "le lien du dossier n’est pas renseigné : le mail partira dès qu’il le sera" });
        } else {
          const avec = !(await freinAvis(email));
          const sdl = (pred: (p: string) => boolean) => (lignes ?? []).filter((l) => livrees.some((d) => d.id === l.demande_id) && pred(l.prestation)).reduce((s, l) => s + l.quantite, 0);
          const mois = Math.max(1, Math.round(jours(o.debut, o.fin) / 30.4));
          const params = {
            prenom: prenom(ref.nom), structure: structure(o.nom), date_fin: dateFr(o.fin), duree: duree(mois),
            nb_semaines: String(Math.max(1, Math.ceil(jours(o.debut, o.fin) / 7))), nb_livrables: String(livrees.length),
            nb_demandes: String(ds.filter((d) => d.statut !== "annulee").length),
            nb_publications: String(sdl((p) => p === "post")), nb_creations: String(sdl((p) => CREATIONS.includes(p))),
            lien_dossier: o.dossier_url,
          };
          const sujet = type === "fin_relais" ? "Fin du relais : votre dossier de passation est prêt" : "Fin d’abonnement : votre dossier de restitution est prêt";
          if (!simuler) {
            try {
              await envoyer({ a: [{ email, name: ref.nom }], sujet, html: await modele(type === "fin_relais" ? "relais" : "restitution", params, avec), tags: [type] });
              if (deja) await sb.from("mail_envoi").delete().eq("cle", cle);
              await journal({ cle, type, email, organisation_id: o.id, statut: "envoye", avec_avis: avec });
            } catch (e) { bilan.push({ quoi: sujet, qui: `${o.nom} (${ref.nom})`, statut: "erreur", detail: String(e) }); continue; }
          }
          bilan.push({ quoi: type === "fin_relais" ? "Fin de Relais" : "Fin d’abonnement", qui: `${o.nom} (${ref.nom})`, statut: simuler ? "prévu" : "envoyé", detail: avec ? "avec la demande d’avis" : "sans la demande d’avis", avisRecu: avec ? email : undefined });
        }
      }
      continue;
    }

    if (o.fin && o.fin <= j && o.formule === "relais") {
      const quand = jours(o.fin, j) - REGLES.relanceRelaisJours;
      if (quand < 0 || quand > REGLES.finRattrapageJours) continue;
      const cle = `relance_relais:${o.id}:${o.fin}`;
      if ((await sb.from("mail_envoi").select("id").eq("cle", cle).maybeSingle()).data) continue;
      const finEnvoye = (await sb.from("mail_envoi").select("id").eq("cle", `fin_relais:${o.id}:${o.fin}`).eq("statut", "envoye").maybeSingle()).data;
      if (!finEnvoye) continue;
      if (await stop(email) || await brevoBloque(email)) continue;
      const repris = (orgs ?? []).some((x) => x.id !== o.id && x.statut === "active" && (!x.fin || x.fin > j) && (profils ?? []).some((p) => p.organisation_id === x.id && p.email?.toLowerCase() === email));
      if (repris) continue;
      if (!simuler) {
        try {
          await envoyer({ a: [{ email, name: ref.nom }], sujet: "Trois mois après le relais", tags: ["relance_relais"],
            html: await modele("relance", { prenom: prenom(ref.nom), structure: structure(o.nom), date_fin: dateFr(o.fin), lien_stop: await lien("stop", email) }) });
          await journal({ cle, type: "relance_relais", email, organisation_id: o.id, statut: "envoye" });
        } catch (e) { bilan.push({ quoi: "Relance à trois mois", qui: `${o.nom} (${ref.nom})`, statut: "erreur", detail: String(e) }); continue; }
      }
      bilan.push({ quoi: "Relance à trois mois", qui: `${o.nom} (${ref.nom})`, statut: simuler ? "prévu" : "envoyé", detail: "trois mois après la fin du relais" });
      continue;
    }
    if (o.fin && o.fin <= j) continue;

    if (o.statut !== "active" || !o.debut) continue;
    if (jours(o.debut, j) < REGLES.avisAgeMinJours) continue;
    if (livrees.length < REGLES.avisLivreesMin) continue;
    if (o.fin && jours(j, o.fin) >= 0 && jours(j, o.fin) <= REGLES.avisAvantFinJours) continue;
    const derniere = livrees.map((d) => ({ d, le: dateLivraison(d.id) })).filter((x) => x.le).sort((a, b) => b.le!.localeCompare(a.le!))[0];
    if (!derniere || jours(derniere.le!, j) > REGLES.avisFraicheurJours) continue;
    const frein = await freinAvis(email);
    if (frein) continue;
    const cle = `avis_fill:${email}:${j.slice(0, 4)}`;
    if (!simuler) {
      try {
        await envoyer({ a: [{ email, name: ref.nom }], sujet: "Deux minutes pour un avis sur Fill ?", html: await modele("avis", { prenom: prenom(ref.nom), livrable: derniere.d.titre }), tags: ["avis_fill"] });
        await journal({ cle, type: "avis_fill", email, organisation_id: o.id, statut: "envoye", detail: derniere.d.titre });
      } catch (e) { bilan.push({ quoi: "Demande d’avis", qui: `${o.nom} (${ref.nom})`, statut: "erreur", detail: String(e) }); continue; }
    }
    bilan.push({ quoi: "Demande d’avis", qui: `${o.nom} (${ref.nom})`, statut: simuler ? "prévu" : "envoyé", detail: `après « ${derniere.d.titre} »`, avisRecu: email });
  }
  return bilan;
}

async function recap(bilan: Ligne[]) {
  if (!bilan.length || !BREVO) return;
  const rangs = await Promise.all(bilan.map(async (b) => `<tr><td style="padding:12px 0;border-top:1px solid #EFEAE4;font:400 15px/1.5 Arial,sans-serif;color:#1A1A1A">
    <b>${echap(b.quoi)}</b> · ${echap(b.statut)}<br>${echap(b.qui)}${b.detail ? `<br><span style="color:#6B6560">${echap(b.detail)}</span>` : ""}
    ${b.avisRecu ? `<br><a href="${await lien("avis_recu", b.avisRecu)}" style="color:#7052B3">Son avis est en ligne : ne plus le lui demander</a>` : ""}</td></tr>`));
  await envoyer({
    a: [{ email: POUR_EWEN }], sujet: `Parcours du ${dateFr(auj())} : ${bilan.length} mail${bilan.length > 1 ? "s" : ""}`, tags: ["parcours_recap"],
    html: `<!doctype html><html lang="fr"><body style="margin:0;background:#F8F5F2"><table role="presentation" width="100%"><tr><td align="center" style="padding:28px 16px">
      <table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:22px"><tr><td style="padding:32px 32px 24px">
      <p style="margin:0 0 14px;font:700 22px/1.2 Arial,sans-serif;color:#1A1A1A">Mails de parcours du jour</p>
      <table role="presentation" width="100%">${rangs.join("")}</table>
      <p style="margin:18px 0 0;font:400 13px/1.5 Arial,sans-serif;color:#8A847D">Envoyé par l’espace Fill. Les règles : fin de mission le jour de la fin du contrat ; relance unique trois mois après un Relais ; avis vers le troisième mois, après un livrable, une fois par an au plus, jamais à qui en a déjà laissé un.</p>
      </td></tr></table></td></tr></table></body></html>`,
  });
}

const api = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(`https://api.brevo.com/v3${path}`, { ...init, headers: { "api-key": BREVO, "content-type": "application/json", accept: "application/json" } });
  const t = await r.text();
  let j: any = null; try { j = t ? JSON.parse(t) : null; } catch { /* rien */ }
  if (!r.ok) throw new Error(`Brevo ${path} ${r.status} ${t.slice(0, 160)}`);
  return j;
};
const LISTES = ["Clients Fill", "Prospects Fill", "Anciens clients Fill", "Prospects Fill · recrutement", "Lancement envoyé"];
async function listes() {
  const f = await api("/contacts/folders?limit=50&offset=0");
  const dossier = (f?.folders ?? []).find((x: any) => x.name === "Fill")?.id ?? (await api("/contacts/folders", { method: "POST", body: JSON.stringify({ name: "Fill" }) })).id;
  const l = await api("/contacts/lists?limit=50&offset=0");
  const ids: Record<string, number> = {};
  for (const nom of LISTES) ids[nom] = (l?.lists ?? []).find((x: any) => x.name === nom)?.id ?? (await api("/contacts/lists", { method: "POST", body: JSON.stringify({ name: nom, folderId: dossier }) })).id;
  return ids;
}
async function synchroniser(ids: Record<string, number>) {
  const j = auj();
  const [{ data: orgs }, { data: profils }] = await Promise.all([
    sb.from("organisation").select("id, statut, fin, essai"),
    sb.from("profil").select("email, organisation_id, actif").not("organisation_id", "is", null),
  ]);
  let n = 0;
  for (const p of profils ?? []) {
    const o = (orgs ?? []).find((x) => x.id === p.organisation_id);
    if (!o || o.essai || !p.email) continue;
    const enCours = o.statut === "active" && !(o.fin && o.fin <= j) && p.actif;
    const termine = o.statut === "resiliee" || (o.fin && o.fin <= j);
    if (!enCours && !termine) continue;
    await api("/contacts", { method: "POST", body: JSON.stringify({ email: p.email.toLowerCase(), updateEnabled: true,
      listIds: [enCours ? ids["Clients Fill"] : ids["Anciens clients Fill"]], unlinkListIds: [enCours ? ids["Anciens clients Fill"] : ids["Clients Fill"], ids["Prospects Fill"], ids["Prospects Fill · recrutement"]] }) }).catch(() => null);
    n++;
  }
  return n;
}
async function brouillons(ids: Record<string, number>) {
  const ex = await api("/emailCampaigns?status=draft&limit=100&offset=0");
  const noms = (ex?.campaigns ?? []).map((c: any) => c.name);
  const items = [
    { name: "Fill · Lancement (prospects)", subject: "Votre com déborde ? Fill prend le relais", previewText: "Réseaux, site, newsletter, affiches : la communication courante de votre structure, à prix fixe, avec un espace en ligne pour tout suivre.", tpl: "lancement" },
    { name: "Fill · Newsletter n° 1 (janvier à mars 2027)", subject: "Le fil du trimestre : janvier à mars 2027", previewText: "Les temps forts à préparer, le droit à l’image, un exemple et une nouveauté de l’espace.", tpl: "newsletter" },
  ];
  const crees: string[] = [];
  for (const it of items) {
    if (noms.includes(it.name)) continue;
    const r = await fetch(`${MODELES}/${it.tpl}.html?v=${Date.now()}`);
    if (!r.ok) throw new Error(`Modèle ${it.tpl} introuvable`);
    await api("/emailCampaigns", { method: "POST", body: JSON.stringify({ name: it.name, subject: it.subject, previewText: it.previewText,
      sender: { name: "Fill", email: EXPEDITEUR }, replyTo: "contact@studioes.fr", htmlContent: await r.text() }) });
    crees.push(it.name);
  }
  return crees;
}

// ---------- vérification des adresses (format et messagerie du domaine) ----------
const cacheMx = new Map<string, boolean>();
const domaineRecoit = async (dom: string) => {
  if (cacheMx.has(dom)) return cacheMx.get(dom)!;
  const q = async (type: string) => {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(dom)}&type=${type}`, { headers: { accept: "application/dns-json" } });
    if (!r.ok) throw new Error("dns");
    const j = await r.json();
    return { status: j.Status as number, n: (j.Answer ?? []).filter((a: any) => a.type === (type === "MX" ? 15 : 1)).length };
  };
  let ok = true;
  try {
    const mx = await q("MX");
    if (mx.status === 3) ok = false;
    else if (!mx.n) ok = (await q("A")).n > 0;
  } catch { ok = true; }
  cacheMx.set(dom, ok);
  return ok;
};
const verifierAdresse = async (brut: string) => {
  const email = String(brut ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(email)) return { email, ok: false, raison: "format invalide" };
  if (await stop(email)) return { email, ok: false, raison: "ne souhaite plus de mails" };
  if (!(await domaineRecoit(email.split("@")[1]))) return { email, ok: false, raison: "ce domaine ne reçoit pas de mail" };
  return { email, ok: true };
};

// ---------- campagne de lancement par vagues ----------
const DELAI_VAGUE_JOURS = 21;
async function contactsDe(listId: number) {
  const out: any[] = [];
  for (let off = 0; off < 5000; off += 500) {
    const r = await api(`/contacts/lists/${listId}/contacts?limit=500&offset=${off}`);
    out.push(...(r?.contacts ?? []));
    if ((r?.contacts ?? []).length < 500) break;
  }
  return out;
}
async function eligiblesVague(ids: Record<string, number>, exclure: string[]) {
  const ex = new Set(exclure.map((e) => String(e).toLowerCase()));
  const limite = Date.now() - DELAI_VAGUE_JOURS * 864e5;
  const bloques = [ids["Clients Fill"], ids["Anciens clients Fill"], ids["Lancement envoyé"]];
  const stops = new Set(((await sb.from("mail_stop").select("email")).data ?? []).map((x: any) => x.email));
  const tous = await contactsDe(ids["Prospects Fill"]);
  const prets = tous.filter((c) => !c.emailBlacklisted && !ex.has(String(c.email).toLowerCase()) && !stops.has(String(c.email).toLowerCase())
    && !(c.listIds ?? []).some((l: number) => bloques.includes(l)));
  return { prets: prets.filter((c) => Date.parse(c.createdAt) <= limite), bientot: prets.filter((c) => Date.parse(c.createdAt) > limite).length };
}
async function preparerVague(ids: Record<string, number>, exclure: string[]) {
  const { prets } = await eligiblesVague(ids, exclure);
  if (!prets.length) return { vague: null, contacts: 0 };
  const l = await api("/contacts/lists?limit=50&offset=0");
  const n = (l?.lists ?? []).filter((x: any) => /^Fill · Lancement, vague \d+$/.test(x.name)).length + 1;
  const f = await api("/contacts/folders?limit=50&offset=0");
  const dossier = (f?.folders ?? []).find((x: any) => x.name === "Fill")?.id;
  const liste = (await api("/contacts/lists", { method: "POST", body: JSON.stringify({ name: `Fill · Lancement, vague ${n}`, folderId: dossier }) })).id;
  const emails = prets.map((c) => String(c.email).toLowerCase());
  for (let i = 0; i < emails.length; i += 150) {
    const lot = emails.slice(i, i + 150);
    await api(`/contacts/lists/${liste}/contacts/add`, { method: "POST", body: JSON.stringify({ emails: lot }) });
    await api(`/contacts/lists/${ids["Lancement envoyé"]}/contacts/add`, { method: "POST", body: JSON.stringify({ emails: lot }) });
  }
  const r = await fetch(`${MODELES}/lancement.html?v=${Date.now()}`);
  if (!r.ok) throw new Error("Modèle lancement introuvable");
  const c = await api("/emailCampaigns", { method: "POST", body: JSON.stringify({
    name: `Fill · Lancement, vague ${n}`, subject: "Votre com déborde ? Fill prend le relais",
    previewText: "Réseaux, site, newsletter, affiches : la communication courante de votre structure, à prix fixe, avec un espace en ligne pour tout suivre.",
    sender: { name: "Fill", email: EXPEDITEUR }, replyTo: "contact@studioes.fr", htmlContent: await r.text(),
    recipients: { listIds: [liste], exclusionListIds: [ids["Clients Fill"], ids["Anciens clients Fill"]] } }) });
  return { vague: n, contacts: emails.length, campagne: c?.id ?? null };
}

const page = (titre: string, texte: string) => new Response(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titre}</title>
<body style="margin:0;background:#E9E1FF;font:400 17px/1.5 Arial,sans-serif;color:#1A1A1A"><div style="max-width:460px;margin:12vh auto;background:#F8F5F2;border-radius:22px;padding:32px 30px">
<p style="margin:0 0 10px;font-weight:700;font-size:22px">${titre}</p><p style="margin:0;color:#4A4540">${texte}</p></div></body></html>`, { headers: { "content-type": "text/html; charset=utf-8" } });

Deno.serve(async (req) => {
  const u = new URL(req.url);
  if (req.method === "GET") {
    const a = u.searchParams.get("a") ?? "", e = (u.searchParams.get("e") ?? "").toLowerCase(), s = u.searchParams.get("s") ?? "";
    if (!["avis_recu", "stop"].includes(a) || !e || s !== await signer(a + ":" + e)) return page("Lien invalide", "Ce lien n’est pas valable ou a été modifié.");
    if (a === "avis_recu") { await sb.from("avis_google").upsert({ email: e, source: "lien" }); return page("C’est noté", `${echap(e)} ne recevra plus de demande d’avis.`); }
    await sb.from("mail_stop").upsert({ email: e }); return page("C’est noté", "Vous ne recevrez plus ces messages automatiques.");
  }
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const ok = Boolean(CLE) && jeton.length >= 32 && (jeton === CLE || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  if (!ok) return new Response("Réservé au serveur", { status: 401 });
  const corps = await req.json().catch(() => ({}));
  const action = corps.action ?? "quotidien";
  const json = (x: unknown, status = 200) => new Response(JSON.stringify(x), { status, headers: { "content-type": "application/json" } });

  if (action === "quotidien" || action === "apercu") {
    const bilan = await quotidien(action === "apercu");
    if (action === "quotidien") { await recap(bilan); await listes().then(synchroniser).catch(() => null); }
    return json(bilan);
  }
  if (action === "avis_recu") {
    const e = String(corps.email ?? "").toLowerCase();
    if (!e.includes("@")) return json({ erreur: "email manquant" }, 400);
    await sb.from("avis_google").upsert({ email: e, nom: corps.nom ?? null, marque: corps.marque === "studio" ? "studio" : "fill", source: corps.source ?? "manuel" });
    return json({ ok: true });
  }
  if (action === "avis_verifier") {
    const e = String(corps.email ?? "").toLowerCase();
    if (!e.includes("@")) return json({ erreur: "email manquant" }, 400);
    return json({ email: e, frein: await freinAvis(e) });
  }
  if (action === "prospect") {
    const e = String(corps.email ?? "").toLowerCase().trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return json({ erreur: "email invalide" }, 400);
    if (await stop(e)) return json({ ajoute: false, raison: "ne souhaite plus de mails" });
    try {
      const ids = await listes();
      const deja = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(e)}`, { headers: { "api-key": BREVO, accept: "application/json" } });
      if (deja.ok) { const c = await deja.json(); if (c.emailBlacklisted) return json({ ajoute: false, raison: "désinscrit dans Brevo" });
        if ((c.listIds ?? []).some((x: number) => x === ids["Clients Fill"] || x === ids["Anciens clients Fill"])) return json({ ajoute: false, raison: "déjà client de Fill" }); }
      const nom = String(corps.nom ?? "").trim(), [pre, ...rest] = nom.split(/\s+/);
      const v = await verifierAdresse(e);
      if (!v.ok) return json({ ajoute: false, raison: v.raison });
      const rec = corps.segment === "recrutement";
      const base = { email: e, updateEnabled: true, listIds: [rec ? ids["Prospects Fill · recrutement"] : ids["Prospects Fill"]], ...(rec ? { unlinkListIds: [ids["Prospects Fill"]] } : {}) };
      const attrs = { ...(pre ? { PRENOM: pre } : {}), ...(rest.length ? { NOM: rest.join(" ") } : {}) };
      await api("/contacts", { method: "POST", body: JSON.stringify({ ...base, attributes: attrs }) })
        .catch(() => api("/contacts", { method: "POST", body: JSON.stringify(base) }));
      return json({ ajoute: true, segment: rec ? "recrutement" : "prospects" });
    } catch (err) { return json({ ajoute: false, raison: String(err) }, 502); }
  }
  if (action === "verifier") {
    const L = (Array.isArray(corps.emails) ? corps.emails : []).slice(0, 60);
    return json(await Promise.all(L.map(verifierAdresse)));
  }
  if (action === "vague_etat" || action === "vague_preparer") {
    try {
      const ids = await listes(), ex = Array.isArray(corps.exclure) ? corps.exclure : [];
      if (action === "vague_etat") { const r = await eligiblesVague(ids, ex); return json({ prets: r.prets.length, bientot: r.bientot, delai: DELAI_VAGUE_JOURS }); }
      return json(await preparerVague(ids, ex));
    } catch (err) { return json({ erreur: String(err) }, 502); }
  }
  if (action === "avis_studio") {
    const e = String(corps.email ?? "").toLowerCase();
    if (!e.includes("@") || !corps.projet) return json({ erreur: "email et projet requis" }, 400);
    const frein = await freinAvis(e);
    if (frein) return json({ envoye: false, raison: frein });
    const cle = `avis_studio:${e}:${auj().slice(0, 4)}`;
    await envoyer({ a: [{ email: e, name: corps.nom ?? undefined }], marque: "studio", sujet: "Votre avis sur Studio ES ?", tags: ["avis_studio"],
      html: await modele("ses_avis", { prenom: corps.prenom ?? prenom(corps.nom), projet: corps.projet }) });
    await journal({ cle, type: "avis_studio", email: e, statut: "envoye", detail: corps.projet });
    if (!corps.sans_recap) await recap([{ quoi: "Demande d’avis Studio ES", qui: `${corps.nom ?? e}`, statut: "envoyé", detail: `projet « ${corps.projet} »`, avisRecu: e }]);
    return json({ envoye: true });
  }
  if (action === "brevo_preparer") {
    try { const ids = await listes(); const clients = await synchroniser(ids); const crees = await brouillons(ids); return json({ listes: ids, contacts_synchronises: clients, brouillons_crees: crees }); }
    catch (e) { return json({ erreur: String(e) }, 502); }
  }
  return json({ erreur: "action inconnue" }, 400);
});
