// Composant Icone (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var ch = Rr(`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path></path></svg>`);
function Icone(e, t) {
  let n = Ki(t, `taille`, 3, 20),
    r = {
      accueil: `M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z`,
      demandes: `M5 6h14M5 12h14M5 18h9`,
      plus: `M12 5v14M5 12h14`,
      moins: `M5 12h14`,
      unites: `M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1`,
      calendrier: `M5 7h14v12H5zM5 11h14M9 4v4M15 4v4`,
      production: `M4 7h16M4 12h10M4 17h6M18 14l3 3-3 3`,
      pilotage: `M4 19V11M10 19V5M16 19v-6M22 19H2`,
      clients: `M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c.6-3 2.6-5 5-5s4.4 2 5 5M16 11a2.5 2.5 0 1 0 0-5M17 14c2 .3 3.4 2 4 5`,
      retour: `M15 5l-7 7 7 7`,
      suite: `M9 5l7 7-7 7`,
      bas: `M6 9l6 6 6-6`,
      ar: `M5 12h14M13 6l6 6-6 6`,
      al: `M19 12H5M11 6l-6 6 6 6`,
      trombone: `M8 12.5l5.6-5.6a2.5 2.5 0 1 1 3.5 3.5l-7 7a4 4 0 0 1-5.7-5.7l6.4-6.4`,
      envoyer: `M5 12h13M13 6l6 6-6 6`,
      alerte: `M12 4 3 19h18zM12 10v4M12 16.5v.5`,
      info: `M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8v.5`,
      ok: `M5 12.5l4.5 4.5L19 7`,
      non: `M7 7l10 10M17 7L7 17`,
      correction: `M4 20l4-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5 16zM14 7l3 3`,
      sortir: `M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h10`,
      fichier: `M7 3h7l4 4v14H7zM14 3v4h4`,
      eclair: `M13 3 5 14h6l-1 7 8-11h-6z`,
      horloge: `M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2`,
      recherche: `M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4`,
      agrandir: `M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7`,
      lecture: `M8 5v14l11-7z`,
      corbeille: `M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13`,
      modifier: `M4 20l4-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5 16z`,
      collectivite: `M3.5 9.5L12 4l8.5 5.5M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3.5 20h17`,
      entreprise: `M4 8.5h16v10.5H4zM9 8.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2.5M4 13h16`,
      cadeau: `M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1`,
      panier: `M4 6h2l2 10h10l2-7H7M10 20.5a.5.5 0 1 0 0-1M17 20.5a.5.5 0 1 0 0-1`,
      reglages: `M4 7h10M18 7h2M4 17h4M12 17h8M14 5v4M8 15v4`,
      mail: `M4 6h16v12H4zM4 7l8 6 8-6`,
      lire: `M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z`,
      imprimer: `M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M7 14h10v6H7z`,
      pilote: `M12 3l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.3l5-.7z`,
      atelier: `M14.5 4.5l5 5L9 20H4v-5zM12 7l5 5`,
      facture: `M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3`,
      aide: `M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5`,
      commentaire: `M5 5h14v10H9l-4 4z`,
      cloche: `M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0`,
      copier: `M8 8h11v12H8zM5 16V4h11`,
      cle: `M14.5 4a5.5 5.5 0 1 1-4.9 8l-6.1 6.1V21h3v-2h2v-2h2l1.6-1.6A5.5 5.5 0 0 1 14.5 4zM16 7.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z`,
    };
  var i = ch(),
    a = L(i);
  (z(() => {
    (J(i, `width`, n()), J(i, `height`, n()), J(a, `d`, r[t.n] ?? ``));
  }),
    U(e, i));
}
