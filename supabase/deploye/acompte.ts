// Acomptes Studio ES : une seule page de paiement pour tous les dossiers (plus de lien Stripe par total).
// POST {action:"creer"|"virement", dossier, devis, structure, nom, email, total, etale, echeances, suivi, particulier, demarrage_anticipe, retour}
// Paiement en plusieurs fois sans frais (sites, professionnels et associations) : etale = montant réglé en `echeances`
// mensualités (6, 12 ou 24), suivi = abonnement mensuel du site (9 €). Une seule page Stripe en mode abonnement :
// première mensualité + premier mois de suivi (+ acompte éventuel des autres prestations) à la commande, puis chaque
// mois ; après la dernière mensualité, l'abonnement continue sur le seul suivi (calendrier d'abonnement Stripe).
// Chaque échéance donne lieu à sa propre facture.
// GET  ?session=cs_...  -> état du paiement pour la page de retour du dossier
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ORIGINES = ["https://dossiers.studioes.fr", "https://studioes.fr"];
const cors = (req: Request) => {
  const o = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINES.includes(o) ? o : ORIGINES[0],
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
};
const json = (req: Request, d: unknown, status = 200) =>
  new Response(JSON.stringify(d), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
const net = (s: unknown, n = 200) => String(s ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);
const euros = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + " €";

async function courriel(a: { email: string; name?: string }[], sujet: string, titre: string, texte: string[], bouton?: { libelle: string; lien: string }, repondreA?: { email: string; name?: string }) {
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle || !a.length) return;
  const P = "margin:0 0 16px;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:#3D3A36";
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titre}</title></head><body style="margin:0;background:#F0EEE9"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0EEE9"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px"><tr><td style="padding:0 8px 18px;font:800 20px Arial,Helvetica,sans-serif;color:#141414">Studio ES</td></tr><tr><td style="background:#FFFFFF;border-radius:22px;padding:36px 32px 30px"><h1 style="margin:0 0 18px;font:700 24px/1.2 Arial,Helvetica,sans-serif;color:#141414">${titre}</h1>${texte.map((t) => `<p style="${P}">${t}</p>`).join("")}${bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px"><tr><td style="border-radius:999px;background:#141414"><a href="${bouton.lien}" style="display:inline-block;padding:15px 28px;font:700 15px Arial,Helvetica,sans-serif;color:#F0EEE9;text-decoration:none">${bouton.libelle}</a></td></tr></table>` : ""}<p style="margin:24px 0 0;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:#141414">Ewen Soupault<br><span style="color:#6B6560">Studio ES</span></p></td></tr><tr><td style="padding:18px 8px 0;font:400 13px/1.6 Arial,Helvetica,sans-serif;color:#8A847D">Studio ES, photographie et web en Bretagne · <a href="https://studioes.fr" style="color:#8A847D">studioes.fr</a> · <a href="mailto:contact@studioes.fr" style="color:#8A847D">contact@studioes.fr</a></td></tr></table></td></tr></table></body></html>`;
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Studio ES", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
      to: a, replyTo: repondreA ?? { email: "contact@studioes.fr", name: "Ewen Soupault, Studio ES" },
      subject: sujet, htmlContent: html,
    }),
  }).catch(() => null);
}

const ajouterMois = (d: Date, n: number) => {
  const r = new Date(d.getTime()), j = r.getUTCDate();
  r.setUTCDate(1); r.setUTCMonth(r.getUTCMonth() + n);
  const dernier = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 0)).getUTCDate();
  r.setUTCDate(Math.min(j, dernier));
  return r;
};

