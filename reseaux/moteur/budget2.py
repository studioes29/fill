"""Constat · « Le budget 2027 se décide maintenant » (jeudi 3 décembre 2026, 11 h), version 2 :
photo en couverture, un message par page, couverture et calendrier animés.
Rendu : python3 budget2.py ; render.py cb2-01..06 ; video.py cb2-01,cb2-02 1080 1350 <dossier>."""
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page, A, CNT
from guide2 import ico, F_D
from v2 import photo, fondu, rgb, pill, titre, rond_fleche, fin, M

N = 6
CORC, CORF = rgb(C['corc']), rgb(C['corf'])


def lg(dark=False):
    return logo(44, C['sable'], C['corc'], C['cor']) if dark else logo(44, C['encre'], C['lav'], C['cor'])


# ---------- 1 · couverture (animée) ----------
def p1():
    b = photo('mairie-grille', 0, 0, 1080, 900, 'center 40%')
    b += fondu(CORC, 0, 260, .55, 0)
    b += fondu(CORC, 420, 500, 0, 1)
    b += f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div {A("pop", 2.4, .5)} style="position:absolute;right:{M}px;top:92px">{pill("Avant le 15 avril", C["encre"], C["sable"], 58, 24, icon=ico("clock", 24, C["sable"]))}</div>'
    # « 2027 » : le 6 de 2026 laisse sa place au 7
    dig = ''.join(f'<span {A("up", .25 + i * .12, .6)} style="display:inline-block">{c}</span>' for i, c in enumerate('202'))
    last = (f'<span style="position:relative;display:inline-block;overflow:hidden;vertical-align:top">'
            f'<span {A("out", 1.25, .45)} style="position:absolute;left:0;top:0;display:block">6</span>'
            f'<span {A("up", 1.35, .55)} style="display:block">7</span></span>')
    b += (f'<div class="D" style="position:absolute;left:{M - 14}px;top:560px;font-weight:780;font-size:380px;line-height:.86;letter-spacing:-.07em;color:{C["cor"]}">'
          f'{dig}<span {A("up", .61, .6)} style="display:inline-block">{last}</span></div>')
    b += (f'<div style="position:absolute;left:{M}px;right:240px;top:920px">'
          f'<div {A("up", 1.8, .7)} class="D" style="font-weight:680;font-size:100px;line-height:.94;letter-spacing:-.045em">Le budget<br>se décide</div>'
          f'<div {A("up", 2.0, .7)} class="I" style="font-size:96px;line-height:1.02;letter-spacing:-.02em;color:{C["cort"]};margin-top:4px">maintenant.</div></div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'], anim=2.7)
    return b


# ---------- 2 · le calendrier (animé) ----------
MOIS = [('sept.', 'Chiffrage', 1), ('oct.', 'Arbitrages', 1), ('nov.', 'Arbitrages', 1), ('déc.', 'Arbitrages', 1),
        ('janv.', 'Débat', 2), ('févr.', 'Débat', 2), ('mars', '', 0), ('avr.', 'Vote', 3)]


