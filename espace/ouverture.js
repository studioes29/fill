/* Écran d'ouverture de l'Espace Fill : une fois par session (onglet), sauf mouvement réduit ou ?sans-intro. Un appui ou une touche le passe. */
(function () {
  var h = document.documentElement;
  try { if (sessionStorage.getItem('fil.espace.intro') || matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]sans-intro/.test(location.search)) return; sessionStorage.setItem('fil.espace.intro', '1'); } catch (e) { return; }
  h.classList.add('intro');
  var LOGO = '<svg viewBox="0 0 1376 720" role="img" aria-hidden="true"><g class="lg-fi"><path d="M100 700V262C100 158 168 90 274 90H300V214H282C246 214 224 236 224 274V700Z"/><rect x="18" y="330" width="282" height="104" rx="8"/><rect x="360" y="330" width="124" height="370" rx="8"/><circle cx="422" cy="178" r="72"/></g><g class="lg-ll" fill="none" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"><path class="lg-l1" pathLength="1" d="M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600"/><path class="lg-l2" pathLength="1" d="M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575"/></g></svg>';
  function lance() {
    var ov = document.createElement('div'); ov.className = 'intro-e'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<span class="intro-m"></span><div class="intro-l">' + LOGO + '</div><p class="intro-t">Votre communication, <i>sans perdre le fil.</i></p>';
    document.body.appendChild(ov);
    var fini = false;
    function termine() { if (fini) return; fini = true; ov.classList.add('sort'); h.classList.remove('intro'); setTimeout(function () { ov.remove(); }, 1000); }
    requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('go'); }); });
    var t = setTimeout(termine, 1650);
    ov.addEventListener('click', function () { clearTimeout(t); termine(); });
    ['keydown', 'wheel', 'touchstart'].forEach(function (ev) { addEventListener(ev, function () { clearTimeout(t); termine(); }, { once: true, passive: true }); });
  }
  if (document.body) lance(); else document.addEventListener('DOMContentLoaded', lance);
})();
