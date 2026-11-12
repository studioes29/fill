// Contrôle du lien « nouvelle demande pré-remplie » (src/transfert.js) dans un vrai navigateur.
// L'Espace publié (../espace) tourne en mode réel ; Supabase est simulé : session, tables, fonctions de la base.
//
//   npm i --no-save playwright@1.63.0 && node tests/transfert.mjs
//   (ou NODE_PATH=<dossier node_modules qui contient playwright> node tests/transfert.mjs)
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const requerir = createRequire(import.meta.url);
const { chromium } = (() => { try { return requerir('playwright'); } catch { return requerir('playwright-core'); } })();
const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, '..', '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const serveur = createServer((req, res) => {
  let chemin = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (chemin.endsWith('/')) chemin += 'index.html';
  const f = join(racine, chemin);
  if (!f.startsWith(racine) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${serveur.address().port}/espace/`;

let passes = 0;
const test = async (nom, f) => { try { await f(); passes++; console.log(`ok   ${nom}`); } catch (e) { console.log(`ÉCHEC ${nom}\n     ${e.message.split('\n').slice(0, 12).join('\n     ')}`); process.exitCode = 1; } };

const ORG = '11111111-1111-4111-8111-111111111111', MOI = '22222222-2222-4222-8222-222222222222', AUTRE_ORG = '33333333-3333-4333-8333-333333333333';
const MAIL = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', MAIL_AILLEURS = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', MAIL_FAIT = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const DEMANDE = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', ANCIENNE = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const maintenant = new Date();
const periode = maintenant.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' }).slice(0, 7);
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const utilisateur = { id: MOI, aud: 'authenticated', role: 'authenticated', email: 'yann@exemple.fr', app_metadata: {}, user_metadata: {}, created_at: '2026-11-01T08:00:00Z' };
const session = {
  access_token: `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: MOI, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.signature`,
  token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'rafraichir', user: utilisateur,
};
const ligneDemande = (id, titre) => ({ id, numero: 12, organisation_id: ORG, auteur_id: MOI, titre, offre_id: '2026-10-27', urgente: false, urgence_incluse: false, parution: null, brief: 'Texte', statut: 'deposee', unites: 1, unites_hors_forfait: 0, livraison: null, corrections: 0, motif_accord: null, creee: maintenant.toISOString(), maj: maintenant.toISOString(), heure: null });
const MAILS = {
  [MAIL]: { id: MAIL, organisation_id: ORG, issue: 'a_completer', titre: 'Travaux rue de la Gare du 16 au 27 novembre', texte: 'Message transféré :\nDes travaux auront lieu rue de la Gare. La circulation sera alternée.', parution: '2027-01-15', lignes: [{ prestation: 'actu', quantite: 1 }, { prestation: 'photo', quantite: 1 }, { prestation: 'inconnue', quantite: 3 }], demande_id: null },
  [MAIL_AILLEURS]: { id: MAIL_AILLEURS, organisation_id: AUTRE_ORG, issue: 'a_completer', titre: 'Mail d’une autre structure', texte: 'x', parution: null, lignes: [], demande_id: null },
  [MAIL_FAIT]: { id: MAIL_FAIT, organisation_id: ORG, issue: 'deposee', titre: 'Déjà envoyée', texte: null, parution: null, lignes: [], demande_id: ANCIENNE },
};

const nav = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME, args: ['--no-sandbox'] } : {});
// ouvre l'Espace ; connecte : pose une session avant le chargement
const ouvrir = async (adresse, { connecte = true, role = 'referent' } = {}) => {
  // animations laissées actives : avec « réduire les animations », l'Espace retire ses messages (toasts) dès leur apparition
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 }, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  if (connecte) await ctx.addInitScript((s) => localStorage.setItem('sb-nfnbseonwgmtouxsaajd-auth-token', JSON.stringify(s)), session);
  const page = await ctx.newPage();
  const erreurs = [], appels = [];
  const etat = { demandes: [ligneDemande(ANCIENNE, 'Déjà envoyée')], lignes: [{ demande_id: ANCIENNE, organisation_id: ORG, offre_id: '2026-10-27', prestation: 'post', quantite: 1, unites: 1 }] };
  page.on('pageerror', (e) => erreurs.push(String(e)));
  const tables = () => ({
    organisation: [{ id: ORG, nom: 'Commune de Saint-Ivenec', type: 'collectivite', formule: 'essentiel', debut: '2026-11-01', engagement_mois: 6, statut: 'active', siret: '12345678901234', essai: false, sans_ia: false, creee: '2026-11-01T08:00:00Z', jeton_paiement: 'x', relais_semaine: false, anniversaire: null, alias_mail: 'commune-de-saint-ivenec' }],
    profil: [{ id: MOI, nom: 'Yann Le Gall', email: 'yann@exemple.fr', fonction: null, telephone: null, role, organisation_id: ORG, plafond_mensuel: 5, suppleant_jusqu_au: null, actif: true, visite_vue: true, creee: '2026-11-01T08:00:00Z' }],
    demande: etat.demandes, demande_ligne: etat.lignes,
    registre: [{ id: 'r1', organisation_id: ORG, periode, type: 'credit', unites: 10, demande_id: null, commande_id: null, etat: null, source: null, motif: null, date: `${periode}-01T08:00:00Z` }],
    parametre: { id: true, capacite_semaine: 30, pilote_confirmation: true, pilote_atelier: true, pilote_relances: true, pilote_activation: false, pilote_facturation: false },
  });
  await page.route('https://nfnbseonwgmtouxsaajd.supabase.co/**', async (route) => {
    const req = route.request(), u = new URL(req.url());
    const rep = (corps, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: JSON.stringify(corps) });
    if (req.method() === 'OPTIONS') return rep({});
    if (u.pathname === '/auth/v1/user') return rep(utilisateur);
    if (u.pathname.startsWith('/auth/v1/token')) return rep(session);
    if (u.pathname.startsWith('/rest/v1/rpc/')) {
      const nom = u.pathname.split('/').pop(), corps = req.postDataJSON();
      appels.push({ rpc: nom, corps });
      if (nom === 'deposer_demande') {
        etat.demandes = [ligneDemande(DEMANDE, corps.p_titre), ...etat.demandes];
        etat.lignes = [...etat.lignes, ...corps.p_lignes.map((l) => ({ demande_id: DEMANDE, organisation_id: ORG, offre_id: '2026-10-27', prestation: l.prestation, quantite: l.quantite, unites: 1 }))];
        return rep(DEMANDE);
      }
      return rep(nom === 'mail_rattacher' ? 1 : null);
    }
    if (u.pathname.startsWith('/functions/v1/')) { appels.push({ fonction: u.pathname.split('/').pop(), corps: req.postDataJSON() }); return rep('ok'); }
    if (u.pathname === '/rest/v1/mail_recu') {
      const id = (u.searchParams.get('id') ?? '').replace(/^eq\./, '');
      appels.push({ table: 'mail_recu', id });
      const ligne = MAILS[id] ?? null;
      return /vnd\.pgrst\.object/.test(req.headers().accept ?? '') ? (ligne ? rep(ligne) : rep({ code: 'PGRST116', message: 'aucune ligne' }, 406)) : rep(ligne ? [ligne] : []);
    }
    if (u.pathname.startsWith('/rest/v1/')) {
      const t = tables()[u.pathname.split('/').pop()];
      return rep(t ?? []);
    }
    return rep({}, 404);
  });
  await page.goto(adresse);
  return { page, erreurs, appels, fermer: () => ctx.close() };
};
const champ = (page, sel) => page.locator(sel).inputValue();

await test('lien du mail : connecté, la nouvelle demande s’ouvre avec le titre, le texte, la date et les supports reconnus', async () => {
  const { page, erreurs, appels, fermer } = await ouvrir(`${base}?mail=${MAIL}`);
  await page.waitForFunction(() => location.hash === '#nouvelle', null, { timeout: 15000 });
  await page.waitForSelector('#titre');
  assert.equal(await champ(page, '#titre'), 'Travaux rue de la Gare du 16 au 27 novembre');
  assert.match(await champ(page, '#brief'), /^Message transféré :\nDes travaux auront lieu rue de la Gare/);
  assert.equal(new URL(page.url()).search, '');                                   // l'identifiant a quitté l'adresse
  assert.ok(await page.getByText('Votre demande en cours est reprise là où vous l’aviez laissée.').isVisible());
  // seule l'actualité est retenue : le reportage photo n'est pas ouvert à la formule Essentiel, « inconnue » n'existe pas
  const saisie = await page.evaluate((org) => JSON.parse(localStorage.getItem(`fill-brouillon-${org}`)), ORG);
  assert.deepEqual([saisie.qte, saisie.parution, saisie.urgente], [{ actu: 1 }, '2027-01-15', false]);
  assert.equal(JSON.parse(await page.evaluate((org) => localStorage.getItem(`fill-mail-${org}`), ORG)).id, MAIL);
  assert.deepEqual(appels.filter((a) => a.table), [{ table: 'mail_recu', id: MAIL }]);
  // rien n'est déposé à l'ouverture du lien
  assert.equal(appels.filter((a) => a.rpc).length, 0);

  // le client vérifie puis envoie : la demande part par deposer_demande, puis les pièces du mail la rejoignent
  await page.getByRole('button', { name: /Vérifier la demande/ }).click();
  await page.getByRole('button', { name: /Envoyer la demande/ }).click();
  await page.waitForFunction((d) => location.hash === `#demande-${d}`, DEMANDE, { timeout: 15000 });
  const rpcs = appels.filter((a) => a.rpc);
  assert.deepEqual(rpcs.map((a) => a.rpc), ['deposer_demande', 'mail_rattacher']);
  assert.deepEqual([rpcs[0].corps.p_titre, rpcs[0].corps.p_lignes, rpcs[0].corps.p_urgente, rpcs[0].corps.p_parution], ['Travaux rue de la Gare du 16 au 27 novembre', [{ prestation: 'actu', quantite: 1 }], false, '2027-01-15']);
  assert.deepEqual(rpcs[1].corps, { p_mail: MAIL, p_demande: DEMANDE });
  assert.deepEqual(appels.filter((a) => a.fonction).map((a) => [a.fonction, a.corps.evenement]), [['notifier', 'depot']]);
  assert.equal(await page.evaluate((org) => localStorage.getItem(`fill-mail-${org}`), ORG), null);
  assert.equal(await page.evaluate((org) => localStorage.getItem(`fill-brouillon-${org}`), ORG), null);
  assert.deepEqual(erreurs, []);
  await fermer();
});

