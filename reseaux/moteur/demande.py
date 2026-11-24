"""Démo · « Une demande en trois lignes » (mardi 8 décembre 2026, 11 h).
Storytelling : une info = six tâches → vous écrivez trois lignes → la demande suit un fil → la publication → le site →
vous validez → même chose pour une entreprise. Famille lavande (pour tous), couverture lavande, pages fixes.
Rendu : python3 demande.py ; render.py dd-01..09."""
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


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lavf"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Comment ça marche", C["encre"], C["sable"], 58, 24)}</div>'
    b += cadre('dm-tel', M, 196, 904, 520, '62% 40%', 40)
    msg = (f'{ent("Votre message")}'
           f'<div style="margin-top:10px;font-weight:600;font-size:25px;line-height:1.36">Repas des aînés, dimanche 24 janvier, 12{NB}h.<br>'
           f'Salle des fêtes. Inscriptions avant le 15.<br>Une photo de l’an dernier jointe.</div>')
    b += carte(M + 40, 560, 620, msg, pad='24px 30px 26px', rad=30)
    b += (f'<div style="position:absolute;left:{M}px;right:240px;top:880px">'
          f'<div class="D" style="font-weight:700;font-size:100px;line-height:.92;letter-spacing:-.05em">Une demande</div>'
          f'<div class="I" style="font-size:84px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">en trois lignes.</div></div>')
    b += (f'<div style="position:absolute;left:{M}px;width:640px;top:1150px;font-weight:550;font-size:30px;line-height:1.3;color:rgba(26,26,26,.78)">'
          f'Ce qui se passe ensuite,<br>jusqu’à la publication.</div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : une info, six tâches ----------
TACHES = ['Rédiger le texte', 'Trouver la bonne photo', 'Mettre au bon format', 'Publier sur chaque compte',
          'Mettre le site à jour', 'Ajouter l’événement à l’agenda']


def p2():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(1, 'lavc')
    w = (904 - 16) // 2
    v = ''
    for i, t in enumerate(TACHES):
        x = (i % 2) * (w + 16); y = (i // 2) * 136
        v += (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:120px;border-radius:30px;background:#fff;box-shadow:{OMBRE};'
              f'display:flex;align-items:center;gap:20px;padding:0 28px">'
              f'<span class="D" style="flex:none;width:58px;height:58px;border-radius:50%;background:{C["lavc"]};color:{C["lavt"]};display:grid;place-items:center;font-weight:760;font-size:28px">{i + 1}</span>'
              f'<span style="font-weight:650;font-size:27px;line-height:1.2">{t}</span></div>')
    v += (f'<div style="position:absolute;left:0;top:{3 * 136 + 14}px;width:904px;padding:26px 32px;border-radius:30px;background:{C["lavf"]};color:{C["sable"]};'
          f'font-weight:650;font-size:28px;line-height:1.3">Pour une seule information,<br>entre deux rendez-vous et l’accueil du public.</div>')
    b += mise(tflow('Une info à passer,', 'six tâches derrière.', 88, C['encre'], C['lavt']), v, 3 * 136 + 14 + 130,
              pied('Avec Fill, il vous en reste une :<br>dire ce qu’il faut savoir.'))
    return b


# ---------- 3 · la demande ----------
SUP = [('Publication', 'Facebook et Instagram', '1'), ('Actualité du site', 'Article illustré', '1'), ('Événement à l’agenda', 'Date, lieu, visuel', '1')]


def p3():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(2, 'lav')
    sujet = (f'{ent("Le sujet")}<div class="D" style="margin-top:8px;font-weight:720;font-size:36px;letter-spacing:-.02em">Repas des aînés</div>'
             f'<div style="margin-top:12px;padding:18px 22px;border-radius:20px;background:rgba(26,26,26,.04);font-weight:550;font-size:23px;line-height:1.42">'
             f'Dimanche 24 janvier, 12{NB}h, salle des fêtes.<br>Inscriptions à l’accueil avant le 15 janvier.<br>Une photo de l’an dernier en pièce jointe.</div>')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:72px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:38px;height:38px;border-radius:10px;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 22)}</span>'
                   f'<span style="flex:1"><b style="font-size:24px">{t}</b><span style="font-weight:550;font-size:19px;color:{GRIS}"> · {s}</span></span>'
                   f'<span style="font-weight:700;font-size:21px;color:{C["lavt"]}">{u}{NB}u.</span></div>' for t, s, u in SUP)
    sup = (f'<div style="margin-top:26px">{ent("Les supports")}</div><div style="margin-top:8px">{rows}</div>'
           f'<div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-radius:20px;background:{C["lavc"]}">'
           f'<b style="font-size:24px">Total, affiché avant l’envoi</b><span class="D" style="font-weight:760;font-size:34px;color:{C["lavt"]}">3 unités</span></div>')
    v = carte(0, 0, 904, sujet + sup, pad='30px 38px 32px', rad=40)
    b += mise(tflow('Vous écrivez l’essentiel,', 'comme à un collègue.', 84, C['encre'], C['encre']), v, 700,
              pied('Pas besoin de texte rédigé ni de visuel :<br>l’information suffit.', C['encre']))
    return b


