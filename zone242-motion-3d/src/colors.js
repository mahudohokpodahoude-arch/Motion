// Script couleur du film (fidèle aux films ZONE 242 précédents) : indigo, bleu ZONE vif, lavande claire.
// Jamais de noir. `over` = 0 sur fond sombre (lumière additive), 1 sur fond clair (encre bleue).
import * as THREE from "three";
import { clamp, smooth } from "./core/util.js";

export const PALETTES = {
  indigo: { center: "#1E1772", edge: "#0B0733", fog: "#120D4E", over: 0, dust: "#F2F0FF", ink: "#F2F0FF" },
  blue: { center: "#2A17CC", edge: "#1100A0", fog: "#1C0BB4", over: 0, dust: "#F2F0FF", ink: "#F2F0FF" },
  light: { center: "#F4F2F6", edge: "#DAD5E3", fog: "#E9E6EF", over: 1, dust: "#8C82D8", ink: "#1900CF" },
};

// [début de transition, fin de transition, palette d'arrivée]
export const COLOR_SCRIPT = [
  [0, 0, "indigo"], // 01 éveil
  [7.9, 9.4, "blue"], // 02 fondations
  [17.3, 18.6, "indigo"], // 03 connecter
  [30.05, 30.75, "light"], // 04 transformer (plongée dans la lumière)
  [42.6, 43.9, "blue"], // 05 envoyer
  [54.6, 55.8, "light"], // 06 église vivante
  [65.8, 66.9, "indigo"], // 07 église augmentée
  [76.6, 77.8, "blue"], // 08 cap des 36 mois
  [86.75, 87.25, "light"], // 09 signature
];

const cache = {};
const col = (hex) => (cache[hex] ||= new THREE.Color(hex));
const tmp = { center: new THREE.Color(), edge: new THREE.Color(), fog: new THREE.Color(), dust: new THREE.Color(), ink: new THREE.Color(), over: 0 };

export function colorsAt(t) {
  let prev = PALETTES[COLOR_SCRIPT[0][2]], next = prev, u = 1;
  for (let i = 1; i < COLOR_SCRIPT.length; i++) {
    const [a, b, name] = COLOR_SCRIPT[i];
    if (t >= a) {
      prev = PALETTES[COLOR_SCRIPT[i - 1][2]];
      next = PALETTES[name];
      u = smooth(clamp((t - a) / Math.max(b - a, 1e-3)));
    }
  }
  for (const k of ["center", "edge", "fog", "dust", "ink"]) tmp[k].copy(col(prev[k])).lerp(col(next[k]), u);
  tmp.over = prev.over + (next.over - prev.over) * u;
  return tmp;
}
