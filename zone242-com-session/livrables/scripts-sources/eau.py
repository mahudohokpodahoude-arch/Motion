# Fond « eau » original pour l'affiche baptême (1920×1080) : volutes peintes le long d'un champ d'écoulement,
# écume, rayons de lumière et éclats arc-en-ciel. Entièrement procédural et reproductible (graine fixe).
import sys, time
import numpy as np, cv2
from PIL import Image

W, H = 1920, 1080
SEED = int(sys.argv[1]) if len(sys.argv) > 1 else 242
OUT = sys.argv[2] if len(sys.argv) > 2 else "fond_eau.png"
rng = np.random.default_rng(SEED)
X, Y = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))

def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)

def noise(scale, stretch=1.0, angle=0.0, px=None, py=None):
    """bruit de valeur lisse, structures ~ `scale` px (allongées de `stretch` le long de `angle`)"""
    px = X if px is None else px; py = Y if py is None else py
    gh, gw = int(2.4 * max(H, W) / scale) + 8, int(2.4 * max(H, W) / scale) + 8
    g = rng.standard_normal((gh, gw)).astype(np.float32)
    a = np.deg2rad(angle); c, s = np.cos(a), np.sin(a)
    dx, dy = px - W / 2, py - H / 2
    u = (c * dx + s * dy) / (scale * stretch) + gw / 2
    v = (-s * dx + c * dy) / scale + gh / 2
    n = cv2.remap(g, u.astype(np.float32), v.astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    return n / 0.62                                   # ≈ écart-type 1 après interpolation cubique

def fbm(scales, weights, stretch, angles, px=None, py=None):
    out = np.zeros((H, W), np.float32)
    for s, w, a in zip(scales, weights, angles):
        out += w * noise(s, stretch, a, px, py)
    return out

t0 = time.time()
# ---- 1) déformation de domaine : volutes qui s'enroulent
wx = noise(620, 1.0, 20) * 100; wy = noise(620, 1.0, 70) * 100
wx += noise(300, 1.0, -30) * 26; wy += noise(300, 1.0, 40) * 26
PX, PY = X + wx, Y + wy

# ---- 2) potentiel d'écoulement ψ (grandes ondes en diagonale) ; les lignes de courant suivent ses courbes de niveau
psi = fbm([1000, 640, 400, 250], [1.0, 0.72, 0.36, 0.17], 2.3, [-24, -16, -30, -12], PX, PY)
th = np.deg2rad(64.0)
TILT = float(sys.argv[3]) if len(sys.argv) > 3 else 1.15
psi += TILT * (X * np.cos(th) + Y * np.sin(th)) / 780.0                       # pente générale : les courbes de niveau balayent l'image
psi = cv2.GaussianBlur(psi, (0, 0), 4.0)
gy, gx = np.gradient(psi)
vx, vy = gy, -gx
nrm = np.sqrt(vx * vx + vy * vy) + 1e-4
vx, vy = (vx / nrm).astype(np.float32), (vy / nrm).astype(np.float32)
print("champ d'écoulement : %.1f s" % (time.time() - t0))

# ---- 3) convolution intégrale de ligne (LIC) : stries peintes le long des courants
def lic(n_fine, n_thick, L=64, h=1.0):
    acc1, acc2, ws = n_fine.copy(), n_thick.copy(), 1.0
    for sign in (1, -1):
        px, py = X.copy(), Y.copy()
        for i in range(1, L + 1):
            ux = cv2.remap(vx, px, py, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            uy = cv2.remap(vy, px, py, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            px = px + sign * h * ux; py = py + sign * h * uy
            w = 0.5 * (1 + np.cos(np.pi * i / L))
            acc1 += w * cv2.remap(n_fine, px, py, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            acc2 += w * cv2.remap(n_thick, px, py, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            ws += w
    return acc1 / ws, acc2 / ws
nf = cv2.GaussianBlur(rng.standard_normal((H, W)).astype(np.float32), (0, 0), 1.1)
nt = cv2.GaussianBlur(rng.standard_normal((H, W)).astype(np.float32), (0, 0), 4.5)
L1, L2 = lic(nf / nf.std(), nt / nt.std(), L=92)
L1 /= L1.std(); L2 /= L2.std()
print("LIC : %.1f s" % (time.time() - t0))

# ---- 4) tons : profil de profondeur (clair en haut, plus profond en bas) + variations d'ondes
low = fbm([900, 520], [1.0, 0.6], 1.5, [-20, 15], PX, PY)
low /= low.std()
yy = Y / H; xx = X / W
depth = 0.60 - 0.22 * smoothstep(0.0, 1.0, yy)                      # 0,60 en haut → 0,38 en bas
calm = np.exp(-(((yy - 0.50) / 0.19) ** 4)) * smoothstep(0.04, 0.26, xx) * smoothstep(0.96, 0.74, xx)   # bande du titre : plus calme et plus profonde
depth += 0.10 * np.exp(-(((xx - 0.18) / 0.35) ** 2 + ((yy - 0.02) / 0.35) ** 2))   # source de lumière en haut à gauche
logo_zone = np.exp(-(((xx - 0.5) / 0.17) ** 2 + ((yy - 0.12) / 0.20) ** 2))
T = depth - 0.27 * calm - 0.17 * logo_zone + 0.17 * low * (1 - 0.40 * calm) + 0.085 * L2 * (1 - 0.55 * calm) + 0.032 * L1

# crêtes d'écume : là où les stries épaisses et le champ lent sont hauts ; lignes de contour bleu profond
foam = smoothstep(0.55, 1.35, (L2 * 0.8 + low * 0.55 + 0.25 * np.sin(psi * 2.2))) * (1 - 0.82 * calm) * (1 - 0.5 * logo_zone)
lines_lvl = np.abs(((psi * 0.95) % 1.0) - 0.5)                         # 0 sur les niveaux entiers
contour = np.exp(-(lines_lvl / 0.026) ** 2) * (0.25 + 0.55 * smoothstep(-0.2, 0.9, L1 + 0.5 * low))
contour2 = np.exp(-(np.abs(((psi * 1.9 + 0.37) % 1.0) - 0.5) / 0.022) ** 2) * 0.45

stops = np.array([(0x08, 0x5c, 0x98), (0x14, 0x84, 0xbc), (0x2a, 0xa6, 0xcf), (0x62, 0xc4, 0xe0), (0xa9, 0xe3, 0xef), (0xdc, 0xf4, 0xf9), (0xfb, 0xff, 0xff)], np.float32) / 255
pos = np.array([0.0, 0.18, 0.36, 0.54, 0.70, 0.86, 1.0], np.float32)
Tc = np.clip(T, 0, 1)
img = np.stack([np.interp(Tc, pos, stops[:, k]) for k in range(3)], -1).astype(np.float32)

# teinte plus verte (lagon) vers le bas
lagoon = np.array([0.20, 0.78, 0.74], np.float32)
img = img * (1 - 0.22 * smoothstep(0.55, 1.0, yy)[..., None]) + lagoon * 0.22 * smoothstep(0.55, 1.0, yy)[..., None] * (0.55 + 0.45 * Tc[..., None])
# contours bleu profond (comme les ondes marbrées du modèle) puis écume
deep = np.array([0.03, 0.30, 0.55], np.float32)
img = img * (1 - 0.55 * (contour + contour2)[..., None]) + deep * 0.55 * (contour + contour2)[..., None] * 0.9
img = img + (1 - img) * (0.62 * foam)[..., None] * (0.55 + 0.45 * smoothstep(0.3, 0.9, Tc))[..., None]

# ---- 5) lumière : rayons depuis le haut à gauche, voile lumineux
def ray_noise(theta, k, seed):
    r = np.random.default_rng(seed).standard_normal(256).astype(np.float32)
    kk = 9; ker = np.exp(-0.5 * (np.arange(-kk, kk + 1) / 2.2) ** 2); ker /= ker.sum()          # flou circulaire
    r = np.convolve(np.concatenate([r[-kk:], r, r[:kk]]), ker, mode="valid").astype(np.float32); r /= r.std()
    idx = (theta / (2 * np.pi) * 256 * k) % 256
    i0 = idx.astype(np.int32) % 256; i1 = (i0 + 1) % 256; f = idx - np.floor(idx)
    return r[i0] * (1 - f) + r[i1] * f
sx, sy = 0.27 * W, -0.22 * H
theta = np.arctan2(Y - sy, X - sx); rad = np.sqrt((X - sx) ** 2 + (Y - sy) ** 2)
rays = 0.55 * ray_noise(theta, 0.06, 5) + 0.45 * ray_noise(theta, 0.16, 6)
rays = np.clip(rays * 0.9 + 0.15, 0, None) ** 1.6
rays *= np.exp(-rad / 1250) * smoothstep(1.0, 0.25, yy)
img = 1 - (1 - img) * (1 - (0.22 * rays)[..., None] * np.array([0.92, 1.0, 1.0], np.float32))

# ---- 6) éclats arc-en-ciel (dispersion) en rayures fines
def hsv2rgb(h, s, v):
    h = (h % 1.0) * 6; i = np.floor(h).astype(int) % 6; f = h - np.floor(h)
    p, q, t = v * (1 - s), v * (1 - s * f), v * (1 - s * (1 - f))
    r = np.choose(i, [v, q, p, p, t, v]); g = np.choose(i, [t, v, v, q, p, p]); b = np.choose(i, [p, p, t, v, v, q])
    return np.stack([r, g, b], -1)
def streak(p0, p1, width, power, hue0=0.0, spread=0.55):
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]; ln = np.hypot(dx, dy); ux, uy = dx / ln, dy / ln
    t = ((X - p0[0]) * ux + (Y - p0[1]) * uy) / ln
    d = (-(X - p0[0]) * uy + (Y - p0[1]) * ux)
    taper = smoothstep(0.0, 0.22, t) * smoothstep(1.0, 0.70, t)
    prof = np.exp(-(d / width) ** 2)
    core = np.exp(-(d / (width * 0.28)) ** 2)
    hue = hue0 + 0.62 * np.clip(d / (1.8 * width), -1, 1)
    col = hsv2rgb(hue, 0.78, 1.0)
    halo = np.exp(-(d / (width * 3.2)) ** 2)
    return (prof[..., None] * col * 0.95 + core[..., None] * 0.30 + halo[..., None] * np.array([0.10, 0.16, 0.20]) ) * (taper * power)[..., None]
flares = np.zeros((H, W, 3), np.float32)
for (a, b, w, p, h0) in [((120, 20), (640, 600), 30, 0.75, 0.00), ((40, 240), (430, 700), 18, 0.55, -0.02),
                         ((1400, 10), (1860, 470), 34, 0.80, 0.02), ((1640, -20), (1920, 330), 16, 0.70, 0.10),
                         ((860, -40), (1030, 330), 9, 0.35, 0.05), ((1700, 540), (1920, 840), 20, 0.50, 0.04)]:
    flares += streak(a, b, w, p, h0)
img = 1 - (1 - img) * (1 - np.clip(flares, 0, 1))
# couche d'éclats séparée : posée par-dessus le titre (mode « écran »), la lumière traverse les lettres
flares_top = np.zeros((H, W, 3), np.float32)
for (a, b, w, p, h0) in [((330, 90), (800, 640), 20, 0.80, 0.00), ((1255, 140), (1500, 700), 12, 0.60, 0.04), ((1560, 120), (1790, 560), 16, 0.65, 0.10)]:
    flares_top += streak(a, b, w, p, h0)
Image.fromarray((np.clip(flares_top, 0, 1) * 255 + 0.5).astype(np.uint8)).save("flares_top.png")

# ---- 7) étincelles (reflets sur l'eau)
sp = np.zeros((H, W), np.float32)
for _ in range(170):
    x, y = rng.uniform(0, W), rng.uniform(0, H * 0.9); r = rng.uniform(1.0, 3.2) * (1.4 if rng.random() < 0.08 else 1.0)
    cv2.circle(sp, (int(x), int(y)), int(np.ceil(r)), float(rng.uniform(0.35, 1.0)), -1, cv2.LINE_AA)
sp = cv2.GaussianBlur(sp, (0, 0), 1.0) + 0.5 * cv2.GaussianBlur(sp, (0, 0), 5.0)
img = 1 - (1 - img) * (1 - np.clip(sp, 0, 1)[..., None] * 0.55)

# ---- 8) finition : vignette douce, léger grain contre les aplats
vig = 1 - 0.30 * smoothstep(0.55, 1.35, np.sqrt(((xx - 0.5) / 0.62) ** 2 + ((yy - 0.48) / 0.60) ** 2))
img = img * vig[..., None]
img += (rng.standard_normal((H, W, 1)).astype(np.float32) * 0.0045)
res = (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)
Image.fromarray(res).save(OUT)
lum = (img @ np.array([0.2126, 0.7152, 0.0722], np.float32))
print("luminance (0-1) — moyenne %.2f | bande du titre (y 380-680) %.2f | bande de l'adresse (y 860-990) %.2f | haut-centre (logo) %.2f" % (
    lum.mean(), lum[380:680].mean(), lum[860:990, 400:1520].mean(), lum[50:230, 800:1120].mean()))
print("total %.1f s" % (time.time() - t0))
