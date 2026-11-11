// Tests du mail mensuel unique : la migration tourne dans un Postgres embarqué (PGlite), sur un schéma réduit
// aux tables qu'elle lit, puis les règles communes (functions/_partage/regles/bilan.ts) sont contrôlées.
//
//   cd supabase && npm i --no-save @electric-sql/pglite && node tests/bilan.test.mjs
//
// Le schéma réduit reprend les colonnes, les contraintes et les fonctions réelles relevées dans la base le
// 11 novembre 2026 (information_schema, pg_constraint, pg_get_functiondef) : contraintes du registre et de
// l'historique, vue etat_periode, période anniversaire (periode_org, debut_periode_org, fin_periode_org),
// jours ouvrés (est_ouvre, paques), journaliser, rôles. La clôture reprend la partie de prive._cloturer qui
// écrit l'expiration et le report.
import { PGlite } from '@electric-sql/pglite';
import { build, stop } from 'esbuild';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { aJour } from '../calendrier-type.mjs';

const ici = dirname(fileURLToPath(import.meta.url));
const db = new PGlite();
let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.message}`); process.exitCode = 1; } };
const refuse = async (f, motif) => { let m = null; try { await f(); } catch (e) { m = e.message; } assert.ok(m && motif.test(m), `refus attendu (${motif}), obtenu : ${m}`); };

await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema auth; create schema prive;
  create function auth.role() returns text language sql stable as $$ select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $$;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;

  create table organisation (
    id uuid primary key default gen_random_uuid(), nom text not null,
    type text not null check (type = any (array['collectivite', 'entreprise'])),
    formule text not null, debut date not null default '2026-01-01',
    statut text not null default 'a_activer' check (statut = any (array['a_activer', 'active', 'resiliee'])),
    essai boolean not null default false, fin date, mails_auto boolean not null default true,
    relais_semaine boolean not null default false, anniversaire date, creee timestamptz not null default now());
  create table profil (
    id uuid primary key default gen_random_uuid(), nom text not null, email text not null,
    role text not null check (role = any (array['admin', 'producteur', 'referent', 'contributeur', 'lecteur'])),
    organisation_id uuid references organisation(id), suppleant_jusqu_au date, actif boolean not null default true,
    creee timestamptz not null default now(),
    check ((role = any (array['admin', 'producteur'])) = (organisation_id is null)));
  create table prestation (offre_id text not null, id text not null, nom text not null, unites integer not null, primary key (offre_id, id));
  create sequence demande_numero;
  create table demande (
    id uuid primary key default gen_random_uuid(), numero integer not null default nextval('demande_numero'),
    organisation_id uuid not null references organisation(id), auteur_id uuid not null references profil(id),
    titre text not null check (length(titre) >= 3 and length(titre) <= 140), offre_id text not null default 'o1',
    urgente boolean not null default false, parution date, brief text not null default '',
    statut text not null default 'deposee' check (statut = any (array['deposee', 'accord_requis', 'confirmee', 'production', 'a_valider', 'correction', 'validee', 'livree', 'attente_client', 'annulee'])),
    unites integer, livraison date, corrections integer not null default 0,
    creee timestamptz not null default now(), maj timestamptz not null default now());
  create table demande_ligne (
    demande_id uuid not null references demande(id) on delete cascade, organisation_id uuid not null references organisation(id),
    offre_id text not null, prestation text not null, quantite integer not null check (quantite >= 1 and quantite <= 99), unites integer not null,
    primary key (demande_id, prestation), foreign key (offre_id, prestation) references prestation(offre_id, id));
  create table historique (
    id bigserial primary key, demande_id uuid not null references demande(id) on delete cascade, organisation_id uuid not null,
    statut text not null, type text not null default 'statut' constraint historique_type_check check (type = any (array['statut', 'modification', 'relance', 'pilote', 'lien'])),
    detail text, par uuid, date timestamptz not null default now());
  create table registre (
    id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id),
    periode text not null check (periode ~ '^\\d{4}-\\d{2}$'),
    type text not null check (type = any (array['credit', 'report', 'expiration', 'ajustement', 'debit'])),
    unites integer not null, demande_id uuid references demande(id), commande_id uuid,
    etat text check (etat = any (array['reserve', 'consomme', 'restitue'])),
    source text check (source = any (array['offert', 'commande', 'correction'])), motif text,
    date timestamptz not null default now(),
    check ((type = 'debit') = ((demande_id is not null) and (etat is not null))),
    check ((type = 'ajustement') = ((source is not null) and (motif is not null))));
  create view etat_periode as
    select organisation_id, periode,
      coalesce(sum(unites) filter (where type = 'credit'), 0) as quota,
      coalesce(sum(unites) filter (where type = 'report'), 0) as report,
      coalesce(sum(unites) filter (where type = 'ajustement'), 0) as ajustements,
      coalesce(sum(unites) filter (where type = 'debit' and etat = 'reserve'), 0) as reserve,
      coalesce(sum(unites) filter (where type = 'debit' and etat = 'consomme'), 0) as consomme,
      coalesce(sum(unites) filter (where type = any (array['credit', 'report', 'ajustement'])), 0)
        - coalesce(sum(unites) filter (where type = 'debit' and (etat = any (array['reserve', 'consomme']))), 0) as disponible
    from registre group by organisation_id, periode;
  create table cloture (organisation_id uuid not null, periode text not null, date timestamptz not null default now(), primary key (organisation_id, periode));
  create table parametre (id boolean primary key default true check (id), capacite_semaine integer not null default 30, pilote_facturation boolean not null default false);
  insert into parametre default values;
  create table fermeture (id uuid primary key default gen_random_uuid(), debut date not null, fin date not null, motif text);
  create table journal (id bigserial primary key, organisation_id uuid, acteur uuid, action text not null, cible text, details jsonb, date timestamptz not null default now());

  create function journaliser(org uuid, act text, cib text, det jsonb default null) returns void language sql security definer set search_path to 'public'
    as $$ insert into journal (organisation_id, acteur, action, cible, details) values (org, auth.uid(), act, cib, det) $$;
  create function est_admin() returns boolean language sql stable security definer set search_path to 'public' as $$ select coalesce((select role = 'admin' from profil where id = auth.uid() and actif), false) $$;
  create function est_equipe() returns boolean language sql stable security definer set search_path to 'public' as $$ select coalesce((select role in ('admin','producteur') from profil where id = auth.uid() and actif), false) $$;
  create function mon_organisation() returns uuid language sql stable security definer set search_path to 'public' as $$ select organisation_id from profil where id = auth.uid() and actif $$;
  create function peut_valider(org uuid) returns boolean language sql stable security definer set search_path to 'public'
    as $$ select exists(select 1 from profil where id = auth.uid() and actif and organisation_id = org and (role = 'referent' or (suppleant_jusqu_au is not null and suppleant_jusqu_au >= current_date))) $$;

  create function paques(an integer) returns date language plpgsql immutable set search_path to 'public' as $$
  declare a int; b int; c int; d int; e int; f int; g int; h int; i int; k int; l int; m int;
  begin
    a := an % 19; b := an / 100; c := an % 100; d := b / 4; e := b % 4; f := (b + 8) / 25;
    g := (b - f + 1) / 3; h := (19*a + b - d - g + 15) % 30; i := c / 4; k := c % 4;
    l := (32 + 2*e + 2*i - h - k) % 7; m := (a + 11*h + 22*l) / 451;
    return make_date(an, (h + l - 7*m + 114) / 31, ((h + l - 7*m + 114) % 31) + 1);
  end $$;
  create function est_ouvre(j date) returns boolean language plpgsql stable set search_path to 'public' as $$
  declare an int := extract(year from j); p date := paques(an);
  begin
    if extract(isodow from j) >= 6 then return false; end if;
    if to_char(j, 'MM-DD') in ('01-01','05-01','05-08','07-14','08-15','11-01','11-11','12-25') then return false; end if;
    if j in (p + 1, p + 39, p + 50) then return false; end if;
    return not exists (select 1 from fermeture where j between debut and fin);
  end $$;

  create function prive._jour_echeance(anc date, an integer, mo integer) returns date language sql immutable set search_path to 'public' as $$
    select make_date(an, mo, least(extract(day from anc)::int, extract(day from (make_date(an, mo, 1) + interval '1 month - 1 day'))::int)) $$;
  create function prive._mois_suivant(per text) returns text language sql immutable set search_path to 'public' as $$ select to_char(to_date(per || '-01', 'YYYY-MM-DD') + interval '1 month', 'YYYY-MM') $$;
  create function prive.aujourdhui() returns date language sql stable set search_path to 'public' as $$ select (now() at time zone 'Europe/Paris')::date $$;
  create function periode_org(org uuid, j date default null) returns text language plpgsql stable security definer set search_path to 'public' as $$
  declare anc date; d date := coalesce(j, prive.aujourdhui());
  begin
    select anniversaire into anc from organisation where id = org;
    if anc is null then return to_char(d, 'YYYY-MM'); end if;
    if d >= prive._jour_echeance(anc, extract(year from d)::int, extract(month from d)::int) then return to_char(d, 'YYYY-MM'); end if;
    return to_char(d - interval '1 month', 'YYYY-MM');
  end $$;
  create function debut_periode_org(org uuid, per text) returns date language plpgsql stable security definer set search_path to 'public' as $$
  declare anc date; d date;
  begin
    select anniversaire into anc from organisation where id = org;
    if per ~ '^\\d{4}-S\\d{2}$' then
      d := to_date(substr(per, 1, 4) || '-' || substr(per, 7, 2) || '-1', 'IYYY-IW-ID');
      return case when anc is null then d else d + (extract(isodow from anc)::int - 1) end;
    end if;
    if anc is null then return to_date(per || '-01', 'YYYY-MM-DD'); end if;
    return prive._jour_echeance(anc, substr(per, 1, 4)::int, substr(per, 6, 2)::int);
  end $$;
  create function fin_periode_org(org uuid, per text) returns date language sql stable security definer set search_path to 'public' as $$
    select case when per ~ '^\\d{4}-S\\d{2}$' then debut_periode_org(org, per) + 6 else debut_periode_org(org, prive._mois_suivant(per)) - 1 end $$;

  -- clôture d'une période : partie de prive._cloturer qui écrit l'expiration du report et le report du quota
  create function cloturer_test(org uuid, per text) returns void language plpgsql as $$
  declare e record; reste_report int; reste_quota int; suivant text := prive._mois_suivant(per);
  begin
    insert into cloture (organisation_id, periode) values (org, per) on conflict do nothing;
    if found then
      select * into e from etat_periode where organisation_id = org and periode = per;
      if e is not null then
        reste_report := greatest(0, e.report - (e.reserve + e.consomme));
        reste_quota := greatest(0, least(e.quota + e.ajustements, e.disponible - reste_report));
        if reste_report > 0 then insert into registre (organisation_id, periode, type, unites, motif) values (org, per, 'expiration', -reste_report, 'Report non utilisé'); end if;
        if reste_quota > 0 then insert into registre (organisation_id, periode, type, unites, motif) values (org, suivant, 'report', reste_quota, 'Report de la période précédente'); end if;
      end if;
    end if;
  end $$;

  grant usage on schema public, auth to anon, authenticated, service_role;
  grant select on organisation, profil, demande, registre to authenticated;
  insert into prestation (offre_id, id, nom, unites) values
    ('o1', 'post', 'Publication réseaux sociaux', 1), ('o1', 'actu', 'Actualité sur le site', 1), ('o1', 'news', 'Newsletter', 3),
    ('o1', 'affiche', 'Affiche en création', 4), ('o1', 'flyer', 'Flyer ou programme recto verso', 5);
`);
await db.exec(readFileSync(join(ici, '..', 'migrations', '2026-11-bilan-mensuel.sql'), 'utf8'));
// la migration se rejoue sans erreur
await db.exec(readFileSync(join(ici, '..', 'migrations', '2026-11-bilan-mensuel.sql'), 'utf8'));

