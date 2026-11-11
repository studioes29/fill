// Page de bilan par lien : ce que Fill a livré sur une période d'abonnement, et trois suggestions pour la suivante.
// Sans compte. Le jeton est lu dans le fragment de l'adresse et n'est envoyé qu'en POST à la fonction « bilan » :
//   #j=…  lien de partage, celui du mail « Votre mois avec Fill » ;
//   #r=…  lien de relecture de Fill, avant envoi (accord, suggestion retirée).
// Tout texte venu de la base est posé avec textContent : jamais de HTML interprété.
// « ?demo » montre la page avec une commune fictive, « ?demo=relecture » la relecture avant envoi ; rien n'est envoyé.

const API = `https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/bilan`;
const JETON = /^[A-Za-z0-9_-]{43}$/;

const main = document.getElementById(`contenu`);
const demo = new URLSearchParams(location.search).get(`demo`);
const [, sorte, jeton] = location.hash.match(/(?:^#|&)([jr])=([A-Za-z0-9_-]+)/) ?? [];

// petit constructeur d'éléments : h(`p`, { class: `x` }, `texte`, enfant…)
const h = (balise, attributs = {}, ...enfants) => {
  const e = document.createElement(balise);
  for (const [k, v] of Object.entries(attributs)) {
    if (v === false || v == null) continue;
    if (k === `class`) e.className = v;
    else if (k.startsWith(`on`)) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, ``);
    else e.setAttribute(k, v);
  }
  for (const c of enfants.flat()) if (c != null && c !== false) e.append(c);
  return e;
};
const poser = (parent, ...enfants) => parent.replaceChildren(...enfants.flat().filter((c) => c != null && c !== false));

// ---------- dates et nombres en clair

const MOIS = [`janvier`, `février`, `mars`, `avril`, `mai`, `juin`, `juillet`, `août`, `septembre`, `octobre`, `novembre`, `décembre`];
const JOURS = [`dimanche`, `lundi`, `mardi`, `mercredi`, `jeudi`, `vendredi`, `samedi`];
const iso = (s) => String(s ?? ``).slice(0, 10);
const jourMois = (s) => `${+iso(s).slice(8, 10) === 1 ? `1er` : +iso(s).slice(8, 10)} ${MOIS[+iso(s).slice(5, 7) - 1]}`;
const jourLong = (s) => `${JOURS[new Date(`${iso(s)}T00:00:00Z`).getUTCDay()]} ${jourMois(s)}`;
const periode = (debut, fin) => `du ${jourMois(debut)}${iso(debut).slice(0, 4) === iso(fin).slice(0, 4) ? `` : ` ${iso(debut).slice(0, 4)}`} au ${jourMois(fin)} ${iso(fin).slice(0, 4)}`;
// en français, le pluriel commence à deux : « 1,5 jour »
const pluriel = (n, mot) => `${mot}${n >= 2 ? `s` : ``}`;
const unites = (n) => `${n} ${pluriel(n, `unité`)}`;
const decimal = (n) => String(Math.round(n * 10) / 10).replace(`.`, `,`);

const appeler = async (corps) => {
  if (demo != null) return repondreDemo(corps);
  const r = await fetch(API, { method: `POST`, headers: { "content-type": `application/json` }, body: JSON.stringify({ ...corps, [sorte]: jeton }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok && !d.etat) throw Error(d.erreur ?? `Cette action n’a pas pu aboutir. Réessayez dans un instant.`);
  return d;
};

// ---------- états sans bilan à montrer

const etat = (titre, texte, action) => {
  document.querySelector(`.barre`)?.remove();
  main.classList.remove(`avec-barre`);
  poser(main, h(`section`, { class: `etat`, role: `status` }, h(`h2`, {}, titre), h(`p`, {}, texte), action));
  main.focus();
  window.scrollTo({ top: 0 });
};
const fermes = {
  inconnu: () => etat(`Ce lien n’est pas valide.`, `Vérifiez que l’adresse est complète, ou demandez le lien à la personne qui vous l’a transmis.`),
  revoque: () => etat(`Ce lien a été retiré.`, `Le bilan n’est plus partagé par ce lien. La personne qui vous l’a transmis peut vous en dire plus.`),
};

// ---------- les blocs du bilan

const troisChiffres = (d) => [
  [String(d.demandes_livrees), d.demandes_livrees > 1 ? `demandes livrées` : `demande livrée`],
  [String(d.unites.utilisees), `${pluriel(d.unites.utilisees, `unité`)} ${pluriel(d.unites.utilisees, `utilisée`)} sur ${d.unites.total}`],
  d.delais.total > 0
    ? [`${d.delais.a_la_date} sur ${d.delais.total}`, d.delais.total > 1 ? `livrées à la date annoncée` : `livrée à la date annoncée`]
    : [String(d.unites.reportees), `${pluriel(d.unites.reportees, `unité`)} ${pluriel(d.unites.reportees, `reportée`)} sur la période suivante`],
];

const blocUnites = (d) => {
  const u = d.unites, s = d.suivante;
  const parts = [
    [`p-u`, `Utilisées`, u.utilisees, u.reservees > 0 ? `dont ${u.reservees} ${pluriel(u.reservees, `réservée`)} pour une demande en cours` : null],
    [`p-r`, `Reportées sur la période suivante`, u.reportees, u.reportees > 0 && s ? `à utiliser avant le ${jourMois(s.fin)}` : null],
    [`p-e`, `Expirées`, u.expirees, u.expirees > 0 ? `report de la période précédente, non utilisé` : null],
  ];
  const barre = h(`div`, { class: `barre-unites`, "aria-hidden": `true` });
  for (const [classe, , n] of parts) if (n > 0) { const i = h(`i`, { class: classe }); i.style.flexGrow = String(n); barre.append(i); }
  const origine = [`${u.quota} de votre formule`, u.report > 0 ? `${u.report} ${pluriel(u.report, `reportée`)} de la période précédente` : null, u.ajustements > 0 ? `${u.ajustements} ${pluriel(u.ajustements, `ajoutée`)} en cours de période` : u.ajustements < 0 ? `${-u.ajustements} ${pluriel(-u.ajustements, `retirée`)} en cours de période` : null].filter(Boolean);
  return h(`section`, { "aria-labelledby": `t-unites` },
    h(`h2`, { id: `t-unites` }, `Unités`),
    h(`div`, { class: `bloc` },
      barre.childNodes.length ? barre : null,
      h(`ul`, { class: `parts` }, parts.map(([classe, nom, n, detail]) => h(`li`, {}, h(`i`, { class: classe, "aria-hidden": `true` }), h(`span`, {}, nom, detail ? h(`small`, {}, detail) : null), h(`b`, {}, String(n)))))),
    h(`p`, { class: `note` }, `Sur ${unites(u.total)} : ${origine.join(`, `)}.`));
};

const blocDelais = (d) => {
  const t = d.delais, v = t.validation_jours;
  const validation = t.validations > 0 ? (v < 0.5 ? `Le jour même` : `${decimal(v)} ${pluriel(v, `jour`)} ${pluriel(v, `ouvré`)}`) : null;
  if (!t.total && !validation) return null;
  return h(`section`, { "aria-labelledby": `t-delais` },
    h(`h2`, { id: `t-delais` }, `Délais`),
    h(`dl`, { class: `bloc delais` },
      t.total ? h(`div`, {}, h(`dt`, {}, `Livrées à la date annoncée`), h(`dd`, {}, `${t.a_la_date} ${pluriel(t.a_la_date, `demande`)} sur ${t.total}`)) : null,
      validation ? h(`div`, {}, h(`dt`, {}, `Votre validation, en moyenne`), h(`dd`, {}, validation)) : null),
    t.total ? h(`p`, { class: `note` }, `La date annoncée est celle où Fill vous remet la version à relire.${t.sans_date > 0 ? ` ${t.sans_date} ${pluriel(t.sans_date, `demande`)} sans date annoncée (date fixée ensemble) ${t.sans_date > 1 ? `ne sont pas comptées` : `n’est pas comptée`}.` : ``}`) : null);
};

const lignes = (l) => (l ?? []).map((x) => (x.quantite > 1 ? `${x.nom} × ${x.quantite}` : x.nom)).join(`, `);
const blocLivre = (d) =>
  h(`section`, { "aria-labelledby": `t-livre` },
    h(`h2`, { id: `t-livre` }, `Ce qui a été livré`),
    d.livre.length
      ? h(`ul`, { class: `livres` }, d.livre.map((x) => h(`li`, { class: `livre` },
          h(`p`, { class: `quand` }, `Livrée le ${jourMois(x.date)}`),
          h(`h3`, {}, x.titre),
          h(`p`, { class: `quoi` }, [lignes(x.lignes), x.unites != null ? unites(x.unites) : null].filter(Boolean).join(` · `)),
          x.retard_jours > 0
            ? h(`p`, { class: `retard` }, `Version remise le ${jourMois(x.remise)}, annoncée le ${jourMois(x.annoncee)} : ${x.retard_jours} ${pluriel(x.retard_jours, `jour`)} ${pluriel(x.retard_jours, `ouvré`)} de retard`)
            : x.retard_jours === 0 ? h(`p`, { class: `tenue` }, `Version remise à la date annoncée`) : null)))
      : h(`p`, { class: `vide` }, `Aucune demande n’a été livrée sur cette période.`));

const blocTypes = (d) => d.livrables.length > 1
  ? h(`section`, { "aria-labelledby": `t-types` },
      h(`h2`, { id: `t-types` }, `Livrables par type`),
      h(`ul`, { class: `bloc types` }, d.livrables.map((x) => h(`li`, {}, h(`span`, {}, x.nom), h(`b`, {}, String(x.quantite))))))
  : null;

const blocEnCours = (d) => (d.en_cours ?? []).length
  ? h(`section`, { "aria-labelledby": `t-encours` },
      h(`h2`, { id: `t-encours` }, `En cours à la fin de la période`),
      h(`ul`, { class: `bloc encours` }, d.en_cours.map((x) => h(`li`, {}, h(`span`, {}, x.titre), x.livraison ? h(`span`, {}, `version prévue le ${jourMois(x.livraison)}`) : null))))
  : null;

// « Lancer » ouvre la nouvelle demande pré-remplie dans l'Espace, le dossier parent de cette page
const lienLancer = (s) =>
  `../${demo != null ? `?demo` : ``}#nouvelle?titre=${encodeURIComponent(s.titre)}${s.date ? `&parution=${iso(s.date)}` : ``}&qte=${Object.entries(s.qte ?? {}).map(([id, n]) => `${encodeURIComponent(id)}:${+n}`).join(`,`)}`;

const blocSuite = (d, relecture) => {
  const s = d.suivante, sug = d.suggestions ?? [];
  if (!s) return null;
  const report = s.report > 0 ? `, dont ${s.report} ${pluriel(s.report, `reportée`)} à utiliser avant le ${jourMois(s.fin)}` : ``;
  return h(`section`, { class: `suite`, "aria-labelledby": `t-suite` },
    h(`h2`, { id: `t-suite` }, `Pour la période qui commence`),
    h(`p`, { class: `solde` }, s.disponible > 0
      ? `${periode(s.debut, s.fin).replace(/^d/, `D`)}, vous disposez de ${unites(s.disponible)}${report}.${sug.length ? ` ${sug.length > 1 ? `${sug.length} sujets y tiennent` : `Un sujet y tient`}.` : ``}`
      : `${periode(s.debut, s.fin).replace(/^d/, `D`)}. Les unités de cette période ne sont pas encore créditées.`),
    sug.length ? h(`ul`, { class: `suggestions` }, sug.map((x, i) => h(`li`, {}, h(`article`, { class: `suggestion`, "data-cle": x.cle },
      relecture ? h(`label`, { class: `garder` }, h(`input`, { type: `checkbox`, checked: true, value: x.cle }), `Garder cette suggestion`) : null,
      h(`header`, {}, h(`h3`, { id: `s-${i}` }, x.titre), h(`span`, { class: `cout` }, unites(x.unites))),
      h(`p`, {}, `${x.libelle}. ${x.pourquoi ?? ``}`.trim()),
      x.limite ? h(`p`, { class: `limite` }, `À déposer au plus tard le ${jourLong(x.limite)}.`) : null,
      relecture ? null : h(`a`, { class: `bt`, href: lienLancer(x), id: `l-${i}`, "aria-labelledby": `l-${i} s-${i}` }, `Lancer`))))) : null,
    sug.length && !relecture ? h(`p`, { class: `note` }, `« Lancer » ouvre la demande déjà remplie dans votre espace. Rien n’est engagé tant qu’elle n’est pas envoyée.`) : null);
};

// ---------- page ouverte

const afficher = (r) => {
  if (r.etat !== `ouvert`) return (fermes[r.etat] ?? fermes.inconnu)();
  const d = r.donnees, relecture = r.mode === `relecture`;
  document.documentElement.dataset.cible = d.organisation.type === `entreprise` ? `e` : `c`;
  document.getElementById(`client`).textContent = d.organisation.nom ?? ``;
  document.title = `Bilan ${periode(d.debut, d.fin)} · Fill`;
  const parti = relecture && (r.envoye_le || r.en_cours_d_envoi);
  poser(main,
    relecture ? h(`div`, { class: `avant${r.envoye_le ? ` fait` : ``}`, role: `status`, id: `avant` },
      r.envoye_le ? [h(`b`, {}, `Bilan envoyé`), `Il est parti le ${jourMois(r.envoye_le)}${r.referent ? ` à ${r.referent}` : ``}. Cette page le montre tel qu’il a été envoyé.`]
        : r.en_cours_d_envoi ? [h(`b`, {}, `Envoi à vérifier`), `L’envoi a commencé sans confirmation du service d’envoi. Il n’est pas retenté tant qu’il n’est pas libéré.`]
        : r.approuve_le ? [h(`b`, {}, `Accord enregistré`), `Le mail part${r.referent ? ` à ${r.referent}` : ``} au prochain passage, un jour ouvré entre 8 h et 20 h.`]
        : [h(`b`, {}, `Relecture avant envoi`), `Ce bilan n’est pas encore parti. ${r.referent ? `${r.referent} le reçoit` : `Le référent le reçoit`} après votre accord, avec les suggestions que vous gardez.`]) : null,
    h(`span`, { class: `sur` }, `Bilan de période`),
    h(`h1`, {}, periode(d.debut, d.fin)),
    h(`p`, { class: `contexte` }, `Ce que Fill a livré pour ${d.organisation.nom} sur cette période d’abonnement.`),
    h(`ul`, { class: `chiffres`, "aria-label": `En trois chiffres` }, troisChiffres(d).map(([valeur, libelle]) => h(`li`, { class: `chiffre` }, h(`b`, {}, valeur), ` `, h(`span`, {}, libelle)))),
    blocLivre(d), blocTypes(d), blocDelais(d), blocUnites(d), blocEnCours(d), blocSuite(d, relecture && !parti && !r.approuve_le),
    h(`p`, { class: `pied` }, relecture ? `Bilan calculé le ${jourMois(r.calcule_le)} ${iso(r.calcule_le).slice(0, 4)}. Ce lien de relecture est réservé à Fill.` : `Bilan figé le ${jourMois(r.calcule_le)} ${iso(r.calcule_le).slice(0, 4)}. Cette page s’ouvre sans compte : toute personne qui a ce lien peut la lire.`));
  if (relecture && !parti && !r.approuve_le) barre(r);
};

// relecture par Fill : l'accord, en bas d'écran, demande une confirmation
const barre = (r) => {
  document.querySelector(`.barre`)?.remove();
  main.classList.add(`avec-barre`);
  const dans = h(`div`, { class: `dans` }), zone = h(`div`, { class: `barre`, role: `region`, "aria-label": `Votre accord` }, dans);
  const erreur = h(`p`, { class: `erreur`, role: `alert`, hidden: true });
  const dire = (m) => { erreur.textContent = m ?? ``; erreur.hidden = !m; };
  const qui = r.referent ?? `le référent`;
  const retirees = () => [...main.querySelectorAll(`.garder input`)].filter((c) => !c.checked).map((c) => c.value);
  const depart = () => poser(dans, h(`div`, { class: `choix seul` }, h(`button`, { class: `bt`, type: `button`, onclick: confirmer }, `Envoyer à ${qui}`)), erreur);
  const confirmer = () => {
    const n = retirees().length;
    const oui = h(`button`, { class: `bt`, type: `button`, onclick: async () => {
      dire(); oui.disabled = true;
      try {
        const rep = await appeler({ action: `approuver`, retirer: retirees() });
        zone.remove(); main.classList.remove(`avec-barre`);
        main.querySelectorAll(`.garder input`).forEach((c) => { c.disabled = true; });
        const bandeau = document.getElementById(`avant`);
        bandeau.className = `avant fait`;
        poser(bandeau, h(`b`, {}, rep.envoye ? `Bilan envoyé` : `Accord enregistré`), rep.envoye ? `Le mail est parti à ${rep.a ?? qui}.` : `Le mail part à ${qui} au prochain passage, un jour ouvré entre 8 h et 20 h.`);
        bandeau.scrollIntoView({ block: `start` });
      } catch (e) { oui.disabled = false; dire(e.message); }
    } }, `Oui, envoyer`);
    poser(dans, h(`p`, { class: `question`, id: `q-envoi` }, `Envoyer ce bilan à ${qui}${n ? `, sans ${n > 1 ? `les ${n} suggestions retirées` : `la suggestion retirée`}` : ``} ?`),
      h(`div`, { class: `choix`, role: `group`, "aria-labelledby": `q-envoi` }, h(`button`, { class: `bt cl`, type: `button`, onclick: depart }, `Retour`), oui), erreur);
    oui.focus();
  };
  depart();
  document.body.append(zone);
};

// ---------- démonstration : une commune fictive, rien n'est envoyé

const repondreDemo = async (corps) => {
  await new Promise((r) => setTimeout(r, 300));
  if (corps.action === `approuver`) return { ok: true, envoye: true, a: `Yann Le Gall` };
  const jour = (n) => { const j = new Date(); j.setHours(12, 0, 0, 0); j.setDate(j.getDate() + n); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  const mois = (n) => { const a = new Date(); const j = new Date(a.getFullYear(), a.getMonth() + n, 1, 12); j.setDate(Math.min(a.getDate(), new Date(j.getFullYear(), j.getMonth() + 1, 0).getDate())); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  // jour ouvré le plus proche avant une date (la démonstration ne connaît pas les jours fériés)
  const ouvre = (s) => { const j = new Date(`${s}T12:00:00`); while (j.getDay() === 0 || j.getDay() === 6) j.setDate(j.getDate() - 1); return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  const apres = (s, n) => { const j = new Date(`${s}T12:00:00`); while (n > 0) { j.setDate(j.getDate() + 1); if (j.getDay() !== 0 && j.getDay() !== 6) n--; } return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, `0`)}-${String(j.getDate()).padStart(2, `0`)}`; };
  const annoncee = ouvre(jour(-21));
  const debut = mois(-1), fin = jour(-1), finSuivante = (() => { const j = new Date(`${mois(1)}T12:00:00`); j.setDate(j.getDate() - 1); return iso(j.toISOString()); })();
  return {
    etat: `ouvert`, mode: demo === `relecture` ? `relecture` : `partage`, calcule_le: jour(0), espace: `..`,
    ...(demo === `relecture` ? { referent: `Yann Le Gall`, approuve_le: null, envoye_le: null, en_cours_d_envoi: false } : {}),
    donnees: {
      organisation: { nom: `Commune de Saint-Ivenec`, type: `collectivite`, formule: `essentiel` },
      periode: debut.slice(0, 7), debut, fin,
      demandes_livrees: 4,
      unites: { quota: 10, report: 2, ajustements: 0, total: 12, utilisees: 10, reservees: 1, reportees: 2, expirees: 0 },
      delais: { a_la_date: 3, total: 4, sans_date: 0, validations: 4, validation_jours: 1.3 },
      livrables: [
        { prestation: `post`, nom: `Publication réseaux sociaux`, quantite: 4 },
        { prestation: `actu`, nom: `Actualité sur le site`, quantite: 2 },
        { prestation: `news`, nom: `Newsletter`, quantite: 1 },
      ],
      livre: [
        { numero: 41, titre: `Forum des associations : annonce`, date: ouvre(jour(-24)), unites: 3, annoncee: ouvre(jour(-26)), remise: ouvre(jour(-26)), retard_jours: 0, lignes: [{ nom: `Publication réseaux sociaux`, quantite: 2 }, { nom: `Actualité sur le site`, quantite: 1 }] },
        { numero: 42, titre: `Travaux de la rue du Stade`, date: apres(annoncee, 3), unites: 2, annoncee, remise: apres(annoncee, 2), retard_jours: 2, lignes: [{ nom: `Publication réseaux sociaux`, quantite: 1 }, { nom: `Actualité sur le site`, quantite: 1 }] },
        { numero: 43, titre: `Lettre aux habitants`, date: ouvre(jour(-9)), unites: 3, annoncee: ouvre(jour(-12)), remise: ouvre(jour(-12)), retard_jours: 0, lignes: [{ nom: `Newsletter`, quantite: 1 }] },
        { numero: 44, titre: `Collecte des encombrants`, date: ouvre(jour(-3)), unites: 1, annoncee: ouvre(jour(-5)), remise: ouvre(jour(-5)), retard_jours: 0, lignes: [{ nom: `Publication réseaux sociaux`, quantite: 1 }] },
      ],
      en_cours: [{ titre: `Agenda des animations`, statut: `production`, livraison: apres(jour(0), 2) }],
      suivante: { periode: jour(0).slice(0, 7), debut: jour(0), fin: finSuivante, disponible: 12, report: 2 },
      suggestions: [
        { cle: `h-1`, source: `historique`, titre: `Programme des animations de fin d’année`, date: jour(22), qte: { flyer: 1, post: 1 }, libelle: `Programme recto verso et publication`, unites: 6, limite: ouvre(jour(13)), pourquoi: `Vous l’aviez demandé l’an passé, pour le ${jourMois(jour(22))}.` },
        { cle: `c-1`, source: `calendrier`, titre: `Lettre aux habitants`, date: jour(16), qte: { news: 1 }, libelle: `Newsletter`, unites: 3, limite: ouvre(jour(7)), pourquoi: `Repère du calendrier type : autour du ${jourMois(jour(16))}.` },
        { cle: `c-2`, source: `calendrier`, titre: `Horaires de la mairie pendant les congés`, date: jour(26), qte: { post: 1, actu: 1 }, libelle: `Publication et actualité`, unites: 2, limite: ouvre(jour(21)), pourquoi: `Repère du calendrier type : autour du ${jourMois(jour(26))}.` },
      ],
    },
  };
};

// ---------- départ

(async () => {
  if (demo == null && !JETON.test(jeton ?? ``)) return fermes.inconnu();
  try {
    afficher(await appeler({ action: `lire` }));
  } catch (e) {
    etat(`Connexion impossible.`, `Le bilan n’a pas pu être ouvert. Vérifiez votre connexion, puis réessayez.`, h(`button`, { class: `bt`, type: `button`, onclick: () => location.reload() }, `Réessayer`));
  }
})();
