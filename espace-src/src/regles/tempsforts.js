// Module regles/tempsforts.
// Calendrier type des temps forts annuels, affiché sur l'Accueil (bloc « À anticiper »).
//
// Copie exacte des données du site vitrine : objet D (calendrier type) et objet PACKS de assets/t.js,
// qui servent à la page publique /calendrier/. Le bundle de l'Espace est autonome et ne lit pas assets/t.js :
// toute modification d'un côté doit être reportée de l'autre pour garder les deux listes alignées.

// ensemble de prestations du catalogue derrière chaque temps fort (PACKS de assets/t.js)
var PACKS_TEMPS_FORTS = {
  pub: { l: `Publication`, p: { post: 1 } },
  pa: { l: `Publication et actualité`, p: { post: 1, actu: 1 } },
  aff: { l: `Affiche et deux publications`, p: { affiche: 1, post: 2 } },
  news: { l: `Newsletter`, p: { news: 1 } },
  cp: { l: `Communiqué et publication`, p: { presse: 1, post: 1 } },
  prog: { l: `Programme recto verso et publication`, p: { flyer: 1, post: 1 } },
  bul: { l: `Bulletin de 8 pages`, p: { bulletin: 8 } },
  photo: { l: `Reportage photo`, p: { photo: 1 } },
  video: { l: `Vidéo courte`, p: { video: 1 } },
};
// par type d'organisation (c : collectivité, e : entreprise), par mois : [jour, temps fort, ensemble de prestations]
var TEMPS_FORTS = {
  c: {
    1: [[6, `Vœux du maire`, `aff`], [20, `Bulletin d’hiver`, `bul`], [27, `Recensement`, `pa`]],
    2: [[3, `Débat d’orientation budgétaire`, `pa`], [10, `Vacances d’hiver`, `prog`], [24, `Travaux de printemps`, `pa`]],
    3: [[8, `Journée des droits des femmes`, `pub`], [14, `Budget voté`, `pa`], [21, `Nettoyage de printemps`, `aff`]],
    4: [[1, `Inscriptions scolaires`, `pa`], [12, `Vacances de printemps`, `prog`], [25, `Chasse aux œufs`, `aff`]],
    5: [[8, `Commémoration du 8 mai`, `pa`], [16, `Fête de la nature`, `aff`], [28, `Bulletin d’été`, `bul`]],
    6: [[5, `Saison estivale`, `pa`], [21, `Fête de la musique`, `aff`], [28, `Kermesses`, `pub`]],
    7: [[3, `Programme d’été`, `prog`], [14, `Fête nationale`, `aff`], [20, `Marchés estivaux`, `pub`]],
    8: [[5, `Animations d’août`, `pub`], [20, `Forum des associations`, `aff`], [28, `Rentrée`, `pa`]],
    9: [[1, `Rentrée scolaire`, `pa`], [6, `Forum des associations`, `aff`], [20, `Journées du patrimoine`, `prog`]],
    10: [[1, `Octobre rose`, `pub`], [6, `Semaine bleue`, `prog`], [18, `Vacances de la Toussaint`, `prog`]],
    11: [[11, `Commémoration du 11 novembre`, `pa`], [22, `Lettre de fin d’année`, `news`], [28, `Téléthon`, `aff`]],
    12: [[6, `Marché de Noël`, `aff`], [15, `Horaires des fêtes`, `pa`], [22, `Vœux du maire`, `aff`]],
  },
  e: {
    1: [[8, `Vœux aux clients`, `news`], [15, `Bilan de l’année`, `pa`], [29, `Recrutements de printemps`, `pa`]],
    2: [[5, `Salon professionnel`, `aff`], [19, `Portraits d’équipe`, `photo`], [26, `Lettre clients`, `news`]],
    3: [[10, `Chantier de référence`, `pa`], [17, `Offres d’emploi`, `pa`], [31, `Clôture du trimestre`, `pub`]],
    4: [[7, `Nouveau produit`, `pa`], [14, `Portes ouvertes`, `aff`], [28, `Lettre clients`, `news`]],
    5: [[12, `Salon régional`, `aff`], [19, `Témoignage client`, `pa`], [26, `Recrutement d’été`, `pa`]],
    6: [[9, `Anniversaire de l’entreprise`, `cp`], [16, `Chantiers de l’été`, `pub`], [30, `Fermeture estivale`, `pub`]],
    7: [[7, `Coulisses de l’atelier`, `video`], [15, `Fermeture estivale`, `pub`], [29, `Préparer la rentrée`, `pub`]],
    8: [[26, `Rentrée`, `pa`], [28, `Offres de rentrée`, `pa`], [31, `Lettre de rentrée`, `news`]],
    9: [[8, `Rentrée commerciale`, `pa`], [16, `Salon de rentrée`, `aff`], [29, `Lettre clients`, `news`]],
    10: [[7, `Nouvelle réalisation`, `photo`], [14, `Semaine de l’industrie`, `pub`], [28, `Recrutement`, `pa`]],
    11: [[4, `Retour d’expérience client`, `pa`], [18, `Vœux de fin d’année`, `aff`], [25, `Lettre clients`, `news`]],
    12: [[5, `Bilan de l’année`, `pa`], [12, `Vœux aux clients`, `news`], [19, `Fermeture des fêtes`, `pub`]],
  },
};
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
