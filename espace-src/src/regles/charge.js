// Module regles/charge.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var STATUTS_ACTIFS = [`confirmee`, `production`, `correction`, `attente_client`];
var lundiDe = (e) => ajouterJours(e, -((new Date(e + `T00:00:00Z`).getUTCDay() + 6) % 7));
var chargeSemaine = (e, t, n) => {
    let r = ajouterJours(t, 6);
    return e
      .filter(
        (e) => e.id !== n && STATUTS_ACTIFS.includes(e.statut) && e.livraison && e.livraison >= t && e.livraison <= r,
      )
      .reduce((e, t) => e + (t.unites ?? 0), 0);
  };
var semaines = (e, t, n, r, i = []) =>
    Array.from(
      {
        length: n,
      },
      (n, a) => {
        let o = ajouterJours(lundiDe(t), 7 * a),
          s = 0;
        for (let e = 0; e < 5; e++) estOuvre(ajouterJours(o, e), i) && s++;
        return {
          debut: o,
          charge: chargeSemaine(e, o),
          capacite: Math.round((r * s) / 5),
          ouvres: s,
        };
      },
    );
var verifierCapacite = (e, t, n, r, i, a = []) => {
    let [o] = semaines(
        e.filter((e) => e.id !== t),
        r,
        1,
        i,
        a,
      ),
      s = o.charge + n;
    if (s <= o.capacite)
      return {
        charge: o.charge,
        apres: s,
        capacite: o.capacite,
        tient: !0,
        premiereDate: null,
      };
    let c = null;
    for (let o = 1; o <= 8 && !c; o++) {
      let s = ajouterJours(lundiDe(r), 7 * o),
        [l] = semaines(
          e.filter((e) => e.id !== t),
          s,
          1,
          i,
          a,
        );
      if (l.charge + n <= l.capacite) {
        let e = s;
        for (; !estOuvre(e, a);) e = ajouterJours(e, 1);
        c = e;
      }
    }
    return {
      charge: o.charge,
      apres: s,
      capacite: o.capacite,
      tient: !1,
      premiereDate: c,
    };
  };
