// Module donnees/etat.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var CLE_DEMO = `fill-espace-demo-mvuakaue`;
var etatVide = () => ({
    organisations: [],
    utilisateurs: [],
    demandes: [],
    registre: [],
    commandes: [],
    prochainNumero: 0,
    fermetures: [],
    capacite: 30,
    pilote: {
      ...PILOTE_DEFAUT,
    },
    journal: [],
    factures: [],
  });
var etatInitial = () => {
    if (MODE_REEL) return etatVide();
    try {
      for (let e of Object.keys(localStorage))
        e.startsWith(`fill-espace-demo-`) && !e.startsWith(CLE_DEMO) && localStorage.removeItem(e);
      let e = localStorage.getItem(CLE_DEMO);
      if (e) {
        let t = JSON.parse(e);
        if (t?.organisations && t?.demandes && t?.commandes && t?.pilote && t?.journal) return t;
      }
    } catch {}
    return donneesDemo();
  };
var feter = (e) => {
    etat.fete = e;
  };
var etat = en({
    d: etatInitial(),
    moiId: MODE_REEL
      ? null
      : DEMO_VISITEUR
        ? `visiteur`
        : (() => {
            try {
              return localStorage.getItem(CLE_DEMO + `-moi`) ?? (DEMO_VISITEUR ? `visiteur` : null);
            } catch {
              return DEMO_VISITEUR ? `visiteur` : null;
            }
          })(),
    toasts: [],
    pret: !MODE_REEL,
    sessionSansProfil: null,
    nouveauMdp: !1,
    visite: !1,
    prerempli: null,
    fete: null,
  });
var sauver = () => {
    if (!MODE_REEL)
      try {
        (localStorage.setItem(CLE_DEMO, JSON.stringify(etat.d)),
          etat.moiId
            ? localStorage.setItem(CLE_DEMO + `-moi`, etat.moiId)
            : localStorage.removeItem(CLE_DEMO + `-moi`));
      } catch {}
  };
var compteurToasts = 0;
var toast = (e, t = `succes`, n) => {
    let r = {
      id: ++compteurToasts,
      type: t,
      texte: e,
      detail: n,
    };
    ((etat.toasts = [...etat.toasts.slice(-2), r]),
      typeof matchMedia < `u` &&
        matchMedia(`(prefers-reduced-motion: reduce)`).matches &&
        setTimeout(() => retirerToast(r.id), t === `erreur` ? 6500 : 4200));
  };
var retirerToast = (e) => {
    etat.toasts = etat.toasts.filter((t) => t.id !== e);
  };
var recharger = async () => {
    etat.d = await charger();
  };
var demarrer = async () => {
    if (!MODE_REEL) {
      (passePilote(), visiteSiPremiereConnexion());
      return;
    }
    let e = async (e) => {
      e
        ? (await recharger(),
          etat.d.utilisateurs.some((t) => t.id === e)
            ? ((etat.moiId = e), (etat.sessionSansProfil = null), visiteSiPremiereConnexion())
            : ((etat.moiId = null), (etat.sessionSansProfil = e)))
        : ((etat.moiId = null), (etat.sessionSansProfil = null));
    };
    try {
      let { verifierLienEmail: t } = await Tp(
          async () => {
            let { verifierLienEmail: e } = await Promise.resolve().then(() => moduleSupabase);
            return {
              verifierLienEmail: e,
            };
          },
          void 0,
          import.meta.url,
        ),
        n = await t().catch((e) => (toast(e.message, `erreur`), null));
      ((n === `recovery` || n === `invite`) && (etat.nouveauMdp = !0), await e(await sessionUtilisateur()));
    } catch (e) {
      toast(e.message, `erreur`);
    } finally {
      etat.pret = !0;
    }
    surConnexion((t, n) => {
      (n === `PASSWORD_RECOVERY` && (etat.nouveauMdp = !0), t !== etat.moiId && e(t));
    });
  };
var moi = () => etat.d.utilisateurs.find((e) => e.id === etat.moiId) ?? null;
var utilisateur = (e) => etat.d.utilisateurs.find((t) => t.id === e);
var organisation = (e) => etat.d.organisations.find((t) => t.id === e);
var estEquipe = () => [`admin`, `producteur`].includes(moi()?.role ?? ``);
var mesDemandes = () => {
    let e = moi();
    return e
      ? [
          ...(estEquipe() ? etat.d.demandes : etat.d.demandes.filter((t) => t.organisationId === e.organisationId)),
        ].sort((e, t) => t.creee.localeCompare(e.creee))
      : [];
  };
