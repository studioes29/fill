// Composant EnTete (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Yg = H(`<a class="retour svelte-s7h9vm"><i aria-hidden="true" class="svelte-s7h9vm"><!></i> </a>`),
  Xg = H(`<p class="surtitre svelte-s7h9vm"> </p>`),
  Zg = H(`<span class="it"> </span>`),
  Qg = H(`<div class="actions svelte-s7h9vm"><!></div>`),
  $g = H(
    `<header class="tete svelte-s7h9vm"><span class="motif svelte-s7h9vm" aria-hidden="true"></span> <div class="w svelte-s7h9vm"><!> <div class="ligne svelte-s7h9vm"><div class="titres svelte-s7h9vm"><!> <h1 class="t1 svelte-s7h9vm"> <!></h1></div> <!></div> <!></div></header>`,
  );
function EnTete(e, t) {
  qe(t, !0);
  let n = Ki(t, `sous`, 3, ``),
    r = Ki(t, `retour`, 3, null),
    i = Ki(t, `surtitre`, 3, ``);
  var a = $g(),
    o = R(F(a), 2),
    s = F(o),
    c = (e) => {
      var t = Yg(),
        n = F(t);
      (Icone(F(n), {
        n: `al`,
        taille: 15,
      }),
        A(n));
      var i = R(n, 1, !0);
      (A(t),
        z(() => {
          (J(t, `href`, r().href), W(i, r().libelle));
        }),
        U(e, t));
    };
  G(s, (e) => {
    r() && e(c);
  });
  var l = R(s, 2),
    u = F(l),
    d = F(u),
    f = (e) => {
      var t = Xg(),
        n = L(t, !0);
      (z(() => W(n, i())), U(e, t));
    };
  G(d, (e) => {
    i() && e(f);
  });
  var p = R(d, 2),
    m = F(p, !0),
    h = R(m),
    g = (e) => {
      var t = Zg(),
        r = L(t, !0);
      (z(() => W(r, n())), U(e, t));
    };
  (G(h, (e) => {
    n() && e(g);
  }),
    A(p),
    A(u));
  var _ = R(u, 2),
    v = (e) => {
      var n = Qg();
      (si(F(n), () => t.actions), A(n), U(e, n));
    };
  (G(_, (e) => {
    t.actions && e(v);
  }),
    A(l));
  var y = R(l, 2),
    b = (e) => {
      var n = Br();
      (si(I(n), () => t.apres), U(e, n));
    };
  (G(y, (e) => {
    t.apres && e(b);
  }),
    A(o),
    A(a),
    z(() => W(m, t.titre)),
    U(e, a),
    Je());
}
