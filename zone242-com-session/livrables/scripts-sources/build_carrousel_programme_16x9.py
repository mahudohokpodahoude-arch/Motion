import pathlib
from playwright.sync_api import sync_playwright
H = pathlib.Path(__file__).resolve().parent
CSS = """
@font-face{font-family:B;src:url(f/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:M;font-weight:600;src:url(f/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;position:relative;font-family:B;color:#fff;
 background:linear-gradient(115deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)}
.sh{position:absolute;inset:0}
.s1{background:#ff7a33;opacity:.20;clip-path:polygon(0 0,16% 0,6% 100%,0 100%)}
.s2{background:#b80f00;opacity:.20;clip-path:polygon(30% 0,40% 0,24% 100%,14% 100%)}
.s3{background:#ff9a4a;opacity:.16;clip-path:polygon(66% 0,76% 0,64% 100%,54% 100%)}
.s4{background:#c01200;opacity:.18;clip-path:polygon(86% 0,100% 0,100% 100%,76% 100%)}
.head{position:absolute;left:90px;top:60px;right:90px}
.day{display:inline-block;background:#fff;color:#d8300a;font-size:44px;letter-spacing:.06em;padding:8px 26px 4px;border-radius:6px}
.sub{font-size:40px;letter-spacing:.05em;margin-top:14px;opacity:.95;text-shadow:0 2px 8px rgba(120,10,0,.3)}
.rows{position:absolute;left:90px;right:90px;top:200px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:16px}
.xl .row{min-height:250px}.xl{gap:34px}.xl .t{width:470px;font-size:76px}.xl .c{padding:22px 44px 16px}.xl .c b{font-size:98px}.xl .c .who{font-size:46px;margin-top:12px}.xl .c .tag{font-size:30px}
.lg{gap:26px}.lg .row{min-height:200px}.lg .t{width:400px;font-size:58px}.lg .c b{font-size:78px}.lg .c .who{font-size:38px}.lg .c .tag{font-size:26px}.lg .pause .c b{font-size:58px}.lg .pause .t{font-size:46px}
.md{gap:20px}.md .t{font-size:50px;width:360px}.md .c b{font-size:70px}.md .c .who{font-size:33px}
.row{display:flex;gap:26px;align-items:stretch}
.t{flex:none;width:330px;background:#0260a6;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:M;font-weight:800;font-size:44px;letter-spacing:0;white-space:nowrap;box-shadow:0 8px 20px rgba(60,0,0,.25)}
.c{flex:1;background:rgba(255,255,255,.14);border-left:8px solid #fff;border-radius:6px;padding:16px 30px 12px;display:flex;flex-direction:column;justify-content:center}
.c b{font-weight:400;font-size:62px;line-height:1;letter-spacing:.02em}
.c .who{font-family:M;font-weight:600;font-size:30px;line-height:1.3;margin-top:8px;color:#ffe9d8}
.c .tag{font-family:M;font-weight:800;font-size:22px;letter-spacing:.14em;color:#ffd7b8;margin-bottom:4px}
.pause .c{background:rgba(255,255,255,.07);border-left-color:rgba(255,255,255,.5)}
.pause .c b{font-size:46px;opacity:.85}.pause .t{background:rgba(2,96,166,.65);font-size:36px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1}.two .c{border-left-width:8px}
.foot{position:absolute;left:90px;right:90px;bottom:34px;display:flex;align-items:center;justify-content:space-between;font-size:30px;letter-spacing:.08em}
.foot img{width:66px;height:66px;margin-right:22px}.foot .l{display:flex;align-items:center}
.foot .r{font-family:M;font-weight:600;font-size:22px;letter-spacing:.04em}
"""
def row(t, title, who="", tag="", cls=""):
    return f'<div class="row {cls}"><div class=t>{t}</div><div class=c>{f"<div class=tag>{tag}</div>" if tag else ""}<b>{title}</b>{f"<div class=who>{who}</div>" if who else ""}</div></div>'
def two(items):
    return '<div class=two>' + "".join(f'<div class=c><div class=tag>{tag}</div><b>{title}</b><div class=who>{who}</div></div>' for tag, title, who in items) + '</div>'
