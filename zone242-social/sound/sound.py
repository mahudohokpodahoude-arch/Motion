#!/usr/bin/env python3
"""Sound design synthétisé de zéro (aucun sample) pour la vidéo ZONE 242.

Usage : python3 sound.py musique_coupee.wav sortie_mix.wav [sortie_sfx.wav]

Les instants viennent de src/timeline.ts et des composants (src/Intro.tsx,
src/Scenes.tsx). Si l'un change, il faut mettre à jour la table EVENTS ici.
Nécessite numpy et scipy.
"""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
FPS = 30
BPM = 129.8
BEAT_F = FPS * 60 / BPM  # images par temps
TOTAL_BEATS = 136
rng = np.random.default_rng(242)


def b(n):  # même arrondi que Math.round côté TypeScript
    return int(np.floor(n * BEAT_F + 0.5))


SCENE = dict(intro=0, slogan=12, chiffres=28, parcours=44, site=64, venir=96, cta=116)
TOTAL_FRAMES = b(TOTAL_BEATS)
DUR = TOTAL_FRAMES / FPS


def t_of(scene, rel_beats=0.0, frames=0):
    return (b(SCENE[scene]) + b(rel_beats) + frames) / FPS


# ───────── synthèse ─────────
def band_noise(n, lo, hi):
    x = rng.standard_normal(n)
    sos = butter(2, [lo, min(hi, SR / 2 - 100)], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x)


def lowpass(x, fc):
    return sosfilt(butter(2, fc, btype="low", fs=SR, output="sos"), x)


def tvec(dur):
    return np.arange(int(dur * SR)) / SR


def key(f0):
    t = tvec(0.07)
    nz = band_noise(len(t), 1800, 7000) * np.exp(-t / 0.007)
    tone = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.018)
    return 0.55 * nz + 0.25 * tone


def click():
    t = tvec(0.25)
    thump = np.sin(2 * np.pi * (70 + 60 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.07)
    nz = band_noise(len(t), 1500, 9000) * np.exp(-t / 0.006)
    return 0.7 * thump + 0.5 * nz


def whoosh(dur, rising=True):
    n = int(dur * SR)
    t = np.arange(n) / n
    out = np.zeros(n)
    bands = [(200, 800, 0.30), (800, 2500, 0.55), (2500, 9000, 0.80)]
    if not rising:
        bands = [(lo, hi, 1 - c) for lo, hi, c in bands]
    for lo, hi, c in bands:
        env = np.exp(-((t - c) ** 2) / (2 * 0.16 ** 2))
        out += band_noise(n, lo, hi) * env
    fade = np.minimum(1, np.minimum(t * 20, (1 - t) * 8))
    return out * fade * 0.25


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / n
    out = np.zeros(n)
    for lo, hi, c in [(300, 1200, 0.5), (1200, 4000, 0.8), (4000, 12000, 1.0)]:
        env = np.clip((t - (c - 0.55)) / 0.55, 0, 1) ** 2
        out += band_noise(n, lo, hi) * env
    return out * 0.18 * np.minimum(1, (1 - t) * 40 + 0.0)


def impact(size=1.0):
    t = tvec(1.8)
    boom = np.sin(2 * np.pi * (48 + 70 * np.exp(-t / 0.05)) * t) * np.exp(-t / 0.45)
    nz = lowpass(band_noise(len(t), 150, 6000), 4000) * np.exp(-t / 0.10)
    tail = lowpass(band_noise(len(t), 80, 2500), 1800) * np.exp(-t / 0.8) * 0.12
    return size * (0.9 * boom + 0.4 * nz + tail)


def tick(f, dur=0.07):
    t = tvec(dur)
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.012) * 0.35


def pop(f0, f1, dur=0.12):
    t = tvec(dur)
    f = f0 + (f1 - f0) * np.minimum(1, t / 0.06)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.035) * 0.5


def ding(f, dur=0.55):
    t = tvec(dur)
    x = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t) + 0.2 * np.sin(2 * np.pi * 3 * f * t)
    return x * np.exp(-t / 0.22) * 0.28


def plop():
    t = tvec(0.25)
    f = 700 * np.exp(-t / 0.05) + 180
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.07) * 0.6


# ───────── événements ─────────
EVENTS = []  # (temps_s, signal, gain, pan)


def add(t, sig, gain=1.0, pan=0.0):
    EVENTS.append((t, sig, gain, pan))


# Intro : frames absolues (src/Intro.tsx : keyFrames, tap, expandStart, logoIn)
KEY_FRAMES = [18, 23, 27, 33, 37, 42, 49, 53, 58, 62, 68, 73]
add(0 / FPS, pop(300, 700, 0.18), 0.8)  # la barre apparaît
for i, f in enumerate(KEY_FRAMES):
    add(f / FPS, key(1500 + 90 * ((i * 7) % 5)), 0.8, pan=-0.15 + 0.3 * ((i % 3) / 2))
