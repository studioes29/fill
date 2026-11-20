import lgen as G
from lgen import (C, MOTIF, NB, A, CNT, OFF, DASH, PH, SH, logo, motif, head, check, arrow, poster, pubcard, newsletter,
                 pile, badge, fbcard, form, proof, table, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, page, NT)


def win(s, d, inner):
    return f'<div data-a="win" data-s="{s}" data-d="{d}" style="position:absolute;inset:0">{inner}</div>'


def ttl(a, b, col=C['encre'], icol=None, size=100):
    icol = icol or col
    return f'<div class="ttl" style="color:{col};font-size:{size}px">{a}<span class="I" style="color:{icol}">{b}</span></div>'


# ---------- Constat animé (fusion des pages 2 et 3) ----------
def constat():
    b = head(8, 1, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.2)')
    b += win(0, 3.7, ttl('Les demandes', 's’empilent.', C['sable'], C['lav']))
    b += win(3.7, 99, ttl('Et la page Facebook', 'dort.', C['sable'], C['lav']))
    b += f'<div {A("dim", 3.4, 0.6)} style="position:absolute;inset:0">{pile(True)}</div>'
    times = NT + [3.75, 3.9, 4.05, 4.2]
    b += (f'<div style="position:absolute;left:860px;top:420px;display:flex;align-items:center;justify-content:center;width:96px;height:96px;border-radius:50%;background:#E5484D;'
          f'font-weight:750;font-size:40px;color:#fff;box-shadow:0 20px 40px -18px rgba(229,72,77,.7)"><span data-a="steps" data-times="{",".join(map(str, times))}">12</span></div>')
    b += fbcard(230, 560, 620, -3, 'old', A('pop', 3.8, 0.7, -3))
    return b


# ---------- Pour qui ----------
def pourqui():
    b = motif(MOTIF['lavc'], 1500, 420, -200)
    b += head(*(DASH[0] or (8, 2)), logo(44, C['encre'], C['lavf'], C['cor']), C['lavf'], 'rgba(26,26,26,.14)')
    b += ttl('Pour les collectivités', 'et les entreprises.', C['encre'], C['lavt'], 84)
    cards = [('mairie', 'Façade d’une mairie', 'Collectivités', 'Pas de service com, ou une seule personne pour tout.', -4, 60, '30% center'),
             ('bureau', 'Personne seule à son bureau', 'Services communication', 'Débordés, ou absents le temps d’un congé.', 0, 395, 'center'),
             ('atelier', 'Artisan dans son atelier', 'Entreprises', 'Pas envie de recruter à temps plein.', 4, 730, 'center')]
    for k, alt, lab, txt, r, x, pos in cards:
        b += (f'<div class="card" style="left:{x}px;top:{470 if r == 0 else 500}px;width:300px;height:640px;padding:14px;transform:rotate({r}deg);display:flex;flex-direction:column;gap:20px">'
              f'<div class="ph" style="height:330px;border-radius:24px"><img src="{PH[k]}" alt="{alt}" style="object-position:{pos}"></div>'
              f'<div style="padding:0 14px;display:flex;flex-direction:column;gap:12px"><span style="font-weight:650;font-size:21px;color:{C["lavt"]}">{lab}</span>'
              f'<span class="D" style="font-weight:650;font-size:32px;line-height:1.05;letter-spacing:-.025em">{txt}</span></div></div>')
    b += f'<div class="sub" style="top:1200px;font-size:28px;font-weight:600">Mêmes formules et mêmes prix, pour une collectivité comme pour une entreprise.</div>'
    return b


# ---------- Fill prend le relais (logo + périmètre) ----------
PILLS = [('Réseaux sociaux', 80, 480, -6), ('Site internet', 740, 470, 5), ('Communiqués', 50, 700, -7),
         ('Reportages photo', 720, 720, 7), ('Affiches', 170, 880, 4), ('Lettres d’information', 580, 890, -4)]


