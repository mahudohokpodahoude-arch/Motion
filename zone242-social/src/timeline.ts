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

// Vitesse de lecture de l'enregistrement d'écran (s d'enregistrement par s de vidéo)
// et dernier instant montré (avant la section don, que l'on n'affiche pas).
export const REC_RATE = 1.6;
export const REC_LAST_S = 86.5;

// Panneaux 3D autour du téléphone : [début, fin] en temps (beats) depuis le début du monde.
// Calés sur ce que l'enregistrement montre au même moment (vitesse × 1,6).
export const PANELS = {
  slogan: [1, 8],
  verset: [9, 16],
  chiffres: [17, 25],
  etapes: [30, 40],
  piliers: [41, 52],
  vision: [53, 64],
  eglises: [65, 76],
  equipe: [77, 89],
  ressources: [95, 106],
  venir: [107, 115],
} as const;

export const CTA_START = 116; // beats depuis le début du monde
