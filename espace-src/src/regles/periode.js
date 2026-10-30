// Module regles/periode.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var jourBorne = (a, y, m) => Math.min(a, new Date(Date.UTC(y, m, 0)).getUTCDate());
var organisationDe = (e) => (typeof e == `string` ? etat.d.organisations.find((t) => t.id === e) : e);
var periodeAnniversaire = (e, t = aujourdhui()) => {
    let n = organisationDe(e)?.anniversaire;
    if (!n) return periodeDe(t);
    let r = +t.slice(0, 4),
      i = +t.slice(5, 7);
    if (+t.slice(8, 10) >= jourBorne(+n.slice(8, 10), r, i)) return t.slice(0, 7);
    (i--, i < 1 && ((i = 12), r--));
    return `${r}-${String(i).padStart(2, `0`)}`;
  };
var bornesPeriode = (e, t) => {
    let n = organisationDe(e)?.anniversaire,
      a = n ? +n.slice(8, 10) : 1,
      r = +t.slice(0, 4),
      i = +t.slice(5, 7),
      o = i === 12 ? r + 1 : r,
      s = i === 12 ? 1 : i + 1,
      c = (e, t, n) => `${e}-${String(t).padStart(2, `0`)}-${String(n).padStart(2, `0`)}`;
    return {
      debut: c(r, i, jourBorne(a, r, i)),
      fin: ajouterJours(c(o, s, jourBorne(a, o, s)), -1),
    };
  };
var libellePeriode = (e, t) => {
    if (!/^\d{4}-\d{2}$/.test(t ?? ``)) return libelleMois(t);
    let n = bornesPeriode(e, t);
    return `du ${jourMois(n.debut)}${n.debut.slice(0, 4) === n.fin.slice(0, 4) ? `` : ` ${n.debut.slice(0, 4)}`} au ${jourMois(n.fin)} ${n.fin.slice(0, 4)}`;
  };
