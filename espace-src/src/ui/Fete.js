// Composant Fete (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var bh = H(`<i class="brin svelte-1sf2ric"></i>`),
  xh = H(`<p class="detail svelte-1sf2ric"> </p>`),
  Sh = H(`<button class="bt lg svelte-1sf2ric"> <!></button>`),
  Ch = H(`<button class="bt lg cl svelte-1sf2ric"> </button>`),
  wh = H(
    `<div class="fete svelte-1sf2ric" role="dialog" aria-modal="true" aria-labelledby="fete-t" tabindex="-1"><span class="motif svelte-1sf2ric" aria-hidden="true"></span> <div class="centre svelte-1sf2ric"><div class="noeud svelte-1sf2ric" aria-hidden="true"><!> <svg viewBox="0 0 120 120" class="svelte-1sf2ric"><circle class="disque svelte-1sf2ric" cx="60" cy="60" r="50"></circle><circle class="tour svelte-1sf2ric" cx="60" cy="60" r="57" pathLength="1"></circle><path class="coche svelte-1sf2ric" pathLength="1" d="M39 61 L53 75 L82 45"></path></svg></div> <h2 class="t1 svelte-1sf2ric" id="fete-t"> </h2> <!> <div class="actions svelte-1sf2ric"></div></div></div>`,
  );
function Fete(e, t) {
  qe(t, !0);
  let n = M(() => etat.fete),
    r = Array.from(
      {
        length: 14,
      },
      (e, t) => ({
        a: (t / 14) * 360 + (t % 3) * 9,
        d: 130 + (t % 4) * 34,
        r: (t % 5) * 40 - 80,
        c: t % 3 == 0 ? `var(--cor)` : t % 3 == 1 ? `var(--lav)` : `var(--c-f)`,
        t: t * 0.025,
      }),
    ),
    i = (e) => {
      ((etat.fete = null), e && aller(e));
    },
    a = N(void 0);
  wn(() => {
    if (!B(n)) return;
    queueMicrotask(() => B(a)?.focus());
    let e = (e) => {
      e.key === `Escape` && i();
    };
    return (addEventListener(`keydown`, e), () => removeEventListener(`keydown`, e));
  });
  var o = Br(),
    s = I(o),
    c = (e) => {
      var t = wh(),
        o = R(F(t), 2),
        s = F(o);
      (K(
        F(s),
        17,
        () => r,
        Qr,
        (e, t) => {
          var n = bh();
          let r;
          (z(
            () =>
              (r = yi(n, ``, r, {
                "--a": `${B(t).a ?? ``}deg`,
                "--d": `${B(t).d ?? ``}px`,
                "--r": `${B(t).r ?? ``}deg`,
                "--c": B(t).c,
                "--t": `${B(t).t ?? ``}s`,
              })),
          ),
            U(e, n));
        },
      ),
        j(2),
        A(s));
      var c = R(s, 2),
        l = L(c, !0),
        u = R(c, 2),
        d = (e) => {
          var t = xh(),
            r = L(t, !0);
          (z(() => W(r, B(n).detail)), U(e, t));
        };
      G(u, (e) => {
        B(n).detail && e(d);
      });
      var f = R(u, 2);
      (K(
        f,
        21,
        () => B(n).actions,
        Qr,
        (e, t) => {
          var n = Br(),
            r = I(n),
            o = (e) => {
              var n = Sh(),
                r = F(n);
              (Fleche(R(r), {}),
                A(n),
                Vi(
                  n,
                  (e) => P(a, e),
                  () => B(a),
                ),
                z(() => W(r, `${B(t).libelle ?? ``} `)),
                V(`click`, n, () => i(B(t).vers)),
                U(e, n));
            },
            s = (e) => {
              var n = Ch(),
                r = L(n, !0);
              (z(() => W(r, B(t).libelle)), V(`click`, n, () => i(B(t).vers)), U(e, n));
            };
          (G(r, (e) => {
            B(t).principal ? e(o) : e(s, -1);
          }),
            U(e, n));
        },
      ),
        A(f),
        A(o),
        A(t),
        z(() => W(l, B(n).titre)),
        V(`click`, t, (e) => {
          e.target === e.currentTarget && i();
        }),
        V(`keydown`, t, () => null),
        U(e, t));
    };
  (G(s, (e) => {
    B(n) && e(c);
  }),
    U(e, o),
    Je());
}
kr([`click`, `keydown`]);
