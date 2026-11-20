import os, sys, math
sys.path.insert(0, '/home/claude/canvas')
from gen import C, MOTIF, L1, L2, L2m, FI, NB, CHROME, wavy

OUT = '/home/claude/launch/html'
os.makedirs(OUT, exist_ok=True)
PH = {k: f'file:///home/claude/photos/{k}.jpg' for k in ['mairie', 'bureau', 'atelier', 'marche', 'lecture', 'photographe']}

FONTS = """@font-face{font-family:'Bricolage Grotesque';font-weight:200 800;src:url(file:///home/claude/studioes29/fill/assets/f/br.woff2)}
@font-face{font-family:'Inter Tight';font-weight:100 900;src:url(file:///home/claude/studioes29/fill/assets/f/it.woff2)}
@font-face{font-family:'Urbanist';font-style:italic;font-weight:100 900;src:url(file:///home/claude/studioes29/fill/assets/f/ur-i.woff2)}"""

CSS = FONTS + """
*{box-sizing:border-box}body{margin:0;background:#000}
.pg{position:relative;width:1080px;height:1350px;overflow:hidden;font-family:'Inter Tight',sans-serif;color:#1A1A1A}
.D{font-family:'Bricolage Grotesque',sans-serif}.I{font-family:'Urbanist',sans-serif;font-style:italic;font-weight:300}
.ttl{position:absolute;left:88px;right:88px;top:168px;font-family:'Bricolage Grotesque';font-weight:650;font-size:100px;line-height:.96;letter-spacing:-.04em}
.ttl .I{display:block;letter-spacing:-.02em;margin-top:6px}
.sub{position:absolute;left:88px;right:88px;font-weight:500;font-size:32px;line-height:1.35}
.card{position:absolute;background:#fff;border-radius:36px;box-shadow:0 50px 90px -45px rgba(26,26,26,.5)}
.tag{display:inline-flex;align-items:center;height:42px;padding:0 18px;border-radius:999px;font-weight:650;font-size:21px;white-space:nowrap}
.ph{position:relative;overflow:hidden}.ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.nt{position:absolute;width:760px;height:92px;border-radius:30px;background:#fff;display:flex;align-items:center;gap:18px;padding:0 28px;box-shadow:0 30px 50px -30px rgba(0,0,0,.6)}
.av{flex:none;display:flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:50%;font-weight:700;font-size:21px;color:#1A1A1A}
.nt b{display:block;font-size:20px}.nt span.m{font-size:24px;font-weight:500}.nt small{position:absolute;right:28px;top:20px;font-size:18px;color:rgba(26,26,26,.45)}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;height:72px;border-radius:999px;font-weight:650;font-size:25px}
"""

JS = """
const P=(t,a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
const E=p=>1-Math.pow(1-p,3);
const B=p=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2)};
const EL=[...document.querySelectorAll('[data-a]')];
EL.forEach(e=>{e._r=parseFloat(e.dataset.r||0);if(e.dataset.a==='type'){e._full=e.textContent;}});
window.END=parseFloat(document.body.dataset.end||6);
window.seek=function(t){
 EL.forEach(e=>{
  const [k,s,d]=[e.dataset.a,parseFloat(e.dataset.s||0),parseFloat(e.dataset.d||.6)];
  const p=P(t,s,s+d);let o=1,x=0,y=0,sc=1;
  if(k==='up'){o=E(p);y=(1-E(p))*70}
  else if(k==='pop'){o=Math.min(1,p*3);sc=.55+.45*B(p)}
  else if(k==='fall'){o=Math.min(1,p*4);y=-(1-B(p))*420}
  else if(k==='fade'){o=p}
  else if(k==='left'){o=E(p);x=-(1-E(p))*160}
  else if(k==='right'){o=E(p);x=(1-E(p))*160}
  else if(k==='dim'){o=1-.55*p;e.style.opacity=o;return}
  else if(k==='type'){const n=Math.round(e._full.length*p);e.textContent=e._full.slice(0,n);e.classList.toggle('typing',p>0&&p<1);return}
  else if(k==='count'){const a=parseFloat(e.dataset.from||0),b=parseFloat(e.dataset.to);e.textContent=Math.round(a+(b-a)*E(p));return}
  else if(k==='steps'){const ts=e.dataset.times.split(',').map(Number);e.textContent=ts.filter(v=>t>=v).length+(parseInt(e.dataset.base||0));return}
  else if(k==='grow'){e.style.transform=`scaleX(${E(p)})`;e.style.opacity=p>0?1:0;return}
  else if(k==='cum'){const ts=e.dataset.times.split(',').map(Number),vs=e.dataset.vals.split(',');let v=e.dataset.base||'0';ts.forEach((x,i)=>{if(t>=x)v=vs[i]});e.textContent=v;return}
  else if(k==='draw'){e.style.strokeDashoffset=1-E(p);return}
  else if(k==='win'){const a=P(t,s,s+.35),z=1-P(t,s+d-.35,s+d);o=Math.min(a,z);y=(1-E(a))*30}
  else if(k==='show'){e.style.visibility=t>=s?'visible':'hidden';return}
  else if(k==='hidef'){e.style.visibility=t>=s?'hidden':'visible';return}
  else if(k==='tap'){const q=P(t,s,s+.7);o=q>0&&q<1?Math.sin(q*Math.PI)*.85:0;sc=.4+q*1.1}
  else if(k==='press'){const q=P(t,s,s+.35);sc=1-.08*Math.sin(q*Math.PI)}
  e.style.opacity=o;e.style.transform=`translate(${x}px,${y}px) rotate(${e._r}deg) scale(${sc})`;
 });
};
window.seek(window.END);
"""


