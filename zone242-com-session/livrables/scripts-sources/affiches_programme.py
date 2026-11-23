# Affiches du dimanche (culte + Agapè) et des 6 sessions du samedi, style « variante B » (carré 1080×1080).
# Usage : python affiches_programme.py <dossier_sortie>
import pathlib, sys, shutil, subprocess
from playwright.sync_api import sync_playwright
R = pathlib.Path("/home/user/Motion"); HERE = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1]).resolve(); OUT.mkdir(parents=True, exist_ok=True)
T = OUT / "_res"; T.mkdir(exist_ok=True)
for src, n in [("teaser-wzw-reels/assets/montserrat-latin-600-normal.woff2", "m6.woff2"), ("teaser-wzw-reels/assets/montserrat-latin-800-normal.woff2", "m8.woff2"), ("teaser-wzw-reels/assets/bebas-neue-latin-400-normal.woff2", "bb.woff2"),
               ("un-mot-une-session-reels/assets/lockup.png", "lockup.png"), ("presentation-dr-hestia/assets/logos_alpha.png", "logos.png"), ("teaser-wzw-reels/assets/W1.png", "w1.png"), ("teaser-wzw-reels/assets/W2.png", "w2.png")]:
    shutil.copy(R / src, T / n)
shutil.copy(HERE / "mary_net.png", T / "mary.png")
PH = ["anne", "pelagie", "jessie", "veronica", "sylvie", "marjolaine", "manne", "hestia", "richmelle", "esperance", "huldah", "tossou"]
for p in PH:
    subprocess.run([sys.executable, str(HERE / "nettoyer_detourage.py"), str(R / f"annonce-wzw-reference/assets/photos/{p}.png"), str(T / f"{p}.png"), "2"], check=True, capture_output=True)
CSS = """@font-face{font-family:B;src:url(bb.woff2)}@font-face{font-family:M;font-weight:600;src:url(m6.woff2)}@font-face{font-family:M;font-weight:800;src:url(m8.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:B;color:#fff;background:linear-gradient(150deg,#ee1a02 0%,#f12e04 36%,#f5541a 74%,#fb7a2a 100%)}
.a{position:absolute}.lock{filter:drop-shadow(0 0 16px rgba(255,255,255,.55))}.mary{filter:drop-shadow(0 18px 34px rgba(70,0,0,.4))}
.lab{background:#0b2a5c;color:#fff;font-family:M;font-weight:800;letter-spacing:.08em;display:inline-block}.ft{font-family:M;font-weight:800;color:#ffe3cf;letter-spacing:.07em}
.av{border-radius:50%;border:6px solid #fff;background:#fb7a2a;overflow:hidden;box-shadow:0 14px 30px rgba(80,0,0,.35)}.av img{width:100%;height:185%;object-fit:cover;object-position:50% 0;display:block}
.nm{font-family:M;font-weight:800;text-align:center;line-height:1.2;color:#fff;text-shadow:0 2px 8px rgba(80,0,0,.5)}.nm small{display:block;font-size:14px;letter-spacing:.14em;color:#ffe3cf;font-weight:800}"""
BG = ('<div class="a" style="inset:0;background:radial-gradient(ellipse at 62% 40%,rgba(255,170,110,.8),rgba(255,170,110,0) 58%)"></div>'
      '<img class="a" src="w1.png" style="left:-140px;top:300px;height:900px;opacity:.07;filter:brightness(2)"><img class="a" src="w2.png" style="left:600px;top:-120px;height:820px;opacity:.07;filter:brightness(2)">'
      '<div class="a" style="inset:0;background:#b80f00;opacity:.14;clip-path:polygon(0 0,18% 0,6% 100%,0 100%)"></div><div class="a" style="inset:0;background:#ff9a4a;opacity:.14;clip-path:polygon(78% 0,100% 0,100% 100%,62% 100%)"></div>')
