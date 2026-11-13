// Contrôle de la page de bilan par lien (../espace/bilan/) dans un vrai navigateur, à 390 et 1280 px, et du lien
// « Lancer » qui ouvre la nouvelle demande pré-remplie dans l'Espace (src/routeur.js).
// La fonction serveur est simulée : la page est testée telle qu'elle sera publiée, CSP comprise.
//
//   npm i --no-save playwright-core axe-core && node tests/bilan.mjs        (CHROME=/chemin/vers/chrome si besoin)
//
// Les captures vont dans tests/.captures/ (ignoré par git).
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, '..', '..');
const captures = join(ici, '.captures');
mkdirSync(captures, { recursive: true });
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const serveur = createServer((req, res) => {
  let chemin = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (chemin.endsWith('/')) chemin += 'index.html';
  const f = join(racine, chemin);
  if (!f.startsWith(racine) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const origine = `http://localhost:${serveur.address().port}`;
const base = `${origine}/espace/bilan/`;
const JETON = 'A'.repeat(43);

let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.message.split('\n').slice(0, 14).join('\n     ')}`); process.exitCode = 1; } };
const nav = await chromium.launch({ executablePath: process.env.CHROME ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] });

// ouvre la page ; « api » simule la fonction serveur et reçoit le corps de chaque requête.
// « maintenant » fixe la date du navigateur (les minuteries tournent) : les données d'essai sont de novembre 2026.
const ouvrir = async (adresse, { largeur = 390, api, attendre = 'h1, .etat', maintenant = '2026-11-12T09:00:00+01:00' } = {}) => {
  const ctx = await nav.newContext({ viewport: { width: largeur, height: 844 }, deviceScaleFactor: 2, bypassCSP: false, timezoneId: 'Europe/Paris' });
  if (maintenant) await ctx.clock.setFixedTime(new Date(maintenant));
  await ctx.addInitScript({ content: axe });
  const page = await ctx.newPage();
  const erreurs = [], appels = [];
  page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()));
  page.on('pageerror', (e) => erreurs.push(String(e)));
  await page.route('https://nfnbseonwgmtouxsaajd.supabase.co/**', async (route) => {
    const corps = route.request().postDataJSON();
    appels.push({ ...corps, methode: route.request().method(), adresse: route.request().url() });
    const r = api ? await api(corps) : { status: 404, body: { etat: 'inconnu' } };
    await route.fulfill({ status: r.status ?? 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(r.body) });
  });
  await page.goto(adresse);
  await page.waitForSelector(attendre);
  return { page, ctx, erreurs, appels };
};
// axe est chargé par le navigateur avant la page (hors CSP) ; un contrôle qui ne tourne pas est un échec
const accessibilite = (page) =>
  page.evaluate(async () => {
    if (!window.axe) return ['axe absent : le contrôle n’a pas tourné'];
    return (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] })).violations.map((v) => `${v.id} : ${v.nodes.length} élément(s), ${v.nodes[0].target}`);
  });
const sansDefaut = (page) => page.evaluate(() => ({
  parasite: /\bnull\b|undefined|NaN|[—–]/.test(document.body.innerText),
  deborde: document.documentElement.scrollWidth > window.innerWidth,
}));

const donnees = (plus = {}) => ({
  organisation: { nom: 'Commune de Saint-Ivenec', type: 'collectivite', formule: 'essentiel' }, periode: '2026-10', debut: '2026-10-12', fin: '2026-11-11',
  demandes_livrees: 2, unites: { quota: 10, report: 3, ajustements: 0, total: 13, utilisees: 8, reservees: 0, reportees: 3, expirees: 2 },
  delais: { a_la_date: 1, total: 2, sans_date: 0, validations: 2, validation_jours: 1.5 },
  livrables: [{ prestation: 'post', nom: 'Publication réseaux sociaux', quantite: 3 }, { prestation: 'affiche', nom: 'Affiche en création', quantite: 1 }],
  livre: [
    { numero: 7, titre: '<img src=x onerror=alert(1)>Forum', date: '2026-10-21', unites: 3, annoncee: '2026-10-20', remise: '2026-10-19', retard_jours: 0, lignes: [{ nom: 'Publication réseaux sociaux', quantite: 3 }] },
    { numero: 8, titre: 'Affiche du marché d’automne', date: '2026-10-23', unites: 4, annoncee: '2026-10-20', remise: '2026-10-22', retard_jours: 2, lignes: [{ nom: 'Affiche en création', quantite: 1 }] },
  ],
  en_cours: [],
  suivante: { periode: '2026-11', debut: '2026-11-12', fin: '2026-12-11', creditee: true, en_attente: 0, disponible: 13, report: 3 },
  suggestions: [
    { cle: 'c-2026-11-28-aff', source: 'calendrier', titre: 'Téléthon & marché', date: '2026-11-28', qte: { affiche: 1, post: 2 }, libelle: 'Affiche et deux publications', unites: 6, limite: '2026-11-19', pourquoi: 'Repère du calendrier type : autour du 28 novembre.' },
    { cle: 'h-12', source: 'historique', titre: 'Portrait du nouveau boulanger', date: null, qte: { post: 1 }, libelle: 'Publication réseaux sociaux', unites: 1, limite: null, pourquoi: 'Vous l’aviez demandé l’an passé à la même période.' },
  ],
  ...plus,
});
const vue = (plus = {}, d = {}) => ({ etat: 'ouvert', mode: 'partage', calcule_le: '2026-11-12T08:10:00+00:00', espace: 'https://fill.studioes.fr/espace', donnees: donnees(d), ...plus });
const relecture = (plus = {}) => vue({ mode: 'relecture', referent: 'Yann Le Gall', envoye_le: null, ...plus });

const textes = (page, sel) => page.locator(sel).evaluateAll((l) => l.map((e) => e.innerText.replace(/\s+/g, ' ').trim()));

for (const largeur of [390, 1280]) {
  await test(`démonstration à ${largeur} px : le bilan se lit comme une lettre, sans erreur ni défaut d'accessibilité, sans rien envoyer`, async () => {
    const { page, ctx, erreurs, appels } = await ouvrir(`${base}?demo`, { largeur });
    assert.equal(await page.textContent('h1'), 'Votre mois avec Fill');
    assert.match(await page.textContent('.une .voix'), /^du \d+ \S+ au \d+ \S+ \d{4}$/);
    assert.equal(await page.textContent('#client'), 'Commune de Saint-Ivenec');
    assert.deepEqual(await textes(page, 'main > section h2'), ['Le mois en calendrier', 'Ce qui a été produit', 'Vos unités', 'Pour la période qui commence']);
    assert.equal(await page.textContent('.tete-c'), '5demandes livrées');
    assert.equal(await page.locator('.grille .fait').count(), 4, 'quatre jours livrés, dont un avec deux livraisons');
    assert.equal(await page.locator('.livre').count(), 5);
    assert.equal(await page.locator('.livre .retard').count(), 1, 'le retard de Fill apparaît');
    assert.equal(await page.locator('.idee').count(), 3);
    assert.equal(await page.getByRole('link', { name: /^Lancer / }).count(), 3);
    assert.deepEqual(await sansDefaut(page), { parasite: false, deborde: false });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: join(captures, `bilan-${largeur}.png`), fullPage: true });
    assert.deepEqual(await accessibilite(page), []);
    assert.deepEqual(erreurs, []);
    assert.equal(appels.length, 0, 'la démonstration ne doit rien envoyer');
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, nofollow');
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('*')].some((e) => /tabular-nums/.test(getComputedStyle(e).fontVariantNumeric))), false, 'pas de chiffres tabulaires');
    // logo en deux couleurs : « fi » à l'encre, premier « l » lavande, second « l » corail
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('.marque svg [fill="#1a1a1a"], .marque svg [stroke]')].map((e) => e.getAttribute('stroke') ?? e.getAttribute('fill'))), ['#1a1a1a', '#b8a4ff', '#ff8a6b']);
    // le monogramme en filigrane est bien dessiné (masque chargé)
    assert.match(await page.evaluate(() => getComputedStyle(document.querySelector('.une .motif')).maskImage || getComputedStyle(document.querySelector('.une .motif')).webkitMaskImage), /ll\.svg/);
    await ctx.close();
  });
}

