export const EQUIPE = ["admin", "producteur"];
export const T = {
  confirmer: { de: ["deposee"], vers: "confirmee", roles: ["admin"] },
  demander_accord: { de: ["deposee"], vers: "accord_requis", roles: ["admin"] },
  donner_accord: { de: ["accord_requis"], vers: "confirmee", roles: ["referent"] },
  refuser: { de: ["accord_requis"], vers: "annulee", roles: ["referent"] },
  demarrer: { de: ["confirmee"], vers: "production", roles: EQUIPE },
  livrer_version: { de: ["production", "correction", "confirmee"], vers: "a_valider", roles: EQUIPE },
  valider: { de: ["a_valider"], vers: "validee", roles: ["referent"] },
  demander_correction: { de: ["a_valider"], vers: "correction", roles: ["referent", "contributeur"] },
  livrer: { de: ["validee"], vers: "livree", roles: EQUIPE },
  suspendre: { de: ["confirmee", "production", "correction"], vers: "attente_client", roles: EQUIPE },
  reprendre: { de: ["attente_client"], vers: "production", roles: [...EQUIPE, "referent", "contributeur"] },
  annuler: { de: ["deposee", "accord_requis", "confirmee", "attente_client"], vers: "annulee", roles: ["admin", "referent", "contributeur"] }
};
export const PUBLIEES = ["post", "actu", "agenda", "presse", "news", "page", "video"];
export const SANS_LIVRABLE = ["point", "moder"];
export const issue = (lignes) => {
  const pub = lignes.some((l) => PUBLIEES.includes(l.prestation));
  const fic = lignes.some((l) => !PUBLIEES.includes(l.prestation) && !SANS_LIVRABLE.includes(l.prestation));
  return pub && fic ? "mixte" : pub ? "publication" : "fichiers";
};
