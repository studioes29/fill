from gen import *

W = 2160
PAD = 120


def sec(title, sub, body):
    return (f'<section style="display: grid; grid-template-columns: 520px minmax(0, 1fr); gap: 80px; padding: 90px 0; box-shadow: inset 0 2px 0 rgba(26,26,26,.1)">'
            f'<div style="display: flex; flex-direction: column; gap: 18px"><h2 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 64px; line-height: 0.98; letter-spacing: -0.035em">{title}</h2>'
            f'<p style="margin: 0; font-family: {F}; font-weight: 500; font-size: 26px; line-height: 1.45; color: rgba(26,26,26,.7)">{sub}</p></div>'
            f'<div>{body}</div></section>')


def sw(name, hexv, use, bg, fg, big=False):
    return (f'<div style="display: flex; flex-direction: column; gap: 14px">'
            f'<div style="height: {260 if big else 180}px; border-radius: 28px; background: {bg}; box-shadow: inset 0 0 0 2px rgba(26,26,26,.06); box-sizing: border-box; padding: 22px; display: flex; align-items: flex-end">'
            f'<span style="font-family: {D}; font-weight: 650; font-size: 30px; letter-spacing: -0.02em; color: {fg}">Aa</span></div>'
            f'<span style="font-family: {F}; font-weight: 650; font-size: 24px">{name}</span>'
            f'<span style="font-family: {F}; font-weight: 500; font-size: 21px; color: rgba(26,26,26,.6)">{hexv} · {use}</span></div>')


def mini(bg, mcol, title, it, tcol, icol, label):
    return (f'<div style="display: flex; flex-direction: column; gap: 16px">'
            f'<div style="position: relative; height: 400px; border-radius: 28px; overflow: hidden; background: {bg}; box-shadow: inset 0 0 0 2px rgba(26,26,26,.07); box-sizing: border-box; padding: 34px; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px">'
            f'{motif(mcol, 520, 120, -40)}'
            f'<span style="position: relative; font-family: {D}; font-weight: 650; font-size: 40px; line-height: 0.96; letter-spacing: -0.035em; color: {tcol}">{title}</span>'
            f'<span style="position: relative; font-family: {SF}; font-style: italic; font-weight: 300; font-size: 28px; color: {icol}">{it}</span></div>'
            f'<span style="font-family: {F}; font-weight: 500; font-size: 22px; line-height: 1.4; color: rgba(26,26,26,.7)">{label}</span></div>')


