// Module regles/pilote.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var PILOTE_DEFAUT = {
    confirmation: !0,
    atelier: !0,
    relances: !0,
    activation: !1,
    facturation: !1,
  };
var deciderPilote = (e, t) => {
    if (e.statut !== `deposee`)
      return {
        auto: !1,
        raison: `Demande déjà traitée`,
      };
    if (t.organisation.statut !== `active`)
      return {
        auto: !1,
        raison: `Premières unités pas encore créditées`,
      };
    if (!t.estimation.ok)
      return {
        auto: !1,
        raison: t.estimation.erreur ?? `Estimation impossible`,
      };
    if (t.estimation.nature === `planifie` || t.estimation.delaiJ === null)
      return {
        auto: !1,
        raison: `Reportage ou bulletin : la date se fixe avec le client`,
      };
    if (e.brief.trim().length < 20)
      return {
        auto: !1,
        raison: `Brief trop court pour lancer la production`,
      };
    let n = ajouterOuvres(t.auj, t.estimation.delaiJ, t.fermetures ?? []);
    if (e.parution && n > e.parution)
      return {
        auto: !1,
        raison: `Parution trop proche pour le délai de la formule`,
      };
    let r = verifierCapacite(t.demandes, e.id, t.estimation.unites, n, t.capacite, t.fermetures ?? []);
    return r.tient
      ? {
          auto: !0,
          livraison: n,
          accord: accordNecessaire(
            {
              unites: t.estimation.unites,
              horsForfait: t.estimation.horsForfait,
            },
            t.auteur,
            t.engageAuteur,
          ).motif,
        }
      : {
          auto: !1,
          raison: `Semaine pleine (${r.apres} unités sur ${r.capacite})`,
          dateProposee: r.premiereDate,
        };
  };
var aRelancer = (e, t, n = []) => {
    if (e.statut !== `a_valider` && e.statut !== `attente_client`) return !1;
    let r = e.historique.findLast((t) => t.statut === e.statut && t.type !== `modification` && t.type !== `relance`);
    return !r || e.historique.some((e) => e.type === `relance` && e.date >= r.date)
      ? !1
      : ouvresEntre(r.date.slice(0, 10), t, n) >= 2;
  };
