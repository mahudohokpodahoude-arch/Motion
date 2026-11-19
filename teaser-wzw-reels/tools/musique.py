# Teaser « Coming soon » WZW — 12 s (reels), 120 bpm, do majeur. Synthétisé, sans voix. SANS cloches ni résonance de gong : coups secs, notes courtes, accords brefs.
# Temps forts : 0,5 W · 1,0 Z · 1,5 W · 2,0 allumage + « WEEK-END » · 2,5 « ZONE » · 3,0 « WOMEN » · 3,5 reflet · 4,0 accord final.
import numpy as np, wave, sys
SR, DUR, BPM = 44100, 12.0, 120
N = int(SR * DUR); BEAT = 60 / BPM
rng = np.random.default_rng(242); t = np.arange(N) / SR
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
def kick(at, g=1.0):
    n = int(SR * .4); x = np.arange(n) / SR; put(np.sin(2 * np.pi * np.cumsum(46 + 110 * np.exp(-x / .045)) / SR) * env(n, .001, .16), at, 0, g)
def clap(at, g=.5):
    n = int(SR * .25); nz = rng.standard_normal(n); put((lp(nz, 6000) - lp(nz, 900)) * env(n, .001, .05) * 2.2, at, .05, g)
def marimba(m, at, g=.3, pan=0.0, dec=.22):
    n = int(SR * .9); x = np.arange(n) / SR; f = midi(m)
    put((np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 3.99 * x) * np.exp(-x / .05) + .15 * np.sin(2 * np.pi * f * 9.2 * x) * np.exp(-x / .02)) * env(n, .002, dec), at, pan, g)
def bell(m, at, g=.3, pan=0.0, dur=1.6, dec=.5):
    n = int(SR * dur); x = np.arange(n) / SR; f = midi(m)
    put(np.sin(2 * np.pi * f * x + 2 * np.exp(-x / (dec * .6)) * np.sin(2 * np.pi * f * 3.5 * x)) * env(n, .002, dec), at, pan, g)
def stab(notes, at, g=.3, dur=.45, pan=0.0):
    n = int(SR * (dur + .15)); x = np.arange(n) / SR; v = np.zeros(n)
    for m in notes:
        for det in (-.1, .1):
            f = midi(m) * 2 ** (det / 12); v += (2 * ((x * f) % 1) - 1) * .5 + np.sin(2 * np.pi * f * x) * .5
    put(lp(v, 3200, 900) * np.minimum(x / .005, 1) * np.exp(-x / (dur * .45)) * np.clip((dur + .15 - x) / .12, 0, 1), at, pan, g * .5)
def whoosh(at, dur, f0, f1, g):
    n = int(SR * dur); nz = rng.standard_normal(n); put((lp(nz, f1) - lp(nz, f0)) * np.sin(np.linspace(0, np.pi, n)) ** 1.5, at, 0, g)

# nappe : accords longs
for a, d, notes in [(0, 3.5, [57, 60, 64]), (3.5, 3.5, [60, 64, 67]), (7.0, 2.5, [60, 64, 69]), (9.5, 2.5, [60, 65, 69])]:
    n = int(SR * (d + .5)); x = np.arange(n) / SR; pad = np.zeros(n)
    for m in notes:
        for det in (-.12, .12):
            f = midi(m) * 2 ** (det / 12); pad += (2 * ((x * f) % 1) - 1) * .5 + np.sin(2 * np.pi * f * x) * .5
    put(lp(pad, 500, 1500) * np.minimum(x / .4, 1) * np.clip((d + .5 - x) / .5, 0, 1) * .09, a, 0, 1)
def tick(at, g=.5, hi=2400):
    n = int(SR * .06); nz = rng.standard_normal(n); x = np.arange(n) / SR
    put((lp(nz, 7000) - lp(nz, hi)) * env(n, .0005, .008) * 3 + np.sin(2 * np.pi * 190 * x) * env(n, .0005, .02) * .5, at, 0, g)
# ticks du chronomètre : 0 -> 3,4 s, de plus en plus serrés
tt = 0.0; k = 0
while tt < 3.4:
    tick(tt, .35 + .25 * tt / 3.4, 2400 + int(1200 * tt / 3.4)); tt += max(.5 - .14 * k, .12); k += 1
# montée vers l'impact
for st, d, f1, g in [(1.6, 1.9, 6500, .5), (2.9, .6, 7500, .5)]:
    n = int(SR * d); nz = rng.standard_normal(n); put((lp(nz, f1) - lp(nz, 250)) * np.linspace(0, 1, n) ** 2.2 * g, st, 0, 1)

# impact (3,5) : COMING SOON s'efface, le logo se construit : W 3,5 · Z 4,0 · W 4,5
kick(3.5, 1.0); clap(3.5, .55); stab([60, 64, 67, 72], 3.5, .5, .5)
for at, m, pan in [(3.5, 60, -.4), (4.0, 64, 0.0), (4.5, 67, .4)]:
    if at > 3.5: kick(at, .9); clap(at, .3)
    marimba(m, at, .42, pan); marimba(m + 12, at + .02, .22, pan)
# mots : 5,0 · 5,5 · 6,0
kick(5.0, 1.0); clap(5.0, .5); stab([72, 76, 79, 84], 5.0, .5, .45)
for at, m, pan in [(5.0, 79, -.3), (5.5, 81, 0.0), (6.0, 84, .3)]:
    marimba(m, at + .02, .34, pan, .12)
    if at > 5.0: kick(at, .5)
# reflet (6,5)
whoosh(6.45, .5, 1200, 7000, .35)
for i, m in enumerate([88, 91, 93, 96]): marimba(m, 6.5 + i * .07, .16, -.5 + .33 * i, .06)
# dates (7,0) : accord sec puis arpège doux
kick(7.0, .8); clap(7.0, .4); stab([60, 64, 67, 72, 79], 7.0, .5, .6)
for i, m in enumerate([72, 76, 79, 76, 72, 76, 79, 84]): marimba(m, 7.5 + i * .25, .13, -.3 + .08 * i, .14)
whoosh(9.4, .4, 1500, 6500, .3)
# annonce (9,8) : accord final bref, puis nappe qui s'éteint
kick(9.8, .8); clap(9.8, .4); stab([60, 65, 69, 72, 77], 9.8, .6, .9)
irn = int(SR * .8); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / .18)
ir = np.stack([lp(ir[0], 6000, 1800), lp(ir[1], 6000, 1800)])
def conv(x, h):
    m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max()); L2, R2 = L + .18 * pk * wL, R + .18 * pk * wR
fade = np.minimum(np.minimum(t / .02, 1), np.clip((DUR - t) / .8, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-3 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s, pic %.1f dBFS" % (DUR, 20 * np.log10(np.abs(out).max() / 32767)))
