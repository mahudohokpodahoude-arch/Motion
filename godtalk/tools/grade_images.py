"""Étalonnage commun des visuels d'illustration : version lumineuse.
Ombres légèrement relevées, couleurs préservées, dominante chaude discrète,
grain très fin. Sortie JPEG haute qualité."""
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
    im = ImageEnhance.Color(im).enhance(0.9)
    a = np.asarray(im).astype(np.float32) / 255
    # relever les ombres et éclaircir les tons moyens
    a = 0.05 + 0.95 * a
    a = a ** 0.86
    # dominante chaude légère
    a = a * np.array([1.03, 1.0, 0.95])
    a += rng.normal(0, 0.01, a.shape[:2])[..., None]
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    out = out.filter(ImageFilter.UnsharpMask(radius=2, percent=45, threshold=2))
    name = os.path.splitext(f)[0] + ".jpg"
    out.save(os.path.join(dst, name), quality=88, optimize=True)
    print(name, out.size)
