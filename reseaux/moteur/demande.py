"""Démo · « Une demande en trois lignes » (mardi 8 décembre 2026, 11 h).
Version 2 (retours d'Ewen du 25 nov.) : titre et description d'abord, visuel ensuite ; exemple universel
(nouveaux horaires d'accueil : vaut pour une commune comme pour une entreprise) ; page « côté entreprise » supprimée ;
page de la demande : « pas besoin de texte rédigé », la photo est facultative ; page publication : les mentions sont dans la carte de la légende.
Storytelling : une info = six tâches → vous écrivez l'essentiel → le fil → la publication → le site → vous validez → fin.
Famille lavande (pour tous), couverture lavande, 8 pages fixes. Rendu : python3 demande.py ; render.py dd-01..08."""
import sys
sys.path.insert(0, '/home/claude/fill/reseaux/canevas')
from lgen import C, MOTIF, NB, logo, motif, head, check, page
from guide2 import ico
from v2 import pill, rond_fleche, fin, av, M, cadre, carte, OMBRE, HD, tete, mise2

N = 8
GRIS = 'rgba(26,26,26,.55)'
NOM = 'Votre structure'


def hd(i, fond):
    if fond == 'lavf':
        return head(N, i, logo(44, C['sable'], C['lav'], C['cor']), C['lavc'], 'rgba(248,245,242,.24)')
    if fond == 'lav':
        return head(N, i, logo(44, C['encre'], C['lavf'], C['cor']), C['encre'], 'rgba(26,26,26,.16)')
    return head(N, i, logo(44, C['encre'], C['lav'], C['cor']), C['lavf'], 'rgba(26,26,26,.14)')


def ent(t, col=None):
    return f'<div style="font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:{col or C["lavt"]}">{t}</div>'


def coche(s=36, r=10):
    return f'<span style="flex:none;width:{s}px;height:{s}px;border-radius:{r}px;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], round(s * .58))}</span>'


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lavf"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Comment ça marche", C["encre"], C["sable"], 58, 24)}</div>'
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:196px">'
          f'<div class="D" style="font-weight:700;font-size:104px;line-height:.92;letter-spacing:-.05em">Une demande</div>'
          f'<div class="I" style="font-size:88px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">en trois lignes.</div>'
          f'<div style="margin-top:26px;font-weight:550;font-size:32px;line-height:1.3;color:rgba(26,26,26,.78)">Ce qui se passe ensuite, jusqu’à la publication.</div></div>')
    b += cadre('dm-tel', M, 540, 904, 560, '62% 40%', 40)
    msg = (f'{ent("Votre message")}'
           f'<div style="margin-top:10px;font-weight:600;font-size:26px;line-height:1.38">Dès le lundi 4 janvier, l’accueil ouvre<br>aussi le samedi, de 9{NB}h à 12{NB}h.<br>Le reste des horaires ne change pas.</div>')
    b += carte(M + 36, 870, 600, msg, pad='24px 30px 26px', rad=30)
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : une info, six tâches ----------
TACHES = ['Rédiger le texte', 'Trouver le bon visuel', 'Mettre au bon format', 'Publier sur chaque compte',
          'Mettre le site à jour', 'Corriger les horaires partout']


