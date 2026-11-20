"""Constat · « Le budget 2027 se décide maintenant » (jeudi 3 décembre 2026, 11 h).
Série Constat : couverture corail clair, pages ton sur ton corail. Rendu : python3 constat_budget.py puis render.py cb01..cb06."""
import guide2 as G2
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page
from guide2 import img, ico, tagc, F_D

N = 6
DARK = C['corf']


def mot(col):
    return motif(col, 2300, 120, -420)


def lg(dark=False):
    return logo(44, C['sable'], C['corc'], C['cor']) if dark else logo(44, C['encre'], C['lav'], C['cor'])


def ttl(t1, t2, dark=False, top=168, fs=92):
    tc, ic = (C['sable'], C['corc']) if dark else (C['encre'], C['cort'])
    return (f'<div style="position:absolute;left:88px;right:88px;top:{top}px"><div class="D" style="font-weight:650;font-size:{fs}px;line-height:.96;letter-spacing:-.04em;color:{tc}">{t1}</div>'
            f'<div class="I" style="font-size:{round(fs*.86)}px;line-height:1.06;letter-spacing:-.02em;color:{ic};margin-top:6px">{t2}</div></div>')


def sub(txt, top, dark=False, fs=30):
    col = 'rgba(248,245,242,.82)' if dark else 'rgba(26,26,26,.72)'
    return f'<div style="position:absolute;left:88px;right:88px;top:{top}px;font-weight:500;font-size:{fs}px;line-height:1.4;color:{col}">{txt}</div>'


MOIS = ['sept.', 'oct.', 'nov.', 'déc.', 'janv.', 'févr.', 'mars', 'avr.']


# ---------- 1 · couverture ----------
def p1():
    b = mot(MOTIF['corc'])
    b += (f'<div style="position:absolute;left:88px;top:88px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
          f'<div style="position:absolute;right:88px;top:90px">{tagc("Constat", C["cor"], C["encre"], 52, 24)}</div>')
    b += (f'<div style="position:absolute;left:88px;right:60px;top:220px"><div class="D" style="font-weight:650;font-size:124px;line-height:.92;letter-spacing:-.05em">Le budget 2027</div>'
          f'<div class="I" style="font-size:92px;line-height:1.02;letter-spacing:-.02em;color:{C["cort"]};margin-top:8px">se décide maintenant.</div></div>')
    # carte : frise des mois, septembre à décembre en avant
    cells = ''
    for i, m in enumerate(MOIS):
        on = i < 4
        cells += (f'<div style="flex:1;height:200px;border-radius:22px;background:{C["cor"] if on else "rgba(26,26,26,.05)"};display:flex;flex-direction:column;justify-content:flex-end;padding:0 0 16px 14px">'
                  f'<span style="font-weight:700;font-size:22px;color:{C["encre"] if on else "rgba(26,26,26,.4)"}">{m}</span></div>')
    b += (f'<div class="card" style="left:110px;top:560px;width:860px;padding:34px 36px 36px;border-radius:40px;transform:rotate(-2deg)">'
          f'<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="{F_D};font-weight:700;font-size:40px;letter-spacing:-.02em">Les choix</span>'
          f'<span style="font-weight:650;font-size:24px;color:rgba(26,26,26,.5)">Le vote</span></div>'
          f'<div style="display:flex;gap:10px;margin-top:22px">{cells}</div>'
          f'<div style="display:flex;justify-content:space-between;margin-top:20px;font-weight:600;font-size:23px">'
          f'<span style="color:{C["cort"]}">Septembre à décembre</span><span style="color:rgba(26,26,26,.55)">Avant le 15 avril</span></div></div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;bottom:88px;height:104px;display:flex;align-items:center;justify-content:space-between">'
          f'<span style="font-weight:600;font-size:27px;line-height:1.35;color:rgba(26,26,26,.7)">Collectivités et entreprises :<br>ce qui se joue d’ici janvier</span>'
          f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["encre"]}">{arrow(C["sable"], 42)}</span></div>')
    return b


# ---------- 2 · le calendrier réel ----------
ETAPES = [('Septembre', 'Les services chiffrent', 'leurs besoins de l’année.'),
          ('Octobre et novembre', 'Les élus arbitrent', 'entre les demandes.'),
          ('Janvier et février', 'Le débat d’orientation', 'dès 3 500 habitants.'),
          ('Avant le 15 avril', 'Le conseil vote', 'le budget primitif.')]


