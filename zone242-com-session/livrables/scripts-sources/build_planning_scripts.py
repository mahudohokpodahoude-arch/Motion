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
.scr{border:1px solid #cfd0e0;border-radius:8px;padding:12px 16px;margin:8px 0;page-break-inside:avoid}.scr h3{margin:0 0 2px;font-size:16px;font-weight:800;color:#10143a}.scr .m{color:#444;font-size:13px;margin-bottom:8px}.scr p{margin:0 0 9px;font-size:15px;line-height:1.55}.sch{font-size:20px;font-weight:800;color:#1900cf;margin:18px 0 4px}
.note{background:#fff4ec;border-left:6px solid #ff5a36;padding:9px 13px;margin:9px 0;font-size:13.5px;line-height:1.5}
tr{page-break-inside:avoid}
"""
def sc(title, meta, rows):
    t = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in rows)
    return f'<div class="sc"><h3>{title}</h3><div class="m">{meta}</div><table>{t}</table></div>'
P = []
P.append("""<h1>Planning de publication</h1>
<div class="sub">Week-end Zone Women · 27–29 novembre 2026 · mis à jour le jeudi 19 novembre (J-8) · heures de Cotonou. Les scripts des vidéos seront ajoutés dans un second temps.</div>
<table><tr><th style="width:90px">Date</th><th style="width:36%">Feed : carrousels, affiches, bios</th><th>Vidéos et stories</th></tr>
<tr><td><b>Jeu 19</b></td><td><b>16h00</b> Carrousel « 4 raisons d'être au Week-end Zone Women » · <span class="ok">publié</span></td><td><span class="tb">Tournage aujourd'hui :</span> Restaurée, Ointe, Envoyée</td></tr>
<tr><td><b>Ven 20</b></td><td>—</td><td><b>16h00</b> Vidéo motion qui présente les panélistes<br><b>20h00</b> Vidéo tournée <b>Restaurée</b><br><span class="tb">À tourner :</span> vidéo de la Prophétesse Mary (avant lundi)</td></tr>
<tr><td><b>Sam 21</b></td><td><b>12h30</b> Bio : <b>Pasteure Veronica</b><br><b>16h00</b> Bio : Pasteure Anne-Laure</td><td><b>18h00</b> <b>Contenu 2</b> : « Pourquoi venir… ? » (script en bas)<br><b>20h00</b> Vidéo tournée <b>Ointe</b></td></tr>
<tr><td><b>Dim 22</b></td><td><b>12h30</b> Bio : Évangéliste Jessie Vanessa<br><b>16h00</b> Bio : Prophétesse Pélagie<br>Annonce à l'assemblée (au culte)</td><td><b>7h30</b> Story J-5<br><b>18h00</b> <b>Contenu 3</b> : « Coucou ! » (script en bas)<br><b>20h00</b> Vidéo tournée <b>Envoyée</b></td></tr>
<tr><td><b>Lun 23</b></td><td><b>12h30</b> Bio : Dr Sylvie<br><b>16h00</b> Bio : Dr Marjolaine</td><td><b>7h30</b> Story J-4<br><b>18h00</b> <b>Contenu 1</b> : « Et si ce week-end… » (script en bas)<br><b>20h00</b> Zone Détente</td></tr>
<tr><td><b>Mar 24</b></td><td><b>12h30</b> Bio : Servante Manne<br><b>16h00</b> Bio : Leader Richmelle<br><b>18h00</b> Affiche de la Prophétesse Mary</td><td><b>7h30</b> Story J-3<br><b>20h00</b> <b>Vidéo de la Prophétesse Mary : elle annonce sa venue</b></td></tr>
<tr><td><b>Mer 25</b></td><td><b>12h30</b> Bio : Dr Hestia<br><b>16h00</b> Bio : Pasteure Espérance<br><b>18h00</b> Citation du thème</td><td><b>7h30</b> Story J-2<br><b>20h00</b> <b>Vidéo de Pasteure Delmica</b> (déjà reçue)</td></tr>
<tr><td><b>Jeu 26</b></td><td><b>12h30</b> Bio : Leader Huldah<br><b>16h00</b> Bio : Madame Tossou</td><td><b>7h30</b> Story J-1<br><b>18h00</b> Programme en 30 s<br><b>20h00</b> J-1 : tout ce qu'il faut savoir (plan d'accès)</td></tr>
<tr><td><b>Ven 27</b></td><td><b>9h00</b> Bios : Servante Roukiyatou PIWO, Pasteure Murielle, Imalia</td><td><b>7h30</b> Story Jour J · <b>18h00</b> Rappel de la soirée · <b>19h45</b> Soirée de lancement (direct possible) · Kit du direct</td></tr>
<tr><td><b>Sam 28</b></td><td>Citations par panel, dans l'heure qui suit chacun : <b>11h30</b>, <b>14h45</b>, <b>15h45</b>, <b>17h00</b> (jamais la table ronde)</td><td><b>20h00</b> « Samedi en 60 secondes » · « Une phrase, un panel »</td></tr>
<tr><td><b>Dim 29</b></td><td>Culte de clôture 8h45 · Agapè des Femmes 11h30 · photos</td><td><b>10h00</b> « Ce que je retiens » · <b>16h00</b> Remerciements</td></tr>
<tr><td><b>Lun 30 →</b></td><td>Témoignages, un extrait de panel par semaine</td><td><b>16h00</b> Récap du week-end · <b>20h00</b> « Ce qui a été restauré en moi »</td></tr></table>""")
P.append("""<div class="sch">Scripts</div>
<div class="scr"><h3>Contenu 1 · « Et si ce week-end… »</h3><div class="m">Lun 23 · 18h00 (date et heure proposées, à confirmer) · lien d'inscription en commentaire</div>
<p>« Et si ce week-end était justement le moment qu'il te fallait ?</p>
<p>Et si tu prenais quelques jours pour te recentrer, grandir et vivre quelque chose de spécial ?</p>
<p>Du 27 au 29 novembre, nous avons rendez-vous pour le WEEK-END ZONE WOMEN !</p>
<p>Ne reste pas en dehors de cette expérience.</p>
<p>Les inscriptions sont ouvertes, mais attention, les places sont limitées !</p>
<p>Retrouve le lien d'inscription en commentaire. On t'attend ! »</p></div>""")
P.append("""<div class="scr"><h3>Contenu 2 · « Pourquoi venir au WEEK-END ZONE WOMEN ? »</h3><div class="m">Sam 21 · 18h00 (date et heure proposées, à confirmer) · vidéo tournée avec 3 femmes et une voix off · lien d'inscription en commentaire</div>
<p><b>Femme 1 :</b> « Pourquoi venir au WEEK-END ZONE WOMEN ? »</p>
<p><b>Femme 2 :</b> « Parce que tu as besoin de prendre du temps pour toi et ta croissance. »</p>
<p><b>Femme 3 :</b> « Parce que tu fais partie d'une génération de femmes appelées à impacter ! »</p>
<p><b>Femme 1 :</b> « Alors, qu'est-ce que tu attends ? »</p>
<p><b>Toutes :</b> « Rendez-vous du 27 au 29 novembre ! »</p>
<p><b>Voix off :</b> « Inscris-toi dès maintenant. Lien en commentaire. »</p></div>""")
P.append("""<div class="scr"><h3>Contenu 3 · « Coucou ! » : à envoyer à une amie</h3><div class="m">Dim 22 · 18h00 (date et heure proposées, à confirmer) · vidéo · lien d'inscription en commentaire</div>
<p>« Coucou !</p>
<p>J'ai une information très importante pour toi !</p>
<p>Le WEEK-END ZONE WOMEN aura lieu du 27 au 29 novembre 2026.</p>
<p>Alors, envoie cette vidéo à ta sœur, ton amie, ta collègue, à toutes les femmes que tu aimerais voir vivre ce moment avec toi !</p>
<p>Et surtout, inscris-toi dès maintenant.</p>
<p>Le lien est en commentaire ! »</p></div>""")


html = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>" + "".join(P)
f = H / "planning_scripts.html"; f.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    pg.goto("file://" + str(f)); pg.wait_for_timeout(500); pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True); b.close()
f.unlink(); print(OUT)
