// Tests de la relecture par lien : la migration tourne dans un Postgres embarqué (PGlite), sur un schéma réduit
// aux tables qu'elle touche, puis les règles communes (functions/_partage/regles/relecture.ts) sont contrôlées.
//
//   cd supabase && npm i --no-save @electric-sql/pglite && node tests/relecture.test.mjs
//
// Le schéma réduit reprend les colonnes réelles relevées dans la base le 11 novembre 2026.
import { PGlite } from '@electric-sql/pglite';
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const ici = dirname(fileURLToPath(import.meta.url));
const db = new PGlite();
let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.message}`); process.exitCode = 1; } };
const refuse = async (f, motif) => { let m = null; try { await f(); } catch (e) { m = e.message; } assert.ok(m && motif.test(m), `refus attendu (${motif}), obtenu : ${m}`); };

await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema auth;
  create function auth.role() returns text language sql stable as $$ select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $$;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  create table organisation (id uuid primary key default gen_random_uuid(), nom text, type text, essai boolean default false);
  create table profil (id uuid primary key default gen_random_uuid(), nom text, email text, role text, organisation_id uuid, actif boolean default true, suppleant_jusqu_au date, creee timestamptz default now());
  create table demande (id uuid primary key default gen_random_uuid(), organisation_id uuid, auteur_id uuid, titre text, statut text, corrections integer default 0, parution date, heure text, maj timestamptz default now());
  create table version_livrable (id uuid primary key default gen_random_uuid(), demande_id uuid, organisation_id uuid, numero integer, note text, fichiers jsonb, creee timestamptz default now());
  create table message (id uuid primary key default gen_random_uuid(), demande_id uuid, organisation_id uuid, auteur_id uuid, texte text, systeme boolean default false, creee timestamptz default now());
  create table historique (id bigserial primary key, demande_id uuid, organisation_id uuid, statut text, type text, detail text, par uuid, date timestamptz default now());
  create table journal (id bigserial primary key, organisation_id uuid, action text, cible text, detail jsonb);
  create function journaliser(org uuid, act text, cib text, det jsonb) returns void language sql as $$ insert into journal (organisation_id, action, cible, detail) values (org, act, cib, det) $$;
  create function est_equipe() returns boolean language sql stable security definer as $$ select coalesce((select role in ('admin','producteur') from profil where id = auth.uid() and actif), false) $$;
  create function mon_organisation() returns uuid language sql stable security definer as $$ select organisation_id from profil where id = auth.uid() and actif $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  grant select on organisation, profil, demande, version_livrable to authenticated;
`);
await db.exec(readFileSync(join(ici, '..', 'migrations', '2026-11-relecture-par-lien.sql'), 'utf8'));

const un = async (q, p = []) => (await db.query(q, p)).rows[0];
const serveur = () => db.exec(`reset role; select set_config('test.role', 'service_role', false); select set_config('test.uid', '', false);`);
const E = (n) => String(n).padStart(64, '0');
let n = 0;
// une organisation, son référent et une demande à valider avec une version
const scene = async (corrections = 0) => {
  await serveur();
  const o = await un(`insert into organisation (nom, type) values ('Commune de Saint-Ivenec', 'collectivite') returning id`);
  const r = await un(`insert into profil (nom, email, role, organisation_id) values ('Yann Le Gall', 'yann@exemple.fr', 'referent', $1) returning id`, [o.id]);
  const d = await un(`insert into demande (organisation_id, auteur_id, titre, statut, corrections) values ($1, $2, 'Newsletter de décembre', 'a_valider', $3) returning id`, [o.id, r.id, corrections]);
  const v = await un(`insert into version_livrable (demande_id, organisation_id, numero, fichiers) values ($1, $2, 1, '[{"nom":"newsletter.pdf","chemin":"x/y.pdf"}]') returning id`, [d.id, o.id]);
  return { o: o.id, r: r.id, d: d.id, v: v.id };
};
const creer = async (s, usage, nom = 'Yann Le Gall', email = 'yann@exemple.fr', fonction = null) => {
  const e = E(++n);
  const l = await un(`select relecture_creer($1, $2, $3, $4, $5, $6, $7) as id`, [s.d, usage, nom, fonction, email, e, s.r]);
  return { e, id: l.id };
};
const lire = async (e) => (await un(`select relecture_lire($1) as v`, [e])).v;
const repondre = async (e, r, rem = null) => (await un(`select relecture_repondre($1, $2, $3) as v`, [e, r, rem])).v;
const demande = (id) => un(`select statut, corrections from demande where id = $1`, [id]);

