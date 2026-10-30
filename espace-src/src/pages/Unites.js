// Composant Unites (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var wx = H(`<button class="bt lg"><!>Commander des unités</button>`),
  Tx = H(`<option> </option>`),
  Ex = H(`<label class="sr" for="per">Mois</label> <select id="per" class="saisie sel svelte-5bas1k"></select>`, 1),
  Dx = H(
    `<li class="svelte-5bas1k"><i class="l-att svelte-5bas1k"></i><span>En attente de confirmation</span><b class="svelte-5bas1k"> </b></li>`,
  ),
  Ox = H(`<section class="carte pad bloc" aria-labelledby="t-cmd"><h2 class="t2" id="t-cmd"> </h2> <!></section>`),
  kx = H(`<a class="svelte-5bas1k"> </a>`),
  Ax = H(`<b class="svelte-5bas1k"> </b>`),
  jx = H(
    `<li><span aria-hidden="true"><!></span> <span class="t svelte-5bas1k"><!> <small class="svelte-5bas1k"> </small></span> <span> </span> <span class="solde num svelte-5bas1k" title="Solde après ce mouvement"> </span></li>`,
  ),
  Mx = H(
    `<ol class="lignes svelte-5bas1k"></ol> <p class="tres-petit mu note-solde svelte-5bas1k">La dernière colonne donne le solde après chaque mouvement.</p>`,
    1,
  ),
  Nx = H(`<div class="vide">Aucun mouvement pour ce filtre.</div>`),
  Px = H(
    `<li class="svelte-5bas1k"><!><span class="svelte-5bas1k"><b> </b><small class="svelte-5bas1k"> </small></span><b class="num svelte-5bas1k"> </b></li>`,
  ),
  Fx = H(
    `<section class="carte pad bloc" aria-labelledby="t-fac"><h2 class="t2" id="t-fac">Factures</h2> <ul class="factures svelte-5bas1k"></ul><p class="mu petit fac-n" hidden style="margin-top:14px">Récapitulatifs sans valeur de facture : la facture est émise séparément. L’abonnement se règle à l’avance, chaque mois à la date anniversaire de votre premier règlement, par virement automatique ou par carte. <a class="lien fac-l" target="_blank" rel="noopener">Régler la période par carte</a></p></section>`,
  ),
  Ix = H(`<button class="bt cl">Annuler</button> <button class="bt">Continuer <!></button>`, 1),
  Lx = H(`<button class="bt cl"><!>Retour</button> <button class="bt"> <!></button>`, 1),
  Rx = H(
    `<button type="button" role="radio"><b class="num svelte-5bas1k"> </b><span class="svelte-5bas1k">unités</span><small class="num svelte-5bas1k"> </small></button>`,
  ),
  zx = H(`<p class="note n-cible"><!> </p>`),
  Bx = H(
    `<div class="paquets svelte-5bas1k" role="radiogroup" aria-label="Quantité proposée"></div> <div class="autre svelte-5bas1k"><span class="libelle">Autre quantité</span><!></div> <div class="calcul carte2 svelte-5bas1k"><div class="c-ap svelte-5bas1k"><!> <p class="svelte-5bas1k"><span class="mu petit">Après la commande</span><b class="num svelte-5bas1k"> </b></p></div> <p class="prix num svelte-5bas1k"><span> </span><b class="svelte-5bas1k"> </b></p></div> <!>`,
    1,
  ),
  Vx = H(
    `<dl class="recap-cmd svelte-5bas1k"><div class="svelte-5bas1k"><dt class="svelte-5bas1k">Quantité</dt><dd class="num svelte-5bas1k"> </dd></div> <div class="svelte-5bas1k"><dt class="svelte-5bas1k">Prix</dt><dd class="num svelte-5bas1k"> <small class="svelte-5bas1k"> </small></dd></div> <div class="svelte-5bas1k"><dt class="svelte-5bas1k">Crédit</dt><dd class="svelte-5bas1k"> </dd></div> <div class="svelte-5bas1k"><dt class="svelte-5bas1k">Règlement</dt><dd class="svelte-5bas1k"> </dd></div> <div class="svelte-5bas1k"><dt class="svelte-5bas1k">Commandé par</dt><dd class="svelte-5bas1k"> </dd></div></dl> <p class="note n-alerte"><!> </p>`,
    1,
  ),
  Hx = H(
    `<!> <div class="feuille"><div class="w entre"><div class="haut svelte-5bas1k"><section class="carte pad resume svelte-5bas1k" aria-labelledby="t-res"><div class="entete"><h2 class="t2" id="t-res"> </h2> <!></div> <div class="corps svelte-5bas1k"><!> <ul class="legende num svelte-5bas1k"><li class="svelte-5bas1k"><i class="l-dispo svelte-5bas1k"></i><span>Disponibles</span><b class="svelte-5bas1k"> </b></li> <li class="svelte-5bas1k"><i class="l-res svelte-5bas1k"></i><span>Réservées pour des demandes confirmées</span><b class="svelte-5bas1k"> </b></li> <li class="svelte-5bas1k"><i class="l-con svelte-5bas1k"></i><span>Décomptées (livrées)</span><b class="svelte-5bas1k"> </b></li> <!> <li class="total svelte-5bas1k"><span> </span><b class="svelte-5bas1k"> </b></li></ul></div></section> <section class="regles svelte-5bas1k" aria-labelledby="t-reg"><span class="motif svelte-5bas1k" aria-hidden="true"></span> <h2 class="t3" id="t-reg">Comment se comptent les unités</h2> <ol class="svelte-5bas1k"><li class="svelte-5bas1k"><b class="svelte-5bas1k">1 unité</b><span class="svelte-5bas1k">une publication ou une actualité ; le coût de chaque demande s’affiche avant l’envoi.</span></li> <li class="svelte-5bas1k"><b class="svelte-5bas1k">Réservées</b><span class="svelte-5bas1k">à la confirmation par Fill, rendues si vous annulez avant la production.</span></li> <li class="svelte-5bas1k"><b class="svelte-5bas1k">Décomptées</b><span class="svelte-5bas1k">à la livraison de la première version ; les corrections incluses ne coûtent rien de plus.</span></li> <li class="svelte-5bas1k"><b class="svelte-5bas1k">Reportées</b><span class="svelte-5bas1k"> </span></li> <li class="svelte-5bas1k"><b class="svelte-5bas1k"> </b><span class="svelte-5bas1k">l’unité au-delà du mois, commandée ici ou accordée sur une demande.</span></li></ol></section></div> <!> <section class="carte pad releve svelte-5bas1k" aria-labelledby="t-rel"><div class="entete"><h2 class="t2" id="t-rel">Relevé de la période</h2> <!></div> <!></section> <!></div></div> <!>`,
    1,
  );