const un = async (q, p = []) => (await db.query(q, p)).rows[0];
const tous = async (q, p = []) => (await db.query(q, p)).rows;
const serveur = () => db.exec(`reset role; select set_config('test.role', 'service_role', false); select set_config('test.uid', '', false);`);
const compte = (uid) => db.exec(`select set_config('test.role', 'authenticated', false); select set_config('test.uid', '${uid}', false); set role authenticated;`);
const E = (n) => String(n).padStart(64, '0');
let n = 0;
const iso = (d) => (d instanceof Date ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : d);

// une commune abonnée le 12 du mois : la période « 2026-10 » court du 12 octobre au 11 novembre 2026
const organisation = async (plus = {}) => {
  await serveur();
  const v = { nom: 'Commune de Saint-Ivenec', type: 'collectivite', formule: 'essentiel', statut: 'active', anniversaire: '2026-06-12', mails_auto: true, fin: null, ...plus };
  const o = await un(`insert into organisation (nom, type, formule, statut, anniversaire, mails_auto, fin) values ($1, $2, $3, $4, $5, $6, $7) returning id`, [v.nom, v.type, v.formule, v.statut, v.anniversaire, v.mails_auto, v.fin]);
  const r = await un(`insert into profil (nom, email, role, organisation_id) values ('Yann Le Gall', 'yann@exemple.fr', 'referent', $1) returning id`, [o.id]);
  return { o: o.id, r: r.id };
};
const credit = (s, periode, unites, type = 'credit') => db.query(`insert into registre (organisation_id, periode, type, unites) values ($1, $2, $3, $4)`, [s.o, periode, type, unites]);
// une demande et son parcours : étapes = [[statut, 'AAAA-MM-JJ hh:mm' (heure de Paris), type]]
const demande = async (s, titre, { unites = 1, etat = 'consomme', periode = '2026-10', livraison = null, lignes = { post: 1 }, etapes = [], parution = null, creee = '2026-10-13 09:00' } = {}) => {
  const statut = etapes.length ? etapes.at(-1)[0] : 'confirmee';
  const d = await un(`insert into demande (organisation_id, auteur_id, titre, statut, unites, livraison, parution, creee) values ($1, $2, $3, $4, $5, $6, $7, $8::timestamp at time zone 'Europe/Paris') returning id`, [s.o, s.r, titre, statut, unites, livraison, parution, creee]);
  for (const [p, q] of Object.entries(lignes)) await db.query(`insert into demande_ligne (demande_id, organisation_id, offre_id, prestation, quantite, unites) values ($1, $2, 'o1', $3, $4, $4)`, [d.id, s.o, p, q]);
  for (const [st, quand, type = 'statut'] of etapes) await db.query(`insert into historique (demande_id, organisation_id, statut, type, date) values ($1, $2, $3, $4, $5::timestamp at time zone 'Europe/Paris')`, [d.id, s.o, st, type, quand]);
  if (etat) await db.query(`insert into registre (organisation_id, periode, type, unites, demande_id, etat) values ($1, $2, 'debit', $3, $4, $5)`, [s.o, periode, unites, d.id, etat]);
  return d.id;
};
const parcours = (remise, reponse, livree) => [['confirmee', '2026-10-13 10:00'], ['a_valider', remise], ['validee', reponse], ['livree', livree]];
const calculer = async (s, periode = '2026-10') => (await un(`select bilan_calculer($1, $2) as v`, [s.o, periode])).v;
const cloturer = (s, periode = '2026-10') => db.query(`select cloturer_test($1, $2)`, [s.o, periode]);
const preparer = async (s, suggestions = [], periode = '2026-10') => (await un(`select bilan_preparer($1, $2, $3::jsonb) as v`, [s.o, periode, JSON.stringify(suggestions)])).v;
const lire = async (e) => (await un(`select bilan_lire($1) as v`, [e])).v;
const file = async () => (await un(`select bilan_a_envoyer() as v`)).v;
const reserver = async (id) => { const e = E(++n); return { e, r: (await un(`select bilan_reserver_envoi($1, $2) as v`, [id, e])).v }; };
const sug = (cle, unites, titre = 'Marché de Noël') => ({ cle, source: 'calendrier', titre, date: '2026-12-06', qte: { affiche: 1 }, libelle: 'Affiche', unites, limite: '2026-11-26', pourquoi: 'Repère.' });

// période type : 10 unités de quota et 2 de report ; trois demandes livrées, une en production
const scene = async (plus) => {
  const s = await organisation(plus);
  await credit(s, '2026-10', 10); await credit(s, '2026-10', 2, 'report');
  s.a = await demande(s, 'Forum des associations : annonce', { unites: 3, lignes: { post: 2, actu: 1 }, livraison: '2026-10-20', etapes: parcours('2026-10-19 16:00', '2026-10-20 09:30', '2026-10-21 11:00') });
  s.b = await demande(s, 'Affiche du marché d’automne', { unites: 4, lignes: { affiche: 1 }, livraison: '2026-10-20', etapes: parcours('2026-10-22 17:00', '2026-10-22 18:00', '2026-10-23 10:00') });
  s.c = await demande(s, 'Lettre d’octobre', { unites: 3, lignes: { news: 1 }, etapes: parcours('2026-11-03 10:00', '2026-11-04 10:00', '2026-11-05 10:00') });
  s.d = await demande(s, 'Travaux de la rue du Stade', { unites: 1, etat: 'reserve', livraison: '2026-11-13', etapes: [['confirmee', '2026-11-09 10:00'], ['production', '2026-11-10 10:00']], creee: '2026-11-09 09:00' });
  return s;
};

