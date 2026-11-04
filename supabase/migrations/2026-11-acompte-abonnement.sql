-- Site au mois (Studio ES) : premier mois réglé par carte à la commande, abonnement Stripe arrêté à fin_engagement
alter table public.acompte
  add column if not exists mensuel numeric not null default 0,
  add column if not exists engagement integer,
  add column if not exists stripe_abonnement text,
  add column if not exists fin_engagement timestamptz;
-- Paiement en 6, 12 ou 24 fois sans frais : suivi du site prélevé avec les mensualités, puis seul
alter table public.acompte add column if not exists suivi numeric not null default 0;
