"""Constat · « Pendant les fêtes, qui publie à votre place ? » (jeudi 17 décembre 2026, 11 h).
Storytelling : couverture → contexte (deux semaines où tout change, calendrier du 21 déc. au 3 janv.)
→ trois manques (questions sans réponse, site aux horaires habituels, compte silencieux) → sans / avec
→ la réponse (abonnés : préparé avant le départ ; sinon Relais, 690 € par semaine, à partir de deux semaines) → fin.
Famille corail, couverture corail clair, 8 pages fixes. Exemple universel (mairie comme entreprise).
Dates : 25 déc. 2026 et 1er janv. 2027 tombent un vendredi. Rendu : python3 fetes.py ; render.py fe-01..08."""
from kit_dec import *

N = 8
NOM = 'Votre structure'
CT = C['cort']


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Mairies et entreprises", C["encre"], C["sable"], 58, 24)}</div>'
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:196px">'
          f'<div class="D" style="font-weight:700;font-size:100px;line-height:.92;letter-spacing:-.05em">Pendant les fêtes,</div>'
          f'<div class="I" style="font-size:80px;line-height:1.04;letter-spacing:-.02em;color:{CT};margin-top:8px">qui publie à votre place{NB}?</div>'
          f'<div style="margin-top:26px;font-weight:550;font-size:32px;line-height:1.3;color:rgba(26,26,26,.78)">Deux semaines où l’on vous cherche,<br>et où personne ne répond.</div></div>')
    b += cadre('fe-sapin-bureau', M, 590, 904, 510, 'center 45%', 40)
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte : deux semaines où tout change ----------
JOURS = [('Lun.', 21), ('Mar.', 22), ('Mer.', 23), ('Jeu.', 24), ('Ven.', 25), ('Sam.', 26), ('Dim.', 27),
         ('Lun.', 28), ('Mar.', 29), ('Mer.', 30), ('Jeu.', 31), ('Ven.', 1), ('Sam.', 2), ('Dim.', 3)]
MARQ = {25: ('Férié', C['corf'], C['sable']), 1: ('Férié', C['corf'], C['sable']), 24: ('Veille', C['cor'], C['encre']), 31: ('Veille', C['cor'], C['encre'])}


