// Dossier de présentation de Fill (/dossier/) : une seule source pour la page en ligne et les PDF.
//
//   node outils/dossier.mjs           écrit dossier/index.html (prix et règles lus dans assets/offre.js)
//   node outils/dossier.mjs --pdf     écrit aussi les deux PDF, avec Chrome (Playwright) :
//       assets/pj/fill-dossier-de-presentation.pdf   A4 paysage, captures allégées : site, prospection, Hors-champ
//       assets/pj/fill-dossier-imprimeur.pdf         même contenu, fonds perdus de 3 mm et traits de coupe (317 × 230 mm)
//
// Les captures viennent de outils/dossier-captures.mjs (Espace en démonstration, données fictives).
// Après une modification de l'offre ou d'un écran : captures, puis ce script avec --pdf.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILL = JSON.parse(fs.readFileSync(path.join(RACINE, 'assets', 'offre.js'), 'utf8').replace(/^\s*window\.FILL\s*=\s*/, '').replace(/;\s*$/, ''));
const O = FILL.offre, S = FILL.site;
const F = Object.fromEntries(O.formules.map((f) => [f.id, f]));
const R = O.relais;
const eur = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;

// logo : « fi », « ll » d'un seul fil (assets/fill.svg)
const FI = '<path d="M100 700V262C100 158 168 90 274 90H300V214H282C246 214 224 236 224 274V700Z"/><rect x="18" y="330" width="282" height="104" rx="8"/><rect x="360" y="330" width="124" height="370" rx="8"/><circle cx="422" cy="178" r="72"/>';
const L1 = 'M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600';
const L2 = 'M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575';
const logo = (mono) => `<svg viewBox="0 0 1376 720" role="img" aria-label="Fill"><g fill="#1A1A1A">${FI}</g><g fill="none" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"><path stroke="${mono ? '#1A1A1A' : '#B8A4FF'}" d="${L1}"/><path stroke="${mono ? '#1A1A1A' : '#FF8A6B'}" d="${L2}"/></g></svg>`;
const fil = (cls = 'fil', sw = 96) => `<svg class="${cls}" viewBox="500 0 880 720" aria-hidden="true" stroke-width="${sw}"><path d="${L1}"/><path d="${L2}"/></svg>`;
// filigranes ton sur ton, par type de page
const MOTIFS = {
  page: `<svg viewBox="500 0 880 720" aria-hidden="true" stroke-width="64" style="right:-30rem;bottom:-34rem;width:124rem"><path d="${L1}"/><path d="${L2}"/></svg>`,
  couv: `<svg viewBox="500 0 880 720" aria-hidden="true" stroke-width="104" style="right:-70rem;top:-56rem;width:340rem"><path d="${L1}"/><path d="${L2}"/></svg>`,
  ouv: `<svg viewBox="500 0 880 720" aria-hidden="true" stroke-width="104" style="right:-30rem;top:-70rem;width:250rem"><path d="${L1}"/><path d="${L2}"/></svg>`,
  dos: `<svg viewBox="500 0 880 720" aria-hidden="true" stroke-width="104" style="left:-90rem;bottom:-80rem;width:340rem"><path d="${L1}"/><path d="${L2}"/></svg>`,
};

