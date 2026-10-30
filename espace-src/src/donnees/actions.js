// Module donnees/actions.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var ouvrirVisite = () => {
    etat.visite = !0;
  };
var fermerVisite = async () => {
    etat.visite = !1;
    let e = moi();
    e && !e.visiteVue && ((e.visiteVue = !0), MODE_REEL ? await api.marquerVisite().catch(() => null) : sauver());
  };
var messageUnitesInsuffisantes = (e, t) =>
    `Unités insuffisantes : cette demande compte ${e} unité${e > 1 ? `s` : ``}, il en reste ${Math.max(0, t)} sur le compte. Rechargez le compte pour l’envoyer.`;
var deposerDemande = async (e) => {
    let t = moi(),
      n = normaliserLignes(e.lignes);
    if (MODE_REEL) {
      let r = await api.deposer({
        ...e,
        lignes: n,
        titre: e.titre.trim(),
        brief: e.brief.trim(),
      });
      for (let n of e.fichiers ?? []) await api.joindre(r, t.organisationId, n);
      return (
        api.notifier(`depot`, {
          demande: r,
        }),
        await recharger(),
        {
          id: r,
          statut: demande(r)?.statut ?? `deposee`,
        }
      );
    }
    let r = estimerPour(t.organisationId, {
      lignes: n,
      urgente: e.urgente,
      parution: e.parution,
    });
    if (!r.ok) throw Error(r.erreur);
    if (r.horsForfait > 0) throw Error(messageUnitesInsuffisantes(r.unites, r.unites - r.horsForfait));
    let i = {
      id: `d${nouvelId()}`,
      numero: etat.d.prochainNumero++,
      organisationId: t.organisationId,
      auteurId: t.id,
      titre: e.titre.trim(),
      lignes: n,
      urgente: e.urgente,
      parution: e.parution,
      heure: e.heure || null,
      brief: e.brief.trim(),
      pieces: e.pieces,
      statut: `deposee`,
      creee: maintenant(),
      unites: r.unites,
      unitesHorsForfait: 0,
      livraison: null,
      corrections: 0,
      messages: [],
      versions: [],
      historique: [],
    };
    return (
      i.historique.push({
        date: i.creee,
        statut: `deposee`,
        par: t.id,
      }),
      etat.d.demandes.push(i),
      etat.d.pilote.confirmation && piloterDemande(i),
      sauver(),
      {
        id: i.id,
        statut: i.statut,
      }
    );
  };
var piloterDemande = (e) => {
    let t = decisionPilote(e);
    return (
      t.auto &&
        (confirmerLocal(
          e,
          {
            livraison: t.livraison,
          },
          `pilote`,
        ),
        journaliser(
          e.statut === `confirmee`
            ? `« ${e.titre} » confirmée, livraison le ${jourMois(t.livraison)}`
            : `« ${e.titre} » transmise au référent : ${t.accord}`,
          {
            demandeId: e.id,
            organisationId: e.organisationId,
          },
        )),
      t
    );
  };
var passePilote = (e = !1) => {
    if (MODE_REEL)
      return {
        confirmees: 0,
        relances: 0,
      };
    let t = 0,
      n = 0;
    if (e) for (let e of etat.d.demandes.filter((e) => e.statut === `deposee`)) piloterDemande(e).auto && t++;
    if (etat.d.pilote.relances)
      for (let e of etat.d.demandes)
        aRelancer(e, aujourdhui(), etat.d.fermetures) &&
          (e.historique.push({
            date: maintenant(),
            statut: e.statut,
            par: `pilote`,
            type: `relance`,
            detail: `Relance envoyée`,
          }),
          e.messages.push({
            id: nouvelId(),
            auteurId: `pilote`,
            date: maintenant(),
            systeme: !0,
            texte:
              e.statut === `a_valider`
                ? `Rappel : une version attend votre validation.`
                : `Rappel : une pièce est attendue pour reprendre la production.`,
          }),
          journaliser(`Relance envoyée : « ${e.titre} »`, {
            demandeId: e.id,
            organisationId: e.organisationId,
          }),
          n++);
    return (
      etat.d.pilote.facturation && facturesAEmettre().some((e) => !e.emise) && emettreFactures(),
      (t || n) && sauver(),
      {
        confirmees: t,
        relances: n,
      }
    );
  };
