// Règles de la relecture par lien (validation sans compte), communes à « relecture » et « notifier ».
// La page publique (espace/relecture/) applique les mêmes contrôles de saisie avant d'envoyer.
export const DUREE_JOURS = 7;
export const JETON = /^[A-Za-z0-9_-]{43}$/;
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const b64url = (octets) => btoa(String.fromCharCode(...octets)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// jeton de 256 bits, tiré au hasard : il n'existe que dans le lien envoyé
export const nouveauJeton = () => b64url(crypto.getRandomValues(new Uint8Array(32)));

// la base ne garde que cette empreinte
export const empreinte = async (jeton) => {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(jeton)));
  return [...new Uint8Array(h)].map((o) => o.toString(16).padStart(2, "0")).join("");
};

// le jeton voyage dans le fragment de l'adresse : il n'est transmis à aucun serveur à l'ouverture de la page
export const lienPage = (site, jeton) => `${String(site).replace(/\/$/, "")}/relecture/#j=${jeton}`;

const propre = (t, max) => String(t ?? "").replace(/\s+/g, " ").trim().slice(0, max);

// saisie d'une invitation à relire : renvoie les valeurs nettoyées ou le motif du refus
export const invitation = (s) => {
  const usage = s?.usage === "delegation" ? "delegation" : s?.usage === "avis" ? "avis" : null;
  const nom = propre(s?.nom, 120);
  const fonction = propre(s?.fonction, 120);
  const email = propre(s?.email, 254).toLowerCase();
  if (!usage) return { erreur: "Choisissez ce que vous attendez de cette personne." };
  if (nom.length < 2) return { erreur: "Indiquez le nom de la personne." };
  if (!EMAIL.test(email)) return { erreur: "Cette adresse e-mail n’est pas valide." };
  return { usage, nom, fonction: fonction || null, email };
};

// réponse donnée depuis la page
export const reponse = (s) => {
  const r = s?.reponse === "accord" ? "accord" : s?.reponse === "correction" ? "correction" : null;
  const remarque = String(s?.remarque ?? "").trim().slice(0, 4000);
  if (!r) return { erreur: "Réponse inconnue." };
  if (r === "correction" && remarque.length < 3) return { erreur: "Indiquez ce qui est à corriger." };
  return { reponse: r, remarque: remarque || null };
};

// qui peut inviter depuis l'Espace : le référent, ou son suppléant pendant sa période
export const peutInviter = (profil, organisationId, aujourdhui) =>
  Boolean(profil?.actif) &&
  profil.organisation_id === organisationId &&
  (profil.role === "referent" || (Boolean(profil.suppleant_jusqu_au) && String(profil.suppleant_jusqu_au) >= aujourdhui));

// textes des e-mails
export const mailInvitation = ({ usage, demandeur, organisation, titre }) => ({
  sujet: usage === "avis" ? `${demandeur} vous demande votre avis : ${titre}` : `${demandeur} vous confie une validation : ${titre}`,
  titre: usage === "avis" ? `${demandeur} vous demande votre avis` : `${demandeur} vous confie une validation`,
  texte: [
    usage === "avis"
      ? `${organisation} prépare « ${titre} ». ${demandeur} souhaite votre avis avant de valider.`
      : `${organisation} prépare « ${titre} ». ${demandeur} vous confie la validation de cette version : votre réponse lance la suite.`,
    "La relecture se fait depuis ce lien, sans compte ni mot de passe : « D’accord » si tout est bon, « À corriger » sinon.",
  ],
  bouton: "Relire la version",
  apres: [
    `Ce lien vous est personnel et reste valable ${DUREE_JOURS} jours.`,
    `Ce message vous est envoyé par Fill, qui réalise la communication de ${organisation}. Pour toute question, répondez à ce message : ${demandeur} le recevra.`,
  ],
});

export const mailRetour = ({ usage, qui, reponse: r, remarque, titre }) => {
  const verdict = r === "accord" ? "d’accord" : "à corriger";
  return usage === "avis"
    ? {
        sujet: `Avis de ${qui} : ${titre}`,
        titre: `${qui} a donné son avis : ${verdict}`,
        texte: [`Sur « ${titre} ».`, remarque ? `<i>${remarque}</i>` : "", "La décision vous revient : vous pouvez valider ou demander des corrections depuis ce lien."].filter(Boolean),
        bouton: "Décider",
      }
    : {
        sujet: `${r === "accord" ? "Validée" : "Corrections demandées"} par ${qui} : ${titre}`,
        titre: r === "accord" ? `${qui} a validé la version` : `${qui} demande des corrections`,
        texte: [`Sur « ${titre} », par délégation.`, remarque ? `<i>${remarque}</i>` : "", r === "accord" ? "Fill prend la suite. Vous n’avez rien à faire." : "Fill reprend la version et vous en remet une nouvelle à relire."].filter(Boolean),
        bouton: null,
      };
};
