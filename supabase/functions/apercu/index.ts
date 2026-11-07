// Générateur d'aperçu de site Studio ES (formule Essentiel, sur la base du site Pierceval Tattoo).
//
// GET  ?a=<id>                 lecture d'un aperçu (page studioes.fr/apercu/voir/), 410 s'il a expiré
// POST {action:"chercher"}     fiches Google correspondant au nom et à la ville (Text Search centré sur la commune)
// POST {action:"preparer"}     visiteur de studioes.fr : génère l'aperçu dès le choix de la fiche, verrouillé (3 par connexion et par jour)
// POST {action:"debloquer"}    visiteur : donne son e-mail ; un seul essai par adresse, aperçu déverrouillé, mail, contact Brevo, alerte
// POST {action:"prospect"}     Hors-champ (jeton pilote) : aperçu pour un prospect, sans mail ; fiche Google par place_id,
//                              par recherche texte (identifiants seuls, gratuit) ou données fournies à la main
//
// Secrets : GOOGLE_PLACES_KEY (obligatoire pour Google), ANTHROPIC_API_KEY (textes, sinon gabarit), BREVO_API_KEY,
// facultatifs : APERCU_MODELE (claude-haiku-5-5), BREVO_LISTE_APERCU (identifiant de liste), ALERTE_EMAIL, EXPEDITEUR_EMAIL.
// Conditions de Google : le contenu (photos, avis, horaires) n'est gardé que 30 jours, puis effacé par l'action « purger » (cron apercu-purge).
// POST {action:"purger"}       cron (jeton pilote) : efface fichiers et données des aperçus expirés
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL")!;
const GOOGLE = Deno.env.get("GOOGLE_PLACES_KEY") ?? "";
const ANTHROPIC = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const MODELE = Deno.env.get("APERCU_MODELE") ?? "claude-haiku-5-5";
const BREVO = Deno.env.get("BREVO_API_KEY") ?? "";
const LISTE = Number(Deno.env.get("BREVO_LISTE_APERCU") ?? "") || 0;
const EXPEDITEUR = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";
const ALERTE = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
const VOIR = "https://studioes.fr/apercu/voir/?a=";
const RDV = "https://cal.com/studioes/30min";
const ORIGINES = ["https://studioes.fr", "https://www.studioes.fr"];
const MAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const sb = createClient(URL_SB, CLE, { auth: { persistSession: false } });

/* ---------- réponses ---------- */
const cors = (req: Request, tous = false) => {
  const o = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": tous ? "*" : ORIGINES.includes(o) ? o : ORIGINES[0],
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
};
const json = (req: Request, d: unknown, status = 200, tous = false) =>
  new Response(JSON.stringify(d), { status, headers: { ...cors(req, tous), "Content-Type": "application/json" } });
const str = (v: unknown, n = 400) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as Record<string, string>)[c]);
// ses règles typographiques : jamais de tiret long ni demi-cadratin
const sansTiret = (t: string) => t.replace(/\s*[—–]\s*/g, " : ").replace(/ : $/, "");
const ident = () => { const a = "abcdefghijkmnpqrstuvwxyz23456789"; const b = crypto.getRandomValues(new Uint8Array(10)); return [...b].map((x) => a[x % a.length]).join(""); };
const dateFr = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" });

