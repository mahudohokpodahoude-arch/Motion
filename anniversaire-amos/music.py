"""Musique d'anniversaire, synthétisée de zéro (aucun sample, aucun droit à payer).
Ré majeur, 120 BPM, 50 s. Calée sur la vidéo : la lumière envahit l'écran à 42,0 s (barre 21).
Usage : python3 music.py out/musique.wav"""
import sys, wave
import numpy as np

SR = 44100; DUR = 50.0; N = int(SR * DUR); BEAT = .5; BAR = 2.0
rng = np.random.default_rng(242)
dry_l = np.zeros(N); dry_r = np.zeros(N); send = np.zeros(N)

NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def hz(n):
    k = NOTE[n[0]]; i = 1
    if n[i] == '#': k += 1; i += 1
    return 440.0 * 2 ** ((k + 12 * (int(n[i:]) + 1) - 69) / 12)

def put(t0, sig, g=1.0, pan=0.0, rev=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    sig = sig[:N - i]; e = i + len(sig)
    l, r = g * np.cos((pan + 1) * np.pi / 4), g * np.sin((pan + 1) * np.pi / 4)
    dry_l[i:e] += sig * l; dry_r[i:e] += sig * r; send[i:e] += sig * rev * g

def tt(d): return np.arange(int(SR * d)) / SR
def pluck(f, d=1.2, bright=1.0):
    t = tt(d); s = sum((1 / h) * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (3 + 2.6 * h / bright)) for h in range(1, 8))
    return s * np.minimum(1, t / .004) * .5
def pad(f, d, att=1.1, rel=1.2):
    t = tt(d + rel); s = 0
    for c in (-8, 0, 8):
        ff = f * 2 ** (c / 1200)
        s = s + sum((1 / h ** 1.5) * np.sin(2 * np.pi * ff * h * t + h) for h in range(1, 6))
    env = np.minimum(1, t / att) * np.minimum(1, np.clip((d + rel - t) / rel, 0, 1))
    return s * env * (1 + .08 * np.sin(2 * np.pi * .3 * t)) * .2
def bell(f, d=3.0):
    t = tt(d); s = 0
    for r, a, dc in ((1, 1, .9), (2.0, .55, 1.3), (2.76, .45, 1.8), (5.4, .22, 2.8), (8.93, .1, 4.0)):
        s = s + a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dc)
    return s * np.minimum(1, t / .002) * .35
def bass(f, d):
    t = tt(d + .3); env = np.minimum(1, t / .05) * np.clip((d + .3 - t) / .3, 0, 1)
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t)) * env * .5
def kick():
    t = tt(.45); f = 48 + 90 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 8) * .9
def clap():
    t = tt(.35); n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0)
    env = np.exp(-t * 26) + .8 * np.exp(-((t - .012) ** 2) / 2e-6) + .6 * np.exp(-((t - .024) ** 2) / 2e-6)
    return n * env * .22
def riser(d):
    t = tt(d); n = rng.standard_normal(len(t)); n = np.convolve(n, np.ones(6) / 6, mode='same')
    f = 250 + 2200 * (t / d) ** 2; ph = 2 * np.pi * np.cumsum(f) / SR
    return (n * .5 + np.sin(ph) * .3) * (t / d) ** 2.2 * .55
def boom():
    t = tt(2.4); f = 32 + 90 * np.exp(-t * 6); ph = 2 * np.pi * np.cumsum(f) / SR
    n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0)
    return np.sin(ph) * np.exp(-t * 1.5) * .9 + n * np.exp(-t * 3.2) * .22

CH = {'D': (['D3', 'F#3', 'A3', 'D4'], ['D4', 'F#4', 'A4'], 'D2'), 'A': (['E3', 'A3', 'C#4', 'E4'], ['E4', 'A4', 'C#5'], 'A1'),
      'Bm': (['D3', 'F#3', 'B3', 'D4'], ['D4', 'F#4', 'B4'], 'B1'), 'G': (['D3', 'G3', 'B3', 'D4'], ['D4', 'G4', 'B4'], 'G1'),
      'Dadd9': (['D3', 'F#3', 'A3', 'E4'], ['D4', 'F#4', 'A4'], 'D2')}
prog4 = ['D', 'A', 'Bm', 'G']
def chord(b):
    if b <= 20: return prog4[b % 4]
    return ['D', 'A', 'G', 'Dadd9'][b - 21]
