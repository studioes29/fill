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

// supabase/functions/pilote/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

// supabase/functions/_partage/regles/calendrier.ts
var j = (d2) => d2.toISOString().slice(0, 10);
var d = (s) => /* @__PURE__ */ new Date(s + "T00:00:00Z");
var ajouterJours = (s, n) => {
  const x = d(s);
  x.setUTCDate(x.getUTCDate() + n);
  return j(x);
};
var paques = (an) => {
  const a = an % 19, b = Math.floor(an / 100), c = an % 100;
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31), jour = (h + l - 7 * m + 114) % 31 + 1;
  return `${an}-${String(mois).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
};
var cache = /* @__PURE__ */ new Map();
var feries = (an) => {
  let s = cache.get(an);
  if (s) return s;
  const p = paques(an);
  s = /* @__PURE__ */ new Set([
    `${an}-01-01`,
    `${an}-05-01`,
    `${an}-05-08`,
    `${an}-07-14`,
    `${an}-08-15`,
    `${an}-11-01`,
    `${an}-11-11`,
    `${an}-12-25`,
    ajouterJours(p, 1),
    // lundi de Pâques
    ajouterJours(p, 39),
    // Ascension
    ajouterJours(p, 50)
    // lundi de Pentecôte
  ]);
  cache.set(an, s);
  return s;
};
var estOuvre = (s, fermetures = []) => {
  const x = d(s), wd = x.getUTCDay();
  if (wd === 0 || wd === 6) return false;
  if (feries(x.getUTCFullYear()).has(s)) return false;
  return !fermetures.some((f) => s >= f.debut && s <= f.fin);
};
var ajouterOuvres = (s, n, fermetures = []) => {
  let x = s;
  let reste = n;
  while (reste > 0) {
    x = ajouterJours(x, 1);
    if (estOuvre(x, fermetures)) reste--;
  }
  return x;
};
var ouvresEntre = (a, b, fermetures = []) => {
  if (b <= a) return 0;
  let n = 0;
  for (let x = ajouterJours(a, 1); x <= b; x = ajouterJours(x, 1)) if (estOuvre(x, fermetures)) n++;
  return n;
};
var periodeDe = (s) => s.slice(0, 7);

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
var formule = (id) => {
  const f = FORMULES.find((x) => x.id === id);
  if (!f) throw new Error(`Formule inconnue : ${id}`);
  return f;
};
var prestation = (id) => CATALOGUE.find((p) => p.id === id);
var TYPES_PLANIFIES = ["bulletin", "photo"];
var TYPES_CREATION = [...CATALOGUE.filter((p) => p.creation && !TYPES_PLANIFIES.includes(p.id)).map((p) => p.id), "video"];
var ABONNEMENTS = FORMULES.filter((f) => f.id !== "relais");
var ORDRE_FORMULES = ["essentiel", "regulier", "soutenu", "relais"];

// supabase/functions/_partage/regles/estimation.ts
var RANG = { courant: 0, creation: 1, planifie: 2 };
var natureDelai = (id) => TYPES_PLANIFIES.includes(id) ? "planifie" : TYPES_CREATION.includes(id) ? "creation" : "courant";
var delaiUrgent = (n) => Math.max(1, Math.floor(n / 2));
var normaliser = (lignes) => {
  const m = /* @__PURE__ */ new Map();
  for (const l of lignes) if (l.quantite > 0) m.set(l.prestation, (m.get(l.prestation) ?? 0) + Math.round(l.quantite));
  return [...m.entries()].map(([prestation2, quantite]) => ({ prestation: prestation2, quantite }));
};
var estimer = (e, c) => {
  const f = formule(c.formule);
  const fer = c.fermetures ?? [];
  const confirmation = ajouterOuvres(c.depot, 1, fer);
  const vide = {
    ok: false,
    detail: [],
    unitesBase: 0,
    unitesUrgence: 0,
    unites: 0,
    urgenceIncluse: false,
    nature: "courant",
    delaiJ: null,
    confirmationAuPlusTard: confirmation,
    livraisonAuPlusTot: null,
    livraisonUrgente: null,
    parutionTenable: null,
    horsForfait: 0,
    coutHorsForfait: 0
  };
  const lignes = normaliser(e.lignes);
  if (!lignes.length) return { ...vide, erreur: "Choisissez au moins une prestation." };
  const detail = [];
  for (const l of lignes) {
    const p = prestation(l.prestation);
    if (!p) return { ...vide, erreur: "Prestation inconnue." };
    if (p.min && ORDRE_FORMULES.indexOf(c.formule) < ORDRE_FORMULES.indexOf(p.min)) {
      return { ...vide, erreur: `${p.nom} : disponible \xE0 partir de la formule ${formule(p.min).nom}.` };
    }
    const q = Math.min(p.max ?? 99, l.quantite);
    detail.push({ prestation: p.id, nom: p.nom, quantite: q, unites: p.u * q, nature: natureDelai(p.id) });
  }
  const nature = detail.reduce((n, d2) => RANG[d2.nature] > RANG[n] ? d2.nature : n, "courant");
  const unitesBase = detail.reduce((s, d2) => s + d2.unites, 0);
  const urgenceIncluse = e.urgente && c.urgencesUtilisees < f.urgences_incluses;
  const unitesUrgence = e.urgente && !urgenceIncluse ? OFFRE.urgenceUnites : 0;
  const unites = unitesBase + unitesUrgence;
  let delaiJ = null;
  if (nature === "courant") delaiJ = f.delai_j;
  if (nature === "creation") delaiJ = f.creation_j ?? OFFRE.delaiCreationJ;
  const delaiEffectif = delaiJ === null ? null : e.urgente ? delaiUrgent(delaiJ) : delaiJ;
  const livraison = delaiEffectif === null ? null : ajouterOuvres(confirmation, delaiEffectif, fer);
  const livraisonUrgente = delaiJ === null ? null : ajouterOuvres(confirmation, delaiUrgent(delaiJ), fer);
  let parutionTenable = null;
  if (e.parution && livraison) parutionTenable = livraison <= e.parution;
  if (e.parution && nature === "planifie") {
    const marge = detail.some((d2) => d2.prestation === "bulletin") ? 15 : 5;
    parutionTenable = ouvresEntre(c.depot, e.parution, fer) >= marge;
  }
  const horsForfait = Math.max(0, unites - Math.max(0, c.disponibles));
  return {
    ok: true,
    detail,
    unitesBase,
    unitesUrgence,
    unites,
    urgenceIncluse,
    nature,
    delaiJ: delaiEffectif,
    confirmationAuPlusTard: confirmation,
    livraisonAuPlusTot: livraison,
    livraisonUrgente,
    parutionTenable,
    horsForfait,
    coutHorsForfait: horsForfait * OFFRE.uniteSup
  };
};
var accordNecessaire = (est, auteur, engageCeMoisParAuteur) => {
  if (est.horsForfait > 0) return { requis: true, motif: `${est.horsForfait} unit\xE9${est.horsForfait > 1 ? "s" : ""} hors forfait` };
  if (auteur.role === "contributeur") {
    const plafond = auteur.plafondMensuel ?? 0;
    if (engageCeMoisParAuteur + est.unites > plafond) return { requis: true, motif: "Demande d\xE9pos\xE9e par un contributeur au-del\xE0 de son plafond" };
  }
  return { requis: false, motif: null };
};

// supabase/functions/_partage/regles/charge.ts
var ACTIFS = ["confirmee", "production", "correction", "attente_client"];
var lundi = (s) => {
  const x = /* @__PURE__ */ new Date(s + "T00:00:00Z");
  return ajouterJours(s, -((x.getUTCDay() + 6) % 7));
};
var chargeSemaine = (ds, debutSemaine, sauf) => {
  const fin = ajouterJours(debutSemaine, 6);
  return ds.filter((d2) => d2.id !== sauf && ACTIFS.includes(d2.statut) && d2.livraison && d2.livraison >= debutSemaine && d2.livraison <= fin).reduce((s, d2) => s + (d2.unites ?? 0), 0);
};
var semaines = (ds, depuis, n, capacite, fermetures = []) => Array.from({ length: n }, (_, i) => {
  const debut = ajouterJours(lundi(depuis), 7 * i);
  let ouvres = 0;
  for (let k = 0; k < 5; k++) if (estOuvre(ajouterJours(debut, k), fermetures)) ouvres++;
  return { debut, charge: chargeSemaine(ds, debut), capacite: Math.round(capacite * ouvres / 5), ouvres };
});
var verifierCapacite = (ds, demandeId, unites, livraison, capacite, fermetures = []) => {
  const [s] = semaines(ds.filter((d2) => d2.id !== demandeId), livraison, 1, capacite, fermetures);
  const apres = s.charge + unites;
  if (apres <= s.capacite) return { charge: s.charge, apres, capacite: s.capacite, tient: true, premiereDate: null };
  let premiereDate = null;
  for (let i = 1; i <= 8 && !premiereDate; i++) {
    const deb = ajouterJours(lundi(livraison), 7 * i);
    const [t] = semaines(ds.filter((d2) => d2.id !== demandeId), deb, 1, capacite, fermetures);
    if (t.charge + unites <= t.capacite) {
      let j2 = deb;
      while (!estOuvre(j2, fermetures)) j2 = ajouterJours(j2, 1);
      premiereDate = j2;
    }
  }
  return { charge: s.charge, apres, capacite: s.capacite, tient: false, premiereDate };
};

// supabase/functions/_partage/regles/pilote.ts
var decider = (d2, c) => {
  if (d2.statut !== "deposee") return { auto: false, raison: "Demande d\xE9j\xE0 trait\xE9e" };
  if (c.organisation.statut !== "active") return { auto: false, raison: "Premi\xE8res unit\xE9s pas encore cr\xE9dit\xE9es" };
  if (!c.estimation.ok) return { auto: false, raison: c.estimation.erreur ?? "Estimation impossible" };
  if (c.estimation.nature === "planifie" || c.estimation.delaiJ === null) return { auto: false, raison: "Reportage ou bulletin : la date se fixe avec le client" };
  if (d2.brief.trim().length < 20) return { auto: false, raison: "Brief trop court pour lancer la production" };
  const livraison = ajouterOuvres(c.auj, c.estimation.delaiJ, c.fermetures ?? []);
  if (d2.parution && livraison > d2.parution) return { auto: false, raison: "Parution trop proche pour le d\xE9lai de la formule" };
  const cap = verifierCapacite(c.demandes, d2.id, c.estimation.unites, livraison, c.capacite, c.fermetures ?? []);
  if (!cap.tient) return { auto: false, raison: `Semaine pleine (${cap.apres} unit\xE9s sur ${cap.capacite})`, dateProposee: cap.premiereDate };
  const acc = accordNecessaire({ unites: c.estimation.unites, horsForfait: c.estimation.horsForfait }, c.auteur, c.engageAuteur);
  return { auto: true, livraison, accord: acc.motif };
};
var DELAI_RELANCE = 2;
var aRelancer = (d2, auj, fermetures = []) => {
  if (d2.statut !== "a_valider" && d2.statut !== "attente_client") return false;
  const depuis = d2.historique.findLast((h) => h.statut === d2.statut && h.type !== "modification" && h.type !== "relance");
  if (!depuis) return false;
  if (d2.historique.some((h) => h.type === "relance" && h.date >= depuis.date)) return false;
  return ouvresEntre(depuis.date.slice(0, 10), auj, fermetures) >= DELAI_RELANCE;
};

// supabase/functions/_partage/regles/registre.ts
var etatPeriode = (lignes, organisationId, periode) => {
  let quota = 0, report = 0, ajustements = 0, reserve = 0, consomme = 0;
  for (const l of lignes) {
    if (l.organisationId !== organisationId || l.periode !== periode) continue;
    if (l.type === "credit") quota += l.unites;
    else if (l.type === "report") report += l.unites;
    else if (l.type === "ajustement") ajustements += l.unites;
    else if (l.type === "debit") {
      if (l.etat === "reserve") reserve += l.unites;
      else if (l.etat === "consomme") consomme += l.unites;
    }
  }
  const total = quota + report + ajustements;
  const engage = reserve + consomme;
  return {
    periode,
    quota,
    report,
    ajustements,
    reserve,
    consomme,
    engage,
    total,
    disponible: total - engage,
    reportRestant: Math.max(0, report - engage)
  };
};

// supabase/functions/pilote/index.ts
Deno.serve(async (req) => {
  const cle = CLE_SECRETE;
  const url = Deno.env.get("SUPABASE_URL");
  const sb = createClient(url, cle);
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const autorise = Boolean(cle) && jeton.length >= 32 && (jeton === cle || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  if (!autorise) return new Response("R\xE9serv\xE9 au serveur", { status: 401 });
  const notifier = (corps) => fetch(`${url}/functions/v1/notifier`, { method: "POST", headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" }, body: JSON.stringify(corps) }).catch(() => null);
  const auj = (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const per = periodeDe(auj);
  const periodes = /* @__PURE__ */ new Map();
  const periodeOrg = async (id) => {
    if (!periodes.has(id)) {
      const { data: p, error } = await sb.rpc("periode_org", { org: id, j: auj });
      const periode = !error && p ? p : per;
      const [{ data: debut }, { data: fin }] = await Promise.all([
        sb.rpc("debut_periode_org", { org: id, per: periode }),
        sb.rpc("fin_periode_org", { org: id, per: periode })
      ]);
      periodes.set(id, { periode, debut: debut ?? `${periode}-01`, fin: fin ?? ajouterJours(`${periodeDe(ajouterJours(`${periode}-01`, 32))}-01`, -1) });
    }
    return periodes.get(id);
  };
  const [{ data: param }, { data: orgs }, { data: ds }, { data: lignes }, { data: hist }, { data: reg }, { data: profils }, { data: fer }] = await Promise.all([
    sb.from("parametre").select("*").single(),
    sb.from("organisation").select("*"),
    sb.from("demande").select("*").not("statut", "in", "(livree,annulee)"),
    sb.from("demande_ligne").select("demande_id, prestation, quantite"),
    sb.from("historique").select("demande_id, statut, type, date, par"),
    sb.from("registre").select("*").in("periode", [periodeDe(ajouterJours(`${per}-01`, -1)), per]),
    sb.from("profil").select("id, role, plafond_mensuel"),
    sb.from("fermeture").select("debut, fin")
  ]);
  const fermetures = fer ?? [];
  const organisations = (orgs ?? []).map((o2) => ({ id: o2.id, nom: o2.nom, type: o2.type, formule: o2.formule, debut: o2.debut, engagementMois: o2.engagement_mois, statut: o2.statut === "active" ? "active" : "a_activer", sansIA: o2.sans_ia }));
  const demandes = (ds ?? []).map((d2) => ({
    id: d2.id,
    numero: d2.numero,
    organisationId: d2.organisation_id,
    auteurId: d2.auteur_id,
    titre: d2.titre,
    brief: d2.brief,
    pieces: [],
    lignes: (lignes ?? []).filter((l) => l.demande_id === d2.id).map((l) => ({ prestation: l.prestation, quantite: l.quantite })),
    urgente: d2.urgente,
    parution: d2.parution,
    statut: d2.statut,
    creee: d2.creee,
    unites: d2.unites,
    unitesHorsForfait: d2.unites_hors_forfait,
    livraison: d2.livraison,
    corrections: d2.corrections,
    messages: [],
    versions: [],
    historique: (hist ?? []).filter((h) => h.demande_id === d2.id).sort((a, b) => a.date.localeCompare(b.date)).map((h) => ({ date: h.date, statut: h.statut, type: h.type, par: h.par ?? "pilote" }))
  }));
  const registre = (reg ?? []).map((l) => ({ ...l, organisationId: l.organisation_id, demandeId: l.demande_id }));
  const bilan = { confirmees: 0, a_arbitrer: 0, relances: 0, factures: 0 };
  if (param.pilote_confirmation) {
    for (const d2 of demandes.filter((x) => x.statut === "deposee")) {
      const o2 = organisations.find((x) => x.id === d2.organisationId);
      const auteur = (profils ?? []).find((p) => p.id === d2.auteurId);
      const po = await periodeOrg(o2.id);
      const urgencesUtilisees = demandes.filter((x) => x.id !== d2.id && x.organisationId === o2.id && x.urgente && x.creee.slice(0, 10) >= po.debut && x.creee.slice(0, 10) <= po.fin).length;
      const est = estimer({ lignes: d2.lignes, urgente: d2.urgente, parution: d2.parution }, { formule: o2.formule, depot: auj, urgencesUtilisees, disponibles: etatPeriode(registre, o2.id, po.periode).disponible, fermetures });
      const engageAuteur = registre.filter((l) => l.periode === po.periode && l.type === "debit" && l.etat !== "restitue" && demandes.find((x) => x.id === l.demandeId)?.auteurId === d2.auteurId).reduce((s, l) => s + l.unites, 0);
      const dec = decider(d2, { auj, organisation: o2, estimation: est, demandes, capacite: param.capacite_semaine, fermetures, auteur: { role: auteur?.role ?? "referent", plafondMensuel: auteur?.plafond_mensuel }, engageAuteur });
      if (!dec.auto) {
        bilan.a_arbitrer++;
        continue;
      }
      const { data: statut, error } = await sb.rpc("confirmer_demande", { p_demande: d2.id, p_unites: null, p_motif_ajustement: null, p_livraison: dec.livraison });
      if (error) continue;
      bilan.confirmees++;
      d2.statut = statut;
      d2.livraison = dec.livraison;
      d2.unites = est.unites;
      await notifier({ evenement: "statut", demande: d2.id });
      if (statut === "confirmee" && param.pilote_atelier && !o2.sansIA) {
        const r = await fetch(`${url}/functions/v1/atelier`, { method: "POST", headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" }, body: JSON.stringify({ demande: d2.id }) }).catch(() => null);
        if (r?.ok) await notifier({ evenement: "jet", demande: d2.id });
      }
    }
  }
  if (param.pilote_relances) {
    for (const d2 of demandes) if (aRelancer(d2, auj, fermetures)) {
      const { error } = await sb.rpc("relancer", { p_demande: d2.id });
      if (!error) {
        bilan.relances++;
        await notifier({ evenement: "statut", demande: d2.id });
      }
    }
  }
  if (param.pilote_facturation) {
    let premier = `${per}-01`;
    while (!estOuvre(premier, fermetures)) premier = ajouterJours(premier, 1);
    if (auj === premier) {
      const { data } = await sb.rpc("emettre_factures", { per: periodeDe(ajouterJours(`${per}-01`, -1)) });
      bilan.factures = data ?? 0;
    }
  }
  return new Response(JSON.stringify(bilan), { headers: { "Content-Type": "application/json" } });
});