/* ---------- palettes (mêmes familles que la page studioes.fr/apercu/) ---------- */
type Pal = { nom: string; fond: string; accent: string; clair: string };
const P = (nom: string, fond: string, accent: string, clair: string): Pal => ({ nom, fond, accent, clair });
const FAMILLES: [RegExp, Pal[]][] = [
  [/[ée]questre|[ée]curie|poney|cheval|chevaux|haras|ferme\b|g[iî]te|camping|chambres? d['’]h[oô]tes|randonn|kayak|cano[ëe]|\bsurf\b|\bvoile|nautique|plong[ée]e|golf|escalade|fitness|salle de sport|\bclub\b|stable|farm|campground|horse|riding|gym|sports_club|marina/i,
    [P("Prairie", "#14201a", "#d8b46a", "#efede4"), P("Lande", "#1a1d14", "#c9d37a", "#eeefe4"), P("Embrun", "#0f1d22", "#7fc8c0", "#ecf0ee")]],
  [/restau|bistro|brasserie|cr[eê]p|pizz|caf[eé]|\bbar\b|traiteur|boulang|p[aâ]tiss|cuisine|snack|burger|glac|food|\bcaves?\b|\bvins?\b|vignob|[ée]picerie|chocolat|fromag|boucher|poissonn|bakery|restaurant|cafe|meal|grocery|butcher|wine|liquor/i,
    [P("Bordeaux", "#1f0f10", "#f0875a", "#f2eadf"), P("Olive", "#161a10", "#d9c35c", "#eee9da"), P("Nuit", "#101521", "#f2a65a", "#efe9e0")]],
  [/coiff|beaut|esth[eé]t|ongl|spa\b|massage|bien-[eê]tre|barb|tatou|pierc|maquill|institut|soin|hair|beauty|nail|tattoo|barber|piercing/i,
    [P("Aubergine", "#1c0f1f", "#e68dca", "#ece6df"), P("Poudre", "#24181b", "#efb3a8", "#f4ece8"), P("Sauge", "#142019", "#b6d6b1", "#edf0e8")]],
  [/garage|m[eé]can|auto|carross|plomb|[ée]lectric|menuis|charpent|ma[cç]on|couvr|peint|carrel|serrur|chauff|b[aâ]timent|paysag|jardin|artisan|[eé]b[eé]nist|r[eé]nov|terrass|car_repair|car_dealer|plumber|electrician|roofing|painter|locksmith|contractor|carpenter/i,
    [P("Anthracite", "#141518", "#f2c14e", "#ecebe6"), P("Bleu nuit", "#0f1726", "#7fb0ff", "#e9edf2"), P("Rouille", "#1b1411", "#e07a4f", "#efe7dd")]],
  [/kin[eé]|ost[eé]o|infirm|m[eé]dec|dentist|psych|sophro|pharma|sant[eé]|v[eé]t[eé]rin|di[eé]t|orthophon|podo|naturo|th[eé]rap|cabinet|avocat|notaire|comptab|conseil|assurance|immobili|doctor|dentist|physiotherap|health|lawyer|insurance|real_estate|accounting|veterinar/i,
    [P("Marine", "#0f1a24", "#8cc7c2", "#eef1ef"), P("Ardoise", "#161a1f", "#b6a6ff", "#eceae6"), P("Forêt", "#102018", "#9fd8a8", "#ebeee6")]],
  [/fripe|boutique|magasin|librair|fleur|cadeau|d[ée]co|brocante|antiquit|mercerie|v[eê]tement|pr[eê]t-[aà]-porter|association|\bmjc\b|culture|mus[ée]e|th[ée][aâ]tre|cin[ée]ma|galerie|biblioth|m[ée]diath|[ée]cole|store|clothing|florist|book_store|museum|association_or_organization|art_gallery|library/i,
    [P("Terracotta", "#1b1512", "#e9956b", "#f2ebe2"), P("Moutarde", "#1a1710", "#e2b84a", "#f1ede2"), P("Pétrole", "#0f1c1f", "#6fc0b5", "#edf0ec")]],
];
const DEFAUT: Pal[] = [P("Encre", "#16171a", "#e0b07a", "#efece6"), P("Forêt", "#102018", "#9fd8a8", "#ebeee6"), P("Bleu nuit", "#0f1726", "#7fb0ff", "#e9edf2")];
const palettesPour = (activite: string) => (FAMILLES.find(([r]) => r.test(activite))?.[1]) ?? DEFAUT;
const hex = (c: unknown) => /^#[0-9a-f]{6}$/i.test(String(c ?? "")) ? String(c).toLowerCase() : null;

/* ---------- Google Places (API New) ---------- */
const G = "https://places.googleapis.com/v1";
// centre de la commune (API Géo de l'État, gratuite) pour centrer la recherche
async function commune(ville: string) {
  try {
    const r = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(ville)}&fields=nom,centre,population&boost=population&limit=1`);
    const c = r.ok ? (await r.json())[0] : null;
    return c?.centre?.coordinates ? { nom: c.nom as string, lat: c.centre.coordinates[1] as number, lng: c.centre.coordinates[0] as number } : null;
  } catch { return null; }
}
const distance = (a: any, b: any) => { const R = 6371, x = (b.lat - a.lat) * Math.PI / 180, y = (b.lng - a.lng) * Math.PI / 180;
  const h = Math.sin(x / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(y / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
// recherche texte (nom + ville), centrée sur la commune : bien plus juste que l'autocomplétion pour « nom + ville »
async function chercher(nom: string, ville: string) {
  const c = ville ? await commune(ville) : null;
  const corps: any = { textQuery: `${nom} ${c?.nom ?? ville}`.trim(), languageCode: "fr", regionCode: "fr", pageSize: 8 };
  if (c) corps.locationBias = { circle: { center: { latitude: c.lat, longitude: c.lng }, radius: 30000 } };
  const r = await fetch(`${G}/places:searchText`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": GOOGLE, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.businessStatus" },
    body: JSON.stringify(corps),
  });
  if (!r.ok) throw new Error(`Google ${r.status} : ${(await r.text()).slice(0, 200)}`);
  let l = ((await r.json()).places ?? []).filter((p: any) => p.businessStatus !== "CLOSED_PERMANENTLY");
  // fiches à plus de 40 km de la commune écartées quand il en reste de proches
  if (c) { const pres = l.filter((p: any) => p.location && distance(c, { lat: p.location.latitude, lng: p.location.longitude }) < 40); if (pres.length) l = pres; }
  return l.slice(0, 6).map((p: any) => ({ id: p.id, nom: p.displayName?.text ?? "", lieu: str(p.formattedAddress, 120).replace(/, France$/, "") }));
}
// recherche texte avec identifiants seuls : SKU « Text Search Essentials (IDs Only) », sans coût
async function premierePlace(q: string) {
  const r = await fetch(`${G}/places:searchText`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": GOOGLE, "X-Goog-FieldMask": "places.id" },
    body: JSON.stringify({ textQuery: q, languageCode: "fr", regionCode: "fr" }),
  });
  if (!r.ok) throw new Error(`Google ${r.status} : ${(await r.text()).slice(0, 200)}`);
  return ((await r.json()).places ?? [])[0]?.id as string | undefined;
}
const CHAMPS = "id,displayName,formattedAddress,addressComponents,location,nationalPhoneNumber,internationalPhoneNumber,regularOpeningHours,rating,userRatingCount,reviews,photos,primaryTypeDisplayName,primaryType,types,googleMapsUri,websiteUri,editorialSummary,businessStatus";
async function fiche(placeId: string, session?: string) {
  const u = new URL(`${G}/places/${encodeURIComponent(placeId)}`);
  u.searchParams.set("languageCode", "fr"); u.searchParams.set("regionCode", "fr");
  if (session) u.searchParams.set("sessionToken", session);
  const r = await fetch(u, { headers: { "X-Goog-Api-Key": GOOGLE, "X-Goog-FieldMask": CHAMPS } });
  if (!r.ok) throw new Error(`Google ${r.status} : ${(await r.text()).slice(0, 200)}`);
  return await r.json();
}
// « mardi: 10:00–12:00, 14:00–18:00 » devient « 10h à 12h, 14h à 18h » ; null si fermé
const heure = (t: string) => t.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => `${Number(h)}h${m === "00" ? "" : m}`);
function horaires(desc: string[] | undefined) {
  if (!desc || desc.length !== 7) return null;
  return desc.map((l) => {
    const v = l.slice(l.indexOf(":") + 1).trim();
    if (/ferm/i.test(v)) return null;
    if (/24\s*h/i.test(v)) return "Ouvert 24 h sur 24";
    return heure(v).replace(/\s*[–—-]\s*/g, " à ").replace(/ | /g, " ");
  });
}
const composant = (c: any[], t: string) => c?.find((x) => (x.types ?? []).includes(t))?.longText ?? "";
async function donneesGoogle(id: string, f: any, nbPhotos = 6) {
  const ac = f.addressComponents ?? [];
  const num = composant(ac, "street_number"), rue = composant(ac, "route");
  const commune = composant(ac, "locality") || composant(ac, "postal_town");
  const photos: { url: string; credit: string }[] = [];
  for (const [i, p] of (f.photos ?? []).slice(0, nbPhotos).entries()) {
    try {
      const m = await fetch(`${G}/${p.name}/media?maxWidthPx=1600&skipHttpRedirect=true&key=${GOOGLE}`);
      if (!m.ok) continue;
      const uri = (await m.json()).photoUri as string;
      const img = await fetch(uri);
      if (!img.ok) continue;
      const type = img.headers.get("content-type") ?? "image/jpeg";
      const chemin = `${id}/p${i}.${type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg"}`;
      const up = await sb.storage.from("apercus").upload(chemin, new Uint8Array(await img.arrayBuffer()), { contentType: type, upsert: true });
      if (up.error) continue;
      photos.push({ url: sb.storage.from("apercus").getPublicUrl(chemin).data.publicUrl, credit: str(p.authorAttributions?.[0]?.displayName, 80) });
    } catch { /* une photo manquante n'empêche rien */ }
  }
  const tel = str(f.internationalPhoneNumber).replace(/[^\d+]/g, "");
  return {
    nom: str(f.displayName?.text, 90),
    activite: str(f.primaryTypeDisplayName?.text, 60),
    types: [f.primaryType, ...(f.types ?? [])].filter(Boolean).slice(0, 8).join(" "),
    adresse: [num, rue].filter(Boolean).join(" ") || str(f.formattedAddress).split(",")[0],
    cp: composant(ac, "postal_code"), commune, ville: commune,
    tel, telAffiche: str(f.nationalPhoneNumber, 30),
    web: str(f.websiteUri, 300) || null, maps: str(f.googleMapsUri, 300) || null,
    lat: f.location?.latitude ?? null, lng: f.location?.longitude ?? null,
    note: f.rating ?? null, nbAvis: f.userRatingCount ?? 0,
    horaires: horaires(f.regularOpeningHours?.weekdayDescriptions),
    resume: str(f.editorialSummary?.text, 300) || null,
    statut: f.businessStatus ?? null,
    photos,
    avis: (f.reviews ?? []).filter((a: any) => (a.text?.text ?? a.originalText?.text) && (a.rating ?? 0) >= 4).slice(0, 5)
      .map((a: any) => ({ auteur: str(a.authorAttribution?.displayName, 60), note: a.rating, texte: str(a.text?.text ?? a.originalText?.text, 700), quand: str(a.relativePublishTimeDescription, 40) })),
  };
}