def p2():
    b = mot(MOTIF['corf'] if 'corf' in MOTIF else 'rgba(255,255,255,.06)')
    b += head(N, 1, lg(True), C['corc'], 'rgba(248,245,242,.24)')
    b += ttl('Le vote est en avril.', 'Les choix, avant.', dark=True)
    y0 = 480
    b += f'<div style="position:absolute;left:131px;top:{y0+30}px;width:4px;height:{3*180}px;border-radius:2px;background:rgba(248,245,242,.25)"></div>'
    for i, (q, t, s) in enumerate(ETAPES):
        y = y0 + i * 180
        on = i < 2
        dot = (f'<span style="position:absolute;left:88px;top:{y}px;width:90px;height:90px;border-radius:50%;background:{C["corc"] if on else DARK};'
               f'box-shadow:inset 0 0 0 4px {C["corc"] if on else "rgba(248,245,242,.35)"};display:grid;place-items:center;{F_D};font-weight:800;font-size:38px;color:{C["cort"] if on else "rgba(248,245,242,.7)"}">{i + 1}</span>')
        b += dot
        b += (f'<div style="position:absolute;left:214px;right:88px;top:{y - 4}px">'
              f'<div style="font-weight:700;font-size:23px;letter-spacing:.06em;text-transform:uppercase;color:{C["corc"] if on else "rgba(248,245,242,.55)"}">{q}</div>'
              f'<div style="margin-top:8px;{F_D};font-weight:650;font-size:44px;line-height:1.05;letter-spacing:-.02em;color:{C["sable"]}">{t}</div>'
              f'<div class="I" style="margin-top:2px;font-size:36px;line-height:1.1;color:{C["corc"] if on else "rgba(248,245,242,.7)"}">{s}</div></div>')
    b += (f'<div style="position:absolute;left:214px;top:{y0 + 3*180 + 175}px;display:inline-flex;align-items:center;gap:14px;height:64px;padding:0 26px;border-radius:999px;background:{C["corc"]};'
          f'font-weight:650;font-size:25px;color:{C["cort"]}">{ico("clock", 26, C["cort"])}Dans beaucoup de communes, tout se joue avant janvier</div>')
    return b


# ---------- 3 · ce qui n'est pas inscrit ----------
LIGNES = [('Impression du bulletin', '4 numéros'), ('Hébergement du site', 'Abonnement annuel'), ('Cérémonie des vœux', 'Invitations, buffet'), ('Affichage et signalétique', 'Panneaux, vitrines')]


def p3():
    b = mot(MOTIF['corc'])
    b += head(N, 2, lg(), C['cor'], 'rgba(26,26,26,.14)')
    b += ttl('Ce qui n’est pas inscrit', 'attend un an de plus.', fs=84)
    rows = ''.join(f'<div style="display:flex;justify-content:space-between;align-items:center;height:84px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="display:flex;align-items:center;gap:18px"><span style="width:38px;height:38px;border-radius:50%;background:{C["cor"]};display:grid;place-items:center">{check(C["encre"], 22)}</span>'
                   f'<span style="font-weight:600;font-size:28px">{t}</span></span><span style="font-weight:500;font-size:22px;color:rgba(26,26,26,.5)">{s}</span></div>' for t, s in LIGNES)
    rows += (f'<div style="display:flex;justify-content:space-between;align-items:center;height:96px;margin:10px -18px 0;padding:0 18px;border-radius:22px;'
             f'background:repeating-linear-gradient(135deg,rgba(255,138,107,.10) 0 14px,rgba(255,138,107,.02) 14px 28px);box-shadow:inset 0 0 0 2.5px {C["cor"]}">'
             f'<span style="display:flex;align-items:center;gap:18px"><span style="width:38px;height:38px;border-radius:50%;box-shadow:inset 0 0 0 3px {C["cor"]}"></span>'
             f'<span style="font-weight:650;font-size:28px">Publications, actualités, newsletter</span></span>'
             f'<span style="font-weight:700;font-size:22px;color:{C["cort"]}">Non prévu</span></div>')
    b += (f'<div class="card" style="left:88px;right:88px;top:470px;padding:30px 44px 40px;border-radius:40px">'
          f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:16px"><span style="{F_D};font-weight:700;font-size:36px">Communication · 2027</span>'
          f'<span style="font-weight:650;font-size:22px;color:rgba(26,26,26,.5)">Budget primitif</span></div>{rows}</div>')
    b += sub('Une dépense qui n’est pas prévue attend une décision modificative, ou l’année suivante. La com du quotidien est souvent celle qu’on oublie de chiffrer.', 1110, fs=29)
    return b


