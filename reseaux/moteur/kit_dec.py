"""Briques partagées des posts de décembre 2026 (calendrier 2027, fêtes, affiche) : en-têtes par famille,
mentions, coches, téléphone et navigateur. S'appuie sur v2 (mise2, tete, carte) et lgen."""
import sys
sys.path.insert(0, '/home/claude/fill/reseaux/canevas')
from lgen import C, MOTIF, NB, logo, motif, head, check, page
from guide2 import ico
from v2 import pill, rond_fleche, fin, av, M, cadre, carte, OMBRE, HD, tete, mise2

GRIS = 'rgba(26,26,26,.55)'


def hd(N, i, fond):
    """En-tête (logo + tirets) selon le fond de page."""
    if fond in ('lavf', 'corf'):
        l2 = C['lav'] if fond == 'lavf' else C['corc']
        return head(N, i, logo(44, C['sable'], l2, C['cor'] if fond == 'lavf' else C['lav']), C['lavc'] if fond == 'lavf' else C['corc'], 'rgba(248,245,242,.24)')
    if fond == 'lav':
        return head(N, i, logo(44, C['encre'], C['lavf'], C['cor']), C['encre'], 'rgba(26,26,26,.16)')
    if fond == 'cor':
        return head(N, i, logo(44, C['encre'], C['corc'], C['corf']), C['encre'], 'rgba(26,26,26,.16)')
    if fond == 'corc':
        return head(N, i, logo(44, C['encre'], C['lav'], C['cor']), C['corf'], 'rgba(26,26,26,.14)')
    return head(N, i, logo(44, C['encre'], C['lav'], C['cor']), C['lavf'], 'rgba(26,26,26,.14)')


def fond(nom):
    return motif(MOTIF[nom], 2300, 120, -420)


def ent(t, col=None, fs=18):
    return f'<div style="font-weight:700;font-size:{fs}px;letter-spacing:.08em;text-transform:uppercase;color:{col or C["lavt"]}">{t}</div>'


def coche(s=36, r=10, bg=None, fg=None):
    return (f'<span style="flex:none;width:{s}px;height:{s}px;border-radius:{r}px;background:{bg or C["lavf"]};display:grid;place-items:center">'
            f'{check(fg or C["sable"], round(s * .58))}</span>')


def croix(s=36, r=10, bg='rgba(26,26,26,.08)', fg='rgba(26,26,26,.55)'):
    return (f'<span style="flex:none;width:{s}px;height:{s}px;border-radius:{r}px;background:{bg};display:grid;place-items:center">'
            f'<svg viewBox="0 0 24 24" width="{round(s*.5)}" height="{round(s*.5)}" fill="none" stroke="{fg}" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></span>')


def barre_nav(url, couleurs=('#E9E1FF', '#DDD2FF', '#CDBEFF')):
    """Barre de navigateur (maquette de site)."""
    return (f'<div style="display:flex;align-items:center;gap:10px;padding:0 0 20px">'
            + ''.join(f'<span style="width:14px;height:14px;border-radius:50%;background:{c}"></span>' for c in couleurs)
            + f'<span style="flex:1;margin-left:12px;height:38px;border-radius:19px;background:rgba(26,26,26,.05);display:flex;align-items:center;padding:0 18px;font-weight:550;font-size:18px;color:{GRIS}">{url}</span></div>')


def entete_post(nom, sous='', ini='VS', bg=None, s=44):
    return (f'<div style="display:flex;align-items:center;gap:12px;padding-bottom:14px">{av(ini, bg or C["lavc"], s=s)}'
            f'<div><b style="font-size:21px">{nom}</b>' + (f'<div style="font-weight:550;font-size:16px;color:{GRIS}">{sous}</div>' if sous else '')
            + '</div><span style="margin-left:auto;font-weight:800;font-size:24px;letter-spacing:2px;color:rgba(26,26,26,.4)">···</span></div>')


def icones_post(col='#1A1A1A'):
    return (f'<div style="display:flex;gap:18px;align-items:center;padding:14px 4px 4px">{ico("heart", 30, col)}{ico("com", 30, col)}{ico("send", 30, col)}'
            f'<span style="margin-left:auto">{ico("save", 30, col)}</span></div>')