/* ---------- site existant : titre, description et début du texte, pour confirmer l'activité ---------- */
// couleurs par défaut des thèmes (WordPress, Bootstrap, Wix…) : ce n'est pas la charte de l'établissement
const THEMES = new Set(["#0073aa", "#2271b1", "#1e73be", "#007bff", "#0d6efd", "#337ab7", "#428bca", "#116dff", "#3858e9", "#0693e3", "#00a0d2", "#0066cc", "#1a73e8", "#4285f4", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]);
const saturee = (c: string) => { const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255); const mx = Math.max(...v), mn = Math.min(...v); return mx - mn >= 0.18 && mx > 0.2 && mn < 0.92; };
const hex6 = (c: string) => { c = c.toLowerCase(); return c.length === 4 ? "#" + [...c.slice(1)].map((x) => x + x).join("") : c.slice(0, 7); };
async function charger(url: string, ms = 4000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { "User-Agent": "Mozilla/5.0 (apercu Studio ES)" }, redirect: "follow" });
    return r.ok ? { r, url: r.url || url } : null;
  } catch { return null; } finally { clearTimeout(t); }
}
async function siteWeb(url: string | null) {
  const vide = { texte: "", logo: null as string | null, couleur: null as string | null };
  if (!url) return vide;
  try {
    const p = await charger(url);
    if (!p || !(p.r.headers.get("content-type") ?? "").includes("html")) return vide;
    const h = (await p.r.text()).slice(0, 300_000), base = p.url;
    const abs = (u: string) => { try { return new URL(u.replace(/&amp;/g, "&"), base).href; } catch { return null; } };
    const m = (re: RegExp) => (re.exec(h)?.[1] ?? "").replace(/<[^>]+>/g, " ");
    const corps = h.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&");
    const texte = [m(/<title[^>]*>([\s\S]*?)<\/title>/i), m(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i), m(/<h1[^>]*>([\s\S]*?)<\/h1>/i), str(corps, 900)]
      .map((x) => str(x, 900)).filter(Boolean).join(" | ").slice(0, 1400);
    // logo : image dont l'adresse, la classe, l'identifiant ou le texte alternatif parle de logo, dans le haut de la page
    let logo: string | null = null;
    for (const t of h.slice(0, 120_000).match(/<img\b[^>]*>/gi) ?? []) {
      if (!/logo/i.test(t)) continue;
      const src = /\b(?:data-src|data-lazy-src|src)=["']([^"']+)["']/i.exec(t)?.[1];
      if (src && !/^data:/i.test(src) && !/(facebook|instagram|google|tripadvisor|pagesjaunes|qualirepar|label|partenaire|sponsor)/i.test(src)) { logo = abs(src); break; }
    }
    // couleur : déclarée (theme-color, variables primary/brand/accent), sinon la plus fréquente des feuilles de style
    let couleur = hex(hex6(m(/<meta[^>]+name=["']theme-color["'][^>]+content=["'](#[0-9a-f]{3,6})/i) || "x"));
    let css = (h.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) ?? []).join(" ") + " " + (h.match(/style=["'][^"']*["']/gi) ?? []).join(" ");
    for (const l of (h.match(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi) ?? []).slice(0, 3)) {
      const u = /href=["']([^"']+)["']/i.exec(l)?.[1]; const a = u && abs(u);
      if (!a || /fonts\.googleapis|font-awesome|fontawesome|bootstrap(\.min)?\.css|wp-block-library|dashicons|elementor\/assets\/lib/i.test(a)) continue;
      const q = await charger(a, 3000); if (q) css += " " + (await q.r.text()).slice(0, 400_000);
    }
    if (!couleur || !saturee(couleur)) {
      const v = /--(?:[\w-]*?(?:primary|brand|accent|main|principal|couleur-1|color-1))[\w-]*\s*:\s*(#[0-9a-f]{6}|#[0-9a-f]{3})\b/i.exec(css)?.[1];
      couleur = v && saturee(hex6(v)) && !THEMES.has(hex6(v)) ? hex6(v) : null;
    }
    if (!couleur) {
      const n = new Map<string, number>();
      for (const c of css.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) ?? []) { const x = hex6(c); if (saturee(x) && !THEMES.has(x)) n.set(x, (n.get(x) ?? 0) + 1); }
      const top = [...n.entries()].sort((a, b) => b[1] - a[1])[0];
      couleur = top && top[1] >= 4 ? top[0] : null;
    }
    return { texte, logo, couleur };
  } catch { return vide; }
}
// logo du site actuel copié chez nous (la page d'aperçu n'affiche que des images hébergées par Studio ES ou Google)
async function logoSite(id: string, url: string | null) {
  if (!url) return null;
  try {
    const p = await charger(url, 4000); if (!p) return null;
    const type = (p.r.headers.get("content-type") ?? "").split(";")[0].trim();
    const ext = ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg", "image/gif": "gif" } as Record<string, string>)[type];
    const b = new Uint8Array(await p.r.arrayBuffer());
    if (!ext || b.length < 400 || b.length > 1_500_000) return null;
    const chemin = `${id}/logo-site.${ext}`;
    const up = await sb.storage.from("apercus").upload(chemin, b, { contentType: type, upsert: true });
    return up.error ? null : sb.storage.from("apercus").getPublicUrl(chemin).data.publicUrl;
  } catch { return null; }
}

/* ---------- textes : Claude cadré par le gabarit, sinon le gabarit seul ---------- */
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
function gabarit(S: any, activite: string) {
  const a = cap(str(activite || S.activite || "Votre activité", 40).toLowerCase());
  const mots = a.split(/\s+/);
  const ville = S.ville || S.commune || "";
  return {
    h1: mots.length > 2 ? [mots.slice(0, Math.ceil(mots.length / 2)).join(" "), mots.slice(Math.ceil(mots.length / 2)).join(" "), ville ? "à " + ville : ""] : [a, "", ville ? "à " + ville : "au quotidien"],
    sous: `${S.nom}${ville ? ", à " + ville : ""}. Horaires, accès et contact : tout est sur cette page.`,
    ruban: [a, ville, S.nom, "Sur place", "Contact direct", "Avis clients"].filter(Boolean),
    servicesTitre: ["Ce que nous", "faisons pour vous"],
    services: [
      { titre: "Notre", it: "savoir-faire", tag: S.horaires ? "Horaires sur cette page" : "", texte: `${a}${ville ? " à " + ville : ""} : présentation de l’activité et des prestations proposées.`, cta: "Nous contacter" },
      { titre: "Nous", it: "rendre visite", tag: S.adresse ? str(S.adresse, 30) : "", texte: "L’adresse, les horaires et l’itinéraire, pour venir sans chercher.", cta: "Voir l’accès" },
    ],
    galerieTitre: ["Quelques", "images"],
    presentation: { titre: [S.nom, ville ? "à " + ville : ""], legende: ville ? ville : "", sous: Number(S.note) >= 4 && Number(S.nbAvis) >= 5 ? [`d’après ${S.nbAvis} avis Google,`, "la parole des clients."] : ["", ""], faits: [
      { t: "Adresse", d: [S.adresse, S.cp, S.commune].filter(Boolean).join(" ") || "À préciser" },
      { t: "Contact", d: S.telAffiche ? `Par téléphone au ${S.telAffiche}, ou par le formulaire.` : "Par le formulaire de cette page." },
      { t: "Avis", d: S.nbAvis ? `${S.nbAvis} avis publiés sur Google.` : "Les avis Google s’afficheront ici." },
    ] },
    cta: S.tel ? "Nous appeler" : "Nous écrire",
    appel: ["Passer", "nous voir"],
  };
}
const CONSIGNES = `Tu rédiges les textes d'une page d'accueil de site vitrine (une seule page) pour un commerce, un artisan ou une association, à partir de sa fiche Google.
Studio ES présentera cette page au gérant comme aperçu de son futur site : elle doit sonner juste, comme écrite par une agence soigneuse.
Règles impératives :
- français soigné, ton humain, sobre, descriptif et concret ; aucun superlatif ni formule publicitaire (interdits : meilleur, incontournable, exceptionnel, unique, passionné, savoir-faire inégalé, qualité irréprochable, n'attendez plus, découvrez) ;
- n'invente RIEN : aucun prix, aucune date, aucune année de création, aucune durée d'expérience, aucun diplôme, aucun prénom, aucun produit ou service absent de l'activité ou des avis ; en cas de doute, reste général ;
- appuie-toi sur ce que les avis disent vraiment (accueil, conseils, rapidité, propreté…), sans citer les clients ;
- le texte parle au nom de l'établissement, jamais comme un compte rendu d'avis : interdit d'écrire « les avis mentionnent / soulignent », « les clients décrivent / apprécient », « reviennent dans les avis », « est apprécié », « selon les avis ». Ce que plusieurs avis confirment s'écrit comme un fait de la maison (« Nous prenons le temps d'expliquer », « Les vêtements sont classés par tailles »). Seule exception : la seconde partie de presentation.sous, déjà introduite par « d'après N avis Google » ;
- les boutons mènent seulement à ce que la page permet : appeler, écrire, prendre rendez-vous, demander un devis, réserver, venir sur place. Jamais « voir le planning », « voir nos offres », « nos tarifs », « la carte », « le menu », « le catalogue », « la boutique » : ces pages n'existent pas ;
- les trois « faits » de la présentation sont des informations pratiques utiles au visiteur (horaires, accès et stationnement si connus, public accueilli, sur rendez-vous ou sans, zone d'intervention, contact), jamais un résumé des avis ;
- s'il n'y a pas d'avis, reste strictement factuel (activité, lieu, horaires, contact) : n'affirme rien sur la fabrication, les produits, la méthode ou le service rendu ;
- typographie française : espaces avant « : ; ? ! », apostrophe ’, guillemets « » ; jamais de tiret long ni demi-cadratin ;
- vouvoiement du visiteur, « nous » pour l'établissement ;
- l'activité réelle d'abord : la catégorie Google est souvent vague (« Magasin », « Association ou organisation ») et les avis peuvent porter sur autre chose (un point relais, une friperie dans une MJC). Si le site actuel ne suffit pas à la confirmer, fais une ou deux recherches web courtes (nom et ville) pour savoir ce que fait vraiment l'établissement. Ces recherches servent à identifier l'activité et les services, jamais à ajouter des faits non vérifiables.
Ta réponse finale est uniquement un objet JSON, sans autre texte.`;
const SCHEMA = `{
 "h1": [ligne 1 en gras (14 signes max), ligne 2 en gras (14 signes max, peut commencer par « & »), ligne 3 en italique (16 signes max, souvent « à <ville> »)] : les trois lignes disent l'activité principale (celle du champ « activite », jamais un service secondaire) et le lieu, comme « Tatouage / & piercing / à Scaër » ou « Boulangerie / au levain / à Quimperlé »,
 "sous": phrase d'introduction sous le titre (150 signes max),
 "ruban": 6 mots ou expressions courtes (20 signes max chacun) pour un bandeau défilant : activité, ville, points forts tirés des avis,
 "servicesTitre": [début en gras, fin en italique] titre de la section des deux services (25 signes max au total), par exemple ["Deux métiers,", "un seul studio"],
 "services": exactement 2 objets, les deux services principaux de l'activité réelle { "titre": article ou mot court en gras ("Le", "La", "Nos"), "it": mot ou deux en italique (le service), "tag": précision factuelle courte (24 signes max) ou "" si rien de sûr, "texte": 150 signes max, "cta": appel à l'action court (22 signes max) },
 "galerieTitre": [gras, italique], par exemple ["Quelques", "réalisations"] ou ["En", "images"],
 "presentation": { "legende": 4 à 6 mots en italique posés sur une photo, "sous": ["d'après N avis Google,", "suite en italique (60 signes max) : ce que retiennent les clients"], "faits": exactement 3 objets { "t": un mot ou deux, "d": 110 signes max } },
 "activite": l'activité en quelques mots (30 signes max), en minuscules sauf noms propres, vérifiée par le site actuel ou la recherche web (par exemple « tatouage et piercing », « boulangerie », « garage automobile », « maison des jeunes »),
 "cta": bouton principal (22 signes max) adapté à l'activité ("Réserver une table", "Prendre rendez-vous", "Demander un devis", "Nous appeler"),
 "avis": liste des numéros des avis qui parlent vraiment de l'activité indiquée ; écarte ceux qui portent sur autre chose (par exemple un point relais colis, un autre commerce ou un autre service au même endroit) et ne t'en sers pas pour les textes,
 "couleur": couleur d'accent en hexadécimal (#rrggbb) qui évoque ce métier précis et son univers, comme un graphiste la choisirait (par exemple vert prairie ou sable pour un centre équestre, blé doré pour une boulangerie, bleu acier pour un plombier, vert feuillage pour un fleuriste, terracotta pour une friperie) ; si l'enseigne a une couleur connue (devanture, site, logo), reprends-la ; jamais un rose ou un violet sans lien avec l'activité,
 "appel": [gras, italique] titre du bloc d'accès, par exemple ["Passer au", "studio"] ou ["Venir à la", "boulangerie"]
}`;
function valide(t: any, g: any) {
  // texte trop long : coupé à la dernière virgule si possible, sinon au dernier mot, sans finir sur un mot de liaison
  const LIAISON = /\s+(et|ou|avec|de|du|des|la|le|les|un|une|à|au|aux|en|qui|que|pour|par|sur|dans|son|sa|ses|leur|leurs|d’|l’)$/i;
  const coupe = (x: string, n: number) => {
    let c = x.slice(0, n + 1).replace(/\s+\S*$/, "");
    const v = c.lastIndexOf(",");
    if (v > n * 0.5) c = c.slice(0, v);
    while (LIAISON.test(c)) c = c.replace(LIAISON, "");
    return c.replace(/[,;:\s]+$/, "");
  };
  // phrases qui commentent les avis au lieu de parler au nom de l'établissement : retirées s'il reste autre chose
  const META = /\b(les |des |nos )?(avis|clients?|visiteurs)\b[^.]*\b(mentionn|soulign|d[ée]cri|reviennent|appr[ée]ci|salu|[ée]voqu|retienn)|\b(appr[ée]ci[ée]e?s?|salu[ée]e?s?)\s*(par|dans)\s+(les\s+)?(avis|clients)|selon les avis|dans les avis|\bsont (tr[eè]s |souvent )?(appr[ée]ci|salu)/i;
  const sansMeta = (x: string, d = "") => { const ph = x.split(/(?<=[.!?])\s+/); const k = ph.filter((p) => !META.test(p)); return k.length === ph.length ? x : k.length ? k.join(" ") : (d || x); };
  const ACTION = /appel|t[ée]l[ée]phon|[ée]cri|contact|rendez-vous|\brdv\b|devis|r[ée]serv|venir|visite|passer|nous voir|itin[ée]raire|inscri|demande/i;
  const INTERDIT = /planning|offre|tarif|prix|catalogue|boutique|menu|\bcarte\b|galerie|produits|collection|programme/i;
  const action = (x: string, d: string) => x && ACTION.test(x) && !INTERDIT.test(x) ? x : d;
  const s = (v: unknown, n: number, d = "") => { const x = sansTiret(str(v, n + 200)); return x ? (x.length > n ? coupe(x, n) : x) : d; };
  const paire = (v: any, d: string[]) => Array.isArray(v) && v.length >= 2 ? [s(v[0], 30, d[0]), s(v[1], 64, d[1])] : d;
  const o: any = {};
  o.h1 = Array.isArray(t?.h1) && t.h1.length === 3 && t.h1[0] ? t.h1.map((x: unknown) => s(x, 20)) : g.h1;
  o.sous = sansMeta(s(t?.sous, 170, g.sous), g.sous);
  const ctaDef = g.cta;
  o.ruban = Array.isArray(t?.ruban) && t.ruban.length >= 4 ? t.ruban.slice(0, 7).map((x: unknown) => s(x, 24)).filter(Boolean) : g.ruban;
  o.servicesTitre = paire(t?.servicesTitre, g.servicesTitre);
  o.services = Array.isArray(t?.services) && t.services.length >= 2 ? t.services.slice(0, 2).map((x: any, i: number) => ({
    titre: s(x?.titre, 12, g.services[i].titre), it: s(x?.it, 26, g.services[i].it), tag: s(x?.tag, 28), texte: sansMeta(s(x?.texte, 170, g.services[i].texte), g.services[i].texte), cta: action(s(x?.cta, 24), ctaDef),
  })) : g.services;
  o.galerieTitre = paire(t?.galerieTitre, g.galerieTitre);
  const p = t?.presentation ?? {};
  o.presentation = {
    legende: s(p.legende, 50, g.presentation.legende),
    sous: paire(p.sous, g.presentation.sous),
    faits: Array.isArray(p.faits) && p.faits.length >= 3 ? p.faits.slice(0, 3).map((f: any, i: number) => ({ t: s(f?.t, 18, g.presentation.faits[i].t), d: sansMeta(s(f?.d, 130, g.presentation.faits[i].d), g.presentation.faits[i].d) })) : g.presentation.faits,
  };
  o.cta = action(s(t?.cta, 24), g.cta);
  o.appel = paire(t?.appel, g.appel);
  return o;
}
async function rediger(S: any, activite: string) {
  const g = gabarit(S, activite);
  if (!ANTHROPIC) return { textes: g, ia: false };
  const entree = [
    `Établissement : ${S.nom}`,
    activite ? `Activité indiquée : ${activite}` : "Activité : à déduire du nom, de la catégorie et des avis",
    (S.categorie ?? S.activite) ? `Catégorie Google : ${S.categorie ?? S.activite}` : "",
    `Ville : ${S.ville || S.commune || "(inconnue)"}`,
    S.resume ? `Résumé Google : ${S.resume}` : "",
    S.web ? `Site actuel : ${S.web}` : "",
    S.extraitWeb ? `Extrait du site actuel : ${S.extraitWeb}` : "",
    S.note ? `Note : ${S.note} sur 5, ${S.nbAvis} avis` : "Pas d'avis",
    S.horaires ? `Horaires : ${S.horaires.map((h: string | null, i: number) => ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"][i] + " " + (h ?? "fermé")).join(" ; ")}` : "",
    S.avis?.length ? `Avis (extraits, numérotés) :\n${S.avis.map((a: any, i: number) => (i + 1) + ". " + str(a.texte, 400)).join("\n")}` : "",
  ].filter(Boolean).join("\n");
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 45000);
    // recherche web courte (2 au plus) pour confirmer l'activité ; sans elle si le compte ne l'autorise pas
    const appel = (outils: boolean) => fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", signal: ctl.signal,
      headers: { "x-api-key": ANTHROPIC, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODELE, max_tokens: 16000, system: `${CONSIGNES}\n\nFormat attendu :\n${SCHEMA}`, messages: [{ role: "user", content: entree }],
        ...(outils ? { tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 2, user_location: { type: "approximate", country: "FR" } }] } : {}) }),
    });
    let r = await appel(true);
    if (!r.ok && r.status === 400) { console.error("recherche web indisponible", (await r.text()).slice(0, 200)); r = await appel(false); }
    clearTimeout(t);
    if (!r.ok) throw new Error(await r.text());
    const rep = await r.json();
    // avec la recherche web, la réponse alterne textes et recherches : le JSON est dans les derniers textes
    const textes = (rep.content ?? []).filter((c: any) => c.type === "text").map((c: any) => c.text as string);
    const debut = textes.findIndex((t: string) => t.includes("{"));
    const x = debut < 0 ? textes.join("") : textes.slice(debut).join("");
    if (!x.includes("{")) throw new Error(`réponse sans JSON (${rep.stop_reason}) : ${JSON.stringify(rep.content ?? rep).slice(0, 300)}`);
    const v = valide(JSON.parse(x.slice(x.indexOf("{"), x.lastIndexOf("}") + 1)), g);
    if (!(Number(S.note) >= 4 && Number(S.nbAvis) >= 5)) v.presentation.sous = ["", ""];
    else v.presentation.sous[0] = `d’après ${S.nbAvis} avis Google,`;
    v.presentation.titre = [S.nom, S.ville ? "à " + S.ville : ""];
    const brut = JSON.parse(x.slice(x.indexOf("{"), x.lastIndexOf("}") + 1));
    const act = sansTiret(str(brut.activite, 60)).replace(/[.;:,]+$/, "");
    if (act) v.activiteDeduite = act.charAt(0).toUpperCase() + act.slice(1);
    if (hex(brut.couleur)) v.couleurMetier = hex(brut.couleur);
    if (Array.isArray(brut.avis)) v.avisRetenus = brut.avis.map(Number).filter((n: number) => n >= 1 && n <= (S.avis?.length ?? 0));
    return { textes: v, ia: true };
  } catch (e) {
    console.error("rédaction", String(e).slice(0, 300));
    return { textes: g, ia: false };
  }
}

