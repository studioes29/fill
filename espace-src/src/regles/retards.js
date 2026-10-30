// Module regles/retards.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var alerteRetard = (e, t, n = []) =>
    e.statut === `deposee`
      ? ouvresEntre(e.creee.slice(0, 10), t, n) >= 1
        ? `confirmation_en_retard`
        : null
      : ![`confirmee`, `production`, `correction`].includes(e.statut) || !e.livraison
        ? null
        : e.livraison < t
          ? `livraison_depassee`
          : e.livraison === t
            ? `livraison_aujourdhui`
            : e.livraison <= ajouterOuvres(t, 1, n)
              ? `livraison_proche`
              : null;
var LIBELLES_ALERTE = {
    confirmation_en_retard: `Confirmation en retard`,
    livraison_depassee: `Livraison dépassée`,
    livraison_aujourdhui: `À livrer aujourd’hui`,
    livraison_proche: `À livrer demain`,
  };
var joursDeRetard = (e, t, n = []) => (e.livraison && e.livraison < t ? ouvresEntre(e.livraison, t, n) : 0);
