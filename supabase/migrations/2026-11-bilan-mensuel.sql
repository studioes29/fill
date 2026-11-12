-- Mail mensuel unique : bilan de période figé et trois suggestions.
--
-- À la fin de chaque période d'abonnement (date anniversaire : periode_org, debut_periode_org, fin_periode_org),
-- une fois la période clôturée (table cloture : le report et l'expiration des unités sont alors écrits au registre),
-- la fonction serveur « bilan » fige un bilan par organisation et par période, puis envoie un seul mail au référent.
-- Tant que le réglage pilote_bilan est faux, chaque bilan préparé attend l'accord de Fill dans Hors-champ.
--
--   bilan_candidats      les périodes closes qui attendent leur bilan ;
--   bilan_calculer       les chiffres, lus dans le registre, l'historique et les demandes ;
--   bilan_contexte       les demandes récentes et les fermetures, pour les règles de suggestion ;
--   bilan_preparer       fige le bilan (chiffres + suggestions fournies par les règles du serveur) ;
--   bilan_lire           ce que la page espace/bilan/ affiche pour un jeton (partage, ou aperçu avant envoi) ;
--   bilan_a_valider, bilan_relire, bilan_valider, bilan_ecarter   Hors-champ : bilans à valider, aperçu, accord, refus ;
--   bilan_a_envoyer, bilan_reserver_envoi, bilan_confirmer_envoi, bilan_liberer_envoi   un bilan ne part qu'une fois ;
--   bilan_revoquer       le référent (ou Fill) retire le lien de partage.
--
-- Les jetons ne sont jamais enregistrés : la base ne garde que leur empreinte (SHA-256), comme pour lien_relecture.
-- Aucune table existante n'est modifiée, sauf parametre qui reçoit un réglage (pilote_bilan, faux par défaut).

alter table public.parametre add column if not exists pilote_bilan boolean not null default false;
comment on column public.parametre.pilote_bilan is
  'Mail mensuel : vrai, le bilan part au référent sans relecture par Fill ; faux (défaut), chaque bilan attend un accord.';

create table if not exists public.bilan (
  id                  uuid primary key default gen_random_uuid(),
  organisation_id     uuid not null references public.organisation(id) on delete cascade,
  periode             text not null check (periode ~ '^\d{4}-\d{2}$'),
  debut               date not null,
  fin                 date not null check (fin >= debut),
  donnees             jsonb not null check (jsonb_typeof(donnees) = 'object'),
  empreinte           text unique check (empreinte ~ '^[0-9a-f]{64}$'),
  empreinte_relecture text unique check (empreinte_relecture ~ '^[0-9a-f]{64}$'),
  calcule_le          timestamptz not null default now(),
  approuve_le         timestamptz,
  envoi_reserve_le    timestamptz,
  envoye_le           timestamptz,
  envoye_a            text,
  revoque_le          timestamptz,
  constraint bilan_un_par_periode unique (organisation_id, periode),
  constraint bilan_envoi_coherent check (envoye_le is null or (envoi_reserve_le is not null and empreinte is not null))
);

comment on table public.bilan is
  'Bilans de période figés (chiffres et suggestions en jsonb). Empreintes des jetons seulement ; écritures par les fonctions bilan_*.';

alter table public.bilan enable row level security;

-- lecture : l''équipe Fill, et les comptes de l''organisation une fois le bilan envoyé ; jamais les empreintes
revoke all on public.bilan from anon, authenticated;
grant select (id, organisation_id, periode, debut, fin, donnees, calcule_le, approuve_le, envoye_le, envoye_a, revoque_le)
  on public.bilan to authenticated;

drop policy if exists bilan_lecture on public.bilan;
create policy bilan_lecture on public.bilan
  for select to authenticated
  using (public.est_equipe() or (organisation_id = public.mon_organisation() and envoye_le is not null));

-- Jours ouvrés entre deux dates (a exclu, b inclus), comme la règle ouvresEntre des fonctions serveur.
create or replace function public.bilan_ouvres_entre(a date, b date) returns integer
language sql stable set search_path to 'public'
as $function$
  select case when b <= a then 0
    else (select count(*)::int from generate_series(1, b - a) n where est_ouvre(a + n)) end
$function$;

-- Les périodes closes qui attendent leur bilan : organisation active, période précédente clôturée (le report et
-- l''expiration sont au registre), abonnement actif sur cette période (un quota y a été crédité), terminée depuis
-- dix jours au plus, et pas encore de bilan. Tant que le quota de la période qui commence n''est pas crédité
-- (entreprise dont la mensualité n''est pas encore réglée), le bilan attend, quatre jours au plus : les suggestions
-- se chiffrent sur des unités réellement disponibles. Réservé au serveur.
create or replace function public.bilan_candidats(p_jour date default null) returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $function$
declare o organisation; jour date := coalesce(p_jour, (now() at time zone 'Europe/Paris')::date);
  cur text; prec text; fin_prec date; r jsonb := '[]'::jsonb;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  for o in select * from organisation where statut = 'active' order by nom loop
    cur := periode_org(o.id, jour);
    prec := to_char(to_date(cur || '-01', 'YYYY-MM-DD') - interval '1 month', 'YYYY-MM');
    fin_prec := fin_periode_org(o.id, prec);
    if fin_prec >= jour or jour - fin_prec > 10 then continue; end if;
    if not exists (select 1 from cloture where organisation_id = o.id and periode = prec) then continue; end if;
    if not exists (select 1 from registre where organisation_id = o.id and periode = prec and type = 'credit') then continue; end if;
    if exists (select 1 from bilan where organisation_id = o.id and periode = prec) then continue; end if;
    if jour - fin_prec <= 4 and (o.fin is null or o.fin >= debut_periode_org(o.id, cur))
       and not exists (select 1 from registre where organisation_id = o.id and periode = cur and type = 'credit') then continue; end if;
    r := r || jsonb_build_array(jsonb_build_object('organisation', o.id, 'periode', prec));
  end loop;
  return r;
end $function$;

-- Les chiffres d''une période. Aucune durée de travail, aucune statistique d''audience.
--   demandes livrées : passées en « livrée » pendant la période ;
--   unités : celles du registre sur la période (utilisées = réservées + consommées, expirées), report écrit sur la suivante ;
--   date annoncée : celle où Fill remet la version à relire (demande.livraison) ; un retard se compte en jours ouvrés ;
--   validation côté client : jours ouvrés entre la remise d''une version et la réponse (accord ou corrections).
-- Réservé au serveur.
create or replace function public.bilan_calculer(p_org uuid, p_periode text) returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $function$
declare o organisation; deb date; fin_ date; suiv text; deb_suiv date; u record; s record;
  reportees int; livre jsonb; livrables jsonb; en_cours jsonb; a_la_date int; avec_date int; nb int; attente int; dispo int;
  validations int; validation_jours numeric; suivante jsonb := null;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if p_periode !~ '^\d{4}-\d{2}$' then raise exception 'Période invalide'; end if;
  select * into o from organisation where id = p_org;
  if o.id is null then raise exception 'Organisation inconnue'; end if;
  deb := debut_periode_org(p_org, p_periode);
  fin_ := fin_periode_org(p_org, p_periode);
  suiv := to_char(to_date(p_periode || '-01', 'YYYY-MM-DD') + interval '1 month', 'YYYY-MM');
  deb_suiv := debut_periode_org(p_org, suiv);

  select coalesce(sum(unites) filter (where type = 'credit'), 0)::int as quota,
         coalesce(sum(unites) filter (where type = 'report'), 0)::int as report,
         coalesce(sum(unites) filter (where type = 'ajustement'), 0)::int as ajustements,
         coalesce(sum(unites) filter (where type = 'debit' and etat = 'reserve'), 0)::int as reserve,
         coalesce(sum(unites) filter (where type = 'debit' and etat = 'consomme'), 0)::int as consomme,
         coalesce(-sum(unites) filter (where type = 'expiration'), 0)::int as expirees
    into u from registre where organisation_id = p_org and periode = p_periode;
  select coalesce(sum(unites), 0)::int into reportees
    from registre where organisation_id = p_org and periode = suiv and type = 'report';

  with liv as (
    select d.id, d.numero, d.titre, d.unites, d.livraison as annoncee,
           (min(h.date) filter (where h.statut = 'livree') at time zone 'Europe/Paris')::date as livree_le,
           (min(h.date) filter (where h.statut = 'a_valider' and h.type = 'statut') at time zone 'Europe/Paris')::date as remise_le
      from demande d join historique h on h.demande_id = d.id
     where d.organisation_id = p_org and d.statut = 'livree'
     group by d.id
  ), dans as (
    select l.*, coalesce(l.remise_le, l.livree_le) as remise,
           case when l.annoncee is null then null
                else bilan_ouvres_entre(l.annoncee, coalesce(l.remise_le, l.livree_le)) end as retard
      from liv l where l.livree_le between deb and fin_
  )
  select count(*)::int,
         count(*) filter (where retard = 0)::int,
         count(*) filter (where retard is not null)::int,
         coalesce(jsonb_agg(jsonb_build_object(
           'numero', numero, 'titre', titre, 'date', livree_le, 'unites', unites,
           'annoncee', annoncee, 'remise', remise, 'retard_jours', retard,
           'lignes', coalesce((select jsonb_agg(jsonb_build_object('nom', coalesce(p.nom, dl.prestation), 'quantite', dl.quantite) order by dl.quantite desc, p.nom)
                                 from demande_ligne dl left join prestation p on p.offre_id = dl.offre_id and p.id = dl.prestation
                                where dl.demande_id = dans.id), '[]'::jsonb))
           order by livree_le, numero), '[]'::jsonb)
    into nb, a_la_date, avec_date, livre from dans;

  select coalesce(jsonb_agg(jsonb_build_object('prestation', prestation, 'nom', nom, 'quantite', quantite) order by quantite desc, nom), '[]'::jsonb)
    into livrables
    from (select dl.prestation, coalesce(max(p.nom), dl.prestation) as nom, sum(dl.quantite)::int as quantite
            from demande_ligne dl
            join demande d on d.id = dl.demande_id
            left join prestation p on p.offre_id = dl.offre_id and p.id = dl.prestation
           where d.organisation_id = p_org and d.statut = 'livree'
             and (select (min(h.date) at time zone 'Europe/Paris')::date from historique h where h.demande_id = d.id and h.statut = 'livree') between deb and fin_
           group by dl.prestation) x;

  select count(*)::int, round(avg(bilan_ouvres_entre((remise at time zone 'Europe/Paris')::date, (reponse at time zone 'Europe/Paris')::date)), 1)
    into validations, validation_jours
    from (select h.date as remise,
                 (select min(x.date) from historique x
                   where x.demande_id = h.demande_id and x.id > h.id and x.statut in ('validee', 'correction') and x.type in ('statut', 'lien')) as reponse
            from historique h
           where h.organisation_id = p_org and h.statut = 'a_valider' and h.type = 'statut') v
   where reponse is not null and (reponse at time zone 'Europe/Paris')::date between deb and fin_;

  select coalesce(jsonb_agg(jsonb_build_object('titre', titre, 'statut', statut, 'livraison', livraison) order by creee), '[]'::jsonb)
    into en_cours
    from demande
   where organisation_id = p_org and statut not in ('livree', 'annulee') and (creee at time zone 'Europe/Paris')::date <= fin_;

  -- la période qui commence : ce qui reste à utiliser, report compris (il expire à la fin de cette période).
  -- Comme dans l''Espace, les demandes déposées qui attendent leur confirmation sont déjà déduites.
  if o.statut = 'active' and (o.fin is null or o.fin >= deb_suiv) then
    select coalesce(sum(unites) filter (where type in ('credit', 'report', 'ajustement')), 0)::int as total,
           coalesce(sum(unites) filter (where type = 'report'), 0)::int as report,
           coalesce(sum(unites) filter (where type = 'debit' and etat in ('reserve', 'consomme')), 0)::int as engage,
           coalesce(bool_or(type = 'credit'), false) as creditee
      into s from registre where organisation_id = p_org and periode = suiv;
    select coalesce(sum(unites), 0)::int into attente
      from demande where organisation_id = p_org and statut in ('deposee', 'accord_requis');
    dispo := greatest(0, s.total - s.engage - attente);
    suivante := jsonb_build_object(
      'periode', suiv, 'debut', deb_suiv, 'fin', fin_periode_org(p_org, suiv),
      'creditee', s.creditee, 'en_attente', attente, 'disponible', dispo,
      'report', greatest(0, least(s.report - s.engage, dispo)));
  end if;

  return jsonb_build_object(
    'version', 1,
    'organisation', jsonb_build_object('nom', o.nom, 'type', o.type, 'formule', o.formule),
    'periode', p_periode, 'debut', deb, 'fin', fin_,
    'demandes_livrees', nb,
    'unites', jsonb_build_object(
      'quota', u.quota, 'report', u.report, 'ajustements', u.ajustements, 'total', u.quota + u.report + u.ajustements,
      'utilisees', u.reserve + u.consomme, 'reservees', u.reserve, 'reportees', reportees, 'expirees', u.expirees),
    'delais', jsonb_build_object(
      'a_la_date', a_la_date, 'total', avec_date, 'sans_date', nb - avec_date,
      'validations', validations, 'validation_jours', validation_jours),
    'livrables', livrables,
    'livre', livre,
    'en_cours', en_cours,
    'suivante', suivante);
end $function$;

-- Ce dont les règles de suggestion ont besoin : les demandes de l''organisation sur quinze mois (pour « déjà demandé »
-- et « même période l''an passé »), celles qui sont encore en cours, et les fermetures de Fill. Réservé au serveur.
create or replace function public.bilan_contexte(p_org uuid, p_jour date default null) returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $function$
declare depuis date := coalesce(p_jour, (now() at time zone 'Europe/Paris')::date) - interval '15 months';
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  return jsonb_build_object(
    'demandes', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', d.id, 'titre', d.titre, 'statut', d.statut, 'parution', d.parution, 'creee', d.creee,
               'lignes', coalesce((select jsonb_agg(jsonb_build_object('prestation', l.prestation, 'quantite', l.quantite))
                                     from demande_ligne l where l.demande_id = d.id), '[]'::jsonb))
             order by d.creee)
        from demande d
       where d.organisation_id = p_org
         and (d.creee >= depuis or d.parution >= depuis or d.statut not in ('livree', 'annulee'))), '[]'::jsonb),
    'fermetures', coalesce((select jsonb_agg(jsonb_build_object('debut', debut, 'fin', fin)) from fermeture), '[]'::jsonb));
