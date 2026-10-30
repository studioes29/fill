// Composant couleurSelonFond (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var qh = (e) => {
    let t = e.match(/\d+(\.\d+)?/g);
    if (!t) return 1;
    let [n, r, i] = t.map(Number);
    return (0.299 * n + 0.587 * r + 0.114 * i) / 255;
  },
  Jh = (e) => !e || /transparent/.test(e) || /rgba\(.*,\s*0\)$/.test(e);
function couleurSelonFond(e, t) {
  let n = t === `haut`,
    r = ``,
    i = scrollY,
    a = document.documentElement,
    o = () => {
      if (!e.offsetHeight) return;
      let n = e.getBoundingClientRect(),
        i = t === `haut` ? n.bottom + 1 : n.top - 1,
        o = document.elementFromPoint(Math.min(innerWidth - 2, 24), Math.max(0, Math.min(innerHeight - 1, i))),
        s = ``;
      for (; o && o !== a;) {
        if (o === e || o.closest(`.onglets,.barre-mobile`)) {
          o = null;
          break;
        }
        let t = getComputedStyle(o).backgroundColor;
        if (!Jh(t)) {
          s = t;
          break;
        }
        o = o.parentElement;
      }
      if (((s ||= getComputedStyle(document.body).backgroundColor), s === r)) return;
      r = s;
      let c = qh(s) < 0.5;
      (e.style.setProperty(`--b-bg`, s),
        e.style.setProperty(`--b-tx`, c ? `#F8F5F2` : `#1A1A1A`),
        e.style.setProperty(`--b-inv`, c ? `#1A1A1A` : `#F8F5F2`),
        e.style.setProperty(`--b-ln`, c ? `rgba(248,245,242,.16)` : `rgba(26,26,26,.1)`),
        e.classList.toggle(`sombre`, c),
        e.classList.toggle(`ton`, !c && !/^rgba?\((248, 245, 242|255, 255, 255|250, 248, 245)[,)]/.test(s)));
    },
    s = () => {
      let t = scrollY;
      if (n && Math.abs(t - i) > 6) {
        let n = t > i && t > 140;
        (e.classList.toggle(`cache`, n), (i = t));
      }
      (e.classList.toggle(`on`, t > 8), o());
    },
    c = 0,
    l = () => {
      c ||= requestAnimationFrame(() => {
        ((c = 0), s());
      });
    },
    u = () => {
      ((r = ``), o());
    };
  (addEventListener(`scroll`, l, {
    passive: !0,
  }),
    addEventListener(`resize`, u));
  let d = () => {
    (e.classList.remove(`cache`), [60, 260, 600].forEach((e) => setTimeout(u, e)));
  };
  (addEventListener(`hashchange`, d), e.addEventListener(`focusin`, () => e.classList.remove(`cache`)));
  let f = new MutationObserver(() => {
    c ||= requestAnimationFrame(() => {
      ((c = 0), o());
    });
  });
  return (
    f.observe(document.getElementById(`contenu`) ?? document.body, {
      childList: !0,
      subtree: !0,
    }),
    [0, 120, 400].forEach((e) => setTimeout(u, e)),
    {
      destroy() {
        (removeEventListener(`scroll`, l),
          removeEventListener(`resize`, u),
          removeEventListener(`hashchange`, d),
          f.disconnect());
      },
    }
  );
}