await test('lien de partage : le jeton part en POST, dans le corps ; chiffres, calendrier, production, unités et suite s’affichent', async () => {
  const { page, ctx, appels, erreurs } = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue() }) });
  assert.deepEqual(appels.map((a) => [a.methode, a.action, a.j, a.r, /A{43}/.test(a.adresse)]), [['POST', 'lire', JETON, undefined, false]]);
  assert.equal(await page.title(), 'Votre mois avec Fill, du 12 octobre au 11 novembre 2026');
  assert.equal(await page.textContent('.une .voix'), 'du 12 octobre au 11 novembre 2026');
  assert.deepEqual(await textes(page, '.une .tete-c, .cotes li, .pied-une'), ['2 demandes livrées', '8 sur 13 unités utilisées', '1 sur 2 livrées à la date annoncée', 'Vous validez en 1,5 jour ouvré en moyenne.']);
  // le calendrier couvre la période, du lundi de sa première semaine au dimanche de la dernière
  assert.equal(await page.locator('.grille .j').count(), 35);
  assert.deepEqual(await textes(page, '.grille .j:not(.hors)'), Array.from({ length: 31 }, (_, i) => { const d = new Date(Date.UTC(2026, 9, 12 + i)); return `${d.getUTCDate() === 1 || i === 0 ? (d.getUTCMonth() === 9 ? 'oct. ' : 'nov. ') : ''}${d.getUTCDate()}`; }));
  assert.deepEqual(await page.locator('.grille .fait').evaluateAll((l) => l.map((b) => b.getAttribute('aria-label'))), ['21 octobre : <img src=x onerror=alert(1)>Forum', '23 octobre : Affiche du marché d’automne']);
  assert.deepEqual(await textes(page, '.livre'), ['21 oct. <img src=x onerror=alert(1)>Forum 3 publications', '23 oct. Affiche du marché d’automne 1 affiche Version remise 2 jours ouvrés après la date annoncée (20 octobre)']);
  assert.deepEqual(await textes(page, '.tuiles li'), ['3 publications', '1 affiche']);
  assert.deepEqual(await textes(page, '.legende li'), ['8 utilisées', '3 reportées', '2 expirées']);
  assert.equal(await page.locator('.barre-u i').count(), 3);
  assert.equal(await page.textContent('.un .note'), 'Sur 13 unités : 10 de votre formule, 3 reportées de la période précédente. Les reportées sont à utiliser avant le 11 décembre. Les expirées venaient du report de la période précédente.');
  assert.equal(await page.textContent('.suite .voix'), 'du 12 novembre au 11 décembre 2026');
  assert.equal(await page.textContent('.suite .solde'), 'Vous disposez de 13 unités, dont 3 reportées à utiliser avant le 11 décembre.');
  assert.deepEqual(await textes(page, '.idee .feuillet'), ['nov. 28', 'date libre']);
  assert.deepEqual(await textes(page, '.idee .corps > p:first-of-type'), ['Affiche et deux publications, 6 unités.', 'Publication réseaux sociaux, 1 unité. Vous l’aviez demandé l’an passé à la même période.']);
  assert.match(await page.textContent('.pied'), /Bilan établi le 12 novembre 2026, à partir de votre espace Fill\. Cette page s’ouvre sans compte/);
  assert.equal(await page.locator('.apercu, .barre, .garder, button:not(.fait)').count(), 0, 'un lien de partage ne propose aucune action de relecture');
  assert.deepEqual(await sansDefaut(page), { parasite: false, deborde: false });
  assert.deepEqual(await accessibilite(page), []);
  assert.deepEqual(erreurs, []);
  await ctx.close();
});

