# Musique originale « afro gospel » · 36 s · 120 bpm · do majeur · 100 % synthétisée, sans voix ni échantillon.
# Groove afrobeat (clave 3-2, shaker, kick syncopé), orgue gospel en accords rythmés, nappe de chœur « ooh », basse syncopée, mélodie en pentatonique.
# Un impact à chaque nouvelle carte : 0, 6, 12, 18, 24, 30 s (début de mesure : 3 mesures de 2 s par carte).
import numpy as np, wave, sys
from scipy.signal import lfilter
SR, DUR, BPM = 44100, 36.0, 120
N = int(SR * DUR); BEAT = 60 / BPM; S16 = BEAT / 4; BAR = 4 * BEAT; NB = int(round(DUR / BAR))
rng = np.random.default_rng(242); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def put(sig, at, pan=0.0, g=1.0):
    i = int(round(at * SR))
    if i >= N or i < 0: return
    s = sig[: N - i]; L[i:i + len(s)] += s * g * np.sqrt(.5 * (1 - pan)); R[i:i + len(s)] += s * g * np.sqrt(.5 * (1 + pan))
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def lp(x, f): a = 1 - np.exp(-2 * np.pi * f / SR); return lfilter([a], [1, -(1 - a)], x)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
# progression gospel : C(add9) · F(add9) · Am7 · G(sus4→G)
CH = [(36, [60, 64, 67, 74]), (41, [60, 65, 69, 74]), (45, [60, 64, 67, 71]), (43, [59, 62, 67, 69])]
def organ(notes, at, dur, g=.07, pan=0.0):
    n = int(SR * (dur + .25)); x = np.arange(n) / SR; o = np.zeros(n)
    for m in notes:
        f = midi(m)
        for k, w in ((1, 1.0), (2, .8), (3, .5), (4, .35), (6, .2)): o += w * np.sin(2 * np.pi * f * k * x)
    leslie = 1 + .12 * np.sin(2 * np.pi * 6.2 * x)
    a = np.minimum(x / .01, 1) * np.clip((dur + .25 - x) / .12, 0, 1)
    put(lp(o * leslie, 3800) * a * g / len(notes), at, pan, 1)
def choir(notes, at, dur, g=.06):
    n = int(SR * (dur + .6)); x = np.arange(n) / SR; o = np.zeros(n)
    for j, m in enumerate(notes):
        for det in (-.18, 0, .18):
            f = midi(m + 12) * 2 ** (det / 12); vib = 1 + .006 * np.sin(2 * np.pi * (5.1 + .3 * j) * x + j)
            o += np.sin(2 * np.pi * f * x * vib) + .4 * np.sin(2 * np.pi * 2 * f * x * vib) + .15 * np.sin(2 * np.pi * 3 * f * x * vib)
    a = np.minimum(x / .5, 1) * np.clip((dur + .6 - x) / .6, 0, 1)
    put(lp(o, 2200) * a * g / len(notes), at, 0, 1)
def bass(m, at, dur, g=.5):
    n = int(SR * dur); x = np.arange(n) / SR; f = midi(m)
    put((np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * 2 * f * x)) * env(n, .008, dur * .7) * g, at, 0, 1)
def logdrum(m, at, g=.3, pan=0.0):
    n = int(SR * .35); x = np.arange(n) / SR; f = midi(m)
    ph = 2 * np.pi * np.cumsum(f * (1 + .35 * np.exp(-x / .03))) / SR
    put((np.sin(ph) + .25 * np.sin(2 * ph)) * env(n, .001, .12) * g, at, pan, 1)
def kick(at, g=1.0):
    n = int(SR * .3); x = np.arange(n) / SR; put(np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-x / .035)) / SR) * env(n, .001, .13), at, 0, g)
def rim(at, g=.3, pan=.25):
    n = int(SR * .08); x = np.arange(n) / SR; nz = rng.standard_normal(n)
    put((np.sin(2 * np.pi * 1700 * x) * .7 + (nz - lp(nz, 3000)) * .5) * env(n, .0005, .012), at, pan, g)
def shaker(at, g=.1, pan=-.2):
    n = int(SR * .07); nz = rng.standard_normal(n); put((nz - lp(nz, 5500)) * env(n, .003, .018), at, pan, g)
