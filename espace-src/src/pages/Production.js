// Composant Production (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var xS = H(
    `<ul class="kpi svelte-9c5yx5"><li><b class="svelte-9c5yx5"><!></b><span class="svelte-9c5yx5">en retard</span></li> <li class="k-encre svelte-9c5yx5"><b class="svelte-9c5yx5"><!></b><span class="svelte-9c5yx5">à arbitrer</span></li> <li class="svelte-9c5yx5"><b class="svelte-9c5yx5"><!></b><span class="svelte-9c5yx5">à livrer d’ici dimanche</span></li> <li class="k-jauge svelte-9c5yx5"><b class="svelte-9c5yx5"><!><small class="svelte-9c5yx5"> </small></b><span class="svelte-9c5yx5">unités cette semaine</span></li> <li class="svelte-9c5yx5"><b class="svelte-9c5yx5"><!></b><span class="svelte-9c5yx5">chez les clients</span></li></ul>`,
  ),
  SS = H(`<button class="bt sm"><!> </button>`),
  CS = H(`<span class="delai grave">Confirmation en retard</span>`),
  wS = H(`<p class="verdict ok svelte-9c5yx5"><!> </p>`),
  TS = H(`<p class="verdict svelte-9c5yx5"><!> </p>`),
  ES = H(
    `<div><span class="petit"> <b class="num"> </b> unités</span> <span class="j svelte-9c5yx5"><i class="svelte-9c5yx5"></i><i class="aj svelte-9c5yx5"></i></span></div>`,
  ),
  DS = H(`<button class="bt sm">Confirmer <!></button>`),
  OS = H(`<button class="bt sm"> </button>`),
  kS = H(
    `<li class="svelte-9c5yx5"><article class="carte conf svelte-9c5yx5"><a class="haut svelte-9c5yx5"><span class="cl svelte-9c5yx5"> </span> <b class="svelte-9c5yx5"> </b> <span class="petit mu"> </span> <span class="depose svelte-9c5yx5"><!> <!></span></a> <!> <!> <div class="act svelte-9c5yx5"><!> <a class="bt sm cl svelte-9c5yx5">Ouvrir</a></div></article></li>`,
  ),
  AS = H(`<ul class="cartes svelte-9c5yx5"></ul>`),
  jS = H(
    `<div class="vide"><b>Rien à arbitrer.</b><span>Les nouvelles demandes qui tiennent dans votre planning sont confirmées dès leur dépôt.</span></div>`,
  ),
  MS = H(
    `<li><a class="jet carte carte-lien svelte-9c5yx5"><span class="j-ic svelte-9c5yx5"><!></span> <span class="j-t svelte-9c5yx5"><b> </b><small class="svelte-9c5yx5"> </small></span> <span class="fl svelte-9c5yx5"><!></span></a></li>`,
  ),
  NS = H(
    `<section class="bloc" aria-labelledby="t-jets"><div class="entete"><div><h2 class="t2" id="t-jets">Premiers jets à relire</h2><p class="petit mu">Préparés par l’atelier à la confirmation. Le client ne voit rien avant votre livraison.</p></div></div> <ul class="jets svelte-9c5yx5"></ul></section>`,
  ),
  PS = H(`<option> </option>`),
  FS = H(`<span class="sr"> </span>`),
  IS = H(`<li><!><!></li>`),
  LS = H(`<ul class="liste svelte-9c5yx5"></ul>`),
  RS = H(`<div class="vide">Aucune demande dans cet état.</div>`),
  zS = H(`<a class="svelte-9c5yx5"> </a>`),
  BS = H(`<span> </span>`),
  VS = H(`<li class="svelte-9c5yx5"><!><time class="svelte-9c5yx5"> </time></li>`),
  HS = H(`<ol class="svelte-9c5yx5"></ol>`),
  US = H(`<p class="petit mu">Rien pour l’instant.</p>`),
  WS = H(
    `<!> <div class="feuille"><div class="w"><div class="cols svelte-9c5yx5"><div class="principal entre svelte-9c5yx5"><section class="bloc" aria-labelledby="t-conf"><div class="entete"><div><h2 class="t2" id="t-conf">À arbitrer</h2><p class="petit mu">Ce que le pilote n’a pas confirmé seul.</p></div> <!></div> <!></section> <!> <section class="carte pad bloc" aria-labelledby="t-cours"><div class="entete"><h2 class="t2" id="t-cours">En cours</h2> <label class="sr" for="cl-p">Client</label> <select id="cl-p" class="saisie sel svelte-9c5yx5"><option>Tous les clients</option><!></select></div> <!> <!></section></div> <aside class="carte pad journal svelte-9c5yx5" aria-labelledby="t-jr"><div class="j-tete svelte-9c5yx5"><span class="j-ic pil svelte-9c5yx5"><!></span><h2 class="t3" id="t-jr">Fait par le pilote</h2></div> <!> <a class="lien petit svelte-9c5yx5">Régler le pilote <!></a></aside></div></div></div>`,
    1,
  );
