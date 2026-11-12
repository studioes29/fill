// Contrôle de la livraison par livrable (src/livraison.js, regles/livrables.js) dans un vrai navigateur, en démonstration,
// côté Fill (profil « ewen ») : une ligne par livrable commandé, envoi bloqué tant qu'une ligne est vide, puis livraison.
//
//   npm i --no-save playwright@1.63.0 axe-core && node tests/livraison.mjs
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
const MOTIF_MOI = /moiId:([A-Za-z_$][\w$]*)\?null:([A-Za-z_$][\w$]*)\?"visiteur":/g;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.json': 'application/json' };
const serveur = createServer((req, res) => {
  let chemin = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (chemin.endsWith('/')) chemin += 'index.html';
  const f = join(racine, chemin);
  if (!f.startsWith(racine) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  let corps = readFileSync(f);
  if (/espace\/assets\/index-.*\.js$/.test(f)) corps = corps.toString().replace(MOTIF_MOI, 'moiId:$1?null:$2?(localStorage.getItem("profil-test")??"visiteur"):');
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(corps);
}).listen(0);
const base = `http://localhost:${serveur.address().port}/espace/?demo`;

let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.message.split('\n').slice(0, 8).join('\n     ')}`); process.exitCode = 1; } };

const nav = await chromium.launch({ executablePath: existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined, args: ['--no-sandbox'] });
const ctx = await nav.newContext({ viewport: { width: 1280, height: 1000 } });
await ctx.addInitScript({ content: axe });
await ctx.addInitScript(() => localStorage.setItem('profil-test', 'ewen'));
const page = await ctx.newPage();
const erreurs = [];
page.on('pageerror', (e) => erreurs.push(String(e)));
await page.goto(`${base}#production`);
await page.waitForTimeout(1200);
const passer = page.getByRole('button', { name: 'Passer la visite' });
if (await passer.count()) await passer.first().click();
const liens = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#demande-"]')].map((a) => a.getAttribute('href')))]);
let trouve = null;
for (const l of liens) {
  await page.evaluate((h) => { location.hash = h; }, l);
  await page.waitForTimeout(400);
  if (await page.locator('#fill-livraison').count()) { trouve = l; break; }
}

await test('une fiche à livrer montre la liste des livrables, et masque le formulaire d’origine', async () => {
  assert.ok(trouve, `aucune fiche avec la liste des livrables parmi ${liens.length}`);
  assert.equal(await page.locator('form.version:not(#fill-livraison)').isHidden(), true);
  assert.ok((await page.locator('#fill-livraison fieldset').count()) >= 1);
});
await test('le dépôt de fichier est en français, sans bouton natif du navigateur', async () => {
  const zones = page.locator('#fill-livraison .fill-depot');
  assert.ok((await zones.count()) >= 1);
  assert.match(await zones.first().innerText(), /^Choisir (le|les) fichiers?$/);
  for (const i of await page.locator('#fill-livraison input[type=file]').all()) assert.equal(await i.evaluate((n) => n.getBoundingClientRect().width <= 1), true, 'champ natif visible');
  await page.screenshot({ path: '/tmp/livraison-vide.png', clip: await page.locator('#fill-livraison').boundingBox().then((b) => ({ x: b.x - 10, y: Math.max(0, b.y - 10), width: b.width + 20, height: Math.min(900, b.height + 20) })) });
});
await test('l’envoi reste grisé tant qu’un livrable est vide, et dit lequel', async () => {
  const lignes = page.locator('#fill-livraison fieldset');
  const n = await lignes.count();
  // on vide les textes repris du premier jet pour partir de zéro
  for (const t of await page.locator('#fill-livraison fieldset textarea').all()) await t.fill('');
  assert.equal(await page.locator('#fill-livraison button[type=submit]').isDisabled(), true);
  assert.match(await page.textContent('#fill-livraison [role=status]'), /Il reste/);
  for (let i = 0; i < n; i++) {
    const l = lignes.nth(i);
    if (await l.locator('textarea').count()) await l.locator('textarea').fill(`Texte du livrable ${i + 1}`);
    else await l.locator('input[type=file]').setInputFiles({ name: `visuel-${i + 1}.png`, mimeType: 'image/png', buffer: Buffer.from('89504e470d0a1a0a', 'hex') });
    if (i < n - 1) assert.equal(await page.locator('#fill-livraison button[type=submit]').isDisabled(), true, `envoi possible avec ${i + 1} sur ${n}`);
  }
  assert.equal(await page.locator('#fill-livraison button[type=submit]').isDisabled(), false);
  assert.match(await page.textContent('#fill-livraison [role=status]'), /Tous les livrables sont prêts/);
  const zone = page.locator('#fill-livraison .fill-depot.plein').first();
  if (await zone.count()) assert.match(await zone.innerText(), /visuel-\d+\.png[\s\S]*Remplacer/);
});
await test('accessibilité de la liste (axe)', async () => {
  const r = await page.evaluate(async () => (window.axe ? (await axe.run('#fill-livraison')).violations.flatMap((v) => v.nodes.map((n) => `${v.id} : ${n.target} ${(n.any[0]?.message ?? '').slice(0, 120)}`)) : ['axe absent']));
  assert.deepEqual(r, []);
});
await page.screenshot({ path: '/tmp/livraison.png', fullPage: false, clip: await page.locator('#fill-livraison').boundingBox().then((b) => ({ x: b.x - 10, y: Math.max(0, b.y - 10), width: b.width + 20, height: Math.min(1400, b.height + 20) })) }).catch(() => {});
await test('la version part, chaque fichier porte son livrable', async () => {
  await page.locator('#fill-livraison button[type=submit]').click();
  await page.waitForFunction(() => !document.querySelector('#fill-livraison'), null, { timeout: 10000 });
  const v = await page.evaluate((h) => {
    const d = JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => /^fill-espace-demo-[a-z0-9]+$/.test(k))));
    const dem = d.demandes.find((x) => `#demande-${x.id}` === h);
    return dem.versions.at(-1).fichiers.map((f) => [f.livrable, f.libelle]);
  }, trouve);
  assert.ok(v.length > 0 && v.every(([c, l]) => c && l), JSON.stringify(v));
});
await test('aucune erreur de script', async () => assert.deepEqual(erreurs, []));
await nav.close();
serveur.close();
console.log(`\n${passes} contrôles passés`);
