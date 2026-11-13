-- Offre du 13 novembre 2026 : catalogue en dix familles (50 livrables), paliers 15 / 35 / 75 unités, Relais 85 par mois ou 20 par semaine,
-- unité supplémentaire à 39 €, reportage photo à 13 unités, création en 3 jours ouvrés pour Soutenu et Relais.
-- NON APPLIQUÉE : à lancer en même temps que la mise en ligne du site et de l'Espace (fusion dans main) et le redéploiement
-- des fonctions apercu, atelier, bilan, notifier et pilote. Les demandes déjà déposées restent rattachées à l'offre précédente.
begin;
alter table public.prestation drop constraint if exists prestation_categorie_check;
alter table public.prestation add constraint prestation_categorie_check check (categorie = any (array['publier','creer','terrain','reseaux','site','lettres','presse','redaction','petits','affiches','edition','photo','fabrication']));
alter table public.formule add column if not exists delai_creation_j integer;
insert into public.offre_version (id, unite_sup, urgence_unites, delai_creation_j, engagement_mois, engagement_long, active)
  values ('2026-11-13', 39, 1, 5, 6, 6, false);
insert into public.formule (offre_id, id, nom, prix, unites, delai_j, delai_creation_j, urgences_incluses, mise_en_place, rang, prix_semaine, unites_semaine) values
  ('2026-11-13', 'essentiel', 'Essentiel', 490, 15, 2, 5, 0, 0, 0, null, null),
  ('2026-11-13', 'regulier', 'Régulier', 990, 35, 2, 5, 0, 0, 1, null, null),
  ('2026-11-13', 'soutenu', 'Soutenu', 1890, 75, 1, 3, 2, 0, 2, null, null),
  ('2026-11-13', 'relais', 'Relais', 2490, 85, 1, 3, 1000, 0, 3, 690, 20);
