"""Guide · « Une publication lisible par tous » (mardi 12 janvier 2027, 11 h), version 3.
Storytelling : ce qu'entend un lecteur d'écran → qui est concerné → ce que dit la loi → les 7 gestes en 3 pages → la même publication, lue correctement.
Couverture fixe, aucun dégradé, texte sur aplat, photos toutes différentes. Rendu : python3 accessible2.py ; render.py ga2-01..09."""
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page
from guide2 import ico, F_D
from v2 import pill, rond_fleche, fin, av, M, tflow, pied, mise, cadre, carte, OMBRE, HD

N = 10
EMO = "font-family:'Noto Color Emoji'"


def hd(i, fond):
    if fond == 'lavf':
        return head(N, i, logo(44, C['sable'], C['lav'], C['cor']), C['lavc'], 'rgba(248,245,242,.24)')
    if fond == 'lav':
        return head(N, i, logo(44, C['encre'], C['lavf'], C['cor']), C['encre'], 'rgba(26,26,26,.16)')
    return head(N, i, logo(44, C['encre'], C['lav'], C['cor']), C['lavf'], 'rgba(26,26,26,.14)')


HP = ('<svg viewBox="0 0 24 24" width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      '<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/></svg>')


def voix(txt, fs=34, bg=None, fg=None):
    bg = bg or '#fff'; fg = fg or C['lavt']
    return (f'<div style="display:flex;gap:20px;align-items:flex-start;padding:30px 34px;border-radius:34px;background:{bg};box-shadow:{OMBRE}">'
            f'<span style="flex:none;width:60px;height:60px;border-radius:50%;background:{C["lavc"]};display:grid;place-items:center">{HP.format(s=32, c=C["lavt"])}</span>'
            f'<span class="I" style="font-size:{fs}px;line-height:1.28;color:{fg};font-weight:400">{txt}</span></div>')


def affiche(w, h):
    """Exemple : affiche du concert du Nouvel An (photo de scène, texte sur aplat)."""
    return (f'<div style="position:relative;width:{w}px;height:{h}px;border-radius:22px;overflow:hidden;background:{C["lavf"]}">'
            f'<img src="{HD}micro-scene.jpg" style="position:absolute;left:0;top:0;width:100%;height:58%;object-fit:cover;object-position:center 40%">'
            f'<div style="position:absolute;left:0;right:0;bottom:0;height:42%;padding:{round(w*.07)}px;display:flex;flex-direction:column;justify-content:center">'
            f'<div class="D" style="font-weight:760;font-size:{round(w*.13)}px;line-height:.92;letter-spacing:-.035em;color:{C["sable"]}">Concert du<br>Nouvel An</div>'
            f'<div style="margin-top:{round(w*.03)}px;font-weight:650;font-size:{round(w*.055)}px;color:{C["lavc"]}">Sam. 16 janv. · 18 h · église</div></div></div>')


def post(w, legende):
    return carte(0, 0, w, f'<div style="display:flex;align-items:center;gap:12px;padding-bottom:14px">{av("VC", C["lavc"], s=44)}<b style="font-size:21px">Votre collectivité</b></div>'
                 f'{affiche(w - 48, round((w - 48) * 1.18))}<div style="margin-top:14px;font-weight:550;font-size:22px;line-height:1.35">{legende}</div>', pad='22px 24px 22px', rad=30)


# ---------- 1 · couverture (fixe) ----------
def p1():
    b = f'<div style="position:absolute;left:{M}px;top:{M}px">{logo(56, C["encre"], C["lav"], C["cor"])}</div>'
    b += f'<div style="position:absolute;right:{M}px;top:92px">{pill("Guide · 7 gestes", C["lavf"], C["sable"], 58, 24)}</div>'
    b += cadre('femme-banc-tel', M, 196, 904, 600, 'center 40%', 40)
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:846px">'
          f'<div class="D" style="font-weight:700;font-size:104px;line-height:.92;letter-spacing:-.05em">Une publication</div>'
          f'<div class="I" style="font-size:90px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">lisible par tous.</div></div>')
    b += (f'<div style="position:absolute;left:{M}px;width:640px;top:1172px;font-weight:550;font-size:30px;line-height:1.3;color:rgba(26,26,26,.75)">'
          f'Sept gestes simples, à chaque post.<br>Collectivités et entreprises.</div>')
    b += rond_fleche(1080 - M - 104, 1350 - M - 104, C['encre'], C['sable'])
    return b