LOGOS = '<img class="a" src="logos.png" style="left:40px;top:36px;width:104px">'
FOOT = '<div class="a ft" style="left:64px;top:984px;width:420px;font-size:15px;line-height:1.5;font-weight:600">ZONE 242 – SIKÈCODJI · RUE DE GOLF FM<br>GRATUIT · 150 PLACES · INSCRIPTION OBLIGATOIRE</div>'
def MASK(h): return f"-webkit-mask-image:linear-gradient(180deg,#000 {h}%,transparent 100%);mask-image:linear-gradient(180deg,#000 {h}%,transparent 100%)"
def left(label, title_lines, tfs, time, day_txt, extra=""):
    n = len(title_lines); ttop = 400; tb = ttop + int(n * tfs * .92) + 12
    h = f'<img class="a lock" src="lockup.png" style="left:64px;top:150px;width:360px">'
    h += f'<div class="a" style="left:64px;top:350px"><span class="lab" style="font-size:20px;padding:7px 18px">{label}</span></div>'
    h += f'<div class="a" style="left:64px;top:{ttop}px;font-size:{tfs}px;line-height:.92;letter-spacing:.01em;text-shadow:0 6px 22px rgba(110,10,0,.35);width:470px">{"<br>".join(title_lines)}</div>'
    h += f'<div class="a" style="left:64px;top:{tb}px;font-size:170px;line-height:.82;text-shadow:0 8px 30px rgba(110,10,0,.35)">{time}</div>'
    bt = tb + 150
    h += f'<div class="a" style="left:64px;top:{bt}px;width:400px;height:128px;background:#0260a6;clip-path:polygon(0 0,100% 6%,100% 100%,0 94%)"></div>'
    h += f'<div class="a" style="left:92px;top:{bt + 14}px;font-size:38px;line-height:1;letter-spacing:.06em">{day_txt[0]}</div><div class="a" style="left:90px;top:{bt + 46}px;font-size:84px;line-height:.9">{day_txt[1]}</div>'
    return h + extra
def portraits(people, big=False):
    n = len(people)
    if n == 12: d = 150; cols = 3; gx, gy = 22, 56
    elif n == 2: d = 300; cols = 1; gx, gy = 0, 58
    elif n == 3: d = 250; cols = 2; gx, gy = 30, 62
    else: d = 235; cols = 2; gx, gy = 30, 62
    rows = [people[i:i + cols] for i in range(0, n, cols)]
    rh = d + gy + (6 if n == 12 else 40); total = len(rows) * rh - gy
    y0 = (1080 - total) // 2 + 10; cx = 800; out = ""
    for ri, row in enumerate(rows):
        wrow = len(row) * d + (len(row) - 1) * gx; x0 = cx - wrow // 2
        for ci, (pid, t, nm) in enumerate(row):
            x = x0 + ci * (d + gx); y = y0 + ri * rh
            out += f'<div class="a av" style="left:{x}px;top:{y}px;width:{d}px;height:{d}px"><img src="{pid}.png"></div>'
            fs = 14 if n == 12 else 19
            out += f'<div class="a nm" style="left:{x - 24}px;top:{y + d + 6}px;width:{d + 48}px;font-size:{fs}px"><small>{t}</small>{nm}</div>'
    return out
SES = [
 ("p1", "PANEL 1", ["GUÉRIR DES", "TRAUMATISMES", "ÉMOTIONNELS"], 72, "10H30", [("anne", "PASTEURE", "ANNE-LAURE<br>JEUNE NOZIER"), ("pelagie", "PROPHÉTESSE", "PÉLAGIE<br>MANTANVI"), ("jessie", "ÉVANGÉLISTE", "JESSIE<br>VANESSA"), ("veronica", "PASTEURE", "VERONICA")]),
 ("sante", "SESSION SANTÉ", ["BELLE ET EN", "BONNE SANTÉ"], 84, "12H00", [("sylvie", "DR · MÉDECIN GÉNÉRALISTE", "SYLVIE"), ("marjolaine", "DR · COSMÉTOLOGUE", "MARJOLAINE")]),
 ("p2", "PANEL 2", ["ME VOICI,", "ENVOIE-MOI !"], 84, "14H00", [("manne", "SERVANTE", "MANNE"), ("hestia", "DR", "HESTIA<br>DAOUDOU"), ("richmelle", "LEADER", "RICHMELLE<br>OUSSA")]),
 ("p3", "PANEL 3", ["FEMME, FOI", "ET FINANCES"], 84, "15H00", [("esperance", "PASTEURE", "ESPÉRANCE<br>HOUEWATONOU"), ("huldah", "LEADER", "HULDAH<br>OROUNLA"), ("pelagie", "PROPHÉTESSE", "PÉLAGIE<br>MANTANVI")]),
 ("p4", "PANEL 4", ["MA MAISON,", "MA MISSION"], 84, "16H00", [("tossou", "MADAME", "TOSSOU"), ("hestia", "DR", "HESTIA<br>DAOUDOU"), ("pelagie", "PROPHÉTESSE", "PÉLAGIE<br>MANTANVI")]),
]
PAGES = {}
for key, lab, tl, fs, tm, ppl in SES:
    PAGES[f"Affiche_Samedi_{key}_WZW_1080x1080"] = BG + LOGOS + left(lab, tl, fs, tm, ("SAMEDI", "28 NOV.")) + portraits(ppl) + FOOT
