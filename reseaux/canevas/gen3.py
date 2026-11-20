from gen import *
import gen

PH = {'mairie': '/_blob/ff2b044609d6be03c25194a6dda89a5e', 'bureau': '/_blob/0ec5feeb101b7de37c7c3fda594777ee',
      'atelier': '/_blob/82fb5a64f46e9c8eaff4870e3b41993a', 'marche': '/_blob/bb185e6a04621f9384f9c98bd3e6b4a9',
      'lecture': '/_blob/fa48eee19cc08cb1dc39fa1e680d6b7e'}


def img(key, alt, pos='center'):
    return f'<img src="{PH[key]}" alt="{alt}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: {pos}">'

# ---------- pages reprises, pagination adaptée ----------
def repag(html, old, new):
    assert old in html, old[:40]
    return html.replace(old, new)


def mail_card(left, top, w, rot, z=1):
    return f'''<div style="position: absolute; left: {left}px; top: {top}px; width: {w}px; transform: rotate({rot}deg); z-index: {z}; box-sizing: border-box; padding: 40px; border-radius: 40px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 24px">
<div style="display: flex; align-items: center; gap: 18px"><span style="display: flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 50%; background: {C['lavc']}; color: {C['lavt']}; font-family: {F}; font-weight: 700; font-size: 25px">SI</span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: {F}; font-weight: 650; font-size: 28px; color: {C['encre']}">Mairie de Saint-Ivenec</span><span style="font-family: {F}; font-weight: 500; font-size: 23px; color: rgba(26,26,26,.6)">à fill@studioes.fr</span></span>
<span style="margin-left: auto; font-family: {F}; font-weight: 500; font-size: 23px; color: rgba(26,26,26,.5)">8 h 12</span></div>
<span style="font-family: {F}; font-weight: 650; font-size: 30px; color: {C['encre']}">Marché de Noël</span>
<p style="margin: 0; font-family: {F}; font-weight: 500; font-size: 28px; line-height: 1.4; color: {C['encre']}">Bonjour, à annoncer{NB}: samedi 12 décembre, de 10 h à 18 h, place de la mairie. Trente exposants et le vin chaud des associations. Photo jointe.</p>
<div style="display: flex; gap: 12px"><span style="position: relative; width: 190px; height: 128px; border-radius: 18px; overflow: hidden">{img('marche', 'Photo jointe : chalets du marché de Noël', 'center 35%')}</span><span style="display: flex; align-items: center; padding: 0 18px; border-radius: 18px; background: {C['lavc']}; font-family: {F}; font-weight: 600; font-size: 22px; color: {C['lavt']}">marche-noel.jpg</span></div></div>'''


def poster(w, h, title_size=46):
    return (f'<div style="width: {w}px; height: {h}px; border-radius: 22px; background: {C["lavf"]}; position: relative; overflow: hidden; box-sizing: border-box; padding: 28px; display: flex; flex-direction: column; justify-content: flex-end">'
            + img('marche', 'Chalets illuminés d’un marché de Noël', 'center 30%')
            + f'<span style="position: absolute; left: 0; right: 0; bottom: 0; height: 70%; background: linear-gradient(180deg, rgba(112,82,179,0) 0%, rgba(112,82,179,.92) 72%)"></span>'
            f'<span style="position: relative; font-family: {D}; font-weight: 700; font-size: {title_size}px; line-height: 0.95; letter-spacing: -0.03em; color: {C["sable"]}">Marché<br>de Noël</span>'
            f'<span style="position: relative; margin-top: 10px; font-family: {F}; font-weight: 600; font-size: {round(title_size*0.42)}px; color: {C["lavc"]}">Samedi 12 décembre</span></div>')


def steptag(n, label, bg, fg):
    return tag(f'{n} · {label}', bg, fg, 26)


# ================= POST 1 : ce qu'est Fill (5 pages) =================
def A1():
    return repag(gen.L1b(), dashes(7, 0, C['lavf'], 'rgba(26,26,26,.14)'), dashes(5, 0, C['lavf'], 'rgba(26,26,26,.14)'))


