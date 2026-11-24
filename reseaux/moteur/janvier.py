"""Guide · « Préparer janvier avant les congés » (jeudi 10 décembre 2026, 11 h).
Storytelling : les congés coupent l'élan → ce qui arrive en janvier → quatre gestes (une page chacun) → avec Fill → fin.
Famille lavande (pour tous), couverture lavande claire, pages fixes. Rendu : python3 janvier.py ; render.py gj-01..09."""
import sys
sys.path.insert(0, '/home/claude/fill/reseaux/canevas')
from lgen import C, MOTIF, NB, logo, motif, head, check, page
from guide2 import ico
from v2 import pill, rond_fleche, fin, av, M, tflow, pied, mise, cadre, carte, OMBRE, HD

N = 9
GRIS = 'rgba(26,26,26,.55)'


def hd(i, fond):
    if fond == 'lavf':
        return head(N, i, logo(44, C['sable'], C['lav'], C['cor']), C['lavc'], 'rgba(248,245,242,.24)')
    if fond == 'lav':
        return head(N, i, logo(44, C['encre'], C['lavf'], C['cor']), C['encre'], 'rgba(26,26,26,.16)')
    return head(N, i, logo(44, C['encre'], C['lav'], C['cor']), C['lavf'], 'rgba(26,26,26,.14)')


def ent(t, col=None):
    return f'<div style="font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:{col or C["lavt"]}">{t}</div>'


def num(n, bg=None, fg=None):
    return pill(f'Geste {n} sur 4', bg or C['encre'], fg or C['sable'], 50, 21)


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("À faire en décembre", C["lavf"], C["sable"], 58, 24, icon=ico("clock", 24, C["sable"]))}</div>'
    b += cadre('gj-carnet', M, 196, 904, 580, 'center 50%', 40)
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:830px">'
          f'<div class="D" style="font-weight:700;font-size:104px;line-height:.92;letter-spacing:-.05em">Préparer janvier</div>'
          f'<div class="I" style="font-size:88px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">avant les congés.</div></div>')
    b += (f'<div style="position:absolute;left:{M}px;width:640px;top:1150px;font-weight:550;font-size:30px;line-height:1.3;color:rgba(26,26,26,.78)">'
          f'Quatre gestes pour une reprise<br>sans page blanche.</div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : les congés coupent l'élan ----------
SEM = [('21 déc.', 'Congés', 0), ('28 déc.', 'Congés', 0), ('4 janv.', 'Reprise', 1), ('11 janv.', 'Premiers<br>rendez-vous', 2)]


def p2():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(1, 'lav')
    w = (904 - 3 * 16) // 4
    v = ''
    for i, (d, t, k) in enumerate(SEM):
        bg = {0: 'rgba(255,255,255,.45)', 1: '#fff', 2: C['lavf']}[k]
        fg = {0: 'rgba(26,26,26,.45)', 1: C['encre'], 2: C['sable']}[k]
        v += (f'<div style="position:absolute;left:{i * (w + 16)}px;top:0;width:{w}px;height:300px;border-radius:30px;background:{bg};padding:26px 22px;'
              f'display:flex;flex-direction:column;justify-content:space-between;{"box-shadow:" + OMBRE if k else ""}">'
              f'<span style="font-weight:650;font-size:20px;color:{fg};opacity:.8">Semaine du</span>'
              f'<span class="D" style="font-weight:760;font-size:44px;letter-spacing:-.03em;color:{fg};line-height:1">{d}</span>'
              f'<span style="font-weight:700;font-size:22px;line-height:1.2;color:{fg}">{t}</span></div>')
    v += (f'<div style="position:absolute;left:0;top:330px;width:{2 * w + 16}px;padding:22px 26px;border-radius:26px;background:{C["encre"]};color:{C["sable"]};'
          f'font-weight:650;font-size:24px;line-height:1.3">Bureaux fermés ou au ralenti :<br>rien ne se prépare.</div>')
    v += (f'<div style="position:absolute;left:{2 * (w + 16)}px;top:330px;width:{2 * w + 16}px;padding:22px 26px;border-radius:26px;background:#fff;box-shadow:{OMBRE};'
          f'font-weight:650;font-size:24px;line-height:1.3;color:{C["lavt"]}">Tout doit sortir<br>dès le premier jour.</div>')
    b += mise(tflow('Deux semaines creuses,', 'puis tout repart d’un coup.', 84, C['encre'], C['encre']), v, 450,
              pied('Ce qui doit paraître début janvier<br>se prépare donc avant de partir.', C['encre']))
    return b


# ---------- 3 · ce qui arrive en janvier ----------
COLL = ['Horaires de reprise', 'Cérémonie des vœux', 'Recensement, dès la mi-janvier', 'Repas ou galette des aînés']
ENTR = ['Date de réouverture', 'Vœux aux clients', 'Soldes d’hiver, en commerce', 'Offres d’emploi de début d’année']


def col(titre, items, bg, fg):
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:14px;min-height:76px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:12px;height:12px;border-radius:50%;background:{fg}"></span>'
                   f'<span style="font-weight:620;font-size:24px;line-height:1.22">{t}</span></div>' for t in items)
    return (f'<div style="padding-bottom:14px">{pill(titre, bg, fg if bg != C["lavf"] else C["sable"], 48, 21)}</div>{rows}')


