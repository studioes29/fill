// Composant Pilotage (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var KS = H(
    `<ul class="kpi svelte-og3neb"><li class="k-encre svelte-og3neb"><b class="num svelte-og3neb"> </b><span class="svelte-og3neb"> </span></li> <li class="svelte-og3neb"><b class="num svelte-og3neb"> </b><span class="svelte-og3neb">en plus sur la période (unités)</span></li> <li><b class="svelte-og3neb"><!></b><span class="svelte-og3neb"> </span></li></ul>`,
  ),
  qS = H(
    `<li class="svelte-og3neb"><span><!></span> <span class="r-t svelte-og3neb"><b> </b><small class="svelte-og3neb"> </small></span> <button class="inter" role="switch"></button></li>`,
  ),
  JS = H(`<span class="deb svelte-og3neb"></span>`),
  YS = H(`<small class="svelte-og3neb"> </small>`),
  XS = H(
    `<li class="svelte-og3neb"><span> <small class="svelte-og3neb"> </small></span> <span class="col svelte-og3neb" aria-hidden="true"><span class="cap svelte-og3neb"></span> <span class="dans svelte-og3neb"></span> <!></span> <span class="lab svelte-og3neb"> <!></span></li>`,
  ),
  ZS = H(`<button class="lien">Ouvrir le bon signé</button>`),
  QS = H(
    `<li><div class="a-t svelte-og3neb"><span class="pastille p-lav">Commande</span><h3 class="t3"> </h3></div> <dl class="petit svelte-og3neb"><div class="svelte-og3neb"><dt class="svelte-og3neb">Unités</dt><dd class="num svelte-og3neb"> </dd></div> <div class="svelte-og3neb"><dt class="svelte-og3neb">Commandée</dt><dd class="svelte-og3neb"> </dd></div> <div class="svelte-og3neb"><dt class="svelte-og3neb">Bon de commande</dt><dd class="svelte-og3neb"><!><!></dd></div></dl> <button> <!></button></li>`,
  ),
  $S = H(`· <a class="lien num"> </a>`, 1),
  eC = H(
    `<div class="svelte-og3neb"><dt class="svelte-og3neb">Référent</dt><dd class="svelte-og3neb"> <small class="svelte-og3neb"><a class="lien"> </a><!></small></dd></div>`,
  ),
  tC = H(
    `<div class="svelte-og3neb"><dt class="svelte-og3neb">Bon de commande</dt><dd class="svelte-og3neb"><!><!></dd></div>`,
  ),
  nC = H(`<button> <!></button>`),
  rC = H(`<p class="tres-petit mu"> </p> <button class="bt sm cl svelte-og3neb">Créditer sans paiement</button>`, 1),
  iC = H(
    `<li><div class="a-t svelte-og3neb"><span> </span><h3 class="t3"> </h3></div> <dl class="petit svelte-og3neb"><div class="svelte-og3neb"><dt class="svelte-og3neb">Formule</dt><dd class="svelte-og3neb"> </dd></div> <div class="svelte-og3neb"><dt class="svelte-og3neb">Mise en place</dt><dd class="svelte-og3neb"> </dd></div> <!> <div class="svelte-og3neb"><dt class="svelte-og3neb">SIRET</dt><dd class="num svelte-og3neb"> </dd></div> <!> <div class="svelte-og3neb"><dt class="svelte-og3neb">Compte d’essai</dt><dd class="svelte-og3neb"><button class="inter" role="switch"></button></dd></div></dl> <!></li>`,
  ),
  aC = H(
    `<section class="bloc" aria-labelledby="t-act"><h2 class="t2" id="t-act">Unités à créditer</h2> <p class="mu petit sous-t svelte-og3neb">Les espaces s’ouvrent seuls. Collectivités : vous créditez les unités à réception du bon de commande signé. Entreprises : créditées au paiement par carte, ou par vous à réception du virement (<a class="lien" href="./admin-virements.html">virements reçus</a>).</p> <ul class="activer svelte-og3neb"><!> <!></ul></section>`,
  ),
  oC = H(
    `<li class="carte pad svelte-og3neb"><div class="svelte-og3neb"><b> </b><small class="mu"> </small></div> <div class="acc-b svelte-og3neb"><button class="bt sm"><!>Fonctionne</button><button class="bt sm cl">Ne fonctionne pas</button></div></li>`,
  ),
  sC = H(
    `<section class="bloc" aria-labelledby="t-acc"><h2 class="t2" id="t-acc">Accès à vérifier</h2> <p class="mu petit sous-t svelte-og3neb">Le client indique avoir invité contact@studioes.fr : connectez-vous à l’outil, vérifiez que vous pouvez publier, puis confirmez.</p> <ul class="acc-v svelte-og3neb"></ul></section>`,
  ),
  cC = H(`<button class="bt sm"><!> </button>`),
  lC = H(`<span class="pastille p-bon"> </span>`),
  uC = H(`<span class="pastille">À émettre</span>`),
  dC = H(
    `<tr class="svelte-og3neb"><td class="svelte-og3neb"><b> </b></td><td class="mu svelte-og3neb"> </td><td class="d num svelte-og3neb"> </td><td class="svelte-og3neb"><!></td></tr>`,
  ),
  fC = H(
    `<table class="tab-fac svelte-og3neb"><thead class="svelte-og3neb"><tr class="svelte-og3neb"><th class="svelte-og3neb">Client</th><th class="svelte-og3neb">Détail</th><th class="d svelte-og3neb">Total</th><th class="svelte-og3neb">État</th></tr></thead><tbody></tbody></table>`,
  ),
  pC = H(`<p class="mu petit">Aucun client facturable pour cette période.</p>`),
  mC = H(`<span class="pastille p-cor">Essai</span>`),
  hC = H(`<li class="svelte-og3neb"><!> </li>`),
  gC = H(`<li class="al svelte-og3neb"><!> </li>`),
  _C = H(`<ul class="notes svelte-og3neb"><!> <!> <!> <!></ul>`),
  vC = H(
    `<li class="carte pad client svelte-og3neb"><div class="c-t svelte-og3neb"><div><h3 class="t3"> <!></h3><p class="petit mu"> </p></div> <button class="bt sm ton"><!>Ajuster les unités</button></div> <div class="jauge svelte-og3neb"><i class="con svelte-og3neb"></i> <i class="res svelte-og3neb"></i> <i class="att svelte-og3neb"></i></div> <dl class="chiffres num svelte-og3neb"><div class="svelte-og3neb"><dt class="svelte-og3neb">Disponibles</dt><dd> </dd></div> <div class="svelte-og3neb"><dt class="svelte-og3neb">Réservées</dt><dd class="svelte-og3neb"> </dd></div> <div class="svelte-og3neb"><dt class="svelte-og3neb">Livrées</dt><dd class="svelte-og3neb"> </dd></div> <div class="svelte-og3neb"><dt class="svelte-og3neb">Total de la période</dt><dd class="svelte-og3neb"> <small class="svelte-og3neb"> </small></dd></div></dl> <!> <div class="c-pied svelte-og3neb"><a class="lien petit">Ses demandes <!></a> <button class="lien petit"><!> </button> <label class="ia svelte-og3neb"><span class="petit">Premier jet de l’atelier</span><button class="inter" role="switch"></button></label> <label class="ia svelte-og3neb"><span class="petit">Compte d’essai</span><button class="inter" role="switch"></button></label></div></li>`,
  ),
  yC = H(`<button class="bt cl">Retour</button><button class="bt">Prévenir le client <!></button>`, 1),
  bC = H(`<button class="bt">Fermer</button>`),
  xC = H(
    `<label class="champ" for="raison"><span>Ce que le client doit refaire</span><textarea id="raison" class="saisie" rows="3" maxlength="300" placeholder="L’invitation a expiré : merci de la renvoyer à contact@studioes.fr."></textarea></label> <p class="petit mu">Le client voit ce message sur la carte du canal, dans son espace.</p>`,
    1,
  ),
  SC = H(`<button class="bt sm">Fonctionne</button>`),
  CC = H(`<span class="acc-b svelte-og3neb"><!><button class="lien-discret">Ne fonctionne pas</button></span>`),
  wC = H(`<span></span>`),
  TC = H(`<small class="mu svelte-og3neb"> </small>`),
  EC = H(`<li class="svelte-og3neb"><b> </b><span> </span> <!> <!></li>`),
  DC = H(`<ul class="acc-l svelte-og3neb"></ul>`),
  OC = H(`<button class="bt cl"><!>Retour</button> <button class="bt"> <!></button>`, 1),
  kC = H(`<span class="petit"> </span>`),
  AC = H(
    `<div class="sens svelte-og3neb" role="radiogroup" aria-label="Type d’ajustement"><button type="button" role="radio"><!><b class="svelte-og3neb">Offrir</b><small class="svelte-og3neb">Geste commercial, non facturé</small></button> <button type="button" role="radio"><!><b class="svelte-og3neb">Ajouter</b><small class="svelte-og3neb">Commande reçue hors plateforme</small></button> <button type="button" role="radio"><!><b class="svelte-og3neb">Retirer</b><small class="svelte-og3neb">Correction d’une erreur</small></button></div> <div class="ligne-nb svelte-og3neb"><span class="libelle">Unités</span><!></div> <label class="champ" for="motif-aj"><span>Motif, visible dans le relevé du client</span> <textarea id="motif-aj" class="saisie" rows="3"></textarea></label> <div class="apres carte2 svelte-og3neb"><span class="mu petit">Disponibles après</span><b class="num svelte-og3neb"> </b><!></div>`,
    1,
  ),
  jC = H(
    `<!> <div class="feuille"><div class="w entre"><section class="carte pad bloc" aria-labelledby="t-pil"><div class="entete"><div><h2 class="t2" id="t-pil">Pilote automatique</h2><p class="mu petit">Ce que l’outil fait seul. Tout reste visible dans le journal de la production.</p></div></div> <ul class="reglages svelte-og3neb"></ul></section> <section class="carte pad bloc" aria-labelledby="t-charge"><div class="entete"><div><h2 class="t2" id="t-charge">Charge des six semaines</h2><p class="mu petit">Unités à livrer chaque semaine, face à votre capacité ; les jours fériés réduisent la semaine.</p></div> <div class="capa svelte-og3neb"><span class="libelle">Capacité</span><!><span class="petit mu">unités par semaine</span></div></div> <figure class="graph svelte-og3neb"><ol class="barres svelte-og3neb" aria-label="Charge par semaine"></ol> <figcaption class="leg tres-petit svelte-og3neb"><span class="svelte-og3neb"><i class="l-dans svelte-og3neb"></i>dans la capacité</span><span class="svelte-og3neb"><i class="l-deb svelte-og3neb"></i>au-delà</span><span class="svelte-og3neb"><i class="l-cap svelte-og3neb"></i>capacité de la semaine</span></figcaption></figure></section> <!> <!> <section class="carte pad bloc" aria-labelledby="t-fac"><div class="entete"><div><h2 class="t2" id="t-fac"> </h2><p class="mu petit">À terme échu, à la fin de la période de chaque client : abonnement, mise en place de la première période, unités hors forfait et commandées. Entreprises : récapitulatifs (R-), la facture se fait dans Indy. <a class="lien" href="./admin-virements.html">Virements reçus et liens de paiement</a></p></div> <!></div> <!></section> <section class="bloc" aria-labelledby="t-cli"><div class="entete"><h2 class="t2" id="t-cli">Clients<span class="it mu"> </span></h2></div> <ul class="clients svelte-og3neb"></ul></section></div></div> <!> <!>`,
    1,
  );
