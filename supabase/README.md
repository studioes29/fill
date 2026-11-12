# Fonctions serveur Supabase (projet nfnbseonwgmtouxsaajd)

Ce dossier contient la source de toutes les fonctions serveur (Edge Functions) du projet Supabase de Fill et de Studio ES, rangée le 30 octobre 2026 à partir des versions déployées. Supabase ne garde que le fichier déployé ; c'est désormais ce dossier qui fait foi.

## Deux sortes de fonctions

- **En modules** (`alerte`, `atelier`, `inviter`, `notifier`, `paiement`, `pilote`) : elles importent des modules communs de `functions/_partage/` (clés, gabarit des e-mails, offre, règles). Supabase reçoit un seul fichier, assemblé par esbuild. Le fichier déployé gardait le chemin de chaque module : il a été redécoupé selon ces chemins.
- **En un seul fichier** (`acompte`, `carte-cadeau`, `desinscription`, `envoi`, `formulaire`, `mensualite`, `parcours`, `stripe-webhook`) : écrites directement en TypeScript et déployées telles quelles. Le fichier rangé ici est le fichier déployé.

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
| `relecture` | Relecture par lien : relire et valider un livrable sans compte (page `espace/relecture/`), demander un avis ou confier la validation | la page de relecture (jeton du lien, en POST seulement), l'Espace (action `creer`) | jeton de 256 bits dont la base ne garde que l'empreinte ; session d'un référent pour `creer` | clés Supabase, `BREVO_API_KEY`, `EXPEDITEUR_EMAIL`, `SITE_URL` |
| `bilan` | Mail mensuel unique « Votre mois avec Fill » : fige le bilan de chaque période d'abonnement close (chiffres et trois suggestions), l'envoie au référent une seule fois, après l'accord de Fill dans Hors-champ ; sert la page `espace/bilan/` | tâche planifiée `fill-bilan` (à créer : un passage par jour ouvré), `bilan_valider` (accord donné dans Hors-champ, par pg_net), la page de bilan (jeton du lien, en POST seulement) | clé secrète ou jeton `verifier_jeton_pilote` pour la tâche ; jeton de 256 bits dont la base ne garde que l'empreinte pour la page | clés Supabase, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL`, `SITE_URL` |
| `reception` | Adresse de transfert : reçoit de Brevo les mails envoyés à `nom-de-la-structure@demandes.studioes.fr`. Le mail d'un membre reconnu devient une demande déposée (règles de `deposer_demande`), sinon réponse courte et lien vers la demande pré-remplie. Action d'administration `webhook` : vérifie ou crée le webhook chez Brevo | Brevo (webhook « inbound ») ; Fill pour l'action `webhook` | secret `RECEPTION_CLE` (dans l'adresse du webhook ou en en-tête) ; clé secrète ou jeton `verifier_jeton_pilote` pour `webhook` | clés Supabase, `BREVO_API_KEY`, `RECEPTION_CLE`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL`, `SITE_URL`, `DOMAINE_RECEPTION` et `RECEPTION_ORIGINE` (facultatifs) |
| `inviter` | Invitation d'un collègue par le référent (compte, profil, e-mail) | l'Espace (écran Équipe) | session d'un référent actif | clés Supabase, `SITE_URL` |
| `paiement` | Session de paiement Stripe : premier mois d'une entreprise, commande d'unités | l'Espace | session de l'utilisateur | clés Supabase, `STRIPE_SECRET_KEY`, `SITE_URL` |
| `mensualite` | Lien de paiement personnel des mensualités (période anniversaire), alerte de règlement et récapitulatif des mensualités en attente | lien envoyé au client, `stripe-webhook`, `traiter_echeances` (base) | public pour le lien ; clé secrète ou jeton pilote pour le reste | clés Supabase, `STRIPE_SECRET_KEY`, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL`, `SITE_URL` |
| `stripe-webhook` | Webhook Stripe unique : trie les paiements (Fill, mensualités, acomptes Studio ES, cartes cadeaux Pierceval) | Stripe | signature Stripe | clés Supabase, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| `acompte` | Acomptes de 30 % des devis Studio ES (carte ou virement), confirmation et e-mails | dossiers.studioes.fr | origine du site, contrôles de saisie | clé secrète Supabase, `STRIPE_SECRET_KEY`, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL` |
| `carte-cadeau` | Cartes cadeaux Pierceval Tattoo : achat, vérification, passage en « utilisée » | piercevaltattoo.fr | code du salon pour l'utilisation, limite d'essais par adresse IP | clé secrète Supabase, `STRIPE_SECRET_KEY`, `BREVO_API_KEY`, `CODE_SALON`, `PIERCEVAL_EMAIL`, `EXPEDITEUR_EMAIL` |
| `formulaire` | Formulaires des sites (à la place de FormSubmit) : enregistrement puis envoi par Brevo | studioes.fr, fill.studioes.fr, dossiers.studioes.fr, piercevaltattoo.fr | origine du site, limite d'envois par adresse IP | clé secrète Supabase, `BREVO_API_KEY`, `ALERTE_EMAIL`, `PIERCEVAL_EMAIL`, `EXPEDITEUR_EMAIL` |
| `parcours` | Mails de parcours (fin de mission, relance à trois mois, avis Google), prospects Brevo, campagne de lancement par vagues, liens « stop » | tâche planifiée `fill-parcours-mails` (9 h 05 UTC, en semaine), Hors-champ ; liens signés pour les visiteurs | clé secrète ou jeton pilote ; signature HMAC pour les liens | clé secrète Supabase, `BREVO_API_KEY`, `ALERTE_EMAIL`, `EXPEDITEUR_EMAIL` |
| `envoi` | Envois automatiques de Hors-champ (séquences de prospection et de suivi) via Brevo, avec plafonds | tâche planifiée `horschamp-envois` (toutes les 10 min, 6 h à 17 h UTC, en semaine) | clé secrète ou jeton pilote | clé secrète Supabase, `BREVO_API_KEY`, `EXPEDITEUR_EMAIL` |
| `desinscription` | Lien « ne plus recevoir » des envois automatiques : un GET renvoie vers la page de confirmation https://studioes.fr/desinscription/ (dépôt `site`), seul un POST inscrit l'adresse (bouton de la page ou désabonnement en un clic des messageries), par `sequence_desinscrire` | liens des mails de prospection (`envoi`), page de confirmation du site | signature HMAC du lien ; POST accepté depuis studioes.fr | clé secrète Supabase |

