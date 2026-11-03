-- 3 nov 2026 : SIRET de nouveau obligatoire à l'ouverture de l'Espace Fill (décision d'Ewen),
-- et reconnaissance d'un bon de commande Fill déjà signé en ligne sur dossiers.studioes.fr :
-- si l'adresse du référent a signé une commande Fill dans les 90 derniers jours, sa référence est reprise
-- comme numéro d'engagement, et l'accueil de l'espace ne redemande pas le bon (Fill valide ensuite, comme d'habitude).
CREATE OR REPLACE FUNCTION public.creer_compte(p_structure text, p_type text, p_siret text, p_nom text, p_fonction text, p_formule text, p_engagement integer, p_telephone text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare org uuid; mail text; ref text;
begin
  if auth.uid() is null then raise exception 'Connexion requise'; end if;
  if exists (select 1 from profil where id = auth.uid()) then raise exception 'Ce compte est déjà rattaché à une structure'; end if;
  if p_type not in ('collectivite','entreprise') then raise exception 'Type de structure inconnu'; end if;
  if not exists (select 1 from formule where offre_id = offre_active() and id = p_formule and id <> 'relais') then raise exception 'Formule inconnue'; end if;
  if p_engagement not in (6, 12) then raise exception 'Engagement de 6 ou 12 mois'; end if;
  if length(trim(p_structure)) < 2 or length(trim(p_nom)) < 2 then raise exception 'Nom manquant'; end if;
  if regexp_replace(coalesce(p_siret, ''), '\D', '', 'g') !~ '^\d{14}$' then raise exception 'SIRET invalide'; end if;
  select email into mail from auth.users where id = auth.uid();
  select nullif(fm.champs->>'reference', '') into ref from formulaire_message fm
    where fm.origine = 'https://dossiers.studioes.fr' and fm.champs->>'source' = 'commande' and fm.champs->>'marque' = 'fill'
      and lower(fm.champs->>'email') = lower(mail) and fm.recu_le > now() - interval '90 days'
    order by fm.recu_le desc limit 1;
  insert into organisation (nom, type, formule, debut, engagement_mois, statut, siret, numero_engagement)
    values (trim(p_structure), p_type, p_formule, prive.aujourdhui(), p_engagement, 'a_activer', regexp_replace(p_siret, '\D', '', 'g'), ref)
    returning id into org;
  insert into profil (id, nom, email, fonction, telephone, role, organisation_id) values (auth.uid(), trim(p_nom), mail, p_fonction, nullif(trim(coalesce(p_telephone, '')), ''), 'referent', org);
  perform journaliser(org, 'inscription', org::text, jsonb_build_object('formule', p_formule, 'engagement', p_engagement, 'commande_signee', ref));
  return org;
end $function$;
-- renseigner_siret() n’est plus utilisée : appel retiré aux comptes connectés (non supprimée).
REVOKE EXECUTE ON FUNCTION public.renseigner_siret(text) FROM authenticated;
