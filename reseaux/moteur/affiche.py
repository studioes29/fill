"""Démo · « Une affiche reçue, trois formats publiés » (mardi 22 décembre 2026, 11 h).
Storytelling : couverture → contexte (une affiche A4 n'est pas faite pour un écran : coupée, trop petite, texte prisonnier de l'image)
→ la demande (le fichier tel quel, trois supports, 3 unités) → post carré → story → fiche agenda du site → décompte → fin.
Exemple fictif : concert solidaire d'une chorale, samedi 23 janvier 2027 (un samedi), reçu par une mairie ou une entreprise partenaire.
Famille lavande (pour tous), couverture lavande, 8 pages fixes. Rendu : python3 affiche.py ; render.py af-01..08."""
from kit_dec import *

N = 8
NOM = 'Votre structure'
EV = 'Concert solidaire'
QUAND = f'Samedi 23 janvier · 20{NB}h{NB}30'
OU = 'Salle des fêtes · Entrée libre'


def affiche(w, dense=True):
    """Maquette d'affiche A4 (portrait), texte dans l'image."""
    h = round(w * 1.414)
    s = w / 380
    t = lambda px: round(px * s)
    pet = (f'<div style="margin-top:{t(10)}px;font-weight:550;font-size:{t(9)}px;line-height:1.35;color:rgba(26,26,26,.75)">'
           'Au profit de l’épicerie solidaire de la commune. Avec la participation de l’école de musique et de l’ensemble vocal du canton. '
           'Buvette et petite restauration sur place. Parking gratuit derrière la salle. Renseignements à l’accueil.</div>') if dense else ''
    return (f'<div style="width:{w}px;height:{h}px;border-radius:{t(8)}px;overflow:hidden;background:#FFF7EC;box-shadow:{OMBRE};position:relative">'
            f'<div style="height:{round(h*.42)}px;overflow:hidden"><img src="{HD}af-chorale.jpg" style="width:100%;height:100%;object-fit:cover;object-position:center 40%"></div>'
            f'<div style="padding:{t(16)}px {t(18)}px">'
            f'<div style="font-weight:700;font-size:{t(11)}px;letter-spacing:.12em;text-transform:uppercase;color:{C["cort"]}">La chorale vous invite</div>'
            f'<div class="D" style="margin-top:{t(4)}px;font-weight:780;font-size:{t(40)}px;line-height:.95;letter-spacing:-.04em;color:{C["encre"]}">Concert<br>solidaire</div>'
            f'<div style="margin-top:{t(10)}px;font-weight:700;font-size:{t(15)}px;color:{C["encre"]}">Samedi 23 janvier · 20{NB}h{NB}30</div>'
            f'<div style="font-weight:600;font-size:{t(12)}px;color:rgba(26,26,26,.7)">Salle des fêtes · Entrée libre</div>{pet}</div>'
            f'<div style="position:absolute;left:0;right:0;bottom:0;height:{t(46)}px;background:{C["cort"]};color:#FFF7EC;display:flex;align-items:center;justify-content:space-between;padding:0 {t(18)}px;font-weight:700;font-size:{t(11)}px;letter-spacing:.08em;text-transform:uppercase"><span>Ensemble vocal</span><span>Entrée libre</span></div></div>')


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lavf"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Comment ça marche", C["encre"], C["sable"], 58, 24)}</div>'
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:196px">'
          f'<div class="D" style="font-weight:700;font-size:104px;line-height:.92;letter-spacing:-.05em">Une affiche reçue,</div>'
          f'<div class="I" style="font-size:88px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">trois formats publiés.</div>'
          f'<div style="margin-top:26px;font-weight:550;font-size:32px;line-height:1.3;color:rgba(26,26,26,.78)">Ce que devient le fichier d’une association<br>ou d’un partenaire, une fois envoyé.</div></div>')
    b += cadre('af-panneau', M, 600, 904, 500, 'center 50%', 40)
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : une affiche n'est pas faite pour un écran ----------
def p2():
    b = fond('lavc') + hd(N, 1, 'lavc')
    aw = 380
    v = f'<div style="position:absolute;left:0;top:0">{affiche(aw)}</div>'
    # cadre carré : ce que garde un post carré
    ah = round(aw * 1.414)
    y0 = round((ah - aw) / 2)
    v += f'<div style="position:absolute;left:-6px;top:{y0 - 6}px;width:{aw + 12}px;height:{aw + 12}px;border-radius:14px;box-shadow:inset 0 0 0 6px {C["lavf"]}"></div>'
    pts = [('Coupée en carré', 'Le haut et le bas<br>sont coupés.'), ('Trop petite sur téléphone', 'Les infos pratiques<br>deviennent illisibles.'),
           ('Le texte reste dans l’image', 'Invisible pour la recherche<br>et les lecteurs d’écran.')]
    rows = ''.join(f'<div style="display:flex;gap:16px;align-items:flex-start;padding:22px 0;border-top:{"none" if i == 0 else "2px solid rgba(26,26,26,.07)"}">'
                   f'<span class="D" style="flex:none;width:46px;height:46px;border-radius:50%;background:{C["lavc"]};color:{C["lavt"]};display:grid;place-items:center;font-weight:760;font-size:24px">{i + 1}</span>'
                   f'<div><b style="font-size:25px;line-height:1.2">{t}</b><div style="margin-top:4px;font-weight:550;font-size:21px;line-height:1.35;color:{GRIS}">{s}</div></div></div>'
                   for i, (t, s) in enumerate(pts))
    v += carte(aw + 34, 40, 904 - aw - 34, f'{ent("Publiée telle quelle")}<div style="margin-top:6px">{rows}</div>', pad='26px 28px 10px', rad=32)
    b += mise2(tete('Une affiche A4', 'n’est pas faite pour un écran.',
                    'Elle arrive souvent en PDF, pensée pour un panneau.<br>Posée telle quelle sur les réseaux, elle perd l’essentiel.', 84, C['encre'], C['lavt']), v, ah)
    return b


