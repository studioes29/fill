// Page de relecture par lien : un livrable à relire, deux réponses, sans compte.
// Le jeton est lu dans le fragment de l'adresse (#j=…) et n'est envoyé qu'en POST à la fonction « relecture ».
// Tout texte venu de la base est posé avec textContent : jamais de HTML interprété.
// « ?demo », « ?demo=avis » ou « ?demo=delegation » montrent la page sans rien envoyer.

const API = `https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/relecture`;
const JETON = /^[A-Za-z0-9_-]{43}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TYPES = { email: `Newsletter`, web: `Page du site`, post: `Publication`, story: `Story`, affiche: `Affiche`, visuel: `Visuel`, pdf: `Document`, video: `Vidéo`, photos: `Reportage` };

const main = document.getElementById(`contenu`);
const demo = new URLSearchParams(location.search).get(`demo`);
const jeton = (location.hash.match(/j=([A-Za-z0-9_-]+)/) ?? [])[1] ?? ``;

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
const date = (iso) => new Date(`${String(iso).slice(0, 10)}T12:00:00`).toLocaleDateString(`fr-FR`, { weekday: `long`, day: `numeric`, month: `long` });
const heure = (t) => (t ? ` à ${String(t).replace(/:00$/, ` h`).replace(`:`, ` h `)}` : ``);

