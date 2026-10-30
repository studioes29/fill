// Composant Historique (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Yv = Rr(
    `<svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-16qzz4d"><path d="M6 12.5l4 4L18 8" class="svelte-16qzz4d"></path></svg>`,
  ),
  Xv = H(
    `<li><span class="noeud svelte-16qzz4d"><!></span> <span class="lib svelte-16qzz4d"> </span> <span class="date num svelte-16qzz4d"> </span></li>`,
  ),
  Zv = H(
    `<div><svg class="trace svelte-16qzz4d" viewBox="0 0 600 36" preserveAspectRatio="none" aria-hidden="true"><path class="fond svelte-16qzz4d" vector-effect="non-scaling-stroke"></path><path class="tendu svelte-16qzz4d" pathLength="1" vector-effect="non-scaling-stroke"></path></svg> <ol class="svelte-16qzz4d"></ol></div>`,
  );
function Historique(e, t) {
  qe(t, !0);
  let n = M(() => (t.d.statut === `annulee` ? -1 : etapeDe(t.d.statut))),
    r = M(() => t.d.statut === `livree`),
    i = M(() =>
      ETAPES.map(
        (e) =>
          t.d.historique
            .findLast((t) => e.statuts.includes(t.statut) && t.type !== `modification`)
            ?.date.slice(0, 10) ?? null,
      ),
    ),
    a = M(() => (B(r) ? 1 : Math.max(0, B(n)) / (ETAPES.length - 1))),
    o = `M0 18 C 60 6, 90 30, 150 18 S 240 6, 300 18 S 390 30, 450 18 S 540 6, 600 18`;
  var s = Zv();
  let c, l;
  var u = F(s),
    d = F(u);
  (J(d, `d`, o), J(R(d), `d`, o), A(u));
  var f = R(u, 2);
  (K(
    f,
    21,
    () => ETAPES,
    Qr,
    (e, a, o) => {
      var s = Xv();
      let c;
      var l = F(s),
        u = F(l),
        d = (e) => {
          U(e, Yv());
        };
      (G(u, (e) => {
        (o < B(n) || B(r)) && e(d);
      }),
        A(l));
      var f = R(l, 2),
        p = L(f, !0),
        m = L(R(f, 2), !0);
      (A(s),
        z(
          (e, t) => {
            (J(s, `aria-current`, o === B(n) && !B(r) ? `step` : void 0),
              (c = q(s, 1, `svelte-16qzz4d`, null, c, {
                passee: o < B(n) || B(r),
                courante: o === B(n) && !B(r),
              })),
              W(p, e),
              W(m, t));
          },
          [
            () => (B(a).cle === `livraison` ? LIBELLES_REMISE[modeRemise(t.d.lignes)].etape : B(a).libelle),
            () => (B(i)[o] && (o <= B(n) || B(r)) ? jourMois(B(i)[o]) : ``),
          ],
        ),
        U(e, s));
    },
  ),
    A(f),
    A(s),
    z(() => {
      ((c = q(s, 1, `fil svelte-16qzz4d`, null, c, {
        annule: t.d.statut === `annulee`,
      })),
        (l = yi(s, ``, l, {
          "--p": B(a),
        })));
    }),
    U(e, s),
    Je());
}
