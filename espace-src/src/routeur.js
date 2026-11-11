// Module routeur.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var routeDepuisHash = () => (typeof location > `u` ? `` : decodeURIComponent(location.hash.replace(/^#/, ``)));
// Lien « Lancer » d'une suggestion (mail mensuel, page de bilan) :
//   #nouvelle?titre=…&parution=AAAA-MM-JJ&qte=post:1,actu:2
// Les valeurs sont contrôlées (titre borné, date valide, prestations du catalogue, quantités bornées), posées dans
// etat.prerempli comme le fait le bloc « À anticiper », puis l'adresse redevient #nouvelle. Sans session, le
// pré-remplissage attend la connexion. Rien n'est engagé : la demande reste à relire et à envoyer.
var lireSuggestion = () => {
  if (typeof location > `u` || !/^#nouvelle\?/.test(location.hash)) return;
  let p = new URLSearchParams(location.hash.slice(10)),
    titre = (p.get(`titre`) ?? ``).replace(/\s+/g, ` `).trim().slice(0, 140),
    parution = p.get(`parution`) ?? ``,
    qte = {};
  for (let x of (p.get(`qte`) ?? ``).split(`,`)) {
    let [id, n] = x.split(`:`),
      pr = prestation(id),
      q = Math.round(+n);
    pr && q >= 1 && (qte[id] = Math.min(pr.max ?? 99, q));
  }
  try {
    history.replaceState(null, ``, location.pathname + location.search + `#nouvelle`);
  } catch {
    location.hash = `nouvelle`;
  }
  if (titre.length < 3 || !Object.keys(qte).length) return;
  etat.prerempli = {
    titre,
    parution: /^\d{4}-\d{2}-\d{2}$/.test(parution) && !isNaN(Date.parse(parution)) ? parution : ``,
    qte,
  };
};
lireSuggestion();
var route = en({
    nom: routeDepuisHash(),
  });
typeof window < `u` &&
  window.addEventListener(`hashchange`, () => {
    (lireSuggestion(),
      (route.nom = routeDepuisHash()),
      window.scrollTo({
        top: 0,
        behavior: `instant`,
      }));
  });
var aller = (e) => {
    routeDepuisHash() === e ? (route.nom = e) : (location.hash = e);
  };
var lienRoute = (e) => `#${e}`;
