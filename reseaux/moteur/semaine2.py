"""Série « Une semaine de com dans une commune de 3 000 habitants », version 2 (épisode 1 pilote).
Couverture photo + notifications animées, un message par page. Rendu : python3 semaine2.py ; render.py sv1-01..05 ;
video.py sv1-01,sv1-04 1080 1350 <dossier>."""
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page, A
from guide2 import ico, F_D, phone
from v2 import photo, fondu, rgb, pill, titre, rond_fleche, fin, av, notif, M

N = 5
LAVF, LAVC = rgb(C['lavf']), rgb(C['lavc'])

DEM = [('AB', C['lavc'], 'Les Amis du bourg', 'Le loto du 17 : sur le site et Facebook ?', '8 h 02', 'Site', 'Facebook'),
       ('AF', C['corc'], 'Adjoint aux fêtes', 'Photos de la cérémonie, à publier vite', '8 h 15', 'Photos', None),
       ('ST', '#DFEEE6', 'Services techniques', 'Travaux rue de l’École dès jeudi', '8 h 31', 'Alerte', None),
       ('UH', '#FFD36B', 'Un habitant', 'L’agenda affiche encore la fête de l’été', '8 h 47', 'Agenda', None),
       ('CF', C['lav'], 'Club de football', 'L’affiche du tournoi en pièce jointe', '8 h 58', 'Affiche', None)]


def lg(dark=False):
    return logo(44, C['sable'], C['lav'], C['cor']) if dark else logo(44, C['encre'], C['lav'], C['cor'])


# ---------- 1 · couverture (animée) ----------
def p1():
    # photo dans un cadre net, notifications blanches dessus, titre sur l'aplat : aucun dégradé
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["sable"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Une semaine de com · 1/6", C["lavc"], C["lavt"], 58, 24)}</div>'
    b += photo('cafe-ordi', M, 196, 904, 640, 'center 55%', 40)
    for i, (a, bg, n, m, h, *_ ) in enumerate(DEM[:3]):
        b += notif(150 - i * 30, 262 + i * 132, 790, a, bg, n, m, h, rot=(-1.5, 1.2, -.8)[i], anim=A('drop', .3 + i * .45, .55, r=(-1.5, 1.2, -.8)[i]), fs=1.15)
    b += (f'<span {A("pop", 1.7, .45)} style="position:absolute;left:{1080 - M - 48}px;top:230px;z-index:3;display:grid;place-items:center;width:76px;height:76px;border-radius:50%;'
          f'background:{C["cor"]};font-family:\'Bricolage Grotesque\';font-weight:800;font-size:40px;color:{C["encre"]};box-shadow:0 0 0 6px {C["lavf"]}">'
          f'<span data-a="steps" data-s="0" data-times="0.4,0.85,1.3,1.75,2.1" data-base="0">5</span></span>')
    b += (f'<div style="position:absolute;left:{M}px;right:240px;top:878px">'
          f'<div {A("up", 1.9, .7)} class="D" style="font-weight:700;font-size:150px;line-height:.88;letter-spacing:-.055em;color:{C["sable"]}">Lundi, 9{NB}h.</div>'
          f'<div {A("up", 2.15, .7)} class="I" style="font-size:72px;line-height:1.05;letter-spacing:-.02em;color:{C["lavc"]};margin-top:14px">la boîte de réception.</div></div>'
          )
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['sable'], C['lavf'], anim=2.6)
    return b


# ---------- 2 · cinq demandes, cinq supports ----------
def inbox_screen(w):
    rows = ''
    for a, bg, n, m, h, s1, s2 in DEM:
        rows += (f'<div style="display:flex;align-items:center;gap:16px;padding:19px 0;border-top:1.5px solid rgba(26,26,26,.07)">{av(a, bg, s=54)}'
                 f'<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><b style="font-size:21px">{n}</b><span style="font-size:16px;color:rgba(26,26,26,.45)">{h}</span></div>'
                 f'<div style="margin-top:2px;font-size:18px;color:rgba(26,26,26,.62);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{m}</div></div></div>')
    return (f'<div style="position:absolute;inset:0;background:#fff;padding:78px 22px 0">'
            f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px"><span class="D" style="font-weight:760;font-size:30px;letter-spacing:-.03em">Boîte de la mairie</span>'
            f'<span style="display:grid;place-items:center;min-width:34px;height:34px;padding:0 8px;border-radius:17px;background:{C["cor"]};font-weight:800;font-size:18px">5</span></div>'
            f'<div style="font-size:15px;font-weight:600;color:rgba(26,26,26,.45);padding-bottom:8px">Lundi · non lus</div>{rows}</div>')


