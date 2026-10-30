// Module donnees/supabase.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var moduleSupabase = t({
    DEMO_VISITEUR: () => DEMO_VISITEUR,
    MODE_REEL: () => MODE_REEL,
    R: () => api,
    changerMotDePasse: () => changerMotDePasse,
    charger: () => charger,
    deconnecter: () => deconnecter,
    essayerDemo: () => essayerDemo,
    inscrire: () => inscrire,
    motDePasseOublie: () => motDePasseOublie,
    ouvertureEnAttente: () => ouvertureEnAttente,
    quitterDemo: () => quitterDemo,
    sb: () => clientSupabase,
    seConnecter: () => seConnecter,
    sessionUtilisateur: () => sessionUtilisateur,
    surConnexion: () => surConnexion,
    verifierLienEmail: () => verifierLienEmail,
  });
var URL_SUPABASE = `https://nfnbseonwgmtouxsaajd.supabase.co`;
var CLE_PUBLIABLE = `sb_publishable_MxiZLadQLogoTmBYHi0ZJw_mNmcW38Q`;
var demoDemandee = (() => {
    try {
      return (
        new URLSearchParams(location.search).has(`demo`) && sessionStorage.setItem(`fill-demo`, `1`),
        sessionStorage.getItem(`fill-demo`) === `1`
      );
    } catch {
      return !1;
    }
  })();
var MODE_REEL = !!CLE_PUBLIABLE && !demoDemandee;
var DEMO_VISITEUR = demoDemandee;
var quitterDemo = (e = ``) => {
    try {
      (sessionStorage.removeItem(`fill-demo`), localStorage.removeItem(`fill-espace-demo-v3-moi`));
    } catch {}
    location.href = location.pathname + e;
  };
var essayerDemo = () => {
    try {
      sessionStorage.setItem(`fill-demo`, `1`);
    } catch {}
    location.href = location.pathname + `?demo`;
  };
var clientSupabase = MODE_REEL
    ? qf(URL_SUPABASE, CLE_PUBLIABLE, {
        auth: {
          persistSession: !0,
          detectSessionInUrl: !0,
          flowType: `pkce`,
        },
      })
    : null;
var donnees = (e) => {
    if (e.error) throw Error(e.error.message);
    return e.data;
  };
var adresseRetour = () => location.origin + location.pathname;
var messageErreurAuth = (e) =>
    /invalid login|invalid credentials/i.test(e)
      ? `Adresse ou mot de passe incorrect.`
      : /already registered|already exists/i.test(e)
        ? `Un compte existe déjà avec cette adresse. Connectez-vous, ou utilisez « Mot de passe oublié ».`
        : /password.*(short|least|characters)/i.test(e)
          ? `Le mot de passe doit compter 8 caractères au moins.`
          : /email.*not.*confirmed/i.test(e)
            ? `Cette adresse n’est pas encore confirmée.`
            : /rate limit|too many/i.test(e)
              ? `Trop d’essais rapprochés. Patientez une minute.`
              : /invalid.*email|email.*invalid/i.test(e)
                ? `Cette adresse e-mail n’est pas valide.`
                : `Une erreur est survenue. Réessayez dans un instant.`;
var seConnecter = async (e, t) => {
    let n = await clientSupabase.auth.signInWithPassword({
      email: e,
      password: t,
    });
    if (n.error) throw Error(messageErreurAuth(n.error.message));
  };
var inscrire = async (e, t, n) => {
    let r = await clientSupabase.auth.signUp({
      email: e,
      password: t,
      options: {
        emailRedirectTo: adresseRetour(),
        data: {
          ouverture: n,
        },
      },
    });
    if (r.error) throw Error(messageErreurAuth(r.error.message));
    if (r.data.user && !r.data.user.identities?.length) throw Error(messageErreurAuth(`already registered`));
    return !!r.data.session;
  };
var motDePasseOublie = async (e) => {
    let t = await clientSupabase.auth.resetPasswordForEmail(e, {
      redirectTo: adresseRetour(),
    });
    if (t.error) throw Error(messageErreurAuth(t.error.message));
  };
var changerMotDePasse = async (e) => {
    let t = await clientSupabase.auth.updateUser({
      password: e,
    });
    if (t.error) throw Error(messageErreurAuth(t.error.message));
  };
