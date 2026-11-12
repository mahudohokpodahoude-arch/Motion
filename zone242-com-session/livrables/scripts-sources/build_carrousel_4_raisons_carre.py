import pathlib, sys
from playwright.sync_api import sync_playwright
H = pathlib.Path(sys.argv[1]).resolve()  # dossier des ressources (f/, logos_alpha.png, titre_alpha3.png)
O = pathlib.Path(sys.argv[2]).resolve(); O.mkdir(parents=True, exist_ok=True)
CSS = """
@font-face{font-family:B;src:url(f/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:M;font-weight:600;src:url(f/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;font-family:B;color:#fff;
 background:linear-gradient(120deg,#ee1a02 0%,#f12e04 40%,#f5541a 74%,#fb7a2a 100%)}
.sh{position:absolute;inset:0}
.s1{background:#ff7a33;opacity:.20;clip-path:polygon(0 0,20% 0,8% 100%,0 100%)}
.s2{background:#b80f00;opacity:.20;clip-path:polygon(34% 0,46% 0,28% 100%,16% 100%)}
.s3{background:#ff9a4a;opacity:.16;clip-path:polygon(66% 0,78% 0,64% 100%,52% 100%)}
.s4{background:#c01200;opacity:.18;clip-path:polygon(88% 0,100% 0,100% 100%,76% 100%)}
.foot{position:absolute;left:60px;right:60px;bottom:40px;display:flex;align-items:center;justify-content:space-between;font-size:27px;letter-spacing:.07em}
.foot img{width:72px;height:72px;margin-right:18px}.foot .l{display:flex;align-items:center}
.foot .r{font-family:M;font-weight:800;font-size:22px;letter-spacing:.04em}
.swipe{position:absolute;right:60px;top:60px;font-family:M;font-weight:800;font-size:22px;letter-spacing:.1em;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.7);border-radius:40px;padding:12px 26px}
.chip{display:inline-block;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.75);border-radius:50px;padding:10px 26px 10px;font-family:M;font-weight:800;font-size:27px;letter-spacing:0;margin:0 12px 14px 0}
.chipb{background:#0260a6;border-color:#0260a6}
"""
def base(inner, n, total=6): return f"""<!doctype html><meta charset=utf-8><style>{CSS}</style>
<div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div>{inner}
<div class=foot><div class=l><img src=logos_alpha.png>27–29 NOVEMBRE 2026 · ZONE 242, SIKECODJI</div><div class=r>{n} / {total}</div></div>"""
slides = []
# 1 couverture
slides.append(f"""<!doctype html><meta charset=utf-8><style>{CSS}
.glow{{position:absolute;left:40px;top:60px;width:1000px;height:760px;background:radial-gradient(closest-side,rgba(255,170,110,.6),rgba(255,170,110,0))}}
#ti{{position:absolute;left:90px;top:80px;width:900px;filter:drop-shadow(0 0 16px rgba(255,255,255,.7)) drop-shadow(0 0 44px rgba(255,255,255,.3))}}
.k{{position:absolute;left:0;right:0;top:560px;text-align:center}}
.k .n{{display:inline-block;background:#0260a6;font-size:230px;line-height:1;padding:24px 56px 6px;border-radius:12px;box-shadow:0 10px 30px rgba(60,0,0,.3)}}
.k .t{{font-size:100px;line-height:.95;letter-spacing:.04em;margin-top:20px;text-shadow:0 6px 20px rgba(120,10,0,.35)}}
</style><div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div><div class=glow></div>
<img id=ti src=titre_alpha3.png><div class=k><span class=n>4</span><div class=t>RAISONS DE VENIR</div></div>
<div class=swipe>GLISSE →</div>
<div class=foot><div class=l><img src=logos_alpha.png>RESTAURÉE · OINTE · ENVOYÉE</div><div class=r>1 / 6</div></div>""")
RAISONS = [
 ("1", "POUR ÊTRE", "RESTAURÉE", "Guérir des traumatismes émotionnels, prendre soin de son corps et parler enfin de ce qu'on n'ose pas dire.", ["Panel 1 · samedi 10h30", "Belle et en bonne santé · 12h00", "Table ronde · 17h15"]),
 ("2", "POUR ÊTRE", "OINTE", "Deux grands rendez-vous spirituels avec la Prophétesse Mary Favour TONGSI.", ["Vendredi 27 · 19h45", "Dimanche 29 · 8h45"]),
 ("3", "POUR ÊTRE", "ENVOYÉE", "Des panels pour comprendre ton appel, bâtir ta vie financière avec Dieu et faire de ta maison une mission.", ["Me voici, envoie-moi !", "Femme, foi et finances", "Ma maison, ma mission"]),
 ("4", "POUR TE", "RESSOURCER ET CÉLÉBRER", "Une Zone Détente le samedi, puis l'Agapè des Femmes le dimanche.", ["Salon de thé", "Massages", "Beauté et bien-être", "Coin photo", "Agapè · dimanche 11h30"]),
]
for i, (num, l1, l2, body, chips) in enumerate(RAISONS, 2):
    big = 150 if len(l2) < 12 else 104
    ch = "".join(f'<span class="chip{" chipb" if j == 0 and i < 4 else ""}">{c}</span>' for j, c in enumerate(chips))
    slides.append(base(f"""<style>
.num{{position:absolute;left:60px;top:50px;font-size:300px;line-height:.9;color:#0260a6;text-shadow:0 0 30px rgba(255,255,255,.25)}}
.lab{{position:absolute;left:60px;top:350px;right:60px}}
.lab .a{{font-size:70px;letter-spacing:.06em;opacity:.95}}.lab .b{{font-size:{big}px;line-height:.95;letter-spacing:.02em;text-shadow:0 6px 24px rgba(120,10,0,.35);margin-top:4px}}
.bd{{position:absolute;left:60px;right:60px;top:{600 if len(l2) < 12 else 640}px;font-family:M;font-weight:600;font-size:38px;line-height:1.3;color:#ffe9d8}}
.chips{{position:absolute;left:60px;right:60px;top:{760 if len(l2) < 12 else 790}px}}
</style><div class=swipe>GLISSE →</div>
<div class=num>{num}</div><div class=lab><div class=a>{l1}</div><div class=b>{l2}</div></div>
<div class=bd>{body}</div><div class=chips>{ch}</div>""", i))
# 6 fin
slides.append(base("""<style>
.m{position:absolute;left:0;right:0;top:110px;text-align:center}
.m .a{font-size:150px;line-height:.95;letter-spacing:.03em;text-shadow:0 6px 24px rgba(120,10,0,.35)}
.m .b{font-size:62px;letter-spacing:.05em;margin-top:18px}
.m .q{font-family:M;font-weight:600;font-size:28px;margin-top:18px;color:#ffe9d8}
.bx{position:absolute;left:100px;right:100px;top:590px;background:rgba(2,96,166,.55);border-radius:16px;padding:34px 40px 26px;font-size:60px;line-height:1.06;text-align:center}
.bx .c{font-family:M;font-weight:600;font-size:30px;line-height:1.5;margin-top:12px}
.inv{position:absolute;left:0;right:0;top:872px;text-align:center;font-size:72px;letter-spacing:.06em}.inv b{font-weight:400;background:#fff;color:#d8300a;padding:8px 30px 0;border-radius:8px}
</style><div class=m><div class=a>ET TOI,<br>TU VIENS ?</div><div class=b>WEEK-END ZONE WOMEN</div><div class=q>« Les femmes prennent le contrôle de la Zone »</div></div>
<div class=bx>DU VEN. 27 AU DIM. 29 NOVEMBRE 2026<div class=c>Zone 242 – Sikècodji, rue de Golf FM<br>Gratuit · 150 places · inscription obligatoire<br>contact.zone242@gmail.com · 01 41 62 77 77</div></div>
<div class=inv><b>INVITE UNE AMIE</b></div>""", 6))
out = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page()
    for i, h in enumerate(slides, 1):
        f = H / f"s{i}.html"; f.write_text(h); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        pg.screenshot(path=str(O / f"4_raisons_WZW_{i}.png"))
    b.close()
