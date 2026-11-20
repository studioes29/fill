import importlib.util
import lgen as G
from lgen import C, MOTIF, NB, PH, SH, logo, motif, head, check, arrow, page

N = 11
HD = '/home/claude/photos_hd/'
for k in ['marche-stands','marche-noel','mairie-nuit','parade-noel','atelier-couronnes','atelier-ceramique','panneau-ferme','vitrine-noel','rue-village','village-lumieres','ville-nuit']:
    PH[k] = f'file://{HD}{k}.jpg'
PH.update({'marche': PH['marche-stands'], 'atelier': PH['atelier-couronnes'], 'lecture': PH['parade-noel'],
           'photographe': PH['marche-noel'], 'mairie': PH['mairie-nuit'], 'bureau': PH['ville-nuit']})
F_D = "font-family:'Bricolage Grotesque'"


def mot(col):
    return motif(col, 2300, 120, -420)


def tagc(t, bg, fg, h=46, fs=22):
    return f'<span class="tag" style="height:{h}px;font-size:{fs}px;padding:0 20px;background:{bg};color:{fg}">{t}</span>'


def img(k, pos='center'):
    return f'<img src="{PH[k]}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{pos}">'


# ---------- icônes ----------
def ico(name, s=26, col='#1A1A1A'):
    p = {
        'heart': '<path d="M12 20s-7-4.4-9.2-8.6C1.3 8.5 3 5 6.4 5c2 0 3.2 1.1 3.9 2.2h3.4C14.4 6.1 15.6 5 17.6 5 21 5 22.7 8.5 21.2 11.4 19 15.6 12 20 12 20z"/>',
        'com': '<path d="M20 12a8 8 0 1 1-3.3-6.5L21 4l-1 4.5A8 8 0 0 1 20 12z"/>',
        'send': '<path d="M21 3 3 10l7 3 3 7z"/><path d="M10 13 21 3"/>',
        'save': '<path d="M6 3h12v18l-6-4-6 4z"/>',
        'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        'mail': '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
        'pin': '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
        'cam': '<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8.5 7 10 4.5h4L15.5 7"/>',
    }[name]
    return f'<svg viewBox="0 0 24 24" width="{s}" height="{s}" fill="none" stroke="{col}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">{p}</svg>'


# ---------- maquettes ----------
def phone(x, y, w, rot, screen, h=None, z=1):
    h = h or round(w * 2.05)
    r = round(w * .15)
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;transform:rotate({rot}deg);z-index:{z};border-radius:{r}px;background:#141414;padding:{round(w*.035)}px;'
            f'box-shadow:0 0 0 2px #2b2b2b,0 60px 110px -50px rgba(20,10,50,.65),inset 0 0 0 2px #333">'
            f'<div style="position:relative;width:100%;height:100%;border-radius:{r - round(w*.03)}px;overflow:hidden;background:#fff">{screen}'
            f'<div style="position:absolute;left:50%;top:{round(w*.03)}px;transform:translateX(-50%);width:{round(w*.3)}px;height:{round(w*.075)}px;border-radius:999px;background:#141414"></div></div></div>')


def ig_screen(w, user, av, visual, caption, cap_fs=None):
    fs = cap_fs or round(w * .052)
    return (f'<div style="position:absolute;inset:0;display:flex;flex-direction:column">'
            f'<div style="height:{round(w*.16)}px"></div>'
            f'<div style="display:flex;align-items:center;gap:{round(w*.03)}px;padding:0 {round(w*.04)}px {round(w*.03)}px">'
            f'<span style="width:{round(w*.1)}px;height:{round(w*.1)}px;border-radius:50%;background:{av};box-shadow:0 0 0 2px #fff,0 0 0 4px {av}"></span>'
            f'<span style="font-weight:700;font-size:{round(w*.05)}px">{user}</span></div>'
            f'<div style="position:relative;width:100%;aspect-ratio:4/5;overflow:hidden">{visual}</div>'
            f'<div style="display:flex;gap:{round(w*.045)}px;padding:{round(w*.035)}px {round(w*.04)}px">{ico("heart", round(w*.075))}{ico("com", round(w*.075))}{ico("send", round(w*.075))}<span style="flex:1"></span>{ico("save", round(w*.075))}</div>'
            f'<div style="padding:0 {round(w*.04)}px;font-size:{fs}px;line-height:1.35;color:#1A1A1A"><b>{user}</b> {caption}</div></div>')