def photocard(key, alt, label, title, rot, left, top, z, w, h, bg, fg, lab, side='l', pos='center', mw=250):
    al = 'flex-end' if side == 'r' else 'flex-start'
    ta = 'right' if side == 'r' else 'left'
    return (f'<div style="position: absolute; left: {left}px; top: {top}px; width: {w}px; height: {h}px; transform: rotate({rot}deg); z-index: {z}; box-sizing: border-box; padding: 16px; border-radius: 40px; background: {bg}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 22px">'
            f'<div style="position: relative; flex: 1; border-radius: 28px; overflow: hidden">{img(key, alt, pos)}</div>'
            f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 0 16px 14px; align-items: {al}; text-align: {ta}">'
            f'<span style="font-family: {F}; font-weight: 650; font-size: 22px; color: {lab}">{label}</span>'
            f'<span style="max-width: {mw}px; font-family: {D}; font-weight: 650; font-size: 38px; line-height: 1.0; letter-spacing: -0.03em; color: {fg}">{title}</span></div></div>')


def A2():
    m = motif(MOTIF['lav'], 1300, -260, 380, -8)
    cards = (photocard('mairie', 'Façade d’une mairie de village', 'Collectivités', 'Pas de service com', -8, 30, 190, 1, 400, 560, C['blanc'], C['encre'], 'rgba(26,26,26,.6)', pos='30% center', mw=210)
             + photocard('atelier', 'Artisan au travail dans son atelier', 'Entreprises', 'Pas envie de recruter', 8, 650, 190, 1, 400, 560, C['blanc'], C['encre'], 'rgba(26,26,26,.6)', 'r')
             + photocard('bureau', 'Personne seule à son bureau devant un ordinateur', 'Partout', 'Un service débordé, ou absent', 0, 350, 110, 2, 380, 640, C['encre'], C['sable'], 'rgba(248,245,242,.66)', mw=340))
    inner = f'''{cards}
{header_row(logo(44, C['encre'], C['encre'], C['encre']), 5, 1, C['encre'], 'rgba(26,26,26,.18)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Trois situations, une même suite{NB}: le site n’est plus à jour, <span style="background: {C["lavc"]}; border-radius: 10px; padding: 0 0.14em; -webkit-box-decoration-break: clone; box-decoration-break: clone">les réseaux se taisent</span>, l’affiche part trop tard.', C['encre'])}</div>'''
    return frame(C['lav'], inner, m)


def A3():
    m = motif(MOTIF['encre'], 1500, 420, -200, 0)
    pills = [('Réseaux sociaux', 90, 120, -6), ('Site internet', 700, 110, 5), ('Affiches', 60, 560, 4),
             ('Lettres d’information', 600, 600, -4), ('Reportages photo', 760, 360, 8), ('Communiqués', 40, 350, -8)]
    p = ''.join(f'<span style="position: absolute; left: {x}px; top: {y}px; transform: rotate({r}deg); display: inline-flex; align-items: center; height: 76px; padding: 0 30px; border-radius: 999px; background: {C["lavc"] if i % 2 == 0 else C["blanc"]}; font-family: {F}; font-weight: 650; font-size: 28px; color: {C["encre"]}; white-space: nowrap; box-shadow: {SH}">{t}</span>' for i, (t, x, y, r) in enumerate(pills))
    inner = f'''{p}
<div style="position: absolute; left: 0; right: 0; top: 270px; display: flex; justify-content: center">{logo(240, C['sable'])}</div>
{header_row(logo(44, C['sable']), 5, 2, C['lav'], 'rgba(248,245,242,.2)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Un service de communication externalisé, {hl("par abonnement", C["lav"])}, pour les collectivités et les entreprises.', C['sable'])}</div>'''
    return frame(C['encre'], inner, m)


