// Tests de l'adresse de transfert.
//
//   cd supabase && npm i --no-save @electric-sql/pglite && node tests/reception.test.mjs
//
// 1. La migration tourne dans un Postgres embarqué (PGlite), sur un schéma réduit aux tables qu'elle touche.
//    Ce schéma reprend les colonnes, les contraintes et le texte des fonctions (deposer_demande, _ecrire_lignes,
//    _urgence, _verifier_place, place_libre, periode_org…) relevés dans la base réelle le 11 novembre 2026.
// 2. Les règles d'analyse (functions/_partage/regles/reception.ts) lisent des mails réalistes (mails-exemples.mjs).
// 3. Le déroulé complet (functions/reception/traiter.ts) : du JSON de Brevo à la demande en base.
// 4. La fonction serveur assemblée (functions/reception/index.ts) : contrôle d'accès, corps mal formés, webhook.
import { PGlite } from '@electric-sql/pglite';
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import * as M from './mails-exemples.mjs';

const ici = dirname(fileURLToPath(import.meta.url));
const db = new PGlite();
let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.stack ?? e.message}`); process.exitCode = 1; } };
const refuse = async (f, motif) => { let m = null; try { await f(); } catch (e) { m = e.message; } assert.ok(m && motif.test(m), `refus attendu (${motif}), obtenu : ${m}`); };
const AUJ = '2026-11-11';

// ---------------------------------------------------------------------------------------------------
// Schéma réduit, fidèle aux contraintes réelles
// ---------------------------------------------------------------------------------------------------
await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema auth; create schema prive;
  create function auth.role() returns text language sql stable as $$ select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $$;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;

  create table offre_version (id text primary key, unite_sup numeric not null, urgence_unites integer not null, delai_creation_j integer not null,
    engagement_mois integer not null, engagement_long integer not null, active boolean not null default false, creee timestamptz not null default now());
  create table formule (offre_id text not null references offre_version(id), id text not null, nom text not null, prix numeric not null, unites integer not null,
    delai_j integer not null, urgences_incluses integer not null, mise_en_place numeric not null, rang integer not null, prix_semaine numeric, unites_semaine integer,
    primary key (offre_id, id));
  create table prestation (offre_id text not null references offre_version(id), id text not null, categorie text not null, nom text not null, unites integer not null,
    nature text not null, quantite_max integer, formule_min text, primary key (offre_id, id));

  create table organisation (
    id uuid primary key default gen_random_uuid(), nom text not null,
    type text not null constraint organisation_type_check check (type = any (array['collectivite'::text, 'entreprise'::text])),
    formule text not null, debut date not null,
    engagement_mois integer not null default 6 constraint organisation_engagement_mois_check check (engagement_mois = any (array[6, 12])),
    statut text not null default 'a_activer' constraint organisation_statut_check check (statut = any (array['a_activer'::text, 'active'::text, 'resiliee'::text])),
    siret text, code_service text, numero_engagement text, adresse_facturation text, sans_ia boolean not null default false, bon_commande text,
    creee timestamptz not null default now(), essai boolean not null default false, fin date, dossier_url text, mails_auto boolean not null default true,
    jeton_paiement text not null default md5(random()::text) unique, relais_semaine boolean not null default false, anniversaire date);
  create table profil (
    id uuid primary key default gen_random_uuid(), nom text not null, email text not null, fonction text, telephone text,
    role text not null constraint profil_role_check check (role = any (array['admin'::text, 'producteur'::text, 'referent'::text, 'contributeur'::text, 'lecteur'::text])),
    organisation_id uuid references organisation(id) on delete restrict, plafond_mensuel integer not null default 0, suppleant_jusqu_au date,
    actif boolean not null default true, visite_vue boolean not null default false, creee timestamptz not null default now(),
    constraint profil_check check ((role = any (array['admin'::text, 'producteur'::text])) = (organisation_id is null)));
  create unique index un_referent_par_client on profil (organisation_id) where role = 'referent' and actif;

  create sequence demande_numero;
  create table demande (
    id uuid primary key default gen_random_uuid(), numero integer not null default nextval('demande_numero'),
    organisation_id uuid not null references organisation(id) on delete restrict, auteur_id uuid not null references profil(id),
    titre text not null constraint demande_titre_check check (length(titre) >= 3 and length(titre) <= 140),
    offre_id text not null references offre_version(id), urgente boolean not null default false, urgence_incluse boolean not null default false,
    parution date, brief text not null default '',
    statut text not null default 'deposee' constraint demande_statut_check check (statut = any (array['deposee'::text, 'accord_requis'::text, 'confirmee'::text, 'production'::text, 'a_valider'::text, 'correction'::text, 'validee'::text, 'livree'::text, 'attente_client'::text, 'annulee'::text])),
    unites integer, unites_hors_forfait integer not null default 0, livraison date, corrections integer not null default 0, motif_accord text,
    creee timestamptz not null default now(), maj timestamptz not null default now(),
    heure text constraint demande_heure_check check (heure ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'));
  create index demande_org on demande (organisation_id, statut);
  create table demande_ligne (
    demande_id uuid not null references demande(id) on delete cascade, organisation_id uuid not null references organisation(id),
    offre_id text not null, prestation text not null,
    quantite integer not null constraint demande_ligne_quantite_check check (quantite >= 1 and quantite <= 99), unites integer not null,
    primary key (demande_id, prestation), foreign key (offre_id, prestation) references prestation(offre_id, id));
  create table registre (
    id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id),
    periode text not null constraint registre_periode_check check (periode ~ '^\\d{4}-\\d{2}$'),
    type text not null constraint registre_type_check check (type = any (array['credit'::text, 'report'::text, 'expiration'::text, 'ajustement'::text, 'debit'::text])),
    unites integer not null, demande_id uuid references demande(id), commande_id uuid,
    etat text constraint registre_etat_check check (etat = any (array['reserve'::text, 'consomme'::text, 'restitue'::text])),
    source text constraint registre_source_check check (source = any (array['offert'::text, 'commande'::text, 'correction'::text])),
    motif text, date timestamptz not null default now(),
    constraint registre_check check ((type = 'debit') = (demande_id is not null and etat is not null)),
    constraint registre_check1 check ((type = 'ajustement') = (source is not null and motif is not null)));
  create table historique (id bigserial primary key, demande_id uuid not null references demande(id) on delete cascade, organisation_id uuid not null, statut text not null,
    type text not null default 'statut' constraint historique_type_check check (type = any (array['statut'::text, 'modification'::text, 'relance'::text, 'pilote'::text, 'lien'::text])),
    detail text, par uuid, date timestamptz not null default now());
  create table journal (id bigserial primary key, organisation_id uuid, acteur uuid, action text not null, cible text, details jsonb, date timestamptz not null default now());
  create table message (id uuid primary key default gen_random_uuid(), demande_id uuid not null references demande(id) on delete cascade,
    organisation_id uuid not null references organisation(id), auteur_id uuid references profil(id),
    texte text not null constraint message_texte_check check (length(texte) >= 1 and length(texte) <= 8000), systeme boolean not null default false,
    creee timestamptz not null default now());
  create table piece_jointe (id uuid primary key default gen_random_uuid(), demande_id uuid not null references demande(id) on delete cascade,
    organisation_id uuid not null references organisation(id), nom text not null, chemin text not null, creee timestamptz not null default now());

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

  create function prive.aujourdhui() returns date language sql stable as $$ select (now() at time zone 'Europe/Paris')::date $$;
  create function prive._jour_echeance(anc date, an integer, mo integer) returns date language sql immutable as $$
    select make_date(an, mo, least(extract(day from anc)::int, extract(day from (make_date(an, mo, 1) + interval '1 month - 1 day'))::int)) $$;
  create function est_equipe() returns boolean language sql stable security definer set search_path to 'public' as $$ select coalesce((select role in ('admin','producteur') from profil where id = auth.uid() and actif), false) $$;
  create function est_admin() returns boolean language sql stable security definer set search_path to 'public' as $$ select coalesce((select role = 'admin' from profil where id = auth.uid() and actif), false) $$;
  create function mon_organisation() returns uuid language sql stable security definer set search_path to 'public' as $$ select organisation_id from profil where id = auth.uid() and actif $$;
  create function mon_role() returns text language sql stable security definer set search_path to 'public' as $$ select role from profil where id = auth.uid() and actif $$;
  create function offre_active() returns text language sql stable set search_path to 'public' as $$ select id from offre_version where active $$;
  create function journaliser(org uuid, act text, cib text, det jsonb default null) returns void language sql security definer set search_path to 'public'
    as $$ insert into journal (organisation_id, acteur, action, cible, details) values (org, auth.uid(), act, cib, det) $$;
  create function periode_org(org uuid, j date default null) returns text language plpgsql stable security definer set search_path to 'public' as $f$
    declare anc date; d date := coalesce(j, prive.aujourdhui());
    begin
      select anniversaire into anc from organisation where id = org;
      if anc is null then return to_char(d, 'YYYY-MM'); end if;
      if d >= prive._jour_echeance(anc, extract(year from d)::int, extract(month from d)::int) then return to_char(d, 'YYYY-MM'); end if;
      return to_char(d - interval '1 month', 'YYYY-MM');
    end $f$;
  create function disponible(org uuid, per text) returns integer language sql stable security definer set search_path to 'public'
    as $$ select coalesce((select disponible from etat_periode where organisation_id = org and periode = per), 0)::int $$;
  create function place_libre(org uuid, sauf uuid default null) returns integer language sql stable security definer set search_path to 'public' as $$
    select disponible(org, periode_org(org)) - coalesce((select sum(unites) from demande
      where organisation_id = org and statut in ('deposee','accord_requis') and id <> coalesce(sauf, '00000000-0000-0000-0000-000000000000'::uuid)), 0)::int $$;
  create function _verifier_place(org uuid, sauf uuid, besoin integer) returns void language plpgsql security definer set search_path to 'public' as $f$
    declare libre int := place_libre(org, sauf);
    begin
      if besoin > libre then
        raise exception 'Unités insuffisantes : cette demande compte % unité(s), il en reste % sur le compte. Rechargez le compte pour l''envoyer.', besoin, greatest(libre, 0);
      end if;
    end $f$;
  create function _ecrire_lignes(p_demande uuid, org organisation, off text, p_lignes jsonb) returns integer language plpgsql security definer set search_path to 'public' as $f$
    declare l jsonb; pr prestation; fo formule; rang_min int; q int; total int := 0; n int := 0;
    begin
      if jsonb_typeof(p_lignes) <> 'array' or jsonb_array_length(p_lignes) = 0 then raise exception 'Choisissez au moins une prestation'; end if;
      if jsonb_array_length(p_lignes) > 14 then raise exception 'Trop de prestations dans une même demande'; end if;
      select * into fo from formule where offre_id = off and id = org.formule;
      delete from demande_ligne where demande_id = p_demande;
      for l in select * from jsonb_array_elements(p_lignes) loop
        select * into pr from prestation where offre_id = off and id = l->>'prestation';
        if pr is null then raise exception 'Prestation inconnue'; end if;
        if pr.formule_min is not null then
          select rang into rang_min from formule where offre_id = off and id = pr.formule_min;
          if fo.rang < rang_min then raise exception '% : disponible à partir de la formule %', pr.nom, pr.formule_min; end if;
        end if;
        q := greatest(1, least(coalesce(pr.quantite_max, 99), (l->>'quantite')::int));
        insert into demande_ligne (demande_id, organisation_id, offre_id, prestation, quantite, unites)
          values (p_demande, org.id, off, pr.id, q, pr.unites * q)
          on conflict (demande_id, prestation) do update set quantite = least(coalesce(pr.quantite_max, 99), demande_ligne.quantite + excluded.quantite),
            unites = pr.unites * least(coalesce(pr.quantite_max, 99), demande_ligne.quantite + excluded.quantite);
      end loop;
      select coalesce(sum(unites), 0) into total from demande_ligne where demande_id = p_demande;
      return total;
    end $f$;
  create function _urgence(org organisation, off text, p_urgente boolean, sauf uuid) returns table(incluse boolean, unites integer) language plpgsql security definer set search_path to 'public' as $f$
    declare fo formule; utilisees int; per text := periode_org(org.id);
    begin
      select * into fo from formule where offre_id = off and id = org.formule;
      select count(*) into utilisees from demande
        where organisation_id = org.id and urgente and urgence_incluse and id <> coalesce(sauf, '00000000-0000-0000-0000-000000000000'::uuid)
          and periode_org(org.id, (creee at time zone 'Europe/Paris')::date) = per and statut <> 'annulee';
      incluse := p_urgente and utilisees < fo.urgences_incluses;
      unites := case when p_urgente and not incluse then (select urgence_unites from offre_version where id = off) else 0 end;
      return next;
    end $f$;
  create function deposer_demande(p_titre text, p_lignes jsonb, p_urgente boolean, p_parution date, p_brief text, p_heure text default null) returns uuid language plpgsql security definer set search_path to 'public' as $f$
    declare moi profil; org organisation; off text := offre_active(); u int; urg record; nouvel uuid;
    begin
      select * into moi from profil where id = auth.uid() and actif;
      if moi is null or moi.role not in ('referent','contributeur') then raise exception 'Seuls le référent et les contributeurs déposent une demande'; end if;
      select * into org from organisation where id = moi.organisation_id and statut <> 'resiliee';
      insert into demande (organisation_id, auteur_id, titre, offre_id, urgente, parution, heure, brief)
      values (org.id, moi.id, p_titre, off, p_urgente, p_parution, nullif(p_heure, ''), coalesce(p_brief, ''))
      returning id into nouvel;
      u := _ecrire_lignes(nouvel, org, off, p_lignes);
      select * into urg from _urgence(org, off, p_urgente, nouvel);
      perform _verifier_place(org.id, nouvel, u + urg.unites);
      update demande set unites = u + urg.unites, urgence_incluse = urg.incluse where id = nouvel;
      insert into historique (demande_id, organisation_id, statut, par) values (nouvel, org.id, 'deposee', moi.id);
      perform journaliser(org.id, 'depot', nouvel::text, jsonb_build_object('unites', u + urg.unites));
      return nouvel;
    end $f$;

  alter table organisation enable row level security;
  create policy admin on organisation for all to authenticated using (est_admin()) with check (est_admin());
  create policy lecture on organisation for select to authenticated using (est_equipe() or id = mon_organisation());
  grant usage on schema public, auth, prive to anon, authenticated, service_role;
  grant all on organisation, profil, demande, demande_ligne, piece_jointe, message, historique, journal, registre to anon, authenticated, service_role;

  insert into offre_version (id, unite_sup, urgence_unites, delai_creation_j, engagement_mois, engagement_long, active) values ('2026-10-27', 55, 1, 5, 6, 6, true);
  insert into formule (offre_id, id, nom, prix, unites, delai_j, urgences_incluses, mise_en_place, rang) values
    ('2026-10-27', 'essentiel', 'Essentiel', 490, 10, 2, 0, 0, 0), ('2026-10-27', 'regulier', 'Régulier', 990, 22, 2, 0, 0, 1),
    ('2026-10-27', 'soutenu', 'Soutenu', 1890, 45, 1, 2, 0, 2), ('2026-10-27', 'relais', 'Relais', 2490, 50, 1, 1000, 0, 3);
  insert into prestation (offre_id, id, categorie, nom, unites, nature, quantite_max, formule_min) values
    ('2026-10-27', 'affiche', 'creer', 'Affiche en création', 4, 'creation', 6, null), ('2026-10-27', 'bulletin', 'creer', 'Page de bulletin ou magazine', 2, 'planifie', 12, null),
    ('2026-10-27', 'flyer', 'creer', 'Flyer ou programme recto verso', 5, 'creation', 4, null), ('2026-10-27', 'gabarit', 'creer', 'Visuel sur gabarit', 1, 'courant', 20, null),
    ('2026-10-27', 'actu', 'publier', 'Actualité sur le site', 1, 'courant', 20, null), ('2026-10-27', 'agenda', 'publier', 'Agenda en ligne', 1, 'courant', 10, null),
    ('2026-10-27', 'news', 'publier', 'Newsletter', 3, 'creation', 6, null), ('2026-10-27', 'page', 'publier', 'Page du site créée ou refaite', 3, 'creation', 6, null),
    ('2026-10-27', 'post', 'publier', 'Publication réseaux sociaux', 1, 'courant', 30, null), ('2026-10-27', 'presse', 'publier', 'Communiqué de presse', 2, 'courant', 8, null),
    ('2026-10-27', 'moder', 'terrain', 'Suivi des messages et commentaires', 4, 'courant', 1, null), ('2026-10-27', 'photo', 'terrain', 'Reportage photo', 10, 'planifie', 3, 'regulier'),
    ('2026-10-27', 'point', 'terrain', 'Réunion supplémentaire', 1, 'courant', 6, null);

  -- organisations déjà en base avant la migration : accents, doublon, nom réservé, nom très court, nom très long
  insert into organisation (nom, type, formule, debut, creee) values
    ('Commune de Saint-Ivenec', 'collectivite', 'essentiel', '2026-11-01', '2026-11-01'),
    ('Commune de Saint-Ivenec', 'collectivite', 'essentiel', '2026-11-02', '2026-11-02'),
    ('L’Atelier d’Éloïse & Cœur', 'entreprise', 'regulier', '2026-11-03', '2026-11-03'),
    ('Fill', 'entreprise', 'essentiel', '2026-11-04', '2026-11-04'),
    ('AB', 'entreprise', 'essentiel', '2026-11-05', '2026-11-05'),
    ('Communauté de communes du Pays de Landerneau-Daoulas et des environs', 'collectivite', 'soutenu', '2026-11-06', '2026-11-06');
`);

