// Composant FilEtat (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Hg = H(
  `<span><svg viewBox="0 0 46 16" aria-hidden="true" class="svelte-t746fa"><path class="fond svelte-t746fa" pathLength="1"></path><path class="tendu svelte-t746fa" pathLength="1"></path><circle class="perle svelte-t746fa" r="3.6"></circle></svg> <span class="lib svelte-t746fa"> </span></span>`,
);
function FilEtat(e, t) {
  qe(t, !0);
  let n = Ki(t, `client`, 3, !1),
    r = Ki(t, `taille`, 3, `md`),
    i = M(() => (t.s === `livree` || t.s === `validee` ? 4 : Math.max(0, etapeDe(t.s)))),
    a = M(() => (t.s === `annulee` ? 0 : B(i) / 4)),
    o = M(() =>
      t.s === `annulee`
        ? `gris`
        : t.s === `deposee`
          ? `attente`
          : t.s === `confirmee`
            ? `lav-c`
            : [`validee`, `livree`].includes(t.s)
              ? `bon`
              : [`a_valider`, `accord_requis`, `attente_client`].includes(t.s)
                ? `cor`
                : `lav`,
    ),
    s = M(() =>
      n() && t.s === `deposee`
        ? `Confirmation sous 24 h`
        : !n() && t.s === `attente_client`
          ? `Attente du client`
          : n() && t.s === `a_valider`
            ? `À relire et valider`
            : LIBELLES_STATUT[t.s],
    ),
    c = `M2 8 C 7 2, 11 14, 16 8 S 25 2, 30 8 S 39 14, 44 8`,
    l = M(() => 2 + 42 * B(a)),
    u = M(() => 8 + Math.sin(((B(l) - 2) / 14) * Math.PI) * -4.5);
  var d = Hg();
  let f;
  var p = F(d),
    m = F(p);
  J(m, `d`, c);
  var h = R(m);
  J(h, `d`, c);
  let g;
  var _ = R(h);
  A(p);
  var v = L(R(p, 2), !0);
  (A(d),
    z(() => {
      ((f = q(d, 1, `etat ${B(o) ?? ``} ${r() ?? ``}`, `svelte-t746fa`, f, {
        fini: t.s === `livree`,
      })),
        (g = yi(h, ``, g, {
          "--p": B(a),
        })),
        J(_, `cx`, B(l)),
        J(_, `cy`, B(u)),
        W(v, B(s)));
    }),
    U(e, d),
    Je());
}
