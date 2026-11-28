# Carrousel « 4 raisons d'être au Week-end Zone Women » · version épurée 1080×1080 (6 diapos).
# Usage : python build_carrousel_4_raisons_epure.py <dossier_ressources> <dossier_sortie>
#   ressources : f/ (polices), titre_alpha3.png, logos_alpha.png, femme_teaser.png
import pathlib, sys
from playwright.sync_api import sync_playwright
H = pathlib.Path(sys.argv[1]).resolve(); O = pathlib.Path(sys.argv[2]).resolve(); O.mkdir(parents=True, exist_ok=True)
N = 6
CSS = """
@font-face{font-family:B;src:url(f/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:M;font-weight:600;src:url(f/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;font-family:B;color:#fff;background:linear-gradient(135deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)}
.sh{position:absolute;inset:0}
.s1{background:#ff7a33;opacity:.16;clip-path:polygon(0 0,24% 0,10% 100%,0 100%)}
.s2{background:#b80f00;opacity:.16;clip-path:polygon(36% 0,50% 0,32% 100%,18% 100%)}
.s3{background:#ff9a4a;opacity:.12;clip-path:polygon(68% 0,82% 0,66% 100%,52% 100%)}
.s4{background:#c01200;opacity:.14;clip-path:polygon(88% 0,100% 0,100% 100%,76% 100%)}
.top{position:absolute;left:72px;right:72px;top:56px;display:flex;justify-content:space-between;align-items:center}
.top img{width:170px;filter:drop-shadow(0 0 8px rgba(255,255,255,.4))}
.top span{font-family:M;font-weight:800;font-size:20px;letter-spacing:.14em;color:#ffe3cf}
.foot{position:absolute;left:72px;right:72px;bottom:52px;display:flex;justify-content:space-between;align-items:center;border-top:2px solid rgba(255,255,255,.45);padding-top:22px}
.foot .l{display:flex;align-items:center;gap:16px;font-size:27px;letter-spacing:.08em}.foot img{height:46px}
.foot .r{font-family:M;font-weight:800;font-size:20px;letter-spacing:.1em;color:#ffe3cf}
.wm{position:absolute;right:40px;top:120px;font-size:760px;line-height:.8;color:rgba(255,255,255,.10)}
.k{position:absolute;left:72px;top:250px;font-family:M;font-weight:800;font-size:28px;letter-spacing:.2em;color:#ffe3cf}
.h{position:absolute;left:72px;top:290px;font-size:236px;line-height:.9;letter-spacing:.01em;text-shadow:0 8px 30px rgba(120,10,0,.28)}
.rule{position:absolute;left:72px;top:560px;width:96px;height:8px;background:#fff;border-radius:4px}
.p{position:absolute;left:72px;top:600px;width:820px;font-family:M;font-weight:600;font-size:40px;line-height:1.35;color:#fff}
.p b{font-weight:800}
.ls{position:absolute;left:72px;top:800px;font-family:M;font-weight:600;font-size:26px;line-height:1.7;color:#ffe3cf}
.ls div:before{content:"— ";opacity:.7}
"""
def page(inner, n):
    bar = f'<div class=foot><div class=l><img src=logos_alpha.png>27–29 NOVEMBRE 2026 · ZONE 242</div><div class=r>{n} / {N}</div></div>'
    return f"<!doctype html><meta charset=utf-8><style>{CSS}</style><div class=sh></div><div class='sh s1'></div><div class='sh s2'></div><div class='sh s3'></div><div class='sh s4'></div>{inner}{bar}"
