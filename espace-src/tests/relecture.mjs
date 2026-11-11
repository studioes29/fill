// Contrôle de la page de relecture par lien (../espace/relecture/) dans un vrai navigateur, à 390 et 1280 px.
// La fonction serveur est simulée : la page est testée telle qu'elle sera publiée, CSP comprise.
//
//   npm i --no-save playwright-core axe-core && node tests/relecture.mjs        (CHROME=/chemin/vers/chrome si besoin)
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
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png' };
const serveur = createServer((req, res) => {
  let chemin = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (chemin.endsWith('/')) chemin += 'index.html';
  const f = join(racine, chemin);
  if (!f.startsWith(racine) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${serveur.address().port}/espace/relecture/`;
const JETON = 'A'.repeat(43);

let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.message.split('\n').slice(0, 14).join('\n     ')}`); process.exitCode = 1; } };
const nav = await chromium.launch({ executablePath: process.env.CHROME ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] });

// ouvre la page ; « api » simule la fonction serveur et reçoit le corps de chaque requête
const ouvrir = async (adresse, { largeur = 390, api } = {}) => {
  const ctx = await nav.newContext({ viewport: { width: largeur, height: 844 }, deviceScaleFactor: 2, bypassCSP: false });
  await ctx.addInitScript({ content: axe });
  const page = await ctx.newPage();
  const erreurs = [], appels = [];
  page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()));
  page.on('pageerror', (e) => erreurs.push(String(e)));
  await page.route('https://nfnbseonwgmtouxsaajd.supabase.co/**', async (route) => {
    const corps = route.request().postDataJSON();
    appels.push(corps);
    const r = api ? await api(corps) : { status: 404, body: { etat: 'inconnu' } };
    await route.fulfill({ status: r.status ?? 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(r.body) });
  });
  await page.goto(adresse);
  await page.waitForSelector('h1, .etat');
  return { page, ctx, erreurs, appels };
};
// axe est chargé par le navigateur avant la page (hors CSP) ; un contrôle qui ne tourne pas est un échec
const accessibilite = (page) =>
  page.evaluate(async () => {
    if (!window.axe) return ['axe absent : le contrôle n’a pas tourné'];
    return (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] })).violations.map((v) => `${v.id} : ${v.nodes.length} élément(s), ${v.nodes[0].target}`);
  });
const vue = (usage = 'referent', plus = {}) => ({
  etat: 'ouvert', usage, nom: 'Yann Le Gall', demandeur: 'Yann Le Gall', organisation: 'Commune de Saint-Ivenec', cible: 'c', expire: '2026-11-18T10:00:00Z', espace: 'https://fill.studioes.fr/espace',
  demande: { titre: 'Newsletter de décembre', parution: '2026-12-01', heure: null, corrections_restantes: 2 },
  version: { numero: 2, note: null, date: '2026-11-11', fichiers: [{ type: 'web', nom: 'article', contenu: { titre: '<img src=x onerror=alert(1)>Titre', chapo: 'Chapo', corps: ['Un paragraphe.'] } }, { nom: 'bulletin.pdf', src: 'https://nfnbseonwgmtouxsaajd.supabase.co/storage/v1/x.pdf' }] },
  invitations: [], ...plus,
});

for (const largeur of [390, 1280]) {
  await test(`démonstration à ${largeur} px : la version s'affiche, sans erreur ni défaut d'accessibilité`, async () => {
    const { page, ctx, erreurs, appels } = await ouvrir(`${base}?demo`, { largeur });
    assert.equal(await page.textContent('h1'), 'Forum des associations : annonce');
    assert.equal(await page.evaluate(() => /\bnull\b|undefined/.test(document.body.innerText)), false, 'un « null » ou « undefined » est affiché');
    assert.equal(await page.locator('.livrable').count(), 2);
    assert.equal(await page.locator('.barre .bt').count(), 2);
    assert.deepEqual(await page.evaluate(() => [...document.querySelector('main').children].map((e) => e.className || e.tagName.toLowerCase())), ['h1', 'reperes', 'mot', 'livrables', 'autres']);
    await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'la page déborde en largeur');
    await page.screenshot({ path: join(captures, `relecture-${largeur}.png`), fullPage: false });
    assert.deepEqual(await accessibilite(page), []);
    assert.deepEqual(erreurs, []);
    assert.equal(appels.length, 0, 'la démonstration ne doit rien envoyer');
    await ctx.close();
  });
}

