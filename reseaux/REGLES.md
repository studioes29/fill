# Règles apprises (retours d'Ewen)

Ce fichier complète la charte du prompt de production. En cas de doute, il fait foi.

## 23 novembre 2026 : qualité globale des posts (retour sur le budget 2027 et la série « Une semaine de com »)

- De vraies photos dès qu'elles servent le propos, surtout en couverture. Les chercher avec le connecteur Unsplash (search_photos), puis ajouter « nom photo-xxxxxxxx » à liste.txt (branche photos) : l'action photos.yml les télécharge dans img/. Vérifier chaque photo (planche) : pas de document étranger lisible (formulaire d'impôt américain, etc.), pas de marque visible.
- La couverture doit donner envie d'ouvrir : photo dans un cadre net ou visuel fort, un chiffre ou un mot en très gros, titre court. Couverture TOUJOURS fixe, jamais animée.
- Aucun dégradé de couleur, ni sur les photos ni sous le texte. Le texte est toujours posé sur un aplat (fond de page, carte, pastille), jamais sur une photo : lisible en toute circonstance.
- Un seul message par page, lisible d'un coup d'œil : un titre de 6 mots au plus, une relance, un visuel, une phrase au plus. Couper le texte plutôt que réduire la taille.
- Des cartes et maquettes plus graphiques : grands chiffres, tuiles, téléphones, tampons, pastilles, photos dans les cartes. Pas de listes de texte en petit corps.
- Le motion n'est pas réservé au lancement, mais seulement quand il apporte un vrai plus : une page intérieure dont l'animation explique quelque chose (calendrier qui avance, demandes qui arrivent une à une). Jamais d'animation décorative (éléments qui glissent ou apparaissent sans raison).
- Une pastille doit dire quelque chose d'utile au lecteur (« Avant le 15 avril », « Une semaine de com · 1/6 »). Pas d'étiquette de série seule comme « Constat ».
- Alignements et espacements : tout calé sur les marges de 88 px, rien ne déborde dans la marge basse, rien ne passe sous un autre élément par erreur.
- Modèles de référence (version 2) : moteur/v2.py (briques), budget2.py (constat), semaine2.py (série). Les vidéos se rendent avec video.py ; dans reseaux_post.pages, une page animée est un .mp4 (avec un .jpg du même nom à côté pour la miniature Buffer).

## 23 novembre 2026 (2) : retour sur le budget, la semaine de com et le guide accessible

- La photo de couverture parle du sujet, pas de la cible (budget : billets et calculatrice, pas une mairie).
- Jamais la même photo sur deux pages, ni d'un post à l'autre. Tenir la liste des photos déjà utilisées (liste.txt et posts publiés) avant d'en choisir une.
- Pas de photo « décorative » en fond d'une carte, pas de tampon ni d'effet gadget : un visuel doit servir le propos. Recadrer pour que le sujet de la photo soit visible.
- Espaces titre / visuel / pied toujours égaux : utiliser mise() de v2.py (titre en haut, pied sur la marge basse, visuel centré et mesuré).
- Ombres portées légères (OMBRE de v2.py), chiffres à taille raisonnable : pas de prix géants.
- Storytelling : on comprend de quoi parle le post sur la couverture, puis pourquoi c'est important, puis comment faire, puis ce qu'on y gagne. Quelqu'un qui n'y connaît rien doit suivre.
- Pas de série étalée sur plusieurs semaines : une histoire tient dans un seul post (jusqu'à 10 pages). Pas de « épisode 1 sur 6 ».
- L'ordre des couvertures se vérifie dans Hors-champ, rubrique Réseaux, page « Feed » (jamais deux couleurs identiques à la suite).

## 23 nov. (3)
- Écarts titre / visuel / pied égaux mais plafonnés (mise(), 120 px max) : jamais de grand vide entre deux blocs.
- Budget des communes : voté en mars ou en avril (au plus tard le 15 avril), jamais « en avril » seul.
- Un constat montre assez de manques pour que la cible se reconnaisse, puis une page dit ce que la solution règle (sans / avec).
- Toujours une page de contexte avant d'entrer dans le contenu d'un guide.
- Le titre porte l'info clé (ex. « dans une commune de 3 000 habitants ») : pas de détail important relégué dans une pastille.
- Quand une liste appartient à une personne ou un service, le montrer (en-tête « fiche de poste », etc.).
- Vérifier le recadrage de chaque photo : le sujet entier visible, jamais masqué par une carte.
- Thème hors saison des fêtes quand il n'a pas de lien avec elles (ex. accessibilité déplacée en janvier).
- LinkedIn reçoit le PDF des pages fixes (état final, sans animation).
- Feed du canevas : board Feed.dc.html régénéré par reseaux/canevas/feed.py à chaque changement de post.

## 24 nov. (retour sur le baromètre)
- Un post déplacé s'adapte à sa nouvelle date (plus de référence à un événement passé) ; un créneau déjà pris dans la semaine ne se double pas.
- Un constat ne s'arrête jamais au constat : il se termine par une réponse concrète (sans / avec, formules) et parle aussi aux entreprises quand le sujet les concerne.
- Une couverture doit être dynamique et donner envie de lire la suite : photo forte qui raconte le sujet, chiffre clé en grand.
