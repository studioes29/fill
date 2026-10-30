// Composant Demandes (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var tv = H(`<a class="bt lg"><!>Nouvelle demande</a>`),
  nv = H(`<option> </option>`),
  rv = H(
    `<label class="sr" for="cl">Client</label> <select id="cl" class="saisie sel svelte-vryu71"><option>Tous les clients</option><!></select>`,
    1,
  ),
  iv = H(`<li><!></li>`),
  av = H(`<ul></ul>`),
  ov = H(`<div class="vide centre svelte-vryu71"><b> </b></div>`),
  sv = H(
    `<!> <div class="feuille"><div class="w entre"><div class="barre svelte-vryu71"><!> <div class="droite svelte-vryu71"><!> <label class="recherche svelte-vryu71" for="q"><!><span class="sr">Rechercher</span><input id="q" type="search" placeholder="Rechercher un titre" class="svelte-vryu71"/></label></div></div> <section class="carte liste svelte-vryu71"><!></section></div></div>`,
    1,
  );
function Demandes(e, t) {
  qe(t, !0);
  let n = M(estEquipe),
    r = [
      {
        id: `cours`,
        nom: `En cours`,
        f: (e) => estEnCours(e.statut),
      },
      {
        id: `traiter`,
        nom: `À traiter`,
        f: (e) => (estEquipe() ? [`deposee`].includes(e.statut) : attendClient(e.statut)),
      },
      {
        id: `livrees`,
        nom: `Livrées`,
        f: (e) => e.statut === `livree`,
      },
      {
        id: `annulees`,
        nom: `Annulées`,
        f: (e) => e.statut === `annulee`,
      },
      {
        id: `toutes`,
        nom: `Toutes`,
        f: () => !0,
      },
    ],
    i = N(`cours`),
    a = N(``),
    o = N(``),
    s = M(() => mesDemandes().filter((e) => !B(a) || e.organisationId === B(a))),
    c = M(() =>
      B(s)
        .filter(r.find((e) => e.id === B(i)).f)
        .filter((e) => !B(o).trim() || e.titre.toLowerCase().includes(B(o).trim().toLowerCase())),
    );
  var l = sv(),
    u = I(l);
  EnTete(u, {
    titre: `Demandes`,
    actions: (e) => {
      var t = Br(),
        r = I(t),
        i = (e) => {
          var t = tv();
          (Icone(F(t), {
            n: `plus`,
          }),
            j(),
            A(t),
            z((e) => J(t, `href`, e), [() => lienRoute(`nouvelle`)]),
            U(e, t));
        },
        a = M(() => !B(n) && moi()?.role !== `lecteur`);
      (G(r, (e) => {
        B(a) && e(i);
      }),
        U(e, t));
    },
    $$slots: {
      actions: !0,
    },
  });
  var d = R(u, 2),
    f = F(d),
    p = F(f),
    m = F(p);
  {
    let e = M(() =>
      r.map((e) => ({
        id: e.id,
        nom: e.nom,
        n: B(s).filter(e.f).length,
      })),
    );
    Curseur(m, {
      libelle: `Filtrer les demandes`,
      get options() {
        return B(e);
      },
      get valeur() {
        return B(i);
      },
      set valeur(e) {
        P(i, e, !0);
      },
    });
  }
  var h = R(m, 2),
    g = F(h),
    _ = (e) => {
      var t = rv(),
        n = R(I(t), 2),
        r = F(n);
      ((r.value = r.__value = ``),
        K(
          R(r),
          17,
          () => etat.d.organisations,
          Qr,
          (e, t) => {
            var n = nv(),
              r = L(n, !0),
              i = {};
            (z(() => {
              (W(r, B(t).nom), i !== (i = B(t).id) && (n.value = (n.__value = i) ?? ``));
            }),
              U(e, n));
          },
        ),
        A(n),
        Ci(n),
        wi(
          n,
          () => B(a),
          (e) => P(a, e),
        ),
        U(e, t));
    };
  G(g, (e) => {
    B(n) && e(_);
  });
  var v = R(g, 2),
    y = F(v);
  Icone(y, {
    n: `recherche`,
    taille: 18,
  });
  var b = R(y, 2);
  (ji(b), A(v), A(h), A(p));
  var x = R(p, 2),
    S = F(x),
    C = (e) => {
      var t = av();
      (K(
        t,
        21,
        () => B(c),
        (e) => e.id,
        (e, t) => {
          var n = iv();
          (CarteDemande(F(n), {
            get d() {
              return B(t);
            },
          }),
            A(n),
            U(e, n));
        },
      ),
        A(t),
        U(e, t));
    },
    w = (e) => {
      var t = ov(),
        n = L(F(t), !0);
      (A(t),
        z(() =>
          W(n, B(o) ? `Aucune demande ne correspond à cette recherche.` : `Aucune demande dans cette catégorie.`),
        ),
        U(e, t));
    };
  (G(S, (e) => {
    B(c).length ? e(C) : e(w, -1);
  }),
    A(x),
    A(f),
    A(d),
    Ii(
      b,
      () => B(o),
      (e) => P(o, e),
    ),
    U(e, l),
    Je());
}
