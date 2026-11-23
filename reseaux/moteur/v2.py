"""Briques communes des posts « v2 » (novembre 2026) : photo en grand, un seul message par page,
cartes plus graphiques, animations pour les couvertures. S'appuie sur lgen (polices, couleurs, logo, motif, page)."""
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page, A, CNT
from guide2 import ico, F_D

HD = 'file:///home/claude/photos_hd/'
M = 88  # marge


def photo(k, x, y, w, h, pos='center', rad=0, anim=True, extra=''):
    """Photo recadrée ; anim : léger zoom avant (Ken Burns) dans les vidéos."""
    za = A('zoom', 0, 5.5) if anim else ''
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{rad}px;overflow:hidden;{extra}">'
            f'<img {za} src="{HD}{k}.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{pos};transform-origin:50% 50%"></div>')


def fondu(col, y, h, a0=0, a1=1, x=0, w=1080):
    """Dégradé vertical de transparent vers une couleur (rgb « r,g,b »)."""
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'background:linear-gradient(180deg,rgba({col},{a0}) 0%,rgba({col},{a1}) 100%)"></div>')


def rgb(hexa):
    hexa = hexa.lstrip('#')
    return ','.join(str(int(hexa[i:i + 2], 16)) for i in (0, 2, 4))


def pill(t, bg, fg, h=56, fs=24, extra='', icon=''):
    return (f'<span style="display:inline-flex;align-items:center;gap:10px;height:{h}px;padding:0 {round(h*.42)}px;border-radius:999px;'
            f'background:{bg};color:{fg};font-weight:650;font-size:{fs}px;white-space:nowrap;{extra}">{icon}{t}</span>')


def titre(l1, l2, x=M, y=168, fs=96, c1=C['encre'], c2=C['cort'], w=None, anim=None):
    ww = f'width:{w}px' if w else f'right:{M}px'
    a1 = A('up', anim, .7) if anim is not None else ''
    a2 = A('up', anim + .25, .7) if anim is not None else ''
    return (f'<div style="position:absolute;left:{x}px;{ww};top:{y}px">'
            f'<div {a1} class="D" style="font-weight:680;font-size:{fs}px;line-height:.95;letter-spacing:-.045em;color:{c1}">{l1}</div>'
            f'<div {a2} class="I" style="font-size:{round(fs*.84)}px;line-height:1.04;letter-spacing:-.02em;color:{c2};margin-top:8px">{l2}</div></div>')


def rond_fleche(x, y, bg, fg, s=104, anim=None):
    a = A('pop', anim, .5) if anim is not None else ''
    return (f'<span {a} style="position:absolute;left:{x}px;top:{y}px;display:grid;place-items:center;width:{s}px;height:{s}px;border-radius:50%;background:{bg}">'
            f'{arrow(fg, round(s*.4))}</span>')


def av(t, bg, fg=C['encre'], s=56):
    return (f'<span style="flex:none;width:{s}px;height:{s}px;border-radius:50%;background:{bg};color:{fg};display:grid;place-items:center;'
            f'font-weight:750;font-size:{round(s*.36)}px">{t}</span>')


def notif(x, y, w, a, bg, nom, msg, h_, rot=0, anim='', fs=1.0):
    """Notification de messagerie (carte blanche, ombre douce)."""
    return (f'<div {anim} style="position:absolute;left:{x}px;top:{y}px;width:{w}px;padding:{round(20*fs)}px {round(24*fs)}px;border-radius:{round(30*fs)}px;background:#fff;'
            f'display:flex;align-items:center;gap:{round(18*fs)}px;transform:rotate({rot}deg);box-shadow:0 30px 60px -30px rgba(20,10,40,.55)">{av(a, bg, s=round(58*fs))}'
            f'<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;gap:10px"><b style="font-size:{round(23*fs)}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{nom}</b>'
            f'<span style="flex:none;font-weight:600;font-size:{round(19*fs)}px;color:rgba(26,26,26,.45)">{h_}</span></div>'
            f'<div style="margin-top:3px;font-weight:500;font-size:{round(22*fs)}px;color:rgba(26,26,26,.66);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{msg}</div></div></div>')


