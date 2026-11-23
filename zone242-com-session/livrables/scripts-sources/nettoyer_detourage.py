# Supprime la frange claire d'un détourage : érode légèrement l'alpha et recolore les bords avec la couleur intérieure la plus proche.
# Usage : python nettoyer_detourage.py entree.png sortie.png [erosion_px]
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
src, dst = sys.argv[1], sys.argv[2]; er = int(sys.argv[3]) if len(sys.argv) > 3 else 2
im = Image.open(src).convert("RGBA"); a = np.array(im).astype(float); alpha = a[..., 3] / 255
core = ndi.binary_erosion(alpha > .94, iterations=er + 2)
idx = ndi.distance_transform_edt(~core, return_distances=False, return_indices=True)
rgb = a[..., :3][idx[0], idx[1]]
band = (alpha < .999)                                  # bords : on prend la couleur de l'intérieur
out_rgb = np.where(band[..., None], rgb, a[..., :3])
al = ndi.binary_erosion(alpha > .5, iterations=er).astype(float)
al = np.array(Image.fromarray((al * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.1))).astype(float) / 255
al = np.minimum(al, np.where(alpha > .02, 1, 0))
res = np.dstack([out_rgb, al * 255]).clip(0, 255).astype("uint8")
Image.fromarray(res, "RGBA").save(dst); print("ok", dst)
