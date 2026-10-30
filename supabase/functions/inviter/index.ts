import { CLE_PUBLIABLE, CLE_SECRETE, cors, SITE } from '../_partage/cles.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
var json = (corps, status = 200) => new Response(JSON.stringify(corps), { status, headers: { ...cors, "content-type": "application/json" } });
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = Deno.env.get("SUPABASE_URL");
  const moiSb = createClient(url, CLE_PUBLIABLE, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  const { data: u } = await moiSb.auth.getUser();
  if (!u.user) return json({ erreur: "Connexion requise" }, 401);
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });
  const { data: moi } = await admin.from("profil").select("id, nom, role, organisation_id, actif").eq("id", u.user.id).single();
  if (!moi || !moi.actif || moi.role !== "referent") return json({ erreur: "Seul le référent invite ses collègues" }, 403);
  const { data: org } = await admin.from("organisation").select("id, nom, statut").eq("id", moi.organisation_id).single();
  if (!org || org.statut === "resiliee") return json({ erreur: "Structure introuvable" }, 404);
  const { nom, email, role, plafond } = await req.json();
  const adresse = String(email ?? "").trim().toLowerCase();
  const nomPropre = String(nom ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) return json({ erreur: "Adresse e-mail invalide" }, 400);
  if (nomPropre.length < 2) return json({ erreur: "Indiquez le nom de la personne" }, 400);
  if (role !== "contributeur" && role !== "lecteur") return json({ erreur: "Rôle inconnu" }, 400);
  const { count } = await admin.from("profil").select("id", { count: "exact", head: true }).eq("organisation_id", org.id).eq("actif", true);
  if ((count ?? 0) >= 25) return json({ erreur: "Vingt-cinq personnes au plus par espace" }, 400);
  const { data: existant } = await admin.from("profil").select("id, organisation_id, actif").ilike("email", adresse).maybeSingle();
  if (existant && existant.organisation_id !== org.id) return json({ erreur: "Cette adresse a déjà un accès Fill pour une autre structure" }, 409);
  if (existant?.actif) return json({ erreur: "Cette personne a déjà accès à votre espace" }, 409);
  const plafondMensuel = role === "contributeur" ? Math.max(0, Math.min(500, Math.round(Number(plafond) || 0))) : 0;
  if (existant) {
    await admin.from("profil").update({ actif: true, role, plafond_mensuel: plafondMensuel, nom: nomPropre }).eq("id", existant.id);
    await admin.auth.resetPasswordForEmail(adresse, { redirectTo: `${SITE}/` });
    return json({ id: existant.id, rouvert: true });
  }
  const { data: inv, error } = await admin.auth.admin.inviteUserByEmail(adresse, {
    redirectTo: `${SITE}/`,
    data: { organisation: org.nom, invite_par: moi.nom }
  });
  if (error || !inv.user) {
    const deja = /already|registered|exists/i.test(error?.message ?? "");
    return json({ erreur: deja ? "Cette adresse a déjà un compte Fill" : "Invitation impossible pour le moment" }, deja ? 409 : 502);
  }
  const { error: e2 } = await admin.from("profil").insert({ id: inv.user.id, nom: nomPropre, email: adresse, role, organisation_id: org.id, plafond_mensuel: plafondMensuel });
  if (e2) {
    await admin.auth.admin.deleteUser(inv.user.id);
    return json({ erreur: "Invitation impossible pour le moment" }, 500);
  }
  await admin.rpc("journaliser", { org: org.id, act: "invitation", cib: inv.user.id, det: { role, par: moi.id } }).then(() => null, () => null);
  return json({ id: inv.user.id });
});