def logo(h, fi=C['encre'], l1=C['lav'], l2=C['cor'], draw=None):
    w = round(h * 1376 / 720)
    a1 = a2 = af = ''
    if draw:
        s0 = draw
        af = f' data-a="fade" data-s="{s0}" data-d="0.4"'
        a1 = f' pathLength="1" stroke-dasharray="1" data-a="draw" data-s="{s0+0.3}" data-d="0.7"'
        a2 = f' pathLength="1" stroke-dasharray="1" data-a="draw" data-s="{s0+0.9}" data-d="0.9"'
    return (f'<svg viewBox="0 0 1376 720" width="{w}" height="{h}" style="display:block;overflow:visible">'
            f'<g fill="{fi}"{af}>{FI}</g><g fill="none" stroke-width="96" stroke-linecap="round" stroke-linejoin="round">'
            f'<path stroke="{l1}" d="{L1}"{a1}/><path stroke="{l2}" d="{L2}"{a2}/></g></svg>')


def motif(col, h, left, top, rot=0):
    w = round(h * 610 / 720)
    return (f'<svg viewBox="500 0 610 720" width="{w}" height="{h}" style="position:absolute;left:{left}px;top:{top}px;transform:rotate({rot}deg)">'
            f'<g fill="none" stroke="{col}" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"><path d="{L1}"/><path d="{L2m}"/></g></svg>')


def dashes(n, act, on, off):
    return '<div style="display:flex;gap:10px">' + ''.join(f'<span style="width:40px;height:6px;border-radius:3px;background:{on if i == act else off}"></span>' for i in range(n)) + '</div>'


STORY = False


DASH = [None]


def head(n, act, logo_html, on, off):
    if DASH[0]:
        n, act = DASH[0]
    if STORY:
        n = 0
    return (f'<div style="position:absolute;left:88px;right:88px;top:84px;display:flex;align-items:center;justify-content:space-between">{logo_html}'
            + (dashes(n, act, on, off) if n else '') + '</div>')


def check(col, s=26):
    return f'<svg viewBox="0 0 24 24" width="{s}" height="{s}" fill="none" stroke="{col}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'


def arrow(col, s=40):
    return f'<svg viewBox="0 0 24 24" width="{s}" height="{s}" fill="none" stroke="{col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>'


OFF = [0.0]


def A(kind, s, d=0.6, r=0, extra=''):
    return f'data-a="{kind}" data-s="{round(s + OFF[0], 3)}" data-d="{d}" data-r="{r}" {extra}'


def CNT(s, d, a, b):
    return f'data-a="count" data-s="{round(s + OFF[0], 3)}" data-d="{d}" data-from="{a}" data-to="{b}"'


def page(name, bg, body, end=6.0, w=1080, h=1350):
    html = (f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>{CSS}</style></head>'
            f'<body data-end="{end}"><div class="pg" id="pg" style="background:{bg};width:{w}px;height:{h}px">{body}</div><script>{JS}</script></body></html>')
    open(os.path.join(OUT, name + '.html'), 'w').write(html)


SH = '0 50px 90px -45px rgba(26,26,26,.5)'


