-- 5 novembre 2026 : une commande réglée entièrement en plusieurs fois n'a pas d'acompte (0 €).
-- L'ancienne règle « montant > 0 » refusait l'enregistrement : « Enregistrement impossible » à chaque commande en 6, 12 ou 24 fois.
alter table public.acompte drop constraint acompte_montant_check;
alter table public.acompte add constraint acompte_montant_check check (montant > 0 or (montant = 0 and mensuel > 0));
