/* Scripts du site (nom et domaine configurables dans site.json)
   Une seule source de vérité pour l'offre : window.FILL (généré depuis offre.json).
   Chaque module ne s'active que si son conteneur est présent dans la page. */
(() => {
  'use strict';
  const T = window.FILL || { offre: {}, site: {} };
  const O = T.offre, SITE = T.site;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NB = ' ';
  const eur = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NB);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const racine = (document.querySelector('link[rel=stylesheet]').getAttribute('href') || '').replace(/assets\/t\.css.*$/, '');
  document.documentElement.classList.add('js');
  const U = p => racine + p + (T.preview && /\/$/.test(p) ? 'index.html' : '');

  /* une page ouverte par un lien commence toujours en haut (le retour arrière garde sa position) */
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'navigate' && !location.hash) { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; scrollTo(0, 0); addEventListener('load', () => { if (scrollY && !location.hash) scrollTo(0, 0); history.scrollRestoration = 'auto'; }, { once: true }); }
  } catch (e) {}

  /* ---------- l'écran d'ouverture : une fois par visite ----------
     Le fond de la cible, le monogramme en filigrane qui pivote, le logo qui s'écrit,
     puis la feuille se lève sur la page. Un appui ou une touche le passe. */
  if (document.documentElement.classList.contains('intro')) {
    const h = document.documentElement;
    try { sessionStorage.setItem('fil.intro', '1'); } catch (e) {}
    const lg = document.querySelector('.hd .lg svg');
    const ov = document.createElement('div'); ov.className = 'intro-e'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = `<span class="intro-m"></span><div class="intro-l">${lg ? lg.outerHTML : ''}</div><p class="intro-t">Votre communication, <i>sans perdre le fil.</i></p>`;
    document.body.appendChild(ov);
    let fini = false;
    const termine = () => { if (fini) return; fini = true; ov.classList.add('sort'); h.classList.remove('intro'); h.classList.add('intro-fin'); setTimeout(() => { ov.remove(); h.classList.remove('intro-fin'); }, 1000); };
    requestAnimationFrame(() => ov.classList.add('go'));
    const t = setTimeout(termine, 1650);
    ov.addEventListener('click', () => { clearTimeout(t); termine(); });
    ['keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => { clearTimeout(t); termine(); }, { once: true, passive: true }));
  }

  /* ---------- état conservé pendant le parcours ---------- */
  const CLE = 'fil.v1';
  let etat = {};
  try { etat = JSON.parse(localStorage.getItem(CLE) || '{}') || {}; } catch (e) { etat = {}; }
  const garde = () => { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} };
  // durées de conservation (décrites dans les mentions légales) : 90 jours pour les choix, 30 jours pour les coordonnées
  const JOUR = 864e5;
  if (etat.maj && Date.now() - etat.maj > 90 * JOUR) { etat = {}; garde(); }
  if (etat.contact && (!etat.contactT || Date.now() - etat.contactT > 30 * JOUR)) { delete etat.contact; delete etat.contactT; garde(); }
  const maj = (k, v) => { if (k === 'selection' && v) v.quand = v.quand || Date.now(); etat[k] = v; etat.maj = Date.now(); garde(); };
  // relit l'état enregistré (un autre onglet a pu changer la sélection)
  const relit = () => { try { const e = JSON.parse(localStorage.getItem(CLE) || '{}') || {}; return e; } catch (er) { return etat; } };

  /* ---------- mesure d'audience sans cookie (GoatCounter) ---------- */
  const enProd = /(^|\.)studioes\.fr$/.test(location.hostname);
  if (enProd && SITE.goatcounter) {
    const g = document.createElement('script'); g.async = true; g.src = 'https://gc.zgo.at/count.js';
    g.dataset.goatcounter = SITE.goatcounter; document.head.appendChild(g);
  }
  const dejaCompte = new Set();
  const PREFIXE = String(SITE.nom || 'site').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '') + '-';
  const compte = (nom, unique) => {
    if (unique) { if (dejaCompte.has(nom)) return; dejaCompte.add(nom); }
    try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: PREFIXE + nom, title: nom, event: true }); } catch (e) {}
  };

  /* ---------- calculs de l'offre ---------- */
  const CAT = Object.fromEntries((O.catalogue || []).map(c => [c.id, c]));
  const FORM = O.formules || [];
  const unitesPanier = (p = {}) => Object.entries(p).reduce((s, [k, n]) => s + (CAT[k] ? CAT[k].u * n : 0), 0);
  const rangMin = (p = {}) => Object.entries(p).reduce((m, [k, n]) => (n > 0 && CAT[k] && CAT[k].min) ? Math.max(m, FORM.findIndex(f => f.id === CAT[k].min)) : m, 0);
  const recommande = (total, urg = 0, panier) => {
    if (total <= 0 && urg <= 0) return null;
    const mini = rangMin(panier);
    const opts = FORM.slice(mini).map(f => {
      const u = total + Math.max(0, urg - (f.urgences_incluses || 0));
      const sup = Math.max(0, u - f.unites);
      return { f, u, sup, prix: f.prix + sup * O.unite_sup, reste: Math.max(0, f.unites - u) };
    });
    const ok = opts.filter(o => o.sup <= 6);
    // au-delà de Soutenu et de 6 unités supplémentaires : pas de prix affiché, une étude
    if (!ok.length) { const s = opts[opts.length - 1]; return Object.assign({ horsCadre: true }, s, { prix: null }); }
    ok.sort((a, b) => a.prix - b.prix || a.f.prix - b.f.prix);
    const best = ok[0];
    const idx = opts.indexOf(best);
    const suiv = opts[idx + 1];
    return Object.assign({ suivant: suiv, mini: mini > 0 }, best);
  };
  /* mise en place : un mois d'abonnement plafonné (offre.json), offerte avec un engagement de 12 mois */
  const mepDe = f => (f && f.mise_en_place) || 0;
  const couts = (mensuel, f) => { const mep = mepDe(f); return { m: mensuel, mep, six: mensuel * O.engagement_mois + mep, an: mensuel * 12 + mep, an12: mensuel * 12 }; };
  const resumePanier = p => Object.entries(p || {}).filter(([k, n]) => n > 0 && CAT[k]).map(([k, n]) => {
    const c = CAT[k];
    if (c.bascule) return c.nom;
    if (k === 'agenda') return `Agenda : ${n * 3} événements`;
    if (k === 'bulletin') return `${n} page${n > 1 ? 's' : ''} de bulletin`;
    return `${n} × ${c.nom.charAt(0).toLowerCase() + c.nom.slice(1)}`;
  });

  /* ---------- relais : prix ---------- */
  const R = O.relais || {};
  const DUREES = [
    { id: 's2', l: '2 semaines', sem: 2 }, { id: 's3', l: '3 semaines', sem: 3 },
    { id: 'm1', l: '1 mois', mois: 1 }, { id: 'm2', l: '2 mois', mois: 2 }, { id: 'm3', l: '3 mois', mois: 3 },
    { id: 'm4', l: '4 mois', mois: 4 }, { id: 'm6', l: '6 mois', mois: 6 }
  ];
  // situations de Relais, avec le vocabulaire de chaque public
  const SIT0 = { vacant: { c: 'Poste vacant', e: 'Poste à pourvoir', rc: 'Arrivée de la personne recrutée', re: 'Arrivée de la personne recrutée' }, conge: { c: 'Agent en congé ou en arrêt', e: 'Salarié en congé ou en arrêt', rc: 'Retour de l’agent', re: 'Retour de la personne absente' }, ete: { c: 'Congés d’été', e: 'Congés d’été', rc: 'Retour de congés', re: 'Retour de congés' } };
  const SIT = new Proxy(SIT0, { get: (o, k) => o[k] && { a: o[k][document.documentElement.dataset.cible === 'e' ? 'e' : 'c'], r: o[k][document.documentElement.dataset.cible === 'e' ? 're' : 'rc'] } });
  const prixRelais = d => d.sem ? { total: d.sem * R.prix_semaine, unites: d.sem * R.unites_semaine, txt: `${d.sem} × ${eur(R.prix_semaine)} € par semaine`, jours: d.sem * 7 }
    : { total: d.mois * R.prix_mois, unites: d.mois * R.unites_mois, txt: `${d.mois} × ${eur(R.prix_mois)} € par mois`, jours: Math.round(d.mois * 30.4) };

  /* ---------- utilitaires d'interface ---------- */
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const doux = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const f1 = v => (Math.round(v * 10) / 10).toString();
  const varC = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const toast = (m) => { const t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600); };
  // une seule animation par élément : la précédente est abandonnée, la valeur finale est toujours la dernière demandée
  const tween = (el, to, dur = 650) => {
    if (!el) return; const from = parseFloat(el.dataset.v || '0') || 0; el.dataset.v = to;
    const jeton = (el._tw = (el._tw || 0) + 1);
    if (RM || from === to) { el.textContent = eur(to); return; }
    const t0 = performance.now();
    const pas = t => { if (el._tw !== jeton) return; const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 4); el.textContent = eur(k < 1 ? from + (to - from) * e : to); if (k < 1) requestAnimationFrame(pas); };
    requestAnimationFrame(pas);
  };
  const grille = (el, n, used, extra = 0, opts = {}) => {
    // n cases, used pleines, extra en dépassement (argile)
    if (!el) return;
    const total = Math.max(n, used);
    const cur = el.children.length;
    if (cur !== total) {
      el.innerHTML = '';
      for (let i = 0; i < total; i++) el.appendChild(document.createElement('i'));
    }
    $$('i', el).forEach((c, i) => {
      const was = c.className;
      const cl = i < Math.min(used, n) ? 'u' : (i < used ? 'x' : (opts.reste ? 'r' : ''));
      if (was !== cl) {
        c.className = cl;
        if (!RM && cl && opts.anime !== false) { c.classList.add('pop'); setTimeout(() => c.classList.remove('pop'), 260 + (i % 15) * 8); }
      }
    });
    if (extra) {/* déjà couvert par used > n */}
  };
  const fdate = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const fdateL = d => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  // jours fériés français (fixes et mobiles, à partir de Pâques)
  const paques = a => { const b = a % 19, c = Math.floor(a / 100), d = a % 100, e = Math.floor(c / 4), f = c % 4, g = Math.floor((c + 8) / 25), h = Math.floor((c - g + 1) / 3), i = (19 * b + c - e - h + 15) % 30, k = Math.floor(d / 4), l = d % 4, m = (32 + 2 * f + 2 * k - i - l) % 7, n = Math.floor((b + 11 * i + 22 * m) / 451), mo = Math.floor((i + m - 7 * n + 114) / 31), j = ((i + m - 7 * n + 114) % 31) + 1; return new Date(a, mo - 1, j, 12); };
  const ferie = d => { const md = (d.getMonth() + 1) + '-' + d.getDate(); if (['1-1', '5-1', '5-8', '7-14', '8-15', '11-1', '11-11', '12-25'].includes(md)) return true; const p = paques(d.getFullYear()); return [1, 39, 50].some(x => { const q = new Date(p); q.setDate(q.getDate() + x); return q.getMonth() === d.getMonth() && q.getDate() === d.getDate(); }); };
  const ouvre = d => { const j = d.getDay(); return j !== 0 && j !== 6 && !ferie(d); };
  const ajouteJoursOuvres = (d, n) => { const r = new Date(d); let k = 0; while (k < n) { r.setDate(r.getDate() + 1); if (ouvre(r)) k++; } return r; };
  const isoJour = d => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };

  const segIndAncien = grp => {
    const ind = $('.ind', grp); const on = $('[aria-pressed=true]', grp);
    if (!ind || !on) return;
    ind.style.width = on.offsetWidth + 'px'; ind.style.transform = `translateX(${on.offsetLeft - 4}px)`;
  };

  /* prix animé chiffre par chiffre. Toutes les valeurs précédentes sortent et sont
     supprimées : il n'existe jamais plus d'une valeur affichée (pas de prix fantôme). */
  const prixAnim = (el, val) => {
    if (!el) return; const txt = typeof val === 'number' ? eur(val) : String(val);
    if (el.dataset.t === txt) return; const premier = el.dataset.t == null; el.dataset.t = txt;
    $$('.v', el).forEach(v => { if (v.classList.contains('sort') || RM || premier) v.remove(); else { v.classList.add('sort'); v.setAttribute('aria-hidden', 'true'); setTimeout(() => v.remove(), 460); } });
    Array.from(el.childNodes).forEach(n => { if (n.nodeType === 3) n.remove(); });
    const s = document.createElement('span'); s.className = 'v';
    if (RM || premier) s.textContent = txt;
    else s.innerHTML = Array.from(txt).map((c, k) => `<i style="--k:${k}">${c === ' ' ? NB : esc(c)}</i>`).join('');
    el.appendChild(s);
  };

  /* ---------- titres mot à mot et révélations ---------- */
  const decoupe = el => {
    let i = 0;
    const tr = n => {
      Array.from(n.childNodes).forEach(c => {
        if (c.nodeType === 3) {
          const parts = c.textContent.split(/([ \t\n\r]+)/);
          const f = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^[ \t\n\r]+$/.test(p)) { f.appendChild(document.createTextNode(p)); return; }
            const m = document.createElement('span'); m.className = 'mot';
            const s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', i++);
            m.appendChild(s); f.appendChild(m);
          });
          c.replaceWith(f);
        } else if (c.nodeType === 1 && !c.classList.contains('mot')) tr(c);
      });
    };
    tr(el);
  };
  /* mots composés (rendez-vous, devez-vous, week-ends) : jamais coupés au trait d'union dans les titres */
  const lieTirets = racine => {
    const rx = /[^\s\u00a0]+-[^\s\u00a0]+/g;
    const tw = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
    const noeuds = []; let n; while ((n = tw.nextNode())) if (rx.test(n.textContent) && !n.parentElement.closest('.lie')) noeuds.push(n); rx.lastIndex = 0;
    noeuds.forEach(n => {
      const f = document.createDocumentFragment(); let i = 0; const t = n.textContent; rx.lastIndex = 0; let m;
      while ((m = rx.exec(t))) { if (m.index > i) f.appendChild(document.createTextNode(t.slice(i, m.index))); const s = document.createElement('span'); s.className = 'lie'; s.textContent = m[0]; f.appendChild(s); i = m.index + m[0].length; }
      if (i < t.length) f.appendChild(document.createTextNode(t.slice(i)));
      n.replaceWith(f);
    });
  };
  $$('h1,h2,h3,.ca b,.bt').forEach(lieTirets);
  /* liens au fil d'un paragraphe : soulignés sans agrandir l'interligne */
  $$('.lien').forEach(a => { const p = a.parentElement; if (p && !a.querySelector('svg') && Array.from(p.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())) a.classList.add('dans'); });
  if (!RM) $$('.titre').forEach(decoupe);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add(e.target.classList.contains('titre') ? 'titre-on' : 'on'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv,.titre').forEach(el => io.observe(el));

  /* ---------- prise de rendez-vous : le calendrier Cal.com s'ouvre dans une fenêtre du site ---------- */
  const rdv = $('#rdv');
  const noteRdv = () => { const s = etat.selection; if (!s) return ''; return `${SITE.nom} · ${s.titre}${s.prix ? ' · ' + s.prix : ''}`; };
  let rdvRetour = null, clavier = false;
  addEventListener('keydown', e => { if (e.key === 'Tab') clavier = true; }, true);
  addEventListener('pointerdown', () => { clavier = false; }, true);
  const fermeRdv = () => { if (!rdv) return; rdv.classList.remove('on'); rdv.setAttribute('aria-hidden', 'true'); rdv.setAttribute('inert', ''); document.documentElement.classList.remove('rdv-ouvert'); if (rdvRetour && clavier) rdvRetour.focus({ preventScroll: true }); else if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); };
  let calEtat = 0; const calAttente = [];
  const calCharge = (ok, ko) => {
    if (calEtat === 2) { ok(); return; } calAttente.push([ok, ko]); if (calEtat === 1) return; calEtat = 1;
    (function (C, A, L) { const p = function (a, ar) { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const cal = C.Cal; const ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; const sc = d.createElement('script'); sc.src = A; sc.onload = () => { calEtat = 2; calAttente.splice(0).forEach(([f]) => f()); }; sc.onerror = () => { calEtat = 0; calAttente.splice(0).forEach(([, g]) => g && g()); }; d.head.appendChild(sc); cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const ns = ar[1]; api.q = api.q || []; if (typeof ns === 'string') { cal.ns[ns] = cal.ns[ns] || api; p(cal.ns[ns], ar); p(cal, ['initNamespace', ns]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
    Cal('init', 'fill', { origin: 'https://app.cal.com' });
    Cal.ns.fill('on', { action: 'linkReady', callback: () => { clearTimeout(ouvreRdv.t); const cz = rdv && $('.rdv-c', rdv); if (cz) cz.hidden = true; } });
    Cal.ns.fill('on', { action: 'linkFailed', callback: () => { const cz = rdv && $('.rdv-c', rdv); if (cz) { cz.hidden = false; cz.classList.add('lent'); cz.innerHTML = `<span>Le calendrier ne s’affiche pas.</span><a class="bt sm" href="${esc(SITE.cal_url)}" target="_blank" rel="noopener">L’ouvrir dans un nouvel onglet</a>`; } } });
    Cal.ns.fill('on', { action: 'bookingSuccessful', callback: () => { compte('rdv-confirme'); toast('Rendez-vous confirmé : l’invitation arrive par courriel.'); } });
  };
  const ouvreRdv = (dep) => {
    compte('rdv-ouverture');
    if (!rdv) { window.open(SITE.cal_url, '_blank', 'noopener'); return; }
    // le calendrier officiel de Cal.com (intégration embed.js) s'affiche dans la fenêtre du site ;
    // ce qui est déjà renseigné (nom, courriel, sélection) préremplit la réservation
    const n = noteRdv(), ct = etat.contact || {};
    const cfg = { layout: 'month_view', theme: 'light' }; if (n) cfg.notes = n; if (ct.nom) cfg.name = ct.nom; if (ct.email) cfg.email = ct.email;
    const cle = JSON.stringify(cfg), cz = $('.rdv-c', rdv), zone = $('.rdv-z', rdv);
    const secours = () => { cz.hidden = false; cz.classList.add('lent'); cz.innerHTML = `<span>Le calendrier tarde à s’afficher.</span><a class="bt sm" href="${esc(SITE.cal_url)}" target="_blank" rel="noopener">L’ouvrir dans un nouvel onglet <span class="ar"><svg class="i"><use href="#ar"/></svg></span></a>`; };
    if (zone && zone.dataset.cle !== cle) {
      zone.dataset.cle = cle; zone.innerHTML = ''; cz.hidden = false; cz.classList.remove('lent'); cz.innerHTML = 'Chargement du calendrier…';
      clearTimeout(ouvreRdv.t); ouvreRdv.t = setTimeout(() => { if (!cz.hidden) secours(); }, 10000);
      calCharge(() => {
        try {
          Cal.ns.fill('inline', { elementOrSelector: zone, calLink: SITE.cal_lien, config: cfg });
          Cal.ns.fill('ui', { theme: 'light', layout: 'month_view', cssVarsPerTheme: { light: { 'cal-brand': varC('--cible') || '#7052B3', 'cal-brand-emphasis': '#1A1A1A', 'cal-brand-text': '#ffffff' } } });
        } catch (e) { secours(); }
      }, secours);
    }
    rdvRetour = dep || document.activeElement;
    rdv.removeAttribute('inert'); rdv.setAttribute('aria-hidden', 'false'); rdv.classList.add('on'); document.documentElement.classList.add('rdv-ouvert');
    setTimeout(() => { const b = $('button[data-ferme]', rdv); if (b) b.focus({ preventScroll: true }); }, 60);
  };
  if (rdv) {
    $$('[data-ferme]', rdv).forEach(b => b.addEventListener('click', fermeRdv));
    addEventListener('keydown', e => { if (e.key === 'Escape' && rdv.classList.contains('on')) fermeRdv(); });
  }
  document.addEventListener('click', e => { const a = e.target.closest('[data-cal]'); if (!a) return; e.preventDefault(); ouvreRdv(a); });
  // le script de réservation se charge dès qu'un bouton de rendez-vous est survolé ou touché
  ['pointerenter', 'touchstart', 'focusin'].forEach(ev => document.addEventListener(ev, e => { if (e.target.closest && e.target.closest('[data-cal]') && calEtat === 0) calCharge(() => {}, () => {}); }, { passive: true, capture: true }));

  /* ---------- liens de partage (état encodé dans l'adresse) ---------- */
  const encode = o => { try { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/, ''); } catch (e) { return ''; } };
  const decode = s => { try { return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) { return null; } };
  const hashEtat = () => { const m = location.hash.match(/[#&]s=([^&]+)/); return m ? decode(m[1]) : null; };
  const lienPartage = (page, sel) => new URL(U(page) + '#s=' + encode(structure(sel)), location.href).href;
  const copie = async (txt) => {
    try { await navigator.clipboard.writeText(txt); toast('Lien copié.'); compte('lien-copie'); }
    catch (e) { prompt('Copiez ce lien :', txt); }
  };
  /* sélection commune à tous les modules : ce que la demande et la note reprennent.
     Elle est toujours recalculée à partir du catalogue officiel (offre.json) :
     un lien partagé ou une valeur stockée ne transporte jamais de prix. */
  const entier = (v, mn, mx) => { const n = parseInt(v, 10); return isNaN(n) ? mn : Math.max(mn, Math.min(mx, n)); };
  const panierPropre = p => { const r = {}; if (p && typeof p === 'object') Object.keys(p).forEach(k => { if (CAT[k]) { const n = entier(p[k], 0, CAT[k].max || 30); if (n) r[k] = n; } }); return r; };
  const selDepuisPanier = (panier, urg, src) => {
    panier = panierPropre(panier); urg = entier(urg, 0, 10);
    const total = unitesPanier(panier); const r = recommande(total, urg, panier);
    if (!r) return null;
    const lignes = resumePanier(panier).concat(urg ? [`${urg} demande${urg > 1 ? 's' : ''} urgente${urg > 1 ? 's' : ''} par mois`] : []);
    if (r.horsCadre) return { src, titre: 'Étude personnalisée', formule: null, unites: r.u, capacite: null, mensuel: null, prix: 'Sur étude, après échange', lignes, panier, urg, horsCadre: true };
    return {
      src, titre: `Formule ${r.f.nom}${r.sup ? ` + ${r.sup} unité${r.sup > 1 ? 's' : ''}` : ''}`, formule: r.f.id,
      unites: r.u, capacite: r.f.unites, mensuel: r.prix, prix: `${eur(r.prix)} € par mois`, lignes, panier, urg
    };
  };
  const selFormule = id => {
    const f = FORM.find(x => x.id === id); if (!f) return null;
    return { src: 'formule', titre: `Formule ${f.nom}`, formule: f.id, unites: 0, capacite: f.unites, mensuel: f.prix, prix: `${eur(f.prix)} € par mois`, lignes: [`${f.unites} unités par mois, réparties selon vos besoins`, `Délai de traitement : ${f.delai}`], panier: null, urg: 0 };
  };
  const selRelais = rl => {
    rl = rl || {};
    const di = entier(rl.d, 0, DUREES.length - 1), d = DUREES[di], p = prixRelais(d);
    const sit = SIT[rl.sit] ? rl.sit : 'vacant', appui = !!rl.app && sit !== 'ete', ess = FORM[0];
    const deb = /^\d{4}-\d{2}-\d{2}$/.test(rl.debut || '') && !isNaN(new Date(rl.debut + 'T12:00:00')) ? rl.debut : '';
    const total = p.total + (appui ? ess.prix * 3 : 0);
    return { src: 'relais', titre: `Relais ${d.l}${appui ? ' + 3 mois d’appui' : ''}`, mensuel: d.mois ? R.prix_mois : null, total, prix: `${eur(total)} € au total`,
      lignes: [SIT[sit].a].concat(deb ? [`Démarrage le ${fdate(new Date(deb + 'T12:00:00'))}`] : [], [p.txt], appui ? [`Appui Essentiel 3 mois, ${eur(ess.prix * 3)} €`] : []),
      relais: true, debut: deb, rl: { sit, d: di, app: appui, debut: deb } };
  };
  const selRelaisSimple = src => ({ src, titre: 'Relais', prix: `${eur(R.prix_semaine)} € par semaine, ou ${eur(R.prix_mois)} € par mois`, lignes: ['Remplacement pendant une absence ou un recrutement'], relais: true, rl: null });
  const evPropres = l => Array.isArray(l) ? l.slice(0, 30).map(e => ({ m: entier(e && e.m, 0, 2), t: String((e && e.t) || '').slice(0, 60), k: PACKS[e && e.k] ? e.k : 'pub' })).filter(e => e.t.trim()) : [];
  // externe = vient d'un lien : on ne reprend aucun texte libre (synthèse, lignes)
  const reconstruit = (s, externe) => {
    if (!s || typeof s !== 'object') return null;
    let r = null;
    if (s.relais) r = s.rl ? selRelais(s.rl) : selRelaisSimple(s.src === 'diagnostic' ? 'diagnostic' : 'relais');
    else if (s.src === 'formule' && s.formule) r = selFormule(s.formule);
    else if (s.src === 'calendrier' && s.cal) r = selCalendrier(evPropres(s.cal));
    else if (s.panier) r = selDepuisPanier(s.panier, s.urg, ['simulateur', 'diagnostic'].includes(s.src) ? s.src : 'simulateur');
    if (!r) return null;
    if (!externe) {
      if (typeof s.quand === 'number') r.quand = s.quand;
      if (typeof s.synthese === 'string') r.synthese = s.synthese.slice(0, 600);
      if (Array.isArray(s.priorites)) r.priorites = s.priorites.slice(0, 3).map(x => String(x).slice(0, 200));
      if (typeof s.type === 'string') r.type = s.type.slice(0, 20);
    }
    return r;
  };
  const structure = s => s && ({ src: s.src, formule: s.formule, panier: s.panier, urg: s.urg, relais: s.relais, rl: s.rl, cal: s.cal });

  /* calendrier : chaque temps fort choisi correspond à un ensemble de prestations du catalogue */
  const PACKS = {
    pub: { l: 'Publication', p: { post: 1 } }, pa: { l: 'Publication et actualité', p: { post: 1, actu: 1 } },
    aff: { l: 'Affiche et deux publications', p: { affiche: 1, post: 2 } }, news: { l: 'Newsletter', p: { news: 1 } },
    cp: { l: 'Communiqué et publication', p: { presse: 1, post: 1 } }, prog: { l: 'Programme recto verso et publication', p: { flyer: 1, post: 1 } },
    bul: { l: 'Bulletin de 8 pages', p: { bulletin: 8 } }, photo: { l: 'Reportage photo', p: { photo: 1 } }, video: { l: 'Vidéo courte', p: { video: 1 } }
  };
  const panierCal = evs => { const tot = [{}, {}, {}]; evs.forEach(e => Object.entries(PACKS[e.k].p).forEach(([k, n]) => { tot[e.m][k] = (tot[e.m][k] || 0) + n; })); return tot; };
  const auj0 = new Date(); const MOIS3 = [1, 2, 3].map(n => new Date(auj0.getFullYear(), auj0.getMonth() + n, 1));
  const mNom = m => m.toLocaleDateString('fr-FR', { month: 'long' });
  // simulation mois par mois : le report reçu est consommé en premier, les unités du mois
  // non utilisées passent au mois suivant une seule fois (conditions générales, article 3)
  const simuleMois = (besoins, f) => {
    let report = 0;
    return besoins.map(b => {
      const duReport = Math.min(report, b), duMois = Math.min(f.unites, b - duReport), hors = b - duReport - duMois;
      const l = { besoin: b, inclus: f.unites, report, utilise: duReport + duMois, hors, reporte: f.unites - duMois };
      report = l.reporte; return l;
    });
  };
  const selCalendrier = evs => {
    if (!evs.length) return null;
    const mois = panierCal(evs); const besoins = mois.map(unitesPanier);
    const fusion = {}; mois.forEach(m => Object.entries(m).forEach(([k, n]) => { fusion[k] = Math.max(fusion[k] || 0, n); }));
    const mini = rangMin(fusion);
    const lignes0 = [`${evs.length} temps fort${evs.length > 1 ? 's' : ''} : ${besoins.map((b, i) => `${mNom(MOIS3[i])} ${b} u.`).join(', ')}`].concat(evs.slice(0, 12).map(e => `${e.t} (${PACKS[e.k].l.toLowerCase()})`));
    const essais = FORM.slice(mini).map(f => { const sim = simuleMois(besoins, f); const hors = sim.reduce((s, x) => s + x.hors, 0); return { f, sim, hors, cout: f.prix * 3 + hors * O.unite_sup, ok: sim.every(x => x.hors <= 6) }; }).filter(x => x.ok);
    if (!essais.length) return { src: 'calendrier', titre: 'Étude personnalisée', mensuel: null, prix: 'Sur étude, après échange', lignes: lignes0, cal: evs, horsCadre: true };
    essais.sort((a, b) => a.cout - b.cout || a.f.prix - b.f.prix);
    const r = essais[0];
    return { src: 'calendrier', titre: `Formule ${r.f.nom}`, formule: r.f.id, unites: Math.max(...besoins), capacite: r.f.unites, mensuel: r.f.prix, prix: `${eur(r.f.prix)} € par mois`,
      lignes: lignes0.concat(r.hors ? [`${r.hors} unité${r.hors > 1 ? 's' : ''} hors forfait sur le trimestre, ${eur(r.hors * O.unite_sup)} € sur accord écrit`] : []), cal: evs, sim: r.sim };
  };

  const fromHash = hashEtat();
  if (fromHash) { const s = reconstruit(fromHash, true); if (s) { maj('selection', s); if (s.panier && s.src === 'simulateur') { maj('panier', s.panier); maj('urg', s.urg || 0); } } }
  else if (etat.selection) { const s = reconstruit(etat.selection, false); if (JSON.stringify(s) !== JSON.stringify(etat.selection)) maj('selection', s); }


  /* ================================================================
     EN-TÊTE : une bande opaque qui prend la couleur de la rubrique
     qu'elle surplombe. Toujours visible sur ordinateur ; sur mobile,
     elle se retire quand on descend et revient dès qu'on remonte.
     ================================================================ */
  const hd = $('#hd'), prog = $('.hd-prog i'), mb = $('.menu'), mn = $('#mn');
  // la barre d'avancement vit hors de l'en-tête : elle reste visible quand l'en-tête se retire
  if (prog) document.body.appendChild(prog.parentNode);
  const grand = matchMedia('(min-width:980px)');
  const html = document.documentElement;
  let yP = scrollY, menuO = false;
  const lum = rgb => { const m = rgb.match(/\d+(\.\d+)?/g); if (!m) return 1; const [r, g, b] = m.map(Number); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  let fondHd = '';
  const themeHd = () => {
    if (!hd || menuO) return;
    const y = hd.offsetHeight + 1;
    let el = document.elementFromPoint(Math.min(innerWidth - 2, 24), y);
    let bg = '';
    while (el && el !== html) {
      if (el === hd) { el = null; break; }
      const c = getComputedStyle(el).backgroundColor;
      if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && !/,\s*0\)$/.test(c)) { bg = c; break; }
      el = el.parentElement;
    }
    bg = bg || getComputedStyle(document.body).backgroundColor;
    if (bg === fondHd) return; fondHd = bg;
    const sombre = lum(bg) < .5, neutre = /^rgba?\((248, 245, 242|255, 255, 255|26, 26, 26)[,)]/.test(bg);
    hd.style.setProperty('--hd-bg', bg);
    hd.style.setProperty('--hd-tx', sombre ? '#F8F5F2' : '#1A1A1A');
    hd.style.setProperty('--hd-ln', sombre ? 'rgba(248,245,242,.16)' : 'rgba(26,26,26,.1)');
    hd.classList.toggle('sombre', sombre); hd.classList.toggle('ton', !neutre); hd.classList.remove('rouge');
  };
  const auDefil = () => {
    const y = scrollY;
    if (hd) {
      hd.classList.toggle('on', y > 8);
      if (grand.matches) hd.classList.remove('cache');
      else if (!menuO && Math.abs(y - yP) > 6) { hd.classList.toggle('cache', y > yP && y > 160); yP = y; }
      html.classList.toggle('hd-cache', hd.classList.contains('cache'));
      themeHd();
    }
    if (prog && !html.classList.contains('part')) { const h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h).toFixed(4) : 0})`; }
  };
  let rafD = 0;
  addEventListener('scroll', () => { if (!rafD) rafD = requestAnimationFrame(() => { rafD = 0; auDefil(); }); }, { passive: true });
  addEventListener('resize', () => { fondHd = ''; auDefil(); });
  auDefil(); setTimeout(() => { fondHd = ''; themeHd(); }, 300);
  if (hd) hd.addEventListener('focusin', () => hd.classList.remove('cache'));
  if (mb && mn) {
    const bascMenu = o => {
      menuO = o; mn.classList.toggle('ouvert', o); mn.setAttribute('aria-hidden', String(!o));
      if (o) mn.removeAttribute('inert'); else mn.setAttribute('inert', '');
      mb.setAttribute('aria-expanded', String(o)); mb.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu');
      hd.classList.toggle('menu-ouvert', o); hd.classList.remove('cache');
      document.documentElement.style.overflow = o ? 'hidden' : '';
      if (!o) { fondHd = ''; themeHd(); }
      if (o) setTimeout(() => { const a = $('nav a', mn); if (a) a.focus({ preventScroll: true }); }, 380);
    };
    mb.addEventListener('click', () => bascMenu(!menuO));
    addEventListener('keydown', e => { if (e.key === 'Escape' && menuO) { bascMenu(false); mb.focus(); } });
    $$('a', mn).forEach(a => a.addEventListener('click', () => bascMenu(false)));
    grand.addEventListener('change', e => { if (e.matches && menuO) bascMenu(false); });
  }

  /* ================================================================
     D'UNE PAGE À L'AUTRE : le fil de l'en-tête court jusqu'au bout,
     la page s'efface vers la gauche ; la suivante entre par la droite
     pendant que le fil repart. Un quart de seconde, dans un seul sens.
     ================================================================ */
  // le fil de transition : il part du logo et traverse l'écran ; à l'arrivée, il se retire vers la droite
  const filTransit = (sens) => {
    const W = innerWidth, H = innerHeight, lgS = $('.hd .lg svg');
    const x0 = -60, y0 = H * .3;
    const sw = Math.max(16, Math.min(28, W * .018));
    const sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); sv.setAttribute('class', 'tr-fil'); sv.setAttribute('aria-hidden', 'true');
    sv.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', `M${x0} ${y0}C${W * .2} ${H * .22} ${W * .36} ${H * .5} ${W * .5} ${H * .5}S${W * .7} ${H * .26} ${W * .82} ${H * .4}S${W * .98} ${H * .7} ${W + 60} ${H * .62}`);
    p.style.strokeWidth = sw; sv.appendChild(p); document.body.appendChild(sv);
    const L = p.getTotalLength(); p.style.strokeDasharray = `${L} ${L + 80}`;
    if (sens > 0) p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 300, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' });
    else p.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -L - 40 }], { duration: 520, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' }).onfinish = () => sv.remove();
  };
  if (html.classList.contains('entre') && !RM) filTransit(-1);
  if (html.classList.contains('entre')) setTimeout(() => html.classList.remove('entre'), 650);
  addEventListener('pageshow', e => { if (e.persisted) { html.classList.remove('part', 'entre'); $$('.tr-fil').forEach(x => x.remove()); } });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || RM || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-cal')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    if (!/(\/|\.html)$/.test(u.pathname)) return;
    e.preventDefault();
    html.classList.add('part'); filTransit(1);
    try { sessionStorage.setItem('fil.nav', String(Date.now())); } catch (er) {}
    setTimeout(() => { location.href = u.href; }, 300);
  });

  /* ================================================================
     RETOUR : la rubrique précédente si on vient du site, sinon la
     page parente logique. Les sélections restent gardées.
     ================================================================ */
  const rub = document.body.dataset.rub;
  {
    let h = []; try { h = JSON.parse(sessionStorage.getItem('fil.hist') || '[]') || []; } catch (e) { h = []; }
    const titre = (document.title.split(' · ')[0] || '').trim();
    const ici = { u: location.pathname, t: rub === 'accueil' || titre === SITE.nom ? 'Accueil' : titre };
    if (!h.length || h[h.length - 1].u !== ici.u) { if (h.length > 1 && h[h.length - 2].u === ici.u) h.pop(); else h.push(ici); }
    h = h.slice(-12); try { sessionStorage.setItem('fil.hist', JSON.stringify(h)); } catch (e) {}
    const ar = $('.ariane');
    if (ar && rub !== 'accueil') {
      const prec = h.length > 1 ? h[h.length - 2] : null;
      const court = t => t.replace(/^(Formules et tarifs|Estimer votre besoin de communication|Diagnostic de communication en 2 minutes)$/, m => ({ 'Formules et tarifs': 'Formules', 'Estimer votre besoin de communication': 'Estimer', 'Diagnostic de communication en 2 minutes': 'Estimer' })[m]).replace(/ · .*$/, '').slice(0, 42);
      let pu = document.body.dataset.parent || racine; if (T.preview && /\/$/.test(pu)) pu += 'index.html';
      const dest = prec ? { u: prec.u, t: court(prec.t) } : { u: pu, t: document.body.dataset.parentL || 'Accueil' };
      const box = document.createElement('div'); box.className = 'retour';
      box.innerHTML = `<a class="rt" href="${esc(dest.u)}"><i aria-hidden="true"><svg class="i"><use href="#al"/></svg></i>Retour${dest.t ? ' : ' + esc(dest.t) : ''}</a>`;
      ar.replaceWith(box); box.appendChild(ar);
      $('a.rt', box).addEventListener('click', e => {
        let ref = ''; try { ref = new URL(document.referrer).pathname; } catch (er) {}
        if (prec && ref === prec.u && history.length > 1) { e.preventDefault(); history.back(); }
      });
    }
  }

  /* ================================================================
     CIBLE : collectivité ou entreprise. Un changement immédiat et
     réversible : les couleurs glissent, les textes changent, la
     photographie de l'ouverture se remplace d'un trait, de gauche à droite.
     ================================================================ */
  let cible = html.dataset.cible === 'e' ? 'e' : (etat.public === 'e' ? 'e' : 'c');
  const surCible = [];
  const indTg = grp => {
    if (grp.classList.contains('sw')) return;
    const ind = $('.ind', grp); const on = $('[aria-pressed=true]', grp);
    if (!ind || !on) return;
    ind.style.width = on.offsetWidth + 'px'; ind.style.transform = `translateX(${on.offsetLeft}px)`;
  };
  const appliqueCible = (v, anime, init) => {
    cible = v; html.dataset.cible = v; maj('public', v);
    $$('[data-pour]').forEach(el => {
      const vis = el.dataset.pour === v;
      if ((el.classList.contains('hv-c') || el.classList.contains('hv')) && anime && !RM) {
        if (vis) { el.hidden = false; el.classList.remove('sort', 'vient'); void el.offsetWidth; el.classList.add('vient', 'pose'); setTimeout(() => el.classList.remove('vient'), 800); }
        else { el.classList.add('sort'); setTimeout(() => { if (el.dataset.pour !== cible) { el.hidden = true; el.classList.remove('sort'); } }, 420); }
        return;
      }
      el.hidden = !vis;
      if (vis && anime && el.classList.contains('roule')) { el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }
      if (vis && anime && el.classList.contains('gal-c') && !RM) el.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
    $$('[data-cible-bt]').forEach(g => { $$('button', g).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); indTg(g); });
    if (!init) surCible.forEach(f => f(v));
  };
  const voile = (v, depuis) => {
    if (RM) return;
    const r = depuis ? depuis.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const x = r.left + r.width / 2, y = r.top + r.height / 2, R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const d = document.createElement('div'); d.className = 'voile-c'; d.style.background = v === 'e' ? '#FFE0D5' : '#E9E1FF';
    document.body.appendChild(d);
    d.animate([{ clipPath: `circle(0px at ${x}px ${y}px)`, opacity: .9 }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, opacity: .9, offset: .6 }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, opacity: 0 }], { duration: 760, easing: 'cubic-bezier(.65,0,.35,1)' }).onfinish = () => d.remove();
  };
  const bascule = (v, depuis) => {
    if (v === cible) return; compte('cible-' + v);
    voile(v, depuis);
    if (!RM) $$('[data-cible-bt]:not(.sw) .ind').forEach(ind => ind.animate([{ scale: '1 1' }, { scale: '1.12 .86', offset: .35 }, { scale: '1 1' }], { duration: 520, easing: 'cubic-bezier(.3,0,.2,1)' }));
    if (!RM) $$('[data-cible-bt].sw').forEach(g => { g.classList.remove('bouge'); void g.offsetWidth; g.classList.add('bouge'); });
    // l'en-tête reprend la couleur de la rubrique une fois la teinte installée
    [120, 380, 700].forEach(t => setTimeout(() => { fondHd = ''; themeHd(); }, t));
    appliqueCible(v, true);
  };
  $$('[data-cible-bt]').forEach(g => $$('button', g).forEach(b => b.addEventListener('click', () => bascule(b.dataset.v, $('.ind', g) || b))));
  // l'interrupteur : un appui sur la glissière bascule d'une cible à l'autre
  $$('[data-cible-bt].sw .ind').forEach(ind => { ind.setAttribute('aria-hidden', 'true'); ind.addEventListener('click', () => bascule(cible === 'c' ? 'e' : 'c', ind)); });
  const recale = () => $$('[data-cible-bt],.tg').forEach(indTg);
  addEventListener('resize', recale); if (document.fonts) document.fonts.ready.then(recale);

  /* ================================================================
     DÉTAILS : ouverture et fermeture en douceur (FAQ)
     ================================================================ */
  const animeDetails = (d, corps) => {
    const s = $('summary', d); if (!s || !corps) return;
    s.addEventListener('click', e => {
      if (RM) { if (!d.open) $$(':scope > details.qa[open]', d.parentElement).forEach(o => { if (o !== d) o.open = false; }); return; }
      e.preventDefault();
      if (d.dataset.anim) return;
      const ouvre = !d.open; d.dataset.anim = '1';
      if (ouvre) { const grp = d.parentElement; $$(':scope > details.qa[open]', grp).forEach(o => { if (o !== d) $('summary', o).click(); }); d.open = true; const h = corps.scrollHeight; corps.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 440, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => { delete d.dataset.anim; }; }
      else { const h = corps.scrollHeight; const an = corps.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.65,0,.35,1)' }); an.onfinish = () => { d.open = false; delete d.dataset.anim; }; }
    });
  };
  $$('details.qa').forEach(d => animeDetails(d, $(':scope > div', d)));

  /* ================================================================
     VOTRE NOM SUR LES SUPPORTS
     ================================================================ */
  const perso = { nom: '' }; // personnalisation retirée du site : on n'affiche plus de nom saisi
  const nomDefaut = () => cible === 'e' ? 'Atelier du Port' : 'Commune de Saint-Ivenec';
  const nomP = () => (perso.nom || '').trim() || nomDefaut();
  const nomCourt = () => nomP().replace(/^(commune|ville|mairie)\s+(de\s+|d[’']|du\s+)/i, '');
  const initiales = () => { const m = nomCourt().replace(/^(atelier|société|entreprise|groupe)\s+/i, '').split(/[\s'’-]+/).filter(Boolean); return ((m[0] || 'K')[0] + (m[1] ? m[1][0] : ((m[0] || 'KE')[1] || ''))).toUpperCase(); };
  const appliquePerso = () => {
    $$('[data-nom]').forEach(e => { e.textContent = e.dataset.nom === 'court' ? nomCourt() : nomP(); });
    $$('[data-ini]').forEach(e => { e.textContent = initiales(); });
    $$('.perso-n').forEach(inp => { inp.placeholder = nomDefaut(); });
  };
  $$('.perso-n').forEach(inp => {
    inp.value = perso.nom;
    inp.addEventListener('input', () => { perso.nom = inp.value.slice(0, 38); maj('perso', perso); appliquePerso(); compte('nom-saisi', true); });
  });
  const IMG = racine + 'assets/img/';
  // unités affichées sur les réalisations : lues dans le catalogue, jamais écrites à la main
  $$('[data-u]').forEach(el => { const c = CAT[el.dataset.u]; if (!c) { el.remove(); return; } el.textContent = `${c.u} unité${c.u > 1 ? 's' : ''}${c.id === 'bulletin' ? ' par page' : ''}`; });

  /* ================================================================
     VOUS DEMANDEZ, FILL S'OCCUPE DU RESTE : une seule séquence.
     Une même pièce traverse les quatre étapes : le message se tape,
     devient publication, affiche et newsletter en boucle, passe en
     épreuve et se valide, puis part vers les canaux choisis.
     ================================================================ */
  const etats = $('#etats'), demo = $('#demo');
  if (etats && demo) {
    const INFO = {
      c: { titre: 'Marché de Noël', date: 'Samedi 13 décembre', heure: '10 h à 18 h', lieu: 'Place de la mairie', texte: 'Trente exposants, le vin chaud des associations et l’arrivée du père Noël à 16 h.', img: 'ev-benevoles-s', pin: 'L’heure du père Noël, c’est bien 16 h ?' },
      e: { titre: 'Portes ouvertes', date: 'Samedi 14 mars', heure: '9 h à 17 h', lieu: 'À l’atelier', texte: 'Visites guidées, démonstrations et rencontres avec l’équipe. Deux postes sont à pourvoir.', img: 'en-garage-s', pin: 'On ajoute le lien des offres d’emploi ?' }
    };
    const CANAUX = [['site', 'Site'], ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['news', 'Newsletter'], ['presse', 'Presse']];
    const piece = $('.piece', demo), pw = $('.piece-w', demo), ep = $('.epreuve', demo), cz = $('.canaux', demo), ct = $('.canaux-t', demo), dz = $('.dests', demo);
    const bts = $$('.et4-b', etats);
    // sur mobile, le texte de l'étape active s'affiche juste au-dessus de l'exemple
    const desc = document.createElement('div'); desc.className = 'et4-d'; desc.setAttribute('aria-hidden', 'true'); etats.after(desc);
    const majDesc = n => { const i = $('.info > span', bts[n]); desc.innerHTML = i ? i.innerHTML : ''; desc.classList.remove('vient'); void desc.offsetWidth; desc.classList.add('vient'); };
    let k = -1, jeton = 0, manuel = false, vu = false, lance = false;
    const attends = (ms, j) => new Promise((ok, ko) => setTimeout(() => (j === jeton ? ok() : ko('stop')), RM ? 0 : ms));
    const TXT = () => { const i = INFO[cible]; return { c1: 'Bonjour, à annoncer :', titre: i.titre, date: i.date, heure: i.heure, lieu: i.lieu, texte: i.texte, c2: 'Photo jointe, merci !' }; };
    const rendPiece = () => {
      const i = INFO[cible], t = TXT();
      piece.innerHTML = `
        <span data-k="de"><span class="av" data-ini></span><span class="nm"><span class="de-l">De&nbsp;: </span><span data-nom></span></span></span>
        ${['c1', 'titre', 'date', 'heure', 'lieu', 'texte'].map(x => `<span data-k="${x}">${esc(t[x])}</span>`).join('')}
        <span data-k="vis" style="background-image:url(${IMG}${i.img}.webp)"></span>
        <span data-k="c2">${esc(t.c2)}</span>
        <span data-k="tete">La lettre de <span data-nom="court"></span></span>
        <span data-k="cta">Tout lire</span>`;
      appliquePerso();
    };
    const flip = (vers, anime) => {
      if (piece.dataset.f === vers) return;
      const els = $$('[data-k]', piece);
      const avant = anime ? new Map(els.map(el => [el, el.getBoundingClientRect()])) : null;
      const visAvant = anime ? new Map(els.map(el => [el, getComputedStyle(el).display !== 'none'])) : null;
      els.forEach(el => el.getAnimations().forEach(a => a.cancel()));
      piece.dataset.f = vers;
      if (!anime) return;
      els.forEach(el => {
        const b = el.getBoundingClientRect(); const a = avant.get(el);
        if (getComputedStyle(el).display === 'none' || !b.width) return;
        if (!visAvant.get(el) || !a.width) { el.animate([{ opacity: 0, transform: 'translateY(.5em)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 320, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }); return; }
        const dx = a.left - b.left, dy = a.top - b.top, s = a.width / b.width, sy = a.height / b.height;
        // l'image et l'en-tête se transforment ; le texte se retire puis se repose à sa nouvelle place
        if (['vis', 'de'].includes(el.dataset.k)) { el.animate([{ transform: `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${s.toFixed(3)},${sy.toFixed(3)})` }, { transform: 'none' }], { duration: 760, easing: 'cubic-bezier(.65,0,.35,1)' }); return; }
        el.animate([{ opacity: 0, transform: `translate(${(dx * .25).toFixed(1)}px,${(dy * .25).toFixed(1)}px)` }, { opacity: 0, offset: .35 }, { opacity: 1, transform: 'none' }], { duration: 760, easing: 'cubic-bezier(.16,1,.3,1)' });
      });
    };
    // canaux souhaités : facultatif, repris dans la demande
    let canaux = Array.isArray(etat.canaux) ? etat.canaux.filter(x => x === 'conseil' || CANAUX.some(c => c[0] === x)) : [];
    if (cz) cz.innerHTML = CANAUX.map(([id, l]) => `<button type="button" data-c="${id}" aria-pressed="${canaux.includes(id)}"><i aria-hidden="true"></i>${l}</button>`).join('') + `<button type="button" data-c="conseil" aria-pressed="${canaux.includes('conseil')}"><i aria-hidden="true"></i>Je vous laisse me conseiller</button>`;
    if (cz) cz.addEventListener('click', e => {
      const b = e.target.closest('button[data-c]'); if (!b) return;
      const id = b.dataset.c; const on = b.getAttribute('aria-pressed') !== 'true';
      if (id === 'conseil') canaux = on ? ['conseil'] : [];
      else { canaux = canaux.filter(x => x !== 'conseil' && x !== id); if (on) canaux.push(id); }
      $$('button', cz).forEach(x => x.setAttribute('aria-pressed', String(canaux.includes(x.dataset.c))));
      maj('canaux', canaux); compte('canaux-choisis', true);
    });
    const destinations = () => { const l = canaux.filter(x => x !== 'conseil'); const d = l.length ? l : ['site', 'facebook', 'instagram']; return d.slice(0, 4).map(id => CANAUX.find(c => c[0] === id)); };
    const nettoie = () => {
      ep.innerHTML = ''; dz.innerHTML = ''; dz.hidden = true;
      $$('.vol').forEach(v => v.remove());
      pw.getAnimations().forEach(a => a.cancel()); pw.style.transform = '';
      const cur = $('.curseur', piece); if (cur) cur.remove();
    };
    const montreCanaux = on => { if (cz) cz.hidden = !on; if (ct) ct.hidden = !on; };
    // 1. la saisie : quelques mots, un curseur, puis l'essentiel se met en place
    const tape = async j => {
      rendPiece(); flip('brut', false);
      const t = TXT(), ordre = ['c1', 'titre', 'date', 'heure', 'lieu', 'texte', 'c2'];
      if (RM) { ['titre', 'date', 'lieu'].forEach(x => { const el = $(`[data-k=${x}]`, piece); el.innerHTML = `<mark>${esc(t[x])}</mark>`; }); return; }
      ordre.forEach(x => { $(`[data-k=${x}]`, piece).textContent = ''; });
      const vis = $('[data-k=vis]', piece); vis.style.opacity = 0;
      const cur = document.createElement('span'); cur.className = 'curseur';
      for (const x of ordre) {
        const el = $(`[data-k=${x}]`, piece); el.appendChild(cur);
        if (x === 'c2') { vis.animate([{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }); await attends(260, j); }
        const s = t[x];
        for (let n = 1; n <= s.length; n++) { el.textContent = s.slice(0, n); el.appendChild(cur); if (n % 2 === 0 || n === s.length) await attends(/[,.:]/.test(s[n - 1]) ? 90 : 22, j); }
        await attends(x === 'texte' ? 160 : 90, j);
      }
      cur.remove(); vis.style.opacity = '';
      await attends(380, j);
      for (const x of ['titre', 'date', 'lieu']) { const el = $(`[data-k=${x}]`, piece); el.innerHTML = `<mark>${esc(t[x])}</mark>`; el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-2px)' }, { transform: 'none' }], { duration: 320 }); await attends(260, j); }
    };
    // 2. trois supports, en boucle tant que l'étape est affichée
    const SOUS = ['post', 'affiche', 'news'];
    const boucle = async j => {
      rendPiece(); piece.dataset.f = 'brut';
      let n = 0;
      while (j === jeton) { flip(SOUS[n % 3], !RM); await attends(n === 0 ? 1600 : 2300, j); n++; if (RM) break; }
    };
    // 3. l'épreuve : elle se pose, une remarque, puis la validation
    const valide = async j => {
      rendPiece(); flip('post', false);
      ep.innerHTML = `<span class="cadre"></span><span class="pin">${esc(INFO[cible].pin)}</span><span class="souris" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z"/></svg></span><span class="ok-b">Valider l’épreuve</span>`;
      const [cadre, pin, souris, okb] = ['.cadre', '.pin', '.souris', '.ok-b'].map(s => $(s, ep));
      const f = { fill: 'forwards', easing: 'cubic-bezier(.16,1,.3,1)' };
      if (RM) { [cadre, okb].forEach(e => { e.style.opacity = 1; }); okb.classList.add('fait'); okb.textContent = 'Épreuve validée'; return; }
      pw.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }], Object.assign({ duration: 500 }, f));
      cadre.animate([{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'none' }], Object.assign({ duration: 500 }, f));
      await attends(650, j);
      pin.animate([{ opacity: 0, transform: 'translateY(8px) scale(.92)' }, { opacity: 1, transform: 'none' }], Object.assign({ duration: 420 }, f));
      await attends(1300, j);
      pin.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px)' }], Object.assign({ duration: 300 }, f));
      okb.animate([{ opacity: 0, transform: 'translate(-50%,10px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], Object.assign({ duration: 420 }, f));
      const r = pw.getBoundingClientRect(), b = okb.getBoundingClientRect();
      souris.animate([{ opacity: 0, transform: 'translate(0,0)' }, { opacity: 1, offset: .15 }, { opacity: 1, transform: `translate(${(b.left - r.left - r.width * .2 + b.width * .45).toFixed(0)}px,${(b.top - r.top - r.height * .2 + 10).toFixed(0)}px)` }], Object.assign({ duration: 900, delay: 250 }, f));
      await attends(1200, j);
      okb.animate([{ transform: 'translate(-50%,0) scale(1)' }, { transform: 'translate(-50%,0) scale(.93)' }, { transform: 'translate(-50%,0) scale(1)' }], { duration: 260 });
      okb.classList.add('fait'); okb.innerHTML = '<svg class="i"><use href="#ok"/></svg>Épreuve validée';
      souris.animate([{ opacity: 1 }, { opacity: 0 }], Object.assign({ duration: 400, delay: 300 }, f));
      cadre.animate([{ boxShadow: 'inset 0 0 0 2px #1A1A1A' }, { boxShadow: `inset 0 0 0 3px ${varC('--cible')}` }], Object.assign({ duration: 400 }, f));
    };
    // 4. la publication : le visuel validé part vers chaque canal
    const publie = async j => {
      rendPiece(); flip('post', false);
      const d = destinations();
      dz.hidden = false;
      dz.innerHTML = d.map(([id, l]) => `<div class="dest" data-d="${id}"><span class="ec"><span class="mini" style="background-image:url(${IMG}${INFO[cible].img}.webp)"></span></span>${l}</div>`).join('');
      const tiles = $$('.dest', dz);
      if (RM) { tiles.forEach(t => t.classList.add('ok')); return; }
      tiles.forEach((t, i) => t.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
      await attends(520, j);
      const src = $('[data-k=vis]', piece).getBoundingClientRect();
      for (const t of tiles) {
        const e = $('.ec', t).getBoundingClientRect();
        const v = document.createElement('span'); v.className = 'vol'; v.style.backgroundImage = `url(${IMG}${INFO[cible].img}.webp)`;
        Object.assign(v.style, { left: src.left + 'px', top: src.top + 'px', width: src.width + 'px', height: src.height + 'px' });
        document.body.appendChild(v);
        const dx = e.left + 8 - src.left, dy = e.top + 8 - src.top, sx = (e.width - 16) / src.width, sy = (e.height - 16) / src.height;
        const an = v.animate([{ transform: 'none', opacity: .95 }, { transform: `translate(${dx}px,${dy - 40}px) scale(${(sx + 1) / 2},${(sy + 1) / 2})`, opacity: 1, offset: .55 }, { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, opacity: 1 }], { duration: 720, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
        an.onfinish = () => { v.remove(); t.classList.add('ok'); };
        await attends(240, j);
      }
    };
    const SEQ = [tape, boucle, valide, publie];
    const DUREE = [2200, 6900, 2600, 0];
    const va = async (n, parUtil) => {
      const j = ++jeton; k = n;
      bts.forEach((b, i) => { b.setAttribute('aria-selected', String(i === n)); b.tabIndex = i === n ? 0 : -1; b.classList.toggle('fait', i <= n); });
      majDesc(n);
      etats.style.setProperty('--p', (n / (bts.length - 1)).toFixed(3));
      nettoie(); montreCanaux(n === 0);
      if (parUtil) { manuel = true; compte('etat-demande', true); }
      // l'étape 2 tourne en boucle ; en lecture automatique, elle passe la main après quelques tours
      $$('.et4-t', etats).forEach(t => t.getAnimations().forEach(a => a.cancel()));
      // en lecture automatique, un filet sous l'étape indique le temps avant la suivante
      const minuteur = ms => { const t = $('.et4-t', bts[n]); if (t && !RM && !manuel) t.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'linear', fill: 'forwards' }); };
      if (n === 1 && !manuel) { minuteur(DUREE[1]); setTimeout(() => { if (j === jeton && !manuel && vu && !document.hidden) va(2); }, DUREE[1]); }
      try {
        await SEQ[n](j);
        if (!manuel && n !== 1 && n < bts.length - 1) { minuteur(DUREE[n]); await attends(DUREE[n], j); if (vu && !document.hidden) va(n + 1); }
      } catch (e) { /* étape interrompue par une autre */ }
    };
    bts.forEach((b, i) => b.addEventListener('click', () => va(i, true)));
    etats.addEventListener('keydown', e => { if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return; e.preventDefault(); const n = (k + (/Down|Right/.test(e.key) ? 1 : bts.length - 1)) % bts.length; va(n, true); bts[n].focus(); });
    const fixeRail = () => { const last = bts[bts.length - 1]; etats.style.setProperty('--last', Math.max(0, etats.offsetHeight - last.offsetTop - 26) + 'px'); };
    addEventListener('resize', fixeRail); setTimeout(fixeRail, 50); if (document.fonts) document.fonts.ready.then(fixeRail);
    if ('ResizeObserver' in window) new ResizeObserver(fixeRail).observe(etats);
    rendPiece(); piece.dataset.f = 'brut'; k = 0; majDesc(0); bts[0].setAttribute('aria-selected', 'true'); bts[0].classList.add('fait'); montreCanaux(true);
    surCible.push(() => { if (k >= 0) va(k, false); });
    new IntersectionObserver(es => {
      vu = es[0].isIntersecting;
      if (vu && !lance) { lance = true; va(0); }
    }, { threshold: .4 }).observe(demo);
  }

  /* ================================================================
     FORMULES : des cartes comparables d'un coup d'œil, le détail
     s'ouvre dans la carte. Choisir n'ajoute aucune prestation.
     ================================================================ */
  const fos = $('#fos');
  if (fos) {
    const complet = fos.dataset.mode === 'complet';
    const carte = f => `<article class="fo" data-f="${f.id}">
      <div class="fo-a"><h3>${esc(f.nom)}</h3><p class="fo-c">${esc(f.court)}</p></div>
      <p class="fo-p"><b>${eur(f.prix)}<small>&nbsp;€</small></b><span>par mois</span></p>
      <ul class="fo-at">${(f.atouts || []).map((t, k) => `<li style="--k:${k}"><svg class="i" aria-hidden="true"><use href="#ok"/></svg><span>${t}</span></li>`).join('')}</ul>
      <div class="fo-det" id="det-${f.id}"><div><dl class="fo-d"><div><dt>Par exemple</dt><dd>${esc((f.exemples[0] || []).slice(0, 3).join(', '))}</dd></div><div><dt>Urgences</dt><dd>${esc(f.urgences)}</dd></div><div><dt>Suivi</dt><dd>${esc(f.suivi)}</dd></div><div><dt>Mise en place</dt><dd>${eur(f.mise_en_place)} € avec 6 mois · offerte avec ${O.engagement_long} mois</dd></div><div><dt>Créations</dt><dd>5 jours ouvrés</dd></div></dl><p class="fo-ex"><b>Pour qui :</b> ${esc(f.pour)}</p></div></div>
      <div class="fo-act"><a class="bt" href="${U('demande/')}" data-choisit="${f.id}">Choisir ${esc(f.nom)} <span class="ar"><svg class="i"><use href="#ar"/></svg></span></a><button type="button" class="fo-plus" aria-expanded="false" aria-controls="det-${f.id}"><i aria-hidden="true">+</i>Détails</button></div>
    </article>`;
    fos.innerHTML = FORM.map(carte).join('');
    const vuF = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vu'); vuF.unobserve(e.target); } }), { threshold: .35 });
    $$('.fo', fos).forEach((c, i) => { c.style.setProperty('--i', i); vuF.observe(c); });
    $$('.fo', fos).forEach(c => {
      const b = $('.fo-plus', c);
      b.addEventListener('click', () => { const o = !c.classList.contains('ouvert'); c.classList.toggle('ouvert', o); b.setAttribute('aria-expanded', String(o)); compte('formule-detail', true); });
    });
    $$('[data-choisit]', fos).forEach(a => a.addEventListener('click', () => { const s = selFormule(a.dataset.choisit); if (s) maj('selection', s); compte('formule-' + a.dataset.choisit); }));
  }

  /* ================================================================
     CALENDRIER : un exemple saisonnier pour partir, puis vos propres
     temps forts. Le calcul simule chaque mois : unités incluses,
     report reçu du mois précédent, unités utilisées, hors forfait.
     ================================================================ */
  const cal = $('#cal');
  if (cal) {
    // jour, temps fort, ensemble de prestations (voir PACKS)
    const D = {
      c: { 1: [[6, 'Vœux du maire', 'aff'], [20, 'Bulletin d’hiver', 'bul'], [27, 'Recensement', 'pa']], 2: [[3, 'Débat d’orientation budgétaire', 'pa'], [10, 'Vacances d’hiver', 'prog'], [24, 'Travaux de printemps', 'pa']],
        3: [[8, 'Journée des droits des femmes', 'pub'], [14, 'Budget voté', 'pa'], [21, 'Nettoyage de printemps', 'aff']], 4: [[1, 'Inscriptions scolaires', 'pa'], [12, 'Vacances de printemps', 'prog'], [25, 'Chasse aux œufs', 'aff']],
        5: [[8, 'Commémoration du 8 mai', 'pa'], [16, 'Fête de la nature', 'aff'], [28, 'Bulletin d’été', 'bul']], 6: [[5, 'Saison estivale', 'pa'], [21, 'Fête de la musique', 'aff'], [28, 'Kermesses', 'pub']],
        7: [[3, 'Programme d’été', 'prog'], [14, 'Fête nationale', 'aff'], [20, 'Marchés estivaux', 'pub']], 8: [[5, 'Animations d’août', 'pub'], [20, 'Forum des associations', 'aff'], [28, 'Rentrée', 'pa']],
        9: [[1, 'Rentrée scolaire', 'pa'], [6, 'Forum des associations', 'aff'], [20, 'Journées du patrimoine', 'prog']], 10: [[1, 'Octobre rose', 'pub'], [6, 'Semaine bleue', 'prog'], [18, 'Vacances de la Toussaint', 'prog']],
        11: [[11, 'Commémoration du 11 novembre', 'pa'], [22, 'Lettre de fin d’année', 'news'], [28, 'Téléthon', 'aff']], 12: [[6, 'Marché de Noël', 'aff'], [15, 'Horaires des fêtes', 'pa'], [22, 'Vœux du maire', 'aff']] },
      e: { 1: [[8, 'Vœux aux clients', 'news'], [15, 'Bilan de l’année', 'pa'], [29, 'Recrutements de printemps', 'pa']], 2: [[5, 'Salon professionnel', 'aff'], [19, 'Portraits d’équipe', 'photo'], [26, 'Lettre clients', 'news']],
        3: [[10, 'Chantier de référence', 'pa'], [17, 'Offres d’emploi', 'pa'], [31, 'Clôture du trimestre', 'pub']], 4: [[7, 'Nouveau produit', 'pa'], [14, 'Portes ouvertes', 'aff'], [28, 'Lettre clients', 'news']],
        5: [[12, 'Salon régional', 'aff'], [19, 'Témoignage client', 'pa'], [26, 'Recrutement d’été', 'pa']], 6: [[9, 'Anniversaire de l’entreprise', 'cp'], [16, 'Chantiers de l’été', 'pub'], [30, 'Fermeture estivale', 'pub']],
        7: [[7, 'Coulisses de l’atelier', 'video'], [15, 'Fermeture estivale', 'pub'], [29, 'Préparer la rentrée', 'pub']], 8: [[26, 'Rentrée', 'pa'], [28, 'Offres de rentrée', 'pa'], [31, 'Lettre de rentrée', 'news']],
        9: [[8, 'Rentrée commerciale', 'pa'], [16, 'Salon de rentrée', 'aff'], [29, 'Lettre clients', 'news']], 10: [[7, 'Nouvelle réalisation', 'photo'], [14, 'Semaine de l’industrie', 'pub'], [28, 'Recrutement', 'pa']],
        11: [[4, 'Retour d’expérience client', 'pa'], [18, 'Vœux de fin d’année', 'aff'], [25, 'Lettre clients', 'news']], 12: [[5, 'Bilan de l’année', 'pa'], [12, 'Vœux aux clients', 'news'], [19, 'Fermeture des fêtes', 'pub']] }
    };
    const uPack = k => unitesPanier(PACKS[k].p);
    const g = $('.cal-g', cal), som = $('.cal-s', cal), go = $('[data-cal-go]', cal), lienB = $('[data-cal-lien]', cal);
    let choix = (etat.cal && etat.cal.v === 1) ? etat.cal : { v: 1, coche: {}, ajouts: [] };
    if (fromHash && fromHash.cal) choix = { v: 1, coche: {}, ajouts: evPropres(fromHash.cal) };
    const evs = () => {
      const l = [];
      MOIS3.forEach((m, mi) => (D[cible][m.getMonth() + 1] || []).forEach((e, j) => { if (choix.coche[`${cible}${m.getMonth() + 1}-${j}`]) l.push({ m: mi, t: e[1], k: e[2] }); }));
      return l.concat(choix.ajouts);
    };
    const opts = Object.entries(PACKS).map(([k, p]) => `<option value="${k}">${esc(p.l)} · ${uPack(k)} u.</option>`).join('');
    const rend = () => {
      g.innerHTML = MOIS3.map((m, mi) => {
        const ev = D[cible][m.getMonth() + 1] || [];
        const aj = choix.ajouts.map((e, i) => [e, i]).filter(([e]) => e.m === mi);
        return `<section class="mo" aria-labelledby="mo-${mi}"><p class="mo-i">Mois ${mi + 1} sur 3</p><h3 id="mo-${mi}">${esc(mNom(m))}</h3><p class="mo-u"><b data-mu="${mi}">0</b> <span>unité</span><em data-md="${mi}"></em></p><div class="mo-g" aria-hidden="true"><svg viewBox="0 0 300 12" preserveAspectRatio="none"><path class="fond" d="M6 6H294"/><path class="val" pathLength="1" data-mg="${mi}" d="M6 6H294"/></svg></div><p class="mo-st" data-ms="${mi}">Rien de coché pour l’instant</p>
          <p class="cap">Exemple saisonnier, à cocher</p>
          ${ev.map((e, j) => { const id = `${cible}${m.getMonth() + 1}-${j}`; return `<label class="ev3"><input type="checkbox" data-id="${id}"${choix.coche[id] ? ' checked' : ''}><span class="k" aria-hidden="true"></span><span><b>${esc(e[1])}</b><small>${e[0]} ${esc(mNom(m))} · ${esc(PACKS[e[2]].l)}</small></span><span class="u">${uPack(e[2])} u.</span></label>`; }).join('')}
          ${aj.length ? '<p class="cap" style="margin-top:6px">Vos temps forts</p>' : ''}
          ${aj.map(([e, i]) => `<div class="ev3 aj"><span class="k on" aria-hidden="true"></span><span><b>${esc(e.t)}</b><small>${esc(PACKS[e.k].l)}</small></span><button type="button" class="u x" data-retire="${i}" aria-label="Retirer : ${esc(e.t)}"><svg class="i"><use href="#x"/></svg></button></div>`).join('')}
          <form class="ajout" data-m="${mi}"><p class="aj-h">Ajouter un temps fort en ${esc(mNom(m))}</p><label class="sr" for="aj-t-${mi}">Nom du temps fort</label><input id="aj-t-${mi}" maxlength="60" placeholder="${cible === 'e' ? 'Ex. : salon, lancement' : 'Ex. : fête du port, travaux'}" required><label class="sr" for="aj-k-${mi}">Ce qu’il demande</label><select id="aj-k-${mi}">${opts}</select><button type="submit" class="bt sm"><svg class="i" aria-hidden="true"><use href="#pl"/></svg>Ajouter</button></form>
        </section>`;
      }).join('');
      somme();
    };
    let selC = null;
    const somme = () => {
      const l = evs(); const parMois = panierCal(l).map(unitesPanier);
      parMois.forEach((u, i) => { const b = $(`[data-mu="${i}"]`, g); if (b) { b.textContent = u; b.nextElementSibling.textContent = u > 1 ? 'unités' : 'unité'; b.closest('.mo').classList.toggle('plein', u > 0); } });
      selC = selCalendrier(l);
      // la jauge de chaque mois : la part de ce qui est disponible (forfait et report), le dépassement en encre
      $$('[data-mg]', g).forEach(pth => {
        const i = +pth.dataset.mg, x = selC && selC.sim ? selC.sim[i] : null, dispo = x ? x.inclus + x.report : 1;
        const v = x ? Math.min(1, x.besoin / Math.max(1, dispo)) : 0;
        pth.style.setProperty('--v', v.toFixed(3)); pth.classList.toggle('hors', !!(x && x.hors));
        const st = $(`[data-ms="${i}"]`, g), dd = $(`[data-md="${i}"]`, g);
        if (dd) dd.textContent = x ? `sur ${dispo} disponibles` : '';
        if (st) { st.classList.toggle('x', !!(x && x.hors)); st.textContent = !x ? (selC && selC.horsCadre ? 'Volume à étudier' : 'Rien de coché pour l’instant') : !x.besoin ? `Mois calme : ${x.reporte} unité${x.reporte > 1 ? 's' : ''} reportée${x.reporte > 1 ? 's' : ''}` : x.hors ? `Pic du trimestre : ${x.hors} unité${x.hors > 1 ? 's' : ''} hors forfait` : `Dans le forfait, ${dispo - x.besoin} unité${dispo - x.besoin > 1 ? 's' : ''} de marge`; }
      });
      const perso2 = choix.ajouts.length > 0;
      const titre = `<p class="cap">${l.length ? `Votre calendrier : ${l.length} temps fort${l.length > 1 ? 's' : ''}${perso2 ? ', dont ' + choix.ajouts.length + ' ajouté' + (choix.ajouts.length > 1 ? 's' : '') + ' par vous' : ''}` : 'Votre calendrier est vide'}</p>`;
      if (!selC) { som.innerHTML = titre + `<p>Cochez les temps forts qui vous concernent ou ajoutez les vôtres : chaque mois est simulé avec les unités incluses et le report du mois précédent.</p>`; [go, lienB].forEach(b => b.setAttribute('aria-disabled', 'true')); }
      else {
        [go, lienB].forEach(b => b.removeAttribute('aria-disabled'));
        if (selC.horsCadre) som.innerHTML = titre + `<p><b>Étude personnalisée nécessaire.</b> Même avec la formule la plus complète et le report, un mois dépasserait de plus de 6 unités : ce trimestre se chiffre après un échange.</p>`;
        else {
          const t = selC.sim; const hors = t.reduce((s, x) => s + x.hors, 0);
          const cout3 = selC.mensuel * 3 + hors * O.unite_sup, bes = t.map(x => x.besoin), rep = t.map(x => x.reporte);
          som.innerHTML = titre + `<dl class="cal-r4">
            <div><dt>Vos besoins</dt><dd><b>${bes.join(' · ')}</b><span>unités, de ${esc(mNom(MOIS3[0]))} à ${esc(mNom(MOIS3[2]))}</span></dd></div>
            <div class="fc"><dt>Formule conseillée</dt><dd><b>${esc(selC.titre.replace(/^Formule /, ''))}</b><span>${eur(selC.mensuel)} € par mois, ${selC.capacite} unités</span></dd></div>
            <div><dt>Reports</dt><dd><b>${rep[0]} · ${rep[1]}</b><span>unités reportées sur le mois suivant</span></dd></div>
            <div class="${hors ? 'x' : ''}"><dt>Dépassement</dt><dd><b>${hors ? `${hors} unité${hors > 1 ? 's' : ''}` : 'Aucun'}</b><span>${hors ? `${eur(hors * O.unite_sup)} €, sur accord écrit` : 'le forfait et le report suffisent'}</span></dd></div>
            <div class="tt"><dt>Coût du trimestre</dt><dd><b>${eur(cout3)} €</b><span>3 × ${eur(selC.mensuel)} €${hors ? ` + ${eur(hors * O.unite_sup)} € de dépassement` : ''}</span></dd></div>
          </dl>
            <details class="cal-d"><summary>Le détail mois par mois</summary><div class="cal-wrap"><table class="cal-t"><thead><tr><th scope="col">Mois</th><th scope="col">Besoin</th><th scope="col">Inclus</th><th scope="col">Report reçu</th><th scope="col">Utilisées</th><th scope="col">Hors forfait</th><th scope="col">Reportées</th></tr></thead><tbody>
            ${t.map((x, i) => `<tr><td>${esc(mNom(MOIS3[i]))}</td><td>${x.besoin}</td><td>${x.inclus}</td><td>${x.report}</td><td>${x.utilise}</td><td class="${x.hors ? 'x' : ''}">${x.hors}</td><td>${i < 2 ? x.reporte : `${x.reporte}*`}</td></tr>`).join('')}
            </tbody></table></div><p class="note" style="margin-top:8px">Le report reçu est consommé en premier ; les unités non utilisées d’un mois sont reportées une seule fois. * Reportées sur le mois suivant le trimestre.</p></details>`;
        }
      }
      maj('cal', choix);
    };
    g.addEventListener('change', e => { const cb = e.target.closest('input[type=checkbox][data-id]'); if (!cb) return; if (cb.checked) choix.coche[cb.dataset.id] = 1; else delete choix.coche[cb.dataset.id]; somme(); compte('calendrier-choix', true); });
    g.addEventListener('submit', e => { const f = e.target.closest('form.ajout'); if (!f) return; e.preventDefault(); const t = $('input', f).value.trim(); if (!t) return; choix.ajouts.push({ m: +f.dataset.m, t: t.slice(0, 60), k: $('select', f).value }); rend(); const n = $(`form.ajout[data-m="${f.dataset.m}"] input`, g); if (n) n.focus(); compte('calendrier-ajout', true); });
    g.addEventListener('click', e => { const b = e.target.closest('[data-retire]'); if (!b) return; choix.ajouts.splice(+b.dataset.retire, 1); rend(); });
    go.addEventListener('click', e => { if (!selC) { e.preventDefault(); toast('Choisissez au moins un temps fort.'); return; } maj('selection', selC); compte('calendrier-demande'); });
    lienB.addEventListener('click', () => { if (!selC) { toast('Choisissez au moins un temps fort.'); return; } copie(lienPartage('calendrier/', selC)); });
    rend(); surCible.push(rend);
  }

  /* ================================================================
     CARTES DÉFILANTES : pagination discrète sous les rails (mobile)
     ================================================================ */
  $$('[data-rail]').forEach(rail => {
    const sel = rail.dataset.rail || ':scope > *';
    const items = () => $$(sel, rail).filter(c => c.offsetWidth);
    const dots = document.createElement('div'); dots.className = 'dots'; dots.setAttribute('aria-hidden', 'true');
    rail.after(dots);
    let raf2 = 0;
    const majD = () => {
      raf2 = 0; const it = items(); const defile = rail.scrollWidth > rail.clientWidth + 4;
      dots.hidden = !defile; if (!defile) return;
      if (dots.children.length !== it.length) {
        dots.innerHTML = it.map(() => '<button type="button" tabindex="-1"></button>').join('');
        $$('button', dots).forEach((b, i) => b.addEventListener('click', () => { const r0 = rail.getBoundingClientRect(), r = it[i].getBoundingClientRect(); rail.scrollBy({ left: r.left - r0.left - parseFloat(getComputedStyle(rail).scrollPaddingLeft || 0), behavior: RM ? 'auto' : 'smooth' }); }));
      }
      const r0 = rail.getBoundingClientRect(); const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
      let k = 0, bd = 1e9; it.forEach((c, i) => { const dd = Math.abs(c.getBoundingClientRect().left - r0.left - pad); if (dd < bd) { bd = dd; k = i; } });
      if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) k = it.length - 1;
      $$('button', dots).forEach((b, i) => b.setAttribute('aria-current', String(i === k)));
    };
    rail.addEventListener('scroll', () => { if (!raf2) raf2 = requestAnimationFrame(majD); }, { passive: true });
    addEventListener('resize', majD); setTimeout(majD, 60);
    surCible.push(() => { dots.innerHTML = ''; rail.scrollLeft = 0; setTimeout(majD, 30); });
  });

  /* la galerie se distribue : les cartes partent d'une pile, au centre, et prennent leur place */
  if (!RM && matchMedia('(min-width:900px)').matches) $$('.gal').forEach(g => {
    const ob = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return; ob.disconnect();
      const cs = $$('.gal-c', g).filter(c => !c.hidden && c.offsetWidth); const gr = g.getBoundingClientRect();
      const cx = gr.left + gr.width / 2, cy = gr.top + Math.min(gr.height, innerHeight) * .4;
      cs.forEach((c, i) => {
        const r = c.getBoundingClientRect(), dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2), rot = ((i * 37) % 11) - 5;
        const sc = Math.min(1, 260 / r.width);
        c.animate([{ transform: `translate(${dx.toFixed(0)}px,${dy.toFixed(0)}px) rotate(${rot}deg) scale(${sc.toFixed(2)})`, opacity: 0 }, { opacity: 1, offset: .25 }, { transform: 'none', opacity: 1 }], { duration: 1100, delay: i * 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      });
    }, { threshold: .18 });
    ob.observe(g);
  });

  /* les filets de paragraphe s'étendent au défilement, de la gauche vers la droite */
  {
    const filets = $$('.trait:not(.sans)');
    if (RM || !filets.length) filets.forEach(t => t.style.setProperty('--k', 1));
    else {
      let raf = 0;
      const maj = () => { raf = 0; const vh = innerHeight; filets.forEach(t => { const r = t.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) return; const k = clamp01((vh * .9 - r.top) / (vh * .32)); t.style.setProperty('--k', (k * k * (3 - 2 * k)).toFixed(3)); }); };
      addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(maj); }, { passive: true });
      addEventListener('resize', maj); setTimeout(maj, 60); addEventListener('load', maj);
    }
  }

  /* contour tracé au survol des cartes */
  const contour = el => { if (!el.querySelector(':scope > .contour')) el.insertAdjacentHTML('beforeend', '<svg class="contour" aria-hidden="true"><rect pathLength="1"/></svg>'); };
  $$('.trace').forEach(contour);

  /* les photographies se posent quand elles arrivent */
  const vu1 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); vu1.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.ph-r').forEach(el => vu1.observe(el));
  const vuEq = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vu'); vuEq.unobserve(e.target); } }), { threshold: .3 });
  $$('.eq-maq').forEach(el => vuEq.observe(el));
  if (rub === 'entreprises' && cible !== 'e') appliqueCible('e', false);
  if (rub === 'collectivites' && cible !== 'c') appliqueCible('c', false);

  /* ================================================================
     LE FIL (V5) : un seul fil, du logo jusqu'à l'appel final.
     1. L'ouverture : il sort du logo, passe sous le mot « fil »,
        longe le texte, entoure la petite photographie, file derrière
        la grande et rejoint le bas de l'ouverture.
     2. Le passage : la caméra suit le fil puis plonge dedans ; il
        grossit, passe du rouge à la nuit et devient le chapitre.
     3. Les liaisons : il relie la galerie à la séquence des demandes,
        la séquence au titre des formules ; sa tête suit le défilement.
     4. La crue : il gonfle jusqu'à devenir le rouge de l'appel final.
     ================================================================ */
  const NS = 'http://www.w3.org/2000/svg';
  const EP = () => Math.max(15, Math.min(24, innerWidth * .0155));
  const sortie = t => 1 - Math.pow(1 - t, 3);
  const hex = s => { s = s.trim(); if (s.startsWith('#')) return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const m = s.match(/\d+/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; };
  const melange = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
  const rel = (el, ref) => { const a = el.getBoundingClientRect(), b = ref.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height, r: a.right - b.left, b: a.bottom - b.top }; };
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v)); if (parent) parent.appendChild(e); return e; };
  const filTermine = [];
  $$('.trait').forEach((t, i) => { if (i % 3) t.classList.add('v' + (i % 3 + 1)); });
  // un fil dans chaque carte de la galerie, qui passe au survol
  // les visuels en paysage sont présentés entiers, sur un passe-partout de la cible
  $$('.gal-i').forEach(g => { const m = (g.getAttribute('style') || '').match(/--ar:\s*(\d+)\/(\d+)/); if (m && +m[1] / +m[2] > 1.02) g.classList.add('pay'); });
  $$('.gal-c').forEach(c => ($('.gal-i', c) || c).insertAdjacentHTML('beforeend', '<svg class="gf" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M-4 20C18 12 32 28 52 21S84 8 104 15"/></svg>'));
  const majEp = () => html.style.setProperty('--ep', f1(EP()) + 'px'); majEp(); addEventListener('resize', majEp);

  /* ---------- l'ouverture : les visuels suivent légèrement le pointeur ---------- */
  const hero = $('.hero');
  const sortieX = null;
  if (hero && !RM && matchMedia('(hover:hover)').matches) {
    const hv = $('.hero-v', hero);
    if (hv) {
      let raf = 0, px = 0, py = 0;
      hv.addEventListener('pointermove', e => { const r = hv.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5; if (!raf) raf = requestAnimationFrame(() => { raf = 0; hv.style.setProperty('--px', px.toFixed(3)); hv.style.setProperty('--py', py.toFixed(3)); }); });
      hv.addEventListener('pointerleave', () => { hv.style.setProperty('--px', 0); hv.style.setProperty('--py', 0); });
    }
  }

  /* ---------- le passage : le fil entre par un côté, fait une boucle, la caméra plonge dedans ----------
     Le tracé suit le défilement ; dans la boucle, la caméra zoome, pivote d'un quart de tour au plus,
     et le fil prend la couleur de la rubrique suivante, qu'il finit par remplir. */
  const couleurDe = (v, hote) => { const e = document.createElement('i'); e.style.color = v; e.style.display = 'none'; hote.appendChild(e); const c = getComputedStyle(e).color; e.remove(); return c; };
  $$('.passage').forEach(passage => {
    const ps = $('.passage-s', passage), sv = $('svg', passage), g = $('g', sv), p = $('path', sv), tt = $('.passage-t', passage);
    if (!sv) return;
    const gauche = passage.dataset.sens !== 'd';
    let L = 0, lz = 0, O = { x: 0, y: 0 }, smax = 80, Dc = 1e9, cA = '', cB = '', sw = 16;
    const trace = () => {
      const W = ps.clientWidth, H = ps.clientHeight; sw = EP() * 1.2;
      const X = x => f1(gauche ? x : W - x), Y = y => f1(y);
      sv.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const d = `M${X(-90)} ${Y(H * .36)}C${X(W * .16)} ${Y(H * .3)} ${X(W * .3)} ${Y(H * .22)} ${X(W * .47)} ${Y(H * .29)}`
        + `C${X(W * .65)} ${Y(H * .36)} ${X(W * .67)} ${Y(H * .66)} ${X(W * .53)} ${Y(H * .73)}`
        + `C${X(W * .39)} ${Y(H * .8)} ${X(W * .27)} ${Y(H * .63)} ${X(W * .35)} ${Y(H * .49)}`
        + `C${X(W * .43)} ${Y(H * .35)} ${X(W * .66)} ${Y(H * .3)} ${X(W * .82)} ${Y(H * .41)}`
        + `C${X(W * .92)} ${Y(H * .48)} ${X(W * .98)} ${Y(H * .6)} ${X(W + 100)} ${Y(H * .62)}`;
      p.setAttribute('d', d); p.style.strokeWidth = sw;
      L = p.getTotalLength(); p.style.strokeDasharray = `${f1(L)} ${f1(L + 80)}`;
      // point de plongée : le bas de la boucle
      let best = 0, by = -1; for (let i = 0; i <= 120; i++) { const l = L * (.3 + .4 * i / 120), q = p.getPointAtLength(l); if (q.y > by) { by = q.y; best = l; } }
      lz = best; const q = p.getPointAtLength(lz); O = { x: q.x, y: q.y };
      Dc = Math.max(Math.hypot(O.x, O.y), Math.hypot(W - O.x, O.y), Math.hypot(O.x, H - O.y), Math.hypot(W - O.x, H - O.y));
      smax = (Dc / (sw / 2)) * 1.3;
      cA = couleurDe(getComputedStyle(passage).getPropertyValue('--trait') || 'currentColor', passage);
      cB = couleurDe(getComputedStyle(passage).getPropertyValue('--vers') || 'currentColor', passage);
      maj();
    };
    // la position est lissée d'une image à l'autre : le fil suit le défilement sans à-coups
    let lis = null;
    const maj = () => {
      const vh = innerHeight, h = passage.offsetHeight, course = Math.max(1, h - vh);
      const top = lis == null ? passage.getBoundingClientRect().top : lis;
      const s = clamp01(-top / course);                       // avancée dans la partie collée
      const dessin = clamp01((vh * .55 - top) / (vh * .55 + course * .5)); // le fil se trace en entrant
      const z = clamp01((s - .5) / .5);                          // la plongée
      let l = lz * doux(dessin);
      if (z > 0) l = lz + (L - lz) * clamp01(z * 2.4);
      p.style.strokeDashoffset = f1(L - Math.min(L, l));
      const e = Math.pow(z, 2.5), k = 1 + z * .22 + e * smax, rot = (gauche ? -1 : 1) * 16 * doux(clamp01(z * 1.4));
      g.setAttribute('transform', `translate(${f1(O.x)} ${f1(O.y)}) rotate(${rot.toFixed(2)}) scale(${k.toFixed(3)}) translate(${f1(-O.x)} ${f1(-O.y)})`);
      if (cA && cB) p.style.stroke = melange(cA, cB, clamp01((z - .08) / .42));
      const plein = k * sw / 2 >= Dc; if (plein !== ps.classList.contains('plein')) { ps.classList.toggle('plein', plein); themeHd(); }
      tt.style.opacity = clamp01((z - .78) / .16).toFixed(3);
      tt.style.transform = `translateY(${f1((1 - clamp01((z - .7) / .3)) * 34)}px)`;
      ps.style.setProperty('--zt', clamp01((z - .82) / .18).toFixed(3));
    };
    if (RM) passage.classList.add('fixe');
    else {
      let raf = 0;
      const boucle = () => {
        const t = passage.getBoundingClientRect().top;
        if (lis == null || Math.abs(t - lis) > innerHeight * 1.5) lis = t; else lis += (t - lis) * .2;
        if (Math.abs(t - lis) < .4) lis = t;
        maj();
        raf = lis !== t ? requestAnimationFrame(boucle) : 0;
      };
      const reveille = () => { if (!raf) raf = requestAnimationFrame(boucle); };
      addEventListener('scroll', reveille, { passive: true });
      addEventListener('resize', () => setTimeout(trace, 130));
      surCible.push(() => setTimeout(trace, 650));
      if (document.fonts) document.fonts.ready.then(trace);
      trace();
    }
  });

  /* ---------- 3 et 4. les liaisons et la crue ---------- */
  // un fil logique en coordonnées du document, rendu dans chaque rubrique qu'il traverse
  const liaisons = [];
  const liaison = (cfg) => {
    const hotes = cfg.hotes.filter(Boolean); if (hotes.length < 1) return;
    const paths = hotes.map(h => { h.classList.add('fil-hote'); const s = mk('svg', { class: 'fil-s', 'aria-hidden': 'true' }); h.prepend(s); return { h, s, p: mk('path', {}, s) }; });
    const o = { cfg, paths, L: 0, tab: [], d: '' }; liaisons.push(o); return o;
  };
  const docR = el => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, r: r.right + scrollX, b: r.bottom + scrollY }; };
  const mesure = mk('svg', { style: 'position:absolute;width:0;height:0;overflow:hidden', 'aria-hidden': 'true' }, document.body), mp0 = mk('path', {}, mesure);
  const traceL = o => {
    const d = o.cfg.d(); if (!d) { o.paths.forEach(x => x.s.style.display = 'none'); return; }
    o.d = d; mp0.setAttribute('d', d); o.L = mp0.getTotalLength();
    o.tab = []; let my = -1e9; const N = 220; for (let i = 0; i <= N; i++) { const l = o.L * i / N, pt = mp0.getPointAtLength(l); my = Math.max(my, pt.y); o.tab.push([l, my]); }
    const sw = EP() * (o.cfg.ep || 1);
    o.paths.forEach(x => {
      const r = docR(x.h); x.r = r; x.s.style.display = '';
      x.s.setAttribute('viewBox', `0 0 ${f1(r.w)} ${f1(r.h)}`);
      x.p.setAttribute('d', d); x.p.setAttribute('transform', `translate(${f1(-r.x)} ${f1(-r.y)})`);
      x.p.style.strokeWidth = sw; x.p.style.strokeDasharray = `${f1(o.L)} ${f1(o.L + 400)}`;
    });
  };
  const majL = o => {
    if (!o.L) return;
    const vh = innerHeight, cible2 = scrollY + vh * (o.cfg.tete || .78);
    let l = 0;
    if (RM) l = o.L; else for (const [ll, yy] of o.tab) { if (yy <= cible2) l = ll; else break; }
    o.vis = l;
    o.paths.forEach(x => { x.p.style.strokeDashoffset = f1(o.L - l); });
    if (o.cfg.crue) o.cfg.crue(o);
  };
  const toutes = () => { liaisons.forEach(traceL); liaisons.forEach(majL); };

  // les étapes d'une page : le fil passe par chaque numéro, qui s'allume à son passage
  $$('[data-fil]').forEach(box => {
    const items = () => $$(':scope > *', box).filter(x => x.offsetHeight);
    const sec = box.closest('section'); if (!sec) return;
    const o = liaison({
      hotes: [sec], tete: .7,
      d: () => {
        const it = items(); if (it.length < 2) return '';
        const P = it.map(x => { const r = docR(x); return [r.x + 22, r.y + 22 + 22]; });
        let d = `M${f1(P[0][0])} ${f1(P[0][1] - 70)}L${f1(P[0][0])} ${f1(P[0][1])}`;
        o.lp = [0]; mp0.setAttribute('d', d); o.lp[0] = mp0.getTotalLength();
        for (let i = 1; i < P.length; i++) {
          const [x1, y1] = P[i - 1], [x2, y2] = P[i], k = (i % 2 ? 1 : -1) * Math.min(34, (y2 - y1) * .3);
          d += `C${f1(x1 + k)} ${f1(y1 + (y2 - y1) * .38)} ${f1(x2 - k)} ${f1(y1 + (y2 - y1) * .62)} ${f1(x2)} ${f1(y2)}`;
          mp0.setAttribute('d', d); o.lp[i] = mp0.getTotalLength();
        }
        const [xl, yl] = P[P.length - 1];
        d += `L${f1(xl)} ${f1(yl + 26)}`;
        return d;
      },
      crue: o2 => { const it = items(), l = o2.vis || 0; it.forEach((x, i) => x.classList.toggle('passe', (o2.lp || [])[i] !== undefined && l >= o2.lp[i] - 4)); }
    });
  });

  // les photographies d'ouverture des pages se révèlent d'un coup de pinceau
  const vuP = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; vuP.unobserve(e.target);
    $$('.pinceau', e.target).forEach(p => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1100, delay: 150, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' }));
    $$('.hv-c', e.target).forEach(c => setTimeout(() => c.classList.add('pose'), 650));
  }), { threshold: .25 });
  $$('.ph-ph').forEach((fig, i) => {
    const img = $('img', fig); if (!img || RM) return;
    const w = +img.getAttribute('width') || 1000, h = +img.getAttribute('height') || 1000, D = Math.hypot(w, h) * 1.1;
    fig.insertAdjacentHTML('beforeend', `<svg class="pc-s" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><mask id="pc${i}" maskUnits="userSpaceOnUse" x="${-w}" y="${-h}" width="${w * 3}" height="${h * 3}"><path class="pinceau" pathLength="1" d="M${f1(-w * .2)} ${f1(h * 1.12)}C${f1(w * .14)} ${f1(h * .92)} ${f1(w * .17)} ${f1(h * .7)} ${f1(w * .38)} ${f1(h * .6)}S${f1(w * .8)} ${f1(h * .5)} ${f1(w * .86)} ${f1(h * .3)}S${f1(w * .9)} ${f1(h * .04)} ${f1(w * 1.2)} ${f1(-h * .1)}" fill="none" stroke="#fff" stroke-width="${f1(D)}" stroke-linecap="round"/></mask></defs><image href="${esc(img.getAttribute('src'))}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" mask="url(#pc${i})"/></svg>`);
    fig.classList.add('pc'); vuP.observe(fig);
  });
  $$('.hero-v').forEach(v => { if (!v.closest('.hero')) { if (RM) $$('.hv-c', v).forEach(c => c.classList.add('pose')); else vuP.observe(v); } });

  if (liaisons.length) {
    let raf = 0; const reveille = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; liaisons.forEach(majL); }); };
    addEventListener('scroll', reveille, { passive: true });
    let tb = 0; const retrace = () => { clearTimeout(tb); tb = setTimeout(toutes, 140); };
    addEventListener('resize', retrace); addEventListener('load', retrace);
    if (document.fonts) document.fonts.ready.then(retrace);
    surCible.push(() => setTimeout(toutes, 480));
    if ('ResizeObserver' in window) new ResizeObserver(retrace).observe(document.body);
    toutes();
  }

  appliqueCible(cible, false, true);
  appliquePerso();

  /* ================================================================
     COMPARATEUR DES FORMULES par profil
     ================================================================ */
  const cmpf = $('#cmpf');
  if (cmpf) {
    const pr = $('.cmpf-p', cmpf), g = $('.cmpf-g', cmpf), titre = $('[data-besoin]', cmpf);
    pr.innerHTML = O.profils.map(p => `<button type="button" aria-pressed="false" data-p="${p.id}">${esc(p.court)}</button>`).join('');
    const rend = id => {
      const p = O.profils.find(x => x.id === id); const need = unitesPanier(p.panier);
      $$('button', pr).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === id)));
      const nm = /^[A-Z]{2}/.test(p.nom) ? p.nom : p.nom.charAt(0).toLowerCase() + p.nom.slice(1);
      titre.innerHTML = `Besoin type d’une ${esc(nm)} : <b>${need} unités par mois</b> (${esc(resumePanier(p.panier).join(', '))}). <span class="fictif">Exemple indicatif</span>`;
      const adapt = recommande(need, 0, p.panier);
      g.innerHTML = FORM.map((f, i) => {
        const couv = Math.min(1, f.unites / need), marge = Math.max(0, f.unites - need), manque = Math.max(0, need - f.unites);
        const prev = FORM[i - 1];
        const estA = adapt && adapt.f.id === f.id;
        const verdict = manque ? `<p class="verdict non"><svg class="i"><use href="#no"/></svg>Couvre ${Math.round(couv * 100)} % de ce besoin : ${manque} unité${manque > 1 ? 's' : ''} manquante${manque > 1 ? 's' : ''}${manque <= 6 ? `, soit ${eur(manque * O.unite_sup)} € de plus par mois` : ''}.</p>`
          : (estA ? `<p class="verdict"><svg class="i"><use href="#ok"/></svg>Adaptée à ce profil${marge ? `, avec ${marge} unité${marge > 1 ? 's' : ''} de marge` : ''}.</p>`
            : `<p class="verdict"><svg class="i"><use href="#ok"/></svg>Couvre ce besoin, avec ${marge} unités non utilisées : utile si votre activité grandit.</p>`);
        return `<article class="cf${estA ? ' adapt' : ''}">
          <h3>${esc(f.nom)}<span>${eur(f.prix)} €/mois</span></h3>
          <div class="couv"><div class="tr" role="img" aria-label="Couverture du besoin : ${Math.round(couv * 100)} %"><i style="width:${couv * 100}%"></i></div>
          <p>${f.unites} unités par mois${need ? ` pour ${need} nécessaires` : ''}</p></div>
          ${verdict}
          <dl><div><dt>Délai de traitement</dt><dd>${esc(f.delai)}</dd></div><div><dt>Urgences</dt><dd>${esc(f.urgences)}</dd></div><div><dt>Suivi</dt><dd>${esc(f.suivi)}</dd></div><div><dt>Première année</dt><dd>${eur(f.prix * 12 + f.mise_en_place)} €, ou ${eur(f.prix * 12)} € avec ${O.engagement_long} mois</dd></div></dl>
          ${prev ? `<p class="ecart">Par rapport à ${esc(prev.nom)} : +${eur(f.prix - prev.prix)} € par mois pour +${f.unites - prev.unites} unités${f.suivi !== prev.suivi ? ', un suivi plus fréquent' : ''}${f.urgences_incluses ? ' et 2 urgences incluses' : ''}.</p>` : `<p class="ecart">Le point d’entrée : ${eur(f.prix * 12)} € par an hors mise en place.</p>`}
        </article>`;
      }).join('');
      if (!RM) {
        g.classList.remove('anime'); void g.offsetWidth; g.classList.add('anime');
        $$('.cf', g).forEach((c, i) => c.style.setProperty('--i', i));
        const barres = $$('.couv .tr i', g), w = barres.map(x => x.style.width);
        barres.forEach(x => { x.style.width = '0%'; }); requestAnimationFrame(() => requestAnimationFrame(() => barres.forEach((x, i) => { x.style.width = w[i]; })));
      }
      maj('profil', id);
    };
    $$('button', pr).forEach(b => b.addEventListener('click', () => { rend(b.dataset.p); compte('comparateur-' + b.dataset.p); }));
    rend(etat.profil && O.profils.some(p => p.id === etat.profil) ? etat.profil : 'commune');
  }

  /* ================================================================
     COÛT COMPARÉ : Fil et un poste interne
     ================================================================ */
  const cout = $('#cout');
  if (cout) {
    const sF = $('#c-f', cout), sC = $('#c-c', cout), sQ = $('#c-q', cout), oQ = $('#c-qo', cout);
    sF.innerHTML = FORM.map(f => `<option value="${f.id}">${esc(f.nom)} (${eur(f.prix)} €/mois)</option>`).join('');
    sF.value = 'regulier';
    const b1 = $('[data-b=a]', cout), b2 = $('[data-b=t]', cout), v1 = $('[data-v=a]', cout), v2 = $('[data-v=t]', cout), conc = $('[data-conc]', cout);
    const calc = () => {
      const f = FORM.find(x => x.id === sF.value); const c = Math.max(0, +sC.value || 0); const q = +sQ.value;
      sQ.style.setProperty('--p', ((q - 20) / 80 * 100) + '%'); oQ.textContent = q + ' %';
      const a = c * q / 100 * 12, t = f.prix * 12 + f.mise_en_place, mx = Math.max(a, t, 1);
      b1.style.width = (a / mx * 100) + '%'; b2.style.width = (t / mx * 100) + '%';
      v1.textContent = eur(a) + ' € par an'; v2.textContent = eur(t) + ' € la première année';
      conc.textContent = a > t ? `Écart : ${eur(a - t)} € la première année, sans procédure de recrutement ni remplacement à organiser pendant les absences.` : `À ce niveau de quotité, un poste interne coûte moins cher : ${esc(SITE.nom)} se justifie alors surtout pour la continuité et les compétences réunies.`;
    };
    [sF, sC, sQ].forEach(el => el.addEventListener('input', () => { calc(); compte('cout-compare', true); }));
    calc();
  }

  /* ================================================================
     SIMULATEUR
     ================================================================ */
  const sim = $('#sim');
  let simCharge = null, simValide = null;
  if (sim) {
    const liste = $('.sim-l', sim), pres = $('.presets', sim);
    let panier = Object.assign({}, etat.panier || {}); let urg = +etat.urg || 0;
    pres.innerHTML = O.profils.map(p => `<button type="button" aria-pressed="false" data-p="${p.id}">${esc(p.court)}</button>`).join('') + '<button type="button" data-p="vide" aria-pressed="false">Tout effacer</button>';
    liste.innerHTML = O.categories.map(c => `<section class="cat" aria-labelledby="cat-${c.id}"><h3 id="cat-${c.id}">${esc(c.nom)} <span class="it">${esc(c.it)}</span></h3>${O.catalogue.filter(x => x.cat === c.id).map(x => `
      <div class="ligne" data-id="${x.id}"><div class="t"><b id="l-${x.id}">${esc(x.nom)}<span class="ub">${x.u} u.${x.pas ? ' par ' + esc(x.pas) : ''}</span></b><small>${esc(x.detail)}</small></div>
      ${x.bascule ? `<label class="sw"><input type="checkbox" aria-labelledby="l-${x.id}"><span class="tr"></span><span class="sr">Inclure</span></label>`
        : `<div class="pas" role="group" aria-labelledby="l-${x.id}"><button type="button" data-d="-1" aria-label="Retirer : ${esc(x.nom)}"><svg class="i"><use href="#mo"/></svg></button><output aria-live="polite">0</output><button type="button" data-d="1" aria-label="Ajouter : ${esc(x.nom)}"><svg class="i"><use href="#pl"/></svg></button></div>`}
      </div>`).join('')}</section>`).join('') + `
      <section class="cat" aria-labelledby="cat-urg"><h3 id="cat-urg">Urgences <span class="it">traitées sous 24 h ouvrées</span></h3>
      <div class="ligne" data-id="urg"><div class="t"><b id="l-urg">Demandes urgentes par mois<span class="ub">+1 u. chacune</span></b><small>Une publication ou une actualité livrée sous 24 h ouvrées. Deux par mois sont incluses dans Soutenu.</small></div>
      <div class="pas" role="group" aria-labelledby="l-urg"><button type="button" data-d="-1" aria-label="Retirer une urgence"><svg class="i"><use href="#mo"/></svg></button><output aria-live="polite">0</output><button type="button" data-d="1" aria-label="Ajouter une urgence"><svg class="i"><use href="#pl"/></svg></button></div></div></section>`;
    const gu = $('.recap .gu', sim), uTot = $('[data-tot]', sim), reco = $('.reco', sim), lig = $('.lig', sim), pan = $('.panier', sim);
    const mob = $('.recap-mob'), mobT = mob && $('.rm-t b', mob), mobS = mob && $('.rm-t span', mob);
    const go = $('[data-demande]', sim), noteB = $('[data-note]', sim), lienB = $('[data-lien]', sim);
    let premiere = true;
    const rend = (anime = true) => {
      $$('.ligne', liste).forEach(l => {
        const id = l.dataset.id; const n = id === 'urg' ? urg : (panier[id] || 0);
        l.classList.toggle('on', n > 0);
        const o = $('output', l); if (o) o.textContent = id === 'agenda' && n ? n * 3 : n;
        const cb = $('input[type=checkbox]', l); if (cb) cb.checked = n > 0;
        const mx = id === 'urg' ? 10 : (CAT[id] && CAT[id].max) || 30;
        $$('.pas button', l).forEach(b => { b.disabled = (+b.dataset.d < 0 && n <= 0) || (+b.dataset.d > 0 && n >= mx); });
      });
      const total = unitesPanier(panier); const r = recommande(total, urg, panier);
      uTot.textContent = r ? r.u : total;
      const cap = r ? r.f.unites : 10;
      grille(gu, Math.max(cap, 10), r ? r.u : 0, 0, { reste: true, anime });
      const lis = resumePanier(panier).concat(urg ? [`${urg} urgence${urg > 1 ? 's' : ''}`] : []);
      pan.innerHTML = lis.length ? lis.map(t => `<li>${esc(t)}</li>`).join('') : '<li class="vide">Ajoutez des prestations, ou partez d’un profil type.</li>';
      if (!r) {
        prixAnim($('[data-pxg]', sim), 0);
        reco.innerHTML = `<div class="nm"><b>Votre mois</b><span></span></div><p>Chaque ligne ajoutée remplit la grille : un carré par unité. La formule adaptée s’affiche ici.</p>`;
        lig.innerHTML = ''; [go, noteB, lienB].forEach(b => b && b.setAttribute('aria-disabled', 'true'));
        if (mob) { mobT.textContent = 'Composez votre mois'; mobS.textContent = '0 unité'; }
        maj('panier', panier); maj('urg', urg); return;
      }
      [go, noteB, lienB].forEach(b => b && b.removeAttribute('aria-disabled'));
      if (r.horsCadre) {
        prixAnim($('[data-pxg]', sim), 'Sur étude'); sim.classList.add('hors');
        reco.innerHTML = `<div class="nm"><b>Étude personnalisée nécessaire</b><span>au-delà des formules</span></div><p>${r.u} unités par mois, c’est plus que Soutenu (${r.f.unites}) et ses unités supplémentaires. Aucun prix n’est affiché : un volume de cet ordre se chiffre après un échange, en forfait sur mesure ou avec Relais.</p>`;
        lig.innerHTML = `<div><span>Volume estimé</span><span>${r.u} unités par mois</span></div><div class="fort"><span>Prix</span><span>Sur étude</span></div>`;
        if (mob) { mobT.textContent = 'Étude personnalisée'; mobS.textContent = `${r.u} unités`; }
        maj('panier', panier); maj('urg', urg); return;
      }
      sim.classList.remove('hors');
      const c = couts(r.prix, r.f);
      let expl = (r.sup ? `${r.u} unités pour ${r.f.unites} incluses : ${r.sup} unité${r.sup > 1 ? 's' : ''} hors forfait à ${O.unite_sup} €, moins cher que la formule suivante.`
          : `${r.u} unités sur ${r.f.unites} incluses${r.reste ? ` : ${r.reste} de marge, reportable un mois` : ''}.`);
      let alt = '';
      if (r.suivant && !r.horsCadre) {
        const d = r.suivant.prix - r.prix;
        if (d <= 220 && d >= 0) alt = `<p class="alt">${esc(r.suivant.f.nom)} coûterait ${eur(d)} € de plus par mois, pour ${r.suivant.f.unites - r.u} unités de marge${r.suivant.f.urgences_incluses ? ' et 2 urgences incluses' : ''}.</p>`;
      }
      if (r.mini) expl += ' Le reportage photo demande au moins la formule Régulier.';
      prixAnim($('[data-pxg]', sim), r.prix);
      reco.innerHTML = `<div class="nm"><b>${esc(r.f.nom)}${r.sup ? ` <small style="font-size:.5em;font-weight:600">+${r.sup} u.</small>` : ''}</b><span>formule adaptée</span></div><p>${esc(expl)}</p>${alt}`;
      lig.innerHTML = `<div><span>Demandes courantes</span><span>${esc(r.f.delai)}</span></div>
        <p class="eng-t">Deux engagements possibles</p>
        <div class="eng2"><p><b>${O.engagement_mois} mois</b><span>+ ${eur(c.mep)} €</span><small>mise en place, une fois</small></p><p class="on"><b>${O.engagement_long} mois</b><span>Offerte</span><small>mise en place</small></p></div>
        <p class="note">Première année : ${eur(c.an)} € avec ${O.engagement_mois} mois, ${eur(c.an12)} € avec ${O.engagement_long} mois.</p>`;
      if (mob) { mobT.textContent = `${r.f.nom}${r.sup ? ' +' + r.sup + ' u.' : ''} · ${eur(r.prix)} €/mois`; mobS.textContent = `${r.u} unité${r.u > 1 ? 's' : ''} sur ${r.f.unites}`; }
      maj('panier', panier); maj('urg', urg);
      if (!premiere) { compte('simulateur-interaction', true); compte('simulateur-formule-' + r.f.id, true); }
    };
    liste.addEventListener('click', e => {
      const b = e.target.closest('.pas button'); if (!b) return;
      const id = b.closest('.ligne').dataset.id; const d = +b.dataset.d;
      if (id === 'urg') urg = Math.max(0, Math.min(10, urg + d));
      else { const mx = CAT[id].max || 30; panier[id] = Math.max(0, Math.min(mx, (panier[id] || 0) + d)); if (!panier[id]) delete panier[id]; }
      premiere = false; $$('button', pres).forEach(x => x.setAttribute('aria-pressed', 'false')); rend();
    });
    liste.addEventListener('change', e => {
      const cb = e.target.closest('input[type=checkbox]'); if (!cb) return;
      const id = cb.closest('.ligne').dataset.id; if (cb.checked) panier[id] = 1; else delete panier[id];
      premiere = false; rend();
    });
    $$('button', pres).forEach(b => b.addEventListener('click', () => {
      const p = O.profils.find(x => x.id === b.dataset.p);
      panier = p ? Object.assign({}, p.panier) : {}; urg = 0; premiere = false;
      $$('button', pres).forEach(x => x.setAttribute('aria-pressed', String(x === b && !!p)));
      rend(); compte('simulateur-profil-' + b.dataset.p);
    }));
    const valide = () => { const s = selDepuisPanier(panier, urg, 'simulateur'); if (s) maj('selection', s); return s; };
    if (go) go.addEventListener('click', e => { if (!valide()) { e.preventDefault(); toast('Ajoutez au moins une prestation.'); } });
    if (noteB) noteB.addEventListener('click', e => { if (!valide()) { e.preventDefault(); toast('Ajoutez au moins une prestation.'); } });
    if (lienB) lienB.addEventListener('click', () => { const s = valide(); if (!s) { toast('Ajoutez au moins une prestation.'); return; } copie(lienPartage('simulateur/', s)); });
    if (mob) {
      // sur mobile, le récapitulatif reste visible en bas de l'écran : prix estimé et action suivante
      const rc = $('.recap', sim);
      $('.rm-t', mob).addEventListener('click', () => rc.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }));
      $('[data-demande-mob]', mob).addEventListener('click', e => { if (!valide()) { e.preventDefault(); toast('Ajoutez au moins une prestation.'); } });
    }
    if (fromHash && fromHash.panier) { panier = panierPropre(fromHash.panier); urg = entier(fromHash.urg, 0, 10); }
    const pq = new URLSearchParams(location.search).get('profil');
    const pp = pq && O.profils.find(x => x.id === pq);
    if (pp && !Object.keys(panier).length) { panier = Object.assign({}, pp.panier); const b = $(`[data-p="${pp.id}"]`, pres); if (b) b.setAttribute('aria-pressed', 'true'); }
    rend(false);
    // le parcours Estimer recharge le configurateur avec la recommandation, sans double saisie
    simCharge = (p, u) => { panier = panierPropre(p); urg = entier(u, 0, 10); $$('button', pres).forEach(x => x.setAttribute('aria-pressed', 'false')); rend(false); };
    simValide = () => valide();
  }

  /* ================================================================
     ESTIMER : un seul parcours en quatre étapes, du diagnostic à la
     proposition. Les réponses, le panier et la sélection sont partagés :
     rien n'est saisi deux fois. Une entrée directe mène au configurateur.
     ================================================================ */
  const est = $('#est');
  if (est) {
    const Q = [
      { id: 'type', t: 'Vous représentez…', type: 'un', gros: true, o: [['commune', 'Une commune'], ['interco', 'Une intercommunalité ou un syndicat'], ['public', 'Une autre structure publique', 'Office de tourisme, CCAS, établissement'], ['pme', 'Une entreprise'], ['asso', 'Une association employeuse']] },
      { id: 'taille', t: 'De quelle taille ?', type: 'un', gros: true, o: v => (v.type === 'pme' || v.type === 'asso') ? [['t1', 'Moins de 10 salariés'], ['t2', '10 à 49 salariés'], ['t3', '50 salariés et plus']] : [['t1', 'Moins de 2 000 habitants', 'ou d’usagers'], ['t2', '2 000 à 8 000 habitants'], ['t3', 'Plus de 8 000 habitants']] },
      { id: 'qui', t: 'Qui s’occupe de la communication aujourd’hui ?', type: 'un', gros: true, o: v => [['personne', 'Personne en particulier', 'chacun fait au mieux'], ['cumul', 'Une personne, en plus de son travail'], ['absent', 'Le poste est vide pour un temps', (v.type === 'pme' || v.type === 'asso') ? 'départ, congé, arrêt' : 'poste vacant, congé, arrêt'], ['service', 'Une équipe qui manque de bras']] },
      { id: 'canaux', t: 'Quels canaux devez-vous tenir ?', s: 'Plusieurs réponses possibles', type: 'plu', o: [['site', 'Site internet'], ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['news', 'Newsletter'], ['bulletin', 'Bulletin ou magazine'], ['presse', 'Presse locale'], ['appli', 'Application ou panneau numérique'], ['print', 'Affiches et flyers']] },
      { id: 'rythme', t: 'À quel rythme voudriez-vous publier ?', type: 'un', gros: true, o: [['occ', 'Quand il y a quelque chose', 'quelques fois par mois'], ['hebdo', 'Chaque semaine'], ['plus', 'Plusieurs fois par semaine']] }
    ];
    const DIFF = [['temps', 'Personne n’a le temps'], ['site', 'Le site n’est pas à jour'], ['irreg', 'Les publications sont irrégulières'], ['visuels', 'Les visuels manquent de soin'], ['bulletin', 'Le bulletin prend trop de temps'], ['urg', 'Tout arrive en urgence'], ['photos', 'Pas de photos récentes'], ['presse', 'La presse ne relaie pas']];
    const PRIO = {
      temps: 'Sortir la communication de l’emploi du temps de vos équipes : une seule adresse pour les demandes, et c’est traité.',
      site: 'Remettre le site à jour, puis le tenir : actualités et agenda publiés chaque semaine.',
      irreg: 'Installer un rythme : un calendrier du trimestre, validé une fois, puis déroulé.',
      visuels: 'Créer des gabarits à votre image dès la mise en place, pour des visuels soignés et rapides.',
      bulletin: 'Alléger le bulletin : la mise en page est prise en charge, vous fournissez les éléments.',
      urg: 'Prévoir les urgences au lieu de les subir : traitement sous 24 h ouvrées et un calendrier qui les réduit.',
      photos: 'Constituer une photothèque : un reportage pour alimenter le site et les réseaux plusieurs mois.',
      presse: 'Reprendre la relation presse : communiqués réguliers, liste de correspondants à jour.'
    };
    const BUD = [['', 'Pas d’enveloppe fixée'], ['b1', 'Moins de 6 000 € par an'], ['b2', '6 000 à 12 000 € par an'], ['b3', '12 000 à 24 000 € par an'], ['b4', 'Plus de 24 000 € par an']];
    const pas = $$('.est-p button', est), pans = $$('.est-e', est);
    const st = Object.assign({ e: 0, vus: [], rep: {}, diff: [], budget: '' }, etat.est || {});
    if (etat.diag && etat.diag.rep && !Object.keys(st.rep).length) st.rep = Object.assign({}, etat.diag.rep);
    const garde2 = () => maj('est', st);
    let e = -1;
    const titrePan = n => $('h2, legend, [data-titre]', pans[n]);
    const montre = (n, sens = 1, pousse = true) => {
      if (n === e) return;
      const avant = e; e = n; st.e = n; document.documentElement.classList.toggle('est-compose', n === 3); if (!st.vus.includes(n)) st.vus.push(n); garde2();
      pans.forEach((p, i) => { p.hidden = i !== n; if (i === n) { p.classList.remove('entre', 'entre-g'); void p.offsetWidth; p.classList.add(sens >= 0 ? 'entre' : 'entre-g'); } });
      est.querySelector('.est-p').style.setProperty('--p', Math.max(0, (n - 1) / 3).toFixed(3));
      pas.forEach((b, i) => { const k = i + 1; b.classList.toggle('fait', k < n || (st.vus.includes(k) && k < n)); if (k === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); b.disabled = !st.vus.includes(k) && k !== n; });
      if (n === 1) questions();
      if (n === 2) recommandation();
      if (n === 3 && simCharge && st.charge) { simCharge(st.charge.panier, st.charge.urg); delete st.charge; garde2(); }
      if (n === 4) proposition();
      if (pousse && avant !== -1) history.pushState({ etape: n }, '', '#etape-' + n);
      if (avant !== -1) {
        const r = est.getBoundingClientRect(); if (r.top < 0 || r.top > innerHeight * .5) est.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
        const h = titrePan(n); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      }
      compte('estimer-etape-' + n, true);
    };
    addEventListener('popstate', ev => { const n = ev.state && typeof ev.state.etape === 'number' ? ev.state.etape : (+(location.hash.match(/etape-(\d)/) || [])[1] || 0); montre(n, -1, false); });
    pas.forEach((b, i) => b.addEventListener('click', () => montre(i + 1, i + 1 < e ? -1 : 1)));
    est.addEventListener('click', ev => {
      const a = ev.target.closest('[data-aller]'); if (a) { ev.preventDefault(); const n = +a.dataset.aller; if (n === 3 && a.dataset.reco) chargeReco(); montre(n, n < e ? -1 : 1); return; }
      const d = ev.target.closest('[data-demande],[data-demande-mob]');
      if (d && e === 3 && !ev.defaultPrevented) { ev.preventDefault(); if (simValide && simValide()) montre(4); }
    });
    const mob = $('.recap-mob');
    if (mob) mob.addEventListener('click', ev => { const d = ev.target.closest('[data-demande-mob]'); if (d && !ev.defaultPrevented) { ev.preventDefault(); if (simValide && simValide()) montre(4); } });

    /* étape 1 : la structure, une question à la fois */
    let iq = 0, sensQ = 1;
    const zq = $('.dg-z', est), pq = $('.dg-p', est);
    const opts = q => typeof q.o === 'function' ? q.o(st.rep) : q.o;
    const questions = () => {
      pq.innerHTML = Q.map((_, k) => `<i class="${k < iq ? 'on' : ''}"></i>`).join('');
      if (iq >= Q.length) iq = Q.length - 1;
      const q = Q[iq], os = opts(q), plu = q.type === 'plu', v = st.rep;
      zq.innerHTML = `<div class="dg-q ${sensQ > 0 ? 'entre' : 'entre-g'}">
        <fieldset style="border:0;padding:0;margin:0;display:grid;gap:22px"><legend class="sr">${esc(q.t)}</legend><h2 aria-hidden="true">${esc(q.t).replace(/[^\s\u00a0]+-[^\s\u00a0]+/g, '<span class="lie">$&</span>')}${q.s ? `<small>${esc(q.s)}</small>` : ''}</h2>
        <div class="choix${q.gros ? ' gros' : ''}">${os.map(([k, l, s]) => `<label><input type="${plu ? 'checkbox' : 'radio'}" name="${q.id}" value="${k}" ${plu ? ((v[q.id] || []).includes(k) ? 'checked' : '') : (v[q.id] === k ? 'checked' : '')}><span>${esc(l)}${s ? `<small>${esc(s)}</small>` : ''}</span></label>`).join('')}</div></fieldset>
        <div class="est-n"><button type="button" class="est-retour" data-pr><i aria-hidden="true"><svg class="i"><use href="#al"/></svg></i>${iq === 0 ? 'Retour' : 'Question précédente'}</button><span class="cap">Question ${iq + 1} sur ${Q.length}</span><button type="button" class="bt sm" data-sv ${plu || v[q.id] ? '' : 'hidden'}>Continuer <span class="ar"><svg class="i"><use href="#ar"/></svg></span></button></div></div>`;
      $$('input', zq).forEach(inp => inp.addEventListener('change', () => {
        if (plu) { v[q.id] = $$('input:checked', zq).map(x => x.value); $('[data-sv]', zq).disabled = !v[q.id].length; }
        else { v[q.id] = inp.value; if (q.id === 'type') { delete v.taille; if (['pme', 'asso'].includes(inp.value) && cible !== 'e') appliqueCible('e', true); if (['commune', 'interco', 'public'].includes(inp.value) && cible !== 'c') appliqueCible('c', true); } setTimeout(suivante, RM ? 0 : 240); }
        garde2();
      }));
      if (plu) $('[data-sv]', zq).disabled = !(v[q.id] || []).length;
      $('[data-pr]', zq).addEventListener('click', () => { if (iq === 0) montre(0, -1); else { sensQ = -1; iq--; questions(); } });
      $('[data-sv]', zq).addEventListener('click', suivante);
      if (iq === 0) compte('diagnostic-debut', true);
    };
    let seule = false;
    const suivante = () => { sensQ = 1; if (seule && Q[iq].id !== 'type') { seule = false; montre(2); return; } if (iq < Q.length - 1) { iq++; questions(); } else { compte('diagnostic-fin', true); montre(2); } };

    /* étape 2 : la recommandation, affinée en direct */
    const estime = () => {
      const v = st.rep, c = v.canaux || [], r = v.rythme || 'hebdo';
      const soc = ['facebook', 'instagram', 'linkedin'].filter(x => c.includes(x)).length;
      const p = {};
      const posts = { occ: 4, hebdo: 8, plus: 14 }[r]; if (soc) p.post = posts + (soc > 2 ? 2 : 0);
      if (c.includes('site')) { p.actu = { occ: 2, hebdo: 4, plus: 6 }[r]; p.agenda = v.type === 'pme' ? 0 : 1; }
      if (c.includes('news')) p.news = r === 'plus' ? 2 : 1;
      if (c.includes('bulletin')) p.bulletin = 4;
      if (c.includes('presse')) p.presse = r === 'occ' ? 1 : 2;
      if (c.includes('appli')) p.agenda = (p.agenda || 0) + 1;
      if (c.includes('print')) p.affiche = 1;
      if (st.diff.includes('visuels')) p.gabarit = 2;
      if (st.diff.includes('photos')) p.photo = 1;
      const k = { t1: .8, t2: 1, t3: 1.25 }[v.taille] || 1;
      Object.keys(p).forEach(x => { if (['post', 'actu'].includes(x)) p[x] = Math.max(1, Math.round(p[x] * k)); if (!p[x]) delete p[x]; });
      if (!Object.keys(p).length) { p.post = 4; p.actu = 2; }
      return p;
    };
    const urgDe = () => st.diff.includes('urg') ? 2 : 0;
    const chargeReco = () => { st.charge = { panier: estime(), urg: urgDe() }; garde2(); };
    const recommandation = () => {
      const z = pans[2], v = st.rep;
      if (!v.type) { z.innerHTML = `<div class="reco2"><div class="bloc"><h2 data-titre>Quelques réponses d’abord</h2><p>La recommandation se construit à partir de votre structure.</p><div class="bts"><button type="button" class="bt" data-aller="1">Répondre aux questions <span class="ar"><svg class="i"><use href="#ar"/></svg></span></button></div></div></div>`; return; }
      const p = estime(), need = unitesPanier(p), r = recommande(need, urgDe(), p), relais = v.qui === 'absent';
      const prios = st.diff.map(d => PRIO[d]).filter(Boolean);
      ['irreg', 'visuels', 'site'].forEach(x => { if (prios.length < 3 && !st.diff.includes(x)) prios.push(PRIO[x]); });
      const bud = { b1: 6000, b2: 12000, b3: 24000, b4: 1e9 }[st.budget];
      let nom = 'Étude personnalisée', px = 'Sur étude, après échange', expl = `Votre besoin représente environ ${need} unités par mois, au-delà de la formule la plus complète : il se chiffre après un échange.`;
      if (r && !r.horsCadre) {
        const c = couts(r.prix, r.f);
        nom = r.f.nom + (r.sup ? ` + ${r.sup} unité${r.sup > 1 ? 's' : ''}` : ''); px = `${eur(r.prix)} € par mois`;
        const ug = urgDe() && !r.f.urgences_incluses ? ` (dont ${urgDe()} pour les urgences)` : '';
        expl = r.sup ? `Environ ${r.u} unités par mois${ug} : ${r.f.nom} en inclut ${r.f.unites}, et ${r.sup} unité${r.sup > 1 ? 's' : ''} en plus à ${O.unite_sup} € reviennent moins cher que ${r.suivant ? r.suivant.f.nom : 'la formule suivante'}. Demandes courantes traitées en ${r.f.delai}.`
          : `Environ ${r.u} unités par mois${ug} : ${r.f.nom} en inclut ${r.f.unites}, avec des demandes courantes traitées en ${r.f.delai}.`;
        if (bud && c.an12 > bud) expl += ` C’est au-dessus de l’enveloppe indiquée : en ciblant vos canaux prioritaires, Essentiel (${eur(FORM[0].prix * 12)} € par an avec ${O.engagement_long} mois d’engagement) reste une base solide.`;
      }
      const sel = r ? selDepuisPanier(p, urgDe(), 'diagnostic') : null;
      const typeL = { commune: 'commune', interco: 'intercommunalité', public: 'structure publique', pme: 'entreprise', asso: 'association' }[v.type] || 'structure';
      if (sel) { sel.synthese = `Pour votre ${typeL} : ${(v.canaux || []).length} ${(v.canaux || []).length > 1 ? 'canaux' : 'canal'} à tenir, publication ${({ occ: 'quand l’actualité le demande', hebdo: 'chaque semaine', plus: 'plusieurs fois par semaine' })[v.rythme] || 'régulière'}.`; sel.priorites = prios.slice(0, 3); sel.type = v.type; st.reco = sel; garde2(); }
      z.innerHTML = `<div class="reco2">
        <div class="carte"><p class="cap" style="color:var(--nmu)">Formule recommandée</p><h2 class="nmf" data-titre>${esc(nom)}</h2><p class="px">${esc(px)}</p><p>${esc(expl)}</p>
          <ul aria-label="Contenu d’un mois type">${resumePanier(p).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
          ${relais ? `<p style="color:var(--ntx)">Le poste est vide pour un temps ? <a class="lien" href="${U('relais/')}">Relais couvre l’absence <svg class="i"><use href="#ar"/></svg></a></p>` : ''}
          <div class="bts" style="margin-top:6px"><button type="button" class="bt" data-aller="3" data-reco="1">Ajuster ces prestations <span class="ar"><svg class="i"><use href="#ar"/></svg></span></button><button type="button" class="bt cl" data-aller="4" data-direct="1">Voir ma proposition</button></div></div>
        <div class="bloc"><h3>Vos priorités</h3><ol>${prios.slice(0, 3).map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ol>
          <div class="affine"><p class="cap">Pour affiner : ce qui coince le plus (trois au plus)</p><div class="choix">${DIFF.map(([k, l]) => `<label><input type="checkbox" value="${k}" ${st.diff.includes(k) ? 'checked' : ''}><span>${esc(l)}</span></label>`).join('')}</div>
          <label class="cap" for="est-bud" style="margin-top:6px">Enveloppe annuelle, si elle est fixée</label><select class="in" id="est-bud">${BUD.map(([k, l]) => `<option value="${k}"${st.budget === k ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div></div>
      </div>
      <div class="reps" aria-label="Vos réponses"><span class="cap">Vos réponses</span>${Q.map((q, k) => { const os = opts(q), val = v[q.id]; const l = Array.isArray(val) ? (val.length ? val.map(x => (os.find(o => o[0] === x) || [, x])[1]).join(', ') : 'aucun') : ((os.find(o => o[0] === val) || [, '…'])[1]); return `<button type="button" class="rep" data-q="${k}"><small>${esc(q.t.replace(/ ?[?…]$/, ''))}</small>${esc(l)}</button>`; }).join('')}</div>
      <div class="est-n"><button type="button" class="est-retour" data-aller="1"><i aria-hidden="true"><svg class="i"><use href="#al"/></svg></i>Reprendre les questions</button></div>`;
      $$('.rep', z).forEach(b => b.addEventListener('click', () => { iq = +b.dataset.q; sensQ = -1; seule = true; montre(1, -1); }));
      $$('.affine input', z).forEach(inp => inp.addEventListener('change', () => {
        let a = $$('.affine input:checked', z).map(x => x.value);
        if (a.length > 3) { inp.checked = false; a = a.filter(x => x !== inp.value); toast('Trois réponses au maximum.'); }
        st.diff = a; garde2(); const y = scrollY; recommandation(); scrollTo(0, y);
      }));
      $('#est-bud', z).addEventListener('change', ev => { st.budget = ev.target.value; garde2(); const y = scrollY; recommandation(); scrollTo(0, y); });
      const dir = $('[data-direct]', z); if (dir) dir.addEventListener('click', () => { if (st.reco) maj('selection', reconstruit(st.reco, false)); }, true);
    };

    /* étape 4 : la proposition, reprise telle quelle dans la demande */
    const proposition = () => {
      const z = pans[4]; const s = etat.selection;
      if (!s) { z.innerHTML = `<div class="prop"><div class="carte"><h2 data-titre>Rien à proposer pour l’instant</h2><p>Composez votre mois ou répondez aux questions : la proposition se remplit seule.</p><div class="bts"><button type="button" class="bt" data-aller="3">Composer mon mois <span class="ar"><svg class="i"><use href="#ar"/></svg></span></button></div></div></div>`; return; }
      const f = s.formule ? FORM.find(x => x.id === s.formule) : null;
      const c = s.mensuel && f ? couts(s.mensuel, f) : null;
      z.innerHTML = `<div class="prop">
        <div class="carte"><p class="cap">Votre estimation</p><h2 class="nmf" data-titre>${esc(s.titre)}</h2>
          <div class="lig2">${s.mensuel ? `<div><span>Abonnement</span><span>${esc(s.prix)}</span></div>` : `<div><span>Prix</span><span>${esc(s.prix || 'Sur étude')}</span></div>`}
          ${f ? `<div><span>Demandes courantes</span><span>${esc(f.delai)}</span></div>` : ''}
          </div>
          ${c ? `<div class="eng2"><p><b>Engagement ${O.engagement_mois} mois</b><span>+ ${eur(c.mep)} €</span><small>mise en place, une fois · ${eur(c.an)} € la 1<sup>re</sup> année</small></p><p class="on"><b>Engagement ${O.engagement_long} mois</b><span>Offerte</span><small>mise en place · ${eur(c.an12)} € la 1<sup>re</sup> année</small></p></div>` : ''}
          ${(s.lignes || []).length ? `<ul class="panier2" aria-label="Contenu">${s.lignes.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
          <p class="note">Estimation indicative, pas un devis. La proposition écrite suit sous 48 h ouvrées.</p></div>
        <div class="suite"><a class="bt lg2" href="${U('demande/')}">Recevoir ma proposition <span class="ar"><svg class="i"><use href="#ar"/></svg></span></a>
          <a class="bt cl lg2" href="${U('contact/')}" data-cal>En parler 30 minutes</a>
          <div class="bts"><a class="lien" href="${U('note/')}">Note à imprimer <svg class="i"><use href="#ar"/></svg></a><button type="button" class="lien" data-lien>Copier le lien <svg class="i"><use href="#li"/></svg></button></div></div>
      </div>
      <div class="est-n"><button type="button" class="est-retour" data-aller="3"><i aria-hidden="true"><svg class="i"><use href="#al"/></svg></i>Modifier mes prestations</button></div>`;
      $('[data-lien]', z).addEventListener('click', () => copie(lienPartage('simulateur/', s)));
      compte('estimer-proposition', true);
    };

    // départ : le diagnostic commence aux questions ; Estimer propose les deux entrées
    const h = +(location.hash.match(/etape-(\d)/) || [])[1];
    const depart = !isNaN(h) && h ? h : (rub === 'diagnostic' ? 1 : (fromHash && fromHash.panier ? 3 : 0));
    if (fromHash && fromHash.panier) st.charge = { panier: fromHash.panier, urg: fromHash.urg || 0 };
    history.replaceState({ etape: depart }, '', depart ? '#etape-' + depart : location.pathname + location.search);
    const rep0 = $('[data-reprendre]', est);
    if (rep0 && st.vus.length && depart === 0) { rep0.hidden = false; rep0.addEventListener('click', () => montre(Math.max(...st.vus.filter(x => x > 0), 1))); }
    montre(depart, 1, false);
  }

  /* ================================================================
     RELAIS : frise de continuité
     ================================================================ */
  /* la frise du relais : un fil passe par chaque jalon, qui s'allume à son passage */
  let jalVu = false, jalAnim = null;
  const filJalons = box => {
    let sv = $(':scope > .jl-f', box); if (!sv) { sv = mk('svg', { class: 'jl-f', 'aria-hidden': 'true' }); mk('path', {}, sv); box.prepend(sv); }
    const p = $('path', sv), it = $$('.jalon', box); if (!it.length || !box.offsetWidth) return;
    const br = box.getBoundingClientRect();
    const etroit = innerWidth < 561;
    const P = it.map(x => { const r = $('span', x).getBoundingClientRect(); return [etroit ? 9 : r.left - br.left + r.width / 2, r.top - br.top + r.height / 2]; });
    sv.setAttribute('viewBox', `0 0 ${f1(br.width)} ${f1(br.height)}`); sv.setAttribute('width', f1(br.width)); sv.setAttribute('height', f1(br.height));
    let d = `M${f1(P[0][0])} ${f1(P[0][1] - 26)}L${f1(P[0][0])} ${f1(P[0][1])}`; const lp = [];
    mp0.setAttribute('d', d); lp.push(mp0.getTotalLength());
    for (let i = 1; i < P.length; i++) { const [x1, y1] = P[i - 1], [x2, y2] = P[i], k = 0; d += `C${f1(x1 + k)} ${f1(y1 + (y2 - y1) * .4)} ${f1(x2 - k)} ${f1(y1 + (y2 - y1) * .6)} ${f1(x2)} ${f1(y2)}`; mp0.setAttribute('d', d); lp.push(mp0.getTotalLength()); }
    p.setAttribute('d', d); const L = p.getTotalLength(); p.style.strokeDasharray = `${f1(L)} ${f1(L + 40)}`;
    const montre = v => { p.style.strokeDashoffset = f1(L - v); it.forEach((x, i) => x.classList.toggle('on', v >= lp[i] - 2)); };
    if (jalAnim) cancelAnimationFrame(jalAnim);
    if (RM || !jalVu) { montre(RM ? L : 0); if (!RM && !jalVu) { const ob = new IntersectionObserver(es => { if (es[0].isIntersecting) { ob.disconnect(); jalVu = true; filJalons(box); } }, { threshold: .2 }); ob.observe(box); } return; }
    const D = 1500; let t0 = 0; const pas = ts => { if (!t0) t0 = ts; const k = Math.min(1, (ts - t0) / D); montre(L * doux(k)); if (k < 1) jalAnim = requestAnimationFrame(pas); }; jalAnim = requestAnimationFrame(pas);
  };
  const rl = $('#rl');
  if (rl) {
    const sit = $$('input[name=sit]', rl), dur = $('#r-d', rl), durO = $('#r-do', rl), deb = $('#r-deb', rl), app = $('#r-app', rl);
    const tot = $('[data-tot]', rl), det = $('[data-det]', rl), pistes = null, ech = $('.dates-r', rl), jal = $('.jalons', rl), go = $('[data-demande]', rl), lienB = $('[data-lien]', rl);
    dur.max = DUREES.length - 1;
    const min = ajouteJoursOuvres(new Date(), 10);
    deb.min = isoJour(min);
    const ini = etat.relais || {};
    deb.value = ini.deb && ini.deb >= deb.min ? ini.deb : isoJour(min);
    dur.value = ini.d != null ? ini.d : 4; if (ini.sit) sit.forEach(s => s.checked = s.value === ini.sit);
    if (ini.app != null) app.checked = !!ini.app;
    const rend = () => {
      const d = DUREES[+dur.value]; const p = prixRelais(d); const s = (sit.find(x => x.checked) || sit[0]).value;
      dur.style.setProperty('--p', (+dur.value / (DUREES.length - 1) * 100) + '%'); durO.textContent = d.l;
      let d0 = new Date(deb.value + 'T12:00:00'); if (isNaN(d0)) d0 = new Date(min); if (d0 < min) d0 = new Date(min); while (!ouvre(d0)) d0.setDate(d0.getDate() + 1); if (deb.value !== isoJour(d0)) deb.value = isoJour(d0);
      // fin du relais : la veille du même jour, n semaines ou n mois plus tard ; la passation a lieu le dernier jour ouvré
      const fin = new Date(d0); if (d.sem) fin.setDate(fin.getDate() + d.sem * 7 - 1); else { fin.setMonth(fin.getMonth() + d.mois); fin.setDate(fin.getDate() - 1); }
      while (!ouvre(fin)) fin.setDate(fin.getDate() - 1);
      const appui = app.checked && s !== 'ete', appJ = appui ? 91 : 0;
      const prep = 14, total = prep + p.jours + appJ + 7;
      const x = j => (j / total * 100);
      const lab = (t, w) => w > 9 ? t : '';
      const ess = O.formules[0];
      const tt = p.total + (appui ? ess.prix * 3 : 0); if (!tot.dataset.v) tot.dataset.v = tt; tween(tot, tt);
      det.innerHTML = `Relais : ${esc(p.txt)}, soit ${eur(p.total)} €, mise en place incluse, environ ${p.unites} unités de production.${appui ? `<br>Appui : 3 × ${eur(ess.prix)} € par mois, soit ${eur(ess.prix * 3)} € après le relais.` : ''}`;
      const fin2 = new Date(fin); if (appui) { fin2.setMonth(fin2.getMonth() + 3); while (!ouvre(fin2)) fin2.setDate(fin2.getDate() - 1); }
      // trois repères lisibles, le détail reste dans le calendrier plus bas
      if (ech) ech.innerHTML = [['Démarrage', fdate(d0)], [appui ? 'Fin du relais' : 'Fin et passation', fdate(fin)]].concat(appui ? [['Fin de l’appui', fdate(fin2)]] : []).map(([l, d]) => `<li><span>${esc(l)}</span><b>${esc(d)}</b></li>`).join('');
      const acc = new Date(d0); acc.setDate(acc.getDate() - 14);
      const j1 = new Date(d0); const pub = ajouteJoursOuvres(d0, 1);
      jal.innerHTML = [
        cible === 'e' ? ['J-14', 'Accord et devis signé', `Au plus tard le ${fdate(acc)} : devis signé, désignation de la personne qui valide.`] : ['J-14', 'Accord et bon de commande', `Au plus tard le ${fdate(acc)} : bon de commande ou engagement signé, désignation de la personne qui valide.`],
        ['J-5', 'Accès et passation entrante', 'Une heure en visio : accès aux outils, calendrier des événements, dossiers en cours, contacts presse.'],
        ['J', 'Démarrage', `Le ${fdateL(j1)} : ${esc(SITE.nom)} prend le relais sur les canaux convenus.`],
        ['J+1', 'Premières publications', `À partir du ${fdate(pub)}, les demandes courantes sont traitées en 1 jour ouvré, les urgences sous 24 h ouvrées.`],
        ['Chaque semaine', 'Point de 30 minutes', 'Ce qui est sorti, ce qui arrive, ce qui attend une validation.'],
        ['Fin', 'Passation sortante', `${esc(SIT[s].r)} : un dossier complet (accès, fichiers sources, calendrier, gabarits, publications) et une heure de passation.`]
      ].concat(appui ? [['+3 mois', 'Appui Essentiel', 'Pour épauler la personne en poste sur les pics de charge, la photo et les supports.']] : [])
        .map(([a, b, c]) => `<div class="jalon"><span>${a}</span><b>${b}</b><p>${c}</p></div>`).join('');
      filJalons(jal);
      const sel = selRelais({ sit: s, d: +dur.value, app: appui, debut: isoJour(d0) });
      maj('relais', { sit: s, d: +dur.value, deb: deb.value, app: app.checked, sel });
      return sel;
    };
    [dur, deb, app].concat(sit).forEach(el => el.addEventListener('input', () => { rend(); compte('relais-simulation', true); }));
    let tj = 0; addEventListener('resize', () => { clearTimeout(tj); tj = setTimeout(() => filJalons(jal), 150); });
    sit.forEach(el => el.addEventListener('change', () => { app.closest('.champ').hidden = el.value === 'ete' && el.checked; rend(); }));
    if (go) go.addEventListener('click', () => maj('selection', rend()));
    if (lienB) lienB.addEventListener('click', () => copie(lienPartage('note/', rend())));
    rend();
  }

  /* liste de préparation du relais, gardée sur l'appareil */
  const prep = $('#prep');
  if (prep) {
    const cochés = Object.assign({}, etat.prep);
    $$('input[data-k]', prep).forEach(c => { c.checked = !!cochés[c.dataset.k]; c.addEventListener('change', () => { cochés[c.dataset.k] = c.checked; maj('prep', cochés); }); });
  }

  /* ================================================================
     ENVOI DES FORMULAIRES (service « formulaire » hébergé chez Supabase)
     ================================================================ */
  /* aperçu : aucune demande ne part, et la page le dit clairement */
  const LIB = { nom: 'Nom', fonction: 'Fonction', structure: 'Structure', type: 'Type', email: 'Courriel', tel: 'Téléphone', demarrage: 'Démarrage souhaité', contact: 'Préférence', message: 'Message' };
  const apercuEnvoi = (form, lignes) => {
    let bloc = form.parentNode.querySelector(':scope > .etat.apercu');
    if (!bloc) { bloc = document.createElement('div'); bloc.className = 'etat apercu'; form.after(bloc); }
    bloc.innerHTML = `<span class="ok" aria-hidden="true"><svg class="i"><use href="#x"/></svg></span><h2 tabindex="-1">Aperçu : rien n’a été envoyé.</h2><p class="mu">Cette page est une version de travail. Sur le site en ligne, ces informations partiraient à ${esc(SITE.email)} :</p><ul>${lignes.map(l => `<li>${esc(l)}</li>`).join('')}</ul><button type="button" class="bt cl sm">Revenir au formulaire</button>`;
    form.hidden = true; bloc.hidden = false; $('h2', bloc).focus();
    $('button', bloc).addEventListener('click', () => { bloc.hidden = true; form.hidden = false; });
    compte('apercu-envoi');
  };
  const lignesForm = form => { const fd = Object.fromEntries(new FormData(form).entries()); delete fd._honey; return Object.entries(fd).filter(([, v]) => String(v).trim()).map(([k, v]) => `${LIB[k] || k} : ${/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v.slice(8, 10)}/${v.slice(5, 7)}/${v.slice(0, 4)}` : v}`); };
  const envoie = async (champs) => {
    // le service répond parfois après l'envoi effectif du courriel : au-delà de 25 s sans réponse, la demande est considérée comme partie
    const ac = new AbortController(), to = setTimeout(() => ac.abort(), 25000);
    let r;
    try { r = await fetch(SITE.formsubmit, { method: 'POST', keepalive: true, signal: ac.signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({ _template: 'table', _captcha: 'false' }, champs)) }); }
    catch (e) { clearTimeout(to); if (e && e.name === 'AbortError' && navigator.onLine !== false) return { lent: true }; throw e; }
    clearTimeout(to);
    if (!r.ok) throw new Error('envoi');
    const j = await r.json().catch(() => ({}));
    if (j && (j.success === false || j.success === 'false')) throw new Error(j.message || 'envoi');
    return j;
  };
  const verifie = form => {
    let ok = true, premier = null;
    $$('.champ', form).forEach(c => {
      const inp = $('input,select,textarea', c); if (!inp) return;
      let msg = '';
      if (inp.required && !String(inp.value).trim()) msg = 'Ce champ est nécessaire.';
      else if (inp.type === 'email' && inp.value && !/^\S+@\S+\.\S{2,}$/.test(inp.value)) msg = 'Cette adresse ne semble pas complète.';
      else if (inp.type === 'tel' && inp.value && inp.value.replace(/\D/g, '').length < 9) msg = 'Ce numéro semble incomplet.';
      c.classList.toggle('err', !!msg);
      let m = $('.msg-err', c);
      if (msg) { if (!m) { m = document.createElement('p'); m.className = 'msg-err'; m.id = inp.id + '-err'; c.appendChild(m); } m.textContent = msg; inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', m.id); ok = false; premier = premier || inp; }
      else { if (m) m.remove(); inp.removeAttribute('aria-invalid'); inp.removeAttribute('aria-describedby'); }
    });
    if (premier) premier.focus();
    return ok;
  };
  /* champ piège : s'il est rempli, rien ne part et la page le dit (jamais de faux succès) */
  const piege = form => { const h = $('.miel input', form); return !!(h && h.value); };
  const refusPiege = (form, zone) => { const er = $('[data-err]', zone); if (er) { er.hidden = false; const a = $('a', er); if (a) a.href = `mailto:${SITE.email}`; } };

  /* ================================================================
     FORMULAIRE EN TROIS ÉCRANS (demande de proposition, message).
     Le contexte du parcours est repris ; les réponses sont gardées ;
     la confirmation n'apparaît qu'après une transmission réelle.
     ================================================================ */
  const pf = $('#pf');
  if (pf) {
    const mode = pf.dataset.mode, form = $('form', pf), ecr = $$('.pf-e', pf), barre = $$('.pf-p span', pf);
    const ok = $('[data-ok]', pf), err = $('[data-err]', pf), bPr = $('[data-pr]', pf), bSv = $('[data-sv]', pf), recap = $('[data-recap]', pf), ctx = $('[data-ctx]', pf);
    const N = ecr.length; let n = 1;
    // la dernière sélection validée, relue à chaque affichage
    const selActuelle = () => { const e2 = relit(); return e2.selection ? reconstruit(e2.selection, false) : null; };
    const canauxL = () => { const e2 = relit(); let c = e2.canaux || []; if (!c.length && e2.est && e2.est.rep) c = e2.est.rep.canaux || []; if (c.includes('conseil')) return 'à conseiller'; const L = { site: 'site', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', news: 'newsletter', presse: 'presse', bulletin: 'bulletin', appli: 'application ou panneau', print: 'affiches et flyers' }; return c.map(x => L[x]).filter(Boolean).join(', '); };
    // reprise des réponses déjà saisies
    const c0 = etat.contact || {};
    $$('input,textarea', form).forEach(el => { if (!el.name || el.closest('.miel')) return; if (el.type === 'radio') { if (c0[el.name]) el.checked = el.value === c0[el.name]; } else if (c0[el.name]) el.value = c0[el.name]; });
    form.addEventListener('input', ev => { const el = ev.target; if (!el.name || el.closest('.miel')) return; const cc = Object.assign({}, etat.contact); cc[el.name] = String(el.value).slice(0, 2000); etat.contactT = Date.now(); maj('contact', cc); compte(mode === 'demande' ? 'demande-debut' : 'message-debut', true); });
    const ligne = (a, b) => `<div><span>${esc(a)}</span><b>${esc(b)}</b></div>`;
    const rendCtx = () => {
      if (!ctx) return; const s = selActuelle();
      ctx.hidden = !s;
      if (s) ctx.innerHTML = `<span>Votre estimation : <b>${esc(s.titre)}</b>${s.prix ? ', ' + esc(s.prix) : ''}</span><a href="${U(({ relais: 'relais', calendrier: 'calendrier', formule: 'formules' })[s.src] || 'simulateur') + '/'}${s.src === 'simulateur' || s.src === 'diagnostic' ? '#etape-4' : ''}">Modifier</a>`;
    };
    const rendRecap = () => {
      const fd = Object.fromEntries(new FormData(form).entries());
      const s = mode === 'demande' ? selActuelle() : null;
      let h = ligne('De', `${fd.nom || ''}${fd.structure ? ', ' + fd.structure : ''}`) + ligne('Réponse à', `${fd.email || ''}${fd.tel ? ' · ' + fd.tel : ''}`);
      if (mode === 'demande') {
        h += ligne('Préférence', fd.contact || 'Par courriel');
        h += ligne('Estimation', s ? `${s.titre}${s.prix ? ' · ' + s.prix : ''}` : 'Aucune, à définir ensemble');
        if (s && s.lignes && s.lignes.length) h += ligne('Contenu', s.lignes.slice(0, 4).join(', ') + (s.lignes.length > 4 ? '…' : ''));
        const cl = canauxL(); if (cl) h += ligne('Canaux', cl);
        const dm = $('[data-dem]', pf); if (dm) dm.hidden = !(s && s.relais);
      }
      h += `<button type="button" class="mod" data-mod>Modifier mes coordonnées</button>`;
      recap.innerHTML = h;
      $('[data-mod]', recap).addEventListener('click', () => va(1, -1));
    };
    const va = (k, sens = 1) => {
      n = Math.max(1, Math.min(N, k));
      ecr.forEach((e, i) => { const on = i + 1 === n; e.hidden = !on; if (on) { e.classList.remove('entre', 'entre-g'); void e.offsetWidth; e.classList.add(sens >= 0 ? 'entre' : 'entre-g'); } });
      barre.forEach((b, i) => { b.classList.toggle('fait', i + 1 < n); b.classList.toggle('on', i + 1 === n); });
      bPr.querySelector('span').textContent = n === 1 ? 'Retour' : 'Étape précédente';
      bSv.querySelector('span').textContent = n === N ? (mode === 'demande' ? 'Envoyer la demande' : 'Envoyer le message') : 'Continuer';
      if (n === N) rendRecap();
      err.hidden = true;
      const lg = $('legend', ecr[n - 1]); if (lg && sens !== 0) { lg.setAttribute('tabindex', '-1'); lg.focus({ preventScroll: true }); }
      const champ = $('input:not([type=radio]),textarea', ecr[n - 1]); if (champ && sens !== 0 && !matchMedia('(hover:none)').matches) champ.focus({ preventScroll: true });
    };
    bPr.addEventListener('click', () => { if (n > 1) va(n - 1, -1); else { let ref = ''; try { ref = new URL(document.referrer).origin; } catch (e) {} if (ref === location.origin && history.length > 1) history.back(); else location.href = document.body.dataset.parent || racine; } });
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      if (!verifie(ecr[n - 1])) return;
      if (n < N) { va(n + 1, 1); return; }
      const s = mode === 'demande' ? selActuelle() : null;
      const fd = Object.fromEntries(new FormData(form).entries()); delete fd._honey;
      const type = (relit().est && relit().est.rep && relit().est.rep.type) || (cible === 'e' ? 'pme' : 'collectivité');
      const champs = mode === 'demande'
        ? Object.assign({ _subject: `${SITE.nom} · Demande de proposition · ${fd.structure || fd.nom}`, _replyto: fd.email, 'Type': type, 'Sélection': s ? s.titre : 'Aucune', 'Estimation': s ? (s.prix || '') : '', 'Détail': s ? (s.lignes || []).join(' ; ') : '', 'Canaux souhaités': canauxL() || 'non précisé', 'Synthèse': s && s.synthese ? s.synthese : '', 'Lien de la sélection': s ? lienPartage('demande/', s) : '' }, fd)
        : Object.assign({ _subject: `${SITE.nom} · Message · ${fd.structure || fd.nom}`, _replyto: fd.email }, fd);
      if (T.preview) { apercuEnvoi(form, [`Sélection : ${s ? s.titre + (s.prix ? ' · ' + s.prix : '') : 'aucune'}`].concat(lignesForm(form))); return; }
      if (piege(form)) { err.hidden = false; return; }
      bSv.disabled = true; const lab = bSv.innerHTML; bSv.innerHTML = '<span class="charge" aria-hidden="true"></span> Envoi en cours…'; const lent = setTimeout(() => { bSv.innerHTML = '<span class="charge" aria-hidden="true"></span> Encore quelques secondes…'; }, 6000);
      try {
        const rep = await envoie(champs);
        compte(mode === 'demande' ? 'demande-envoyee' : 'message-envoye');
        if (rep && rep.lent) { const m = $('.mu', ok); if (m) m.textContent = `Le service d’envoi tarde à confirmer, mais votre ${mode === 'demande' ? 'demande' : 'message'} est parti : inutile de le renvoyer. Sans réponse sous 48 h ouvrées, écrivez à ${SITE.email}.`; }
        form.hidden = true; $$('.pf-p, [data-ctx]', pf).forEach(x => { x.hidden = true; }); ok.hidden = false; $('h2', ok).focus();
        delete etat.contact; delete etat.contactT; maj('envoye', { quand: Date.now(), titre: s ? s.titre : '' });
      } catch (er) {
        clearTimeout(lent); bSv.disabled = false; bSv.innerHTML = lab; err.hidden = false;
        const corps = encodeURIComponent(`${fd.message || ''}\n\n${s ? 'Sélection : ' + s.titre + ' · ' + (s.prix || '') + '\n' : ''}${fd.nom || ''}, ${fd.structure || ''}\n${fd.email || ''} ${fd.tel || ''}`);
        $('a', err).href = `mailto:${SITE.email}?subject=${encodeURIComponent(SITE.nom + (mode === 'demande' ? ' · Demande de proposition' : ' · Message'))}&body=${corps}`;
      }
    });
    rendCtx(); va(1, 0);
  }

  /* ================================================================
     NOTE DE PRÉSENTATION (impression ou PDF)
     ================================================================ */
  const note = $('#note');
  if (note) {
    const s = etat.selection, ct = etat.contact || {};
    const vide = $('[data-vide]', note), doc = $('.note-doc', note);
    if (!s) { vide.hidden = false; doc.hidden = true; $('.note-bar', note).hidden = true; }
    else {
      const pubT = !s.type || ['commune', 'interco', 'public'].includes(s.type), pub = pubT || s.relais;
      const auj = new Date();
      const f = s.formule ? FORM.find(x => x.id === s.formule) : null;
      const lignesCout = s.relais ? `<tr><td>${esc(s.titre)}</td><td class="r">${esc(s.prix)}</td></tr><tr><td>Mise en place</td><td class="r">incluse</td></tr>`
        : (!s.mensuel ? `<tr><td>${esc(s.titre)}</td><td class="r">${esc(s.prix || 'Sur étude')}</td></tr>` : (() => { const c = couts(s.mensuel, f); return `<tr><td>Abonnement mensuel (${esc(s.titre)})</td><td class="r">${eur(s.mensuel)} €</td></tr><tr><td>Mise en place, une fois (offerte avec ${O.engagement_long} mois d’engagement)</td><td class="r">${eur(c.mep)} €</td></tr><tr><td>Engagement minimum de ${O.engagement_mois} mois</td><td class="r">${eur(c.six)} €</td></tr><tr><th>Première année, engagement de ${O.engagement_mois} mois</th><th class="r">${eur(c.an)} €</th></tr><tr><th>Première année, engagement de ${O.engagement_long} mois</th><th class="r">${eur(c.an12)} €</th></tr>`; })());
      doc.innerHTML = `
        <div class="ent"><div><p class="n">Note de présentation</p><h1>Externaliser la communication courante</h1></div><div style="text-align:right;font-size:13px;color:var(--fa)">${esc(fdate(auj))} ${auj.getFullYear()}<br><span contenteditable="true" spellcheck="false" style="border-bottom:1px dashed var(--ln2)">${esc(ct.structure || 'Nom de la structure')}</span></div></div>
        <section><h2>1. Le besoin</h2><p>${s.synthese ? 'Situation décrite lors du diagnostic en ligne. ' : ''}${esc(s.synthese || 'La structure doit assurer une communication régulière (site, réseaux sociaux, supports) sans disposer du temps ou de la personne dédiée pour la tenir dans la durée.')}</p>
        ${s.priorites ? `<ul style="margin-top:8px;padding-left:18px;list-style:disc">${s.priorites.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}</section>
        <section><h2>2. La solution étudiée</h2><p>${s.relais ? 'Relais : prise en charge de la communication pendant l’absence ou le recrutement, avec passation à l’arrivée ou au retour de l’agent.' : (!f ? 'Un forfait sur mesure, à définir lors d’un échange : le volume dépasse les formules publiques.' : `Abonnement ${esc(f.nom)} : ${s.capacite} unités de production par mois, délai de traitement de ${esc(f.delai)}, ${esc(f.suivi.toLowerCase())}.`)} Prestataire : ${esc(SITE.nom)}, service de ${esc(SITE.maison)} (entrepreneur individuel, SIRET ${esc(SITE.siret)}).</p>
        <p style="margin-top:6px"><b>Contenu mensuel envisagé :</b> ${esc((s.lignes || []).join(', '))}.</p></section>
        <section><h2>3. Le coût</h2><table>${lignesCout}</table><p style="font-size:13px;color:var(--fa);margin-top:6px">TVA non applicable à ce jour, article 293 B du CGI. ${s.relais ? (pubT ? 'Facturation mensuelle à terme échu, déposée sur Chorus Pro, payable à 30 jours.' : 'Réglé à l’avance, chaque mois ou chaque semaine, par virement automatique (IBAN sur la facture) ou par carte en ligne (depuis l’Espace Fill, ou avec le lien joint à chaque facture).') : (pubT ? 'Facturation mensuelle à terme échu, déposée sur Chorus Pro, payée à 30 jours.' : 'Abonnement réglé chaque mois à l’avance, par virement automatique (virement permanent programmé depuis votre banque, IBAN sur la facture) ou par carte en ligne (depuis l’Espace Fill, ou avec le lien joint à chaque facture) ; les unités du premier mois sont créditées au premier règlement, puis le premier jour de chaque mois.')}</p></section>
        ${pub ? `<section><h2>4. Le cadre d’achat</h2><p>Pour les services, un acheteur public peut conclure sans publicité ni mise en concurrence préalables un marché dont la valeur estimée reste inférieure à 60 000 € HT (seuil en vigueur depuis le 1<sup>er</sup> avril 2026). Cette valeur s’apprécie sur la durée totale du besoin et l’ensemble des prestations de même nature, pas seulement sur ce devis. Il revient à l’acheteur d’évaluer son besoin, de choisir une offre pertinente, de faire une bonne utilisation des deniers publics et de ne pas contracter systématiquement avec le même prestataire lorsque plusieurs offres peuvent y répondre. Des tarifs publics ne dispensent pas de ces vérifications : à confirmer avec votre service des marchés.</p></section>` : ''}
        <section><h2>${pub ? 5 : 4}. Le fonctionnement</h2><ul style="padding-left:18px;list-style:disc;display:grid;gap:4px"><li>Un référent unique transmet les demandes et valide les publications.</li><li>Chaque demande est confirmée sous 24 h ouvrées, avec son nombre d’unités et sa date de livraison.</li><li>Deux allers-retours de corrections par livrable ; les fichiers sources sont remis.</li><li>${s.relais ? 'Durée définie à la commande, prolongeable par période d’une semaine ou d’un mois.' : `Engagement de ${O.engagement_mois} mois, puis résiliable chaque mois avec un mois de préavis.`}</li><li>Aucune unité hors forfait n’est facturée sans accord écrit préalable.</li></ul></section>
        <p class="pdp">Estimation indicative établie le ${esc(fdate(auj))} à partir d’une simulation sur ${esc(location.host || String(SITE.domaine || '').replace(/^https?:\/\//, ''))} : elle ne vaut ni devis ni engagement. Contact : ${esc(SITE.email)}, ${esc(SITE.telephone)}.</p>`;
      const pr = $('[data-imprime]', note); if (pr) pr.addEventListener('click', () => { compte('note-imprimee'); window.print(); });
      const li = $('[data-lien]', note); if (li) li.addEventListener('click', () => copie(lienPartage('note/', s)));
    }
  }

  /* retour en haut : un bouton discret qui suit le défilement, sur mobile */
  {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'haut'; b.setAttribute('aria-label', 'Revenir en haut de la page');
    b.innerHTML = '<svg class="i" aria-hidden="true"><use href="#ar"/></svg>';
    document.body.appendChild(b);
    const recap = $('.recap-mob');
    let raf = 0; const maj = () => { raf = 0; b.classList.toggle('on', scrollY > innerHeight * 1.4); b.classList.toggle('haut-recap', !!(recap && recap.offsetHeight && getComputedStyle(recap).display !== 'none')); };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(maj); }, { passive: true }); maj();
    b.addEventListener('click', () => { scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); const h = $('#hd'); if (h) h.classList.remove('cache'); });
  }

  /* mentions légales : tout effacer d'un geste */
  $$('[data-efface]').forEach(b => b.addEventListener('click', () => { try { localStorage.removeItem(CLE); ['fil.intro', 'fil.nav', 'fil.hist'].forEach(k => sessionStorage.removeItem(k)); } catch (e) {} etat = {}; perso.nom = ''; $$('.perso-n').forEach(i => { i.value = ''; }); toast('Les informations gardées sur cet appareil sont effacées.'); }));

  /* aperçu (artefact) : ni envoi réel, ni impression, rendez-vous dans un nouvel onglet */
  if (T.preview) {
    $$('[data-imprime]').forEach(b => { b.hidden = true; });
  }

})();

