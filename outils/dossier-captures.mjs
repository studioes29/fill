// Captures d'écran du dossier de présentation (/dossier/), prises dans l'Espace en démonstration.
// Aucune donnée réelle : mode ?demo (données fictives de espace-src/src/donnees/demo.js), pages relecture/ et bilan/
// en ?demo, et écran d'ouverture de compte rempli avec des valeurs fictives, sans envoi (Supabase simulé).
//
//   npm i --no-save playwright sharp      (ou NODE_PATH vers un dossier qui les contient)
//   node outils/dossier-captures.mjs      écrit dossier/captures/*.jpg (1920 px) et dossier/captures/l/*.jpg (1080 px)
//
// Le script sert lui-même le dépôt en local. Chrome : variable CHROME, sinon celui de Playwright.
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = path.join(RACINE, 'dossier', 'captures');
const L = 1280, H = 800, ECHELLE = 2;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

export const servir = () => new Promise((ok) => {
  const s = http.createServer((q, r) => {
    let p = decodeURIComponent(new URL(q.url, 'http://x').pathname);
    let f = path.join(RACINE, p);
    if (!f.startsWith(RACINE)) { r.writeHead(403).end(); return; }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { r.writeHead(404).end('absent'); return; }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
    fs.createReadStream(f).pipe(r);
  }).listen(0, '127.0.0.1', () => ok({ s, base: `http://127.0.0.1:${s.address().port}` }));
});

// choix du profil de démonstration : même réécriture que espace-src/tests/equivalence.cjs
const CLE_MOI = 'fill-espace-demo-mvuakaue-moi';
const MOTIF_MOI = /moiId:([A-Za-z_$][\w$]*)\?null:([A-Za-z_$][\w$]*)\?"visiteur":/g;

const contexte = async (nav, moi, l = L, h = H) => {
  const c = await nav.newContext({ viewport: { width: l, height: h }, deviceScaleFactor: ECHELLE * L / l, locale: 'fr-FR', timezoneId: 'Europe/Paris', reducedMotion: 'reduce' });
  if (moi) {
    await c.route(/\/assets\/index-[^/]*\.js(\?.*)?$/, async (route) => {
      const r = await route.fetch();
      const code = await r.text();
      if (!(code.match(MOTIF_MOI) ?? []).length) throw new Error('Choix du profil impossible : motif moiId introuvable (donnees/etat.js a changé)');
      await route.fulfill({ response: r, body: code.replace(MOTIF_MOI, `moiId:$1?null:$2?(localStorage.getItem(${JSON.stringify(CLE_MOI)})??"visiteur"):`) });
    });
    await c.addInitScript(([k, v]) => { try { localStorage.setItem(k, v); } catch {} }, [CLE_MOI, moi]);
  }
  return c;
};

const faits = [];
const prendre = async (p, nom, { haut = null, vers = null, roule = 0 } = {}) => {
  if (roule) { await p.mouse.move(500, 300); await p.mouse.wheel(0, roule); }
  if (vers) await p.locator(vers).first().scrollIntoViewIfNeeded();
  if (haut !== null) await p.evaluate((y) => { const z = document.scrollingElement; z.scrollTop = y; for (const e of document.querySelectorAll('main, .contenu, #contenu')) e.scrollTop = y; }, haut);
  await p.waitForTimeout(350);
  const png = await p.screenshot({ type: 'png' });
  // deux tailles : 1920 px pour la page et l'impression, 1080 px pour le PDF léger
  for (const [dossier, largeur, qualite] of [[SORTIE, 1920, 86], [path.join(SORTIE, 'l'), 1080, 66]]) {
    const f = path.join(dossier, `${nom}.jpg`);
    await sharp(png).resize({ width: largeur }).jpeg({ quality: qualite, mozjpeg: true }).toFile(f);
    if (dossier === SORTIE) faits.push(`${nom}.jpg ${(fs.statSync(f).size / 1024).toFixed(0)} Ko`);
  }
};
const aller = async (p, base, route) => { await p.goto(`${base}/espace/?demo&sans-intro#${route}`); await p.waitForTimeout(1300); };
const clic = async (p, texte, opt = {}) => { await p.getByText(texte, { exact: opt.exact ?? false }).first().click(); await p.waitForTimeout(600); };

