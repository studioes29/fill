-- Relecture par lien : relire et valider un livrable sans compte.
--
-- Trois usages :
--   referent    le lien que reçoit le référent dans le mail « À relire » : sa réponse vaut décision ;
--   avis        une personne consultée par le référent : sa réponse revient dans la fiche, le référent décide ;
--   delegation  une personne à qui le référent confie la validation : sa réponse vaut décision, une seule à la fois.
--
-- Le jeton n'est jamais enregistré : la base ne garde que son empreinte (SHA-256).
-- Toutes les écritures passent par les trois fonctions ci-dessous, réservées au serveur (fonction « relecture »).
-- Une seule table existante est touchée : la contrainte sur historique.type accepte en plus « lien ».

create table if not exists public.lien_relecture (
  id              uuid primary key default gen_random_uuid(),
  demande_id      uuid not null references public.demande(id) on delete cascade,
  organisation_id uuid not null references public.organisation(id) on delete cascade,
  version_id      uuid not null references public.version_livrable(id) on delete cascade,
  usage           text not null check (usage in ('referent', 'avis', 'delegation')),
  nom             text not null check (length(trim(nom)) between 2 and 120),
  fonction        text check (fonction is null or length(fonction) <= 120),
  email           text not null check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  cree_par        uuid references public.profil(id) on delete set null,
  parent_id       uuid references public.lien_relecture(id) on delete set null,
  empreinte       text not null unique check (empreinte ~ '^[0-9a-f]{64}$'),
  expire          timestamptz not null,
  reponse         text check (reponse in ('accord', 'correction')),
  remarque        text check (remarque is null or length(remarque) <= 4000),
  repondu_le      timestamptz,
  revoque_le      timestamptz,
  cree            timestamptz not null default now()
);

comment on table public.lien_relecture is
  'Liens de relecture sans compte (référent, avis, délégation). Empreinte du jeton seulement ; écritures par relecture_creer et relecture_repondre.';

create index if not exists lien_relecture_demande on public.lien_relecture (demande_id);

-- une seule délégation ouverte par demande (l''expiration est traitée dans relecture_creer)
create unique index if not exists lien_relecture_une_delegation
  on public.lien_relecture (demande_id)
  where usage = 'delegation' and reponse is null and revoque_le is null;

alter table public.lien_relecture enable row level security;

-- une décision prise depuis un lien s''inscrit dans l''historique avec le type « lien »
alter table public.historique drop constraint if exists historique_type_check;
alter table public.historique add constraint historique_type_check
  check (type = any (array['statut'::text, 'modification'::text, 'relance'::text, 'pilote'::text, 'lien'::text]));

-- lecture : l''équipe Fill et les comptes de l''organisation ; jamais l''empreinte
revoke all on public.lien_relecture from anon, authenticated;
grant select (id, demande_id, organisation_id, version_id, usage, nom, fonction, email, cree_par, parent_id,
              expire, reponse, remarque, repondu_le, revoque_le, cree)
  on public.lien_relecture to authenticated;

drop policy if exists lien_relecture_lecture on public.lien_relecture;
create policy lien_relecture_lecture on public.lien_relecture
  for select to authenticated
  using (public.est_equipe() or organisation_id = public.mon_organisation());

