// Module donnees/demo.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Eo = new URL(`mk-nl-c-BNomLpx9.webp`, import.meta.url).href;
var Do = new URL(`mk-actu-c2-l-4opLYUMR.webp`, import.meta.url).href;
var Oo = new URL(`ev-forum-BTXOXytj.webp`, import.meta.url).href;
var ko = new URL(`ev-asso-CUvDwT0l.webp`, import.meta.url).href;
var Ao = new URL(`ev-bagad-CyxpnNjX.webp`, import.meta.url).href;
var jo = new URL(`ev-benevoles-DB6CM9fR.webp`, import.meta.url).href;
var Mo = new URL(`im-recrut-CyUMPu3v.webp`, import.meta.url).href;
var No = new URL(`co-recrut-9q-9K0Tt.webp`, import.meta.url).href;
var Po = new URL(`mk-post-e-Bfg-Oz2C.webp`, import.meta.url).href;
var Fo = new URL(`mk-story-e-CUpjPeh4.webp`, import.meta.url).href;
var Io = new URL(`mk-bul-c-DTfCunwF.webp`, import.meta.url).href;
var Lo = new URL(`co-voeux-DJ0Rvjgz.webp`, import.meta.url).href;
var Ro = new URL(`co-budget-Kj0U9lBF.webp`, import.meta.url).href;
var zo = new URL(`im-affiche-BofW9FKu.webp`, import.meta.url).href;
var Bo = new URL(`co-ete-DFKiarp7.webp`, import.meta.url).href;
var donneesDemo = () => {
    let e = aujourdhui(),
      t = (t) => ajouterJours(e, t),
      n = (t) => (t >= 0 ? ajouterOuvres(e, t) : ajouterJours(e, t)),
      r = (e, t = 9, n = 0) => `${e}T${String(t).padStart(2, `0`)}:${String(n).padStart(2, `0`)}:00+01:00`,
      i = periodeDe(e),
      a = `${i}-01`,
      o = periodeDe(ajouterJours(a, -1)),
      s = `${o}-01`,
      c = [
        {
          id: `kerlan`,
          nom: `Commune de Saint-Ivenec`,
          type: `collectivite`,
          formule: `regulier`,
          debut: s,
          engagementMois: 12,
          statut: `active`,
          siret: `212 900 000 00012`,
          codeService: `COM`,
          periodePreelectorale: null,
          acces: [
            {
              canal: `facebook`,
              statut: `verifie`,
            },
            {
              canal: `instagram`,
              statut: `verifie`,
            },
            {
              canal: `site`,
              statut: `donne`,
              note: `Compte éditeur créé sur le site`,
            },
            {
              canal: `linkedin`,
              statut: `sans_objet`,
            },
          ],
        },
        {
          id: `lanvenec`,
          nom: `Commune de Trévalan`,
          type: `collectivite`,
          formule: `soutenu`,
          debut: s,
          engagementMois: 6,
          statut: `active`,
          siret: `212 900 001 00010`,
        },
        {
          id: `maisonble`,
          nom: `Maison Blé`,
          type: `entreprise`,
          formule: `essentiel`,
          debut: a,
          engagementMois: 6,
          statut: `active`,
          siret: `901 000 000 00018`,
        },
        {
          id: `pontguennec`,
          nom: `Commune de Pont-Guennec`,
          type: `collectivite`,
          formule: `essentiel`,
          debut: a,
          engagementMois: 12,
          statut: `active`,
          siret: `212 900 003 00016`,
        },
        {
          id: `plouzevet`,
          nom: `Commune de Plouzévet`,
          type: `collectivite`,
          formule: `essentiel`,
          debut: periodeDe(ajouterJours(a, 40)) + `-01`,
          engagementMois: 12,
          statut: `a_activer`,
          siret: `212 900 002 00018`,
        },
      ],
      l = [
        {
          id: `ewen`,
          nom: `Ewen Soupault`,
          email: `contact@studioes.fr`,
          role: `admin`,
          organisationId: null,
        },
        {
          id: `marion`,
          nom: `Marion Le Bihan`,
          email: `m.lebihan@saint-ivenec.test`,
          fonction: `Directrice générale des services`,
          role: `referent`,
          organisationId: `kerlan`,
        },
        {
          id: `yannick`,
          nom: `Yannick Coat`,
          email: `y.coat@saint-ivenec.test`,
          fonction: `Service culture`,
          role: `contributeur`,
          organisationId: `kerlan`,
          plafondMensuel: 4,
        },
        {
          id: `gaelle`,
          nom: `Gaëlle Riou`,
          email: `g.riou@saint-ivenec.test`,
          fonction: `Maire adjointe`,
          role: `lecteur`,
          organisationId: `kerlan`,
        },
        {
          id: `herve`,
          nom: `Hervé Kervella`,
          email: `dgs@lanvenec.test`,
          fonction: `Directeur général des services`,
          role: `referent`,
          organisationId: `lanvenec`,
        },
        {
          id: `lea`,
          nom: `Léa Cadoret`,
          email: `lea@maisonble.test`,
          fonction: `Gérante`,
          role: `referent`,
          organisationId: `maisonble`,
        },
        {
          id: `nolwenn`,
          nom: `Nolwenn Tanguy`,
          email: `mairie@plouzevet.test`,
          fonction: `Secrétaire de mairie`,
          role: `referent`,
          organisationId: `plouzevet`,
        },
        {
          id: `visiteur`,
          nom: `Camille Morvan`,
          email: `demo@fill.studioes.fr`,
          fonction: `Chargée de communication (démonstration)`,
          role: `referent`,
          organisationId: `kerlan`,
          visiteVue: !1,
        },
        {
          id: `anne`,
          nom: `Anne Le Goff`,
          email: `communication@pontguennec.test`,
          fonction: `Chargée de l’accueil et de la communication`,
          role: `referent`,
          organisationId: `pontguennec`,
          visiteVue: !1,
        },
      ];
    for (let e of l) e.visiteVue === void 0 && (e.visiteVue = !0);
    let u = 40,
      d = [],
      f = [],
      p = 0,
      m = (e) =>
        f.push({
          id: `r${++p}`,
          ...e,
        }),
      h = (...e) =>
        e.map(([e, t]) => ({
          prestation: e,
          quantite: t,
        })),
      g = (e) => {
        let { parcours: t = [], ...n } = e,
          r = {
            id: `d${++u}`,
            numero: u,
            urgente: !1,
            parution: null,
            brief: ``,
            pieces: [],
            statut: `deposee`,
            unites: null,
            unitesHorsForfait: 0,
            livraison: null,
            corrections: 0,
            messages: [],
            versions: [],
            historique: [],
            ...n,
          };
        r.historique.push({
          date: r.creee,
          statut: `deposee`,
          par: r.auteurId,
        });
        for (let [e, n, i] of t)
          r.historique.push({
            date: n,
            statut: e,
            par: i,
          });
        return (t.length && (r.statut = t.at(-1)[0]), d.push(r), r);
      },
      _ = (e, t, n = i) =>
        m({
          organisationId: e.organisationId,
          periode: n,
          type: `debit`,
          unites: e.unites - e.unitesHorsForfait,
          demandeId: e.id,
          etat: t,
          date: e.historique.find((e) => e.statut === `confirmee`)?.date ?? e.creee,
        }),
      v = (e, t, n, r) =>
        e.versions.push({
          id: `v${e.id}-${e.versions.length + 1}`,
          numero: e.versions.length + 1,
          date: t,
          fichiers: n,
          note: r,
        }),
      y = (e, t, n, r, i = !1) =>
        e.messages.push({
          id: `m${e.id}-${e.messages.length + 1}`,
          auteurId: t,
          date: n,
          texte: r,
          systeme: i,
        });
    (m({
      organisationId: `kerlan`,
      periode: o,
      type: `credit`,
      unites: 22,
      motif: `Quota mensuel`,
      date: r(s, 1),
    }),
      m({
        organisationId: `kerlan`,
        periode: o,
        type: `debit`,
        unites: 6,
        demandeId: `historique`,
        etat: `consomme`,
        date: r(ajouterJours(s, 12)),
      }),
      m({
        organisationId: `kerlan`,
        periode: i,
        type: `report`,
        unites: 2,
        motif: `Report de ${libelleMois(o)}`,
        date: r(a, 1),
      }),
      m({
        organisationId: `kerlan`,
        periode: i,
        type: `credit`,
        unites: 22,
        motif: `Quota mensuel`,
        date: r(a, 1),
      }));
    let b = g({
      organisationId: `kerlan`,
      auteurId: `yannick`,
      titre: `Programme des vacances de la Toussaint`,
      lignes: h([`affiche`, 1]),
      creee: r(t(-26), 10, 12),
      unites: 4,
      livraison: t(-19),
      parution: t(-15),
      brief: `Affiche A3 et déclinaison réseaux pour le programme de l’accueil de loisirs. Le programme détaillé est joint.`,
      pieces: [`programme-toussaint.docx`, `photos-ateliers.zip`],
      parcours: [
        [`confirmee`, r(t(-25), 9), `ewen`],
        [`production`, r(t(-24), 9), `ewen`],
        [`a_valider`, r(t(-21), 16), `ewen`],
        [`validee`, r(t(-20), 11), `marion`],
        [`livree`, r(t(-19), 9), `ewen`],
      ],
    });
    (v(b, r(t(-21), 16), [
      {
        nom: `affiche-toussaint-A3.pdf`,
        type: `affiche`,
        src: zo,
        legende: `A3 · 297 × 420 mm`,
      },
    ]),
      _(b, `consomme`));
    let x = g({
      organisationId: `kerlan`,
      auteurId: `marion`,
      titre: `Reportage : forum des associations`,
      lignes: h([`photo`, 1]),
      creee: r(ajouterJours(s, 3), 11),
      unites: 10,
      livraison: n(0),
      parution: t(-8),
      brief: `Samedi de 10 h à 17 h, salle omnisports. Ambiance, stands, démonstrations du club de tir à l’arc et du bagad. Photos pour le site, le bulletin et la presse.`,
      parcours: [
        [`confirmee`, r(ajouterJours(s, 4), 9), `ewen`],
        [`production`, r(t(-8), 10), `ewen`],
        [`a_valider`, r(t(-1), 18, 20), `ewen`],
      ],
    });
    (v(
      x,
      r(t(-1), 18, 20),
      [
        {
          nom: `forum-associations-2026`,
          type: `photos`,
          srcs: [Oo, ko, Ao, jo],
          legende: `30 photos retouchées · 4 en aperçu`,
        },
      ],
      `Sélection de 30 photos, retouchées. Les quatre premières sont celles que je conseille pour la une du bulletin.`,
    ),
      m({
        organisationId: `kerlan`,
        periode: o,
        type: `debit`,
        unites: 10,
        demandeId: x.id,
        etat: `consomme`,
        date: r(ajouterJours(s, 4), 9),
      }));
    let S = g({
      organisationId: `kerlan`,
      auteurId: `marion`,
      titre: `Newsletter de novembre`,
      lignes: h([`news`, 1]),
      creee: r(t(-4), 9, 15),
      unites: 3,
      livraison: n(0),
      parution: n(3),
      brief: `Sujets : forum des associations (photos), budget participatif, marché de Noël, nouvel horaire de la médiathèque.`,
      parcours: [
        [`confirmee`, r(t(-4), 15), `ewen`],
        [`production`, r(t(-3), 9), `ewen`],
        [`a_valider`, r(t(-1), 17, 5), `ewen`],
      ],
    });
    (v(
      S,
      r(t(-1), 17, 5),
      [
        {
          nom: `saint-ivenec-la-lettre-novembre`,
          type: `email`,
          src: Eo,
          legende: `Saint-Ivenec, la lettre · Forum des associations : 42 clubs réunis`,
          contenu: {
            titre: `Saint-Ivenec, la lettre · novembre`,
            chapo: `Les nouvelles de la commune, une fois par mois. Ce mois-ci : le forum des associations, le budget participatif, le marché de Noël et les nouveaux horaires de la médiathèque.`,
            sections: [
              {
                titre: `Forum des associations : 42 clubs réunis`,
                image: Oo,
                texte: `Samedi 4 octobre, plus de 600 visiteurs ont fait le tour des stands de la salle omnisports. Démonstrations du club de tir à l’arc, initiation au bagad, inscriptions de dernière minute : merci aux bénévoles qui ont rendu cette journée possible. Les contacts de toutes les associations restent en ligne sur saint-ivenec.fr.`,
              },
              {
                titre: `Budget participatif : déposez vos projets`,
                texte: `Un banc près de l’école, un composteur partagé, un abri pour les vélos : 30 000 € sont réservés aux idées des habitants. Chaque Ivenécois de plus de 11 ans peut déposer un projet sur saint-ivenec.fr ou à l’accueil de la mairie, jusqu’au 20 novembre à midi. Les projets retenus seront soumis au vote en janvier.`,
              },
              {
                titre: `Marché de Noël : l’équipe recrute`,
                texte: `Le marché de Noël revient place de l’église les 13 et 14 décembre. Il manque une dizaine de bénévoles pour le vin chaud, la buvette et l’accueil des exposants. Inscriptions en mairie jusqu’au 6 décembre.`,
              },
              {
                titre: `Médiathèque : nouveaux horaires`,
                texte: `À partir du 3 novembre, la médiathèque ouvre le mercredi de 10 h à 18 h sans interruption et le samedi de 10 h à 16 h. Le mardi et le vendredi, accueil de 16 h à 19 h.`,
              },
            ],
            appel: `Toutes les actualités sur saint-ivenec.fr`,
          },
        },
      ],
      `Envoi prévu mardi à 11 h à vos 1 240 abonnés. Le lien du budget participatif renvoie vers la page du site.`,
    ),
      y(S, `ewen`, r(t(-3), 9, 2), `Pour le budget participatif, avez-vous la date limite de dépôt des projets ?`),
      y(S, `marion`, r(t(-3), 11, 30), `Le 20 novembre, à midi.`),
      _(S, `consomme`));
    let C = g({
      organisationId: `kerlan`,
      auteurId: `yannick`,
      titre: `Marché de Noël : appel aux bénévoles`,
      lignes: h([`actu`, 1], [`post`, 2]),
      creee: r(t(-3), 16, 20),
      unites: 3,
      livraison: n(0),
      parution: n(2),
      brief: `Article pour le site et deux publications : le marché cherche des bénévoles pour le vin chaud et la buvette. Inscriptions en mairie jusqu’au 6 décembre.`,
      pieces: [`formulaire-benevoles.pdf`],
      parcours: [
        [`confirmee`, r(t(-2), 8, 40), `ewen`],
        [`production`, r(t(-2), 14), `ewen`],
        [`a_valider`, r(t(-1), 12), `ewen`],
      ],
    });
    (v(
      C,
      r(t(-1), 12),
      [
        {
          nom: `actualite-benevoles-marche-de-noel`,
          type: `web`,
          src: Do,
          legende: `saint-ivenec.fr/actualites/benevoles-marche-de-noel`,
          contenu: {
            titre: `Le marché de Noël cherche ses bénévoles`,
            chapo: `Les 13 et 14 décembre, le marché de Noël s’installe place de l’église. Pour tenir le vin chaud, la buvette et l’accueil des exposants, la commune cherche une dizaine de bénévoles.`,
            corps: [
              `Trente-cinq exposants sont attendus cette année : artisans, producteurs locaux et associations de la commune. Comme chaque année, une partie des bénéfices de la buvette sera reversée au comité des fêtes pour les animations de l’été.`,
              `Les bénévoles se relaient par créneaux de deux heures, le samedi de 14 h à 20 h et le dimanche de 10 h à 18 h. Aucune expérience n’est demandée : un temps de présentation est prévu le vendredi 12 décembre à 18 h 30, salle du conseil.`,
              `Les mineurs de plus de 16 ans peuvent participer avec l’accord d’un parent. Un vin chaud et un repas sont offerts à chaque bénévole.`,
              `Pour vous inscrire, remplissez le formulaire disponible à l’accueil de la mairie ou téléchargez-le ci-dessous, avant le 6 décembre.`,
            ],
            appel: `Télécharger le formulaire d’inscription (PDF, 120 Ko)`,
          },
        },
        {
          nom: `publication-1-appel.jpg`,
          type: `post`,
          src: jo,
          legende: `Le marché de Noël cherche ses bénévoles 🎄

Les 13 et 14 décembre, place de l’église, il nous manque une dizaine de personnes pour tenir le vin chaud, la buvette et l’accueil des exposants. Créneaux de deux heures, aucune expérience demandée, vin chaud et repas offerts.

Inscriptions en mairie jusqu’au 6 décembre, ou avec le formulaire en ligne sur saint-ivenec.fr (lien en bio).

#SaintIvenec #MarchéDeNoël #Bénévolat`,
        },
        {
          nom: `publication-2-rappel.jpg`,
          type: `post`,
          src: Oo,
          legende: `Dernière semaine pour rejoindre l’équipe du marché de Noël.

Vous avez deux heures à donner le 13 ou le 14 décembre ? Inscription en mairie jusqu’à samedi midi. Merci à celles et ceux qui ont déjà répondu : vous êtes 14 !

#SaintIvenec #MarchéDeNoël`,
        },
      ],
      `L’article sera mis en ligne dès votre validation, les publications partiront mardi et vendredi à 18 h.`,
    ),
      _(C, `consomme`));
    let w = g({
      organisationId: `kerlan`,
      auteurId: `marion`,
      titre: `Campagne de recrutement : animateurs jeunesse`,
      lignes: h([`affiche`, 1], [`gabarit`, 2]),
      creee: r(t(-7), 10),
      unites: 6,
      livraison: n(0),
      parution: n(4),
      brief: `Deux postes d’animateur à l’Espace Jeunes. Affiche pour les abribus et deux visuels pour les réseaux. Candidatures jusqu’au 30 novembre.`,
      parcours: [
        [`confirmee`, r(t(-7), 15), `ewen`],
        [`production`, r(t(-6), 9), `ewen`],
        [`a_valider`, r(t(-4), 16), `ewen`],
        [`correction`, r(t(-3), 10), `marion`],
        [`a_valider`, r(t(-1), 10, 30), `ewen`],
      ],
      corrections: 1,
    });
    (v(w, r(t(-4), 16), [
      {
        nom: `recrutement-abribus-v1.pdf`,
        type: `affiche`,
        src: No,
        legende: `Abribus · 120 × 176 cm`,
      },
    ]),
      y(w, `marion`, r(t(-3), 10), `Pouvez-vous ajouter la date limite de candidature en plus gros ? Le reste me va.`),
      v(
        w,
        r(t(-1), 10, 30),
        [
          {
            nom: `recrutement-abribus-v2.pdf`,
            type: `affiche`,
            src: Mo,
            legende: `Abribus · 120 × 176 cm`,
            contenu: {
              titre: `La Ville de Saint-Ivenec recrute deux animateurs jeunesse`,
              chapo: `Candidatures jusqu’au 30 novembre`,
              corps: [`Espace Jeunes, 11 à 17 ans`, `CDD d’un an, 35 h, BAFA demandé`, `Prise de poste le 5 janvier`],
              appel: `Lettre et CV à recrutement@saint-ivenec.fr`,
            },
          },
          {
            nom: `recrutement-reseaux-carre.jpg`,
            type: `visuel`,
            src: No,
            legende: `Réseaux sociaux · 1080 × 1350`,
          },
        ],
        `Date limite agrandie et passée en haut de l’affiche. La déclinaison réseaux reprend la même hiérarchie.`,
      ),
      _(w, `consomme`));
    let T = g({
      organisationId: `kerlan`,
      auteurId: `yannick`,
      titre: `Vidéo : concert du bagad à la Sainte-Barbe`,
      lignes: h([`video`, 1]),
      creee: r(ajouterJours(s, 20), 14),
      unites: 4,
      livraison: n(0),
      brief: `Montage court pour les réseaux à partir des images du concert. Sous-titres en français.`,
      parcours: [
        [`confirmee`, r(ajouterJours(s, 21), 9), `ewen`],
        [`production`, r(t(-5), 9), `ewen`],
        [`a_valider`, r(t(-2), 15), `ewen`],
      ],
    });
    (v(
      T,
      r(t(-2), 15),
      [
        {
          nom: `bagad-sainte-barbe.mp4`,
          type: `video`,
          src: Ao,
          legende: `0:48 · 1080 × 1920 · sous-titrée`,
          contenu: {
            titre: `Sous-titres`,
            corps: [
              `0:00 · Sainte-Barbe, salle des fêtes de Saint-Ivenec`,
              `0:06 · Le bagad de Saint-Ivenec, 32 musiciens sur scène`,
              `0:15 · « On répète depuis septembre pour ce soir »`,
              `0:27 · Prochain concert : le 21 décembre à l’église`,
              `0:41 · Retrouvez le programme sur saint-ivenec.fr`,
            ],
          },
        },
      ],
      `Format vertical pour Instagram et Facebook, sous-titres incrustés.`,
    ),
      m({
        organisationId: `kerlan`,
        periode: o,
        type: `debit`,
        unites: 4,
        demandeId: T.id,
        etat: `consomme`,
        date: r(ajouterJours(s, 21), 9),
      }),
      _(
        g({
          organisationId: `kerlan`,
          auteurId: `marion`,
          titre: `Commémoration du 11 Novembre`,
          lignes: h([`post`, 2]),
          creee: r(t(-2), 14, 40),
          unites: 2,
          livraison: n(2),
          parution: t(12),
          brief: `Deux publications : l’annonce de la cérémonie (horaires, lieu, dépôt de gerbes) et un rappel la veille. Ton sobre.`,
          pieces: [`deroule-ceremonie.pdf`],
          parcours: [
            [`confirmee`, r(t(-1), 8, 50), `ewen`],
            [`production`, r(e, 9), `ewen`],
          ],
        }),
        `reserve`,
      ));
    let ee = g({
      organisationId: `kerlan`,
      auteurId: `marion`,
      titre: `Repas des aînés`,
      lignes: h([`affiche`, 1], [`post`, 1]),
      creee: r(t(-1), 11),
      unites: 5,
      livraison: n(5),
      parution: t(16),
      brief: `Samedi 6 décembre à 12 h, salle polyvalente. Inscriptions en mairie avant le 25 novembre. Affiche pour les commerces et une publication.`,
      parcours: [[`confirmee`, r(e, 8, 30), `pilote`]],
    });
    ((ee.historique.at(-1).detail = `Par le pilote automatique`),
      (ee.brouillon = {
        date: r(e, 8, 31),
        fichiers: premierJet(ee, c[0]),
        essais: 1,
      }),
      _(ee, `reserve`));
    let E = [
      {
        id: `c1`,
        organisationId: `kerlan`,
        auteurId: `marion`,
        unites: 20,
        prixUnitaire: 55,
        total: 1100,
        statut: `a_facturer`,
        date: r(ajouterJours(a, 13), 10),
      },
    ];
    (m({
      organisationId: `kerlan`,
      periode: i,
      type: `ajustement`,
      unites: 20,
      motif: `Commande de 20 unités`,
      source: `commande`,
      commandeId: `c1`,
      date: r(ajouterJours(a, 13), 10),
    }),
      y(
        g({
          organisationId: `kerlan`,
          auteurId: `yannick`,
          titre: `Reportage : inauguration de la médiathèque`,
          lignes: h([`photo`, 1]),
          creee: r(t(-1), 10, 5),
          unites: 10,
          unitesHorsForfait: 4,
          parution: t(16),
          brief: `Inauguration le samedi en fin de matinée, en présence du sous-préfet. Photos pour le site, le bulletin et la presse.`,
          parcours: [[`accord_requis`, r(e, 8, 45), `ewen`]],
        }),
        `ewen`,
        r(e, 8, 45),
        `Demande déposée par un contributeur au-delà de son plafond, dont 4 unités hors forfait : l’accord du référent est nécessaire.`,
        !0,
      ),
      g({
        organisationId: `kerlan`,
        auteurId: `marion`,
        titre: `Fermeture de la piscine pour vidange`,
        lignes: h([`actu`, 1], [`post`, 1]),
        urgente: !0,
        creee: r(e, 7, 55),
        unites: 3,
        parution: e,
        brief: `Fermeture technique du lundi au dimanche suivant pour la vidange annuelle. Réouverture aux horaires habituels.`,
      }),
      m({
        organisationId: `lanvenec`,
        periode: o,
        type: `credit`,
        unites: 45,
        motif: `Quota mensuel`,
        date: r(s, 1),
      }),
      m({
        organisationId: `lanvenec`,
        periode: o,
        type: `debit`,
        unites: 41,
        demandeId: `historique`,
        etat: `consomme`,
        date: r(ajouterJours(s, 25)),
      }),
      m({
        organisationId: `lanvenec`,
        periode: i,
        type: `report`,
        unites: 4,
        motif: `Report de ${libelleMois(o)}`,
        date: r(a, 1),
      }),
      m({
        organisationId: `lanvenec`,
        periode: i,
        type: `credit`,
        unites: 45,
        motif: `Quota mensuel`,
        date: r(a, 1),
      }),
      m({
        organisationId: `lanvenec`,
        periode: i,
        type: `ajustement`,
        unites: 2,
        motif: `Offertes : retard de livraison du bulletin d’automne`,
        source: `offert`,
        date: r(ajouterJours(a, 6), 14),
      }),
      m({
        organisationId: `lanvenec`,
        periode: i,
        type: `debit`,
        unites: 18,
        demandeId: `historique`,
        etat: `consomme`,
        date: r(ajouterJours(a, 9)),
      }));
    let te = g({
      organisationId: `lanvenec`,
      auteurId: `herve`,
      titre: `Bulletin d’hiver, 8 pages`,
      lignes: h([`bulletin`, 8]),
      creee: r(t(-14), 9),
      unites: 16,
      livraison: n(0),
      parution: t(21),
      brief: `Rétroplanning validé en réunion. Textes des services reçus.`,
      parcours: [
        [`confirmee`, r(t(-14), 14), `ewen`],
        [`production`, r(t(-12), 9), `ewen`],
        [`a_valider`, r(t(-1), 19), `ewen`],
      ],
    });
    (v(
      te,
      r(t(-1), 19),
      [
        {
          nom: `bulletin-hiver-BAT.pdf`,
          type: `pdf`,
          src: Io,
          legende: `8 pages · A4 · bon à tirer`,
          pages: [Io, Ro, Bo, Lo],
          contenu: {
            titre: `Trévalan, le bulletin · hiver`,
            sections: [
              {
                titre: `Éditorial`,
                texte: `Cet hiver marque le lancement du budget participatif et la fin des travaux de la salle des sports. Merci à toutes celles et ceux qui ont contribué aux réunions de quartier de l’automne : vos remarques ont nourri les projets présentés dans ce numéro.`,
              },
              {
                titre: `Budget participatif`,
                texte: `Jusqu’au 15 janvier, chaque habitant peut proposer un projet pour la commune. Le dossier est disponible en mairie et sur lanvenec.fr. Une réunion d’information se tient le 9 décembre à 18 h 30.`,
              },
              {
                titre: `Travaux`,
                texte: `La salle des sports rouvre le 5 janvier. La rue du Stade reste fermée à la circulation jusqu’au 19 décembre pour la reprise des réseaux.`,
              },
              {
                titre: `Agenda`,
                texte: `6 décembre : repas des aînés · 13 décembre : marché de Noël · 10 janvier : vœux du maire, 18 h, salle polyvalente · 24 janvier : fest-noz de l’école de musique.`,
              },
            ],
          },
        },
      ],
      `Bon à tirer complet. Merci de relire en priorité l’agenda (page 7).`,
    ),
      _(te, `consomme`),
      _(
        g({
          organisationId: `lanvenec`,
          auteurId: `herve`,
          titre: `Budget participatif : appel à projets`,
          lignes: h([`affiche`, 1], [`actu`, 1]),
          creee: r(t(-9), 10),
          unites: 5,
          livraison: t(-1),
          parution: t(3),
          brief: `Affiche et article pour lancer l’appel à projets.`,
          parcours: [
            [`confirmee`, r(t(-8), 9), `ewen`],
            [`production`, r(t(-6), 9), `ewen`],
          ],
        }),
        `reserve`,
      ),
      _(
        g({
          organisationId: `lanvenec`,
          auteurId: `herve`,
          titre: `Publications de la semaine`,
          lignes: h([`post`, 4]),
          creee: r(t(-6), 9),
          unites: 4,
          livraison: t(-5),
          parcours: [
            [`confirmee`, r(t(-6), 11), `ewen`],
            [`a_valider`, r(t(-5), 11), `ewen`],
            [`validee`, r(t(-5), 15), `herve`],
            [`livree`, r(t(-5), 17), `ewen`],
          ],
        }),
        `consomme`,
      ),
      g({
        organisationId: `lanvenec`,
        auteurId: `herve`,
        titre: `Carte de vœux du maire`,
        lignes: h([`affiche`, 1], [`post`, 1]),
        creee: r(e, 8, 10),
        unites: 5,
        parution: t(40),
        brief: `Comme l’an dernier.`,
      }),
      m({
        organisationId: `pontguennec`,
        periode: i,
        type: `credit`,
        unites: 10,
        motif: `Premier quota`,
        date: r(t(-2), 17),
      }),
      m({
        organisationId: `maisonble`,
        periode: i,
        type: `credit`,
        unites: 10,
        motif: `Premier quota`,
        date: r(a, 1),
      }),
      m({
        organisationId: `maisonble`,
        periode: i,
        type: `debit`,
        unites: 3,
        demandeId: `historique`,
        etat: `consomme`,
        date: r(ajouterJours(a, 8)),
      }));
    let D = g({
      organisationId: `maisonble`,
      auteurId: `lea`,
      titre: `Nouvelle carte de saison`,
      lignes: h([`post`, 1], [`gabarit`, 1]),
      creee: r(t(-3), 11),
      unites: 2,
      livraison: n(0),
      parution: n(1),
      brief: `Publication Instagram et story pour la carte d’hiver : pain au levain, kouign-amann, bûches à commander.`,
      parcours: [
        [`confirmee`, r(t(-3), 15), `ewen`],
        [`a_valider`, r(t(-1), 15), `ewen`],
      ],
    });
    return (
      v(D, r(t(-1), 15), [
        {
          nom: `publication-carte-hiver.jpg`,
          type: `post`,
          src: Po,
          legende: `La carte d’hiver arrive ce week-end.

Au levain : la miche de seigle et la tourte aux noix. En vitrine : le kouign-amann du samedi, les sablés au sarrasin et, à partir du 10 décembre, les bûches à commander.

Commandes en boutique ou par téléphone au 02 98 00 00 00, jusqu’au 20 décembre.

#MaisonBlé #Boulangerie #Levain`,
        },
        {
          nom: `story-carte-hiver.jpg`,
          type: `story`,
          src: Fo,
          legende: `Story · 1080 × 1920`,
          contenu: {
            corps: [`La carte d’hiver arrive`, `Levain, kouign-amann, bûches`, `Commandez avant le 20 décembre`],
          },
        },
      ]),
      _(D, `consomme`),
      _(
        g({
          organisationId: `maisonble`,
          auteurId: `lea`,
          titre: `Annonce de recrutement : vendeur ou vendeuse`,
          lignes: h([`gabarit`, 1]),
          creee: r(t(-2), 11),
          unites: 1,
          livraison: n(1),
          brief: `CDI à temps plein, poste en boutique. Visuel pour LinkedIn et Instagram.`,
          parcours: [[`confirmee`, r(t(-2), 15), `ewen`]],
        }),
        `reserve`,
      ),
      g({
        organisationId: `maisonble`,
        auteurId: `lea`,
        titre: `Newsletter clients de décembre`,
        lignes: h([`news`, 1]),
        creee: r(ajouterOuvres(ajouterJours(e, -5), 1), 16),
        unites: 3,
        parution: t(9),
        brief: `Les commandes de Noël, les horaires des fêtes et la galette des rois en janvier.`,
      }),
      {
        organisations: c,
        utilisateurs: l,
        demandes: d,
        registre: f,
        commandes: E,
        prochainNumero: u + 1,
        fermetures: [
          {
            debut: `${i.slice(0, 4)}-12-28`,
            fin: `${i.slice(0, 4)}-12-31`,
            motif: `Fermeture de fin d’année`,
          },
        ],
        capacite: 30,
        pilote: {
          ...PILOTE_DEFAUT,
        },
        journal: [
          {
            id: `j1`,
            date: r(e, 8, 30),
            texte: `« Repas des aînés » confirmée, livraison dans le délai de la formule`,
            demandeId: ee.id,
            organisationId: `kerlan`,
            auto: !0,
          },
          {
            id: `j2`,
            date: r(e, 8, 31),
            texte: `Premier jet préparé : « Repas des aînés »`,
            demandeId: ee.id,
            organisationId: `kerlan`,
            auto: !0,
          },
          {
            id: `j3`,
            date: r(t(-1), 9),
            texte: `Relance envoyée : « Publications de la semaine »`,
            organisationId: `lanvenec`,
            auto: !0,
          },
          {
            id: `j4`,
            date: r(t(-2), 17),
            texte: `Commune de Pont-Guennec : 10 premières unités créditées (bon de commande validé)`,
            organisationId: `pontguennec`,
            auto: !1,
          },
        ],
        factures: [],
      }
    );
  };
