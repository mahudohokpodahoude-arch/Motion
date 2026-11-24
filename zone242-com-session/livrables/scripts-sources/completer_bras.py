# Prolonge les épaules et les manches d'un portrait coupé : élargit la toile, prolonge le tissu par réflexion adoucie, redessine le contour.
# Usage : python completer_bras.py entree.png sortie.png [marge_px]
import sys, numpy as np
from PIL import Image, ImageFilter, ImageDraw
src, dst = sys.argv[1], sys.argv[2]; M = int(sys.argv[3]) if len(sys.argv) > 3 else 240
im = Image.open(src).convert("RGBA"); W, H = im.size; a = np.array(im)
Wn = W + 2 * M
out = np.zeros((H, Wn, 4), dtype=np.uint8); out[:, M:M + W] = a
# tissu : on prolonge la couleur du bord (manche), avec un léger dégradé de pli et un grain flou
ys = np.arange(H)
for side in ("L", "R"):
    col = a[:, 0, :3] if side == "L" else a[:, W - 1, :3]
    col = np.array(Image.fromarray(np.repeat(col[:, None, :], 1, 1).astype(np.uint8)).resize((1, H)).filter(ImageFilter.GaussianBlur(45)))[:, 0, :].astype(float)
    for x in range(M):
        t = x / M
        k = 1 - .30 * t - .08 * np.sin(t * 6)                 # s'assombrit en s'éloignant, petit pli
        px = np.clip(col * k, 0, 255).astype(np.uint8)
        if side == "L": out[:, M - 1 - x, :3] = px
        else: out[:, M + W + x, :3] = px
# contour : épaules qui continuent la pente, manche arrondie puis qui tombe à la verticale
def shoulder_y(side):
    col = a[:, 0 if side == "L" else W - 1, 3] > 128
    ys = np.where(col)[0]; return int(ys.min()) if len(ys) else int(H * .55)
mask = Image.new("L", (Wn, H), 0); d = ImageDraw.Draw(mask)
ys_l, ys_r = shoulder_y("L"), shoulder_y("R")
d.rectangle([M, 0, M + W, H], fill=0)
mask_np = np.zeros((H, Wn), dtype=np.uint8); mask_np[:, M:M + W] = a[..., 3]
# polygone gauche
import math
def arc(cx, ys0, sign):
    pts = []
    R = 0.97 * M; Ry = 340
    for k in range(0, 41):
        th = k / 40 * math.pi / 2
        pts.append((cx + sign * R * math.sin(th), ys0 + Ry - Ry * math.cos(th)))
    return pts
pl = arc(M, ys_l, -1) + [(0, H), (M, H)]
pr = arc(M + W, ys_r, +1) + [(Wn, H), (M + W, H)]
d2 = ImageDraw.Draw(mask); d2.polygon(pl, fill=255); d2.polygon(pr, fill=255)
alpha = np.maximum(mask_np, np.array(mask))
# lissage du contour et ombre de pli à l'épaule
al = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(3))
out[..., 3] = np.array(al)
Image.fromarray(out, "RGBA").save(dst); print("ok", Wn, H)