def A4():
    m = motif(MOTIF['lavc'], 1500, -380, -100, -6)
    pub = f'''<div style="position: absolute; left: 40px; top: 200px; width: 360px; transform: rotate(-8deg); z-index: 1; box-sizing: border-box; padding: 22px; border-radius: 36px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 16px">
<div style="display: flex; align-items: center; gap: 12px"><span style="width: 44px; height: 44px; border-radius: 50%; background: {C['lavc']}"></span><span style="font-family: {F}; font-weight: 650; font-size: 21px">saint.ivenec</span></div>
{poster(316, 316, 42)}
<span style="font-family: {F}; font-weight: 500; font-size: 20px; line-height: 1.35; color: rgba(26,26,26,.7)">Rendez-vous samedi sur la place de la mairie…</span>
<span>{tag('Publication · 1 unité', C['lavc'], C['lavt'], 20)}</span></div>'''
    aff = f'''<div style="position: absolute; left: 748px; top: 210px; width: 320px; transform: rotate(7deg); z-index: 1; box-sizing: border-box; padding: 22px; border-radius: 36px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 16px">
<div style="height: 430px; border-radius: 20px; background: {C['encre']}; position: relative; overflow: hidden; box-sizing: border-box; padding: 26px; display: flex; flex-direction: column; justify-content: space-between">
{img('lecture', 'Lectrice entourée de piles de livres', 'center 40%')}
<span style="position: absolute; left: 0; right: 0; bottom: 0; height: 65%; background: linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(26,26,26,.88) 70%)"></span>
<span style="position: relative; align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: {C['lav']}; font-family: {F}; font-weight: 650; font-size: 16px; color: {C['encre']}">Médiathèque</span>
<span style="position: relative; font-family: {D}; font-weight: 700; font-size: 50px; line-height: 0.92; letter-spacing: -0.035em; color: {C['sable']}">Nuit de<br>la lecture</span></div>
<span>{tag('Affiche · 4 unités', C['lavc'], C['lavt'], 20)}</span></div>'''
    nl = f'''<div style="position: absolute; left: 345px; top: 110px; width: 390px; z-index: 2; box-sizing: border-box; padding: 26px; border-radius: 36px; background: {C['blanc']}; box-shadow: {SH}; display: flex; flex-direction: column; gap: 16px">
<div style="height: 64px; border-radius: 16px; background: {C['lavf']}; display: flex; align-items: center; padding: 0 22px; font-family: {F}; font-weight: 650; font-size: 21px; color: {C['sable']}">La lettre de Saint-Ivenec</div>
<span style="font-family: {D}; font-weight: 650; font-size: 34px; line-height: 1.0; letter-spacing: -0.03em">Ce qui change en décembre</span>
<div style="position: relative; height: 170px; border-radius: 18px; overflow: hidden">{img('mairie', 'Façade de la mairie', 'center 40%')}</div>
{''.join(f'<span style="height: 14px; width: {w}%; border-radius: 7px; background: rgba(26,26,26,.1)"></span>' for w in (95, 82, 90, 60))}
<div style="display: flex; gap: 12px"><span style="flex: 1; height: 90px; border-radius: 14px; background: {C['lav']}"></span><span style="flex: 1; height: 90px; border-radius: 14px; background: {C['lavc']}"></span></div>
<span>{tag('Lettre d’information · 3 unités', C['lavc'], C['lavt'], 20)}</span></div>'''
    inner = f'''{pub}{aff}{nl}
{header_row(logo(44), 5, 3, C['lavf'], 'rgba(26,26,26,.14)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Publications, actualités du site, affiches, lettres d’information, reportages photo{NB}: {hl("ce qui fait vivre la com au quotidien", C["lavt"])}.', C['encre'])}</div>'''
    return frame(C['lavc'], inner, m)


def A5():
    return repag(gen.L5b(), dashes(7, 6, C['lavf'], 'rgba(26,26,26,.14)'), dashes(5, 4, C['lavf'], 'rgba(26,26,26,.14)'))


# ================= POST 2 : comment ça marche (5 pages) =================
def B1():
    m = motif(MOTIF['lav'], 1500, 360, -60, 0)
    inner = f'''
<div style="position: absolute; left: 88px; top: 88px; right: 88px; display: flex; align-items: center; justify-content: space-between">{logo(52, C['encre'], C['encre'], C['cor'])}{dashes(5, 0, C['encre'], 'rgba(26,26,26,.18)')}</div>
<div style="position: absolute; left: 88px; right: 88px; top: 380px; display: flex; flex-direction: column; gap: 26px">
<h1 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 132px; line-height: 0.96; letter-spacing: -0.04em; color: {C['encre']}">Vous demandez,</h1>
<p style="margin: 0; font-family: {SF}; font-style: italic; font-weight: 300; font-size: 92px; line-height: 1.04; letter-spacing: -0.02em; color: {C['encre']}">Fill s’occupe <span style="position: relative; display: inline-block">du reste.<span style="position: absolute; left: 4px; right: 18px; bottom: -14px; height: 12px; border-radius: 6px; background: {C['cor']}"></span></span></p></div>
<div style="position: absolute; left: 88px; right: 88px; bottom: 88px; display: flex; align-items: center; justify-content: space-between">
<p style="margin: 0; font-family: {F}; font-weight: 500; font-size: 34px; line-height: 1.3; color: rgba(26,26,26,.78); max-width: 620px">Le trajet d’une demande, en trois étapes.</p>
<div style="display: flex; align-items: center; justify-content: center; width: 112px; height: 112px; border-radius: 50%; background: {C['encre']}">{arrow(C['sable'], 44)}</div></div>'''
    return frame(C['lav'], inner, m)


