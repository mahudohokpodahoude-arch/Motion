# Courrier d'invitation de la Prophétesse Mary Favour TONGSI (invitée d'honneur), signé par l'Apôtre Amos Elite et l'équipe d'organisation.
# Même charte que les courriers aux panélistes (courriers_panelistes_v2.py). Usage : python courrier_prophetesse.py <sortie> <logo_png> <dossier_polices>
import sys, pathlib, base64, html
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True); LOGO = pathlib.Path(sys.argv[2]); FONT = sys.argv[3]
v2 = (pathlib.Path(__file__).parent / "courriers_panelistes_v2.py").read_text()
css_src = v2[v2.index('\nCSS = """') + 1:v2.index('exec(body)')]
ns = {"FONT": FONT}; exec(css_src, ns); CSS = ns["CSS"]
CSS += ".sig{display:flex;gap:30px;margin-top:10px}.sig>div{flex:1}.sig .nm{font-weight:bold;color:#0260a6}.sig .ln{height:34px;border-bottom:1px solid #999;margin-bottom:4px}"
logo64 = base64.b64encode(LOGO.read_bytes()).decode()
GRAD = "linear-gradient(115deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)"
HEADER = f'''<div style="width:100%;padding:0 20mm;font-family:Carlito,Calibri,sans-serif;-webkit-print-color-adjust:exact">
<div style="display:flex;align-items:center;justify-content:space-between;height:15mm"><img src="data:image/png;base64,{logo64}" style="height:13mm">
<div style="text-align:right;font-size:8.5pt;color:#0260a6;line-height:1.25"><b style="font-size:10pt">WEEK-END ZONE WOMEN 2026</b><br>27 – 29 novembre 2026 · Zone 242, Sikècodji</div></div>
<div style="height:1.2mm;background:{GRAD};border-radius:1mm"></div></div>'''
FOOTER = f'''<div style="width:100%;padding:0 20mm;font-family:Carlito,Calibri,sans-serif;font-size:8pt;color:#333;-webkit-print-color-adjust:exact">
<div style="height:1.2mm;background:{GRAD};border-radius:1mm;margin-bottom:2mm"></div>
<div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="line-height:1.35"><b style="color:#0260a6">MILMO – Zone 242</b> · Sikècodji, rue de Golf FM, Cotonou<br>contact.zone242@gmail.com · 01 41 62 77 77 · #ZoneWoman</div>
<div style="text-align:right;color:#0260a6"><b>Page <span class="pageNumber"></span> / <span class="totalPages"></span></b></div></div></div>'''
BODY = """<div class=banner><div class=bt>WEEK-END ZONE WOMEN 2026</div><div class=bs>COURRIER D’INVITATION · INVITÉE D’HONNEUR</div></div>
<p class=obj>Objet : Invitation en qualité d’invitée d’honneur – Week-end Zone Women 2026, du 27 au 29 novembre 2026</p>
<p>Chère Prophétesse Mary Favour TONGSI,</p>
<p>Que la grâce et la paix de notre Seigneur Jésus-Christ soient avec vous.</p>
<p>C’est avec joie et respect que l’Apôtre Amos Elite et l’équipe d’organisation vous invitent, en qualité d’<b>invitée d’honneur</b>, au <b>Week-end Zone Women 2026</b>, qui se tiendra du vendredi 27 au dimanche 29 novembre 2026 à l’église MILMO – Zone 242, Sikècodji (rue de Golf FM, Cotonou).</p>
<p>Votre présence et votre ministère comptent beaucoup pour nous. Nous sommes heureux de pouvoir compter sur vous pour cette rencontre qui porte une vision particulière pour les femmes.</p>
<h2>Week-end Zone Women 2026 : une rencontre, une vision, une transformation</h2>
<p>Le Week-end Zone Women est un rassemblement dédié aux femmes. C’est un temps de communion, de partage, de restauration et de transformation. Nous souhaitons offrir à chaque participante un cadre favorable à la rencontre avec Dieu, au partage d’expériences et à l’épanouissement personnel et spirituel. Le thème de cette édition : <b>« Restaurée · Ointe · Envoyée »</b>, sous le slogan « Les femmes prennent le contrôle de la Zone ».</p>
<p>Pour cette édition, le programme s’articule autour de quatre grandes orientations :</p>
<h3>Pour être restaurée</h3><p>Un espace de dialogue autour des blessures intérieures et des traumatismes émotionnels. L’objectif est d’aborder avec bienveillance des sujets souvent difficiles à exprimer, de sortir du silence et d’ouvrir un chemin vers la guérison et la reconstruction.</p>
<h3>Pour être ointe</h3><p>Deux grands rendez-vous spirituels avec vous, le vendredi 27 novembre à 19h45 et le dimanche 29 novembre à 8h45.</p>
<h3>Pour être envoyée</h3><p>Des panels pour aider chaque femme à découvrir et à assumer son appel. Les échanges porteront notamment sur les thèmes : Me voici, envoie-moi !, Femme, foi et finances, Ma maison, ma mission.</p>
<h3>Pour se ressourcer et célébrer</h3><p>Un temps de détente et de bien-être (séance de relaxation, session « Belle et en bonne santé », Zone Détente), ainsi qu’une journée spéciale, la Women’s Experience Day, et l’Agapè des Femmes le dimanche : brunch convivial, témoignages et prière d’envoi.</p>
<p>À travers ces différents moments, nous souhaitons que chaque participante reparte fortifiée, renouvelée et mieux disposée à accomplir sa destinée.</p>
<h2>Votre place dans le programme</h2>
<p>Pendant tout le week-end, les femmes tiennent l’accueil, la louange, l’animation et l’organisation. Vous êtes notre invitée d’honneur pour les deux temps spirituels du week-end :</p>
<p style="break-after:avoid"><b>Informations relatives à votre venue :</b></p>
<div class=iv><div class=n>Rendez-vous 1 · Soirée de lancement</div><ul>
<li><b>Date :</b> Vendredi 27 novembre 2026</li><li><b>Horaire :</b> 19h45</li>
<li><b>Séquence :</b> Soirée de lancement du week-end (accueil par l’équipe des femmes, louange et adoration, message, temps de prière et de ministère : déroulé proposé, à ajuster avec vous)</li>
<li><b>Thème :</b> « Restaurée · Ointe · Envoyée »</li><li><b>Message :</b> à convenir avec vous</li></ul></div>
<div class=iv><div class=n>Rendez-vous 2 · Grand culte de clôture</div><ul>
<li><b>Date :</b> Dimanche 29 novembre 2026</li><li><b>Horaire :</b> 8h45</li>
<li><b>Séquence :</b> Grand culte de clôture et d’envoi (les femmes conduisent l’accueil, la louange et l’animation du culte)</li>
<li><b>Thème :</b> « Envoyée »</li><li><b>Message :</b> à convenir avec vous</li></ul></div>
<p>Les orientations et les informations pratiques concernant votre venue vous seront communiquées afin de vous permettre de bien vous préparer. Nous serions honorés de recevoir votre confirmation.</p>
<p>Toute l’équipe d’organisation est mobilisée pour assurer le bon déroulement de cette rencontre et vous accueillir dans les meilleures conditions. Nous sommes convaincus que votre ministère enrichira ce week-end et participera à l’édification des participantes.</p>
<p>Merci d’avance pour votre disponibilité. Nous avons hâte de vous accueillir au Week-end Zone Women 2026.</p>
<p>Que le Seigneur vous bénisse, renouvelle vos forces et continue de vous utiliser pour l’édification de Son peuple.</p>
<p>Fraternellement en Christ,</p>
<div class=sig><div><div class=ln></div><div class=nm>L’Apôtre Amos Elite</div>MILMO – Zone 242, Sikècodji</div>
<div><div class=ln></div><div class=nm>L’Équipe d’organisation</div>Week-end Zone Women 2026</div></div>"""
doc = f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{BODY}"
h = OUT / "tmp_prophetesse.html"; h.write_text(doc)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    pg.goto("file://" + str(h)); pg.wait_for_timeout(300)
    f = OUT / "Courrier_Invitation_Week-end_Zone_Women_2026_Prophetesse-Mary-Favour-TONGSI.pdf"
    pg.pdf(path=str(f), format="A4", margin=dict(top="26mm", bottom="22mm", left="20mm", right="20mm"), display_header_footer=True,
           header_template=HEADER, footer_template=FOOTER, print_background=True); b.close()
h.unlink(); print(f.name)
