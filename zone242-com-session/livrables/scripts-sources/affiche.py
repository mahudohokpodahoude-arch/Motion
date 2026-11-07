# Affiche « Baptême » — Zone 242 — 1920×1080. Composition HTML rendue par Chromium à 2× puis réduite (bords nets).
import sys, json, random, argparse, pathlib
from playwright.sync_api import sync_playwright
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("--label", default="bleu")           # cyan (comme le modèle) | bleu (bleu officiel Zone 242)
ap.add_argument("--wave", type=float, default=0.0)    # amplitude de l'arc des lettres (px) ; 0 = titre droit
ap.add_argument("--out", default="affiche_test")
ap.add_argument("--bg", default="fond_eau.png")
ap.add_argument("--hide", action="store_true")      # débogage : fond seul, sans titre/logo/étiquette
a = ap.parse_args()
HERE = pathlib.Path(__file__).resolve().parent

TITLE = "BAPTÊME"
ADDRESS = ["COTONOU", "SIKECODJI", "RUE GOLF FM"]

def torn_polygon(w, h, seed, amp=10.0):
    r = random.Random(seed); pts = []
    x = 0.0
    while x < w:                                                   # bord haut, de gauche à droite : pointes de papier déchiré
        spike = -r.uniform(2, amp * 1.5) if r.random() < 0.22 else r.uniform(-amp * 0.35, amp * 0.55)
        pts.append((x, spike)); x += r.uniform(9, 26)
    y = 0.0
    while y < h:                                                   # bord droit, légèrement irrégulier
        pts.append((w + r.uniform(-8, 6), y + r.uniform(-3, 3))); y += r.uniform(14, 26)
    x = float(w)
    while x > 0:                                                   # bord bas, de droite à gauche
        spike = h + r.uniform(2, amp * 1.3) if r.random() < 0.20 else h + r.uniform(-amp * 0.55, amp * 0.35)
        pts.append((x, spike)); x -= r.uniform(10, 28)
    y = float(h)
    while y > 0:                                                   # bord gauche
        pts.append((r.uniform(-6, 8), y + r.uniform(-3, 3))); y -= r.uniform(14, 26)
    return pts

LW, LH, PAD = 1240, 118, 28
poly = torn_polygon(LW, LH, 242)
points = " ".join(f"{x + PAD:.1f},{y + PAD:.1f}" for x, y in poly)
logo = (HERE / "logo_blanc.svg").read_text()
if a.label == "bleu":
    fill = '<linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d12e6"/><stop offset="1" stop-color="#1900cf"/></linearGradient>'
    pin = "#ff5a36"
else:
    fill = '<linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2cc8fa"/><stop offset="1" stop-color="#0a9de5"/></linearGradient>'
    pin = "#ffffff"

# lettres : arc léger (monte puis redescend), chaque lettre suit la tangente
letters = ""
if a.wave > 0:
    n = len(TITLE); spans = []
    for i, ch in enumerate(TITLE):
        t = (i - (n - 1) / 2) / ((n - 1) / 2)                      # -1 … 1
        dy = a.wave * (t * t - 1)                                  # arc : plus haut au centre
        rot = (2 * a.wave * t) / 760 * 57.3                        # tangente de l'arc (degrés)
        spans.append(f'<span class="l" style="transform:translateY({dy:.1f}px) rotate({rot:.2f}deg)">{ch}</span>')
    letters = "".join(spans)
else:
    letters = TITLE

html = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Baptême — Zone 242</title>
<style>
@font-face{{font-family:"Poppins";font-weight:600;src:url(fonts/poppins-latin-600-normal.woff2) format("woff2")}}
@font-face{{font-family:"Poppins";font-weight:700;src:url(fonts/poppins-latin-700-normal.woff2) format("woff2")}}
@font-face{{font-family:"Poppins";font-weight:800;src:url(fonts/poppins-latin-800-normal.woff2) format("woff2")}}
@font-face{{font-family:"Poppins";font-weight:900;src:url(fonts/poppins-latin-900-normal.woff2) format("woff2")}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1920px;height:1080px;overflow:hidden;background:#1d8fc2}}
#bg{{position:absolute;left:0;top:0;width:1920px;height:1080px;display:block}}
#haze{{position:absolute;left:560px;top:-70px;width:800px;height:430px;background:radial-gradient(closest-side,rgba(7,88,150,.80),rgba(7,88,150,.42) 55%,rgba(7,88,150,0))}}
#logo{{position:absolute;left:50%;top:50px;width:196px;margin-left:-98px;color:#fff;filter:drop-shadow(0 2px 4px rgba(3,54,102,.60)) drop-shadow(0 5px 16px rgba(3,54,102,.45))}}
#logo svg{{display:block;width:100%;height:auto}}
#titre{{position:absolute;left:0;top:0;width:1920px;text-align:center;font:900 300px/1 "Poppins",sans-serif;letter-spacing:-.012em;white-space:nowrap;
  color:#fff;filter:drop-shadow(0 12px 26px rgba(5,68,122,.52)) drop-shadow(0 3px 4px rgba(5,68,122,.50))}}
#titre .t{{display:inline-block;padding:.30em .10em .14em;margin:-.30em -.10em -.14em;background:linear-gradient(180deg,#fff 0%,#fff 52%,#d6f0fa 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}}
#titre .l{{display:inline-block;padding:.30em .04em .14em;margin:-.30em -.04em -.14em;background:linear-gradient(180deg,#fff 0%,#fff 52%,#d6f0fa 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transform-origin:50% 60%}}
#flares{{position:absolute;left:0;top:0;width:1920px;height:1080px;mix-blend-mode:screen;opacity:.9;pointer-events:none}}
#adresse{{position:absolute;left:50%;top:858px;width:{LW + 2 * PAD}px;height:{LH + 2 * PAD}px;margin-left:{-(LW + 2 * PAD) // 2}px;filter:drop-shadow(0 8px 14px rgba(4,64,118,.38))}}
#adresse svg.bg{{position:absolute;left:0;top:0}}
#adresse .txt{{position:absolute;left:{PAD}px;top:{PAD}px;width:{LW}px;height:{LH}px;display:flex;align-items:center;justify-content:center;gap:26px;
  font:700 46px/1 "Poppins",sans-serif;letter-spacing:.055em;color:#fff;text-shadow:0 2px 6px rgba(2,50,100,.30)}}
#adresse .sep{{width:11px;height:11px;border-radius:50%;background:#fff;opacity:.9}}
#adresse .pin{{width:44px;height:44px;margin-right:6px;flex:none}}
</style></head><body>
<img id="bg" src="{a.bg}">
<div id="haze"></div>
<div id="logo">{logo}</div>
<div id="titre"><span class="t">{letters if a.wave == 0 else ''}</span>{letters if a.wave > 0 else ''}</div>
<img id="flares" src="flares_top.png">
<div id="adresse">
  <svg class="bg" width="{LW + 2 * PAD}" height="{LH + 2 * PAD}" viewBox="0 0 {LW + 2 * PAD} {LH + 2 * PAD}"><defs>{fill}</defs><polygon points="{points}" fill="url(#lg)"/></svg>
  <div class="txt">
    <svg class="pin" viewBox="0 0 24 24"><path fill="{pin}" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
    <span>{ADDRESS[0]}</span><i class="sep"></i><span>{ADDRESS[1]}</span><i class="sep"></i><span>{ADDRESS[2]}</span>
  </div>
</div>
<script>
const fit=async()=>{{
  await Promise.all(["900 100px Poppins","700 46px Poppins"].map(f=>document.fonts.load(f)));
  await document.fonts.ready;
  const el=document.getElementById("titre"); el.style.fontSize="100px";
  const probe=document.createElement("span"); probe.style.cssText="position:absolute;visibility:hidden;white-space:nowrap;font:900 100px/1 Poppins;letter-spacing:-.012em";
  probe.textContent="{TITLE}"; document.body.appendChild(probe);
  const w=probe.getBoundingClientRect().width; const size=100*1560/w; el.style.fontSize=size+"px";
  const capCenter=size*0.5;                                   // centre optique des capitales ≈ milieu de la ligne
  el.style.top=(555-capCenter)+"px";
  window.__info={{size:size}}; window.__ready=true;
}};
fit();
</script>{{HIDE}}</body></html>"""
html = html.replace("{HIDE}", "<style>#logo,#titre,#adresse,#flares{visibility:hidden}</style>" if a.hide else "")
(HERE / "affiche.html").write_text(html)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox", "--force-color-profile=srgb"])
    ctx = b.new_context(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
    pg = ctx.new_page(); pg.goto("file://" + str(HERE / "affiche.html"))
    pg.wait_for_function("window.__ready === true", timeout=30000)
    info = pg.evaluate("window.__info")
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(HERE / (a.out + "_2x.png")), type="png")
    b.close()
im = Image.open(HERE / (a.out + "_2x.png")).convert("RGB")
im.resize((1920, 1080), Image.LANCZOS).save(HERE / (a.out + ".png"))
print("taille du titre : %.0f px | rendu 2× : %s → %s.png (1920×1080)" % (info["size"], im.size, a.out))
