// Mails d'exemple, au format remis par le webhook « inbound » de Brevo (un élément de « items »).
// Noms, adresses et contenus sont fictifs. Utilisés par reception.test.mjs.
const DOMAINE = 'demandes.studioes.fr';
export const ADRESSE = `commune-de-saint-ivenec@${DOMAINE}`;

// preuve d'origine telle que l'inscrit un serveur de réception : signature DKIM et DMARC alignés sur le domaine
export const PREUVE = (domaine) => `mx.reception.example; dkim=pass header.d=${domaine} header.s=s1; spf=pass smtp.mailfrom=${domaine}; dmarc=pass (p=quarantine) header.from=${domaine}`;

let n = 0;
const base = (c = {}) => ({
  Uuid: [`uuid-${++n}`],
  MessageId: `<exemple-${n}@mail.saint-ivenec.example>`,
  InReplyTo: null,
  From: { Name: 'Yann Le Gall', Address: 'yann.legall@saint-ivenec.example' },
  To: [{ Name: null, Address: ADRESSE }],
  Recipients: [ADRESSE],
  Cc: [],
  ReplyTo: null,
  SentAtDate: 'Wed, 11 Nov 2026 09:12:44 +0100',
  Subject: '',
  RawHtmlBody: null,
  RawTextBody: '',
  ExtractedMarkdownMessage: '',
  ExtractedMarkdownSignature: null,
  SpamScore: 0.4,
  Attachments: [],
  Headers: { 'Message-ID': `<exemple-${n}@mail.saint-ivenec.example>`, 'MIME-Version': '1.0', Received: ['from a by b', 'from c by d'], 'Authentication-Results': PREUVE('saint-ivenec.example') },
  ...c,
});

// 1. Transfert depuis Outlook : consigne du référent, signature, puis le mail d'une association avec son fil cité
export const transfertOutlook = () => base({
  Subject: 'TR: Marché de Noël du 12 décembre',
  RawTextBody: [
    'Bonjour,', '',
    'Pouvez-vous publier cette information sur Facebook et sur le site internet ? À paraître avant le 5 décembre si possible.', '',
    "Merci d'avance,", '',
    'Yann Le Gall', 'Secrétaire général', 'Mairie de Saint-Ivenec', '02 98 00 00 00',
    'Suivez la commune sur Facebook et retrouvez toutes les actualités sur notre site internet', '',
    '________________________________',
    'De : Comité des fêtes <comite@fetes-saint-ivenec.example>',
    'Envoyé : lundi 9 novembre 2026 18:42',
    'À : Mairie de Saint-Ivenec <mairie@saint-ivenec.example>',
    'Objet : Marché de Noël du 12 décembre', '',
    'Bonjour,', '',
    "Le comité des fêtes organise son marché de Noël le samedi 12 décembre, de 10 h à 18 h, place de l'Église.",
    'Trente exposants, vin chaud, promenades en calèche. Une affiche est en préparation de notre côté.', '',
    'Bien cordialement,', 'Anne Kerbrat, présidente', '',
    'Le 2 nov. 2026 à 10:15, Mairie de Saint-Ivenec <mairie@saint-ivenec.example> a écrit :',
    '> Bonjour, avez-vous arrêté la date du marché de Noël ?',
    '> Cordialement',
  ].join('\r\n'),
  RawHtmlBody: '<html><body><p>Bonjour,</p><p>Pouvez-vous publier…</p></body></html>',
  ExtractedMarkdownMessage: 'Bonjour,\n\nPouvez-vous publier cette information sur Facebook et sur le site internet ? À paraître avant le 5 décembre si possible.\n\nMerci d\'avance,',
  ExtractedMarkdownSignature: 'Yann Le Gall\nSecrétaire général\nMairie de Saint-Ivenec\n02 98 00 00 00\nSuivez la commune sur Facebook et retrouvez toutes les actualités sur notre site internet',
  Attachments: [
    { Name: 'image001.png', ContentType: 'image/png', ContentLength: 4812, ContentID: 'image001.png@01DC5A', DownloadToken: 'jeton-logo' },
    { Name: 'Programme marché de Noël.pdf', ContentType: 'application/pdf', ContentLength: 284511, ContentID: null, DownloadToken: 'jeton-programme' },
  ],
});

