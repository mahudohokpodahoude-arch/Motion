# Décline les génériques « Question à l'Apôtre Amos » (début + fin) en 4:3 (1440×1080) et 16:9 (1920×1080).
# Même design, même animation, même son : on réutilise le HTML vertical validé et on n'en change que la mise en page.
import re, shutil, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
FORMATS = {"4x3": (1440, 1080), "16x9": (1920, 1080)}

def qmarks(W):
    pts = [(0.07 * W, 700, 110), (0.90 * W, 820, 90), (0.84 * W, 110, 150), (0.12 * W, 130, 80), (0.5 * W - 50, 960, 100), (0.22 * W, 470, 70), (0.76 * W, 450, 70)]
    return '<div id="qmarks" class="abs" style="inset:0">' + "".join(f'<span style="left:{x:.0f}px;top:{y}px;font-size:{s}px">?</span>' for x, y, s in pts) + "</div>"

def common(h, W, H):
    h = h.replace('content="width=1080, height=1920"', f'content="width={W}, height={H}"')
    h = h.replace('html, body { width: 1080px; height: 1920px;', f'html, body {{ width: {W}px; height: {H}px;')
    h = h.replace('#root { position: relative; width: 1080px; height: 1920px;', f'#root {{ position: relative; width: {W}px; height: {H}px;')
    h = h.replace('data-width="1080" data-height="1920"', f'data-width="{W}" data-height="{H}"')
    h = re.sub(r'<div id="qmarks".*?</div>', qmarks(W), h, count=1, flags=re.S)
    return h

def opener(src, W, H):
    h = common(src, W, H)
    cx = W // 2
    css = f"""
      /* mise en page horizontale ({W}×{H}) : mêmes éléments, mêmes tailles, recentrés */
      #glow {{ left: {cx - 400}px; top: 20px; }}
      #logo {{ left: {cx - 95}px; top: 28px; width: 190px; }}
      #stage {{ left: {cx - 542}px; top: 282px; }}
      #card {{ left: {cx - 500}px; top: 655px; width: 1000px; }}
    """
    h = h.replace("    </style>", css + "    </style>", 1)
    for a, b in [("x: 540 + Math.cos", f"x: {cx} + Math.cos"), ("y: 860 + Math.sin", "y: 420 + Math.sin"), ("x: 540 - 7, y: 860 - 7", f"x: {cx - 7}, y: 413")]:
        assert h.count(a) == 1, a; h = h.replace(a, b)
    return h

def fin(src, W, H):
    h = common(src, W, H)
    cx = W // 2
    if W == 1440:      # 4:3 : empilé comme la version verticale
        css = f"""
      #glow {{ left: {cx - 400}px; top: 150px; }}
      #logo {{ left: {cx - 115}px; top: 50px; width: 230px; }}
      .card {{ left: {cx - 450}px; }}
      #c1 {{ top: 345px; }} #c2 {{ top: 525px; }}
      #social {{ left: 0; width: {W}px; top: 735px; }}
    """
        scx, scy, ex = cx, 175, 0
    else:              # 16:9 : logo à gauche, contacts à droite
        css = f"""
      #glow {{ left: 75px; top: 140px; }}
      #logo {{ left: 260px; top: 320px; width: 430px; }}
      .card {{ left: 940px; }}
      #c1 {{ top: 335px; }} #c2 {{ top: 515px; }}
      #social {{ left: 940px; width: 900px; top: 715px; }}
    """
        scx, scy, ex = 475, 540, 0
    h = h.replace("    </style>", "      /* mise en page horizontale */" + css + "    </style>", 1)
    for a, b in [("x: 540 + Math.cos", f"x: {scx} + Math.cos"), ("y: 730 + Math.sin", f"y: {scy} + Math.sin"), ("x: 533, y: 723", f"x: {scx - 7}, y: {scy - 7}")]:
        assert h.count(a) == 1, a; h = h.replace(a, b)
    return h

def build(proj, fn):
    p = ROOT / proj
    src = (p / "index.html").read_text()
    for name, (W, H) in FORMATS.items():
        d = p / "formats" / name
        if d.exists(): shutil.rmtree(d)
        d.mkdir(parents=True)
        for item in ["assets", "gsap"]: shutil.copytree(p / item, d / item)
        for item in ["hyperframes.json", "meta.json", "package.json", ".gitignore"]:
            if (p / item).exists(): shutil.copy(p / item, d / item)
        (d / "index.html").write_text(fn(src, W, H))
        print("OK", d)

if __name__ == "__main__":
    build("generique-questions-pasteurs", opener)
    build("generique-fin-zone242", fin)
