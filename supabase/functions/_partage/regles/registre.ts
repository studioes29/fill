// État des unités d'une organisation sur une période, d'après les lignes du registre.
export const etatPeriode = (lignes, organisationId, periode) => {
  let quota = 0, report = 0, ajustements = 0, reserve = 0, consomme = 0;
  for (const l of lignes) {
    if (l.organisationId !== organisationId || l.periode !== periode) continue;
    if (l.type === "credit") quota += l.unites;
    else if (l.type === "report") report += l.unites;
    else if (l.type === "ajustement") ajustements += l.unites;
    else if (l.type === "debit") {
      if (l.etat === "reserve") reserve += l.unites;
      else if (l.etat === "consomme") consomme += l.unites;
    }
  }
  const total = quota + report + ajustements;
  const engage = reserve + consomme;
  return {
    periode,
    quota,
    report,
    ajustements,
    reserve,
    consomme,
    engage,
    total,
    disponible: total - engage,
    reportRestant: Math.max(0, report - engage)
  };
};
