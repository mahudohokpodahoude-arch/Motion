# Habillages verset : portrait 1080×1920 (vidéo en haut, verset en bas) et horizontal 1920×1080 avec panneau verset plus large.
# Usage : python habillage_verset2.py <sortie>
import pathlib, sys, shutil
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
def rr(x, y, w, h, r): return f"M{x+r} {y}H{x+w-r}A{r} {r} 0 0 1 {x+w} {y+r}V{y+h-r}A{r} {r} 0 0 1 {x+w-r} {y+h}H{x+r}A{r} {r} 0 0 1 {x} {y+h-r}V{y+r}A{r} {r} 0 0 1 {x+r} {y}Z"
L = {
 "portrait": dict(W=1080, H=1920, V=(60, 250, 960, 820), P=(60, 1120, 960, 560), title=(60, 34, 46), logo=(790, 20, 230), band=(60, 1742, 960, 90, 22, .38), vfs=50, vtop=70, reftop=110),
 "portrait_video": dict(W=1920, H=1080, V=(70, 140, 430, 764), P=(560, 140, 1290, 764), title=(70, 24, 50), logo=(1620, 8, 220), band=(70, 936, 1780, 84, 30, .5), vfs=66, vtop=120, reftop=150),
}
def html(c, verse=None, ref=None, hole=True):
    W, H = c["W"], c["H"]; VX, VY, VW, VH = c["V"]; PX, PY, PW, PH = c["P"]; tx, ty, tfs = c["title"]; lx, ly, lw = c["logo"]; bx, by, bw, bh, bfs, bls = c["band"]
    cp = ("clip-path:path(evenodd,'M0 0H" + str(W) + "V" + str(H) + "H0Z " + rr(VX, VY, VW, VH, 26) + "');") if hole else ""
    v = ""
    if verse:
        v = f'<div class="a" style="left:{PX+60}px;top:{PY+c["vtop"]}px;width:{PW-120}px;text-align:center;font-family:M;font-weight:800;font-size:{c["vfs"]}px;line-height:1.36;text-shadow:0 4px 18px rgba(110,10,0,.35)">{verse}</div>'
        v += f'<div class="a" style="left:{PX}px;width:{PW}px;top:{PY+PH-c["reftop"]}px;text-align:center;font-family:M;font-weight:600;font-style:italic;font-size:30px;color:#ffe3cf">{ref}</div>'
    return f"""<!doctype html><meta charset=utf-8><style>
@font-face{{font-family:B;src:url(bb.woff2)}}@font-face{{font-family:M;font-weight:600;src:url(m6.woff2)}}@font-face{{font-family:M;font-weight:800;src:url(m8.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:{W}px;height:{H}px;background:transparent;overflow:hidden;font-family:B;color:#fff}}.a{{position:absolute}}</style>
<div class="a" style="inset:0;{cp}background:linear-gradient(160deg,#ee1a02 0%,#f12e04 34%,#f5541a 72%,#fb7a2a 100%)">
<img class="a" src="w1.png" style="left:-120px;top:{int(H*.4)}px;height:{int(min(W,H)*.95)}px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:{int(W*.55)}px;top:-160px;height:{int(min(W,H)*.9)}px;opacity:.07;filter:brightness(2)">
<div class="a" style="inset:0;background:#b80f00;opacity:.14;clip-path:polygon(0 0,12% 0,3% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(84% 0,100% 0,100% 100%,70% 100%)"></div></div>
<div class="a" style="left:{VX-6}px;top:{VY-6}px;width:{VW+12}px;height:{VH+12}px;border-radius:32px;border:6px solid #fff;box-shadow:0 0 0 3px rgba(11,42,92,.65),0 18px 40px rgba(70,0,0,.4)"></div>
<div class="a" style="left:{PX}px;top:{PY}px;width:{PW}px;height:{PH}px;border-radius:26px;background:radial-gradient(ellipse at 50% 40%,#f5541a,#d9300a 70%);border:6px solid rgba(255,255,255,.9);box-shadow:0 18px 40px rgba(70,0,0,.4)"></div>
<div class="a" style="left:{PX+24}px;top:{PY+24}px;width:{PW-48}px;height:{PH-48}px;border-radius:16px;border:2px solid rgba(255,255,255,.35)"></div>
<div class="a" style="left:{PX+PW/2-26}px;top:{PY-20}px;width:52px;height:40px;background:#0b2a5c;display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"/></svg></div>
{v}
<div class="a" style="left:{tx}px;top:{ty}px;font-size:{tfs}px;line-height:.92;letter-spacing:.02em;text-shadow:0 4px 14px rgba(110,10,0,.35)">LES FEMMES PRENNENT<br>LE CONTRÔLE DE LA ZONE</div>
<img class="a" src="lockup.png" style="left:{lx}px;top:{ly}px;width:{lw}px;filter:drop-shadow(0 0 14px rgba(255,255,255,.55))">
<div class="a" style="left:{bx}px;top:{by}px;width:{bw}px;height:{bh}px;border-radius:42px;background:linear-gradient(90deg,#0b2a5c,#0260a6);border:4px solid #fff;box-shadow:0 12px 26px rgba(60,0,0,.4);display:flex;align-items:center;justify-content:center;font-family:M;font-weight:800;font-size:{bfs}px;letter-spacing:{bls}em;white-space:nowrap">27–29 NOVEMBRE · ZONE 242 · SIKÈCODJI</div>
"""
def shot(name, h, W, H):
    f = T / (name + ".html"); f.write_text(h)
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
        pg = b.new_context(viewport={"width": W, "height": H}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"{name}.png"), omit_background=True); b.close()
FAKE = "Ici s’écrit le verset du jour, en une ou deux phrases, bien lisible."
for key, c in [(k, v) for k, v in L.items() if k == "portrait_video"]:
    W, H = c["W"], c["H"]; VX, VY, VW, VH = c["V"]
    shot(f"Habillage_Verset_{key}_{W}x{H}_calque_transparent", html(c), W, H)
    shot("_ex", html(c, FAKE, "Livre 0:00 (exemple)"), W, H)
    ov = Image.open(OUT / "_ex.png").convert("RGBA"); vid = Image.new("RGBA", ov.size, (24, 26, 36, 255)); d = ImageDraw.Draw(vid)
    for i in range(VH): d.line([(VX, VY + i), (VX + VW, VY + i)], fill=(40 + i // 12, 44 + i // 14, 70 + i // 8, 255))
    cx = VX + VW // 2; d.ellipse([cx - 90, VY + 170, cx + 90, VY + 350], fill=(210, 160, 130, 255)); d.rectangle([cx - 150, VY + 350, cx + 150, VY + VH], fill=(30, 30, 38, 255))
    vid.alpha_composite(ov); vid.convert("RGB").save(OUT / f"Exemple_Habillage_Verset_{key}_{W}x{H}.png"); (OUT / "_ex.png").unlink()
shutil.rmtree(T); print("ok")
