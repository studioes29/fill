from lgen import C, MOTIF, PH, SH, logo, motif, check, arrow, page

F = "font-family:'Inter Tight',sans-serif"


def foot(dark=True, txt='Service communication externalisé<br>pour les collectivités et les entreprises'):
    col = 'rgba(248,245,242,.82)' if dark else 'rgba(26,26,26,.7)'
    bg = C['sable'] if dark else C['encre']
    ac = C['encre'] if dark else C['sable']
    return (f'<div style="position:absolute;left:88px;right:88px;bottom:84px;display:flex;align-items:center;justify-content:space-between">'
            f'<span style="font-weight:600;font-size:27px;line-height:1.35;color:{col}">{txt}</span>'
            f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{bg}">{arrow(ac, 42)}</span></div>')


def top(fi, tagbg, tagcol):
    return (f'<div style="position:absolute;left:88px;top:88px">{logo(56, fi)}</div>'
            f'<div style="position:absolute;right:88px;top:92px"><span class="tag" style="height:52px;font-size:24px;padding:0 24px;background:{tagbg};color:{tagcol}">Nouveau</span></div>')


# ---------- A · Organigramme ----------
def box(x, y, w, label, on=False):
    if on:
        return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:170px;border-radius:30px;background:#fff;box-shadow:0 0 0 8px {C["lav"]},{SH};'
                f'display:flex;flex-direction:column;justify-content:center;gap:12px;padding:0 30px;transform:rotate(-2deg)">'
                f'<span style="font-weight:650;font-size:24px;color:rgba(26,26,26,.55)">{label}</span>'
                f'<span style="display:flex;align-items:center;justify-content:space-between">{logo(52)}'
                f'<span style="display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;background:{C["lavf"]}">{check(C["sable"], 26)}</span></span></div>')
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:120px;border-radius:26px;background:rgba(248,245,242,.12);box-shadow:inset 0 0 0 2px rgba(248,245,242,.18);'
            f'display:flex;align-items:center;justify-content:center;font-weight:600;font-size:25px;color:rgba(248,245,242,.75)">{label}</div>')


def coverA():
    b = motif(MOTIF['lavf'], 1700, 300, -260)
    b += top(C['sable'], C['lavc'], C['lavt'])
    ln = 'rgba(248,245,242,.32)'
    xs=[88,288,488]; cy=560
    b += f'<div style="position:absolute;left:539px;top:{240+120}px;width:3px;height:{cy-360-50}px;background:{ln}"></div>'
    b += f'<div style="position:absolute;left:178px;top:{cy-50}px;width:662px;height:3px;background:{ln}"></div>'
    for x in [178,378,578,839]:
        b += f'<div style="position:absolute;left:{x}px;top:{cy-50}px;width:3px;height:50px;background:{ln}"></div>'
    b += box(370, 240, 340, 'Direction')
    for x,l in zip(xs,['Accueil','Technique','Finances']): b += box(x, cy, 180, l)
    b += box(690, cy-20, 302, 'Communication', on=True)
    b += (f'<div style="position:absolute;left:88px;right:88px;top:800px">'
          f'<div class="D" style="font-weight:650;font-size:118px;line-height:.94;letter-spacing:-.045em;color:{C["sable"]}">Un service com,</div>'
          f'<div class="I" style="font-size:104px;line-height:1.04;letter-spacing:-.02em;color:{C["lavc"]};margin-top:6px">sans recruter.</div></div>')
    b += foot(True)
    return b


