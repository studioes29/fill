// Module regles/atelier.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var phrases = (e) =>
    e
      .replace(/\s+/g, ` `)
      .trim()
      .split(/(?<=[.!?])\s+/)
      .map((e) => e.trim())
      .filter(Boolean);
var sansPonctuationFinale = (e) => e.replace(/[.!?]+$/, ``);
var slug = (e) =>
    e
      .toLowerCase()
      .normalize(`NFD`)
      .replace(/[̀-ͯ]/g, ``)
      .replace(/[^a-z0-9]+/g, `-`)
      .replace(/^-|-$/g, ``)
      .slice(0, 48);
var appliquerConsigne = (e, t = ``) => {
    let n = t.toLowerCase(),
      r = e;
    return (
      /court|bref|concis/.test(n) && (r = phrases(r).slice(0, 2).join(` `)),
      /chaleur|convivial/.test(n) && (r = r.replace(/^/, `Bonne nouvelle : `)),
      r
    );
  };
var premierJet = (e, t, n = ``) => {
    let r = phrases(e.brief),
      i = t.nom.replace(/^(Commune|Ville) de /, ``),
      a = r[0] ? appliquerConsigne(r[0], n) : `${e.titre}.`,
      o = r.slice(1),
      s = o.length
        ? o
        : [
            `Toutes les informations pratiques sont disponibles auprès de ${t.type === `collectivite` ? `la mairie` : `notre équipe`}.`,
          ],
      c = t.type === `collectivite` ? `Renseignements en mairie de ${i}.` : `Plus d'informations en boutique.`,
      l = [];
    for (let o of e.lignes) {
      let u = prestation(o.prestation);
      if (u)
        for (let d = 0; d < o.quantite; d++) {
          let f = o.quantite > 1 ? ` ${d + 1}` : ``;
          if (o.prestation === `post`) {
            let t =
              d === 0
                ? `${sansPonctuationFinale(e.titre)}. ${a} ${s[0] ?? ``}`.trim()
                : `Rappel : ${sansPonctuationFinale(e.titre).charAt(0).toLowerCase() + sansPonctuationFinale(e.titre).slice(1)}. ${s.at(-1) ?? a}`;
            l.push({
              nom: `publication${f}-${slug(e.titre)}`,
              type: `post`,
              legende: appliquerConsigne(t, n),
              contenu: {
                corps: [appliquerConsigne(t, n)],
                appel: c,
              },
            });
          } else
            o.prestation === `actu` || o.prestation === `agenda` || o.prestation === `page`
              ? l.push({
                  nom: `${o.prestation === `page` ? `page` : `actualite`}${f}-${slug(e.titre)}`,
                  type: `web`,
                  legende: `${slug(i)}.fr/actualites/${slug(e.titre)}`,
                  contenu: {
                    titre: e.titre,
                    chapo: a,
                    corps: s,
                    appel: c,
                  },
                })
              : o.prestation === `news`
                ? l.push({
                    nom: `newsletter-${slug(e.titre)}`,
                    type: `email`,
                    legende: e.titre,
                    contenu: {
                      titre: e.titre,
                      chapo: a,
                      sections:
                        r.length > 1
                          ? r.slice(1).map((e, t) => ({
                              titre: `À retenir ${t + 1}`,
                              texte: e,
                            }))
                          : [
                              {
                                titre: e.titre,
                                texte: a,
                              },
                            ],
                      appel: c,
                    },
                  })
                : o.prestation === `presse`
                  ? l.push({
                      nom: `communique-${slug(e.titre)}`,
                      type: `pdf`,
                      legende: `Communiqué de presse`,
                      contenu: {
                        titre: `Communiqué : ${e.titre}`,
                        chapo: a,
                        corps: [...s, `Contact presse : ${t.nom}.`],
                      },
                    })
                  : [`affiche`, `gabarit`, `flyer`].includes(o.prestation) &&
                    l.push({
                      nom: `textes-${o.prestation}${f}-${slug(e.titre)}`,
                      type: `affiche`,
                      legende: `Textes à composer · ${u.nom}`,
                      contenu: {
                        titre: e.titre,
                        chapo: sansPonctuationFinale(a),
                        corps: s.slice(0, 3).map(sansPonctuationFinale),
                        appel: c,
                      },
                    });
        }
    }
    return l;
  };
var atelierConcerne = (e) =>
    e.lignes.some((e) =>
      [`post`, `actu`, `agenda`, `page`, `news`, `presse`, `affiche`, `gabarit`, `flyer`].includes(e.prestation),
    );
