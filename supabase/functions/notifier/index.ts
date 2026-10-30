import { CLE_PUBLIABLE, CLE_SECRETE, cors, SITE } from '../_partage/cles.ts';
import { gabarit } from '../_partage/courriel.ts';
import { issue } from '../_partage/regles/cycle.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var extrait = (t, n = 280) => t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
var recent = (iso, minutes) => Boolean(iso) && Date.now() - new Date(iso).getTime() < minutes * 6e4;
var jour = (iso) => iso ? (/* @__PURE__ */ new Date(iso + "T12:00:00")).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "";
var EQUIPE2 = ["admin", "producteur"];
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = Deno.env.get("SUPABASE_URL");
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  const auth = req.headers.get("Authorization") ?? "";
  const serveur = Boolean(CLE_SECRETE) && auth === `Bearer ${CLE_SECRETE}`;
  let moi = null;
  if (!serveur) {
    const sb = createClient(url, CLE_PUBLIABLE, { global: { headers: { Authorization: auth } } });
    const { data: u } = await sb.auth.getUser();
    if (!u.user) return new Response("Connexion requise", { status: 401, headers: cors });
    moi = (await admin.from("profil").select("id, nom, email, role, organisation_id, actif").eq("id", u.user.id).single()).data;
    if (!moi?.actif) return new Response("Accès refusé", { status: 403, headers: cors });
  }
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle) return new Response("Envoi non configuré", { status: 503, headers: cors });
  const pourFill = Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr";
  const { evenement, demande: demandeId, commande: commandeId, organisation: orgId, canal } = await req.json();
  const estFill = serveur || EQUIPE2.includes(moi.role);
  const profils = async (org) => (await admin.from("profil").select("id, nom, email, role, organisation_id, actif").eq("organisation_id", org).eq("actif", true)).data ?? [];
  const mails = [];
  let essai = false;
  if (evenement === "credit" || evenement === "paiement") {
    if (!estFill && evenement === "credit") return new Response("Réservé à Fill", { status: 403, headers: cors });
    const org = commandeId ? (await admin.from("commande").select("organisation_id").eq("id", commandeId).single()).data?.organisation_id : orgId;
    const { data: o } = await admin.from("organisation").select("id, nom, essai").eq("id", org).single();
    if (!o) return new Response("Rien à signaler", { status: 404, headers: cors });
    if (!serveur && moi.organisation_id && moi.organisation_id !== o.id) return new Response("Accès refusé", { status: 403, headers: cors });
    essai = o.essai;
    const { data: r } = await admin.from("registre").select("unites, motif, date").eq("organisation_id", o.id).in("type", ["credit", "ajustement"]).gt("unites", 0).order("date", { ascending: false }).limit(1).maybeSingle();
    if (!r || !recent(r.date, 10)) return new Response("Rien à signaler", { status: 409, headers: cors });
    const ref = (await profils(o.id)).find((p) => p.role === "referent");
    if (ref) mails.push({
      a: [{ email: ref.email, name: ref.nom }],
      sujet: `${r.unites} unités créditées sur votre espace Fill`,
      titre: `${r.unites} unités créditées`,
      texte: [evenement === "paiement" ? "Votre paiement est bien reçu, merci." : `${echap(r.motif ?? "Unités ajoutées par Fill")}.`, `Les ${r.unites} unités sont disponibles dès maintenant dans l’espace de ${echap(o.nom)} : vos demandes peuvent partir.`],
      bouton: { libelle: "Déposer une demande", lien: `${SITE}/#nouvelle` }
    });
    if (evenement === "paiement") mails.push({ a: [{ email: pourFill }], sujet: `Paiement reçu : ${o.nom}`, titre: `Paiement reçu : ${echap(o.nom)}`, texte: [`${r.unites} unités créditées automatiquement (${echap(r.motif ?? "")}).`], bouton: { libelle: "Ouvrir le pilotage", lien: `${SITE}/#pilotage` } });
  } else if (evenement === "acces") {
    const NOMS = { facebook: "Page Facebook", instagram: "Instagram", linkedin: "Page LinkedIn", site: "Site internet", newsletter: "Newsletter", google: "Fiche Google" };
    const { data: a } = await admin.from("acces_compte").select("statut, note, maj").eq("organisation_id", orgId).eq("canal", canal).maybeSingle();
    const { data: o } = await admin.from("organisation").select("id, nom, essai").eq("id", orgId).single();
    if (!a || !o || !recent(a.maj, 5)) return new Response("Rien à signaler", { status: 409, headers: cors });
    if (!estFill && moi.organisation_id !== o.id) return new Response("Accès refusé", { status: 403, headers: cors });
    essai = o.essai;
    const nomC = NOMS[canal] ?? echap(canal);
    if (a.statut === "donne" && !estFill) {
      mails.push({
        a: [{ email: pourFill }],
        repondreA: { email: moi.email, name: moi.nom },
        sujet: `Accès à vérifier : ${nomC} (${o.nom})`,
        titre: `${echap(o.nom)} vous a donné l’accès : ${nomC}`,
        texte: ["Connectez-vous à l’outil, vérifiez que vous pouvez publier, puis confirmez dans le pilotage. Le client voit l’accès comme « en vérification » d’ici là."],
        bouton: { libelle: "Ouvrir le pilotage", lien: `${SITE}/#pilotage` }
      });
    } else if (a.statut === "a_donner" && a.note && estFill) {
      const ref = (await profils(o.id)).find((p) => p.role === "referent");
      if (ref) mails.push({
        a: [{ email: ref.email, name: ref.nom }],
        sujet: `Accès à redonner : ${nomC}`,
        titre: `L’accès à votre ${nomC} ne fonctionne pas`,
        texte: [`<i>${echap(extrait(a.note, 300))}</i>`, "Tant que l’accès manque, Fill vous remet les contenus de ce canal prêts à publier."],
        bouton: { libelle: "Redonner l’accès", lien: `${SITE}/#comptes` }
      });
    } else return new Response("Rien à signaler", { status: 409, headers: cors });
  } else {
    const { data: d } = await admin.from("demande").select("*").eq("id", demandeId).single();
    if (!d) return new Response("Demande introuvable", { status: 404, headers: cors });
    if (!estFill && moi.organisation_id !== d.organisation_id) return new Response("Accès refusé", { status: 403, headers: cors });
    const { data: o } = await admin.from("organisation").select("id, nom, essai").eq("id", d.organisation_id).single();
    essai = Boolean(o?.essai);
    const equipeClient = await profils(d.organisation_id);
    const auteur = equipeClient.find((p) => p.id === d.auteur_id);
    const referent = equipeClient.find((p) => p.role === "referent");
    const lienDemande = `${SITE}/#demande-${d.id}`;
    const lignes = (await admin.from("demande_ligne").select("prestation").eq("demande_id", d.id)).data ?? [];
    const iss = issue(lignes);
    const quand = d.heure ? ` à ${String(d.heure).replace(":", " h ")}` : "";
    const nom = `« ${echap(d.titre)} »`;
    const destClient = (qui) => [...new Map(qui.filter(Boolean).map((p) => [p.email, { email: p.email, name: p.nom }])).values()];
    if (evenement === "jet") {
      if (!serveur) return new Response("Réservé au serveur", { status: 403, headers: cors });
      const { data: b } = await admin.from("brouillon").select("maj, contenu").eq("demande_id", d.id).maybeSingle();
      if (!b || !recent(b.maj, 10)) return new Response("Rien à signaler", { status: 409, headers: cors });
      const n = Array.isArray(b.contenu?.fichiers) ? b.contenu.fichiers.length : 0;
      mails.push({
        a: [{ email: pourFill }],
        sujet: `Premier jet à relire : ${d.titre} (${o?.nom})`,
        titre: `Premier jet prêt : ${nom}`,
        texte: [`Le pilote a confirmé la demande${d.livraison ? `, livraison le ${jour(d.livraison)}` : ""}. L’atelier a préparé ${n || "les"} texte${n > 1 ? "s" : ""} à partir du brief.`, "Relisez, corrigez ou demandez une reprise dans la fiche, puis livrez la version au client. Rien ne part sans vous."],
        bouton: { libelle: "Relire le premier jet", lien: lienDemande }
      });
    } else if (evenement === "depot") {
      if (!recent(d.creee, 10)) return new Response("Déjà signalé", { status: 409, headers: cors });
      const auto = d.statut === "confirmee";
      mails.push({
        a: [{ email: pourFill }],
        repondreA: auteur ? { email: auteur.email, name: auteur.nom } : void 0,
        sujet: `${auto ? "Demande confirmée par le pilote" : "Nouvelle demande"} : ${d.titre} (${o?.nom})`,
        titre: `${auto ? "Confirmée par le pilote" : "Nouvelle demande"} : ${nom}`,
        texte: [
          `<b>${echap(o?.nom)}</b>, déposée par ${echap(auteur?.nom ?? "le client")} · ${d.unites} unité${d.unites > 1 ? "s" : ""}${d.urgente ? " · urgente" : ""}${d.parution ? ` · parution le ${jour(d.parution)}${quand}` : quand ? ` · publication${quand}` : ""}.`,
          `<i>${echap(extrait(d.brief ?? ""))}</i>`,
          auto ? `Le pilote l’a confirmée${d.livraison ? `, livraison le ${jour(d.livraison)}` : ""} ; le premier jet de l’atelier vous attend dans la fiche.` : "Elle attend votre confirmation (coût et date de livraison)."
        ],
        bouton: { libelle: "Ouvrir la demande", lien: lienDemande }
      });
    } else if (evenement === "message") {
      const { data: msg } = await admin.from("message").select("texte, auteur_id, creee, systeme").eq("demande_id", d.id).order("creee", { ascending: false }).limit(1).maybeSingle();
      if (!msg || msg.systeme || !recent(msg.creee, 3) || moi && msg.auteur_id !== moi.id) return new Response("Rien à signaler", { status: 409, headers: cors });
      if (estFill) {
        mails.push({ a: destClient([auteur, referent]), sujet: `Message de Fill : ${d.titre}`, titre: `Message de Fill sur ${nom}`, texte: [`<i>${echap(extrait(msg.texte, 600))}</i>`], bouton: { libelle: "Répondre dans l’espace", lien: lienDemande } });
      } else {
        mails.push({ a: [{ email: pourFill }], repondreA: { email: moi.email, name: moi.nom }, sujet: `Message de ${o?.nom} : ${d.titre}`, titre: `Message de ${echap(moi.nom)}`, texte: [`Sur ${nom} (${echap(o?.nom)}) :`, `<i>${echap(extrait(msg.texte, 600))}</i>`], bouton: { libelle: "Ouvrir la demande", lien: lienDemande } });
      }
    } else if (evenement === "statut") {
      const { data: h } = await admin.from("historique").select("statut, type, detail, par, date").eq("demande_id", d.id).order("id", { ascending: false }).limit(1).maybeSingle();
      if (!h || !recent(h.date, 5) || h.statut !== d.statut) return new Response("Rien à signaler", { status: 409, headers: cors });
      const parClient = equipeClient.some((p) => p.id === h.par);
      if (parClient) {
        const qui = equipeClient.find((p) => p.id === h.par);
        const quoi = {
          validee: iss === "fichiers" ? "a validé la version proposée : les fichiers finaux sont à remettre" : iss === "publication" ? `a validé la version proposée : elle est à publier${d.parution ? ` le ${jour(d.parution)}` : ""}${quand}` : `a validé la version proposée : à publier${d.parution ? ` le ${jour(d.parution)}` : ""}${quand}, fichiers à remettre`,
          correction: "demande des corrections sur la version proposée",
          confirmee: "a donné son accord : la demande peut être lancée",
          annulee: "a annulé la demande",
          production: "a fourni l’élément attendu : la production peut reprendre",
          deposee: "a modifié la demande avant confirmation"
        };
        const texte = quoi[h.type === "modification" ? "deposee" : d.statut];
        if (!texte) return new Response("Rien à signaler", { status: 409, headers: cors });
        mails.push({ a: [{ email: pourFill }], repondreA: { email: qui.email, name: qui.nom }, sujet: `${o?.nom} : ${d.titre}`, titre: `${echap(qui.nom)} ${texte}`, texte: [`${nom}, ${echap(o?.nom)}.`, h.detail ? `<i>${echap(extrait(h.detail, 400))}</i>` : ""].filter(Boolean), bouton: { libelle: "Ouvrir la demande", lien: lienDemande } });
      } else {
        const versClient = {
          confirmee: { sujet: `Demande confirmée : ${d.titre}`, titre: `${nom} est confirmée`, texte: `${d.unites} unité${d.unites > 1 ? "s" : ""}${d.livraison ? `, livraison prévue le ${jour(d.livraison)}` : ""}. Vous suivez chaque étape dans votre espace.`, bouton: "Suivre la demande", qui: [auteur] },
          a_valider: { sujet: `À relire : ${d.titre}`, titre: `Une version de ${nom} est prête`, texte: "Relisez-la dans votre espace : validez-la, ou indiquez vos corrections au bon endroit. Deux allers-retours sont inclus.", bouton: "Relire la version", qui: [auteur, referent] },
          attente_client: { sujet: `Un élément est attendu : ${d.titre}`, titre: `Fill attend un élément pour ${nom}`, texte: "La production reprend dès votre réponse. Le détail est dans les échanges de la demande.", bouton: "Répondre", qui: [auteur, referent] },
          accord_requis: { sujet: `Votre accord est demandé : ${d.titre}`, titre: `Votre accord est demandé pour ${nom}`, texte: "Cette demande dépasse ce qui était prévu (unités ou plafond du contributeur). Elle est lancée dès votre accord.", bouton: "Donner mon accord", qui: [referent] },
          livree: iss === "fichiers" ? { sujet: `Fichiers livrés : ${d.titre}`, titre: `Les fichiers de ${nom} sont livrés`, texte: "Les fichiers finaux sont à télécharger dans la demande, prêts à imprimer ou à diffuser.", bouton: "Récupérer les fichiers", qui: [auteur, referent] } : { sujet: `C’est publié : ${d.titre}`, titre: `${nom} est publiée`, texte: iss === "mixte" ? "Fill l’a publiée sur vos comptes ; les fichiers des supports imprimés sont à télécharger dans la demande." : "Fill l’a publiée sur vos comptes. Les liens et les fichiers restent disponibles dans la demande.", bouton: "Voir la demande", qui: [auteur, referent] },
          annulee: { sujet: `Demande annulée : ${d.titre}`, titre: `${nom} est annulée`, texte: "Les unités réservées sont rendues à votre compte. Le motif est dans les échanges de la demande.", bouton: "Voir la demande", qui: [auteur] }
        };
        const v = versClient[d.statut];
        if (!v) return new Response("Rien à signaler", { status: 409, headers: cors });
        mails.push({ a: destClient(v.qui), sujet: `${h.type === "relance" ? "Rappel : " : ""}${v.sujet}`, titre: v.titre, texte: [v.texte], bouton: { libelle: v.bouton, lien: lienDemande } });
      }
    } else return new Response("Événement inconnu", { status: 400, headers: cors });
  }
  const envois = mails.filter((m) => m.a.length).map((m) => fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
      to: m.a,
      replyTo: m.repondreA ?? { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
      subject: `${essai ? "[Test] " : ""}${m.sujet}`,
      htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton })
    })
  }));
  const res = await Promise.all(envois);
  return new Response(res.every((r) => r.ok) ? "ok" : "Envoi refusé", { status: res.every((r) => r.ok) ? 200 : 502, headers: cors });
});
