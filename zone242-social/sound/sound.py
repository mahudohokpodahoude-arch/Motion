#!/usr/bin/env python3
"""Sound design synthétisé de zéro (aucun sample) pour la vidéo ZONE 242.

Usage : python3 sound.py musique_coupee.wav sortie_mix.wav [sortie_sfx.wav]

Principes de cohérence avec la musique :
  * tempo : 129,8 BPM (mesuré) ; chaque son est posé EXACTEMENT sur un temps,
    une croche ou une double-croche, sans décalage en images ;
  * tonalité : ré mineur / fa majeur (estimée, fondamentale des basses ≈ fa,
    43,65 Hz) ; les sons tonals n'utilisent que des notes de cette gamme ;
  * peu de sons : les effets accompagnent la musique, ils ne la couvrent pas.

Les instants viennent de src/timeline.ts, src/Intro.tsx et src/World.tsx.
Nécessite numpy et scipy.
"""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
FPS = 30
BPM = 129.8
BEAT_S = 60.0 / BPM
TOTAL_BEATS = 136
WORLD_START = 6  # temps (beats) où le monde 3D commence
DUR = TOTAL_BEATS * BEAT_S
rng = np.random.default_rng(242)

# ── gamme de ré mineur (= fa majeur) ──
D5, E5, F5, G5, A5 = 587.33, 659.26, 698.46, 783.99, 880.00
D6, F6 = 1174.66, 1396.91
F1, F2, F3 = 43.65, 87.31, 174.61


def T(beat):
    """Temps absolu (s) d'un temps de la grille musicale."""
    return beat * BEAT_S


def W(rel_beat):
    """Temps absolu (s) pour un temps relatif au début du monde 3D."""
    return (WORLD_START + rel_beat) * BEAT_S


# ───────── synthèse ─────────
def band_noise(n, lo, hi):
    x = rng.standard_normal(n)
    sos = butter(2, [lo, min(hi, SR / 2 - 100)], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x)


def lowpass(x, fc):
    return sosfilt(butter(2, fc, btype="low", fs=SR, output="sos"), x)


def tvec(dur):
    return np.arange(int(dur * SR)) / SR


def key():
    """Touche de clavier : clic bref, presque sans hauteur (aucune note à accorder)."""
    t = tvec(0.06)
    nz = band_noise(len(t), 1500, 5500) * np.exp(-t / 0.006)
    thock = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.012)
    return 0.5 * nz + 0.3 * thock


def click():
    t = tvec(0.22)
    thump = np.sin(2 * np.pi * (F2 + 40 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.08)
    nz = band_noise(len(t), 1500, 7000) * np.exp(-t / 0.006)
    return 0.6 * thump + 0.4 * nz


def whoosh(dur, rising=True):
    n = int(dur * SR)
    t = np.arange(n) / n
    out = np.zeros(n)
    bands = [(200, 700, 0.30), (700, 2200, 0.55), (2200, 7000, 0.80)]
    if not rising:
        bands = [(lo, hi, 1 - c) for lo, hi, c in bands]
    for lo, hi, c in bands:
        env = np.exp(-((t - c) ** 2) / (2 * 0.16 ** 2))
        out += band_noise(n, lo, hi) * env
    fade = np.minimum(1, np.minimum(t * 20, (1 - t) * 8))
    return out * fade * 0.2


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / n
    out = np.zeros(n)
    for lo, hi, c in [(300, 1200, 0.5), (1200, 3800, 0.8), (3800, 9000, 1.0)]:
        env = np.clip((t - (c - 0.55)) / 0.55, 0, 1) ** 2
        out += band_noise(n, lo, hi) * env
    return out * 0.14


def boom(size=1.0, dur=1.6):
    """Impact accordé sur le fa : F1 (sub), F2 et F3 pour rester audible sur un téléphone."""
    t = tvec(dur)
    drop = np.exp(-t / 0.05)
    sub = np.sin(2 * np.pi * (F1 + F1 * drop) * t) * np.exp(-t / 0.5)
    mid = np.sin(2 * np.pi * (F2 + F2 * 0.5 * drop) * t) * np.exp(-t / 0.35)
    hi = np.sin(2 * np.pi * F3 * t) * np.exp(-t / 0.22)
    nz = lowpass(band_noise(len(t), 150, 5000), 3500) * np.exp(-t / 0.08)
    return size * (0.7 * sub + 0.55 * mid + 0.22 * hi + 0.25 * nz)


def tick(f=D6, dur=0.06):
    t = tvec(dur)
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.011) * 0.3


def pop(f1, dur=0.14):
    """Petit « bloop » qui glisse vers une note de la gamme."""
    t = tvec(dur)
    f = f1 * (0.6 + 0.4 * np.minimum(1, t / 0.05))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.04) * 0.45


def ding(f, dur=0.6):
    t = tvec(dur)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3 * f * t)
    return x * np.exp(-t / 0.2) * 0.26


def plop():
    t = tvec(0.25)
    f = 360 * np.exp(-t / 0.05) + F3
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.07) * 0.5


# ───────── événements ─────────
EVENTS = []  # (temps_s, signal, gain, pan)


def add(t, sig, gain=1.0, pan=0.0):
    EVENTS.append((t, sig, gain, pan))


# Ouverture : tout sur la grille (src/Intro.tsx)
add(T(0), pop(D5), 0.7)  # la barre apparaît
for i in range(12):  # une touche par double-croche, de 0,5 à 3,25
    add(T(0.5 + 0.25 * i), key(), 0.8, pan=-0.12 + 0.12 * (i % 3))
