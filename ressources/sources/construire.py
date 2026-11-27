#!/usr/bin/env python3
"""Construit la rubrique Ressources de fill.studioes.fr.

Sources : ressources/sources/<slug>.md (en-tête « clé: valeur » entre deux lignes ---, puis le corps).
Sorties : ressources/index.html, ressources/<slug>/index.html, ressources/<slug>/img/*,
          ressources/flux.xml, et les entrées Ressources de sitemap.xml et de llms.txt.

Usage : python3 ressources/sources/construire.py        (depuis la racine du dépôt)
        python3 ressources/sources/construire.py --og   (régénère aussi les images de partage, Playwright)
        --images : réencode les images déjà présentes (après la correction d'une page du post)
        --date AAAA-MM-JJ : construit comme si l'on était à cette date (essai des publications programmées)

Syntaxe du corps (sous-ensemble de Markdown) :
  ## Titre de section (entre dans le sommaire)   ### Sous-titre
  paragraphe, **gras**, *italique*, [lien](url)
  - liste   1. liste numérotée   > citation
  | a | b |  tableau (première ligne = en-tête, ligne |---| ignorée)
  ![texte alternatif](fichier.jpg "Légende")      figure ; deux lignes d'images à la suite = deux images côte à côte
  ::: encadre Titre    ...    :::                 encadré
Les images viennent de assets/reseaux/<dossier_post>/ (pages du post) ou de ressources/sources/img/<slug>/.
"""
import datetime as dt
import html
import json
import os
import re
import sys
import unicodedata
from email.utils import format_datetime

from PIL import Image

RACINE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(RACINE, "ressources", "sources")
SORTIE = os.path.join(RACINE, "ressources")
SITE = "https://fill.studioes.fr"
V_CSS = "2"
CATEGORIES = {"Guide": "Guides", "Constat": "Constats", "Récit": "Récits", "Étude": "Études"}
CIBLES = {"collectivites": "Collectivités", "entreprises": "Entreprises", "tous": "Collectivités et entreprises"}
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
NNBSP = NBSP = "\u00a0"


# ---------------------------------------------------------------- outils texte
def slugifier(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t.lower()).strip("-")
    return re.sub(r"-{2,}", "-", t)[:70].strip("-")


def typo(t):
    """Typographie française sur du texte brut (avant échappement HTML)."""
    t = t.replace("'", "’")
    t = re.sub(r"«\s*", "«" + NNBSP, t)
    t = re.sub(r"\s*»", NNBSP + "»", t)
    t = re.sub(r"\s+([;!?])", NNBSP + r"\1", t)
    t = re.sub(r"(?<=\S)\s+:(?=\s|$)", NBSP + ":", t)
    t = re.sub(r"(\d)\s(?=\d{3}\b)", r"\1" + NNBSP, t)
    t = re.sub(r"(\d)\s+(%|€|h\b|heures?\b|unités?\b|habitants\b|ans\b|mois\b|jours?\b|semaines?\b)", r"\1" + NBSP + r"\2", t)
    return t


def esc(t):
    return html.escape(t, quote=True)


def inline(t):
    """Texte d'un paragraphe : typographie, échappement, puis gras, italique et liens."""
    liens = []

    def garder(m):
        liens.append((m.group(1), m.group(2)))
        return "\x00%d\x00" % (len(liens) - 1)

    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", garder, t)
    t = esc(typo(t))
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)

    def rendre(m):
        txt, url = liens[int(m.group(1))]
        ext = url.startswith("http") and not url.startswith(SITE)
        return '<a href="%s"%s>%s</a>' % (esc(url), ' rel="noopener"' if ext else "", esc(typo(txt)))

    return re.sub(r"\x00(\d+)\x00", rendre, t)


def date_fr(d):
    return "%d%s %s %d" % (d.day, "er" if d.day == 1 else "", MOIS[d.month - 1], d.year)


