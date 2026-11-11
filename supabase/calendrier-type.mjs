// Calendrier type des temps forts pour les fonctions serveur (suggestions du mail mensuel).
// Source unique : assets/t.js (voir espace-src/calendrier-type.mjs). Ce script en écrit la copie lue par les
// fonctions, functions/_partage/calendrier-type.json ; le test tests/bilan.test.mjs échoue si elle n'est plus à jour.
//
//   node supabase/calendrier-type.mjs             écrit la copie
//   node supabase/calendrier-type.mjs --verifier  échoue si la copie diffère de assets/t.js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lireCalendrierType } from '../espace-src/calendrier-type.mjs';

const ici = dirname(fileURLToPath(import.meta.url));
export const FICHIER = join(ici, 'functions', '_partage', 'calendrier-type.json');
export const attendu = () => `${JSON.stringify(lireCalendrierType(join(ici, '..')), null, 2)}\n`;
export const aJour = () => existsSync(FICHIER) && readFileSync(FICHIER, 'utf8') === attendu();

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--verifier')) {
    if (!aJour()) { console.error('functions/_partage/calendrier-type.json n’est plus à jour : node supabase/calendrier-type.mjs'); process.exit(1); }
    console.log('calendrier-type.json à jour');
  } else {
    writeFileSync(FICHIER, attendu());
    console.log(`écrit : ${FICHIER}`);
  }
}
