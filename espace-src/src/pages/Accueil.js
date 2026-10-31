// Composant Accueil (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var D_ = H(`<a class="bt lg"><!>Nouvelle demande</a>`),
  O_ = H(
    `<p class="mu">Fill vous appelle pour caler le volume d’unités. Le bon de commande de votre abonnement est déjà prêt : faites-le signer, puis renvoyez-le ici, ou donnez simplement son numéro d’engagement. Vos unités sont créditées dès sa validation.</p>`,
  ),
  k_ = H(
    `<section class="activation carte pad svelte-5ho6zo" aria-labelledby="t-act"><span class="rond svelte-5ho6zo"><!></span> <div class="a-txt svelte-5ho6zo"><h2 class="t3" id="t-act"> </h2> <!> <!> <p class="petit">Votre espace est déjà ouvert : invitez vos collègues et préparez vos demandes. Elles partent dès que les unités sont sur le compte.</p></div></section>`,
  ),
  A_ = H(
    `<li class="svelte-5ho6zo"><span class="pt svelte-5ho6zo">2</span><div class="svelte-5ho6zo"><b>Recevoir vos premières unités</b><small class="svelte-5ho6zo"> </small></div></li>`,
  ),
  j_ = H(
    `<li><span class="pt svelte-5ho6zo"><!></span><div class="svelte-5ho6zo"><b>Inviter vos collègues</b><small class="svelte-5ho6zo"> </small></div><a class="lien svelte-5ho6zo"> <!></a></li>`,
  ),
  M_ = H(
    `<li><span class="pt svelte-5ho6zo"><!></span><div class="svelte-5ho6zo"><b>Donner à Fill l’accès à vos comptes</b><small class="svelte-5ho6zo"> </small></div><a class="lien svelte-5ho6zo"> <!></a></li>`,
  ),
  N_ = H(`<a class="lien svelte-5ho6zo">Commencer <!></a>`),
  P_ = H(
    `<section class="carte pad depart svelte-5ho6zo" aria-labelledby="t-dep"><h2 class="t2" id="t-dep">Pour démarrer</h2> <ol class="etapes svelte-5ho6zo"><li><span class="pt svelte-5ho6zo"><!></span><div class="svelte-5ho6zo"><b>Comprendre le fonctionnement</b><small class="svelte-5ho6zo">Les unités, une demande par sujet, la validation.</small></div><button class="lien svelte-5ho6zo"> <!></button></li> <!> <!> <!> <li class="svelte-5ho6zo"><span class="pt svelte-5ho6zo"> </span><div class="svelte-5ho6zo"><b>Déposer une première demande</b><small class="svelte-5ho6zo">Un sujet, ses supports, sa date : quelques minutes.</small></div><!></li> <li class="svelte-5ho6zo"><span class="pt svelte-5ho6zo"> </span><div class="svelte-5ho6zo"><b>Suivre vos unités</b><small class="svelte-5ho6zo"> </small></div><a class="lien svelte-5ho6zo">Voir <!></a></li></ol></section>`,
  ),
  F_ = H(
    `<a class="carte pad acces carte-lien svelte-5ho6zo"><span class="rond svelte-5ho6zo"><!></span> <span class="svelte-5ho6zo"><b> </b><small class="mu svelte-5ho6zo">Sans accès, Fill vous remet les fichiers et la publication reste de votre côté.</small></span> <!></a>`,
  ),
  I_ = H(`<img alt="" loading="lazy" class="svelte-5ho6zo"/>`),
  L_ = H(`<b class="num svelte-5ho6zo"> </b><i class="svelte-5ho6zo">unités à engager</i>`, 1),
  R_ = H(`<span class="sans svelte-5ho6zo"><!></span>`),
  z_ = H(
    `<li class="svelte-5ho6zo"><a class="action carte carte-lien svelte-5ho6zo"><span class="puits svelte-5ho6zo"><!> <span> </span></span> <span class="txt svelte-5ho6zo"><span class="etat-m svelte-5ho6zo"> </span> <b class="svelte-5ho6zo"> </b> <span class="mu petit"><!></span></span> <span class="fl svelte-5ho6zo" aria-hidden="true"><!></span></a></li>`,
  ),
  B_ = H(
    `<section class="bloc" aria-labelledby="t-afaire"><div class="entete"><h2 class="t2" id="t-afaire">À faire de votre côté<span class="compte num svelte-5ho6zo"> </span></h2></div> <ul class="afaire svelte-5ho6zo"></ul></section>`,
  ),
  V_ = H(`<li><!></li>`),
  H_ = H(`<ul class="liste svelte-5ho6zo"></ul>`),
  U_ = H(`<a class="bt sm svelte-5ho6zo">Déposer une demande <!></a>`),
  W_ = H(
    `<div class="vide svelte-5ho6zo"><b>Aucune demande en cours.</b><span>Une actualité, une affiche, un reportage : décrivez-le en quelques lignes.</span><!></div>`,
  ),
  G_ = H(`<p class="tres-petit mu"> </p>`),
  K_ = H(
    `<li class="svelte-5ho6zo"><span class="jour svelte-5ho6zo"><b class="num svelte-5ho6zo"> </b> </span><a class="svelte-5ho6zo"><b class="svelte-5ho6zo"> </b><small class="svelte-5ho6zo"> </small></a></li>`,
  ),
  q_ = H(`<ol class="parutions svelte-5ho6zo"></ol>`),
  J_ = H(`<p class="mu petit p-vide svelte-5ho6zo">Aucune date de parution à venir.</p>`),
  // bloc « À anticiper » : prochains temps forts du calendrier type (regles/tempsforts.js)
  Tf_ = H(
    `<li class="svelte-5ho6zo"><span class="jour svelte-5ho6zo"><b class="num svelte-5ho6zo"> </b> </span><a class="tf-a svelte-5ho6zo"><span class="tf-t svelte-5ho6zo"><span class="sr">Préparer une demande : </span><b class="svelte-5ho6zo"> </b><small class="svelte-5ho6zo"> </small></span><span class="tf-go svelte-5ho6zo" aria-hidden="true"><!></span></a></li>`,
  ),
  TfB_ = H(
    `<section class="carte pad" aria-labelledby="t-tf"><h2 class="t3" id="t-tf">À anticiper</h2> <p class="tres-petit mu tf-note svelte-5ho6zo">Suggestions tirées d’un calendrier type de l’année. Les dates sont indicatives : choisir un temps fort ouvre une demande déjà préparée, à compléter.</p> <ol class="parutions tf svelte-5ho6zo"></ol></section>`,
  ),
  Cours_ = H(
    `<section class="carte pad cours svelte-5ho6zo" aria-labelledby="t-cours"><div class="entete"><h2 class="t2" id="t-cours">En cours</h2> <a class="lien">Toutes les demandes <!></a></div> <!></section>`,
  ),
  Uni_ = H(
    `<a class="carte pad unites carte-lien svelte-5ho6zo"><div class="entete"><h2 class="t3"> </h2><span class="fl svelte-5ho6zo" aria-hidden="true"><!></span></div> <div class="u-corps svelte-5ho6zo"><!> <dl class="num svelte-5ho6zo"><div class="svelte-5ho6zo"><dt class="svelte-5ho6zo"><i class="c1 svelte-5ho6zo"></i>Disponibles</dt><dd class="svelte-5ho6zo"> </dd></div> <div class="svelte-5ho6zo"><dt class="svelte-5ho6zo"><i class="c2 svelte-5ho6zo"></i>Réservées</dt><dd class="svelte-5ho6zo"> </dd></div> <div class="svelte-5ho6zo"><dt class="svelte-5ho6zo"><i class="c3 svelte-5ho6zo"></i>Décomptées</dt><dd class="svelte-5ho6zo"> </dd></div></dl></div> <!></a>`,
  ),
  Par_ = H(
    `<section class="carte pad svelte-5ho6zo" aria-labelledby="t-par"><h2 class="t3" id="t-par">Prochaines parutions</h2> <!></section>`,
  ),
  // tableau de bord personnalisable : un module par carte, barre d'outils en mode personnalisation
  Mod_ = H(`<div class="mod svelte-5ho6zo"><!> <div class="mod-corps svelte-5ho6zo"><!></div></div>`),
  Outils_ = H(
    `<div class="mod-outils svelte-5ho6zo"><button type="button" class="mod-poignee svelte-5ho6zo"><!><b class="svelte-5ho6zo"> </b></button> <span class="mod-bts svelte-5ho6zo"><button type="button" class="mod-bt mod-monter svelte-5ho6zo"><!></button><button type="button" class="mod-bt mod-descendre svelte-5ho6zo"><!></button><!><!></span></div>`,
  ),
  Larg_ = H(
    `<button type="button" class="mod-bt mod-larg svelte-5ho6zo"><span class="ic-larg svelte-5ho6zo" aria-hidden="true"><i class="svelte-5ho6zo"></i><i class="svelte-5ho6zo"></i></span></button>`,
  ),
  Masq_ = H(`<button type="button" class="mod-bt mod-masq svelte-5ho6zo"><!></button>`),
  Masque_ = H(`<div class="mod-masque svelte-5ho6zo"><span>Carte masquée sur votre accueil</span></div>`),
  Act_ = H(`<!> <!>`, 1),
  Perso_ = H(`<button type="button" class="bt cl lg tdb-perso svelte-5ho6zo" title="Personnaliser l’accueil"><!><span class="tdb-perso-l svelte-5ho6zo">Personnaliser</span></button>`),
  ToutMasque_ = H(`<p class="mu petit">Toutes les cartes sont masquées.</p>`),
  Edit_ = H(
    `<div class="tdb-edition svelte-5ho6zo"><p class="svelte-5ho6zo" id="tdb-aide" tabindex="-1"><b class="svelte-5ho6zo">Personnaliser l’accueil</b> <span class="svelte-5ho6zo">Faites glisser une carte pour la déplacer, ou utilisez les flèches de sa barre. Votre disposition est enregistrée sur cet appareil.</span></p> <div class="tdb-ed-bts svelte-5ho6zo"><button type="button" class="lien-discret svelte-5ho6zo">Rétablir la disposition par défaut</button> <button type="button" class="bt sm svelte-5ho6zo"><!>Terminer</button></div></div>`,
  ),
  Y_ = H(
    `<!> <div class="feuille"><div class="w entre"><!> <!> <!> <div class="tdb-zone svelte-5ho6zo"><div class="tdb svelte-5ho6zo"></div> <div class="tdb-barre svelte-5ho6zo"><!></div> <p class="sr" aria-live="polite"> </p></div></div></div>`,
    1,
  );