// 2. Transfert sans un mot : rien ne dit sur quel support publier
export const transfertSansConsigne = () => base({
  Subject: 'TR : [EXTERNE] Travaux rue de la Gare du 16 au 27 novembre',
  RawTextBody: [
    '', '',
    'De : Direction des routes <routes@departement.example>',
    'Envoyé : mardi 10 novembre 2026 14:03',
    'À : mairie@saint-ivenec.example',
    'Objet : [EXTERNE] Travaux rue de la Gare du 16 au 27 novembre', '',
    'Madame, Monsieur,', '',
    'Des travaux de réfection de la chaussée auront lieu rue de la Gare du 16 au 27 novembre. La circulation sera alternée.',
    'Merci de relayer cette information sur votre site internet et vos réseaux sociaux.', '',
    'Cordialement,', 'La direction des routes',
  ].join('\n'),
});

// 3. Mail direct, sans objet, écrit au téléphone
export const sansObjet = () => base({
  Subject: '',
  RawTextBody: 'Fermeture exceptionnelle de la mairie vendredi 13 novembre après-midi. A mettre sur Facebook svp\n\nEnvoyé depuis mon iPhone',
});

// 4. Pièce jointe trop lourde, programme à poids normal, exécutable et carte de visite
export const pieceLourde = () => base({
  Subject: 'Vœux du maire : à annoncer dans l’agenda',
  RawTextBody: 'Bonjour,\n\nMerci d’ajouter la cérémonie des vœux à l’agenda. Le film et le carton sont joints.\n\nCordialement,\nYann',
  Attachments: [
    { Name: 'film-voeux-2027.mp4', ContentType: 'video/mp4', ContentLength: 48 * 1024 * 1024, ContentID: null, DownloadToken: 'jeton-film' },
    { Name: 'carton voeux.pdf', ContentType: 'application/pdf', ContentLength: 512000, ContentID: null, DownloadToken: 'jeton-carton' },
    { Name: 'installeur.exe', ContentType: 'application/octet-stream', ContentLength: 9000, ContentID: null, DownloadToken: 'jeton-exe' },
    { Name: 'Yann Le Gall.vcf', ContentType: 'text/vcard', ContentLength: 300, ContentID: null, DownloadToken: 'jeton-vcf' },
  ],
});

// 5. Réponse automatique d'absence
export const reponseAutomatique = () => base({
  Subject: 'Réponse automatique : Bien reçu : Marché de Noël du 12 décembre',
  RawTextBody: 'Bonjour, je suis absent jusqu’au 16 novembre. Pour toute urgence, contactez l’accueil de la mairie.',
  Headers: { 'Auto-Submitted': 'auto-replied', 'X-Auto-Response-Suppress': 'All', 'Message-ID': '<auto@x>', 'Authentication-Results': PREUVE('saint-ivenec.example') },
});

// 6. Expéditeur inconnu de Fill
export const expediteurInconnu = () => base({
  From: { Name: 'Paul Morvan', Address: 'paul.morvan@association.example' },
  Subject: 'Annonce du loto du club',
  RawTextBody: 'Bonjour, pouvez-vous publier notre loto du 21 novembre sur Facebook ? Merci.',
});

// 7. Commande d'une affiche, plus un post : jamais déposée à l'aveugle
export const afficheDemandee = () => base({
  Subject: 'Fête de la musique 2027',
  RawTextBody: 'Bonjour,\n\nIl nous faudrait une affiche pour la fête de la musique du 21 juin, et un post Facebook pour l’annoncer.\n\nBien cordialement,\nYann Le Gall',
});