def charte():
    head = f'''<header style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 0 90px">
<div style="display: flex; flex-direction: column; gap: 40px">{logo(96)}
<h1 style="margin: 0; font-family: {D}; font-weight: 650; font-size: 150px; line-height: 0.92; letter-spacing: -0.045em">Charte des posts<br><span style="font-family: {SF}; font-style: italic; font-weight: 300; font-size: 76px; letter-spacing: -0.02em">Instagram et LinkedIn, un seul format.</span></h1></div>
<p style="margin: 0; max-width: 560px; font-family: {F}; font-weight: 500; font-size: 28px; line-height: 1.45; color: rgba(26,26,26,.72)">Les posts reprennent l’identité de fill.studioes.fr et de l’Espace Fill{NB}: mêmes couleurs, mêmes typographies, mêmes cartes. Ce qui change, c’est l’échelle{NB}: tout est pensé pour un écran de téléphone.</p></header>'''

    # ---- format
    s = 0.42
    fw, fh = round(1080*s), round(1350*s)
    m = round(88*s)
    crop = round(34*s)
    schema = f'''<div style="position: relative; width: {fw}px; height: {fh}px; border-radius: 6px; background: {C['lavc']}; overflow: hidden; flex: none">
<span style="position: absolute; left: 0; top: 0; bottom: 0; width: {crop}px; background: repeating-linear-gradient(45deg, rgba(185,85,67,.35) 0 4px, transparent 4px 10px)"></span>
<span style="position: absolute; right: 0; top: 0; bottom: 0; width: {crop}px; background: repeating-linear-gradient(45deg, rgba(185,85,67,.35) 0 4px, transparent 4px 10px)"></span>
<span style="position: absolute; left: {m}px; top: {m}px; right: {m}px; bottom: {m}px; border-radius: 4px; box-shadow: inset 0 0 0 2px {C['lavf']}"></span>
<span style="position: absolute; left: {m}px; right: {m}px; top: {round(m+8)}px; height: 20px; border-radius: 4px; background: rgba(112,82,179,.25)"></span>
<span style="position: absolute; left: {m}px; right: {m}px; top: {round(70*s)}px; height: {round(720*s)}px; display: none"></span>
<span style="position: absolute; left: {m}px; right: {m}px; top: {round(110*s)}px; height: {round(700*s)}px; border-radius: 4px; background: rgba(112,82,179,.12); display: flex; align-items: center; justify-content: center; font-family: {F}; font-weight: 650; font-size: 18px; color: {C['lavt']}">Visuel</span>
<span style="position: absolute; left: {m}px; right: {m}px; top: {round(846*s)}px; height: 20px; border-radius: 4px; background: rgba(112,82,179,.25)"></span>
<span style="position: absolute; left: {m}px; right: {m}px; top: {round(940*s)}px; height: {round(230*s)}px; border-radius: 4px; background: rgba(26,26,26,.1); display: flex; align-items: center; justify-content: center; font-family: {F}; font-weight: 650; font-size: 18px; color: rgba(26,26,26,.6)">Message</span></div>'''
    pts = [('1080 × 1350 px, 4:5', 'Le même fichier part sur Instagram et sur LinkedIn (image seule, ou page de carrousel en PDF). Aucun recadrage, aucune deuxième version.'),
           ('Marges de 88 px', 'Rien ne s’en approche, sauf les cartes qui débordent volontairement du cadre.'),
           ('34 px réservés sur les côtés', 'La grille du profil Instagram recadre en 3:4{0}: aucun texte ni logo dans les bandes hachurées.'.format('')),
           ('Trois zones fixes', 'Le visuel en haut (jusqu’à 780 px), la ligne logo et pagination à 846 px, le message à partir de 940 px. Les yeux retrouvent la même place d’un post à l’autre.'),
           ('Carrousels de 10 pages au plus', 'Couverture, pages, dernière page avec l’adresse. Chaque page se comprend seule.')]
    lst = ''.join(f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 22px 0; box-shadow: inset 0 -2px 0 rgba(26,26,26,.08)"><span style="font-family: {F}; font-weight: 650; font-size: 28px">{a}</span><span style="font-family: {F}; font-weight: 500; font-size: 23px; line-height: 1.45; color: rgba(26,26,26,.7)">{b}</span></div>' for a, b in pts)
    s_format = sec('Un format, deux réseaux', 'LinkedIn et Instagram affichent tous les deux le 4:5 en entier dans le fil. C’est le format qui prend le plus de place à l’écran.', f'<div style="display: flex; gap: 80px; align-items: flex-start">{schema}<div style="flex: 1">{lst}</div></div>')

    # ---- couleurs
    pal = f'''<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px">
{sw('Lavande claire', '#E9E1FF', 'fonds', C['lavc'], C['lavt'])}{sw('Lavande', '#B8A4FF', 'fonds, accents', C['lav'], C['encre'])}{sw('Lavande foncée', '#7052B3', 'fonds, texte #5B3F9C', C['lavf'], C['sable'])}
{sw('Corail clair', '#FFE0D5', 'fonds', C['corc'], C['cort'])}{sw('Corail', '#FF8A6B', 'accents, soulignés', C['cor'], C['encre'])}{sw('Corail foncé', '#B95543', 'texte #9A4232', C['corf'], C['sable'])}</div>
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; margin-top: 40px">
{sw('Encre', '#1A1A1A', 'texte, temps forts', C['encre'], C['sable'])}{sw('Sable', '#F8F5F2', 'pages de guide', C['sable'], C['encre'])}{sw('Gris', '#E2DBD3', 'filets', C['gris'], C['encre'])}{sw('Blanc', '#FFFFFF', 'cartes', C['blanc'], C['encre'])}</div>
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; margin-top: 70px">
{mini(C['lavc'], MOTIF['lavc'], 'Lavande', 'collectivités', C['encre'], C['lavt'], 'Collectivités et contenus pour tous (guides, constats, démonstrations).')}
{mini(C['corc'], MOTIF['corc'], 'Corail', 'entreprises', C['encre'], C['cort'], 'Contenus qui parlent aux entreprises, réalisations de Studio ES.')}
{mini(C['encre'], MOTIF['encre'], 'Encre', 'temps forts', C['sable'], C['lav'], 'Lancement, bonus, annonce. Une fois par mois au plus, pour garder son effet.')}
{mini(C['sable'], MOTIF['sable'], 'Sable', 'pages de guide', C['encre'], C['lavt'], 'Pages intérieures des carrousels, là où on lit du texte.')}</div>'''
    s_col = sec('Couleurs', f'Un post, une famille{NB}: un fond, ses deux autres nuances, l’encre et le blanc. Les compositions sont ton sur ton, comme sur le site. Lavande et corail ne se croisent que dans le logo et dans les guides, qui s’adressent aux deux publics.', pal)

    # ---- typographie
    def spec(label, sample, style, meta):
        return (f'<div style="display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 40px; align-items: baseline; padding: 34px 0; box-shadow: inset 0 -2px 0 rgba(26,26,26,.08)">'
                f'<div style="display: flex; flex-direction: column; gap: 6px"><span style="font-family: {F}; font-weight: 650; font-size: 26px">{label}</span><span style="font-family: {F}; font-weight: 500; font-size: 21px; line-height: 1.4; color: rgba(26,26,26,.6)">{meta}</span></div>'
                f'<span style="{style}">{sample}</span></div>')
    typo = (spec('Titre', 'Le budget 2027 se décide maintenant.', f'font-family: {D}; font-weight: 650; font-size: 104px; line-height: 0.96; letter-spacing: -0.04em', 'Bricolage Grotesque, 650<br>84 à 132 px, interligne 0,96, approche −4 %')
            + spec('Relance', 'sans perdre le fil.', f'font-family: {SF}; font-style: italic; font-weight: 300; font-size: 72px; line-height: 1.05; letter-spacing: -0.02em', 'Urbanist italique, 300<br>environ 0,6 fois le titre, jamais seule')
            + spec('Message', f'Vous demandez par mail. Fill produit {hl("sous 2 jours", C["lavt"])}, vous validez par un lien.', f'font-family: {F}; font-weight: 650; font-size: 52px; line-height: 1.14; letter-spacing: -0.022em', 'Inter Tight, 650<br>48 à 54 px, un passage en couleur au plus')
            + spec('Texte', 'Pendant les fêtes, la mairie vous accueille du lundi au vendredi, de 9 h à 12 h.', f'font-family: {F}; font-weight: 500; font-size: 33px; line-height: 1.36', 'Inter Tight, 500<br>30 à 36 px, pages de guide')
            + spec('Étiquette', tag('Guide · décembre', C['lavc'], C['lavt'], 26), '', 'Inter Tight, 650<br>22 à 28 px, dans une pastille'))
    s_typo = sec('Typographie', f'Les trois familles du site. Un seul titre par visuel{NB}: pas de surtitre au-dessus. Rien sous 22 px, la taille minimale lisible sur un téléphone.', typo)

    # ---- éléments
    def el(label, html, note, bg=C['blanc']):
        return (f'<div style="display: flex; flex-direction: column; gap: 16px"><div style="height: 240px; border-radius: 28px; background: {bg}; display: flex; align-items: center; justify-content: center; gap: 20px; position: relative; overflow: hidden; box-shadow: inset 0 0 0 2px rgba(26,26,26,.06)">{html}</div>'
                f'<span style="font-family: {F}; font-weight: 650; font-size: 24px">{label}</span><span style="font-family: {F}; font-weight: 500; font-size: 21px; line-height: 1.4; color: rgba(26,26,26,.65)">{note}</span></div>')
    els = f'''<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 34px">
{el('Logo d’origine', logo(90), 'Sur sable, blanc et encre (fi en sable). Lavande et corail pour les deux l.', C['sable'])}
{el('Logo sur couleur', mono(90, C['encre']), 'Sur un fond lavande ou corail{0}: tout en encre, ou le second l en corail. Jamais de dégradé.'.format(NB), C['lav'])}
{el('Pagination', dashes(7, 2, C['lavf'], 'rgba(26,26,26,.14)'), 'En haut à droite des carrousels, une tirette par page. Absente des posts seuls.')}
{el('Adresse', f'<div style="transform: scale(.7)">{cta("fill.studioes.fr", C["lav"])}</div>', 'Sur la dernière page et les posts seuls. Le lien cliquable va en premier commentaire sur LinkedIn.', C['lavc'])}
{el('Étiquettes', tag('15 unités', C['lavc'], C['lavt']) + tag('Entreprise', C['corc'], C['cort']), 'Pour une cible, un nombre d’unités, une date. Jamais plus de trois par visuel.')}
{el('Filigrane', motif(MOTIF['lav'], 360, 110, -40) + '<span style="position: relative; font-family: Inter Tight, sans-serif; font-weight: 650; font-size: 22px">Le « ll » du logo</span>', 'Très grand, coupé par le cadre, d’une nuance à peine plus claire ou plus foncée que le fond.', C['lav'])}
{el('Cartes', '<div style="width: 170px; height: 200px; transform: rotate(-6deg); border-radius: 26px; background: #FFFFFF; box-shadow: 0 30px 50px -28px rgba(26,26,26,.5)"></div><div style="width: 150px; height: 180px; transform: rotate(5deg); border-radius: 26px; background: #1A1A1A; box-shadow: 0 30px 50px -28px rgba(26,26,26,.5)"></div>', 'Les cartes et feuilles du site{0}: rayon de 36 à 44 px, inclinées de 4 à 8°, deux ou trois au plus.'.format(NB), C['lavc'])}
{el('Chromé', pastille(170, '<span style="font-family: Inter Tight, sans-serif; font-weight: 750; font-size: 22px">Lancement</span>'), 'Réservé aux temps forts, sur une carte ou une pastille. Jamais sur un texte.', C['encre'])}
{el('Mot souligné', f'<span style="position: relative; font-family: {SF}; font-style: italic; font-weight: 300; font-size: 64px">s’arrête.<span style="position: absolute; left: 4px; right: 14px; bottom: -8px; height: 8px; border-radius: 4px; background: {C["cor"]}"></span></span>', 'Le trait corail du site, sous un mot de la relance. Une fois par visuel.', C['lavc'])}</div>'''
    s_el = sec('Éléments', 'Tous viennent du site ou de l’Espace Fill. Ce sont eux qui font qu’un post se reconnaît avant même qu’on lise le nom.', els)

    # ---- compositions
    comps = [('Objet et message', 'Deux ou trois cartes flottent en haut (un mail, une page de validation, une formule), le message en dessous. Pour expliquer et démontrer.', 'Lancement 2 à 6, démonstrations, constats illustrés'),
             ('Titre plein cadre', 'Un titre et sa relance occupent le bas, une carte unique en haut. Pour un constat ou une question.', 'Constats, couverture de guide'),
             ('Page de guide', 'Fond sable, une date, un titre, deux textes à reprendre (commune et entreprise). Pour être enregistré.', 'Pages intérieures des guides de saison')]
    cmp = ''.join(f'<div style="box-sizing: border-box; padding: 40px; border-radius: 32px; background: {C["blanc"]}; display: flex; flex-direction: column; gap: 14px"><span style="font-family: {D}; font-weight: 650; font-size: 40px; letter-spacing: -0.03em">{a}</span><span style="font-family: {F}; font-weight: 500; font-size: 23px; line-height: 1.45; color: rgba(26,26,26,.7)">{b}</span><span style="margin-top: 8px; align-self: flex-start; padding: 8px 16px; border-radius: 18px; background: {C["lavc"]}; color: {C["lavt"]}; font-family: {F}; font-weight: 650; font-size: 20px; line-height: 1.35">{c}</span></div>' for a, b, c in comps)
    s_comp = sec('Trois compositions', 'Les gabarits plus bas en sont des exemples réels. On change les textes et les cartes, jamais la structure.', f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px">{cmp}</div>')

    # ---- règles
    rules = [('Le constat d’abord', 'Jamais « Fill » en premier mot. Le post part d’une situation que le lecteur reconnaît.'),
             ('Un seul message', 'Un titre ou un message par visuel, et un seul passage mis en couleur.'),
             ('Pas de tiret long', 'Deux-points ou parenthèses. « 490 à 990 € », pas de tiret dans les fourchettes.'),
             ('Rien de Moëlan', 'Ni photo, ni exemple, ni chiffre. Les exemples sont fictifs et marqués « Exemple ».'),
             ('Rien de l’espace de production', 'Seuls les écrans côté client se montrent (relecture, demande, bilan).'),
             ('Pas d’ombre qui encadre', 'Les cartes ont une ombre basse et diffuse, jamais un contour gris.'),
             ('Pas de photo de banque d’images', 'Des cartes construites, ou des images de Studio ES.'),
             ('Le vide fait partie du visuel', 'On ne remplit pas un coin parce qu’il est vide.')]
    rl = ''.join(f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 26px 0; box-shadow: inset 0 -2px 0 rgba(26,26,26,.08)"><span style="font-family: {F}; font-weight: 650; font-size: 27px">{a}</span><span style="font-family: {F}; font-weight: 500; font-size: 23px; line-height: 1.45; color: rgba(26,26,26,.7)">{b}</span></div>' for a, b in rules)
    s_rules = sec('Règles', 'Celles du site et du dossier de présentation, appliquées aux réseaux.', f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 60px">{rl}</div>')

    return (f'<div style="width: {W}px; box-sizing: border-box; padding: {PAD}px; background: {C["sable"]}; font-family: {F}; color: {C["encre"]}">'
            f'{head}{s_format}{s_col}{s_typo}{s_el}{s_comp}{s_rules}</div>')


def grille():
    order = ['P4', 'P3', 'G1', 'L5', 'L4', 'P2', 'L3', 'L2', 'P5', 'L1', 'P1', 'G2']
    tw = 338
    cells = ''
    for n in order:
        cells += (f'<div style="position: relative; width: {tw}px; height: 450px; overflow: hidden; background: {C["gris"]}">'
                  f'<div style="position: absolute; left: -{(360 - tw)//2}px; top: 0; width: 1080px; height: 1350px; transform: scale(0.33334); transform-origin: 0 0">'
                  f'<dc-import name="{n}" hint-size="1080px,1350px"></dc-import></div></div>')
    return (f'<div style="width: 1160px; box-sizing: border-box; padding: 80px; background: {C["blanc"]}; font-family: {F}; color: {C["encre"]}">'
            f'<div style="display: flex; align-items: center; gap: 28px; padding-bottom: 50px">'
            f'<span style="display: flex; align-items: center; justify-content: center; width: 150px; height: 150px; border-radius: 50%; background: {C["sable"]}; box-shadow: inset 0 0 0 2px rgba(26,26,26,.08)">{logo(44)}</span>'
            f'<span style="display: flex; flex-direction: column; gap: 6px"><span style="font-family: {F}; font-weight: 700; font-size: 32px">fill.communication</span>'
            f'<span style="font-family: {F}; font-weight: 500; font-size: 24px; color: rgba(26,26,26,.65)">Fill · Service communication externalisé</span>'
            f'<span style="font-family: {F}; font-weight: 600; font-size: 24px; color: {C["lavt"]}">fill.studioes.fr</span></span></div>'
            f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px">{cells}</div>'
            f'<p style="margin: 40px 0 0; font-family: {F}; font-weight: 500; font-size: 22px; line-height: 1.45; color: rgba(26,26,26,.6)">Aperçu de la grille du profil, recadrée en 3:4 comme sur Instagram. On alterne les fonds d’un post à l’autre{NB}: jamais deux encre côte à côte.</p></div>')


if __name__ == '__main__':
    write('Main.dc.html', 'Charte des posts Fill', W, 7290, charte())
    write('Grille.dc.html', 'Aperçu de la grille Instagram', 1160, 2276, grille())
    print('ok')
