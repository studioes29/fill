// Règles du mail mensuel unique (fonction « bilan ») : trois suggestions pour la période qui commence,
// plage d'envoi, liens et textes des mails. Les chiffres du bilan, eux, sont calculés par la base (bilan_calculer).
//
// Suggestions : des règles, pas de rédaction automatique. Trois sources, dans cet ordre :
//   1. l'historique du client : ce qu'il a demandé à la même période l'an passé ;
//   2. le calendrier type (assets/t.js, copié dans ../calendrier-type.json par supabase/calendrier-type.mjs) ;
//   3. le solde d'unités de la période qui commence, report compris : le total des suggestions ne le dépasse jamais.
// Un sujet déjà demandé n'est pas suggéré ; un sujet dont le délai ne peut plus être tenu non plus.
import calendrier from '../calendrier-type.json' with { type: 'json' };
import { ajouterJours, estOuvre } from './calendrier.ts';
import { natureDelai } from './estimation.ts';
import { formule, OFFRE, ORDRE_FORMULES, prestation } from './offre.ts';

export const NOMBRE = 3;
// un temps fort placé jusqu'à deux semaines après la fin de la période se prépare pendant celle-ci
export const MARGE_JOURS = 14;
// déjà demandé : même titre, et la demande est encore en cours, ou date de moins de 60 jours (parution, sinon dépôt),
// comme dans le bloc « À anticiper » de l'Espace
export const DEJA_DEMANDE_JOURS = 60;
const TERMINEES = ["livree", "annulee"];

const deux = (n) => String(n).padStart(2, "0");
const valide = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
const ecartJours = (a, b) => Math.abs(Date.parse(a) - Date.parse(b)) / 864e5;

// titre comparable : sans casse, accents ni apostrophes typographiques (comme cleTempsFort dans l'Espace)
export const cleTitre = (t) =>
  String(t ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, " ").replace(/\s+/g, " ").trim();

export const plusUnAn = (s) => {
  const [a, m, j] = String(s).slice(0, 10).split("-").map(Number);
  return `${a + 1}-${deux(m)}-${deux(m === 2 && j === 29 ? 28 : j)}`;
};

// ---------- dates en clair

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const quantieme = (j) => (j === 1 ? "1er" : String(j));
export const jourMois = (s) => `${quantieme(+s.slice(8, 10))} ${MOIS[+s.slice(5, 7) - 1]}`;
export const jourLong = (s) => `${JOURS[new Date(`${s}T00:00:00Z`).getUTCDay()]} ${jourMois(s)}`;
export const libellePeriode = (debut, fin) =>
  `du ${jourMois(debut)}${debut.slice(0, 4) === fin.slice(0, 4) ? "" : ` ${debut.slice(0, 4)}`} au ${jourMois(fin)} ${fin.slice(0, 4)}`;

// ---------- prestations, unités, délai

// prestations d'une suggestion : celles du catalogue que la formule permet, quantités bornées
export const lignesPermises = (qte, formuleId) => {
  const r = {};
  for (const [id, n] of Object.entries(qte ?? {})) {
    const p = prestation(id);
    if (!p || !(Number(n) > 0)) continue;
    if (p.min && ORDRE_FORMULES.indexOf(formuleId) < ORDRE_FORMULES.indexOf(p.min)) continue;
    r[id] = Math.min(p.max ?? 99, Math.round(Number(n)));
  }
  return r;
};
export const unitesDe = (qte) => Object.entries(qte).reduce((s, [id, n]) => s + prestation(id).u * n, 0);
export const libelleLignes = (qte) => Object.entries(qte).map(([id, n]) => (n > 1 ? `${prestation(id).nom} × ${n}` : prestation(id).nom)).join(", ");

// jours ouvrés à garder entre le dépôt et la parution, d'après les délais de l'offre :
// bulletin 15, reportage 5 ; sinon un jour pour la confirmation, plus le délai (création, ou courant de la formule)
export const ouvresNecessaires = (qte, formuleId) => {
  const ids = Object.keys(qte);
  if (ids.includes("bulletin")) return 15;
  if (ids.some((id) => natureDelai(id) === "planifie")) return 5;
  return (ids.some((id) => natureDelai(id) === "creation") ? OFFRE.delaiCreationJ : formule(formuleId).delai_j) + 1;
};

// dernier jour ouvré de dépôt qui laisse « ouvres » jours ouvrés avant la parution (parution comprise)
export const limiteDepot = (parution, ouvres, fermetures = []) => {
  let x = parution, n = 0;
  for (let i = 0; i < 400; i++) {
    if (n >= ouvres && estOuvre(x, fermetures)) return x;
    if (estOuvre(x, fermetures)) n++;
    x = ajouterJours(x, -1);
  }
  return null;
};

// ---------- les trois suggestions

