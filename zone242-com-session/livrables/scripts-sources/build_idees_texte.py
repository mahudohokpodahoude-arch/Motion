# 5 idées de vidéos, en texte continu (sans tableaux ni dates) · Week-end Zone Women
import pathlib
H = pathlib.Path(__file__).resolve().parent
OUT = H.parent / "documents" / "Idees_videos_texte_WZW.pdf"
CSS = """
@font-face{font-family:M;font-weight:600;src:url(file:///home/user/Motion/teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(file:///home/user/Motion/teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2)}
@page{size:A4;margin:18mm 18mm}
body{font-family:M,Arial,sans-serif;font-weight:600;color:#10143a;font-size:14.5px;line-height:1.65}
h1{font-size:26px;font-weight:800;color:#1900cf;margin:0 0 14px}
h2{page-break-after:avoid;font-size:16.5px;font-weight:800;margin:20px 0 4px;color:#10143a}
p{margin:0 0 10px}
"""
T = [
("1 · « Mon panel en 15 secondes »",
 ["Chaque panéliste se filme elle-même avec son téléphone, en vertical, à hauteur des yeux, face à une fenêtre et devant un fond calme, et invite en 15 secondes. Elle complète trois phrases : « Je m'appelle [prénom]. Je serai au [nom de la session]. Je vais parler de [un sujet qu'elle choisit]. Viens, on se retrouve au WEEK-END ZONE WOMEN ! » Deux prises suffisent.",
  "Au montage, j'ajoute les sous-titres, son nom et son titre, puis un écran final avec le nom de la session, l'heure et « Gratuit · 150 places ». Il n'y a ni actrice ni mise en scène : c'est la voix et le visage de la panéliste qui donnent de la crédibilité. Le seul risque est une qualité inégale d'une vidéo à l'autre, que les consignes de tournage limitent."]),
("2 · « Un mot, une session »",
 ["C'est une vidéo en motion, sans aucun tournage : six cartes de six secondes, animées sur le fond de l'affiche. Chaque session se résume en un mot qui reste en tête. GUÉRIR pour le Panel 1, « Guérir des traumatismes émotionnels », à 10h30. PRENDRE SOIN DE SOI pour « Belle et en bonne santé », à 12h00. SERVIR pour « Me voici, envoie-moi ! », à 14h00. BIEN GÉRER pour « Femme, foi et finances », à 15h00. BÂTIR pour « Ma maison, ma mission », à 16h00. OSER EN PARLER pour la grande table ronde, à 17h15, avec une carte seule et aucune image de la salle.",
  "Chaque carte se termine sur le logo WZW et « Gratuit · 150 places ». C'est la vidéo la plus rapide à produire. Les mots sont tirés de vos scripts, et vous pouvez en changer un si besoin."]),
("3 · « La question du jour »",
 ["C'est une vidéo en motion de huit secondes par session, avec du texte à l'écran et sans voix. Elle réutilise les questions de vos scripts, une par session, affichée seule. Pour le Panel 1 : « Est-ce que le fait de continuer à sourire signifie forcément que tu as guéri ? » Pour « Belle et en bonne santé » : « Connais-tu réellement les besoins de ton corps ? » Pour le Panel 2 : « Et si tu n'avais pas besoin d'attendre d'avoir tout pour commencer ? » Pour le Panel 3 : « Pourquoi est-ce si difficile d'épargner ? » Pour le Panel 4 : « Comment construire un foyer solide ? » Pour la table ronde : « Existe-t-il des sujets dont une femme chrétienne ne devrait jamais parler ? »",
  "Chaque carte se termine par « On en parle samedi à [heure] », le logo et « Gratuit · 150 places ». La question donne envie de venir chercher la réponse."]),
("4 · « À la pause café »",
 ["C'est une conversation naturelle entre deux amies, en un seul plan fixe de vingt secondes, assises à une table avec deux tasses. Elle est plus légère que vos sketches de quarante secondes, et on peut en faire une par session en changeant les deux premières répliques.",
  "Exemple pour le Panel 3. Femme 1 : « Tu as vu ? Il y a un panel sur la foi et les finances au WEEK-END ZONE WOMEN. » Femme 2 : « Franchement, j'en ai besoin. Je n'arrive jamais à épargner. » Femme 1 : « Alors viens avec moi. C'est le samedi, à 15h00. » Femme 2 : « Tu m'inscris ? » Femme 1 : « Le lien est en commentaire ! » Pour le Panel 1, on remplace les deux premières répliques par : « Il y a un panel sur guérir des traumatismes émotionnels. » et « Je crois que j'en ai besoin… », avec l'heure de 10h30.",
  "Il faut deux femmes, une table, de la lumière naturelle et un téléphone sur un support fixe. Un seul tournage de vingt minutes peut donner trois ou quatre versions."]),
("5 · « Samedi, on parle de… »",
 ["Les stories de décompte sont déjà prévues le matin. Au lieu d'un texte générique, chaque jour annonce un thème du samedi, ce qui transforme le décompte en teasing du programme. Ce sont cinq cartes de cinq secondes, en motion, sans tournage. « J-5 : samedi, 10h30, Guérir des traumatismes émotionnels. » « J-4 : samedi, 12h00, Belle et en bonne santé. » « J-3 : samedi, 14h00, Me voici, envoie-moi ! » « J-2 : samedi, 15h00, Femme, foi et finances. » « J-1 : samedi, 16h00, Ma maison, ma mission. »",
  "Chaque carte se termine sur le logo WZW et « Gratuit · 150 places · lien en bio »."]),
]
body = "<h1>5 idées de vidéos simples</h1>" + "".join(f"<h2>{t}</h2>" + "".join(f"<p>{x}</p>" for x in ps) for t, ps in T)
html = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}"
f = H / "idees_texte.html"; f.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    pg.goto("file://" + str(f)); pg.wait_for_timeout(500); pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True); b.close()
f.unlink(); print(OUT)