const migration = readFileSync(join(ici, '..', 'migrations', '2026-11-adresse-de-transfert.sql'), 'utf8');
await db.exec(migration);

const un = async (q, p = []) => (await db.query(q, p)).rows[0];
const tous = async (q, p = []) => (await db.query(q, p)).rows;
const serveur = () => db.exec(`reset role; select set_config('test.role', 'service_role', false); select set_config('test.uid', '', false);`);
const compte = (id) => db.exec(`reset role; select set_config('test.role', 'authenticated', false); select set_config('test.uid', '${id}', false);`);
await serveur();

// appel d'une fonction de la base comme le ferait le serveur (PostgREST) : {data, error}
const TYPES = {
  mail_ouvrir: { p_message_id: 'text', p_expediteur: 'text', p_destinataires: 'text[]', p_sujet: 'text', p_ecarter: 'text' },
  mail_deposer: { p_mail: 'uuid', p_titre: 'text', p_lignes: 'jsonb', p_parution: 'date', p_brief: 'text' },
  mail_classer: { p_mail: 'uuid', p_issue: 'text', p_motif: 'text', p_titre: 'text', p_texte: 'text', p_parution: 'date', p_lignes: 'jsonb' },
  mail_pieces: { p_mail: 'uuid', p_pieces: 'jsonb' },
  mail_repondu: { p_mail: 'uuid' },
  mail_rattacher: { p_mail: 'uuid', p_demande: 'uuid' },
  mail_purger: { p_jours: 'integer' },
  verifier_jeton_pilote: { p: 'text' },
};
const rpc = async (nom, args = {}) => {
  const types = TYPES[nom];
  const cles = Object.keys(args).filter((k) => args[k] !== undefined);
  const valeur = (k) => {
    const v = args[k];
    if (v === null) return null;
    if (types[k] === 'jsonb') return JSON.stringify(v);
    if (types[k] === 'text[]') return `{${v.map((x) => `"${String(x).replace(/["\\]/g, '\\$&')}"`).join(',')}}`;
    return v;
  };
  try {
    const r = await db.query(`select public.${nom}(${cles.map((k, i) => `${k} => $${i + 1}::${types[k]}`).join(', ')}) as v`, cles.map(valeur));
    return { data: r.rows[0].v, error: null };
  } catch (e) {
    return { data: null, error: { code: e.code, message: e.message } };
  }
};
const ok = async (nom, args) => { const r = await rpc(nom, args); if (r.error) throw new Error(r.error.message); return r.data; };

// une structure active, créditée de 10 unités, avec son référent, un contributeur et un lecteur
let rang = 0;
const scene = async (c = {}) => {
  await serveur();
  const k = ++rang;
  const o = await un(`insert into organisation (nom, type, formule, debut, statut, essai) values ($1, 'collectivite', $2, '2026-11-01', $3, false) returning id, alias_mail`,
    [c.nom ?? `Mairie de Plou-Test ${k}`, c.formule ?? 'essentiel', c.statut ?? 'active']);
  if ((c.unites ?? 10) > 0) await db.query(`insert into registre (organisation_id, periode, type, unites) values ($1, periode_org($1), 'credit', $2)`, [o.id, c.unites ?? 10]);
  const p = async (nom, role, plafond = 0) => (await un(`insert into profil (nom, email, role, organisation_id, plafond_mensuel) values ($1, $2, $3, $4, $5) returning id, email`,
    [nom, `${nom.toLowerCase().replace(/\W+/g, '.')}.${k}@exemple.fr`, role, o.id, plafond]));
  const ref = await p('Yann Le Gall', 'referent'), con = await p('Lena Riou', 'contributeur', 3), lec = await p('Marc Abgrall', 'lecteur');
  return { o: o.id, alias: o.alias_mail, ref, con, lec };
};
let idMsg = 0;
const ouvrir = (de, alias, c = {}) => ok('mail_ouvrir', { p_message_id: c.id ?? `<t${++idMsg}@test>`, p_expediteur: de, p_destinataires: alias ? [alias] : [], p_sujet: c.sujet ?? 'Sujet', p_ecarter: c.ecarter ?? null });

// ---------------------------------------------------------------------------------------------------
// 1. Migration : adresses, table, règles en base
// ---------------------------------------------------------------------------------------------------
await test('migration : chaque organisation existante reçoit une adresse lisible et unique', async () => {
  const a = (await tous(`select alias_mail from organisation where debut <= '2026-11-06' order by creee`)).map((x) => x.alias_mail);
  assert.deepEqual(a, ['commune-de-saint-ivenec', 'commune-de-saint-ivenec-2', 'l-atelier-d-eloise-coeur', 'structure-fill', 'structure-ab', 'communaute-de-communes-du-pays-de-lander']);
  assert.equal((await un(`select is_nullable from information_schema.columns where table_name = 'organisation' and column_name = 'alias_mail'`)).is_nullable, 'NO');
});

await test('migration : rejouée, elle ne change rien et ne lève pas d’erreur', async () => {
  const avant = await tous(`select id, alias_mail from organisation order by id`);
  await db.exec(migration);
  await serveur();
  assert.deepEqual(await tous(`select id, alias_mail from organisation order by id`), avant);
});

await test('nouvelle organisation : l’adresse est générée sans que l’insertion la mentionne (comme creer_compte)', async () => {
  const a = await un(`insert into organisation (nom, type, formule, debut, engagement_mois, statut, siret, numero_engagement) values ('  Mairie de Plouézoc’h ', 'collectivite', 'essentiel', current_date, 6, 'a_activer', '12345678901234', null) returning alias_mail`);
  assert.equal(a.alias_mail, 'mairie-de-plouezoc-h');
  const b = await un(`insert into organisation (nom, type, formule, debut) values ('Mairie de Plouézoc’h', 'collectivite', 'essentiel', current_date) returning alias_mail`);
  assert.equal(b.alias_mail, 'mairie-de-plouezoc-h-2');
  const c = await un(`insert into organisation (nom, type, formule, debut) values ('Contact', 'entreprise', 'essentiel', current_date) returning alias_mail`);
  assert.equal(c.alias_mail, 'structure-contact');
});

await test('adresse : stable quand le nom change, normalisée si Fill la saisit, refusée si elle est invalide ou déjà prise', async () => {
  const s = await scene({ nom: 'Mairie de Kerlouan' });
  assert.equal(s.alias, 'mairie-de-kerlouan');
  await db.query(`update organisation set nom = 'Commune de Kerlouan' where id = $1`, [s.o]);
  assert.equal((await un(`select alias_mail from organisation where id = $1`, [s.o])).alias_mail, 'mairie-de-kerlouan');
  await db.query(`update organisation set alias_mail = '  Kerlouan ' where id = $1`, [s.o]);
  assert.equal((await un(`select alias_mail from organisation where id = $1`, [s.o])).alias_mail, 'kerlouan');
  await refuse(() => db.query(`update organisation set alias_mail = 'ker louan@x' where id = $1`, [s.o]), /organisation_alias_mail_check/);
  await refuse(() => db.query(`update organisation set alias_mail = 'commune-de-saint-ivenec' where id = $1`, [s.o]), /organisation_alias_mail_key|unique|duplicate/i);
  // vidée, elle est régénérée depuis le nom
  await db.query(`update organisation set alias_mail = '' where id = $1`, [s.o]);
  assert.equal((await un(`select alias_mail from organisation where id = $1`, [s.o])).alias_mail, 'commune-de-kerlouan');
});

await test('un compte client lit l’adresse de sa structure et ne peut pas la changer', async () => {
  const s = await scene();
  await compte(s.ref.id); await db.exec(`set role authenticated`);
  assert.deepEqual(await tous(`select alias_mail from organisation`), [{ alias_mail: s.alias }]);
  const r = await db.query(`update organisation set alias_mail = 'pirate' where id = $1`, [s.o]);
  assert.equal(r.affectedRows, 0);
  await serveur();
  assert.equal((await un(`select alias_mail from organisation where id = $1`, [s.o])).alias_mail, s.alias);
});

