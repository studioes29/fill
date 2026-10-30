// Composant Logo (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var lh = Rr(
  `<svg viewBox="0 0 1376 720" role="img" aria-label="Fill"><g class="fi svelte-3bcpqf"><path d="M100 700V262C100 158 168 90 274 90H300V214H282C246 214 224 236 224 274V700Z" class="svelte-3bcpqf"></path><rect x="18" y="330" width="282" height="104" rx="8" class="svelte-3bcpqf"></rect><rect x="360" y="330" width="124" height="370" rx="8" class="svelte-3bcpqf"></rect><circle cx="422" cy="178" r="72" class="svelte-3bcpqf"></circle></g><g fill="none" stroke-width="96" stroke-linecap="round" stroke-linejoin="round" class="svelte-3bcpqf"><path class="l1 svelte-3bcpqf" pathLength="1" d="M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600"></path><path class="l2 svelte-3bcpqf" pathLength="1" d="M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575"></path></g></svg>`,
);
function Logo(e, t) {
  let n = Ki(t, `hauteur`, 3, 30),
    r = Ki(t, `anime`, 3, !1),
    i = Ki(t, `fonce`, 3, !1);
  var a = lh();
  let o;
  (z(() => {
    ((o = q(a, 0, `logo svelte-3bcpqf`, null, o, {
      anime: r(),
      fonce: i(),
    })),
      J(a, `height`, n()),
      J(a, `width`, (n() * 1376) / 720));
  }),
    U(e, a));
}
We();
