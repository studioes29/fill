import math, json, os
OUT = '/home/claude/canvas/project'
IMG = '/_blob/22badff27bf27e5d95a9935b25128a66'

C = dict(lavf='#7052B3', lav='#B8A4FF', lavc='#E9E1FF', lavt='#5B3F9C',
         corf='#B95543', cor='#FF8A6B', corc='#FFE0D5', cort='#9A4232',
         encre='#1A1A1A', sable='#F8F5F2', gris='#E2DBD3', blanc='#FFFFFF')
MOTIF = {'lavc': '#DDD2FF', 'lav': '#AB95FB', 'lavf': '#7C5FC2', 'corc': '#FFD3C4',
         'cor': '#F98063', 'encre': '#242128', 'sable': '#EFEAE4'}
D = "'Bricolage Grotesque','Arial Black',sans-serif"
F = "'Inter Tight','Helvetica Neue',Arial,sans-serif"
SF = "'Urbanist','Avenir Next',sans-serif"
FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Bricolage+Grotesque:opsz,wght@12..96,300..800&amp;family=Inter+Tight:wght@400..800'
         '&amp;family=Urbanist:ital,wght@1,200..600&amp;display=swap">')
NB = ' '  # espace insécable

L1 = 'M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600'
L2 = 'M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575'
L2m = 'M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C990 662 1030 640 1052 600'
FI = ('<path d="M100 700V262C100 158 168 90 274 90H300V214H282C246 214 224 236 224 274V700Z"/>'
      '<rect x="18" y="330" width="282" height="104" rx="8"/><rect x="360" y="330" width="124" height="370" rx="8"/>'
      '<circle cx="422" cy="178" r="72"/>')


def logo(h, fi=C['encre'], l1=C['lav'], l2=C['cor']):
    w = round(h * 1376 / 720)
    return (f'<svg viewBox="0 0 1376 720" width="{w}" height="{h}" role="img" aria-label="Fill" style="display: block; overflow: visible">'
            f'<g fill="{fi}">{FI}</g><g fill="none" stroke-width="96" stroke-linecap="round" stroke-linejoin="round">'
            f'<path stroke="{l1}" d="{L1}"/><path stroke="{l2}" d="{L2}"/></g></svg>')


def mono(h, col):
    return logo(h, col, col, col)


def motif(col, h, left, top, rot=0, op=1):
    w = round(h * 610 / 720)
    return (f'<svg viewBox="500 0 610 720" width="{w}" height="{h}" aria-hidden="true" '
            f'style="position: absolute; left: {left}px; top: {top}px; transform: rotate({rot}deg); opacity: {op}; pointer-events: none">'
            f'<g fill="none" stroke="{col}" stroke-width="96" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="{L1}"/><path d="{L2m}"/></g></svg>')


def dashes(n, act, on, off, w=44):
    s = ''.join(f'<span style="display: block; width: {w}px; height: 6px; border-radius: 3px; background: {on if i == act else off}"></span>' for i in range(n))
    return f'<div style="display: flex; gap: 10px">{s}</div>'


def link_icon(col):
    return (f'<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true" fill="none" stroke="{col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4l-1.3 1.3"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.3-1.3"/></svg>')


def arrow(col, s=30):
    return (f'<svg viewBox="0 0 24 24" width="{s}" height="{s}" aria-hidden="true" fill="none" stroke="{col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>')


def check(col, s=26):
    return (f'<svg viewBox="0 0 24 24" width="{s}" height="{s}" aria-hidden="true" fill="none" stroke="{col}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>')


def cta(text, accent, bg=C['blanc'], fg=C['encre']):
    return (f'<div style="display: inline-flex; align-items: center; gap: 16px; height: 96px; padding: 0 44px 0 36px; border-radius: 999px; background: {bg}; color: {fg}; '
            f'font-family: {F}; font-weight: 600; font-size: 38px; letter-spacing: -0.01em; box-shadow: 0 0 0 10px {accent}">{link_icon(accent if bg == C["blanc"] else fg)}<span>{text}</span></div>')


def tag(text, bg, fg=C['encre'], size=24):
    return (f'<span style="display: inline-flex; align-items: center; height: {round(size*1.9)}px; padding: 0 {round(size*0.8)}px; border-radius: 999px; background: {bg}; color: {fg}; '
            f'font-family: {F}; font-weight: 650; font-size: {size}px; letter-spacing: 0.01em; white-space: nowrap">{text}</span>')


def wavy(size, lobes=14, amp=0.055):
    pts = []
    r0 = size / 2
    for i in range(360):
        t = i / 360 * 2 * math.pi
        r = r0 * (1 - amp + amp * math.cos(lobes * t))
        pts.append(f'{r0 + r*math.cos(t):.1f} {r0 + r*math.sin(t):.1f}')
    return 'M' + ' L'.join(pts) + 'Z'


