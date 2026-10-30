// Composant Equipe (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var NC = H(`<button class="bt lg"><!>Inviter un collègue</button>`),
  PC = H(`<small class="num svelte-1hu659t"> </small>`),
  FC = H(`<button class="ico svelte-1hu659t"><!></button>`),
  IC = H(`<span class="svelte-1hu659t"></span>`),
  LC = H(
    `<li class="svelte-1hu659t"><span class="av svelte-1hu659t" aria-hidden="true"> </span> <span class="t svelte-1hu659t"><b class="svelte-1hu659t"> </b><small class="svelte-1hu659t"> </small></span> <span class="r svelte-1hu659t"><b class="svelte-1hu659t"> </b><!></span> <!></li>`,
  ),
  RC = H(
    `<div class="vide-eq svelte-1hu659t"><p class="mu">Vous êtes seul dans l’espace. Invitez les collègues qui préparent des sujets ou relisent les livrables : chacun dépose et suit ses demandes avec son propre accès.</p> <button class="bt"><!>Inviter un collègue</button></div>`,
  ),
  zC = H(`<li class="svelte-1hu659t"><b class="svelte-1hu659t"> </b><span class="svelte-1hu659t"> </span></li>`),
  BC = H(`<p class="petit svelte-1hu659t">Pour inviter quelqu’un, demandez au référent de votre structure.</p>`),
  VC = H(`<button class="bt cl">Annuler</button> <button class="bt">Envoyer l’invitation <!></button>`, 1),
  HC = H(`<button type="button" role="radio"><b> </b><small class="svelte-1hu659t"> </small></button>`),
  UC = H(
    `<div class="champ plaf"><span>Plafond mensuel sans accord</span><div class="pl svelte-1hu659t"><!><small class="mu svelte-1hu659t">unités par mois ; au-delà, vous donnez votre accord demande par demande.</small></div></div>`,
  ),
  WC = H(`<p class="note n-alerte"><!> </p>`),
  GC = H(
    `<div class="form svelte-1hu659t"><label class="champ" for="i-nom"><span>Prénom et nom</span><input id="i-nom" class="saisie" autocomplete="off" placeholder="Claire Le Goff"/></label> <label class="champ" for="i-mail"><span>Adresse e-mail professionnelle</span><input id="i-mail" class="saisie" type="email" autocomplete="off" placeholder="prenom.nom@structure.fr"/></label> <div class="champ"><span>Rôle</span> <div class="roles svelte-1hu659t" role="radiogroup" aria-label="Rôle"></div></div> <!> <!> <p class="petit mu"> </p></div>`,
  ),
  KC = H(`<button class="bt cl">Garder l’accès</button> <button class="bt">Retirer l’accès</button>`, 1),
  qC = H(`<button class="bt cl">Annuler</button> <button class="bt">Enregistrer <!></button>`, 1),
  JC = H(`<p> </p>`),
  YC = H(
    `<div class="champ plaf"><span>Plafond mensuel sans accord</span><div class="pl svelte-1hu659t"><!><small class="mu svelte-1hu659t">unités par mois</small></div></div>`,
  ),
  XC = H(
    `<div class="form svelte-1hu659t"><div class="roles svelte-1hu659t" role="radiogroup" aria-label="Rôle"></div> <!> <button class="lien-discret retirer svelte-1hu659t"><!>Retirer l’accès</button></div>`,
  ),
  ZC = H(
    `<!> <div class="feuille"><div class="w entre svelte-1hu659t"><section class="carte pad" aria-labelledby="t-eq"><h2 class="t2" id="t-eq"> </h2> <ul class="membres svelte-1hu659t"></ul> <!></section> <section class="regles svelte-1hu659t" aria-labelledby="t-roles"><span class="motif svelte-1hu659t" aria-hidden="true"></span> <h2 class="t3" id="t-roles">Les trois rôles</h2> <ol class="svelte-1hu659t"></ol> <!></section></div></div> <!> <!>`,
    1,
  );