# ---------------------------------------------------------------- lecture des sources
def lire(chemin):
    brut = open(chemin, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", brut, re.S)
    if not m:
        raise SystemExit("En-tête manquant : " + chemin)
    meta = {}
    for ligne in m.group(1).splitlines():
        if ":" in ligne:
            k, v = ligne.split(":", 1)
            meta[k.strip()] = v.strip()
    meta.setdefault("slug", os.path.splitext(os.path.basename(chemin))[0])
    for k in ("titre", "relance", "categorie", "cible", "date", "description", "chapo", "couverture"):
        if not meta.get(k):
            raise SystemExit("Champ « %s » manquant : %s" % (k, chemin))
    if meta["categorie"] not in CATEGORIES:
        raise SystemExit("Catégorie inconnue (%s) : %s" % (meta["categorie"], chemin))
    meta["d"] = dt.date.fromisoformat(meta["date"])
    meta["dm"] = dt.date.fromisoformat(meta.get("maj") or meta["date"])
    meta["poids"] = int(meta.get("poids") or 0)
    meta["corps"] = m.group(2).strip()
    meta["mots"] = len(re.findall(r"\w+", re.sub(r"!\[[^\]]*\]\([^)]*\)", "", meta["corps"])))
    meta["lecture"] = max(2, round(meta["mots"] / 220))
    return meta


# ---------------------------------------------------------------- images
def image_source(art, nom):
    for d in (os.path.join(SRC, "img", art["slug"]), os.path.join(RACINE, "assets", "reseaux", art.get("dossier_post", ""))):
        p = os.path.join(d, nom)
        if os.path.isfile(p):
            return p
    raise SystemExit("Image introuvable pour %s : %s" % (art["slug"], nom))


def preparer_image(art, nom, largeur):
    """Copie une page du post en WebP (et JPEG pour la couverture), au poids du web."""
    src = image_source(art, nom)
    dossier = os.path.join(SORTIE, art["slug"], "img")
    os.makedirs(dossier, exist_ok=True)
    base = os.path.splitext(nom)[0]
    im = Image.open(src).convert("RGB")
    if im.width > largeur:
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    cible = os.path.join(dossier, "%s-%d.webp" % (base, largeur))
    if not os.path.isfile(cible) or "--images" in sys.argv:
        im.save(cible, "WEBP", quality=80, method=6)
    return "img/%s-%d.webp" % (base, largeur), im.size


def preparer_couverture(art):
    src = image_source(art, art["couverture"])
    dossier = os.path.join(SORTIE, art["slug"], "img")
    os.makedirs(dossier, exist_ok=True)
    cible = os.path.join(dossier, "couverture.jpg")
    if not os.path.isfile(cible) or "--images" in sys.argv:
        im = Image.open(src).convert("RGB")
        im.resize((1080, round(im.height * 1080 / im.width)), Image.LANCZOS).save(cible, "JPEG", quality=86, optimize=True, progressive=True)
    for l in (720, 480):
        preparer_image(art, art["couverture"], l)


# ---------------------------------------------------------------- corps de l'article
def rendre_corps(art):
    lignes = art["corps"].splitlines()
    out, som, i = [], [], 0
    ids = set()

    def fig(groupe):
        imgs = []
        for alt, nom, leg in groupe:
            url, (w, h) = preparer_image(art, nom, 900)
            url2, _ = preparer_image(art, nom, 540)
            imgs.append('<figure class="ra-fig"><img src="%s" srcset="%s 540w, %s 900w" sizes="(min-width: 900px) 380px, 80vw" width="%d" height="%d" alt="%s" loading="lazy" decoding="async">%s</figure>'
                        % (url, url2, url, w, h, esc(typo(alt)), '<figcaption>%s</figcaption>' % inline(leg) if leg else ""))
        return '<div class="ra-figs n%d">%s</div>' % (len(imgs), "".join(imgs))

    while i < len(lignes):
        l = lignes[i].rstrip()
        if not l.strip():
            i += 1
            continue
        if l.startswith("## "):
            t = l[3:].strip()
            a = slugifier(re.sub(r"^\d+\.\s*", "", t)) or "section"
            while a in ids:
                a += "-2"
            ids.add(a)
            som.append((a, t))
            out.append('<h2 id="%s">%s</h2>' % (a, inline(t)))
            i += 1
        elif l.startswith("### "):
            out.append("<h3>%s</h3>" % inline(l[4:].strip()))
            i += 1
        elif l.startswith("!["):
            groupe = []
            while i < len(lignes) and lignes[i].startswith("!["):
                m = re.match(r'!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)', lignes[i].strip())
                if not m:
                    raise SystemExit("Image mal écrite : " + lignes[i])
                groupe.append((m.group(1), m.group(2), m.group(3) or ""))
                i += 1
            out.append(fig(groupe))
        elif l.startswith("::: encadre"):
            titre = l[len("::: encadre"):].strip()
            i += 1
            bloc = []
            while i < len(lignes) and lignes[i].strip() != ":::":
                bloc.append(lignes[i])
                i += 1
            i += 1
            paras = [p for p in re.split(r"\n\s*\n", "\n".join(bloc)) if p.strip()]
            out.append('<aside class="ra-enc">%s%s</aside>' % ('<p class="ra-enc-t">%s</p>' % inline(titre) if titre else "",
                                                             "".join("<p>%s</p>" % inline(" ".join(p.split())) for p in paras)))
        elif l.startswith("|"):
            rangs = []
            while i < len(lignes) and lignes[i].startswith("|"):
                cel = [c.strip() for c in lignes[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in cel):
                    rangs.append(cel)
                i += 1
            tete, corps = rangs[0], rangs[1:]
            # une dernière colonne faite de pourcentages devient un graphique en barres
            barres = corps and all(re.fullmatch(r"\d+(?:[,.]\d+)?\s?%", r[-1]) for r in corps)

            def cellule(c, j, r):
                if barres and j == len(r) - 1:
                    v = c.replace(" ", "").replace(",", ".").rstrip("%")
                    return '<td class="ra-v"><span class="ra-vv"><span class="ra-bar"><i style="width:%s%%"></i></span><b>%s</b></span></td>' % (v, inline(c))
                return "<td>%s</td>" % inline(c)
            out.append('<div class="ra-tab%s"><table><thead><tr>%s</tr></thead><tbody>%s</tbody></table></div>'
                       % (" barres" if barres else "", "".join('<th scope="col">%s</th>' % inline(c) for c in tete),
                          "".join("<tr>%s</tr>" % "".join(cellule(c, j, r) for j, c in enumerate(r)) for r in corps)))
        elif re.match(r"^[-*] ", l):
            items = []
            while i < len(lignes) and re.match(r"^[-*] ", lignes[i]):
                items.append(lignes[i][2:].strip())
                i += 1
            out.append("<ul>%s</ul>" % "".join("<li>%s</li>" % inline(x) for x in items))
        elif re.match(r"^\d+\. ", l):
            items = []
            while i < len(lignes) and re.match(r"^\d+\. ", lignes[i]):
                items.append(re.sub(r"^\d+\.\s+", "", lignes[i]).strip())
                i += 1
            out.append('<ol class="ra-ol">%s</ol>' % "".join("<li>%s</li>" % inline(x) for x in items))
        elif l.startswith(">"):
            bloc = []
            while i < len(lignes) and lignes[i].startswith(">"):
                bloc.append(lignes[i].lstrip("> ").strip())
                i += 1
            out.append('<blockquote class="ra-cit"><p>%s</p></blockquote>' % inline(" ".join(bloc)))
        else:
            bloc = []
            while i < len(lignes) and lignes[i].strip() and not re.match(r"^(#{2,3} |!\[|\||[-*] |\d+\. |>|:::)", lignes[i]):
                bloc.append(lignes[i].strip())
                i += 1
            out.append("<p>%s</p>" % inline(" ".join(bloc)))
    return "\n".join(out), som


# ---------------------------------------------------------------- gabarit commun (repris de la page Guide)
def gabarit():
    s = open(os.path.join(RACINE, "guide", "index.html"), encoding="utf-8").read()
    csp = re.search(r'<meta http-equiv="Content-Security-Policy"[^>]+>', s).group(0)
    tete_js = re.search(r'<script>\(function\(h\).*?</script>', s, re.S).group(0)
    debut = s[s.index('<a class="evite"'):s.index('<main id="contenu">')]
    fin = s[s.index("</main>") + len("</main>"):s.index("</body>")]
    fin = re.sub(r'\s*<script src="[^"]*"[^>]*></script>', "", fin).rstrip() + "\n"
    return csp, tete_js, debut, fin


def profondeur(bloc, n):
    """Le gabarit vient d'une page à un niveau (../) ; on l'adapte à la profondeur voulue."""
    pre = "../" * n
    bloc = bloc.replace('="../', '="' + pre)
    return bloc.replace('="../"', '="%s"' % pre)


def tete(art_ou_page, csp, tete_js, n, jsonld):
    p = art_ou_page
    rel = "../" * n
    titre = esc(p["titre_page"])
    desc = esc(p["description_page"])
    img = p["image"]
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
{csp}
<meta name="referrer" content="strict-origin-when-cross-origin">

<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{titre}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{p['url']}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#F8F5F2">
<meta property="og:type" content="{p['og_type']}">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Fill">
<meta property="og:url" content="{p['url']}">
<meta property="og:title" content="{titre}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{img}">
<meta property="og:image:alt" content="{esc(p['image_alt'])}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">{p.get('og_extra', '')}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{titre}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{img}">
<link rel="alternate" type="application/rss+xml" title="Ressources de Fill" href="{SITE}/ressources/flux.xml">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/icon-96.png" sizes="96x96" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="{rel}assets/f/br.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{rel}assets/f/it.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{rel}assets/t.css?v=37">
<link rel="stylesheet" href="{rel}assets/ressources.css?v={V_CSS}">
{tete_js}
<noscript><style>.js-only{{display:none!important}}</style></noscript>
<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False, separators=(',', ':'))}</script>
</head>
"""


def pied_scripts(n):
    rel = "../" * n
    return f'<script src="{rel}assets/offre.js?v=19" defer></script>\n<script src="{rel}assets/t.js?v=37" defer></script>\n<script src="{rel}assets/ressources.js?v={V_CSS}" defer></script>\n</body>\n</html>\n'


ORG = {"@type": "Organization", "@id": SITE + "/#fill", "name": "Fill", "url": SITE + "/",
       "logo": {"@type": "ImageObject", "url": SITE + "/assets/icon-512.png", "width": 512, "height": 512},
       "parentOrganization": {"@type": "Organization", "name": "Studio ES", "url": "https://studioes.fr/"}}


def titre_plein(a):
    """Le titre en une ligne (balise title, données structurées, flux) : titre + relance, ou « titre_seo » s'il est donné."""
    if a.get("titre_seo"):
        return a["titre_seo"]
    r = a["relance"].rstrip(".")
    if r.split(" ")[0] in ("en", "dans", "avant", "pour", "à", "sans", "sous", "chez", "après"):
        return a["titre"] + " " + r
    if r.startswith("et "):
        return a["titre"] + ", " + r
    return a["titre"] + " : " + r


