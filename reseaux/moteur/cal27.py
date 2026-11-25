"""Outil · « Le calendrier de la com 2027 » (mardi 15 décembre 2026, 11 h).
Storytelling : couverture (à enregistrer) → contexte (une date connue se prépare avant : J-21, J-7, J-1, après)
→ quatre trimestres en calendrier (dates fixes de 2027, pour tous / communes / commerces) → ce que ça représente en unités → fin.
Famille lavande (pour tous), couverture sable, 8 pages fixes. Rendu : python3 cal27.py ; render.py ca-01..08.
Dates : jours de la semaine calculés pour 2027 (Pâques le 28 mars) ; soldes selon la règle du Code de commerce
(hiver : mercredi 6 janvier ; été : mercredi 23 juin) ; Journées du patrimoine laissées à « mi-septembre » (dates 2027 non publiées)."""
from kit_dec import *

N = 8
TAG = {'c': ('Communes', C['lavf'], C['sable']), 'e': ('Commerces', C['cor'], C['encre'])}


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("À enregistrer", C["encre"], C["sable"], 58, 24, icon=ico("save", 24, C["sable"]))}</div>'
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:196px">'
          f'<div class="D" style="font-weight:700;font-size:100px;line-height:.92;letter-spacing:-.05em">Le calendrier</div>'
          f'<div class="I" style="font-size:86px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">de la com 2027.</div>'
          f'<div style="margin-top:26px;font-weight:550;font-size:32px;line-height:1.3;color:rgba(26,26,26,.78)">Les dates qui reviennent, trimestre par trimestre.</div></div>')
    b += cadre('cal-punaises', M, 560, 904, 540, 'center 82%', 40)
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : une date connue se prépare avant ----------
ETAPES = [('J-21', 'Préparer', 'Texte et visuel'), ('J-7', 'Annoncer', 'Publication<br>et agenda'),
          ('J-1', 'Rappeler', 'Story, actualité'), ('Après', 'Remercier', 'Photos et bilan')]


def p2():
    b = fond('lavc') + hd(N, 1, 'lavc')
    w = 904
    v = f'<div style="position:absolute;left:60px;right:60px;top:52px;height:4px;border-radius:2px;background:{C["lav"]}"></div>'
    cw = (w - 3 * 16) // 4
    for i, (j, t, s) in enumerate(ETAPES):
        x = i * (cw + 16)
        last = i == 3
        v += (f'<div style="position:absolute;left:{x}px;top:0;width:{cw}px;display:flex;flex-direction:column;align-items:center">'
              f'<span class="D" style="display:grid;place-items:center;width:108px;height:108px;border-radius:50%;background:{C["lavf"] if not last else "#fff"};'
              f'color:{C["sable"] if not last else C["lavt"]};font-weight:760;font-size:{30 if last else 34}px;letter-spacing:-.02em;box-shadow:{OMBRE}">{j}</span>'
              f'<div style="margin-top:22px;width:100%;padding:24px 18px 26px;border-radius:28px;background:#fff;box-shadow:{OMBRE};text-align:center">'
              f'<div class="D" style="font-weight:720;font-size:30px;letter-spacing:-.02em">{t}</div>'
              f'<div style="margin-top:8px;font-weight:550;font-size:21px;line-height:1.3;color:{GRIS}">{s}</div></div></div>')
    v += (f'<div style="position:absolute;left:0;top:350px;width:904px;padding:28px 32px;border-radius:30px;background:{C["lavf"]};color:{C["sable"]};'
          f'display:flex;align-items:center;gap:20px;font-weight:650;font-size:28px;line-height:1.3">'
          f'<span style="flex:none;width:52px;height:52px;border-radius:50%;background:{C["sable"]};display:grid;place-items:center">{ico("clock", 28, C["lavf"])}</span>'
          f'Le plus dur n’est pas de savoir la date :<br>c’est de s’y prendre trois semaines avant.</div>')
    b += mise2(tete('Une date connue', 'se prépare avant.',
                    'Vœux, fête de la musique, rentrée : les grands rendez-vous<br>reviennent chaque année. Voici comment on les tient.', 88, C['encre'], C['lavt']),
               v, 480)
    return b