var demande = (e) => etat.d.demandes.find((t) => t.id === e);
var unitesPeriode = (e, t = periodeAnniversaire(e)) => etatPeriode(etat.d.registre, e, t);
var unitesEnAttente = (e, t) =>
    etat.d.demandes
      .filter((n) => n.id !== t && n.organisationId === e && [`deposee`, `accord_requis`].includes(n.statut))
      .reduce((e, t) => e + (t.unites ?? 0), 0);
var urgencesUtilisees = (e, t) => {
    let n = periodeAnniversaire(e);
    return etat.d.demandes.filter(
      (r) =>
        r.id !== t &&
        r.organisationId === e &&
        r.urgente &&
        r.statut !== `annulee` &&
        periodeAnniversaire(e, r.creee.slice(0, 10)) === n,
    ).length;
  };
var estimerPour = (e, t, n) =>
    estimer(t, {
      formule: organisation(e).formule,
      depot: aujourdhui(),
      urgencesUtilisees: urgencesUtilisees(e, n),
      disponibles: unitesPeriode(e).disponible - unitesEnAttente(e, n),
      fermetures: etat.d.fermetures,
    });
var engageParAuteur = (e) => {
    return etat.d.registre
      .filter(
        (n) =>
          n.type === `debit` &&
          n.etat !== `restitue` &&
          n.periode === periodeAnniversaire(n.organisationId) &&
          etat.d.demandes.find((e) => e.id === n.demandeId)?.auteurId === e,
      )
      .reduce((e, t) => e + t.unites, 0);
  };
var engageAuteur = engageParAuteur;
var decisionPilote = (e) => {
    let t = organisation(e.organisationId),
      n = utilisateur(e.auteurId) ?? {
        role: `referent`,
      },
      r = estimer(
        {
          lignes: e.lignes,
          urgente: e.urgente,
          parution: e.parution,
        },
        {
          formule: t.formule,
          depot: aujourdhui(),
          urgencesUtilisees: urgencesUtilisees(t.id, e.id),
          disponibles: unitesPeriode(t.id).disponible,
          fermetures: etat.d.fermetures,
        },
      );
    return deciderPilote(e, {
      auj: aujourdhui(),
      organisation: t,
      estimation: r,
      demandes: etat.d.demandes,
      capacite: etat.d.capacite,
      fermetures: etat.d.fermetures,
      auteur: n,
      engageAuteur: engageParAuteur(e.auteurId),
    });
  };
var maintenant = () => new Date().toISOString();
var nouvelId = () => Math.random().toString(36).slice(2, 10);
var changerStatut = (e, t, n, r = etat.moiId) => {
    ((e.statut = t),
      e.historique.push({
        date: maintenant(),
        statut: t,
        par: r,
        ...(n
          ? {
              detail: n,
            }
          : {}),
      }));
  };
var journaliser = (e, t = {}) => {
    (etat.d.journal.unshift({
      id: nouvelId(),
      date: maintenant(),
      texte: e,
      auto: t.auto ?? !0,
      demandeId: t.demandeId,
      organisationId: t.organisationId,
    }),
      (etat.d.journal = etat.d.journal.slice(0, 60)));
  };
var choisirProfil = (e) => {
    ((etat.moiId = e), sauver(), visiteSiPremiereConnexion());
  };
var seDeconnecter = async () => {
    if (MODE_REEL) {
      let { deconnecter: e } = await Tp(
        async () => {
          let { deconnecter: e } = await Promise.resolve().then(() => moduleSupabase);
          return {
            deconnecter: e,
          };
        },
        void 0,
        import.meta.url,
      );
      await e();
    }
    choisirProfil(null);
  };
var reinitialiserDemo = () => {
    ((etat.d = donneesDemo()), sauver(), toast(`Démonstration remise à zéro`, `info`));
  };
function visiteSiPremiereConnexion() {
  let e = moi();
  etat.visite = !(!e || e.visiteVue || e.role === `admin` || e.role === `producteur`);
}