def affiche(k, bg, titre, sous, w, h, pos='center', fs=None, tc=None):
    fs = fs or round(w * .14)
    return (f'<div style="position:absolute;inset:0;background:{bg};overflow:hidden">'
            f'<div style="position:absolute;left:0;right:0;top:0;height:62%">{img(k, pos)}</div>'
            f'<div style="position:absolute;left:0;right:0;top:40%;height:24%;background:linear-gradient(180deg,rgba(0,0,0,0),{bg})"></div>'
            f'<div style="position:absolute;left:{round(w*.07)}px;right:{round(w*.07)}px;bottom:{round(h*.07)}px">'
            f'<div style="{F_D};font-weight:750;font-size:{fs}px;line-height:.9;letter-spacing:-.035em;color:{tc or C["sable"]}">{titre}</div>'
            f'<div style="margin-top:{round(h*.025)}px;font-weight:650;font-size:{round(fs*.36)}px;color:{tc or C["sable"]};opacity:.85">{sous}</div></div></div>')



def cible(x, y, kind, w=None):
    bg, fg, t = (C['lavf'], C['sable'], 'Exemple · collectivité') if kind == 'c' else (C['cor'], C['encre'], 'Exemple · entreprise')
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;display:flex;align-items:center;gap:10px;height:48px;padding:0 22px;border-radius:999px;background:{bg};color:{fg};'
            f'font-weight:650;font-size:21px;z-index:5">{t}</div>')


JOURS_S = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']


def semaine(nums, hl, dark=False, hbg=None, hfg=None, off=()):
    hbg = hbg or C['lavf']; hfg = hfg or C['sable']
    base = C['sable'] if dark else C['encre']
    cw, g = 118, 13
    out = ''
    for i, n in enumerate(nums):
        x = 88 + i * (cw + g)
        if i == hl:
            out += (f'<div style="position:absolute;left:{x}px;top:176px;width:{cw}px;height:128px;border-radius:30px;background:{hbg};color:{hfg};'
                    f'display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 26px 50px -28px rgba(20,8,50,.75)">'
                    f'<span style="font-weight:650;font-size:20px;opacity:.85">{JOURS_S[i]}</span>'
                    f'<span style="{F_D};font-weight:800;font-size:60px;line-height:1;letter-spacing:-.05em">{n}</span>'
                    f'<span style="font-weight:650;font-size:18px;opacity:.85">déc.</span></div>')
        else:
            op = .22 if i in off else .5
            out += (f'<div style="position:absolute;left:{x}px;top:188px;width:{cw}px;height:104px;border-radius:26px;'
                    f'background:{"rgba(248,245,242,.06)" if dark else "rgba(255,255,255,.45)"};display:flex;flex-direction:column;align-items:center;justify-content:center;color:{base}">'
                    f'<span style="font-weight:600;font-size:18px;opacity:{op}">{JOURS_S[i]}</span>'
                    f'<span style="{F_D};font-weight:700;font-size:40px;line-height:1.05;letter-spacing:-.04em;opacity:{op}">{n}</span></div>')
    return out


def entete(n, t1, t2, nums, hl, dark=False, hbg=None, hfg=None, off=(), lg=None):
    tc, ic = (C['sable'], C['lav']) if dark else (C['encre'], C['lavt'])
    b = head(N, n, lg or logo(44, C['sable'] if dark else C['encre']), C['lav'] if dark else C['lavf'], 'rgba(248,245,242,.22)' if dark else 'rgba(26,26,26,.14)')
    b += semaine(nums, hl, dark, hbg, hfg, off)
    b += f'<div class="ttl" style="top:350px;color:{tc};font-size:64px">{t1}<span class="I" style="color:{ic}">{t2}</span></div>'
    return b


def avatar(kind, s=44):
    bg, fg, t = (C['lavf'], C['sable'], 'C') if kind == 'c' else (C['cor'], C['encre'], 'E')
    return f'<span style="flex:none;width:{s}px;height:{s}px;border-radius:50%;background:{bg};color:{fg};display:grid;place-items:center;{F_D};font-weight:750;font-size:{round(s*.45)}px">{t}</span>'


def post(x, y, w, rot, kind, ph, pos, over, cap, z=1, vis=None, dots=0):
    user = 'Votre collectivité' if kind == 'c' else 'Votre entreprise'
    visual = vis or (img(ph, pos) + '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,10,40,0) 45%,rgba(20,10,40,.78))"></div>'
                     + f'<div style="position:absolute;left:24px;right:24px;bottom:22px;{F_D};font-weight:700;font-size:{round(w*.092)}px;line-height:.95;letter-spacing:-.03em;color:{C["sable"]}">{over}</div>')
    dd = ''
    if dots:
        dd = ('<div style="position:absolute;left:0;right:0;bottom:-26px;display:flex;justify-content:center;gap:6px">'
              + ''.join(f'<span style="width:8px;height:8px;border-radius:50%;background:{C["lavf"] if i == 0 else "rgba(26,26,26,.2)"}"></span>' for i in range(dots)) + '</div>')
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg);z-index:{z};border-radius:28px;background:#fff;overflow:hidden;'
            f'box-shadow:0 60px 100px -50px rgba(20,8,50,.75)">'
            f'<div style="display:flex;align-items:center;gap:14px;padding:18px 20px">{avatar(kind, 46)}<div><div style="font-weight:700;font-size:20px">{user}</div>'
            f'<div style="font-weight:500;font-size:15px;color:rgba(26,26,26,.5)">Il y a 2 h</div></div></div>'
            f'<div style="position:relative;width:100%;aspect-ratio:1/1;overflow:visible"><div style="position:absolute;inset:0;overflow:hidden">{visual}</div>{dd}</div>'
            f'<div style="display:flex;gap:18px;padding:{38 if dots else 18}px 20px 10px">{ico("heart", 28)}{ico("com", 28)}{ico("send", 28)}<span style="flex:1"></span>{ico("save", 28)}</div>'
            f'<div style="padding:0 20px 22px;font-weight:500;font-size:19px;line-height:1.38;color:{C["encre"]}"><b>{user}</b> {cap}</div></div>')


