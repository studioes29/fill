import { CLE_PUBLIABLE, cors, SITE } from '../_partage/cles.ts';
import { gabarit } from '../_partage/courriel.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL"), CLE_PUBLIABLE, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return new Response("Connexion requise", { status: 401, headers: cors });
  const { organisation, motif, commande } = await req.json();
  const { data: o } = await sb.from("organisation").select("id, nom, type, formule, engagement_mois, siret, statut, creee, bon_commande").eq("id", organisation).single();
  const { data: p } = await sb.from("profil").select("nom, email, fonction, telephone").eq("id", u.user.id).single();
  if (!o || !p) return new Response("Rien à signaler", { status: 404, headers: cors });
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle) return new Response("Envoi non configuré", { status: 503, headers: cors });
  const site = SITE;
  const envoyer = (corps) => fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" }, ...corps })
  });
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  if (motif === "bon_commande") {
    let quoi = "";
    if (commande) {
      const { data: c } = await sb.from("commande").select("unites, total, statut, bon_commande").eq("id", commande).single();
      if (!c || c.statut !== "a_valider" || !c.bon_commande) return new Response("Rien à signaler", { status: 404, headers: cors });
      quoi = `${c.unites} unités supplémentaires (${Number(c.total).toLocaleString("fr-FR")} € HT)`;
    } else {
      if (o.statut !== "a_activer" || !o.bon_commande) return new Response("Rien à signaler", { status: 404, headers: cors });
      quoi = `les premières unités de la formule ${o.formule}`;
    }
    const html2 = gabarit({
      titre: `Bon de commande reçu : ${echap(o.nom)}`,
      texte: [`${echap(p.nom)} a déposé le bon de commande signé pour ${echap(quoi)}.`, "Vérifiez-le puis créditez les unités depuis le pilotage."],
      bouton: { libelle: "Ouvrir le pilotage", lien: `${site}/#pilotage` }
    });
    const r2 = await envoyer({ to: [{ email: pourFill }], replyTo: { email: p.email, name: p.nom }, subject: `Bon de commande reçu : ${o.nom}`, htmlContent: html2 });
    return new Response(r2.ok ? "ok" : "Envoi refusé", { status: r2.ok ? 200 : 502, headers: cors });
  }
  if (o.statut !== "a_activer") return new Response("Rien à signaler", { status: 404, headers: cors });
  if (Date.now() - new Date(o.creee).getTime() > 10 * 60 * 1e3) return new Response("Déjà signalé", { status: 409, headers: cors });
  const type = o.type === "collectivite" ? "Collectivité" : "Entreprise";
  const lignes = [
    ["Structure", `${o.nom} (${type})`],
    ["SIRET", o.siret ?? ""],
    ["Formule choisie", `${o.formule}, engagement ${o.engagement_mois} mois`],
    ["Interlocuteur", `${p.nom}${p.fonction ? `, ${p.fonction}` : ""}`],
    ["E-mail", p.email],
    ["Téléphone", p.telephone ?? "non renseigné"]
  ];
  const suite = o.type === "collectivite" ? "À rappeler pour caler le volume d’unités, puis envoyer le devis et le bon de commande. Les unités se créditent depuis le pilotage, à réception du bon signé." : "Les unités se créditent seules au premier règlement en ligne. Un appel reste utile pour caler le volume.";
  const html = gabarit({
    titre: `Nouvelle inscription : ${echap(o.nom)}`,
    texte: [`<table style="border-collapse:collapse">${lignes.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6B6560">${k}</td><td style="padding:4px 0;color:#1A1A1A"><b>${echap(v)}</b></td></tr>`).join("")}</table>`, suite],
    bouton: { libelle: "Ouvrir le pilotage", lien: `${site}/#pilotage` }
  });
  const prenom = String(p.nom).split(" ")[0];
  const bienvenue = gabarit({
    titre: `Bienvenue, ${echap(prenom)}`,
    aperçu: "Votre espace Fill est ouvert.",
    texte: [
      `L’espace de ${echap(o.nom)} est ouvert. Vous pouvez dès maintenant inviter vos collègues (menu Équipe) et déposer vos premières demandes.`,
      o.type === "collectivite" ? "Je vous appelle sous 24 h ouvrées pour caler avec vous le volume d’unités, puis je vous envoie le devis et le bon de commande. Déposez le bon signé dans votre espace : vos unités sont créditées dès sa validation, et la production de vos demandes démarre." : "Vos unités sont créditées dès le premier règlement, à faire en ligne depuis l’accueil de votre espace, et la production de vos demandes démarre. Je vous appelle aussi pour caler le volume avec vous."
    ],
    bouton: { libelle: "Ouvrir mon espace", lien: `${site}/` },
    apres: ["Pour vous connecter : votre adresse e-mail et le mot de passe choisi à l’inscription. Une question ? Répondez simplement à ce message."]
  });
  const [r] = await Promise.all([
    envoyer({ to: [{ email: pourFill }], replyTo: { email: p.email, name: p.nom }, subject: `Nouvelle inscription : ${o.nom}`, htmlContent: html }),
    envoyer({ to: [{ email: p.email, name: p.nom }], replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" }, subject: "Votre espace Fill est ouvert", htmlContent: bienvenue })
  ]);
  return new Response(r.ok ? "ok" : "Envoi refusé", { status: r.ok ? 200 : 502, headers: cors });
});
