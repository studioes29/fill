-- 9 nov 2026 : une désinscription n'est retenue que si elle est confirmée.
-- Les filtres de sécurité des messageries ouvrent tous les liens d'un mail : les anciens liens « stop »
-- (fonction parcours, ?a=stop) inscrivaient l'adresse dès l'ouverture et ont désinscrit des prospects à leur place.
-- Désormais toute inscription dans mail_stop qui ne vient pas de sequence_desinscrire() part en attente :
--   - le bouton « Confirmer » de https://studioes.fr/desinscription/ (fonction desinscription, POST) confirme tout de suite ;
--   - le « Contrôle quotidien de la machine » tranche les attentes (robot ou vraie demande) ;
--   - une attente que personne n'a traitée est confirmée d'office au bout de 48 heures.
-- Déjà appliquée sur le projet nfnbseonwgmtouxsaajd (migration « mail_stop_confirmation »).

create table if not exists public.mail_stop_attente (
  email text primary key,
  vu_le timestamptz not null default now(),
  clics integer not null default 1,
  traite_le timestamptz,
  decision text
);
alter table public.mail_stop_attente enable row level security;
revoke all on public.mail_stop_attente from anon, authenticated;

create or replace function public.mail_stop_filtrer()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare e text := lower(trim(new.email)); deja boolean;
begin
  if current_setting('app.stop_confirme', true) = '1' then return new; end if;
  select exists (select 1 from mail_stop_attente where email = e and traite_le is null) into deja;
  insert into mail_stop_attente (email) values (e)
    on conflict (email) do update set clics = mail_stop_attente.clics + 1,
      vu_le = case when mail_stop_attente.traite_le is null then mail_stop_attente.vu_le else now() end,
      traite_le = null, decision = null;
  if not deja then
    update sequence_message m set prevu = greatest(m.prevu, now()) + interval '3 days'
     where m.statut = 'prevu' and m.prevu < now() + interval '3 days'
       and m.sequence_id in (select id from sequence where lower(email) = e and statut = 'active');
  end if;
  return null;
end $function$;

create or replace function public.sequence_desinscrire(p_email text)
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  perform set_config('app.stop_confirme', '1', true);
  insert into mail_stop (email) values (lower(trim(p_email))) on conflict do nothing;
  perform set_config('app.stop_confirme', '', true);
  update mail_stop_attente set traite_le = now(), decision = 'confirme' where email = lower(trim(p_email)) and traite_le is null;
  return public.sequence_arreter(p_email, 'desinscrit', 'a demandé à ne plus recevoir de message');
end $function$;

create or replace function public.stop_ecarter(p_email text)
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare n int;
begin
  update mail_stop_attente set traite_le = now(), decision = 'robot' where email = lower(trim(p_email)) and traite_le is null;
  get diagnostics n = row_count;
  return n;
end $function$;

create or replace function public.stop_confirmer_anciens()
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare r record; n int := 0;
begin
  for r in select email from mail_stop_attente where traite_le is null and vu_le < now() - interval '48 hours' loop
    perform public.sequence_desinscrire(r.email); n := n + 1;
  end loop;
  return n;
end $function$;

revoke all on function public.mail_stop_filtrer(), public.sequence_desinscrire(text), public.stop_ecarter(text), public.stop_confirmer_anciens() from public, anon, authenticated;
grant execute on function public.sequence_desinscrire(text), public.stop_ecarter(text), public.stop_confirmer_anciens() to service_role;

drop trigger if exists mail_stop_filtre on public.mail_stop;
create trigger mail_stop_filtre before insert on public.mail_stop for each row execute function public.mail_stop_filtrer();

select cron.schedule('stop-confirmer-anciens', '25 * * * *', 'select public.stop_confirmer_anciens()');
