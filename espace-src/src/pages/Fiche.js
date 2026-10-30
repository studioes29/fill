// Composant Fiche (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Qy = H(
    `<!> <div class="feuille"><div class="w"><div class="vide"><b>Cette demande n’existe pas ou n’est pas accessible avec votre compte.</b><a class="lien">Retour aux demandes <!></a></div></div></div>`,
    1,
  ),
  $y = H(`<span><!> </span>`),
  eb = H(`<div class="etat-t svelte-bswkfh"><!> <!></div>`),
  tb = H(`<p class="note n-danger" role="alert"><!> </p>`),
  nb = H(
    `<div class="m-act confirme svelte-bswkfh" role="group" aria-label="Confirmer l’annulation"><span class="petit"><b>Annuler cette demande ?</b></span> <button class="bt sm danger svelte-bswkfh">Oui, annuler</button> <button class="bt sm cl svelte-bswkfh">Non, la garder</button></div>`,
  ),
  rb = H(`<a class="bt svelte-bswkfh"><!>Modifier</a>`),
  ib = H(`<button class="bt danger-cl svelte-bswkfh"><!>Annuler la demande</button>`),
  ab = H(`<div class="m-act svelte-bswkfh"><!> <!></div>`),
  ob = H(
    `<section class="modif svelte-bswkfh" aria-labelledby="t-modif"><div class="m-txt svelte-bswkfh"><h2 class="t3" id="t-modif"> </h2> <p class="petit mu"> </p></div> <!></section>`,
  ),
  sb = H(
    `<div class="actions svelte-bswkfh"><button class="bt"><!>Donner mon accord</button> <button class="bt cl">Refuser</button></div>`,
  ),
  cb = H(`<p class="mu petit">Le référent de votre structure a été prévenu.</p>`),
  lb = H(
    `<section class="carte pad bloc accord svelte-bswkfh" aria-labelledby="t-acc"><h2 class="t2" id="t-acc">Votre accord est attendu</h2> <p> </p> <!></section>`,
  ),
  ub = H(`<span class="pastille"> </span>`),
  db = H(`<p class="mot svelte-bswkfh"><span class="av-f svelte-bswkfh" aria-hidden="true">F</span> </p>`),
  fb = H(
    `<p class="note n-cible"><!>Ouvrez chaque livrable pour le relire en entier ; notez vos remarques au fil de la lecture, elles seront reprises dans la correction.</p>`,
  ),
  pb = H(
    `<form class="correction svelte-bswkfh"><label class="champ" for="corr"><span>Ce qui doit changer</span> <textarea id="corr" class="saisie" rows="6" placeholder="Un point par ligne, le plus précis possible."></textarea> <small> </small></label> <div class="actions svelte-bswkfh"><button class="bt" type="submit">Envoyer la correction <!></button> <button class="bt cl" type="button">Retour</button></div></form>`,
  ),
  mb = H(`<button class="bt lg"><!> </button>`),
  hb = H(`<button class="bt cl lg"><!> </button>`),
  gb = H(`<p class="mu petit"> </p>`),
  _b = H(`<p class="tres-petit mu">La validation revient au référent ; vous pouvez demander une correction.</p>`),
  vb = H(`<div class="actions svelte-bswkfh"><!> <!></div> <!>`, 1),
  yb = H(`<div class="valider svelte-bswkfh"><!></div>`),
  bb = H(`<p class="tres-petit mu"> </p>`),
  xb = H(`<li><b> </b> </li>`),
  Sb = H(
    `<details class="anciennes svelte-bswkfh"><summary class="svelte-bswkfh"> </summary> <ul class="svelte-bswkfh"></ul></details>`,
  ),
  Cb = H(`<!> <!> <div class="livrables svelte-bswkfh"></div> <!> <!> <!>`, 1),
  wb = H(`<div class="vide"> </div>`),
  Tb = H(
    `<label class="champ"><span class="tres-petit mu">Texte de la publication</span><textarea class="saisie" rows="5"></textarea></label>`,
  ),
  Eb = H(`<label class="champ"><span class="tres-petit mu">Titre</span><input class="saisie"/></label>`),
  Db = H(
    `<label class="champ"><span class="tres-petit mu">Chapô</span><textarea class="saisie court svelte-bswkfh" rows="2"></textarea></label>`,
  ),
  Ob = H(
    `<label class="champ"><span class="tres-petit mu">Texte</span><textarea class="saisie" rows="6"></textarea></label>`,
  ),
  kb = H(`<!> <!> <!> <!>`, 1),
  Ab = H(
    `<li class="jet svelte-bswkfh"><div class="j-tete svelte-bswkfh"><b class="svelte-bswkfh"> </b><button class="lien petit">Relire en entier <!></button></div> <!></li>`,
  ),
  jb = H(`<button type="button" class="filtre"> </button>`),
  Mb = H(
    `<div class="reprise svelte-bswkfh"><label class="champ" for="cons"><span>Consigne pour l’atelier</span><input id="cons" class="saisie" placeholder="Ex. plus court, ton plus chaleureux, insister sur la date limite"/></label> <div class="filtres"></div> <div class="actions svelte-bswkfh"><button class="bt sm">Relancer l’atelier <!></button> <button class="bt sm cl">Retour</button></div></div>`,
  ),
  Nb = H(`<button class="bt">Livrer pour validation <!></button>`),
  Pb = H(
    `<label class="champ" for="nj"><span>Mot au client</span><textarea id="nj" class="saisie" rows="3" placeholder="Ce qu’il faut relire en priorité, la date de mise en ligne prévue."></textarea></label> <div class="actions svelte-bswkfh"><!> <button class="bt cl"><!>Demander une reprise</button> <button class="lien-discret">Écarter le premier jet</button></div>`,
    1,
  ),
  Fb = H(
    `<section class="carte pad bloc atelier svelte-bswkfh" aria-labelledby="t-at"><div class="entete"><div><h2 class="t2" id="t-at">Premier jet de l’atelier</h2><p class="petit mu"> </p></div> <span class="pastille p-encre"> </span></div> <ol class="jets svelte-bswkfh"></ol> <!></section>`,
  ),
  Ib = H(
    `<li><span class="auteur svelte-bswkfh"> <time class="svelte-bswkfh"> </time></span> <p class="svelte-bswkfh"> </p></li>`,
  ),
  Lb = H(`<ol class="fil-msg svelte-bswkfh"></ol>`),
  Rb = H(`<p class="mu petit">Aucun échange pour l’instant.</p>`),
  zb = H(
    `<form class="ecrire svelte-bswkfh"><label class="sr" for="msg">Votre message</label> <textarea id="msg" class="saisie svelte-bswkfh" rows="2" placeholder="Une précision, une question, un fichier oublié…"></textarea> <button class="bt svelte-bswkfh" type="submit" aria-label="Envoyer le message"><!></button></form>`,
  ),
  Bb = H(`<p><!> </p>`),
  Vb = H(
    `<div class="ajuste svelte-bswkfh"><button type="button" class="retour-aj svelte-bswkfh"><!>Retour à l’estimation</button> <label class="champ" for="uaj"><span>Unités</span><input id="uaj" class="saisie" type="number" inputmode="numeric" min="1"/></label> <label class="champ" for="maj"><span>Motif, visible du client</span><textarea id="maj" class="saisie" rows="3" placeholder="Ex. deux formats d’affiche demandés"></textarea></label></div>`,
  ),
  Hb = H(
    `<p class="petit">Estimation au barème : <b> </b> <b> </b>.</p> <button type="button" class="lien-aj svelte-bswkfh"><!>Ajuster les unités</button>`,
    1,
  ),
  Ub = H(`<button type="button" class="lien-aj svelte-bswkfh"> </button>`),
  Wb = H(
    `<div><div class="c-l svelte-bswkfh"><span> </span><b class="num"> </b></div> <div class="c-j svelte-bswkfh"><i class="svelte-bswkfh"></i><i class="ajout svelte-bswkfh"></i></div> <p class="tres-petit"> </p> <!></div>`,
  ),
  Gb = H(`<p class="note n-alerte"><!> </p>`),
  Kb = H(
    `<!> <!> <label class="champ" for="dliv"><span>Date de livraison</span> <!></label> <!> <!> <button class="bt lg plein"> <!></button>`,
    1,
  ),
  qb = H(`<button class="bt">Lancer la production <!></button>`),
  Jb = H(`<button class="bt"> <!></button>`),
  Yb = H(`<button class="bt">Reprendre la production</button>`),
  Xb = H(`<p class="petit mu">En attente de la validation du client. Unités décomptées.</p>`),
  Zb = H(`<p class="petit mu">En attente de l’accord du référent.</p>`),
  Qb = H(
    `<label class="champ" for="vf"><span>Ou des noms de fichiers <small>(démonstration)</small></span><textarea id="vf" class="saisie" rows="2" placeholder="Un nom par ligne"></textarea></label>`,
  ),
  $b = H(
    `<form class="version svelte-bswkfh"><h3 class="libelle"> </h3> <label class="champ" for="vfo"><span>Fichiers</span> <input id="vfo" class="saisie fichier svelte-bswkfh" type="file" multiple=""/></label> <label class="champ" for="vty"><span>Présenter comme</span> <select id="vty" class="saisie"><option>Visuel</option><option>Affiche</option><option>Publication</option><option>Story</option><option>Page du site</option><option>Newsletter</option><option>Document PDF</option><option>Vidéo</option><option>Reportage photo</option></select></label> <!> <label class="champ" for="vn"><span>Mot au client</span><textarea id="vn" class="saisie mot-client svelte-bswkfh" rows="5" placeholder="Ce qui a été fait, ce qu’il faut relire en priorité, la date de mise en ligne prévue."></textarea></label> <button class="bt plein" type="submit">Livrer pour validation <!></button> <p class="tres-petit mu">Les unités sont décomptées à cette livraison.</p></form>`,
  ),
  ex = H(`<button class="lien-aj svelte-bswkfh"><!>Suspendre, pièce manquante</button>`),
  tx = H(`<div class="actions col svelte-bswkfh"><!> <!> <!> <!> <!></div> <!> <!>`, 1),
  nx = H(
    `<div class="actions svelte-bswkfh"><button class="bt danger sm">Oui, annuler</button><button class="bt sm cl">Retour</button></div>`,
  ),
  rx = H(`<button class="lien-aj danger svelte-bswkfh"><!>Annuler la demande</button>`),
  ix = H(
    `<section class="carte pad bloc prod svelte-bswkfh" aria-labelledby="t-prod"><h2 class="t3" id="t-prod">Production</h2> <!> <!></section>`,
  ),
  ax = H(
    `<li class="svelte-bswkfh"><span class="q num svelte-bswkfh"> </span><span> </span><span class="num v svelte-bswkfh"> </span></li>`,
  ),
  ox = H(
    `<li class="urg svelte-bswkfh"><span class="q svelte-bswkfh"><!></span><span>Urgente</span><span></span></li>`,
  ),
  sx = H(
    `<div class="svelte-bswkfh"><dt class="svelte-bswkfh">Hors forfait</dt><dd class="svelte-bswkfh"> </dd></div>`,
  ),
  cx = H(`<div class="svelte-bswkfh"><dt class="svelte-bswkfh">Parution</dt><dd class="svelte-bswkfh"> </dd></div>`),
  lx = H(`<div class="svelte-bswkfh"><dt class="svelte-bswkfh">Publication</dt><dd class="svelte-bswkfh"> </dd></div>`),
  ux = H(`<div class="svelte-bswkfh"><dt class="svelte-bswkfh"> </dt><dd class="svelte-bswkfh"> </dd></div>`),
  dx = H(`<a class="lien">Donner l’accès</a>`),
  fx = H(` <!>`, 1),
  px = H(`<p class="note n-cible"><!><!></p>`),
  mx = H(
    `<div class="brief svelte-bswkfh"><h3 class="libelle">Ce qu’il faut savoir</h3><p class="svelte-bswkfh"> </p></div>`,
  ),
  hx = H(`<li class="svelte-bswkfh"><!> </li>`),
  gx = H(`<ul class="pieces svelte-bswkfh"></ul>`),
  _x = H(
    `<li><span class="pt svelte-bswkfh" aria-hidden="true"></span> <span class="svelte-bswkfh"><b class="svelte-bswkfh"> </b><small class="svelte-bswkfh"> </small></span></li>`,
  ),
  vx = H(
    `<!> <article class="feuille"><div class="w entre"><section class="carte pad fil-c svelte-bswkfh" aria-label="Avancement"><!></section> <!> <!> <div class="cols svelte-bswkfh"><div class="principal svelte-bswkfh"><!> <section class="carte pad bloc" aria-labelledby="t-liv"><div class="entete"><h2 class="t2" id="t-liv">Livrables</h2> <!></div> <!></section> <!> <section class="carte pad bloc" aria-labelledby="t-ech"><h2 class="t2" id="t-ech">Échanges</h2> <!> <!></section></div> <aside class="cote svelte-bswkfh"><!> <section class="carte pad bloc" aria-labelledby="t-det"><h2 class="t3" id="t-det">Détails</h2> <ul class="lignes svelte-bswkfh"><!> <!> <li class="tot svelte-bswkfh"><span></span><span>Total</span><span class="num v svelte-bswkfh"> </span></li></ul> <dl class="details svelte-bswkfh"><!> <div class="svelte-bswkfh"><dt class="svelte-bswkfh">Demandée par</dt><dd class="svelte-bswkfh"> </dd></div> <div class="svelte-bswkfh"><dt class="svelte-bswkfh">Déposée le</dt><dd class="svelte-bswkfh"> </dd></div> <!> <!> <!> <div class="svelte-bswkfh"><dt class="svelte-bswkfh">Corrections</dt><dd class="svelte-bswkfh"> </dd></div></dl> <!> <!> <!></section> <details class="carte pad histo svelte-bswkfh"><summary class="svelte-bswkfh"><span class="t3">Historique</span><span class="pastille"> </span></summary> <ol class="svelte-bswkfh"></ol></details></aside></div></div></article> <!> <!>`,
    1,
  );