CHROME = ('conic-gradient(from 20deg, #FFFFFF, #B39CFF 9%, #5C5784 17%, #9BE6FF 25%, #FFFFFF 32%, #FF9EC6 42%, '
          '#6E6A8C 50%, #FFFFFF 57%, #9BEFD4 66%, #7E62D9 76%, #FFC9B5 87%, #FFFFFF)')


def pastille(size, inner):
    return (f'<div style="position: relative; width: {size}px; height: {size}px; flex: none">'
            f'<div style="position: absolute; inset: 0; clip-path: path(\'{wavy(size)}\'); background: {CHROME}"></div>'
            f'<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; text-align: center">{inner}</div></div>')


SH = '0 50px 90px -45px rgba(26,26,26,.5)'


def page(title, w, h, body, props=None):
    p = {"$preview": {"width": w, "height": h}}
    if props:
        p.update(props)
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONTS}
<style>
body{{margin:0}}
</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{json.dumps(p, ensure_ascii=False)}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''


def frame(bg, inner, motif_html=''):
    return (f'<div style="position: relative; width: 1080px; height: 1350px; overflow: hidden; background: {bg}; font-family: {F}; color: {C["encre"]}">'
            f'{motif_html}{inner}</div>')


def hl(t, col):
    return f'<span style="color: {col}">{t}</span>'


def statement(text, col, size=52):
    return (f'<p style="margin: 0; font-family: {F}; font-weight: 650; font-size: {size}px; line-height: 1.14; letter-spacing: -0.022em; color: {col}; text-wrap: pretty">{text}</p>')


def header_row(logo_html, n, act, on, off, top=820):
    return (f'<div style="position: absolute; left: 88px; right: 88px; top: {top}px; display: flex; align-items: center; justify-content: space-between">'
            f'{logo_html}{dashes(n, act, on, off)}</div>')


import re
def write(name, title, w, h, body):
    body = re.sub(r'(\d) (h|€|%|jours|unités|j|px|°)(?=[\s<.,)])', lambda m: m.group(1) + NB + m.group(2), body)
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(page(title, w, h, body))


# ============ L1 : accroche de lancement (lavande clair, typo) ============
def L1b():
    m = motif(MOTIF['lavc'], 1500, 360, -60, 0)
    inner = f'''
<div style="position: absolute; left: 88px; top: 88px; right: 88px; display: flex; align-items: center; justify-content: space-between">{logo(52)}{dashes(7, 0, C['lavf'], 'rgba(26,26,26,.14)')}</div>
<div style="position: absolute; left: 88px; right: 88px; top: 330px; display: flex; flex-direction: column; gap: 30px">
<h1 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 118px; line-height: 0.98; letter-spacing: -0.035em; color: {C['encre']}; text-wrap: balance">Quand la personne qui fait la com n’est pas là,</h1>
<p style="margin: 0; font-family: {SF}; font-style: italic; font-weight: 300; font-size: 84px; line-height: 1.04; letter-spacing: -0.02em; color: {C['lavt']}">la com <span style="position: relative; display: inline-block">s’arrête.<span style="position: absolute; left: 4px; right: 18px; bottom: -14px; height: 12px; border-radius: 6px; background: {C['cor']}"></span></span></p>
</div>
<div style="position: absolute; left: 88px; right: 88px; bottom: 88px; display: flex; align-items: center; justify-content: space-between">
<p style="margin: 0; font-family: {F}; font-weight: 500; font-size: 34px; line-height: 1.3; color: rgba(26,26,26,.72); max-width: 600px">Ce qu’on voit dans les communes et les PME, et ce qu’on peut y faire.</p>
<div style="display: flex; align-items: center; justify-content: center; width: 112px; height: 112px; border-radius: 50%; background: {C['encre']}">{arrow(C['sable'], 44)}</div>
</div>'''
    return frame(C['lavc'], inner, m)


# ============ L2 : trois situations (lavande, éventail de cartes) ============
def sitcard(bg, label, title, rot, left, top, z, w=400, h=520, fg=C['encre'], lab=None, big=False, side='l'):
    lab = lab or 'rgba(26,26,26,.6)'
    al = 'flex-end' if side == 'r' else 'flex-start'
    ta = 'right' if side == 'r' else 'left'
    return (f'<div style="position: absolute; left: {left}px; top: {top}px; width: {w}px; height: {h}px; transform: rotate({rot}deg); z-index: {z}; '
            f'box-sizing: border-box; padding: 40px; border-radius: 40px; background: {bg}; box-shadow: {SH}; display: flex; flex-direction: column; justify-content: space-between; align-items: {al}; text-align: {ta}">'
            f'<span style="font-family: {F}; font-weight: 650; font-size: 24px; letter-spacing: 0.01em; color: {lab}">{label}</span>'
            f'<span style="max-width: {320 if big else 230}px; font-family: {D}; font-weight: 650; font-size: {60 if big else 46}px; line-height: 1.0; letter-spacing: -0.03em; color: {fg}">{title}</span></div>')