def B2():
    m = motif(MOTIF['lavc'], 1500, 420, -200, 0)
    conf = f'''<div style="position: absolute; left: 560px; top: 640px; z-index: 2; transform: rotate(4deg); display: inline-flex; align-items: center; gap: 14px; height: 84px; padding: 0 32px 0 16px; border-radius: 999px; background: {C['encre']}; box-shadow: {SH}; font-family: {F}; font-weight: 650; font-size: 26px; color: {C['sable']}; white-space: nowrap">
<span style="display: flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 50%; background: {C['lav']}">{check(C['encre'], 28)}</span>Confirmation sous 24 h ouvrées</div>'''
    inner = f'''{mail_card(110, 140, 760, -4)}{conf}
{header_row(steptag(1, 'Vous demandez', C['blanc'], C['lavt']), 5, 1, C['lavf'], 'rgba(26,26,26,.14)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Vous envoyez l’information {hl("par mail", C["lavt"])} ou depuis votre espace{NB}: quelques lignes, une photo, la date. Pas de brief à rédiger.', C['encre'])}</div>'''
    return frame(C['lavc'], inner, m)


def B3():
    m = motif(MOTIF['encre'], 1500, -380, -100, -6)
    phone = f'''<div style="position: absolute; left: 330px; top: 70px; width: 420px; height: 720px; transform: rotate(-4deg); box-sizing: border-box; padding: 16px; border-radius: 64px; background: #2A2730; box-shadow: 0 60px 120px -50px rgba(0,0,0,.8)">
<div style="width: 100%; height: 100%; box-sizing: border-box; padding: 54px 28px 28px; border-radius: 50px; background: {C['sable']}; display: flex; flex-direction: column; gap: 20px; overflow: hidden">
<div style="display: flex; align-items: center; justify-content: space-between">{logo(28)}<span style="font-family: {F}; font-weight: 600; font-size: 17px; color: rgba(26,26,26,.55)">À valider</span></div>
<span style="font-family: {D}; font-weight: 650; font-size: 32px; line-height: 1.0; letter-spacing: -0.03em">Affiche du Marché de Noël</span>
<div style="flex: 1; display: flex">{poster(336, 330, 40)}</div>
<span style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 60px; border-radius: 999px; background: {C['encre']}; color: {C['sable']}; font-family: {F}; font-weight: 650; font-size: 21px">{check(C['sable'], 22)}Valider</span>
<span style="display: flex; align-items: center; justify-content: center; height: 60px; border-radius: 999px; box-shadow: inset 0 0 0 2px rgba(26,26,26,.2); font-family: {F}; font-weight: 650; font-size: 21px">Corriger</span></div></div>
<div style="position: absolute; left: 650px; top: 200px; z-index: 2; transform: rotate(5deg); display: inline-flex; align-items: center; height: 76px; padding: 0 30px; border-radius: 999px; background: {C['lav']}; box-shadow: {SH}; font-family: {F}; font-weight: 650; font-size: 26px; color: {C['encre']}; white-space: nowrap">Prête en 2 jours ouvrés</div>
<div style="position: absolute; left: 90px; top: 520px; z-index: 2; transform: rotate(-5deg); display: inline-flex; align-items: center; height: 76px; padding: 0 30px; border-radius: 999px; background: {C['blanc']}; box-shadow: {SH}; font-family: {F}; font-weight: 650; font-size: 26px; color: {C['encre']}; white-space: nowrap">Sans compte à créer</div>'''
    inner = f'''{phone}
{header_row(steptag(2, 'Vous validez', C['lav'], C['encre']), 5, 2, C['lav'], 'rgba(248,245,242,.2)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Fill rédige et met en forme. Vous recevez un lien{NB}: {hl("vous validez ou corrigez", C["lav"])} depuis votre téléphone.', C['sable'])}</div>'''
    return frame(C['encre'], inner, m)


