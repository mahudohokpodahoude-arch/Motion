#!/bin/sh
# Builds the ZONE 242 vision film in 9:16 and 16:9:
#   1. the soundtrack (song.js)
#   2. the 2D film (engine) for each format
#   3. the two 3D segments (../milmo-zone242/v3-3d) for each format
#   4. the final cut: 3D opening [0,8) + 2D [8,82) + 3D finale [82,90) + music
# The 3D segments are only rendered when missing (delete out/3d to force).
# Run from the project root: sh tools/build.sh
set -e
ROOT=$(pwd)
D3="$ROOT/../milmo-zone242/v3-3d"
OUT="$ROOT/out"
export CHROME_PATH="$ROOT/tools/chrome.sh"
mkdir -p "$OUT/3d"

node song.js

for FMT in 9:16 16:9; do
  case $FMT in 9:16) SIZE=1080x1920; TAG=9x16;; 16:9) SIZE=1920x1080; TAG=16x9;; esac
  echo "== 2D $FMT"
  rm -f "$OUT"/video*.mp4
  node engine/render.js video 3 --format "$FMT"
  mv "$OUT"/video*.mp4 "$OUT/2d_$TAG.mp4"
  echo "== 3D $FMT"
  [ -f "$OUT/3d/open_$TAG.mp4" ] || (cd "$D3" && node render.mjs --size $SIZE --range 0,8 "$OUT/3d/open_$TAG.mp4" 30)
  [ -f "$OUT/3d/final_$TAG.mp4" ] || (cd "$D3" && node render.mjs --size $SIZE --range 4,12 --query finale=1 "$OUT/3d/final_$TAG.mp4" 30)
  echo "== compose $FMT"
  ffmpeg -y -loglevel error \
    -i "$OUT/3d/open_$TAG.mp4" -i "$OUT/2d_$TAG.mp4" -i "$OUT/3d/final_$TAG.mp4" -i "$OUT/music.wav" \
    -filter_complex "[0:v]trim=0:8,setpts=PTS-STARTPTS,fps=30,format=yuv420p[a];[1:v]trim=8:82,setpts=PTS-STARTPTS,fps=30,format=yuv420p[b];[2:v]trim=0:8,setpts=PTS-STARTPTS,fps=30,format=yuv420p[c];[a][b][c]concat=n=3:v=1:a=0[v]" \
    -map "[v]" -map 3:a -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -shortest \
    "$OUT/ZONE242_Vision_$TAG.mp4"
  echo "wrote $OUT/ZONE242_Vision_$TAG.mp4"
done