def carte(a, rel, h="h3", grande=False):
    return f"""<article class="ra-carte t-{slugifier(a['categorie'])}{' une' if grande else ''}" data-cat="{esc(a['categorie'])}">
  <a class="ra-carte-l" href="{rel}{a['slug']}/">
    <span class="ra-carte-i"><img src="{rel}{a['slug']}/img/{os.path.splitext(a['couverture'])[0]}-720.webp" width="720" height="900" alt="" loading="lazy" decoding="async"></span>
    <span class="ra-carte-c">
      <span class="ra-meta"><span class="ra-cat c-{slugifier(a['categorie'])}">{esc(a['categorie'])}</span><span>{esc(date_fr(a['d']))}</span><span>{a['lecture']}{NBSP}min</span></span>
      <{h} class="ra-carte-t">{esc(typo(a['titre']))} <span class="it">{esc(typo(a['relance']))}</span></{h}>
      <span class="ra-carte-d">{esc(typo(a['description']))}</span>
      <span class="ra-carte-a">Lire l’article <svg class="i" aria-hidden="true"><use href="#ar"/></svg></span>
    </span>
  </a>
</article>"""


CTA = {
    "collectivites": ("Cette communication, Fill peut la tenir avec vous.",
                      "Publications, actualités du site, affiches, bulletin : vous envoyez l’information, nous la mettons en forme et la publions après votre validation. Premier mois sans engagement.",
                      "../../collectivites/", "L’offre pour les collectivités"),
    "entreprises": ("Cette communication, Fill peut la tenir avec vous.",
                    "Publications, actualités du site, lettre aux clients, visuels : vous envoyez l’information, nous la mettons en forme et la publions après votre validation. Premier mois sans engagement.",
                    "../../entreprises/", "L’offre pour les entreprises"),
    "tous": ("Cette communication, Fill peut la tenir avec vous.",
             "Pour les collectivités comme pour les entreprises : vous envoyez l’information, nous la mettons en forme et la publions après votre validation. Premier mois sans engagement.",
             "../../formules/", "Voir les formules"),
}