# ---------- 4 · entreprises ----------
def p4():
    b = mot(MOTIF['cor'])
    b += head(N, 3, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    b += ttl('Côté entreprises,', 'même logique.', fs=92)
    tiles = [('Salons et événements', 'Prévu', True), ('Refonte du site', 'Prévu', True), ('Publicité locale', 'Prévu', True), ('Réseaux et newsletter, chaque mois', 'À voir', False)]
    out = ''
    for i, (t, s, ok) in enumerate(tiles):
        x = 88 + (i % 2) * 462; y = 500 + (i // 2) * 250
        bg = '#fff' if ok else C['encre']
        fg = C['encre'] if ok else C['sable']
        out += (f'<div style="position:absolute;left:{x}px;top:{y}px;width:442px;height:226px;border-radius:34px;background:{bg};padding:30px 32px;box-sizing:border-box;'
                f'display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 34px 60px -36px rgba(90,30,20,.6)">'
                f'<span style="{F_D};font-weight:650;font-size:36px;line-height:1.05;letter-spacing:-.02em;color:{fg}">{t}</span>'
                f'<span style="display:inline-flex;align-self:flex-start;align-items:center;height:46px;padding:0 20px;border-radius:999px;font-weight:700;font-size:21px;'
                f'background:{C["corc"] if ok else C["cor"]};color:{C["cort"] if ok else C["encre"]}">{s}</span></div>')
    b += out
    b += sub('Les prévisions de l’an prochain se font en fin d’année. Ce qui revient chaque semaine (publications, site, newsletter) a sa place dans le même tableau.', 1040, fs=29)
    return b


# ---------- 5 · les montants ----------
FORM = [('Essentiel', '490', '5 880', '15'), ('Régulier', '990', '11 880', '35'), ('Soutenu', '1 890', '22 680', '75')]


def p5():
    b = mot(MOTIF['corc'])
    b += head(N, 4, lg(), C['cor'], 'rgba(26,26,26,.14)')
    b += ttl('La ligne à prévoir,', 'au mois et à l’année.', fs=84)
    rows = ''
    for i, (n, m, a, u) in enumerate(FORM):
        rows += (f'<div style="display:flex;align-items:center;height:132px;{"border-top:2px solid rgba(26,26,26,.07)" if i else ""}">'
                 f'<div style="flex:1"><div style="{F_D};font-weight:700;font-size:40px;letter-spacing:-.02em">{n}</div>'
                 f'<div style="margin-top:4px;font-weight:500;font-size:22px;color:rgba(26,26,26,.55)">{u}{NB}unités par mois</div></div>'
                 f'<div style="width:230px;text-align:right"><span style="{F_D};font-weight:750;font-size:44px;letter-spacing:-.03em">{m}{NB}€</span><div style="font-weight:500;font-size:20px;color:rgba(26,26,26,.5)">par mois</div></div>'
                 f'<div style="width:250px;text-align:right"><span style="{F_D};font-weight:750;font-size:44px;letter-spacing:-.03em;color:{C["cort"]}">{a}{NB}€</span><div style="font-weight:500;font-size:20px;color:rgba(26,26,26,.5)">sur 12 mois</div></div></div>')
    b += f'<div class="card" style="left:88px;right:88px;top:470px;padding:12px 44px;border-radius:40px">{rows}</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:960px;display:flex;gap:10px">'
          + ''.join(f'<span style="white-space:nowrap;display:inline-flex;align-items:center;gap:8px;height:58px;padding:0 18px;border-radius:999px;background:{C["cor"]};font-weight:650;font-size:20px;color:{C["encre"]}">{check(C["encre"], 24)}{t}</span>'
                    for t in ['Premier mois sans engagement', 'Prix fixe', 'Chorus Pro pour les collectivités']) + '</div>')
    b += sub('TVA non applicable, art. 293 B du CGI.', 1060, fs=22)
    return b


# ---------- 6 · fin ----------
def p6():
    b = motif('#C3604D', 1700, 300, -220)
    b += f'<div style="position:absolute;right:88px;top:96px">{G2.G.dashes(N, 5, C["corc"], "rgba(248,245,242,.24)")}</div>'
    b += f'<div style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center">{logo(210, C["sable"], C["corc"], C["cor"])}</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:560px;text-align:center">'
          f'<div class="D" style="font-weight:650;font-size:84px;line-height:.98;letter-spacing:-.035em;color:{C["sable"]}">Parlons de votre<br>budget 2027.</div>'
          f'<div class="I" style="font-size:46px;color:{C["corc"]};margin-top:22px">Premier mois sans engagement.</div></div>')
    b += (f'<div style="position:absolute;left:0;right:0;top:960px;display:flex;flex-direction:column;align-items:center;gap:30px">'
          f'<span style="display:inline-flex;align-items:center;gap:16px;height:100px;padding:0 46px 0 38px;border-radius:999px;background:{C["blanc"]};box-shadow:0 0 0 10px {C["cor"]};font-weight:650;font-size:40px">fill.studioes.fr</span>'
          f'<span style="font-weight:500;font-size:28px;color:rgba(248,245,242,.8)">Collectivités et entreprises, partout en France</span></div>')
    return b


PAGES = [(p1, C['corc']), (p2, DARK), (p3, C['corc']), (p4, C['cor']), (p5, C['corc']), (p6, DARK)]

TEXTE = """Le budget 2027 de votre commune se vote avant le 15 avril. Mais la plupart des choix se font maintenant, entre les demandes des services et les arbitrages des élus.

Une dépense qui n'est pas inscrite attend une décision modificative, ou l'année suivante. Si la communication doit être tenue toute l'année (publications, actualités du site, newsletter), c'est maintenant qu'elle se chiffre.

Côté entreprises, même logique : les prévisions de l'an prochain se font en fin d'année.

On a mis dans ce carrousel les montants à prévoir, au mois et sur l'année.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #communicationpublique #collectivites #budget2027 #entreprises"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'cb{i + 1:02d}', bg, f(), end=1)
    print('ok')
