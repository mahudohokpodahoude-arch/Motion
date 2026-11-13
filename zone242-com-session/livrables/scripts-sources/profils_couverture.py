# Photo de profil (1080×1080) et photo de couverture Facebook (1640×624) · Week-end Zone Women.
# Usage : python profils_couverture.py <dossier_ressources> <dossier_sortie>
#   ressources : f/ (polices), titre_alpha3.png, logos_alpha.png, photos/ (détourages des intervenantes)
import sys, pathlib
from playwright.sync_api import sync_playwright
A = pathlib.Path(sys.argv[1]).resolve(); O = pathlib.Path(sys.argv[2]).resolve(); O.mkdir(parents=True, exist_ok=True)
BASE = """
@font-face{font-family:B;src:url(f/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:M;font-weight:600;src:url(f/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(135deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)}
.sh{position:absolute;inset:0}
.s1{background:#ff7a33;opacity:.22;clip-path:polygon(0 0,22% 0,8% 100%,0 100%)}
.s2{background:#b80f00;opacity:.22;clip-path:polygon(34% 0,48% 0,30% 100%,16% 100%)}
.s3{background:#ff9a4a;opacity:.18;clip-path:polygon(66% 0,80% 0,64% 100%,50% 100%)}
.s4{background:#c01200;opacity:.20;clip-path:polygon(88% 0,100% 0,100% 100%,76% 100%)}
"""
BG = '<div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div>'
PROFIL = f"""<!doctype html><meta charset=utf-8><style>{BASE}
body{{width:1080px;height:1080px}}
.glow{{position:absolute;left:90px;top:150px;width:900px;height:700px;background:radial-gradient(closest-side,rgba(255,200,150,.75),rgba(255,200,150,0))}}
#ti{{position:absolute;left:190px;top:215px;width:700px;filter:drop-shadow(0 0 14px rgba(255,255,255,.7)) drop-shadow(0 0 40px rgba(255,255,255,.35))}}
.d{{position:absolute;left:0;right:0;top:640px;text-align:center;line-height:.9}}
.d .l{{font-size:46px;letter-spacing:.06em}}.d .n{{font-size:190px;color:#0260a6;letter-spacing:.02em;text-shadow:0 0 22px rgba(255,255,255,.35)}}
.d .m{{font-size:52px;letter-spacing:.05em;margin-top:-6px}}
</style>{BG}<div class=glow></div><img id=ti src=titre_alpha3.png>
<div class=d><div class=l>DU VEN. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AU DIM.</div><div class=n>27&nbsp;&nbsp;29</div><div class=m>NOVEMBRE 2026</div></div>"""
# couverture : rangée d'intervenantes derrière un bandeau rouge ; contenu essentiel au centre (zone visible sur mobile)
LEFT = ["anne", "huldah", "manne", "veronica", "hestia"]; RIGHT = ["pelagie", "esperance", "jessie", "richmelle", "tossou"]
D = {"anne": 417, "huldah": 417, "manne": 940, "veronica": 390, "hestia": 880, "pelagie": 880, "esperance": 880, "jessie": 880, "richmelle": 880, "tossou": 300, "mary": 1190}
ASP = {"mary": 851/1259, "anne": 960/1217, "huldah": 988/1105, "manne": 716/968, "veronica": 1169/1289, "hestia": 825/1208, "pelagie": 551/1082, "esperance": 591/1159, "jessie": 662/1104, "richmelle": 595/1124, "tossou": 1130/1300}
def img(n, cx, top, k=1.0):
    h = D[n] * k; w = h * ASP[n]
    return f'<img src="photos/{n}.png" style="position:absolute;height:{h:.0f}px;left:{cx - w/2:.0f}px;top:{top}px;filter:drop-shadow(0 6px 14px rgba(70,0,0,.35))">'
pers = img("mary", 820, 8)
order = [(p, 820 - 150 * (5 - i)) for i, p in enumerate(LEFT)]            # de l'extérieur vers le centre
order = [order[0], order[4], order[1], order[3], order[2]]
rord = [(p, 820 + 150 * (i + 1)) for i, p in enumerate(RIGHT)]; rord = [rord[4], rord[0], rord[3], rord[1], rord[2]]
for p, cx in order + rord: pers += img(p, cx, 22)
COUV = f"""<!doctype html><meta charset=utf-8><style>{BASE}
body{{width:1640px;height:624px}}
.slab{{position:absolute;left:0;top:0;width:1640px;height:624px;background:linear-gradient(180deg,#c91502 0%,#a30f00 100%);clip-path:polygon(0 300px,100% 262px,100% 100%,0 100%);box-shadow:0 -10px 30px rgba(60,0,0,.4)}}
#ti{{position:absolute;left:520px;top:318px;width:600px;filter:drop-shadow(0 0 10px rgba(255,255,255,.55))}}
.dt{{position:absolute;left:150px;top:336px;line-height:.88}}
.dt .l{{font-size:30px;letter-spacing:.06em}}.dt .n{{font-size:116px;color:#fff;letter-spacing:.03em;text-shadow:0 4px 14px rgba(40,0,0,.35)}}.dt .n b{{font-weight:400;color:#7fc4ff}}.dt .m{{font-size:32px;letter-spacing:.05em}}
.ad{{position:absolute;left:1190px;top:352px;line-height:1.02}}
.ad .t{{font-size:38px;letter-spacing:.03em}}.ad .c{{font-family:M;font-weight:600;font-size:19px;margin-top:8px;line-height:1.4;color:#ffe0c8}}
.th{{position:absolute;left:0;right:0;top:588px;text-align:center;font-size:24px;letter-spacing:.14em;color:#ffe0c8}}
</style>{BG}{pers}<div class=slab></div><img id=ti src=titre_alpha3.png>
<div class=dt><div class=l>DU VEN. 27 AU DIM. 29</div><div class=n><b>27</b>–<b>29</b></div><div class=m>NOVEMBRE 2026</div></div>
<div class=ad><div class=t>ZONE 242 – SIKÈCODJI</div><div class=c>Rue de Golf FM, Cotonou<br>Gratuit · 150 places</div></div>"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for name, html, w, h in [("Profil_WZW_1080x1080", PROFIL, 1080, 1080), ("Couverture_Facebook_WZW_1640x624", COUV, 1640, 624)]:
        f = A / f"{name}.html"; f.write_text(html)
        pg = b.new_context(viewport={"width": w, "height": h}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(O / f"{name}.png")); f.unlink()
    b.close()
print("ok")