def L2b():
    m = motif(MOTIF['lav'], 1300, -260, 380, -8)
    cards = (sitcard(C['lavc'], 'Collectivités', f'Pas de service com', -8, 30, 200, 1)
             + sitcard(C['blanc'], 'Entreprises', f'Pas envie de recruter', 8, 650, 200, 1, side='r')
             + sitcard(C['encre'], 'Partout', f'Un service débordé, ou absent', 0, 330, 120, 2, 420, 600, C['sable'], 'rgba(248,245,242,.66)', True))
    inner = f'''{cards}
{header_row(logo(44, C['encre'], C['encre'], C['encre']), 7, 1, C['encre'], 'rgba(26,26,26,.18)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Trois situations, une même suite{NB}: le site n’est plus à jour, {hl("les réseaux se taisent", C["lavt"])}, l’affiche part trop tard.', C['encre'])}</div>'''
    # lavt sur lav : contraste faible, on passe le surlignage en blanc
    inner = inner.replace(hl("les réseaux se taisent", C["lavt"]), f'<span style="background: {C["lavc"]}; border-radius: 10px; padding: 0 0.14em; -webkit-box-decoration-break: clone; box-decoration-break: clone">les réseaux se taisent</span>')
    return frame(C['lav'], inner, m)


# ============ L3 : comment ça marche (encre, cartes flottantes) ============
def L3b():
    m = motif(MOTIF['encre'], 1500, 420, -200, 0)
    mail = f'''<div style="position: absolute; left: 70px; top: 150px; width: 600px; transform: rotate(-4deg); box-sizing: border-box; padding: 36px; border-radius: 36px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 22px">
<div style="display: flex; align-items: center; gap: 18px"><span style="display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: {C['lavc']}; color: {C['lavt']}; font-family: {F}; font-weight: 700; font-size: 24px">SI</span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: {F}; font-weight: 650; font-size: 26px; color: {C['encre']}">Mairie de Saint-Ivenec</span><span style="font-family: {F}; font-weight: 500; font-size: 22px; color: rgba(26,26,26,.6)">à fill@studioes.fr</span></span>
<span style="margin-left: auto; font-family: {F}; font-weight: 500; font-size: 22px; color: rgba(26,26,26,.5)">8 h 12</span></div>
<p style="margin: 0; max-width: 430px; font-family: {F}; font-weight: 500; font-size: 27px; line-height: 1.38; color: {C['encre']}">Bonjour, à annoncer{NB}: Marché de Noël, samedi 12 décembre, 10 h à 18 h, place de la mairie. Photo jointe.</p>
<div style="display: flex; gap: 12px"><span style="width: 120px; height: 84px; border-radius: 16px; background: {C['lav']}"></span><span style="width: 120px; height: 84px; border-radius: 16px; background: {C['lavc']}"></span></div></div>'''
    val = f'''<div style="position: absolute; left: 590px; top: 330px; width: 420px; transform: rotate(5deg); z-index: 2; box-sizing: border-box; padding: 28px; border-radius: 36px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; align-items: center; justify-content: space-between">{logo(30)}<span style="font-family: {F}; font-weight: 600; font-size: 20px; color: rgba(26,26,26,.55)">À valider</span></div>
<div style="height: 300px; border-radius: 22px; background: {C['lavf']}; position: relative; overflow: hidden; box-sizing: border-box; padding: 28px; display: flex; flex-direction: column; justify-content: flex-end">
<span style="position: absolute; right: -30px; top: -40px; width: 220px; height: 220px; border-radius: 50%; background: {C['lav']}"></span>
<span style="position: relative; font-family: {D}; font-weight: 700; font-size: 46px; line-height: 0.95; letter-spacing: -0.03em; color: {C['sable']}">Marché<br>de Noël</span>
<span style="position: relative; margin-top: 10px; font-family: {F}; font-weight: 600; font-size: 19px; color: {C['lavc']}">Samedi 12 décembre</span></div>
<div style="display: flex; gap: 12px"><span style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; height: 64px; border-radius: 999px; background: {C['encre']}; color: {C['sable']}; font-family: {F}; font-weight: 650; font-size: 23px">{check(C['sable'], 24)}Valider</span>
<span style="flex: 1; display: flex; align-items: center; justify-content: center; height: 64px; border-radius: 999px; box-shadow: inset 0 0 0 2px rgba(26,26,26,.2); color: {C['encre']}; font-family: {F}; font-weight: 650; font-size: 23px">Corriger</span></div></div>'''
    pub = f'''<div style="position: absolute; left: 110px; top: 610px; z-index: 3; display: inline-flex; align-items: center; gap: 14px; height: 84px; padding: 0 32px 0 18px; border-radius: 999px; background: {C['lav']}; box-shadow: {SH}; font-family: {F}; font-weight: 650; font-size: 28px; color: {C['encre']}">
<span style="display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 50%; background: {C['encre']}">{check(C['lav'], 28)}</span>Publié sur le site et Facebook</div>'''
    inner = f'''{mail}{val}{pub}
{header_row(logo(44, C['sable']), 7, 3, C['lav'], 'rgba(248,245,242,.2)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Vous demandez par mail. Fill produit {hl("sous 2 jours", C["lav"])}, vous validez par un simple lien, et c’est publié.', C['sable'])}</div>'''
    return frame(C['encre'], inner, m)


