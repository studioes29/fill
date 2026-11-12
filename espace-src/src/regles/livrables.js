// Livrables attendus d'une demande : un par élément commandé, à remettre tous avant de livrer une version.
// Publications, actualités, affiches… : un livrable par unité de quantité (« Publication 1 », « Publication 2 »).
// Bulletin : un seul livrable (le fichier complet, quel que soit le nombre de pages). Agenda : un par lot.
// Reportage photo : un livrable par reportage, qui accepte plusieurs fichiers. Point de suivi et modération : rien à remettre.

var LIVRABLE_SANS = [`point`, `moder`];
var LIVRABLE_TYPE = { post: `post`, actu: `web`, agenda: `web`, page: `web`, news: `email`, presse: `pdf`, gabarit: `affiche`, affiche: `affiche`, flyer: `pdf`, bulletin: `pdf`, photo: `photos`, video: `video` };
var LIVRABLE_NOM = { post: `Publication`, actu: `Actualité`, agenda: `Agenda en ligne`, page: `Page du site`, news: `Newsletter`, presse: `Communiqué de presse`, gabarit: `Visuel`, affiche: `Affiche`, flyer: `Flyer`, bulletin: `Bulletin`, photo: `Reportage photo`, video: `Vidéo` };

var livrablesAttendus = (d) => {
  const r = [];
  for (const l of d?.lignes ?? []) {
    if (!l || LIVRABLE_SANS.includes(l.prestation) || !(Number(l.quantite) > 0)) continue;
    const base = LIVRABLE_NOM[l.prestation] ?? prestation(l.prestation)?.nom ?? l.prestation;
    const n = l.prestation === `bulletin` ? 1 : Math.round(Number(l.quantite));
    for (let i = 0; i < n; i++)
      r.push({
        cle: `${l.prestation}-${i + 1}`,
        prestation: l.prestation,
        type: LIVRABLE_TYPE[l.prestation] ?? `visuel`,
        libelle: l.prestation === `bulletin` ? `${base} (${l.quantite} page${l.quantite > 1 ? `s` : ``})` : n > 1 ? `${base} ${i + 1}` : base,
        plusieurs: l.prestation === `photo`,
      });
  }
  return r;
};

// les livrables encore vides d'une liste de fichiers (chaque fichier porte la clé de son livrable)
var livrablesManquants = (d, fichiers) => livrablesAttendus(d).filter((a) => !(fichiers ?? []).some((f) => f?.livrable === a.cle));