def clap(at, g=.4):
    n = int(SR * .22); nz = rng.standard_normal(n); put((lp(nz, 6000) - lp(nz, 1000)) * env(n, .001, .05) * 2, at, .05, g)
def whoosh(at, dur, f0, f1, g):
    n = int(SR * dur); nz = rng.standard_normal(n); put((lp(nz, f1) - lp(nz, f0)) * np.linspace(0, 1, n) ** 2, at, 0, g)
LOG = [67, 72, 69, 74]
PENTA = [72, 74, 76, 79, 81, 84]
CLAVE = [0, 3, 6, 10, 12]
for b in range(NB):
    root, notes = CH[b % 4]; a = b * BAR
    choir(notes[:3] + [notes[3]], a, BAR, .07 if b > 0 else .05)
    # orgue : accords rythmés (3+3+2, plus un contretemps)
    for p in (0, 3, 6, 10, 14):
        if b < 1 and p > 6: continue
        organ(notes, a + p * S16, S16 * (3 if p in (0, 3) else 2) * .9, .075, .12)
    # basse syncopée
    for p, off in ((0, 0), (3, 0), (6, 12), (8, 0), (11, 0), (14, 12)):
        bass(root + off + (0 if off == 0 else 0), a + p * S16, S16 * 2.5, .5 if p != 6 else .35)
    # batterie : kick syncopé, clave au rim, claps 2 et 4, shaker en doubles croches
    for p in (0, 6, 8, 11):
        kick(a + p * S16, .9 if p == 0 else .55)
    if b >= 1:
        for p in CLAVE: rim(a + p * S16, .26)
        for p in (4, 12): clap(a + p * S16, .38)
        for p in range(16): shaker(a + p * S16, .12 if p % 4 == 0 else .06 + .03 * (p % 2))
    # log drum mélodique (réponse)
    if b >= 2:
        for k, p in enumerate((2, 5, 9, 13)): logdrum(LOG[(b + k) % 4] - 12 + (12 if k % 2 else 0), a + p * S16, .22, -.3 + .2 * k)
# mélodie « chantée » : appel et réponse, pentatonique
def lead(m, at, dur, g=.16):
    n = int(SR * (dur + .3)); x = np.arange(n) / SR; f = midi(m); vib = 1 + .008 * np.sin(2 * np.pi * 5.5 * x) * np.minimum(x / .3, 1)
    v = np.sin(2 * np.pi * f * x * vib) + .3 * np.sin(2 * np.pi * 2 * f * x * vib)
    put(lp(v, 3000) * np.minimum(x / .03, 1) * np.exp(-x / (dur * 1.3 + .1)) * np.clip((dur + .3 - x) / .3, 0, 1) * g, at, .1, 1)
PH = [(0, 79, 3), (4, 81, 2), (6, 79, 3), (10, 76, 3), (0, 84, 3), (4, 81, 2), (6, 79, 2), (9, 76, 4)]
for b in range(2, NB):
    base = ((b - 2) % 4) * 2
    for p, m, ln in PH[(b % 2) * 4:(b % 2) * 4 + 4]:
        lead(m, b * BAR + p * S16, ln * S16)
# impacts à chaque carte
for c in range(6):
    at = c * 6.0
    kick(at, 1.0); n = int(SR * .5); x = np.arange(n) / SR; put(np.sin(2 * np.pi * 62 * x) * env(n, .001, .24) * .5, at, 0, 1)
    whoosh(max(at - .5, 0), .5, 1500, 9000, .32)
    organ(CH[(c * 3) % 4][1], at, 1.0, .1, 0)
whoosh(34.0, 1.8, 700, 9000, .26)
# réverbération douce
irn = int(SR * 1.2); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / .3); ir = np.stack([lp(ir[0], 5000), lp(ir[1], 5000)])
def conv(x, h): m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max()); L2, R2 = L + .14 * pk * wL, R + .14 * pk * wR
fade = np.minimum(np.minimum(t / .05, 1), np.clip((DUR - t) / 1.3, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-3 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s, %d bpm" % (DUR, BPM))
