// Composant Curseur (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Z_ = H(`<span class="n num svelte-2zflr"> </span>`),
  Q_ = H(`<button type="button"> <!></button>`),
  $_ = H(`<div role="group"><div class="piste svelte-2zflr"><span aria-hidden="true"></span> <!></div></div>`);
function Curseur(e, t) {
  qe(t, !0);
  let n = Ki(t, `valeur`, 15),
    r = Ki(t, `petit`, 3, !1),
    i = N(void 0),
    a = N(
      en({
        x: 0,
        w: 0,
        vu: !1,
      }),
    ),
    o = () => {
      let e = B(i)?.querySelector(`[data-id="${CSS.escape(n())}"]`);
      if (!e) return;
      P(
        a,
        {
          x: e.offsetLeft,
          w: e.offsetWidth,
          vu: !0,
        },
        !0,
      );
      let t = B(i),
        r = e.offsetLeft - (t.clientWidth - e.offsetWidth) / 2;
      t.scrollTo({
        left: Math.max(0, r),
        behavior: yr(() => B(a).vu) ? `smooth` : `instant`,
      });
    };
  (wn(() => {
    (n(), t.options.length, queueMicrotask(o));
  }),
    wn(() => {
      let e = new ResizeObserver(() => o());
      return (B(i) && e.observe(B(i)), document.fonts?.ready.then(o), () => e.disconnect());
    }));
  var s = $_();
  let c;
  var l = F(s),
    u = F(l);
  let d, f;
  (K(
    R(u, 2),
    17,
    () => t.options,
    (e) => e.id,
    (e, t) => {
      var r = Q_();
      let i;
      var a = F(r, !0),
        o = R(a),
        s = (e) => {
          var n = Z_(),
            r = L(n, !0);
          (z(() => W(r, B(t).n)), U(e, n));
        };
      (G(o, (e) => {
        B(t).n !== void 0 && e(s);
      }),
        A(r),
        z(() => {
          (J(r, `data-id`, B(t).id),
            J(r, `aria-pressed`, n() === B(t).id),
            (i = q(r, 1, `svelte-2zflr`, null, i, {
              on: n() === B(t).id,
              alerte: B(t).alerte,
            })),
            W(a, B(t).nom));
        }),
        V(`click`, r, () => n(B(t).id)),
        U(e, r));
    },
  ),
    A(l),
    Vi(
      l,
      (e) => P(i, e),
      () => B(i),
    ),
    A(s),
    z(() => {
      ((c = q(s, 1, `filtres-f svelte-2zflr`, null, c, {
        petit: r(),
      })),
        J(s, `aria-label`, t.libelle),
        (d = q(u, 1, `curseur svelte-2zflr`, null, d, {
          vu: B(a).vu,
        })),
        (f = yi(u, ``, f, {
          transform: `translateX(${B(a).x ?? ``}px)`,
          width: `${B(a).w ?? ``}px`,
        })));
    }),
    U(e, s),
    Je());
}
kr([`click`]);