add(80 / FPS, pop(500, 900), 0.6)  # le bouton s'active
add(102 / FPS, click(), 1.0)  # tap
add(104 / FPS, whoosh(0.7, True), 0.9)  # le cercle blanc s'étend
add(122 / FPS, impact(0.55), 0.9)  # le logo apparaît

# Slogan
for at in (1.5, 5, 8.5):
    add(t_of("slogan", at, 2), whoosh(0.35, True), 0.7)
    add(t_of("slogan", at, 5), impact(0.45), 0.7)
add(t_of("slogan", 11.5, 3), pop(500, 1100), 0.7)

# Transitions : riser avant, impact sur le temps fort de début de scène
for sc in ("chiffres", "parcours", "site", "venir", "cta"):
    t0 = t_of(sc)
    add(t0 - 0.9, riser(0.9), 0.8)
    add(t0, impact(0.8), 1.0)

# Chiffres : pop + tic-tac de comptage (1,6 temps) à chaque statistique
for at in (1, 4, 7, 9.5):
    t0 = t_of("chiffres", at)
    add(t0, pop(350, 800), 0.8)
    n = 7
    for k in range(n):
        add(t0 + k * (b(1.6) / FPS) / n, tick(900 + 120 * k), 0.6)
    add(t0 + b(1.6) / FPS, ding(1320, 0.4), 0.5)
add(t_of("chiffres", 11, 2), pop(300, 700), 0.8)
add(t_of("chiffres", 11.5), whoosh(b(3) / FPS, True), 0.5)
add(t_of("chiffres", 14.5), ding(1760), 0.7)

# Parcours : lignes puis surbrillance de chaque étape
for i in range(6):
    add(t_of("parcours", 1 + i * 0.5, 2), tick(700 + 60 * i), 0.7)
SCALE = [0, 2, 4, 7, 9, 12]  # gamme pentatonique ascendante
for k in range(6):
    add(t_of("parcours", 4 + k * 2.4), ding(660 * 2 ** (SCALE[k] / 12)), 0.9)

# Site : téléphone et pastilles du menu
add(t_of("site"), whoosh(0.9, True), 0.8)
for i in range(9):
    add(t_of("site", 3 + i * 2.8, 2), pop(380, 950), 0.75, pan=-0.35 if i % 2 == 0 else 0.35)

# Venir
add(t_of("venir", 0, 2), whoosh(0.4, True), 0.6)
for at in (3, 5):
    add(t_of("venir", at, 2), whoosh(0.3, True), 0.6)
    add(t_of("venir", at, 6), impact(0.35), 0.7)
add(t_of("venir", 8, 3), whoosh(0.35, True), 0.6)
add(t_of("venir", 9, 4), plop(), 0.9)

# Appel à l'action
add(t_of("cta", 0, 3), pop(300, 800), 0.8)
add(t_of("cta", 3, 3), pop(250, 900, 0.18), 1.0)
add(t_of("cta", 3, 4), impact(0.6), 0.8)
add(t_of("cta", 6, 3), pop(450, 900), 0.8)
add(t_of("cta", 7, 3), pop(500, 1000), 0.8)
add(t_of("cta", 8), ding(1320, 1.0), 0.6)
add((TOTAL_FRAMES - FPS * 2.4) / FPS, impact(0.9), 0.9)  # impact final

# ───────── rendu ─────────
def render_sfx():
    n = int(DUR * SR) + SR * 2
    L = np.zeros(n)
    R = np.zeros(n)
    for t, sig, gain, pan in EVENTS:
        i = int(max(0, t) * SR)
        sig = sig[: n - i] * gain
        L[i : i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
        R[i : i + len(sig)] += sig * np.sqrt((1 + pan) / 2)
    return np.stack([L, R], axis=1)[: int(DUR * SR)]


def read_wav(path):
    sr, x = wavfile.read(path)
    assert sr == SR, f"{path} : attendu {SR} Hz, reçu {sr}"
    x = x.astype(np.float32)
    if x.dtype != np.float32 or np.abs(x).max() > 1.5:
        x = x / 32768.0
    return x if x.ndim == 2 else np.stack([x, x], axis=1)


def write_wav(path, x):
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


if __name__ == "__main__":
    music_path, out_mix = sys.argv[1], sys.argv[2]
    sfx = render_sfx()
    music = read_wav(music_path)
    n = min(len(music), len(sfx))
    music, sfx = music[:n], sfx[:n]
    # fondu d'entrée bref et fondu de sortie sur les 2,4 dernières secondes
    fi = int(0.03 * SR)
    music[:fi] *= np.linspace(0, 1, fi)[:, None]
    fo = int(2.4 * SR)
    music[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    mix = 0.8 * music + 0.9 * sfx
    write_wav(out_mix, mix / max(1.0, np.abs(mix).max() / 0.98))
    if len(sys.argv) > 3:
        write_wav(sys.argv[3], sfx / max(1.0, np.abs(sfx).max() / 0.98))
    print(f"événements : {len(EVENTS)} · durée : {DUR:.2f} s · pic SFX : {np.abs(sfx).max():.2f}")
