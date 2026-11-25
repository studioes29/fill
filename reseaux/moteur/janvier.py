"""Guide · « Préparer janvier avant les congés » (jeudi 10 décembre 2026, 11 h).
Version 2 (retours d'Ewen du 25 nov.) : couverture d'hiver plus vivante ; page 2 en vrai calendrier ;
page 3 en frise de janvier, collectivités (lavande) et entreprises (corail) bien distinctes ; page 4 en vraie publication
dans un téléphone (photo de clé et de porte) ; pages 5 et 6 en story et en semaine planifiée ; page 7 en dossier ouvert ;
titre et description avant le visuel partout ; exemples valables pour une commune comme pour une entreprise.
Soldes d'hiver 2027 : à partir du mercredi 6 janvier (règle du Code de commerce, vérifiée le 25 nov. 2026).
Famille lavande, couverture lavande claire, 9 pages fixes. Rendu : python3 janvier.py ; render.py gj-01..09."""
import sys
sys.path.insert(0, '/home/claude/fill/reseaux/canevas')
from lgen import C, MOTIF, NB, logo, motif, head, check, page
from guide2 import ico
from v2 import pill, rond_fleche, fin, av, M, cadre, carte, OMBRE, HD, tete, mise2

N = 9
GRIS = 'rgba(26,26,26,.55)'
NOM = 'Votre structure'


def hd(i, fond):
    if fond == 'lavf':
        return head(N, i, logo(44, C['sable'], C['lav'], C['cor']), C['lavc'], 'rgba(248,245,242,.24)')
    if fond == 'lav':
        return head(N, i, logo(44, C['encre'], C['lavf'], C['cor']), C['encre'], 'rgba(26,26,26,.16)')
    return head(N, i, logo(44, C['encre'], C['lav'], C['cor']), C['lavf'], 'rgba(26,26,26,.14)')


def ent(t, col=None, fs=18):
    return f'<div style="font-weight:700;font-size:{fs}px;letter-spacing:.08em;text-transform:uppercase;color:{col or C["lavt"]}">{t}</div>'


