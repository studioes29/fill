"""Sitemap de fill.studioes.fr : toutes les pages indexables, date de dernière modification tirée de git
(aujourd'hui pour un fichier modifié et pas encore enregistré). Usage : python3 outils/sitemap.py"""
import os, re, glob, subprocess, datetime
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUJ = datetime.date.today().isoformat()
mod = subprocess.run(['git', 'status', '--porcelain'], cwd=R, capture_output=True, text=True).stdout.split()
def date(rel):
    if rel in mod: return AUJ
    return subprocess.run(['git', 'log', '-1', '--format=%cs', '--', rel], cwd=R, capture_output=True, text=True).stdout.strip() or AUJ
L = []
for f in sorted(glob.glob(os.path.join(R, '*/index.html'))) + [os.path.join(R, 'index.html')]:
    rel = os.path.relpath(f, R)
    if rel.startswith(('espace', 'supabase', 'outils')): continue
    h = open(f, encoding='utf8').read()
    if 'http-equiv="refresh"' in h or re.search(r'<meta name="robots" content="[^"]*noindex', h): continue
    d = os.path.dirname(rel)
    L.append(('https://fill.studioes.fr/' + (d + '/' if d else ''), date(rel)))
L.sort(key=lambda x: (x[0] != 'https://fill.studioes.fr/', x[0]))
x = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
x += ['  <url><loc>%s</loc><lastmod>%s</lastmod></url>' % u for u in L] + ['</urlset>', '']
open(os.path.join(R, 'sitemap.xml'), 'w', encoding='utf8').write('\n'.join(x)); print(len(L), 'pages')
