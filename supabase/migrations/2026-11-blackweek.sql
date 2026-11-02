-- Offre Black Week 2026 : +50 % d'unités le premier mois (arrondi au supérieur).
-- Toute organisation activée du 23 au 30 novembre 2026 inclus (date de Paris, prive.aujourdhui())
-- sur Essentiel, Régulier ou Soutenu reçoit un ajustement « offert » sur sa première période (comme un geste saisi à la main) :
-- 5 unités (Essentiel), 11 (Régulier), 23 (Soutenu).
-- Les autres dates et Relais ne changent pas. Le bloc devient inerte après le 30 novembre ;
-- il peut rester en place ou être retiré en remettant la version précédente de _activer.
-- À APPLIQUER SEULEMENT APRÈS VALIDATION D'EWEN.

create or replace function public._activer(p_organisation uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare o organisation; quota int; bonus int; j date := prive.aujourdhui();
begin
  update organisation set statut = 'active', debut = j, anniversaire = coalesce(anniversaire, j)
    where id = p_organisation and statut = 'a_activer' returning * into o;
  if o is null then return; end if;
  select unites into quota from formule where offre_id = offre_active() and id = o.formule;
  insert into registre (organisation_id, periode, type, unites, motif) values (o.id, periode_org(o.id, j), 'credit', quota, 'Premier quota');
  if j between date '2026-11-23' and date '2026-11-30' and o.formule in ('essentiel', 'regulier', 'soutenu') and quota > 0 then
    bonus := ceil(quota * 0.5);
    insert into registre (organisation_id, periode, type, unites, source, motif) values (o.id, periode_org(o.id, j), 'ajustement', bonus, 'offert', 'Offre Black Week');
  end if;
  perform journaliser(o.id, 'activation', o.id::text, jsonb_build_object('anniversaire', o.anniversaire, 'bonus_black_week', coalesce(bonus, 0)));
end $function$;