await test('le référent valide depuis son lien : la demande passe en « validée », la trace porte son nom', async () => {
  const s = await scene(); const l = await creer(s, 'referent');
  assert.equal((await lire(l.e)).etat, 'ouvert');
  const r = await repondre(l.e, 'accord');
  assert.deepEqual([r.decision, r.statut, r.par], [true, 'validee', s.r]);
  assert.equal((await demande(s.d)).statut, 'validee');
  const h = await un(`select statut, type, par, detail from historique where demande_id = $1 order by id desc limit 1`, [s.d]);
  assert.deepEqual([h.statut, h.type, h.par], ['validee', 'lien', s.r]);
  assert.match(h.detail, /sans connexion/);
  assert.equal((await lire(l.e)).etat, 'repondu');
  await refuse(() => repondre(l.e, 'accord'), /déjà été donnée/);
});

await test('une correction exige une remarque, compte dans les deux allers-retours et s’écrit au nom du référent', async () => {
  const s = await scene(); const l = await creer(s, 'referent');
  await refuse(() => repondre(l.e, 'correction', '  '), /Indiquez ce qui est à corriger/);
  assert.equal((await demande(s.d)).statut, 'a_valider');
  const r = await repondre(l.e, 'correction', 'La date du marché est le 12, pas le 13.');
  assert.equal(r.statut, 'correction');
  assert.deepEqual(await demande(s.d), { statut: 'correction', corrections: 1 });
  const m = await un(`select auteur_id, texte, systeme from message where demande_id = $1`, [s.d]);
  assert.deepEqual([m.auteur_id, m.systeme], [s.r, false]);
});

await test('au-delà de deux allers-retours, la correction est refusée et rien ne change', async () => {
  const s = await scene(2); const l = await creer(s, 'referent');
  await refuse(() => repondre(l.e, 'correction', 'Encore un détail.'), /deux allers-retours/);
  assert.deepEqual(await demande(s.d), { statut: 'a_valider', corrections: 2 });
  assert.equal((await lire(l.e)).etat, 'ouvert');
});

await test('une seule délégation ouverte par demande ; une délégation expirée ne bloque pas la suivante', async () => {
  const s = await scene();
  const a = await creer(s, 'delegation', 'Anne Kerbrat', 'anne@exemple.fr', 'adjointe à la culture');
  await refuse(() => creer(s, 'delegation', 'Paul Morvan', 'paul@exemple.fr'), /déjà confiée/);
  assert.equal((await lire(a.e)).delegation_ouverte, true);
  await db.query(`update lien_relecture set expire = now() - interval '1 minute' where id = $1`, [a.id]);
  assert.equal((await lire(a.e)).etat, 'expire');
  await refuse(() => repondre(a.e, 'accord'), /expiré/);
  const b = await creer(s, 'delegation', 'Paul Morvan', 'paul@exemple.fr');
  assert.equal((await lire(b.e)).etat, 'ouvert');
  assert.equal((await lire(a.e)).etat, 'revoque');
});

await test('la délégation décide : la trace dit qui a validé et par délégation de qui', async () => {
  const s = await scene();
  const a = await creer(s, 'delegation', 'Anne Kerbrat', 'anne@exemple.fr', 'adjointe à la culture');
  const r = await repondre(a.e, 'accord');
  assert.deepEqual([r.decision, r.statut, r.par], [true, 'validee', s.r]);
  const h = await un(`select detail, par from historique where demande_id = $1 and statut = 'validee'`, [s.d]);
  assert.equal(h.detail, 'Validée par Anne Kerbrat (adjointe à la culture), par délégation');
  const inv = await un(`select texte, systeme from message where demande_id = $1`, [s.d]);
  assert.deepEqual([inv.texte, inv.systeme], ['Yann Le Gall confie la validation à Anne Kerbrat (adjointe à la culture).', true]);
  // l'historique ne reçoit que le changement de statut : le délai de rappel du pilote n'est pas relancé
  assert.equal((await un(`select count(*)::int as n from historique where demande_id = $1`, [s.d])).n, 1);
});