# ---------- 3 à 6 · les trimestres ----------
TRIM = [
    ('Janvier à mars,', 'l’année démarre.', 'Vœux, soldes, recensement et budget :<br>un trimestre chargé dès la reprise.', [
        ('Janvier', [('Tout le mois', 'Vœux et<br>rétrospective', ''), ('Mer. 6', 'Début des<br>soldes d’hiver', 'e'), ('Mi-janv.', 'Recensement<br>(communes concernées)', 'c')]),
        ('Février', [('Selon zone', 'Horaires des<br>vacances d’hiver', ''), ('Tout le mois', 'Agenda<br>du printemps', '')]),
        ('Mars', [('Lun. 29', 'Lundi de Pâques<br>(férié)', ''), ('Mars ou avril', 'Vote du budget', 'c')])]),
    ('Avril à juin,', 'les beaux jours.', 'Ponts de mai, fêtes de quartier et soldes :<br>les horaires bougent, il faut les annoncer.', [
        ('Avril', [('Jeu. 15', 'Dernier jour<br>pour le budget', 'c'), ('Selon zone', 'Vacances<br>de printemps', '')]),
        ('Mai', [('Sam. 1er et 8', 'Fériés, un samedi', ''), ('Jeu. 6', 'Ascension<br>et son pont', ''), ('Lun. 17', 'Lundi de Pentecôte', '')]),
        ('Juin', [('Lun. 21', 'Fête de la musique', ''), ('Mer. 23', 'Début des<br>soldes d’été', 'e'), ('Fin juin', 'Horaires d’été<br>à publier', '')])]),
    ('Juillet à septembre,', 'l’été puis la rentrée.', 'Fermetures, fête nationale, rentrée et patrimoine :<br>la rentrée se prépare dès la fin juillet.', [
        ('Juillet', [('Mer. 14', 'Fête nationale', ''), ('Tout l’été', 'Fermetures et<br>horaires d’été', '')]),
        ('Août', [('Dim. 15', 'Assomption', ''), ('Fin août', 'Rentrée à annoncer', '')]),
        ('Septembre', [('Début sept.', 'Rentrée scolaire<br>et associative', ''), ('Mi-sept.', 'Journées<br>du patrimoine', ''), ('Sept.', 'Forum des<br>associations', 'c')])]),
    ('Octobre à décembre,', 'la fin d’année.', 'Toussaint, budget suivant et fêtes :<br>c’est aussi là que se prépare 2028.', [
        ('Octobre', [('Selon zone', 'Vacances<br>de la Toussaint', ''), ('Tout le mois', 'Budget 2028<br>en préparation', 'c')]),
        ('Novembre', [('Lun. 1er', 'Toussaint', ''), ('Jeu. 11', 'Armistice', '')]),
        ('Décembre', [('Tout le mois', 'Marchés et animations', ''), ('Sam. 25', 'Noël', ''), ('Fin déc.', 'Horaires des fêtes,<br>vœux 2028', '')])]),
]


def mois(nom, items, w):
    rows = ''
    for d, t, k in items:
        tag = ''
        if k:
            lab, bg, fg = TAG[k]
            tag = f'<div style="margin-top:8px">{pill(lab, bg, fg, 34, 16)}</div>'
        rows += (f'<div style="padding:18px 0 20px;border-top:2px solid rgba(26,26,26,.07)">'
                 f'<div style="font-weight:750;font-size:21px;letter-spacing:.02em;color:{C["lavt"]}">{d}</div>'
                 f'<div style="margin-top:4px;font-weight:650;font-size:26px;line-height:1.22">{t}</div>{tag}</div>')
    return (f'<div style="width:{w}px;padding:26px 24px 10px;border-radius:30px;box-sizing:border-box;background:#fff;box-shadow:{OMBRE}">'
            f'<div class="D" style="font-weight:740;font-size:38px;letter-spacing:-.03em;padding-bottom:14px">{nom}</div>{rows}</div>')


