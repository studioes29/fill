// Jours ouvrés, fériés et périodes (calendrier français, dates « AAAA-MM-JJ » en UTC).
export const j = (d) => d.toISOString().slice(0, 10);
export const d = (s) => /* @__PURE__ */ new Date(s + "T00:00:00Z");
export const ajouterJours = (s, n) => {
  const x = d(s);
  x.setUTCDate(x.getUTCDate() + n);
  return j(x);
};
export const paques = (an) => {
  const a = an % 19, b = Math.floor(an / 100), c = an % 100;
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31), jour = (h + l - 7 * m + 114) % 31 + 1;
  return `${an}-${String(mois).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
};
export const cache = /* @__PURE__ */ new Map();
export const feries = (an) => {
  let s = cache.get(an);
  if (s) return s;
  const p = paques(an);
  s = /* @__PURE__ */ new Set([
    `${an}-01-01`,
    `${an}-05-01`,
    `${an}-05-08`,
    `${an}-07-14`,
    `${an}-08-15`,
    `${an}-11-01`,
    `${an}-11-11`,
    `${an}-12-25`,
    ajouterJours(p, 1),
    // lundi de Pâques
    ajouterJours(p, 39),
    // Ascension
    ajouterJours(p, 50)
    // lundi de Pentecôte
  ]);
  cache.set(an, s);
  return s;
};
export const estOuvre = (s, fermetures = []) => {
  const x = d(s), wd = x.getUTCDay();
  if (wd === 0 || wd === 6) return false;
  if (feries(x.getUTCFullYear()).has(s)) return false;
  return !fermetures.some((f) => s >= f.debut && s <= f.fin);
};
export const ajouterOuvres = (s, n, fermetures = []) => {
  let x = s;
  let reste = n;
  while (reste > 0) {
    x = ajouterJours(x, 1);
    if (estOuvre(x, fermetures)) reste--;
  }
  return x;
};
export const ouvresEntre = (a, b, fermetures = []) => {
  if (b <= a) return 0;
  let n = 0;
  for (let x = ajouterJours(a, 1); x <= b; x = ajouterJours(x, 1)) if (estOuvre(x, fermetures)) n++;
  return n;
};
export const periodeDe = (s) => s.slice(0, 7);
