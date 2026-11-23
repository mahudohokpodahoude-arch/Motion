# Affiche du vendredi (soirée d'ouverture, Prophétesse Mary TONGSI) · carré 1080×1080 et story 1080×1920.
# Usage : python affiche_vendredi.py <dossier_sortie>
import pathlib, sys, shutil
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion")
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
TMP = OUT / "_res"; TMP.mkdir(exist_ok=True)
for src, name in [(R / "teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), (R / "teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"),
                  (R / "teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"), (R / "un-mot-une-session-reels/assets/lockup.png", "lockup.png"),
                  (R / "annonce-wzw-reference/assets/photos/mary.png", "mary.png"), (R / "presentation-dr-hestia/assets/logos_alpha.png", "logos.png"), (R / "teaser-wzw-reels/assets/W1.png", "w1.png"), (R / "teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(src, TMP / name)
CSS = """
@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}
.gw{opacity:.07;filter:brightness(2)}
.sl{inset:0}
.glow{background:radial-gradient(closest-side,rgba(255,200,150,.7),rgba(255,200,150,0))}
.lock{filter:drop-shadow(0 0 16px rgba(255,255,255,.55))}
.blue{background:#0260a6;color:#fff;font-family:B}
.mary{filter:drop-shadow(-10px 14px 30px rgba(70,0,0,.45))}
.foot{font-family:M;font-weight:800;color:#ffe3cf;letter-spacing:.06em}
"""
def page(W, H, story):
    s = story
    g = (f'<img class="a gw" src="w1.png" style="left:-120px;top:{120 if not s else 180}px;height:{900 if not s else 1200}px">'
         f'<img class="a gw" src="w2.png" style="left:{560 if not s else 520}px;top:{-160 if not s else -120}px;height:{820 if not s else 1100}px">'
         f'<img class="a gw" src="w1.png" style="left:{700 if not s else 640}px;top:{H-620 if not s else H-760}px;height:{760 if not s else 980}px">')
    sl = ('<div class="a sl" style="background:#ff7a33;opacity:.16;clip-path:polygon(0 0,22% 0,8% 100%,0 100%)"></div>'
          '<div class="a sl" style="background:#b80f00;opacity:.18;clip-path:polygon(38% 0,52% 0,34% 100%,20% 100%)"></div>')
    if not s:   # carré : composition centrée sur l'axe x = 540, marges 90, sur le modèle de l'affiche officielle
        body = f"""
<div class="a" style="left:0;top:0;width:1080px;height:1080px;background:radial-gradient(ellipse at 50% 22%,rgba(255,170,110,.85) 0%,rgba(255,170,110,0) 55%)"></div>
<div class="a" style="left:0;top:0;width:1080px;height:640px;background:#ffb27a;opacity:.18;clip-path:polygon(0 0,100% 0,100% 28%,50% 100%,0 28%)"></div>
<img class="a" src="logos.png" style="left:40px;top:36px;width:104px">
<img class="a mary" src="mary.png" style="left:369px;top:10px;height:520px;-webkit-mask-image:linear-gradient(180deg,#000 72%,transparent 100%);mask-image:linear-gradient(180deg,#000 72%,transparent 100%)">
<div class="a" style="left:0;width:1080px;top:498px;text-align:center"><span style="display:inline-block;background:#0b2a5c;color:#fff;font-family:M;font-weight:800;font-size:22px;letter-spacing:.12em;padding:7px 20px">PROPHÉTESSE</span></div>
<div class="a" style="left:0;width:1080px;top:536px;text-align:center"><span style="display:inline-block;background:#0b2a5c;color:#fff;font-family:M;font-weight:800;font-size:32px;letter-spacing:.06em;padding:9px 26px">MARY FAVOUR TONGSI</span></div>
<div class="a foot" style="left:0;width:1080px;top:600px;text-align:center;font-size:19px;letter-spacing:.24em">INVITÉE D'HONNEUR</div>
<img class="a lock" src="lockup.png" style="left:305px;top:632px;width:470px">
<div class="a" style="left:0;width:1080px;top:872px;text-align:center;font-size:58px;line-height:1;letter-spacing:.05em;text-shadow:0 4px 16px rgba(110,10,0,.35)">SOIRÉE D'OUVERTURE · 19H45</div>
<div class="a" style="left:90px;top:944px;font-size:32px;line-height:1;letter-spacing:.04em">VENDREDI</div>
<div class="a" style="left:88px;top:972px;font-size:96px;line-height:.82;color:#0260a6">27</div>
<div class="a" style="left:214px;top:984px;font-size:34px;line-height:1.02;letter-spacing:.04em">NOVEMBRE<br>2026</div>
<div class="a" style="left:560px;top:946px;width:430px;height:104px;background:linear-gradient(180deg,rgba(2,96,166,0),rgba(2,96,166,.9));clip-path:polygon(0 0,100% 8%,96% 100%,4% 92%)"></div>
<div class="a" style="left:590px;top:952px;font-family:M;font-weight:800;font-size:20px;line-height:1.45;letter-spacing:.04em">ZONE 242 – SIKÈCODJI<br>RUE DE GOLF FM<br><span style="font-weight:600;font-size:17px;letter-spacing:.02em">Gratuit · 150 places · inscription obligatoire</span></div>"""
    else:       # story
        body = f"""
<div class="a glow" style="left:60px;top:560px;width:980px;height:980px"></div>
<img class="a mary" src="mary.png" style="left:250px;top:640px;height:1280px">
<img class="a lock" src="lockup.png" style="left:270px;top:90px;width:540px">
<div class="a blue" style="left:60px;top:430px;font-size:56px;letter-spacing:.06em;padding:10px 32px 3px;transform:skewX(-8deg)"><span style="display:inline-block;transform:skewX(8deg)">PROPHÉTESSE</span></div>
<div class="a" style="left:60px;top:512px;font-size:170px;line-height:.86;text-shadow:0 6px 24px rgba(110,10,0,.4)">MARY FAVOUR<br>TONGSI</div>
<div class="a foot" style="left:64px;top:846px;font-size:30px;letter-spacing:.14em">INVITÉE D'HONNEUR</div>
<div class="a" style="left:60px;top:910px;font-size:120px;line-height:.9;color:#ffe3cf;text-shadow:0 5px 20px rgba(110,10,0,.35)">SOIRÉE<br>D'OUVERTURE</div>
<div class="a" style="left:0;top:1380px;width:1080px;height:300px;background:#0260a6;clip-path:polygon(0 12%,100% 0,100% 100%,0 88%)"></div>
<div class="a" style="left:64px;top:1452px;font-size:46px;letter-spacing:.06em">VENDREDI</div>
<div class="a" style="left:60px;top:1488px;font-size:210px;line-height:.82;color:#fff">27</div>
<div class="a" style="left:262px;top:1520px;font-size:56px;line-height:1;letter-spacing:.04em">NOVEMBRE<br>2026</div>
<div class="a" style="left:640px;top:1500px;background:#fff;color:#d8300a;font-size:132px;line-height:1;padding:14px 38px 2px;border-radius:16px;box-shadow:0 12px 28px rgba(0,0,0,.3)">19H45</div>
<div class="a" style="left:0;top:1690px;width:1080px;height:230px;background:linear-gradient(180deg,rgba(90,8,0,0),rgba(90,8,0,.82))"></div><div class="a foot" style="left:0;width:1080px;top:1752px;text-align:center;font-size:22px;line-height:1.5;text-shadow:0 2px 8px rgba(0,0,0,.6)">ZONE 242 – SIKÈCODJI · RUE DE GOLF FM<br>GRATUIT · 150 PLACES · INSCRIPTION OBLIGATOIRE</div>"""
    return f"<!doctype html><meta charset=utf-8><style>{CSS}body{{width:{W}px;height:{H}px}}</style>{g}{sl}{body}"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for name, W, H, st in [("Affiche_Vendredi_WZW_1080x1080", 1080, 1080, False)]:
        f = TMP / f"{name}.html"; f.write_text(page(W, H, st))
        pg = b.new_context(viewport={"width": W, "height": H}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"{name}.png"))
    b.close()
shutil.rmtree(TMP)
print("ok")