def poster(w, h, size=46, sub=True, rad=24):
    return (f'<div class="ph" style="width:{w}px;height:{h}px;border-radius:{rad}px;background:{C["lavf"]};display:flex;flex-direction:column;justify-content:flex-end;padding:{round(w*0.075)}px">'
            f'<img src="{PH["marche"]}" style="object-position:center 30%">'
            f'<span style="position:absolute;left:0;right:0;bottom:0;height:72%;background:linear-gradient(180deg,rgba(112,82,179,0),rgba(112,82,179,.94) 70%)"></span>'
            f'<span class="D" style="position:relative;font-weight:700;font-size:{size}px;line-height:.92;letter-spacing:-.035em;color:{C["sable"]}">Marché<br>de Noël</span>'
            + (f'<span style="position:relative;margin-top:{round(size*0.25)}px;font-weight:600;font-size:{round(size*0.4)}px;color:{C["lavc"]}">Samedi 12 décembre</span>' if sub else '')
            + '</div>')


def pubcard(left, top, w, rot, anim=''):
    ph = w - 40
    return (f'<div class="card" {anim} style="left:{left}px;top:{top}px;width:{w}px;padding:20px;transform:rotate({rot}deg);display:flex;flex-direction:column;gap:14px">'
            f'<div style="display:flex;align-items:center;gap:12px"><span class="av" style="width:46px;height:46px;font-size:17px;background:{C["lavc"]};color:{C["lavt"]}">SI</span><span style="font-weight:650;font-size:21px">saint.ivenec</span></div>'
            f'<div class="ph" style="height:{round(ph*0.82)}px;border-radius:18px"><img src="{PH["marche"]}" style="object-position:center 35%"></div>'
            f'<span style="font-weight:500;font-size:19px;line-height:1.35;color:rgba(26,26,26,.72)">Samedi, rendez-vous place de la mairie pour le marché de Noël…</span>'
            f'<span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">Publication · 1 unité</span></span></div>')


def newsletter(left, top, w, rot, anim='', tag=True, photo=True):
    return (f'<div class="card" {anim} style="left:{left}px;top:{top}px;width:{w}px;padding:22px;transform:rotate({rot}deg);display:flex;flex-direction:column;gap:14px">'
            f'<div style="height:58px;border-radius:14px;background:{C["lavf"]};display:flex;align-items:center;padding:0 20px;font-weight:650;font-size:20px;color:{C["sable"]}">La lettre de Saint-Ivenec</div>'
            f'<span class="D" style="font-weight:650;font-size:30px;line-height:1;letter-spacing:-.03em">Ce qui change en décembre</span>'
            + (f'<div class="ph" style="height:150px;border-radius:16px"><img src="{PH["mairie"]}" style="object-position:center 40%"></div>' if photo else '')
            + ''.join(f'<span style="height:12px;width:{x}%;border-radius:6px;background:rgba(26,26,26,.1)"></span>' for x in ((94, 80, 88) if photo else (94, 70)))
            + (f'<span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">Lettre d’information · 3 unités</span></span>' if tag else '') + '</div>')


# ---------------- PAGE 1 : couverture ----------------
def p1(story=False, arrowless=False):
    oy = 285 if story else 0
    b = motif(MOTIF['lavf'], 1700, 280, -260 + oy)
    b += f'<div style="position:absolute;left:88px;top:{88+oy}px">{logo(56, C["sable"])}</div>'
    b += f'<div style="position:absolute;right:88px;top:{92+oy}px"><span class="tag" style="height:52px;font-size:24px;padding:0 24px;background:{C["lavc"]};color:{C["lavt"]}">Nouveau</span></div>'
    b += pubcard(70, 250 + oy, 370, -9)
    b += newsletter(650, 260 + oy, 360, 8, tag=False)
    b += f'<div style="position:absolute;left:330px;top:{200+oy}px;transform:rotate(-1deg);box-shadow:0 60px 110px -40px rgba(0,0,0,.55);border-radius:30px">{poster(420, 580, 62, rad=30)}</div>'
    b += (f'<div style="position:absolute;left:395px;top:{800+oy}px;transform:rotate(-3deg);display:inline-flex;align-items:center;gap:14px;height:76px;padding:0 30px 0 14px;border-radius:999px;background:{C["blanc"]};box-shadow:{SH};font-weight:650;font-size:25px;white-space:nowrap">'
          f'<span style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:50%;background:{C["lavf"]}">{check(C["sable"], 26)}</span>Validé, publié samedi à 10 h</div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:{905+oy}px">'
          f'<div class="D" style="font-weight:650;font-size:100px;line-height:.96;letter-spacing:-.04em;color:{C["sable"]}">Votre communication,</div>'
          f'<div class="I" style="font-size:84px;line-height:1.06;letter-spacing:-.02em;color:{C["lavc"]};margin-top:8px">sans perdre le <span style="position:relative;display:inline-block">fil.<span style="position:absolute;left:2px;right:16px;bottom:-6px;height:10px;border-radius:5px;background:{C["lav"]}"></span></span></div></div>')
    if not story:
        arr = '' if arrowless else f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["sable"]}">{arrow(C["encre"], 42)}</span>'
        b += (f'<div style="position:absolute;left:88px;right:88px;bottom:84px;display:flex;align-items:center;justify-content:space-between">'
              f'<span style="font-weight:600;font-size:27px;color:rgba(248,245,242,.82)">Service communication externalisé<br>pour les collectivités et les entreprises</span>'
              f'{arr}</div>')
    return b