await test('chiffres d’une période : demandes livrées, livrables par type, liste datée, unités égales au registre', async () => {
  const s = await scene();
  await cloturer(s);
  const b = await calculer(s);
  assert.deepEqual([iso(b.debut), iso(b.fin), b.periode], ['2026-10-12', '2026-11-11', '2026-10']);
  assert.equal(b.demandes_livrees, 3);
  assert.deepEqual(b.livrables.map((l) => [l.prestation, l.quantite]), [['post', 2], ['actu', 1], ['affiche', 1], ['news', 1]]);
  assert.deepEqual(b.livre.map((l) => [l.titre, l.date, l.unites]), [['Forum des associations : annonce', '2026-10-21', 3], ['Affiche du marché d’automne', '2026-10-23', 4], ['Lettre d’octobre', '2026-11-05', 3]]);
  assert.deepEqual(b.livre[0].lignes, [{ nom: 'Publication réseaux sociaux', quantite: 2 }, { nom: 'Actualité sur le site', quantite: 1 }]);
  assert.deepEqual(b.en_cours.map((x) => [x.titre, x.statut, x.livraison]), [['Travaux de la rue du Stade', 'production', '2026-11-13']]);
  // les unités sont celles du registre, à l'unité près
  const e = await un(`select quota::int, report::int, reserve::int, consomme::int, disponible::int from etat_periode where organisation_id = $1 and periode = '2026-10'`, [s.o]);
  assert.deepEqual(b.unites, { quota: e.quota, report: e.report, ajustements: 0, total: 12, utilisees: e.reserve + e.consomme, reservees: 1, reportees: 1, expirees: 0 });
  assert.equal(b.unites.utilisees + b.unites.reportees + b.unites.expirees, b.unites.total);
  // la période qui commence : le report écrit par la clôture, pas encore de quota crédité
  assert.deepEqual([b.suivante.periode, iso(b.suivante.debut), iso(b.suivante.fin), b.suivante.disponible, b.suivante.report], ['2026-11', '2026-11-12', '2026-12-11', 1, 1]);
  assert.equal(/heure|minute|audience|vue/i.test(JSON.stringify(Object.keys(b))), false);
});

await test('un report non utilisé expire, et le bilan le dit', async () => {
  const s = await organisation();
  await credit(s, '2026-10', 10); await credit(s, '2026-10', 3, 'report');
  await demande(s, 'Agenda de novembre', { unites: 1, livraison: '2026-10-20', etapes: parcours('2026-10-20 10:00', '2026-10-20 15:00', '2026-10-21 10:00') });
  await cloturer(s);
  await credit(s, '2026-11', 10);
  const b = await calculer(s);
  assert.deepEqual([b.unites.total, b.unites.utilisees, b.unites.expirees, b.unites.reportees], [13, 1, 2, 10]);
  assert.deepEqual([b.suivante.disponible, b.suivante.report], [20, 10]);
});

await test('un retard de Fill apparaît tel quel, en jours ouvrés ; une demande sans date annoncée n’entre pas dans le calcul', async () => {
  const s = await scene();
  const b = await calculer(s);
  assert.deepEqual(b.delais, { a_la_date: 1, total: 2, sans_date: 1, validations: 3, validation_jours: 0.7 });
  const [a, m, l] = b.livre;
  assert.deepEqual([a.annoncee, a.remise, a.retard_jours], ['2026-10-20', '2026-10-19', 0]);
  assert.deepEqual([m.annoncee, m.remise, m.retard_jours], ['2026-10-20', '2026-10-22', 2]);
  assert.deepEqual([l.annoncee, l.retard_jours], [null, null]);
});

await test('validation côté client : jours ouvrés entre la remise et la réponse ; les rappels ne comptent pas, un accord par lien compte', async () => {
  const s = await organisation();
  await credit(s, '2026-10', 10);
  // remise le vendredi 23, rappel le mardi 27, corrections le mercredi 28 (3 jours ouvrés), nouvelle version et accord par lien le jeudi 29 (0)
  await demande(s, 'Bulletin : page des associations', { unites: 2, etapes: [['a_valider', '2026-10-23 17:00'], ['a_valider', '2026-10-27 09:00', 'relance'], ['correction', '2026-10-28 11:00'], ['a_valider', '2026-10-29 10:00'], ['validee', '2026-10-29 15:00', 'lien'], ['livree', '2026-10-30 10:00']] });
  // remise avant le pont du 11 novembre : mardi 10 → jeudi 12, un seul jour ouvré, mais la réponse tombe dans la période suivante
  await demande(s, 'Commémoration : annonce', { unites: 1, etapes: [['a_valider', '2026-11-10 10:00'], ['validee', '2026-11-12 10:00']] });
  const b = await calculer(s);
  assert.deepEqual([b.delais.validations, b.delais.validation_jours], [2, 1.5]);
  const suivant = await calculer(s, '2026-11');
  assert.deepEqual([suivant.delais.validations, suivant.delais.validation_jours], [1, 1]);
});

await test('bornes de la période, à l’heure de Paris : le premier et le dernier jour comptent, la veille et le lendemain non', async () => {
  const s = await organisation();
  await credit(s, '2026-10', 10);
  await demande(s, 'Livrée la veille', { etapes: parcours('2026-10-09 10:00', '2026-10-09 11:00', '2026-10-11 23:30') });
  await demande(s, 'Livrée le premier jour', { etapes: parcours('2026-10-09 10:00', '2026-10-09 11:00', '2026-10-12 00:30') });
  await demande(s, 'Livrée le dernier jour', { etapes: parcours('2026-11-09 10:00', '2026-11-09 11:00', '2026-11-11 23:30') });
  await demande(s, 'Livrée le lendemain', { etapes: parcours('2026-11-09 10:00', '2026-11-09 11:00', '2026-11-12 00:30') });
  await demande(s, 'Annulée', { etat: 'restitue', etapes: [['annulee', '2026-10-20 10:00']] });
  const b = await calculer(s);
  assert.deepEqual(b.livre.map((l) => l.titre), ['Livrée le premier jour', 'Livrée le dernier jour']);
  assert.equal(b.unites.utilisees, 4, 'une unité restituée n’est pas utilisée');
  assert.deepEqual(b.en_cours, []);
});

await test('candidats : période close et clôturée, abonnement actif, dix jours au plus, un seul bilan', async () => {
  const s = await scene();
  const candidats = async (jour) => (await un(`select bilan_candidats($1) as v`, [jour])).v.filter((c) => c.organisation === s.o);
  assert.deepEqual(await candidats('2026-11-12'), [], 'pas avant la clôture');
  await cloturer(s);
  assert.deepEqual(await candidats('2026-11-12'), [{ organisation: s.o, periode: '2026-10' }]);
  assert.deepEqual(await candidats('2026-11-11'), [], 'la période précédente du 11 novembre est celle de septembre');
  assert.deepEqual(await candidats('2026-11-21'), [{ organisation: s.o, periode: '2026-10' }]);
  assert.deepEqual(await candidats('2026-11-22'), [], 'pas de bilan en retard de plus de dix jours');
  await db.query(`update organisation set statut = 'resiliee' where id = $1`, [s.o]);
  assert.deepEqual(await candidats('2026-11-12'), []);
  await db.query(`update organisation set statut = 'active' where id = $1`, [s.o]);
  await preparer(s);
  assert.deepEqual(await candidats('2026-11-12'), [], 'un bilan existe déjà');
  // une période sans quota crédité n'a pas de bilan
  const t = await organisation();
  await cloturer(t);
  assert.deepEqual((await un(`select bilan_candidats('2026-11-12') as v`)).v.filter((c) => c.organisation === t.o), []);
});

await test('un bilan est figé : un second calcul ne le remplace pas, même si le registre change', async () => {
  const s = await scene(); await cloturer(s);
  const neuve = await organisation();
  await refuse(() => preparer(neuve), /non clôturée/);
  const p = await preparer(s, [sug('c-1', 1)]);
  assert.equal(p.cree, true);
  const avant = await un(`select donnees, debut, fin from bilan where id = $1`, [p.id]);
  assert.deepEqual([iso(avant.debut), iso(avant.fin), avant.donnees.demandes_livrees, avant.donnees.suggestions.length], ['2026-10-12', '2026-11-11', 3, 1]);
  await credit(s, '2026-10', 5);
  const q = await preparer(s, []);
  assert.deepEqual(q, { cree: false, id: p.id });
  assert.deepEqual((await un(`select donnees from bilan where id = $1`, [p.id])).donnees, avant.donnees);
  assert.equal((await un(`select count(*)::int as n from journal where action = 'bilan' and cible = $1`, [p.id])).n, 1);
});

