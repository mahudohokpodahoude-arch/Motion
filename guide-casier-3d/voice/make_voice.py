"""Voix off (synthèse Piper via sherpa-onnx, modèles fr_FR siwis + upmc) puis calage de la timeline sur la voix.
Usage : python3 voice/make_voice.py <dossier_modeles>   -> voice/line_XX.wav + timeline.json"""
import sys, os, json, math, wave
import numpy as np, sherpa_onnx

M = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__))
def load(name, f):
    d = os.path.join(M, name)
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
        model=os.path.join(d, f), tokens=os.path.join(d, 'tokens.txt'), data_dir=os.path.join(d, 'espeak-ng-data')), num_threads=2))
    return sherpa_onnx.OfflineTts(cfg)
F = load('vits-piper-fr_FR-siwis-medium', 'fr_FR-siwis-medium.onnx')
U = load('vits-piper-fr_FR-upmc-medium', 'fr_FR-upmc-medium.onnx')
spk = json.load(open(os.path.join(M, 'vits-piper-fr_FR-upmc-medium', 'fr_FR-upmc-medium.onnx.json'))).get('speaker_id_map', {})
PIERRE = spk.get('pierre', 1)

sys.path.insert(0, HERE)
from lines import LINES, write_timeline, BT
def synth(i, speed):
    v, text, _ = LINES[i]
    a = (F if v == 'F' else U).generate(text, sid=0 if v == 'F' else PIERRE, speed=speed)
    x = np.array(a.samples, dtype=np.float32); sr = a.sample_rate
    e = np.abs(x) > 0.02; idx = np.where(e)[0]; x = x[idx[0]:idx[-1] + 1]          # coupe les silences
    x = np.tanh(x * 1.6 / max(1e-6, np.abs(x).max())) * .9                          # niveau + légère compression
    return x, sr
for speed in (1.12, 1.2, 1.3):
    clips = [synth(i, speed) for i in range(len(LINES))]
    try: beats = write_timeline([len(x) / sr for x, sr in clips]); break
    except AssertionError: continue
print('vitesse', speed, 'temps', beats, 'total', sum(beats), '=', round(sum(beats) * BT, 2), 's')
for i, (x, sr) in enumerate(clips):
    with wave.open(os.path.join(HERE, f'line_{i:02d}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x * 32767).astype('<i2').tobytes())
