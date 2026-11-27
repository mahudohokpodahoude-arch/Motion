# Carrousel « C'est ce soir ! » (jour J, vendredi 27) · 6 diapos 1080×1080 · ton fun, faits du programme uniquement.
import pathlib, sys, shutil
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); HERE = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("presentation-dr-hestia/assets/logos_alpha.png", "logos.png"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
shutil.copy(HERE / "mary_net.png", T / "mary.png")
N = 5
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}.lock{filter:drop-shadow(0 0 16px rgba(255,255,255,.55))}
.k{font-family:M;font-weight:800;letter-spacing:.12em;color:#ffe3cf}.tx{font-family:M;font-weight:800;line-height:1.3}
.tag{background:#0b2a5c;color:#fff;font-family:M;font-weight:800;letter-spacing:.06em;display:inline-block}
.card{background:#fff;border-radius:22px;box-shadow:0 14px 30px rgba(90,0,0,.3)}"""
def base(n, inner, cover=False):
    g = ('<img class="a" src="w1.png" style="left:-140px;top:300px;height:900px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:600px;top:-120px;height:820px;opacity:.07;filter:brightness(2)">'
         '<div class="a" style="inset:0;background:#b80f00;opacity:.12;clip-path:polygon(0 0,16% 0,4% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(80% 0,100% 0,100% 100%,64% 100%)"></div>')
    dots = '<div class="a" style="right:64px;top:70px;display:flex;gap:10px;align-items:center">' + "".join(f'<i style="display:block;height:14px;border-radius:7px;background:{"#fff" if i == n else "rgba(255,255,255,.4)"};width:{40 if i == n else 14}px"></i>' for i in range(1, N + 1)) + "</div>"
    top = "" if cover else '<img class="a lock" src="lockup.png" style="left:64px;top:52px;width:170px">' + dots
    foot = f'<div class="a" style="left:64px;right:64px;bottom:48px;border-top:2px solid rgba(255,255,255,.4);padding-top:18px;display:flex;justify-content:space-between;font-family:M;font-weight:800;font-size:19px;letter-spacing:.1em;color:#ffe3cf"><span>27–29 NOVEMBRE 2026 · ZONE 242 · SIKÈCODJI</span><span>{n} / {N}</span></div>'
    return g + top + inner + foot
S = []
S.append(base(1, '''<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,180,120,.7),rgba(255,180,120,0) 62%)"></div>
<img class="a" src="logos.png" style="left:40px;top:36px;width:104px"><img class="a lock" src="lockup.png" style="left:770px;top:34px;width:250px">
<div class="a" style="left:0;width:1080px;top:200px;text-align:center"><span class="tag" style="font-size:50px;padding:12px 36px;background:#fff;color:#d8300a;transform:rotate(-2deg)">🚨 ALERTE ! ALERTE ! 🚨</span></div>
<div class="a" style="left:0;width:1080px;top:320px;text-align:center;font-size:178px;line-height:.88;text-shadow:0 8px 30px rgba(110,10,0,.4)">LES FEMMES<br>PRENNENT<br>LA ZONE !</div>
<div class="a tx" style="left:0;width:1080px;top:880px;text-align:center;font-size:36px">WZW commence <span style="color:#fff;background:#0b2a5c;padding:2px 14px">AUJOURD'HUI</span> ! Tu es prête ?</div>''', True))
S.append(base(2, '''<div class="a" style="left:64px;top:230px;font-size:150px;line-height:.9;width:950px;text-shadow:0 8px 30px rgba(110,10,0,.35)">TU AS PRÉVU DE RESTER À LA MAISON CE SOIR ?</div>
<div class="a" style="left:64px;top:660px"><span class="tag" style="font-size:96px;padding:6px 36px 0;background:#fff;color:#d8300a;font-family:B;font-weight:400;letter-spacing:.02em;transform:rotate(-2deg)">MAUVAIS PROGRAMME !</span></div>
<div class="a tx" style="left:64px;top:830px;width:900px;font-size:40px">On a un rendez-vous à ne surtout pas manquer !</div>'''))
S.append(base(3, '''<div class="a" style="left:520px;top:130px;width:560px;height:900px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent 100%);mask-image:linear-gradient(180deg,#000 80%,transparent 100%)"><img src="mary.png" style="position:absolute;left:-60px;top:30px;height:900px;filter:drop-shadow(0 18px 34px rgba(70,0,0,.4))"></div>
<div class="a" style="left:64px;top:220px;font-size:112px;line-height:.9;width:560px;text-shadow:0 8px 30px rgba(110,10,0,.35)">UNE SOIRÉE DE LOUANGE, DE PRIÈRE ET DE PUISSANCE !</div>
<div class="a" style="left:64px;top:690px"><span class="tag" style="font-size:22px;padding:7px 18px">PROPHÉTESSE</span></div><div class="a" style="left:64px;top:728px"><span class="tag" style="font-size:30px;padding:9px 24px">MARY FAVOUR TONGSI</span></div>
<div class="a tx" style="left:64px;top:820px;width:560px;font-size:44px;color:#fff;white-space:nowrap">Prépare ton cœur ! ❤️</div>'''))
rows = [("RESTAURÉE.", "#ee1a02"), ("OINTE.", "#ee1a02"), ("ENVOYÉE.", "#ee1a02")]
h = '<div class="a" style="left:64px;top:200px;font-size:88px;line-height:.95;width:950px;text-shadow:0 6px 24px rgba(110,10,0,.35)">ET SI CE WEEK-END MARQUAIT UN NOUVEAU DÉPART POUR TOI ?</div>'
for i, (w, c) in enumerate(rows):
    y = 470 + i * 150
    h += f'<div class="a card" style="left:64px;top:{y}px;width:952px;height:130px"></div><div class="a" style="left:64px;top:{y}px;width:14px;height:130px;background:#0260a6;border-radius:22px 0 0 22px"></div><div class="a" style="left:110px;top:{y + 14}px;font-size:108px;line-height:1;color:{c};letter-spacing:.03em">{w}</div>'
h += '<div class="a tx" style="left:64px;top:920px;width:950px;font-size:34px;color:#fff">Dieu a encore de belles choses en réserve pour toi !</div>'
S.append(base(4, h))
S.append(base(5, '''<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,180,120,.6),rgba(255,180,120,0) 60%)"></div>
<div class="a" style="left:64px;top:170px;font-size:170px;line-height:.88;text-shadow:0 8px 30px rgba(110,10,0,.35)">CE SOIR,<br>ON SE<br>RETROUVE !</div>
<div class="a" style="left:64px;top:640px"><span class="tag" style="font-size:52px;padding:10px 30px;font-family:B;font-weight:400;letter-spacing:.03em">SOIRÉE D'OUVERTURE WZW · 19H45</span></div>
<div class="a tx" style="left:64px;top:735px;font-size:36px">📍 Zone 242, Sikècodji, Cotonou.</div>
<div class="a tx" style="left:64px;top:800px;font-size:36px">Viens avec une amie !</div>
<div class="a" style="left:64px;top:870px;background:#fff;color:#d8300a;font-size:48px;line-height:1;padding:12px 28px 4px;border-radius:14px;box-shadow:0 14px 30px rgba(90,0,0,.3)">UNE FEMME INVITÉE, UNE FEMME DE PLUS DANS LA ZONE !</div>'''))
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for i, body in enumerate(S, 1):
        f = T / f"s{i}.html"; f.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}")
        pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"Carrousel_Cest_ce_soir_{i:02d}.png"))
    b.close()
shutil.rmtree(T); print("ok")