/* ---------- photos Google : écarter logos et visuels, mettre la meilleure en bannière, repérer le logo ---------- */
function hslHex(h: number, s: number, l: number) {
  const k = (n: number) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return "#" + [f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function paletteDe(c: string) {
  const r = parseInt(c.slice(1, 3), 16) / 255, g = parseInt(c.slice(3, 5), 16) / 255, b = parseInt(c.slice(5, 7), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (d < .08) return null; // logo noir, blanc ou gris : la famille de l'activité décide
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
  return { fond: hslHex(h, Math.min(.38, s * .5), .09), accent: hslHex(h, Math.max(.45, Math.min(.85, s)), Math.max(.58, Math.min(.72, l))), clair: hslHex(h, .22, .93) };
}
async function trierPhotos(photos: { url: string; credit: string }[], nom: string, logoWeb: string | null = null) {
  const rien = { photos, logo: null as string | null, couleur: null as string | null, logoSite: false, couleurSite: null as string | null };
  if (!ANTHROPIC || (!photos.length && !logoWeb)) return rien;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 30000);
    const contenu: any[] = [{ type: "text", text: `Images de la fiche Google de « ${nom} », numérotées de 1 à ${photos.length} dans l'ordre.` }];
    photos.forEach((p, i) => { contenu.push({ type: "text", text: `Image ${i + 1} :` }); contenu.push({ type: "image", source: { type: "url", url: p.url } }); });
    if (logoWeb && !/\.svg$/i.test(logoWeb)) { contenu.push({ type: "text", text: "Image L (trouvée sur le site actuel, peut-être son logo) :" }); contenu.push({ type: "image", source: { type: "url", url: logoWeb } }); }
    contenu.push({ type: "text", text: `Classe ces images pour un site vitrine. Une « photo » est une vraie photographie (devanture, intérieur, travail réalisé, produits, équipe) ; un logo, une enseigne graphique, une affiche, un flyer, un menu, une capture d'écran ou une image surtout faite de texte n'en est pas une. Réponds uniquement par ce JSON : {"photos": [numéros des vraies photos nettes, la plus belle pour une grande bannière d'abord], "logo": numéro de l'image qui est le logo de l'établissement ou null, "couleur": couleur principale du logo en hexadécimal (#rrggbb, hors noir, blanc et gris) ou null, "logoSite": true si l'image L est bien le logo de « ${nom} » (pas celui d'un partenaire, d'un label ou d'un réseau social), sinon false, "couleurSite": couleur principale de l'image L si c'est le logo (#rrggbb, hors noir, blanc et gris) ou null}` });
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", signal: ctl.signal,
      headers: { "x-api-key": ANTHROPIC, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODELE, max_tokens: 4000, messages: [{ role: "user", content: contenu }] }),
    });
    clearTimeout(t);
    if (!r.ok) throw new Error(await r.text());
    const x = ((await r.json()).content ?? []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("");
    const j = JSON.parse(x.slice(x.indexOf("{"), x.lastIndexOf("}") + 1));
    const ok = (n: unknown) => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= photos.length;
    const ordre = (Array.isArray(j.photos) ? j.photos : []).filter(ok).filter((n: number, i: number, a: number[]) => a.indexOf(n) === i);
    return { photos: ordre.map((n: number) => photos[n - 1]), logo: ok(j.logo) ? photos[j.logo - 1].url : null, couleur: hex(j.couleur), logoSite: j.logoSite === true, couleurSite: hex(j.couleurSite) };
  } catch (e) {
    console.error("tri des photos", String(e).slice(0, 200));
    return rien;
  }
}

