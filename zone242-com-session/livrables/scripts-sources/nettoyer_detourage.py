# Supprime les franges claires d'un détourage : retire les pixels de bord plus clairs que la matière voisine,
# érode l'alpha, adoucit et recolore les bords avec la couleur intérieure la plus proche.
# Usage : python nettoyer_detourage.py entree.png sortie.png [erosion_px]
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
src, dst = sys.argv[1], sys.argv[2]; er = int(sys.argv[3]) if len(sys.argv) > 3 else 3
im = Image.open(src).convert("RGBA"); a = np.array(im).astype(float); alpha = a[..., 3] / 255
solid = alpha > .5
core = ndi.binary_erosion(alpha > .94, iterations=er + 4)
dist, idx = ndi.distance_transform_edt(~core, return_indices=True)
inner = a[..., :3][idx[0], idx[1]]
lum = lambda x: x @ np.array([.299, .587, .114])
near_edge = (dist > 0) & (dist < 14)
bright = lum(a[..., :3]) > lum(inner) + 28                    # plus clair que la matière voisine = résidu de fond
whiteish = (a[..., :3].min(-1) > 190) & ((a[..., :3].max(-1) - a[..., :3].min(-1)) < 40)
kill = near_edge & (bright | whiteish)
kill = ndi.binary_dilation(kill, iterations=1) & near_edge
alpha2 = np.where(kill, 0, alpha)
m = ndi.binary_opening(alpha2 > .5, iterations=1)             # supprime les points isolés
m = ndi.binary_erosion(m, iterations=er)
# supprime les petits îlots
lab, n = ndi.label(m); sizes = ndi.sum(m, lab, range(1, n + 1)); m = np.isin(lab, [i + 1 for i, sz in enumerate(sizes) if sz > 400])
soft = np.array(Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.0))).astype(float) / 255
rgb = np.where((dist > 0)[..., None], inner, a[..., :3])
res = np.dstack([rgb, soft * 255]).clip(0, 255).astype("uint8")
Image.fromarray(res, "RGBA").save(dst); print("ok", dst)
