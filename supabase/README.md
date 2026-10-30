# Fonctions serveur Supabase (projet nfnbseonwgmtouxsaajd)

Ce dossier contient la source de toutes les fonctions serveur (Edge Functions) du projet Supabase de Fill et de Studio ES, rangée le 30 octobre 2026 à partir des versions déployées. Supabase ne garde que le fichier déployé ; c'est désormais ce dossier qui fait foi.

## Deux sortes de fonctions

- **En modules** (`alerte`, `atelier`, `inviter`, `notifier`, `paiement`, `pilote`) : elles importent des modules communs de `functions/_partage/` (clés, gabarit des e-mails, offre, règles). Supabase reçoit un seul fichier, assemblé par esbuild. Le fichier déployé gardait le chemin de chaque module : il a été redécoupé selon ces chemins.
- **En un seul fichier** (`acompte`, `carte-cadeau`, `envoi`, `formulaire`, `mensualite`, `parcours`, `stripe-webhook`) : écrites directement en TypeScript et déployées telles quelles. Le fichier rangé ici est le fichier déployé.

## Preuve que la source correspond au déployé

`deploye/` contient une copie de chaque fichier tel qu'il tourne chez Supabase (relevé le 30 octobre 2026). `npm run verifier` (après `npm install` dans ce dossier) assemble chaque fonction et la compare à cette copie : les 13 fonctions sont identiques, au caractère près. Un écart après une modification voulue est normal : après déploiement, on remplace la copie dans `deploye/`.

## Les fonctions

Toutes sont déployées sans vérification du jeton JWT par Supabase (`verify_jwt: false`) : chacune contrôle elle-même qui l'appelle (session de l'utilisateur, clé secrète, jeton du pilote, signature Stripe ou origine du site).