# ---------- B · La question ----------
def coverB():
    b = motif('rgba(184,164,255,.10)', 2300, 120, -420)
    b += top(C['sable'], C['lav'], C['encre'])
    b += (f'<div style="position:absolute;left:88px;right:60px;top:250px">'
          f'<div class="D" style="font-weight:650;font-size:136px;line-height:.92;letter-spacing:-.05em;color:{C["sable"]}">Qui s’occupe<br>de votre com</div>'
          f'<div class="I" style="font-size:120px;line-height:1.02;letter-spacing:-.02em;color:{C["lav"]};margin-top:4px">cette semaine ?</div></div>')
    # réponse : notification
    b += (f'<div class="card" style="left:130px;top:800px;width:780px;padding:28px 30px;border-radius:34px;transform:rotate(-2deg);display:flex;align-items:center;gap:22px">'
          f'<span style="flex:none;display:flex;align-items:center;justify-content:center;width:92px;height:92px;border-radius:24px;background:{C["lavc"]}">{logo(30)}</span>'
          f'<span style="flex:1;display:flex;flex-direction:column;gap:6px"><span style="display:flex;justify-content:space-between"><b style="font-size:24px">Fill</b><small style="font-size:20px;color:rgba(26,26,26,.45)">à l’instant</small></span>'
          f'<span style="font-weight:500;font-size:28px;line-height:1.25">Votre affiche est prête à relire.</span></span></div>')
    b += (f'<div class="card" style="left:180px;top:960px;width:760px;padding:28px 30px;border-radius:34px;transform:rotate(1.5deg);display:flex;align-items:center;gap:22px">'
          f'<span style="flex:none;display:flex;align-items:center;justify-content:center;width:92px;height:92px;border-radius:24px;background:{C["lavf"]}">{check(C["sable"], 40)}</span>'
          f'<span style="flex:1;display:flex;flex-direction:column;gap:6px"><span style="display:flex;justify-content:space-between"><b style="font-size:24px">Fill</b><small style="font-size:20px;color:rgba(26,26,26,.45)">samedi, 10 h</small></span>'
          f'<span style="font-weight:500;font-size:28px;line-height:1.25">Publié sur votre site et vos réseaux.</span></span></div>')
    b += foot(True)
    return b


# ---------- C · Trois lignes ----------
def coverC():
    b = motif(MOTIF['lavc'], 1600, 360, -220)
    b += top(C['encre'], C['lavf'], C['sable'])
    b += (f'<div style="position:absolute;left:88px;right:88px;top:200px">'
          f'<div class="D" style="font-weight:650;font-size:118px;line-height:.94;letter-spacing:-.045em">Trois lignes.</div>'
          f'<div class="I" style="font-size:96px;line-height:1.04;letter-spacing:-.02em;color:{C["lavt"]};margin-top:6px">Votre com est faite.</div></div>')
    # demande
    b += (f'<div class="card" style="left:88px;top:580px;width:520px;padding:30px;transform:rotate(-3deg);display:flex;flex-direction:column;gap:14px">'
          f'<span style="font-weight:650;font-size:24px">Nouvelle demande</span>'
          f'<span style="padding:18px 20px;border-radius:16px;background:{C["sable"]};font-weight:500;font-size:25px;line-height:1.4">Portes ouvertes samedi, 10 h à 17 h. Une affiche, un post et une actu sur le site.</span>'
          f'<span style="display:flex;justify-content:flex-end"><span class="btn" style="height:60px;padding:0 28px;background:{C["encre"]};color:{C["sable"]};font-size:22px">Envoyer {arrow(C["sable"], 24)}</span></span></div>')
    # affiche
    b += (f'<div class="ph" style="position:absolute;left:640px;top:530px;width:350px;height:470px;border-radius:28px;transform:rotate(4deg);box-shadow:{SH};background:{C["lavf"]};display:flex;flex-direction:column;justify-content:flex-end;padding:28px">'
          f'<img src="{PH["atelier"]}" style="object-position:center 40%">'
          f'<span style="position:absolute;left:0;right:0;bottom:0;height:70%;background:linear-gradient(180deg,rgba(112,82,179,0),rgba(112,82,179,.95) 70%)"></span>'
          f'<span class="D" style="position:relative;font-weight:700;font-size:54px;line-height:.92;letter-spacing:-.035em;color:{C["sable"]}">Portes<br>ouvertes</span>'
          f'<span style="position:relative;margin-top:12px;font-weight:600;font-size:21px;color:{C["lavc"]}">Samedi, 10 h à 17 h</span></div>')
    b += (f'<div style="position:absolute;left:340px;top:1000px;transform:rotate(-2deg);display:inline-flex;align-items:center;gap:14px;height:76px;padding:0 30px 0 14px;border-radius:999px;background:#fff;box-shadow:{SH};font-weight:650;font-size:25px;white-space:nowrap">'
          f'<span style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:50%;background:{C["lavf"]}">{check(C["sable"], 26)}</span>Affiche, post et actu : publiés</div>')
    b += foot(False)
    return b


if __name__ == '__main__':
    page('cA', C['lavf'], coverA(), end=1)
    page('cB', C['encre'], coverB(), end=1)
    page('cC', C['lavc'], coverC(), end=1)
    print('ok')