S = []
S.append(page("""<style>
.glow{position:absolute;left:380px;top:140px;width:800px;height:800px;background:radial-gradient(closest-side,rgba(255,200,150,.7),rgba(255,200,150,0))}
.fem{position:absolute;left:480px;bottom:110px;width:620px;filter:drop-shadow(-12px 10px 26px rgba(80,10,0,.4))}
.n4{position:absolute;left:66px;top:170px;font-size:400px;line-height:.8;color:#0260a6;text-shadow:0 0 36px rgba(255,255,255,.3)}
.t{position:absolute;left:72px;top:520px;font-size:132px;line-height:.9;letter-spacing:.02em;text-shadow:0 8px 26px rgba(120,10,0,.3)}
.t2{position:absolute;left:72px;top:816px;font-family:M;font-weight:800;font-size:30px;letter-spacing:.1em;line-height:1.35;color:#fff}
.rule2{position:absolute;left:72px;top:790px;width:96px;height:8px;background:#fff;border-radius:4px}
</style><div class=glow></div><img class=fem src=femme_teaser.png><div class=top><img src=titre_alpha3.png><span>GLISSE →</span></div>
<div class=n4>4</div><div class=t>RAISONS<br>D'ÊTRE</div><div class=rule2></div><div class=t2>AU WEEK-END<br>ZONE WOMEN</div>""", 1))
R = [
 ("1", "POUR ÊTRE", "RESTAURÉE", "<b>Guérir</b> des blessures du cœur, prendre soin de son corps et parler de ce qu'on n'ose pas dire.", ["Panel 1 · samedi 10h30", "Belle et en bonne santé · samedi 12h00", "Table ronde · samedi 17h15"]),
 ("2", "POUR ÊTRE", "OINTE", "Deux rendez-vous <b>spirituels</b> avec la Prophétesse Mary Favour TONGSI, invitée d'honneur.", ["Vendredi 27 novembre · 19h45", "Dimanche 29 novembre · 8h45"]),
 ("3", "POUR ÊTRE", "ENVOYÉE", "Comprendre son <b>appel</b>, bâtir sa vie financière avec Dieu, faire de sa maison une <b>mission</b>.", ["Me voici, envoie-moi !", "Femme, foi et finances", "Ma maison, ma mission"]),
 ("4", "POUR SE", "RESSOURCER", "Une <b>Zone Détente</b> le samedi, puis l'<b>Agapè des Femmes</b> pour célébrer ensemble.", ["Samedi · salon de thé, massages, beauté et bien-être", "Dimanche 29 novembre · Agapè à 11h30"]),
]
for i, (num, k, h, body, ls) in enumerate(R, 2):
    L = "".join(f"<div>{x}</div>" for x in ls)
    S.append(page(f"""<div class=top><img src=titre_alpha3.png><span>RAISON {num} / 4</span></div><div class=wm>{num}</div>
<div class=k>{k}</div><div class=h>{h}</div><div class=rule></div><div class=p>{body}</div><div class=ls>{L}</div>""", i))
S.append(page("""<style>
.q{position:absolute;left:72px;top:162px;font-size:172px;line-height:.88;letter-spacing:.01em;text-shadow:0 8px 30px rgba(120,10,0,.28)}
.sl{position:absolute;left:72px;top:482px;font-family:M;font-weight:600;font-size:28px;color:#ffe3cf}
.bx{position:absolute;left:72px;top:534px;width:936px;background:#fff;border-radius:22px;padding:26px 40px;color:#151a3a;display:flex;justify-content:space-between;align-items:center;box-shadow:0 18px 40px rgba(60,0,0,.3)}
.bx .d{font-size:76px;line-height:.95;color:#0260a6;letter-spacing:.02em}.bx .d small{display:block;font-size:30px;color:#d8300a;letter-spacing:.06em}
.bx .c{font-family:M;font-weight:600;font-size:21px;line-height:1.55;text-align:right}.bx .c b{font-weight:800;color:#d8300a}
.cta{position:absolute;left:72px;top:762px;font-size:62px;letter-spacing:.05em}.cta b{font-weight:400;background:#fff;color:#d8300a;padding:6px 24px 0;border-radius:10px;display:inline-block}
.ct{position:absolute;left:72px;top:856px;font-family:M;font-weight:800;font-size:28px;line-height:1.5;letter-spacing:.02em}
</style><div class=top><img src=titre_alpha3.png><span></span></div>
<div class=q>ET TOI,<br>TU VIENS ?</div><div class=sl>« Les femmes prennent le contrôle de la Zone »</div>
<div class=bx><div class=d>27–29 NOVEMBRE<small>VEN. 27 AU DIM. 29 · 2026</small></div><div class=c>Zone 242 – Sikècodji<br>rue de Golf FM, Cotonou<br><b>Gratuit · 150 places</b><br>Inscription obligatoire</div></div>
<div class=cta><b>INSCRIS-TOI</b></div><div class=ct>contact.zone242@gmail.com<br>01 41 62 77 77</div>""", 6))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page()
    for i, h in enumerate(S, 1):
        f = H / f"e{i}.html"; f.write_text(h); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        pg.screenshot(path=str(O / f"4_Raisons_WZW_carre_{i:02d}.png")); f.unlink()
    b.close()
print("ok")