# ============ L4 : les formules (lavande foncé, éventail) ============
def fcard(name, price, units, rot, left, top, z, dark=False, w=360, h=500, side='l'):
    bg = C['encre'] if dark else C['blanc']
    fg = C['sable'] if dark else C['encre']
    mu = 'rgba(248,245,242,.66)' if dark else 'rgba(26,26,26,.6)'
    acc = C['lav'] if dark else C['lavc']
    acct = C['encre'] if dark else C['lavt']
    return (f'<div style="position: absolute; left: {left}px; top: {top}px; width: {w}px; height: {h}px; transform: rotate({rot}deg); z-index: {z}; box-sizing: border-box; padding: 40px; border-radius: 40px; '
            f'background: {bg}; box-shadow: {SH}; display: flex; flex-direction: column; justify-content: space-between; align-items: {"flex-end" if side == "r" else "flex-start"}; text-align: {"right" if side == "r" else "left"}">'
            f'<span style="font-family: {D}; font-weight: 650; font-size: 46px; letter-spacing: -0.03em; color: {fg}">{name}</span>'
            f'<span style="display: flex; flex-direction: column; gap: 18px; align-items: {"flex-end" if side == "r" else "flex-start"}"><span style="font-family: {D}; font-weight: 700; font-size: {84 if dark else 64}px; line-height: 0.9; letter-spacing: -0.04em; color: {fg}">{price}</span>'
            f'<span style="font-family: {F}; font-weight: 500; font-size: 24px; color: {mu}">par mois</span>'
            f'{tag(units, acc, acct, 24)}</span></div>')


def L4b():
    m = motif(MOTIF['lavf'], 1500, 380, -150, 0)
    cards = (fcard('Essentiel', f'490{NB}€', f'15 unités', -8, 30, 210, 1, w=400)
             + fcard('Soutenu', f'1{NB}890{NB}€', f'75 unités', 8, 650, 210, 1, w=400, side='r')
             + fcard('Régulier', f'990{NB}€', f'35 unités', 0, 340, 130, 2, True, 400, 580))
    inner = f'''{cards}
{header_row(logo(44, C['sable'], C['lav'], C['cor']), 7, 5, C['lavc'], 'rgba(248,245,242,.24)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Trois abonnements, {hl("des tarifs publics", C["lavc"])}. Premier mois sans engagement, opérationnel sous 24 h.', C['sable'])}</div>'''
    inner = inner.replace(f'color: {C["sable"]}; text-wrap', f'color: {C["sable"]}; text-wrap')
    return frame(C['lavf'], inner, m)


# ============ L5 : dernière page (sable, logo original) ============
def L5b():
    m = motif(MOTIF['sable'], 1700, 300, -220, 0)
    inner = f'''
<div style="position: absolute; left: 0; right: 0; top: 330px; display: flex; flex-direction: column; align-items: center; gap: 56px">
{logo(220)}
<p style="margin: 0; text-align: center; font-family: {D}; font-weight: 650; font-size: 76px; line-height: 1.0; letter-spacing: -0.032em; color: {C['encre']}">Votre communication,<br><span style="font-family: {SF}; font-style: italic; font-weight: 300; font-size: 64px; letter-spacing: -0.02em">sans perdre le fil.</span></p>
</div>
<div style="position: absolute; left: 0; right: 0; bottom: 150px; display: flex; flex-direction: column; align-items: center; gap: 34px">
{cta('fill.studioes.fr', C['lav'])}
<span style="font-family: {F}; font-weight: 500; font-size: 28px; color: rgba(26,26,26,.6)">Service communication externalisé, pour les collectivités et les entreprises</span></div>
<div style="position: absolute; right: 88px; top: 88px">{dashes(7, 6, C['lavf'], 'rgba(26,26,26,.14)')}</div>'''
    return frame(C['sable'], inner, m)