end $function$;

-- Fige le bilan d''une période : les chiffres de bilan_calculer et les suggestions produites par les règles du serveur.
-- Le total des suggestions ne dépasse jamais les unités disponibles de la période qui commence : la base le vérifie aussi.
-- Un bilan existe une seule fois par organisation et par période : un second appel ne change rien. Réservé au serveur.
create or replace function public.bilan_preparer(p_org uuid, p_periode text, p_suggestions jsonb)
returns jsonb
language plpgsql security definer set search_path to 'public'
as $function$
declare d jsonb; sug jsonb := coalesce(p_suggestions, '[]'::jsonb); total int; dispo int; nouveau uuid;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  if jsonb_typeof(sug) <> 'array' or jsonb_array_length(sug) > 3 then raise exception 'Trois suggestions au plus'; end if;
  if exists (select 1 from jsonb_array_elements(sug) x
              where jsonb_typeof(x) <> 'object' or coalesce(x->>'cle', '') = '' or coalesce(x->>'titre', '') = ''
                 or coalesce(x->>'unites', '') !~ '^\d+$' or (x->>'unites')::int < 1) then
    raise exception 'Suggestion incomplète';
  end if;
  if (select count(distinct x->>'cle') from jsonb_array_elements(sug) x) <> jsonb_array_length(sug) then
    raise exception 'Suggestions en double';
  end if;
  if not exists (select 1 from cloture where organisation_id = p_org and periode = p_periode) then
    raise exception 'Période non clôturée';
  end if;
  d := bilan_calculer(p_org, p_periode);
  dispo := coalesce((d->'suivante'->>'disponible')::int, 0);
  select coalesce(sum((x->>'unites')::int), 0) into total from jsonb_array_elements(sug) x;
  if total > dispo then raise exception 'Les suggestions dépassent les unités disponibles (% pour %)', total, dispo; end if;

  insert into bilan (organisation_id, periode, debut, fin, donnees)
  values (p_org, p_periode, (d->>'debut')::date, (d->>'fin')::date, d || jsonb_build_object('suggestions', sug))
  on conflict (organisation_id, periode) do nothing
  returning id into nouveau;
  if nouveau is null then
    return jsonb_build_object('cree', false, 'id', (select id from bilan where organisation_id = p_org and periode = p_periode));
  end if;
  perform journaliser(p_org, 'bilan', nouveau::text, jsonb_build_object('periode', p_periode, 'suggestions', jsonb_array_length(sug)));
  return jsonb_build_object('cree', true, 'id', nouveau);
