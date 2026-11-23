"""« Une semaine de com dans une commune de 3 000 habitants » : un seul post de 10 pages (mardi 5 janvier 2027, 11 h).
Du lundi au vendredi, ce qui arrive sur le bureau, puis le bilan et trois gestes. Une photo différente par page photo,
aucun dégradé, texte sur aplat, couverture fixe ; seule la page du lundi est animée (les demandes arrivent une à une).
Rendu : python3 semaine3.py ; render.py sc-01..10 ; video.py sc-03 1080 1350 <dossier>."""
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page, A
from guide2 import ico, F_D, phone
from v2 import pill, rond_fleche, fin, av, M, tflow, pied, mise, jour, cadre, carte, OMBRE

N = 10
DEM = [('AB', C['lavc'], 'Les Amis du bourg', 'Le loto du 17 : sur le site et Facebook ?', '8 h 02'),
       ('AF', C['corc'], 'Adjoint aux fêtes', 'Photos de la cérémonie, à publier vite', '8 h 15'),
       ('ST', '#DFEEE6', 'Services techniques', 'Travaux rue de l’École dès jeudi', '8 h 31'),
       ('UH', '#FFD36B', 'Un habitant', 'L’agenda affiche encore la fête de l’été', '8 h 47'),
       ('CF', C['lav'], 'Club de football', 'L’affiche du tournoi en pièce jointe', '8 h 58')]
JOURS = [('Lun.', 'Demandes'), ('Mar.', 'Vœux'), ('Mer.', 'Site'), ('Jeu.', 'Imprévu'), ('Ven.', 'Réseaux')]


def lg(dark=False):
    return logo(44, C['sable'], C['lav'], C['cor']) if dark else logo(44, C['encre'], C['lav'], C['cor'])


def hd(i, dark, sur_lav=False):
    lo = logo(44, C['encre'], C['lavf'], C['cor']) if sur_lav else lg(dark)
    return head(N, i, lo, C['lavc'] if dark else C['lavf'], 'rgba(248,245,242,.24)' if dark else 'rgba(26,26,26,.14)')