# ============ G1 : couverture de guide (lavande foncé) ============
def calendar():
    days = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    marked = {1, 3, 4, 8, 10, 12, 15, 17, 18, 22, 24, 31}
    head = ''.join(f'<span style="text-align: center; font-family: {F}; font-weight: 650; font-size: 20px; color: rgba(26,26,26,.45)">{d}</span>' for d in days)
    cells = '<span></span>'  # 1er décembre 2026 = mardi
    for d in range(1, 32):
        if d in marked:
            cells += f'<span style="display: flex; align-items: center; justify-content: center; height: 58px; border-radius: 50%; background: {C["lav"]}; font-family: {F}; font-weight: 700; font-size: 23px; color: {C["encre"]}">{d}</span>'
        else:
            cells += f'<span style="display: flex; align-items: center; justify-content: center; height: 58px; font-family: {F}; font-weight: 500; font-size: 23px; color: rgba(26,26,26,.55)">{d}</span>'
    return (f'<div style="position: absolute; left: 330px; top: 120px; width: 600px; transform: rotate(5deg); box-sizing: border-box; padding: 40px; border-radius: 40px; background: {C["blanc"]}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 22px">'
            f'<div style="display: flex; align-items: baseline; justify-content: space-between"><span style="font-family: {D}; font-weight: 650; font-size: 40px; letter-spacing: -0.03em; color: {C["encre"]}">Décembre 2026</span>'
            f'<span style="font-family: {F}; font-weight: 650; font-size: 22px; color: {C["lavt"]}">12 contenus</span></div>'
            f'<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px">{head}{cells}</div></div>')


def G1b():
    m = motif(MOTIF['lavf'], 1600, -420, 200, -6)
    back = (f'<div style="position: absolute; left: 150px; top: 200px; width: 520px; height: 600px; transform: rotate(-7deg); border-radius: 40px; background: {C["lav"]}; box-shadow: {SH}; box-sizing: border-box; padding: 40px; display: flex; flex-direction: column; gap: 16px">'
            + ''.join(f'<span style="height: 22px; width: {w}%; border-radius: 11px; background: rgba(26,26,26,.12)"></span>' for w in (70, 90, 55, 80, 40)) + '</div>')
    inner = f'''{back}{calendar()}
<div style="position: absolute; left: 88px; top: 88px">{tag('Guide · décembre', C['lavc'], C['lavt'], 26)}</div>
<div style="position: absolute; left: 88px; right: 88px; bottom: 88px; display: flex; flex-direction: column; gap: 22px">
<h1 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 132px; line-height: 0.94; letter-spacing: -0.04em; color: {C['sable']}">La com de décembre</h1>
<p style="margin: 0; font-family: {SF}; font-style: italic; font-weight: 300; font-size: 54px; line-height: 1.08; letter-spacing: -0.015em; color: {C['lavc']}">12 contenus datés, textes prêts à copier, pour une commune et une entreprise.</p>
<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 18px">{logo(40, C['sable'])}{dashes(10, 0, C['lavc'], 'rgba(248,245,242,.24)', 34)}</div></div>'''
    return frame(C['lavf'], inner, m)


# ============ G2 : page intérieure de guide (sable) ============
def textcard(label, lbg, lfg, text):
    return (f'<div style="box-sizing: border-box; padding: 40px; border-radius: 36px; background: {C["blanc"]}; display: flex; flex-direction: column; gap: 22px">'
            f'<div style="display: flex; align-items: center; justify-content: space-between">{tag(label, lbg, lfg, 24)}'
            f'<span style="font-family: {F}; font-weight: 600; font-size: 22px; color: rgba(26,26,26,.5)">Texte à reprendre</span></div>'
            f'<p style="margin: 0; font-family: {F}; font-weight: 500; font-size: 33px; line-height: 1.36; color: {C["encre"]}">{text}</p></div>')


def G2b():
    m = motif(MOTIF['sable'], 1300, 620, 640, 0)
    inner = f'''
<div style="position: absolute; left: 88px; right: 88px; top: 88px; display: flex; align-items: center; justify-content: space-between">
<span style="display: flex; align-items: center; gap: 22px">{logo(40)}<span style="font-family: {F}; font-weight: 600; font-size: 26px; color: rgba(26,26,26,.55)">La com de décembre</span></span>{dashes(10, 4, C['lavf'], 'rgba(26,26,26,.14)', 34)}</div>
<div style="position: absolute; left: 88px; right: 88px; top: 210px; display: flex; flex-direction: column; gap: 14px">
<span style="font-family: {SF}; font-style: italic; font-weight: 400; font-size: 46px; color: {C['lavt']}">Lundi 14 décembre</span>
<h2 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 84px; line-height: 0.98; letter-spacing: -0.035em; color: {C['encre']}; text-wrap: balance">Annoncer les horaires des fêtes</h2></div>
<div style="position: absolute; left: 88px; right: 88px; top: 470px; display: flex; flex-direction: column; gap: 24px">
{textcard('Commune', C['lavc'], C['lavt'], f'Pendant les fêtes, la mairie vous accueille du lundi au vendredi, de 9 h à 12 h. Fermeture les 24 et 31 décembre à 12 h. Belles fêtes de fin d’année{NB}!')}
{textcard('Entreprise', C['corc'], C['cort'], f'Nos horaires pendant les fêtes{NB}: ouvert jusqu’au 23 décembre, fermé du 24 au 27, réouverture le lundi 28 à 9 h. Merci pour cette année à vos côtés.')}
</div>
<div style="position: absolute; left: 88px; right: 88px; bottom: 80px; display: flex; align-items: center; justify-content: space-between">
<span style="font-family: {F}; font-weight: 600; font-size: 26px; color: rgba(26,26,26,.6)">À publier une semaine avant · site, réseaux, affichage</span>
<span style="font-family: {F}; font-weight: 600; font-size: 26px; color: rgba(26,26,26,.6)">5 / 10</span></div>'''
    return frame(C['sable'], inner, m)