# ---------------- PAGE 2 : les demandes s'empilent ----------------
NOTIFS = [('GR', '#FFE0D5', 'Gaëlle', 'Tu peux faire l’affiche pour samedi ?'),
          ('YC', '#E9E1FF', 'Yannick', 'Il faudrait le mettre sur Facebook aussi.'),
          ('CL', '#DFEEE6', 'Claire', 'Le site affiche encore les horaires d’été.'),
          ('ML', '#B8A4FF', 'Marion', 'La newsletter part quand ?'),
          ('HM', '#FFD36B', 'Hugo', 'Urgent : changement de salle !'),
          ('GR', '#FFE0D5', 'Gaëlle', 'Et l’affiche, ça avance ?'),
          ('YC', '#E9E1FF', 'Yannick', 'Tu as des photos de l’inauguration ?'),
          ('GR', '#FFE0D5', 'Gaëlle', 'Samedi, c’est demain…')]
PILE = [(-24, 1176, -2), (26, 1082, 1.6), (-14, 988, -1.2), (30, 894, 2.2), (-28, 800, -1.8), (16, 706, 1.3), (-34, 612, -2.4), (22, 518, 1.8)]
NT = [0.5, 0.95, 1.35, 1.7, 2.0, 2.28, 2.54, 2.78]


def pile(anim, oy=0):
    out = ''
    for i, (n, (dx, y, r)) in enumerate(zip(NOTIFS, PILE)):
        a = f'data-a="fall" data-s="{NT[i]}" data-d="0.55" data-r="{r}"' if anim else f'style-r="{r}"'
        out += (f'<div class="nt" {a} style="left:{160+dx}px;top:{y+oy-40}px;transform:rotate({r}deg)">'
                f'<span class="av" style="background:{n[1]}">{n[0]}</span><span><b>{n[2]}</b><span class="m">{n[3]}</span></span><small>à l’instant</small></div>')
    return out


def badge(n, anim, oy=0, base=0):
    a = f'data-a="steps" data-times="{",".join(map(str, NT))}" data-base="{base}"' if anim else ''
    return (f'<div style="position:absolute;left:860px;top:{420+oy}px;display:flex;align-items:center;justify-content:center;width:96px;height:96px;border-radius:50%;background:#E5484D;'
            f'font-weight:750;font-size:40px;color:#fff;box-shadow:0 20px 40px -18px rgba(229,72,77,.7)"><span {a}>{n}</span></div>')


def p2(anim=True):
    b = head(10, 1, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.2)')
    b += f'<div class="ttl" style="color:{C["sable"]}" {A("up",0,0.6) if anim else ""}>Les demandes<span class="I" style="color:{C["lav"]}">s’empilent.</span></div>'
    b += pile(anim) + badge(8, anim)
    return b


# ---------------- PAGE 3 : la page dort ----------------
def fbcard(left, top, w, rot, state, anim=''):
    if state == 'old':
        stat = f'<span class="tag" style="background:#FDE2E1;color:#B4232A">Dernière publication : il y a 10 mois</span>'
        im = (f'<div style="height:330px;border-radius:20px;background:linear-gradient(135deg,#9a9086,#c9c0b4);display:flex;align-items:center;justify-content:center">'
              f'<span class="I" style="font-size:66px;font-weight:400;color:#fff">Bonne année !</span></div>')
        foot = '<span>3 J’aime</span><span>0 partage</span>'
    else:
        stat = f'<span class="tag" style="background:#DFF3E4;color:#1F7A3A"><span style="width:12px;height:12px;border-radius:50%;background:#2DA44E;margin-right:10px"></span>Publié à l’instant</span>'
        im = f'<div class="ph" style="height:390px;border-radius:20px">{poster(w-48, 390, 58, rad=20)}</div>'
        foot = f'<span><span {CNT(1.2, 2.2, 0, 126) if anim else ""}>126</span> J’aime</span><span>18 partages</span>'
    return (f'<div class="card" {anim if state=="old" else ""} style="left:{left}px;top:{top}px;width:{w}px;padding:24px;transform:rotate({rot}deg);display:flex;flex-direction:column;gap:18px">'
            f'<div style="display:flex;align-items:center;gap:14px"><span class="av" style="background:{C["lavc"]};color:{C["lavt"]}">SI</span>'
            f'<span style="display:flex;flex-direction:column;gap:2px"><b style="font-size:24px">Mairie de Saint-Ivenec</b><span style="font-size:19px;color:rgba(26,26,26,.55)">Page Facebook</span></span></div>'
            f'<span>{stat}</span>{im}<div style="display:flex;justify-content:space-between;font-weight:600;font-size:21px;color:rgba(26,26,26,.6)">{foot}</div></div>')


