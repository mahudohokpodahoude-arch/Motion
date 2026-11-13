# Sound design de l'annonce (40,2 s), calé sur la grille du morceau : battement toutes les 0,6 s, temps fort à 3,5 s.
# Sortie : sfx.wav (pic −3 dBFS) ; le mixage final le place très bas sous le morceau.
import numpy as np, wave, sys
SR, DUR = 44100, 40.2
N = int(SR * DUR); rng = np.random.default_rng(242); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def put(sig, at, pan=0.0, g=1.0):
    i = int(at * SR)
    if i >= N: return
    s = sig[: N - i]; L[i:i + len(s)] += s * g * np.sqrt(.5 * (1 - pan)); R[i:i + len(s)] += s * g * np.sqrt(.5 * (1 + pan))
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def lp(x, f0, f1=None):
    f1 = f0 if f1 is None else f1; n = len(x); f = np.linspace(f0, f1, n); a = 1 - np.exp(-2 * np.pi * f / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s += a[i] * (x[i] - s); y[i] = s
    return y
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def tick(at, g=.5, hi=2400):
    n = int(SR * .06); nz = rng.standard_normal(n); x = np.arange(n) / SR
    put((lp(nz, 7000) - lp(nz, hi)) * env(n, .0005, .008) * 3 + np.sin(2 * np.pi * 190 * x) * env(n, .0005, .02) * .5, at, 0, g)
def thud(at, g=.8):
    n = int(SR * .3); x = np.arange(n) / SR; put(np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-x / .04)) / SR) * env(n, .001, .12), at, 0, g)
def whoosh(at, dur, f0, f1, g, rise=False):
    n = int(SR * dur); nz = rng.standard_normal(n); sh = np.linspace(0, 1, n) ** 2 if rise else np.sin(np.linspace(0, np.pi, n)) ** 1.5
    put((lp(nz, f1) - lp(nz, f0)) * sh, at, 0, g)
def pluck(m, at, g=.3, pan=0.0, dec=.12):
    n = int(SR * .5); x = np.arange(n) / SR; f = midi(m)
    put((np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * f * 3.99 * x) * np.exp(-x / .04)) * env(n, .002, dec), at, pan, g)

# ---- 0 → 1,8 : accroche (tracés, mots qui tombent)
whoosh(0.0, .5, 300, 5000, .4); tick(0.1, .5)
for at in (0.6, 0.8, 1.0): thud(at, .45); whoosh(at - .08, .25, 600, 5000, .3)
whoosh(1.25, .3, 1500, 8000, .3); tick(1.4, .6)
# ---- 1,8 : carte WEEK-END ZONE WOMEN
whoosh(1.7, .35, 500, 7000, .4); thud(1.8, .8); whoosh(2.3, .3, 400, 6000, .4); thud(2.4, 1.0); pluck(60, 2.4, .3)
# ---- 3,6 : titre, coupes rapides
thud(3.6, 1.0); whoosh(3.5, .3, 2000, 9000, .4); pluck(72, 3.6, .3); pluck(79, 3.65, .25, .2)
for at in (4.8, 6.0, 7.2): whoosh(at - .1, .3, 800, 6500, .3); thud(at, .5)
# ---- 8,4 → 20,4 : carrousel, un coup léger à chaque personne
whoosh(8.2, .4, 500, 7000, .4); thud(8.4, .9)
for i in range(11):
    t = 8.4 + i * 1.2
    if i: whoosh(t - .15, .35, 700, 6000, .28)
    thud(t, .35 if i else .0); pluck(72 + (i % 5) * 2, t + .05, .22, -.3 + .06 * i, .1)
# ---- 20,4 → 32,4 : textes cinétiques
for t in (21.6, 24.6, 28.2): whoosh(t - .1, .4, 600, 7000, .35); thud(t, .6); [pluck(79 + j * 2, t + .05 * j, .15, 0, .08) for j in range(3)]
for t in (24.0, 27.5, 31.7): whoosh(t, .5, 3000, 9000, .35)
# ---- 32,4 → 35,4 : NE MANQUE PAS
for i in range(12): tick(32.4 + i * .17, .45, 3000)
for i in range(6): thud(32.4 + i * .6, .4)
whoosh(34.3, .6, 1000, 9000, .5, True); thud(34.55, 1.0)
for i in range(5): tick(34.9 + i * .1, .6, 2500)
# ---- 35,4 : le flyer
thud(35.4, 1.0); whoosh(35.3, .4, 800, 8000, .4); [pluck(m, 35.4 + k * .12, .25, -.3 + .2 * k, .12) for k, m in enumerate([84, 88, 91, 96])]
whoosh(36.5, .6, 1200, 7000, .35)
fade = np.minimum(t / .02, 1); L *= fade; R *= fade
g = 10 ** (-3 / 20) / max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("sfx ok")
