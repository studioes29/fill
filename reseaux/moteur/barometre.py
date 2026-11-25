"""Constat · « Votre site s'est arrêté ? » (jeudi 7 janvier 2027, 11 h).
Version 3 (retours d'Ewen du 25 nov.) : couverture compréhensible tout de suite et sans date de relevé ;
le post parle aux collectivités ET aux entreprises dès la couverture ; la page de contexte devient la page du site
(un vrai « faux » site, arrêté à l'été) ; les chiffres en grille de 100 cases ; la cause montrée côte à côte
(mairie et entreprise) ; titre et description avant le visuel. 7 pages fixes, famille corail, couverture corail clair.
Données Fill : relevé des sites de 1 518 communes de 14 départements de l'Ouest (1 093 avec une date lisible :
70 % ont publié dans le mois, 17 % rien depuis plus de trois mois, dont 12 % rien depuis plus de six mois).
Rendu : python3 barometre.py ; render.py bm-01..07."""
import sys
sys.path.insert(0, '/home/claude/fill/reseaux/canevas')
from lgen import C, MOTIF, NB, logo, motif, head, check, page
from guide2 import ico
from v2 import pill, rond_fleche, fin, M, cadre, carte, OMBRE, HD, tete, mise2

N = 7
GR = 'rgba(26,26,26,.55)'
NOM = 'Votre structure'


