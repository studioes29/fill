import lgen as G
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page
import importlib.util, sys
_s = importlib.util.spec_from_file_location('lg2', '/home/claude/launch/gen2.py'); L2 = importlib.util.module_from_spec(_s); _s.loader.exec_module(L2)
offre, ttl = L2.offre, L2.ttl
import re

def card_chrome(left, top, w, h, rot=-6, big=200):
    o = offre()
    i = o.index('<div style="position:absolute;left:150px;top:110px'); j = o.index('<div style="position:absolute;left:88px;right:88px;top:700px')
    c = o[i:j]
    c = c.replace('left:150px;top:110px;width:780px;height:490px;transform:rotate(-6deg)', f'left:{left}px;top:{top}px;width:{w}px;height:{h}px;transform:rotate({rot}deg)')
    c = c.replace('font-size:190px', f'font-size:{big}px')
    return c

def bw1():
    import cover as CV
    b = motif('rgba(233,225,255,.10)', 2300, 120, -420)
    b += CV.top(C['sable'], C['sable'], C['lavt']).replace('>Nouveau<', '>Offre de lancement<')
    b += (f'<div style="position:absolute;left:88px;right:60px;top:250px">'
          f'<div class="D" style="font-weight:650;font-size:136px;line-height:.92;letter-spacing:-.05em;color:{C["sable"]}">Démarrez<br>en novembre,</div>'
          f'<div class="I" style="font-size:104px;line-height:1.02;letter-spacing:-.02em;color:{C["lavc"]};margin-top:6px">des unités offertes.</div></div>')
    from chrome import chrome
    b += chrome(210, 690, 660, 385, 14, -16, -5, 142)
    b += CV.foot(True, 'Premier mois sans engagement<br>pour les collectivités et les entreprises')
    return b

def bw2():
    b = motif(MOTIF['lavc'], 2300, 120, -420)
    b += head(3, 1, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += ttl('Ce qui est offert,', 'selon votre formule.', C['encre'], C['lavt'], 92)
    rows = [('Essentiel', '15', '8', '23'), ('Régulier', '35', '18', '53'), ('Soutenu', '75', '38', '113')]
    cols = 'grid-template-columns:1.25fr .9fr 1fr .9fr'
    r = ''
    for k, (n, q, x, t) in enumerate(rows):
        r += (f'<div style="display:grid;{cols};align-items:center;height:140px;border-top:2px solid rgba(26,26,26,.07)">'
              f'<span class="D" style="font-weight:650;font-size:38px;letter-spacing:-.03em">{n}</span>'
              f'<span style="text-align:center;font-weight:600;font-size:34px;color:rgba(26,26,26,.55)">{q}</span>'
              f'<span style="text-align:center"><span class="tag" style="height:58px;font-size:30px;padding:0 24px;background:{C["lavf"]};color:{C["sable"]}">+{x}</span></span>'
              f'<span class="D" style="text-align:right;font-weight:700;font-size:46px;letter-spacing:-.03em">{t}</span></div>')
    hd = ''.join(f'<span style="text-align:{a};font-weight:600;font-size:22px;color:rgba(26,26,26,.5)">{l}</span>' for l, a in [('Formule','left'),('Par mois','center'),('Offertes','center'),('1er mois','right')])
    b += (f'<div class="card" style="left:88px;right:88px;top:470px;height:514px;padding:30px 48px 0">'
          f'<div style="display:grid;{cols};padding-bottom:16px">{hd}</div>{r}</div>')
    chip = lambda q, l: f'<span style="display:inline-flex;align-items:center;gap:12px;height:62px;padding:0 24px 0 10px;border-radius:999px;background:rgba(248,245,242,.14);font-weight:600;font-size:26px;color:{C["sable"]}"><span class="D" style="display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:{C["sable"]};color:{C["lavt"]};font-weight:700;font-size:22px">{q}</span>{l}</span>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:1016px;height:246px;border-radius:40px;background:{C["lavf"]};padding:36px 48px;display:flex;flex-direction:column;justify-content:space-between">'
          f'<div class="D" style="font-weight:650;font-size:40px;line-height:1.08;letter-spacing:-.025em;color:{C["sable"]}">Sur le Régulier, 18 unités en plus,<br><span class="I" style="font-weight:300;color:{C["lavc"]}">c’est par exemple :</span></div>'
          f'<div style="display:flex;gap:14px">{chip("4", "affiches")}{chip("2", "publications")}</div></div>')
    return b

def bw3():
    b = motif('rgba(184,164,255,.08)', 2300, 120, -420)
    b += head(3, 2, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.2)')
    b += ttl('Pour en profiter,', 'trois étapes.', C['sable'], C['lav'], 92)
    steps = [('Créez votre espace', 'Sur fill.studioes.fr, en quelques minutes.'), ('Choisissez votre formule', 'Essentiel, Régulier ou Soutenu.'),
             ('Démarrez avant le 30 novembre', 'Les unités offertes sont créditées automatiquement.')]
    for i, (t, s) in enumerate(steps):
        y = 470 + i * 182
        b += (f'<div class="card" style="left:88px;right:88px;top:{y}px;height:150px;padding:0 40px;display:flex;align-items:center;gap:30px">'
              f'<span class="D" style="flex:none;display:flex;align-items:center;justify-content:center;width:80px;height:80px;border-radius:50%;background:{C["lavc"]};color:{C["lavt"]};font-weight:700;font-size:38px">{i+1}</span>'
              f'<span style="display:flex;flex-direction:column;gap:6px"><span class="D" style="font-weight:650;font-size:36px;letter-spacing:-.025em">{t}</span>'
              f'<span style="font-weight:500;font-size:25px;color:rgba(26,26,26,.6)">{s}</span></span></div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:1016px;height:246px;border-radius:40px;background:{C["lav"]};padding:0 48px;display:flex;align-items:center;justify-content:space-between">'
          f'<div><div class="D" style="font-weight:700;font-size:58px;letter-spacing:-.035em;color:{C["encre"]}">fill.studioes.fr</div>'
          f'<div style="margin-top:10px;font-weight:600;font-size:26px;color:rgba(26,26,26,.7)">Premier mois sans engagement.</div></div>'
          f'<span style="flex:none;display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["encre"]}">{arrow(C["sable"], 42)}</span></div>')
    return b

def une(word, bg, fg, mot):
    b = motif(mot, 1400, 330, 300)
    b += (f'<div style="position:absolute;left:0;right:0;top:0;height:1920px;display:flex;align-items:center;justify-content:center">'
          f'<span class="D" style="font-weight:650;font-size:{150 if len(word)<7 else 128}px;letter-spacing:-.045em;color:{fg}">{word}</span></div>')
    page('une_' + re.sub(r'\W', '', word.lower()), bg, b, end=1, h=1920)

if __name__ == '__main__':
    page('bw1', C['lavf'], bw1(), end=1)
    page('bw2', C['lavc'], bw2(), end=1)
    page('bw3', C['encre'], bw3(), end=1)
    une('Fill', C['lavf'], C['sable'], MOTIF['lavf'])
    une('Étapes', C['lavc'], C['encre'], MOTIF['lavc'])
    une('Formules', C['sable'], C['encre'], MOTIF['sable'])
    une('Offre', C['encre'], C['sable'], 'rgba(184,164,255,.08)')
    print('ok')
