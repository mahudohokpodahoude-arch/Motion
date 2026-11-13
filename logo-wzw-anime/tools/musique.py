# Jingle « WZW » — 5 s, 120 bpm, do majeur, stéréo 44,1 kHz. Synthétisé, sans voix.
# Temps forts : 0,5 W · 1,0 Z · 1,5 W · 2,0 allumage + « WEEK-END » · 2,5 « ZONE » · 3,0 « WOMEN » · 3,5 reflet · 4,0 accord final.
import numpy as np, wave, sys
SR, DUR, BPM = 44100, 5.0, 120
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
# nappe : un accord par mesure d'un temps ou deux
for a, d, notes in [(0, 2.0, [60, 64, 67]), (2.0, 1.0, [60, 64, 69]), (3.0, 1.0, [60, 65, 69]), (4.0, 1.0, [60, 64, 67, 72])]:
    n = int(SR * (d + .5)); x = np.arange(n) / SR; pad = np.zeros(n)
    for m in notes:
        for det in (-.12, .12):
            f = midi(m) * 2 ** (det / 12); pad += (2 * ((x * f) % 1) - 1) * .5 + np.sin(2 * np.pi * f * x) * .5
    put(lp(pad, 600, 1700) * np.minimum(x / .2, 1) * np.clip((d + .5 - x) / .5, 0, 1) * .1, a, 0, 1)
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
# riser d'ouverture + montée avant l'allumage
n = int(SR * .5); nz = rng.standard_normal(n); put((lp(nz, 5500) - lp(nz, 200)) * np.linspace(0, 1, n) ** 2 * .5, 0.0, 0, 1)
n = int(SR * .5); nz = rng.standard_normal(n); put((lp(nz, 6500) - lp(nz, 400)) * np.linspace(0, 1, n) ** 2.2 * .55, 1.5, 0, 1)
# W · Z · W : coup + note montante
for at, m, pan in [(0.5, 60, -.4), (1.0, 64, 0.0), (1.5, 67, .4)]:
    kick(at, .95); clap(at + 0.0, .3); marimba(m, at, .42, pan); marimba(m + 12, at + .02, .22, pan)
# allumage : gros coup + accord brillant + claquement
kick(2.0, 1.0); clap(2.0, .6)
for m, pan in [(72, -.3), (76, 0), (79, .3), (84, 0)]: bell(m, 2.0, .26, pan, 1.8, .6)
# mots : pizzicati
for at, m, pan in [(2.0, 79, -.3), (2.5, 81, 0.0), (3.0, 84, .3)]:
    marimba(m, at + .02, .34, pan, .3); kick(at + (0 if at > 2.0 else 0), .5 if at > 2.0 else 0)
# reflet (3,5) : étincelles
for i, m in enumerate([88, 91, 93, 96]): bell(m, 3.5 + i * .07, .16, -.5 + .33 * i, .9, .3)
# accord final (4,0)
kick(4.0, .8); clap(4.0, .4)
for m, a in [(60, .5), (64, .45), (67, .4), (72, .35), (79, .25)]: bell(m, 4.0, a, 0, 1.3, .9)
irn = int(SR * 1.2); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / .3)
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
