# Courriers panélistes, version charte « affiche » : bandeau dégradé rouge-orange, bleu #0260A6, crème #FFE3CF,
# en-tête avec logo Zone 242, pied de page avec coordonnées et numéro de page.
# Usage : python courriers_panelistes_v2.py <dossier_sortie> <logo_png> [slug_unique]
import sys, pathlib, base64
OUT = pathlib.Path(sys.argv[1]).resolve(); LOGO = pathlib.Path(sys.argv[2]); ONLY = sys.argv[3] if len(sys.argv) > 3 else None
old = (pathlib.Path(__file__).parent / "courriers_panelistes.py").read_text()
head = old[:old.index('CSS = """')].replace("OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)", "")
body = old[old.index("def iv_block"):old.index("files = []")]
body = body.replace('<div class=t>WEEK-END ZONE WOMEN 2026</div><div class=st>COURRIER OFFICIEL À L’ATTENTION DES PANÉLISTES</div>',
  '<div class=banner><div class=bt>WEEK-END ZONE WOMEN 2026</div><div class=bs>COURRIER OFFICIEL À L’ATTENTION DES PANÉLISTES</div></div>')
OUT.mkdir(parents=True, exist_ok=True)
import html, subprocess
from playwright.sync_api import sync_playwright
FONT = pathlib.Path(sys.argv[4]) if len(sys.argv) > 4 else None
exec(head)
CSS = """
@font-face{font-family:Bebas;src:url(file://%s/bebas-neue-latin-400-normal.woff2)}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Carlito,Calibri,sans-serif;font-size:10.3pt;line-height:1.25;color:#1b1b1b;margin:0}
.banner{background:linear-gradient(115deg,#ee1a02 0%%,#f12e04 38%%,#f5541a 72%%,#fb7a2a 100%%);color:#fff;border-radius:6px;padding:12px 18px 10px;text-align:center;margin-bottom:14px}
.bt{font-family:Bebas,Carlito;font-size:30pt;letter-spacing:.05em;line-height:1}
.bs{font-weight:bold;font-size:9.5pt;letter-spacing:.08em;margin-top:2px}
p{margin:0 0 6px}
.obj{font-weight:bold;color:#0260a6}
h2{color:#0260a6;font-size:14pt;margin:14px 0 4px;border-bottom:2px solid #f5541a;padding-bottom:2px}
h3{color:#f12e04;font-size:9.5pt;margin:10px 0 2px;text-transform:uppercase;letter-spacing:.05em}
ul{margin:2px 0 8px;padding-left:22px}li{margin-bottom:4px}
li::marker{color:#f5541a}
.iv{margin:6px 0 10px;padding:7px 12px;border-left:4px solid #f5541a;background:#ffe3cf;border-radius:0 6px 6px 0;break-inside:avoid}
.iv .n{font-weight:bold;color:#0260a6;margin-bottom:2px}
.iv ul{margin:0;padding-left:20px}
.iv b{color:#0260a6}
""" % (FONT if FONT else "")
exec(body)
logo64 = base64.b64encode(LOGO.read_bytes()).decode()
GRAD = "linear-gradient(115deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)"
HEADER = f'''<div style="width:100%;padding:0 20mm;font-family:Carlito,Calibri,sans-serif;-webkit-print-color-adjust:exact">
<div style="display:flex;align-items:center;justify-content:space-between;height:15mm"><img src="data:image/png;base64,{logo64}" style="height:13mm">
<div style="text-align:right;font-size:8.5pt;color:#0260a6;line-height:1.25"><b style="font-size:10pt">WEEK-END ZONE WOMEN 2026</b><br>27 – 29 novembre 2026 · Zone 242, Sikècodji</div></div>
<div style="height:1.2mm;background:{GRAD};border-radius:1mm"></div></div>'''
FOOTER = f'''<div style="width:100%;padding:0 20mm;font-family:Carlito,Calibri,sans-serif;font-size:8pt;color:#333;-webkit-print-color-adjust:exact">
<div style="height:1.2mm;background:{GRAD};border-radius:1mm;margin-bottom:2mm"></div>
<div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="line-height:1.35"><b style="color:#0260a6">MILMO – Zone 242</b> · Sikècodji, rue de Golf FM, Cotonou<br>contact.zone242@gmail.com · 01 41 62 77 77 · #ZoneWoman</div>
<div style="text-align:right;color:#0260a6"><b>Page <span class="pageNumber"></span> / <span class="totalPages"></span></b></div></div></div>'''
files = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"]); pg = b.new_page()
    for name, keys, slug in PEOPLE:
        if ONLY and slug != ONLY: continue
        h = OUT / f"{slug}.html"; h.write_text(letter(name, keys))
        pg.goto("file://" + str(h)); pg.wait_for_timeout(300)
        f = OUT / f"Courrier_Week-end_Zone_Women_2026_{slug}.pdf"
        pg.pdf(path=str(f), format="A4", margin=dict(top="26mm", bottom="22mm", left="20mm", right="20mm"), display_header_footer=True,
               header_template=HEADER, footer_template=FOOTER, print_background=True); files.append(f); h.unlink()
    b.close()
for f in files: print(f.name)
