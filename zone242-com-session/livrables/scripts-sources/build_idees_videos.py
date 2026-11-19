# 5 idées de vidéos simples à produire, basées sur les ateliers et panels · Week-end Zone Women
import pathlib
H = pathlib.Path(__file__).resolve().parent
OUT = H.parent / "documents" / "Idees_videos_simples_WZW.pdf"
CSS = """
@font-face{font-family:M;font-weight:600;src:url(file:///home/user/Motion/teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(file:///home/user/Motion/teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2)}
@page{size:A4 landscape;margin:11mm 12mm}
*{box-sizing:border-box}body{font-family:M,Arial,sans-serif;font-weight:600;color:#10143a;font-size:14px;line-height:1.5}
h1{font-size:30px;font-weight:800;color:#1900cf;margin:0 0 4px}.sub{color:#444;margin-bottom:10px;font-size:13.5px}
table{width:100%;border-collapse:collapse;margin:6px 0 10px}th{background:#10143a;color:#fff;text-align:left;padding:8px 10px;font-size:14px;font-weight:800}
td{padding:8px 10px;border-bottom:1px solid #cfd0e0;vertical-align:top;font-size:14px}tr:nth-child(even) td{background:#f4f4fa}td b{font-weight:800}
.card{border:1px solid #cfd0e0;border-radius:8px;padding:9px 14px;margin:9px 0;page-break-inside:avoid}
.card h2{margin:0 0 2px;font-size:17px;font-weight:800;color:#10143a}.card .m{color:#444;font-size:13px;margin-bottom:6px}
.card p{margin:0 0 5px;font-size:13px;line-height:1.4}.card table{margin:3px 0 4px}.card td{font-size:12.8px;padding:4px 8px;line-height:1.38}.card td:first-child{width:130px;font-weight:800}
.tag{display:inline-block;border-radius:5px;padding:1px 8px;font-size:12px;font-weight:800;margin-right:6px}.mo{background:#e6ecff;color:#1900cf}.tr{background:#ffeadf;color:#c2410c}
"""
def card(n, title, tag, meta, why, rows, extra=""):
    t = '<span class="tag mo">Motion · sans tournage</span>' if tag == "M" else '<span class="tag tr">Tournage léger</span>'
    r = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in rows)
    return f'<div class="card"><h2>{n} · {title}</h2><div class="m">{t}{meta}</div><p><b>Pourquoi :</b> {why}</p><table>{r}</table>{extra}</div>'
P = ["""<h1>5 idées de vidéos simples à produire</h1>
<div class="sub">Week-end Zone Women · 27–29 novembre 2026 · basées sur les ateliers et panels du samedi 28. Elles complètent vos 6 vidéos promotionnelles (une par session), sans les répéter : ici, on cherche le plus rapide à faire.</div>
<table><tr><th style="width:36%">Idée</th><th>Type</th><th>Durée</th><th>Sessions concernées</th><th>Effort</th></tr>
<tr><td><b>1 · « Mon panel en 15 secondes »</b></td><td>Selfie de la panéliste</td><td>15 s</td><td>Les 5 sessions</td><td>Léger : 1 téléphone</td></tr>
<tr><td><b>2 · « Un mot, une session »</b></td><td>Motion</td><td>6 s × 6</td><td>Les 5 sessions + table ronde</td><td>Aucun tournage</td></tr>
<tr><td><b>3 · « La question du jour »</b></td><td>Motion (vos questions)</td><td>8 s × 6</td><td>Les 5 sessions + table ronde</td><td>Aucun tournage</td></tr>
<tr><td><b>4 · « À la pause café »</b></td><td>Duo, un seul plan</td><td>20 s</td><td>Au choix, une par session</td><td>Léger : 2 femmes, 1 table</td></tr>
<tr><td><b>5 · « Samedi, on parle de… »</b></td><td>Motion, décompte par session</td><td>5 s × 5</td><td>Du 22 au 26 nov.</td><td>Aucun tournage</td></tr></table>
<div class="sub"><b>Les sessions (programme) :</b> Panel 1 · Guérir des traumatismes émotionnels (sam. 10h30) · Belle et en bonne santé (12h00) · Panel 2 · Me voici, envoie-moi ! (14h00) · Panel 3 · Femme, foi et finances (15h00) · Panel 4 · Ma maison, ma mission (16h00) · Grande table ronde (17h15).</div>"""]
P.append(card(1, "« Mon panel en 15 secondes »", "T", "9:16 · 15 s · une vidéo par panéliste, tournée par elle-même",
 "Aucune actrice, aucune mise en scène : c'est la panéliste qui invite. Sa voix et son visage donnent de la crédibilité, et le tournage tient en 2 prises avec un téléphone.",
 [("Consigne", "Téléphone en vertical, à hauteur des yeux, face à une fenêtre, fond calme, 2 prises maximum."),
  ("À dire (elle complète)", "« Je m'appelle [prénom]. Je serai au [nom de la session]. Je vais parler de [un sujet qu'elle choisit]. Viens, on se retrouve au WEEK-END ZONE WOMEN, du 27 au 29 novembre ! »"),
  ("Montage", "Sous-titres, titre et nom de la panéliste, écran final avec le nom de la session, le jour et l'heure, « Gratuit · 150 places »."),
  ("Il faut", "Que chaque panéliste envoie sa vidéo avant la date de publication de sa bio.")],
 "<p><b>Risque :</b> qualité inégale d'une panéliste à l'autre. Les consignes ci-dessus le limitent.</p>"))