def p3():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(2, 'lavc')
    v = carte(0, 0, 444, col('Votre collectivité', COLL, C['lavf'], C['lavf']), pad='28px 30px 16px', rad=34)
    v += carte(460, 0, 444, col('Votre entreprise', ENTR, C['lavc'], C['lavt']), pad='28px 30px 16px', rad=34)
    b += mise(tflow('Janvier a ses rendez-vous,', 'connus dès maintenant.', 80, C['encre'], C['lavt']), v, 420,
              pied('Chacun demande une annonce, un texte,<br>une mise à jour du site.'))
    return b


# ---------- 4 · geste 1 : la reprise ----------
def p4():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(3, 'lav')
    img = f'<div style="position:relative;height:290px;border-radius:18px;overflow:hidden"><img src="{HD}gj-neige.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 60%"></div>'
    band = (f'<div style="margin-top:12px;padding:20px 22px;border-radius:18px;background:{C["lavf"]};color:{C["sable"]}">'
            f'<div class="D" style="font-weight:740;font-size:38px;letter-spacing:-.03em;line-height:1">Nous rouvrons<br>lundi 4 janvier</div>'
            f'<div style="margin-top:8px;font-weight:600;font-size:20px;color:{C["lavc"]}">Accueil de 9{NB}h à 12{NB}h et de 14{NB}h à 17{NB}h</div></div>')
    post = (f'<div style="display:flex;align-items:center;gap:12px;padding-bottom:14px">{av("VC", C["lavc"], s=44)}<b style="font-size:21px">Votre collectivité</b>'
            f'<span style="margin-left:auto">{pill("Programmé · 4 janv. 8 h 30", C["lavc"], C["lavt"], 40, 17)}</span></div>{img}{band}')
    v = carte(0, 0, 560, post, pad='22px 24px 24px', rad=32, rot=-1.2)
    site = (f'{ent("Sur le site")}<div class="D" style="margin-top:8px;font-weight:720;font-size:30px;letter-spacing:-.02em;line-height:1.1">Horaires de reprise</div>'
            f'<div style="margin-top:12px;display:flex;flex-direction:column;gap:10px">'
            + pill('Page d’accueil', C['lavc'], C['lavt'], 44, 19, icon=check(C['lavt'], 20))
            + pill('Page Contact', C['lavc'], C['lavt'], 44, 19, icon=check(C['lavt'], 20)) + '</div>')
    v += carte(594, 120, 310, site, pad='24px 26px 26px', rad=30)
    b += mise(tflow('La reprise,', 'écrite d’avance.', 88, C['encre'], C['encre'], pre=f'<div style="margin-bottom:22px">{num(1)}</div>'), v, 560,
              pied('Une publication programmée pour le premier jour,<br>et les horaires du site déjà à jour.', C['encre']))
    return b


