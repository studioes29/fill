// Lien « ne plus recevoir » des envois automatiques.
// Un GET (clic humain OU robot de sécurité d'une messagerie) n'inscrit RIEN : il renvoie vers la page de confirmation
// du site, https://studioes.fr/desinscription/ (Supabase sert le HTML d'une fonction en texte brut : un bouton ne s'y affiche pas).
// Seul un POST inscrit l'adresse : le bouton de cette page, ou le désabonnement en un clic des messageries (List-Unsubscribe-Post).
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL")!;
const PAGE = "https://studioes.fr/desinscription/";
const sb = createClient(URL_SB, CLE, { auth: { persistSession: false } });
const enc = new TextEncoder();
const signer = async (txt: string) => {
  const k = await crypto.subtle.importKey("raw", enc.encode(CLE), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(txt)));
  return btoa(String.fromCharCode(...s)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" } as Record<string, string>)[c]).slice(0, 32);
};
const cors = { "access-control-allow-origin": "https://studioes.fr", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", "vary": "origin" };
const json = (x: unknown, status = 200) => new Response(JSON.stringify(x), { status, headers: { ...cors, "content-type": "application/json; charset=utf-8" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const u = new URL(req.url);
  const e = (u.searchParams.get("e") ?? "").toLowerCase().trim(), s = u.searchParams.get("s") ?? "";
  const valide = e.includes("@") && s === await signer("stop:" + e);
  if (req.method === "POST") {
    if (!valide) return json({ ok: false, raison: "lien invalide" }, 400);
    await sb.from("mail_stop").upsert({ email: e });
    await sb.rpc("sequence_desinscrire", { p_email: e }).then(() => null, () => null);
    return json({ ok: true });
  }
  const suite = `?e=${encodeURIComponent(e)}&s=${encodeURIComponent(s)}${valide ? "" : "&invalide=1"}`;
  return new Response(null, { status: 302, headers: { location: PAGE + suite, "cache-control": "no-store" } });
});
