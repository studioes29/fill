// Module familles : dans la nouvelle demande, les familles de supports se replient.
// La première est ouverte, les autres s'ouvrent d'un clic sur leur titre. Un support choisi reste toujours visible.
// Ajouté par-dessus l'écran, sans toucher au composant : seuls des attributs sont posés sur les titres et les groupes.

(() => {
  if (typeof document > `u`) return;
  const ouvert = (g) => g.dataset.ouvert === `1` || (g.dataset.ouvert !== `0` && g.previousElementSibling && !g.previousElementSibling.classList.contains(`groupe`));
  const habiller = () => {
    document.querySelectorAll(`fieldset.etape > .groupe > h3.g-t`).forEach((h) => {
      const g = h.parentElement;
      if (!h.hasAttribute(`role`)) { h.setAttribute(`role`, `button`); h.setAttribute(`tabindex`, `0`); }
      const n = g.querySelectorAll(`.liste > li [aria-pressed="true"]`).length;
      if (h.dataset.choisis !== String(n)) h.dataset.choisis = String(n);
      const o = String(ouvert(g));
      if (h.getAttribute(`aria-expanded`) !== o) h.setAttribute(`aria-expanded`, o);
    });
  };
  const basculer = (h) => { const g = h.parentElement; g.dataset.ouvert = ouvert(g) ? `0` : `1`; habiller(); };
  document.addEventListener(`click`, (e) => { const h = e.target.closest && e.target.closest(`fieldset.etape > .groupe > h3.g-t`); if (h) basculer(h); });
  document.addEventListener(`keydown`, (e) => { if (e.key !== `Enter` && e.key !== ` `) return; const h = e.target.closest && e.target.closest(`fieldset.etape > .groupe > h3.g-t`); if (h) { e.preventDefault(); basculer(h); } });
  let attente = 0;
  new MutationObserver(() => { if (!attente) attente = requestAnimationFrame(() => { attente = 0; habiller(); }); }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: [`aria-pressed`] });
  habiller();
})();
