# Planning de publication (dates) + scripts vidéo · Week-end Zone Women · 19 novembre 2026
import pathlib
H = pathlib.Path(__file__).resolve().parent
OUT = H.parent / "documents" / "Planning_et_scripts_video_WZW.pdf"
CSS = """
@page{size:A4;margin:14mm 14mm 14mm}
*{box-sizing:border-box}body{font-family:Montserrat,Arial,sans-serif;color:#151a3a;font-size:10.4px;line-height:1.45}
h1{font-size:22px;color:#1900cf;margin:0 0 4px}h2{font-size:14px;color:#1900cf;margin:16px 0 6px;border-left:6px solid #ff5a36;padding-left:8px}
.sub{color:#555;margin-bottom:8px}
table{width:100%;border-collapse:collapse;margin:4px 0 8px}th{background:#10143a;color:#fff;text-align:left;padding:5px 7px;font-size:9.6px}
td{padding:5px 7px;border-bottom:1px solid #e4e4ee;vertical-align:top}tr:nth-child(even) td{background:#f7f7fb}
.ok{color:#0a8f4d;font-weight:700}.tb{color:#c2410c;font-weight:700}
.sc{border:1px solid #dcdcec;border-radius:8px;padding:9px 11px;margin:8px 0;page-break-inside:avoid}
.sc h3{margin:0 0 3px;font-size:11.6px;color:#10143a}.sc .m{color:#555;font-size:9.6px;margin-bottom:5px}
.sc table td{padding:3px 6px;font-size:10px}.sc table td:first-child{width:62px;font-weight:700;white-space:nowrap}
.note{background:#fff4ec;border-left:5px solid #ff5a36;padding:7px 10px;margin:8px 0}
.brk{page-break-before:always}.grp{font-size:12px;color:#c2410c;margin:14px 0 2px}.dt{float:right;font-size:9.6px;color:#1900cf;font-weight:700}.sc p{margin:3px 0}
"""
def sc(title, meta, rows):
    t = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in rows)
    return f'<div class="sc"><h3>{title}</h3><div class="m">{meta}</div><table>{t}</table></div>'
P = []
def idea(n, t, when, meta, acc, rows=None, dero=None, need=""):
    body = f"<p><b>Accroche :</b> {acc}</p>"
    if rows: body += "<table>" + "".join(f"<tr><td>{x}</td><td>{y}</td></tr>" for x, y in rows) + "</table>"
    if dero: body += f"<p><b>Déroulé :</b> {dero}</p>"
    if need: body += f"<p><b>Il faut :</b> {need}</p>"
    return f'<div class="sc"><h3>{n} · {t} <span class="dt">{when}</span></h3><div class="m">{meta}</div>{body}</div>'