# ---------- 2 · contexte ----------
def p2ctx():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(1, 'lav')
    lignes = [('Affiches et programmes', 'publiés en image'), ('Horaires et dates', 'écrits dans l’image'), ('Vidéos', 'parlées, sans sous-titres')]
    rows = ''.join(f'<div style="display:flex;align-items:center;gap:18px;height:76px;border-top:2px solid rgba(26,26,26,.07)">'
                   f'<span style="flex:none;width:14px;height:14px;border-radius:50%;background:{C["lavf"]}"></span>'
                   f'<span style="flex:1;font-weight:680;font-size:27px">{a}</span><span style="font-weight:550;font-size:22px;color:rgba(26,26,26,.55)">{s}</span></div>'
                   for a, s in lignes)
    v = cadre('homme-lunettes-tel', 0, 0, 904, 430, 'center 30%', 36)
    v += carte(160, 330, 744, f'<div style="font-weight:700;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:{C["lavt"]};padding-bottom:12px">Sur nos réseaux, chaque semaine</div>{rows}', pad='26px 32px 14px', rad=32)
    b += mise(tflow('Une info publiée,', 'tout le monde la lit ?', 88, C['encre'], C['lavt']), v, 680,
              pied('Voici ce qu’entend une personne aveugle<br>devant un post ordinaire.', C['encre']))
    return b


# ---------- 2 · ce qu'entend un lecteur d'écran ----------
def p2():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(2, 'lavf')
    leg = f'Venez nombreux ! <span style="{EMO}">🎉🎶✨</span>'
    v = f'<div style="position:absolute;left:0;top:0;transform:rotate(-2deg)">{post(400, leg)}</div>'
    v += (f'<div style="position:absolute;left:440px;top:120px;width:464px">'
          + voix('« Image. Venez nombreux ! Cotillons. Musique. Étincelles. »', 36) + '</div>')
    v += (f'<div style="position:absolute;left:440px;top:470px;display:flex;flex-direction:column;gap:12px">'
          + ''.join(pill(t, 'rgba(248,245,242,.14)', C['sable'], 54, 23, icon='<span style="font-weight:800">✕</span>') for t in ('Ni la date', 'Ni l’heure', 'Ni le lieu')) + '</div>')
    b += mise(tflow('Ce qu’entend', 'un lecteur d’écran.', 92, C['sable'], C['lavc']), v, 640,
              pied('L’affiche est une image : sans texte, elle reste muette.', C['sable']))
    return b


# ---------- 3 · qui est concerné ----------
QUI = [('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/>', 'Lecteur d’écran', 'personnes aveugles ou malvoyantes'),
       ('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/><path d="M10.5 7.5v6M7.5 10.5h6"/>', 'Texte agrandi', 'vue fatiguée, lecture sur petit écran'),
       ('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>', 'Vidéo sans le son', 'dans le bus, au bureau, le soir')]


def p3():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(3, 'lavc')
    v = cadre('main-tel-bois', 0, 0, 904, 330, 'center 45%', 36)
    w = (904 - 2 * 16) // 3
    for i, (p, t, s) in enumerate(QUI):
        v += (f'<div style="position:absolute;left:{i * (w + 16)}px;top:354px;width:{w}px;height:250px;border-radius:30px;background:#fff;box-shadow:{OMBRE};padding:26px 24px;'
              f'display:flex;flex-direction:column;justify-content:space-between">'
              f'<span style="width:64px;height:64px;border-radius:50%;background:{C["lavf"]};display:grid;place-items:center">'
              f'<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="{C["sable"]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{p}</svg></span>'
              f'<div><div class="D" style="font-weight:720;font-size:30px;line-height:1.05;letter-spacing:-.02em">{t}</div>'
              f'<div style="margin-top:6px;font-weight:550;font-size:21px;line-height:1.3;color:rgba(26,26,26,.6)">{s}</div></div></div>')
    b += mise(tflow('Pas seulement', 'quelques personnes.', 92, C['encre'], C['lavt']), v, 604,
              pied('Une partie de vos lecteurs vous lit déjà ainsi.'))
    return b


# ---------- 4 · ce que dit la loi ----------
def p4():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(4, 'lavf')
    cards = [('Pour les communes', 'Une obligation', 'Loi du 11 février 2005, article 47 : les services en ligne publics doivent être accessibles (référentiel RGAA).', C['lavc'], C['lavt']),
             ('Pour les entreprises', 'Un cadre européen', 'Depuis le 28 juin 2025, certains services numériques, dont le commerce en ligne, relèvent de l’acte européen sur l’accessibilité.', C['sable'], C['lavf'])]
    v = ''
    for i, (lab, t, txt, bg, ac) in enumerate(cards):
        v += (f'<div style="position:absolute;left:{i * 460}px;top:0;width:444px;height:360px;padding:36px 34px;border-radius:36px;background:{bg};box-shadow:{OMBRE}">'
              f'<div style="font-weight:700;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:{ac}">{lab}</div>'
              f'<div class="D" style="margin-top:14px;font-weight:720;font-size:44px;line-height:1;letter-spacing:-.03em">{t}</div>'
              f'<div style="margin-top:22px;font-weight:550;font-size:25px;line-height:1.42;color:rgba(26,26,26,.75)">{txt}</div></div>')
    b += mise(tflow('Et ce n’est pas', 'qu’une bonne pratique.', 92, C['sable'], C['lavc']), v, 420,
              pied('Dans les deux cas, cela commence par des gestes<br>simples, à chaque publication.', C['sable']))
    return b