def p2():
    b = motif(MOTIF['cor'] if False else 'rgba(255,255,255,.05)', 2300, 120, -420)
    b += head(N, 1, lg(True), C['corc'], 'rgba(248,245,242,.24)')
    b += titre('Le vote est en avril.', 'Les choix se font avant.', c1=C['sable'], c2=C['corc'], fs=88)
    tw, th, g, y0 = 214, 250, 16, 500
    for i, (m, lab, k) in enumerate(MOIS):
        x = M + (i % 4) * (tw + g); y = y0 + (i // 4) * (th + g)
        bg = {1: C['cor'], 2: 'rgba(248,245,242,.14)', 0: 'rgba(248,245,242,.06)', 3: '#fff'}[k]
        fg = {1: C['encre'], 2: C['sable'], 0: 'rgba(248,245,242,.4)', 3: C['encre']}[k]
        sub = {1: C['cort'], 2: C['corc'], 0: 'transparent', 3: C['cort']}[k]
        extra = f'<span style="position:absolute;right:20px;top:20px;width:46px;height:46px;border-radius:50%;background:{C["cor"]};display:grid;place-items:center">{check(C["encre"], 28)}</span>' if k == 3 else ''
        b += (f'<div {A("pop", .3 + i * .16, .5)} style="position:absolute;left:{x}px;top:{y}px;width:{tw}px;height:{th}px;border-radius:30px;background:{bg};padding:24px 22px;'
              f'display:flex;flex-direction:column;justify-content:space-between">{extra}'
              f'<span class="D" style="font-weight:760;font-size:54px;letter-spacing:-.04em;color:{fg}">{m}</span>'
              f'<span style="font-weight:700;font-size:21px;letter-spacing:.04em;text-transform:uppercase;color:{sub}">{lab}</span></div>')
    # repère « aujourd'hui » sur décembre
    x = M + 3 * (tw + g)
    b += (f'<div {A("drop", 1.9, .6)} style="position:absolute;left:{x + tw // 2 - 92}px;top:{y0 - 74}px;width:184px;display:flex;flex-direction:column;align-items:center">'
          f'{pill("Aujourd’hui", C["sable"], C["corf"], 50, 22)}<span style="width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:14px solid {C["sable"]}"></span></div>')
    b += (f'<div {A("up", 2.3, .6)} style="position:absolute;left:{M}px;right:{M}px;top:1080px;font-weight:550;font-size:34px;line-height:1.32;color:{C["sable"]}">'
          f'Dans beaucoup de communes, les arbitrages<br>se terminent en décembre.</div>')
    return b


# ---------- 3 · ce qui n'est pas inscrit ----------
LIGNES = ['Impression du bulletin', 'Hébergement du site', 'Cérémonie des vœux', 'Affichage et signalétique']


def p3():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 2, lg(), C['cor'], 'rgba(26,26,26,.14)')
    b += titre('Ce qui n’est pas inscrit', 'attend un an de plus.', fs=84)
    b += photo('bureau-enveloppe', 600, 430, 400, 520, 'center 60%', 32, anim=False, extra='transform:rotate(5deg);box-shadow:0 40px 80px -40px rgba(90,30,20,.6)')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:18px;height:86px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:40px;height:40px;border-radius:50%;background:{C["cor"]};display:grid;place-items:center">{check(C["encre"], 24)}</span>'
                   f'<span style="font-weight:620;font-size:29px">{t}</span></div>' for t in LIGNES)
    rows += (f'<div style="display:flex;align-items:center;gap:18px;height:96px;margin-top:6px;border-top:2px dashed rgba(185,85,67,.5)">'
             f'<span style="flex:none;width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 3px {C["cor"]}"></span>'
             f'<span style="font-weight:700;font-size:29px;color:{C["cort"]}">Publications, site, newsletter</span></div>')
    b += (f'<div class="card" style="left:{M}px;top:470px;width:640px;padding:30px 38px 22px;border-radius:38px;transform:rotate(-2.5deg)">'
          f'<div style="padding-bottom:16px"><div style="font-weight:700;font-size:20px;letter-spacing:.06em;text-transform:uppercase;color:rgba(26,26,26,.45)">Budget primitif</div>'
          f'<div class="D" style="font-weight:720;font-size:40px;letter-spacing:-.025em;margin-top:4px">Communication 2027</div></div>{rows}</div>')
    # tampon
    b += (f'<div style="position:absolute;left:560px;top:1000px;transform:rotate(-7deg);padding:14px 30px;border-radius:18px;border:6px solid {C["corf"]};'
          f'color:{C["corf"]};font-family:\'Bricolage Grotesque\';font-weight:800;font-size:54px;letter-spacing:.02em;background:rgba(255,224,213,.85)">NON PRÉVU</div>')
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:1140px;font-weight:550;font-size:32px;line-height:1.32;color:rgba(26,26,26,.78)">'
          f'Une dépense oubliée attend une décision<br>modificative, ou l’année suivante.</div>')
    return b


# ---------- 4 · entreprises ----------
PREV = [('Salon professionnel', True), ('Refonte du site', True), ('Publicité locale', True), ('La com de chaque mois', False)]