Clés Supabase : `CLE_SECRETE` et `CLE_PUBLIABLE` si elles sont posées dans les secrets, sinon les variables fournies par Supabase (`SUPABASE_SECRET_KEY(S)`, `SUPABASE_PUBLISHABLE_KEY(S)`, puis les anciennes `SUPABASE_SERVICE_ROLE_KEY` et `SUPABASE_ANON_KEY`). `SUPABASE_URL` est fournie par Supabase. Les secrets se règlent dans le tableau de bord Supabase (Edge Functions, Secrets) ; ils ne sont jamais écrits dans ce dépôt.

## Modules communs (`functions/_partage/`)

- `cles.ts` : lecture des clés, adresse de l'Espace (`SITE`) et en-têtes CORS ;
- `courriel.ts` : gabarit HTML des e-mails de Fill (`alerte`, `notifier`) ;
- `offre.json` et `regles/offre.ts` : l'offre publiée (formules, catalogue, délais) ;
- `calendrier-type.json` : copie du calendrier type des temps forts de `assets/t.js` (source unique), écrite par `node supabase/calendrier-type.mjs` ; après toute modification du calendrier type, relancer ce script (le test `tests/bilan.test.mjs` échoue tant que la copie n'est pas à jour) et redéployer `bilan` ;
- `regles/bilan.ts` : règles du mail mensuel (trois suggestions, plage d'envoi, liens, textes) ;
- `regles/reception.ts` : analyse d'un mail entrant (mails automatiques, découpe entre la consigne du client et le message transféré, supports demandés, date, pièces jointes, textes des réponses) ; `regles/transfert.ts` : l'adresse de transfert et les deux phrases qui la montrent (`alerte`, `notifier`) ;
- `regles/` : calendrier et jours ouvrés, estimation, charge, pilote, registre des unités, cycle des demandes. L'Espace en a sa propre copie dans `espace-src/src/regles/` : une règle modifiée d'un côté doit l'être de l'autre.

Une réserve sur ces modules : esbuild retire les commentaires et les types en assemblant, ils ne sont donc pas revenus. Les noms suffixés d'un chiffre (`EQUIPE2`, `html2`, `o2`) sont ceux que l'assemblage avait donnés ; les laisser tels quels garantit un fichier identique.

## Modifier et déployer

1. Modifier la source dans `functions/`.
2. `npm run verifier` : la fonction modifiée apparaît en écart, les autres doivent rester identiques. Le fichier à déployer est `.assemblees/<fonction>.ts`.
3. Déployer ce fichier comme `index.ts` de la fonction, avec `verify_jwt: false`. Avec la CLI Supabase, `supabase functions deploy <fonction> --no-verify-jwt` assemble lui-même les modules `_partage`.
4. Copier `.assemblees/<fonction>.ts` dans `deploye/` et faire un commit.

Changer un module commun touche toutes les fonctions qui l'importent : elles sont toutes à redéployer.

## Mail mensuel unique (fonction `bilan`)

Un seul mail programmé par période et par client. Le lendemain de la fin d'une période d'abonnement, une fois la période clôturée (`traiter_echeances`, table `cloture`), la fonction agit. Si le quota de la période qui commence n'est pas encore crédité (entreprise dont la mensualité n'est pas réglée), elle attend, quatre jours au plus, pour que les suggestions se chiffrent sur des unités réellement disponibles. Elle :

1. fige le bilan (`bilan_candidats`, `bilan_calculer`, `bilan_preparer`) : demandes livrées, livrables par type, unités utilisées, reportées et expirées (celles du registre), demandes livrées à la date annoncée, délai moyen de validation côté client, liste datée. Aucune durée de travail, aucune statistique d'audience ; un retard de Fill apparaît tel quel ;
2. y joint trois suggestions au plus pour la période qui commence (`_partage/regles/bilan.ts`) : ce que le client a demandé à la même période l'an passé, puis le calendrier type, dans la limite des unités disponibles, report compris et demandes déposées en attente déduites, comme dans l'Espace. Un sujet déjà demandé (même titre, demande encore en cours ou datée de moins de 60 jours) ou dont le délai ne peut plus être tenu n'est pas proposé. La base refuse elle aussi un total supérieur au solde, et retire à l'envoi une suggestion dont la date limite de dépôt est passée entre-temps ;
3. tant que le réglage `parametre.pilote_bilan` est faux (valeur par défaut), laisse le bilan en attente : Hors-champ le propose dans « Maintenant » (« Valider le bilan du mois »), sans aucun mail. Depuis la carte, Fill voit les chiffres, retire une suggestion, ouvre l'aperçu de la page (`espace/bilan/#r=…`, jeton tiré dans Hors-champ, `bilan_relire`), valide (`bilan_valider` : l'envoi est demandé aussitôt à la fonction par pg_net, action `envoyer`) ou écarte le bilan (`bilan_ecarter`). Avec `pilote_bilan` à vrai, le mail part sans validation, sauf pour une organisation dont `mails_auto` est faux ;
4. envoie le mail au référent : trois chiffres, le lien du bilan (`espace/bilan/#j=…`, sans compte), une ligne et un lien « Lancer » par suggestion (nouvelle demande pré-remplie dans l'Espace).

Un bilan ne part jamais deux fois : l'envoi est réservé dans la base avant de partir (`bilan_reserver_envoi`) et confirmé après (`bilan_confirmer_envoi`). Si le service d'envoi refuse le mail, la réservation est rendue et l'envoi repart au passage suivant. Si sa réponse est incertaine (erreur du service, coupure), l'envoi n'est jamais retenté seul : Fill reçoit un message, et Hors-champ propose au bout de dix minutes « Vérifier l'envoi du bilan ». Après un coup d'œil au journal du service d'envoi, « Il est arrivé » enregistre l'envoi (`bilan_confirmer_envoi`, le lien du client s'ouvre alors) et « Le renvoyer » le libère (`bilan_liberer_envoi`, le mail repart au passage suivant). Rien ne part entre 20 h et 8 h, le week-end ou un jour férié.

