"""Bande-son dynamique (128 BPM) : kick, clap, hi-hats, basse, arpège, pompage, impacts à chaque changement d'écran,
clics calés sur les gestes du curseur, et voix off (voice/line_XX.wav) calée sur timeline.json.
Tout est synthétisé de zéro (aucun sample). Usage : python3 sound.py out.wav (numpy uniquement)"""
import sys, os, json, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'))); TT = TL['TT']; BT = 60 / TL['BPM']
SR = 44100; DUR = TT[10]; N = int(SR * DUR) + SR
rng = np.random.default_rng(7)
Lm = np.zeros(N); Rm = np.zeros(N)      # musique
Lv = np.zeros(N); Rv = np.zeros(N)      # voix

def put(L, R, sig, t, pan=0.0, g=1.0):
    i = int(t * SR); sig = sig[:max(0, N - i)]
    if len(sig) == 0 or i < 0: return
    L[i:i + len(sig)] += sig * g * (1 - max(pan, 0)); R[i:i + len(sig)] += sig * g * (1 + min(pan, 0))
def tt(d): return np.arange(int(d * SR)) / SR
def kick():
    t = tt(.38); f = 44 + 120 * np.exp(-t * 26); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) + .25 * np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 300)
def clap():
    t = tt(.22); n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0); env = np.exp(-t * 24)
    for k in (.0, .012, .024): env += .8 * np.exp(-np.clip(t - k, 0, None) * 60) * (t >= k) * .3
    return n * env * .55 + np.sin(2 * np.pi * 185 * t) * np.exp(-t * 35) * .4
def hat(open_=False):
    t = tt(.16 if open_ else .05); n = np.diff(np.diff(rng.standard_normal(len(t)), prepend=0), prepend=0); return n * np.exp(-t * (18 if open_ else 80)) * .35
def pluck(f, d=.22, harm=(1, .5, .3, .15), dec=9):
    t = tt(d); s = sum(h * np.sin(2 * np.pi * f * (k + 1) * t) for k, h in enumerate(harm)); return s * np.exp(-t * dec) * np.minimum(1, t / .003)
def bass(f, d=.24):
    t = tt(d); s = np.sin(2 * np.pi * f * t) + .45 * np.sin(2 * np.pi * 2 * f * t) + .2 * np.sin(2 * np.pi * 3 * f * t)
    return np.tanh(s * 1.4) * np.exp(-t * 6) * np.minimum(1, t / .004)
def whoosh(d, up=True):
    t = tt(d); n = rng.standard_normal(len(t)); n = np.convolve(n, np.ones(14) / 14, 'same')
    sw = (t / d) ** 2 if up else (1 - t / d) ** 2; return n * sw * 2.2
def click():
    t = tt(.09); return np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 55) * .6 + np.diff(rng.standard_normal(len(t)), prepend=0) * np.exp(-t * 120) * .25

CH = [(65.4, [261.6, 329.6, 392, 523.3]), (49.0, [196, 246.9, 293.7, 392]), (55.0, [220, 261.6, 329.6, 440]), (43.65, [174.6, 220, 261.6, 349.2])]
total_beats = int(round(DUR / BT)); drums_end = TL['beats'][9]          # la batterie se tait au début de l'outro
kicks = []
K, C, H, HO = kick(), clap(), hat(), hat(True)
for b in range(total_beats + 1):
    t = b * BT; bar = b // 4; root, chord = CH[bar % 4]
    if b < drums_end:
        put(Lm, Rm, K, t, 0, .95); kicks.append(t)
        if b % 4 in (1, 3) and b >= 4: put(Lm, Rm, C, t, 0, .75)
        put(Lm, Rm, H, t + BT / 2, .15, .5); put(Lm, Rm, HO if b % 2 else H, t + BT * .75, -.15, .3 if b % 2 else .25)
        put(Lm, Rm, bass(root * 2 if b % 8 >= 4 else root * 2, .22), t + BT / 2, 0, .55)       # basse à contretemps
    for s in range(4):                                                                          # arpège en doubles croches
        idx = [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 1, 3, 2, 1, 0, 2][(b % 4) * 4 + s]
        gain = .2 if b < drums_end else .13
        put(Lm, Rm, pluck(chord[idx] * 2, .2), t + s * BT / 4, -.5 + .25 * idx, gain)