-- Crée un lien pour la dernière version d''une demande à valider. Réservé au serveur.
create or replace function public.relecture_creer(
  p_demande   uuid,
  p_usage     text,
  p_nom       text,
  p_fonction  text,
  p_email     text,
  p_empreinte text,
  p_par       uuid default null,
  p_parent    uuid default null,
  p_jours     integer default 7
) returns uuid
language plpgsql security definer set search_path to 'public'
as $function$
declare d demande; v version_livrable; nouveau uuid;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if p_usage not in ('referent', 'avis', 'delegation') then raise exception 'Usage inconnu'; end if;
  select * into d from demande where id = p_demande for update;
  if d.id is null or d.statut <> 'a_valider' then raise exception 'Cette demande n''attend pas de validation'; end if;
  select * into v from version_livrable where demande_id = d.id order by numero desc limit 1;
  if v.id is null then raise exception 'Aucune version à relire'; end if;

  -- une délégation expirée ou portant sur une version dépassée ne bloque pas la suivante
  update lien_relecture set revoque_le = now()
   where demande_id = d.id and usage = 'delegation' and reponse is null and revoque_le is null
     and (expire <= now() or version_id <> v.id);
  if p_usage = 'delegation' and exists (
       select 1 from lien_relecture
        where demande_id = d.id and usage = 'delegation' and reponse is null and revoque_le is null) then
    raise exception 'La validation de cette demande est déjà confiée à quelqu''un';
  end if;

  insert into lien_relecture (demande_id, organisation_id, version_id, usage, nom, fonction, email, cree_par, parent_id, empreinte, expire)
  values (d.id, d.organisation_id, v.id, p_usage, trim(p_nom), nullif(trim(coalesce(p_fonction, '')), ''), lower(trim(p_email)),
          p_par, p_parent, p_empreinte, now() + make_interval(days => greatest(1, least(coalesce(p_jours, 7), 30))))
  returning id into nouveau;

  -- l'invitation s'inscrit dans les échanges de la demande ; l'historique ne garde que les changements de statut
  -- (une ligne de plus au statut « à valider » relancerait le délai de rappel du pilote)
  if p_usage <> 'referent' then
    insert into message (demande_id, organisation_id, auteur_id, texte, systeme)
    values (d.id, d.organisation_id, null,
            coalesce((select nom from profil where id = p_par), 'Le référent')
              || case p_usage when 'avis' then ' demande l''avis de ' else ' confie la validation à ' end
              || trim(p_nom) || coalesce(' (' || nullif(trim(coalesce(p_fonction, '')), '') || ')', '') || '.',
            true);
  end if;
  return nouveau;
end $function$;

-- Ce que la page de relecture affiche pour un jeton. Réservé au serveur.
create or replace function public.relecture_lire(p_empreinte text) returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $function$
declare l lien_relecture; d demande; v version_livrable; derniere uuid;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  select * into l from lien_relecture where empreinte = p_empreinte;
  if l.id is null then return jsonb_build_object('etat', 'inconnu'); end if;
  select * into d from demande where id = l.demande_id;
  select * into v from version_livrable where id = l.version_id;
  select id into derniere from version_livrable where demande_id = d.id order by numero desc limit 1;
  return jsonb_build_object(
    'etat', case
      when l.revoque_le is not null then 'revoque'
      when l.repondu_le is not null then 'repondu'
      when l.expire <= now() then 'expire'
      when d.statut <> 'a_valider' or derniere is distinct from l.version_id then 'depasse'
      else 'ouvert' end,
    'lien', l.id,
    'version_id', l.version_id,
    'usage', l.usage,
    'nom', l.nom,
    'reponse', l.reponse,
    'expire', l.expire,
    'demandeur', (select nom from profil where id = l.cree_par),
    'organisation', (select nom from organisation where id = d.organisation_id),
    'type_organisation', (select type from organisation where id = d.organisation_id),
    'demande', jsonb_build_object('id', d.id, 'titre', d.titre, 'parution', d.parution, 'heure', d.heure,
                                  'corrections_restantes', greatest(0, 2 - d.corrections)),
    'version', jsonb_build_object('numero', v.numero, 'note', v.note, 'fichiers', coalesce(v.fichiers, '[]'::jsonb), 'date', v.creee),
    'delegation_ouverte', exists (
      select 1 from lien_relecture x
       where x.demande_id = d.id and x.usage = 'delegation' and x.reponse is null and x.revoque_le is null and x.expire > now()));
end $function$;