| Fonction | Rôle | Qui l'appelle | Contrôle d'accès | Secrets et variables lus |
| --- | --- | --- | --- | --- |
| `pilote` | Pilote automatique de Fill : confirme les demandes qui tiennent (puis lance `atelier`), relance les clients, émet les factures le premier jour ouvré du mois | tâche planifiée `fill-pilote` (toutes les 15 min, 6 h à 19 h UTC, en semaine) | clé secrète ou jeton `verifier_jeton_pilote` | clés Supabase, `SITE_URL` |
| `atelier` | Premier jet des textes d'une demande, rédigé avec Claude, enregistré comme brouillon | `pilote`, ou Fill depuis la fiche | clé secrète, ou utilisateur `est_admin` | clés Supabase, `ANTHROPIC_API_KEY`, `ATELIER_MODELE` (facultatif), `SITE_URL` |
| `notifier` | E-mails de suivi de l'Espace Fill (dépôt, statut, message, premier jet, crédit d'unités, accès aux comptes) | l'Espace, `pilote`, `stripe-webhook` | clé secrète ou session active | clés Supabase, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL`, `SITE_URL` |
| `alerte` | Alerte à Fill à l'ouverture d'un compte (et mail de bienvenue) ou au dépôt d'un bon de commande | l'Espace | session de l'utilisateur | clés Supabase, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL`, `SITE_URL` |
| `inviter` | Invitation d'un collègue par le référent (compte, profil, e-mail) | l'Espace (écran Équipe) | session d'un référent actif | clés Supabase, `SITE_URL` |
| `paiement` | Session de paiement Stripe : premier mois d'une entreprise, commande d'unités | l'Espace | session de l'utilisateur | clés Supabase, `STRIPE_SECRET_KEY`, `SITE_URL` |
| `mensualite` | Lien de paiement personnel des mensualités (période anniversaire), alerte de règlement et récapitulatif des mensualités en attente | lien envoyé au client, `stripe-webhook`, `traiter_echeances` (base) | public pour le lien ; clé secrète ou jeton pilote pour le reste | clés Supabase, `STRIPE_SECRET_KEY`, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL`, `SITE_URL` |
| `stripe-webhook` | Webhook Stripe unique : trie les paiements (Fill, mensualités, acomptes Studio ES, cartes cadeaux Pierceval) | Stripe | signature Stripe | clés Supabase, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| `acompte` | Acomptes de 30 % des devis Studio ES (carte ou virement), confirmation et e-mails | dossiers.studioes.fr | origine du site, contrôles de saisie | clé secrète Supabase, `STRIPE_SECRET_KEY`, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL` |
| `carte-cadeau` | Cartes cadeaux Pierceval Tattoo : achat, vérification, passage en « utilisée » | piercevaltattoo.fr | code du salon pour l'utilisation, limite d'essais par adresse IP | clé secrète Supabase, `STRIPE_SECRET_KEY`, `BREVO_API_KEY`, `CODE_SALON`, `PIERCEVAL_EMAIL`, `EXPEDITEUR_EMAIL` |
| `formulaire` | Formulaires des sites (à la place de FormSubmit) : enregistrement puis envoi par Brevo | studioes.fr, fill.studioes.fr, dossiers.studioes.fr, piercevaltattoo.fr | origine du site, limite d'envois par adresse IP | clé secrète Supabase, `BREVO_API_KEY`, `ALERTE_EMAIL`, `PIERCEVAL_EMAIL`, `EXPEDITEUR_EMAIL` |
| `parcours` | Mails de parcours (fin de mission, relance à trois mois, avis Google), prospects Brevo, campagne de lancement par vagues, liens « stop » | tâche planifiée `fill-parcours-mails` (9 h 05 UTC, en semaine), Hors-champ ; liens signés pour les visiteurs | clé secrète ou jeton pilote ; signature HMAC pour les liens | clé secrète Supabase, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL` |
| `envoi` | Envois automatiques de Hors-champ (séquences de prospection et de suivi) via Brevo, avec plafonds | tâche planifiée `horschamp-envois` (toutes les 10 min, 6 h à 17 h UTC, en semaine) | clé secrète ou jeton pilote | clé secrète Supabase, `BREVO_API_KEY`, `EXPEDITEUR_EMAIL` |

Clés Supabase : `CLE_SECRETE` et `CLE_PUBLIABLE` si elles sont posées dans les secrets, sinon les variables fournies par Supabase (`SUPABASE_SECRET_KEY(S)`, `SUPABASE_PUBLISHABLE_KEY(S)`, puis les anciennes `SUPABASE_SERVICE_ROLE_KEY` et `SUPABASE_ANON_KEY`). `SUPABASE_URL` est fournie par Supabase. Les secrets se règlent dans le tableau de bord Supabase (Edge Functions, Secrets) ; ils ne sont jamais écrits dans ce dépôt.

## Modules communs (`functions/_partage/`)

- `cles.ts` : lecture des clés, adresse de l'Espace (`SITE`) et en-têtes CORS ;
- `courriel.ts` : gabarit HTML des e-mails de Fill (`alerte`, `notifier`) ;
- `offre.json` et `regles/offre.ts` : l'offre publiée (formules, catalogue, délais) ;
- `regles/` : calendrier et jours ouvrés, estimation, charge, pilote, registre des unités, cycle des demandes. L'Espace en a sa propre copie dans `espace-src/src/regles/` : une règle modifiée d'un côté doit l'être de l'autre.

Une réserve sur ces modules : esbuild retire les commentaires et les types en assemblant, ils ne sont donc pas revenus. Les noms suffixés d'un chiffre (`EQUIPE2`, `html2`, `o2`) sont ceux que l'assemblage avait donnés ; les laisser tels quels garantit un fichier identique.

## Modifier et déployer

1. Modifier la source dans `functions/`.
2. `npm run verifier` : la fonction modifiée apparaît en écart, les autres doivent rester identiques. Le fichier à déployer est `.assemblees/<fonction>.ts`.
3. Déployer ce fichier comme `index.ts` de la fonction, avec `verify_jwt: false`. Avec la CLI Supabase, `supabase functions deploy <fonction> --no-verify-jwt` assemble lui-même les modules `_partage`.
4. Copier `.assemblees/<fonction>.ts` dans `deploye/` et faire un commit.

Changer un module commun touche toutes les fonctions qui l'importent : elles sont toutes à redéployer.

## Historique

- `pilote`, version 4 (30 octobre 2026) : le pré-contrôle des unités raisonne sur la période d'abonnement de chaque organisation (date anniversaire du premier paiement, fonctions SQL `periode_org`, `debut_periode_org`, `fin_periode_org`) au lieu du mois civil. La version 3, reconstituée à l'identique, est au commit f67a808.
