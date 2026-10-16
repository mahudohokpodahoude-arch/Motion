"""Dynamic sound design for the 3D version, synthesised from scratch.

A 120 BPM pulse carries the film so the birth (4.0 s) lands on beat 8:
light groove under MILMO, a build while the globe spins, a cut to silence,
the drop at the birth, a full groove while ZONE 242 assembles, an outro hit
with the tagline. Every effect follows the cues in v3-3d/index.html.
Usage: python3 sound.py out.wav     (numpy + scipy)
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 10.0
N = int(SR * DUR)
BEAT = 0.5                      # 120 BPM
rng = np.random.default_rng(242)

dry = np.zeros((2, N))
send = np.zeros((2, N))


def place(sig, t0, gain=1.0, pan=0.0, verb=0.25):
    i = int(t0 * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i] * gain
    a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    lr = np.array([np.cos(a), np.sin(a)])[:, None] * sig
    dry[:, i:i + sig.size] += lr
    send[:, i:i + sig.size] += lr * verb


def sos(kind, f, order=2):
    return butter(order, f, kind, fs=SR, output='sos')


def ts(d):
    return np.arange(int(d * SR)) / SR


def norm(s):
    return s / (np.abs(s).max() + 1e-9)


def noise(d):
    return rng.standard_normal(int(d * SR))


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def svf_sweep(x, f0, f1, q=1.5, curve=1.0):
    n = x.size
    f = f0 * (f1 / f0) ** (np.linspace(0, 1, n) ** curve)
    g = 2 * np.sin(np.pi * np.clip(f, 20, SR / 6) / SR)
    damp = 1.0 / q
    low = band = 0.0
    out = np.empty(n)
    for i in range(n):
        high = x[i] - low - damp * band
        band += g[i] * high
        low += g[i] * band
        out[i] = band
    return out


def swell(n, peak):
    x = np.linspace(0, 1, n)
    return np.minimum(np.clip(x / peak, 0, 1) ** 2, np.clip((1 - x) / (1 - peak), 0, 1) ** 1.5)


# ---------- drums ----------
def kick(d=0.45, f0=160, f1=44):
    t = ts(d)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 32)) / SR
    click = sosfilt(sos('hp', 2500), noise(d)) * np.exp(-t * 400) * 0.25
    return np.sin(ph) * np.exp(-t * 7) + click


def clap(d=0.3):
    t = ts(d)
    n = sosfilt(sos('bp', [900, 2400]), noise(d))
    env = np.zeros(t.size)
    for off in (0, 0.009, 0.019, 0.03):
        env += np.where(t >= off, np.exp(-(t - off) * (60 if off < 0.03 else 14)), 0)
    return norm(n * env)


def hat(d=0.06, open_=False):
    t = ts(d)
    return sosfilt(sos('hp', 7500), noise(d)) * np.exp(-t * (18 if open_ else 70))


def sub(f, d):
    t = ts(d)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * np.minimum(1, t / 0.01) * np.exp(-t * 2.2)


# ---------- effects ----------
def whoosh(d, f0, f1, peak=0.6, q=1.4):
    s = svf_sweep(noise(d), f0, f1, q)
    return norm(s) * swell(s.size, peak)


def spin_whoosh(d, f0, f1, rate0, rate1):
    """A whoosh with a tremolo that follows a rotation speed."""
    t = ts(d)
    s = norm(svf_sweep(noise(d), f0, f1, 2.0))
    rate = rate0 + (rate1 - rate0) * (t / d)
    trem = 0.55 + 0.45 * np.sin(2 * np.pi * np.cumsum(rate) / SR)
    return s * trem * swell(t.size, 0.75)


def thud(f=90, d=0.32, bright=0.6):
    t = ts(d)
    ph = 2 * np.pi * np.cumsum(f + 120 * np.exp(-t * 45)) / SR
    knock = sosfilt(sos('bp', [600, 3000]), noise(d)) * np.exp(-t * 60) * bright
    return np.sin(ph) * np.exp(-t * 13) + knock


def clack(f=1900):
    """Metallic lock: short noise transient + two inharmonic partials."""
    t = ts(0.18)
    ring = (np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 2.71 * t)) * np.exp(-t * 38)
    return ring * 0.5 + sosfilt(sos('hp', 2000), noise(0.18)) * np.exp(-t * 140) + thud(130, 0.18, 0.2) * 0.6


def pop(f0=700, f1=320, d=0.14):
    t = ts(d)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 55)) / SR
    return np.sin(ph) * np.exp(-t * 32) + noise(d) * np.exp(-t * 800) * 0.25


def bell(f, d=2.5, decay=1.6, bright=0.8):
    t = ts(d)
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * decay * k)
            for r, a, k in [(1, 1, 1), (2.0, .4, 1.4), (3.01, .25 * bright, 2.2), (4.2, .12 * bright, 3)])
    return norm(s * np.minimum(1, t / 0.003))


def riser(d, f0, f1):
    t = ts(d)
    x = t / d
    ph = 2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (x ** 1.5)) / SR
    tone = np.sin(ph) + 0.5 * np.sin(2 * ph + 1) + 0.25 * np.sin(3 * ph)
    air = norm(svf_sweep(noise(d), 300, 9000, 1.1, 1.4))
    return (tone * 0.45 + air * 0.6) * x ** 2.4


def boom(d=2.6):
    t = ts(d)
    ph = 2 * np.pi * np.cumsum(32 + 80 * np.exp(-t * 6)) / SR
    body = np.sin(ph) * np.exp(-t * 1.5)
    crack = sosfilt(sos('bp', [400, 5000]), noise(d)) * np.exp(-t * 20)
    crash = sosfilt(sos('hp', 4000), noise(d)) * np.exp(-t * 2.2)
    return body + crack * 0.45 + crash * 0.22


def sparkle(d, count, lo=2500, hi=9000):
    t_n = int(d * SR)
    s = np.zeros(t_n)
    for _ in range(count):
        at = int(rng.uniform(0, 0.85) ** 1.8 * t_n)
        f = rng.uniform(lo, hi)
        g = np.sin(2 * np.pi * f * ts(0.12)) * np.exp(-ts(0.12) * 45) * rng.uniform(0.3, 1)
        m = min(g.size, t_n - at)
        s[at:at + m] += g[:m]
    return norm(s)


def pad(notes, d, attack, release, lp=1800):
    t = ts(d)
    s = np.zeros(t.size)
    for f in notes:
        for det in (-0.1, 0.0, 0.1):
            fr = f * 2 ** (det / 12)
            s += ((t * fr + rng.uniform()) % 1.0) * 2 - 1
    s = sosfilt(sos('lp', lp), s)
    return norm(s) * np.clip(np.minimum(t / attack, (d - t) / release), 0, 1)


D1, D2, A2, D3, Fs3, A3, B3, Cs4, D4, E4, Fs4, A4 = (hz(m) for m in (26, 38, 45, 50, 54, 57, 59, 61, 62, 64, 66, 69))

# ================= the groove (120 BPM) =================
beats = np.arange(0, DUR, BEAT)
for b in beats:
    if b < 2.5:                                  # intro: kick on 1 and 3, quiet hats
        if round(b / BEAT) % 2 == 0:
            place(kick(), b, 0.55, 0, 0.05)
        place(hat(), b + BEAT / 2, 0.08, 0.3, 0.1)
    elif 4.0 <= b < 8.0:                         # after the birth: full groove
        place(kick(), b, 0.8, 0, 0.05)
        if round(b / BEAT) % 2 == 1:
            place(clap(), b, 0.32, 0, 0.35)
        for k in range(4):
            place(hat(open_=(k == 2)), b + k * BEAT / 4, 0.09 if k % 2 else 0.05, 0.25 if k % 2 else -0.25, 0.1)
        place(sub([D2, D2, A2, B3 / 2][int((b - 4) // 1) % 4], BEAT), b, 0.35, 0, 0.0)

# build: snare/clap roll accelerating into the birth
t_roll, step = 2.5, 0.25
while t_roll < 3.92:
    k = (t_roll - 2.5) / 1.42
    place(clap(0.15), t_roll, 0.08 + 0.22 * k, rng.uniform(-0.3, 0.3), 0.3)
    step = 0.25 if k < 0.35 else (0.125 if k < 0.7 else 0.0625)
    t_roll += step
place(kick(), 2.5, 0.6, 0, 0.05)
place(kick(), 3.0, 0.6, 0, 0.05)
place(kick(), 3.5, 0.65, 0, 0.05)

# pads: tension under MILMO, resolved D major 9 after the birth
place(pad([D2, A2, D3, A3], 3.95, 0.6, 0.05, 1200), 0.0, 0.1, 0, 0.5)
place(pad([D3, Fs3, A3, Cs4, E4], 6.0, 0.05, 2.0, 2200), 4.0, 0.13, 0, 0.6)

# ================= MILMO =================
for i in range(4):
    a = 0.15 + i * 0.12
    place(whoosh(0.32, 500, 3500, 0.85, 2.0), a - 0.06, 0.32, -0.45 + i * 0.25, 0.2)
    place(thud(85 + i * 6), a + 0.22, 0.55, -0.45 + i * 0.25, 0.2)
place(spin_whoosh(0.9, 1200, 3200, 6, 4), 0.55, 0.22, 0.55, 0.3)      # globe spins in
place(pop(520, 230, 0.2), 0.86, 0.5, 0.55, 0.3)
place(bell(hz(74), 2.2, 1.8), 0.88, 0.12, 0.5, 0.6)
for i in range(4):                                                    # letters tumble away
    place(whoosh(0.6, 3200, 300, 0.4), 2.33 + i * 0.05, 0.16, -0.5 + i * 0.3, 0.25)

# globe climax: spinning whirr that speeds up + riser
place(spin_whoosh(1.45, 400, 5000, 4, 26), 2.55, 0.32, 0, 0.25)
place(riser(1.38, 110, 880), 2.55, 0.3, 0, 0.3)

# ================= the birth (4.0 s, beat 8) =================
place(boom(), 4.0, 1.0, 0, 0.35)
place(bell(D4, 3.5, 0.9), 4.0, 0.22, -0.2, 0.9)
place(bell(A4, 3.5, 0.9), 4.015, 0.17, 0.2, 0.9)
place(sparkle(1.4, 70), 4.02, 0.2, -0.4, 0.6)                          # particles fly out
place(sparkle(1.4, 70), 4.02, 0.2, 0.4, 0.6)
place(pop(900, 400, 0.16), 4.12, 0.4, 0, 0.3)                          # the cube is born
place(spin_whoosh(0.95, 700, 4500, 14, 4), 4.25, 0.26, 0.15, 0.3)       # cube rises, spinning
place(whoosh(1.1, 3600, 500, 0.5), 4.45, 0.22, -0.4, 0.3)              # globe travels to the O
place(whoosh(0.2, 2000, 7000, 0.6, 3.0), 5.0, 0.2, -0.4, 0.3)          # the coin flip

# ================= ZONE 242 assembles =================
for i, p in enumerate((-0.7, 0.7, 0.7, -0.7)):                         # corners lock
    a = 4.85 + i * 0.07
    place(whoosh(0.3, 900, 5000, 0.85, 2.0), a, 0.14, p, 0.2)
    place(clack(1700 + i * 140), a + 0.3, 0.45, p, 0.25)
for at, p in ((5.55, -0.5), (5.7, -0.4), (5.82, -0.1)):                  # Z, N, E
    place(whoosh(0.25, 800, 4000, 0.85, 2.0), at - 0.2, 0.12, p, 0.2)
    place(thud(110, 0.28, 0.8), at, 0.45, p, 0.2)
zp = norm(svf_sweep(noise(0.65), 1200, 7000, 4.0)) * swell(int(0.65 * SR), 0.8)
place(zp, 5.7, 0.14, 0.45, 0.3)                                        # frame stretches open
place(clack(1500), 6.05, 0.3, 0.45, 0.3)
for i, f in enumerate((hz(74), hz(78), hz(81))):                        # 2, 4, 2
    place(pop(820 + i * 140, 380, 0.13), 6.2 + i * 0.12, 0.38, 0.3 + i * 0.12, 0.3)
    place(bell(f, 1.2, 3.0, 0.4), 6.2 + i * 0.12, 0.09, 0.3 + i * 0.12, 0.6)

# camera swing + shine sweeping across the faces
place(whoosh(2.0, 250, 2400, 0.55, 0.9), 6.6, 0.24, 0, 0.4)
sh = norm(svf_sweep(noise(2.2), 5000, 11000, 6.0)) * swell(int(2.2 * SR), 0.5)
for k, p in enumerate(np.linspace(-0.8, 0.8, 6)):                       # pan the shine L -> R
    seg = sh[int(k / 6 * sh.size): int((k + 1) / 6 * sh.size)]
    place(seg, 7.2 + k * 2.2 / 6, 0.12, p, 0.5)

# ================= outro =================
place(boom(2.0), 8.0, 0.55, 0, 0.35)                                    # tagline
place(bell(D4, 3.0, 1.1), 8.0, 0.18, 0, 0.9)
place(bell(Fs4, 3.0, 1.1), 8.06, 0.13, -0.25, 0.9)
place(bell(A4, 3.0, 1.1), 8.12, 0.12, 0.25, 0.9)
place(pad([D3, Fs3, A3, Cs4, E4], 2.0, 0.02, 1.9, 2600), 8.0, 0.12, 0, 0.7)
place(bell(hz(86), 2.0, 2.0, 0.3), 8.45, 0.08, 0, 0.9)                  # BY MILMO

# ================= mix =================
ir_n = int(2.2 * SR)
tt = np.arange(ir_n) / SR
ir = sosfilt(sos('lp', 6500, 1), rng.standard_normal((2, ir_n)) * np.exp(-tt * 3.0))
wet = np.stack([fftconvolve(send[c], ir[c])[:N] for c in range(2)])
mix = dry + wet / np.abs(wet).max() * np.abs(dry).max() * 0.3

cut = np.ones(N)                                                       # silence before the drop
cut[int(3.93 * SR):int(3.995 * SR)] = 0.02
mix *= sosfilt(sos('lp', 300, 1), cut)

# bring the low end up where phone speakers can hear it: gentle 120 Hz harmonics
low = sosfilt(sos('lp', 120), mix)
mix = mix + np.tanh(low * 3) * 0.12

mix = sosfilt(sos('hp', 28), mix)
mix /= np.abs(mix).max()
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
fade = int(0.5 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade) ** 2
mix *= 0.89

out = sys.argv[1] if len(sys.argv) > 1 else 'sound.wav'
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out)
