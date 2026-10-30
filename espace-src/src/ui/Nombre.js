// Composant Nombre (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var yS = H(`<span class="num"> </span>`);
function Nombre(e, t) {
  qe(t, !0);
  let n = Ki(t, `duree`, 3, 700),
    r = N(0);
  wn(() => {
    let e = t.v,
      i = yr(() => B(r)),
      a = performance.now();
    if (matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      P(r, e, !0);
      return;
    }
    let o = 0,
      s = (t) => {
        let c = Math.min(1, (t - a) / n());
        (P(r, Math.round(i + (e - i) * (1 - (1 - c) ** 3)), !0), c < 1 && (o = requestAnimationFrame(s)));
      };
    return ((o = requestAnimationFrame(s)), () => cancelAnimationFrame(o));
  });
  var i = yS(),
    a = L(i, !0);
  (z(() => W(a, B(r))), U(e, i), Je());
}