# ---------- 3 · la demande ----------
SUP = [('Publication', 'Facebook et Instagram', '1'), ('Story', 'Rappel la veille', '1'), ('Événement à l’agenda', 'Site internet', '1')]


def p3():
    b = fond('lav') + hd(N, 2, 'lav')
    pj = (f'<div style="display:flex;align-items:center;gap:16px;margin-top:12px;padding:16px 20px;border-radius:20px;background:rgba(26,26,26,.04)">'
          f'<span style="flex:none;width:54px;height:66px;border-radius:8px;background:{C["cor"]};display:grid;place-items:center;font-weight:800;font-size:15px;color:{C["encre"]}">PDF</span>'
          f'<div><b style="font-size:23px">affiche-concert.pdf</b><div style="font-weight:550;font-size:19px;color:{GRIS}">Reçue de la chorale, format A4</div></div></div>')
    sujet = (f'{ent("Le sujet")}<div class="D" style="margin-top:8px;font-weight:720;font-size:36px;letter-spacing:-.02em">Concert solidaire du 23 janvier</div>{pj}'
             f'<div style="margin-top:12px;font-weight:550;font-size:22px;line-height:1.4">« À relayer, c’est pour l’épicerie solidaire. »</div>')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:72px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'{coche(38)}<span style="flex:1"><b style="font-size:24px">{t}</b><span style="font-weight:550;font-size:19px;color:{GRIS}"> · {s}</span></span>'
                   f'<span style="font-weight:700;font-size:21px;color:{C["lavt"]}">{u}{NB}u.</span></div>' for t, s, u in SUP)
    sup = (f'<div style="margin-top:24px">{ent("Les supports")}</div><div style="margin-top:8px">{rows}</div>'
           f'<div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-radius:20px;background:{C["lavc"]}">'
           f'<b style="font-size:24px">Total, affiché avant l’envoi</b><span class="D" style="font-weight:760;font-size:34px;color:{C["lavt"]}">3 unités</span></div>')
    v = carte(0, 0, 904, sujet + sup, pad='30px 38px 32px', rad=40)
    b += mise2(tete('Vous l’envoyez', 'telle quelle.',
                    'Le fichier reçu et une phrase de contexte suffisent.<br>Vous cochez les formats voulus.', 88, C['encre'], C['encre'], C['encre']), v, 700)
    return b


