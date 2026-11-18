// Carte de signature des mails de Studio ES et de Fill, faite uniquement d'images (outils/signature-mail.py) :
// les messageries en mode sombre (Outlook, Gmail) assombrissent les fonds HTML mais jamais les images, ce qui
// coupait la carte en deux. Cinq morceaux affichés à 500 x 122 : « haut » (nom, métier, filigrane) puis la bande
// du bas, « tel », « site » et « rdv » (chacun un lien) et « coin » (fin du filigrane).
export type Marque = "studio" | "fill";
export const MORCEAUX = ["haut", "tel", "site", "rdv", "coin"] as const;
export type Morceau = typeof MORCEAUX[number];

const LARGEURS: Record<Marque, { tel: number; site: number; rdv: number }> = {
  studio: { tel: 109, site: 74, rdv: 187 },
  fill: { tel: 109, site: 89, rdv: 172 },
};
export const baseImages = (m: Marque) => m === "fill" ? "https://fill.studioes.fr/assets/mail/signature" : "https://studioes.fr/images/signature";
export const urlImage = (m: Marque, p: Morceau) => `${baseImages(m)}-${p}.png`;
export const cidImage = (p: Morceau) => `signature-${p}@studioes.fr`;

// src : adresse de chaque image (URL publique ou « cid:… » quand les images sont jointes au message)
export const carteSignature = (marque: Marque, src: (p: Morceau) => string = (p) => urlImage(marque, p)) => {
  const fill = marque === "fill";
  const L = LARGEURS[marque];
  const site = fill ? ["fill.studioes.fr", "https://fill.studioes.fr/"] : ["studioes.fr", "https://studioes.fr/"];
  const alt = fill ? "Ewen Soupault, Fill, service de communication externalisé" : "Ewen Soupault, Studio ES, photographie, sites et applications";
  const img = (p: Morceau, w: number, h: number, a: string) =>
    `<img src="${src(p)}" width="${w}" height="${h}" alt="${a}" style="display:block;width:${w}px;height:${h}px;border:0;outline:none;font:13px Arial,Helvetica,sans-serif;color:#141414">`;
  const td = 'style="padding:0;line-height:0;font-size:0;vertical-align:top"';
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="500" style="margin:26px 0 0;border-collapse:collapse;width:500px">
<tr><td colspan="4" ${td}>${img("haut", 500, 84, alt)}</td></tr>
<tr><td ${td}><a href="tel:+33651222107" style="text-decoration:none">${img("tel", L.tel, 38, "06 51 22 21 07")}</a></td><td ${td}><a href="${site[1]}" style="text-decoration:none">${img("site", L.site, 38, site[0])}</a></td><td ${td}><a href="https://cal.com/studioes/30min" style="text-decoration:none">${img("rdv", L.rdv, 38, "Prendre rendez-vous")}</a></td><td ${td}>${img("coin", 130, 38, "")}</td></tr></table>`;
};
