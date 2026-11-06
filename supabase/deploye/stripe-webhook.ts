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
  // commande de studioes.fr abandonnée sur la page Stripe (session expirée sans paiement) : un seul e-mail au client
  // avec un lien qui rouvre sa commande telle qu'il l'avait laissée ; jamais deux fois, jamais si le devis est payé
  if (evt.type === "checkout.session.expired") {
    const s = evt.data.object as any;
    if (s.metadata?.type !== "acompte" || s.metadata?.dossier !== "commander" || !s.metadata?.acompte) return new Response("ok");
    const { data: a } = await sb.from("acompte").select("id, devis, nom, email, statut, reprise, reprise_envoyee").eq("id", s.metadata.acompte).maybeSingle();
    if (!a || a.statut !== "en_attente" || a.reprise_envoyee || !a.reprise || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email ?? "")) return new Response("ok");
    const { data: paye } = await sb.from("acompte").select("id").eq("email", a.email).eq("statut", "paye").gte("paye_le", new Date(Date.now() - 3 * 864e5).toISOString()).limit(1).maybeSingle();
    await sb.from("acompte").update({ statut: "abandonne", reprise_envoyee: new Date().toISOString() }).eq("id", a.id);
    if (paye) return new Response("ok");
    const cle = lire("BREVO_API_KEY");
    if (!cle) { console.error("BREVO_API_KEY absente : reprise non envoyée", a.id); return new Response("ok"); }
    const prenom = String(a.nom ?? "").trim().split(/\s+/)[0].replace(/[<>&"]/g, "");
    const lien = `https://studioes.fr/?reprendre=${a.id}`;
    const p = "margin:0 0 16px;font:400 16px/1.6 Arial,Helvetica,sans-serif;color:#2A2926";
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST", headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Ewen Soupault, Studio ES", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
        replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Studio ES" },
        to: [{ email: a.email, name: a.nom ?? undefined }],
        subject: `Votre commande Studio ES, devis n° ${a.devis}`,
        htmlContent: `<!doctype html><html lang="fr"><body style="margin:0;padding:32px 16px;background:#F0EEE9"><div style="max-width:560px;margin:0 auto;background:#fff;border-radius:22px;padding:36px 32px">` +
          `<p style="${p}">Bonjour${prenom ? " " + prenom : ""},</p>` +
          `<p style="${p}">Votre commande (devis n° ${String(a.devis).replace(/[<>&"]/g, "")}) n'a pas été réglée : la page de paiement a expiré. Vos choix sont gardés : ce lien rouvre la commande telle que vous l'aviez laissée.</p>` +
          `<p style="margin:26px 0"><a href="${lien}" style="display:inline-block;padding:15px 28px;border-radius:999px;background:#141414;color:#F0EEE9;font:700 16px Arial,Helvetica,sans-serif;text-decoration:none">Reprendre ma commande</a></p>` +
          `<p style="${p}">Le lien reste valable 14 jours. Pour une question ou un ajustement, il suffit de répondre à ce message.</p>` +
          `<p style="${p}">Bien cordialement<br>Ewen Soupault<br><span style="color:#65615A">Studio ES · studioes.fr</span></p>` +
          `<p style="margin:24px 0 0;font:400 13px/1.5 Arial,Helvetica,sans-serif;color:#97928A">Vous recevez ce message unique parce que vous avez commencé une commande sur studioes.fr. Aucun autre rappel ne suivra.</p></div></body></html>`,
        tags: ["reprise-commande"],
      }),
    }).catch((e) => console.error("brevo", String(e)));
    return new Response("ok");
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
