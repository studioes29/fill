// Adresse de transfert des demandes de Fill : une seule boîte, fill@studioes.fr (MX Plan d'OVH, relevée par la fonction
// « reception » toutes les 15 minutes). La structure est reconnue par l'adresse de l'expéditeur (membre de l'Espace).
// Jusqu'au 18 nov 2026 : une adresse par structure (alias@demandes.studioes.fr), reçue par Brevo ; organisation.alias_mail
// reste en base mais ne sert plus à l'adresse.
// Ce module ne porte que l'adresse et les deux phrases qui la montrent au client (« alerte » et « notifier »).
export const ADRESSE_DEMANDES = "fill@studioes.fr";
export const DOMAINE_DEFAUT = "studioes.fr";

// garde la signature d'avant (alias, domaine) : l'adresse est la même pour toutes les structures
export const adresseTransfert = (_alias, _domaine) => ADRESSE_DEMANDES;

// mail de bienvenue : une ligne discrète, sous le bouton
export const phraseBienvenue = (adresse) =>
  `Pour une demande, un mail suffit : écrivez ou transférez l’information à <a href="mailto:${adresse}" style="color:#6B6560">${adresse}</a>, depuis l’adresse de votre compte. Vous relisez ensuite sur un lien.`;

// mail « Demande confirmée » : rappel en une ligne
export const phraseConfirmee = (adresse) =>
  `Pour une prochaine demande, un mail suffit : écrivez ou transférez l’information à <a href="mailto:${adresse}" style="color:#6B6560">${adresse}</a>.`;
