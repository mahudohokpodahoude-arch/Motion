"""Remplace la voix de synthèse par un enregistrement humain.
Usage : python3 voice/import_voice.py enregistrement.(wav|mp3|m4a)
L'enregistrement contient les 10 phrases de lines.py, dans l'ordre, séparées par une vraie pause (≥ 0,6 s).
Le script découpe sur les silences, écrit voice/line_XX.wav et recale timeline.json ; il faut ensuite
refaire : python3 sound.py sound.wav, node render.mjs silent.mp4 30, puis le mux (voir README)."""
import sys, os, subprocess, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lines import LINES, write_timeline, HERE
SR = 44100
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, '<i2').astype(np.float32) / 32768
win = int(.02 * SR); env = np.sqrt(np.convolve(x * x, np.ones(win) / win, 'same'))
thr = max(.008, np.percentile(env, 90) * .08); voiced = env > thr
# segments : parole séparée par des silences d'au moins 0,45 s
segs = []; i = 0; n = len(x); gap = int(.45 * SR)
idx = np.where(voiced)[0]
if len(idx) == 0: sys.exit('aucune parole détectée')
start = prev = idx[0]
for j in idx[1:]:
    if j - prev > gap: segs.append((start, prev)); start = j
    prev = j
segs.append((start, prev))
segs = [(a, b) for a, b in segs if (b - a) > .25 * SR]
print(len(segs), 'segments détectés, attendus :', len(LINES))
if len(segs) != len(LINES): sys.exit('Le nombre de phrases détectées ne correspond pas : marquez des pauses plus nettes entre les phrases.')
durs = []
for k, (a, b) in enumerate(segs):
    a = max(0, a - int(.03 * SR)); b = min(n, b + int(.05 * SR)); seg = x[a:b]
    seg = seg / max(1e-6, np.abs(seg).max()) * .9
    with wave.open(os.path.join(HERE, f'line_{k:02d}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((seg * 32767).astype('<i2').tobytes())
    durs.append(len(seg) / SR)
print('durées', [round(d, 2) for d in durs]); print('temps', write_timeline(durs))
