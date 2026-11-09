-- 10 nov 2026 : une réponse à un prospect part de contact@studioes.fr, dans le fil du premier message.
-- La séquence de réponse (type « client », fiche « <id>:reponse », créée par Hors-champ) note dans suite_de la fiche
-- de la séquence de prospection à laquelle elle fait suite ; sequence_dus reprend alors l'identifiant Brevo du dernier
-- message envoyé de cette séquence, que la fonction envoi pose en In-Reply-To et References.
-- Déjà appliquée sur le projet nfnbseonwgmtouxsaajd (migration « reponse_dans_le_fil »).
alter table public.sequence add column if not exists suite_de text;

-- sequence_planifier : identique à la version précédente, plus la colonne suite_de (p->>'suite_de') à l'insertion de la séquence.
-- sequence_dus : la colonne « precedent » devient
--   coalesce(<dernier message envoyé de la même séquence>,
--            <dernier message envoyé de la séquence dont la fiche vaut suite_de>).
-- Le texte complet des deux fonctions se relit dans la base : select pg_get_functiondef('public.sequence_planifier(jsonb)'::regprocedure),
-- pg_get_functiondef('public.sequence_dus(integer)'::regprocedure).