def num(n, bg=None, fg=None):
    return f'<div style="margin-bottom:22px">{pill(f"Geste {n} sur 4", bg or C["encre"], fg or C["sable"], 50, 21)}</div>'


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("À faire en décembre", C["lavf"], C["sable"], 58, 24, icon=ico("clock", 24, C["sable"]))}</div>'
    b += cadre('gj-hiver', M, 196, 904, 660, 'center 62%', 40)
    feuille = (f'<div style="width:236px;border-radius:30px;overflow:hidden;background:#fff;box-shadow:0 26px 50px -24px rgba(20,10,40,.6);transform:rotate(4deg)">'
               f'<div style="height:62px;background:{C["lavf"]};color:{C["sable"]};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:24px;letter-spacing:.06em">JANVIER</div>'
               f'<div style="padding:16px 0 22px;text-align:center"><div style="font-weight:650;font-size:22px;color:{GRIS}">Lundi</div>'
               f'<div class="D" style="font-weight:800;font-size:104px;line-height:.95;letter-spacing:-.05em">4</div>'
               f'<div style="margin-top:6px;font-weight:700;font-size:22px;color:{C["lavt"]}">La reprise</div></div></div>')
    b += f'<div style="position:absolute;right:{M + 30}px;top:690px">{feuille}</div>'
    b += (f'<div style="position:absolute;left:{M}px;right:360px;top:900px">'
          f'<div class="D" style="font-weight:700;font-size:100px;line-height:.92;letter-spacing:-.05em">Préparer janvier</div>'
          f'<div class="I" style="font-size:84px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">avant les congés.</div></div>')
    b += (f'<div style="position:absolute;left:{M}px;width:640px;top:1168px;font-weight:550;font-size:30px;line-height:1.3;color:rgba(26,26,26,.78)">'
          f'Quatre gestes pour une reprise<br>sans page blanche.</div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : un vrai calendrier ----------
SEMS = [('14 déc.', [14, 15, 16, 17, 18], 'prep'), ('21 déc.', [21, 22, 23, 24, 25], 'conges'), ('28 déc.', [28, 29, 30, 31, 1], 'conges'),
        ('4 janv.', [4, 5, 6, 7, 8], 'reprise'), ('11 janv.', [11, 12, 13, 14, 15], 'rdv')]
FERIES = {25, 1}


def p2():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(1, 'lav')
    cw, lw, gap = 116, 172, 10
    entete = (f'<div style="display:flex;gap:{gap}px;padding-left:{lw + gap}px;margin-bottom:12px">'
              + ''.join(f'<span style="width:{cw}px;text-align:center;font-weight:700;font-size:19px;color:{GRIS}">{j}</span>' for j in ('Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.')) + '</div>')
    rows = ''
    for lab, jours, k in SEMS:
        cells = ''
        for d in jours:
            fer = d in FERIES
            if k == 'conges':
                bg, fg = 'rgba(26,26,26,.05)', 'rgba(26,26,26,.32)'
            elif k == 'prep':
                bg, fg = C['lavf'], C['sable']
            elif k == 'reprise':
                bg, fg = (C['cor'], C['encre']) if d == 4 else (C['lavc'], C['lavt'])
            else:
                bg, fg = C['lavc'], C['lavt']
            tag = '<span style="font-weight:700;font-size:13px;letter-spacing:.04em">FÉRIÉ</span>' if fer else ''
            cells += (f'<span style="width:{cw}px;height:96px;border-radius:16px;background:{bg};color:{fg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px">'
                      f'<span class="D" style="font-weight:760;font-size:32px;line-height:1">{d}</span>{tag}</span>')
        lbl = {'prep': ('À préparer', C['lavf']), 'conges': ('Congés', 'rgba(26,26,26,.4)'), 'reprise': ('Reprise', C['encre']), 'rdv': ('Premiers rendez-vous', C['lavt'])}[k]
        rows += (f'<div style="display:flex;gap:{gap}px;align-items:center;margin-top:{gap}px">'
                 f'<div style="width:{lw}px"><div style="font-weight:600;font-size:17px;color:{GRIS}">Sem. du {lab}</div>'
                 f'<div style="margin-top:2px;font-weight:750;font-size:21px;line-height:1.15;color:{lbl[1]}">{lbl[0]}</div></div>{cells}</div>')
    v = carte(0, 0, 904, entete + rows, pad='28px 30px 32px', rad=40)
    b += mise2(tete('Deux semaines creuses,', 'puis tout repart d’un coup.',
                    'Ce qui doit paraître début janvier<br>se prépare donc avant de partir.', 84, C['encre'], C['encre'], C['encre']), v, 650)
    return b


# ---------- 3 · janvier : collectivités et entreprises ----------
SEM_J = ['Sem. du 4', 'Sem. du 11', 'Sem. du 18', 'Sem. du 25']
COLL = [(0, 'Horaires de reprise'), (0, 'Cérémonie des vœux', 2), (1, 'Repas ou galette des aînés'), (2, 'Recensement, dès la mi-janvier', 2)]
ENTR = [(0, 'Réouverture'), (0, 'Soldes d’hiver, dès le 6', 1), (1, 'Vœux aux clients'), (2, 'Offres d’emploi de début d’année', 2)]


def piste(items, bg, fg, cw, gap):
    """Une piste de la frise : les rendez-vous posés dans leur semaine (un élément peut couvrir plusieurs semaines)."""
    rangs = [[], []]
    out = ''
    for it in items:
        s, t = it[0], it[1]
        n = it[2] if len(it) > 2 else 1
        r = 0 if all(not (a < s + n and s < a + m) for a, m in rangs[0]) else 1
        rangs[r].append((s, n))
        x = s * (cw + gap); w = n * cw + (n - 1) * gap
        out += (f'<div style="position:absolute;left:{x}px;top:{r * 92}px;width:{w}px;height:80px;border-radius:18px;background:{bg};color:{fg};'
                f'display:flex;align-items:center;padding:0 18px;font-weight:680;font-size:21px;line-height:1.15">{t}</div>')
    return f'<div style="position:relative;height:172px">{out}</div>'


def p3():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(2, 'lavc')
    gap = 10
    cw = (904 - 2 * 32 - 3 * gap) // 4
    tete_sem = (f'<div style="display:flex;gap:{gap}px;margin-bottom:18px">'
                + ''.join(f'<span style="width:{cw}px;height:44px;border-radius:12px;background:rgba(26,26,26,.05);display:grid;place-items:center;font-weight:700;font-size:19px;color:{GRIS}">{s}</span>' for s in SEM_J) + '</div>')
    lab = lambda t, bg, fg, icn: (f'<div style="display:flex;align-items:center;gap:12px;margin:6px 0 14px">'
                                  f'<span style="width:44px;height:44px;border-radius:50%;background:{bg};display:grid;place-items:center">{ico(icn, 22, fg)}</span>'
                                  f'<b style="font-size:24px">{t}</b></div>')
    inner = (tete_sem + lab('Collectivités', C['lavf'], C['sable'], 'pin') + piste(COLL, C['lavf'], C['sable'], cw, gap)
             + f'<div style="height:2px;background:rgba(26,26,26,.07);margin:20px 0 14px"></div>'
             + lab('Entreprises', C['cor'], C['encre'], 'com') + piste(ENTR, C['corc'], C['cort'], cw, gap))
    v = carte(0, 0, 904, inner, pad='30px 32px 30px', rad=40)
    b += mise2(tete('Janvier a ses rendez-vous,', 'connus dès maintenant.',
                    'Chacun demande une annonce, un texte,<br>une mise à jour du site.', 80, C['encre'], C['lavt']), v, 600)
    return b


# ---------- 4 · geste 1 : la reprise, en vraie publication ----------
def telephone(inner, w=372, h=700, fond='#fff'):
    return (f'<div style="width:{w}px;height:{h}px;border-radius:52px;background:{C["encre"]};padding:14px;box-shadow:0 30px 60px -30px rgba(20,10,40,.6)">'
            f'<div style="position:relative;width:100%;height:100%;border-radius:40px;overflow:hidden;background:{fond}">'
            f'<div style="position:absolute;left:50%;top:12px;width:96px;height:26px;margin-left:-48px;border-radius:13px;background:{C["encre"]};z-index:2"></div>{inner}</div></div>')


def p4():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(3, 'lav')
    icones = ''.join(ico(n, 30, C['encre']) for n in ('heart', 'com', 'send'))
    insta = (f'<div style="padding:58px 18px 12px;display:flex;align-items:center;gap:10px">{av("VS", C["lavc"], s=40)}'
             f'<b style="font-size:18px">{NOM.lower().replace(" ", "")}</b><span style="margin-left:auto;font-weight:800;font-size:22px;letter-spacing:2px">···</span></div>'
             f'<div style="position:relative;height:300px;overflow:hidden"><img src="{HD}gj-cle.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 45%"></div>'
             f'<div style="display:flex;gap:16px;padding:14px 18px 6px">{icones}<span style="margin-left:auto">{ico("save", 30, C["encre"])}</span></div>'
             f'<div style="padding:4px 18px;font-weight:550;font-size:17px;line-height:1.4"><b>{NOM.lower().replace(" ", "")}</b> De retour le lundi 4{NB}janvier : '
             f'accueil de 9{NB}h à 12{NB}h et de 14{NB}h à 17{NB}h. Belle année à{NB}vous.</div>')
    v = f'<div style="position:absolute;left:30px;top:0">{telephone(insta, 360, 640)}</div>'
    prog = (f'{ent("Programmé")}<div class="D" style="margin-top:6px;font-weight:740;font-size:40px;letter-spacing:-.03em;line-height:1">Lundi 4 janvier</div>'
            f'<div style="margin-top:6px;font-weight:600;font-size:22px;color:{GRIS}">8{NB}h 30, Facebook et Instagram</div>')
    v += carte(450, 50, 454, prog, pad='26px 30px 28px', rad=30)
    site = (f'{ent("Sur le site, déjà à jour")}<div style="margin-top:12px;display:flex;flex-direction:column;gap:10px">'
            + ''.join(f'<div style="display:flex;align-items:center;gap:12px;height:56px;padding:0 18px;border-radius:16px;background:{C["lavc"]}">'
                      f'{check(C["lavt"], 22)}<b style="font-size:22px;color:{C["lavt"]}">{t}</b></div>' for t in ('Horaires en page d’accueil', 'Page Contact', 'Bandeau « Fermé » retiré'))
            + '</div>')
    v += carte(450, 270, 454, site, pad='26px 30px 28px', rad=30)
    b += mise2(tete('La reprise,', 'écrite d’avance.',
                    'Une publication programmée pour le premier jour,<br>et les horaires du site déjà à jour.', 88, C['encre'], C['encre'], C['encre'], pre=num(1)), v, 640)
    return b


# ---------- 5 · geste 2 : les rendez-vous annoncés tôt ----------
ETAPES = [('Vendredi 11 décembre', 'L’invitation part', True), ('Vendredi 18 décembre', 'Réponses attendues', True),
          ('Du 21 décembre au 1er janvier', 'Congés', False), ('Vendredi 15 janvier', 'La soirée des vœux', True)]


def p5():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(4, 'lavc')
    story = (f'<img src="{HD}gj-voeux.jpg" style="position:absolute;left:0;top:0;width:100%;height:58%;object-fit:cover;object-position:center 40%">'
             f'<div style="position:absolute;left:14px;right:14px;top:52px;display:flex;gap:6px">'
             + ''.join(f'<span style="flex:1;height:5px;border-radius:3px;background:{"#fff" if i == 0 else "rgba(255,255,255,.45)"}"></span>' for i in range(3)) + '</div>'
             f'<div style="position:absolute;left:0;right:0;bottom:0;height:42%;background:{C["lavf"]};padding:24px 24px;display:flex;flex-direction:column;justify-content:center">'
             f'<div class="D" style="font-weight:760;font-size:46px;line-height:.95;letter-spacing:-.035em;color:{C["sable"]}">Soirée<br>des vœux</div>'
             f'<div style="margin-top:12px;font-weight:650;font-size:19px;line-height:1.38;color:{C["lavc"]}">Vendredi 15 janvier, 18{NB}h{NB}30<br>Réponse avant le 18{NB}déc.</div></div>')
    v = f'<div style="position:absolute;left:0;top:0;transform:rotate(-2deg)">{telephone(story, 330, 620, C["lavf"])}</div>'
    pts = ''
    for i, (d, t, ok) in enumerate(ETAPES):
        dot = (f'<span style="position:absolute;left:0;top:6px;width:30px;height:30px;border-radius:50%;background:{C["lavf"] if ok else "#fff"};'
               f'box-shadow:inset 0 0 0 4px {C["lavf"] if ok else "rgba(26,26,26,.18)"}"></span>')
        pts += (f'<div style="position:relative;padding:0 0 34px 54px;{"" if ok else "opacity:.5"}">{dot}'
                f'<div style="font-weight:700;font-size:20px;color:{C["lavt"]}">{d}</div><div style="margin-top:3px;font-weight:700;font-size:27px">{t}</div></div>')
    frise = (f'{ent("Le bon calendrier")}<div style="position:relative;margin-top:24px">'
             f'<span style="position:absolute;left:14px;top:20px;bottom:56px;width:3px;background:{C["lav"]}"></span>{pts}</div>')
    v += carte(392, 40, 512, frise, pad='30px 32px 4px', rad=32)
    b += mise2(tete('Les rendez-vous,', 'annoncés avant les fêtes.',
                    'L’invitation part en décembre,<br>pas au retour des congés.', 84, C['encre'], C['lavt'], pre=num(2, C['lavf'])), v, 620)
    return b


# ---------- 6 · geste 3 : la première semaine programmée ----------
SEMAINE = [('Lun.', '4', 'Horaires de reprise', 'post'), ('Mar.', '5', 'Bonne année', 'post'), ('Mer.', '6', 'Rappel des vœux', 'story'),
           ('Jeu.', '7', 'Décembre en photos', 'actu'), ('Ven.', '8', 'L’agenda de janvier', 'site')]
FMT = {'post': 'Publication', 'story': 'Story', 'actu': 'Actualité', 'site': 'Page du site'}


def mini(k, w):
    """Petite maquette du format (carré, vertical, article, page)."""
    if k == 'post':
        return (f'<div style="width:{w}px;height:{w}px;border-radius:14px;background:{C["lavc"]};padding:10px;display:flex;flex-direction:column;justify-content:flex-end">'
                f'<span style="height:34px;border-radius:9px;background:{C["lavf"]}"></span></div>')
    if k == 'story':
        return (f'<div style="width:{round(w * .62)}px;height:{w}px;margin:0 auto;border-radius:14px;background:{C["lavf"]};padding:8px;display:flex;flex-direction:column;justify-content:flex-end;gap:6px">'
                f'<span style="height:8px;border-radius:4px;background:{C["lavc"]}"></span><span style="height:8px;width:70%;border-radius:4px;background:{C["lavc"]}"></span></div>')
    if k == 'actu':
        return (f'<div style="width:{w}px;height:{w}px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 2px {C["lavc"]};padding:10px;display:flex;flex-direction:column;gap:7px">'
                f'<span style="height:{round(w * .42)}px;border-radius:9px;background:{C["lav"]}"></span>'
                + ''.join(f'<span style="height:8px;width:{p}%;border-radius:4px;background:{C["lavc"]}"></span>' for p in (100, 86, 60)) + '</div>')
    return (f'<div style="width:{w}px;height:{w}px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 2px {C["lavc"]};overflow:hidden">'
            f'<div style="height:22px;background:{C["lavc"]};display:flex;align-items:center;gap:5px;padding:0 8px">'
            + ''.join(f'<span style="width:7px;height:7px;border-radius:50%;background:{C["lav"]}"></span>' for _ in range(3)) + '</div>'
            f'<div style="padding:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px">'
            + ''.join(f'<span style="height:{round(w * .2)}px;border-radius:6px;background:{C["lavc"] if i % 2 else C["lav"]}"></span>' for i in range(6)) + '</div></div>')


def p6():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(5, 'lav')
    gap = 12
    cw = (904 - 4 * gap) // 5
    v = ''
    for i, (j, n, t, k) in enumerate(SEMAINE):
        x = i * (cw + gap)
        v += (f'<div style="position:absolute;left:{x}px;top:0;width:{cw}px;height:520px;border-radius:28px;background:#fff;box-shadow:{OMBRE};padding:20px 16px;'
              f'display:flex;flex-direction:column;align-items:center;text-align:center">'
              f'<span style="font-weight:700;font-size:19px;color:{GRIS}">{j}</span>'
              f'<span class="D" style="font-weight:780;font-size:56px;line-height:1;letter-spacing:-.03em;color:{C["lavt"]}">{n}</span>'
              f'<div style="margin:22px 0 18px;width:100%">{mini(k, cw - 32)}</div>'
              f'<div style="font-weight:700;font-size:21px;line-height:1.2;min-height:52px">{t}</div>'
              f'<div style="margin-top:auto">{pill(FMT[k], C["lavc"], C["lavt"], 36, 16)}</div></div>')
    v += (f'<div style="position:absolute;left:0;top:546px;display:flex;align-items:center;gap:14px">'
          f'{pill("Semaine du 4 janvier : tout est prêt", C["encre"], C["sable"], 58, 23, icon=check(C["lav"], 24))}</div>')
    b += mise2(tete('La première semaine,', 'déjà programmée.',
                    'Une chose par jour suffit :<br>le fil reprend sans effort le premier lundi.', 88, C['encre'], C['encre'], C['encre'], pre=num(3)), v, 604)
    return b


# ---------- 7 · geste 4 : le dossier « Janvier » ----------
def feuille(x, y, w, h, rot, inner, bg='#fff'):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:20px;background:{bg};padding:20px;'
            f'box-shadow:0 18px 36px -22px rgba(26,26,26,.45);transform:rotate({rot}deg)">{inner}</div>')


