// Module gestes : gestes ajoutés par-dessus les écrans, sans toucher aux composants.
// 1. Une fiche s'ouvre depuis sa carte et s'y replie (transitions de vue du navigateur, quand il les connaît).
// 2. Un bouton d'envoi ou de validation montre que l'action est en cours, puis une coche quand elle a abouti.
// Tout est facultatif : mouvement réduit, navigateur ancien ou erreur, et l'Espace se comporte comme avant.

(() => {
  if (typeof document > `u`) return;
  const calme = () => window.matchMedia && matchMedia(`(prefers-reduced-motion: reduce)`).matches;
  const page = () => document.querySelector(`.page`);
  const nettoie = () => document.querySelectorAll(`[data-gs]`).forEach((x) => { x.style.viewTransitionName = ``; x.removeAttribute(`data-gs`); });
  const nomme = (x) => { if (x) { x.style.viewTransitionName = `gs-fiche`; x.setAttribute(`data-gs`, ``); } };

  document.addEventListener(
    `click`,
    (e) => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || calme() || !document.startViewTransition) return;
      const a = e.target.closest && e.target.closest(`a[href^="#"]`);
      if (!a || a.target) return;
      const vers = decodeURIComponent(a.getAttribute(`href`).slice(1)), de = routeDepuisHash();
      const ouvre = /^demande-/.test(vers) && !/^demande-/.test(de), ferme = /^demande-/.test(de) && /^(demandes|production)?$/.test(vers);
      if ((!ouvre && !ferme) || vers === de) return;
      e.preventDefault();
      try {
        nettoie(); nomme(ouvre ? a : page());
        const tr = document.startViewTransition(async () => {
          nettoie();
          location.hash = vers; route.nom = vers;
          window.scrollTo({ top: 0, behavior: `instant` });
          await new Promise((r) => setTimeout(r, 40));
          nomme(ouvre ? page() : [...document.querySelectorAll(`a[href^="#"]`)].find((x) => decodeURIComponent(x.getAttribute(`href`).slice(1)) === de));
        });
        tr.finished.then(nettoie, nettoie);
      } catch (err) {
        nettoie(); location.hash = vers;
      }
    },
    true,
  );

  const ACTION = /^(Envoyer la demande|Enregistrer les modifications|Valider la version)/;
  const coche = (r) => setTimeout(() => {
    if (document.querySelector(`.fete`)) return;        // l'Espace fête déjà ce moment en plein écran : pas de doublon
    const c = document.createElement(`span`);
    c.className = `gs-coche`; c.setAttribute(`aria-hidden`, `true`);
    c.style.left = r.left + r.width / 2 + `px`; c.style.top = r.top + r.height / 2 + `px`;
    c.innerHTML = `<svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
    document.body.appendChild(c); setTimeout(() => c.remove(), 1100);
  }, 90);
  document.addEventListener(
    `click`,
    (e) => {
      const b = e.target.closest && e.target.closest(`button.bt`);
      if (!b || b.disabled || calme() || !ACTION.test(b.textContent.trim())) return;
      const r = b.getBoundingClientRect();
      setTimeout(() => {
        if (!b.isConnected) return coche(r);            // l'action a abouti tout de suite
        if (!b.disabled) return;                        // rien n'est parti (champ manquant, confirmation ouverte)
        b.classList.add(`gs-charge`);
        const fin = Date.now() + 20000;
        const it = setInterval(() => {
          if (!b.isConnected) { clearInterval(it); coche(r); }
          else if (!b.disabled || Date.now() > fin) { clearInterval(it); b.classList.remove(`gs-charge`); }
        }, 80);
      }, 0);
    },
    true,
  );
})();

// 3. De retour sur l'onglet, l'Espace relit ses données : une version validée par lien ou un message arrivé
//    entre-temps apparaissent sans recharger la page. Mode réel seulement, au plus une fois par minute.
(() => {
  if (typeof document > `u` || !MODE_REEL) return;
  let dernier = Date.now();
  document.addEventListener(`visibilitychange`, () => {
    if (document.hidden || !etat.moiId || Date.now() - dernier < 60000) return;
    dernier = Date.now();
    recharger().catch(() => null);
  });
})();
