// Composant Bobine (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var zg = H(`<b> </b>`),
  Bg = H(
    `<figure class="bobine svelte-30knvr"><svg viewBox="0 0 160 160" role="img" class="svelte-30knvr"><circle cx="80" cy="80" class="piste svelte-30knvr"></circle><circle cx="80" cy="80" class="arc aj svelte-30knvr"></circle><circle cx="80" cy="80" class="arc att svelte-30knvr"></circle><circle cx="80" cy="80" class="arc res svelte-30knvr"></circle><circle cx="80" cy="80" class="arc con svelte-30knvr"></circle></svg> <figcaption class="svelte-30knvr"><!> <span class="svelte-30knvr"> </span></figcaption></figure>`,
  );
function Bobine(e, t) {
  qe(t, !0);
  let n = Ki(t, `enAttente`, 3, 0),
    r = Ki(t, `taille`, 3, 168),
    i = Ki(t, `ajout`, 3, 0),
    a = 2 * Math.PI * 62,
    o = M(() => Math.max(1, t.e.total)),
    s = M(() => Math.min(1, t.e.consomme / B(o))),
    c = M(() => Math.min(1 - B(s), t.e.reserve / B(o))),
    l = M(() => Math.min(1 - B(s) - B(c), n() / B(o))),
    u = M(() => Math.min(Math.max(0, 1 - B(s) - B(c) - B(l)), i() / B(o))),
    d = M(() => t.e.disponible - i());
  var f = Bg();
  let p;
  var m = F(f),
    h = F(m);
  J(h, `r`, 62);
  var g = R(h);
  J(g, `r`, 62);
  var _ = R(g);
  J(_, `r`, 62);
  var v = R(_);
  J(v, `r`, 62);
  var y = R(v);
  (J(y, `r`, 62), A(m));
  var b = R(m, 2),
    x = F(b);
  Zr(
    x,
    () => B(d),
    (e) => {
      var t = zg();
      let n;
      var r = L(t, !0);
      (z(() => {
        ((n = q(t, 1, `num svelte-30knvr`, null, n, {
          neg: B(d) < 0,
        })),
          W(r, B(d)));
      }),
        U(e, t));
    },
  );
  var S = L(R(x, 2), !0);
  (A(b),
    A(f),
    z(() => {
      ((p = yi(f, ``, p, {
        width: `${r() ?? ``}px`,
      })),
        J(m, `aria-label`, `${t.e.disponible ?? ``} unités disponibles sur ${t.e.total ?? ``}`),
        J(g, `stroke-dasharray`, `${B(u) * a} 389.55748904513433`),
        J(g, `stroke-dashoffset`, -(B(s) + B(c) + B(l)) * a),
        J(_, `stroke-dasharray`, `${B(l) * a} 389.55748904513433`),
        J(_, `stroke-dashoffset`, -(B(s) + B(c)) * a),
        J(v, `stroke-dasharray`, `${B(c) * a} 389.55748904513433`),
        J(v, `stroke-dashoffset`, -B(s) * a),
        J(y, `stroke-dasharray`, `${B(s) * a} 389.55748904513433`),
        W(S, i() ? `resteraient` : `sur ${t.e.total}`));
    }),
    U(e, f),
    Je());
}