await test('un avis ne décide rien : il s’ajoute aux échanges et la demande reste à valider', async () => {
  const s = await scene();
  const a = await creer(s, 'avis', 'Paul Morvan', 'paul@exemple.fr');
  const r = await repondre(a.e, 'correction', 'Le logo du partenaire manque.');
  assert.deepEqual([r.decision, r.statut], [false, 'a_valider']);
  assert.deepEqual(await demande(s.d), { statut: 'a_valider', corrections: 0 });
  const m = await un(`select texte, systeme, auteur_id from message where demande_id = $1 order by creee desc, texte limit 1`, [s.d]);
  assert.equal((await un(`select count(*)::int as n from message where demande_id = $1`, [s.d])).n, 2);
  assert.equal((await un(`select count(*)::int as n from historique where demande_id = $1`, [s.d])).n, 0);
  assert.equal(m.texte, 'Avis de Paul Morvan : à corriger. « Le logo du partenaire manque. »');
  assert.deepEqual([m.systeme, m.auteur_id], [true, null]);
});

await test('une nouvelle version rend les anciens liens sans objet', async () => {
  const s = await scene(); const l = await creer(s, 'referent');
  await db.query(`insert into version_livrable (demande_id, organisation_id, numero) values ($1, $2, 2)`, [s.d, s.o]);
  assert.equal((await lire(l.e)).etat, 'depasse');
  await refuse(() => repondre(l.e, 'accord'), /n'attend plus de réponse/);
  assert.equal((await demande(s.d)).statut, 'a_valider');
});

await test('un lien retiré ne répond plus ; un jeton inconnu ne révèle rien', async () => {
  const s = await scene(); const l = await creer(s, 'avis', 'Paul Morvan', 'paul@exemple.fr');
  await db.query(`select relecture_retirer($1)`, [l.id]);
  assert.equal((await lire(l.e)).etat, 'revoque');
  await refuse(() => repondre(l.e, 'accord'), /retiré/);
  assert.deepEqual(await lire(E(999999)), { etat: 'inconnu' });
});

await test('aucun lien pour une demande qui n’attend pas de validation, ni pour un usage ou une adresse invalides', async () => {
  const s = await scene();
  await db.query(`update demande set statut = 'production' where id = $1`, [s.d]);
  await refuse(() => creer(s, 'referent'), /n'attend pas de validation/);
  await db.query(`update demande set statut = 'a_valider' where id = $1`, [s.d]);
  await refuse(() => creer(s, 'autre'), /Usage inconnu/);
  await refuse(() => creer(s, 'avis', 'Paul Morvan', 'pas-une-adresse'), /check|contrainte|violates/i);
});

await test('les fonctions sont réservées au serveur', async () => {
  const s = await scene(); const l = await creer(s, 'referent');
  await db.exec(`select set_config('test.role', 'authenticated', false); select set_config('test.uid', '${s.r}', false);`);
  await refuse(() => lire(l.e), /Réservé au serveur/);
  await refuse(() => repondre(l.e, 'accord'), /Réservé au serveur/);
  await refuse(() => creer(s, 'avis', 'Paul Morvan', 'paul@exemple.fr'), /Réservé au serveur/);
  await db.exec(`set role authenticated`);
  await refuse(() => db.query(`select relecture_lire($1)`, [l.e]), /permission denied/);
  await serveur();
});

await test('étanchéité : un compte ne voit que les liens de son organisation, jamais l’empreinte, et n’écrit rien', async () => {
  const a = await scene(); const b = await scene();
  await creer(a, 'avis', 'Paul Morvan', 'paul@exemple.fr'); await creer(b, 'avis', 'Lena Riou', 'lena@exemple.fr');
  await db.exec(`select set_config('test.role', 'authenticated', false); select set_config('test.uid', '${a.r}', false); set role authenticated;`);
  const vus = (await db.query(`select organisation_id, nom from lien_relecture`)).rows;
  assert.deepEqual(vus.map((x) => [x.organisation_id, x.nom]), [[a.o, 'Paul Morvan']]);
  await refuse(() => db.query(`select empreinte from lien_relecture`), /permission denied/);
  await refuse(() => db.query(`update lien_relecture set reponse = 'accord'`), /permission denied/);
  await refuse(() => db.query(`insert into lien_relecture (demande_id, organisation_id, version_id, usage, nom, email, empreinte, expire) values ($1, $2, $3, 'avis', 'X Y', 'x@y.fr', $4, now())`, [a.d, a.o, a.v, E(424242)]), /permission denied/);
  await db.exec(`set role anon`);
  await refuse(() => db.query(`select id from lien_relecture`), /permission denied/);
  await serveur();
});

// règles communes à la fonction « relecture » et à « notifier »
const dossier = mkdtempSync(join(tmpdir(), 'relecture-'));
const { outputFiles } = await build({ entryPoints: [join(ici, '..', 'functions', '_partage', 'regles', 'relecture.ts')], bundle: true, format: 'esm', write: false, logLevel: 'error' });
writeFileSync(join(dossier, 'regles.mjs'), outputFiles[0].text);
const R = await import(pathToFileURL(join(dossier, 'regles.mjs')).href);

await test('jeton : 256 bits, jamais deux fois le même, empreinte SHA-256 stable', async () => {
  const a = R.nouveauJeton(), b = R.nouveauJeton();
  assert.ok(R.JETON.test(a) && R.JETON.test(b) && a !== b);
  assert.equal(await R.empreinte('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(R.lienPage('https://fill.studioes.fr/espace/', a), `https://fill.studioes.fr/espace/relecture/#j=${a}`);
});

await test('saisies : invitation et réponse nettoyées, refus motivés', async () => {
  assert.deepEqual(R.invitation({ usage: 'avis', nom: '  Anne   Kerbrat ', fonction: '', email: ' Anne@Exemple.FR ' }), { usage: 'avis', nom: 'Anne Kerbrat', fonction: null, email: 'anne@exemple.fr' });
  assert.match(R.invitation({ usage: 'referent', nom: 'Anne', email: 'a@b.fr' }).erreur, /Choisissez/);
  assert.match(R.invitation({ usage: 'avis', nom: 'A', email: 'a@b.fr' }).erreur, /nom/);
  assert.match(R.invitation({ usage: 'delegation', nom: 'Anne', email: 'anne@' }).erreur, /adresse/);
  assert.deepEqual(R.reponse({ reponse: 'accord', remarque: '' }), { reponse: 'accord', remarque: null });
  assert.match(R.reponse({ reponse: 'correction', remarque: ' ' }).erreur, /corriger/);
  assert.match(R.reponse({ reponse: 'valider' }).erreur, /inconnue/);
});

await test('seul le référent, ou son suppléant dans sa période, peut faire relire depuis l’Espace', async () => {
  const p = (x) => ({ actif: true, organisation_id: 'o1', role: 'contributeur', ...x });
  assert.equal(R.peutInviter(p({ role: 'referent' }), 'o1', '2026-11-11'), true);
  assert.equal(R.peutInviter(p({ role: 'referent' }), 'o2', '2026-11-11'), false);
  assert.equal(R.peutInviter(p({ role: 'referent', actif: false }), 'o1', '2026-11-11'), false);
  assert.equal(R.peutInviter(p({}), 'o1', '2026-11-11'), false);
  assert.equal(R.peutInviter(p({ suppleant_jusqu_au: '2026-11-20' }), 'o1', '2026-11-11'), true);
  assert.equal(R.peutInviter(p({ suppleant_jusqu_au: '2026-11-10' }), 'o1', '2026-11-11'), false);
});

console.log(`\n${passes} tests passés${process.exitCode ? ', des échecs ci-dessus' : ''}`);
