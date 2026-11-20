import importlib.util
import lgen as G
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page
_s = importlib.util.spec_from_file_location('lg2', '/home/claude/launch/gen2.py'); L2 = importlib.util.module_from_spec(_s); _s.loader.exec_module(L2)
ttl = L2.ttl

N = 10
MOT = 2300, 120, -420


def mot(col):
    return motif(col, *MOT)


def tagc(t, bg, fg, h=46, fs=22):
    return f'<span class="tag" style="height:{h}px;font-size:{fs}px;padding:0 20px;background:{bg};color:{fg}">{t}</span>'


def date(t, col):
    return f'<div class="I" style="position:absolute;left:88px;top:170px;font-size:42px;color:{col}">{t}</div>'


def ttl2(a, b, col, icol, size=84):
    # titre de page intérieure, sous la date
    return f'<div class="ttl" style="top:228px;color:{col};font-size:{size}px">{a}<span class="I" style="color:{icol}">{b}</span></div>'


def textcard(y, h, label, lbg, lfg, text):
    return (f'<div class="card" style="left:88px;right:88px;top:{y}px;height:{h}px;padding:38px 44px;display:flex;flex-direction:column;gap:22px">'
            f'<div style="display:flex;align-items:center;justify-content:space-between">{tagc(label, lbg, lfg)}'
            f'<span style="font-weight:600;font-size:21px;color:rgba(26,26,26,.45)">Texte à reprendre</span></div>'
            f'<p style="margin:0;font-weight:500;font-size:34px;line-height:1.4;color:{C["encre"]}">{text}</p></div>')


def bas(text, col='rgba(26,26,26,.6)'):
    return f'<div style="position:absolute;left:88px;right:88px;top:1214px;font-weight:600;font-size:26px;color:{col}">{text}</div>'


# ---------- 1 · couverture ----------
def calendrier(left, top, rot):
    days = 'LMMJVSD'
    marked = {1: C['lav'], 8: C['lav'], 12: C['lavf'], 14: C['lav'], 17: C['lav'], 22: C['lav'], 24: C['cor'], 31: C['cor']}
    hd = ''.join(f'<span style="text-align:center;font-weight:650;font-size:20px;color:rgba(26,26,26,.4)">{d}</span>' for d in days)
    cells = '<span></span>'  # 1er décembre 2026 : mardi
    for d in range(1, 32):
        if d in marked:
            fg = C['sable'] if marked[d] in (C['lavf'],) else C['encre']
            cells += f'<span style="display:grid;place-items:center;height:62px;border-radius:50%;background:{marked[d]};font-weight:700;font-size:24px;color:{fg}">{d}</span>'
        else:
            cells += f'<span style="display:grid;place-items:center;height:62px;font-weight:500;font-size:24px;color:rgba(26,26,26,.5)">{d}</span>'
    return (f'<div class="card" style="left:{left}px;top:{top}px;width:640px;padding:38px 42px;transform:rotate({rot}deg)">'
            f'<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:22px"><span class="D" style="font-weight:650;font-size:42px;letter-spacing:-.03em">Décembre</span>'
            f'<span style="font-weight:650;font-size:22px;color:{C["lavt"]}">8 rendez-vous</span></div>'
            f'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">{hd}{cells}</div></div>')


def p1():
    b = mot(MOTIF['lavc'])
    b += (f'<div style="position:absolute;left:88px;top:88px">{logo(56)}</div>'
          f'<div style="position:absolute;right:88px;top:92px">{tagc("Guide · n°1", C["lavf"], C["sable"], 52, 24)}</div>')
    b += (f'<div style="position:absolute;left:88px;right:60px;top:250px"><div class="D" style="font-weight:650;font-size:150px;line-height:.9;letter-spacing:-.05em">La com</div>'
          f'<div class="I" style="font-size:124px;line-height:1.02;letter-spacing:-.02em;color:{C["lavt"]};margin-top:4px">de décembre.</div></div>')
    b += calendrier(340, 600, 4)
    b += (f'<div style="position:absolute;left:88px;right:88px;bottom:84px;display:flex;align-items:center;justify-content:space-between">'
          f'<span style="font-weight:600;font-size:27px;line-height:1.35;color:rgba(26,26,26,.7)">Ce qu’il faut publier, date par date<br>pour une commune ou une entreprise</span>'
          f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["encre"]}">{arrow(C["sable"], 42)}</span></div>')
    return b


# ---------- 2 · le mois en un coup d'œil ----------
RDV = [('1er déc.', 'Le programme des fêtes'), ('8 déc.', 'Les dates limites'), ('12 déc.', 'L’événement du mois'), ('14 déc.', 'Les horaires des fêtes'),
       ('17 déc.', 'Les vœux se préparent'), ('22 déc.', 'L’année en images'), ('24 déc.', 'Le message de fêtes'), ('1er janv.', 'Les vœux, programmés')]