def p2():
    b = fond('corc') + hd(N, 1, 'corc')
    tw, g = 116, 15
    v = ''
    for i, (j, d) in enumerate(JOURS):
        x = (i % 7) * (tw + g); y = (i // 7) * 160
        lab, bg, fg = MARQ.get(d, ('', '#fff', C['encre']))
        v += (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{tw}px;height:144px;border-radius:24px;background:{bg};color:{fg};box-shadow:{OMBRE};'
              f'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px">'
              f'<span style="font-weight:650;font-size:19px;opacity:.75">{j}</span>'
              f'<span class="D" style="font-weight:760;font-size:44px;letter-spacing:-.03em;line-height:1">{d}</span>'
              + (f'<span style="margin-top:4px;font-weight:700;font-size:16px;letter-spacing:.04em;text-transform:uppercase">{lab}</span>' if lab else '') + '</div>')
    v += (f'<div style="position:absolute;left:0;top:{2 * 160 + 6}px;width:904px;display:flex;justify-content:space-between;font-weight:700;font-size:20px;color:{CT}">'
          f'<span>Décembre 2026</span><span>Janvier 2027</span></div>')
    qs = [('Ouvert le samedi 26{NB}?', 'Un client'), ('La collecte est décalée{NB}?', 'Un habitant'), ('Le marché a lieu le 31{NB}?', 'Une visiteuse')]
    for k, (q, who) in enumerate(qs):
        v += (f'<div style="position:absolute;left:{k * 304}px;top:{2 * 160 + 64}px;width:296px;padding:20px 22px;border-radius:24px;background:#fff;box-shadow:{OMBRE}">'
              f'<div style="font-weight:700;font-size:16px;letter-spacing:.06em;text-transform:uppercase;color:{CT}">{who}</div>'
              f'<div style="margin-top:6px;font-weight:650;font-size:23px;line-height:1.25">{q.replace("{NB}", NB)}</div></div>')
    b += mise2(tete('Deux semaines', 'où tout change.',
                    'Jours fériés, horaires réduits, fermetures : c’est le moment<br>où l’on vous cherche le plus, et où l’équipe est en congé.', 88, C['encre'], CT),
               v, 2 * 160 + 64 + 130)
    return b


# ---------- 3 · manque 1 : les questions restent sans réponse ----------
def p3():
    b = fond('cor') + hd(N, 2, 'cor')
    post = (entete_post(NOM, 'Publié le 18 décembre', 'VS', C['corc'])
            + f'<div style="padding:22px 24px;border-radius:18px;background:{C["corc"]}"><div class="D" style="font-weight:740;font-size:34px;letter-spacing:-.03em">Belles fêtes à tous{NB}!</div>'
            f'<div style="margin-top:6px;font-weight:550;font-size:21px;color:rgba(26,26,26,.7)">À très vite en 2027.</div></div>')
    coms = [('Un client', 'Vous êtes ouverts le samedi 26{NB}?', '6 j', 'C'), ('Un habitant', 'L’accueil rouvre quel jour{NB}?', '4 j', 'H'), ('Une visiteuse', 'Où trouver les horaires des fêtes{NB}?', '2 j', 'V')]
    cm = ''.join(f'<div style="display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-top:2px solid rgba(26,26,26,.06)">{av(ini, C["corc"], s=44)}'
                 f'<div style="flex:1"><b style="font-size:19px">{w}</b><span style="font-weight:550;font-size:17px;color:{GRIS}"> · il y a {t}</span>'
                 f'<div style="margin-top:2px;font-weight:550;font-size:22px">{q.replace("{NB}", NB)}</div>'
                 f'<div style="margin-top:6px;font-weight:650;font-size:17px;color:{CT}">Sans réponse</div></div></div>' for w, q, t, ini in coms)
    v = carte(0, 0, 904, post + icones_post() + f'<div style="margin-top:10px">{cm}</div>', pad='26px 34px 14px', rad=38)
    b += mise2(tete('Les questions arrivent,', 'les réponses non.',
                    'Sous le dernier post, on demande les horaires. Personne<br>ne répond : la question reste visible par tous.', 84, C['encre'], C['encre'], C['encre']), v, 700)
    return b


# ---------- 4 · manque 2 : le site affiche les horaires habituels ----------
def p4():
    b = fond('corc') + hd(N, 3, 'corc')
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:76px;border-top:2px solid rgba(26,26,26,.06)">'
                   f'<b style="flex:1;font-size:24px">{j}</b><span style="font-weight:600;font-size:22px;color:{GRIS}">{h}</span></div>'
                   for j, h in (('Lundi au vendredi', f'9{NB}h à 12{NB}h · 14{NB}h à 18{NB}h'), ('Samedi', f'9{NB}h à 12{NB}h'), ('Dimanche', 'Fermé')))
    ouvert = (f'<div style="display:flex;align-items:center;gap:14px;padding:20px 24px;border-radius:20px;background:#E6F4EA">'
              f'<span style="width:16px;height:16px;border-radius:50%;background:#2E8B57"></span><b style="font-size:25px">Ouvert aujourd’hui</b>'
              f'<span style="margin-left:auto;font-weight:600;font-size:21px;color:{GRIS}">Vendredi 25 décembre</span></div>')
    note = (f'<div style="margin-top:20px;display:flex;align-items:center;gap:16px;padding:20px 24px;border-radius:20px;background:{C["corc"]}">'
            f'{croix(40, 12, C["corf"], C["sable"])}<span style="font-weight:650;font-size:23px;line-height:1.3">Faux ce jour-là : c’est férié.<br>Personne n’a mis la page à jour.</span></div>')
    inner = (barre_nav(f'{NOM} · Horaires', ('#FFE0D5', '#FFD3C4', '#FFC2AE'))
             + f'<div style="display:flex;align-items:center;gap:12px;padding-bottom:16px">{ico("clock", 28, CT)}<span class="D" style="font-weight:720;font-size:34px;letter-spacing:-.02em">Horaires d’ouverture</span></div>'
             + ouvert + f'<div style="margin-top:12px">{rows}</div>' + note)
    v = carte(0, 0, 904, inner, pad='26px 34px 30px', rad=38)
    b += mise2(tete('Le site affiche', 'les horaires habituels.',
                    'Sur le site et la fiche en ligne, rien n’a bougé.<br>Le visiteur se déplace, et trouve porte close.', 84, C['encre'], CT), v, 620)
    return b


