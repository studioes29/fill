/* Bannière animée de l'accueil Fill. Boucle de 24 s pilotée par seek(t). */
(() => {
const host = document.querySelector('[data-banniere]');
if (!host) return;
let DUR = 40;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

const NOTIFS = [
  ['GR', '#ffe0d5', 'Gaëlle', 'Tu peux faire l’affiche pour samedi ?'],
  ['YC', '#ece6ff', 'Yannick', 'Il faudrait le mettre sur Facebook aussi.'],
  ['CL', '#dfeee6', 'Claire', 'Le site affiche encore les horaires d’été.'],
  ['ML', '#b8a4ff', 'Marion', 'La newsletter part quand ?'],
  ['HM', '#ffd36b', 'Hugo', 'Urgent : changement de salle !'],
  ['GR', '#ffe0d5', 'Gaëlle', 'Et l’affiche, ça avance ?'],
  ['YC', '#ece6ff', 'Yannick', 'Tu as des photos de l’inauguration ?'],
  ['GR', '#ffe0d5', 'Gaëlle', 'Samedi, c’est demain…'],
];
const NT = [0.3, 0.8, 1.25, 1.65, 2.0, 2.3, 2.58, 2.84];
const PILE = [[-34, 868, -3], [22, 790, 2.2], [-12, 712, -1.6], [30, 634, 3.2], [-26, 556, -2.4], [14, 478, 1.6], [-36, 400, -3.4], [20, 322, 2.6]];
const bounce = p => { const n = 7.5625, d = 2.75; if (p < 1 / d) return n * p * p; if (p < 2 / d) return n * (p -= 1.5 / d) * p + .75; if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + .9375; return n * (p -= 2.625 / d) * p + .984375; };

host.innerHTML = `
<div class="bn" role="img" aria-label="Animation : votre com déborde ? Les demandes s’accumulent et la page Facebook n’a rien publié depuis dix mois. Avec Fill, une demande de trois lignes devient une publication, une affiche, une actualité et une newsletter, validées par vous, déposées par chaque collègue et publiées à l’heure prévue. Fill : votre communication, sans perdre le fil.">
<div class="bn-s">
  <div class="bx-a bn-intro"><div class="bn-eye">Communes, collectivités, PME</div><div class="bn-big"><span class="bx-w"><span>Votre</span></span> <span class="bx-w"><span>com</span></span><br><span class="bn-spill bx-it">${[...'déborde'].map(c => `<span class="bn-l">${c}</span>`).join('')}</span><span class="bn-q bx-it">\u202f?</span></div></div>
  <div class="bx-a bn-out"><svg class="bn-logo" viewBox="0 0 1376 720" aria-hidden="true"><g fill="#fff"><path d="M100 700V262C100 158 168 90 274 90H300V214H282C246 214 224 236 224 274V700Z"/><rect x="18" y="330" width="282" height="104" rx="8"/><rect x="360" y="330" width="124" height="370" rx="8"/><circle cx="422" cy="178" r="72"/></g><g fill="none" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"><path data-l1 stroke="#b8a4ff" pathLength="1" stroke-dasharray="1" d="M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600"/><path data-l2 stroke="#ff8a6b" pathLength="1" stroke-dasharray="1" d="M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575"/></g></svg>
    <div class="bn-tag"><span class="bx-w"><span>Votre</span></span> <span class="bx-w"><span>communication,</span></span><br><span class="bx-w bx-it"><span>sans</span></span> <span class="bx-w bx-it"><span>perdre</span></span> <span class="bx-w bx-it"><span>le</span></span> <span class="bx-w bx-it"><span>fil.</span></span></div>
    <div class="bn-url">fill.studioes.fr</div></div>
  <div class="bx-a bn-cap"></div><div class="bx-a bn-sub"></div>
  ${NOTIFS.map((n, i) => `<div class="bx-a bn-nt" data-n="${i}"><div class="bx-av" style="background:${n[1]}">${n[0]}</div><div class="bx-tx"><div class="bx-nm">${n[2]}<span>à l’instant</span></div><div class="bx-ms">${n[3]}</div></div></div>`).join('')}
  <div class="bx-a bn-badge">0</div>
  <div class="bx-a bn-fb" data-fb>
    <div class="bx-hd"><div class="bx-lg">SI</div><div class="bx-nm">Saint-Ivenec<small>Page Facebook</small></div></div>
    <div class="bx-old">Dernière publication : il y a 10 mois</div><div class="bx-new" style="display:none">Publié à l’instant</div>
    <div class="bx-im">Bonne année !</div>
    <div class="bx-ft"><span class="bx-lk">3 J’aime</span><span>0 partage</span></div>
  </div>

  <div class="bx-a bn-card bn-req">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><div class="bx-h">Nouvelle demande</div><div class="bx-k" style="margin:0">Gaëlle Riou</div></div>
    <div class="bx-k">Le sujet</div><div class="bx-fld" data-f1 style="margin-bottom:18px"></div>
    <div class="bx-k">Les détails</div>
    <div style="display:flex;gap:16px;margin-bottom:22px"><div class="bx-fld" data-f2 style="flex:1;white-space:normal;line-height:1.25;height:96px;font-size:26px;padding-top:13px"></div><div class="bx-a" data-ph style="position:relative;width:126px;height:96px;border-radius:16px;background:url(./assets/img/ev-asso-s.webp) center 30%/cover"></div></div>
    <div class="bx-k">Les supports</div>
    <div class="bx-chips"><div class="bx-chip" data-c="0">Publication <i>1 u</i></div><div class="bx-chip" data-c="1">Affiche <i>4 u</i></div><div class="bx-chip" data-c="2">Actualité du site <i>1 u</i></div><div class="bx-chip" data-c="3">Newsletter <i>3 u</i></div></div>
    <div class="bx-bar"><div class="bx-u"><b data-un>0</b>unités, connues avant l’envoi</div><div class="bx-btn" data-send>Envoyer →</div></div>
  </div>

  <div class="bx-a bx-lv bx-post" data-lv="post" style="width:440px;z-index:2"><div class="bx-hd"><div class="bx-pav">SI</div>saint.ivenec</div><div class="bx-im"><b>Portes ouvertes<em>samedi 14 décembre</em></b></div><div class="bx-ft"><b style="color:#1a1a1a">saint.ivenec</b> Samedi, on vous ouvre les portes : visite libre de 10 h à 18 h.</div></div>
  <div class="bx-a bx-lv bx-aff" data-lv="aff" style="width:420px;height:594px;z-index:3"><div class="bx-m"><span>Saint-Ivenec</span><span>Entrée libre</span></div><div class="bx-im"></div><div class="bx-t">Portes<br>ouvertes</div><div class="bx-d">Samedi 14 décembre</div><div class="bx-m"><span>10 h à 18 h</span><span>Café offert</span></div></div>
  <div class="bx-a bx-lv bx-web" data-lv="web" style="width:720px;z-index:1"><div class="bx-url"><span class="bx-dot"></span><span class="bx-dot"></span><span class="bx-dot"></span><span class="bx-u2">saint-ivenec.fr/actualites</span></div><div class="bx-bd"><div class="bx-im"></div><div><span class="bx-tag">Actualité</span><div class="bx-ti">Portes ouvertes le 14 décembre</div><div class="bx-ln"></div><div class="bx-ln"></div><div class="bx-ln" style="width:80%"></div><div class="bx-ln" style="width:92%"></div><div class="bx-ln" style="width:60%"></div></div></div></div>
  <div class="bx-a bx-lv bx-nl" data-lv="nl" style="width:520px;z-index:4"><div class="bx-mh"><b>Saint-Ivenec</b> à vos abonnés<br>Objet : <b>Samedi, on vous ouvre les portes</b></div><div class="bx-ban">Portes ouvertes<em>samedi 14 décembre, 10 h à 18 h</em></div><div class="bx-bd"><div class="bx-ln"></div><div class="bx-ln"></div><div class="bx-ln" style="width:75%"></div></div></div>
  <div class="bx-a bn-lab"></div>

  <div class="bx-a bn-card" data-rev style="width:440px;padding:34px 34px">
    <div class="bx-k">Épreuve 1 · Affiche</div>
    <div class="bx-h" style="font-size:40px;line-height:1.05;margin-bottom:14px">Votre affiche est prête à relire.</div>
    <div style="font-size:24px;color:#1a1a1ab8;line-height:1.35;margin-bottom:28px">Deux allers-retours compris.</div>
    <div class="bx-btn bx-o" style="margin-bottom:14px;font-size:23px">Demander une modification</div>
    <div class="bx-btn" data-val>Valider</div>
  </div>
  <div class="bx-a bn-stamp"><svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path data-chk d="M5 12.5l4.5 4.5L19 7.5" stroke-dasharray="22" stroke-dashoffset="22"/></svg></div>

  <div class="bx-a bn-card" data-team style="width:840px;padding:30px 42px 14px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div class="bx-h">Équipe</div><div class="bx-btn" style="padding:14px 24px;font-size:22px">+ Inviter</div></div>
    <div class="bn-row" data-r="0"><div class="bx-av" style="background:#b8a4ff">ML</div><div class="bx-n">Marion<small>Référente · gère droits et plafonds</small></div><div class="bn-role" style="background:#1a1a1a;color:#fff">Référente</div></div>
    <div class="bn-row" data-r="1"><div class="bx-av" style="background:#ffe0d5">GR</div><div class="bx-n">Gaëlle<small>4 unités sur 6 ce mois</small></div><div class="bn-role">Contributrice</div></div>
    <div class="bn-row" data-r="2"><div class="bx-av" style="background:#ece6ff">YC</div><div class="bx-n">Yannick<small>2 unités sur 6 ce mois</small></div><div class="bn-role">Contributeur</div></div>
    <div class="bn-row" data-r="3"><div class="bx-av" style="background:#ffd36b">HM</div><div class="bx-n">Hugo<small>Invité à l’instant</small></div><div class="bn-role">Lecture seule</div></div>
  </div>

  <div class="bx-a bn-toast" data-t="0"><span class="bn-tk">✓</span><div>Actualité en ligne<small>saint-ivenec.fr</small></div></div>
  <div class="bx-a bn-toast" data-t="1"><span class="bn-tk">✓</span><div>Newsletter envoyée<small>1 240 abonnés</small></div></div>
  <div class="bx-a bn-toast" data-t="2"><span class="bn-tk">✓</span><div>Affiche à imprimer<small>Fichiers sources remis</small></div></div>

  <div class="bx-a bn-burst"></div>
  ${[0,1,2,3,4,5].map(i => `<svg class="bx-a bn-heart" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.6l1 1.4 1-1.4C14 6.1 15.6 5 17.6 5 21 5 23.1 8.4 21.6 11.8 19.5 16.4 12 21 12 21z" fill="${i % 2 ? '#ff8a6b' : '#e5484d'}"/></svg>`).join('')}
  <svg class="bn-wipe" viewBox="0 0 1000 1000" aria-hidden="true"><path data-wp pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="600" d="M-320 110C300 40 900 20 1260 130C1520 220 1420 470 1000 500C620 525 300 455 -60 515C-420 575 -360 865 0 885C420 905 820 965 1320 895"/></svg>
  <div class="bn-iris"></div>
  <div class="bx-a bn-ring"></div>
  <svg class="bx-a bn-cur" viewBox="0 0 24 24"><path d="M4 2.5l15 9.2-6.6 1.6 3.9 7.2-2.7 1.4-3.9-7.2L4.9 19z" fill="#1a1a1a" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>
</div>
<button class="bn-pp" type="button" aria-label="Mettre l’animation en pause"><svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg></button>
</div>`;

const R = host.querySelector('.bn'), ST = R.querySelector('.bn-s');
const q = s => ST.querySelector(s), qa = s => [...ST.querySelectorAll(s)];
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const P = (t, a, b) => cl((t - a) / (b - a));
const eo = p => 1 - Math.pow(1 - p, 3), eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const back = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
function S(el, { x = 0, y = 0, s = 1, o = 1, r = 0, ry = 0 } = {}) {
  el.style.visibility = o > 0.002 ? 'visible' : 'hidden'; el.style.opacity = o;
  el.style.transform = (ry ? 'perspective(1600px) ' : '') + `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)` + (ry ? ` rotateY(${ry}deg)` : '');
}
const hide = el => S(el, { o: 0 });

// légendes : [début, fin, texte (*italique*), sous-titre, fond]
const CAPS = [
  [0.15, 2.9, 'Les demandes *s’empilent.*', ''],
  [2.95, 5.5, 'Et la page Facebook *dort.*', ''],
  [5.75, 7.35, 'Fill *prend le relais.*', 'Un interlocuteur, un prix fixe, un espace pour tout suivre.'],
  [7.45, 10.05, 'Trois lignes *suffisent.*', ''],
  [10.15, 13.0, 'Fill décline *tous vos supports.*', 'Confirmé sous 24 h ouvrées.'],
  [13.1, 15.6, 'Rien ne part *sans votre accord.*', ''],
  [15.7, 18.45, 'Chacun dépose *ses demandes.*', 'Le référent fixe les droits et les plafonds.'],
  [18.55, 21.3, 'Publié *à l’heure prévue.*', ''],
  [21.4, 23.55, 'Vous, vous retournez *à votre métier.*', ''],
];
let capK = -1;
const cap = q('.bn-cap'), sub = q('.bn-sub');
function buildCap(k) {
  const words = []; CAPS[k][2].split(/(\*[^*]+\*)/).filter(Boolean).forEach(seg => {
    const it = seg.startsWith('*'); seg.replace(/\*/g, '').trim().split(' ').forEach(w => words.push([w, it]));
  });
  cap.innerHTML = words.map(([w, it]) => `<span class="bx-w${it ? ' bx-it' : ''}"><span>${w}</span></span>`).join(' ');
  sub.textContent = CAPS[k][3];
  cap.classList.toggle('bx-big', k === 2);
  sub.style.top = (cap.offsetTop + cap.offsetHeight + 22) + 'px';
}
function caps(t) {
  let k = CAPS.findIndex(c => t >= c[0] && t < c[1]);
  if (k < 0) { hide(cap); hide(sub); return; }
  if (k !== capK) { buildCap(k); capK = k; }
  const c = CAPS[k], out = eio(P(t, c[1] - .28, c[1]));
  S(cap, { y: -26 * out, o: 1 - out });
  cap.querySelectorAll('.bx-w>span').forEach((w, j) => { const p = back(P(t, c[0] + j * .065, c[0] + j * .065 + .5)); w.style.transform = `translateY(${(1 - p) * 112}%)`; });
  const sp = eo(P(t, c[0] + .45, c[0] + .85)); S(sub, { y: (1 - sp) * 14 - 26 * out, o: sp * (1 - out) });
}
const typed = (t, a, cps, s) => s.slice(0, Math.floor(cl((t - a) * cps, 0, s.length)));
const L1 = 'Portes ouvertes, samedi 14 décembre', L2 = 'De 10 h à 18 h, entrée libre. On aimerait une affiche et un post.';
function curPath(t, keys) {
  let x = keys[0][1], y = keys[0][2];
  for (let i = 1; i < keys.length; i++) { const [ta, xa, ya] = keys[i - 1], [tb, xb, yb] = keys[i];
    if (t >= tb) { x = xb; y = yb; } else if (t > ta) { const p = eio(P(t, ta, tb)); x = xa + (xb - xa) * p; y = ya + (yb - ya) * p - Math.sin(p * Math.PI) * 40; break; } }
  return { x, y };
}
let SZ = {};
function measure() {
  qa('[data-lv],[data-rev],[data-team],.bn-req,[data-fb]').forEach(e => { e.style.visibility = 'visible'; e.style.transform = 'none'; });
  qa('[data-lv]').forEach(e => SZ[e.dataset.lv] = [e.offsetWidth, e.offsetHeight]);
  // positions en unités de scène, indépendantes des transformations en cours (entrée de page comprise)
  const off = el => { let x = 0, y = 0, e = el; while (e && e !== ST) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x, y]; };
  const ctr = el => { const [x, y] = off(el); return [x + el.offsetWidth / 2, y + el.offsetHeight / 2]; };
  const qe = q('.bn-q'), [qx, qy] = off(qe); QX = qx + qe.offsetWidth * .62; QY = qy + qe.offsetHeight * .78;
  SEND = ctr(q('[data-send]')); const v = ctr(q('[data-val]')); VAL = [v[0] + 500, v[1] + 380];
}

function legacy(t) {
  caps(t);
  // fond : bascule lavande au moment du « Confiez-la à Fill »

  // ---------- A. les demandes s'accumulent (0 à 5.9)
  const nts = qa('.bn-nt'), suck = eio(P(t, 5.3, 5.6));
  let arrived = 0;
  nts.forEach((el, i) => {
    if (t < NT[i] || t >= 5.6) { hide(el); return; }
    arrived++;
    const p = bounce(P(t, NT[i], NT[i] + .62)), land = PILE[i];
    const hit = t >= 3.8 ? Math.sin((t - 3.8) * 70) * 10 * (1 - P(t, 3.8, 4.2)) : 0;
    const y = -260 + (land[1] + 260) * p;
    S(el, { x: land[0] + hit + (500 - 500) * suck, y: y * (1 - suck) + 520 * suck, r: land[2] * p * (1 - suck) + (1 - p) * land[2] * 4, s: 1 - .85 * suck, o: P(t, NT[i], NT[i] + .06) * (1 - suck) });
  });
  const badge = q('.bn-badge');
  if (t >= 0.95 && t < 5.6) { const n = Math.round(arrived + 4 * P(t, 3.5, 4.6)); badge.textContent = n;
    const pop = back(P(t, .95, 1.3)); S(badge, { x: 880, y: 262, s: pop * (1 + .12 * Math.max(0, Math.sin((t - .95) * 9)) * (1 - P(t, 4.6, 4.8))) * (1 - suck), o: 1 - suck }); } else hide(badge);
  // page Facebook endormie (A) puis réveillée (E)
  const fb = q('[data-fb]');
  const fbOld = fb.querySelector('.bx-old'), fbNew = fb.querySelector('.bx-new'), fbIm = fb.querySelector('.bx-im'), fbLk = fb.querySelector('.bx-lk');
  if (t >= 3.55 && t < 5.6) {
    fbOld.style.display = ''; fbNew.style.display = 'none'; fbIm.className = 'bx-im'; fbIm.textContent = 'Bonne année !'; fbLk.textContent = '3 J’aime';
    const p = eio(P(t, 3.55, 3.8)), set = back(P(t, 3.78, 4.1));
    S(fb, { x: 300, y: 380 + suck * 120, r: 12 * (1 - p) - 4 * p, s: (1.7 - .7 * p) * (1 + .04 * (1 - set) * (t > 3.78 ? 1 : 0)) * (1 - .8 * suck), o: P(t, 3.55, 3.62) * (1 - suck) });
  } else if (t >= 18.55 && t < 23.95) {
    fbOld.style.display = 'none'; fbNew.style.display = ''; fbIm.className = 'bx-im bx-ph'; fbIm.innerHTML = 'Portes ouvertes<br>samedi 14 décembre';
    fbLk.textContent = Math.round(126 * eo(P(t, 19.0, 21.5))) + ' J’aime';
    qa('.bn-heart').forEach((h, i) => { const a = 19.1 + i * .38, k = P(t, a, a + 1.5); if (k <= 0 || k >= 1) { hide(h); return; }
      S(h, { x: 110 + i * 62 + Math.sin(k * 6 + i) * 22, y: 760 - 330 * eo(k), s: .6 + .7 * back(cl(k * 3)), r: (i % 2 ? 12 : -12) * k, o: 1 - P(k, .65, 1) }); });
    const p = back(P(t, 18.55, 19.0)), out = eio(P(t, 23.55, 23.95));
    S(fb, { x: 30, y: 290 + (1 - p) * 120, s: .9, o: P(t, 18.55, 18.65) * (1 - out) });
  } else hide(fb);
  if (!(t >= 18.55 && t < 23.95)) qa('.bn-heart').forEach(hide);

  // ---------- B. demande (7.35 à 10.3)
  const req = q('.bn-req');
  if (t >= 7.35 && t < 10.35) {
    const pin = back(P(t, 7.35, 7.8)), out = eio(P(t, 9.95, 10.35));
    S(req, { y: (1 - pin) * 90 - 40 * out, s: 1 - .3 * out, o: P(t, 7.35, 7.45) * (1 - out) });
    const f1 = q('[data-f1]'), f2 = q('[data-f2]');
    f1.innerHTML = typed(t, 7.75, 30, L1) + (t > 7.7 && t < 8.95 && Math.floor(t * 4) % 2 === 0 ? '<span class="bx-car"></span>' : '');
    f1.classList.toggle('bx-on', t > 7.7 && t < 8.95);
    f2.textContent = typed(t, 8.85, 88, L2); f2.classList.toggle('bx-on', t > 8.85 && t < 9.95);
    const pp = back(P(t, 9.0, 9.3)); S(q('[data-ph]'), { s: .4 + .6 * pp, o: P(t, 9.0, 9.08) });
    const W = [1, 4, 1, 3]; let u = 0;
    qa('[data-c]').forEach((c, i) => { const ta = 9.1 + i * .12, on = t >= ta; c.classList.toggle('bx-on', on); c.style.transform = `scale(${1 + .08 * Math.sin(P(t, ta, ta + .18) * Math.PI)})`; if (on) u += W[i]; });
    q('[data-un]').textContent = u;
    q('[data-send]').style.transform = `scale(${t > 9.72 && t < 9.86 ? .93 : 1})`;
  } else hide(req);

  // ---------- C. livrables (10.15 à 13.05)
  const LV = [['post', 'Publication', '1 unité'], ['aff', 'Affiche', '4 unités'], ['web', 'Actualité du site', '1 unité'], ['nl', 'Newsletter', '3 unités']];
  const seq = [10.2, 10.75, 11.3, 11.85], all = 12.35, end = 13.05;
  const FIN = { web: [650, 520, .6, -2], post: [240, 640, .64, -4], aff: [480, 660, .68, 2], nl: [790, 710, .6, 4] };
  let lab = '';
  LV.forEach(([id, name, u], i) => {
    const el = q(`[data-lv="${id}"]`);
    if (id === 'aff' && t >= 13.05) return; // reprise par la relecture
    if (t < seq[i] || t >= end) { hide(el); return; }
    const [w, h] = SZ[id]; const cx = 500 - w / 2, cy = 640 - h / 2;
    const pin = back(P(t, seq[i], seq[i] + .4));
    let x = cx, y = cy + (1 - pin) * 120, s = (.86 + .14 * pin) * .84, o = P(t, seq[i], seq[i] + .1), r = 0;
    if (i < 3 && t >= seq[i + 1] && t < all) o = 0;
    if (t >= all) { const a0 = all + i * .07, p = back(P(t, a0, a0 + .5)); const [fx, fy, fs, fr] = FIN[id]; const s0 = i === 3 ? .84 : .6;
      x = cx + ((fx - w / 2) - cx) * p; y = cy + ((fy - h / 2) - cy) * p; s = s0 + (fs - s0) * p; r = fr * p; o = i === 3 ? 1 : P(t, a0, a0 + .1); }
    const oo = eio(P(t, end - .28, end)); S(el, { x, y, s, r, o: o * (1 - oo), ry: t < all ? (1 - pin) * -80 : 0 });
    if (t < all && (i === 3 || t < seq[i + 1])) lab = `${name} <span>· ${u}</span>`;
  });
  if (t >= all && t < end) lab = `9 unités <span>· prix connu avant l’envoi</span>`;
  const labEl = q('.bn-lab'); labEl.innerHTML = lab; S(labEl, { o: lab ? eo(P(t, 10.25, 10.45)) * (1 - eio(P(t, end - .28, end))) : 0 });

  // ---------- D. relecture (13.1 à 15.65)
  const aff = q('[data-lv="aff"]'), rev = q('[data-rev]'), stamp = q('.bn-stamp');
  if (t >= 13.1 && t < 15.65) {
    const p = back(P(t, 13.1, 13.5)), qq = back(P(t, 13.22, 13.65)), out = eio(P(t, 15.35, 15.65));
    const sk = t >= 14.6 ? Math.sin((t - 14.6) * 95) * 12 * (1 - P(t, 14.6, 14.95)) : 0;
    S(aff, { x: 60 + sk, y: 330 + (1 - p) * 80 + sk * .4, s: .96, o: P(t, 13.1, 13.2) * (1 - out) });
    S(rev, { x: 500 + sk * .6, y: 380 + (1 - qq) * 80, o: P(t, 13.22, 13.32) * (1 - out) });
    const bp = P(t, 14.6, 15.2); S(q('.bn-burst'), { x: 270 - 160, y: 640 - 160, s: .5 + 1.9 * eo(bp), o: bp > 0 && bp < 1 ? 1 - bp : 0 });
    q('[data-val]').style.transform = `scale(${t > 14.35 && t < 14.5 ? .93 : 1})`;
    const sp = eio(P(t, 14.42, 14.6)); S(stamp, { x: 190, y: 560, s: 2.6 - 1.6 * sp, o: P(t, 14.42, 14.5) * (1 - out), r: -24 * (1 - sp) });
    q('[data-chk]').style.strokeDashoffset = 22 * (1 - eo(P(t, 14.62, 14.95)));
  } else { hide(rev); hide(stamp); hide(q('.bn-burst')); if (t >= 13.05 || t < 10.75) hide(aff); }

  // ---------- E. équipe (15.7 à 18.5)
  const team = q('[data-team]');
  if (t >= 15.7 && t < 18.5) {
    const p = back(P(t, 15.7, 16.1)), out = eio(P(t, 18.2, 18.5));
    S(team, { x: 80, y: 330 + (1 - p) * 80, o: P(t, 15.7, 15.8) * (1 - out) });
    qa('[data-r]').forEach((r, i) => { const ta = 15.95 + i * .28, qq = back(P(t, ta, ta + .38)); S(r, { x: (1 - qq) * 50, o: P(t, ta, ta + .1) }); r.style.position = 'relative'; });
  } else hide(team);

  // ---------- F. publié (18.55 à 23.95)
  qa('[data-t]').forEach((el, i) => {
    if (t < 18.55 || t >= 23.95) { hide(el); return; }
    const ta = 19.1 + i * .4, qq = back(P(t, ta, ta + .38)), out = eio(P(t, 23.55, 23.95));
    S(el, { x: 610 + (1 - qq) * 60, y: 400 + i * 128, o: P(t, ta, ta + .1) * (1 - out) });
  });

  // ---------- curseur
  let c = null, click = null;
  if (t >= 9.0 && t < 10.0) { c = curPath(t, [[9.0, 1010, 1080], [9.6, SEND[0] - 8, SEND[1] - 5]]); click = 9.72; }
  else if (t >= 13.5 && t < 15.0) { c = curPath(t, [[13.5, 1010, 1080], [14.2, VAL[0] - 8, VAL[1] - 5]]); click = 14.35; }
  const cur = q('.bn-cur'), ring = q('.bn-ring');
  if (c) { S(cur, { x: c.x, y: c.y, s: t > click - .06 && t < click + .1 ? .9 : 1 }); const rp = P(t, click, click + .4); S(ring, { x: c.x + 8 - 40, y: c.y + 5 - 40, s: .4 + rp, o: rp > 0 && rp < 1 ? 1 - rp : 0 }); }
  else { hide(cur); hide(ring); }
}

// ---------- régie : temps réel → temps des scènes, intro, fond, conclusion
// vitesses par séquence (réel / scène) et temps de pause pour laisser lire avant chaque sortie
const INTRO = 4.0;
const SEG = [[0, 5.6, 1.25], [5.6, 7.35, 1.45], [7.35, 10.12, 1.55], [10.12, 21.35, 1.33], [21.35, 23.95, 1.3]];
const HOLDS = [[4.6, .8], [6.95, .7], [10.62, .35], [11.17, .35], [11.72, .35], [12.72, 1.1], [15.25, .7], [18.05, .9], [21.0, .6], [23.35, .9]];
const MAP = [[INTRO, 0]];
(() => { let r = INTRO, L = 0; const stops = [...new Set([...SEG.flatMap(s => [s[0], s[1]]), ...HOLDS.map(h => h[0])])].sort((a, b) => a - b);
  for (const s of stops) { if (s <= L) { const h = HOLDS.find(h => h[0] === s); if (h && s === L) { r += h[1]; MAP.push([r, L]); } continue; }
    const sp = SEG.find(g => L >= g[0] && L < g[1])[2]; r += (s - L) * sp; L = s; MAP.push([r, L]);
    const h = HOLDS.find(h => h[0] === s); if (h) { r += h[1]; MAP.push([r, L]); } } })();
const OUT = MAP[MAP.length - 1][0] - .2; DUR = OUT + 5.4;
function toLegacy(t) {
  if (t < MAP[0][0] || t >= OUT) return 23.99;
  for (let i = 1; i < MAP.length; i++) if (t < MAP[i][0]) { const [a, la] = MAP[i - 1], [b, lb] = MAP[i]; return la + (t - a) / (b - a) * (lb - la); }
  return 23.99;
}
// fonds : [début en temps réel, couleur]
function fromLegacy(L) { for (let i = 1; i < MAP.length; i++) if (L <= MAP[i][1] && MAP[i][1] > MAP[i - 1][1]) { const [a, la] = MAP[i - 1], [b, lb] = MAP[i]; return a + (L - la) / (lb - la) * (b - a); } return MAP[MAP.length - 1][0]; }
let QX = 640, QY = 600, SEND = [830, 880], VAL = [720, 715]; // mesurés au démarrage
const TR = () => [
  [INTRO, 'iris', '#1a1a1a', QX, QY],
  [fromLegacy(5.6), 'wipe', '#b8a4ff'],
  [fromLegacy(7.35), 'wipe', '#f8f5f2'],
  [fromLegacy(10.12), 'iris', '#ffe0d5', SEND[0], SEND[1]],
  [fromLegacy(13.07), 'wipe', '#dfeee6'],
  [fromLegacy(15.67), 'iris', '#ece6ff', 270, 640],
  [fromLegacy(18.52), 'wipe', '#f8f5f2'],
  [fromLegacy(21.37), 'iris', '#fff1c9', 500, 500],
  [OUT, 'wipe', '#1a1a1a'],
  [DUR, 'wipe', '#ff8a6b'],
];
const wp = () => ST.querySelector('[data-wp]'), iris = () => ST.querySelector('.bn-iris');
function bg(t) {
  const L = TR(); let col = '#ff8a6b'; L.forEach(tr => { if (t >= tr[0] && tr[0] < DUR) col = tr[2]; });
  ST.style.setProperty('--bn-bg', col); ST.style.setProperty('--bn-fg', col === '#1a1a1a' ? '#ffffff' : '#1a1a1a');
  const w = wp(), ir = iris(); w.parentNode.style.visibility = 'hidden'; ir.style.visibility = 'hidden';
  L.forEach(([tb, kind, c, x, y]) => {
    const d = kind === 'wipe' ? .62 : .55; if (t < tb - d || t >= tb) return; const p = eio(P(t, tb - d, tb));
    if (kind === 'wipe') { w.parentNode.style.visibility = 'visible'; w.setAttribute('stroke', c); w.style.strokeDashoffset = 1 - p; }
    else { ir.style.visibility = 'visible'; ir.style.background = c; ir.style.clipPath = `circle(${Math.max(.1, p * 1450)}px at ${x}px ${y}px)`; }
  });
}
function words(el, t, a, step, dur) { el.querySelectorAll('.bx-w>span').forEach((w, j) => { const p = back(P(t, a + j * step, a + j * step + dur)); w.style.transform = `translateY(${(1 - p) * 115}%)`; }); }
function seek(t) {
  t = ((t % DUR) + DUR) % DUR; bg(t); legacy(toLegacy(t));
  // intro : « Pas de service com ? »
  const intro = q('.bn-intro');
  if (t < INTRO) { S(intro, {}); words(intro.querySelector('.bn-big'), t, .3, .2, .7);
    intro.querySelectorAll('.bn-l').forEach((l, i) => { const a = .9 + i * .07, p = back(P(t, a, a + .55)), wob = t > 1.8 ? Math.sin(t * 7 + i * 1.3) * 2.5 : 0;
      l.style.transform = `translateY(${(1 - p) * -140}%) rotate(${(1 - p) * (i % 2 ? 24 : -18) + wob}deg)`; l.style.opacity = P(t, a, a + .1); });
    const qq = back(P(t, 1.55, 1.95)); const qe = intro.querySelector('.bn-q'); qe.style.transform = `scale(${qq}) rotate(${(1 - qq) * -30}deg)`; qe.style.opacity = P(t, 1.55, 1.62);
    const e = eo(P(t, .1, .5)); S(intro.querySelector('.bn-eye'), { y: (1 - e) * 16, o: e }); } else hide(intro);
  // conclusion : logo et signature
  const out = q('.bn-out');
  if (t >= OUT) { const o = t - OUT; S(out, {});
    const lp = back(P(o, .15, .65)); S(q('.bn-logo'), { y: (1 - lp) * 40, s: .9 + .1 * lp, o: P(o, .15, .3) });
    q('[data-l1]').style.strokeDashoffset = 1 - eio(P(o, .4, .95)); q('[data-l2]').style.strokeDashoffset = 1 - eio(P(o, .85, 1.7));
    words(q('.bn-tag'), o, 1.4, .09, .6);
    const u = eo(P(o, 2.3, 2.7)); S(q('.bn-url'), { y: (1 - u) * 14, o: u });
  } else hide(out);
}

// ---------- lecture
function fit() { const w = R.clientWidth; ST.style.transform = `scale(${w / 1000})`; }
new ResizeObserver(fit).observe(R); fit();
let playing = !RM, visible = true, t0 = performance.now(), tPause = 0, raf = 0;
const pp = R.querySelector('.bn-pp');
function frame(now) { raf = 0; if (!playing || !visible || document.hidden) return; seek((now - t0) / 1000); raf = requestAnimationFrame(frame); }
function resume() { if (!raf && playing && visible && !document.hidden) { t0 = performance.now() - tPause * 1000; raf = requestAnimationFrame(frame); } }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; tPause = ((performance.now() - t0) / 1000) % DUR; }
function setPlaying(v) {
  playing = v; R.classList.toggle('paused', !v);
  pp.setAttribute('aria-label', v ? 'Mettre l’animation en pause' : 'Lire l’animation');
  pp.innerHTML = v ? '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>' : '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>';
  v ? resume() : stop();
}
pp.addEventListener('click', () => setPlaying(!playing));
new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? resume() : stop(); }).observe(R);
document.addEventListener('visibilitychange', () => document.hidden ? stop() : resume());
window.__banniere = { seek, DUR, setPlaying };

const start = () => { measure(); if (RM) { tPause = fromLegacy(20.6); seek(tPause); setPlaying(false); } else { seek(0); setPlaying(true); } };
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  const im = new Image(); im.onload = im.onerror = start; im.src = './assets/img/ev-asso-s.webp';
});
})();
