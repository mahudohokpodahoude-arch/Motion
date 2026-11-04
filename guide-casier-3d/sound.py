"""Sound design synthétisé de zéro (aucun sample, aucun droit à payer), calé sur la timeline de index.html.
Usage : python3 sound.py sound.wav   (numpy uniquement)"""
import sys, wave
import numpy as np

SR, DUR = 44100, 68.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)

def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR); sig = sig[: max(0, N - i)]
    if len(sig) == 0: return
    L[i:i + len(sig)] += sig * gain * (1 - max(pan, 0))
    R[i:i + len(sig)] += sig * gain * (1 + min(pan, 0))

def env(n, a=0.005, r=0.3):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    nr = min(n, int(r * SR)); e[n - nr:] *= np.linspace(1, 0, nr) ** 2
    return e

def tone(f, d, a=0.005, r=0.3, harm=(1, .3, .1)):
    t = np.arange(int(d * SR)) / SR
    s = sum(h * np.sin(2 * np.pi * f * (k + 1) * t) for k, h in enumerate(harm))
    return s * env(len(t), a, r)

def noise_sweep(d, f0, f1):
    n = int(d * SR); x = np.random.randn(n)
    # simple moving-average band shaping that sweeps in brightness
    k = np.linspace(f0, f1, n); y = np.zeros(n); acc = 0.0
    for i in range(n):
        a = min(1.0, 2 * np.pi * k[i] / SR); acc += a * (x[i] - acc); y[i] = acc
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2

def click(t):                      # tap : clic doux + petite note
    add(tone(1320, .08, .001, .07, (1, .2)), t, 0.1, .22)
    add(noise_sweep(.05, 3000, 6000), t, 0, .12)

np.random.seed(7)
# nappe harmonique douce (Do majeur 9 -> Fa) sur toute la durée, 4 temps de 2,0 s
chords = [(130.8, 196, 261.6, 329.6), (110, 164.8, 220, 329.6), (87.3, 174.6, 261.6, 349.2), (98, 196, 293.7, 392)]
for bar in range(int(DUR / 2)):
    ch = chords[(bar // 2) % 4]
    for f in ch:
        add(tone(f, 2.6, .5, 1.2, (1, .25, .08)), bar * 2.0, 0.0, .045)
# pouls léger (120 BPM)
for b in range(int(DUR * 2)):
    t = b * .5
    if t >= 1.0 and t < 62:
        add(tone(60, .22, .002, .2, (1, .5)), t, 0, .16 if b % 2 == 0 else .08)
# whooshes de transition
for t in (5.0, 12.0, 19.0, 26.0, 35.0, 41.0, 49.0, 55.0, 62.0):
    add(noise_sweep(.9, 300, 5000), t - .2, 0, .35)
# titre : arpège d'ouverture
for k, f in enumerate((523.3, 659.3, 784, 1046.5)):
    add(tone(f, .6, .01, .5, (1, .2)), .4 + k * .13, -.2 + k * .15, .12)
# clics (taps) calés sur les gestes du curseur
for t in (8.0, 15.5, 21.3, 24.0, 27.2, 31.2, 33.4, 42.5, 47.6):
    click(t)
# frappe du code OTP
for i in range(5):
    add(tone(880 + (i % 3) * 60, .04, .001, .035, (1,)), 27.8 + i * .22, .1, .08)
# succès : carillon montant (bulletin délivré)
for k, f in enumerate((659.3, 784, 987.8, 1318.5)):
    add(tone(f, .9, .01, .8, (1, .3, .1)), 49.6 + k * .09, 0, .16)
# apparition du bulletin
add(noise_sweep(.5, 800, 7000), 50.2, 0.2, .28)
add(tone(1568, .7, .005, .6, (1, .25)), 50.9, .2, .12)
# cartes récap
for i in range(4):
    add(tone(523.3 * (1.2 ** i), .35, .003, .3, (1, .35)), 55.9 + i * .28, -.3 + .2 * i, .14)
# final : accord ouvert
for f in (261.6, 392, 523.3, 784):
    add(tone(f, 5.5, .1, 3.5, (1, .3, .1)), 62.4, 0, .11)

# master : normalisation douce + fondu de sortie
out = np.stack([L, R], 1)
out *= np.minimum(1, np.minimum(np.arange(N) / (SR * .5), (N - np.arange(N)) / (SR * 2.0)))[:, None]
out = np.tanh(out * 1.6) / 1.0
out *= 0.89 / max(1e-9, np.abs(out).max())
pcm = (out * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'sound.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
