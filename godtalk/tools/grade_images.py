"""Étalonnage des visuels d'illustration.

- Version lumineuse (pages intérieures) : ombres relevées, couleurs préservées,
  dominante chaude discrète, grain très fin.
- Version cinéma (couverture) : couleurs retenues, noirs denses, hautes lumières
  chaudes, grain argentique. Produite pour l'image de couverture uniquement,
  sous le nom <image>-cinema.jpg.

Usage : python3 tools/grade_images.py <dossier originaux> <dossier sortie>
"""
import sys, os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

COVER = "camera-concert"


def lumineux(im, rng):
    im = ImageEnhance.Color(im).enhance(0.9)
    a = np.asarray(im).astype(np.float32) / 255
    a = 0.05 + 0.95 * a                    # relever les ombres
    a = a ** 0.86                          # éclaircir les tons moyens
    a = a * np.array([1.03, 1.0, 0.95])    # dominante chaude légère
    a += rng.normal(0, 0.01, a.shape[:2])[..., None]
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return out.filter(ImageFilter.UnsharpMask(radius=2, percent=45, threshold=2))


def cinema(im, rng):
    im = ImageEnhance.Color(im).enhance(0.62)
    im = ImageEnhance.Contrast(im).enhance(1.08)
    a = np.asarray(im).astype(np.float32) / 255
    a = np.clip((a - 0.03) / 0.97, 0, 1) ** 1.08          # noirs plus denses
    lum = a.mean(axis=2, keepdims=True)
    a = a * (1 + (np.array([1.04, 1.0, 0.92]) - 1) * lum)  # hautes lumières chaudes
    a += rng.normal(0, 0.018, a.shape[:2])[..., None]
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return out.filter(ImageFilter.UnsharpMask(radius=2, percent=40, threshold=2))


src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
for f in sorted(os.listdir(src)):
    stem = os.path.splitext(f)[0]
    im = Image.open(os.path.join(src, f)).convert("RGB")
    # suréchantillonnage x2 pour un rendu plus doux à l'impression
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    versions = [(stem, lumineux)] + ([(stem + "-cinema", cinema)] if stem == COVER else [])
    for name, grade in versions:
        out = grade(im, np.random.default_rng(7))
        out.save(os.path.join(dst, name + ".jpg"), quality=88, optimize=True)
        print(name + ".jpg", out.size)