def fin(N, act, bg_motif, l1, l2, c_acc, c_motif_logo=None, sous='Collectivités et entreprises, partout en France'):
    """Dernière page : logo centré, phrase, pastille fill.studioes.fr."""
    b = motif(bg_motif, 1700, 300, -220)
    b += f'<div style="position:absolute;right:{M}px;top:96px">{dashes_(N, act, c_acc)}</div>'
    b += f'<div style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center">{logo(210, C["sable"], c_acc, C["cor"] if c_acc != C["cor"] else C["lav"])}</div>'
    b += (f'<div style="position:absolute;left:{M}px;right:{M}px;top:560px;text-align:center">'
          f'<div class="D" style="font-weight:680;font-size:84px;line-height:.98;letter-spacing:-.04em;color:{C["sable"]}">{l1}</div>'
          f'<div class="I" style="font-size:46px;color:{c_acc};margin-top:22px">{l2}</div></div>')
    b += (f'<div style="position:absolute;left:0;right:0;top:960px;display:flex;flex-direction:column;align-items:center;gap:30px">'
          f'<span style="display:inline-flex;align-items:center;height:100px;padding:0 46px;border-radius:999px;background:#fff;box-shadow:0 0 0 10px {c_acc};font-weight:650;font-size:40px">fill.studioes.fr</span>'
          f'<span style="font-weight:500;font-size:28px;color:rgba(248,245,242,.8)">{sous}</span></div>')
    return b


def dashes_(n, act, on, off='rgba(248,245,242,.26)'):
    return '<div style="display:flex;gap:10px">' + ''.join(f'<span style="width:40px;height:6px;border-radius:3px;background:{on if i == act else off}"></span>' for i in range(n)) + '</div>'


# ---------- mise en page équilibrée (v3, 23 nov.) ----------
OMBRE = '0 16px 34px -22px rgba(26,26,26,.32)'


def tflow(l1, l2, fs=88, c1=C['encre'], c2=C['cort'], pre=''):
    """Titre + relance dans le flux (pour mise())."""
    return (f'<div>{pre}<div class="D" style="font-weight:680;font-size:{fs}px;line-height:.96;letter-spacing:-.045em;color:{c1}">{l1}</div>'
            f'<div class="I" style="font-size:{round(fs*.84)}px;line-height:1.05;letter-spacing:-.02em;color:{c2};margin-top:6px">{l2}</div></div>')


def pied(txt, col='rgba(26,26,26,.78)', fs=32):
    return f'<div style="font-weight:550;font-size:{fs}px;line-height:1.32;color:{col}">{txt}</div>'


def mise(titre_html, visuel, h, pied_html='', top=176):
    """Titre en haut, pied calé sur la marge basse, visuel centré entre les deux : espaces égaux."""
    return (f'<div style="position:absolute;left:{M}px;right:{M}px;top:{top}px;bottom:{M}px;display:flex;flex-direction:column;justify-content:space-between">'
            f'{titre_html}<div class="vis" style="position:relative;height:{h}px;flex:none">{visuel}</div>{pied_html or "<div></div>"}</div>'
            + MESURE)


# hauteur réelle du visuel (enfants positionnés) : mesurée une fois les polices chargées
MESURE = ("<script>(function(){function m(){document.querySelectorAll('.vis').forEach(function(v){var t=v.getBoundingClientRect().top,b=0;"
          "v.querySelectorAll('*').forEach(function(e){if(e.closest('svg')&&e.tagName!=='svg')return;var r=e.getBoundingClientRect();if(r.height>0)b=Math.max(b,r.bottom-t)});"
          "if(b>0)v.style.height=Math.round(b)+'px'})}m();if(document.fonts)document.fonts.ready.then(m)})();</script>")


def jour(t, bg, fg):
    """Pastille du jour au-dessus du titre."""
    return f'<div style="margin-bottom:22px">{pill(t, bg, fg, 54, 23, icon=ico("clock", 22, fg))}</div>'


def cadre(k, x, y, w, h, pos='center', rad=36):
    return photo(k, x, y, w, h, pos, rad, anim=False)


def carte(x, y, w, inner, pad='28px 32px', rad=32, rot=0, bg='#fff', extra=''):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;padding:{pad};border-radius:{rad}px;background:{bg};'
            f'box-shadow:{OMBRE};transform:rotate({rot}deg);{extra}">{inner}</div>')
