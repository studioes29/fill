// Parcours de mails automatiques de Fill et de Studio ES : fin de mission, relance à trois mois, demandes d'avis Google,
// prospects de Fill (vérification des adresses, segment recrutement) et campagne de lancement par vagues.
// 14 nov 2026 : le lien « stop » (GET) n'inscrit plus rien. Les robots de sécurité des messageries ouvrent tous les liens,
// y compris la nuit : il renvoie vers la page de confirmation https://studioes.fr/desinscription/ (même signature « stop:e »),
// et seul le bouton de cette page désinscrit (fonction « desinscription », en POST).
// 18 nov 2026 : plus de Brevo (compte clos). Les mails partent de la boîte OVH contact@studioes.fr (_partage/smtp.ts) ;
// les listes de prospects sont dans la table fill_contact ; une vague de lancement devient une séquence par destinataire,
// envoyée par la fonction « envoi » depuis la boîte de prospection, sous son plafond quotidien.
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { envoiPret, envoyerSmtp } from "../_partage/smtp.ts";

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
const PAGE_STOP = "https://studioes.fr/desinscription/";

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

const envoyer = async (m: { a: { email: string; name?: string }[]; sujet: string; html: string; tags: string[]; marque?: "fill" | "studio" }) => {
  const r = await envoyerSmtp({
    sender: { name: m.marque === "studio" ? "Studio ES" : "Fill", email: EXPEDITEUR },
    replyTo: { email: "contact@studioes.fr", name: m.marque === "studio" ? "Ewen Soupault, Studio ES" : "Ewen Soupault, Fill" },
    to: m.a, subject: m.sujet, htmlContent: m.html,
  });
  if (!r.ok) throw new Error(`Envoi ${r.status} : ${(await r.text()).slice(0, 200)}`);
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
      if (await stop(email)) continue;
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
  if (!bilan.length || !envoiPret()) return;
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

// ---------- prospects de Fill (table fill_contact) ----------
// segment « prospects » ou « recrutement » ; lancement_le et vague : la vague de lancement qui l'a pris
const estClient = async (email: string) => {
  const { data } = await sb.from("profil").select("organisation_id").ilike("email", email).not("organisation_id", "is", null);
  if (!data?.length) return false;
  const { data: o } = await sb.from("organisation").select("id").in("id", data.map((x: any) => x.organisation_id)).eq("essai", false).limit(1);
  return Boolean(o?.length);
};

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
async function eligiblesVague(exclure: string[]) {
  const ex = new Set(exclure.map((e) => String(e).toLowerCase()));
  const limite = Date.now() - DELAI_VAGUE_JOURS * 864e5;
  const stops = new Set(((await sb.from("mail_stop").select("email")).data ?? []).map((x: any) => x.email));
  const { data: tous } = await sb.from("fill_contact").select("email, prenom, nom, cree").eq("segment", "prospects").is("lancement_le", null).limit(5000);
  const prets: any[] = [];
  for (const c of tous ?? []) {
    const e = String(c.email).toLowerCase();
    if (ex.has(e) || stops.has(e) || await estClient(e)) continue;
    prets.push(c);
  }
  return { prets: prets.filter((c) => Date.parse(c.cree) <= limite), bientot: prets.filter((c) => Date.parse(c.cree) > limite).length };
}
const texteDe = (html: string) => html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|tr|h\d|li)>/gi, "\n")
  .replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&rsquo;|&#8217;/g, "’")
  .replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