// Disposition du tableau de bord (Accueil), par utilisateur, dans le stockage du navigateur.
// Le profil n'a pas de champ libre en base : l'enregistrer côté serveur demandera une migration.
var TDB_MODULES = [`afaire`, `cours`, `unites`, `parutions`, `anticiper`],
  TDB_NOMS = {
    afaire: `À faire de votre côté`,
    cours: `En cours`,
    unites: `Unités`,
    parutions: `Prochaines parutions`,
    anticiper: `À anticiper`,
  },
  // toujours en pleine largeur et toujours affiché : ce sont les actions attendues du client
  TDB_FIXES = [`afaire`],
  cleTableauDeBord = (e) => `fill-tableau-de-bord-${e ?? `anonyme`}`,
  normaliserTableauDeBord = (e) => {
    let t = e && typeof e == `object` ? e : {},
      n = Array.isArray(t.ordre) ? t.ordre.filter((e, t, n) => TDB_MODULES.includes(e) && n.indexOf(e) === t) : [];
    for (let e of TDB_MODULES) n.includes(e) || n.splice(Math.min(TDB_MODULES.indexOf(e), n.length), 0, e);
    return {
      ordre: n,
      masques: Array.isArray(t.masques)
        ? t.masques.filter((e, t, n) => TDB_MODULES.includes(e) && !TDB_FIXES.includes(e) && n.indexOf(e) === t)
        : [],
      largeurs: Object.fromEntries(
        Object.entries(t.largeurs && typeof t.largeurs == `object` ? t.largeurs : {}).filter(
          ([e, t]) => TDB_MODULES.includes(e) && !TDB_FIXES.includes(e) && (t === `simple` || t === `double`),
        ),
      ),
    };
  },
  lireTableauDeBord = (e) => {
    try {
      let t = localStorage.getItem(cleTableauDeBord(e));
      return t ? normaliserTableauDeBord(JSON.parse(t)) : null;
    } catch {
      return null;
    }
  },
  ecrireTableauDeBord = (e, t) => {
    try {
      localStorage.setItem(cleTableauDeBord(e), JSON.stringify({ v: 1, ...t }));
    } catch {}
  },
  effacerTableauDeBord = (e) => {
    try {
      localStorage.removeItem(cleTableauDeBord(e));
    } catch {}
  };
