import { FPS } from "./brand";

// Tempo provisoire : à remplacer par le tempo réel de la musique.
export const BPM = 120;
// Décalage (en secondes) du premier temps fort dans la musique.
export const MUSIC_OFFSET_S = 0;

export const BEAT = (FPS * 60) / BPM; // images par temps
export const b = (beats: number) => Math.round(beats * BEAT);

// Chaque scène : [début, fin] en temps (beats).
export const S = {
  intro: [0, 12],
  slogan: [12, 32],
  chiffres: [32, 48],
  parcours: [48, 68],
  site: [68, 100],
  venir: [100, 120],
  cta: [120, 136],
} as const;

export const TOTAL_BEATS = 136;
export const TOTAL_FRAMES = b(TOTAL_BEATS); // 68 s à 120 BPM (plafond : 70 s)
