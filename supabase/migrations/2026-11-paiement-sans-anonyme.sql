-- Les quatre fonctions de paiement refusaient déjà tout appel hors administrateur ou serveur ;
-- on retire en plus le droit d'appel aux visiteurs non connectés (alerte de sécurité Supabase). Appliquée le 12 novembre 2026.
revoke execute on function public.commande_virement(uuid) from anon, public;
revoke execute on function public.mensualite_a_regler(text, text) from anon, public;
revoke execute on function public.mensualite_payee(uuid, text, text, numeric) from anon, public;
revoke execute on function public.mensualite_virement(uuid, text) from anon, public;
