// Module regles/acces.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var ADRESSE_ACCES = `contact@studioes.fr`;
var CANAUX = [
    {
      id: `facebook`,
      nom: `Page Facebook`,
      comment: [
        `Meta Business Suite, ou la Page : Paramètres, puis « Accès à la Page ».`,
        `Ajoutez ${ADRESSE_ACCES} avec un accès partiel : contenu, messages, statistiques.`,
      ],
    },
    {
      id: `instagram`,
      nom: `Instagram`,
      comment: [
        `Si le compte professionnel est relié à la Page Facebook, l’accès à la Page suffit.`,
        `Sinon : Meta Business Suite, Paramètres, « Personnes », puis ajoutez le compte Instagram à l’accès de Fill.`,
      ],
    },
    {
      id: `linkedin`,
      nom: `Page LinkedIn`,
      comment: [
        `Sur la page : « Outils d’administration », puis « Gérer les administrateurs ».`,
        `Ajoutez Ewen Soupault avec le rôle « Créateur de contenu ».`,
      ],
    },
    {
      id: `site`,
      nom: `Site internet`,
      comment: [
        `Dans l’administration du site (WordPress, Wix, autre), créez un compte au nom de Fill avec ${ADRESSE_ACCES}.`,
        `Rôle « Éditeur » : il publie actualités et agenda, sans toucher aux réglages.`,
      ],
    },
    {
      id: `newsletter`,
      nom: `Newsletter`,
      comment: [
        `Dans l’outil d’envoi (Brevo, Mailchimp, autre), invitez ${ADRESSE_ACCES} comme utilisateur.`,
        `Droits de création et d’envoi de campagnes ; la liste des abonnés reste la vôtre.`,
      ],
    },
    {
      id: `google`,
      nom: `Fiche Google`,
      comment: [
        `Google Business Profile : « Paramètres de la fiche », puis « Utilisateurs et accès ».`,
        `Ajoutez ${ADRESSE_ACCES} comme « Gestionnaire ».`,
      ],
    },
  ];
var STATUTS_ACCES = {
    a_donner: {
      nom: `À donner`,
      ton: `p-cor`,
    },
    donne: {
      nom: `Donné, Fill vérifie`,
      ton: `p-lav`,
    },
    verifie: {
      nom: `Fonctionne`,
      ton: `p-bon`,
    },
    sans_objet: {
      nom: `Pas ce canal`,
      ton: `p-blanc`,
    },
  };
var CANAUX_PAR_PRESTATION = {
    post: [`facebook`, `instagram`, `linkedin`],
    video: [`facebook`, `instagram`, `linkedin`],
    actu: [`site`],
    agenda: [`site`],
    page: [`site`],
    news: [`newsletter`],
  };
var accesCanal = (e, t) =>
    e?.find((e) => e.canal === t) ?? {
      canal: t,
      statut: `a_donner`,
    };
var etatAcces = (e) => {
    let t = CANAUX.map((t) => accesCanal(e, t.id)),
      n = t.filter((e) => e.statut !== `sans_objet`);
    return {
      tous: t,
      aDonner: n.filter((e) => e.statut === `a_donner`).length,
      enVerif: n.filter((e) => e.statut === `donne`).length,
      ok: n.filter((e) => e.statut === `verifie`).length,
      utiles: n.length,
      complet: n.every((e) => e.statut === `verifie` || e.statut === `donne`),
    };
  };
var accesManquants = (e, t) =>
    [...new Set(t.flatMap((e) => CANAUX_PAR_PRESTATION[e.prestation] ?? []))].filter(
      (t) => accesCanal(e, t).statut === `a_donner`,
    );
var nomCanal = (e) => CANAUX.find((t) => t.id === e)?.nom ?? e;