await test('les suggestions ne dépassent jamais les unités disponibles : la base refuse, quel que soit le solde', async () => {
  const s = await scene(); await cloturer(s);                       // 1 unité disponible sur la période suivante
  await refuse(() => preparer(s, [sug('c-1', 1), sug('c-2', 1)]), /dépassent les unités disponibles \(2 pour 1\)/);
  await refuse(() => preparer(s, [sug('c-1', 2)]), /dépassent/);
  await refuse(() => preparer(s, [sug('c-1', 1), sug('c-1', 0)]), /incomplète/);
  await refuse(() => preparer(s, [{ cle: 'c-1', unites: 1 }]), /incomplète/);
  await credit(s, '2026-11', 10);
  await refuse(() => preparer(s, [sug('c-1', 1), sug('c-1', 1)]), /en double/);
  await refuse(() => preparer(s, [sug('c-1', 1), sug('c-2', 1), sug('c-3', 1), sug('c-4', 1)]), /Trois suggestions au plus/);
  assert.equal((await preparer(s, [sug('c-1', 4), sug('c-2', 4), sug('c-3', 3)])).cree, true);
  // abonnement terminé : pas de période suivante, aucune suggestion possible
  const t = await scene({ fin: '2026-11-11' }); await cloturer(t);
  assert.equal((await calculer(t)).suivante, null);
  await refuse(() => preparer(t, [sug('c-1', 1)]), /dépassent/);
  assert.equal((await preparer(t, [])).cree, true);
});

await test('sans réglage automatique, rien ne part sans l’accord de Fill ; le lien de relecture s’ouvre une fois', async () => {
  const s = await scene(); await cloturer(s); await credit(s, '2026-11', 10);
  const { id } = await preparer(s, [sug('c-1', 4), sug('c-2', 4, 'Téléthon')]);
  let f = await file();
  assert.ok(f.a_relire.includes(id) && !f.prets.includes(id));
  assert.equal((await reserver(id)).r, null, 'pas d’envoi sans accord');
  const jr = E(++n);
  const o = (await un(`select bilan_ouvrir_relecture($1, $2) as v`, [id, jr])).v;
  assert.deepEqual([o.id, o.organisation.nom, o.referent], [id, 'Commune de Saint-Ivenec', 'Yann Le Gall']);
  assert.equal((await un(`select bilan_ouvrir_relecture($1, $2) as v`, [id, E(++n)])).v, null, 'un seul lien de relecture');
  assert.ok(!(await file()).a_relire.includes(id));
  // le mail de relecture a été refusé : le lien est rendu et sera recréé
  assert.equal((await un(`select bilan_fermer_relecture($1) as v`, [id])).v, true);
  assert.deepEqual(await lire(jr), { etat: 'inconnu' });
  assert.ok((await file()).a_relire.includes(id));
  const jr2 = E(++n);
  await db.query(`select bilan_ouvrir_relecture($1, $2)`, [id, jr2]);
  const vue = await lire(jr2);
  assert.deepEqual([vue.etat, vue.mode, vue.referent.nom, vue.approuve_le, vue.envoye_le, vue.donnees.suggestions.length], ['ouvert', 'relecture', 'Yann Le Gall', null, null, 2]);
  // accord, en retirant une suggestion
  await db.query(`select bilan_approuver($1, $2)`, [jr2, ['c-2']]);
  const apres = await lire(jr2);
  assert.deepEqual(apres.donnees.suggestions.map((x) => x.cle), ['c-1']);
  assert.ok(apres.approuve_le);
  f = await file();
  assert.ok(f.prets.includes(id) && !f.a_relire.includes(id));
  await refuse(() => db.query(`select bilan_approuver($1, $2)`, [E(999999), []]), /Lien inconnu/);
});

await test('un bilan ne part jamais deux fois : une seule réservation, confirmation unique, libération seulement avant l’envoi', async () => {
  const s = await scene(); await cloturer(s);
  const { id } = await preparer(s);
  const jr = E(++n);
  await db.query(`select bilan_ouvrir_relecture($1, $2)`, [id, jr]);
  await db.query(`select bilan_approuver($1, '{}')`, [jr]);
  const a = await reserver(id);
  assert.deepEqual([a.r.id, a.r.referent.email, a.r.organisation.nom, a.r.organisation.essai], [id, 'yann@exemple.fr', 'Commune de Saint-Ivenec', false]);
  assert.equal((await reserver(id)).r, null, 'une seconde réservation n’aboutit pas');
  let f = await file();
  assert.ok(!f.prets.includes(id) && f.bloques.includes(id), 'réservé sans confirmation : signalé, jamais retenté seul');
  assert.deepEqual(await lire(a.e), { etat: 'inconnu' }, 'le lien de partage ne s’ouvre pas avant l’envoi');
  // le service d'envoi refuse : la réservation est rendue, l'envoi repart
  assert.equal((await un(`select bilan_liberer_envoi($1) as v`, [id])).v, true);
  assert.ok((await file()).prets.includes(id));
  const b = await reserver(id);
  assert.equal((await un(`select bilan_confirmer_envoi($1, ' Yann@Exemple.fr ') as v`, [id])).v, true);
  assert.equal((await un(`select bilan_confirmer_envoi($1, 'yann@exemple.fr') as v`, [id])).v, false, 'une seule confirmation');
  assert.equal((await un(`select bilan_liberer_envoi($1) as v`, [id])).v, false, 'un bilan envoyé ne se libère pas');
  assert.equal((await reserver(id)).r, null);
  f = await file();
  assert.ok(!f.prets.includes(id) && !f.bloques.includes(id) && !f.a_relire.includes(id));
  assert.deepEqual(await un(`select envoye_a, envoye_le is not null as parti from bilan where id = $1`, [id]), { envoye_a: 'yann@exemple.fr', parti: true });
  assert.deepEqual(await lire(a.e), { etat: 'inconnu' }, 'le jeton de l’envoi refusé ne vaut plus rien');
  const vue = await lire(b.e);
  assert.deepEqual([vue.etat, vue.mode, vue.donnees.demandes_livrees, Object.keys(vue).includes('referent')], ['ouvert', 'partage', 3, false]);
  await refuse(() => db.query(`select bilan_approuver($1, '{}')`, [jr]), /déjà parti/);
  assert.equal((await un(`select count(*)::int as n from journal where action = 'bilan_envoye' and cible = $1`, [id])).n, 1);
});

await test('réglage pilote_bilan : envoi sans relecture, sauf pour une organisation qui refuse les envois automatiques', async () => {
  const s = await scene(); await cloturer(s);
  const t = await scene({ mails_auto: false }); await cloturer(t);
  const sans = await organisation(); await credit(sans, '2026-10', 10); await cloturer(sans);
  await db.query(`update profil set actif = false where organisation_id = $1`, [sans.o]);
  const [a, b, c] = [(await preparer(s)).id, (await preparer(t)).id, (await preparer(sans)).id];
  await db.exec(`update parametre set pilote_bilan = true`);
  const f = await file();
  assert.ok(f.prets.includes(a) && !f.prets.includes(b) && f.a_relire.includes(b) && !f.a_relire.includes(a));
  assert.equal((await reserver(a)).r.id, a);
  assert.equal((await reserver(b)).r, null);
  const r = (await reserver(c)).r;
  assert.deepEqual([r.erreur, r.organisation.nom], ['sans_referent', 'Commune de Saint-Ivenec']);
  assert.ok((await file()).prets.includes(c), 'sans référent actif, rien n’est réservé');
  await db.exec(`update parametre set pilote_bilan = false`);
});

await test('lien de partage : ouvert après l’envoi, fermé dès que le référent le retire ; un jeton inconnu ne révèle rien', async () => {
  const s = await scene(); await cloturer(s);
  const autre = await organisation({ nom: 'Menuiserie Kerbrat', type: 'entreprise' });
  const { id } = await preparer(s);
  await db.query(`update bilan set approuve_le = now() where id = $1`, [id]);
  const { e } = await reserver(id);
  await db.query(`select bilan_confirmer_envoi($1, 'yann@exemple.fr')`, [id]);
  assert.equal((await lire(e)).etat, 'ouvert');
  assert.deepEqual(await lire(E(999998)), { etat: 'inconnu' });
  // un autre client, un lecteur et un visiteur ne peuvent pas le retirer ; le référent, oui
  const lecteur = await un(`insert into profil (nom, email, role, organisation_id) values ('Lena Riou', 'lena@exemple.fr', 'lecteur', $1) returning id`, [s.o]);
  await db.exec(`grant execute on function bilan_revoquer(uuid) to authenticated`);
  for (const uid of [autre.r, lecteur.id]) {
    await compte(uid);
    await refuse(() => db.query(`select bilan_revoquer($1)`, [id]), /Bilan introuvable/);
  }
  await db.exec(`reset role; set role anon;`);
  await refuse(() => db.query(`select bilan_revoquer($1)`, [id]), /permission denied/);
  await compte(s.r);
  await db.query(`select bilan_revoquer($1)`, [id]);
  await serveur();
  assert.deepEqual(await lire(e), { etat: 'revoque' });
});

