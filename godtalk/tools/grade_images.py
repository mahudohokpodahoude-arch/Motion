"""Étalonnage commun des visuels d'illustration : désaturation légère,
noirs denses, dominante chaude discrète, grain fin. Sortie JPEG haute qualité."""
import sys, os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
rng = np.random.default_rng(7)
for f in sorted(os.listdir(src)):
    im = Image.open(os.path.join(src, f)).convert("RGB")
    # suréchantillonnage x2 pour un rendu plus doux à l'impression
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.62)
    im = ImageEnhance.Contrast(im).enhance(1.08)
    a = np.asarray(im).astype(np.float32) / 255
    # courbe : noirs plus denses
    a = np.clip((a - 0.03) / 0.97, 0, 1) ** 1.08
    # dominante chaude dans les hautes lumières, neutre dans les ombres
    lum = a.mean(axis=2, keepdims=True)
    warm = np.array([1.04, 1.0, 0.92])
    a = a * (1 + (warm - 1) * lum)
    # grain argentique fin
    a += rng.normal(0, 0.018, a.shape[:2])[..., None]
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    out = out.filter(ImageFilter.UnsharpMask(radius=2, percent=40, threshold=2))
    name = os.path.splitext(f)[0] + ".jpg"
    out.save(os.path.join(dst, name), quality=90, optimize=True)
    print(name, out.size)