def page_article(a, tous, csp, tete_js, debut, fin):
    corps, som = rendre_corps(a)
    preparer_couverture(a)
    url = f"{SITE}/ressources/{a['slug']}/"
    og = f"{url}img/partage.jpg" if os.path.isfile(os.path.join(SORTIE, a["slug"], "img", "partage.jpg")) else f"{url}img/couverture.jpg"
    titre_p = titre_plein(a)
    jsonld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "@id": url + "#article", "headline": typo(titre_p)[:110], "description": a["description"],
         "image": [f"{url}img/couverture.jpg"] + ([og] if og.endswith("partage.jpg") else []),
         "datePublished": a["d"].isoformat() + "T09:00:00+01:00", "dateModified": a["dm"].isoformat() + "T09:00:00+01:00",
         "inLanguage": "fr-FR", "articleSection": CATEGORIES[a["categorie"]], "wordCount": a["mots"],
         "timeRequired": "PT%dM" % a["lecture"], "audience": {"@type": "Audience", "audienceType": CIBLES[a["cible"]]},
         "author": {"@id": SITE + "/#fill"}, "publisher": {"@id": SITE + "/#fill"},
         "mainEntityOfPage": {"@type": "WebPage", "@id": url}, "isPartOf": {"@id": SITE + "/ressources/#collection"}},
        ORG,
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Ressources", "item": SITE + "/ressources/"},
            {"@type": "ListItem", "position": 3, "name": typo(a["titre"]), "item": url}]}]}
    page = {"titre_page": typo(titre_p) + " · Fill", "description_page": typo(a["description"]), "url": url, "og_type": "article",
            "image": og, "image_alt": typo(a.get("couverture_alt", a["titre"])),
            "og_extra": f'\n<meta property="article:published_time" content="{a["d"].isoformat()}T09:00:00+01:00">'
                        f'\n<meta property="article:modified_time" content="{a["dm"].isoformat()}T09:00:00+01:00">'
                        f'\n<meta property="article:section" content="{esc(CATEGORIES[a["categorie"]])}">'}
    autres = [x for x in tous if x["slug"] != a["slug"]]
    autres.sort(key=lambda x: (x["categorie"] == a["categorie"], x["d"], x["poids"]), reverse=True)
    autres = autres[:3]
    cta = CTA.get(a["cible"], CTA["tous"])
    sommaire = "".join(f'<li><a href="#{i}">{inline(t)}</a></li>' for i, t in som)
    maj = f'<span>Mis à jour le {esc(date_fr(a["dm"]))}</span>' if a["dm"] != a["d"] else ""
    cov720 = "img/%s-720.webp" % os.path.splitext(a["couverture"])[0]
    cov480 = "img/%s-480.webp" % os.path.splitext(a["couverture"])[0]
    h = tete(page, csp, tete_js, 2, jsonld)
    h += '<body data-rub="ressources" data-parent="../" data-parent-l="Ressources">\n'
    h += profondeur(debut, 2)
    h += f"""<main id="contenu" class="ra t-{slugifier(a['categorie'])}">
<section class="ph court ra-h">
  <div class="w ra-h-g">
    <div class="ra-h-t">
      <p class="ariane"><a href="../../">Accueil</a><span aria-hidden="true">/</span><a href="../">Ressources</a><span aria-hidden="true">/</span><span>{esc(CATEGORIES[a['categorie']])}</span></p>
      <p class="ra-meta"><span class="ra-cat c-{slugifier(a['categorie'])}">{esc(a['categorie'])}</span><span>{esc(CIBLES[a['cible']])}</span></p>
      <h1 class="d">{esc(typo(a['titre']))} <span class="it">{esc(typo(a['relance']))}</span></h1>
      <p class="ra-date"><time datetime="{a['d'].isoformat()}">Publié le {esc(date_fr(a['d']))}</time>{maj}<span>{a['lecture']}{NBSP}min de lecture</span></p>
    </div>
    <figure class="ra-h-i"><img src="{cov720}" srcset="{cov480} 480w, {cov720} 720w" sizes="(min-width: 900px) 340px, 60vw" width="720" height="900" alt="{esc(typo(a.get('couverture_alt', '')))}" fetchpriority="high"></figure>
  </div>
</section>
<section class="sec serre ra-s">
  <div class="w ra-g">
    <nav class="ra-som" aria-label="Sommaire de l’article">
      <details class="ra-som-d" open>
        <summary><span>Sommaire</span><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
        <ol>{sommaire}</ol>
      </details>
      <a class="ra-som-h" href="#contenu">Revenir en haut</a>
    </nav>
    <article class="ra-c">
      <p class="ra-chapo">{inline(a['chapo'])}</p>
{corps}
      <aside class="ra-cta dk" aria-label="Fill">
        <p class="ra-cta-t d">{esc(cta[0])}</p>
        <p>{esc(cta[1])}</p>
        <p class="ra-cta-b"><a class="bt" href="{cta[2]}">{esc(cta[3])} <span class="ar"><svg class="i"><use href="#ar"/></svg></span></a><a class="bt cl" href="../../contact/" data-cal>Prendre rendez-vous <span class="ar"><svg class="i"><use href="#ar"/></svg></span></a></p>
      </aside>
      <p class="ra-retour"><a href="../">Toutes les ressources</a></p>
    </article>
  </div>
</section>
"""
    if autres:
        h += '<section class="sec ra-aussi" aria-labelledby="ra-aussi-t"><div class="w"><h2 class="d ra-aussi-t" id="ra-aussi-t">À lire aussi</h2><div class="ra-grille">'
        h += "".join(carte(x, "../") for x in autres)
        h += "</div></div></section>\n"
    h += "</main>\n" + profondeur(fin, 2) + pied_scripts(2)
    os.makedirs(os.path.join(SORTIE, a["slug"]), exist_ok=True)
    open(os.path.join(SORTIE, a["slug"], "index.html"), "w", encoding="utf-8").write(h)
    return som