def B4():
    m = motif(MOTIF['lav'], 1500, 420, -120, 0)
    rows = [('Publié sur Instagram et Facebook', '10 h 00'), ('En ligne sur le site, à l’agenda', '10 h 02'), ('Affiche prête à imprimer', '10 h 05')]
    cards = ''
    for i, (t, h) in enumerate(rows):
        cards += (f'<div style="position: absolute; left: {120 + i*40}px; top: {160 + i*170}px; width: 760px; transform: rotate({[-3,2,-1][i]}deg); box-sizing: border-box; padding: 0 34px 0 22px; height: 128px; border-radius: 34px; background: {C["blanc"]}; box-shadow: {SH}; display: flex; align-items: center; gap: 22px">'
                  f'<span style="flex: none; display: flex; align-items: center; justify-content: center; width: 76px; height: 76px; border-radius: 50%; background: {C["lavf"]}">{check(C["sable"], 36)}</span>'
                  f'<span style="flex: 1; font-family: {F}; font-weight: 650; font-size: 30px; color: {C["encre"]}">{t}</span>'
                  f'<span style="font-family: {F}; font-weight: 500; font-size: 24px; color: rgba(26,26,26,.55)">{h}</span></div>')
    inner = f'''{cards}
{header_row(steptag(3, 'C’est publié', C['blanc'], C['lavt']), 5, 3, C['encre'], 'rgba(26,26,26,.18)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Fill publie à la date prévue, sur vos comptes. <span style="background: {C["lavc"]}; border-radius: 10px; padding: 0 0.14em; -webkit-box-decoration-break: clone; box-decoration-break: clone">Vous êtes averti à chaque étape.</span>', C['encre'])}</div>'''
    return frame(C['lav'], inner, m)


def B5():
    return repag(gen.L5b(), dashes(7, 6, C['lavf'], 'rgba(26,26,26,.14)'), dashes(5, 4, C['lavf'], 'rgba(26,26,26,.14)'))


# ================= POST 3 : les formules (4 pages) =================
def C1():
    return repag(gen.L4b(), dashes(7, 5, C['lavc'], 'rgba(248,245,242,.24)'), dashes(4, 0, C['lavc'], 'rgba(248,245,242,.24)'))


def C2():
    m = motif(MOTIF['sable'], 1300, 620, 640, 0)
    cols = [('Essentiel', False), ('Régulier', True), ('Soutenu', False)]
    rows = [('Prix par mois', [f'490{NB}€', f'990{NB}€', f'1{NB}890{NB}€']),
            ('Unités par mois', ['15', '35', '75']),
            ('Demandes courantes', [f'2{NB}jours', f'2{NB}jours', f'1{NB}jour']),
            ('Créations', [f'5{NB}jours', f'5{NB}jours', f'3{NB}jours']),
            ('Point de suivi', ['Trimestre', 'Mois', '2 semaines'])]
    head = '<div style="display: grid; grid-template-columns: 250px repeat(3, minmax(0, 1fr)); gap: 0 10px; align-items: center"><span></span>' + ''.join(
        f'<span style="display: flex; align-items: center; justify-content: center; height: 76px; border-radius: 24px 24px 0 0; background: {C["encre"] if d else "transparent"}; font-family: {D}; font-weight: 650; font-size: 36px; letter-spacing: -0.03em; color: {C["sable"] if d else C["encre"]}">{n}</span>' for n, d in cols) + '</div>'
    body = ''
    for ri, (lab, vals) in enumerate(rows):
        last = ri == len(rows) - 1
        body += ('<div style="display: grid; grid-template-columns: 250px repeat(3, minmax(0, 1fr)); gap: 0 10px; align-items: stretch">'
                 f'<span style="display: flex; align-items: center; padding: 26px 0; font-family: {F}; font-weight: 600; font-size: 26px; color: rgba(26,26,26,.68); box-shadow: inset 0 {"0" if last else "-2px"} 0 rgba(26,26,26,.08)">{lab}</span>'
                 + ''.join(f'<span style="display: flex; align-items: center; justify-content: center; text-align: center; padding: 26px 0; font-family: {D if ri == 0 else F}; font-weight: {700 if ri == 0 else 600}; font-size: {40 if ri == 0 else 29}px; letter-spacing: {"-0.03em" if ri == 0 else "0"}; color: {C["sable"] if cols[i][1] else C["encre"]}; background: {C["encre"] if cols[i][1] else "transparent"}; border-radius: {"0 0 24px 24px" if (cols[i][1] and last) else "0"}; box-shadow: inset 0 {"0" if last or cols[i][1] else "-2px"} 0 rgba(26,26,26,.08)">{v}</span>' for i, v in enumerate(vals))
                 + '</div>')
    inner = f'''
<div style="position: absolute; left: 88px; right: 88px; top: 88px; display: flex; align-items: center; justify-content: space-between">{logo(44)}{dashes(4, 1, C['lavf'], 'rgba(26,26,26,.14)')}</div>
<h2 style="position: absolute; left: 88px; right: 88px; top: 200px; margin: 0; font-family: {D}; font-weight: 650; font-size: 84px; line-height: 0.98; letter-spacing: -0.035em; color: {C['encre']}">Les formules, côte à côte</h2>
<div style="position: absolute; left: 70px; right: 70px; top: 430px; box-sizing: border-box; padding: 36px 36px 30px; border-radius: 40px; background: {C['blanc']}">{head}{body}</div>
<p style="position: absolute; left: 88px; right: 88px; bottom: 80px; margin: 0; font-family: {F}; font-weight: 600; font-size: 26px; color: rgba(26,26,26,.6)">Délais en jours ouvrés. Mêmes prix pour une commune ou une entreprise.</p>'''
    return frame(C['sable'], inner, m)


