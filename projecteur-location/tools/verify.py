"""Contrôle d'un rendu : format, durée, et synchronisation son/image à chaque marqueur de score.js.
   python3 tools/verify.py out/film.mp4
Son : l'attaque (montée d'énergie la plus forte) doit tomber à ±20 ms du marqueur.
Image : le plus grand changement d'image (coupe, flash, impact) doit tomber à ±1 image du marqueur."""
import json, re, subprocess, sys
import numpy as np

path = sys.argv[1]
probe = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path], capture_output=True, text=True).stdout)
v = next(s for s in probe['streams'] if s['codec_type'] == 'video')
a = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
dur = float(probe['format']['duration'])
fps = eval(v['r_frame_rate'])
print(f"fichier   : {path}")
print(f"vidéo     : {v['codec_name']} {v.get('profile','')} {v['width']}x{v['height']} @ {fps:g} i/s, {v.get('pix_fmt')}")
print(f"audio     : {a['codec_name']} {a['sample_rate']} Hz {a['channels']} canaux" if a else "audio     : AUCUNE PISTE")
print(f"durée     : {dur:.3f} s")
ok = v['width'] == 1080 and v['height'] == 1920 and abs(fps - 30) < 1e-6 and dur <= 45.05 and a is not None and v['codec_name'] == 'h264'
print('format    :', 'OK' if ok else 'ÉCART')

# marqueurs depuis score.js
node = subprocess.run(['node', '-e', "const S=require('./score.js');console.log(JSON.stringify([S.markers,S.visualHits]))"], capture_output=True, text=True)
markers, hits = json.loads(node.stdout)

# ---- son : enveloppe d'énergie (fenêtres de 5 ms)
SR = 48000
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
x = np.frombuffer(pcm, dtype=np.float32)
hop = int(SR * 0.005)
n = len(x) // hop
env = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-12)
db = 20 * np.log10(env)
flux = np.maximum(0, np.diff(db, prepend=db[0]))

# ---- image : différence moyenne entre images successives (96x170, niveaux de gris)
W, H = 96, 170
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, H, W).astype(np.float32)
diff = np.concatenate([[0], np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))])

print('\nmarqueur        temps    son(Δms)  image(Δimg)')
fails = 0
for name, t in markers.items():
    i0, i1 = int((t - 0.06) / 0.005), int((t + 0.06) / 0.005)
    ia = i0 + int(np.argmax(flux[i0:i1]))
    da = (ia * 0.005 - t) * 1000
    f0 = int(round(t * fps))
    lo, hi = max(1, f0 - 3), min(len(diff) - 1, f0 + 3)
    fv = lo + int(np.argmax(diff[lo:hi + 1]))
    dv = fv - t * fps
    vis = name in hits
    good = abs(da) <= 20 and (abs(dv) <= 1.01 or not vis)
    fails += 0 if good else 1
    vtxt = f"{dv:+6.2f}" if vis else '   (transition)'
    print(f"{name:<14} {t:6.2f}   {da:+7.1f}   {vtxt}   {'✓' if good else '✗'}")
print('\nsynchro   :', 'OK' if fails == 0 else f'{fails} écart(s)')
# loudness et pic vrai (EBU R128, stéréo)
r = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
lu = re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]; tp = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1]
print(f"niveau    : {lu} LUFS intégrés, pic vrai {tp} dBTP")
