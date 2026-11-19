# Planning de publication (dates) + scripts vidéo · Week-end Zone Women · 19 novembre 2026
import pathlib
H = pathlib.Path(__file__).resolve().parent
OUT = H.parent / "documents" / "Planning_publication_WZW.pdf"
CSS = """
@font-face{font-family:M;font-weight:600;src:url(file:///home/user/Motion/teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(file:///home/user/Motion/teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2)}
@page{size:A4 landscape;margin:11mm 12mm}
*{box-sizing:border-box}body{font-family:M,Arial,sans-serif;font-weight:600;color:#10143a;font-size:14px;line-height:1.5}
h1{font-size:30px;font-weight:800;color:#1900cf;margin:0 0 4px}h2{font-size:18px}
.sub{color:#444;margin-bottom:10px;font-size:13.5px}
table{width:100%;border-collapse:collapse;margin:6px 0 10px}th{background:#10143a;color:#fff;text-align:left;padding:8px 10px;font-size:14px;font-weight:800}
td{padding:8px 10px;border-bottom:1px solid #cfd0e0;vertical-align:top;font-size:14px}tr:nth-child(even) td{background:#f4f4fa}
td b{font-weight:800}
.ok{color:#0a8f4d;font-weight:800}.tb{color:#c2410c;font-weight:800}
.note{background:#fff4ec;border-left:6px solid #ff5a36;padding:9px 13px;margin:9px 0;font-size:13.5px;line-height:1.5}
tr{page-break-inside:avoid}
"""
def sc(title, meta, rows):
    t = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in rows)
    return f'<div class="sc"><h3>{title}</h3><div class="m">{meta}</div><table>{t}</table></div>'
P = []
P.append("""<h1>Planning de publication</h1>
<div class="sub">Week-end Zone Women · 27–29 novembre 2026 · mis à jour le jeudi 19 novembre (J-8). Les scripts des vidéos seront ajoutés dans un second temps.</div>
<table><tr><th style="width:90px">Date</th><th style="width:34%">Feed : carrousels et affiches</th><th>Vidéos</th></tr>
<tr><td><b>Jeu 19</b></td><td>Carrousel « 4 raisons d'être au Week-end Zone Women » · 16h00 · <span class="ok">publié</span></td><td><span class="tb">Tournage aujourd'hui :</span> Restaurée, Ointe, Envoyée</td></tr>
<tr><td><b>Ven 20</b></td><td>—</td><td>Vidéo motion qui présente les panélistes (annonce, 40 s) · <b>Vidéo tournée Restaurée</b><br><span class="tb">À tourner :</span> vidéo de la Prophétesse Mary (avant lundi)</td></tr>
<tr><td><b>Sam 21</b></td><td>Bios : <b>Pasteure Veronica</b> + Pasteure Anne-Laure</td><td>Vidéo tournée <b>Ointe</b></td></tr>
<tr><td><b>Dim 22</b></td><td>Bios : Évangéliste Jessie Vanessa + Prophétesse Pélagie · annonce à l'assemblée</td><td>Vidéo tournée <b>Envoyée</b> · décompte J-5</td></tr>
<tr><td><b>Lun 23</b></td><td>Bios : Dr Sylvie + Dr Marjolaine</td><td>Vidéo tournée <b>Envoyée</b> (suite) · Zone Détente · décompte J-4</td></tr>
<tr><td><b>Mar 24</b></td><td>Bios : Servante Manne + Leader Richmelle · affiche de la Prophétesse Mary</td><td><b>Vidéo de la Prophétesse Mary : elle annonce sa venue</b> · vidéo tournée <b>Envoyée</b> (suite) · décompte J-3</td></tr>
<tr><td><b>Mer 25</b></td><td>Bios : Dr Hestia + Pasteure Espérance · citation du thème</td><td><b>Vidéo de Pasteure Delmica</b> (déjà envoyée) · décompte J-2</td></tr>
<tr><td><b>Jeu 26</b></td><td>Bios : Leader Huldah + Madame Tossou · plan d'accès</td><td>Programme en 30 s · J-1 : tout ce qu'il faut savoir · décompte J-1</td></tr>
<tr><td><b>Ven 27</b></td><td>Matin : Servante Roukiyatou PIWO, Pasteure Murielle, Imalia · soirée de lancement 19h45</td><td>Kit du direct · décompte Jour J</td></tr>
<tr><td><b>Sam 28</b></td><td>Citations par panel, photos (jamais la table ronde)</td><td>« Samedi en 60 secondes » · « Une phrase, un panel » · « Ce que je retiens »</td></tr>
<tr><td><b>Dim 29</b></td><td>Culte de clôture 8h45 · Agapè des Femmes 11h30</td><td>« Ce que je retiens » (suite) · Remerciements</td></tr>
<tr><td><b>Lun 30 →</b></td><td>Récap, témoignages, un extrait de panel par semaine</td><td>Récap du week-end · « Ce qui a été restauré en moi » · Extraits de panels</td></tr></table>
<div class="note"><b>Vidéos optionnelles</b> (si l'équipe a le temps, à glisser dans les jours moins chargés) : « Je suis restaurée / ointe / envoyée » (motion), « Elle tient la Zone », « Mesdames, la Zone est à vous », « Invite une amie », « Un panel, une question ».</div>
<div class="note"><b>À confirmer :</b> l'ordre des bios après Veronica ; le nombre de vidéos Envoyée (3 tournées ?) et leurs dates après dimanche ; le contenu de la vidéo de la Prophétesse Mary et qui la tourne ; l'orthographe de « Pasteure Delmica » ; le rôle de Servante Roukiyatou PIWO (absente du programme) ; les noms de famille de Dr Sylvie, Dr Marjolaine, Mme Tossou, Murielle et Imalia ; les textes des bios à recevoir la veille de chaque publication.</div>""")
html = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>" + "".join(P)
f = H / "planning_scripts.html"; f.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    pg.goto("file://" + str(f)); pg.wait_for_timeout(500); pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True); b.close()
f.unlink(); print(OUT)
