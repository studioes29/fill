// Calendrier type des temps forts : une seule source, assets/t.js (site vitrine, page /calendrier/).
//
// assets/t.js porte deux zones balisées par des commentaires repères :
//   /* @calendrier-type:packs:debut ... */ const PACKS = {...}; /* @calendrier-type:packs:fin */
//   /* @calendrier-type:mois:debut ... */  const D = {...};     /* @calendrier-type:mois:fin */
// construire.mjs les lit ici et injecte les données dans regles/tempsforts.js (à la place de
// /* @injecte:calendrier-type */). tests/verifier.mjs relit le bundle publié pour contrôler qu'il porte
// les mêmes données que assets/t.js.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

export const SENTINELLE = '@calendrier-type';
export const PLACEHOLDER = '/* @injecte:calendrier-type */';

const zone = (texte, nom, fichier) => {
  const debut = `/* @calendrier-type:${nom}:debut`;
  const fin = `/* @calendrier-type:${nom}:fin */`;
  const i = texte.indexOf(debut);
  const j = texte.indexOf(fin);
  if (i < 0 || j < 0 || j < i || texte.indexOf(debut, i + 1) >= 0 || texte.indexOf(fin, j + 1) >= 0)
    throw new Error(`Repères « ${debut} … */ » et « ${fin} » introuvables, en double ou dans le désordre dans ${fichier}`);
  return texte.slice(texte.indexOf('*/', i) + 2, j);
};

// lit et contrôle les données du calendrier type dans assets/t.js
export function lireCalendrierType(racineDepot) {
  const fichier = join(racineDepot, 'assets', 't.js');
  const texte = readFileSync(fichier, 'utf8');
  const code = `${zone(texte, 'packs', fichier)}\n${zone(texte, 'mois', fichier)}\n({ packs: PACKS, mois: D })`;
  let r;
  try {
    r = runInNewContext(code, {}, { timeout: 1000 });
  } catch (e) {
    throw new Error(`Zones du calendrier type illisibles dans ${fichier} (attendu : const PACKS = {...} puis const D = {...}) : ${e.message}`);
  }
  const { packs, mois } = JSON.parse(JSON.stringify(r));
  const pb = [];
  for (const [k, p] of Object.entries(packs ?? {}))
    if (typeof p?.l !== 'string' || !p.p || !Object.keys(p.p).length) pb.push(`ensemble ${k} sans libellé ou sans prestations`);
  for (const t of ['c', 'e'])
    for (let m = 1; m <= 12; m++) {
      const l = mois?.[t]?.[m];
      if (!Array.isArray(l)) { pb.push(`${t}, mois ${m} absent`); continue; }
      for (const e of l)
        if (!Array.isArray(e) || !Number.isInteger(e[0]) || e[0] < 1 || e[0] > 31 || typeof e[1] !== 'string' || !packs?.[e[2]])
          pb.push(`${t}, mois ${m} : entrée invalide ${JSON.stringify(e)}`);
    }
  if (pb.length) throw new Error(`Calendrier type invalide dans ${fichier} :\n  ${pb.join('\n  ')}`);
  return { packs, mois };
}

// expression JavaScript injectée dans le bundle : une chaîne JSON, que le minifieur garde telle quelle
// (seules les guillemets qui l'entourent peuvent changer), et que le vérificateur retrouve par la sentinelle
export const expressionInjectee = (donnees) => `JSON.parse(${JSON.stringify(JSON.stringify({ [SENTINELLE]: 1, ...donnees }))})`;

// retrouve dans un bundle minifié les données injectées par construire.mjs
export function lireCalendrierTypeDuBundle(code) {
  const k = code.indexOf(SENTINELLE);
  if (k < 0 || code.indexOf(SENTINELLE, k + 1) >= 0) throw new Error(`Données du calendrier type introuvables (ou en double) dans le bundle`);
  const ouvre = code.lastIndexOf('JSON.parse(', k);
  if (ouvre < 0) throw new Error(`Données du calendrier type mal formées dans le bundle`);
  const q = code[ouvre + 11];
  let i = ouvre + 12;
  for (; i < code.length && code[i] !== q; i++) if (code[i] === '\\') i++;
  const litteral = code.slice(ouvre + 11, i + 1);
  const { [SENTINELLE]: _, ...donnees } = JSON.parse(runInNewContext(litteral));
  return donnees;
}
