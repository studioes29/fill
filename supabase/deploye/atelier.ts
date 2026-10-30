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
  version: "2026-10-27",
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
      mise_en_place: 490,
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
      mise_en_place: 990,
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
          "1 vid\xE9o courte"
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
            video: 1,
            point: 2
          }
        }
      ],
      points: [
        "Demandes courantes en 1 jour ouvr\xE9",
        "Deux urgences par mois incluses",
        "Un point toutes les deux semaines"
      ],
      mise_en_place: 990,
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
      id: "video",
      cat: "creer",
      nom: "Vid\xE9o courte",
      u: 4,
      detail: "Montage de moins de 60 secondes \xE0 partir de vos images",
      max: 4,
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
  engagement_long: 12,
  mise_en_place_regle: "490 \u20AC HT pour Essentiel, 990 \u20AC HT pour R\xE9gulier et Soutenu ; offerte avec un engagement de 12 mois",
  urgence_unites: 1,
  report: "Les unit\xE9s non utilis\xE9es sont report\xE9es une fois, sur le mois suivant ; elles sont consomm\xE9es en premier",
  delais: {
    courant: "publication, actualit\xE9, agenda, visuel sur gabarit, communiqu\xE9",
    creation: "5 jours ouvr\xE9s",
    creation_liste: "affiche, flyer, newsletter, page de site, vid\xE9o",
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
  // prix HT d'une unité hors forfait
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
var prestation = (id) => CATALOGUE.find((p) => p.id === id);
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
