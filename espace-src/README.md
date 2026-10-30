# Espace Fill : source

Ce dossier contient la source de l'Espace Fill (fill.studioes.fr/espace), l'espace client servi par GitHub Pages depuis `../espace`.

## D'où vient cette source

Le projet d'origine (Svelte 5 + Vite, dossier `fill-espace`) n'existe plus : il vivait dans un environnement de travail temporaire et n'a jamais été poussé sur GitHub (le dépôt `studioes29/fill-espace` n'a pas été créé). Des archives anciennes (`fill-espace-v2.tgz` à `v4.tgz`) restent jointes à la conversation « Plateforme Fill : cahier des charges », mais elles sont antérieures au mode réel, à la connexion par mot de passe, à l'équipe, aux règlements et à la période anniversaire.

La source a donc été reconstituée le 30 octobre 2026 à partir du bundle en ligne (`index-An30Ft26.js`, avec toutes les corrections faites directement dedans jusqu'au commit ab1c275) :

1. mise en forme du code compilé (Prettier) ;
2. renommage de 254 noms de premier niveau (composants, règles, données) avec un outil qui tient compte des portées (Babel), en vérifiant qu'aucun nom ne masque une variable existante ;
3. découpage en 61 fichiers, dans l'ordre exact du bundle.

Ce n'est pas la source Svelte d'origine : chaque composant est la sortie compilée de Svelte 5 (gabarits HTML, puis fonction du composant). Les noms internes des fonctions restent courts (`e`, `t`, `n`). Les textes, les règles, les appels à Supabase et les données de démonstration se lisent et se modifient sans difficulté ; une refonte d'écran se fait plus confortablement en réécrivant le composant.

## Construire

```
npm install
npm run construire        # écrit ../espace/index.html et ../espace/assets/index-<empreinte>.js|css
```

Les fichiers de `src/` sont concaténés dans l'ordre de `src/ordre.txt` et forment un seul module, comme le bundle d'origine : l'ordre compte. Le CSS est `styles/espace.css`. Les autres fichiers de `../espace` (icônes, polices, images, manifeste, écran `admin-virements`) ne sont pas générés : ils se modifient sur place.

Règle à tenir désormais : ne plus modifier `../espace/assets/index-*.js` à la main. On modifie `src/`, on construit, on vérifie, on publie.

## Vérifier avant de publier

```
npm i -D playwright && npx playwright install chromium   # une fois
npm run verifier
```

`tests/verifier.mjs` compare l'Espace publié (`../espace` tel qu'il est dans le dépôt) et un build neuf de `src/` : 141 écrans par largeur (1440 et 390 px), en démonstration avec les 9 profils (accueil, demandes, nouvelle demande, calendrier, unités, équipe, comptes, production, pilotage, fiches de demandes, saisie d'une demande) et en mode réel sans session (connexion, ouverture de compte, paiement annulé). Pour chaque écran : DOM rendu et styles calculés de chaque élément. Après une modification voulue, les écarts attendus apparaissent dans le dossier indiqué ; tout autre écart est une régression. Limite : les états au survol, au focus et les pseudo-éléments (`::placeholder`, `::before`) ne sont pas comparés ; une modification de ce type se contrôle à l'œil.

## Où trouver quoi

| Fichier | Contenu |
| --- | --- |
| `vendor/svelte.js`, `vendor/supabase-js.js`, `vendor/vite-preload.js` | bibliothèques compilées, à ne pas modifier |
| `regles/` | calendrier et jours ouvrés, période anniversaire (`periode.js`), dates, charge, retards, statuts et transitions, remise, accès aux comptes, offre (`offre.js` contient l'offre publiée), estimation, facture, pilote, registre, premier jet de l'atelier |
| `donnees/supabase.js` | client Supabase, connexion, chargement (`charger`) et objet `api` : un appel par action |
| `donnees/etat.js`, `donnees/actions.js` | état de l'application, démonstration, actions des écrans (déposer, confirmer, livrer, commander, inviter…) |
| `donnees/demo.js` | données et images de la démonstration (`?demo`) |
| `routeur.js` | navigation par `#route` |
| `pages/` | écrans : Connexion, Ouverture, NouveauMotDePasse, Accueil, Demandes, NouvelleDemande, Fiche, Unites, Calendrier, Production, Pilotage, Equipe, Comptes |
| `ui/` | éléments communs : Icone, Logo, Toasts, Visite, Fete, Bobine (jauge d'unités), FilEtat, CarteDemande, CommandeUnites, bon de commande, Volet, Visionneuse, Livrable… |
| `App.js` | coquille : menu, barre mobile, notifications, choix de l'écran |

## Carte des appels à Supabase

| Écran | Actions | Appels (RPC, fonctions serveur, tables) |
| --- | --- | --- |
| Toutes (au chargement) | `charger` | lecture de organisation, profil, demande, demande_ligne, piece_jointe, message, version_livrable, historique, registre, fermeture, periode_preelectorale, commande, parametre, brouillon, journal, facture, acces_compte |
| Connexion, NouveauMotDePasse | `seConnecter`, `motDePasseOublie`, `changerMotDePasse`, `verifierLienEmail` | Supabase Auth (mot de passe, lien e-mail) |
| Ouverture | `creerCompte` | `creer_compte`, fonction `alerte` |
| Visite | `fermerVisite` | `marquer_visite` |
| NouvelleDemande | `deposerDemande`, `modifierDemande` | `deposer_demande`, `modifier_demande`, piece_jointe (insert), stockage `fichiers`, fonction `notifier` |
| Fiche | `confirmerDemande`, `repondreAccord`, `agir`, `livrerVersion`, `relancerAtelier`, `ecrireMessage` | `confirmer_demande`, `donner_accord`, `changer_statut`, version_livrable et message (insert), stockage `fichiers`, fonctions `atelier` et `notifier` |
| Unites, CommandeUnites | `commanderUnites`, `envoyerBonCommande`, `annulerCommande`, `payerOuverture` | `commander_unites`, `deposer_bon_commande`, `annuler_commande`, fonctions `paiement` et `alerte`, stockage `fichiers` |
| Production | `confirmerDemande` | `confirmer_demande`, fonction `notifier` |
| Pilotage | `ajusterUnites`, `validerCommande`, `ouvrirPiece`, `verifierAcces`, `activer`, `reglerCapacite`, `reglerPilote`, `reglerEssai`, `reglerSansIA`, `emettreFactures` | `ajuster_unites`, `valider_commande`, `verifier_acces`, `activer_organisation`, `emettre_factures`, parametre et organisation (update), stockage `fichiers` (lien signé), fonction `notifier` |
| Equipe | `inviterMembre`, `retirerMembre`, `reglerMembre` | fonction `inviter`, `retirer_membre`, `regler_membre` |
| Comptes | `declarerAcces` | `declarer_acces`, fonction `notifier` |
| Règlements (`../espace/admin-virements.html`, écrit à la main) | | `mensualite_virement`, `commande_virement`, fonction `mensualite` |

## Corrections faites directement dans le bundle avant la reconstitution

Elles sont toutes dans cette source, puisqu'elle part du bundle en ligne :

- 921d1c7 : dates au format français, espace client en sombre sur le site ;
- de77b99 : règlement des entreprises (virement automatique ou carte), suppression de « HT » ;
- 9a9582d : lien de paiement personnel pour les mensualités (fonction `mensualite`), récapitulatifs des entreprises ;
- ab1c275 : période à la date anniversaire du premier paiement (`regles/periode.js` : `periodeAnniversaire`, `bornesPeriode`, `libellePeriode`).
