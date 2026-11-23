# Carrousel « C'est quoi la WZW ? » · 7 diapos 1080×1080 · identité de l'affiche officielle.
# Usage : python carrousel_cest_quoi_wzw.py <dossier_sortie>
import pathlib, sys, shutil, subprocess
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); HERE = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("presentation-dr-hestia/assets/logos_alpha.png", "logos.png"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
shutil.copy(HERE / "mary_net.png", T / "mary.png")
PH = ["anne", "pelagie", "jessie", "veronica", "sylvie", "marjolaine", "manne", "hestia", "richmelle", "esperance", "huldah", "tossou", "roukiyatou"]
for p in PH:
    subprocess.run([sys.executable, str(HERE / "nettoyer_detourage.py"), str(R / f"annonce-wzw-reference/assets/photos/{p}.png"), str(T / f"{p}.png"), "2"], check=True, capture_output=True)
N = 7
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}.lock{filter:drop-shadow(0 0 16px rgba(255,255,255,.55))}
.k{font-family:M;font-weight:800;letter-spacing:.2em;color:#ffe3cf}.tx{font-family:M;font-weight:600;line-height:1.38}.tx b{font-weight:800}
.tag{background:#0b2a5c;color:#fff;font-family:M;font-weight:800;letter-spacing:.08em;display:inline-block}
.av{border-radius:50%;border:5px solid #fff;background:#fb7a2a;overflow:hidden;box-shadow:0 10px 22px rgba(80,0,0,.35)}.av img{width:100%;height:185%;object-fit:cover;object-position:50% 0;display:block}"""
def dots(n):
    return '<div class="a" style="right:64px;top:70px;display:flex;gap:10px;align-items:center">' + "".join(f'<i style="display:block;height:14px;border-radius:7px;background:{"#fff" if i == n else "rgba(255,255,255,.4)"};width:{40 if i == n else 14}px"></i>' for i in range(1, N + 1)) + "</div>"
def base(n, inner, cover=False):
    g = ('<img class="a" src="w1.png" style="left:-140px;top:300px;height:900px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:600px;top:-120px;height:820px;opacity:.07;filter:brightness(2)">'
         '<div class="a" style="inset:0;background:#b80f00;opacity:.12;clip-path:polygon(0 0,16% 0,4% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(80% 0,100% 0,100% 100%,64% 100%)"></div>')
    top = "" if cover else '<img class="a lock" src="lockup.png" style="left:64px;top:52px;width:170px">' + dots(n)
    foot = f'<div class="a" style="left:64px;right:64px;bottom:48px;border-top:2px solid rgba(255,255,255,.4);padding-top:18px;display:flex;justify-content:space-between;font-family:M;font-weight:800;font-size:19px;letter-spacing:.1em;color:#ffe3cf"><span>27–29 NOVEMBRE 2026 · ZONE 242 · SIKÈCODJI</span><span>{n} / {N}</span></div>'
    return g + top + inner + foot
S = []
# 1 couverture
S.append(base(1, '''<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(255,180,120,.75),rgba(255,180,120,0) 60%)"></div>
<img class="a" src="logos.png" style="left:40px;top:36px;width:104px">
<img class="a lock" src="lockup.png" style="left:150px;top:170px;width:780px">
<div class="a" style="left:0;width:1080px;top:600px;text-align:center;font-size:150px;line-height:.9;text-shadow:0 8px 30px rgba(110,10,0,.35)">C'EST QUOI<br>LA WZW ?</div>
<div class="a k" style="left:0;width:1080px;top:900px;text-align:center;font-size:26px">GLISSE POUR DÉCOUVRIR →</div>''', True))
# 2 le nom
S.append(base(2, '''<div class="a k" style="left:64px;top:230px;font-size:24px">WZW, C'EST…</div>
<div class="a" style="left:64px;top:272px;font-size:200px;line-height:.86;text-shadow:0 8px 30px rgba(110,10,0,.35)">WEEK-END<br>ZONE<br>WOMEN</div>
<div class="a tx" style="left:64px;top:792px;width:900px;font-size:40px">Un week-end <b>pensé pour les femmes</b> de la Zone, du <b>vendredi 27 au dimanche 29 novembre 2026</b>.</div>'''))
# 3 le thème
rows = [("RESTAURÉE", "Guérir le cœur, prendre soin de son corps."), ("OINTE", "Découvrir son appel, bâtir sa vie financière avec Dieu."), ("ENVOYÉE", "Faire de sa maison une mission, repartir bénie et envoyée.")]
h = '<div class="a k" style="left:64px;top:200px;font-size:24px">LE THÈME</div><div class="a" style="left:64px;top:240px;font-size:110px;line-height:.9">3 MOTS, 3 TEMPS</div>'
for i, (w, d) in enumerate(rows):
    y = 400 + i * 190
    h += f'<div class="a" style="left:64px;top:{y}px;width:952px;height:166px;background:#fff;border-radius:22px;box-shadow:0 14px 30px rgba(90,0,0,.3)"></div>'
    h += f'<div class="a" style="left:64px;top:{y}px;width:12px;height:166px;background:#0260a6;border-radius:22px 0 0 22px"></div>'
    h += f'<div class="a" style="left:104px;top:{y + 18}px;font-size:80px;line-height:1;color:#ee1a02;letter-spacing:.02em">{w}</div><div class="a tx" style="left:104px;top:{y + 100}px;width:880px;font-size:27px;white-space:nowrap;color:#10143a">{d}</div>'
S.append(base(3, h))
# 4 le slogan
S.append(base(4, '''<div class="a k" style="left:64px;top:230px;font-size:24px">NOTRE MESSAGE</div>
<div class="a" style="left:64px;top:272px;font-size:138px;line-height:.9;text-shadow:0 8px 30px rgba(110,10,0,.35)">LES FEMMES<br>PRENNENT<br>LE CONTRÔLE<br>DE LA ZONE</div>
<div class="a tx" style="left:64px;top:830px;width:920px;font-size:32px">Pendant tout le week-end, les femmes tiennent <b>l'accueil, la louange, l'animation et l'organisation.</b></div>'''))
# 5 trois jours
days = [("VENDREDI 27", "19H45", "Soirée d'ouverture avec la Prophétesse Mary TONGSI"), ("SAMEDI 28", "9H00", "Women's Experience Day : relaxation, panels, santé, Zone Détente, table ronde"), ("DIMANCHE 29", "8H45", "Culte de clôture avec la Prophétesse Mary TONGSI, puis Agapè")]
h = '<div class="a k" style="left:64px;top:200px;font-size:24px">LE PROGRAMME</div><div class="a" style="left:64px;top:240px;font-size:110px;line-height:.9">3 JOURS</div>'
for i, (d, t, x) in enumerate(days):
    y = 400 + i * 190
    h += f'<div class="a" style="left:64px;top:{y}px;width:330px;height:166px;background:#0260a6;clip-path:polygon(0 0,100% 4%,100% 100%,0 96%)"></div>'
    h += f'<div class="a" style="left:92px;top:{y + 22}px;font-size:36px;line-height:1;letter-spacing:.04em">{d}</div><div class="a" style="left:92px;top:{y + 64}px;font-size:92px;line-height:.9">{t}</div>'
    h += f'<div class="a tx" style="left:430px;top:{y + 30}px;width:590px;font-size:31px">{x}</div>'
S.append(base(5, h))
# 6 les intervenantes
rowsets = [PH[0:5], PH[5:9], PH[9:13]]
h = '<div class="a k" style="left:64px;top:190px;font-size:24px">QUI ?</div><div class="a" style="left:64px;top:228px;font-size:92px;line-height:.9">DES FEMMES ENGAGÉES</div>'
h += '<div class="a" style="left:64px;top:326px;width:900px;font-family:M;font-weight:600;font-size:26px;color:#fff">autour de la Prophétesse Mary Favour TONGSI, invitée d\'honneur.</div>'
h += '<img class="a" src="mary.png" style="right:70px;top:150px;height:220px;opacity:0">'
y = 420; d = 168
for r, row in enumerate([["anne", "pelagie", "jessie", "veronica", "sylvie"], ["marjolaine", "manne", "hestia", "richmelle", "esperance"], ["huldah", "tossou", "roukiyatou"]]):
    wrow = len(row) * d + (len(row) - 1) * 22; x0 = (1080 - wrow) // 2
    for i, pid in enumerate(row):
        h += f'<div class="a av" style="left:{x0 + i * (d + 22)}px;top:{y + r * (d + 26)}px;width:{d}px;height:{d}px"><img src="{pid}.png"></div>'
S.append(base(6, h))
# 7 appel à l'action
S.append(base(7, '''<div class="a" style="inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,180,120,.6),rgba(255,180,120,0) 60%)"></div>
<div class="a" style="left:64px;top:210px;font-size:158px;line-height:.88;text-shadow:0 8px 30px rgba(110,10,0,.35)">VIENS<br>VIVRE LA<br>WZW</div>
<div class="a" style="left:64px;top:690px;display:flex;gap:14px"><span class="tag" style="font-size:24px;padding:11px 20px;white-space:nowrap">GRATUIT</span><span class="tag" style="font-size:24px;padding:11px 20px;white-space:nowrap">150 PLACES</span><span class="tag" style="font-size:24px;padding:11px 20px;white-space:nowrap">INSCRIPTION OBLIGATOIRE</span></div>
<div class="a" style="left:64px;top:790px;background:#fff;color:#d8300a;font-size:64px;line-height:1;padding:14px 34px 6px;border-radius:14px;box-shadow:0 14px 30px rgba(90,0,0,.3)">INSCRIS-TOI · LIEN EN BIO</div>
<div class="a tx" style="left:64px;top:910px;width:950px;font-size:24px;color:#ffe3cf">Zone 242 – Sikècodji, rue de Golf FM, Cotonou · contact.zone242@gmail.com · 01 41 62 77 77</div>'''))
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for i, body in enumerate(S, 1):
        f = T / f"s{i}.html"; f.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}")
        pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"Carrousel_Cest_quoi_la_WZW_{i:02d}.png"))
    b.close()
shutil.rmtree(T); print("ok")
