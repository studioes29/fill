// Construit l'Espace Fill publié dans ../espace à partir de espace-src.
//
//   npm run construire            écrit ../espace/index.html et ../espace/assets/index-<empreinte>.js|css
//   npm run construire -- --vers <dossier>   écrit ailleurs (dossier qui contient une copie de espace/)
//
// Les fichiers de src/ sont concaténés dans l'ordre de src/ordre.txt : ils forment un seul module,
// comme le bundle d'origine. L'ordre compte (déclarations et initialisations en séquence).
// Calendrier type des temps forts (bloc « À anticiper » de l'Accueil) : extrait de ../assets/t.js entre les
// repères @calendrier-type et injecté dans regles/tempsforts.js (voir calendrier-type.mjs). Le build échoue
// si les repères sont introuvables ou les données invalides.
// Les autres fichiers de espace/ (icônes, polices, images, manifeste, écran admin-virements)
// ne sont pas générés : ils se modifient directement dans espace/.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
import { lireCalendrierType, expressionInjectee, PLACEHOLDER } from './calendrier-type.mjs';

const ici = dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--vers');
const sortie = i > 0 ? process.argv[i + 1] : join(ici, '..', 'espace');
if (!existsSync(join(sortie, 'assets'))) throw new Error(`Dossier de sortie sans assets/ : ${sortie}`);

const ordre = readFileSync(join(ici, 'src', 'ordre.txt'), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
const calendrierType = lireCalendrierType(join(ici, '..'));
const injecter = (f, t) => {
  if (f !== 'regles/tempsforts.js') return t;
  const n = t.split(`${PLACEHOLDER} null`).length - 1;
  if (n !== 1) throw new Error(`regles/tempsforts.js : point d'injection « ${PLACEHOLDER} null » attendu une fois, trouvé ${n} fois`);
  return t.replace(`${PLACEHOLDER} null`, expressionInjectee(calendrierType));
};
if (!ordre.includes('regles/tempsforts.js')) throw new Error('regles/tempsforts.js absent de src/ordre.txt : calendrier type non injecté');
const code = ordre.map((f) => injecter(f, readFileSync(join(ici, 'src', f), 'utf8'))).join('\n');
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
const nbTempsForts = Object.values(calendrierType.mois).reduce((n, t) => n + Object.values(t).flat().length, 0);
console.log(`${ordre.length} fichiers, calendrier type de assets/t.js (${nbTempsForts} temps forts, ${Object.keys(calendrierType.packs).length} ensembles), ${nomJs} (${js.code.length} octets), ${nomCss} (${feuille.code.length} octets) dans ${sortie}`);