await test('calendrier : toucher un jour met sa livraison en avant ; le toucher encore la relâche', async () => {
  const { page, ctx } = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue() }) });
  const jour = page.getByRole('button', { name: /^23 octobre/ });
  await jour.click();
  assert.equal(await jour.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(await page.locator('.livre.choisi h3').allTextContents(), ['Affiche du marché d’automne']);
  await page.getByRole('button', { name: /^21 octobre/ }).click();
  assert.equal(await jour.getAttribute('aria-pressed'), 'false');
  assert.deepEqual(await page.locator('.livre.choisi h3').allTextContents(), ['<img src=x onerror=alert(1)>Forum']);
  await page.getByRole('button', { name: /^21 octobre/ }).click();
  assert.equal(await page.locator('.livre.choisi').count(), 0);
  // deux livraisons le même jour : un seul jour marqué, avec leur nombre
  const b = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue({}, { livre: [...donnees().livre, { ...donnees().livre[1], titre: 'Marché : publication', lignes: [{ prestation: 'post', nom: 'Publication réseaux sociaux', quantite: 1 }] }] }) }) });
  assert.deepEqual(await textes(b.page, '.grille .fait i'), ['2']);
  await b.page.getByRole('button', { name: '23 octobre : Affiche du marché d’automne, Marché : publication' }).click();
  assert.equal(await b.page.locator('.livre.choisi').count(), 2);
  assert.deepEqual(await accessibilite(b.page), []);
  await b.ctx.close();
  await ctx.close();
});

