# Hommage · Apôtre Amos Elite (version 2, avec ses photos)

Film vertical 1080×1920, 40 s, dans le style d'un « motion flyer » de félicitations : fond acier à arches, titre serif géant, rubans, flashs blancs, zooms-coups sur chaque photo, bandeau de nom.

- `ANNIVERSAIRE_Hommage_Apotre_Amos_Elite.mp4` : la vidéo finale avec la musique (sans voix).
- `out/musique.wav` : la musique seule (−14 LUFS), pour un remontage dans CapCut.
- `photos/01..09.jpg` : les 9 photos, dans l'ordre d'apparition. **Pour en retirer une**, supprime le fichier et renumérote ; la durée de la scène des photos s'adapte au nombre de photos, mais le final est calé sur 40 s.
- `index.html` : toute l'animation. Le bloc `CONFIG` en haut regroupe les textes, l'ordre des mots et le cadrage du visage de chaque photo (`face`).

## Minutage (120 BPM, une mesure = 2 s)

| Temps | Scène | Fenêtre de voix |
|---|---|---|
| 0 – 8 s | Carte titre « AMOS ELITE · Apôtre · Père de la zone 242 » | « Joyeux anniversaire, Apôtre Amos Elite. » (à partir de 3 s) |
| 8 – 26 s | 9 photos, 2 s chacune : ANNIVERSAIRE · PÈRE · GUIDE · AMOUR · FOI · EXEMPLE · LUMIÈRE · MERCIS · ZONE 242 | Le porte-parole dit **un mot par photo**, sur le grand mot affiché. |
| 26 – 31 s | Bulles « La zone 242 vous dit : » | **Clips de la communauté** : 7 clips de 2 à 3 s, un par bulle (une toutes les 0,5 s à partir de 26,5 s). |
| 32 – 40 s | Lumière, médaillon, logo, vœu final | Tous en chœur : « Joyeux anniversaire Papa ! » à 32,2 s, puis le texte à l'écran. |

## Refaire le rendu

```
node render.mjs out/silencieux.mp4 30
python3 music2.py out/musique_brute.wav      # puis normalisation à -14 LUFS avec ffmpeg (loudnorm)
ffmpeg -i out/silencieux.mp4 -i out/musique.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest ANNIVERSAIRE_Hommage_Apotre_Amos_Elite.mp4
```