var modifierDemande = async (e, t) => {
    let n = demande(e),
      r = moi();
    if (!peutModifier(n.statut, r.role, n.auteurId === r.id))
      throw Error(`La demande est déjà confirmée par Fill : écrivez dans les échanges pour la faire évoluer.`);
    let i = normaliserLignes(t.lignes),
      a = changements(n, {
        ...t,
        lignes: i,
      });
    if (!a.length) return [];
    let o = a.join(`, `);
    if (MODE_REEL)
      return (
        await api.modifier(
          e,
          {
            ...t,
            lignes: i,
          },
          o,
        ),
        api.notifier(`statut`, {
          demande: e,
        }),
        await recharger(),
        a
      );
    let s = estimerPour(
      n.organisationId,
      {
        lignes: i,
        urgente: t.urgente,
        parution: t.parution,
      },
      n.id,
    );
    if (!s.ok) throw Error(s.erreur);
    if (s.horsForfait > 0) throw Error(messageUnitesInsuffisantes(s.unites, s.unites - s.horsForfait));
    return (
      Object.assign(n, {
        titre: t.titre.trim(),
        lignes: i,
        urgente: t.urgente,
        parution: t.parution,
        heure: t.heure || null,
        brief: t.brief.trim(),
        pieces: t.pieces,
        unites: s.unites,
      }),
      n.historique.push({
        date: maintenant(),
        statut: `deposee`,
        par: r.id,
        type: `modification`,
        detail: `Modifiée : ${o}`,
      }),
      sauver(),
      a
    );
  };
var reserverUnites = (e, t) =>
    etat.d.registre.push({
      id: nouvelId(),
      organisationId: e.organisationId,
      periode: periodeAnniversaire(e.organisationId),
      type: `debit`,
      unites: t,
      demandeId: e.id,
      etat: `reserve`,
      date: maintenant(),
    });
var reestimer = (e) => {
    let t = organisation(e.organisationId),
      n = estimer(
        {
          lignes: e.lignes,
          urgente: e.urgente,
          parution: e.parution,
        },
        {
          formule: t.formule,
          depot: aujourdhui(),
          urgencesUtilisees: 0,
          disponibles: 999,
          fermetures: etat.d.fermetures,
        },
      );
    return n.delaiJ === null ? e.parution : ajouterOuvres(aujourdhui(), n.delaiJ, etat.d.fermetures);
  };
var confirmerLocal = (e, t, n) => {
    let r = t.unites ?? e.unites;
    if (t.unites !== void 0 && t.unites !== e.unites && !t.motif?.trim())
      throw Error(`Un ajustement des unités doit être motivé.`);
    let i = unitesPeriode(e.organisationId).disponible,
      a = Math.max(0, r - Math.max(0, i));
    ((e.unites = r),
      (e.unitesHorsForfait = a),
      (e.livraison = t.livraison || reestimer(e)),
      t.motif?.trim() &&
        e.messages.push({
          id: nouvelId(),
          auteurId: n,
          date: maintenant(),
          texte: `Unités ajustées à ${r} : ${t.motif.trim()}`,
          systeme: !0,
        }));
    let o = utilisateur(e.auteurId),
      s = accordNecessaire(
        {
          unites: r,
          horsForfait: a,
        },
        o,
        engageParAuteur(o.id),
      );
    s.requis
      ? (e.messages.push({
          id: nouvelId(),
          auteurId: n,
          date: maintenant(),
          texte: `${s.motif} : l’accord du référent est nécessaire.`,
          systeme: !0,
        }),
        changerStatut(e, `accord_requis`, n === `pilote` ? `Par le pilote automatique` : void 0, n))
      : (reserverUnites(e, r),
        changerStatut(e, `confirmee`, n === `pilote` ? `Par le pilote automatique` : void 0, n),
        preparerJet(e));
  };
var preparerJet = (e) => {
    let t = organisation(e.organisationId);
    etat.d.pilote.atelier &&
      !t.sansIA &&
      atelierConcerne(e) &&
      ((e.brouillon = {
        date: maintenant(),
        fichiers: premierJet(e, t),
        essais: 1,
      }),
      journaliser(`Premier jet préparé : « ${e.titre} »`, {
        demandeId: e.id,
        organisationId: e.organisationId,
      }));
  };
