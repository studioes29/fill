// Composant NouveauMotDePasse (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var Ig = H(`<p class="note n-danger" role="alert"><!> </p>`),
  Lg = H(
    `<main class="nm svelte-1wa1ydq"><form class="carte boite entre svelte-1wa1ydq" novalidate=""><!> <h1 class="t2">Choisissez votre mot de passe</h1> <p class="mu">Il vous servira, avec votre adresse e-mail, à vous connecter à votre espace Fill.</p> <label class="champ" for="nm-mdp"><span>Nouveau mot de passe</span> <span class="mdp svelte-1wa1ydq"><input id="nm-mdp" class="saisie svelte-1wa1ydq" autocomplete="new-password"/><button type="button" class="voir svelte-1wa1ydq"><!></button></span> <small>8 caractères au moins.</small></label> <button class="bt lg svelte-1wa1ydq" type="submit">Enregistrer et entrer <!></button> <!></form></main>`,
  );
function NouveauMotDePasse(e, t) {
  qe(t, !0);
  let n = N(``),
    r = N(!1),
    i = N(``),
    a = N(!1),
    o = async (e) => {
      if ((e.preventDefault(), B(n).length < 8)) P(i, `Choisissez un mot de passe de 8 caractères au moins.`);
      else {
        (P(a, !0), P(i, ``));
        try {
          (await changerMotDePasse(B(n)), (etat.nouveauMdp = !1), toast(`Mot de passe enregistré`));
        } catch (e) {
          P(i, e.message, !0);
        } finally {
          P(a, !1);
        }
      }
    };
  var s = Lg(),
    c = F(s),
    l = F(c);
  Logo(l, {
    hauteur: 34,
    anime: !0,
    fonce: !0,
  });
  var u = R(l, 6),
    d = R(F(u), 2),
    f = F(d);
  ji(f);
  var p = R(f),
    m = F(p);
  {
    let e = M(() => (B(r) ? `non` : `lire`));
    Icone(m, {
      get n() {
        return B(e);
      },
      taille: 18,
    });
  }
  (A(p), A(d), j(2), A(u));
  var h = R(u, 2);
  (Fleche(R(F(h)), {}), A(h));
  var g = R(h, 2),
    _ = (e) => {
      var t = Ig(),
        n = F(t);
      Icone(n, {
        n: `alerte`,
      });
      var r = R(n, 1, !0);
      (A(t), z(() => W(r, B(i))), U(e, t));
    };
  (G(g, (e) => {
    B(i) && e(_);
  }),
    A(c),
    A(s),
    z(() => {
      (J(f, `type`, B(r) ? `text` : `password`),
        J(p, `aria-label`, B(r) ? `Masquer le mot de passe` : `Afficher le mot de passe`),
        (h.disabled = B(a)));
    }),
    Or(`submit`, c, o),
    Ii(
      f,
      () => B(n),
      (e) => P(n, e),
    ),
    V(`click`, p, () => P(r, !B(r))),
    U(e, s),
    Je());
}
kr([`click`]);