# ============ G3 : fin de guide (lavande clair) ============
def G3b():
    m = motif(MOTIF['lavc'], 1500, -300, 120, -6)
    doc = f'''<div style="position: absolute; left: 160px; top: 230px; width: 380px; height: 470px; transform: rotate(-6deg); border-radius: 36px; background: {C['lav']}; box-shadow: {SH}"></div>
<div style="position: absolute; left: 470px; top: 140px; width: 440px; height: 560px; transform: rotate(6deg); box-sizing: border-box; padding: 40px; border-radius: 36px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 18px">
{logo(30)}<span style="margin-top: 20px; font-family: {D}; font-weight: 650; font-size: 46px; line-height: 0.98; letter-spacing: -0.03em">La com de décembre</span>
{''.join(f'<span style="height: 16px; width: {w}%; border-radius: 8px; background: {C["lavc"]}"></span>' for w in (92, 80, 88, 60, 84, 70, 50))}</div>

<div style="position: absolute; left: 420px; top: 610px; z-index: 2; display: flex; align-items: center; justify-content: center; width: 150px; height: 150px; border-radius: 50%; background: {C['encre']}; box-shadow: {SH}">
<svg viewBox="0 0 24 24" width="60" height="60" aria-hidden="true" fill="none" stroke="{C['lav']}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/></svg></div>'''
    inner = f'''<div style="position: absolute; left: 0; top: 0">{doc}</div>
{header_row(logo(44), 10, 9, C['lavf'], 'rgba(26,26,26,.14)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px; display: flex; flex-direction: column; gap: 40px; align-items: flex-start">
{statement(f'Ce guide en version modifiable{NB}: {hl("les textes à copier", C["lavt"])} et le calendrier à imprimer.', C['encre'])}
{cta('fill.studioes.fr', C['lav'])}</div>'''
    return frame(C['lavc'], inner, m)


# ============ P1 : constat collectivités (lavande, typo + carte budget) ============
def P1b():
    m = motif(MOTIF['lav'], 1500, 420, 300, 0)
    rows = [('Fournitures administratives', f'4{NB}200{NB}€'), ('Fêtes et cérémonies', f'12{NB}500{NB}€'), ('Communication', '?')]
    r = ''
    for i, (a, b) in enumerate(rows):
        last = i == 2
        r += (f'<div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; box-shadow: inset 0 {"0" if last else "-2px"} 0 rgba(26,26,26,.08)">'
              f'<span style="font-family: {F}; font-weight: {650 if last else 500}; font-size: 27px; color: {C["encre"]}">{a}</span>'
              + (f'<span style="display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: {C["cor"]}; font-family: {D}; font-weight: 700; font-size: 34px; color: {C["encre"]}">?</span>' if last else
                 f'<span style="font-family: {F}; font-weight: 600; font-size: 27px; color: rgba(26,26,26,.6)">{b}</span>') + '</div>')
    card = (f'<div style="position: absolute; left: 380px; top: 120px; width: 620px; transform: rotate(4deg); box-sizing: border-box; padding: 40px 44px; border-radius: 40px; background: {C["blanc"]}; box-shadow: {SH}">'
            f'<span style="font-family: {F}; font-weight: 650; font-size: 22px; color: rgba(26,26,26,.55)">Budget primitif 2027 · Fonctionnement</span><div style="margin-top: 14px">{r}</div></div>')
    inner = f'''{card}
<div style="position: absolute; left: 88px; right: 88px; bottom: 210px; display: flex; flex-direction: column; gap: 26px">
<h1 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 116px; line-height: 0.96; letter-spacing: -0.04em; color: {C['encre']}">Le budget 2027 se décide maintenant.</h1>
<p style="margin: 0; font-family: {SF}; font-style: italic; font-weight: 300; font-size: 54px; line-height: 1.06; letter-spacing: -0.02em; color: {C['encre']}">La communication y a-t-elle sa ligne{NB}?</p></div>
<div style="position: absolute; left: 88px; right: 88px; bottom: 88px; display: flex; align-items: center; justify-content: space-between">{mono(44, C['encre'])}<span style="font-family: {F}; font-weight: 600; font-size: 28px; color: {C['encre']}">fill.studioes.fr</span></div>'''
    return frame(C['lav'], inner, m)


