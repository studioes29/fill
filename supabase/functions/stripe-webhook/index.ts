// Webhook Stripe unique du compte Studio ES.
// Trie chaque paiement par sa référence : Fill (commande:, ouverture:, mensualite:), acompte Studio ES (acompte:),
// carte cadeau Pierceval (carte:). Seuls les paiements Fill créditent des unités.
// Commandes Studio ES en plusieurs fois (abonnements Stripe) : chaque échéance payée, refusée, ou l'arrêt de l'abonnement
// prévient Studio ES par mail (facture Indy par échéance, relance en cas de refus).
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL")!;
const sb = createClient(URL_SB, CLE_SECRETE);

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
  let evt;
  try {
    evt = await stripe.webhooks.constructEventAsync(await req.text(), req.headers.get("stripe-signature")!, Deno.env.get("STRIPE_WEBHOOK_SECRET")!);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }
  if (evt.type === "checkout.session.completed" || evt.type === "checkout.session.async_payment_succeeded") {
    const s = evt.data.object as Stripe.Checkout.Session;
    if (s.payment_status === "unpaid" && s.mode === "payment") return new Response("ok");
    const [objet, id, periode] = (s.client_reference_id ?? "").split(":");

    if (objet === "commande" || objet === "ouverture") {
      if (objet === "commande") await sb.rpc("commande_payee", { p_commande: id, p_session: s.id });
      if (objet === "ouverture") await sb.rpc("activer_organisation", { p_organisation: id });
      await fetch(`${URL_SB}/functions/v1/notifier`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CLE_SECRETE}`, "Content-Type": "application/json" },
        body: JSON.stringify({ evenement: "paiement", ...(objet === "commande" ? { commande: id } : { organisation: id }) }),
      }).catch(() => null);
    } else if (objet === "mensualite" || s.metadata?.type === "fill-mensualite") {
      // Mensualité Fill (entreprise) payée avec le lien personnel de l'organisation
      const org = objet === "mensualite" ? id : s.metadata?.organisation;
      const per = objet === "mensualite" ? periode : s.metadata?.periode;
      const montant = (s.amount_total ?? 0) / 100;
      let resultat: Record<string, unknown>;
      if (org && per) {
        const { data, error } = await sb.rpc("mensualite_payee", { p_organisation: org, p_periode: per, p_session: s.id, p_montant: montant });
        if (error) {
          console.error("mensualite_payee", error);
          return new Response("Enregistrement impossible", { status: 500 }); // Stripe renverra l'événement
        }
        resultat = data;
      } else {
        // ancien lien générique, sans organisation : Fill rattache le paiement à la main
        resultat = { sans_organisation: true, session: s.id, montant, nouveau: true };
      }
      await fetch(`${URL_SB}/functions/v1/mensualite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CLE_SECRETE}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reglee", resultat }),
      }).catch(() => null);
    } else if (objet === "acompte" || s.metadata?.type === "acompte") {
      await fetch(`${URL_SB}/functions/v1/acompte?session=${encodeURIComponent(s.id)}`).catch(() => null);
    } else if (objet === "carte" || s.metadata?.type === "carte-cadeau-v2") {
      await fetch(`${URL_SB}/functions/v1/carte-cadeau?action=verify-gift&session=${encodeURIComponent(s.id)}`).catch(() => null);
    }
  }
  if (evt.type === "invoice.paid" || evt.type === "invoice.payment_failed" || evt.type === "customer.subscription.deleted") {
    const o = evt.data.object as any;
    const md = (evt.type === "customer.subscription.deleted" ? o.metadata : (o.parent?.subscription_details?.metadata ?? o.subscription_details?.metadata)) ?? {};
    if (md.type !== "acompte") return new Response("ok"); // seules les commandes Studio ES en plusieurs fois sont suivies ici
    // la première échéance est déjà annoncée par le mail « Commande en N fois »
    if (evt.type === "invoice.paid" && o.billing_reason === "subscription_create") return new Response("ok");
    const { data: a } = await sb.from("acompte").select("devis, structure, nom, email, mensuel, suivi, engagement").eq("id", md.acompte).maybeSingle();
    const qui = a?.structure || a?.nom || o.customer_email || "client";
    const euros = (c: number) => (c / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    const lien = o.hosted_invoice_url ?? "https://dashboard.stripe.com/subscriptions";
    const devis = a?.devis ?? md.devis ?? "?";
    const [sujet, lignes] = evt.type === "invoice.paid"
      ? [`Échéance reçue : ${qui} (${euros(o.amount_paid ?? 0)})`, [`Échéance payée par carte pour le devis n° ${devis}.`, "À faire : la facture Indy de cette échéance, même numéro de devis."]]
      : evt.type === "invoice.payment_failed"
      ? [`Échéance refusée : ${qui} (${euros(o.amount_due ?? 0)})`, [`Le prélèvement de l'échéance du devis n° ${devis} a été refusé. Stripe réessaie automatiquement et prévient le client.`, `À faire : écrire au client${a?.email ? " (" + a.email + ")" : ""} si le deuxième essai échoue aussi.`]]
      : [`Abonnement arrêté : ${qui}`, [`L'abonnement du devis n° ${devis} est arrêté (fin normale ou résiliation).`, "À vérifier : toutes les échéances sont-elles réglées ? Le suivi du site continue-t-il ailleurs ?"]];
    const cle = lire("BREVO_API_KEY");
    if (cle) await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST", headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Studio ES", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
        to: [{ email: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr" }],
        subject: sujet, textContent: [...lignes, "", lien].join("\n"), tags: ["stripe-echeance"],
      }),
    }).catch((e) => console.error("brevo", String(e)));
    else console.error("BREVO_API_KEY absente : alerte non envoyée", sujet);
  }
  return new Response("ok");
});
