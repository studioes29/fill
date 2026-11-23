# Règles apprises (retours d'Ewen)

Ce fichier complète la charte du prompt de production. En cas de doute, il fait foi.

## 23 novembre 2026 : qualité globale des posts (retour sur le budget 2027 et la série « Une semaine de com »)

- De vraies photos dès qu'elles servent le propos, surtout en couverture. Les chercher avec le connecteur Unsplash (search_photos), puis ajouter « nom photo-xxxxxxxx » à liste.txt (branche photos) : l'action photos.yml les télécharge dans img/. Vérifier chaque photo (planche) : pas de document étranger lisible (formulaire d'impôt américain, etc.), pas de marque visible.
- La couverture doit donner envie d'ouvrir : photo en grand ou visuel fort, un chiffre ou un mot en très gros, titre court. Elle est animée (MP4) dès que c'est un plus.
- Un seul message par page, lisible d'un coup d'œil : un titre de 6 mots au plus, une relance, un visuel, une phrase au plus. Couper le texte plutôt que réduire la taille.
- Des cartes et maquettes plus graphiques : grands chiffres, tuiles, téléphones, tampons, pastilles, photos dans les cartes. Pas de listes de texte en petit corps.
- Le motion n'est pas réservé au lancement : au moins la couverture, et une page intérieure quand l'animation explique quelque chose (calendrier qui avance, demandes qui arrivent, étapes).
- Une pastille doit dire quelque chose d'utile au lecteur (« Avant le 15 avril », « Une semaine de com · 1/6 »). Pas d'étiquette de série seule comme « Constat ».
- Alignements et espacements : tout calé sur les marges de 88 px, rien ne déborde dans la marge basse, rien ne passe sous un autre élément par erreur.
- Modèles de référence (version 2) : moteur/v2.py (briques), budget2.py (constat), semaine2.py (série). Les vidéos se rendent avec video.py ; dans reseaux_post.pages, une page animée est un .mp4 (avec un .jpg du même nom à côté pour la miniature Buffer).
