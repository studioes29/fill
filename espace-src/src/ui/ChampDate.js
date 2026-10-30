// Composant ChampDate (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var lv = H(`<small class="err svelte-1pzw3gm"> </small>`),
  uv = H(
    `<span><input type="text" inputmode="numeric" autocomplete="off" placeholder="jj/mm/aaaa" maxlength="10"/> <button type="button" class="cal svelte-1pzw3gm" aria-label="Choisir dans le calendrier"><!></button> <input class="natif svelte-1pzw3gm" type="date" tabindex="-1" aria-hidden="true"/></span> <!>`,
    1,
  );
function ChampDate(e, t) {
  qe(t, !0);
  let n = Ki(t, `value`, 15, ``),
    r = Ki(t, `min`, 3, ``),
    i = Ki(t, `classe`, 3, `saisie`),
    a = (e) => (/^\d{4}-\d{2}-\d{2}$/.test(e) ? `${e.slice(8, 10)}/${e.slice(5, 7)}/${e.slice(0, 4)}` : ``),
    o = N(en(a(n()))),
    s,
    c = N(!1);
  wn(() => {
    let e = n();
    e !== l(B(o)) && P(o, a(e), !0);
  });
  function l(e) {
    let t = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(e);
    if (!t) return ``;
    let n = `${t[3]}-${t[2]}-${t[1]}`,
      r = new Date(n + `T12:00:00`);
    return !isNaN(r.getTime()) && r.toISOString().slice(0, 10) === n ? n : ``;
  }
  let u = (e) => {
      let t = e.currentTarget,
        i = t.value.replace(/\D/g, ``).slice(0, 8);
      (P(
        o,
        i.length > 4
          ? `${i.slice(0, 2)}/${i.slice(2, 4)}/${i.slice(4)}`
          : i.length > 2
            ? `${i.slice(0, 2)}/${i.slice(2)}`
            : i,
        !0,
      ),
        (t.value = B(o)));
      let a = l(B(o));
      (P(c, i.length === 8 && (!a || (!!r() && a < r())), !0), n(a && !B(c) ? a : ``));
    },
    d = () => {
      try {
        s.showPicker();
      } catch {
        (s.focus(), s.click());
      }
    },
    f = () => {
      s.value && (n(s.value), P(o, a(s.value), !0), P(c, !1));
    };
  var p = uv(),
    m = I(p);
  let h;
  var g = F(m);
  ji(g);
  var _ = R(g, 2);
  (Icone(F(_), {
    n: `calendrier`,
    taille: 19,
  }),
    A(_));
  var v = R(_, 2);
  (ji(v),
    Vi(
      v,
      (e) => (s = e),
      () => s,
    ),
    A(m));
  var y = R(m, 2),
    b = (e) => {
      var t = lv(),
        n = L(t, !0);
      (z(
        (e) => W(n, e),
        [() => (r() && l(B(o)) && l(B(o)) < r() ? `Cette date est passée.` : `Date invalide : jj/mm/aaaa.`)],
      ),
        U(e, t));
    };
  (G(y, (e) => {
    B(c) && e(b);
  }),
    z(() => {
      ((h = q(m, 1, `date-fr svelte-1pzw3gm`, null, h, {
        erreur: B(c),
      })),
        J(g, `id`, t.id),
        q(g, 1, fi(i()), `svelte-1pzw3gm`),
        Mi(g, B(o)),
        J(g, `aria-invalid`, B(c)),
        J(v, `min`, r()),
        Mi(v, n()));
    }),
    V(`input`, g, u),
    V(`click`, _, d),
    V(`change`, v, f),
    U(e, p),
    Je());
}
kr([`input`, `click`, `change`]);