// typographie française, appliquée au texte seulement (jamais aux balises)
const typo = (html) => html.split(/(<[^>]+>)/).map((m) => m.startsWith('<') ? m : m
  .replace(/'/g, '’')
  .replace(/ ([:;?!»])/g, ' $1').replace(/« /g, '« ')
  .replace(/(\d) (\d{3})(?!\d)/g, '$1 $2')
  .replace(/(\d) (€|%|h\b|j\b|u\.|unités?\b|mois\b|jours?\b|semaines?\b|ans?\b|km\b|pages?\b|minutes\b|personnes\b|Mo\b)/g, '$1 $2')
  .replace(/\b(n°|art\.|p\.) /g, '$1 ')).join('');

const cap = (f, legende, titre) => `<figure><div class="ecran"><img src="captures/${f}.jpg" srcset="captures/l/${f}.jpg 1080w, captures/${f}.jpg 1920w" sizes="(max-width:900px) 60vw, 800px" width="1920" height="1200" loading="lazy" alt="${legende.replace(/<[^>]+>/g, '').replace(/"/g, '')}"></div><figcaption>${titre ? `<b>${titre}</b>` : ''}${legende}</figcaption></figure>`;
const pas = (l) => `<ol class="pas">${l.map(([t, d]) => `<li><b>${t}</b>${d}</li>`).join('')}</ol>`;
const liste = (l, cls = '') => `<ul class="l ${cls}">${l.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const lignes = (l) => l.map(([a, b]) => `<p class="lg-l"><span>${a}</span><span>${b}</span></p>`).join('');

// ---------------------------------------------------------------- pages
// Le dossier se lit dans l'ordre : comprendre Fill et ses mots, choisir une formule, démarrer, utiliser au quotidien.
const pages = [];
let partie = 0, rang = 0;
const brut = (h) => h.replace(/<[^>]+>/g, '');
const ouvrir = (id, titre) => { partie += 1; rang = 0; pages.push({ id, type: 'ouv', n: partie, titre, cls: 'ouv lav', motif: 'ouv', nu: true }); };
const page = (id, titre, chapo, corps, { court = null } = {}) => { rang += 1; pages.push({ id, type: 'page', n: `${partie}.${rang}`, partie, titre, court: court ?? brut(titre), chapo, corps, cls: '', motif: 'page' }); };
// un écran : les étapes à gauche, la capture à droite
const solo = (id, titre, chapo, etapes, droite, cote = '', opt = {}) => page(id, titre, chapo, `<div class="solo"><div>${etapes.length ? pas(etapes) : ''}${cote}</div><div class="caps">${droite}</div></div>`, opt);
// deux écrans côte à côte, les étapes en ligne dessous
const duo = (id, titre, chapo, etapes, droite, opt = {}) => page(id, titre, chapo, `<div class="duo">${droite}</div><ol class="pas h" style="grid-template-columns:repeat(${etapes.length},1fr)">${etapes.map(([t, d]) => `<li><b>${t}</b>${d}</li>`).join('')}</ol>`, opt);

pages.push({ id: 'couverture', type: 'nu', corps: `<div class="logo">${logo(false)}</div>`, cls: 'couv', motif: 'couv', nu: true });
pages.push({ id: 'sommaire', type: 'sommaire', cls: '', motif: 'page' });

// ------------------------------------------------ 1. comprendre
ouvrir('comprendre', 'Comprendre Fill');

page('fill', 'Fill, <i>qu\'est-ce que c\'est ?</i>', 'Un service de communication externalisé, par abonnement mensuel. Fill produit et publie votre communication courante ; vous gardez la décision.', `
<div class="g g3 gros roles">
  <div class="c"><p class="nb">1</p><h3>Vous transmettez l'information</h3><p class="pt mu">Par un formulaire ou par un simple mail, sous la forme qui vous arrange.</p></div>
  <div class="c lv">${fil()}<p class="nb">2</p><h3>Fill rédige, met en forme et publie</h3><p class="pt">Textes, visuels, mise en page, puis publication sur vos comptes.</p></div>
  <div class="c"><p class="nb">3</p><h3>Vous validez</h3><p class="pt mu">Rien n'est publié sans votre accord.</p></div>
</div>
<p class="note">Rien à installer et aucun outil imposé : Fill travaille dans les vôtres (site, réseaux sociaux, logiciel de newsletter).</p>`, { court: 'Fill, qu\'est-ce que c\'est ?' });

page('pour-qui', 'À qui <i>s\'adresse Fill</i>', '', `
<div class="g g3 gros cibles">
  <div class="c pl">${fil()}<h3>Communes et intercommunalités</h3><p class="pt">Élus, direction générale, secrétariat de mairie.</p></div>
  <div class="c pl">${fil()}<h3>Structures publiques</h3><p class="pt">CCAS, offices de tourisme, syndicats, établissements publics.</p></div>
  <div class="c pl">${fil()}<h3>Entreprises</h3><p class="pt">PME, commerces, artisans, associations employeuses.</p></div>
</div>
<div class="sits">
  <h3>Dans quelle situation</h3>
  <ul>
    <li><b>Pas de service communication</b>Le secrétariat ou le dirigeant fait déjà tout.</li>
    <li><b>Un poste vacant, une absence</b>Recrutement, congé, arrêt, été.</li>
    <li><b>Un service qui manque de temps</b>Bulletin, pics d'activité, photo.</li>
    <li><b>Pas d'embauche à temps plein</b>Le volume ne justifie pas un poste.</li>
  </ul>
</div>`);

page('mots', 'Six mots <i>à connaître</i>', 'Ils reviennent dans tout le dossier et dans votre espace.', `
<div class="g g3 mots">
  <div class="c"><h3>Demande</h3><p class="pt mu">Ce que vous confiez à Fill sur un sujet : un événement, une information, un recrutement. Une demande, un sujet.</p></div>
  <div class="c"><h3>Livrable</h3><p class="pt mu">Chaque support produit pour une demande : l'affiche, la publication, l'article. Une demande peut en compter plusieurs.</p></div>
  <div class="c lv"><h3>Unité</h3><p class="pt">La mesure commune. Chaque livrable vaut un nombre d'unités, connu d'avance.</p></div>
  <div class="c lv"><h3>Formule</h3><p class="pt">Votre abonnement : un nombre d'unités à utiliser chaque mois.</p></div>
  <div class="c"><h3>Référent</h3><p class="pt mu">La personne qui valide de votre côté : les contenus, les coûts, les accès de l'équipe.</p></div>
  <div class="c"><h3>Espace</h3><p class="pt mu">Votre accès en ligne : demandes, livrables, unités, équipe. Sur ordinateur comme sur téléphone.</p></div>
</div>`);

const noms = (cat) => O.catalogue.filter((p) => p.cat === cat).map((p) => p.nom);
page('livrables', 'Ce que <i>Fill produit</i>', `Tout ce que produit un service communication : ${O.catalogue.length} livrables, en dix familles.`, `
<div class="gal">
  <figure class="vis"><div class="cadre post"><div class="pub"><p class="qui"><span>SI</span><b>Commune de Saint-Ivenec</b></p><p class="txt">Marché de Noël : les bénévoles sont prêts. Rendez-vous samedi, de 10 h à 19 h, place de l'Église.</p><img src="img/benevoles.jpg" loading="lazy" alt="Bénévoles préparant des crêpes"></div></div><figcaption><b>Publication</b><span>réseaux sociaux</span></figcaption></figure>
  <figure class="vis"><img src="img/lettre.jpg" loading="lazy" alt="Exemple de newsletter d’une commune annonçant les vœux du maire"><figcaption><b>Lettre d'information</b><span>par mail</span></figcaption></figure>
  <figure class="vis"><img src="img/budget.jpg" loading="lazy" alt="Affiche de budget participatif dans un abribus"><figcaption><b>Affiche</b><span>campagne</span></figcaption></figure>
  <figure class="vis"><img src="img/bulletin.jpg" loading="lazy" alt="Exemple de couverture de bulletin municipal"><figcaption><b>Bulletin</b><span>magazine</span></figcaption></figure>
</div>
<div class="familles10">${O.categories.map((c) => `<div><h3>${c.nom}</h3><p class="mu">${noms(c.id).slice(0, 4).join(', ').toLowerCase().replace(/^./, (x) => x.toUpperCase())}${noms(c.id).length > 4 ? '…' : '.'}</p></div>`).join('')}</div>
`);

const U = Object.fromEntries(O.catalogue.map((p) => [p.id, p.u]));
const mois = (titre, l) => { const tot = l.reduce((s, [id, q]) => s + U[id] * q, 0); return `<div class="c"><h3>${titre}</h3><div class="pt" style="margin-top:2.4rem">${lignes(l.map(([id, q, nom]) => [nom, `${U[id] * q} u.`]))}</div><p class="tot"><b>${tot} unités</b><span>sur ${F.regulier.unites}${F.regulier.unites - tot > 0 ? ` : ${F.regulier.unites - tot} reportées` : ''}</span></p></div>`; };
page('unite', 'L\'unité, <i>à quoi elle sert</i>', 'Vos besoins changent d\'un mois à l\'autre. Avec les unités, vous payez un forfait fixe et vous l\'utilisez comme vous voulez.', `
<div class="g g3" style="grid-template-columns:1fr 1fr 1fr">
  <div class="c lv">${fil()}<h3>Le principe</h3>${liste(['Chaque support vaut un nombre d\'unités : 1 pour une publication, 4 pour une affiche', 'Votre formule vous donne un nombre d\'unités par mois', 'Le coût d\'une demande s\'affiche avant son envoi', 'Les unités non utilisées sont reportées une fois, sur le mois suivant'], 'pt')}</div>
  ${mois('Un mois courant', [['post', 10, '10 publications'], ['actu', 6, '6 actualités'], ['agenda', 4, '4 événements à l\'agenda'], ['news', 1, '1 lettre d\'information'], ['presse', 1, '1 communiqué de presse']])}
  ${mois('Un mois avec un événement', [['affiche', 1, '1 affiche'], ['gabarit', 3, '3 déclinaisons de l\'affiche'], ['post', 8, '8 publications'], ['actu', 5, '5 actualités'], ['agenda', 4, '4 événements à l\'agenda'], ['presse', 1, '1 communiqué de presse'], ['flyer', 1, '1 flyer'], ['invitation', 1, '1 invitation']])}
</div>
<p class="note">Exemples avec la formule Régulier, ${F.regulier.unites} unités par mois.</p>`);

page('trajet', 'Le trajet <i>d\'une demande</i>', 'Toutes les demandes suivent le même chemin, du dépôt à la publication ou à la livraison.', `
<ol class="fil-e">
  <li><b>Vous demandez</b>Dans votre espace ou par mail, avec la date souhaitée.</li>
  <li><b>Fill confirme</b>Le nombre d'unités et la date de livraison, par écrit.<small>Sous 24 h ouvrées</small></li>
  <li><b>Fill produit</b>Rédaction, visuel, mise en page, selon vos gabarits et votre ton.<small>${O.delais.courant_j} pour le courant</small></li>
  <li><b>Vous validez</b>Dans votre espace, ou sur le lien reçu par mail.<small>Deux allers-retours compris</small></li>
  <li><b>C'est publié ou livré</b>Ce qui va en ligne, Fill le publie sur vos comptes. Ce qui s'imprime vous est livré en fichiers prêts à l'emploi.</li>
</ol>`);

// ------------------------------------------------ 2. choisir
ouvrir('choisir', 'Choisir sa formule');

const cata = (cats) => `<div class="cata d">${cats.map((c) => `<div class="fam"><h3>${c.nom}</h3>${O.catalogue.filter((p) => p.cat === c.id).map((p) => `<p><span>${p.nom}<small>${p.detail.replace(/\. (À partir de la formule Régulier|Au-delà de 12 pages par numéro : devis)$/, '')}</small></span><b>${p.u}</b></p>`).join('')}</div>`).join('')}</div>`;
page('bareme', 'Le catalogue <i>et son barème</i>', `${O.catalogue.length} livrables, chacun avec son nombre d'unités, connu d'avance.`, cata(O.categories.slice(0, 5)));
page('bareme-2', 'Le catalogue, <i>suite</i>', '', `${cata(O.categories.slice(5))}
<p class="note">En unités. Compris : deux allers-retours de corrections et les fichiers prêts pour l'imprimeur. Reportage photo : à partir de la formule Régulier.</p>`, { court: 'Le catalogue, suite' });

const SUJET = [['affiche', 1, 'Affiche'], ['gabarit', 3, 'déclinaisons : réseaux, écran, A3'], ['agenda', 1, 'Événement à l\'agenda du site'], ['actu', 1, 'Actualité sur le site'], ['post', 2, 'publications'], ['story', 1, 'Story le jour J'], ['presse', 1, 'Communiqué de presse'], ['annonce', 1, 'Annonce dans les agendas des médias']];
page('sujet', 'Un sujet, <i>plusieurs supports</i>', 'Vous indiquez un sujet. Votre espace propose aussitôt les supports qui peuvent le porter, avec leur coût. Vous gardez ceux que vous voulez.', `
<div class="g" style="grid-template-columns:86rem 1fr;align-items:center">
  <div class="c lv">${fil()}<p class="mu">Votre demande</p><h2 style="margin-top:1.6rem">Fête communale du 14 juin</h2><p class="pt" style="margin-top:2.4rem">Une date, un lieu, le programme. Le reste part de là.</p><p class="tot" style="margin-top:4rem"><b>${SUJET.reduce((t, [id, q]) => t + U[id] * q, 0)} unités</b></p></div>
  <div class="c"><div class="pt">${lignes(SUJET.map(([id, q, nom]) => [`${q > 1 ? q + ' ' : ''}${nom}`, `${U[id] * q} u.`]))}</div></div>
</div>`);

const carteFormule = (f, cls = '') => `<div class="c ${cls}">${cls ? fil() : ''}<h2>${f.nom}</h2><p class="nb" style="margin-top:3rem">${eur(f.prix)}<small>par mois</small></p><p style="margin-top:2.4rem"><b>${f.unites} unités par mois</b></p><p class="pt mu" style="margin-top:1rem">${f.pour}</p><div style="margin-top:3rem" class="pt">${lignes([['Demandes courantes', f.delai], ['Créations', `${f.creation_j} jours ouvrés`], ['Urgences', f.urgences], ['Suivi', f.suivi]])}</div></div>`;
page('formules', 'Les trois formules <i>et leurs prix</i>', '', `
<div class="g g3">${carteFormule(F.essentiel)}${carteFormule(F.regulier, 'lv')}${carteFormule(F.soutenu)}</div>
<p class="note">Les mêmes prix pour une commune et pour une entreprise. Une seule mensualité. Au-delà du forfait : ${eur(O.unite_sup)} l'unité, seulement après votre accord écrit. TVA non applicable, art. 293 B du CGI.</p>`);

page('relais', 'Relais, <i>pour une absence</i>', 'Recrutement en cours, départ, congé, arrêt, été : Relais tient la communication à distance, puis prépare la passation.', `
<div class="g" style="grid-template-columns:82rem 1fr 1fr">
  <div class="c pl">${fil()}<p class="nb">${eur(R.prix_semaine)}<small>par semaine</small></p><p class="pt" style="margin-top:1rem">Dès ${R.semaines_min} semaines, ${R.unites_semaine} unités par semaine.</p><p class="nb" style="margin-top:5rem">${eur(R.prix_mois)}<small>par mois</small></p><p class="pt" style="margin-top:1rem">Dès un mois, ${R.unites_mois} unités par mois.</p></div>
  <div class="c"><h3>Ce qui est prévu</h3><div class="pt" style="margin-top:2rem">${lignes([['Démarrage', 'opérationnel sous 24 h après l\'accord'], ['Durée', '2 semaines à 6 mois, prolongeable'], ['Demandes courantes', '1 jour ouvré'], ['Créations', `${R.creation_j} jours ouvrés`], ['Urgences', 'sans majoration'], ['Point de suivi', 'chaque semaine'], ['Au retour', 'passation et dossier de restitution']])}</div></div>
  <div class="c"><h3>Ce qu'il faut préparer</h3>${liste(['Un bon de commande ou un devis signé', 'Une seule personne qui valide, joignable', 'Les accès aux outils : site, réseaux, newsletter'], 'pt')}</div>
</div>
<p class="note">Relais se prolonge par semaine ou par mois. Si la personne revient plus tôt, il s'arrête à la fin de la semaine en cours, après la passation.</p>`);

page('delais', 'Les formules, <i>côte à côte</i>', '', `
<div class="c"><table class="del">
  <tr><th></th><th>Essentiel</th><th>Régulier</th><th>Soutenu</th><th>Relais</th></tr>
  <tr><td>Prix</td><td>${eur(F.essentiel.prix)} par mois</td><td>${eur(F.regulier.prix)} par mois</td><td>${eur(F.soutenu.prix)} par mois</td><td>${eur(R.prix_mois)} par mois<small>ou ${eur(R.prix_semaine)} par semaine</small></td></tr>
  <tr><td>Unités</td><td>${F.essentiel.unites} par mois</td><td>${F.regulier.unites} par mois</td><td>${F.soutenu.unites} par mois</td><td>${R.unites_mois} par mois<small>ou ${R.unites_semaine} par semaine</small></td></tr>
  <tr><td>Confirmation d'une demande</td><td colspan="4">Sous 24 h ouvrées</td></tr>
  <tr><td>Demandes courantes</td><td>${F.essentiel.delai}</td><td>${F.regulier.delai}</td><td>${F.soutenu.delai}</td><td>1 jour ouvré</td></tr>
  <tr><td>Créations</td><td>${F.essentiel.creation_j} jours ouvrés</td><td>${F.regulier.creation_j} jours ouvrés</td><td>${F.soutenu.creation_j} jours ouvrés</td><td>${R.creation_j} jours ouvrés</td></tr>
  <tr><td>Urgences</td><td>+${O.urgence_unites} unité</td><td>+${O.urgence_unites} unité</td><td>${F.soutenu.urgences_incluses} par mois incluses</td><td>Sans majoration</td></tr>
  <tr><td>Reportage photo</td><td>Non</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
  <tr><td>Point de suivi</td><td>Chaque trimestre</td><td>Chaque mois</td><td>Tous les 15 jours</td><td>Chaque semaine</td></tr>
  <tr><td>Engagement</td><td colspan="3">1<sup>er</sup> mois libre, puis ${O.engagement_mois} mois</td><td>Durée de l'absence</td></tr>
  <tr><td>Corrections</td><td colspan="4">Deux allers-retours par livrable</td></tr>
</table></div>
<p class="note">Créations : ${O.delais.creation_liste}. Bulletin et reportage photo : dates fixées ensemble. Vos demandes se déposent à tout moment, toute l'année ; les délais se comptent en jours ouvrés, du lundi au vendredi.</p>`);

page('engagement', 'L\'engagement <i>et le règlement</i>', '', `
<div class="frise">
  <div class="f1"><b>1<sup>er</sup> mois</b><span>Sans engagement. Vous arrêtez à son terme par simple courriel.</span></div>
  <div class="f2"><b>Mois 2 à ${O.engagement_mois}</b><span>${O.engagement_mois} mois minimum, comptés depuis le premier.</span></div>
  <div class="f3"><b>Ensuite</b><span>De mois en mois, avec un mois de préavis.</span></div>
</div>
<div class="g g2">
  <div class="c"><h3>Pour une collectivité</h3>${liste(['Sur bon de commande, prérempli dans votre espace', 'Facture mensuelle à terme échu, sur Chorus Pro, payée à 30 jours', `Pas de mise en concurrence obligatoire sous 60 000 € HT sur la durée du besoin. Sur deux ans : ${eur(F.essentiel.prix * 24)}, ${eur(F.regulier.prix * 24)} ou ${eur(F.soutenu.prix * 24)} selon la formule`], 'pt')}</div>
  <div class="c"><h3>Pour une entreprise</h3>${liste(['Réglé chaque mois à l\'avance, par virement permanent ou par carte en ligne', 'Aucun prélèvement n\'est effectué', 'Les unités de la période sont créditées une fois la mensualité réglée'], 'pt')}</div>
</div>`);

duo('estimer', 'Estimer <i>votre besoin</i>', 'Sur fill.studioes.fr, en accès libre : sans compte, sans engagement, sans rendez-vous.', [
  ['Votre structure', 'Commune, intercommunalité, entreprise, association : cinq questions sur vos canaux et votre rythme.'],
  ['Votre mois', 'Un mois type est proposé. Vous ajoutez ou retirez des supports, le total en unités suit.'],
  ['Votre proposition', 'La formule adaptée, son prix, et ce qu\'elle couvre de votre besoin.'],
], cap('site-diagnostic', 'Le diagnostic : fill.studioes.fr/diagnostic') + cap('site-simulateur', 'Le simulateur : fill.studioes.fr/simulateur'));

solo('anticiper', 'Anticiper <i>votre année</i>', 'Le calendrier public simule vos trimestres, temps fort par temps fort.', [
  ['Vos temps forts', 'Vœux, budget, fête locale, rentrée, fin d\'année : vous cochez ceux qui vous concernent et ajoutez les vôtres.'],
  ['Mois par mois', 'Chaque mois affiche les unités nécessaires, le report du mois précédent et ce qui dépasserait le forfait.'],
  ['La bonne formule', 'Vous voyez quelle formule tient votre année, et quels mois demandent d\'anticiper.'],
], cap('site-calendrier', 'Le calendrier : fill.studioes.fr/calendrier'), `<div class="savoir" style="margin-top:4rem"><b>Dans votre espace aussi</b>Une fois client, la rubrique Calendrier reprend vos parutions prévues et les temps forts à venir.</div>`);

// ------------------------------------------------ 3. démarrer
ouvrir('demarrer', 'Démarrer');

page('etapes', 'Les étapes <i>du démarrage</i>', 'Votre service est opérationnel sous 24 h après votre accord.', `
<ol class="fil-e" style="grid-template-columns:repeat(4,1fr)">
  <li><b>Échange de 30 minutes</b>Votre situation, vos canaux, votre volume. Rien à préparer.<small>Jour 1</small></li>
  <li><b>Proposition écrite</b>Formule, mois type, prix et dates : de quoi signer ou établir un bon de commande.<small>Sous 48 h ouvrées</small></li>
  <li><b>Accord et mise en route</b>Vous ouvrez votre espace, indiquez vos accès et envoyez votre logo.<small>Opérationnel sous 24 h</small></li>
  <li><b>Premier mois</b>Les demandes circulent. Un point fait le bilan en fin de mois.<small>Dès la première demande</small></li>
</ol>
<p class="note">Vous pouvez aussi ouvrir votre espace directement, sans rendez-vous : Fill vous appelle sous 24 h ouvrées.</p>`);

solo('ouvrir', 'Ouvrir <i>votre espace</i>', 'Trois minutes, sans paiement à l\'ouverture, sans rien installer.', [
  ['Vous', 'Votre nom, votre adresse e-mail professionnelle et un mot de passe. Vous devenez le référent.'],
  ['Votre structure', 'Collectivité ou entreprise, son nom et son SIRET.'],
  ['Votre formule', 'Essentiel, Régulier ou Soutenu. Le prix reste affiché à droite.'],
  ['Récapitulatif', 'Vous acceptez les conditions, puis vous confirmez votre adresse par le lien reçu.'],
], cap('ouverture-2', 'Étape 2 sur 4 : collectivité ou entreprise.'));

solo('crediter', 'Créditer <i>vos premières unités</i>', 'Une demande ne part que si les unités nécessaires sont sur le compte.', [], cap('ouverture-4', 'Le récapitulatif rappelle l\'abonnement et le mode de règlement.'), `
<div class="c lv">${fil()}<h3>Collectivité</h3>${liste(['Le bon de commande prérempli vous attend dans l\'espace', 'Signé, vous le déposez ou vous indiquez son numéro d\'engagement', 'Fill le vérifie et crédite les unités dans la journée ouvrée'], 'fin pt')}</div>
<div class="c co" style="margin-top:3.4rem">${fil()}<h3>Entreprise</h3>${liste(['Par carte, depuis votre espace : unités créditées aussitôt', 'Ou par virement permanent : créditées à réception'], 'fin pt')}</div>`);

solo('comptes', 'Donner accès <i>à vos canaux</i>', 'Pour que Fill publie lui-même à la date prévue. Vous invitez contact@studioes.fr dans chaque outil, sans jamais transmettre de mot de passe.', [
  ['Facebook et Instagram', 'Dans Meta Business Suite : Paramètres, puis Personnes. Vous invitez l\'adresse et lui attribuez votre Page en accès partiel.'],
  ['LinkedIn', 'Sur votre Page : Préférences, puis Gérer les administrateurs. Rôle « Administrateur de contenu ».'],
  ['Fiche Google', 'Depuis votre fiche d\'établissement, le propriétaire ajoute l\'adresse avec le rôle « Administrateur ».'],
  ['Site et lettre d\'information', 'Vous créez un compte utilisateur au nom de Fill, avec un rôle de rédaction.'],
], cap('comptes', 'Le menu « Vos comptes » : l\'état de chaque canal.'), `<div class="savoir" style="margin-top:4rem"><b>Vous gardez la main</b>Fill n'est jamais l'unique administrateur d'un de vos outils. Sans accès, les fichiers vous sont remis et vous publiez.</div>`);

duo('equipe', 'Inviter <i>votre équipe</i>', 'Jusqu\'à 25 personnes par espace, sans surcoût. Chacun dépose ses demandes avec son propre accès.', [
  ['Référent', 'Valide les livrables et les coûts, commande les unités, gère l\'équipe.'],
  ['Contributeur', 'Dépose et relit, dans la limite d\'un plafond mensuel d\'unités. Au-delà, le référent donne son accord.'],
  ['Lecture seule', 'Suit les demandes et les livrables, sans déposer.'],
], cap('equipe', 'Les membres, leur rôle et le plafond de chaque contributeur.') + cap('equipe-inviter', 'L\'invitation : un nom, une adresse, un rôle.'));

// ------------------------------------------------ 4. au quotidien
ouvrir('quotidien', 'Utiliser Fill au quotidien');

solo('accueil', 'Se repérer <i>dans l\'espace</i>', 'L\'accueil réunit ce qui attend une réponse de votre part, ce qui est en cours et le solde d\'unités.', [
  ['À faire de votre côté', 'Toujours en tête : les versions à relire, les coûts à valider, les éléments attendus.'],
  ['En cours', 'Chaque demande, avec son état et sa date de livraison.'],
  ['Unités, parutions, à anticiper', 'Le solde de la période, les prochaines parutions et les temps forts à préparer.'],
], cap('accueil', 'L\'accueil d\'une commune, en démonstration.'));

page('rubriques', 'Les rubriques <i>de votre espace</i>', '', `
<div class="g g4 serre">
  <div class="c"><h3>Accueil</h3><p class="pt mu">Ce qui attend une réponse de votre part, ce qui est en cours, votre solde.</p></div>
  <div class="c"><h3>Demandes</h3><p class="pt mu">Toutes vos demandes, avec l'état et la date de chacune.</p></div>
  <div class="c lv"><h3>Nouvelle demande</h3><p class="pt">Le sujet, les supports, la date. Le coût s'affiche avant l'envoi.</p></div>
  <div class="c lv"><h3>Calendrier</h3><p class="pt">Vos parutions prévues et les temps forts à venir, pour demander à temps et répartir vos unités.</p></div>
  <div class="c"><h3>Unités</h3><p class="pt mu">Le solde de la période, le relevé de chaque mouvement, la commande d'unités.</p></div>
  <div class="c"><h3>Équipe</h3><p class="pt mu">Les membres, leur rôle, leur plafond, et le réglage de vos mails.</p></div>
  <div class="c"><h3>Vos comptes</h3><p class="pt mu">L'état des accès à vos canaux : donné, à donner, non utilisé.</p></div>
  <div class="c"><h3>Bilan</h3><p class="pt mu">Chaque mois, par lien : ce qui a été livré et trois suggestions pour la suite.</p></div>
</div>`);

page('deux-demander', 'Deux façons <i>de demander</i>', 'Vous choisissez l\'une ou l\'autre pour chaque sujet. Le résultat est le même.', `
<div class="g g2">
  <div class="c lv">${fil()}<h2>Dans votre espace</h2>${liste(['Vous remplissez le formulaire : le sujet, les supports, la date', 'Le coût en unités s\'affiche avant l\'envoi', 'Adapté à une demande à plusieurs supports'], 'pt')}</div>
  <div class="c">${fil()}<h2>Par mail</h2>${liste(['Vous écrivez à votre adresse de transfert, ou vous y transférez une information reçue', 'Une demande simple est déposée directement, sinon un lien ouvre la demande déjà remplie', 'Adapté à une information à relayer vite'], 'pt')}</div>
</div>
<p class="note">Dans les deux cas, vous êtes averti par mail à chaque étape : demande reçue, confirmée, à relire, publiée ou livrée.</p>`);

duo('demande', 'Déposer <i>une demande</i>', 'Une demande, un seul sujet. Toutes ses déclinaisons y entrent : l\'affiche, les publications, l\'article.', [
  ['Le sujet', 'Un titre, ce qu\'il faut savoir, vos pièces jointes.'],
  ['Les supports', 'Vous cochez les supports voulus. Le total en unités se calcule à chaque choix.'],
  ['La date', 'La date de parution souhaitée. Urgent : délai divisé par deux, une unité de plus.'],
  ['L\'envoi', 'Le récapitulatif montre le coût et les dates. Un mail « Demande reçue » confirme le dépôt.'],
], cap('nouvelle-sujet', 'Le sujet : vous donnez l\'information, Fill rédige.') + cap('nouvelle-supports', 'Les supports : chacun affiche son coût.'));

solo('mail', 'Demander <i>par mail</i>', 'Chaque structure reçoit une adresse de transfert à son nom. Vous y écrivez, ou vous y transférez une information reçue.', [
  ['Depuis l\'adresse de votre compte', 'L\'adresse de transfert figure dans le mail de bienvenue.'],
  ['Une demande simple est déposée directement', 'Si votre consigne nomme une publication, une actualité ou un événement à l\'agenda.'],
  ['Sinon, vous recevez un lien', 'Il ouvre la demande déjà remplie : le total s\'affiche, vous envoyez.'],
], `<div class="mail"><div class="en"><span>De</span><b>Yann Le Gall, mairie de Saint-Ivenec</b><span>À</span><b class="ad">commune-de-saint-ivenec@demandes.studioes.fr</b><span>Objet</span><b>TR : Marché de Noël du 12 décembre</b></div>
<div class="co"><p>Bonjour,</p><p>Pouvez-vous publier cette information sur Facebook et sur le site internet ? À paraître avant le 5 décembre si possible.</p><p>Merci d'avance,<br>Yann Le Gall</p><div class="tr">De : Comité des fêtes<br>Le marché de Noël aura lieu le samedi 12 décembre, de 10 h à 19 h, place de l'Église…</div><span class="pj">affiche-marche-noel.pdf</span></div></div><p class="leg">Exemple de mail transféré, données fictives.</p>`);

duo('traitement', 'Ce que fait Fill <i>de votre demande</i>', 'Chaque demande suit le même fil, visible sur sa fiche : déposée, confirmée, en production, à valider, publiée ou livrée.', [
  ['La confirmation', 'Au plus tard le jour ouvré suivant : coût en unités et date de livraison. Les unités sont réservées.'],
  ['La production', 'Fill prépare un premier jet, le relit et le corrige, puis réalise les visuels et la mise en page.'],
  ['Un livrable par support', 'La version ne part que lorsque tous les livrables sont prêts.'],
], cap('fiche-deposee', 'La fiche de la demande et son fil d\'état.') + cap('demandes', 'La liste de vos demandes, avec l\'état de chacune.'));

page('deux-valider', 'Deux façons <i>de valider</i>', 'À la livraison, vous recevez un mail « À relire ». Vous répondez dans votre espace ou sur le lien du mail, au choix.', `
<div class="g g2">
  <div class="c lv">${fil()}<h2>Dans votre espace</h2>${liste(['Vous ouvrez la demande et chaque livrable', 'Vous validez, ou vous demandez une correction', 'Tout l\'historique reste sur la fiche'], 'pt')}</div>
  <div class="c">${fil()}<h2>Par le lien du mail</h2>${liste(['Le lien ouvre une page de relecture, sans mot de passe', 'Vous validez, ou vous demandez une correction', 'Vous pouvez le transmettre à un élu ou à un associé'], 'pt')}</div>
</div>
<p class="note">Un seul circuit : une validation faite par lien met à jour votre espace. Ensuite, ce qui va en ligne est publié par Fill ; ce qui s'imprime vous est livré en fichiers.</p>`);

duo('relire', 'Relire, valider, <i>faire corriger</i>', 'À la livraison, vous recevez un mail « À relire ». Les unités sont décomptées à cette première version.', [
  ['Vous ouvrez chaque livrable', 'Texte, visuel, mise en page : chaque contenu se lit en entier.'],
  ['Vous validez', 'Ce qui va en ligne est publié par Fill à la date prévue. Ce qui s\'imprime vous est livré en fichiers.'],
  ['Ou vous demandez une correction', 'Deux allers-retours sont compris par livrable. Au-delà, une unité, avec votre accord.'],
], cap('fiche-relire-2', 'La version à relire et ses livrables.') + cap('fiche-correction', 'La demande de correction : un point par ligne.'));

solo('lien', 'Valider par lien, <i>sans compte</i>', 'Le mail « À relire » contient un lien personnel. Il ouvre une page de relecture, sans mot de passe.', [
  ['Une réponse par contenu', '« D\'accord » ou « À corriger », avec votre remarque.'],
  ['Tout valider', 'Un seul bouton quand tout convient.'],
  ['Faire relire quelqu\'un d\'autre', 'Un élu, un associé reçoit le même lien : pour avis, ou pour valider à votre place.'],
], cap('relecture', 'La page de relecture, ouverte depuis le mail.'), `<div class="savoir" style="margin-top:4rem"><b>Un seul circuit</b>Une validation faite par lien met à jour l'espace. Le lien reste valable 7 jours.</div>`);

duo('unites-suivi', 'Suivre et commander <i>des unités</i>', 'La page Unités donne le solde de la période et le relevé de chaque mouvement.', [
  ['Le solde', 'Disponibles, réservées, décomptées, en attente de confirmation.'],
  ['Commander', `5, 10, 20 unités ou plus, à ${eur(O.unite_sup)} l'unité. Seul le référent peut commander.`],
  ['Régler', 'Collectivité : bon de commande prérempli. Entreprise : par carte, unités créditées aussitôt.'],
], cap('unites', 'Le solde de la période et sa composition.') + cap('unites-commande-2', 'La commande d\'unités supplémentaires.'));

page('mails', 'Les mails <i>que vous recevez</i>', 'Vous êtes averti à chaque étape. Les mails qui attendent une réponse sont toujours envoyés ; les autres se coupent dans « Vos e-mails », page Équipe.', `
<div class="c"><table class="del mel">
  <tr><th>Étape</th><th>Le mail que vous recevez</th><th>Ce qu'il contient</th><th>Peut être coupé</th></tr>
  <tr><td>Dépôt</td><td>Demande reçue</td><td>L'accusé de réception</td><td>Oui</td></tr>
  <tr><td>Confirmation</td><td>Demande confirmée</td><td>Le coût en unités et la date de livraison</td><td>Oui</td></tr>
  <tr><td>Production</td><td>Un élément est attendu, ou message de Fill</td><td>Une information ou un fichier manquant, une question</td><td>Non</td></tr>
  <tr><td>Accord</td><td>Votre accord est demandé</td><td>Un coût à valider</td><td>Non</td></tr>
  <tr><td>Livraison</td><td>À relire</td><td>La version livrée et le lien de relecture</td><td>Non</td></tr>
  <tr><td>Fin</td><td>C'est publié, ou fichiers livrés</td><td>Le lien de la publication, ou les fichiers prêts à imprimer</td><td>Oui</td></tr>
</table></div>
<p class="note">Sans réponse après deux jours ouvrés sur une version à valider, une relance vous est envoyée. Une seule par étape.</p>`);

duo('bilan', 'Lire <i>le bilan mensuel</i>', 'À la fin de chaque période, le référent reçoit un lien vers le bilan du mois. La page se lit sans compte.', [
  ['Le mois en chiffres', 'Demandes livrées, unités utilisées, livraisons à la date annoncée.'],
  ['Vos unités', 'Utilisées, reportées, et la date limite d\'usage du report.'],
  ['La période qui commence', 'Trois suggestions. « Lancer » ouvre la demande déjà préparée.'],
], cap('bilan', 'Les chiffres de la période et le calendrier.') + cap('bilan-suite', 'Les suggestions pour la période suivante.'));

page('abonnement', 'Gérer <i>votre abonnement</i>', 'Tout se fait par simple courriel, ou lors du point de suivi.', `
<div class="g g4 serre">
  <div class="c"><h3>Changer de formule</h3><p class="pt mu">Vers le haut : dès la période suivante. Vers le bas : à la fin de la période d'engagement.</p></div>
  <div class="c"><h3>Facturation</h3><p class="pt mu">Collectivité : chaque fin de période, sur Chorus Pro. Entreprise : facture et lien de paiement à chaque échéance.</p></div>
  <div class="c lv"><h3>Résilier</h3><p class="pt">Au terme du premier mois, ou après ${O.engagement_mois} mois avec un mois de préavis.</p></div>
  <div class="c lv"><h3>Fin du contrat</h3><p class="pt">Un dossier de restitution : accès, fichiers, gabarits. Une heure de passation si quelqu'un prend la suite.</p></div>
</div>`);

// ------------------------------------------------ 5. questions
ouvrir('questions-p', 'Vos questions');

const qr = (l) => `<div class="qr">${l.map(([q, r]) => `<div><h3>${q}</h3><p>${r}</p></div>`).join('')}</div>`;
page('questions', 'Dix questions <i>fréquentes</i>', '', qr([
  ['Fill remplace-t-il un agent ?', 'Il remplace la production : ce qui doit sortir chaque semaine sort. Pas la présence sur place, les réunions internes, ni la parole des élus ou de la direction.'],
  ['Faut-il fournir les textes et les photos ?', 'Vous fournissez l\'information, sous la forme qui vous arrange. Rédaction, mise en forme et visuels sont faits par Fill.'],
  ['Travaillez-vous partout en France ?', 'Oui pour tout ce qui se fait à distance. Les reportages photo se font en Bretagne, dans un rayon de 40 km ; au-delà, sur devis.'],
  ['Que se passe-t-il en cas d\'urgence ?', `Le délai est divisé par deux, soit 24 h ouvrées pour une publication, et la demande compte ${O.urgence_unites} unité de plus.`],
  ['Peut-on demander à tout moment ?', 'Oui. Les demandes se déposent quand vous voulez, toute l\'année, sans période de fermeture. Chacune est confirmée sous 24 h ouvrées.'],
  ['Que deviennent les unités non utilisées ?', 'Elles sont reportées une fois, sur le mois suivant, et consommées en premier.'],
  ['Et si le forfait ne suffit pas un mois ?', `Rien n'est produit au-delà sans votre accord écrit. L'unité supplémentaire coûte ${eur(O.unite_sup)}.`],
  ['Peut-on commencer par le bulletin seulement ?', `Un numéro de 12 pages vaut ${12 * U.bulletin} unités, le mois de sa sortie. Il tient dans Régulier (${F.regulier.unites} unités).`],
  ['Faut-il une mise en concurrence ?', `Pas en dessous de 60 000 € HT sur toute la durée du besoin. Votre service des marchés valide la procédure.`],
  ['Et en période électorale ?', 'Les contenus informent sur l\'action publique, sans valoriser une équipe ni une personne. Les doutes vous sont signalés avant parution.'],
]));

page('garanties', 'Les <i>garanties</i>', '', `
<div class="g g4 serre">
  <div class="c pl">${fil()}<p class="nb">24 h</p><p class="pt" style="margin-top:1.6rem">ouvrées pour confirmer une demande, avec son coût et sa date.</p></div>
  <div class="c pl">${fil()}<p class="nb">1 à 2 j</p><p class="pt" style="margin-top:1.6rem">ouvrés pour une demande courante, selon la formule.</p></div>
  <div class="c pl">${fil()}<p class="nb">2</p><p class="pt" style="margin-top:1.6rem">allers-retours de corrections compris par livrable.</p></div>
  <div class="c pl">${fil()}<p class="nb">1<sup>er</sup> mois</p><p class="pt" style="margin-top:1.6rem">sans engagement.</p></div>
</div>
<div class="g g3 serre" style="margin-top:3.4rem">
  <div class="c"><h3>Rien n'est publié sans votre accord</h3></div>
  <div class="c"><h3>Aucun coût sans votre accord</h3></div>
  <div class="c"><h3>Vos fichiers vous appartiennent</h3></div>
  <div class="c"><h3>Vos accès restent retirables</h3></div>
  <div class="c"><h3>Un seul interlocuteur</h3></div>
  <div class="c"><h3>Une sortie préparée</h3></div>
</div>`, { court: 'Les garanties' });

page('commencer', 'Pour <i>commencer</i>', '', `
<div class="g g3">
  <div class="c"><h3>Échanger 30 minutes</h3><p class="pt mu">En visio ou par téléphone. Votre situation, vos canaux, votre volume. Rien à préparer.</p><p class="pt" style="margin-top:2.4rem"><b>${S.cal_url.replace('https://', '')}</b></p></div>
  <div class="c lv">${fil()}<h3>Ouvrir votre espace</h3><p class="pt">Trois minutes, sans paiement à l'ouverture. Votre service est opérationnel sous 24 h après votre accord.</p><p class="pt" style="margin-top:2.4rem"><b>fill.studioes.fr/espace</b></p></div>
  <div class="c"><h3>Écrire ou appeler</h3><p class="pt mu">Une question, un besoin précis, un bon de commande à préparer.</p><p class="pt" style="margin-top:2.4rem"><b>${S.email}</b><br><b>${S.telephone}</b></p></div>
</div>`, { court: 'Pour commencer' });

pages.push({ id: 'dos', type: 'nu', corps: `
<div class="logo">${logo(false)}</div>
<p class="coord"><b>fill.studioes.fr</b>${S.email} · ${S.telephone}<br>Rendez-vous : ${S.cal_url.replace('https://', '')}</p>
<p class="legal">Fill est un service de ${S.maison}, Ewen Soupault, entrepreneur individuel, SIRET ${S.siret}. TVA non applicable, art. 293 B du CGI.<br>Les écrans présentés sont ceux de la démonstration : toutes les données sont fictives.</p>`, cls: 'dos', motif: 'dos', nu: true });

// ---------------------------------------------------------------- assemblage
const folio = (id) => pages.findIndex((p) => p.id === id) + 1;
const PARTIES = pages.filter((p) => p.type === 'ouv').map((o) => ({ ...o, items: pages.filter((p) => p.type === 'page' && p.partie === o.n) }));
const sommaire = `<h1 class="t">Sommaire</h1><div class="mil"><div class="somm">${PARTIES.map((p) => `<div><a class="tp" href="#${p.id}"><b>${p.n}</b><h2>${p.titre}</h2></a><ul>${p.items.map((x) => `<li><a href="#${x.id}"><span>${x.court}</span><span>${folio(x.id)}</span></a></li>`).join('')}</ul></div>`).join('')}</div></div>`;

const rendre = (p, i) => {
  let corps;
  if (p.type === 'ouv') corps = `<p class="num">${p.n}</p><h1>${p.titre}</h1>`;
  else if (p.type === 'sommaire') corps = sommaire;
  else if (p.type === 'nu') corps = p.corps;
  else corps = `<h1 class="t">${p.titre}</h1>${p.chapo ? `<p class="chapo">${p.chapo}</p>` : ''}<div class="mil">${p.corps}</div>`;
  const pied = p.nu ? '' : `<div class="pied ${(i + 1) % 2 ? 'imp' : 'pair'}"><b>${i + 1}</b><span>Fill · Dossier de présentation</span></div>`;
  return `<section class="page ${p.cls}" id="${p.id}" aria-label="Page ${i + 1}"><div class="fond">${MOTIFS[p.motif]}</div><div class="corps">${corps}${pied}</div></section>`.replace(/@@FOLIO-([\w-]+)@@/g, (_, id) => folio(id));
};

const DESC = 'Le dossier complet de présentation de Fill : pour qui, le principe des unités, les formules et leurs prix, puis chaque étape de l’espace client, de l’ouverture du compte au bilan mensuel.';
const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Dossier de présentation · Fill</title>
<meta name="description" content="${DESC}">
<link rel="canonical" href="${S.domaine}/dossier/">
<meta name="theme-color" content="#F8F5F2">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Fill">
<meta property="og:url" content="${S.domaine}/dossier/">
<meta property="og:title" content="Dossier de présentation · Fill">
<meta property="og:description" content="${DESC}">
<meta property="og:image" content="${S.domaine}/assets/og.png">
<meta property="og:image:alt" content="Logo Fill et accroche « Votre communication, sans perdre le fil. »">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="../assets/f/br.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../assets/f/it.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="dossier.css?v=5">
</head>
<body>
<a class="saut" href="#fill">Aller au contenu</a>
<header class="barre">
  <a class="lg" href="../" aria-label="Fill, retour à l’accueil">${logo(false)}</a>
  <span class="ti">Dossier de présentation</span>
  <a class="bt s2" href="#sommaire">Sommaire</a>
  <a class="bt s2" href="../contact/">Prendre rendez-vous</a>
  <a class="bt pl" href="../assets/pj/fill-dossier-de-presentation.pdf" download>Télécharger le PDF</a>
</header>
<p class="aide">Ce dossier est au format paysage : tournez votre écran, ou téléchargez le PDF pour le lire plus confortablement.</p>
<main class="doc">
${typo(pages.map(rendre).join('\n'))}
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(RACINE, 'dossier', 'index.html'), html);
console.log(`dossier/index.html : ${pages.length} pages, ${(html.length / 1024).toFixed(0)} Ko`);
if (/[—–]/.test(html)) console.error('Attention : tiret long ou demi-cadratin dans le texte.');