end $function$;

-- Ce que la page de bilan affiche pour un jeton : lien de partage (après envoi) ou aperçu (Fill, depuis Hors-champ).
-- Un jeton inconnu ne révèle rien. Réservé au serveur.
create or replace function public.bilan_lire(p_empreinte text) returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $function$
declare b bilan; relecture boolean; ref record;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  select * into b from bilan where empreinte = p_empreinte or empreinte_relecture = p_empreinte;
  if b.id is null then return jsonb_build_object('etat', 'inconnu'); end if;
  relecture := b.empreinte_relecture is not distinct from p_empreinte;
  if not relecture then
    if b.revoque_le is not null then return jsonb_build_object('etat', 'revoque'); end if;
    if b.envoye_le is null then return jsonb_build_object('etat', 'inconnu'); end if;
    return jsonb_build_object('etat', 'ouvert', 'mode', 'partage', 'id', b.id, 'donnees', b.donnees, 'calcule_le', b.calcule_le);
  end if;
  select nom, email into ref from profil
   where organisation_id = b.organisation_id and role = 'referent' and actif order by creee limit 1;
  return jsonb_build_object(
    'etat', 'ouvert', 'mode', 'relecture', 'id', b.id, 'donnees', b.donnees, 'calcule_le', b.calcule_le, 'envoye_le', b.envoye_le,
    'referent', case when ref.nom is null then null else jsonb_build_object('nom', ref.nom) end);
