"""Sound design for the dynamic Afrique Ravalement intro, synthesised from scratch.
120 BPM, 1 beat = 0.5 s. Cues follow index.html: wake 0.05, corners 0.75-0.95,
lock-on hit 1.5, wordmark whoosh 1.55, second hit 2.0, tagline blips 2.15+, warm tail.
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


def whoosh(t0, d, lo, hi, g):
    t = ts(d); n = noise(d)
    w = sosfilt(f('bandpass', [lo, hi]), n) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    place(w, t0, g, verb=.4)

def hit(t0, g=1.0, f0=46):
    t = ts(1.6)
    sub = np.sin(2*np.pi*(f0 + 60*np.exp(-t*28)) * t) * np.exp(-t*3.2)
    body = np.sin(2*np.pi*110*t) * np.exp(-t*9) * .5
    click = sosfilt(f('highpass', 3000), noise(0.04)) * env(0.04, .0003, 120)
    place(sub * .95 + body, t0, g, verb=.2); place(click, t0, g * .6, verb=.3)
    for fr, gg in [(1175, .10), (1760, .08), (2349, .06)]:
        tt = ts(1.8); place(np.sin(2*np.pi*fr*tt) * np.exp(-tt*2.4) * gg, t0, g, verb=.7)

def spray(t0, g=.35):
    d = 0.7; place(sosfilt(f('highpass', 2500), noise(d)) * env(d, .01, 5), t0, g, pan=.3, verb=.25)

def tick(t0, fr, g=.12, pan=0.0):
    tt = ts(0.1); place(np.sin(2*np.pi*fr*tt) * env(0.1, .0006, 45), t0, g, pan=pan, verb=.35)

# 0.0 -> 0.5 : opening columns lifting (quick staggered whoosh)
for i in range(7): whoosh(i * .045, .3, 600, 4000, .12)
# 0.5 : logo slam, 0.58 spray
hit(0.5, 1.0); spray(0.58)
# 1.0 : second hit (logo lifts) + spray
hit(1.0, .7, 55); spray(1.1, .3); whoosh(1.0, .5, 400, 3000, .3)
# 1.4 -> 2.2 : letters rising, stepped ticks
for i in range(16):
    tick(1.4 + (i % 8) * .035 + (i // 8) * .18 + .05, 1319 + (i % 5) * 220, .09, pan=np.sin(i) * .5)
# 1.5 : marquee band whoosh
whoosh(1.5, .45, 800, 5000, .25)
# 2.0 : beat
hit(2.0, .35, 70)
# 2.3 -> 3.0 : riser into the swipe, big hit when letters land
d = 0.7; t = ts(d); k = (t / d) ** 2.2
place(sosfilt(f('highpass', 500), noise(d)) * k * .35 + np.sin(2*np.pi*np.cumsum(220 * (10 ** (t / d))) / SR) * k * .2, 2.3, .6, verb=.35)
whoosh(2.55, .5, 300, 3500, .4)
hit(3.0, 1.0, 50)
# 3.0 -> 3.5 : letters pop, pentatonic ticks; the "?" spins
for i, fr in enumerate([1568, 1760, 1976, 1568, 2349, 1976, 2093, 1760, 1319, 2637, 3136]):
    tick(3.0 + i * .045, fr, .1, pan=np.sin(i * 1.3) * .6)
whoosh(3.4, .45, 1500, 7000, .2)
# 3.55 / 3.75 : the promise lines, bar wipe
tick(3.55, 1760, .12); whoosh(3.72, .25, 800, 4000, .25); tick(3.82, 2349, .12)
# 3.0 -> 5.0 : warm pad
d = 2.0; t = ts(d); a = np.minimum(t / 0.5, 1) ** 2 * np.minimum((d - t) / 0.6, 1)
pad = np.zeros_like(t)
for fr in [146.8, 220.0, 293.7, 369.99, 440.0, 554.4]:
    for det in (-1.7, 0, 1.9):
        pad += np.sin(2*np.pi*(fr + det*fr/220) * t + rng.uniform(0, 6.28)) / 18
place(sosfilt(f('lowpass', 2600), pad) * a, 3.0, .5, verb=.55)
# 4.15 : footer shimmer


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
