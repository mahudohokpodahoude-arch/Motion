import pathlib
from playwright.sync_api import sync_playwright
from PIL import Image
H=pathlib.Path(__file__).resolve().parent
html="""<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Osw;font-weight:500;src:url(f/oswald-latin-500-normal.woff2)}
@font-face{font-family:Osw;font-weight:600;src:url(f/oswald-latin-600-normal.woff2)}
@font-face{font-family:Osw;font-weight:700;src:url(f/oswald-latin-700-normal.woff2)}
@font-face{font-family:Mon;font-weight:700;src:url(f/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Mon;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
@font-face{font-family:Pop;font-weight:500;src:url(f/poppins-latin-500-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;font-family:Osw;
 background:radial-gradient(ellipse 85% 60% at 62% 58%,#f0731c 0%,#d2480f 38%,#8f2208 72%,#3d0f05 100%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(60,10,0,.28) 2.2px,transparent 2.6px);background-size:16px 16px;opacity:.55}
.bar{position:absolute;left:-60px;top:-80px;width:230px;height:1500px;background:rgba(255,180,90,.10);transform:rotate(7deg)}
.bar.b2{left:760px;width:150px;background:rgba(40,5,0,.18)}
#logo{position:absolute;left:50%;margin-left:-85px;top:36px;width:170px}
#mark{display:none;position:absolute;left:60px;top:110px;font:700 150px/1 Osw;color:#ffd9a0;opacity:.9;height:120px}
#q{position:absolute;top:170px;width:920px;left:80px;text-align:center;font:800 46px/1.22 Mon;color:#fff;text-transform:uppercase;letter-spacing:.005em;text-shadow:0 4px 18px rgba(60,10,0,.5)}
#q em{font-style:normal;color:#ffd48a}
#sp{position:absolute;right:24px;bottom:0;width:613px;filter:drop-shadow(0 0 30px rgba(50,8,0,.55))}
#fade{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(0deg,rgba(40,8,2,.85),rgba(40,8,2,0))}
#nm{position:absolute;left:0;bottom:0;width:640px;padding:34px 36px 52px 64px;background:#6e3320;clip-path:polygon(0 0,100% 5%,100% 100%,0 100%)}
#nm small{display:block;font:700 26px Mon;color:#fff1de;margin-bottom:2px}
#nm b{display:block;font:800 56px/1 Mon;color:#e8c58e;letter-spacing:.01em;text-transform:uppercase}
</style><div class=bar></div><div class="bar b2"></div><div class=dots></div>
<img id=logo src=logo.png>
<div id=mark>“</div>
<div id=q>Il y a des choses qui ont la capacité d’<em>éteindre</em> l’esprit et il y en a d’autres qui ont la capacité de le <em>raviver</em>.</div>
<img id=sp src=orateur_final.png><div id=fade></div>
<div id=nm><small>Apôtre</small><b>Amos Elite</b></div>
<script>document.fonts.ready.then(()=>window.r=1)</script>"""
(H/"qs.html").write_text(html)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/opt/pw-browsers/chromium",args=["--no-sandbox"])
    pg=b.new_context(viewport={"width":1080,"height":1080},device_scale_factor=1).new_page()
    pg.goto("file://"+str(H/"qs.html")); pg.wait_for_function("window.r===1"); pg.wait_for_timeout(400)
    pg.screenshot(path=str(H/"quote_sq.png")); b.close()
Image.open(H/"quote_sq.png").convert("RGB").save(H/"quote_sq.jpg",quality=95,subsampling=0)
