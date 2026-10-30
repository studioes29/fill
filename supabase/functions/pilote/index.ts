// Pilote automatique de Fill, appelé par la tâche planifiée « fill-pilote » (pg_cron + pg_net) avec la clé secrète
// ou un jeton vérifié par verifier_jeton_pilote. Il confirme les demandes déposées qui tiennent (puis lance l'atelier),
// relance les clients en attente et émet les factures le premier jour ouvré du mois, selon les réglages de « parametre ».
import { CLE_SECRETE } from '../_partage/cles.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';
import { ajouterJours, estOuvre, periodeDe } from '../_partage/regles/calendrier.ts';
import { estimer } from '../_partage/regles/estimation.ts';
import { aRelancer, decider } from '../_partage/regles/pilote.ts';
import { etatPeriode } from '../_partage/regles/registre.ts';

Deno.serve(async (req) => {
  const cle = CLE_SECRETE;
  const url = Deno.env.get("SUPABASE_URL");
  const sb = createClient(url, cle);
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const autorise = Boolean(cle) && jeton.length >= 32 && (jeton === cle || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  if (!autorise) return new Response("R\xE9serv\xE9 au serveur", { status: 401 });
  const notifier = (corps) => fetch(`${url}/functions/v1/notifier`, { method: "POST", headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" }, body: JSON.stringify(corps) }).catch(() => null);
  const auj = (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const per = periodeDe(auj);
  const [{ data: param }, { data: orgs }, { data: ds }, { data: lignes }, { data: hist }, { data: reg }, { data: profils }, { data: fer }] = await Promise.all([
    sb.from("parametre").select("*").single(),
    sb.from("organisation").select("*"),
    sb.from("demande").select("*").not("statut", "in", "(livree,annulee)"),
    sb.from("demande_ligne").select("demande_id, prestation, quantite"),
    sb.from("historique").select("demande_id, statut, type, date, par"),
    sb.from("registre").select("*").eq("periode", per),
    sb.from("profil").select("id, role, plafond_mensuel"),
    sb.from("fermeture").select("debut, fin")
  ]);
  const fermetures = fer ?? [];
  const organisations = (orgs ?? []).map((o) => ({ id: o.id, nom: o.nom, type: o.type, formule: o.formule, debut: o.debut, engagementMois: o.engagement_mois, statut: o.statut === "active" ? "active" : "a_activer", sansIA: o.sans_ia }));
  const demandes = (ds ?? []).map((d) => ({
    id: d.id,
    numero: d.numero,
    organisationId: d.organisation_id,
    auteurId: d.auteur_id,
    titre: d.titre,
    brief: d.brief,
    pieces: [],
    lignes: (lignes ?? []).filter((l) => l.demande_id === d.id).map((l) => ({ prestation: l.prestation, quantite: l.quantite })),
    urgente: d.urgente,
    parution: d.parution,
    statut: d.statut,
    creee: d.creee,
    unites: d.unites,
    unitesHorsForfait: d.unites_hors_forfait,
    livraison: d.livraison,
    corrections: d.corrections,
    messages: [],
    versions: [],
    historique: (hist ?? []).filter((h) => h.demande_id === d.id).sort((a, b) => a.date.localeCompare(b.date)).map((h) => ({ date: h.date, statut: h.statut, type: h.type, par: h.par ?? "pilote" }))
  }));
  const registre = (reg ?? []).map((l) => ({ ...l, organisationId: l.organisation_id, demandeId: l.demande_id }));
  const bilan = { confirmees: 0, a_arbitrer: 0, relances: 0, factures: 0 };
  if (param.pilote_confirmation) {
    for (const d of demandes.filter((x) => x.statut === "deposee")) {
      const o = organisations.find((x) => x.id === d.organisationId);
      const auteur = (profils ?? []).find((p) => p.id === d.auteurId);
      const urgencesUtilisees = demandes.filter((x) => x.id !== d.id && x.organisationId === o.id && x.urgente && periodeDe(x.creee.slice(0, 10)) === per).length;
      const est = estimer({ lignes: d.lignes, urgente: d.urgente, parution: d.parution }, { formule: o.formule, depot: auj, urgencesUtilisees, disponibles: etatPeriode(registre, o.id, per).disponible, fermetures });
      const engageAuteur = registre.filter((l) => l.type === "debit" && l.etat !== "restitue" && demandes.find((x) => x.id === l.demandeId)?.auteurId === d.auteurId).reduce((s, l) => s + l.unites, 0);
      const dec = decider(d, { auj, organisation: o, estimation: est, demandes, capacite: param.capacite_semaine, fermetures, auteur: { role: auteur?.role ?? "referent", plafondMensuel: auteur?.plafond_mensuel }, engageAuteur });
      if (!dec.auto) {
        bilan.a_arbitrer++;
        continue;
      }
      const { data: statut, error } = await sb.rpc("confirmer_demande", { p_demande: d.id, p_unites: null, p_motif_ajustement: null, p_livraison: dec.livraison });
      if (error) continue;
      bilan.confirmees++;
      d.statut = statut;
      d.livraison = dec.livraison;
      d.unites = est.unites;
      await notifier({ evenement: "statut", demande: d.id });
      if (statut === "confirmee" && param.pilote_atelier && !o.sansIA) {
        const r = await fetch(`${url}/functions/v1/atelier`, { method: "POST", headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" }, body: JSON.stringify({ demande: d.id }) }).catch(() => null);
        if (r?.ok) await notifier({ evenement: "jet", demande: d.id });
      }
    }
  }
  if (param.pilote_relances) {
    for (const d of demandes) if (aRelancer(d, auj, fermetures)) {
      const { error } = await sb.rpc("relancer", { p_demande: d.id });
      if (!error) {
        bilan.relances++;
        await notifier({ evenement: "statut", demande: d.id });
      }
    }
  }
  if (param.pilote_facturation) {
    let premier = `${per}-01`;
    while (!estOuvre(premier, fermetures)) premier = ajouterJours(premier, 1);
    if (auj === premier) {
      const { data } = await sb.rpc("emettre_factures", { per: periodeDe(ajouterJours(`${per}-01`, -1)) });
      bilan.factures = data ?? 0;
    }
  }
  return new Response(JSON.stringify(bilan), { headers: { "Content-Type": "application/json" } });
});
