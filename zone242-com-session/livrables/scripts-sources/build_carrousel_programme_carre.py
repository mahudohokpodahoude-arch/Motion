# Carrousel « Programme » 1080×1080 (8 diapos), programme « Organisation WZW 2026 », 27-29 novembre 2026.
# Usage : python build_carrousel_programme_carre.py <dossier_assets> <dossier_sortie>
#   assets : f/ (bebas-neue-latin-400, montserrat-latin-600 et 800 .woff2), logos_alpha.png, titre_alpha3.png
import sys, pathlib
from playwright.sync_api import sync_playwright
A = pathlib.Path(sys.argv[1]).resolve(); O = pathlib.Path(sys.argv[2]).resolve(); O.mkdir(parents=True, exist_ok=True)
CSS = """
@font-face{font-family:B;src:url(f/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:M;font-weight:600;src:url(f/montserrat-latin-600-normal.woff2)}
@font-face{font-family:M;font-weight:800;src:url(f/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;font-family:B;color:#fff;
 background:linear-gradient(115deg,#ee1a02 0%,#f12e04 38%,#f5541a 72%,#fb7a2a 100%)}
.sh{position:absolute;inset:0}
.s1{background:#ff7a33;opacity:.20;clip-path:polygon(0 0,18% 0,7% 100%,0 100%)}
.s2{background:#b80f00;opacity:.20;clip-path:polygon(32% 0,43% 0,26% 100%,15% 100%)}
.s3{background:#ff9a4a;opacity:.16;clip-path:polygon(68% 0,79% 0,66% 100%,55% 100%)}
.s4{background:#c01200;opacity:.18;clip-path:polygon(88% 0,100% 0,100% 100%,78% 100%)}
.head{position:absolute;left:60px;top:48px;right:60px}
.day{display:inline-block;background:#fff;color:#d8300a;font-size:46px;letter-spacing:.06em;padding:8px 24px 4px;border-radius:6px}
.sub{font-family:M;font-weight:800;font-size:25px;letter-spacing:.02em;margin-top:14px;color:#ffe9d8}
.rows{position:absolute;left:60px;right:60px;top:178px;bottom:118px;display:flex;flex-direction:column;justify-content:center;gap:16px}
.row{display:flex;gap:18px;align-items:stretch;flex:none}
.t{flex:none;width:236px;background:#0260a6;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:M;font-weight:800;font-size:33px;white-space:nowrap;box-shadow:0 8px 20px rgba(60,0,0,.25);text-align:center;line-height:1.1}
.c{flex:1;background:rgba(255,255,255,.14);border-left:8px solid #fff;border-radius:6px;padding:14px 24px 10px;display:flex;flex-direction:column;justify-content:center}
.c b{font-weight:400;font-size:56px;line-height:1.02;letter-spacing:.02em}
.c .who{font-family:M;font-weight:600;font-size:26px;line-height:1.3;margin-top:8px;color:#ffe9d8}
.c .tag{font-family:M;font-weight:800;font-size:20px;letter-spacing:.12em;color:#ffd7b8;margin-bottom:4px}
.pause .c{background:rgba(255,255,255,.07);border-left-color:rgba(255,255,255,.5);padding:8px 24px 4px}
.pause .c b{font-size:38px;opacity:.85}.pause .t{background:rgba(2,96,166,.65);font-size:27px}
.sm .c b{font-size:44px}.sm .t{font-size:30px}
.lg .row{min-height:190px}.lg .c b{font-size:70px}.lg .c .who{font-size:30px}.lg .t{font-size:31px}
.foot{position:absolute;left:60px;right:60px;bottom:30px;display:flex;align-items:center;justify-content:space-between;font-size:26px;letter-spacing:.08em}
.foot img{width:56px;height:56px;margin-right:16px}.foot .l{display:flex;align-items:center}
.foot .r{font-family:M;font-weight:600;font-size:22px;letter-spacing:.04em}
"""
N = 8
BG = '<div class=sh></div><div class="sh s1"></div><div class="sh s2"></div><div class="sh s3"></div><div class="sh s4"></div>'
def foot(n, txt="WEEK-END ZONE WOMEN · RESTAURÉE · OINTE · ENVOYÉE"):
    return f'<div class=foot><div class=l><img src=logos_alpha.png>{txt}</div><div class=r>{n} / {N}</div></div>'
