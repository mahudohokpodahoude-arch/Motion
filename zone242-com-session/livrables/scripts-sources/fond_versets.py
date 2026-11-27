# Fonds pour versets bibliques : carré 1080×1080 et story 1080×1920, avec et sans logo, + un exemple de mise en page.
# Usage : python fond_versets.py <dossier_sortie>
import pathlib, sys, shutil
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("presentation-dr-hestia/assets/logos_alpha.png", "logos.png"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(160deg,#ee1a02 0%,#f12e04 34%,#f5541a 72%,#fb7a2a 100%)}.a{position:absolute}"""
def bg(W, H, logo, text=False):
    s = H / W
    h = f'<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(255,185,130,.75) 0%,rgba(255,185,130,.25) 38%,rgba(255,185,130,0) 66%)"></div>'
    h += f'<img class="a" src="w1.png" style="left:-160px;top:{int(H*.42)}px;height:{int(H*1.0)}px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:{int(W*.52)}px;top:-120px;height:{int(H*.95)}px;opacity:.07;filter:brightness(2)">'
    h += '<div class="a" style="inset:0;background:#b80f00;opacity:.14;clip-path:polygon(0 0,16% 0,4% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(80% 0,100% 0,100% 100%,64% 100%)"></div>'
    h += '<div class="a" style="inset:0;background:#0260a6;opacity:.0"></div>'
    m = 56
    h += f'<div class="a" style="left:{m}px;top:{m}px;right:{m}px;bottom:{m}px;border:3px solid rgba(255,255,255,.45);border-radius:6px"></div>'
    h += f'<div class="a" style="left:{m+14}px;top:{m+14}px;right:{m+14}px;bottom:{m+14}px;border:1px solid rgba(255,255,255,.25);border-radius:4px"></div>'
    h += f'<div class="a" style="left:{W/2-36}px;top:{m-22}px;width:72px;height:44px;background:#d9300a;display:flex;align-items:center;justify-content:center"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"/></svg></div>'
    if logo: h += f'<img class="a" src="lockup.png" style="left:{W/2-120}px;bottom:{m+22}px;width:240px;filter:drop-shadow(0 0 12px rgba(255,255,255,.5))">'
    if text:
        ty = int(H * .20)
        h += f'<div class="a" style="left:0;width:{W}px;top:{ty}px;text-align:center;font-size:{int(H*.2)}px;line-height:.6;color:#ffe3cf;opacity:.55;font-family:B">“</div>'
        h += f'<div class="a" style="left:260px;width:{W-520}px;top:{ty+int(H*.2)}px;text-align:center;font-family:M;font-weight:800;font-size:{int(H*.062)}px;line-height:1.36;text-shadow:0 4px 18px rgba(110,10,0,.35)">Ici s’écrit le verset du jour, en une ou deux phrases, bien centré et lisible.</div>'
        h += f'<div class="a" style="left:0;width:{W}px;top:{ty+int(H*.2)+int(H*.062*1.36*3)+40}px;text-align:center"><span style="display:inline-block;background:#0b2a5c;color:#fff;font-family:M;font-weight:800;font-size:{int(H*.03)}px;letter-spacing:.12em;padding:8px 24px">LIVRE 0:00</span></div>'
    return f"<!doctype html><meta charset=utf-8><style>{CSS}body{{width:{W}px;height:{H}px}}</style>{h}"
P = {"Fond_Verset_1920x1080_sans_logo": (1920, 1080, False, False), "Fond_Verset_1920x1080_avec_logo": (1920, 1080, True, False), "Exemple_Verset_1920x1080": (1920, 1080, True, True)}
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for k, (W, H, lg, tx) in P.items():
        f = T / f"{k}.html"; f.write_text(bg(W, H, lg, tx))
        pg = b.new_context(viewport={"width": W, "height": H}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(400)
        pg.screenshot(path=str(OUT / f"{k}.png"))
    b.close()
shutil.rmtree(T); print("ok")
