// Estimation d'une demande : unités, urgence, délai, livraison, hors forfait ; accord nécessaire.
import { ajouterOuvres, ouvresEntre } from './calendrier.ts';
import { formule, OFFRE, ORDRE_FORMULES, prestation, TYPES_CREATION, TYPES_PLANIFIES } from './offre.ts';

const RANG = { courant: 0, creation: 1, planifie: 2 };
export const natureDelai = (id) => TYPES_PLANIFIES.includes(id) ? "planifie" : TYPES_CREATION.includes(id) ? "creation" : "courant";
export const delaiUrgent = (n) => Math.max(1, Math.floor(n / 2));
export const normaliser = (lignes) => {
  const m = /* @__PURE__ */ new Map();
  for (const l of lignes) if (l.quantite > 0) m.set(l.prestation, (m.get(l.prestation) ?? 0) + Math.round(l.quantite));
  return [...m.entries()].map(([prestation, quantite]) => ({ prestation, quantite }));
};
export const estimer = (e, c) => {
  const f = formule(c.formule);
  const fer = c.fermetures ?? [];
  const confirmation = ajouterOuvres(c.depot, 1, fer);
  const vide = {
    ok: false,
    detail: [],
    unitesBase: 0,
    unitesUrgence: 0,
    unites: 0,
    urgenceIncluse: false,
    nature: "courant",
    delaiJ: null,
    confirmationAuPlusTard: confirmation,
    livraisonAuPlusTot: null,
    livraisonUrgente: null,
    parutionTenable: null,
    horsForfait: 0,
    coutHorsForfait: 0
  };
  const lignes = normaliser(e.lignes);
  if (!lignes.length) return { ...vide, erreur: "Choisissez au moins une prestation." };
  const detail = [];
  for (const l of lignes) {
    const p = prestation(l.prestation);
    if (!p) return { ...vide, erreur: "Prestation inconnue." };
    if (p.min && ORDRE_FORMULES.indexOf(c.formule) < ORDRE_FORMULES.indexOf(p.min)) {
      return { ...vide, erreur: `${p.nom} : disponible \xE0 partir de la formule ${formule(p.min).nom}.` };
    }
    const q = Math.min(p.max ?? 99, l.quantite);
    detail.push({ prestation: p.id, nom: p.nom, quantite: q, unites: p.u * q, nature: natureDelai(p.id) });
  }
  const nature = detail.reduce((n, d) => RANG[d.nature] > RANG[n] ? d.nature : n, "courant");
  const unitesBase = detail.reduce((s, d) => s + d.unites, 0);
  const urgenceIncluse = e.urgente && c.urgencesUtilisees < f.urgences_incluses;
  const unitesUrgence = e.urgente && !urgenceIncluse ? OFFRE.urgenceUnites : 0;
  const unites = unitesBase + unitesUrgence;
  let delaiJ = null;
  if (nature === "courant") delaiJ = f.delai_j;
  if (nature === "creation") delaiJ = OFFRE.delaiCreationJ;
  const delaiEffectif = delaiJ === null ? null : e.urgente ? delaiUrgent(delaiJ) : delaiJ;
  const livraison = delaiEffectif === null ? null : ajouterOuvres(confirmation, delaiEffectif, fer);
  const livraisonUrgente = delaiJ === null ? null : ajouterOuvres(confirmation, delaiUrgent(delaiJ), fer);
  let parutionTenable = null;
  if (e.parution && livraison) parutionTenable = livraison <= e.parution;
  if (e.parution && nature === "planifie") {
    const marge = detail.some((d) => d.prestation === "bulletin") ? 15 : 5;
    parutionTenable = ouvresEntre(c.depot, e.parution, fer) >= marge;
  }
  const horsForfait = Math.max(0, unites - Math.max(0, c.disponibles));
  return {
    ok: true,
    detail,
    unitesBase,
    unitesUrgence,
    unites,
    urgenceIncluse,
    nature,
    delaiJ: delaiEffectif,
    confirmationAuPlusTard: confirmation,
    livraisonAuPlusTot: livraison,
    livraisonUrgente,
    parutionTenable,
    horsForfait,
    coutHorsForfait: horsForfait * OFFRE.uniteSup
  };
};
export const accordNecessaire = (est, auteur, engageCeMoisParAuteur) => {
  if (est.horsForfait > 0) return { requis: true, motif: `${est.horsForfait} unit\xE9${est.horsForfait > 1 ? "s" : ""} hors forfait` };
  if (auteur.role === "contributeur") {
    const plafond = auteur.plafondMensuel ?? 0;
    if (engageCeMoisParAuteur + est.unites > plafond) return { requis: true, motif: "Demande d\xE9pos\xE9e par un contributeur au-del\xE0 de son plafond" };
  }
  return { requis: false, motif: null };
};
