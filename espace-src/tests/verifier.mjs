// Vérifie qu'un build de espace-src se comporte comme l'Espace publié (../espace, état du dépôt).
// 1. copie ../espace (référence) ; 2. construit une seconde copie depuis src/ ; 3. sert les deux ;
// 4. compare les écrans avec tests/equivalence.cjs (Playwright requis : npm i -D playwright && npx playwright install chromium).
// Sortie 0 si aucun écart. Ne modifie pas ../espace.
import { cpSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, extname, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const racine = mkdtempSync(join(tmpdir(), 'fill-verif-'));
cpSync(join(ici, '..', '..', 'espace'), join(racine, 'ref', 'espace'), { recursive: true });
cpSync(join(ici, '..', '..', 'espace'), join(racine, 'neuf', 'espace'), { recursive: true });
execFileSync('node', [join(ici, '..', 'construire.mjs'), '--vers', join(racine, 'neuf', 'espace')], { stdio: 'inherit' });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const servir = (dossier, port) => new Promise((ok) => {
  const s = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    try { const b = await readFile(join(dossier, p)); res.writeHead(200, { 'Content-Type': types[extname(p)] ?? 'application/octet-stream' }); res.end(b); }
    catch { res.writeHead(404); res.end(); }
  });
  s.listen(port, '127.0.0.1', () => ok(s));
});
const a = await servir(join(racine, 'ref'), 5501), b = await servir(join(racine, 'neuf'), 5502);
let code = 0;
try { execFileSync('node', [join(ici, 'equivalence.cjs'), 'http://127.0.0.1:5501/espace/', 'http://127.0.0.1:5502/espace/', join(racine, 'ecarts')], { stdio: 'inherit' }); }
catch { code = 1; console.error(`Écarts : voir ${join(racine, 'ecarts')}`); }
a.close(); b.close();
process.exit(code);
