// Composant App (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var mw = H(
    `<div class="chargement svelte-1n46o8q" role="status"><!><span class="sr svelte-1n46o8q">Chargement</span></div>`,
  ),
  hw = H(`<span class="pt-n num svelte-1n46o8q"> </span>`),
  gw = H(`<button class="cloche svelte-1n46o8q"><!><!></button>`),
  _w = H(`<a class="bt plein nouv svelte-1n46o8q"><!>Nouvelle demande</a>`),
  vw = H(`<span class="badge num svelte-1n46o8q"> </span>`),
  yw = H(
    `<li class="svelte-1n46o8q"><a class="lien-nav svelte-1n46o8q"><!><span class="lib svelte-1n46o8q"> </span> <!></a></li>`,
  ),
  bw = H(
    `<a class="lien-pied svelte-1n46o8q"><!>Équipe</a> <a class="lien-pied svelte-1n46o8q"><!>Vos comptes<!></a> <button class="lien-pied svelte-1n46o8q"><!>Comment ça marche</button>`,
    1,
  ),
  xw = H(`<button class="lien-pied svelte-1n46o8q"><!>Quitter la démonstration</button>`),
  Sw = H(`<button class="lien-pied svelte-1n46o8q"><!> </button>`),
  Cw = H(`<button class="lien-pied discret svelte-1n46o8q">Remettre la démonstration à zéro</button>`),
  ww = H(
    `<div class="menu-m svelte-1n46o8q" role="dialog" aria-label="Compte"><div class="moi svelte-1n46o8q"><span class="av svelte-1n46o8q" aria-hidden="true"> </span><span class="svelte-1n46o8q"><b class="svelte-1n46o8q"> </b><small class="svelte-1n46o8q"> </small></span></div> <!> <!> <!></div> <button class="voile svelte-1n46o8q" aria-label="Fermer le menu"></button>`,
    1,
  ),
  Tw = H(
    `<li><a class="svelte-1n46o8q"><i></i><span class="svelte-1n46o8q"><b class="svelte-1n46o8q"> </b><small class="svelte-1n46o8q"> </small></span></a></li>`,
  ),
  Ew = H(`<ol class="svelte-1n46o8q"></ol>`),
  Dw = H(
    `<p class="mu petit svelte-1n46o8q">Rien de nouveau. Vous serez prévenu ici à chaque étape de vos demandes.</p>`,
  ),
  Ow = H(
    `<div class="notifs svelte-1n46o8q" role="dialog" aria-label="Notifications"><div class="n-tete svelte-1n46o8q"><h2 class="t3 svelte-1n46o8q">Notifications</h2><button class="lien-discret svelte-1n46o8q">Tout marquer comme lu</button></div> <!></div> <button class="voile svelte-1n46o8q" aria-label="Fermer les notifications"></button>`,
    1,
  ),
  kw = H(
    `<div class="bandeau-demo svelte-1n46o8q"><span class="svelte-1n46o8q"><b class="svelte-1n46o8q">Démonstration</b> : données fictives, rien n’est envoyé à Fill.</span><button class="bt sm svelte-1n46o8q">Créer mon espace</button><button class="lien-discret svelte-1n46o8q">Quitter</button></div>`,
  ),
  Aw = H(`<div class="page svelte-1n46o8q"><!></div>`),
  jw = H(`<a><span class="ic svelte-1n46o8q"><!><!></span> <span class="lib svelte-1n46o8q"> </span></a>`),
  Mw = H(
    `<a class="evite svelte-1n46o8q" href="#contenu">Aller au contenu</a> <div class="app svelte-1n46o8q"><aside class="lateral svelte-1n46o8q" aria-label="Navigation"><a class="marque svelte-1n46o8q" aria-label="Fill, accueil"><!></a> <div class="client-l svelte-1n46o8q"><p class="client svelte-1n46o8q"> </p> <!></div> <!> <nav class="svelte-1n46o8q"><ul class="svelte-1n46o8q"></ul></nav> <div class="pied svelte-1n46o8q"><div class="moi svelte-1n46o8q"><span class="av svelte-1n46o8q" aria-hidden="true"> </span><span class="svelte-1n46o8q"><b class="svelte-1n46o8q"> </b><small class="svelte-1n46o8q"> </small></span></div> <!> <!> <!></div></aside> <header class="barre-mobile svelte-1n46o8q"><a aria-label="Fill, accueil" class="svelte-1n46o8q"><!></a> <span class="client-m svelte-1n46o8q"> </span> <div class="b-droite svelte-1n46o8q"><!> <button class="av svelte-1n46o8q"> </button></div></header> <!> <!> <main class="contenu svelte-1n46o8q" id="contenu" tabindex="-1"><!> <!></main> <nav class="onglets svelte-1n46o8q" aria-label="Navigation"><div class="rail svelte-1n46o8q"><span aria-hidden="true"></span> <!></div></nav></div> <!>`,
    1,
  ),
  Nw = H(`<!> <!> <!>`, 1);
