-- 25 novembre 2026 : « Document long sur modèle existant, par page » devient
-- « Brochure ou programme sur modèle existant, par page » (1 unité par page, inchangé).
-- Couvre les brochures de saison et programmes repris dans une maquette existante.
update public.prestation
set nom = 'Brochure ou programme sur modèle existant, par page'
where id = 'doclong' and nom = 'Document long sur modèle existant, par page';
