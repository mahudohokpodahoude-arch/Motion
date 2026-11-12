# Plan de communication et de design · Week-end Zone Women · mis à jour le 12 novembre 2026 (J-15)
import pathlib, re
H = pathlib.Path(__file__).resolve().parent
old = (H / "plan_com_base.html").read_text()  # version précédente : source des styles et de l'annexe
head = old[:old.index("</style></head><body>")] + "</style></head><body>\n"
annex_old = old[old.index("<!-- 9. ANNEXE -->"):]
N = 10
def foot(n): return ''
def idea(n, t, kind, fmt, acc, dero, need):
    k = {"M": '<span class="m">Motion</span>', "T": '<span class="t">À tourner</span>', "MT": '<span class="t">Tourné + motion</span>'}[kind]
    return f'<div class="idea"><div class="ih"><span class="n">{n}</span><b>{t}</b></div><div class="meta">{k} · {fmt}</div><p><b>Accroche :</b> {acc}</p><p><b>Déroulé :</b> {dero}</p><p class="need"><b>Il faut :</b> {need}</p></div>'
S = []
# ---------- 1 couverture
S.append('''<section class="page cover"><div class="dots"></div><div class="in">
  <span class="tag">PLAN DE COMMUNICATION &amp; DESIGN</span>
  <h1>WEEK-END<br>ZONE WOMEN</h1>
  <div class="sub">« Les femmes prennent le contrôle de la Zone »<br>Du vendredi 27 au dimanche 29 novembre 2026 · Zone 242, Sikècodji</div>
  <div class="three"><span>Restaurée</span><span>Ointe</span><span>Envoyée</span></div>
  <div class="meta">Version mise à jour le 12 novembre 2026, à J-15 (affiche « Coming soon » publiée le 11 novembre)<br>Contenu : situation · stratégie · design · calendrier jour par jour · 22 idées de contenu · organisation et suivi</div>
  <div class="bar"></div></div></section>''')
