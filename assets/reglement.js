// Page de retour du lien de paiement personnel (fonction mensualite) : un message par état.
(function () {
  var q = new URLSearchParams(location.search);
  var etat = q.get('etat') || '';
  var p = q.get('p') || '';
  var o = q.get('o') || '';
  var semaine = /^\d{4}-S\d{2}$/.test(p);
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var jour = function (s) { var d = new Date(s + 'T12:00:00Z'); return (d.getUTCDate() === 1 ? '1er' : d.getUTCDate()) + ' ' + MOIS[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); };
  var du = q.get('du') || '', au = q.get('au') || '';
  var bornes = /^\d{4}-\d{2}-\d{2}$/.test(du) && /^\d{4}-\d{2}-\d{2}$/.test(au) ? (semaine ? 'Semaine' : 'Période') + ' du ' + jour(du) + ' au ' + jour(au) + '. ' : '';
  var M = {
    deja: [semaine ? 'Cette semaine est déjà réglée, merci.' : 'Cette période est déjà réglée, merci.', bornes + 'Aucun paiement n’est à faire. Le prochain se règle à votre date anniversaire, avec le lien indiqué sur la facture suivante.'],
    merci: ['Paiement reçu, merci.', bornes + 'Le reçu vous est envoyé par e-mail. Les unités de la période sont créditées dans votre espace dès son premier jour, ou tout de suite si elle est déjà commencée.'],
    annule: ['Paiement interrompu.', 'Rien n’a été prélevé. Vous pouvez reprendre le règlement par carte quand vous le souhaitez.'],
    collectivite: ['Pas de règlement en ligne pour votre structure.', 'Les collectivités règlent sur facture, déposée sur Chorus Pro et payable à 30 jours.'],
    ouverture: ['Premier mois à régler dans l’espace.', 'Le premier mois se règle depuis l’accueil de votre espace Fill. Le jour de ce règlement devient votre date anniversaire : chaque période suivante commence ce jour-là, et ce lien sert à les régler.'],
    rien: ['Aucune mensualité à régler.', 'Ce lien ne correspond à aucun montant dû pour le moment. Pour toute question, écrivez à contact@studioes.fr.'],
    invalide: ['Lien de paiement incomplet.', 'Utilisez le lien indiqué sur votre facture, en entier, ou écrivez à contact@studioes.fr.'],
    erreur: ['Le paiement n’a pas pu s’ouvrir.', 'Réessayez dans quelques minutes. Si le problème continue, écrivez à contact@studioes.fr.']
  };
  var m = M[etat] || M.invalide;
  document.getElementById('rg-t').textContent = m[0];
  document.getElementById('rg-l').textContent = m[1];
  document.title = m[0].replace(/\.$/, '') + ' · Fill';
  if (etat === 'annule' && /^[0-9a-f]{20,64}$/.test(o)) {
    var a = document.createElement('a');
    a.className = 'ca';
    a.href = 'https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/mensualite?o=' + o;
    a.innerHTML = '<b>Reprendre le paiement</b><span>Par carte, sur la page sécurisée de Stripe.</span><span class="go"><svg class="i"><use href="#ar"/></svg></span>';
    var z = document.getElementById('rg-a');
    z.insertBefore(a, z.firstChild);
  }
})();