end $function$;

-- ---------- Hors-champ : la validation des bilans par Fill ----------
-- Hors-champ, l'outil de pilotage d'Ewen, lit et écrit par le connecteur Supabase, comme pour fill_retards.
-- Ces fonctions ne sont ouvertes ni aux visiteurs ni aux comptes clients (droits retirés, rôle contrôlé).

-- Les bilans préparés qui attendent l''accord de Fill, et ceux dont l''envoi est resté sans confirmation.
create or replace function public.bilan_a_valider() returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $function$
declare auto boolean;
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then raise exception 'Réservé à Fill'; end if;
  select coalesce(pilote_bilan, false) into auto from parametre limit 1;
  return jsonb_build_object(
    'a_valider', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', b.id, 'organisation', o.nom, 'type', o.type, 'essai', o.essai, 'periode', b.periode, 'debut', b.debut, 'fin', b.fin,
               'calcule_le', b.calcule_le, 'donnees', b.donnees,
               'referent', (select jsonb_build_object('nom', p.nom, 'email', p.email) from profil p
                             where p.organisation_id = o.id and p.role = 'referent' and p.actif order by p.creee limit 1))
             order by b.calcule_le)
        from bilan b join organisation o on o.id = b.organisation_id
       where b.envoye_le is null and b.envoi_reserve_le is null and b.revoque_le is null and b.approuve_le is null
         and not (coalesce(auto, false) and o.mails_auto)), '[]'::jsonb),
    'bloques', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', b.id, 'organisation', o.nom, 'periode', b.periode, 'debut', b.debut, 'fin', b.fin, 'depuis', b.envoi_reserve_le,
               'referent', (select jsonb_build_object('nom', p.nom, 'email', p.email) from profil p
                             where p.organisation_id = o.id and p.role = 'referent' and p.actif order by p.creee limit 1))
             order by b.envoi_reserve_le)
        from bilan b join organisation o on o.id = b.organisation_id
       where b.envoye_le is null and b.envoi_reserve_le is not null and b.envoi_reserve_le < now() - interval '10 minutes'), '[]'::jsonb));