def bloc(n, t, avant, apres, w=904):
    """Un geste : numéro, titre, à éviter / à faire."""
    ko = ('<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1A1A1A" stroke-width="2.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>')
    return (f'<div style="display:flex;align-items:center;gap:16px;padding-bottom:16px">'
            f'<span class="D" style="flex:none;width:52px;height:52px;border-radius:50%;background:{C["lavf"]};color:{C["sable"]};display:grid;place-items:center;font-weight:800;font-size:28px">{n}</span>'
            f'<span class="D" style="font-weight:720;font-size:34px;letter-spacing:-.02em">{t}</span></div>'
            f'<div style="display:flex;gap:14px">'
            f'<div style="flex:1;padding:18px 20px;border-radius:20px;background:rgba(26,26,26,.05)"><div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:18px;color:rgba(26,26,26,.55)">{ko}À éviter</div>'
            f'<div style="margin-top:8px;font-weight:550;font-size:23px;line-height:1.3">{avant}</div></div>'
            f'<div style="flex:1;padding:18px 20px;border-radius:20px;background:{C["lavc"]}"><div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:18px;color:{C["lavt"]}">{check(C["lavt"], 20)}Préférez</div>'
            f'<div style="margin-top:8px;font-weight:550;font-size:23px;line-height:1.3">{apres}</div></div></div>')


def pile(blocs, gap=18):
    out, y = '', 0
    for html, h in blocs:
        out += carte(0, y, 904, html, pad='26px 30px', rad=32)
        y += h + gap
    return out, y - gap


# ---------- 5 · les images (gestes 1 et 2) ----------
def p5():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(5, 'lavc')
    v, h = pile([(bloc(1, 'Un texte alternatif', 'Laisser le champ vide', 'Affiche du concert du Nouvel An, samedi 16 janvier à 18 h, église'), 250),
                 (bloc(2, 'L’affiche reprise en texte', 'Seulement « Venez nombreux ! »', 'La date, l’heure et le lieu dans la légende'), 250)])
    b += mise(tflow('Pour les images,', 'tout dire en texte.', 92, C['encre'], C['lavt']), v, h,
              pied('Le champ « texte alternatif » existe sur Instagram,<br>Facebook, LinkedIn et sur votre site.'))
    return b


# ---------- 6 · le texte (gestes 3, 4, 5) ----------
def p6():
    b = motif(MOTIF['lav'], 2300, 120, -420) + hd(6, 'lav')
    v, h = pile([(bloc(3, 'Des emojis comptés', f'Un emoji <span style="{EMO}">✨</span> tous <span style="{EMO}">🎄</span> les mots', f'Un ou deux, en fin de phrase <span style="{EMO}">🎶</span>'), 230),
                 (bloc(4, 'Des mots-dièse lisibles', '#concertdunouvelan', '#ConcertDuNouvelAn'), 230),
                 (bloc(5, 'Ni capitales ni polices fantaisie', 'INSCRIPTIONS OUVERTES', 'Inscriptions ouvertes'), 230)], 16)
    b += mise(tflow('Pour le texte,', 'rester simple.', 92, C['encre'], C['lavt']), v, h)
    return b


