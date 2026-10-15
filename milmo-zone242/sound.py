"""Sound design for the MILMO -> ZONE 242 film, synthesised from scratch.

Every cue is placed on the timeline of index.html (seconds).
Usage: python3 sound.py out.wav
Needs numpy + scipy.
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 10.0
N = int(SR * DUR)
rng = np.random.default_rng(242)

dry = np.zeros((2, N))
send = np.zeros((2, N))   # reverb send


def place(sig, t0, gain=1.0, pan=0.0, verb=0.3):
    """Add a mono signal at t0 (s), equal-power pan in [-1, 1]."""
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    a = (pan + 1) * np.pi / 4
    lr = np.array([np.cos(a), np.sin(a)])[:, None] * sig
    dry[:, i:i + sig.size] += lr
    send[:, i:i + sig.size] += lr * verb


def svf_sweep(x, f0, f1, q=2.0, mode="bp"):
    """Chamberlin state-variable filter with an exponential cutoff sweep."""
    n = x.size
    f = f0 * (f1 / f0) ** np.linspace(0, 1, n)
    g = 2 * np.sin(np.pi * np.clip(f, 20, SR / 6) / SR)
    damp = 1.0 / q
    low = band = 0.0
    out = np.empty(n)
    for i in range(n):
        high = x[i] - low - damp * band
        band += g[i] * high
        low += g[i] * band
        out[i] = band if mode == "bp" else low
    return out


def noise(d):
    return rng.standard_normal(int(d * SR))


def fade_shape(n, peak_at):
    """Swell up to peak_at (0..1) then fall away: the body of a whoosh."""
    x = np.linspace(0, 1, n)
    up = np.clip(x / peak_at, 0, 1) ** 2
    down = np.clip((1 - x) / (1 - peak_at), 0, 1) ** 1.5
    return np.minimum(up, down)


# ---------- instruments ----------
def whoosh(d, f0, f1, peak=0.6, q=1.6):
    s = svf_sweep(noise(d), f0, f1, q)
    return s * fade_shape(s.size, peak) / (np.abs(s).max() + 1e-9)


def impact(d=2.2, f0=110, f1=38):
    n = int(d * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 18)) / SR
    body = np.sin(ph) * np.exp(-t * 2.4)
    crack = sosfilt(butter(2, [300, 4000], 'bp', fs=SR, output='sos'), rng.standard_normal(n)) * np.exp(-t * 35)
    return body * 0.9 + crack * 0.25


def bell(freq, d=2.5, decay=2.2, bright=1.0):
    n = int(d * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for ratio, amp, dk in [(1, 1, 1), (2.0, .45, 1.4), (2.76, .3 * bright, 2.2), (5.4, .15 * bright, 3.5)]:
        s += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * decay * dk)
    s *= np.minimum(1, t / 0.004)
    return s / np.abs(s).max()


def pop(f0=520, f1=260, d=0.12):
    n = int(d * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 60)) / SR
    s = np.sin(ph) * np.exp(-t * 38)
    click = rng.standard_normal(n) * np.exp(-t * 900) * 0.3
    return s + click


def tick(d=0.04, hp=3000):
    n = int(d * SR)
    t = np.arange(n) / SR
    return sosfilt(butter(2, hp, 'hp', fs=SR, output='sos'), rng.standard_normal(n)) * np.exp(-t * 160)


def thud(f=70, d=0.35):
    n = int(d * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f + 90 * np.exp(-t * 40)) / SR
    return np.sin(ph) * np.exp(-t * 14) + tick(d, 1800)[:n] * 0.5


def shimmer(d, start_hz=1800, count=26):
    n = int(d * SR)
    s = np.zeros(n)
    for _ in range(count):
        at = int(rng.uniform(0, 0.8) * n)
        f = start_hz * 2 ** rng.uniform(0, 1.6)
        g = bell(f, d=0.8, decay=5, bright=0.4) * rng.uniform(0.3, 1)
        m = min(g.size, n - at)
        s[at:at + m] += g[:m]
    return s / (np.abs(s).max() + 1e-9) * fade_shape(n, 0.3)


def riser(d, f0, f1):
    n = int(d * SR)
    t = np.linspace(0, 1, n)
    ph = 2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (t ** 2)) / SR
    tone = np.sin(ph) + 0.4 * np.sin(2 * ph + 0.3)
    air = svf_sweep(noise(d), 400, 7000, 1.2)
    air /= np.abs(air).max()
    return (tone * 0.5 + air * 0.6) * t ** 2.2


def pad(notes, d, attack, release):
    n = int(d * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in notes:
        for det in (-0.12, 0.0, 0.12):         # slightly detuned saws
            fr = f * 2 ** (det / 12)
            s += ((t * fr + rng.uniform()) % 1.0) * 2 - 1
    s = sosfilt(butter(2, 1300, 'lp', fs=SR, output='sos'), s)
    e = np.minimum(1, t / attack) * np.minimum(1, (d - t) / release)
    s = s * np.clip(e, 0, 1)
    return s / (np.abs(s).max() + 1e-9)


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


# ---------- timeline ----------
D2, A2, D3, E3, G3, A3, D4, Fs3, E4 = (hz(m) for m in (38, 45, 50, 52, 55, 57, 62, 54, 64))

# bed: suspended (the mission waiting) -> resolved major at the birth
place(pad([D2, A2, D3, G3, A3], 3.9, 1.2, 0.7), 0.0, 0.16, 0, 0.5)
place(pad([D2, A2, D3, Fs3, A3, E4], 6.75, 0.35, 1.8), 3.25, 0.17, 0, 0.6)

# 1. MILMO letters rise, globe appears, tagline
for i in range(4):
    place(whoosh(0.32, 900, 3200, 0.75, 2.5), 0.08 + i * 0.09, 0.22, -0.5 + i * 0.25, 0.25)
    place(tick(), 0.36 + i * 0.09, 0.18, -0.5 + i * 0.25, 0.3)
place(pop(380, 190, 0.25), 0.62, 0.45, 0.45, 0.4)
place(bell(hz(74), 2.0, 2.4), 0.66, 0.16, 0.45, 0.6)
place(shimmer(1.4, 2400, 18), 0.95, 0.10, 0.2, 0.7)

# 2. letters fall away, globe travels to the centre, birth
place(whoosh(0.7, 3000, 500, 0.35), 2.48, 0.32, -0.3, 0.3)
place(riser(0.85, 90, 420), 2.55, 0.32, 0, 0.4)
place(impact(), 3.36, 0.85, 0, 0.35)
place(bell(hz(62), 3.5, 1.3), 3.36, 0.30, -0.15, 0.8)
place(bell(hz(69), 3.5, 1.3), 3.38, 0.22, 0.15, 0.8)
place(shimmer(1.8, 2000, 34), 3.38, 0.22, 0, 0.8)
place(whoosh(1.0, 250, 6000, 0.4, 0.9), 3.25, 0.28, 0, 0.5)   # the wipe

# 3. ZONE 242 assembles
place(pop(900, 420, 0.14), 4.33, 0.4, 0, 0.35)                # centre born from the globe
place(whoosh(0.9, 600, 4200, 0.6), 4.55, 0.32, 0.2, 0.3)       # centre rises
place(whoosh(1.0, 3500, 700, 0.5), 4.4, 0.24, -0.3, 0.3)       # globe drops into the O
for i, p in enumerate((-0.6, 0.6, 0.6, -0.6)):                 # four corners land
    place(thud(), 5.5 + i * 0.07, 0.5, p, 0.25)
place(whoosh(0.5, 1200, 3800, 0.7, 2.2), 5.3, 0.22, -0.6, 0.25)  # Z
place(whoosh(0.5, 900, 3000, 0.7, 2.2), 5.45, 0.2, -0.4, 0.25)   # NE
zip_ = svf_sweep(noise(1.1), 1500, 6500, 4.0)
zip_ = zip_ / np.abs(zip_).max() * (0.6 + 0.4 * np.sin(np.linspace(0, 70, zip_.size))) * fade_shape(zip_.size, 0.85)
place(zip_, 5.6, 0.12, 0.4, 0.3)                               # 242 frame draws
for i, f in enumerate((hz(74), hz(78), hz(81))):               # 2, 4, 2 pop
    place(pop(700 + i * 120, 330, 0.12), 6.15 + i * 0.15, 0.32, 0.25 + i * 0.15, 0.3)
    place(bell(f, 1.2, 3.2, 0.5), 6.15 + i * 0.15, 0.10, 0.25 + i * 0.15, 0.6)

# 4. CONNECTER • TRANSFORMER • ENVOYER
for i in range(3):
    place(whoosh(0.35, 1500, 5000, 0.7, 2.0), 6.83 + i * 0.32, 0.14, -0.4 + i * 0.4, 0.25)
    place(thud(95, 0.2), 6.95 + i * 0.32, 0.22, -0.4 + i * 0.4, 0.2)
for i in range(2):
    place(tick(0.05, 5000), 7.25 + i * 0.32, 0.22, -0.2 + i * 0.4, 0.3)

# 5. by MILMO: the last light
place(bell(hz(74), 3.0, 1.2), 8.35, 0.2, 0, 0.9)
place(bell(hz(81), 3.0, 1.2), 8.45, 0.13, 0.2, 0.9)
place(bell(hz(78), 3.0, 1.2), 8.55, 0.11, -0.2, 0.9)
place(shimmer(1.6, 3000, 16), 8.4, 0.07, 0, 0.9)

# ---------- reverb + master ----------
ir_n = int(2.2 * SR)
tt = np.arange(ir_n) / SR
ir = rng.standard_normal((2, ir_n)) * np.exp(-tt * 3.2)
ir = sosfilt(butter(1, 5500, 'lp', fs=SR, output='sos'), ir)
wet = np.stack([fftconvolve(send[c], ir[c])[:N] for c in range(2)])
mix = dry + wet / np.abs(wet).max() * np.abs(dry).max() * 0.35

mix = sosfilt(butter(2, 28, 'hp', fs=SR, output='sos'), mix)
mix /= np.abs(mix).max()
mix = np.tanh(mix * 1.4) / np.tanh(1.4)                        # gentle glue
fade = int(0.35 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade) ** 2
mix *= 0.89

out = sys.argv[1] if len(sys.argv) > 1 else 'sound.wav'
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out)
