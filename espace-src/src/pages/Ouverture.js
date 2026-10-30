// Composant Ouverture (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var ag = [5, 10, 20],
  og = (e) => e * OFFRE.uniteSup,
  sg = (e, t) => {
    let n = [`essentiel`, `regulier`, `soutenu`],
      r = n.indexOf(e);
    if (r < 0 || r === n.length - 1) return null;
    let i = formule(e),
      a = formule(n[r + 1]);
    return i.prix + Math.max(0, t - i.unites) * OFFRE.uniteSup > a.prix ? a.id : null;
  },
  cg = 0.3,
  lg = (e, t) => {
    let n = formule(e),
      r = t >= OFFRE.engagementLong,
      i = r ? 0 : n.mise_en_place,
      a = Math.round(i * cg * 100) / 100;
    return {
      formule: e,
      engagementMois: t,
      mensuel: n.prix,
      miseEnPlace: i,
      miseEnPlaceOfferte: r && n.mise_en_place > 0,
      acompte: a,
      premiereFacture: n.prix + i - a,
      premierReglement: n.prix + i,
      totalEngagement: n.prix * t + i,
    };
  },
  ug = (e) => e.replace(/\D/g, ``),
  dg = (e) => ug(e).length === 14,
  fg = H(`<li><span class="pt svelte-yzl1dj"><!></span><span class="lib svelte-yzl1dj"> </span></li>`),
  pg = H(
    `<div class="carte pad fin svelte-yzl1dj"><span class="rond svelte-yzl1dj"><!></span> <h2 class="t2">Confirmez votre adresse</h2> <p class="mu">Un lien de confirmation vient de partir vers <b> </b>. Ouvrez-le, depuis cet appareil ou un autre : votre espace s’ouvre aussitôt.</p></div>`,
  ),
  mg = H(`<small class="err svelte-yzl1dj"> </small>`),
  hg = H(
    `<h2 class="t2">Votre structure</h2> <div class="types svelte-yzl1dj" role="radiogroup" aria-label="Type de structure"><button type="button" role="radio"><!><b class="svelte-yzl1dj">Une collectivité</b><small class="svelte-yzl1dj">Commune, intercommunalité, syndicat, établissement public</small></button> <button type="button" role="radio"><!><b class="svelte-yzl1dj">Une entreprise</b><small class="svelte-yzl1dj">PME, commerce, association employeuse</small></button></div> <label class="champ" for="o-nom"><span> </span> <input id="o-nom" autocomplete="organization"/> <!></label> <label class="champ" for="o-siret"><span>SIRET</span> <input id="o-siret" inputmode="numeric" placeholder="212 900 000 00012" maxlength="24" autocomplete="off"/> <small> </small></label>`,
    1,
  ),
  gg = H(
    `<button type="button" role="radio"><span class="nomf svelte-yzl1dj"> <span class="it svelte-yzl1dj"> </span></span> <span class="prix num svelte-yzl1dj"> <small class="svelte-yzl1dj">par mois</small></span> <span class="det svelte-yzl1dj"><b> </b> </span> <span class="coche svelte-yzl1dj" aria-hidden="true"><!></span></button>`,
  ),
  _g = H(`<li class="svelte-yzl1dj"><span> </span><b class="num"> </b></li>`),
  vg = H(
    `<h2 class="t2">Votre formule</h2> <p class="mu">Les mêmes prix pour une commune ou une entreprise. Vous pourrez changer de formule chaque mois.</p> <div class="formules svelte-yzl1dj" role="radiogroup" aria-label="Formule"></div> <div class="eng svelte-yzl1dj"><span class="libelle">Engagement</span> <div class="engs svelte-yzl1dj" role="radiogroup" aria-label="Durée d’engagement"><button type="button" role="radio"><b class="svelte-yzl1dj">6 mois</b><small class="svelte-yzl1dj"> </small></button> <button type="button" role="radio"><b class="svelte-yzl1dj">12 mois</b><small class="svelte-yzl1dj">Mise en place offerte</small></button></div> <p class="tres-petit mu">Ensuite, résiliable chaque mois avec un mois de préavis.</p></div> <details class="equiv svelte-yzl1dj"><summary class="svelte-yzl1dj"> </summary> <ul class="svelte-yzl1dj"></ul></details>`,
    1,
  ),
  yg = H(
    `<label class="champ" for="o-mdp"><span>Mot de passe</span> <span class="mdp svelte-yzl1dj"><input id="o-mdp" autocomplete="new-password" minlength="8"/><button type="button" class="voir svelte-yzl1dj"><!></button></span> <small> </small></label>`,
  ),
  bg = H(
    `<label class="champ" for="o-m"><span>Adresse e-mail professionnelle</span> <input id="o-m" type="email" inputmode="email" autocomplete="email" placeholder="prenom.nom@commune.fr"/> <small> </small></label> <!>`,
    1,
  ),
  xg = H(
    `<h2 class="t2">Votre interlocuteur</h2> <p class="mu">La personne qui valide les livrables et engage les unités. Elle pourra inviter ses collègues ensuite.</p> <label class="champ" for="o-p"><span>Prénom et nom</span> <input id="o-p" autocomplete="name" placeholder="Prénom Nom"/> <!></label> <label class="champ" for="o-f"><span>Fonction <small>(facultatif)</small></span> <input id="o-f" class="saisie" autocomplete="organization-title"/></label> <label class="champ" for="o-t"><span>Téléphone <small>(facultatif)</small></span> <input id="o-t" class="saisie" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78"/> <small>Fill vous appelle pour caler le volume d’unités, si vous le souhaitez.</small></label> <!>`,
    1,
  ),
  Sg = H(`<small class="svelte-yzl1dj"> </small>`),
  Cg = H(`<small class="num svelte-yzl1dj"> </small>`),
  wg = H(`<p class="note n-danger" role="alert"><!> </p>`),
  Tg = H(
    `<h2 class="t2">Récapitulatif</h2> <dl class="recap carte pad svelte-yzl1dj"><div class="svelte-yzl1dj"><dt class="svelte-yzl1dj">Structure</dt><dd class="svelte-yzl1dj"> <small class="num svelte-yzl1dj"> </small></dd></div> <div class="svelte-yzl1dj"><dt class="svelte-yzl1dj">Formule</dt><dd class="svelte-yzl1dj"> <small class="svelte-yzl1dj"> </small></dd></div> <div class="svelte-yzl1dj"><dt class="svelte-yzl1dj">Interlocuteur</dt><dd class="svelte-yzl1dj"> <!><!></dd></div></dl> <label class="accepte svelte-yzl1dj"><input type="checkbox" class="svelte-yzl1dj"/><span>J’accepte les <a class="lien" href="https://fill.studioes.fr/conditions/" target="_blank" rel="noopener">conditions générales</a> et l’accord de traitement des données.</span></label> <!>`,
    1,
  ),
  Eg = H(`<div class="pas entre svelte-yzl1dj"><!></div>`),
  Dg = H(`<button class="bt cl svelte-yzl1dj"><!>Retour</button>`),
  Og = H(`<span></span>`),
  kg = H(`<button class="bt lg svelte-yzl1dj">Continuer <!></button>`),
  Ag = H(`<button class="bt lg svelte-yzl1dj">Créer mon espace <!></button>`),
  jg = H(`<div class="pied svelte-yzl1dj"><!> <!></div>`),
  Mg = H(`<p><b> </b></p> <p class="mu"> </p>`, 1),
  Ng = H(
    `<p><b>Aucun paiement en ligne</b></p> <p class="mu">Fill vous contacte sous 24 h ouvrées pour caler le volume d’unités, puis vous envoie le devis et le bon de commande. Votre espace est accessible tout de suite ; les unités sont créditées à réception du bon signé. Facture chaque mois à la date anniversaire de l’abonnement, sur Chorus Pro, paiement à 30 jours.</p>`,
    1,
  ),
  Pg = H(
    `<main class="ouverture"><header class="tete svelte-yzl1dj"><span class="motif svelte-yzl1dj" aria-hidden="true"></span> <div class="w svelte-yzl1dj"><div class="barre svelte-yzl1dj"><a aria-label="Retour à la connexion"><!></a><a class="lien-discret">J’ai déjà un compte</a></div> <h1 class="t1">Ouvrir un compte</h1> <ol class="etapes svelte-yzl1dj" aria-label="Étapes"></ol></div></header> <section class="feuille"><div class="w grille svelte-yzl1dj"><div class="col svelte-yzl1dj"><!> <!></div> <aside class="resume svelte-yzl1dj"><span class="motif2 svelte-yzl1dj" aria-hidden="true"></span> <p class="it sur svelte-yzl1dj">Votre abonnement</p> <p class="nomr d svelte-yzl1dj"> </p> <p class="grand num svelte-yzl1dj"> <small class="svelte-yzl1dj">par mois</small></p> <ul class="lignes num svelte-yzl1dj"><li class="svelte-yzl1dj"><span class="svelte-yzl1dj"> </span><span class="svelte-yzl1dj">inclus</span></li> <li class="svelte-yzl1dj"><span class="svelte-yzl1dj">Mise en place</span><span class="svelte-yzl1dj"> </span></li> <li class="svelte-yzl1dj"><span class="svelte-yzl1dj">Engagement</span><span class="svelte-yzl1dj"> </span></li> <li class="tot svelte-yzl1dj"><span class="svelte-yzl1dj">Sur la durée d’engagement</span><span class="svelte-yzl1dj"> </span></li></ul> <div class="paie svelte-yzl1dj"><!></div> <p class="tres-petit mu">TVA non applicable, article 293 B du CGI.</p></aside></div></section></main>`,
  );