const main = async () => {
  fs.mkdirSync(path.join(SORTIE, 'l'), { recursive: true });
  const { s, base } = await servir();
  const nav = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  const seul = process.argv[2];
  const bloc = async (nom, f) => { if (seul && seul !== nom) return; try { await f(); } catch (e) { console.error(`[${nom}] ${e.message.split('\n')[0]}`); process.exitCode = 1; } };

  // référente d'une commune (Marion Le Bihan, Saint-Ivenec)
  await bloc('referent', async () => {
    const c = await contexte(nav, 'marion'); const p = await c.newPage();
    await aller(p, base, 'accueil'); await prendre(p, 'accueil');
    await aller(p, base, 'demandes'); await prendre(p, 'demandes');
    await aller(p, base, 'unites'); await prendre(p, 'unites');
    await clic(p, 'Commander des unités'); await prendre(p, 'unites-commande');
    await p.getByRole('button', { name: 'Continuer' }).click(); await p.waitForTimeout(700); await prendre(p, 'unites-commande-2');
    await aller(p, base, 'demande-d50'); await prendre(p, 'fiche-deposee');
    await aller(p, base, 'demande-d44'); await prendre(p, 'fiche-relire');
    await prendre(p, 'fiche-relire-2', { roule: 330 });
    await clic(p, 'Demander une correction'); await prendre(p, 'fiche-correction', { roule: 170 });
    await aller(p, base, 'equipe'); await prendre(p, 'equipe');
    await aller(p, base, 'equipe'); await clic(p, 'Inviter un collègue'); await prendre(p, 'equipe-inviter');
    await aller(p, base, 'comptes'); await prendre(p, 'comptes');
    await c.close();
  });
  await bloc('nouvelle', async () => {
    const c = await contexte(nav, 'marion'); const p = await c.newPage();
    await aller(p, base, 'nouvelle');
    await p.getByLabel('Sujet de la demande').fill('Marché de Noël du 12 décembre');
    await p.getByLabel('Ce qu’il faut savoir').fill('Samedi 12 décembre, de 10 h à 19 h, place de l’Église. Trente exposants, animations pour les enfants à 15 h, restauration sur place. Entrée libre.');
    await prendre(p, 'nouvelle-sujet', { haut: 0 });
    await clic(p, 'Publication', { exact: true }); await clic(p, 'Site internet', { exact: true }); await clic(p, 'Actualité', { exact: true }); await clic(p, 'Affiches et campagnes', { exact: true }); await clic(p, 'Affiche', { exact: true });
    await prendre(p, 'nouvelle-supports', { vers: 'text=Les supports' });
    const d = p.locator('input[placeholder*="jj"], input[type="date"]').first();
    await d.fill('04/12/2026').catch(async () => { await d.fill('2026-12-04'); });
    await p.keyboard.press('Tab');
    await prendre(p, 'nouvelle-date', { vers: 'text=Demande urgente' });
    await clic(p, 'Vérifier la demande'); await prendre(p, 'nouvelle-verifier');
    await c.close();
  });
  // gérante d'une entreprise (Léa Cadoret, Maison Blé)
  await bloc('entreprise', async () => {
    const c = await contexte(nav, 'lea'); const p = await c.newPage();
    await aller(p, base, 'unites'); await clic(p, 'Commander des unités'); await p.getByRole('button', { name: 'Continuer' }).click(); await p.waitForTimeout(700); await prendre(p, 'unites-commande-entreprise');
    await c.close();
  });
  // pages sans compte
  // pages étroites : fenêtre plus petite, pour que le contenu occupe la capture
  await bloc('liens', async () => {
    const c = await contexte(nav, null, 880, 550); const p = await c.newPage();
    await p.goto(`${base}/espace/relecture/?demo`); await p.waitForTimeout(1300); await prendre(p, 'relecture', { roule: 1075 });
    await p.goto(`${base}/espace/bilan/?demo`); await p.waitForTimeout(1300); await prendre(p, 'bilan'); await prendre(p, 'bilan-suite', { vers: 'text=Pour la période qui commence' });
    await c.close();
  });
  // ouverture de compte : mode réel sans session, rien n'est envoyé
  await bloc('ouverture', async () => {
    const c = await contexte(nav, null); const p = await c.newPage();
    await p.route('**/*.supabase.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await p.goto(`${base}/espace/?sans-intro#ouverture`); await p.waitForTimeout(1300);
    await p.locator('#o-p').fill('Marion Le Bihan');
    await p.locator('#o-f').fill('Directrice générale des services');
    await p.locator('#o-m').fill('m.lebihan@saint-ivenec.example');
    await p.locator('#o-mdp').fill('exemple-fictif');
    await p.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
    await prendre(p, 'ouverture-1');
    await p.getByRole('button', { name: 'Continuer' }).click(); await p.waitForTimeout(700);
    await p.locator('#o-nom').fill('Commune de Saint-Ivenec');
    await p.locator('#o-siret').fill('212 900 001 00011');
    await prendre(p, 'ouverture-2');
    await p.getByRole('button', { name: 'Continuer' }).click(); await p.waitForTimeout(700); await prendre(p, 'ouverture-3');
    await p.getByRole('button', { name: 'Continuer' }).click(); await p.waitForTimeout(700); await prendre(p, 'ouverture-4');
    await c.close();
  });
  await nav.close(); s.close();
  console.log(faits.join('\n'));
};
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
