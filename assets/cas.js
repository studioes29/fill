/* Cas types de l'accueil : le bandeau défile en boucle (liste dupliquée,
   masquée aux lecteurs d'écran), se met en pause au survol, au focus
   ou par le bouton. Sans JavaScript ou avec réduction des animations,
   il reste un rail que l'on fait glisser. */
(() => {
  const sec = document.querySelector('.cas-f');
  if (!sec || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  sec.querySelectorAll('.cas-r').forEach(r => {
    const p = r.querySelector('.cas-p'), l = p && p.querySelector('.cas-l');
    if (!l) return;
    const d = l.cloneNode(true);
    d.setAttribute('aria-hidden', 'true'); d.inert = true;
    p.appendChild(d);
    // vitesse constante quelle que soit la largeur : environ 40 px par seconde
    const regle = () => { const w = l.getBoundingClientRect().width; if (w) p.style.setProperty('--duree', Math.round(w / 40) + 's'); };
    regle(); addEventListener('resize', regle);
    if (r.hidden) new MutationObserver(regle).observe(r, { attributes: true, attributeFilter: ['hidden'] });
    r.classList.add('defile');
  });
  const b = sec.querySelector('.cas-pp');
  if (b) b.addEventListener('click', () => {
    const arret = sec.classList.toggle('arret');
    b.setAttribute('aria-pressed', String(arret));
    b.setAttribute('aria-label', arret ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
  });
})();
