from lgen import C, NB, logo

GRAIN = ("data:image/svg+xml;utf8," +
         "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")

def chrome(left, top, w, h, rx=10, ry=-16, rz=-5, big=180, sub=True):
    eng = 'color:#2A2440;text-shadow:0 1.5px 0 rgba(255,255,255,.85),0 -1px 0 rgba(30,20,60,.35)'
    r = round(h * .095)
    face = (
        # base métal : dégradé argent à reflets lavande
        f'background:linear-gradient(118deg,#EDEAF4 0%,#C9C2DA 14%,#F9F8FC 27%,#D8D2E6 38%,#AFA5C8 52%,#E7E3F0 63%,#FCFBFE 72%,#C2BAD6 86%,#E6E2EF 100%);'
    )
    layers = (
        # brossage horizontal fin
        f'<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.10) 0 1px,rgba(60,40,100,.035) 1px 2px,rgba(255,255,255,0) 2px 3px)"></div>'
        # irisation discrète
        f'<div style="position:absolute;inset:0;background:conic-gradient(from 210deg at 70% 40%,rgba(184,164,255,.25),rgba(255,200,190,.16),rgba(170,220,255,.18),rgba(184,164,255,.25));mix-blend-mode:soft-light"></div>'
        # reflet d'environnement (fenêtre)
        f'<div style="position:absolute;inset:0;background:linear-gradient(104deg,rgba(255,255,255,0) 22%,rgba(255,255,255,.75) 30%,rgba(255,255,255,0) 36%,rgba(255,255,255,0) 58%,rgba(255,255,255,.35) 62%,rgba(255,255,255,0) 68%)"></div>'
        # ombrage bas droite
        f'<div style="position:absolute;inset:0;background:radial-gradient(120% 90% at 100% 110%,rgba(60,40,110,.30),rgba(60,40,110,0) 55%)"></div>'
        # grain
        f'<div style="position:absolute;inset:0;background-image:url(&quot;{GRAIN}&quot;);opacity:.35;mix-blend-mode:overlay"></div>'
    )
    content = (
        f'<div style="position:absolute;left:{round(w*.065)}px;top:{round(h*.11)}px;filter:drop-shadow(0 1.5px 0 rgba(255,255,255,.8))">{logo(round(h*.1), "#2A2440", "#2A2440", "#2A2440")}</div>'
        f'<div style="position:absolute;right:{round(w*.065)}px;top:{round(h*.125)}px;font-weight:650;font-size:{round(h*.062)}px;letter-spacing:.01em;{eng}">Jusqu’au 30 novembre</div>'
        f'<div style="position:absolute;left:{round(w*.06)}px;bottom:{round(h*.1)}px;display:flex;align-items:baseline;gap:{round(w*.025)}px">'
        f'<span class="D" style="font-weight:800;font-size:{big}px;line-height:.8;letter-spacing:-.05em;{eng}">+50{NB}%</span>'
        + (f'<span style="font-weight:650;font-size:{round(h*.08)}px;line-height:1.12;{eng}">d’unités<br>le 1<sup>er</sup> mois</span>' if sub else '') + '</div>'
    )
    edge = f'<div style="position:absolute;inset:0;border-radius:{r}px;box-shadow:inset 0 2px 0 rgba(255,255,255,.95),inset 0 -2px 0 rgba(40,25,80,.28),inset 2px 0 0 rgba(255,255,255,.6),inset -2px 0 0 rgba(40,25,80,.18)"></div>'
    t = f'perspective(2200px) rotateX({rx}deg) rotateY({ry}deg) rotateZ({rz}deg)'
    return (
        # ombre portée au sol
        f'<div style="position:absolute;left:{left + w*.08}px;top:{top + h*.62}px;width:{w*.88}px;height:{h*.5}px;border-radius:50%;background:rgba(20,8,50,.55);filter:blur(46px);transform:rotate({rz}deg)"></div>'
        f'<div style="position:absolute;left:{left}px;top:{top}px;width:{w}px;height:{h}px;transform:{t};transform-style:preserve-3d">'
        # tranche (épaisseur)
        f'<div style="position:absolute;inset:0;border-radius:{r}px;background:linear-gradient(118deg,#9C93B5,#6F6690);transform:translate3d(5px,9px,-10px)"></div>'
        f'<div style="position:absolute;inset:0;border-radius:{r}px;overflow:hidden;{face}">{layers}{content}</div>{edge}</div>'
    )
