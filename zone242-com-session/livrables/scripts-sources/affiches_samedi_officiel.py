# Affiches du samedi (6 sessions) dans la construction de l'affiche officielle : bande de visages, ligne de titres et prénoms, logo, date, adresse.
# Usage : python affiches_samedi_officiel.py <dossier_sortie>
import pathlib, sys, shutil, subprocess
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); HERE = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("presentation-dr-hestia/assets/logos_alpha.png", "logos.png"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
for p in ["anne", "pelagie", "jessie", "veronica", "sylvie", "marjolaine", "manne", "hestia", "richmelle", "esperance", "huldah", "tossou"]:
    subprocess.run([sys.executable, str(HERE / "nettoyer_detourage.py"), str(R / f"annonce-wzw-reference/assets/photos/{p}.png"), str(T / f"{p}.png"), "2"], check=True, capture_output=True)
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}.lock{filter:drop-shadow(0 0 18px rgba(255,255,255,.6))}
.ph{position:absolute;filter:drop-shadow(0 8px 18px rgba(70,0,0,.35))}
.nm{text-align:center;line-height:1}.nm small{display:block;font-size:19px;letter-spacing:.02em;margin-bottom:3px}.nm b{display:block;font-weight:400;font-size:34px;letter-spacing:.02em}
.lab{background:#0b2a5c;color:#fff;font-family:M;font-weight:800;letter-spacing:.08em;display:inline-block}"""
BG = ('<img class="a" src="w1.png" style="left:-140px;top:420px;height:900px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:560px;top:380px;height:800px;opacity:.07;filter:brightness(2)">'
      '<div class="a" style="inset:0;background:#b80f00;opacity:.12;clip-path:polygon(0 0,16% 0,4% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(80% 0,100% 0,100% 100%,64% 100%)"></div>')
def faces(ppl, BH, W, rows=1):
    n = len(ppl); h = ""
    if rows == 1:
        for i, (pid, *_ ) in enumerate(ppl):
            cx = (i + .5) * 1080 / n; z = 100 - abs(i - (n - 1) / 2) * 10
            h += f'<img class="ph" src="{pid}.png" style="left:{cx - W / 2:.0f}px;top:6px;width:{W}px;z-index:{int(z)}">'
    else:
        half = n // 2
        for r, grp in enumerate((ppl[:half], ppl[half:])):
            m = len(grp)
            for i, (pid, *_ ) in enumerate(grp):
                cx = (i + .5) * 1080 / m + (0 if r == 0 else 0); z = (20 if r == 0 else 60) + int(-abs(i - (m - 1) / 2) * 3)
                h += f'<img class="ph" src="{pid}.png" style="left:{cx - W / 2:.0f}px;top:{6 if r == 0 else 200}px;width:{W}px;z-index:{z}">'
    return f'<div class="a" style="left:0;top:0;width:1080px;height:{BH}px;overflow:hidden;box-shadow:0 10px 30px rgba(80,0,0,.35)">{h}</div>'
def names(ppl, top, rows=1):
    n = len(ppl); out = ""
    groups = [ppl] if rows == 1 else [ppl[:n // 2], ppl[n // 2:]]
    for r, grp in enumerate(groups):
        m = len(grp); w = 1080 / m
        for i, (_, t, nm) in enumerate(grp):
            fs, ts = (34, 19) if rows == 1 else (26, 15)
            out += f'<div class="a nm" style="left:{i * w:.0f}px;top:{top + r * 64}px;width:{w:.0f}px"><small style="font-size:{ts}px">{t}</small><b style="font-size:{fs}px">{nm}</b></div>'
    return out
def bottom(label, title, tfs, time, extra=""):
    h = f'<img class="a lock" src="lockup.png" style="left:56px;top:{TOP2}px;width:330px">'
    h += f'<div class="a" style="left:430px;top:{TOP2 + 6}px"><span class="lab" style="font-size:20px;padding:7px 18px">{label}</span></div>'
    h += f'<div class="a" style="left:430px;top:{TOP2 + 48}px;font-size:{tfs}px;line-height:.92;letter-spacing:.01em;text-shadow:0 6px 20px rgba(110,10,0,.35);width:620px">{title}</div>'
    h += f'<div class="a" style="left:56px;top:{TOP3}px;font-size:176px;line-height:.82;text-shadow:0 8px 28px rgba(110,10,0,.35)">{time}</div>'
    h += f'<div class="a" style="left:56px;top:{TOP3 + 170}px;font-size:36px;line-height:1;letter-spacing:.05em">SAMEDI</div><div class="a" style="left:54px;top:{TOP3 + 204}px;font-size:100px;line-height:.82;color:#0260a6">28</div><div class="a" style="left:176px;top:{TOP3 + 214}px;font-size:36px;line-height:1.02;letter-spacing:.04em">NOVEMBRE<br>2026</div>'
    h += '<div class="a" style="left:560px;top:@@px;width:470px;height:150px;background:linear-gradient(180deg,rgba(2,96,166,0),rgba(2,96,166,.92));clip-path:polygon(0 0,100% 8%,96% 100%,4% 92%)"></div>'.replace("@@", str(TOP3 + 150))
    h += '<div class="a" style="left:600px;top:@@px;font-size:34px;line-height:1.15;letter-spacing:.02em">ZONE 242 - SIKECODJI<br>RUE DE GOLF.FM<br><span style="font-family:M;font-weight:600;font-size:17px;letter-spacing:.02em">contact.zone242@gmail.com · 01 41 62 77 77</span><br><span style="font-family:M;font-weight:600;font-size:17px;letter-spacing:.02em">Gratuit · 150 places · inscription obligatoire</span></div>'.replace("@@", str(TOP3 + 160))
    return h + extra
PAGES = {}
def page(name, ppl, label, title, tfs, time, BH, W, rows=1, nrows=1, extra=""):
    global TOP2, TOP3
    ns = BH + 14; nh = 74 if nrows == 1 else 130
    TOP2 = ns + nh + 12; TOP3 = TOP2 + 230
    PAGES[name] = BG + faces(ppl, BH, W, rows) + names(ppl, ns, nrows) + bottom(label, title, tfs, time, extra.replace("@@", str(TOP2 + 148)))
TOP2 = TOP3 = 0
P = lambda pid, t, nm: (pid, t, nm)
page("p1", [P("pelagie", "PROPHÉTESSE", "PÉLAGIE"), P("anne", "PASTEURE", "ANNE-LAURE"), P("jessie", "ÉVANGÉLISTE", "JESSIE"), P("veronica", "PASTEURE", "VERONICA")], "PANEL 1", "GUÉRIR DES TRAUMATISMES<br>ÉMOTIONNELS", 70, "10H30", 380, 470)
page("sante", [P("sylvie", "DR · MÉDECIN GÉNÉRALISTE", "SYLVIE"), P("marjolaine", "DR · COSMÉTOLOGUE", "MARJOLAINE")], "SESSION SANTÉ", "BELLE ET EN<br>BONNE SANTÉ", 80, "12H00", 400, 560)
page("p2", [P("manne", "SERVANTE", "MANNE"), P("hestia", "DR", "HESTIA"), P("richmelle", "LEADER", "RICHMELLE")], "PANEL 2", "ME VOICI,<br>ENVOIE-MOI !", 80, "14H00", 390, 520)
page("p3", [P("esperance", "PASTEURE", "ESPÉRANCE"), P("huldah", "LEADER", "HULDAH"), P("pelagie", "PROPHÉTESSE", "PÉLAGIE")], "PANEL 3", "FEMME, FOI<br>ET FINANCES", 80, "15H00", 390, 520)
page("p4", [P("tossou", "MADAME", "TOSSOU"), P("hestia", "DR", "HESTIA"), P("pelagie", "PROPHÉTESSE", "PÉLAGIE")], "PANEL 4", "MA MAISON,<br>MA MISSION", 80, "16H00", 390, 520)
allp = [P("veronica", "PASTEURE", "VERONICA"), P("anne", "PASTEURE", "ANNE-LAURE"), P("jessie", "ÉVANGÉLISTE", "JESSIE"), P("pelagie", "PROPHÉTESSE", "PÉLAGIE"), P("sylvie", "DR", "SYLVIE"), P("marjolaine", "DR", "MARJOLAINE"),
        P("manne", "SERVANTE", "MANNE"), P("hestia", "DR", "HESTIA"), P("richmelle", "LEADER", "RICHMELLE"), P("esperance", "PASTEURE", "ESPÉRANCE"), P("huldah", "LEADER", "HULDAH"), P("tossou", "MADAME", "TOSSOU")]
page("table_ronde", allp, "GRANDE TABLE RONDE", "LES CONVERSATIONS QUE LES FEMMES<br>N'OSENT PAS AVOIR", 50, "17H15", 330, 260, rows=2, nrows=2,
     extra='<div class="a" style="left:430px;top:@@px;font-family:M;font-weight:800;font-size:16px;letter-spacing:.05em;color:#ffe3cf;line-height:1.4;width:620px;white-space:nowrap">ANIMATION : IMALIA ET PASTEURE MURIELLE<br>SANS TABOU · QUESTIONS ANONYMES</div>')
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for k, body in PAGES.items():
        f = T / f"{k}.html"; f.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}")
        pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"Affiche_Samedi_{k}_WZW_1080x1080.png"))
    b.close()
shutil.rmtree(T); print("ok")
