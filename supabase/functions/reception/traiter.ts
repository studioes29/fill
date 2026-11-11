// Traitement d'un mail reçu sur une adresse de transfert. Toutes les dépendances (base, stockage, envoi)
// arrivent par « d » : la même fonction tourne dans le serveur et dans les tests (base embarquée).
//
// Deux temps : la décision s'écrit en base tout de suite (dépôt de la demande, ou mise en attente) ; la suite
// (alerte à Fill, pièces jointes à ranger, réponse au client) est renvoyée dans « suite », que le serveur
// laisse finir après avoir répondu à Brevo.
import {
  LIMITES, analyser, authentification, automatique, cheminPiece, lireMail, mailACompleter, mailPourFill, mailRecu, mailRefus, nomSupport,
} from '../_partage/regles/reception.ts';
import { adresseTransfert } from '../_partage/regles/transfert.ts';

// Refus de la base : une règle métier (« raise exception ») ou une donnée qu'elle n'accepte pas (classes 22 et 23 :
// titre trop court, caractère interdit…). Réessayer n'y changerait rien. Toute autre erreur est une panne.
const refusBase = (e) => e?.code === "P0001" || /^(22|23)/.test(String(e?.code ?? ""));
class Panne extends Error {}
export const estPanne = (e) => e instanceof Panne;

// types servis tels quels par le stockage ; tout le reste se télécharge, sans jamais s'ouvrir dans le navigateur
const TYPES_SURS = /^(image\/(jpeg|png|gif|webp|heic|heif|tiff|bmp)|application\/pdf|video\/[\w.+-]+|audio\/[\w.+-]+|text\/plain|text\/csv)$/;

// télécharge les pièces retenues et les range dans le stockage « fichiers », sous le dossier de l'organisation
const rangerPieces = async (d, organisation, dossier, pieces) => {
  const rangees = [], ecartees = [];
  let rang = 0;
  for (const p of pieces) {
    try {
      const octets = await d.telecharger(p.jeton);
      if (!octets) { ecartees.push({ nom: p.nom, motif: "erreur" }); continue; }
      if (octets.byteLength > LIMITES.octetsPiece) { ecartees.push({ nom: p.nom, motif: "poids" }); continue; }
      const chemin = cheminPiece(organisation, dossier, p.nom, d.maintenant() + rang++);
      if (await d.ranger(chemin, octets, TYPES_SURS.test(p.type) ? p.type : "application/octet-stream")) rangees.push({ nom: p.nom, chemin, taille: octets.byteLength, type: p.type || null });
      else ecartees.push({ nom: p.nom, motif: "erreur" });
    } catch {
      ecartees.push({ nom: p.nom, motif: "erreur" });
    }
  }
  return { rangees, ecartees };
};