var confirmerDemande = async (e, t = {}) => {
    if (MODE_REEL) {
      let n = await api.confirmer(e, t.unites, t.motif, t.livraison);
      return (
        api.notifier(`statut`, {
          demande: e,
        }),
        await recharger(),
        n
      );
    }
    let n = demande(e);
    if (organisation(n.organisationId).statut !== `active`)
      throw Error(`Les premières unités de ce client ne sont pas encore créditées.`);
    return (confirmerLocal(n, t, etat.moiId), sauver(), n.statut);
  };
var repondreAccord = async (e, t) => {
    if (MODE_REEL) {
      (await api.accord(e, t),
        api.notifier(`statut`, {
          demande: e,
        }),
        await recharger());
      return;
    }
    let n = demande(e);
    if (!actionPermise(t ? `donner_accord` : `refuser`, n.statut, moi().role)) throw Error(`Accord impossible.`);
    (t
      ? (reserverUnites(n, (n.unites ?? 0) - n.unitesHorsForfait),
        (n.livraison ||= reestimer(n) ?? n.parution),
        changerStatut(n, `confirmee`),
        preparerJet(n))
      : changerStatut(n, `annulee`),
      sauver());
  };
var majRegistre = (e, t) => {
    for (let n of etat.d.registre)
      n.type === `debit` &&
        n.demandeId === e.id &&
        (statutConsomme(t) && n.etat === `reserve` && (n.etat = `consomme`),
        t === `annulee` && n.etat === `reserve` && (n.etat = `restitue`));
  };
var agir = async (e, t, n) => {
    if (MODE_REEL) {
      (await api.agir(e, t, n),
        api.notifier(`statut`, {
          demande: e,
        }),
        await recharger());
      return;
    }
    let r = demande(e),
      i = moi();
    if (t === `demander_correction` && r.corrections >= 2)
      throw Error(`Les deux allers-retours inclus sont utilisés : un troisième se chiffre avant d’être lancé.`);
    let a = appliquerTransition(t, r.statut, i.role, r.auteurId === i.id);
    (t === `demander_correction` && r.corrections++,
      majRegistre(r, a),
      n?.trim() &&
        r.messages.push({
          id: nouvelId(),
          auteurId: i.id,
          date: maintenant(),
          texte: n.trim(),
        }),
      changerStatut(r, a),
      sauver());
  };
var livrerVersion = async (e, t, n) => {
    let r = demande(e);
    if (MODE_REEL) {
      let i = [];
      for (let e of t)
        i.push(
          e.fichier
            ? {
                nom: e.nom,
                type: e.type,
                contenu: e.contenu,
                chemin: await api.televerser(r.organisationId, r.id, e.fichier),
              }
            : {
                nom: e.nom,
                type: e.type,
                contenu: e.contenu,
                legende: e.legende,
              },
        );
      (await api.livrerVersion(e, r.organisationId, r.versions.length + 1, i, n),
        api.notifier(`statut`, {
          demande: e,
        }),
        await recharger());
      return;
    }
    let i = appliquerTransition(`livrer_version`, r.statut, moi().role);
    (r.versions.push({
      id: nouvelId(),
      numero: r.versions.length + 1,
      date: maintenant(),
      fichiers: t.map(({ fichier: e, ...t }) =>
        e
          ? {
              ...t,
              src: URL.createObjectURL(e),
            }
          : t,
      ),
      note: n.trim() || void 0,
    }),
      majRegistre(r, i),
      (r.brouillon = null),
      changerStatut(r, i),
      sauver());
  };
var relancerAtelier = async (e, t) => {
    let n = demande(e),
      r = organisation(n.organisationId);
    MODE_REEL
      ? (await api.atelier(e, t), await recharger())
      : ((n.brouillon = {
          date: maintenant(),
          fichiers: premierJet(n, r, t),
          consigne: t,
          essais: (n.brouillon?.essais ?? 0) + 1,
        }),
        sauver());
  };
var majBrouillon = (e, t) => {
    let n = demande(e);
    ((n.brouillon &&= {
      ...n.brouillon,
      fichiers: t,
    }),
      sauver());
  };
var supprimerBrouillon = (e) => {
    let t = demande(e);
    ((t.brouillon = null), sauver());
  };
