// Construit l'Espace Fill publié dans ../espace à partir de espace-src.
//
//   npm run construire            écrit ../espace/index.html et ../espace/assets/index-<empreinte>.js|css
//   npm run construire -- --vers <dossier>   écrit ailleurs (dossier qui contient une copie de espace/)
//
// Les fichiers de src/ sont concaténés dans l'ordre de src/ordre.txt : ils forment un seul module,
// comme le bundle d'origine. L'ordre compte (déclarations et initialisations en séquence).
// Les autres fichiers de espace/ (icônes, polices, images, manifeste, écran admin-virements)
// ne sont pas générés : ils se modifient directement dans espace/.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const ici = dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--vers');
const sortie = i > 0 ? process.argv[i + 1] : join(ici, '..', 'espace');
if (!existsSync(join(sortie, 'assets'))) throw new Error(`Dossier de sortie sans assets/ : ${sortie}`);

const ordre = readFileSync(join(ici, 'src', 'ordre.txt'), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
const code = ordre.map((f) => readFileSync(join(ici, 'src', f), 'utf8')).join('\n');
const css = readFileSync(join(ici, 'styles', 'espace.css'), 'utf8');

const js = await transform(code, { loader: 'js', format: 'esm', target: 'es2022', minify: true, legalComments: 'none', charset: 'utf8' });
const feuille = await transform(css, { loader: 'css', minify: true, legalComments: 'none', charset: 'utf8' });
for (const w of [...js.warnings, ...feuille.warnings]) console.warn(w.text);

const empreinte = (t) => createHash('sha256').update(t).digest('base64url').slice(0, 8);
const nomJs = `index-${empreinte(js.code)}.js`;
const nomCss = `index-${empreinte(feuille.code)}.css`;

const assets = join(sortie, 'assets');
for (const f of readdirSync(assets)) if (/^index-.*\.(js|css)$/.test(f)) rmSync(join(assets, f));
writeFileSync(join(assets, nomJs), js.code);
writeFileSync(join(assets, nomCss), feuille.code);
const page = readFileSync(join(ici, 'index.html'), 'utf8').replace('%JS%', nomJs).replace('%CSS%', nomCss);
writeFileSync(join(sortie, 'index.html'), page);
console.log(`${ordre.length} fichiers, ${nomJs} (${js.code.length} octets), ${nomCss} (${feuille.code.length} octets) dans ${sortie}`);