await test('mail_ouvrir : un membre reconnu à son adresse d’expéditeur, sur l’adresse de sa structure', async () => {
  const s = await scene();
  const r = await ouvrir(`  ${s.ref.email.toUpperCase()} `, `${s.alias}@demandes.studioes.fr`);
  assert.deepEqual([r.cas, r.repondre, r.alias_inconnu, r.profil.id, r.profil.role, r.organisation.id, r.organisation.alias], ['ok', true, false, s.ref.id, 'referent', s.o, s.alias]);
  const m = await un(`select issue, motif, organisation_id, profil_id, destinataire, expediteur from mail_recu where id = $1`, [r.mail]);
  assert.deepEqual(m, { issue: 'recu', motif: null, organisation_id: s.o, profil_id: s.ref.id, destinataire: s.alias, expediteur: s.ref.email });
  assert.equal((await ouvrir(s.con.email, s.alias)).cas, 'ok');
});

await test('mail_ouvrir : inconnu, compte retiré, lecteur, autre structure, structure résiliée, équipe Fill', async () => {
  const s = await scene(), autre = await scene();
  const inc = await ouvrir('paul@ailleurs.fr', s.alias);
  assert.deepEqual([inc.cas, inc.repondre, inc.profil, inc.organisation], ['inconnu', true, null, null]);
  assert.deepEqual(await un(`select issue, motif, profil_id from mail_recu where id = $1`, [inc.mail]), { issue: 'refuse', motif: 'inconnu', profil_id: null });
  // adresse inconnue et expéditeur inconnu : aucune réponse (courrier indésirable probable)
  assert.deepEqual([(await ouvrir('paul2@ailleurs.fr', 'nimporte-quoi')).repondre, (await ouvrir('paul3@ailleurs.fr', null)).repondre], [false, false]);
  await db.query(`update profil set actif = false where id = $1`, [s.con.id]);
  assert.equal((await ouvrir(s.con.email, s.alias)).cas, 'inconnu');
  assert.equal((await ouvrir(s.lec.email, s.alias)).cas, 'lecteur');
  const x = await ouvrir(s.ref.email, autre.alias);
  assert.deepEqual([x.cas, x.organisation.alias], ['autre_structure', s.alias]);
  await db.query(`update organisation set statut = 'resiliee' where id = $1`, [autre.o]);
  assert.equal((await ouvrir(autre.ref.email, autre.alias)).cas, 'resiliee');
  const ewen = await un(`insert into profil (nom, email, role) values ('Ewen Soupault', 'ewen@studio.example', 'admin') returning email`);
  const eq = await ouvrir(ewen.email, s.alias);
  assert.deepEqual([eq.cas, eq.repondre], ['equipe', false]);
  assert.equal((await un(`select issue from mail_recu where id = $1`, [eq.mail])).issue, 'ignore');
});

await test('mail_ouvrir : adresse mal recopiée par un membre reconnu, la structure est la sienne ; deux adresses, la sienne l’emporte', async () => {
  const s = await scene(), autre = await scene();
  const r = await ouvrir(s.ref.email, 'mairie-de-plou-tset');
  assert.deepEqual([r.cas, r.alias_inconnu, r.organisation.id], ['ok', true, s.o]);
  const deux = await ok('mail_ouvrir', { p_message_id: '<deux@test>', p_expediteur: s.ref.email, p_destinataires: [autre.alias, s.alias], p_sujet: null, p_ecarter: null });
  assert.deepEqual([deux.cas, deux.organisation.id], ['ok', s.o]);
});

await test('mail_ouvrir : un message n’est traité qu’une fois ; resté en plan, il reprend après deux minutes', async () => {
  const s = await scene();
  const a = await ouvrir(s.ref.email, s.alias, { id: '<unique@test>' });
  const b = await ouvrir(s.ref.email, s.alias, { id: '<unique@test>' });
  // tant que le premier traitement n'a pas abouti, le message est « en cours » : Brevo le représentera
  assert.deepEqual([a.cas, b.cas, b.repondre, b.mail], ['ok', 'en_cours', false, a.mail]);
  await db.query(`update mail_recu set recu = now() - interval '3 minutes' where id = $1`, [a.mail]);
  const c = await ouvrir(s.ref.email, s.alias, { id: '<unique@test>' });
  assert.equal(c.cas, 'ok');
  assert.notEqual(c.mail, a.mail);
  assert.equal((await un(`select count(*)::int as n from mail_recu where message_id = '<unique@test>'`)).n, 1);
  // une fois traité, il n'est plus jamais repris
  await ok('mail_classer', { p_mail: c.mail, p_issue: 'a_completer', p_motif: 'support_manquant', p_titre: 'Un titre', p_texte: 'x', p_parution: null, p_lignes: [] });
  await db.query(`update mail_recu set recu = now() - interval '3 minutes' where id = $1`, [c.mail]);
  assert.deepEqual([(await ouvrir(s.ref.email, s.alias, { id: '<unique@test>' })).cas, (await un(`select issue from mail_recu where id = $1`, [c.mail])).issue], ['doublon', 'a_completer']);
});

await test('mail_ouvrir : mail automatique écarté sans réponse ; un inconnu reçoit une réponse par jour ; trop-plein ignoré', async () => {
  const s = await scene();
  const e = await ouvrir(s.ref.email, s.alias, { ecarter: 'automatique' });
  assert.deepEqual([e.cas, e.repondre], ['ecarte', false]);
  assert.deepEqual(await un(`select issue, motif from mail_recu where id = $1`, [e.mail]), { issue: 'ignore', motif: 'automatique' });
  // la réponse à un inconnu est comptée dès l'ouverture : trois mails coup sur coup, une seule réponse
  const a = await ouvrir('marie@ailleurs.fr', s.alias);
  assert.equal(a.repondre, true);
  assert.deepEqual([(await ouvrir('marie@ailleurs.fr', s.alias)).repondre, (await ouvrir('marie@ailleurs.fr', s.alias)).repondre], [false, false]);
  await db.query(`update mail_recu set repondu_le = now() - interval '25 hours' where expediteur = 'marie@ailleurs.fr'`);
  assert.equal((await ouvrir('marie@ailleurs.fr', s.alias)).repondre, true);
  // plafond global : 30 réponses à des inconnus par jour
  for (let i = 0; i < 30; i++) await ouvrir(`inconnu${i}@ailleurs.fr`, s.alias);
  assert.equal((await ouvrir('trente-et-unieme@ailleurs.fr', s.alias)).repondre, false);
  await db.query(`update mail_recu set repondu_le = null where motif = 'inconnu'`);
  for (let i = 0; i < 19; i++) await ouvrir('boucle@ailleurs.fr', s.alias);
  assert.equal((await ouvrir('boucle@ailleurs.fr', s.alias)).cas, 'inconnu');
  const t = await ouvrir('boucle@ailleurs.fr', s.alias);
  assert.deepEqual([t.cas, t.repondre], ['trop', false]);
  await refuse(() => ouvrir('pas une adresse', s.alias), /Expéditeur illisible/);
});

const lignes = (...ids) => ids.map((prestation) => ({ prestation, quantite: 1 }));
await test('mail_deposer : même demande que deposer_demande (unités de la base, historique, journal), au nom du membre', async () => {
  const s = await scene();
  const r = await ouvrir(s.con.email, s.alias);
  const id = await ok('mail_deposer', { p_mail: r.mail, p_titre: 'Marché de Noël', p_lignes: lignes('post', 'actu'), p_parution: '2026-12-05', p_brief: 'Le texte du mail.' });
  // la même demande déposée depuis l'Espace par la même personne
  await compte(s.con.id);
  const ref = (await un(`select deposer_demande('Marché de Noël', $1::jsonb, false, '2026-12-05', 'Le texte du mail.') as id`, [JSON.stringify(lignes('post', 'actu'))])).id;
  await serveur();
  const col = `organisation_id, auteur_id, titre, offre_id, urgente, urgence_incluse, parution, brief, statut, unites, unites_hors_forfait, livraison, corrections, heure`;
  const [parMail, parEspace] = [await un(`select ${col} from demande where id = $1`, [id]), await un(`select ${col} from demande where id = $1`, [ref])];
  assert.deepEqual(parMail, parEspace);
  assert.deepEqual([parMail.unites, parMail.statut, parMail.auteur_id], [2, 'deposee', s.con.id]);
  const l = (d) => tous(`select prestation, quantite, unites, offre_id from demande_ligne where demande_id = $1 order by prestation`, [d]);
  assert.deepEqual(await l(id), await l(ref));
  const h = (d) => un(`select statut, type, detail, par from historique where demande_id = $1`, [d]);
  assert.deepEqual(await h(id), await h(ref));
  const j = await un(`select acteur, action, details from journal where cible = $1`, [id]);
  assert.deepEqual([j.acteur, j.action, j.details.unites, j.details.canal], [s.con.id, 'depot', 2, 'mail']);
  assert.deepEqual(await un(`select texte, systeme, auteur_id from message where demande_id = $1`, [id]), { texte: 'Demande reçue par mail, envoyée par Lena Riou.', systeme: true, auteur_id: null });
  assert.deepEqual(await un(`select issue, demande_id, texte from mail_recu where id = $1`, [r.mail]), { issue: 'deposee', demande_id: id, texte: null });
  await refuse(() => ok('mail_deposer', { p_mail: r.mail, p_titre: 'Encore', p_lignes: lignes('post'), p_parution: null, p_brief: '' }), /déjà traité/);
});

await test('mail_deposer : la place sur le compte est vérifiée comme dans l’Espace ; rien ne reste d’un dépôt refusé', async () => {
  const s = await scene({ unites: 2 });
  const a = await ouvrir(s.ref.email, s.alias);
  await ok('mail_deposer', { p_mail: a.mail, p_titre: 'Première demande', p_lignes: lignes('post', 'agenda'), p_parution: null, p_brief: 'Texte' });
  const b = await ouvrir(s.ref.email, s.alias);
  const r = await rpc('mail_deposer', { p_mail: b.mail, p_titre: 'Seconde demande', p_lignes: lignes('post'), p_parution: null, p_brief: 'Texte' });
  assert.equal(r.error.code, 'P0001');
  assert.match(r.error.message, /^Unités insuffisantes : cette demande compte 1 unité\(s\), il en reste 0 sur le compte/);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 1);
  assert.equal((await un(`select issue from mail_recu where id = $1`, [b.mail])).issue, 'recu');
  // structure sans unités (pas encore activée) : même refus
  const v = await scene({ unites: 0, statut: 'a_activer' });
  const c = await ouvrir(v.ref.email, v.alias);
  assert.match((await rpc('mail_deposer', { p_mail: c.mail, p_titre: 'Sans unités', p_lignes: lignes('post'), p_parution: null, p_brief: 'x' })).error.message, /^Unités insuffisantes/);
});

await test('mail_deposer : garde-fou en base, jamais de prestation coûteuse ni de quantité par mail', async () => {
  const s = await scene({ unites: 40, formule: 'regulier' });
  // les essais précédents sont vieillis : le plafond de 20 mails par heure n'est pas l'objet de ce test
  const essai = async (l) => { await db.query(`update mail_recu set recu = now() - interval '2 days' where expediteur = $1`, [s.ref.email]); const m = await ouvrir(s.ref.email, s.alias); return rpc('mail_deposer', { p_mail: m.mail, p_titre: 'Essai garde-fou', p_lignes: l, p_parution: null, p_brief: 'x' }); };
  for (const p of ['affiche', 'flyer', 'news', 'page', 'bulletin', 'presse', 'photo', 'moder']) {
    assert.match((await essai(lignes(p))).error.message, /ne se dépose pas par mail/, p);
    assert.match((await essai(lignes('post', p))).error.message, /ne se dépose pas par mail/, `post + ${p}`);
  }
  assert.match((await essai([{ prestation: 'post', quantite: 2 }])).error.message, /ne se dépose pas par mail/);
  assert.match((await essai([{ prestation: 'post', quantite: 1 }, { prestation: 'post', quantite: 1 }])).error.message, /ne se dépose pas par mail/);
  assert.match((await essai(lignes('post', 'actu', 'agenda', 'gabarit'))).error.message, /ne se dépose pas par mail/);
  assert.match((await essai([])).error.message, /Choisissez au moins une prestation/);
  assert.match((await essai(lignes('inconnue'))).error.message, /Prestation inconnue/);
  assert.equal((await essai(lignes('post', 'actu', 'agenda'))).error, null);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 1);
  // contrainte réelle sur le titre (3 à 140 caractères)
  const m = await ouvrir(s.ref.email, s.alias);
  assert.match((await rpc('mail_deposer', { p_mail: m.mail, p_titre: 'ab', p_lignes: lignes('post'), p_parution: null, p_brief: 'x' })).error.message, /demande_titre_check/);
});

await test('mail_deposer : un compte retiré ou passé en lecture entre-temps ne dépose plus', async () => {
  const s = await scene();
  const m = await ouvrir(s.con.email, s.alias);
  await db.query(`update profil set role = 'lecteur' where id = $1`, [s.con.id]);
  assert.match((await rpc('mail_deposer', { p_mail: m.mail, p_titre: 'Trop tard', p_lignes: lignes('post'), p_parution: null, p_brief: 'x' })).error.message, /Seuls le référent et les contributeurs/);
});