export const traiter = async (item, d) => {
  const mail = lireMail(item, d.domaine);
  if (!mail) return { issue: "illisible" };
  const ecart = automatique(mail, { domaine: d.domaine, adressesFill: d.adressesFill });
  const origine = authentification(mail.entetes, mail.de);
  const ouv = await d.rpc("mail_ouvrir", {
    p_message_id: mail.id, p_expediteur: mail.de, p_destinataires: mail.destinataires, p_sujet: mail.sujet || null, p_ecarter: ecart,
  });
  if (ouv.error) {
    if (refusBase(ouv.error)) return { issue: "illisible" };
    throw new Panne(ouv.error.message ?? "mail_ouvrir");
  }
  const r = ouv.data ?? {};
  // le même message est encore en cours (ou resté en plan) : Brevo le représentera, la base le libère après deux minutes
  if (r.cas === "en_cours") throw new Panne("message encore en cours de traitement");
  const e = d.echap;
  const enReponseA = /^<[^<>\s]+@[^<>\s]+>$/.test(mail.id) ? mail.id : null;
  const repondre = async (essai, sujet, t, lien) => {
    const parti = await d.envoyer({
      a: [{ email: mail.de, ...(mail.nom ? { name: mail.nom } : {}) }], essai, enReponseA, sujet,
      titre: t.titre, texte: t.texte, apres: t.apres, bouton: t.bouton && lien ? { libelle: t.bouton, lien } : null,
    }).catch(() => false);
    if (parti) await d.rpc("mail_repondu", { p_mail: r.mail }).catch(() => null);
    return parti;
  };

  if (["doublon", "ecarte", "trop", "equipe"].includes(r.cas)) return { issue: "ignore", motif: r.cas === "ecarte" ? ecart : r.cas };

  if (r.cas !== "ok") {
    // expéditeur non reconnu, lecture seule, autre structure, structure résiliée : rien n'est déposé.
    // Un inconnu ne reçoit de réponse que si rien ne laisse penser que son adresse est imitée.
    const muet = !r.repondre || (r.cas === "inconnu" && ((mail.spam ?? 0) >= 5 || origine === "echec"));
    const propre = r.organisation?.alias ? adresseTransfert(r.organisation.alias, d.domaine) : null;
    const suite = muet ? null : (async () => {
      const brut = mailRefus({ cas: r.cas, expediteur: mail.de, adressePropre: propre });
      await repondre(Boolean(r.organisation?.essai), brut.sujet, mailRefus({ cas: r.cas, expediteur: e(mail.de), adressePropre: propre }), brut.bouton ? `${d.site}/` : null);
    })();
    return { issue: "refuse", motif: r.cas, suite };
  }

  const org = r.organisation;
  const a = analyser(mail, { aujourdhui: d.aujourdhui, authentification: origine, origine: d.origine });
  const supports = a.lignes.map((l) => nomSupport(l.prestation));
  let motif = a.motif, detail = null;

  if (a.decision === "deposer") {
    const dep = await d.rpc("mail_deposer", { p_mail: r.mail, p_titre: a.titre, p_lignes: a.lignes, p_parution: a.parution, p_brief: a.brief });
    if (!dep.error) {
      const demande = dep.data;
      const suite = (async () => {
        // Fill d'abord : même alerte que pour un dépôt fait dans l'Espace
        await d.notifier({ evenement: "depot", demande }).catch(() => null);
        let { rangees, ecartees } = await rangerPieces(d, org.id, demande, a.pieces);
        let toutes = [...a.piecesEcartees, ...ecartees];
        if (rangees.length || toutes.length) {
          const pj = await d.rpc("mail_pieces", { p_mail: r.mail, p_pieces: [...rangees, ...toutes] }).catch(() => ({ error: true }));
          if (pj?.error) { toutes = [...toutes, ...rangees.map((p) => ({ nom: p.nom, motif: "erreur" }))]; rangees = []; }
        }
        const unites = (await d.unites(demande).catch(() => null)) ?? a.lignes.length;
        const c = { unites, supports, parution: a.parution, pieces: rangees.length, adresseInconnue: r.alias_inconnu ? adresseTransfert(org.alias, d.domaine) : null };
        const brut = mailRecu({ ...c, titre: a.titre, ecartees: toutes });
        await repondre(org.essai, brut.sujet, mailRecu({ ...c, titre: e(a.titre), ecartees: toutes.map((p) => ({ ...p, nom: e(p.nom) })) }), `${d.site}/#demande-${demande}`);
      })();
      return { issue: "deposee", demande, suite };
    }
    // la base refuse : unités insuffisantes, prestation fermée à la formule… La demande reste à terminer dans l'Espace.
    if (!refusBase(dep.error)) throw new Panne(dep.error.message ?? "mail_deposer");
    const m = String(dep.error.message ?? "");
    motif = /^Unit\u00e9s insuffisantes/.test(m) ? "sans_unites" : "depot_impossible";
    detail = motif === "sans_unites" ? (m.match(/cette demande compte [^.]+/) ?? [null])[0] : null;
  }

  // rien n'est déposé : le client termine depuis le lien pré-rempli (ou renvoie l'information s'il n'y en a pas)
  const vide = motif === "contenu_insuffisant";
  let cl = await d.rpc("mail_classer", {
    p_mail: r.mail, p_issue: vide ? "refuse" : "a_completer", p_motif: motif,
    p_titre: a.titre, p_texte: a.brief, p_parution: a.parution, p_lignes: a.lignes,
  });
  // contenu que la base n'accepte pas tel quel : le mail est tout de même classé, sans son texte
  if (cl.error && cl.error.code !== "P0001" && refusBase(cl.error)) {
    cl = await d.rpc("mail_classer", { p_mail: r.mail, p_issue: "refuse", p_motif: "depot_impossible", p_titre: null, p_texte: null, p_parution: null, p_lignes: [] });
    if (!cl.error) return { issue: "refuse", motif: "depot_impossible", suite: null };
  }
  if (cl.error && !refusBase(cl.error)) throw new Panne(cl.error.message ?? "mail_classer");
  if (cl.error) return { issue: "ignore", motif: "deja_traite" };
  const suite = (async () => {
    // les pièces d'un mail dont le contrôle d'origine a échoué ne sont pas conservées
    const sansPieces = vide || motif === "origine_en_echec";
    let { rangees, ecartees } = sansPieces ? { rangees: [], ecartees: [] } : await rangerPieces(d, org.id, `mail/${r.mail}`, a.pieces);
    let toutes = sansPieces ? [] : [...a.piecesEcartees, ...ecartees];
    if (rangees.length || toutes.length) {
      const pj = await d.rpc("mail_pieces", { p_mail: r.mail, p_pieces: [...rangees, ...toutes] }).catch(() => ({ error: true }));
      if (pj?.error) { toutes = [...toutes, ...rangees.map((p) => ({ nom: p.nom, motif: "erreur" }))]; rangees = []; }
    }
    const c = { motif, supports, pieces: rangees.length, detail };
    const brut = mailACompleter({ ...c, titre: a.titre, ecartees: toutes });
    await repondre(org.essai, brut.sujet, mailACompleter({ ...c, titre: e(a.titre ?? ""), detail: detail ? e(detail) : null, ecartees: toutes.map((p) => ({ ...p, nom: e(p.nom) })) }),
      vide ? `${d.site}/#nouvelle` : `${d.site}/?mail=${r.mail}`);
    // Fill voit passer tout mail d'un membre qui n'est pas devenu une demande (question, retrait, correction…)
    const extrait = a.brief.replace(/\s+/g, " ").trim().slice(0, 400);
    const pf = { motif, organisation: org.nom, expediteur: r.profil?.nom ?? mail.de, pieces: rangees.length };
    await d.alerter({
      essai: org.essai, repondreA: { email: mail.de, name: r.profil?.nom ?? mail.nom ?? mail.de },
      ...mailPourFill({ ...pf, organisation: e(org.nom), expediteur: e(pf.expediteur), titre: e(a.titre ?? ""), extrait: e(extrait) }),
      sujet: mailPourFill({ ...pf, titre: a.titre }).sujet,
    }).catch(() => null);
  })();
  return { issue: vide ? "refuse" : "a_completer", motif, suite };
};