def p7():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(6, 'lavc')
    v = (f'<div style="position:absolute;left:0;top:70px;width:904px;height:470px;border-radius:36px;background:{C["lav"]}"></div>'
         f'<div style="position:absolute;left:0;top:30px;width:300px;height:80px;border-radius:30px 30px 0 0;background:{C["lav"]};'
         f'display:flex;align-items:flex-start;padding:20px 30px;font-weight:750;font-size:24px">Dossier « Janvier »</div>')

    def titre_f(icn, t, s):
        return (f'<div style="display:flex;align-items:center;gap:8px">{ico(icn, 22, C["lavt"])}<b style="font-size:21px">{t}</b></div>'
                f'<div style="margin-top:2px;font-weight:600;font-size:16px;color:{GRIS}">{s}</div>')
    photos = (titre_f('cam', 'Photos', 'de décembre') + f'<div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px">'
              + ''.join(f'<span style="height:44px;border-radius:8px;background:{c}"></span>' for c in (C['lav'], C['lavc'], C['lavf'], C['lavc'], C['lavf'], C['lav'])) + '</div>')
    dates = (titre_f('clock', 'Dates', 'confirmées') + f'<div style="margin-top:12px;display:grid;grid-template-columns:repeat(5,1fr);gap:5px">'
             + ''.join(f'<span style="height:24px;border-radius:6px;background:{C["lavf"] if i in (2, 8, 11) else C["lavc"]}"></span>' for i in range(15)) + '</div>')
    textes = (titre_f('mail', 'Textes', 'de l’an dernier') + f'<div style="margin-top:14px;display:flex;flex-direction:column;gap:9px">'
              + ''.join(f'<span style="height:9px;width:{p}%;border-radius:5px;background:{C["lavc"]}"></span>' for p in (100, 90, 96, 70, 84)) + '</div>')
    horaires = (titre_f('pin', 'Horaires', 'de janvier') + f'<div style="margin-top:12px;font-weight:650;font-size:17px;line-height:1.5">Lun. au ven.<br>Samedi matin</div>'
                f'<div style="margin-top:8px">{pill("Validés", C["lavf"], C["sable"], 32, 15, icon=check(C["sable"], 15))}</div>')
    for k, (x, rot, inner) in enumerate([(26, -4, photos), (243, 2, dates), (460, -2, textes), (677, 4, horaires)]):
        v += (f'<div style="position:absolute;left:{x}px;top:{120 if k % 2 else 134}px;width:201px;height:236px;border-radius:20px;background:#fff;padding:20px 18px;'
              f'box-shadow:0 18px 36px -22px rgba(26,26,26,.45);transform:rotate({rot}deg)">{inner}</div>')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:14px">'
                   f'<span style="flex:none;width:34px;height:34px;border-radius:10px;background:{C["sable"]};display:grid;place-items:center">{check(C["lavf"], 20)}</span>'
                   f'<b style="font-size:23px;color:{C["sable"]}">{t}</b></div>' for t in ('Photos triées et nommées', 'Dates des partenaires', 'Textes à reprendre', 'Horaires validés'))
    v += (f'<div style="position:absolute;left:0;top:320px;width:904px;height:220px;border-radius:36px;background:{C["lavf"]};box-shadow:0 -10px 30px -18px rgba(26,26,26,.4);'
          f'padding:0 46px;display:grid;grid-template-columns:1fr 1fr;gap:26px 30px;align-content:center">{rows}</div>')
    b += mise2(tete('Les éléments,', 'rassemblés avant de partir.',
                    'En janvier, plus rien à chercher :<br>tout est dans un seul dossier.', 84, C['encre'], C['lavt'], pre=num(4, C['lavf'])), v, 540)
    return b


