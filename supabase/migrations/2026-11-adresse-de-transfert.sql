-- Adresse de transfert : déposer une demande en écrivant ou en transférant un mail.
--
-- Chaque organisation reçoit une adresse propre (organisation.alias_mail, partie avant le « @ » ; le domaine,
-- demandes.studioes.fr, est un réglage des fonctions serveur). Un mail envoyé à cette adresse par un membre
-- connu (profil actif, référent ou contributeur, reconnu à son adresse d'expéditeur) devient une demande
-- déposée, avec les règles de deposer_demande : unités calculées par la base, place vérifiée sur le compte,
-- puis confirmation habituelle (plafond du contributeur et accord du référent se jouent dans confirmer_demande).
--
-- Rien n'est déposé à l'aveugle : un dépôt par mail ne porte que des prestations courantes à une unité,
-- en un exemplaire (contrôle refait ici, quelle que soit l'analyse faite par le serveur). Tout le reste
-- attend dans mail_recu, et le client termine depuis un lien vers la nouvelle demande pré-remplie.
--
-- Tables existantes touchées : organisation (une colonne, un déclencheur). Aucune contrainte existante modifiée.
-- Écritures réservées au serveur (fonction « reception »), sauf mail_rattacher, appelée par l'Espace.

-- 1. L'adresse de chaque organisation ---------------------------------------------------------------

alter table public.organisation add column if not exists alias_mail text;

comment on column public.organisation.alias_mail is
  'Partie locale de l''adresse de transfert (avant le @). Unique, générée depuis le nom, stable ensuite.';

-- nom de structure rendu lisible dans une adresse : minuscules, sans accents, mots séparés par un tiret
create or replace function public.alias_mail_base(p_nom text) returns text
language sql immutable set search_path to 'public'
as $function$
  select trim(both '-' from left(trim(both '-' from regexp_replace(
    translate(replace(replace(lower(coalesce(p_nom, '')), 'œ', 'oe'), 'æ', 'ae'),
              'àâäáãåçéèêëíìîïñóòôöõúùûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy'),
    '[^a-z0-9]+', '-', 'g')), 40))
$function$;

-- première adresse libre pour un nom : « mairie-de-x », puis « mairie-de-x-2 », etc.
create or replace function public.alias_mail_libre(p_nom text, p_sauf uuid default null) returns text
language plpgsql security definer set search_path to 'public'
as $function$
declare base text := alias_mail_base(p_nom); candidat text; n int := 1;   -- « essai » est une colonne d'organisation
begin
  -- adresses de service ou trop courtes : jamais attribuées telles quelles
  if length(base) < 3 or base = any (array['abuse', 'admin', 'bonjour', 'contact', 'demande', 'demandes', 'fill',
       'hello', 'info', 'mailer-daemon', 'no-reply', 'noreply', 'postmaster', 'root', 'support', 'test', 'webmaster']) then
    base := trim(both '-' from 'structure-' || base);
  end if;
  candidat := base;
  while exists (select 1 from organisation o where o.alias_mail = candidat and o.id is distinct from p_sauf) loop
    n := n + 1;
    candidat := trim(both '-' from left(base, 40 - length(n::text) - 1)) || '-' || n;
  end loop;
  return candidat;
end $function$;

-- à la création d'une organisation, l'adresse est générée ; saisie à la main (pilotage), elle est normalisée
create or replace function public._organisation_alias_mail() returns trigger
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if nullif(trim(coalesce(new.alias_mail, '')), '') is null then
    -- deux créations simultanées du même nom ne doivent pas recevoir la même adresse
    perform pg_advisory_xact_lock(hashtext('organisation.alias_mail'));
    new.alias_mail := alias_mail_libre(new.nom, new.id);
  else
    new.alias_mail := lower(trim(new.alias_mail));
  end if;
  return new;
end $function$;

drop trigger if exists organisation_alias_mail on public.organisation;
create trigger organisation_alias_mail
  before insert or update of alias_mail on public.organisation
  for each row execute function public._organisation_alias_mail();

-- organisations existantes : une par une, dans l'ordre de création, pour que deux noms identiques se départagent
do $$
declare o record;
begin
  for o in select id, nom from public.organisation where alias_mail is null order by creee, id loop
    update public.organisation set alias_mail = public.alias_mail_libre(o.nom, o.id) where id = o.id;
  end loop;
end $$;

alter table public.organisation alter column alias_mail set not null;
alter table public.organisation drop constraint if exists organisation_alias_mail_check;
alter table public.organisation add constraint organisation_alias_mail_check
  check (alias_mail ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(alias_mail) between 3 and 48);
create unique index if not exists organisation_alias_mail_key on public.organisation (alias_mail);

-- 2. Les mails reçus ---------------------------------------------------------------------------------

create table if not exists public.mail_recu (
  id              uuid primary key default gen_random_uuid(),
  message_id      text not null unique check (length(message_id) between 1 and 400),
  expediteur      text not null check (length(expediteur) <= 254),
  destinataire    text check (destinataire is null or length(destinataire) <= 254),
  organisation_id uuid references public.organisation(id) on delete cascade,
  profil_id       uuid references public.profil(id) on delete set null,
  sujet           text check (sujet is null or length(sujet) <= 300),
  -- recu : en cours de traitement ; deposee : devenu une demande ; a_completer : attend le client (lien pré-rempli) ;
  -- refuse : expéditeur non reconnu ou lien expiré ; ignore : mail automatique, boucle, trop-plein
  issue           text not null default 'recu' check (issue in ('recu', 'deposee', 'a_completer', 'refuse', 'ignore')),
  motif           text check (motif is null or length(motif) <= 60),
  titre           text check (titre is null or length(titre) <= 140),
  texte           text check (texte is null or length(texte) <= 12000),
  parution        date,
  lignes          jsonb not null default '[]'::jsonb check (jsonb_typeof(lignes) = 'array'),
  pieces          jsonb not null default '[]'::jsonb check (jsonb_typeof(pieces) = 'array'),
  demande_id      uuid references public.demande(id) on delete set null,
  repondu_le      timestamptz,
  recu            timestamptz not null default now()
);

comment on table public.mail_recu is
  'Mails reçus sur les adresses de transfert et ce qu''ils sont devenus. Écritures par les fonctions mail_*.';

create index if not exists mail_recu_expediteur on public.mail_recu (expediteur, recu);
create index if not exists mail_recu_organisation on public.mail_recu (organisation_id, issue);

alter table public.mail_recu enable row level security;

-- lecture : l'équipe Fill ; dans une organisation, l'auteur du mail et le référent, pour les mails devenus
-- ou à devenir une demande
revoke all on public.mail_recu from anon, authenticated;
grant select (id, organisation_id, profil_id, expediteur, sujet, issue, motif, titre, texte, parution, lignes, pieces,
              demande_id, repondu_le, recu)
  on public.mail_recu to authenticated;

drop policy if exists mail_recu_lecture on public.mail_recu;
create policy mail_recu_lecture on public.mail_recu
  for select to authenticated
  using (public.est_equipe() or (organisation_id = public.mon_organisation() and issue in ('a_completer', 'deposee')
         and (profil_id = auth.uid() or public.mon_role() = 'referent')));

-- 3. Réception : qui écrit, pour quelle structure ---------------------------------------------------
--
-- Enregistre le mail (une seule fois par identifiant de message) et dit ce qu'il faut en faire :
--   ok               membre reconnu : l'analyse du contenu décide entre dépôt et lien pré-rempli
--   inconnu          aucun compte actif à cette adresse
--   lecteur          compte en lecture seule
--   autre_structure  l'adresse visée est celle d'une autre structure que la sienne
--   resiliee         structure résiliée
--   equipe           adresse de l'équipe Fill : rien
--   ecarte           mail automatique ou boucle, écarté avant toute analyse (p_ecarter porte le motif)
--   trop             trop de mails de cet expéditeur (20 en une heure, 60 en un jour) : rien
--   doublon          message déjà reçu et traité : rien
--   en_cours         message déjà reçu, traitement pas encore abouti : à représenter plus tard
-- « repondre » dit si une réponse peut partir (jamais deux fois par jour à un inconnu, plafond global). Pour un
-- refus, la réponse est comptée dès maintenant : une rafale de mails ne dépasse pas les plafonds.
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
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if exp !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' or length(exp) > 254 then raise exception 'Expéditeur illisible'; end if;
  if ident = '' then raise exception 'Message sans identifiant'; end if;
  -- les mails d'un même expéditeur passent un par un : les plafonds de réponse tiennent aussi en rafale
  perform pg_advisory_xact_lock(hashtext('mail_recu:' || exp));

  -- un traitement interrompu (mail resté « recu », donc sans aucune suite écrite) reprend quand Brevo représente le message
  delete from mail_recu where message_id = ident and issue = 'recu' and recu < now() - interval '2 minutes';
  select * into m from mail_recu where message_id = ident;
  if m.id is not null then
    return jsonb_build_object('cas', case when m.issue = 'recu' then 'en_cours' else 'doublon' end, 'mail', m.id, 'issue', m.issue, 'repondre', false);
  end if;

  select coalesce(array_agg(lower(split_part(trim(d), '@', 1))), '{}') into locales from unnest(coalesce(p_destinataires, '{}')) d;
  select * into p from profil where lower(email) = exp order by actif desc, creee limit 1;
  select x.* into vise from organisation x where x.alias_mail = any (locales)
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
    if vise.id is null then alias_inconnu := true;        -- adresse mal recopiée : la structure est celle de l'expéditeur
    elsif vise.id <> o.id then cas := 'autre_structure'; end if;
    if cas is null then
      cas := case when p.role = 'lecteur' then 'lecteur' when o.statut = 'resiliee' then 'resiliee' else 'ok' end;
    end if;
  end if;

  rep := case
    when cas = 'ok' then true
    when cas in ('lecteur', 'autre_structure', 'resiliee') then
      (select count(*) from mail_recu where expediteur = exp and repondu_le > now() - interval '24 hours') < 3
    when cas = 'inconnu' and vise.id is not null then
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

-- 4. Dépôt par mail : mêmes règles que deposer_demande, au nom du membre reconnu ---------------------
create or replace function public.mail_deposer(
  p_mail     uuid,
  p_titre    text,
  p_lignes   jsonb,
  p_parution date default null,
  p_brief    text default null
) returns uuid
language plpgsql security definer set search_path to 'public'
as $function$
declare m mail_recu; moi profil; org organisation; off text := offre_active(); u int; urg record; nouvel uuid;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  select * into m from mail_recu where id = p_mail for update;
  if m.id is null or m.issue <> 'recu' then raise exception 'Ce mail est déjà traité'; end if;
  select * into moi from profil where id = m.profil_id and actif;
  if moi.id is null or moi.role not in ('referent', 'contributeur') then raise exception 'Seuls le référent et les contributeurs déposent une demande'; end if;
  select * into org from organisation where id = moi.organisation_id and statut <> 'resiliee';
  if org.id is null then raise exception 'Structure introuvable'; end if;

  -- jamais d'urgence ni d'heure de publication déduites d'un mail : elles se choisissent dans l'Espace
  insert into demande (organisation_id, auteur_id, titre, offre_id, urgente, parution, heure, brief)
  values (org.id, moi.id, p_titre, off, false, p_parution, null, coalesce(p_brief, ''))
  returning id into nouvel;
  u := _ecrire_lignes(nouvel, org, off, p_lignes);
  -- garde-fou : par mail, seulement des prestations courantes à une unité, en un exemplaire, trois au plus
  if u > 3 or exists (
       select 1 from demande_ligne l join prestation pr on pr.offre_id = l.offre_id and pr.id = l.prestation
        where l.demande_id = nouvel and (pr.unites <> 1 or pr.nature <> 'courant' or l.quantite <> 1)) then
    raise exception 'Cette demande ne se dépose pas par mail : elle se termine dans l''Espace';
  end if;
  select * into urg from _urgence(org, off, false, nouvel);
  perform _verifier_place(org.id, nouvel, u + urg.unites);
  update demande set unites = u + urg.unites, urgence_incluse = urg.incluse where id = nouvel;
  insert into historique (demande_id, organisation_id, statut, par) values (nouvel, org.id, 'deposee', moi.id);
  -- l'origine s'inscrit dans les échanges ; l'historique ne garde que les changements de statut
  insert into message (demande_id, organisation_id, auteur_id, texte, systeme)
  values (nouvel, org.id, null, 'Demande reçue par mail, envoyée par ' || moi.nom || '.', true);
  insert into journal (organisation_id, acteur, action, cible, details)
  values (org.id, moi.id, 'depot', nouvel::text, jsonb_build_object('unites', u + urg.unites, 'canal', 'mail', 'mail', m.id));
  update mail_recu set issue = 'deposee', demande_id = nouvel, titre = left(p_titre, 140), parution = p_parution,
                       lignes = coalesce(p_lignes, '[]'::jsonb), texte = null
   where id = m.id;
  return nouvel;
end $function$;

-- 5. Ce qui n'est pas déposé : le motif, et de quoi pré-remplir la nouvelle demande ---------------------
create or replace function public.mail_classer(
  p_mail     uuid,
  p_issue    text,
  p_motif    text,
  p_titre    text default null,
  p_texte    text default null,
  p_parution date default null,
  p_lignes   jsonb default null
) returns void
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if p_issue not in ('a_completer', 'refuse', 'ignore') then raise exception 'Issue inconnue'; end if;
  update mail_recu
     set issue = p_issue, motif = left(p_motif, 60),
         titre = left(nullif(trim(coalesce(p_titre, '')), ''), 140),
         texte = case when p_issue = 'a_completer' then left(nullif(trim(coalesce(p_texte, '')), ''), 12000) end,
         parution = p_parution,
         lignes = case when jsonb_typeof(p_lignes) = 'array' then p_lignes else '[]'::jsonb end
   where id = p_mail and issue = 'recu' and (p_issue <> 'a_completer' or profil_id is not null);
  if not found then raise exception 'Ce mail est déjà traité'; end if;
end $function$;

-- pièces d'un mail rangées dans le stockage « fichiers » : [{nom, chemin, taille, type}] ; les pièces écartées
-- (trop lourdes, trop nombreuses) restent dans la liste sans chemin. Si le mail est devenu une demande,
-- elles deviennent ses pièces jointes.
create or replace function public._mail_pieces_vers_demande(m public.mail_recu) returns integer
language plpgsql security definer set search_path to 'public'
as $function$
declare n int;
begin
  if m.demande_id is null then return 0; end if;
  insert into piece_jointe (demande_id, organisation_id, nom, chemin)
  select m.demande_id, m.organisation_id, left(coalesce(nullif(trim(x->>'nom'), ''), 'pièce jointe'), 200), x->>'chemin'
    from jsonb_array_elements(m.pieces) x
   where x->>'chemin' like m.organisation_id::text || '/%'
     and not exists (select 1 from piece_jointe pj where pj.demande_id = m.demande_id and pj.chemin = x->>'chemin');
  get diagnostics n = row_count;
  return n;
end $function$;

create or replace function public.mail_pieces(p_mail uuid, p_pieces jsonb) returns integer
language plpgsql security definer set search_path to 'public'
as $function$
declare m mail_recu;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if jsonb_typeof(p_pieces) <> 'array' then raise exception 'Liste de pièces attendue'; end if;
  update mail_recu set pieces = p_pieces where id = p_mail and issue in ('recu', 'deposee', 'a_completer') returning * into m;
  if m.id is null then raise exception 'Mail introuvable'; end if;
  return _mail_pieces_vers_demande(m);
end $function$;

create or replace function public.mail_repondu(p_mail uuid) returns void
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  update mail_recu set repondu_le = now() where id = p_mail;
end $function$;

-- 6. Depuis l'Espace : la demande envoyée à partir du lien pré-rempli reprend les pièces du mail ---------
create or replace function public.mail_rattacher(p_mail uuid, p_demande uuid) returns integer
language plpgsql security definer set search_path to 'public'
as $function$
declare m mail_recu; d demande; moi profil;
begin
  select * into moi from profil where id = auth.uid() and actif;
  if moi.id is null or moi.role not in ('referent', 'contributeur') then raise exception 'Accès refusé'; end if;
  select * into m from mail_recu where id = p_mail for update;
  select * into d from demande where id = p_demande;
  if m.id is null or d.id is null or m.organisation_id is distinct from moi.organisation_id
     or d.organisation_id is distinct from moi.organisation_id then
    raise exception 'Demande introuvable';
  end if;
  if m.issue = 'deposee' then return 0; end if;
  -- seulement son propre mail (ou, pour le référent, celui d'un collègue), et la demande que l'on vient soi-même d'envoyer
  if m.issue <> 'a_completer' or d.auteur_id <> moi.id or d.creee < now() - interval '15 minutes'
     or (m.profil_id is distinct from moi.id and moi.role <> 'referent') then
    raise exception 'Ce mail ne peut pas être rattaché à cette demande';
  end if;
  update mail_recu set issue = 'deposee', demande_id = d.id, texte = null where id = m.id returning * into m;
  insert into message (demande_id, organisation_id, auteur_id, texte, systeme)
  values (d.id, d.organisation_id, null, 'Demande préparée à partir d''un mail, terminée dans l''Espace par ' || moi.nom || '.', true);
  perform journaliser(d.organisation_id, 'mail_rattache', d.id::text, jsonb_build_object('mail', m.id));
  return _mail_pieces_vers_demande(m);
end $function$;

-- 7. Ménage : un mail à compléter expire après 30 jours ; les traces d'écarts s'effacent après 90 jours.
-- Renvoie les chemins des pièces à retirer du stockage (le serveur s'en charge).
create or replace function public.mail_purger(p_jours integer default 30) returns text[]
language plpgsql security definer set search_path to 'public'
as $function$
declare chemins text[];
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  select coalesce(array_agg(x->>'chemin'), '{}') into chemins
    from mail_recu r, jsonb_array_elements(r.pieces) x
   where r.issue = 'a_completer' and r.recu < now() - make_interval(days => greatest(7, coalesce(p_jours, 30))) and x ? 'chemin';
  update mail_recu set issue = 'refuse', motif = 'expire', texte = null, pieces = '[]'::jsonb
   where issue = 'a_completer' and recu < now() - make_interval(days => greatest(7, coalesce(p_jours, 30)));
  -- un traitement jamais abouti ne reste pas « en cours » indéfiniment
  update mail_recu set issue = 'ignore', motif = 'interrompu' where issue = 'recu' and recu < now() - interval '1 day';
  delete from mail_recu where issue in ('ignore', 'refuse') and recu < now() - interval '90 days';
  return chemins;
end $function$;

revoke all on function public.alias_mail_libre(text, uuid) from public, anon, authenticated;
revoke all on function public._organisation_alias_mail() from public, anon, authenticated;
revoke all on function public._mail_pieces_vers_demande(public.mail_recu) from public, anon, authenticated;
revoke all on function public.mail_ouvrir(text, text, text[], text, text) from public, anon, authenticated;
revoke all on function public.mail_deposer(uuid, text, jsonb, date, text) from public, anon, authenticated;
revoke all on function public.mail_classer(uuid, text, text, text, text, date, jsonb) from public, anon, authenticated;
revoke all on function public.mail_pieces(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.mail_repondu(uuid) from public, anon, authenticated;
revoke all on function public.mail_rattacher(uuid, uuid) from public, anon;
revoke all on function public.mail_purger(integer) from public, anon, authenticated;
grant execute on function public.alias_mail_libre(text, uuid) to service_role;
grant execute on function public.mail_ouvrir(text, text, text[], text, text) to service_role;
grant execute on function public.mail_deposer(uuid, text, jsonb, date, text) to service_role;
grant execute on function public.mail_classer(uuid, text, text, text, text, date, jsonb) to service_role;
grant execute on function public.mail_pieces(uuid, jsonb) to service_role;
grant execute on function public.mail_repondu(uuid) to service_role;
grant execute on function public.mail_purger(integer) to service_role;
grant execute on function public.mail_rattacher(uuid, uuid) to authenticated;