HOOK = [(['F#5', 'A5', 'B5', 'A5', 'F#5', 'E5'], [(0, 1), (1, 1), (2, 2), (4, 1), (5, 1), (6, 2)]),
        (['D5', 'F#5', 'A5', 'B5', 'A5', 'F#5', 'E5'], [(0, 1), (1, 1), (2, 2), (4, 1), (5, 1), (6, 1), (7, 1)])]

for b in range(25):
    t0 = b * BAR; pads, arp, root = CH[chord(b)]; last = b == 24
    # nappe
    for n in pads: put(t0, pad(hz(n), BAR * (3 if last else 1) + .05, rel=1.4 if not last else 3.5), g=(.55 + .35 * min(1, b / 10)) * (1.15 if b >= 21 else 1), pan=0, rev=.5)
    # basse
    if 2 <= b <= 24 and not (b == 20 and False): put(t0, bass(hz(root), BAR - .05 if not last else 4), g=.5 if b < 10 else .62)
    # arpeggio de piano (croches)
    if 2 <= b <= 23:
        ext = [hz(arp[0]), hz(arp[1]), hz(arp[2]), hz(arp[0]) * 2]
        g = (.28 + .32 * min(1, (b - 2) / 8)) * (.8 if b >= 21 else 1)
        for i, k in enumerate([0, 1, 2, 3, 2, 1, 2, 1]):
            put(t0 + i * .25, pluck(ext[k], 1.0), g=g, pan=-.35 + .1 * (i % 4), rev=.35)
    # mélodie (marimba/cloche douce) sur les barres 10 à 19
    if 10 <= b <= 19:
        notes, steps = HOOK[((b - 10) // 2) % 2] if (b % 2 == 0) else HOOK[((b - 10) // 2) % 2]
        if b % 2 == 0:
            for n, (s, d) in zip(notes, steps): put(t0 + s * .25, bell(hz(n), 1.6), g=.34, pan=.3, rev=.5)
    # coeur : grosse caisse douce temps 1 et 3 (20 s -> 40 s)
    if 10 <= b <= 19:
        for beat in (0, 2): put(t0 + beat * BEAT, kick(), g=.55 if b < 17 else .7)
    # claps temps 2 et 4 (34 s -> 40 s)
    if 17 <= b <= 19:
        for beat in (1, 3): put(t0 + beat * BEAT, clap(), g=.9, pan=.1, rev=.25)

# montée vers la lumière (38 -> 42 s) et impact à 42,0 s
put(38.0, riser(4.0), g=.8, rev=.2)
put(42.0, boom(), g=1.0)
for i, n in enumerate(['D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6']): put(42.0 + i * .035, pluck(hz(n), 2.2, 1.4), g=.6, pan=-.6 + i * .2, rev=.5)
for n, dt in (('D6', 0), ('A5', .5), ('F#6', 1.0)): put(42.05 + dt, bell(hz(n), 3.5), g=.5, rev=.7)
# cloches de fin
for n, t0 in (('F#6', 44.5), ('A5', 45.4), ('D6', 46.3), ('E6', 47.4), ('D6', 48.2)): put(t0, bell(hz(n), 3.0), g=.32, pan=.2, rev=.7)

# réverbération (réponse impulsionnelle bruitée, convolution FFT)
L = int(2.4 * SR); ir = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 2.4); ir = np.convolve(ir, np.ones(4) / 4, mode='same'); ir[:int(.02 * SR)] *= np.linspace(0, 1, int(.02 * SR))
def conv(x, ir):
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir)))); return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
wet = conv(send, ir) * .06
wet_r = conv(send, np.roll(ir, 137)) * .06
l = dry_l + wet; r = dry_r + wet_r
# fondu d'entrée / sortie, limiteur doux, normalisation
env = np.minimum(1, np.arange(N) / (SR * 1.5)) * np.clip((N - np.arange(N)) / (SR * 3.0), 0, 1)
# arc dynamique : douce au début, pleine à l'impact (42 s)
tl = np.arange(N) / SR
arc = 0.55 + 0.45 * np.interp(tl, [0, 8, 20, 34, 41.9, 42.0, 50], [0.0, .35, .6, .85, .9, 1.0, 1.0])
m = np.stack([l, r]) * env * arc
m = m / np.percentile(np.abs(m), 99.9) * .85
m = np.tanh(m * 1.05)  # limiteur doux seulement sur les pointes
pcm = (m.T * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'out/musique.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
