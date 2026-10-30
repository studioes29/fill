// Module regles/estimation.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var RANG_NATURE = {
    courant: 0,
    creation: 1,
    planifie: 2,
  };
var natureDelai = (e) => (TYPES_PLANIFIES.includes(e) ? `planifie` : TYPES_CREATION.includes(e) ? `creation` : `courant`);
var delaiUrgent = (e) => Math.max(1, Math.floor(e / 2));
var normaliserLignes = (e) => {
    let t = new Map();
    for (let n of e) n.quantite > 0 && t.set(n.prestation, (t.get(n.prestation) ?? 0) + Math.round(n.quantite));
    return [...t.entries()].map(([e, t]) => ({
      prestation: e,
      quantite: t,
    }));
  };
var estimer = (e, t) => {
    let n = formule(t.formule),
      r = t.fermetures ?? [],
      i = ajouterOuvres(t.depot, 1, r),
      a = {
        ok: !1,
        detail: [],
        unitesBase: 0,
        unitesUrgence: 0,
        unites: 0,
        urgenceIncluse: !1,
        nature: `courant`,
        delaiJ: null,
        confirmationAuPlusTard: i,
        livraisonAuPlusTot: null,
        livraisonUrgente: null,
        parutionTenable: null,
        horsForfait: 0,
        coutHorsForfait: 0,
      },
      o = normaliserLignes(e.lignes);
    if (!o.length)
      return {
        ...a,
        erreur: `Choisissez au moins une prestation.`,
      };
    let s = [];
    for (let e of o) {
      let n = prestation(e.prestation);
      if (!n)
        return {
          ...a,
          erreur: `Prestation inconnue.`,
        };
      if (n.min && ORDRE_FORMULES.indexOf(t.formule) < ORDRE_FORMULES.indexOf(n.min))
        return {
          ...a,
          erreur: `${n.nom} : disponible à partir de la formule ${formule(n.min).nom}.`,
        };
      let r = Math.min(n.max ?? 99, e.quantite);
      s.push({
        prestation: n.id,
        nom: n.nom,
        quantite: r,
        unites: n.u * r,
        nature: natureDelai(n.id),
      });
    }
    let c = s.reduce((e, t) => (RANG_NATURE[t.nature] > RANG_NATURE[e] ? t.nature : e), `courant`),
      l = s.reduce((e, t) => e + t.unites, 0),
      u = e.urgente && t.urgencesUtilisees < n.urgences_incluses,
      d = e.urgente && !u ? OFFRE.urgenceUnites : 0,
      f = l + d,
      p = null;
    (c === `courant` && (p = n.delai_j), c === `creation` && (p = OFFRE.delaiCreationJ));
    let m = p === null ? null : e.urgente ? delaiUrgent(p) : p,
      h = m === null ? null : ajouterOuvres(i, m, r),
      g = p === null ? null : ajouterOuvres(i, delaiUrgent(p), r),
      _ = null;
    if ((e.parution && h && (_ = h <= e.parution), e.parution && c === `planifie`)) {
      let n = s.some((e) => e.prestation === `bulletin`) ? 15 : 5;
      _ = ouvresEntre(t.depot, e.parution, r) >= n;
    }
    let v = Math.max(0, f - Math.max(0, t.disponibles));
    return {
      ok: !0,
      detail: s,
      unitesBase: l,
      unitesUrgence: d,
      unites: f,
      urgenceIncluse: u,
      nature: c,
      delaiJ: m,
      confirmationAuPlusTard: i,
      livraisonAuPlusTot: h,
      livraisonUrgente: g,
      parutionTenable: _,
      horsForfait: v,
      coutHorsForfait: v * OFFRE.uniteSup,
    };
  };
var accordNecessaire = (e, t, n) => {
    if (e.horsForfait > 0)
      return {
        requis: !0,
        motif: `${e.horsForfait} unité${e.horsForfait > 1 ? `s` : ``} hors forfait`,
      };
    if (t.role === `contributeur`) {
      let r = t.plafondMensuel ?? 0;
      if (n + e.unites > r)
        return {
          requis: !0,
          motif: `Demande déposée par un contributeur au-delà de son plafond`,
        };
    }
    return {
      requis: !1,
      motif: null,
    };
  };