def p4():
    b = motif(MOTIF['cor'], 2300, 120, -420)
    b += head(N, 3, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    b += titre('Côté entreprises,', 'même calendrier.', fs=92, c2=C['encre'])
    b += photo('commerce-caisse', M, 440, 904, 560, 'center 35%', 40, anim=False)
    rows = ''
    for t, ok in PREV:
        if ok:
            rows += (f'<div style="display:flex;align-items:center;gap:16px;height:72px">'
                     f'<span style="flex:none;width:36px;height:36px;border-radius:50%;background:{C["cor"]};display:grid;place-items:center">{check(C["encre"], 22)}</span>'
                     f'<span style="font-weight:620;font-size:27px">{t}</span></div>')
        else:
            rows += (f'<div style="display:flex;align-items:center;gap:16px;height:80px;margin:6px -16px 0;padding:0 16px;border-radius:20px;background:{C["encre"]};color:{C["sable"]}">'
                     f'<span style="flex:none;width:36px;height:36px;border-radius:50%;box-shadow:inset 0 0 0 3px {C["cor"]};display:grid;place-items:center;font-weight:800;font-size:22px;color:{C["cor"]}">?</span>'
                     f'<span style="font-weight:700;font-size:27px">{t}</span></div>')
    b += (f'<div class="card" style="left:440px;top:740px;width:520px;padding:26px 32px 28px;border-radius:34px;transform:rotate(-2deg)">'
          f'<div class="D" style="font-weight:720;font-size:34px;letter-spacing:-.025em;padding-bottom:8px">Prévisionnel 2027</div>{rows}</div>')
    b += (f'<div style="position:absolute;left:{M}px;width:320px;top:1060px;font-weight:600;font-size:30px;line-height:1.3;color:{C["encre"]}">'
          f'Le reste se chiffre en fin d’année.<br>La com aussi.</div>')
    return b


# ---------- 5 · les montants ----------
def p5():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 4, lg(), C['cor'], 'rgba(26,26,26,.14)')
    b += titre('La ligne à prévoir,', 'au mois et à l’année.', fs=84)
    b += (f'<div class="card" style="left:{M}px;right:{M}px;top:450px;height:400px;border-radius:44px;padding:40px 48px;display:flex;flex-direction:column;justify-content:space-between">'
          f'<div style="display:flex;justify-content:space-between;align-items:center">{pill("Essentiel · 15 unités par mois", C["corc"], C["cort"], 52, 22)}'
          f'<span style="font-weight:600;font-size:22px;color:rgba(26,26,26,.5)">Prix fixe</span></div>'
          f'<div style="display:flex;align-items:flex-end;justify-content:space-between">'
          f'<div><span class="D" style="font-weight:780;font-size:190px;line-height:.8;letter-spacing:-.06em">490{NB}€</span>'
          f'<div style="margin-top:14px;font-weight:600;font-size:26px;color:rgba(26,26,26,.55)">par mois</div></div>'
          f'<div style="text-align:right;padding-bottom:4px"><span class="D" style="font-weight:760;font-size:64px;letter-spacing:-.04em;color:{C["cort"]}">5{NB}880{NB}€</span>'
          f'<div style="margin-top:6px;font-weight:600;font-size:24px;color:rgba(26,26,26,.55)">sur 12 mois</div></div></div></div>')
    for i, (n, m, a) in enumerate([('Régulier', '990', '11 880'), ('Soutenu', '1 890', '22 680')]):
        x = M + i * (444 + 16)
        b += (f'<div style="position:absolute;left:{x}px;top:870px;width:444px;height:190px;border-radius:36px;background:{C["cor"]};padding:28px 32px;display:flex;flex-direction:column;justify-content:space-between">'
              f'<span style="font-weight:700;font-size:26px">{n}</span>'
              f'<div><span class="D" style="font-weight:760;font-size:60px;letter-spacing:-.04em">{m}{NB}€</span><span style="font-weight:600;font-size:25px"> par mois</span>'
              f'<div style="font-weight:600;font-size:21px;color:{C["cort"]};margin-top:2px">{a.replace(" ", NB)}{NB}€ sur 12 mois</div></div></div>')
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:1110px;display:flex;gap:12px">'
          + pill('Premier mois sans engagement', C['encre'], C['sable'], 58, 22, icon=check(C['cor'], 24))
          + pill('Chorus Pro pour les collectivités', '#fff', C['encre'], 58, 22, icon=check(C['corf'], 24)) + '</div>')
    b += f'<div style="position:absolute;left:{M}px;top:1196px;font-weight:500;font-size:21px;color:rgba(26,26,26,.55)">TVA non applicable, art. 293 B du CGI.</div>'
    return b


def p6():
    return fin(N, 5, '#C3604D', 'Parlons de votre<br>budget 2027.', 'Premier mois sans engagement.', C['corc'])


PAGES = [(p1, C['corc'], 3.4), (p2, C['corf'], 3.0), (p3, C['corc'], 1), (p4, C['cor'], 1), (p5, C['corc'], 1), (p6, C['corf'], 1)]

if __name__ == '__main__':
    for i, (f, bg, end) in enumerate(PAGES):
        page(f'cb2-{i + 1:02d}', bg, f(), end=end)
    print('ok')
