"""Cut the projector out of the original poster (no repainting: the pixels are the photo's own).
GrabCut seeded by a rectangle, then colour rules for the white floor and the navy room seen
through the stand, then a 1 px choke + soft edge. Also writes the outline as an SVG path
(assets/projector-outline.json) for the glowing contour animation.
Usage: python3 tools/cutout.py <poster.jpg> <out-dir>"""
import sys, json, cv2, numpy as np
src, out = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
H, W = img.shape[:2]
X0, Y0, X1, Y1 = 452, 318, 1005, 698
mask = np.zeros((H, W), np.uint8)
bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
cv2.grabCut(img, mask, (X0, Y0, X1 - X0, Y1 - Y0), bgd, fgd, 8, cv2.GC_INIT_WITH_RECT)
b, g, r = [img[..., i].astype(int) for i in range(3)]
lum = 0.299 * r + 0.587 * g + 0.114 * b
yy, xx = np.mgrid[0:H, 0:W]
lens_box = (yy >= 416) & (yy < 516) & (xx >= 608) & (xx < 750)
floor = (yy >= 482) & (lum > 120) & ~lens_box          # white floor under / inside the stand
room = (yy >= 505) & ((b - r) > 16) & ~lens_box         # navy room seen between body and stand
hard_bg = floor | room
mask = np.where((mask == 1) | (mask == 3), cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)
mask[:, :X0] = cv2.GC_BGD; mask[:, X1:] = cv2.GC_BGD; mask[:Y0, :] = cv2.GC_BGD; mask[Y1:, :] = cv2.GC_BGD
mask[hard_bg] = cv2.GC_BGD
mask[418:514, 612:745] = cv2.GC_FGD
cv2.ellipse(mask, (667, 460), (36, 42), 0, 0, 360, int(cv2.GC_FGD), -1)
cv2.grabCut(img, mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
m = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
m[hard_bg] = 0
n, lab, st, _ = cv2.connectedComponentsWithStats(m)
k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); m = np.where(lab == k, 255, 0).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
# 1 px choke then soft edge, to drop the light fringe of the white floor
m = cv2.erode(m, np.ones((3, 3), np.uint8), iterations=1)
alpha = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.9)
ys, xs = np.where(m > 0)
bx0, by0, bx1, by1 = xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5
S = 2  # upscale x2 (Lanczos) so it holds up at ~800 px wide on a 1080 frame; pixels untouched otherwise
crop = img[by0:by1, bx0:bx1]; a = alpha[by0:by1, bx0:bx1]
crop = cv2.resize(crop, None, fx=S, fy=S, interpolation=cv2.INTER_LANCZOS4)
a = cv2.resize(a, None, fx=S, fy=S, interpolation=cv2.INTER_LINEAR)
blur = cv2.GaussianBlur(crop, (0, 0), 1.2)
crop = cv2.addWeighted(crop, 1.35, blur, -0.35, 0)      # light unsharp mask after the upscale
rgba = np.dstack([crop, np.clip(a, 0, 255).astype(np.uint8)])
cv2.imwrite(out + '/projector.png', rgba)
# outline (on the upscaled frame) for the glowing contour, simplified
mm = (a > 127).astype(np.uint8) * 255
cs, _ = cv2.findContours(mm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c = max(cs, key=cv2.contourArea)
c = cv2.approxPolyDP(c, 1.6, True)[:, 0, :]
d = 'M' + ' L'.join(f'{x} {y}' for x, y in c) + ' Z'
# lens centre in the cutout frame
lens = [int((667 - bx0) * S), int((460 - by0) * S)]
json.dump({'w': int(crop.shape[1]), 'h': int(crop.shape[0]), 'outline': d, 'lens': lens,
           'src_box': [int(bx0), int(by0), int(bx1), int(by1)]}, open(out + '/projector.json', 'w'))
print('cutout', crop.shape[1], 'x', crop.shape[0], 'points', len(c), 'lens', lens)
# same data as a script, so the composition reads it without a network fetch
open(out + '/projector-data.js', 'w').write('window.PROJECTOR = ' + json.dumps({'w': int(crop.shape[1]), 'h': int(crop.shape[0]), 'outline': d, 'lens': lens}) + ';\n')
