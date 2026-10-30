// Composant CommandeUnites (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var v_ = H(`<p class="note n-cible svelte-zjqnox"><!> </p>`),
  y_ = H(
    `<p class="svelte-zjqnox">Vos unités arrivent avec le premier règlement : <b> </b> </p> <button class="bt"><!> </button>`,
    1,
  ),
  b_ = H(
    `<div class="ligne-r svelte-zjqnox"><!> <p class="svelte-zjqnox"><b class="num"> </b><small class="svelte-zjqnox"> </small></p></div> <button class="bt"><!> </button>`,
    1,
  ),
  x_ = H(
    `<div class="ligne-r svelte-zjqnox"><!> <p class="svelte-zjqnox"><b class="num"> </b><small class="svelte-zjqnox">sur bon de commande, facturées avec la période en cours via Chorus Pro</small></p></div> <button class="bt"><!> </button>`,
    1,
  ),
  S_ = H(`<p class="note n-bon svelte-zjqnox"><!> </p>`),
  C_ = H(`<button class="lien-discret annuler svelte-zjqnox">Annuler cette commande</button>`),
  w_ = H(
    `<ol class="etapes-bc svelte-zjqnox"><li class="svelte-zjqnox"><span class="pt svelte-zjqnox">1</span> <div class="svelte-zjqnox"><b>Bon de commande prérempli</b><small class="svelte-zjqnox"> </small></div> <button class="bt sm cl svelte-zjqnox"><!>Ouvrir</button></li> <li class="svelte-zjqnox"><span class="pt svelte-zjqnox">2</span> <div class="depot svelte-zjqnox"><b class="svelte-zjqnox">Une fois signé : le bon ou son numéro d’engagement</b> <label><!> <input class="sr" type="file" accept=".pdf,image/*"/></label> <label class="eng svelte-zjqnox"><span class="sr">Numéro d’engagement</span><input class="saisie svelte-zjqnox" maxlength="60" placeholder="ou n° d’engagement" autocomplete="off"/></label> <button class="bt sm">Envoyer à Fill <!></button></div></li></ol> <!>`,
    1,
  ),
  T_ = H(`<div class="recharge svelte-zjqnox"><!></div>`);