/* ---------- logo envoyé par le visiteur (image en data URL, 1,5 Mo au plus) ---------- */
async function logo(id: string, data: unknown) {
  const m = /^data:(image\/(png|jpeg|webp|svg\+xml));base64,([A-Za-z0-9+/=]+)$/.exec(String(data ?? ""));
  if (!m) return null;
  const octets = Uint8Array.from(atob(m[3]), (c) => c.charCodeAt(0));
  if (octets.length > 1_500_000) return null;
  if (m[2] === "svg+xml" && /<script|on\w+=|javascript:/i.test(new TextDecoder().decode(octets))) return null;
  const chemin = `${id}/logo.${m[2] === "svg+xml" ? "svg" : m[2] === "jpeg" ? "jpg" : m[2]}`;
  const up = await sb.storage.from("apercus").upload(chemin, octets, { contentType: m[1], upsert: true });
  return up.error ? null : sb.storage.from("apercus").getPublicUrl(chemin).data.publicUrl;
}

/* ---------- mails ---------- */
const enc = new TextEncoder();
const signer = async (txt: string) => {
  const k = await crypto.subtle.importKey("raw", enc.encode(CLE), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(txt)));
  return btoa(String.fromCharCode(...s)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" } as Record<string, string>)[c]).slice(0, 32);
};
const lienStop = async (email: string) => `${URL_SB}/functions/v1/parcours?a=stop&e=${encodeURIComponent(email)}&s=${await signer("stop:" + email)}`;
// liste « Aperçus de site » (dossier des listes Studio ES/Fill) : retrouvée ou créée au premier essai
let listeApercu = LISTE;
async function liste() {
  if (listeApercu || !BREVO) return listeApercu;
  const h = { "api-key": BREVO, accept: "application/json", "content-type": "application/json" };
  const r = await fetch("https://api.brevo.com/v3/contacts/lists?limit=50", { headers: h }).catch(() => null);
  const l = r?.ok ? ((await r.json()).lists ?? []).find((x: any) => x.name === "Aperçus de site") : null;
  if (l) return (listeApercu = l.id);
  const c = await fetch("https://api.brevo.com/v3/contacts/lists", { method: "POST", headers: h, body: JSON.stringify({ name: "Aperçus de site", folderId: 3 }) }).catch(() => null);
  if (c?.ok) listeApercu = (await c.json()).id ?? 0;
  return listeApercu;
}
async function brevo(chemin: string, corps: unknown, methode = "POST") {
  if (!BREVO) return false;
  const r = await fetch(`https://api.brevo.com/v3/${chemin}`, { method: methode, headers: { "api-key": BREVO, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(corps) }).catch(() => null);
  return Boolean(r?.ok);
}
// textes du mail envoyé au visiteur : chaleureux, concrets, la suite clairement proposée
function mailTextes(nom: string, activite: string, ville: string, exp: string) {
  const pour = `adaptée à votre activité${activite ? " (" + activite.toLowerCase() + ")" : ""}`;
  return {
    objet: `${nom} : l’aperçu de votre site est prêt`,
    intro: `Merci d’avoir testé l’aperçu. Voici celui de ${nom} : il reprend votre fiche Google (horaires, avis, photos) dans une mise en page ${pour}.`,
    suite: `C’est une première version. Pour la mise en ligne, je reprends avec vous les textes et les photos, puis j’ajoute ce qui manque. La formule Essentiel est à 490 €, en une fois ou en 6 ou 12 mensualités : textes rédigés, référencement local, mise en ligne et une heure de prise en main compris. Le site est en ligne sous 10 jours.`,
    appel: `Si l’aperçu vous parle, répondez simplement à ce message ou réservez un échange de 30 minutes : nous verrons ensemble ce que vous voulez garder ou changer.`,
    duree: `L’aperçu reste en ligne jusqu’au ${exp}.`,
  };
}
function mailHtml(nom: string, url: string, exp: string, st: any, photo: string | null, stop: string, T: ReturnType<typeof mailTextes>) {
  const fond = hex(st?.fond) ?? "#1c0f1f", acc = hex(st?.accent) ?? "#e68dca";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(T.objet)}</title></head>
<body style="margin:0;padding:0;background:#FFFFFF">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 6px 18px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#141414">Bonjour,</td></tr>
<tr><td style="padding:0 6px 22px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#141414">${esc(T.intro)}</td></tr>
<tr><td><a href="${url}" style="display:block;text-decoration:none;border-radius:22px;overflow:hidden;background:${fond}">
${photo ? `<img src="${photo}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:240px;object-fit:cover;border:0">` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:26px 28px 28px">
<div style="font:700 32px/1.05 Arial,Helvetica,sans-serif;letter-spacing:-1px;color:#ffffff">${esc(nom)}</div>
<div style="font:italic 20px/1.3 Georgia,serif;color:${acc};margin-top:6px">votre futur site</div>
<div style="margin-top:22px"><span style="display:inline-block;background:${acc};color:${fond};font:700 15px/1 Arial,Helvetica,sans-serif;padding:14px 22px;border-radius:999px">Voir l’aperçu</span></div>
</td></tr></table></a></td></tr>
<tr><td style="padding:24px 6px 0;font:15px/1.6 Arial,Helvetica,sans-serif;color:#141414">${esc(T.suite)}</td></tr>
<tr><td style="padding:16px 6px 0;font:15px/1.6 Arial,Helvetica,sans-serif;color:#141414">${esc(T.appel)}</td></tr>
<tr><td style="padding:18px 6px 0"><a href="${RDV}" style="display:inline-block;background:#141414;color:#ffffff;font:700 15px/1 Arial,Helvetica,sans-serif;padding:14px 22px;border-radius:999px;text-decoration:none">Réserver 30 minutes</a></td></tr>
<tr><td style="padding:18px 6px 0;font:13.5px/1.6 Arial,Helvetica,sans-serif;color:#65615A">${esc(T.duree)}</td></tr>
<tr><td style="padding:16px 6px 0;font:15px/1.6 Arial,Helvetica,sans-serif;color:#141414">Bien cordialement,</td></tr>
<tr><td style="padding:14px 0 0"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate"><tr>
<td bgcolor="#F0EEE9" style="background:#F0EEE9;border-radius:18px 0 0 0;line-height:0"><img src="https://studioes.fr/images/signature-nom.png" width="370" height="84" alt="Ewen Soupault, Studio ES, photographie, sites et applications" style="display:block;width:370px;height:84px;border:0"></td>
<td rowspan="2" width="130" style="line-height:0;vertical-align:top"><img src="https://studioes.fr/images/signature-filigrane.png" width="130" height="122" alt="" style="display:block;border:0"></td></tr>
<tr><td bgcolor="#F0EEE9" style="background:#F0EEE9;border-radius:0 0 0 18px;padding:0 0 0 22px;height:38px;vertical-align:top;font:13px/1.4 Arial,Helvetica,sans-serif;color:#141414"><a href="tel:+33651222107" style="color:#141414;text-decoration:none">06 51 22 21 07</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://studioes.fr/" style="color:#141414">studioes.fr</a></td></tr></table></td></tr>
<tr><td style="padding:26px 6px 0;font:12px/1.5 Arial,Helvetica,sans-serif;color:#8A8680">Vous recevez ce message parce que vous avez demandé un aperçu sur studioes.fr. Vous ne souhaitez plus recevoir de message de Studio ES ? <a href="${stop}" style="color:#8A8680">Cliquez ici</a>.</td></tr>
</table></td></tr></table></body></html>`;
}
async function envoyerApercu(row: any) {
  const url = VOIR + row.id, nom = row.donnees.nom, exp = dateFr(new Date(row.expire)), stop = await lienStop(row.email);
  const T = mailTextes(nom, row.activite ?? row.donnees.activite ?? "", row.donnees.ville ?? "", exp);
  const texte = `Bonjour,\n\n${T.intro}\n\n${url}\n\n${T.suite}\n\n${T.appel}\n${RDV}\n\n${T.duree}\n\nBien cordialement,\nEwen Soupault\nPhotographie de reportage, sites et applications\n06 51 22 21 07 · studioes.fr\n\nVous ne souhaitez plus recevoir de message de Studio ES ? ${stop}`;
  return await brevo("smtp/email", {
    sender: { name: "Ewen Soupault, Studio ES", email: EXPEDITEUR },
    replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Studio ES" },
    to: [{ email: row.email }],
    subject: T.objet,
    htmlContent: mailHtml(nom, url, exp, row.style, row.donnees.photos?.[0]?.url ?? null, stop, T), textContent: texte,
    tags: ["apercu"],
    headers: { "List-Unsubscribe": `<${stop}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  });
}

