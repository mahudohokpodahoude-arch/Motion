# Sound design « L'essentiel à retenir du Message » (3 s, stéréo 44,1 kHz) — vibe motion : rythmique + pizzicati, 100 % synthétisé, sans voix.
import numpy as np, wave, sys
SR, DUR = 44100, 3.0
N = int(SR * DUR); rng = np.random.default_rng(242)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
BEAT = 0.375                                         # 160 bpm : les temps forts tombent à 0,25 · 0,625 · 1,0 · 1,375 · 1,75 · 2,125
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
def kick(at, g=1.0):
    n = int(SR * 0.35); x = np.arange(n) / SR
    put(np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-x / 0.04)) / SR) * env(n, 0.001, 0.12), at, 0, g)
def snap(at, g=0.6, pan=0.0):                        # claquement : bruit court filtré
    n = int(SR * 0.12); put(bandpass_sweep(rng.standard_normal(n), 2500, 6500) * env(n, 0.0005, 0.03), at, pan, g)
def pluck(freq, at, g=0.5, pan=0.0, dec=0.16):       # pizzicato / marimba : sinus + harmonique rapide
    n = int(SR * 0.6); x = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * x) + 0.45 * np.sin(2 * np.pi * freq * 3.99 * x) * np.exp(-x / 0.04)
    put(s * env(n, 0.002, dec), at, pan, g)
def pop(at, g=0.5):
    n = int(SR * 0.16); x = np.arange(n) / SR
    put(np.sin(2 * np.pi * np.cumsum(300 + 1100 * (1 - np.exp(-x / 0.025))) / SR) * env(n, 0.001, 0.045), at, 0, g)
def zip_(at, dur, f0, f1, g):                        # balayage de bruit (wipe)
    n = int(SR * dur); w = bandpass_sweep(rng.standard_normal(n), f0, f1) * np.sin(np.linspace(0, np.pi, n)) ** 1.3; put(w, at, 0, g)

zip_(0.0, 0.28, 300, 6000, 0.7)                                         # 0,00 : le rideau de couleur s'ouvre
kick(0.25, 1.0); snap(0.25, 0.5); pluck(220, 0.25, 0.5)                 # 0,25 : « L'ESSENTIEL »
kick(0.625, 0.8); snap(0.625, 0.55, 0.2); pop(0.64, 0.5); pluck(330, 0.625, 0.45, 0.2)   # 0,625 : « À RETENIR »
kick(1.0, 0.8); snap(1.0, 0.55, -0.2); zip_(0.98, 0.3, 600, 5000, 0.4); pluck(392, 1.0, 0.45, -0.2)   # 1,0 : « DU MESSAGE » + surligneur
for i, fq in enumerate([523.3, 659.3, 784, 1046.5]):                    # 1,375 : le trait ondulé se dessine, pizzicati montants
    pluck(fq, 1.375 + i * 0.0625, 0.38, -0.5 + 0.33 * i)
snap(1.375, 0.45)
pop(1.75, 0.5); pluck(1174.7, 1.75, 0.4, 0.3); kick(1.75, 0.55)         # 1,75 : le logo
for fq, a in [(523.3, .5), (659.3, .45), (784, .4), (1046.5, .3)]: pluck(fq, 2.125, a, 0, 0.35)   # 2,125 : accord final
kick(2.125, 0.9); snap(2.125, 0.5)
for i in range(3): pluck(1568 - 130 * i, 2.35 + i * 0.09, 0.2, 0.4 - 0.4 * i)   # queue scintillante

irn = int(SR * 0.7); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / 0.16)
ir = np.stack([lowpass_sweep(ir[0], 7000, 2500), lowpass_sweep(ir[1], 7000, 2500)])
def conv(x, h):
    m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max())
L2, R2 = L + 0.15 * pk * wL, R + 0.15 * pk * wR
fade = np.minimum(np.minimum(t / 0.01, 1), np.clip((DUR - t) / 0.25, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-9 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s, pic %.1f dBFS" % (DUR, 20 * np.log10(np.abs(out).max() / 32767)))