P.append(card(2, "« Un mot, une session »", "M", "9:16 · 6 s × 6 cartes · animation de texte aux couleurs de l'affiche",
 "Chaque session se résume en un mot qui reste en tête. C'est la vidéo la plus rapide à produire, et elle se publie en story ou en reel.",
 [("Carte 1", "GUÉRIR : Panel 1 · samedi 10h30"), ("Carte 2", "PRENDRE SOIN DE SOI : Belle et en bonne santé · samedi 12h00"),
  ("Carte 3", "SERVIR : Panel 2 · Me voici, envoie-moi ! · samedi 14h00"), ("Carte 4", "BIEN GÉRER : Panel 3 · Femme, foi et finances · samedi 15h00"),
  ("Carte 5", "BÂTIR : Panel 4 · Ma maison, ma mission · samedi 16h00"), ("Carte 6", "OSER EN PARLER : Grande table ronde · samedi 17h15 (carte seule, aucune image de la salle)"),
  ("Fin de chaque carte", "Logo WZW · « 27–29 novembre · Gratuit · 150 places »")],
 "<p><b>Vos mots sont à valider :</b> je les ai tirés de vos scripts, à vous de me dire si l'un d'eux ne convient pas.</p>"))
P.append(card(3, "« La question du jour »", "M", "9:16 · 8 s × 6 · texte à l'écran, sans voix",
 "Vos scripts posent déjà de bonnes questions. On en garde une par session, affichée seule, avec l'heure de la session. Elle donne envie de venir chercher la réponse.",
 [("Panel 1", "« Est-ce que le fait de continuer à sourire signifie forcément que tu as guéri ? »"),
  ("Belle et en bonne santé", "« Connais-tu réellement les besoins de ton corps ? »"),
  ("Panel 2", "« Et si tu n'avais pas besoin d'attendre d'avoir tout pour commencer ? »"),
  ("Panel 3", "« Pourquoi est-ce si difficile d'épargner ? »"),
  ("Panel 4", "« Comment construire un foyer solide ? »"),
  ("Table ronde", "« Existe-t-il des sujets dont une femme chrétienne ne devrait jamais parler ? »"),
  ("Fin de chaque carte", "« On en parle samedi à [heure]. » + logo + « Gratuit · 150 places »")]))
P.append(card(4, "« À la pause café »", "T", "9:16 · 20 s · un seul plan fixe, deux femmes à une table",
 "Une conversation naturelle entre deux amies, plus légère que vos sketches de 40 s : une seule situation, un seul décor, un seul plan. On peut en faire une par session en changeant les deux premières répliques.",
 [("Exemple · Panel 3", "Femme 1 : « Tu as vu ? Il y a un panel sur la foi et les finances au WEEK-END ZONE WOMEN. »<br>Femme 2 : « Franchement, j'en ai besoin. Je n'arrive jamais à épargner. »<br>Femme 1 : « Alors viens avec moi. C'est le samedi, à 15h00. »<br>Femme 2 : « Tu m'inscris ? »<br>Femme 1 : « Le lien est en commentaire ! »"),
  ("Variante · Panel 1", "Remplacer les deux premières répliques : « Il y a un panel sur guérir des traumatismes émotionnels. » / « Je crois que j'en ai besoin… » Heure : samedi 10h30."),
  ("Il faut", "Deux femmes, une table, deux tasses, de la lumière naturelle, un téléphone sur un support fixe. Un seul tournage de 20 minutes peut donner 3 à 4 versions.")]))
P.append(card(5, "« Samedi, on parle de… »", "M", "9:16 · 5 s × 5 · remplace les cartes de décompte J-5 à J-1 par des cartes avec une session",
 "Les stories de décompte sont déjà prévues le matin. Au lieu d'un texte générique, chaque jour annonce un thème du samedi : le décompte devient aussi un teasing du programme.",
 [("Dim 22 · J-5", "« J-5 · Samedi 28, 10h30 : Guérir des traumatismes émotionnels »"),
  ("Lun 23 · J-4", "« J-4 · Samedi 28, 12h00 : Belle et en bonne santé »"),
  ("Mar 24 · J-3", "« J-3 · Samedi 28, 14h00 : Me voici, envoie-moi ! »"),
  ("Mer 25 · J-2", "« J-2 · Samedi 28, 15h00 : Femme, foi et finances »"),
  ("Jeu 26 · J-1", "« J-1 · Samedi 28, 16h00 : Ma maison, ma mission »"),
  ("Fin de chaque carte", "Logo WZW · « Gratuit · 150 places · lien en bio »")]))
P.append("""<div class="card"><h2>Mon avis : par où commencer</h2>
<p><b>Les idées 2, 3 et 5 se font en motion, sans tournage et sans dépendre de personne.</b> Je peux les produire d'un coup dès que vous validez les mots et les questions. Ce sont celles que je recommande en premier.</p>
<p><b>L'idée 1 est la plus utile à terme</b> : les panélistes parlent elles-mêmes. Mais elle dépend de leur disponibilité, donc à lancer tout de suite pour avoir les vidéos avant leurs bios.</p>
<p><b>L'idée 4 n'est à faire que si vous avez déjà deux femmes à l'écran</b> pour d'autres tournages (contenus 2 et 6) : le tournage se fait le même jour.</p>
<p><b>Points d'attention sur vos 6 scripts :</b> les questions sur le divorce et l'infertilité (session 6) touchent à des sujets personnels, donc à valider avec les responsables ; les questions de santé et de produits cosmétiques (session 2) sont à faire relire par Dr Sylvie et Dr Marjolaine ; la table ronde n'est jamais filmée.</p></div>""")
html = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>" + "".join(P)
f = H / "idees_videos.html"; f.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    pg.goto("file://" + str(f)); pg.wait_for_timeout(500); pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True); b.close()
f.unlink(); print(OUT)