P.append("""<h1>Planning de publication et scripts vidéo</h1>
<div class="sub">Week-end Zone Women · 27–29 novembre 2026 · mis à jour le jeudi 19 novembre (J-8). Pas de voix dans les vidéos montées en motion : musique « Rejoice » et effets légers. Aucune captation de la table ronde. <b>Les numéros renvoient aux scripts, plus bas.</b></div>
<h2>1. Planning (dates)</h2>
<table><tr><th style="width:62px">Date</th><th>Feed : carrousels et affiches</th><th style="width:200px">Vidéos (n° du script)</th></tr>
<tr><td><b>Jeu 19</b></td><td>Carrousel « 4 raisons » · 16h00 · <span class="ok">publié</span></td><td>—</td></tr>
<tr><td><b>Ven 20</b></td><td>Annonce des panélistes (vidéo) · <i>tournage « Restaurée » et « Ointe »</i></td><td><b>5</b> Annonce officielle (fait)</td></tr>
<tr><td><b>Sam 21</b></td><td>Bios : <b>Pasteure Veronica</b> + Pasteure Anne-Laure</td><td><b>1</b> « Restaurée, pour moi c'est… » · <b>8a</b> « Je suis restaurée » · <b>6</b> ×2</td></tr>
<tr><td><b>Dim 22</b></td><td>Bios : Jessie Vanessa + Pélagie · annonce à l'assemblée</td><td><b>2</b> « Ointe » en 15 s · <b>8b</b> « Je suis ointe » · <b>24</b> J-5 · <b>6</b> ×2</td></tr>
<tr><td><b>Lun 23</b></td><td>Bios : Dr Sylvie + Dr Marjolaine</td><td><b>23</b> « Envoyée, c'est… » · <b>8c</b> « Je suis envoyée » · <b>13</b> Zone Détente · <b>24</b> J-4 · <b>6</b> ×2</td></tr>
<tr><td><b>Mar 24</b></td><td>Bios : Servante Manne + Leader Richmelle · affiche de la Prophétesse Mary</td><td><b>3</b> « Elle tient la Zone » · <b>7</b> (3 sessions) · <b>24</b> J-3 · <b>6</b> ×2</td></tr>
<tr><td><b>Mer 25</b></td><td>Bios : Dr Hestia + Pasteure Espérance · citation du thème</td><td><b>4</b> « Mesdames, la Zone est à vous » · <b>12</b> « Invite une amie » · <b>7</b> (3 sessions) · <b>24</b> J-2 · <b>6</b> ×2</td></tr>
<tr><td><b>Jeu 26</b></td><td>Bios : Leader Huldah + Madame Tossou · plan d'accès</td><td><b>9</b> Programme en 30 s · <b>14</b> J-1 · <b>24</b> J-1 · <b>6</b> ×2</td></tr>
<tr><td><b>Ven 27</b></td><td>Matin : Roukiyatou PIWO, Murielle, Imalia · Jour J : soirée de lancement 19h45</td><td><b>18</b> Kit du direct · <b>24</b> Jour J · <b>6</b> ×3</td></tr>
<tr><td><b>Sam 28</b></td><td>Citations par panel, photos (jamais la table ronde)</td><td><b>15</b> « Samedi en 60 secondes » · <b>16</b> « Une phrase, un panel » · <b>17</b> « Ce que je retiens »</td></tr>
<tr><td><b>Dim 29</b></td><td>Culte de clôture 8h45 · Agapè 11h30</td><td><b>17</b> (suite) · <b>22</b> Remerciements</td></tr>
<tr><td><b>Lun 30 →</b></td><td>Récap, témoignages, un extrait de panel par semaine</td><td><b>19</b> Récap · <b>20</b> « Ce qui a été restauré en moi » · <b>21</b> Extraits</td></tr></table>
<div class="note"><b>À confirmer :</b> l'ordre des bios après Veronica ; le rôle de Servante Roukiyatou PIWO (absente du programme) ; les noms de famille de Dr Sylvie, Dr Marjolaine, Mme Tossou, Murielle et Imalia ; les bios (texte) à recevoir la veille de chaque publication. <b>Idée 10</b> (« 3 raisons de venir ») est remplacée par le carrousel « 4 raisons » du 19. <b>Idée 11</b> (« 7 jours, 7 femmes ») est raccourcie en « 5 jours, 5 femmes », intégrée au décompte 24. <b>Nouveaux scripts :</b> 23 (Envoyée) et 24 (décompte), pour compléter la série et le calendrier.</div>""")
P.append('<h2>2. Scripts vidéo</h2><div class="sub">Légende : <span class="tb">À tourner</span> = images filmées par l\'équipe puis habillées · <b>Motion</b> = sans tournage.</div>')
P.append('<h3 class="grp">La trilogie Restaurée · Ointe · Envoyée</h3>')
P.append(idea(1, "« Restaurée, pour moi c'est… »", "Sam 21", "À tourner · 9:16 · 25–30 s", "« Restaurée, pour toi, c'est quoi ? », posée à 8 femmes de la Zone.", rows=[
 ("0–3 s", "Carte-titre : « RESTAURÉE » · « Pour moi, c'est… »"),
 ("3–23 s", "5 à 8 réponses de 3 à 4 s, face caméra, prénom en bas de l'écran"),
 ("23–30 s", "Chute : « Week-end Zone Women · 27–29 novembre » · logo · « Gratuit · 150 places »")], need="Téléphone, bonne lumière, 8 volontaires (accord de chacune ; elles peuvent choisir de rester sans visage)."))
P.append(idea(2, "« Ointe » en 15 secondes", "Dim 22", "À tourner · 9:16 · 15 s", "« Ointe, ça veut dire quoi ? » : une pasteure répond en une phrase.", rows=[
 ("0–3 s", "Question à l'écran : « OINTE, ÇA VEUT DIRE QUOI ? »"),
 ("3–12 s", "La pasteure répond en une phrase (texte validé par les responsables), sous-titrée"),
 ("12–15 s", "Carte du thème · « 27–29 novembre · Zone 242 »")], need="Une pasteure ; la phrase de réponse validée par les responsables (je ne la rédige pas à leur place)."))