def p3(anim=True):
    b = head(10, 2, logo(44, C['sable']), C['lav'], 'rgba(248,245,242,.2)')
    b += f'<div class="ttl" style="color:{C["sable"]}" {A("up",0,0.6) if anim else ""}>Et la page Facebook<span class="I" style="color:{C["lav"]}">dort.</span></div>'
    b += f'<div {A("dim",0.4,0.6) if anim else "style=opacity:.45"} style="position:absolute;inset:0;{"" if anim else "opacity:.45"}">{pile(False)}</div>'
    b += badge(12, False)
    b += fbcard(230, 560, 620, -3, 'old', A('pop', 0.9, 0.7, -3) if anim else '')
    return b


# ---------------- PAGE 4 : Fill prend le relais ----------------
def p4(anim=True):
    b = motif(MOTIF['lav'], 1700, 300, -200)
    b += head(10, 3, logo(44, C['encre'], C['encre'], C['encre']), C['encre'], 'rgba(26,26,26,.18)')
    b += f'<div class="ttl" {A("up",0,0.6) if anim else ""}>Fill prend<span class="I">le relais.</span></div>'
    b += f'<div style="position:absolute;left:0;right:0;top:520px;display:flex;justify-content:center">{logo(300, C["encre"], C["lavf"], C["cor"], draw=0.5 if anim else None)}</div>'
    b += (f'<div class="sub" {A("up",2.2,0.6) if anim else ""} style="top:960px;font-size:38px;font-weight:600;line-height:1.3">Un service communication externalisé, par abonnement. '
          f'<span style="background:{C["lavc"]};border-radius:10px;padding:0 .14em">Un prix fixe chaque mois</span>, et un espace en ligne pour suivre chaque demande.</div>')
    return b


# ---------------- PAGE 5 : trois lignes suffisent ----------------
CHIPS = [('Publication', '1 u'), ('Affiche', '4 u'), ('Actualité du site', '1 u'), ('Newsletter', '3 u')]


def form(anim, left=100, top=470, w=880):
    t1 = 'Marché de Noël, samedi 12 décembre'
    t2 = 'De 10 h à 18 h, place de la mairie. Une affiche et un post, s’il vous plaît.'
    chips = ''
    for i, (n, u) in enumerate(CHIPS):
        s = 3.5 + i * 0.22
        chips += (f'<span style="position:relative;display:inline-flex;align-items:center;gap:10px;height:56px;padding:0 22px;border-radius:999px;border:2px solid rgba(26,26,26,.14);font-weight:600;font-size:22px">'
                  f'<span style="position:absolute;inset:-2px;border-radius:999px;background:{C["lav"]};border:2px solid {C["lav"]}" {A("pop",s,0.4) if anim else ""}></span>'
                  f'<span style="position:relative">{n}</span><span style="position:relative;color:rgba(26,26,26,.55)">{u}</span></span>')
    return (f'<div class="card" style="left:{left}px;top:{top}px;width:{w}px;padding:40px;display:flex;flex-direction:column;gap:20px">'
            f'<div style="display:flex;justify-content:space-between;align-items:baseline"><span class="D" style="font-weight:650;font-size:36px;letter-spacing:-.03em">Nouvelle demande</span><span style="font-size:21px;color:rgba(26,26,26,.55)">Mairie de Saint-Ivenec</span></div>'
            f'<span style="font-weight:600;font-size:20px;color:rgba(26,26,26,.55)">Le sujet</span>'
            f'<div style="height:72px;border-radius:16px;border:2px solid {C["lavf"]};display:flex;align-items:center;padding:0 22px;font-size:27px;font-weight:500"><span {A("type",0.5,1.2) if anim else ""}>{t1}</span></div>'
            f'<span style="font-weight:600;font-size:20px;color:rgba(26,26,26,.55)">Les détails</span>'
            f'<div style="min-height:118px;border-radius:16px;background:{C["sable"]};padding:18px 22px;font-size:25px;line-height:1.4;font-weight:500"><span {A("type",1.8,1.5) if anim else ""}>{t2}</span></div>'
            f'<span style="font-weight:600;font-size:20px;color:rgba(26,26,26,.55)">Les supports</span>'
            f'<div style="display:flex;flex-wrap:wrap;gap:12px">{chips}</div>'
            f'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:22px;border-top:2px solid rgba(26,26,26,.08)">'
            f'<span style="font-size:24px;font-weight:500"><b class="D" style="font-size:40px;font-weight:700;margin-right:8px"><span {CNT(3.5, 1.0, 0, 9) if anim else ""}>9</span></b>unités, connues avant l’envoi</span>'
            f'<span class="btn" {A("press",4.7,0.35) if anim else ""} style="height:76px;padding:0 34px;background:{C["encre"]};color:{C["sable"]}">Envoyer {arrow(C["sable"],28)}</span></div></div>')