# ---------- 4 · le post carré ----------
def p4():
    b = fond('lavc') + hd(N, 3, 'lavc')
    img = (f'<div style="position:relative;height:422px;border-radius:18px;overflow:hidden;background:{C["lavf"]}">'
           f'<div style="position:absolute;left:0;right:0;top:0;height:228px"><img src="{HD}af-chorale.jpg" style="width:100%;height:100%;object-fit:cover;object-position:center 40%"></div>'
           f'<div style="position:absolute;left:0;right:0;top:228px;bottom:0;padding:20px 22px;color:{C["sable"]}">'
           f'<div class="D" style="font-weight:760;font-size:44px;letter-spacing:-.035em;line-height:.95">Concert solidaire</div>'
           f'<div style="margin-top:12px;font-weight:650;font-size:22px;color:{C["lavc"]}">Sam. 23 janvier · 20{NB}h{NB}30</div>'
           f'<div style="margin-top:2px;font-weight:600;font-size:20px;color:{C["lavc"]}">Salle des fêtes · Entrée libre</div></div></div>')
    post = entete_post(NOM) + img + icones_post()
    v = carte(0, 0, 470, post, pad='22px 24px 18px', rad=32, rot=-1.5)
    ment = ''.join(f'<div style="display:flex;align-items:center;gap:12px;height:50px">{coche(32, 9)}<b style="font-size:21px">{t}</b></div>'
                   for t in ('Infos lisibles en un coup d’œil', 'Texte de l’affiche en légende', 'Image décrite pour tous'))
    leg = (f'{ent("La légende")}<div style="margin-top:10px;font-weight:550;font-size:22px;line-height:1.42">'
           f'La chorale donne un concert solidaire le samedi 23 janvier à 20{NB}h{NB}30, salle des fêtes. '
           f'Entrée libre, au profit de l’épicerie solidaire.</div>'
           f'<div style="margin-top:18px;padding-top:12px;border-top:2px solid rgba(26,26,26,.07)">{ment}</div>')
    v += carte(494, 80, 410, leg, pad='26px 28px 20px', rad=30)
    b += mise2(tete('Un post carré,', 'recomposé pour le fil.',
                    'La photo, le titre et la date en grand ;<br>le reste de l’affiche passe dans la légende.', 88, C['encre'], C['lavt']), v, 640)
    return b


