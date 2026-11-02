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
.bw{position:fixed;z-index:60;right:24px;bottom:24px;width:min(380px,calc(100vw - 32px));background:var(--lav-c,#E9E1FF);color:var(--encre,#1A1A1A);border-radius:26px;padding:24px 24px 20px;box-shadow:0 18px 48px rgba(112,82,179,.22);overflow:hidden;font-family:var(--f,"Inter Tight",Arial,sans-serif);transform:translateY(16px);opacity:0;transition:transform .5s cubic-bezier(.16,1,.3,1),opacity .4s}
.bw.on{transform:none;opacity:1}
.bw::before{content:"+50";position:absolute;right:-10px;bottom:-34px;font:800 150px/1 var(--d,"Bricolage Grotesque",sans-serif);color:var(--lav,#B8A4FF);opacity:.32;letter-spacing:-.04em;pointer-events:none}
.bw>*{position:relative}
.bw-k{font:600 14px/1.2 var(--sf,"Urbanist",sans-serif);font-style:italic;color:var(--lav-f,#7052B3);margin:0 0 6px}
.bw-t{font:700 24px/1.08 var(--d,"Bricolage Grotesque",sans-serif);letter-spacing:-.02em;margin:0 0 10px;padding-right:28px}
.bw-p{font-size:15px;line-height:1.45;margin:0 0 16px;color:rgba(26,26,26,.78)}
.bw-a{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.bw-b{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:999px;background:var(--lav-f,#7052B3);color:#fff;font-weight:600;font-size:15px;text-decoration:none}
.bw-l{display:inline-flex;align-items:center;min-height:44px;padding:0 6px;color:var(--lav-f,#7052B3);font-weight:600;font-size:15px;text-decoration:underline;text-underline-offset:3px}
.bw-n{font-size:12px;line-height:1.4;color:rgba(26,26,26,.6);margin:14px 0 0}
.bw-x{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.6);color:var(--encre,#1A1A1A);font-size:20px;line-height:1;cursor:pointer}
@media (width<=600px){.bw{right:16px;bottom:16px;padding:20px 20px 16px}.bw-t{font-size:21px}.bw::before{font-size:120px}}
@media (prefers-reduced-motion:reduce){.bw{transition:none}}`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  const el = document.createElement('aside');
  el.className = 'bw';
  el.setAttribute('aria-label', 'Offre Black Week');
  el.innerHTML = `
<button class="bw-x" type="button" aria-label="Fermer l’offre">×</button>
<p class="bw-k">Black Week, jusqu’au 30 novembre</p>
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