var verifierLienEmail = async () => {
    let e = new URLSearchParams(location.search),
      t = e.get(`token_hash`),
      n = e.get(`type`);
    if (!t || !n) return null;
    if (
      (history.replaceState(null, ``, location.pathname + location.hash),
      (
        await clientSupabase.auth.verifyOtp({
          token_hash: t,
          type: n,
        })
      ).error)
    )
      throw Error(`Ce lien a expiré ou a déjà servi. Demandez-en un nouveau.`);
    return n;
  };
var sessionUtilisateur = async () => (await clientSupabase.auth.getSession()).data.session?.user.id ?? null;
var deconnecter = () => clientSupabase.auth.signOut();
var surConnexion = (e) => clientSupabase.auth.onAuthStateChange((t, n) => e(n?.user.id ?? null, t));
var ouvertureEnAttente = async () => (await clientSupabase.auth.getUser()).data.user?.user_metadata?.ouverture ?? null;
var charger = async () => {
    let [e, t, n, r, i, a, o, s, c, l, u, d] = (
        await Promise.all(
          [
            `organisation`,
            `profil`,
            `demande`,
            `demande_ligne`,
            `piece_jointe`,
            `message`,
            `version_livrable`,
            `historique`,
            `registre`,
            `fermeture`,
            `periode_preelectorale`,
            `commande`,
          ].map((e) => clientSupabase.from(e).select(`*`)),
        )
      ).map((e) => donnees(e)),
      f = await clientSupabase.from(`parametre`).select(`*`).maybeSingle(),
      [p, m, h, g] = await Promise.all([
        clientSupabase.from(`brouillon`).select(`*`),
        clientSupabase
          .from(`journal`)
          .select(`*`)
          .order(`date`, {
            ascending: !1,
          })
          .limit(60),
        clientSupabase.from(`facture`).select(`*`),
        clientSupabase.from(`acces_compte`).select(`*`),
      ]),
      _ = g.error ? [] : (g.data ?? []),
      v = p.data ?? [],
      y = e.map((e) => {
        let t = u.find((t) => t.organisation_id === e.id && t.fin >= new Date().toISOString().slice(0, 10));
        return {
          id: e.id,
          nom: e.nom,
          type: e.type,
          formule: e.formule,
          debut: e.debut,
          engagementMois: e.engagement_mois,
          statut: e.statut === `active` ? `active` : `a_activer`,
          siret: e.siret ?? void 0,
          codeService: e.code_service ?? void 0,
          bonCommande: e.bon_commande ?? void 0,
          numeroEngagement: e.numero_engagement ?? void 0,
          essai: e.essai ?? !1,
          jetonPaiement: e.jeton_paiement ?? void 0,
          relaisSemaine: e.relais_semaine ?? !1,
          anniversaire: e.anniversaire ?? void 0,
          sansIA: e.sans_ia,
          periodePreelectorale: t
            ? {
                debut: t.debut,
                fin: t.fin,
                election: t.election,
              }
            : null,
          acces: _.filter((t) => t.organisation_id === e.id).map((e) => ({
            canal: e.canal,
            statut: e.statut,
            note: e.note ?? void 0,
            maj: e.maj,
          })),
        };
      }),
      b = t
        .filter((e) => e.actif !== !1)
        .map((e) => ({
          id: e.id,
          nom: e.nom,
          email: e.email,
          fonction: e.fonction ?? void 0,
          telephone: e.telephone ?? void 0,
          role: e.role,
          organisationId: e.organisation_id,
          plafondMensuel: e.plafond_mensuel,
          visiteVue: e.visite_vue,
        })),
      x = async (e) => ({
        ...e,
        src: e.chemin
          ? (await clientSupabase.storage.from(`fichiers`).createSignedUrl(e.chemin, 3600)).data?.signedUrl
          : void 0,
      }),
      S = await Promise.all(
        o.map(async (e) => ({
          ...e,
          fichiers: await Promise.all((e.fichiers ?? []).map(x)),
        })),
      );
    return {
      organisations: y,
      utilisateurs: b,
      demandes: n
        .sort((e, t) => t.creee.localeCompare(e.creee))
        .map((e) => ({
          id: e.id,
          numero: e.numero,
          organisationId: e.organisation_id,
          auteurId: e.auteur_id,
          titre: e.titre,
          lignes: r
            .filter((t) => t.demande_id === e.id)
            .map((e) => ({
              prestation: e.prestation,
              quantite: e.quantite,
            })),
          urgente: e.urgente,
          parution: e.parution,
          heure: e.heure ?? null,
          brief: e.brief,
          pieces: i.filter((t) => t.demande_id === e.id).map((e) => e.nom),
          statut: e.statut,
          creee: e.creee,
          unites: e.unites,
          unitesHorsForfait: e.unites_hors_forfait,
          livraison: e.livraison,
          corrections: e.corrections,
          messages: a
            .filter((t) => t.demande_id === e.id)
            .sort((e, t) => e.creee.localeCompare(t.creee))
            .map((e) => ({
              id: e.id,
              auteurId: e.auteur_id,
              date: e.creee,
              texte: e.texte,
              systeme: e.systeme,
            })),
          versions: S.filter((t) => t.demande_id === e.id)
            .sort((e, t) => e.numero - t.numero)
            .map((e) => ({
              id: e.id,
              numero: e.numero,
              date: e.creee,
              note: e.note ?? void 0,
              fichiers: e.fichiers,
            })),
          historique: s
            .filter((t) => t.demande_id === e.id)
            .sort((e, t) => e.id - t.id)
            .map((e) => ({
              date: e.date,
              statut: e.statut,
              par: e.par ?? `pilote`,
              type: e.type,
              detail: e.detail ?? void 0,
            })),
          brouillon: (() => {
            let t = v.find((t) => t.demande_id === e.id);
            return t
              ? {
                  date: t.maj,
                  ...t.contenu,
                }
              : null;
          })(),
        })),
      registre: c.map((e) =>
        e.type === `debit`
          ? {
              id: e.id,
              organisationId: e.organisation_id,
              periode: e.periode,
              type: `debit`,
              unites: e.unites,
              demandeId: e.demande_id,
              etat: e.etat,
              date: e.date,
            }
          : e.type === `ajustement`
            ? {
                id: e.id,
                organisationId: e.organisation_id,
                periode: e.periode,
                type: `ajustement`,
                unites: e.unites,
                motif: e.motif,
                source: e.source,
                commandeId: e.commande_id ?? void 0,
                date: e.date,
              }
            : {
                id: e.id,
                organisationId: e.organisation_id,
                periode: e.periode,
                type: e.type,
                unites: e.unites,
                motif: e.motif ?? void 0,
                date: e.date,
              },
      ),
      commandes: d.map((e) => ({
        id: e.id,
        organisationId: e.organisation_id,
        auteurId: e.auteur_id,
        unites: e.unites,
        prixUnitaire: Number(e.prix_unitaire),
        total: Number(e.total),
        statut: e.statut,
        bonCommande: e.bon_commande ?? void 0,
        numeroEngagement: e.numero_engagement ?? void 0,
        date: e.creee,
      })),
      prochainNumero: 0,
      fermetures: l.map((e) => ({
        debut: e.debut,
        fin: e.fin,
        motif: e.motif,
      })),
      capacite: f.data?.capacite_semaine ?? 30,
      pilote: {
        confirmation: f.data?.pilote_confirmation ?? !0,
        atelier: f.data?.pilote_atelier ?? !0,
        relances: f.data?.pilote_relances ?? !0,
        activation: f.data?.pilote_activation ?? !1,
        facturation: f.data?.pilote_facturation ?? !1,
      },
      journal: (m.data ?? []).map((e) => ({
        id: String(e.id),
        date: e.date,
        texte: texteJournal(e),
        demandeId: e.cible ?? void 0,
        organisationId: e.organisation_id ?? void 0,
        auto: !e.acteur,
      })),
      factures: (h.data ?? []).map((e) => ({
        id: e.id,
        organisationId: e.organisation_id,
        periode: e.periode,
        totalHT: Number(e.total_ht),
        statut: e.statut,
        date: e.date,
      })),
    };
  };
