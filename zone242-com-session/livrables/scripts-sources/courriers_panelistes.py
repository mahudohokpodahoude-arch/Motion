# Courriers personnalisés aux panélistes (WOMAN ZONE 2026) : 1 PDF par personne + PDF regroupé.
# Source : courrier officiel (texte repris tel quel) + programme final « Organisation WZW 2026 », dates 27-29 novembre.
import sys, pathlib, html, subprocess
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
DATE = "Samedi 28 novembre 2026"
S = {
 "P1": dict(seq="Panel 1 · Grande salle", h="10h30 – 11h30", th="« Guérir des traumatismes émotionnels » (Restaurée)",
    su="Blessures, deuils, rejets, violences : sortir du silence et retrouver la paix intérieure. Pistes du programme : reconnaître une blessure qui n'est pas encore guérie ; pardonner : est-ce oublier ? ; comment Dieu restaure le cœur, et ce qui dépend de moi ; où trouver de l'aide et de l'écoute dans l'Église."),
 "P2": dict(seq="Panel 2 · Grande salle", h="14h00 – 14h45", th="« Me voici, envoie-moi ! » (Ointe), Ésaïe 6:8",
    su="Découvrir son appel et se rendre utile à Dieu, là où l'on est. Pistes du programme : comment savoir ce que Dieu attend de moi ; « Qu'y a-t-il dans ta main ? » : servir avec ce que j'ai déjà ; concilier foyer, travail et service pour Dieu."),
 "P3": dict(seq="Panel 3 · Grande salle", h="15h00 – 15h45", th="« Femme, foi et finances » (Ointe)",
    su="Gérer son argent, entreprendre et prospérer sans renier sa foi. Pistes du programme : budget du mois, épargne, tontine ; lancer une activité avec peu de moyens ; argent et couple : en parler sans conflit."),
 "P4": dict(seq="Panel 4 · Grande salle", h="16h00 – 17h00", th="« Ma maison, ma mission » (Envoyée), Proverbes 14:1 : la femme sage bâtit sa maison",
    su="Le foyer, premier champ de mission : couple, enfants, organisation de la maison. Pistes du programme : bâtir un couple solide dans la durée ; éduquer ses enfants selon Dieu ; organiser sa maison et son temps."),
 "TR": dict(seq="Grande table ronde, avec toutes les panélistes · Grande salle", h="17h15 – 18h15", th="« Les conversations que les femmes n'osent pas avoir » (1h00, sans tabou)",
    su="Sujets abordés : mariage, célibat, divorce, maternité, infertilité, métier et maman, blessures et abus, avortement, ambitions, vie spirituelle. Règles : questions anonymes ; pas de direct ni de vidéo ; ce qui se dit ici reste ici ; une écoute disponible après."),
 "TRA": dict(seq="Animation de la grande table ronde · Grande salle", h="17h15 – 18h15", th="« Les conversations que les femmes n'osent pas avoir » (1h00, sans tabou)",
    su="Animation de la table ronde, avec toutes les panélistes. Sujets abordés : mariage, célibat, divorce, maternité, infertilité, métier et maman, blessures et abus, avortement, ambitions, vie spirituelle. Règles : questions anonymes ; pas de direct ni de vidéo ; ce qui se dit ici reste ici ; une écoute disponible après."),
 "SA": dict(seq="« Belle et en bonne santé » · Grande salle", h="12h00 – 13h00", th="« Belle et en bonne santé » (Restaurée), prendre soin du temple : 1 Corinthiens 6:19",
    su="Format : 15 minutes chacune (Dr Sylvie, santé ; Dr Majolaine, beauté), puis 30 minutes de questions. Votre partie : @@"),
}
SA_SYLVIE = "santé. Dépistages (sein, col de l'utérus) ; tension, diabète, fatigue, anémie ; ménopause ; dangers de l'automédication."
SA_MAJO = "beauté. Soins de la peau sous notre climat ; dangers des produits éclaircissants ; bien choisir ses produits avec un petit budget."
PEOPLE = [
 ("Pasteure Anne-Laure JEUNE NOZIER", ["P1","TR"], "Pasteure-Anne-Laure-JEUNE-NOZIER"),
 ("Prophétesse Pélagie MANTANVI", ["P1","P3","P4","TR"], "Prophetesse-Pelagie-MANTANVI"),
 ("Évangéliste Jessie Vanessa", ["P1","TR"], "Evangeliste-Jessie-Vanessa"),
 ("Pasteure Veronica", ["P1","TR"], "Pasteure-Veronica"),
 ("Prophétesse Manne", ["P2","TR"], "Prophetesse-Manne"),
 ("Docteure Hestia DAOUDOU", ["P2","P4","TR"], "Docteure-Hestia-DAOUDOU"),
 ("Leader Richmelle OUSSA", ["P2","TR"], "Leader-Richmelle-OUSSA"),
 ("Pasteure Espérance HOUEWATONOU", ["P3","TR"], "Pasteure-Esperance-HOUEWATONOU"),
 ("Leader Huldah OROUNLA", ["P3","TR"], "Leader-Huldah-OROUNLA"),
 ("Madame Tossou", ["P4","TR"], "Madame-Tossou"),
 ("Docteure Sylvie", ["SA:S"], "Docteure-Sylvie"),
 ("Docteure Majolaine", ["SA:M"], "Docteure-Majolaine"),
 ("Imalia", ["TRA"], "Imalia"),
 ("Pasteure Murielle", ["TRA"], "Pasteure-Murielle"),
]
CSS = """
@page{size:A4;margin:20mm 22mm 18mm}
*{box-sizing:border-box}
body{font-family:Carlito,Calibri,sans-serif;font-size:11pt;line-height:1.28;color:#000;margin:0}
.t{text-align:center;color:#7a3e5c;font-weight:bold;font-size:20pt;line-height:1.1}
.st{text-align:center;font-weight:bold;font-size:10pt;margin-top:4px;padding-bottom:6px;border-bottom:2px solid #7a3e5c;margin-bottom:12px}
p{margin:0 0 8px}
.obj{font-weight:bold}
h2{color:#7a3e5c;font-size:14pt;margin:14px 0 4px}
h3{color:#7a3e5c;font-size:9.5pt;margin:10px 0 2px;text-transform:uppercase}
ul{margin:2px 0 8px;padding-left:22px}li{margin-bottom:4px}
.iv{margin:6px 0 10px;padding:6px 10px;border-left:3px solid #7a3e5c;background:#f7f1f4;break-inside:avoid}
.iv .n{font-weight:bold;color:#7a3e5c;margin-bottom:2px}
.iv ul{margin:0;padding-left:20px}
"""
def iv_block(i, key, who):
    k = key.split(":")[0]; d = dict(S[k])
    if key == "SA:S": d["su"] = d["su"].replace("@@", SA_SYLVIE)
    if key == "SA:M": d["su"] = d["su"].replace("@@", SA_MAJO)
    e = html.escape
    return (f'<div class=iv><div class=n>Intervention {i}</div><ul>'
            f'<li><b>Date :</b> {DATE}</li><li><b>Horaire :</b> {d["h"]}</li><li><b>Séquence :</b> {e(d["seq"])}</li>'
            f'<li><b>Thème :</b> {e(d["th"])}</li><li><b>Sujet de votre intervention :</b> {e(d["su"])}</li></ul></div>')
