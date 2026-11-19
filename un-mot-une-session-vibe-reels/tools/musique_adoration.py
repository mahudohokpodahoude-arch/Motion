# Musique originale « adoration afro » · 36 s · 80 bpm (mesure de 3 s : 2 mesures par carte) · do majeur : C · G · Am · F
# Piano doux, nappe de cordes, chœur « ooh », basse chaude, percussions légères (shaker filtré, tambour grave). 100 % synthétisée, sans voix.
import numpy as np, wave, sys
from scipy.signal import lfilter
SR, DUR, BPM = 44100, 36.0, 80
N = int(SR * DUR); BEAT = 60 / BPM; BAR = 4 * BEAT; NB = int(round(DUR / BAR)); S8 = BEAT / 2
rng = np.random.default_rng(242); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def put(sig, at, pan=0.0, g=1.0):
    i = int(round(at * SR))
    if i >= N or i < 0: return
    s = sig[: N - i]; L[i:i + len(s)] += s * g * np.sqrt(.5 * (1 - pan)); R[i:i + len(s)] += s * g * np.sqrt(.5 * (1 + pan))
def lp(x, f): a = 1 - np.exp(-2 * np.pi * f / SR); return lfilter([a], [1, -(1 - a)], x)
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
CH = [(36, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [60, 64, 69, 72]), (41, [60, 65, 69, 72])]
def piano(m, at, g=.2, pan=0.0, dur=1.6):
    n = int(SR * dur); x = np.arange(n) / SR; f = midi(m); o = np.zeros(n)
    for k, (w, d) in enumerate(((1, 1.2), (.5, .8), (.3, .5), (.18, .35), (.1, .25), (.06, .18)), 1):
        o += w * np.sin(2 * np.pi * f * k * (1 + 1e-4 * k * k) * x) * np.exp(-x / d)
    h = rng.standard_normal(int(SR * .02)); o[:len(h)] += lp(h, 2500) * .15 * np.linspace(1, 0, len(h))
    put(o * np.minimum(x / .004, 1) * np.clip((dur - x) / .2, 0, 1) * g, at, pan, 1)
def pad(notes, at, dur, g=.07):
    n = int(SR * (dur + .8)); x = np.arange(n) / SR; o = np.zeros(n)
    for m in notes:
        for det in (-.15, 0, .15):
            f = midi(m) * 2 ** (det / 12); o += (2 * ((x * f) % 1) - 1) * .35 + np.sin(2 * np.pi * f * x) * .65
    o = lp(o, 1300) * np.minimum(x / .9, 1) * np.clip((dur + .8 - x) / .8, 0, 1)
    put(o * g / len(notes), at, 0, 1)
def choir(notes, at, dur, g=.06):
    n = int(SR * (dur + .8)); x = np.arange(n) / SR; o = np.zeros(n)
    for j, m in enumerate(notes):
        for det in (-.2, .2):
            f = midi(m + 12) * 2 ** (det / 12); v = 1 + .005 * np.sin(2 * np.pi * (4.8 + .4 * j) * x + j)
            o += np.sin(2 * np.pi * f * x * v) + .35 * np.sin(2 * np.pi * 2 * f * x * v) + .12 * np.sin(2 * np.pi * 3 * f * x * v)
    put(lp(o, 1900) * np.minimum(x / .7, 1) * np.clip((dur + .8 - x) / .8, 0, 1) * g / len(notes), at, 0, 1)
def bass(m, at, dur, g=.5):
    n = int(SR * dur); x = np.arange(n) / SR; f = midi(m)
    put((np.sin(2 * np.pi * f * x) + .25 * np.sin(2 * np.pi * 2 * f * x)) * env(n, .015, dur * .8) * g, at, 0, 1)
def drum(at, g=.35, f0=95, pan=0.0):
    n = int(SR * .4); x = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f0 * (1 + .5 * np.exp(-x / .05))) / SR
    put(np.sin(ph) * env(n, .002, .14) * g, at, pan, 1)
def shaker(at, g=.05, pan=-.2):
    n = int(SR * .09); nz = rng.standard_normal(n); put(lp(nz - lp(nz, 3500), 7000) * env(n, .006, .03), at, pan, g)
def swell(at, dur, g=.18):
    n = int(SR * dur); nz = rng.standard_normal(n); put(lp(nz, 3200) * np.linspace(0, 1, n) ** 2.2, at, 0, g)
for b in range(NB):
    root, notes = CH[b % 4]; a = b * BAR
    pad(notes, a, BAR, .075)
    if b >= 2: choir(notes[:3], a, BAR, .06)
    bass(root, a, BEAT * 1.9, .5); bass(root, a + 2 * BEAT, BEAT * 1.4, .38)
    if b % 2 == 1: bass(root + 7, a + 3 * BEAT, BEAT * .9, .3)
    for i in range(8):                                  # piano : arpège en croches
        p = [0, 1, 2, 3, 2, 1, 2, 1][i]
        piano(notes[p] + 12 * (1 if p < 3 else 1), a + i * S8, .2 if i % 4 == 0 else .13, -.3 + .6 * (i / 7))
    if b >= 1:
        for i in range(8): shaker(a + i * S8, .055 if i % 2 else .08)
        drum(a + 1.5 * BEAT, .3, 110, -.2); drum(a + 3 * BEAT, .24, 140, .2)
        drum(a, .45, 60)
# mélodie douce (piano + clochette), appel et réponse
MEL = [(0, 79, 1.5), (2, 81, 1), (3, 79, 1), (4, 76, 2), (8, 79, 1), (9, 84, 2), (11, 81, 1), (12, 79, 2)]
for b in range(2, NB, 2):
    for p, m, ln in MEL[(0 if (b // 2) % 2 == 0 else 4):(4 if (b // 2) % 2 == 0 else 8)]:
        piano(m + 12, b * BAR + p * BEAT / 2 * 1.0, .2, .1, 1.8)
for c in range(6):                                      # nouvelle carte : respiration, tambour grave, clochette
    at = c * 6.0
    swell(max(at - .8, 0), .8, .16); drum(at, .6, 55); piano(96, at + .02, .12, 0, 2.0); piano(84, at + .02, .16, 0, 2.0)
irn = int(SR * 2.2); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / .55); ir = np.stack([lp(ir[0], 4500), lp(ir[1], 4500)])
def conv(x, h): m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max()); L2, R2 = L + .22 * pk * wL, R + .22 * pk * wR
fade = np.minimum(np.minimum(t / .08, 1), np.clip((DUR - t) / 1.6, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-3 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s, %d bpm" % (DUR, BPM))