function Pilotage(e, t) {
  qe(t, !0);
  let n = aujourdhui(),
    r = periodeDe(n),
    i = M(() => semaines(etat.d.demandes, n, 6, etat.d.capacite, etat.d.fermetures)),
    a = M(() => Math.max(10, ...B(i).map((e) => Math.max(e.charge, e.capacite))) * 1.18),
    o = N(en(etat.d.capacite));
  wn(() => {
    P(o, etat.d.capacite, !0);
  });
  let s;
  wn(() => {
    let e = B(o);
    (clearTimeout(s),
      e !== etat.d.capacite &&
        (s = setTimeout(
          () => reglerCapacite(e).then(() => toast(`Capacité réglée à ${e} unités par semaine`, `info`)),
          600,
        )));
  });
  let c = M(() => etat.d.organisations.filter((e) => e.statut === `active`)),
    l = M(() => etat.d.organisations.filter((e) => e.statut === `a_activer`)),
    u = M(() =>
      etat.d.commandes
        .filter((e) => e.statut === `a_valider`)
        .sort((e, t) => Number(!!t.bonCommande) - Number(!!e.bonCommande) || e.date.localeCompare(t.date)),
    ),
    d = M(() => B(l).filter((e) => e.type === `collectivite`).length + B(u).length),
    f = M(() => B(c).filter((e) => !e.essai)),
    p = M(() => B(f).reduce((e, t) => e + formule(t.formule).prix, 0)),
    m = (e) =>
      etat.d.demandes
        .filter(
          (t) =>
            t.organisationId === e.id &&
            t.unitesHorsForfait > 0 &&
            t.statut !== `annulee` &&
            periodeAnniversaire(e, t.creee.slice(0, 10)) === periodeAnniversaire(e),
        )
        .reduce((e, t) => e + t.unitesHorsForfait, 0),
    h = (e) =>
      etat.d.commandes.filter(
        (t) =>
          t.organisationId === e.id &&
          periodeAnniversaire(e, t.date.slice(0, 10)) === periodeAnniversaire(e) &&
          t.statut !== `a_valider`,
      ),
    g = M(() => B(f).reduce((e, t) => e + m(t) * OFFRE.uniteSup + h(t).reduce((e, t) => e + t.total, 0), 0)),
    _ = (e) => etat.d.utilisateurs.find((t) => t.organisationId === e.id && t.role === `referent`),
    v = M(() =>
      etat.d.organisations.flatMap((e) =>
        (e.acces ?? [])
          .filter((e) => e.statut === `donne`)
          .map((t) => ({
            o: e,
            a: t,
          })),
      ),
    ),
    y = N(null),
    b = N(!1),
    x = N(null),
    S = N(``),
    C = (e) => {
      (P(y, e, !0), P(x, null), P(b, !0));
    },
    w = async (e, t) => {
      try {
        (await verifierAcces(e, t, !0), toast(`${nomCanal(t)} : accès vérifié`, `succes`));
      } catch (e) {
        toast(e.message, `erreur`);
      }
    },
    T = (e, t) => {
      (P(
        x,
        {
          org: e,
          canal: t,
        },
        !0,
      ),
        P(S, ``),
        P(y, organisation(e), !0),
        P(b, !0));
    },
    ee = async () => {
      if (B(x)) {
        if (B(S).trim().length < 4) toast(`Indiquez au client ce qui ne fonctionne pas.`, `erreur`);
        else
          try {
            (await verifierAcces(B(x).org, B(x).canal, !1, B(S)),
              toast(`Le client voit l’accès à redonner`, `info`, B(S).trim()),
              P(x, null),
              P(b, !1));
          } catch (e) {
            toast(e.message, `erreur`);
          }
      }
    },
    E = [
      {
        cle: `confirmation`,
        ic: `ok`,
        nom: `Confirmer les demandes qui tiennent`,
        det: `Dès le dépôt, si la formule, la charge de la semaine et la date de parution le permettent. Sinon, la demande attend votre arbitrage avec la raison.`,
      },
      {
        cle: `atelier`,
        ic: `atelier`,
        nom: `Préparer un premier jet des textes`,
        det: `À la confirmation : publications, articles, newsletter, communiqué, textes d’affiche. Vous relisez, corrigez ou demandez une reprise avant toute livraison.`,
      },
      {
        cle: `relances`,
        ic: `horloge`,
        nom: `Relancer les clients`,
        det: `Après deux jours ouvrés sans réponse sur un livrable à valider ou une pièce attendue. Une relance par étape.`,
      },
      {
        cle: `facturation`,
        ic: `facture`,
        nom: `Émettre les factures`,
        det: `À la fin de la période de chaque client (sa date anniversaire), à terme échu ; préparées ici, à déposer sur Chorus Pro pour les collectivités ; récapitulatifs pour les entreprises, dont la facture se fait dans Indy.`,
      },
    ],
    te = async (e) => {
      let t = !etat.d.pilote[e];
      try {
        (await reglerPilote(e, t),
          toast(t ? `Pilote activé` : `Pilote désactivé`, `info`, E.find((t) => t.cle === e).nom));
      } catch (e) {
        toast(e.message, `erreur`);
      }
    },
    D = moisPrecedent(),
    ne = M(() => facturesAEmettre(D)),
    re = M(() => B(ne).filter((e) => !e.emise)),
    ie = async () => {
      try {
        let e = await emettreFactures(D);
        toast(
          `${e} facture${e > 1 ? `s` : ``} émise${e > 1 ? `s` : ``}`,
          `succes`,
          `Collectivités : à déposer sur Chorus Pro. Entreprises : à envoyer par e-mail.`,
        );
      } catch (e) {
        toast(e.message, `erreur`);
      }
    },
    ae = N(null),
    oe = N(!1),
    se = N(`offert`),
    ce = N(2),
    le = N(``),
    ue = N(!1),
    de = M(() => (B(se) === `correction` ? -1 : 1)),
    fe = (e) => {
      (P(ae, e, !0), P(se, `offert`), P(ce, 2), P(le, ``), P(oe, !0));
    },
    pe = async () => {
      if (B(ae)) {
        P(ue, !0);
        try {
          (await ajusterUnites(
            B(ae).id,
            B(de) * B(ce),
            B(se),
            B(le) ||
              (B(se) === `offert`
                ? `Unités offertes`
                : B(se) === `commande`
                  ? `Commande de ${B(ce)} unités`
                  : `Correction`),
          ),
            toast(
              B(se) === `correction`
                ? `${B(ce)} unité${B(ce) > 1 ? `s` : ``} retirée${B(ce) > 1 ? `s` : ``}`
                : `${B(ce)} unité${B(ce) > 1 ? `s` : ``} ${B(se) === `offert` ? `offerte` : `ajoutée`}${B(ce) > 1 ? `s` : ``}`,
              `succes`,
              `${B(ae).nom} les voit dans son relevé.`,
            ),
            P(oe, !1));
        } catch (e) {
          toast(e.message, `erreur`);
        } finally {
          P(ue, !1);
        }
      }
    },
    me = async (e) => {
      try {
        (await activer(e.id),
          toast(
            `${formule(e.formule).unites} unités créditées`,
            `succes`,
            `${e.nom} : premier quota disponible, la production peut démarrer.`,
          ));
      } catch (e) {
        toast(e.message, `erreur`);
      }
    },
    he = async (e) => {
      let t = etat.d.commandes.find((t) => t.id === e);
      try {
        (await validerCommande(e),
          toast(
            `${t.unites} unités créditées`,
            `succes`,
            `${organisation(t.organisationId).nom} les voit dans son relevé ; facturées avec la période.`,
          ));
      } catch (e) {
        toast(e.message, `erreur`);
      }
    },
    ge = (e) => ouvrirPiece(e).catch((e) => toast(e.message, `erreur`));
  var _e = jC(),
    ve = I(_e);
  EnTete(ve, {
    titre: `Pilotage`,
    apres: (e) => {
      var t = KS(),
        n = F(t),
        r = F(n),
        i = L(r, !0),
        a = L(R(r));
      A(n);
      var o = R(n, 2),
        s = L(F(o), !0);
      (j(), A(o));
      var c = R(o, 2);
      let l;
      var u = F(c);
      (Nombre(F(u), {
        get v() {
          return B(d);
        },
      }),
        A(u));
      var m = L(R(u));
      (A(c),
        A(t),
        z(
          (e, t) => {
            (W(i, e),
              W(a, `par mois, ${B(f).length ?? ``} abonnement${B(f).length > 1 ? `s` : ``}`),
              W(s, t),
              (l = q(c, 1, `svelte-og3neb`, null, l, {
                "k-cor": B(d) > 0,
              })),
              W(m, `crédit${B(d) > 1 ? `s` : ``} d’unités à valider`));
          },
          [() => euros(B(p)), () => euros(B(g))],
        ),
        U(e, t));
    },
    $$slots: {
      apres: !0,
    },
  });
  var ye = R(ve, 2),
    be = F(ye),
    xe = F(be),
    Se = R(F(xe), 2);
  (K(
    Se,
    21,
    () => E,
    (e) => e.cle,
    (e, t) => {
      var n = qS(),
        r = F(n);
      let i;
      (Icone(F(r), {
        get n() {
          return B(t).ic;
        },
        taille: 20,
      }),
        A(r));
      var a = R(r, 2),
        o = F(a),
        s = L(o, !0),
        c = L(R(o), !0);
      A(a);
      var l = R(a, 2);
      (A(n),
        z(() => {
          ((i = q(r, 1, `r-ic svelte-og3neb`, null, i, {
            on: etat.d.pilote[B(t).cle],
          })),
            J(o, `id`, `r-${B(t).cle ?? ``}`),
            W(s, B(t).nom),
            W(c, B(t).det),
            J(l, `aria-checked`, etat.d.pilote[B(t).cle]),
            J(l, `aria-labelledby`, `r-${B(t).cle ?? ``}`));
        }),
        V(`click`, l, () => te(B(t).cle)),
        U(e, n));
    },
  ),
    A(Se),
    A(xe));
  var Ce = R(xe, 2),
    O = F(Ce),
    we = R(F(O), 2);
  (Quantite(R(F(we)), {
    min: 5,
    max: 120,
    libelle: `Capacité par semaine`,
    get valeur() {
      return B(o);
    },
    set valeur(e) {
      P(o, e, !0);
    },
  }),
    j(),
    A(we),
    A(O));
  var k = R(O, 2),
    Te = F(k);
  (K(
    Te,
    23,
    () => B(i),
    (e) => e.debut,
    (e, t, n) => {
      let r = M(() => Math.max(0, B(t).charge - B(t).capacite));
      var i = XS();
      let o;
      var s = F(i);
      let c;
      var l = F(s, !0),
        u = L(R(l));
      A(s);
      var d = R(s, 2),
        f = F(d);
      let p;
      var m = R(f, 2);
      let h;
      var g = R(m, 2),
        _ = (e) => {
          var n = JS();
          let i;
          (z(
            () =>
              (i = yi(n, ``, i, {
                bottom: `${(B(t).capacite / B(a)) * 100}%`,
                height: `${(B(r) / B(a)) * 100}%`,
              })),
          ),
            U(e, n));
        };
      (G(g, (e) => {
        B(r) > 0 && e(_);
      }),
        A(d));
      var v = R(d, 2),
        y = F(v, !0),
        b = R(y),
        x = (e) => {
          var n = YS(),
            r = L(n);
          (z(() => W(r, `${B(t).ouvres ?? ``} j ouvrés`)), U(e, n));
        };
      (G(b, (e) => {
        B(t).ouvres < 5 && e(x);
      }),
        A(v),
        A(i),
        z(
          (e, d, g) => {
            (J(i, `aria-label`, `${e ?? ``} : ${B(t).charge ?? ``} unités sur ${B(t).capacite ?? ``}`),
              (o = yi(i, ``, o, {
                "--k": B(n),
              })),
              (c = q(s, 1, `val num svelte-og3neb`, null, c, {
                rouge: B(r) > 0,
              })),
              W(l, B(t).charge),
              W(u, `/${B(t).capacite ?? ``}`),
              (p = yi(f, ``, p, {
                height: `${(B(t).capacite / B(a)) * 100}%`,
              })),
              (h = yi(m, ``, h, {
                height: d,
              })),
              W(y, g));
          },
          [
            () => (B(n) === 0 ? `Cette semaine` : `Semaine du ${jourCourt(B(t).debut)}`),
            () => `${(Math.min(B(t).charge, B(t).capacite) / B(a)) * 100}%`,
            () => (B(n) === 0 ? `Cette sem.` : jourCourt(B(t).debut)),
          ],
        ),
        U(e, i));
    },
  ),
    A(Te),
    j(2),
    A(k),
    A(Ce));
  var Ee = R(Ce, 2),
    De = (e) => {
      var t = aC(),
        n = R(F(t), 4),
        r = F(n);
      (K(
        r,
        17,
        () => B(u),
        (e) => e.id,
        (e, t) => {
          let n = M(() => organisation(B(t).organisationId)),
            r = M(() => _(B(n)));
          var i = QS();
          let a;
          var o = F(i),
            s = L(R(F(o)), !0);
          A(o);
          var c = R(o, 2),
            l = F(c),
            u = L(R(F(l)));
          A(l);
          var d = R(l, 2),
            f = L(R(F(d)));
          A(d);
          var p = R(d, 2),
            m = R(F(p)),
            h = F(m),
            g = (e) => {
              var n = ZS();
              (V(`click`, n, () => ge(B(t).bonCommande)), U(e, n));
            },
            v = (e) => {
              U(e, zr(`pas encore reçu`));
            };
          G(h, (e) => {
            B(t).bonCommande ? e(g) : B(t).numeroEngagement || e(v, 1);
          });
          var y = R(h),
            b = (e) => {
              var n = YS(),
                r = L(n);
              (z(() => W(r, `Engagement n° ${B(t).numeroEngagement ?? ``}`)), U(e, n));
            };
          (G(y, (e) => {
            B(t).numeroEngagement && e(b);
          }),
            A(m),
            A(p),
            A(c));
          var x = R(c, 2);
          let S;
          var C = F(x);
          (Fleche(R(C), {}),
            A(x),
            A(i),
            z(
              (e, o, c) => {
                ((a = q(i, 1, `carte pad act svelte-og3neb`, null, a, {
                  pret: B(t).bonCommande || B(t).numeroEngagement,
                })),
                  W(s, B(n).nom),
                  W(u, `${B(t).unites ?? ``} × ${e ?? ``}, ${o ?? ``}`),
                  W(f, `le ${c ?? ``}${B(r) ? ` par ${B(r).nom}` : ``}`),
                  (S = q(x, 1, `bt sm svelte-og3neb`, null, S, {
                    cl: !(B(t).bonCommande || B(t).numeroEngagement),
                  })),
                  W(C, `Créditer ${B(t).unites ?? ``} unités `));
              },
              [() => euros(B(t).prixUnitaire), () => euros(B(t).total), () => jourMois(B(t).date.slice(0, 10))],
            ),
            V(`click`, x, () => he(B(t).id)),
            U(e, i));
        },
      ),
        K(
          R(r, 2),
          17,
          () => B(l),
          (e) => e.id,
          (e, t) => {
            let n = M(() => formule(B(t).formule)),
              r = M(() => lg(B(t).formule, B(t).engagementMois)),
              i = M(() => _(B(t)));
            var a = iC();
            let o;
            var s = F(a),
              c = F(s),
              l = L(c, !0),
              u = L(R(c), !0);
            A(s);
            var d = R(s, 2),
              f = F(d),
              p = L(R(F(f)));
            A(f);
            var m = R(f, 2),
              h = L(R(F(m)), !0);
            A(m);
            var g = R(m, 2),
              v = (e) => {
                var t = eC(),
                  n = R(F(t)),
                  r = F(n),
                  a = R(r),
                  o = F(a),
                  s = L(o, !0),
                  c = R(o),
                  l = (e) => {
                    var t = $S(),
                      n = R(I(t)),
                      r = L(n, !0);
                    (z(
                      (e) => {
                        (J(n, `href`, `tel:${e ?? ``}`), W(r, B(i).telephone));
                      },
                      [() => B(i).telephone.replace(/\s/g, ``)],
                    ),
                      U(e, t));
                  };
                (G(c, (e) => {
                  B(i).telephone && e(l);
                }),
                  A(a),
                  A(n),
                  A(t),
                  z(() => {
                    (W(r, `${B(i).nom ?? ``}${B(i).fonction ? `, ${B(i).fonction}` : ``}`),
                      J(o, `href`, `mailto:${B(i).email ?? ``}`),
                      W(s, B(i).email));
                  }),
                  U(e, t));
              };
            G(g, (e) => {
              B(i) && e(v);
            });
            var y = R(g, 2),
              b = L(R(F(y)), !0);
            A(y);
            var x = R(y, 2),
              S = (e) => {
                var n = tC(),
                  r = R(F(n)),
                  i = F(r),
                  a = (e) => {
                    var n = ZS();
                    (V(`click`, n, () => ge(B(t).bonCommande)), U(e, n));
                  },
                  o = (e) => {
                    U(e, zr(`pas encore reçu`));
                  };
                G(i, (e) => {
                  B(t).bonCommande ? e(a) : B(t).numeroEngagement || e(o, 1);
                });
                var s = R(i),
                  c = (e) => {
                    var n = YS(),
                      r = L(n);
                    (z(() => W(r, `Engagement n° ${B(t).numeroEngagement ?? ``}`)), U(e, n));
                  };
                (G(s, (e) => {
                  B(t).numeroEngagement && e(c);
                }),
                  A(r),
                  A(n),
                  U(e, n));
              };
            G(x, (e) => {
              B(t).type === `collectivite` && e(S);
            });
            var C = R(x, 2),
              w = L(R(F(C)));
            (A(C), A(d));
            var T = R(d, 2),
              ee = (e) => {
                var r = nC();
                let i;
                var a = F(r);
                (Fleche(R(a), {}),
                  A(r),
                  z(() => {
                    ((i = q(r, 1, `bt sm svelte-og3neb`, null, i, {
                      cl: !(B(t).bonCommande || B(t).numeroEngagement),
                    })),
                      W(a, `Créditer les ${B(n).unites ?? ``} premières unités `));
                  }),
                  V(`click`, r, () => me(B(t))),
                  U(e, r));
              },
              E = (e) => {
                var n = rC(),
                  i = I(n),
                  a = L(i),
                  o = R(i, 2);
                (z(
                  (e) =>
                    W(
                      a,
                      `Unités créditées seules au paiement par carte (${e ?? ``}). Virement reçu : créditez-les ici.`,
                    ),
                  [() => euros(B(r).premierReglement)],
                ),
                  V(`click`, o, () => me(B(t))),
                  U(e, n));
              };
            (G(T, (e) => {
              B(t).type === `collectivite` ? e(ee) : e(E, -1);
            }),
              A(a),
              z(
                (e, r, i) => {
                  ((o = q(a, 1, `carte pad act svelte-og3neb`, null, o, {
                    pret: B(t).type === `collectivite` && (B(t).bonCommande || B(t).numeroEngagement),
                  })),
                    q(c, 1, `pastille ${B(t).type === `collectivite` ? `p-lav` : `p-cor`}`),
                    W(l, B(t).type === `collectivite` ? `Collectivité` : `Entreprise`),
                    W(u, B(t).nom),
                    W(p, `${B(n).nom ?? ``}, ${e ?? ``} par mois, ${B(t).engagementMois ?? ``} mois`),
                    W(h, r),
                    W(b, B(t).siret),
                    J(w, `aria-checked`, i),
                    J(w, `aria-label`, `Compte d’essai : ${B(t).nom ?? ``}`));
                },
                [
                  () => euros(B(n).prix),
                  () => (B(r).miseEnPlaceOfferte ? `offerte` : euros(B(r).miseEnPlace)),
                  () => !!B(t).essai,
                ],
              ),
              V(`click`, w, () => reglerEssai(B(t).id, !B(t).essai)),
              U(e, a));
          },
        ),
        A(n),
        A(t),
        U(e, t));
    };
  G(Ee, (e) => {
    (B(l).length || B(u).length) && e(De);
  });
  var Oe = R(Ee, 2),
    ke = (e) => {
      var t = sC(),
        n = R(F(t), 4);
      (K(
        n,
        21,
        () => B(v),
        ({ o: e, a: t }) => e.id + t.canal,
        (e, t) => {
          let n = () => B(t).o,
            r = () => B(t).a;
          var i = oC(),
            a = F(i),
            o = F(a),
            s = L(o, !0),
            c = L(R(o));
          A(a);
          var l = R(a, 2),
            u = F(l);
          (Icone(F(u), {
            n: `ok`,
            taille: 16,
          }),
            j(),
            A(u));
          var d = R(u);
          (A(l),
            A(i),
            z(
              (e) => {
                (W(s, e), W(c, `${n().nom ?? ``}${r().note ? ` · ${r().note}` : ``}`));
              },
              [() => nomCanal(r().canal)],
            ),
            V(`click`, u, () => w(n().id, r().canal)),
            V(`click`, d, () => T(n().id, r().canal)),
            U(e, i));
        },
      ),
        A(n),
        A(t),
        U(e, t));
    };
  G(Oe, (e) => {
    B(v).length && e(ke);
  });
  var Ae = R(Oe, 2),
    je = F(Ae),
    Me = F(je),
    Ne = L(F(Me));
  (j(), A(Me));
  var Pe = R(Me, 2),
    Fe = (e) => {
      var t = cC(),
        n = F(t);
      Icone(n, {
        n: `facture`,
        taille: 17,
      });
      var r = R(n);
      (A(t),
        z(() => W(r, `Émettre ${B(re).length > 1 ? `les ${B(re).length} factures` : `la facture`}`)),
        V(`click`, t, ie),
        U(e, t));
    };
  (G(Pe, (e) => {
    B(re).length && e(Fe);
  }),
    A(je));
  var Ie = R(je, 2),
    Le = (e) => {
      var t = fC(),
        n = R(F(t));
      (K(
        n,
        21,
        () => B(ne),
        ({ o: e, projet: t, emise: n }) => e.id,
        (e, t) => {
          let n = () => B(t).o,
            r = () => B(t).projet,
            i = () => B(t).emise;
          var a = dC(),
            o = F(a),
            s = L(F(o), !0);
          A(o);
          var c = R(o),
            l = L(c, !0),
            u = R(c),
            d = L(u, !0),
            f = R(u),
            p = F(f),
            m = (e) => {
              var t = lC(),
                n = L(t);
              (z(() => W(n, `${i().id ?? ``} · ${i().statut === `deposee` ? `Chorus Pro` : `émise`}`)), U(e, t));
            },
            h = (e) => {
              U(e, uC());
            };
          (G(p, (e) => {
            i() ? e(m) : e(h, -1);
          }),
            A(f),
            A(a),
            z(
              (e, t) => {
                (W(s, n().nom), W(l, e), W(d, t));
              },
              [
                () =>
                  r()
                    .lignes.map((e) => e.libelle.replace(/^Abonnement Fill /, ``))
                    .join(` · `),
                () => euros(r().totalHT),
              ],
            ),
            U(e, a));
        },
      ),
        A(n),
        A(t),
        U(e, t));
    },
    Re = (e) => {
      U(e, pC());
    };
  (G(Ie, (e) => {
    B(ne).length ? e(Le) : e(Re, -1);
  }),
    A(Ae));
  var ze = R(Ae, 2),
    Be = F(ze),
    Ve = F(Be),
    He = L(R(F(Ve)));
  (A(Ve), A(Be));
  var Ue = R(Be, 2);
  (K(
    Ue,
    23,
    () => B(c),
    (e) => e.id,
    (e, t, n) => {
      let r = M(() => unitesPeriode(B(t).id)),
        i = M(() => formule(B(t).formule)),
        a = M(() => unitesEnAttente(B(t).id)),
        o = M(() => m(B(t))),
        s = M(() => h(B(t))),
        c = M(() => coutEngagement(B(t), 24)),
        l = M(() => etatAcces(B(t).acces));
      var u = vC();
      let d;
      var f = F(u),
        p = F(f),
        g = F(p),
        v = F(g, !0),
        y = R(v),
        b = (e) => {
          U(e, mC());
        };
      (G(y, (e) => {
        B(t).essai && e(b);
      }),
        A(g));
      var x = L(R(g));
      A(p);
      var S = R(p, 2);
      (Icone(F(S), {
        n: `reglages`,
        taille: 16,
      }),
        j(),
        A(S),
        A(f));
      var w = R(f, 2),
        T = F(w);
      let ee;
      var E = R(T, 2);
      let te;
      var D = R(E, 2);
      let ne;
      A(w);
      var re = R(w, 2),
        ie = F(re),
        ae = R(F(ie));
      let oe;
      var se = L(ae, !0);
      A(ie);
      var ce = R(ie, 2),
        le = L(R(F(ce)), !0);
      A(ce);
      var ue = R(ce, 2),
        de = L(R(F(ue)), !0);
      A(ue);
      var pe = R(ue, 2),
        me = R(F(pe)),
        he = F(me, !0),
        ge = L(R(he));
      (A(me), A(pe), A(re));
      var _e = R(re, 2),
        ve = (e) => {
          var n = _C(),
            r = F(n),
            i = (e) => {
              var t = hC(),
                n = F(t);
              Icone(n, {
                n: `horloge`,
                taille: 15,
              });
              var r = R(n);
              (A(t), z(() => W(r, `${B(a) ?? ``} unités en attente de confirmation`)), U(e, t));
            };
          G(r, (e) => {
            B(a) && e(i);
          });
          var l = R(r, 2),
            u = (e) => {
              var t = hC(),
                n = F(t);
              Icone(n, {
                n: `info`,
                taille: 15,
              });
              var r = R(n);
              (A(t),
                z(
                  (e) => W(r, `${B(o) ?? ``} hors forfait accordées, ${e ?? ``}`),
                  [() => euros(B(o) * OFFRE.uniteSup)],
                ),
                U(e, t));
            };
          G(l, (e) => {
            B(o) && e(u);
          });
          var d = R(l, 2);
          K(
            d,
            17,
            () => B(s),
            (e) => e.id,
            (e, t) => {
              var n = hC(),
                r = F(n);
              Icone(r, {
                n: `panier`,
                taille: 15,
              });
              var i = R(r);
              (A(n),
                z(
                  (e, n) =>
                    W(
                      i,
                      `Commande de ${B(t).unites ?? ``} unités le ${e ?? ``}, ${n ?? ``} HT${B(t).statut === `a_payer` ? `, en attente de paiement` : B(t).statut === `payee` ? `, réglée` : `, à facturer`}`,
                    ),
                  [() => jourMois(B(t).date.slice(0, 10)), () => euros(B(t).total)],
                ),
                U(e, n));
            },
          );
          var f = R(d, 2),
            p = (e) => {
              var t = gC(),
                n = F(t);
              Icone(n, {
                n: `alerte`,
                taille: 15,
              });
              var r = R(n);
              (A(t),
                z(
                  (e, t) => W(r, `Sur 24 mois : ${e ?? ``}, proche du seuil de ${t ?? ``}`),
                  [() => euros(B(c)), () => euros(MINUTE_MS)],
                ),
                U(e, t));
            };
          (G(f, (e) => {
            B(t).type === `collectivite` && B(c) > 48e3 && e(p);
          }),
            A(n),
            U(e, n));
        };
      G(_e, (e) => {
        (B(a) || B(o) || B(s).length || (B(t).type === `collectivite` && B(c) > 48e3)) && e(ve);
      });
      var ye = R(_e, 2),
        be = F(ye);
      (Icone(R(F(be)), {
        n: `ar`,
      }),
        A(be));
      var xe = R(be, 2),
        Se = F(xe);
      Icone(Se, {
        n: `cle`,
        taille: 15,
      });
      var Ce = R(Se);
      A(xe);
      var O = R(xe, 2),
        we = R(F(O));
      A(O);
      var k = R(O, 2),
        Te = R(F(k));
      (A(k),
        A(ye),
        A(u),
        z(
          (e, o, s, c, f, p, m) => {
            (J(u, `data-type`, B(t).type),
              (d = yi(u, ``, d, {
                "--k": B(n),
              })),
              W(v, B(t).nom),
              W(x, `${B(i).nom ?? ``} · ${e ?? ``} par mois · ${o ?? ``}`),
              J(w, `aria-label`, `${B(r).engage ?? ``} unités engagées sur ${B(r).total ?? ``}`),
              (ee = yi(T, ``, ee, {
                width: s,
              })),
              (te = yi(E, ``, te, {
                width: c,
              })),
              (ne = yi(D, ``, ne, {
                width: f,
              })),
              (oe = q(ae, 1, `svelte-og3neb`, null, oe, {
                neg: B(r).disponible - B(a) < 0,
              })),
              W(se, B(r).disponible),
              W(le, B(r).reserve),
              W(de, B(r).consomme),
              W(he, B(r).total),
              W(
                ge,
                `${B(r).quota ?? ``}${B(r).report ? `+${B(r).report}` : ``}${B(r).ajustements ? `+${B(r).ajustements}` : ``}`,
              ),
              J(be, `href`, p),
              W(
                Ce,
                `Accès : ${B(l).ok ?? ``}/${B(l).utiles ?? ``}${B(l).enVerif ? `, ${B(l).enVerif} à vérifier` : ``}${B(l).aDonner ? `, ${B(l).aDonner} à donner` : ``}`,
              ),
              J(we, `aria-checked`, !B(t).sansIA),
              J(we, `aria-label`, `Premier jet de l’atelier pour ${B(t).nom ?? ``}`),
              J(Te, `aria-checked`, m),
              J(Te, `aria-label`, `Compte d’essai : ${B(t).nom ?? ``}`));
          },
          [
            () => euros(B(i).prix),
            () => _(B(t))?.nom ?? `sans référent`,
            () => `${(B(r).consomme / Math.max(1, B(r).total)) * 100}%`,
            () => `${(B(r).reserve / Math.max(1, B(r).total)) * 100}%`,
            () => `${Math.min(100, (B(a) / Math.max(1, B(r).total)) * 100)}%`,
            () => lienRoute(`demandes`),
            () => !!B(t).essai,
          ],
        ),
        V(`click`, S, () => fe(B(t))),
        V(`click`, xe, () => C(B(t))),
        V(`click`, we, () => reglerSansIA(B(t).id, !B(t).sansIA)),
        V(`click`, Te, () => reglerEssai(B(t).id, !B(t).essai)),
        U(e, u));
    },
  ),
    A(Ue),
    A(ze),
    A(be),
    A(ye));
  var We = R(ye, 2);
  {
    let e = (e) => {
        var t = Br(),
          n = I(t),
          r = (e) => {
            var t = yC(),
              n = I(t),
              r = R(n);
            (Fleche(R(F(r)), {}), A(r), V(`click`, n, () => P(x, null)), V(`click`, r, ee), U(e, t));
          },
          i = (e) => {
            var t = bC();
            (V(`click`, t, () => P(b, !1)), U(e, t));
          };
        (G(n, (e) => {
          B(x) ? e(r) : e(i, -1);
        }),
          U(e, t));
      },
      t = M(() => (B(x) ? `${nomCanal(B(x).canal)} : à redonner` : `Accès aux comptes`)),
      n = M(() => B(y)?.nom ?? ``);
    Volet(We, {
      get titre() {
        return B(t);
      },
      get sous() {
        return B(n);
      },
      get ouverte() {
        return B(b);
      },
      set ouverte(e) {
        P(b, e, !0);
      },
      pied: e,
      children: (e, t) => {
        var n = Br(),
          r = I(n),
          i = (e) => {
            var t = xC(),
              n = I(t),
              r = R(F(n));
            (at(r),
              A(n),
              j(2),
              Ii(
                r,
                () => B(S),
                (e) => P(S, e),
              ),
              U(e, t));
          },
          a = (e) => {
            var t = DC();
            (K(
              t,
              21,
              () => CANAUX,
              (e) => e.id,
              (e, t) => {
                let n = M(() => accesCanal(B(y).acces, B(t).id));
                var r = EC(),
                  i = F(r),
                  a = L(i, !0),
                  o = R(i),
                  s = L(o, !0),
                  c = R(o, 2),
                  l = (e) => {
                    var r = CC(),
                      i = F(r),
                      a = (e) => {
                        var n = SC();
                        (V(`click`, n, () => w(B(y).id, B(t).id)), U(e, n));
                      };
                    G(i, (e) => {
                      B(n).statut === `donne` && e(a);
                    });
                    var o = R(i);
                    (A(r), V(`click`, o, () => T(B(y).id, B(t).id)), U(e, r));
                  },
                  u = (e) => {
                    U(e, wC());
                  };
                G(c, (e) => {
                  B(n).statut === `donne` || B(n).statut === `verifie` ? e(l) : e(u, -1);
                });
                var d = R(c, 2),
                  f = (e) => {
                    var t = TC(),
                      r = L(t, !0);
                    (z(() => W(r, B(n).note)), U(e, t));
                  };
                (G(d, (e) => {
                  B(n).note && e(f);
                }),
                  A(r),
                  z(() => {
                    (W(a, B(t).nom),
                      q(o, 1, `pastille ${STATUTS_ACCES[B(n).statut].ton ?? ``}`, `svelte-og3neb`),
                      W(s, STATUTS_ACCES[B(n).statut].nom));
                  }),
                  U(e, r));
              },
            ),
              A(t),
              U(e, t));
          };
        (G(r, (e) => {
          B(x) ? e(i) : B(y) && e(a, 1);
        }),
          U(e, n));
      },
      $$slots: {
        pied: !0,
        default: !0,
      },
    });
  }
  var Ge = R(We, 2);
  {
    let e = (e) => {
        var t = OC(),
          n = I(t);
        (Fleche(F(n), {
          sens: `al`,
        }),
          j(),
          A(n));
        var r = R(n, 2),
          i = F(r);
        (Fleche(R(i), {}),
          A(r),
          z(
            (e) => {
              ((r.disabled = e),
                W(
                  i,
                  `${B(se) === `offert` ? `Offrir ${B(ce)} unités` : B(se) === `commande` ? `Ajouter ${B(ce)} unités` : `Retirer ${B(ce)} unités`} `,
                ));
            },
            [() => B(ue) || (B(se) !== `offert` && !B(le).trim())],
          ),
          V(`click`, n, () => P(oe, !1)),
          V(`click`, r, pe),
          U(e, t));
      },
      t = M(() => B(ae)?.nom ?? ``);
    Volet(Ge, {
      titre: `Ajuster les unités`,
      get sous() {
        return B(t);
      },
      get ouverte() {
        return B(oe);
      },
      set ouverte(e) {
        P(oe, e, !0);
      },
      pied: e,
      children: (e, t) => {
        var n = Br(),
          r = I(n),
          i = (e) => {
            let t = M(() => unitesPeriode(B(ae).id));
            var n = AC(),
              r = I(n),
              i = F(r);
            let a;
            (Icone(F(i), {
              n: `cadeau`,
            }),
              j(2),
              A(i));
            var o = R(i, 2);
            let s;
            (Icone(F(o), {
              n: `panier`,
            }),
              j(2),
              A(o));
            var c = R(o, 2);
            let l;
            (Icone(F(c), {
              n: `moins`,
            }),
              j(2),
              A(c),
              A(r));
            var u = R(r, 2),
              d = R(F(u));
            {
              let e = M(() => (B(se) === `correction` ? Math.max(1, B(t).disponible) : 60));
              Quantite(d, {
                min: 1,
                get max() {
                  return B(e);
                },
                libelle: `Unités à ajuster`,
                get valeur() {
                  return B(ce);
                },
                set valeur(e) {
                  P(ce, e, !0);
                },
              });
            }
            A(u);
            var f = R(u, 2),
              p = R(F(f), 2);
            (at(p), A(f));
            var m = R(f, 2),
              h = R(F(m)),
              g = L(h),
              _ = R(h),
              v = (e) => {
                var t = kC(),
                  n = L(t);
                (z((e) => W(n, `Facturées ${e ?? ``} avec la période`), [() => euros(B(ce) * OFFRE.uniteSup)]),
                  U(e, t));
              };
            (G(_, (e) => {
              B(se) === `commande` && e(v);
            }),
              A(m),
              z(() => {
                (J(i, `aria-checked`, B(se) === `offert`),
                  (a = q(i, 1, `choix svelte-og3neb`, null, a, {
                    on: B(se) === `offert`,
                  })),
                  J(o, `aria-checked`, B(se) === `commande`),
                  (s = q(o, 1, `choix svelte-og3neb`, null, s, {
                    on: B(se) === `commande`,
                  })),
                  J(c, `aria-checked`, B(se) === `correction`),
                  (l = q(c, 1, `choix svelte-og3neb`, null, l, {
                    on: B(se) === `correction`,
                  })),
                  J(
                    p,
                    `placeholder`,
                    B(se) === `offert`
                      ? `Ex. Retard de livraison du bulletin d’automne`
                      : B(se) === `commande`
                        ? `Ex. Bon de commande n° 2026-114 du 12 novembre`
                        : `Ex. Doublon sur la demande n° 45`,
                  ),
                  W(g, `${B(t).disponible ?? ``} → ${B(t).disponible + B(de) * B(ce)}`));
              }),
              V(`click`, i, () => P(se, `offert`)),
              V(`click`, o, () => P(se, `commande`)),
              V(`click`, c, () => P(se, `correction`)),
              Ii(
                p,
                () => B(le),
                (e) => P(le, e),
              ),
              U(e, n));
          };
        (G(r, (e) => {
          B(ae) && e(i);
        }),
          U(e, n));
      },
      $$slots: {
        pied: !0,
        default: !0,
      },
    });
  }
  (z(
    (e, t) => {
      (W(Ne, `Factures des périodes ouvertes en ${e ?? ``}`),
        W(He, ` · unités de la période en cours de chaque client`));
    },
    [() => libelleMois(D), () => libelleMois(r)],
  ),
    U(e, _e),
    Je());
}
kr([`click`]);
