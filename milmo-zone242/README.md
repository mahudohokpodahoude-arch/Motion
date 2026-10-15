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