# ---------- 8 · avec Fill (validée, reprise telle quelle) ----------
LIG = [('Publication de reprise', '1'), ('Horaires du site mis à jour', '1'), ('Vœux : invitation et agenda', '2'), ('Publication « Bonne année »', '1')]


def p8():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(7, 'lavf')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:88px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:36px;height:36px;border-radius:10px;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 20)}</span>'
                   f'<b style="flex:1;font-size:25px">{t}</b><span style="font-weight:700;font-size:22px;color:{C["lavt"]}">{u}{NB}u.</span></div>' for t, u in LIG)
    tot = (f'<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-radius:20px;background:{C["lavc"]}">'
           f'<b style="font-size:23px">Avec Essentiel (15 unités par mois)</b><span class="D" style="font-weight:760;font-size:32px;color:{C["lavt"]}">5 unités</span></div>')
    inner = (f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px">{ent("Déposé le 15 décembre")}'
             f'{pill("Programmé", C["lavf"], C["sable"], 44, 19)}</div>{rows}{tot}')
    v = carte(0, 0, 904, inner, pad='30px 38px 32px', rad=40)
    b += mise2(tete('Avec Fill,', 'vous déposez, nous préparons.',
                    'Les demandes se déposent toute l’année,<br>sans période de fermeture.', 84, C['sable'], C['lavc'], 'rgba(248,245,242,.88)'), v, 520)
    return b


def p9():
    return fin(N, 8, MOTIF['lavf'], 'Janvier commence<br>en décembre.', 'On peut le préparer avec vous.', C['lavc'])


PAGES = [(p1, C['lavc']), (p2, C['lav']), (p3, C['lavc']), (p4, C['lav']), (p5, C['lavc']), (p6, C['lav']), (p7, C['lavc']), (p8, C['lavf']), (p9, C['lavf'])]

TEXTE = """Fin décembre, les bureaux ferment ou tournent au ralenti. Début janvier, tout repart d'un coup : horaires de reprise, vœux, recensement dans les communes concernées, soldes d'hiver dès le 6 janvier pour les commerces, premiers rendez-vous.

Quatre gestes à faire avant de partir :
1. Écrire la publication de reprise et mettre à jour les horaires du site.
2. Annoncer dès décembre les rendez-vous de janvier qui demandent une réponse.
3. Programmer la première semaine, une chose par jour.
4. Rassembler photos, dates confirmées et textes de l'an dernier dans un seul dossier.

Avec Fill, vous déposez vos demandes en décembre, nous préparons et programmons. Les demandes se déposent toute l'année.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #entreprises #communicationpublique #organisation"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'gj-{i + 1:02d}', bg, f(), end=1)
    print('ok')