def page(n, N, day, sub, rows_html, size=''):
    return f"""<!doctype html><meta charset=utf-8><style>{CSS}</style>
<div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div>
<div class=head><span class=day>{day}</span><div class=sub>{sub}</div></div>
<div class='rows {size}'>{rows_html}</div>
<div class=foot><div class=l><img src=logos_alpha.png>WEEK-END ZONE WOMEN · RESTAURÉE · OINTE · ENVOYÉE</div><div class=r>{n} / {N}</div></div>"""
N = 8
slides = []
# 1 couverture
slides.append(f"""<!doctype html><meta charset=utf-8><style>{CSS}
.glow{{position:absolute;left:60px;top:80px;width:1000px;height:760px;background:radial-gradient(closest-side,rgba(255,170,110,.6),rgba(255,170,110,0))}}
#ti{{position:absolute;left:100px;top:250px;width:900px;filter:drop-shadow(0 0 16px rgba(255,255,255,.7)) drop-shadow(0 0 44px rgba(255,255,255,.3))}}
.right{{position:absolute;left:1080px;top:200px;right:70px}}
.right .p{{font-size:150px;line-height:.9;letter-spacing:.04em;text-shadow:0 6px 20px rgba(120,10,0,.35)}}
.right .d{{font-size:72px;line-height:1.02;margin-top:30px;letter-spacing:.03em}}.right .d span{{color:#0260a6;font-size:120px}}
.right .th{{margin-top:40px;background:rgba(255,255,255,.16);border-left:8px solid #fff;border-radius:6px;padding:16px 26px 10px;font-size:52px;letter-spacing:.04em;line-height:1.1}}
.right .q{{font-family:M;font-weight:600;font-size:30px;margin-top:24px;color:#ffe9d8}}
.right .lieu{{margin-top:30px;font-size:62px;letter-spacing:.03em}}
</style><div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div><div class=glow></div>
<img id=ti src=titre_alpha3.png>
<div class=right><div class=p>PROGRAMME</div>
<div class=d>DU VEN. <span>20</span> AU DIM. <span>22</span><br>NOVEMBRE 2026</div>
<div class=th>THÈME : RESTAURÉE · OINTE · ENVOYÉE</div>
<div class=q>« Les femmes prennent le contrôle de la Zone »</div>
<div class=lieu>ZONE 242 – SIKECODJI</div></div>
<div class=foot><div class=l><img src=logos_alpha.png>MISSION INTERNATIONALE LUMIÈRE DU MONDE</div><div class=r>1 / {N}</div></div>""")
# 2 vendredi
slides.append(page(2, N, "VENDREDI 20 NOVEMBRE", "Soirée d'ouverture",
  row("19h45", "Grande soirée spirituelle", "Avec la Prophétesse Mary Favour TONGSI", "OUVERTURE")
  + '<div class=row style="min-height:200px"><div class=c style="border-left-color:#0260a6;background:rgba(2,96,166,.3)"><b style="font-size:84px">VENEZ AVEC UNE AMIE</b><div class=who style="font-size:46px">Un week-end pensé pour toutes les femmes</div></div></div>', 'xl'))
# 3 samedi matin
slides.append(page(3, N, "SAMEDI 21 NOVEMBRE", "Women's Experience Day · Le matin",
  row("9h00", "Petit-déjeuner convivial") + row("9h30 – 10h00", "Louange et méditation biblique")
  + row("10h00 – 11h00", "Guérir des traumatismes émotionnels", "Pasteure Anne-Laure · Prophétesse Pélagie · Évangéliste Jessie Vanees · Pasteur Veronica · Pasteure Murielle", "PANEL 1")
  + row("11h00 – 11h30", "Pause", cls="pause")
  + row("11h30 – 12h30", "Femme et l'appel", "Prophétesse Manne · Dr Hestia DAOUDOU", "PANEL 2"), 'md'))
# 4 samedi midi
slides.append(page(4, N, "SAMEDI 21 NOVEMBRE", "Women's Experience Day · Midi et début d'après-midi",
  row("12h30 – 14h00", "Déjeuner", "Zone Détente · Soins et conseil thérapeutique")
  + row("14h00 – 15h00", "Femme, foi et finances", "Pasteure Espérance · Leader Huldah · Prophétesse Pélagie", "PANEL 3")
  + row("15h00 – 15h30", "Pause", cls="pause"), 'lg'))
# 5 samedi apres-midi
slides.append(page(5, N, "SAMEDI 21 NOVEMBRE", "Women's Experience Day · L'après-midi",
  f'<div class=row style="height:350px"><div class=t>15h30 – 16h30</div>' + two([("GRANDE SALLE · PANEL 4", "La femme sage bâtit sa maison", "Mme Tossou · Dr Hestia DAOUDOU"), ("PETITE SALLE · ATELIER JEUNES FILLES", "Femme, tu n'es pas en retard !", "Leader Richmelle · Pasteure Murielle")]) + '</div>'
  + row("16h30 – 17h00", "Pause", cls="pause")
  + row("17h00 – 18h30", "Les conversations que les femmes n'osent pas avoir", "Animation : Imalia et l'équipe du MD", "GRANDE TABLE RONDE"), 'md'))
