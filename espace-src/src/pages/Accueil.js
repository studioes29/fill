// Composant Accueil (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var D_ = H(`<a class="bt lg"><!>Nouvelle demande</a>`),
  O_ = H(
    `<p class="mu">Fill vous appelle pour caler le volume d’unités. Le bon de commande de votre abonnement est déjà prêt : faites-le signer, puis renvoyez-le ici, ou donnez simplement son numéro d’engagement. Vos unités sont créditées dès sa validation.</p>`,
  ),
  k_ = H(
    `<section class="activation carte pad svelte-5ho6zo" aria-labelledby="t-act"><span class="rond svelte-5ho6zo"><!></span> <div class="a-txt svelte-5ho6zo"><h2 class="t3" id="t-act"> </h2> <!> <!> <p class="petit">Votre espace est déjà ouvert : invitez vos collègues et préparez vos demandes. Elles partent dès que les unités sont sur le compte.</p></div></section>`,
  ),
  A_ = H(
    `<li class="svelte-5ho6zo"><span class="pt svelte-5ho6zo">2</span><div class="svelte-5ho6zo"><b>Recevoir vos premières unités</b><small class="svelte-5ho6zo"> </small></div></li>`,
  ),
  j_ = H(
    `<li><span class="pt svelte-5ho6zo"><!></span><div class="svelte-5ho6zo"><b>Inviter vos collègues</b><small class="svelte-5ho6zo"> </small></div><a class="lien svelte-5ho6zo"> <!></a></li>`,
  ),
  M_ = H(
    `<li><span class="pt svelte-5ho6zo"><!></span><div class="svelte-5ho6zo"><b>Donner à Fill l’accès à vos comptes</b><small class="svelte-5ho6zo"> </small></div><a class="lien svelte-5ho6zo"> <!></a></li>`,
  ),
  N_ = H(`<a class="lien svelte-5ho6zo">Commencer <!></a>`),
  P_ = H(
    `<section class="carte pad depart svelte-5ho6zo" aria-labelledby="t-dep"><h2 class="t2" id="t-dep">Pour démarrer</h2> <ol class="etapes svelte-5ho6zo"><li><span class="pt svelte-5ho6zo"><!></span><div class="svelte-5ho6zo"><b>Comprendre le fonctionnement</b><small class="svelte-5ho6zo">Les unités, une demande par sujet, la validation.</small></div><button class="lien svelte-5ho6zo"> <!></button></li> <!> <!> <!> <li class="svelte-5ho6zo"><span class="pt svelte-5ho6zo"> </span><div class="svelte-5ho6zo"><b>Déposer une première demande</b><small class="svelte-5ho6zo">Un sujet, ses supports, sa date : quelques minutes.</small></div><!></li> <li class="svelte-5ho6zo"><span class="pt svelte-5ho6zo"> </span><div class="svelte-5ho6zo"><b>Suivre vos unités</b><small class="svelte-5ho6zo"> </small></div><a class="lien svelte-5ho6zo">Voir <!></a></li></ol></section>`,
  ),
  F_ = H(
    `<a class="carte pad acces carte-lien svelte-5ho6zo"><span class="rond svelte-5ho6zo"><!></span> <span class="svelte-5ho6zo"><b> </b><small class="mu svelte-5ho6zo">Sans accès, Fill vous remet les fichiers et la publication reste de votre côté.</small></span> <!></a>`,
  ),
  I_ = H(`<img alt="" loading="lazy" class="svelte-5ho6zo"/>`),
  L_ = H(`<b class="num svelte-5ho6zo"> </b><i class="svelte-5ho6zo">unités à engager</i>`, 1),
  R_ = H(`<span class="sans svelte-5ho6zo"><!></span>`),
  z_ = H(
    `<li class="svelte-5ho6zo"><a class="action carte carte-lien svelte-5ho6zo"><span class="puits svelte-5ho6zo"><!> <span> </span></span> <span class="txt svelte-5ho6zo"><span class="etat-m svelte-5ho6zo"> </span> <b class="svelte-5ho6zo"> </b> <span class="mu petit"><!></span></span> <span class="fl svelte-5ho6zo" aria-hidden="true"><!></span></a></li>`,
  ),
  B_ = H(
    `<section class="bloc" aria-labelledby="t-afaire"><div class="entete"><h2 class="t2" id="t-afaire">À faire de votre côté<span class="compte num svelte-5ho6zo"> </span></h2></div> <ul class="afaire svelte-5ho6zo"></ul></section>`,
  ),
  V_ = H(`<li><!></li>`),
  H_ = H(`<ul class="liste svelte-5ho6zo"></ul>`),
  U_ = H(`<a class="bt sm svelte-5ho6zo">Déposer une demande <!></a>`),
  W_ = H(
    `<div class="vide svelte-5ho6zo"><b>Aucune demande en cours.</b><span>Une actualité, une affiche, un reportage : décrivez-le en quelques lignes.</span><!></div>`,
  ),
  G_ = H(`<p class="tres-petit mu"> </p>`),
  K_ = H(
    `<li class="svelte-5ho6zo"><span class="jour svelte-5ho6zo"><b class="num svelte-5ho6zo"> </b> </span><a class="svelte-5ho6zo"><b class="svelte-5ho6zo"> </b><small class="svelte-5ho6zo"> </small></a></li>`,
  ),
  q_ = H(`<ol class="parutions svelte-5ho6zo"></ol>`),
  J_ = H(`<p class="mu petit p-vide svelte-5ho6zo">Aucune date de parution à venir.</p>`),
  Y_ = H(
    `<!> <div class="feuille"><div class="w entre"><!> <!> <!> <!> <div class="grille svelte-5ho6zo"><section class="carte pad cours svelte-5ho6zo" aria-labelledby="t-cours"><div class="entete"><h2 class="t2" id="t-cours">En cours</h2> <a class="lien">Toutes les demandes <!></a></div> <!></section> <aside class="cote svelte-5ho6zo"><a class="carte pad unites carte-lien svelte-5ho6zo"><div class="entete"><h2 class="t3"> </h2><span class="fl svelte-5ho6zo" aria-hidden="true"><!></span></div> <div class="u-corps svelte-5ho6zo"><!> <dl class="num svelte-5ho6zo"><div class="svelte-5ho6zo"><dt class="svelte-5ho6zo"><i class="c1 svelte-5ho6zo"></i>Disponibles</dt><dd class="svelte-5ho6zo"> </dd></div> <div class="svelte-5ho6zo"><dt class="svelte-5ho6zo"><i class="c2 svelte-5ho6zo"></i>Réservées</dt><dd class="svelte-5ho6zo"> </dd></div> <div class="svelte-5ho6zo"><dt class="svelte-5ho6zo"><i class="c3 svelte-5ho6zo"></i>Décomptées</dt><dd class="svelte-5ho6zo"> </dd></div></dl></div> <!></a> <section class="carte pad" aria-labelledby="t-par"><h2 class="t3" id="t-par">Prochaines parutions</h2> <!></section></aside></div></div></div>`,
    1,
  );