await test('un texte venu de la base n’est jamais interprété comme du HTML ; « Lancer » mène à la demande pré-remplie de l’Espace', async () => {
  const { page, ctx } = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue({ espace: 'https://exemple.invalid' }) }) });
  assert.equal(await page.textContent('.livre h3'), '<img src=x onerror=alert(1)>Forum');
  assert.equal(await page.locator('.livre h3 img, .grille img').count(), 0);
  const liens = await page.locator('.idee a.bt').evaluateAll((l) => l.map((a) => a.href));
  assert.deepEqual(liens, [
    `${origine}/espace/#nouvelle?titre=T%C3%A9l%C3%A9thon%20%26%20march%C3%A9&parution=2026-11-28&qte=affiche:1,post:2`,
    `${origine}/espace/#nouvelle?titre=Portrait%20du%20nouveau%20boulanger&qte=post:1`,
  ], 'le lien ne dépend pas de l’adresse renvoyée par le serveur');
  assert.equal(await page.getByRole('link', { name: 'Lancer Téléthon & marché' }).count(), 1);
  await ctx.close();
});

await test('cas limites : rien de livré, pas de période suivante, une entreprise, les singuliers', async () => {
  const vide = { demandes_livrees: 0, livre: [], livrables: [], delais: { a_la_date: 0, total: 0, sans_date: 0, validations: 0, validation_jours: null }, unites: { quota: 10, report: 0, ajustements: 0, total: 10, utilisees: 0, reservees: 0, reportees: 1, expirees: 0 }, suivante: null, suggestions: [], organisation: { nom: 'Menuiserie Kerbrat', type: 'entreprise', formule: 'regulier' } };
  const { page, ctx, erreurs } = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue({}, vide) }) });
  assert.deepEqual(await textes(page, '.une .tete-c, .cotes li'), ['0 demande livrée', '0 sur 10 unité utilisée']);
  assert.equal(await page.locator('.pied-une').count(), 0);
  assert.equal(await page.textContent('.vide'), 'Aucune demande n’a été livrée sur cette période.');
  assert.equal(await page.locator('.suite, .prod, .grille').count(), 0);
  assert.deepEqual(await textes(page, '.legende li'), ['1 reportée']);
  assert.equal(await page.evaluate(() => document.documentElement.dataset.cible), 'e');
  assert.deepEqual(await sansDefaut(page), { parasite: false, deborde: false });
  assert.deepEqual(await accessibilite(page), []);
  assert.deepEqual(erreurs, []);
  await page.screenshot({ path: join(captures, 'bilan-entreprise-vide.png'), fullPage: true });
  await ctx.close();
  // unités pas encore créditées (entreprise en attente de règlement) : aucune suggestion, et la page le dit
  const b = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue({}, { suivante: { periode: '2026-11', debut: '2026-11-12', fin: '2026-12-11', creditee: false, en_attente: 0, disponible: 0, report: 0 }, suggestions: [], en_cours: [{ titre: 'Agenda de novembre', statut: 'production', livraison: '2026-11-13' }, { titre: 'Bulletin', statut: 'confirmee', livraison: null }] }) }) });
  assert.equal(await b.page.textContent('.suite h2'), 'La période qui commence');
  assert.equal(await b.page.textContent('.suite .solde'), 'Les unités de cette période seront créditées dès son règlement.');
  assert.equal(await b.page.textContent('.encours'), 'En cours : Agenda de novembre (version le 13 novembre), Bulletin.');
  assert.deepEqual(await sansDefaut(b.page), { parasite: false, deborde: false });
  assert.deepEqual(await accessibilite(b.page), []);
  await b.ctx.close();
  // report seul en attendant le règlement ; tout est engagé ; une suggestion dont le délai est passé ne se lance plus
  const s = (plus) => ({ periode: '2026-11', debut: '2026-11-12', fin: '2026-12-11', creditee: true, en_attente: 0, disponible: 13, report: 3, ...plus });
  const c = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue({}, { suivante: s({ creditee: false, disponible: 1, report: 1 }), suggestions: [donnees().suggestions[1]] }) }) });
  assert.equal(await c.page.textContent('.suite .solde'), 'Vous disposez de 1 unité, dont 1 reportée à utiliser avant le 11 décembre. Les unités de votre formule s’y ajoutent dès le règlement de la période.');
  await c.ctx.close();
  const d = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue({}, { suivante: s({ disponible: 0, report: 0 }), suggestions: [] }) }) });
  assert.equal(await d.page.textContent('.suite .solde'), 'Les unités de cette période sont déjà engagées.');
  await d.ctx.close();
  const e = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue() }), maintenant: '2026-11-20T09:00:00+01:00' });
  assert.equal(await e.page.locator('.idee a.bt').count(), 1, 'seule la suggestion sans date limite se lance encore');
  assert.equal(await e.page.textContent('.idee .limite'), 'Le délai de ce sujet est passé : il était à déposer avant le jeudi 19 novembre.');
  assert.deepEqual(await accessibilite(e.page), []);
  await e.ctx.close();
});