function CommandeUnites(e, t) {
  qe(t, !0);
  let n = Ki(t, `manque`, 3, 0),
    r = M(moi),
    i = M(() => organisation(B(r).organisationId)),
    a = M(() => formule(B(i).formule)),
    o = M(() => lg(B(i).formule, B(i).engagementMois)),
    s = M(() => etat.d.utilisateurs.find((e) => e.organisationId === B(i).id && e.role === `referent`)),
    c = M(() => B(r).role === `referent`),
    l = M(() => B(i).statut === `a_activer`),
    u = M(
      () =>
        etat.d.commandes
          .filter((e) => e.organisationId === B(i).id && e.statut === `a_valider`)
          .sort((e, t) => t.date.localeCompare(e.date))[0],
    ),
    d = M(() =>
      B(l) ? !!(B(i).bonCommande || B(i).numeroEngagement) : !!(B(u)?.bonCommande || B(u)?.numeroEngagement),
    ),
    f = N(0);
  wn(() => {
    B(f) || P(f, Math.max(1, Math.min(60, n() || 10)), !0);
  });
  let p = N(!1),
    m = N(``),
    h = N(null),
    g = async (e) => {
      P(p, !0);
      try {
        await e();
      } catch (e) {
        toast(e.message, `erreur`);
      } finally {
        P(p, !1);
      }
    },
    _ = () =>
      g(async () => {
        (t.avant?.(),
          (await payerOuverture()) &&
            (feter({
              motif: `commande`,
              titre: `Paiement reçu`,
              detail: `${B(a).unites} unités sont créditées.`,
              actions: [
                {
                  libelle: `Continuer`,
                  principal: !0,
                },
              ],
            }),
            t.fait?.()));
      }),
    v = () =>
      g(async () => {
        (t.avant?.(),
          (await commanderUnites(B(f))) === `creditee` &&
            (feter({
              motif: `commande`,
              titre: `${B(f)} unité${B(f) > 1 ? `s` : ``} ajoutée${B(f) > 1 ? `s` : ``}`,
              detail: `Elles sont disponibles dès maintenant.`,
              actions: [
                {
                  libelle: `Continuer`,
                  principal: !0,
                },
              ],
            }),
            t.fait?.()));
      }),
    y = () =>
      g(async () => {
        (t.avant?.(),
          await commanderUnites(B(f)),
          toast(
            `Commande enregistrée`,
            `succes`,
            `Téléchargez le bon de commande, faites-le signer, puis déposez-le ici.`,
          ));
      }),
    b = () => (B(l) ? bonOuverture(B(i), aujourdhui()) : B(u) ? bonCommande(B(i), B(u)) : null),
    x = () => {
      let e = b();
      e && ouvrirHtml(htmlBon(e, B(i), B(s)));
    },
    S = () =>
      g(async () => {
        (await envoyerBonCommande({
          fichier: B(h),
          engagement: B(m),
          commandeId: B(l) ? void 0 : B(u)?.id,
        }),
          P(h, null),
          P(m, ``),
          toast(
            `Bon de commande reçu`,
            `succes`,
            `Fill le vérifie et crédite les unités dans la journée ouvrée ; vous êtes prévenu par e-mail.`,
          ));
      }),
    C = (e) => {
      P(h, e.currentTarget.files?.[0] ?? null, !0);
    };
  var w = T_(),
    T = F(w),
    ee = (e) => {
      var t = v_(),
        n = F(t);
      Icone(n, {
        n: `info`,
      });
      var r = R(n);
      (A(t),
        z(() =>
          W(
            r,
            `Seul le référent${B(s) ? ` (${B(s).nom})` : ``} peut recharger le compte. Prévenez-le : dès que les unités sont là, vous pourrez envoyer.`,
          ),
        ),
        U(e, t));
    },
    E = (e) => {
      var t = Br(),
        r = I(t),
        i = (e) => {
          var t = y_(),
            n = I(t),
            r = R(F(n)),
            i = L(r),
            s = R(r);
          A(n);
          var c = R(n, 2),
            l = F(c);
          Icone(l, {
            n: `panier`,
            taille: 18,
          });
          var u = R(l);
          (A(c),
            z(
              (e, t) => {
                (W(i, `${e ?? ``}`),
                  W(
                    s,
                    ` pour le premier mois (${B(a).unites ?? ``} unités)${B(o).miseEnPlace ? ` et la mise en place` : ``}, par carte ci-dessous ou par virement automatique (IBAN sur la facture envoyée par Fill). Elles sont créditées dès le paiement par carte, ou à réception du virement.`,
                  ),
                  (c.disabled = B(p)),
                  W(u, `Régler ${t ?? ``} par carte`));
              },
              [() => euros(B(o).premierReglement), () => euros(B(o).premierReglement)],
            ),
            V(`click`, c, _),
            U(e, t));
        },
        s = (e) => {
          var t = b_(),
            r = I(t),
            i = F(r);
          {
            let e = M(() => Math.max(1, n()));
            Quantite(i, {
              get min() {
                return B(e);
              },
              get max() {
                return 60;
              },
              libelle: `Unités à ajouter`,
              get valeur() {
                return B(f);
              },
              set valeur(e) {
                P(f, e, !0);
              },
            });
          }
          var a = R(i, 2),
            o = F(a),
            s = L(o),
            c = L(R(o));
          (A(a), A(r));
          var l = R(r, 2),
            u = F(l);
          Icone(u, {
            n: `panier`,
            taille: 18,
          });
          var d = R(u);
          (A(l),
            z(
              (e, t, n) => {
                (W(s, `${B(f) ?? ``} unité${B(f) > 1 ? `s` : ``} · ${e ?? ``}`),
                  W(c, `${t ?? ``} l’unité, créditées dès le paiement reçu`),
                  (l.disabled = B(p)),
                  W(d, `Payer ${n ?? ``} par carte`));
              },
              [() => euros(og(B(f))), () => euros(OFFRE.uniteSup), () => euros(og(B(f)))],
            ),
            V(`click`, l, v),
            U(e, t));
        };
      (G(r, (e) => {
        B(l) ? e(i) : e(s, -1);
      }),
        U(e, t));
    },
    te = (e) => {
      var t = x_(),
        r = I(t),
        i = F(r);
      {
        let e = M(() => Math.max(1, n()));
        Quantite(i, {
          get min() {
            return B(e);
          },
          get max() {
            return 60;
          },
          libelle: `Unités à commander`,
          get valeur() {
            return B(f);
          },
          set valeur(e) {
            P(f, e, !0);
          },
        });
      }
      var a = R(i, 2),
        o = L(F(a));
      (j(), A(a), A(r));
      var s = R(r, 2),
        c = F(s);
      Icone(c, {
        n: `panier`,
        taille: 18,
      });
      var l = R(c);
      (A(s),
        z(
          (e) => {
            (W(o, `${B(f) ?? ``} unité${B(f) > 1 ? `s` : ``} · ${e ?? ``}`),
              (s.disabled = B(p)),
              W(l, `Commander ${B(f) ?? ``} unités`));
          },
          [() => euros(og(B(f)))],
        ),
        V(`click`, s, y),
        U(e, t));
    },
    D = (e) => {
      var t = S_(),
        n = F(t);
      Icone(n, {
        n: `horloge`,
      });
      var r = R(n);
      (A(t),
        z(() =>
          W(
            r,
            `${B(l) ? `Bon de commande reçu` : `Commande de ${B(u)?.unites} unités : bon reçu`}${(B(l) ? B(i).numeroEngagement : B(u)?.numeroEngagement) ? ` (engagement ${B(l) ? B(i).numeroEngagement : B(u)?.numeroEngagement})` : ``}. Fill le vérifie et crédite les unités dans la journée ouvrée ; vous êtes prévenu par e-mail.`,
          ),
        ),
        U(e, t));
    },
    ne = (e) => {
      let t = M(b);
      var n = w_(),
        r = I(n),
        o = F(r),
        s = R(F(o), 2),
        c = L(R(F(s)));
      A(s);
      var d = R(s, 2);
      (Icone(F(d), {
        n: `fichier`,
        taille: 16,
      }),
        j(),
        A(d),
        A(o));
      var f = R(o, 2),
        _ = R(F(f), 2),
        v = R(F(_), 2);
      let y;
      var w = F(v);
      Icone(w, {
        n: `trombone`,
        taille: 16,
      });
      var T = R(w, 1, !0),
        ee = R(T);
      A(v);
      var E = R(v, 2),
        te = R(F(E));
      (ji(te), A(E));
      var D = R(E, 2);
      (Fleche(R(F(D)), {}), A(D), A(_), A(f), A(r));
      var ne = R(r, 2),
        re = (e) => {
          var t = C_();
          (z(() => (t.disabled = B(p))), V(`click`, t, () => g(() => annulerCommande(B(u).id))), U(e, t));
        };
      (G(ne, (e) => {
        B(u) && !B(l) && e(re);
      }),
        z(
          (e, t, n) => {
            (W(c, `${e ?? ``} · ${t ?? ``}`),
              (y = q(v, 1, `bt sm cl fichier svelte-zjqnox`, null, y, {
                pris: B(h),
              })),
              W(T, B(h) ? B(h).name : `Joindre le bon signé`),
              (D.disabled = n));
          },
          [
            () =>
              B(l)
                ? `Abonnement ${B(a).nom}, ${B(i).engagementMois} mois`
                : `${B(u)?.unites} unités commandées le ${jourMois(B(u).date.slice(0, 10))}`,
            () => (B(t) ? euros(totalBon(B(t))) : ``),
            () => B(p) || (!B(h) && !B(m).trim()),
          ],
        ),
        V(`click`, d, x),
        V(`change`, ee, C),
        Ii(
          te,
          () => B(m),
          (e) => P(m, e),
        ),
        V(`click`, D, S),
        U(e, n));
    };
  (G(T, (e) => {
    B(c) ? (B(i).type === `entreprise` ? e(E, 1) : !B(l) && !B(u) ? e(te, 2) : B(d) ? e(D, 3) : e(ne, -1)) : e(ee);
  }),
    A(w),
    U(e, w),
    Je());
}
kr([`click`, `change`]);
