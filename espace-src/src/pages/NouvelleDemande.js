// Composant NouvelleDemande (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var fv = [
    {
      id: `evenement`,
      nom: `Un événement`,
      lignes: {
        affiche: 1,
        post: 2,
        agenda: 1,
      },
    },
    {
      id: `information`,
      nom: `Une information`,
      lignes: {
        actu: 1,
        post: 1,
      },
    },
    {
      id: `newsletter`,
      nom: `Une newsletter`,
      lignes: {
        news: 1,
      },
    },
    {
      id: `recrutement`,
      nom: `Un recrutement`,
      lignes: {
        gabarit: 1,
        actu: 1,
        post: 1,
      },
    },
    {
      id: `reportage`,
      nom: `Un reportage`,
      lignes: {
        photo: 1,
        post: 1,
      },
    },
    {
      id: `video`,
      nom: `Une vidéo`,
      lignes: {
        video: 1,
        post: 1,
      },
    },
    {
      id: `bulletin`,
      nom: `Un bulletin`,
      lignes: {
        bulletin: 4,
      },
    },
    {
      id: `presse`,
      nom: `Un communiqué`,
      lignes: {
        presse: 1,
        actu: 1,
      },
    },
  ],
  pv = (e) => e.toLowerCase().normalize(`NFD`).replace(/[̀-ͯ]/g, ``),
  mv = [
    [
      `recrutement`,
      /\b(recrut\w*|embauch\w*|offre d.emploi|poste (a|de)|candidat\w*|cdd|cdi|saisonnier\w*|stage)\b/,
      `un recrutement`,
    ],
    [`newsletter`, /\b(newsletter|lettre d.information|lettre mensuelle|la lettre)\b/, `une lettre d’information`],
    [`bulletin`, /\b(bulletin|magazine|journal municipal|mag)\b/, `un bulletin`],
    [`presse`, /\b(communique|presse|journalistes?)\b/, `une annonce à la presse`],
    [`video`, /\b(video|film|clip|montage|reel)\b/, `une vidéo`],
    [`reportage`, /\b(reportage|photos?|photographe|couvrir|couverture)\b/, `un reportage`],
    [
      `information`,
      /\b(fermeture|ferme|travaux|coupure|deviation|horaires?|reouverture|information|rappel|alerte|vigilance|enquete publique|reglementation|arrete|consultation)\b/,
      `une information pratique`,
    ],
    [
      `evenement`,
      /\b(repas|fete|festival|concert|spectacle|forum|marche|ceremonie|commemoration|inauguration|exposition|expo|salon|soiree|bal|fest[- ]noz|conference|atelier|tournoi|course|randonnee|vide[- ]grenier|braderie|portes ouvertes|voeux|animation|celebration|journee|semaine)\b/,
      `un événement`,
    ],
  ],
  hv =
    /\b(\d{1,2}(er)?\s+(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)|(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)|\d{1,2}\/\d{1,2})\b/,
  gv = (e, t = ``) => {
    let n = pv(`${e} ${t}`);
    if (n.trim().length < 4) return [];
    let r = [];
    for (let [e, t, i] of mv) {
      if (!t.test(n)) continue;
      let a = fv.find((t) => t.id === e);
      r.push({
        modele: a,
        raison: `Le sujet évoque ${i}`,
      });
    }
    return (
      !r.some((e) => e.modele.id === `evenement`) &&
        hv.test(pv(e)) &&
        !r.some((e) => [`recrutement`, `newsletter`, `bulletin`].includes(e.modele.id)) &&
        r.push({
          modele: fv[0],
          raison: `Le sujet porte une date`,
        }),
      r.sort(
        (e, t) =>
          (e.modele.id === `evenement` && hv.test(n) ? -1 : 0) - (t.modele.id === `evenement` && hv.test(n) ? -1 : 0),
      ),
      r.slice(0, 2)
    );
  },
  _v = H(
    `<!> <div class="feuille svelte-1q2r354"><div class="w svelte-1q2r354"><div class="vide svelte-1q2r354"><b class="svelte-1q2r354">Fill a déjà confirmé cette demande.</b><span class="svelte-1q2r354">Pour la faire évoluer, écrivez dans les échanges de la demande.</span></div></div></div>`,
    1,
  ),
  vv = H(
    `<p class="note n-neutre regle svelte-1q2r354"><!><span class="svelte-1q2r354">Votre demande en cours est reprise là où vous l’aviez laissée. <button type="button" class="lien svelte-1q2r354">Repartir de zéro</button></span></p>`,
  ),
  yv = H(`<small class="err svelte-1q2r354" id="e-titre"><!> </small>`),
  bv = H(
    `<li class="svelte-1q2r354"><!><span class="svelte-1q2r354"> </span><button type="button" class="ret svelte-1q2r354"><!></button></li>`,
  ),
  xv = H(`<ul class="pieces svelte-1q2r354"></ul>`),
  Sv = H(`<p class="note n-danger svelte-1q2r354" role="alert"><!> </p>`),
  Cv = H(`<button type="button"><!> </button>`),
  wv = H(`<div class="qte svelte-1q2r354"><span class="petit mu svelte-1q2r354">Combien ?</span><!></div>`),
  Tv = H(
    `<li><button type="button" class="choix svelte-1q2r354"><span class="coche svelte-1q2r354" aria-hidden="true"><!></span> <span class="p-txt svelte-1q2r354"><b class="svelte-1q2r354"> </b><small class="svelte-1q2r354"> </small></span> <span class="u num svelte-1q2r354"> </span></button> <!></li>`,
  ),
  Ev = H(
    `<div class="groupe svelte-1q2r354"><h3 class="g-t svelte-1q2r354"> </h3> <ul class="liste svelte-1q2r354"></ul></div>`,
  ),
  Dv = H(
    `<p class="note n-alerte svelte-1q2r354"><!>Beaucoup de supports pour une seule demande : s’agit-il bien du même sujet ? Sinon, faites une demande par sujet.</p>`,
  ),
  Ov = H(`<option class="svelte-1q2r354"> </option>`),
  kv = H(
    `<label class="h-saisie svelte-1q2r354" for="heure"><span class="sr svelte-1q2r354">Heure</span><select id="heure" class="saisie svelte-1q2r354"></select></label>`,
  ),
  Av = H(
    `<div class="champ heure svelte-1q2r354"><span class="svelte-1q2r354">Heure de publication</span> <div class="h-choix svelte-1q2r354" role="radiogroup" aria-label="Heure de publication"><button type="button" role="radio"><b class="svelte-1q2r354">Au meilleur moment</b><small class="svelte-1q2r354">Fill publie quand votre public est le plus présent.</small></button> <button type="button" role="radio"><b class="svelte-1q2r354">À une heure précise</b><small class="svelte-1q2r354">Une annonce attendue, une ouverture d’inscriptions.</small></button></div> <!></div>`,
  ),
  jv = H(
    `<div><span class="u-txt svelte-1q2r354"><b class="svelte-1q2r354"><!>Demande urgente</b> <small class="svelte-1q2r354"> </small></span> <button type="button" class="inter svelte-1q2r354" role="switch" aria-label="Demande urgente"></button></div>`,
  ),
  Mv = H(`<span class="bond svelte-1q2r354"> </span>`),
  Nv = H(
    `<!> <form class="feuille svelte-1q2r354" novalidate=""><div class="w svelte-1q2r354"><div class="col entre svelte-1q2r354"><!> <p class="note n-cible regle svelte-1q2r354"><!><span class="svelte-1q2r354"><b class="svelte-1q2r354">Une demande, un seul sujet.</b> Toutes ses déclinaisons y entrent (affiche, publications, article). Pour un autre sujet, déposez une autre demande.</span></p> <fieldset class="etape svelte-1q2r354"><legend class="t2 svelte-1q2r354"><span class="no num svelte-1q2r354">1</span>Le sujet</legend> <label class="champ svelte-1q2r354" for="titre"><span class="svelte-1q2r354">Sujet de la demande</span> <input id="titre" maxlength="140" placeholder="Ex. Repas des aînés du 6 décembre"/> <!></label> <label class="champ svelte-1q2r354" for="brief"><span class="svelte-1q2r354">Ce qu’il faut savoir</span> <textarea id="brief" rows="5" placeholder="Le message, la date et l’heure, le lieu, les contacts, ce qui doit apparaître." aria-describedby="c-brief"></textarea> <small id="c-brief" aria-live="polite"><span class="c-j svelte-1q2r354"><i class="svelte-1q2r354"></i></span> </small></label> <div class="champ svelte-1q2r354"><span class="svelte-1q2r354">Pièces jointes <small class="svelte-1q2r354">(textes, photos, logos)</small></span> <label class="depot svelte-1q2r354" for="pieces"><!><span class="svelte-1q2r354">Ajouter des fichiers</span> <input id="pieces" class="sr svelte-1q2r354" type="file" multiple=""/></label> <!></div></fieldset> <fieldset class="etape svelte-1q2r354" id="supports" tabindex="-1"><legend class="t2 svelte-1q2r354"><span class="no num svelte-1q2r354">2</span>Les supports</legend> <!> <div class="raccourcis svelte-1q2r354"><span class="petit mu svelte-1q2r354"> </span> <div class="filtres svelte-1q2r354"></div></div> <!> <!></fieldset> <fieldset class="etape svelte-1q2r354"><legend class="t2 svelte-1q2r354"><span class="no num svelte-1q2r354">3</span> </legend> <label class="champ svelte-1q2r354" for="parution"><span class="svelte-1q2r354">Date de parution souhaitée <small class="svelte-1q2r354">(facultative)</small></span> <!> <small class="svelte-1q2r354">Pour un reportage ou un bulletin : la date de l’événement ou de la distribution.</small></label> <!> <!></fieldset></div></div> <div class="barre-envoi svelte-1q2r354"><div class="w b-in svelte-1q2r354"><p class="tot svelte-1q2r354"><b class="num svelte-1q2r354"><!></b><span class="svelte-1q2r354"> <small> </small></span></p> <button class="bt lg svelte-1q2r354" type="submit">Vérifier la demande <!></button></div></div></form>`,
    1,
  ),
  Pv = H(`<li class="svelte-1q2r354"><!><span class="svelte-1q2r354"> </span></li>`),
  Fv = H(
    `<tr class="svelte-1q2r354"><td class="num q svelte-1q2r354"> </td><td class="svelte-1q2r354"> </td><td class="num v svelte-1q2r354"> </td></tr>`,
  ),
  Iv = H(
    `<tr class="urg svelte-1q2r354"><td class="svelte-1q2r354"><!></td><td class="svelte-1q2r354">Urgence</td><td class="num v svelte-1q2r354"> </td></tr>`,
  ),
  Lv = H(`<div><dt class="svelte-1q2r354">Parution souhaitée</dt><dd class="svelte-1q2r354"> </dd></div>`),
  Rv = H(
    `<div class="svelte-1q2r354"><dt class="svelte-1q2r354">Publication</dt><dd class="svelte-1q2r354"> </dd></div>`,
  ),
  zv = H(`<a class="lien svelte-1q2r354">Donner l’accès</a>`),
  Bv = H(`<p class="note n-cible svelte-1q2r354"><!> <!></p>`),
  Vv = H(`<p class="note n-alerte svelte-1q2r354"><!> </p>`),
  Hv = H(
    `<div class="manque-u carte2 svelte-1q2r354" id="recharge"><p class="t3 svelte-1q2r354"> </p> <p class="mu petit svelte-1q2r354"> </p> <!></div>`,
  ),
  Uv = H(
    `<p class="note n-cible svelte-1q2r354"><!>Le référent de votre structure donnera son accord avant le lancement.</p>`,
  ),
  Wv = H(
    `<p class="note n-neutre svelte-1q2r354"><!>Si le planning de Fill le permet, la demande est confirmée dès l’envoi.</p>`,
  ),
  Gv = H(
    `<button class="bt lg svelte-1q2r354" disabled="" title="Rechargez le compte pour envoyer">Envoi possible une fois le compte rechargé</button>`,
  ),
  Kv = H(`<button class="bt lg svelte-1q2r354"> <!></button>`),
  qv = H(
    `<!> <div class="feuille svelte-1q2r354"><div class="w svelte-1q2r354"><div class="col entre svelte-1q2r354"><section class="carte pad recap svelte-1q2r354" aria-labelledby="r-sujet"><div class="r-bloc svelte-1q2r354"><p class="r-lib svelte-1q2r354">Sujet</p> <h2 class="t2 svelte-1q2r354" id="r-sujet"> </h2> <p class="brief svelte-1q2r354"> </p> <!></div> <div class="r-bloc svelte-1q2r354"><p class="r-lib svelte-1q2r354">Supports et unités</p> <table class="detail svelte-1q2r354"><tbody class="svelte-1q2r354"><!><!></tbody><tfoot class="svelte-1q2r354"><tr class="svelte-1q2r354"><td class="svelte-1q2r354"></td><td class="svelte-1q2r354">Total</td><td class="num v svelte-1q2r354"> </td></tr></tfoot></table> <div class="jauge-l svelte-1q2r354"><div class="j svelte-1q2r354" aria-hidden="true"><i class="eng svelte-1q2r354"></i><i class="cette svelte-1q2r354"></i></div> <p class="petit svelte-1q2r354"><b class="num svelte-1q2r354"> </b> <b class="num svelte-1q2r354"> </b> après cette demande.</p></div></div> <div class="r-bloc svelte-1q2r354"><p class="r-lib svelte-1q2r354">Dates</p> <dl class="dates svelte-1q2r354"><div class="svelte-1q2r354"><dt class="svelte-1q2r354">Confirmation par Fill</dt><dd class="svelte-1q2r354"> </dd></div> <div class="svelte-1q2r354"><dt class="svelte-1q2r354">Livraison</dt><dd class="svelte-1q2r354"> </dd></div> <!> <!></dl></div> <!> <!> <!></section> <div class="actions-v svelte-1q2r354"><button class="bt cl lg svelte-1q2r354"><!>Modifier</button> <!></div></div></div></div>`,
    1,
  );