# ============ P2 : constat entreprises (corail clair, carte page) ============
def P2b():
    m = motif(MOTIF['corc'], 1500, 400, -150, 0)
    thumbs = ''.join(f'<span style="aspect-ratio: 4 / 5; border-radius: 14px; background: {c}"></span>' for c in ('#F4E9E4', '#EFE2DC', '#F4E9E4', '#EFE2DC', '#F4E9E4', '#EFE2DC'))
    card = f'''<div style="position: absolute; left: 150px; top: 120px; width: 600px; transform: rotate(-4deg); box-sizing: border-box; padding: 36px; border-radius: 40px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 26px">
<div style="display: flex; align-items: center; gap: 20px"><span style="display: flex; align-items: center; justify-content: center; width: 84px; height: 84px; border-radius: 50%; background: {C['corc']}; font-family: {D}; font-weight: 700; font-size: 30px; color: {C['cort']}">AB</span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: {F}; font-weight: 650; font-size: 30px">Atelier Brocéliande</span><span style="font-family: {F}; font-weight: 500; font-size: 23px; color: rgba(26,26,26,.55)">Menuiserie · 12 salariés</span></span></div>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; opacity: .8">{thumbs}</div></div>'''
    badge = f'''<div style="position: absolute; left: 380px; top: 600px; z-index: 2; transform: rotate(4deg); display: inline-flex; align-items: center; gap: 16px; height: 96px; padding: 0 36px 0 20px; border-radius: 999px; background: {C['encre']}; box-shadow: {SH}; font-family: {F}; font-weight: 650; font-size: 30px; white-space: nowrap; color: {C['sable']}">
<span style="display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 50%; background: {C['cor']}; font-family: {D}; font-weight: 700; font-size: 30px; color: {C['encre']}">!</span>Dernière publication{NB}: il y a 47 jours</div>'''
    inner = f'''{card}{badge}
{header_row(logo(44, C['encre'], C['encre'], C['cor']), 1, 0, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px; display: flex; flex-direction: column; gap: 44px; align-items: flex-start">
{statement(f'Sans personne dédiée, la com passe {hl("toujours après le reste", C["cort"])}. Et vos clients le voient.', C['encre'])}
{cta('fill.studioes.fr', C['cor'])}</div>'''
    return frame(C['corc'], inner, m)


# ============ P3 : bonus de lancement (encre, carte chromée) ============
def P3b():
    m = motif(MOTIF['encre'], 1500, 400, -120, 0)
    card = f'''<div style="position: absolute; left: 190px; top: 130px; width: 700px; height: 440px; transform: rotate(-6deg); border-radius: 44px; background: {CHROME}; box-shadow: 0 60px 120px -50px rgba(184,164,255,.55); overflow: hidden">
<div style="position: absolute; inset: 0; background: linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.55) 46%, rgba(255,255,255,0) 60%)"></div>
<div style="position: absolute; left: 48px; top: 44px">{logo(48)}</div>
<div style="position: absolute; left: 48px; bottom: 40px; display: flex; align-items: baseline; gap: 18px"><span style="font-family: {D}; font-weight: 800; font-size: 170px; line-height: 0.82; letter-spacing: -0.05em; color: {C['encre']}">+50{NB}%</span><span style="font-family: {F}; font-weight: 650; font-size: 34px; color: {C['encre']}">d’unités</span></div></div>
<div style="position: absolute; left: 790px; top: 60px; transform: rotate(12deg); z-index: 2">{pastille(190, f'<span style="font-family: {F}; font-weight: 750; font-size: 25px; line-height: 1.1; color: {C["encre"]}">Jusqu’au<br>30 nov.</span>')}</div>'''
    inner = f'''{card}
<div style="position: absolute; left: 88px; right: 88px; top: 780px; display: flex; flex-direction: column; gap: 22px">
<h1 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 104px; line-height: 0.96; letter-spacing: -0.04em; color: {C['sable']}">Lancement</h1>
{statement(f'{hl("+50 % d’unités", C["lav"])} le premier mois, pour tout démarrage avant le 30 novembre.'.replace('+50 %', f'+50{NB}%'), C['sable'], 50)}</div>
<div style="position: absolute; left: 88px; right: 88px; bottom: 88px; display: flex; align-items: center; justify-content: space-between">{logo(44, C['sable'])}{cta('fill.studioes.fr', C['lav'])}</div>'''
    return frame(C['encre'], inner, m)