def C3():
    m = motif(MOTIF['lavc'], 1500, 420, -200, 0)
    items = [('Publication', '1', -7, 70, 170), ('Actualité du site', '1', 5, 560, 140), ('Lettre d’information', '3', 4, 90, 440), ('Affiche', '4', -5, 590, 430)]
    toks = ''
    for t, n, r, x, y in items:
        toks += (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 420px; transform: rotate({r}deg); box-sizing: border-box; padding: 30px 34px; border-radius: 36px; background: {C["blanc"]}; box-shadow: {SH}; display: flex; align-items: center; justify-content: space-between; gap: 20px">'
                 f'<span style="font-family: {F}; font-weight: 650; font-size: 30px; line-height: 1.15; color: {C["encre"]}">{t}</span>'
                 f'<span style="flex: none; display: flex; align-items: center; justify-content: center; width: 96px; height: 96px; border-radius: 50%; background: {C["lav"]}; font-family: {D}; font-weight: 700; font-size: 46px; color: {C["encre"]}">{n}</span></div>')
    inner = f'''{toks}
<div style="position: absolute; left: 330px; top: 640px; z-index: 2">{tag('Reportage photo · 13 unités', C['encre'], C['sable'], 26)}</div>
{header_row(logo(44), 4, 2, C['lavf'], 'rgba(26,26,26,.14)', 846)}
<div style="position: absolute; left: 88px; right: 88px; top: 940px">{statement(f'Chaque contenu vaut un nombre d’unités, {hl("connu avant de commencer", C["lavt"])}. Les unités sont décomptées à la livraison.', C['encre'])}</div>'''
    return frame(C['lavc'], inner, m)


def C4():
    m = motif(MOTIF['encre'], 1600, 300, -220, 0)
    inner = f'''
<div style="position: absolute; right: 88px; top: 88px">{dashes(4, 3, C['lav'], 'rgba(248,245,242,.2)')}</div>
<div style="position: absolute; left: 88px; top: 88px">{logo(52, C['sable'])}</div>
<div style="position: absolute; left: 88px; right: 88px; top: 360px; display: flex; flex-direction: column; gap: 26px">
<h1 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 124px; line-height: 0.96; letter-spacing: -0.04em; color: {C['sable']}">Premier mois sans engagement.</h1>
<p style="margin: 0; font-family: {SF}; font-style: italic; font-weight: 300; font-size: 64px; line-height: 1.06; letter-spacing: -0.02em; color: {C['lavc']}">Opérationnel sous 24 h après votre accord.</p></div>
<div style="position: absolute; left: 88px; right: 88px; bottom: 120px; display: flex; flex-direction: column; gap: 30px; align-items: flex-start">
{cta('fill.studioes.fr', C['lav'])}
<span style="font-family: {F}; font-weight: 500; font-size: 28px; color: rgba(248,245,242,.7)">Puis 6 mois, résiliable ensuite chaque mois.</span></div>'''
    return frame(C['encre'], inner, m)


POSTS = [
    ('J1', 'Lancement · Ce qu’est Fill', [A1, A2, A3, A4, A5]),
    ('J2', 'Lancement · Comment ça marche', [B1, B2, B3, B4, B5]),
    ('J3', 'Lancement · Les formules', [C1, C2, C3, C4]),
]

if __name__ == '__main__':
    for key, title, pages in POSTS:
        for i, f in enumerate(pages, 1):
            write(f'{key}-{i}.dc.html', f'{title} · page {i}', 1080, 1350, f())
    print('ok')
