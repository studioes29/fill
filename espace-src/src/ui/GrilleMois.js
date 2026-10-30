// Composant GrilleMois (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Wx = H(
    `<span role="columnheader" class="svelte-1ognvwb"><span class="long svelte-1ognvwb"> </span><span class="court svelte-1ognvwb" aria-hidden="true"> </span></span>`,
  ),
  Gx = H(`<span> </span>`),
  Kx = H(`<b class="svelte-1ognvwb"> </b>`),
  qx = H(`<span><!><span class="svelte-1ognvwb"> </span></span>`),
  Jx = H(`<span class="plus svelte-1ognvwb"> </span>`),
  Yx = H(`<i></i>`),
  Xx = H(
    `<button type="button" role="gridcell"><span class="n num svelte-1ognvwb"> </span> <!> <span class="evs svelte-1ognvwb"><!> <!></span> <span class="points svelte-1ognvwb" aria-hidden="true"></span></button>`,
  ),
  Zx = H(
    `<div class="grille svelte-1ognvwb" role="grid" aria-label="Calendrier du mois"><div class="tete svelte-1ognvwb" role="row"></div> <div class="cases svelte-1ognvwb"></div></div>`,
  );
function GrilleMois(e, t) {
  qe(t, !0);
  let n = Ki(t, `fermetures`, 19, () => []),
    r = Ki(t, `jour`, 15, null),
    i = Ki(t, `charges`, 19, () => ({})),
    a = (e) => String(e).padStart(2, `0`),
    o = M(() => `${t.annee}-${a(t.mois)}-01`),
    s = M(() => {
      let e = new Date(B(o) + `T00:00:00Z`),
        n = ajouterJours(B(o), -((e.getUTCDay() + 6) % 7));
      return Array.from(
        {
          length: 42,
        },
        (e, t) => ajouterJours(n, t),
      ).filter((e, n, r) => n < 35 || r.slice(35).some((e) => e.slice(5, 7) === a(t.mois)));
    }),
    c = aujourdhui(),
    l = M(() => t.evs.reduce((e, t) => ((e[t.date] ??= []).push(t), e), {})),
    u = [`lun.`, `mar.`, `mer.`, `jeu.`, `ven.`, `sam.`, `dim.`],
    d = [`L`, `M`, `M`, `J`, `V`, `S`, `D`];
  var f = Zx(),
    p = F(f);
  (K(
    p,
    21,
    () => u,
    Qr,
    (e, t, n) => {
      var r = Wx(),
        i = F(r),
        a = L(i, !0),
        o = L(R(i), !0);
      (A(r),
        z(() => {
          (J(r, `aria-label`, B(t)), W(a, B(t)), W(o, d[n]));
        }),
        U(e, r));
    },
  ),
    A(p));
  var m = R(p, 2);
  (K(
    m,
    20,
    () => B(s),
    (e) => e,
    (e, o) => {
      let s = M(() => B(l)[o] ?? []),
        u = M(() => o.slice(5, 7) !== a(t.mois)),
        d = M(() => i()[o]);
      var f = Xx();
      let p;
      var m = F(f),
        h = L(m, !0),
        g = R(m, 2),
        _ = (e) => {
          var t = Gx();
          let n;
          var r = L(t);
          (z(() => {
            ((n = q(t, 1, `charge svelte-1ognvwb`, null, n, {
              trop: B(d).u > B(d).cap,
            })),
              J(t, `title`, `${B(d).u ?? ``} unités à livrer cette semaine`),
              W(r, `${B(d).u ?? ``}/${B(d).cap ?? ``}`));
          }),
            U(e, t));
        };
      G(g, (e) => {
        B(d) && B(d).u > 0 && e(_);
      });
      var v = R(g, 2),
        y = F(v);
      K(
        y,
        17,
        () => B(s).slice(0, 3),
        Qr,
        (e, t) => {
          var n = qx();
          let r;
          var i = F(n),
            a = (e) => {
              var n = Kx(),
                r = L(n, !0);
              (z(() => W(r, B(t).client)), U(e, n));
            };
          G(i, (e) => {
            B(t).client && e(a);
          });
          var o = L(R(i), !0);
          (A(n),
            z(() => {
              ((r = q(n, 1, `ev ${B(t).ton ?? ``}`, `svelte-1ognvwb`, r, {
                parution: B(t).type === `parution`,
                retard: B(t).retard,
              })),
                W(o, B(t).titre));
            }),
            U(e, n));
        },
      );
      var b = R(y, 2),
        x = (e) => {
          var t = Jx(),
            n = L(t);
          (z(() => W(n, `+${B(s).length - 3}`)), U(e, t));
        };
      (G(b, (e) => {
        B(s).length > 3 && e(x);
      }),
        A(v));
      var S = R(v, 2);
      (K(
        S,
        21,
        () => B(s).slice(0, 4),
        Qr,
        (e, t) => {
          var n = Yx();
          let r;
          (z(
            () =>
              (r = q(n, 1, fi(B(t).ton), `svelte-1ognvwb`, r, {
                retard: B(t).retard,
              })),
          ),
            U(e, n));
        },
      ),
        A(S),
        A(f),
        z(
          (e, t, n) => {
            ((p = q(f, 1, `case svelte-1ognvwb`, null, p, {
              hors: B(u),
              ferme: e,
              auj: o === c,
              choisi: r() === o,
              plein: B(s).length > 0,
            })),
              J(
                f,
                `aria-label`,
                `${t ?? ``} ${B(s).length ? `, ${B(s).length} élément${B(s).length > 1 ? `s` : ``}` : ``}`,
              ),
              W(h, n));
          },
          [() => !estOuvre(o, n()), () => Number(o.slice(8)), () => Number(o.slice(8))],
        ),
        V(`click`, f, () => r(r() === o ? null : o)),
        U(e, f));
    },
  ),
    A(m),
    A(f),
    U(e, f),
    Je());
}
kr([`click`]);
