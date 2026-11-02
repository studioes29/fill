/* Test local de la fonction « envoi » (pièces jointes) : faux Deno, faux client Supabase, faux fetch. Aucun envoi réel.
   Usage : TS_MODULE=<chemin de typescript> node supabase/tests/envoi-pj.js supabase/functions/envoi/index.ts */
const fs = require('fs'), assert = require('assert');
const ts = require(process.env.TS_MODULE || 'typescript');
const src = fs.readFileSync(process.argv[2], 'utf8')
  .replace(/^import \{ createClient \} from .*$/m, '')
  .replace(/Deno\.serve\(/, 'globalThis.__serve = (');
const js = ts.transpileModule(src, {compilerOptions:{target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.None}}).outputText;
const ENV = {CLE_SECRETE:'x'.repeat(40), SUPABASE_URL:'https://exemple.supabase.co', BREVO_API_KEY:'cle-factice'};
const envois = [], maj = [];
const DUS = [
  {message_id:'m1', sequence_id:'s1', rang:1, objet:'Diffusion', corps:'Bonjour,\n\nTexte.', email:'test-diffusion@example.invalid', cc:null, nom:'AMF 29', marque:'fill', type:'prospection', precedent:null,
   pj:[{nom:'Dossier de presse Fill', url:'https://fill.studioes.fr/assets/pj/dossier-presse.pdf'},
       {nom:'Communiqué.docx', url:'https://fill.studioes.fr/assets/pj/communique.docx'},
       {nom:'Troisième', url:'https://fill.studioes.fr/assets/pj/trop.pdf'}]},
  {message_id:'m2', sequence_id:'s2', rang:1, objet:'Refusées', corps:'Texte', email:'test-refus@example.invalid', marque:'studio', type:'prospection', precedent:null,
   pj:[{nom:'http', url:'http://fill.studioes.fr/assets/pj/a.pdf'}, {nom:'autre hote', url:'https://evil.example.com/a.pdf'},
       {nom:'exe', url:'https://studioes.fr/a.exe'}, {nom:'sous-domaine piégé', url:'https://fill.studioes.fr.evil.com/a.pdf'}, 'nimporte', null]},
  {message_id:'m3', sequence_id:'s3', rang:2, objet:'Re : Diffusion', corps:'Relance', email:'test-relance@example.invalid', marque:'fill', type:'prospection', precedent:'<id@brevo>', pj:null},
  {message_id:'m4', sequence_id:'s4', rang:1, objet:'Ancien format', corps:'Sans colonne pj', email:'test-ancien@example.invalid', marque:'studio', type:'client', precedent:null}];
const sb = {
  rpc: async (n, a) => n === 'sequence_envoyes_aujourdhui' ? {data:0} : n === 'sequence_dus' ? {data:DUS} : n === 'verifier_jeton_pilote' ? {data:false} : {data:1},
  from: (t) => { const q = {select:() => q, eq:() => q, maybeSingle:async () => ({data:null}), update:(v) => { maj.push([t, v]); return q; }, then:(f) => f({data:[]})}; return q; }};
globalThis.Deno = {env:{get:(k) => ENV[k]}};
globalThis.createClient = () => sb;
globalThis.fetch = async (url, o) => {
  if(/\/v3\/contacts\//.test(url)) return {ok:false, json:async () => ({})};
  if(/statistics\/events/.test(url)) return {ok:true, json:async () => ({events:[]})};
  assert.strictEqual(url, 'https://api.brevo.com/v3/smtp/email');
  envois.push(JSON.parse(o.body)); return {ok:true, status:201, text:async () => JSON.stringify({messageId:'<faux-' + envois.length + '@brevo>'})};
};
eval(js + '\n;globalThis.__passage = passage;');
(async () => {
  const r = await globalThis.__passage(true);
  assert.strictEqual(envois.length, 4);
  assert.deepStrictEqual(envois[0].attachment, [{url:'https://fill.studioes.fr/assets/pj/dossier-presse.pdf', name:'Dossier de presse Fill.pdf'}, {url:'https://fill.studioes.fr/assets/pj/communique.docx', name:'Communiqué.docx'}]);
  assert.ok(!('attachment' in envois[1]), 'liens refusés : pas de pièce jointe');
  assert.ok(!('attachment' in envois[2]), 'relance : pas de pièce jointe');
  assert.ok(!('attachment' in envois[3]), 'ancien format sans pj');
  assert.strictEqual(envois[2].headers['In-Reply-To'], '<id@brevo>');
  assert.ok(envois[0].htmlContent.includes('cliquez ici') && envois[0].headers['List-Unsubscribe']);
  const reponse = await globalThis.__serve(new Request('https://x/functions/v1/envoi', {method:'POST', body:'{}'}));
  assert.strictEqual(reponse.status, 401);
  console.log(JSON.stringify({bilan:r, premier:{to:envois[0].to, subject:envois[0].subject, attachment:envois[0].attachment, tags:envois[0].tags}}, null, 1));
  console.log('OK : 4 corps Brevo construits, aucun envoi réel');
})().catch(e => { console.error(e); process.exit(1); });
