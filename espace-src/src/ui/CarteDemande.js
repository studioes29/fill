// Composant CarteDemande (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Wg = H(`<span class="client svelte-3vm8hd"> </span>`),
  Gg = H(`<span class="urg svelte-3vm8hd"><!>Urgente</span>`),
  Kg = H(`<span><!> </span>`),
  qg = H(
    `<a class="ligne svelte-3vm8hd"><span class="corps svelte-3vm8hd"><span class="titre svelte-3vm8hd"> </span> <span class="meta svelte-3vm8hd"><!> <span class="presta svelte-3vm8hd"> </span> <!></span></span> <span class="cote svelte-3vm8hd"><!> <span class="quand num svelte-3vm8hd"><!></span></span> <span class="fl svelte-3vm8hd" aria-hidden="true"><!></span></a>`,
  );
function CarteDemande(e, t) {
  qe(t, !0);
  let n = M(estEquipe),
    r = M(() => (B(n) ? alerteRetard(t.d, aujourdhui(), etat.d.fermetures) : null)),
    i = M(() => (B(r) === `livraison_depassee` ? joursDeRetard(t.d, aujourdhui(), etat.d.fermetures) : 0)),
    a = M(() => organisation(t.d.organisationId)),
    o = M(() =>
      t.d.livraison && ![`livree`, `annulee`, `a_valider`, `validee`].includes(t.d.statut)
        ? `Livraison ${jourMois(t.d.livraison)}`
        : t.d.statut === `a_valider`
          ? `Version ${t.d.versions.length} livrée`
          : t.d.unites === null
            ? ``
            : `${t.d.unites} unité${t.d.unites > 1 ? `s` : ``}`,
    );
  var s = qg(),
    c = F(s),
    l = F(c),
    u = L(l, !0),
    d = R(l, 2),
    f = F(d),
    p = (e) => {
      var t = Wg(),
        n = L(t, !0);
      (z(() => {
        (J(t, `data-type`, B(a).type), W(n, B(a).nom));
      }),
        U(e, t));
    };
  G(f, (e) => {
    B(n) && e(p);
  });
  var m = R(f, 2),
    h = L(m, !0),
    g = R(m, 2),
    _ = (e) => {
      var t = Gg();
      (Icone(F(t), {
        n: `eclair`,
        taille: 13,
      }),
        j(),
        A(t),
        U(e, t));
    };
  (G(g, (e) => {
    t.d.urgente && e(_);
  }),
    A(d),
    A(c));
  var v = R(c, 2),
    y = F(v);
  {
    let e = M(() => !B(n));
    FilEtat(y, {
      get s() {
        return t.d.statut;
      },
      get client() {
        return B(e);
      },
      taille: `sm`,
    });
  }
  var b = R(y, 2),
    x = F(b),
    S = (e) => {
      var t = Kg();
      let n;
      var a = F(t);
      Icone(a, {
        n: `horloge`,
        taille: 14,
      });
      var o = R(a, 1, !0);
      (A(t),
        z(() => {
          ((n = q(t, 1, `delai`, null, n, {
            grave: B(r) === `livraison_depassee` || B(r) === `confirmation_en_retard`,
          })),
            W(
              o,
              B(r) === `livraison_depassee` ? `${B(i)} jour${B(i) > 1 ? `s` : ``} de retard` : LIBELLES_ALERTE[B(r)],
            ));
        }),
        U(e, t));
    },
    C = (e) => {
      var t = zr();
      (z(() => W(t, B(o))), U(e, t));
    };
  (G(x, (e) => {
    B(r) ? e(S) : e(C, -1);
  }),
    A(b),
    A(v));
  var w = R(v, 2);
  (Icone(F(w), {
    n: `ar`,
    taille: 16,
  }),
    A(w),
    A(s),
    z(
      (e, n) => {
        (J(s, `href`, e), W(u, t.d.titre), W(h, n));
      },
      [() => lienRoute(`demande-${t.d.id}`), () => resumeLignes(t.d.lignes)],
    ),
    U(e, s),
    Je());
}
