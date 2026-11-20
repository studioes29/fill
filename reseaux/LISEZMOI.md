# Moteur des visuels réseaux de Fill

- moteur/lgen.py : charte (couleurs, logo, motif, page(), story()), rendu via render.py (Playwright + Chrome, 1080×1350).
- moteur/guide2.py : guide « La com de décembre » validé (semaine en tête de page, exemples mis en scène, décompte en unités, fin logo centré).
- moteur/gen2.py, gen5.py, cover.py, chrome.py : post de lancement, offre, couvertures.
- canevas/gen4.py : génération des planches du canevas Claude Design.
- photos HD : dossier img/ de cette branche (Unsplash, téléchargées par la GitHub Action photos.yml).
- moteur/constat_budget.py : Constat « Le budget 2027 se décide maintenant » (3 déc. 2026), modèle de la série Constat.
- moteur/serie_semaine.py : série « Une semaine de com dans une commune de 3 000 habitants » (6 épisodes de 5 pages, couverture lavande foncée).
- Polices : lgen.py charge aussi les fichiers -ext (œ, symboles) des polices du site.
- Base : table Supabase public.reseaux_post (statuts a_produire, a_valider, a_corriger, programme, publie). La validation se fait dans Hors-champ (rubrique Réseaux) et programme dans Buffer. Production et corrections : tâche planifiée « Posts réseaux Fill : produire et corriger ».