end $function$;

-- Aperçu d''un bilan depuis Hors-champ : le jeton du lien est tiré dans Hors-champ, la base n''en garde que l''empreinte.
-- Chaque nouvel aperçu remplace le précédent. La page montre le bilan tel que le client le recevra, sans aucune action.
create or replace function public.bilan_relire(p_bilan uuid, p_empreinte text) returns boolean
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then raise exception 'Réservé à Fill'; end if;
  update bilan set empreinte_relecture = p_empreinte where id = p_bilan and revoque_le is null;
  return found;
end $function$;

-- Accord de Fill depuis Hors-champ. Les suggestions retirées disparaissent du bilan, puis l''envoi est demandé tout de suite
-- à la fonction « bilan » (jeton du pilote) : dans la plage d''envoi, le mail part aussitôt ; sinon au passage suivant.
-- Renvoie l''identifiant de l''appel, à lire ensuite avec parcours_reponse.
create or replace function public.bilan_valider(p_bilan uuid, p_retirer text[] default '{}') returns bigint
language plpgsql security definer set search_path to 'public'
as $function$
declare b bilan; jeton text;
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then raise exception 'Réservé à Fill'; end if;
  select * into b from bilan where id = p_bilan for update;
  if b.id is null then raise exception 'Bilan introuvable'; end if;
  if b.envoye_le is not null or b.envoi_reserve_le is not null then raise exception 'Ce bilan est déjà parti'; end if;
  if b.revoque_le is not null then raise exception 'Ce bilan a été écarté'; end if;
  update bilan
     set approuve_le = coalesce(approuve_le, now()),
         donnees = jsonb_set(donnees, '{suggestions}', coalesce((
           select jsonb_agg(x order by n) from jsonb_array_elements(donnees->'suggestions') with ordinality t(x, n)
            where not (x->>'cle' = any (coalesce(p_retirer, '{}')))), '[]'::jsonb))
   where id = b.id;
  perform journaliser(b.organisation_id, 'bilan_valide', b.id::text, jsonb_build_object('retirees', coalesce(cardinality(p_retirer), 0)));
  select decrypted_secret into jeton from vault.decrypted_secrets where name = 'jeton_pilote';
  if jeton is null then return null; end if;
  return net.http_post(
    url := 'https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/bilan',
    headers := jsonb_build_object('Authorization', 'Bearer ' || jeton, 'Content-Type', 'application/json'),
    body := jsonb_build_object('action', 'envoyer', 'bilan', b.id),
    timeout_milliseconds := 30000);
