-- 18 nov 2026 : sortie de Brevo (compte clos).
-- Prospects de Fill : la liste vit ici (avant : listes Brevo « Prospects Fill » et « Prospects Fill · recrutement »).
create table if not exists public.fill_contact (
  email text primary key check (email = lower(email)),
  prenom text,
  nom text,
  segment text not null default 'prospects' check (segment in ('prospects', 'recrutement')),
  cree timestamptz not null default now(),
  lancement_le timestamptz,
  vague integer
);
alter table public.fill_contact enable row level security;
-- aucune politique : seules les fonctions serveur (clé secrète) y accèdent

-- Message de séquence en HTML complet (vagues de lancement) : la fonction envoi l'envoie tel quel, sans carte de signature.
alter table public.sequence_message add column if not exists html text;
