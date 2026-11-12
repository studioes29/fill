// Adresse de transfert d'une organisation : nom-de-la-structure@demandes.studioes.fr.
// La partie avant le « @ » est en base (organisation.alias_mail) ; le domaine se règle par DOMAINE_RECEPTION.
// Ce module ne porte que l'adresse et les deux phrases qui la montrent au client (« alerte » et « notifier »).
export const DOMAINE_DEFAUT = "demandes.studioes.fr";

export const adresseTransfert = (alias, domaine) => {
  const a = String(alias ?? "").trim().toLowerCase();
  const d = String(domaine || DOMAINE_DEFAUT).trim().toLowerCase();
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(a) ? `${a}@${d}` : null;
};

// mail de bienvenue : une ligne discrète, sous le bouton
export const phraseBienvenue = (adresse) =>
  `Pour une demande, un mail suffit : écrivez ou transférez l’information à <a href="mailto:${adresse}" style="color:#6B6560">${adresse}</a>, depuis l’adresse de votre compte. Vous relisez ensuite sur un lien.`;

// mail « Demande confirmée » : rappel en une ligne
export const phraseConfirmee = (adresse) =>
  `Pour une prochaine demande, un mail suffit : écrivez ou transférez l’information à <a href="mailto:${adresse}" style="color:#6B6560">${adresse}</a>.`;
