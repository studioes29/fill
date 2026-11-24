"""Constat · « 17 % des sites de communes muets depuis trois mois » (jeudi 7 janvier 2027, 11 h).
Version 2 (correction du 24 nov.) : déplacé du 26 nov. au 7 janv., couverture photo (calendrier 1958), entreprises incluses,
le constat se termine par la solution (sans / avec, formules). 9 pages fixes, famille corail.
Données Fill : relevé automatique du 13 au 24 novembre 2026, sites de 1 518 communes de 14 départements de l'Ouest.
Rendu : python3 barometre.py ; render.py bm-01..09."""
import sys
sys.path.insert(0, '/home/claude/fill/reseaux/canevas')
from lgen import C, MOTIF, NB, logo, motif, head, check, page
from guide2 import ico
from v2 import pill, rond_fleche, fin, M, tflow, pied, mise, cadre, carte, OMBRE

N = 9
GR = 'rgba(26,26,26,.55)'


def lg(dark=False):
    return logo(44, C['sable'], C['corc'], C['cor']) if dark else logo(44, C['encre'], C['lav'], C['cor'])


def cap(t, col=GR, fs=19):
    return f'<div style="font-weight:700;font-size:{fs}px;letter-spacing:.08em;text-transform:uppercase;color:{col}">{t}</div>'


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += cadre('panneau-1958', 560, 196, 432, 640, 'center 30%', 40)
    b += (f'<div style="position:absolute;left:{M}px;width:450px;top:236px">'
          f'{pill("Relevé de novembre 2026", C["encre"], C["sable"], 54, 22, icon=ico("clock", 22, C["sable"]))}'
          f'<div class="D" style="margin-top:44px;font-weight:780;font-size:200px;line-height:.86;letter-spacing:-.07em;color:{C["cort"]}">17{NB}%</div>'
          f'<div class="I" style="margin-top:26px;font-size:52px;line-height:1.08;letter-spacing:-.02em;color:{C["cort"]}">des sites<br>de communes</div></div>')
    b += (f'<div style="position:absolute;left:{M}px;right:250px;top:900px">'
          f'<div class="D" style="font-weight:690;font-size:92px;line-height:.95;letter-spacing:-.045em">Rien de neuf</div>'
          f'<div class="I" style="font-size:72px;line-height:1.05;letter-spacing:-.02em;color:{C["cort"]};margin-top:6px">depuis plus<br>de trois mois.</div></div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : le site, première porte ----------
CHERCHE = [('Un horaire', 'L’accueil est-il ouvert samedi ?'), ('Une démarche', 'Comment inscrire mon enfant ?'),
           ('Une nouvelle', 'La rue est-elle fermée lundi ?')]


def p2():
    b = motif('rgba(255,255,255,.05)', 2300, 120, -420)
    b += head(N, 1, lg(True), C['corc'], 'rgba(248,245,242,.24)')
    rows = ''.join(f'<div style="padding:16px 0;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<div style="font-weight:700;font-size:26px">{a}</div><div style="margin-top:4px;font-weight:550;font-size:21px;color:{GR}">{s}</div></div>'
                   for a, s in CHERCHE)
    v = cadre('main-tel-beige', 0, 0, 420, 600, '30% center', 36)
    v += carte(444, 40, 460, cap('Avant de venir, on vérifie', C['cort'], 18) + f'<div style="margin-top:10px">{rows}</div>', pad='26px 30px 14px', rad=32)
    b += mise(tflow('Avant de se déplacer,', 'on regarde en ligne.', 86, C['sable'], C['corc']), v, 600,
              pied('Mairie, commerce ou cabinet : la date<br>de la dernière actualité dit si quelqu’un suit.', C['sable']))
    return b


# ---------- 3 · le relevé ----------
DEP = ['Calvados', 'Charente-Maritime', 'Côtes-d’Armor', 'Deux-Sèvres', 'Finistère', 'Ille-et-Vilaine', 'Loire-Atlantique',
       'Maine-et-Loire', 'Manche', 'Mayenne', 'Morbihan', 'Orne', 'Sarthe', 'Vendée']


def p3():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 2, lg(), C['cor'], 'rgba(26,26,26,.14)')
    chips = ''.join(pill(d, C['corc'], C['cort'], 46, 21) for d in DEP)
    stats = ''.join(
        f'<div style="flex:1;padding:24px 26px;border-radius:26px;background:{bg}">'
        f'<div class="D" style="font-weight:740;font-size:56px;letter-spacing:-.035em;line-height:1;color:{fg}">{c}</div>'
        f'<div style="margin-top:8px;font-weight:600;font-size:22px;line-height:1.3;color:{fg};opacity:.85">{t}</div></div>'
        for c, t, bg, fg in [('1' + NB + '518', 'sites de communes lus', C['encre'], C['sable']),
                             ('1' + NB + '093', 'avec une date lisible', C['corf'], C['sable'])])
    inner = (f'<div style="display:flex;align-items:center;justify-content:space-between">{cap("14 départements de l’Ouest")}'
             f'{pill("Du 13 au 24 nov. 2026", "rgba(26,26,26,.06)", C["encre"], 44, 20, icon=ico("clock", 20, C["encre"]))}</div>'
             f'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px">{chips}</div>'
             f'<div style="display:flex;gap:14px;margin-top:26px">{stats}</div>')
    v = carte(0, 0, 904, inner, pad='30px 36px 32px', rad=40)
    b += mise(tflow('Nous avons lu', 'les sites de 1' + NB + '518 communes.', 84), v, 560,
              pied('Pour chaque site, une seule question :<br>de quand date la dernière publication visible ?'))
    return b