end $function$;

-- « Ne pas l''envoyer » depuis Hors-champ : le bilan reste en base, écarté ; il ne partira pas.
create or replace function public.bilan_ecarter(p_bilan uuid) returns boolean
language plpgsql security definer set search_path to 'public'
as $function$
declare b bilan;
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then raise exception 'Réservé à Fill'; end if;
  update bilan set revoque_le = now()
   where id = p_bilan and envoye_le is null and envoi_reserve_le is null and revoque_le is null
  returning * into b;
  if b.id is null then return false; end if;
  perform journaliser(b.organisation_id, 'bilan_ecarte', b.id::text, null);
  return true;
end $function$;

-- Les bilans prêts à partir : approuvés par Fill, ou tous si le réglage pilote_bilan l''autorise et que
-- l''organisation accepte les envois automatiques. « en_attente » : ceux qui attendent un accord dans Hors-champ.
-- « bloques » : envoi réservé mais jamais confirmé (Hors-champ les montre aussi).
create or replace function public.bilan_a_envoyer() returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $function$
declare auto boolean;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  select coalesce(pilote_bilan, false) into auto from parametre limit 1;
  return jsonb_build_object(
    'prets', coalesce((select jsonb_agg(b.id order by b.calcule_le) from bilan b join organisation o on o.id = b.organisation_id
                        where b.envoye_le is null and b.envoi_reserve_le is null and b.revoque_le is null
                          and (b.approuve_le is not null or (coalesce(auto, false) and o.mails_auto))), '[]'::jsonb),
    'en_attente', (select count(*)::int from bilan b join organisation o on o.id = b.organisation_id
                    where b.envoye_le is null and b.envoi_reserve_le is null and b.revoque_le is null
                      and not (b.approuve_le is not null or (coalesce(auto, false) and o.mails_auto))),
    'bloques', coalesce((select jsonb_agg(b.id) from bilan b where b.envoye_le is null and b.envoi_reserve_le is not null), '[]'::jsonb));