var ecrireMessage = async (e, t) => {
    let n = demande(e);
    MODE_REEL
      ? (await api.ecrire(e, n.organisationId, moi().id, t.trim()),
        api.notifier(`message`, {
          demande: e,
        }),
        await recharger())
      : (n.messages.push({
          id: nouvelId(),
          auteurId: moi().id,
          date: maintenant(),
          texte: t.trim(),
        }),
        sauver());
  };
var ajusterUnites = async (e, t, n, r) => {
    if (!r.trim()) throw Error(`Indiquez le motif : il apparaît dans le relevé du client.`);
    if (!t) throw Error(`Indiquez un nombre d’unités.`);
    if (MODE_REEL)
      (await api.ajuster(e, t, n, r.trim()),
        t > 0 &&
          api.notifier(`credit`, {
            organisation: e,
          }),
        await recharger());
    else {
      if (t < 0 && unitesPeriode(e).disponible + t < 0) throw Error(`Le retrait dépasse les unités disponibles.`);
      (etat.d.registre.push({
        id: nouvelId(),
        organisationId: e,
        periode: periodeAnniversaire(e),
        type: `ajustement`,
        unites: t,
        source: n,
        motif: r.trim(),
        date: maintenant(),
      }),
        journaliser(`${t > 0 ? `+` : ``}${t} unités pour ${organisation(e).nom} : ${r.trim()}`, {
          organisationId: e,
          auto: !1,
        }),
        sauver());
    }
  };
var commanderUnites = async (e) => {
    let t = moi(),
      n = organisation(t.organisationId);
    if (MODE_REEL) {
      let t = await api.commander(e);
      return n.type === `entreprise` ? (await api.payer(`commande`, t), `paiement`) : (await recharger(), `a_valider`);
    }
    let r = {
      id: nouvelId(),
      organisationId: n.id,
      auteurId: t.id,
      unites: e,
      prixUnitaire: OFFRE.uniteSup,
      total: e * OFFRE.uniteSup,
      statut: n.type === `collectivite` ? `a_valider` : `payee`,
      date: maintenant(),
    };
    return (
      etat.d.commandes.push(r),
      r.statut === `payee` && crediterCommande(r),
      journaliser(`${n.nom} a commandé ${e} unités`, {
        organisationId: n.id,
        auto: !1,
      }),
      sauver(),
      r.statut === `payee` ? `creditee` : `a_valider`
    );
  };
var crediterCommande = (e) =>
    etat.d.registre.push({
      id: nouvelId(),
      organisationId: e.organisationId,
      periode: periodeAnniversaire(e.organisationId),
      type: `ajustement`,
      unites: e.unites,
      source: `commande`,
      motif: `Commande de ${e.unites} unités`,
      commandeId: e.id,
      date: maintenant(),
    });
var validerCommande = async (e) => {
    if (MODE_REEL) {
      (await api.validerCommande(e),
        api.notifier(`credit`, {
          commande: e,
        }),
        await recharger());
      return;
    }
    let t = etat.d.commandes.find((t) => t.id === e);
    t &&
      t.statut === `a_valider` &&
      ((t.statut = `a_facturer`),
      crediterCommande(t),
      journaliser(`Commande validée : ${organisation(t.organisationId).nom}, ${t.unites} unités créditées`, {
        organisationId: t.organisationId,
        auto: !1,
      }),
      sauver());
  };
var ouvrirPiece = async (e) => {
    if (!MODE_REEL) {
      toast(`Démonstration : le fichier n’est pas conservé.`, `info`);
      return;
    }
    let t = window.open(``, `_blank`);
    try {
      let n = await api.lienFichier(e);
      t ? (t.location.href = n) : (location.href = n);
    } catch (e) {
      throw (t?.close(), e);
    }
  };
var membres = (e) => etat.d.utilisateurs.filter((t) => t.organisationId === e);
var inviterMembre = async (e) => {
    let t = moi();
    if (MODE_REEL) {
      let t = await api.inviter(e);
      return (await recharger(), t);
    }
    let n = e.email.trim().toLowerCase();
    if (etat.d.utilisateurs.some((e) => e.email.toLowerCase() === n))
      throw Error(`Cette personne a déjà accès à l’espace`);
    let r = {
      id: `u${nouvelId()}`,
      nom: e.nom.trim(),
      email: n,
      role: e.role,
      organisationId: t.organisationId,
      plafondMensuel: e.role === `contributeur` ? e.plafond : 0,
      visiteVue: !1,
    };
    return (
      etat.d.utilisateurs.push(r),
      journaliser(`${t.nom} a invité ${r.nom}`, {
        organisationId: t.organisationId ?? void 0,
        auto: !1,
      }),
      sauver(),
      {
        id: r.id,
      }
    );
  };
