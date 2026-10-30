// Module regles/registre.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var etatPeriode = (e, t, n) => {
    let r = 0,
      i = 0,
      a = 0,
      o = 0,
      s = 0;
    for (let c of e)
      c.organisationId === t &&
        c.periode === n &&
        (c.type === `credit`
          ? (r += c.unites)
          : c.type === `report`
            ? (i += c.unites)
            : c.type === `ajustement`
              ? (a += c.unites)
              : c.type === `debit` &&
                (c.etat === `reserve` ? (o += c.unites) : c.etat === `consomme` && (s += c.unites)));
    let c = r + i + a,
      l = o + s;
    return {
      periode: n,
      quota: r,
      report: i,
      ajustements: a,
      reserve: o,
      consomme: s,
      engage: l,
      total: c,
      disponible: c - l,
      reportRestant: Math.max(0, i - l),
    };
  };