await test('« Repartir de zéro » détache le mail : la demande suivante ne reprend pas ses pièces', async () => {
  const { page, appels, erreurs, fermer } = await ouvrir(`${base}?mail=${MAIL}`);
  await page.waitForSelector('#titre');
  await page.getByRole('button', { name: 'Repartir de zéro' }).click();
  assert.equal(await champ(page, '#titre'), '');
  assert.equal(await page.evaluate((org) => localStorage.getItem(`fill-mail-${org}`), ORG), null);
  assert.equal(appels.filter((a) => a.rpc).length, 0);
  assert.deepEqual(erreurs, []);
  await fermer();
});

await test('une demande sans rapport avec le mail ne reprend pas ses pièces ; le titre peut changer si le texte reste', async () => {
  const a = await ouvrir(`${base}?mail=${MAIL}`);
  await a.page.waitForSelector('#titre');
  await a.page.fill('#titre', 'Tout autre sujet');
  await a.page.fill('#brief', 'Un texte écrit à la main, sans lien avec le mail reçu.');
  await a.page.getByRole('button', { name: /Vérifier la demande/ }).click();
  await a.page.getByRole('button', { name: /Envoyer la demande/ }).click();
  await a.page.waitForFunction((d) => location.hash === `#demande-${d}`, DEMANDE, { timeout: 15000 });
  assert.deepEqual(a.appels.filter((x) => x.rpc).map((x) => x.rpc), ['deposer_demande']);
  assert.equal(await a.page.evaluate((org) => localStorage.getItem(`fill-mail-${org}`), ORG), null);
  assert.deepEqual(a.erreurs, []);
  await a.fermer();
  const b = await ouvrir(`${base}?mail=${MAIL}`);
  await b.page.waitForSelector('#titre');
  await b.page.fill('#titre', 'Travaux rue de la Gare : circulation alternée');
  await b.page.getByRole('button', { name: /Vérifier la demande/ }).click();
  await b.page.getByRole('button', { name: /Envoyer la demande/ }).click();
  await b.page.waitForFunction((d) => location.hash === `#demande-${d}`, DEMANDE, { timeout: 15000 });
  assert.deepEqual(b.appels.filter((x) => x.rpc).map((x) => x.rpc), ['deposer_demande', 'mail_rattacher']);
  assert.deepEqual(b.erreurs, []);
  await b.fermer();
});