function Accueil(e, t) {
  qe(t, !0);
  let n = M(moi),
    r = M(() => organisation(B(n).organisationId)),
    i = M(() => unitesPeriode(B(r).id)),
    a = M(() => unitesEnAttente(B(r).id)),
    o = M(mesDemandes),
    s = M(() => B(n).role === `referent`),
    c = M(() =>
      B(o).filter(
        (e) =>
          attendClient(e.statut) &&
          (B(s) || e.statut === `attente_client` || (B(n).role === `contributeur` && e.statut === `a_valider`)),
      ),
    ),
    l = M(() =>
      B(o)
        .filter((e) => estEnCours(e.statut) && !B(c).includes(e))
        .sort((e, t) => (e.livraison ?? `9999`).localeCompare(t.livraison ?? `9999`)),
    ),
    u = M(() =>
      B(o)
        .filter((e) => e.parution && e.parution >= aujourdhui() && e.statut !== `annulee`)
        .sort((e, t) => e.parution.localeCompare(t.parution))
        .slice(0, 5),
    ),
    d = M(() => B(n).nom.split(` `)[0]),
    f = (e) => {
      let t = e.versions.at(-1)?.fichiers[0];
      return t?.src ?? t?.srcs?.[0] ?? t?.pages?.[0] ?? null;
    },
    p = M(() => B(o).length === 0),
    m = M(() => membres(B(r).id).length - 1),
    h = M(() => etatAcces(B(r).acces)),
    g = M(() => (B(r).acces ?? []).some((e) => e.statut === `a_donner` && e.note));
  var _ = Y_(),
    v = I(_);
  {
    let e = (e) => {
        var t = Br(),
          r = I(t),
          i = (e) => {
            var t = D_();
            (Icone(F(t), {
              n: `plus`,
            }),
              j(),
              A(t),
              z((e) => J(t, `href`, e), [() => lienRoute(`nouvelle`)]),
              U(e, t));
          };
        (G(r, (e) => {
          B(n).role !== `lecteur` && e(i);
        }),
          U(e, t));
      },
      t = M(() => jourLong(aujourdhui()).replace(/^./, (e) => e.toUpperCase()));
    EnTete(v, {
      get titre() {
        return `Bonjour ${B(d) ?? ``}`;
      },
      get surtitre() {
        return B(t);
      },
      actions: e,
      $$slots: {
        actions: !0,
      },
    });
  }
  var y = R(v, 2),
    b = F(y),
    x = F(b),
    S = (e) => {
      var t = k_(),
        n = F(t);
      (Icone(F(n), {
        n: `horloge`,
        taille: 24,
      }),
        A(n));
      var i = R(n, 2),
        a = F(i),
        o = L(a, !0),
        s = R(a, 2),
        c = (e) => {
          U(e, O_());
        };
      (G(s, (e) => {
        B(r).type === `collectivite` && !(B(r).bonCommande || B(r).numeroEngagement) && e(c);
      }),
        CommandeUnites(R(s, 2), {}),
        j(2),
        A(i),
        A(t),
        z(() =>
          W(
            o,
            B(r).type === `collectivite` && (B(r).bonCommande || B(r).numeroEngagement)
              ? `Vos unités arrivent`
              : `Vos premières unités`,
          ),
        ),
        U(e, t));
    };
  G(x, (e) => {
    B(r).statut === `a_activer` && e(S);
  });
  var C = R(x, 2),
    w = (e) => {
      var t = P_(),
        a = R(F(t), 2),
        o = F(a);
      let s;
      var c = F(o),
        l = F(c),
        u = (e) => {
          Icone(e, {
            n: `ok`,
            taille: 15,
          });
        },
        d = (e) => {
          U(e, zr(`1`));
        };
      (G(l, (e) => {
        B(n).visiteVue ? e(u) : e(d, -1);
      }),
        A(c));
      var f = R(c, 2),
        p = F(f);
      (Icone(R(p), {
        n: `ar`,
      }),
        A(f),
        A(o));
      var g = R(o, 2),
        _ = (e) => {
          var t = A_(),
            n = R(F(t)),
            i = L(R(F(n)), !0);
          (A(n),
            A(t),
            z(() =>
              W(
                i,
                B(r).type === `collectivite`
                  ? B(r).bonCommande || B(r).numeroEngagement
                    ? `Bon de commande reçu, Fill le valide.`
                    : `Faire signer et renvoyer le bon de commande.`
                  : `Régler le premier mois en ligne.`,
              ),
            ),
            U(e, t));
        };
      G(g, (e) => {
        B(r).statut === `a_activer` && e(_);
      });
      var v = R(g, 2),
        y = (e) => {
          var t = j_();
          let n;
          var i = F(t),
            a = F(i),
            o = (e) => {
              Icone(e, {
                n: `ok`,
                taille: 15,
              });
            },
            s = (e) => {
              var t = zr();
              (z(() => W(t, B(r).statut === `a_activer` ? 3 : 2)), U(e, t));
            };
          (G(a, (e) => {
            B(m) > 0 ? e(o) : e(s, -1);
          }),
            A(i));
          var c = R(i),
            l = L(R(F(c)), !0);
          A(c);
          var u = R(c),
            d = F(u);
          (Icone(R(d), {
            n: `ar`,
          }),
            A(u),
            A(t),
            z(
              (e) => {
                ((n = q(t, 1, `svelte-5ho6zo`, null, n, {
                  fait: B(m) > 0,
                })),
                  W(
                    l,
                    B(m) > 0
                      ? `${B(m)} collègue${B(m) > 1 ? `s` : ``} dans l’espace.`
                      : `Ceux qui déposent des demandes ou suivent les livraisons.`,
                  ),
                  J(u, `href`, e),
                  W(d, `${B(m) > 0 ? `Gérer` : `Inviter`} `));
              },
              [() => lienRoute(`equipe`)],
            ),
            U(e, t));
        };
      G(v, (e) => {
        B(n).role === `referent` && e(y);
      });
      var b = R(v, 2),
        x = (e) => {
          var t = M_();
          let n;
          var i = F(t),
            a = F(i),
            o = (e) => {
              Icone(e, {
                n: `ok`,
                taille: 15,
              });
            },
            s = (e) => {
              var t = zr();
              (z(() => W(t, B(r).statut === `a_activer` ? 4 : 3)), U(e, t));
            };
          (G(a, (e) => {
            B(h).complet ? e(o) : e(s, -1);
          }),
            A(i));
          var c = R(i),
            l = L(R(F(c)), !0);
          A(c);
          var u = R(c),
            d = F(u);
          (Icone(R(d), {
            n: `ar`,
          }),
            A(u),
            A(t),
            z(
              (e) => {
                ((n = q(t, 1, `svelte-5ho6zo`, null, n, {
                  fait: B(h).complet,
                })),
                  W(
                    l,
                    B(h).complet
                      ? `Fill peut publier sur vos canaux.`
                      : `Réseaux, site, newsletter : une invitation au nom de Fill, sans mot de passe.`,
                  ),
                  J(u, `href`, e),
                  W(d, `${B(h).complet ? `Voir` : `Donner`} `));
              },
              [() => lienRoute(`comptes`)],
            ),
            U(e, t));
        };
      G(b, (e) => {
        B(n).role === `referent` && e(x);
      });
      var S = R(b, 2),
        C = F(S),
        w = L(C, !0),
        T = R(C, 2),
        ee = (e) => {
          var t = N_();
          (Icone(R(F(t)), {
            n: `ar`,
          }),
            A(t),
            z((e) => J(t, `href`, e), [() => lienRoute(`nouvelle`)]),
            U(e, t));
        };
      (G(T, (e) => {
        B(n).role !== `lecteur` && e(ee);
      }),
        A(S));
      var E = R(S, 2),
        te = F(E),
        D = L(te, !0),
        ne = R(te),
        re = L(R(F(ne)));
      A(ne);
      var ie = R(ne);
      (Icone(R(F(ie)), {
        n: `ar`,
      }),
        A(ie),
        A(E),
        A(a),
        A(t),
        z(
          (e) => {
            ((s = q(o, 1, `svelte-5ho6zo`, null, s, {
              fait: B(n).visiteVue,
            })),
              W(p, `${B(n).visiteVue ? `Revoir` : `Voir`} `),
              W(w, (B(r).statut === `a_activer` ? 3 : 2) + (B(n).role === `referent` ? 2 : 0)),
              W(D, (B(r).statut === `a_activer` ? 4 : 3) + (B(n).role === `referent` ? 2 : 0)),
              W(re, `${B(i).total ?? ``} unités sur la période en cours, le relevé détaille chaque mouvement.`),
              J(ie, `href`, e));
          },
          [() => lienRoute(`unites`)],
        ),
        V(`click`, f, function (...e) {
          ouvrirVisite?.apply(this, e);
        }),
        U(e, t));
    };
  G(C, (e) => {
    B(p) && e(w);
  });
  var T = R(C, 2),
    ee = (e) => {
      var t = F_(),
        n = F(t);
      (Icone(F(n), {
        n: `cle`,
        taille: 22,
      }),
        A(n));
      var r = R(n, 2),
        i = L(F(r), !0);
      (j(),
        A(r),
        Icone(R(r, 2), {
          n: `ar`,
          taille: 20,
        }),
        A(t),
        z(
          (e) => {
            (J(t, `href`, e),
              W(
                i,
                B(g)
                  ? `Un accès à vos comptes est à redonner`
                  : `${B(h).aDonner} ${B(h).aDonner > 1 ? `canaux` : `canal`} sans accès pour Fill`,
              ));
          },
          [() => lienRoute(`comptes`)],
        ),
        U(e, t));
    };
  G(T, (e) => {
    B(n).role === `referent` && !B(p) && (B(h).aDonner > 0 || B(g)) && e(ee);
  });
  var E = R(T, 2),
    te = (e) => {
      var t = B_(),
        n = F(t),
        r = F(n),
        i = L(R(F(r)), !0);
      (A(r), A(n));
      var a = R(n, 2);
      (K(
        a,
        23,
        () => B(c),
        (e) => e.id,
        (e, t, n) => {
          let r = M(() => f(B(t)));
          var i = z_();
          let a;
          var o = F(i),
            s = F(o),
            c = F(s),
            l = (e) => {
              var t = I_();
              (z(() => J(t, `src`, B(r))), U(e, t));
            },
            u = (e) => {
              var n = R_(),
                r = F(n),
                i = (e) => {
                  var n = L_(),
                    r = L(I(n), !0);
                  (j(), z(() => W(r, B(t).unites)), U(e, n));
                },
                a = (e) => {
                  Icone(e, {
                    n: `trombone`,
                    taille: 30,
                  });
                };
              (G(r, (e) => {
                B(t).statut === `accord_requis` ? e(i) : e(a, -1);
              }),
                A(n),
                U(e, n));
            };
          G(c, (e) => {
            B(r) ? e(l) : e(u, -1);
          });
          var d = R(c, 2),
            p = L(d, !0);
          A(s);
          var m = R(s, 2),
            h = F(m),
            g = L(h, !0),
            _ = R(h, 2),
            v = L(_, !0),
            y = R(_, 2),
            b = F(y),
            x = (e) => {
              var n = zr();
              (z(
                (e, r) => W(n, `Version ${B(t).versions.length ?? ``} · ${e ?? ``} livrable${r ?? ``}`),
                [
                  () => B(t).versions.at(-1)?.fichiers.length,
                  () => ((B(t).versions.at(-1)?.fichiers.length ?? 0) > 1 ? `s` : ``),
                ],
              ),
                U(e, n));
            },
            S = (e) => {
              var n = zr();
              (z(() =>
                W(
                  n,
                  `${B(t).unites ?? ``} unités${B(t).unitesHorsForfait ? `, dont ${B(t).unitesHorsForfait} hors forfait` : ``}`,
                ),
              ),
                U(e, n));
            },
            C = (e) => {
              U(e, zr(`Le délai reprend dès votre réponse`));
            };
          (G(b, (e) => {
            B(t).statut === `a_valider` ? e(x) : B(t).statut === `accord_requis` ? e(S, 1) : e(C, -1);
          }),
            A(y),
            A(m));
          var w = R(m, 2);
          (Icone(F(w), {
            n: `ar`,
            taille: 18,
          }),
            A(w),
            A(o),
            A(i),
            z(
              (e) => {
                ((a = yi(i, ``, a, {
                  "--k": B(n),
                })),
                  J(o, `href`, e),
                  q(
                    d,
                    1,
                    `pastille ${B(t).statut === `attente_client` ? `p-alerte` : `p-cor`} sur-img`,
                    `svelte-5ho6zo`,
                  ),
                  W(
                    p,
                    B(t).statut === `a_valider`
                      ? `À relire et valider`
                      : B(t).statut === `accord_requis`
                        ? `Accord attendu`
                        : `Pièce attendue`,
                  ),
                  W(
                    g,
                    B(t).statut === `a_valider`
                      ? `À relire et valider`
                      : B(t).statut === `accord_requis`
                        ? `Accord attendu`
                        : `Pièce attendue`,
                  ),
                  W(v, B(t).titre));
              },
              [() => lienRoute(`demande-${B(t).id}`)],
            ),
            U(e, i));
        },
      ),
        A(a),
        A(t),
        z(() => W(i, B(c).length)),
        U(e, t));
    };
  G(E, (e) => {
    B(c).length && e(te);
  });
  var D = R(E, 2),
    ne = F(D),
    re = F(ne),
    ie = R(F(re), 2);
  (Icone(R(F(ie)), {
    n: `ar`,
  }),
    A(ie),
    A(re));
  var ae = R(re, 2),
    oe = (e) => {
      var t = H_();
      (K(
        t,
        21,
        () => B(l),
        (e) => e.id,
        (e, t) => {
          var n = V_();
          (CarteDemande(F(n), {
            get d() {
              return B(t);
            },
          }),
            A(n),
            U(e, n));
        },
      ),
        A(t),
        U(e, t));
    },
    se = (e) => {
      var t = W_(),
        i = R(F(t), 2),
        a = (e) => {
          var t = U_();
          (Fleche(R(F(t)), {}), A(t), z((e) => J(t, `href`, e), [() => lienRoute(`nouvelle`)]), U(e, t));
        };
      (G(i, (e) => {
        B(n).role !== `lecteur` && B(r).statut === `active` && e(a);
      }),
        A(t),
        U(e, t));
    };
  (G(ae, (e) => {
    B(l).length ? e(oe) : e(se, -1);
  }),
    A(ne));
  var ce = R(ne, 2),
    le = F(ce),
    ue = F(le),
    de = F(ue),
    fe = L(de),
    pe = R(de);
  (Icone(F(pe), {
    n: `ar`,
    taille: 16,
  }),
    A(pe),
    A(ue));
  var me = R(ue, 2),
    he = F(me);
  Bobine(he, {
    get e() {
      return B(i);
    },
    get enAttente() {
      return B(a);
    },
    taille: 132,
  });
  var ge = R(he, 2),
    _e = F(ge),
    ve = L(R(F(_e)), !0);
  A(_e);
  var ye = R(_e, 2),
    be = L(R(F(ye)), !0);
  A(ye);
  var xe = R(ye, 2),
    Se = L(R(F(xe)), !0);
  (A(xe), A(ge), A(me));
  var Ce = R(me, 2),
    O = (e) => {
      var t = G_(),
        n = L(t);
      (z(() => W(n, `${B(a) ?? ``} unité${B(a) > 1 ? `s` : ``} en attente de confirmation par Fill.`)), U(e, t));
    };
  (G(Ce, (e) => {
    B(a) > 0 && e(O);
  }),
    A(le));
  var we = R(le, 2),
    k = R(F(we), 2),
    Te = (e) => {
      var t = q_();
      (K(
        t,
        21,
        () => B(u),
        (e) => e.id,
        (e, t) => {
          var n = K_(),
            r = F(n),
            i = F(r),
            a = L(i, !0),
            o = R(i, 1, !0);
          A(r);
          var s = R(r),
            c = F(s),
            l = L(c, !0),
            u = L(R(c), !0);
          (A(s),
            A(n),
            z(
              (e, n, r, i) => {
                (W(a, e), W(o, n), J(s, `href`, r), W(l, B(t).titre), W(u, i));
              },
              [
                () => Number(B(t).parution.slice(8)),
                () => jourCourt(B(t).parution).split(` `)[1],
                () => lienRoute(`demande-${B(t).id}`),
                () => resumeLignes(B(t).lignes),
              ],
            ),
            U(e, n));
        },
      ),
        A(t),
        U(e, t));
    },
    Ee = (e) => {
      U(e, J_());
    };
  (G(k, (e) => {
    B(u).length ? e(Te) : e(Ee, -1);
  }),
    A(we),
    A(ce),
    A(D),
    A(b),
    A(y),
    z(
      (e, t, n) => {
        (J(ie, `href`, e),
          J(le, `href`, t),
          W(fe, `Unités ${n ?? ``}`),
          W(ve, B(i).disponible),
          W(be, B(i).reserve),
          W(Se, B(i).consomme));
      },
      [() => lienRoute(`demandes`), () => lienRoute(`unites`), () => libellePeriode(B(r), periodeAnniversaire(B(r)))],
    ),
    U(e, _),
    Je());
}
kr([`click`]);