function NouvelleDemande(e, t) {
  qe(t, !0);
  let n = Ki(t, `modifierId`, 3, ``),
    r = M(moi),
    i = M(() => (n() ? demande(n()) : void 0)),
    a = M(() => organisation(B(i)?.organisationId ?? B(r).organisationId)),
    o = M(() => !!n() && (!B(i) || !peutModifier(B(i).statut, B(r).role, B(i).auteurId === B(r).id))),
    s = yr(() => (n() ? (demande(n()) ?? null) : null)),
    c = yr(() => (n() ? null : lireSaisie(moi().organisationId))),
    l = N(en(c?.qte ?? Object.fromEntries((s?.lignes ?? []).map((e) => [e.prestation, e.quantite])))),
    u = N(
      en(
        c?.parution ??
          s?.parution ??
          yr(() => {
            let e = etat.prerempli?.parution ?? ``;
            return ((etat.prerempli = null), e);
          }),
      ),
    ),
    d = N(en(c?.urgente ?? s?.urgente ?? !1)),
    f = N(en(c?.heure ?? s?.heure ?? ``)),
    p = N(en(!!(c?.heure ?? s?.heure))),
    m = N(en(c?.titre ?? s?.titre ?? ``)),
    h = N(en(c?.brief ?? s?.brief ?? ``)),
    g = N(en(!!c)),
    _ = () => {
      (oublierSaisie(B(a).id), P(g, !1), P(l, {}, !0), P(u, ``), P(f, ``), P(p, !1), P(d, !1), P(m, ``), P(h, ``));
    },
    v = N(en(s?.pieces ?? [])),
    y = N(en([])),
    b = N(`saisie`),
    x = N(!1),
    S = N(en({})),
    C = M(() =>
      normaliserLignes(
        Object.entries(B(l)).map(([e, t]) => ({
          prestation: e,
          quantite: t,
        })),
      ),
    ),
    w = (e) => !e || ORDRE_FORMULES.indexOf(B(a).formule) >= ORDRE_FORMULES.indexOf(e),
    T = M(() =>
      estimerPour(
        B(a).id,
        {
          lignes: B(C),
          urgente: B(d),
          parution: B(u) || null,
        },
        B(i)?.id,
      ),
    ),
    ee = M(() =>
      B(T).ok
        ? accordNecessaire(B(T), B(r), engageAuteur(B(r).id))
        : {
            requis: !1,
            motif: null,
          },
    ),
    E = M(() => unitesPeriode(B(a).id)),
    te = M(() => B(E).disponible - unitesEnAttente(B(a).id, B(i)?.id)),
    D = M(() =>
      B(T).ok ? B(T).unites : B(C).reduce((e, t) => e + (prestation(t.prestation)?.u ?? 0) * t.quantite, 0),
    ),
    ne = M(() => (B(T).ok ? B(T).horsForfait : 0)),
    re = M(() => B(C).some((e) => estPublie(e.prestation))),
    ie = M(() => accesManquants(B(a).acces, B(C))),
    ae = (e) => e.replace(`:`, ` h `).replace(/ h 00$/, ` h`),
    oe = Array.from(
      {
        length: 96,
      },
      (e, t) => `${String(Math.floor(t / 4)).padStart(2, `0`)}:${String((t % 4) * 15).padStart(2, `0`)}`,
    ),
    se = M(() => (B(re) && B(p) && /^\d{2}:\d{2}$/.test(B(f)) ? B(f) : null)),
    ce = () => {
      B(i) ||
        garderSaisie(B(a).id, {
          titre: B(m),
          brief: B(h),
          parution: B(u),
          heure: B(se) ?? ``,
          urgente: B(d),
          qte: B(l),
        });
    };
  wn(() => {
    B(b) === `verif` && B(ne) > 0 && yr(ce);
  });
  let le = M(() => B(C).length >= 4 || B(C).reduce((e, t) => e + t.quantite, 0) > 8),
    ue = M(() => (B(i) ? [] : gv(B(m), B(h)))),
    de = M(() => [
      ...B(ue).map((e) => ({
        ...e.modele,
        pourquoi: e.raison,
      })),
      ...fv.filter((e) => !B(ue).some((t) => t.modele.id === e.id)).slice(0, 4),
    ]),
    fe = M(() => B(h).trim().length);
  wn(() => {
    let e = B(m).trim().length,
      t = B(fe),
      n = yr(() => B(S));
    if ((n.titre && e >= 3) || (n.brief && t >= 20)) {
      let r = {
        ...n,
      };
      (e >= 3 && delete r.titre, t >= 20 && delete r.brief, P(S, r, !0));
    }
  });
  let pe = (e) => {
      (P(l, Object.fromEntries(Object.entries(e).filter(([e]) => w(prestation(e)?.min))), !0), delete B(S).supports);
    },
    me = (e) => Object.keys(e).length === B(C).length && B(C).every((t) => e[t.prestation] === t.quantite),
    he = (e) => {
      (P(
        l,
        {
          ...B(l),
          [e]: +!B(l)[e],
        },
        !0,
      ),
        delete B(S).supports);
    },
    ge = (e) => {
      let t = e.currentTarget.files;
      (t && (P(v, [...B(v), ...Array.from(t).map((e) => e.name)], !0), P(y, [...B(y), ...Array.from(t)], !0)),
        (e.currentTarget.value = ``));
    },
    _e = (e) => {
      e?.preventDefault();
      let t = {};
      (B(m).trim().length < 3 &&
        (t.titre = `Le sujet est trop court : donnez-le en quelques mots (trois lettres au moins).`),
        B(fe) < 20 &&
          (t.brief =
            B(fe) === 0
              ? `Ce champ est obligatoire : décrivez le message, la date, le lieu, les contacts (20 signes au moins).`
              : `Encore ${20 - B(fe)} signe${20 - B(fe) > 1 ? `s` : ``} : la description doit compter 20 signes au moins pour que Fill puisse lancer la production.`),
        B(C).length ? B(T).ok || (t.supports = B(T).erreur ?? ``) : (t.supports = `Choisissez au moins un support.`),
        P(S, t, !0));
      let n = Object.keys(t)[0];
      n
        ? (document.getElementById(n === `supports` ? `supports` : n)?.focus(),
          document.getElementById(n)?.scrollIntoView({
            behavior: `smooth`,
            block: `center`,
          }))
        : (P(b, `verif`),
          scrollTo({
            top: 0,
            behavior: `smooth`,
          }));
    },
    ve = async () => {
      P(x, !0);
      try {
        let e = {
          titre: B(m),
          lignes: B(C),
          urgente: B(d),
          parution: B(u) || null,
          heure: B(se),
          brief: B(h),
          pieces: B(v),
          fichiers: B(y),
        };
        if (B(i)) {
          let t = await modifierDemande(B(i).id, e);
          (toast(
            t.length ? `Demande modifiée` : `Aucun changement`,
            t.length ? `succes` : `info`,
            t.length ? `Changé : ${t.join(`, `)}. Visible dans l’historique.` : void 0,
          ),
            aller(`demande-${B(i).id}`));
        } else {
          let t = await deposerDemande(e);
          oublierSaisie(B(a).id);
          let n = demande(t.id);
          (aller(`demande-${t.id}`),
            feter({
              motif: `envoi`,
              titre: t.statut === `confirmee` ? `Demande confirmée` : `Demande envoyée`,
              detail:
                t.statut === `confirmee` && n?.livraison
                  ? `« ${B(m).trim()} » part en production : livraison prévue le ${jourLong(n.livraison)}.`
                  : `Fill confirme « ${B(m).trim()} » au plus tard ${jourLong(B(T).confirmationAuPlusTard)}, avec sa date de livraison.`,
              actions: [
                {
                  libelle: `Déposer une autre demande`,
                  vers: `nouvelle`,
                },
                {
                  libelle: `Suivre la demande`,
                  principal: !0,
                },
              ],
            }));
        }
      } catch (e) {
        (toast(e.message, `erreur`), P(b, `saisie`));
      } finally {
        P(x, !1);
      }
    };
  var ye = Br(),
    be = I(ye),
    xe = (e) => {
      var t = _v(),
        r = I(t);
      {
        let e = M(() => ({
          href: lienRoute(n() ? `demande-${n()}` : `demandes`),
          libelle: `Retour à la demande`,
        }));
        EnTete(r, {
          titre: `Modification impossible`,
          get retour() {
            return B(e);
          },
        });
      }
      (j(2), U(e, t));
    },
    Se = (e) => {
      var t = Nv(),
        n = I(t);
      {
        let e = M(() => (B(i) ? `Modifier la demande` : `Nouvelle demande`)),
          t = M(() => ({
            href: lienRoute(B(i) ? `demande-${B(i).id}` : `accueil`),
            libelle: B(i) ? `Retour à la demande` : `Accueil`,
          }));
        EnTete(n, {
          get titre() {
            return B(e);
          },
          get retour() {
            return B(t);
          },
        });
      }
      var r = R(n, 2),
        a = F(r),
        o = F(a),
        s = F(o),
        c = (e) => {
          var t = vv(),
            n = F(t);
          Icone(n, {
            n: `horloge`,
          });
          var r = R(n),
            i = R(F(r));
          (A(r), A(t), V(`click`, i, _), U(e, t));
        };
      G(s, (e) => {
        B(g) && e(c);
      });
      var b = R(s, 2);
      (Icone(F(b), {
        n: `info`,
      }),
        j(),
        A(b));
      var x = R(b, 2),
        ee = R(F(x), 2),
        E = R(F(ee), 2);
      ji(E);
      let ie;
      var ae = R(E, 2),
        se = (e) => {
          var t = yv(),
            n = F(t);
          Icone(n, {
            n: `alerte`,
            taille: 15,
          });
          var r = R(n, 1, !0);
          (A(t), z(() => W(r, B(S).titre)), U(e, t));
        };
      (G(ae, (e) => {
        B(S).titre && e(se);
      }),
        A(ee));
      var ce = R(ee, 2),
        ve = R(F(ce), 2);
      at(ve);
      let ye;
      var be = R(ve, 2);
      let xe;
      var Se = F(be),
        Ce = F(Se);
      let O;
      A(Se);
      var we = R(Se, 1, !0);
      (A(be), A(ce));
      var k = R(ce, 2),
        Te = R(F(k), 2),
        Ee = F(Te);
      Icone(Ee, {
        n: `trombone`,
      });
      var De = R(Ee, 3);
      A(Te);
      var Oe = R(Te, 2),
        ke = (e) => {
          var t = xv();
          (K(
            t,
            23,
            () => B(v),
            (e, t) => e + t,
            (e, t, n) => {
              var r = bv(),
                i = F(r);
              Icone(i, {
                n: `fichier`,
                taille: 16,
              });
              var a = R(i),
                o = L(a, !0),
                s = R(a);
              (Icone(F(s), {
                n: `non`,
                taille: 15,
              }),
                A(s),
                A(r),
                z(() => {
                  (W(o, B(t)), J(s, `aria-label`, `Retirer ${B(t) ?? ``}`));
                }),
                V(`click`, s, () => {
                  (P(
                    v,
                    B(v).filter((e, t) => t !== B(n)),
                    !0,
                  ),
                    P(
                      y,
                      B(y).filter((e) => e.name !== B(t)),
                      !0,
                    ));
                }),
                U(e, r));
            },
          ),
            A(t),
            U(e, t));
        };
      (G(Oe, (e) => {
        B(v).length && e(ke);
      }),
        A(k),
        A(x));
      var Ae = R(x, 2),
        je = R(F(Ae), 2),
        Me = (e) => {
          var t = Sv(),
            n = F(t);
          Icone(n, {
            n: `alerte`,
          });
          var r = R(n, 1, !0);
          (A(t), z(() => W(r, B(S).supports)), U(e, t));
        };
      G(je, (e) => {
        B(S).supports && e(Me);
      });
      var Ne = R(je, 2),
        Pe = F(Ne),
        Fe = L(Pe),
        Ie = R(Pe, 2);
      (K(
        Ie,
        23,
        () => B(de),
        (e, t) => e.id + (t < B(ue).length ? `-s` : ``),
        (e, t, n) => {
          var r = Cv();
          let i;
          var a = F(r),
            o = (e) => {
              Icone(e, {
                n: `pilote`,
                taille: 14,
              });
            };
          G(a, (e) => {
            B(n) < B(ue).length && e(o);
          });
          var s = R(a, 1, !0);
          (A(r),
            z(
              (e) => {
                ((i = q(r, 1, `filtre svelte-1q2r354`, null, i, {
                  suggere: B(n) < B(ue).length,
                })),
                  J(r, `title`, B(t).pourquoi),
                  J(r, `aria-pressed`, e),
                  W(s, B(t).nom));
              },
              [() => me(B(t).lignes)],
            ),
            V(`click`, r, () => pe(B(t).lignes)),
            U(e, r));
        },
      ),
        A(Ie),
        A(Ne));
      var Le = R(Ne, 2);
      K(
        Le,
        17,
        () => CATEGORIES,
        (e) => e.id,
        (e, t) => {
          let n = M(() => CATALOGUE.filter((e) => e.cat === B(t).id && !e.bascule));
          var r = Ev(),
            i = F(r),
            a = L(i, !0),
            o = R(i, 2);
          (K(
            o,
            21,
            () => B(n),
            (e) => e.id,
            (e, t) => {
              let n = M(() => w(B(t).min)),
                r = M(() => B(l)[B(t).id] ?? 0);
              var i = Tv();
              let a;
              var o = F(i),
                s = F(o);
              (Icone(F(s), {
                n: `ok`,
                taille: 14,
              }),
                A(s));
              var c = R(s, 2),
                u = F(c),
                d = L(u, !0),
                f = L(R(u), !0);
              A(c);
              var p = L(R(c, 2));
              A(o);
              var m = R(o, 2),
                h = (e) => {
                  var n = wv(),
                    r = R(F(n));
                  {
                    let e = M(() => B(t).max ?? 1);
                    Quantite(r, {
                      min: 0,
                      get max() {
                        return B(e);
                      },
                      get libelle() {
                        return B(t).nom;
                      },
                      taille: `sm`,
                      get valeur() {
                        return B(l)[B(t).id];
                      },
                      set valeur(e) {
                        B(l)[B(t).id] = e;
                      },
                    });
                  }
                  (A(n), U(e, n));
                };
              (G(m, (e) => {
                B(r) > 0 && (B(t).max ?? 1) > 1 && e(h);
              }),
                A(i),
                z(
                  (e) => {
                    ((a = q(i, 1, `presta svelte-1q2r354`, null, a, {
                      on: B(r) > 0,
                      off: !B(n),
                    })),
                      (o.disabled = !B(n)),
                      J(o, `aria-pressed`, B(r) > 0),
                      W(d, B(t).nom),
                      W(f, e),
                      W(p, `${B(t).u ?? ``} u.${B(t).pas ? ` ${B(t).pas}` : ``}`));
                  },
                  [() => (B(n) ? B(t).detail : `À partir de la formule ${formule(B(t).min).nom}`)],
                ),
                V(`click`, o, () => B(n) && he(B(t).id)),
                U(e, i));
            },
          ),
            A(o),
            A(r),
            z(() => W(a, B(t).nom)),
            U(e, r));
        },
      );
      var Re = R(Le, 2),
        ze = (e) => {
          var t = Dv();
          (Icone(F(t), {
            n: `alerte`,
          }),
            j(),
            A(t),
            U(e, t));
        };
      (G(Re, (e) => {
        B(le) && e(ze);
      }),
        A(Ae));
      var Be = R(Ae, 2),
        Ve = F(Be),
        He = R(F(Ve), 1, !0);
      A(Ve);
      var Ue = R(Ve, 2),
        We = R(F(Ue), 2);
      {
        let e = M(aujourdhui);
        ChampDate(We, {
          id: `parution`,
          classe: `saisie date`,
          get min() {
            return B(e);
          },
          get value() {
            return B(u);
          },
          set value(e) {
            P(u, e, !0);
          },
        });
      }
      (j(2), A(Ue));
      var Ge = R(Ue, 2),
        Ke = (e) => {
          var t = Av(),
            n = R(F(t), 2),
            r = F(n);
          let i;
          var a = R(r, 2);
          let o;
          A(n);
          var s = R(n, 2),
            c = (e) => {
              var t = kv(),
                n = R(F(t));
              (K(
                n,
                21,
                () => oe,
                Qr,
                (e, t) => {
                  var n = Ov(),
                    r = L(n, !0),
                    i = {};
                  (z(() => {
                    (W(r, B(t)), i !== (i = B(t)) && (n.value = (n.__value = i) ?? ``));
                  }),
                    U(e, n));
                },
              ),
                A(n),
                Ci(n),
                A(t),
                wi(
                  n,
                  () => B(f),
                  (e) => P(f, e),
                ),
                U(e, t));
            };
          (G(s, (e) => {
            B(p) && e(c);
          }),
            A(t),
            z(() => {
              (J(r, `aria-checked`, !B(p)),
                (i = q(r, 1, `choix h-c svelte-1q2r354`, null, i, {
                  on: !B(p),
                })),
                J(a, `aria-checked`, B(p)),
                (o = q(a, 1, `choix h-c svelte-1q2r354`, null, o, {
                  on: B(p),
                })));
            }),
            V(`click`, r, () => P(p, !1)),
            V(`click`, a, () => {
              (P(p, !0), B(f) || P(f, `18:00`));
            }),
            U(e, t));
        };
      G(Ge, (e) => {
        B(re) && e(Ke);
      });
      var qe = R(Ge, 2),
        Je = (e) => {
          var t = jv();
          let n;
          var r = F(t),
            i = F(r);
          (Icone(F(i), {
            n: `eclair`,
            taille: 16,
          }),
            j(),
            A(i));
          var a = L(R(i, 2));
          A(r);
          var o = R(r, 2);
          (A(t),
            z(() => {
              ((n = q(t, 1, `urgence svelte-1q2r354`, null, n, {
                on: B(d),
              })),
                W(
                  a,
                  `Délai divisé par deux. ${B(T).urgenceIncluse ? `Incluse dans votre formule sur cette période.` : `+${OFFRE.urgenceUnites} unité.`}`,
                ),
                J(o, `aria-checked`, B(d)));
            }),
            V(`click`, o, () => P(d, !B(d))),
            U(e, t));
        };
      (G(qe, (e) => {
        B(T).nature !== `planifie` && e(Je);
      }),
        A(Be),
        A(o),
        A(a));
      var Ye = R(a, 2),
        Xe = F(Ye),
        Ze = F(Xe),
        Qe = F(Ze);
      (Zr(
        F(Qe),
        () => B(D),
        (e) => {
          var t = Mv(),
            n = L(t, !0);
          (z(() => W(n, B(D))), U(e, t));
        },
      ),
        A(Qe));
      var $e = R(Qe),
        et = F($e),
        tt = R(et);
      let nt;
      var rt = L(tt, !0);
      (A($e), A(Ze));
      var it = R(Ze, 2);
      (Fleche(R(F(it)), {}),
        A(it),
        A(Xe),
        A(Ye),
        A(r),
        z(
          (e, t, n, r, i) => {
            ((ie = q(E, 1, `saisie svelte-1q2r354`, null, ie, {
              "erreur-champ": B(S).titre,
            })),
              J(E, `aria-invalid`, e),
              J(E, `aria-describedby`, B(S).titre ? `e-titre` : void 0),
              (ye = q(ve, 1, `saisie svelte-1q2r354`, null, ye, {
                "erreur-champ": B(S).brief,
              })),
              J(ve, `aria-invalid`, t),
              (xe = q(be, 1, `compteur svelte-1q2r354`, null, xe, {
                ok: B(fe) >= 20,
                ko: B(S).brief && B(fe) < 20,
              })),
              (O = yi(Ce, ``, O, {
                width: n,
              })),
              W(we, B(fe) >= 20 ? `${B(fe)} signes` : `${B(fe)} / 20 signes minimum`),
              W(Fe, `Raccourcis${B(ue).length ? `, d’après votre sujet` : ``}`),
              W(He, B(re) ? `La date et l’heure` : `La date`),
              W(et, `unité${B(D) > 1 ? `s` : ``}`),
              (nt = q(tt, 1, `svelte-1q2r354`, null, nt, {
                manque: r,
              })),
              W(rt, i));
          },
          [
            () => !!B(S).titre,
            () => !!B(S).brief,
            () => `${Math.min(100, (B(fe) / 20) * 100)}%`,
            () => Object.keys(B(S)).length || B(ne) > 0,
            () =>
              Object.keys(B(S)).length
                ? `${Object.keys(B(S)).length} point${Object.keys(B(S)).length > 1 ? `s` : ``} à compléter`
                : B(C).length
                  ? B(ne) > 0
                    ? `${B(ne)} unité${B(ne) > 1 ? `s` : ``} à recharger avant l’envoi`
                    : `${B(C).length} support${B(C).length > 1 ? `s` : ``} · ${Math.max(0, B(te) - B(D))} unités resteront`
                  : `Aucun support choisi`,
          ],
        ),
        Or(`submit`, r, _e),
        Ii(
          E,
          () => B(m),
          (e) => P(m, e),
        ),
        Ii(
          ve,
          () => B(h),
          (e) => P(h, e),
        ),
        V(`change`, De, ge),
        U(e, t));
    },
    Ce = (e) => {
      var t = qv(),
        n = I(t);
      EnTete(n, {
        titre: `Vérifier la demande`,
      });
      var o = R(n, 2),
        s = F(o),
        c = F(s),
        l = F(c),
        f = F(l),
        p = R(F(f), 2),
        g = L(p, !0),
        _ = R(p, 2),
        y = L(_, !0),
        S = R(_, 2),
        C = (e) => {
          var t = xv();
          (K(
            t,
            20,
            () => B(v),
            (e) => e,
            (e, t) => {
              var n = Pv(),
                r = F(n);
              Icone(r, {
                n: `fichier`,
                taille: 16,
              });
              var i = L(R(r), !0);
              (A(n), z(() => W(i, t)), U(e, n));
            },
          ),
            A(t),
            U(e, t));
        };
      (G(S, (e) => {
        B(v).length && e(C);
      }),
        A(f));
      var w = R(f, 2),
        D = R(F(w), 2),
        oe = F(D),
        le = F(oe);
      K(
        le,
        17,
        () => B(T).detail,
        (e) => e.prestation,
        (e, t) => {
          var n = Fv(),
            r = F(n),
            i = L(r),
            a = R(r),
            o = L(a, !0),
            s = L(R(a), !0);
          (A(n),
            z(() => {
              (W(i, `${B(t).quantite ?? ``} ×`), W(o, B(t).nom), W(s, B(t).unites));
            }),
            U(e, n));
        },
      );
      var ue = R(le),
        de = (e) => {
          var t = Iv(),
            n = F(t);
          (Icone(F(n), {
            n: `eclair`,
            taille: 14,
          }),
            A(n));
          var r = L(R(n, 2), !0);
          (A(t), z(() => W(r, B(T).urgenceIncluse ? `incluse` : `+${B(T).unitesUrgence}`)), U(e, t));
        };
      (G(ue, (e) => {
        B(d) && e(de);
      }),
        A(oe));
      var fe = R(oe),
        pe = F(fe),
        me = L(R(F(pe), 2));
      (A(pe), A(fe), A(D));
      var he = R(D, 2),
        ge = F(he),
        _e = F(ge);
      let ye;
      var be = R(_e);
      let xe;
      A(ge);
      var Se = R(ge, 2),
        Ce = F(Se),
        O = L(Ce, !0),
        we = R(Ce),
        k = L(R(we), !0);
      (j(), A(Se), A(he), A(w));
      var Te = R(w, 2),
        Ee = R(F(Te), 2),
        De = F(Ee),
        Oe = L(R(F(De)));
      A(De);
      var ke = R(De, 2),
        Ae = L(R(F(ke)), !0);
      A(ke);
      var je = R(ke, 2),
        Me = (e) => {
          var t = Lv();
          let n;
          var r = L(R(F(t)));
          (A(t),
            z(
              (e, i) => {
                ((n = q(t, 1, `svelte-1q2r354`, null, n, {
                  ko: B(T).parutionTenable === !1,
                })),
                  W(r, `${e ?? ``}${i ?? ``}`));
              },
              [() => jourLong(B(u)), () => (B(se) ? ` à ${ae(B(se))}` : ``)],
            ),
            U(e, t));
        };
      G(je, (e) => {
        B(u) && e(Me);
      });
      var Ne = R(je, 2),
        Pe = (e) => {
          var t = Rv(),
            n = L(R(F(t)), !0);
          (A(t),
            z((e) => W(n, e), [() => (B(se) ? `à ${ae(B(se))}` : `au meilleur moment, choisi par Fill`)]),
            U(e, t));
        };
      (G(Ne, (e) => {
        B(re) && e(Pe);
      }),
        A(Ee),
        A(Te));
      var Fe = R(Te, 2),
        Ie = (e) => {
          var t = Bv(),
            n = F(t);
          Icone(n, {
            n: `cle`,
          });
          var i = R(n),
            a = R(i),
            o = (e) => {
              var t = zv();
              (z((e) => J(t, `href`, e), [() => lienRoute(`comptes`)]), U(e, t));
            };
          (G(a, (e) => {
            B(r).role === `referent` && e(o);
          }),
            A(t),
            z(
              (e) =>
                W(
                  i,
                  `Fill n’a pas encore accès à : ${e ?? ``}. Pour ${B(ie).length > 1 ? `ces canaux` : `ce canal`}, il vous remet le contenu prêt à publier.`,
                ),
              [() => B(ie).map(nomCanal).join(`, `)],
            ),
            U(e, t));
        };
      G(Fe, (e) => {
        B(ie).length && e(Ie);
      });
      var Le = R(Fe, 2),
        Re = (e) => {
          var t = Vv(),
            n = F(t);
          Icone(n, {
            n: `alerte`,
          });
          var r = R(n, 1, !0);
          (A(t),
            z(() =>
              W(
                r,
                B(T).nature === `planifie`
                  ? `Délai court pour cette date : Fill vous recontacte pour la confirmer.`
                  : !B(d) && B(T).livraisonUrgente && B(T).livraisonUrgente <= B(u)
                    ? `La parution est proche : passez la demande en urgente pour la tenir.`
                    : `La parution est trop proche pour le délai de production : Fill vous proposera une date.`,
              ),
            ),
            U(e, t));
        };
      G(Le, (e) => {
        B(T).parutionTenable === !1 && e(Re);
      });
      var ze = R(Le, 2),
        Be = (e) => {
          var t = Hv(),
            n = F(t),
            r = L(n, !0),
            i = R(n, 2),
            o = L(i);
          (CommandeUnites(R(i, 2), {
            get manque() {
              return B(ne);
            },
            avant: ce,
          }),
            A(t),
            z(
              (e) => {
                (W(
                  r,
                  B(a).statut === `a_activer`
                    ? `Vos premières unités ne sont pas encore sur le compte`
                    : `Il manque ${B(ne)} unité${B(ne) > 1 ? `s` : ``} pour envoyer cette demande`,
                ),
                  W(
                    o,
                    `${e ?? ``} Votre demande est gardée sur cet appareil : rechargez le compte, puis revenez l’envoyer.`,
                  ));
              },
              [
                () =>
                  B(a).statut === `a_activer`
                    ? `Cette demande compte ${B(T).unites} unité${B(T).unites > 1 ? `s` : ``}.`
                    : `Elle compte ${B(T).unites} unités, il en reste ${Math.max(0, B(T).unites - B(ne))} sur le compte.`,
              ],
            ),
            U(e, t));
        },
        Ve = (e) => {
          var t = Uv();
          (Icone(F(t), {
            n: `info`,
          }),
            j(),
            A(t),
            U(e, t));
        },
        He = (e) => {
          var t = Wv();
          (Icone(F(t), {
            n: `horloge`,
          }),
            j(),
            A(t),
            U(e, t));
        };
      (G(ze, (e) => {
        B(ne) > 0 ? e(Be) : B(ee).requis ? e(Ve, 1) : etat.d.pilote.confirmation && !B(i) && e(He, 2);
      }),
        A(l));
      var Ue = R(l, 2),
        We = F(Ue);
      (Icone(F(We), {
        n: `al`,
        taille: 18,
      }),
        j(),
        A(We));
      var Ge = R(We, 2),
        Ke = (e) => {
          U(e, Gv());
        },
        qe = (e) => {
          var t = Kv(),
            n = F(t);
          (Fleche(R(n), {}),
            A(t),
            z(() => {
              ((t.disabled = B(x)), W(n, `${B(i) ? `Enregistrer les modifications` : `Envoyer la demande`} `));
            }),
            V(`click`, t, ve),
            U(e, t));
        };
      (G(Ge, (e) => {
        B(ne) > 0 ? e(Ke) : e(qe, -1);
      }),
        A(Ue),
        A(c),
        A(s),
        A(o),
        z(
          (e, t, n, r, i, a, o, s) => {
            (W(g, B(m)),
              W(y, B(h)),
              W(me, `${B(T).unites ?? ``} unité${B(T).unites > 1 ? `s` : ``}`),
              (ye = yi(_e, ``, ye, {
                width: e,
              })),
              (xe = yi(be, ``, xe, {
                width: t,
              })),
              W(O, n),
              W(we, ` unité${r ?? ``} disponible${i ?? ``} sur la période, `),
              W(k, a),
              W(Oe, `au plus tard ${o ?? ``}`),
              W(Ae, s));
          },
          [
            () => `${Math.min(100, ((B(E).total - B(te)) / Math.max(1, B(E).total)) * 100)}%`,
            () => `${Math.min(100, (B(T).unites / Math.max(1, B(E).total)) * 100)}%`,
            () => Math.max(0, B(te)),
            () => (Math.max(0, B(te)) > 1 ? `s` : ``),
            () => (Math.max(0, B(te)) > 1 ? `s` : ``),
            () => Math.max(0, B(te) - B(T).unites),
            () => jourLong(B(T).confirmationAuPlusTard),
            () =>
              B(T).livraisonAuPlusTot ? `au plus tôt ${jourLong(B(T).livraisonAuPlusTot)}` : `date convenue avec Fill`,
          ],
        ),
        V(`click`, We, () => P(b, `saisie`)),
        U(e, t));
    };
  (G(be, (e) => {
    B(o) ? e(xe) : B(b) === `saisie` ? e(Se, 1) : e(Ce, -1);
  }),
    U(e, ye),
    Je());
}
kr([`click`, `change`]);
