# Retire micro, main et avant-bras du détourage d'Anne-Laure (photo sur scène) ; lisse le contour d'épaule.
# Usage : python anne_sans_micro.py detourage.png sortie.png
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
im = Image.open(sys.argv[1]).convert("RGBA"); W, H = im.size; k = W / 942
poly = [(0, 290), (333, 290), (334, 445), (312, 458), (268, 488), (264, 530), (258, 620), (250, 760), (236, H / k), (0, H / k)]
m = Image.new("L", (W, H), 255); ImageDraw.Draw(m).polygon([(x * k, y * k) for x, y in poly], fill=0)
m = m.filter(ImageFilter.GaussianBlur(3))
a = np.array(im); a[..., 3] = (a[..., 3].astype(float) * np.array(m) / 255).astype(np.uint8)
res = Image.fromarray(a, "RGBA"); res = res.crop(res.getbbox()); res.save(sys.argv[2]); print("ok", res.size)
