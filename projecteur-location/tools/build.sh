#!/bin/sh
# Construit la pub de A à Z : bande-son -> contrôle HyperFrames -> rendu MP4 -> vérifications.
# Depuis le dossier du projet :  sh tools/build.sh   (ou npm run rendu)
# Variables optionnelles : VARS='{"prix":"6 000"}'  OUT=final/autre.mp4
set -e
cd "$(dirname "$0")/.."
OUT=${OUT:-final/Location_Projecteur_9x16.mp4}
# Chromium déjà installé dans l'environnement (sinon : npx hyperframes browser ensure)
[ -n "$HYPERFRAMES_BROWSER_PATH" ] || for p in /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell; do [ -x "$p" ] && export HYPERFRAMES_BROWSER_PATH="$p"; done

echo "== 1/4 bande-son (synthétisée depuis score.js)"
node sound/song.js
ffmpeg -y -v error -i assets/audio/soundtrack.wav -c:a pcm_s24le assets/audio/tmp.wav && mv assets/audio/tmp.wav assets/audio/soundtrack.wav

echo "== 2/4 contrôle de la composition"
npx hyperframes lint .

echo "== 3/4 rendu 1080x1920 @ 30 i/s"
mkdir -p "$(dirname "$OUT")"
if [ -n "$VARS" ]; then
  npx hyperframes render . -o "$OUT" -f 30 -q looks -w 4 --variables "$VARS"
else
  npx hyperframes render . -o "$OUT" -f 30 -q looks -w 4
fi

echo "== 4/4 vérifications (format, durée, synchro son/image, niveau)"
python3 tools/verify.py "$OUT"