var texteJournal = (e) =>
    ({
      statut: `Demande passée à « ${e.details?.vers ?? ``} »`,
      modification: `Demande modifiée par le client`,
      commande: `Commande de ${e.details?.unites ?? ``} unités`,
      inscription: `Nouveau compte`,
      activation: `Premières unités créditées`,
      bon_commande: `Bon de commande reçu`,
      commande_validee: `Commande validée`,
      invitation: `Collègue invité`,
      membre_retire: `Accès retiré`,
      acces: `Accès aux comptes mis à jour par le client`,
      acces_verifie: `Accès aux comptes vérifié`,
    })[e.action] ?? e.action;
var appelRpc = async (e, t) => donnees(await clientSupabase.rpc(e, t));
var api = {
    deposer: async (e) => {
      let t = {
        p_titre: e.titre,
        p_lignes: e.lignes,
        p_urgente: e.urgente,
        p_parution: e.parution,
        p_brief: e.brief,
      };
      if (!e.heure) return appelRpc(`deposer_demande`, t);
      try {
        return await appelRpc(`deposer_demande`, {
          ...t,
          p_heure: e.heure,
        });
      } catch (n) {
        if (!/function|fonction|schema cache/i.test(n.message)) throw n;
        return await appelRpc(`deposer_demande`, {
          ...t,
          p_brief: `${e.brief}\n\nHeure de publication souhaitée : ${e.heure.replace(`:`, ` h `)}`,
        });
      }
    },
    modifier: async (e, t, n) => {
      let r = {
        p_demande: e,
        p_titre: t.titre,
        p_lignes: t.lignes,
        p_urgente: t.urgente,
        p_parution: t.parution,
        p_brief: t.brief,
        p_detail: n,
      };
      if (!t.heure) return appelRpc(`modifier_demande`, r);
      try {
        return await appelRpc(`modifier_demande`, {
          ...r,
          p_heure: t.heure,
        });
      } catch (e) {
        if (!/function|fonction|schema cache/i.test(e.message)) throw e;
        return appelRpc(`modifier_demande`, {
          ...r,
          p_brief: `${t.brief}\n\nHeure de publication souhaitée : ${t.heure.replace(`:`, ` h `)}`,
        });
      }
    },
    confirmer: (e, t, n, r) =>
      appelRpc(`confirmer_demande`, {
        p_demande: e,
        p_unites: t ?? null,
        p_motif_ajustement: n ?? null,
        p_livraison: r ?? null,
      }),
    accord: (e, t) =>
      appelRpc(`donner_accord`, {
        p_demande: e,
        p_accepte: t,
      }),
    agir: (e, t, n) =>
      appelRpc(`changer_statut`, {
        p_demande: e,
        p_action: t,
        p_texte: n ?? null,
      }),
    ecrire: async (e, t, n, r) =>
      donnees(
        await clientSupabase.from(`message`).insert({
          demande_id: e,
          organisation_id: t,
          auteur_id: n,
          texte: r,
        }),
      ),
    ajuster: (e, t, n, r) =>
      appelRpc(`ajuster_unites`, {
        p_organisation: e,
        p_unites: t,
        p_source: n,
        p_motif: r,
      }),
    commander: (e) =>
      appelRpc(`commander_unites`, {
        p_unites: e,
      }),
    creerCompte: (e) =>
      appelRpc(`creer_compte`, {
        p_structure: e.structure,
        p_type: e.type,
        p_siret: e.siret,
        p_nom: e.nom,
        p_fonction: e.fonction,
        p_formule: e.formule,
        p_engagement: e.engagement,
        p_telephone: e.telephone || null,
      }),
    alerter: (e, t = `inscription`, n) => {
      clientSupabase.functions
        .invoke(`alerte`, {
          body: {
            organisation: e,
            motif: t,
            commande: n,
          },
        })
        .catch(() => null);
    },
    validerCommande: (e) =>
      appelRpc(`valider_commande`, {
        p_commande: e,
      }),
    notifier: (e, t) => {
      clientSupabase.functions
        .invoke(`notifier`, {
          body: {
            evenement: e,
            ...t,
          },
        })
        .catch(() => null);
    },
    inviter: async (e) => {
      let t = await clientSupabase.functions.invoke(`inviter`, {
        body: e,
      });
      if (t.error) {
        let e = `L’invitation n’a pas pu partir. Réessayez dans un instant.`;
        try {
          e = (await t.error.context?.json())?.erreur ?? e;
        } catch {}
        throw Error(e);
      }
      return t.data;
    },
    retirerMembre: (e) =>
      appelRpc(`retirer_membre`, {
        p_profil: e,
      }),
    reglerMembre: (e, t, n) =>
      appelRpc(`regler_membre`, {
        p_profil: e,
        p_role: t,
        p_plafond: n,
      }),
    activer: (e) =>
      appelRpc(`activer_organisation`, {
        p_organisation: e,
      }),
    capacite: async (e) =>
      donnees(
        await clientSupabase
          .from(`parametre`)
          .update({
            capacite_semaine: e,
          })
          .eq(`id`, !0),
      ),
    pilote: async (e, t) =>
      donnees(
        await clientSupabase
          .from(`parametre`)
          .update({
            [`pilote_${e}`]: t,
          })
          .eq(`id`, !0),
      ),
    sansIA: async (e, t) =>
      donnees(
        await clientSupabase
          .from(`organisation`)
          .update({
            sans_ia: t,
          })
          .eq(`id`, e),
      ),
    bonCommande: (e, t, n) =>
      appelRpc(`deposer_bon_commande`, {
        p_chemin: e,
        p_commande: t ?? null,
        p_engagement: n ?? null,
      }),
    annulerCommande: (e) =>
      appelRpc(`annuler_commande`, {
        p_commande: e,
      }),
    declarerAcces: (e, t, n) =>
      appelRpc(`declarer_acces`, {
        p_canal: e,
        p_statut: t,
        p_note: n ?? null,
      }),
    verifierAcces: (e, t, n, r) =>
      appelRpc(`verifier_acces`, {
        p_organisation: e,
        p_canal: t,
        p_ok: n,
        p_note: r ?? null,
      }),
    essai: async (e, t) =>
      donnees(
        await clientSupabase
          .from(`organisation`)
          .update({
            essai: t,
          })
          .eq(`id`, e),
      ),
    marquerVisite: () => appelRpc(`marquer_visite`, {}),
    lienFichier: async (e) => {
      let t = await clientSupabase.storage.from(`fichiers`).createSignedUrl(e, 600);
      if (t.error || !t.data?.signedUrl) throw Error(`Fichier introuvable`);
      return t.data.signedUrl;
    },
    facturer: (e) =>
      appelRpc(`emettre_factures`, {
        per: e,
      }),
    atelier: async (e, t = ``) => {
      if (
        (
          await clientSupabase.functions.invoke(`atelier`, {
            body: {
              demande: e,
              consigne: t,
            },
          })
        ).error
      )
        throw Error(`L’atelier n’a pas pu préparer le texte. Réessayez dans un instant.`);
    },
    payer: async (e, t) => {
      let n = await clientSupabase.functions.invoke(`paiement`, {
        body: {
          objet: e,
          id: t,
        },
      });
      if (n.error || !n.data?.url) throw Error(`Le paiement n’a pas pu s’ouvrir. Réessayez dans un instant.`);
      location.href = n.data.url;
    },
    televerser: async (e, t, n) => {
      let r = `${e}/${t}/${Date.now()}-${n.name.replace(/[^\w.\-]+/g, `_`)}`;
      return (
        donnees(
          await clientSupabase.storage.from(`fichiers`).upload(r, n, {
            upsert: !1,
          }),
        ),
        r
      );
    },
    joindre: async (e, t, n) => {
      let r = await api.televerser(t, e, n);
      donnees(
        await clientSupabase.from(`piece_jointe`).insert({
          demande_id: e,
          organisation_id: t,
          nom: n.name,
          chemin: r,
        }),
      );
    },
    livrerVersion: async (e, t, n, r, i) => (
      donnees(
        await clientSupabase.from(`version_livrable`).insert({
          demande_id: e,
          organisation_id: t,
          numero: n,
          note: i || null,
          fichiers: r,
        }),
      ),
      appelRpc(`changer_statut`, {
        p_demande: e,
        p_action: `livrer_version`,
        p_texte: null,
      })
    ),
  };