/* ---------- création d'un aperçu ---------- */
async function construire(o: { source: "site" | "horschamp"; placeId?: string; session?: string; manuel?: any; email?: string; nom?: string; activite?: string; ville?: string; palette?: any; logo?: unknown; ip?: string; fiche?: string }) {
  const id = ident();
  let S: any;
  if (o.placeId) {
    if (!GOOGLE) throw new Error("Clé Google absente (secret GOOGLE_PLACES_KEY)");
    S = await donneesGoogle(id, await fiche(o.placeId, o.session));
    const w = await siteWeb(S.web);
    S.extraitWeb = w.texte; S.charte = { logo: w.logo, couleur: w.couleur };
  } else {
    // aperçu sans fiche Google (prospect sans fiche) : données saisies dans Hors-champ
    const m = o.manuel ?? {};
    S = { nom: str(m.nom || o.nom, 90), activite: str(m.activite || o.activite, 60), adresse: str(m.adresse, 120), cp: str(m.cp, 10), commune: str(m.ville || o.ville, 60), ville: str(m.ville || o.ville, 60),
      tel: str(m.tel, 20).replace(/[^\d+]/g, "").replace(/^0/, "+33"), telAffiche: str(m.tel, 20), web: null, maps: null, note: null, nbAvis: 0, horaires: null, resume: null, photos: [], avis: [] };
  }
  if (!S.nom) S.nom = str(o.nom, 90) || "Votre établissement";
  if (!S.ville && o.ville) S.ville = str(o.ville, 60);
  let activite = str(o.activite, 60);
  // l'activité saisie, sinon celle que la rédaction déduit, prime sur la catégorie Google (souvent vague : « Magasin »)
  if (activite && S.activite !== activite) { S.categorie = S.activite || null; S.activite = activite; }
  const lw = !o.logo && !o.palette ? await logoSite(id, S.charte?.logo ?? null) : null;
  const [{ textes, ia }, lg, tri] = await Promise.all([rediger(S, activite), logo(id, o.logo), trierPhotos(S.photos ?? [], S.nom, lw)]);
  S.photos = tri.logo ? tri.photos.filter((p: any) => p.url !== tri.logo) : tri.photos;
  if (!activite && textes.activiteDeduite) { S.categorie = S.activite || null; S.activite = textes.activiteDeduite; }
  delete textes.activiteDeduite;
  activite = activite || S.activite || "";
  // identité, par ordre de fiabilité :
  // 1. couleurs choisies ou calculées sur le logo envoyé (navigateur) ; 2. logo du site actuel, vérifié ; 3. charte du site (theme-color, CSS) ;
  // 4. logo repéré parmi les photos Google ; 5. couleur du métier choisie par la rédaction ; 6. famille de l'activité
  const pals = palettesPour(`${activite} ${S.categorie ?? ""} ${S.types ?? ""} ${S.nom}`);
  const logoWeb = lw && (tri.logoSite || /\.svg$/i.test(lw)) ? lw : null;
  const logoGoogle = !lg && !logoWeb && !o.palette ? tri.logo : null;
  const depuis = (c: string | null | undefined) => c ? paletteDe(c) : null;
  const choisie = (o.palette && hex(o.palette.fond) && hex(o.palette.accent) && hex(o.palette.clair) ? { fond: hex(o.palette.fond), accent: hex(o.palette.accent), clair: hex(o.palette.clair) } : null)
    ?? (logoWeb ? depuis(tri.couleurSite) : null)
    ?? depuis(S.charte?.couleur)
    ?? (logoGoogle ? depuis(tri.couleur) : null)
    ?? depuis(textes.couleurMetier)
    ?? { fond: pals[0].fond, accent: pals[0].accent, clair: pals[0].clair };
  const origine = o.palette ? "visiteur" : logoWeb && tri.couleurSite ? "logo du site" : S.charte?.couleur && depuis(S.charte.couleur) ? "charte du site" : logoGoogle && tri.couleur ? "logo Google" : textes.couleurMetier ? "métier" : "famille";
  delete textes.couleurMetier; delete S.charte;
  // avis hors sujet (point relais, autre service au même endroit) écartés par la rédaction
  if (Array.isArray(textes.avisRetenus)) { const k = new Set(textes.avisRetenus); S.avis = (S.avis ?? []).filter((_: any, i: number) => k.has(i + 1)); delete textes.avisRetenus; }
  delete S.extraitWeb;
  const row = {
    id, source: o.source, email: o.email ?? null, nom_saisi: str(o.nom, 120) || null, activite: activite || null, ville: str(o.ville, 80) || S.ville || null,
    place_id: o.placeId ?? null, donnees: S, textes: { ...textes, ia }, style: { ...choisie, logo: lg ?? logoWeb ?? logoGoogle, origine }, ip: o.ip ?? null, fiche_hc: o.fiche ?? null,
    importe_hc: o.source === "horschamp", debloque: o.source !== "site",
  };
  const { data, error } = await sb.from("apercu").insert(row).select("id, expire").single();
  if (error) throw error;
  return { ...row, expire: data.expire };
}