def hd(i, fond):
    if fond == 'corf':
        return head(N, i, logo(44, C['sable'], C['corc'], C['cor']), C['corc'], 'rgba(248,245,242,.24)')
    if fond == 'cor':
        return head(N, i, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    return head(N, i, logo(44, C['encre'], C['lav'], C['cor']), C['cor'], 'rgba(26,26,26,.14)')


def cap(t, col=GR, fs=18):
    return f'<div style="font-weight:700;font-size:{fs}px;letter-spacing:.08em;text-transform:uppercase;color:{col}">{t}</div>'


def note(t, bg=None, fg=None):
    """Annotation collée à l'élément qu'elle désigne."""
    return pill(t, bg or C['encre'], fg or C['sable'], 44, 19, icon=ico('clock', 19, fg or C['sable']))


def navigateur(corps, titre='Accueil'):
    barre = (f'<div style="display:flex;align-items:center;gap:8px;padding:16px 20px;background:rgba(26,26,26,.04)">'
             + ''.join(f'<span style="width:13px;height:13px;border-radius:50%;background:rgba(26,26,26,.16)"></span>' for _ in range(3))
             + f'<span style="margin-left:10px;flex:1;height:34px;border-radius:17px;background:#fff;display:flex;align-items:center;padding:0 16px;font-weight:600;font-size:16px;color:{GR}">'
             f'votre-structure.fr · {titre}</span></div>')
    nav = (f'<div style="display:flex;align-items:center;gap:14px;padding:16px 24px;border-bottom:2px solid rgba(26,26,26,.06)">'
           f'<span style="width:40px;height:40px;border-radius:12px;background:{C["corf"]};color:{C["sable"]};display:grid;place-items:center;font-weight:800;font-size:16px">VS</span>'
           f'<b style="font-size:20px">{NOM}</b><span style="margin-left:auto;display:flex;gap:22px;font-weight:600;font-size:17px;color:{GR}">'
           f'<span>Actualités</span><span>Agenda</span><span>Contact</span></span></div>')
    return f'<div style="border-radius:30px;overflow:hidden;background:#fff;box-shadow:{OMBRE}">{barre}{nav}{corps}</div>'


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Collectivités et entreprises", C["encre"], C["sable"], 56, 23)}</div>'
    b += cadre('bm-tel', M, 196, 470, 660, '40% 30%', 40)
    corps = (f'<div style="height:150px;background:{C["cor"]};padding:26px 26px;display:flex;flex-direction:column;justify-content:center">'
             f'<div class="D" style="font-weight:760;font-size:36px;letter-spacing:-.03em;line-height:1">Horaires d’été</div>'
             f'<div style="margin-top:6px;font-weight:650;font-size:19px">Ouvert tous les jours, de 9{NB}h à 19{NB}h</div></div>'
             f'<div style="padding:18px 22px 22px">{cap("Dernières actualités", C["cort"], 15)}'
             + ''.join(f'<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 0;border-top:2px solid rgba(26,26,26,.06)">'
                       f'<b style="font-size:18px">{t}</b><span style="flex:none;font-weight:600;font-size:16px;color:{GR}">{d}</span></div>'
                       for t, d in (('Horaires d’été', 'juin'), ('Fête de la musique', 'juin'), ('Fermeture du 15 août', 'août')))
             + '</div>')
    site = navigateur(corps)
    b += f'<div style="position:absolute;left:430px;top:300px;width:562px;transform:rotate(2deg)">{site}</div>'
    b += f'<div style="position:absolute;left:470px;top:250px;transform:rotate(2deg)">{note("Dernière actualité : il y a 4 mois", C["corf"])}</div>'
    b += (f'<div style="position:absolute;left:{M}px;right:220px;top:910px">'
          f'<div class="D" style="font-weight:700;font-size:96px;line-height:.93;letter-spacing:-.05em">Votre site s’est arrêté ?</div>'
          f'<div class="I" style="font-size:72px;line-height:1.05;letter-spacing:-.02em;color:{C["cort"]};margin-top:8px">Vos visiteurs le voient.</div></div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · ce que voit le visiteur : un vrai faux site ----------
def p2():
    b = motif(MOTIF['corc'], 2300, 120, -420) + hd(1, 'corc')
    hero = (f'<div style="position:relative;height:230px;overflow:hidden"><img src="{HD}bm-ete.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 62%">'
            f'<div style="position:absolute;left:24px;bottom:22px;padding:16px 22px;border-radius:18px;background:#fff">'
            f'<div class="D" style="font-weight:740;font-size:30px;letter-spacing:-.02em;line-height:1">Horaires d’été</div>'
            f'<div style="margin-top:4px;font-weight:600;font-size:18px;color:{GR}">Ouvert tous les jours, de 9{NB}h à 19{NB}h</div></div></div>')
    actus = ''.join(f'<div style="flex:1;border-radius:18px;background:rgba(26,26,26,.035);padding:16px 18px">'
                    f'<div style="height:64px;border-radius:12px;background:{c}"></div>'
                    f'<div style="margin-top:10px;font-weight:700;font-size:19px;line-height:1.2">{t}</div>'
                    f'<div style="margin-top:4px;font-weight:600;font-size:16px;color:{GR}">{d}</div></div>'
                    for t, d, c in (('Fermeture du 15 août', 'Publié en août', C['corc']), ('Fête de la musique', 'Publié en juin', C['cor']), ('Horaires d’été', 'Publié en juin', C['corc'])))
    corps = (hero + f'<div style="padding:22px 24px 24px">{cap("Dernières actualités", C["cort"], 16)}'
             f'<div style="margin-top:12px;display:flex;gap:12px">{actus}</div>'
             f'<div style="margin-top:14px;display:flex;align-items:center;gap:12px;padding:16px 20px;border-radius:18px;background:{C["corc"]}">'
             f'{ico("clock", 22, C["cort"])}<b style="font-size:20px;color:{C["cort"]}">Agenda : aucun événement à venir</b></div></div>')
    v = f'<div style="position:absolute;left:0;top:0;width:904px">{navigateur(corps, "Accueil")}</div>'
    v += f'<div style="position:absolute;right:26px;top:150px">{note("La bannière de l’été, en janvier", C["corf"])}</div>'
    v += f'<div style="position:absolute;right:26px;top:376px">{note("Dernière actualité : août")}</div>'
    b += mise2(tete('Un site arrêté,', 'ça se voit tout de suite.',
                    'Avant de venir, on vérifie en ligne. Quand l’actualité<br>date de l’été, le visiteur doute de tout le reste.', 84, C['encre'], C['cort']), v, 690)
    return b


# ---------- 3 · les chiffres des communes ----------
def p3():
    b = motif(MOTIF['cor'], 2300, 120, -420) + hd(2, 'cor')
    # 100 cases : 70 dans le mois, 13 de un à trois mois, 5 de trois à six mois, 12 plus de six mois
    cols = ['#fff'] * 70 + [C['corc']] * 13 + [C['cor']] * 5 + [C['cort']] * 12
    grille = (f'<div style="display:grid;grid-template-columns:repeat(10,1fr);gap:8px;width:440px">'
              + ''.join(f'<span style="aspect-ratio:1;border-radius:8px;background:{c};{"box-shadow:inset 0 0 0 2px rgba(26,26,26,.08)" if c == "#fff" else ""}"></span>' for c in cols) + '</div>')
    leg = [('70' + NB + '%', 'ont publié<br>dans le mois', '#fff', True), ('17' + NB + '%', 'rien publié depuis<br>plus de trois mois', C['cort'], False),
           ('12' + NB + '%', 'dont rien depuis<br>plus de six mois', C['cort'], False)]
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;padding:20px 0;{"border-top:2px solid rgba(26,26,26,.07)" if i else ""}">'
                   f'<span class="D" style="flex:none;width:118px;font-weight:760;font-size:46px;letter-spacing:-.035em;color:{C["encre"] if w else C["cort"]}">{p}</span>'
                   f'<span style="font-weight:650;font-size:21px;line-height:1.25">{t}</span></div>' for i, (p, t, c, w) in enumerate(leg))
    inner = (f'<div style="display:flex;gap:40px;align-items:center">{grille}<div style="flex:1">{rows}</div></div>'
             f'<div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:10px">'
             + ''.join(f'<span style="display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:17px;color:{GR}">'
                       f'<span style="width:18px;height:18px;border-radius:5px;background:{c};{"box-shadow:inset 0 0 0 2px rgba(26,26,26,.1)" if c == "#fff" else ""}"></span>{t}</span>'
                       for c, t in (('#fff', 'Dans le mois'), (C['corc'], 'Un à trois mois'), (C['cor'], 'Trois à six mois'), (C['cort'], 'Plus de six mois'))) + '</div>')
    v = carte(0, 0, 904, inner, pad='34px 40px 30px', rad=40)
    b += mise2(tete('Dans les communes,', 'un site sur six s’est arrêté.',
                    'Nous avons lu les sites de 1' + NB + '518 communes de l’Ouest.<br>Sur les 1' + NB + '093 où la date se lit, voici la dernière publication.',
                    82, C['encre'], C['encre'], C['encre']), v, 600)
    return b


# ---------- 4 · pourquoi : mairie et entreprise, côte à côte ----------
def p4():
    b = motif(MOTIF['corc'], 2300, 120, -420) + hd(3, 'corc')
    w = (904 - 24) // 2

    def cas(k, pos, t, s, bg, fg):
        return (f'<div style="width:{w}px;border-radius:34px;overflow:hidden;background:{bg};box-shadow:{OMBRE}">'
                f'<div style="position:relative;height:460px;overflow:hidden"><img src="{HD}{k}.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{pos}"></div>'
                f'<div style="padding:24px 28px 28px"><div class="D" style="font-weight:740;font-size:34px;letter-spacing:-.025em;color:{fg}">{t}</div>'
                f'<div style="margin-top:8px;font-weight:600;font-size:21px;line-height:1.35;color:{fg};opacity:.85">{s}</div></div></div>')
    v = (f'<div style="position:absolute;left:0;top:0;display:flex;gap:24px">'
         + cas('bm-bureau', '62% center', 'En mairie', 'Entre l’accueil, l’état civil<br>et les dossiers des élus.', '#fff', C['encre'])
         + cas('artisane-bureau', '58% 35%', 'En entreprise', 'Entre deux clients,<br>deux commandes, deux devis.', C['corf'], C['sable'])
         + '</div>')
    b += mise2(tete('Personne n’a décidé', 'd’arrêter.',
                    'Le métier passe d’abord, et c’est normal.<br>La com attend un moment libre qui ne vient pas.', 84, C['encre'], C['cort']), v, 630)
    return b


# ---------- 5 · ce que l'abonnement règle ----------
REGLE = [('On publie<br>quand on a le temps', 'Une publication chaque semaine'),
         ('La bannière de l’été<br>reste en ligne', 'Le site suit les saisons et l’agenda'),
         ('Rien pendant<br>les congés', 'La com continue en votre absence'),
         ('Chaque info cherche<br>qui s’en charge', 'Vous envoyez l’info, nous la publions')]


def p5():
    b = motif(MOTIF['cor'], 2300, 120, -420) + hd(4, 'cor')
    cw, cw2 = 300, 904 - 88 - 24 - 300
    hdr = (f'<div style="display:flex;gap:24px;padding-bottom:16px">'
           f'<div style="width:{cw}px">{pill("Aujourd’hui", "rgba(26,26,26,.06)", "rgba(26,26,26,.6)", 46, 21)}</div>'
           f'<div style="width:{cw2}px">{pill("Avec Fill", C["encre"], C["sable"], 46, 21, icon=check(C["cor"], 22))}</div></div>')
    rows = ''
    for a, c in REGLE:
        rows += (f'<div style="display:flex;align-items:center;gap:24px;min-height:120px;border-top:2px solid rgba(26,26,26,.07)">'
                 f'<div style="width:{cw}px;font-weight:550;font-size:25px;line-height:1.25;color:rgba(26,26,26,.5)">{a}</div>'
                 f'<div style="width:{cw2}px;display:flex;align-items:center;gap:14px"><span style="flex:none;width:12px;height:12px;border-radius:50%;background:{C["corf"]}"></span>'
                 f'<span style="font-weight:700;font-size:27px;line-height:1.2">{c}</span></div></div>')
    v = carte(0, 0, 904, hdr + rows, pad='30px 44px 18px', rad=40)
    b += mise2(tete('Un rythme tenu,', 'sans y penser.',
                    'Fill est un service de com par abonnement,<br>pour les collectivités comme pour les entreprises.', 88, C['encre'], C['encre'], C['encre']), v, 640)
    return b


# ---------- 6 · les formules ----------
FORM = [('Essentiel', '15', '490'), ('Régulier', '35', '990'), ('Soutenu', '75', '1 890')]


def p6():
    b = motif(MOTIF['corc'], 2300, 120, -420) + hd(5, 'corc')
    v = ''
    w = (904 - 2 * 16) // 3
    for i, (n, u, m) in enumerate(FORM):
        x = i * (w + 16)
        v += (f'<div style="position:absolute;left:{x}px;top:0;width:{w}px;height:400px;border-radius:34px;background:{C["corf"] if i == 1 else "#fff"};box-shadow:{OMBRE};padding:32px 28px;'
              f'display:flex;flex-direction:column;color:{C["sable"] if i == 1 else C["encre"]}">'
              f'<span class="D" style="font-weight:720;font-size:38px;letter-spacing:-.02em">{n}</span>'
              f'<span style="margin-top:6px;font-weight:600;font-size:21px;opacity:.75">{u}{NB}unités par mois</span>'
              f'<span style="margin-top:auto;font-weight:600;font-size:20px;opacity:.75">Par mois</span>'
              f'<span class="D" style="font-weight:740;font-size:64px;letter-spacing:-.035em;line-height:1.05">{m.replace(" ", NB)}{NB}€</span></div>')
    v += (f'<div style="position:absolute;left:0;right:0;top:430px;display:flex;gap:12px">'
          + pill('Premier mois sans engagement', C['encre'], C['sable'], 58, 22, icon=check(C['cor'], 24))
          + pill('Prix fixes', '#fff', C['encre'], 58, 22, icon=check(C['corf'], 24)) + '</div>')
    v += f'<div style="position:absolute;left:0;top:516px;font-weight:550;font-size:20px;color:{GR}">TVA non applicable, art. 293 B du CGI.</div>'
    b += mise2(tete('Trois formules,', 'selon votre rythme.',
                    'Une publication compte une unité.<br>Le volume suit votre besoin, pas l’inverse.', 88, C['encre'], C['cort']), v, 550)
    return b


def p7():
    return fin(N, 6, '#C3604D', 'Reprenons le fil<br>de vos actualités.', 'Premier mois sans engagement.', C['corc'])


PAGES = [(p1, C['corc']), (p2, C['corc']), (p3, C['cor']), (p4, C['corc']), (p5, C['cor']), (p6, C['corc']), (p7, C['corf'])]

TITRE = 'Votre site s’est arrêté ? Vos visiteurs le voient'
TEXTE = """Avant de venir, on vérifie en ligne : un horaire, une démarche, une nouvelle. Quand la dernière actualité date de l'été, le visiteur doute de tout le reste.

Nous avons lu les sites de 1 518 communes de l'Ouest. Sur les 1 093 où la date est lisible, 17 % n'ont rien publié depuis plus de trois mois, et 12 % depuis plus de six mois. Beaucoup d'entreprises connaissent le même silence sur leur site ou leur page.

Ce n'est presque jamais un choix : le métier passe d'abord, et la com attend un moment libre qui ne vient pas.

Avec Fill, vous envoyez l'information, nous la publions, chaque semaine, pour un prix fixe. Premier mois sans engagement.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#CommunicationPublique #Communes #SiteInternet #TPE #Entreprises"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'bm-{i + 1:02d}', bg, f(), end=1)
    print('ok')
