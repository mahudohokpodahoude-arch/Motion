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
.brk{page-break-before:always}
"""
def sc(title, meta, rows):
    t = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in rows)
    return f'<div class="sc"><h3>{title}</h3><div class="m">{meta}</div><table>{t}</table></div>'
P = []
P.append("""<h1>Planning de publication et scripts vidéo</h1>
<div class="sub">Week-end Zone Women · 27–29 novembre 2026 · mis à jour le jeudi 19 novembre (J-8). Pas de voix dans les vidéos : musique « Rejoice » et effets sonores légers. Aucune captation de la table ronde.</div>
<h2>1. Planning (dates)</h2>
<table><tr><th style="width:70px">Date</th><th>Publication</th><th style="width:150px">Vidéo (script)</th></tr>
<tr><td><b>Jeu 19</b></td><td>Carrousel « 4 raisons » · 16h00 · <span class="ok">publié</span></td><td>—</td></tr>
<tr><td><b>Ven 20</b></td><td>Vidéo motion d'annonce qui présente les panélistes</td><td>A · Annonce 40 s</td></tr>
<tr><td><b>Sam 21</b></td><td>Biographies : <b>Pasteure Veronica</b> + Pasteure Anne-Laure</td><td>B · Présentations (×2)</td></tr>
<tr><td><b>Dim 22</b></td><td>Biographies : Évangéliste Jessie Vanessa + Prophétesse Pélagie · décompte J-5</td><td>B (×2) · C J-5</td></tr>
<tr><td><b>Lun 23</b></td><td>Biographies : Dr Sylvie + Dr Marjolaine · J-4 · Zone Détente</td><td>B (×2) · C J-4 · D</td></tr>
<tr><td><b>Mar 24</b></td><td>Biographies : Servante Manne + Leader Richmelle · J-3 · affiche de la Prophétesse Mary</td><td>B (×2) · C J-3</td></tr>
<tr><td><b>Mer 25</b></td><td>Biographies : Dr Hestia + Pasteure Espérance · J-2 · citation du thème</td><td>B (×2) · C J-2</td></tr>
<tr><td><b>Jeu 26</b></td><td>Biographies : Leader Huldah + Madame Tossou · J-1 · infos pratiques</td><td>B (×2) · C J-1 · E</td></tr>
<tr><td><b>Ven 27</b></td><td>Matin : Servante Roukiyatou PIWO, Pasteure Murielle et Imalia · <b>Jour J</b> : soirée de lancement 19h45</td><td>B (×3) · C Jour J</td></tr>
<tr><td><b>Sam 28</b></td><td>Citations par panel, photos, ambiance (jamais la table ronde)</td><td>F · G</td></tr>
<tr><td><b>Dim 29</b></td><td>Culte de clôture 8h45 · Agapè des Femmes 11h30 · remerciements</td><td>H</td></tr>
<tr><td><b>Lun 30</b></td><td>Récap du week-end, témoignages</td><td>I</td></tr></table>
<div class="note"><b>À confirmer :</b> l'ordre des biographies après Veronica ; le rôle de Servante Roukiyatou PIWO (absente du programme) ; les noms de famille de Dr Sylvie, Dr Marjolaine, Mme Tossou, Murielle et Imalia ; les biographies à recevoir la veille de chaque publication.</div>""")
P.append('<h2 class="brk">2. Scripts vidéo</h2>')
P.append(sc("A · Annonce officielle, présentation des panélistes", "Vendredi 20 · fait · 40,0 s · 9:16 (reels) et 16:9 · musique « Rejoice » + effets", [
 ("0–1,8 s", "Fond gris, mots qui tombent : « FEMMES / ÊTES-VOUS / PRÊTES ? » · trait rouge"),
 ("1,8–3,6 s", "Carte « WEEK-END ZONE WOMEN »"),
 ("3,6–8,4 s", "« LES FEMMES PRENNENT LE CONTRÔLE DE LA ZONE » sur 4 portraits en coupes rapides"),
 ("8,4–25,2 s", "Carrousel de 14 intervenantes, 1,2 s chacune : titre + nom sur bandeau rouge (Mary Favour Tongsi en premier)"),
 ("25,2–27,6 s", "« 27–29 NOVEMBRE 2026 · VEN. 19H45 »"),
 ("27,6–30,0 s", "« ZONE 242 – SIKÈCODJI, RUE DE GOLF FM, COTONOU »"),
 ("30,0–32,4 s", "« ENTRÉE GRATUITE · 150 PLACES · INSCRIPTION OBLIGATOIRE » + contact"),
 ("32,4–35,4 s", "« NE MANQUE PAS » sur collage gris + glitch"),
 ("35,4–40,0 s", "Affiche officielle (9:16 plein cadre ; 16:9 sur fond flouté), fondu de sortie")]))
P.append(sc("B · Présentation d'une panéliste (modèle Dr Hestia)", "Un par panéliste · 9:16 · 6–8 s · à publier le jour de sa biographie", [
 ("0–2 s", "Photo détourée qui entre, nom en grand : « PASTEURE VERONICA »"),
 ("2–5 s", "Titre et session avec l'heure (voir tableau), logo WZW"),
 ("5–8 s", "« 27–29 novembre · Zone 242 · Gratuit · 150 places » + « Inscription : lien en bio »")]))
