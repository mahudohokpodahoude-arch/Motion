# Sound design du générique de fin (4 s, stéréo 44,1 kHz) — 100 % synthétisé, aucune voix. Niveau : pic −9 dBFS.
import numpy as np, wave, sys
SR, DUR = 44100, 4.0
N = int(SR * DUR); rng = np.random.default_rng(242)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def env(n, a, d):
    x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def put(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR); s = sig[: max(0, N - i)]
    L[i:i + len(s)] += s * gain * np.sqrt(0.5 * (1 - pan)) * 1.0
    R[i:i + len(s)] += s * gain * np.sqrt(0.5 * (1 + pan)) * 1.0
def lowpass_sweep(x, f0, f1):
    n = len(x); f = np.linspace(f0, f1, n); a = 1 - np.exp(-2 * np.pi * f / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s += a[i] * (x[i] - s); y[i] = s
    return y
def bandpass_sweep(x, f0, f1):
    return lowpass_sweep(x, f0 * 1.6, f1 * 1.6) - lowpass_sweep(x, f0 * 0.6, f1 * 0.6)
def bell(freq, dur, dec=0.35, ratio=3.5, idx=2.2):
    n = int(SR * dur); x = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * x + idx * np.exp(-x / (dec * 0.6)) * np.sin(2 * np.pi * freq * ratio * x)) * env(n, 0.002, dec)
def whoosh(at, dur, f0, f1, gain, pan=0.0):
    n = int(SR * dur); w = bandpass_sweep(rng.standard_normal(n), f0, f1) * np.sin(np.linspace(0, np.pi, n)) ** 1.5
    put(w, at, pan, gain)

# nappe : même accord que le générique d'ouverture, qui gonfle puis se résout
pad = np.zeros(N)
for f, g in [(110, .55), (164.8, .4), (220, .35), (261.6, .22), (329.6, .16)]:
    for det in (-0.7, 0.7): pad += g * np.sin(2 * np.pi * (f + det) * t + rng.uniform(0, 6.28))
pad = lowpass_sweep(pad, 300, 1500)
put(pad * np.minimum(t / 1.4, 1) ** 2 * np.clip((DUR - t) / 1.1, 0, 1) * 0.07, 0, 0, 1)

# 0,15 s — le logo : « pop » doux + cloche
n = int(SR * 0.25); x = np.arange(n) / SR
put(np.sin(2 * np.pi * np.cumsum(260 + 800 * (1 - np.exp(-x / 0.035))) / SR) * env(n, 0.002, 0.07), 0.15, 0, 0.5)
put(bell(1318.5, 1.4, 0.55) * 0.3, 0.17, 0, 0.5)
# 0,55 → 1,0 s — éclats autour du logo (pentatonique descendante : l'inverse de l'ouverture)
for i, fq in enumerate([2093, 1760, 1568, 1318.5]):
    put(bell(fq, 1.2, 0.4) * 0.3, 0.55 + i * 0.1, -0.5 if i % 2 == 0 else 0.5, 0.5)
# 1,0 s — carte « téléphone » ; 1,45 s — carte « e-mail » : whoosh + impact léger + cloche
for at, fq, pan in [(1.0, 987.8, -0.2), (1.45, 1318.5, 0.2)]:
    whoosh(at - 0.18, 0.3, 700, 4200, 0.55, pan)
    n = int(SR * 0.5); x = np.arange(n) / SR
    put(np.sin(2 * np.pi * np.cumsum(55 + 70 * np.exp(-x / 0.05)) / SR) * env(n, 0.001, 0.14), at, 0, 0.6)
    put(bell(fq, 1.4, 0.55) * 0.3, at + 0.02, pan, 0.5)
# 1,9 → 2,2 s — quatre petites notes pour les icônes des réseaux
for i, fq in enumerate([1568, 1760, 1976, 2349]):
    put(bell(fq, 0.9, 0.3) * 0.22, 1.9 + i * 0.1, -0.4 + 0.27 * i, 0.5)
# 2,6 s — résolution finale : accord de cloches doux + coup grave, qui s'éteint
for fq, a in [(523.3, .45), (659.3, .4), (987.8, .3)]:
    put(bell(fq, 1.4, 0.8) * a, 2.6, 0, 0.5)
n = int(SR * 0.8); x = np.arange(n) / SR
put(np.sin(2 * np.pi * np.cumsum(46 + 70 * np.exp(-x / 0.05)) / SR) * env(n, 0.001, 0.2), 2.6, 0, 0.4)

irn = int(SR * 1.2); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / 0.3)
ir = np.stack([lowpass_sweep(ir[0], 6000, 1800), lowpass_sweep(ir[1], 6000, 1800)])
def conv(x, h):
    m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max())
L2, R2 = L + 0.2 * pk * wL * 0.9, R + 0.2 * pk * wR * 0.9
fade = np.minimum(np.minimum(t / 0.04, 1), np.clip((DUR - t) / 0.4, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-9 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print("OK : %.1f s, pic %.1f dBFS" % (DUR, 20 * np.log10(np.abs(out).max() / 32767)))