await test('lien d’une autre structure, lien inconnu ou mal formé : rien n’est repris, la saisie reste vide', async () => {
  for (const id of [MAIL_AILLEURS, 'ffffffff-ffff-4fff-8fff-ffffffffffff']) {
    const { page, erreurs, fermer } = await ouvrir(`${base}?mail=${id}`);
    await page.waitForFunction(() => location.hash === '#nouvelle', null, { timeout: 15000 });
    await page.waitForSelector('#titre');
    assert.equal(await champ(page, '#titre'), '');
    assert.ok(await page.getByText('Ce lien n’est plus valable').isVisible());
    assert.equal(await page.evaluate((org) => localStorage.getItem(`fill-mail-${org}`), ORG), null);
    assert.deepEqual(erreurs, []);
    await fermer();
  }
  const { page, appels, erreurs, fermer } = await ouvrir(`${base}?mail=<script>alert(1)</script>`);
  await page.waitForSelector('.page, main, #app > *');
  await page.waitForTimeout(1500);
  assert.equal(new URL(page.url()).search, '');
  assert.equal(appels.filter((a) => a.table).length, 0);
  assert.deepEqual(erreurs, []);
  await fermer();
});

await test('lien déjà utilisé : la demande envoyée s’ouvre ; compte en lecture seule : le lien est sans effet', async () => {
  const a = await ouvrir(`${base}?mail=${MAIL_FAIT}`);
  await a.page.waitForFunction((d) => location.hash === `#demande-${d}`, ANCIENNE, { timeout: 15000 });
  assert.deepEqual(a.erreurs, []);
  await a.fermer();
  const b = await ouvrir(`${base}?mail=${MAIL}`, { role: 'lecteur' });
  await b.page.waitForTimeout(2500);
  assert.equal(b.appels.filter((x) => x.table).length, 0);
  assert.notEqual(new URL(b.page.url()).hash, '#nouvelle');
  assert.deepEqual(b.erreurs, []);
  await b.fermer();
});