function App(e, t) {
  (qe(t, !0), demarrer());
  let n = M(moi),
    r = M(() => (B(n)?.organisationId ? organisation(B(n).organisationId) : null)),
    i = M(() => B(n)?.role === `admin` || B(n)?.role === `producteur`);
  wn(() => {
    document.documentElement.dataset.cible = B(r)?.type === `entreprise` ? `e` : `c`;
  });
  let a = M(
      () =>
        mesDemandes().filter(
          (e) => attendClient(e.statut) && (B(n)?.role === `referent` || e.statut === `attente_client`),
        ).length,
    ),
    o = M(() =>
      B(i)
        ? etat.d.demandes.filter(
            (e) =>
              e.statut === `deposee` ||
              [`confirmation_en_retard`, `livraison_depassee`].includes(
                alerteRetard(e, aujourdhui(), etat.d.fermetures) ?? ``,
              ),
          ).length
        : 0,
    ),
    s = M(() =>
      B(i)
        ? [
            {
              id: `production`,
              nom: `Production`,
              ic: `production`,
              badge: B(o),
            },
            {
              id: `calendrier`,
              nom: `Calendrier`,
              ic: `calendrier`,
              badge: 0,
            },
            {
              id: `pilotage`,
              nom: `Pilotage`,
              ic: `pilotage`,
              badge:
                etat.d.organisations.filter((e) => e.statut === `a_activer` && e.type === `collectivite`).length +
                etat.d.commandes.filter((e) => e.statut === `a_valider`).length +
                etat.d.organisations.reduce((e, t) => e + etatAcces(t.acces).enVerif, 0),
            },
            {
              id: `demandes`,
              nom: `Demandes`,
              ic: `demandes`,
              badge: 0,
            },
          ]
        : [
            {
              id: `accueil`,
              nom: `Accueil`,
              ic: `accueil`,
              badge: 0,
            },
            {
              id: `demandes`,
              nom: `Demandes`,
              ic: `demandes`,
              badge: B(a),
            },
            ...(B(n)?.role === `lecteur`
              ? []
              : [
                  {
                    id: `nouvelle`,
                    nom: `Nouvelle`,
                    ic: `plus`,
                    badge: 0,
                  },
                ]),
            {
              id: `unites`,
              nom: `Unités`,
              ic: `unites`,
              badge: 0,
            },
            {
              id: `calendrier`,
              nom: `Calendrier`,
              ic: `calendrier`,
              badge: 0,
            },
          ],
    ),
    c = M(() => {
      let e = route.nom;
      return e.startsWith(`demande-`)
        ? `fiche`
        : e.startsWith(`modifier-`)
          ? `modifier`
          : ((e === `equipe` || e === `comptes`) && !B(i)) || B(s).some((t) => t.id === e)
            ? e
            : B(i)
              ? `production`
              : `accueil`;
    }),
    l = M(() => (!B(i) && B(n)?.role === `referent` && B(r) ? etatAcces(B(r).acces).aDonner : 0)),
    u = M(() => (B(c) === `fiche` || B(c) === `modifier` ? (B(i) ? `production` : `demandes`) : B(c))),
    d = M(() =>
      B(n)
        ? B(n)
            .nom.split(` `)
            .map((e) => e[0])
            .join(``)
            .slice(0, 2)
        : ``,
    ),
    f = M(() =>
      B(n)
        ? {
            admin: `Production Fill`,
            producteur: `Production`,
            referent: `Référent`,
            contributeur: `Contributeur`,
            lecteur: `Lecture seule`,
          }[B(n).role]
        : ``,
    ),
    p = N(!1),
    m = N(!1);
  wn(() => {
    (etat.moiId, lireNotificationsVues());
  });
  let h = M(() => (B(i) ? [] : notifications())),
    g = M(() => B(h).filter((e) => e.date > notificationsVues.depuis).length),
    _ = () => {
      (P(m, !B(m)), P(p, !1));
    },
    v = () => {
      (P(m, !1), marquerNotificationsVues());
    },
    y = async () => {
      (P(p, !1), await seDeconnecter(), (location.hash = ``));
    };
  (wn(() => {
    let e = (e) => {
      let t = e.target.closest(`.bt,.choix,.filtre,.carte-lien,.ligne`);
      if (!t || t.matches(`:disabled`)) return;
      let n = t.getBoundingClientRect(),
        r = document.createElement(`span`);
      r.className = `onde`;
      let i = Math.max(n.width, n.height) * 2.2;
      (Object.assign(r.style, {
        left: `${e.clientX - n.left}px`,
        top: `${e.clientY - n.top}px`,
        width: `${i}px`,
        height: `${i}px`,
      }),
        getComputedStyle(t).position === `static` && (t.style.position = `relative`),
        t.appendChild(r),
        r.addEventListener(`animationend`, () => r.remove()));
    };
    return (addEventListener(`pointerdown`, e), () => removeEventListener(`pointerdown`, e));
  }),
    wn(() => {
      (route.nom, P(p, !1), P(m, !1));
    }),
    wn(() => {
      etat.pret &&
        B(n) &&
        (route.nom === `paiement-ok`
          ? ((location.hash = `#accueil`),
            feter({
              motif: `commande`,
              titre: `Paiement reçu`,
              detail: `Merci. Vos unités apparaissent dans votre espace d’ici quelques secondes.`,
              actions: [
                {
                  libelle: `Continuer`,
                  principal: !0,
                },
              ],
            }),
            MODE_REEL && [3e3, 8e3, 16e3].forEach((e) => setTimeout(() => recharger().catch(() => null), e)))
          : route.nom === `paiement-annule` &&
            ((location.hash = `#accueil`), toast(`Paiement annulé : rien n’a été débité.`, `info`)));
    }));
  var b = Nw();
  ci(`1n46o8q`, (e) => {
    On(() => {
      an.title = `Espace Fill`;
    });
  });
  var x = I(b),
    S = (e) => {
      var t = mw();
      (Logo(F(t), {
        hauteur: 44,
        anime: !0,
      }),
        j(),
        A(t),
        U(e, t));
    },
    C = (e) => {
      NouveauMotDePasse(e, {});
    },
    w = (e) => {
      var t = Br(),
        n = I(t),
        r = (e) => {
          Ouverture(e, {});
        },
        i = (e) => {
          Connexion(e, {});
        };
      (G(n, (e) => {
        route.nom === `ouverture` || etat.sessionSansProfil ? e(r) : e(i, -1);
      }),
        U(e, t));
    },
    T = (e) => {
      var t = Mw(),
        a = I(t),
        o = R(a, 2),
        b = F(o),
        x = F(b);
      (Logo(F(x), {
        hauteur: 34,
        anime: !0,
      }),
        A(x));
      var S = R(x, 2),
        C = F(S),
        w = L(C, !0),
        T = R(C, 2),
        ee = (e) => {
          var t = gw(),
            n = F(t);
          Icone(n, {
            n: `cloche`,
            taille: 20,
          });
          var r = R(n),
            i = (e) => {
              var t = Br();
              (Zr(
                I(t),
                () => B(g),
                (e) => {
                  var t = hw(),
                    n = L(t, !0);
                  (z(() => W(n, B(g))), U(e, t));
                },
              ),
                U(e, t));
            };
          (G(r, (e) => {
            B(g) && e(i);
          }),
            A(t),
            z(() => {
              (J(t, `aria-expanded`, B(m)), J(t, `aria-label`, `Notifications${B(g) ? `, ${B(g)} nouvelles` : ``}`));
            }),
            V(`click`, t, _),
            U(e, t));
        };
      (G(T, (e) => {
        B(i) || e(ee);
      }),
        A(S));
      var E = R(S, 2),
        te = (e) => {
          var t = _w();
          (Icone(F(t), {
            n: `plus`,
            taille: 18,
          }),
            j(),
            A(t),
            z(
              (e) => {
                (J(t, `href`, e), J(t, `aria-current`, B(u) === `nouvelle` ? `page` : void 0));
              },
              [() => lienRoute(`nouvelle`)],
            ),
            U(e, t));
        },
        D = M(() => B(s).some((e) => e.id === `nouvelle`));
      G(E, (e) => {
        B(D) && e(te);
      });
      var ne = R(E, 2),
        re = F(ne);
      (K(
        re,
        21,
        () => B(s).filter((e) => e.id !== `nouvelle`),
        (e) => e.id,
        (e, t) => {
          var n = yw(),
            r = F(n),
            i = F(r);
          Icone(i, {
            get n() {
              return B(t).ic;
            },
            taille: 20,
          });
          var a = R(i),
            o = L(a, !0),
            s = R(a, 2),
            c = (e) => {
              var n = Br();
              (Zr(
                I(n),
                () => B(t).badge,
                (e) => {
                  var n = vw(),
                    r = L(n, !0);
                  (z(() => {
                    (J(n, `aria-label`, `${B(t).badge ?? ``} à traiter`), W(r, B(t).badge));
                  }),
                    U(e, n));
                },
              ),
                U(e, n));
            };
          (G(s, (e) => {
            B(t).badge && e(c);
          }),
            A(r),
            A(n),
            z(
              (e) => {
                (J(r, `href`, e), J(r, `aria-current`, B(u) === B(t).id ? `page` : void 0), W(o, B(t).nom));
              },
              [() => lienRoute(B(t).id)],
            ),
            U(e, n));
        },
      ),
        A(re),
        A(ne));
      var ie = R(ne, 2),
        ae = F(ie),
        oe = F(ae),
        se = L(oe, !0),
        ce = R(oe),
        le = F(ce),
        ue = L(le, !0),
        de = L(R(le), !0);
      (A(ce), A(ae));
      var fe = R(ae, 2),
        pe = (e) => {
          var t = bw(),
            n = I(t);
          (Icone(F(n), {
            n: `clients`,
            taille: 17,
          }),
            j(),
            A(n));
          var r = R(n, 2),
            i = F(r);
          Icone(i, {
            n: `cle`,
            taille: 17,
          });
          var a = R(i, 2),
            o = (e) => {
              var t = vw(),
                n = L(t, !0);
              (z(() => {
                (J(t, `aria-label`, `${B(l) ?? ``} accès à donner`), W(n, B(l)));
              }),
                U(e, t));
            };
          (G(a, (e) => {
            B(l) && e(o);
          }),
            A(r));
          var s = R(r, 2);
          (Icone(F(s), {
            n: `aide`,
            taille: 17,
          }),
            j(),
            A(s),
            z(
              (e, t) => {
                (J(n, `href`, e),
                  J(n, `aria-current`, B(u) === `equipe` ? `page` : void 0),
                  J(r, `href`, t),
                  J(r, `aria-current`, B(u) === `comptes` ? `page` : void 0));
              },
              [() => lienRoute(`equipe`), () => lienRoute(`comptes`)],
            ),
            V(`click`, s, function (...e) {
              ouvrirVisite?.apply(this, e);
            }),
            U(e, t));
        };
      G(fe, (e) => {
        B(i) || e(pe);
      });
      var me = R(fe, 2),
        he = (e) => {
          var t = xw();
          (Icone(F(t), {
            n: `sortir`,
            taille: 17,
          }),
            j(),
            A(t),
            V(`click`, t, () => quitterDemo()),
            U(e, t));
        },
        ge = (e) => {
          var t = Sw(),
            n = F(t);
          Icone(n, {
            n: `sortir`,
            taille: 17,
          });
          var r = R(n, 1, !0);
          (A(t), z(() => W(r, MODE_REEL ? `Se déconnecter` : `Changer de profil`)), V(`click`, t, y), U(e, t));
        };
      G(me, (e) => {
        DEMO_VISITEUR ? e(he) : e(ge, -1);
      });
      var _e = R(me, 2),
        ve = (e) => {
          var t = Cw();
          (V(`click`, t, function (...e) {
            reinitialiserDemo?.apply(this, e);
          }),
            U(e, t));
        };
      (G(_e, (e) => {
        MODE_REEL || e(ve);
      }),
        A(ie),
        A(b));
      var ye = R(b, 2),
        be = F(ye);
      (Logo(F(be), {
        hauteur: 26,
      }),
        A(be));
      var xe = R(be, 2),
        Se = L(xe, !0),
        Ce = R(xe, 2),
        O = F(Ce),
        we = (e) => {
          var t = gw(),
            n = F(t);
          Icone(n, {
            n: `cloche`,
            taille: 21,
          });
          var r = R(n),
            i = (e) => {
              var t = hw(),
                n = L(t, !0);
              (z(() => W(n, B(g))), U(e, t));
            };
          (G(r, (e) => {
            B(g) && e(i);
          }),
            A(t),
            z(() => {
              (J(t, `aria-expanded`, B(m)), J(t, `aria-label`, `Notifications${B(g) ? `, ${B(g)} nouvelles` : ``}`));
            }),
            V(`click`, t, _),
            U(e, t));
        };
      G(O, (e) => {
        B(i) || e(we);
      });
      var k = R(O, 2),
        Te = L(k, !0);
      (A(Ce),
        A(ye),
        li(
          ye,
          (e, t) => couleurSelonFond?.(e, t),
          () => `haut`,
        ));
      var Ee = R(ye, 2),
        De = (e) => {
          var t = ww(),
            a = I(t),
            o = F(a),
            s = F(o),
            c = L(s, !0),
            u = R(s),
            m = F(u),
            h = L(m, !0),
            g = L(R(m));
          (A(u), A(o));
          var _ = R(o, 2),
            v = (e) => {
              var t = bw(),
                n = I(t);
              (Icone(F(n), {
                n: `clients`,
                taille: 18,
              }),
                j(),
                A(n));
              var r = R(n, 2),
                i = F(r);
              Icone(i, {
                n: `cle`,
                taille: 18,
              });
              var a = R(i, 2),
                o = (e) => {
                  var t = vw(),
                    n = L(t, !0);
                  (z(() => W(n, B(l))), U(e, t));
                };
              (G(a, (e) => {
                B(l) && e(o);
              }),
                A(r));
              var s = R(r, 2);
              (Icone(F(s), {
                n: `aide`,
                taille: 18,
              }),
                j(),
                A(s),
                z(
                  (e, t) => {
                    (J(n, `href`, e), J(r, `href`, t));
                  },
                  [() => lienRoute(`equipe`), () => lienRoute(`comptes`)],
                ),
                V(`click`, n, () => P(p, !1)),
                V(`click`, r, () => P(p, !1)),
                V(`click`, s, () => {
                  (P(p, !1), ouvrirVisite());
                }),
                U(e, t));
            };
          G(_, (e) => {
            B(i) || e(v);
          });
          var b = R(_, 2),
            x = (e) => {
              var t = xw();
              (Icone(F(t), {
                n: `sortir`,
                taille: 18,
              }),
                j(),
                A(t),
                V(`click`, t, () => quitterDemo()),
                U(e, t));
            },
            S = (e) => {
              var t = Sw(),
                n = F(t);
              Icone(n, {
                n: `sortir`,
                taille: 18,
              });
              var r = R(n, 1, !0);
              (A(t), z(() => W(r, MODE_REEL ? `Se déconnecter` : `Changer de profil`)), V(`click`, t, y), U(e, t));
            };
          G(b, (e) => {
            DEMO_VISITEUR ? e(x) : e(S, -1);
          });
          var C = R(b, 2),
            w = (e) => {
              var t = Cw();
              (V(`click`, t, () => {
                (P(p, !1), reinitialiserDemo());
              }),
                U(e, t));
            };
          (G(C, (e) => {
            MODE_REEL || e(w);
          }),
            A(a));
          var T = R(a, 2);
          (z(() => {
            (W(c, B(d)), W(h, B(n).nom), W(g, `${B(f) ?? ``}${B(r) ? ` · ${B(r).nom}` : ``}`));
          }),
            V(`click`, T, () => P(p, !1)),
            U(e, t));
        };
      G(Ee, (e) => {
        B(p) && e(De);
      });
      var Oe = R(Ee, 2),
        ke = (e) => {
          var t = Ow(),
            n = I(t),
            r = F(n),
            i = R(F(r));
          A(r);
          var a = R(r, 2),
            o = (e) => {
              var t = Ew();
              (K(
                t,
                21,
                () => B(h),
                (e) => e.id,
                (e, t) => {
                  var n = Tw();
                  let r;
                  var i = F(n),
                    a = F(i),
                    o = R(a),
                    s = F(o),
                    c = L(s, !0),
                    l = L(R(s));
                  (A(o),
                    A(i),
                    A(n),
                    z(
                      (e, o) => {
                        ((r = q(n, 1, `svelte-1n46o8q`, null, r, {
                          nouv: B(t).date > notificationsVues.depuis,
                        })),
                          J(i, `href`, e),
                          q(a, 1, fi(B(t).ton), `svelte-1n46o8q`),
                          W(c, B(t).texte),
                          W(l, `${B(t).titre ?? ``} · ${o ?? ``}`));
                      },
                      [() => lienRoute(`demande-${B(t).demandeId}`), () => jourMois(B(t).date.slice(0, 10))],
                    ),
                    V(`click`, i, v),
                    U(e, n));
                },
              ),
                A(t),
                U(e, t));
            },
            s = (e) => {
              U(e, Dw());
            };
          (G(a, (e) => {
            B(h).length ? e(o) : e(s, -1);
          }),
            A(n));
          var c = R(n, 2);
          (V(`click`, i, v), V(`click`, c, v), U(e, t));
        };
      G(Oe, (e) => {
        B(m) && e(ke);
      });
      var Ae = R(Oe, 2),
        je = F(Ae),
        Me = (e) => {
          var t = kw(),
            n = R(F(t)),
            r = R(n);
          (A(t), V(`click`, n, () => quitterDemo(`#ouverture`)), V(`click`, r, () => quitterDemo()), U(e, t));
        };
      (G(je, (e) => {
        DEMO_VISITEUR && e(Me);
      }),
        Zr(
          R(je, 2),
          () => route.nom,
          (e) => {
            var t = Aw(),
              n = F(t),
              r = (e) => {
                {
                  let t = M(() => route.nom.slice(8));
                  Fiche(e, {
                    get id() {
                      return B(t);
                    },
                  });
                }
              },
              i = (e) => {
                {
                  let t = M(() => route.nom.slice(9));
                  NouvelleDemande(e, {
                    get modifierId() {
                      return B(t);
                    },
                  });
                }
              },
              a = (e) => {
                Accueil(e, {});
              },
              o = (e) => {
                Demandes(e, {});
              },
              s = (e) => {
                NouvelleDemande(e, {});
              },
              l = (e) => {
                Unites(e, {});
              },
              u = (e) => {
                Calendrier(e, {});
              },
              d = (e) => {
                Production(e, {});
              },
              f = (e) => {
                Pilotage(e, {});
              },
              p = (e) => {
                Equipe(e, {});
              },
              m = (e) => {
                Comptes(e, {});
              };
            (G(n, (e) => {
              B(c) === `fiche`
                ? e(r)
                : B(c) === `modifier`
                  ? e(i, 1)
                  : B(c) === `accueil`
                    ? e(a, 2)
                    : B(c) === `demandes`
                      ? e(o, 3)
                      : B(c) === `nouvelle`
                        ? e(s, 4)
                        : B(c) === `unites`
                          ? e(l, 5)
                          : B(c) === `calendrier`
                            ? e(u, 6)
                            : B(c) === `production`
                              ? e(d, 7)
                              : B(c) === `pilotage`
                                ? e(f, 8)
                                : B(c) === `equipe`
                                  ? e(p, 9)
                                  : B(c) === `comptes` && e(m, 10);
            }),
              A(t),
              U(e, t));
          },
        ),
        A(Ae));
      var Ne = R(Ae, 2),
        Pe = F(Ne);
      let Fe;
      var Ie = F(Pe);
      let Le;
      (K(
        R(Ie, 2),
        17,
        () => B(s),
        (e) => e.id,
        (e, t) => {
          var n = jw();
          let r;
          var i = F(n),
            a = F(i);
          {
            let e = M(() => (B(t).id === `nouvelle` ? 22 : 23));
            Icone(a, {
              get n() {
                return B(t).ic;
              },
              get taille() {
                return B(e);
              },
            });
          }
          var o = R(a),
            s = (e) => {
              var n = vw(),
                r = L(n, !0);
              (z(() => W(r, B(t).badge)), U(e, n));
            };
          (G(o, (e) => {
            B(t).badge && e(s);
          }),
            A(i));
          var c = L(R(i, 2), !0);
          (A(n),
            z(
              (e) => {
                (J(n, `href`, e),
                  J(n, `aria-current`, B(u) === B(t).id ? `page` : void 0),
                  (r = q(n, 1, `svelte-1n46o8q`, null, r, {
                    cta: B(t).id === `nouvelle`,
                  })),
                  W(c, B(t).nom));
              },
              [() => lienRoute(B(t).id)],
            ),
            U(e, n));
        },
      ),
        A(Pe),
        A(Ne),
        li(
          Ne,
          (e, t) => couleurSelonFond?.(e, t),
          () => `bas`,
        ),
        A(o));
      var Re = R(o, 2),
        ze = (e) => {
          Visite(e, {});
        };
      (G(Re, (e) => {
        etat.visite && e(ze);
      }),
        z(
          (e, t, i, a) => {
            (J(x, `href`, e),
              W(w, B(r) ? B(r).nom : `Espace de production`),
              W(se, B(d)),
              W(ue, B(n).nom),
              W(de, B(f)),
              J(be, `href`, t),
              W(Se, B(r) ? B(r).nom : `Production`),
              J(k, `aria-expanded`, B(p)),
              J(k, `aria-label`, `Menu du compte (${B(n).nom ?? ``})`),
              W(Te, B(d)),
              (Fe = yi(Pe, ``, Fe, {
                "--n": B(s).length,
                "--i": i,
              })),
              (Le = q(Ie, 1, `curseur svelte-1n46o8q`, null, Le, {
                cache: a,
              })));
          },
          [
            () => lienRoute(B(i) ? `production` : `accueil`),
            () => lienRoute(B(i) ? `production` : `accueil`),
            () =>
              Math.max(
                0,
                B(s).findIndex((e) => e.id === B(u)),
              ),
            () => !B(s).some((e) => e.id === B(u) && e.id !== `nouvelle`),
          ],
        ),
        V(`click`, a, (e) => {
          (e.preventDefault(), document.getElementById(`contenu`)?.focus());
        }),
        V(`click`, k, () => {
          (P(p, !B(p)), P(m, !1));
        }),
        U(e, t));
    };
  G(x, (e) => {
    etat.pret ? (etat.nouveauMdp && (B(n) || etat.sessionSansProfil) ? e(C, 1) : B(n) ? e(T, -1) : e(w, 2)) : e(S);
  });
  var ee = R(x, 2);
  (Toasts(ee, {}), Fete(R(ee, 2), {}), U(e, b), Je());
}
(kr([`click`]),
  Gr(App, {
    target: document.getElementById(`app`),
  }));