// ---------------------------------------------------------------- PDF
if (process.argv.includes('--pdf')) {
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright');
  const { servir } = await import('./dossier-captures.mjs');
  const { s, base } = await servir();
  const nav = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  const sortie = async (fichier, { imprimeur }) => {
    const p = await (await nav.newContext({ viewport: { width: 1400, height: 990 } })).newPage();
    await p.goto(`${base}/dossier/`);
    await p.evaluate((imp) => {
      document.documentElement.classList.add('pdf');
      if (imp) {
        document.documentElement.classList.add('imp');
        for (const pg of document.querySelectorAll('.page')) for (const c of ['hg', 'hd', 'bg', 'bd']) { const i = document.createElement('i'); i.className = `tc ${c}`; pg.appendChild(i); }
      }
      for (const im of document.querySelectorAll('img')) { im.loading = 'eager'; im.removeAttribute('srcset'); im.removeAttribute('sizes'); if (!imp) im.src = im.getAttribute('src').replace('captures/', 'captures/l/').replace('img/', 'img/l/'); }
    }, imprimeur);
    await p.addStyleTag({ content: `@page{size:${imprimeur ? '317mm 230mm' : '297mm 210mm'};margin:0}` });
    await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
    // contrôle : aucun contenu ne dépasse de sa page
    const debords = await p.evaluate(() => [...document.querySelectorAll('.page')].flatMap((pg) => {
      const c = pg.querySelector('.corps'), pied = pg.querySelector('.pied'), r = c.getBoundingClientRect(), cs = getComputedStyle(c);
      const bas = pied ? pied.getBoundingClientRect().top : r.bottom - parseFloat(cs.paddingBottom), droite = r.right - parseFloat(cs.paddingRight);
      const pb = [];
      for (const e of c.querySelectorAll('*')) {
        if (e.closest('svg') || e.closest('.pied')) continue;
        const b = e.getBoundingClientRect();
        if (!b.width || !b.height) continue;
        if (b.bottom > bas + 1.5 || b.right > droite + 1.5) { pb.push(`${pg.id} : ${e.tagName.toLowerCase()}.${e.className || ''} dépasse (${Math.round(b.bottom - bas)} / ${Math.round(b.right - droite)})`); break; }
        const carte = e.closest('.c');
        if (carte && carte !== e && b.bottom > carte.getBoundingClientRect().bottom + 1) { pb.push(`${pg.id} : carte rognée (${Math.round(b.bottom - carte.getBoundingClientRect().bottom)})`); break; }
      }
      return pb;
    }));
    if (debords.length) console.error(`Contenu qui dépasse :\n  ${debords.join('\n  ')}`);
    const f = path.join(RACINE, 'assets', 'pj', fichier);
    await p.pdf({ path: f, printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, tagged: !imprimeur, outline: false });
    console.log(`${fichier} : ${(fs.statSync(f).size / 1048576).toFixed(2)} Mo`);
  };
  await sortie('fill-dossier-de-presentation.pdf', { imprimeur: false });
  await sortie('fill-dossier-imprimeur.pdf', { imprimeur: true });
  await nav.close(); s.close();
}
