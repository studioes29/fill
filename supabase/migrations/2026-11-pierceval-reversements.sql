-- Cartes cadeaux Pierceval : avis au salon contrôlé et reversement mensuel suivi dans Hors-champ.
-- Les paiements arrivent sur le compte Stripe de Studio ES ; Ewen reverse à Pierceval, par virement,
-- le premier jour du mois suivant, la somme des cartes payées dans le mois (montant payé par le client).

alter table public.carte_cadeau add column if not exists salon_prevenu_le timestamptz;
-- la carte du 19 novembre 2026 est partie avant ce suivi : son avis sera renvoyé (avec copie à Ewen)

create table if not exists public.pierceval_reversement (
  periode text primary key check (periode ~ '^\d{4}-\d{2}$'),
  montant numeric(10,2) not null,
  cartes int not null,
  vire_le timestamptz not null default now()
);
alter table public.pierceval_reversement enable row level security;
revoke all on public.pierceval_reversement from anon, authenticated;

-- Ce que Hors-champ doit montrer : reversements dus (mois clos non virés), mois en cours, avis non partis.
create or replace function public.pierceval_etat()
returns jsonb language sql stable security definer set search_path to 'public' as $$
  with c as (
    select id, code, montant, beneficiaire, statut, payee_le, salon_prevenu_le,
           to_char(payee_le at time zone 'Europe/Paris', 'YYYY-MM') as periode
    from carte_cadeau where statut in ('valide','utilisee') and payee_le is not null
  ), mois as (
    select periode, sum(montant) montant, count(*)::int cartes from c group by periode
  )
  select jsonb_build_object(
    'mois_courant', to_char(now() at time zone 'Europe/Paris', 'YYYY-MM'),
    'dus', coalesce((select jsonb_agg(jsonb_build_object('periode', m.periode, 'montant', m.montant, 'cartes', m.cartes,
              'echeance', (to_date(m.periode || '-01', 'YYYY-MM-DD') + interval '1 month')::date) order by m.periode)
            from mois m left join pierceval_reversement r using (periode)
            where r.periode is null and m.periode < to_char(now() at time zone 'Europe/Paris', 'YYYY-MM')), '[]'::jsonb),
    'en_cours', (select jsonb_build_object('periode', m.periode, 'montant', m.montant, 'cartes', m.cartes) from mois m
            where m.periode = to_char(now() at time zone 'Europe/Paris', 'YYYY-MM')),
    'sans_avis', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'code', code, 'montant', montant, 'pour', beneficiaire, 'payee_le', payee_le) order by payee_le)
            from c where salon_prevenu_le is null and payee_le < now() - interval '10 minutes'), '[]'::jsonb),
    'vires', coalesce((select jsonb_agg(to_jsonb(r) order by r.periode desc) from (select * from pierceval_reversement order by periode desc limit 6) r), '[]'::jsonb)
  )
$$;

-- « Virement fait » dans Hors-champ : fige le montant du mois au moment du virement
create or replace function public.pierceval_virement_fait(p_periode text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare m numeric; n int;
begin
  if p_periode >= to_char(now() at time zone 'Europe/Paris', 'YYYY-MM') then raise exception 'Le mois % n''est pas clos', p_periode; end if;
  select coalesce(sum(montant),0), count(*) into m, n from carte_cadeau
   where statut in ('valide','utilisee') and to_char(payee_le at time zone 'Europe/Paris', 'YYYY-MM') = p_periode;
  if n = 0 then raise exception 'Aucune carte payée en %', p_periode; end if;
  insert into pierceval_reversement(periode, montant, cartes) values (p_periode, m, n)
    on conflict (periode) do update set montant = excluded.montant, cartes = excluded.cartes, vire_le = now();
  return jsonb_build_object('periode', p_periode, 'montant', m, 'cartes', n);
end $$;

create or replace function public.pierceval_virement_annuler(p_periode text)
returns void language sql security definer set search_path to 'public' as $$
  delete from pierceval_reversement where periode = p_periode
$$;

-- Renvoi de l'avis au salon (copie à Ewen), par la fonction carte-cadeau
create or replace function public.pierceval_renvoyer_avis(p_id uuid)
returns bigint language sql security definer set search_path to 'public' as $$
  select net.http_post(
    url := 'https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/carte-cadeau',
    headers := jsonb_build_object('Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'jeton_pilote'), 'Content-Type', 'application/json'),
    body := jsonb_build_object('action', 'renvoyer-avis', 'id', p_id), timeout_milliseconds := 20000)
$$;

revoke all on function public.pierceval_etat() from public, anon, authenticated;
revoke all on function public.pierceval_virement_fait(text) from public, anon, authenticated;
revoke all on function public.pierceval_virement_annuler(text) from public, anon, authenticated;
revoke all on function public.pierceval_renvoyer_avis(uuid) from public, anon, authenticated;