await test('aperçu de Fill (lien ouvert depuis Hors-champ) : le bilan tel que le client le recevra, sans aucune action', async () => {
  const { page, ctx, appels, erreurs } = await ouvrir(`${base}#r=${JETON}`, { api: () => ({ body: relecture() }) });
  assert.deepEqual([appels.length, appels[0].action, appels[0].r, appels[0].j], [1, 'lire', JETON, undefined]);
  assert.equal(await page.textContent('.apercu'), 'Aperçu avant envoi Il part à Yann Le Gall dès que vous le validez dans Hors-champ.');
  assert.equal(await page.locator('.idee a.bt').count(), 2, 'les suggestions se présentent comme chez le client');
  assert.equal(await page.locator('.barre, .garder, button:not(.fait)').count(), 0);
  assert.deepEqual(await accessibilite(page), []);
  await page.screenshot({ path: join(captures, 'bilan-apercu.png'), fullPage: true });
  assert.deepEqual(erreurs, []);
  await ctx.close();
  const b = await ouvrir(`${base}#r=${JETON}`, { api: () => ({ body: relecture({ envoye_le: '2026-11-12T09:00:00+00:00' }) }) });
  assert.equal(await b.page.textContent('.apercu'), 'Bilan envoyé Il est parti le 12 novembre à Yann Le Gall.');
  await b.ctx.close();
});

