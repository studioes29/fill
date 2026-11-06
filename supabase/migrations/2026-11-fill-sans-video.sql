-- Appliquée le 6 novembre 2026 : Fill ne propose plus de vidéo.
delete from public.prestation where id = 'video' and not exists (select 1 from public.demande_ligne where prestation = 'video');