async function confirmerAcompte(sb: ReturnType<typeof createClient>, sessionId: string, montantPaye?: number, abonnement?: { id: string; debut: number; stripe: Stripe }) {
  const { data: a } = await sb.from("acompte").update({ statut: "paye", paye_le: new Date().toISOString() })
    .eq("stripe_session", sessionId).eq("statut", "en_attente").select("*").maybeSingle();
  if (!a) return null;
  const m = Number(montantPaye ?? a.montant);
  const mensuel = Number(a.mensuel ?? 0), eng = Number(a.engagement ?? 0), suivi = Number(a.suivi ?? 0);
  let fin: Date | null = null;
  if (abonnement && mensuel > 0 && eng > 0) {
    // dernière mensualité du site à la date anniversaire, puis le suivi seul continue (ou l'abonnement s'arrête s'il n'y a pas de suivi)
    fin = ajouterMois(new Date(abonnement.debut * 1000), eng);
    try {
      const st = abonnement.stripe;
      const sub = await st.subscriptions.retrieve(abonnement.id, { expand: ["items.data.price.product"] });
      const role = (it: Stripe.SubscriptionItem) => ((it.price.product as Stripe.Product)?.metadata?.role ?? "");
      // prix redonnés en price_data : les prix créés à la volée par Checkout ne se réutilisent pas d'un abonnement à l'autre
      const ligne = (it: Stripe.SubscriptionItem) => ({ quantity: it.quantity ?? 1, price_data: { currency: "eur", product: (it.price.product as Stripe.Product).id, unit_amount: it.price.unit_amount ?? 0, recurring: { interval: "month" as const } } });
      const tous = sub.items.data.map(ligne);
      const suiviSeul = sub.items.data.filter((it) => role(it) === "suivi").map(ligne);
      if (suiviSeul.length) {
        const sch = await st.subscriptionSchedules.create({ from_subscription: sub.id });
        await st.subscriptionSchedules.update(sch.id, {
          end_behavior: "release", proration_behavior: "none",
          phases: [
            { items: tous, start_date: sch.phases[0].start_date, iterations: eng, proration_behavior: "none" },
            { items: suiviSeul, proration_behavior: "none" },
          ],
        });
      } else {
        await st.subscriptions.update(sub.id, { cancel_at: Math.floor(fin.getTime() / 1000), proration_behavior: "none" });
      }
    } catch (e) {
      console.error("calendrier", e);
      await courriel([{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }], `À régler dans Stripe : fin des mensualités, devis ${a.devis}`, "Fin des mensualités à programmer",
        [`L'abonnement ${net(abonnement.id)} (devis n° ${net(a.devis)}) n'a pas pu être programmé automatiquement.`,
         `Dans Stripe, programmer l'arrêt de la ligne « Paiement en ${eng} fois » après la ${eng}e échéance, en gardant le suivi du site.`, `Erreur : ${net(String((e as Error)?.message ?? e), 300)}`]);
    }
    await sb.from("acompte").update({ stripe_abonnement: abonnement.id, fin_engagement: fin.toISOString() }).eq("id", a.id);
  }
  const derniere = fin && abonnement ? ajouterMois(new Date(abonnement.debut * 1000), eng - 1) : null;
  const finTxt = derniere ? derniere.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }) : "";
  if (mensuel > 0) {
    await courriel([{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }],
      `Commande en ${eng} fois : ${a.structure || a.nom} (${euros(mensuel)} par mois)`,
      `Commande en ${eng} fois : ${net(a.structure || a.nom)}`,
      [`${euros(m)} payés par carte pour le devis n° ${net(a.devis)} : première mensualité de ${euros(mensuel)}${suivi ? `, premier mois de suivi de ${euros(suivi)}` : ""}${Number(a.montant) > 0 ? ` et acompte de ${euros(Number(a.montant))}` : ""}.`,
       `Paiement en ${eng} fois sans frais, prélevé chaque mois sur la carte ; dernière mensualité le ${finTxt || "(date à vérifier dans Stripe)"}${suivi ? `, puis le suivi seul (${euros(suivi)} par mois) continue` : ""}.`,
       `Client : ${net(a.nom)} &lt;${net(a.email)}&gt;.`,
       "À faire : émettre sur Indy la facture de cette échéance avec ce numéro de devis (une facture par échéance), puis lancer l'accueil depuis Hors-champ. Stripe envoie un reçu à chaque prélèvement."],
      { libelle: "Ouvrir le dossier", lien: a.dossier ? `https://dossiers.studioes.fr/${a.dossier}/` : "https://studioes.fr" }, a.email ? { email: a.email, name: a.nom } : undefined);
    if (a.email) await courriel([{ email: a.email, name: a.nom ?? undefined }],
      `Commande confirmée, devis n° ${a.devis}`,
      "Votre commande est confirmée",
      [`Bonjour${a.nom ? " " + net(String(a.nom).split(" ")[0]) : ""},`,
       `Votre premier paiement de ${euros(m)} pour le devis n° ${net(a.devis)} est bien reçu : la commande est ferme.`,
       `Les ${eng - 1} mensualités suivantes, de ${euros(mensuel + suivi)}${suivi ? ` (dont ${euros(suivi)} de suivi du site)` : ""}, sont réglées automatiquement par carte chaque mois${finTxt ? `, jusqu'au ${finTxt}` : ""}.${suivi ? ` Ensuite, seul le suivi continue, ${euros(suivi)} par mois, résiliable à tout moment avec un mois de préavis.` : ""} Un reçu vous est envoyé à chaque prélèvement.`,
       "Je reviens vers vous pour caler le démarrage ; vous pouvez aussi choisir directement un créneau de 30 minutes."],
      { libelle: "Choisir un créneau", lien: "https://cal.com/studioes/30min" });
    return a;
  }
  const lienDossier = a.dossier ? `https://dossiers.studioes.fr/${a.dossier}/` : "https://studioes.fr";
  await courriel([{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }],
    `Acompte reçu : ${a.structure || a.nom} (${euros(m)})`,
    `Acompte reçu : ${net(a.structure || a.nom)}`,
    [`${euros(m)} payés par carte pour le devis n° ${net(a.devis)} (total ponctuel ${euros(Number(a.total_ponctuel))}).`,
     `Client : ${net(a.nom)} &lt;${net(a.email)}&gt;${a.particulier ? ", particulier (démarrage anticipé demandé)" : ""}.`,
     "À faire : émettre la facture d'acompte sur Indy avec ce numéro de devis, puis lancer l'accueil depuis Hors-champ."],
    { libelle: "Ouvrir le dossier", lien: lienDossier }, a.email ? { email: a.email, name: a.nom } : undefined);
  if (a.email) await courriel([{ email: a.email, name: a.nom ?? undefined }],
    `Acompte bien reçu, devis n° ${a.devis}`,
    "Votre acompte est bien reçu",
    [`Bonjour${a.nom ? " " + net(String(a.nom).split(" ")[0]) : ""},`,
     `Votre acompte de ${euros(m)} pour le devis n° ${net(a.devis)} est bien reçu : la commande est ferme.`,
     "La facture d'acompte vous parvient sous 24 h. Je reviens vers vous pour caler le démarrage ; vous pouvez aussi choisir directement un créneau de 30 minutes."],
    { libelle: "Choisir un créneau", lien: "https://cal.com/studioes/30min" });
  return a;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, CLE_SECRETE, { auth: { persistSession: false } });
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const session = url.searchParams.get("session") ?? "";
    if (!/^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(session)) return json(req, { erreur: "Session invalide" }, 400);
    let { data: a } = await sb.from("acompte").select("devis, structure, montant, mensuel, suivi, engagement, statut, dossier").eq("stripe_session", session).maybeSingle();
    if (!a) return json(req, { statut: "inconnu" }, 404);
    let paye: number | undefined;
    if (a.statut === "en_attente") {
      try {
        const s = await stripe.checkout.sessions.retrieve(session);
        if (s.payment_status === "paid") {
          paye = (s.amount_total ?? 0) / 100;
          let abo;
          if (s.mode === "subscription" && s.subscription) {
            const sub = await stripe.subscriptions.retrieve(String(typeof s.subscription === "string" ? s.subscription : s.subscription.id));
            abo = { id: sub.id, debut: sub.start_date, stripe };
          }
          await confirmerAcompte(sb, session, paye, abo); a = { ...a, statut: "paye" };
        }
      } catch (e) { console.error("confirmation", e); /* reste en attente */ }
    }
    const mens = Number(a.mensuel ?? 0), sv = Number(a.suivi ?? 0);
    return json(req, { statut: a.statut, devis: a.devis, structure: a.structure, montant: Number(a.montant) + mens + sv, acompte: Number(a.montant), mensuel: mens, suivi: sv, engagement: a.engagement });
  }

  if (req.method !== "POST") return json(req, { erreur: "Méthode" }, 405);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json(req, { erreur: "Requête illisible" }, 400); }
  const action = String(b.action ?? "creer");
  const total = Math.round(Number(b.total) * 100) / 100;
  const devis = net(b.devis, 40), dossier = net(b.dossier, 80), structure = net(b.structure, 160), nom = net(b.nom, 120);
  const email = net(b.email, 160).toLowerCase();
  const particulier = Boolean(b.particulier);
  const etale = Math.round(Number(b.etale ?? 0) * 100) / 100;
  const engagement = Math.round(Number(b.echeances ?? 0));
  const suivi = Math.round(Number(b.suivi ?? 0) * 100) / 100;
  // mensualité arrondie au centime inférieur : le total payé ne dépasse jamais le prix
  const mensuel = etale > 0 && engagement > 0 ? Math.floor(etale * 100 / engagement) / 100 : 0;
  if (!devis || !/^[a-z0-9][a-z0-9-]{1,79}$/.test(dossier)) return json(req, { erreur: "Dossier ou devis manquant" }, 400);
  if (etale > 0 && ![6, 12, 24].includes(engagement)) return json(req, { erreur: "Nombre de mensualités invalide" }, 400);
  if (!(etale === 0 || (etale >= 300 && etale <= 30000))) return json(req, { erreur: "Montant à étaler hors limites" }, 400);
  if (!(suivi === 0 || (suivi >= 5 && suivi <= 200)) || (suivi > 0 && etale === 0)) return json(req, { erreur: "Suivi hors limites" }, 400);
  if (etale > 0 && particulier) return json(req, { erreur: "Le paiement en plusieurs fois est réservé aux professionnels et associations" }, 400);
  if (!((total >= 50 || (total === 0 && etale > 0)) && total <= 30000)) return json(req, { erreur: "Montant hors limites" }, 400);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(req, { erreur: "E-mail invalide" }, 400);
  if (particulier && !b.demarrage_anticipe) return json(req, { erreur: "La demande de démarrage avant la fin du délai de rétractation doit être cochée" }, 400);
  const montant = Math.round(total * 30) / 100;

  const { data: dejaPaye } = await sb.from("acompte").select("id").eq("devis", devis).eq("statut", "paye").limit(1).maybeSingle();
  if (dejaPaye) return json(req, { erreur: "L'acompte de ce devis est déjà réglé" }, 409);

  if (action === "virement" && etale > 0) return json(req, { erreur: "Le paiement en plusieurs fois se règle par carte" }, 400);
  if (action === "virement") {
    const { data: a, error } = await sb.from("acompte").insert({ devis, dossier, structure, nom, email, particulier, total_ponctuel: total, montant, mode: "virement" }).select("*").single();
    if (error) return json(req, { erreur: "Enregistrement impossible" }, 500);
    await courriel([{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }],
      `Acompte par virement demandé : ${structure || nom} (${euros(montant)})`,
      `Acompte par virement : ${structure || nom}`,
      [`Devis n° ${devis} accepté, total ponctuel ${euros(total)}, acompte de ${euros(montant)} à régler par virement.`,
       `Client : ${nom} &lt;${email}&gt;${particulier ? ", particulier" : ""}.`,
       "À faire sous 24 h : envoyer la facture d'acompte Indy (elle porte le RIB). La commande est ferme à réception du virement."],
      { libelle: "Ouvrir le dossier", lien: `https://dossiers.studioes.fr/${dossier}/` }, email ? { email, name: nom } : undefined);
    return json(req, { ok: true, montant, id: a.id });
  }

  let retour = String(b.retour ?? `https://dossiers.studioes.fr/${dossier}/`);
  if (!retour.startsWith("https://dossiers.studioes.fr/")) retour = `https://dossiers.studioes.fr/${dossier}/`;
  const [base, frag] = retour.split("#");
  const sep = base.includes("?") ? "&" : "?";
  const succes = `${base}${sep}paye={CHECKOUT_SESSION_ID}${frag ? "#" + frag : ""}`;
  const annule = `${base}${frag ? "#" + frag : ""}`;

  const { data: a, error } = await sb.from("acompte").insert({ devis, dossier, structure, nom, email, particulier, total_ponctuel: total + etale, montant, mensuel, suivi, engagement: mensuel > 0 ? engagement : null }).select("id").single();
  if (error) return json(req, { erreur: "Enregistrement impossible" }, 500);
  if (etale > 0) {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", locale: "fr", currency: "eur",
      payment_method_types: ["card"],
      ...(email ? { customer_email: email } : {}),
      client_reference_id: `acompte:${a.id}`,
      line_items: [
        { quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(mensuel * 100), recurring: { interval: "month" }, product_data: { name: `Paiement en ${engagement} fois sans frais, devis n° ${devis}`, description: `${structure || nom}. ${euros(etale)} réglés en ${engagement} mensualités, sans frais.`, metadata: { role: "echeance" } } } },
        ...(suivi > 0 ? [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(suivi * 100), recurring: { interval: "month" as const }, product_data: { name: "Suivi du site", description: "Hébergement, nom de domaine, sécurité et sauvegardes. Résiliable avec un mois de préavis.", metadata: { role: "suivi" } } } }] : []),
        ...(montant > 0 ? [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(montant * 100), product_data: { name: `Acompte de 30 %, devis n° ${devis}`, description: "Prestations réglées une fois : solde de 70 % à la livraison." } } }] : []),
      ],
      metadata: { type: "acompte", acompte: a.id, devis, dossier },
      subscription_data: { description: `Studio ES, devis ${devis}, dossier ${dossier}, ${engagement} mensualités puis suivi`, metadata: { type: "acompte", acompte: a.id, devis, dossier, engagement: String(engagement) } },
      consent_collection: { terms_of_service: "required" },
      custom_text: { terms_of_service_acceptance: { message: `J'accepte le devis et les [conditions générales de Studio ES](https://studioes.fr/conditions/) : la commande est ferme, réglée en ${engagement} mensualités par carte${suivi > 0 ? ", suivies du suivi mensuel du site" : ""}.` } },
      success_url: succes, cancel_url: annule,
      expires_at: Math.floor(Date.now() / 1000) + 3600 * 23,
    });
    await sb.from("acompte").update({ stripe_session: session.id }).eq("id", a.id);
    return json(req, { url: session.url, montant: montant + mensuel + suivi, mensuel, suivi });
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment", locale: "fr", currency: "eur",
    payment_method_types: ["card"],
    ...(email ? { customer_email: email } : {}),
    client_reference_id: `acompte:${a.id}`,
    line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(montant * 100), product_data: { name: `Acompte de 30 %, devis n° ${devis}`, description: `${structure || nom}. Commande ferme selon le devis Studio ES accepté en ligne.` } } }],
    metadata: { type: "acompte", acompte: a.id, devis, dossier },
    payment_intent_data: { description: `Acompte 30 %, devis ${devis}, dossier ${dossier}`, metadata: { type: "acompte", devis, dossier } },
    consent_collection: { terms_of_service: "required" },
    custom_text: { terms_of_service_acceptance: { message: particulier
      ? "J'accepte le devis et les [conditions générales de Studio ES](https://studioes.fr/conditions/), et je demande que la prestation commence avant la fin du délai de rétractation."
      : "J'accepte le devis et les [conditions générales de Studio ES](https://studioes.fr/conditions/) : la commande est ferme." } },
    submit_type: "pay",
    success_url: succes, cancel_url: annule,
    expires_at: Math.floor(Date.now() / 1000) + 3600 * 23,
  });
  await sb.from("acompte").update({ stripe_session: session.id }).eq("id", a.id);
  return json(req, { url: session.url, montant });
});