const appeler = async (corps) => {
  if (demo != null) return repondreDemo(corps);
  const r = await fetch(API, { method: `POST`, headers: { "content-type": `application/json` }, body: JSON.stringify({ ...corps, j: jeton }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok && !d.etat) throw Error(d.erreur ?? `Cette action n’a pas pu aboutir. Réessayez dans un instant.`);
  return d;
};

// ---------- livrables

const typeDe = (f) => f.type ?? (/\.(mp4|mov)$/i.test(f.nom ?? ``) ? `video` : /\.pdf$/i.test(f.nom ?? ``) ? `pdf` : `visuel`);
const image = (src, alt) => h(`figure`, { class: `image` }, h(`img`, { src, alt, loading: `lazy`, decoding: `async` }));

const livrable = (f, n) => {
  const type = typeDe(f), nom = TYPES[type] ?? `Fichier`, c = f.contenu, corps = h(`div`, { class: `corps` });
  const images = [...(Array.isArray(f.srcs) ? f.srcs : []), ...(f.src && type !== `pdf` && type !== `video` ? [f.src] : [])];
  if (type === `video` && f.src) corps.append(h(`video`, { src: f.src, controls: true, playsinline: true, preload: `metadata` }));
  images.forEach((src, i) => corps.append(image(src, `${nom} ${n}${images.length > 1 ? `, image ${i + 1}` : ``}`)));
  if (c) {
    if (c.titre) corps.append(h(`h3`, {}, c.titre));
    if (c.chapo) corps.append(h(`p`, { class: `chapo` }, c.chapo));
    for (const p of c.corps ?? []) corps.append(h(`p`, {}, p));
    for (const s of c.sections ?? []) {
      if (s.titre) corps.append(h(`h4`, {}, s.titre));
      if (s.image) corps.append(image(s.image, s.titre ?? `Illustration`));
      if (s.texte) corps.append(h(`p`, {}, s.texte));
    }
  }
  if (f.legende) corps.append(h(`div`, { class: `legende` }, h(`small`, {}, type === `post` || type === `story` ? `Texte de la publication` : `Légende`), h(`p`, {}, f.legende)));
  if (type === `pdf` && f.src) corps.append(h(`a`, { class: `bt cl`, href: f.src, target: `_blank`, rel: `noopener` }, `Ouvrir le document`));
  if (!corps.childNodes.length) corps.append(h(`p`, { class: `absent` }, `Ce fichier ne peut pas être affiché ici.`));
  return h(`li`, {}, h(`article`, { class: `livrable` }, h(`header`, {}, h(`b`, {}, nom), h(`span`, {}, f.nom ?? ``)), corps));
};

// ---------- états sans réponse possible

const etat = (titre, texte, action, fait = false) => {
  document.querySelector(`.barre`)?.remove();
  const bloc = h(`section`, { class: `etat${fait ? ` fait` : ``}`, role: `status` }, h(`h2`, {}, titre), h(`p`, {}, texte), action);
  poser(main, bloc);
  main.focus();
  window.scrollTo({ top: 0 });
};
const versEspace = (d) => (d?.espace ? h(`a`, { class: `bt cl`, href: `${d.espace}/` }, `Ouvrir mon espace`) : null);

const fermes = {
  inconnu: () => etat(`Ce lien n’est pas valide.`, `Vérifiez que l’adresse est complète, ou demandez un nouveau lien à la personne qui vous l’a envoyé.`),
  expire: (d) => etat(`Ce lien a expiré.`, d.usage === `referent` ? `La version reste à relire dans votre espace.` : `Demandez un nouveau lien à ${d.demandeur ?? `la personne qui vous l’a envoyé`}.`, d.usage === `referent` ? versEspace(d) : null),
  repondu: (d) => etat(`Votre réponse est enregistrée.`, d.reponse === `correction` ? `Vous avez demandé des corrections sur « ${d.demande.titre} ».` : `Vous avez donné votre accord sur « ${d.demande.titre} ».`),
  depasse: (d) => etat(`Cette version n’attend plus de réponse.`, `Une décision a été prise sur « ${d.demande.titre} », ou une nouvelle version la remplace.`, d.usage === `referent` ? versEspace(d) : null),
  revoque: () => etat(`Ce lien a été retiré.`, `La personne qui vous l’avait envoyé n’attend plus de réponse de votre part.`),
};

// ---------- page ouverte

const afficher = (d) => {
  document.documentElement.dataset.cible = d.cible === `e` ? `e` : `c`;
  document.getElementById(`client`).textContent = d.organisation ?? ``;
  document.title = `${d.demande?.titre ?? `Version à relire`} · Fill`;
  if (d.etat !== `ouvert`) return (fermes[d.etat] ?? fermes.inconnu)(d);

  const decide = d.usage !== `avis`;
  const contexte = d.usage === `avis` ? `${d.demandeur ?? d.organisation} vous demande votre avis. La décision lui revient.`
    : d.usage === `delegation` ? `${d.demandeur ?? d.organisation} vous confie la validation de cette version. Votre réponse lance la suite.`
    : `Relisez la version ci-dessous. Votre réponse lance la suite.`;
  const v = d.version, fichiers = v.fichiers ?? [];
  poser(main, 
    h(`span`, { class: `sur` }, `Version ${v.numero} à relire`),
    h(`h1`, {}, d.demande.titre),
    h(`p`, { class: `contexte` }, contexte),
    d.demande.parution ? h(`p`, { class: `reperes` }, `Parution prévue ${date(d.demande.parution)}${heure(d.demande.heure)}.`) : null,
    v.note ? h(`div`, { class: `mot` }, h(`b`, {}, `Mot de Fill`), h(`p`, {}, v.note)) : null,
    h(`ul`, { class: `livrables` }, fichiers.length ? fichiers.map((f, i) => livrable(f, i + 1)) : h(`li`, {}, h(`p`, { class: `absent` }, `Cette version ne contient pas de fichier à afficher.`))),
    d.usage === `referent` ? autres(d) : null,
    h(`p`, { class: `pied` }, `Ce lien vous est personnel. Il reste valable jusqu’au ${date(d.expire)}.`),
  );
  barre(d, decide);
};

// barre de réponse, toujours visible en bas d'écran
const barre = (d, decide) => {
  document.querySelector(`.barre`)?.remove();
  const dans = h(`div`, { class: `dans` }), zone = h(`div`, { class: `barre`, role: `region`, "aria-label": `Votre réponse` }, dans);
  const erreur = h(`p`, { class: `erreur`, role: `alert`, hidden: true });
  const dire = (m) => { erreur.textContent = m ?? ``; erreur.hidden = !m; };
  const restantes = d.demande.corrections_restantes ?? 2;

  const envoyer = async (reponse, remarque, bouton) => {
    dire(); bouton.disabled = true;
    try {
      const r = await appeler({ action: `repondre`, reponse, remarque });
      if (!r.decision) etat(`Avis transmis.`, `${d.demandeur ?? `Votre interlocuteur`} le reçoit par e-mail et décide. Vous pouvez fermer cette page.`, null, true);
      else if (reponse === `accord`) etat(`Version validée.`, `Fill prend la suite. Vous pouvez fermer cette page.`, null, true);
      else etat(`Corrections transmises.`, `Fill reprend la version et vous en remet une nouvelle à relire.`, null, true);
    } catch (e) { bouton.disabled = false; dire(e.message); }
  };

  const depart = () => {
    const accord = h(`button`, { class: `bt`, type: `button`, onclick: () => (decide ? confirmer() : envoyer(`accord`, null, accord)) }, `D’accord`);
    const corriger = h(`button`, { class: `bt cl`, type: `button`, onclick: () => correction(), disabled: decide && restantes < 1 }, `À corriger`);
    poser(dans, h(`div`, { class: `choix` }, corriger, accord), decide && restantes < 1 ? h(`p`, { class: `aide` }, `Les deux allers-retours inclus sont utilisés. Pour une nouvelle correction, écrivez à Fill depuis votre espace.`) : null, erreur);
  };
  const confirmer = () => {
    const oui = h(`button`, { class: `bt`, type: `button`, onclick: () => envoyer(`accord`, null, oui) }, `Oui, valider`);
    poser(dans, h(`p`, { class: `question`, id: `q-valider` }, `Valider cette version ?`), h(`div`, { class: `choix`, role: `group`, "aria-labelledby": `q-valider` }, h(`button`, { class: `bt cl`, type: `button`, onclick: depart }, `Retour`), oui), erreur);
    oui.focus();
  };
  const correction = () => {
    const champ = h(`textarea`, { class: `saisie`, id: `remarque`, maxlength: `4000`, "aria-describedby": `aide-rem` });
    const ok = h(`button`, { class: `bt`, type: `button`, onclick: () => (champ.value.trim().length < 3 ? (dire(`Indiquez ce qui est à corriger.`), champ.focus()) : envoyer(`correction`, champ.value.trim(), ok)) }, `Envoyer`);
    poser(dans, 
      h(`label`, { for: `remarque` }, `Ce qui est à corriger`), champ,
      h(`p`, { class: `aide`, id: `aide-rem` }, decide ? `Deux allers-retours sont inclus. Il vous en reste ${restantes}.` : `Votre remarque est transmise à ${d.demandeur ?? `votre interlocuteur`}.`),
      h(`div`, { class: `choix` }, h(`button`, { class: `bt cl`, type: `button`, onclick: depart }, `Retour`), ok), erreur);
    champ.focus();
  };
  depart();
  document.body.append(zone);
};

// le référent peut demander un avis ou confier la validation, sans créer de compte
const autres = (d) => {
  const liste = h(`ul`, { class: `invites` }), msg = h(`p`, { class: `erreur`, role: `alert`, hidden: true });
  const dire = (m) => { msg.textContent = m ?? ``; msg.hidden = !m; };
  let invitations = d.invitations ?? [];
  const peindre = () => liste.replaceChildren(...invitations.map((x) => {
    const quoi = x.usage === `avis` ? `Avis demandé` : `Validation confiée`;
    const p = x.reponse ? h(`span`, { class: `pastille${x.reponse === `accord` ? ` bon` : ` att`}` }, x.reponse === `accord` ? `D’accord` : `À corriger`) : h(`span`, { class: `pastille` }, x.ouvert ? `En attente` : `Lien expiré`);
    const retirer = !x.reponse && x.ouvert ? h(`button`, { class: `lien`, type: `button`, "aria-label": `Retirer l’invitation de ${x.nom}`, onclick: async (e) => {
      e.target.disabled = true; dire();
      try { await appeler({ action: `retirer`, lien: x.id }); invitations = invitations.filter((y) => y.id !== x.id); peindre(); } catch (err) { e.target.disabled = false; dire(err.message); }
    } }, `Retirer`) : null;
    return h(`li`, { class: `invite` }, h(`p`, {}, h(`b`, {}, x.nom), ` `, p, h(`small`, {}, `${quoi}${x.fonction ? ` · ${x.fonction}` : ``}${x.remarque ? ` · « ${x.remarque} »` : ``}`)), retirer);
  }));
  peindre();

  const nom = h(`input`, { class: `saisie`, id: `i-nom`, autocomplete: `off`, maxlength: `120` });
  const fonction = h(`input`, { class: `saisie`, id: `i-fonction`, autocomplete: `off`, maxlength: `120` });
  const email = h(`input`, { class: `saisie`, id: `i-email`, type: `email`, inputmode: `email`, autocomplete: `off`, autocapitalize: `none`, maxlength: `254` });
  const radio = (v, titre, detail, coche) => h(`label`, { class: `radio` }, h(`input`, { type: `radio`, name: `usage`, value: v, checked: coche }), h(`span`, {}, h(`b`, {}, titre), h(`small`, {}, detail)));
  const bouton = h(`button`, { class: `bt`, type: `button` }, `Envoyer le lien`);
  const form = h(`div`, { class: `form` },
    h(`label`, { class: `champ`, for: `i-nom` }, h(`span`, {}, `Nom`), nom),
    h(`label`, { class: `champ`, for: `i-fonction` }, h(`span`, {}, `Fonction `, h(`small`, {}, `(facultatif)`)), fonction),
    h(`label`, { class: `champ`, for: `i-email` }, h(`span`, {}, `Adresse e-mail`), email),
    h(`fieldset`, { class: `radios` }, h(`legend`, {}, `Ce que vous attendez`),
      radio(`avis`, `Son avis`, `Sa réponse vous revient, vous décidez ensuite.`, true),
      radio(`delegation`, `Sa validation`, `Sa réponse lance la suite, à votre place.`, false)),
    bouton, msg);
  bouton.addEventListener(`click`, async () => {
    const usage = form.querySelector(`input[name=usage]:checked`)?.value;
    if (nom.value.trim().length < 2) return (dire(`Indiquez le nom de la personne.`), nom.focus());
    if (!EMAIL.test(email.value.trim())) return (dire(`Cette adresse e-mail n’est pas valide.`), email.focus());
    dire(); bouton.disabled = true;
    try {
      const r = await appeler({ action: `inviter`, usage, nom: nom.value, fonction: fonction.value, email: email.value });
      invitations = [...invitations, { id: r.lien, usage: r.usage, nom: r.nom, fonction: fonction.value.trim() || null, reponse: null, ouvert: true }];
      peindre();
      nom.value = fonction.value = email.value = ``;
    } catch (e) { dire(e.message); }
    bouton.disabled = false;
  });
  return h(`details`, { class: `autres`, open: invitations.length > 0 }, h(`summary`, {}, `Faire relire par quelqu’un d’autre`), form, liste);
};

// ---------- démonstration : rien n'est envoyé

const repondreDemo = async (corps) => {
  await new Promise((r) => setTimeout(r, 350));
  const usage = demo === `avis` || demo === `delegation` ? demo : `referent`;
  if (corps.action === `repondre`) return { ok: true, decision: usage !== `avis`, statut: corps.reponse === `accord` ? `validee` : `correction`, usage };
  if (corps.action === `inviter`) return { ok: true, lien: `demo-${Date.now()}`, nom: corps.nom.trim(), usage: corps.usage };
  if (corps.action === `retirer`) return { ok: true };
  const dans = (n) => { const j = new Date(); j.setDate(j.getDate() + n); return j.toISOString().slice(0, 10); };
  return {
    etat: `ouvert`, usage, nom: usage === `referent` ? `Yann Le Gall` : `Anne Kerbrat`, demandeur: `Yann Le Gall`,
    organisation: `Commune de Saint-Ivenec`, cible: `c`, expire: dans(7), espace: `..`,
    demande: { titre: `Forum des associations : annonce`, parution: dans(3), heure: `18:00`, corrections_restantes: 2 },
    version: {
      numero: 1, date: dans(0), note: `La photo vient du forum de l’an dernier. Dites-moi si l’horaire d’ouverture a changé.`,
      fichiers: [
        { type: `post`, nom: `publication-facebook.jpg`, src: `../assets/ev-forum-BTXOXytj.webp`, legende: `Le forum des associations se tient samedi, de 10 h à 17 h, à la salle omnisports. Quarante-deux clubs et associations vous y attendent pour les inscriptions de la saison.` },
        { type: `web`, nom: `actualite-site`, contenu: { titre: `Forum des associations : rendez-vous samedi`, chapo: `Quarante-deux clubs et associations seront présents à la salle omnisports, de 10 h à 17 h.`, corps: [`Sport, culture, solidarité : chaque association tient un stand pour présenter ses activités et prendre les inscriptions de la saison.`, `Des démonstrations ont lieu toute la journée sur le parquet. L’entrée est libre et le parking de la rue du Stade est ouvert.`] } },
      ],
    },
    invitations: [],
  };
};

// ---------- départ

(async () => {
  if (demo == null && !JETON.test(jeton)) return fermes.inconnu();
  try {
    afficher(await appeler({ action: `lire` }));
  } catch (e) {
    etat(`Connexion impossible.`, `La version n’a pas pu être ouverte. Vérifiez votre connexion, puis réessayez.`, h(`button`, { class: `bt`, type: `button`, onclick: () => location.reload() }, `Réessayer`));
  }
})();
