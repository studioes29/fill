# Rubrique Ressources

Les articles de https://fill.studioes.fr/ressources/ : un fichier Markdown par article dans ce dossier, puis
`python3 ressources/sources/construire.py --og` depuis la racine du dépôt. Le script écrit les pages, les images,
le flux RSS (`ressources/flux.xml`), les entrées du sitemap et la section Ressources de `llms.txt`.
Options : `--images` réencode les images d'un article (après correction d'une page du post), `--date AAAA-MM-JJ`
construit comme à cette date. Les fichiers générés se versionnent avec la source (GitHub Pages sert le dépôt tel quel, sans étape de construction).

## En-tête d'un article

```
---
titre: Une publication lisible par tous          (titre court, en Bricolage)
relance: sept gestes à chaque post.               (relance en Urbanist italique, avec son point)
titre_seo: …                                      (facultatif : balise title et données structurées)
categorie: Guide | Constat | Récit | Étude
cible: collectivites | entreprises | tous
date: 2026-11-27                                  (publication ; une date future = publication programmée, mise en ligne
                                                   ce matin-là par l'action GitHub « Ressources programmées »)
maj: 2026-12-02                                   (facultatif : dernière mise à jour)
poids: 10                                         (facultatif : met l'article en tête de l'index à date égale)
post: 2027-01-12-guide-accessible                 (identifiant du post dans public.reseaux_post)
dossier_post: guide-accessible                    (dossier des pages du post dans assets/reseaux/)
couverture: p01.jpg
couverture_alt: …
description: …                                    (150 à 170 signes : balise description et cartes)
chapo: …                                          (le chapeau, 3 à 4 phrases)
---
```

## Règles d'écriture (Ewen)

- Article complet et autonome, pas le carrousel recopié : 800 à 1 400 mots, une idée par section, des intertitres qui
  reprennent les questions que se pose le lecteur.
- Ton humain et sobre, descriptif et concret, sans superlatif ni promesse. Vouvoiement, « nous » pour Fill.
- Jamais de tiret long ni de demi-cadratin : « : », parenthèses, ou « à » dans les fourchettes.
- Aucun chiffre inventé : un fait daté ou réglementaire se vérifie sur une source officielle.
- Aucun cas réel identifiable issu de Moëlan-sur-Mer : les exemples sont fictifs ou anonymisés.
- Fill n'apparaît pas dans le corps (l'appel de fin est ajouté par le gabarit), sauf quand un prix sert d'exemple chiffré.
- Images : les pages du post, choisies pour ce qu'elles expliquent (jamais la dernière page logo), avec un texte
  alternatif qui dit ce que l'image apporte et une légende courte.
