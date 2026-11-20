"""Série « Une semaine de com dans une commune de 3 000 habitants » : 6 épisodes de 5 pages.
Couverture lavande foncée (couleur propre à la série), pages ton sur ton lavande.
Rendu : python3 serie_semaine.py [n°] puis render.py sw<n>-01..05."""
import sys
import guide2 as G2
from lgen import C, MOTIF, NB, logo, motif, head, check, arrow, page
from guide2 import img, ico, tagc, F_D, phone

N = 5
SH = '0 50px 90px -46px rgba(30,12,70,.55)'


def mot(col):
    return motif(col, 2300, 120, -420)


def ttl(t1, t2, dark=False, top=168, fs=84):
    tc, ic = (C['sable'], C['lavc']) if dark else (C['encre'], C['lavt'])
    return (f'<div style="position:absolute;left:88px;right:88px;top:{top}px"><div class="D" style="font-weight:650;font-size:{fs}px;line-height:.96;letter-spacing:-.04em;color:{tc}">{t1}</div>'
            f'<div class="I" style="font-size:{round(fs*.86)}px;line-height:1.06;letter-spacing:-.02em;color:{ic};margin-top:6px">{t2}</div></div>')


def note(txt, top, dark=False, fs=29):
    col = 'rgba(248,245,242,.82)' if dark else 'rgba(26,26,26,.7)'
    return f'<div style="position:absolute;left:88px;right:88px;top:{top}px;font-weight:500;font-size:{fs}px;line-height:1.42;color:{col}">{txt}</div>'


def card(x, y, w, inner, rot=0, pad='30px 36px', rad=36, h=None):
    hh = f'height:{h}px;box-sizing:border-box;' if h else ''
    return f'<div class="card" style="left:{x}px;top:{y}px;width:{w}px;{hh}padding:{pad};border-radius:{rad}px;transform:rotate({rot}deg)">{inner}</div>'


def av(t, bg, fg=C['encre'], s=54):
    return f'<span style="flex:none;width:{s}px;height:{s}px;border-radius:50%;background:{bg};color:{fg};display:grid;place-items:center;font-weight:700;font-size:{round(s*.36)}px">{t}</span>'


# ================= les maquettes =================
def m_inbox(w=904, n=5):
    rows = [('AB', '#E9E1FF', 'Association Les Amis du bourg', 'Le loto du 17 : sur le site et Facebook ?', '8 h 02'),
            ('AF', '#FFE0D5', 'Adjoint aux fêtes', 'Photos de la cérémonie, à publier vite', '8 h 15'),
            ('ST', '#DFEEE6', 'Services techniques', 'Travaux rue de l’École à partir de jeudi', '8 h 31'),
            ('UH', '#FFD36B', 'Un habitant', 'L’agenda affiche encore la fête de l’été', '8 h 47'),
            ('CF', '#B8A4FF', 'Club de football', 'L’affiche du tournoi en pièce jointe', '8 h 58')][:n]
    out = (f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:18px">'
           f'<span style="display:flex;align-items:center;gap:14px;{F_D};font-weight:700;font-size:32px">{ico("mail", 32)}Boîte de la mairie</span>'
           f'<span class="tag" style="background:{C["lavf"]};color:{C["sable"]}">Non lus</span></div>')
    for i, (a, bg, n_, s, h) in enumerate(rows):
        out += (f'<div style="display:flex;align-items:center;gap:20px;height:96px;border-top:2px solid rgba(26,26,26,.07)">{av(a, bg)}'
                f'<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:24px">{n_}</div><div style="margin-top:3px;font-weight:500;font-size:22px;color:rgba(26,26,26,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{s}</div></div>'
                f'<span style="font-weight:600;font-size:20px;color:rgba(26,26,26,.45)">{h}</span></div>')
    return out