await test('valider demande une confirmation, puis envoie « accord » avec le jeton, en POST', async () => {
  const { page, ctx, appels, erreurs } = await ouvrir(`${base}#j=${JETON}`, { api: (c) => (c.action === 'lire' ? { body: vue() } : { body: { ok: true, decision: true, statut: 'validee', usage: 'referent' } }) });
  assert.equal(await page.textContent('h1'), 'Newsletter de décembre');
  await page.getByRole('button', { name: 'D’accord' }).click();
  assert.equal(appels.length, 1, 'un seul toucher ne doit rien décider');
  assert.deepEqual(await accessibilite(page), []);
  assert.match(await page.textContent('.barre .question'), /Valider les 2 contenus de cette version/);
  await page.getByRole('button', { name: 'Oui, valider' }).click();
  await page.waitForSelector('.etat.fait');
  assert.deepEqual(appels[1], { action: 'repondre', reponse: 'accord', remarque: null, j: JETON });
  assert.match(await page.textContent('.etat h2'), /Version validée/);
  assert.equal(await page.locator('.barre').count(), 0);
  assert.deepEqual(erreurs, []);
  await page.screenshot({ path: join(captures, 'relecture-validee.png') });
  await ctx.close();
});

await test('un texte venu de la base n’est jamais interprété comme du HTML', async () => {
  const { page, ctx } = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ body: vue() }) });
  assert.equal(await page.textContent('.livrable h3'), '<img src=x onerror=alert(1)>Titre');
  assert.equal(await page.locator('.livrable h3 img').count(), 0);
  // plusieurs contenus : un volet par contenu, le premier ouvert
  assert.deepEqual(await page.locator('details.livrable').evaluateAll((l) => l.map((x) => x.open)), [true, false]);
  await page.locator('details.livrable summary').nth(1).click();
  assert.equal(await page.getByRole('link', { name: 'Ouvrir le document' }).getAttribute('rel'), 'noopener');
  await ctx.close();
});

await test('une correction exige une remarque ; le refus du serveur s’affiche et la saisie reste', async () => {
  let n = 0;
  const { page, ctx, appels } = await ouvrir(`${base}#j=${JETON}`, { api: (c) => (c.action === 'lire' ? { body: vue() } : ++n === 1 ? { status: 409, body: { erreur: 'Cette version n’attend plus de réponse' } } : { body: { ok: true, decision: true, statut: 'correction', usage: 'referent' } }) });
  await page.getByRole('button', { name: 'À corriger' }).click();
  await page.getByRole('button', { name: 'Envoyer' }).click();
  assert.match(await page.textContent('.barre .erreur'), /Indiquez ce qui est à corriger/);
  assert.equal(appels.length, 1);
  await page.getByLabel('Ce qui est à corriger').fill('La date est le 12, pas le 13.');
  assert.deepEqual(await accessibilite(page), []);
  await page.screenshot({ path: join(captures, 'relecture-correction.png') });
  await page.getByRole('button', { name: 'Envoyer' }).click();
  await page.waitForFunction(() => /n’attend plus/.test(document.querySelector('.barre .erreur')?.textContent ?? ''));
  assert.equal(await page.getByLabel('Ce qui est à corriger').inputValue(), 'La date est le 12, pas le 13.');
  await page.getByRole('button', { name: 'Envoyer' }).click();
  await page.waitForSelector('.etat.fait');
  assert.match(await page.textContent('.etat h2'), /Corrections transmises/);
  assert.equal(appels[2].remarque, 'La date est le 12, pas le 13.');
  await ctx.close();
});

