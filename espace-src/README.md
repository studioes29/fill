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

Le calendrier type des temps forts (bloc « À anticiper » de l'Accueil) est lu au build dans `../assets/t.js`, la même source que la page publique /calendrier/ : après toute modification du calendrier type dans `assets/t.js`, relancer `npm run construire` et publier le bundle produit avec le reste.

## Vérifier avant de publier

Playwright n'est pas une dépendance déclarée (il n'est pas dans `package.json` ni dans `package-lock.json`, pour ne pas alourdir `npm install`). Il s'installe une fois, à la main, dans `espace-src/node_modules` :

```
npm i --no-save playwright@1.63.0        # même version que le Chromium installé (sinon : npx playwright install chromium)
npm run verifier
```

`--no-save` laisse `package.json` et `package-lock.json` intacts ; un `npm install` ultérieur peut retirer Playwright, il suffit alors de le réinstaller. Sans accès au téléchargement de Chromium, `PLAYWRIGHT_BROWSERS_PATH` doit désigner un dossier qui contient le Chromium correspondant à cette version.

`tests/verifier.mjs` fait deux contrôles :

1. **Calendrier type** : le bundle de `../espace` (celui qui sera publié) doit porter exactement les données du calendrier type de `../assets/t.js`. Sinon le vérificateur échoue tout de suite : `assets/t.js` a été modifié sans relancer `npm run construire`.
2. **Équivalence** : il compare l'Espace de référence (par défaut `espace/` de la branche `main`, c'est-à-dire ce que GitHub Pages sert) et un build neuf de `src/` : 123 écrans par largeur au 31 octobre 2026 (1440 et 390 px ; le nombre de fiches suit les données de démonstration), en démonstration avec les 9 profils (accueil, demandes, nouvelle demande, calendrier, unités, équipe, comptes, production, pilotage, fiches de demandes, saisie d'une demande) et en mode réel sans session (connexion, ouverture de compte, paiement annulé). Pour chaque écran : DOM rendu et styles calculés de chaque élément. Après une modification voulue, les écarts attendus apparaissent dans le dossier indiqué ; tout autre écart est une régression.

Autres références : `npm run verifier -- --ref origin/main` (ou toute révision git), `npm run verifier -- --ref .` (le dossier `../espace` tel qu'il est sur le disque, utile juste après un `npm run construire` pour s'assurer qu'il n'y a plus aucun écart).

Profils en démonstration : avec `?demo`, l'Espace démarre toujours sur le profil « visiteur » (Camille Morvan, Saint-Ivenec) et ne lit pas le profil enregistré. Pour parcourir réellement les 9 profils, `tests/equivalence.cjs` réécrit à la volée, dans le bundle servi (référence et build neuf, de la même façon), l'initialisation de `moiId` pour qu'elle lise `localStorage["fill-espace-demo-mvuakaue-moi"]`, qu'il pose avant le chargement. Le test échoue si ce motif n'est plus trouvé (après une modification de `donnees/etat.js`) ou si deux profils censés différer affichent la même personne ou le même nom d'organisation.

Limite : les états au survol, au focus et les pseudo-éléments (`::placeholder`, `::before`) ne sont pas comparés ; une modification de ce type se contrôle à l'œil.

## Où trouver quoi

| Fichier | Contenu |
| --- | --- |
| `vendor/svelte.js`, `vendor/supabase-js.js`, `vendor/vite-preload.js` | bibliothèques compilées, à ne pas modifier |
| `regles/tempsforts.js` | bloc « À anticiper » de l'Accueil : prochains temps forts, masquage des temps forts déjà demandés, préremplissage de la nouvelle demande. Les données n'y sont pas : voir la ligne suivante |
| `../assets/t.js` (zones `@calendrier-type:packs` et `@calendrier-type:mois`), `calendrier-type.mjs` | **source unique du calendrier type** (objets `PACKS` et `D`, aussi utilisés par la page publique /calendrier/). `construire.mjs` les extrait entre les commentaires repères (`calendrier-type.mjs`) et les injecte dans `regles/tempsforts.js` ; le build échoue si les repères manquent ou si les données sont invalides. **Après toute modification du calendrier type dans `assets/t.js`, relancer `npm run construire`** (et publier le nouveau bundle) ; `npm run verifier` échoue tant que ce n'est pas fait. Ne pas déplacer ni supprimer les commentaires repères |
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
