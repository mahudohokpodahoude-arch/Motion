# Carrousel « 4 raisons de venir » 1080×1080 (6 diapos) · Week-end Zone Women · 27-29 novembre 2026.
# Usage : python build_carrousel_4_raisons_carre.py <dossier_ressources> <dossier_sortie>
#   ressources : f/ (bebas-neue-latin-400, montserrat-latin-600 et 800 .woff2), logos_alpha.png, titre_alpha3.png, femme_teaser.png
import pathlib, sys
from playwright.sync_api import sync_playwright
H = pathlib.Path(sys.argv[1]).resolve(); O = pathlib.Path(sys.argv[2]).resolve(); O.mkdir(parents=True, exist_ok=True)
N = 6
CSS = """
@font-face{font-family:B;src:url(f/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:M;font-weight:600;src:url(f/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;font-family:B;color:#fff;
 background:linear-gradient(135deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)}
.sh{position:absolute;inset:0}
.s1{background:#ff7a33;opacity:.22;clip-path:polygon(0 0,24% 0,10% 100%,0 100%)}
.s2{background:#b80f00;opacity:.22;clip-path:polygon(36% 0,50% 0,32% 100%,18% 100%)}
.s3{background:#ff9a4a;opacity:.18;clip-path:polygon(68% 0,82% 0,66% 100%,52% 100%)}
.s4{background:#c01200;opacity:.20;clip-path:polygon(88% 0,100% 0,100% 100%,76% 100%)}
.logo{position:absolute;left:56px;top:50px;width:250px;filter:drop-shadow(0 0 10px rgba(255,255,255,.45))}
.bar{position:absolute;left:0;right:0;bottom:0;height:76px;background:rgba(8,12,52,.78);display:flex;align-items:center;justify-content:space-between;padding:0 56px;font-size:28px;letter-spacing:.07em}
.bar .z{display:flex;align-items:center;gap:16px}.bar img{height:52px;width:52px}
.bar .r{font-family:M;font-weight:800;font-size:22px;letter-spacing:.04em;color:#ffd7b8}
.dots{position:absolute;right:56px;top:62px;display:flex;gap:10px;align-items:center}
.dots i{display:block;width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,.35)}.dots i.on{background:#fff;width:46px;border-radius:9px}
.swipe{position:absolute;right:56px;top:100px;font-family:M;font-weight:800;font-size:20px;letter-spacing:.12em;color:#ffe9d8}
.num{position:absolute;left:56px;top:210px;width:210px;height:210px;background:#0260a6;border-radius:26px;box-shadow:0 14px 34px rgba(50,0,0,.35);font-size:230px;line-height:1;text-align:center;padding-top:26px;transform:rotate(-4deg)}
.lab{position:absolute;left:300px;top:225px;right:50px}
.lab .a{font-family:M;font-weight:800;font-size:34px;letter-spacing:.16em;color:#ffe9d8}
.lab .b{line-height:.9;letter-spacing:.02em;text-shadow:0 6px 24px rgba(120,10,0,.4);margin-top:8px}
.card{position:absolute;left:56px;right:56px;top:450px;bottom:116px;background:#fff7ef;border-radius:30px;box-shadow:0 22px 50px rgba(70,0,0,.35);padding:40px 50px;color:#151a3a;display:flex;flex-direction:column;justify-content:center}
.card:before{content:"";position:absolute;left:0;top:34px;bottom:34px;width:12px;background:#f5541a;border-radius:0 8px 8px 0}
.card p{font-family:M;font-weight:600;font-size:41px;line-height:1.32;color:#151a3a}
.card p b{font-weight:800;color:#d8300a}
.chips{margin-top:30px}
.chip{display:inline-block;background:#0260a6;color:#fff;border-radius:50px;padding:12px 28px 12px;font-family:M;font-weight:800;font-size:28px;margin:0 12px 14px 0}
.chip.o{background:#fff;color:#d8300a;border:3px solid #f5541a;padding:9px 25px}
"""
def bar(n, txt="27–29 NOVEMBRE 2026 · ZONE 242, SIKÈCODJI"):
    return f'<div class=bar><div class=z><img src=logos_alpha.png>{txt}</div><div class=r>{n} / {N}</div></div>'
def dots(n): return '<div class=dots>' + "".join(f'<i class="{"on" if i == n else ""}"></i>' for i in range(1, N + 1)) + '</div>'
def page(inner, n, extra_css=""):
    return f"<!doctype html><meta charset=utf-8><style>{CSS}{extra_css}</style><div class=sh></div><div class='sh s1'></div><div class='sh s2'></div><div class='sh s3'></div><div class='sh s4'></div>{inner}{bar(n)}"
