// Offre publiée (offre.json) mise à la forme qu'utilisent les règles.
import brut from '../offre.json' with { type: 'json' };

const o = brut;
export const OFFRE = {
  version: o.version,
  uniteSup: o.unite_sup,
  // prix HT d'une unité hors forfait
  engagementMois: o.engagement_mois,
  engagementLong: o.engagement_long,
  // mise en place offerte à partir de cet engagement
  urgenceUnites: o.urgence_unites,
  // unités ajoutées par demande urgente
  delaiCreationJ: parseInt(o.delais.creation, 10),
  delais: o.delais,
  report: o.report
};
export const FORMULES = [
  ...o.formules.map((f) => ({
    id: f.id,
    nom: f.nom,
    prix: f.prix,
    unites: f.unites,
    delai_j: f.delai_j,
    urgences_incluses: f.urgences_incluses,
    mise_en_place: f.mise_en_place,
    suivi: f.suivi,
    court: f.court
  })),
  {
    id: "relais",
    nom: o.relais.nom,
    prix: o.relais.prix_mois,
    unites: o.relais.unites_mois,
    delai_j: 1,
    urgences_incluses: Infinity,
    mise_en_place: o.relais.mise_en_place,
    suivi: "Point chaque semaine",
    court: "pendant une absence"
  }
];
export const CATALOGUE = o.catalogue;
export const CATEGORIES = o.categories;
export const formule = (id) => {
  const f = FORMULES.find((x) => x.id === id);
  if (!f) throw new Error(`Formule inconnue : ${id}`);
  return f;
};
export const prestation = (id) => CATALOGUE.find((p) => p.id === id);
export const TYPES_CREATION = ["affiche", "flyer", "news", "page", "video"];
export const TYPES_PLANIFIES = ["bulletin", "photo"];
export const ABONNEMENTS = FORMULES.filter((f) => f.id !== "relais");
export const ORDRE_FORMULES = ["essentiel", "regulier", "soutenu", "relais"];