await test('lien pré-rempli : le mail attend, puis ses pièces rejoignent la demande envoyée depuis l’Espace', async () => {
  const s = await scene(), autre = await scene();
  const m = await ouvrir(s.con.email, s.alias);
  await ok('mail_classer', { p_mail: m.mail, p_issue: 'a_completer', p_motif: 'support_manquant', p_titre: 'Travaux rue de la Gare', p_texte: 'Le texte transféré.', p_parution: null, p_lignes: [] });
  const pieces = [{ nom: 'arrêté.pdf', chemin: `${s.o}/mail/${m.mail}/1-arrete.pdf`, taille: 1200, type: 'application/pdf' }, { nom: 'film.mp4', motif: 'poids' }, { nom: 'piège.pdf', chemin: `${autre.o}/mail/x/1-piege.pdf` }];
  assert.equal(await ok('mail_pieces', { p_mail: m.mail, p_pieces: pieces }), 0);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 0);

  // le client ouvre le lien : il lit le mail en attente de sa structure, et seulement celui-là
  await compte(s.con.id); await db.exec(`set role authenticated`);
  const vu = await tous(`select titre, texte, issue, motif, lignes from mail_recu`);
  assert.deepEqual(vu, [{ titre: 'Travaux rue de la Gare', texte: 'Le texte transféré.', issue: 'a_completer', motif: 'support_manquant', lignes: [] }]);
  const d = (await un(`select deposer_demande('Travaux rue de la Gare', '[{"prestation":"actu","quantite":1}]'::jsonb, false, null, 'Le texte transféré.') as id`)).id;
  assert.equal((await un(`select mail_rattacher($1, $2) as n`, [m.mail, d])).n, 1);
  assert.equal((await un(`select mail_rattacher($1, $2) as n`, [m.mail, d])).n, 0);       // déjà fait : sans effet
  await serveur();
  assert.deepEqual(await tous(`select nom, chemin from piece_jointe where demande_id = $1`, [d]), [{ nom: 'arrêté.pdf', chemin: `${s.o}/mail/${m.mail}/1-arrete.pdf` }]);
  assert.deepEqual(await un(`select issue, demande_id, texte from mail_recu where id = $1`, [m.mail]), { issue: 'deposee', demande_id: d, texte: null });
  assert.match((await un(`select texte from message where demande_id = $1 and systeme`, [d])).texte, /préparée à partir d'un mail.*Lena Riou/);
});

await test('mail_rattacher : ni une autre structure, ni la demande d’un collègue, ni une demande ancienne, ni un lecteur', async () => {
  const s = await scene(), autre = await scene();
  const attente = async () => { const m = await ouvrir(s.con.email, s.alias); await ok('mail_classer', { p_mail: m.mail, p_issue: 'a_completer', p_motif: 'support_manquant', p_titre: 'Titre du mail', p_texte: 'Texte', p_parution: null, p_lignes: [] }); return m.mail; };
  const m = await attente();
  const deposer = async (qui) => { await compte(qui); return (await un(`select deposer_demande('Demande test', '[{"prestation":"post","quantite":1}]'::jsonb, false, null, 'x') as id`)).id; };
  const dAutre = await deposer(autre.ref.id);
  await refuse(() => db.query(`select mail_rattacher($1, $2)`, [m, dAutre]), /Demande introuvable/);
  // un autre contributeur ne reprend pas le mail de sa collègue, même sur sa propre demande
  await serveur();
  const col = await un(`insert into profil (nom, email, role, organisation_id) values ('Paul Morvan', 'paul.morvan.collegue@exemple.fr', 'contributeur', $1) returning id`, [s.o]);
  const dCol = await deposer(col.id);
  await refuse(() => db.query(`select mail_rattacher($1, $2)`, [m, dCol]), /ne peut pas être rattaché/);
  const dRef = await deposer(s.ref.id);
  await compte(s.con.id);
  await refuse(() => db.query(`select mail_rattacher($1, $2)`, [m, dRef]), /ne peut pas être rattaché/);
  const dCon = await deposer(s.con.id);
  await serveur(); await db.query(`update demande set creee = now() - interval '20 minutes' where id = $1`, [dCon]);
  await compte(s.con.id);
  await refuse(() => db.query(`select mail_rattacher($1, $2)`, [m, dCon]), /ne peut pas être rattaché/);
  await compte(s.lec.id);
  await refuse(() => db.query(`select mail_rattacher($1, $2)`, [m, dCon]), /Accès refusé/);
  await db.exec(`set role anon`);
  await refuse(() => db.query(`select mail_rattacher($1, $2)`, [m, dCon]), /permission denied/);
  await serveur();
  assert.equal((await un(`select issue from mail_recu where id = $1`, [m])).issue, 'a_completer');
});

await test('étanchéité : un compte ne lit que les mails de sa structure devenus ou à devenir une demande, et n’écrit rien', async () => {
  const a = await scene(), b = await scene();
  const ma = await ouvrir(a.ref.email, a.alias), mb = await ouvrir(b.ref.email, b.alias);
  for (const m of [ma, mb]) await ok('mail_classer', { p_mail: m.mail, p_issue: 'a_completer', p_motif: 'support_manquant', p_titre: 'Un titre', p_texte: 'x', p_parution: null, p_lignes: [] });
  await ouvrir('inconnu@ailleurs.fr', a.alias);
  // le référent lit les mails en attente de sa structure ; un lecteur ou un collègue contributeur ne lit pas celui d'un autre
  for (const [qui, attendu] of [[a.lec.id, []], [a.con.id, []], [a.ref.id, [ma.mail]]]) {
    await compte(qui); await db.exec(`set role authenticated`);
    assert.deepEqual((await tous(`select id from mail_recu`)).map((x) => x.id), attendu);
  }
  await refuse(() => db.query(`select message_id from mail_recu`), /permission denied/);
  await refuse(() => db.query(`update mail_recu set issue = 'deposee'`), /permission denied/);
  await refuse(() => db.query(`insert into mail_recu (message_id, expediteur) values ('x', 'a@b.fr')`), /permission denied/);
  await refuse(() => db.query(`delete from mail_recu`), /permission denied/);
  for (const f of [`mail_ouvrir('x', 'a@b.fr', '{}')`, `mail_deposer('${ma.mail}', 'Titre', '[]')`, `mail_classer('${ma.mail}', 'refuse', 'x')`, `mail_pieces('${ma.mail}', '[]')`, `mail_repondu('${ma.mail}')`, `mail_purger()`, `alias_mail_libre('x')`]) {
    await refuse(() => db.query(`select ${f}`), /permission denied/);
  }
  await db.exec(`set role anon`);
  await refuse(() => db.query(`select id from mail_recu`), /permission denied/);
  // même sans passer par les droits d'exécution, les fonctions vérifient le rôle du serveur
  await db.exec(`reset role; select set_config('test.role', 'authenticated', false);`);
  await refuse(() => db.query(`select mail_ouvrir('y', 'a@b.fr', '{}')`), /Réservé au serveur/);
  await refuse(() => db.query(`select mail_purger()`), /Réservé au serveur/);
  await serveur();
});

await test('mail_classer : seul un mail en cours se classe ; le pré-remplissage exige un membre reconnu', async () => {
  const s = await scene();
  const inc = await ouvrir('qui@ailleurs.fr', s.alias);
  assert.match((await rpc('mail_classer', { p_mail: inc.mail, p_issue: 'a_completer', p_motif: 'x', p_titre: 'Titre', p_texte: 'x', p_parution: null, p_lignes: [] })).error.message, /déjà traité/);
  const m = await ouvrir(s.ref.email, s.alias);
  assert.match((await rpc('mail_classer', { p_mail: m.mail, p_issue: 'deposee', p_motif: 'x' })).error.message, /Issue inconnue/);
  await ok('mail_classer', { p_mail: m.mail, p_issue: 'refuse', p_motif: 'contenu_insuffisant', p_titre: null, p_texte: 'ne doit pas rester', p_parution: null, p_lignes: null });
  assert.deepEqual(await un(`select issue, motif, texte, lignes from mail_recu where id = $1`, [m.mail]), { issue: 'refuse', motif: 'contenu_insuffisant', texte: null, lignes: [] });
});

await test('mail_purger : un mail à compléter expire après 30 jours, ses pièces sont rendues pour être retirées du stockage', async () => {
  const s = await scene();
  const m = await ouvrir(s.ref.email, s.alias), recent = await ouvrir(s.ref.email, s.alias), vieux = await ouvrir('vieux@ailleurs.fr', s.alias);
  for (const x of [m, recent]) await ok('mail_classer', { p_mail: x.mail, p_issue: 'a_completer', p_motif: 'support_manquant', p_titre: 'Un titre', p_texte: 'Texte', p_parution: null, p_lignes: [] });
  await ok('mail_pieces', { p_mail: m.mail, p_pieces: [{ nom: 'a.pdf', chemin: `${s.o}/mail/${m.mail}/1-a.pdf` }, { nom: 'b.mp4', motif: 'poids' }] });
  await db.query(`update mail_recu set recu = now() - interval '31 days' where id = $1`, [m.mail]);
  await db.query(`update mail_recu set recu = now() - interval '91 days' where id = $1`, [vieux.mail]);
  assert.deepEqual(await ok('mail_purger', { p_jours: 30 }), [`${s.o}/mail/${m.mail}/1-a.pdf`]);
  assert.deepEqual(await un(`select issue, motif, texte, pieces from mail_recu where id = $1`, [m.mail]), { issue: 'refuse', motif: 'expire', texte: null, pieces: [] });
  assert.equal((await un(`select issue from mail_recu where id = $1`, [recent.mail])).issue, 'a_completer');
  assert.equal((await un(`select count(*)::int as n from mail_recu where id = $1`, [vieux.mail])).n, 0);
  assert.deepEqual(await ok('mail_purger', { p_jours: 30 }), []);
  // un traitement jamais abouti ne reste pas « en cours »
  const plan = await ouvrir(s.ref.email, s.alias);
  await db.query(`update mail_recu set recu = now() - interval '2 days' where id = $1`, [plan.mail]);
  await ok('mail_purger', { p_jours: 30 });
  assert.deepEqual(await un(`select issue, motif from mail_recu where id = $1`, [plan.mail]), { issue: 'ignore', motif: 'interrompu' });
});

// ---------------------------------------------------------------------------------------------------
// 2. Règles d'analyse, sur des mails réalistes
// ---------------------------------------------------------------------------------------------------
const dossier = mkdtempSync(join(tmpdir(), 'reception-'));
const assembler = async (entree, nom, plugins = []) => {
  const { outputFiles } = await build({ entryPoints: [join(ici, '..', 'functions', ...entree)], bundle: true, format: 'esm', write: false, logLevel: 'error', plugins });
  writeFileSync(join(dossier, nom), outputFiles[0].text);
  return import(pathToFileURL(join(dossier, nom)).href);
};
const R = await assembler(['_partage', 'regles', 'reception.ts'], 'regles.mjs');
const T = await assembler(['reception', 'traiter.ts'], 'traiter.mjs');
const A = await assembler(['_partage', 'regles', 'transfert.ts'], 'transfert.mjs');
const lire = (item) => R.lireMail(item, 'demandes.studioes.fr');
const analyse = (item, c = {}) => { const m = lire(item); return R.analyser(m, { aujourdhui: AUJ, authentification: R.authentification(m.entetes, m.de), ...c }); };
const ids = (a) => a.lignes.map((l) => l.prestation);

await test('transfert Outlook avec signature et fil cité : deux supports courants, date demandée, brief complet', async () => {
  const m = lire(M.transfertOutlook());
  assert.deepEqual([m.de, m.destinataires, m.nom], ['yann.legall@saint-ivenec.example', ['commune-de-saint-ivenec'], 'Yann Le Gall']);
  assert.equal(R.automatique(m, {}), null);
  const a = analyse(M.transfertOutlook());
  assert.deepEqual([a.decision, a.motif, a.titre, a.parution, ids(a), a.transfert], ['deposer', null, 'Marché de Noël du 12 décembre', '2026-12-05', ['post', 'actu'], true]);
  assert.match(a.brief, /^Bonjour,\n\nPouvez-vous publier cette information/);
  assert.match(a.brief, /Message transféré :\nDe : Comité des fêtes/);
  assert.match(a.brief, /Trente exposants, vin chaud/);
  assert.match(a.brief, /avez-vous arrêté la date du marché de Noël \?/);        // le fil cité reste lisible, sans chevrons
  assert.ok(!/^>/m.test(a.brief) && !/_{8,}/.test(a.brief));
  // le logo de signature est laissé de côté, le programme est repris
  assert.deepEqual([a.pieces.map((p) => p.nom), a.piecesEcartees], [['Programme marché de Noël.pdf'], []]);
});