function Ouverture(e, t) {
  qe(t, !0);
  let n = [`Votre structure`, `Votre formule`, `Votre interlocuteur`, `Récapitulatif`],
    r = N(0),
    i = N(`collectivite`),
    a = N(``),
    o = N(``),
    s = N(`regulier`),
    c = N(12),
    l = N(``),
    u = N(``),
    d = N(``),
    f = N(``),
    p = N(``),
    m = N(!1),
    h = N(!1),
    g = N(en({})),
    v = N(!1),
    y = N(!1);
  wn(() => {
    document.documentElement.dataset.cible = B(i) === `entreprise` ? `e` : `c`;
  });
  let b = M(() => lg(B(s), B(c))),
    x = M(() => formule(B(s))),
    S = () => {
      let e = {};
      return (
        B(r) === 0 &&
          (B(a).trim().length < 2 &&
            (e.structure =
              B(i) === `collectivite` ? `Indiquez le nom de la collectivité.` : `Indiquez le nom de l’entreprise.`),
          dg(B(o)) || (e.siret = `Le SIRET compte 14 chiffres (${ug(B(o)).length} saisis pour l’instant).`)),
        B(r) === 2 &&
          (B(l).trim().split(/\s+/).length < 2 && (e.nom = `Indiquez votre prénom et votre nom.`),
          (MODE_REEL && etat.sessionSansProfil) ||
            (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(B(f).trim()) || (e.email = `Saisissez une adresse e-mail complète.`),
            MODE_REEL && B(p).length < 8 && (e.mdp = `Choisissez un mot de passe de 8 caractères au moins.`))),
        B(r) === 3 && !B(h) && (e.cgv = `Acceptez les conditions générales pour continuer.`),
        P(g, e, !0),
        !Object.keys(e).length
      );
    },
    C = () => {
      S() &&
        (Zt(r),
        scrollTo({
          top: 0,
          behavior: `smooth`,
        }));
    },
    w = async () => {
      if (S()) {
        P(v, !0);
        try {
          if (MODE_REEL && !etat.sessionSansProfil) {
            let e = {
              type: B(i),
              structure: B(a),
              siret: B(o),
              fo: B(s),
              engagement: B(c),
              nom: B(l),
              fonction: B(u),
              telephone: B(d),
            };
            if (
              (sessionStorage.setItem(`fill-ouverture`, JSON.stringify(e)), !(await inscrire(B(f).trim(), B(p), e)))
            ) {
              P(y, !0);
              return;
            }
          }
          try {
            sessionStorage.removeItem(`fill-ouverture`);
          } catch {}
          (await creerCompte({
            structure: B(a),
            type: B(i),
            siret: ug(B(o)),
            nom: B(l),
            fonction: B(u),
            telephone: B(d),
            email: B(f),
            formule: B(s),
            engagement: B(c),
          }),
            aller(`accueil`),
            feter({
              motif: `bienvenue`,
              titre: `Votre espace est ouvert`,
              detail:
                B(i) === `entreprise`
                  ? `Invitez vos collègues et déposez vos demandes dès maintenant. Vos ${B(x).unites} unités sont créditées au premier règlement : par carte depuis l’accueil, ou par virement automatique (IBAN sur la facture envoyée par Fill). Le jour de ce règlement devient votre échéance mensuelle.`
                  : `Invitez vos collègues et déposez vos demandes dès maintenant. Fill vous contacte sous 24 h ouvrées pour caler le volume d’unités ; les unités sont créditées à réception du bon de commande signé.`,
              actions: [
                {
                  libelle: `Découvrir mon espace`,
                  principal: !0,
                },
              ],
            }));
        } catch (e) {
          toast(e.message, `erreur`);
        } finally {
          P(v, !1);
        }
      }
    },
    T = !1;
  wn(() => {
    MODE_REEL &&
      etat.sessionSansProfil &&
      !T &&
      ((T = !0),
      (async () => {
        let e = null;
        try {
          e = JSON.parse(sessionStorage.getItem(`fill-ouverture`) ?? `null`);
        } catch {}
        ((e ??= await ouvertureEnAttente().catch(() => null)),
          e &&
            (P(i, e.type, !0),
            P(a, e.structure, !0),
            P(o, e.siret, !0),
            P(s, e.fo, !0),
            P(c, e.engagement, !0),
            P(l, e.nom, !0),
            P(u, e.fonction, !0),
            P(d, _(e.telephone, ``), !0),
            P(r, 3),
            P(h, !0),
            await w()));
      })());
  });
  let ee = M(() => CATALOGUE.filter((e) => [`post`, `actu`, `news`, `affiche`, `photo`].includes(e.id)));
  var E = Pg(),
    te = F(E),
    D = R(F(te), 2),
    ne = F(D),
    re = F(ne);
  (Logo(F(re), {
    hauteur: 32,
    fonce: !0,
  }),
    A(re));
  var ie = R(re);
  A(ne);
  var ae = R(ne, 4);
  (K(
    ae,
    21,
    () => n,
    Qr,
    (e, t, n) => {
      var i = fg();
      let a;
      var o = F(i),
        s = F(o),
        c = (e) => {
          Icone(e, {
            n: `ok`,
            taille: 15,
          });
        },
        l = (e) => {
          var t = zr();
          ((t.nodeValue = n + 1), U(e, t));
        };
      (G(s, (e) => {
        n < B(r) ? e(c) : e(l, -1);
      }),
        A(o));
      var u = L(R(o), !0);
      (A(i),
        z(() => {
          (J(i, `aria-current`, n === B(r) ? `step` : void 0),
            (a = q(i, 1, `svelte-yzl1dj`, null, a, {
              faite: n < B(r),
              courante: n === B(r),
            })),
            W(u, B(t)));
        }),
        U(e, i));
    },
  ),
    A(ae),
    A(D),
    A(te));
  var oe = R(te, 2),
    se = F(oe),
    ce = F(se),
    le = F(ce);
  Zr(
    le,
    () => B(r),
    (e) => {
      var t = Eg(),
        n = F(t),
        _ = (e) => {
          var t = pg(),
            n = F(t);
          (Icone(F(n), {
            n: `mail`,
            taille: 26,
          }),
            A(n));
          var r = R(n, 4),
            i = L(R(F(r)), !0);
          (j(), A(r), A(t), z(() => W(i, B(f))), U(e, t));
        },
        v = (e) => {
          var t = hg(),
            n = R(I(t), 2),
            r = F(n);
          let s;
          (Icone(F(r), {
            n: `collectivite`,
            taille: 26,
          }),
            j(2),
            A(r));
          var c = R(r, 2);
          let l;
          (Icone(F(c), {
            n: `entreprise`,
            taille: 26,
          }),
            j(2),
            A(c),
            A(n));
          var u = R(n, 2),
            d = F(u),
            f = L(d, !0),
            p = R(d, 2);
          ji(p);
          let m;
          var h = R(p, 2),
            _ = (e) => {
              var t = mg(),
                n = L(t, !0);
              (z(() => W(n, B(g).structure)), U(e, t));
            };
          (G(h, (e) => {
            B(g).structure && e(_);
          }),
            A(u));
          var v = R(u, 2),
            y = R(F(v), 2);
          ji(y);
          let b;
          var x = R(y, 2);
          let S;
          var C = L(x, !0);
          (A(v),
            z(() => {
              (J(r, `aria-checked`, B(i) === `collectivite`),
                (s = q(r, 1, `type choix svelte-yzl1dj`, null, s, {
                  on: B(i) === `collectivite`,
                })),
                J(c, `aria-checked`, B(i) === `entreprise`),
                (l = q(c, 1, `type choix svelte-yzl1dj`, null, l, {
                  on: B(i) === `entreprise`,
                })),
                W(f, B(i) === `collectivite` ? `Nom de la collectivité` : `Nom de l’entreprise`),
                (m = q(p, 1, `saisie`, null, m, {
                  "erreur-champ": B(g).structure,
                })),
                J(p, `placeholder`, B(i) === `collectivite` ? `Commune de Saint-Ivenec` : `Maison Blé`),
                (b = q(y, 1, `saisie num`, null, b, {
                  "erreur-champ": B(g).siret,
                })),
                (S = q(x, 1, `svelte-yzl1dj`, null, S, {
                  err: B(g).siret,
                })),
                W(C, B(g).siret ?? `Il sert à la facturation.`));
            }),
            V(`click`, r, () => P(i, `collectivite`)),
            V(`click`, c, () => P(i, `entreprise`)),
            Ii(
              p,
              () => B(a),
              (e) => P(a, e),
            ),
            Ii(
              y,
              () => B(o),
              (e) => P(o, e),
            ),
            U(e, t));
        },
        b = (e) => {
          var t = vg(),
            n = R(I(t), 4);
          (K(
            n,
            21,
            () => ABONNEMENTS,
            Qr,
            (e, t) => {
              var n = gg();
              let r;
              var i = F(n),
                a = F(i, !0),
                o = L(R(a), !0);
              A(i);
              var c = R(i, 2),
                l = F(c, !0);
              (j(), A(c));
              var u = R(c, 2),
                d = F(u),
                f = L(d),
                p = R(d);
              A(u);
              var m = R(u, 2);
              (Icone(F(m), {
                n: `ok`,
                taille: 16,
              }),
                A(m),
                A(n),
                z(
                  (e, i) => {
                    (J(n, `aria-checked`, B(s) === B(t).id),
                      (r = q(n, 1, `formule choix svelte-yzl1dj`, null, r, {
                        on: B(s) === B(t).id,
                      })),
                      W(a, B(t).nom),
                      W(o, B(t).court),
                      W(l, e),
                      W(f, `${B(t).unites ?? ``} unités`),
                      W(p, ` par mois · ${i ?? ``}`));
                  },
                  [() => euros(B(t).prix), () => B(t).suivi.toLowerCase()],
                ),
                V(`click`, n, () => P(s, B(t).id, !0)),
                U(e, n));
            },
          ),
            A(n));
          var r = R(n, 2),
            i = R(F(r), 2),
            a = F(i);
          let o;
          var l = L(R(F(a)));
          A(a);
          var u = R(a, 2);
          let d;
          (A(i), j(2), A(r));
          var f = R(r, 2),
            p = F(f),
            m = L(p),
            h = R(p, 2);
          (K(
            h,
            21,
            () => B(ee),
            Qr,
            (e, t) => {
              var n = _g(),
                r = F(n),
                i = L(r, !0),
                a = L(R(r));
              (A(n),
                z(() => {
                  (W(i, B(t).nom), W(a, `${B(t).u ?? ``} unité${B(t).u > 1 ? `s` : ``}`));
                }),
                U(e, n));
            },
          ),
            A(h),
            A(f),
            z(
              (e) => {
                (J(a, `aria-checked`, B(c) === 6),
                  (o = q(a, 1, `choix e6 svelte-yzl1dj`, null, o, {
                    on: B(c) === 6,
                  })),
                  W(l, `Mise en place ${e ?? ``}, une fois`),
                  J(u, `aria-checked`, B(c) === 12),
                  (d = q(u, 1, `choix e12 svelte-yzl1dj`, null, d, {
                    on: B(c) === 12,
                  })),
                  W(m, `Ce que représentent ${B(x).unites ?? ``} unités`));
              },
              [() => euros(B(x).mise_en_place)],
            ),
            V(`click`, a, () => P(c, 6)),
            V(`click`, u, () => P(c, 12)),
            U(e, t));
        },
        S = (e) => {
          var t = xg(),
            n = R(I(t), 4),
            r = R(F(n), 2);
          ji(r);
          let a;
          var o = R(r, 2),
            s = (e) => {
              var t = mg(),
                n = L(t, !0);
              (z(() => W(n, B(g).nom)), U(e, t));
            };
          (G(o, (e) => {
            B(g).nom && e(s);
          }),
            A(n));
          var c = R(n, 2),
            h = R(F(c), 2);
          (ji(h), A(c));
          var _ = R(c, 2),
            v = R(F(_), 2);
          (ji(v), j(2), A(_));
          var y = R(_, 2),
            b = (e) => {
              var t = bg(),
                n = I(t),
                r = R(F(n), 2);
              ji(r);
              let i;
              var a = R(r, 2);
              let o;
              var s = L(a, !0);
              A(n);
              var c = R(n, 2),
                l = (e) => {
                  var t = yg(),
                    n = R(F(t), 2),
                    r = F(n);
                  ji(r);
                  let i;
                  var a = R(r),
                    o = F(a);
                  {
                    let e = M(() => (B(m) ? `non` : `lire`));
                    Icone(o, {
                      get n() {
                        return B(e);
                      },
                      taille: 18,
                    });
                  }
                  (A(a), A(n));
                  var s = R(n, 2);
                  let c;
                  var l = L(s, !0);
                  (A(t),
                    z(() => {
                      ((i = q(r, 1, `saisie svelte-yzl1dj`, null, i, {
                        "erreur-champ": B(g).mdp,
                      })),
                        J(r, `type`, B(m) ? `text` : `password`),
                        J(a, `aria-label`, B(m) ? `Masquer le mot de passe` : `Afficher le mot de passe`),
                        (c = q(s, 1, `svelte-yzl1dj`, null, c, {
                          err: B(g).mdp,
                        })),
                        W(l, B(g).mdp ?? `8 caractères au moins.`));
                    }),
                    Ii(
                      r,
                      () => B(p),
                      (e) => P(p, e),
                    ),
                    V(`click`, a, () => P(m, !B(m))),
                    U(e, t));
                };
              (G(c, (e) => {
                MODE_REEL && e(l);
              }),
                z(() => {
                  ((i = q(r, 1, `saisie`, null, i, {
                    "erreur-champ": B(g).email,
                  })),
                    (o = q(a, 1, `svelte-yzl1dj`, null, o, {
                      err: B(g).email,
                    })),
                    W(s, B(g).email ?? `Elle sert à vous connecter et à recevoir les avis de Fill.`));
                }),
                Ii(
                  r,
                  () => B(f),
                  (e) => P(f, e),
                ),
                U(e, t));
            };
          (G(y, (e) => {
            (MODE_REEL && etat.sessionSansProfil) || e(b);
          }),
            z(() => {
              ((a = q(r, 1, `saisie`, null, a, {
                "erreur-champ": B(g).nom,
              })),
                J(h, `placeholder`, B(i) === `collectivite` ? `Directrice générale des services` : `Gérante`));
            }),
            Ii(
              r,
              () => B(l),
              (e) => P(l, e),
            ),
            Ii(
              h,
              () => B(u),
              (e) => P(u, e),
            ),
            Ii(
              v,
              () => B(d),
              (e) => P(d, e),
            ),
            U(e, t));
        },
        C = (e) => {
          var t = Tg(),
            n = R(I(t), 2),
            r = F(n),
            i = R(F(r)),
            s = F(i, !0),
            f = L(R(s));
          (A(i), A(r));
          var p = R(r, 2),
            m = R(F(p)),
            _ = F(m),
            v = L(R(_));
          (A(m), A(p));
          var y = R(p, 2),
            b = R(F(y)),
            S = F(b, !0),
            C = R(S),
            w = (e) => {
              var t = Sg(),
                n = L(t, !0);
              (z(() => W(n, B(u))), U(e, t));
            };
          G(C, (e) => {
            B(u) && e(w);
          });
          var T = R(C),
            ee = (e) => {
              var t = Cg(),
                n = L(t, !0);
              (z(() => W(n, B(d))), U(e, t));
            };
          (G(T, (e) => {
            B(d) && e(ee);
          }),
            A(b),
            A(y),
            A(n));
          var E = R(n, 2),
            te = F(E);
          (ji(te), j(), A(E));
          var D = R(E, 2),
            ne = (e) => {
              var t = wg(),
                n = F(t);
              Icone(n, {
                n: `alerte`,
              });
              var r = R(n, 1, !0);
              (A(t), z(() => W(r, B(g).cgv)), U(e, t));
            };
          (G(D, (e) => {
            B(g).cgv && e(ne);
          }),
            z(
              (e) => {
                (W(s, B(a)),
                  W(f, `SIRET ${e ?? ``}`),
                  W(_, `${B(x).nom ?? ``}, ${B(x).unites ?? ``} unités par mois`),
                  W(v, `Engagement de ${B(c) ?? ``} mois`),
                  W(S, B(l)));
              },
              [() => ug(B(o)).replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, `$1 $2 $3 $4`)],
            ),
            Li(
              te,
              () => B(h),
              (e) => P(h, e),
            ),
            U(e, t));
        };
      (G(n, (e) => {
        B(y) ? e(_) : B(r) === 0 ? e(v, 1) : B(r) === 1 ? e(b, 2) : B(r) === 2 ? e(S, 3) : e(C, -1);
      }),
        A(t),
        U(e, t));
    },
  );
  var ue = R(le, 2),
    de = (e) => {
      var t = jg(),
        n = F(t),
        i = (e) => {
          var t = Dg();
          (Fleche(F(t), {
            sens: `al`,
          }),
            j(),
            A(t),
            V(`click`, t, () => {
              (Zt(r, -1), P(g, {}, !0));
            }),
            U(e, t));
        },
        a = (e) => {
          U(e, Og());
        };
      G(n, (e) => {
        B(r) > 0 ? e(i) : e(a, -1);
      });
      var o = R(n, 2),
        s = (e) => {
          var t = kg();
          (Fleche(R(F(t)), {}), A(t), V(`click`, t, C), U(e, t));
        },
        c = (e) => {
          var t = Ag();
          (Fleche(R(F(t)), {}), A(t), z(() => (t.disabled = B(v))), V(`click`, t, w), U(e, t));
        };
      (G(o, (e) => {
        B(r) < 3 ? e(s) : e(c, -1);
      }),
        A(t),
        U(e, t));
    };
  (G(ue, (e) => {
    B(y) || e(de);
  }),
    A(ce));
  var fe = R(ce, 2),
    pe = R(F(fe), 4),
    me = L(pe, !0),
    he = R(pe, 2),
    ge = F(he, !0);
  (j(), A(he));
  var _e = R(he, 2),
    ve = F(_e),
    ye = L(F(ve));
  (j(), A(ve));
  var be = R(ve, 2),
    xe = L(R(F(be)), !0);
  A(be);
  var Se = R(be, 2),
    Ce = L(R(F(Se)));
  A(Se);
  var O = R(Se, 2),
    we = L(R(F(O)));
  (A(O), A(_e));
  var k = R(_e, 2),
    Te = F(k),
    Ee = (e) => {
      var t = Mg(),
        n = I(t),
        r = L(F(n));
      A(n);
      var i = L(R(n, 2));
      (z(
        (e) => {
          (W(r, `Premier règlement : ${e ?? ``}`),
            W(
              i,
              `Le premier mois${B(b).miseEnPlace ? ` et la mise en place` : ``}, par carte depuis votre espace une fois créé, ou par virement automatique (virement permanent programmé depuis votre banque, IBAN sur la facture envoyée par Fill). L’espace est accessible tout de suite ; les ${B(x).unites ?? ``} unités sont créditées au premier règlement, puis chaque mois à la même date : le jour de ce premier règlement fixe votre échéance.`,
            ));
        },
        [() => euros(B(b).premierReglement)],
      ),
        U(e, t));
    },
    De = (e) => {
      var t = Ng();
      (j(2), U(e, t));
    };
  (G(Te, (e) => {
    B(i) === `entreprise` ? e(Ee) : e(De, -1);
  }),
    A(k),
    j(2),
    A(fe),
    A(se),
    A(oe),
    A(E),
    z(
      (e, t, n, r, i) => {
        (J(re, `href`, e),
          J(ie, `href`, t),
          W(me, B(x).nom),
          W(ge, n),
          W(ye, `${B(x).unites ?? ``} unités par mois`),
          W(xe, r),
          W(Ce, `${B(c) ?? ``} mois`),
          W(we, `${i ?? ``}`));
      },
      [
        () => lienRoute(``),
        () => lienRoute(``),
        () => euros(B(b).mensuel),
        () => (B(b).miseEnPlaceOfferte ? `offerte` : euros(B(b).miseEnPlace)),
        () => euros(B(b).totalEngagement),
      ],
    ),
    U(e, E),
    Je());
}
kr([`click`]);