end $function$;

-- Réserve l''envoi d''un bilan : une seule réservation aboutit, même si deux appels se croisent. Le jeton de partage
-- est créé à ce moment (son empreinte seulement). Une suggestion dont la date limite de dépôt est passée entre le
-- calcul et l''envoi (relecture tardive) est retirée : le client ne reçoit rien qu''il ne puisse plus tenir.
-- Renvoie de quoi écrire le mail, ou null si le bilan n''est pas à envoyer. Réservé au serveur.
create or replace function public.bilan_reserver_envoi(p_bilan uuid, p_empreinte text, p_jour date default null) returns jsonb
language plpgsql security definer set search_path to 'public'
as $function$
declare b bilan; o organisation; ref record; auto boolean; d jsonb; jour date := coalesce(p_jour, (now() at time zone 'Europe/Paris')::date);
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  select coalesce(pilote_bilan, false) into auto from parametre limit 1;
  select * into b from bilan where id = p_bilan for update;
  if b.id is null or b.envoye_le is not null or b.envoi_reserve_le is not null or b.revoque_le is not null then return null; end if;
  select * into o from organisation where id = b.organisation_id;
  if not (b.approuve_le is not null or (coalesce(auto, false) and o.mails_auto)) then return null; end if;
  select id, nom, email into ref from profil
   where organisation_id = b.organisation_id and role = 'referent' and actif order by creee limit 1;
  if ref.email is null then return jsonb_build_object('erreur', 'sans_referent', 'organisation', jsonb_build_object('id', o.id, 'nom', o.nom)); end if;
  update bilan
     set envoi_reserve_le = now(), empreinte = p_empreinte,
         donnees = jsonb_set(donnees, '{suggestions}', coalesce((
           select jsonb_agg(x order by n) from jsonb_array_elements(donnees->'suggestions') with ordinality t(x, n)
            where x->>'limite' is null or (x->>'limite')::date >= jour), '[]'::jsonb))
   where id = b.id
  returning donnees into d;
  return jsonb_build_object(
    'id', b.id, 'donnees', d,
    'organisation', jsonb_build_object('id', o.id, 'nom', o.nom, 'essai', o.essai),
    'referent', jsonb_build_object('nom', ref.nom, 'email', ref.email));
end $function$;