# ---------- 4 · les chiffres ----------
BARS = [(70, 'ont publié dans le dernier mois', C['cor'], C['encre']),
        (17, 'n’ont rien publié depuis plus de trois mois', C['corf'], C['sable']),
        (12, 'n’ont rien publié depuis plus de six mois', C['cort'], C['sable'])]


def p4():
    b = motif(MOTIF['cor'], 2300, 120, -420)
    b += head(N, 3, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    rows = ''
    for i, (p, t, bg, fg) in enumerate(BARS):
        bord = 'border-top:2px solid rgba(26,26,26,.07);' if i else ''
        rows += (f'<div style="{bord}padding:26px 0 24px">'
                 f'<div style="display:flex;align-items:baseline;gap:18px">'
                 f'<span class="D" style="flex:none;width:150px;font-weight:760;font-size:62px;letter-spacing:-.04em;line-height:1;color:{C["cort"] if i else C["encre"]}">{p}{NB}%</span>'
                 f'<span style="font-weight:650;font-size:27px;line-height:1.25">{t}</span></div>'
                 f'<div style="margin-top:18px;height:26px;border-radius:13px;background:rgba(26,26,26,.06);overflow:hidden">'
                 f'<div style="width:{p}%;height:100%;border-radius:13px;background:{bg}"></div></div></div>')
    inner = (cap(f'Sur les 1{NB}093 sites où la date est lisible') + f'<div style="margin-top:6px">{rows}</div>'
             f'<div style="margin-top:4px;padding:16px 20px;border-radius:20px;background:{C["corc"]};font-weight:600;font-size:21px;line-height:1.3;color:{C["cort"]}">'
             f'Les 12{NB}% sont compris dans les 17{NB}% (127 sites sur 189).</div>')
    v = carte(0, 0, 904, inner, pad='32px 40px 30px', rad=40)
    b += mise(tflow('La plupart publient.', 'Une partie s’est arrêtée.', 88, C['encre'], C['encre']), v, 700,
              pied('189 sites n’ont rien publié depuis plus de trois mois.<br>Derrière chacun, des habitants qui cherchent une info.', C['encre']))
    return b


# ---------- 5 · ce que voit le visiteur ----------
VIEUX = [('Horaires d’été de l’accueil', 'Publié en juin'), ('Programme de la fête du village', 'Publié en juillet'),
         ('Rentrée scolaire : les inscriptions', 'Publié en août')]


def p5():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 4, lg(), C['cor'], 'rgba(26,26,26,.14)')
    bar = (f'<div style="display:flex;align-items:center;gap:8px;padding-bottom:20px">'
           + ''.join(f'<span style="width:13px;height:13px;border-radius:50%;background:rgba(26,26,26,.15)"></span>' for _ in range(3))
           + f'<span style="margin-left:10px;flex:1;height:38px;border-radius:19px;background:rgba(26,26,26,.05);display:flex;align-items:center;padding:0 18px;font-weight:600;font-size:18px;color:{GR}">Votre collectivité · Actualités</span></div>')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:20px;padding:18px 0;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:92px;height:70px;border-radius:14px;background:{C["corc"]}"></span>'
                   f'<div style="flex:1"><div style="font-weight:700;font-size:26px">{t}</div><div style="margin-top:4px;font-weight:550;font-size:20px;color:{GR}">{d}</div></div></div>'
                   for t, d in VIEUX)
    agenda = (f'<div style="margin-top:12px;display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-radius:22px;background:{C["corc"]}">'
              f'<span style="font-weight:700;font-size:23px;color:{C["cort"]}">Agenda : aucun événement à venir</span>'
              f'{pill("Mis à jour il y a 4 mois", C["corf"], C["sable"], 42, 18)}</div>')
    v = carte(0, 0, 904, bar + cap('Dernières actualités', C['cort'], 18) + f'<div style="margin-top:8px">{rows}</div>' + agenda, pad='26px 34px 30px', rad=40)
    b += mise(tflow('Un site arrêté,', 'ça se voit tout de suite.', 86), v, 660,
              pied('Le visiteur doute de tout le reste :<br>il appelle l’accueil, ou il ne vient pas.'))
    return b


