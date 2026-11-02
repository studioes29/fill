/* Offre Black Week de Fill.
   S'affiche seule du lundi 23 novembre 2026, 0 h, au lundi 1er décembre 2026, 0 h (heure de Paris), puis disparaît.
   Aperçu avant la date : ajouter ?blackweek à l'adresse de la page.
   Le crédit des unités bonus est fait côté base (fonction _activer), aux mêmes dates. */
(() => {
  const DEBUT = Date.parse('2026-11-23T00:00:00+01:00');
  const FIN = Date.parse('2026-12-01T00:00:00+01:00');
  const apercu = /[?&]blackweek\b/.test(location.search);
  const now = Date.now();
  if (!apercu && (now < DEBUT || now >= FIN)) return;
  let ferme = false;
  try { ferme = sessionStorage.getItem('fill.bw') === '1'; } catch (_) {}
  if (ferme && !apercu) return;

  const css = `
.bw{position:fixed;z-index:60;right:24px;bottom:24px;width:min(400px,calc(100vw - 32px));background:#0B0B0D;color:#F4F2F7;border-radius:28px;padding:26px 26px 22px;box-shadow:0 24px 60px rgba(0,0,0,.38);border:1px solid rgba(255,255,255,.08);overflow:hidden;font-family:var(--f,"Inter Tight",Arial,sans-serif);transform:translateY(16px);opacity:0;transition:transform .5s cubic-bezier(.16,1,.3,1),opacity .4s}
.bw.on{transform:none;opacity:1}
.bw>*{position:relative}
.bw-h{display:flex;align-items:center;gap:14px;margin:0 0 14px}
.bw-pa{flex:none;position:relative;width:64px;height:64px;border-radius:50%;transform:rotate(-14deg);box-shadow:0 3px 0 #4A4B54,0 5px 0 #6C6D77,0 7px 0 #4A4B54,0 14px 22px rgba(0,0,0,.55);
 background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.95) 0 6%,rgba(255,255,255,0) 26%),conic-gradient(from 18deg,#F7F7F9,#A9AAB4 12%,#FFFFFF 22%,#6D6E78 34%,#E6E7EC 46%,#8F909A 58%,#FDFDFF 70%,#767782 84%,#F7F7F9);display:flex;align-items:center;justify-content:center}
.bw-pa::before{content:"";position:absolute;inset:6px;border-radius:50%;background:conic-gradient(from 200deg,#ECECF0,#9C9DA7 15%,#FFFFFF 28%,#7E7F89 45%,#E2E2E8 60%,#A2A3AD 78%,#ECECF0);box-shadow:inset 0 1px 2px rgba(0,0,0,.45),0 1px 0 rgba(255,255,255,.8)}
.bw-pa::after{content:"";position:absolute;inset:0;border-radius:50%;mix-blend-mode:soft-light;background:linear-gradient(125deg,rgba(184,164,255,0) 20%,rgba(184,164,255,.75) 40%,rgba(255,138,107,.45) 58%,rgba(160,230,255,0) 78%)}
.bw-pa span{position:relative;z-index:1;font:800 16px/1 var(--d,"Bricolage Grotesque",sans-serif);letter-spacing:-.04em;color:#3B3C45;text-shadow:0 1px 0 rgba(255,255,255,.85)}
.bw-k{font:500 16px/1.25 var(--sf,"Urbanist",sans-serif);font-style:italic;color:rgba(244,242,247,.75);margin:0}
.bw-t{font:800 27px/1.02 var(--d,"Bricolage Grotesque",sans-serif);letter-spacing:-.03em;margin:0 0 10px;padding-right:20px;color:#F4F2F7}
.bw-p{font-size:15px;line-height:1.45;margin:0 0 16px;color:rgba(244,242,247,.78)}
.bw-a{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.bw-b{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:999px;background:#F4F2F7;color:#0B0B0D;font-weight:700;font-size:15px;text-decoration:none}
.bw-l{display:inline-flex;align-items:center;min-height:44px;padding:0 6px;color:#F4F2F7;font-weight:600;font-size:15px;text-decoration:underline;text-underline-offset:3px}
.bw-n{font-size:12px;line-height:1.4;color:rgba(244,242,247,.55);margin:14px 0 0}
.bw-x{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#F4F2F7;font-size:20px;line-height:1;cursor:pointer}
@media (width<=600px){.bw{right:16px;bottom:16px;padding:22px 20px 18px}.bw-t{font-size:23px}}
@media (prefers-reduced-motion:reduce){.bw{transition:none}}`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  const el = document.createElement('aside');
  el.className = 'bw';
  el.setAttribute('aria-label', 'Offre Black Week');
  el.innerHTML = `
<button class="bw-x" type="button" aria-label="Fermer l’offre">×</button>
<div class="bw-h"><span class="bw-pa" aria-hidden="true"><span>+50</span></span><p class="bw-k">Black Week, jusqu’au 30 novembre</p></div>
<p class="bw-t">50 % d’unités en plus le premier mois</p>
<p class="bw-p">Pour tout abonnement activé cette semaine : 5 unités offertes sur l’Essentiel, 11 sur le Régulier, 23 sur le Soutenu, en plus du quota du premier mois.</p>
<div class="bw-a"><a class="bw-b" href="/espace/#ouverture">Créer mon espace Fill</a><a class="bw-l" href="/formules/">Voir les formules</a></div>
<p class="bw-n">Abonnements Essentiel, Régulier et Soutenu activés du 23 au 30 novembre 2026. Unités bonus valables le premier mois.</p>`;
  el.querySelector('.bw-x').addEventListener('click', () => {
    el.classList.remove('on');
    try { sessionStorage.setItem('fill.bw', '1'); } catch (_) {}
    setTimeout(() => el.remove(), 500);
  });
  const go = () => { document.body.appendChild(el); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on'))); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(go, 1200));
  else setTimeout(go, 1200);
})();