await test('les fonctions sont réservées au serveur', async () => {
  const s = await scene(); await cloturer(s);
  const { id } = await preparer(s);
  await db.exec(`select set_config('test.role', 'authenticated', false); select set_config('test.uid', '${s.r}', false);`);
  await refuse(() => calculer(s), /Réservé au serveur/);
  await refuse(() => preparer(s), /Réservé au serveur/);
  await refuse(() => lire(E(1)), /Réservé au serveur/);
  await refuse(() => file(), /Réservé au serveur/);
  await refuse(() => reserver(id), /Réservé au serveur/);
  await refuse(() => db.query(`select bilan_candidats()`), /Réservé au serveur/);
  await refuse(() => db.query(`select bilan_confirmer_envoi($1, 'x@y.fr')`, [id]), /Réservé au serveur/);
  await refuse(() => db.query(`select bilan_liberer_envoi($1)`, [id]), /Réservé au serveur/);
  await refuse(() => db.query(`select bilan_ouvrir_relecture($1, $2)`, [id, E(5)]), /Réservé au serveur/);
  await refuse(() => db.query(`select bilan_fermer_relecture($1)`, [id]), /Réservé au serveur/);
  await refuse(() => db.query(`select bilan_approuver($1, '{}')`, [E(5)]), /Réservé au serveur/);
  await db.exec(`set role authenticated`);
  for (const q of [`select bilan_calculer('${s.o}', '2026-10')`, `select bilan_lire('${E(1)}')`, `select bilan_a_envoyer()`, `select bilan_reserver_envoi('${id}', '${E(6)}')`, `select bilan_candidats()`])
    await refuse(() => db.query(q), /permission denied/);
  await serveur();
});

await test('étanchéité : un compte ne lit que les bilans envoyés de son organisation, jamais les empreintes, et n’écrit rien', async () => {
  const a = await scene(); await cloturer(a);
  const b = await scene({ nom: 'Commune de Lanvern' }); await cloturer(b);
  const [ia, ib] = [(await preparer(a)).id, (await preparer(b)).id];
  for (const id of [ia, ib]) await db.query(`update bilan set approuve_le = now() where id = $1`, [id]);
  await compte(a.r);
  assert.deepEqual(await tous(`select id from bilan`), [], 'un bilan qui n’est pas parti n’est pas visible du client');
  await serveur();
  for (const id of [ia, ib]) { await reserver(id); await db.query(`select bilan_confirmer_envoi($1, 'x@exemple.fr')`, [id]); }
  await compte(a.r);
  assert.deepEqual((await tous(`select id, organisation_id from bilan`)).map((x) => [x.id, x.organisation_id]), [[ia, a.o]]);
  await refuse(() => db.query(`select empreinte from bilan`), /permission denied/);
  await refuse(() => db.query(`select empreinte_relecture from bilan`), /permission denied/);
  await refuse(() => db.query(`select * from bilan`), /permission denied/);
  await refuse(() => db.query(`update bilan set revoque_le = null`), /permission denied/);
  await refuse(() => db.query(`delete from bilan`), /permission denied/);
  await refuse(() => db.query(`insert into bilan (organisation_id, periode, debut, fin, donnees) values ($1, '2026-09', '2026-09-12', '2026-10-11', '{}')`, [a.o]), /permission denied/);
  await db.exec(`reset role; set role anon;`);
  await refuse(() => db.query(`select id from bilan`), /permission denied/);
  await serveur();
  // l'équipe Fill voit tout, même avant l'envoi
  const admin = await un(`insert into profil (nom, email, role) values ('Ewen Soupault', 'ewen@exemple.fr', 'admin') returning id`);
  await compte(admin.id);
  assert.ok((await tous(`select id from bilan`)).length >= 2);
  await serveur();
});

// ---------- règles communes : suggestions, délais, plage d'envoi, textes du mail

const dossier = mkdtempSync(join(tmpdir(), 'bilan-'));
const { outputFiles } = await build({ entryPoints: [join(ici, '..', 'functions', '_partage', 'regles', 'bilan.ts')], bundle: true, format: 'esm', write: false, logLevel: 'error' });
writeFileSync(join(dossier, 'regles.mjs'), outputFiles[0].text);
const R = await import(pathToFileURL(join(dossier, 'regles.mjs')).href);

const commune = { type: 'collectivite', formule: 'essentiel' };
const novembre = { periode: '2026-11', debut: '2026-11-12', fin: '2026-12-11', disponible: 10, report: 0 };
const proposer = (plus = {}) => R.suggerer({ organisation: commune, jour: '2026-11-12', suivante: novembre, demandes: [], ...plus });
const total = (l) => l.reduce((s, x) => s + x.unites, 0);
const ancienne = (titre, plus = {}) => ({ id: `d-${titre}`, titre, statut: 'livree', parution: null, creee: '2025-11-20T10:00:00Z', lignes: [{ prestation: 'post', quantite: 1 }], ...plus });

await test('le calendrier type des fonctions est la copie exacte de assets/t.js', async () => {
  assert.equal(aJour(), true, 'relancer : node supabase/calendrier-type.mjs');
});

await test('suggestions : trois au plus, tirées du calendrier type de la période qui commence, chiffrées et datées', async () => {
  const l = proposer({ suivante: { ...novembre, disponible: 22 } });
  assert.deepEqual(l.map((x) => [x.titre, x.date, x.unites, x.limite, x.source]), [
    ['Lettre de fin d’année', '2026-11-22', 3, '2026-11-12', 'calendrier'],
    ['Téléthon', '2026-11-28', 6, '2026-11-19', 'calendrier'],
    ['Marché de Noël', '2026-12-06', 6, '2026-11-26', 'calendrier'],
  ]);
  assert.deepEqual(l[1].qte, { affiche: 1, post: 2 });
  assert.equal(l[1].libelle, 'Affiche et deux publications');
  assert.equal(l[1].pourquoi, 'Repère du calendrier type : autour du 28 novembre.');
  assert.equal(new Set(l.map((x) => x.cle)).size, 3);
  // une entreprise n'a pas les mêmes temps forts
  const e = R.suggerer({ organisation: { type: 'entreprise', formule: 'regulier' }, jour: '2026-11-12', suivante: { ...novembre, disponible: 22 }, demandes: [] });
  assert.deepEqual(e.map((x) => x.titre), ['Lettre clients', 'Bilan de l’année', 'Vœux aux clients']);
});

await test('le total ne dépasse jamais les unités disponibles : solde nul, report seul, période pleine', async () => {
  assert.deepEqual(proposer({ suivante: { ...novembre, disponible: 0 } }), []);
  assert.deepEqual(proposer({ suivante: { ...novembre, disponible: -3 } }), []);
  assert.deepEqual(proposer({ suivante: null }), []);
  const report = proposer({ suivante: { ...novembre, disponible: 2, report: 2 } });
  assert.deepEqual(report.map((x) => [x.titre, x.unites]), [['Horaires des fêtes', 2]]);
  for (let dispo = 0; dispo <= 45; dispo++) {
    for (const org of [commune, { type: 'entreprise', formule: 'soutenu' }, { type: 'collectivite', formule: 'regulier' }]) {
      const l = R.suggerer({ organisation: org, jour: '2026-11-12', suivante: { ...novembre, disponible: dispo }, demandes: [ancienne('Programme de Noël', { parution: '2025-12-12', lignes: [{ prestation: 'flyer', quantite: 1 }, { prestation: 'post', quantite: 2 }] })] });
      assert.ok(l.length <= 3 && total(l) <= dispo, `${dispo} unités : ${total(l)} suggérées`);
      assert.ok(l.every((x) => x.unites >= 1 && Object.keys(x.qte).length));
    }
  }
  assert.deepEqual(proposer({ suivante: { ...novembre, disponible: 10 } }).map((x) => x.unites), [3, 6], 'ce qui ne tient plus dans le solde est laissé de côté');
});

await test('historique : ce qui a été demandé à la même période l’an passé passe en premier', async () => {
  const noel = ancienne('Programme de Noël', { parution: '2025-12-12', lignes: [{ prestation: 'flyer', quantite: 1 }, { prestation: 'post', quantite: 2 }] });
  const sansDate = ancienne('Portrait du nouveau boulanger');
  const horsPeriode = ancienne('Fête de la musique', { parution: '2025-06-21' });
  const l = proposer({ suivante: { ...novembre, disponible: 22 }, demandes: [noel, sansDate, horsPeriode] });
  assert.deepEqual(l.map((x) => [x.titre, x.source, x.date, x.unites]), [
    ['Portrait du nouveau boulanger', 'historique', null, 1],
    ['Programme de Noël', 'historique', '2026-12-12', 7],
    ['Lettre de fin d’année', 'calendrier', '2026-11-22', 3],
  ]);
  assert.deepEqual([l[0].limite, l[0].pourquoi], [null, 'Vous l’aviez demandé l’an passé à la même période.']);
  assert.deepEqual([l[1].limite, l[1].pourquoi, l[1].libelle], ['2026-12-03', 'Vous l’aviez demandé l’an passé, pour le 12 décembre.', 'Flyer ou programme recto verso, Publication réseaux sociaux × 2']);
  // deux clients de même type et de même formule : des sélections différentes dès que leur historique diffère
  assert.notDeepEqual(l.map((x) => x.cle), proposer({ suivante: { ...novembre, disponible: 22 } }).map((x) => x.cle));
  // une demande annulée l'an passé ne revient pas
  assert.equal(proposer({ demandes: [{ ...sansDate, statut: 'annulee' }] }).some((x) => x.source === 'historique'), false);
});

