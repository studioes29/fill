// Composant Connexion (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Xh = H(`<p class="mu">Indiquez votre adresse : un lien pour choisir un nouveau mot de passe vous est envoyé.</p>`),
  Zh = H(
    `<label class="champ" for="mdp"><span>Mot de passe</span> <span class="mdp svelte-1ilh1if"><input id="mdp" class="saisie svelte-1ilh1if" autocomplete="current-password"/><button type="button" class="voir svelte-1ilh1if"><!></button></span></label>`,
  ),
  Qh = H(`<p class="note n-danger" role="alert"><!> </p>`),
  $h = H(`<p class="note n-cible" role="status"><!> </p>`),
  eg = H(
    `<p class="voir-demo entre svelte-1ilh1if">Envie de voir avant de vous lancer ? <button class="lien svelte-1ilh1if">Parcourir un espace de démonstration <!></button></p>`,
  ),
  tg = H(
    `<li><button><span class="av svelte-1ilh1if" aria-hidden="true"> </span> <span class="txt svelte-1ilh1if"><b> </b><span class="svelte-1ilh1if"> </span><small class="svelte-1ilh1if"> </small></span> <span class="fl svelte-1ilh1if"><!></span></button></li>`,
  ),
  ng = H(
    `<div class="demo entre svelte-1ilh1if" aria-labelledby="t-demo"><h2 class="t3 svelte-1ilh1if" id="t-demo">Profils de démonstration<span class="it mu svelte-1ilh1if">&nbsp;· aperçu de travail</span></h2> <ul class="svelte-1ilh1if"></ul></div>`,
  ),
  rg = H(
    `<main class="connexion svelte-1ilh1if"><section class="bandeau svelte-1ilh1if"><span class="motif svelte-1ilh1if" aria-hidden="true"></span> <div class="haut svelte-1ilh1if"><a href="https://fill.studioes.fr/" aria-label="Fill, retour au site"><!></a></div> <div class="titre svelte-1ilh1if"><h1 class="t1 svelte-1ilh1if">Votre espace Fill</h1> <p class="intro svelte-1ilh1if">Le lieu unique de votre communication avec Fill : vos demandes, leur avancement, les livrables à relire et vos unités du mois.</p> <ul class="points svelte-1ilh1if"><li class="svelte-1ilh1if"><!>Une demande en quelques minutes : un sujet, ses supports, sa date</li> <li class="svelte-1ilh1if"><!>Chaque livrable à relire en entier, corrigé d’un message</li> <li class="svelte-1ilh1if"><!>Vos unités suivies au jour le jour</li></ul></div></section> <section class="cote svelte-1ilh1if"><div class="formulaire entre svelte-1ilh1if"><h2 class="t2"> </h2> <!> <form novalidate="" class="svelte-1ilh1if"><label class="champ" for="email"><span>Adresse e-mail</span> <input id="email" type="email" inputmode="email" autocomplete="username" placeholder="prenom.nom@commune.fr"/></label> <!> <div class="f-bas svelte-1ilh1if"><button class="bt lg" type="submit"> <!></button> <button type="button" class="lien"> </button></div> <!> <!></form></div> <a class="creer entre svelte-1ilh1if"><span class="c-txt svelte-1ilh1if"><span class="c-k svelte-1ilh1if">Nouveau client</span><b class="svelte-1ilh1if">Créer mon espace</b><small class="svelte-1ilh1if">Trois minutes pour ouvrir votre compte. L’espace est à vous tout de suite ; les unités arrivent au premier règlement, ou au bon de commande pour une collectivité.</small></span> <span class="c-fl svelte-1ilh1if" aria-hidden="true"><!></span></a> <!> <!></section></main>`,
  );