P.append("""<table><tr><th>Panéliste</th><th>Session et heure (programme)</th></tr>
<tr><td>Pasteure Veronica · Pasteure Anne-Laure · Évangéliste Jessie Vanessa</td><td>Panel 1 · Guérir des traumatismes émotionnels · samedi 10h30</td></tr>
<tr><td>Prophétesse Pélagie MANTANVI</td><td>Panel 1 (10h30) · Panel 3 (15h00) · Panel 4 (16h00)</td></tr>
<tr><td>Dr Sylvie (médecin généraliste) · Dr Marjolaine (cosmétologue)</td><td>Belle et en bonne santé · samedi 12h00</td></tr>
<tr><td>Servante Manne · Leader Richmelle · Dr Hestia DAOUDOU</td><td>Panel 2 · Me voici, envoie-moi ! · samedi 14h00 (Hestia aussi au Panel 4 · 16h00)</td></tr>
<tr><td>Pasteure Espérance · Leader Huldah</td><td>Panel 3 · Femme, foi et finances · samedi 15h00</td></tr>
<tr><td>Madame Tossou</td><td>Panel 4 · Ma maison, ma mission · samedi 16h00</td></tr>
<tr><td>Murielle et Imalia</td><td>Animation de la grande table ronde (pas de direct ni de vidéo)</td></tr></table>""")
P.append(sc("C · Décompte J-5 à Jour J", "Du dimanche 22 au vendredi 27 · 6 stories 9:16 · 5 s chacune · même modèle, un texte par jour", [
 ("J-5 · dim 22", "« 5 JOURS » · Week-end Zone Women · 27–29 novembre"),
 ("J-4 · lun 23", "« 4 JOURS » · Zone Détente le samedi : salon de thé, massages, beauté et bien-être"),
 ("J-3 · mar 24", "« 3 JOURS » · Vendredi 27 · 19h45 · Prophétesse Mary Favour TONGSI"),
 ("J-2 · mer 25", "« 2 JOURS » · Gratuit · 150 places · inscription obligatoire"),
 ("J-1 · jeu 26", "« DEMAIN » · Zone 242 – Sikècodji, rue de Golf FM · 19h45"),
 ("Jour J · ven 27", "« C'EST AUJOURD'HUI » · Soirée de lancement · 19h45")]))
P.append(sc("D · Zone Détente, avant-première", "Lundi 23 · 9:16 · 10 s · à tourner (quelques plans de l'espace) ou version illustrée", [
 ("0–2 s", "« ZONE DÉTENTE » · « Samedi 28 novembre · 13h00-14h00 »"),
 ("2–8 s", "Quatre plans de 1,5 s : salon de thé · massages (sur inscription à l'accueil) · beauté et bien-être · coin photo"),
 ("8–10 s", "Logo WZW · « Gratuit · 150 places »")]))
P.append(sc("E · J-1 : tout ce qu'il faut savoir", "Jeudi 26 · 9:16 · 10–15 s · motion", [
 ("0–3 s", "« DEMAIN, ÇA COMMENCE »"),
 ("3–8 s", "Adresse et plan d'accès (à fournir) · Zone 242 – Sikècodji, rue de Golf FM, Cotonou"),
 ("8–13 s", "Horaires : ven. 19h45 · sam. 9h00 · dim. 8h45 · rappel : inscription obligatoire")]))
P.append(sc("F · « Samedi en 60 secondes »", "Samedi 28, le soir · 9:16 · 45–60 s · à tourner", [
 ("0–5 s", "Accueil et petit-déjeuner (9h00), horloge à l'écran"),
 ("5–40 s", "Un plan de 3 à 5 s par étape : relaxation · louange · panels 1 à 4 · Belle et en bonne santé · Zone Détente"),
 ("40–50 s", "Table ronde : seulement le titre à l'écran, aucune image de la salle"),
 ("50–60 s", "« Les femmes prennent le contrôle de la Zone » · logo")]))
P.append(sc("G · « Une phrase, un panel »", "Samedi 28 · 9:16 · 6 s, dans l'heure qui suit chaque panel (jamais la table ronde)", [
 ("0–5 s", "La phrase en grand · nom et titre de la panéliste · nom du panel"),
 ("5–6 s", "Logo WZW")]))
P.append(sc("H · Remerciements", "Dimanche 29 · 9:16 · 8–10 s · motion", [
 ("0–5 s", "« RESTAURÉE · OINTE · ENVOYÉE » puis « MERCI »"),
 ("5–10 s", "Merci à l'équipe, aux intervenantes et aux participantes · « Rendez-vous à la prochaine édition »")]))
P.append(sc("I · Récap du week-end", "Lundi 30 · 9:16 15 s et 16:9 60 s · tourné + motion", [
 ("0–5 s", "RESTAURÉE : vendredi, soirée de lancement"),
 ("5–10 s", "OINTE : panels et prédication"),
 ("10–15 s", "ENVOYÉE : Agapè et photo de groupe · « Merci »")]))
html = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>" + "".join(P)
f = H / "planning_scripts.html"; f.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    pg.goto("file://" + str(f)); pg.wait_for_timeout(500); pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True); b.close()
f.unlink(); print(OUT)
