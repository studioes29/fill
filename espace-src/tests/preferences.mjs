// Contrôle de « Vos e-mails » (src/preferences.js) dans un vrai navigateur, en démonstration :
// présence dans le menu Équipe pour un compte client, bascule gardée, accessibilité (axe), rendu téléphone et ordinateur.
//
//   npm i --no-save playwright@1.63.0 axe-core && node tests/preferences.mjs
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const requerir = createRequire(import.meta.url);
const { chromium } = (() => { try { return requerir('playwright'); } catch { return requerir('playwright-core'); } })();
const axe = readFileSync(requerir.resolve('axe-core/axe.min.js'), 'utf8');
const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, '..', '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.json': 'application/json' };
const serveur = createServer((req, res) => {
  let chemin = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (chemin.endsWith('/')) chemin += 'index.html';
  const f = join(racine, chemin);
  if (!f.startsWith(racine) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const url = `http://localhost:${serveur.address().port}/espace/?demo#equipe`;
const sortie = process.env.CAPTURES ?? '/tmp';

let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.message.split('\n').slice(0, 8).join('\n     ')}`); process.exitCode = 1; } };

const navigateur = await chromium.launch({ executablePath: existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined, args: ['--no-sandbox'] });
for (const [largeur, hauteur] of [[390, 844], [1440, 900]]) {
  const ctx = await navigateur.newContext({ viewport: { width: largeur, height: hauteur } });
  await ctx.addInitScript({ content: axe });             // axe chargé hors CSP, avant la page
  const page = await ctx.newPage();
  const passerVisite = async () => { const v = page.getByRole('button', { name: 'Passer la visite' }); if (await v.count()) await v.first().click(); };
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(String(e)));
  await page.goto(url);
  await test(`${largeur} px : le bloc apparaît sous l'équipe`, async () => {
    await page.waitForSelector('#fill-prefs', { timeout: 15000 });
    await page.waitForTimeout(400); await passerVisite();
    const ordre = await page.evaluate(() => [...document.querySelectorAll('.feuille .w.entre > *')].map((x) => x.id || x.className));
    assert.equal(ordre[1], 'fill-prefs', JSON.stringify(ordre));
  });
  await test(`${largeur} px : interrupteur actif par défaut, puis coupé et gardé`, async () => {
    const b = page.locator('#fill-prefs button[role=switch]');
    await page.waitForFunction(() => !document.querySelector('#fill-prefs button').disabled);
    assert.equal(await b.getAttribute('aria-checked'), 'true');
    await b.click();
    await page.waitForFunction(() => document.querySelector('#fill-prefs button').getAttribute('aria-checked') === 'false');
    await page.reload();
    await page.waitForSelector('#fill-prefs');
    await page.waitForTimeout(400); await passerVisite();
    await page.waitForFunction(() => document.querySelector('#fill-prefs button').getAttribute('aria-checked') === 'false');
    await page.locator('#fill-prefs button').click();
    await page.waitForFunction(() => document.querySelector('#fill-prefs button').getAttribute('aria-checked') === 'true');
  });
  await test(`${largeur} px : accessibilité du bloc (axe)`, async () => {
    const r = await page.evaluate(async () => (window.axe ? (await axe.run('#fill-prefs')).violations.map((v) => `${v.id} : ${v.nodes.length}`) : ['axe absent : le contrôle n’a pas tourné']));
    assert.deepEqual(r, []);
  });
  await test(`${largeur} px : aucune erreur de script`, async () => assert.deepEqual(erreurs, []));
  await page.locator('#fill-prefs').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${sortie}/prefs-${largeur}.png`, fullPage: false });
  await ctx.close();
}
await navigateur.close();
serveur.close();
console.log(`\n${passes} contrôles passés`);