P.append(idea(23, "« Envoyée, c'est… » (nouveau)", "Lun 23", "À tourner · 9:16 · 15 s · même modèle que « Ointe »", "« Envoyée, ça veut dire quoi ? » : une leader répond en une phrase.", rows=[
 ("0–3 s", "Question à l'écran : « ENVOYÉE, ÇA VEUT DIRE QUOI ? »"),
 ("3–12 s", "La leader répond en une phrase, sous-titrée. Piste à valider : repartir bénie pour faire de sa maison une mission"),
 ("12–15 s", "Carte du thème · « 27–29 novembre · Zone 242 »")], need="Une leader ; phrase validée par les responsables."))
P.append(idea("8a · 8b · 8c", "« Je déclare » spécial femmes", "Sam 21 · Dim 22 · Lun 23", "Motion · 9:16 · 8–10 s chacune", "Trois déclarations à reprendre et partager.", rows=[
 ("0–3 s", "Générique « Je déclare » (3 s)"),
 ("3–8 s", "8a « JE SUIS RESTAURÉE. » · 8b « JE SUIS OINTE. » · 8c « JE SUIS ENVOYÉE. » en grand"),
 ("8–10 s", "Un court verset ou une phrase (à fournir) · logo WZW")], need="Références et versets validés par les pasteurs : je n'en invente aucun."))
P.append('<h3 class="grp">Annonce et présentations</h3>')
P.append(idea(5, "Annonce officielle, présentation des panélistes", "Ven 20 · fait", "Motion · 9:16 et 16:9 · 40,0 s · musique « Rejoice »", "« FEMMES, ÊTES-VOUS PRÊTES ? »", rows=[
 ("0–3,6 s", "Fond gris, mots qui tombent · carte « WEEK-END ZONE WOMEN »"),
 ("3,6–8,4 s", "« LES FEMMES PRENNENT LE CONTRÔLE DE LA ZONE » sur 4 portraits en coupes rapides"),
 ("8,4–25,2 s", "Carrousel des 14 intervenantes, 1,2 s chacune, titre + nom sur bandeau rouge"),
 ("25,2–32,4 s", "Date (« 27–29 NOVEMBRE 2026 ») · adresse · « ENTRÉE GRATUITE · 150 PLACES »"),
 ("32,4–40 s", "« NE MANQUE PAS » sur collage gris · affiche officielle")]))
P.append(idea(6, "Présentation d'une panéliste (modèle Dr Hestia)", "Dès sam 21, le jour de sa bio", "Motion · 9:16 · 6–8 s", "Une carte animée par panéliste.", rows=[
 ("0–2 s", "Photo détourée qui entre, nom en grand : « PASTEURE VERONICA »"),
 ("2–5 s", "Titre et session avec l'heure (tableau ci-dessous), logo WZW"),
 ("5–8 s", "« 27–29 novembre · Zone 242 · Gratuit · 150 places · inscription : lien en bio »")]))