await test('un avis part sans confirmation et n’annonce aucune décision', async () => {
  const { page, ctx, appels } = await ouvrir(`${base}#j=${JETON}`, { api: (c) => (c.action === 'lire' ? { body: vue('avis', { nom: 'Anne Kerbrat' }) } : { body: { ok: true, decision: false, statut: 'a_valider', usage: 'avis' } }) });
  assert.match(await page.textContent('.contexte'), /Yann Le Gall vous demande votre avis/);
  assert.equal(await page.locator('article.livrable, details.livrable').count(), 2);
  assert.equal(await page.locator('.autres').count(), 0, 'seul le référent peut inviter');
  await page.getByRole('button', { name: 'D’accord' }).click();
  await page.waitForSelector('.etat.fait');
  assert.match(await page.textContent('.etat h2'), /Avis transmis/);
  assert.equal(appels.length, 2);
  await ctx.close();
});

await test('le référent fait relire : saisie contrôlée, invitation ajoutée, puis retirée', async () => {
  const { page, ctx, appels } = await ouvrir(`${base}#j=${JETON}`, { api: (c) => (c.action === 'lire' ? { body: vue() } : c.action === 'inviter' ? { body: { ok: true, lien: 'l1', nom: 'Anne Kerbrat', usage: c.usage } } : { body: { ok: true } }) });
  await page.locator('.autres summary').click();
  await page.getByRole('button', { name: 'Envoyer le lien' }).click();
  assert.match(await page.textContent('.autres .erreur'), /nom/);
  await page.getByLabel('Nom').fill('Anne Kerbrat');
  await page.getByLabel('Adresse e-mail').fill('anne@');
  await page.getByRole('button', { name: 'Envoyer le lien' }).click();
  assert.match(await page.textContent('.autres .erreur'), /adresse/);
  await page.getByLabel('Adresse e-mail').fill('anne@exemple.fr');
  await page.getByLabel(/Pour validation/).check();
  assert.deepEqual(await accessibilite(page), []);
  await page.getByRole('button', { name: 'Envoyer le lien' }).click();
  await page.waitForSelector('.invite');
  assert.deepEqual(appels[1], { action: 'inviter', usage: 'delegation', nom: 'Anne Kerbrat', email: 'anne@exemple.fr', j: JETON });
  assert.match(await page.textContent('.invite'), /Anne Kerbrat.*En attente.*Validation confiée/s);
  await page.screenshot({ path: join(captures, 'relecture-invitation.png'), fullPage: true });
  await page.getByRole('button', { name: /Retirer l’invitation de Anne Kerbrat/ }).click();
  await page.waitForFunction(() => !document.querySelector('.invite'));
  assert.deepEqual(appels[2], { action: 'retirer', lien: 'l1', j: JETON });
  await ctx.close();
});

await test('liens fermés : chaque état s’explique en clair et ne propose aucune réponse', async () => {
  const cas = { inconnu: /n’est pas valide/, expire: /a expiré/, repondu: /réponse est enregistrée/, depasse: /n’attend plus de réponse/, revoque: /a été retiré/ };
  for (const [etat, attendu] of Object.entries(cas)) {
    const { page, ctx } = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ status: etat === 'inconnu' ? 404 : 200, body: etat === 'inconnu' ? { etat } : { ...vue(), etat, reponse: 'accord', version: null, demande: { titre: 'Newsletter de décembre' } } }) });
    assert.match(await page.textContent('.etat h2'), attendu, etat);
    assert.equal(await page.locator('.barre').count(), 0, `${etat} : pas de barre de réponse`);
    assert.deepEqual(await accessibilite(page), [], etat);
    await ctx.close();
  }
});

await test('sans jeton, rien n’est demandé au serveur ; une panne réseau propose de réessayer', async () => {
  const a = await ouvrir(base);
  assert.match(await a.page.textContent('.etat h2'), /n’est pas valide/);
  assert.equal(a.appels.length, 0);
  await a.ctx.close();
  const b = await ouvrir(`${base}#j=${JETON}`, { api: () => ({ status: 500, body: {} }) });
  assert.match(await b.page.textContent('.etat h2'), /Connexion impossible/);
  assert.equal(await b.page.getByRole('button', { name: 'Réessayer' }).count(), 1);
  await b.ctx.close();
});

await nav.close();
serveur.close();
console.log(`\n${passes} contrôles passés${process.exitCode ? ', des échecs ci-dessus' : ''}`);
