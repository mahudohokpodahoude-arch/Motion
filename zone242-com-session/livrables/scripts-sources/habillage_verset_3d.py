# Habillage verset en relief (3D) 1920×1080 : cadres biseautés, extrusion, ombres profondes ; deux fenêtres transparentes (vidéo portrait + verset large).
import pathlib, sys, shutil
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
W, H = 1920, 1080; V = (90, 140, 430, 764); P = (590, 140, 1240, 764); B = 24
def rr(x, y, w, h, r): return f"M{x+r} {y}H{x+w-r}A{r} {r} 0 0 1 {x+w} {y+r}V{y+h-r}A{r} {r} 0 0 1 {x+w-r} {y+h}H{x+r}A{r} {r} 0 0 1 {x} {y+h-r}V{y+r}A{r} {r} 0 0 1 {x+r} {y}Z"
ext = ",".join(f"{i}px {i}px 0 rgba({int(150-i*3)},{int(20-i*0.5)},0,1)" for i in range(1, 22))
def frame(x, y, w, h, r=34):
    return (f'<div class="a" style="left:{x-B}px;top:{y-B}px;width:{w}px;height:{h}px;border-radius:{r+B//2}px;border:{B}px solid;border-color:#fff1e6 #f7b894 #b83a0c #ffd9bf;'
            f'box-shadow:{ext},0 40px 60px rgba(40,0,0,.55),inset 0 0 26px rgba(0,0,0,.55),inset 0 6px 10px rgba(0,0,0,.35)"></div>')
def html(verse=None, ref=None):
    hole = "clip-path:path(evenodd,'M0 0H1920V1080H0Z " + rr(*V, 34) + " " + rr(*P, 34) + "');"
    v = ""
    if verse:
        v = f'<div class="a" style="left:{P[0]+60}px;top:{P[1]+120}px;width:{P[2]-120}px;text-align:center;font-family:M;font-weight:800;font-size:66px;line-height:1.36;text-shadow:3px 3px 0 rgba(0,0,0,.4),0 8px 22px rgba(0,0,0,.45)">{verse}</div>'
        v += f'<div class="a" style="left:{P[0]}px;width:{P[2]}px;top:{P[1]+P[3]-150}px;text-align:center;font-family:M;font-weight:600;font-style:italic;font-size:30px;color:#ffe3cf">{ref}</div>'
    return f"""<!doctype html><meta charset=utf-8><style>
@font-face{{font-family:M;font-weight:600;src:url(m6.woff2)}}@font-face{{font-family:M;font-weight:800;src:url(m8.woff2)}}
*{{margin:0;padding:0;box-sizing:content-box}}html,body{{width:1920px;height:1080px;background:transparent;overflow:hidden;color:#fff}}.a{{position:absolute}}</style>
<div class="a" style="left:0;top:0;width:1920px;height:1080px;{hole}background:radial-gradient(ellipse at 45% 35%,#ff6a2a 0%,#ee2a06 45%,#a81400 100%)">
<img class="a" src="w1.png" style="left:-140px;top:380px;height:980px;opacity:.12;filter:brightness(2) drop-shadow(14px 14px 0 rgba(90,0,0,.5))"><img class="a" src="w2.png" style="left:1100px;top:-180px;height:960px;opacity:.12;filter:brightness(2) drop-shadow(14px 14px 0 rgba(90,0,0,.5))">
<div class="a" style="left:0;top:880px;width:1920px;height:200px;background:linear-gradient(180deg,rgba(60,0,0,0),rgba(60,0,0,.55))"></div></div>
{frame(*V)}{frame(*P)}
<div class="a" style="left:{P[0]+P[2]/2-34}px;top:{P[1]-B-26}px;width:68px;height:52px;background:linear-gradient(145deg,#1b4a8a,#071d45);box-shadow:5px 5px 0 #040f26,0 12px 20px rgba(0,0,0,.5);border:3px solid #fff;display:flex;align-items:center;justify-content:center"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"/></svg></div>
{v}"""
def shot(name, h):
    f = T / (name + ".html"); f.write_text(h)
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
        pg = b.new_context(viewport={"width": W, "height": H}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"{name}.png"), omit_background=True); b.close()
shot("Habillage_Verset_3D_1920x1080_calque_transparent", html())
shot("_ex", html("Ici s’écrit le verset du jour, en une ou deux phrases, bien lisible.", "Livre 0:00 (exemple)"))
ov = Image.open(OUT / "_ex.png").convert("RGBA"); vid = Image.new("RGBA", ov.size, (24, 26, 36, 255)); d = ImageDraw.Draw(vid)
VX, VY, VW, VH = V
for i in range(VH): d.line([(VX, VY + i), (VX + VW, VY + i)], fill=(40 + i // 12, 44 + i // 14, 70 + i // 8, 255))
cx = VX + VW // 2; d.ellipse([cx - 90, VY + 170, cx + 90, VY + 350], fill=(210, 160, 130, 255)); d.rectangle([cx - 150, VY + 350, cx + 150, VY + VH], fill=(30, 30, 38, 255))
d.rectangle([P[0], P[1], P[0] + P[2], P[1] + P[3]], fill=(22, 24, 34, 255))
vid.alpha_composite(ov); vid.convert("RGB").save(OUT / "Exemple_Habillage_Verset_3D_1920x1080.png"); (OUT / "_ex.png").unlink(); shutil.rmtree(T); print("ok")