def m_voeux():
    items = [('Invitation', '4 semaines avant'), ('Publication d’annonce', '3 semaines avant'), ('Diaporama de l’année', '2 semaines avant'),
             ('Discours mis en page', 'la semaine d’avant'), ('Photos de la soirée', 'le jour même'), ('Article du bulletin', 'après')]
    out = (f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px">'
           f'<span style="{F_D};font-weight:700;font-size:32px">Cérémonie des vœux</span><span class="tag" style="background:{C["lavc"]};color:{C["lavt"]}">6 supports</span></div>')
    for i, (t, q) in enumerate(items):
        out += (f'<div style="display:flex;align-items:center;gap:18px;height:84px;border-top:2px solid rgba(26,26,26,.07)">'
                f'<span style="flex:none;width:40px;height:40px;border-radius:50%;background:{C["lavf"] if i < 3 else "transparent"};box-shadow:inset 0 0 0 3px {C["lavf"]};display:grid;place-items:center">{check(C["sable"], 22) if i < 3 else ""}</span>'
                f'<span style="flex:1;font-weight:600;font-size:27px">{t}</span><span style="font-weight:600;font-size:21px;color:{C["lavt"]}">{q}</span></div>')
    return out


def m_site():
    ag = (f'<div style="display:flex;align-items:center;gap:14px;padding-bottom:16px;{F_D};font-weight:700;font-size:30px">{ico("pin", 30)}Agenda du site</div>'
          f'<div style="display:flex;align-items:center;gap:22px;padding:18px 20px;border-radius:22px;background:rgba(26,26,26,.04)">'
          f'<div style="flex:none;width:92px;height:92px;border-radius:20px;background:{C["corc"]};display:flex;flex-direction:column;align-items:center;justify-content:center;color:{C["cort"]}">'
          f'<span style="{F_D};font-weight:800;font-size:40px;line-height:1">14</span><span style="font-weight:700;font-size:18px">juil.</span></div>'
          f'<div style="flex:1"><div style="font-weight:700;font-size:27px;text-decoration:line-through;text-decoration-color:rgba(154,66,50,.6)">Fête de l’été</div>'
          f'<div style="margin-top:4px;font-weight:500;font-size:21px;color:rgba(26,26,26,.55)">Toujours en tête de l’agenda en décembre</div></div></div>')
    hor = ''.join(f'<div style="flex:1;padding:18px 18px 20px;border-radius:22px;background:{bg}">'
                  f'<div style="font-weight:700;font-size:19px;letter-spacing:.06em;text-transform:uppercase;color:{fg}">{t}</div>'
                  f'<div style="margin-top:8px;{F_D};font-weight:700;font-size:28px;line-height:1.1">{h}</div></div>'
                  for t, h, bg, fg in [('Site', '8 h 30<br>à 12 h', C['lavc'], C['lavt']), ('Google', '9 h<br>à 12 h', C['corc'], C['cort']), ('Porte', '8 h 30<br>à 12 h 30', C['lavc'], C['lavt'])])
    return ag + f'<div style="margin-top:26px;font-weight:700;font-size:24px">Les horaires du lundi, selon où l’on regarde</div><div style="display:flex;gap:14px;margin-top:14px">{hor}</div>'


def m_alerte(w=300):
    sc = (f'<div style="position:absolute;inset:0;background:{C["sable"]}">'
          f'<div style="position:absolute;left:18px;right:18px;top:60px;padding:16px;border-radius:18px;background:#fff;box-shadow:0 10px 24px -14px rgba(0,0,0,.4)">'
          f'<div style="display:flex;align-items:center;gap:10px"><span style="width:30px;height:30px;border-radius:8px;background:{C["cor"]};display:grid;place-items:center;color:#fff;font-weight:800;font-size:18px">!</span>'
          f'<b style="font-size:17px">Mairie</b><span style="margin-left:auto;font-size:14px;color:rgba(26,26,26,.45)">16 h 05</span></div>'
          f'<div style="margin-top:10px;{F_D};font-weight:700;font-size:24px;line-height:1.05">Route fermée</div>'
          f'<div style="margin-top:6px;font-size:16px;line-height:1.35;color:rgba(26,26,26,.7)">Arbre tombé : la route de la zone artisanale est fermée jusqu’à demain.</div></div></div>')
    return phone(0, 0, w, 0, sc, h=round(w * 1.9))


