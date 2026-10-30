// Assemble les fonctions serveur et vérifie qu'elles redonnent les fichiers déployés (dossier deploye/).
//   node supabase/assembler.mjs            assemble tout dans supabase/.assemblees/ et compare à deploye/
//   node supabase/assembler.mjs pilote     une seule fonction
// Fonction en modules (elle importe ../_partage) : assemblée par esbuild, comme lors de son déploiement.
// Fonction en un seul fichier : déployée telle quelle, le fichier est comparé directement.
// Un écart après une modification voulue est normal : redéployer le fichier assemblé, puis le copier dans deploye/.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, '..');
const fonctions = readdirSync(join(ici, 'functions')).filter((n) => !n.startsWith('_') && existsSync(join(ici, 'functions', n, 'index.ts')));
const choisies = process.argv[2] ? [process.argv[2]] : fonctions;
mkdirSync(join(ici, '.assemblees'), { recursive: true });
let ecarts = 0;
for (const n of choisies) {
  const entree = join('supabase', 'functions', n, 'index.ts');
  const source = readFileSync(join(racine, entree), 'utf8');
  let sortie = source;
  if (/from '\.\.\/_partage\//.test(source)) {
    const r = await build({
      absWorkingDir: racine, entryPoints: [entree], bundle: true, format: 'esm', platform: 'neutral', target: 'es2022',
      write: false, external: ['npm:*', 'jsr:*', 'https:*'], legalComments: 'none', logLevel: 'error', outfile: 'x.ts',
    });
    sortie = r.outputFiles[0].text;
  }
  writeFileSync(join(ici, '.assemblees', `${n}.ts`), sortie);
  const deploye = join(ici, 'deploye', `${n}.ts`);
  const ok = existsSync(deploye) && readFileSync(deploye, 'utf8') === sortie;
  if (!ok) ecarts++;
  console.log(`${n.padEnd(16)} ${sortie.length.toString().padStart(6)} octets  ${ok ? 'identique au déployé' : 'ÉCART avec deploye/'}`);
}
process.exit(ecarts ? 1 : 0);
