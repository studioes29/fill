// Charge de production par semaine et contrôle de capacité.
import { ajouterJours, estOuvre } from './calendrier.ts';

export const ACTIFS = ["confirmee", "production", "correction", "attente_client"];
export const lundi = (s) => {
  const x = /* @__PURE__ */ new Date(s + "T00:00:00Z");
  return ajouterJours(s, -((x.getUTCDay() + 6) % 7));
};
export const chargeSemaine = (ds, debutSemaine, sauf) => {
  const fin = ajouterJours(debutSemaine, 6);
  return ds.filter((d) => d.id !== sauf && ACTIFS.includes(d.statut) && d.livraison && d.livraison >= debutSemaine && d.livraison <= fin).reduce((s, d) => s + (d.unites ?? 0), 0);
};
export const semaines = (ds, depuis, n, capacite, fermetures = []) => Array.from({ length: n }, (_, i) => {
  const debut = ajouterJours(lundi(depuis), 7 * i);
  let ouvres = 0;
  for (let k = 0; k < 5; k++) if (estOuvre(ajouterJours(debut, k), fermetures)) ouvres++;
  return { debut, charge: chargeSemaine(ds, debut), capacite: Math.round(capacite * ouvres / 5), ouvres };
});
export const verifierCapacite = (ds, demandeId, unites, livraison, capacite, fermetures = []) => {
  const [s] = semaines(ds.filter((d) => d.id !== demandeId), livraison, 1, capacite, fermetures);
  const apres = s.charge + unites;
  if (apres <= s.capacite) return { charge: s.charge, apres, capacite: s.capacite, tient: true, premiereDate: null };
  let premiereDate = null;
  for (let i = 1; i <= 8 && !premiereDate; i++) {
    const deb = ajouterJours(lundi(livraison), 7 * i);
    const [t] = semaines(ds.filter((d) => d.id !== demandeId), deb, 1, capacite, fermetures);
    if (t.charge + unites <= t.capacite) {
      let j = deb;
      while (!estOuvre(j, fermetures)) j = ajouterJours(j, 1);
      premiereDate = j;
    }
  }
  return { charge: s.charge, apres, capacite: s.capacite, tient: false, premiereDate };
};