def page_index(arts, csp, tete_js, debut, fin):
    url = SITE + "/ressources/"
    cats = [c for c in CATEGORIES if any(a["categorie"] == c for a in arts)]
    jsonld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CollectionPage", "@id": url + "#collection", "url": url, "name": "Ressources · Fill", "inLanguage": "fr-FR",
         "description": "Guides, constats et études pour tenir la communication d’une commune ou d’une entreprise.",
         "publisher": {"@id": SITE + "/#fill"},
         "mainEntity": {"@type": "ItemList", "itemListElement": [
             {"@type": "ListItem", "position": i + 1, "url": f"{SITE}/ressources/{a['slug']}/", "name": typo(titre_plein(a))} for i, a in enumerate(arts)]}},
        ORG,
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Ressources", "item": url}]}]}
    page = {"titre_page": "Ressources : guides et repères pour la communication des communes et des entreprises · Fill",
            "description_page": "Guides pratiques, constats chiffrés et récits de terrain pour tenir la communication d’une commune ou d’une entreprise : calendrier, budget, site internet, réseaux sociaux, accessibilité.",
            "url": url, "og_type": "website", "image": SITE + "/assets/og.png", "image_alt": "Logo Fill et accroche « Votre communication, sans perdre le fil. »"}
    h = tete(page, csp, tete_js, 1, jsonld)
    h += '<body data-rub="ressources" data-parent="../" data-parent-l="Accueil">\n' + debut
    filtres = '<button type="button" aria-pressed="true" data-f="">Tout</button>' + "".join(
        f'<button type="button" aria-pressed="false" data-f="{esc(c)}">{esc(CATEGORIES[c])}</button>' for c in cats)
    h += f"""<main id="contenu" class="ra">
<section class="ph court ra-ih">
  <div class="w">
    <p class="ariane"><a href="../">Accueil</a><span aria-hidden="true">/</span><span>Ressources</span></p>
    <h1 class="d">Ressources <span class="it">pour tenir sa communication.</span></h1>
    <p class="lead">Guides pratiques, constats chiffrés et récits de terrain, pour les communes comme pour les entreprises. Libres de lecture et de partage.</p>
  </div>
</section>
<section class="sec serre ra-is">
  <div class="w">
    <div class="ra-filtres js-only" role="group" aria-label="Filtrer par type">{filtres}</div>
    <div class="ra-grille ra-tout">
"""
    h += "\n".join(carte(a, "", "h2", grande=(i == 0)) for i, a in enumerate(arts))
    h += f"""
      <aside class="ra-suivre{' pleine' if (len(arts) - 1) % 3 == 0 else ''}" aria-label="Suivre les ressources">
        <p class="ra-suivre-t d">Suivre les ressources <span class="it">là où vous lisez.</span></p>
        <p>Chaque guide et chaque constat paraît aussi sur Instagram et LinkedIn, en version courte.</p>
        <ul>
          <li><a href="https://www.instagram.com/fill.communication/" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://www.linkedin.com/company/fill-communication/" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="flux.xml">Flux RSS</a></li>
        </ul>
      </aside>
    </div>
  </div>
</section>
</main>
"""
    h += fin + pied_scripts(1)
    open(os.path.join(SORTIE, "index.html"), "w", encoding="utf-8").write(h)