// contexte : { organisation: { type, formule }, jour, suivante: { debut, fin, disponible }, demandes, fermetures }
// demandes : toutes celles de l'organisation, { id, titre, statut, parution, creee, lignes: [{ prestation, quantite }] }
export const suggerer = ({ organisation, jour, suivante, demandes = [], fermetures = [], calendrierType = calendrier, nombre = NOMBRE }) => {
  if (!organisation || !suivante || !ORDRE_FORMULES.includes(organisation.formule)) return [];
  let budget = Math.max(0, Math.floor(Number(suivante.disponible) || 0));
  if (budget < 1) return [];
  const debut = suivante.debut > jour ? suivante.debut : jour;
  const fin = ajouterJours(suivante.fin, MARGE_JOURS);
  const actives = demandes.filter((d) => d.statut !== "annulee");
  const repere = (d) => d.parution ?? String(d.creee ?? "").slice(0, 10);
  const deja = (titre, date, sauf) =>
    actives.some((d) => d !== sauf && cleTitre(d.titre) === cleTitre(titre) && (!TERMINEES.includes(d.statut) || (valide(repere(d)) && ecartJours(repere(d), date) <= DEJA_DEMANDE_JOURS)));
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

  // 1. même période l'an passé
  const anciennes = actives
    .map((d) => ({ d, an: valide(repere(d)) ? plusUnAn(repere(d)) : null }))
    .filter((x) => x.an && x.an >= suivante.debut && x.an <= fin)
    .sort((a, b) => a.an.localeCompare(b.an));
  for (const { d, an } of anciennes) {
    if (deja(d.titre, an, d) || candidats.some((c) => cleTitre(c.titre) === cleTitre(d.titre))) continue;
    const date = d.parution ? plusUnAn(d.parution) : null;
    ajouter(
      {
        cle: `h-${d.id}`, source: "historique", titre: d.titre, date,
        pourquoi: d.parution ? `Vous l’aviez demandé l’an passé, pour le ${jourMois(d.parution)}.` : "Vous l’aviez demandé l’an passé à la même période.",
      },
      Object.fromEntries((d.lignes ?? []).map((l) => [l.prestation, l.quantite])),
    );
  }

  // 2. calendrier type
  const mois = calendrierType.mois[organisation.type === "entreprise" ? "e" : "c"];
  const [a0, m0] = debut.split("-").map(Number);
  for (let k = 0; k < 4; k++) {
    const m = ((m0 - 1 + k) % 12) + 1, a = a0 + Math.floor((m0 - 1 + k) / 12);
    for (const [j, titre, pack] of mois[m] ?? []) {
      const date = `${a}-${deux(m)}-${deux(j)}`;
      if (!valide(date) || date < debut || date > fin) continue;
      if (deja(titre, date) || candidats.some((c) => cleTitre(c.titre) === cleTitre(titre))) continue;
      const p = calendrierType.packs[pack];
      ajouter({ cle: `c-${date}-${pack}`, source: "calendrier", titre, date, libelle: p.l, pourquoi: `Repère du calendrier type : autour du ${jourMois(date)}.` }, p.p);
    }
  }

  // 3. dans la limite des unités disponibles, report compris
  const choisies = [];
  for (const c of candidats) {
    if (choisies.length >= nombre) break;
    if (c.unites > budget) continue;
    choisies.push(c);
    budget -= c.unites;
  }
  return choisies;
};

// ---------- envoi

// rien entre 20 h et 8 h, ni le week-end, ni un jour férié (heure de Paris)
export const plageOuverte = (instant = new Date()) => {
  const p = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris", dateStyle: "short", timeStyle: "short" }).format(instant);
  const heure = +p.slice(11, 13);
  return estOuvre(p.slice(0, 10)) && heure >= 8 && heure < 20;
};

// les jetons voyagent dans le fragment de l'adresse : ils ne sont transmis à aucun serveur à l'ouverture de la page
const base = (site) => String(site).replace(/\/$/, "");
export const lienBilan = (site, jeton) => `${base(site)}/bilan/#j=${jeton}`;
// aperçu pour Fill, ouvert depuis Hors-champ (le jeton y est tiré)
export const lienRelecture = (site, jeton) => `${base(site)}/bilan/#r=${jeton}`;
// « Lancer » : la nouvelle demande pré-remplie dans l'Espace (lue par espace-src/src/routeur.js)
export const lienLancer = (site, s) =>
  `${base(site)}/#nouvelle?titre=${encodeURIComponent(s.titre)}${s.date ? `&parution=${s.date}` : ""}&qte=${Object.entries(s.qte ?? {}).map(([id, n]) => `${id}:${n}`).join(",")}`;

// ---------- textes

const echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pluriel = (n, mot) => `${mot}${n >= 2 ? "s" : ""}`;
export const unites = (n) => `${n} ${pluriel(n, "unité")}`;

// les trois chiffres du mail et de la tête de page
export const troisChiffres = (d) => [
  { valeur: String(d.demandes_livrees), libelle: d.demandes_livrees > 1 ? "demandes livrées" : "demande livrée" },
  { valeur: String(d.unites.utilisees), libelle: `${pluriel(d.unites.utilisees, "unité")} ${pluriel(d.unites.utilisees, "utilisée")} sur ${d.unites.total}` },
  d.delais.total > 0
    ? { valeur: `${d.delais.a_la_date} sur ${d.delais.total}`, libelle: d.delais.total > 1 ? "livrées à la date annoncée" : "livrée à la date annoncée" }
    : { valeur: String(d.unites.reportees), libelle: `${pluriel(d.unites.reportees, "unité")} ${pluriel(d.unites.reportees, "reportée")} sur la période suivante` },
];