/* ---------- serveur ---------- */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req, new URL(req.url).searchParams.has("a")) });
  const url = new URL(req.url);

  // lecture publique d'un aperçu
  if (req.method === "GET") {
    const id = (url.searchParams.get("a") ?? "").replace(/[^a-z0-9]/g, "").slice(0, 16);
    if (!id) return json(req, { erreur: "identifiant manquant" }, 400, true);
    const { data } = await sb.from("apercu").select("id, expire, donnees, textes, style, vues, debloque").eq("id", id).maybeSingle();
    if (!data || !data.debloque) return json(req, { erreur: "introuvable" }, 404, true);
    if (!data.donnees || new Date(data.expire) < new Date()) return json(req, { erreur: "expiré" }, 410, true);
    sb.from("apercu").update({ vues: (data.vues ?? 0) + 1, vu_le: new Date().toISOString() }).eq("id", id).then(() => {});
    return new Response(JSON.stringify({ id: data.id, expire: data.expire, site: data.donnees, textes: data.textes, style: data.style }),
      { headers: { ...cors(req, true), "Content-Type": "application/json", "Cache-Control": "no-store" } });
  }
  if (req.method !== "POST") return json(req, { erreur: "méthode" }, 405);

  const corps = await req.json().catch(() => ({}));
  const action = String(corps.action ?? "");
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const pilote = Boolean(CLE) && jeton.length >= 32 && (jeton === CLE || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  const origine = req.headers.get("Origin") ?? "";
  if (!pilote && !ORIGINES.includes(origine)) return json(req, { erreur: "origine non autorisée" }, 403);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";

  try {
    // purge nocturne (cron « apercu-purge ») : fichiers des aperçus expirés effacés par l'API Storage, puis données vidées
    if (action === "purger") {
      if (!pilote) return json(req, { erreur: "réservé à la purge" }, 401);
      const { data: vieux } = await sb.from("apercu").select("id").lt("expire", new Date().toISOString()).not("donnees", "is", null).limit(200);
      let fichiers = 0;
      for (const v of vieux ?? []) {
        const { data: l } = await sb.storage.from("apercus").list(v.id, { limit: 100 });
        const noms = (l ?? []).map((f: any) => `${v.id}/${f.name}`);
        if (noms.length) { const { error } = await sb.storage.from("apercus").remove(noms); if (error) throw error; fichiers += noms.length; }
        await sb.from("apercu").update({ donnees: null }).eq("id", v.id);
      }
      await sb.from("apercu_recherche").delete().lt("t", new Date(Date.now() - 864e5).toISOString());
      return json(req, { apercus: vieux?.length ?? 0, fichiers });
    }

    if (action === "palettes") return json(req, { palettes: palettesPour(str(corps.activite, 80)) });

    if (action === "chercher") {
      const nom = str(corps.nom ?? corps.q, 120), ville = str(corps.ville, 80);
      if (nom.length < 2) return json(req, { resultats: [] });
      if (!GOOGLE) return json(req, { erreur: "La recherche Google n’est pas encore branchée." }, 503);
      if (!pilote) {
        const { count } = await sb.from("apercu_recherche").select("ip", { count: "exact", head: true }).eq("ip", ip).gte("t", new Date(Date.now() - 36e5).toISOString());
        if ((count ?? 0) >= 30) return json(req, { erreur: "Trop de recherches depuis cette connexion : réessayez dans une heure." }, 429);
        await sb.from("apercu_recherche").insert({ ip });
      }
      return json(req, { resultats: await chercher(nom, ville) });
    }

    if (action === "preparer") {
      if (corps._honey) return json(req, { id: ident() });
      if (!corps.place) return json(req, { erreur: "Choisissez votre fiche Google." }, 400);
      const { count } = await sb.from("apercu").select("id", { count: "exact", head: true }).eq("ip", ip).eq("source", "site").gte("cree", new Date(Date.now() - 864e5).toISOString());
      if ((count ?? 0) >= 3) return json(req, { erreur: "Trois aperçus ont déjà été préparés depuis cette connexion aujourd’hui. Réessayez demain, ou écrivez-nous." }, 429);
      const row = await construire({ source: "site", placeId: str(corps.place, 300), nom: corps.nom, activite: corps.activite, ville: corps.ville, palette: corps.palette, logo: corps.logo, ip });
      return json(req, { id: row.id, nom: row.donnees.nom });
    }

    if (action === "debloquer") {
      const email = str(corps.email, 160).toLowerCase();
      const id = str(corps.id, 16).replace(/[^a-z0-9]/g, "");
      if (!MAIL.test(email)) return json(req, { erreur: "Adresse e-mail invalide." }, 400);
      const { data: row } = await sb.from("apercu").select("*").eq("id", id).eq("source", "site").maybeSingle();
      if (!row || !row.donnees) return json(req, { erreur: "Aperçu introuvable : recommencez depuis le début." }, 404);
      if (row.debloque) return json(req, { id, url: VOIR + id });
      const { data: deja } = await sb.from("apercu").select("id").eq("source", "site").eq("debloque", true).ilike("email", email).maybeSingle();
      if (deja) return json(req, { erreur: "Un aperçu a déjà été préparé pour cette adresse : il vous a été envoyé par e-mail.", deja: true }, 409);
      // couleurs et logo choisis pendant la préparation
      const style = { ...(row.style ?? {}) };
      const pal = corps.palette;
      if (pal && hex(pal.fond) && hex(pal.accent) && hex(pal.clair)) Object.assign(style, { fond: hex(pal.fond), accent: hex(pal.accent), clair: hex(pal.clair) });
      const lg = corps.logo ? await logo(id, corps.logo) : null;
      if (lg) style.logo = lg;
      row.style = style;
      const { error } = await sb.from("apercu").update({ email, debloque: true, style }).eq("id", id).eq("debloque", false);
      if (error) return json(req, { erreur: "Un aperçu a déjà été préparé pour cette adresse.", deja: true }, 409);
      row.email = email;
      const envoye = await envoyerApercu(row);
      const lid = await liste();
      const contact = await brevo("contacts", { email, updateEnabled: true, ...(lid ? { listIds: [lid] } : {}) });
      await sb.from("apercu").update({ mail_envoye: envoye, brevo: contact }).eq("id", id);
      await brevo("smtp/email", {
        sender: { name: "Studio ES", email: EXPEDITEUR }, to: [{ email: ALERTE }], replyTo: { email },
        subject: `Nouvel aperçu : ${row.donnees.nom}`,
        textContent: `${row.donnees.nom} (${row.activite ?? row.donnees.activite ?? "activité ?"}, ${row.donnees.ville ?? "?"})\n${email}\n${VOIR + id}\n\nLa fiche est dans Hors-champ, étape « À contacter ».`,
      });
      return json(req, { id, url: VOIR + id, envoye });
    }

    if (action === "prospect") {
      if (!pilote) return json(req, { erreur: "réservé à Hors-champ" }, 401);
      let placeId = str(corps.place, 300) || null;
      if (!placeId && corps.q && GOOGLE) placeId = (await premierePlace(str(corps.q, 200))) ?? null;
      if (!placeId && !corps.manuel) return json(req, { erreur: "Aucune fiche Google trouvée : précisez le nom et la ville, ou remplissez l’aperçu à la main." }, 404);
      const row = await construire({ source: "horschamp", placeId: placeId ?? undefined, manuel: corps.manuel, nom: corps.nom, activite: corps.activite, ville: corps.ville, palette: corps.palette, fiche: str(corps.fiche, 120) || undefined, email: str(corps.email, 160) || undefined });
      return json(req, { id: row.id, url: VOIR + row.id, nom: row.donnees.nom, photos: row.donnees.photos.length, avis: row.donnees.avis.length, ia: row.textes.ia, expire: row.expire });
    }

    return json(req, { erreur: "action inconnue" }, 400);
  } catch (e) {
    console.error(action, String(e).slice(0, 500));
    return json(req, { erreur: "L’aperçu n’a pas pu être préparé. Réessayez dans un instant.", detail: pilote ? String(e).slice(0, 300) : undefined }, 500);
  }
});