# ---------- 5 · manque 3 : le compte se tait, puis repart en retard ----------
FRISE = [('18 déc.', 'Belles fêtes à tous !', True), ('', '', False), ('', '', False), ('11 janv.', 'Meilleurs vœux', True)]


def p5():
    b = fond('cor') + hd(N, 4, 'cor')
    v = f'<div style="position:absolute;left:40px;right:40px;top:150px;height:4px;border-radius:2px;background:rgba(26,26,26,.18)"></div>'
    pts = [('18 déc.', 'Dernier post', 'Belles fêtes à tous'), ('11 janv.', 'Post suivant', 'Meilleurs vœux')]
    for k, (d, t, s) in enumerate(pts):
        x = 0 if k == 0 else 904 - 300
        v += (f'<div style="position:absolute;left:{x}px;top:0;width:300px;padding:22px 24px;border-radius:26px;background:#fff;box-shadow:{OMBRE}">'
              f'<div style="font-weight:700;font-size:17px;letter-spacing:.06em;text-transform:uppercase;color:{CT}">{t}</div>'
              f'<div class="D" style="margin-top:4px;font-weight:740;font-size:34px;letter-spacing:-.03em">{d}</div>'
              f'<div style="margin-top:2px;font-weight:550;font-size:20px;color:{GRIS}">{s}</div></div>')
    v += (f'<div style="position:absolute;left:330px;top:108px;width:244px;height:88px;border-radius:44px;background:{C["corf"]};color:{C["sable"]};'
          f'display:grid;place-items:center;text-align:center;font-weight:700;font-size:22px;line-height:1.2">Trois semaines<br>sans nouvelles</div>')
    lst = [('Les annonces des fêtes ne sont pas parues', ''), ('Les vœux arrivent après ceux des autres', ''), ('Il faut tout relancer à la reprise', '')]
    li = ''.join(f'<div style="display:flex;align-items:center;gap:16px;height:84px;border-top:2px solid rgba(26,26,26,.07)">{croix(40, 12, C["corc"], C["corf"])}'
                 f'<span style="font-weight:650;font-size:25px">{t}</span></div>' for t, _ in lst)
    v += carte(0, 260, 904, li, pad='10px 34px 10px', rad=32)
    b += mise2(tete('Le compte se tait,', 'puis repart en retard.',
                    'Faute de temps avant de partir, rien n’est programmé.<br>À la reprise, on rattrape.', 84, C['encre'], C['encre'], C['encre']), v, 540)
    return b


# ---------- 6 · sans / avec ----------
SA = [('Des questions sans réponse', 'Les horaires des fêtes publiés avant le départ'),
      ('Un site aux horaires faux', 'Le site mis à jour, puis remis à l’heure en janvier'),
      ('Un compte silencieux', 'Des publications programmées pendant les congés'),
      ('Des vœux en retard', 'Des vœux prêts pour la reprise')]