S = []
# 1 couverture : la femme du teaser, téléphone avec les dates
S.append(page("""
<style>
.glow{position:absolute;left:300px;top:120px;width:900px;height:900px;background:radial-gradient(closest-side,rgba(255,200,150,.75),rgba(255,200,150,0))}
.fem{position:absolute;left:392px;bottom:76px;width:722px;filter:drop-shadow(-14px 10px 28px rgba(80,10,0,.45))}
.big4{position:absolute;left:50px;top:230px;font-size:430px;line-height:.78;color:#0260a6;text-shadow:0 0 40px rgba(255,255,255,.35)}
.t{position:absolute;left:56px;top:560px;font-size:128px;line-height:.9;letter-spacing:.02em;text-shadow:0 6px 24px rgba(120,10,0,.45)}
.gl{position:absolute;left:56px;top:918px;font-family:M;font-weight:800;font-size:22px;letter-spacing:.12em;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.75);border-radius:40px;padding:10px 24px}
</style><div class=glow></div><img class=fem src=femme_teaser.png><img class=logo src=titre_alpha3.png>
<div class=big4>4</div><div class=t>RAISONS<br>DE VENIR</div><div class=gl>GLISSE →</div>""", 1))
RAISONS = [
 ("1", "POUR ÊTRE", "RESTAURÉE", "<b>Guérir</b> des traumatismes émotionnels, prendre soin de son corps et parler enfin de ce qu'on n'ose pas dire.", ["Panel 1 · samedi 10h30", "Belle et en bonne santé · 12h00", "Table ronde · 17h15"]),
 ("2", "POUR ÊTRE", "OINTE", "Deux grands rendez-vous <b>spirituels</b> avec la Prophétesse Mary Favour TONGSI.", ["Vendredi 27 · 19h45", "Dimanche 29 · 8h45"]),
 ("3", "POUR ÊTRE", "ENVOYÉE", "Des panels pour comprendre ton <b>appel</b>, bâtir ta vie financière avec Dieu et faire de ta maison une <b>mission</b>.", ["Me voici, envoie-moi !", "Femme, foi et finances", "Ma maison, ma mission"]),
 ("4", "POUR TE", "RESSOURCER ET CÉLÉBRER", "Une <b>Zone Détente</b> le samedi, puis l'<b>Agapè des Femmes</b> le dimanche.", ["Salon de thé", "Massages", "Beauté et bien-être", "Coin photo", "Agapè · dimanche 11h30"]),
]
for i, (num, l1, l2, body, chips) in enumerate(RAISONS, 2):
    big = 150 if len(l2) < 12 else 98
    ch = "".join(f'<span class="chip{" o" if j == len(chips) - 1 and i == 5 else ""}">{c}</span>' for j, c in enumerate(chips))
    S.append(page(f"""<img class=logo src=titre_alpha3.png style="width:200px">{dots(i)}<div class=swipe>GLISSE →</div>
<div class=num>{num}</div><div class=lab><div class=a>{l1}</div><div class=b style="font-size:{big}px">{l2}</div></div>
<div class=card><p>{body}</p><div class=chips>{ch}</div></div>""", i))
# 6 fin
S.append(page("""
<style>
.glow{position:absolute;left:380px;top:200px;width:800px;height:800px;background:radial-gradient(closest-side,rgba(255,200,150,.7),rgba(255,200,150,0))}
.fem{position:absolute;left:560px;bottom:76px;width:540px;filter:drop-shadow(-12px 8px 24px rgba(80,10,0,.45))}
.q{position:absolute;left:56px;top:176px;font-size:150px;line-height:.9;letter-spacing:.02em;text-shadow:0 6px 24px rgba(120,10,0,.4)}
.sl{position:absolute;left:56px;top:470px;width:470px;font-family:M;font-weight:600;font-size:26px;line-height:1.35;color:#ffe9d8}
.bx{position:absolute;left:56px;top:560px;width:540px;background:rgba(2,96,166,.9);border-radius:22px;padding:28px 32px 24px;box-shadow:0 18px 40px rgba(40,0,0,.35)}
.bx .d{font-size:54px;line-height:1;letter-spacing:.03em}
.bx .c{font-family:M;font-weight:600;font-size:21px;line-height:1.55;margin-top:12px}
.inv{position:absolute;left:56px;top:880px;font-size:64px;letter-spacing:.05em}.inv b{font-weight:400;background:#fff;color:#d8300a;padding:6px 26px 0;border-radius:10px;display:inline-block}
</style><div class=glow></div><img class=fem src=femme_teaser.png><img class=logo src=titre_alpha3.png style="width:200px">
<div class=q>ET TOI,<br>TU VIENS ?</div><div class=sl>« Les femmes prennent le contrôle de la Zone »</div>
<div class=bx><div class=d>DU VEN. 27 AU DIM. 29<br>NOVEMBRE 2026</div><div class=c>Zone 242 – Sikècodji, rue de Golf FM<br>Gratuit · 150 places · inscription obligatoire<br>contact.zone242@gmail.com · 01 41 62 77 77</div></div>
<div class=inv><b>INVITE UNE AMIE</b></div>""", 6))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page()
    for i, h in enumerate(S, 1):
        f = H / f"s{i}.html"; f.write_text(h); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        pg.screenshot(path=str(O / f"4_raisons_WZW_{i}.png"))
    b.close()