-- Enregistre la réponse donnée depuis un lien. Pour un référent ou une délégation, elle vaut décision :
-- la demande passe en « validée » ou en « correction », avec les mêmes règles que dans l''Espace. Réservé au serveur.
create or replace function public.relecture_repondre(p_empreinte text, p_reponse text, p_remarque text default null)
returns jsonb
language plpgsql security definer set search_path to 'public'
as $function$
declare l lien_relecture; d demande; derniere uuid; ref uuid; vers text; qui text; rem text := nullif(trim(coalesce(p_remarque, '')), '');
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if p_reponse not in ('accord', 'correction') then raise exception 'Réponse inconnue'; end if;
  select * into l from lien_relecture where empreinte = p_empreinte for update;
  if l.id is null then raise exception 'Lien inconnu'; end if;
  if l.revoque_le is not null then raise exception 'Ce lien a été retiré'; end if;
  if l.repondu_le is not null then raise exception 'Une réponse a déjà été donnée avec ce lien'; end if;
  if l.expire <= now() then raise exception 'Ce lien a expiré'; end if;
  if p_reponse = 'correction' and (rem is null or length(rem) < 3) then raise exception 'Indiquez ce qui est à corriger'; end if;
  if rem is not null and length(rem) > 4000 then raise exception 'Remarque trop longue'; end if;

  select * into d from demande where id = l.demande_id for update;
  select id into derniere from version_livrable where demande_id = d.id order by numero desc limit 1;
  if d.statut <> 'a_valider' or derniere is distinct from l.version_id then
    raise exception 'Cette version n''attend plus de réponse';
  end if;

  qui := l.nom || coalesce(' (' || l.fonction || ')', '');
  update lien_relecture set reponse = p_reponse, remarque = rem, repondu_le = now() where id = l.id;

  -- un avis ne change rien à la demande : il s''ajoute aux échanges et le référent décide
  if l.usage = 'avis' then
    insert into message (demande_id, organisation_id, auteur_id, texte, systeme)
    values (d.id, d.organisation_id, null,
            'Avis de ' || qui || ' : ' || case p_reponse when 'accord' then 'd''accord' else 'à corriger' end
              || coalesce('. « ' || rem || ' »', '.'), true);
    return jsonb_build_object('usage', l.usage, 'decision', false, 'demande', d.id, 'statut', d.statut, 'par', l.cree_par);
  end if;

  -- décision : la trace porte le référent (le sien, ou celui qui a délégué)
  ref := coalesce(l.cree_par, (select id from profil where organisation_id = d.organisation_id and role = 'referent' and actif order by creee limit 1));
  if p_reponse = 'correction' then
    if d.corrections >= 2 then
      raise exception 'Les deux allers-retours inclus sont utilisés : un troisième se chiffre avant d''être lancé';
    end if;
    update demande set corrections = corrections + 1 where id = d.id;
    if l.usage = 'referent' then
      insert into message (demande_id, organisation_id, auteur_id, texte) values (d.id, d.organisation_id, ref, rem);
    else
      insert into message (demande_id, organisation_id, auteur_id, texte, systeme)
      values (d.id, d.organisation_id, null, 'Corrections demandées par ' || qui || ', par délégation : « ' || rem || ' »', true);
    end if;
    vers := 'correction';
  else
    vers := 'validee';
  end if;

  update demande set statut = vers, maj = now() where id = d.id;
  insert into historique (demande_id, organisation_id, statut, type, detail, par)
  values (d.id, d.organisation_id, vers, 'lien',
          case when l.usage = 'referent'
               then case vers when 'validee' then 'Validée par lien, sans connexion' else 'Corrections demandées par lien, sans connexion' end
               else case vers when 'validee' then 'Validée par ' else 'Corrections demandées par ' end || qui || ', par délégation' end,
          ref);
  perform journaliser(d.organisation_id, 'statut', d.id::text,
                      jsonb_build_object('de', d.statut, 'vers', vers, 'lien', l.id, 'usage', l.usage));
  return jsonb_build_object('usage', l.usage, 'decision', true, 'demande', d.id, 'statut', vers, 'par', ref);
end $function$;

-- Retire un lien encore ouvert (le référent, depuis sa page de relecture ou l''Espace). Réservé au serveur.
create or replace function public.relecture_retirer(p_lien uuid) returns void
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  update lien_relecture set revoque_le = now() where id = p_lien and reponse is null and revoque_le is null;
end $function$;

revoke all on function public.relecture_creer(uuid, text, text, text, text, text, uuid, uuid, integer) from public, anon, authenticated;
revoke all on function public.relecture_lire(text) from public, anon, authenticated;
revoke all on function public.relecture_repondre(text, text, text) from public, anon, authenticated;
revoke all on function public.relecture_retirer(uuid) from public, anon, authenticated;
grant execute on function public.relecture_creer(uuid, text, text, text, text, text, uuid, uuid, integer) to service_role;
grant execute on function public.relecture_lire(text) to service_role;
grant execute on function public.relecture_repondre(text, text, text) to service_role;
grant execute on function public.relecture_retirer(uuid) to service_role;
