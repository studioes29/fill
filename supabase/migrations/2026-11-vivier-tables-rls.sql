-- 9 nov 2026 : deux tables de travail du vivier étaient lisibles avec la clé publique (pas de sécurité par ligne).
-- Elles ne servent qu'aux tâches planifiées de la base : accès réservé au serveur.
-- Déjà appliquée sur le projet nfnbseonwgmtouxsaajd (migration « vivier_tables_rls »).
alter table public.vivier_google_file enable row level security;
alter table public.vivier_creation_req enable row level security;
revoke all on public.vivier_google_file from anon, authenticated;
revoke all on public.vivier_creation_req from anon, authenticated;
