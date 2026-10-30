// Composant Comptes (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var $C = H(`<p class="note n-alerte svelte-11nfxvx"><!> </p>`),
  ew = H(
    `<p class="mu svelte-11nfxvx">Fill a vérifié cet accès : il publie sur ce canal à la date prévue. Vous pouvez le retirer à tout moment depuis l’outil concerné.</p>`,
  ),
  tw = H(
    `<p class="mu svelte-11nfxvx">Fill vérifie l’accès et vous confirme ici. S’il ne fonctionne pas, la raison s’affiche sur cette carte.</p>`,
  ),
  nw = H(
    `<p class="mu svelte-11nfxvx">Pas de publication sur ce canal : pour un contenu qui le concerne, Fill vous remet les fichiers prêts à publier.</p>`,
  ),
  rw = H(`<li class="svelte-11nfxvx"><span class="num svelte-11nfxvx"></span> </li>`),
  iw = H(`<ol class="comment svelte-11nfxvx"></ol>`),
  aw = H(
    `<button class="bt sm"><!>C’est fait</button> <button class="lien-discret">Pas ce canal, ou je publie moi-même</button>`,
    1,
  ),
  ow = H(`<button class="bt sm cl">Finalement, donner l’accès</button>`),
  sw = H(`<button class="lien-discret"> </button>`),
  cw = H(`<div class="actions svelte-11nfxvx"><!></div>`),
  lw = H(`<div class="c-d svelte-11nfxvx"><!> <!></div>`),
  uw = H(
    `<li><button class="c-t svelte-11nfxvx"><span class="pt svelte-11nfxvx"><!></span> <b class="svelte-11nfxvx"> </b> <span> </span> <span class="ch svelte-11nfxvx" aria-hidden="true"><!></span></button> <!> <!></li>`,
  ),
  dw = H(`<p class="petit svelte-11nfxvx"> </p>`),
  fw = H(
    `<!> <div class="feuille"><div class="w entre svelte-11nfxvx"><section class="liste svelte-11nfxvx" aria-labelledby="t-can"><h2 class="sr" id="t-can">Vos canaux</h2> <ul class="svelte-11nfxvx"></ul></section> <aside class="regles svelte-11nfxvx" aria-labelledby="t-pq"><span class="motif svelte-11nfxvx" aria-hidden="true"></span> <div class="bilan svelte-11nfxvx"><b class="num svelte-11nfxvx"> <small class="svelte-11nfxvx"> </small></b> <span class="svelte-11nfxvx"> </span></div> <h2 class="t3 svelte-11nfxvx" id="t-pq">Pourquoi ces accès</h2> <p class="svelte-11nfxvx">Une fois un contenu validé, Fill le publie lui-même, à la date et à l’heure prévues. Sans accès, il vous remet les fichiers et la publication reste de votre côté.</p> <h2 class="t3 svelte-11nfxvx">Sans mot de passe</h2> <p class="svelte-11nfxvx">Chaque outil permet d’inviter une personne avec des droits limités. Invitez <button class="adr svelte-11nfxvx" title="Copier l’adresse"> <!></button> : l’accès est au nom de Fill, vous le retirez quand vous voulez. Ne communiquez jamais un mot de passe, ni ici ni par e-mail.</p> <!></aside></div></div>`,
    1,
  );
