import { FPS } from "./brand";

// Tempo mesuré sur la musique fournie (librosa, ajustement linéaire des temps : 129,8 BPM).
export const BPM = 129.8;
// Point d'entrée dans la musique (s) : un temps fort estimé d'après l'énergie des basses.
export const MUSIC_OFFSET_S = 2.19;

export const BEAT = (FPS * 60) / BPM; // images par temps
export const b = (beats: number) => Math.round(beats * BEAT);

// Chaque scène : [début, fin] en temps (beats).
export const S = {
  intro: [0, 12],
  slogan: [12, 28],
  chiffres: [28, 44],
  parcours: [44, 64],
  site: [64, 96],
  venir: [96, 116],
  cta: [116, 136],
} as const;

export const TOTAL_BEATS = 136;
export const TOTAL_FRAMES = b(TOTAL_BEATS); // ≈ 62,9 s à 129,8 BPM (plafond : 70 s)