function Accueil(e, t) {
  qe(t, !0);
  let n = M(moi),
    r = M(() => organisation(B(n).organisationId)),
    i = M(() => unitesPeriode(B(r).id)),
    a = M(() => unitesEnAttente(B(r).id)),
    o = M(mesDemandes),
    s = M(() => B(n).role === `referent`),
    c = M(() =>
      B(o).filter(
        (e) =>
          attendClient(e.statut) &&
          (B(s) || e.statut === `attente_client` || (B(n).role === `contributeur` && e.statut === `a_valider`)),
      ),
    ),
    l = M(() =>
      B(o)
        .filter((e) => estEnCours(e.statut) && !B(c).includes(e))
        .sort((e, t) => (e.livraison ?? `9999`).localeCompare(t.livraison ?? `9999`)),
    ),
    u = M(() =>
      B(o)
        .filter((e) => e.parution && e.parution >= aujourdhui() && e.statut !== `annulee`)
        .sort((e, t) => e.parution.localeCompare(t.parution))
        .slice(0, 5),
    ),
    d = M(() => B(n).nom.split(` `)[0]),
    f = (e) => {
      let t = e.versions.at(-1)?.fichiers[0];
      return t?.src ?? t?.srcs?.[0] ?? t?.pages?.[0] ?? null;
    },
    p = M(() => B(o).length === 0),
    m = M(() => membres(B(r).id).length - 1),
    h = M(() => etatAcces(B(r).acces)),
    g = M(() => (B(r).acces ?? []).some((e) => e.statut === `a_donner` && e.note)),
    tf = M(() => (B(n).role === `lecteur` ? [] : prochainsTempsForts(B(r), B(o), 4)));
  // --- Tableau de bord : modules déplaçables (mode « Personnaliser ») ---
  let tdbLargeursDefaut = {
      cours: `double`,
      unites: `simple`,
      parutions: `simple`,
      anticiper: `double`,
    },
    tdbMoi = () => B(n).id,
    tdbDisp = N(lireTableauDeBord(tdbMoi()) ?? normaliserTableauDeBord(null)),
    tdbEdition = N(!1),
    tdbGlisse = N(null),
    tdbAnnonce = N(``),
    tdbApplicable = (e) => (e === `afaire` ? B(c).length > 0 : e === `anticiper` ? B(tf).length > 0 : !0),
    tdbVisibles = M(() =>
      B(tdbDisp).ordre.filter((e) => tdbApplicable(e) && (B(tdbEdition) || !B(tdbDisp).masques.includes(e))),
    ),
    tdbLargeur = (e) => (TDB_FIXES.includes(e) ? `pleine` : (B(tdbDisp).largeurs[e] ?? tdbLargeursDefaut[e])),
    tdbReduit = () => typeof matchMedia < `u` && matchMedia(`(prefers-reduced-motion: reduce)`).matches,
    tdbGrille = null,
    tdbEnregistrer = (e) => {
      (P(tdbDisp, e), ecrireTableauDeBord(tdbMoi(), e));
    },
    // animation des cartes qui changent de place (positions avant / après la mise à jour)
    tdbAnimer = (e, t) => {
      let n = tdbGrille,
        r = new Map();
      if (n && !tdbReduit())
        for (let e of n.children) e.dataset.id && r.set(e.dataset.id, e.getBoundingClientRect());
      if ((e(), !r.size)) return;
      requestAnimationFrame(() => {
        for (let e of n.children) {
          let n = r.get(e.dataset.id);
          if (!n || e.dataset.id === t) continue;
          let i = e.getBoundingClientRect(),
            a = n.left - i.left,
            o = n.top - i.top;
          (a || o) &&
            e.animate([{ transform: `translate(${a}px, ${o}px)` }, { transform: `none` }], {
              duration: 300,
              easing: `cubic-bezier(0.16, 1, 0.3, 1)`,
            });
        }
      });
    },
    tdbDeplacer = (e, t, n = !0) => {
      let r = B(tdbVisibles).slice(),
        i = r.indexOf(e);
      if (i < 0) return;
      if (((t = Math.max(0, Math.min(r.length - 1, t))), t === i)) return;
      (r.splice(i, 1), r.splice(t, 0, e));
      let a = new Set(r),
        o = 0,
        s = B(tdbDisp).ordre.map((e) => (a.has(e) ? r[o++] : e));
      (tdbAnimer(() => tdbEnregistrer({ ...B(tdbDisp), ordre: s }), B(tdbGlisse)),
        n && P(tdbAnnonce, `${TDB_NOMS[e]} : position ${t + 1} sur ${r.length}.`));
    },
    tdbRefocus = (e, t) =>
      requestAnimationFrame(() => {
        let n = tdbGrille?.querySelector(`.mod[data-id="${e}"]`),
          r = n?.querySelector(t);
        (r && !r.disabled ? r : n?.querySelector(`.mod-poignee`))?.focus();
      }),
    tdbClavier = (e, t) => {
      let n = B(tdbVisibles),
        r = n.indexOf(t),
        i = {
          ArrowUp: r - 1,
          ArrowLeft: r - 1,
          ArrowDown: r + 1,
          ArrowRight: r + 1,
          Home: 0,
          End: n.length - 1,
        }[e.key];
      i !== void 0 && (e.preventDefault(), tdbDeplacer(t, i), tdbRefocus(t, `.mod-poignee`));
    },
    // glisser-déposer à la souris, au doigt ou au stylet (Pointer Events), par la poignée de la carte
    tdbPrise = (e, t, n) => {
      if ((e.button ?? 0) > 0 || !B(tdbEdition) || B(tdbGlisse)) return;
      let r = n.closest(`.mod`),
        i = tdbGrille;
      if (!r || !i) return;
      e.preventDefault();
      let a = i.getBoundingClientRect(),
        o = e.clientX - (a.left + r.offsetLeft),
        s = e.clientY - (a.top + r.offsetTop),
        c = e.clientX,
        l = e.clientY,
        u = B(tdbDisp).ordre,
        d = null,
        f = 0,
        p = !1,
        w = 0;
      P(tdbGlisse, t);
      let m = () => {
          let e = i.getBoundingClientRect();
          r.style.transform = `translate(${c - o - (e.left + r.offsetLeft)}px, ${l - s - (e.top + r.offsetTop)}px)`;
        },
        h = () => {
          let e = i.getBoundingClientRect(),
            n = null;
          for (let t of i.children) {
            if (t === r || !t.dataset.id) continue;
            let i = e.left + t.offsetLeft,
              a = e.top + t.offsetTop;
            if (c >= i && c <= i + t.offsetWidth && l >= a && l <= a + t.offsetHeight) {
              n = t.dataset.id;
              break;
            }
          }
          if (!n) {
            d = null;
            return;
          }
          // court délai après chaque échange : les cartes se replacent avant un nouveau test
          n !== d &&
            performance.now() > w &&
            ((d = n), (w = performance.now() + 280), tdbDeplacer(t, B(tdbVisibles).indexOf(n), !1));
        },
        g = () => {
          if (p) return;
          let e = innerHeight,
            t = l < 90 ? -Math.ceil((90 - l) / 5) : l > e - 90 ? Math.ceil((l - (e - 90)) / 5) : 0;
          (t && scrollBy(0, t), h(), m(), (f = requestAnimationFrame(g)));
        },
        _ = (t) => {
          t.pointerId === e.pointerId && ((c = t.clientX), (l = t.clientY), h());
        },
        v = (e) => {
          e.key === `Escape` && (e.preventDefault(), e.stopPropagation(), y(!0));
        },
        y = (a) => {
          if (p) return;
          ((p = !0),
            cancelAnimationFrame(f),
            removeEventListener(`pointermove`, _),
            removeEventListener(`pointerup`, b),
            removeEventListener(`pointercancel`, x),
            removeEventListener(`blur`, x),
            removeEventListener(`keydown`, v, !0));
          a && tdbAnimer(() => tdbEnregistrer({ ...B(tdbDisp), ordre: u }), t);
          let d = c - o,
            m = l - s;
          ((r.style.transform = ``),
            P(tdbGlisse, null),
            requestAnimationFrame(() => {
              let e = i.getBoundingClientRect(),
                t = d - (e.left + r.offsetLeft),
                n = m - (e.top + r.offsetTop);
              !tdbReduit() &&
                (t || n) &&
                r.animate([{ transform: `translate(${t}px, ${n}px)` }, { transform: `none` }], {
                  duration: 260,
                  easing: `cubic-bezier(0.16, 1, 0.3, 1)`,
                });
            }));
          let g = B(tdbVisibles);
          P(
            tdbAnnonce,
            a ? `Déplacement annulé.` : `${TDB_NOMS[t]} : position ${g.indexOf(t) + 1} sur ${g.length}.`,
          );
        },
        b = (t) => (!t || t.pointerId === e.pointerId) && y(!1),
        x = (t) => (!t?.pointerId || t.pointerId === e.pointerId) && y(!0);
      // écoute sur la fenêtre : la carte change de place dans le DOM pendant le déplacement
      (addEventListener(`pointermove`, _),
        addEventListener(`pointerup`, b),
        addEventListener(`pointercancel`, x),
        addEventListener(`blur`, x),
        addEventListener(`keydown`, v, !0),
        (f = requestAnimationFrame(g)));
    },
    tdbOuvrir = () => {
      (P(tdbEdition, !0),
        P(tdbAnnonce, ``),
        requestAnimationFrame(() => document.getElementById(`tdb-aide`)?.focus({ preventScroll: !0 })));
    },
    tdbFermer = () => {
      (P(tdbEdition, !1), requestAnimationFrame(() => document.querySelector(`.tdb-perso`)?.focus({ preventScroll: !0 })));
    },
    tdbRetablir = () => {
      (effacerTableauDeBord(tdbMoi()),
        tdbAnimer(() => P(tdbDisp, normaliserTableauDeBord(null))),
        P(tdbAnnonce, `Disposition par défaut rétablie.`));
    };
  wn(() => {
    if (!B(tdbEdition)) return;
    let e = (e) => {
      e.key === `Escape` && !B(tdbGlisse) && !document.querySelector(`.visite,.volet,[role="dialog"]`) && tdbFermer();
    };
    return (addEventListener(`keydown`, e), () => removeEventListener(`keydown`, e));
  });
  var _ = Y_(),
    v = I(_);
  {
    let e = (e) => {
        var t = Act_(),
          r = I(t),
          r2 = R(r, 2),
          i = (e) => {
            var t = D_();
            (Icone(F(t), {
              n: `plus`,
            }),
              j(),
              A(t),
              z((e) => J(t, `href`, e), [() => lienRoute(`nouvelle`)]),
              U(e, t));
          };
        (G(r, (e) => {
          B(n).role !== `lecteur` && e(i);
        }),
          G(r2, (e) => {
            B(tdbEdition) ||
              e((e) => {
                var t = Perso_();
                (Icone(F(t), {
                  n: `reglages`,
                  taille: 18,
                }),
                  V(`click`, t, () => tdbOuvrir()),
                  U(e, t));
              });
          }),
          U(e, t));
      },
      t = M(() => jourLong(aujourdhui()).replace(/^./, (e) => e.toUpperCase()));
    EnTete(v, {
      get titre() {
        return `Bonjour ${B(d) ?? ``}`;
      },
      get surtitre() {
        return B(t);
      },
      actions: e,
      $$slots: {
        actions: !0,
      },
    });
  }
  var y = R(v, 2),
    b = F(y),
    x = F(b),
    S = (e) => {
      var t = k_(),
        n = F(t);
      (Icone(F(n), {
        n: `horloge`,
        taille: 24,
      }),
        A(n));
      var i = R(n, 2),
        a = F(i),
        o = L(a, !0),
        s = R(a, 2),
        c = (e) => {
          U(e, O_());
        };
      (G(s, (e) => {
        B(r).type === `collectivite` && !(B(r).bonCommande || B(r).numeroEngagement) && e(c);
      }),
        CommandeUnites(R(s, 2), {}),
        j(2),
        A(i),
        A(t),
        z(() =>
          W(
            o,
            B(r).type === `collectivite` && (B(r).bonCommande || B(r).numeroEngagement)
              ? `Vos unités arrivent`
              : `Vos premières unités`,
          ),
        ),
        U(e, t));
    };
  G(x, (e) => {
    B(r).statut === `a_activer` && e(S);
  });
  var C = R(x, 2),
    w = (e) => {
      var t = P_(),
        a = R(F(t), 2),
        o = F(a);
      let s;
      var c = F(o),
        l = F(c),
        u = (e) => {
          Icone(e, {
            n: `ok`,
            taille: 15,
          });
        },
        d = (e) => {
          U(e, zr(`1`));
        };
      (G(l, (e) => {
        B(n).visiteVue ? e(u) : e(d, -1);
      }),
        A(c));
      var f = R(c, 2),
        p = F(f);
      (Icone(R(p), {
        n: `ar`,
      }),
        A(f),
        A(o));
      var g = R(o, 2),
        _ = (e) => {
          var t = A_(),
            n = R(F(t)),
            i = L(R(F(n)), !0);
          (A(n),
            A(t),
            z(() =>
              W(
                i,
                B(r).type === `collectivite`
                  ? B(r).bonCommande || B(r).numeroEngagement
                    ? `Bon de commande reçu, Fill le valide.`
                    : `Faire signer et renvoyer le bon de commande.`
                  : `Régler le premier mois en ligne.`,
              ),
            ),
            U(e, t));
        };
      G(g, (e) => {
        B(r).statut === `a_activer` && e(_);
      });
      var v = R(g, 2),
        y = (e) => {
          var t = j_();
          let n;
          var i = F(t),
            a = F(i),
            o = (e) => {
              Icone(e, {
                n: `ok`,
                taille: 15,
              });
            },
            s = (e) => {
              var t = zr();
              (z(() => W(t, B(r).statut === `a_activer` ? 3 : 2)), U(e, t));
            };
          (G(a, (e) => {
            B(m) > 0 ? e(o) : e(s, -1);
          }),
            A(i));
          var c = R(i),
            l = L(R(F(c)), !0);
          A(c);
          var u = R(c),
            d = F(u);
          (Icone(R(d), {
            n: `ar`,
          }),
            A(u),
            A(t),
            z(
              (e) => {
                ((n = q(t, 1, `svelte-5ho6zo`, null, n, {
                  fait: B(m) > 0,
                })),
                  W(
                    l,
                    B(m) > 0
                      ? `${B(m)} collègue${B(m) > 1 ? `s` : ``} dans l’espace.`
                      : `Ceux qui déposent des demandes ou suivent les livraisons.`,
                  ),
                  J(u, `href`, e),
                  W(d, `${B(m) > 0 ? `Gérer` : `Inviter`} `));
              },
              [() => lienRoute(`equipe`)],
            ),
            U(e, t));
        };
      G(v, (e) => {
        B(n).role === `referent` && e(y);
      });
      var b = R(v, 2),
        x = (e) => {
          var t = M_();
          let n;
          var i = F(t),
            a = F(i),
            o = (e) => {
              Icone(e, {
                n: `ok`,
                taille: 15,
              });
            },
            s = (e) => {
              var t = zr();
              (z(() => W(t, B(r).statut === `a_activer` ? 4 : 3)), U(e, t));
            };
          (G(a, (e) => {
            B(h).complet ? e(o) : e(s, -1);
          }),
            A(i));
          var c = R(i),
            l = L(R(F(c)), !0);
          A(c);
          var u = R(c),
            d = F(u);
          (Icone(R(d), {
            n: `ar`,
          }),
            A(u),
            A(t),
            z(
              (e) => {
                ((n = q(t, 1, `svelte-5ho6zo`, null, n, {
                  fait: B(h).complet,
                })),
                  W(
                    l,
                    B(h).complet
                      ? `Fill peut publier sur vos canaux.`
                      : `Réseaux, site, newsletter : une invitation au nom de Fill, sans mot de passe.`,
                  ),
                  J(u, `href`, e),
                  W(d, `${B(h).complet ? `Voir` : `Donner`} `));
              },
              [() => lienRoute(`comptes`)],
            ),
            U(e, t));
        };
      G(b, (e) => {
        B(n).role === `referent` && e(x);
      });
      var S = R(b, 2),
        C = F(S),
        w = L(C, !0),
        T = R(C, 2),
        ee = (e) => {
          var t = N_();
          (Icone(R(F(t)), {
            n: `ar`,
          }),
            A(t),
            z((e) => J(t, `href`, e), [() => lienRoute(`nouvelle`)]),
            U(e, t));
        };
      (G(T, (e) => {
        B(n).role !== `lecteur` && e(ee);
      }),
        A(S));
      var E = R(S, 2),
        te = F(E),
        D = L(te, !0),
        ne = R(te),
        re = L(R(F(ne)));
      A(ne);
      var ie = R(ne);
      (Icone(R(F(ie)), {
        n: `ar`,
      }),
        A(ie),
        A(E),
        A(a),
        A(t),
        z(
          (e) => {
            ((s = q(o, 1, `svelte-5ho6zo`, null, s, {
              fait: B(n).visiteVue,
            })),
              W(p, `${B(n).visiteVue ? `Revoir` : `Voir`} `),
              W(w, (B(r).statut === `a_activer` ? 3 : 2) + (B(n).role === `referent` ? 2 : 0)),
              W(D, (B(r).statut === `a_activer` ? 4 : 3) + (B(n).role === `referent` ? 2 : 0)),
              W(re, `${B(i).total ?? ``} unités sur la période en cours, le relevé détaille chaque mouvement.`),
              J(ie, `href`, e));
          },
          [() => lienRoute(`unites`)],
        ),
        V(`click`, f, function (...e) {
          ouvrirVisite?.apply(this, e);
        }),
        U(e, t));
    };
  G(C, (e) => {
    B(p) && e(w);
  });
  var T = R(C, 2),
    ee = (e) => {
      var t = F_(),
        n = F(t);
      (Icone(F(n), {
        n: `cle`,
        taille: 22,
      }),
        A(n));
      var r = R(n, 2),
        i = L(F(r), !0);
      (j(),
        A(r),
        Icone(R(r, 2), {
          n: `ar`,
          taille: 20,
        }),
        A(t),
        z(
          (e) => {
            (J(t, `href`, e),
              W(
                i,
                B(g)
                  ? `Un accès à vos comptes est à redonner`
                  : `${B(h).aDonner} ${B(h).aDonner > 1 ? `canaux` : `canal`} sans accès pour Fill`,
              ));
          },
          [() => lienRoute(`comptes`)],
        ),
        U(e, t));
    };
  G(T, (e) => {
    B(n).role === `referent` && !B(p) && (B(h).aDonner > 0 || B(g)) && e(ee);
  });
  var te = (e) => {
      var t = B_(),
        n = F(t),
        r = F(n),
        i = L(R(F(r)), !0);
      (A(r), A(n));
      var a = R(n, 2);
      (K(
        a,
        23,
        () => B(c),
        (e) => e.id,
        (e, t, n) => {
          let r = M(() => f(B(t)));
          var i = z_();
          let a;
          var o = F(i),
            s = F(o),
            c = F(s),
            l = (e) => {
              var t = I_();
              (z(() => J(t, `src`, B(r))), U(e, t));
            },
            u = (e) => {
              var n = R_(),
                r = F(n),
                i = (e) => {
                  var n = L_(),
                    r = L(I(n), !0);
                  (j(), z(() => W(r, B(t).unites)), U(e, n));
                },
                a = (e) => {
                  Icone(e, {
                    n: `trombone`,
                    taille: 30,
                  });
                };
              (G(r, (e) => {
                B(t).statut === `accord_requis` ? e(i) : e(a, -1);
              }),
                A(n),
                U(e, n));
            };
          G(c, (e) => {
            B(r) ? e(l) : e(u, -1);
          });
          var d = R(c, 2),
            p = L(d, !0);
          A(s);
          var m = R(s, 2),
            h = F(m),
            g = L(h, !0),
            _ = R(h, 2),
            v = L(_, !0),
            y = R(_, 2),
            b = F(y),
            x = (e) => {
              var n = zr();
              (z(
                (e, r) => W(n, `Version ${B(t).versions.length ?? ``} · ${e ?? ``} livrable${r ?? ``}`),
                [
                  () => B(t).versions.at(-1)?.fichiers.length,
                  () => ((B(t).versions.at(-1)?.fichiers.length ?? 0) > 1 ? `s` : ``),
                ],
              ),
                U(e, n));
            },
            S = (e) => {
              var n = zr();
              (z(() =>
                W(
                  n,
                  `${B(t).unites ?? ``} unités${B(t).unitesHorsForfait ? `, dont ${B(t).unitesHorsForfait} hors forfait` : ``}`,
                ),
              ),
                U(e, n));
            },
            C = (e) => {
              U(e, zr(`Le délai reprend dès votre réponse`));
            };
          (G(b, (e) => {
            B(t).statut === `a_valider` ? e(x) : B(t).statut === `accord_requis` ? e(S, 1) : e(C, -1);
          }),
            A(y),
            A(m));
          var w = R(m, 2);
          (Icone(F(w), {
            n: `ar`,
            taille: 18,
          }),
            A(w),
            A(o),
            A(i),
            z(
              (e) => {
                ((a = yi(i, ``, a, {
                  "--k": B(n),
                })),
                  J(o, `href`, e),
                  q(
                    d,
                    1,
                    `pastille ${B(t).statut === `attente_client` ? `p-alerte` : `p-cor`} sur-img`,
                    `svelte-5ho6zo`,
                  ),
                  W(
                    p,
                    B(t).statut === `a_valider`
                      ? `À relire et valider`
                      : B(t).statut === `accord_requis`
                        ? `Accord attendu`
                        : `Pièce attendue`,
                  ),
                  W(
                    g,
                    B(t).statut === `a_valider`
                      ? `À relire et valider`
                      : B(t).statut === `accord_requis`
                        ? `Accord attendu`
                        : `Pièce attendue`,
                  ),
                  W(v, B(t).titre));
              },
              [() => lienRoute(`demande-${B(t).id}`)],
            ),
            U(e, i));
        },
      ),
        A(a),
        A(t),
        z(() => W(i, B(c).length)),
        U(e, t));
    };
  var carteCours = (e) => {
    var ne = Cours_(),
      re = F(ne),
      ie = R(F(re), 2);
    (Icone(R(F(ie)), {
      n: `ar`,
    }),
      A(ie),
      A(re));
    var ae = R(re, 2),
      oe = (e) => {
        var t = H_();
        (K(
          t,
          21,
          () => B(l),
          (e) => e.id,
          (e, t) => {
            var n = V_();
            (CarteDemande(F(n), {
              get d() {
                return B(t);
              },
            }),
              A(n),
              U(e, n));
          },
        ),
          A(t),
          U(e, t));
      },
      se = (e) => {
        var t = W_(),
          i = R(F(t), 2),
          a = (e) => {
            var t = U_();
            (Fleche(R(F(t)), {}), A(t), z((e) => J(t, `href`, e), [() => lienRoute(`nouvelle`)]), U(e, t));
          };
        (G(i, (e) => {
          B(n).role !== `lecteur` && B(r).statut === `active` && e(a);
        }),
          A(t),
          U(e, t));
      };
    (G(ae, (e) => {
      B(l).length ? e(oe) : e(se, -1);
    }),
      A(ne));
    (z((e) => J(ie, `href`, e), [() => lienRoute(`demandes`)]), U(e, ne));
  };
  var carteUnites = (e) => {
    var le = Uni_(),
      ue = F(le),
      de = F(ue),
      fe = L(de),
      pe = R(de);
    (Icone(F(pe), {
      n: `ar`,
      taille: 16,
    }),
      A(pe),
      A(ue));
    var me = R(ue, 2),
      he = F(me);
    Bobine(he, {
      get e() {
        return B(i);
      },
      get enAttente() {
        return B(a);
      },
      taille: 132,
    });
    var ge = R(he, 2),
      _e = F(ge),
      ve = L(R(F(_e)), !0);
    A(_e);
    var ye = R(_e, 2),
      be = L(R(F(ye)), !0);
    A(ye);
    var xe = R(ye, 2),
      Se = L(R(F(xe)), !0);
    (A(xe), A(ge), A(me));
    var Ce = R(me, 2),
      O = (e) => {
        var t = G_(),
          n = L(t);
        (z(() => W(n, `${B(a) ?? ``} unité${B(a) > 1 ? `s` : ``} en attente de confirmation par Fill.`)), U(e, t));
      };
    (G(Ce, (e) => {
      B(a) > 0 && e(O);
    }),
      A(le));
    (z(
      (e, t) => {
        (J(le, `href`, e),
          W(fe, `Unités ${t ?? ``}`),
          W(ve, B(i).disponible),
          W(be, B(i).reserve),
          W(Se, B(i).consomme));
      },
      [() => lienRoute(`unites`), () => libellePeriode(B(r), periodeAnniversaire(B(r)))],
    ),
      U(e, le));
  };
  var carteParutions = (e) => {
    var we = Par_(),
      k = R(F(we), 2),
      Te = (e) => {
        var t = q_();
        (K(
          t,
          21,
          () => B(u),
          (e) => e.id,
          (e, t) => {
            var n = K_(),
              r = F(n),
              i = F(r),
              a = L(i, !0),
              o = R(i, 1, !0);
            A(r);
            var s = R(r),
              c = F(s),
              l = L(c, !0),
              u = L(R(c), !0);
            (A(s),
              A(n),
              z(
                (e, n, r, i) => {
                  (W(a, e), W(o, n), J(s, `href`, r), W(l, B(t).titre), W(u, i));
                },
                [
                  () => Number(B(t).parution.slice(8)),
                  () => jourCourt(B(t).parution).split(` `)[1],
                  () => lienRoute(`demande-${B(t).id}`),
                  () => resumeLignes(B(t).lignes),
                ],
              ),
              U(e, n));
          },
        ),
          A(t),
          U(e, t));
      },
      Ee = (e) => {
        U(e, J_());
      };
    (G(k, (e) => {
      B(u).length ? e(Te) : e(Ee, -1);
    }),
      A(we));
    U(e, we);
  };
  var tfBloc = (e) => {
      var t = TfB_(),
        n = R(F(t), 4);
      (K(
        n,
        21,
        () => B(tf),
        (e) => e.cle,
        (e, t) => {
          var n = Tf_(),
            r = F(n),
            i = F(r),
            a = L(i, !0),
            o = R(i, 1, !0);
          A(r);
          var s = R(r),
            c = F(s),
            l = R(F(c)),
            d = L(l, !0),
            u = L(R(l), !0);
          A(c);
          var f = R(c);
          (Icone(F(f), {
            n: `ar`,
            taille: 16,
          }),
            A(f),
            A(s),
            A(n),
            z(
              (e, n, r) => {
                (W(a, e), W(o, n), J(s, `href`, r), W(d, B(t).titre), W(u, B(t).libelle));
              },
              [
                () => Number(B(t).date.slice(8)),
                () => jourCourt(B(t).date).split(` `)[1],
                () => lienRoute(`nouvelle`),
              ],
            ),
            V(`click`, s, (e) => preparerTempsFort(B(t), e)),
            U(e, n));
        },
      ),
        A(n),
        A(t),
        U(e, t));
    };
  var tdbOutils = (e, t) => {
      var n = Outils_(),
        r = F(n),
        i = F(r),
        a = R(i),
        o = L(a, !0);
      (Icone(i, {
        n: `poignee`,
        taille: 18,
      }),
        A(r));
      var s = R(r, 2),
        c = F(s),
        l = R(c),
        u = R(l),
        d = R(u);
      (Icone(F(c), {
        n: `haut`,
        taille: 16,
      }),
        Icone(F(l), {
          n: `bas`,
          taille: 16,
        }));
      var f = (e) => {
          var n = Larg_();
          (z(() => {
            let e = tdbLargeur(t()) === `double`;
            (J(n, `aria-pressed`, `${e}`),
              J(n, `aria-label`, `Carte large : ${TDB_NOMS[t()]}`),
              J(n, `title`, e ? `Revenir à une largeur simple` : `Passer en largeur double`));
          }),
            V(`click`, n, () => {
              let e = t();
              (tdbAnimer(() =>
                tdbEnregistrer({
                  ...B(tdbDisp),
                  largeurs: {
                    ...B(tdbDisp).largeurs,
                    [e]: tdbLargeur(e) === `double` ? `simple` : `double`,
                  },
                }),
              ),
                P(tdbAnnonce, `${TDB_NOMS[e]} : largeur ${tdbLargeur(e) === `double` ? `double` : `simple`}.`));
            }),
            U(e, n));
        },
        p = (e) => {
          var n = Masq_(),
            r = F(n);
          (Icone(r, {
            get n() {
              return B(tdbDisp).masques.includes(t()) ? `oeil` : `oeil-barre`;
            },
            taille: 18,
          }),
            z(() => {
              let e = B(tdbDisp).masques.includes(t());
              (J(n, `aria-label`, `${e ? `Afficher` : `Masquer`} : ${TDB_NOMS[t()]}`),
                J(n, `title`, e ? `Afficher la carte` : `Masquer la carte`));
            }),
            V(`click`, n, () => {
              let e = t(),
                n = B(tdbDisp).masques.includes(e);
              (tdbAnimer(() =>
                tdbEnregistrer({
                  ...B(tdbDisp),
                  masques: n ? B(tdbDisp).masques.filter((t) => t !== e) : [...B(tdbDisp).masques, e],
                }),
              ),
                P(tdbAnnonce, `${TDB_NOMS[e]} : carte ${n ? `affichée` : `masquée`}.`),
                tdbRefocus(e, `.mod-masq`));
            }),
            U(e, n));
        };
      (G(u, (e) => {
        TDB_FIXES.includes(t()) || e(f);
      }),
        G(d, (e) => {
          TDB_FIXES.includes(t()) || e(p);
        }),
        A(s),
        A(n),
        z(() => {
          let e = TDB_NOMS[t()],
            n = B(tdbVisibles),
            i = n.indexOf(t());
          (W(o, e),
            J(r, `aria-label`, `Déplacer : ${e}, position ${i + 1} sur ${n.length}`),
            (c.disabled = i <= 0),
            (l.disabled = i >= n.length - 1),
            J(c, `aria-label`, `Monter : ${e}`),
            J(l, `aria-label`, `Descendre : ${e}`));
        }),
        V(`pointerdown`, r, (e) => {
          (e.stopPropagation(), tdbPrise(e, t(), r));
        }),
        V(`keydown`, r, (e) => tdbClavier(e, t())),
        V(`click`, c, () => {
          let e = t();
          (tdbDeplacer(e, B(tdbVisibles).indexOf(e) - 1), tdbRefocus(e, `.mod-monter`));
        }),
        V(`click`, l, () => {
          let e = t();
          (tdbDeplacer(e, B(tdbVisibles).indexOf(e) + 1), tdbRefocus(e, `.mod-descendre`));
        }),
        U(e, n));
    },
    tdbModule = (e, t) => {
      let n = B(t),
        r = () => n;
      var i = Mod_(),
        a = F(i),
        o = R(a, 2),
        s = F(o);
      let c;
      (J(i, `data-id`, n),
        G(a, (e) => {
          B(tdbEdition) && e((e) => tdbOutils(e, r));
        }),
        G(s, (e) => {
          B(tdbEdition) && B(tdbDisp).masques.includes(n)
            ? e((e) => U(e, Masque_()), 9)
            : n === `afaire`
              ? e(te, 1)
              : n === `cours`
                ? e(carteCours, 2)
                : n === `unites`
                  ? e(carteUnites, 3)
                  : n === `parutions`
                    ? e(carteParutions, 4)
                    : e(tfBloc, 5);
        }),
        A(o),
        A(i),
        V(`pointerdown`, i, (e) => {
          e.pointerType === `mouse` && !e.target.closest(`button`) && tdbPrise(e, n, i);
        }),
        z(() => {
          let e = tdbLargeur(n);
          ((c = q(i, 1, `mod svelte-5ho6zo`, null, c, {
            double: e === `double`,
            pleine: e === `pleine`,
            masque: B(tdbDisp).masques.includes(n),
            glisse: B(tdbGlisse) === n,
          })),
            (o.inert = B(tdbEdition)));
        }),
        U(e, i));
    };
  var tdbZone = R(T, 2),
    tdbG = F(tdbZone),
    tdbBarre = R(tdbG, 2),
    tdbBarreA = F(tdbBarre),
    tdbLive = R(tdbBarre, 2),
    tdbLiveT = L(tdbLive, !0);
  let tdbCls;
  ((tdbGrille = tdbG),
    G(tdbBarreA, (e) => {
      B(tdbEdition)
        ? e((e) => {
            var t = Edit_(),
              n = F(t),
              r = R(n, 2),
              i = F(r),
              a = R(i, 2);
            (Icone(F(a), {
              n: `ok`,
              taille: 18,
            }),
              A(r),
              V(`click`, i, tdbRetablir),
              V(`click`, a, tdbFermer),
              U(e, t));
          }, 1)
        : B(tdbVisibles).length || e((e) => U(e, ToutMasque_()));
    }),
    K(tdbG, 23, () => B(tdbVisibles), (e) => e, tdbModule),
    A(tdbZone),
    A(b),
    A(y),
    z(() => {
      ((tdbCls = q(tdbG, 1, `tdb svelte-5ho6zo`, null, tdbCls, {
        edition: B(tdbEdition),
      })),
        W(tdbLiveT, B(tdbAnnonce)));
    }),
    U(e, _),
    Je());
}
kr([`click`, `pointerdown`, `keydown`]);
