"""Vectorise le logo GODTALK fourni (raster) en SVG noir et blanc."""
import sys
import numpy as np, potrace
from PIL import Image

src, outdir = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("L")
a = np.array(im)
# Retirer le cadre fin : ne garder que l'intérieur
a = a[60:-60, 60:-60]
ys, xs = np.where(a < 128)
pad = 4
a = a[ys.min()-pad:ys.max()+pad, xs.min()-pad:xs.max()+pad]
# Suréchantillonner pour un tracé plus lisse
S = 6
big = Image.fromarray(a).resize((a.shape[1]*S, a.shape[0]*S), Image.LANCZOS)
bm = potrace.Bitmap(np.array(big) >= 128)
path = bm.trace(turdsize=20, alphamax=1.0, opticurve=True, opttolerance=0.2)
h, w = np.array(big).shape
d = []
for curve in path:
    s = curve.start_point
    d.append(f"M{s.x:.1f},{s.y:.1f}")
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}")
        else:
            d.append(f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}")
    d.append("Z")
for name, col in (("godtalk-logo-noir", "#000000"), ("godtalk-logo-blanc", "#FFFFFF")):
    open(f"{outdir}/{name}.svg", "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">'
        f'<path fill="{col}" fill-rule="evenodd" d="{"".join(d)}"/></svg>')
print(w, h, len(path))
