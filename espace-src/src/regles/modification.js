// Module regles/modification.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var resumeLignes = (e) =>
    e
      .map((e) => {
        let t = prestation(e.prestation);
        return t ? (e.quantite > 1 ? `${e.quantite} × ${t.nom.charAt(0).toLowerCase()}${t.nom.slice(1)}` : t.nom) : ``;
      })
      .filter(Boolean)
      .join(` · `);
var changements = (e, t) => {
    let n = [];
    return (
      e.titre.trim() !== t.titre.trim() && n.push(`titre`),
      resumeLignes(normaliserLignes(e.lignes)) !== resumeLignes(normaliserLignes(t.lignes)) && n.push(`prestations`),
      e.urgente !== t.urgente && n.push(t.urgente ? `passée en urgente` : `urgence retirée`),
      (e.parution ?? ``) !== (t.parution ?? ``) && n.push(`date de parution`),
      (e.heure ?? ``) !== (t.heure ?? ``) && n.push(`heure de publication`),
      e.brief.trim() !== t.brief.trim() && n.push(`brief`),
      e.pieces.join(`|`) !== t.pieces.join(`|`) && n.push(`pièces jointes`),
      n
    );
  };
