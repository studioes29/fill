// Composant Visionneuse (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var $v = H(`<small class="svelte-1o3b2d4"> </small>`),
  ey = H(`<button class="bt sm ton remarquer svelte-1o3b2d4"><!><span class="sr">Ajouter une remarque</span></button>`),
  ty = H(
    `<div class="nav svelte-1o3b2d4"><button class="ico" aria-label="Livrable précédent"><!></button> <span class="num svelte-1o3b2d4"> </span> <button class="ico" aria-label="Livrable suivant"><!></button></div>`,
  ),
  ny = H(`<h1 class="svelte-1o3b2d4"> </h1>`),
  ry = H(`<p class="chapo svelte-1o3b2d4"> </p>`),
  iy = H(`<img alt="" class="svelte-1o3b2d4"/>`),
  ay = H(`<p class="svelte-1o3b2d4"> </p>`),
  oy = H(`<p class="appel svelte-1o3b2d4"> </p>`),
  sy = H(`<p class="sans svelte-1o3b2d4">Aperçu de la page ; le texte est dans l’image ci-dessus.</p>`),
  cy = H(
    `<div class="navigateur svelte-1o3b2d4"><div class="nav-t svelte-1o3b2d4"><i class="svelte-1o3b2d4"></i><i class="svelte-1o3b2d4"></i><i class="svelte-1o3b2d4"></i><span class="url svelte-1o3b2d4"> </span></div> <article class="article svelte-1o3b2d4"><p class="site svelte-1o3b2d4"> </p> <!> <!> <!> <!> <!> <!></article></div>`,
  ),
  ly = H(
    `<section class="svelte-1o3b2d4"><!><h2 class="svelte-1o3b2d4"> </h2><p class="svelte-1o3b2d4"> </p></section>`,
  ),
  uy = H(
    `<div class="l-tete svelte-1o3b2d4"><b class="svelte-1o3b2d4"> </b></div> <!> <!> <!> <p class="pied svelte-1o3b2d4">Vous recevez cette lettre car vous y êtes inscrit. Se désinscrire.</p>`,
    1,
  ),
  dy = H(
    `<div class="mail svelte-1o3b2d4"><div class="mail-h svelte-1o3b2d4"><span class="av svelte-1o3b2d4"> </span> <span class="svelte-1o3b2d4"><b class="svelte-1o3b2d4"> </b><small class="svelte-1o3b2d4"> </small></span></div> <div class="lettre svelte-1o3b2d4"><!></div></div>`,
  ),
  fy = H(`<div class="visuel-a-venir svelte-1o3b2d4">Visuel composé sur le gabarit à la livraison</div>`),
  py = H(`<span class="hash svelte-1o3b2d4"> </span>`),
  my = H(
    `<div class="insta svelte-1o3b2d4"><div class="ig-h svelte-1o3b2d4"><span class="av svelte-1o3b2d4"> </span><b class="svelte-1o3b2d4"> </b></div> <!> <p class="legende svelte-1o3b2d4"><b class="svelte-1o3b2d4"> </b> <!></p></div>`,
  ),
  hy = H(`<span class="lecture svelte-1o3b2d4"><!></span>`),
  gy = H(`<li class="svelte-1o3b2d4"> </li>`),
  _y = H(`<div class="textes svelte-1o3b2d4"><h3 class="svelte-1o3b2d4"> </h3><ol class="svelte-1o3b2d4"></ol></div>`),
  vy = H(`<div class="tel-bloc svelte-1o3b2d4"><div class="tel svelte-1o3b2d4"><!><!></div> <!></div>`),
  yy = H(
    `<figure class="page svelte-1o3b2d4"><img class="svelte-1o3b2d4"/><figcaption class="svelte-1o3b2d4"></figcaption></figure>`,
  ),
  by = H(`<h2 class="svelte-1o3b2d4"> </h2><p class="svelte-1o3b2d4"> </p>`, 1),
  xy = H(
    `<figure class="page texte svelte-1o3b2d4"><!> <!> <!> <!> <figcaption class="svelte-1o3b2d4">Textes du document</figcaption></figure>`,
  ),
  Sy = H(`<div class="pages svelte-1o3b2d4"><!> <!></div>`),
  Cy = H(`<img loading="lazy" class="svelte-1o3b2d4"/>`),
  wy = H(`<p class="leg-ph svelte-1o3b2d4"> </p>`),
  Ty = H(`<div class="planche svelte-1o3b2d4"></div> <!>`, 1),
  Ey = H(`<img class="affiche-img svelte-1o3b2d4" alt=""/>`),
  Dy = H(`<p class="gros svelte-1o3b2d4"> </p>`),
  Oy = H(`<p class="moyen svelte-1o3b2d4"> </p>`),
  ky = H(
    `<div class="textes svelte-1o3b2d4"><h3 class="svelte-1o3b2d4"> </h3> <!> <!> <ul class="svelte-1o3b2d4"></ul> <!></div>`,
  ),
  Ay = H(`<div class="affiche-bloc svelte-1o3b2d4"><!> <!></div>`),
  jy = H(`<div><!></div>`),
  My = H(
    `<aside class="notes svelte-1o3b2d4"><label class="champ" for="rq"><span>Vos remarques sur ce livrable</span> <textarea id="rq" class="saisie" rows="5" placeholder="Ex. Remplacer « salle polyvalente » par « salle des fêtes ». Un point par ligne."></textarea> <small> </small></label></aside>`,
  ),
  Ny = H(
    `<div class="liseuse svelte-1o3b2d4" role="dialog" aria-modal="true"><header class="barre svelte-1o3b2d4"><button class="ico" aria-label="Fermer la relecture"><!></button> <div class="qui svelte-1o3b2d4"><span class="pastille p-cible svelte-1o3b2d4"> </span><b class="svelte-1o3b2d4"> </b><!></div> <div class="outils svelte-1o3b2d4"><!> <button class="bt sm blanc svelte-1o3b2d4"><!><span class="txt-l svelte-1o3b2d4">Imprimer ou PDF</span></button> <!></div></header> <div class="cadre svelte-1o3b2d4"><div><!></div> <!></div></div>`,
  );