def flux(arts):
    # date de la dernière publication (et non l'heure de construction) : le flux ne change que s'il y a du nouveau
    maintenant = dt.datetime.combine(max(a["dm"] for a in arts), dt.time(9, 0), tzinfo=dt.timezone(dt.timedelta(hours=1)))
    items = []
    for a in arts:
        u = f"{SITE}/ressources/{a['slug']}/"
        d = dt.datetime.combine(a["d"], dt.time(9, 0), tzinfo=dt.timezone(dt.timedelta(hours=1)))
        items.append(f"""    <item>
      <title>{esc(typo(titre_plein(a)))}</title>
      <link>{u}</link>
      <guid isPermaLink="true">{u}</guid>
      <pubDate>{format_datetime(d)}</pubDate>
      <category>{esc(CATEGORIES[a['categorie']])}</category>
      <description>{esc(typo(a['chapo']))}</description>
      <enclosure url="{u}img/couverture.jpg" type="image/jpeg" length="{os.path.getsize(os.path.join(SORTIE, a['slug'], 'img', 'couverture.jpg'))}"/>
    </item>""")
    x = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ressources de Fill</title>
    <link>{SITE}/ressources/</link>
    <atom:link href="{SITE}/ressources/flux.xml" rel="self" type="application/rss+xml"/>
    <description>Guides, constats et études pour tenir la communication d’une commune ou d’une entreprise.</description>
    <language>fr-FR</language>
    <lastBuildDate>{format_datetime(maintenant)}</lastBuildDate>
    <image><url>{SITE}/assets/icon-512.png</url><title>Ressources de Fill</title><link>{SITE}/ressources/</link></image>
{chr(10).join(items)}
  </channel>