def story(x, y, w, h, rot, kind, ph, pos, titre, lab, jour, sous, accent, z=1):
    user = 'Votre collectivité' if kind == 'c' else 'Votre entreprise'
    sc = (f'<div style="position:absolute;inset:0">{img(ph, pos)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,8,30,.6),rgba(15,8,30,.15) 42%,rgba(15,8,30,.7))"></div>'
          f'<div style="position:absolute;left:16px;right:16px;top:44px;display:flex;gap:5px">' + ''.join(f'<span style="flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,{.95 if i == 0 else .4})"></span>' for i in range(3)) + '</div>'
          f'<div style="position:absolute;left:18px;top:62px;display:flex;align-items:center;gap:10px">{avatar(kind, 36)}<span style="font-weight:650;font-size:17px;color:#fff">{user}</span></div>'
          f'<div style="position:absolute;left:28px;right:28px;top:126px;{F_D};font-weight:750;font-size:46px;line-height:.95;letter-spacing:-.03em;color:#fff">{titre}</div>'
          f'<div style="position:absolute;left:28px;right:28px;bottom:64px;border-radius:26px;background:#fff;padding:22px 24px;box-shadow:0 20px 40px -20px rgba(0,0,0,.6)">'
          f'<div style="font-weight:700;font-size:17px;letter-spacing:.08em;text-transform:uppercase;color:{accent}">{lab}</div>'
          f'<div style="display:flex;align-items:baseline;gap:10px;margin-top:6px"><span style="{F_D};font-weight:800;font-size:76px;line-height:1;letter-spacing:-.05em;color:{C["encre"]}">{jour}</span>'
          f'<span style="font-weight:650;font-size:24px;color:{C["encre"]}">déc.</span></div>'
          f'<div style="margin-top:4px;font-weight:500;font-size:19px;color:rgba(26,26,26,.6)">{sous}</div>'
          f'<div style="margin-top:16px;height:52px;border-radius:14px;background:{accent};display:grid;place-items:center;font-weight:700;font-size:19px;color:#fff">Me le rappeler</div></div></div>')
    return phone(x, y, w, rot, sc, h=h, z=z)


# ---------- 1 · couverture ----------
JOURS = {1: ('Programme', 'marche-stands'), 8: ('Dates limites', None), 12: ('Événement', 'atelier-couronnes'), 14: ('Horaires', 'panneau-ferme'),
         17: ('Vœux', None), 22: ('Rétro', 'parade-noel'), 24: ('Fêtes', 'village-lumieres')}
TBG = {8: C['cor'], 17: C['lavf']}


