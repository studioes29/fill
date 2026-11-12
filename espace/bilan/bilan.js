// Page de bilan par lien : le mois d'un client avec Fill, à lire comme une lettre d'information.
// En tête l'essentiel, puis le calendrier de la période, ce qui a été produit, les unités, et la période qui commence.
// Sans compte. Le jeton est lu dans le fragment de l'adresse et n'est envoyé qu'en POST à la fonction « bilan » :
//   #j=…  lien de partage, celui du mail « Votre mois avec Fill » ;
//   #r=…  aperçu pour Fill, ouvert depuis Hors-champ avant l'envoi (aucune action sur la page).
// Tout texte venu de la base est posé avec textContent : jamais de HTML interprété.
// « ?demo » montre la page avec une commune fictive, « ?demo=relecture » l'aperçu avant envoi ; rien n'est envoyé.

const API = `https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/bilan`;
const JETON = /^[A-Za-z0-9_-]{43}$/;

const main = document.getElementById(`contenu`);
const demo = new URLSearchParams(location.search).get(`demo`);
const [, sorte, jeton] = location.hash.match(/(?:^#|&)([jr])=([A-Za-z0-9_-]+)/) ?? [];
const calme = () => matchMedia(`(prefers-reduced-motion: reduce)`).matches;

// petit constructeur d'éléments : h(`p`, { class: `x` }, `texte`, enfant…)
const h = (balise, attributs = {}, ...enfants) => {
  const e = document.createElement(balise);
  for (const [k, v] of Object.entries(attributs)) {
    if (v === false || v == null) continue;
    if (k === `class`) e.className = v;
    else if (k === `style`) e.style.cssText = v;
    else if (k.startsWith(`on`)) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, ``);
    else e.setAttribute(k, v);
  }
  for (const c of enfants.flat(Infinity)) if (c != null && c !== false) e.append(c);
  return e;
};
const poser = (parent, ...enfants) => parent.replaceChildren(...enfants.flat(Infinity).filter((c) => c != null && c !== false));

// ---------- dates et nombres en clair

const MOIS = [`janvier`, `février`, `mars`, `avril`, `mai`, `juin`, `juillet`, `août`, `septembre`, `octobre`, `novembre`, `décembre`];
const MOIS_C = [`janv.`, `févr.`, `mars`, `avr.`, `mai`, `juin`, `juil.`, `août`, `sept.`, `oct.`, `nov.`, `déc.`];
const JOURS = [`dimanche`, `lundi`, `mardi`, `mercredi`, `jeudi`, `vendredi`, `samedi`];
const iso = (s) => String(s ?? ``).slice(0, 10);
const jourDe = (s) => new Date(`${iso(s)}T12:00:00Z`);
const ymd = (d) => d.toISOString().slice(0, 10);
const jourMois = (s) => `${+iso(s).slice(8, 10) === 1 ? `1er` : +iso(s).slice(8, 10)} ${MOIS[+iso(s).slice(5, 7) - 1]}`;
const jourLong = (s) => `${JOURS[jourDe(s).getUTCDay()]} ${jourMois(s)}`;
const periode = (debut, fin) => `du ${jourMois(debut)}${iso(debut).slice(0, 4) === iso(fin).slice(0, 4) ? `` : ` ${iso(debut).slice(0, 4)}`} au ${jourMois(fin)} ${iso(fin).slice(0, 4)}`;
// en français, le pluriel commence à deux : « 1,5 jour »
const pluriel = (n, mot) => `${mot}${n >= 2 ? `s` : ``}`;
const unites = (n) => `${n} ${pluriel(n, `unité`)}`;
const decimal = (n) => String(Math.round(n * 10) / 10).replace(`.`, `,`);
const aujourdhui = () => { const j = new Date(); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };

// noms courts des prestations, au singulier et au pluriel (catalogue de l'offre)
const COURT = {
  post: [`publication`, `publications`], actu: [`actualité`, `actualités`], agenda: [`agenda en ligne`, `agendas en ligne`],
  presse: [`communiqué`, `communiqués`], news: [`newsletter`, `newsletters`], page: [`page du site`, `pages du site`],
  gabarit: [`visuel`, `visuels`], affiche: [`affiche`, `affiches`], flyer: [`flyer`, `flyers`], bulletin: [`page de bulletin`, `pages de bulletin`],
  photo: [`reportage photo`, `reportages photo`], point: [`réunion`, `réunions`], moder: [`suivi des messages`, `suivis des messages`],
};
const NOMS = {
  "Publication réseaux sociaux": `post`, "Actualité sur le site": `actu`, "Agenda en ligne": `agenda`, "Communiqué de presse": `presse`, Newsletter: `news`,
  "Page du site créée ou refaite": `page`, "Visuel sur gabarit": `gabarit`, "Affiche en création": `affiche`, "Flyer ou programme recto verso": `flyer`,
  "Page de bulletin ou magazine": `bulletin`, "Reportage photo": `photo`, "Réunion supplémentaire": `point`, "Suivi des messages et commentaires": `moder`,
};
const court = (id, nom, n) => { const c = COURT[id ?? NOMS[nom]]; return c ? c[n >= 2 ? 1 : 0] : String(nom ?? ``).toLowerCase(); };
const lignes = (l) => (l ?? []).map((x) => `${x.quantite} ${court(x.prestation, x.nom, x.quantite)}`).join(`, `);

const appeler = async (corps) => {
  if (demo != null) return repondreDemo(corps);
  const r = await fetch(API, { method: `POST`, headers: { "content-type": `application/json` }, body: JSON.stringify({ ...corps, [sorte]: jeton }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok && !d.etat) throw Error(d.erreur ?? `Le bilan n’a pas pu être ouvert.`);
  return d;
};

// ---------- états sans bilan à montrer

const etat = (titre, texte, action) => {
  poser(main, h(`section`, { class: `etat`, role: `status` }, h(`h2`, {}, titre), h(`p`, {}, texte), action));
  main.focus();
};
const fermes = {
  inconnu: () => etat(`Ce lien n’est pas valide.`, `Vérifiez que l’adresse est complète, ou demandez le lien à la personne qui vous l’a transmis.`),
  revoque: () => etat(`Ce lien a été retiré.`, `Le bilan n’est plus partagé par ce lien. La personne qui vous l’a transmis peut vous en dire plus.`),
};

// ---------- 1. en bref

const enBref = (d) => {
  const t = d.delais, u = d.unites;
  const cotes = [
    [`${u.utilisees}`, `sur ${u.total}`, `${pluriel(u.utilisees, `unité`)} ${pluriel(u.utilisees, `utilisée`)}`],
    t.total > 0 ? [`${t.a_la_date}`, `sur ${t.total}`, `${t.total >= 2 ? `livrées` : `livrée`} à la date annoncée`] : null,
  ].filter(Boolean);
  const validation = t.validations > 0 ? (t.validation_jours < 0.5 ? `le jour même` : `en ${decimal(t.validation_jours)} ${pluriel(t.validation_jours, `jour`)} ${pluriel(t.validation_jours, `ouvré`)}`) : null;
  return h(`section`, { class: `une`, "aria-labelledby": `t-une` },
    h(`i`, { class: `motif`, "aria-hidden": `true` }),
    h(`p`, { class: `voix` }, periode(d.debut, d.fin)),
    h(`h1`, { id: `t-une` }, `Votre mois avec Fill`),
    h(`div`, { class: `chiffres` },
      h(`p`, { class: `tete-c` }, h(`b`, {}, String(d.demandes_livrees)), h(`span`, {}, d.demandes_livrees >= 2 ? `demandes livrées` : `demande livrée`)),
      h(`ul`, { class: `cotes` }, cotes.map(([v, sur, l]) => h(`li`, {}, h(`b`, {}, v, h(`small`, {}, ` ${sur}`)), h(`span`, {}, l))))),
    validation ? h(`p`, { class: `pied-une` }, `Vous validez ${validation} en moyenne.`) : null);
};

// ---------- 2. le calendrier de la période

const calendrier = (d) => {
  const debut = jourDe(d.debut), fin = jourDe(d.fin);
  const parJour = new Map();
  for (const x of d.livre) { const k = iso(x.date); parJour.set(k, [...(parJour.get(k) ?? []), x]); }
  const premier = new Date(debut); premier.setUTCDate(premier.getUTCDate() - ((premier.getUTCDay() + 6) % 7));
  const dernier = new Date(fin); dernier.setUTCDate(dernier.getUTCDate() + ((7 - dernier.getUTCDay()) % 7));
  const grille = h(`div`, { class: `grille`, role: `group`, "aria-label": `Livraisons ${periode(d.debut, d.fin)}` });
  for (const j of [`L`, `M`, `M`, `J`, `V`, `S`, `D`]) grille.append(h(`span`, { class: `js`, "aria-hidden": `true` }, j));
  let n = 0;
  for (const x = new Date(premier); x <= dernier; x.setUTCDate(x.getUTCDate() + 1)) {
    const k = ymd(x), dans = x >= debut && x <= fin, faits = parJour.get(k), jour = x.getUTCDate();
    const mois = dans && (jour === 1 || k === iso(d.debut)) ? h(`small`, {}, MOIS_C[x.getUTCMonth()]) : null;
    if (!dans) { grille.append(h(`span`, { class: `j hors`, "aria-hidden": `true` })); continue; }
    if (!faits) { grille.append(h(`span`, { class: `j`, "aria-hidden": `true` }, mois, String(jour))); continue; }
    const retard = faits.some((f) => f.retard_jours > 0);
    grille.append(h(`button`, {
      class: `j fait${retard ? ` tard` : ``}`, type: `button`, style: `--n:${n++}`, "data-jour": k, "aria-pressed": `false`,
      "aria-label": `${jourMois(k)} : ${faits.map((f) => f.titre).join(`, `)}`,
      onclick: (e) => choisir(k, e.currentTarget),
    }, mois, String(jour), faits.length >= 2 ? h(`i`, { "aria-hidden": `true` }, String(faits.length)) : null));
  }
  const liste = h(`ol`, { class: `livres` }, d.livre.map((x) => h(`li`, { class: `livre`, "data-jour": iso(x.date) },
    h(`span`, { class: `quand` }, h(`b`, {}, String(+iso(x.date).slice(8, 10))), MOIS_C[+iso(x.date).slice(5, 7) - 1]),
    h(`div`, {},
      h(`h3`, {}, x.titre),
      h(`p`, {}, lignes(x.lignes)),
      x.retard_jours > 0
        ? h(`p`, { class: `retard` }, `Version remise ${x.retard_jours} ${pluriel(x.retard_jours, `jour`)} ${pluriel(x.retard_jours, `ouvré`)} après la date annoncée (${jourMois(x.annoncee)})`)
        : null))));
  return h(`section`, { class: `module cal`, "aria-labelledby": `t-cal` },
    h(`h2`, { id: `t-cal` }, `Le mois en calendrier`),
    d.livre.length
      ? h(`div`, { class: `cal-in` }, h(`div`, { class: `cal-g` }, grille, h(`p`, { class: `aide` }, `Touchez un jour pour retrouver ce qui a été livré.`)), liste)
      : h(`p`, { class: `vide` }, `Aucune demande n’a été livrée sur cette période.`));
};
// un jour choisi dans le calendrier : sa livraison est mise en avant dans la liste
const choisir = (k, bouton) => {
  const deja = bouton.getAttribute(`aria-pressed`) === `true`;
  for (const b of main.querySelectorAll(`.grille .fait`)) b.setAttribute(`aria-pressed`, `false`);
  for (const l of main.querySelectorAll(`.livre`)) l.classList.toggle(`choisi`, !deja && l.dataset.jour === k);
  if (deja) return;
  bouton.setAttribute(`aria-pressed`, `true`);
  main.querySelector(`.livre.choisi`)?.scrollIntoView({ behavior: calme() ? `auto` : `smooth`, block: `nearest` });
};

// ---------- 3. ce qui a été produit

const produit = (d) => (d.livrables.length
  ? h(`section`, { class: `module prod`, "aria-labelledby": `t-prod` },
      h(`h2`, { id: `t-prod` }, `Ce qui a été produit`),
      h(`ul`, { class: `tuiles`, style: `--cols:${d.livrables.length <= 3 ? d.livrables.length : d.livrables.length === 4 ? 2 : 3}` }, d.livrables.map((x, i) => h(`li`, { style: `--n:${i}` }, h(`b`, {}, String(x.quantite)), h(`span`, {}, court(x.prestation, x.nom, x.quantite))))))
  : null);

// ---------- 4. les unités

const lesUnites = (d) => {
  const u = d.unites, s = d.suivante;
  const parts = [[`u`, `utilisées`, u.utilisees], [`r`, `reportées`, u.reportees], [`e`, `expirées`, u.expirees]].filter(([, , n]) => n > 0);
  const notes = [
    `Sur ${unites(u.total)} : ${u.quota} de votre formule${u.report > 0 ? `, ${u.report} ${pluriel(u.report, `reportée`)} de la période précédente` : ``}${u.ajustements > 0 ? `, ${u.ajustements} ${pluriel(u.ajustements, `ajoutée`)} en cours de période` : ``}.`,
    u.reportees > 0 && s ? `${u.reportees >= 2 ? `Les reportées sont` : `La reportée est`} à utiliser avant le ${jourMois(s.fin)}.` : null,
    u.expirees > 0 ? `${u.expirees >= 2 ? `Les expirées venaient` : `L’expirée venait`} du report de la période précédente.` : null,
  ].filter(Boolean);
  return h(`section`, { class: `module un`, "aria-labelledby": `t-un` },
    h(`h2`, { id: `t-un` }, `Vos unités`),
    parts.length ? h(`div`, { class: `barre-u`, "aria-hidden": `true` }, parts.map(([c, , n]) => h(`i`, { class: c, style: `flex-grow:${n}` }))) : null,
    h(`ul`, { class: `legende` }, (parts.length ? parts : [[`u`, `utilisées`, 0]]).map(([c, l, n]) => h(`li`, { class: c }, h(`b`, {}, String(n)), ` ${n >= 2 ? l : l.replace(/s$/, ``)}`))),
    h(`p`, { class: `note` }, notes.join(` `)));
};

// ---------- 5. la période qui commence

// une suggestion dont la date limite de dépôt est passée ne se lance plus (la page reste ouverte des mois)
const passee = (x) => Boolean(x.limite) && iso(x.limite) < aujourdhui();
// « Lancer » ouvre la nouvelle demande pré-remplie dans l'Espace, le dossier parent de cette page
const lienLancer = (s) =>
  `../${demo != null ? `?demo` : ``}#nouvelle?titre=${encodeURIComponent(s.titre)}${s.date ? `&parution=${iso(s.date)}` : ``}&qte=${Object.entries(s.qte ?? {}).map(([id, n]) => `${encodeURIComponent(id)}:${+n}`).join(`,`)}`;

const suite = (d) => {
  const s = d.suivante, sug = d.suggestions ?? [];
  if (!s) return null;
  const report = s.report > 0 ? `, dont ${s.report} ${pluriel(s.report, `reportée`)} à utiliser avant le ${jourMois(s.fin)}` : ``;
  const solde = s.disponible > 0
    ? `Vous disposez de ${unites(s.disponible)}${report}.${s.creditee === false ? ` Les unités de votre formule s’y ajoutent dès le règlement de la période.` : ``}`
    : s.creditee === false ? `Les unités de cette période seront créditées dès son règlement.` : `Les unités de cette période sont déjà engagées.`;
  const enCours = (d.en_cours ?? []).length
    ? h(`p`, { class: `encours` }, `En cours : `, d.en_cours.map((x, i) => [i ? `, ` : ``, h(`b`, {}, x.titre), x.livraison ? ` (version le ${jourMois(x.livraison)})` : ``]), `.`)
    : null;
  return h(`section`, { class: `module suite`, "aria-labelledby": `t-suite` },
    h(`i`, { class: `motif`, "aria-hidden": `true` }),
    h(`p`, { class: `voix` }, periode(s.debut, s.fin)),
    h(`h2`, { id: `t-suite` }, sug.length ? `Pour la période qui commence` : `La période qui commence`),
    h(`p`, { class: `solde` }, solde),
    enCours,
    sug.length ? h(`ul`, { class: `idees` }, sug.map((x, i) => {
      const fini = passee(x);
      return h(`li`, { class: `idee${fini ? ` finie` : ``}`, style: `--n:${i}` },
        x.date
          ? h(`span`, { class: `feuillet`, "aria-hidden": `true` }, h(`small`, {}, MOIS_C[+iso(x.date).slice(5, 7) - 1]), h(`b`, {}, String(+iso(x.date).slice(8, 10))))
          : h(`span`, { class: `feuillet libre`, "aria-hidden": `true` }, h(`small`, {}, `date`), h(`b`, {}, `libre`)),
        h(`div`, { class: `corps` },
          h(`h3`, { id: `s-${i}` }, x.titre),
          h(`p`, {}, `${x.libelle}, ${unites(x.unites)}.${x.source === `historique` && x.pourquoi ? ` ${x.pourquoi}` : ``}`),
          x.limite ? h(`p`, { class: `limite` }, fini ? `Le délai de ce sujet est passé : il était à déposer avant le ${jourLong(x.limite)}.` : `À déposer au plus tard le ${jourLong(x.limite)}.`) : null,
          fini ? null : h(`a`, { class: `bt`, href: lienLancer(x), id: `l-${i}`, "aria-labelledby": `l-${i} s-${i}` }, `Lancer`, h(`span`, { class: `fl`, "aria-hidden": `true` }))));
    })) : null,
    sug.some((x) => !passee(x)) ? h(`p`, { class: `note` }, `« Lancer » ouvre la demande déjà remplie dans votre espace. Rien n’est engagé tant qu’elle n’est pas envoyée.`) : null);
};

// ---------- la page

const afficher = (r) => {
  if (r.etat !== `ouvert`) return (fermes[r.etat] ?? fermes.inconnu)();
  const d = r.donnees, apercu = r.mode === `relecture`;
  document.documentElement.dataset.cible = d.organisation.type === `entreprise` ? `e` : `c`;
  document.getElementById(`client`).textContent = d.organisation.nom ?? ``;
  document.title = `Votre mois avec Fill, ${periode(d.debut, d.fin)}`;
  poser(main,
    apercu ? h(`p`, { class: `apercu`, role: `status` }, h(`b`, {}, r.envoye_le ? `Bilan envoyé` : `Aperçu avant envoi`),
      r.envoye_le ? ` Il est parti le ${jourMois(r.envoye_le)}${r.referent ? ` à ${r.referent}` : ``}.` : ` Il part${r.referent ? ` à ${r.referent}` : ``} dès que vous le validez dans Hors-champ.`) : null,
    enBref(d), calendrier(d), produit(d), lesUnites(d), suite(d),
    h(`p`, { class: `pied` }, `Bilan établi le ${jourMois(r.calcule_le)} ${iso(r.calcule_le).slice(0, 4)}, à partir de votre espace Fill. Cette page s’ouvre sans compte : toute personne qui a ce lien peut la lire.`));
  if (!calme()) document.documentElement.classList.add(`entre`);
};

// ---------- démonstration : une commune fictive, rien n'est envoyé

const repondreDemo = async () => {
  await new Promise((r) => setTimeout(r, 250));
  const jour = (n) => { const j = new Date(); j.setHours(12, 0, 0, 0); j.setDate(j.getDate() + n); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  const mois = (n) => { const a = new Date(); const j = new Date(a.getFullYear(), a.getMonth() + n, 1, 12); j.setDate(Math.min(a.getDate(), new Date(j.getFullYear(), j.getMonth() + 1, 0).getDate())); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  // jour ouvré le plus proche avant une date (la démonstration ne connaît pas les jours fériés)
  const ouvre = (s) => { const j = new Date(`${s}T12:00:00`); while (j.getDay() === 0 || j.getDay() === 6) j.setDate(j.getDate() - 1); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  const apres = (s, n) => { const j = new Date(`${s}T12:00:00`); while (n > 0) { j.setDate(j.getDate() + 1); if (j.getDay() !== 0 && j.getDay() !== 6) n--; } return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  const annoncee = ouvre(jour(-21));
  const debut = mois(-1), fin = jour(-1), finSuivante = (() => { const j = new Date(`${mois(1)}T12:00:00`); j.setDate(j.getDate() - 1); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; })();
  return {
    etat: `ouvert`, mode: demo === `relecture` ? `relecture` : `partage`, calcule_le: jour(0), espace: `..`,
    ...(demo === `relecture` ? { referent: `Yann Le Gall`, envoye_le: null } : {}),
    donnees: {
      organisation: { nom: `Commune de Saint-Ivenec`, type: `collectivite`, formule: `essentiel` },
      periode: debut.slice(0, 7), debut, fin,
      demandes_livrees: 5,
      unites: { quota: 10, report: 2, ajustements: 0, total: 12, utilisees: 10, reservees: 1, reportees: 2, expirees: 0 },
      delais: { a_la_date: 4, total: 5, sans_date: 0, validations: 5, validation_jours: 1.3 },
      livrables: [
        { prestation: `post`, nom: `Publication réseaux sociaux`, quantite: 5 },
        { prestation: `actu`, nom: `Actualité sur le site`, quantite: 2 },
        { prestation: `news`, nom: `Newsletter`, quantite: 1 },
      ],
      livre: [
        { numero: 41, titre: `Forum des associations : annonce`, date: ouvre(jour(-24)), unites: 3, annoncee: ouvre(jour(-26)), remise: ouvre(jour(-26)), retard_jours: 0, lignes: [{ prestation: `post`, nom: `Publication réseaux sociaux`, quantite: 2 }, { prestation: `actu`, nom: `Actualité sur le site`, quantite: 1 }] },
        { numero: 42, titre: `Travaux de la rue du Stade`, date: apres(annoncee, 3), unites: 2, annoncee, remise: apres(annoncee, 2), retard_jours: 2, lignes: [{ prestation: `post`, nom: `Publication réseaux sociaux`, quantite: 1 }, { prestation: `actu`, nom: `Actualité sur le site`, quantite: 1 }] },
        { numero: 43, titre: `Lettre aux habitants`, date: ouvre(jour(-9)), unites: 3, annoncee: ouvre(jour(-12)), remise: ouvre(jour(-12)), retard_jours: 0, lignes: [{ prestation: `news`, nom: `Newsletter`, quantite: 1 }] },
        { numero: 44, titre: `Collecte des encombrants`, date: ouvre(jour(-3)), unites: 1, annoncee: ouvre(jour(-5)), remise: ouvre(jour(-5)), retard_jours: 0, lignes: [{ prestation: `post`, nom: `Publication réseaux sociaux`, quantite: 1 }] },
        { numero: 45, titre: `Fermeture de la piscine`, date: ouvre(jour(-3)), unites: 1, annoncee: ouvre(jour(-4)), remise: ouvre(jour(-4)), retard_jours: 0, lignes: [{ prestation: `post`, nom: `Publication réseaux sociaux`, quantite: 1 }] },
      ],
      en_cours: [{ titre: `Agenda des animations`, statut: `production`, livraison: apres(jour(0), 2) }],
      suivante: { periode: jour(0).slice(0, 7), debut: jour(0), fin: finSuivante, creditee: true, en_attente: 0, disponible: 12, report: 2 },
      suggestions: [
        { cle: `c-1`, source: `calendrier`, titre: `Lettre aux habitants`, date: jour(16), qte: { news: 1 }, libelle: `Newsletter`, unites: 3, limite: ouvre(jour(7)), pourquoi: `Repère du calendrier type des communes.` },
        { cle: `h-1`, source: `historique`, titre: `Programme des animations de fin d’année`, date: jour(22), qte: { flyer: 1, post: 1 }, libelle: `Programme recto verso et publication`, unites: 6, limite: ouvre(jour(13)), pourquoi: `Vous l’aviez demandé l’an passé à la même période.` },
        { cle: `c-2`, source: `calendrier`, titre: `Horaires de la mairie pendant les congés`, date: jour(26), qte: { post: 1, actu: 1 }, libelle: `Publication et actualité`, unites: 2, limite: ouvre(jour(21)), pourquoi: `Repère du calendrier type des communes.` },
      ],
    },
  };
};

// ---------- départ

(async () => {
  if (demo == null && !JETON.test(jeton ?? ``)) return fermes.inconnu();
  try {
    afficher(await appeler({ action: `lire` }));
  } catch {
    etat(`Connexion impossible.`, `Le bilan n’a pas pu être ouvert. Vérifiez votre connexion, puis réessayez.`, h(`button`, { class: `bt`, type: `button`, onclick: () => location.reload() }, `Réessayer`));
  }
})();
