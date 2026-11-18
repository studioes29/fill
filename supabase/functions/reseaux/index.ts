// Fonction « reseaux » : relais vers l'API Buffer (programmation des posts de Fill).
// Appelée par Hors-champ ou par une tâche, avec le jeton pilote (même contrôle que les autres fonctions).
// Corps attendu : { query: "<GraphQL Buffer>", variables?: {...} }
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const lire = (nom: string) => {
  const v = Deno.env.get(nom);
  if (!v) return undefined;
  if (!v.trim().startsWith("{")) return v;
  try { const o = JSON.parse(v); return o.default ?? Object.values(o)[0]; } catch { return undefined; }
};
const CLE = lire("CLE_SECRETE") ?? lire("SUPABASE_SECRET_KEY") ?? lire("SUPABASE_SECRET_KEYS") ?? lire("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const URL_SB = Deno.env.get("SUPABASE_URL") ?? "";
const BUFFER = Deno.env.get("BUFFER_API_KEY") ?? "";
const sb = createClient(URL_SB, CLE, { auth: { persistSession: false } });

const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const ok = Boolean(CLE) && jeton.length >= 32 && (jeton === CLE || (await sb.rpc("verifier_jeton_pilote", { p: jeton })).data === true);
  if (!ok) return json({ erreur: "accès refusé" }, 401);
  if (!BUFFER) return json({ erreur: "clé Buffer absente" }, 500);
  let corps: { query?: string; variables?: Record<string, unknown> };
  try { corps = await req.json(); } catch { return json({ erreur: "corps illisible" }, 400); }
  if (!corps.query) return json({ erreur: "requête manquante" }, 400);
  const r = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${BUFFER}` },
    body: JSON.stringify({ query: corps.query, variables: corps.variables ?? {} }),
  });
  const t = await r.text();
  return new Response(t, { status: r.status, headers: { "Content-Type": "application/json" } });
});
