"""Musique « Hommage » : gospel-pop joyeux, synthétisée de zéro (aucun sample, aucun droit à payer).
Ré majeur, 120 BPM, 40 s (20 mesures de 2 s), calée sur la vidéo :
  0-2 s  : ouverture    2-8 s : carte titre (montée)    8 s : coup + flash, début du groove
  8-26 s : 9 photos, un coup à chaque changement (toutes les 2 s)    26-32 s : bulles de la communauté
  30-32 s : montée vers la lumière    32,0 s : impact    32-40 s : finale chaleureux.
Usage : python3 music2.py out/musique_brute.wav"""
import sys, wave
import numpy as np

SR = 44100; DUR = 40.0; N = int(SR * DUR); BEAT = .5; BAR = 2.0
rng = np.random.default_rng(14)
dl = np.zeros(N); dr = np.zeros(N); send = np.zeros(N)
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def hz(n):
    k = NOTE[n[0]]; i = 1
    if n[i] == '#': k += 1; i += 1
    return 440.0 * 2 ** ((k + 12 * (int(n[i:]) + 1) - 69) / 12)
def put(t0, sig, g=1.0, pan=0.0, rev=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    sig = sig[:N - i]; e = i + len(sig); l, r = g * np.cos((pan + 1) * np.pi / 4), g * np.sin((pan + 1) * np.pi / 4)
    dl[i:e] += sig * l; dr[i:e] += sig * r; send[i:e] += sig * rev * g
def tt(d): return np.arange(int(SR * d)) / SR
def pluck(f, d=1.0, bright=1.0):
    t = tt(d); s = sum((1 / h) * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (3 + 2.6 * h / bright)) for h in range(1, 8))
    return s * np.minimum(1, t / .004) * .5
def pad(f, d, att=.9, rel=1.0):
    t = tt(d + rel); s = 0
    for c in (-8, 0, 8):
        ff = f * 2 ** (c / 1200); s = s + sum((1 / h ** 1.5) * np.sin(2 * np.pi * ff * h * t + h) for h in range(1, 6))
    env = np.minimum(1, t / att) * np.clip((d + rel - t) / rel, 0, 1)
    return s * env * (1 + .08 * np.sin(2 * np.pi * .3 * t)) * .2
def choir(f, d, att=.7, rel=1.0, vib=5.2):
    """voix « aah » : harmoniques pondérées autour des formants d'un a (800 et 1200 Hz), léger vibrato"""
    t = tt(d + rel); s = 0
    for c in (-6, 6):
        ff = f * 2 ** (c / 1200); v = 1 + .004 * np.sin(2 * np.pi * vib * t + c)
        ph = 2 * np.pi * np.cumsum(ff * v) / SR
        for h in range(1, 26):
            fh = ff * h
            if fh > 5000: break
            a = np.exp(-((fh - 800) / 320) ** 2) + .7 * np.exp(-((fh - 1250) / 380) ** 2) + .05 / h
            s = s + a / h ** .35 * np.sin(h * ph)
    env = np.minimum(1, t / att) * np.clip((d + rel - t) / rel, 0, 1)
    return s * env * .075
def bell(f, d=2.5):
    t = tt(d); s = 0
    for r, a, dc in ((1, 1, .9), (2.0, .55, 1.3), (2.76, .45, 1.8), (5.4, .22, 2.8), (8.93, .1, 4.0)): s = s + a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * dc)
    return s * np.minimum(1, t / .002) * .35
def bass(f, d, punch=True):
    t = tt(d + .12); env = np.minimum(1, t / .01) * np.clip((d + .12 - t) / .12, 0, 1) * (np.exp(-t * 3) * .5 + .5 if punch else 1)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(4 * np.pi * f * t) + .12 * np.sin(6 * np.pi * f * t)) * env * .5
def kick(g=1.0):
    t = tt(.4); f = 46 + 95 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 9) + .25 * np.sin(2 * np.pi * 2000 * t) * np.exp(-t * 300)) * .95 * g
def clap():
    t = tt(.3); n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return n * (np.exp(-t * 28) + .8 * np.exp(-((t - .012) ** 2) / 2e-6) + .6 * np.exp(-((t - .024) ** 2) / 2e-6)) * .24
def hat(open_=False):
    t = tt(.25 if open_ else .06); n = np.diff(np.diff(rng.standard_normal(len(t)), prepend=0), prepend=0)
    return n * np.exp(-t * (14 if open_ else 70)) * .1
def riser(d, g=1.0):
    t = tt(d); n = np.convolve(rng.standard_normal(len(t)), np.ones(6) / 6, mode='same'); f = 250 + 2400 * (t / d) ** 2
    return (n * .5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .3) * (t / d) ** 2.2 * .55 * g
def boom(g=1.0):
    t = tt(2.4); f = 32 + 90 * np.exp(-t * 6); n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5) * .9 + n * np.exp(-t * 3.2) * .22) * g
def swoosh_hit():
    t = tt(.5); n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return n * np.exp(-t * 9) * .22 + np.sin(2 * np.pi * (180 * np.exp(-t * 6) + 60) * t) * np.exp(-t * 7) * .25

CH = {'D': (['D3', 'F#3', 'A3', 'D4'], ['D4', 'F#4', 'A4'], 'D2', 'A4'), 'A': (['E3', 'A3', 'C#4', 'E4'], ['E4', 'A4', 'C#5'], 'A1', 'E5'),
      'Bm': (['D3', 'F#3', 'B3', 'D4'], ['D4', 'F#4', 'B4'], 'B1', 'F#5'), 'G': (['D3', 'G3', 'B3', 'D4'], ['D4', 'G4', 'B4'], 'G1', 'D5'),
      'Dadd9': (['D3', 'F#3', 'A3', 'E4'], ['D4', 'F#4', 'A4'], 'D2', 'A4')}
