// Composant bon-de-commande (Svelte 5 compilé : gabarits puis fonction du composant).
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var t_ = new URL(`br-Cre6nC2_.woff2`, import.meta.url).href;
var n_ = new URL(`it-DX-nOvPD.woff2`, import.meta.url).href;
var r_ = new URL(`ur-i-BOChW9eM.woff2`, import.meta.url).href;
var LOGO_SVG = `<svg viewBox="0 0 1376 720" width="96" height="50" role="img" aria-label="Fill"><g fill="#1A1A1A"><path d="M100 700V262C100 158 168 90 274 90H300V214H282C246 214 224 236 224 274V700Z"/><rect x="18" y="330" width="282" height="104" rx="8"/><rect x="360" y="330" width="124" height="370" rx="8"/><circle cx="422" cy="178" r="72"/></g><g fill="none" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"><path stroke="#B8A4FF" d="M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600"/><path stroke="#FF8A6B" d="M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575"/></g></svg>`;
var urlAbsolue = (e) => new URL(e, document.baseURI).href;
var EMETTEUR = {
    nom: `Studio ES (Fill)`,
    responsable: `Ewen Soupault, entrepreneur individuel`,
    siret: `834 922 486 00016`,
    tva: `TVA non applicable, article 293 B du CGI`,
    email: `contact@studioes.fr`,
    telephone: `06 51 22 21 07`,
    site: `fill.studioes.fr`,
  };
var dateLongue = (e) =>
    new Date(e + `T12:00:00`).toLocaleDateString(`fr-FR`, {
      day: `numeric`,
      month: `long`,
      year: `numeric`,
    });
