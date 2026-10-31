// Module regles/tempsforts.
// Calendrier type des temps forts annuels, affiché sur l'Accueil (bloc « À anticiper »).
//
// Données : calendrier type (objet D) et ensembles de prestations (objet PACKS) de assets/t.js, la page publique
// /calendrier/ du site vitrine. Source unique : construire.mjs les extrait de assets/t.js (entre les repères
// @calendrier-type) et les injecte à la place du commentaire ci-dessous. Après toute modification du calendrier
// type dans assets/t.js : npm run construire (le vérificateur échoue si le bundle publié n'est pas à jour).
var CALENDRIER_TYPE = /* @injecte:calendrier-type */ null;
// ensemble de prestations du catalogue derrière chaque temps fort : { cle: { l: libellé, p: { prestation: quantité } } }
var PACKS_TEMPS_FORTS = CALENDRIER_TYPE.packs;
// par type d'organisation (c : collectivité, e : entreprise), par mois : [jour, temps fort, ensemble de prestations]
var TEMPS_FORTS = CALENDRIER_TYPE.mois;
// titre comparable : sans casse, accents ni apostrophes typographiques
var cleTempsFort = (e) =>
  String(e ?? ``)
    .toLowerCase()
    .normalize(`NFD`)
    .replace(/[̀-ͯ]/g, ``)
    .replace(/[’']/g, ` `)
    .replace(/\s+/g, ` `)
    .trim();
// prochains temps forts du calendrier type pour une organisation, à partir d'une semaine après aujourd'hui
// (en deçà, le délai de création ne permet plus de les anticiper).
// Un temps fort est masqué quand une demande non annulée porte le même titre à moins de 60 jours de sa date
// (date de parution de la demande, ou à défaut sa date de création), ou quand aucune de ses prestations
// n'est ouverte à la formule de l'organisation (reportage photo en Essentiel).
// qte : prestations pré-remplies dans la nouvelle demande, hors celles que la formule ne permet pas.
var prochainsTempsForts = (org, demandes = [], nombre = 4, jour = aujourdhui()) => {
  if (!org) return [];
  let calendrier = TEMPS_FORTS[org.type === `entreprise` ? `e` : `c`],
    [annee, mois] = jour.split(`-`).map(Number),
    deux = (n) => String(n).padStart(2, `0`),
    ecartJours = (a, b) => Math.abs(Date.parse(a) - Date.parse(b)) / 864e5,
    permise = (min) => !min || ORDRE_FORMULES.indexOf(org.formule) >= ORDRE_FORMULES.indexOf(min),
    dejaDemande = (titre, date) =>
      demandes.some(
        (d) =>
          d.statut !== `annulee` &&
          cleTempsFort(d.titre) === cleTempsFort(titre) &&
          ecartJours(d.parution ?? String(d.creee ?? ``).slice(0, 10), date) <= 60,
      ),
    debut = ajouterJours(jour, 7),
    liste = [];
  for (let k = 0; k < 4 && liste.length < nombre; k++) {
    let m = ((mois - 1 + k) % 12) + 1,
      a = annee + Math.floor((mois - 1 + k) / 12);
    for (let [j, titre, pack] of calendrier[m] ?? []) {
      let date = `${a}-${deux(m)}-${deux(j)}`;
      if (date < debut || dejaDemande(titre, date)) continue;
      let p = PACKS_TEMPS_FORTS[pack],
        qte = Object.fromEntries(Object.entries(p.p).filter(([id]) => permise(prestation(id)?.min)));
      if (!Object.keys(qte).length) continue;
      liste.push({
        cle: `${date}-${pack}`,
        titre,
        date,
        pack,
        libelle: p.l,
        qte,
      });
    }
  }
  return liste.slice(0, nombre);
};
// ouvre la nouvelle demande pré-remplie (titre, prestations, date de parution) : même mécanisme que le
// calendrier (etat.prerempli, lu puis vidé par NouvelleDemande). Le lien porte déjà href="#nouvelle".
var preparerTempsFort = (tf, ev) => {
  ev?.ctrlKey ||
    ev?.metaKey ||
    ev?.shiftKey ||
    (etat.prerempli = {
      titre: tf.titre,
      parution: tf.date,
      qte: { ...tf.qte },
    });
};