var retirerMembre = async (e) => {
    MODE_REEL
      ? (await api.retirerMembre(e), await recharger())
      : ((etat.d.utilisateurs = etat.d.utilisateurs.filter((t) => t.id !== e)), sauver());
  };
var reglerMembre = async (e, t, n) => {
    if (MODE_REEL) {
      (await api.reglerMembre(e, t, n), await recharger());
      return;
    }
    let r = etat.d.utilisateurs.find((t) => t.id === e);
    (r && ((r.role = t), (r.plafondMensuel = t === `contributeur` ? n : 0)), sauver());
  };
var majAcces = (e, t, n, r) => {
    let i = organisation(e);
    i.acces = [
      ...(i.acces ?? []).filter((e) => e.canal !== t),
      {
        canal: t,
        statut: n,
        note: r?.trim() || void 0,
        maj: maintenant(),
      },
    ];
  };
var declarerAcces = async (e, t, n) => {
    let r = moi();
    MODE_REEL
      ? (await api.declarerAcces(e, t, n?.trim() || void 0),
        t === `donne` &&
          api.notifier(`acces`, {
            organisation: r.organisationId,
            canal: e,
          }),
        await recharger())
      : (majAcces(r.organisationId, e, t, n),
        t === `donne` &&
          journaliser(`${organisation(r.organisationId).nom} a donné l’accès : ${nomCanal(e)}`, {
            organisationId: r.organisationId,
            auto: !1,
          }),
        sauver());
  };
var verifierAcces = async (e, t, n, r) => {
    if (MODE_REEL) {
      (await api.verifierAcces(e, t, n, r?.trim() || void 0),
        n ||
          api.notifier(`acces`, {
            organisation: e,
            canal: t,
          }),
        await recharger());
      return;
    }
    let i = accesCanal(organisation(e).acces, t);
    (majAcces(e, t, n ? `verifie` : `a_donner`, n ? i.note : r), sauver());
  };
var creerCompte = async (e) => {
    if (MODE_REEL) {
      let t = await api.creerCompte(e);
      (api.alerter(t),
        await recharger(),
        (etat.moiId = etat.sessionSansProfil ?? etat.moiId),
        (etat.sessionSansProfil = null),
        visiteSiPremiereConnexion());
      return;
    }
    let t = nouvelId(),
      n = aujourdhui();
    etat.d.organisations.push({
      id: t,
      nom: e.structure.trim(),
      type: e.type,
      formule: e.formule,
      debut: n,
      engagementMois: e.engagement,
      statut: `a_activer`,
      siret: e.siret,
    });
    let r = {
      id: `u${nouvelId()}`,
      nom: e.nom.trim(),
      email: e.email.trim(),
      fonction: e.fonction.trim(),
      telephone: e.telephone?.trim() || void 0,
      role: `referent`,
      organisationId: t,
    };
    (etat.d.utilisateurs.push(r),
      (etat.moiId = r.id),
      journaliser(`Nouveau compte : ${e.structure.trim()}, formule ${formule(e.formule).nom}`, {
        organisationId: t,
        auto: !1,
      }),
      sauver(),
      visiteSiPremiereConnexion());
  };
var activerLocal = (e, t) => {
    let n = organisation(e);
    ((n.statut = `active`),
      (n.debut = aujourdhui()),
      (n.anniversaire = n.anniversaire ?? aujourdhui()),
      etat.d.registre.push({
        id: nouvelId(),
        organisationId: e,
        periode: periodeAnniversaire(e),
        type: `credit`,
        unites: formule(n.formule).unites,
        motif: `Premier quota`,
        date: maintenant(),
      }),
      journaliser(`${n.nom} : ${formule(n.formule).unites} premières unités créditées (${t})`, {
        organisationId: e,
      }));
  };
