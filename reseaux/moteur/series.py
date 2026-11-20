import lgen as G
from lgen import C, MOTIF, NB, logo, motif, check, arrow, page
import cover as CV

def cov(bg, fi, tagbg, tagfg, tag, l1, l2, tcol, icol, vis, footcol, dark):
    b = motif('rgba(255,255,255,.10)' if dark else 'rgba(26,26,26,.05)', 2300, 120, -420)
    b += (f'<div style="position:absolute;left:88px;top:88px">{logo(56, fi, C["lavf"] if bg == C["lav"] else C["lav"])}</div>'
          f'<div style="position:absolute;right:88px;top:92px"><span class="tag" style="height:52px;font-size:24px;padding:0 24px;background:{tagbg};color:{tagfg}">{tag}</span></div>')
    b += (f'<div style="position:absolute;left:88px;right:60px;top:250px"><div class="D" style="font-weight:650;font-size:124px;line-height:.92;letter-spacing:-.05em;color:{tcol}">{l1}</div>'
          f'<div class="I" style="font-size:104px;line-height:1.02;letter-spacing:-.02em;color:{icol};margin-top:6px">{l2}</div></div>')
    b += vis
    col = 'rgba(248,245,242,.82)' if dark else 'rgba(26,26,26,.7)'
    b += (f'<div style="position:absolute;left:88px;right:88px;bottom:84px;display:flex;align-items:center;justify-content:space-between">'
          f'<span style="font-weight:600;font-size:27px;line-height:1.35;color:{col}">{footcol}</span>'
          f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["sable"] if dark else C["encre"]}">{arrow(C["encre"] if dark else C["sable"], 42)}</span></div>')
    return f'<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:{bg}">{b}</div>'

card = lambda x, y, w, inner, r=-2: f'<div class="card" style="left:{x}px;top:{y}px;width:{w}px;padding:30px 34px;border-radius:34px;transform:rotate({r}deg)">{inner}</div>'
SER = [
 ('Temps forts', 'Lancements, offres, nouveautés', C['encre'], 'encre', cov(C['encre'], C['sable'], C['lav'], C['encre'], 'Temps fort', 'Une nouveauté', 'en une phrase.', C['sable'], C['lav'],
   card(130, 760, 800, f'<div style="display:flex;gap:20px;align-items:center"><span style="width:84px;height:84px;border-radius:22px;background:{C["lavc"]};display:grid;place-items:center">{logo(28)}</span><span style="font-size:30px;font-weight:500">Une annonce, un fait concret.</span></div>'), 'Annonce sobre, une date, un lien', True)),
 ('Guides', 'Mode d’emploi saisonnier, 8 à 10 pages', C['lavc'], 'lavande claire', cov(C['lavc'], C['encre'], C['lavf'], C['sable'], 'Guide · n°1', 'La com', 'de décembre.', C['encre'], C['lavt'],
   card(130, 740, 800, ''.join(f'<div style="display:flex;gap:18px;align-items:center;height:72px;border-bottom:2px solid rgba(26,26,26,.06)"><span style="width:40px;height:40px;border-radius:50%;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"],22)}</span><span style="font-size:29px;font-weight:600">{t}</span></div>' for t in ['Les vœux du maire','Le marché de Noël','Les fermetures de fin d’année'])), 'Ce qu’il faut prévoir, semaine par semaine', False)),
 ('Constats', 'Une situation vécue, un chiffre, une échéance', C['corc'], 'corail clair', cov(C['corc'], C['encre'], C['cor'], C['encre'], 'Constat', 'Le budget 2027', 'se décide maintenant.', C['encre'], C['cort'],
   card(130, 760, 800, f'<div class="D" style="font-weight:700;font-size:120px;letter-spacing:-.05em;color:{C["cort"]};line-height:.9">Sept. à déc.</div><div style="margin-top:14px;font-size:28px;font-weight:500">Les arbitrages se font avant janvier.</div>'), 'Ce qui se joue, et ce qu’on peut faire', False)),
 ('Démos', 'Fill en action, animé sur Instagram', C['lav'], 'lavande', cov(C['lav'], C['encre'], C['encre'], C['sable'], 'Démo', 'Valider une affiche', 'sans créer de compte.', C['encre'], C['lavt'],
   card(200, 720, 680, f'<div style="height:300px;border-radius:20px;background:{C["lavc"]}"></div><div style="display:flex;gap:16px;margin-top:22px"><span class="tag" style="height:60px;font-size:24px;padding:0 26px;background:{C["lavf"]};color:{C["sable"]}">Valider</span><span class="tag" style="height:60px;font-size:24px;padding:0 26px;background:{C["lavc"]};color:{C["lavt"]}">Corriger</span></div>', 2), 'Une fonction de l’Espace Fill, pas à pas', False)),
 ('Outils', 'Modèles et calendriers à garder', C['sable'], 'sable', cov(C['sable'], C['encre'], C['encre'], C['sable'], 'Outil', 'Le calendrier', 'de la com 2027.', C['encre'], C['lavt'],
   f'<div style="position:absolute;left:150px;top:720px;width:780px;height:380px;border-radius:30px;background:{C["lavf"]};transform:rotate(-3deg);box-shadow:0 40px 80px -40px rgba(26,10,60,.55);padding:36px;display:grid;grid-template-columns:repeat(6,1fr);gap:12px">' + ''.join(f'<span style="border-radius:12px;background:rgba(248,245,242,{.9 if i in (2,7,9) else .18})"></span>' for i in range(12)) + '</div>', 'À enregistrer, imprimer, partager', False)),
]