def avent(top, cell=134, gap=20):
    out = ''
    for i in range(24):
        d = i + 1
        x = 88 + (i % 6) * (cell + gap); y = top + (i // 6) * (cell + gap)
        if d in JOURS:
            lab, ph = JOURS[d]
            bg = TBG.get(d, C['encre'])
            inner = (img(ph) + '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,10,40,.15),rgba(20,10,40,.7))"></div>') if ph else ''
            fg = C['encre'] if bg == C['cor'] and not ph else C['sable']
            out += (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{cell}px;height:{cell}px;border-radius:24px;overflow:hidden;background:{bg};box-shadow:0 22px 40px -24px rgba(20,10,50,.7)">{inner}'
                    f'<span style="position:absolute;left:16px;top:12px;{F_D};font-weight:800;font-size:48px;letter-spacing:-.04em;line-height:1;color:{fg}">{d}</span>'
                    f'<span style="position:absolute;left:16px;bottom:14px;font-weight:650;font-size:17px;color:{fg}">{lab}</span></div>')
        else:
            out += (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{cell}px;height:{cell}px;border-radius:24px;background:rgba(255,255,255,.5);box-shadow:inset 0 0 0 2px rgba(255,255,255,.85)">'
                    f'<span style="position:absolute;left:16px;top:12px;{F_D};font-weight:700;font-size:40px;letter-spacing:-.04em;line-height:1;color:rgba(91,63,156,.32)">{d}</span></div>')
    return out


def p1():
    b = mot(MOTIF['lavc'])
    b += (f'<div style="position:absolute;left:88px;top:88px">{logo(56)}</div>'
          f'<div style="position:absolute;right:88px;top:90px">{tagc("Guide du mois", C["lavf"], C["sable"], 52, 24)}</div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:196px"><div class="D" style="font-weight:650;font-size:136px;line-height:.9;letter-spacing:-.05em">La com</div>'
          f'<div class="I" style="font-size:112px;line-height:1.02;letter-spacing:-.02em;color:{C["lavt"]};margin-top:4px">de décembre.</div></div>')
    b += avent(500)
    b += (f'<div style="position:absolute;left:88px;right:88px;bottom:88px;height:104px;display:flex;align-items:center;justify-content:space-between">'
          f'<span style="font-weight:600;font-size:27px;line-height:1.35;color:rgba(26,26,26,.7)">Les rendez-vous à ne pas manquer<br>pour une collectivité ou une entreprise</span>'
          f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["encre"]}">{arrow(C["sable"], 42)}</span></div>')
    return b


# ---------- 2 · sommaire ----------
def p2():
    b = mot(MOTIF['lavf'])
    b += head(N, 1, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.24)')
    b += f'<div class="ttl" style="color:{C["sable"]};font-size:92px">Décembre en<span class="I" style="color:{C["lavc"]}">8 rendez-vous.</span></div>'
    items = [('1', 'déc.', 'Le programme des fêtes', C['sable'], 'marche-stands'), ('8', 'déc.', 'Les dates limites', C['cor'], None), ('12', 'déc.', 'L’événement du mois', C['encre'], 'atelier-couronnes'),
             ('14', 'déc.', 'Les horaires des fêtes', C['lav'], 'panneau-ferme'), ('17', 'déc.', 'Les vœux se préparent', C['sable'], None), ('22', 'déc.', 'L’année en images', C['cor'], 'parade-noel'),
             ('24', 'déc.', 'Avant de partir', C['lav'], None), ('1', 'janv.', 'Les vœux, programmés', C['encre'], None)]
    for i, (d, m, t, bg, ph) in enumerate(items):
        x = 88 + (i % 2) * 460; y = 470 + (i // 2) * 202
        fg = C['sable'] if (bg == C['encre'] or ph) else C['encre']
        inner = (img(ph) + '<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(20,10,40,.8),rgba(20,10,40,.25))"></div>') if ph else ''
        b += (f'<div style="position:absolute;left:{x}px;top:{y}px;width:444px;height:186px;border-radius:30px;overflow:hidden;background:{bg};box-shadow:0 30px 60px -36px rgba(20,8,50,.7)">{inner}'
              f'<div style="position:absolute;left:28px;top:20px;display:flex;align-items:baseline;gap:8px;color:{fg}"><span style="{F_D};font-weight:800;font-size:84px;letter-spacing:-.05em;line-height:1">{d}</span><span style="font-weight:650;font-size:24px">{m}</span></div>'
              f'<div style="position:absolute;left:28px;right:24px;bottom:22px;{F_D};font-weight:650;font-size:30px;letter-spacing:-.02em;color:{fg}">{t}</div></div>')
    return b


# ---------- 3 · programme ----------
W1 = [30, 1, 2, 3, 4, 5, 6]; W2 = list(range(7, 14)); W3 = list(range(14, 21)); W4 = list(range(21, 28))
PY = 545


def p3():
    b = mot(MOTIF['lavc'])
    b += entete(2, 'Annoncer le', 'programme des fêtes.', W1, 1, off=(0,))
    b += post(88, PY, 440, -1.5, 'c', 'marche-noel', 'center 40%', 'Le programme<br>des fêtes', 'Marché de Noël, illuminations, spectacle des écoles : tout le programme est en ligne.')
    b += post(552, PY, 440, 1.5, 'e', 'vitrine-noel', 'center', 'Horaires et<br>idées cadeaux', 'Décembre est là ! Horaires, idées cadeaux et dates de commande sont sur notre site.')
    return b


# ---------- 4 · dates limites ----------
def p4():
    b = mot(MOTIF['lavc'])
    b += entete(3, 'Rappeler', 'les dates limites.', W2, 1, hbg=C['cor'], hfg=C['encre'])
    b += story(108, PY, 370, 717, -2, 'c', 'mairie-nuit', 'center', 'Colis<br>des aînés', 'Inscriptions', '11', 'Jusqu’au vendredi, en mairie', C['lavf'])
    b += story(602, PY, 370, 717, 2, 'e', 'marche-stands', 'center', 'Commandes<br>de Noël', 'Livré avant Noël', '18', 'Commandez avant vendredi', C['corf'])
    return b


# ---------- 5 · événement ----------
COLS = [88 + 105 + i * 231 for i in range(4)]  # centres des 4 colonnes


def p5():
    b = mot('rgba(184,164,255,.08)')
    b += entete(4, 'L’événement', 'avant, pendant, après.', W2, 5, dark=True, hbg=C['lav'], hfg=C['encre'])
    c0, c1, c2, c3 = COLS
    # J-10 : affiche
    b += (f'<div style="position:absolute;left:{c0 - 100}px;top:620px;width:200px;height:280px;transform:rotate(-3deg);border-radius:12px;overflow:hidden;box-shadow:0 50px 80px -30px rgba(0,0,0,.8)">'
          + affiche('atelier-ceramique', C['cor'], 'Portes<br>ouvertes', 'Samedi 12, 10 h à 17 h', 200, 280, tc=C['encre']) + '</div>')
    # J-3 : story
    sc = (f'<div style="position:absolute;inset:0">{img("atelier-couronnes")}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,0) 30%,rgba(0,0,0,.55))"></div>'
          f'<div style="position:absolute;left:12px;right:12px;top:38px;display:flex;gap:4px">' + ''.join(f'<span style="flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,{.95 if i==0 else .4})"></span>' for i in range(3)) + '</div>'
          f'<div style="position:absolute;left:14px;right:14px;bottom:22px;padding:12px;border-radius:14px;background:#fff;{F_D};font-weight:700;font-size:20px;line-height:1;text-align:center">Dans 3 jours</div></div>')
    b += phone(c1 - 90, 580, 180, 2, sc, h=360)
    # Jour J : bulles
    for k, dx, dy, sz in [('marche-stands', -95, 0, 130), ('parade-noel', -10, 125, 110), ('marche-noel', -100, 230, 100)]:
        b += (f'<div style="position:absolute;left:{c2 + dx}px;top:{600 + dy}px;width:{sz}px;height:{sz}px;border-radius:50%;padding:5px;background:conic-gradient({C["cor"]},{C["lav"]},{C["lavf"]},{C["cor"]})">'
              f'<div style="position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;box-shadow:0 0 0 5px {C["encre"]}">{img(k)}</div></div>')
    # J+1 : album
    grid = ''.join(f'<div style="position:relative;overflow:hidden;border-radius:8px">{img(k)}</div>' for k in ('atelier-ceramique', 'atelier-couronnes', 'marche-noel', 'parade-noel'))
    b += (f'<div style="position:absolute;left:{c3 - 100}px;top:630px;width:200px;height:250px;transform:rotate(3deg);padding:10px;border-radius:18px;background:#fff;'
          f'display:grid;grid-template-columns:1fr 1fr;gap:6px;box-shadow:0 50px 80px -30px rgba(0,0,0,.8)">{grid}</div>')
    # frise
    b += f'<div style="position:absolute;left:{c0}px;right:{1080 - c3}px;top:1048px;height:4px;border-radius:2px;background:rgba(248,245,242,.2)"></div>'
    for (lab, txt), x in zip([('J-10', 'L’affiche et la publication'), ('J-3', 'Le rappel en story'), ('Jour J', 'Des stories sur place'), ('J+1', 'L’album et les mercis')], COLS):
        b += (f'<div style="position:absolute;left:{x - 105}px;top:1030px;width:210px;display:flex;flex-direction:column;align-items:center;gap:14px">'
              f'<span style="width:40px;height:40px;border-radius:50%;background:{C["lav"]};box-shadow:0 0 0 8px rgba(184,164,255,.25)"></span>'
              f'<span style="{F_D};font-weight:750;font-size:36px;color:{C["sable"]}">{lab}</span>'
              f'<span style="text-align:center;font-weight:500;font-size:23px;line-height:1.3;color:rgba(248,245,242,.7)">{txt}</span></div>')
    return b


# ---------- 6 · horaires ----------
def p6():
    b = mot(MOTIF['lavc'])
    b += entete(5, 'Annoncer', 'les horaires des fêtes.', W3, 0)
    # collectivité : fiche Google sur téléphone
    rows = ''.join(f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:13px 0;border-top:1.5px solid rgba(26,26,26,.08)">'
                   f'<span style="font-weight:550;font-size:19px;color:rgba(26,26,26,.65)">{a}</span><span style="font-weight:700;font-size:19px;color:{c}">{h}</span></div>'
                   for a, h, c in [('Lun. au ven.', '9 h à 12 h', C['encre']), ('Jeudi 24', 'Fermé à 12 h', C['cort']), ('Vendredi 25', 'Fermé', C['cort']), ('Jeudi 31', 'Fermé à 12 h', C['cort'])])
    sc = (f'<div style="position:absolute;inset:0;background:#fff">'
          f'<div style="position:relative;height:250px">{img("mairie-nuit", "center 40%")}</div>'
          f'<div style="padding:22px 24px 0">'
          f'<div style="{F_D};font-weight:700;font-size:30px;letter-spacing:-.02em">Mairie</div>'
          f'<div style="margin-top:4px;font-weight:500;font-size:17px;color:rgba(26,26,26,.55)">Service public · Place de la mairie</div>'
          f'<div style="margin-top:16px;display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:999px;background:{C["lavc"]};color:{C["lavt"]};font-weight:700;font-size:16px">{ico("clock", 16, C["lavt"])}Horaires des fêtes</div>'
          f'<div style="margin-top:12px">{rows}</div></div></div>')
    b += phone(98, PY, 380, -2, sc, h=717)
    # entreprise : affichette sur la vitrine
    tape = lambda l, t, r: f'<span style="position:absolute;left:{l}px;top:{t}px;width:96px;height:30px;transform:rotate({r}deg);background:rgba(248,245,242,.75);box-shadow:0 2px 6px rgba(0,0,0,.15)"></span>'
    b += (f'<div style="position:absolute;left:552px;top:{PY}px;width:440px;height:717px;transform:rotate(1.5deg);border-radius:32px;overflow:hidden;box-shadow:0 60px 100px -50px rgba(20,8,50,.75)">'
          f'{img("vitrine-noel", "62% center")}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,8,30,.25),rgba(15,8,30,.55))"></div>'
          f'<div style="position:absolute;left:62px;top:150px;width:316px;transform:rotate(-3deg);background:{C["sable"]};padding:34px 30px 30px;box-shadow:0 30px 50px -24px rgba(0,0,0,.7)">'
          + tape(110, -14, -4) +
          f'<div style="{F_D};font-weight:750;font-size:40px;line-height:.95;letter-spacing:-.03em">Horaires<br><span style="color:{C["corf"]}">des fêtes</span></div>'
          + ''.join(f'<div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1.5px solid rgba(26,26,26,.12);font-weight:600;font-size:20px"><span>{a}</span><span style="color:{c}">{h}</span></div>'
                    for a, h, c in [('Mer. 23', '9 h à 19 h', C['encre']), ('Du 24 au 27', 'Fermé', C['corf']), ('Lundi 28', '9 h à 19 h', C['encre'])])
          + f'<div style="margin-top:18px;font-weight:600;font-size:20px;color:rgba(26,26,26,.65)">Belles fêtes !</div></div></div>')
    return b


# ---------- 7 · vœux ----------
def carte(x, y, w, h, rot, bg, inner, z=1):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;transform:rotate({rot}deg);z-index:{z};border-radius:18px;overflow:hidden;background:{bg};'
            f'box-shadow:0 50px 90px -46px rgba(20,8,50,.75)">{inner}</div>')


def scene(x, rot, ph, pos, back, front):
    # même géométrie pour les deux cibles : élément arrière décalé, carte avant centrée
    return (f'<div style="position:absolute;left:{x}px;top:{PY}px;width:440px;height:658px;transform:rotate({rot}deg);border-radius:32px;overflow:hidden;box-shadow:0 60px 100px -50px rgba(20,8,50,.75)">'
            f'{img(ph, pos)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,8,30,.25),rgba(15,8,30,.6))"></div>'
            f'<div style="position:absolute;left:142px;top:232px;width:260px;height:360px;transform:rotate(6deg);border-radius:8px;overflow:hidden;box-shadow:0 30px 50px -22px rgba(0,0,0,.7)">{back}</div>'
            f'<div style="position:absolute;left:40px;top:112px;width:260px;height:360px;transform:rotate(-4deg);border-radius:8px;overflow:hidden;box-shadow:0 36px 60px -24px rgba(0,0,0,.8)">{front}</div></div>')


def p7():
    b = mot(MOTIF['lav'])
    b += entete(6, 'Les vœux', 'se préparent déjà.', W3, 3, hbg=C['encre'], hfg=C['sable'], lg=logo(44, C['encre'], C['lavf']))
    voeux = (f'<div style="position:absolute;inset:0;background:radial-gradient(120% 90% at 20% 10%,{C["lav"]},{C["lavf"]} 62%)"></div>'
             f'<div style="position:absolute;left:28px;top:26px;{F_D};font-weight:800;font-size:122px;line-height:.82;letter-spacing:-.06em;color:{C["sable"]}">20<br>27</div>'
             f'<div style="position:absolute;left:26px;right:20px;bottom:26px;{F_D};font-weight:650;font-size:25px;line-height:1.05;color:{C["sable"]}">Belle et heureuse<br>année 2027</div>')
    invit = (f'<div style="position:absolute;inset:0;background:{C["sable"]}"></div>'
             f'<div style="position:absolute;left:110px;right:20px;bottom:24px">'
             f'<div style="{F_D};font-weight:700;font-size:24px;line-height:1;letter-spacing:-.02em">Cérémonie<br>des vœux</div>'
             f'<div style="margin-top:8px;font-weight:600;font-size:14px;line-height:1.35;color:rgba(26,26,26,.65)">Vendredi 15 janvier<br>à 18 h 30</div></div>')
    merci = (f'<div style="position:absolute;inset:0;background:{C["sable"]}"></div>'
             f'<div style="position:absolute;left:28px;right:24px;top:30px;font-weight:700;font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:{C["corf"]}">Votre entreprise</div>'
             f'<div style="position:absolute;left:28px;right:24px;top:60px;{F_D};font-weight:700;font-size:40px;line-height:.95;letter-spacing:-.03em">Merci<br>pour 2026,</div>'
             f'<div class="I" style="position:absolute;left:28px;right:24px;top:150px;font-size:32px;line-height:1.05;color:{C["corf"]}">à très vite<br>en 2027.</div>'
             f'<div style="position:absolute;left:28px;right:24px;bottom:26px;font-weight:500;font-size:15px;line-height:1.4;color:rgba(26,26,26,.6)">Toute l’équipe vous souhaite<br>de belles fêtes.</div>')
    env = (f'<div style="position:absolute;inset:0;background:{C["corc"]}"></div>'
           f'<svg style="position:absolute;inset:0" width="260" height="360" viewBox="0 0 260 360"><path d="M0 0 130 140 260 0" fill="rgba(154,66,50,.08)" stroke="rgba(154,66,50,.3)" stroke-width="2"/></svg>')
    b += scene(88, -1.5, 'mairie-nuit', 'center 40%', invit, voeux)
    b += scene(552, 1.5, 'village-lumieres', 'center', env, merci)
    return b


# ---------- 8 · année en images ----------
def p8():
    b = mot(MOTIF['lavc'])
    b += entete(7, 'Raconter', 'l’année en images.', W4, 1, hbg=C['cor'], hfg=C['encre'])
    b += post(88, PY, 440, -1.5, 'c', 'parade-noel', 'center 30%', '2026 en<br>images', 'Merci à toutes celles et ceux qui ont fait vivre la commune cette année.', dots=6)
    coll = (f'<div style="position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;background:#fff">'
            + ''.join(f'<div style="position:relative;overflow:hidden">{img(k)}</div>' for k in ('atelier-couronnes', 'atelier-ceramique', 'vitrine-noel', 'marche-noel')) + '</div>'
            f'<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:16px 24px;border-radius:20px;background:{C["cor"]};{F_D};font-weight:750;font-size:34px;line-height:.95;text-align:center;color:{C["encre"]}">Merci<br>pour 2026</div>')
    b += post(552, PY, 440, 1.5, 'e', None, None, '', 'Retour en images sur les projets et les rencontres qui ont marqué notre année.', vis=coll)
    return b


# ---------- 9 · pendant les fêtes ----------
def p9():
    b = mot(MOTIF['lavf'])
    b += head(N, 8, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.24)')
    b += (f'<div style="position:absolute;left:88px;top:188px;height:104px;display:flex;align-items:center;gap:18px">'
          f'<span style="display:inline-flex;align-items:center;gap:12px;height:72px;padding:0 28px;border-radius:999px;background:{C["sable"]};color:{C["lavt"]};{F_D};font-weight:700;font-size:30px">{ico("clock", 30, C["lavt"])}Du 24 décembre au 4 janvier</span></div>')
    b += f'<div class="ttl" style="top:350px;color:{C["sable"]};font-size:64px">Pendant les fêtes,<span class="I" style="color:{C["lavc"]}">vos publications continuent.</span></div>'
    rows = [('24 déc.', '10 h 00', 'Le message de fêtes', 'Publication', 'village-lumieres'), ('29 déc.', '9 h 30', 'Le rappel des horaires', 'Story', 'panneau-ferme'),
            ('1er janv.', '10 h 00', 'Les vœux 2027', 'Publication et actualité du site', None), ('4 janv.', '8 h 30', 'L’agenda de janvier', 'Événement à l’agenda', 'ville-nuit')]
    out = ''
    for i, (d, h, t, c, ph) in enumerate(rows):
        thumb = (f'<div style="position:relative;flex:none;width:96px;height:96px;border-radius:18px;overflow:hidden">{img(ph)}</div>' if ph else
                 f'<div style="flex:none;width:96px;height:96px;border-radius:18px;background:{C["lavf"]};display:grid;place-items:center;{F_D};font-weight:800;font-size:28px;line-height:.85;color:{C["sable"]};text-align:center">20<br>27</div>')
        out += (f'<div style="display:flex;align-items:center;gap:26px;padding:24px 0;{"border-top:2px solid rgba(26,26,26,.07)" if i else ""}">{thumb}'
                f'<div style="flex:1"><div style="{F_D};font-weight:650;font-size:34px">{t}</div><div style="margin-top:6px;font-weight:500;font-size:22px;color:rgba(26,26,26,.55)">{c}</div></div>'
                f'<div style="text-align:right"><div style="font-weight:700;font-size:26px">{d}</div><div style="margin-top:8px;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;background:{C["lavc"]};color:{C["lavt"]};font-weight:650;font-size:19px">{ico("clock", 17, C["lavt"])}{h}</div></div></div>')
    b += (f'<div class="card" style="left:88px;right:88px;top:{PY}px;height:717px;box-sizing:border-box;padding:34px 40px;border-radius:40px">'
          f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px"><span style="{F_D};font-weight:650;font-size:34px">Publications programmées</span>'
          f'<span class="tag" style="background:{C["lavf"]};color:{C["sable"]}">4 prêtes</span></div>{out}</div>')
    return b


# ---------- 10 · on peut s'en occuper ----------
DET = [('1er déc.', 'Le programme des fêtes', 'Affiche, publication, actualité', 6), ('8 déc.', 'Les dates limites', 'Story, publication', 2),
       ('12 déc.', 'L’événement', 'Affiche, 2 publications, 2 stories', 8), ('14 déc.', 'Les horaires', 'Page du site, publication', 2),
       ('17 déc.', 'Les vœux', 'Carte de vœux, invitation, édito', 6), ('22 déc.', 'L’année en images', 'Carrousel', 1),
       ('24 déc.', 'Pendant les fêtes', '4 publications programmées', 5)]


def p10():
    b = mot(MOTIF['lavc'])
    b += head(N, 9, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += f'<div class="ttl" style="color:{C["encre"]};font-size:84px">Tout ce mois,<span class="I" style="color:{C["lavt"]}">on peut s’en occuper.</span></div>'
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:20px;height:66px;{"border-top:2px solid rgba(26,26,26,.07)" if i else ""}">'
                   f'<span style="flex:none;width:118px;font-weight:700;font-size:22px;color:{C["lavt"]}">{d}</span>'
                   f'<span style="flex:1;font-weight:600;font-size:25px">{t}<span style="font-weight:500;font-size:20px;color:rgba(26,26,26,.5)"> · {x}</span></span>'
                   f'<span class="tag" style="height:42px;font-size:21px;background:{C["lavc"]};color:{C["lavt"]}">{u}{NB}u.</span></div>' for i, (d, t, x, u) in enumerate(DET))
    b += f'<div class="card" style="left:88px;right:88px;top:470px;padding:14px 36px;border-radius:36px">{rows}</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:1016px;height:246px;border-radius:40px;background:{C["lavf"]};padding:0 44px;display:flex;align-items:center;gap:40px">'
          f'<div style="flex:none;{F_D};font-weight:800;font-size:120px;line-height:.9;letter-spacing:-.05em;color:{C["sable"]}">30<span style="font-size:40px;font-weight:650;letter-spacing:0"> unités</span></div>'
          f'<div style="font-weight:550;font-size:28px;line-height:1.38;color:{C["sable"]}">Tout tient dans la formule <b>Régulier</b> :<br>35 unités, <b>990 € par mois</b>.</div></div>')
    return b