def relais(anim=True):
    b = motif(MOTIF['encre'], 1600, 400, -150)
    b += head(*(DASH[0] or (8, 3)), logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.2)')
    b += f'<div {A("up", 0, 0.6) if anim else ""}>{ttl("Fill prend", "le relais.", C["sable"], C["lav"])}</div>'
    b += f'<div style="position:absolute;left:0;right:0;top:600px;display:flex;justify-content:center">{logo(210, C["sable"], C["lav"], C["cor"], draw=0.4 if anim else None)}</div>'
    for i, (t, x, y, r) in enumerate(PILLS):
        b += (f'<span {A("pop", 1.9 + i * 0.18, 0.5, r) if anim else ""} style="position:absolute;left:{x}px;top:{y}px;transform:rotate({r}deg);display:inline-flex;align-items:center;height:74px;padding:0 30px;border-radius:999px;'
              f'background:{C["lavc"] if i % 2 == 0 else C["blanc"]};font-weight:650;font-size:27px;color:{C["encre"]};white-space:nowrap;box-shadow:0 30px 50px -25px rgba(0,0,0,.6)">{t}</span>')
    b += (f'<div class="sub" {A("up", 3.2, 0.6) if anim else ""} style="top:1030px;font-size:38px;font-weight:600;line-height:1.28;color:{C["sable"]}">Un service de communication externalisé, '
          f'<span style="color:{C["lav"]}">par abonnement</span>. Un prix fixe chaque mois, un espace en ligne pour suivre chaque demande.</div>')
    return b


# ---------- Le parcours, en une seule page animée ----------
STEPS = ['Demande', 'Production', 'Validation', 'Publication']
PH_T = [(0, 7.6), (7.6, 5.0), (12.6, 5.0), (17.6, 99)]


def tracker():
    out = '<div style="position:absolute;left:88px;right:88px;top:398px;display:flex;gap:10px">'
    for i, (n, (s, d)) in enumerate(zip(STEPS, PH_T)):
        out += (f'<span style="position:relative;flex:1;display:flex;align-items:center;justify-content:center;height:52px;border-radius:999px;box-shadow:inset 0 0 0 2px rgba(26,26,26,.16);font-weight:650;font-size:21px;color:rgba(26,26,26,.55)">{i+1} · {n}'
                f'<span data-a="win" data-s="{s}" data-d="{d}" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:999px;background:{C["lavf"]};color:{C["sable"]}">{i+1} · {n}</span></span>')
    return out + '</div>'


