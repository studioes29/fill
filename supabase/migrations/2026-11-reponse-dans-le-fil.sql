-- 10 nov 2026 : une réponse à un prospect part de contact@studioes.fr, dans le fil du premier message.
-- La séquence de réponse (type « client », fiche « <id>:reponse », créée par Hors-champ) note dans suite_de la fiche
-- de la séquence de prospection à laquelle elle fait suite ; sequence_dus reprend alors l'identifiant Brevo du dernier
-- message envoyé de cette séquence, que la fonction envoi pose en In-Reply-To et References.
-- Déjà appliquée sur le projet nfnbseonwgmtouxsaajd (migration « reponse_dans_le_fil »).
alter table public.sequence add column if not exists suite_de text;

create or replace function public.sequence_planifier(p jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  e text := lower(trim(p->>'email'));
  typ text := coalesce(p->>'type','prospection');
  s uuid; m jsonb; i int := 0; base timestamptz := now(); t timestamptz; dates jsonb := '[]';
begin
  if e !~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' then return jsonb_build_object('ok', false, 'raison', 'adresse invalide'); end if;
  if exists (select 1 from mail_stop where email = e) then return jsonb_build_object('ok', false, 'raison', 'cette personne ne souhaite plus recevoir de mails'); end if;
  if jsonb_array_length(coalesce(p->'messages','[]')) = 0 then return jsonb_build_object('ok', false, 'raison', 'aucun message'); end if;
  if typ = 'prospection' and exists (select 1 from sequence where lower(email) = e and statut = 'repondu' and maj > now() - interval '120 days')
    then return jsonb_build_object('ok', false, 'raison', 'elle a déjà répondu : réponds-lui directement'); end if;
  update sequence set statut = 'annulee', raison = 'remplacée', maj = now() where fiche = p->>'fiche' and type = typ and statut = 'active';
  update sequence_message set statut = 'annule' where statut = 'prevu' and sequence_id in (select id from sequence where fiche = p->>'fiche' and statut = 'annulee');
  insert into sequence (fiche, marque, type, campagne, nom, email, cc, suite_de)
  values (p->>'fiche', p->>'marque', typ, nullif(p->>'campagne',''), coalesce(p->>'nom',''), e, nullif(lower(trim(p->>'cc')),''), nullif(trim(p->>'suite_de'),''))
  returning id into s;
  for m in select * from jsonb_array_elements(p->'messages') loop
    i := i + 1;
    if typ = 'prospection' then
      -- les relances comptent leurs jours ouvrés depuis le premier envoi prévu
      if i = 1 then t := creneau_prospection(base, coalesce((m->>'apres')::int, 0)); base := t;
      else t := creneau_prospection(base, coalesce((m->>'apres')::int, 5)); end if;
    else
      if i = 1 then t := creneau_envoi(base, coalesce((m->>'apres')::int, 0));
      else t := creneau_envoi(base, coalesce((m->>'apres')::int, 5)); end if;
    end if;
    insert into sequence_message (sequence_id, rang, objet, corps, prevu, pj)
    values (s, i, m->>'objet', m->>'corps', t, case when jsonb_typeof(m->'pj') = 'array' and jsonb_array_length(m->'pj') > 0 then m->'pj' end);
    dates := dates || to_jsonb(t);
  end loop;
  return jsonb_build_object('ok', true, 'id', s, 'dates', dates);
end $function$;

create or replace function public.sequence_dus(lim integer)
 returns table(message_id uuid, sequence_id uuid, rang integer, objet text, corps text, email text, cc text, nom text, marque text, type text, precedent text)
 language sql
 security definer
 set search_path to 'public'
as $function$
  select m.id, s.id, m.rang, m.objet, m.corps, s.email, s.cc, s.nom, s.marque, s.type,
    coalesce(
      (select p.brevo_id from sequence_message p where p.sequence_id = s.id and p.rang < m.rang and p.statut = 'envoye' order by p.rang desc limit 1),
      case when s.suite_de is not null then
        (select p.brevo_id from sequence_message p join sequence o on o.id = p.sequence_id
          where o.fiche = s.suite_de and o.id <> s.id and p.statut = 'envoye' and coalesce(p.brevo_id, '') <> ''
          order by p.envoye_le desc nulls last limit 1) end)
  from sequence_message m join sequence s on s.id = m.sequence_id
  where m.statut = 'prevu' and m.prevu <= now() and s.statut = 'active'
    and not exists (select 1 from sequence_message q where q.sequence_id = s.id and q.rang < m.rang and q.statut = 'prevu')
  order by m.prevu limit lim
$function$;
