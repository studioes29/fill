// Module regles/statuts.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var LIBELLES_STATUT = {
    deposee: `Déposée`,
    accord_requis: `Accord attendu`,
    confirmee: `Confirmée`,
    production: `En production`,
    a_valider: `À valider`,
    correction: `En correction`,
    validee: `Validée`,
    livree: `Livrée`,
    attente_client: `En attente de votre part`,
    annulee: `Annulée`,
  };
var ETAPES = [
    {
      cle: `depot`,
      libelle: `Déposée`,
      statuts: [`deposee`, `accord_requis`],
    },
    {
      cle: `confirmation`,
      libelle: `Confirmée`,
      statuts: [`confirmee`, `attente_client`],
    },
    {
      cle: `production`,
      libelle: `En production`,
      statuts: [`production`, `correction`],
    },
    {
      cle: `validation`,
      libelle: `À valider`,
      statuts: [`a_valider`],
    },
    {
      cle: `livraison`,
      libelle: `Livrée`,
      statuts: [`validee`, `livree`],
    },
  ];
var etapeDe = (e) => ETAPES.findIndex((t) => t.statuts.includes(e));
var ROLES_PRODUCTION = [`admin`, `producteur`];
var TRANSITIONS = {
    confirmer: {
      de: [`deposee`],
      vers: `confirmee`,
      roles: [`admin`],
    },
    demander_accord: {
      de: [`deposee`],
      vers: `accord_requis`,
      roles: [`admin`],
    },
    donner_accord: {
      de: [`accord_requis`],
      vers: `confirmee`,
      roles: [`referent`],
    },
    refuser: {
      de: [`accord_requis`],
      vers: `annulee`,
      roles: [`referent`],
    },
    demarrer: {
      de: [`confirmee`],
      vers: `production`,
      roles: ROLES_PRODUCTION,
    },
    livrer_version: {
      de: [`production`, `correction`, `confirmee`],
      vers: `a_valider`,
      roles: ROLES_PRODUCTION,
    },
    valider: {
      de: [`a_valider`],
      vers: `validee`,
      roles: [`referent`],
    },
    demander_correction: {
      de: [`a_valider`],
      vers: `correction`,
      roles: [`referent`, `contributeur`],
    },
    livrer: {
      de: [`validee`],
      vers: `livree`,
      roles: ROLES_PRODUCTION,
    },
    suspendre: {
      de: [`confirmee`, `production`, `correction`],
      vers: `attente_client`,
      roles: ROLES_PRODUCTION,
    },
    reprendre: {
      de: [`attente_client`],
      vers: `production`,
      roles: [...ROLES_PRODUCTION, `referent`, `contributeur`],
    },
    annuler: {
      de: [`deposee`, `accord_requis`, `confirmee`, `attente_client`],
      vers: `annulee`,
      roles: [`admin`, `referent`, `contributeur`],
    },
  };
var STATUTS_ANNULABLES_REFERENT = [`deposee`, `accord_requis`, `confirmee`];
var actionPermise = (e, t, n, r = !1) =>
    !TRANSITIONS[e].de.includes(t) || !TRANSITIONS[e].roles.includes(n)
      ? !1
      : e === `annuler` && n === `referent`
        ? STATUTS_ANNULABLES_REFERENT.includes(t)
        : e === `annuler` && n === `contributeur`
          ? r && t === `deposee`
          : !0;
var appliquerTransition = (e, t, n, r = !1) => {
    if (!actionPermise(e, t, n, r)) throw Error(`Action impossible depuis « ${LIBELLES_STATUT[t]} ».`);
    return TRANSITIONS[e].vers;
  };
var peutModifier = (e, t, n) => e === `deposee` && (t === `referent` || (t === `contributeur` && n));
var statutConsomme = (e) => e === `a_valider` || e === `livree`;
var estEnCours = (e) => ![`livree`, `annulee`].includes(e);
var attendClient = (e) => e === `a_valider` || e === `accord_requis` || e === `attente_client`;