-- Le mail est parti : le bilan est émis, il ne repartira plus. Réservé au serveur.
create or replace function public.bilan_confirmer_envoi(p_bilan uuid, p_a text) returns boolean
language plpgsql security definer set search_path to 'public'
as $function$
declare b bilan;
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  update bilan set envoye_le = now(), envoye_a = lower(trim(p_a))
   where id = p_bilan and envoye_le is null and envoi_reserve_le is not null
  returning * into b;
  if b.id is null then return false; end if;
  perform journaliser(b.organisation_id, 'bilan_envoye', b.id::text, jsonb_build_object('periode', b.periode));
  return true;
end $function$;

-- Le service d''envoi a refusé le mail (rien n''est parti) : la réservation est rendue, le lien de partage aussi.
-- Réservé au serveur.
create or replace function public.bilan_liberer_envoi(p_bilan uuid) returns boolean
language plpgsql security definer set search_path to 'public'
as $function$
begin
  if auth.role() <> 'service_role' then raise exception 'Réservé au serveur'; end if;
  update bilan set envoi_reserve_le = null, empreinte = null
   where id = p_bilan and envoye_le is null and envoi_reserve_le is not null;
  return found;
end $function$;

-- Retire le lien de partage d''un bilan : le référent de l''organisation (ou son suppléant), ou Fill.
create or replace function public.bilan_revoquer(p_bilan uuid) returns void
language plpgsql security definer set search_path to 'public'
as $function$
declare b bilan;
begin
  select * into b from bilan where id = p_bilan for update;
  if b.id is null or not (est_admin() or (b.envoye_le is not null and peut_valider(b.organisation_id))) then
    raise exception 'Bilan introuvable';
  end if;
  update bilan set revoque_le = coalesce(revoque_le, now()) where id = b.id;
  perform journaliser(b.organisation_id, 'bilan_revoque', b.id::text, null);
end $function$;

revoke all on function public.bilan_ouvres_entre(date, date) from public, anon, authenticated;
revoke all on function public.bilan_candidats(date) from public, anon, authenticated;
revoke all on function public.bilan_calculer(uuid, text) from public, anon, authenticated;
revoke all on function public.bilan_preparer(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public.bilan_lire(text) from public, anon, authenticated;
revoke all on function public.bilan_a_valider() from public, anon, authenticated;
revoke all on function public.bilan_relire(uuid, text) from public, anon, authenticated;
revoke all on function public.bilan_valider(uuid, text[]) from public, anon, authenticated;
revoke all on function public.bilan_ecarter(uuid) from public, anon, authenticated;
revoke all on function public.bilan_a_envoyer() from public, anon, authenticated;
revoke all on function public.bilan_reserver_envoi(uuid, text, date) from public, anon, authenticated;
revoke all on function public.bilan_contexte(uuid, date) from public, anon, authenticated;
revoke all on function public.bilan_confirmer_envoi(uuid, text) from public, anon, authenticated;
revoke all on function public.bilan_liberer_envoi(uuid) from public, anon, authenticated;
revoke all on function public.bilan_revoquer(uuid) from public, anon;
grant execute on function public.bilan_ouvres_entre(date, date) to service_role;
grant execute on function public.bilan_candidats(date) to service_role;
grant execute on function public.bilan_calculer(uuid, text) to service_role;
grant execute on function public.bilan_preparer(uuid, text, jsonb) to service_role;
grant execute on function public.bilan_lire(text) to service_role;
grant execute on function public.bilan_a_valider() to service_role;
grant execute on function public.bilan_relire(uuid, text) to service_role;
grant execute on function public.bilan_valider(uuid, text[]) to service_role;
grant execute on function public.bilan_ecarter(uuid) to service_role;
grant execute on function public.bilan_a_envoyer() to service_role;
grant execute on function public.bilan_reserver_envoi(uuid, text, date) to service_role;
grant execute on function public.bilan_contexte(uuid, date) to service_role;
grant execute on function public.bilan_confirmer_envoi(uuid, text) to service_role;
grant execute on function public.bilan_liberer_envoi(uuid) to service_role;
grant execute on function public.bilan_revoquer(uuid) to authenticated, service_role;