# ---------- 7 · contraste et vidéos (gestes 6 et 7) ----------
def p7():
    b = motif(MOTIF['lavc'], 2300, 120, -420) + hd(7, 'lavc')
    w = 444
    c1 = (f'<div style="display:flex;align-items:center;gap:14px;padding-bottom:16px">'
          f'<span class="D" style="width:52px;height:52px;border-radius:50%;background:{C["lavf"]};color:{C["sable"]};display:grid;place-items:center;font-weight:800;font-size:28px">6</span>'
          f'<span class="D" style="font-weight:720;font-size:32px;letter-spacing:-.02em">Du contraste</span></div>'
          f'<div style="display:flex;gap:12px">'
          f'<div style="flex:1;height:200px;border-radius:20px;background:#EEE9F7;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:26px;color:#C9C0DA">Gris clair</div>'
          f'<div style="flex:1;height:200px;border-radius:20px;background:{C["lavf"]};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:26px;color:#fff">Bien lisible</div></div>'
          f'<div style="margin-top:14px;font-weight:550;font-size:22px;line-height:1.3;color:rgba(26,26,26,.6)">Texte foncé sur fond clair, ou l’inverse. Jamais sur une photo.</div>')
    c2 = (f'<div style="display:flex;align-items:center;gap:14px;padding-bottom:16px">'
          f'<span class="D" style="width:52px;height:52px;border-radius:50%;background:{C["lavf"]};color:{C["sable"]};display:grid;place-items:center;font-weight:800;font-size:28px">7</span>'
          f'<span class="D" style="font-weight:720;font-size:32px;letter-spacing:-.02em">Des sous-titres</span></div>'
          f'<div style="position:relative;height:200px;border-radius:20px;overflow:hidden">'
          f'<img src="{HD}salle-chaises.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 60%">'
          f'<div style="position:absolute;left:14px;right:14px;bottom:14px;padding:10px 14px;border-radius:12px;background:{C["encre"]};color:#fff;font-weight:600;font-size:19px;line-height:1.3">Le conseil se réunit jeudi à 20 h, salle du conseil.</div></div>'
          f'<div style="margin-top:14px;font-weight:550;font-size:22px;line-height:1.3;color:rgba(26,26,26,.6)">Vidéos sous-titrées ; PDF doublés d’un texte sur le site.</div>')
    v = carte(0, 0, w, c1, pad='26px 28px', rad=32) + carte(w + 16, 0, w, c2, pad='26px 28px', rad=32)
    b += mise(tflow('Pour tout le reste,', 'contraste et sous-titres.', 88, C['encre'], C['lavt']), v, 420,
              pied('Le test : relire la publication sur un téléphone,<br>à bout de bras, puis sans le son.'))
    return b


# ---------- 8 · le résultat ----------
def p8():
    b = motif(MOTIF['lavf'], 2300, 120, -420) + hd(8, 'lavf')
    leg = 'Concert du Nouvel An samedi 16 janvier à 18 h, église du bourg. Entrée libre. <span style="font-family:\'Noto Color Emoji\'">🎶</span>'
    v = f'<div style="position:absolute;left:0;top:0;transform:rotate(-2deg)">{post(400, leg)}</div>'
    v += (f'<div style="position:absolute;left:440px;top:110px;width:464px">'
          + voix('« Affiche du concert du Nouvel An, samedi 16 janvier à 18 h, église du bourg. Entrée libre. »', 34) + '</div>')
    v += (f'<div style="position:absolute;left:440px;top:480px;display:flex;flex-direction:column;gap:12px">'
          + ''.join(pill(t, C['sable'], C['lavf'], 54, 23, icon=check(C['lavf'], 22)) for t in ('La date', 'L’heure', 'Le lieu')) + '</div>')
    b += mise(tflow('La même publication,', 'lue en entier.', 88, C['sable'], C['lavc']), v, 680,
              pied('Et plus claire pour tout le monde.', C['sable']))
    return b


def p9():
    return fin(N, 9, MOTIF['lavf'], 'À chaque publication,<br>sept gestes.', 'On peut s’en occuper pour vous.', C['lavc'])


PAGES = [(p1, C['lavc']), (p2ctx, C['lav']), (p2, C['lavf']), (p3, C['lavc']), (p4, C['lavf']), (p5, C['lavc']), (p6, C['lav']), (p7, C['lavc']), (p8, C['lavf']), (p9, C['lavf'])]

TEXTE = """Affiches, programmes, horaires : sur les réseaux, beaucoup d'informations passent par une image. Une affiche publiée sans texte, un lecteur d'écran la lit ainsi : « Image. Venez nombreux ! Cotillons. Musique. Étincelles. » Ni la date, ni l'heure, ni le lieu.

Ça ne concerne pas que quelques personnes : lecteur d'écran, texte agrandi sur un téléphone, vidéo regardée sans le son dans le bus. Pour les communes, c'est aussi une obligation (loi du 11 février 2005, article 47) ; pour certaines entreprises, un cadre européen depuis le 28 juin 2025.

Sept gestes suffisent : un texte alternatif sur l'image, l'affiche reprise en texte dans la légende, des emojis comptés, des mots-dièse avec majuscules, ni capitales ni polices fantaisie, du contraste, des sous-titres.

La même publication est alors lue en entier, et plus claire pour tout le monde.

Écrivez-nous, on regarde ça ensemble."""
TAGS = "\n\n#accessibilite #communication #collectivites #reseauxsociaux #inclusion"

if __name__ == '__main__':
    for i, (f, bg) in enumerate(PAGES):
        page(f'ga3-{i + 1:02d}', bg, f(), end=1)
    print('ok')