# ---------- 4 · le fil ----------
FIL = [('Déposée', 'Un mail « Demande reçue » confirme le dépôt', True), ('Confirmée', 'Sous 24 h ouvrées', True),
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
    v = carte(0, 0, 904, f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px">{ent("Repas des aînés")}'
              f'{pill("En production", C["lavc"], C["lavt"], 44, 19)}</div>{rows}', pad='30px 40px 22px', rad=40)
    b += mise(tflow('Votre demande', 'suit un fil, visible.', 88, C['encre'], C['lavt']), v, 660,
              pied('Vous savez où elle en est, sans relancer.<br>Demande courante : 2 jours ouvrés au plus.'))
    return b


# ---------- 5 · la publication ----------
def post(w):
    img = f'<div style="position:relative;height:{round(w * .78)}px;border-radius:18px;overflow:hidden"><img src="{HD}dm-repas.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:30% 50%"></div>'
    bandeau = (f'<div style="margin-top:12px;padding:18px 22px;border-radius:18px;background:{C["lavf"]};color:{C["sable"]}">'
               f'<div class="D" style="font-weight:740;font-size:36px;letter-spacing:-.03em;line-height:1">Repas des aînés</div>'
               f'<div style="margin-top:6px;font-weight:600;font-size:20px;color:{C["lavc"]}">Dim. 24 janvier · 12{NB}h · salle des fêtes</div></div>')
    return (f'<div style="display:flex;align-items:center;gap:12px;padding-bottom:14px">{av("VC", C["lavc"], s=44)}<b style="font-size:21px">Votre collectivité</b></div>'
            f'{img}{bandeau}')


def p5():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(4, 'lav')
    v = carte(0, 0, 470, post(422), pad='22px 24px 24px', rad=32, rot=-1.5)
    leg = (f'{ent("La légende")}<div style="margin-top:10px;font-weight:550;font-size:22px;line-height:1.42">'
           f'Le repas des aînés revient le dimanche 24 janvier à 12{NB}h, à la salle des fêtes. '
           f'Inscriptions à l’accueil de la mairie jusqu’au vendredi 15 janvier.</div>')
    v += carte(500, 60, 404, leg, pad='26px 28px 28px', rad=30)
    v += (f'<div style="position:absolute;left:500px;top:430px;display:flex;flex-direction:column;gap:12px">'
          + ''.join(pill(t, C['sable'], C['lavf'], 54, 22, icon=check(C['lavf'], 22)) for t in ('Texte rédigé', 'Photo recadrée', 'Infos pratiques en texte')) + '</div>')
    b += mise(tflow('Ce que vous recevez,', 'prêt à partir.', 88, C['encre'], C['encre']), v, 700)
    return b


# ---------- 6 · le site ----------
def p6():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(5, 'lavc')
    barre = (f'<div style="display:flex;align-items:center;gap:10px;padding:0 0 22px">'
             + ''.join(f'<span style="width:14px;height:14px;border-radius:50%;background:{c}"></span>' for c in ('#E9E1FF', '#DDD2FF', '#CDBEFF'))
             + f'<span style="flex:1;margin-left:12px;height:38px;border-radius:19px;background:rgba(26,26,26,.05);display:flex;align-items:center;padding:0 18px;font-weight:550;font-size:18px;color:{GRIS}">Votre collectivité · Agenda</span></div>')
    ev = (f'<div style="display:flex;gap:24px;align-items:stretch">'
          f'<div style="flex:none;width:150px;border-radius:24px;background:{C["lavf"]};color:{C["sable"]};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 0">'
          f'<span style="font-weight:700;font-size:20px">Dim.</span><span class="D" style="font-weight:800;font-size:64px;line-height:1">24</span><span style="font-weight:700;font-size:20px">janvier</span></div>'
          f'<div style="flex:1"><div class="D" style="font-weight:720;font-size:40px;letter-spacing:-.025em">Repas des aînés</div>'
          f'<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:10px">'
          + pill('12 h', C['lavc'], C['lavt'], 44, 19, icon=ico('clock', 18, C['lavt']))
          + pill('Salle des fêtes', C['lavc'], C['lavt'], 44, 19, icon=ico('pin', 18, C['lavt'])) + '</div>'
          f'<div style="margin-top:14px;font-weight:550;font-size:21px;line-height:1.4;color:rgba(26,26,26,.7)">Inscriptions à l’accueil de la mairie<br>jusqu’au vendredi 15 janvier.</div></div></div>')
    img = f'<div style="margin-top:24px;height:250px;border-radius:24px;overflow:hidden;position:relative"><img src="{HD}dm-repas.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%"></div>'
    act = (f'<div style="margin-top:22px;display:flex;align-items:center;gap:14px;padding:18px 22px;border-radius:20px;background:{C["lavc"]}">'
           f'{check(C["lavf"], 26)}<b style="font-size:22px">Et l’actualité en page d’accueil, avec le même texte</b></div>')
    v = carte(0, 0, 904, barre + ev + img + act, pad='26px 34px 30px', rad=38)
    b += mise(tflow('Sur le site,', 'la même info, rangée.', 88, C['encre'], C['lavt']), v, 720)
    return b


# ---------- 7 · vous validez ----------
def p7():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(6, 'lavf')
    lignes = [('Publication', 'Facebook et Instagram'), ('Actualité du site', 'Page d’accueil'), ('Événement à l’agenda', 'Fiche complète')]
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:74px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:12px;height:12px;border-radius:50%;background:{C["lav"]}"></span>'
                   f'<span style="flex:1"><b style="font-size:24px">{t}</b><br><span style="font-weight:550;font-size:19px;color:{GRIS}">{s}</span></span>'
                   f'{pill("Voir", C["lavc"], C["lavt"], 42, 18)}</div>' for t, s in lignes)
    btn = (f'<div style="display:flex;gap:14px;margin-top:22px">'
           f'<span style="flex:1;display:flex;align-items:center;justify-content:center;gap:10px;height:76px;border-radius:22px;background:{C["lavf"]};color:{C["sable"]};font-weight:700;font-size:25px">{check(C["sable"], 24)}Valider</span>'
           f'<span style="flex:1;display:flex;align-items:center;justify-content:center;height:76px;border-radius:22px;box-shadow:inset 0 0 0 3px {C["lavf"]};color:{C["lavf"]};font-weight:700;font-size:25px">Demander une retouche</span></div>')
    inner = (f'<div style="display:flex;justify-content:space-between;align-items:center">{ent("Repas des aînés")}{pill("À valider", C["cor"], C["encre"], 44, 19)}</div>'
             f'<div class="D" style="margin:8px 0 14px;font-weight:720;font-size:36px;letter-spacing:-.02em">Trois supports à relire</div>{rows}{btn}')
    v = carte(0, 0, 904, inner, pad='32px 38px 34px', rad=40)
    b += mise(tflow('Vous relisez,', 'puis vous validez.', 88, C['sable'], C['lavc']), v, 560,
              pied('Par un lien, sans créer de compte.<br>Une fois validé, tout part à la date prévue.', C['sable']))
    return b