await test('sans session : le lien attend la connexion, sans rien lire ; sans lien : l’Espace ne demande rien', async () => {
  const a = await ouvrir(`${base}?mail=${MAIL}`, { connecte: false });
  await a.page.waitForTimeout(2500);
  assert.equal(await a.page.evaluate(() => sessionStorage.getItem('fill-mail')), MAIL);
  assert.equal(new URL(a.page.url()).search, '');
  assert.equal(a.appels.filter((x) => x.table).length, 0);
  assert.deepEqual(a.erreurs, []);
  await a.fermer();
  const b = await ouvrir(base);
  await b.page.waitForTimeout(2500);
  assert.equal(b.appels.filter((x) => x.table || x.rpc).length, 0);
  assert.deepEqual(b.erreurs, []);
  await b.fermer();
  // en démonstration, le module ne fait rien
  const c = await ouvrir(`${base}?demo&mail=${MAIL}`, { connecte: false });
  await c.page.waitForTimeout(2000);
  assert.equal(c.appels.length, 0);
  assert.equal(await c.page.evaluate(() => sessionStorage.getItem('fill-mail')), null);
  assert.deepEqual(c.erreurs, []);
  await c.fermer();
});

await nav.close();
serveur.close();
console.log(`\n${passes} contrôles passés${process.exitCode ? ', des échecs ci-dessus' : ''}`);