await test('liens fermés : chaque état s’explique en clair ; sans jeton, rien n’est demandé au serveur ; une panne propose de réessayer', async () => {
  for (const [etat, attendu] of [['inconnu', /n’est pas valide/], ['revoque', /a été retiré/]]) {
    const { page, ctx } = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ status: etat === 'inconnu' ? 404 : 200, body: { etat } }) });
    assert.match(await page.textContent('.etat h2'), attendu, etat);
    assert.equal(await page.locator('.une, .module, .idee').count(), 0);
    assert.deepEqual(await accessibilite(page), [], etat);
    await ctx.close();
  }
  const a = await ouvrir(base);
  assert.match(await a.page.textContent('.etat h2'), /n’est pas valide/);
  assert.equal(a.appels.length, 0);
  await a.ctx.close();
  const b = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ status: 500, body: {} }) });
  assert.match(await b.page.textContent('.etat h2'), /Connexion impossible/);
  assert.equal(await b.page.getByRole('button', { name: 'Réessayer' }).count(), 1);
  await b.ctx.close();
});

// ---------- l'Espace lit le lien « Lancer » : nouvelle demande pré-remplie (démonstration, src/routeur.js)

await test('Espace : « Lancer » ouvre la nouvelle demande pré-remplie (titre, prestations, parution), puis l’adresse redevient #nouvelle', async () => {
  const lien = `${origine}/espace/?demo#nouvelle?titre=T%C3%A9l%C3%A9thon%20%26%20march%C3%A9&parution=2027-11-28&qte=affiche:1,post:2,inconnue:4,actu:0`;
  const { page, ctx, erreurs } = await ouvrir(lien, { largeur: 1280, attendre: 'input, textarea', maintenant: null });
  await page.waitForFunction(() => [...document.querySelectorAll('input')].some((i) => i.value === 'Téléthon & marché'));
  assert.equal(await page.evaluate(() => location.hash), '#nouvelle');
  const texte = await page.evaluate(() => document.body.innerText);
  assert.match(texte, /Création, fichier prêt à imprimer et version écran/);
  assert.equal(await page.evaluate(() => [...document.querySelectorAll('input')].some((i) => i.value === '2027-11-28' || /28\/11\/2027/.test(i.value)) || /28 novembre/.test(document.body.innerText)), true, 'la date de parution est reprise');
  // la visite de bienvenue de la démonstration passe devant le formulaire : on la ferme pour la capture
  const passer = page.getByRole('button', { name: 'Passer la visite' });
  if (await passer.count()) { await passer.click(); await page.waitForTimeout(600); }
  await page.screenshot({ path: join(captures, 'bilan-lancer-espace.png') });
  assert.deepEqual(erreurs, []);
  await ctx.close();
  // un lien incomplet ou trafiqué ne pré-remplit rien et ne casse rien
  for (const mauvais of ['#nouvelle?titre=&qte=post:1', '#nouvelle?titre=Sujet&qte=inconnue:3', '#nouvelle?titre=%3Cscript%3Ealert(1)%3C/script%3E&qte=post:999']) {
    const b = await ouvrir(`${origine}/espace/?demo${mauvais}`, { largeur: 1280, attendre: 'input, textarea', maintenant: null });
    assert.equal(await b.page.evaluate(() => location.hash), '#nouvelle');
    assert.equal(await b.page.evaluate(() => [...document.querySelectorAll('input')].some((i) => i.value === 'Sujet')), false);
    assert.equal(await b.page.locator('script:not([src])').count(), 0);
    assert.deepEqual(b.erreurs, []);
    await b.ctx.close();
  }
});

await test('depuis la page de bilan en démonstration, « Lancer » arrive dans l’Espace de démonstration, demande pré-remplie', async () => {
  const { page, ctx } = await ouvrir(`${base}?demo`, { largeur: 390, maintenant: null });
  const titre = await page.textContent('.idee h3');
  await page.locator('.idee a.bt').first().click();
  await page.waitForFunction((t) => [...document.querySelectorAll('input')].some((i) => i.value === t), titre);
  assert.match(page.url(), /\/espace\/\?demo#nouvelle$/);
  await page.screenshot({ path: join(captures, 'bilan-lancer-390.png') });
  await ctx.close();
});

await nav.close();
serveur.close();
console.log(`\n${passes} contrôles passés${process.exitCode ? ', des échecs ci-dessus' : ''}`);