</rss>
"""
    open(os.path.join(SORTIE, "flux.xml"), "w", encoding="utf-8").write(x)


def sitemap(arts):
    p = os.path.join(RACINE, "sitemap.xml")
    s = open(p, encoding="utf-8").read()
    s = re.sub(r"\s*<url><loc>https://fill\.studioes\.fr/ressources/[^<]*</loc>.*?</url>", "", s)
    plus = "\n  <url><loc>%s/ressources/</loc><lastmod>%s</lastmod></url>" % (SITE, max(a["dm"] for a in arts).isoformat())
    plus += "".join("\n  <url><loc>%s/ressources/%s/</loc><lastmod>%s</lastmod></url>" % (SITE, a["slug"], a["dm"].isoformat()) for a in arts)
    s = s.replace("\n</urlset>", plus + "\n</urlset>")
    open(p, "w", encoding="utf-8").write(s)


def llms(arts):
    p = os.path.join(RACINE, "llms.txt")
    s = open(p, encoding="utf-8").read()
    s = re.sub(r"\n## Ressources\n.*?(?=\n## |\Z)", "", s, flags=re.S).rstrip() + "\n"
    s += "\n## Ressources\n\n- [Toutes les ressources](%s/ressources/): guides, constats et études sur la communication des communes et des entreprises\n" % SITE
    s += "".join("- [%s](%s/ressources/%s/): %s\n" % (typo(titre_plein(a)), SITE, a["slug"], typo(a["description"])) for a in arts)
    open(p, "w", encoding="utf-8").write(s)


def images_partage(arts):
    """Images de partage 1200 × 630 rendues avec les polices du site (Playwright + Chrome)."""
    from playwright.sync_api import sync_playwright
    f = "file://" + os.path.join(RACINE, "assets", "f")
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path="/usr/bin/google-chrome")
        pg = b.new_page(viewport={"width": 1200, "height": 630})
        for a in arts:
            cov = "file://" + os.path.join(SORTIE, a["slug"], "img", "couverture.jpg")
            fond = {"Constat": "#FFE0D5", "Étude": "#FFE0D5"}.get(a["categorie"], "#E9E1FF")
            accent = "#9A4232" if fond == "#FFE0D5" else "#5B3F9C"
            contenu = (f"""<html><head><meta charset="utf-8"><style>
