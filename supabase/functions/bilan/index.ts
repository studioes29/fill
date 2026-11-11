// Bilan de période et mail mensuel unique (« Votre mois avec Fill ») : trois chiffres, le lien du bilan, trois suggestions.
//
// Tout passe par POST. Les jetons arrivent dans le corps de la requête, jamais dans l'adresse.
//
//   {action:"quotidien"}                   tâche planifiée (clé secrète ou jeton du pilote) : fige le bilan des périodes
//                                          closes, envoie à Fill le lien de relecture ou, si le réglage pilote_bilan
//                                          l'autorise, le mail au référent. Un bilan ne part jamais deux fois.
//                                          {simuler:true} ne fige rien et n'envoie rien : il dit ce qui serait fait.
//   {action:"lire", j}                     page espace/bilan/ : le bilan partagé (lien du mail, sans compte)
//   {action:"lire", r}                     la même page, pour Fill, avant envoi
//   {action:"approuver", r, retirer:[…]}   accord de Fill : le mail part au référent (tout de suite dans la plage d'envoi)
//
// Base : table bilan et fonctions bilan_* (migration 2026-11-bilan-mensuel.sql).
// Secrets : clés Supabase, BREVO_API_KEY, ALERTE_EMAIL, EXPEDITEUR_EMAIL, SITE_URL.
import { CLE_SECRETE, cors, SITE } from '../_partage/cles.ts';
import { gabarit } from '../_partage/courriel.ts';
import { lienBilan, lienRelecture, mailBloque, mailMensuel, mailRelecture, plageOuverte, suggerer } from '../_partage/regles/bilan.ts';
import { JETON, empreinte, nouveauJeton } from '../_partage/regles/relecture.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const json = (corps, status = 200) =>
  new Response(JSON.stringify(corps), { status, headers: { ...cors, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const refus = (message, status = 409) => json({ erreur: message }, status);
const motif = (e) => (e?.code === "P0001" && e.message ? e.message : "Cette action n’a pas pu aboutir. Réessayez dans un instant.");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return refus("Méthode refusée", 405);
  let s;
  try { s = await req.json(); } catch { return refus("Requête illisible", 400); }
  const url = Deno.env.get("SUPABASE_URL");
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  const cleBrevo = Deno.env.get("BREVO_API_KEY");
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";

  // « parti » : accepté par le service d'envoi ; « refuse » : rien n'est parti ; « inconnu » : pas de réponse claire
  const envoyer = async (essai, a, m) => {
    if (!cleBrevo) return "refuse";
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
          to: a,
          replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
          subject: `${essai ? "[Test] " : ""}${m.sujet}`,
          htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres, aperçu: m.aperçu }),
        }),
      });
      return r.ok ? "parti" : r.status >= 400 && r.status < 500 ? "refuse" : "inconnu";
    } catch {
      return "inconnu";
    }
  };

  // envoi du mail mensuel d'un bilan prêt : réservé dans la base avant de partir, confirmé après
  const envoyerBilan = async (id) => {
    const jeton = nouveauJeton();
    const { data: r, error } = await admin.rpc("bilan_reserver_envoi", { p_bilan: id, p_empreinte: await empreinte(jeton) });
    if (error) return { id, etat: "erreur", detail: motif(error) };
    if (!r) return { id, etat: "sans_objet" };
    if (r.erreur) return { id, etat: r.erreur, organisation: r.organisation?.nom };
    const issue = await envoyer(r.organisation.essai, [{ email: r.referent.email, name: r.referent.nom }], mailMensuel({ donnees: r.donnees, lien: lienBilan(SITE, jeton), site: SITE }));
    if (issue === "parti") {
      await admin.rpc("bilan_confirmer_envoi", { p_bilan: id, p_a: r.referent.email });
      return { id, etat: "envoye", organisation: r.organisation.nom, a: r.referent.nom };
    }
    if (issue === "refuse") {
      await admin.rpc("bilan_liberer_envoi", { p_bilan: id });
      return { id, etat: "refuse", organisation: r.organisation.nom };
    }
    await envoyer(r.organisation.essai, [{ email: pourFill }], mailBloque({ organisation: r.organisation.nom, periode: r.donnees.periode }));
    return { id, etat: "bloque", organisation: r.organisation.nom };
  };

  if (s.action === "quotidien") {
    const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
    const autorise = Boolean(CLE_SECRETE) && jeton.length >= 32 && (jeton === CLE_SECRETE || (await admin.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
    if (!autorise) return new Response("Réservé au serveur", { status: 401 });
    const simuler = s.simuler === true;
    const jour = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
    const suivi = { jour, simulation: simuler, prepares: [], relectures: [], envois: [], en_attente: 0, bloques: [], erreurs: [] };
    if (!simuler && !plageOuverte()) return json({ ...suivi, hors_plage: true });

    // 1. figer le bilan des périodes closes
    const { data: candidats, error: errC } = await admin.rpc("bilan_candidats", { p_jour: jour });
    if (errC) return refus(motif(errC), 500);
    const { data: fer } = await admin.from("fermeture").select("debut, fin");
    for (const c of candidats ?? []) {
      const [{ data: d, error: errD }, { data: ds }, { data: lignes }] = await Promise.all([
        admin.rpc("bilan_calculer", { p_org: c.organisation, p_periode: c.periode }),
        admin.from("demande").select("id, titre, statut, parution, creee").eq("organisation_id", c.organisation),
        admin.from("demande_ligne").select("demande_id, prestation, quantite").eq("organisation_id", c.organisation),
      ]);
      if (errD || !d) { suivi.erreurs.push({ organisation: c.organisation, detail: motif(errD) }); continue; }
      const suggestions = suggerer({
        organisation: d.organisation, jour, suivante: d.suivante, fermetures: fer ?? [],
        demandes: (ds ?? []).map((x) => ({ ...x, lignes: (lignes ?? []).filter((l) => l.demande_id === x.id) })),
      });
      if (simuler) { suivi.prepares.push({ organisation: d.organisation.nom, periode: c.periode, donnees: { ...d, suggestions } }); continue; }
      const { data: p, error: errP } = await admin.rpc("bilan_preparer", { p_org: c.organisation, p_periode: c.periode, p_suggestions: suggestions });
      if (errP) suivi.erreurs.push({ organisation: d.organisation.nom, detail: motif(errP) });
      else if (p.cree) suivi.prepares.push({ id: p.id, organisation: d.organisation.nom, periode: c.periode, suggestions: suggestions.length });
    }

    const { data: file, error: errF } = await admin.rpc("bilan_a_envoyer");
    if (errF) return refus(motif(errF), 500);
    suivi.bloques = file.bloques;
    if (simuler) return json({ ...suivi, relectures: file.a_relire, envois: file.prets, en_attente: file.en_attente });

    // 2. les bilans qui attendent un accord : le lien de relecture part chez Fill, une fois
    for (const id of file.a_relire) {
      const jr = nouveauJeton();
      const { data: r } = await admin.rpc("bilan_ouvrir_relecture", { p_bilan: id, p_empreinte: await empreinte(jr) });
      if (!r) continue;
      const issue = await envoyer(r.organisation.essai, [{ email: pourFill }], mailRelecture({ donnees: r.donnees, lien: lienRelecture(SITE, jr), referent: r.referent }));
      if (issue === "refuse") await admin.rpc("bilan_fermer_relecture", { p_bilan: id });
      suivi.relectures.push({ id, organisation: r.organisation.nom, etat: issue });
    }

    // 3. les bilans prêts : un seul mail au référent
    for (const id of file.prets) {
      const e = await envoyerBilan(id);
      if (e.etat === "bloque") suivi.bloques.push(id);
      suivi.envois.push(e);
    }
    suivi.en_attente = file.en_attente;
    return json(suivi);
  }

  // depuis la page : tout repose sur le jeton (partage : j ; relecture par Fill : r)
  const jeton = typeof s.r === "string" ? s.r : s.j;
  if (typeof jeton !== "string" || !JETON.test(jeton)) return json({ etat: "inconnu" }, 404);
  const e = await empreinte(jeton);
  const { data: vue, error: errVue } = await admin.rpc("bilan_lire", { p_empreinte: e });
  if (errVue) return refus(motif(errVue), 500);
  if (!vue || vue.etat === "inconnu") return json({ etat: "inconnu" }, 404);
  // un lien de partage ne donne jamais accès à la relecture, et inversement
  if (vue.etat === "ouvert" && (vue.mode === "relecture") !== (typeof s.r === "string")) return json({ etat: "inconnu" }, 404);

  if (s.action === "lire") {
    if (vue.etat !== "ouvert") return json({ etat: vue.etat });
    return json({
      etat: "ouvert", mode: vue.mode, donnees: vue.donnees, calcule_le: vue.calcule_le, espace: SITE,
      ...(vue.mode === "relecture" ? { referent: vue.referent?.nom ?? null, approuve_le: vue.approuve_le, envoye_le: vue.envoye_le, en_cours_d_envoi: vue.en_cours_d_envoi } : {}),
    });
  }

  if (s.action === "approuver") {
    if (vue.etat !== "ouvert" || vue.mode !== "relecture") return refus("Ce lien ne permet pas cette action.", 403);
    const retirer = Array.isArray(s.retirer) ? s.retirer.filter((x) => typeof x === "string").slice(0, 3) : [];
    const { error } = await admin.rpc("bilan_approuver", { p_empreinte_relecture: e, p_retirer: retirer });
    if (error) return refus(motif(error));
    if (!plageOuverte()) return json({ ok: true, envoye: false, motif: "hors_plage" });
    const r = await envoyerBilan(vue.id);
    if (r.etat === "envoye") return json({ ok: true, envoye: true, a: r.a });
    if (r.etat === "sans_referent") return refus("Cette organisation n’a pas de référent actif : le mail ne peut pas partir.");
    if (r.etat === "bloque") return refus("Le service d’envoi n’a pas répondu clairement : l’envoi n’est pas retenté. Un message vous indique quoi vérifier.", 502);
    return json({ ok: true, envoye: false, motif: "report" });
  }

  return refus("Action inconnue", 400);
});