function Comptes(e, t) {
  qe(t, !0);
  let n = M(moi),
    r = M(() => organisation(B(n).organisationId)),
    i = M(() => B(n).role === `referent`),
    a = M(() => membres(B(r).id).find((e) => e.role === `referent`)?.nom),
    o = M(() => etatAcces(B(r).acces)),
    s = N(null),
    c = N(!1),
    l = async (e, t) => {
      P(c, !0);
      try {
        (await declarerAcces(e, t),
          t === `donne` &&
            toast(`Merci, Fill vérifie l’accès`, `succes`, `Vous êtes prévenu ici s’il ne fonctionne pas.`),
          (t === `donne` || t === `sans_objet`) && P(s, null));
      } catch (e) {
        toast(e.message, `erreur`);
      } finally {
        P(c, !1);
      }
    },
    u = async () => {
      try {
        (await navigator.clipboard.writeText(ADRESSE_ACCES), toast(`Adresse copiée`, `info`, ADRESSE_ACCES));
      } catch {}
    };
  var d = fw(),
    f = I(d);
  EnTete(f, {
    titre: `Vos comptes`,
    sous: `Les accès qui permettent à Fill de publier`,
  });
  var p = R(f, 2),
    m = F(p),
    h = F(m),
    g = R(F(h), 2);
  (K(
    g,
    21,
    () => CANAUX,
    (e) => e.id,
    (e, t) => {
      let n = M(() => accesCanal(B(r).acces, B(t).id)),
        a = M(() => B(n).statut === `a_donner` && B(n).note);
      var o = uw();
      let u;
      var d = F(o),
        f = F(d),
        p = F(f),
        m = (e) => {
          Icone(e, {
            n: `ok`,
            taille: 16,
          });
        },
        h = (e) => {
          Icone(e, {
            n: `horloge`,
            taille: 16,
          });
        },
        g = (e) => {
          Icone(e, {
            n: `moins`,
            taille: 16,
          });
        },
        _ = (e) => {
          Icone(e, {
            n: `cle`,
            taille: 16,
          });
        };
      (G(p, (e) => {
        B(n).statut === `verifie`
          ? e(m)
          : B(n).statut === `donne`
            ? e(h, 1)
            : B(n).statut === `sans_objet`
              ? e(g, 2)
              : e(_, -1);
      }),
        A(f));
      var v = R(f, 2),
        y = L(v, !0),
        b = R(v, 2),
        x = L(b, !0),
        S = R(b, 2);
      (Icone(F(S), {
        n: `bas`,
        taille: 18,
      }),
        A(S),
        A(d));
      var C = R(d, 2),
        w = (e) => {
          var t = $C(),
            r = F(t);
          Icone(r, {
            n: `alerte`,
          });
          var i = R(r);
          (A(t), z(() => W(i, `Fill : ${B(n).note ?? ``}`)), U(e, t));
        };
      G(C, (e) => {
        B(a) && e(w);
      });
      var T = R(C, 2),
        ee = (e) => {
          var r = lw(),
            a = F(r),
            o = (e) => {
              U(e, ew());
            },
            s = (e) => {
              U(e, tw());
            },
            u = (e) => {
              U(e, nw());
            },
            d = (e) => {
              var n = iw();
              (K(
                n,
                21,
                () => B(t).comment,
                Qr,
                (e, t, n) => {
                  var r = rw(),
                    i = F(r);
                  i.textContent = n + 1;
                  var a = R(i, 1, !0);
                  (A(r), z(() => W(a, B(t))), U(e, r));
                },
              ),
                A(n),
                U(e, n));
            };
          G(a, (e) => {
            B(n).statut === `verifie`
              ? e(o)
              : B(n).statut === `donne`
                ? e(s, 1)
                : B(n).statut === `sans_objet`
                  ? e(u, 2)
                  : e(d, -1);
          });
          var f = R(a, 2),
            p = (e) => {
              var r = cw(),
                i = F(r),
                a = (e) => {
                  var n = aw(),
                    r = I(n);
                  (Icone(F(r), {
                    n: `ok`,
                    taille: 16,
                  }),
                    j(),
                    A(r));
                  var i = R(r, 2);
                  (z(() => {
                    ((r.disabled = B(c)), (i.disabled = B(c)));
                  }),
                    V(`click`, r, () => l(B(t).id, `donne`)),
                    V(`click`, i, () => l(B(t).id, `sans_objet`)),
                    U(e, n));
                },
                o = (e) => {
                  var n = ow();
                  (z(() => (n.disabled = B(c))), V(`click`, n, () => l(B(t).id, `a_donner`)), U(e, n));
                },
                s = (e) => {
                  var r = sw(),
                    i = L(r, !0);
                  (z(() => {
                    ((r.disabled = B(c)), W(i, B(n).statut === `verifie` ? `J’ai retiré cet accès` : `Annuler`));
                  }),
                    V(`click`, r, () => l(B(t).id, `a_donner`)),
                    U(e, r));
                };
              (G(i, (e) => {
                B(n).statut === `a_donner` ? e(a) : B(n).statut === `sans_objet` ? e(o, 1) : e(s, -1);
              }),
                A(r),
                U(e, r));
            };
          (G(f, (e) => {
            B(i) && e(p);
          }),
            A(r),
            U(e, r));
        };
      (G(T, (e) => {
        B(s) === B(t).id && e(ee);
      }),
        A(o),
        z(() => {
          ((u = q(o, 1, `carte canal svelte-11nfxvx`, null, u, {
            ouvert: B(s) === B(t).id,
            off: B(n).statut === `sans_objet`,
          })),
            J(d, `aria-expanded`, B(s) === B(t).id),
            J(f, `data-s`, B(n).statut),
            W(y, B(t).nom),
            q(b, 1, `pastille ${STATUTS_ACCES[B(n).statut].ton ?? ``}`, `svelte-11nfxvx`),
            W(x, B(a) ? `À redonner` : STATUTS_ACCES[B(n).statut].nom));
        }),
        V(`click`, d, () => P(s, B(s) === B(t).id ? null : B(t).id, !0)),
        U(e, o));
    },
  ),
    A(g),
    A(h));
  var _ = R(h, 2),
    v = R(F(_), 2),
    y = F(v),
    b = F(y, !0),
    x = L(R(b));
  A(y);
  var S = L(R(y, 2), !0);
  A(v);
  var C = R(v, 8),
    w = R(F(C)),
    T = F(w, !0);
  (Icone(R(T), {
    n: `copier`,
    taille: 14,
  }),
    A(w),
    j(),
    A(C));
  var ee = R(C, 2),
    E = (e) => {
      var t = dw(),
        n = L(t);
      (z(() => W(n, `Les accès sont gérés par le référent${B(a) ? ` (${B(a)})` : ``}.`)), U(e, t));
    };
  (G(ee, (e) => {
    B(i) || e(E);
  }),
    A(_),
    A(m),
    A(p),
    z(() => {
      (W(b, B(o).ok + B(o).enVerif),
        W(x, `/${B(o).utiles ?? ``}`),
        W(
          S,
          B(o).complet
            ? `Tous vos canaux sont prêts.`
            : `canal${B(o).utiles > 1 ? `aux` : ``} prêt${B(o).ok + B(o).enVerif > 1 ? `s` : ``} pour la publication`,
        ),
        W(T, ADRESSE_ACCES));
    }),
    V(`click`, w, u),
    U(e, d),
    Je());
}
kr([`click`]);