def letter(name, keys):
    blocks = "".join(iv_block(i+1, k, name) for i, k in enumerate(keys)) if len(keys) > 1 else iv_block("", keys[0], name).replace("Intervention ", "Votre intervention").replace('<div class=n>Votre intervention</div>', '')
    return f"""<!doctype html><meta charset=utf-8><style>{CSS}</style>
<div class=t>WOMAN ZONE 2026</div><div class=st>COURRIER OFFICIEL À L’ATTENTION DES PANÉLISTES</div>
<p class=obj>Objet : WOMAN ZONE 2026 – Remerciements, présentation de la vision et préparation de votre intervention</p>
<p>Chère {html.escape(name)},</p>
<p>C’est avec joie et reconnaissance envers le Seigneur que nous vous remercions d’avoir accepté notre invitation à prendre part à WOMAN ZONE 2026, qui se tiendra du 27 au 29 novembre 2026 à l’église MILMO – Zone 242, Sikècodji.</p>
<p>Votre disponibilité et votre présence comptent beaucoup pour nous. Nous sommes heureuses de pouvoir compter sur vous pour cette rencontre qui porte une vision particulière pour les femmes.</p>
<h2>WOMAN ZONE 2026 : une rencontre, une vision, une transformation</h2>
<p>WOMAN ZONE est un rassemblement dédié aux femmes. C’est un temps de communion, de partage, de restauration et de transformation. Nous souhaitons offrir à chaque participante un cadre favorable à la rencontre avec Dieu, au partage d’expériences et à l’épanouissement personnel et spirituel.</p>
<p>Pour cette édition, le programme s’articule autour de quatre grandes orientations :</p>
<h3>Pour être restaurée</h3><p>Un espace de dialogue autour des blessures intérieures et des traumatismes émotionnels. L’objectif est d’aborder avec bienveillance des sujets souvent difficiles à exprimer, de sortir du silence et d’ouvrir un chemin vers la guérison et la reconstruction.</p>
<h3>Pour être ointe</h3><p>Deux grands rendez-vous spirituels avec la Prophétesse Mary Favour TONGSI, prévus le vendredi 27 novembre à 19h45 et le dimanche 29 novembre à 8h45.</p>
<h3>Pour être envoyée</h3><p>Des panels et un atelier pour aider chaque femme à découvrir et à assumer son appel. Les échanges porteront notamment sur les thèmes : Femme et appel, Femme, foi et finances, La femme sage bâtit sa maison, ainsi qu’un atelier dédié aux jeunes filles.</p>
<h3>Pour se ressourcer et célébrer</h3><p>Un temps de détente et de bien-être, ainsi qu’une journée spéciale: ateliers, barbecue, musique, jeux et témoignages avec la Women’s Expérience Day.</p>
<p>À travers ces différents moments, nous souhaitons que chaque participante reparte fortifiée, renouvelée et mieux disposée à accomplir sa destinée.</p>
<h2>Votre contribution au programme</h2>
<p>Les panels et la table ronde seront des moments de partage d’expériences, de réflexion et de transmission. Nous souhaitons des échanges sincères, bienveillants et pratiques, qui apporteront des pistes utiles aux participantes.</p>
<p style="break-after:avoid">Voici les informations relatives à votre intervention :</p>
{blocks}
<p>Les orientations et les informations pratiques concernant votre intervention vous seront communiquées afin de vous permettre de bien vous préparer.</p>
<p>Par ailleurs, afin de préparer votre présentation et de valoriser votre participation à WOMAN ZONE 2026, nous vous prions de bien vouloir nous transmettre les éléments suivants :</p>
<ul><li><b>Votre biographie :</b> une présentation de votre parcours personnel et professionnel, rédigée à la troisième personne, en faisant ressortir vos formations, vos responsabilités, vos engagements ministériels, le cas échéant, ainsi que vos domaines d’expertise et principales réalisations. Format souhaité : 150 à 250 mots.</li>
<li><b>Une courte vidéo d’invitation :</b> une vidéo de 30 à 40 secondes maximum, de préférence en format vertical, dans laquelle vous confirmez votre participation à WOMAN ZONE 2026 et invitez chaleureusement les femmes de votre entourage et de votre communauté à prendre part à cette rencontre.</li></ul>
<p><b>Date limite de transmission des éléments : 16-11-2026.</b></p>
<p>Ces informations nous permettront de préparer votre présentation et d’assurer une communication harmonieuse autour de l’événement.</p>
<p>Toute l’équipe d’organisation est mobilisée pour assurer le bon déroulement de cette rencontre et vous accueillir dans les meilleures conditions. Nous sommes convaincues que votre expérience et votre contribution enrichiront les échanges et participeront à l’édification des participantes.</p>
<p>Merci encore pour votre disponibilité et votre engagement à nos côtés. Nous avons hâte de vous retrouver à WOMAN ZONE 2026.</p>
<p>Que le Seigneur vous bénisse, renouvelle vos forces et continue de vous utiliser pour l’édification de Son peuple.</p>
<p>Fraternellement en Christ,<br><b>L’Équipe d’organisation WOMAN ZONE 2026</b><br>MILMO – Zone 242, Sikècodji</p>"""
files = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_page()
    for name, keys, slug in PEOPLE:
        h = OUT / f"{slug}.html"; h.write_text(letter(name, keys))
        pg.goto("file://" + str(h)); pg.wait_for_timeout(200)
        f = OUT / f"Courrier_WOMAN_ZONE_2026_{slug}.pdf"
        pg.pdf(path=str(f), prefer_css_page_size=True, print_background=True); files.append(f); h.unlink()
    b.close()
subprocess.run(["pdfunite", *map(str, files), str(OUT / "Courriers_WOMAN_ZONE_2026_tous.pdf")], check=True)
for f in files: print(f.name)