# ---------- 5 · geste 2 : les rendez-vous annoncés tôt ----------
def p5():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(4, 'lavc')
    story = (f'<div style="position:relative;width:330px;height:586px;border-radius:30px;overflow:hidden;background:{C["lavf"]};box-shadow:{OMBRE}">'
             f'<img src="{HD}gj-galette.jpg" style="position:absolute;left:0;top:0;width:100%;height:56%;object-fit:cover;object-position:center 55%">'
             f'<div style="position:absolute;left:0;right:0;bottom:0;height:44%;padding:26px 24px;display:flex;flex-direction:column;justify-content:center">'
             f'<div class="D" style="font-weight:760;font-size:44px;line-height:.95;letter-spacing:-.035em;color:{C["sable"]}">Galette<br>des aînés</div>'
             f'<div style="margin-top:12px;font-weight:650;font-size:20px;line-height:1.35;color:{C["lavc"]}">Mercredi 13 janvier, 15{NB}h<br>Inscriptions avant le 18 déc.</div></div></div>')
    v = f'<div style="position:absolute;left:0;top:0;transform:rotate(-2deg)">{story}</div>'
    tl = [('Vendredi 11 déc.', 'Annonce et inscriptions ouvertes', True), ('Vendredi 18 déc.', 'Fin des inscriptions', True),
          ('Du 21 déc. au 1er janv.', 'Congés', False), ('Mercredi 13 janv.', 'La galette', True)]
    rows = ''.join(f'<div style="padding:14px 0;border-top:2px solid rgba(26,26,26,.07);{"" if ok else "opacity:.45"}">'
                   f'<div style="font-weight:700;font-size:19px;color:{C["lavt"]}">{d}</div><div style="margin-top:3px;font-weight:650;font-size:24px">{t}</div></div>'
                   for d, t, ok in tl)
    v += carte(380, 40, 524, f'{ent("Le bon calendrier")}<div style="margin-top:8px">{rows}</div>', pad='26px 30px 14px', rad=32)
    b += mise(tflow('Les rendez-vous,', 'annoncés avant les fêtes.', 84, C['encre'], C['lavt'], pre=f'<div style="margin-bottom:22px">{num(2, C["lavf"])}</div>'), v, 600,
              pied('Les inscriptions partent en décembre,<br>pas au retour des congés.'))
    return b


# ---------- 6 · geste 3 : la première semaine programmée ----------
SEMAINE = [('Lun.', '4', 'Horaires de reprise', 'Publication'), ('Mar.', '5', 'Rappel des vœux', 'Story'),
           ('Mer.', '6', 'Galette : dernières places', 'Publication'), ('Jeu.', '7', 'Retour en photos sur décembre', 'Actualité'),
           ('Ven.', '8', 'L’agenda de janvier', 'Page du site')]


def p6():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(5, 'lav')
    rows = ''
    for j, n, t, s in SEMAINE:
        rows += (f'<div style="display:flex;align-items:center;gap:22px;height:96px;border-top:2px solid rgba(26,26,26,.07)">'
                 f'<div style="flex:none;width:82px;height:72px;border-radius:18px;background:{C["lavc"]};display:flex;flex-direction:column;align-items:center;justify-content:center;color:{C["lavt"]}">'
                 f'<span style="font-weight:700;font-size:17px">{j}</span><span class="D" style="font-weight:780;font-size:32px;line-height:1">{n}</span></div>'
                 f'<span style="flex:1;font-weight:650;font-size:26px;line-height:1.2">{t}</span>'
                 f'{pill(s, C["lavf"], C["sable"], 42, 18)}</div>')
    inner = (f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px">'
             f'<span class="D" style="font-weight:720;font-size:34px;letter-spacing:-.02em">Semaine du 4 janvier</span>'
             f'{pill("Tout est prêt", C["lavc"], C["lavt"], 44, 19, icon=check(C["lavt"], 20))}</div>{rows}')
    v = carte(0, 0, 904, inner, pad='30px 38px 18px', rad=40)
    b += mise(tflow('La première semaine,', 'déjà programmée.', 88, C['encre'], C['encre'], pre=f'<div style="margin-bottom:22px">{num(3)}</div>'), v, 600,
              pied('Une chose par jour suffit :<br>le fil reprend sans effort le premier lundi.', C['encre']))
    return b


