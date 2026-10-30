// Décisions du pilote automatique : confirmation d'une demande déposée, relance du client.
import { ajouterOuvres, ouvresEntre } from './calendrier.ts';
import { verifierCapacite } from './charge.ts';
import { accordNecessaire } from './estimation.ts';

export const decider = (d, c) => {
  if (d.statut !== "deposee") return { auto: false, raison: "Demande d\xE9j\xE0 trait\xE9e" };
  if (c.organisation.statut !== "active") return { auto: false, raison: "Premi\xE8res unit\xE9s pas encore cr\xE9dit\xE9es" };
  if (!c.estimation.ok) return { auto: false, raison: c.estimation.erreur ?? "Estimation impossible" };
  if (c.estimation.nature === "planifie" || c.estimation.delaiJ === null) return { auto: false, raison: "Reportage ou bulletin : la date se fixe avec le client" };
  if (d.brief.trim().length < 20) return { auto: false, raison: "Brief trop court pour lancer la production" };
  const livraison = ajouterOuvres(c.auj, c.estimation.delaiJ, c.fermetures ?? []);
  if (d.parution && livraison > d.parution) return { auto: false, raison: "Parution trop proche pour le d\xE9lai de la formule" };
  const cap = verifierCapacite(c.demandes, d.id, c.estimation.unites, livraison, c.capacite, c.fermetures ?? []);
  if (!cap.tient) return { auto: false, raison: `Semaine pleine (${cap.apres} unit\xE9s sur ${cap.capacite})`, dateProposee: cap.premiereDate };
  const acc = accordNecessaire({ unites: c.estimation.unites, horsForfait: c.estimation.horsForfait }, c.auteur, c.engageAuteur);
  return { auto: true, livraison, accord: acc.motif };
};
export const DELAI_RELANCE = 2;
export const aRelancer = (d, auj, fermetures = []) => {
  if (d.statut !== "a_valider" && d.statut !== "attente_client") return false;
  const depuis = d.historique.findLast((h) => h.statut === d.statut && h.type !== "modification" && h.type !== "relance");
  if (!depuis) return false;
  if (d.historique.some((h) => h.type === "relance" && h.date >= depuis.date)) return false;
  return ouvresEntre(depuis.date.slice(0, 10), auj, fermetures) >= DELAI_RELANCE;
};
