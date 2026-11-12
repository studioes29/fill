// Bilan de période et mail mensuel unique (« Votre mois avec Fill ») : trois chiffres, le lien du bilan, trois suggestions.
//
// Tout passe par POST. Les jetons arrivent dans le corps de la requête, jamais dans l'adresse.
//
//   {action:"quotidien"}         tâche planifiée (clé secrète ou jeton du pilote) : fige le bilan des périodes closes, puis
//                                envoie les bilans validés par Fill dans Hors-champ (ou tous, si le réglage pilote_bilan
//                                l'autorise). Un bilan ne part jamais deux fois.
//                                {simuler:true} ne fige rien et n'envoie rien : il dit ce qui serait fait.
//   {action:"envoyer", bilan}    même accès : envoi d'un bilan que Fill vient de valider dans Hors-champ (bilan_valider
//                                l'appelle aussitôt) ; hors de la plage d'envoi, il part au passage suivant.
//   {action:"lire", j}           page espace/bilan/ : le bilan partagé (lien du mail, sans compte)
//   {action:"lire", r}           la même page, en aperçu pour Fill (lien ouvert depuis Hors-champ), sans aucune action
//
// Base : table bilan et fonctions bilan_* (migration 2026-11-bilan-mensuel.sql).
// Secrets : clés Supabase, BREVO_API_KEY, ALERTE_EMAIL, EXPEDITEUR_EMAIL, SITE_URL.
import { CLE_SECRETE, cors, SITE } from '../_partage/cles.ts';
import { gabarit } from '../_partage/courriel.ts';
import { lienBilan, mailAnomalies, mailBloque, mailMensuel, plageOuverte, suggerer } from '../_partage/regles/bilan.ts';
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

  const aujourdhui = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  // envoi du mail mensuel d'un bilan prêt : réservé dans la base avant de partir, confirmé après
  const envoyerBilan = async (id) => {
    const jeton = nouveauJeton();
    const { data: r, error } = await admin.rpc("bilan_reserver_envoi", { p_bilan: id, p_empreinte: await empreinte(jeton), p_jour: aujourdhui() });
    if (error) return { id, etat: "erreur", detail: motif(error) };
    if (!r) return { id, etat: "sans_objet" };
    if (r.erreur) return { id, etat: r.erreur, organisation: r.organisation?.nom };
    const issue = await envoyer(r.organisation.essai, [{ email: r.referent.email, name: r.referent.nom }], mailMensuel({ donnees: r.donnees, lien: lienBilan(SITE, jeton), site: SITE }));
    if (issue === "parti") {
      // le mail est parti : l'enregistrer, en deux essais ; sinon Fill est prévenu, le lien du client en dépend
      for (let essai = 0; essai < 2; essai++) {
        const { data: ok, error: errC } = await admin.rpc("bilan_confirmer_envoi", { p_bilan: id, p_a: r.referent.email });
        if (!errC && ok) return { id, etat: "envoye", organisation: r.organisation.nom, a: r.referent.nom };
      }
      await envoyer(r.organisation.essai, [{ email: pourFill }], mailBloque({ organisation: r.organisation.nom, periode: r.donnees.periode, id, a: r.referent.email, confirme: true }));
      return { id, etat: "a_confirmer", organisation: r.organisation.nom, a: r.referent.nom };
    }
    if (issue === "refuse") {
      await admin.rpc("bilan_liberer_envoi", { p_bilan: id });
      return { id, etat: "refuse", organisation: r.organisation.nom };
    }
    await envoyer(r.organisation.essai, [{ email: pourFill }], mailBloque({ organisation: r.organisation.nom, periode: r.donnees.periode, id, a: r.referent.email }));
    return { id, etat: "bloque", organisation: r.organisation.nom };
  };

  // la tâche planifiée et Hors-champ (par la base) : clé secrète ou jeton du pilote
  const serveur = async () => {
    const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
    return Boolean(CLE_SECRETE) && jeton.length >= 32 && (jeton === CLE_SECRETE || (await admin.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  };

  if (s.action === "envoyer") {
    if (!(await serveur())) return new Response("Réservé au serveur", { status: 401 });
    if (typeof s.bilan !== "string" || !/^[0-9a-f-]{36}$/.test(s.bilan)) return refus("Bilan inconnu", 400);
    if (!plageOuverte()) return json({ envoye: false, motif: "hors_plage" });
    const r = await envoyerBilan(s.bilan);
    if (r.etat === "envoye") return json({ envoye: true, a: r.a });
    // un échec se signale à Fill comme au passage quotidien ; le bilan reste validé et repart au passage suivant
    const LIB = { refuse: "le service d’envoi a refusé le mail (adresse du référent à vérifier), nouvel essai au prochain passage", sans_referent: "aucun référent actif : le mail ne peut pas partir", erreur: "l’envoi n’a pas pu être préparé" };
    if (LIB[r.etat]) await envoyer(false, [{ email: pourFill }], mailAnomalies([`${r.organisation ?? r.id} : ${LIB[r.etat]}`]));
    return json({ envoye: false, motif: r.etat }, r.etat === "sans_objet" ? 409 : 200);
  }

  if (s.action === "quotidien") {
    if (!(await serveur())) return new Response("Réservé au serveur", { status: 401 });
    const simuler = s.simuler === true;
    const jour = aujourdhui();
    const suivi = { jour, simulation: simuler, prepares: [], envois: [], en_attente: 0, bloques: [], erreurs: [] };
    if (!simuler && !plageOuverte()) return json({ ...suivi, hors_plage: true });

    // 1. figer le bilan des périodes closes
    const { data: candidats, error: errC } = await admin.rpc("bilan_candidats", { p_jour: jour });
    if (errC) return refus(motif(errC), 500);
    for (const c of candidats ?? []) {
      const [{ data: d, error: errD }, { data: ctx, error: errX }] = await Promise.all([
        admin.rpc("bilan_calculer", { p_org: c.organisation, p_periode: c.periode }),
        admin.rpc("bilan_contexte", { p_org: c.organisation, p_jour: jour }),
      ]);
      // sans les demandes du client, les suggestions seraient fausses : on réessaie au passage suivant
      if (errD || errX || !d || !ctx) { suivi.erreurs.push({ organisation: d?.organisation?.nom ?? c.organisation, detail: motif(errD ?? errX) }); continue; }
      const suggestions = suggerer({ organisation: d.organisation, jour, suivante: d.suivante, fermetures: ctx.fermetures, demandes: ctx.demandes });
      if (simuler) { suivi.prepares.push({ organisation: d.organisation.nom, periode: c.periode, donnees: { ...d, suggestions } }); continue; }
      const { data: p, error: errP } = await admin.rpc("bilan_preparer", { p_org: c.organisation, p_periode: c.periode, p_suggestions: suggestions });
      if (errP) suivi.erreurs.push({ organisation: d.organisation.nom, detail: motif(errP) });
      else if (p.cree) suivi.prepares.push({ id: p.id, organisation: d.organisation.nom, periode: c.periode, suggestions: suggestions.length });
    }

    const { data: file, error: errF } = await admin.rpc("bilan_a_envoyer");
    if (errF) return refus(motif(errF), 500);
    suivi.bloques = file.bloques;
    if (simuler) return json({ ...suivi, envois: file.prets, en_attente: file.en_attente });

    // 2. les bilans prêts (validés dans Hors-champ, ou envoi automatique) : un seul mail au référent.
    //    Les autres attendent dans Hors-champ : aucun mail de relecture.
    for (const id of file.prets) {
      const e = await envoyerBilan(id);
      if (e.etat === "bloque" || e.etat === "a_confirmer") suivi.bloques.push(id);
      suivi.envois.push(e);
    }
    suivi.en_attente = file.en_attente;

    // 3. ce qui n'a pas abouti : un seul message à Fill, personne ne lit la réponse de la tâche planifiée
    const LIBELLES = { refuse: "le service d’envoi a refusé le mail (adresse du référent à vérifier)", sans_referent: "aucun référent actif : le mail ne peut pas partir", erreur: "l’envoi n’a pas pu être préparé" };
    const anomalies = [
      ...suivi.erreurs.map((x) => `${x.organisation} : le bilan n’a pas pu être calculé (${x.detail})`),
      ...suivi.envois.filter((x) => LIBELLES[x.etat]).map((x) => `${x.organisation ?? x.id} : ${LIBELLES[x.etat]}`),
    ];
    if (anomalies.length) await envoyer(false, [{ email: pourFill }], mailAnomalies(anomalies));
    return json(suivi);
  }

  // depuis la page : tout repose sur le jeton (partage : j ; aperçu de Fill : r)
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
      ...(vue.mode === "relecture" ? { referent: vue.referent?.nom ?? null, envoye_le: vue.envoye_le } : {}),
    });
  }

  return refus("Action inconnue", 400);
});
