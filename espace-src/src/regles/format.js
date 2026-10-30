// Module regles/format.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var euros = (e) =>
    new Intl.NumberFormat(`fr-FR`, {
      style: `currency`,
      currency: `EUR`,
      minimumFractionDigits: e % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    })
      .format(e)
      .replace(/ /g, `\xA0`);
