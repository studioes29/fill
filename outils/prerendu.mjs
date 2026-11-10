// Prérendu : écrit dans le HTML le contenu que t.js dessine à partir de window.FILL (cartes des formules, comparatif),
// pour que les moteurs et les assistants qui ne lancent pas le JavaScript lisent les prix et les unités.
// Le script remplace ce contenu au chargement, comme avant. À relancer après toute modification de l'offre (offre.js) :
//   node outils/prerendu.mjs        (depuis la racine du dépôt ; Playwright requis)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // NODE_PATH vers les modules globaux si besoin
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const R = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
const srv = http.createServer((q, s) => { let f = path.join(R, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html';
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(d); } }); });
await new Promise(r => srv.listen(0, r)); const port = srv.address().port;
// [page, ouverture brute du conteneur vide (repère exact), sélecteur dans la page rendue]
const CIBLES = [
  ['index.html', '<div class="fos" id="fos" data-rail=".fo">', '#fos'],
  ['formules/index.html', '<div class="fos" id="fos" data-mode="complet" data-rail=".fo">', '#fos'],
  ['formules/index.html', '<div class="cmpf-p presets" role="group" aria-label="Profil">', '#cmpf .cmpf-p'],
  ['formules/index.html', '<p class="mu" data-besoin aria-live="polite" style="font-size:15px">', '#cmpf [data-besoin]'],
  ['formules/index.html', '<div class="cmpf-g">', '#cmpf .cmpf-g'],
];
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.addInitScript(() => { try { localStorage.clear(); sessionStorage.setItem('fil.intro', '1'); } catch (e) {} });
const pages = {};
for (const [f, ouv, sel] of CIBLES) {
  if (!pages[f]) { await p.goto(`http://localhost:${port}/${f.replace('index.html', '')}?sans-intro`, { waitUntil: 'networkidle' }); await p.waitForTimeout(500); pages[f] = fs.readFileSync(path.join(R, f), 'utf8'); }
  const inner = await p.$eval(sel, el => { const c = el.cloneNode(true); c.querySelectorAll('.vu').forEach(x => x.classList.remove('vu')); return c.innerHTML.trim(); });
  let h = pages[f]; const i = h.indexOf(ouv); if (i < 0) throw new Error(`repère absent : ${f} ${ouv}`);
  const tag = ouv.match(/^<(\w+)/)[1]; const deb = i + ouv.length;
  // contenu déjà prérendu : on le remplace jusqu'à la fermeture correspondante
  let prof = 1, j = deb; const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g'); re.lastIndex = deb; let m;
  while ((m = re.exec(h))) { prof += m[1] ? -1 : 1; if (!prof) { j = m.index; break; } }
  pages[f] = h.slice(0, deb) + inner + h.slice(j);
}
for (const [f, h] of Object.entries(pages)) fs.writeFileSync(path.join(R, f), h);
await b.close(); srv.close(); console.log('prérendu :', Object.keys(pages).join(', '));