def row(t, title, who="", tag="", cls=""):
    return f'<div class="row {cls}"><div class=t>{t}</div><div class=c>{f"<div class=tag>{tag}</div>" if tag else ""}<b>{title}</b>{f"<div class=who>{who}</div>" if who else ""}</div></div>'
def page(n, day, sub, rows, cls=""):
    return f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{BG}<div class=head><span class=day>{day}</span><div class=sub>{sub}</div></div><div class='rows {cls}'>{rows}</div>{foot(n)}"
S = []
S.append(f"""<!doctype html><meta charset=utf-8><style>{CSS}
.glow{{position:absolute;left:40px;top:60px;width:1000px;height:640px;background:radial-gradient(closest-side,rgba(255,170,110,.6),rgba(255,170,110,0))}}
#ti{{position:absolute;left:130px;top:80px;width:820px;filter:drop-shadow(0 0 14px rgba(255,255,255,.7)) drop-shadow(0 0 40px rgba(255,255,255,.3))}}
.bot{{position:absolute;left:0;right:0;top:510px;text-align:center}}
.bot .p{{font-size:104px;line-height:.9;letter-spacing:.05em;text-shadow:0 6px 20px rgba(120,10,0,.35)}}
.bot .d{{font-size:62px;line-height:1.02;margin-top:16px;letter-spacing:.03em}}.bot .d span{{color:#0260a6;font-size:92px}}
.bot .th{{display:inline-block;margin-top:22px;background:rgba(255,255,255,.16);border-left:8px solid #fff;border-radius:6px;padding:12px 26px 6px;font-size:42px;letter-spacing:.04em}}
.bot .q{{font-family:M;font-weight:600;font-size:24px;margin-top:16px;color:#ffe9d8}}
.bot .lieu{{margin-top:14px;font-size:46px;letter-spacing:.03em}}
</style>{BG}<div class=glow></div><img id=ti src=titre_alpha3.png>
<div class=bot><div class=p>PROGRAMME</div><div class=d>DU VEN. <span>27</span> AU DIM. <span>29</span> NOVEMBRE 2026</div>
<div class=th>THÈME : RESTAURÉE · OINTE · ENVOYÉE</div><div class=q>« Les femmes prennent le contrôle de la Zone »</div><div class=lieu>ZONE 242 – SIKECODJI</div></div>
{foot(1,"MISSION INTERNATIONALE LUMIÈRE DU MONDE")}""")
S.append(page(2, "VENDREDI 27 NOVEMBRE", "Soirée de lancement",
  row("19h45", "Lancement", "Avec la Prophétesse Mary Favour TONGSI", "SOIRÉE DE LANCEMENT", "lg")
  + '<div class=row style="min-height:230px"><div class=c style="border-left-color:#0260a6;background:rgba(2,96,166,.3)"><b style="font-size:70px;line-height:1.05">VENEZ AVEC UNE AMIE</b><div class=who style="font-size:32px">Un week-end ouvert à toutes les femmes</div></div></div>', "lg"))
S.append(page(3, "SAMEDI 28 NOVEMBRE", "Women's Experience Day · Le matin",
  row("9h00 – 9h30", "Accueil et petit-déjeuner", cls="sm") + row("9h30 – 10h15", "Séance de relaxation", "Respiration, étirements, détente du corps et de l'esprit", cls="sm")
  + row("10h15 – 10h30", "Louange", cls="sm")
  + row("10h30 – 11h30", "Guérir des traumatismes émotionnels", "Pasteure Anne-Laure · Prophétesse Pélagie · Évangéliste Jessie Vanessa · Pasteure Veronica", "PANEL 1 · RESTAURÉE · GRANDE SALLE")))
S.append(page(4, "SAMEDI 28 NOVEMBRE", "Women's Experience Day · Midi",
  row("11h30 – 12h00", "Pause", cls="pause")
  + row("12h00 – 13h00", "Belle et en bonne santé", "Dr Sylvie, médecin généraliste · Dr Majolaine, cosmétologue", "RESTAURÉE · GRANDE SALLE")
  + row("13h00 – 14h00", "Déjeuner et Zone Détente", "Salon de thé · massages (inscription à l'accueil) · beauté et bien-être · coin photo")))
