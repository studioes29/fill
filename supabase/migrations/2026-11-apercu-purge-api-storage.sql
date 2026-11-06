-- Appliquée le 6 novembre 2026. La purge SQL des aperçus échouait (suppression directe dans storage.objects refusée) :
-- elle passe désormais par l'action « purger » de la fonction apercu (API Storage). Table de comptage des recherches Google.
create table if not exists public.apercu_recherche (ip text not null, t timestamptz not null default now());
create index if not exists apercu_recherche_ip_t on public.apercu_recherche (ip, t);
alter table public.apercu_recherche enable row level security;
select cron.alter_job((select jobid from cron.job where jobname = 'apercu-purge'),
  command := $c$ select net.http_post(url := 'https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/apercu', headers := jsonb_build_object('Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'jeton_pilote'), 'Content-Type', 'application/json'), body := '{"action":"purger"}'::jsonb, timeout_milliseconds := 60000) $c$);
