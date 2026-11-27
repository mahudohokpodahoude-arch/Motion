# Bandeau de bas d'écran 1920×1080 (calque transparent) : onglet orange (titre) + zone de texte. Usage : python bande_bas.py <sortie>
import pathlib, sys, shutil
from PIL import Image
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2")]: shutil.copy(R / src, T / n)
def html(tag=None, line1=None, line2=None):
    t = ""
    if tag: t = f'<div class="a" style="left:132px;top:864px;width:430px;height:132px;display:flex;align-items:center;justify-content:center;font-family:B;font-size:64px;letter-spacing:.04em;text-align:center;line-height:.95;color:#fff;text-shadow:0 3px 8px rgba(110,10,0,.45)">{tag}</div>'
    if line1: t += f'<div class="a" style="left:610px;top:872px;width:1170px;font-family:M;font-weight:800;font-size:46px;line-height:1.15;color:#fff">{line1}</div>'
    if line2: t += f'<div class="a" style="left:610px;top:938px;width:1170px;font-family:M;font-weight:600;font-size:32px;line-height:1.2;color:#ffd9bf">{line2}</div>'
    return f"""<!doctype html><meta charset=utf-8><style>
@font-face{{font-family:B;src:url(bb.woff2)}}@font-face{{font-family:M;font-weight:600;src:url(m6.woff2)}}@font-face{{font-family:M;font-weight:800;src:url(m8.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1920px;height:1080px;background:transparent;overflow:hidden}}.a{{position:absolute}}</style>
<div class="a" style="left:100px;top:850px;width:1720px;height:160px;border-radius:20px;background:linear-gradient(90deg,#0b2a5c 0%,#0260a6 100%);border:5px solid #fff;box-shadow:0 14px 34px rgba(30,0,0,.5)"></div>
<div class="a" style="left:100px;top:850px;width:490px;height:160px;border-radius:20px 0 0 20px;background:linear-gradient(135deg,#f5541a,#d9300a);border:5px solid #fff;border-right:none"></div>
<div class="a" style="left:585px;top:855px;width:0;height:0;border-top:75px solid transparent;border-bottom:75px solid transparent;border-left:32px solid #d9300a"></div>
<div class="a" style="left:1760px;top:924px;width:20px;height:20px;background:#fff;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);opacity:.9"></div>
{t}"""
def shot(name, h):
    f = T / (name + ".html"); f.write_text(h)
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
        pg = b.new_context(viewport={"width": 1920, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(400)
        pg.screenshot(path=str(OUT / f"{name}.png"), omit_background=True); b.close()
shot("Bande_bas_1920x1080_vide_transparent", html())
shot("Bande_bas_1920x1080_avec_texte_transparent", html("PASTEURE<br>ANNE-LAURE", "Nom ou titre sur la première ligne", "Seconde ligne : fonction, message, référence…"))
ov = Image.open(OUT / "Bande_bas_1920x1080_avec_texte_transparent.png").convert("RGBA")
bg = Image.new("RGBA", ov.size, (40, 44, 70, 255))
from PIL import ImageDraw
d = ImageDraw.Draw(bg)
for y in range(1080): d.line([(0, y), (1920, y)], fill=(34 + y // 24, 38 + y // 28, 62 + y // 16, 255))
d.ellipse([800, 150, 1120, 470], fill=(210, 160, 130, 255)); d.rectangle([700, 470, 1220, 850], fill=(30, 30, 38, 255))
bg.alpha_composite(ov); bg.convert("RGB").save(OUT / "Exemple_Bande_bas_1920x1080.png"); shutil.rmtree(T); print("ok")