function Fiche(e, t) {
  qe(t, !0);
  let n = M(() => demande(t.id)),
    r = M(moi),
    i = M(() => (B(n) ? organisation(B(n).organisationId) : void 0)),
    a = M(estEquipe),
    o = M(() => (B(n) ? B(n).auteurId === B(r).id : !1)),
    s = M(() => B(n)?.versions.at(-1)),
    c = M(() => (B(n) ? peutModifier(B(n).statut, B(r).role, B(o)) : !1)),
    l = M(() => (B(n) ? actionPermise(`annuler`, B(n).statut, B(r).role, B(o)) : !1)),
    u = M(() => (B(n) && B(a) ? alerteRetard(B(n), aujourdhui(), etat.d.fermetures) : null)),
    d = M(() =>
      B(n) && B(i) && ![`livree`, `annulee`].includes(B(n).statut) ? accesManquants(B(i).acces, B(n).lignes) : [],
    ),
    f = M(() => !(!B(n) || B(n).statut !== `a_valider` || B(a) || B(r).role === `lecteur`)),
    p = N(!1),
    m = N(``),
    h = N(``),
    g = N(!1),
    _ = N(``),
    v = N(!1),
    y = N(-1),
    b = N(-1),
    x = N(en({})),
    S = M(() => Object.values(B(x)).filter((e) => e?.trim()).length),
    C = () => {
      (P(
        m,
        Object.entries(B(x))
          .filter(([, e]) => e?.trim())
          .map(([e, t]) => `${e} : ${t.trim()}`).join(`
`),
        !0,
      ),
        P(p, !0));
    },
    w = N(!1),
    T = N(0),
    ee = N(``),
    E = N(``);
  wn(() => {
    B(n) && B(n).statut === `deposee` && !B(E) && P(E, reestimer(B(n)) ?? ``, !0);
  });
  let te = M(() => (B(w) ? B(T) : (B(n)?.unites ?? 0))),
    D = M(() =>
      B(n) && B(E) ? verifierCapacite(etat.d.demandes, B(n).id, B(te), B(E), etat.d.capacite, etat.d.fermetures) : null,
    ),
    ne = M(() => (B(n) ? unitesPeriode(B(n).organisationId).disponible : 0)),
    re = M(() => (B(n) && B(a) && B(n).statut === `deposee` ? decisionPilote(B(n)) : null)),
    ie = N(``),
    ae = N(``),
    oe = N(en([])),
    se = N(`visuel`),
    ce = N(``),
    le = N(!1),
    ue = N(``),
    de = async (e, t, n) => {
      (P(_, ``), P(v, !0));
      try {
        (await e(), toast(t, `succes`, n), P(p, !1), P(m, ``), P(w, !1), P(g, !1));
      } catch (e) {
        (P(_, e.message, !0), toast(e.message, `erreur`));
      } finally {
        P(v, !1);
      }
    },
    fe = (e) =>
      new Date(e).toLocaleString(`fr-FR`, {
        day: `numeric`,
        month: `long`,
        hour: `2-digit`,
        minute: `2-digit`,
        timeZone: `Europe/Paris`,
      }),
    pe = async (e) => {
      e.preventDefault();
      let n = B(h);
      if (n.trim()) {
        P(h, ``);
        try {
          await ecrireMessage(t.id, n);
        } catch (e) {
          (P(h, n, !0), toast(e.message, `erreur`));
        }
      }
    },
    me = (e) => (/\.(mp4|mov|webm)$/i.test(e) ? `video` : /\.pdf$/i.test(e) ? `pdf` : B(se)),
    he = (e) => {
      e.preventDefault();
      let r = B(ae)
          .split(/\n/)
          .map((e) => e.trim())
          .filter(Boolean),
        i = [
          ...B(oe).map((e) => ({
            nom: e.name,
            type: me(e.name),
            fichier: e,
          })),
          ...r.map((e) => ({
            nom: e,
            type: me(e),
          })),
        ];
      i.length
        ? (de(
            () => livrerVersion(t.id, i, B(ie)),
            `Version livrée au client`,
            `${B(n)?.unites ?? 0} unités décomptées, le référent est prévenu.`,
          ),
          P(ie, ``),
          P(ae, ``),
          P(oe, [], !0))
        : P(_, `Ajoutez au moins un fichier à la version.`);
    },
    ge = async () => {
      (P(_, ``), P(v, !0));
      try {
        let e = await confirmerDemande(t.id, {
          unites: B(w) ? B(T) : void 0,
          motif: B(w) ? B(ee) : void 0,
          livraison: B(E) || void 0,
        });
        (toast(
          e === `confirmee` ? `Demande confirmée` : `Accord du référent demandé`,
          `succes`,
          e === `confirmee`
            ? `Livraison le ${jourLong(demande(t.id).livraison)}, envoyée au client.`
            : `La demande dépasse ce que le client peut engager seul.`,
        ),
          P(w, !1));
      } catch (e) {
        P(_, e.message, !0);
      } finally {
        P(v, !1);
      }
    },
    _e = (e) => {
      if (e === `pilote`) return `Fill · pilote`;
      let t = utilisateur(e);
      return t ? (t.role === `admin` || t.role === `producteur` ? `Fill` : t.nom) : `Fill`;
    },
    ve = (e, r, i) => {
      if (!B(n)?.brouillon) return;
      let a = B(n).brouillon.fichiers.map((t, n) =>
        n === e
          ? r === `legende`
            ? {
                ...t,
                legende: i,
                contenu: {
                  ...t.contenu,
                  corps: [i],
                },
              }
            : r === `corps`
              ? {
                  ...t,
                  contenu: {
                    ...t.contenu,
                    corps: i
                      .split(/\n\s*\n/)
                      .map((e) => e.trim())
                      .filter(Boolean),
                  },
                }
              : {
                  ...t,
                  contenu: {
                    ...t.contenu,
                    [r]: i,
                  },
                }
          : t,
      );
      majBrouillon(t.id, a);
    };
  var ye = Br(),
    be = I(ye),
    xe = (e) => {
      var t = Qy(),
        n = I(t);
      {
        let e = M(() => ({
          href: lienRoute(`demandes`),
          libelle: `Demandes`,
        }));
        EnTete(n, {
          titre: `Demande introuvable`,
          get retour() {
            return B(e);
          },
        });
      }
      var r = R(n, 2),
        i = F(r),
        a = F(i),
        o = R(F(a));
      (Icone(R(F(o)), {
        n: `ar`,
      }),
        A(o),
        A(a),
        A(i),
        A(r),
        z((e) => J(o, `href`, e), [() => lienRoute(`demandes`)]),
        U(e, t));
    },
    Se = (e) => {
      var o = vx(),
        me = I(o);
      {
        let e = (e) => {
            var t = eb(),
              r = F(t);
            {
              let e = M(() => !B(a));
              FilEtat(r, {
                get s() {
                  return B(n).statut;
                },
                get client() {
                  return B(e);
                },
              });
            }
            var i = R(r, 2),
              o = (e) => {
                var t = $y();
                let r;
                var i = F(t);
                Icone(i, {
                  n: `horloge`,
                  taille: 14,
                });
                var a = R(i, 1, !0);
                (A(t),
                  z(
                    (e) => {
                      ((r = q(t, 1, `delai`, null, r, {
                        grave: B(u) === `livraison_depassee` || B(u) === `confirmation_en_retard`,
                      })),
                        W(a, e));
                    },
                    [
                      () =>
                        B(u) === `livraison_depassee`
                          ? (() => {
                              let e = joursDeRetard(B(n), aujourdhui(), etat.d.fermetures);
                              return `${e} jour${e > 1 ? `s` : ``} de retard`;
                            })()
                          : LIBELLES_ALERTE[B(u)],
                    ],
                  ),
                  U(e, t));
              };
            (G(i, (e) => {
              B(u) && e(o);
            }),
              A(t),
              U(e, t));
          },
          t = M(() => (B(a) ? `${B(i).nom} · n° ${B(n).numero}` : `Demande n° ${B(n).numero}`)),
          r = M(() => ({
            href: lienRoute(B(a) ? `production` : `demandes`),
            libelle: B(a) ? `Production` : `Demandes`,
          }));
        EnTete(me, {
          get titre() {
            return B(n).titre;
          },
          get sous() {
            return B(t);
          },
          get retour() {
            return B(r);
          },
          actions: e,
          $$slots: {
            actions: !0,
          },
        });
      }
      var ye = R(me, 2),
        be = F(ye),
        xe = F(be);
      (Historique(F(xe), {
        get d() {
          return B(n);
        },
      }),
        A(xe));
      var Se = R(xe, 2),
        Ce = (e) => {
          var t = tb(),
            n = F(t);
          Icone(n, {
            n: `alerte`,
          });
          var r = R(n, 1, !0);
          (A(t), z(() => W(r, B(_))), U(e, t));
        };
      G(Se, (e) => {
        B(_) && e(Ce);
      });
      var O = R(Se, 2),
        we = (e) => {
          var r = ob(),
            a = F(r),
            o = F(a),
            s = L(o, !0),
            u = L(R(o, 2), !0);
          A(a);
          var d = R(a, 2),
            f = (e) => {
              var r = nb(),
                i = R(F(r), 2),
                a = R(i, 2);
              (A(r),
                z(() => (i.disabled = B(v))),
                V(`click`, i, () =>
                  de(
                    () => agir(t.id, `annuler`),
                    `Demande annulée`,
                    B(n).unites ? `${B(n).unites} unités libérées.` : void 0,
                  ),
                ),
                V(`click`, a, () => P(g, !1)),
                U(e, r));
            },
            p = (e) => {
              var t = ab(),
                r = F(t),
                i = (e) => {
                  var t = rb();
                  (Icone(F(t), {
                    n: `modifier`,
                    taille: 18,
                  }),
                    j(),
                    A(t),
                    z((e) => J(t, `href`, e), [() => lienRoute(`modifier-${B(n).id}`)]),
                    U(e, t));
                };
              G(r, (e) => {
                B(c) && e(i);
              });
              var a = R(r, 2),
                o = (e) => {
                  var t = ib();
                  (Icone(F(t), {
                    n: `corbeille`,
                    taille: 18,
                  }),
                    j(),
                    A(t),
                    V(`click`, t, () => P(g, !0)),
                    U(e, t));
                };
              (G(a, (e) => {
                B(l) && e(o);
              }),
                A(t),
                U(e, t));
            };
          (G(d, (e) => {
            B(g) ? e(f) : e(p, -1);
          }),
            A(r),
            z(
              (e) => {
                (W(s, B(c) ? `Vous pouvez encore modifier cette demande` : `Vous pouvez encore annuler cette demande`),
                  W(u, e));
              },
              [
                () =>
                  B(c)
                    ? `Jusqu’à sa confirmation par Fill, au plus tard ` +
                      jourLong(
                        estimer(
                          {
                            lignes: B(n).lignes,
                            urgente: B(n).urgente,
                            parution: B(n).parution,
                          },
                          {
                            formule: B(i).formule,
                            depot: B(n).creee.slice(0, 10),
                            urgencesUtilisees: 0,
                            disponibles: 99,
                          },
                        ).confirmationAuPlusTard,
                      ) +
                      `. Chaque modification apparaît dans l’historique.`
                    : `Tant que la production n’a pas commencé. Les unités réservées vous sont rendues.`,
              ],
            ),
            U(e, r));
        };
      G(O, (e) => {
        !B(a) && (B(c) || B(l)) && e(we);
      });
      var k = R(O, 2),
        Te = F(k),
        Ee = F(Te),
        De = (e) => {
          var i = lb(),
            o = R(F(i), 2),
            s = L(o),
            c = R(o, 2),
            l = (e) => {
              var n = sb(),
                r = F(n);
              (Icone(F(r), {
                n: `ok`,
                taille: 18,
              }),
                j(),
                A(r));
              var i = R(r, 2);
              (A(n),
                z(() => {
                  ((r.disabled = B(v)), (i.disabled = B(v)));
                }),
                V(`click`, r, () =>
                  de(() => repondreAccord(t.id, !0), `Accord donné`, `La demande part en production.`),
                ),
                V(`click`, i, () =>
                  de(() => repondreAccord(t.id, !1), `Demande refusée`, `Les unités ne sont pas engagées.`),
                ),
                U(e, n));
            },
            u = M(() => actionPermise(`donner_accord`, B(n).statut, B(r).role)),
            d = (e) => {
              U(e, cb());
            };
          (G(c, (e) => {
            B(u) ? e(l) : B(a) || e(d, 1);
          }),
            A(i),
            z(
              (e, t) =>
                W(
                  s,
                  `${B(n).unites ?? ``} unité${(B(n).unites ?? 0) > 1 ? `s` : ``}${e ?? ``}. Demande déposée par ${t ?? ``}.`,
                ),
              [
                () =>
                  B(n).unitesHorsForfait
                    ? `, dont ${B(n).unitesHorsForfait} hors forfait facturée${B(n).unitesHorsForfait > 1 ? `s` : ``} ${euros(B(n).unitesHorsForfait * OFFRE.uniteSup)}`
                    : ``,
                () => utilisateur(B(n).auteurId)?.nom,
              ],
            ),
            U(e, i));
        };
      G(Ee, (e) => {
        B(n).statut === `accord_requis` && e(De);
      });
      var Oe = R(Ee, 2),
        ke = F(Oe),
        Ae = R(F(ke), 2),
        je = (e) => {
          var t = ub(),
            n = L(t);
          (z((e) => W(n, `Version ${B(s).numero ?? ``} · ${e ?? ``}`), [() => fe(B(s).date)]), U(e, t));
        };
      (G(Ae, (e) => {
        B(s) && e(je);
      }),
        A(ke));
      var Me = R(ke, 2),
        Ne = (e) => {
          var o = Cb(),
            c = I(o),
            l = (e) => {
              var t = db(),
                n = R(F(t), 1, !0);
              (A(t), z(() => W(n, B(s).note)), U(e, t));
            };
          G(c, (e) => {
            B(s).note && e(l);
          });
          var u = R(c, 2),
            d = (e) => {
              var t = fb();
              (Icone(F(t), {
                n: `lire`,
              }),
                j(),
                A(t),
                U(e, t));
            };
          G(u, (e) => {
            B(f) && e(d);
          });
          var h = R(u, 2);
          (K(
            h,
            23,
            () => B(s).fichiers,
            (e, t) => e.nom + t,
            (e, t, n) => {
              {
                let r = M(() => !!B(x)[B(t).nom]?.trim());
                Livrable(e, {
                  get f() {
                    return B(t);
                  },
                  get client() {
                    return B(i).nom;
                  },
                  get remarque() {
                    return B(r);
                  },
                  ouvrir: () => P(y, B(n), !0),
                });
              }
            },
          ),
            A(h));
          var g = R(h, 2),
            _ = (e) => {
              var i = yb(),
                a = F(i),
                o = (e) => {
                  var r = pb(),
                    i = F(r),
                    a = R(F(i), 2);
                  at(a);
                  var o = L(R(a, 2));
                  A(i);
                  var s = R(i, 2),
                    c = F(s);
                  (Fleche(R(F(c)), {}), A(c));
                  var l = R(c, 2);
                  (A(s),
                    A(r),
                    z(
                      (e) => {
                        (W(o, `Aller-retour ${B(n).corrections + 1} sur 2 inclus.`), (c.disabled = e));
                      },
                      [() => !B(m).trim() || B(v)],
                    ),
                    Or(`submit`, r, (e) => {
                      (e.preventDefault(),
                        de(
                          () => agir(t.id, `demander_correction`, B(m)),
                          `Correction envoyée`,
                          `Fill livre une nouvelle version dans le délai de la formule.`,
                        ),
                        P(x, {}, !0));
                    }),
                    Ii(
                      a,
                      () => B(m),
                      (e) => P(m, e),
                    ),
                    V(`click`, l, () => P(p, !1)),
                    U(e, r));
                },
                c = (e) => {
                  var i = vb(),
                    a = I(i),
                    o = F(a),
                    c = (e) => {
                      var r = mb(),
                        i = F(r);
                      Icone(i, {
                        n: `ok`,
                        taille: 18,
                      });
                      var a = R(i);
                      (A(r),
                        z(() => {
                          ((r.disabled = B(v)), W(a, `Valider la version ${B(s).numero ?? ``}`));
                        }),
                        V(`click`, r, async () => {
                          P(v, !0);
                          try {
                            (await agir(t.id, `valider`),
                              feter({
                                motif: `validation`,
                                titre: `Version validée`,
                                detail: `Merci. ${LIBELLES_REMISE[modeRemise(B(n).lignes)].apres}.`,
                                actions: [
                                  {
                                    libelle: `Retour à l’accueil`,
                                    vers: `accueil`,
                                  },
                                  {
                                    libelle: `Voir la demande`,
                                    principal: !0,
                                  },
                                ],
                              }));
                          } catch (e) {
                            toast(e.message, `erreur`);
                          } finally {
                            P(v, !1);
                          }
                        }),
                        U(e, r));
                    },
                    l = M(() => actionPermise(`valider`, B(n).statut, B(r).role));
                  G(o, (e) => {
                    B(l) && e(c);
                  });
                  var u = R(o, 2),
                    d = (e) => {
                      var t = hb(),
                        n = F(t);
                      Icone(n, {
                        n: `correction`,
                        taille: 18,
                      });
                      var r = R(n);
                      (A(t),
                        z(() =>
                          W(r, `Demander une correction${B(S) ? ` (${B(S)} remarque${B(S) > 1 ? `s` : ``})` : ``}`),
                        ),
                        V(`click`, t, C),
                        U(e, t));
                    },
                    f = (e) => {
                      var t = gb(),
                        n = L(t);
                      (z(() =>
                        W(
                          n,
                          `Les 2 allers-retours inclus sont utilisés : écrivez ci-dessous pour chiffrer une nouvelle correction.`,
                        ),
                      ),
                        U(e, t));
                    };
                  (G(u, (e) => {
                    B(n).corrections < 2 ? e(d) : e(f, -1);
                  }),
                    A(a));
                  var p = R(a, 2),
                    m = (e) => {
                      U(e, _b());
                    },
                    h = M(() => !actionPermise(`valider`, B(n).statut, B(r).role));
                  (G(p, (e) => {
                    B(h) && e(m);
                  }),
                    U(e, i));
                };
              (G(a, (e) => {
                B(p) ? e(o) : e(c, -1);
              }),
                A(i),
                U(e, i));
            };
          G(g, (e) => {
            B(f) && e(_);
          });
          var b = R(g, 2),
            w = (e) => {
              var t = bb(),
                r = L(t);
              (z(() =>
                W(
                  r,
                  `${B(n).unites ?? ``} unité${B(n).unites > 1 ? `s` : ``} décomptée${B(n).unites > 1 ? `s` : ``} à la livraison de la version 1. Les corrections incluses ne coûtent rien de plus.`,
                ),
              ),
                U(e, t));
            };
          G(b, (e) => {
            !B(a) && B(n).unites && e(w);
          });
          var T = R(b, 2),
            ee = (e) => {
              var t = Sb(),
                r = F(t),
                i = L(r),
                a = R(r, 2);
              (K(
                a,
                21,
                () => B(n).versions.slice(0, -1).reverse(),
                (e) => e.id,
                (e, t) => {
                  var n = xb(),
                    r = F(n),
                    i = L(r),
                    a = R(r);
                  (A(n),
                    z(
                      (e, n) => {
                        (W(i, `Version ${B(t).numero ?? ``}`), W(a, `, ${e ?? ``} : ${n ?? ``}`));
                      },
                      [
                        () => fe(B(t).date),
                        () =>
                          B(t)
                            .fichiers.map((e) => e.nom)
                            .join(`, `),
                      ],
                    ),
                    U(e, n));
                },
              ),
                A(a),
                A(t),
                z(() => W(i, `Versions précédentes (${B(n).versions.length - 1})`)),
                U(e, t));
            };
          (G(T, (e) => {
            B(n).versions.length > 1 && e(ee);
          }),
            U(e, o));
        },
        Pe = (e) => {
          var t = wb(),
            r = L(t, !0);
          (z(
            (e) => W(r, e),
            [
              () =>
                B(n).statut === `deposee`
                  ? `Fill confirme la demande, son coût et sa date de livraison au plus tard le jour ouvré suivant le dépôt.`
                  : B(n).livraison
                    ? `Première version prévue au plus tard ${jourLong(B(n).livraison)}.`
                    : `Les fichiers apparaîtront ici à la livraison.`,
            ],
          ),
            U(e, t));
        };
      (G(Me, (e) => {
        B(s) ? e(Ne) : e(Pe, -1);
      }),
        A(Oe));
      var Fe = R(Oe, 2),
        Ie = (e) => {
          var i = Fb(),
            a = F(i),
            o = F(a),
            s = L(R(F(o)));
          A(o);
          var c = L(R(o, 2));
          A(a);
          var l = R(a, 2);
          (K(
            l,
            23,
            () => B(n).brouillon.fichiers,
            (e) => e.nom,
            (e, t, n) => {
              var r = Ab(),
                i = F(r),
                a = F(i),
                o = L(a, !0),
                s = R(a);
              (Icone(R(F(s)), {
                n: `ar`,
              }),
                A(s),
                A(i));
              var c = R(i, 2),
                l = (e) => {
                  var r = Tb(),
                    i = R(F(r));
                  (at(i),
                    A(r),
                    z(() => Mi(i, B(t).legende ?? ``)),
                    V(`change`, i, (e) => ve(B(n), `legende`, e.currentTarget.value)),
                    U(e, r));
                },
                u = (e) => {
                  var r = kb(),
                    i = I(r),
                    a = (e) => {
                      var r = Eb(),
                        i = R(F(r));
                      (ji(i),
                        A(r),
                        z(() => Mi(i, B(t).contenu.titre)),
                        V(`change`, i, (e) => ve(B(n), `titre`, e.currentTarget.value)),
                        U(e, r));
                    };
                  G(i, (e) => {
                    B(t).contenu?.titre !== void 0 && e(a);
                  });
                  var o = R(i, 2),
                    s = (e) => {
                      var r = Db(),
                        i = R(F(r));
                      (at(i),
                        A(r),
                        z(() => Mi(i, B(t).contenu.chapo)),
                        V(`change`, i, (e) => ve(B(n), `chapo`, e.currentTarget.value)),
                        U(e, r));
                    };
                  G(o, (e) => {
                    B(t).contenu?.chapo !== void 0 && e(s);
                  });
                  var c = R(o, 2),
                    l = (e) => {
                      var r = Ob(),
                        i = R(F(r));
                      (at(i),
                        A(r),
                        z(
                          (e) => Mi(i, e),
                          [
                            () =>
                              B(t).contenu.corps.join(`

`),
                          ],
                        ),
                        V(`change`, i, (e) => ve(B(n), `corps`, e.currentTarget.value)),
                        U(e, r));
                    };
                  G(c, (e) => {
                    B(t).contenu?.corps && e(l);
                  });
                  var u = R(c, 2),
                    d = (e) => {
                      var n = bb(),
                        r = L(n);
                      (z(() => W(r, `${B(t).contenu.sections.length ?? ``} rubriques, à relire dans la liseuse.`)),
                        U(e, n));
                    };
                  (G(u, (e) => {
                    B(t).contenu?.sections && e(d);
                  }),
                    U(e, r));
                };
              (G(c, (e) => {
                B(t).type === `post` ? e(l) : e(u, -1);
              }),
                A(r),
                z(() => W(o, B(t).nom)),
                V(`click`, s, () => P(b, B(n), !0)),
                U(e, r));
            },
          ),
            A(l));
          var u = R(l, 2),
            d = (e) => {
              var n = Mb(),
                r = F(n),
                i = R(F(r));
              (ji(i), A(r));
              var a = R(r, 2);
              (K(
                a,
                20,
                () => [`Plus court`, `Ton plus chaleureux`, `Insister sur la date`],
                Qr,
                (e, t) => {
                  var n = jb(),
                    r = L(n, !0);
                  (z(() => W(r, t)), V(`click`, n, () => P(ce, t, !0)), U(e, n));
                },
              ),
                A(a));
              var o = R(a, 2),
                s = F(o);
              (Fleche(R(F(s)), {}), A(s));
              var c = R(s, 2);
              (A(o),
                A(n),
                z((e) => (s.disabled = e), [() => !B(ce).trim() || B(v)]),
                Ii(
                  i,
                  () => B(ce),
                  (e) => P(ce, e),
                ),
                V(`click`, s, () =>
                  de(() => relancerAtelier(t.id, B(ce)), `Nouveau jet prêt`).then(() => {
                    (P(le, !1), P(ce, ``));
                  }),
                ),
                V(`click`, c, () => P(le, !1)),
                U(e, n));
            },
            f = (e) => {
              var i = Pb(),
                a = I(i),
                o = R(F(a));
              (at(o), A(a));
              var s = R(a, 2),
                c = F(s),
                l = (e) => {
                  var r = Nb();
                  (Fleche(R(F(r)), {}),
                    A(r),
                    z(() => (r.disabled = B(v))),
                    V(`click`, r, () =>
                      de(
                        () => livrerVersion(t.id, B(n).brouillon.fichiers, B(ue)),
                        `Version livrée au client`,
                        `${B(n).unites ?? 0} unités décomptées, le référent est prévenu.`,
                      ),
                    ),
                    U(e, r));
                },
                u = M(() => actionPermise(`livrer_version`, B(n).statut, B(r).role));
              G(c, (e) => {
                B(u) && e(l);
              });
              var d = R(c, 2);
              (Icone(F(d), {
                n: `atelier`,
                taille: 17,
              }),
                j(),
                A(d));
              var f = R(d, 2);
              (A(s),
                Ii(
                  o,
                  () => B(ue),
                  (e) => P(ue, e),
                ),
                V(`click`, d, () => P(le, !0)),
                V(`click`, f, () => supprimerBrouillon(t.id)),
                U(e, i));
            };
          (G(u, (e) => {
            B(le) ? e(d) : e(f, -1);
          }),
            A(i),
            z(() => {
              (W(
                s,
                `Rédigé à partir du brief${B(n).brouillon.consigne ? `, consigne : « ${B(n).brouillon.consigne} »` : ``}. Le client ne voit rien avant votre livraison.`,
              ),
                W(c, `Essai ${B(n).brouillon.essais ?? ``}`));
            }),
            U(e, i));
        },
        Le = M(() => B(a) && B(n).brouillon && [`confirmee`, `production`, `correction`].includes(B(n).statut));
      G(Fe, (e) => {
        B(Le) && e(Ie);
      });
      var Re = R(Fe, 2),
        ze = R(F(Re), 2),
        Be = (e) => {
          var t = Lb();
          (K(
            t,
            21,
            () => B(n).messages,
            (e) => e.id,
            (e, t) => {
              let n = M(() => _e(B(t).auteurId).startsWith(`Fill`));
              var i = Ib();
              let a;
              var o = F(i),
                s = F(o),
                c = L(R(s), !0);
              A(o);
              var l = L(R(o, 2), !0);
              (A(i),
                z(
                  (e, o) => {
                    ((a = q(i, 1, `svelte-bswkfh`, null, a, {
                      fill: B(n),
                      moi: B(t).auteurId === B(r).id,
                      systeme: B(t).systeme,
                    })),
                      W(s, `${e ?? ``} `),
                      W(c, o),
                      W(l, B(t).texte));
                  },
                  [() => (B(t).systeme ? `Fill` : _e(B(t).auteurId)), () => fe(B(t).date)],
                ),
                U(e, i));
            },
          ),
            A(t),
            U(e, t));
        },
        Ve = (e) => {
          U(e, Rb());
        };
      G(ze, (e) => {
        B(n).messages.length ? e(Be) : e(Ve, -1);
      });
      var He = R(ze, 2),
        Ue = (e) => {
          var t = zb(),
            n = R(F(t), 2);
          at(n);
          var r = R(n, 2);
          (Icone(F(r), {
            n: `envoyer`,
            taille: 20,
          }),
            A(r),
            A(t),
            z((e) => (r.disabled = e), [() => !B(h).trim()]),
            Or(`submit`, t, pe),
            Ii(
              n,
              () => B(h),
              (e) => P(h, e),
            ),
            U(e, t));
        };
      (G(He, (e) => {
        B(r).role !== `lecteur` && e(Ue);
      }),
        A(Re),
        A(Te));
      var We = R(Te, 2),
        Ge = F(We),
        Ke = (e) => {
          var i = ix(),
            a = R(F(i), 2),
            o = (e) => {
              var t = Kb(),
                r = I(t),
                i = (e) => {
                  var t = Bb();
                  let n;
                  var r = F(t);
                  Icone(r, {
                    n: `pilote`,
                    taille: 16,
                  });
                  var i = R(r, 1, !0);
                  (A(t),
                    z(
                      (e) => {
                        ((n = q(t, 1, `verdict svelte-bswkfh`, null, n, {
                          ok: B(re).auto,
                        })),
                          W(i, e));
                      },
                      [
                        () =>
                          B(re).auto
                            ? `Le pilote peut la confirmer : la semaine tient.`
                            : `À arbitrer : ${B(re).raison.charAt(0).toLowerCase() + B(re).raison.slice(1)}.`,
                      ],
                    ),
                    U(e, t));
                };
              G(r, (e) => {
                B(re) && e(i);
              });
              var a = R(r, 2),
                o = (e) => {
                  var t = Vb(),
                    n = F(t);
                  (Icone(F(n), {
                    n: `al`,
                    taille: 16,
                  }),
                    j(),
                    A(n));
                  var r = R(n, 2),
                    i = R(F(r));
                  (ji(i), A(r));
                  var a = R(r, 2),
                    o = R(F(a));
                  (at(o),
                    A(a),
                    A(t),
                    V(`click`, n, () => {
                      (P(w, !1), P(ee, ``));
                    }),
                    Ii(
                      i,
                      () => B(T),
                      (e) => P(T, e),
                    ),
                    Ii(
                      o,
                      () => B(ee),
                      (e) => P(ee, e),
                    ),
                    U(e, t));
                },
                s = (e) => {
                  var t = Hb(),
                    r = I(t),
                    i = R(F(r)),
                    a = L(i),
                    o = R(i),
                    s = L(R(o), !0);
                  (j(), A(r));
                  var c = R(r, 2);
                  (Icone(F(c), {
                    n: `modifier`,
                    taille: 15,
                  }),
                    j(),
                    A(c),
                    z(() => {
                      (W(a, `${B(n).unites ?? ``} unité${(B(n).unites ?? 0) > 1 ? `s` : ``}`),
                        W(o, `${B(n).urgente ? `, urgence comprise` : ``}. Disponible chez le client : `),
                        W(s, B(ne)));
                    }),
                    V(`click`, c, () => {
                      (P(w, !0), P(T, B(n).unites ?? 1, !0));
                    }),
                    U(e, t));
                };
              G(a, (e) => {
                B(w) ? e(o) : e(s, -1);
              });
              var c = R(a, 2),
                l = R(F(c), 2);
              {
                let e = M(aujourdhui);
                ChampDate(l, {
                  id: `dliv`,
                  get min() {
                    return B(e);
                  },
                  get value() {
                    return B(E);
                  },
                  set value(e) {
                    P(E, e, !0);
                  },
                });
              }
              A(c);
              var u = R(c, 2),
                d = (e) => {
                  var t = Wb();
                  let n;
                  var r = F(t),
                    i = F(r),
                    a = L(i),
                    o = L(R(i));
                  A(r);
                  var s = R(r, 2),
                    c = F(s);
                  let l;
                  var u = R(c);
                  let d;
                  A(s);
                  var f = R(s, 2),
                    p = L(f, !0),
                    m = R(f, 2),
                    h = (e) => {
                      var t = Ub(),
                        n = L(t);
                      (z((e) => W(n, `Proposer le ${e ?? ``}`), [() => jourLong(B(D).premiereDate)]),
                        V(`click`, t, () => P(E, B(D).premiereDate, !0)),
                        U(e, t));
                    };
                  (G(m, (e) => {
                    !B(D).tient && B(D).premiereDate && e(h);
                  }),
                    A(t),
                    z(
                      (e, r, i) => {
                        ((n = q(t, 1, `capa svelte-bswkfh`, null, n, {
                          ko: !B(D).tient,
                        })),
                          W(a, `Semaine du ${e ?? ``}`),
                          W(o, `${B(D).apres ?? ``} / ${B(D).capacite ?? ``} u.`),
                          (l = yi(c, ``, l, {
                            width: r,
                          })),
                          (d = yi(u, ``, d, {
                            width: i,
                          })),
                          W(
                            p,
                            B(D).tient
                              ? `Il restera ${B(D).capacite - B(D).apres} unités de capacité cette semaine.`
                              : `Semaine dépassée de ${B(D).apres - B(D).capacite} unités.`,
                          ));
                      },
                      [
                        () => jourCourt(B(E)),
                        () => `${Math.min(100, (B(D).charge / Math.max(1, B(D).capacite)) * 100)}%`,
                        () => `${Math.min(100, (B(te) / Math.max(1, B(D).capacite)) * 100)}%`,
                      ],
                    ),
                    U(e, t));
                };
              G(u, (e) => {
                B(D) && e(d);
              });
              var f = R(u, 2),
                p = (e) => {
                  var t = Gb(),
                    r = F(t);
                  Icone(r, {
                    n: `alerte`,
                  });
                  var i = R(r);
                  (A(t),
                    z((e) => W(i, `Après la parution souhaitée du ${e ?? ``}.`), [() => jourMois(B(n).parution)]),
                    U(e, t));
                };
              G(f, (e) => {
                B(n).parution && B(E) && B(E) > B(n).parution && e(p);
              });
              var m = R(f, 2),
                h = F(m);
              (Fleche(R(h), {}),
                A(m),
                z(
                  (e) => {
                    ((m.disabled = e), W(h, `${B(w) ? `Confirmer à ${B(T)} unités` : `Confirmer la demande`} `));
                  },
                  [() => B(v) || (B(w) && (!B(ee).trim() || B(T) < 1))],
                ),
                V(`click`, m, ge),
                U(e, t));
            },
            s = (e) => {
              var i = tx(),
                a = I(i),
                o = F(a),
                s = (e) => {
                  var n = qb();
                  (Fleche(R(F(n)), {}),
                    A(n),
                    z(() => (n.disabled = B(v))),
                    V(`click`, n, () => de(() => agir(t.id, `demarrer`), `Production lancée`)),
                    U(e, n));
                },
                c = M(() => actionPermise(`demarrer`, B(n).statut, B(r).role));
              G(o, (e) => {
                B(c) && e(s);
              });
              var l = R(o, 2),
                u = (e) => {
                  var r = Jb(),
                    i = F(r);
                  (Fleche(R(i), {}),
                    A(r),
                    z(
                      (e) => {
                        ((r.disabled = B(v)), W(i, `${e ?? ``} `));
                      },
                      [() => LIBELLES_REMISE[modeRemise(B(n).lignes)].action],
                    ),
                    V(`click`, r, () => de(() => agir(t.id, `livrer`), LIBELLES_REMISE[modeRemise(B(n).lignes)].fait)),
                    U(e, r));
                },
                d = M(() => actionPermise(`livrer`, B(n).statut, B(r).role));
              G(l, (e) => {
                B(d) && e(u);
              });
              var f = R(l, 2),
                p = (e) => {
                  var n = Yb();
                  (z(() => (n.disabled = B(v))),
                    V(`click`, n, () => de(() => agir(t.id, `reprendre`), `Production reprise`)),
                    U(e, n));
                },
                m = M(() => actionPermise(`reprendre`, B(n).statut, B(r).role));
              G(f, (e) => {
                B(m) && e(p);
              });
              var h = R(f, 2),
                g = (e) => {
                  U(e, Xb());
                };
              G(h, (e) => {
                B(n).statut === `a_valider` && e(g);
              });
              var _ = R(h, 2),
                y = (e) => {
                  U(e, Zb());
                };
              (G(_, (e) => {
                B(n).statut === `accord_requis` && e(y);
              }),
                A(a));
              var b = R(a, 2),
                x = (e) => {
                  var t = $b(),
                    r = F(t),
                    i = L(r),
                    a = R(r, 2),
                    o = R(F(a), 2);
                  A(a);
                  var s = R(a, 2),
                    c = R(F(s), 2),
                    l = F(c);
                  l.value = l.__value = `visuel`;
                  var u = R(l);
                  u.value = u.__value = `affiche`;
                  var d = R(u);
                  d.value = d.__value = `post`;
                  var f = R(d);
                  f.value = f.__value = `story`;
                  var p = R(f);
                  p.value = p.__value = `web`;
                  var m = R(p);
                  m.value = m.__value = `email`;
                  var h = R(m);
                  h.value = h.__value = `pdf`;
                  var g = R(h);
                  g.value = g.__value = `video`;
                  var _ = R(g);
                  ((_.value = _.__value = `photos`), A(c), Ci(c), A(s));
                  var y = R(s, 2),
                    b = (e) => {
                      var t = Qb(),
                        n = R(F(t));
                      (at(n),
                        A(t),
                        Ii(
                          n,
                          () => B(ae),
                          (e) => P(ae, e),
                        ),
                        U(e, t));
                    };
                  G(y, (e) => {
                    MODE_REEL || e(b);
                  });
                  var x = R(y, 2),
                    S = R(F(x));
                  (at(S), A(x));
                  var C = R(x, 2);
                  (Fleche(R(F(C)), {}),
                    A(C),
                    j(2),
                    A(t),
                    z(() => {
                      (W(i, `Livrer la version ${B(n).versions.length + 1}`), (C.disabled = B(v)));
                    }),
                    Or(`submit`, t, he),
                    V(`change`, o, (e) => P(oe, Array.from(e.currentTarget.files ?? []), !0)),
                    wi(
                      c,
                      () => B(se),
                      (e) => P(se, e),
                    ),
                    Ii(
                      S,
                      () => B(ie),
                      (e) => P(ie, e),
                    ),
                    U(e, t));
                },
                S = M(() => actionPermise(`livrer_version`, B(n).statut, B(r).role));
              G(b, (e) => {
                B(S) && e(x);
              });
              var C = R(b, 2),
                w = (e) => {
                  var n = ex();
                  (Icone(F(n), {
                    n: `horloge`,
                    taille: 15,
                  }),
                    j(),
                    A(n),
                    V(`click`, n, () =>
                      de(
                        () =>
                          agir(
                            t.id,
                            `suspendre`,
                            `Une pièce manque pour avancer : le délai est suspendu jusqu’à votre réponse.`,
                          ),
                        `Demande suspendue`,
                        `Le client est prévenu.`,
                      ),
                    ),
                    U(e, n));
                },
                T = M(() => actionPermise(`suspendre`, B(n).statut, B(r).role));
              (G(C, (e) => {
                B(T) && e(w);
              }),
                U(e, i));
            };
          G(a, (e) => {
            B(n).statut === `deposee` ? e(o) : e(s, -1);
          });
          var c = R(a, 2),
            l = (e) => {
              var n = Br(),
                r = I(n),
                i = (e) => {
                  var n = nx(),
                    r = F(n),
                    i = R(r);
                  (A(n),
                    V(`click`, r, () =>
                      de(() => agir(t.id, `annuler`), `Demande annulée`, `Unités restituées au client.`),
                    ),
                    V(`click`, i, () => P(g, !1)),
                    U(e, n));
                },
                a = (e) => {
                  var t = rx();
                  (Icone(F(t), {
                    n: `corbeille`,
                    taille: 15,
                  }),
                    j(),
                    A(t),
                    V(`click`, t, () => P(g, !0)),
                    U(e, t));
                };
              (G(r, (e) => {
                B(g) ? e(i) : e(a, -1);
              }),
                U(e, n));
            },
            u = M(() => actionPermise(`annuler`, B(n).statut, B(r).role));
          (G(c, (e) => {
            B(u) && e(l);
          }),
            A(i),
            U(e, i));
        },
        qe = M(() => B(a) && ![`livree`, `annulee`].includes(B(n).statut));
      G(Ge, (e) => {
        B(qe) && e(Ke);
      });
      var Je = R(Ge, 2),
        Ye = R(F(Je), 2),
        Xe = F(Ye);
      K(
        Xe,
        17,
        () => B(n).lignes,
        (e) => e.prestation,
        (e, t) => {
          let n = M(() => prestation(B(t).prestation));
          var r = ax(),
            i = F(r),
            a = L(i),
            o = R(i),
            s = L(o, !0),
            c = L(R(o), !0);
          (A(r),
            z(() => {
              (W(a, `${B(t).quantite ?? ``} ×`), W(s, B(n)?.nom), W(c, (B(n)?.u ?? 0) * B(t).quantite));
            }),
            U(e, r));
        },
      );
      var Ze = R(Xe, 2),
        Qe = (e) => {
          var t = ox(),
            n = F(t);
          (Icone(F(n), {
            n: `eclair`,
            taille: 14,
          }),
            A(n),
            j(2),
            A(t),
            U(e, t));
        };
      G(Ze, (e) => {
        B(n).urgente && e(Qe);
      });
      var $e = R(Ze, 2),
        et = L(R(F($e), 2));
      (A($e), A(Ye));
      var tt = R(Ye, 2),
        nt = F(tt),
        rt = (e) => {
          var t = sx(),
            r = L(R(F(t)));
          (A(t),
            z(
              (e) => W(r, `${B(n).unitesHorsForfait ?? ``} unités, ${e ?? ``}`),
              [() => euros(B(n).unitesHorsForfait * OFFRE.uniteSup)],
            ),
            U(e, t));
        };
      G(nt, (e) => {
        B(n).unitesHorsForfait && e(rt);
      });
      var it = R(nt, 2),
        ot = L(R(F(it)), !0);
      A(it);
      var st = R(it, 2),
        ct = L(R(F(st)), !0);
      A(st);
      var lt = R(st, 2),
        ut = (e) => {
          var t = cx(),
            r = L(R(F(t)), !0);
          (A(t), z((e) => W(r, e), [() => jourLong(B(n).parution)]), U(e, t));
        };
      G(lt, (e) => {
        B(n).parution && e(ut);
      });
      var dt = R(lt, 2),
        ft = (e) => {
          var t = lx(),
            r = L(R(F(t)), !0);
          (A(t),
            z((e) => W(r, e), [() => (B(n).heure ? `à ${B(n).heure.replace(`:`, ` h `)}` : `au meilleur moment`)]),
            U(e, t));
        },
        pt = M(() => modeRemise(B(n).lignes) !== `fichiers`);
      G(dt, (e) => {
        B(pt) && e(ft);
      });
      var mt = R(dt, 2),
        ht = (e) => {
          var t = ux(),
            r = F(t),
            i = L(r, !0),
            a = L(R(r), !0);
          (A(t),
            z(
              (e) => {
                (W(i, B(n).statut === `livree` ? `Livrée le` : `Livraison`), W(a, e));
              },
              [() => jourLong(B(n).livraison)],
            ),
            U(e, t));
        };
      G(mt, (e) => {
        B(n).livraison && e(ht);
      });
      var gt = R(mt, 2),
        _t = L(R(F(gt)));
      (A(gt), A(tt));
      var vt = R(tt, 2),
        yt = (e) => {
          var t = px(),
            n = F(t);
          Icone(n, {
            n: `cle`,
          });
          var i = R(n),
            o = (e) => {
              var t = zr();
              (z(
                (e) =>
                  W(
                    t,
                    `Pas encore d’accès : ${e ?? ``}. Pour ${B(d).length > 1 ? `ces canaux` : `ce canal`}, remettre les fichiers au client.`,
                  ),
                [() => B(d).map(nomCanal).join(`, `)],
              ),
                U(e, t));
            },
            s = (e) => {
              var t = fx(),
                n = I(t),
                i = R(n),
                a = (e) => {
                  var t = dx();
                  (z((e) => J(t, `href`, e), [() => lienRoute(`comptes`)]), U(e, t));
                };
              (G(i, (e) => {
                B(r).role === `referent` && e(a);
              }),
                z(
                  (e) =>
                    W(
                      n,
                      `Fill n’a pas encore accès à : ${e ?? ``}. Pour ${B(d).length > 1 ? `ces canaux` : `ce canal`}, il vous remet le contenu prêt à publier.`,
                    ),
                  [() => B(d).map(nomCanal).join(`, `)],
                ),
                U(e, t));
            };
          (G(i, (e) => {
            B(a) ? e(o) : e(s, -1);
          }),
            A(t),
            U(e, t));
        };
      G(vt, (e) => {
        B(d).length && e(yt);
      });
      var bt = R(vt, 2),
        xt = (e) => {
          var t = mx(),
            r = L(R(F(t)), !0);
          (A(t), z(() => W(r, B(n).brief)), U(e, t));
        };
      G(bt, (e) => {
        B(n).brief && e(xt);
      });
      var St = R(bt, 2),
        Ct = (e) => {
          var t = gx();
          (K(
            t,
            20,
            () => B(n).pieces,
            (e) => e,
            (e, t) => {
              var n = hx(),
                r = F(n);
              Icone(r, {
                n: `fichier`,
                taille: 16,
              });
              var i = R(r, 1, !0);
              (A(n), z(() => W(i, t)), U(e, n));
            },
          ),
            A(t),
            U(e, t));
        };
      (G(St, (e) => {
        B(n).pieces.length && e(Ct);
      }),
        A(Je));
      var wt = R(Je, 2),
        Tt = F(wt),
        Et = L(R(F(Tt)), !0);
      A(Tt);
      var Dt = R(Tt, 2);
      (K(
        Dt,
        21,
        () => [...B(n).historique].reverse(),
        Qr,
        (e, t) => {
          var n = _x();
          let r;
          var i = R(F(n), 2),
            a = F(i),
            o = L(a, !0),
            s = L(R(a));
          (A(i),
            A(n),
            z(
              (e, i, a) => {
                ((r = q(n, 1, `svelte-bswkfh`, null, r, {
                  modif: B(t).type === `modification`,
                  relance: B(t).type === `relance`,
                })),
                  W(
                    o,
                    B(t).type === `modification` || B(t).type === `relance`
                      ? (B(t).detail ?? `Modifiée`)
                      : LIBELLES_STATUT[B(t).statut],
                  ),
                  W(s, `${e ?? ``} · ${i ?? ``}${a ?? ``}`));
              },
              [
                () => fe(B(t).date),
                () => _e(B(t).par),
                () =>
                  B(t).detail && B(t).type !== `modification` && B(t).type !== `relance`
                    ? ` · ${B(t).detail.toLowerCase()}`
                    : ``,
              ],
            ),
            U(e, n));
        },
      ),
        A(Dt),
        A(wt),
        A(We),
        A(k),
        A(be),
        A(ye));
      var Ot = R(ye, 2),
        kt = (e) => {
          Visionneuse(e, {
            get fichiers() {
              return B(s).fichiers;
            },
            get client() {
              return B(i).nom;
            },
            get titre() {
              return B(n).titre;
            },
            get peutRemarquer() {
              return B(f);
            },
            get index() {
              return B(y);
            },
            set index(e) {
              P(y, e, !0);
            },
            get remarques() {
              return B(x);
            },
            set remarques(e) {
              P(x, e, !0);
            },
          });
        };
      G(Ot, (e) => {
        B(s) && e(kt);
      });
      var At = R(Ot, 2),
        jt = (e) => {
          Visionneuse(e, {
            get fichiers() {
              return B(n).brouillon.fichiers;
            },
            get client() {
              return B(i).nom;
            },
            get titre() {
              return `Premier jet · ${B(n).titre ?? ``}`;
            },
            get index() {
              return B(b);
            },
            set index(e) {
              P(b, e, !0);
            },
          });
        };
      (G(At, (e) => {
        B(n).brouillon && e(jt);
      }),
        z(
          (e, t, r) => {
            (W(et, `${B(n).unites ?? `·` ?? ``} u.`),
              W(ot, e),
              W(ct, t),
              W(_t, `${B(n).corrections ?? ``} sur 2 incluses`),
              (wt.open = r),
              W(Et, B(n).historique.length));
          },
          [
            () => utilisateur(B(n).auteurId)?.nom,
            () => jourMois(B(n).creee.slice(0, 10)),
            () => B(n).historique.some((e) => e.type === `modification`),
          ],
        ),
        U(e, o));
    };
  (G(be, (e) => {
    !B(n) || !B(i) || (!B(a) && B(n).organisationId !== B(r).organisationId) ? e(xe) : e(Se, -1);
  }),
    U(e, ye),
    Je());
}
kr([`click`, `change`]);
