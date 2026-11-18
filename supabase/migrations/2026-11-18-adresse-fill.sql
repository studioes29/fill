-- Réception sur fill@studioes.fr (relevé IMAP OVH) au lieu des alias @demandes.studioes.fr (Brevo)
create or replace function public.mail_ouvrir(
  p_message_id    text,
  p_expediteur    text,
  p_destinataires text[],
  p_sujet         text default null,
  p_ecarter       text default null
) returns jsonb
language plpgsql security definer set search_path to 'public'
as $function$
declare
  exp text := lower(trim(coalesce(p_expediteur, '')));
  ident text := left(trim(coalesce(p_message_id, '')), 400);
  locales text[];
  m mail_recu; p profil; o organisation; vise organisation;
  cas text; rep boolean := false; alias_inconnu boolean := false; nouveau uuid;
  generale boolean := false;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if exp !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' or length(exp) > 254 then raise exception 'Expéditeur illisible'; end if;
  if ident = '' then raise exception 'Message sans identifiant'; end if;
  -- les mails d'un même expéditeur passent un par un : les plafonds de réponse tiennent aussi en rafale
  perform pg_advisory_xact_lock(hashtext('mail_recu:' || exp));

  -- un traitement interrompu (mail resté « recu », donc sans aucune suite écrite) reprend quand le relevé IMAP représente le message
  delete from mail_recu where message_id = ident and issue = 'recu' and recu < now() - interval '2 minutes';
  select * into m from mail_recu where message_id = ident;
  if m.id is not null then
    return jsonb_build_object('cas', case when m.issue = 'recu' then 'en_cours' else 'doublon' end, 'mail', m.id, 'issue', m.issue, 'repondre', false);
  end if;

  select coalesce(array_agg(lower(split_part(trim(d), '@', 1))), '{}') into locales from unnest(coalesce(p_destinataires, '{}')) d;
  -- fill@studioes.fr : adresse unique de dépôt, la structure est celle de l'expéditeur
  generale := 'fill' = any (locales);
  select * into p from profil where lower(email) = exp order by actif desc, creee limit 1;
  select x.* into vise from organisation x where x.alias_mail = any (locales) and x.alias_mail <> 'fill'
   order by (x.id = p.organisation_id) desc nulls last, array_position(locales, x.alias_mail) limit 1;

  if p_ecarter is not null then
    cas := 'ecarte';
  elsif (select count(*) from mail_recu where expediteur = exp and recu > now() - interval '1 hour') >= 20
     or (select count(*) from mail_recu where expediteur = exp and recu > now() - interval '24 hours') >= 60 then
    cas := 'trop';
  elsif p.id is null or not p.actif then
    cas := 'inconnu';
  elsif p.role in ('admin', 'producteur') then
    cas := 'equipe';
  else
    select * into o from organisation where id = p.organisation_id;
    if vise.id is null then alias_inconnu := not generale;        -- adresse mal recopiée : la structure est celle de l'expéditeur
    elsif vise.id <> o.id then cas := 'autre_structure'; end if;
    if cas is null then
      cas := case when p.role = 'lecteur' then 'lecteur' when o.statut = 'resiliee' then 'resiliee' else 'ok' end;
    end if;
  end if;

  rep := case
    when cas = 'ok' then true
    when cas in ('lecteur', 'autre_structure', 'resiliee') then
      (select count(*) from mail_recu where expediteur = exp and repondu_le > now() - interval '24 hours') < 3
    when cas = 'inconnu' and (vise.id is not null or generale) then
      not exists (select 1 from mail_recu where expediteur = exp and repondu_le > now() - interval '24 hours')
      and (select count(*) from mail_recu where issue = 'refuse' and motif = 'inconnu' and repondu_le > now() - interval '24 hours') < 30
    else false end;

  begin
    insert into mail_recu (message_id, expediteur, destinataire, organisation_id, profil_id, sujet, issue, motif, repondu_le)
    values (ident, exp, left(nullif(coalesce(vise.alias_mail, locales[1]), ''), 254),
            case when cas in ('ok', 'lecteur', 'resiliee', 'autre_structure') then o.id else vise.id end,
            case when cas in ('ok', 'lecteur', 'resiliee', 'autre_structure') then p.id end,
            left(nullif(trim(coalesce(p_sujet, '')), ''), 300),
            case when cas = 'ok' then 'recu' when cas in ('ecarte', 'trop', 'equipe') then 'ignore' else 'refuse' end,
            case when cas = 'ok' then null when cas = 'ecarte' then left(p_ecarter, 60) else cas end,
            case when rep and cas <> 'ok' then now() end)
    returning id into nouveau;
  exception when unique_violation then
    return jsonb_build_object('cas', 'en_cours', 'repondre', false);
  end;

  return jsonb_build_object(
    'cas', cas, 'mail', nouveau, 'repondre', rep, 'alias_inconnu', alias_inconnu,
    'profil', case when cas in ('ok', 'lecteur', 'resiliee', 'autre_structure')
      then jsonb_build_object('id', p.id, 'nom', p.nom, 'email', p.email, 'role', p.role) end,
    'organisation', case when cas in ('ok', 'lecteur', 'resiliee', 'autre_structure')
      then jsonb_build_object('id', o.id, 'nom', o.nom, 'alias', o.alias_mail, 'statut', o.statut, 'essai', o.essai, 'type', o.type) end);
end $function$;