# ---------- 6 · côté entreprises ----------
def p6():
    b = motif(MOTIF['cor'], 2300, 120, -420)
    b += head(N, 5, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    tiles = ''.join(f'<span style="aspect-ratio:1;border-radius:12px;background:{c}"></span>' for c in [C['corc'], C['cor'], C['corc']])
    insta = (f'<div style="display:flex;align-items:center;gap:14px">'
             f'<span style="flex:none;width:58px;height:58px;border-radius:50%;background:{C["corc"]};display:grid;place-items:center;font-weight:750;font-size:21px;color:{C["cort"]}">VE</span>'
             f'<div><div style="font-weight:700;font-size:24px">Votre entreprise</div><div style="font-weight:550;font-size:19px;color:{GR}">Page professionnelle</div></div></div>'
             f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px">{tiles}</div>'
             f'<div style="margin-top:16px">{pill("Dernière publication : en mai", C["corf"], C["sable"], 44, 19, icon=ico("clock", 19, C["sable"]))}</div>')
    v = cadre('artisane-bureau', 0, 0, 500, 640, '58% center', 36)
    v += carte(452, 150, 452, insta, pad='26px 28px 28px', rad=32)
    b += mise(tflow('Côté entreprises,', 'le même silence.', 90, C['encre'], C['encre']), v, 640,
              pied('Le métier passe d’abord, et c’est normal.<br>La com attend un moment libre qui ne vient pas.', C['encre']))
    return b


# ---------- 7 · ce que l'abonnement règle ----------
REGLE = [('On publie<br>quand on a le temps', 'Une publication chaque semaine'),
         ('Les horaires d’été<br>restent en ligne', 'Le site suit les saisons et l’agenda'),
         ('Rien pendant<br>les congés', 'La com continue en votre absence'),
         ('Chaque info cherche<br>qui s’en charge', 'Vous envoyez l’info, nous la publions')]


def p7():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 6, lg(), C['cor'], 'rgba(26,26,26,.14)')
    cw, cw2 = 300, 904 - 88 - 24 - 300
    hdr = (f'<div style="display:flex;gap:24px;padding-bottom:16px">'
           f'<div style="width:{cw}px">{pill("Aujourd’hui", "rgba(26,26,26,.06)", "rgba(26,26,26,.6)", 46, 21)}</div>'
           f'<div style="width:{cw2}px">{pill("Avec Fill", C["encre"], C["sable"], 46, 21, icon=check(C["cor"], 22))}</div></div>')
    rows = ''
    for a, c in REGLE:
        rows += (f'<div style="display:flex;align-items:center;gap:24px;min-height:112px;border-top:2px solid rgba(26,26,26,.07)">'
                 f'<div style="width:{cw}px;font-weight:550;font-size:25px;line-height:1.25;color:rgba(26,26,26,.5)">{a}</div>'
                 f'<div style="width:{cw2}px;display:flex;align-items:center;gap:14px"><span style="flex:none;width:12px;height:12px;border-radius:50%;background:{C["corf"]}"></span>'
                 f'<span style="font-weight:700;font-size:27px;line-height:1.2">{c}</span></div></div>')
    v = carte(0, 0, 904, hdr + rows, pad='30px 44px 18px', rad=40)
    b += mise(tflow('Un rythme tenu,', 'sans y penser.', 90), v, 620,
              pied('Fill est un service de com par abonnement.<br>Pour les collectivités comme pour les entreprises.'))
    return b


