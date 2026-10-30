// Module regles/calendrier.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var jourIso = (e) => e.toISOString().slice(0, 10);
var dateUtc = (e) => new Date(e + `T00:00:00Z`);
var ajouterJours = (e, t) => {
    let n = dateUtc(e);
    return (n.setUTCDate(n.getUTCDate() + t), jourIso(n));
  };
var paques = (e) => {
    let t = e % 19,
      n = Math.floor(e / 100),
      r = e % 100,
      i = Math.floor(n / 4),
      a = n % 4,
      o = Math.floor((n + 8) / 25),
      s = Math.floor((n - o + 1) / 3),
      c = (19 * t + n - i - s + 15) % 30,
      l = Math.floor(r / 4),
      u = r % 4,
      d = (32 + 2 * a + 2 * l - c - u) % 7,
      f = Math.floor((t + 11 * c + 22 * d) / 451),
      p = Math.floor((c + d - 7 * f + 114) / 31),
      m = ((c + d - 7 * f + 114) % 31) + 1;
    return `${e}-${String(p).padStart(2, `0`)}-${String(m).padStart(2, `0`)}`;
  };
var cacheFeries = new Map();
var feries = (e) => {
    let t = cacheFeries.get(e);
    if (t) return t;
    let n = paques(e);
    return (
      (t = new Set([
        `${e}-01-01`,
        `${e}-05-01`,
        `${e}-05-08`,
        `${e}-07-14`,
        `${e}-08-15`,
        `${e}-11-01`,
        `${e}-11-11`,
        `${e}-12-25`,
        ajouterJours(n, 1),
        ajouterJours(n, 39),
        ajouterJours(n, 50),
      ])),
      cacheFeries.set(e, t),
      t
    );
  };
var estOuvre = (e, t = []) => {
    let n = dateUtc(e),
      r = n.getUTCDay();
    return r === 0 || r === 6 || feries(n.getUTCFullYear()).has(e) ? !1 : !t.some((t) => e >= t.debut && e <= t.fin);
  };
var ajouterOuvres = (e, t, n = []) => {
    let r = e,
      i = t;
    for (; i > 0;) ((r = ajouterJours(r, 1)), estOuvre(r, n) && i--);
    return r;
  };
var ouvresEntre = (e, t, n = []) => {
    if (t <= e) return 0;
    let r = 0;
    for (let i = ajouterJours(e, 1); i <= t; i = ajouterJours(i, 1)) estOuvre(i, n) && r++;
    return r;
  };
var periodeDe = (e) => e.slice(0, 7);
