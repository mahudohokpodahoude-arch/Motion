# MILMO → ZONE 242 : motion design vertical (10 s)

- `MILMO_ZONE242_vertical.mp4` : vidéo finale 1080×1920, 60 i/s, avec sound design (AAC stéréo, -14 LUFS).
- `index.html` : l’animation (SVG piloté par `render(t)`). Ouvrir dans un navigateur pour la voir en boucle, `?t=4.2` pour figer une image.
- `render.mjs` : `node render.mjs [sortie.mp4] [fps]` (Playwright + ffmpeg).
- Polices : Montserrat et IBM Plex Mono (licence OFL).
- `sound.py` : sound design synthétisé de zéro (aucun sample, aucun droit à payer), calé sur la timeline. `python3 sound.py sound.wav` (numpy + scipy).

Assemblage :
```
node render.mjs silent.mp4 60
python3 sound.py sound.wav
ffmpeg -i silent.mp4 -i sound.wav -map 0:v -map 1:a -c:v copy \
  -af "volume=3.6dB,alimiter=limit=0.89:attack=2:release=60:level=disabled" \
  -c:a aac -b:a 256k -movflags +faststart MILMO_ZONE242_vertical.mp4
```

## Version 2 · « Nuit » (`v2-nuit/`)
Charte officielle (Nuit, Chaux, Lumière). La lumière de MILMO dessine un globe, la caméra plonge sur Cotonou (06°22′N 02°25′E), le symbole-viseur fait la mise au point et verrouille la zone, puis le monogramme se trace d'un seul trait.
- `v2-nuit/MILMO_ZONE242_nuit.mp4` : vidéo finale avec son.
- `v2-nuit/index.html`, `v2-nuit/sound.py`.
```
node render.mjs --page v2-nuit/index.html silent.mp4 60
python3 v2-nuit/sound.py sound.wav
```

## Version 3 · 3D (`v3-3d/`)
Logo officiel ZONE 242 et logo MILMO vectorisés (`trace.mjs`, potrace) puis extrudés en 3D (three.js). Rendu image par image en WebGL, son synthétisé à 120 BPM (la naissance tombe sur le temps 8, à 4,0 s).
- `v3-3d/MILMO_ZONE242_3D.mp4` : vidéo finale 1080×1920, 60 i/s, 10 s, avec son (-14 LUFS).
```
cd v3-3d && npm install && node trace.mjs
node render.mjs silent.mp4 60
python3 sound.py sound.wav
```