var activer = async (e) => {
    MODE_REEL
      ? (await api.activer(e),
        api.notifier(`credit`, {
          organisation: e,
        }),
        await recharger())
      : (activerLocal(e, `par Fill`), sauver());
  };
var envoyerBonCommande = async (e) => {
    let t = organisation(moi().organisationId),
      n = e.engagement?.trim() || void 0;
    if (!e.fichier && !n) throw Error(`Joignez le bon signé ou indiquez le numéro d’engagement.`);
    if (MODE_REEL) {
      let r = e.fichier
        ? await api.televerser(t.id, e.commandeId ? `commande-${e.commandeId}` : `bon-de-commande`, e.fichier)
        : null;
      (await api.bonCommande(r, e.commandeId, n), api.alerter(t.id, `bon_commande`, e.commandeId), await recharger());
      return;
    }
    let r = e.fichier?.name;
    if (e.commandeId) {
      let t = etat.d.commandes.find((t) => t.id === e.commandeId);
      t && ((t.bonCommande = r ?? t.bonCommande), (t.numeroEngagement = n ?? t.numeroEngagement));
    } else ((t.bonCommande = r ?? t.bonCommande), (t.numeroEngagement = n ?? t.numeroEngagement));
    (journaliser(`Bon de commande reçu : ${t.nom}${n ? ` (engagement ${n})` : ``}`, {
      organisationId: t.id,
      auto: !1,
    }),
      sauver());
  };
var annulerCommande = async (e) => {
    if (MODE_REEL) {
      (await api.annulerCommande(e), await recharger());
      return;
    }
    let t = etat.d.commandes.find((t) => t.id === e);
    (t && (t.statut === `a_valider` || t.statut === `a_payer`) && (t.statut = `annulee`), sauver());
  };
var cleBrouillonSaisie = (e) => `fill-brouillon-${e}`;
var garderSaisie = (e, t) => {
    try {
      localStorage.setItem(
        cleBrouillonSaisie(e),
        JSON.stringify({
          ...t,
          date: maintenant(),
        }),
      );
    } catch {}
  };
var lireSaisie = (e) => {
    try {
      let t = localStorage.getItem(cleBrouillonSaisie(e));
      return t ? JSON.parse(t) : null;
    } catch {
      return null;
    }
  };
var oublierSaisie = (e) => {
    try {
      localStorage.removeItem(cleBrouillonSaisie(e));
    } catch {}
  };
var payerOuverture = async () => {
    let e = organisation(moi().organisationId);
    return MODE_REEL
      ? (await api.payer(`ouverture`, e.id), !1)
      : (activerLocal(e.id, `premier règlement`), sauver(), !0);
  };
var reglerCapacite = async (e) => {
    MODE_REEL
      ? (await api.capacite(e), await recharger())
      : ((etat.d.capacite = Math.max(1, Math.min(200, Math.round(e)))), sauver());
  };
var reglerPilote = async (e, t) => {
    MODE_REEL
      ? (await api.pilote(e, t), await recharger())
      : ((etat.d.pilote = {
          ...etat.d.pilote,
          [e]: t,
        }),
        journaliser(
          `Pilote : ${
            {
              confirmation: `confirmation automatique`,
              atelier: `premier jet de l’atelier`,
              relances: `relances`,
              activation: `activation`,
              facturation: `facturation`,
            }[e]
          } ${t ? `activée` : `désactivée`}`,
          {
            auto: !1,
          },
        ),
        sauver());
  };
var reglerEssai = async (e, t) => {
    MODE_REEL ? (await api.essai(e, t), await recharger()) : ((organisation(e).essai = t), sauver());
  };
var reglerSansIA = async (e, t) => {
    MODE_REEL ? (await api.sansIA(e, t), await recharger()) : ((organisation(e).sansIA = t), sauver());
  };
