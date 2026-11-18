// Module physique : la matière des gestes, ajoutée par-dessus les écrans, sans toucher aux composants.
// 1. Le fil d'état vit : il ondule tant que la demande est en production ou en correction, il se tend quand elle est validée ou livrée.
// 2. Les zones de dépôt se réveillent quand un fichier arrive sur la fenêtre, et l'acceptent quand on le lâche dessus.
// Tout est facultatif : mouvement réduit, onglet masqué ou erreur, et l'Espace se comporte comme avant.

(() => {
  if (typeof document > `u`) return;
  const calme = () => window.matchMedia && matchMedia(`(prefers-reduced-motion: reduce)`).matches;

  /* ---------- 1. le fil ---------- */
  const X0 = 2, X1 = 44, PAS = 3.5;
  const bord = (x) => Math.min(1, (x - X0) / 5, (X1 - x) / 5);
  const haut = (x, amp, ph) => 8 - amp * bord(x) * Math.sin(((x - X0) / 14) * Math.PI - ph);
  const trace = (amp, ph) => {
    if (amp < 0.04 && amp > -0.04) return `M${X0} 8 L${X1} 8`;
    let px = X0, py = 8, d = `M${X0} 8`;
    for (let x = X0 + PAS; x <= X1 + 0.01; x += PAS) {
      const y = haut(x, amp, ph);
      d += ` Q${px.toFixed(2)} ${py.toFixed(2)} ${((px + x) / 2).toFixed(2)} ${((py + y) / 2).toFixed(2)}`;
      px = x; py = y;
    }
    return d + ` L${X1} 8`;
  };
  const pose = (svg, amp, ph) => {
    const d = trace(amp, ph), c = svg.querySelector(`.perle`);
    svg.querySelectorAll(`path`).forEach((p) => p.setAttribute(`d`, d));
    if (c) c.setAttribute(`cy`, haut(parseFloat(c.getAttribute(`cx`)) || X0, amp, ph).toFixed(2));
  };
  let vifs = [], tendus = [], rafId = 0;
  const releve = () => {
    const tous = [...document.querySelectorAll(`.etat > svg`)];
    vifs = tous.filter((s) => s.parentNode.classList.contains(`lav`));
    tendus = tous.filter((s) => s.parentNode.classList.contains(`bon`));
    tendus.forEach((s) => {
      if (s.__tendu) return pose(s, 0, 0);                    // déjà tendu : on le garde droit (l'écran peut l'avoir redessiné)
      s.__tendu = 1;
      if (calme()) return pose(s, 0, 0);
      const t0 = performance.now(), dur = 900;               // la tension : l'onde s'écrase, dépasse un peu, se pose
      const pasT = (t) => {
        if (!s.isConnected) return;
        const k = Math.min(1, (t - t0) / dur), amp = 4.5 * Math.exp(-5.5 * k) * Math.cos(k * 9);
        pose(s, k < 1 ? amp : 0, 0);
        if (k < 1) requestAnimationFrame(pasT);
      };
      requestAnimationFrame(pasT);
    });
    tous.forEach((s) => { if (s.__vif && !vifs.includes(s) && !tendus.includes(s)) { s.__vif = 0; s.__tendu = 0; pose(s, 4.5, 0); } });
    vifs.forEach((s) => { s.__vif = 1; s.__tendu = 0; });
    if (vifs.length && !rafId && !calme() && !document.hidden) rafId = requestAnimationFrame(tourne);
  };
  const tourne = (t) => {
    rafId = 0;
    if (!vifs.length || document.hidden || calme()) return;
    const ph = (t / 2600) * Math.PI * 2;
    for (const s of vifs) if (s.isConnected) pose(s, 4.5, ph);
    rafId = requestAnimationFrame(tourne);
  };
  let attente = 0;
  const bientot = () => { if (!attente) attente = setTimeout(() => { attente = 0; try { releve(); } catch {} }, 120); };
  new MutationObserver(bientot).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: [`class`] });
  document.addEventListener(`visibilitychange`, bientot);
  bientot();

  /* ---------- 2. les zones de dépôt ---------- */
  const zones = () => [...document.querySelectorAll(`label.depot`)].filter((z) => z.querySelector(`input[type=file]`));
  const fichiers = (e) => e.dataTransfer && [...(e.dataTransfer.types || [])].includes(`Files`);
  let dedans = 0;
  const eteint = () => { dedans = 0; document.querySelectorAll(`.ph-eveil,.ph-sur`).forEach((z) => z.classList.remove(`ph-eveil`, `ph-sur`)); };
  document.addEventListener(`dragenter`, (e) => { if (!fichiers(e)) return; dedans++; zones().forEach((z) => z.classList.add(`ph-eveil`)); });
  document.addEventListener(`dragleave`, (e) => { if (!fichiers(e)) return; if (--dedans <= 0) eteint(); });
  document.addEventListener(`dragover`, (e) => {
    if (!fichiers(e)) return;
    const z = e.target.closest && e.target.closest(`label.depot.ph-eveil`);
    document.querySelectorAll(`.ph-sur`).forEach((x) => x !== z && x.classList.remove(`ph-sur`));
    if (!z) return;
    e.preventDefault(); e.dataTransfer.dropEffect = `copy`;
    const r = z.getBoundingClientRect();
    z.classList.add(`ph-sur`);
    z.style.setProperty(`--px`, e.clientX - r.left + `px`); z.style.setProperty(`--py`, e.clientY - r.top + `px`);
  });
  document.addEventListener(`drop`, (e) => {
    const z = fichiers(e) && e.target.closest && e.target.closest(`label.depot.ph-eveil`);
    eteint();
    if (!z) return;
    e.preventDefault();
    const champ = z.querySelector(`input[type=file]`);
    try {
      const dt = new DataTransfer();
      [...e.dataTransfer.files].slice(0, champ.multiple ? 99 : 1).forEach((f) => dt.items.add(f));
      champ.files = dt.files;
      champ.dispatchEvent(new Event(`change`, { bubbles: true }));
      if (!calme() && z.animate) z.animate([{ transform: `scale(1)` }, { transform: `scale(.965)` }, { transform: `scale(1.012)` }, { transform: `scale(1)` }], { duration: 460, easing: `cubic-bezier(.3,.7,.3,1)` });
    } catch {}
  });
  addEventListener(`blur`, eteint);
})();