const CHIFFRE = "font:700 24px/1.5 Arial,Helvetica,sans-serif;color:#1A1A1A";
const NORMAL = "font-size:16px;color:#4A4540";

// le mail du référent : trois chiffres, le lien du bilan, les suggestions
export const mailMensuel = ({ donnees: d, lien, site }) => {
  const periode = libellePeriode(d.debut, d.fin);
  const sug = d.suggestions ?? [], s = d.suivante;
  const apres = [];
  const report = s && s.report > 0 ? `, dont ${s.report} ${pluriel(s.report, "reportée")} à utiliser avant le ${jourMois(s.fin)}` : "";
  // tant que le quota de la période n'est pas crédité (mensualité en attente), seul le report est disponible
  const attente = s && s.creditee === false ? " Les unités de votre formule s’y ajoutent dès le règlement de la période." : "";
  if (sug.length) {
    apres.push(
      `<span style="${NORMAL}"><b style="color:#1A1A1A">Pour la période qui commence</b>, ${sug.length > 1 ? `${sug.length} sujets tiennent` : "un sujet tient"} dans ${
        s.disponible >= 2 ? `vos ${s.disponible} unités disponibles` : "votre unité disponible"
      }${report}.${attente}</span>`,
    );
    for (const x of sug)
      apres.push(
        `<span style="${NORMAL}"><b style="color:#1A1A1A">${echap(x.titre)}</b> · ${unites(x.unites)}<br>${echap(x.libelle)}. ${echap(x.pourquoi ?? "")}${
          x.limite ? ` À déposer au plus tard le ${jourLong(x.limite)}.` : ""
        }<br><a href="${echap(lienLancer(site, x))}" style="color:#5B3F9C;font-weight:700">Lancer cette demande</a></span>`,
      );
    apres.push("« Lancer » ouvre la demande déjà remplie dans votre espace. Rien n’est engagé tant qu’elle n’est pas envoyée.");
  } else if (s && s.disponible > 0) {
    apres.push(`<span style="${NORMAL}">Pour la période qui commence, vous disposez de ${unites(s.disponible)}${report}.${attente}</span>`);
  }
  apres.push("Le bilan s’ouvre sans compte ni mot de passe&nbsp;: ce lien se transmet tel quel.");
  return {
    sujet: `Votre mois avec Fill : ${periode}`,
    titre: "Votre mois avec Fill",
    aperçu: `${echap(d.organisation.nom)}, ${periode}.`,
    texte: [
      `${echap(d.organisation.nom)}, ${periode}.`,
      troisChiffres(d).map((c) => `<span style="${CHIFFRE}">${echap(c.valeur)}</span>&nbsp; ${echap(c.libelle)}`).join("<br>"),
    ],
    bouton: { libelle: "Voir le bilan", lien },
    apres,
  };
};

// alerte à Fill : un envoi dont l'issue est inconnue n'est jamais retenté seul.
// confirme : le service d'envoi a accepté le mail, mais la base n'a pas pu l'enregistrer.
export const mailBloque = ({ organisation, periode, id, a, confirme = false }) => ({
  sujet: `Bilan à vérifier : ${organisation}`,
  titre: `Envoi du bilan à vérifier : ${echap(organisation)}`,
  texte: [
    confirme
      ? `Le mail mensuel de la période ${periode} est parti à ${echap(a)}, mais son envoi n’a pas pu être enregistré : tant qu’il ne l’est pas, le lien du bilan ne s’ouvre pas chez votre client.`
      : `Le mail mensuel de la période ${periode} est parti vers le service d’envoi sans réponse claire. Pour ne jamais l’envoyer deux fois, il n’est pas retenté.`,
    confirme
      ? `Hors-champ vous propose de l’enregistrer d’un geste. À défaut : <code>select bilan_confirmer_envoi('${id}', '${echap(a)}');</code>`
      : `Vérifiez dans le journal du service d’envoi s’il est arrivé à ${echap(a)}, puis répondez dans Hors-champ : « Il est arrivé » ou « Le renvoyer ». À défaut : <code>select bilan_confirmer_envoi('${id}', '${echap(a)}');</code> s’il est arrivé, <code>select bilan_liberer_envoi('${id}');</code> sinon.`,
  ],
  bouton: null,
});

// résumé à Fill des anomalies d'un passage : un seul message, tant qu'il reste quelque chose à corriger
export const mailAnomalies = (lignes) => ({
  sujet: `Mail mensuel : ${lignes.length} ${pluriel(lignes.length, "point")} à vérifier`,
  titre: "Mail mensuel : à vérifier",
  texte: [...lignes.map(echap), "Un nouvel essai a lieu à chaque passage. Ce message revient tant qu’un point reste à corriger."],
  bouton: null,
});
