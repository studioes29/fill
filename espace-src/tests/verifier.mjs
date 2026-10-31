// Vérifie l'Espace avant publication. Sortie 0 si tout est conforme. Ne modifie pas ../espace.
//
//   npm run verifier                     référence : espace/ de la branche main (ce que GitHub Pages sert)
//   npm run verifier -- --ref <révision> référence : espace/ d'une autre révision git (ex. origin/main, HEAD~1)
//   npm run verifier -- --ref .          référence : ../espace tel qu'il est sur le disque
//
// 1. Calendrier type : le bundle de ../espace (celui qui sera publié) doit porter les mêmes données que
//    ../assets/t.js. Sinon, assets/t.js a été modifié sans relancer npm run construire.
// 2. Équivalence : copie la référence, construit une seconde copie depuis src/, sert les deux en local et
//    compare les écrans avec tests/equivalence.cjs (Playwright requis, voir README).
//
// Les serveurs locaux tournent dans ce processus : le comparateur est donc lancé de façon asynchrone (spawn).
// Un appel synchrone (execFileSync) gèlerait la boucle d'événements de Node, les serveurs ne répondraient
// plus et chaque chargement de page finirait en délai dépassé.
import { cpSync, mkdtempSync, mkdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, extname, dirname, normalize, sep } from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { lireCalendrierType, lireCalendrierTypeDuBundle } from '../calendrier-type.mjs';

const ici = dirname(fileURLToPath(import.meta.url));
const depot = join(ici, '..', '..');
const i = process.argv.indexOf('--ref');
const ref = i > 0 ? process.argv[i + 1] : 'main';

// 1. calendrier type du bundle publié
const bundlePublie = (dossier) => {
  const m = readFileSync(join(dossier, 'index.html'), 'utf8').match(/assets\/(index-[\w-]+\.js)/);
  if (!m) throw new Error(`Aucun bundle index-*.js référencé dans ${join(dossier, 'index.html')}`);
  return join(dossier, 'assets', m[1]);
};
{
  const fichier = bundlePublie(join(depot, 'espace'));
  const attendu = JSON.stringify(lireCalendrierType(depot));
  let trouve;
  try { trouve = JSON.stringify(lireCalendrierTypeDuBundle(readFileSync(fichier, 'utf8'))); }
  catch (e) { trouve = `(${e.message})`; }
  if (trouve !== attendu) {
    console.error(`ÉCHEC calendrier type : ${fichier} ne porte pas les données de assets/t.js.\nRelancer npm run construire, puis npm run verifier.`);
    process.exit(4);
  }
  console.log(`Calendrier type : le bundle publié (${fichier.split(sep).pop()}) porte les données de assets/t.js.`);
}

// 2. équivalence écran par écran
const racine = mkdtempSync(join(tmpdir(), 'fill-verif-'));
if (ref === '.') cpSync(join(depot, 'espace'), join(racine, 'ref', 'espace'), { recursive: true });
else {
  mkdirSync(join(racine, 'ref'), { recursive: true });
  const archive = execFileSync('git', ['-C', depot, 'archive', '--format=tar', ref, 'espace'], { maxBuffer: 1 << 30 });
  execFileSync('tar', ['-x', '-C', join(racine, 'ref')], { input: archive });
}
cpSync(join(depot, 'espace'), join(racine, 'neuf', 'espace'), { recursive: true });
execFileSync('node', [join(ici, '..', 'construire.mjs'), '--vers', join(racine, 'neuf', 'espace')], { stdio: 'inherit' });
console.log(`Référence : espace/ de ${ref === '.' ? 'la copie de travail' : ref} (${bundlePublie(join(racine, 'ref', 'espace')).split(sep).pop()}) ; build neuf : ${bundlePublie(join(racine, 'neuf', 'espace')).split(sep).pop()}`);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
// port 0 : le système choisit un port libre (pas de conflit avec un autre vérificateur lancé en parallèle)
const servir = (dossier) => new Promise((ok, ko) => {
  const s = createServer(async (req, res) => {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (p.endsWith(sep) || p.endsWith('/')) p += 'index.html';
    try { const b = await readFile(join(dossier, p)); res.writeHead(200, { 'Content-Type': types[extname(p)] ?? 'application/octet-stream' }); res.end(b); }
    catch { res.writeHead(404); res.end(); }
  });
  s.on('error', ko);
  s.listen(0, '127.0.0.1', () => ok(s));
});
const lancer = (args) => new Promise((ok, ko) => {
  const p = spawn(process.execPath, args, { stdio: 'inherit' });
  p.on('error', ko);
  p.on('exit', (code, signal) => ok(code ?? (signal ? 1 : 0)));
});

const a = await servir(join(racine, 'ref')), b = await servir(join(racine, 'neuf'));
const url = (s) => `http://127.0.0.1:${s.address().port}/espace/`;
let code;
try { code = await lancer([join(ici, 'equivalence.cjs'), url(a), url(b), join(racine, 'ecarts')]); }
finally { a.close(); b.close(); }
if (code) console.error(`Écarts ou erreurs (code ${code}) : voir ${join(racine, 'ecarts')}`);
process.exit(code);