def board():
    out = '<div style="position:absolute;inset:0;background:#fff;padding:90px">'
    out += '<div class="D" style="font-weight:650;font-size:64px;letter-spacing:-.03em">Séries et formats</div>'
    out += ('<div style="margin-top:14px;max-width:1500px;font-size:24px;line-height:1.45;color:rgba(26,26,26,.7)">Chaque série a sa couleur de couverture, son étiquette et son type de visuel. Toutes gardent les mêmes bases : '
            'logo en haut à gauche, étiquette de série en haut à droite, titre en Bricolage puis relance en italique, visuel central en carte, bas de page avec une phrase et la flèche, marges de 88 px, pagination en tirets à l’intérieur, dernière page avec le lien.</div>')
    for i, (n, d, col, cname, html, *_r) in enumerate(SER):
        x = 90 + i * 440
        out += (f'<div style="position:absolute;left:{x}px;top:330px;width:400px">'
                f'<div style="width:400px;height:500px;overflow:hidden;border-radius:18px;box-shadow:0 20px 50px -30px rgba(0,0,0,.4)"><div style="transform:scale(.37037);transform-origin:0 0">{html}</div></div>'
                f'<div class="D" style="margin-top:22px;font-weight:650;font-size:32px">{n}</div>'
                f'<div style="margin-top:6px;font-size:20px;color:rgba(26,26,26,.6)">{d}</div>'
                f'<div style="margin-top:12px;display:flex;align-items:center;gap:10px;font-size:18px;color:rgba(26,26,26,.6)"><span style="width:22px;height:22px;border-radius:50%;background:{col};box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)"></span>Couverture {cname}</div></div>')
    cal = [('24 nov.','Lancement','Temps fort',C['encre']),('25 nov.','Offre de lancement','Temps fort',C['lavf']),('1er déc.','La com de décembre','Guide',C['lavc']),
           ('3 déc.','Le budget 2027 se décide maintenant','Constat',C['corc']),('8 déc.','Une demande en trois lignes','Démo',C['lav']),('10 déc.','Préparer janvier avant les congés','Guide',C['lavc']),
           ('15 déc.','Le calendrier de la com 2027','Outil',C['sable']),('17 déc.','Congés : qui publie à votre place ?','Constat',C['corc'])]
    out += '<div class="D" style="position:absolute;left:90px;top:1060px;font-weight:650;font-size:40px">Calendrier des couvertures, jamais deux fois la même couleur à la suite</div>'
    for i, (d, t, s, col) in enumerate(cal):
        x = 90 + i * 275
        out += (f'<div style="position:absolute;left:{x}px;top:1150px;width:255px">'
                f'<div style="height:150px;border-radius:14px;background:{col};box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)"></div>'
                f'<div style="margin-top:12px;font-weight:700;font-size:20px">{d} · {s}</div><div style="margin-top:4px;font-size:18px;line-height:1.35;color:rgba(26,26,26,.65)">{t}</div></div>')
    out += '</div>'
    return out

if __name__ == '__main__':
    page('series', '#fff', board(), end=1, w=2400, h=1450)
    print('ok')
