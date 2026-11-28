// Le monde 3D du film : construit une fois, puis rendu image par image en fonction du temps HyperFrames.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createRenderer } from "./core/render.js";
import { applyPose } from "./core/camera.js";
import { Labels } from "./core/labels.js";
import { buildLogo } from "./core/logo.js";
import { envelope, seg, smooth } from "./core/util.js";
import { createDust } from "./systems/dust.js";
import { createSwarm } from "./systems/swarm.js";
import { buildShots } from "./shots.js";
import { colorsAt } from "./colors.js";
import { createBackdrop } from "./core/backdrop.js";
import { setupS1 } from "./scenes/s1-eveil.js";

const lin = (hex) => {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
};

export async function buildWorld({ canvas, labelLayer, vars }) {
  const pal = {
    c: {
      blue: vars.color_blue || "#1900CF",
      orange: vars.color_orange || "#FF5A36",
      night: vars.color_night || "#04031A",
      light: vars.color_light || "#F2F0FF",
      blueGlow: vars.color_blue_glow || "#4B3BFF",
      chaux: vars.color_chaux || "#F7F6FB",
      structure: "#0C0938",
      fog: "#0A0730",
    },
  };
  pal.light = lin(pal.c.light);
  pal.blueGlow = lin(pal.c.blueGlow);
  pal.orange = lin(pal.c.orange);
  pal.blue = lin(pal.c.blue);

  const R = createRenderer(canvas, { width: 1920, height: 1080, msaa: 4 });
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color(pal.c.fog), 0.011);
  const backdrop = createBackdrop();
  scene.add(backdrop.mesh);
  const srgb = new THREE.Color();
  const camera = new THREE.PerspectiveCamera(33, 1920 / 1080, 0.05, 900);
  // environnement de studio (reflets des volumes métalliques), teinté bleu nuit par les matières
  const pmrem = new THREE.PMREMGenerator(R.renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  // éclairage d'ensemble : clé froide, contre-jour bleu, remplissage hémisphérique
  scene.add(new THREE.HemisphereLight(0x3a32a8, 0x05031a, 0.9));
  const key = new THREE.DirectionalLight(0xd9d4ff, 1.25);
  key.position.set(8, 20, 14);
  scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color(pal.c.blueGlow), 2.4);
  rim.position.set(-10, 6, -20);
  scene.add(rim);

  const labels = new Labels(labelLayer);
  const logo = await buildLogo({ blue: pal.c.blue, orange: pal.c.orange });
  const logoTexture = await new THREE.TextureLoader().loadAsync("assets/logo/zone242_logo.png");
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  const ctx = { THREE, scene, camera, pal, labels, logo, logoTexture, vars };
  const rig = buildShots();
  const dust = createDust(ctx);
  const swarm = createSwarm(ctx);
  ctx.swarm = swarm;
  const scenes = [setupS1(ctx)];

  const look = { focus: 30, aperture: 0 };
  function renderAt(t) {
    const frame = Math.round(t * 30);
    const pose = applyPose(camera, rig, t);
    // mise au point : distance au point visé
    look.focus = camera.position.distanceTo(pose.look);
    look.aperture = 7;
    const colors = colorsAt(t);
    ctx.colors = colors;
    backdrop.set(colors);
    scene.fog.color.copy(colors.fog);
    srgb.copy(colors.edge).getRGB(srgb, THREE.SRGBColorSpace);
    R.grade.uniforms.uVigColor.value.set(srgb.r, srgb.g, srgb.b);
    for (const s of scenes) s.update(t, camera, colors);
    dust.update(t, camera, look, colors);
    swarm.update(t, camera, look, colors);
    labels.update(t, camera);
    // post : ouverture au noir, éclat final
    R.grade.uniforms.uFade.value = 0.45 + 0.55 * smooth(seg(t, 0.0, 0.9));
    R.grade.uniforms.uFlash.value = envelope(t, 86.6, 90.5, 0.5, 0.01);
    let bloom = { strength: 0.55, threshold: 0.92 };
    for (const s of scenes) if (s.bloom) { const b = s.bloom(t); if (b) bloom = b; }
    R.bloom.strength = bloom.strength;
    R.bloom.threshold = bloom.threshold;
    R.render(scene, camera, frame);
  }
  return { renderAt, scene, camera, ctx };
}
