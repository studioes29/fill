// Module regles/remise.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var TYPES_PUBLIES = [`post`, `actu`, `agenda`, `presse`, `news`, `page`, `video`];
var TYPES_SANS_LIVRABLE = [`point`, `moder`];
var estPublie = (e) => TYPES_PUBLIES.includes(e);
var modeRemise = (e) => {
    let t = e.some((e) => TYPES_PUBLIES.includes(e.prestation)),
      n = e.some((e) => !TYPES_PUBLIES.includes(e.prestation) && !TYPES_SANS_LIVRABLE.includes(e.prestation));
    return t && n ? `mixte` : t ? `publication` : `fichiers`;
  };
var LIBELLES_REMISE = {
    publication: {
      etape: `Publiée`,
      action: `Marquer comme publiée`,
      fait: `Publiée sur vos comptes`,
      apres: `Fill la publie sur vos comptes à la date prévue`,
    },
    fichiers: {
      etape: `Livrée`,
      action: `Remettre les fichiers finaux`,
      fait: `Fichiers finaux remis`,
      apres: `Fill vous remet les fichiers finaux, prêts à imprimer ou à diffuser`,
    },
    mixte: {
      etape: `Publiée`,
      action: `Publier et remettre les fichiers`,
      fait: `Publiée, fichiers remis`,
      apres: `Fill publie sur vos comptes à la date prévue et vous remet les fichiers des supports imprimés`,
    },
  };
