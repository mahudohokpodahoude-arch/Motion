# Visuel « invitée » d'une panéliste, style de l'affiche du vendredi (variante B). 1080×1080.
# Usage : python affiche_invitee_panel.py <dossier_sortie>
import pathlib, sys, shutil, subprocess
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); HERE = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("presentation-dr-hestia/assets/logos_alpha.png", "logos.png"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
subprocess.run([sys.executable, str(HERE / "nettoyer_detourage.py"), str(R / "annonce-wzw-reference/assets/photos/anne.png"), str(T / "p.png"), "3"], check=True, capture_output=True)
im = Image.open(T / "p.png"); a = np.array(im)[..., 3]; H = im.size[1]; W0 = im.size[0]
cols = np.where((a[: int(H * .25)] > 128).any(0))[0]; face_cx = (cols.min() + cols.max()) / 2   # axe de la tête
IH = 860; sc = IH / H; iw = W0 * sc; left = 790 - 250 - face_cx * sc          # tête centrée sur x = 790 dans le visuel
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}.lock{filter:drop-shadow(0 0 16px rgba(255,255,255,.55))}.mary{filter:drop-shadow(0 18px 34px rgba(70,0,0,.4))}
.lab{background:#0b2a5c;color:#fff;font-family:M;font-weight:800;letter-spacing:.08em;display:inline-block}.ft{font-family:M;font-weight:800;color:#ffe3cf;letter-spacing:.07em}"""
MASK = "-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent 100%);mask-image:linear-gradient(180deg,#000 80%,transparent 100%)"
body = ('<div class="a" style="inset:0;background:radial-gradient(ellipse at 62% 40%,rgba(255,170,110,.8),rgba(255,170,110,0) 58%)"></div>'
 '<img class="a" src="w1.png" style="left:-140px;top:300px;height:900px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:600px;top:-120px;height:820px;opacity:.07;filter:brightness(2)">'
 '<div class="a" style="inset:0;background:#b80f00;opacity:.14;clip-path:polygon(0 0,18% 0,6% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(78% 0,100% 0,100% 100%,62% 100%)"></div>'
 '<img class="a" src="logos.png" style="left:40px;top:36px;width:104px">'
 f'<div class="a" style="left:250px;top:0;width:830px;height:{130 + IH}px;overflow:hidden;{MASK}"><img class="mary" src="p.png" style="-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 16%);mask-image:linear-gradient(90deg,transparent 0,#000 16%);position:absolute;left:{left:.0f}px;top:130px;height:{IH}px"></div>'
 '<img class="a lock" src="lockup.png" style="left:64px;top:150px;width:360px">'
 '<div class="a ft" style="left:64px;top:342px;font-size:21px;letter-spacing:.22em">ELLE VOUS INVITE</div>'
 '<div class="a" style="left:64px;top:400px;font-size:170px;line-height:.82;text-shadow:0 8px 30px rgba(110,10,0,.35)">10H30</div>'
 '<div class="a" style="left:64px;top:560px;width:400px;height:150px;background:#0260a6;clip-path:polygon(0 0,100% 6%,100% 100%,0 94%)"></div>'
 '<div class="a" style="left:92px;top:574px;font-size:40px;line-height:1;letter-spacing:.06em">SAMEDI</div><div class="a" style="left:90px;top:608px;font-size:100px;line-height:.9">28 NOV.</div>'
 '<div class="a ft" style="left:64px;top:726px;font-size:17px;letter-spacing:.2em">PANEL 1</div>'
 '<div class="a" style="left:64px;top:752px;font-size:34px;line-height:1.02;letter-spacing:.02em;width:420px;text-shadow:0 3px 10px rgba(110,10,0,.35)">GUÉRIR DES TRAUMATISMES<br>ÉMOTIONNELS</div>'
 '<div class="a" style="left:64px;top:840px"><span class="lab" style="font-size:22px;padding:7px 20px">PASTEURE</span></div>'
 '<div class="a" style="left:64px;top:878px"><span class="lab" style="font-size:28px;padding:9px 24px">ANNE-LAURE JEUNE NOZIER</span></div>'
 '<div class="a ft" style="left:64px;top:944px;font-size:19px;letter-spacing:.22em">INTERVENANTE</div>'
 '<div class="a ft" style="left:64px;top:984px;width:420px;font-size:15px;line-height:1.5;font-weight:600">ZONE 242 – SIKÈCODJI · RUE DE GOLF FM<br>GRATUIT · 150 PLACES · INSCRIPTION OBLIGATOIRE</div>')
f = T / "v.html"; f.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}")
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
    pg.screenshot(path=str(OUT / "Visuel_Pasteure_Anne-Laure_WZW_1080x1080.png")); b.close()
shutil.rmtree(T); print("ok")