function Visionneuse(e, t) {
  qe(t, !0);
  let n = Ki(t, `index`, 31, () => -1),
    r = Ki(t, `remarques`, 31, () => en({})),
    i = Ki(t, `peutRemarquer`, 3, !1),
    a = Ki(t, `titre`, 3, ``),
    o = M(() => (n() >= 0 ? t.fichiers[Math.min(n(), t.fichiers.length - 1)] : null)),
    s = M(() =>
      B(o)
        ? (B(o).type ?? (/\.(mp4|mov)$/i.test(B(o).nom) ? `video` : /\.pdf$/i.test(B(o).nom) ? `pdf` : `visuel`))
        : `visuel`,
    ),
    c = {
      email: `Newsletter`,
      web: `Page du site`,
      post: `Publication`,
      story: `Story`,
      affiche: `Affiche`,
      visuel: `Visuel`,
      pdf: `Document`,
      video: `Vidéo`,
      photos: `Reportage`,
    },
    l = M(() => t.client.replace(/^(Commune|Ville) de /, ``)),
    u = M(() =>
      B(l)
        .toLowerCase()
        .normalize(`NFD`)
        .replace(/[̀-ͯ]/g, ``)
        .replace(/[^a-z0-9]+/g, ``),
    ),
    d = M(() =>
      B(l)
        .split(/[\s-]+/)
        .map((e) => e[0])
        .join(``)
        .slice(0, 2)
        .toUpperCase(),
    ),
    f = (e) => {
      n((n() + e + t.fichiers.length) % t.fichiers.length);
    },
    p = (e) => e.split(/(#[\p{L}\p{N}_]+)/u),
    m = (e) => e.pages ?? (e.src ? [e.src] : []),
    h = N(void 0);
  (wn(() => {
    if (n() < 0) return;
    let e = (e) => {
      e.target.closest(`textarea`) ||
        (e.key === `Escape` && n(-1), e.key === `ArrowRight` && f(1), e.key === `ArrowLeft` && f(-1));
    };
    return (
      addEventListener(`keydown`, e),
      (document.body.style.overflow = `hidden`),
      () => {
        (removeEventListener(`keydown`, e), (document.body.style.overflow = ``));
      }
    );
  }),
    wn(() => {
      (n(),
        B(h)?.scrollTo({
          top: 0,
        }));
    }));
  var g = Br(),
    _ = I(g),
    v = (e) => {
      var l = Ny(),
        g = F(l),
        _ = F(g);
      (Icone(F(_), {
        n: `non`,
      }),
        A(_));
      var v = R(_, 2),
        y = F(v),
        b = L(y, !0),
        x = R(y),
        S = L(x, !0),
        C = R(x),
        w = (e) => {
          var t = $v(),
            n = L(t, !0);
          (z(() => W(n, a())), U(e, t));
        };
      (G(C, (e) => {
        a() && e(w);
      }),
        A(v));
      var T = R(v, 2),
        ee = F(T),
        E = (e) => {
          var t = ey();
          (Icone(F(t), {
            n: `commentaire`,
            taille: 17,
          }),
            j(),
            A(t),
            V(`click`, t, () => {
              let e = document.getElementById(`rq`);
              (e?.scrollIntoView({
                behavior: `smooth`,
                block: `center`,
              }),
                e?.focus({
                  preventScroll: !0,
                }));
            }),
            U(e, t));
        };
      G(ee, (e) => {
        i() && e(E);
      });
      var te = R(ee, 2);
      (Icone(F(te), {
        n: `imprimer`,
        taille: 17,
      }),
        j(),
        A(te));
      var D = R(te, 2),
        ne = (e) => {
          var r = ty(),
            i = F(r);
          (Icone(F(i), {
            n: `retour`,
          }),
            A(i));
          var a = R(i, 2),
            o = L(a),
            s = R(a, 2);
          (Icone(F(s), {
            n: `suite`,
          }),
            A(s),
            A(r),
            z(() => W(o, `${n() + 1} / ${t.fichiers.length ?? ``}`)),
            V(`click`, i, () => f(-1)),
            V(`click`, s, () => f(1)),
            U(e, r));
        };
      (G(D, (e) => {
        t.fichiers.length > 1 && e(ne);
      }),
        A(T),
        A(g));
      var re = R(g, 2),
        ie = F(re);
      let ae;
      (Zr(
        F(ie),
        () => B(o).nom,
        (e) => {
          var n = jy(),
            r = F(n),
            i = (e) => {
              var n = cy(),
                r = F(n),
                i = L(R(F(r), 3), !0);
              A(r);
              var a = R(r, 2),
                s = F(a),
                c = L(s, !0),
                l = R(s, 2),
                d = (e) => {
                  var t = ny(),
                    n = L(t, !0);
                  (z(() => W(n, B(o).contenu.titre)), U(e, t));
                };
              G(l, (e) => {
                B(o).contenu?.titre && e(d);
              });
              var f = R(l, 2),
                p = (e) => {
                  var t = ry(),
                    n = L(t, !0);
                  (z(() => W(n, B(o).contenu.chapo)), U(e, t));
                };
              G(f, (e) => {
                B(o).contenu?.chapo && e(p);
              });
              var m = R(f, 2),
                h = (e) => {
                  var t = iy();
                  (z(() => J(t, `src`, B(o).src)), U(e, t));
                };
              G(m, (e) => {
                B(o).src && e(h);
              });
              var g = R(m, 2);
              K(
                g,
                17,
                () => B(o).contenu?.corps ?? [],
                Qr,
                (e, t) => {
                  var n = ay(),
                    r = L(n, !0);
                  (z(() => W(r, B(t))), U(e, n));
                },
              );
              var _ = R(g, 2),
                v = (e) => {
                  var t = oy(),
                    n = L(t, !0);
                  (z(() => W(n, B(o).contenu.appel)), U(e, t));
                };
              G(_, (e) => {
                B(o).contenu?.appel && e(v);
              });
              var y = R(_, 2),
                b = (e) => {
                  U(e, sy());
                };
              (G(y, (e) => {
                B(o).contenu || e(b);
              }),
                A(a),
                A(n),
                z(() => {
                  (W(i, B(o).legende ?? `${B(u)}.fr`), W(c, t.client));
                }),
                U(e, n));
            },
            a = (e) => {
              var n = dy(),
                r = F(n),
                i = F(r),
                a = L(i, !0),
                s = R(i, 2),
                c = F(s),
                l = L(c, !0),
                u = L(R(c));
              (A(s), A(r));
              var f = R(r, 2),
                p = F(f),
                m = (e) => {
                  var n = uy(),
                    r = I(n),
                    i = L(F(r), !0);
                  A(r);
                  var a = R(r, 2),
                    s = (e) => {
                      var t = ry(),
                        n = L(t, !0);
                      (z(() => W(n, B(o).contenu.chapo)), U(e, t));
                    };
                  G(a, (e) => {
                    B(o).contenu.chapo && e(s);
                  });
                  var c = R(a, 2);
                  K(
                    c,
                    17,
                    () => B(o).contenu.sections ?? [],
                    Qr,
                    (e, t) => {
                      var n = ly(),
                        r = F(n),
                        i = (e) => {
                          var n = iy();
                          (z(() => J(n, `src`, B(t).image)), U(e, n));
                        };
                      G(r, (e) => {
                        B(t).image && e(i);
                      });
                      var a = R(r),
                        o = L(a, !0),
                        s = L(R(a), !0);
                      (A(n),
                        z(() => {
                          (W(o, B(t).titre), W(s, B(t).texte));
                        }),
                        U(e, n));
                    },
                  );
                  var l = R(c, 2),
                    u = (e) => {
                      var t = oy(),
                        n = L(t, !0);
                      (z(() => W(n, B(o).contenu.appel)), U(e, t));
                    };
                  (G(l, (e) => {
                    B(o).contenu.appel && e(u);
                  }),
                    j(2),
                    z(() => W(i, B(o).contenu.titre ?? t.client)),
                    U(e, n));
                },
                h = (e) => {
                  var t = iy();
                  (z(() => J(t, `src`, B(o).src)), U(e, t));
                };
              (G(p, (e) => {
                B(o).contenu ? e(m) : B(o).src && e(h, 1);
              }),
                A(f),
                A(n),
                z(() => {
                  (W(a, B(d)),
                    W(l, t.client),
                    W(u, `Objet : ${B(o).legende ?? B(o).contenu?.titre ?? B(o).nom ?? ``}`));
                }),
                U(e, n));
            },
            c = (e) => {
              var t = my(),
                n = F(t),
                r = F(n),
                i = L(r, !0),
                a = L(R(r), !0);
              A(n);
              var s = R(n, 2),
                c = (e) => {
                  var t = iy();
                  (z(() => J(t, `src`, B(o).src)), U(e, t));
                },
                l = (e) => {
                  U(e, fy());
                };
              G(s, (e) => {
                B(o).src ? e(c) : e(l, -1);
              });
              var f = R(s, 2),
                m = F(f),
                h = L(m, !0);
              (K(
                R(m, 2),
                17,
                () =>
                  p(
                    B(o).legende ??
                      B(o).contenu?.corps?.join(`

`) ??
                      ``,
                  ),
                Qr,
                (e, t) => {
                  var n = Br(),
                    r = I(n),
                    i = (e) => {
                      var n = py(),
                        r = L(n, !0);
                      (z(() => W(r, B(t))), U(e, n));
                    },
                    a = M(() => B(t).startsWith(`#`)),
                    o = (e) => {
                      var n = zr();
                      (z(() => W(n, B(t))), U(e, n));
                    };
                  (G(r, (e) => {
                    B(a) ? e(i) : e(o, -1);
                  }),
                    U(e, n));
                },
              ),
                A(f),
                A(t),
                z(() => {
                  (W(i, B(d)), W(a, B(u)), W(h, B(u)));
                }),
                U(e, t));
            },
            l = (e) => {
              var t = vy(),
                n = F(t),
                r = F(n),
                i = (e) => {
                  var t = iy();
                  (z(() => J(t, `src`, B(o).src)), U(e, t));
                };
              G(r, (e) => {
                B(o).src && e(i);
              });
              var a = R(r),
                c = (e) => {
                  var t = hy();
                  (Icone(F(t), {
                    n: `lecture`,
                    taille: 24,
                  }),
                    A(t),
                    U(e, t));
                };
              (G(a, (e) => {
                B(s) === `video` && e(c);
              }),
                A(n));
              var l = R(n, 2),
                u = (e) => {
                  var t = _y(),
                    n = F(t),
                    r = L(n, !0),
                    i = R(n);
                  (K(
                    i,
                    21,
                    () => B(o).contenu.corps,
                    Qr,
                    (e, t) => {
                      var n = gy(),
                        r = L(n, !0);
                      (z(() => W(r, B(t))), U(e, n));
                    },
                  ),
                    A(i),
                    A(t),
                    z(() => W(r, B(s) === `video` ? (B(o).contenu.titre ?? `Sous-titres`) : `Textes de la story`)),
                    U(e, t));
                };
              (G(l, (e) => {
                B(o).contenu?.corps?.length && e(u);
              }),
                A(t),
                U(e, t));
            },
            f = (e) => {
              var t = Sy(),
                n = F(t);
              K(
                n,
                17,
                () => m(B(o)),
                Qr,
                (e, t, n) => {
                  var r = yy(),
                    i = F(r);
                  J(i, `alt`, `Page ${n + 1}`);
                  var a = R(i);
                  ((a.textContent = `Page ${n + 1}`), A(r), z(() => J(i, `src`, B(t))), U(e, r));
                },
              );
              var r = R(n, 2),
                i = (e) => {
                  var t = xy(),
                    n = F(t),
                    r = (e) => {
                      var t = ny(),
                        n = L(t, !0);
                      (z(() => W(n, B(o).contenu.titre)), U(e, t));
                    };
                  G(n, (e) => {
                    B(o).contenu.titre && e(r);
                  });
                  var i = R(n, 2),
                    a = (e) => {
                      var t = ry(),
                        n = L(t, !0);
                      (z(() => W(n, B(o).contenu.chapo)), U(e, t));
                    };
                  G(i, (e) => {
                    B(o).contenu.chapo && e(a);
                  });
                  var s = R(i, 2);
                  (K(
                    s,
                    17,
                    () => B(o).contenu.corps ?? [],
                    Qr,
                    (e, t) => {
                      var n = ay(),
                        r = L(n, !0);
                      (z(() => W(r, B(t))), U(e, n));
                    },
                  ),
                    K(
                      R(s, 2),
                      17,
                      () => B(o).contenu.sections ?? [],
                      Qr,
                      (e, t) => {
                        var n = by(),
                          r = I(n),
                          i = L(r, !0),
                          a = L(R(r), !0);
                        (z(() => {
                          (W(i, B(t).titre), W(a, B(t).texte));
                        }),
                          U(e, n));
                      },
                    ),
                    j(2),
                    A(t),
                    U(e, t));
                };
              (G(r, (e) => {
                (B(o).contenu?.sections || B(o).contenu?.corps) && e(i);
              }),
                A(t),
                U(e, t));
            },
            h = (e) => {
              var t = Ty(),
                n = I(t);
              (K(
                n,
                21,
                () => B(o).srcs ?? [],
                Qr,
                (e, t, n) => {
                  var r = Cy();
                  (J(r, `alt`, `Photo ${n + 1}`), z(() => J(r, `src`, B(t))), U(e, r));
                },
              ),
                A(n));
              var r = R(n, 2),
                i = (e) => {
                  var t = wy(),
                    n = L(t, !0);
                  (z(() => W(n, B(o).legende)), U(e, t));
                };
              (G(r, (e) => {
                B(o).legende && e(i);
              }),
                U(e, t));
            },
            g = (e) => {
              var t = Ay(),
                n = F(t),
                r = (e) => {
                  var t = Ey();
                  (z(() => J(t, `src`, B(o).src)), U(e, t));
                };
              G(n, (e) => {
                B(o).src && e(r);
              });
              var i = R(n, 2),
                a = (e) => {
                  var t = ky(),
                    n = F(t),
                    r = L(n),
                    i = R(n, 2),
                    a = (e) => {
                      var t = Dy(),
                        n = L(t, !0);
                      (z(() => W(n, B(o).contenu.titre)), U(e, t));
                    };
                  G(i, (e) => {
                    B(o).contenu.titre && e(a);
                  });
                  var c = R(i, 2),
                    l = (e) => {
                      var t = Oy(),
                        n = L(t, !0);
                      (z(() => W(n, B(o).contenu.chapo)), U(e, t));
                    };
                  G(c, (e) => {
                    B(o).contenu.chapo && e(l);
                  });
                  var u = R(c, 2);
                  (K(
                    u,
                    21,
                    () => B(o).contenu.corps ?? [],
                    Qr,
                    (e, t) => {
                      var n = gy(),
                        r = L(n, !0);
                      (z(() => W(r, B(t))), U(e, n));
                    },
                  ),
                    A(u));
                  var d = R(u, 2),
                    f = (e) => {
                      var t = Oy(),
                        n = L(t, !0);
                      (z(() => W(n, B(o).contenu.appel)), U(e, t));
                    };
                  (G(d, (e) => {
                    B(o).contenu.appel && e(f);
                  }),
                    A(t),
                    z(() => W(r, `Textes ${B(s) === `affiche` ? `de l’affiche` : `du visuel`}`)),
                    U(e, t));
                };
              (G(i, (e) => {
                B(o).contenu && e(a);
              }),
                A(t),
                U(e, t));
            };
          (G(r, (e) => {
            B(s) === `web`
              ? e(i)
              : B(s) === `email`
                ? e(a, 1)
                : B(s) === `post`
                  ? e(c, 2)
                  : B(s) === `story` || B(s) === `video`
                    ? e(l, 3)
                    : B(s) === `pdf`
                      ? e(f, 4)
                      : B(s) === `photos`
                        ? e(h, 5)
                        : e(g, -1);
          }),
            A(n),
            z(() => q(n, 1, `rendu ${B(s) ?? ``}`, `svelte-1o3b2d4`)),
            U(e, n));
        },
      ),
        A(ie));
      var oe = R(ie, 2),
        se = (e) => {
          var t = My(),
            n = F(t),
            a = R(F(n), 2);
          at(a);
          var s = L(R(a, 2), !0);
          (A(n),
            A(t),
            z(() => {
              ((a.readOnly = !i()),
                W(s, i() ? `Gardées ici et reprises dans votre demande de correction.` : `Remarques du client.`));
            }),
            Ii(
              a,
              () => r()[B(o).nom],
              (e) => r((r()[B(o).nom] = e), !0),
            ),
            U(e, t));
        };
      (G(oe, (e) => {
        (i() || r()[B(o).nom]) && e(se);
      }),
        A(re),
        Vi(
          re,
          (e) => P(h, e),
          () => B(h),
        ),
        A(l),
        z(() => {
          (J(l, `aria-label`, `Relecture de ${B(o).nom ?? ``}`),
            W(b, c[B(s)]),
            W(S, B(o).nom),
            (ae = q(ie, 1, `document svelte-1o3b2d4`, null, ae, {
              "avec-notes": i() || r()[B(o).nom],
            })));
        }),
        V(`click`, _, () => n(-1)),
        V(`click`, te, () => print()),
        U(e, l));
    };
  (G(_, (e) => {
    B(o) && e(v);
  }),
    U(e, g),
    Je());
}
kr([`click`]);
