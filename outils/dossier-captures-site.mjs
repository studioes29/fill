// Captures des outils publics du site (diagnostic, simulateur, calendrier) pour le dossier de présentation.
//   node outils/dossier-captures-site.mjs        (Playwright requis ; écrit dossier/captures/site-*.jpg et dossier/captures/l/)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const R = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.jpg': 'image/jpeg' };
const srv = http.createServer((q, s) => { let f = path.join(R, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html'; fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); s.end(d); } }); });
await new Promise((r) => srv.listen(0, r)); const port = srv.address().port;
const nav = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
const CIBLES = [['site-diagnostic', '/diagnostic/', null], ['site-simulateur', '/simulateur/?profil=commune#etape-3', '#etape-3'], ['site-calendrier', '/calendrier/', null]];
for (const [nom, url, vers] of CIBLES) {
  const c = await nav.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, reducedMotion: 'reduce' });
  await c.addInitScript(() => { try { sessionStorage.setItem('fill-intro', '1'); localStorage.setItem('fill-intro', '1'); } catch {} });
  const p = await c.newPage(); await p.goto(`http://localhost:${port}${url}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  if (vers) { await p.locator(vers).first().scrollIntoViewIfNeeded().catch(() => {}); await p.evaluate((s) => { const e = document.querySelector(s); if (e) window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 90); }, vers); await p.waitForTimeout(600); }
  const f = path.join(R, 'dossier', 'captures', `${nom}.jpg`);
  await p.screenshot({ path: f, type: 'jpeg', quality: 82 });
  execFileSync('python3', ['-c', `from PIL import Image; im=Image.open(${JSON.stringify(f)}); im.resize((1080, round(im.height*1080/im.width))).save(${JSON.stringify(path.join(R, 'dossier', 'captures', 'l', nom + '.jpg'))}, quality=66)`]);
  console.log(nom); await c.close();
}
await nav.close(); srv.close();
