// Module transfert : la nouvelle demande pré-remplie à partir d'un mail reçu sur l'adresse de transfert.
// Fichier ajouté par-dessus les écrans, sans toucher aux composants ; sans effet en démonstration.
//
// Le mail « À compléter » mène à …/espace/?mail=<identifiant>. Une fois le client connecté, le mail en attente est lu
// (table mail_recu, que la base limite à sa structure) et devient la « demande en cours » de l'écran Nouvelle demande
// (même mécanisme que la saisie gardée : garderSaisie / lireSaisie). Titre, texte, date et supports reconnus sont
// en place ; le client choisit ou vérifie les supports, voit le total d'unités, puis envoie.
// À l'envoi, les pièces jointes du mail rejoignent la demande (fonction mail_rattacher de la base), à condition que
// la demande envoyée soit bien celle du mail : même titre, ou même début de texte.

(() => {
  if (typeof window > `u` || !MODE_REEL) return;
  const CLE = `fill-mail`;
  const IDENTIFIANT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  const garde = {
    lire: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    ecrire: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
  };

  // 1. le lien : l'identifiant quitte l'adresse et attend la connexion (les autres paramètres restent)
  try {
    const q = new URLSearchParams(location.search), id = q.get(`mail`);
    if (id !== null) {
      if (IDENTIFIANT.test(id)) sessionStorage.setItem(CLE, id);
      q.delete(`mail`);
      const reste = q.toString();
      history.replaceState(null, ``, location.pathname + (reste ? `?${reste}` : ``) + location.hash);
    }
  } catch {}

  const debut = (t) => String(t ?? ``).replace(/\s+/g, ` `).trim().slice(0, 60);
  let lecture = !1;

  // 2. une fois le compte chargé : préparer la saisie, puis ouvrir la nouvelle demande
  const ouvrirNouvelle = () => {
    if (routeDepuisHash() !== `nouvelle`) return aller(`nouvelle`);
    aller(``);                                           // l'écran déjà ouvert se recharge avec la saisie préparée
    setTimeout(() => aller(`nouvelle`), 60);
  };
  const preparer = async () => {
    let id = null;
    try { id = sessionStorage.getItem(CLE); } catch {}
    if (!id) return true;
    if (!etat.pret) return false;
    const m = moi();
    if (!m) return false;                               // pas encore connecté : le lien attend
    const oublie = () => { try { sessionStorage.removeItem(CLE); } catch {} };
    if (m.role !== `referent` && m.role !== `contributeur`) return (oublie(), true);
    if (lecture) return false;                          // une lecture est déjà partie
    lecture = !0;
    const perdu = () => (toast(`Ce lien n’est plus valable`, `erreur`, `Le mail n’a pas été retrouvé. Vous pouvez décrire la demande ici.`), ouvrirNouvelle(), true);
    let mail = null, error = null;
    try {
      ({ data: mail, error } = await clientSupabase
        .from(`mail_recu`)
        .select(`id, organisation_id, issue, titre, texte, parution, lignes, demande_id`)
        .eq(`id`, id)
        .maybeSingle());
    } catch {
      return ((lecture = !1), false);                   // réseau coupé : le lien reste en attente, nouvel essai au prochain passage
    }
    oublie();
    if (error || !mail || mail.organisation_id !== m.organisationId) return perdu();
    if (mail.issue === `deposee` && mail.demande_id) return (toast(`Cette demande est déjà envoyée`, `info`), aller(`demande-${mail.demande_id}`), true);
    if (mail.issue !== `a_completer`) return perdu();
    // supports reconnus dans le mail : seulement ceux du catalogue que la formule permet
    const org = organisation(m.organisationId);
    const permise = (min) => !min || ORDRE_FORMULES.indexOf(org?.formule) >= ORDRE_FORMULES.indexOf(min);
    const qte = {};
    for (const l of Array.isArray(mail.lignes) ? mail.lignes : []) {
      const p = prestation(l?.prestation);
      if (p && permise(p.min)) qte[p.id] = 1;
    }
    garderSaisie(m.organisationId, { titre: mail.titre ?? ``, brief: mail.texte ?? ``, parution: mail.parution ?? ``, heure: ``, urgente: !1, qte });
    garde.ecrire(`${CLE}-${m.organisationId}`, JSON.stringify({ id: mail.id, titre: debut(mail.titre), texte: debut(mail.texte) }));
    ouvrirNouvelle();
    return true;
  };
  let essais = 0;
  const tic = setInterval(() => {
    if (++essais > 4500) return clearInterval(tic);      // une demi-heure sans connexion : le lien reste utilisable plus tard
    preparer().then((fini) => fini && clearInterval(tic), () => clearInterval(tic));
  }, 400);

  // 3. à l'envoi : les pièces jointes du mail rejoignent la demande, avant le rechargement de l'écran
  const deposer = api.deposer;
  api.deposer = async (e) => {
    const id = await deposer(e);
    try {
      const cle = `${CLE}-${moi()?.organisationId}`, brut = garde.lire(cle);
      if (brut) {
        garde.ecrire(cle, null);                         // une seule demande peut reprendre le mail
        const mail = JSON.parse(brut);
        // la demande envoyée doit découler du mail : même titre, ou même début de texte
        const liee = (mail.titre && debut(e.titre) === mail.titre) || (mail.texte && debut(e.brief) === mail.texte);
        if (IDENTIFIANT.test(mail.id ?? ``) && liee) {
          const r = await clientSupabase.rpc(`mail_rattacher`, { p_mail: mail.id, p_demande: id });
          if (r.error) toast(`Les pièces jointes du mail n’ont pas rejoint la demande`, `erreur`, `Envoyez-les en réponse au message de Fill.`);
        }
      }
    } catch {}
    return id;
  };
  // « Repartir de zéro » : la saisie n'a plus de lien avec le mail
  const oublier = oublierSaisie;
  oublierSaisie = (org) => {
    garde.ecrire(`${CLE}-${org}`, null);
    oublier(org);
  };
})();