def m_modele():
    hl = lambda t: f'<span style="padding:0 .25em;border-radius:8px;background:{C["lavc"]};color:{C["lavt"]};font-weight:700">{t}</span>'
    txt = (f'La route {hl("[lieu]")} est fermée jusqu’à {hl("[heure]")} en raison de {hl("[motif]")}. Déviation par {hl("[itinéraire]")}.')
    out = (f'<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px"><span style="{F_D};font-weight:700;font-size:30px">Message type</span>'
           f'<span class="tag" style="background:{C["lavf"]};color:{C["sable"]}">Prêt à compléter</span></div>'
           f'<div style="font-weight:500;font-size:28px;line-height:1.5">{txt}</div>'
           f'<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:22px">'
           + ''.join(f'<span class="tag" style="background:rgba(26,26,26,.05);color:rgba(26,26,26,.65)">{t}</span>' for t in ['Coupure d’eau', 'Alerte météo', 'Report d’événement', 'Fin de l’alerte']) + '</div>')
    return out


def m_reseaux():
    com = [('MP', '#FFE0D5', 'Quand passent les encombrants ?'), ('JL', '#DFEEE6', 'Qui peut réparer le lampadaire rue des Écoles ?'), ('SR', '#FFD36B', 'Et pour le stationnement pendant les travaux ?')]
    out = (f'<div style="display:flex;align-items:center;gap:14px">{av("M", C["lavf"], C["sable"], 50)}<div><div style="font-weight:700;font-size:23px">Mairie</div>'
           f'<div style="font-size:18px;color:rgba(26,26,26,.5)">Publication · Les vœux en images</div></div></div>'
           f'<div style="position:relative;height:230px;margin-top:16px;border-radius:22px;overflow:hidden">{img("village-lumieres")}'
           f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,10,40,0) 40%,rgba(20,10,40,.7))"></div>'
           f'<span style="position:absolute;left:22px;bottom:16px;{F_D};font-weight:700;font-size:34px;color:{C["sable"]}">Merci d’être venus</span></div>')
    for a, bg, t in com:
        out += (f'<div style="display:flex;align-items:flex-start;gap:14px;margin-top:16px">{av(a, bg, s=44)}'
                f'<div style="padding:12px 18px;border-radius:20px;background:rgba(26,26,26,.05);font-weight:500;font-size:22px;line-height:1.35">{t}</div></div>')
    return out


def m_bilan():
    eps = [('Lundi, 9 h', 'La boîte de réception'), ('Les vœux', 'Une soirée, des semaines'), ('Le site', 'Ce qui périme en premier'), ('L’imprévu', 'Jeudi, 16 h'), ('Les réseaux', 'Après la publication')]
    out = ''
    for i, (t, s) in enumerate(eps):
        out += (f'<div style="display:flex;align-items:center;gap:22px;height:104px;{"border-top:2px solid rgba(26,26,26,.07)" if i else ""}">'
                f'<span style="flex:none;width:60px;height:60px;border-radius:18px;background:{C["lavc"]};display:grid;place-items:center;{F_D};font-weight:800;font-size:28px;color:{C["lavt"]}">{i + 1}</span>'
                f'<div><div style="{F_D};font-weight:700;font-size:30px">{t}</div><div style="margin-top:2px;font-weight:500;font-size:21px;color:rgba(26,26,26,.55)">{s}</div></div></div>')
    return out