// 8. Affiche fournie en pièce jointe, à relayer : un post, pas une création
export const afficheFournie = () => base({
  Subject: 'Concert du bagad',
  RawTextBody: 'Bonjour,\n\nVoici l’affiche ci-jointe du concert du bagad. Merci de la relayer sur Facebook.\n\nCordialement,\nYann',
  Attachments: [{ Name: 'affiche-bagad.jpg', ContentType: 'image/jpeg', ContentLength: 1800000, ContentID: null, DownloadToken: 'jeton-affiche' }],
});

// 9. Tournure négative : à confirmer
export const tournureNegative = () => base({
  Subject: 'Réunion publique du 3 décembre',
  RawTextBody: 'Bonjour,\n\nÀ mettre sur le site internet, mais pas sur Facebook pour l’instant.\n\nMerci,\nYann',
});

// 10. Transfert depuis Gmail, version HTML seule
export const transfertGmailHtml = () => base({
  From: { Name: 'Lena Riou', Address: 'lena.riou@saint-ivenec.example' },
  Subject: 'Fwd: Collecte de jouets',
  RawTextBody: null,
  RawHtmlBody: '<div dir="ltr">Bonjour,<br><br>&Agrave; publier sur les r&eacute;seaux sociaux pour le 20/11 svp.<br><br>Lena<br><br><div class="gmail_quote">---------- Forwarded message ---------<br>De&nbsp;: <b>CCAS</b> &lt;ccas@saint-ivenec.example&gt;<br>Date: mar. 10 nov. 2026 à 11:02<br>Subject: Collecte de jouets<br>To: Lena Riou<br><br><p>Le CCAS organise une collecte de jouets du 23 au 28 novembre &agrave; la m&eacute;diath&egrave;que.</p></div></div>',
});

// 11. Avis de non-remise
export const nonRemis = () => base({
  From: { Name: 'Mail Delivery Subsystem', Address: 'MAILER-DAEMON@mx.example' },
  Subject: 'Undeliverable: Bien reçu : Concert du bagad',
  RawTextBody: 'Delivery has failed to these recipients.',
  Headers: { 'Content-Type': 'multipart/report; report-type=delivery-status', 'Return-Path': '<>' },
});

// 12. Lettre d'information redirigée automatiquement
export const lettreRedirigee = () => base({
  From: { Name: 'Agence Bretagne', Address: 'infos@agence.example' },
  Subject: 'Nos actualités de novembre',
  RawTextBody: 'Retrouvez nos actualités sur notre site internet.',
  Headers: { 'List-Unsubscribe': '<https://agence.example/stop>', Precedence: 'bulk' },
});

// 13. Origine non vérifiée (échec DMARC inscrit par le serveur de réception)
export const origineDouteuse = () => base({
  Subject: 'Horaires de la déchetterie',
  RawTextBody: 'Bonjour, merci de publier les nouveaux horaires de la déchetterie sur Facebook. Cordialement, Yann',
  Headers: { 'Authentication-Results': 'mx.example; spf=fail smtp.mailfrom=saint-ivenec.example; dkim=none; dmarc=fail header.from=saint-ivenec.example' },
});

// 14. Mails mal formés
export const malFormes = () => [
  null, 'texte', 42, [], {},
  { From: 'pas une adresse', Subject: 'x' },
  { From: { Address: 'yann.legall@saint-ivenec.example' }, Recipients: 'pas-une-liste', To: null, Cc: 7, Subject: { a: 1 }, RawTextBody: 12, Attachments: 'non', Headers: ['a', 'b'], SpamScore: 'x' },
  { From: { Address: 'yann.legall@saint-ivenec.example' }, Attachments: [null, 3, { Name: null, ContentLength: 'beaucoup' }], Headers: { 'Auto-Submitted': ['no', 'no'] } },
];
