import pathlib
from playwright.sync_api import sync_playwright
from PIL import Image
H = pathlib.Path(__file__).resolve().parent
html = """<!doctype html><meta charset=utf-8><style>
@font-face{font-family:B;src:url(f/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:M;font-weight:600;src:url(f/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1600px;height:400px;overflow:hidden;position:relative;font-family:B;color:#fff;
 background:linear-gradient(115deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)}
.shape{position:absolute;inset:0}
.s1{background:#ff7a33;opacity:.20;clip-path:polygon(0 0,18% 0,8% 100%,0 100%)}
.s2{background:#b80f00;opacity:.22;clip-path:polygon(34% 0,46% 0,30% 100%,18% 100%)}
.s3{background:#ff9a4a;opacity:.18;clip-path:polygon(62% 0,70% 0,58% 100%,48% 100%)}
.s4{background:#c01200;opacity:.20;clip-path:polygon(84% 0,100% 0,100% 100%,74% 100%)}
.s5{background:#ffb070;opacity:.14;clip-path:polygon(0 60%,100% 30%,100% 44%,0 78%)}
.glow{position:absolute;left:380px;top:-40px;width:840px;height:420px;background:radial-gradient(closest-side,rgba(255,170,110,.55),rgba(255,170,110,0))}
#logo{position:absolute;left:44px;top:26px;width:150px;height:150px}
#dates{position:absolute;left:44px;top:196px;line-height:.92}
#dates .l{font-size:36px;letter-spacing:.02em;display:flex;gap:26px}
#dates .n{font-size:118px;color:#0260a6;letter-spacing:.02em;display:flex;gap:22px;margin-top:2px;text-shadow:0 0 18px rgba(255,255,255,.18)}
#dates .m{font-size:40px;letter-spacing:.03em;margin-top:-2px}
#titre{position:absolute;left:470px;top:6px;width:660px;filter:drop-shadow(0 0 16px rgba(255,255,255,.75)) drop-shadow(0 0 40px rgba(255,255,255,.35))}
#theme{position:absolute;left:446px;width:708px;top:322px;text-align:center;font-size:33px;letter-spacing:.05em;line-height:1;text-shadow:0 2px 8px rgba(120,10,0,.35)}
#quote{position:absolute;left:446px;width:708px;top:360px;text-align:center;font-size:23px;letter-spacing:.06em;line-height:1;color:#fff;text-shadow:0 2px 8px rgba(120,10,0,.4)}
#blue{position:absolute;right:0;bottom:0;width:430px;height:228px;background:linear-gradient(160deg,#6f5b6a 0%,#3c5f95 55%,#0f4f93 100%);clip-path:polygon(0 8%,100% 0,100% 100%,3% 100%)}
#addr{position:absolute;left:1184px;top:176px;display:flex;gap:16px;align-items:flex-start}
#addr .t{font-size:44px;line-height:1.02;letter-spacing:.02em}
#addr .c{font-family:M;font-weight:600;font-size:21px;line-height:1.35;margin-top:8px;letter-spacing:0}
#milmo{position:absolute}
</style>
<div class=shape></div><div class="shape s1"></div><div class="shape s2"></div><div class="shape s3"></div><div class="shape s4"></div><div class="shape s5"></div>
<div class=glow></div>
<img id=logo src=logos_alpha.png>
<div id=dates><div class=l><span>DU VEN.</span><span>AU DIM.</span></div><div class=n><span>20</span><span>22</span></div><div class=m>NOVEMBRE 2026</div></div>
<img id=titre src=titre_alpha3.png>
<div id=theme>THÈME : RESTAURÉE · OINTE · ENVOYÉE</div>
<div id=quote>« LES FEMMES PRENNENT LE CONTRÔLE DE LA ZONE »</div>
<div id=blue></div>
<div id=addr>
 <svg width=44 height=62 viewBox="0 0 44 62" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" style="margin-top:4px"><path d="M22 4C11 4 4 12 4 22c0 11 18 26 18 26s18-15 18-26C40 12 33 4 22 4z"/><circle cx=22 cy=21 r=7.5 /><path d="M16 56l12 6M28 56l-12 6"/></svg>
 <div><div class=t>ZONE 242 – SIKECODJI<br>RUE DE GOLF.FM</div><div class=c>contact.zone242@gmail.com<br>0141627777</div></div>
</div>
<script>document.fonts.ready.then(()=>{window.r=1})</script>"""
(H / "banniere.html").write_text(html)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1600, "height": 400}, device_scale_factor=2).new_page()
    pg.goto("file://" + str(H / "banniere.html")); pg.wait_for_function("window.r===1"); pg.wait_for_timeout(500)
    pg.screenshot(path=str(H / "banniere_2x.png")); b.close()
im = Image.open(H / "banniere_2x.png").convert("RGB")
im.resize((1600, 400), Image.LANCZOS).save(H / "banniere_1600x400.png")
im.save(H / "banniere_3200x800.png")
im.resize((1600, 400), Image.LANCZOS).save(H / "banniere_1600x400.jpg", quality=93)
print(im.size)