# impacts à chaque changement d'écran + montée avant
for i in range(1, 9):
    t = TT[i]; put(Lm, Rm, whoosh(.45, True), t - .45, 0, .5); put(Lm, Rm, pluck(98, .5, (1, .6), 5), t, 0, .5)
    put(Lm, Rm, whoosh(.3, False), t, .3, .3)
put(Lm, Rm, whoosh(.9, True), TT[7] - .9, 0, .6)
# clics calés sur les gestes du curseur (même table que index.html)
OLD = [5, 7, 7, 7, 9, 6, 8]; TAPS = {1: [3.0], 2: [3.5], 3: [2.3, 5.0], 4: [1.2, 5.2, 7.4], 6: [1.5, 6.6]}
for st, lst in TAPS.items():
    k = OLD[st] / (TT[st + 1] - TT[st])
    for tp in lst: put(Lm, Rm, click(), TT[st] + tp / k, .2, .7)
# succès : carillon sur l'étape 7, cartes du récap, accord final
for k, f in enumerate((659.3, 784, 987.8, 1318.5)): put(Lm, Rm, pluck(f, .9, (1, .3, .1), 3), TT[7] + .15 + k * .08, 0, .35)
for i in range(4): put(Lm, Rm, pluck(523.3 * 1.2 ** i, .4, (1, .35), 6), TT[8] + .25 + i * .14, -.3 + .2 * i, .3)
for f in (261.6, 392, 523.3, 784):
    t = tt(DUR - TT[9] + .5); put(Lm, Rm, np.sin(2 * np.pi * f * t) * np.exp(-t * .8) * np.minimum(1, t / .05), TT[9], 0, .12)
put(Lm, Rm, K, TT[9], 0, 1.0)

# voix off
tv = np.arange(N) / SR
for i in range(10):
    w = wave.open(os.path.join(HERE, 'voice', f'line_{i:02d}.wav')); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768; sr = w.getframerate()
    x = np.interp(np.arange(int(len(x) * SR / sr)) / SR * sr, np.arange(len(x)), x)
    x = x - np.concatenate([[0], x[:-1]]) * .0                                  # (pas de filtre : voix intacte)
    put(Lv, Rv, x, TT[i] + .06, 0, 1.0)
vo = np.convolve(np.abs(Lv + Rv), np.ones(int(.12 * SR)) / int(.12 * SR), 'same'); vo = np.clip(vo * 8, 0, 1)
vo = np.convolve(vo, np.ones(int(.08 * SR)) / int(.08 * SR), 'same')
# pompage (sidechain) : la grosse caisse creuse basse et arpège ; la voix baisse toute la musique
duck = np.ones(N); kt = np.array(kicks)
ph = np.full(N, 9.0)
for t in kt:
    i = int(t * SR); seg = np.arange(min(N - i, int(.4 * SR))) / SR; ph[i:i + len(seg)] = np.minimum(ph[i:i + len(seg)], seg)
duck = 1 - .45 * np.exp(-ph / .1)
music_gain = 1 - .5 * vo
Lo = Lm * music_gain * (.75 + .25 * duck) * .55 + Lv * 1.0; Ro = Rm * music_gain * (.75 + .25 * duck) * .55 + Rv * 1.0
out = np.stack([Lo, Ro], 1)[:int(DUR * SR)]
fade = np.minimum(1, np.minimum(np.arange(len(out)) / (SR * .15), (len(out) - np.arange(len(out))) / (SR * 1.2)))[:, None]
out = np.tanh(out * 1.3) * fade; out *= .89 / max(1e-9, np.abs(out).max())
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'sound.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('ok', round(DUR, 2), 's')
