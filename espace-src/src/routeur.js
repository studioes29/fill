// Module routeur.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var routeDepuisHash = () => (typeof location > `u` ? `` : decodeURIComponent(location.hash.replace(/^#/, ``)));
var route = en({
    nom: routeDepuisHash(),
  });
typeof window < `u` &&
  window.addEventListener(`hashchange`, () => {
    ((route.nom = routeDepuisHash()),
      window.scrollTo({
        top: 0,
        behavior: `instant`,
      }));
  });
var aller = (e) => {
    routeDepuisHash() === e ? (route.nom = e) : (location.hash = e);
  };
var lienRoute = (e) => `#${e}`;