async function preparerVague(exclure: string[]) {
  const { prets } = await eligiblesVague(exclure);
  if (!prets.length) return { vague: null, contacts: 0 };
  const n = (((await sb.from("fill_contact").select("vague").not("vague", "is", null).order("vague", { ascending: false }).limit(1)).data ?? [])[0]?.vague ?? 0) + 1;
  const r = await fetch(`${MODELES}/lancement.html?v=${Date.now()}`);
  if (!r.ok) throw new Error("Modèle lancement introuvable");
  // Black Week 2026 : post-scriptum ajouté seulement aux vagues préparées du 23 au 30 novembre (heure de Paris)
  const j = auj(), bw = j >= "2026-11-23" && j <= "2026-11-30";
  const PS_BW = `<div style="margin:30px 0 0;padding:20px 22px;border-radius:18px;background:rgba(184,164,255,.14)"><p style="margin:0;font-family:'Inter Tight',Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#FFFFFF"><b style="color:#C9B8FF">P.-S. Black Week :</b> pour tout abonnement Essentiel, Régulier ou Soutenu activé jusqu’au 30 novembre, le premier mois compte 50&nbsp;% d’unités en plus (23, 53 ou 113 au lieu de 15, 35 ou 75), au même prix.</p></div>`;
  const html = (await r.text()).replace("<!--BLACKWEEK-->", bw ? PS_BW : "");
  const sujet = "Votre com déborde ? Fill prend le relais";
  const campagne = `Fill · Lancement, vague ${n}`;
  const maintenant = new Date().toISOString();
  let n2 = 0;
  for (const c of prets) {
    const email = String(c.email).toLowerCase();
    const { data: seq, error } = await sb.from("sequence").insert({ fiche: `lancement:${email}`, marque: "fill", type: "prospection", campagne,
      nom: [c.prenom, c.nom].filter(Boolean).join(" "), email }).select("id").single();
    if (error || !seq) continue;
    const { error: e2 } = await sb.from("sequence_message").insert({ sequence_id: seq.id, rang: 1, objet: sujet, corps: texteDe(html), html, prevu: maintenant });
    if (e2) { await sb.from("sequence").delete().eq("id", seq.id); continue; }
    await sb.from("fill_contact").update({ lancement_le: maintenant, vague: n }).eq("email", email);
    n2++;
  }
  return { vague: n, contacts: n2, campagne: null };
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
    // « stop » : rien n'est inscrit ici, la page du site demande une confirmation par bouton
    return new Response(null, { status: 302, headers: { location: `${PAGE_STOP}?e=${encodeURIComponent(e)}&s=${encodeURIComponent(s)}`, "cache-control": "no-store" } });
  }
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const ok = Boolean(CLE) && jeton.length >= 32 && (jeton === CLE || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  if (!ok) return new Response("Réservé au serveur", { status: 401 });
  const corps = await req.json().catch(() => ({}));
  const action = corps.action ?? "quotidien";
  const json = (x: unknown, status = 200) => new Response(JSON.stringify(x), { status, headers: { "content-type": "application/json" } });

  if (action === "quotidien" || action === "apercu") {
    const bilan = await quotidien(action === "apercu");
    if (action === "quotidien") await recap(bilan);
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
      if (await estClient(e)) return json({ ajoute: false, raison: "déjà client de Fill" });
      const nom = String(corps.nom ?? "").trim(), [pre, ...rest] = nom.split(/\s+/);
      const v = await verifierAdresse(e);
      if (!v.ok) return json({ ajoute: false, raison: v.raison });
      const rec = corps.segment === "recrutement";
      const deja = (await sb.from("fill_contact").select("email").eq("email", e).maybeSingle()).data;
      const ligne = { email: e, segment: rec ? "recrutement" : "prospects", ...(pre ? { prenom: pre } : {}), ...(rest.length ? { nom: rest.join(" ") } : {}) };
      const { error } = deja ? await sb.from("fill_contact").update(ligne).eq("email", e) : await sb.from("fill_contact").insert(ligne);
      if (error) throw new Error(error.message);
      return json({ ajoute: true, segment: rec ? "recrutement" : "prospects" });
    } catch (err) { return json({ ajoute: false, raison: String(err) }, 502); }
  }
  if (action === "verifier") {
    const L = (Array.isArray(corps.emails) ? corps.emails : []).slice(0, 60);
    return json(await Promise.all(L.map(verifierAdresse)));
  }
  if (action === "vague_etat" || action === "vague_preparer") {
    try {
      const ex = Array.isArray(corps.exclure) ? corps.exclure : [];
      if (action === "vague_etat") { const r = await eligiblesVague(ex); return json({ prets: r.prets.length, bientot: r.bientot, delai: DELAI_VAGUE_JOURS }); }
      return json(await preparerVague(ex));
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
  return json({ erreur: "action inconnue" }, 400);
});
