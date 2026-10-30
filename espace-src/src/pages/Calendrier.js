// Composant Calendrier (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var $x = H(`<h2 class="t2 mois svelte-1pzjizl" aria-live="polite"> </h2>`),
  eS = H(`<button class="bt sm cl">Aujourd’hui</button>`),
  tS = H(`<option> </option>`),
  nS = H(
    `<label class="sr" for="cl-c">Client</label> <select id="cl-c" class="saisie sel svelte-1pzjizl"><option>Tous les clients</option><!></select>`,
    1,
  ),
  rS = H(`<li class="svelte-1pzjizl"><i></i> </li>`),
  iS = H(
    `<li class="svelte-1pzjizl"><i class="retard svelte-1pzjizl"></i>Livraison dépassée</li><li class="svelte-1pzjizl"><b class="num svelte-1pzjizl">12/30</b>Charge de la semaine sur la capacité</li>`,
    1,
  ),
  aS = H(`<button class="bt sm"><!>Une demande pour ce jour</button>`),
  oS = H(
    `<li><a class="ev-l carte-lien svelte-1pzjizl"><span> </span> <span class="ev-t svelte-1pzjizl"><b class="svelte-1pzjizl"> </b><small class="svelte-1pzjizl"> </small></span> <!></a></li>`,
  ),
  sS = H(`<ul class="evs svelte-1pzjizl"></ul>`),
  cS = H(`<p class="mu petit">Rien de prévu ce jour-là.</p>`),
  lS = H(`<div class="j-tete svelte-1pzjizl"><h3 class="t3"> </h3> <!></div> <!>`, 1),
  uS = H(`<p class="petit mu"><b class="num"> </b> livraisons et <b class="num"> </b> </p>`),
  dS = H(
    `<section class="carte cal svelte-1pzjizl"><!> <ul class="legende svelte-1pzjizl"><!> <li class="svelte-1pzjizl"><i class="parution svelte-1pzjizl"></i>Parution souhaitée</li> <!></ul></section> <section class="carte pad jour svelte-1pzjizl" aria-live="polite"><!></section>`,
    1,
  ),
  fS = H(
    `<li><a class="ev-l carte-lien svelte-1pzjizl"><span> </span> <span class="ev-t svelte-1pzjizl"><b class="svelte-1pzjizl"> </b><small class="svelte-1pzjizl"> </small></span></a></li>`,
  ),
  pS = H(
    `<li><span class="date svelte-1pzjizl"><b class="num svelte-1pzjizl"> </b> </span> <ul class="svelte-1pzjizl"></ul></li>`,
  ),
  mS = H(`<ol class="svelte-1pzjizl"></ol>`),
  hS = H(`<div class="vide"> </div>`),
  gS = H(`<section class="carte pad liste svelte-1pzjizl"><!></section>`),
  _S = H(
    `<!> <div class="feuille"><div class="w entre"><div class="barre svelte-1pzjizl"><div class="nav-mois svelte-1pzjizl"><button class="ico" aria-label="Mois précédent"><!></button> <!> <button class="ico" aria-label="Mois suivant"><!></button></div> <div class="droite svelte-1pzjizl"><!> <!> <!></div></div> <!></div></div>`,
    1,
  );
