// Compare deux versions de l'Espace Fill servies en local : DOM rendu et styles calculés, écran par écran,
// en démonstration (9 profils, tous les écrans, fiches, saisie d'une demande) et en mode réel sans session.
// Usage : node tests/equivalence.cjs <url A> <url B> [dossier des écarts]
const { chromium } = require('playwright');
const fs = require('fs');
const [A, B, SORTIE] = [process.argv[2], process.argv[3], process.argv[4] || require('os').tmpdir() + '/fill-ecarts'];
fs.mkdirSync(SORTIE, { recursive: true });
const HEURE = new Date('2026-10-30T10:15:00+01:00');
const PROFILS = ['ewen', 'marion', 'yannick', 'gaelle', 'herve', 'lea', 'nolwenn', 'anne', 'visiteur'];
const ROUTES = ['accueil', 'demandes', 'nouvelle', 'calendrier', 'unites', 'equipe', 'comptes', 'production', 'pilotage'];
const graine = `(() => { let s = 42; Math.random = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; })();`;

async function nouveauContexte(b, largeur) {
  const c = await b.newContext({ viewport: { width: largeur, height: 900 }, reducedMotion: 'reduce', locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  await c.addInitScript(graine);
  return c;
}
const normaliser = (h) => h.replace(/127\.0\.0\.1:\d+/g, 'HOTE').replace(/ style="--b-[^"]*"/g, '').replace(/\s+/g, ' ');
async function capture(p) {
  await p.waitForTimeout(900);
  const dom = normaliser(await p.evaluate(() => document.body.innerHTML));
  // styles calculés de chaque élément (équivalence du CSS), hors propriétés posées par le script d'adaptation des barres
  const styles = await p.evaluate(() => {
    let h = 0;
    const add = (t) => { for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; };
    for (const el of document.body.querySelectorAll('*')) {
      if (el.closest('.barre-mobile,.onglets')) continue;
      const cs = getComputedStyle(el);
      for (let i = 0; i < cs.length; i++) { const k = cs[i]; if (!k.startsWith('--')) add(k + ':' + cs.getPropertyValue(k) + ';'); }
    }
    return h;
  });
  return dom + '\n#STYLES ' + styles;
}

async function parcours(base, largeur, journal) {
  const b = await chromium.launch();
  const res = {};
  const erreurs = [];
  // Mode démonstration, chaque profil, chaque écran
  for (const profil of PROFILS) {
    const c = await nouveauContexte(b, largeur);
    const p = await c.newPage();
    await p.clock.setFixedTime(HEURE);
    p.on('pageerror', (e) => erreurs.push(`${profil}: ${e.message}`));
    await p.goto(base + '?demo');
    await p.evaluate((m) => { localStorage.setItem('fill-espace-demo-mvuakaue-moi', m); }, profil);
    await p.goto(base + '?demo#accueil');
    await p.waitForTimeout(800);
    await p.keyboard.press('Escape');
    for (const r of ROUTES) {
      await p.evaluate((r) => { location.hash = r; }, r);
      res[`${profil}/${r}`] = await capture(p);
    }
    // fiches de demandes visibles
    await p.evaluate(() => { location.hash = 'demandes'; });
    await p.waitForTimeout(600);
    const ids = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="#demande-"]')].map((a) => a.getAttribute('href').split('#')[1]))].slice(0, 6));
    for (const id of ids) {
      await p.evaluate((r) => { location.hash = r; }, id);
      res[`${profil}/${id}`] = await capture(p);
    }
    if (profil === 'marion') {
      // saisie d'une nouvelle demande
      await p.evaluate(() => { location.hash = 'nouvelle'; });
      await p.waitForTimeout(700);
      const champs = await p.$$('input[type="text"], textarea');
      if (champs[0]) await champs[0].fill('Repas des aînés du 6 décembre');
      res['marion/nouvelle-saisie'] = await capture(p);
      const tx = await p.$('textarea');
      if (tx) await tx.fill('Annonce du repas des aînés, salle polyvalente, inscriptions en mairie avant le 30 novembre.');
      res['marion/nouvelle-brief'] = await capture(p);
    }
    await c.close();
  }
  // Mode réel sans session : connexion, ouverture de compte
  for (const r of ['', '#ouverture', '#paiement-annule']) {
    const c = await nouveauContexte(b, largeur);
    const p = await c.newPage();
    await p.clock.setFixedTime(HEURE);
    await p.route('**/*.supabase.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    p.on('pageerror', (e) => erreurs.push(`reel${r}: ${e.message}`));
    await p.goto(base + r);
    res[`reel/${r || 'connexion'}`] = await capture(p);
    if (!r) {
      await p.fill('input[type="email"]', 'test@exemple.fr').catch(() => null);
      await p.keyboard.press('Enter');
      res['reel/connexion-sans-mdp'] = await capture(p);
    }
    await c.close();
  }
  await b.close();
  return { res, erreurs };
}

(async () => {
  let ecarts = 0, total = 0;
  for (const largeur of [1440, 390]) {
    const ra = await parcours(A, largeur);
    const rb = await parcours(B, largeur);
    for (const k of Object.keys({ ...ra.res, ...rb.res })) {
      total++;
      if (ra.res[k] !== rb.res[k]) {
        ecarts++;
        fs.writeFileSync(`${SORTIE}/${largeur}-${k.replace(/[\/#]/g, '_')}.a.html`, ra.res[k] ?? '(absent)');
        fs.writeFileSync(`${SORTIE}/${largeur}-${k.replace(/[\/#]/g, '_')}.b.html`, rb.res[k] ?? '(absent)');
        console.log('ÉCART', largeur, k, (ra.res[k] ?? '').length, (rb.res[k] ?? '').length);
      }
    }
    console.log(largeur, 'erreurs A', ra.erreurs.length, ra.erreurs.slice(0, 3), 'erreurs B', rb.erreurs.length, rb.erreurs.slice(0, 3));
  }
  console.log(`écrans comparés : ${total}, écarts : ${ecarts}`);
  process.exit(ecarts ? 1 : 0);
})();