@font-face{{font-family:B;src:url({f}/br.woff2)}}@font-face{{font-family:U;font-style:italic;src:url({f}/ur-i.woff2)}}@font-face{{font-family:I;src:url({f}/it.woff2)}}
body{{margin:0;width:1200px;height:630px;background:{fond};display:grid;grid-template-columns:1fr 404px;gap:56px;padding:0 64px 0 72px;box-sizing:border-box;align-items:center;font-family:I;color:#1A1A1A}}
.c{{display:grid;gap:22px}}.k{{font:600 20px I;letter-spacing:.02em;color:{accent}}}h1{{margin:0;font:650 64px/1 B;letter-spacing:-.03em}}h1 i{{display:block;font:300 44px/1.1 U;letter-spacing:-.015em;margin-top:8px}}
.f{{font:600 22px I;color:rgba(26,26,26,.7)}}img{{width:404px;height:505px;object-fit:cover;border-radius:22px;box-shadow:0 18px 40px rgba(26,26,26,.14)}}</style></head>
<body><div class="c"><span class="k">{esc(CATEGORIES[a['categorie']])} · Ressources</span><h1>{esc(typo(a['titre']))}<i>{esc(typo(a['relance']))}</i></h1><span class="f">fill.studioes.fr</span></div><img src="{cov}"></body></html>""")
            tmp = os.path.join(SORTIE, a["slug"], "img", "_partage.html")
            open(tmp, "w", encoding="utf-8").write(contenu)
            pg.goto("file://" + tmp, wait_until="load")
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(400)
            os.remove(tmp)
            pg.screenshot(path=os.path.join(SORTIE, a["slug"], "img", "partage.jpg"), type="jpeg", quality=88)
        b.close()


def main():
    arts = [lire(os.path.join(SRC, f)) for f in sorted(os.listdir(SRC)) if f.endswith(".md") and not f[0].isupper()]
    arts = [a for a in arts if a.get("brouillon", "non") != "oui"]
    arts.sort(key=lambda a: (a["d"], a["poids"]), reverse=True)
    # Publication programmée : un article daté dans le futur (heure de Paris) n'est mis en ligne qu'à sa date.
    # Ses images sont préparées d'avance ; la page, l'index, le flux et le sitemap l'ignorent jusque-là.
    # L'action GitHub « Ressources programmées » relance cette construction chaque matin.
    auj = dt.datetime.now(dt.timezone(dt.timedelta(hours=1))).date()
    for i, x in enumerate(sys.argv):
        if x == "--date" and i + 1 < len(sys.argv):
            auj = dt.date.fromisoformat(sys.argv[i + 1])
    prog = [a for a in arts if a["d"] > auj]
    arts = [a for a in arts if a["d"] <= auj]
    csp, tete_js, debut, fin = gabarit()
    for a in arts + prog:
        preparer_couverture(a)
    if "--og" in sys.argv:
        images_partage(arts + prog)
    for a in prog:
        page = os.path.join(SORTIE, a["slug"], "index.html")
        if os.path.isfile(page):
            os.remove(page)
    for a in arts:
        page_article(a, arts, csp, tete_js, debut, fin)
    page_index(arts, csp, tete_js, debut, fin)
    flux(arts)
    sitemap(arts)
    llms(arts)
    print("%d articles en ligne : %s" % (len(arts), ", ".join(a["slug"] for a in arts)))
    if prog:
        print("programmés : %s" % ", ".join("%s (%s)" % (a["slug"], a["d"].isoformat()) for a in prog))


if __name__ == "__main__":
    main()
