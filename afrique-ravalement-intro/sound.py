"""Sound design for the 5 s Afrique Ravalement intro, synthesised from scratch (no samples).
120 BPM, 1 beat = 0.5 s. Cues: logo wipe 0.35, hit on the logo 1.3, lift + text whoosh 1.6 / 2.05,
swap 3.3, question blips 3.4+, warm tail.
Usage: python3 sound.py out.wav   (numpy + scipy)
"""
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 5.0
N = int(SR * DUR)
rng = np.random.default_rng(242)
dry = np.zeros((2, N)); send = np.zeros((2, N))

def place(sig, t0, gain=1.0, pan=0.0, verb=0.3):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    lr = np.array([np.cos(a), np.sin(a)])[:, None] * sig
    dry[:, i:i + sig.size] += lr; send[:, i:i + sig.size] += lr * verb

def f(kind, fc, order=2): return butter(order, fc, kind, fs=SR, output='sos')
def ts(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def env(d, a=0.002, k=8.0):
    t = ts(d); return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t * k)

# --- 0.05 : the light wakes up: soft high sine ping
t = ts(0.9); place(np.sin(2*np.pi*1760*t) * env(0.9, .004, 5) * .12, 0.05, pan=0, verb=.6)

# --- 0.4 -> 1.5 : riser (band-passed noise, cutoff climbing) into the hit
d = 1.1; n = noise(d); t = ts(d); k = (t / d) ** 2.2
x = sosfilt(f('bandpass', [300, 900]), n)
x = x * 0.0 + sosfilt(f('highpass', 400), n) * k
sweep = np.sin(2*np.pi*np.cumsum(180 * (12 ** (t / d))) / SR) * k * .25
place((x * .35 + sweep) * (1 - 0 * t), 0.2, .55, verb=.35)

# --- 0.75 / 0.82 / 0.89 / 0.96 : corners arriving, camera-focus clicks
for i, tt in enumerate([]):
    c = sosfilt(f('bandpass', [2500, 5500]), noise(0.05)) * env(0.05, .0005, 90)
    place(c, tt, .5, pan=[-.5, .5, .5, -.5][i], verb=.15)

# --- 1.5 : lock-on hit: sub boom + body + click + glassy tail
t = ts(1.6)
sub = np.sin(2*np.pi*(46 + 60*np.exp(-t*28)) * t) * np.exp(-t*3.2)
body = np.sin(2*np.pi*110*t) * np.exp(-t*9) * .5
click = sosfilt(f('highpass', 3000), noise(0.04)) * env(0.04, .0003, 120)
place(sub * .95 + body, 1.3, 1.0, verb=.2)
place(click, 1.3, .6, verb=.3)
for fr, g in [(1175, .10), (1760, .08), (2349, .06)]:
    tt = ts(1.8); place(np.sin(2*np.pi*fr*tt) * np.exp(-tt*2.4) * g, 1.3, 1, verb=.7)

# --- 1.55 -> 2.0 : wordmark whoosh (reverse-ish swell with a fast cutoff fall)
d = 0.55; t = ts(d); n = noise(d)
w = sosfilt(f('bandpass', [500, 3500]), n) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
place(w, 1.55, .35, verb=.4)
place(w, 2.0, .3, verb=.4)
place(w, 3.25, .35, verb=.4)

# --- 2.0 : second hit (beat 4): mid thump + bright tick on the "242"
t = ts(0.6)
place(np.sin(2*np.pi*(80 + 70*np.exp(-t*30)) * t) * np.exp(-t*8) * .7, 3.3, .8, verb=.15)
place(sosfilt(f('bandpass', [3000, 7000]), noise(0.06)) * env(0.06, .0003, 70), 3.3, .5, verb=.3)

# --- 2.15 -> 2.9 : tagline data blips (pentatonic ticks, panned)
notes = [1568, 1319, 1760, 1976, 1568, 2349, 1760, 1319, 2093, 1976, 1568, 2637]
for i, fr in enumerate(notes):
    tt = ts(0.12); s = np.sin(2*np.pi*fr*tt) * env(0.12, .0008, 38)
    place(s, 3.9 + i * 0.062, .09, pan=np.sin(i * 1.7) * .6, verb=.4)

# --- 2.6 -> 5.0 : warm chord pad (D lydian-ish sus), slow bloom, long tail
d = 1.8; t = ts(d); a = np.minimum(t / 0.6, 1) ** 2 * np.minimum((d - t) / 0.5, 1)
pad = np.zeros_like(t)
for fr in [146.8, 220.0, 293.7, 369.99, 440.0, 554.4]:
    for det in (-1.7, 0, 1.9):
        pad += np.sin(2*np.pi*(fr + det*fr/220) * t + rng.uniform(0, 6.28)) / 18
pad = sosfilt(f('lowpass', 2600), pad) * a
place(pad, 3.2, .55, verb=.55)

# --- reverb (synthetic exponential-noise IR) + master
ir_len = int(1.8 * SR); tt = np.arange(ir_len) / SR
ir = np.stack([rng.standard_normal(ir_len) * np.exp(-tt * 2.6) for _ in range(2)])
ir = np.stack([sosfilt(f('lowpass', 7000), r) for r in ir]); ir[:, :int(.012*SR)] *= 0.2
wet = np.stack([fftconvolve(send[c], ir[c])[:N] for c in range(2)]) * .06
out = dry + wet
out = sosfilt(f('highpass', 28), out, axis=1)
fade = np.ones(N); fade[-int(.12*SR):] = np.linspace(1, 0, int(.12*SR)); out *= fade
out = np.tanh(out * 1.1) / np.tanh(1.1)
out = out / (np.abs(out).max() + 1e-9) * .89
pcm = (out.T * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'sound.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote sound')