function Calendrier(e, t) {
  qe(t, !0);
  let n = M(estEquipe),
    r = aujourdhui(),
    i = N(en(Number(r.slice(0, 4)))),
    a = N(en(Number(r.slice(5, 7)))),
    o = N(en(r)),
    s = N(`mois`),
    c = N(``),
    l = (e) => {
      let t = B(i) * 12 + (B(a) - 1) + e;
      (P(i, Math.floor(t / 12), !0), P(a, (t % 12) + 1), P(o, null));
    },
    u = M(() => `${B(i)}-${String(B(a)).padStart(2, `0`)}`),
    d = {
      deposee: `t-gris`,
      accord_requis: `t-cor`,
      confirmee: `t-lavc`,
      production: `t-lav`,
      correction: `t-lav`,
      a_valider: `t-cor`,
      validee: `t-bon`,
      livree: `t-bon`,
      attente_client: `t-cor`,
      annulee: `t-gris`,
    },
    f = (e) => e.replace(/^(Commune|Ville) de /, ``),
    p = M(() => mesDemandes().filter((e) => e.statut !== `annulee` && (!B(c) || e.organisationId === B(c)))),
    m = M(() => {
      let e = [];
      for (let t of B(p)) {
        let i = B(n) ? f(organisation(t.organisationId).nom) : void 0;
        (t.livraison &&
          e.push({
            d: t,
            date: t.livraison,
            id: t.id,
            titre: t.titre,
            client: i,
            type: `livraison`,
            ton: d[t.statut],
            retard: alerteRetard(t, r, etat.d.fermetures) === `livraison_depassee`,
          }),
          t.parution &&
            t.parution !== t.livraison &&
            e.push({
              d: t,
              date: t.parution,
              id: t.id,
              titre: t.titre,
              client: i,
              type: `parution`,
              ton: d[t.statut],
            }));
      }
      return e.sort((e, t) => e.date.localeCompare(t.date));
    }),
    h = M(() => B(m).filter((e) => e.date.startsWith(B(u)))),
    g = M(() => {
      if (!B(n)) return {};
      let e = semaines(etat.d.demandes, `${B(u)}-01`, 6, etat.d.capacite, etat.d.fermetures);
      return Object.fromEntries(
        e.map((e) => [
          e.debut,
          {
            u: e.charge,
            cap: e.capacite,
          },
        ]),
      );
    }),
    _ = M(() => (B(o) ? B(m).filter((e) => e.date === B(o)) : [])),
    y = M(() =>
      B(h).reduce((e, t) => {
        let n = e.at(-1);
        return (n && n[0] === t.date ? n[1].push(t) : e.push([t.date, [t]]), e);
      }, []),
    ),
    b = [
      [`t-gris`, `Déposée`],
      [`t-lavc`, `Confirmée`],
      [`t-lav`, `En production`],
      [`t-cor`, `À la main du client`],
      [`t-bon`, `Validée, livrée`],
    ],
    x = M(moi),
    S = M(() => !B(n) && B(x).role !== `lecteur` && B(x).organisationId !== null),
    C = !0;
  wn(() => {
    (B(o),
      C
        ? (C = !1)
        : innerWidth < 760 &&
          queueMicrotask(() =>
            document.querySelector(`.jour`)?.scrollIntoView({
              behavior: `smooth`,
              block: `nearest`,
            }),
          ));
  });
  let w = (e) => {
      ((etat.prerempli = {
        parution: e,
      }),
        aller(`nouvelle`));
    },
    T = M(() => libelleMois(B(u)).replace(/^./, (e) => e.toUpperCase()));
  var ee = _S(),
    E = I(ee);
  EnTete(E, {
    titre: `Calendrier`,
  });
  var te = R(E, 2),
    D = F(te),
    ne = F(D),
    re = F(ne),
    ie = F(re);
  (Icone(F(ie), {
    n: `retour`,
  }),
    A(ie));
  var ae = R(ie, 2);
  Zr(
    ae,
    () => B(u),
    (e) => {
      var t = $x(),
        n = L(t, !0);
      (z(() => W(n, B(T))), U(e, t));
    },
  );
  var oe = R(ae, 2);
  (Icone(F(oe), {
    n: `suite`,
  }),
    A(oe),
    A(re));
  var se = R(re, 2),
    ce = F(se),
    le = (e) => {
      var t = eS();
      (V(`click`, t, () => {
        (P(i, Number(r.slice(0, 4)), !0), P(a, Number(r.slice(5, 7)), !0), P(o, r, !0));
      }),
        U(e, t));
    },
    ue = M(() => B(u) !== r.slice(0, 7));
  G(ce, (e) => {
    B(ue) && e(le);
  });
  var de = R(ce, 2),
    fe = (e) => {
      var t = nS(),
        n = R(I(t), 2),
        r = F(n);
      ((r.value = r.__value = ``),
        K(
          R(r),
          17,
          () => etat.d.organisations,
          Qr,
          (e, t) => {
            var n = tS(),
              r = L(n, !0),
              i = {};
            (z(() => {
              (W(r, B(t).nom), i !== (i = B(t).id) && (n.value = (n.__value = i) ?? ``));
            }),
              U(e, n));
          },
        ),
        A(n),
        Ci(n),
        wi(
          n,
          () => B(c),
          (e) => P(c, e),
        ),
        U(e, t));
    };
  (G(de, (e) => {
    B(n) && e(fe);
  }),
    Curseur(R(de, 2), {
      libelle: `Affichage`,
      petit: !0,
      options: [
        {
          id: `mois`,
          nom: `Mois`,
        },
        {
          id: `liste`,
          nom: `Liste`,
        },
      ],
      get valeur() {
        return B(s);
      },
      set valeur(e) {
        P(s, e, !0);
      },
    }),
    A(se),
    A(ne));
  var pe = R(ne, 2),
    me = (e) => {
      var t = dS(),
        s = I(t),
        c = F(s);
      Zr(
        c,
        () => B(u),
        (e) => {
          GrilleMois(e, {
            get annee() {
              return B(i);
            },
            get mois() {
              return B(a);
            },
            get evs() {
              return B(h);
            },
            get fermetures() {
              return etat.d.fermetures;
            },
            get charges() {
              return B(g);
            },
            get jour() {
              return B(o);
            },
            set jour(e) {
              P(o, e, !0);
            },
          });
        },
      );
      var l = R(c, 2),
        d = F(l);
      K(
        d,
        17,
        () => b,
        Qr,
        (e, t) => {
          var n = M(() => v(B(t), 2));
          let r = () => B(n)[0],
            i = () => B(n)[1];
          var a = rS(),
            o = F(a),
            s = R(o, 1, !0);
          (A(a),
            z(() => {
              (q(o, 1, fi(r()), `svelte-1pzjizl`), W(s, i()));
            }),
            U(e, a));
        },
      );
      var f = R(d, 4),
        p = (e) => {
          var t = iS();
          (j(), U(e, t));
        };
      (G(f, (e) => {
        B(n) && e(p);
      }),
        A(l),
        A(s));
      var m = R(s, 2),
        y = F(m),
        x = (e) => {
          var t = lS(),
            i = I(t),
            a = F(i),
            s = L(a, !0),
            c = R(a, 2),
            l = (e) => {
              var t = aS();
              (Icone(F(t), {
                n: `plus`,
                taille: 17,
              }),
                j(),
                A(t),
                V(`click`, t, () => w(B(o))),
                U(e, t));
            };
          (G(c, (e) => {
            B(S) && B(o) >= r && e(l);
          }),
            A(i));
          var u = R(i, 2),
            d = (e) => {
              var t = sS();
              (K(
                t,
                21,
                () => B(_),
                (e) => e.id + e.type,
                (e, t) => {
                  var r = oS(),
                    i = F(r),
                    a = F(i),
                    o = L(a, !0),
                    s = R(a, 2),
                    c = F(s),
                    l = L(c, !0),
                    u = L(R(c));
                  A(s);
                  var d = R(s, 2);
                  {
                    let e = M(() => !B(n));
                    FilEtat(d, {
                      get s() {
                        return B(t).d.statut;
                      },
                      get client() {
                        return B(e);
                      },
                      taille: `sm`,
                    });
                  }
                  (A(i),
                    A(r),
                    z(
                      (e, n) => {
                        (J(i, `href`, e),
                          q(a, 1, `ty ${B(t).ton ?? ``}`, `svelte-1pzjizl`),
                          W(o, B(t).type === `livraison` ? `Livraison` : `Parution`),
                          W(l, B(t).titre),
                          W(u, `${B(t).client ? `${B(t).client} · ` : ``}${n ?? ``}`));
                      },
                      [() => lienRoute(`demande-${B(t).id}`), () => resumeLignes(B(t).d.lignes)],
                    ),
                    U(e, r));
                },
              ),
                A(t),
                U(e, t));
            },
            f = (e) => {
              U(e, cS());
            };
          (G(u, (e) => {
            B(_).length ? e(d) : e(f, -1);
          }),
            z((e) => W(s, e), [() => jourLong(B(o)).replace(/^./, (e) => e.toUpperCase())]),
            U(e, t));
        },
        C = (e) => {
          var t = uS(),
            n = F(t),
            r = L(n, !0),
            i = R(n, 2),
            a = L(i, !0),
            o = R(i);
          (A(t),
            z(
              (e, t, n) => {
                (W(r, e), W(a, t), W(o, ` parutions en ${n ?? ``}. Touchez un jour pour le détail.`));
              },
              [
                () => B(h).filter((e) => e.type === `livraison`).length,
                () => B(h).filter((e) => e.type === `parution`).length,
                () => libelleMois(B(u)).split(` `)[0],
              ],
            ),
            U(e, t));
        };
      (G(y, (e) => {
        B(o) ? e(x) : e(C, -1);
      }),
        A(m),
        z(() => J(s, `aria-label`, `Calendrier de ${B(T) ?? ``}`)),
        U(e, t));
    },
    he = (e) => {
      var t = gS(),
        n = F(t),
        i = (e) => {
          var t = mS();
          (K(
            t,
            21,
            () => B(y),
            ([e, t]) => e,
            (e, t) => {
              var n = M(() => v(B(t), 2));
              let i = () => B(n)[0],
                a = () => B(n)[1];
              var o = pS();
              let s;
              var c = F(o),
                l = F(c),
                u = L(l, !0),
                d = R(l);
              A(c);
              var f = R(c, 2);
              (K(
                f,
                21,
                a,
                (e) => e.id + e.type,
                (e, t) => {
                  var n = fS(),
                    r = F(n),
                    i = F(r),
                    a = L(i, !0),
                    o = R(i, 2),
                    s = F(o),
                    c = L(s, !0),
                    l = L(R(s));
                  (A(o),
                    A(r),
                    A(n),
                    z(
                      (e) => {
                        (J(r, `href`, e),
                          q(i, 1, `ty ${B(t).ton ?? ``}`, `svelte-1pzjizl`),
                          W(a, B(t).type === `livraison` ? `Livraison` : `Parution`),
                          W(c, B(t).titre),
                          W(
                            l,
                            `${B(t).client ? `${B(t).client} · ` : ``}${LIBELLES_STATUT[B(t).d.statut] ?? ``}${B(t).retard ? ` · en retard` : ``}`,
                          ));
                      },
                      [() => lienRoute(`demande-${B(t).id}`)],
                    ),
                    U(e, n));
                },
              ),
                A(f),
                A(o),
                z(
                  (e, t) => {
                    ((s = q(o, 1, `jourL svelte-1pzjizl`, null, s, {
                      passe: i() < r,
                    })),
                      W(u, e),
                      W(d, `${t ?? ``}.`));
                  },
                  [() => Number(i().slice(8)), () => jourLong(i()).split(` `)[0].slice(0, 3)],
                ),
                U(e, o));
            },
          ),
            A(t),
            U(e, t));
        },
        a = (e) => {
          var t = hS(),
            n = L(t);
          (z((e) => W(n, `Rien de prévu en ${e ?? ``}.`), [() => libelleMois(B(u))]), U(e, t));
        };
      (G(n, (e) => {
        B(y).length ? e(i) : e(a, -1);
      }),
        A(t),
        z(() => J(t, `aria-label`, `Liste de ${B(T) ?? ``}`)),
        U(e, t));
    };
  (G(pe, (e) => {
    B(s) === `mois` ? e(me) : e(he, -1);
  }),
    A(D),
    A(te),
    V(`click`, ie, () => l(-1)),
    V(`click`, oe, () => l(1)),
    U(e, ee),
    Je());
}
kr([`click`]);
