-- SIRET facultatif à l'ouverture de l'Espace Fill (3 nov 2026).
-- Rétrocompatible : un SIRET fourni est toujours contrôlé (14 chiffres) ; vide, il est enregistré à null
-- et le référent peut le donner plus tard avec renseigner_siret().
CREATE OR REPLACE FUNCTION public.creer_compte(p_structure text, p_type text, p_siret text, p_nom text, p_fonction text, p_formule text, p_engagement integer, p_telephone text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare org uuid; mail text; s text := nullif(regexp_replace(coalesce(p_siret, ''), '\D', '', 'g'), '');
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  if exists (select 1 from profil where id = auth.uid()) then raise exception 'Ce compte est déjà rattaché à une structure'; end if;
  if p_type not in ('collectivite','entreprise') then raise exception 'Type de structure inconnu'; end if;
  if not exists (select 1 from formule where offre_id = offre_active() and id = p_formule and id <> 'relais') then raise exception 'Formule inconnue'; end if;
  if p_engagement not in (6, 12) then raise exception 'Engagement de 6 ou 12 mois'; end if;
  if length(trim(p_structure)) < 2 or length(trim(p_nom)) < 2 then raise exception 'Nom manquant'; end if;
  if s is not null and s !~ '^\d{14}$' then raise exception 'SIRET invalide'; end if;
  select email into mail from auth.users where id = auth.uid();
  insert into organisation (nom, type, formule, debut, engagement_mois, statut, siret)
    values (trim(p_structure), p_type, p_formule, prive.aujourdhui(), p_engagement, 'a_activer', s)
    returning id into org;
  insert into profil (id, nom, email, fonction, telephone, role, organisation_id) values (auth.uid(), trim(p_nom), mail, p_fonction, nullif(trim(coalesce(p_telephone, '')), ''), 'referent', org);
  perform journaliser(org, 'inscription', org::text, jsonb_build_object('formule', p_formule, 'engagement', p_engagement));
  return org;
end $function$;

CREATE OR REPLACE FUNCTION public.renseigner_siret(p_siret text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare moi profil; s text := regexp_replace(coalesce(p_siret, ''), '\D', '', 'g');
begin
  select * into moi from profil where id = auth.uid() and actif;
  if moi is null or moi.role <> 'referent' then raise exception 'Seul le référent renseigne le SIRET'; end if;
  if s !~ '^\d{14}$' then raise exception 'SIRET invalide'; end if;
  update organisation set siret = s where id = moi.organisation_id;
  perform journaliser(moi.organisation_id, 'siret', moi.organisation_id::text, jsonb_build_object('siret', s));
end $function$;
REVOKE ALL ON FUNCTION public.renseigner_siret(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.renseigner_siret(text) TO authenticated;