var echapperHtml = (e) =>
    e.replace(
      /[&<>"]/g,
      (e) =>
        ({
          "&": `&amp;`,
          "<": `&lt;`,
          ">": `&gt;`,
          '"': `&quot;`,
        })[e],
    );
var codeCourt = (e) =>
    e
      .replace(/[^a-z0-9]/gi, ``)
      .slice(0, 6)
      .toUpperCase();
var bonOuverture = (e, t) => {
    let n = formule(e.formule),
      r = lg(e.formule, e.engagementMois),
      i = [
        {
          libelle: `Abonnement Fill, formule ${n.nom}`,
          detail: `${n.unites} unités par mois, engagement de ${e.engagementMois} mois`,
          quantite: e.engagementMois,
          unitaire: n.prix,
        },
      ];
    return (
      n.mise_en_place > 0 &&
        i.push({
          libelle: `Mise en place`,
          detail: r.miseEnPlaceOfferte
            ? `offerte pour un engagement de ${OFFRE.engagementLong} mois`
            : `facturée avec le premier mois`,
          quantite: 1,
          unitaire: r.miseEnPlace,
        }),
      {
        numero: `BC-${t.replace(/-/g, ``)}-${codeCourt(e.id)}`,
        date: t,
        reference: `ouverture:${e.id}`,
        objet: `Abonnement au service de communication externalisée Fill, formule ${n.nom}`,
        lignes: i,
        modalites: [
          `Facturation mensuelle à terme échu, déposée sur Chorus Pro ; paiement à 30 jours par mandat administratif.`,
          `Les ${n.unites} unités de la première période sont créditées dans l’espace dès la validation de ce bon ; les suivantes chaque mois à la même date, le jour de cette validation fixant l’échéance.`,
          `Unités non utilisées reportées une fois sur la période suivante. Unité supplémentaire : ${euros(OFFRE.uniteSup)}, sur commande.`,
        ],
      }
    );
  };
var bonCommande = (e, t) => ({
    numero: `BC-${t.date.slice(0, 10).replace(/-/g, ``)}-${codeCourt(t.id)}`,
    date: t.date.slice(0, 10),
    reference: `commande:${t.id}`,
    objet: `Unités supplémentaires du service Fill (${t.unites} unités)`,
    lignes: [
      {
        libelle: `Unités supplémentaires Fill`,
        detail: `créditées dans l’espace dès la validation de ce bon, utilisables comme les unités de la période`,
        quantite: t.unites,
        unitaire: t.prixUnitaire,
      },
    ],
    modalites: [
      `Facturées avec la période en cours, déposées sur Chorus Pro ; paiement à 30 jours par mandat administratif.`,
    ],
  });
var totalBon = (e) => e.lignes.reduce((e, t) => e + t.quantite * t.unitaire, 0);
var htmlBon = (e, t, n) => {
    let r = totalBon(e),
      i = e.lignes
        .map(
          (e) =>
            `<tr><td><b>${echapperHtml(e.libelle)}</b>${e.detail ? `<small>${echapperHtml(e.detail)}</small>` : ``}</td><td class="n">${e.quantite}</td><td class="n">${euros(e.unitaire)}</td><td class="n">${euros(e.quantite * e.unitaire)}</td></tr>`,
        )
        .join(``);
    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e.numero} · ${echapperHtml(t.nom)}</title>
<style>
@font-face{font-family:"Bricolage Grotesque";font-weight:200 800;src:url(${urlAbsolue(t_)}) format("woff2")}
@font-face{font-family:"Inter Tight";font-weight:100 900;src:url(${urlAbsolue(n_)}) format("woff2")}
@font-face{font-family:"Urbanist";font-style:italic;font-weight:100 900;src:url(${urlAbsolue(r_)}) format("woff2")}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#EDE7DF;font:14px/1.5 "Inter Tight",Arial,sans-serif;color:#1A1A1A}
.page{position:relative;max-width:820px;margin:28px auto;background:#F8F5F2;border-radius:24px;overflow:hidden}
.haut{position:relative;padding:40px 48px 34px;background:#E9E1FF;overflow:hidden}
.haut .ll{position:absolute;z-index:0;right:-34px;top:-26px;width:330px;height:auto;pointer-events:none}
.haut>*{position:relative;z-index:1}
.ligne1{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}
.ligne1 .ref{text-align:right;font:italic 400 15px/1.4 Urbanist,Arial,sans-serif;color:#5B3F9C}
h1{margin:26px 0 0;font:650 46px/1 "Bricolage Grotesque",Arial,sans-serif;letter-spacing:-.03em}
h1 i{font:italic 300 46px/1 Urbanist,Arial,sans-serif;letter-spacing:-.02em}
.objet{margin:12px 0 0;max-width:34em;font-size:15.5px;color:rgba(26,26,26,.78)}
.corps{padding:30px 48px 40px;display:grid;gap:26px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.bloc{background:#fff;border-radius:16px;padding:16px 18px}
.k{display:block;margin-bottom:6px;font:italic 400 13px Urbanist,Arial,sans-serif;color:#5B3F9C}
.bloc b{font:650 17px/1.2 "Bricolage Grotesque",Arial,sans-serif}
small{display:block;color:rgba(26,26,26,.66);font-size:12.5px;line-height:1.5}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden}
th{font:600 11px "Inter Tight",Arial,sans-serif;text-transform:uppercase;letter-spacing:.07em;color:rgba(26,26,26,.6);text-align:left;padding:14px 16px;border-bottom:1px solid rgba(26,26,26,.1)}
td{padding:14px 16px;border-bottom:1px solid rgba(26,26,26,.07);vertical-align:top}
td b{font-weight:600}.n{text-align:right;white-space:nowrap}
.total{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 22px;border-radius:16px;background:#1A1A1A;color:#F8F5F2}
.total span{font:italic 400 14px Urbanist,Arial,sans-serif;color:rgba(248,245,242,.78)}
.total b{font:650 30px/1 "Bricolage Grotesque",Arial,sans-serif;letter-spacing:-.02em}
.mod h2{margin:0 0 8px;font:650 19px "Bricolage Grotesque",Arial,sans-serif}
.mod ul{margin:0;padding-left:18px;color:rgba(26,26,26,.8)}
.mod li{margin:3px 0}
.champs{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.champ{min-height:64px;padding:12px 14px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px rgba(26,26,26,.16)}
.champ .k{margin:0}.sig{grid-column:1/-1;min-height:130px}
.pied{padding:18px 48px 26px;border-top:1px solid rgba(26,26,26,.1);font-size:12px;color:rgba(26,26,26,.6)}
.imp{position:sticky;top:0;z-index:5;display:flex;justify-content:center;padding:12px;background:#1A1A1A}
.imp button{font:600 15px "Inter Tight",Arial,sans-serif;padding:12px 24px;border-radius:999px;border:0;background:#B8A4FF;color:#1A1A1A;cursor:pointer}
@media (max-width:640px){.page{margin:0;border-radius:0}.haut,.corps{padding-inline:20px}.pied{padding-inline:20px}.parties,.champs{grid-template-columns:1fr}h1,h1 i{font-size:36px}th:nth-child(3),td:nth-child(3){display:none}}
@page{size:A4;margin:10mm}
@media print{body{background:#fff;font-size:12.5px}.page{margin:0;max-width:none;border-radius:0}.imp{display:none}.haut{padding:22px 28px 18px}h1,h1 i{font-size:34px}h1{margin-top:14px}.corps{padding:16px 28px 18px;gap:13px}td,th{padding:9px 14px}.champ{min-height:52px}.sig{min-height:92px}.total{padding:12px 18px}.total b{font-size:24px}.pied{padding:10px 28px}}
@media print{.haut .ll{width:230px;right:-22px;top:-20px}}
</style></head><body>
<div class="imp"><button type="button">Imprimer ou enregistrer en PDF</button></div>
<div class="page">
<header class="haut">
<svg class="ll" viewBox="520 40 840 680" aria-hidden="true"><g fill="none" stroke="#D3C5FF" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"><path d="M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600"/><path d="M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575"/></g></svg>
<div class="ligne1">${LOGO_SVG}<div class="ref">N° ${e.numero}<br>${dateLongue(e.date)}</div></div>
<h1>Bon de <i>commande</i></h1>
<p class="objet">${echapperHtml(e.objet)}</p>
</header>
<div class="corps">
<div class="parties">
<div class="bloc"><span class="k">Acheteur</span><b>${echapperHtml(t.nom)}</b>${t.siret ? `<small>SIRET ${echapperHtml(t.siret)}</small>` : ``}${t.codeService ? `<small>Code service Chorus Pro : ${echapperHtml(t.codeService)}</small>` : ``}${n ? `<small>Suivi par ${echapperHtml(n.nom)}${n.fonction ? `, ${echapperHtml(n.fonction)}` : ``}<br>${echapperHtml(n.email)}</small>` : ``}</div>
<div class="bloc"><span class="k">Fournisseur</span><b>${EMETTEUR.nom}</b><small>${EMETTEUR.responsable}<br>SIRET ${EMETTEUR.siret}<br>${EMETTEUR.email} · ${EMETTEUR.telephone}</small></div>
</div>
<table><thead><tr><th>Désignation</th><th class="n">Qté</th><th class="n">Prix unitaire</th><th class="n">Total</th></tr></thead><tbody>${i}</tbody></table>
<div class="total"><span>Total · ${EMETTEUR.tva} : net à payer</span><b>${euros(r)}</b></div>
<div class="mod"><h2>Modalités</h2><ul>${e.modalites.map((e) => `<li>${echapperHtml(e)}</li>`).join(``)}</ul></div>
<div class="champs">
<div class="champ"><span class="k">N° d’engagement</span></div>
<div class="champ"><span class="k">Code service Chorus Pro</span>${t.codeService ? `<div>${echapperHtml(t.codeService)}</div>` : ``}</div>
<div class="champ sig"><span class="k">Bon pour accord : nom, qualité, date, signature et cachet</span></div>
</div>
</div>
<footer class="pied">Référence à conserver : ${e.reference}. Une fois signé, déposez ce bon dans votre espace Fill (Accueil ou Unités), ou indiquez-y simplement le numéro d’engagement. Fill, service de communication externalisée de ${EMETTEUR.nom.replace(` (Fill)`, ``)} · ${EMETTEUR.site}</footer>
</div></body></html>`;
  };
var ouvrirHtml = (e) => {
    let t = URL.createObjectURL(
        new Blob([e], {
          type: `text/html;charset=utf-8`,
        }),
      ),
      n = window.open(t, `_blank`);
    if (!n) {
      location.href = t;
      return;
    }
    let r = () => {
      let e = n.document.querySelector(`.imp button`);
      e && (e.onclick = () => n.print());
    };
    (n.addEventListener(`load`, r), setTimeout(r, 800), setTimeout(() => URL.revokeObjectURL(t), 6e4));
  };