allp = [("veronica", "PASTEURE", "VERONICA"), ("anne", "PASTEURE", "ANNE-LAURE"), ("jessie", "ÉVANGÉLISTE", "JESSIE"), ("pelagie", "PROPHÉTESSE", "PÉLAGIE"),
        ("sylvie", "DR", "SYLVIE"), ("marjolaine", "DR", "MARJOLAINE"), ("manne", "SERVANTE", "MANNE"), ("hestia", "DR", "HESTIA"),
        ("richmelle", "LEADER", "RICHMELLE"), ("esperance", "PASTEURE", "ESPÉRANCE"), ("huldah", "LEADER", "HULDAH"), ("tossou", "MADAME", "TOSSOU")]
tr_extra = '<div class="a ft" style="left:64px;top:858px;font-size:17px;line-height:1.45;letter-spacing:.05em;width:430px">ANIMATION : IMALIA ET PASTEURE MURIELLE<br><span style="color:#fff;font-weight:600">Sans tabou · questions anonymes<br>Pas de direct ni de vidéo</span></div>'
PAGES["Affiche_Samedi_table_ronde_WZW_1080x1080"] = BG + LOGOS + left("GRANDE TABLE RONDE", ["LES CONVERSATIONS", "QUE LES FEMMES", "N'OSENT PAS AVOIR"], 54, "17H15", ("SAMEDI", "28 NOV.")) + tr_extra + portraits(allp) + FOOT
# dimanche : culte de clôture + Agapè (photo de la Prophétesse)
sun = BG + LOGOS + f'<div class="a" style="left:430px;top:0;width:650px;height:1080px;overflow:hidden;{MASK(86)}"><img class="mary" src="mary.png" style="position:absolute;left:-30px;top:60px;height:1100px"></div>'
sun += '<img class="a lock" src="lockup.png" style="left:64px;top:150px;width:360px"><div class="a ft" style="left:64px;top:342px;font-size:21px;letter-spacing:.22em">CULTE DE CLÔTURE</div>'
sun += '<div class="a" style="left:64px;top:400px;font-size:170px;line-height:.82;text-shadow:0 8px 30px rgba(110,10,0,.35)">8H45</div>'
sun += '<div class="a" style="left:64px;top:560px;width:400px;height:128px;background:#0260a6;clip-path:polygon(0 0,100% 6%,100% 100%,0 94%)"></div><div class="a" style="left:92px;top:574px;font-size:38px;line-height:1;letter-spacing:.06em">DIMANCHE</div><div class="a" style="left:90px;top:606px;font-size:84px;line-height:.9">29 NOV.</div>'
sun += '<div class="a" style="left:64px;top:716px"><span style="display:inline-block;background:#fff;color:#d8300a;font-size:64px;line-height:1;letter-spacing:.06em;padding:12px 30px 4px;box-shadow:0 12px 26px rgba(90,0,0,.3)">AGAPÈ</span></div>'
sun += '<div class="a" style="left:64px;top:830px"><span class="lab" style="font-size:22px;padding:7px 20px">PROPHÉTESSE</span></div><div class="a" style="left:64px;top:868px"><span class="lab" style="font-size:34px;padding:9px 26px">MARY FAVOUR TONGSI</span></div><div class="a ft" style="left:64px;top:938px;font-size:19px;letter-spacing:.22em">INVITÉE D\'HONNEUR</div>' + FOOT
PAGES["Affiche_Dimanche_WZW_1080x1080"] = sun
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--no-sandbox"])
    for name, body in PAGES.items():
        f = T / f"{name}.html"; f.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style>{body}")
        pg = b.new_context(viewport={"width": 1080, "height": 1080}).new_page(); pg.goto("file://" + str(f)); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f"{name}.png"))
    b.close()
shutil.rmtree(T); print("ok", len(PAGES))