def ligne(t, ok=None, extra='', fs=28, h=80, sub=''):
    """Ligne de liste : rond coché, rond vide ou rien."""
    if ok is True:
        r = f'<span style="flex:none;width:40px;height:40px;border-radius:50%;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 24)}</span>'
    elif ok is False:
        r = f'<span style="flex:none;width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 3px {C["lav"]}"></span>'
    else:
        r = ''
    s = f'<span style="flex:none;font-weight:600;font-size:20px;color:{C["lavt"]}">{sub}</span>' if sub else ''
    return (f'<div style="display:flex;align-items:center;gap:18px;height:{h}px;border-top:2px solid rgba(26,26,26,.07);{extra}">{r}'
            f'<span style="flex:1;font-weight:620;font-size:{fs}px;white-space:nowrap">{t}</span>{s}</div>')


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["sable"], C["lav"], C["cor"])}</div>'
    b += cadre('mairie-grille', M, 196, 904, 470, 'center 45%', 40)
    w = (904 - 4 * 14) // 5
    for i, (j, s_) in enumerate(JOURS):
        b += (f'<div style="position:absolute;left:{M + i * (w + 14)}px;top:604px;width:{w}px;height:124px;border-radius:26px;background:#fff;box-shadow:{OMBRE};'
              f'display:flex;flex-direction:column;justify-content:center;padding:0 20px">'
              f'<span class="D" style="font-weight:760;font-size:40px;letter-spacing:-.03em;color:{C["lavf"]}">{j}</span>'
              f'<span style="margin-top:4px;font-weight:650;font-size:21px;color:rgba(26,26,26,.6)">{s_}</span></div>')
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:800px">'
          f'<div class="D" style="font-weight:700;font-size:100px;line-height:.92;letter-spacing:-.05em;color:{C["sable"]}">Une semaine de com</div>'
          f'<div class="I" style="font-size:80px;line-height:1.04;letter-spacing:-.02em;color:{C["lavc"]};margin-top:8px">dans une commune<br>de 3 000 habitants.</div></div>')
    b += (f'<div style="position:absolute;left:{M}px;width:640px;top:1158px;font-weight:550;font-size:30px;line-height:1.3;color:{C["sable"]}">'
          f'Du lundi au vendredi,<br>ce qui arrive sur le bureau.</div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['sable'], C['lavf'])
    return b


# ---------- 2 · qui s'en occupe ----------
def p2():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(1, False)
    taches = ['Accueil du public', 'État civil', 'Urbanisme', 'Élections', 'Cimetière']
    rows = ''.join(ligne(t, True, fs=26, h=66) for t in taches)
    rows += (f'<div style="display:flex;align-items:center;gap:16px;height:80px;margin:8px -16px 0;padding:0 16px;border-radius:22px;background:{C["cor"]};color:{C["encre"]}">'
             f'<span style="flex:none;width:40px;height:40px;border-radius:50%;background:{C["encre"]};display:grid;place-items:center;font-weight:800;font-size:28px;color:{C["cor"]}">+</span>'
             f'<span style="flex:1;font-weight:720;font-size:27px">Communication</span><span style="font-weight:650;font-size:20px">en plus</span></div>')
    entete = (f'<div style="font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:{C["lavt"]}">Une seule fiche de poste</div>'
              f'<div class="D" style="margin:6px 0 12px;font-weight:720;font-size:36px;letter-spacing:-.02em">Secrétaire de mairie</div>')
    v = cadre('secretaire-tel', 0, 0, 380, 640, 'center 35%', 36)
    v += carte(404, 30, 500, entete + rows, pad='28px 30px 26px', rad=34)
    b += mise(tflow('Qui s’en occupe ?', 'Souvent, le secrétariat<br>de mairie.', 88, C['encre'], C['lavt']), v, 640,
              pied('La même personne tient l’accueil, l’état civil<br>et l’urbanisme. La com s’ajoute au reste.'))
    return b


# ---------- 3 · lundi (animée : les demandes arrivent une à une) ----------
def inbox_screen():
    rows = ''
    for k, (a, bg, n, m, h) in enumerate(DEM):
        rows += (f'<div {A("up", .4 + k * .5, .45)} style="display:flex;align-items:center;gap:16px;padding:19px 0;border-top:1.5px solid rgba(26,26,26,.07)">{av(a, bg, s=54)}'
                 f'<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><b style="font-size:21px">{n}</b><span style="font-size:16px;color:rgba(26,26,26,.45)">{h}</span></div>'
                 f'<div style="margin-top:2px;font-size:18px;color:rgba(26,26,26,.62);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{m}</div></div></div>')
    return (f'<div style="position:absolute;inset:0;background:#fff;padding:78px 22px 0">'
            f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px"><span class="D" style="font-weight:760;font-size:30px;letter-spacing:-.03em">Boîte de la mairie</span>'
            f'<span style="display:grid;place-items:center;min-width:34px;height:34px;padding:0 8px;border-radius:17px;background:{C["cor"]};font-weight:800;font-size:18px">'
            f'<span data-a="steps" data-s="0" data-times="0.4,0.9,1.4,1.9,2.4" data-base="0">5</span></span></div>'
            f'<div style="font-size:15px;font-weight:600;color:rgba(26,26,26,.45);padding-bottom:8px">Lundi · non lus</div>{rows}</div>')


def p3():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(2, False, True)
    v = phone(187, 0, 530, -2, inbox_screen(), h=740)
    tags = [('Site', 0, 70, -6, C['lavf'], C['sable']), ('Facebook', 720, 40, 5, '#fff', C['encre']), ('Photos', 10, 300, 4, C['cor'], C['encre']),
            ('Alerte travaux', 650, 330, -4, C['encre'], C['sable']), ('Agenda', 30, 520, -3, '#fff', C['encre']), ('Affiche', 740, 560, 6, C['lavc'], C['encre'])]
    for j, (t, x, y, r, bg, fg) in enumerate(tags):
        v += f'<div {A("pop", (.55, .6, 1.05, 1.55, 2.05, 2.55)[j], .4, r=r)} style="position:absolute;left:{x}px;top:{y}px;z-index:3;transform:rotate({r}deg);box-shadow:{OMBRE};border-radius:999px">{pill(t, bg, fg, 68, 27)}</div>'
    b += mise(tflow('Cinq demandes', 'avant 9 h.', 92, C['encre'], C['lavt'], pre=jour('Lundi', C['encre'], C['sable'])), v, 740)
    return b


# ---------- 4 · mardi : les vœux ----------
def p4():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(3, False)
    items = [('Invitation', '4 sem. avant', True), ('Annonce sur le site', '3 sem. avant', True), ('Diaporama de l’année', '2 sem. avant', True),
             ('Discours mis en page', 'la veille', False), ('Photos de la soirée', 'le soir même', False), ('Article du bulletin', 'après', False)]
    rows = ''.join(ligne(t, ok, fs=25, h=64, sub=q) for t, q, ok in items)
    v = cadre('micro-salle', 0, 0, 904, 380, '20% 32%', 36)
    v += carte(300, 230, 604, f'<div class="D" style="font-weight:720;font-size:32px;letter-spacing:-.02em;padding-bottom:10px">Cérémonie des vœux</div>{rows}', pad='26px 30px 18px', rad=34)
    b += mise(tflow('Les vœux se préparent.', 'Six supports pour une soirée.', 84, C['encre'], C['lavt'], pre=jour('Mardi', C['encre'], C['sable'])), v, 760)
    return b


# ---------- 5 · mercredi : le site ----------
def p5():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(4, False, True)
    barre = (f'<div style="display:flex;align-items:center;gap:10px;padding:0 0 22px">'
             + ''.join(f'<span style="width:16px;height:16px;border-radius:50%;background:{c}"></span>' for c in ('#E9E1FF', '#DDD2FF', '#CDBEFF'))
             + f'<span style="flex:1;margin-left:14px;height:40px;border-radius:20px;background:rgba(26,26,26,.05);display:flex;align-items:center;padding:0 18px;font-weight:550;font-size:19px;color:rgba(26,26,26,.5)">votre-commune.fr/agenda</span></div>')
    ev = (f'<div style="display:flex;align-items:center;gap:22px;padding:20px;border-radius:24px;background:rgba(26,26,26,.04)">'
          f'<div style="flex:none;width:100px;height:100px;border-radius:22px;background:{C["corc"]};display:flex;flex-direction:column;align-items:center;justify-content:center;color:{C["cort"]}">'
          f'<span class="D" style="font-weight:800;font-size:44px;line-height:1">14</span><span style="font-weight:700;font-size:19px">juil.</span></div>'
          f'<div style="flex:1"><div style="font-weight:700;font-size:30px">Fête de l’été</div>'
          f'<div style="margin-top:4px;font-weight:550;font-size:22px;color:rgba(26,26,26,.55)">Prochain événement à l’agenda</div></div>'
          f'{pill("Passé", C["cor"], C["encre"], 46, 20)}</div>')
    hor = ''.join(f'<div style="flex:1;padding:20px 20px 22px;border-radius:22px;background:{bg}">'
                  f'<div style="font-weight:700;font-size:19px;letter-spacing:.06em;text-transform:uppercase;color:{fg}">{t}</div>'
                  f'<div class="D" style="margin-top:8px;font-weight:720;font-size:32px;line-height:1.08;letter-spacing:-.02em">{h}</div></div>'
                  for t, h, bg, fg in [('Site', '8 h 30<br>à 12 h', C['lavc'], C['lavt']), ('Google', '9 h<br>à 12 h', C['corc'], C['cort']), ('Porte', '8 h 30<br>à 12 h 30', C['lavc'], C['lavt'])])
    inner = (barre + ev + f'<div style="margin-top:28px;font-weight:700;font-size:25px">Les horaires du lundi, selon où l’on regarde</div>'
             f'<div style="display:flex;gap:14px;margin-top:14px">{hor}</div>')
    v = carte(0, 0, 904, inner, pad='28px 34px 34px', rad=38)
    b += mise(tflow('Le site a vieilli.', 'L’agenda annonce encore l’été.', 84, C['encre'], C['lavt'], pre=jour('Mercredi', C['encre'], C['sable'])), v, 600,
              pied('Personne ne retire, personne ne remplace.'))
    return b


# ---------- 6 · jeudi : l'imprévu ----------
def p6():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(5, True)
    al = (f'<div style="display:flex;align-items:center;gap:14px"><span style="width:52px;height:52px;border-radius:14px;background:{C["cor"]};display:grid;place-items:center;font-weight:800;font-size:30px">!</span>'
          f'<b style="font-size:26px">Route fermée</b><span style="margin-left:auto;font-weight:600;font-size:20px;color:rgba(26,26,26,.45)">à publier dans l’heure</span></div>'
          f'<div style="margin-top:16px;font-weight:550;font-size:26px;line-height:1.38">La route de la zone artisanale est fermée jusqu’à vendredi midi. Déviation par le bourg.</div>'
          f'<div style="margin-top:20px;display:flex;gap:10px">' + ''.join(pill(t, C['lavc'], C['lavt'], 46, 20) for t in ('Facebook', 'Site', 'Panneau lumineux')) + '</div>')
    v = cadre('arbre-route', 0, 0, 904, 440, 'center 60%', 36)
    v += carte(90, 330, 814, al, pad='28px 32px', rad=32)
    b += mise(tflow('Un arbre tombe.', 'La route est fermée.', 92, C['sable'], C['lavc'], pre=jour('Jeudi, 16 h', C['sable'], C['lavf'])), v, 650,
              pied('L’information existe. Reste à la diffuser,<br>puis à annoncer la réouverture.', C['sable']))
    return b


# ---------- 7 · vendredi : les réseaux ----------
def p7():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(6, False)
    com = [('MR', C['corc'], 'Quand passent les encombrants ?', 'sous la photo des vœux'),
           ('JP', '#DFEEE6', 'Qui peut réparer le lampadaire ?', 'en message privé, dimanche'),
           ('SL', '#FFD36B', 'La route est rouverte ?', 'sous l’alerte de jeudi')]
    rows = ''
    for a, bg, t, s in com:
        rows += (f'<div style="display:flex;align-items:center;gap:18px;padding:20px 0;border-top:2px solid rgba(26,26,26,.07)">{av(a, bg, s=58)}'
                 f'<div style="flex:1"><div style="font-weight:650;font-size:27px">{t}</div><div style="margin-top:2px;font-weight:550;font-size:20px;color:rgba(26,26,26,.5)">{s}</div></div>'
                 f'{pill("Sans réponse", C["lavc"], C["lavt"], 42, 18)}</div>')
    v = carte(0, 0, 904, f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px"><span class="D" style="font-weight:720;font-size:34px">Commentaires et messages</span>'
              f'{pill("12 non lus", C["cor"], C["encre"], 44, 19)}</div>{rows}', pad='28px 34px 18px', rad=36)
    b += mise(tflow('Publier prend dix minutes.', 'Répondre prend la suite.', 84, C['encre'], C['lavt'], pre=jour('Vendredi', C['encre'], C['sable'])), v, 470,
              pied('Une page qui répond reste suivie.'))
    return b


# ---------- 8 · le bilan ----------
def p8():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(7, True)
    rec = [('Lun.', '5 demandes à trier'), ('Mar.', '6 supports pour les vœux'), ('Mer.', 'Un site à remettre à jour'), ('Jeu.', 'Une alerte à diffuser'), ('Ven.', '12 messages sans réponse')]
    v = ''
    for i, (j, t) in enumerate(rec):
        v += (f'<div style="position:absolute;left:0;right:0;top:{i * 108}px;height:92px;border-radius:24px;background:rgba(248,245,242,.12);display:flex;align-items:center;gap:24px;padding:0 28px">'
              f'<span class="D" style="flex:none;width:96px;font-weight:760;font-size:36px;color:{C["lavc"]}">{j}</span>'
              f'<span style="font-weight:620;font-size:30px;color:{C["sable"]}">{t}</span></div>')
    b += mise(tflow('Ce temps n’apparaît', 'nulle part.', 92, C['sable'], C['lavc']), v, 4 * 108 + 92,
              pied('Il est pris sur l’accueil et l’urbanisme.<br>Quand la personne s’absente, la com s’arrête.', C['sable']))
    return b


# ---------- 9 · les gestes ----------
GESTES = [('1', 'Une seule adresse', 'pour toutes les demandes', 'mail', C['lavf'], C['sable'], C['lavc']),
          ('2', 'Des messages prêts', 'pour l’imprévu', 'clock', '#fff', C['encre'], C['lavt']),
          ('3', 'Un rendez-vous fixe', 'pour le site et les réseaux', 'check', C['encre'], C['sable'], C['lav'])]


def p9():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(8, False)
    v = ''
    for i, (n, t, s, icn, bg, fg, acc) in enumerate(GESTES):
        icon = check(acc, 50) if icn == 'check' else ico(icn, 50, acc)
        v += (f'<div style="position:absolute;left:0;right:0;top:{i * 224}px;height:200px;border-radius:38px;background:{bg};box-shadow:{OMBRE};'
              f'display:flex;align-items:center;gap:32px;padding:0 44px">'
              f'<span class="D" style="flex:none;width:90px;font-weight:800;font-size:124px;line-height:.8;letter-spacing:-.06em;color:{acc}">{n}</span>'
              f'<div style="flex:1"><div class="D" style="font-weight:720;font-size:50px;line-height:1;letter-spacing:-.03em;color:{fg}">{t}</div>'
              f'<div class="I" style="font-size:36px;margin-top:8px;color:{acc}">{s}</div></div>'
              f'<span style="flex:none;width:88px;height:88px;border-radius:26px;background:{C["lavc"] if bg == "#fff" else "rgba(255,255,255,.12)"};display:grid;place-items:center">{icon}</span></div>')
    b += mise(tflow('Trois gestes', 'qui changent la semaine.', 92, C['encre'], C['lavt']), v, 2 * 224 + 200,
              pied('À mettre en place une fois, utiles toute l’année.'))
    return b


def p10():
    return fin(N, 9, MOTIF['lavf'], 'Et chez vous,<br>qui s’en occupe ?', 'Premier mois sans engagement.', C['lavc'])


PAGES = [(p1, C['lavf'], 1), (p2, C['lavc'], 1), (p3, C['lav'], 3.2), (p4, C['lavc'], 1), (p5, C['lav'], 1),
         (p6, C['lavf'], 1), (p7, C['lavc'], 1), (p8, C['lavf'], 1), (p9, C['lavc'], 1), (p10, C['lavf'], 1)]

TEXTE = """Une semaine de com dans une commune de 3 000 habitants, du lundi au vendredi.

Lundi, cinq demandes arrivent avant 9 h : une association, un adjoint, les services techniques, un habitant, le club de foot.
Mardi, les vœux se préparent : six supports pour une soirée.
Mercredi, le site affiche encore la fête de l'été, et trois horaires différents pour le même guichet.
Jeudi, 16 h, un arbre tombe : la route est fermée, l'information doit partir dans l'heure.
Vendredi, les commentaires et les messages attendent une réponse.

Dans beaucoup de communes de cette taille, c'est le secrétariat de mairie qui s'en charge, entre l'état civil et l'urbanisme. Ce temps n'apparaît nulle part, et quand la personne s'absente, la com s'arrête.

Trois gestes changent la semaine : une seule adresse pour les demandes, des messages prêts pour l'imprévu, un rendez-vous fixe pour le site et les réseaux.

Et chez vous, qui s'en occupe ? Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #communes #communicationpublique #mairie"

if __name__ == '__main__':
    for i, (f, bg, end) in enumerate(PAGES):
        page(f'sc-{i + 1:02d}', bg, f(), end=end)
    print('ok')
