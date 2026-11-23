"""Board « Feed Instagram » du canevas (remplace l'ancien aperçu de grille).
Entrée : feed.json = liste de posts {id, date, serie, couverture, titre, statut, cover} où cover est un /_blob/ du canevas ou null.
Grille 3 colonnes, format 3:4 comme le profil Instagram, le plus récent en haut à gauche.
Un post qui a la même couleur de couverture que le précédent est entouré en rouge.
À relancer à chaque changement de post : python3 feed.py feed.json sortie.dc.html"""
import json, sys
from datetime import date

HEAD = open('/home/claude/fill/reseaux/canevas/gen4.py').read().split("HEAD='''")[1].split("'''")[0]
COL = {'lavf': '#7052B3', 'lav': '#B8A4FF', 'lavc': '#E9E1FF', 'corf': '#B95543', 'cor': '#FF8A6B', 'corc': '#FFE0D5',
       'encre': '#1A1A1A', 'sable': '#F8F5F2'}
FONCE = {'lavf', 'corf', 'encre'}
STAT = {'programme': ('Programmé', '#1A1A1A', '#F8F5F2'), 'publie': ('Publié', '#2E7D4F', '#fff'),
        'a_valider': ('À valider', '#FF8A6B', '#1A1A1A'), 'a_produire': ('À produire', '#fff', '#1A1A1A')}
MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
JOURS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']


def fdate(s):
    d = date.fromisoformat(s)
    return f'{JOURS[d.weekday()]} {d.day} {MOIS[d.month - 1]}'


def build(posts):
    posts = sorted(posts, key=lambda p: p['date'])
    for i, p in enumerate(posts):
        p['double'] = i > 0 and posts[i - 1]['couverture'] == p['couverture']
    posts = posts[::-1]
    W, G, P = 360, 12, 28
    H = W * 4 // 3
    tiles = ''
    for k, p in enumerate(posts):
        x = P + (k % 3) * (W + G); y = 150 + (k // 3) * (H + G)
        bg = COL.get(p['couverture'], '#ddd'); fg = '#F8F5F2' if p['couverture'] in FONCE else '#1A1A1A'
        if p.get('cover'):
            inner = f'<img src="{p["cover"]}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">'
        else:
            inner = (f'<div style="position:absolute;inset:0;background:{bg};padding:30px 26px;display:flex;flex-direction:column;justify-content:center;color:{fg}">'
                     f'<div style="font:700 17px/1 Inter,system-ui;letter-spacing:.08em;text-transform:uppercase;opacity:.65">{p["serie"]}</div>'
                     f'<div style="margin-top:12px;font:700 30px/1.08 Inter,system-ui;letter-spacing:-.02em">{p["titre"]}</div></div>')
        lab, sb, sf = STAT.get(p['statut'], (p['statut'], '#fff', '#1A1A1A'))
        chips = (f'<div style="position:absolute;left:12px;right:12px;bottom:12px;display:flex;justify-content:space-between;gap:8px">'
                 f'<span style="padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.94);font:650 16px Inter,system-ui;color:#1A1A1A">{fdate(p["date"])}</span>'
                 f'<span style="padding:7px 12px;border-radius:999px;background:{sb};font:650 16px Inter,system-ui;color:{sf};box-shadow:0 0 0 1px rgba(26,26,26,.12)">{lab}</span></div>')
        ring = 'box-shadow:0 0 0 6px #E5322D;' if p['double'] else ''
        tiles += f'<div style="position:absolute;left:{x}px;top:{y}px;width:{W}px;height:{H}px;overflow:hidden;background:{bg};{ring}">{inner}{chips}</div>'
    rows = (len(posts) + 2) // 3
    TH = 150 + rows * (H + G) + 90
    doubles = sum(p['double'] for p in posts)
    alerte = (f'<span style="color:#E5322D">{doubles} couverture{"s" if doubles > 1 else ""} de la même couleur que la précédente (entourée{"s" if doubles > 1 else ""} en rouge)</span>'
              if doubles else 'Aucune couverture de la même couleur que la précédente')
    head = (f'<div style="position:absolute;left:{P}px;right:{P}px;top:34px;font-family:Inter,system-ui;color:#1A1A1A">'
            f'<div style="font-weight:750;font-size:34px;letter-spacing:-.02em">Feed Instagram</div>'
            f'<div style="margin-top:8px;font-weight:550;font-size:19px;color:rgba(26,26,26,.6)">Le plus récent en haut à gauche. Couleur unie : post pas encore produit. {alerte}.</div></div>')
    foot = f'<div style="position:absolute;left:{P}px;top:{TH - 60}px;font:550 16px Inter,system-ui;color:rgba(26,26,26,.5)">Mis à jour à chaque changement de post. Version dynamique : Hors-champ, Réseaux, onglet Feed.</div>'
    body = f'<div style="position:relative;width:1160px;height:{TH}px;background:#fff">{head}{tiles}{foot}</div>'
    return HEAD % ('Feed Instagram', body, 1160, TH), TH


if __name__ == '__main__':
    html, h = build(json.load(open(sys.argv[1])))
    open(sys.argv[2], 'w').write(html)
    print(h)
