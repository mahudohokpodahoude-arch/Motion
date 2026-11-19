# Sons de messagerie : envoi, réception, frappe au clavier, entrée de l'écran final. 29,6 s. Synthèse pure, sans échantillon.
import numpy as np, wave, sys
SR, DUR = 44100, 30.0
N = int(SR * DUR); rng = np.random.default_rng(7); L = np.zeros(N); R = np.zeros(N)
def put(sig, at, pan=0.0, g=1.0):
    i = int(round(at * SR))
    if i < 0 or i >= N: return
    s = sig[: N - i]; L[i:i + len(s)] += s * g * np.sqrt(.5 * (1 - pan)); R[i:i + len(s)] += s * g * np.sqrt(.5 * (1 + pan))
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(x / max(a, 1e-4), 1) * np.exp(-x / d)
def lp(x, f):
    from scipy.signal import lfilter
    a = 1 - np.exp(-2 * np.pi * f / SR); return lfilter([a], [1, -(1 - a)], x)
def sent(at):                                   # « pop » montant
    n = int(SR * .16); x = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(520 + 700 * np.minimum(x / .08, 1)) / SR
    put(np.sin(ph) * env(n, .002, .05) * .55, at, .3)
def recv(at):                                   # double « ding »
    for k, f in enumerate((988, 1319)):
        n = int(SR * .45); x = np.arange(n) / SR
        put((np.sin(2 * np.pi * f * x) + .25 * np.sin(2 * np.pi * 2 * f * x)) * env(n, .002, .12) * .45, at + k * .11, -.3)
def key(at):                                    # frappe douce
    n = int(SR * .05); nz = rng.standard_normal(n); x = np.arange(n) / SR
    put((lp(nz, 3800) - lp(nz, 700)) * env(n, .0005, .008) * 2.2 + np.sin(2 * np.pi * 180 * x) * env(n, .0005, .012) * .35, at, rng.uniform(-.2, .2), .4)
def whoosh(at, dur, g):
    n = int(SR * dur); nz = rng.standard_normal(n); put((lp(nz, 7000) - lp(nz, 500)) * np.sin(np.linspace(0, np.pi, n)) ** 1.6, at, 0, g)
ME = [(2.0, 1.1), (7.4, 6.5), (14.0, 13.3), (20.6, 19.8)]
HER = [4.6, 10.6, 16.6, 23.0]
for t, tt in ME:
    k = tt
    while k < t - .18: key(k); k += .07 + rng.uniform(0, .05)
    sent(t)
for t in HER: recv(t)
whoosh(25.4, .6, .5)
for k, f in enumerate((523, 659, 784, 1047)):
    n = int(SR * 1.2); x = np.arange(n) / SR; put((np.sin(2 * np.pi * f * x) + .2 * np.sin(2 * np.pi * 2 * f * x)) * env(n, .003, .35) * .3, 25.9 + k * .09, 0)
g = 10 ** (-3 / 20) / max(np.abs(L).max(), np.abs(R).max())
out = (np.stack([L, R], 1) * g * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w_:
    w_.setnchannels(2); w_.setsampwidth(2); w_.setframerate(SR); w_.writeframes(out.tobytes())
print("OK")