await test('un sujet déjà demandé n’est pas suggéré, sauf si la demande a été annulée', async () => {
  const deja = { id: 'x', titre: 'téléthon', statut: 'production', parution: null, creee: '2026-11-05T09:00:00Z', lignes: [] };
  assert.equal(proposer({ suivante: { ...novembre, disponible: 22 }, demandes: [deja] }).some((x) => x.titre === 'Téléthon'), false);
  assert.equal(proposer({ suivante: { ...novembre, disponible: 22 }, demandes: [{ ...deja, statut: 'annulee' }] }).some((x) => x.titre === 'Téléthon'), true);
  assert.equal(proposer({ suivante: { ...novembre, disponible: 22 }, demandes: [{ ...deja, creee: '2026-08-01T09:00:00Z' }] }).some((x) => x.titre === 'Téléthon'), true, 'au-delà de 60 jours, ce n’est plus le même sujet');
  // demandé l'an passé et déjà redemandé cette année : ni l'historique ni le calendrier ne le reproposent
  const lettre = ancienne('Lettre de fin d’année', { parution: '2025-11-24', lignes: [{ prestation: 'news', quantite: 1 }] });
  const cetteAnnee = { id: 'y', titre: 'Lettre de fin d’année', statut: 'deposee', parution: '2026-11-23', creee: '2026-11-10T09:00:00Z', lignes: [] };
  assert.equal(proposer({ demandes: [lettre, cetteAnnee] }).some((x) => R.cleTitre(x.titre) === 'lettre de fin d annee'), false);
  // demandé l'an passé seulement : proposé une fois, depuis l'historique
  const une = proposer({ demandes: [lettre] }).filter((x) => R.cleTitre(x.titre) === 'lettre de fin d annee');
  assert.deepEqual(une.map((x) => x.source), ['historique']);
});

await test('formule et délai : rien qui ne soit ouvert à la formule, rien dont le délai ne peut plus être tenu', async () => {
  // reportage photo : à partir de la formule Régulier
  const octobre = { periode: '2026-09', debut: '2026-09-20', fin: '2026-10-19', disponible: 45 };
  const titres = (formule) => R.suggerer({ organisation: { type: 'entreprise', formule }, jour: '2026-09-20', suivante: octobre, demandes: [] }).map((x) => x.titre);
  assert.equal(titres('essentiel').includes('Nouvelle réalisation'), false);
  assert.deepEqual(R.lignesPermises({ photo: 1, post: 2, inconnue: 1, actu: 0 }, 'essentiel'), { post: 2 });
  assert.deepEqual(R.lignesPermises({ photo: 9 }, 'regulier'), { photo: 3 });
  assert.deepEqual(R.suggerer({ organisation: { type: 'collectivite', formule: 'inconnue' }, jour: '2026-11-12', suivante: novembre, demandes: [] }), []);
  // huit jours plus tard, la lettre du 22 et l'affiche du 28 ne peuvent plus être tenues
  const tard = proposer({ jour: '2026-11-20', suivante: { ...novembre, disponible: 22 } });
  assert.deepEqual(tard.map((x) => x.titre), ['Marché de Noël', 'Horaires des fêtes', 'Vœux du maire']);
  assert.ok(tard.every((x) => x.limite >= '2026-11-20'));
  // délais de l'offre : création 5 jours ouvrés, courant celui de la formule, plus un jour de confirmation
  assert.deepEqual([R.ouvresNecessaires({ affiche: 1, post: 2 }, 'essentiel'), R.ouvresNecessaires({ post: 1 }, 'essentiel'), R.ouvresNecessaires({ post: 1 }, 'soutenu'), R.ouvresNecessaires({ bulletin: 8 }, 'regulier'), R.ouvresNecessaires({ photo: 1 }, 'regulier')], [6, 3, 2, 15, 5]);
  // le 11 novembre est férié : trois jours ouvrés avant le vendredi 13 mènent au lundi 9
  assert.equal(R.limiteDepot('2026-11-13', 3), '2026-11-09');
  assert.equal(R.limiteDepot('2026-11-13', 3, [{ debut: '2026-11-09', fin: '2026-11-10' }]), '2026-11-05');
});

await test('plage d’envoi : jours ouvrés, de 8 h à 20 h, heure de Paris', async () => {
  const a = (iso) => R.plageOuverte(new Date(iso));
  assert.deepEqual([a('2026-11-12T08:10:00+01:00'), a('2026-11-12T07:59:00+01:00'), a('2026-11-12T19:59:00+01:00'), a('2026-11-12T20:00:00+01:00')], [true, false, true, false]);
  assert.deepEqual([a('2026-11-14T10:00:00+01:00'), a('2026-11-15T10:00:00+01:00'), a('2026-11-11T10:00:00+01:00'), a('2026-07-15T06:30:00Z')], [false, false, false, true]);
});

await test('dates et liens : période en clair, « 1er », lien de la demande pré-remplie', async () => {
  assert.equal(R.libellePeriode('2026-10-12', '2026-11-11'), 'du 12 octobre au 11 novembre 2026');
  assert.equal(R.libellePeriode('2026-12-01', '2026-12-31'), 'du 1er décembre au 31 décembre 2026');
  assert.equal(R.libellePeriode('2026-12-12', '2027-01-11'), 'du 12 décembre 2026 au 11 janvier 2027');
  assert.equal(R.jourLong('2026-11-26'), 'jeudi 26 novembre');
  assert.equal(R.plusUnAn('2024-02-29'), '2025-02-28');
  const lien = R.lienLancer('https://fill.studioes.fr/espace/', { titre: 'Marché de Noël & vœux', date: '2026-12-06', qte: { affiche: 1, post: 2 } });
  assert.equal(lien, 'https://fill.studioes.fr/espace/#nouvelle?titre=March%C3%A9%20de%20No%C3%ABl%20%26%20v%C5%93ux&parution=2026-12-06&qte=affiche:1,post:2');
  assert.equal(R.lienLancer('https://x.fr/espace', { titre: 'Portrait', date: null, qte: { post: 1 } }), 'https://x.fr/espace/#nouvelle?titre=Portrait&qte=post:1');
  assert.equal(R.lienBilan('https://x.fr/espace/', 'abc'), 'https://x.fr/espace/bilan/#j=abc');
  assert.equal(R.lienRelecture('https://x.fr/espace', 'abc'), 'https://x.fr/espace/bilan/#r=abc');
});

const donnees = (plus = {}) => ({
  organisation: { nom: 'Commune de <Saint-Ivenec>', type: 'collectivite', formule: 'essentiel' }, periode: '2026-10', debut: '2026-10-12', fin: '2026-11-11',
  demandes_livrees: 3, unites: { quota: 10, report: 2, ajustements: 0, total: 12, utilisees: 11, reservees: 1, reportees: 1, expirees: 0 },
  delais: { a_la_date: 1, total: 2, sans_date: 1, validations: 3, validation_jours: 0.7 },
  suivante: { periode: '2026-11', debut: '2026-11-12', fin: '2026-12-11', disponible: 11, report: 1 },
  suggestions: proposer({ suivante: { ...novembre, disponible: 11 } }), ...plus,
});

