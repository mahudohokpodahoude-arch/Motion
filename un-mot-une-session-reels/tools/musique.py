# Musique originale « Un mot, une session » · 36 s · 120 bpm · do majeur (Do · Sol · La m · Fa), 100 % synthétisée, sans voix.
# 6 cartes de 6 s = 3 mesures chacune : un impact à chaque changement de carte (0, 6, 12, 18, 24, 30 s).
import numpy as np, wave, sys
SR, DUR, BPM = 44100, 36.0, 120
N = int(SR * DUR); BEAT = 60 / BPM; BAR = 4 * BEAT; NB = int(DUR / BAR)
rng = np.random.default_rng(242); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def put(sig, at, pan=0.0, g=1.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    s = sig[: N - i]; L[i:i + len(s)] += s * g * np.sqrt(.5 * (1 - pan)); R[i:i + len(s)] += s * g * np.sqrt(.5 * (1 + pan))
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def lp(x, f0, f1=None):
    f1 = f0 if f1 is None else f1; n = len(x); f = np.linspace(f0, f1, n); a = 1 - np.exp(-2 * np.pi * f / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s += a[i] * (x[i] - s); y[i] = s
    return y
def midi(m): return 440 * 2 ** ((m - 69) / 12)
CH = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]
for b in range(NB):
    root, notes = CH[b % 4]; a = b * BAR
    n = int(SR * (BAR + .4)); x = np.arange(n) / SR; pad = np.zeros(n)
    for m in notes:
        for det in (-.12, .12):
            f = midi(m) * 2 ** (det / 12); pad += (2 * ((x * f) % 1) - 1) * .5 + np.sin(2 * np.pi * f * x) * .5
    put(lp(pad, 700, 1600) * np.minimum(x / .25, 1) * np.clip((BAR + .4 - x) / .4, 0, 1) * .085, a, 0, 1)
    for off, ln, oc in [(0, 1.5, -12), (2, .9, 0), (3, .9, 0)]:
        n = int(SR * ln * BEAT); x = np.arange(n) / SR; f = midi(root + oc)
        put(np.sin(2 * np.pi * f * x) * env(n, .01, .35) * .55, a + off * BEAT, 0, 1)
def marimba(m, at, g=.26, pan=0.0):
    n = int(SR * .8); x = np.arange(n) / SR; f = midi(m)
    put((np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 3.99 * x) * np.exp(-x / .05) + .15 * np.sin(2 * np.pi * f * 9.2 * x) * np.exp(-x / .02)) * env(n, .002, .2), at, pan, g)
for b in range(NB):
    root, notes = CH[b % 4]
    for i, p in enumerate([0, 1, 2, 1, 0, 1, 2, 1]): marimba(notes[p % 3] + 12, b * BAR + i * BEAT / 2, .22 + .06 * (b > 0), -.35 + .7 * ((i % 4) / 3))
LEAD = [76, 79, 81, 79, 77, 81, 84, 81]
for b in range(2, NB):
    for k in range(2):
        m = LEAD[((b - 2) * 2 + k) % len(LEAD)]; ln = 1.5
        n = int(SR * (ln * BEAT + .4)); x = np.arange(n) / SR; f = midi(m)
        v = (np.sin(2 * np.pi * f * x + .35 * np.sin(2 * np.pi * f * x * 2)) + .3 * np.sin(2 * np.pi * f * 2 * x)) * np.minimum(x / .02, 1) * np.exp(-x / (ln * BEAT * 1.2 + .1)) * np.clip((ln * BEAT + .4 - x) / .4, 0, 1)
        put(v * .18, b * BAR + (0 if k == 0 else 2.5 * BEAT), .1, 1)
def kick(at, g=1.0):
    n = int(SR * .35); x = np.arange(n) / SR; put(np.sin(2 * np.pi * np.cumsum(50 + 100 * np.exp(-x / .04)) / SR) * env(n, .001, .14), at, 0, g)
def clap(at, g=.5):
    n = int(SR * .25); nz = rng.standard_normal(n); nz = lp(nz, 6000) - lp(nz, 900); put(nz * env(n, .001, .05) * 2.2, at, .05, g)
def hat(at, g=.16, op=.03):
    n = int(SR * .1); nz = rng.standard_normal(n); nz = nz - lp(nz, 6500); put(nz * env(n, .0005, op) * 1.4, at, -.1, g)
def whoosh(at, dur, f0, f1, g, rise=True):
    n = int(SR * dur); nz = rng.standard_normal(n); sh = np.linspace(0, 1, n) ** 2 if rise else np.sin(np.linspace(0, np.pi, n)) ** 1.5
    put((lp(nz, f1) - lp(nz, f0)) * sh, at, 0, g)
for b in range(1, NB):
    for k in range(4):
        (kick if k in (0, 2) else clap)(b * BAR + k * BEAT, .85 if k in (0, 2) else .45)
    for i in range(8): hat(b * BAR + i * BEAT / 2, .16 if i % 2 else .1)
kick(0, .6)
for c in range(6):                                   # impact à chaque nouvelle carte
    at = c * 6.0
    kick(at, 1.0); whoosh(max(at - .45, 0), .45, 1200, 8000, .35); n = int(SR * .5); x = np.arange(n) / SR
    put(np.sin(2 * np.pi * 70 * x) * env(n, .001, .25) * .5, at, 0, 1)
    marimba(84, at + .05, .3, 0)
whoosh(34.0, 1.8, 600, 9000, .3)
irn = int(SR * 1.3); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / .32); ir = np.stack([lp(ir[0], 6000, 1800), lp(ir[1], 6000, 1800)])
def conv(x, h): m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max()); L2, R2 = L + .16 * pk * wL, R + .16 * pk * wR
fade = np.minimum(np.minimum(t / .05, 1), np.clip((DUR - t) / 1.3, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-3 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s" % DUR)