def p5(anim=True):
    b = head(10, 4, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += f'<div class="ttl" {A("up",0,0.6) if anim else ""}>Trois lignes<span class="I" style="color:{C["lavt"]}">suffisent.</span></div>'
    b += form(anim)
    if anim:
        b += f'<div {A("tap",4.65,0.7)} style="position:absolute;left:830px;top:1125px;width:120px;height:120px;border-radius:50%;background:{C["lav"]};opacity:0"></div>'
    return b


# ---------------- PAGE 6 : Fill décline ----------------
def p6(anim=True):
    b = motif(MOTIF['lavc'], 1500, -380, 300, -6)
    b += head(10, 5, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += f'<div class="ttl" style="font-size:92px" {A("up",0,0.6) if anim else ""}>Fill décline<span class="I" style="color:{C["lavt"]}">tous vos supports.</span></div>'
    b += (f'<div style="position:absolute;left:88px;top:392px;display:flex;gap:12px" {A("up",0.4,0.5) if anim else ""}>'
          f'<span class="tag" style="height:52px;font-size:23px;background:{C["encre"]};color:{C["sable"]}">{check(C["lav"],22)}&nbsp;Confirmé sous 24 h ouvrées</span>'
          f'<span class="tag" style="height:52px;font-size:23px;background:{C["blanc"]};color:{C["encre"]}">9 unités, prix connu</span></div>')
    b += pubcard(70, 490, 380, -4, A('pop', 0.9, 0.6, -4) if anim else '')
    b += (f'<div class="card" {A("pop",1.4,0.6,4) if anim else ""} style="left:600px;top:480px;width:390px;padding:18px;transform:rotate(4deg);display:flex;flex-direction:column;gap:14px">'
          f'{poster(354, 400, 54)}<span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">Affiche · 4 unités</span></span></div>')
    b += (f'<div class="card" {A("pop",1.9,0.6,2) if anim else ""} style="left:60px;top:1010px;width:480px;padding:18px;transform:rotate(2deg);display:flex;flex-direction:column;gap:12px">'
          f'<div style="display:flex;gap:6px;align-items:center;padding:0 6px"><span style="width:10px;height:10px;border-radius:50%;background:#ddd"></span><span style="width:10px;height:10px;border-radius:50%;background:#ddd"></span><span style="margin-left:10px;font-size:15px;color:rgba(26,26,26,.45)">saint-ivenec.fr/actualites</span></div>'
          f'<div style="display:flex;gap:16px"><div class="ph" style="flex:none;width:150px;height:110px;border-radius:12px"><img src="{PH["marche"]}"></div>'
          f'<div style="display:flex;flex-direction:column;gap:6px"><span style="font-weight:700;font-size:15px;color:{C["lavt"]}">ACTUALITÉ</span><span class="D" style="font-weight:650;font-size:25px;line-height:1.05;letter-spacing:-.02em">Le marché de Noël, samedi 12 décembre</span></div></div>'
          f'<span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">Actualité du site · 1 unité</span></span></div>')
    b += newsletter(580, 1000, 420, -3, A('pop', 2.4, 0.6, -3) if anim else '', photo=False)
    return b


# ---------------- PAGE 7 : sans votre accord ----------------
def proof(anim, left, top, rot):
    return (f'<div class="card" style="left:{left}px;top:{top}px;width:480px;padding:34px;transform:rotate({rot}deg);display:flex;flex-direction:column;gap:16px">'
            f'<span style="font-weight:600;font-size:20px;color:rgba(26,26,26,.55)">Épreuve 1 · Affiche</span>'
            f'<span class="D" style="font-weight:650;font-size:40px;line-height:1;letter-spacing:-.03em">Votre affiche est prête à relire.</span>'
            f'<span style="font-size:21px;color:rgba(26,26,26,.6)">Deux allers-retours compris</span>'
            f'<span class="btn" style="margin-top:8px;box-shadow:inset 0 0 0 2px rgba(26,26,26,.18);font-size:22px">Demander une modification</span>'
            f'<span style="position:relative;display:block;height:72px">'
            f'<span class="btn" {A("press",2.0,0.35) if anim else ""} style="position:absolute;inset:0;background:{C["encre"]};color:{C["sable"]};{"" if anim else "visibility:hidden"}" {"" if not anim else ""}><span {A("hidef",2.3) if anim else ""}>Valider</span></span>'
            f'<span class="btn" {A("show",2.3) if anim else ""} style="position:absolute;inset:0;background:{C["lav"]};color:{C["encre"]};{"visibility:hidden" if anim else ""}">{check(C["encre"],26)} Validé</span></span>'
            f'<span style="font-size:19px;color:rgba(26,26,26,.55)">Sans compte à créer, depuis votre téléphone.</span></div>')


def p7(anim=True):
    b = motif(MOTIF['lav'], 1600, 420, -120)
    b += head(10, 6, logo(44, C['encre'], C['encre'], C['encre']), C['encre'], 'rgba(26,26,26,.18)')
    b += f'<div class="ttl" {A("up",0,0.6) if anim else ""}>Rien ne part<span class="I">sans votre accord.</span></div>'
    b += f'<div {A("left",0.4,0.7,-5) if anim else ""} style="position:absolute;left:90px;top:500px;transform:rotate(-5deg);box-shadow:0 60px 110px -40px rgba(26,26,26,.5);border-radius:28px">{poster(440, 640, 72, rad=28)}</div>'
    b += f'<div {A("right",0.8,0.7) if anim else ""} style="position:absolute;inset:0">{proof(anim, 510, 640, 3)}</div>'
    if anim:
        b += f'<div {A("tap",1.95,0.7)} style="position:absolute;left:685px;top:917px;width:130px;height:130px;border-radius:50%;background:{C["lavf"]};opacity:0"></div>'
    return b


# ---------------- PAGE 8 : publié ----------------
def p8(anim=True):
    b = motif(MOTIF['lavc'], 1600, 420, -200)
    b += head(10, 7, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += f'<div class="ttl" {A("up",0,0.6) if anim else ""}>Publié<span class="I" style="color:{C["lavt"]}">à l’heure prévue.</span></div>'
    b += f'<div {A("up",0.4,0.7) if anim else ""} style="position:absolute;inset:0">{fbcard(90, 470, 560, -3, "new", anim)}</div>'
    pills = [('Publié sur vos canaux', 1.4), ('Fichiers d’impression livrés', 1.8)]
    for i, (t, s) in enumerate(pills):
        b += (f'<div {A("pop",s,0.5,[3,-2,2][i]) if anim else ""} style="position:absolute;left:{560 - i*30}px;top:{760 + i*150}px;transform:rotate({[3,-2,2][i]}deg);display:inline-flex;align-items:center;gap:16px;height:96px;padding:0 34px 0 18px;border-radius:999px;background:{C["blanc"] if i < 2 else C["encre"]};box-shadow:{SH};font-weight:650;font-size:27px;white-space:nowrap;color:{C["encre"] if i < 2 else C["sable"]}">'
              f'<span style="display:flex;align-items:center;justify-content:center;width:62px;height:62px;border-radius:50%;background:{C["lavf"] if i < 2 else C["lav"]}">{check(C["sable"] if i < 2 else C["encre"], 30)}</span>{t}</div>')
    return b


# ---------------- PAGE 9 : formules ----------------
def table(top):
    cols = [('Essentiel', False), ('Régulier', False), ('Soutenu', False)]
    rows = [('Par mois', [f'490{NB}€', f'990{NB}€', f'1{NB}890{NB}€']), ('Unités', ['15', '35', '75']),
            ('Courant', [f'2{NB}jours', f'2{NB}jours', f'1{NB}jour']), ('Créations', [f'5{NB}jours', f'5{NB}jours', f'3{NB}jours'])]
    g = 'display:grid;grid-template-columns:200px repeat(3,minmax(0,1fr));column-gap:10px'
    h = f'<div style="{g}"><span></span>' + ''.join(f'<span class="D" style="display:flex;align-items:center;justify-content:center;height:78px;border-radius:24px 24px 0 0;background:{C["encre"] if d else "transparent"};color:{C["sable"] if d else C["encre"]};font-weight:650;font-size:36px;letter-spacing:-.03em">{n}</span>' for n, d in cols) + '</div>'
    for ri, (lab, vals) in enumerate(rows):
        last = ri == len(rows) - 1
        h += f'<div style="{g}"><span style="display:flex;align-items:center;padding:26px 0;font-weight:600;font-size:25px;color:rgba(26,26,26,.62);border-bottom:{"0" if last else "2px solid rgba(26,26,26,.08)"}">{lab}</span>'
        for i, v in enumerate(vals):
            d = cols[i][1]
            h += (f'<span class="{"D" if ri == 0 else ""}" style="display:flex;align-items:center;justify-content:center;text-align:center;padding:26px 0;font-weight:{700 if ri == 0 else 600};font-size:{42 if ri == 0 else 29}px;letter-spacing:{"-.03em" if ri == 0 else "0"};'
                  f'background:{C["encre"] if d else "transparent"};color:{C["sable"] if d else C["encre"]};border-radius:{"0 0 24px 24px" if d and last else "0"};border-bottom:{"0" if last or d else "2px solid rgba(26,26,26,.08)"}">{v}</span>')
        h += '</div>'
    return f'<div class="card" style="left:70px;right:70px;top:{top}px;padding:36px 34px 30px">{h}</div>'


def p9(anim=True):
    b = motif(MOTIF['sable'], 1300, 620, 700)
    b += head(10, 8, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += f'<div class="ttl" {A("up",0,0.6) if anim else ""}>Trois formules,<span class="I" style="color:{C["lavt"]}">un prix fixe par mois.</span></div>'
    b += f'<div {A("up",0.4,0.7) if anim else ""} style="position:absolute;inset:0">{table(560)}</div>'
    return b


# ---------------- PAGE 10 : fin ----------------
def p10(anim=True, story=False):
    oy = 285 if story else 0
    b = motif(MOTIF['lavf'], 1700, 300, -220 + oy)
    if not story and not STORY:
        n_, a_ = DASH[0] or (10, 9)
        b += f'<div style="position:absolute;right:88px;top:96px">{dashes(n_, a_, C["lavc"], "rgba(248,245,242,.24)")}</div>'
    b += f'<div style="position:absolute;left:0;right:0;top:{250+oy}px;display:flex;justify-content:center">{logo(210, C["sable"])}</div>'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:{560+oy}px;text-align:center">'
          f'<div class="D" style="font-weight:650;font-size:84px;line-height:.98;letter-spacing:-.035em;color:{C["sable"]}">Premier mois<br>sans engagement.</div>'
          f'<div class="I" style="font-size:46px;color:{C["lavc"]};margin-top:22px">Opérationnel sous 24 h après votre accord.</div></div>')
    b += (f'<div style="position:absolute;left:0;right:0;top:{960+oy}px;display:flex;flex-direction:column;align-items:center;gap:30px">'
          f'<span style="display:inline-flex;align-items:center;gap:16px;height:100px;padding:0 46px 0 38px;border-radius:999px;background:{C["blanc"]};box-shadow:0 0 0 10px {C["lav"]};font-weight:650;font-size:40px">fill.studioes.fr</span>'
          f'<span style="font-weight:500;font-size:28px;color:rgba(248,245,242,.75)">Collectivités et entreprises, partout en France</span></div>')
    return b


PAGES = [('p01', C['lavf'], p1, 0), ('p02', C['encre'], p2, 4.2), ('p03', C['encre'], p3, 3.2), ('p04', C['lav'], p4, 3.8),
         ('p05', C['sable'], p5, 6.0), ('p06', C['lavc'], p6, 4.0), ('p07', C['lav'], p7, 4.0), ('p08', C['lavc'], p8, 4.4),
         ('p09', C['sable'], p9, 0), ('p10', C['lavf'], p10, 0)]

def story(name, bg, body, end):
    page(name, bg, f'<div style="position:absolute;left:0;top:285px;width:1080px;height:1350px">{body}</div>', end=end, h=1920)


if __name__ == '__main__':
    for name, bg, f, end in PAGES:
        page(name, bg, f(), end=end or 1)
    STORY = True
    story('s1', C['lavf'], p1(arrowless=True), 1)
    story('s2', C['sable'], p5(), 6.0)
    story('s3', C['lav'], p7(), 4.0)
    story('s4', C['lavc'], p8(), 4.4)
    story('s5', C['lavf'], p10(), 1)
    print('ok')