def p2():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(1, 'lavc')
    w = (904 - 16) // 2
    v = ''
    for i, t in enumerate(TACHES):
        x = (i % 2) * (w + 16); y = (i // 2) * 158
        v += (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:142px;border-radius:30px;background:#fff;box-shadow:{OMBRE};'
              f'display:flex;align-items:center;gap:20px;padding:0 28px">'
              f'<span class="D" style="flex:none;width:58px;height:58px;border-radius:50%;background:{C["lavc"]};color:{C["lavt"]};display:grid;place-items:center;font-weight:760;font-size:28px">{i + 1}</span>'
              f'<span style="font-weight:650;font-size:27px;line-height:1.2">{t}</span></div>')
    v += (f'<div style="position:absolute;left:0;top:{3 * 158 + 14}px;width:904px;padding:30px 32px;border-radius:30px;background:{C["lavf"]};color:{C["sable"]};'
          f'display:flex;align-items:center;gap:20px;font-weight:650;font-size:28px;line-height:1.3">'
          f'<span style="flex:none;width:52px;height:52px;border-radius:50%;background:{C["sable"]};display:grid;place-items:center">{check(C["lavf"], 28)}</span>'
          f'Avec Fill, il vous en reste une :<br>dire ce qu’il faut savoir.</div>')
    b += mise2(tete('Une info à passer,', 'six tâches derrière.',
                    'Pour une seule information, entre deux rendez-vous<br>et l’accueil du public ou des clients.', 88, C['encre'], C['lavt']),
               v, 3 * 158 + 14 + 140)
    return b


# ---------- 3 · la demande ----------
SUP = [('Publication', 'Facebook et Instagram', '1'), ('Actualité du site', 'Page d’accueil', '1'), ('Horaires du site', 'Page Contact et pied de page', '1')]


def p3():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(2, 'lav')
    sujet = (f'{ent("Le sujet")}<div class="D" style="margin-top:8px;font-weight:720;font-size:36px;letter-spacing:-.02em">Nouveaux horaires d’accueil</div>'
             f'<div style="margin-top:12px;padding:18px 22px;border-radius:20px;background:rgba(26,26,26,.04);font-weight:550;font-size:23px;line-height:1.42">'
             f'Dès le lundi 4 janvier, l’accueil ouvre aussi le samedi, de 9{NB}h à 12{NB}h.<br>Le reste des horaires ne change pas.</div>'
             f'<div style="margin-top:12px;display:flex;align-items:center;gap:12px;font-weight:600;font-size:21px;color:{GRIS}">'
             f'{ico("cam", 22, C["lavt"])}Photo de l’accueil jointe, si vous en avez une</div>')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:72px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'{coche(38)}<span style="flex:1"><b style="font-size:24px">{t}</b><span style="font-weight:550;font-size:19px;color:{GRIS}"> · {s}</span></span>'
                   f'<span style="font-weight:700;font-size:21px;color:{C["lavt"]}">{u}{NB}u.</span></div>' for t, s, u in SUP)
    sup = (f'<div style="margin-top:24px">{ent("Les supports")}</div><div style="margin-top:8px">{rows}</div>'
           f'<div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-radius:20px;background:{C["lavc"]}">'
           f'<b style="font-size:24px">Total, affiché avant l’envoi</b><span class="D" style="font-weight:760;font-size:34px;color:{C["lavt"]}">3 unités</span></div>')
    v = carte(0, 0, 904, sujet + sup, pad='30px 38px 32px', rad=40)
    b += mise2(tete('Vous écrivez l’essentiel,', 'comme à un collègue.',
                    'Pas besoin de texte rédigé. Une photo si vous en avez une ;<br>sinon, nous proposons un visuel.', 84, C['encre'], C['encre'], C['encre']),
               v, 700)
    return b


# ---------- 4 · le fil ----------
FIL = [('Déposée', 'Un mail confirme la réception', True), ('Confirmée', 'Sous 24 h ouvrées', True),
       ('En production', 'Texte, visuel, mise en page', True), ('À valider', 'Vous relisez', False), ('Publiée', 'À la date choisie', False)]


def p4():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(3, 'lavc')
    rows = ''
    for i, (t, s, ok) in enumerate(FIL):
        dot = (f'<span style="flex:none;width:48px;height:48px;border-radius:50%;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 26)}</span>' if ok else
               f'<span style="flex:none;width:48px;height:48px;border-radius:50%;box-shadow:inset 0 0 0 4px {C["lav"]};background:#fff"></span>')
        ligne = f'<span style="position:absolute;left:23px;top:80px;width:3px;height:64px;background:{C["lav"]}"></span>' if i < 4 else ''
        rows += (f'<div style="position:relative;display:flex;align-items:center;gap:24px;height:112px">{dot}{ligne}'
                 f'<div><div class="D" style="font-weight:720;font-size:34px;letter-spacing:-.02em;color:{C["encre"] if ok else C["lavt"]}">{t}</div>'
                 f'<div style="margin-top:2px;font-weight:550;font-size:22px;color:{GRIS}">{s}</div></div></div>')
    v = carte(0, 0, 904, f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px">{ent("Nouveaux horaires d’accueil")}'
              f'{pill("En production", C["lavc"], C["lavt"], 44, 19)}</div>{rows}', pad='30px 40px 22px', rad=40)
    b += mise2(tete('Votre demande', 'suit un fil, visible.',
                    'Vous savez où elle en est, sans relancer.<br>Demande courante : 2 jours ouvrés au plus.', 88, C['encre'], C['lavt']), v, 660)
    return b


