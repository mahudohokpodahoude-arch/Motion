# Sound design du générique (6 s, stéréo 44,1 kHz) — 100 % synthétisé, aucune voix, aucun échantillon externe.
import numpy as np, wave, sys
SR, DUR = 44100, 4.0
K = 4.0 / 6.0                        # compression du rythme par rapport à la version de 6 s
N = int(SR * DUR); rng = np.random.default_rng(242)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)

def env(n, a, d):                       # attaque linéaire courte, décroissance exponentielle
    x = np.arange(n) / SR
    return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def put(sig, at, pan=0.0, gain=1.0):
    i = int(at * K * SR); s = sig[: max(0, N - i)]
    g = gain
    L[i:i + len(s)] += s * g * np.sqrt(0.5 * (1 - pan)) * 1.414 * 0.707
    R[i:i + len(s)] += s * g * np.sqrt(0.5 * (1 + pan)) * 1.414 * 0.707
def lowpass_sweep(x, f0, f1, q=0.0):    # filtre 1 pôle à fréquence variable
    n = len(x); f = np.linspace(f0, f1, n); a = 1 - np.exp(-2 * np.pi * f / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s += a[i] * (x[i] - s); y[i] = s
    return y
def bandpass_sweep(x, f0, f1):
    lo = lowpass_sweep(x, f0 * 1.6, f1 * 1.6); return lo - lowpass_sweep(x, f0 * 0.6, f1 * 0.6)
def bell(freq, dur, dec=0.35, ratio=3.5, idx=2.2):
    n = int(SR * dur); x = np.arange(n) / SR
    mod = idx * np.exp(-x / (dec * 0.6)) * np.sin(2 * np.pi * freq * ratio * x)
    return np.sin(2 * np.pi * freq * x + mod) * env(n, 0.002, dec)

# 1) nappe ambiante : accord Am9 doux, gonfle jusqu'à ~3 s puis retombe
pad = np.zeros(N)
for f, g in [(110, .55), (164.8, .4), (220, .35), (261.6, .22), (329.6, .16)]:
    for det in (-0.7, 0.7):
        pad += g * np.sin(2 * np.pi * (f + det) * t + rng.uniform(0, 6.28))
pad = lowpass_sweep(pad, 300, 1600)
swell = np.minimum(t / (2.6 * K), 1) ** 2 * np.clip((DUR - t) / 0.9, 0, 1)
put(pad * swell * 0.07, 0, 0, 1)

# 2) « pop » de la bulle (0,55 s) : glissando montant + clic
n = int(SR * 0.28); x = np.arange(n) / SR
f = 260 + 900 * (1 - np.exp(-x / 0.035)); ph = 2 * np.pi * np.cumsum(f) / SR
put(np.sin(ph) * env(n, 0.002, 0.07) * 0.9, 0.55, 0, 0.55)
put(rng.standard_normal(int(SR * 0.02)) * env(int(SR * 0.02), 0.0005, 0.004) * 0.35, 0.55, 0, 0.4)

# 3) whoosh d'entrée du titre (0,85 s) : bruit filtré qui monte, stéréo qui traverse
n = int(SR * 0.55); wh = rng.standard_normal(n); wh = bandpass_sweep(wh, 300, 5200)
shape = np.sin(np.linspace(0, np.pi, n)) ** 1.6; wh *= shape
iL = int(0.85 * K * SR); k = np.linspace(0, 1, n)
L[iL:iL + n] += wh * (1 - k) * 0.55; R[iL:iL + n] += wh * k * 0.55

# 4) impact du badge « PASTEURS » (1,25 s) : coup grave + souffle
n = int(SR * 0.9); x = np.arange(n) / SR
kick = np.sin(2 * np.pi * np.cumsum(46 + 90 * np.exp(-x / 0.05)) / SR) * env(n, 0.001, 0.22)
put(kick * 0.95, 1.25, 0, 0.9)
bur = lowpass_sweep(rng.standard_normal(int(SR * 0.4)), 4000, 400) * env(int(SR * 0.4), 0.001, 0.09)
put(bur * 0.5, 1.25, 0, 0.6)
put(bell(880, 1.4, 0.5, 2.0, 1.2) * 0.25, 1.27, 0.15, 0.5)

# 5) scintillement ascendant (2,0 → 2,7 s) : gamme pentatonique en cloches, panoramique alterné
notes = [880, 1046.5, 1318.5, 1568, 1760, 2093]
for i, fq in enumerate(notes):
    put(bell(fq, 1.6, 0.45) * 0.35, 2.0 + i * 0.12, -0.55 + 0.22 * i if i % 2 == 0 else 0.55 - 0.22 * i, 0.5)

# 6) entrée de la carte « question » (2,75 s) : petit whoosh + carillon
n = int(SR * 0.35); w2 = bandpass_sweep(rng.standard_normal(n), 700, 3800) * np.sin(np.linspace(0, np.pi, n)) ** 1.4
put(w2 * 0.6, 2.75, 0, 0.5)
put(bell(1318.5, 1.8, 0.7) * 0.4, 3.05, 0, 0.5); put(bell(1976, 1.8, 0.7) * 0.28, 3.12, 0, 0.5)

# 7) final (5,0 s) : accord de cloches + queue
for fq, a in [(659.3, .5), (987.8, .4), (1318.5, .35)]:
    put(bell(fq, 1.8, 0.9) * a, 4.95, 0, 0.5)
put(kick * 0.35, 4.95, 0, 0.5)

# réverbération : réponse impulsionnelle bruitée, décroissante (≈1,3 s), mélange 22 %
irn = int(SR * 1.3); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / 0.32)
ir = np.stack([lowpass_sweep(ir[0], 6000, 1800), lowpass_sweep(ir[1], 6000, 1800)])
def conv(x, h):
    m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max())
L2 = L + 0.22 * pk * wL * 0.9; R2 = R + 0.22 * pk * wR * 0.9
# fondu d'entrée/sortie de 40 ms, normalisation à −2 dBFS
fade = np.minimum(np.minimum(t / 0.04, 1), np.clip((DUR - t) / 0.25, 0, 1))
L2 *= fade; R2 *= fade
m = max(np.abs(L2).max(), np.abs(R2).max()); g = 10 ** (-2 / 20) / m
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sound.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
rms = np.sqrt(np.mean((out.astype(float) / 32767) ** 2))
print("OK : %.1f s, pic %.1f dBFS, RMS %.1f dBFS" % (DUR, 20 * np.log10(np.abs(out).max() / 32767), 20 * np.log10(rms)))
