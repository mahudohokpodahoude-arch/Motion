# Sound design « Présentation d'une intervenante » (10 s, stéréo 44,1 kHz) — 100 % synthétisé, sans voix. Pic −9 dBFS.
import numpy as np, wave, sys
SR, DUR = 44100, 10.0
N = int(SR * DUR); rng = np.random.default_rng(242); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def put(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR); s = sig[: max(0, N - i)]
    L[i:i + len(s)] += s * gain * np.sqrt(0.5 * (1 - pan)); R[i:i + len(s)] += s * gain * np.sqrt(0.5 * (1 + pan))
def lp(x, f0, f1):
    n = len(x); f = np.linspace(f0, f1, n); a = 1 - np.exp(-2 * np.pi * f / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s += a[i] * (x[i] - s); y[i] = s
    return y
def bp(x, f0, f1): return lp(x, f0 * 1.6, f1 * 1.6) - lp(x, f0 * 0.6, f1 * 0.6)
def bell(freq, dur, dec=0.4, ratio=3.5, idx=2.2):
    n = int(SR * dur); x = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * x + idx * np.exp(-x / (dec * 0.6)) * np.sin(2 * np.pi * freq * ratio * x)) * env(n, 0.002, dec)
def pluck(freq, at, g=0.5, pan=0.0, dec=0.18):
    n = int(SR * 0.7); x = np.arange(n) / SR
    put((np.sin(2 * np.pi * freq * x) + 0.45 * np.sin(2 * np.pi * freq * 3.99 * x) * np.exp(-x / 0.04)) * env(n, 0.002, dec), at, pan, g)
def kick(at, g=1.0):
    n = int(SR * 0.4); x = np.arange(n) / SR
    put(np.sin(2 * np.pi * np.cumsum(46 + 110 * np.exp(-x / 0.05)) / SR) * env(n, 0.001, 0.16), at, 0, g)
def whoosh(at, dur, f0, f1, g, pan=0.0):
    n = int(SR * dur); put(bp(rng.standard_normal(n), f0, f1) * np.sin(np.linspace(0, np.pi, n)) ** 1.5, at, pan, g)
pad = np.zeros(N)
for f, g in [(110, .55), (164.8, .4), (220, .35), (261.6, .22), (329.6, .16)]:
    for det in (-0.7, 0.7): pad += g * np.sin(2 * np.pi * (f + det) * t + rng.uniform(0, 6.28))
pad = lp(pad, 300, 1500)
put(pad * np.minimum(t / 2.0, 1) ** 2 * np.clip((DUR - t) / 1.4, 0, 1) * 0.07, 0, 0, 1)
whoosh(0.0, 0.5, 300, 5500, 0.6)                                         # 0,0  : rideau
kick(0.85, 0.9); whoosh(0.7, 0.35, 500, 5000, 0.5); put(bell(659.3, 1.6, 0.8) * 0.35, 0.87, 0, 0.5)   # 0,85 : « DR HESTIA »
for at, fq, pan in [(2.2, 987.8, -0.3), (3.2, 1174.7, 0.0), (4.2, 1318.5, 0.3)]:   # cartes de titres
    whoosh(at - 0.2, 0.3, 700, 4200, 0.5, pan); pluck(fq / 2, at, 0.4, pan); put(bell(fq, 1.4, 0.55) * 0.3, at + 0.02, pan, 0.5)
for at, fq, pan in [(5.9, 784, -0.3), (6.7, 988, 0.3)]:                    # panels
    whoosh(at - 0.18, 0.28, 600, 4500, 0.5, pan); kick(at, 0.55); pluck(fq, at, 0.45, pan); put(bell(fq * 2, 1.2, 0.5) * 0.28, at + 0.02, pan, 0.5)
for i, fq in enumerate([1568, 1760, 1976, 2349]): put(bell(fq, 0.9, 0.3) * 0.2, 7.5 + i * 0.1, -0.4 + 0.27 * i, 0.5)
for fq, a in [(523.3, .5), (659.3, .45), (784, .4), (1046.5, .3)]: put(bell(fq, 1.6, 0.8) * a, 8.6, 0, 0.5)   # 8,6 : final
kick(8.6, 0.8)
irn = int(SR * 1.2); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / 0.3)
ir = np.stack([lp(ir[0], 6000, 1800), lp(ir[1], 6000, 1800)])
def conv(x, h):
    m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max()); L2, R2 = L + 0.2 * pk * wL * 0.9, R + 0.2 * pk * wR * 0.9
fade = np.minimum(np.minimum(t / 0.03, 1), np.clip((DUR - t) / 0.5, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-9 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s, pic %.1f dBFS" % (DUR, 20 * np.log10(np.abs(out).max() / 32767)))
