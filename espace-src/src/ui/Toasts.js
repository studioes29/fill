// Composant Toasts (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var dh = Rr(
    `<path class="fil svelte-1br0hsq" pathLength="1" d="M1 21C6 21 8 12 12.5 12S15.5 19.5 12.5 19.5 10 13.5 15 16.5L19.5 26 36 8.5"></path>`,
  ),
  fh = Rr(`<path class="fil svelte-1br0hsq" pathLength="1" d="M12 12l16 16M28 12L12 28"></path>`),
  ph = Rr(`<path class="fil svelte-1br0hsq" pathLength="1" d="M20 12v1M20 18v11"></path>`),
  mh = H(`<small class="svelte-1br0hsq"> </small>`),
  hh = H(
    `<div><span class="noeud svelte-1br0hsq" aria-hidden="true"><svg viewBox="0 0 40 40" class="svelte-1br0hsq"><!></svg></span> <span class="txt svelte-1br0hsq"><b class="svelte-1br0hsq"> </b><!></span> <button class="x svelte-1br0hsq" aria-label="Fermer le message"><svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-1br0hsq"><path d="M7 7l10 10M17 7L7 17" class="svelte-1br0hsq"></path></svg></button> <svg class="minuteur svelte-1br0hsq" viewBox="0 0 300 8" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 4C40 1 60 7 100 4S160 1 200 4 260 7 298 4" class="svelte-1br0hsq"></path></svg></div>`,
  ),
  gh = H(`<div class="pile svelte-1br0hsq" aria-live="polite" aria-atomic="false"></div>`);
function Toasts(e, t) {
  (qe(t, !1), Hi());
  var n = gh();
  (K(
    n,
    5,
    () => etat.toasts,
    (e) => e.id,
    (e, t) => {
      var n = hh(),
        r = F(n),
        i = F(r),
        a = F(i),
        o = (e) => {
          U(e, dh());
        },
        s = (e) => {
          U(e, fh());
        },
        c = (e) => {
          U(e, ph());
        };
      (G(a, (e) => {
        B(t).type === `succes` ? e(o) : B(t).type === `erreur` ? e(s, 1) : e(c, -1);
      }),
        A(i),
        A(r));
      var l = R(r, 2),
        u = F(l),
        d = L(u, !0),
        f = R(u),
        p = (e) => {
          var n = mh(),
            r = L(n, !0);
          (z(() => W(r, B(t).detail)), U(e, n));
        };
      (G(f, (e) => {
        B(t).detail && e(p);
      }),
        A(l));
      var m = R(l, 2),
        h = R(m, 2);
      let g;
      var _ = L(h);
      (A(n),
        z(() => {
          (q(n, 1, `toast ${B(t).type ?? ``}`, `svelte-1br0hsq`),
            J(n, `role`, B(t).type === `erreur` ? `alert` : `status`),
            W(d, B(t).texte),
            (g = yi(h, ``, g, {
              "--duree": `${B(t).type === `erreur` ? 6.5 : 4.2}s`,
            })));
        }),
        V(`click`, m, () => retirerToast(B(t).id)),
        Or(`animationend`, _, (e) => {
          e.animationName.endsWith(`devide`) && retirerToast(B(t).id);
        }),
        U(e, n));
    },
  ),
    A(n),
    U(e, n),
    Je());
}
kr([`click`]);