# ---------- 5 · la publication ----------
def post(w):
    img = f'<div style="position:relative;height:{round(w * .9)}px;border-radius:18px;overflow:hidden"><img src="{HD}dd-accueil.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 55%"></div>'
    bandeau = (f'<div style="margin-top:12px;padding:18px 22px;border-radius:18px;background:{C["lavf"]};color:{C["sable"]}">'
               f'<div class="D" style="font-weight:740;font-size:34px;letter-spacing:-.03em;line-height:1">Ouvert le samedi</div>'
               f'<div style="margin-top:6px;font-weight:600;font-size:20px;color:{C["lavc"]}">De 9{NB}h à 12{NB}h · dès le 4 janvier</div></div>')
    return (f'<div style="display:flex;align-items:center;gap:12px;padding-bottom:14px">{av("VS", C["lavc"], s=44)}<b style="font-size:21px">{NOM}</b></div>'
            f'{img}{bandeau}')


def p5():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(4, 'lav')
    v = carte(0, 0, 470, post(422), pad='22px 24px 24px', rad=32, rot=-1.5)
    mentions = ''.join(f'<div style="display:flex;align-items:center;gap:12px;height:50px">{coche(32, 9)}<b style="font-size:21px">{t}</b></div>'
                       for t in ('Texte rédigé', 'Photo recadrée', 'Horaires écrits en toutes lettres'))
    leg = (f'{ent("La légende")}<div style="margin-top:10px;font-weight:550;font-size:22px;line-height:1.42">'
           f'Dès le lundi 4 janvier, notre accueil vous reçoit aussi le samedi matin, de 9{NB}h à 12{NB}h. '
           f'Du lundi au vendredi, les horaires ne changent pas.</div>'
           f'<div style="margin-top:18px;padding-top:12px;border-top:2px solid rgba(26,26,26,.07)">{mentions}</div>')
    v += carte(494, 90, 410, leg, pad='26px 28px 20px', rad=30)
    b += mise2(tete('Ce que vous recevez,', 'prêt à partir.',
                    'Le texte, l’image et les infos pratiques,<br>au format de chaque réseau.', 88, C['encre'], C['encre'], C['encre']), v, 640)
    return b


# ---------- 6 · le site ----------
HOR = [('Lundi au vendredi', '9 h à 12 h · 14 h à 17 h', False), ('Samedi', '9 h à 12 h', True), ('Dimanche', 'Fermé', False)]


def p6():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(5, 'lavc')
    barre = (f'<div style="display:flex;align-items:center;gap:10px;padding:0 0 22px">'
             + ''.join(f'<span style="width:14px;height:14px;border-radius:50%;background:{c}"></span>' for c in ('#E9E1FF', '#DDD2FF', '#CDBEFF'))
             + f'<span style="flex:1;margin-left:12px;height:38px;border-radius:19px;background:rgba(26,26,26,.05);display:flex;align-items:center;padding:0 18px;font-weight:550;font-size:18px;color:{GRIS}">{NOM} · Nous contacter</span></div>')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:84px;padding:0 22px;border-radius:18px;{"background:" + C["lavc"] if new else "border-top:2px solid rgba(26,26,26,.06)"}">'
                   f'<b style="flex:1;font-size:24px">{j}</b><span style="font-weight:600;font-size:22px;color:{C["lavt"] if new else GRIS}">{h.replace(" h", NB + "h")}</span>'
                   + (f'<span style="margin-left:6px">{pill("Nouveau", C["lavf"], C["sable"], 38, 17)}</span>' if new else '') + '</div>'
                   for j, h, new in HOR)
    hor = (f'<div style="display:flex;align-items:center;gap:12px">{ico("clock", 28, C["lavt"])}<span class="D" style="font-weight:720;font-size:34px;letter-spacing:-.02em">Horaires d’accueil</span></div>'
           f'<div style="margin-top:18px">{rows}</div>')
    act = (f'<div style="margin-top:26px;display:flex;gap:22px;align-items:center;padding:24px 24px;border-radius:22px;background:rgba(26,26,26,.035)">'
           f'<span style="flex:none;width:92px;height:92px;border-radius:18px;background:{C["lavf"]};display:flex;flex-direction:column;align-items:center;justify-content:center;color:{C["sable"]}">'
           f'<span style="font-weight:700;font-size:16px">Sam.</span><span class="D" style="font-weight:800;font-size:38px;line-height:1">9{NB}h</span></span>'
           f'<div style="flex:1">{ent("Actualité · page d’accueil")}<div style="margin-top:6px;font-weight:700;font-size:25px;line-height:1.25">L’accueil ouvre aussi le samedi matin</div></div></div>')
    v = carte(0, 0, 904, barre + hor + act, pad='26px 34px 30px', rad=38)
    b += mise2(tete('Sur le site,', 'la même info, rangée.',
                    'Les horaires corrigés là où on les cherche,<br>et l’actualité en page d’accueil.', 88, C['encre'], C['lavt']), v, 560)
    return b