add(T(3.5), pop(F5), 0.5)  # le bouton s'active
add(T(4), click(), 1.0)  # tap, sur le temps 4
add(T(4) + 0.06, whoosh(T(1.5) - 0.06, False), 0.55)  # la barre fuit dans la profondeur
add(T(6) - T(1.0), riser(T(1.0)), 0.5)  # montée vers l'arrivée du téléphone
add(T(7), boom(0.8), 0.85)  # le téléphone se pose

# Plans (src/timeline.ts : SHOTS) : une coupe sur chaque temps de début de plan,
# puis le panneau arrive une croche plus tard (souffle qui finit sur la note).
SHOTS = [(0, 10), (10, 18), (18, 28), (28, 38), (38, 48), (48, 58), (58, 68), (68, 80), (80, 92), (92, 104), (104, 116)]
NOTES = [F5, D5]
for idx, (s, e) in enumerate(SHOTS):
    if s > 0:  # coupe : petit coup grave accordé + souffle qui finit pile sur le temps
        add(W(s) - 0.25, whoosh(0.25, True), 0.4)
        add(W(s), boom(0.35, 0.8), 0.55)
    land = W(s + 1.0)
    add(land - 0.32, whoosh(0.32, True), 0.45, pan=-0.2 if idx % 2 == 0 else 0.2)
    add(land, pop(NOTES[idx % 2]), 0.45)

# Contenus animés (les panneaux commencent une croche après le plan)
for k in range(6):  # compteur « 2 / 20 » : 6 tics en double-croches
    add(W(18.5 + 0.25 * k), tick(D6), 0.5)
add(W(18.5 + 1.75), ding(F6, 0.45), 0.5)
SCALE = [D5, E5, F5, G5, A5, D6]  # les 6 étapes : gamme de ré mineur qui monte
for k in range(6):
    add(W(30 + 1.5 * k), ding(SCALE[k]), 0.8)
for k in range(5):  # compteur « 7 » puis barre de progression
    add(W(58.5 + 0.25 * k), tick(D6), 0.4)
add(W(58.5 + 4), ding(A5, 0.5), 0.5)
add(W(92.5 + 2), ding(D6, 0.5), 0.5)

# Appel à l'action (src/World.tsx : CTA_START = 116)
add(W(116) - 0.25, whoosh(0.25, True), 0.4)
add(W(116), boom(0.35, 0.8), 0.55)  # coupe vers le plan final
add(W(116 + 0.5) - T(2.0), riser(T(2.0)), 0.55)
add(W(116 + 1.0), boom(0.9), 0.9)  # le logo se pose
add(W(116 + 2.5), pop(F5), 0.6)  # adresse du site
add(W(116 + 2.5) + 0.03, ding(D6, 0.5), 0.5)
add(W(116 + 5.5), pop(D5), 0.5)
add(W(116 + 6.5), pop(F5), 0.5)
add(W(116 + 8.0), ding(F6, 1.0), 0.5)
add(T(130), boom(1.0, 2.0), 0.9)  # impact final sur un temps fort


# ───────── rendu ─────────
def render_sfx():
    n = int(DUR * SR) + SR * 3
    L = np.zeros(n)
    R = np.zeros(n)
    for t, sig, gain, pan in EVENTS:
        i = int(max(0, t) * SR)
        sig = sig[: n - i] * gain
        L[i : i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
        R[i : i + len(sig)] += sig * np.sqrt((1 + pan) / 2)
    out = np.stack([L, R], axis=1)[: int(DUR * SR)]
    # adoucit les aigus : les effets ne doivent pas piquer au-dessus de la musique
    sos = butter(2, 9500, btype="low", fs=SR, output="sos")
    return sosfilt(sos, out, axis=0)


def read_wav(path):
    sr, x = wavfile.read(path)
    assert sr == SR, f"{path} : attendu {SR} Hz, reçu {sr}"
    x = x.astype(np.float32) / 32768.0
    return x if x.ndim == 2 else np.stack([x, x], axis=1)


def write_wav(path, x):
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


if __name__ == "__main__":
    music_path, out_mix = sys.argv[1], sys.argv[2]
    sfx = render_sfx()
    music = read_wav(music_path)
    n = min(len(music), len(sfx))
    music, sfx = music[:n], sfx[:n]
    fi = int(0.03 * SR)
    music[:fi] *= np.linspace(0, 1, fi)[:, None]
    fo = int(2.4 * SR)
    music[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    # Niveau des effets : réduit deux fois sur retour client (0,9 → 0,5 → 0,35).
    SFX_LEVEL = 0.35
    mix = 0.85 * music + SFX_LEVEL * sfx
    write_wav(out_mix, mix / max(1.0, np.abs(mix).max() / 0.98))
    if len(sys.argv) > 3:
        write_wav(sys.argv[3], sfx / max(1.0, np.abs(sfx).max() / 0.98))
    rms_m = np.sqrt((music ** 2).mean())
    rms_s = np.sqrt(((SFX_LEVEL * sfx) ** 2).mean())
    print(f"événements : {len(EVENTS)} · durée : {DUR:.2f} s · pic SFX : {np.abs(sfx).max():.2f} · "
          f"niveau effets / musique (RMS) : {20 * np.log10(rms_s / rms_m):.1f} dB")
