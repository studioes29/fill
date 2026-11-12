// Module livraison : dans la fiche d'une demande, côté Fill, la version se livre livrable par livrable.
// Fichier ajouté par-dessus les écrans, sans toucher aux composants.
//
// Chaque élément commandé devient une ligne (regles/livrables.js) : un fichier à déposer, et pour les contenus écrits
// un texte, pré-rempli par le premier jet de l'atelier quand il existe. « Livrer pour validation » reste grisé tant
// qu'une ligne est vide ; livrerVersion (donnees/actions.js) refuse aussi une version incomplète. Chaque fichier porte
// la clé et le nom de son livrable : la page de relecture en fait un volet par livrable.
// Le formulaire d'origine (un champ de fichiers pour toute la version) est masqué dès qu'il y a des livrables attendus.

(() => {
  if (typeof document > `u`) return;
  const ID = `fill-livraison`;
  const EQUIPE_FILL = [`admin`, `producteur`];
  const ECRITS = [`post`, `web`, `email`];
  const AVEC_TEXTE = (a) => ECRITS.includes(a.type) || a.prestation === `presse`;
  const typeFichier = (a, f) => (/\.(mp4|mov|webm)$/i.test(f.name) ? `video` : /\.pdf$/i.test(f.name) ? `pdf` : a.type === `pdf` ? `affiche` : a.type);
  let etatPanneau = null;

  const texteDe = (b) => b?.legende ?? [b?.contenu?.titre, b?.contenu?.chapo, ...(b?.contenu?.corps ?? [])].filter(Boolean).join(`\n\n`);
  const depuisJet = (d, attendus) => {
    const reste = [...(d.brouillon?.fichiers ?? [])];
    const r = {};
    for (const a of attendus) {
      if (!AVEC_TEXTE(a)) continue;
      const i = reste.findIndex((b) => b?.type === a.type || (a.prestation === `presse` && b?.type === `pdf`));
      if (i < 0) continue;
      const [b] = reste.splice(i, 1);
      r[a.cle] = { texte: texteDe(b), contenu: b.contenu };
    }
    return r;
  };

  const el = (balise, attributs = {}, ...enfants) => {
    const n = document.createElement(balise);
    for (const [k, v] of Object.entries(attributs)) {
      if (v == null || v === false) continue;
      if (k.startsWith(`on`)) n.addEventListener(k.slice(2), v);
      else if (k === `style`) n.style.cssText = v;
      else n.setAttribute(k, v === true ? `` : v);
    }
    for (const c of enfants.flat()) if (c != null && c !== false) n.append(c);
    return n;
  };

  const panneau = (d, numero) => {
    const attendus = livrablesAttendus(d);
    const jet = depuisJet(d, attendus);
    const saisie = Object.fromEntries(attendus.map((a) => [a.cle, { fichiers: [], texte: jet[a.cle]?.texte ?? ``, contenu: jet[a.cle]?.contenu }]));
    const pret = (a) => saisie[a.cle].fichiers.length > 0 || saisie[a.cle].texte.trim().length > 0;

    const form = el(`form`, { class: `version svelte-bswkfh`, id: ID, novalidate: true });
    const etatLigne = {};
    const lignes = attendus.map((a, i) => {
      const s = saisie[a.cle];
      const pastille = el(`span`, { class: `tres-petit`, style: `margin-left:auto;padding:2px 10px;border-radius:999px;font-weight:600` });
      const peindre = () => {
        const ok = pret(a);
        pastille.textContent = ok ? `Prêt` : `À déposer`;
        pastille.style.background = ok ? `var(--bon-c, #dcf0e5)` : `var(--creux, #efeae4)`;
        pastille.style.color = ok ? `#1f5c41` : `inherit`;
      };
      etatLigne[a.cle] = peindre;
      const idF = `lv-f-${i}`, idT = `lv-t-${i}`;
      const fichier = el(`input`, {
        id: idF, class: `saisie fichier svelte-bswkfh`, type: `file`, multiple: a.plusieurs,
        accept: a.type === `video` ? `video/*` : `image/*,application/pdf,video/*`,
        onchange: (e) => { s.fichiers = Array.from(e.currentTarget.files ?? []); peindre(); maj(); },
      });
      const texte = AVEC_TEXTE(a)
        ? el(`label`, { class: `champ`, for: idT }, el(`span`, {}, a.type === `post` ? `Texte de la publication` : `Texte`),
            Object.assign(el(`textarea`, { id: idT, class: `saisie`, rows: `5`, oninput: (e) => { s.texte = e.currentTarget.value; peindre(); maj(); } }), { value: s.texte }))
        : null;
      const bloc = el(`fieldset`, { style: `border:1px solid var(--ligne, #1a1a1a1f);border-radius:16px;padding:14px 16px;margin:0 0 12px;display:grid;gap:10px` },
        el(`legend`, { class: `sr` }, a.libelle),
        el(`div`, { style: `display:flex;align-items:center;gap:10px` }, el(`b`, { "aria-hidden": `true` }, a.libelle), pastille),
        el(`label`, { class: `champ`, for: idF }, el(`span`, {}, a.plusieurs ? `Fichiers` : `Fichier`), fichier),
        texte,
        jet[a.cle] ? el(`small`, { class: `tres-petit mu` }, `Texte repris du premier jet de l’atelier : relisez-le avant de livrer.`) : null);
      peindre();
      return bloc;
    });

    const note = el(`textarea`, { id: `lv-note`, class: `saisie mot-client svelte-bswkfh`, rows: `4`, placeholder: `Ce qui a été fait, ce qu’il faut relire en priorité, la date de mise en ligne prévue.` });
    const reste = el(`p`, { class: `tres-petit`, role: `status`, style: `margin:0` });
    const erreur = el(`p`, { class: `note n-alerte`, role: `alert`, hidden: true });
    const bouton = el(`button`, { class: `bt plein`, type: `submit` }, `Livrer pour validation`);
    const maj = () => {
      const manque = attendus.filter((a) => !pret(a));
      bouton.disabled = manque.length > 0 || etatPanneau?.envoi;
      reste.textContent = manque.length ? `${manque.length > 1 ? `Il reste ${manque.length} livrables` : `Il reste un livrable`} : ${manque.map((a) => a.libelle).join(`, `)}.` : `Tous les livrables sont prêts.`;
    };
    form.addEventListener(`submit`, async (e) => {
      e.preventDefault();
      if (bouton.disabled) return;
      erreur.hidden = true;
      const fichiers = [];
      for (const a of attendus) {
        const s = saisie[a.cle], t = s.texte.trim() || void 0;
        if (s.fichiers.length)
          s.fichiers.forEach((f, i) => fichiers.push({ nom: f.name, type: typeFichier(a, f), fichier: f, legende: i === 0 ? t : void 0, contenu: i === 0 ? s.contenu : void 0, livrable: a.cle, libelle: a.libelle }));
        else fichiers.push({ nom: a.libelle, type: a.type, legende: t, contenu: s.contenu, livrable: a.cle, libelle: a.libelle });
      }
      etatPanneau.envoi = true;
      maj();
      try {
        await livrerVersion(d.id, fichiers, note.value);
        toast(`Version livrée au client`, `succes`, `${d.unites ?? 0} unités décomptées, le référent est prévenu.`);
        form.remove();
      } catch (err) {
        erreur.textContent = err.message;
        erreur.hidden = false;
        toast(err.message, `erreur`);
      } finally {
        if (etatPanneau) etatPanneau.envoi = false;
        maj();
      }
    });
    form.append(
      el(`h3`, { class: `libelle` }, `Livrer la version ${numero}`),
      el(`p`, { class: `petit mu`, style: `margin:0 0 12px` }, `Un dépôt par livrable commandé. La version part quand tout est prêt.`),
      ...lignes,
      el(`label`, { class: `champ`, for: `lv-note` }, el(`span`, {}, `Mot au client`), note),
      reste, erreur, bouton,
      el(`p`, { class: `tres-petit mu` }, `Les unités sont décomptées à cette livraison.`));
    maj();
    return form;
  };

  const placer = () => {
    const route = typeof routeDepuisHash === `function` ? routeDepuisHash() : ``;
    const existant = document.getElementById(ID);
    const m = etat.pret ? moi() : null;
    const id = /^demande-(.+)$/.exec(route)?.[1];
    const origine = document.querySelector(`form.version:not(#${ID})`);
    if (!id || !m || !EQUIPE_FILL.includes(m.role) || !origine) {
      if (existant && !origine) existant.remove();
      return;
    }
    const d = demande(id);
    if (!d || !livrablesAttendus(d).length) return;
    origine.hidden = true;
    // le bouton « Livrer pour validation » du premier jet passe aussi par la liste des livrables
    document.querySelectorAll(`button.bt`).forEach((b) => {
      if (!b.closest(`form`) && /^Livrer pour validation/.test(b.textContent.trim())) b.hidden = true;
    });
    if (existant && etatPanneau?.id === d.id && existant.isConnected) return;
    existant?.remove();
    etatPanneau = { id: d.id, envoi: false };
    origine.before(panneau(d, (d.versions?.length ?? 0) + 1));
  };

  new MutationObserver(placer).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener(`hashchange`, placer);
})();
