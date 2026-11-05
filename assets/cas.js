/* Cas types de l'accueil : deux bandeaux en sens contraires. Chaque liste
   est recopiée autant de fois que la largeur de l'écran l'exige (copies
   masquées aux lecteurs d'écran), puis glisse d'exactement une liste.
   Pause au survol, au focus ou par le bouton. Sans JavaScript ou avec
   réduction des animations, chaque bandeau reste un rail à faire glisser. */
(() => {
  const sec = document.querySelector('.cas-f');
  if (!sec || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rails = [...sec.querySelectorAll('.cas-r')].map(r => {
    const l = r.querySelector('.cas-l'), p = document.createElement('div');
    p.className = 'cas-p'; r.insertBefore(p, l); p.appendChild(l);
    r.classList.add('defile');
    return { r, p, l };
  });
  const regle = ({ r, p, l }) => {
    const w = l.getBoundingClientRect().width; if (!w) return;
    const besoin = Math.ceil(r.clientWidth / w) + 1;
    let n = p.children.length;
    while (n < besoin) { const c = l.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.inert = true; p.appendChild(c); n++; }
    p.style.setProperty('--dx', w.toFixed(2));
    p.style.setProperty('--duree', Math.round(w / 36) + 's');
  };
  const tout = () => rails.forEach(regle);
  tout(); addEventListener('resize', tout);
  if (document.fonts) document.fonts.ready.then(tout);
  sec.querySelectorAll('.cas-g').forEach(g => new MutationObserver(tout).observe(g, { attributes: true, attributeFilter: ['hidden'] }));
  const b = sec.querySelector('.cas-pp');
  if (b) b.addEventListener('click', () => {
    const arret = sec.classList.toggle('arret');
    b.setAttribute('aria-pressed', String(arret));
    b.setAttribute('aria-label', arret ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
  });
})();