# ---------- 11 · fin ----------
def p11():
    b = motif(MOTIF['lavf'], 1700, 300, -220)
    b += f'<div style="position:absolute;right:88px;top:96px">{G.dashes(N, 10, C["lavc"], "rgba(248,245,242,.24)")}</div>'
    b += f'<div style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center">{logo(210, C["sable"])}</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:560px;text-align:center">'
          f'<div class="D" style="font-weight:650;font-size:84px;line-height:.98;letter-spacing:-.035em;color:{C["sable"]}">Parlons de votre<br>mois de décembre.</div>'
          f'<div class="I" style="font-size:46px;color:{C["lavc"]};margin-top:22px">Premier mois sans engagement.</div></div>')
    b += (f'<div style="position:absolute;left:0;right:0;top:960px;display:flex;flex-direction:column;align-items:center;gap:30px">'
          f'<span style="display:inline-flex;align-items:center;gap:16px;height:100px;padding:0 46px 0 38px;border-radius:999px;background:{C["blanc"]};box-shadow:0 0 0 10px {C["lav"]};font-weight:650;font-size:40px">fill.studioes.fr</span>'
          f'<span style="font-weight:500;font-size:28px;color:rgba(248,245,242,.75)">Collectivités et entreprises, partout en France</span></div>')
    return b


PAGES = [(p1, C['lavc']), (p2, C['lavf']), (p3, C['lavc']), (p4, C['lavc']), (p5, C['encre']), (p6, C['lavc']), (p7, C['lav']), (p8, C['lavc']), (p9, C['lavf']), (p10, C['lavc']), (p11, C['lavf'])]

if __name__ == '__main__':
    import sys
    sel = sys.argv[1:] or [str(i + 1) for i in range(len(PAGES))]
    for i, (f, bg) in enumerate(PAGES):
        if str(i + 1) in sel:
            page(f'gd{i + 1:02d}', bg, f(), end=1)
    print('ok')