def p2():
    b = mot(MOTIF['lavf'])
    b += head(N, 1, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.24)')
    b += ttl('Décembre en', '8 rendez-vous.', C['sable'], C['lavc'], 92)
    rows = ''
    for i, (d, t) in enumerate(RDV):
        rows += (f'<div style="display:grid;grid-template-columns:150px 1fr auto;align-items:center;height:93px;{"border-top:2px solid rgba(26,26,26,.07)" if i else ""}">'
                 f'<span style="font-weight:700;font-size:25px;color:{C["lavt"]}">{d}</span>'
                 f'<span class="D" style="font-weight:650;font-size:34px;letter-spacing:-.02em">{t}</span>'
                 f'<span style="font-weight:600;font-size:22px;color:rgba(26,26,26,.4)">p. {i + 3 if i < 6 else 9}</span></div>')
    b += f'<div class="card" style="left:88px;right:88px;top:470px;height:792px;padding:22px 44px">{rows}</div>'
    return b


# ---------- 3 à 8 · rendez-vous ----------
def page_textes(n, bg, d, t1, t2, commune, entreprise, astuce):
    b = mot(MOTIF['lavc'] if bg == C['lavc'] else MOTIF['sable'])
    b += head(N, n, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += date(d, C['lavt']) + ttl2(t1, t2, C['encre'], C['lavt'])
    b += textcard(470, 344, 'Commune', C['lavc'], C['lavt'], commune)
    b += textcard(846, 344, 'Entreprise', C['corc'], C['cort'], entreprise)
    b += bas(astuce)
    return b


def p3():
    return page_textes(2, C['lavc'], 'Mardi 1er décembre', 'Annoncer le', 'programme des fêtes.',
                       f'Marché de Noël, illuminations, spectacle des écoles : tout le programme des fêtes est en ligne sur le site de la commune. On vous attend nombreux{NB}!',
                       f'Décembre est là{NB}! Horaires, idées cadeaux, dates de commande : tout ce qu’il faut savoir pour vos achats de fin d’année est sur notre site.',
                       'Une publication et une actualité sur le site, épinglée jusqu’à fin décembre')


def p4():
    return page_textes(3, C['lavc'], 'Mardi 8 décembre', 'Rappeler', 'les dates limites.',
                       f'Colis des aînés : les inscriptions se terminent vendredi 11 décembre, en mairie ou par téléphone. Pensez-y pour vous ou pour un proche.',
                       f'Pour être livré avant Noël, passez commande avant le vendredi 18 décembre. Après cette date, on fait le maximum, sans pouvoir le garantir.',
                       'Un rappel court, avec la date en premier')


def checklist(y, h, titre, items, accent):
    rows = ''.join(f'<div style="display:grid;grid-template-columns:150px 1fr;align-items:center;min-height:132px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="font-weight:700;font-size:27px;color:{accent}">{a}</span><span style="font-weight:500;font-size:32px;line-height:1.3">{t}</span></div>' for a, t in items)
    return (f'<div class="card" style="left:88px;right:88px;top:{y}px;height:{h}px;padding:30px 44px">'
            f'<div class="D" style="font-weight:650;font-size:34px;line-height:1.15;padding-bottom:20px">{titre}</div>{rows}</div>')


def p5():
    b = mot('rgba(184,164,255,.08)')
    b += head(N, 4, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.2)')
    b += date('Samedi 12 décembre', C['lav']) + ttl2('L’événement', 'du mois.', C['sable'], C['lav'])
    b += checklist(470, 792, 'Marché de Noël, portes ouvertes : avant, pendant, après', [
        ('J-10', 'L’affiche et une publication avec la date, le lieu et les horaires'),
        ('J-3', 'Un rappel en story, avec le programme de la journée'),
        ('Jour J', 'Trois ou quatre stories sur place : l’installation, l’ambiance, les visiteurs'),
        ('J+1', 'Un album photo et un mot de remerciement aux bénévoles ou à l’équipe'),
        ('J+7', 'Une actualité sur le site, qui reste comme trace de l’événement')], C['lavt'])
    return b


def p6():
    return page_textes(5, C['lavc'], 'Lundi 14 décembre', 'Annoncer', 'les horaires des fêtes.',
                       f'Pendant les fêtes, la mairie vous accueille du lundi au vendredi, de 9 h à 12 h. Fermeture à 12 h les jeudis 24 et 31 décembre. Belles fêtes de fin d’année{NB}!',
                       f'Nos horaires pendant les fêtes : ouvert jusqu’au mercredi 23 décembre, fermé du 24 au 27, réouverture le lundi 28 à 9 h. Merci pour cette année à vos côtés.',
                       'Sur le site, sur la fiche Google et en publication, une semaine avant')


def p7():
    b = mot(MOTIF['lav'])
    b += head(N, 6, logo(44, C['encre'], C['lavf']), C['encre'], 'rgba(26,26,26,.16)')
    b += date('Jeudi 17 décembre', C['lavt']) + ttl2('Les vœux', 'se préparent maintenant.', C['encre'], C['lavt'])
    col = lambda titre, items, tbg, tfg: (f'<div style="flex:1;display:flex;flex-direction:column;gap:22px"><div>{tagc(titre, tbg, tfg)}</div>'
                                          + ''.join(f'<div style="display:flex;gap:16px;align-items:flex-start"><span style="flex:none;margin-top:4px;width:34px;height:34px;border-radius:50%;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 19)}</span><span style="font-weight:500;font-size:31px;line-height:1.32">{i}</span></div>' for i in items) + '</div>')
    b += (f'<div class="card" style="left:88px;right:88px;top:470px;height:792px;padding:44px;display:flex;flex-direction:column;gap:44px">'
          + col('Commune', ['La carte de vœux numérique, pour le site et les réseaux', 'L’invitation à la cérémonie des vœux : date, lieu, horaire', 'Le mot du maire, écrit ou en vidéo courte'], C['lavc'], C['lavt'])
          + col('Entreprise', ['La carte de vœux pour vos clients et partenaires', 'La publication du 1er janvier, prête à programmer', 'La signature de mail aux couleurs de 2027'], C['corc'], C['cort'])
          + '</div>')
    return b


def p8():
    return page_textes(7, C['lavc'], 'Mardi 22 décembre', 'Raconter', 'l’année en images.',
                       f'2026 en quelques images. Merci à toutes celles et ceux qui ont fait vivre la commune cette année : associations, bénévoles, agents et habitants.',
                       f'Merci pour cette année 2026 à vos côtés. Retour en images sur les projets et les rencontres qui l’ont marquée.',
                       'Un carrousel de 6 à 10 photos, sans texte sur les images')


def p9():
    b = mot(MOTIF['lavf'])
    b += head(N, 8, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.24)')
    b += date('Avant de partir en congés', C['lavc']) + ttl2('Ce qu’on', 'programme d’avance.', C['sable'], C['lavc'])
    b += checklist(470, 792, 'À programmer avant le 23 décembre', [
        ('24 déc.', 'Le message de fêtes, court, avec une photo'),
        ('29 déc.', 'Le rappel des horaires de fin d’année'),
        ('1er janv.', 'Les vœux, sur le site et les réseaux'),
        ('Mail', 'La réponse automatique, avec la date de retour'),
        ('4 janv.', 'La première publication de l’année')], C['lavt'])
    return b


def p10():
    b = mot(MOTIF['lavc'])
    b += head(N, 9, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += ttl('Enregistrez ce guide', 'pour décembre.', C['encre'], C['lavt'], 92)
    b += (f'<div class="card" style="left:88px;right:88px;top:470px;height:514px;padding:48px;display:flex;flex-direction:column;justify-content:space-between">'
          f'<div><span style="font-weight:650;font-size:24px;color:{C["lavt"]}">Prochain guide</span>'
          f'<div class="D" style="margin-top:14px;font-weight:650;font-size:88px;line-height:1;letter-spacing:-.04em">Guide n°2</div>'
          f'<div class="I" style="margin-top:10px;font-size:60px;line-height:1.05;color:{C["lavt"]}">Préparer janvier<br>avant les congés.</div></div>'
          f'<div style="font-weight:500;font-size:28px;line-height:1.4;color:rgba(26,26,26,.65)">Le 10 décembre, sur Instagram et LinkedIn.</div></div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:1016px;height:246px;border-radius:40px;background:{C["lavf"]};padding:0 48px;display:flex;align-items:center;justify-content:space-between">'
          f'<div><div class="D" style="font-weight:650;font-size:40px;line-height:1.1;letter-spacing:-.025em;color:{C["sable"]}">Tout ça, Fill le prépare</div>'
          f'<div class="I" style="font-size:36px;color:{C["lavc"]}">et le publie pour vous.</div>'
          f'<div style="margin-top:12px;font-weight:600;font-size:25px;color:rgba(248,245,242,.8)">fill.studioes.fr</div></div>'
          f'<span style="flex:none;display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["sable"]}">{arrow(C["encre"], 42)}</span></div>')
    return b


PAGES = [(p1, C['lavc']), (p2, C['lavf']), (p3, C['lavc']), (p4, C['lavc']), (p5, C['encre']), (p6, C['lavc']), (p7, C['lav']), (p8, C['lavc']), (p9, C['lavf']), (p10, C['lavc'])]

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'gd{i + 1:02d}', bg, f(), end=1)
    print('ok')
