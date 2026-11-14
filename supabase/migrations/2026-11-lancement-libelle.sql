-- Offre de lancement 2026 (ex-« Black Week ») : seul le libellé visible du bonus change.
-- Le relevé des unités du client affiche « Offre de lancement » au lieu de « Offre Black Week ».
-- Dates (23 au 30 novembre 2026), formules concernées et calcul (+50 %, arrondi au supérieur) inchangés.
-- À appliquer après validation d'Ewen.

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
    insert into registre (organisation_id, periode, type, unites, source, motif) values (o.id, periode_org(o.id, j), 'ajustement', bonus, 'offert', 'Offre de lancement');
  end if;
  perform journaliser(o.id, 'activation', o.id::text, jsonb_build_object('anniversaire', o.anniversaire, 'bonus_black_week', coalesce(bonus, 0)));
end $function$;