var notifications = () => {
    let e = moi();
    if (!e?.organisationId) return [];
    let t = [];
    for (let n of etat.d.demandes.filter((t) => t.organisationId === e.organisationId)) {
      n.historique.forEach((e, r) => {
        if (!(e.par === `pilote` || [`admin`, `producteur`].includes(utilisateur(e.par)?.role ?? ``))) return;
        let i =
          e.type === `relance`
            ? {
                texte: `Rappel : une réponse de votre part est attendue`,
                ton: `cor`,
              }
            : e.statut === `confirmee` && e.type !== `modification`
              ? {
                  texte: n.livraison
                    ? `Confirmée, livraison le ${n.livraison.slice(8, 10)}/${n.livraison.slice(5, 7)}`
                    : `Confirmée par Fill`,
                  ton: `lav`,
                }
              : e.statut === `a_valider`
                ? {
                    texte: `Une version est prête à relire`,
                    ton: `cor`,
                  }
                : e.statut === `attente_client`
                  ? {
                      texte: `Une pièce est attendue pour continuer`,
                      ton: `cor`,
                    }
                  : e.statut === `accord_requis`
                    ? {
                        texte: `Votre accord est demandé`,
                        ton: `cor`,
                      }
                    : e.statut === `livree`
                      ? {
                          texte: LIBELLES_REMISE[modeRemise(n.lignes)].fait,
                          ton: `bon`,
                        }
                      : null;
        i &&
          t.push({
            id: `${n.id}-h${r}`,
            date: e.date,
            demandeId: n.id,
            titre: n.titre,
            ...i,
          });
      });
      for (let r of n.messages) {
        let i = utilisateur(r.auteurId);
        r.systeme ||
          r.auteurId === e.id ||
          (i && ![`admin`, `producteur`].includes(i.role)) ||
          t.push({
            id: `${n.id}-${r.id}`,
            date: r.date,
            demandeId: n.id,
            titre: n.titre,
            texte: `Message de Fill : ${r.texte.length > 70 ? r.texte.slice(0, 68) + `…` : r.texte}`,
            ton: `lav`,
          });
      }
    }
    return t.sort((e, t) => t.date.localeCompare(e.date)).slice(0, 20);
  };
var cleNotificationsVues = () => `fill-notifications-vues-${etat.moiId}`;
var notificationsVues = en({
    depuis: ``,
  });
var ilYaQuinzeJours = () => new Date(Date.now() - 1296e5).toISOString();
var lireNotificationsVues = () => {
    try {
      notificationsVues.depuis = localStorage.getItem(cleNotificationsVues()) ?? ilYaQuinzeJours();
    } catch {
      notificationsVues.depuis = ilYaQuinzeJours();
    }
  };
var marquerNotificationsVues = () => {
    notificationsVues.depuis = new Date().toISOString();
    try {
      localStorage.setItem(cleNotificationsVues(), notificationsVues.depuis);
    } catch {}
  };
var moisPrecedent = () => periodeDe(ajouterJours(`${periodeDe(aujourdhui())}-01`, -1));
var facturesAEmettre = (e = moisPrecedent()) =>
    etat.d.organisations
      .filter(
        (t) =>
          t.statut === `active` &&
          !t.essai &&
          periodeAnniversaire(t, t.anniversaire ?? t.debut) <= e &&
          periodeAnniversaire(t) > e,
      )
      .map((t) => ({
        o: t,
        projet: projetFacture(
          t,
          e,
          etat.d.demandes
            .filter(
              (n) =>
                n.organisationId === t.id &&
                n.unitesHorsForfait > 0 &&
                n.statut !== `annulee` &&
                periodeAnniversaire(t, n.creee.slice(0, 10)) === e,
            )
            .reduce((e, t) => e + t.unitesHorsForfait, 0),
          etat.d.commandes,
        ),
        emise: etat.d.factures.find((n) => n.organisationId === t.id && n.periode === e) ?? null,
      }));
var emettreFactures = async (e = moisPrecedent()) => {
    if (MODE_REEL) return (await api.facturer(e), await recharger(), 0);
    let t = 0;
    for (let { o: n, projet: r, emise: i } of facturesAEmettre(e))
      i ||
        (etat.d.factures.push({
          id: `${n.type === `collectivite` ? `F` : `R`}-${e.replace(`-`, ``)}-${String(etat.d.factures.length + 1).padStart(3, `0`)}`,
          organisationId: n.id,
          periode: e,
          totalHT: r.totalHT,
          statut: n.type === `collectivite` ? `deposee` : `emise`,
          date: maintenant(),
        }),
        t++);
    return (
      t &&
        journaliser(`${t} facture${t > 1 ? `s` : ``} émise${t > 1 ? `s` : ``} pour ${e}`, {
          auto: !1,
        }),
      sauver(),
      t
    );
  };
