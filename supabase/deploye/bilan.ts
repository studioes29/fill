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

// supabase/functions/_partage/courriel.ts
var LOGO = "https://fill.studioes.fr/assets/mail/fill.png";
var P = "margin:0 0 16px;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:#4A4540";
var gabarit = (c) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${c.titre}</title></head>
<body style="margin:0;padding:0;background:#F8F5F2">
<div style="display:none;max-height:0;overflow:hidden;color:#F8F5F2">${c.aper\u00E7u ?? c.texte[0] ?? ""}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F2"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td style="padding:0 8px 22px"><a href="https://fill.studioes.fr"><img src="${LOGO}" width="88" height="46" alt="Fill" style="display:block;border:0"></a></td></tr>
    <tr><td style="background:#FFFFFF;border-radius:22px;padding:40px 36px 34px">
      <div style="width:44px;height:4px;border-radius:2px;background:#B8A4FF;margin:0 0 22px"></div>
      <h1 style="margin:0 0 18px;font:700 26px/1.2 Arial,Helvetica,sans-serif;letter-spacing:-.4px;color:#1A1A1A">${c.titre}</h1>
      ${c.texte.map((t) => `<p style="${P}">${t}</p>`).join("\n      ")}
      ${c.bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 24px"><tr><td style="border-radius:999px;background:#1A1A1A"><a href="${c.bouton.lien}" style="display:inline-block;padding:16px 30px;font:700 16px Arial,Helvetica,sans-serif;color:#F8F5F2;text-decoration:none;border-radius:999px">${c.bouton.libelle}&nbsp;&nbsp;&rarr;</a></td></tr></table>` : ""}
      ${(c.apres ?? []).map((t) => `<p style="${P};font-size:14px;color:#6B6560">${t}</p>`).join("\n      ")}
      <p style="margin:26px 0 0;font:400 16px/1.5 Arial,Helvetica,sans-serif;color:#1A1A1A">Ewen Soupault<br><span style="color:#6B6560">Fill</span></p>
    </td></tr>
    <tr><td style="padding:22px 8px 0;font:400 13px/1.6 Arial,Helvetica,sans-serif;color:#8A847D">
      Fill, la communication externalis\xE9e des collectivit\xE9s et des entreprises, est un service de Studio ES.<br>
      <a href="mailto:contact@studioes.fr" style="color:#8A847D">contact@studioes.fr</a> \xB7 06 51 22 21 07 \xB7 <a href="https://fill.studioes.fr" style="color:#8A847D">fill.studioes.fr</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

// supabase/functions/_partage/calendrier-type.json
var calendrier_type_default = {
  packs: {
    pub: {
      l: "Publication",
      p: {
        post: 1
      }
    },
    pa: {
      l: "Publication et actualit\xE9",
      p: {
        post: 1,
        actu: 1
      }
    },
    aff: {
      l: "Affiche et deux publications",
      p: {
        affiche: 1,
        post: 2
      }
    },
    news: {
      l: "Newsletter",
      p: {
        news: 1
      }
    },
    cp: {
      l: "Communiqu\xE9 et publication",
      p: {
        presse: 1,
        post: 1
      }
    },
    prog: {
      l: "Programme recto verso et publication",
      p: {
        flyer: 1,
        post: 1
      }
    },
    bul: {
      l: "Bulletin de 8 pages",
      p: {
        bulletin: 8
      }
    },
    photo: {
      l: "Reportage photo",
      p: {
        photo: 1
      }
    }
  },
  mois: {
    c: {
      "1": [
        [
          6,
          "V\u0153ux du maire",
          "aff"
        ],
        [
          20,
          "Bulletin d\u2019hiver",
          "bul"
        ],
        [
          27,
          "Recensement",
          "pa"
        ]
      ],
      "2": [
        [
          3,
          "D\xE9bat d\u2019orientation budg\xE9taire",
          "pa"
        ],
        [
          10,
          "Vacances d\u2019hiver",
          "prog"
        ],
        [
          24,
          "Travaux de printemps",
          "pa"
        ]
      ],
      "3": [
        [
          8,
          "Journ\xE9e des droits des femmes",
          "pub"
        ],
        [
          14,
          "Budget vot\xE9",
          "pa"
        ],
        [
          21,
          "Nettoyage de printemps",
          "aff"
        ]
      ],
      "4": [
        [
          1,
          "Inscriptions scolaires",
          "pa"
        ],
        [
          12,
          "Vacances de printemps",
          "prog"
        ],
        [
          25,
          "Chasse aux \u0153ufs",
          "aff"
        ]
      ],
      "5": [
        [
          8,
          "Comm\xE9moration du 8 mai",
          "pa"
        ],
        [
          16,
          "F\xEAte de la nature",
          "aff"
        ],
        [
          28,
          "Bulletin d\u2019\xE9t\xE9",
          "bul"
        ]
      ],
      "6": [
        [
          5,
          "Saison estivale",
          "pa"
        ],
        [
          21,
          "F\xEAte de la musique",
          "aff"
        ],
        [
          28,
          "Kermesses",
          "pub"
        ]
      ],
      "7": [
        [
          3,
          "Programme d\u2019\xE9t\xE9",
          "prog"
        ],
        [
          14,
          "F\xEAte nationale",
          "aff"
        ],
        [
          20,
          "March\xE9s estivaux",
          "pub"
        ]
      ],
      "8": [
        [
          5,
          "Animations d\u2019ao\xFBt",
          "pub"
        ],
        [
          20,
          "Forum des associations",
          "aff"
        ],
        [
          28,
          "Rentr\xE9e",
          "pa"
        ]
      ],
      "9": [
        [
          1,
          "Rentr\xE9e scolaire",
          "pa"
        ],
        [
          6,
          "Forum des associations",
          "aff"
        ],
        [
          20,
          "Journ\xE9es du patrimoine",
          "prog"
        ]
      ],
      "10": [
        [
          1,
          "Octobre rose",
          "pub"
        ],
        [
          6,
          "Semaine bleue",
          "prog"
        ],
        [
          18,
          "Vacances de la Toussaint",
          "prog"
        ]
      ],
      "11": [
        [
          11,
          "Comm\xE9moration du 11 novembre",
          "pa"
        ],
        [
          22,
          "Lettre de fin d\u2019ann\xE9e",
          "news"
        ],
        [
          28,
          "T\xE9l\xE9thon",
          "aff"
        ]
      ],
      "12": [
        [
          6,
          "March\xE9 de No\xEBl",
          "aff"
        ],
        [
          15,
          "Horaires des f\xEAtes",
          "pa"
        ],
        [
          22,
          "V\u0153ux du maire",
          "aff"
        ]
      ]
    },
    e: {
      "1": [
        [
          8,
          "V\u0153ux aux clients",
          "news"
        ],
        [
          15,
          "Bilan de l\u2019ann\xE9e",
          "pa"
        ],
        [
          29,
          "Recrutements de printemps",
          "pa"
        ]
      ],
      "2": [
        [
          5,
          "Salon professionnel",
          "aff"
        ],
        [
          19,
          "Portraits d\u2019\xE9quipe",
          "photo"
        ],
        [
          26,
          "Lettre clients",
          "news"
        ]
      ],
      "3": [
        [
          10,
          "Chantier de r\xE9f\xE9rence",
          "pa"
        ],
        [
          17,
          "Offres d\u2019emploi",
          "pa"
        ],
        [
          31,
          "Cl\xF4ture du trimestre",
          "pub"
        ]
      ],
      "4": [
        [
          7,
          "Nouveau produit",
          "pa"
        ],
        [
          14,
          "Portes ouvertes",
          "aff"
        ],
        [
          28,
          "Lettre clients",
          "news"
        ]
      ],
      "5": [
        [
          12,
          "Salon r\xE9gional",
          "aff"
        ],
        [
          19,
          "T\xE9moignage client",
          "pa"
        ],
        [
          26,
          "Recrutement d\u2019\xE9t\xE9",
          "pa"
        ]
      ],
      "6": [
        [
          9,
          "Anniversaire de l\u2019entreprise",
          "cp"
        ],
        [
          16,
          "Chantiers de l\u2019\xE9t\xE9",
          "pub"
        ],
        [
          30,
          "Fermeture estivale",
          "pub"
        ]
      ],
      "7": [
        [
          7,
          "Coulisses de l\u2019atelier",
          "pub"
        ],
        [
          15,
          "Fermeture estivale",
          "pub"
        ],
        [
          29,
          "Pr\xE9parer la rentr\xE9e",
          "pub"
        ]
      ],
      "8": [
        [
          26,
          "Rentr\xE9e",
          "pa"
        ],
        [
          28,
          "Offres de rentr\xE9e",
          "pa"
        ],
        [
          31,
          "Lettre de rentr\xE9e",
          "news"
        ]
      ],
      "9": [
        [
          8,
          "Rentr\xE9e commerciale",
          "pa"
        ],
        [
          16,
          "Salon de rentr\xE9e",
          "aff"
        ],
        [
          29,
          "Lettre clients",
          "news"
        ]
      ],
      "10": [
        [
          7,
          "Nouvelle r\xE9alisation",
          "photo"
        ],
        [
          14,
          "Semaine de l\u2019industrie",
          "pub"
        ],
        [
          28,
          "Recrutement",
          "pa"
        ]
      ],
      "11": [
        [
          4,
          "Retour d\u2019exp\xE9rience client",
          "pa"
        ],
        [
          18,
          "V\u0153ux de fin d\u2019ann\xE9e",
          "aff"
        ],
        [
          25,
          "Lettre clients",
          "news"
        ]
      ],
      "12": [
        [
          5,
          "Bilan de l\u2019ann\xE9e",
          "pa"
        ],
        [
          12,
          "V\u0153ux aux clients",
          "news"
        ],
        [
          19,
          "Fermeture des f\xEAtes",
          "pub"
        ]
      ]
    }
  }
};

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

// supabase/functions/_partage/offre.json
var offre_default = {
  version: "2026-11-07",
  unite_sup: 55,
  engagement_mois: 6,
  formules: [
    {
      id: "essentiel",
      nom: "Essentiel",
      prix: 490,
      unites: 10,
      delai: "2 jours ouvr\xE9s",
      delai_j: 2,
      suivi: "Point de 30 minutes chaque trimestre",
      urgences: "+1 unit\xE9 par demande urgente",
      urgences_incluses: 0,
      pour: "Petite commune, structure publique ou PME qui veut une pr\xE9sence tenue \xE0 jour, sans plus.",
      promesse: "Une communication tenue \xE0 jour, au fil de vos actualit\xE9s.",
      exemples: [
        [
          "4 publications",
          "3 actualit\xE9s",
          "1 newsletter"
        ]
      ],
      repartitions: [
        {
          nom: "Site et r\xE9seaux",
          panier: {
            post: 4,
            actu: 3,
            news: 1
          }
        },
        {
          nom: "Visuels",
          panier: {
            post: 6,
            gabarit: 2,
            presse: 1
          }
        },
        {
          nom: "\xC9v\xE9nement",
          panier: {
            affiche: 1,
            post: 3,
            actu: 2,
            gabarit: 1
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
        "<b>10 unit\xE9s</b> par mois",
        "Point de suivi <b>chaque trimestre</b>",
        "Courant <b>2 j</b> \xB7 cr\xE9ation <b>5 j</b> ouvr\xE9s"
      ]
    },
    {
      id: "regulier",
      nom: "R\xE9gulier",
      prix: 990,
      unites: 22,
      delai: "2 jours ouvr\xE9s",
      delai_j: 2,
      suivi: "Point de 30 minutes chaque mois",
      urgences: "+1 unit\xE9 par demande urgente",
      urgences_incluses: 0,
      pour: "Commune de 2 000 \xE0 8 000 habitants, PME active, office de tourisme.",
      promesse: "Une pr\xE9sence chaque semaine sur vos principaux canaux.",
      exemples: [
        [
          "8 publications sur les r\xE9seaux",
          "4 actualit\xE9s sur le site",
          "1 newsletter",
          "1 affiche en cr\xE9ation",
          "agenda du mois en ligne"
        ],
        [
          "4 pages de bulletin mises en page",
          "6 publications",
          "4 actualit\xE9s",
          "1 communiqu\xE9"
        ],
        [
          "1 demi-journ\xE9e de reportage photo",
          "6 publications",
          "3 actualit\xE9s",
          "1 newsletter"
        ]
      ],
      repartitions: [
        {
          nom: "Tous les canaux",
          panier: {
            post: 8,
            actu: 4,
            news: 1,
            affiche: 1,
            agenda: 2,
            point: 1
          }
        },
        {
          nom: "Mois du bulletin",
          panier: {
            bulletin: 4,
            post: 6,
            actu: 4,
            presse: 1,
            gabarit: 2
          }
        },
        {
          nom: "Mois photo",
          panier: {
            photo: 1,
            post: 6,
            actu: 3,
            news: 1
          }
        }
      ],
      points: [
        "Site, r\xE9seaux et newsletter",
        "Demandes courantes en 2 jours ouvr\xE9s",
        "Un point de suivi par mois"
      ],
      mise_en_place: 0,
      court: "pr\xE9sence chaque semaine",
      atouts: [
        "<b>22 unit\xE9s</b> par mois",
        "Point de suivi <b>chaque mois</b>",
        "<b>Reportage photo</b> possible"
      ]
    },
    {
      id: "soutenu",
      nom: "Soutenu",
      prix: 1890,
      unites: 45,
      delai: "1 jour ouvr\xE9",
      delai_j: 1,
      suivi: "Point toutes les deux semaines, bilan chaque semestre",
      urgences: "2 par mois incluses, puis +1 unit\xE9",
      urgences_incluses: 2,
      pour: "Commune de plus de 8 000 habitants sans service, intercommunalit\xE9, PME qui recrute ou se d\xE9veloppe.",
      promesse: "Une production soutenue : bulletin, r\xE9seaux, site et presse.",
      exemples: [
        [
          "8 pages de bulletin",
          "12 publications",
          "6 actualit\xE9s",
          "2 newsletters",
          "1 affiche en cr\xE9ation"
        ],
        [
          "1 reportage photo",
          "12 publications",
          "8 actualit\xE9s",
          "2 newsletters",
          "1 flyer",
          "agenda en ligne"
        ],
        [
          "2 reportages photo",
          "10 publications",
          "6 actualit\xE9s",
          "1 newsletter",
          "1 affiche en cr\xE9ation"
        ]
      ],
      repartitions: [
        {
          nom: "Bulletin et r\xE9seaux",
          panier: {
            bulletin: 8,
            post: 12,
            actu: 6,
            news: 2,
            affiche: 1,
            point: 1
          }
        },
        {
          nom: "Temps fort",
          panier: {
            photo: 1,
            post: 12,
            actu: 8,
            news: 2,
            flyer: 1,
            agenda: 4
          }
        },
        {
          nom: "Deux reportages",
          panier: {
            photo: 2,
            post: 10,
            actu: 6,
            news: 1,
            point: 2,
            affiche: 1
          }
        }
      ],
      points: [
        "Demandes courantes en 1 jour ouvr\xE9",
        "Deux urgences par mois incluses",
        "Un point toutes les deux semaines"
      ],
      mise_en_place: 0,
      court: "production soutenue",
      atouts: [
        "<b>45 unit\xE9s</b> par mois",
        "Courant en <b>1 jour</b> ouvr\xE9",
        "<b>2 urgences</b> incluses par mois"
      ]
    }
  ],
  relais: {
    id: "relais",
    nom: "Relais",
    prix_mois: 2490,
    unites_mois: 50,
    prix_semaine: 690,
    unites_semaine: 12,
    semaines_min: 2,
    delai_demarrage: "10 jours ouvr\xE9s",
    delai: "1 jour ouvr\xE9 pour les demandes courantes, urgences sans majoration",
    promesse: "Le poste est vide, la communication continue.",
    points: [
      "D\xE9marrage en 10 jours ouvr\xE9s",
      "Urgences sans majoration",
      "Passation compl\xE8te au retour"
    ],
    mise_en_place: 0,
    urgences: "Incluses, sans unit\xE9 suppl\xE9mentaire"
  },
  categories: [
    {
      id: "publier",
      nom: "Publier",
      it: "ce qui sort chaque semaine"
    },
    {
      id: "creer",
      nom: "Cr\xE9er",
      it: "les supports"
    },
    {
      id: "terrain",
      nom: "Terrain et suivi",
      it: "ce qui demande du temps sur place"
    }
  ],
  catalogue: [
    {
      id: "post",
      cat: "publier",
      nom: "Publication r\xE9seaux sociaux",
      u: 1,
      detail: "Texte et visuel sur gabarit, publi\xE9s sur deux r\xE9seaux",
      max: 30,
      t: "#B9B4FF",
      creation: false
    },
    {
      id: "actu",
      cat: "publier",
      nom: "Actualit\xE9 sur le site",
      u: 1,
      detail: "R\xE9daction \xE0 partir de vos \xE9l\xE9ments, image, mise en ligne",
      max: 20,
      t: "#9FDCC3",
      creation: false
    },
    {
      id: "agenda",
      cat: "publier",
      nom: "Agenda en ligne",
      u: 1,
      detail: "Trois \xE9v\xE9nements saisis sur le site ou l\u2019application",
      max: 10,
      pas: "lot de 3",
      t: "#9FDCC3",
      creation: false
    },
    {
      id: "presse",
      cat: "publier",
      nom: "Communiqu\xE9 de presse",
      u: 2,
      detail: "R\xE9daction et envoi \xE0 votre liste presse",
      max: 8,
      t: "#F6B8C4",
      creation: false
    },
    {
      id: "news",
      cat: "publier",
      nom: "Newsletter",
      u: 3,
      detail: "R\xE9daction, mise en page et envoi",
      max: 6,
      t: "#F6B8C4",
      creation: true
    },
    {
      id: "page",
      cat: "publier",
      nom: "Page du site cr\xE9\xE9e ou refaite",
      u: 3,
      detail: "Structure, textes et mise en ligne d\u2019une page",
      max: 6,
      t: "#9FDCC3",
      creation: true
    },
    {
      id: "gabarit",
      cat: "creer",
      nom: "Visuel sur gabarit",
      u: 1,
      detail: "Affiche, \xE9cran d\u2019accueil ou post d\xE9clin\xE9 d\u2019un mod\xE8le existant",
      max: 20,
      t: "#B9B4FF",
      creation: false
    },
    {
      id: "affiche",
      cat: "creer",
      nom: "Affiche en cr\xE9ation",
      u: 4,
      detail: "Cr\xE9ation originale, d\xE9clin\xE9e en format r\xE9seaux",
      max: 6,
      t: "#F5D199",
      creation: true
    },
    {
      id: "flyer",
      cat: "creer",
      nom: "Flyer ou programme recto verso",
      u: 5,
      detail: "Mise en page \xE0 partir de vos contenus, fichier pr\xEAt \xE0 imprimer",
      max: 4,
      t: "#F5D199",
      creation: true
    },
    {
      id: "bulletin",
      cat: "creer",
      nom: "Page de bulletin ou magazine",
      u: 2,
      detail: "Mise en page d\u2019une page, textes fournis. Au-del\xE0 de 12 pages par num\xE9ro : devis",
      max: 12,
      t: "#A9CCFF",
      creation: true
    },
    {
      id: "photo",
      cat: "terrain",
      nom: "Reportage photo",
      u: 10,
      detail: "Une demi-journ\xE9e \xE0 moins de 40 km, 30 photos retouch\xE9es. \xC0 partir de la formule R\xE9gulier",
      max: 3,
      t: "#D7E8A4",
      min: "regulier",
      creation: true
    },
    {
      id: "point",
      cat: "terrain",
      nom: "R\xE9union suppl\xE9mentaire",
      u: 1,
      detail: "30 minutes en visio, en plus du point pr\xE9vu",
      max: 6,
      t: "#E6E2D9",
      creation: false
    },
    {
      id: "moder",
      cat: "terrain",
      nom: "Suivi des messages et commentaires",
      u: 4,
      detail: "Deux passages par semaine, r\xE9ponses courantes",
      max: 1,
      bascule: true,
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
        agenda: 1,
        news: 0,
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
        agenda: 2,
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
        agenda: 2,
        presse: 2,
        news: 2,
        affiche: 1,
        bulletin: 4,
        point: 1
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
    courant: "publication, actualit\xE9, agenda, visuel sur gabarit, communiqu\xE9",
    creation: "5 jours ouvr\xE9s",
    creation_liste: "affiche, flyer, newsletter, page de site",
    bulletin: "R\xE9troplanning fix\xE9 ensemble, \xE9l\xE9ments \xE0 fournir trois semaines avant parution",
    photo: "Date convenue ensemble, au moins une semaine \xE0 l\u2019avance",
    courant_j: "1 \xE0 2 jours ouvr\xE9s"
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
var TYPES_CREATION = ["affiche", "flyer", "news", "page", "video"];
var TYPES_PLANIFIES = ["bulletin", "photo"];
var ABONNEMENTS = FORMULES.filter((f) => f.id !== "relais");
var ORDRE_FORMULES = ["essentiel", "regulier", "soutenu", "relais"];

// supabase/functions/_partage/regles/estimation.ts
var natureDelai = (id) => TYPES_PLANIFIES.includes(id) ? "planifie" : TYPES_CREATION.includes(id) ? "creation" : "courant";

// supabase/functions/_partage/regles/bilan.ts
var NOMBRE = 3;
var MARGE_JOURS = 14;
var DEJA_DEMANDE_JOURS = 60;
var TERMINEES = ["livree", "annulee"];
var deux = (n) => String(n).padStart(2, "0");
var valide = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && (/* @__PURE__ */ new Date(`${s}T00:00:00Z`)).toISOString().slice(0, 10) === s;
var ecartJours = (a, b) => Math.abs(Date.parse(a) - Date.parse(b)) / 864e5;
var cleTitre = (t) => String(t ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ").replace(/\s+/g, " ").trim();
var plusUnAn = (s) => {
  const [a, m, j2] = String(s).slice(0, 10).split("-").map(Number);
  return `${a + 1}-${deux(m)}-${deux(m === 2 && j2 === 29 ? 28 : j2)}`;
};
var MOIS = ["janvier", "f\xE9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\xFBt", "septembre", "octobre", "novembre", "d\xE9cembre"];
var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
var quantieme = (j2) => j2 === 1 ? "1er" : String(j2);
var jourMois = (s) => `${quantieme(+s.slice(8, 10))} ${MOIS[+s.slice(5, 7) - 1]}`;
var jourLong = (s) => `${JOURS[(/* @__PURE__ */ new Date(`${s}T00:00:00Z`)).getUTCDay()]} ${jourMois(s)}`;
var libellePeriode = (debut, fin) => `du ${jourMois(debut)}${debut.slice(0, 4) === fin.slice(0, 4) ? "" : ` ${debut.slice(0, 4)}`} au ${jourMois(fin)} ${fin.slice(0, 4)}`;
var lignesPermises = (qte, formuleId) => {
  const r = {};
  for (const [id, n] of Object.entries(qte ?? {})) {
    const p = prestation(id);
    if (!p || !(Number(n) > 0)) continue;
    if (p.min && ORDRE_FORMULES.indexOf(formuleId) < ORDRE_FORMULES.indexOf(p.min)) continue;
    r[id] = Math.min(p.max ?? 99, Math.round(Number(n)));
  }
  return r;
};
var unitesDe = (qte) => Object.entries(qte).reduce((s, [id, n]) => s + prestation(id).u * n, 0);
var libelleLignes = (qte) => Object.entries(qte).map(([id, n]) => n > 1 ? `${prestation(id).nom} \xD7 ${n}` : prestation(id).nom).join(", ");
var ouvresNecessaires = (qte, formuleId) => {
  const ids = Object.keys(qte);
  if (ids.includes("bulletin")) return 15;
  if (ids.some((id) => natureDelai(id) === "planifie")) return 5;
  return (ids.some((id) => natureDelai(id) === "creation") ? OFFRE.delaiCreationJ : formule(formuleId).delai_j) + 1;
};
var limiteDepot = (parution, ouvres, fermetures = []) => {
  let x = parution, n = 0;
  for (let i = 0; i < 400; i++) {
    if (n >= ouvres && estOuvre(x, fermetures)) return x;
    if (estOuvre(x, fermetures)) n++;
    x = ajouterJours(x, -1);
  }
  return null;
};
var suggerer = ({ organisation, jour, suivante, demandes = [], fermetures = [], calendrierType = calendrier_type_default, nombre = NOMBRE }) => {
  if (!organisation || !suivante || !ORDRE_FORMULES.includes(organisation.formule)) return [];
  let budget = Math.max(0, Math.floor(Number(suivante.disponible) || 0));
  if (budget < 1) return [];
  const debut = suivante.debut > jour ? suivante.debut : jour;
  const fin = ajouterJours(suivante.fin, MARGE_JOURS);
  const actives = demandes.filter((d2) => d2.statut !== "annulee");
  const repere = (d2) => d2.parution ?? String(d2.creee ?? "").slice(0, 10);
  const deja = (titre, date, sauf) => actives.some((d2) => d2 !== sauf && cleTitre(d2.titre) === cleTitre(titre) && (!TERMINEES.includes(d2.statut) || valide(repere(d2)) && ecartJours(repere(d2), date) <= DEJA_DEMANDE_JOURS));
  const candidats = [];
  const ajouter = (c, qteBrute) => {
    const qte = lignesPermises(qteBrute, organisation.formule);
    if (!Object.keys(qte).length) return;
    let limite = null;
    if (c.date) {
      limite = limiteDepot(c.date, ouvresNecessaires(qte, organisation.formule), fermetures);
      if (!limite || limite < jour) return;
    }
    candidats.push({ ...c, qte, libelle: c.libelle && Object.keys(qte).length === Object.keys(qteBrute).length ? c.libelle : libelleLignes(qte), unites: unitesDe(qte), limite });
  };
  const anciennes = actives.map((d2) => ({ d: d2, an: valide(repere(d2)) ? plusUnAn(repere(d2)) : null })).filter((x) => x.an && x.an >= suivante.debut && x.an <= fin).sort((a, b) => a.an.localeCompare(b.an));
  for (const { d: d2, an } of anciennes) {
    if (deja(d2.titre, an, d2) || candidats.some((c) => cleTitre(c.titre) === cleTitre(d2.titre))) continue;
    const date = d2.parution ? plusUnAn(d2.parution) : null;
    ajouter(
      {
        cle: `h-${d2.id}`,
        source: "historique",
        titre: d2.titre,
        date,
        pourquoi: d2.parution ? `Vous l\u2019aviez demand\xE9 l\u2019an pass\xE9, pour le ${jourMois(d2.parution)}.` : "Vous l\u2019aviez demand\xE9 l\u2019an pass\xE9 \xE0 la m\xEAme p\xE9riode."
      },
      Object.fromEntries((d2.lignes ?? []).map((l) => [l.prestation, l.quantite]))
    );
  }
  const mois = calendrierType.mois[organisation.type === "entreprise" ? "e" : "c"];
  const [a0, m0] = debut.split("-").map(Number);
  for (let k = 0; k < 4; k++) {
    const m = (m0 - 1 + k) % 12 + 1, a = a0 + Math.floor((m0 - 1 + k) / 12);
    for (const [j2, titre, pack] of mois[m] ?? []) {
      const date = `${a}-${deux(m)}-${deux(j2)}`;
      if (!valide(date) || date < debut || date > fin) continue;
      if (deja(titre, date) || candidats.some((c) => cleTitre(c.titre) === cleTitre(titre))) continue;
      const p = calendrierType.packs[pack];
      ajouter({ cle: `c-${date}-${pack}`, source: "calendrier", titre, date, libelle: p.l, pourquoi: `Rep\xE8re du calendrier type : autour du ${jourMois(date)}.` }, p.p);
    }
  }
  const choisies = [];
  for (const c of candidats) {
    if (choisies.length >= nombre) break;
    if (c.unites > budget) continue;
    choisies.push(c);
    budget -= c.unites;
  }
  return choisies;
};
var plageOuverte = (instant = /* @__PURE__ */ new Date()) => {
  const p = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris", dateStyle: "short", timeStyle: "short" }).format(instant);
  const heure = +p.slice(11, 13);
  return estOuvre(p.slice(0, 10)) && heure >= 8 && heure < 20;
};
var base = (site) => String(site).replace(/\/$/, "");
var lienBilan = (site, jeton) => `${base(site)}/bilan/#j=${jeton}`;
var lienLancer = (site, s) => `${base(site)}/#nouvelle?titre=${encodeURIComponent(s.titre)}${s.date ? `&parution=${s.date}` : ""}&qte=${Object.entries(s.qte ?? {}).map(([id, n]) => `${id}:${n}`).join(",")}`;
var echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var pluriel = (n, mot) => `${mot}${n >= 2 ? "s" : ""}`;
var unites = (n) => `${n} ${pluriel(n, "unit\xE9")}`;
var troisChiffres = (d2) => [
  { valeur: String(d2.demandes_livrees), libelle: d2.demandes_livrees > 1 ? "demandes livr\xE9es" : "demande livr\xE9e" },
  { valeur: String(d2.unites.utilisees), libelle: `${pluriel(d2.unites.utilisees, "unit\xE9")} ${pluriel(d2.unites.utilisees, "utilis\xE9e")} sur ${d2.unites.total}` },
  d2.delais.total > 0 ? { valeur: `${d2.delais.a_la_date} sur ${d2.delais.total}`, libelle: d2.delais.total > 1 ? "livr\xE9es \xE0 la date annonc\xE9e" : "livr\xE9e \xE0 la date annonc\xE9e" } : { valeur: String(d2.unites.reportees), libelle: `${pluriel(d2.unites.reportees, "unit\xE9")} ${pluriel(d2.unites.reportees, "report\xE9e")} sur la p\xE9riode suivante` }
];
var CHIFFRE = "font:700 24px/1.5 Arial,Helvetica,sans-serif;color:#1A1A1A";
var NORMAL = "font-size:16px;color:#4A4540";
var mailMensuel = ({ donnees: d2, lien, site }) => {
  const periode = libellePeriode(d2.debut, d2.fin);
  const sug = d2.suggestions ?? [], s = d2.suivante;
  const apres = [];
  const report = s && s.report > 0 ? `, dont ${s.report} ${pluriel(s.report, "report\xE9e")} \xE0 utiliser avant le ${jourMois(s.fin)}` : "";
  const attente = s && s.creditee === false ? " Les unit\xE9s de votre formule s\u2019y ajoutent d\xE8s le r\xE8glement de la p\xE9riode." : "";
  if (sug.length) {
    apres.push(
      `<span style="${NORMAL}"><b style="color:#1A1A1A">Pour la p\xE9riode qui commence</b>, ${sug.length > 1 ? `${sug.length} sujets tiennent` : "un sujet tient"} dans ${s.disponible >= 2 ? `vos ${s.disponible} unit\xE9s disponibles` : "votre unit\xE9 disponible"}${report}.${attente}</span>`
    );
    for (const x of sug)
      apres.push(
        `<span style="${NORMAL}"><b style="color:#1A1A1A">${echap(x.titre)}</b> \xB7 ${unites(x.unites)}<br>${echap(x.libelle)}. ${echap(x.pourquoi ?? "")}${x.limite ? ` \xC0 d\xE9poser au plus tard le ${jourLong(x.limite)}.` : ""}<br><a href="${echap(lienLancer(site, x))}" style="color:#5B3F9C;font-weight:700">Lancer cette demande</a></span>`
      );
    apres.push("\xAB Lancer \xBB ouvre la demande d\xE9j\xE0 remplie dans votre espace. Rien n\u2019est engag\xE9 tant qu\u2019elle n\u2019est pas envoy\xE9e.");
  } else if (s && s.disponible > 0) {
    apres.push(`<span style="${NORMAL}">Pour la p\xE9riode qui commence, vous disposez de ${unites(s.disponible)}${report}.${attente}</span>`);
  }
  apres.push("Le bilan s\u2019ouvre sans compte ni mot de passe&nbsp;: ce lien se transmet tel quel.");
  return {
    sujet: `Votre mois avec Fill : ${periode}`,
    titre: "Votre mois avec Fill",
    aper\u00E7u: `${echap(d2.organisation.nom)}, ${periode}.`,
    texte: [
      `${echap(d2.organisation.nom)}, ${periode}.`,
      troisChiffres(d2).map((c) => `<span style="${CHIFFRE}">${echap(c.valeur)}</span>&nbsp; ${echap(c.libelle)}`).join("<br>")
    ],
    bouton: { libelle: "Voir le bilan", lien },
    apres
  };
};
var mailBloque = ({ organisation, periode, id, a, confirme = false }) => ({
  sujet: `Bilan \xE0 v\xE9rifier : ${organisation}`,
  titre: `Envoi du bilan \xE0 v\xE9rifier : ${echap(organisation)}`,
  texte: [
    confirme ? `Le mail mensuel de la p\xE9riode ${periode} est parti \xE0 ${echap(a)}, mais son envoi n\u2019a pas pu \xEAtre enregistr\xE9 : tant qu\u2019il ne l\u2019est pas, le lien du bilan ne s\u2019ouvre pas chez votre client.` : `Le mail mensuel de la p\xE9riode ${periode} est parti vers le service d\u2019envoi sans r\xE9ponse claire. Pour ne jamais l\u2019envoyer deux fois, il n\u2019est pas retent\xE9.`,
    confirme ? `Hors-champ vous propose de l\u2019enregistrer d\u2019un geste. \xC0 d\xE9faut : <code>select bilan_confirmer_envoi('${id}', '${echap(a)}');</code>` : `V\xE9rifiez dans le journal du service d\u2019envoi s\u2019il est arriv\xE9 \xE0 ${echap(a)}, puis r\xE9pondez dans Hors-champ : \xAB Il est arriv\xE9 \xBB ou \xAB Le renvoyer \xBB. \xC0 d\xE9faut : <code>select bilan_confirmer_envoi('${id}', '${echap(a)}');</code> s\u2019il est arriv\xE9, <code>select bilan_liberer_envoi('${id}');</code> sinon.`
  ],
  bouton: null
});
var mailAnomalies = (lignes) => ({
  sujet: `Mail mensuel : ${lignes.length} ${pluriel(lignes.length, "point")} \xE0 v\xE9rifier`,
  titre: "Mail mensuel : \xE0 v\xE9rifier",
  texte: [...lignes.map(echap), "Un nouvel essai a lieu \xE0 chaque passage. Ce message revient tant qu\u2019un point reste \xE0 corriger."],
  bouton: null
});

// supabase/functions/_partage/regles/relecture.ts
var JETON = /^[A-Za-z0-9_-]{43}$/;
var b64url = (octets) => btoa(String.fromCharCode(...octets)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
var nouveauJeton = () => b64url(crypto.getRandomValues(new Uint8Array(32)));
var empreinte = async (jeton) => {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(jeton)));
  return [...new Uint8Array(h)].map((o2) => o2.toString(16).padStart(2, "0")).join("");
};

// supabase/functions/bilan/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var json = (corps, status = 200) => new Response(JSON.stringify(corps), { status, headers: { ...cors, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
var refus = (message, status = 409) => json({ erreur: message }, status);
var motif = (e) => e?.code === "P0001" && e.message ? e.message : "Cette action n\u2019a pas pu aboutir. R\xE9essayez dans un instant.";
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return refus("M\xE9thode refus\xE9e", 405);
  let s;
  try {
    s = await req.json();
  } catch {
    return refus("Requ\xEAte illisible", 400);
  }
  const url = Deno.env.get("SUPABASE_URL");
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  const cleBrevo = Deno.env.get("BREVO_API_KEY");
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  const envoyer = async (essai, a, m) => {
    if (!cleBrevo) return "refuse";
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": cleBrevo, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
          to: a,
          replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
          subject: `${essai ? "[Test] " : ""}${m.sujet}`,
          htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres, aper\u00E7u: m.aper\u00E7u })
        })
      });
      return r.ok ? "parti" : r.status >= 400 && r.status < 500 ? "refuse" : "inconnu";
    } catch {
      return "inconnu";
    }
  };
  const aujourdhui = () => (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const envoyerBilan = async (id) => {
    const jeton2 = nouveauJeton();
    const { data: r, error } = await admin.rpc("bilan_reserver_envoi", { p_bilan: id, p_empreinte: await empreinte(jeton2), p_jour: aujourdhui() });
    if (error) return { id, etat: "erreur", detail: motif(error) };
    if (!r) return { id, etat: "sans_objet" };
    if (r.erreur) return { id, etat: r.erreur, organisation: r.organisation?.nom };
    const issue = await envoyer(r.organisation.essai, [{ email: r.referent.email, name: r.referent.nom }], mailMensuel({ donnees: r.donnees, lien: lienBilan(SITE, jeton2), site: SITE }));
    if (issue === "parti") {
      for (let essai = 0; essai < 2; essai++) {
        const { data: ok, error: errC } = await admin.rpc("bilan_confirmer_envoi", { p_bilan: id, p_a: r.referent.email });
        if (!errC && ok) return { id, etat: "envoye", organisation: r.organisation.nom, a: r.referent.nom };
      }
      await envoyer(r.organisation.essai, [{ email: pourFill }], mailBloque({ organisation: r.organisation.nom, periode: r.donnees.periode, id, a: r.referent.email, confirme: true }));
      return { id, etat: "a_confirmer", organisation: r.organisation.nom, a: r.referent.nom };
    }
    if (issue === "refuse") {
      await admin.rpc("bilan_liberer_envoi", { p_bilan: id });
      return { id, etat: "refuse", organisation: r.organisation.nom };
    }
    await envoyer(r.organisation.essai, [{ email: pourFill }], mailBloque({ organisation: r.organisation.nom, periode: r.donnees.periode, id, a: r.referent.email }));
    return { id, etat: "bloque", organisation: r.organisation.nom };
  };
  const serveur = async () => {
    const jeton2 = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
    return Boolean(CLE_SECRETE) && jeton2.length >= 32 && (jeton2 === CLE_SECRETE || (await admin.rpc("verifier_jeton_pilote", { p: jeton2 })).data === true);
  };
  if (s.action === "envoyer") {
    if (!await serveur()) return new Response("R\xE9serv\xE9 au serveur", { status: 401 });
    if (typeof s.bilan !== "string" || !/^[0-9a-f-]{36}$/.test(s.bilan)) return refus("Bilan inconnu", 400);
    if (!plageOuverte()) return json({ envoye: false, motif: "hors_plage" });
    const r = await envoyerBilan(s.bilan);
    if (r.etat === "envoye") return json({ envoye: true, a: r.a });
    const LIB = { refuse: "le service d\u2019envoi a refus\xE9 le mail (adresse du r\xE9f\xE9rent \xE0 v\xE9rifier), nouvel essai au prochain passage", sans_referent: "aucun r\xE9f\xE9rent actif : le mail ne peut pas partir", erreur: "l\u2019envoi n\u2019a pas pu \xEAtre pr\xE9par\xE9" };
    if (LIB[r.etat]) await envoyer(false, [{ email: pourFill }], mailAnomalies([`${r.organisation ?? r.id} : ${LIB[r.etat]}`]));
    return json({ envoye: false, motif: r.etat }, r.etat === "sans_objet" ? 409 : 200);
  }
  if (s.action === "quotidien") {
    if (!await serveur()) return new Response("R\xE9serv\xE9 au serveur", { status: 401 });
    const simuler = s.simuler === true;
    const jour = aujourdhui();
    const suivi = { jour, simulation: simuler, prepares: [], envois: [], en_attente: 0, bloques: [], erreurs: [] };
    if (!simuler && !plageOuverte()) return json({ ...suivi, hors_plage: true });
    const { data: candidats, error: errC } = await admin.rpc("bilan_candidats", { p_jour: jour });
    if (errC) return refus(motif(errC), 500);
    for (const c of candidats ?? []) {
      const [{ data: d2, error: errD }, { data: ctx, error: errX }] = await Promise.all([
        admin.rpc("bilan_calculer", { p_org: c.organisation, p_periode: c.periode }),
        admin.rpc("bilan_contexte", { p_org: c.organisation, p_jour: jour })
      ]);
      if (errD || errX || !d2 || !ctx) {
        suivi.erreurs.push({ organisation: d2?.organisation?.nom ?? c.organisation, detail: motif(errD ?? errX) });
        continue;
      }
      const suggestions = suggerer({ organisation: d2.organisation, jour, suivante: d2.suivante, fermetures: ctx.fermetures, demandes: ctx.demandes });
      if (simuler) {
        suivi.prepares.push({ organisation: d2.organisation.nom, periode: c.periode, donnees: { ...d2, suggestions } });
        continue;
      }
      const { data: p, error: errP } = await admin.rpc("bilan_preparer", { p_org: c.organisation, p_periode: c.periode, p_suggestions: suggestions });
      if (errP) suivi.erreurs.push({ organisation: d2.organisation.nom, detail: motif(errP) });
      else if (p.cree) suivi.prepares.push({ id: p.id, organisation: d2.organisation.nom, periode: c.periode, suggestions: suggestions.length });
    }
    const { data: file, error: errF } = await admin.rpc("bilan_a_envoyer");
    if (errF) return refus(motif(errF), 500);
    suivi.bloques = file.bloques;
    if (simuler) return json({ ...suivi, envois: file.prets, en_attente: file.en_attente });
    for (const id of file.prets) {
      const e2 = await envoyerBilan(id);
      if (e2.etat === "bloque" || e2.etat === "a_confirmer") suivi.bloques.push(id);
      suivi.envois.push(e2);
    }
    suivi.en_attente = file.en_attente;
    const LIBELLES = { refuse: "le service d\u2019envoi a refus\xE9 le mail (adresse du r\xE9f\xE9rent \xE0 v\xE9rifier)", sans_referent: "aucun r\xE9f\xE9rent actif : le mail ne peut pas partir", erreur: "l\u2019envoi n\u2019a pas pu \xEAtre pr\xE9par\xE9" };
    const anomalies = [
      ...suivi.erreurs.map((x) => `${x.organisation} : le bilan n\u2019a pas pu \xEAtre calcul\xE9 (${x.detail})`),
      ...suivi.envois.filter((x) => LIBELLES[x.etat]).map((x) => `${x.organisation ?? x.id} : ${LIBELLES[x.etat]}`)
    ];
    if (anomalies.length) await envoyer(false, [{ email: pourFill }], mailAnomalies(anomalies));
    return json(suivi);
  }
  const jeton = typeof s.r === "string" ? s.r : s.j;
  if (typeof jeton !== "string" || !JETON.test(jeton)) return json({ etat: "inconnu" }, 404);
  const e = await empreinte(jeton);
  const { data: vue, error: errVue } = await admin.rpc("bilan_lire", { p_empreinte: e });
  if (errVue) return refus(motif(errVue), 500);
  if (!vue || vue.etat === "inconnu") return json({ etat: "inconnu" }, 404);
  if (vue.etat === "ouvert" && vue.mode === "relecture" !== (typeof s.r === "string")) return json({ etat: "inconnu" }, 404);
  if (s.action === "lire") {
    if (vue.etat !== "ouvert") return json({ etat: vue.etat });
    return json({
      etat: "ouvert",
      mode: vue.mode,
      donnees: vue.donnees,
      calcule_le: vue.calcule_le,
      espace: SITE,
      ...vue.mode === "relecture" ? { referent: vue.referent?.nom ?? null, envoye_le: vue.envoye_le } : {}
    });
  }
  return refus("Action inconnue", 400);
});