def p6():
    b = fond('corc') + hd(N, 5, 'corc')
    cw = 444
    col = lambda titre, bg, fg, items, ok: (
        f'<div style="width:{cw}px;padding:26px 26px 12px;border-radius:32px;background:{bg};color:{fg};box-shadow:{OMBRE};box-sizing:border-box">'
        f'<div class="D" style="font-weight:740;font-size:34px;letter-spacing:-.03em;padding-bottom:12px">{titre}</div>'
        + ''.join(f'<div style="display:flex;align-items:center;gap:14px;min-height:112px;border-top:2px solid {"rgba(248,245,242,.2)" if ok else "rgba(26,26,26,.07)"}">'
                  f'{coche(38, 11, C["sable"], C["corf"]) if ok else croix(38, 11)}<span style="font-weight:650;font-size:23px;line-height:1.28">{t}</span></div>' for t in items) + '</div>')
    v = (f'<div style="display:flex;gap:16px">{col("Sans relais", "#fff", C["encre"], [a for a, _ in SA], False)}'
         f'{col("Avec Fill", C["corf"], C["sable"], [b_ for _, b_ in SA], True)}</div>')
    b += mise2(tete('Ce qu’une com tenue', 'règle pendant les fêtes.',
                    'Les mêmes deux semaines, préparées avant le départ.', 84, C['encre'], CT), v, 640)
    return b


# ---------- 7 · la réponse ----------
def p7():
    b = fond('cor') + hd(N, 6, 'cor')
    c1 = (f'{ent("Vous êtes abonné", CT)}<div class="D" style="margin-top:8px;font-weight:740;font-size:36px;letter-spacing:-.02em">Tout est prêt avant de partir</div>'
          f'<div style="margin-top:10px;font-weight:550;font-size:23px;line-height:1.42;color:rgba(26,26,26,.78)">Horaires, publications et vœux sont validés en décembre<br>et partent aux dates prévues. Les demandes continuent<br>d’être traitées pendant les fêtes.</div>'
          f'<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">{pill("Essentiel 490 € par mois", C["corc"], C["encre"], 46, 20)}{pill("Premier mois sans engagement", C["corc"], C["encre"], 46, 20)}</div>')
    c2 = (f'{ent("Votre chargé de com s’absente", CT)}<div class="D" style="margin-top:8px;font-weight:740;font-size:36px;letter-spacing:-.02em">Relais prend le poste</div>'
          f'<div style="margin-top:10px;font-weight:550;font-size:23px;line-height:1.42;color:rgba(26,26,26,.78)">Site, réseaux et supports courants tenus pendant<br>l’absence, à partir de deux semaines. Opérationnel<br>sous 24{NB}h après votre accord.</div>'
          f'<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">{pill("690 € par semaine", C["corf"], C["sable"], 46, 20)}{pill("20 unités par semaine", C["corc"], C["encre"], 46, 20)}</div>')
    v = carte(0, 0, 904, c1, pad='30px 36px 32px', rad=36) + carte(0, 330, 904, c2, pad='30px 36px 32px', rad=36)
    b += mise2(tete('Deux façons', 'de ne rien laisser filer.',
                    'Selon que vous êtes déjà accompagné ou non.', 88, C['encre'], C['encre'], C['encre']), v, 660)
    return b


def p8():
    return fin(N, 7, '#C3604D', 'Des fêtes<br>sans trou d’air.', 'Écrivez-nous, on regarde ça ensemble.', C['corc'])


PAGES = [(p1, C['corc']), (p2, C['corc']), (p3, C['cor']), (p4, C['corc']), (p5, C['cor']), (p6, C['corc']), (p7, C['cor']), (p8, C['corf'])]

TEXTE = """Entre le 21 décembre et le 3 janvier, tout change : jours fériés, horaires réduits, fermetures. C'est le moment où l'on vous cherche le plus, et où l'équipe est en congé.

Sous le dernier post, les questions sur les horaires restent sans réponse. Le site affiche les horaires habituels un jour férié. Le compte se tait trois semaines, puis les vœux arrivent après ceux des autres.

Une com tenue règle ça avant le départ : horaires des fêtes publiés, site mis à jour, publications programmées, vœux prêts pour la reprise.

Abonné Fill, tout est validé en décembre et part aux dates prévues. Si votre chargé de com s'absente, Relais tient le poste à partir de deux semaines, pour 690 € par semaine.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#communication #collectivites #entreprises #fetesdefinannee #reseauxsociaux"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'fe-{i + 1:02d}', bg, f(), end=1)
    print('ok')