# ---------- 5 · la story ----------
def p5():
    b = fond('lav') + hd(N, 4, 'lav')
    pw, ph = 330, 640
    bars = ''.join(f'<span style="flex:1;height:4px;border-radius:2px;background:{"#fff" if i == 0 else "rgba(255,255,255,.4)"}"></span>' for i in range(3))
    story = (f'<div style="position:absolute;left:0;top:0;width:{pw}px;height:{ph}px;border-radius:44px;background:{C["encre"]};padding:12px;box-sizing:border-box;box-shadow:{OMBRE}">'
             f'<div style="position:relative;width:100%;height:100%;border-radius:34px;overflow:hidden;background:{C["lavf"]}">'
             f'<div style="position:absolute;left:0;right:0;top:0;height:300px"><img src="{HD}af-chorale.jpg" style="width:100%;height:100%;object-fit:cover;object-position:35% 40%"></div>'
             f'<div style="position:absolute;left:14px;right:14px;top:14px;display:flex;gap:5px">{bars}</div>'
             f'<div style="position:absolute;left:22px;right:22px;top:322px;color:{C["sable"]}">'
             f'{pill("Demain soir", C["sable"], C["lavt"], 36, 16)}'
             f'<div class="D" style="margin-top:14px;font-weight:780;font-size:40px;line-height:.95;letter-spacing:-.04em">Concert<br>solidaire</div>'
             f'<div style="margin-top:12px;font-weight:650;font-size:19px;color:{C["lavc"]}">Samedi · 20{NB}h{NB}30<br>Salle des fêtes</div>'
             f'<div style="margin-top:18px;height:44px;border-radius:22px;background:#fff;color:{C["lavt"]};display:grid;place-items:center;font-weight:700;font-size:17px">Voir l’agenda</div>'
             f'</div></div></div>')
    why = [('Format vertical', 'Plein écran sur téléphone'), ('Un rappel, pas une redite', 'La veille, quand on décide de sortir'),
           ('Un lien vers l’agenda', 'Pour retrouver l’adresse et l’heure')]
    rows = ''.join(f'<div style="padding:20px 0;border-top:{"none" if i == 0 else "2px solid rgba(26,26,26,.07)"}"><div style="display:flex;gap:12px;align-items:center">{coche(32, 9)}'
                   f'<b style="font-size:24px">{t}</b></div><div style="margin:6px 0 0 44px;font-weight:550;font-size:20px;color:{GRIS}">{s}</div></div>' for i, (t, s) in enumerate(why))
    v = story + carte(pw + 40, 110, 904 - pw - 40, rows, pad='16px 30px 12px', rad=32)
    b += mise2(tete('Une story,', 'pour le rappel.',
                    'Publiée la veille, à la date que vous choisissez.', 88, C['encre'], C['encre'], C['encre']), v, ph)
    return b


# ---------- 6 · la fiche agenda du site ----------
def p6():
    b = fond('lavc') + hd(N, 5, 'lavc')
    menu = (f'<div style="display:flex;align-items:center;gap:26px;padding-bottom:18px;border-bottom:2px solid rgba(26,26,26,.06)">'
            f'<b class="D" style="font-size:24px;letter-spacing:-.02em">{NOM}</b>'
            + ''.join(f'<span style="font-weight:{700 if m == "Agenda" else 550};font-size:19px;color:{C["lavt"] if m == "Agenda" else GRIS}">{m}</span>' for m in ('Actualités', 'Agenda', 'Contact'))
            + '</div>')
    fiche = (f'<div style="display:flex;gap:24px;margin-top:24px">'
             f'<div style="flex:none;width:300px;height:300px;border-radius:20px;overflow:hidden"><img src="{HD}af-chorale.jpg" style="width:100%;height:100%;object-fit:cover;object-position:center 40%"></div>'
             f'<div style="flex:1">{pill("Concert", C["lavc"], C["lavt"], 38, 17)}'
             f'<div class="D" style="margin-top:12px;font-weight:740;font-size:38px;line-height:1;letter-spacing:-.03em">Concert solidaire<br>de la chorale</div>'
             + ''.join(f'<div style="margin-top:14px;display:flex;gap:12px;align-items:center;font-weight:600;font-size:21px">{ico(i, 24, C["lavt"])}{t}</div>'
                       for i, t in (('clock', f'Samedi 23 janvier, 20{NB}h{NB}30'), ('pin', 'Salle des fêtes'), ('heart', 'Entrée libre')))
             + '</div></div>')
    txt = (f'<div style="margin-top:22px;font-weight:550;font-size:21px;line-height:1.45;color:rgba(26,26,26,.78)">Au profit de l’épicerie solidaire, avec l’école de musique et l’ensemble vocal du canton. '
           f'Buvette sur place, parking derrière la salle.</div>'
           f'<div style="margin-top:20px;display:flex;gap:12px">'
           f'<span style="display:flex;align-items:center;gap:10px;height:56px;padding:0 24px;border-radius:16px;background:{C["lavf"]};color:{C["sable"]};font-weight:700;font-size:20px">Ajouter à mon agenda</span>'
           f'<span style="display:flex;align-items:center;height:56px;padding:0 24px;border-radius:16px;box-shadow:inset 0 0 0 3px {C["lavf"]};color:{C["lavf"]};font-weight:700;font-size:20px">Affiche en PDF</span></div>')
    v = carte(0, 0, 904, barre_nav(f'{NOM} · Agenda') + menu + fiche + txt, pad='26px 34px 32px', rad=38)
    b += mise2(tete('Une fiche agenda', 'sur le site.',
                    'Tout le texte de l’affiche, cette fois en vrai texte :<br>on le trouve en cherchant « concert » ou « 23 janvier ».', 88, C['encre'], C['lavt']), v, 700)
    return b