# ================= les épisodes =================
EP = [
 dict(slug='boite', date='mardi 5 janvier', titre='Lundi, 9 h', cov=('Lundi, 9 h.', 'la boîte de réception.'),
      p2=('Cinq demandes,', 'avant 9 h.'), m='inbox',
      cap='La boîte s’ouvre sur le week-end. Aucune de ces demandes n’attend la même chose, ni pour le même jour.',
      p3=('Aucune de ces demandes n’est difficile.', 'Ce qui pèse, c’est qu’elles arrivent toutes au même endroit, sans ordre de priorité.'),
      p3s='Dans beaucoup de communes de cette taille, c’est le secrétariat de mairie qui s’en charge, entre l’état civil et l’urbanisme.',
      p4=('Le réflexe', 'qui change la semaine.'), gestes=['Un seul point d’entrée : une adresse ou un formulaire', 'La date de parution souhaitée, demandée à chaque fois', 'Le tri le lundi, la publication dans l’ordre'],
      texte="""Une semaine de com dans une commune de 3 000 habitants. Épisode 1 sur 6 : lundi, 9 h.

La boîte de réception de la mairie s'ouvre sur le week-end. Une association demande que son loto soit annoncé sur le site et sur Facebook. Un adjoint transmet des photos de la cérémonie de samedi, à publier « rapidement ». Les services techniques signalent des travaux rue de l'École à partir de jeudi. Un habitant demande pourquoi l'agenda affiche encore la fête de l'été.

Aucune de ces demandes n'est difficile. Ce qui pèse, c'est qu'elles arrivent toutes au même endroit, sans ordre de priorité, chez une personne dont la communication n'est pas le métier principal.

Le réflexe qui change la semaine : un seul point d'entrée pour les demandes, avec la date souhaitée de parution. On trie le lundi, on publie dans l'ordre.""",
      tags='#communication #collectivites #communes #communicationpublique'),
 dict(slug='voeux', date='mardi 12 janvier', titre='Les vœux', cov=('Les vœux.', 'une soirée, des semaines.'),
      p2=('La préparation', 'commence dès décembre.'), m='voeux',
      cap='L’invitation, l’annonce, le diaporama, le discours, les photos, l’article : six supports pour une soirée.',
      p3=('Le plus long,', 'ce n’est pas la mise en page.'),
      p3s='C’est de retrouver le contenu : les photos de l’année dispersées dans plusieurs téléphones, les chiffres des travaux réalisés, la liste des nouveaux commerces et des naissances.',
      p4=('Une habitude', 'règle l’essentiel.'), gestes=['Un dossier partagé « année en cours », ouvert dès janvier', 'Un sous-dossier par mois, alimenté au fil de l’eau', 'En décembre, le diaporama se construit en une matinée'],
      texte="""Une semaine de com dans une commune de 3 000 habitants. Épisode 2 sur 6 : les vœux.

La cérémonie dure une soirée. Sa préparation commence dès décembre : l'invitation, la publication d'annonce, le diaporama de l'année, le discours mis en page, les photos de la soirée, l'article du bulletin.

Ce qui prend le plus de temps n'est pas la mise en page. C'est de retrouver le contenu : les photos de l'année dispersées dans plusieurs téléphones, les chiffres des travaux réalisés, la liste des nouveaux commerces et des naissances.

Une habitude règle l'essentiel : un dossier partagé « année en cours », alimenté au fil des mois, avec un sous-dossier par mois. En décembre, le diaporama se construit en une matinée.""",
      tags='#communication #collectivites #voeux #communes'),
 dict(slug='site', date='mardi 19 janvier', titre='Le site et le panneau', cov=('Le site.', 'ce qui périme en premier.'),
      p2=('Mardi, le tour', 'des supports.'), m='site',
      cap='Le site, la page Facebook, le panneau lumineux, les vitrines, le bulletin : tout ne vieillit pas à la même vitesse.',
      p3=('Ce qui périme en premier, c’est l’agenda du site.', 'Personne ne le supprime, personne ne le remplace.'),
      p3s='Et l’habitant qui tombe dessus conclut que la mairie ne communique pas.',
      p4=('Trois gestes,', 'chaque semaine.'), gestes=['Retirer de l’agenda ce qui est passé', 'Publier au moins une actualité, même courte : un horaire, des travaux, un compte rendu', 'Les mêmes horaires partout : site, fiche Google, porte de la mairie'],
      texte="""Une semaine de com dans une commune de 3 000 habitants. Épisode 3 sur 6 : le site et le panneau.

Mardi matin, on fait le tour des supports : le site, la page Facebook, le panneau lumineux s'il y en a un, les vitrines d'affichage, le bulletin.

Ce qui périme en premier, ce n'est jamais le bulletin. C'est l'agenda du site et la rubrique actualités : personne ne les supprime, personne ne les remplace, et l'habitant qui tombe dessus conclut que la mairie ne communique pas.

Trois gestes simples, chaque semaine : retirer de l'agenda ce qui est passé ; publier au moins une actualité, même courte ; vérifier que les horaires d'ouverture sont les mêmes partout (site, fiche Google, porte de la mairie). Le dernier point génère à lui seul une bonne partie des appels à l'accueil.""",
      tags='#communication #collectivites #sitesinternet #communes'),
 dict(slug='imprevu', date='mardi 26 janvier', titre='L’imprévu', cov=('L’imprévu.', 'jeudi, 16 h.'),
      p2=('Un arbre tombe,', 'la route est fermée.'), m='alerte',
      cap='Ou une coupure d’eau annoncée par le syndicat. Ou une vigilance orange vent. L’information existe : reste à savoir en combien de temps elle arrive chez les habitants.',
      p3=('Ce qui fait gagner du temps', 'se prépare avant le jour J.'),
      p3s='Et le lendemain, un message de fin : « la route est rouverte ». C’est celui qu’on oublie le plus souvent.',
      p4=('Prêt avant', 'l’imprévu.'), gestes=['Des messages types déjà rédigés, où il ne reste que le lieu et l’heure', 'Deux personnes qui ont les accès aux réseaux et au site, pas une seule', 'Un ordre de diffusion décidé à l’avance : réseaux, site, application, affichage'],
      texte="""Une semaine de com dans une commune de 3 000 habitants. Épisode 4 sur 6 : l'imprévu.

Jeudi, 16 h. Un arbre est tombé, la route de la zone artisanale est fermée jusqu'au lendemain. Ou une coupure d'eau est annoncée par le syndicat. Ou une vigilance orange vent.

L'information existe. La question est : en combien de temps arrive-t-elle chez les habitants, et par où ?

Ce qui fait gagner du temps le jour J se prépare avant : des messages types déjà rédigés, où il ne reste qu'à compléter le lieu et l'heure ; deux personnes qui ont les accès aux réseaux et au site ; un ordre de diffusion décidé à l'avance.

Et le lendemain, un message de fin : « la route est rouverte ». C'est celui qu'on oublie le plus souvent.""",
      tags='#communication #collectivites #communicationdecrise #communes'),
 dict(slug='reseaux', date='mardi 2 février', titre='Les réseaux', cov=('Les réseaux.', 'après la publication.'),
      p2=('Sous la photo des vœux,', 'les encombrants.'), m='reseaux',
      cap='Les commentaires, les messages privés, les questions posées sous une publication qui n’a rien à voir.',
      p3=('Publier prend dix minutes.', 'Ce qui suit prend plus de temps.'),
      p3s='Une page qui répond reste suivie. Une page qui publie sans répondre perd ses abonnés.',
      p4=('Trois règles', 'qui évitent l’essentiel.'), gestes=['Une charte de modération courte, épinglée, qui dit ce qui sera masqué', 'Un délai de réponse annoncé : « nous répondons les jours ouvrés »', 'Une réponse type qui renvoie vers le bon service'],
      texte="""Une semaine de com dans une commune de 3 000 habitants. Épisode 5 sur 6 : les réseaux.

Publier prend dix minutes. Ce qui suit prend plus de temps : les commentaires, les messages privés, les questions posées sous une publication qui n'a rien à voir.

« Quand passent les encombrants ? » sous la photo des vœux. « Qui peut réparer le lampadaire ? » en message privé un dimanche. Un désaccord entre voisins qui se poursuit sous l'annonce des travaux.

Trois règles qui évitent la plupart des difficultés : une charte de modération courte, épinglée ; un délai de réponse annoncé ; une réponse type qui renvoie vers le bon service pour les demandes personnelles.

Une page qui répond reste suivie. Une page qui publie sans répondre perd ses abonnés.""",
      tags='#communication #collectivites #reseauxsociaux #communes'),
 dict(slug='bilan', date='mardi 9 février', titre='Le bilan', cov=('Le bilan.', 'qui fait la com, et quand.'),
      p2=('Cinq épisodes,', 'une seule semaine.'), m='bilan',
      cap='Les demandes du lundi, les vœux, le site qui périme, l’imprévu du jeudi, les réseaux.',
      p3=('Ce temps n’apparaît', 'nulle part.'),
      p3s='Il est pris sur l’accueil, l’urbanisme, les soirées d’un adjoint. Et quand la personne qui s’en charge part en congé ou en arrêt, la communication s’arrête avec elle.',
      p4=('Trois questions', 'pour faire le point.'), gestes=['Qui publie aujourd’hui, et combien d’heures par semaine cela représente ?', 'Qui prend le relais si cette personne est absente deux semaines ?', 'Quelle est la date de la dernière actualité de votre site ?'],
      texte="""Une semaine de com dans une commune de 3 000 habitants. Épisode 6 sur 6 : le bilan.

En cinq épisodes : les demandes du lundi, les vœux, le site qui périme, l'imprévu du jeudi, les réseaux.

Ce temps n'apparaît nulle part. Il est pris sur l'accueil, sur l'urbanisme, sur les soirées d'un adjoint. Et quand la personne qui s'en charge part en congé ou en arrêt, la communication s'arrête avec elle.

Trois questions pour faire le point dans votre commune :
1. Qui publie aujourd'hui, et combien d'heures par semaine cela représente ?
2. Qui prend le relais si cette personne est absente deux semaines ?
3. Quelle est la date de la dernière actualité de votre site ?

Si les réponses sont « on ne sait pas », « personne » et « il y a longtemps », le sujet mérite une réunion.

Écrivez-nous, on regarde ça ensemble.""",
      tags='#communication #collectivites #communes #communicationpublique'),
]


