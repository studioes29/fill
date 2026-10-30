// Composant Volet (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var bx = H(`<span class="it sous svelte-19lc4fm"> </span>`),
  xx = H(`<footer class="svelte-19lc4fm"><!></footer>`),
  Sx = H(
    `<div class="fond svelte-19lc4fm" role="presentation"><div class="boite svelte-19lc4fm" role="dialog" aria-modal="true" aria-labelledby="modale-titre"><header class="svelte-19lc4fm"><h2 class="t2" id="modale-titre"> <!></h2> <button class="ico fermer" aria-label="Fermer"><svg class="i" viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"></path></svg></button></header> <div class="corps svelte-19lc4fm"><!></div> <!></div></div>`,
  );
function Volet(e, t) {
  qe(t, !0);
  let n = Ki(t, `ouverte`, 15, !1),
    r = Ki(t, `sous`, 3, ``),
    i = N(void 0);
  wn(() => {
    if (!n()) return;
    let e = document.activeElement;
    queueMicrotask(() => B(i)?.querySelector(`input,textarea,select,button:not(.fermer)`)?.focus());
    let t = (e) => {
      e.key === `Escape` && n(!1);
    };
    return (
      addEventListener(`keydown`, t),
      (document.body.style.overflow = `hidden`),
      () => {
        (removeEventListener(`keydown`, t), (document.body.style.overflow = ``), e?.focus?.());
      }
    );
  });
  var a = Br(),
    o = I(a),
    s = (e) => {
      var a = Sx(),
        o = F(a),
        s = F(o),
        c = F(s),
        l = F(c, !0),
        u = R(l),
        d = (e) => {
          var t = bx(),
            n = L(t, !0);
          (z(() => W(n, r())), U(e, t));
        };
      (G(u, (e) => {
        r() && e(d);
      }),
        A(c));
      var f = R(c, 2);
      A(s);
      var p = R(s, 2);
      (si(F(p), () => t.children), A(p));
      var m = R(p, 2),
        h = (e) => {
          var n = xx();
          (si(F(n), () => t.pied), A(n), U(e, n));
        };
      (G(m, (e) => {
        t.pied && e(h);
      }),
        A(o),
        Vi(
          o,
          (e) => P(i, e),
          () => B(i),
        ),
        A(a),
        z(() => W(l, t.titre)),
        V(`click`, a, (e) => {
          e.target === e.currentTarget && n(!1);
        }),
        V(`click`, f, () => n(!1)),
        U(e, a));
    };
  (G(o, (e) => {
    n() && e(s);
  }),
    U(e, a),
    Je());
}
kr([`click`]);
