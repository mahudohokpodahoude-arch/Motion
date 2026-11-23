# 3 variantes de l'affiche du vendredi (carré 1080×1080), heure mise en avant. Usage : python affiche_vendredi_variantes.py <sortie>
import pathlib, sys, shutil
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("annonce-wzw-reference/assets/photos/mary.png", "mary.png"), ("presentation-dr-hestia/assets/logos_alpha.png", "logos.png"),
               ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]: shutil.copy(R / src, T / n)
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}.lock{filter:drop-shadow(0 0 16px rgba(255,255,255,.55))}.mary{filter:drop-shadow(0 18px 34px rgba(70,0,0,.4))}
.lab{background:#0b2a5c;color:#fff;font-family:M;font-weight:800;letter-spacing:.08em;display:inline-block}.ft{font-family:M;font-weight:800;color:#ffe3cf;letter-spacing:.07em}
.bg i{position:absolute;display:block}"""
BG = ('<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 25%,rgba(255,170,110,.8),rgba(255,170,110,0) 58%)"></div>'
      '<img class="a" src="w1.png" style="left:-140px;top:300px;height:900px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:600px;top:-120px;height:820px;opacity:.07;filter:brightness(2)">'
      '<div class="a" style="inset:0;background:#b80f00;opacity:.14;clip-path:polygon(0 0,18% 0,6% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(78% 0,100% 0,100% 100%,62% 100%)"></div>')
LOGOS = '<img class="a" src="logos.png" style="left:40px;top:36px;width:104px">'
def MASK(h): return f"-webkit-mask-image:linear-gradient(180deg,#000 {h}%,transparent 100%);mask-image:linear-gradient(180deg,#000 {h}%,transparent 100%)"
V = {}
# A : photo centrée, grand bandeau blanc « 19H45 »
V["A"] = BG + LOGOS + f'''
<div class="a" style="left:0;top:0;width:1080px;height:520px;overflow:hidden;{MASK(80)}"><img class="mary" src="mary.png" style="position:absolute;left:276px;top:0;height:800px"></div>
<div class="a" style="left:0;width:1080px;top:470px;text-align:center"><span class="lab" style="font-size:22px;padding:7px 20px">PROPHÉTESSE</span></div>
<div class="a" style="left:0;width:1080px;top:508px;text-align:center"><span class="lab" style="font-size:32px;padding:9px 26px">MARY FAVOUR TONGSI</span></div>
<div class="a ft" style="left:0;width:1080px;top:572px;text-align:center;font-size:19px;letter-spacing:.24em">INVITÉE D'HONNEUR</div>
<div class="a" style="left:0;width:1080px;top:604px;text-align:center;font-size:104px;line-height:1;letter-spacing:.03em;text-shadow:0 6px 22px rgba(110,10,0,.4)">SOIRÉE D'OUVERTURE</div>
<div class="a" style="left:90px;top:726px;width:900px;height:210px;background:#fff;border-radius:22px;box-shadow:0 18px 40px rgba(90,0,0,.35)"></div>
<div class="a" style="left:120px;top:742px;color:#0260a6;font-size:50px;line-height:1;letter-spacing:.05em">VENDREDI 27 NOVEMBRE 2026</div>
<div class="a" style="left:120px;top:790px;color:#ee1a02;font-size:150px;line-height:1">19H45</div>
<div class="a" style="left:560px;top:784px;width:3px;height:120px;background:#ffd9bf"></div>
<div class="a ft" style="left:590px;top:790px;color:#10143a;font-size:22px;line-height:1.5;letter-spacing:.04em">ZONE 242 – SIKÈCODJI<br>RUE DE GOLF FM<br><span style="color:#d8300a">Gratuit · 150 places</span></div>
<div class="a ft" style="left:0;width:1080px;top:970px;text-align:center;font-size:21px">THÈME : RESTAURÉE · OINTE · ENVOYÉE<br><span style="font-size:17px;color:#fff;letter-spacing:.05em">« LES FEMMES PRENNENT LE CONTRÔLE DE LA ZONE »</span></div>
<img class="a lock" src="lockup.png" style="left:792px;top:34px;width:240px">
<div class="a ft" style="left:0;width:1080px;top:1036px;text-align:center;font-size:17px;font-weight:600">INSCRIPTION OBLIGATOIRE · contact.zone242@gmail.com · 01 41 62 77 77</div>'''
# B : photo à droite, heure en colonne à gauche
V["B"] = BG + LOGOS + f'''
<div class="a" style="left:430px;top:0;width:650px;height:1080px;overflow:hidden;{MASK(86)}"><img class="mary" src="mary.png" style="position:absolute;left:-30px;top:60px;height:1100px"></div>
<img class="a lock" src="lockup.png" style="left:64px;top:150px;width:360px">
<div class="a ft" style="left:64px;top:342px;font-size:21px;letter-spacing:.22em">SOIRÉE D'OUVERTURE</div>
<div class="a" style="left:64px;top:380px;font-size:300px;line-height:.82;color:#fff;text-shadow:0 8px 30px rgba(110,10,0,.35)">19H45</div>
<div class="a" style="left:64px;top:650px;width:400px;height:150px;background:#0260a6;clip-path:polygon(0 0,100% 6%,100% 100%,0 94%)"></div>
<div class="a" style="left:92px;top:664px;font-size:40px;line-height:1;letter-spacing:.06em">VENDREDI</div>
<div class="a" style="left:90px;top:698px;font-size:100px;line-height:.9">27 NOV.</div>
<div class="a ft" style="left:64px;top:810px;font-size:0px"></div>
<div class="a" style="left:64px;top:830px"><span class="lab" style="font-size:22px;padding:7px 20px">PROPHÉTESSE</span></div>
<div class="a" style="left:64px;top:868px"><span class="lab" style="font-size:34px;padding:9px 26px">MARY FAVOUR TONGSI</span></div>
<div class="a ft" style="left:64px;top:938px;font-size:19px;letter-spacing:.22em">INVITÉE D'HONNEUR</div>
<div class="a ft" style="left:64px;top:984px;width:420px;font-size:15px;line-height:1.5;font-weight:600">ZONE 242 – SIKÈCODJI · RUE DE GOLF FM<br>GRATUIT · 150 PLACES · INSCRIPTION OBLIGATOIRE</div>'''
# C : très grande heure derrière la photo
V["C"] = BG + LOGOS + f'''
<div class="a" style="left:0;width:1080px;top:150px;text-align:center;font-size:420px;line-height:.9;color:#fff;opacity:.95;letter-spacing:.01em;text-shadow:0 10px 40px rgba(110,10,0,.4)">19H45</div>
<div class="a" style="left:0;top:240px;width:1080px;height:560px;overflow:hidden;{MASK(86)}"><img class="mary" src="mary.png" style="position:absolute;left:200px;top:0;height:820px"></div>
<div class="a" style="left:0;width:1080px;top:742px;text-align:center"><span class="lab" style="font-size:24px;padding:8px 22px">PROPHÉTESSE</span></div>
<div class="a" style="left:0;width:1080px;top:782px;text-align:center"><span class="lab" style="font-size:38px;padding:10px 30px">MARY FAVOUR TONGSI</span></div>
<div class="a ft" style="left:0;width:1080px;top:852px;text-align:center;font-size:20px;letter-spacing:.24em">INVITÉE D'HONNEUR</div>
<div class="a" style="left:0;width:1080px;top:884px;text-align:center;font-size:74px;line-height:1;letter-spacing:.04em">SOIRÉE D'OUVERTURE</div>
<div class="a" style="left:0;top:982px;width:1080px;height:98px;background:#0260a6"></div>
<div class="a" style="left:64px;top:1004px;font-size:56px;line-height:1;letter-spacing:.04em">VENDREDI 27 NOVEMBRE</div>
<div class="a ft" style="left:600px;top:1000px;font-size:16px;line-height:1.5;color:#fff;width:440px">ZONE 242 – SIKÈCODJI · RUE DE GOLF FM<br><span style="color:#ffe3cf">Gratuit · 150 places · inscription obligatoire</span></div>
<img class="a lock" src="lockup.png" style="left:830px;top:26px;width:200px">'''
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for k, body in V.items():
        f = T / f"v{k}.html"; f.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}")
        pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"Affiche_Vendredi_WZW_variante_{k}.png"))
    b.close()
shutil.rmtree(T); print("ok")