# ---------- 8 · les formules ----------
FORM = [('Essentiel', '15', '490'), ('Régulier', '35', '990'), ('Soutenu', '75', '1 890')]


def p8():
    b = motif(MOTIF['cor'], 2300, 120, -420)
    b += head(N, 7, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    v = ''
    w = (904 - 2 * 16) // 3
    for i, (n, u, m) in enumerate(FORM):
        x = i * (w + 16)
        v += (f'<div style="position:absolute;left:{x}px;top:0;width:{w}px;height:270px;border-radius:34px;background:#fff;box-shadow:{OMBRE};padding:30px 28px;'
              f'display:flex;flex-direction:column">'
              f'<span class="D" style="font-weight:720;font-size:36px;letter-spacing:-.02em">{n}</span>'
              f'<span style="margin-top:4px;font-weight:550;font-size:21px;color:{GR}">{u}{NB}unités par mois</span>'
              f'<span style="margin-top:auto;font-weight:600;font-size:20px;color:{GR}">Par mois</span>'
              f'<span class="D" style="font-weight:740;font-size:56px;letter-spacing:-.035em;line-height:1.05">{m.replace(" ", NB)}{NB}€</span></div>')
    v += (f'<div style="position:absolute;left:0;right:0;top:302px;display:flex;gap:12px">'
          + pill('Premier mois sans engagement', C['encre'], C['sable'], 58, 22, icon=check(C['cor'], 24))
          + pill('Prix fixes', '#fff', C['encre'], 58, 22, icon=check(C['corf'], 24)) + '</div>')
    b += mise(tflow('Trois formules,', 'selon votre rythme.', 90, C['encre'], C['encre']), v, 360,
              pied('Une publication compte une unité.<br>TVA non applicable, art. 293 B du CGI.', C['encre'], 28))
    return b


def p9():
    return fin(N, 8, '#C3604D', 'Reprenons le fil<br>de vos actualités.', 'Premier mois sans engagement.', C['corc'])


PAGES = [(p1, C['corc']), (p2, C['corf']), (p3, C['corc']), (p4, C['cor']), (p5, C['corc']), (p6, C['cor']),
         (p7, C['corc']), (p8, C['cor']), (p9, C['corf'])]

TEXTE = """17 % des sites de communes n'ont rien publié depuis plus de trois mois.

En novembre, nous avons relevé la date de la dernière publication sur les sites de 1 518 communes de 14 départements de l'Ouest. Sur les 1 093 sites où elle est lisible, 70 % ont publié dans le mois, 17 % rien depuis plus de trois mois, 12 % rien depuis plus de six mois.

Le plus souvent, ce n'est pas un choix : le temps manque et personne ne prend le relais. Beaucoup d'entreprises connaissent le même silence.

Pour le visiteur, une page arrêtée rend toute l'information douteuse.

Avec Fill, vous envoyez l'information, nous la publions, chaque semaine, pour un prix fixe.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#CommunicationPublique #Communes #SiteInternet #TPE #Barometre"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'bm-{i + 1:02d}', bg, f(), end=1)
    print('ok')