def ptrim(k):
    l1, l2, desc, ms = TRIM[k]
    nom = ['lav', 'lavc', 'lav', 'lavc'][k]
    b = fond(nom) + hd(N, 2 + k, nom)
    w = (904 - 2 * 16) // 3
    v = f'<div style="display:flex;gap:16px;align-items:stretch">' + ''.join(mois(n, it, w) for n, it in ms) + '</div>'
    leg = (f'<div style="margin-top:22px;display:flex;gap:12px;align-items:center;font-weight:600;font-size:20px;color:{GRIS}">'
           f'Sans mention : pour tous{NB}·{NB}{pill("Communes", C["lavf"], C["sable"], 34, 16)}{pill("Commerces", C["cor"], C["encre"], 34, 16)}</div>')
    b += mise2(tete(l1, l2, desc, 84, C['encre'], C['lavt'] if nom == 'lavc' else C['encre'], 'rgba(26,26,26,.78)'), v + leg, 640)
    return b


# ---------- 7 · ce que ça représente ----------
JUIN = [('Fête de la musique', 'Publication, story, agenda du site', 3), ('Soldes ou horaires d’été', 'Publication, page Horaires', 2),
        ('Fête de fin d’année scolaire', 'Publication, actualité', 2)]


def p7():
    b = fond('lavf') + hd(N, 6, 'lavf')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:18px;height:104px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'{coche(40)}<span style="flex:1"><b style="font-size:25px">{t}</b><br><span style="font-weight:550;font-size:20px;color:{GRIS}">{s}</span></span>'
                   f'<span class="D" style="font-weight:760;font-size:30px;color:{C["lavt"]}">{u}{NB}u.</span></div>' for t, s, u in JUIN)
    tot = (f'<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;padding:22px 26px;border-radius:22px;background:{C["lavc"]}">'
           f'<b style="font-size:25px">Juin, par exemple</b><span class="D" style="font-weight:780;font-size:38px;color:{C["lavt"]}">7 unités</span></div>'
           f'<div style="margin-top:18px;font-weight:600;font-size:22px;line-height:1.4;color:{GRIS}">Essentiel : 15 unités par mois, 490{NB}€.<br>Le reste du mois pour vos annonces courantes.</div>')
    inner = (f'<div style="display:flex;justify-content:space-between;align-items:center">{ent("Calendrier de publication")}{pill("Juin 2027", C["lavc"], C["lavt"], 44, 19)}</div>'
             f'<div class="D" style="margin:8px 0 14px;font-weight:720;font-size:36px;letter-spacing:-.02em">Trois rendez-vous planifiés</div>{rows}{tot}')
    v = carte(0, 0, 904, inner, pad='32px 38px 34px', rad=40)
    b += mise2(tete('Chaque date devient', 'une demande planifiée.',
                    'Nous posons vos rendez-vous dans le calendrier, vous validez,<br>et tout part à la date prévue. Le coût est connu d’avance.',
                    84, C['sable'], C['lavc'], 'rgba(248,245,242,.88)'), v, 700)
    return b


def p8():
    return fin(N, 7, MOTIF['lavf'], 'Une année<br>bien calée.', 'Écrivez-nous, on regarde ça ensemble.', C['lavc'])


PAGES = [(p1, C['sable']), (p2, C['lavc']), (lambda: ptrim(0), C['lav']), (lambda: ptrim(1), C['lavc']),
         (lambda: ptrim(2), C['lav']), (lambda: ptrim(3), C['lavc']), (p7, C['lavf']), (p8, C['lavf'])]

TEXTE = """Les grands rendez-vous de la com reviennent chaque année : vœux, soldes, ponts de mai, fête de la musique, rentrée, fêtes de fin d'année.

Voici le calendrier 2027, trimestre par trimestre, avec les dates fixes et ce qui concerne plutôt les communes ou les commerces.

Le plus dur n'est pas de connaître la date : c'est de s'y prendre trois semaines avant pour préparer le texte, le visuel et l'agenda du site.

Avec Fill, chaque rendez-vous devient une demande planifiée. Vous validez, tout part à la date prévue, et le coût en unités est connu d'avance.

Enregistrez ce post pour l'avoir sous la main toute l'année.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #entreprises #calendrier2027 #reseauxsociaux"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'ca-{i + 1:02d}', bg, f(), end=1)
    print('ok')
