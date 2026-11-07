-- Premier mois sans engagement (7 novembre 2026) : le premier mois est réglé seul ; la mise en place (Essentiel, Régulier,
-- Soutenu, engagement de 6 mois) est facturée avec le deuxième mois, une fois l'abonnement poursuivi ; offerte à 12 mois.

-- montant de mise en place dû pour une période : la deuxième période de l'abonnement seulement
create or replace function prive._mise_en_place_due(o organisation, per text)
returns numeric language sql stable security definer set search_path to 'public' as $$
  select case
    when o.relais_semaine then 0
    when per <> prive._mois_suivant(periode_org(o.id, coalesce(o.anniversaire, o.debut))) then 0
    when o.engagement_mois >= (select engagement_long from offre_version where active) then 0
    else coalesce((select f.mise_en_place from formule f where f.offre_id = offre_active() and f.id = o.formule), 0)
  end $$;

create or replace function prive._facturer(o organisation, per text)
 returns boolean language plpgsql security definer set search_path to 'public' as $function$
declare fo formule; off offre_version; l jsonb; montant numeric; hf int; num int; st text;
begin
  if o.essai or o.statut <> 'active' then return false; end if;
  if per < periode_org(o.id, coalesce(o.anniversaire, o.debut)) then return false; end if;
  if exists (select 1 from facture where organisation_id = o.id and periode = per) then return false; end if;
  select * into off from offre_version where active;
  select * into fo from formule where offre_id = off.id and id = o.formule;
  l := jsonb_build_array(jsonb_build_object('libelle', 'Abonnement Fill ' || fo.nom, 'quantite', 1, 'total', fo.prix,
    'du', debut_periode_org(o.id, per), 'au', fin_periode_org(o.id, per)));
  montant := fo.prix;
  -- mise en place : sur la deuxième période (le premier mois est sans engagement)
  if per = prive._mois_suivant(periode_org(o.id, coalesce(o.anniversaire, o.debut))) and fo.mise_en_place > 0 and not coalesce(o.relais_semaine, false) then
    l := l || jsonb_build_object('libelle', case when o.engagement_mois >= off.engagement_long then 'Mise en place (offerte)' else 'Mise en place' end,
      'quantite', 1, 'total', case when o.engagement_mois >= off.engagement_long then 0 else fo.mise_en_place end);
    if o.engagement_mois < off.engagement_long then montant := montant + fo.mise_en_place; end if;
  end if;
  select coalesce(sum(unites_hors_forfait), 0) into hf from demande
    where organisation_id = o.id and statut <> 'annulee' and periode_org(o.id, (creee at time zone 'Europe/Paris')::date) = per;
  if hf > 0 then l := l || jsonb_build_object('libelle', 'Unités hors forfait', 'quantite', hf, 'total', hf * off.unite_sup); montant := montant + hf * off.unite_sup; end if;
  select l || coalesce(jsonb_agg(jsonb_build_object('libelle', 'Unités commandées', 'quantite', c.unites, 'total', c.total)), '[]'::jsonb), montant + coalesce(sum(c.total), 0)
    into l, montant from commande c where c.organisation_id = o.id
      and periode_org(o.id, (c.creee at time zone 'Europe/Paris')::date) = per and c.statut in ('a_facturer','payee');
  select count(*) + 1 into num from facture where periode = per;
  if o.type = 'collectivite' then st := 'deposee';
  elsif hf = 0 and prive._mensualite_reglee(o.id, per) then st := 'payee';
  else st := 'emise'; end if;
  insert into facture (id, organisation_id, periode, total_ht, lignes, statut)
    values (case when o.type = 'collectivite' then 'F-' else 'R-' end || replace(per, '-', '') || '-' || lpad(num::text, 3, '0'), o.id, per, montant, l, st);
  return true;
end $function$;

create or replace function prive._mensualite_due(o organisation, p_periode text default null)
 returns jsonb language plpgsql stable security definer set search_path to 'public' as $function$
declare per text; cur text; f formule; montant numeric; etat text := 'a_regler'; prochain text; j date := prive.aujourdhui();
begin
  select * into f from formule where offre_id = offre_active() and id = o.formule;
  if o.relais_semaine then
    cur := semaine_org(o.id, j);
    prochain := semaine_org(o.id, j + 7);
  else
    cur := periode_org(o.id, j);
    prochain := prive._mois_suivant(cur);
  end if;
  if p_periode is not null then
    if p_periode not in (cur, prochain) then
      return jsonb_build_object('etat', 'periode_invalide', 'organisation', o.id, 'nom', o.nom);
    end if;
    per := p_periode;
  else
    per := cur;
    if not o.relais_semaine and prive._mensualite_reglee(o.id, cur) and debut_periode_org(o.id, prochain) - j <= 10 then
      per := prochain;
    end if;
  end if;
  montant := case when o.relais_semaine then f.prix_semaine else f.prix + prive._mise_en_place_due(o, per) end;
  if o.type = 'collectivite' then etat := 'collectivite';
  elsif o.statut = 'a_activer' then etat := 'ouverture';
  elsif o.statut <> 'active' then etat := 'resiliee';
  elsif o.essai then etat := 'essai';
  elsif o.fin is not null and debut_periode_org(o.id, per) > o.fin then etat := 'termine';
  elsif prive._mensualite_reglee(o.id, per) then etat := 'reglee';
  elsif montant is null or montant <= 0 then etat := 'sans_montant';
  end if;
  return jsonb_build_object('etat', etat, 'organisation', o.id, 'nom', o.nom, 'type', o.type, 'periode', per,
    'debut', debut_periode_org(o.id, per), 'fin', fin_periode_org(o.id, per), 'anniversaire', o.anniversaire,
    'semaine', o.relais_semaine, 'montant', montant, 'mise_en_place', prive._mise_en_place_due(o, per), 'formule', f.nom,
    'unites', case when o.relais_semaine then f.unites_semaine else f.unites end);
end $function$;

create or replace function public.mensualite_virement(p_organisation uuid, p_periode text default null)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare o organisation; per text;
begin
  if not est_admin() then raise exception 'Réservé à l''administrateur'; end if;
  select * into o from organisation where id = p_organisation;
  if o is null then raise exception 'Organisation introuvable'; end if;
  per := coalesce(p_periode, case when o.relais_semaine then semaine_org(o.id) else periode_org(o.id) end);
  if per !~ '^\d{4}-(\d{2}|S\d{2})$' then raise exception 'Période invalide'; end if;
  if exists (select 1 from mensualite where organisation_id = o.id and periode = per) then
    raise exception 'Cette période est déjà réglée';
  end if;
  return prive._regler_mensualite(o.id, per,
    (select case when o.relais_semaine then f.prix_semaine else f.prix + prive._mise_en_place_due(o, per) end from formule f where f.offre_id = offre_active() and f.id = o.formule),
    'virement', null, auth.uid());
end $function$;