# ---------- 7 · le décompte ----------
def p7():
    b = fond('lavf') + hd(N, 6, 'lavf')
    fmts = [('Post carré', 'Facebook et Instagram'), ('Story', 'La veille'), ('Fiche agenda', 'Site internet')]
    tiles = ''.join(f'<div style="flex:1;padding:26px 24px;border-radius:28px;background:{C["lavc"]}">'
                    f'<span class="D" style="display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:{C["lavf"]};color:{C["sable"]};font-weight:760;font-size:28px">1</span>'
                    f'<div class="D" style="margin-top:16px;font-weight:730;font-size:30px;letter-spacing:-.02em">{t}</div>'
                    f'<div style="margin-top:4px;font-weight:550;font-size:20px;color:{GRIS}">{s}</div></div>' for t, s in fmts)
    cases = ''.join(f'<span style="width:44px;height:44px;border-radius:12px;background:{C["lavf"] if i < 3 else "rgba(26,26,26,.07)"}"></span>' for i in range(15))
    inner = (f'{ent("Une affiche reçue")}<div class="D" style="margin:8px 0 20px;font-weight:720;font-size:36px;letter-spacing:-.02em">Trois formats, trois unités</div>'
             f'<div style="display:flex;gap:14px">{tiles}</div>'
             f'<div style="margin-top:28px;padding-top:22px;border-top:2px solid rgba(26,26,26,.07)">{ent("Sur une formule Essentiel (15 unités par mois)")}'
             f'<div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:10px">{cases}</div>'
             f'<div style="margin-top:14px;font-weight:600;font-size:22px;color:{GRIS}">Il en reste 12 pour le reste du mois.</div></div>')
    v = carte(0, 0, 904, inner, pad='32px 38px 34px', rad=40)
    b += mise2(tete('Vous relisez,', 'tout part à la date prévue.',
                    'Un lien pour valider les trois formats d’un coup.<br>Le coût est connu avant l’envoi.', 84, C['sable'], C['lavc'], 'rgba(248,245,242,.88)'), v, 640)
    return b


def p8():
    return fin(N, 7, MOTIF['lavf'], 'Une affiche reçue,<br>trois formats.', 'Écrivez-nous, on regarde ça ensemble.', C['lavc'])


PAGES = [(p1, C['lav']), (p2, C['lavc']), (p3, C['lav']), (p4, C['lavc']), (p5, C['lav']), (p6, C['lavc']), (p7, C['lavf']), (p8, C['lavf'])]

TEXTE = """Une association, un club ou un partenaire vous envoie son affiche. Elle est en A4, pensée pour un panneau.

Posée telle quelle sur les réseaux, elle est coupée en carré, trop petite sur téléphone, et son texte reste prisonnier de l'image.

Avec Fill, vous transmettez le fichier tel quel et vous cochez les formats. Il en ressort un post carré recomposé, avec le texte de l'affiche en légende ; une story de rappel la veille ; une fiche agenda complète sur votre site.

Trois formats, trois unités, et une seule validation par lien. Pour une commune comme pour une entreprise.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #entreprises #associations #reseauxsociaux"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'af-{i + 1:02d}', bg, f(), end=1)
    print('ok')