def maquette(k, top, big=True):
    if k == 'inbox':
        return card(88, top, 904, m_inbox(), rot=-1.2 if big else -2)
    if k == 'voeux':
        return card(88, top, 904, m_voeux(), rot=-1.2 if big else -2)
    if k == 'site':
        return card(88, top, 904, m_site(), rot=-1.2 if big else -2)
    if k == 'reseaux':
        return card(160, top, 760, m_reseaux(), rot=-1.5 if big else -2.5, pad='26px 30px')
    if k == 'bilan':
        return card(88, top, 904, m_bilan(), rot=-1.2 if big else -2)
    if k == 'alerte':
        if big:
            return (f'<div style="position:absolute;left:96px;top:{top}px;transform:rotate(-2deg)">{m_alerte(300)}</div>'
                    + card(430, top + 70, 562, m_modele(), rot=1.5, pad='28px 32px'))
        return f'<div style="position:absolute;left:330px;top:{top}px;transform:rotate(-3deg)">{m_alerte(420)}</div>'
    return ''


def cover(e, n):
    b = mot(MOTIF['lavf'])
    b += (f'<div style="position:absolute;left:88px;top:88px">{logo(56, C["sable"])}</div>'
          f'<div style="position:absolute;right:88px;top:90px">{tagc(f"Une semaine de com · {n}/6", C["lavc"], C["lavt"], 52, 24)}</div>')
    b += (f'<div style="position:absolute;left:88px;right:60px;top:210px"><div class="D" style="font-weight:650;font-size:124px;line-height:.92;letter-spacing:-.05em;color:{C["sable"]}">{e["cov"][0]}</div>'
          f'<div class="I" style="font-size:74px;line-height:1.04;letter-spacing:-.02em;color:{C["lav"]};margin-top:10px">{e["cov"][1]}</div></div>')
    # aperçu de la maquette, coupé par un cadre
    inner = maquette(e['m'], 0, big=False).replace('position:absolute', 'position:absolute', 1)
    b += (f'<div style="position:absolute;left:0;right:0;top:500px;height:520px;overflow:hidden">'
          f'<div style="position:absolute;inset:0;transform:scale(.86);transform-origin:50% 0;top:30px">{inner}</div></div>')
    b += (f'<div style="position:absolute;left:88px;right:88px;bottom:88px;height:104px;display:flex;align-items:center;justify-content:space-between">'
          f'<span style="font-weight:600;font-size:27px;line-height:1.35;color:rgba(248,245,242,.82)">Une commune de 3 000 habitants,<br>vue de l’intérieur</span>'
          f'<span style="display:flex;align-items:center;justify-content:center;width:104px;height:104px;border-radius:50%;background:{C["sable"]}">{arrow(C["encre"], 42)}</span></div>')
    return b


