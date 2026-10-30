// Composant Livrable (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Fy = H(`<b class="svelte-1u77olj"> </b>`),
  Iy = H(`<div class="texte-ap svelte-1u77olj"><!> <p class="svelte-1u77olj"> </p></div>`),
  Ly = H(`<img alt="" loading="lazy" class="svelte-1u77olj"/>`),
  Ry = H(
    `<div class="mail svelte-1u77olj"><div class="mail-t svelte-1u77olj"><span class="pt svelte-1u77olj"></span><span class="pt svelte-1u77olj"></span><span class="pt svelte-1u77olj"></span><b class="svelte-1u77olj">Boîte de réception</b></div> <div class="mail-h svelte-1u77olj"><span class="av svelte-1u77olj"> </span><span class="svelte-1u77olj"><b class="svelte-1u77olj"> </b><small class="svelte-1u77olj"> </small></span></div> <!></div>`,
  ),
  zy = H(
    `<div class="nav svelte-1u77olj"><div class="nav-t svelte-1u77olj"><span class="pt svelte-1u77olj"></span><span class="pt svelte-1u77olj"></span><span class="pt svelte-1u77olj"></span><span class="url svelte-1u77olj"> </span></div> <!></div>`,
  ),
  By = H(`<p class="ig-l svelte-1u77olj"><b class="svelte-1u77olj"> </b> </p>`),
  Vy = H(
    `<div class="insta svelte-1u77olj"><div class="ig-h svelte-1u77olj"><span class="av svelte-1u77olj"> </span><b class="svelte-1u77olj"> </b><span class="pts svelte-1u77olj">···</span></div> <!> <div class="ig-a svelte-1u77olj" aria-hidden="true"><svg viewBox="0 0 24 24" class="svelte-1u77olj"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg><svg viewBox="0 0 24 24" class="svelte-1u77olj"><path d="M20 12a8 8 0 1 1-3.3-6.5L20 4l-1 4"></path></svg><svg viewBox="0 0 24 24" class="svelte-1u77olj"><path d="M4 12l16-8-6 16-2-6z"></path></svg></div> <!></div>`,
  ),
  Hy = H(`<span class="lecture svelte-1u77olj"><!></span><span class="duree num svelte-1u77olj"> </span>`, 1),
  Uy = H(`<div class="tel svelte-1u77olj"><!> <!></div>`),
  Wy = H(
    `<div class="pdf svelte-1u77olj"><span class="page p3 svelte-1u77olj"></span><span class="page p2 svelte-1u77olj"></span> <span class="page p1 svelte-1u77olj"><!></span></div>`,
  ),
  Gy = H(`<b class="plus svelte-1u77olj"> </b>`),
  Ky = H(`<span class="ph svelte-1u77olj"><img alt="" loading="lazy" class="svelte-1u77olj"/><!></span>`),
  qy = H(`<div class="planche svelte-1u77olj"></div>`),
  Jy = H(`<div class="mur svelte-1u77olj"><!></div>`),
  Yy = H(`<span class="pastille p-cor svelte-1u77olj"><!>Remarque</span>`),
  Xy = H(
    `<figure><button type="button" class="cadre svelte-1u77olj"><!> <span class="agrandir svelte-1u77olj" aria-hidden="true"><!>Lire en entier</span></button> <figcaption class="svelte-1u77olj"><span class="pastille p-blanc svelte-1u77olj"> </span> <span class="nom svelte-1u77olj"> </span> <!></figcaption></figure>`,
  );
