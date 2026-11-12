// Module préférences : « Vos e-mails » dans le menu Équipe, pour chaque personne d'une structure cliente.
// Fichier ajouté par-dessus les écrans, sans toucher aux composants.
//
// Un seul réglage : recevoir ou non un e-mail à chaque étape de ses demandes (reçue, confirmée, publiée ou livrée,
// annulée). Les e-mails qui attendent un geste (version à relire, élément attendu, accord, message de Fill) partent
// toujours. En service : colonne profil.mails_etapes, écrite par la fonction regler_mails_etapes de la base et lue
// par la fonction notifier. En démonstration : réglage gardé dans le navigateur.

(() => {
  if (typeof document > `u`) return;
  const ID = `fill-prefs`;
  const CLIENT = [`referent`, `contributeur`, `lecteur`];
  const cleDemo = () => `${CLE_DEMO}-mails-etapes-${etat.moiId}`;
  const garde = {
    lire: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    ecrire: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };
  let valeur = null, pour = null, envoi = !1;

  const lire = async () => {
    if (!MODE_REEL) return garde.lire(cleDemo()) !== `0`;
    try {
      const { data, error } = await clientSupabase.from(`profil`).select(`mails_etapes`).eq(`id`, etat.moiId).maybeSingle();
      return error || !data ? true : data.mails_etapes !== false;
    } catch {
      return true;
    }
  };
  const ecrire = async (v) => {
    if (!MODE_REEL) return (garde.ecrire(cleDemo(), v ? `1` : `0`), true);
    const { error } = await clientSupabase.rpc(`regler_mails_etapes`, { p_actif: v });
    return !error;
  };

  const peindre = (b) => {
    b.setAttribute(`aria-checked`, String(valeur !== false));
    b.disabled = envoi;
  };
  const bloc = () => {
    const s = document.createElement(`section`);
    s.className = `carte pad`;
    s.id = ID;
    s.setAttribute(`aria-labelledby`, `t-mails`);
    s.innerHTML =
      `<h2 class="t3" id="t-mails">Vos e-mails</h2>` +
      `<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-top:10px">` +
      `<p style="margin:0"><b id="l-mails">Un e-mail à chaque étape</b><br><small class="petit mu">Demande reçue, confirmée, publiée ou livrée. Les e-mails qui attendent votre réponse (une version à relire, un élément à fournir, un accord) arrivent toujours.</small></p>` +
      `<button type="button" class="inter" role="switch" aria-labelledby="l-mails" style="flex:none"></button>` +
      `</div>`;
    const b = s.querySelector(`button`);
    b.addEventListener(`click`, async () => {
      if (envoi || valeur === null) return;
      const avant = valeur;
      valeur = !avant;
      envoi = !0;
      peindre(b);
      const ok = await ecrire(valeur).catch(() => false);
      envoi = !1;
      if (!ok) {
        valeur = avant;
        toast(`Réglage non enregistré`, `erreur`, `Réessayez dans un instant.`);
      } else toast(valeur ? `Vous recevrez un e-mail à chaque étape` : `Seuls les e-mails qui attendent votre réponse vous seront envoyés`);
      peindre(b);
    });
    peindre(b);
    return s;
  };

  const placer = () => {
    if (!etat.pret || routeDepuisHash() !== `equipe`) return;
    const m = moi();
    if (!m || !CLIENT.includes(m.role)) return;
    const ecran = document.querySelector(`.feuille .w.entre`);
    if (!ecran || document.getElementById(ID)) return;
    const premiere = ecran.querySelector(`section.carte`);
    if (!premiere) return;
    const s = bloc();
    premiere.after(s);
    if (pour !== etat.moiId) {
      pour = etat.moiId;
      valeur = null;
      lire().then((v) => {
        valeur = v;
        const b = document.querySelector(`#${ID} button`);
        if (b) peindre(b);
      });
    } else peindre(s.querySelector(`button`));
  };

  new MutationObserver(placer).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener(`hashchange`, placer);
})();
