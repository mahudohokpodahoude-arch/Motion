# Musique originale « Dr Hestia » — 10 s, 120 bpm, do majeur (Do · Sol · La m · Fa · Do), stéréo 44,1 kHz.
# 100 % synthétisée : nappe chaude, basse, arpège de marimba, batterie légère, mélodie. Aucune voix, aucun échantillon externe.
import numpy as np, wave, sys
SR, DUR, BPM = 44100, 10.0, 120
N = int(SR * DUR); BEAT = 60 / BPM; BAR = 4 * BEAT
rng = np.random.default_rng(242); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
def put(sig, at, pan=0.0, g=1.0):
    i = int(at * SR)
    if i >= N: return
    s = sig[: N - i]
    L[i:i + len(s)] += s * g * np.sqrt(0.5 * (1 - pan)); R[i:i + len(s)] += s * g * np.sqrt(0.5 * (1 + pan))
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def lp(x, f0, f1=None):
    f1 = f0 if f1 is None else f1
    n = len(x); f = np.linspace(f0, f1, n); a = 1 - np.exp(-2 * np.pi * f / SR); y = np.zeros(n); s = 0.0
    for i in range(n): s += a[i] * (x[i] - s); y[i] = s
    return y
def midi(m): return 440 * 2 ** ((m - 69) / 12)
CH = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69]), (48, [60, 64, 67, 72])]   # basse, accord
# nappe chaude (détune, filtre qui s'ouvre), un accord par mesure
for b, (root, notes) in enumerate(CH):
    a = b * BAR; d = BAR if b < 4 else DUR - a
    n = int(SR * (d + 0.5)); x = np.arange(n) / SR; pad = np.zeros(n)
    for m in notes:
        for det in (-0.12, 0.12):
            f = midi(m) * 2 ** (det / 12); pad += (2 * ((x * f) % 1) - 1) * 0.5 + np.sin(2 * np.pi * f * x) * 0.5
    pad = lp(pad, 700, 1500) * np.minimum(x / 0.25, 1) * np.clip((d + 0.5 - x) / 0.5, 0, 1) * 0.09
    put(pad, a, 0, 1)
# basse (blanche + croche)
for b, (root, notes) in enumerate(CH):
    for k, (off, ln) in enumerate([(0, 1.5), (2, 0.9), (3, 0.9)]):
        if b == 4 and k > 0: continue
        n = int(SR * ln * BEAT); x = np.arange(n) / SR; f = midi(root - 12 if k == 0 else root)
        put(np.sin(2 * np.pi * f * x) * env(n, 0.01, 0.35) * 0.55, b * BAR + off * BEAT, 0, 1)
# arpège de marimba (croches)
def marimba(m, at, g=0.3, pan=0.0):
    n = int(SR * 0.8); x = np.arange(n) / SR; f = midi(m)
    put((np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * f * 3.99 * x) * np.exp(-x / 0.05) + 0.15 * np.sin(2 * np.pi * f * 9.2 * x) * np.exp(-x / 0.02)) * env(n, 0.002, 0.2), at, pan, g)
for b, (root, notes) in enumerate(CH):
    pat = [0, 1, 2, 1, 0, 1, 2, 1] if b < 4 else [0, 1, 2, 3]
    for i, p in enumerate(pat):
        at = b * BAR + i * (BEAT / 2 if b < 4 else BEAT)
        marimba(notes[p % len(notes)] + 12, at, 0.26 if b > 0 else 0.2, -0.35 + 0.7 * ((i % 4) / 3))
# mélodie (mesures 3-4 : montée, puis résolution mesure 5)
MEL = [(2 * BAR + 0.0, 76, 1.0), (2 * BAR + 1.0, 79, 0.5), (2 * BAR + 1.5, 81, 1.0), (2 * BAR + 3.0, 79, 1.0),
       (3 * BAR + 0.0, 77, 1.0), (3 * BAR + 1.0, 81, 0.5), (3 * BAR + 1.5, 84, 1.5), (4 * BAR + 0.0, 84, 4.0)]
for at, m, ln in MEL:
    n = int(SR * (ln * BEAT + 0.4)); x = np.arange(n) / SR; f = midi(m)
    v = (np.sin(2 * np.pi * f * x + 0.35 * np.sin(2 * np.pi * f * x * 2)) + 0.3 * np.sin(2 * np.pi * f * 2 * x)) * np.minimum(x / 0.02, 1) * np.exp(-x / (ln * BEAT * 1.2 + 0.1)) * np.clip((ln * BEAT + 0.4 - x) / 0.3, 0, 1)
    put(v * 0.22, at, 0.1, 1)
# batterie : kick (temps 1 et 3), clap (2 et 4), charleston (croches), dès la mesure 2
def kick(at, g=1.0):
    n = int(SR * 0.35); x = np.arange(n) / SR; put(np.sin(2 * np.pi * np.cumsum(50 + 100 * np.exp(-x / 0.04)) / SR) * env(n, 0.001, 0.14), at, 0, g)
def clap(at, g=0.5):
    n = int(SR * 0.25); nz = rng.standard_normal(n); nz = lp(nz, 6000) - lp(nz, 900); put(nz * env(n, 0.001, 0.05) * 2.2, at, 0.05, g)
def hat(at, g=0.18, op=0.03):
    n = int(SR * 0.1); nz = rng.standard_normal(n); nz = nz - lp(nz, 6500); put(nz * env(n, 0.0005, op) * 1.4, at, -0.1, g)
for b in range(1, 5):
    for k in range(4):
        at = b * BAR + k * BEAT
        if b == 4 and k > 0: continue
        if k in (0, 2): kick(at, 0.85)
        else: clap(at, 0.45)
    if b < 4:
        for i in range(8): hat(b * BAR + i * BEAT / 2, 0.16 if i % 2 else 0.1)
kick(0, 0.6)                                    # départ : un seul kick doux
for i in range(4): hat(i * BEAT, 0.07)           # intro : charleston discret
# réverbération
irn = int(SR * 1.3); ir = rng.standard_normal((2, irn)) * np.exp(-np.arange(irn) / SR / 0.32)
ir = np.stack([lp(ir[0], 6000, 1800), lp(ir[1], 6000, 1800)])
def conv(x, h):
    m = 1 << int(np.ceil(np.log2(len(x) + len(h)))); return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m))[: len(x)]
wL, wR = conv(L, ir[0]), conv(R, ir[1]); wL /= np.abs(wL).max() + 1e-9; wR /= np.abs(wR).max() + 1e-9
pk = max(np.abs(L).max(), np.abs(R).max()); L2, R2 = L + 0.16 * pk * wL, R + 0.16 * pk * wR
fade = np.minimum(np.minimum(t / 0.05, 1), np.clip((DUR - t) / 1.3, 0, 1)); L2 *= fade; R2 *= fade
g = 10 ** (-3 / 20) / max(np.abs(L2).max(), np.abs(R2).max())
out = (np.stack([L2, R2], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK : %.1f s, %d bpm, pic %.1f dBFS" % (DUR, BPM, 20 * np.log10(np.abs(out).max() / 32767)))
