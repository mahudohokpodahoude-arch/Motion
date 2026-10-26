# Sound design « Je déclare » (3 s, stéréo 44,1 kHz) — 100 % synthétisé, aucune voix. Pic −9 dBFS.
import numpy as np, wave, sys
SR, DUR = 44100, 3.0
N = int(SR * DUR); rng = np.random.default_rng(242)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def env(n, a, d):
    x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def put(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR); s = sig[: max(0, N - i)]
    L[i:i + len(s)] += s * gain * np.sqrt(0.5 * (1 - pan)); R[i:i + len(s)] += s * gain * np.sqrt(0.5 * (1 + pan))
def lowpass_sweep(x, f0, f1):
    n = len(x); f = np.linspace(f0, f1, n); a = 1 - np.exp(-2 * np.pi * f / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s += a[i] * (x[i] - s); y[i] = s
    return y
def bandpass_sweep(x, f0, f1): return lowpass_sweep(x, f0 * 1.6, f1 * 1.6) - lowpass_sweep(x, f0 * 0.6, f1 * 0.6)
def bell(freq, dur, dec=0.35, ratio=3.5, idx=2.2):
    n = int(SR * dur); x = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * x + idx * np.exp(-x / (dec * 0.6)) * np.sin(2 * np.pi * freq * ratio * x)) * env(n, 0.002, dec)

# nappe grave (même accord que la série), qui se tend puis tient
pad = np.zeros(N)
for f, g in [(110, .6), (164.8, .4), (220, .35), (329.6, .15)]:
    for det in (-0.7, 0.7): pad += g * np.sin(2 * np.pi * (f + det) * t + rng.uniform(0, 6.28))
pad = lowpass_sweep(pad, 250, 1300)
put(pad * np.minimum(t / 0.6, 1) ** 2 * np.clip((DUR - t) / 0.8, 0, 1) * 0.08, 0, 0, 1)

# 0,0 → 0,55 s — montée : bruit filtré qui monte (tension avant le mot)
n = int(SR * 0.55); r = bandpass_sweep(rng.standard_normal(n), 200, 5500) * np.linspace(0, 1, n) ** 2.2
put(r, 0.0, 0, 0.6)
# 0,55 s — IMPACT du mot « DÉCLARE » : coup grave profond + claque + cloche
n = int(SR * 1.1); x = np.arange(n) / SR
put(np.sin(2 * np.pi * np.cumsum(40 + 110 * np.exp(-x / 0.05)) / SR) * env(n, 0.001, 0.3), 0.55, 0, 1.0)
bur = lowpass_sweep(rng.standard_normal(int(SR * 0.45)), 6000, 500) * env(int(SR * 0.45), 0.001, 0.1)
put(bur, 0.55, 0, 0.7)
put(bell(659.3, 1.6, 0.8, 2.0, 1.4) * 0.35, 0.56, 0, 0.5)
# 0,85 s — la barre orange balaie (whoosh gauche → droite)
n = int(SR * 0.4); w = bandpass_sweep(rng.standard_normal(n), 500, 5000) * np.sin(np.linspace(0, np.pi, n)) ** 1.4
k = np.linspace(0, 1, n); i0 = int(0.85 * SR)
L[i0:i0 + n] += w * (1 - k) * 0.6; R[i0:i0 + n] += w * k * 0.6
# 1,2 → 1,45 s — les guillemets : deux cloches, une à chaque côté
put(bell(987.8, 1.2, 0.5) * 0.35, 1.2, -0.6, 0.5); put(bell(1318.5, 1.2, 0.5) * 0.35, 1.32, 0.6, 0.5)
# 2,2 s — résolution : accord ouvert qui s'éteint
for fq, a in [(523.3, .45), (783.9, .35), (1046.5, .28)]: put(bell(fq, 0.8, 0.7) * a, 2.2, 0, 0.5)

irn = int(SR * 1.1); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / 0.28)
ir = np.stack([lowpass_sweep(ir[0], 6000, 1800), lowpass_sweep(ir[1], 6000, 1800)])
def conv(x, h):
    m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max())
L2, R2 = L + 0.2 * pk * wL * 0.9, R + 0.2 * pk * wR * 0.9
fade = np.minimum(np.minimum(t / 0.03, 1), np.clip((DUR - t) / 0.3, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-9 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s, pic %.1f dBFS" % (DUR, 20 * np.log10(np.abs(out).max() / 32767)))