# ---------- 2 situation
S.append(f'''<section class="page">
<h1>1. Situation à J-15</h1>
<p>Le week-end a <b>3 temps forts</b> : une soirée de lancement le vendredi avec la Prophétesse Mary Favour TONGSI, le <b>Women's Experience Day</b> le samedi (relaxation, 4 panels, la session « Belle et en bonne santé », la Zone Détente et une grande table ronde) et, le dimanche, le grand culte de clôture suivi de l'Agapè des Femmes. Les femmes tiennent l'accueil, la louange, l'animation et l'organisation. <b>Participation gratuite, 150 places, inscription obligatoire.</b></p>
<div class="kpi"><div><b>J-15</b>avant le début</div><div><b>15</b>intervenantes</div><div><b>150</b>places, gratuit</div><div><b>22</b>idées de contenu</div></div>
<h2>Reste à faire</h2>
<table><tr><th>Élément</th><th>État</th></tr>
<tr><td>Formulaire d'inscription (script prêt) et QR code</td><td><span class="t">À créer : bloque l'ouverture des inscriptions</span></td></tr>
<tr><td>Affiche mère officielle</td><td><span class="t">Échéance 12 novembre</span></td></tr>
<tr><td>Photos HD des intervenantes, noms de famille manquants</td><td><span class="t">À récupérer avant le 19 novembre</span></td></tr></table>
{foot(2)}</section>''')
# ---------- 3 stratégie
S.append(f'''<section class="page tight">
<h1>2. Stratégie de communication</h1>
<h2>Objectifs</h2>
<ul><li><b>Remplir les 150 places</b> : inscriptions et présence réelle, pour le samedi (panels, session santé, table ronde) comme pour l'Agapè du dimanche.</li>
<li><b>Faire venir les invitées</b> : chaque participante invite une amie, une sœur, une collègue.</li>
<li><b>Installer le thème</b> « Restaurée · Ointe · Envoyée » avant, pendant et après le week-end.</li></ul>
<h2>Cibles</h2>
<table><tr><th>Cible</th><th>Comment la toucher</th></tr>
<tr><td><b>Les femmes de la Zone</b> (cœur de cible)</td><td>WhatsApp (statuts, groupes), annonces au culte, réseaux sociaux</td></tr>
<tr><td><b>Leurs invitées</b> (amies, famille, collègues)</td><td>Visuels faciles à partager, message « invite une amie », vidéos courtes</td></tr>
<tr><td><b>Les jeunes filles</b></td><td>TikTok, Instagram, stories, contenu court et direct</td></tr>
<tr><td><b>Les hommes de la Zone</b> (relais)</td><td>Annonce explicite : relayer auprès des épouses, sœurs, amies</td></tr></table>
<h2>Messages clés</h2>
<ul><li><b>Message principal :</b> « Les femmes prennent le contrôle de la Zone ».</li>
<li><b>Thème en 3 mots :</b> Restaurée (guérir le cœur, prendre soin de son corps) · Ointe (découvrir son appel, bâtir sa vie financière avec Dieu) · Envoyée (faire de sa maison une mission, repartir bénie et envoyée).</li>
<li><b>Preuve :</b> « Pendant tout le week-end, les femmes tiennent l'accueil, la louange, l'animation et l'organisation. »</li>
<li><b>Appel à l'action unique :</b> s'inscrire (gratuit, 150 places) et inviter une amie.</li></ul>
<h2>Piliers de contenu</h2>
<table><tr><th>Pilier</th><th>Exemples</th></tr>
<tr><td><b>1. Annonce</b></td><td>Affiche, dates, lieu, « Coming soon », ouverture des inscriptions, compte à rebours</td></tr>
<tr><td><b>2. Intervenantes</b></td><td>Affiches de biographie, affiches de session, « Qui est… ? »</td></tr>
<tr><td><b>3. Programme</b></td><td>Carrousel du programme, vendredi, samedi heure par heure, dimanche et Agapè</td></tr>
<tr><td><b>4. Thème et spirituel</b></td><td>Citations, rubrique « Je déclare », « L'essentiel à retenir du Message »</td></tr>
<tr><td><b>5. Expérience</b></td><td>Zone Détente, Agapè des Femmes, coulisses de l'équipe des femmes</td></tr>
<tr><td><b>6. Preuve sociale</b></td><td>Témoignages, photos, récap (hors table ronde)</td></tr></table>
<h2>Canaux</h2>
<table><tr><th>Canal</th><th>Rôle</th><th>Formats</th></tr>
<tr><td>WhatsApp</td><td>Diffusion de proximité, inscriptions</td><td>Statuts 9:16, affiche, messages courts</td></tr>
<tr><td>Facebook</td><td>Annonce, programme, direct</td><td>4:5, 1:1, 16:9, textes d'accompagnement</td></tr>
<tr><td>Instagram</td><td>Image de marque, intervenantes</td><td>Carrousels 1:1 et 4:5, reels et stories 9:16</td></tr>
<tr><td>TikTok</td><td>Jeunes filles, invitation virale</td><td>Vidéos courtes 9:16</td></tr>
<tr><td>YouTube</td><td>Annonce longue, replays (hors table ronde)</td><td>16:9, miniatures</td></tr>
<tr><td>Au culte</td><td>Annonce à l'assemblée</td><td>Écran 16:9, vidéo d'annonce</td></tr></table>
{foot(3)}</section>''')
# ---------- 4 design
S.append(f'''<section class="page tight">
<h1>3. Design : livrables et échéances</h1>
<p>Les échéances sont celles du Google Sheet de suivi (33 créations) et permettent de tenir le calendrier de la section 4. « À fournir » = élément attendu de l'équipe.</p>
<table><tr><th>Priorité</th><th>Livrable</th><th>Échéance</th><th>Détail et à fournir</th></tr>
<tr><td><span class="p0">P0</span></td><td><b>Affiche « Coming soon »</b></td><td><span class="m">Fait · 11 nov.</span></td><td>Publiée.</td></tr>
<tr><td><span class="p0">P0</span></td><td><b>Affiche mère officielle</b></td><td>Jeu 12 nov.</td><td>Titre, thème, slogan, dates, lieu, Prophétesse, inscription. <span class="t">À fournir :</span> photo HD de la Prophétesse, QR code.</td></tr>
<tr><td><span class="p0">P0</span></td><td><b>Teaser vidéo du thème</b></td><td>Jeu 12 nov.</td><td>Motion, dans le style des génériques déjà faits.</td></tr>
<tr><td><span class="p1">P1</span></td><td><b>A5 recto-verso</b> (face : photos ; arrière : informations)</td><td>Lun 16 nov.</td><td>Programme final, QR code. <span class="t">À fournir :</span> photos HD.</td></tr>
<tr><td><span class="p1">P1</span></td><td><b>12 affiches de biographie</b> des panélistes</td><td>Jeu 19 nov.</td><td><span class="t">À fournir :</span> 12 photos HD, titres exacts, biographies (Dr Hestia déjà reçue).</td></tr>
<tr><td><span class="p1">P1</span></td><td><b>9 affiches des jours et de l'Agapè</b> : vendredi, 6 sessions du samedi, dimanche, Agapè</td><td>Ven 20 nov.</td><td>Textes détaillés dans le Sheet. Vendredi et dimanche : uniquement la photo de la Prophétesse.</td></tr>
<tr><td><span class="p2">P2</span></td><td><b>Décomptes J-5 à Jour J</b> (6 stories)</td><td>Ven 20 nov.</td><td>Publication du dimanche 22 au vendredi 27 novembre.</td></tr>
<tr><td><span class="p2">P2</span></td><td><b>Supports physiques</b> : bâche, kakémono, panneaux, badges</td><td>Ven 20 nov. (envoi imprimeur lun. 23)</td><td><span class="t">À fournir :</span> dimensions, délais de l'imprimeur, QR code.</td></tr>
<tr><td><span class="p2">P2</span></td><td><b>Habillage reels et stories</b> Jour 1, 2, 3</td><td>Mar 24 nov.</td><td>Cadre, bandeau, transitions, logo WZW.</td></tr>
<tr><td><span class="p3">P3</span></td><td><b>Après l'événement</b> : citations, remerciement, habillage du récap</td><td>Mer 2 déc.</td><td>Citations notées pendant les panels (hors table ronde).</td></tr></table>
{foot(4)}</section>''')
# ---------- 5 calendrier (2 pages)
rows = [
 ("Mer 11","<b>Affiche « Coming soon »</b>","<span class=m>Fait</span> · WhatsApp, Facebook, Instagram"),
 ("Jeu 12","Teaser vidéo du thème · story-sondage « Qui sera là ? »","Reels, TikTok, statuts, stories"),
 ("Ven 13","<b>Révélation : affiche officielle et ouverture des inscriptions</b> (lien + QR). Annonce dans tous les groupes WhatsApp","Tous canaux, dès que le lien est prêt"),
 ("Sam 14","Carrousel du programme complet (8 diapos, 1080×1080)","Instagram, Facebook ; affiche en statut"),
 ("Dim 15","Annonce à l'assemblée · relais de l'affiche par les hommes · rappel du lien","Culte, WhatsApp"),
 ("Lun 16","Série « 3 mots » 1/3 : <b>Restaurée</b> · rappel « 150 places, gratuit »","Post 4:5 + story"),
 ("Mar 17","Série « 3 mots » 2/3 : <b>Ointe</b> · coulisses de l'équipe des femmes","Post 4:5 + story, stories tournées"),
 ("Mer 18","Série « 3 mots » 3/3 : <b>Envoyée</b> · vidéo d'annonce officielle","Post + reel 9:16 et 16:9"),
 ("Jeu 19","<b>Panel 1</b> · Guérir des traumatismes émotionnels : affiche de session + 4 affiches de biographie","Carrousel + stories"),
 ("Ven 20","<b>Belle et en bonne santé</b> (Dr Sylvie, Dr Majolaine) et <b>Panel 2</b> · Me voici, envoie-moi !","Cartes + reel"),
 ("Sam 21","<b>Panel 3</b> · Femme, foi et finances et <b>Panel 4</b> · Ma maison, ma mission","Cartes + reel"),
 ("Dim 22","<b>J-5</b> · décompte · <b>Grande table ronde</b> (sans captation) · rappel de l'Agapè","Stories, statut"),
]
rows2 = [
 ("Lun 23","<b>J-4</b> · décompte · <b>Zone Détente</b> (samedi 13h00-14h00) · places restantes","Carrousel, stories"),
 ("Mar 24","<b>J-3</b> · décompte · affiche du vendredi et du dimanche (Prophétesse Mary) · habillage prêt","Affiches, stories"),
 ("Mer 25","<b>J-2</b> · décompte · citation du thème + programme · « invite une amie »","Carte de citation, stories"),
 ("Jeu 26","<b>J-1</b> · décompte · plan d'accès, horaires, ce qu'il faut savoir","Stories, WhatsApp"),
 ("Ven 27","<b>Jour J</b> · soirée de lancement à 19h45 (direct possible)","Direct, stories"),
 ("Sam 28","<b>Jour 2</b> · citations par panel, photos, ambiance. <b>Aucune captation de la table ronde</b>","Stories, reels"),
 ("Dim 29","<b>Jour 3</b> · culte de clôture 8h45, Agapè des Femmes 11h30, remerciements","Direct, post"),
 ("Lun 30 →","Récap vidéo et photos, témoignages, un extrait de panel par semaine (hors table ronde)","Tous canaux"),
]
def tr(r): return f"<tr><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td></tr>"
S.append(f'''<section class="page tight">
<h1>4. Calendrier de communication</h1>
<table><tr><th>Phase</th><th>Dates</th><th>Objectif et contenus</th></tr>
<tr><td><b>Teasing</b></td><td>Mer 11 → jeu 12 nov.</td><td>« Coming soon » publié, teaser du thème.</td></tr>
<tr><td><b>Lancement</b></td><td>Ven 13 → sam 21 nov.</td><td>Affiche officielle, ouverture des inscriptions, programme, thème en 3 mots, une session et ses intervenantes par jour.</td></tr>
<tr><td><b>Compte à rebours</b></td><td>Dim 22 → jeu 26 nov.</td><td>Décomptes J-5 à J-1, places restantes, Zone Détente, infos pratiques.</td></tr>
<tr><td><b>Direct</b></td><td>Ven 27 → dim 29 nov.</td><td>Direct (hors table ronde), citations en temps réel, photos, ambiance.</td></tr>
<tr><td><b>Après</b></td><td>Dès lun 30 nov.</td><td>Récap, remerciements, témoignages, extraits des panels.</td></tr></table>
<h2>Jour par jour (1/2)</h2>
<table><tr><th>Date</th><th>Publication</th><th>Canal / format</th></tr>{"".join(tr(r) for r in rows)}</table>
<div class="box info"><b>Rythme :</b> 1 publication par jour dans le feed et 3 à 5 stories pendant le lancement. La date d'ouverture des inscriptions (ven. 13) dépend de la création du formulaire : si le lien n'est pas prêt, décaler la révélation sans toucher à la suite.</div>
{foot(5)}</section>
<section class="page tight">
<h1>4. Calendrier de communication (suite)</h1>
<h2>Jour par jour (2/2)</h2>
<table><tr><th>Date</th><th>Publication</th><th>Canal / format</th></tr>{"".join(tr(r) for r in rows2)}</table>
<h2>Règles de publication</h2>
<ul><li><b>Inscription :</b> chaque publication reprend « Inscription obligatoire · 150 places · participation gratuite » et le QR code, une fois le lien ouvert.</li>
<li><b>Table ronde :</b> pas de direct ni de vidéo (règle du programme). Pas de photo ni de citation de ce temps, sauf accord de l'équipe d'animation.</li>
<li><b>Intervenantes :</b> une publication par session, avec les affiches de biographie correspondantes. Pélagie (panels 1, 3, 4) et Hestia (panels 2, 4) ont une seule affiche de biographie, reprise à chaque session.</li>
<li><b>Hashtags :</b> #ZoneWoman #Restaurée #Ointe #Envoyée.</li>
<li><b>Horaires :</b> écrits « 9h00 ».</li></ul>
<h2>Contenus déjà disponibles</h2>
<table><tr><th>Contenu</th><th>Usage</th></tr>
<tr><td>Carrousel du programme (8 diapos, 1080×1080)</td><td>Publication du 14 novembre, puis rappel avant le 27</td></tr>
<tr><td>Génériques « Je déclare » et « L'essentiel à retenir du Message »</td><td>Rubriques spirituelles (idées 8 et 21)</td></tr>
<tr><td>Logo animé WZW (5 s, 2D et 3D)</td><td>Ouverture et clôture des vidéos</td></tr>
<tr><td>Présentation motion de Dr Hestia (modèle)</td><td>Modèle pour les présentations des autres intervenantes</td></tr>
<tr><td>En-tête et script du formulaire</td><td>Création du formulaire d'inscription</td></tr></table>
{foot(6)}</section>''')
# ---------- 6-8 idées vidéo
S.append(f'''<section class="page"><h1>5. Idées de contenu vidéo</h1><p>22 idées, organisées par moment. Pour chacune : l'<b>accroche</b>, le <b>déroulé</b>, le <b>format</b> et ce qu'<b>il faut</b>. <span class="m">Motion</span> : réalisable sans tournage, avec sound design, dans la charte des génériques déjà faits. <span class="t">À tourner</span> : images filmées par l'équipe, ensuite montées et habillées. <b>Aucune idée ne filme la table ronde.</b></p>
<h2>A. Teasing et lancement (12 au 18 novembre)</h2><div class="grid">
{idea(1,"« Restaurée, pour moi c'est… »","T","9:16 · 25–30 s","Une question posée à 8 femmes de la Zone : « Restaurée, pour toi, c'est quoi ? »","Carte-titre · 5 à 8 réponses de 4 s · chute : « Week-end Zone Women, 27–29 novembre »","Téléphone, bonne lumière, 8 volontaires")}
{idea(2,"« Ointe » en 15 secondes","T","9:16 · 15 s","« Ointe, ça veut dire quoi ? » : une pasteure répond en une phrase.","Question à l'écran · la réponse · carte du thème et dates","Une pasteure, texte validé par les responsables")}
{idea(3,"« Elle tient la Zone »","MT","9:16 · 20 s","Portraits de femmes à leur poste : « Elle tient l'accueil… la louange… l'animation… l'organisation ».","4 portraits de 4 s · chute : « Les femmes prennent le contrôle de la Zone » · date","4 photos ou courts plans, avec accord des femmes")}
{idea(4,"« Mesdames, la Zone est à vous »","T","9:16 · 15 s","Des hommes de la Zone, une phrase chacun, pour soutenir et relayer.","3 à 4 hommes, 4 s chacun · « …et on vous attend le 27 novembre »","Quelques volontaires, téléphone")}
{idea(5,"Annonce officielle","M","16:9 + 9:16 · 20–30 s","« Les femmes prennent le contrôle de la Zone. »","Vendredi → samedi → dimanche, un temps fort par plan · thème · appel à s'inscrire gratuitement","Affiche validée, lien d'inscription")}
{idea(6,"Présentation d'intervenante (×15)","M","9:16 · 6–8 s","Une carte animée par intervenante.","Photo et nom · titre et session · thème de sa session en une phrase","15 photos HD, titres exacts (modèle : présentation de Dr Hestia)")}
</div>{foot(7)}</section>
<section class="page"><h2>B. Lancement (suite)</h2><div class="grid">
{idea(7,"« Un panel, une question »","M","9:16 · 10 s × 6","Chaque session démarre par une question qui interpelle (propositions à valider plus loin dans cette section).","Question à l'écran · titre de la session · heure et intervenantes","Textes validés")}
{idea(8,"« Je déclare » spécial femmes","M","9:16 · 8–10 s × 3","Trois déclarations à reprendre et partager : « Je suis restaurée. Je suis ointe. Je suis envoyée. »","Générique « Je déclare » de 3 s · la déclaration en grand · un court verset ou une phrase","Déclarations et références validées par les pasteurs")}
{idea(9,"Le programme en 30 secondes","M","9:16 · 20–30 s","Le samedi, heure par heure, sans rien oublier.","Défilé animé : 9h00 accueil → relaxation → panels → « Belle et en bonne santé » → table ronde 17h15 · dimanche : culte 8h45 et Agapè 11h30","Programme final")}
{idea(10,"3 raisons de venir","M","9:16 · 10–15 s","Un week-end gratuit, 150 places, ouvert à toutes les femmes.","Une raison par plan : s'y ressourcer · apprendre · être envoyée · « Inscription obligatoire »","Lien d'inscription")}
</div>
<h2>C. Compte à rebours (22 au 26 novembre)</h2><div class="grid">
{idea(11,"« 7 jours, 7 femmes »","T","9:16 · 5 s par jour","Chaque jour, une femme dit « Ce que j'attends du week-end ».","Carte « J-7 » (puis J-6… J-1) · 5 s de la femme · « 27 novembre, Zone 242 »","7 volontaires, téléphone (démarrer le 20 novembre)")}
{idea(12,"Défi « Invite une amie »","T","9:16 · 15 s","« Qui tu invites ? » : une femme appelle ou écrit à une amie, face caméra.","Le message envoyé · la réaction · « Viens, on y va ensemble » · modèle de story, hashtag #ZoneWoman","Quelques volontaires, un modèle de story")}
{idea(13,"Zone Détente, visite en avant-première","T","9:16 · 10 s","Salon de thé, massages, beauté et bien-être, coin photo.","Quatre espaces, un plan par espace · « Samedi 28 novembre, de 13h00 à 14h00 »","Quelques plans de l'espace, ou version illustrée")}
{idea(14,"J-1 : tout ce qu'il faut savoir","M","9:16 · 10–15 s","Où, quand, comment venir : la veille, on lève les derniers doutes.","Plan d'accès · horaires des 3 jours · rappel d'inscription","Adresse précise, plan, contact")}
</div>
<h2>Accroches de session à valider (idée 7)</h2>
<table><tr><th>Session</th><th>Question d'accroche proposée</th></tr>
<tr><td>Panel 1 · Guérir des traumatismes émotionnels</td><td>« Tu souris, mais tu portes encore ça ? »</td></tr>
<tr><td>Belle et en bonne santé</td><td>« Prendre soin du temple : par où commencer ? »</td></tr>
<tr><td>Panel 2 · Me voici, envoie-moi !</td><td>« Et si ton appel avait déjà un nom ? »</td></tr>
<tr><td>Panel 3 · Femme, foi et finances</td><td>« La foi et l'argent : on en parle enfin ? »</td></tr>
<tr><td>Panel 4 · Ma maison, ma mission</td><td>« Et si ta maison était ta première mission ? »</td></tr>
<tr><td>Grande table ronde</td><td>« De quoi ne parle-t-on jamais ? »</td></tr></table>
{foot(8)}</section>
<section class="page tight2"><h2>D. Pendant le week-end (27 au 29 novembre)</h2><div class="grid">
{idea(15,"« Samedi en 60 secondes »","T","9:16 · 45–60 s","Toute la journée en accéléré, de l'accueil à la fin de la table ronde.","Plans de 3 à 5 s à chaque grande étape, horloge à l'écran · table ronde représentée par la salle vide ou le titre · publié le soir même","Une personne qui filme, un montage rapide")}
{idea(16,"« Une phrase, un panel »","M","9:16 · 6 s","La phrase qui a marqué, publiée dans l'heure.","Citation en grand · nom et titre · panel · logo","Une personne note les phrases pendant les panels (pas la table ronde)")}
{idea(17,"« Ce que je retiens »","T","9:16 · 8 s × 10","Micro-trottoir : « Qu'est-ce que tu retiens de cette journée ? »","Une phrase par participante · compilé samedi soir ou dimanche matin","Un micro, de la lumière, l'accord des participantes")}
{idea(18,"Kit du direct","M","16:9 · boucle","Un habillage cohérent pour le direct.","Écran d'attente avec compte à rebours · bandeaux de noms et titres · transitions","Liste des intervenantes par session")}
</div>
<h2>E. Après (dès le 30 novembre)</h2><div class="grid">
{idea(19,"Récap du week-end","T","9:16 + 16:9 · 15 s et 60 s","Les meilleurs moments, avec le thème en fil rouge.","Restaurée → Ointe → Envoyée : un chapitre par jour · musique · « Merci »","Images des 3 jours (hors table ronde)")}
{idea(20,"« Ce qui a été restauré en moi »","T","9:16 · 10–20 s","Des témoignages courts : la meilleure preuve pour la prochaine édition.","Une femme, une phrase, un prénom · sous-titres","Accord des participantes")}
{idea(21,"Extraits de panels et « L'essentiel à retenir du Message »","M","9:16 · 30–60 s","Une série hebdomadaire d'extraits sous-titrés, plus le résumé du message du vendredi et du dimanche.","Générique de 3 s · extrait sous-titré ou 3 points clés · appel à voir le replay","Enregistrements des panels et du culte, accord des intervenantes (jamais la table ronde)")}
{idea(22,"Remerciements","M","9:16 · 8–10 s","Merci à l'équipe, aux intervenantes, aux participantes.","Les mots du thème · « Merci » · rendez-vous à la prochaine édition","Noms à citer (ou formule générale)")}
</div>
<div class="box ok"><b>Si le temps manque</b>, par ordre : <b>5</b> (annonce officielle), <b>1</b> (« Restaurée, pour moi c'est… »), <b>10</b> (3 raisons de venir), <b>11</b> (« 7 jours, 7 femmes »), <b>15</b> (« Samedi en 60 secondes ») et <b>19</b> (récap). Ces six idées couvrent tout le cycle : avant, pendant et après.</div>
<div class="box warn"><b>Sensibilité :</b> les idées 1, 7 et 20 touchent à des sujets personnels. Demander l'accord de la personne filmée et laisser le choix de rester anonyme (texte à l'écran sans visage).</div>
{foot(9)}</section>''')
# ---------- 9 organisation
S.append(f'''<section class="page">
<h1>6. Organisation, suivi et risques</h1>
<h2>Rôles à nommer</h2>
<table><tr><th>Rôle</th><th>Responsabilité</th></tr>
<tr><td><b>Responsable de la com</b></td><td>Valide les visuels et les textes (« bon pour publication »), tient le calendrier.</td></tr>
<tr><td><b>Design et vidéo</b></td><td>Produit les visuels, vidéos et le sound design, selon les priorités de la section 3.</td></tr>
<tr><td><b>Community manager</b></td><td>Publie, répond aux messages, relance les inscriptions, anime les stories.</td></tr>
<tr><td><b>Référente inscriptions</b></td><td>Tient la liste (150 places), confirme les inscrites par WhatsApp, suit la liste d'attente.</td></tr>
<tr><td><b>Référente intervenantes</b></td><td>Récupère photos HD, titres exacts, noms de famille et accords de diffusion.</td></tr>
<tr><td><b>Équipe tournage</b></td><td>Stories, témoignages, récap pendant le week-end, sauf la table ronde.</td></tr></table>
<h2>Suivi (indicateurs)</h2>
<table><tr><th>Indicateur</th><th>Objectif</th><th>Comment le mesurer</th></tr>
<tr><td>Inscrites</td><td>150 (complet)</td><td>Liste d'inscription (formulaire), suivie chaque jour dès l'ouverture</td></tr>
<tr><td>Présence le samedi</td><td>À fixer avec l'équipe</td><td>Comptage à l'accueil par session</td></tr>
<tr><td>Présence à l'Agapè</td><td>À fixer</td><td>Comptage à l'accueil, dimanche</td></tr>
<tr><td>Portée et partages de l'affiche</td><td>À fixer</td><td>Statistiques Facebook, Instagram, TikTok, vues des statuts</td></tr>
<tr><td>Vues des vidéos clés</td><td>À fixer</td><td>Vidéos 1, 2, 4, 8 et 21</td></tr>
<tr><td>Invitées venues « par une amie »</td><td>À fixer</td><td>Question posée à l'inscription : « Qui t'a invitée ? »</td></tr></table>
<h2>Risques et parades</h2>
<table><tr><th>Risque</th><th>Parade</th></tr>
<tr><td>Formulaire non prêt : inscriptions non ouvertes</td><td>Créer le formulaire dès cette semaine (script prêt), annoncer un seul lien et un seul QR code.</td></tr>
<tr><td>Photos HD des intervenantes en retard</td><td>Date butoir le 16 novembre ; en secours, cartes avec monogramme ou illustration.</td></tr>
<tr><td>Programme modifié après publication</td><td>Figer le programme avant le 16 novembre ; toute modification passe par une personne.</td></tr>
<tr><td>Délais d'impression (bâche, kakémono, badges)</td><td>Envoyer à l'imprimeur au plus tard le lundi 23 novembre.</td></tr>
<tr><td>Captation de la table ronde</td><td>Rappeler la règle à l'équipe tournage et au direct ; couper le direct pendant 17h15-18h15.</td></tr>
<tr><td>Trop d'informations par visuel</td><td>Affiche = essentiel ; programme = document séparé, en deux niveaux.</td></tr>
<tr><td>Fatigue de l'équipe sur le week-end</td><td>Programmer à l'avance les publications du week-end, garder une personne dédiée au direct.</td></tr></table>
{foot(10)}</section>''')
out = head + "\n".join(S) + "\n</body></html>\n"
(H / "plan_com.html").write_text(out)
print(len(out))
