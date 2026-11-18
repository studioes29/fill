// Envoi des e-mails par les boîtes MX Plan d'OVH (SMTP ssl0.ovh.net, port 465), à la place de Brevo
// (compte coupé le 18 novembre 2026 : Brevo refuse la prospection à froid).
//
// Deux boîtes, chacune avec ses secrets Supabase :
//   « contact »      contact@studioes.fr : Espace Fill, paiements, formulaires, parcours clients, alertes à Ewen
//                    secrets CONTACT_SMTP_USER (contact@studioes.fr) et CONTACT_SMTP_PASS
//   « prospection »  ewen@studioes.fr : prospection et campagnes vers des prospects (fonction envoi, vagues de lancement)
//                    secrets OVH_SMTP_USER et OVH_SMTP_PASS
// OVH n'accepte en expéditeur que l'adresse de la boîte connectée : le nom affiché (« Fill », « Studio ES »…) est
// gardé, l'adresse est toujours celle de la boîte.
//
// envoyerSmtp reçoit exactement ce que les fonctions envoyaient à l'API de Brevo (fetch vers /v3/smtp/email, corps
// JSON : sender, to, cc, bcc, replyTo, subject, htmlContent, textContent, headers, attachment) et rend une réponse au
// même format ({ messageId } en JSON, statut 201), pour que le code des fonctions ne change pas.
import nodemailer from "npm:nodemailer@6.9.16";
import { Buffer } from "node:buffer";

type Boite = "contact" | "prospection";
const HOTE = (Deno.env.get("OVH_SMTP_HOST") ?? "").trim() || "ssl0.ovh.net";
const ACCES: Record<Boite, { user: string; pass: string }> = {
  contact: { user: (Deno.env.get("CONTACT_SMTP_USER") ?? "").trim() || "contact@studioes.fr", pass: Deno.env.get("CONTACT_SMTP_PASS") ?? "" },
  prospection: { user: (Deno.env.get("OVH_SMTP_USER") ?? "").trim(), pass: Deno.env.get("OVH_SMTP_PASS") ?? "" },
};
const transports: Partial<Record<Boite, ReturnType<typeof nodemailer.createTransport>>> = {};
const transport = (b: Boite) => {
  const a = ACCES[b];
  if (!a.user || !a.pass) return null;
  return transports[b] ??= nodemailer.createTransport({ host: HOTE, port: 465, secure: true, auth: { user: a.user, pass: a.pass } });
};

// Vrai si la boîte est réglée. Les fonctions s'en servent à la place de l'ancienne clé Brevo (« envoi non configuré »).
export const envoiPret = (b: Boite = "contact") => Boolean(ACCES[b].user && ACCES[b].pass);
// Valeur « vraie » à mettre là où le code testait la clé Brevo.
export const CLE_ENVOI = envoiPret("contact") ? "ovh" : "";
export const adresseBoite = (b: Boite = "contact") => ACCES[b].user;

const adresse = (x: any) => x?.email ? (x.name ? { name: String(x.name).replace(/["<>]/g, ""), address: String(x.email) } : String(x.email)) : undefined;
const liste = (l: any) => (Array.isArray(l) ? l : l ? [l] : []).map(adresse).filter(Boolean);

const reponse = (status: number, corps: unknown) => new Response(JSON.stringify(corps), { status, headers: { "content-type": "application/json" } });

// corps : objet au format Brevo, ou init de fetch dont body est ce JSON
export async function envoyerSmtp(init: any, boite: Boite = "contact"): Promise<Response> {
  let c: any = init;
  if (init && typeof init.body === "string") { try { c = JSON.parse(init.body); } catch { return reponse(400, { message: "corps illisible" }); } }
  const t = transport(boite);
  if (!t) return reponse(503, { message: `boîte ${boite} non réglée (secrets SMTP)` });
  const jointes = (Array.isArray(c.attachment) ? c.attachment : []).map((p: any) => {
    const filename = String(p?.name ?? "piece-jointe");
    if (p?.content) return { filename, content: Buffer.from(String(p.content), "base64") };
    if (p?.url) return { filename, path: String(p.url) };
    return null;
  }).filter(Boolean);
  try {
    const info = await t.sendMail({
      from: { name: String(c.sender?.name ?? "Ewen Soupault").replace(/["<>]/g, ""), address: ACCES[boite].user },
      to: liste(c.to), cc: liste(c.cc), bcc: liste(c.bcc),
      replyTo: adresse(c.replyTo) ?? { name: String(c.sender?.name ?? "Ewen Soupault").replace(/["<>]/g, ""), address: "contact@studioes.fr" },
      subject: String(c.subject ?? ""),
      ...(c.htmlContent ? { html: String(c.htmlContent) } : {}),
      ...(c.textContent ? { text: String(c.textContent) } : {}),
      ...(c.headers && typeof c.headers === "object" ? { headers: c.headers } : {}),
      ...(jointes.length ? { attachments: jointes } : {}),
    });
    const refuses = (info.rejected ?? []) as unknown[];
    if (refuses.length && !(info.accepted ?? []).length) return reponse(400, { message: `adresse refusée : ${refuses.join(", ").slice(0, 150)}` });
    return reponse(201, { messageId: String(info.messageId ?? "") });
  } catch (e) {
    console.error("smtp", boite, String(e));
    return reponse(502, { message: String(e).slice(0, 300) });
  }
}
