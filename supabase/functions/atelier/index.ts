import { CLE_PUBLIABLE, CLE_SECRETE, cors } from '../_partage/cles.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { prestation } from '../_partage/regles/offre.ts';
var json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { ...cors, "Content-Type": "application/json" } });
var CONSIGNES = `Tu rédiges, pour le service de communication externalisé Fill, le premier jet des textes d'une demande.
Fill écrit pour des communes, des collectivités et des PME. Règles :
- français soigné, ton humain, sobre, descriptif et concret ; aucun superlatif, aucune promesse, rien de « vendeur » ;
- typographie française : espaces avant « : ; ? ! », guillemets « », apostrophe ’ ; jamais de tiret long ni de tiret demi-cadratin (utiliser des parenthèses ou les deux-points) ; heures au format « 18 h 30 » ;
- n'inventer aucune information absente du brief (date, lieu, tarif, contact) : si elle manque, l'écrire entre crochets, par exemple [horaire à confirmer] ;
- publication réseaux sociaux : 400 à 700 signes, une accroche factuelle, les informations pratiques, deux ou trois mots-dièse en fin ;
- actualité du site : un titre de 70 signes au plus, un chapô de deux phrases, trois à cinq paragraphes courts, un appel final ;
- newsletter : un titre, une introduction, une rubrique par sujet ;
- communiqué de presse : titre, chapô, corps, contact presse ;
- textes d'affiche : titre, sous-titre, trois informations pratiques au plus, mention finale.
Réponds uniquement par un tableau JSON, sans autre texte.`;
var SCHEMA = `Chaque élément du tableau : { "nom": string (identifiant de fichier en minuscules et tirets), "type": "post" | "web" | "email" | "pdf" | "affiche",
"legende": string (le texte complet pour une publication ; l'adresse de la page pour une actualité ; l'objet pour une newsletter),
"contenu": { "titre"?: string, "chapo"?: string, "corps"?: string[], "sections"?: { "titre": string, "texte": string }[], "appel"?: string } }`;
var TYPES = { post: "post", actu: "web", agenda: "web", page: "web", news: "email", presse: "pdf", affiche: "affiche", gabarit: "affiche", flyer: "affiche" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = Deno.env.get("SUPABASE_URL");
  const service = createClient(url, CLE_SECRETE);
  const auth = req.headers.get("Authorization") ?? "";
  if (!CLE_SECRETE || auth !== `Bearer ${CLE_SECRETE}`) {
    const utilisateur = createClient(url, CLE_PUBLIABLE, { global: { headers: { Authorization: auth } } });
    const { data: admin } = await utilisateur.rpc("est_admin");
    if (!admin) return json({ erreur: "Réservé à Fill" }, 403);
  }
  const { demande: id, consigne = "" } = await req.json();
  const { data: d } = await service.from("demande").select("id, titre, brief, parution, urgente, organisation_id").eq("id", id).single();
  if (!d) return json({ erreur: "Demande introuvable" }, 404);
  const { data: o2 } = await service.from("organisation").select("nom, type, sans_ia").eq("id", d.organisation_id).single();
  if (o2?.sans_ia) return json({ erreur: "Ce client a refusé le premier jet automatique" }, 409);
  const { data: lignes } = await service.from("demande_ligne").select("prestation, quantite").eq("demande_id", id);
  const utiles = (lignes ?? []).filter((l) => TYPES[l.prestation]);
  if (!utiles.length) return json({ erreur: "Aucun texte à préparer pour cette demande" }, 409);
  const { data: precedent } = await service.from("brouillon").select("contenu").eq("demande_id", id).maybeSingle();
  const demandeTexte = [
    `Client : ${o2?.nom} (${o2?.type === "collectivite" ? "collectivité" : "entreprise"})`,
    `Sujet : ${d.titre}`,
    d.parution ? `Date de parution souhaitée : ${d.parution}` : "",
    `Brief du client :
${d.brief}`,
    `Textes à préparer : ${utiles.map((l) => `${l.quantite} × ${prestation(l.prestation)?.nom ?? l.prestation} (type « ${TYPES[l.prestation]} »)`).join(", ")}`,
    consigne ? `Consigne de Fill pour cette reprise : ${consigne}` : "",
    consigne && precedent ? `Jet précédent, à reprendre :
${JSON.stringify(precedent.contenu.fichiers)}` : ""
  ].filter(Boolean).join("\n\n");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": Deno.env.get("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("ATELIER_MODELE") ?? "claude-sonnet-5-5",
      max_tokens: 4e3,
      system: `${CONSIGNES}

${SCHEMA}`,
      messages: [{ role: "user", content: demandeTexte }]
    })
  });
  if (!r.ok) return json({ erreur: "Atelier indisponible", detail: await r.text() }, 502);
  const sortie = await r.json();
  const texte = sortie.content?.find((c) => c.type === "text")?.text ?? "";
  let fichiers;
  try {
    fichiers = JSON.parse(texte.slice(texte.indexOf("["), texte.lastIndexOf("]") + 1));
  } catch {
    return json({ erreur: "Réponse de l’atelier illisible" }, 502);
  }
  const nettoye = JSON.parse(JSON.stringify(fichiers).replace(/\s?[—–]\s?/g, " : "));
  const essais = (precedent?.contenu?.essais ?? 0) + 1;
  const { error } = await service.rpc("enregistrer_brouillon", { p_demande: id, p_brouillon: { fichiers: nettoye, consigne: consigne || void 0, essais } });
  if (error) return json({ erreur: error.message }, 500);
  return json({ ok: true, fichiers: nettoye.length, essais });
});
