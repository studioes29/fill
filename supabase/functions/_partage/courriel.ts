// Gabarit commun des e-mails de Fill. Lisible d'abord : texte en 16 px sur fond blanc, contraste franc, une seule
// colonne de 560 px au plus, des tableaux pour les messageries anciennes. Les repères de la marque : le logo,
// le filet lavande et corail en tête de carte, les pastilles numérotées des étapes.
//
//   titre      titre du message (HTML échappé par l'appelant)
//   aperçu     ligne d'aperçu des messageries (facultatif)
//   texte      paragraphes principaux
//   encart     { titre?, texte } : l'information à garder sous la main (adresse, date, chiffres), sur fond lavande
//   etapes     [{ titre, texte? }] : une liste numérotée, pour ce qu'il y a à faire dans l'ordre
//   bouton     { libelle, lien }
//   apres      paragraphes secondaires, toujours lisibles (15 px, gris foncé)
export const LOGO = "https://fill.studioes.fr/assets/mail/fill.png";
const POLICE = "Arial,Helvetica,sans-serif";
const TITRES = "'Bricolage Grotesque',Arial,Helvetica,sans-serif";
export const P = `margin:0 0 16px;font:400 16px/1.6 ${POLICE};color:#2E2A27`;
const P2 = `margin:0 0 14px;font:400 15px/1.6 ${POLICE};color:#4A4540`;

const encart = (e) => e ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px"><tr><td style="background:#F1ECFF;border-radius:14px;padding:16px 18px">
        ${e.titre ? `<p style="margin:0 0 4px;font:700 13px/1.4 ${POLICE};letter-spacing:.04em;text-transform:uppercase;color:#5B3F9C">${e.titre}</p>` : ""}
        <p style="margin:0;font:400 16px/1.55 ${POLICE};color:#1A1A1A">${e.texte}</p>
      </td></tr></table>` : "";

const etapes = (l) => l?.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px">
        ${l.map((x, i) => `<tr>
          <td width="40" valign="top" style="padding:0 0 18px"><div style="width:30px;height:30px;border-radius:15px;background:${i % 2 ? "#FFE1D8" : "#E6DDFF"};color:#1A1A1A;font:700 15px/30px ${POLICE};text-align:center">${i + 1}</div></td>
          <td valign="top" style="padding:3px 0 18px">
            <p style="margin:0;font:700 16px/1.45 ${POLICE};color:#1A1A1A">${x.titre}</p>
            ${x.texte ? `<p style="margin:4px 0 0;font:400 15px/1.6 ${POLICE};color:#4A4540">${x.texte}</p>` : ""}
          </td></tr>`).join("")}
      </table>` : "";

export const gabarit = (c) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${c.titre}</title>
<style>@font-face{font-family:'Bricolage Grotesque';font-weight:700;src:url(https://fill.studioes.fr/espace/assets/br-Cre6nC2_.woff2) format('woff2')}a{color:#5B3F9C}</style></head>
<body style="margin:0;padding:0;background:#F8F5F2">
<div style="display:none;max-height:0;overflow:hidden;color:#F8F5F2">${c.aperçu ?? c.texte[0] ?? ""}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F2"><tr><td align="center" style="padding:28px 14px 36px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td style="padding:0 6px 20px"><a href="https://fill.studioes.fr"><img src="${LOGO}" width="88" height="46" alt="Fill" style="display:block;border:0"></a></td></tr>
    <tr><td style="background:#FFFFFF;border-radius:22px;overflow:hidden">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="50%" style="height:6px;background:#B8A4FF;font-size:0;line-height:0">&nbsp;</td><td width="50%" style="height:6px;background:#FF8A6B;font-size:0;line-height:0">&nbsp;</td></tr></table>
      <div style="padding:32px 28px 30px">
      <h1 style="margin:0 0 18px;font:700 27px/1.2 ${TITRES};letter-spacing:-.4px;color:#1A1A1A">${c.titre}</h1>
      ${c.texte.map((t) => `<p style="${P}">${t}</p>`).join("\n      ")}
      ${etapes(c.etapes)}
      ${encart(c.encart)}
      ${c.bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 26px"><tr><td style="border-radius:999px;background:#1A1A1A"><a href="${c.bouton.lien}" style="display:inline-block;padding:16px 30px;font:700 16px ${POLICE};color:#F8F5F2;text-decoration:none;border-radius:999px">${c.bouton.libelle}&nbsp;&nbsp;&rarr;</a></td></tr></table>` : ""}
      ${(c.apres ?? []).map((t) => `<p style="${P2}">${t}</p>`).join("\n      ")}
      <p style="margin:24px 0 0;padding-top:18px;border-top:1px solid #EFEAE4;font:400 16px/1.5 ${POLICE};color:#1A1A1A">Ewen Soupault<br><span style="color:#6B6560;font-size:15px">Fill</span></p>
      </div>
    </td></tr>
    <tr><td style="padding:20px 6px 0;font:400 13px/1.6 ${POLICE};color:#7A746D">
      Fill, la communication externalisée des collectivités et des entreprises, est un service de Studio ES.<br>
      <a href="mailto:contact@studioes.fr" style="color:#7A746D">contact@studioes.fr</a> · 06 51 22 21 07 · <a href="https://fill.studioes.fr" style="color:#7A746D">fill.studioes.fr</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
