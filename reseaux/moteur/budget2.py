"""Constat · « Le budget 2027 se décide maintenant » (jeudi 3 décembre 2026, 11 h), version 3 :
couverture fixe (photo budget), aucun dégradé, texte sur aplat, espaces titre / visuel / pied égaux, seul le calendrier est animé.
Rendu : python3 budget2.py ; render.py cb2-01..06 ; video.py cb2-02 1080 1350 <dossier>."""
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page, A
from guide2 import ico, F_D
from v2 import photo, pill, rond_fleche, fin, M, tflow, pied, mise, cadre, carte, OMBRE

N = 6


def lg(dark=False):
    return logo(44, C['sable'], C['corc'], C['cor']) if dark else logo(44, C['encre'], C['lav'], C['cor'])


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Avant le 15 avril", C["encre"], C["sable"], 58, 24, icon=ico("clock", 24, C["sable"]))}</div>'
    b += cadre('calc-billets', M, 196, 904, 540, 'center 45%', 40)
    b += (f'<div class="D" style="position:absolute;left:{M - 12}px;top:760px;font-weight:780;font-size:316px;line-height:.86;letter-spacing:-.07em;color:{C["cor"]}">2027</div>')
    b += (f'<div style="position:absolute;left:{M}px;right:240px;top:1056px">'
          f'<div class="D" style="font-weight:680;font-size:76px;line-height:.96;letter-spacing:-.04em">Le budget se décide</div>'
          f'<div class="I" style="font-size:74px;line-height:1.04;letter-spacing:-.02em;color:{C["cort"]};margin-top:2px">maintenant.</div></div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · le calendrier (animé : les mois avancent) ----------
MOIS = [('sept.', 'Chiffrage', 1), ('oct.', 'Arbitrages', 1), ('nov.', 'Arbitrages', 1), ('déc.', 'Arbitrages', 1),
        ('janv.', 'Débat', 2), ('févr.', 'Débat', 2), ('mars', '', 0), ('avr.', 'Vote', 3)]


def p2():
    b = motif('rgba(255,255,255,.05)', 2300, 120, -420)
    b += head(N, 1, lg(True), C['corc'], 'rgba(248,245,242,.24)')
    tw, th, g = 214, 236, 16
    v = ''
    for i, (m, lab, k) in enumerate(MOIS):
        x = (i % 4) * (tw + g); y = 70 + (i // 4) * (th + g)
        bg = {1: C['cor'], 2: 'rgba(248,245,242,.14)', 0: 'rgba(248,245,242,.06)', 3: '#fff'}[k]
        fg = {1: C['encre'], 2: C['sable'], 0: 'rgba(248,245,242,.4)', 3: C['encre']}[k]
        sub = {1: C['cort'], 2: C['corc'], 0: 'transparent', 3: C['cort']}[k]
        extra = f'<span style="position:absolute;right:20px;top:20px;width:46px;height:46px;border-radius:50%;background:{C["cor"]};display:grid;place-items:center">{check(C["encre"], 28)}</span>' if k == 3 else ''
        v += (f'<div {A("pop", .3 + i * .16, .5)} style="position:absolute;left:{x}px;top:{y}px;width:{tw}px;height:{th}px;border-radius:30px;background:{bg};padding:24px 22px;'
              f'display:flex;flex-direction:column;justify-content:space-between">{extra}'
              f'<span class="D" style="font-weight:760;font-size:54px;letter-spacing:-.04em;color:{fg}">{m}</span>'
              f'<span style="font-weight:700;font-size:21px;letter-spacing:.04em;text-transform:uppercase;color:{sub}">{lab}</span></div>')
    x = 3 * (tw + g)
    v += (f'<div {A("drop", 1.9, .6)} style="position:absolute;left:{x + tw // 2 - 92}px;top:0;width:184px;display:flex;flex-direction:column;align-items:center">'
          f'{pill("Aujourd’hui", C["sable"], C["corf"], 50, 22)}<span style="width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:14px solid {C["sable"]}"></span></div>')
    b += mise(tflow('Le vote est en avril.', 'Les choix se font avant.', 88, C['sable'], C['corc']), v, 70 + 2 * th + g,
              pied('Dans beaucoup de communes, les arbitrages<br>se terminent en décembre.', C['sable']))
    return b


# ---------- 3 · ce qui n'est pas inscrit ----------
LIGNES = [('Impression du bulletin', '4 numéros'), ('Hébergement du site', 'abonnement'), ('Cérémonie des vœux', 'janvier'), ('Affichage et signalétique', 'panneaux')]


def p3():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 2, lg(), C['cor'], 'rgba(26,26,26,.14)')
    rows = ''
    for t, s in LIGNES:
        rows += (f'<div style="display:flex;align-items:center;gap:20px;height:92px;border-top:2px solid rgba(26,26,26,.07)">'
                 f'<span style="flex:none;width:44px;height:44px;border-radius:50%;background:{C["cor"]};display:grid;place-items:center">{check(C["encre"], 26)}</span>'
                 f'<span style="flex:1;font-weight:620;font-size:30px">{t}</span>'
                 f'<span style="font-weight:600;font-size:23px;color:rgba(26,26,26,.5)">{s}</span></div>')
    rows += (f'<div style="display:flex;align-items:center;gap:20px;height:104px;margin:8px -20px 0;padding:0 20px;border-radius:24px;background:{C["corc"]}">'
             f'<span style="flex:none;width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 3px {C["corf"]}"></span>'
             f'<span style="flex:1;font-weight:700;font-size:30px;color:{C["cort"]}">Publications, site, newsletter</span>'
             f'{pill("Non prévu", C["corf"], C["sable"], 48, 21)}</div>')
    v = carte(0, 0, 904, f'<div style="padding-bottom:18px"><div style="font-weight:700;font-size:20px;letter-spacing:.06em;text-transform:uppercase;color:rgba(26,26,26,.45)">Budget primitif</div>'
              f'<div class="D" style="font-weight:720;font-size:42px;letter-spacing:-.025em;margin-top:4px">Communication 2027</div></div>{rows}', pad='34px 44px 30px', rad=40)
    b += mise(tflow('Ce qui n’est pas inscrit', 'attend un an de plus.', 84), v, 658,
              pied('Une dépense oubliée attend une décision<br>modificative, ou l’année suivante.'))
    return b


# ---------- 4 · entreprises ----------
PREV = [('Salon professionnel', True), ('Refonte du site', True), ('Publicité locale', True), ('La com de chaque mois', False)]


def p4():
    b = motif(MOTIF['cor'], 2300, 120, -420)
    b += head(N, 3, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    rows = ''
    for t, ok in PREV:
        if ok:
            rows += (f'<div style="display:flex;align-items:center;gap:16px;height:68px">'
                     f'<span style="flex:none;width:36px;height:36px;border-radius:50%;background:{C["cor"]};display:grid;place-items:center">{check(C["encre"], 22)}</span>'
                     f'<span style="font-weight:620;font-size:27px">{t}</span></div>')
        else:
            rows += (f'<div style="display:flex;align-items:center;gap:16px;height:78px;margin:6px -16px 0;padding:0 16px;border-radius:20px;background:{C["encre"]};color:{C["sable"]}">'
                     f'<span style="flex:none;width:36px;height:36px;border-radius:50%;box-shadow:inset 0 0 0 3px {C["cor"]};display:grid;place-items:center;font-weight:800;font-size:22px;color:{C["cor"]}">?</span>'
                     f'<span style="font-weight:700;font-size:27px">{t}</span></div>')
    v = cadre('commerce-caisse', 0, 0, 904, 470, 'center 35%', 40)
    v += carte(384, 250, 520, f'<div class="D" style="font-weight:720;font-size:34px;letter-spacing:-.025em;padding-bottom:6px">Prévisionnel 2027</div>{rows}', pad='26px 32px 26px', rad=34)
    b += mise(tflow('Côté entreprises,', 'même calendrier.', 92, C['encre'], C['encre']), v, 640,
              pied('Le reste se chiffre en fin d’année.<br>La com aussi.', C['encre']))
    return b


# ---------- 5 · les montants ----------
FORM = [('Essentiel', '15', '490', '5 880'), ('Régulier', '35', '990', '11 880'), ('Soutenu', '75', '1 890', '22 680')]


def p5():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 4, lg(), C['cor'], 'rgba(26,26,26,.14)')
    v = ''
    w = (904 - 2 * 16) // 3
    for i, (n, u, m, a) in enumerate(FORM):
        x = i * (w + 16)
        v += (f'<div style="position:absolute;left:{x}px;top:0;width:{w}px;height:430px;border-radius:34px;background:#fff;box-shadow:{OMBRE};padding:30px 28px;'
              f'display:flex;flex-direction:column">'
              f'<span class="D" style="font-weight:720;font-size:36px;letter-spacing:-.02em">{n}</span>'
              f'<span style="margin-top:4px;font-weight:550;font-size:21px;color:rgba(26,26,26,.55)">{u}{NB}unités par mois</span>'
              f'<span style="margin-top:auto;font-weight:600;font-size:20px;color:rgba(26,26,26,.55)">Par mois</span>'
              f'<span class="D" style="font-weight:740;font-size:56px;letter-spacing:-.035em;line-height:1.05">{m}{NB}€</span>'
              f'<span style="height:2px;background:rgba(26,26,26,.08);margin:22px 0 18px"></span>'
              f'<span style="font-weight:600;font-size:20px;color:rgba(26,26,26,.55)">À inscrire sur 12 mois</span>'
              f'<span class="D" style="font-weight:720;font-size:38px;letter-spacing:-.03em;color:{C["cort"]}">{a.replace(" ", NB)}{NB}€</span></div>')
    v += (f'<div style="position:absolute;left:0;right:0;top:462px;display:flex;gap:12px">'
          + pill('Premier mois sans engagement', C['encre'], C['sable'], 58, 22, icon=check(C['cor'], 24))
          + pill('Chorus Pro pour les collectivités', '#fff', C['encre'], 58, 22, icon=check(C['corf'], 24)) + '</div>')
    b += mise(tflow('La ligne à prévoir,', 'au mois et sur l’année.', 84), v, 520,
              pied('Prix fixes. TVA non applicable, art. 293 B du CGI.', 'rgba(26,26,26,.6)', 24))
    return b


def p6():
    return fin(N, 5, '#C3604D', 'Parlons de votre<br>budget 2027.', 'Premier mois sans engagement.', C['corc'])


PAGES = [(p1, C['corc'], 1), (p2, C['corf'], 3.0), (p3, C['corc'], 1), (p4, C['cor'], 1), (p5, C['corc'], 1), (p6, C['corf'], 1)]

if __name__ == '__main__':
    for i, (f, bg, end) in enumerate(PAGES):
        page(f'cb2-{i + 1:02d}', bg, f(), end=end)
    print('ok')
