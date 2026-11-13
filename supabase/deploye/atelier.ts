// supabase/functions/_partage/cles.ts
var lire = (nom) => {
  const v = Deno.env.get(nom);
  if (!v) return void 0;
  if (!v.trim().startsWith("{")) return v;
  try {
    const o2 = JSON.parse(v);
    return o2.default ?? Object.values(o2)[0];
  } catch {
    return void 0;
  }
};
var CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
var CLE_PUBLIABLE = lire("CLE_PUBLIABLE") ?? lire("SUPABASE_PUBLISHABLE_KEY") ?? lire("SUPABASE_PUBLISHABLE_KEYS") ?? lire("SUPABASE_ANON_KEY") ?? "";
var SITE = (Deno.env.get("SITE_URL") ?? "https://fill.studioes.fr/espace").replace(/\/$/, "");
var cors = {
  "Access-Control-Allow-Origin": (() => {
    try {
      return new URL(SITE).origin;
    } catch {
      return "*";
    }
  })(),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// supabase/functions/atelier/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

// supabase/functions/_partage/offre.json
var offre_default = {
  version: "2026-11-13",
  unite_sup: 39,
  engagement_mois: 6,
  formules: [
    {
      id: "essentiel",
      nom: "Essentiel",
      prix: 490,
      unites: 15,
      delai: "2 jours ouvr\xE9s",
      delai_j: 2,
      suivi: "Point de 30 minutes chaque trimestre",
      urgences: "+1 unit\xE9 par demande urgente",
      urgences_incluses: 0,
      pour: "Petite commune, structure publique ou PME qui veut une pr\xE9sence tenue \xE0 jour, sans plus.",
      promesse: "Une communication tenue \xE0 jour, au fil de vos actualit\xE9s.",
      exemples: [
        [
          "5 publications",
          "4 actualit\xE9s",
          "2 \xE9v\xE9nements \xE0 l\u2019agenda",
          "1 lettre d\u2019information",
          "1 story"
        ],
        [
          "1 affiche",
          "3 d\xE9clinaisons",
          "1 \xE9v\xE9nement \xE0 l\u2019agenda",
          "1 actualit\xE9",
          "2 publications",
          "1 story",
          "1 communiqu\xE9 de presse",
          "1 annonce dans les agendas des m\xE9dias"
        ],
        [
          "6 publications",
          "3 d\xE9clinaisons",
          "1 invitation",
          "1 communiqu\xE9 de presse",
          "2 actualit\xE9s"
        ]
      ],
      repartitions: [
        {
          nom: "Site et r\xE9seaux",
          panier: {
            post: 5,
            actu: 4,
            agenda: 2,
            news: 1,
            story: 1
          }
        },
        {
          nom: "\xC9v\xE9nement",
          panier: {
            affiche: 1,
            gabarit: 3,
            agenda: 1,
            actu: 1,
            post: 2,
            story: 1,
            presse: 1,
            annonce: 1
          }
        },
        {
          nom: "Visuels",
          panier: {
            post: 6,
            gabarit: 3,
            invitation: 1,
            presse: 1,
            actu: 2
          }
        }
      ],
      points: [
        "Site et r\xE9seaux entretenus",
        "Demandes courantes en 2 jours ouvr\xE9s",
        "Un point de suivi par trimestre"
      ],
      mise_en_place: 0,
      court: "pr\xE9sence entretenue",
      atouts: [
        "<b>15 unit\xE9s</b> par mois",
        "Point de suivi <b>chaque trimestre</b>",
        "Courant <b>2 j</b> \xB7 cr\xE9ation <b>5 j</b> ouvr\xE9s"
      ],
      creation_j: 5
    },
    {
      id: "regulier",
      nom: "R\xE9gulier",
      prix: 990,
      unites: 35,
      delai: "2 jours ouvr\xE9s",
      delai_j: 2,
      suivi: "Point de 30 minutes chaque mois",
      urgences: "+1 unit\xE9 par demande urgente",
      urgences_incluses: 0,
      pour: "Commune de 2 000 \xE0 8 000 habitants, PME active, office de tourisme.",
      promesse: "Une pr\xE9sence chaque semaine sur vos principaux canaux.",
      exemples: [
        [
          "10 publications",
          "6 actualit\xE9s",
          "4 \xE9v\xE9nements \xE0 l\u2019agenda",
          "1 lettre d\u2019information",
          "1 affiche",
          "2 d\xE9clinaisons",
          "1 communiqu\xE9 de presse",
          "2 stories",
          "2 mises \xE0 jour de page"
        ],
        [
          "6 pages de bulletin",
          "8 publications",
          "5 actualit\xE9s",
          "3 \xE9v\xE9nements \xE0 l\u2019agenda",
          "1 communiqu\xE9 de presse",
          "2 d\xE9clinaisons",
          "1 \xE9dito",
          "1 story"
        ],
        [
          "1 reportage photo",
          "8 publications",
          "5 actualit\xE9s",
          "3 \xE9v\xE9nements \xE0 l\u2019agenda",
          "1 lettre d\u2019information",
          "3 stories"
        ]
      ],
      repartitions: [
        {
          nom: "Tous les canaux",
          panier: {
            post: 10,
            actu: 6,
            agenda: 4,
            news: 1,
            affiche: 1,
            gabarit: 2,
            presse: 1,
            story: 2,
            majpage: 2
          }
        },
        {
          nom: "Mois du bulletin",
          panier: {
            bulletin: 6,
            post: 8,
            actu: 5,
            agenda: 3,
            presse: 1,
            gabarit: 2,
            edito: 1,
            story: 1
          }
        },
        {
          nom: "Mois photo",
          panier: {
            photo: 1,
            post: 8,
            actu: 5,
            agenda: 3,
            news: 1,
            story: 3
          }
        }
      ],
      points: [
        "Site, r\xE9seaux et lettre d\u2019information",
        "Demandes courantes en 2 jours ouvr\xE9s",
        "Un point de suivi par mois"
      ],
      mise_en_place: 0,
      court: "pr\xE9sence chaque semaine",
      atouts: [
        "<b>35 unit\xE9s</b> par mois",
        "Point de suivi <b>chaque mois</b>",
        "<b>Reportage photo</b> possible"
      ],
      creation_j: 5
    },
    {
      id: "soutenu",
      nom: "Soutenu",
      prix: 1890,
      unites: 75,
      delai: "1 jour ouvr\xE9",
      delai_j: 1,
      suivi: "Point toutes les deux semaines, bilan chaque semestre",
      urgences: "2 par mois incluses, puis +1 unit\xE9",
      urgences_incluses: 2,
      pour: "Commune de plus de 8 000 habitants sans service, intercommunalit\xE9, PME qui recrute ou se d\xE9veloppe.",
      promesse: "Une production soutenue : bulletin, r\xE9seaux, site et presse.",
      exemples: [
        [
          "12 pages de bulletin",
          "16 publications",
          "10 actualit\xE9s",
          "6 \xE9v\xE9nements \xE0 l\u2019agenda",
          "2 lettres d\u2019information",
          "1 affiche",
          "3 d\xE9clinaisons",
          "2 communiqu\xE9s de presse",
          "2 stories"
        ],
        [
          "1 reportage photo",
          "16 publications",
          "10 actualit\xE9s",
          "8 \xE9v\xE9nements \xE0 l\u2019agenda",
          "2 lettres d\u2019information",
          "1 affiche",
          "1 flyer",
          "4 d\xE9clinaisons",
          "2 communiqu\xE9s de presse",
          "4 stories",
          "1 invitation presse",
          "2 annonces dans les agendas des m\xE9dias"
        ],
        [
          "2 reportages photo",
          "14 publications",
          "10 actualit\xE9s",
          "6 \xE9v\xE9nements \xE0 l\u2019agenda",
          "2 lettres d\u2019information",
          "1 affiche",
          "3 d\xE9clinaisons",
          "4 stories",
          "1 communiqu\xE9 de presse"
        ]
      ],
      repartitions: [
        {
          nom: "Bulletin et r\xE9seaux",
          panier: {
            bulletin: 12,
            post: 16,
            actu: 10,
            agenda: 6,
            news: 2,
            affiche: 1,
            gabarit: 3,
            presse: 2,
            story: 2
          }
        },
        {
          nom: "Temps fort",
          panier: {
            photo: 1,
            post: 16,
            actu: 10,
            agenda: 8,
            news: 2,
            affiche: 1,
            flyer: 1,
            gabarit: 4,
            presse: 2,
            story: 4,
            invitpresse: 1,
            annonce: 2
          }
        },
        {
          nom: "Deux reportages",
          panier: {
            photo: 2,
            post: 14,
            actu: 10,
            agenda: 6,
            news: 2,
            affiche: 1,
            gabarit: 3,
            story: 4,
            presse: 1
          }
        }
      ],
      points: [
        "Demandes courantes en 1 jour ouvr\xE9",
        "Cr\xE9ations en 3 jours ouvr\xE9s",
        "Deux urgences par mois incluses"
      ],
      mise_en_place: 0,
      court: "production soutenue",
      atouts: [
        "<b>75 unit\xE9s</b> par mois",
        "Courant <b>1 j</b> \xB7 cr\xE9ation <b>3 j</b> ouvr\xE9s",
        "<b>2 urgences</b> incluses par mois"
      ],
      creation_j: 3
    }
  ],
  relais: {
    id: "relais",
    nom: "Relais",
    prix_mois: 2490,
    unites_mois: 85,
    prix_semaine: 690,
    unites_semaine: 20,
    semaines_min: 2,
    delai_demarrage: "24 h",
    delai: "1 jour ouvr\xE9 pour les demandes courantes, 3 jours ouvr\xE9s pour les cr\xE9ations, urgences sans majoration",
    promesse: "Le poste est vide, la communication continue.",
    points: [
      "Op\xE9rationnel sous 24 h apr\xE8s l\u2019accord",
      "Urgences sans majoration",
      "Passation compl\xE8te au retour"
    ],
    mise_en_place: 0,
    urgences: "Incluses, sans unit\xE9 suppl\xE9mentaire",
    creation_j: 3
  },
  categories: [
    {
      id: "reseaux",
      nom: "R\xE9seaux sociaux",
      it: "ce qui se publie sur vos comptes"
    },
    {
      id: "site",
      nom: "Site internet",
      it: "ce qui se met en ligne"
    },
    {
      id: "lettres",
      nom: "Lettres d\u2019information",
      it: "ce qui s\u2019envoie \xE0 vos abonn\xE9s"
    },
    {
      id: "presse",
      nom: "Presse",
      it: "ce qui part aux r\xE9dactions"
    },
    {
      id: "redaction",
      nom: "R\xE9daction",
      it: "les textes"
    },
    {
      id: "petits",
      nom: "Petits formats",
      it: "les supports du quotidien"
    },
    {
      id: "affiches",
      nom: "Affiches et campagnes",
      it: "les supports d\u2019un \xE9v\xE9nement"
    },
    {
      id: "edition",
      nom: "\xC9dition",
      it: "les documents mis en page"
    },
    {
      id: "photo",
      nom: "Photo et vid\xE9o",
      it: "les images"
    },
    {
      id: "fabrication",
      nom: "Fabrication et prestataires",
      it: "le suivi jusqu\u2019\xE0 la livraison"
    }
  ],
  catalogue: [
    {
      id: "post",
      cat: "reseaux",
      nom: "Publication",
      u: 1,
      detail: "Texte et visuel (ou carrousel), adapt\xE9s \xE0 chacun de vos comptes, programm\xE9s",
      max: 40,
      t: "#B9B4FF",
      creation: false
    },
    {
      id: "story",
      cat: "reseaux",
      nom: "Story",
      u: 1,
      detail: "Jusqu\u2019\xE0 3 \xE9crans au format vertical",
      max: 20,
      t: "#B9B4FF",
      creation: false
    },
    {
      id: "habillage",
      cat: "reseaux",
      nom: "Habillage des comptes",
      u: 2,
      detail: "Photo de profil et image de couverture, pour tous vos r\xE9seaux",
      max: 2,
      t: "#B9B4FF",
      creation: true
    },
    {
      id: "videoligne",
      cat: "reseaux",
      nom: "Mise en ligne d\u2019une vid\xE9o",
      u: 1,
      detail: "Titre, description et miniature, sur YouTube ou vos r\xE9seaux",
      max: 10,
      t: "#B9B4FF",
      creation: false
    },
    {
      id: "moder",
      cat: "reseaux",
      nom: "Mod\xE9ration, par mois",
      u: 4,
      detail: "R\xE9ponses aux commentaires et aux messages, signalement de ce qui vous revient",
      max: 1,
      t: "#B9B4FF",
      creation: false,
      bascule: true
    },
    {
      id: "actu",
      cat: "site",
      nom: "Actualit\xE9",
      u: 1,
      detail: "Article r\xE9dig\xE9, illustr\xE9 et mis en ligne",
      max: 30,
      t: "#9FDCC3",
      creation: false
    },
    {
      id: "agenda",
      cat: "site",
      nom: "\xC9v\xE9nement \xE0 l\u2019agenda",
      u: 1,
      detail: "Fiche compl\xE8te : date, lieu, texte, visuel",
      max: 30,
      t: "#9FDCC3",
      creation: false
    },
    {
      id: "majpage",
      cat: "site",
      nom: "Mise \xE0 jour d\u2019une page",
      u: 1,
      detail: "Texte, horaires, document \xE0 t\xE9l\xE9charger, offre d\u2019emploi",
      max: 20,
      t: "#9FDCC3",
      creation: false
    },
    {
      id: "page",
      cat: "site",
      nom: "Nouvelle page",
      u: 3,
      detail: "Page r\xE9dig\xE9e, structur\xE9e, illustr\xE9e et mise en ligne",
      max: 6,
      t: "#9FDCC3",
      creation: true
    },
    {
      id: "formulaire",
      cat: "site",
      nom: "Formulaire en ligne",
      u: 2,
      detail: "Inscription, contact ou sondage, r\xE9ponses envoy\xE9es \xE0 la bonne personne",
      max: 6,
      t: "#9FDCC3",
      creation: true
    },
    {
      id: "bandeau",
      cat: "site",
      nom: "Bandeau d\u2019accueil",
      u: 1,
      detail: "Visuel \xE0 la une du site, au bon format",
      max: 10,
      t: "#9FDCC3",
      creation: false
    },
    {
      id: "news",
      cat: "lettres",
      nom: "Lettre d\u2019information",
      u: 3,
      detail: "R\xE9daction, montage et envoi \xE0 vos abonn\xE9s",
      max: 6,
      t: "#F6B8C4",
      creation: true
    },
    {
      id: "newsint",
      cat: "lettres",
      nom: "Lettre interne",
      u: 3,
      detail: "La m\xEAme chose pour vos agents ou vos \xE9quipes",
      max: 6,
      t: "#F6B8C4",
      creation: true
    },
    {
      id: "modelelettre",
      cat: "lettres",
      nom: "Mod\xE8le de lettre",
      u: 3,
      detail: "Gabarit \xE0 vos couleurs, r\xE9utilisable \xE0 chaque envoi",
      max: 2,
      t: "#F6B8C4",
      creation: true
    },
    {
      id: "presse",
      cat: "presse",
      nom: "Communiqu\xE9 de presse",
      u: 2,
      detail: "R\xE9daction et envoi aux r\xE9dactions",
      max: 8,
      t: "#F6B8C4",
      creation: false
    },
    {
      id: "invitpresse",
      cat: "presse",
      nom: "Invitation presse",
      u: 1,
      detail: "Invitation \xE0 un point presse ou \xE0 une inauguration, envoy\xE9e aux r\xE9dactions",
      max: 8,
      t: "#F6B8C4",
      creation: false
    },
    {
      id: "dossierpresse",
      cat: "presse",
      nom: "Dossier de presse",
      u: 5,
      detail: "Jusqu\u2019\xE0 6 pages r\xE9dig\xE9es et mises en page",
      max: 3,
      t: "#F6B8C4",
      creation: true
    },
    {
      id: "annonce",
      cat: "presse",
      nom: "Annonce dans les agendas des m\xE9dias",
      u: 1,
      detail: "Saisie de votre \xE9v\xE9nement sur les agendas en ligne de la presse locale",
      max: 20,
      t: "#F6B8C4",
      creation: false
    },
    {
      id: "revue",
      cat: "presse",
      nom: "Revue de presse du mois",
      u: 2,
      detail: "Ce qui est paru sur vous, rassembl\xE9 en un document",
      max: 1,
      t: "#F6B8C4",
      creation: false
    },
    {
      id: "article",
      cat: "redaction",
      nom: "Article",
      u: 2,
      detail: "Jusqu\u2019\xE0 3 000 signes, pour un magazine ou un site",
      max: 12,
      t: "#A9CCFF",
      creation: false
    },
    {
      id: "edito",
      cat: "redaction",
      nom: "\xC9dito",
      u: 2,
      detail: "Mot du maire, du pr\xE9sident ou du dirigeant",
      max: 6,
      t: "#A9CCFF",
      creation: false
    },
    {
      id: "discours",
      cat: "redaction",
      nom: "Discours",
      u: 2,
      detail: "Environ 5 minutes de prise de parole",
      max: 6,
      t: "#A9CCFF",
      creation: false
    },
    {
      id: "relecture",
      cat: "redaction",
      nom: "Relecture et correction",
      u: 1,
      detail: "Jusqu\u2019\xE0 4 pages : orthographe, clart\xE9, coh\xE9rence",
      max: 12,
      t: "#A9CCFF",
      creation: false
    },
    {
      id: "invitation",
      cat: "petits",
      nom: "Invitation ou carton",
      u: 2,
      detail: "Fichier pr\xEAt \xE0 imprimer et version \xE0 envoyer par mail",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "cartevisite",
      cat: "petits",
      nom: "Carte de visite",
      u: 2,
      detail: "Recto verso, d\xE9clinable par personne",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "voeux",
      cat: "petits",
      nom: "Carte de v\u0153ux",
      u: 2,
      detail: "Version papier et version num\xE9rique",
      max: 3,
      t: "#F5D199",
      creation: true
    },
    {
      id: "menu",
      cat: "petits",
      nom: "Menu ou carte",
      u: 2,
      detail: "Menu de repas, carte de restaurant, programme d\u2019une soir\xE9e",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "signature",
      cat: "petits",
      nom: "Signature de mail",
      u: 2,
      detail: "Signature \xE0 vos couleurs, avec la marche \xE0 suivre pour l\u2019installer",
      max: 3,
      t: "#F5D199",
      creation: true
    },
    {
      id: "couverture",
      cat: "petits",
      nom: "Couverture de dossier",
      u: 2,
      detail: "Page de garde d\u2019un rapport, d\u2019un dossier ou d\u2019un devis",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "bon",
      cat: "petits",
      nom: "Bon d\u2019achat ou carte cadeau",
      u: 2,
      detail: "Fichier pr\xEAt \xE0 imprimer",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "chevalet",
      cat: "petits",
      nom: "Chevalet, \xE9tiquette ou badge",
      u: 2,
      detail: "S\xE9rie pr\xEAte \xE0 imprimer \xE0 partir de votre liste",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "affiche",
      cat: "affiches",
      nom: "Affiche",
      u: 4,
      detail: "Cr\xE9ation, fichier pr\xEAt \xE0 imprimer et version \xE9cran",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "gabarit",
      cat: "affiches",
      nom: "D\xE9clinaison d\u2019un visuel existant",
      u: 1,
      detail: "Un format de plus : r\xE9seaux, \xE9cran, A3, nouvelle date",
      max: 20,
      t: "#F5D199",
      creation: false
    },
    {
      id: "flyer",
      cat: "affiches",
      nom: "Flyer",
      u: 3,
      detail: "Recto verso, pr\xEAt \xE0 imprimer",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "depliant",
      cat: "affiches",
      nom: "D\xE9pliant",
      u: 6,
      detail: "2 ou 3 volets, textes mis en forme",
      max: 4,
      t: "#F5D199",
      creation: true
    },
    {
      id: "grandformat",
      cat: "affiches",
      nom: "Grand format",
      u: 4,
      detail: "B\xE2che, kak\xE9mono, panneau ou habillage de sc\xE8ne",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "plan",
      cat: "affiches",
      nom: "Plan ou carte illustr\xE9e",
      u: 6,
      detail: "Plan d\u2019un site, d\u2019un parcours ou d\u2019un \xE9v\xE9nement",
      max: 3,
      t: "#F5D199",
      creation: true
    },
    {
      id: "objet",
      cat: "affiches",
      nom: "Marquage d\u2019objet",
      u: 2,
      detail: "Sac, plaque, vitrine : fichier adapt\xE9 au fabricant",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "identite",
      cat: "affiches",
      nom: "Identit\xE9 d\u2019un \xE9v\xE9nement",
      u: 8,
      detail: "Nom mis en forme, couleurs, affiche et premiers formats",
      max: 2,
      t: "#F5D199",
      creation: true
    },
    {
      id: "bulletin",
      cat: "edition",
      nom: "Bulletin ou magazine, par page",
      u: 2,
      detail: "Mise en page, int\xE9gration des textes et des photos. Au-del\xE0 de 12 pages par num\xE9ro : devis",
      max: 12,
      t: "#A9CCFF",
      creation: true
    },
    {
      id: "doclong",
      cat: "edition",
      nom: "Document long sur mod\xE8le existant, par page",
      u: 1,
      detail: "Rapport d\u2019activit\xE9, guide, livret repris dans votre maquette",
      max: 40,
      t: "#A9CCFF",
      creation: true
    },
    {
      id: "diaporama",
      cat: "edition",
      nom: "Diaporama",
      u: 3,
      detail: "Jusqu\u2019\xE0 10 diapositives pour une r\xE9union ou une c\xE9r\xE9monie",
      max: 6,
      t: "#A9CCFF",
      creation: true
    },
    {
      id: "modeledoc",
      cat: "edition",
      nom: "Mod\xE8le de document",
      u: 3,
      detail: "Papier \xE0 en-t\xEAte, mod\xE8le de courrier ou de diaporama",
      max: 4,
      t: "#A9CCFF",
      creation: true
    },
    {
      id: "formulairepdf",
      cat: "edition",
      nom: "Formulaire \xE0 remplir",
      u: 2,
      detail: "Document \xE0 compl\xE9ter \xE0 l\u2019\xE9cran ou \xE0 la main",
      max: 6,
      t: "#A9CCFF",
      creation: true
    },
    {
      id: "photo",
      cat: "photo",
      nom: "Reportage photo",
      u: 13,
      detail: "Une demi-journ\xE9e \xE0 moins de 40 km, 30 photos retouch\xE9es. \xC0 partir de la formule R\xE9gulier",
      max: 3,
      t: "#D7E8A4",
      creation: true,
      min: "regulier"
    },
    {
      id: "retouche",
      cat: "photo",
      nom: "Retouche d\u2019un lot de photos",
      u: 1,
      detail: "Jusqu\u2019\xE0 10 photos fournies par vous : cadrage, lumi\xE8re, d\xE9tourage",
      max: 10,
      t: "#D7E8A4",
      creation: false
    },
    {
      id: "montage",
      cat: "photo",
      nom: "Montage vid\xE9o court",
      u: 3,
      detail: "Moins d\u2019une minute, \xE0 partir de vos images, sous-titr\xE9",
      max: 6,
      t: "#D7E8A4",
      creation: true
    },
    {
      id: "animation",
      cat: "photo",
      nom: "Animation d\u2019un visuel",
      u: 2,
      detail: "Affiche ou annonce anim\xE9e pour les \xE9crans et les r\xE9seaux",
      max: 6,
      t: "#D7E8A4",
      creation: true
    },
    {
      id: "impression",
      cat: "fabrication",
      nom: "Devis et suivi d\u2019impression",
      u: 1,
      detail: "Demande de devis, envoi des fichiers, suivi jusqu\u2019\xE0 la livraison",
      max: 10,
      t: "#E6E2D9",
      creation: false
    },
    {
      id: "prestataire",
      cat: "fabrication",
      nom: "Coordination d\u2019un prestataire",
      u: 1,
      detail: "Traduction, distribution, signal\xE9tique : brief et suivi",
      max: 10,
      t: "#E6E2D9",
      creation: false
    }
  ],
  profils: [
    {
      id: "petite",
      nom: "Commune de moins de 2 000 habitants",
      court: "Petite commune",
      panier: {
        post: 4,
        actu: 3,
        agenda: 3,
        gabarit: 1
      }
    },
    {
      id: "commune",
      nom: "Commune de 2 000 \xE0 8 000 habitants",
      court: "Commune",
      panier: {
        post: 7,
        actu: 4,
        agenda: 4,
        presse: 1,
        news: 1,
        affiche: 1
      }
    },
    {
      id: "interco",
      nom: "Intercommunalit\xE9 ou commune de plus de 8 000 habitants",
      court: "Intercommunalit\xE9",
      panier: {
        post: 12,
        actu: 6,
        agenda: 6,
        presse: 2,
        news: 2,
        affiche: 1,
        bulletin: 4
      }
    },
    {
      id: "pme",
      nom: "PME de 10 \xE0 50 salari\xE9s",
      court: "PME",
      panier: {
        post: 8,
        actu: 2,
        news: 1,
        gabarit: 2,
        affiche: 1
      }
    }
  ],
  engagement_long: 6,
  mise_en_place_regle: "Aucune mise en place factur\xE9e ; premier mois sans engagement, puis 6 mois minimum compt\xE9s depuis le premier mois, puis r\xE9siliable chaque mois avec un mois de pr\xE9avis",
  urgence_unites: 1,
  report: "Les unit\xE9s non utilis\xE9es sont report\xE9es une fois, sur le mois suivant ; elles sont consomm\xE9es en premier",
  delais: {
    courant: "publication, story, actualit\xE9, \xE9v\xE9nement, mise \xE0 jour de page, communiqu\xE9, d\xE9clinaison d\u2019un visuel",
    creation: "5 jours ouvr\xE9s",
    creation_liste: "affiche, flyer, d\xE9pliant, petits formats, lettre d\u2019information, nouvelle page, dossier de presse, diaporama",
    bulletin: "R\xE9troplanning fix\xE9 ensemble, \xE9l\xE9ments \xE0 fournir trois semaines avant parution",
    photo: "Date convenue ensemble, au moins une semaine \xE0 l\u2019avance",
    courant_j: "1 \xE0 2 jours ouvr\xE9s",
    creation_soutenu: "3 jours ouvr\xE9s",
    demarrage: "Op\xE9rationnel sous 24 h apr\xE8s l\u2019accord"
  }
};

// supabase/functions/_partage/regles/offre.ts
var o = offre_default;
var OFFRE = {
  version: o.version,
  uniteSup: o.unite_sup,
  // prix d'une unité hors forfait (TVA non applicable)
  engagementMois: o.engagement_mois,
  engagementLong: o.engagement_long,
  // mise en place offerte à partir de cet engagement
  urgenceUnites: o.urgence_unites,
  // unités ajoutées par demande urgente
  delaiCreationJ: parseInt(o.delais.creation, 10),
  delais: o.delais,
  report: o.report
};
var FORMULES = [
  ...o.formules.map((f) => ({
    id: f.id,
    nom: f.nom,
    prix: f.prix,
    unites: f.unites,
    delai_j: f.delai_j,
    creation_j: f.creation_j,
    urgences_incluses: f.urgences_incluses,
    mise_en_place: f.mise_en_place,
    suivi: f.suivi,
    court: f.court
  })),
  {
    id: "relais",
    nom: o.relais.nom,
    prix: o.relais.prix_mois,
    unites: o.relais.unites_mois,
    delai_j: 1,
    creation_j: o.relais.creation_j,
    urgences_incluses: Infinity,
    mise_en_place: o.relais.mise_en_place,
    suivi: "Point chaque semaine",
    court: "pendant une absence"
  }
];
var CATALOGUE = o.catalogue;
var CATEGORIES = o.categories;
var prestation = (id) => CATALOGUE.find((p) => p.id === id);
var TYPES_PLANIFIES = ["bulletin", "photo"];
var TYPES_CREATION = [...CATALOGUE.filter((p) => p.creation && !TYPES_PLANIFIES.includes(p.id)).map((p) => p.id), "video"];
var ABONNEMENTS = FORMULES.filter((f) => f.id !== "relais");

// supabase/functions/atelier/index.ts
var json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } });
var CONSIGNES = `Tu r\xE9diges, pour le service de communication externalis\xE9 Fill, le premier jet des textes d'une demande.
Fill \xE9crit pour des communes, des collectivit\xE9s et des PME. R\xE8gles :
- fran\xE7ais soign\xE9, ton humain, sobre, descriptif et concret ; aucun superlatif, aucune promesse, rien de \xAB vendeur \xBB ;
- typographie fran\xE7aise : espaces avant \xAB : ; ? ! \xBB, guillemets \xAB \xBB, apostrophe \u2019 ; jamais de tiret long ni de tiret demi-cadratin (utiliser des parenth\xE8ses ou les deux-points) ; heures au format \xAB 18 h 30 \xBB ;
- n'inventer aucune information absente du brief (date, lieu, tarif, contact) : si elle manque, l'\xE9crire entre crochets, par exemple [horaire \xE0 confirmer] ;
- publication r\xE9seaux sociaux : 400 \xE0 700 signes, une accroche factuelle, les informations pratiques, deux ou trois mots-di\xE8se en fin ;
- actualit\xE9 du site : un titre de 70 signes au plus, un chap\xF4 de deux phrases, trois \xE0 cinq paragraphes courts, un appel final ;
- newsletter : un titre, une introduction, une rubrique par sujet ;
- communiqu\xE9 de presse : titre, chap\xF4, corps, contact presse ;
- textes d'affiche : titre, sous-titre, trois informations pratiques au plus, mention finale.
R\xE9ponds uniquement par un tableau JSON, sans autre texte.`;
var SCHEMA = `Chaque \xE9l\xE9ment du tableau : { "nom": string (identifiant de fichier en minuscules et tirets), "type": "post" | "web" | "email" | "pdf" | "affiche",
"legende": string (le texte complet pour une publication ; l'adresse de la page pour une actualit\xE9 ; l'objet pour une newsletter),
"contenu": { "titre"?: string, "chapo"?: string, "corps"?: string[], "sections"?: { "titre": string, "texte": string }[], "appel"?: string } }`;
var TYPES = { post: "post", actu: "web", agenda: "web", page: "web", news: "email", presse: "pdf", affiche: "affiche", gabarit: "affiche", flyer: "affiche" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = Deno.env.get("SUPABASE_URL");
  const service = createClient(url, CLE_SECRETE);
  const auth = req.headers.get("Authorization") ?? "";
  if (!CLE_SECRETE || auth !== `Bearer ${CLE_SECRETE}`) {
    const utilisateur = createClient(url, CLE_PUBLIABLE, { global: { headers: { Authorization: auth } } });
    const { data: admin } = await utilisateur.rpc("est_admin");
    if (!admin) return json({ erreur: "R\xE9serv\xE9 \xE0 Fill" }, 403);
  }
  const { demande: id, consigne = "" } = await req.json();
  const { data: d } = await service.from("demande").select("id, titre, brief, parution, urgente, organisation_id").eq("id", id).single();
  if (!d) return json({ erreur: "Demande introuvable" }, 404);
  const { data: o2 } = await service.from("organisation").select("nom, type, sans_ia").eq("id", d.organisation_id).single();
  if (o2?.sans_ia) return json({ erreur: "Ce client a refus\xE9 le premier jet automatique" }, 409);
  const { data: lignes } = await service.from("demande_ligne").select("prestation, quantite").eq("demande_id", id);
  const utiles = (lignes ?? []).filter((l) => TYPES[l.prestation]);
  if (!utiles.length) return json({ erreur: "Aucun texte \xE0 pr\xE9parer pour cette demande" }, 409);
  const { data: precedent } = await service.from("brouillon").select("contenu").eq("demande_id", id).maybeSingle();
  const demandeTexte = [
    `Client : ${o2?.nom} (${o2?.type === "collectivite" ? "collectivit\xE9" : "entreprise"})`,
    `Sujet : ${d.titre}`,
    d.parution ? `Date de parution souhait\xE9e : ${d.parution}` : "",
    `Brief du client :
${d.brief}`,
    `Textes \xE0 pr\xE9parer : ${utiles.map((l) => `${l.quantite} \xD7 ${prestation(l.prestation)?.nom ?? l.prestation} (type \xAB ${TYPES[l.prestation]} \xBB)`).join(", ")}`,
    consigne ? `Consigne de Fill pour cette reprise : ${consigne}` : "",
    consigne && precedent ? `Jet pr\xE9c\xE9dent, \xE0 reprendre :
${JSON.stringify(precedent.contenu.fichiers)}` : ""
  ].filter(Boolean).join("\n\n");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": Deno.env.get("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("ATELIER_MODELE") ?? "claude-sonnet-5-5",
      max_tokens: 4e3,
      system: `${CONSIGNES}

${SCHEMA}`,
      messages: [{ role: "user", content: demandeTexte }]
    })
  });
  if (!r.ok) return json({ erreur: "Atelier indisponible", detail: await r.text() }, 502);
  const sortie = await r.json();
  const texte = sortie.content?.find((c) => c.type === "text")?.text ?? "";
  let fichiers;
  try {
    fichiers = JSON.parse(texte.slice(texte.indexOf("["), texte.lastIndexOf("]") + 1));
  } catch {
    return json({ erreur: "R\xE9ponse de l\u2019atelier illisible" }, 502);
  }
  const nettoye = JSON.parse(JSON.stringify(fichiers).replace(/\s?[—–]\s?/g, " : "));
  const essais = (precedent?.contenu?.essais ?? 0) + 1;
  const { error } = await service.rpc("enregistrer_brouillon", { p_demande: id, p_brouillon: { fichiers: nettoye, consigne: consigne || void 0, essais } });
  if (error) return json({ erreur: error.message }, 500);
  return json({ ok: true, fichiers: nettoye.length, essais });
});
