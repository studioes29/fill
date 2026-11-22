"""Guide · « Une publication accessible en 7 gestes » (mardi 22 décembre 2026, 11 h).
Série Guide : couverture lavande claire, pages ton sur ton lavande (s'adresse à tous).
Rendu : python3 guide_accessible.py puis python3 render.py ga01 … ga10."""
import guide2 as G2
import lgen as G
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page
from guide2 import img, ico, tagc, F_D, affiche, avatar

N = 10
MU = 'rgba(26,26,26,.62)'


def mot(col):
    return motif(col, 2300, 120, -420)


def hd(n, dark=False, mid=False):
    if mid:
        return head(N, n, logo(44, C['encre'], C['lavf'], C['cor']), C['encre'], 'rgba(26,26,26,.16)')
    if dark:
        return head(N, n, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.24)')
    return head(N, n, logo(44), C['lavf'], 'rgba(26,26,26,.14)')


def geste(n, t1, t2, txt, fs=76):
    """En-tête commun des pages gestes : pastille, titre, relance, texte."""
    b = (f'<div style="position:absolute;left:88px;top:176px;display:flex;align-items:center;gap:16px">'
         f'<span style="width:64px;height:64px;border-radius:50%;background:{C["lavf"]};color:{C["sable"]};display:grid;place-items:center;{F_D};font-weight:800;font-size:34px">{n}</span>'
         f'<span style="font-weight:650;font-size:24px;color:{C["lavt"]}">Geste {n} sur 7</span></div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:272px"><div class="D" style="font-weight:650;font-size:{fs}px;line-height:.98;letter-spacing:-.04em">{t1}</div>'
          f'<div class="I" style="font-size:{round(fs*.84)}px;line-height:1.08;letter-spacing:-.02em;color:{C["lavt"]};margin-top:4px">{t2}</div></div>')
    b += f'<div style="position:absolute;left:88px;right:88px;top:472px;font-weight:500;font-size:29px;line-height:1.4;color:{MU}">{txt}</div>'
    return b


VY = 640   # haut de la zone visuelle des pages gestes
VH = 622   # hauteur (jusqu'à la marge basse 1262)


def white(x, y, w, h, inner, rot=0, pad=34, rad=36, z=1, bg='#fff'):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;transform:rotate({rot}deg);z-index:{z};box-sizing:border-box;padding:{pad}px;'
            f'border-radius:{rad}px;background:{bg};box-shadow:0 50px 90px -45px rgba(20,8,50,.55)">{inner}</div>')


def verdict(ok, txt):
    bg, fg = (C['lavf'], C['sable']) if ok else ('rgba(26,26,26,.08)', C['encre'])
    sym = check(fg, 22) if ok else ('<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1A1A1A" stroke-width="2.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>')
    return f'<span style="display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 20px;border-radius:999px;background:{bg};color:{fg};font-weight:700;font-size:21px">{sym}{txt}</span>'