/* formulaire du simulateur de relais : le calcul se fait sur place, la page ne se recharge pas */
document.querySelectorAll('form.rl-c').forEach(f => f.addEventListener('submit', e => e.preventDefault()));

/* dates au format français (jj/mm/aaaa), quel que soit le réglage du navigateur : un champ texte affiché,
   le champ date d'origine reste la valeur lue par les scripts et envoyée par le formulaire */
(() => {
  const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  const fr = iso => /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '';
  const iso = t => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t); if (!m) return ''; const s = `${m[3]}-${m[2]}-${m[1]}`, d = new Date(s + 'T12:00:00'); return !isNaN(d) && d.toISOString().slice(0, 10) === s ? s : ''; };
  document.querySelectorAll('input[type=date].in').forEach(nat => {
    const env = document.createElement('span'); env.className = 'date-fr';
    const txt = document.createElement('input'); txt.type = 'text'; txt.className = nat.className; txt.inputMode = 'numeric'; txt.placeholder = 'jj/mm/aaaa'; txt.maxLength = 10; txt.autocomplete = 'off';
    if (nat.id) { txt.id = nat.id; nat.id = nat.id + '-natif'; }
    const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'date-cal'; bt.setAttribute('aria-label', 'Choisir dans le calendrier'); bt.innerHTML = '<svg class="i" aria-hidden="true"><use href="#ca"/></svg>';
    nat.parentNode.insertBefore(env, nat); env.append(txt, bt, nat);
    nat.tabIndex = -1; nat.setAttribute('aria-hidden', 'true'); nat.classList.add('date-natif');
    Object.defineProperty(nat, 'value', { get() { return proto.get.call(this); }, set(v) { proto.set.call(this, v); if (document.activeElement !== txt) txt.value = fr(v); } });
    txt.value = fr(proto.get.call(nat));
    const pousse = v => { proto.set.call(nat, v); nat.dispatchEvent(new Event('input', { bubbles: true })); nat.dispatchEvent(new Event('change', { bubbles: true })); };
    txt.addEventListener('input', () => {
      const ch = txt.value.replace(/\D/g, '').slice(0, 8);
      txt.value = ch.length > 4 ? `${ch.slice(0, 2)}/${ch.slice(2, 4)}/${ch.slice(4)}` : ch.length > 2 ? `${ch.slice(0, 2)}/${ch.slice(2)}` : ch;
      const v = iso(txt.value);
      txt.setAttribute('aria-invalid', String(ch.length === 8 && !v));
      if (v || !ch.length) pousse(v);
    });
    txt.addEventListener('blur', () => { txt.value = fr(proto.get.call(nat)); txt.removeAttribute('aria-invalid'); });
    nat.addEventListener('change', () => { if (document.activeElement !== txt) txt.value = fr(proto.get.call(nat)); });
    bt.addEventListener('click', () => { try { nat.showPicker(); } catch { nat.focus(); } });
  });
})();
