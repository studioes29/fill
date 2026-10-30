// Module regles/facture.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var ligneFacture = (e, t, n) => ({
    libelle: e,
    quantite: t,
    prixUnitaire: n,
    total: Math.round(t * n * 100) / 100,
  });
var premierePeriode = (e) => periodeAnniversaire(e, e.anniversaire ?? e.debut);
var projetFacture = (e, t, n, r = [], i = !0) => {
    let a = formule(e.formule),
      o = [ligneFacture(`Abonnement Fill ${a.nom} (${a.unites} unités)`, 1, a.prix)];
    if (t === premierePeriode(e) && a.mise_en_place > 0) {
      let t = e.engagementMois >= OFFRE.engagementLong;
      o.push(
        ligneFacture(
          t ? `Mise en place (offerte, engagement de ${e.engagementMois} mois)` : `Mise en place`,
          1,
          t ? 0 : a.mise_en_place,
        ),
      );
    }
    n > 0 && o.push(ligneFacture(`Unités hors forfait, accordées par le référent`, n, OFFRE.uniteSup));
    let s = 0;
    for (let n of r.filter(
      (n) =>
        n.organisationId === e.id &&
        periodeAnniversaire(e, n.date.slice(0, 10)) === t &&
        (n.statut === `a_facturer` || n.statut === `payee`),
    ))
      (o.push(
        ligneFacture(
          `Unités supplémentaires commandées le ${n.date.slice(8, 10)}/${n.date.slice(5, 7)}`,
          n.unites,
          n.prixUnitaire,
        ),
      ),
        n.statut === `payee` && (s += n.total));
    let c = o.reduce((e, t) => e + t.total, 0),
      l = [i ? `TVA non applicable, article 293 B du CGI` : `TVA au taux en vigueur`];
    return (
      e.type === `entreprise` &&
        (l.unshift(`Récapitulatif de la période, sans valeur de facture. La facture est émise séparément.`),
        l.push(
          `Abonnement réglé à l’avance chaque mois, à la date anniversaire du premier règlement, par virement automatique ou par carte en ligne`,
          `Pénalités de retard : taux d’intérêt de la BCE majoré de 10 points`,
          `Indemnité forfaitaire pour frais de recouvrement : 40 €`,
        )),
      e.type === `collectivite` &&
        l.push(
          `Retard de paiement : intérêts moratoires prévus par le code de la commande publique`,
          `Facture déposée sur Chorus Pro`,
        ),
      {
        organisationId: e.id,
        periode: t,
        lignes: o,
        totalHT: c,
        dejaRegle: s,
        mentions: l,
        titre: e.type === `entreprise` ? `Récapitulatif de la période` : `Facture`,
        echeanceJours: e.type === `entreprise` ? null : 30,
      }
    );
  };
var MINUTE_MS = 6e4;
var coutEngagement = (e, t) => {
    let n = formule(e.formule),
      r = e.engagementMois >= OFFRE.engagementLong ? 0 : n.mise_en_place;
    return n.prix * t + r;
  };
