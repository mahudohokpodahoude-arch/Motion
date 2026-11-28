// Le plan-séquence : toute la caméra du film, scène après scène, dans un seul fichier.
// Arrivées en out4, repositionnements en inOut2/inOut3, jamais de rebond.
import { CameraRig } from "./core/camera.js";

export function buildShots() {
  // 01 — plan d'ensemble extérieur (l'échelle du couloir), entrée dans l'axe, traversée, décélération jusqu'au logo
  const rig = new CameraRig({ pos: [11.5, 13.5, 138], look: [0, 4.6, 52], fov: 32, roll: -3.0 });
  rig.move(0, 5.8, { pos: [0, 5.0, 15.6], look: [0, 5.0, 0], fov: 30, roll: 0 }, {
    ease: "inOut2",
    c1: [9.5, 11.0, 112],
    c2: [0.0, 5.3, 62],
    lookEase: "inOut3",
  });
  // respiration du logo : très lente poussée
  rig.move(5.8, 7.8, { pos: [0, 5.0, 13.6] }, { ease: "out2" });
  // bascule : la caméra s'élève pendant que le symbole se couche
  rig.move(7.8, 10.2, { pos: [5.5, 17.5, 25], look: [0, 0.8, 0], fov: 34 }, {
    ease: "inOut3",
    c1: [0.4, 8.0, 18.0],
    c2: [3.6, 15.5, 25.5],
    lookEase: "inOut2",
  });
  rig.breathe(5.6, 8.0, 0.025);
  return rig;
}
