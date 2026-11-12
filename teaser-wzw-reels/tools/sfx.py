# Sound design discret du teaser (12 s), calé sur la grille du morceau : battement toutes les 0,6 s, temps fort à 3,5 s.
# Sortie : sfx.wav (pic −3 dBFS) ; le mixage final le place très bas sous le morceau.
import numpy as np, wave, sys
SR, DUR = 44100, 12.0
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
# chronomètre : un tic toutes les 0,3 s, un peu plus clair vers la fin
tt = 0.1
while tt < 3.4: tick(tt, .35 + .3 * tt / 3.4, 2400 + int(1200 * tt / 3.4)); tt += .3
whoosh(1.5, 1.9, 300, 6500, .45, True)
# impacts : W 3,5 · Z 4,1 · W 4,7 · mots 5,3 / 5,9 / 6,5 · reflet 7,1 · dates 7,7 · annonce 10,1
for at, m, pan in [(3.5, 72, -.4), (4.1, 76, 0.0), (4.7, 79, .4)]: thud(at, .9 if at == 3.5 else .6); pluck(m, at, .35, pan)
for at, m, pan in [(5.3, 79, -.3), (5.9, 81, 0.0), (6.5, 84, .3)]: thud(at, .5); pluck(m, at + .02, .3, pan, .1)
whoosh(7.0, .5, 1200, 7000, .35)
for i, m in enumerate([88, 91, 93, 96]): pluck(m, 7.1 + i * .07, .16, -.5 + .33 * i, .06)
thud(7.7, .6); whoosh(7.6, .35, 800, 5000, .25)
for at in (7.95, 8.15, 8.4, 8.9, 9.3): pluck(84 if at < 8.5 else 88, at, .18, 0, .08)
thud(10.1, .7); pluck(84, 10.1, .3, 0, .14); pluck(91, 10.15, .2, .2, .14)
whoosh(10.0, .35, 1500, 6500, .25)
fade = np.minimum(t / .02, 1); L *= fade; R *= fade
g = 10 ** (-3 / 20) / max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("sfx ok")
