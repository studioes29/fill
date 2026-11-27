/* Fill · rubrique Ressources : sommaire qui suit la lecture, filtres de l'index. */
(function () {
  "use strict";
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- sommaire : la section lue est marquée, le sommaire se replie sur mobile après un clic ---------- */
  var som = document.querySelector(".ra-som");
  if (som) {
    var liens = $$("ol a", som), titres = liens.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    var det = som.querySelector("details"), large = window.matchMedia("(min-width: 1080px)");
    var regler = function () { if (det) det.open = large.matches || det.dataset.ouvert === "1"; };
    if (det) {
      det.dataset.ouvert = "0"; regler();
      det.addEventListener("toggle", function () { if (!large.matches) det.dataset.ouvert = det.open ? "1" : "0"; });
      if (large.addEventListener) large.addEventListener("change", regler);
    }
    var marquer = function () {
      var y = window.scrollY + 140, cur = null;
      titres.forEach(function (t) { if (t.getBoundingClientRect().top + window.scrollY <= y) cur = t.id; });
      liens.forEach(function (a) { a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + cur)); });
    };
    var att = false;
    window.addEventListener("scroll", function () { if (att) return; att = true; requestAnimationFrame(function () { att = false; marquer(); }); }, { passive: true });
    marquer();
    liens.forEach(function (a) { a.addEventListener("click", function () { if (!large.matches && det) { det.open = false; det.dataset.ouvert = "0"; } }); });
  }

  /* ---------- index : filtres par type ---------- */
  var f = document.querySelector(".ra-filtres");
  if (f) {
    var cartes = $$(".ra-tout .ra-carte"), boutons = $$("button", f);
    var appliquer = function (v) {
      boutons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.f === v)); });
      var premier = true;
      cartes.forEach(function (c) {
        var ok = !v || c.dataset.cat === v; c.hidden = !ok;
        c.classList.toggle("une", ok && premier && !v); if (ok) premier = false;
      });
    };
    boutons.forEach(function (b) { b.addEventListener("click", function () { appliquer(b.dataset.f); }); });
  }
})();
