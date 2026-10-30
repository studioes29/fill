// Écran administrateur « Règlements » de l'Espace Fill.
// Utilise la session Supabase de l'Espace (même origine, même stockage) et les RPC réservées à l'administrateur :
// mensualite_virement (mensualité reçue par virement) et commande_virement (commande d'unités réglée par virement).
(function () {
  'use strict';
  var SB = 'https://nfnbseonwgmtouxsaajd.supabase.co';
  var CLE = 'sb_publishable_MxiZLadQLogoTmBYHi0ZJw_mNmcW38Q';
  var STOCK = 'sb-nfnbseonwgmtouxsaajd-auth-token';
  var LIEN = SB + '/functions/v1/mensualite?o=';
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var $ = function (id) { return document.getElementById(id); };

  var etat = function (t, lien) {
    var p = $('rv-etat');
    p.hidden = !t;
    p.textContent = t || '';
    if (lien) { var a = document.createElement('a'); a.className = 'lien'; a.href = lien[1]; a.textContent = lien[0]; p.append(' ', a); }
  };
  var toast = function (t) {
    var z = $('rv-toast'); z.textContent = t; z.classList.add('v');
    clearTimeout(toast.m); toast.m = setTimeout(function () { z.classList.remove('v'); }, 3200);
  };
  var session = function () {
    try {
      var s = JSON.parse(localStorage.getItem(STOCK) || 'null');
      if (s && s.currentSession) s = s.currentSession;
      return s && s.access_token ? s : null;
    } catch (e) { return null; }
  };
  var expiree = function (s) { return !s || (s.expires_at && s.expires_at * 1000 < Date.now() + 30000); };

  var api = function (chemin, options) {
    var s = session();
    if (expiree(s)) return Promise.reject(new Error('session'));
    options = options || {};
    var h = { apikey: CLE, Authorization: 'Bearer ' + s.access_token, Accept: 'application/json' };
    if (options.corps) h['Content-Type'] = 'application/json';
    return fetch(SB + chemin, { method: options.corps ? 'POST' : 'GET', headers: h, body: options.corps ? JSON.stringify(options.corps) : undefined })
      .then(function (r) {
        return r.text().then(function (t) {
          var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = t; }
          if (!r.ok) throw new Error((d && (d.message || d.error_description || d.msg)) || ('Erreur ' + r.status));
          return d;
        });
      });
  };
  var rpc = function (nom, args) { return api('/rest/v1/rpc/' + nom, { corps: args }); };

  var deux = function (n) { return (n < 10 ? '0' : '') + n; };
  var mois = function (d) { return d.getFullYear() + '-' + deux(d.getMonth() + 1); };
  var semaineIso = function (d) {
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var j = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - j + 3);
    var an = t.getUTCFullYear(), p = new Date(Date.UTC(an, 0, 4));
    var n = 1 + Math.round(((t - p) / 864e5 - 3 + ((p.getUTCDay() + 6) % 7)) / 7);
    return an + '-S' + deux(n);
  };
  // Périodes à la date anniversaire de chaque organisation (jour du premier paiement) : du jour J au jour J - 1
  // du mois suivant, ramené au dernier jour des mois courts ; Relais : 7 jours à partir du jour du paiement.
  // Libellés techniques inchangés : « AAAA-MM » (mois où la période commence), « IIII-Sss » (semaine ISO de son début).
  var iso = function (d) { return d.getUTCFullYear() + '-' + deux(d.getUTCMonth() + 1) + '-' + deux(d.getUTCDate()); };
  var jourUTC = function (s) { return new Date(s + 'T12:00:00Z'); };
  var plus = function (s, n) { var d = jourUTC(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
  var dernier = function (an, mo) { return new Date(Date.UTC(an, mo, 0)).getUTCDate(); };
  var ancre = function (o) { return o && o.anniversaire ? +o.anniversaire.slice(8, 10) : 1; };
  var echeance = function (o, an, mo) { return an + '-' + deux(mo) + '-' + deux(Math.min(ancre(o), dernier(an, mo))); };
  var aujourdhui = function () { return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' }); };
  var periodeOrg = function (o, j) {
    var an = +j.slice(0, 4), mo = +j.slice(5, 7);
    if (j >= echeance(o, an, mo)) return j.slice(0, 7);
    mo--; if (mo < 1) { mo = 12; an--; }
    return an + '-' + deux(mo);
  };
  var suivante = function (p) { var an = +p.slice(0, 4), mo = +p.slice(5, 7) + 1; if (mo > 12) { mo = 1; an++; } return an + '-' + deux(mo); };
  var semaineOrg = function (o, j) {
    var d = jourUTC(j), dec = o && o.anniversaire ? ((d.getUTCDay() - jourUTC(o.anniversaire).getUTCDay()) + 7) % 7 : (d.getUTCDay() + 6) % 7;
    return semaineIso(jourUTC(plus(j, -dec)));
  };
  var bornes = function (o, p) {
    var s = /^(\d{4})-S(\d{2})$/.exec(p);
    if (s) {
      var j4 = new Date(Date.UTC(+s[1], 0, 4)); j4.setUTCDate(j4.getUTCDate() - ((j4.getUTCDay() + 6) % 7) + (+s[2] - 1) * 7);
      var debut = plus(iso(j4), o && o.anniversaire ? (jourUTC(o.anniversaire).getUTCDay() + 6) % 7 : 0);
      return { debut: debut, fin: plus(debut, 6) };
    }
    var an = +p.slice(0, 4), mo = +p.slice(5, 7), n = suivante(p);
    return { debut: echeance(o, an, mo), fin: plus(echeance(o, +n.slice(0, 4), +n.slice(5, 7)), -1) };
  };
  var court = function (s) { var d = jourUTC(s); return (d.getUTCDate() === 1 ? '1er' : d.getUTCDate()) + ' ' + MOIS[d.getUTCMonth()]; };
  var libelle = function (p, o) {
    if (!/^\d{4}-(\d{2}|S\d{2})$/.test(p)) return p;
    var b = bornes(o, p);
    return (/S/.test(p) ? 'semaine du ' : 'du ') + court(b.debut) + (b.debut.slice(0, 4) !== b.fin.slice(0, 4) ? ' ' + b.debut.slice(0, 4) : '') + ' au ' + court(b.fin) + ' ' + b.fin.slice(0, 4);
  };
  var euros = function (n) { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(Number(n) || 0) + ' €'; };
  var jour = function (iso) { return iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; };
  var el = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  var donnees = {};

  var charger = function () {
    var s = session();
    if (!s) return etat('Connectez-vous d’abord à l’Espace Fill avec le compte administrateur.', ['Ouvrir l’Espace', './']);
    if (expiree(s)) return etat('Votre session a expiré : ouvrez l’Espace Fill pour la renouveler, puis rechargez cette page.', ['Ouvrir l’Espace', './']);
    var uid = s.user && s.user.id;
    return api('/rest/v1/profil?select=id,role,actif&id=eq.' + encodeURIComponent(uid)).then(function (p) {
      if (!p || !p[0] || p[0].role !== 'admin' || p[0].actif === false) throw new Error('admin');
      return Promise.all([
        api('/rest/v1/offre_version?select=id&active=is.true'),
        api('/rest/v1/organisation?select=id,nom,type,formule,statut,essai,relais_semaine,jeton_paiement,debut,fin,anniversaire&order=nom'),
        api('/rest/v1/mensualite?select=*&order=regle_le.desc&limit=200'),
        api('/rest/v1/commande?select=*&statut=eq.a_payer&order=creee'),
        api('/rest/v1/registre?select=organisation_id,periode,date&type=eq.credit&motif=eq.Premier%20quota')
      ]);
    }).then(function (r) {
      var offre = r[0] && r[0][0] ? r[0][0].id : null;
      return api('/rest/v1/formule?select=id,nom,prix,prix_semaine' + (offre ? '&offre_id=eq.' + encodeURIComponent(offre) : '')).then(function (f) {
        donnees = { formules: f || [], orgs: r[1] || [], mens: r[2] || [], cmd: r[3] || [], ouv: r[4] || [] };
        afficher();
      });
    }).catch(function (e) {
      if (e.message === 'admin') return etat('Cet écran est réservé à l’administrateur de Fill.', ['Retour à l’Espace', './']);
      if (e.message === 'session') return etat('Votre session a expiré : ouvrez l’Espace Fill pour la renouveler, puis rechargez cette page.', ['Ouvrir l’Espace', './']);
      etat('Chargement impossible : ' + e.message);
    });
  };

  var reglee = function (o, per) {
    var m = donnees.mens.find(function (x) { return x.organisation_id === o.id && x.periode === per; });
    if (m) return { m: m };
    var ouv = donnees.ouv.find(function (x) { return x.organisation_id === o.id && (x.periode === per || (/S/.test(per) && semaineOrg(o, new Date(x.date).toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' })) === per)); });
    return ouv ? { ouverture: true } : null;
  };

  var cellule = function (o, per, prix) {
    var td = el('td');
    var r = reglee(o, per);
    td.append(el('b', null, libelle(per, o)));
    if (r && r.m) {
      td.append(' ', el('span', 'et ok', r.m.mode === 'carte' ? 'Réglé par carte' : 'Virement reçu'));
      td.append(el('small', null, euros(r.m.montant) + ', le ' + jour(r.m.regle_le) + (r.m.credite_le ? ' · unités créditées' : ' · crédit le ' + court(bornes(o, per).debut))));
    } else if (r && r.ouverture) {
      td.append(' ', el('span', 'et ok', 'Ouverture'));
      td.append(el('small', null, 'Première période réglée dans l’Espace'));
    } else if (o.fin && per.indexOf('S') < 0 && bornes(o, per).debut > o.fin) {
      td.append(' ', el('span', 'et ne', 'Après la fin'));
    } else {
      td.append(' ', el('span', 'et at', 'À régler'));
      var b = el('button', 'bt sm cl', 'Virement reçu');
      b.type = 'button';
      b.setAttribute('aria-label', 'Virement reçu de ' + o.nom + ' pour la période ' + libelle(per, o));
      b.addEventListener('click', function () {
        if (!confirm('Marquer la période ' + libelle(per, o) + ' de ' + o.nom + ' comme réglée par virement (' + euros(prix) + ') ?')) return;
        b.disabled = true;
        rpc('mensualite_virement', { p_organisation: o.id, p_periode: per }).then(function (res) {
          toast(res && res.credite > 0 ? res.credite + ' unités créditées pour ' + o.nom : 'Virement enregistré pour ' + o.nom + (res && res.credit_le ? ', unités créditées le ' + court(res.credit_le) : ''));
          return charger();
        }).catch(function (e) { b.disabled = false; toast(e.message); });
      });
      var d = el('div', 'acts'); d.style.marginTop = '8px'; d.append(b); td.append(d);
    }
    return td;
  };

  var afficher = function () {
    etat('');
    var j = aujourdhui();
    var ent = donnees.orgs.filter(function (o) { return o.type === 'entreprise' && o.statut === 'active' && !o.essai; });
    var tb = $('rv-mt'); tb.textContent = '';
    ent.forEach(function (o) {
      var f = donnees.formules.find(function (x) { return x.id === o.formule; }) || {};
      var prix = o.relais_semaine ? f.prix_semaine : f.prix;
      var tr = el('tr');
      var t1 = el('td'); t1.append(el('b', null, o.nom)); tr.append(t1);
      var t2 = el('td', null, (f.nom || o.formule) + (o.relais_semaine ? ' à la semaine' : '')); t2.append(el('small', 'num', euros(prix) + (o.relais_semaine ? ' par semaine' : ' par mois') + (o.anniversaire ? (o.relais_semaine ? ', échéance chaque ' + ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][jourUTC(o.anniversaire).getUTCDay()] : ', échéance le ' + (+o.anniversaire.slice(8, 10) === 1 ? '1er' : +o.anniversaire.slice(8, 10)) + ' du mois') : ''))); tr.append(t2);
      var cur = periodeOrg(o, j), sui = suivante(cur), curS = semaineOrg(o, j), suiS = semaineOrg(o, plus(j, 7));
      tr.append(cellule(o, o.relais_semaine ? curS : cur, prix));
      tr.append(cellule(o, o.relais_semaine ? suiS : sui, prix));
      var t5 = el('td'); var lp = el('div', 'lien-p');
      var inp = el('input', 'saisie'); inp.readOnly = true; inp.value = LIEN + o.jeton_paiement; inp.setAttribute('aria-label', 'Lien de paiement de ' + o.nom);
      inp.addEventListener('focus', function () { inp.select(); });
      var cp = el('button', 'bt sm', 'Copier'); cp.type = 'button';
      cp.addEventListener('click', function () {
        var ok = function () { toast('Lien de ' + o.nom + ' copié'); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value).then(ok, function () { inp.select(); document.execCommand('copy'); ok(); });
        else { inp.select(); document.execCommand('copy'); ok(); }
      });
      lp.append(inp, cp); t5.append(lp);
      t5.append(el('small', null, 'À indiquer sur chaque facture Indy. Le lien propose la période due ; ajoutez &p=' + (o.relais_semaine ? curS : sui) + ' pour imposer une période.'));
      tr.append(t5);
      tb.append(tr);
    });
    if (!ent.length) { var v = el('tr'); var c = el('td', 'vide', 'Aucune entreprise active pour le moment.'); c.colSpan = 5; v.append(c); tb.append(v); }
    $('rv-m').hidden = false;

    var ct = $('rv-ct'); ct.textContent = '';
    donnees.cmd.forEach(function (c) {
      var o = donnees.orgs.find(function (x) { return x.id === c.organisation_id; }) || { nom: '?' };
      var tr = el('tr');
      var a = el('td'); a.append(el('b', null, o.nom)); tr.append(a);
      var b = el('td', null, c.unites + ' unités'); b.append(el('small', null, 'Commandée le ' + jour(c.creee))); tr.append(b);
      tr.append(el('td', 'num', euros(c.total)));
      var d = el('td'); var bt = el('button', 'bt sm cl', 'Virement reçu'); bt.type = 'button';
      bt.addEventListener('click', function () {
        if (!confirm('Marquer la commande de ' + c.unites + ' unités de ' + o.nom + ' (' + euros(c.total) + ') comme réglée par virement ? Les unités seront créditées.')) return;
        bt.disabled = true;
        rpc('commande_virement', { p_commande: c.id }).then(function () { toast(c.unites + ' unités créditées pour ' + o.nom); return charger(); })
          .catch(function (e) { bt.disabled = false; toast(e.message); });
      });
      d.append(bt); tr.append(d); ct.append(tr);
    });
    if (!donnees.cmd.length) { var v2 = el('tr'); var c2 = el('td', 'vide', 'Aucune commande en attente de paiement.'); c2.colSpan = 4; v2.append(c2); ct.append(v2); }
    $('rv-c').hidden = false;

    var ht = $('rv-ht'); ht.textContent = '';
    donnees.mens.slice(0, 30).forEach(function (m) {
      var o = donnees.orgs.find(function (x) { return x.id === m.organisation_id; }) || { nom: '?' };
      var tr = el('tr');
      tr.append(el('td', null, o.nom), el('td', null, libelle(m.periode, o)), el('td', 'num', euros(m.montant)), el('td', null, m.mode === 'carte' ? 'Carte' : 'Virement'), el('td', null, jour(m.regle_le)));
      ht.append(tr);
    });
    if (!donnees.mens.length) { var v3 = el('tr'); var c3 = el('td', 'vide', 'Aucun règlement enregistré.'); c3.colSpan = 5; v3.append(c3); ht.append(v3); }
    $('rv-h').hidden = false;
  };

  charger();
})();