def p2():
    b = motif(MOTIF['lavc'], 2300, 120, -420)
    b += head(N, 1, lg(), C['lavf'], 'rgba(26,26,26,.14)')
    b += titre('Cinq demandes,', 'avant 9 h.', fs=96, c2=C['lavt'])
    b += phone(275, 420, 530, -3, inbox_screen(500), h=800)
    tags = [('Site', 110, 520, -6, C['lavf'], C['sable']), ('Facebook', 770, 540, 5, '#fff', C['encre']), ('Photos', 96, 760, 4, C['cor'], C['encre']),
            ('Alerte travaux', 690, 840, -4, C['encre'], C['sable']), ('Agenda', 130, 1010, -3, '#fff', C['encre']), ('Affiche', 800, 1080, 6, C['lav'], C['encre'])]
    for t, x, y, r, bg, fg in tags:
        b += f'<div style="position:absolute;left:{x}px;top:{y}px;z-index:3;transform:rotate({r}deg);box-shadow:0 24px 40px -24px rgba(30,12,70,.6);border-radius:999px">{pill(t, bg, fg, 70, 28)}</div>'
    return b


# ---------- 3 · le constat ----------
def p3():
    b = motif(MOTIF['lavf'], 2300, 120, -420)
    b += head(N, 2, lg(True), C['lavc'], 'rgba(248,245,242,.24)')
    b += titre('Aucune n’est difficile.', 'Elles arrivent toutes<br>au même endroit.', fs=86, c1=C['sable'], c2=C['lavc'])
    # cinq expéditeurs qui convergent vers une seule boîte
    xs = [M + i * 190 for i in range(5)]
    for i, (a, bg, *_ ) in enumerate(DEM):
        b += f'<div style="position:absolute;left:{xs[i] + 30}px;top:540px">{av(a, bg, s=84)}</div>'
    b += (f'<svg width="1080" height="200" style="position:absolute;left:0;top:630px" fill="none" stroke="{C["lav"]}" stroke-width="4" stroke-linecap="round">'
          + ''.join(f'<path d="M{xs[i] + 72} 10 C {xs[i] + 72} 90, 540 90, 540 170"/>' for i in range(5)) + '</svg>')
    b += photo('mairie-grille', M, 810, 904, 300, 'center 45%', 40, anim=False)
    b += (f'<div style="position:absolute;left:{540 - 210}px;top:776px;width:420px;display:flex;justify-content:center">'
          f'{pill("Boîte de la mairie", "#fff", C["encre"], 68, 27, icon=ico("mail", 28))}</div>')
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:1140px;font-weight:600;font-size:32px;line-height:1.3;color:{C["sable"]}">'
          f'Souvent, c’est le secrétariat de mairie,<br>entre l’état civil et l’urbanisme.</div>')
    return b


# ---------- 4 · le réflexe (animé) ----------
GESTES = [('1', 'Une seule adresse', 'pour toutes les demandes', 'mail', C['lavf'], C['sable'], C['lavc']),
          ('2', 'Une date souhaitée', 'demandée à chaque fois', 'clock', '#fff', C['encre'], C['lavt']),
          ('3', 'Le tri du lundi', 'puis on publie dans l’ordre', 'check', C['encre'], C['sable'], C['lav'])]


def p4():
    b = motif(MOTIF['lav'], 2300, 120, -420)
    b += head(N, 3, logo(44, C['encre'], C['lavc'], C['cor']), C['encre'], 'rgba(26,26,26,.16)')
    b += titre('Le réflexe', 'qui change la semaine.', fs=96, c2=C['lavt'])
    for i, (n, t, s, icn, bg, fg, acc) in enumerate(GESTES):
        y = 470 + i * 236
        icon = check(acc, 52) if icn == 'check' else ico(icn, 52, acc)
        b += (f'<div {A("left" if i % 2 == 0 else "right", .3 + i * .45, .6, r=(-1.5, 1.2, -1)[i])} style="position:absolute;left:{M}px;width:904px;top:{y}px;height:212px;border-radius:40px;background:{bg};'
              f'display:flex;align-items:center;gap:32px;padding:0 44px;transform:rotate({(-1.5, 1.2, -1)[i]}deg);box-shadow:0 34px 60px -38px rgba(30,12,70,.6)">'
              f'<span class="D" style="flex:none;width:96px;font-weight:800;font-size:130px;line-height:.8;letter-spacing:-.06em;color:{acc}">{n}</span>'
              f'<div style="flex:1"><div class="D" style="font-weight:720;font-size:52px;line-height:1;letter-spacing:-.03em;color:{fg}">{t}</div>'
              f'<div class="I" style="font-size:38px;margin-top:8px;color:{acc}">{s}</div></div>'
              f'<span style="flex:none;width:92px;height:92px;border-radius:28px;background:rgba(255,255,255,.12);display:grid;place-items:center;{"background:" + C["lavc"] + ";" if bg == "#fff" else ""}">{icon}</span></div>')
    return b


def p5():
    return fin(N, 4, MOTIF['lavf'], 'Une semaine de com<br>dans une commune.', 'Épisode 1 sur 6.', C['lavc'], sous='Enregistrez la série pour la retrouver')


PAGES = [(p1, C['lavf'], 3.3), (p2, C['lavc'], 1), (p3, C['lavf'], 1), (p4, C['lav'], 2.0), (p5, C['lavf'], 1)]

if __name__ == '__main__':
    for i, (f, bg, end) in enumerate(PAGES):
        page(f'sv1-{i + 1:02d}', bg, f(), end=end)
    print('ok')
