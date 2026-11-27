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
N = 6
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}.lock{filter:drop-shadow(0 0 16px rgba(255,255,255,.55))}
.k{font-family:M;font-weight:800;letter-spacing:.2em;color:#ffe3cf}.tx{font-family:M;font-weight:600;line-height:1.38}.tx b{font-weight:800}
.tag{background:#0b2a5c;color:#fff;font-family:M;font-weight:800;letter-spacing:.08em;display:inline-block}
.card{background:#fff;color:#10143a;border-radius:22px;box-shadow:0 14px 30px rgba(90,0,0,.3)}"""
def base(n, inner, cover=False):
    g = ('<img class="a" src="w1.png" style="left:-140px;top:300px;height:900px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:600px;top:-120px;height:820px;opacity:.07;filter:brightness(2)">'
         '<div class="a" style="inset:0;background:#b80f00;opacity:.12;clip-path:polygon(0 0,16% 0,4% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(80% 0,100% 0,100% 100%,64% 100%)"></div>')
    dots = '<div class="a" style="right:64px;top:70px;display:flex;gap:10px;align-items:center">' + "".join(f'<i style="display:block;height:14px;border-radius:7px;background:{"#fff" if i == n else "rgba(255,255,255,.4)"};width:{40 if i == n else 14}px"></i>' for i in range(1, N + 1)) + "</div>"
    top = "" if cover else '<img class="a lock" src="lockup.png" style="left:64px;top:52px;width:170px">' + dots
    foot = f'<div class="a" style="left:64px;right:64px;bottom:48px;border-top:2px solid rgba(255,255,255,.4);padding-top:18px;display:flex;justify-content:space-between;font-family:M;font-weight:800;font-size:19px;letter-spacing:.1em;color:#ffe3cf"><span>27–29 NOVEMBRE 2026 · ZONE 242 · SIKÈCODJI</span><span>{n} / {N}</span></div>'
    return g + top + inner + foot
S = []
S.append(base(1, '''<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(255,180,120,.75),rgba(255,180,120,0) 60%)"></div>
<img class="a" src="logos.png" style="left:40px;top:36px;width:104px">
<img class="a lock" src="lockup.png" style="left:290px;top:120px;width:500px">
<div class="a" style="left:0;width:1080px;top:420px;text-align:center;font-size:230px;line-height:.86;text-shadow:0 8px 30px rgba(110,10,0,.4);transform:rotate(-3deg)">C'EST<br>CE SOIR !</div>
<div class="a" style="left:0;width:1080px;top:880px;text-align:center"><span class="tag" style="font-size:44px;padding:12px 34px;transform:skewX(-6deg)">VENDREDI 27 · 19H45</span></div>''', True))
S.append(base(2, '''<div class="a k" style="left:64px;top:210px;font-size:24px">TU FAIS QUOI CE SOIR ?</div>
<div class="a" style="left:64px;top:252px;font-size:124px;line-height:.9;width:560px;text-shadow:0 8px 30px rgba(110,10,0,.35)">ON OUVRE LE<br>WEEK-END<br>ZONE<br>WOMEN</div>
<div class="a" style="left:560px;top:150px;width:520px;height:900px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent 100%);mask-image:linear-gradient(180deg,#000 80%,transparent 100%)"><img src="mary.png" style="position:absolute;left:-20px;top:20px;height:880px;filter:drop-shadow(0 18px 34px rgba(70,0,0,.4))"></div>
<div class="a" style="left:64px;top:760px"><span class="tag" style="font-size:22px;padding:7px 18px">PROPHÉTESSE</span></div><div class="a" style="left:64px;top:798px"><span class="tag" style="font-size:30px;padding:9px 24px">MARY FAVOUR TONGSI</span></div>
<div class="a k" style="left:64px;top:862px;font-size:19px;letter-spacing:.22em">INVITÉE D'HONNEUR</div>'''))
items = ["Accueil par l'équipe des femmes", "Louange et adoration", "Le message de la Prophétesse Mary", "Un temps de prière et de ministère"]
h = '<div class="a k" style="left:64px;top:200px;font-size:24px">AU PROGRAMME CE SOIR</div><div class="a" style="left:64px;top:240px;font-size:104px;line-height:.9">4 BONNES RAISONS<br>DE VENIR</div>'
for i, t in enumerate(items):
    y = 500 + i * 118
    h += f'<div class="a card" style="left:64px;top:{y}px;width:952px;height:98px"></div><div class="a" style="left:64px;top:{y}px;width:98px;height:98px;background:#0260a6;border-radius:22px 0 0 22px;display:flex;align-items:center;justify-content:center;font-size:64px;padding-top:6px">{i + 1}</div>'
    h += f'<div class="a tx" style="left:190px;top:{y + 28}px;width:800px;font-size:34px;font-weight:800;color:#10143a;line-height:1.1">{t}</div>'
S.append(base(3, h))
S.append(base(4, '''<div class="a k" style="left:64px;top:200px;font-size:24px">ET DEMAIN ?</div>
<div class="a" style="left:64px;top:240px;font-size:150px;line-height:.88;text-shadow:0 8px 30px rgba(110,10,0,.35)">SAMEDI,<br>ON CONTINUE !</div>
<div class="a" style="left:64px;top:560px;width:952px;height:300px;background:#0260a6;clip-path:polygon(0 0,100% 4%,100% 100%,0 96%)"></div>
<div class="a" style="left:100px;top:584px;font-size:64px;line-height:1;letter-spacing:.03em">WOMEN'S EXPERIENCE DAY · 9H00</div>
<div class="a tx" style="left:100px;top:672px;width:880px;font-size:30px;color:#fff">Relaxation · 4 panels · « Belle et en bonne santé » · Zone Détente (salon de thé, massages, coin photo) · grande table ronde</div>'''))
S.append(base(5, '''<div class="a k" style="left:64px;top:200px;font-size:24px">ET DIMANCHE ?</div>
<div class="a" style="left:64px;top:240px;font-size:150px;line-height:.88;text-shadow:0 8px 30px rgba(110,10,0,.35)">ON FINIT<br>EN BEAUTÉ</div>
<div class="a card" style="left:64px;top:560px;width:460px;height:250px"></div><div class="a" style="left:100px;top:584px;font-size:100px;line-height:1;color:#ee1a02">8H45</div><div class="a tx" style="left:100px;top:700px;width:400px;font-size:30px;font-weight:800;color:#10143a;line-height:1.15">Culte de clôture avec la Prophétesse Mary</div>
<div class="a card" style="left:556px;top:560px;width:460px;height:250px"></div><div class="a" style="left:592px;top:584px;font-size:100px;line-height:1;color:#ee1a02">11H30</div><div class="a tx" style="left:592px;top:700px;width:400px;font-size:30px;font-weight:800;color:#10143a;line-height:1.15">L'Agapè des Femmes : brunch, témoignages, photo de groupe</div>'''))
S.append(base(6, '''<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,180,120,.6),rgba(255,180,120,0) 60%)"></div>
<div class="a" style="left:64px;top:210px;font-size:176px;line-height:.88;text-shadow:0 8px 30px rgba(110,10,0,.35)">VIENS<br>AVEC UNE<br>AMIE !</div>
<div class="a" style="left:64px;top:700px;display:flex;gap:14px"><span class="tag" style="font-size:26px;padding:11px 22px;white-space:nowrap">GRATUIT</span><span class="tag" style="font-size:26px;padding:11px 22px;white-space:nowrap">150 PLACES</span><span class="tag" style="font-size:26px;padding:11px 22px;white-space:nowrap">INSCRIPTION OBLIGATOIRE</span></div>
<div class="a" style="left:64px;top:800px;background:#fff;color:#d8300a;font-size:64px;line-height:1;padding:14px 34px 6px;border-radius:14px;box-shadow:0 14px 30px rgba(90,0,0,.3)">ZONE 242 · SIKÈCODJI · 19H45</div>
<div class="a tx" style="left:64px;top:910px;width:950px;font-size:24px;color:#ffe3cf">Rue de Golf FM, Cotonou · inscription : lien en bio · contact.zone242@gmail.com · 01 41 62 77 77</div>'''))
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for i, body in enumerate(S, 1):
        f = T / f"s{i}.html"; f.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}")
        pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"Carrousel_Cest_ce_soir_{i:02d}.png"))
    b.close()
shutil.rmtree(T); print("ok")