def voix(txt, w='auto'):
    """Bulle « lu à voix haute » par un lecteur d'écran."""
    hp = ('<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#5B3F9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          '<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/></svg>')
    return (f'<div style="display:flex;gap:14px;align-items:flex-start;margin-top:18px;padding:18px 22px;border-radius:22px;background:{C["lavc"]}">'
            f'<span style="flex:none;margin-top:2px">{hp}</span><span class="I" style="font-size:27px;line-height:1.3;color:{C["lavt"]};font-weight:400">{txt}</span></div>')


def capt(user_kind, txt, fs=24):
    user = 'Votre collectivité' if user_kind == 'c' else 'Votre entreprise'
    return (f'<div style="display:flex;align-items:center;gap:14px">{avatar(user_kind, 46)}<div><div style="font-weight:700;font-size:21px">{user}</div>'
            f'<div style="font-weight:500;font-size:16px;color:rgba(26,26,26,.5)">Légende de la publication</div></div></div>'
            f'<div style="margin-top:18px;font-weight:500;font-size:{fs}px;line-height:1.42;color:{C["encre"]}">{txt}</div>')


# ---------- 1 · couverture ----------
def p1():
    b = mot(MOTIF['lavc'])
    b += (f'<div style="position:absolute;left:88px;top:88px">{logo(56)}</div>'
          f'<div style="position:absolute;right:88px;top:90px">{tagc("Guide", C["lavf"], C["sable"], 52, 24)}</div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:196px"><div class="D" style="font-weight:650;font-size:112px;line-height:.92;letter-spacing:-.05em">Une publication<br>accessible</div>'
          f'<div class="I" style="font-size:96px;line-height:1.02;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">en 7 gestes.</div></div>')
    # carte : une publication et son texte alternatif
    poster = (f'<div style="position:relative;flex:none;width:300px;height:376px;border-radius:18px;overflow:hidden">'
              + affiche('marche-noel', C['lavf'], 'Marché<br>de Noël', 'Samedi 12 déc.', 300, 376, pos='center 35%') + '</div>')
    chips = ''.join(f'<span style="width:44px;height:44px;border-radius:50%;background:{C["lavf"]};display:grid;place-items:center">{check(C["sable"], 22)}</span>' for _ in range(7))
    field = (f'<div style="flex:1;display:flex;flex-direction:column">'
             f'<div style="font-weight:700;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:{C["lavt"]}">Texte alternatif</div>'
             f'<div style="margin-top:14px;flex:1;border-radius:20px;box-shadow:inset 0 0 0 2px {C["lav"]};padding:20px 22px;font-weight:500;font-size:25px;line-height:1.4">'
             f'Affiche du marché de Noël,<br>samedi 12 décembre de 10 h<br>à 18 h, place de la mairie.</div>'
             f'<div style="margin-top:18px;display:flex;gap:9px">{chips}</div></div>')
    b += (f'<div class="card" style="left:110px;top:610px;width:860px;padding:34px;border-radius:40px;transform:rotate(-2deg);display:flex;gap:30px">'
          f'{poster}{field}</div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;bottom:88px;height:104px;display:flex;align-items:center;justify-content:space-between">'
          f'<span style="font-weight:600;font-size:27px;line-height:1.35;color:rgba(26,26,26,.7)">Réseaux sociaux, site, bulletin.<br>Pour les collectivités et les entreprises.</span>'
          f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["encre"]}">{arrow(C["sable"], 42)}</span></div>')
    return b


# ---------- 2 · pourquoi y penser ----------
def p2():
    b = mot(MOTIF['lavf'])
    b += hd(1, True)
    b += (f'<div style="position:absolute;left:88px;right:88px;top:176px"><div class="D" style="font-weight:650;font-size:92px;line-height:.96;letter-spacing:-.04em;color:{C["sable"]}">Pourquoi</div>'
          f'<div class="I" style="font-size:80px;line-height:1.06;color:{C["lavc"]};margin-top:4px">y penser.</div></div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:400px;font-weight:500;font-size:30px;line-height:1.4;color:rgba(248,245,242,.85)">'
          f'Une partie de vos lecteurs utilise un lecteur d’écran, agrandit le texte ou regarde vos vidéos sans le son.</div>')
    icos = [('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/>', 'Lecteur d’écran'),
            ('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/><path d="M10.5 7.5v6M7.5 10.5h6"/>', 'Texte agrandi'),
            ('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>', 'Vidéo sans le son')]
    for i, (p, t) in enumerate(icos):
        x = 88 + i * 309
        b += (f'<div style="position:absolute;left:{x}px;top:552px;width:286px;height:96px;border-radius:999px;background:rgba(248,245,242,.12);display:flex;align-items:center;gap:12px;padding:0 18px">'
              f'<span style="flex:none;width:56px;height:56px;border-radius:50%;background:{C["sable"]};display:grid;place-items:center">'
              f'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="{C["lavt"]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{p}</svg></span>'
              f'<span style="font-weight:650;font-size:22px;white-space:nowrap;color:{C["sable"]}">{t}</span></div>')
    cards = [('Pour les communes', 'Une obligation', 'Loi du 11 février 2005, article 47 : les services en ligne publics doivent être accessibles (référentiel RGAA).', C['lavc'], C['lavt']),
             ('Pour les entreprises', 'Un cadre européen', 'Depuis le 28 juin 2025, certains services numériques, dont le commerce en ligne, relèvent de l’acte européen sur l’accessibilité.', C['sable'], C['lavf'])]
    for i, (lab, t, txt, bg, ac) in enumerate(cards):
        x = 88 + i * 464
        b += (f'<div style="position:absolute;left:{x}px;top:700px;width:440px;height:360px;box-sizing:border-box;padding:36px 34px;border-radius:36px;background:{bg};box-shadow:0 50px 90px -45px rgba(20,8,50,.7)">'
              f'<div style="font-weight:700;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:{ac}">{lab}</div>'
              f'<div style="margin-top:14px;{F_D};font-weight:700;font-size:42px;line-height:1;letter-spacing:-.03em">{t}</div>'
              f'<div style="margin-top:20px;font-weight:500;font-size:24px;line-height:1.42;color:rgba(26,26,26,.72)">{txt}</div></div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:1100px;height:112px;display:flex;align-items:center;font-weight:600;font-size:28px;line-height:1.4;color:{C["sable"]}">'
          f'Dans les deux cas, cela commence par des gestes simples,<br>à chaque publication.</div>')
    return b


# ---------- 3 · texte alternatif ----------
def p3():
    b = mot(MOTIF['lavc'])
    b += hd(2)
    b += geste(1, 'Le texte alternatif,', 'une phrase pour l’image.', 'Décrivez l’image en une phrase,<br>dans le champ prévu par chaque réseau.')
    poster = affiche('marche-noel', C['lavf'], 'Marché<br>de Noël', 'Samedi 12 déc.', 330, 440, pos='center 35%')
    b += (f'<div style="position:absolute;left:88px;top:{VY + 60}px;width:330px;height:440px;transform:rotate(-3deg);border-radius:22px;overflow:hidden;box-shadow:0 50px 90px -40px rgba(20,8,50,.7)">{poster}</div>')
    ig = (f'<div style="font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:{C["lavt"]}">Instagram</div>'
          f'<div style="margin-top:8px;display:flex;align-items:center;gap:10px;font-weight:600;font-size:21px;color:{MU}">Paramètres avancés {arrow(MU, 20)} Texte alternatif</div>'
          f'<div style="margin-top:16px;border-radius:18px;box-shadow:inset 0 0 0 2px {C["lav"]};padding:16px 18px;font-weight:500;font-size:22px;line-height:1.42">'
          f'Affiche du marché de Noël, samedi 12 décembre de 10 h à 18 h, place de la mairie.</div>')
    li = (f'<div style="font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:{C["lavt"]}">LinkedIn</div>'
          f'<div style="margin-top:14px;display:inline-flex;align-items:center;gap:10px;height:52px;padding:0 22px;border-radius:999px;background:{C["lavf"]};color:{C["sable"]};font-weight:650;font-size:21px">'
          f'<span style="font-weight:800;font-size:24px">+</span>Ajouter un texte alternatif</div>')
    b += white(450, VY + 60, 542, 270, ig, rot=1.5, z=2)
    b += white(450, VY + 362, 542, 186, li, rot=1.5, z=2)
    return b


# ---------- 4 · affiche aussi en texte ----------
def p4():
    b = mot(MOTIF['lavc'])
    b += hd(3)
    b += geste(2, 'L’affiche aussi', 'en texte.', 'Une affiche publiée en image n’est pas lue par un lecteur d’écran. Reprenez la date, l’heure et le lieu.')
    def carte(ok, lab, leg, lu, col):
        return (f'<div style="display:flex;gap:26px;align-items:flex-start">'
                f'<div style="position:relative;flex:none;width:176px;height:220px;border-radius:14px;overflow:hidden">{affiche("marche-stands", C["lavf"], "Marché<br>de Noël", "Samedi 12 déc.", 176, 220)}</div>'
                f'<div style="flex:1">{verdict(ok, lab)}<div style="margin-top:14px;font-weight:500;font-size:22px;line-height:1.4;color:{col}">Légende : {leg}</div>'
                + voix(lu) + '</div></div>')
    b += white(88, VY - 20, 904, 296, carte(False, 'Image seule', '« Venez nombreux ! »', '« Image. Venez nombreux ! »', MU), pad=30)
    b += white(88, VY + 308, 904, 314, carte(True, 'Avec le texte', '« Marché de Noël samedi 12 décembre, de 10 h à 18 h, place de la mairie. »', '« Marché de Noël samedi 12 décembre, de 10 h à 18 h, place de la mairie. »', C['encre']), pad=30)
    return b


# ---------- 5 · emojis ----------
def p5():
    b = mot(MOTIF['lav'])
    b += hd(4, mid=True)
    b += geste(3, 'Les emojis', 'avec mesure.', 'Chaque emoji est lu à voix haute. Un ou deux en fin de phrase, jamais au milieu d’un mot ni en liste de dix.')
    bad = (f'{verdict(False, "À éviter")}<div style="margin-top:20px">{capt("e", "🎄🎁 Notre boutique ✨ est ouverte ce dimanche 👉👉 de 10 h à 18 h 🎅🎄⭐")}</div>'
           + voix('« Sapin de Noël, cadeau. Notre boutique, étincelles, est ouverte ce dimanche, flèche vers la droite, flèche vers la droite… »'))
    good = (f'{verdict(True, "Préférez")}<div style="margin-top:20px">{capt("e", "Notre boutique est ouverte ce dimanche, de 10 h à 18 h. 🎄")}</div>')
    b += white(88, VY - 20, 904, 360, bad, pad=32)
    b += white(88, VY + 380, 904, 220, good, pad=32)
    return b


# ---------- 6 · mots-dièse ----------
def p6():
    b = mot(MOTIF['lavc'])
    b += hd(5)
    b += geste(4, 'Les mots-dièse', 'avec majuscules.', 'Une majuscule au début de chaque mot : le lecteur d’écran lit alors les mots séparément.')
    def tagbox(ok, tag, lu, top, h):
        inner = (f'{verdict(ok, "Préférez" if ok else "À éviter")}'
                 f'<div style="margin-top:24px;{F_D};font-weight:700;font-size:62px;letter-spacing:-.03em;color:{C["lavf"] if ok else C["encre"]}">{tag}</div>'
                 + voix(lu))
        return white(88, top, 904, h, inner, pad=34)
    b += tagbox(False, '#marchédenoël', 'Lu comme un seul mot : « marchédenoël »', VY - 20, 300)
    b += tagbox(True, '#MarchéDeNoël', 'Lu mot par mot : « Marché De Noël »', VY + 322, 300)
    return b


# ---------- 7 · majuscules et polices ----------
def p7():
    b = mot(MOTIF['lavc'])
    b += hd(6)
    b += geste(5, 'Ni majuscules', 'ni polices fantaisie.', 'Un texte tout en majuscules se lit mal. Les caractères copiés depuis un générateur ne sont pas lus du tout, ou lus lettre par lettre.')
    caps = (f'{verdict(False, "Tout en majuscules")}<div style="margin-top:20px;font-weight:700;font-size:30px;line-height:1.3;letter-spacing:.02em">INSCRIPTIONS OUVERTES POUR LE REPAS DES AÎNÉS</div>')
    fancy = (f'{verdict(False, "Police copiée d’un générateur")}<div style="margin-top:20px;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:34px;line-height:1.25">Inscriptions ouvertes</div>'
             + voix('« I, n, s, c, r, i, p, t… »'))
    good = (f'{verdict(True, "Préférez")}<div style="margin-top:20px;font-weight:600;font-size:30px;line-height:1.3">Les inscriptions au repas des aînés sont ouvertes.</div>')
    b += white(88, VY - 20, 904, 186, caps, pad=30)
    b += white(88, VY + 186, 904, 252, fancy, pad=30)
    b += white(88, VY + 458, 904, 164, good, pad=30)
    return b


# ---------- 8 · contraste et taille ----------
def p8():
    b = mot(MOTIF['lav'])
    b += hd(7, mid=True)
    b += geste(6, 'Contraste', 'et taille.', 'Texte foncé sur fond clair, ou l’inverse. Pas de texte sur une photo chargée. Une taille lisible sur téléphone, sans zoomer.')
    W, H = 280, 400
    tiles = [
        (False, 'Photo chargée', f'{img("marche-stands")}<div style="position:absolute;left:22px;right:22px;top:150px;{F_D};font-weight:600;font-size:28px;line-height:1.05;color:rgba(255,255,255,.75)">Concert de Noël samedi 19 h</div>'),
        (False, 'Gris sur blanc', f'<div style="position:absolute;inset:0;background:#fff"></div><div style="position:absolute;left:22px;right:22px;top:150px;font-weight:500;font-size:17px;line-height:1.3;color:#C9C4D6">Concert de Noël samedi à 19 h, église du bourg</div>'),
        (True, 'Contrasté, lisible', f'<div style="position:absolute;inset:0;background:{C["lavc"]}"></div><div style="position:absolute;left:24px;right:20px;top:120px;{F_D};font-weight:750;font-size:44px;line-height:.98;letter-spacing:-.03em;color:{C["encre"]}">Concert<br>de Noël</div>'
               f'<div style="position:absolute;left:24px;right:20px;top:240px;font-weight:650;font-size:24px;line-height:1.3;color:{C["lavt"]}">Samedi à 19 h,<br>église du bourg</div>'),
    ]
    for i, (ok, lab, inner) in enumerate(tiles):
        x = 88 + i * (W + 32)
        b += (f'<div style="position:absolute;left:{x}px;top:{VY + 20}px;width:{W}px;height:{H}px;border-radius:28px;overflow:hidden;box-shadow:0 50px 90px -45px rgba(20,8,50,.6)">{inner}</div>'
              f'<div style="position:absolute;left:{x}px;top:{VY + H + 48}px;width:{W}px;display:flex;justify-content:center">{verdict(ok, lab)}</div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:{VY + H + 128}px;height:74px;border-radius:999px;background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;gap:14px;font-weight:650;font-size:24px;color:{C["lavt"]}">'
          f'{check(C["lavt"], 24)}Le test : lire la publication sur un téléphone, à bout de bras</div>')
    return b


# ---------- 9 · vidéos et PDF ----------
def p9():
    b = mot(MOTIF['lavc'])
    b += hd(8)
    b += geste(7, 'Vidéos sous-titrées,', 'PDF doublés.', 'Sous-titrez vos vidéos (les outils des réseaux le font). Bulletin, menu ou programme en PDF : publiez aussi l’essentiel en texte sur le site.')
    # vidéo sous-titrée dans un téléphone
    mute = ('<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>')
    sc = (f'<div style="position:absolute;inset:0">{img("ville-nuit")}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,8,30,.3),rgba(15,8,30,.1) 40%,rgba(15,8,30,.65))"></div>'
          f'<span style="position:absolute;right:16px;top:52px;width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.45);display:grid;place-items:center">{mute}</span>'
          f'<div style="position:absolute;left:18px;right:18px;bottom:70px;text-align:center"><span style="background:rgba(0,0,0,.72);color:#fff;font-weight:600;font-size:19px;line-height:1.6;padding:4px 10px;box-decoration-break:clone;-webkit-box-decoration-break:clone">'
          f'Les illuminations<br>s’allument vendredi<br>à 18{NB}h.</span></div></div>')
    b += G2.phone(98, VY - 20, 300, -2, sc, h=600)
    # PDF doublé par une page du site
    pdf = (f'<div style="position:absolute;inset:0;background:{C["sable"]}"></div>'
           f'<div style="position:absolute;left:22px;top:22px;height:30px;padding:0 12px;border-radius:8px;background:{C["corf"]};color:#fff;font-weight:800;font-size:15px;display:flex;align-items:center">PDF</div>'
           f'<div style="position:absolute;left:22px;right:22px;top:70px;{F_D};font-weight:750;font-size:30px;line-height:.98">Le bulletin<br>de janvier</div>'
           + ''.join(f'<div style="position:absolute;left:22px;right:{22 + (i % 3) * 30}px;top:{160 + i * 22}px;height:9px;border-radius:5px;background:rgba(26,26,26,.13)"></div>' for i in range(5)))
    b += (f'<div style="position:absolute;left:470px;top:{VY + 10}px;width:220px;height:290px;transform:rotate(-4deg);border-radius:14px;overflow:hidden;box-shadow:0 40px 70px -35px rgba(20,8,50,.7)">{pdf}</div>')
    web = (f'<div style="display:flex;gap:7px;margin-bottom:16px">' + ''.join(f'<span style="width:12px;height:12px;border-radius:50%;background:rgba(26,26,26,.15)"></span>' for _ in range(3)) + '</div>'
           f'<div style="font-weight:700;font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:{C["lavt"]}">Actualité du site</div>'
           f'<div style="margin-top:8px;{F_D};font-weight:700;font-size:30px;line-height:1.02;letter-spacing:-.02em">Le bulletin de janvier<br>est paru</div>'
           f'<div style="margin-top:14px;font-weight:500;font-size:19px;line-height:1.42;color:{MU}">Au sommaire : les travaux de la rue des écoles, le repas des aînés, l’agenda du mois.</div>'
           f'<div style="margin-top:16px;font-weight:650;font-size:19px;color:{C["lavf"]}">Télécharger le PDF</div>')
    b += white(552, VY + 220, 440, 340, web, rot=2, pad=30, z=2)
    return b


# ---------- 10 · fin ----------
def p10():
    b = motif(MOTIF['lavf'], 1700, 300, -220)
    b += f'<div style="position:absolute;right:88px;top:96px">{G.dashes(N, 9, C["lavc"], "rgba(248,245,242,.24)")}</div>'
    b += f'<div style="position:absolute;left:0;right:0;top:200px;display:flex;justify-content:center">{logo(160, C["sable"])}</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:430px;text-align:center">'
          f'<div class="D" style="font-weight:650;font-size:76px;line-height:.98;letter-spacing:-.035em;color:{C["sable"]}">À chaque publication,</div>'
          f'<div class="I" style="font-size:60px;color:{C["lavc"]};margin-top:8px">sept gestes.</div></div>')
    items = ['Texte alternatif', 'Informations en texte', 'Emojis comptés', 'Mots-dièse en majuscules', 'Police simple', 'Contraste', 'Sous-titres']
    chips = [f'<span style="display:inline-flex;align-items:center;gap:10px;height:56px;padding:0 22px;border-radius:999px;background:rgba(248,245,242,.14);color:{C["sable"]};font-weight:600;font-size:24px">'
                    f'<span style="{F_D};font-weight:800;color:{C["lav"]}">{i + 1}</span>{t}</span>' for i, t in enumerate(items)]
    ch = chips
    rows = [ch[0:2], ch[2:4], ch[4:7]]
    b += '<div style="position:absolute;left:88px;right:88px;top:630px;display:flex;flex-direction:column;align-items:center;gap:14px">' + ''.join(f'<div style="display:flex;gap:14px">{"".join(r)}</div>' for r in rows) + '</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:900px;text-align:center;font-weight:500;font-size:30px;line-height:1.4;color:rgba(248,245,242,.85)">'
          f'Ces gestes font partie de chaque<br>publication que nous préparons.</div>')
    b += (f'<div style="position:absolute;left:0;right:0;top:1080px;display:flex;justify-content:center">'
          f'<span style="display:inline-flex;align-items:center;gap:16px;height:100px;padding:0 46px 0 38px;border-radius:999px;background:{C["blanc"]};box-shadow:0 0 0 10px {C["lav"]};font-weight:650;font-size:40px">fill.studioes.fr</span></div>')
    return b


PAGES = [(p1, C['lavc']), (p2, C['lavf']), (p3, C['lavc']), (p4, C['lavc']), (p5, C['lav']), (p6, C['lavc']), (p7, C['lavc']), (p8, C['lav']), (p9, C['lavc']), (p10, C['lavf'])]

if __name__ == '__main__':
    import sys
    sel = sys.argv[1:] or [str(i + 1) for i in range(len(PAGES))]
    for i, (f, bg) in enumerate(PAGES):
        if str(i + 1) in sel:
            page(f'ga{i + 1:02d}', bg, f(), end=1)
    print('ok')