def parcours():
    b = motif(MOTIF['lavc'], 1500, -380, 300, -6)
    b += head(*(DASH[0] or (8, 3)), logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    titles = [('Vous demandez,', 'en trois lignes.'), ('Fill produit', 'tous les supports.'), ('Vous validez,', 'par un simple lien.'), ('Fill publie', 'à l’heure prévue.')]
    for (a, bb), (s, d) in zip(titles, PH_T):
        b += win(s, d, ttl(a, bb, C['encre'], C['lavt'], 92))
    b += tracker()
    # phase 1 : la demande
    OFF[0] = 0
    ph1 = form(True, 100, 490, 880)
    ph1 += f'<div {A("tap", 4.65, 0.7)} style="position:absolute;left:830px;top:1145px;width:120px;height:120px;border-radius:50%;background:{C["lav"]};opacity:0"></div>'
    ph1 += (f'<div {A("pop", 5.0, 0.5, -3)} style="position:absolute;left:250px;top:1215px;display:inline-flex;align-items:center;gap:12px;height:72px;padding:0 28px 0 12px;border-radius:999px;background:{C["encre"]};color:{C["sable"]};font-weight:650;font-size:24px;box-shadow:{SH}">'
            f'<span style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:50%;background:{C["lav"]}">{check(C["encre"], 26)}</span>Reçu, confirmé sous 24 h ouvrées</div>')
    b += win(PH_T[0][0], PH_T[0][1], ph1)
    # phase 2 : la production
    OFF[0] = PH_T[1][0] - 0.6
    ph2 = pubcard(70, 500, 380, -4, A('pop', 0.9, 0.6, -4))
    ph2 += (f'<div class="card" {A("pop", 1.4, 0.6, 4)} style="left:600px;top:490px;width:390px;padding:18px;transform:rotate(4deg);display:flex;flex-direction:column;gap:14px">'
            f'{poster(354, 400, 54)}<span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">Affiche · 4 unités</span></span></div>')
    ph2 += (f'<div class="card" {A("pop", 1.9, 0.6, 2)} style="left:60px;top:1020px;width:480px;padding:18px;transform:rotate(2deg);display:flex;flex-direction:column;gap:12px">'
            f'<div style="display:flex;gap:16px"><div class="ph" style="flex:none;width:150px;height:110px;border-radius:12px"><img src="{PH["marche"]}"></div>'
            f'<div style="display:flex;flex-direction:column;gap:6px"><span style="font-weight:700;font-size:15px;color:{C["lavt"]}">ACTUALITÉ DU SITE</span><span class="D" style="font-weight:650;font-size:25px;line-height:1.05;letter-spacing:-.02em">Le marché de Noël, samedi 12 décembre</span></div></div>'
            f'<span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">Actualité · 1 unité</span></span></div>')
    ph2 += newsletter(580, 1010, 420, -3, A('pop', 2.4, 0.6, -3), photo=False)
    b += win(PH_T[1][0], PH_T[1][1], ph2)
    # phase 3 : la validation
    OFF[0] = PH_T[2][0] - 0.3
    ph3 = f'<div {A("left", 0.4, 0.7, -5)} style="position:absolute;left:90px;top:500px;transform:rotate(-5deg);box-shadow:0 60px 110px -40px rgba(26,26,26,.5);border-radius:28px">{poster(440, 640, 72, rad=28)}</div>'
    ph3 += f'<div {A("right", 0.6, 0.7)} style="position:absolute;inset:0">{proof(True, 510, 640, 3)}</div>'
    ph3 += f'<div {A("tap", 1.95, 0.7)} style="position:absolute;left:685px;top:917px;width:130px;height:130px;border-radius:50%;background:{C["lavf"]};opacity:0"></div>'
    b += win(PH_T[2][0], PH_T[2][1], ph3)
    # phase 4 : la publication
    OFF[0] = PH_T[3][0] - 0.3
    ph4 = f'<div {A("up", 0.4, 0.7)} style="position:absolute;inset:0">{fbcard(90, 490, 560, -3, "new", True)}</div>'
    pills = [('Publié sur vos canaux', 1.4), ('Fichiers d’impression livrés', 1.8)]
    for i, (t, s) in enumerate(pills):
        r = [3, -2, 2][i]
        ph4 += (f'<div {A("pop", s, 0.5, r)} style="position:absolute;left:{560 - i*30}px;top:{780 + i*150}px;transform:rotate({r}deg);display:inline-flex;align-items:center;gap:16px;height:96px;padding:0 34px 0 18px;border-radius:999px;background:{C["blanc"] if i < 2 else C["encre"]};box-shadow:{SH};font-weight:650;font-size:27px;white-space:nowrap;color:{C["encre"] if i < 2 else C["sable"]}">'
                f'<span style="display:flex;align-items:center;justify-content:center;width:62px;height:62px;border-radius:50%;background:{C["lavf"] if i < 2 else C["lav"]}">{check(C["sable"] if i < 2 else C["encre"], 30)}</span>{t}</div>')
    b += win(PH_T[3][0], PH_T[3][1], ph4)
    OFF[0] = 0
    return b


# ---------- Catalogue (maquettes de livrables) ----------
def _post():
    return (f'<div style="position:absolute;inset:0;background:#fff;display:flex;flex-direction:column">'
            f'<div style="display:flex;align-items:center;gap:8px;padding:9px 12px"><span style="width:24px;height:24px;border-radius:50%;background:{C["lavc"]}"></span><span style="font-weight:650;font-size:13px">votre.structure</span></div>'
            f'<div class="ph" style="flex:1;background:{C["lavf"]}"><img src="{PH["atelier"]}" style="width:55%;left:45%;object-position:center"><span style="position:absolute;left:12px;top:14px;width:46%;font-family:\'Bricolage Grotesque\';font-weight:700;font-size:23px;line-height:.95;letter-spacing:-.03em;color:{C["sable"]}">Portes ouvertes</span>'
            f'<span style="position:absolute;left:12px;bottom:12px;padding:4px 10px;border-radius:99px;background:{C["lav"]};font-weight:650;font-size:12px">Samedi, 10 h</span></div></div>')


def _site():
    return (f'<div style="position:absolute;inset:0;background:#fff;display:flex;flex-direction:column">'
            f'<div style="display:flex;gap:5px;align-items:center;height:22px;padding:0 10px;background:{C["gris"]}">' + ''.join(f'<span style="width:7px;height:7px;border-radius:50%;background:rgba(26,26,26,.25)"></span>' for _ in range(3)) +
            f'<span style="margin-left:8px;flex:1;height:10px;border-radius:5px;background:#fff"></span></div>'
            f'<div style="display:flex;gap:10px;padding:10px">'
            f'<div class="ph" style="flex:none;width:105px;height:130px;border-radius:8px"><img src="{PH["mairie"]}" style="object-position:30% center"></div>'
            f'<div style="flex:1;display:flex;flex-direction:column;gap:6px"><span style="font-weight:650;font-size:10px;color:{C["lavt"]}">Actualité</span><span style="font-family:\'Bricolage Grotesque\';font-weight:650;font-size:17px;line-height:1;letter-spacing:-.02em">Nouveaux horaires de l’accueil</span>'
            + ''.join(f'<span style="height:6px;width:{w}%;border-radius:3px;background:rgba(26,26,26,.12)"></span>' for w in (100, 90, 96, 70)) + '</div></div></div>')


def _affiche():
    return (f'<div style="position:absolute;inset:0;background:{C["sable"]};display:flex;align-items:center;justify-content:center">'
            f'<div class="ph" style="width:132px;height:186px;border-radius:6px;transform:rotate(-3deg);box-shadow:0 18px 30px -16px rgba(0,0,0,.5);background:{C["lavf"]};display:flex;flex-direction:column;justify-content:flex-end;padding:10px">'
            f'<img src="{PH["lecture"]}" style="height:62%;object-position:center 35%">'
            f'<span style="position:relative;font-family:\'Bricolage Grotesque\';font-weight:700;font-size:20px;line-height:.92;letter-spacing:-.03em;color:{C["sable"]}">Rencontre<br>d’auteurs</span>'
            f'<span style="position:relative;margin-top:5px;font-weight:600;font-size:9px;color:{C["lavc"]}">Vendredi, 18 h · Médiathèque</span></div></div>')


def _lettre():
    return (f'<div style="position:absolute;inset:0;background:{C["gris"]};display:flex;justify-content:center;padding-top:14px">'
            f'<div style="width:200px;background:#fff;border-radius:8px 8px 0 0;display:flex;flex-direction:column;gap:7px;padding:10px">'
            f'<div style="height:26px;border-radius:5px;background:{C["lavf"]};display:flex;align-items:center;padding:0 8px;font-weight:650;font-size:10px;color:{C["sable"]}">La lettre du mois</div>'
            f'<span style="font-family:\'Bricolage Grotesque\';font-weight:650;font-size:15px;line-height:1">Ce qui change ce mois-ci</span>'
            f'<div class="ph" style="height:56px;border-radius:5px"><img src="{PH["bureau"]}" style="object-position:center 30%"></div>'
            + ''.join(f'<span style="height:5px;width:{w}%;border-radius:3px;background:rgba(26,26,26,.12)"></span>' for w in (100, 85)) +
            f'<span style="align-self:flex-start;padding:4px 10px;border-radius:99px;background:{C["encre"]};color:{C["sable"]};font-weight:650;font-size:9px">Lire la suite</span></div></div>')


def _flyer():
    def side(rot, x, y, recto):
        if recto:
            inner = (f'<img src="{PH["atelier"]}" style="height:55%;object-position:center">'
                     f'<span style="position:absolute;left:9px;right:9px;bottom:30px;font-family:\'Bricolage Grotesque\';font-weight:700;font-size:16px;line-height:.95;color:{C["encre"]}">Ateliers<br>d’initiation</span>'
                     f'<span style="position:absolute;left:9px;bottom:12px;font-weight:600;font-size:8px;color:{C["lavt"]}">Inscriptions ouvertes</span>')
            bg = C['lav']
        else:
            inner = (f'<div style="position:absolute;inset:10px;display:flex;flex-direction:column;gap:6px"><span style="font-weight:700;font-size:10px">Au programme</span>'
                     + ''.join(f'<span style="display:flex;gap:5px;align-items:center"><span style="width:6px;height:6px;border-radius:50%;background:{C["lavf"]}"></span><span style="height:5px;width:{w}px;border-radius:3px;background:rgba(26,26,26,.15)"></span></span>' for w in (70, 60, 74, 52, 66)) +
                     f'<span style="margin-top:4px;height:20px;border-radius:4px;background:{C["lavc"]}"></span></div>')
            bg = '#fff'
        return (f'<div class="ph" style="position:absolute;left:{x}px;top:{y}px;width:104px;height:148px;border-radius:5px;transform:rotate({rot}deg);background:{bg};box-shadow:0 16px 26px -14px rgba(0,0,0,.5)">{inner}</div>')
    return f'<div style="position:absolute;inset:0;background:{C["sable"]}">{side(8, 140, 30, False)}{side(-6, 34, 22, True)}</div>'


def _photo():
    return (f'<div class="ph" style="position:absolute;inset:0"><img src="{PH["photographe"]}" style="object-position:center 30%">'
            f'<div style="position:absolute;right:10px;bottom:10px;display:flex;gap:4px">'
            + ''.join(f'<span class="ph" style="width:34px;height:26px;border-radius:3px;box-shadow:0 0 0 2px #fff"><img src="{PH[k]}"></span>' for k in ('lecture', 'atelier', 'bureau')) + '</div></div>')


CAT = [(_post, 'Publication', '1 unité'), (_site, 'Actualité du site', '1 unité'), (_affiche, 'Affiche', '4 unités'),
       (_lettre, 'Lettre d’information', '3 unités'), (_flyer, 'Flyer', '3 unités'), (_photo, 'Reportage photo', '13 unités')]


def catalogue():
    b = motif(MOTIF['lavc'], 1500, 420, -200)
    b += head(*(DASH[0] or (9, 4)), logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += ttl('Tout ce qui fait vivre', 'votre communication.', C['encre'], C['lavt'], 84)
    for i, (fn, n, u) in enumerate(CAT):
        col, row = i % 3, i // 3
        r = [-2, 1.5, -1, 1.5, -1.5, 2][i]
        b += (f'<div class="card" style="left:{70 + col*318}px;top:{420 + row*350}px;width:300px;padding:14px;transform:rotate({r}deg);display:flex;flex-direction:column;gap:14px">'
              f'<div class="ph" style="height:200px;border-radius:22px;box-shadow:inset 0 0 0 2px rgba(26,26,26,.06)">{fn()}</div>'
              f'<div style="padding:0 8px 6px;display:flex;flex-direction:column;gap:10px"><span class="D" style="font-weight:650;font-size:29px;line-height:1;letter-spacing:-.025em">{n}</span>'
              f'<span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">{u}</span></span></div></div>')
    b += (f'<div class="sub" style="top:1145px;font-size:27px;font-weight:600;line-height:1.38">Et aussi : réseaux sociaux, site internet, presse, rédaction, petits formats, campagnes, édition, photo et vidéo, impression…</div>')
    return b


# ---------- Un mois en Régulier (animé) ----------
MOIS = [('13', 'publications', 13), ('6', 'actualités sur le site', 6), ('4', 'événements à l’agenda', 4), ('1', 'affiche', 4),
        ('1', 'flyer', 3), ('1', 'lettre d’information', 3), ('1', 'communiqué de presse', 2)]
MT = [1.0 + i * 0.75 for i in range(7)]


def mois(anim=True):
    b = motif(MOTIF['lavc'], 1500, -380, 300, -6)
    b += head(*(DASH[0] or (9, 7)), logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += f'<div {A("up", 0, 0.6) if anim else ""}>{ttl("Un mois en Régulier,", "par exemple.", C["encre"], C["lavt"], 92)}</div>'
    rows, segs = '', ''
    times, vals, tot = [], [], 0
    for i, (q, lab, u) in enumerate(MOIS):
        s = MT[i]
        tot += u; times.append(s + 0.3); vals.append(str(tot))
        rows += (f'<div {A("left", s, 0.5) if anim else ""} style="display:flex;align-items:center;justify-content:space-between;height:80px;border-bottom:2px solid rgba(26,26,26,.07)">'
                 f'<span style="font-weight:600;font-size:30px"><b class="D" style="font-weight:700;font-size:35px;margin-right:12px">{q}</b>{lab}</span>'
                 f'<span class="tag" style="height:46px;font-size:23px;background:{C["lavc"]};color:{C["lavt"]}">{u}{NB}u.</span></div>')
        segs += (f'<span {A("grow", s + 0.15, 0.5) if anim else ""} style="display:block;flex:none;width:{u/35*100:.3f}%;height:100%;background:{[C["lavf"], C["lav"]][i % 2]};transform-origin:left center;box-shadow:inset -3px 0 0 #fff"></span>')
    cum = (f'<span data-a="cum" data-s="0" data-times="{",".join(map(str, times))}" data-vals="{",".join(vals)}" data-base="0">35</span>' if anim else '35')
    b += (f'<div class="card" {A("up", 0.4, 0.7) if anim else ""} style="left:70px;right:70px;top:440px;padding:16px 40px 38px">{rows}'
          f'<div style="margin-top:30px"><span class="D" style="font-weight:700;font-size:62px;letter-spacing:-.04em">{cum}<span style="font-size:36px;color:rgba(26,26,26,.45)"> / 35 unités</span></span></div>'
          f'<div style="margin-top:16px;display:flex;height:30px;border-radius:15px;overflow:hidden;background:{C["lavc"]}">{segs}</div></div>')
    return b


# ---------- Offre de lancement (story) ----------
def offre():
    b = motif('rgba(184,164,255,.07)', 1700, 330, -200)
    metal = ('linear-gradient(125deg,#F6F4FA 0%,#CEC7DE 17%,#FBFAFD 33%,#B7AECD 50%,#ECE8F3 66%,#C3BBD7 83%,#F3F1F7 100%)')
    eng = 'color:#2B2541;text-shadow:0 1px 0 rgba(255,255,255,.75),0 -1px 0 rgba(43,37,65,.18)'
    from chrome import chrome
    b += chrome(170, 130, 740, 435, 14, -16, -5, 160)
    b += (f'<div style="position:absolute;left:88px;right:88px;top:700px;text-align:center">'
          f'<div class="I" style="font-size:42px;color:{C["lav"]}">Offre de lancement</div>'
          f'<div class="D" style="margin-top:14px;font-weight:650;font-size:80px;line-height:.98;letter-spacing:-.04em;color:{C["sable"]}">Des unités offertes<br>en plus de votre formule</div></div>')
    rows = [('Essentiel', '15', '8'), ('Régulier', '35', '18'), ('Soutenu', '75', '38')]
    cells = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;padding:24px 10px;border-radius:30px;background:rgba(248,245,242,.07);box-shadow:inset 0 0 0 2px rgba(248,245,242,.12)">'
                    f'<span style="font-weight:600;font-size:26px;color:rgba(248,245,242,.75)">{n}</span>'
                    f'<span class="D" style="font-weight:700;font-size:56px;letter-spacing:-.04em;color:{C["sable"]}">{q} <span style="color:{C["lav"]}">+{x}</span></span>'
                    f'<span style="font-weight:600;font-size:21px;color:rgba(248,245,242,.6)">unités le premier mois</span></div>' for n, q, x in rows)
    b += f'<div style="position:absolute;left:88px;right:88px;top:965px;display:flex;gap:18px;text-align:center">{cells}</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:1185px;text-align:center;font-weight:500;font-size:26px;line-height:1.4;color:rgba(248,245,242,.7)">'
          f'Pour tout abonnement activé avant le 30 novembre.<br>Premier mois sans engagement.</div>')
    return b


# ---------- Couverture (piste B) ----------
def cover(story=False, arrowless=False):
    import cover as CV
    oy = 0
    b = CV.coverB()
    b = b.replace('top:800px;width:780px', f'top:{740+oy}px;width:780px').replace('top:960px;width:760px', f'top:{900+oy}px;width:760px')
    if story:
        import re as _re
        b = _re.sub(r'^<svg viewBox="500 0 610 720" width="\d+" height="2300" style="position:absolute;left:120px;top:-420px', '<svg viewBox="500 0 610 720" width="2627" height="3100" style="position:absolute;left:120px;top:-560px', b)
        b = b.replace('left:88px;top:88px', f'left:88px;top:{88+oy}px').replace('right:88px;top:92px', f'right:88px;top:{92+oy}px').replace('right:60px;top:250px', f'right:60px;top:{250+oy}px')
        b = b[:b.index('<div style="position:absolute;left:88px;right:88px;bottom:84px')]
    return b


# ---------- Le fil : un seul fil qui traverse tout le carrousel ----------
YB = 1300   # hauteur de passage d'une page à l'autre
EPF = 6     # épaisseur du fil


def _frame(T, xl=50, xr=1030, wave=16):
    return (f'M-30 {YB} C{xl-20} {YB} {xl} {YB-30} {xl} {YB-80} L{xl} {T+70} C{xl} {T+25} {xl+25} {T} {xl+80} {T} '
            f'C350 {T-wave} 700 {T+wave} {xr-80} {T} C{xr-25} {T} {xr} {T+25} {xr} {T+70} L{xr} {YB-80} C{xr} {YB-30} {xr+20} {YB} 1110 {YB}')


def fil_d(kind, T=None):
    if kind == 'cover':   # sort de la queue du logo, longe le haut puis la marge droite
        return (f'M190 133 C330 152 560 196 760 196 C900 196 1030 210 1030 330 L1030 {YB-80} C1030 {YB-30} 1050 {YB} 1110 {YB}')
    if kind == 'fin':     # entre en bas à gauche, remonte et devient le logo
        return (f'M-30 {YB} C30 {YB} 50 {YB-30} 50 {YB-80} L50 590 C50 535 75 512 140 508 C300 500 440 520 503 441')
    return f'M-30 {YB} C240 {YB-26} 470 {YB+22} 720 {YB-6} S960 {YB-18} 1110 {YB}'


def fil(kind, T=None, col=None, anim=False, s=0.0, d=1.6):
    col = col or C['lav']
    a = f' pathLength="1" stroke-dasharray="1" data-a="draw" data-s="{s}" data-d="{d}"' if anim else ''
    return (f'<svg viewBox="0 0 1080 1350" width="1080" height="1350" style="position:absolute;left:0;top:0;overflow:visible">'
            f'<path d="{fil_d(kind, T)}" fill="none" stroke="{col}" stroke-width="{EPF}" stroke-opacity=".6" stroke-linecap="round" stroke-linejoin="round"{a}/></svg>')


def avecfil(fn, kind, T=None, col=None, anim=False):
    return fn
    def w(*a, **k):
        b = fn(*a, **k)
        f = fil(kind, T, col, anim)
        if b.startswith('<svg'):
            i = b.index('</svg>') + 6
            return b[:i] + f + b[i:]
        return f + b
    return w


# ---------- Les formules (fond lavande foncé) ----------
def formules(anim=True):
    b = motif(MOTIF['lavf'], 1300, 620, 700)
    b += head(*(DASH[0] or (9, 6)), logo(44, C['sable'], C['lav'], C['cor']), C['lav'], 'rgba(248,245,242,.24)')
    b += f'<div class="ttl" style="color:{C["sable"]}" {A("up",0,0.6) if anim else ""}>Trois formules,<span class="I" style="color:{C["lavc"]}">un prix fixe par mois.</span></div>'
    b += f'<div {A("up",0.4,0.7) if anim else ""} style="position:absolute;inset:0">{G.table(560)}</div>'
    return b


def withdash(fn, n, act, *a, **k):
    DASH[0] = (n, act)
    try:
        return fn(*a, **k)
    finally:
        DASH[0] = None


if __name__ == '__main__':
    N = 9
    F = lambda fn, T=None, col=None, an=False, kind='frame': avecfil(fn, kind, T, col, an)
    TT = dict(constat=425, relais=420, parcours=422, catalogue=385, pourqui=410, formules=465, mois=405, p2=425, p3=440, p5=415, p6=452, p7=400, p8=420)
    IG = [('ig1', C['encre'], F(cover, kind='cover'), 1),
          ('ig2', C['encre'], F(constat, TT['constat'], an=True), 5.0),
          ('ig3', C['encre'], lambda: withdash(F(relais, TT['relais'], an=True), N, 2), 4.6),
          ('ig4', C['lavc'], lambda: withdash(F(parcours, TT['parcours'], C['lavf'], True), N, 3), 21.8),
          ('ig5', C['lavc'], lambda: withdash(F(catalogue, TT['catalogue'], C['lavf']), N, 4), 1),
          ('ig6', C['lav'], lambda: withdash(F(pourqui, TT['pourqui'], C['lavf']), N, 5), 1),
          ('ig7', C['lavf'], lambda: withdash(F(formules, TT['formules'], C['lavc']), N, 6), 1),
          ('ig8', C['lavc'], lambda: withdash(F(mois, TT['mois'], C['lavf'], True), N, 7), 6.5),
          ('ig9', C['lavf'], lambda: withdash(F(p10, kind='fin'), N, 8), 1)]
    for n, bg, f, e in IG:
        page(n, bg, f(), end=e)
    LI = [(C['encre'], F(cover, kind='cover')), (C['encre'], F(p2, TT['p2'])), (C['encre'], F(p3, TT['p3'])), (C['encre'], F(relais, TT['relais'])),
          (C['sable'], F(p5, TT['p5'], C['lavf'])), (C['lavc'], F(p6, TT['p6'], C['lavf'])), (C['lav'], F(p7, TT['p7'], C['lavf'])), (C['lavc'], F(p8, TT['p8'], C['lavf'])),
          (C['lavc'], F(catalogue, TT['catalogue'], C['lavf'])), (C['lav'], F(pourqui, TT['pourqui'], C['lavf'])), (C['lavf'], F(formules, TT['formules'], C['lavc'])),
          (C['lavc'], F(lambda: mois(False), TT['mois'], C['lavf'])), (C['lavf'], F(p10, kind='fin'))]
    for i, (bg, f) in enumerate(LI):
        page(f'li{i+1:02d}', bg, withdash(f, 13, i), end=30)
    G.STORY = True
    ST = [('st01', C['encre'], F(lambda: cover(story=True), kind='cover'), 1), ('st02', C['encre'], F(constat, TT['constat'], an=True), 5.0),
          ('st03', C['encre'], F(relais, TT['relais'], an=True), 4.6), ('st04', C['lavc'], F(parcours, TT['parcours'], C['lavf'], True), 21.8),
          ('st05', C['lavc'], F(catalogue, TT['catalogue'], C['lavf']), 1), ('st06', C['lav'], F(pourqui, TT['pourqui'], C['lavf']), 1),
          ('st07', C['lavf'], F(formules, TT['formules'], C['lavc']), 1), ('st08', C['lavc'], F(mois, TT['mois'], C['lavf'], True), 6.5),
          ('st09', C['encre'], offre, 1), ('st10', C['lavf'], F(p10, kind='fin'), 1)]
    for n, bg, f, e in ST:
        G.story(n, bg, f(), e)
    print('ok')
