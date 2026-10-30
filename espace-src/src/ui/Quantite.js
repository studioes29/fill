// Composant Quantite (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var h_ = H(`<output class="num svelte-7mebf3" aria-live="polite"> </output>`);
var g_ = H(
    `<div role="group"><button type="button" class="svelte-7mebf3"><svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-7mebf3"><path d="M6 12h12"></path></svg></button> <!> <button type="button" class="svelte-7mebf3"><svg viewBox="0 0 24 24" aria-hidden="true" class="svelte-7mebf3"><path d="M12 6v12M6 12h12"></path></svg></button></div>`,
  );
function Quantite(e, t) {
  qe(t, !0);
  let n = Ki(t, `valeur`, 15, 0),
    r = Ki(t, `min`, 3, 0),
    i = Ki(t, `max`, 3, 99),
    a = Ki(t, `taille`, 3, `md`),
    o = (e) => {
      n(Math.max(r(), Math.min(i(), n() + e)));
    };
  var s = g_(),
    c = F(s),
    l = R(c, 2);
  Zr(l, n, (e) => {
    var t = h_(),
      r = L(t, !0);
    (z(() => W(r, n())), U(e, t));
  });
  var u = R(l, 2);
  (A(s),
    z(() => {
      (q(s, 1, `stepper ${a() ?? ``}`, `svelte-7mebf3`),
        J(s, `aria-label`, t.libelle),
        (c.disabled = n() <= r()),
        J(c, `aria-label`, `Retirer une unité de « ${t.libelle ?? ``} »`),
        (u.disabled = n() >= i()),
        J(u, `aria-label`, `Ajouter une unité de « ${t.libelle ?? ``} »`));
    }),
    V(`click`, c, (e) => {
      (e.stopPropagation(), o(-1));
    }),
    V(`click`, u, (e) => {
      (e.stopPropagation(), o(1));
    }),
    U(e, s),
    Je());
}
kr([`click`]);
