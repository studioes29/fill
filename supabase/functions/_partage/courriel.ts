export const LOGO = "https://fill.studioes.fr/assets/mail/fill.png";
export const P = "margin:0 0 16px;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:#4A4540";
export const gabarit = (c) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${c.titre}</title></head>
<body style="margin:0;padding:0;background:#F8F5F2">
<div style="display:none;max-height:0;overflow:hidden;color:#F8F5F2">${c.aperçu ?? c.texte[0] ?? ""}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F2"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td style="padding:0 8px 22px"><a href="https://fill.studioes.fr"><img src="${LOGO}" width="88" height="46" alt="Fill" style="display:block;border:0"></a></td></tr>
    <tr><td style="background:#FFFFFF;border-radius:22px;padding:40px 36px 34px">
      <div style="width:44px;height:4px;border-radius:2px;background:#B8A4FF;margin:0 0 22px"></div>
      <h1 style="margin:0 0 18px;font:700 26px/1.2 Arial,Helvetica,sans-serif;letter-spacing:-.4px;color:#1A1A1A">${c.titre}</h1>
      ${c.texte.map((t) => `<p style="${P}">${t}</p>`).join("\n      ")}
      ${c.bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 24px"><tr><td style="border-radius:999px;background:#1A1A1A"><a href="${c.bouton.lien}" style="display:inline-block;padding:16px 30px;font:700 16px Arial,Helvetica,sans-serif;color:#F8F5F2;text-decoration:none;border-radius:999px">${c.bouton.libelle}&nbsp;&nbsp;&rarr;</a></td></tr></table>` : ""}
      ${(c.apres ?? []).map((t) => `<p style="${P};font-size:14px;color:#6B6560">${t}</p>`).join("\n      ")}
      <p style="margin:26px 0 0;font:400 16px/1.5 Arial,Helvetica,sans-serif;color:#1A1A1A">Ewen Soupault<br><span style="color:#6B6560">Fill</span></p>
    </td></tr>
    <tr><td style="padding:22px 8px 0;font:400 13px/1.6 Arial,Helvetica,sans-serif;color:#8A847D">
      Fill, la communication externalisée des collectivités et des entreprises, est un service de Studio ES.<br>
      <a href="mailto:contact@studioes.fr" style="color:#8A847D">contact@studioes.fr</a> · 06 51 22 21 07 · <a href="https://fill.studioes.fr" style="color:#8A847D">fill.studioes.fr</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