await test('la signature et le texte transféré ne décident de rien', async () => {
  // la signature dit « Suivez la commune sur Facebook… notre site internet » : sans consigne, aucun support
  const item = M.transfertOutlook();
  item.RawTextBody = item.RawTextBody.replace(/Pouvez-vous publier[^\r]+/, 'Pour information.');
  const a = analyse(item);
  assert.deepEqual([a.decision, a.motif, ids(a), a.parution], ['completer', 'support_manquant', [], null]);
  // transfert sans un mot : le mail d'origine demande de « relayer sur votre site internet », ce n'est pas le client qui parle
  const b = analyse(M.transfertSansConsigne());
  assert.deepEqual([b.decision, b.motif, b.titre, ids(b)], ['completer', 'support_manquant', 'Travaux rue de la Gare du 16 au 27 novembre', []]);
  assert.match(b.brief, /^Message transféré :\nDe : Direction des routes/);
  // les dates du message transféré (12 décembre, 16 au 27 novembre) ne deviennent jamais une date de parution
  assert.equal(b.parution, null);
});

await test('mail sans objet : le titre vient de la première ligne, le pied du téléphone disparaît', async () => {
  const a = analyse(M.sansObjet());
  assert.deepEqual([a.decision, ids(a), a.parution], ['deposer', ['post'], null]);
  assert.ok(a.titre.startsWith('Fermeture exceptionnelle de la mairie vendredi 13 novembre') && a.titre.length <= 90);
  assert.ok(!/iPhone/.test(a.brief));
  // ni objet ni texte ni pièce : rien à faire
  const vide = analyse({ ...M.sansObjet(), RawTextBody: '   ' });
  assert.deepEqual([vide.decision, vide.motif, vide.titre], ['completer', 'contenu_insuffisant', null]);
  // un objet seul, sans texte, mais avec une pièce : l'information est dans la pièce
  const pj = analyse({ ...M.afficheFournie(), RawTextBody: '' });
  assert.deepEqual([pj.decision, pj.motif, pj.brief], ['completer', 'support_manquant', 'Information dans les pièces jointes du mail.']);
});

await test('pièces jointes : trop lourde et exécutable écartées avec leur motif, carte de visite ignorée, limites de nombre et de poids', async () => {
  const a = analyse(M.pieceLourde());
  assert.deepEqual([a.decision, ids(a)], ['deposer', ['agenda']]);
  assert.deepEqual(a.pieces.map((p) => p.nom), ['carton voeux.pdf']);
  assert.deepEqual(a.piecesEcartees, [{ nom: 'film-voeux-2027.mp4', motif: 'poids' }, { nom: 'installeur.exe', motif: 'type' }]);
  const beaucoup = Array.from({ length: 12 }, (_, i) => ({ nom: `photo-${i}.jpg`, type: 'image/jpeg', taille: 4 * 1024 * 1024, integree: false, jeton: `j${i}` }));
  const t = R.trierPieces(beaucoup);
  assert.deepEqual([t.gardees.length, t.ecartees.length, t.ecartees[0].motif], [7, 5, 'nombre']);       // 30 Mo au total
  assert.equal(R.trierPieces([{ nom: 'a.pdf', type: 'application/pdf', taille: 10, integree: false, jeton: null }]).ecartees[0].motif, 'illisible');
  assert.equal(R.cheminPiece('org', 'dem', 'Programme marché de Noël (v2).pdf', 1700000000000), 'org/dem/1700000000000-Programme_marche_de_Noel_v2_.pdf');
  assert.equal(R.cheminPiece('org', 'dem', '../../etc/passwd', 1), 'org/dem/1-.._.._etc_passwd'.replace('.._.._', '.._.._'));
  assert.ok(!R.cheminPiece('org', 'dem', lire({ ...M.sansObjet(), Attachments: [{ Name: '../../x.pdf', ContentLength: 1, DownloadToken: 't' }] }).pieces[0].nom, 1).includes('/..'));
});

await test('mails automatiques et boucles : écartés sans réponse', async () => {
  const c = { domaine: 'demandes.studioes.fr', adressesFill: ['contact@studioes.fr'] };
  const motif = (item) => R.automatique(lire(item), c);
  assert.equal(motif(M.reponseAutomatique()), 'automatique');
  assert.equal(motif({ ...M.reponseAutomatique(), Headers: {} }), 'automatique');               // l'objet suffit
  assert.equal(motif({ ...M.sansObjet(), Subject: 'Absent du bureau jusqu’au 16' }), 'automatique');
  assert.equal(motif(M.nonRemis()), 'automatique');
  assert.equal(motif(M.lettreRedirigee()), 'automatique');
  assert.equal(motif({ ...M.lettreRedirigee(), Headers: { 'List-Id': '<infos.agence.example>' } }), 'liste');
  assert.equal(motif({ ...M.sansObjet(), From: { Address: 'contact@studioes.fr' } }), 'boucle');
  assert.equal(motif({ ...M.sansObjet(), From: { Address: 'autre-commune@demandes.studioes.fr' } }), 'boucle');
  assert.equal(motif({ ...M.sansObjet(), From: { Address: 'no-reply@plateforme.example' } }), 'automatique');
  // une réponse à l'un des messages de Fill ne relance jamais le traitement
  assert.equal(motif({ ...M.sansObjet(), Subject: 'RE: Bien reçu : Marché de Noël' }), 'boucle');
  assert.equal(motif({ ...M.sansObjet(), Subject: 'RE: [Test] À compléter : Travaux' }), 'boucle');
  assert.equal(motif({ ...M.sansObjet(), Subject: 'TR: Bien reçu : Marché de Noël' }), 'boucle');               // renvoi automatique d'une réponse de Fill
  assert.equal(motif({ ...M.sansObjet(), Subject: 'Fwd: Adresse non reconnue : votre mail n’a pas été enregistré' }), 'boucle');
  assert.equal(motif({ ...M.sansObjet(), Subject: 'Bien reçu : merci pour la livraison' }), null);                // sans préfixe : un mail comme un autre
  // un vrai mail, même avec « Auto-Submitted: no », se traite
  assert.equal(motif({ ...M.sansObjet(), Headers: { 'Auto-Submitted': 'no' } }), null);
  assert.equal(motif(M.afficheFournie()), null);
});

await test('supports : jamais de prestation coûteuse devinée', async () => {
  // une affiche commandée et un post : tout se confirme dans l'Espace, les deux pré-cochés
  const a = analyse(M.afficheDemandee());
  assert.deepEqual([a.decision, a.motif, ids(a), a.parution], ['completer', 'support_a_confirmer', ['post', 'affiche'], null]);
  // l'affiche fournie en pièce jointe, à relayer : un post, pas une création
  const b = analyse(M.afficheFournie());
  assert.deepEqual([b.decision, ids(b), b.pieces.length], ['deposer', ['post'], 1]);
  // tournure négative : rien n'est déposé, seul le support demandé sans réserve est pré-coché
  const c = analyse(M.tournureNegative());
  assert.deepEqual([c.decision, c.motif, ids(c)], ['completer', 'support_a_confirmer', ['actu']]);
  const sup = (texte, objet = '') => { const s = R.supportsDemandes({ objet, texte }); return [s.sur, s.lignes.map((l) => l.prestation).join('+')]; };
  assert.deepEqual(sup('Merci de bien vouloir publier ce communiqué sur notre page Facebook et dans l’agenda.'), [true, 'post+agenda']);
  assert.deepEqual(sup('À mettre sur le site internet et à relayer sur Facebook.'), [true, 'post+actu']);
  // un support évoqué sans consigne de publication est pré-coché, jamais déposé
  assert.deepEqual(sup('Pour Facebook. Merci'), [false, 'post']);
  assert.deepEqual(sup('', 'Post Facebook : collecte de jouets'), [false, 'post']);
  assert.deepEqual(sup('Un post pour annoncer le marché de Noël serait bien.'), [false, 'post']);
  assert.deepEqual(sup('Pouvez-vous préparer la newsletter de décembre ?'), [false, 'news']);
  assert.deepEqual(sup('Nous aurions besoin d’un flyer et d’une actualité sur le site.'), [false, 'actu+flyer']);
  assert.deepEqual(sup('Il faudrait un communiqué de presse pour annoncer l’ouverture de la médiathèque rénovée, avec des photos.'), [false, 'presse']);
  assert.deepEqual(sup('Merci de publier le programme des animations sur Facebook.'), [true, 'post']);          // le programme est le contenu, pas une commande
  // récit sans consigne : mentionner Facebook ou le site ne suffit pas
  assert.deepEqual(sup('Nous avons vu passer sur Facebook plusieurs questions des habitants au sujet du nouveau plan de circulation du centre-bourg, qui entre en vigueur lundi.'), [false, '']);
  assert.deepEqual(sup('Les inscriptions sont ouvertes jusqu’au 30 novembre. Retrouvez le programme complet sur notre site internet. Suivez-nous sur Facebook.'), [false, '']);
  assert.deepEqual(sup('Travaux sur le site de l’ancienne école et sur les réseaux d’eau à partir de lundi : merci de prévenir les riverains comme vous le jugez utile.'), [false, '']);
  assert.deepEqual(sup('Déjà publié sur Facebook hier.'), [false, '']);
  assert.deepEqual(sup('Je passe à la poste puis je vous rappelle au sujet de la réunion.'), [false, '']);
  // mails qui parlent d'un support sans demander de publication : aucun ne doit partir en dépôt direct
  for (const [objet, texte] of [
    ['Problème de connexion à notre page Facebook', 'Nous n’arrivons plus à nous connecter à la page Facebook de la mairie.'],
    ['Mot de passe du site internet', 'Je ne retrouve plus le mot de passe du site internet.'],
    ['Statistiques Facebook du mois', 'Pouvez-vous nous envoyer les statistiques ?'],
    ['Commentaires désagréables sur Facebook', 'Que faire ?'],
    ['', 'Merci pour la publication d’hier sur Facebook, les retours sont très bons.'],
    ['', 'Il y a une erreur dans la publication Facebook de ce matin, pouvez-vous corriger ?'],
    ['', 'Le concert est annulé. Merci de retirer la publication Facebook et l’actualité correspondante.'],
    ['', 'Ne publiez plus rien sur Facebook jusqu’à nouvel ordre.'],
    ['', 'Finalement, il ne faut plus publier l’article sur Facebook.'],
    ['', 'Peux-tu supprimer l’actualité sur le site internet ?'],
    ['', 'Combien d’unités coûte une publication sur Instagram ?'],
    ['', 'Nous réfléchissons à faire un post par semaine l’an prochain.'],
    ['', 'Pouvez-vous me rappeler au sujet du site internet ?'],
    ['', 'Voici les nouveaux identifiants pour Facebook.'],
    ['', 'Je dois regarder mon agenda avant de vous confirmer la réunion.'],
    ['', 'Ci-joint le compte rendu.\nYann Le Gall\nMairie de Plou - Facebook @mairiedeplou'],
    ['', 'Pour le site internet seulement cette fois, on verra Facebook plus tard.'],
    ['', 'Avant de publier quoi que ce soit sur le site internet, attendez mon feu vert.'],
    ['', 'Merci de publier ceci sur Facebook si le maire est d’accord.'],
    ['', 'Le concert est annulé, merci de l’annoncer sur Facebook.'],
    ['Agenda du maire', 'Voici l’agenda du maire pour la semaine.'],
  ]) assert.equal(R.supportsDemandes({ objet, texte }).sur, false, `${objet} // ${texte}`);
  // « si possible » reste une politesse
  assert.deepEqual(sup('Merci de publier cette information sur Facebook si possible.'), [true, 'post']);
});

await test('date souhaitée : seulement une tournure explicite du client, dans l’année qui vient', async () => {
  const d = (t) => R.dateSouhaitee(t, AUJ);
  assert.equal(d('À publier le 5 décembre.'), '2026-12-05');
  assert.equal(d('À publier sur Facebook pour le 20/11 svp'), '2026-11-20');
  assert.equal(d('À paraître avant le lundi 4 janvier 2027'), '2027-01-04');
  assert.equal(d('Parution le 1er mars'), '2027-03-01');                      // sans année : la prochaine occurrence
  assert.equal(d('À publier le 15 janvier'), '2027-01-15');
  // une date du jour ou tout juste passée, sans année, ne devient pas l'an prochain
  assert.equal(d('À publier le 11 novembre sur Facebook'), null);
  assert.equal(d('À publier le 3 novembre'), null);
  // sans verbe de publication devant, une date est celle d'un événement
  assert.equal(d('Pour le 20/11 svp'), null);
  assert.equal(d('Atelier numérique pour le 14 décembre, à relayer sur Facebook.'), null);
  assert.equal(d('Suite à la publication du 5 novembre, merci de publier sur le site un complément.'), null);
  assert.equal(d('Repas pour 2/3 des inscrits, à publier sur Facebook.'), null);
  assert.equal(d('Le marché a lieu le 12 décembre.'), null);                 // une date d'événement n'est pas une date de parution
  assert.equal(d('à publier le 11 novembre 2026'), null);                    // aujourd'hui ou passé
  assert.equal(d('à publier le 31/02'), null);
  assert.equal(d('à publier le 5 décembre 2029'), null);
  assert.equal(d('À publier le 5 décembre. Ou plutôt à publier le 8 décembre.'), null);   // deux dates : aucune
  assert.equal(d(''), null);
});

