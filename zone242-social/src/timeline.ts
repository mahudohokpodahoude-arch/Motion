import { FPS } from "./brand";

// Tempo mesuré sur la musique fournie (librosa, ajustement linéaire des temps : 129,8 BPM).
export const BPM = 129.8;
// Point d'entrée dans la musique (s) : un temps fort estimé d'après l'énergie des basses.
export const MUSIC_OFFSET_S = 2.19;

export const BEAT = (FPS * 60) / BPM; // images par temps
export const b = (beats: number) => Math.round(beats * BEAT);

export const TOTAL_BEATS = 136;
export const TOTAL_FRAMES = b(TOTAL_BEATS); // ≈ 62,9 s à 129,8 BPM (plafond : 70 s)

// Ouverture courte (saisie de l'adresse), puis le « monde 3D » autour du téléphone.
export const INTRO_BEATS = 6;
export const WORLD_START = INTRO_BEATS;
export const WORLD_BEATS = TOTAL_BEATS - INTRO_BEATS;

// Plans (coupes sur le temps) : [début, fin] en beats depuis le début du monde 3D.
// Chaque plan a sa propre pose de caméra et son propre extrait de l'enregistrement.
export const SHOTS = {
  slogan: [0, 10],
  verset: [10, 18],
  chiffres: [18, 28],
  etapes: [28, 38],
  piliers: [38, 48],
  vision: [48, 58],
  eglises: [58, 68],
  equipe: [68, 80],
  ressources: [80, 92],
  venir: [92, 104],
  tour: [104, 116],
} as const;

export const CTA_START = 116; // beats depuis le début du monde