# ---------- 7 · vous validez ----------
def p7():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(6, 'lavf')
    lignes = [('Publication', 'Facebook et Instagram'), ('Actualité du site', 'Page d’accueil'), ('Horaires du site', 'Page Contact et pied de page')]
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:106px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:12px;height:12px;border-radius:50%;background:{C["lav"]}"></span>'
                   f'<span style="flex:1"><b style="font-size:24px">{t}</b><br><span style="font-weight:550;font-size:19px;color:{GRIS}">{s}</span></span>'
                   f'{pill("Voir", C["lavc"], C["lavt"], 42, 18)}</div>' for t, s in lignes)
    btn = (f'<div style="display:flex;gap:14px;margin-top:22px">'
           f'<span style="flex:1;display:flex;align-items:center;justify-content:center;gap:10px;height:84px;border-radius:22px;background:{C["lavf"]};color:{C["sable"]};font-weight:700;font-size:25px">{check(C["sable"], 24)}Valider</span>'
           f'<span style="flex:1;display:flex;align-items:center;justify-content:center;height:84px;border-radius:22px;box-shadow:inset 0 0 0 3px {C["lavf"]};color:{C["lavf"]};font-weight:700;font-size:25px">Demander une retouche</span></div>')
    inner = (f'<div style="display:flex;justify-content:space-between;align-items:center">{ent("Nouveaux horaires d’accueil")}{pill("À valider", C["cor"], C["encre"], 44, 19)}</div>'
             f'<div class="D" style="margin:8px 0 14px;font-weight:720;font-size:36px;letter-spacing:-.02em">Trois supports à relire</div>{rows}{btn}')
    v = carte(0, 0, 904, inner, pad='32px 38px 34px', rad=40)
    b += mise2(tete('Vous relisez,', 'puis vous validez.',
                    'Par un lien, sans créer de compte.<br>Une fois validé, tout part à la date prévue.', 88, C['sable'], C['lavc'], 'rgba(248,245,242,.88)'), v, 560)
    return b


def p8():
    return fin(N, 7, MOTIF['lavf'], 'Vous écrivez<br>trois lignes.', 'Nous faisons le reste.', C['lavc'])


PAGES = [(p1, C['lav']), (p2, C['lavc']), (p3, C['lav']), (p4, C['lavc']), (p5, C['lav']), (p6, C['lavc']), (p7, C['lavf']), (p8, C['lavf'])]

TEXTE = """Une information à faire passer, c'est souvent six tâches : rédiger, trouver le visuel, mettre au format, publier sur chaque compte, mettre le site à jour, corriger les horaires partout.

Avec Fill, vous écrivez l'essentiel en trois lignes, comme à un collègue. Pas besoin de texte rédigé ; une photo si vous en avez une, sinon nous proposons un visuel. Le coût en unités s'affiche avant l'envoi.

La demande suit ensuite un fil visible : déposée, confirmée sous 24 h ouvrées, en production, à valider, publiée.

Vous relisez par un lien, sans compte, puis tout part à la date prévue. Pour une commune comme pour une entreprise.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #entreprises #communicationpublique #reseauxsociaux"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'dd-{i + 1:02d}', bg, f(), end=1)
    print('ok')
