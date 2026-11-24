"""Constat · « Baromètre : 17 % des sites muets depuis 3 mois » (jeudi 26 novembre 2026, 11 h, Congrès des maires).
Données Fill (relevé automatique du 13 au 24 novembre 2026, 14 départements de l'Ouest). 5 pages fixes, famille corail.
Rendu : python3 barometre.py ; render.py bm-01..05."""
import sys
sys.path.insert(0, '/home/claude/fill/reseaux/canevas')
from lgen import C, MOTIF, NB, logo, motif, head, check, page
from guide2 import ico
from v2 import pill, rond_fleche, fin, M, tflow, pied, mise, cadre, carte, OMBRE, HD

N = 5


def lg(dark=False):
    return logo(44, C['sable'], C['corc'], C['cor']) if dark else logo(44, C['encre'], C['lav'], C['cor'])


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Premier relevé, novembre 2026", C["encre"], C["sable"], 58, 23)}</div>'
    b += cadre('calendrier-blanc', M, 196, 904, 520, 'center 50%', 40)
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:762px">'
          f'<div style="font-weight:700;font-size:23px;letter-spacing:.08em;text-transform:uppercase;color:{C["cort"]}">Baromètre de la communication des communes</div>'
          f'<div class="D" style="margin-top:22px;font-weight:700;font-size:96px;line-height:.94;letter-spacing:-.05em">17{NB}% des sites<br>de communes</div>'
          f'<div class="I" style="font-size:66px;line-height:1.06;letter-spacing:-.02em;color:{C["cort"]};margin-top:10px">n’ont rien publié depuis<br>plus de trois mois.</div></div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · le relevé ----------
DEP = [('14', 'Calvados'), ('17', 'Charente-Maritime'), ('22', 'Côtes-d’Armor'), ('29', 'Finistère'), ('35', 'Ille-et-Vilaine'),
       ('44', 'Loire-Atlantique'), ('49', 'Maine-et-Loire'), ('50', 'Manche'), ('53', 'Mayenne'), ('56', 'Morbihan'),
       ('61', 'Orne'), ('72', 'Sarthe'), ('79', 'Deux-Sèvres'), ('85', 'Vendée')]


def p2():
    b = motif('rgba(255,255,255,.05)', 2300, 120, -420)
    b += head(N, 1, lg(True), C['corc'], 'rgba(248,245,242,.24)')
    tiles = ''
    for n, nom in DEP:
        tiles += (f'<div style="display:flex;align-items:center;gap:14px;height:56px">'
                  f'<span class="D" style="flex:none;width:56px;height:40px;border-radius:12px;background:{C["corc"]};color:{C["cort"]};display:grid;place-items:center;font-weight:760;font-size:22px">{n}</span>'
                  f'<span style="font-weight:600;font-size:24px;white-space:nowrap">{nom}</span></div>')
    stats = ''.join(
        f'<div style="flex:1;padding:22px 24px;border-radius:24px;background:{bg}">'
        f'<div class="D" style="font-weight:740;font-size:50px;letter-spacing:-.035em;line-height:1;color:{fg}">{c}</div>'
        f'<div style="margin-top:8px;font-weight:600;font-size:21px;line-height:1.3;color:{fg};opacity:.8">{t}</div></div>'
        for c, t, bg, fg in [('1' + NB + '518', 'sites de communes lus', C['encre'], C['sable']),
                             ('1' + NB + '093', 'sites avec une date lisible', C['corc'], C['cort'])])
    inner = (f'<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:14px">'
             f'<span style="font-weight:700;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:rgba(26,26,26,.5)">14 départements</span>'
             f'{pill("Du 13 au 24 novembre 2026", C["corc"], C["cort"], 44, 20, icon=ico("clock", 20, C["cort"]))}</div>'
             f'<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:24px;border-top:2px solid rgba(26,26,26,.07);padding-top:10px">{tiles}</div>'
             f'<div style="display:flex;gap:14px;margin-top:18px">{stats}</div>')
    v = carte(0, 0, 904, inner, pad='28px 36px 30px', rad=40)
    b += mise(tflow('Nous avons lu', 'les sites de 1' + NB + '518 communes.', 84, C['sable'], C['corc']), v, 760,
              pied('Pour chaque site, une seule question :<br>quand date la dernière publication visible ?', C['sable']))
    return b


# ---------- 3 · les chiffres ----------
BARS = [(70, 'ont publié dans le dernier mois', C['cor'], C['encre']),
        (17, 'n’ont rien publié depuis plus de 3 mois', C['corf'], C['sable']),
        (12, 'n’ont rien publié depuis plus de 6 mois', C['cort'], C['sable'])]


