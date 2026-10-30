// Module regles/dates.
// Fichier de l'Espace Fill reconstitué depuis le bundle en ligne ; concaténé dans l'ordre de src/ordre.txt.

var aujourdhui = () =>
    new Intl.DateTimeFormat(`fr-CA`, {
      timeZone: `Europe/Paris`,
      year: `numeric`,
      month: `2-digit`,
      day: `2-digit`,
    }).format(new Date());
var MOIS = [
    `janvier`,
    `février`,
    `mars`,
    `avril`,
    `mai`,
    `juin`,
    `juillet`,
    `août`,
    `septembre`,
    `octobre`,
    `novembre`,
    `décembre`,
  ];
var JOURS = [`dimanche`, `lundi`, `mardi`, `mercredi`, `jeudi`, `vendredi`, `samedi`];
var jourLong = (e) => {
    let t = dateUtc(e);
    return `${JOURS[t.getUTCDay()]} ${t.getUTCDate() === 1 ? `1er` : t.getUTCDate()} ${MOIS[t.getUTCMonth()]}`;
  };
var jourMois = (e) => {
    let t = dateUtc(e);
    return `${t.getUTCDate() === 1 ? `1er` : t.getUTCDate()} ${MOIS[t.getUTCMonth()]}`;
  };
var MOIS_COURTS = [`janv.`, `févr.`, `mars`, `avr.`, `mai`, `juin`, `juil.`, `août`, `sept.`, `oct.`, `nov.`, `déc.`];
var jourCourt = (e) => {
    let t = dateUtc(e);
    return `${t.getUTCDate()} ${MOIS_COURTS[t.getUTCMonth()]}`;
  };
var libelleMois = (e) => {
    let [t, n] = e.split(`-`).map(Number);
    return `${MOIS[n - 1]} ${t}`;
  };