Personne ne lit la réponse de la tâche planifiée : quand un passage laisse quelque chose en plan (bilan impossible à calculer, mail refusé par le service d'envoi, organisation sans référent actif), Fill reçoit un seul message qui le résume, à chaque passage tant que le point n'est pas corrigé. Les fonctions de Hors-champ (`bilan_a_valider`, `bilan_relire`, `bilan_valider`, `bilan_ecarter`) passent par le connecteur Supabase, comme `fill_retards` : elles sont refusées aux visiteurs et aux comptes clients.

Essai sans effet : `{"action":"quotidien","simuler":true}` répond ce qui serait figé et envoyé, sans rien écrire ni envoyer.

Tâche planifiée à créer à la mise en service (sur le modèle de `fill-pilote`) :

```sql
select cron.schedule('fill-bilan', '10 7 * * 1-5', $$ select net.http_post(
  url := 'https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/bilan',
  headers := jsonb_build_object('Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'jeton_pilote'), 'Content-Type', 'application/json'),
  body := '{"action":"quotidien"}'::jsonb, timeout_milliseconds := 60000) $$);
```

7 h 10 UTC, soit 8 h 10 ou 9 h 10 à Paris selon la saison : après la clôture de la nuit (`fill-echeances`, 23 h 05 UTC) et dans la plage d'envoi.

Tests : `node tests/bilan.test.mjs` (base embarquée : migration, chiffres, étanchéité, règles, et la fonction elle-même assemblée comme au déploiement, service d'envoi simulé) et `node ../espace-src/tests/bilan.mjs` (page dans Chrome).

## Adresse de transfert (branche `lot-adresse-transfert`, pas encore en service)

Chaque organisation a une adresse `organisation.alias_mail@demandes.studioes.fr`, générée depuis son nom. Un mail écrit ou transféré à cette adresse par un référent ou un contributeur actif, reconnu à son adresse d'expéditeur, suit ce chemin :

1. `reception` écarte les mails automatiques et les boucles, puis `mail_ouvrir` (base) dit qui écrit et pour quelle structure ;
2. `regles/reception.ts` sépare la consigne du client du message transféré. Dépôt direct seulement si l'origine du mail est prouvée (en-tête `Authentication-Results` aligné sur le domaine de l'expéditeur) et si le client demande, par une consigne de publication, un support courant à une unité (réseaux sociaux, actualité du site, agenda), sans réserve. `mail_deposer` applique alors les règles de `deposer_demande` et revérifie le garde-fou (prestations courantes à une unité, un exemplaire, trois au plus) ;
3. dans tous les autres cas, rien n'est déposé : le mail attend dans `mail_recu`, le client reçoit une réponse courte avec un lien `…/espace/?mail=<id>` vers la nouvelle demande pré-remplie (module `espace-src/src/transfert.js`), et Fill reçoit une alerte. À l'envoi, `mail_rattacher` joint les pièces du mail à la demande.

Réglages : `RECEPTION_CLE` (secret du webhook, 24 caractères au moins, obligatoire), `DOMAINE_RECEPTION` (défaut `demandes.studioes.fr`), `RECEPTION_ORIGINE=adresse` pour accepter le dépôt direct sur la seule foi de l'adresse d'expéditeur quand aucun contrôle d'origine n'échoue (défaut : preuve exigée).

Mise en service, dans l'ordre : enregistrements MX du sous-domaine (10 `inbound1.sendinblue.com`, 20 `inbound2.sendinblue.com`), secret `RECEPTION_CLE`, migration `migrations/2026-11-adresse-de-transfert.sql`, déploiement de `reception` (`verify_jwt: false`), action `{"action":"webhook","creer":true}`, fusion (publie l'Espace), essai réel, puis déploiement de `notifier` et `alerte`, qui montrent l'adresse aux clients. Après chaque déploiement, copier `.assemblees/<fonction>.ts` dans `deploye/`.