# ---------- 7 · geste 4 : rassembler avant de partir ----------
DOSSIER = [('Les photos de décembre', 'Marché, spectacle, repas : triées et nommées'), ('Les dates confirmées', 'Associations, partenaires, prestataires'),
           ('Les textes de l’an dernier', 'Vœux, galette, reprise : une base à reprendre'), ('Les horaires de janvier', 'Validés par la direction ou les élus')]


def p7():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(6, 'lavc')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:20px;padding:18px 0;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:44px;height:44px;border-radius:12px;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 26)}</span>'
                   f'<div><div style="font-weight:700;font-size:27px">{t}</div><div style="margin-top:3px;font-weight:550;font-size:21px;color:{GRIS}">{s}</div></div></div>'
                   for t, s in DOSSIER)
    onglet = (f'<div style="position:absolute;left:44px;top:-34px;height:48px;padding:0 26px;border-radius:18px 18px 0 0;background:{C["lav"]};'
              f'display:flex;align-items:center;font-weight:700;font-size:20px">Dossier « Janvier »</div>')
    v = carte(0, 34, 904, onglet + rows, pad='26px 40px 14px', rad=36, extra=f'border-top:10px solid {C["lav"]}')
    b += mise(tflow('Les éléments,', 'rassemblés avant de partir.', 84, C['encre'], C['lavt'], pre=f'<div style="margin-bottom:22px">{num(4, C["lavf"])}</div>'), v, 560,
              pied('En janvier, plus rien à chercher :<br>tout est dans un seul dossier.'))
    return b


# ---------- 8 · avec Fill ----------
LIG = [('Publication de reprise', '1'), ('Horaires du site mis à jour', '1'), ('Galette : publication et agenda', '2'), ('Story des vœux', '1')]


def p8():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(7, 'lavf')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:70px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:36px;height:36px;border-radius:10px;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 20)}</span>'
                   f'<b style="flex:1;font-size:25px">{t}</b><span style="font-weight:700;font-size:22px;color:{C["lavt"]}">{u}{NB}u.</span></div>' for t, u in LIG)
    tot = (f'<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-radius:20px;background:{C["lavc"]}">'
           f'<b style="font-size:23px">Avec Essentiel (15 unités par mois)</b><span class="D" style="font-weight:760;font-size:32px;color:{C["lavt"]}">5 unités</span></div>')
    inner = (f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px">{ent("Déposé le 15 décembre")}'
             f'{pill("Programmé", C["lavf"], C["sable"], 44, 19)}</div>{rows}{tot}')
    v = carte(0, 0, 904, inner, pad='30px 38px 32px', rad=40)
    b += mise(tflow('Avec Fill,', 'vous déposez, nous préparons.', 84, C['sable'], C['lavc']), v, 520,
              pied('Les demandes se déposent toute l’année,<br>sans période de fermeture.', C['sable']))
    return b


def p9():
    return fin(N, 8, MOTIF['lavf'], 'Janvier commence<br>en décembre.', 'On peut le préparer avec vous.', C['lavc'])


PAGES = [(p1, C['lavc']), (p2, C['lav']), (p3, C['lavc']), (p4, C['lav']), (p5, C['lavc']), (p6, C['lav']), (p7, C['lavc']), (p8, C['lavf']), (p9, C['lavf'])]

TEXTE = """Fin décembre, les bureaux ferment ou tournent au ralenti. Début janvier, tout repart d'un coup : horaires de reprise, vœux, recensement dans les communes concernées, soldes pour les commerces, premiers rendez-vous.

Quatre gestes à faire avant de partir :
: écrire la publication de reprise et mettre à jour les horaires du site ;
: annoncer dès décembre les rendez-vous de janvier qui demandent une inscription ;
: programmer la première semaine, une chose par jour ;
: rassembler photos, dates confirmées et textes de l'an dernier dans un seul dossier.

Avec Fill, vous déposez vos demandes en décembre, nous préparons et programmons. Les demandes se déposent toute l'année.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #entreprises #communicationpublique #organisation"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'gj-{i + 1:02d}', bg, f(), end=1)
    print('ok')