await test('transfert Gmail en HTML seul, objets à préfixes, réponse citée', async () => {
  const a = analyse(M.transfertGmailHtml());
  assert.deepEqual([a.decision, a.titre, ids(a), a.parution, a.transfert], ['deposer', 'Collecte de jouets', ['post'], '2026-11-20', true]);
  assert.match(a.brief, /^Bonjour,\n\nÀ publier sur les réseaux sociaux pour le 20\/11 svp\./);
  assert.match(a.brief, /Message transféré :\nDe : CCAS <ccas@saint-ivenec\.example>/);
  assert.match(a.brief, /collecte de jouets du 23 au 28 novembre à la médiathèque/);
  assert.deepEqual(R.sujetNettoye('TR : RE: [EXTERNE] Fwd:  Vœux 2027 '), { titre: 'Vœux 2027', transfert: true, reponse: true });
  assert.deepEqual(R.sujetNettoye('Réunion : ordre du jour'), { titre: 'Réunion : ordre du jour', transfert: false, reponse: false });
  const cite = R.decouper('Oui, à mettre sur le site.\n\nLe mer. 11 nov. 2026 à 10:12, Jean Dupont <jean@exemple.fr> a\nécrit :\n> Faut-il publier ?\n> Merci');
  assert.deepEqual(cite, { note: 'Oui, à mettre sur le site.', cite: 'Le mer. 11 nov. 2026 à 10:12, Jean Dupont <jean@exemple.fr> a\nécrit :\nFaut-il publier ?\nMerci', transfert: true });
  // un titre trop long est coupé proprement, un brief trop long est abrégé
  const long = analyse({ ...M.sansObjet(), Subject: 'Mot '.repeat(60), RawTextBody: 'A mettre sur Facebook.\n' + 'Ligne de texte. '.repeat(800) });
  assert.ok(long.titre.length <= 140 && long.titre.endsWith('…'));
  assert.ok(long.brief.length <= 6000 && /Texte abrégé/.test(long.brief));
});

await test('origine du mail : dépôt direct sur preuve alignée seulement ; échec ou absence de preuve, le client confirme dans l’Espace', async () => {
  const a = analyse(M.origineDouteuse());
  assert.deepEqual([a.decision, a.motif, ids(a)], ['completer', 'origine_en_echec', ['post']]);
  // sans en-tête de contrôle : pas de dépôt direct, sauf si Fill a réglé RECEPTION_ORIGINE=adresse
  const nu = { ...M.afficheFournie(), Headers: {} };
  assert.deepEqual([analyse(nu).decision, analyse(nu).motif], ['completer', 'origine_non_prouvee']);
  assert.deepEqual([analyse(nu, { origine: 'adresse' }).decision, analyse(M.origineDouteuse(), { origine: 'adresse' }).motif], ['deposer', 'origine_en_echec']);
  const auth = (v, de = 'yann@mairie-x.fr') => R.authentification(typeof v === 'string' ? { 'authentication-results': v } : v, de);
  assert.equal(auth('mx; spf=pass smtp.mailfrom=mairie-x.fr; dkim=pass header.d=mairie-x.fr; dmarc=pass header.from=mairie-x.fr'), 'ok');
  assert.equal(auth('mx; dkim=pass header.d=mairie-x.fr'), 'ok');
  assert.equal(auth('mx; dkim=pass header.i=@mail.mairie-x.fr'), 'ok');                       // sous-domaine du même domaine
  assert.equal(auth('mx; spf=pass smtp.mailfrom=bounce@mairie-x.fr'), 'ok');
  // une preuve qui porte sur un autre domaine ne prouve rien
  assert.equal(auth('mx; spf=pass smtp.mailfrom=attaquant.example; dkim=none; dmarc=none'), 'inconnue');
  assert.equal(auth('mx; dkim=pass header.d=attaquant.example'), 'inconnue');
  assert.equal(auth('mx; dmarc=pass header.from=attaquant.example'), 'inconnue');
  assert.equal(auth('mx; dkim=pass header.d=x-mairie-x.fr'), 'inconnue');
  // un échec compte où qu'il soit ; un faux en-tête glissé devant ou derrière ne le couvre pas
  assert.equal(auth({ 'authentication-results': 'faux; dmarc=pass header.from=mairie-x.fr\nmx; dmarc=fail header.from=mairie-x.fr' }), 'echec');
  assert.equal(auth({ 'authentication-results': 'mx; dmarc=none; spf=none\nfaux; dmarc=pass header.from=mairie-x.fr' }), 'inconnue');
  assert.equal(auth('mx; spf=softfail; dkim=none'), 'echec');
  assert.equal(auth('mx; spf=fail; dkim=pass header.d=mairie-x.fr'), 'ok');                  // transfert : SPF échoue, la signature tient
  assert.equal(auth('mx; spf=fail; dkim=pass header.d=attaquant.example'), 'echec');
  assert.equal(auth({ 'received-spf': 'Fail (domain does not designate…)' }), 'echec');
  assert.equal(auth({ 'received-spf': 'pass' }), 'inconnue');
  assert.equal(auth({}), 'inconnue');
});

await test('caractères que la base refuse : retirés à la lecture, jamais d’erreur au dépôt', async () => {
  const m = lire({ ...M.afficheFournie(), Subject: 'Concert\u0000 du bagad \ud83c', RawTextBody: 'Merci de publier sur Facebook.\u0000 \udc00Fin' });
  assert.deepEqual([m.sujet, m.texte], ['Concert du bagad', 'Merci de publier sur Facebook. Fin']);
  // un objet fait de deux émojis ne compte que deux caractères en base : le titre vient alors du texte
  const e = analyse({ ...M.afficheFournie(), Subject: '🎄🎄', RawTextBody: 'Merci de publier le programme de Noël sur Facebook.' });
  assert.deepEqual([e.decision, e.titre], ['deposer', 'Merci de publier le programme de Noël sur Facebook.']);
  const coupe = analyse({ ...M.afficheFournie(), Subject: 'A'.repeat(138) + '🎄🎄🎄' });
  assert.ok(coupe.titre.length <= 140 && !/[\ud800-\udbff]$/.test(coupe.titre.replace(/…$/, '')));
  assert.equal(R.sain('a\u0000b\ud83cc🎄'), 'abc🎄');
});

await test('mails mal formés : jamais d’exception', async () => {
  const lus = M.malFormes().map((x) => lire(x));
  assert.deepEqual(lus.slice(0, 6), [null, null, null, null, null, null]);
  const bancal = lus[6];
  assert.deepEqual([bancal.de, bancal.destinataires, bancal.sujet, bancal.texte, bancal.pieces, bancal.spam], ['yann.legall@saint-ivenec.example', [], '', '', [], null]);
  assert.match(bancal.id, /^sans-id:[0-9a-f]{8}$/);
  assert.equal(lire(M.malFormes()[6]).id, bancal.id);                          // identifiant stable : pas de doublon au réessai
  assert.equal(R.automatique(bancal, {}), null);
  assert.equal(R.analyser(bancal, { aujourdhui: AUJ }).motif, 'contenu_insuffisant');
  const pieces = lus[7];
  assert.deepEqual(pieces.pieces, [{ nom: 'piece-jointe', type: '', taille: 0, integree: false, jeton: null }]);
  assert.equal(R.automatique(pieces, {}), 'automatique');                      // en-tête répété : lu sans erreur
  assert.equal(R.htmlVersTexte('<p>A &amp; B<br>&eacute;t&Eacute; &#233; &#x2019; &inconnu;</p><script>x()</script>').trim(), 'A & B\nétÉ é ’ &inconnu;');
});

await test('adresse et phrases montrées au client', async () => {
  assert.equal(A.adresseTransfert('commune-de-saint-ivenec'), 'commune-de-saint-ivenec@demandes.studioes.fr');
  assert.equal(A.adresseTransfert('Mairie-De-X', 'Courrier.Exemple.fr'), 'mairie-de-x@courrier.exemple.fr');
  assert.deepEqual([A.adresseTransfert(null), A.adresseTransfert(''), A.adresseTransfert('a b'), A.adresseTransfert(undefined, 'x.fr')], [null, null, null, null]);
  for (const t of [A.phraseBienvenue('a@demandes.studioes.fr'), A.phraseConfirmee('a@demandes.studioes.fr')]) {
    assert.ok(t.includes('a@demandes.studioes.fr') && t.length < 330 && !/[—–]/.test(t) && !/\bIA\b|Brevo|Claude/i.test(t));
  }
});

// ---------------------------------------------------------------------------------------------------
// 3. Déroulé complet : du JSON de Brevo à la demande en base
// ---------------------------------------------------------------------------------------------------
const FICHIERS = { 'jeton-programme': 284511, 'jeton-carton': 512000, 'jeton-affiche': 1800000, 'jeton-menteur': 16 * 1024 * 1024 };
const monde = (c = {}) => {
  const m = { envois: [], notifs: [], alertes: [], stockage: new Map(), telecharges: [] };
  m.d = {
    domaine: 'demandes.studioes.fr', site: 'https://fill.studioes.fr/espace', aujourdhui: AUJ, maintenant: () => 1794400000000,
    adressesFill: ['contact@studioes.fr'],
    echap: (t) => String(t ?? '').replace(/[&<>"]/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[x]),
    rpc: async (nom, args) => (c.panne === nom ? { data: null, error: { code: '57P01', message: 'connexion perdue' } } : rpc(nom, args)),
    unites: async (id) => (await un(`select unites from demande where id = $1`, [id]))?.unites ?? null,
    telecharger: async (jeton) => { m.telecharges.push(jeton); return FICHIERS[jeton] ? new Uint8Array(FICHIERS[jeton]) : null; },
    ranger: async (chemin, octets, type) => { if (c.stockageEnPanne) return false; m.stockage.set(chemin, { taille: octets.byteLength, type }); return true; },
    notifier: async (corps) => { m.notifs.push(corps); },
    envoyer: async (x) => { if (c.envoiEnPanne) return false; m.envois.push(x); return true; },
    alerter: async (x) => { m.alertes.push(x); return true; },
    origine: c.origine,
  };
  return m;
};
// un membre de la structure envoie l'un des mails d'exemple
// (avec la preuve d'origine de son domaine, sauf si le mail d'exemple porte déjà un contrôle en échec)
const de = (item, profil, alias) => ({
  ...item, From: { Name: 'Expéditeur', Address: profil.email }, Recipients: [`${alias}@demandes.studioes.fr`], To: [{ Address: `${alias}@demandes.studioes.fr` }],
  Headers: /fail/.test(item.Headers?.['Authentication-Results'] ?? '') ? item.Headers : { ...item.Headers, 'Authentication-Results': M.PREUVE(profil.email.split('@')[1]) },
});
const passer = async (item, m) => { const r = await T.traiter(item, m.d); if (r.suite) await r.suite; return r; };

await test('de bout en bout : le transfert Outlook devient une demande déposée, pièce rangée, Fill alerté, accusé envoyé', async () => {
  const s = await scene(), m = monde();
  const item = de(M.transfertOutlook(), s.ref, s.alias);
  const r = await passer(item, m);
  assert.equal(r.issue, 'deposee');
  const d = await un(`select titre, statut, unites, parution::text as parution, auteur_id, urgente, heure, brief from demande where id = $1`, [r.demande]);
  assert.deepEqual([d.titre, d.statut, d.unites, d.parution, d.auteur_id, d.urgente, d.heure], ['Marché de Noël du 12 décembre', 'deposee', 2, '2026-12-05', s.ref.id, false, null]);
  assert.match(d.brief, /Message transféré :/);
  // la pièce est rangée comme celles de l'Espace : <organisation>/<demande>/<horodatage>-<nom>
  const pj = await tous(`select nom, chemin from piece_jointe where demande_id = $1`, [r.demande]);
  assert.deepEqual(pj, [{ nom: 'Programme marché de Noël.pdf', chemin: `${s.o}/${r.demande}/1794400000000-Programme_marche_de_Noel.pdf` }]);
  assert.deepEqual([...m.stockage.entries()], [[pj[0].chemin, { taille: 284511, type: 'application/pdf' }]]);
  assert.deepEqual(m.telecharges, ['jeton-programme']);                      // le logo de signature n'est même pas téléchargé
  assert.deepEqual(m.notifs, [{ evenement: 'depot', demande: r.demande }]);
  const [accuse] = m.envois;
  assert.equal(m.envois.length, 1);
  assert.deepEqual([accuse.a[0].email, accuse.sujet, accuse.essai, accuse.enReponseA], [s.ref.email, 'Bien reçu : Marché de Noël du 12 décembre', false, item.MessageId]);
  assert.equal(accuse.texte[0], '« Marché de Noël du 12 décembre » : publication sur les réseaux sociaux et actualité sur le site, 2 unités, à publier le samedi 5 décembre 2026, 1 pièce jointe.');
  assert.deepEqual(accuse.bouton, { libelle: 'Voir la demande', lien: `https://fill.studioes.fr/espace/#demande-${r.demande}` });
  const recu = await un(`select issue, demande_id, repondu_le is not null as repondu from mail_recu where message_id = $1`, [item.MessageId]);
  assert.deepEqual(recu, { issue: 'deposee', demande_id: r.demande, repondu: true });
  // Brevo représente le même message : rien de plus
  const bis = await passer(item, m);
  assert.deepEqual([bis.issue, bis.motif, m.envois.length], ['ignore', 'doublon', 1]);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 1);
});

await test('de bout en bout : sans support nommé, rien n’est déposé ; réponse courte et lien pré-rempli, pièces gardées', async () => {
  const s = await scene(), m = monde();
  const item = de({ ...M.transfertSansConsigne(), Attachments: [{ Name: 'arrêté de circulation.pdf', ContentType: 'application/pdf', ContentLength: 512000, ContentID: null, DownloadToken: 'jeton-carton' }] }, s.con, s.alias);
  const r = await passer(item, m);
  assert.deepEqual([r.issue, r.motif], ['a_completer', 'support_manquant']);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 0);
  const recu = await un(`select id, issue, motif, titre, texte, lignes, pieces, profil_id from mail_recu where message_id = $1`, [item.MessageId]);
  assert.deepEqual([recu.issue, recu.motif, recu.titre, recu.lignes, recu.profil_id], ['a_completer', 'support_manquant', 'Travaux rue de la Gare du 16 au 27 novembre', [], s.con.id]);
  assert.match(recu.texte, /^Message transféré :/);
  assert.deepEqual(recu.pieces, [{ nom: 'arrêté de circulation.pdf', chemin: `${s.o}/mail/${recu.id}/1794400000000-arrete_de_circulation.pdf`, taille: 512000, type: 'application/pdf' }]);
  const [rep] = m.envois;
  assert.deepEqual([rep.sujet, rep.titre, rep.bouton], ['À compléter : Travaux rue de la Gare du 16 au 27 novembre', 'Il manque le support', { libelle: 'Terminer la demande', lien: `https://fill.studioes.fr/espace/?mail=${recu.id}` }]);
  assert.match(rep.texte[0], /ne dit pas sur quel support publier.*rien n’est donc engagé/);
  assert.match(rep.texte[1], /déjà remplie avec votre texte et vos pièces jointes/);
  assert.deepEqual(m.notifs, []);
  // Fill voit passer ce mail qui n'est pas devenu une demande, et peut répondre directement à son auteur
  const [alerte] = m.alertes;
  assert.deepEqual([m.alertes.length, alerte.sujet, alerte.repondreA.email], [1, `Mail non déposé : Travaux rue de la Gare du 16 au 27 novembre (Mairie de Plou-Test ${rang})`, s.con.email]);
  assert.match(alerte.texte[0], /Lena Riou a écrit à l’adresse de transfert\. Rien n’est déposé : aucun support nommé\..*1 pièce conservée/);
});