# 6 women's night
slides.append(f"""<!doctype html><meta charset=utf-8><style>{CSS}
.big{{position:absolute;left:90px;top:190px;right:90px}}
.big .tm{{display:inline-block;background:#0260a6;font-family:M;font-weight:800;font-size:78px;letter-spacing:0;padding:16px 42px 14px;border-radius:8px}}
.big .tt{{font-size:290px;line-height:.92;margin-top:26px;letter-spacing:.02em;text-shadow:0 8px 28px rgba(120,10,0,.35)}}
.big .it{{display:flex;gap:22px;margin-top:34px}}.big .it span{{background:rgba(255,255,255,.16);border:3px solid rgba(255,255,255,.7);border-radius:70px;padding:14px 48px 8px;font-size:78px;letter-spacing:.04em}}
.big .pl{{margin-top:48px;font-size:84px;letter-spacing:.04em}}.big .pl b{{font-weight:400;background:#fff;color:#d8300a;padding:6px 22px 0;border-radius:6px;margin-right:16px}}
</style><div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div>
<div class=head><span class=day>SAMEDI 21 NOVEMBRE</span><div class=sub>Women's Experience Day · La soirée</div></div>
<div class=big><span class=tm>19h30</span><div class=tt>WOMEN'S NIGHT</div>
<div class=it><span>BARBECUE</span><span>MUSIQUE</span><span>JEUX</span><span>TÉMOIGNAGES</span></div>
<div class=pl><b>150 PLACES</b></div></div>
<div class=foot><div class=l><img src=logos_alpha.png>WEEK-END ZONE WOMEN · RESTAURÉE · OINTE · ENVOYÉE</div><div class=r>6 / {N}</div></div>""")
# 7 dimanche
slides.append(page(7, N, "DIMANCHE 22 NOVEMBRE", "Clôture du week-end",
  row("8h45", "Grand culte de clôture", "Avec la Prophétesse Mary Favour TONGSI", "CLÔTURE")
  + '<div class=row style="min-height:300px"><div class=c style="border-left-color:#0260a6;background:rgba(2,96,166,.3)"><div class=tag>TOUT LE WEEK-END</div><b style="font-size:76px;line-height:1.08">Les femmes tiennent l\'accueil, la louange, l\'animation et l\'organisation.</b></div></div>', 'xl'))
# 8 fin
slides.append(f"""<!doctype html><meta charset=utf-8><style>{CSS}
.mid{{position:absolute;left:0;right:0;top:150px;text-align:center}}
.mid .a{{font-size:120px;letter-spacing:.04em;text-shadow:0 6px 20px rgba(120,10,0,.35)}}
.mid .b{{font-size:60px;letter-spacing:.05em;margin-top:8px}}
.mid .q{{font-family:M;font-weight:600;font-size:30px;margin-top:20px;color:#ffe9d8}}
.box{{position:absolute;left:380px;right:380px;top:520px;background:rgba(2,96,166,.55);border-radius:14px;padding:34px 50px 26px;font-size:62px;line-height:1.08;letter-spacing:.03em}}
.box .c2{{font-family:M;font-weight:600;font-size:34px;margin-top:14px;line-height:1.5}}
.inv{{position:absolute;left:0;right:0;top:880px;text-align:center;font-size:56px;letter-spacing:.06em}}.inv b{{font-weight:400;background:#fff;color:#d8300a;padding:6px 26px 0;border-radius:6px}}
</style><div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div>
<div class=mid><div class=a>WEEK-END ZONE WOMEN</div><div class=b>THÈME : RESTAURÉE · OINTE · ENVOYÉE</div><div class=q>« Les femmes prennent le contrôle de la Zone »</div></div>
<div class=box>ZONE 242 – SIKECODJI · RUE DE GOLF.FM<div class=c2>Du vendredi 20 au dimanche 22 novembre 2026<br>contact.zone242@gmail.com · 0141627777</div></div>
<div class=inv><b>INVITE UNE AMIE</b></div>
<div class=foot><div class=l><img src=logos_alpha.png>MISSION INTERNATIONALE LUMIÈRE DU MONDE</div><div class=r>8 / {N}</div></div>""")
out = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1920, "height": 1080}).new_page()
    for i, h in enumerate(slides, 1):
        f = H / f"s{i}.html"; f.write_text(h)
        pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        o = H / f"Programme_WZW_{i:02d}.png"; pg.screenshot(path=str(o)); out.append(o)
    b.close()
print(len(out))
