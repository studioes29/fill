# Fonctions serveur Supabase (projet nfnbseonwgmtouxsaajd)

## pilote

`functions/pilote/index.ts` et `functions/_partage/` sont la source de la fonction `pilote`, reconstituée le 30 octobre 2026 depuis la version déployée (version 3). Supabase ne conservait que le code assemblé (un seul fichier produit par esbuild) ; il a été redécoupé en modules. Contrôle : assemblé avec la même commande, ce code (commit f67a808) redonnait exactement le fichier déployé, au caractère près.

Version 4 (30 octobre 2026) : le pré-contrôle des unités raisonne sur la période d'abonnement de chaque organisation (date anniversaire du premier paiement, fonctions SQL `periode_org`, `debut_periode_org`, `fin_periode_org`) au lieu du mois civil : unités disponibles, urgences déjà utilisées et unités engagées par l'auteur. Le reste est inchangé (la facturation reste au mois civil).

Le pilote est appelé par la tâche planifiée `fill-pilote` (pg_cron et pg_net, toutes les quinze minutes en journée) avec la clé secrète ou un jeton vérifié par `verifier_jeton_pilote`. Il confirme les demandes déposées qui tiennent (puis lance l'atelier), relance les clients en attente et émet les factures le premier jour ouvré du mois, selon les réglages de la table `parametre`.

`_partage/regles/` reprend les règles de l'Espace (calendrier, offre, estimation, charge, pilote, registre). L'Espace en a sa propre copie dans `espace-src/src/regles/` : une règle modifiée d'un côté doit l'être de l'autre.

### Assembler et déployer

Supabase accepte un seul fichier. Depuis la racine du dépôt :

```
npx esbuild@0.24.2 supabase/functions/pilote/index.ts --bundle --format=esm --platform=neutral --target=es2022 \
  --outfile=/tmp/pilote.ts "--external:npm:*" "--external:jsr:*" "--external:https:*" --legal-comments=none
```

puis déployer `/tmp/pilote.ts` comme `index.ts` de la fonction `pilote`, sans vérification du jeton JWT (`verify_jwt: false` : la fonction contrôle elle-même la clé).

## Autres fonctions

`alerte`, `paiement`, `stripe-webhook`, `inviter`, `atelier`, `notifier`, `carte-cadeau`, `acompte`, `parcours`, `formulaire`, `mensualite`, `envoi` ne sont pas encore rangées ici. Celles qui ont été écrites avec la même méthode (`atelier`, `notifier`, `inviter`, `alerte`, `paiement`) n'existent elles aussi qu'assemblées chez Supabase : à reconstituer de la même façon avant leur prochaine modification.