# ============ P4 : démonstration (lavande clair, téléphone) ============
def P4b():
    m = motif(MOTIF['lavc'], 1500, -380, -100, -6)
    phone = f'''<div style="position: absolute; left: 330px; top: 70px; width: 420px; height: 720px; transform: rotate(-5deg); box-sizing: border-box; padding: 16px; border-radius: 64px; background: {C['encre']}; box-shadow: {SH}">
<div style="width: 100%; height: 100%; box-sizing: border-box; padding: 54px 28px 28px; border-radius: 50px; background: {C['sable']}; display: flex; flex-direction: column; gap: 20px; overflow: hidden">
<div style="display: flex; align-items: center; justify-content: space-between">{logo(28)}<span style="font-family: {F}; font-weight: 600; font-size: 17px; color: rgba(26,26,26,.55)">Relecture</span></div>
<span style="font-family: {D}; font-weight: 650; font-size: 32px; line-height: 1.0; letter-spacing: -0.03em">Affiche du Marché de Noël</span>
<div style="flex: 1; border-radius: 20px; background: {C['lavf']}; position: relative; overflow: hidden; box-sizing: border-box; padding: 22px; display: flex; flex-direction: column; justify-content: flex-end">
<span style="position: absolute; right: -40px; top: -30px; width: 200px; height: 200px; border-radius: 50%; background: {C['lav']}"></span>
<span style="position: relative; font-family: {D}; font-weight: 700; font-size: 40px; line-height: 0.95; letter-spacing: -0.03em; color: {C['sable']}">Marché<br>de Noël</span></div>
<span style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 60px; border-radius: 999px; background: {C['encre']}; color: {C['sable']}; font-family: {F}; font-weight: 650; font-size: 21px">{check(C['sable'], 22)}Valider</span>
<span style="display: flex; align-items: center; justify-content: center; height: 60px; border-radius: 999px; box-shadow: inset 0 0 0 2px rgba(26,26,26,.2); font-family: {F}; font-weight: 650; font-size: 21px">Corriger</span></div></div>
<div style="position: absolute; left: 640px; top: 560px; z-index: 2; display: inline-flex; align-items: center; gap: 14px; height: 84px; padding: 0 32px 0 16px; border-radius: 999px; background: {C['blanc']}; box-shadow: {SH}; font-family: {F}; font-weight: 650; font-size: 26px; color: {C['encre']}">
<span style="display: flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 50%; background: {C['lavf']}"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="{C['sable']}"/></svg></span>Démonstration · 20 s</div>'''
    inner = f'''{phone}
{header_row(logo(44), 1, 0, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Faire valider une affiche par un élu, {hl("sans lui créer de compte", C["lavt"])}{NB}: un lien, deux boutons.', C['encre'])}</div>'''
    return frame(C['lavc'], inner, m)


# ============ P5 : réalisation Studio ES (corail clair, photo) ============
def P5b():
    m = motif(MOTIF['corc'], 1500, -360, 200, -6)
    photo = f'''<div style="position: absolute; left: 280px; top: 90px; width: 520px; height: 650px; transform: rotate(4deg); border-radius: 40px; overflow: hidden; box-shadow: {SH}">
<img src="{IMG}" alt="Identité de la boulangerie Maison Blé, posée sur une photo de pains" style="display: block; width: 100%; height: 100%; object-fit: cover">
<span style="position: absolute; right: 24px; top: 24px">{tag('Exemple', C['blanc'], C['encre'], 20)}</span></div>
<div style="position: absolute; left: 120px; top: 520px; z-index: 2; display: flex; flex-direction: column; gap: 12px; transform: rotate(-4deg)">
{tag('Identité', C['blanc'], C['encre'], 26)}{tag('Reportage photo', C['cor'], C['encre'], 26)}{tag('Publications', C['encre'], C['sable'], 26)}</div>'''
    inner = f'''{photo}
<div style="position: absolute; left: 88px; right: 88px; top: 846px; display: flex; align-items: center; justify-content: space-between">{logo(44, C['encre'], C['encre'], C['cor'])}<span style="font-family: {F}; font-weight: 650; font-size: 24px; color: {C['cort']}">Réalisé par Studio ES</span></div>
<div style="position: absolute; left: 88px; right: 88px; top: 940px; display: flex; flex-direction: column; gap: 44px; align-items: flex-start">
{statement(f'Une boulangerie, {hl("une identité et des images", C["cort"])} pour toute l’année.', C['encre'])}
{cta('fill.studioes.fr', C['cor'])}</div>'''
    return frame(C['corc'], inner, m)


BOARDS = [
    ('L1.dc.html', 'Lancement 1 · Accroche', L1b),
    ('L2.dc.html', 'Lancement 2 · Situations', L2b),
    ('L3.dc.html', 'Lancement 4 · Comment ça marche', L3b),
    ('L4.dc.html', 'Lancement 6 · Formules', L4b),
    ('L5.dc.html', 'Lancement 7 · Fin', L5b),
    ('G1.dc.html', 'Guide · Couverture', G1b),
    ('G2.dc.html', 'Guide · Page intérieure', G2b),
    ('G3.dc.html', 'Guide · Fin', G3b),
    ('P1.dc.html', 'Constat · Collectivités', P1b),
    ('P2.dc.html', 'Constat · Entreprises', P2b),
    ('P3.dc.html', 'Temps fort · Bonus de lancement', P3b),
    ('P4.dc.html', 'Démonstration · Couverture', P4b),
    ('P5.dc.html', 'Studio ES · Réalisation', P5b),
]

if __name__ == '__main__':
    for fn, t, f in BOARDS:
        write(fn, t, 1080, 1350, f())
    print('ok')