function Equipe(e, t) {
  qe(t, !0);
  let n = M(moi),
    r = M(() => organisation(B(n).organisationId)),
    i = M(() =>
      [...membres(B(r).id)].sort(
        (e, t) => Number(t.role === `referent`) - Number(e.role === `referent`) || e.nom.localeCompare(t.nom),
      ),
    ),
    a = M(() => B(n).role === `referent`),
    o = {
      referent: {
        nom: `Référent`,
        det: `Dépose, valide les livrables, engage les unités, commande.`,
      },
      contributeur: {
        nom: `Contributeur`,
        det: `Dépose des demandes et relit ; au-delà de son plafond, le référent donne son accord.`,
      },
      lecteur: {
        nom: `Lecture seule`,
        det: `Suit les demandes et les livrables, sans déposer.`,
      },
    },
    s = (e) =>
      e
        .split(` `)
        .map((e) => e[0])
        .join(``)
        .slice(0, 2),
    c = N(!1),
    l = N(``),
    u = N(``),
    d = N(`contributeur`),
    f = N(6),
    p = N(!1),
    m = N(null),
    h = () => {
      (P(l, ``), P(u, ``), P(d, `contributeur`), P(f, 6), P(m, null), P(c, !0));
    },
    g = async () => {
      if ((P(m, null), B(l).trim().length < 2)) P(m, `Indiquez le prénom et le nom.`);
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(B(u).trim())) P(m, `Adresse e-mail invalide.`);
      else {
        P(p, !0);
        try {
          let e = await inviterMembre({
            nom: B(l).trim(),
            email: B(u).trim(),
            role: B(d),
            plafond: B(f),
          });
          (P(c, !1),
            toast(
              e.rouvert ? `Accès rouvert` : `Invitation envoyée`,
              `succes`,
              MODE_REEL
                ? `${B(l).trim()} reçoit un e-mail pour choisir son mot de passe.`
                : `Démonstration : aucun e-mail ne part.`,
            ));
        } catch (e) {
          P(m, e.message, !0);
        } finally {
          P(p, !1);
        }
      }
    },
    _ = N(null),
    v = N(!1),
    y = N(`contributeur`),
    b = N(6),
    x = N(!1),
    S = (e) => {
      (P(_, e, !0),
        P(y, e.role === `lecteur` ? `lecteur` : `contributeur`, !0),
        P(b, e.plafondMensuel ?? 0, !0),
        P(x, !1),
        P(v, !0));
    },
    C = async () => {
      if (B(_)) {
        P(p, !0);
        try {
          (await reglerMembre(B(_).id, B(y), B(b)), P(v, !1), toast(`Accès mis à jour`, `succes`, B(_).nom));
        } catch (e) {
          toast(e.message, `erreur`);
        } finally {
          P(p, !1);
        }
      }
    },
    w = async () => {
      if (B(_)) {
        P(p, !0);
        try {
          (await retirerMembre(B(_).id),
            P(v, !1),
            toast(`Accès retiré`, `info`, `${B(_).nom} ne peut plus se connecter à l’espace.`));
        } catch (e) {
          toast(e.message, `erreur`);
        } finally {
          P(p, !1);
        }
      }
    };
  var T = ZC(),
    ee = I(T);
  EnTete(ee, {
    titre: `Équipe`,
    get sous() {
      return B(r).nom;
    },
    actions: (e) => {
      var t = Br(),
        n = I(t),
        r = (e) => {
          var t = NC();
          (Icone(F(t), {
            n: `plus`,
          }),
            j(),
            A(t),
            V(`click`, t, h),
            U(e, t));
        };
      (G(n, (e) => {
        B(a) && e(r);
      }),
        U(e, t));
    },
    $$slots: {
      actions: !0,
    },
  });
  var E = R(ee, 2),
    te = F(E),
    D = F(te),
    ne = F(D),
    re = L(ne),
    ie = R(ne, 2);
  (K(
    ie,
    21,
    () => B(i),
    (e) => e.id,
    (e, t) => {
      var r = LC(),
        i = F(r),
        c = L(i, !0),
        l = R(i, 2),
        u = F(l),
        d = L(u),
        f = L(R(u), !0);
      A(l);
      var p = R(l, 2),
        m = F(p),
        h = L(m, !0),
        g = R(m),
        _ = (e) => {
          var n = PC(),
            r = L(n);
          (z(() => W(r, `jusqu’à ${B(t).plafondMensuel ?? 0 ?? ``} unités par mois sans accord`)), U(e, n));
        };
      (G(g, (e) => {
        B(t).role === `contributeur` && e(_);
      }),
        A(p));
      var v = R(p, 2),
        y = (e) => {
          var n = FC();
          (Icone(F(n), {
            n: `reglages`,
            taille: 19,
          }),
            A(n),
            z(() => J(n, `aria-label`, `Régler l’accès de ${B(t).nom ?? ``}`)),
            V(`click`, n, () => S(B(t))),
            U(e, n));
        },
        b = (e) => {
          U(e, IC());
        };
      (G(v, (e) => {
        B(a) && B(t).role !== `referent` ? e(y) : e(b, -1);
      }),
        A(r),
        z(
          (e) => {
            (W(c, e),
              W(d, `${B(t).nom ?? ``}${B(t).id === B(n).id ? ` (vous)` : ``}`),
              W(f, B(t).email),
              W(h, o[B(t).role]?.nom ?? B(t).role));
          },
          [() => s(B(t).nom)],
        ),
        U(e, r));
    },
  ),
    A(ie));
  var ae = R(ie, 2),
    oe = (e) => {
      var t = RC(),
        n = R(F(t), 2);
      (Icone(F(n), {
        n: `plus`,
      }),
        j(),
        A(n),
        A(t),
        V(`click`, n, h),
        U(e, t));
    };
  (G(ae, (e) => {
    B(a) && B(i).length === 1 && e(oe);
  }),
    A(D));
  var se = R(D, 2),
    ce = R(F(se), 4);
  (K(
    ce,
    21,
    () => Object.values(o),
    Qr,
    (e, t) => {
      var n = zC(),
        r = F(n),
        i = L(r, !0),
        a = L(R(r), !0);
      (A(n),
        z(() => {
          (W(i, B(t).nom), W(a, B(t).det));
        }),
        U(e, n));
    },
  ),
    A(ce));
  var le = R(ce, 2),
    ue = (e) => {
      U(e, BC());
    };
  (G(le, (e) => {
    B(a) || e(ue);
  }),
    A(se),
    A(te),
    A(E));
  var de = R(E, 2);
  Volet(de, {
    titre: `Inviter un collègue`,
    get sous() {
      return B(r).nom;
    },
    get ouverte() {
      return B(c);
    },
    set ouverte(e) {
      P(c, e, !0);
    },
    pied: (e) => {
      var t = VC(),
        n = I(t),
        r = R(n, 2);
      (Fleche(R(F(r)), {}),
        A(r),
        z(() => (r.disabled = B(p))),
        V(`click`, n, () => P(c, !1)),
        V(`click`, r, g),
        U(e, t));
    },
    children: (e, t) => {
      var n = GC(),
        i = F(n),
        a = R(F(i));
      (ji(a), A(i));
      var s = R(i, 2),
        c = R(F(s));
      (ji(c), A(s));
      var p = R(s, 2),
        h = R(F(p), 2);
      (K(
        h,
        20,
        () => [`contributeur`, `lecteur`],
        Qr,
        (e, t) => {
          var n = HC();
          let r;
          var i = F(n),
            a = L(i, !0),
            s = L(R(i), !0);
          (A(n),
            z(() => {
              (J(n, `aria-checked`, B(d) === t),
                (r = q(n, 1, `choix role svelte-1hu659t`, null, r, {
                  on: B(d) === t,
                })),
                W(a, o[t].nom),
                W(s, o[t].det));
            }),
            V(`click`, n, () => P(d, t, !0)),
            U(e, n));
        },
      ),
        A(h),
        A(p));
      var g = R(p, 2),
        _ = (e) => {
          var t = UC(),
            n = R(F(t));
          (Quantite(F(n), {
            min: 0,
            max: 60,
            libelle: `Plafond mensuel en unités`,
            get valeur() {
              return B(f);
            },
            set valeur(e) {
              P(f, e, !0);
            },
          }),
            j(),
            A(n),
            A(t),
            U(e, t));
        };
      G(g, (e) => {
        B(d) === `contributeur` && e(_);
      });
      var v = R(g, 2),
        y = (e) => {
          var t = WC(),
            n = F(t);
          Icone(n, {
            n: `alerte`,
          });
          var r = R(n, 1, !0);
          (A(t), z(() => W(r, B(m))), U(e, t));
        };
      G(v, (e) => {
        B(m) && e(y);
      });
      var b = L(R(v, 2));
      (A(n),
        z(() =>
          W(
            b,
            `La personne reçoit un e-mail de Fill pour choisir son mot de passe, puis arrive dans l’espace de ${B(r).nom ?? ``}.`,
          ),
        ),
        Ii(
          a,
          () => B(l),
          (e) => P(l, e),
        ),
        Ii(
          c,
          () => B(u),
          (e) => P(u, e),
        ),
        U(e, n));
    },
    $$slots: {
      pied: !0,
      default: !0,
    },
  });
  var fe = R(de, 2);
  {
    let e = (e) => {
        var t = Br(),
          n = I(t),
          r = (e) => {
            var t = KC(),
              n = I(t),
              r = R(n, 2);
            (z(() => (r.disabled = B(p))), V(`click`, n, () => P(x, !1)), V(`click`, r, w), U(e, t));
          },
          i = (e) => {
            var t = qC(),
              n = I(t),
              r = R(n, 2);
            (Fleche(R(F(r)), {}),
              A(r),
              z(() => (r.disabled = B(p))),
              V(`click`, n, () => P(v, !1)),
              V(`click`, r, C),
              U(e, t));
          };
        (G(n, (e) => {
          B(x) ? e(r) : e(i, -1);
        }),
          U(e, t));
      },
      t = M(() => B(_)?.nom ?? ``),
      n = M(() => B(_)?.email ?? ``);
    Volet(fe, {
      get titre() {
        return B(t);
      },
      get sous() {
        return B(n);
      },
      get ouverte() {
        return B(v);
      },
      set ouverte(e) {
        P(v, e, !0);
      },
      pied: e,
      children: (e, t) => {
        var n = Br(),
          r = I(n),
          i = (e) => {
            var t = JC(),
              n = L(t);
            (z(() =>
              W(
                n,
                `${B(_)?.nom ?? ``} ne pourra plus se connecter à l’espace. Ses demandes restent visibles par l’équipe.`,
              ),
            ),
              U(e, t));
          },
          a = (e) => {
            var t = XC(),
              n = F(t);
            (K(
              n,
              20,
              () => [`contributeur`, `lecteur`],
              Qr,
              (e, t) => {
                var n = HC();
                let r;
                var i = F(n),
                  a = L(i, !0),
                  s = L(R(i), !0);
                (A(n),
                  z(() => {
                    (J(n, `aria-checked`, B(y) === t),
                      (r = q(n, 1, `choix role svelte-1hu659t`, null, r, {
                        on: B(y) === t,
                      })),
                      W(a, o[t].nom),
                      W(s, o[t].det));
                  }),
                  V(`click`, n, () => P(y, t, !0)),
                  U(e, n));
              },
            ),
              A(n));
            var r = R(n, 2),
              i = (e) => {
                var t = YC(),
                  n = R(F(t));
                (Quantite(F(n), {
                  min: 0,
                  max: 60,
                  libelle: `Plafond mensuel en unités`,
                  get valeur() {
                    return B(b);
                  },
                  set valeur(e) {
                    P(b, e, !0);
                  },
                }),
                  j(),
                  A(n),
                  A(t),
                  U(e, t));
              };
            G(r, (e) => {
              B(y) === `contributeur` && e(i);
            });
            var a = R(r, 2);
            (Icone(F(a), {
              n: `corbeille`,
              taille: 16,
            }),
              j(),
              A(a),
              A(t),
              V(`click`, a, () => P(x, !0)),
              U(e, t));
          };
        (G(r, (e) => {
          B(x) ? e(i) : e(a, -1);
        }),
          U(e, n));
      },
      $$slots: {
        pied: !0,
        default: !0,
      },
    });
  }
  (z(() => W(re, `${B(i).length ?? ``} personne${B(i).length > 1 ? `s` : ``} dans l’espace`)), U(e, T), Je());
}
kr([`click`]);