P.append("""<table><tr><th>Panéliste</th><th>Session et heure (programme)</th></tr>
<tr><td>Pasteure Veronica · Pasteure Anne-Laure · Évangéliste Jessie Vanessa</td><td>Panel 1 · Guérir des traumatismes émotionnels · samedi 10h30</td></tr>
<tr><td>Prophétesse Pélagie MANTANVI</td><td>Panel 1 (10h30) · Panel 3 (15h00) · Panel 4 (16h00)</td></tr>
<tr><td>Dr Sylvie (médecin généraliste) · Dr Marjolaine (cosmétologue)</td><td>Belle et en bonne santé · samedi 12h00</td></tr>
<tr><td>Servante Manne · Leader Richmelle · Dr Hestia DAOUDOU</td><td>Panel 2 · Me voici, envoie-moi ! · samedi 14h00 (Hestia aussi au Panel 4 · 16h00)</td></tr>
<tr><td>Pasteure Espérance · Leader Huldah</td><td>Panel 3 · Femme, foi et finances · samedi 15h00</td></tr>
<tr><td>Madame Tossou</td><td>Panel 4 · Ma maison, ma mission · samedi 16h00</td></tr>
<tr><td>Murielle et Imalia</td><td>Animation de la grande table ronde (pas de direct ni de vidéo)</td></tr></table>""")
P.append(idea(3, "« Elle tient la Zone »", "Mar 24", "À tourner + motion · 9:16 · 20 s", "« Elle tient l'accueil… la louange… l'animation… l'organisation. »", dero="4 portraits de 4 s · chute « Les femmes prennent le contrôle de la Zone » · date.", need="4 photos ou courts plans, avec l'accord des femmes."))
P.append(idea(4, "« Mesdames, la Zone est à vous »", "Mer 25", "À tourner · 9:16 · 15 s", "Des hommes de la Zone, une phrase chacun, pour soutenir et relayer.", dero="3 à 4 hommes, 4 s chacun · « …et on vous attend le 27 novembre ».", need="Quelques volontaires, téléphone."))
P.append(idea(12, "Défi « Invite une amie »", "Mer 25", "À tourner · 9:16 · 15 s", "« Qui tu invites ? » : une femme appelle ou écrit à une amie, face caméra.", dero="Le message envoyé · la réaction · « Viens, on y va ensemble » · modèle de story, #ZoneWoman.", need="Quelques volontaires, un modèle de story."))
P.append('<h3 class="grp">Programme, décompte et infos pratiques</h3>')
P.append(idea(7, "« Un panel, une question »", "Mar 24 et mer 25 (3 par jour)", "Motion · 9:16 · 10 s × 6", "Chaque session démarre par une question.", rows=[
 ("Panel 1", "« Tu souris, mais tu portes encore ça ? »"), ("Belle et en bonne santé", "« Prendre soin du temple : par où commencer ? »"),
 ("Panel 2", "« Et si ton appel avait déjà un nom ? »"), ("Panel 3", "« La foi et l'argent : on en parle enfin ? »"),
 ("Panel 4", "« Et si ta maison était ta première mission ? »"), ("Table ronde", "« De quoi ne parle-t-on jamais ? » (carte seule, aucune image)")],
 dero="Question à l'écran · titre de la session · heure et intervenantes.", need="Questions à valider."))
P.append(idea(9, "Le programme en 30 secondes", "Jeu 26", "Motion · 9:16 · 20–30 s", "Le samedi, heure par heure, sans rien oublier.", dero="Défilé animé : 9h00 accueil → relaxation → panels → « Belle et en bonne santé » → table ronde 17h15 · dimanche : culte 8h45 et Agapè 11h30.", need="Programme final."))
P.append(idea(24, "Décompte J-5 à Jour J (nouveau)", "Dim 22 → ven 27", "Motion · stories 9:16 · 5 s × 6", "Un compte à rebours, un texte par jour.", rows=[
 ("J-5 · dim 22", "« 5 JOURS » · Week-end Zone Women · 27–29 novembre"), ("J-4 · lun 23", "« 4 JOURS » · Zone Détente le samedi : salon de thé, massages, beauté et bien-être"),
 ("J-3 · mar 24", "« 3 JOURS » · Vendredi 27 · 19h45 · Prophétesse Mary Favour TONGSI"), ("J-2 · mer 25", "« 2 JOURS » · Gratuit · 150 places · inscription obligatoire"),
 ("J-1 · jeu 26", "« DEMAIN » · Zone 242 – Sikècodji, rue de Golf FM · 19h45"), ("Jour J · ven 27", "« C'EST AUJOURD'HUI » · Soirée de lancement · 19h45")],
 need="Option (idée 11, « 5 jours, 5 femmes ») : ajouter 5 s d'une femme qui dit « Ce que j'attends du week-end »."))
P.append(idea(13, "Zone Détente, avant-première", "Lun 23", "À tourner ou illustrée · 9:16 · 10 s", "Salon de thé, massages, beauté et bien-être, coin photo.", rows=[
 ("0–2 s", "« ZONE DÉTENTE » · « Samedi 28 novembre · 13h00-14h00 »"), ("2–8 s", "Quatre plans de 1,5 s : salon de thé · massages (sur inscription à l'accueil) · beauté et bien-être · coin photo"), ("8–10 s", "Logo WZW · « Gratuit · 150 places »")]))