function Livrable(e, t) {
  qe(t, !0);
  let n = Ki(t, `remarque`, 3, !1),
    r = M(() => t.f.type ?? (/\.(mp4|mov)$/i.test(t.f.nom) ? `video` : /\.pdf$/i.test(t.f.nom) ? `pdf` : `visuel`)),
    i = M(() =>
      t.client
        .replace(/^(Commune|Ville) de /, ``)
        .split(/\s+/)
        .map((e) => e[0])
        .join(``)
        .slice(0, 2)
        .toUpperCase(),
    ),
    a = M(() =>
      t.client
        .replace(/^(Commune|Ville) de /, ``)
        .toLowerCase()
        .replace(/\s+/g, ``),
    ),
    o = {
      email: `Newsletter`,
      web: `Page du site`,
      post: `Publication`,
      story: `Story`,
      affiche: `Affiche`,
      visuel: `Visuel`,
      pdf: `Document`,
      video: `Vidéo`,
      photos: `Reportage`,
    };
  var s = Xy(),
    c = F(s),
    l = F(c),
    u = (e) => {
      var n = Iy(),
        r = F(n),
        i = (e) => {
          var n = Fy(),
            r = L(n, !0);
          (z(() => W(r, t.f.contenu.titre)), U(e, n));
        };
      G(r, (e) => {
        t.f.contenu.titre && e(i);
      });
      var a = L(R(r, 2), !0);
      (A(n),
        z(() => W(a, t.f.contenu.chapo ?? t.f.legende ?? t.f.contenu.corps?.[0] ?? t.f.contenu.sections?.[0]?.texte)),
        U(e, n));
    },
    d = (e) => {
      var n = Ry(),
        r = R(F(n), 2),
        a = F(r),
        o = L(a, !0),
        s = R(a),
        c = F(s),
        l = L(c, !0),
        u = L(R(c), !0);
      (A(s), A(r));
      var d = R(r, 2),
        f = (e) => {
          var n = Ly();
          (z(() => J(n, `src`, t.f.src)), U(e, n));
        };
      (G(d, (e) => {
        t.f.src && e(f);
      }),
        A(n),
        z(() => {
          (W(o, B(i)), W(l, t.client), W(u, t.f.legende ?? t.f.nom));
        }),
        U(e, n));
    },
    f = (e) => {
      var n = zy(),
        r = F(n),
        i = L(R(F(r), 3), !0);
      A(r);
      var a = R(r, 2),
        o = (e) => {
          var n = Ly();
          (z(() => J(n, `src`, t.f.src)), U(e, n));
        };
      (G(a, (e) => {
        t.f.src && e(o);
      }),
        A(n),
        z(() => W(i, t.f.legende ?? t.f.nom)),
        U(e, n));
    },
    p = (e) => {
      var n = Vy(),
        r = F(n),
        o = F(r),
        s = L(o, !0),
        c = L(R(o), !0);
      (j(), A(r));
      var l = R(r, 2),
        u = (e) => {
          var n = Ly();
          (z(() => J(n, `src`, t.f.src)), U(e, n));
        };
      G(l, (e) => {
        t.f.src && e(u);
      });
      var d = R(l, 4),
        f = (e) => {
          var n = By(),
            r = F(n),
            i = L(r, !0),
            o = R(r);
          (A(n),
            z(() => {
              (W(i, B(a)), W(o, ` ${t.f.legende ?? ``}`));
            }),
            U(e, n));
        };
      (G(d, (e) => {
        t.f.legende && e(f);
      }),
        A(n),
        z(() => {
          (W(s, B(i)), W(c, B(a)));
        }),
        U(e, n));
    },
    m = (e) => {
      var n = Uy(),
        i = F(n),
        a = (e) => {
          var n = Ly();
          (z(() => J(n, `src`, t.f.src)), U(e, n));
        };
      G(i, (e) => {
        t.f.src && e(a);
      });
      var o = R(i, 2),
        s = (e) => {
          var n = Hy(),
            r = I(n);
          (Icone(F(r), {
            n: `lecture`,
            taille: 22,
          }),
            A(r));
          var i = L(R(r), !0);
          (z((e) => W(i, e), [() => (t.f.legende ?? ``).split(`·`)[0]]), U(e, n));
        };
      (G(o, (e) => {
        B(r) === `video` && e(s);
      }),
        A(n),
        U(e, n));
    },
    h = (e) => {
      var n = Wy(),
        r = R(F(n), 3),
        i = F(r),
        a = (e) => {
          var n = Ly();
          (z(() => J(n, `src`, t.f.src)), U(e, n));
        };
      (G(i, (e) => {
        t.f.src && e(a);
      }),
        A(r),
        A(n),
        U(e, n));
    },
    g = (e) => {
      var n = qy();
      (K(
        n,
        21,
        () => (t.f.srcs ?? []).slice(0, 4),
        Qr,
        (e, n, r) => {
          var i = Ky();
          yi(
            i,
            ``,
            {},
            {
              "--k": r,
            },
          );
          var a = F(i),
            o = R(a),
            s = (e) => {
              var n = Gy(),
                r = L(n);
              (z((e) => W(r, `+${e ?? ``}`), [() => Number((t.f.legende ?? ``).match(/^(\d+)/)[1]) - 4]), U(e, n));
            },
            c = M(() => r === 3 && (t.f.legende ?? ``).match(/^(\d+)/));
          (G(o, (e) => {
            B(c) && e(s);
          }),
            A(i),
            z(() => J(a, `src`, B(n))),
            U(e, i));
        },
      ),
        A(n),
        U(e, n));
    },
    _ = (e) => {
      var n = Jy(),
        r = F(n),
        i = (e) => {
          var n = Ly();
          (z(() => J(n, `src`, t.f.src)), U(e, n));
        };
      (G(r, (e) => {
        t.f.src && e(i);
      }),
        A(n),
        U(e, n));
    };
  G(l, (e) => {
    !t.f.src && !t.f.srcs?.length && t.f.contenu
      ? e(u)
      : B(r) === `email`
        ? e(d, 1)
        : B(r) === `web`
          ? e(f, 2)
          : B(r) === `post`
            ? e(p, 3)
            : B(r) === `story` || B(r) === `video`
              ? e(m, 4)
              : B(r) === `pdf`
                ? e(h, 5)
                : B(r) === `photos`
                  ? e(g, 6)
                  : e(_, -1);
  });
  var v = R(l, 2);
  (Icone(F(v), {
    n: `lire`,
    taille: 16,
  }),
    j(),
    A(v),
    A(c));
  var y = R(c, 2),
    b = F(y),
    x = L(b, !0),
    S = R(b, 2),
    C = L(S, !0),
    w = R(S, 2),
    T = (e) => {
      var t = Yy();
      (Icone(F(t), {
        n: `commentaire`,
        taille: 13,
      }),
        j(),
        A(t),
        U(e, t));
    };
  (G(w, (e) => {
    n() && e(T);
  }),
    A(y),
    A(s),
    z(() => {
      (q(s, 1, `liv ${B(r) ?? ``}`, `svelte-1u77olj`),
        J(c, `aria-label`, `Relire ${t.f.nom ?? ``} en entier`),
        W(x, o[B(r)]),
        W(C, t.f.nom));
    }),
    V(`click`, c, function (...e) {
      t.ouvrir?.apply(this, e);
    }),
    U(e, s),
    Je());
}
kr([`click`]);