await test('mail mensuel : trois chiffres, le lien du bilan, une ligne et un lien « Lancer » par suggestion', async () => {
  const m = R.mailMensuel({ donnees: donnees(), lien: 'https://fill.studioes.fr/espace/bilan/#j=abc', site: 'https://fill.studioes.fr/espace' });
  assert.equal(m.sujet, 'Votre mois avec Fill : du 12 octobre au 11 novembre 2026');
  assert.equal(m.titre, 'Votre mois avec Fill');
  assert.deepEqual(m.bouton, { libelle: 'Voir le bilan', lien: 'https://fill.studioes.fr/espace/bilan/#j=abc' });
  const html = [...m.texte, ...m.apres].join('\n');
  assert.deepEqual(R.troisChiffres(donnees()).map((c) => `${c.valeur} ${c.libelle}`), ['3 demandes livrées', '11 unités utilisées sur 12', '1 sur 2 livrées à la date annoncée']);
  for (const c of R.troisChiffres(donnees())) assert.ok(html.includes(`>${c.valeur}</span>&nbsp; ${c.libelle}`), c.libelle);
  assert.equal((html.match(/Lancer cette demande/g) ?? []).length, 3);
  assert.ok(html.includes('href="https://fill.studioes.fr/espace/#nouvelle?titre=Lettre%20de%20fin%20d%E2%80%99ann%C3%A9e&amp;parution=2026-11-22&amp;qte=news:1"'));
  assert.ok(html.includes('3 sujets tiennent dans vos 11 unités disponibles, dont 1 reportée à utiliser avant le 11 décembre.'));
  assert.ok(html.includes('À déposer au plus tard le jeudi 19 novembre.'));
  assert.ok(html.includes('Commune de &lt;Saint-Ivenec&gt;') && !html.includes('<Saint-Ivenec>'), 'le nom venu de la base est échappé');
  assert.equal(/undefined|null|NaN|—|–|\bIA\b|intelligence artificielle|Claude|Anthropic/.test(html + m.sujet), false);
  // sans suggestion : le solde seul ; sans période suivante : rien de plus que le bilan
  const sans = R.mailMensuel({ donnees: donnees({ suggestions: [] }), lien: 'x', site: 'y' });
  assert.ok(sans.apres.join('\n').includes('vous disposez de 11 unités, dont 1 reportée à utiliser avant le 11 décembre.'));
  assert.equal(sans.apres.join('\n').includes('Lancer'), false);
  const fin = R.mailMensuel({ donnees: donnees({ suggestions: [], suivante: null }), lien: 'x', site: 'y' });
  assert.equal(fin.apres.length, 1);
  // aucune demande avec date annoncée : le troisième chiffre devient le report
  assert.equal(R.troisChiffres(donnees({ delais: { a_la_date: 0, total: 0, sans_date: 3 } }))[2].libelle, 'unité reportée sur la période suivante');
});

await test('mails internes : relecture avant envoi, envoi à vérifier', async () => {
  const m = R.mailRelecture({ donnees: donnees(), lien: 'https://fill.studioes.fr/espace/bilan/#r=abc', referent: 'Yann Le Gall' });
  assert.equal(m.sujet, 'Bilan à relire : Commune de <Saint-Ivenec>, du 12 octobre au 11 novembre 2026');
  assert.ok(m.texte.join(' ').includes('Rien ne part à Yann Le Gall sans votre accord') && m.titre.includes('&lt;Saint-Ivenec&gt;'));
  assert.deepEqual(m.bouton, { libelle: 'Relire et envoyer', lien: 'https://fill.studioes.fr/espace/bilan/#r=abc' });
  assert.match(R.mailBloque({ organisation: 'Commune de Lanvern', periode: '2026-10' }).texte.join(' '), /il n’est pas retenté/);
});

// ---------- fonction serveur « bilan » : la vraie fonction, assemblée comme au déploiement, sur la base embarquée.
// Seuls l'environnement Deno, le client Supabase (remplacé par des requêtes sur PGlite), l'horloge et le service
// d'envoi sont simulés : aucun mail ne part, chaque appel au service d'envoi est gardé dans « mails ».

const CLE = 'k'.repeat(40);
const mails = [];
let brevo = () => 201;                          // statut que répond le service d'envoi (ou une exception)
const vraiFetch = globalThis.fetch;
globalThis.fetch = async (adresse, init) => {
  if (!String(adresse).startsWith('https://api.brevo.com/')) throw new Error(`appel inattendu : ${adresse}`);
  const corps = JSON.parse(init.body);
  const statut = brevo(corps);
  mails.push({ a: corps.to.map((x) => x.email).join(','), sujet: corps.subject, html: corps.htmlContent, statut });
  if (statut === 'panne') throw new Error('réseau');
  return new Response('{}', { status: statut });
};
const env = { SUPABASE_URL: 'https://base.exemple', CLE_SECRETE: CLE, BREVO_API_KEY: 'cle-brevo', ALERTE_EMAIL: 'fill@exemple.fr' };
let handler;
globalThis.Deno = { env: { get: (k) => env[k] }, serve: (h) => { handler = h; } };
// le client Supabase : rpc et lectures simples, rendues en JSON comme le fait l'API (dates en texte)
globalThis.__sb = () => ({
  rpc: async (nom, params = {}) => {
    const cles = Object.keys(params);
    try {
      const r = await db.query(`select ${nom}(${cles.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as v`, cles.map((k) => params[k]));
      return { data: r.rows[0].v, error: null };
    } catch (e) { return { data: null, error: { code: e.code, message: e.message } }; }
  },
  from: (table) => {
    const filtres = [];
    const q = {
      select: (cols) => { q.cols = cols; return q; },
      eq: (c, v) => { filtres.push([c, v]); return q; },
      then: (ok, ko) => db.query(`select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) as v from (select ${q.cols} from ${table}${filtres.length ? ` where ${filtres.map(([c], i) => `${c} = $${i + 1}`).join(' and ')}` : ''}) t`, filtres.map(([, v]) => v))
        .then((r) => ({ data: r.rows[0].v, error: null })).then(ok, ko),
    };
    return q;
  },
});
writeFileSync(join(dossier, 'sb.mjs'), 'export const createClient = (...a) => globalThis.__sb(...a);\n');
const assemblee = await build({
  absWorkingDir: join(ici, '..', '..'), entryPoints: [join('supabase', 'functions', 'bilan', 'index.ts')], bundle: true, format: 'esm', platform: 'neutral', target: 'es2022', write: false, logLevel: 'error',
  plugins: [{ name: 'client-simule', setup: (b) => b.onResolve({ filter: /^npm:@supabase\/supabase-js/ }, () => ({ path: join(dossier, 'sb.mjs') })) }],
});
writeFileSync(join(dossier, 'fonction.mjs'), assemblee.outputFiles[0].text);
await import(pathToFileURL(join(dossier, 'fonction.mjs')).href);

const VraieDate = Date;
const horloge = (quand) => { globalThis.Date = class extends VraieDate { constructor(...a) { if (a.length) super(...a); else super(quand); } static now() { return new VraieDate(quand).getTime(); } }; };
const JEUDI = '2026-11-12T09:10:00+01:00', SAMEDI = '2026-11-14T09:10:00+01:00', VENDREDI = '2026-11-13T09:10:00+01:00';
const appeler = async (corps, { cle = null, methode = 'POST' } = {}) => {
  await serveur();
  const r = await handler(new Request('https://base.exemple/functions/v1/bilan', { method: methode, headers: { 'content-type': 'application/json', ...(cle ? { Authorization: `Bearer ${cle}` } : {}) }, body: methode === 'POST' ? JSON.stringify(corps) : undefined }));
  const texte = await r.text();
  let d = texte; try { d = JSON.parse(texte); } catch { /* texte brut */ }
  return { statut: r.status, d };
};
const quotidien = (plus = {}) => appeler({ action: 'quotidien', ...plus }, { cle: CLE });
const jetonDe = (html, lettre) => (html.match(new RegExp(`/bilan/#${lettre}=([A-Za-z0-9_-]{43})`)) ?? [])[1];
// repart d'une base sans bilan en attente : les organisations des tests précédents sont mises de côté
const depart = async (quand = JEUDI) => {
  await serveur();
  await db.exec(`delete from bilan; update organisation set statut = 'resiliee'; update parametre set pilote_bilan = false;`);
  mails.length = 0; brevo = () => 201; horloge(quand);
  const s = await scene(); await cloturer(s); await credit(s, '2026-11', 10);
  return s;
};

await test('fonction : réservée au serveur pour la tâche planifiée, POST seulement, jeton inconnu sans indice', async () => {
  await depart();
  assert.equal((await appeler({ action: 'quotidien' })).statut, 401);
  assert.equal((await appeler({ action: 'quotidien' }, { cle: 'x'.repeat(40) })).statut, 401);
  assert.equal((await appeler(null, { methode: 'GET' })).statut, 405);
  assert.deepEqual(await appeler({ action: 'lire', j: 'A'.repeat(43) }), { statut: 404, d: { etat: 'inconnu' } });
  assert.deepEqual(await appeler({ action: 'lire', j: 'trop-court' }), { statut: 404, d: { etat: 'inconnu' } });
  assert.deepEqual(await appeler({ action: 'approuver', r: 'A'.repeat(43) }), { statut: 404, d: { etat: 'inconnu' } });
  assert.equal(mails.length, 0);
  assert.equal((await un(`select count(*)::int as n from bilan`)).n, 0);
});