function Unites(e, t) {
  qe(t, !0);
  let n = M(moi),
    r = M(() => organisation(B(n).organisationId)),
    i = aujourdhui(),
    a = M(() =>
      [...new Set(etat.d.registre.filter((e) => e.organisationId === B(r).id).map((e) => e.periode))].sort().reverse(),
    ),
    o = N(en(periodeAnniversaire(B(r), i))),
    s = M(() => unitesPeriode(B(r).id, B(o))),
    c = M(() => B(o) === periodeAnniversaire(B(r), i)),
    l = M(() => (B(c) ? unitesEnAttente(B(r).id) : 0)),
    u = M(() => {
      let e = etat.d.registre
          .filter((e) => e.organisationId === B(r).id && e.periode === B(o) && e.type !== `expiration`)
          .sort((e, t) => e.date.localeCompare(t.date)),
        t = 0;
      return e
        .map((e) => {
          let n = ``,
            r = ``,
            i = 0,
            a = `lav`,
            o = !1,
            s;
          if (e.type === `debit`) {
            let c = etat.d.demandes.find((t) => t.id === e.demandeId);
            ((n = c?.titre ?? `Demandes livrées`),
              (r =
                e.etat === `reserve`
                  ? `Réservées à la confirmation`
                  : e.etat === `consomme`
                    ? `Décomptées à la livraison`
                    : `Libérées : demande annulée`),
              (i = -e.unites),
              (o = e.etat === `restitue`),
              (a = e.etat === `consomme` ? `f` : `m`),
              c && (s = lienRoute(`demande-${c.id}`)),
              o || (t += i));
          } else
            ((i = e.unites),
              (t += i),
              (n =
                e.type === `credit`
                  ? `Quota de la période`
                  : e.type === `report`
                    ? `Report de la période précédente`
                    : (e.motif ?? `Ajustement`)),
              (r =
                e.type === `ajustement`
                  ? e.source === `offert`
                    ? `Offertes par Fill`
                    : e.source === `commande`
                      ? `Commandées`
                      : `Correction`
                  : e.type === `credit`
                    ? `Quota mensuel`
                    : `Une seule fois, consommées en premier`),
              (a = e.type === `ajustement` && e.source === `offert` ? `cor` : `bon`));
          return {
            l: e,
            titre: n,
            sous: r,
            montant: i,
            solde: t,
            barre: o,
            ton: a,
            lien: s,
          };
        })
        .reverse();
    }),
    d = N(`tout`),
    f = M(() => B(u).filter((e) => B(d) === `tout` || (B(d) === `entrees` ? e.montant > 0 : e.montant < 0))),
    p = N(!1),
    m = N(`choix`),
    h = N(10);
  wn(() => {
    B(p) || P(m, `choix`);
  });
  let g = M(() =>
      etat.d.factures.filter((e) => e.organisationId === B(r).id).sort((e, t) => t.periode.localeCompare(e.periode)),
    ),
    _ = N(!1),
    v = M(() => {
      let e = B(a).slice(0, 3);
      return e.length ? e.reduce((e, t) => e + unitesPeriode(B(r).id, t).engage, 0) / e.length : 0;
    }),
    y = M(() => sg(B(r).formule, B(v) + B(h) / Math.max(1, Math.min(3, B(a).length)))),
    b = async () => {
      P(_, !0);
      try {
        let e = await commanderUnites(B(h));
        (P(p, !1),
          e === `a_valider`
            ? feter({
                motif: `commande`,
                titre: `Commande enregistrée`,
                detail: `Le bon de commande prérempli de ${B(h)} unités vous attend sur cette page : faites-le signer, puis renvoyez-le ou donnez son numéro d’engagement. Les unités sont créditées dès sa validation.`,
                actions: [
                  {
                    libelle: `Continuer`,
                    principal: !0,
                  },
                ],
              })
            : e === `creditee` &&
              feter({
                motif: `commande`,
                titre: `${B(h)} unité${B(h) > 1 ? `s` : ``} ajoutée${B(h) > 1 ? `s` : ``}`,
                detail: `Elles sont disponibles dès maintenant. ${euros(og(B(h)))} ${B(r).type === `collectivite` ? `sur la facture de la période` : `réglés`}.`,
                actions: [
                  {
                    libelle: `Voir le relevé`,
                  },
                  {
                    libelle: `Déposer une demande`,
                    vers: `nouvelle`,
                    principal: !0,
                  },
                ],
              }));
      } catch (e) {
        toast(e.message, `erreur`);
      } finally {
        P(_, !1);
      }
    },
    x = M(() => etat.d.commandes.filter((e) => e.organisationId === B(r).id && e.statut === `a_valider`));
  var S = Hx(),
    C = I(S);
  EnTete(C, {
    titre: `Unités`,
    actions: (e) => {
      var t = Br(),
        i = I(t),
        a = (e) => {
          var t = wx();
          (Icone(F(t), {
            n: `panier`,
          }),
            j(),
            A(t),
            V(`click`, t, () => P(p, !0)),
            U(e, t));
        };
      (G(i, (e) => {
        B(n).role === `referent` && B(r).statut === `active` && !(B(r).type === `collectivite` && B(x).length) && e(a);
      }),
        U(e, t));
    },
    $$slots: {
      actions: !0,
    },
  });
  var w = R(C, 2),
    T = F(w),
    ee = F(T),
    E = F(ee),
    te = F(E),
    D = F(te),
    ne = L(D, !0),
    re = R(D, 2),
    ie = (e) => {
      var t = Ex(),
        n = R(I(t), 2);
      (K(
        n,
        21,
        () => B(a),
        Qr,
        (e, t) => {
          var n = Tx(),
            r = L(n, !0),
            i = {};
          (z(
            (e) => {
              (W(r, e), i !== (i = B(t)) && (n.value = (n.__value = i) ?? ``));
            },
            [() => libellePeriode(moi()?.organisationId, B(t))],
          ),
            U(e, n));
        },
      ),
        A(n),
        Ci(n),
        wi(
          n,
          () => B(o),
          (e) => P(o, e),
        ),
        U(e, t));
    };
  (G(re, (e) => {
    B(a).length > 1 && e(ie);
  }),
    A(te));
  var ae = R(te, 2),
    oe = F(ae);
  Zr(
    oe,
    () => B(o),
    (e) => {
      Bobine(e, {
        get e() {
          return B(s);
        },
        get enAttente() {
          return B(l);
        },
        taille: 196,
      });
    },
  );
  var se = R(oe, 2),
    ce = F(se),
    le = L(R(F(ce), 2), !0);
  A(ce);
  var ue = R(ce, 2),
    de = L(R(F(ue), 2), !0);
  A(ue);
  var fe = R(ue, 2),
    pe = L(R(F(fe), 2), !0);
  A(fe);
  var me = R(fe, 2),
    he = (e) => {
      var t = Dx(),
        n = L(R(F(t), 2), !0);
      (A(t), z(() => W(n, B(l))), U(e, t));
    };
  G(me, (e) => {
    B(l) && e(he);
  });
  var ge = R(me, 2),
    _e = F(ge),
    ve = L(_e),
    ye = L(R(_e), !0);
  (A(ge), A(se), A(ae), A(E));
  var be = R(E, 2),
    xe = R(F(be), 4),
    Se = R(F(xe), 6),
    Ce = L(R(F(Se)));
  A(Se);
  var O = R(Se, 2),
    we = L(F(O));
  (j(), A(O), A(xe), A(be), A(ee));
  var k = R(ee, 2),
    Te = (e) => {
      var t = Ox(),
        n = F(t),
        i = L(n, !0);
      (CommandeUnites(R(n, 2), {}),
        A(t),
        z(() => W(i, B(r).statut === `a_activer` ? `Vos premières unités` : `Commande en cours`)),
        U(e, t));
    };
  G(k, (e) => {
    (B(r).statut === `a_activer` || B(x).length) && e(Te);
  });
  var Ee = R(k, 2),
    De = F(Ee);
  (Curseur(R(F(De), 2), {
    libelle: `Filtrer le relevé`,
    petit: !0,
    options: [
      {
        id: `tout`,
        nom: `Tout`,
      },
      {
        id: `entrees`,
        nom: `Entrées`,
      },
      {
        id: `sorties`,
        nom: `Sorties`,
      },
    ],
    get valeur() {
      return B(d);
    },
    set valeur(e) {
      P(d, e, !0);
    },
  }),
    A(De));
  var Oe = R(De, 2),
    ke = (e) => {
      var t = Mx(),
        n = I(t);
      (K(
        n,
        23,
        () => B(f),
        (e) => e.l.id,
        (e, t, n) => {
          var r = jx();
          let i, a;
          var o = F(r),
            s = F(o);
          {
            let e = M(() =>
              B(t).montant > 0
                ? B(t).l.type === `ajustement` && B(t).l.source === `offert`
                  ? `cadeau`
                  : B(t).l.type === `ajustement`
                    ? `panier`
                    : `plus`
                : B(t).l.type === `debit` && B(t).l.etat === `consomme`
                  ? `ok`
                  : `horloge`,
            );
            Icone(s, {
              get n() {
                return B(e);
              },
              taille: 17,
            });
          }
          A(o);
          var c = R(o, 2),
            l = F(c),
            u = (e) => {
              var n = kx(),
                r = L(n, !0);
              (z(() => {
                (J(n, `href`, B(t).lien), W(r, B(t).titre));
              }),
                U(e, n));
            },
            d = (e) => {
              var n = Ax(),
                r = L(n, !0);
              (z(() => W(r, B(t).titre)), U(e, n));
            };
          G(l, (e) => {
            B(t).lien ? e(u) : e(d, -1);
          });
          var f = L(R(l, 2));
          A(c);
          var p = R(c, 2);
          let m;
          var h = L(p),
            g = L(R(p, 2), !0);
          (A(r),
            z(
              (e, s) => {
                ((i = q(r, 1, `svelte-5bas1k`, null, i, {
                  barre: B(t).barre,
                })),
                  (a = yi(r, ``, a, {
                    "--k": B(n),
                  })),
                  q(o, 1, `ic ${B(t).ton ?? ``}`, `svelte-5bas1k`),
                  W(f, `${e ?? ``} · ${B(t).sous ?? ``}`),
                  (m = q(p, 1, `mt num svelte-5bas1k`, null, m, {
                    plus: B(t).montant > 0,
                  })),
                  W(h, `${B(t).montant > 0 ? `+` : `−`}${s ?? ``}`),
                  W(g, B(t).barre ? `` : B(t).solde));
              },
              [() => jourMois(B(t).l.date.slice(0, 10)), () => Math.abs(B(t).montant)],
            ),
            U(e, r));
        },
      ),
        A(n),
        j(2),
        U(e, t));
    },
    Ae = (e) => {
      U(e, Nx());
    };
  (G(Oe, (e) => {
    B(f).length ? e(ke) : e(Ae, -1);
  }),
    A(Ee));
  var je = R(Ee, 2),
    Me = (e) => {
      var t = Fx(),
        n = R(F(t), 2);
      if (B(r).type === `entreprise`) {
        F(t).textContent = `Récapitulatifs par période`;
        let k = t.querySelector(`.fac-n`),
          y = t.querySelector(`.fac-l`);
        k && (k.hidden = !1);
        y &&
          (B(r).jetonPaiement && B(r).statut === `active`
            ? (y.href = `https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/mensualite?o=${encodeURIComponent(B(r).jetonPaiement)}`)
            : y.remove());
      }
      (K(
        n,
        21,
        () => B(g),
        (e) => e.id,
        (e, t) => {
          var n = Px(),
            r = F(n);
          Icone(r, {
            n: `facture`,
            taille: 20,
          });
          var i = R(r),
            a = F(i),
            o = L(a, !0),
            s = L(R(a));
          A(i);
          var c = L(R(i));
          (A(n),
            z(
              (e, n) => {
                (W(o, B(t).id),
                  W(s, `${e ?? ``} · ${B(t).statut === `payee` ? `réglée` : `à régler`}`),
                  W(c, `${n ?? ``}`));
              },
              [
                () => `Période ${libellePeriode(B(t).organisationId ?? moi()?.organisationId, B(t).periode)}`,
                () => euros(B(t).totalHT),
              ],
            ),
            U(e, n));
        },
      ),
        A(n),
        A(t),
        U(e, t));
    };
  (G(je, (e) => {
    B(n).role === `referent` &&
      (B(g).length || (B(r).type === `entreprise` && B(r).statut === `active` && !B(r).essai && B(r).jetonPaiement)) &&
      e(Me);
  }),
    A(T),
    A(w));
  var Ne = R(w, 2);
  {
    let e = (e) => {
        var t = Br(),
          n = I(t),
          i = (e) => {
            var t = Ix(),
              n = I(t),
              r = R(n, 2);
            (Fleche(R(F(r)), {}), A(r), V(`click`, n, () => P(p, !1)), V(`click`, r, () => P(m, `confirmer`)), U(e, t));
          },
          a = (e) => {
            var t = Lx(),
              n = I(t);
            (Fleche(F(n), {
              sens: `al`,
            }),
              j(),
              A(n));
            var i = R(n, 2),
              a = F(i);
            (Fleche(R(a), {}),
              A(i),
              z(
                (e) => {
                  ((i.disabled = B(_)), W(a, `${e ?? ``} `));
                },
                [
                  () =>
                    B(r).type === `collectivite` ? `Je commande ${B(h)} unités` : `Payer ${euros(og(B(h)))} par carte`,
                ],
              ),
              V(`click`, n, () => P(m, `choix`)),
              V(`click`, i, b),
              U(e, t));
          };
        (G(n, (e) => {
          B(m) === `choix` ? e(i) : e(a, -1);
        }),
          U(e, t));
      },
      t = M(() => (B(m) === `choix` ? `Commander des unités` : `Confirmer la commande`)),
      a = M(() => (B(m) === `choix` ? `créditées sur la période en cours` : B(r).nom));
    Volet(Ne, {
      get titre() {
        return B(t);
      },
      get sous() {
        return B(a);
      },
      get ouverte() {
        return B(p);
      },
      set ouverte(e) {
        P(p, e, !0);
      },
      pied: e,
      children: (e, t) => {
        var a = Br(),
          o = I(a),
          c = (e) => {
            var t = Bx(),
              n = I(t);
            (K(
              n,
              21,
              () => ag,
              Qr,
              (e, t) => {
                var n = Rx();
                let r;
                var i = F(n),
                  a = L(i, !0),
                  o = L(R(i, 2));
                (A(n),
                  z(
                    (e) => {
                      (J(n, `aria-checked`, B(h) === B(t)),
                        (r = q(n, 1, `paquet choix svelte-5bas1k`, null, r, {
                          on: B(h) === B(t),
                        })),
                        W(a, B(t)),
                        W(o, `${e ?? ``}`));
                    },
                    [() => euros(og(B(t)))],
                  ),
                  V(`click`, n, () => P(h, B(t), !0)),
                  U(e, n));
              },
            ),
              A(n));
            var r = R(n, 2);
            (Quantite(R(F(r)), {
              min: 1,
              get max() {
                return 60;
              },
              libelle: `Unités commandées`,
              get valeur() {
                return B(h);
              },
              set valeur(e) {
                P(h, e, !0);
              },
            }),
              A(r));
            var i = R(r, 2),
              a = F(i),
              o = F(a);
            {
              let e = M(() => ({
                ...B(s),
                total: B(s).total + B(h),
                disponible: B(s).disponible + B(h),
              }));
              Bobine(o, {
                get e() {
                  return B(e);
                },
                get enAttente() {
                  return B(l);
                },
                taille: 92,
              });
            }
            var c = R(o, 2),
              u = L(R(F(c)));
            (A(c), A(a));
            var d = R(a, 2),
              f = F(d),
              p = L(f),
              m = L(R(f));
            (A(d), A(i));
            var g = R(i, 2),
              _ = (e) => {
                var t = zx(),
                  n = F(t);
                Icone(n, {
                  n: `info`,
                });
                var r = R(n);
                (A(t),
                  z(
                    (e, t, n) =>
                      W(
                        r,
                        `À ce rythme, la formule ${e ?? ``} (${t ?? ``} par mois, ${n ?? ``} unités) reviendrait moins cher. Parlez-en à Fill lors du prochain point.`,
                      ),
                    [() => formule(B(y)).nom, () => euros(formule(B(y)).prix), () => formule(B(y)).unites],
                  ),
                  U(e, t));
              };
            (G(g, (e) => {
              B(y) && e(_);
            }),
              z(
                (e, t) => {
                  (W(u, `${B(s).disponible + B(h)} unités disponibles`),
                    W(p, `${B(h) ?? ``} × ${e ?? ``}`),
                    W(m, `${t ?? ``}`));
                },
                [() => euros(OFFRE.uniteSup), () => euros(og(B(h)))],
              ),
              U(e, t));
          },
          u = (e) => {
            var t = Vx(),
              a = I(t),
              o = F(a),
              s = L(R(F(o)));
            A(o);
            var c = R(o, 2),
              l = R(F(c)),
              u = F(l),
              d = L(R(u));
            (A(l), A(c));
            var f = R(c, 2),
              p = L(R(F(f)), !0);
            A(f);
            var m = R(f, 2),
              g = L(R(F(m)), !0);
            A(m);
            var _ = R(m, 2),
              v = L(R(F(_)));
            (A(_), A(a));
            var y = R(a, 2),
              b = F(y);
            Icone(b, {
              n: `alerte`,
            });
            var x = R(b, 1, !0);
            (A(y),
              z(
                (e, t, i) => {
                  (W(s, `${B(h) ?? ``} unités`),
                    W(u, `${e ?? ``} `),
                    W(d, `(${B(h) ?? ``} × ${t ?? ``})`),
                    W(
                      p,
                      B(r).type === `collectivite`
                        ? `dès la validation du bon de commande signé`
                        : `dès le paiement reçu`,
                    ),
                    W(
                      g,
                      B(r).type === `collectivite`
                        ? `sur la facture de la période, via Chorus Pro`
                        : `par carte bancaire, maintenant`,
                    ),
                    W(v, `${B(n).nom ?? ``}, le ${i ?? ``}`),
                    W(
                      x,
                      B(r).type === `collectivite`
                        ? `Fill vous envoie le devis ; la commande vous engage à la signature du bon de commande.`
                        : `Cette commande engage votre entreprise : elle ne pourra pas être annulée une fois les unités créditées.`,
                    ));
                },
                [() => euros(og(B(h))), () => euros(OFFRE.uniteSup), () => jourLong(i)],
              ),
              U(e, t));
          };
        (G(o, (e) => {
          B(m) === `choix` ? e(c) : e(u, -1);
        }),
          U(e, a));
      },
      $$slots: {
        pied: !0,
        default: !0,
      },
    });
  }
  (z(
    (e, t, n) => {
      (W(ne, e),
        W(le, B(s).disponible),
        W(de, B(s).reserve),
        W(pe, B(s).consomme),
        W(
          ve,
          `${B(s).quota ?? ``} du quota${B(s).report ? ` + ${B(s).report} reportées` : ``}${B(s).ajustements ? ` + ${B(s).ajustements} ajoutées` : ``}`,
        ),
        W(ye, B(s).total),
        W(Ce, `${t ?? ``}.`),
        W(we, `${n ?? ``}`));
    },
    [
      () => `Période ${libellePeriode(B(r), B(o))}`,
      () => OFFRE.report.charAt(0).toLowerCase() + OFFRE.report.slice(1),
      () => euros(OFFRE.uniteSup),
    ],
  ),
    U(e, S),
    Je());
}
kr([`click`]);