insert into public.prestation (offre_id, id, categorie, nom, unites, nature, quantite_max, formule_min) values
  ('2026-11-13', 'post', 'reseaux', 'Publication', 1, 'courant', 40, null),
  ('2026-11-13', 'story', 'reseaux', 'Story', 1, 'courant', 20, null),
  ('2026-11-13', 'habillage', 'reseaux', 'Habillage des comptes', 2, 'creation', 2, null),
  ('2026-11-13', 'videoligne', 'reseaux', 'Mise en ligne d’une vidéo', 1, 'courant', 10, null),
  ('2026-11-13', 'moder', 'reseaux', 'Modération, par mois', 4, 'courant', 1, null),
  ('2026-11-13', 'actu', 'site', 'Actualité', 1, 'courant', 30, null),
  ('2026-11-13', 'agenda', 'site', 'Événement à l’agenda', 1, 'courant', 30, null),
  ('2026-11-13', 'majpage', 'site', 'Mise à jour d’une page', 1, 'courant', 20, null),
  ('2026-11-13', 'page', 'site', 'Nouvelle page', 3, 'creation', 6, null),
  ('2026-11-13', 'formulaire', 'site', 'Formulaire en ligne', 2, 'creation', 6, null),
  ('2026-11-13', 'bandeau', 'site', 'Bandeau d’accueil', 1, 'courant', 10, null),
  ('2026-11-13', 'news', 'lettres', 'Lettre d’information', 3, 'creation', 6, null),
  ('2026-11-13', 'newsint', 'lettres', 'Lettre interne', 3, 'creation', 6, null),
  ('2026-11-13', 'modelelettre', 'lettres', 'Modèle de lettre', 3, 'creation', 2, null),
  ('2026-11-13', 'presse', 'presse', 'Communiqué de presse', 2, 'courant', 8, null),
  ('2026-11-13', 'invitpresse', 'presse', 'Invitation presse', 1, 'courant', 8, null),
  ('2026-11-13', 'dossierpresse', 'presse', 'Dossier de presse', 5, 'creation', 3, null),
  ('2026-11-13', 'annonce', 'presse', 'Annonce dans les agendas des médias', 1, 'courant', 20, null),
  ('2026-11-13', 'revue', 'presse', 'Revue de presse du mois', 2, 'courant', 1, null),
  ('2026-11-13', 'article', 'redaction', 'Article', 2, 'courant', 12, null),
  ('2026-11-13', 'edito', 'redaction', 'Édito', 2, 'courant', 6, null),
  ('2026-11-13', 'discours', 'redaction', 'Discours', 2, 'courant', 6, null),
  ('2026-11-13', 'relecture', 'redaction', 'Relecture et correction', 1, 'courant', 12, null),
  ('2026-11-13', 'invitation', 'petits', 'Invitation ou carton', 2, 'creation', 6, null),
  ('2026-11-13', 'cartevisite', 'petits', 'Carte de visite', 2, 'creation', 6, null),
  ('2026-11-13', 'voeux', 'petits', 'Carte de vœux', 2, 'creation', 3, null),
  ('2026-11-13', 'menu', 'petits', 'Menu ou carte', 2, 'creation', 6, null),
  ('2026-11-13', 'signature', 'petits', 'Signature de mail', 2, 'creation', 3, null),
  ('2026-11-13', 'couverture', 'petits', 'Couverture de dossier', 2, 'creation', 6, null),
  ('2026-11-13', 'bon', 'petits', 'Bon d’achat ou carte cadeau', 2, 'creation', 6, null),
  ('2026-11-13', 'chevalet', 'petits', 'Chevalet, étiquette ou badge', 2, 'creation', 6, null),
  ('2026-11-13', 'affiche', 'affiches', 'Affiche', 4, 'creation', 6, null),
  ('2026-11-13', 'gabarit', 'affiches', 'Déclinaison d’un visuel existant', 1, 'courant', 20, null),
  ('2026-11-13', 'flyer', 'affiches', 'Flyer', 3, 'creation', 6, null),
  ('2026-11-13', 'depliant', 'affiches', 'Dépliant', 6, 'creation', 4, null),
  ('2026-11-13', 'grandformat', 'affiches', 'Grand format', 4, 'creation', 6, null),
  ('2026-11-13', 'plan', 'affiches', 'Plan ou carte illustrée', 6, 'creation', 3, null),
  ('2026-11-13', 'objet', 'affiches', 'Marquage d’objet', 2, 'creation', 6, null),
  ('2026-11-13', 'identite', 'affiches', 'Identité d’un événement', 8, 'creation', 2, null),
  ('2026-11-13', 'bulletin', 'edition', 'Bulletin ou magazine, par page', 2, 'planifie', 12, null),
  ('2026-11-13', 'doclong', 'edition', 'Document long sur modèle existant, par page', 1, 'creation', 40, null),
  ('2026-11-13', 'diaporama', 'edition', 'Diaporama', 3, 'creation', 6, null),
  ('2026-11-13', 'modeledoc', 'edition', 'Modèle de document', 3, 'creation', 4, null),
  ('2026-11-13', 'formulairepdf', 'edition', 'Formulaire à remplir', 2, 'creation', 6, null),
  ('2026-11-13', 'photo', 'photo', 'Reportage photo', 13, 'planifie', 3, 'regulier'),
  ('2026-11-13', 'retouche', 'photo', 'Retouche d’un lot de photos', 1, 'courant', 10, null),
  ('2026-11-13', 'montage', 'photo', 'Montage vidéo court', 3, 'creation', 6, null),
  ('2026-11-13', 'animation', 'photo', 'Animation d’un visuel', 2, 'creation', 6, null),
  ('2026-11-13', 'impression', 'fabrication', 'Devis et suivi d’impression', 1, 'courant', 10, null),
  ('2026-11-13', 'prestataire', 'fabrication', 'Coordination d’un prestataire', 1, 'courant', 10, null);
-- le délai de création se lit d'abord sur la formule (3 jours en Soutenu et Relais), sinon sur l'offre
do $$
declare def text;
begin
  select pg_get_functiondef('public.confirmer_demande'::regproc) into def;
  if position('coalesce(fo.delai_creation_j, off.delai_creation_j)' in def) = 0 then
    if position('then off.delai_creation_j' in def) = 0 then raise exception 'confirmer_demande : ligne du délai de création introuvable'; end if;
    execute replace(def, 'then off.delai_creation_j', 'then coalesce(fo.delai_creation_j, off.delai_creation_j)');
  end if;
end $$;
update public.offre_version set active = (id = '2026-11-13');
commit;