# ---------- 8 · côté entreprise ----------
def p8():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(7, 'lav')
    msg = (f'{ent("Votre message")}<div style="margin-top:10px;font-weight:600;font-size:24px;line-height:1.42">'
           f'Fermé du 24 au 27 décembre.<br>Réouverture le lundi 28 à 9{NB}h.<br>Commandes de fin d’année jusqu’au 22.</div>')
    v = carte(0, 0, 440, msg, pad='26px 30px 28px', rad=30)
    res = ''.join(f'<div style="display:flex;align-items:center;gap:14px;height:66px;border-top:2px solid rgba(26,26,26,.07)">'
                  f'<span style="flex:none;width:36px;height:36px;border-radius:10px;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 20)}</span>'
                  f'<b style="font-size:23px">{t}</b></div>' for t in ('Publication sur vos comptes', 'Horaires du site mis à jour', 'Bandeau d’accueil du site'))
    v += carte(470, 150, 434, f'{ent("Ce que nous faisons")}<div style="margin-top:8px">{res}</div>', pad='26px 30px 16px', rad=30)
    v += (f'<div style="position:absolute;left:0;top:340px;width:440px;padding:24px 28px;border-radius:28px;background:{C["encre"]};color:{C["sable"]}">'
          f'<div style="font-weight:650;font-size:23px;line-height:1.35">Le même fil, les mêmes unités,<br>la même relecture.</div></div>')
    b += mise(tflow('Côté entreprise,', 'même principe.', 88, C['encre'], C['encre']), v, 500,
              pied('Une fermeture, une offre, un recrutement :<br>trois lignes suffisent aussi.', C['encre']))
    return b


def p9():
    return fin(N, 8, MOTIF['lavf'], 'Vous écrivez<br>trois lignes.', 'Nous faisons le reste.', C['lavc'])


PAGES = [(p1, C['lav']), (p2, C['lavc']), (p3, C['lav']), (p4, C['lavc']), (p5, C['lav']), (p6, C['lavc']), (p7, C['lavf']), (p8, C['lav']), (p9, C['lavf'])]

TEXTE = """Une information à faire passer, c'est souvent six tâches : rédiger, trouver la photo, mettre au format, publier sur chaque compte, mettre le site à jour, remplir l'agenda.

Avec Fill, vous écrivez l'essentiel en trois lignes, comme à un collègue. Vous cochez les supports voulus et le coût en unités s'affiche avant l'envoi.

La demande suit ensuite un fil visible : déposée, confirmée sous 24 h ouvrées, en production, à valider, publiée.

Vous relisez par un lien, sans compte, puis tout part à la date prévue. Pour une commune comme pour une entreprise.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #entreprises #communicationpublique #reseauxsociaux"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'dd-{i + 1:02d}', bg, f(), end=1)
    print('ok')
