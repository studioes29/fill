// Composant Fleche (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var vh = H(
  `<span class="ar" aria-hidden="true"><svg class="i" viewBox="0 0 24 24"><path></path></svg><svg class="i" viewBox="0 0 24 24"><path></path></svg></span>`,
);
function Fleche(e, t) {
  let n = Ki(t, `sens`, 3, `ar`),
    r = M(() => (n() === `ar` ? `M5 12h14M13 6l6 6-6 6` : `M19 12H5M11 6l-6 6 6 6`));
  var i = vh(),
    a = F(i),
    o = L(a),
    s = L(R(a));
  (A(i),
    z(() => {
      (J(o, `d`, B(r)), J(s, `d`, B(r)));
    }),
    U(e, i));
}
