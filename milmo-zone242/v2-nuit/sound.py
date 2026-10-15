"""Sound design for the "Nuit" version, synthesised from scratch.

Cinematic / precision palette: a drone that climbs while the camera dives,
data blips, camera-focus clicks, a cut to silence, then the lock-on hit and a
warm chord: the new zone is born. Every cue follows v2-nuit/index.html.
Usage: python3 sound.py out.wav    (numpy + scipy)
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 10.0
N = int(SR * DUR)
rng = np.random.default_rng(6022)

dry = np.zeros((2, N))
send = np.zeros((2, N))


def place(sig, t0, gain=1.0, pan=0.0, verb=0.3):
    i = int(t0 * SR)
    if i >= N or gain == 0:
        return
    sig = sig[: N - i] * gain
    a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    lr = np.array([np.cos(a), np.sin(a)])[:, None] * sig
    dry[:, i:i + sig.size] += lr
    send[:, i:i + sig.size] += lr * verb


def sos(kind, f, order=2):
    return butter(order, f, kind, fs=SR, output='sos')


def norm(s):
    return s / (np.abs(s).max() + 1e-9)


def ts(d):
    return np.arange(int(d * SR)) / SR


def svf_sweep(x, f0, f1, q=2.0, curve=1.0):
    """State-variable band-pass with an exponential cutoff sweep."""
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


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------- instruments ----------
def whoosh(d, f0, f1, peak=0.6, q=1.5):
    s = svf_sweep(rng.standard_normal(int(d * SR)), f0, f1, q)
    return norm(s) * swell(s.size, peak)


def bell(f, d=2.5, decay=2.0, bright=1.0):
    t = ts(d)
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * decay * k)
            for r, a, k in [(1, 1, 1), (2.0, .4, 1.5), (3.01, .22 * bright, 2.2), (4.2, .12 * bright, 3)])
    return norm(s * np.minimum(1, t / 0.003))


def grain(f, d=0.09):
    t = ts(d)
    return np.sin(2 * np.pi * f * t) * np.sin(np.pi * t / d) ** 2


def blip(f=2400, d=0.035):
    t = ts(d)
    sq = np.sign(np.sin(2 * np.pi * f * t))
    return sosfilt(sos('lp', 6000), sq) * np.exp(-t * 90)


def tick(d=0.03, hp=3500):
    t = ts(d)
    return sosfilt(sos('hp', hp), rng.standard_normal(t.size)) * np.exp(-t * 220)


def focus_click():
    """Two-transient mechanical click with a small metallic resonance."""
    t = ts(0.12)
    res = np.sin(2 * np.pi * 1350 * t) * np.exp(-t * 70) * 0.5
    s = res + tick(0.12, 2500) * 0.9
    s[int(0.011 * SR):] += tick(0.12, 4000)[: s.size - int(0.011 * SR)] * 0.6
    return s


def sub_drop(d=2.4, f0=62, f1=31):
    t = ts(d)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 2.5)) / SR
    return np.sin(ph) * np.exp(-t * 1.6) * np.minimum(1, t / 0.004)


def punch(d=0.5):
    t = ts(d)
    body = sosfilt(sos('lp', 1800), rng.standard_normal(t.size)) * np.exp(-t * 18)
    knock = np.sin(2 * np.pi * (140 + 160 * np.exp(-t * 50)) * t) * np.exp(-t * 16)
    return norm(body * 0.7 + knock)


def reverse_swell(d, hp=1500):
    """Reversed cymbal: filtered noise that grows into a hard stop."""
    t = ts(d)
    s = sosfilt(sos('hp', hp), rng.standard_normal(t.size)) * np.exp(-t * 3.5)
    return norm(s[::-1])


def drone(d, notes, f0, f1, attack, release):
    t = ts(d)
    s = np.zeros(t.size)
    for f in notes:
        for det in (-0.08, 0.08):
            fr = f * 2 ** (det / 12)
            s += ((t * fr + rng.uniform()) % 1.0) * 2 - 1
    s = svf_sweep(s, f0, f1, 0.9, curve=1.6) + sosfilt(sos('lp', f0), s) * 0.6
    e = np.clip(np.minimum(t / attack, (d - t) / release), 0, 1)
    return norm(s) * e


def pad(notes, d, attack, release, lp=1600):
    t = ts(d)
    s = np.zeros(t.size)
    for f in notes:
        for det in (-0.1, 0.0, 0.1):
            s += np.sin(2 * np.pi * f * 2 ** (det / 12) * t + rng.uniform(0, 6))
            s += 0.3 * np.sin(4 * np.pi * f * 2 ** (det / 12) * t)
    s = sosfilt(sos('lp', lp), s)
    e = np.clip(np.minimum(t / attack, (d - t) / release), 0, 1)
    return norm(s) * e


def laser(segments, d):
    """A drawing pen of light: pitch climbs as the name is traced."""
    t = ts(d)
    f = 260 * (3.2 ** (t / d))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph + 0.8 * np.sin(ph * 2.01)) * 0.6
    scratch = sosfilt(sos('bp', [2500, 7000]), rng.standard_normal(t.size)) * 0.35
    gate = np.zeros(t.size)
    for a, b in segments:
        x = np.clip((t - a) / max(b - a, 1e-3), 0, 1)
        gate = np.maximum(gate, np.where((t >= a) & (t <= b), np.sin(np.pi * x) ** 0.4, 0))
    gate = sosfilt(sos('lp', 30), gate)
    return (tone + scratch) * gate


# ---------- timeline ----------
D1, A1, D2, A2, D3, E3, Fs3, A3, Cs4, E4, Fs4 = (hz(m) for m in (26, 33, 38, 45, 50, 52, 54, 57, 61, 64, 66))

# the mission: a drone that opens up as we dive, then is cut before the lock
dr = drone(4.52, [D1, A1, D2], 120, 2600, 1.2, 0.02)
place(dr, 0.0, 0.34, 0, 0.2)
# light seed: reversed bell blooming into the globe
place(bell(hz(86), 1.2, 2.5)[::-1][-int(0.55 * SR):], 0.0, 0.18, 0, 0.8)
for i in range(46):                                    # glassy grains as the globe draws
    at = 0.35 + 1.4 * (i / 46) ** 0.8 + rng.uniform(-0.02, 0.02)
    f = hz(rng.choice([74, 76, 78, 81, 83, 86, 88, 90]))
    place(grain(f, rng.uniform(0.06, 0.14)), at, 0.06 * rng.uniform(0.5, 1), rng.uniform(-0.8, 0.8), 0.7)
place(bell(hz(62), 3.0, 1.2, 0.6), 0.92, 0.14, 0, 0.7)     # MILMO
place(sosfilt(sos('lp', 400), punch(0.6)), 0.92, 0.35, 0, 0.3)
for i in range(39):                                    # caption decodes
    if i % 2 == 0:
        place(tick(0.02, 5000), 1.15 + i * 0.018, 0.09, -0.6 + i * 0.03, 0.15)
place(bell(hz(93), 1.8, 3.0, 0.4), 1.95, 0.13, 0.35, 0.8)  # the light of Cotonou appears
place(whoosh(0.7, 2600, 500, 0.4), 2.2, 0.16, -0.2, 0.4)    # MILMO fades

# the dive
r = whoosh(2.2, 300, 9000, 0.97, 1.1)
place(r, 2.3, 0.3, 0, 0.3)
riser_t = ts(2.2)
riser_ph = 2 * np.pi * np.cumsum(hz(57) * 2 ** (riser_t / 2.2 * 1.0)) / SR
place(np.sin(riser_ph) * (riser_t / 2.2) ** 2.5, 2.3, 0.09, 0, 0.5)
at, k = 2.6, 0
while at < 4.3:                                        # coordinates data blips
    place(blip(2200 + 300 * (k % 3)), at, 0.05, 0.55, 0.1)
    at += 0.045 + 0.11 * ((at - 2.6) / 1.7) ** 2
    k += 1

# lock-on
place(whoosh(0.35, 800, 4000, 0.7, 2.0), 3.72, 0.22, 0, 0.3)     # corners arrive
place(focus_click(), 3.93, 0.5, 0, 0.25)
place(reverse_swell(0.62), 3.86, 0.26, 0, 0.2)
place(focus_click(), 4.47, 0.6, 0, 0.25)
# --- 60 ms of silence, then the hit at 4.56 ---
place(sub_drop(), 4.56, 1.0, 0, 0.2)
place(punch(), 4.56, 0.5, 0, 0.35)
place(bell(hz(74), 4.0, 0.9, 0.8), 4.56, 0.26, -0.1, 0.9)
place(bell(hz(81), 4.0, 0.9, 0.8), 4.575, 0.18, 0.15, 0.9)
place(whoosh(0.6, 7000, 250, 0.25, 0.8), 4.58, 0.32, 0, 0.4)      # fly through the surface
for i in range(25):                                    # "UNE NOUVELLE ZONE EST NÉE"
    if i % 2 == 0:
        place(tick(0.02, 4500), 4.6 + i * 0.03, 0.07, 0.4 - i * 0.03, 0.2)

# the zone is born: warm chord replaces the drone
place(pad([D2, A2, Fs3, A3, Cs4, E4], 5.44, 0.25, 2.2), 4.56, 0.22, 0, 0.7)
place(whoosh(0.9, 500, 2500, 0.55), 5.15, 0.14, 0, 0.4)          # symbol rises

# the name is drawn
segs = [(5.85, 6.9), (6.55, 6.8), (6.2, 6.75), (6.35, 7.25), (6.75, 7.2), (6.9, 7.3), (7.05, 7.5)]
base = 5.85
place(laser([(a - base, b - base) for a, b in segs], 1.7), base, 0.07, 0.15, 0.4)
for i, (_, b) in enumerate(segs):
    place(tick(0.025, 3000), b, 0.16, -0.3 + i * 0.1, 0.3)
place(bell(hz(90), 2.0, 2.2, 0.3), 6.8, 0.09, 0.3, 0.9)           # the slit of light
for i in range(33):                                    # CONNECTER · TRANSFORMER · ENVOYER
    if i % 2 == 0:
        place(tick(0.02, 5000), 7.55 + i * 0.022, 0.08, -0.5 + i * 0.03, 0.15)
place(bell(hz(74), 3.0, 1.1, 0.5), 8.3, 0.16, 0, 0.9)
place(bell(hz(78), 3.0, 1.1, 0.5), 8.36, 0.11, -0.2, 0.9)
place(bell(hz(81), 3.0, 1.1, 0.5), 8.42, 0.1, 0.2, 0.9)
place(sosfilt(sos('lp', 300), punch(0.8)), 8.5, 0.25, 0, 0.4)     # BY MILMO
place(sub_drop(1.5, 55, 36), 8.5, 0.25, 0, 0.2)

# ---------- reverb + master ----------
ir_n = int(2.6 * SR)
tt = np.arange(ir_n) / SR
ir = sosfilt(sos('lp', 6000, 1), rng.standard_normal((2, ir_n)) * np.exp(-tt * 2.6))
wet = np.stack([fftconvolve(send[c], ir[c])[:N] for c in range(2)])
mix = dry + wet / np.abs(wet).max() * np.abs(dry).max() * 0.32

# the cut: everything ducks to silence just before the lock
cut = np.ones(N)
a, b = int(4.49 * SR), int(4.555 * SR)
cut[a:b] = 0.02
cut = sosfilt(sos('lp', 400, 1), cut)
mix *= cut

mix = sosfilt(sos('hp', 25), mix)
mix /= np.abs(mix).max()
mix = np.tanh(mix * 1.5) / np.tanh(1.5)
fade = int(0.4 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade) ** 2
mix *= 0.89

out = sys.argv[1] if len(sys.argv) > 1 else 'sound.wav'
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out)
