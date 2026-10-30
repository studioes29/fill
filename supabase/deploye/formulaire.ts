// Formulaires des sites (studioes.fr, fill.studioes.fr, dossiers.studioes.fr, piercevaltattoo.fr), à la place de FormSubmit.
// Chaque message est d'abord enregistré (table formulaire_message), puis envoyé par mail via Brevo.
// POST JSON ou multipart (pièces jointes) : champs libres ; champs réservés :
//   _subject (objet du mail), _honey (piège à robots), _next (redirection après un envoi de formulaire classique),
//   _dest ("studio" par défaut, ou "pierceval"), _replyto, _autoresponse (bons de commande), _template et _captcha ignorés.
// Réponse JSON {success:"true"} comme FormSubmit, ou redirection 303 vers _next pour un formulaire HTML classique.
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE_SECRETE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ORIGINES = [
  "https://studioes.fr", "https://www.studioes.fr", "https://fill.studioes.fr", "https://dossiers.studioes.fr",
  "https://piercevaltattoo.fr", "https://www.piercevaltattoo.fr",
];
const DEST: Record<string, { to: string; nom: string; origines: string[] }> = {
  studio: { to: Deno.env.get("ALERTE_EMAIL") ?? "contact@studioes.fr", nom: "Formulaire Studio ES", origines: ORIGINES.slice(0, 4) },
  pierceval: { to: Deno.env.get("PIERCEVAL_EMAIL") ?? "piercevaltattoo@gmail.com", nom: "Site Pierceval Tattoo", origines: ORIGINES.slice(4) },
};
const MAX_PJ = 8 * 1024 * 1024;
const MAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const cors = (req: Request) => {
  const o = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINES.includes(o) ? o : ORIGINES[0],
    "Access-Control-Allow-Headers": "content-type, accept",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
};
const json = (req: Request, d: unknown, status = 200) =>
  new Response(JSON.stringify(d), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const propre = (s: unknown, n = 5000) => String(s ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, n);
const b64 = (u: Uint8Array) => { let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };

async function brevo(corps: Record<string, unknown>) {
  const cle = Deno.env.get("BREVO_API_KEY");
  if (!cle) return false;
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(corps),
  }).catch(() => null);
  return Boolean(r?.ok);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  if (req.method !== "POST") return json(req, { success: "false", message: "Méthode" }, 405);

  const origine = req.headers.get("Origin") ?? (req.headers.get("Referer") ? new URL(req.headers.get("Referer")!).origin : "");
  if (!ORIGINES.includes(origine)) return json(req, { success: "false", message: "Origine non autorisée" }, 403);

  const champs: Record<string, string> = {};
  const pj: { name: string; content: string }[] = [];
  let taille = 0;
  const type = req.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) {
      const b = await req.json();
      for (const [k, v] of Object.entries(b ?? {})) champs[propre(k, 80)] = typeof v === "string" ? propre(v) : propre(JSON.stringify(v));
    } else {
      const fd = await req.formData();
      for (const [k, v] of fd.entries()) {
        if (typeof v === "string") { const c = propre(k, 80); champs[c] = champs[c] ? champs[c] + ", " + propre(v) : propre(v); }
        else if (v.size > 0 && (taille += v.size) <= MAX_PJ && pj.length < 6) pj.push({ name: propre(v.name, 120) || "piece-jointe", content: b64(new Uint8Array(await v.arrayBuffer())) });
      }
    }
  } catch { return json(req, { success: "false", message: "Requête illisible" }, 400); }

  const next = champs._next;
  const repondre = () => next && ORIGINES.some((o) => next.startsWith(o + "/"))
    ? new Response(null, { status: 303, headers: { Location: next } })
    : json(req, { success: "true", message: "Message envoyé" });
  if (champs._honey) return repondre(); // robot : on fait comme si

  const cle = Object.keys(DEST).find((d) => d === champs._dest) ?? (DEST.pierceval.origines.includes(origine) ? "pierceval" : "studio");
  const d = DEST[cle];
  if (!d.origines.includes(origine)) return json(req, { success: "false", message: "Destination non autorisée" }, 403);

  const sujet = propre(champs._subject, 180) || `Nouveau message depuis ${origine.replace("https://", "")}`;
  const visibles = Object.entries(champs).filter(([k, v]) => !k.startsWith("_") && v !== "");
  if (!visibles.length) return json(req, { success: "false", message: "Formulaire vide" }, 400);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, CLE_SECRETE, { auth: { persistSession: false } });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  const { count } = await sb.from("formulaire_message").select("id", { count: "exact", head: true })
    .eq("ip", ip).gte("recu_le", new Date(Date.now() - 600e3).toISOString());
  if ((count ?? 0) >= 12) return json(req, { success: "false", message: "Trop d'envois, réessayez dans quelques minutes" }, 429);
  const { data: ligne } = await sb.from("formulaire_message")
    .insert({ dest: cle, origine, sujet, champs: Object.fromEntries(visibles), ip }).select("id").single();

  const email = visibles.find(([k]) => /^(email|e-mail|mail|courriel)$/i.test(k))?.[1] ?? champs._replyto;
  const nom = visibles.find(([k]) => /^(nom|name|prenom|structure)$/i.test(k))?.[1];
  const lignes = visibles.map(([k, v]) => `<tr><th align="left" valign="top" style="padding:6px 12px 6px 0;font:600 14px Arial;color:#3D3A36;white-space:nowrap">${esc(k)}</th><td style="padding:6px 0;font:14px/1.5 Arial;color:#3D3A36;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(sujet)}</title></head><body style="margin:0;padding:24px;background:#F0EEE9"><table style="max-width:640px;width:100%;background:#fff;border-radius:12px;padding:20px"><tr><td><p style="font:700 18px Arial;color:#1E1C1A;margin:0 0 12px">${esc(sujet)}</p><table>${lignes}</table><p style="font:12px Arial;color:#8A857E;margin:16px 0 0">Envoyé depuis ${esc(origine)} le ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}.</p></td></tr></table></body></html>`;
  const texte = visibles.map(([k, v]) => `${k}: ${v}`).join("\n");
  const expediteur = Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr";

  const ok = await brevo({
    sender: { name: d.nom, email: expediteur },
    to: [{ email: d.to }],
    ...(email && MAIL.test(email) ? { replyTo: { email, ...(nom ? { name: nom.slice(0, 70) } : {}) } } : {}),
    subject: sujet, htmlContent: html, textContent: texte,
    ...(pj.length ? { attachment: pj } : {}),
  });

  // Accusé de réception au signataire d'un bon de commande (champ _autoresponse, comme FormSubmit),
  // limité aux bons de commande des dossiers pour ne pas servir de relais d'envoi.
  const ar = propre(champs._autoresponse, 2500);
  if (ar && cle === "studio" && origine === "https://dossiers.studioes.fr" && /^commande/i.test(sujet) && email && MAIL.test(email)) {
    await brevo({
      sender: { name: "Studio ES", email: expediteur },
      to: [{ email }], replyTo: { email: "contact@studioes.fr", name: "Ewen Soupault, Studio ES" },
      subject: sujet, textContent: ar,
      htmlContent: `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body style="font:15px/1.6 Arial;color:#3D3A36;white-space:pre-wrap">${esc(ar)}</body></html>`,
    });
  }
  if (ligne) await sb.from("formulaire_message").update({ envoye: ok }).eq("id", ligne.id);
  // Le message est enregistré même si l'envoi du mail échoue : on répond donc toujours « envoyé » au visiteur.
  return repondre();
});