S.append(page(5, "SAMEDI 28 NOVEMBRE", "Women's Experience Day · L'après-midi (1/2)",
  row("14h00 – 14h45", "Me voici, envoie-moi !", "Prophétesse Manne · Dr Hestia DAOUDOU · Leader Richmelle", "PANEL 2 · OINTE · GRANDE SALLE")
  + row("14h45 – 15h00", "Pause", cls="pause")
  + row("15h00 – 15h45", "Femme, foi et finances", "Pasteure Espérance · Leader Huldah · Prophétesse Pélagie", "PANEL 3 · OINTE · GRANDE SALLE")
  + row("15h45 – 16h00", "Pause", cls="pause")))
S.append(page(6, "SAMEDI 28 NOVEMBRE", "Women's Experience Day · L'après-midi (2/2)",
  row("16h00 – 17h00", "Ma maison, ma mission", "Madame Tossou · Dr Hestia DAOUDOU · Prophétesse Pélagie", "PANEL 4 · ENVOYÉE · GRANDE SALLE")
  + row("17h00 – 17h15", "Pause", cls="pause")
  + row("17h15 – 18h15", "Les conversations que les femmes n'osent pas avoir", "Animation : Imalia et Pasteure Murielle · avec toutes les panélistes", "GRANDE TABLE RONDE · SANS TABOU")))
S.append(page(7, "DIMANCHE 29 NOVEMBRE", "Clôture et envoi",
  row("8h45", "Grand culte de clôture", "Avec la Prophétesse Mary Favour TONGSI", "CLÔTURE", "lg")
  + row("11h30 – 14h00", "L'Agapè des Femmes", "Brunch convivial · témoignages du week-end · petits prix humoristiques · photo de groupe · prière d'envoi", "ENVOYÉE", "lg"), "lg"))
S.append(f"""<!doctype html><meta charset=utf-8><style>{CSS}
.mid{{position:absolute;left:0;right:0;top:80px;text-align:center}}
.mid .a{{font-size:100px;letter-spacing:.04em;text-shadow:0 6px 20px rgba(120,10,0,.35)}}
.mid .b{{font-size:44px;letter-spacing:.05em;margin-top:6px}}
.mid .q{{font-family:M;font-weight:600;font-size:24px;margin-top:14px;color:#ffe9d8}}
.box{{position:absolute;left:110px;right:110px;top:400px;background:rgba(2,96,166,.55);border-radius:14px;padding:30px 36px 24px;font-size:50px;line-height:1.08;letter-spacing:.03em;text-align:center}}
.box .c2{{font-family:M;font-weight:600;font-size:28px;margin-top:14px;line-height:1.5}}
.pl{{position:absolute;left:0;right:0;top:760px;text-align:center;font-size:54px;letter-spacing:.05em}}.pl b{{font-weight:400;background:#fff;color:#d8300a;padding:6px 22px 0;border-radius:6px;margin:0 6px}}
.pl div{{font-family:M;font-weight:800;font-size:23px;margin-top:20px;padding:0 70px;letter-spacing:.02em;color:#ffe9d8}}
</style>{BG}
<div class=mid><div class=a>WEEK-END ZONE WOMEN</div><div class=b>RESTAURÉE · OINTE · ENVOYÉE</div><div class=q>« Les femmes prennent le contrôle de la Zone »</div></div>
<div class=box>ZONE 242 – SIKECODJI · RUE DE GOLF FM, COTONOU<div class=c2>Du vendredi 27 au dimanche 29 novembre 2026<br>contact.zone242@gmail.com · 01 41 62 77 77</div></div>
<div class=pl><b>PARTICIPATION GRATUITE</b><b>150 PLACES</b><div>Inscription obligatoire · invite une amie : le week-end est ouvert à toutes les femmes</div></div>
{foot(8,"MISSION INTERNATIONALE LUMIÈRE DU MONDE")}""")
out = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page()
    for i, h in enumerate(S, 1):
        f = A / f"s{i}.html"; f.write_text(h)
        pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        ov = pg.evaluate("(()=>{const r=document.querySelector('.rows');if(!r)return 0;const a=r.getBoundingClientRect();let m=0;r.querySelectorAll('.row').forEach(e=>{const b=e.getBoundingClientRect();m=Math.max(m,b.bottom-a.bottom,a.top-b.top)});return Math.round(m)})()")
        o = O / f"Programme_WZW_carre_{i:02d}.png"; pg.screenshot(path=str(o)); out.append(o); print(i, "débordement", ov)
    b.close()