function Production(e, t) {
  qe(t, !0);
  let n = aujourdhui(),
    r = M(() => etat.d.demandes.filter((e) => organisation(e.organisationId))),
    i = M(() =>
      B(r)
        .filter((e) => e.statut === `deposee`)
        .sort((e, t) => e.creee.localeCompare(t.creee)),
    ),
    a = M(() => Object.fromEntries(B(i).map((e) => [e.id, decisionPilote(e)]))),
    o = M(() => B(i).filter((e) => B(a)[e.id]?.auto).length),
    s = M(() => B(r).filter((e) => e.brouillon && [`confirmee`, `production`, `correction`].includes(e.statut))),
    c = (e) => alerteRetard(e, n, etat.d.fermetures),
    l = [
      {
        id: `tous`,
        nom: `Tout`,
        f: () => !0,
      },
      {
        id: `retard`,
        nom: `En retard`,
        f: (e) => c(e) === `livraison_depassee`,
      },
      {
        id: `confirmee`,
        nom: `Confirmées`,
        f: (e) => e.statut === `confirmee`,
      },
      {
        id: `production`,
        nom: `En production`,
        f: (e) => e.statut === `production`,
      },
      {
        id: `correction`,
        nom: `En correction`,
        f: (e) => e.statut === `correction`,
      },
      {
        id: `client`,
        nom: `Chez le client`,
        f: (e) => [`a_valider`, `accord_requis`, `attente_client`].includes(e.statut),
      },
      {
        id: `validee`,
        nom: `À publier ou remettre`,
        f: (e) => e.statut === `validee`,
      },
    ],
    u = N(`tous`),
    d = N(``),
    f = M(() =>
      B(r).filter((e) => ![`deposee`, `livree`, `annulee`].includes(e.statut) && (!B(d) || e.organisationId === B(d))),
    ),
    p = {
      livraison_depassee: 0,
      livraison_aujourdhui: 1,
      livraison_proche: 2,
    },
    m = M(() =>
      B(f)
        .filter(l.find((e) => e.id === B(u)).f)
        .sort(
          (e, t) =>
            (p[c(e) ?? ``] ?? 9) - (p[c(t) ?? ``] ?? 9) || (e.livraison ?? `9`).localeCompare(t.livraison ?? `9`),
        ),
    ),
    h = M(() => B(r).filter((e) => c(e) === `livraison_depassee`).length),
    g = ajouterJours(lundiDe(n), 6),
    _ = M(() =>
      B(r).filter(
        (e) => [`confirmee`, `production`, `correction`].includes(e.statut) && e.livraison && e.livraison <= g,
      ),
    ),
    v = M(() => verifierCapacite(etat.d.demandes, ``, 0, n, etat.d.capacite, etat.d.fermetures)),
    y = M(() => B(r).filter((e) => [`a_valider`, `accord_requis`, `attente_client`].includes(e.statut)).length),
    b = M(() => etat.d.journal.filter((e) => e.auto).slice(0, 8)),
    x = (e) => {
      let t = new Date(e);
      return e.slice(0, 10) === n
        ? t.toLocaleTimeString(`fr-FR`, {
            hour: `2-digit`,
            minute: `2-digit`,
            timeZone: `Europe/Paris`,
          })
        : jourCourt(e.slice(0, 10));
    },
    S = async (e, t) => {
      try {
        let n = await confirmerDemande(e.id, {
          livraison: t ?? reestimer(e) ?? void 0,
        });
        toast(
          n === `confirmee` ? `Demande confirmée` : `Accord du référent demandé`,
          `succes`,
          n === `confirmee` ? `${organisation(e.organisationId).nom} est prévenue.` : void 0,
        );
      } catch (e) {
        toast(e.message, `erreur`);
      }
    },
    C = () => {
      let e = passePilote(!0);
      toast(
        `${e.confirmees} demande${e.confirmees > 1 ? `s` : ``} confirmée${e.confirmees > 1 ? `s` : ``}`,
        `succes`,
        `Les clients sont prévenus, les dates sont posées au calendrier.`,
      );
    };
  var w = WS(),
    T = I(w);
  EnTete(T, {
    titre: `Production`,
    apres: (e) => {
      var t = xS(),
        n = F(t);
      let r;
      var a = F(n);
      (Nombre(F(a), {
        get v() {
          return B(h);
        },
      }),
        A(a),
        j(),
        A(n));
      var o = R(n, 2),
        s = F(o);
      (Nombre(F(s), {
        get v() {
          return B(i).length;
        },
      }),
        A(s),
        j(),
        A(o));
      var c = R(o, 2),
        l = F(c);
      (Nombre(F(l), {
        get v() {
          return B(_).length;
        },
      }),
        A(l),
        j(),
        A(c));
      var u = R(c, 2);
      let d;
      var f = F(u),
        p = F(f);
      Nombre(p, {
        get v() {
          return B(v).charge;
        },
      });
      var m = L(R(p));
      (A(f), j(), A(u));
      var g = R(u, 2),
        b = F(g);
      (Nombre(F(b), {
        get v() {
          return B(y);
        },
      }),
        A(b),
        j(),
        A(g),
        A(t),
        z(
          (e) => {
            ((r = q(n, 1, `k-cor svelte-9c5yx5`, null, r, {
              "vide-k": !B(h),
            })),
              (d = yi(u, ``, d, {
                "--j": e,
              })),
              W(m, `/${B(v).capacite ?? ``}`));
          },
          [() => `${Math.min(100, (B(v).charge / Math.max(1, B(v).capacite)) * 100)}%`],
        ),
        U(e, t));
    },
    $$slots: {
      apres: !0,
    },
  });
  var ee = R(T, 2),
    E = F(ee),
    te = F(E),
    D = F(te),
    ne = F(D),
    re = F(ne),
    ie = R(F(re), 2),
    ae = (e) => {
      var t = SS(),
        n = F(t);
      Icone(n, {
        n: `pilote`,
        taille: 17,
      });
      var r = R(n, 1, !0);
      (A(t),
        z(() => W(r, B(o) > 1 ? `Confirmer les ${B(o)} qui tiennent` : `Confirmer celle qui tient`)),
        V(`click`, t, C),
        U(e, t));
    };
  (G(ie, (e) => {
    B(o) > 0 && e(ae);
  }),
    A(re));
  var oe = R(re, 2),
    se = (e) => {
      var t = AS();
      (K(
        t,
        23,
        () => B(i),
        (e) => e.id,
        (e, t, n) => {
          let r = M(() => c(B(t))),
            i = M(() => B(a)[B(t).id]),
            o = M(() => (B(i)?.auto ? B(i).livraison : reestimer(B(t)))),
            s = M(() =>
              B(o)
                ? verifierCapacite(etat.d.demandes, B(t).id, B(t).unites ?? 0, B(o), etat.d.capacite, etat.d.fermetures)
                : null,
            ),
            l = M(() => organisation(B(t).organisationId));
          var u = kS();
          let d;
          var f = F(u),
            p = F(f),
            m = F(p),
            h = L(m, !0),
            g = R(m, 2),
            _ = L(g, !0),
            v = R(g, 2),
            y = L(v),
            b = R(v, 2),
            x = F(b);
          Icone(x, {
            n: `horloge`,
            taille: 14,
          });
          var C = R(x),
            w = R(C),
            T = (e) => {
              U(e, CS());
            };
          (G(w, (e) => {
            B(r) === `confirmation_en_retard` && e(T);
          }),
            A(b),
            A(p));
          var ee = R(p, 2),
            E = (e) => {
              var t = wS(),
                n = F(t);
              Icone(n, {
                n: `ok`,
                taille: 16,
              });
              var r = R(n);
              (A(t),
                z(
                  (e, t) => W(r, `Tient dans la semaine : livraison le ${e ?? ``}${t ?? ``}.`),
                  [
                    () => jourMois(B(i).livraison),
                    () => (B(i).accord ? `, puis accord du référent (${B(i).accord.toLowerCase()})` : ``),
                  ],
                ),
                U(e, t));
            },
            te = (e) => {
              var t = TS(),
                n = F(t);
              Icone(n, {
                n: `alerte`,
                taille: 16,
              });
              var r = R(n);
              (A(t),
                z(
                  (e) => W(r, `${B(i).raison ?? ``}${e ?? ``}.`),
                  [() => (B(i).dateProposee ? ` ; première semaine libre : ${jourLong(B(i).dateProposee)}` : ``)],
                ),
                U(e, t));
            };
          G(ee, (e) => {
            B(i)?.auto ? e(E) : B(i) && e(te, 1);
          });
          var D = R(ee, 2),
            ne = (e) => {
              var n = ES();
              let r;
              var i = F(n),
                a = F(i),
                c = L(R(a));
              (j(), A(i));
              var l = R(i, 2),
                u = F(l);
              let d;
              var f = R(u);
              let p;
              (A(l),
                A(n),
                z(
                  (e, t, i) => {
                    ((r = q(n, 1, `cap svelte-9c5yx5`, null, r, {
                      ko: !B(s).tient,
                    })),
                      W(a, `Semaine du ${e ?? ``} : `),
                      W(c, `${B(s).apres ?? ``}/${B(s).capacite ?? ``}`),
                      (d = yi(u, ``, d, {
                        width: t,
                      })),
                      (p = yi(f, ``, p, {
                        width: i,
                      })));
                  },
                  [
                    () => jourCourt(B(o)),
                    () => `${Math.min(100, (B(s).charge / B(s).capacite) * 100)}%`,
                    () => `${Math.min(100, ((B(t).unites ?? 0) / B(s).capacite) * 100)}%`,
                  ],
                ),
                U(e, n));
            };
          G(D, (e) => {
            B(s) && B(o) && e(ne);
          });
          var re = R(D, 2),
            ie = F(re),
            ae = (e) => {
              var n = DS();
              (Fleche(R(F(n)), {}), A(n), V(`click`, n, () => S(B(t), B(i).livraison)), U(e, n));
            },
            oe = (e) => {
              var n = OS(),
                r = L(n);
              (z((e) => W(r, `Confirmer au ${e ?? ``}`), [() => jourMois(B(i).dateProposee)]),
                V(`click`, n, () => S(B(t), B(i).dateProposee ?? void 0)),
                U(e, n));
            };
          G(ie, (e) => {
            B(i)?.auto ? e(ae) : B(i) && !B(i).auto && B(i).dateProposee && e(oe, 1);
          });
          var se = R(ie, 2);
          (A(re),
            A(f),
            A(u),
            z(
              (e, r, i, a) => {
                ((d = yi(u, ``, d, {
                  "--k": B(n),
                })),
                  J(p, `href`, e),
                  J(m, `data-type`, B(l).type),
                  W(h, B(l).nom),
                  W(_, B(t).titre),
                  W(y, `${r ?? ``} · ${B(t).unites ?? ``} u.${B(t).urgente ? ` · urgente` : ``}`),
                  W(C, `Déposée le ${i ?? ``}`),
                  J(se, `href`, a));
              },
              [
                () => lienRoute(`demande-${B(t).id}`),
                () => resumeLignes(B(t).lignes),
                () => jourMois(B(t).creee.slice(0, 10)),
                () => lienRoute(`demande-${B(t).id}`),
              ],
            ),
            U(e, u));
        },
      ),
        A(t),
        U(e, t));
    },
    ce = (e) => {
      U(e, jS());
    };
  (G(oe, (e) => {
    B(i).length ? e(se) : e(ce, -1);
  }),
    A(ne));
  var le = R(ne, 2),
    ue = (e) => {
      var t = NS(),
        n = R(F(t), 2);
      (K(
        n,
        21,
        () => B(s),
        (e) => e.id,
        (e, t) => {
          var n = MS(),
            r = F(n),
            i = F(r);
          (Icone(F(i), {
            n: `atelier`,
            taille: 20,
          }),
            A(i));
          var a = R(i, 2),
            o = F(a),
            s = L(o, !0),
            c = L(R(o));
          A(a);
          var l = R(a, 2);
          (Icone(F(l), {
            n: `ar`,
            taille: 17,
          }),
            A(l),
            A(r),
            A(n),
            z(
              (e, n, i) => {
                (J(r, `href`, e),
                  W(s, B(t).titre),
                  W(
                    c,
                    `${n ?? ``} · ${B(t).brouillon.fichiers.length ?? ``} texte${B(t).brouillon.fichiers.length > 1 ? `s` : ``} · livraison ${i ?? ``}`,
                  ));
              },
              [
                () => lienRoute(`demande-${B(t).id}`),
                () => organisation(B(t).organisationId).nom,
                () => (B(t).livraison ? jourMois(B(t).livraison) : `à fixer`),
              ],
            ),
            U(e, n));
        },
      ),
        A(n),
        A(t),
        U(e, t));
    };
  G(le, (e) => {
    B(s).length && e(ue);
  });
  var de = R(le, 2),
    fe = F(de),
    pe = R(F(fe), 4),
    me = F(pe);
  ((me.value = me.__value = ``),
    K(
      R(me),
      17,
      () => etat.d.organisations.filter((e) => e.statut === `active`),
      Qr,
      (e, t) => {
        var n = PS(),
          r = L(n, !0),
          i = {};
        (z(() => {
          (W(r, B(t).nom), i !== (i = B(t).id) && (n.value = (n.__value = i) ?? ``));
        }),
          U(e, n));
      },
    ),
    A(pe),
    Ci(pe),
    A(fe));
  var he = R(fe, 2);
  {
    let e = M(() =>
      l.map((e) => {
        let t = B(f).filter(e.f).length;
        return {
          id: e.id,
          nom: e.nom,
          n: t,
          alerte: e.id === `retard` && t > 0,
        };
      }),
    );
    Curseur(he, {
      libelle: `Filtrer par état`,
      get options() {
        return B(e);
      },
      get valeur() {
        return B(u);
      },
      set valeur(e) {
        P(u, e, !0);
      },
    });
  }
  var ge = R(he, 2),
    _e = (e) => {
      var t = LS();
      (K(
        t,
        21,
        () => B(m),
        (e) => e.id,
        (e, t) => {
          var r = IS(),
            i = F(r),
            a = (e) => {
              var r = FS(),
                i = L(r);
              (z((e) => W(i, `En retard de ${e ?? ``} jours`), [() => joursDeRetard(B(t), n, etat.d.fermetures)]),
                U(e, r));
            },
            o = M(() => c(B(t)) === `livraison_depassee`);
          (G(i, (e) => {
            B(o) && e(a);
          }),
            CarteDemande(R(i), {
              get d() {
                return B(t);
              },
            }),
            A(r),
            U(e, r));
        },
      ),
        A(t),
        U(e, t));
    },
    ve = (e) => {
      U(e, RS());
    };
  (G(ge, (e) => {
    B(m).length ? e(_e) : e(ve, -1);
  }),
    A(de),
    A(D));
  var ye = R(D, 2),
    be = F(ye),
    xe = F(be);
  (Icone(F(xe), {
    n: `pilote`,
    taille: 18,
  }),
    A(xe),
    j(),
    A(be));
  var Se = R(be, 2),
    Ce = (e) => {
      var t = HS();
      (K(
        t,
        21,
        () => B(b),
        (e) => e.id,
        (e, t) => {
          var n = VS(),
            r = F(n),
            i = (e) => {
              var n = zS(),
                r = L(n, !0);
              (z(
                (e) => {
                  (J(n, `href`, e), W(r, B(t).texte));
                },
                [() => lienRoute(`demande-${B(t).demandeId}`)],
              ),
                U(e, n));
            },
            a = M(() => B(t).demandeId && etat.d.demandes.some((e) => e.id === B(t).demandeId)),
            o = (e) => {
              var n = BS(),
                r = L(n, !0);
              (z(() => W(r, B(t).texte)), U(e, n));
            };
          G(r, (e) => {
            B(a) ? e(i) : e(o, -1);
          });
          var s = L(R(r), !0);
          (A(n), z((e) => W(s, e), [() => x(B(t).date)]), U(e, n));
        },
      ),
        A(t),
        U(e, t));
    },
    O = (e) => {
      U(e, US());
    };
  G(Se, (e) => {
    B(b).length ? e(Ce) : e(O, -1);
  });
  var we = R(Se, 2);
  (Icone(R(F(we)), {
    n: `ar`,
  }),
    A(we),
    A(ye),
    A(te),
    A(E),
    A(ee),
    z((e) => J(we, `href`, e), [() => lienRoute(`pilotage`)]),
    wi(
      pe,
      () => B(d),
      (e) => P(d, e),
    ),
    U(e, w),
    Je());
}
kr([`click`]);