def p2(e, n):
    b = mot(MOTIF['lavc'])
    b += head(N, 1, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += ttl(*e['p2'])
    b += maquette(e['m'], 450)
    b += note(e['cap'], 1130 if e['m'] != 'alerte' else 1120, fs=27)
    return b


def p3(e, n):
    b = mot(MOTIF['lav'])
    b += head(N, 2, logo(44, C['encre'], C['lavf']), C['encre'], 'rgba(26,26,26,.16)')
    b += (f'<div style="position:absolute;left:88px;right:88px;top:200px;bottom:120px;display:flex;flex-direction:column;justify-content:center;gap:70px">'
          f'<div><div class="D" style="font-weight:650;font-size:72px;line-height:1.02;letter-spacing:-.035em;color:{C["encre"]}">{e["p3"][0]}</div>'
          f'<div class="I" style="font-size:62px;line-height:1.1;letter-spacing:-.015em;color:{C["lavt"]};margin-top:26px">{e["p3"][1]}</div></div>'
          f'<div style="padding:34px 40px;border-radius:34px;background:rgba(255,255,255,.55);font-weight:500;font-size:30px;line-height:1.42;color:{C["encre"]}">{e["p3s"]}</div></div>')
    return b


def p4(e, n):
    b = mot(MOTIF['lavc'])
    b += head(N, 3, logo(44), C['lavf'], 'rgba(26,26,26,.14)')
    b += ttl(*e['p4'])
    y = 470
    for i, g in enumerate(e['gestes']):
        b += (f'<div class="card" style="left:88px;right:88px;top:{y + i * 230}px;height:200px;box-sizing:border-box;padding:0 40px;border-radius:34px;display:flex;align-items:center;gap:34px">'
              f'<span style="flex:none;width:96px;height:96px;border-radius:28px;background:{C["lavf"]};display:grid;place-items:center;{F_D};font-weight:800;font-size:52px;color:{C["sable"]}">{i + 1}</span>'
              f'<span style="{F_D};font-weight:650;font-size:38px;line-height:1.12;letter-spacing:-.02em">{g}</span></div>')
    return b


def p5(e, n):
    b = motif(MOTIF['lavf'], 1700, 300, -220)
    b += f'<div style="position:absolute;right:88px;top:96px">{G2.G.dashes(N, 4, C["lavc"], "rgba(248,245,242,.24)")}</div>'
    b += f'<div style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center">{logo(210, C["sable"])}</div>'
    if n < 6:
        t1, t2 = 'Une semaine de com<br>dans une commune.', f'Épisode {n} sur 6.'
    else:
        t1, t2 = 'Et chez vous,<br>qui s’en occupe ?', 'Premier mois sans engagement.'
    b += (f'<div style="position:absolute;left:88px;right:88px;top:560px;text-align:center">'
          f'<div class="D" style="font-weight:650;font-size:80px;line-height:.98;letter-spacing:-.035em;color:{C["sable"]}">{t1}</div>'
          f'<div class="I" style="font-size:46px;color:{C["lavc"]};margin-top:22px">{t2}</div></div>')
    b += (f'<div style="position:absolute;left:0;right:0;top:960px;display:flex;flex-direction:column;align-items:center;gap:30px">'
          f'<span style="display:inline-flex;align-items:center;gap:16px;height:100px;padding:0 46px 0 38px;border-radius:999px;background:{C["blanc"]};box-shadow:0 0 0 10px {C["lav"]};font-weight:650;font-size:40px">fill.studioes.fr</span>'
          f'<span style="font-weight:500;font-size:28px;color:rgba(248,245,242,.8)">{"Enregistrez la série pour la retrouver" if n < 6 else "Collectivités et entreprises, partout en France"}</span></div>')
    return b


PAGES = [(cover, C['lavf']), (p2, C['lavc']), (p3, C['lav']), (p4, C['lavc']), (p5, C['lavf'])]

if __name__ == '__main__':
    sel = [int(x) for x in sys.argv[1:]] or list(range(1, 7))
    for n in sel:
        e = EP[n - 1]
        for j, (f, bg) in enumerate(PAGES):
            page(f'sw{n}-{j + 1:02d}', bg, f(e, n), end=1)
    print('ok')
