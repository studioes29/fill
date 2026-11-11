// Relecture par lien : relire et valider un livrable sans compte (page fill.studioes.fr/espace/relecture/).
//
// Tout passe par POST, jamais par GET : les filtres de sécurité des messageries ouvrent les liens des mails,
// et une ouverture ne doit rien décider. Le jeton arrive dans le corps de la requête, pas dans l'adresse.
//
//   {action:"lire", j}                                  ce que la page affiche (fichiers signés pour une heure)
//   {action:"repondre", j, reponse, remarque}           « accord » ou « correction » ; décision pour un référent ou une délégation
//   {action:"inviter", j, usage, nom, fonction, email}  depuis le lien d'un référent : demander un avis ou confier la validation
//   {action:"retirer", j, lien}                         depuis le lien d'un référent : retirer une invitation encore ouverte
//   {action:"creer", demande, usage, nom, fonction, email}   depuis l'Espace (session du référent ou de son suppléant)
//
// Base : table lien_relecture et fonctions relecture_* (migration 2026-11-relecture-par-lien.sql).
// Secrets : clés Supabase, BREVO_API_KEY, EXPEDITEUR_EMAIL, SITE_URL.
import { CLE_PUBLIABLE, CLE_SECRETE, cors, SITE } from '../_partage/cles.ts';
import { gabarit } from '../_partage/courriel.ts';
import { DUREE_JOURS, JETON, empreinte, invitation, lienPage, mailInvitation, mailRetour, nouveauJeton, peutInviter, reponse } from '../_partage/regles/relecture.ts';
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const echap = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const json = (corps, status = 200) =>
  new Response(JSON.stringify(corps), { status, headers: { ...cors, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const refus = (message, status = 409) => json({ erreur: message }, status);
// message d'une exception levée par la base (« raise exception »), sinon message neutre
const motif = (e) => (e?.code === "P0001" && e.message ? e.message : "Cette action n’a pas pu aboutir. Réessayez dans un instant.");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return refus("Méthode refusée", 405);
  let s;
  try { s = await req.json(); } catch { return refus("Requête illisible", 400); }
  const url = Deno.env.get("SUPABASE_URL");
  const admin = createClient(url, CLE_SECRETE, { auth: { persistSession: false } });

  const envoyer = async (org, m) => {
    const cle = Deno.env.get("BREVO_API_KEY");
    if (!cle || !m?.a?.length) return false;
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Fill", email: Deno.env.get("EXPEDITEUR_EMAIL") ?? "contact@studioes.fr" },
        to: m.a,
        replyTo: m.repondreA ?? { email: "contact@studioes.fr", name: "Ewen Soupault, Fill" },
        subject: `${org?.essai ? "[Test] " : ""}${m.sujet}`,
        htmlContent: gabarit({ titre: m.titre, texte: m.texte, bouton: m.bouton, apres: m.apres }),
      }),
    }).catch(() => null);
    return Boolean(r?.ok);
  };
  const organisation = async (id) => (await admin.from("organisation").select("id, nom, essai").eq("id", id).single()).data;
  const profil = async (id) => id ? (await admin.from("profil").select("id, nom, email, role, organisation_id, actif, suppleant_jusqu_au").eq("id", id).maybeSingle()).data : null;
  const creer = async (demande, usage, nom, fonction, email, par, parent) => {
    const jeton = nouveauJeton();
    const { data, error } = await admin.rpc("relecture_creer", {
      p_demande: demande, p_usage: usage, p_nom: nom, p_fonction: fonction, p_email: email,
      p_empreinte: await empreinte(jeton), p_par: par ?? null, p_parent: parent ?? null, p_jours: DUREE_JOURS,
    });
    return error ? { erreur: motif(error) } : { id: data, jeton };
  };
  // invitation d'un relecteur, puis son e-mail ; « de » est le référent qui invite
  const inviter = async (demandeId, de, saisie, parent) => {
    const v = invitation(saisie);
    if (v.erreur) return refus(v.erreur, 400);
    if (de?.email && v.email === String(de.email).toLowerCase()) return refus("Cette adresse est la vôtre : indiquez celle de la personne qui doit relire.", 400);
    const { data: d } = await admin.from("demande").select("id, titre, organisation_id").eq("id", demandeId).single();
    if (!d) return refus("Demande introuvable", 404);
    const o = await organisation(d.organisation_id);
    const l = await creer(d.id, v.usage, v.nom, v.fonction, v.email, de?.id, parent);
    if (l.erreur) return refus(l.erreur);
    const t = mailInvitation({ usage: v.usage, demandeur: echap(de?.nom ?? o.nom), organisation: echap(o.nom), titre: echap(d.titre) });
    const parti = await envoyer(o, {
      a: [{ email: v.email, name: v.nom }],
      repondreA: de?.email ? { email: de.email, name: de.nom } : void 0,
      sujet: mailInvitation({ usage: v.usage, demandeur: de?.nom ?? o.nom, organisation: o.nom, titre: d.titre }).sujet,
      titre: t.titre, texte: t.texte, apres: t.apres,
      bouton: { libelle: t.bouton, lien: lienPage(SITE, l.jeton) },
    });
    if (!parti) {
      await admin.rpc("relecture_retirer", { p_lien: l.id });
      return refus("Le message n’a pas pu partir. Vérifiez l’adresse et réessayez.", 502);
    }
    return json({ ok: true, lien: l.id, nom: v.nom, usage: v.usage });
  };

  // depuis l'Espace : session du référent (ou de son suppléant)
  if (s.action === "creer") {
    const sb = createClient(url, CLE_PUBLIABLE, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: u } = await sb.auth.getUser();
    if (!u?.user) return refus("Connexion requise", 401);
    const moi = await profil(u.user.id);
    const { data: d } = await admin.from("demande").select("id, organisation_id").eq("id", s.demande).maybeSingle();
    if (!d || !peutInviter(moi, d.organisation_id, new Date().toISOString().slice(0, 10))) return refus("Seul le référent peut faire relire une version.", 403);
    return inviter(d.id, moi, s);
  }

  // depuis la page de relecture : tout repose sur le jeton
  if (typeof s.j !== "string" || !JETON.test(s.j)) return json({ etat: "inconnu" }, 404);
  const e = await empreinte(s.j);
  const { data: vue, error: errVue } = await admin.rpc("relecture_lire", { p_empreinte: e });
  if (errVue) return refus(motif(errVue), 500);
  if (!vue || vue.etat === "inconnu") return json({ etat: "inconnu" }, 404);

  if (s.action === "lire") {
    const ouvert = vue.etat === "ouvert";
    // les fichiers ne sont servis que tant que le lien est ouvert
    const fichiers = ouvert
      ? await Promise.all((vue.version.fichiers ?? []).map(async (f) => {
          const { chemin, ...reste } = f ?? {};
          return chemin ? { ...reste, src: (await admin.storage.from("fichiers").createSignedUrl(chemin, 3600)).data?.signedUrl } : reste;
        }))
      : [];
    const invitations = ouvert && vue.usage === "referent"
      ? ((await admin.from("lien_relecture").select("id, usage, nom, fonction, reponse, remarque, repondu_le, revoque_le, expire").eq("demande_id", vue.demande.id).eq("version_id", vue.version_id).in("usage", ["avis", "delegation"]).order("cree")).data ?? [])
          .filter((x) => !x.revoque_le)
          .map((x) => ({ id: x.id, usage: x.usage, nom: x.nom, fonction: x.fonction, reponse: x.reponse, remarque: x.remarque, ouvert: !x.reponse && new Date(x.expire).getTime() > Date.now() }))
      : [];
    return json({
      etat: vue.etat, usage: vue.usage, nom: vue.nom, reponse: vue.reponse, expire: vue.expire, demandeur: vue.demandeur,
      organisation: vue.organisation, cible: vue.type_organisation === "entreprise" ? "e" : "c",
      demande: ouvert ? { titre: vue.demande.titre, parution: vue.demande.parution, heure: vue.demande.heure, corrections_restantes: vue.demande.corrections_restantes } : { titre: vue.demande.titre },
      version: ouvert ? { numero: vue.version.numero, note: vue.version.note, date: vue.version.date, fichiers } : null,
      invitations, espace: SITE,
    });
  }

  if (s.action === "repondre") {
    const v = reponse(s);
    if (v.erreur) return refus(v.erreur, 400);
    const { data: r, error } = await admin.rpc("relecture_repondre", { p_empreinte: e, p_reponse: v.reponse, p_remarque: v.remarque });
    if (error) return refus(motif(error));
    const { data: d } = await admin.from("demande").select("id, titre, organisation_id").eq("id", r.demande).single();
    const o = await organisation(d.organisation_id);
    const ref = await profil(r.par);
    const qui = echap(vue.nom);
    if (r.decision) {
      // Fill reçoit le même message que pour une validation faite dans l'Espace
      await fetch(`${url}/functions/v1/notifier`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CLE_SECRETE}`, "content-type": "application/json" },
        body: JSON.stringify({ evenement: "statut", demande: d.id }),
      }).catch(() => null);
      if (vue.usage === "delegation" && ref?.email) {
        const t = mailRetour({ usage: "delegation", qui, reponse: v.reponse, remarque: echap(v.remarque ?? ""), titre: echap(d.titre) });
        await envoyer(o, { a: [{ email: ref.email, name: ref.nom }], sujet: mailRetour({ usage: "delegation", qui: vue.nom, reponse: v.reponse, titre: d.titre }).sujet, titre: t.titre, texte: t.texte, bouton: { libelle: "Voir la demande", lien: `${SITE}/#demande-${d.id}` } });
      }
    } else if (ref?.email) {
      // un avis : le référent reçoit la réponse et un nouveau lien pour décider
      const l = await creer(d.id, "referent", ref.nom, null, ref.email, ref.id, vue.lien);
      const t = mailRetour({ usage: "avis", qui, reponse: v.reponse, remarque: echap(v.remarque ?? ""), titre: echap(d.titre) });
      await envoyer(o, { a: [{ email: ref.email, name: ref.nom }], sujet: mailRetour({ usage: "avis", qui: vue.nom, reponse: v.reponse, titre: d.titre }).sujet, titre: t.titre, texte: t.texte, bouton: { libelle: t.bouton, lien: l.jeton ? lienPage(SITE, l.jeton) : `${SITE}/#demande-${d.id}` } });
    }
    return json({ ok: true, decision: r.decision, statut: r.statut, usage: vue.usage });
  }

  // les deux actions suivantes sont réservées au lien d'un référent encore ouvert
  if (vue.usage !== "referent" || vue.etat !== "ouvert") return refus("Ce lien ne permet pas cette action.", 403);
  const { data: l } = await admin.from("lien_relecture").select("id, demande_id, cree_par, email, nom").eq("id", vue.lien).single();
  const referent = (await profil(l.cree_par)) ?? { id: null, nom: l.nom, email: l.email };

  if (s.action === "inviter") return inviter(l.demande_id, referent, s, l.id);

  if (s.action === "retirer") {
    const { data: cible } = await admin.from("lien_relecture").select("id, demande_id, usage").eq("id", s.lien).maybeSingle();
    if (!cible || cible.demande_id !== l.demande_id || cible.usage === "referent") return refus("Invitation introuvable", 404);
    await admin.rpc("relecture_retirer", { p_lien: cible.id });
    return json({ ok: true });
  }

  return refus("Action inconnue", 400);
});