État au 12 novembre 2026, fin de journée (fusionné dans `main`) :

- `reception` version 5 en ligne (verify_jwt désactivé), depuis la branche `transfert-secret-au-coffre` : elle lit le secret du coffre (vérifié : l'action `webhook` répond 200, `mx_ok: true`). `deploye/reception.ts` est la copie exacte du fichier en ligne : l'outil de déploiement a converti les échappements `\uXXXX` en caractères (sauf caractères de contrôle). Après décodage de ces échappements, il est identique à `.assemblees/reception.ts` ; l'assembleur affiche donc un écart pour `reception`, sans différence de comportement. Au prochain déploiement par la CLI (`supabase functions deploy reception --no-verify-jwt`), l'écart disparaît ;
- webhook pas encore créé : Brevo ne connaît que `studioes.fr`. Déclarer `demandes.studioes.fr` dans Brevo (voir plus bas), puis appeler `{"action":"webhook","creer":true}` ;
- `notifier` et `alerte` (qui montrent l'adresse aux clients) ne sont pas encore déployés : à faire après l'essai réel.

État au 12 novembre 2026, matin (branche `transfert-secret-au-coffre`, posée sur `lot-adresse-transfert`) :

- le secret du webhook n'a plus à être saisi : la migration le génère dans le coffre de la base (Vault, secret `reception_cle`) et la fonction le lit par `reception_cle()` quand `RECEPTION_CLE` n'est pas réglé. La fonction `reception_cle` et le secret existent déjà en base ; la version 4 en ligne ne les lit pas encore (elle répond 503), la version de cette branche oui ;
- Brevo répond 400 `document_not_found` à la lecture des webhooks tant qu'il n'en existe aucun : l'action `webhook` le traite comme une liste vide (champ `lecture` de la réponse) ;
- Brevo refuse pour l'instant la création du webhook : `Domain is not found or is inactive`. Les enregistrements MX sont visibles (`mx_ok: true`) ; seul `studioes.fr` est déclaré dans Brevo. À faire dans Brevo : déclarer `demandes.studioes.fr` (Expéditeurs, domaines), puis relancer `{"action":"webhook","creer":true}` ;
- le contrôle d'origine lit `Authentication-Results`. L'exemple de la documentation de Brevo ne montre que `Received-SPF`, `DKIM-Signature` et `ARC-Authentication-Results` : au premier mail réel, la ligne `reception, origine : … ; serveur : …` du journal de la fonction dit ce que Brevo transmet. Sans cet en-tête, tout mail passe par le lien pré-rempli (motif `origine_non_prouvee`), jamais par le dépôt direct.

Suivi : `select recu, expediteur, sujet, issue, motif, demande_id from mail_recu order by recu desc`.

Tests : `node tests/reception.test.mjs` (base embarquée, 43 tests : migration, règles en base, analyse de mails réalistes de `tests/mails-exemples.mjs`, déroulé complet, fonction assemblée) et `node ../espace-src/tests/transfert.mjs` (lien pré-rempli dans un navigateur, 6 contrôles).

## Historique

- `bilan` (11 novembre 2026, branche `lot-mail-mensuel`, **pas encore en service**) : mail mensuel unique, bilan de période et trois suggestions. Migration `migrations/2026-11-bilan-mensuel.sql` (table `bilan`, fonctions `bilan_*`, réglage `parametre.pilote_bilan`) à appliquer ; la carte « Valider le bilan du mois » est déjà dans Hors-champ (version 97), sans effet tant que la migration n'est pas appliquée ; fonction `bilan` à déployer (`verify_jwt: false`), tâche planifiée `fill-bilan` à créer. Aucune autre fonction n'est modifiée. À la mise en service : copier `.assemblees/bilan.ts` dans `deploye/`.

- `relecture`, version 1, `notifier` et `alerte` (11 novembre 2026, `notifier` version 7, `alerte` version 12) : relecture et validation par lien. Migration `migrations/2026-11-relecture-par-lien.sql` appliquée (elle élargit aussi la contrainte `historique_type_check` au type `lien`), puis les trois fonctions déployées. Le mail « À relire » du référent mène à la page `espace/relecture/` ; si la création du lien échoue, le mail habituel part. Le mail de bienvenue demande le logo et la charte. Essai sur la base réelle fait dans une transaction annulée ; les fonctions répondent (jeton inconnu : 404, sans session : 401). Tests : `node tests/relecture.test.mjs` (base embarquée, 14 tests) et `node ../espace-src/tests/relecture.mjs` (page dans Chrome, 9 contrôles). `_partage/regles/relecture.ts` est commun à `relecture` et `notifier`.

- `desinscription`, version 3, et `envoi`, version 10 (9 novembre 2026) : les filtres de sécurité des messageries ouvraient le lien « stop » et désinscrivaient les prospects à leur place. Le lien des mails mène maintenant à `desinscription`, qui n'inscrit rien sur un GET et renvoie vers la page de confirmation du site ; les anciens liens (`parcours`, `?a=stop`) partent en attente (migration `2026-11-desinscription-confirmation.sql`). Supabase sert le HTML d'une fonction en texte brut : une page avec un bouton doit vivre sur le site, pas dans la fonction. `deploye/envoi.ts` a été reconstitué à partir de la version 10 déployée (seul le lien change) : à comparer au fichier déployé lors de la prochaine modification.

- `pilote`, version 4 (30 octobre 2026) : le pré-contrôle des unités raisonne sur la période d'abonnement de chaque organisation (date anniversaire du premier paiement, fonctions SQL `periode_org`, `debut_periode_org`, `fin_periode_org`) au lieu du mois civil. La version 3, reconstituée à l'identique, est au commit f67a808.