function Connexion(e, t) {
  qe(t, !0);
  let n = N(``),
    r = N(``),
    i = N(!1),
    a = N(!1),
    o = N(!1),
    s = N(``),
    c = N(!1),
    l = () => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(B(n).trim()),
    u = async (e) => {
      if ((e.preventDefault(), P(s, ``), P(o, !1), !l()))
        P(s, `Saisissez une adresse e-mail complète, par exemple prenom.nom@commune.fr.`);
      else if (!B(a) && !B(r)) P(s, `Saisissez votre mot de passe.`);
      else if (!MODE_REEL) P(s, `En démonstration, choisissez un profil ci-dessous.`);
      else {
        P(c, !0);
        try {
          B(a) ? (await motDePasseOublie(B(n).trim()), P(o, !0)) : await seConnecter(B(n).trim(), B(r));
        } catch (e) {
          P(s, e.message, !0);
        } finally {
          P(c, !1);
        }
      }
    },
    d = [
      {
        id: `anne`,
        role: `Première connexion`,
        detail: `Nouveau client : la visite guidée s’ouvre`,
      },
      {
        id: `marion`,
        role: `Référente`,
        detail: `Cinq livrables à relire, un accord à donner`,
      },
      {
        id: `yannick`,
        role: `Contributeur`,
        detail: `Dépose des demandes pour le service culture`,
      },
      {
        id: `lea`,
        role: `Gérante`,
        detail: `Entreprise, publication et story à valider`,
      },
      {
        id: `nolwenn`,
        role: `Nouvelle commune`,
        detail: `Espace ouvert, unités en attente du bon de commande`,
      },
      {
        id: `ewen`,
        role: `Production Fill`,
        detail: `Arbitrages, premiers jets, pilote automatique`,
      },
    ],
    f = (e) => {
      (choisirProfil(e), aller(e === `ewen` ? `production` : `accueil`));
    };
  var p = rg(),
    m = F(p),
    h = R(F(m), 2),
    g = F(h);
  (Logo(F(g), {
    hauteur: 40,
    anime: !0,
    fonce: !0,
  }),
    A(g),
    A(h));
  var _ = R(h, 2),
    v = R(F(_), 4),
    y = F(v);
  (Icone(F(y), {
    n: `plus`,
    taille: 18,
  }),
    j(),
    A(y));
  var b = R(y, 2);
  (Icone(F(b), {
    n: `lire`,
    taille: 18,
  }),
    j(),
    A(b));
  var x = R(b, 2);
  (Icone(F(x), {
    n: `unites`,
    taille: 18,
  }),
    j(),
    A(x),
    A(v),
    A(_),
    A(m));
  var S = R(m, 2),
    C = F(S),
    w = F(C),
    T = L(w, !0),
    ee = R(w, 2),
    E = (e) => {
      U(e, Xh());
    };
  G(ee, (e) => {
    B(a) && e(E);
  });
  var te = R(ee, 2),
    D = F(te),
    ne = R(F(D), 2);
  ji(ne);
  let re;
  A(D);
  var ie = R(D, 2),
    ae = (e) => {
      var t = Zh(),
        n = R(F(t), 2),
        a = F(n);
      ji(a);
      var o = R(a),
        s = F(o);
      {
        let e = M(() => (B(i) ? `non` : `lire`));
        Icone(s, {
          get n() {
            return B(e);
          },
          taille: 18,
        });
      }
      (A(o),
        A(n),
        A(t),
        z(() => {
          (J(a, `type`, B(i) ? `text` : `password`),
            J(o, `aria-label`, B(i) ? `Masquer le mot de passe` : `Afficher le mot de passe`));
        }),
        Ii(
          a,
          () => B(r),
          (e) => P(r, e),
        ),
        V(`click`, o, () => P(i, !B(i))),
        U(e, t));
    };
  G(ie, (e) => {
    B(a) || e(ae);
  });
  var oe = R(ie, 2),
    se = F(oe),
    ce = F(se);
  (Fleche(R(ce), {}), A(se));
  var le = R(se, 2),
    ue = L(le, !0);
  A(oe);
  var de = R(oe, 2),
    fe = (e) => {
      var t = Qh(),
        n = F(t);
      Icone(n, {
        n: `alerte`,
      });
      var r = R(n, 1, !0);
      (A(t), z(() => W(r, B(s))), U(e, t));
    };
  G(de, (e) => {
    B(s) && e(fe);
  });
  var pe = R(de, 2),
    me = (e) => {
      var t = $h(),
        r = F(t);
      Icone(r, {
        n: `mail`,
      });
      var i = R(r);
      (A(t),
        z(() => W(i, `Si un compte existe pour ${B(n) ?? ``}, le lien vient de partir. Il reste valable une heure.`)),
        U(e, t));
    };
  (G(pe, (e) => {
    B(o) && e(me);
  }),
    A(te),
    A(C));
  var he = R(C, 2),
    ge = R(F(he), 2);
  (Icone(F(ge), {
    n: `ar`,
    taille: 22,
  }),
    A(ge),
    A(he));
  var _e = R(he, 2),
    ve = (e) => {
      var t = eg(),
        n = R(F(t));
      (Icone(R(F(n)), {
        n: `ar`,
      }),
        A(n),
        A(t),
        V(`click`, n, function (...e) {
          essayerDemo?.apply(this, e);
        }),
        U(e, t));
    };
  G(_e, (e) => {
    DEMO_VISITEUR || e(ve);
  });
  var ye = R(_e, 2),
    be = (e) => {
      var t = ng(),
        n = R(F(t), 2);
      (K(
        n,
        21,
        () => d,
        Qr,
        (e, t) => {
          let n = M(() => etat.d.utilisateurs.find((e) => e.id === B(t).id)),
            r = M(() => B(n).organisationId && organisation(B(n).organisationId).type === `entreprise`);
          var i = tg(),
            a = F(i);
          let o;
          var s = F(a),
            c = L(s, !0),
            l = R(s, 2),
            u = F(l),
            d = L(u, !0),
            p = R(u),
            m = L(p),
            h = L(R(p), !0);
          A(l);
          var g = R(l, 2);
          (Icone(F(g), {
            n: `ar`,
            taille: 18,
          }),
            A(g),
            A(a),
            A(i),
            z(
              (e, i) => {
                ((o = q(a, 1, `profil carte-lien svelte-1ilh1if`, null, o, {
                  ent: B(r),
                })),
                  W(c, e),
                  W(d, B(n).nom),
                  W(m, `${B(t).role ?? ``}${i ?? ``}`),
                  W(h, B(t).detail));
              },
              [
                () =>
                  B(n)
                    .nom.split(` `)
                    .map((e) => e[0])
                    .join(``)
                    .slice(0, 2),
                () => (B(n).organisationId ? ` · ${organisation(B(n).organisationId).nom}` : ``),
              ],
            ),
            V(`click`, a, () => f(B(t).id)),
            U(e, i));
        },
      ),
        A(n),
        A(t),
        U(e, t));
    };
  (G(ye, (e) => {
    !MODE_REEL && !DEMO_VISITEUR && e(be);
  }),
    A(S),
    A(p),
    z(
      (e, t) => {
        (W(T, B(a) ? `Mot de passe oublié` : `Se connecter`),
          (re = q(ne, 1, `saisie`, null, re, {
            "erreur-champ": e,
          })),
          (se.disabled = B(c)),
          W(ce, `${B(a) ? `Recevoir le lien` : `Se connecter`} `),
          W(ue, B(a) ? `Retour à la connexion` : `Mot de passe oublié ?`),
          J(he, `href`, t));
      },
      [() => B(s) && !l(), () => lienRoute(`ouverture`)],
    ),
    Or(`submit`, te, u),
    Ii(
      ne,
      () => B(n),
      (e) => P(n, e),
    ),
    V(`click`, le, () => {
      (P(a, !B(a)), P(s, ``), P(o, !1));
    }),
    U(e, p),
    Je());
}
kr([`click`]);