await test('de bout en bout : affiche demandée (à confirmer), tournure négative, origine douteuse : jamais de dépôt', async () => {
  const s = await scene({ unites: 40 }), m = monde();
  const premier = de(M.afficheDemandee(), s.ref, s.alias);
  const a = await passer(premier, m);
  const b = await passer(de(M.tournureNegative(), s.ref, s.alias), m);
  const c = await passer(de(M.origineDouteuse(), s.ref, s.alias), m);
  assert.deepEqual([a.motif, b.motif, c.motif], ['support_a_confirmer', 'support_a_confirmer', 'origine_en_echec']);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 0);
  assert.match(m.envois[0].texte[0], /Il semble demander : publication sur les réseaux sociaux et affiche\./);
  assert.match(m.envois[0].texte[0], /le nombre d’unités s’affiche avant l’envoi/);
  assert.deepEqual((await un(`select lignes from mail_recu where message_id = $1`, [premier.MessageId])).lignes, [{ prestation: 'post', quantite: 1 }, { prestation: 'affiche', quantite: 1 }]);
  assert.match(m.envois[2].texte[0], /le contrôle de son origine a échoué/);
  assert.equal(m.alertes.length, 3);
  // sans preuve d'origine : même prudence, mais les pièces sont gardées pour la demande pré-remplie ;
  // avec RECEPTION_ORIGINE=adresse, le même mail se dépose
  const sansPreuve = () => ({ ...de(M.afficheFournie(), s.ref, s.alias), Headers: {} });
  const m2 = monde();
  const n = await passer(sansPreuve(), m2);
  assert.deepEqual([n.issue, n.motif, m2.stockage.size, m2.envois[0].titre], ['a_completer', 'origine_non_prouvee', 1, 'Votre confirmation est nécessaire']);
  const echec = await passer({ ...de(M.afficheFournie(), s.ref, s.alias), Headers: { 'Authentication-Results': 'mx; dmarc=fail header.from=exemple.fr' } }, m2);
  assert.deepEqual([echec.motif, m2.stockage.size], ['origine_en_echec', 1]);          // pièce d'un mail en échec : non conservée
  const m3 = monde({ origine: 'adresse' });
  assert.equal((await passer(sansPreuve(), m3)).issue, 'deposee');
});

await test('de bout en bout : unités insuffisantes, la demande attend dans le lien pré-rempli', async () => {
  const s = await scene({ unites: 0, statut: 'a_activer' }), m = monde();
  const r = await passer(de(M.afficheFournie(), s.ref, s.alias), m);
  assert.deepEqual([r.issue, r.motif], ['a_completer', 'sans_unites']);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 0);
  const [rep] = m.envois;
  assert.equal(rep.titre, 'Il manque des unités');
  assert.match(rep.texte[0], /cette demande compte 1 unité\(s\), il en reste 0 sur le compte/);
  const recu = await un(`select lignes, pieces from mail_recu where organisation_id = $1`, [s.o]);
  assert.deepEqual([recu.lignes, recu.pieces.length], [[{ prestation: 'post', quantite: 1 }], 1]);
});

