-- Préférences de mail par personne : couper les mails d'étape (demande reçue, confirmée, publiée ou livrée, annulée).
-- Les mails qui attendent un geste (version à relire, élément attendu, accord, message de Fill) partent toujours.
alter table public.profil add column if not exists mails_etapes boolean not null default true;
comment on column public.profil.mails_etapes is
  'Vrai (défaut) : la personne reçoit un mail à chaque étape de ses demandes. Faux : seulement les mails qui attendent un geste.';

-- La personne connectée règle sa propre préférence, et rien d'autre.
create or replace function public.regler_mails_etapes(p_actif boolean) returns boolean
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  update profil set mails_etapes = coalesce(p_actif, true) where id = auth.uid();
  return found;
end $function$;

revoke all on function public.regler_mails_etapes(boolean) from public, anon;
grant execute on function public.regler_mails_etapes(boolean) to authenticated;