await test('fonction, simulation : dit ce qui serait fait, ne fige rien, n’envoie rien', async () => {
  const s = await depart(SAMEDI);
  const { statut, d } = await quotidien({ simuler: true });
  assert.equal(statut, 200);
  assert.deepEqual([d.simulation, d.prepares.length, d.prepares[0].organisation, d.prepares[0].periode, d.prepares[0].donnees.demandes_livrees], [true, 1, 'Commune de Saint-Ivenec', '2026-10', 3]);
  assert.deepEqual(d.prepares[0].donnees.suggestions.map((x) => [x.titre, x.unites]), [['Téléthon', 6], ['Horaires des fêtes', 2]], 'le samedi 14, la lettre du 22 ne peut plus être tenue ; 11 unités disponibles');
  assert.equal(mails.length, 0);
  assert.equal((await un(`select count(*)::int as n from bilan where organisation_id = $1`, [s.o])).n, 0);
});

await test('fonction : hors plage (week-end), rien n’est figé ni envoyé', async () => {
  await depart(SAMEDI);
  const { d } = await quotidien();
  assert.equal(d.hors_plage, true);
  assert.equal(mails.length, 0);
  assert.equal((await un(`select count(*)::int as n from bilan`)).n, 0);
});

await test('fonction, relecture puis envoi : un lien pour Fill, un seul mail au référent, quel que soit le nombre de passages', async () => {
  const s = await depart();
  const a = (await quotidien()).d;
  assert.deepEqual([a.prepares.length, a.prepares[0].suggestions, a.relectures.length, a.relectures[0].etat, a.envois.length, a.en_attente], [1, 3, 1, 'parti', 0, 1]);
  assert.deepEqual(mails.map((m) => [m.a, m.sujet]), [['fill@exemple.fr', 'Bilan à relire : Commune de Saint-Ivenec, du 12 octobre au 11 novembre 2026']]);
  // un second passage ne refait rien
  const b = (await quotidien()).d;
  assert.deepEqual([b.prepares.length, b.relectures.length, b.envois.length, mails.length], [0, 0, 0, 1]);
  const jr = jetonDe(mails[0].html, 'r');
  assert.ok(jr, 'le mail de Fill porte le lien de relecture');
  assert.equal((await un(`select count(*)::int as n from bilan where empreinte_relecture = $1 or empreinte = $1`, [jr])).n, 0, 'le jeton n’est pas enregistré');
  const vue = (await appeler({ action: 'lire', r: jr })).d;
  assert.deepEqual([vue.etat, vue.mode, vue.referent, vue.envoye_le, vue.donnees.suggestions.length, vue.donnees.organisation.nom], ['ouvert', 'relecture', 'Yann Le Gall', null, 3, 'Commune de Saint-Ivenec']);
  assert.equal((await appeler({ action: 'lire', j: jr })).statut, 404, 'un lien de relecture ne s’ouvre pas comme un lien de partage');
  // accord de Fill, une suggestion retirée : le mail part au référent, une fois
  const ok = await appeler({ action: 'approuver', r: jr, retirer: [vue.donnees.suggestions[1].cle] });
  assert.deepEqual(ok, { statut: 200, d: { ok: true, envoye: true, a: 'Yann Le Gall' } });
  assert.deepEqual(mails.slice(1).map((m) => [m.a, m.sujet]), [['yann@exemple.fr', 'Votre mois avec Fill : du 12 octobre au 11 novembre 2026']]);
  const html = mails[1].html;
  assert.ok(html.includes('>3</span>&nbsp; demandes livrées') && html.includes('>11</span>&nbsp; unités utilisées sur 12') && html.includes('>1 sur 2</span>&nbsp; livrées à la date annoncée'));
  assert.equal((html.match(/Lancer cette demande/g) ?? []).length, 2, 'la suggestion retirée n’est pas dans le mail');
  assert.equal(/undefined|null|NaN|—|–/.test(html.replace(/<[^>]+>/g, ' ')), false);
  const jp = jetonDe(html, 'j');
  const partage = (await appeler({ action: 'lire', j: jp })).d;
  assert.deepEqual([partage.etat, partage.mode, partage.donnees.suggestions.length, partage.espace, 'referent' in partage], ['ouvert', 'partage', 2, 'https://fill.studioes.fr/espace', false]);
  assert.equal((await appeler({ action: 'lire', r: jp })).statut, 404);
  assert.equal((await appeler({ action: 'approuver', j: jp })).statut, 403, 'un lien de partage ne permet aucune action');
  // ni un second accord, ni les passages suivants ne renvoient le bilan
  assert.equal((await appeler({ action: 'approuver', r: jr })).statut, 409);
  horloge(VENDREDI);
  const c = (await quotidien()).d;
  assert.deepEqual([c.prepares.length, c.relectures.length, c.envois.length, c.bloques.length, mails.length], [0, 0, 0, 0, 2]);
  assert.deepEqual(await un(`select envoye_a, (select count(*)::int from bilan where organisation_id = $1) as n from bilan where organisation_id = $1`, [s.o]), { envoye_a: 'yann@exemple.fr', n: 1 });
  assert.equal((await appeler({ action: 'lire', r: jr })).d.envoye_le !== null, true);
});

await test('fonction, envoi automatique (pilote_bilan) : le mail part sans relecture, une seule fois ; « [Test] » pour un compte d’essai', async () => {
  const s = await depart();
  await db.query(`update parametre set pilote_bilan = true`);
  await db.query(`update organisation set essai = true where id = $1`, [s.o]);
  const a = (await quotidien()).d;
  assert.deepEqual([a.prepares.length, a.relectures.length, a.envois.map((e) => e.etat)], [1, 0, ['envoye']]);
  assert.deepEqual(mails.map((m) => [m.a, m.sujet]), [['yann@exemple.fr', '[Test] Votre mois avec Fill : du 12 octobre au 11 novembre 2026']]);
  for (const jour of [JEUDI, VENDREDI]) { horloge(jour); await quotidien(); }
  assert.equal(mails.length, 1);
});

await test('fonction : un refus du service d’envoi libère le bilan, qui repart une fois ; une réponse incertaine le bloque pour de bon', async () => {
  await depart();
  await db.query(`update parametre set pilote_bilan = true`);
  brevo = () => 400;
  const a = (await quotidien()).d;
  assert.deepEqual(a.envois.map((e) => e.etat), ['refuse']);
  assert.equal((await un(`select count(*)::int as n from bilan where envoi_reserve_le is not null or empreinte is not null`)).n, 0);
  brevo = () => 201;
  assert.deepEqual((await quotidien()).d.envois.map((e) => e.etat), ['envoye']);
  assert.deepEqual(mails.map((m) => m.statut), [400, 201]);
  assert.equal((await quotidien()).d.envois.length, 0);
  // réponse incertaine (erreur du service, coupure) : jamais retenté, Fill est prévenu une fois
  for (const incertain of [500, 'panne']) {
    await depart();
    await db.query(`update parametre set pilote_bilan = true`);
    brevo = (c) => (c.to[0].email === 'yann@exemple.fr' ? incertain : 201);
    const b = (await quotidien()).d;
    assert.deepEqual([b.envois.map((e) => e.etat), b.bloques.length], [['bloque'], 1]);
    assert.deepEqual(mails.map((m) => [m.a, m.sujet]), [['yann@exemple.fr', 'Votre mois avec Fill : du 12 octobre au 11 novembre 2026'], ['fill@exemple.fr', 'Bilan à vérifier : Commune de Saint-Ivenec']]);
    brevo = () => 201;
    const c = (await quotidien()).d;
    assert.deepEqual([c.envois.length, c.bloques.length, mails.length], [0, 1, 2], 'pas de nouvel essai');
  }
});

await test('fonction : un accord donné hors plage part au passage suivant ; sans service d’envoi, rien n’est perdu', async () => {
  await depart();
  await quotidien();
  const jr = jetonDe(mails[0].html, 'r');
  horloge(SAMEDI);
  assert.deepEqual((await appeler({ action: 'approuver', r: jr })).d, { ok: true, envoye: false, motif: 'hors_plage' });
  assert.equal(mails.length, 1);
  horloge('2026-11-16T08:30:00+01:00');
  assert.deepEqual((await quotidien()).d.envois.map((e) => e.etat), ['envoye']);
  assert.equal(mails.length, 2);
  // clé du service d'envoi absente : le bilan est figé, le lien de relecture sera envoyé plus tard
  await depart();
  delete env.BREVO_API_KEY;
  const a = (await quotidien()).d;
  assert.deepEqual([a.prepares.length, a.relectures.map((r) => r.etat), mails.length], [1, ['refuse'], 0]);
  env.BREVO_API_KEY = 'cle-brevo';
  assert.deepEqual((await quotidien()).d.relectures.map((r) => r.etat), ['parti']);
  assert.equal(mails.length, 1);
});

globalThis.Date = VraieDate; globalThis.fetch = vraiFetch;
await stop();
console.log(`\n${passes} tests passés${process.exitCode ? ', des échecs ci-dessus' : ''}`);
// l'horloge simulée laisse des minuteries en attente : on termine sans les attendre
process.exit(process.exitCode ?? 0);