await test('de bout en bout : expéditeur inconnu, une réponse puis le silence ; lecteur ; autre structure', async () => {
  const s = await scene(), autre = await scene(), m = monde();
  const inconnu = { ...M.expediteurInconnu(), Recipients: [`${s.alias}@demandes.studioes.fr`] };
  const r = await passer(inconnu, m);
  assert.deepEqual([r.issue, r.motif, m.envois.length], ['refuse', 'inconnu', 1]);
  assert.deepEqual([m.envois[0].a[0].email, m.envois[0].sujet, m.envois[0].bouton], ['paul.morvan@association.example', 'Adresse non reconnue : votre mail n’a pas été enregistré', null]);
  assert.match(m.envois[0].texte[0], /paul\.morvan@association\.example n’y figure pas : rien n’a été enregistré/);
  assert.ok(!m.envois[0].texte.join(' ').includes('Plou-Test'));               // rien sur la structure visée
  await passer({ ...inconnu, MessageId: '<second@x>' }, m);
  assert.equal(m.envois.length, 1);
  // un inconnu au score de courrier indésirable élevé ne reçoit rien
  await passer({ ...inconnu, MessageId: '<spam@x>', From: { Address: 'promo@ailleurs.example' }, SpamScore: 7.2 }, m);
  assert.equal(m.envois.length, 1);
  // ni à une adresse dont le contrôle d'origine échoue (adresse sans doute imitée)
  const imite = await passer({ ...inconnu, MessageId: '<imite@x>', From: { Address: 'victime@tiers.example' }, Headers: { 'Authentication-Results': 'mx; spf=fail; dmarc=fail header.from=tiers.example' } }, m);
  assert.deepEqual([imite.motif, m.envois.length], ['inconnu', 1]);
  const lec = await passer(de(M.afficheFournie(), s.lec, s.alias), m);
  assert.deepEqual([lec.motif, m.envois[1].titre], ['lecteur', 'Votre compte permet de suivre, pas de demander']);
  const ail = await passer(de(M.afficheFournie(), s.ref, autre.alias), m);
  assert.equal(ail.motif, 'autre_structure');
  assert.match(m.envois[2].texte[1], new RegExp(`Renvoyez votre mail à ${s.alias}@demandes\\.studioes\\.fr\\.`));
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id in ($1, $2)`, [s.o, autre.o])).n, 0);
});

await test('de bout en bout : réponse automatique, avis de non-remise, lettre redirigée, mail venu de Fill : ni dépôt ni réponse', async () => {
  const s = await scene(), m = monde();
  const res = [];
  for (const item of [M.reponseAutomatique(), M.afficheFournie()]) res.push(await passer(de(item, s.ref, s.alias), m));     // le second pour comparaison
  for (const item of [M.nonRemis(), M.lettreRedirigee(), { ...M.afficheFournie(), From: { Address: 'contact@studioes.fr' } }]) res.push(await passer({ ...item, Recipients: [`${s.alias}@demandes.studioes.fr`] }, m));
  assert.deepEqual(res.map((r) => [r.issue, r.motif ?? null]), [['ignore', 'automatique'], ['deposee', null], ['ignore', 'automatique'], ['ignore', 'automatique'], ['ignore', 'boucle']]);
  assert.equal(m.envois.length, 1);
  assert.equal((await un(`select count(*)::int as n from demande where organisation_id = $1`, [s.o])).n, 1);
  assert.deepEqual((await tous(`select motif from mail_recu where organisation_id = $1 and issue = 'ignore' order by motif`, [s.o])).map((x) => x.motif), ['automatique', 'automatique', 'automatique', 'boucle']);
});

await test('de bout en bout : pièce trop lourde annoncée au client, poids réel recontrôlé, stockage en panne sans perte de la demande', async () => {
  const s = await scene(), m = monde();
  const r = await passer(de(M.pieceLourde(), s.ref, s.alias), m);
  assert.equal(r.issue, 'deposee');
  assert.deepEqual((await tous(`select nom from piece_jointe where demande_id = $1`, [r.demande])).map((x) => x.nom), ['carton voeux.pdf']);
  assert.deepEqual(m.telecharges, ['jeton-carton']);                           // le film de 48 Mo n'est jamais téléchargé
  const apres = m.envois[0].apres.join('\n');
  assert.match(apres, /La pièce « film-voeux-2027\.mp4 » n’a pas été reprise : trop lourde/);
  assert.match(apres, /La pièce « installeur\.exe » n’a pas été reprise : d’un type de fichier/);
  assert.ok(!/vcf/.test(apres));
  // une pièce annoncée légère mais lourde en réalité est écartée après téléchargement
  const m2 = monde();
  const menteur = de({ ...M.afficheFournie(), Attachments: [{ Name: 'gros.pdf', ContentType: 'application/pdf', ContentLength: 1000, DownloadToken: 'jeton-menteur' }] }, s.ref, s.alias);
  const r2 = await passer(menteur, m2);
  assert.deepEqual([r2.issue, m2.stockage.size, (await un(`select count(*)::int as n from piece_jointe where demande_id = $1`, [r2.demande])).n], ['deposee', 0, 0]);
  assert.match(m2.envois[0].apres[0], /« gros\.pdf » n’a pas été reprise : trop lourde/);
  // stockage en panne, envoi en panne : la demande est déposée quand même, la pièce est signalée
  const m3 = monde({ stockageEnPanne: true, envoiEnPanne: true });
  const r3 = await passer(de(M.afficheFournie(), s.ref, s.alias), m3);
  assert.equal(r3.issue, 'deposee');
  const recu = await un(`select pieces, repondu_le from mail_recu where demande_id = $1`, [r3.demande]);
  assert.deepEqual([recu.pieces, recu.repondu_le], [[{ nom: 'affiche-bagad.jpg', motif: 'erreur' }], null]);
});

await test('de bout en bout : contenus hostiles échappés dans la réponse ; mails mal formés sans effet ; panne de base signalée', async () => {
  const s = await scene(), m = monde();
  const item = de({ ...M.afficheFournie(), Subject: '<script>alert(1)</script> "Concert" & bagad', Attachments: [{ Name: '<img src=x>.exe', ContentLength: 10, DownloadToken: 't' }] }, s.ref, s.alias);
  const r = await passer(item, m);
  assert.equal(r.issue, 'deposee');
  assert.equal(m.envois[0].sujet, 'Bien reçu : <script>alert(1)</script> "Concert" & bagad');          // objet du mail : texte brut
  const html = [m.envois[0].titre, ...m.envois[0].texte, ...m.envois[0].apres].join('\n');
  assert.ok(!/<script|<img/.test(html) && html.includes('&lt;script&gt;alert(1)&lt;/script&gt; &quot;Concert&quot; &amp; bagad') && html.includes('&lt;img src=x&gt;.exe'));
  for (const x of M.malFormes().slice(0, 6)) assert.deepEqual(await passer(x, m), { issue: 'illisible' });
  assert.equal(m.envois.length, 1);
  // panne de la base : l'erreur remonte pour que Brevo représente le message, rien n'est écrit à moitié
  const p = monde({ panne: 'mail_deposer' });
  const it = de(M.afficheFournie(), s.ref, s.alias);
  let panne = null;
  try { await T.traiter(it, p.d); } catch (e) { panne = e; }
  assert.ok(panne && T.estPanne(panne));
  assert.deepEqual(await un(`select issue from mail_recu where message_id = $1`, [it.MessageId]), { issue: 'recu' });
  assert.equal(p.envois.length, 0);
  // Brevo représente aussitôt : encore une panne (le message est « en cours ») ; plus tard, il aboutit
  let encore = null;
  try { await T.traiter(it, m.d); } catch (e) { encore = e; }
  assert.ok(encore && T.estPanne(encore));
  await db.query(`update mail_recu set recu = now() - interval '3 minutes' where message_id = $1`, [it.MessageId]);
  assert.equal((await passer(it, m)).issue, 'deposee');
  // une donnée que la base refuse n'est pas une panne : le mail est classé, le client prévenu
  const refusDonnee = monde();
  refusDonnee.d.rpc = async (nom, args) => (nom === 'mail_deposer' ? { data: null, error: { code: '23514', message: 'demande_titre_check' } } : rpc(nom, args));
  const rd = await passer(de(M.afficheFournie(), s.ref, s.alias), refusDonnee);
  assert.deepEqual([rd.issue, rd.motif, refusDonnee.envois[0].texte[0]], ['a_completer', 'depot_impossible', 'Votre mail est bien arrivé, mais la demande n’a pas pu être enregistrée automatiquement. Rien n’est engagé.']);
  assert.equal(T.estPanne(new Error('autre')), false);
});

// ---------------------------------------------------------------------------------------------------
// 4. La fonction serveur assemblée : contrôle d'accès, corps mal formés, webhook chez Brevo
// ---------------------------------------------------------------------------------------------------
const CLE_WEBHOOK = 'cle-de-test-reception-0123456789abcdef';
const CLE_SERVICE = 'cle-de-service-de-test-0123456789abcdef';
const env = { SUPABASE_URL: 'https://projet.supabase.test', CLE_SECRETE: CLE_SERVICE, RECEPTION_CLE: CLE_WEBHOOK, BREVO_API_KEY: 'xkeysib-test', SITE_URL: 'https://fill.studioes.fr/espace' };
let service = null;
const appels = [];
let brevo = { webhooks: [], refusEntetes: false };
globalThis.Deno = { env: { get: (k) => env[k] }, serve: (f) => { service = f; } };
globalThis.__client = () => ({
  rpc: (nom, args) => (nom === 'verifier_jeton_pilote' ? Promise.resolve({ data: args.p === 'jeton-pilote-0123456789abcdef0123456789', error: null }) : rpc(nom, args)),
  from: (table) => ({ select: () => ({ eq: (_, id) => ({ single: async () => ({ data: await un(`select unites from ${table} where id = $1`, [id]) }) }) }) }),
  storage: { from: () => ({ upload: async (chemin) => { appels.push({ stockage: chemin }); return { error: null }; }, remove: async () => ({ error: null }) }) },
});
globalThis.fetch = async (url, init = {}) => {
  const u = String(url), corps = init.body ? JSON.parse(init.body) : null;
  appels.push({ url: u, methode: init.method ?? 'GET', corps, cle: init.headers?.['api-key'] ?? null });
  const rep = (c, status = 200) => new Response(typeof c === 'string' ? c : JSON.stringify(c), { status });
  if (u.endsWith('/webhooks?type=inbound')) return rep({ webhooks: brevo.webhooks });
  if (u.endsWith('/webhooks') && init.method === 'POST') { brevo.webhooks.push({ id: 77, type: 'inbound', ...corps }); return rep({ id: 77 }, 201); }
  if (/\/webhooks\/\d+$/.test(u) && init.method === 'PUT') { Object.assign(brevo.webhooks[0], corps); return new Response(null, { status: 204 }); }
  if (u.includes('dns.google')) return rep({ Answer: [{ data: '10 inbound1.sendinblue.com.' }, { data: '20 inbound2.sendinblue.com.' }] });
  if (u.includes('/inbound/attachments/')) return new Response(new Uint8Array(2048), { status: 200 });
  if (u.endsWith('/smtp/email')) return corps.headers && brevo.refusEntetes ? rep({ code: 'invalid_parameter' }, 400) : rep({ messageId: '<x@brevo>' }, 201);
  if (u.includes('/functions/v1/notifier')) return rep('ok');
  return rep('inconnu', 404);
};
await assembler(['reception', 'index.ts'], 'index.mjs', [{
  name: 'client-supabase-de-test',
  setup(b) {
    b.onResolve({ filter: /^npm:@supabase\/supabase-js/ }, () => ({ path: 'client', namespace: 'test' }));
    b.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const createClient = (...a) => globalThis.__client(...a);', loader: 'js' }));
  },
}]);
const appel = async (c = {}) => {
  const r = await service(new Request(`https://projet.supabase.test/functions/v1/reception${c.requete ?? ''}`, { method: c.methode ?? 'POST', headers: c.entetes ?? {}, body: c.methode === 'GET' ? undefined : (typeof c.corps === 'string' ? c.corps : JSON.stringify(c.corps ?? {})) }));
  return { statut: r.status, json: await r.json().catch(() => null) };
};

await test('fonction : sans la clé du webhook, rien ne passe ; la clé se présente dans l’adresse ou en en-tête', async () => {
  const s = await scene();
  const items = { items: [de(M.afficheFournie(), s.ref, s.alias)] };
  assert.equal((await appel({ methode: 'GET' })).statut, 405);
  assert.equal((await appel({ corps: items })).statut, 401);
  assert.equal((await appel({ corps: items, requete: '?cle=mauvaise' })).statut, 401);
  assert.equal((await appel({ corps: items, requete: `?cle=${CLE_WEBHOOK}x` })).statut, 401);
  assert.equal((await appel({ corps: items, entetes: { Authorization: `Bearer ${CLE_SERVICE}` } })).statut, 401);     // la clé secrète n'ouvre pas le webhook
  assert.equal((await un(`select count(*)::int as n from mail_recu where organisation_id = $1`, [s.o])).n, 0);
  const r = await appel({ corps: items, requete: `?cle=${CLE_WEBHOOK}` });
  assert.deepEqual([r.statut, r.json], [200, { ok: true, mails: [{ issue: 'deposee', motif: null }] }]);
  const par = { items: [de(M.afficheFournie(), s.ref, s.alias)] };
  assert.equal((await appel({ corps: par, entetes: { 'x-reception-cle': CLE_WEBHOOK } })).json.mails[0].issue, 'deposee');
  assert.equal((await appel({ corps: { items: [de(M.afficheFournie(), s.ref, s.alias)] }, entetes: { Authorization: `Bearer ${CLE_WEBHOOK}` } })).json.mails[0].issue, 'deposee');
  // sans secret configuré, la réception reste fermée
  const garde = env.RECEPTION_CLE; env.RECEPTION_CLE = 'court';
  assert.equal((await appel({ corps: items, requete: '?cle=court' })).statut, 503);
  env.RECEPTION_CLE = garde;
});

await test('fonction : pièce téléchargée chez Brevo avec la clé API, réponse rangée dans le fil, repli si les en-têtes sont refusés', async () => {
  const s = await scene();
  appels.length = 0; brevo.refusEntetes = true;
  const item = de(M.afficheFournie(), s.ref, s.alias);
  const r = await appel({ corps: { items: [item] }, requete: `?cle=${CLE_WEBHOOK}` });
  assert.equal(r.json.mails[0].issue, 'deposee');
  const pj = appels.find((a) => a.url?.includes('/inbound/attachments/'));
  assert.deepEqual([pj.url, pj.cle], ['https://api.brevo.com/v3/inbound/attachments/jeton-affiche', 'xkeysib-test']);
  assert.ok(appels.some((a) => a.stockage?.startsWith(`${s.o}/`) && a.stockage.endsWith('-affiche-bagad.jpg')));
  assert.ok(appels.some((a) => a.url?.endsWith('/functions/v1/notifier') && a.corps.evenement === 'depot'));
  const envois = appels.filter((a) => a.url?.endsWith('/smtp/email'));
  assert.equal(envois.length, 2);                                               // refusé avec en-têtes, reparti sans
  assert.deepEqual(envois[0].corps.headers, { 'Auto-Submitted': 'auto-replied', 'X-Auto-Response-Suppress': 'All', 'In-Reply-To': item.MessageId, References: item.MessageId });
  assert.equal(envois[1].corps.headers, undefined);
  assert.deepEqual([envois[1].corps.to[0].email, envois[1].corps.sender.email, envois[1].corps.replyTo.email, envois[1].corps.subject], [s.ref.email, 'contact@studioes.fr', 'contact@studioes.fr', 'Bien reçu : Concert du bagad']);
  assert.match(envois[1].corps.htmlContent, /Votre demande est enregistrée/);
  assert.ok(!/\bIA\b|Brevo|Claude|Anthropic/.test(envois[1].corps.htmlContent.replace(/<[^>]+>/g, ' ')));
  brevo.refusEntetes = false;
});

await test('fonction : corps illisible, vide ou mal formé, toujours une réponse propre', async () => {
  const q = `?cle=${CLE_WEBHOOK}`;
  for (const corps of ['', 'pas du json', '[]', '{"items":"x"}', '{"items":[]}', 'null', '42']) {
    const r = await appel({ corps, requete: q });
    assert.deepEqual([r.statut, r.json], [200, { ok: true, mails: [] }], corps);
  }
  const r = await appel({ corps: { items: M.malFormes() }, requete: q });
  assert.equal(r.statut, 200);
  assert.deepEqual(r.json.mails.map((m) => m.issue), ['illisible', 'illisible', 'illisible', 'illisible', 'illisible', 'illisible', 'refuse', 'ignore']);
  // au plus vingt-cinq mails par appel
  const s = await scene();
  const lot = await appel({ corps: { items: Array.from({ length: 30 }, () => de(M.sansObjet(), s.ref, s.alias)) }, requete: q });
  assert.equal(lot.json.mails.length, 25);
});

await test('fonction : action « webhook » réservée au serveur ; vérifie, crée une seule fois, ne remplace que sur demande', async () => {
  const admin = (corps, jeton = CLE_SERVICE) => appel({ corps, entetes: { Authorization: `Bearer ${jeton}` } });
  assert.equal((await appel({ corps: { action: 'webhook' } })).statut, 401);
  assert.equal((await appel({ corps: { action: 'webhook' }, requete: `?cle=${CLE_WEBHOOK}` })).statut, 401);       // la clé du webhook n'administre rien
  assert.equal((await admin({ action: 'webhook' }, 'x'.repeat(40))).statut, 401);
  assert.equal((await admin({ action: 'autre' })).statut, 400);
  appels.length = 0;
  const etat = await admin({ action: 'webhook' }, 'jeton-pilote-0123456789abcdef0123456789');
  assert.deepEqual([etat.statut, etat.json.conforme, etat.json.fait, etat.json.domaine, etat.json.mx_ok], [200, false, 'rien', 'demandes.studioes.fr', true]);
  assert.match(etat.json.conseil, /creer:true/);
  assert.ok(!appels.some((a) => a.methode === 'POST' && a.url.endsWith('/webhooks')));                             // vérifier ne crée rien
  const cree = await admin({ action: 'webhook', creer: true });
  assert.deepEqual([cree.json.fait, cree.json.conforme, cree.json.webhook.id], ['cree', true, 77]);
  const envoye = appels.find((a) => a.methode === 'POST' && a.url === 'https://api.brevo.com/v3/webhooks');
  assert.deepEqual(envoye.corps, { type: 'inbound', events: ['inboundEmailProcessed'], url: `https://projet.supabase.test/functions/v1/reception?cle=${CLE_WEBHOOK}`, domain: 'demandes.studioes.fr', description: 'Fill : adresses de transfert' });
  assert.equal(envoye.cle, 'xkeysib-test');
  assert.ok(!JSON.stringify(cree.json).includes(CLE_WEBHOOK));                                                      // le secret ne ressort jamais
  const encore = await admin({ action: 'webhook', creer: true });
  assert.deepEqual([encore.json.fait, encore.json.conforme, brevo.webhooks.length], ['rien', true, 1]);
  // le secret change : l'ancien webhook est signalé, corrigé seulement avec remplacer:true
  env.RECEPTION_CLE = `${CLE_WEBHOOK}-nouvelle`;
  const ecart = await admin({ action: 'webhook', creer: true });
  assert.deepEqual([ecart.json.conforme, ecart.json.fait, ecart.json.autres.length], [false, 'rien', 1]);
  const corrige = await admin({ action: 'webhook', creer: true, remplacer: true });
  assert.deepEqual([corrige.json.conforme, corrige.json.fait, brevo.webhooks[0].url.endsWith('-nouvelle')], [true, 'remplace', true]);
  env.RECEPTION_CLE = CLE_WEBHOOK;
  delete env.BREVO_API_KEY;
  assert.equal((await admin({ action: 'webhook' })).statut, 503);
  env.BREVO_API_KEY = 'xkeysib-test';
});

console.log(`\n${passes} tests passés${process.exitCode ? ', des échecs ci-dessus' : ''}`);