def p3():
    b = motif(MOTIF['corc'], 2300, 120, -420)
    b += head(N, 2, lg(), C['cor'], 'rgba(26,26,26,.14)')
    rows = ''
    for i, (p, t, bg, fg) in enumerate(BARS):
        bord = 'border-top:2px solid rgba(26,26,26,.07);' if i else ''
        rows += (f'<div style="{bord}padding:26px 0 24px">'
                 f'<div style="display:flex;align-items:baseline;gap:18px">'
                 f'<span class="D" style="flex:none;width:150px;font-weight:760;font-size:64px;letter-spacing:-.04em;line-height:1;color:{C["cort"] if i else C["encre"]}">{p}{NB}%</span>'
                 f'<span style="font-weight:650;font-size:27px;line-height:1.25">{t}</span></div>'
                 f'<div style="margin-top:18px;height:26px;border-radius:13px;background:rgba(26,26,26,.06);overflow:hidden">'
                 f'<div style="width:{p}%;height:100%;border-radius:13px;background:{bg}"></div></div></div>')
    inner = (f'<div style="font-weight:700;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:rgba(26,26,26,.5)">Sur les 1{NB}093 sites où la date est lisible</div>'
             f'<div style="margin-top:6px">{rows}</div>'
             f'<div style="margin-top:4px;padding:16px 20px;border-radius:20px;background:{C["corc"]};font-weight:600;font-size:21px;line-height:1.3;color:{C["cort"]}">'
             f'Les 12{NB}% font partie des 17{NB}% (127 sites sur 189).</div>')
    v = carte(0, 0, 904, inner, pad='32px 40px 30px', rad=40)
    b += mise(tflow('La plupart publient.', 'Une partie s’est arrêtée.', 88), v, 700,
              pied('767 sites ont publié dans le mois précédant le relevé.<br>189 n’ont rien publié depuis plus de trois mois.'))
    return b


# ---------- 4 · ce que cela dit ----------
CHERCHE = [('Un horaire', 'L’accueil est-il ouvert samedi ?'), ('Une démarche', 'Comment s’inscrire à la cantine ?'), ('Un arrêté', 'La rue est-elle fermée lundi ?')]


def p4():
    b = motif(MOTIF['cor'], 2300, 120, -420)
    b += head(N, 3, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    rows = ''.join(f'<div style="padding:14px 0;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<div style="font-weight:700;font-size:25px">{a}</div><div style="margin-top:3px;font-weight:550;font-size:20px;color:rgba(26,26,26,.55)">{s}</div></div>'
                   for a, s in CHERCHE)
    site = (f'<div style="display:flex;align-items:center;gap:8px;padding-bottom:16px">'
            + ''.join(f'<span style="width:12px;height:12px;border-radius:50%;background:rgba(26,26,26,.15)"></span>' for _ in range(3))
            + f'<span style="margin-left:10px;flex:1;height:34px;border-radius:17px;background:rgba(26,26,26,.05);display:flex;align-items:center;padding:0 16px;font-weight:600;font-size:17px;color:rgba(26,26,26,.5)">Votre collectivité · Actualités</span></div>'
            f'<div style="font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:{C["cort"]}">Les habitants y cherchent</div>'
            f'<div style="margin-top:8px">{rows}</div>'
            f'<div style="margin-top:12px">{pill("Dernière actualité : il y a 4 mois", C["corf"], C["sable"], 48, 20, icon=ico("clock", 20, C["sable"]))}</div>')
    v = cadre('cuisine-ordi', 0, 0, 380, 560, '32% center', 36)
    v += carte(404, 0, 500, site, pad='22px 28px 24px', rad=32)
    b += mise(tflow('Le site reste', 'la première page consultée.', 88, C['encre'], C['encre']), v, 700,
              pied('Quand l’actualité s’arrête,<br>ce n’est presque jamais un choix :<br>c’est un manque de temps ou de relais.', C['encre']))
    return b


def p5():
    return fin(N, 4, '#C3604D', 'Une publication<br>régulière, prise en charge.', 'Abonnement mensuel, pour les communes.', C['corc'])


PAGES = [(p1, C['corc']), (p2, C['corf']), (p3, C['corc']), (p4, C['cor']), (p5, C['corf'])]

TEXTE = """Cette semaine, au Congrès des maires, il est beaucoup question de moyens. Voici un premier chiffre, relevé sur le terrain.

Du 13 au 24 novembre, Fill a lu les sites de 1 518 communes dans 14 départements de l'Ouest. Sur les 1 093 sites où la date de la dernière publication est lisible :
: 70 % ont publié dans le dernier mois ;
: 17 % n'ont rien publié depuis plus de trois mois ;
: 12 % n'ont rien publié depuis plus de six mois.

La plupart des communes publient. Une partie, souvent faute de temps ou de relais, s'arrête, alors que le site reste la page où les habitants cherchent un horaire, une démarche, une information de travaux.

C'est le premier relevé d'un baromètre que Fill mettra à jour. La méthode est simple : la date de la publication la plus récente visible sur le site, rien de plus.

Écrivez-nous, on regarde ça ensemble."""
TEXTE_IG = """Cette semaine, au Congrès des maires, il est beaucoup question de moyens. Voici un premier chiffre, relevé sur le terrain.

Du 13 au 24 novembre, Fill a lu les sites de 1 518 communes dans 14 départements de l'Ouest. Sur les 1 093 sites où la date de la dernière publication est lisible :
: 70 % ont publié dans le dernier mois ;
: 17 % n'ont rien publié depuis plus de trois mois ;
: 12 % n'ont rien publié depuis plus de six mois.

La plupart des communes publient. Une partie, souvent faute de temps ou de relais, s'arrête, alors que le site reste la page où les habitants cherchent un horaire, une démarche, une information de travaux.

Écrivez-nous, on regarde ça ensemble (lien en bio)."""
TAGS = "\n\n#CongresDesMaires #SalonDesMaires #CommunicationPublique #Communes"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'bm-{i + 1:02d}', bg, f(), end=1)
    print('ok')
