# Un bandeau de bas d'écran (1920×1080, transparent) par personne : onglet = titre, zone = nom complet. Usage : python bandes_noms.py <sortie>
import pathlib, sys, shutil, re
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2")]: shutil.copy(R / src, T / n)
# (titre, nom complet) : d'après le programme et les affiches ; noms de famille manquants non inventés
P = [("PROPHÉTESSE", "Mary Favour TONGSI"), ("PASTEURE", "Anne-Laure JEUNE NOZIER"), ("PROPHÉTESSE", "Pélagie MANTANVI"), ("ÉVANGÉLISTE", "Jessie Vanessa"), ("PASTEURE", "Veronica"),
     ("DR", "Sylvie"), ("DR", "Marjolaine"), ("DR", "Hestia DAOUDOU"), ("SERVANTE", "Manne"), ("LEADER", "Richmelle OUSSA"), ("PASTEURE", "Espérance HOUEWATONOU"),
     ("LEADER", "Huldah OROUNLA"), ("MADAME", "Tossou"), ("SERVANTE", "Roukiyatou PIWO"), ("PASTEURE", "Murielle"), ("ANIMATRICE", "Imalia")]
def html(tag, name):
    fs = 72 if len(name) <= 24 else 60
    return f"""<!doctype html><meta charset=utf-8><style>
@font-face{{font-family:B;src:url(bb.woff2)}}@font-face{{font-family:M;font-weight:800;src:url(m8.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1920px;height:1080px;background:transparent;overflow:hidden}}.a{{position:absolute}}</style>
<div class="a" style="left:0;top:850px;width:1920px;height:230px;background:linear-gradient(90deg,#0b2a5c 0%,#0260a6 100%);border-top:6px solid #fff;box-shadow:0 -10px 30px rgba(30,0,0,.4)"></div>
<div class="a" style="left:0;top:850px;width:560px;height:230px;background:linear-gradient(135deg,#f5541a,#d9300a);border-top:6px solid #fff"></div>
<div class="a" style="left:560px;top:856px;width:0;height:0;border-top:112px solid transparent;border-bottom:112px solid transparent;border-left:44px solid #d9300a"></div>
<div class="a" style="left:1840px;top:950px;width:22px;height:22px;background:#fff;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);opacity:.9"></div>
<div class="a" style="left:0;top:856px;width:560px;height:224px;display:flex;align-items:center;justify-content:center;font-family:B;font-size:84px;letter-spacing:.05em;color:#fff;text-shadow:0 3px 8px rgba(110,10,0,.45)">{tag}</div>
<div class="a" style="left:650px;top:856px;width:1170px;height:224px;display:flex;align-items:center;font-family:M;font-weight:800;font-size:{fs}px;color:#fff;white-space:nowrap">{name}</div>"""
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1920, "height": 1080}).new_page()
    for tag, name in P:
        import unicodedata; slug = re.sub(r"[^A-Za-z0-9]+", "_", unicodedata.normalize("NFKD", (tag + " " + name).title()).encode("ascii", "ignore").decode()).strip("_")
        f = T / "b.html"; f.write_text(html(tag, name)); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(250)
        pg.screenshot(path=str(OUT / f"Bande_{slug}.png"), omit_background=True)
    f = T / 'b.html'; f.write_text(html('', '')); pg.goto('file://' + str(f)); pg.wait_for_timeout(250); pg.screenshot(path=str(OUT.parent / 'Bande_bas_1920x1080_vide_transparent.png'), omit_background=True)
    b.close()
shutil.rmtree(T); print(len(P))