prog4 = ['D', 'A', 'Bm', 'G']
def chord(b): return prog4[b % 4] if b < 17 else ['D', 'A', 'G', 'Dadd9'][min(3, b - 16)]
HOOK = [([('F#5', 0, 1), ('A5', 1, 1), ('B5', 2, 2), ('A5', 4, 1), ('F#5', 5, 1), ('E5', 6, 2)]),
        ([('D5', 0, 1), ('F#5', 1, 1), ('A5', 2, 2), ('B5', 4, 1), ('A5', 5, 1), ('F#5', 6, 1), ('E5', 7, 1)])]

for b in range(20):
    t0 = b * BAR; pads, arp, root, top = CH[chord(b)]; last = b == 19; groove = 4 <= b <= 15
    # nappe + chœur
    gp = (.5 + .4 * min(1, b / 6)) * (1.2 if b >= 16 else 1)
    for n in pads: put(t0, pad(hz(n), BAR * (3 if last else 1) + .05, rel=1.4 if not last else 3.5), g=gp, rev=.5)
    if b >= 1:
        for n in pads[:3]: put(t0, choir(hz(n) * 2, BAR * (3 if last else 1) + .05, rel=1.2 if not last else 3.5), g=(.6 + .5 * min(1, b / 8)) * (1.3 if b >= 16 else 1), pan=-.2, rev=.7)
    # basse (croches pointées dans le groove)
    if groove:
        for i, (st, dur, o) in enumerate([(0, .75, 0), (.75, .5, 0), (1.25, .25, 12), (1.5, .5, 0)]): put(t0 + st, bass(hz(root) * (2 if o else 1), dur), g=.62)
    elif 2 <= b <= 3 or b >= 16: put(t0, bass(hz(root), BAR - .05 if not last else 4, punch=False), g=.55)
    # arpeggio (croches)
    if 2 <= b <= 19:
        ext = [hz(arp[0]), hz(arp[1]), hz(arp[2]), hz(arp[0]) * 2]
        g = (.26 + .3 * min(1, (b - 2) / 6)) * (.8 if b >= 16 else 1)
        for i, k in enumerate([0, 1, 2, 3, 2, 1, 2, 1]): put(t0 + i * .25, pluck(ext[k], 1.0), g=g, pan=-.35 + .1 * (i % 4), rev=.35)
    # accords de piano en contretemps (groove)
    if groove:
        for st in (.5, 1.25, 1.75): [put(t0 + st, pluck(hz(n), .7, 1.2), g=.3, pan=.2, rev=.3) for n in arp]
    # mélodie (cloche douce) : photos et bulles
    if 6 <= b <= 14 and b % 2 == 0:
        for n, s, d in HOOK[((b - 6) // 2) % 2]: put(t0 + s * .25, bell(hz(n), 1.6), g=.32, pan=.3, rev=.5)
    # batterie
    if groove:
        for beat in range(4): put(t0 + beat * BEAT, kick(), g=.8)
        for beat in (1, 3): put(t0 + beat * BEAT, clap(), g=.9, pan=.1, rev=.25)
        for e in range(8): put(t0 + e * .25 + .125 * 0, hat(e % 4 == 3), g=.9 if e % 2 else .6, pan=.35)
    elif 1 <= b <= 3: put(t0, kick(), g=.55); put(t0 + 1.0, kick(), g=.45)

# coups de montage (changement de photo) : petit « whoosh » avant la barre + impact
for k in range(10): put(8.0 + k * 2.0 - .06, swoosh_hit(), g=.85 if k else 1.3, rev=.2)
put(2.0, boom(.55)); put(8.0, boom(.9))
put(0.0, riser(2.0, .5)); put(6.0, riser(2.0, .9)); put(30.0, riser(2.0, 1.0))
# roulement de caisse claire pendant la montée 30-32 s
for i in range(16): put(30.0 + i * .125, clap(), g=.3 + .05 * i, rev=.2)
# impact de lumière à 32,0 s + accord éclatant
put(32.0, boom(1.0))
for i, n in enumerate(['D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6']): put(32.0 + i * .035, pluck(hz(n), 2.2, 1.4), g=.6, pan=-.6 + i * .2, rev=.5)
for n, dt in (('D6', 0), ('A5', .5), ('F#6', 1.0)): put(32.05 + dt, bell(hz(n), 3.5), g=.5, rev=.7)
for n, t0 in (('F#6', 34.5), ('A5', 35.4), ('D6', 36.3), ('E6', 37.4), ('D6', 38.2)): put(t0, bell(hz(n), 3.0), g=.32, pan=.2, rev=.7)
# cœur doux dans le finale
for b in range(16, 18): [put(b * BAR + beat * BEAT, kick(), g=.35) for beat in (0, 2)]

L = int(2.4 * SR); ir = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 2.4); ir = np.convolve(ir, np.ones(4) / 4, mode='same'); ir[:int(.02 * SR)] *= np.linspace(0, 1, int(.02 * SR))
def conv(x, ir):
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir)))); return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
l = dl + conv(send, ir) * .06; r = dr + conv(send, np.roll(ir, 137)) * .06
tl = np.arange(N) / SR
env = np.minimum(1, tl / .8) * np.clip((DUR - tl) / 2.5, 0, 1)
arc = .62 + .38 * np.interp(tl, [0, 8, 8.01, 26, 31.9, 32.0, 40], [.2, .6, .85, .95, .95, 1.0, .9])
m = np.stack([l, r]) * env * arc; m = m / np.percentile(np.abs(m), 99.9) * .85; m = np.tanh(m * 1.05)
pcm = (m.T * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'out/musique_brute.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