P.append(idea(14, "J-1 : tout ce qu'il faut savoir", "Jeu 26", "Motion · 9:16 · 10–15 s", "Où, quand, comment venir.", rows=[
 ("0–3 s", "« DEMAIN, ÇA COMMENCE »"), ("3–8 s", "Adresse et plan d'accès (à fournir) : Zone 242 – Sikècodji, rue de Golf FM, Cotonou"), ("8–13 s", "Horaires : ven. 19h45 · sam. 9h00 · dim. 8h45 · inscription obligatoire")]))
P.append('<h3 class="grp">Pendant le week-end (27 au 29)</h3>')
P.append(idea(18, "Kit du direct", "Prêt ven 27", "Motion · 16:9 · boucle", "Un habillage cohérent pour le direct.", dero="Écran d'attente avec compte à rebours · bandeaux de noms et titres · transitions.", need="Liste des intervenantes par session."))
P.append(idea(15, "« Samedi en 60 secondes »", "Sam 28, le soir", "À tourner · 9:16 · 45–60 s", "Toute la journée en accéléré.", rows=[
 ("0–5 s", "Accueil et petit-déjeuner (9h00), horloge à l'écran"), ("5–40 s", "Un plan de 3 à 5 s par étape : relaxation · louange · panels 1 à 4 · Belle et en bonne santé · Zone Détente"),
 ("40–50 s", "Table ronde : seulement le titre à l'écran, aucune image de la salle"), ("50–60 s", "« Les femmes prennent le contrôle de la Zone » · logo")]))
P.append(idea(16, "« Une phrase, un panel »", "Sam 28, dans l'heure de chaque panel", "Motion · 9:16 · 6 s", "La phrase qui a marqué.", rows=[("0–5 s", "Phrase en grand · nom et titre · panel"), ("5–6 s", "Logo WZW")], need="Une personne note les phrases (jamais la table ronde)."))
P.append(idea(17, "« Ce que je retiens »", "Sam 28 soir → dim 29", "À tourner · 9:16 · 8 s × 10", "Micro-trottoir : « Qu'est-ce que tu retiens de cette journée ? »", dero="Une phrase par participante · compilé samedi soir ou dimanche matin.", need="Un micro, de la lumière, l'accord des participantes."))
P.append(idea(22, "Remerciements", "Dim 29", "Motion · 9:16 · 8–10 s", "Merci à l'équipe, aux intervenantes, aux participantes.", rows=[("0–5 s", "« RESTAURÉE · OINTE · ENVOYÉE » puis « MERCI »"), ("5–10 s", "« Rendez-vous à la prochaine édition »")], need="Noms à citer, ou formule générale."))
P.append('<h3 class="grp">Après (dès le 30 novembre)</h3>')
P.append(idea(19, "Récap du week-end", "Lun 30", "Tourné + motion · 9:16 15 s et 16:9 60 s", "Les meilleurs moments, thème en fil rouge.", rows=[("0–5 s", "RESTAURÉE : vendredi, soirée de lancement"), ("5–10 s", "OINTE : panels et prédication"), ("10–15 s", "ENVOYÉE : Agapè et photo de groupe · « Merci »")], need="Images des 3 jours (hors table ronde)."))
P.append(idea(20, "« Ce qui a été restauré en moi »", "Dès lun 30", "À tourner · 9:16 · 10–20 s", "Des témoignages courts : la meilleure preuve pour la prochaine édition.", dero="Une femme, une phrase, un prénom · sous-titres.", need="Accord des participantes."))
P.append(idea(21, "Extraits de panels et « L'essentiel à retenir du Message »", "Une série par semaine, dès lun 30", "Motion · 9:16 · 30–60 s", "Extraits sous-titrés et résumé du message du vendredi et du dimanche.", dero="Générique de 3 s · extrait sous-titré ou 3 points clés · appel à voir le replay.", need="Enregistrements des panels et du culte, accord des intervenantes (jamais la table ronde)."))
P.append('<div class="note"><b>Sensibilité :</b> les idées 1, 7 et 20 touchent à des sujets personnels. Demander l\'accord de la personne filmée et laisser le choix de rester anonyme (texte à l\'écran, sans visage).</div>')
html = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>" + "".join(P)
f = H / "planning_scripts.html"; f.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    pg.goto("file://" + str(f)); pg.wait_for_timeout(500); pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True); b.close()
f.unlink(); print(OUT)
