// SCÈNE 01 — L'ÉVEIL D'UNE VISION (00:00–00:08)
// Un couloir monumental de viseurs (les équerres du logo à l'échelle d'une architecture) se dessine ;
// la caméra le traverse ; la lumière s'ouvre et révèle le logo en relief, qui respire.
import * as THREE from "three";
import { SegmentBatch } from "../core/lines.js";
import { seg, ease as E, envelope, smooth } from "../core/util.js";
import { PX, SYMBOL } from "../core/logo.js";

export const LOGO_Y = 6.234; // origine du logo (centre du carré orange) : centre visuel du logo à y = 5

export function setupS1(ctx) {
  const { scene, pal } = ctx;
  const group = new THREE.Group();
  group.name = "s1";
  scene.add(group);

  // ---- couloir : 11 portiques-viseurs, du plus proche (z = 89) au plus lointain (z = 14)
  const FRAMES = 11, H = 7.6, ARM = 3.6, W = 0.46, CY = 5;
  const frames = [];
  for (let k = 0; k < FRAMES; k++) frames.push({ z: 89 - k * 7.5, t: 0.35 + k * 0.15 });
  const barGeo = new THREE.BoxGeometry(1, 1, 1);
  barGeo.translate(0.5, 0, 0); // pivot à l'extrémité : la barre « pousse » depuis l'angle
  // volumes satinés clairs (comme les viseurs blancs des films précédents), modelés par la lumière
  const barMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#c9c2ec"),
    metalness: 0.25,
    roughness: 0.42,
    envMapIntensity: 0.9,
  });
  const bars = new THREE.InstancedMesh(barGeo, barMat, FRAMES * 8);
  bars.frustumCulled = false;
  group.add(bars);
  const arms = [];
  for (const f of frames) {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const cx = sx * H, cy = CY + sy * H;
      arms.push({ f, c: [cx, cy, f.z], d: [-sx, 0, 0], sx, sy, ang: sx > 0 ? Math.PI : 0 });
      arms.push({ f, c: [cx, cy, f.z], d: [0, -sy, 0], sx, sy, ang: sy > 0 ? -Math.PI / 2 : Math.PI / 2 });
    }
  }
  const glow = new SegmentBatch(400, { width: 3.2, name: "s1-glow", fog: 0.011 });
  const fine = new SegmentBatch(700, { width: 1.3, name: "s1-fine", fog: 0.013 });
  group.add(glow.object, fine.object);

  // ---- la lumière qui s'ouvre derrière le logo (fente → halo maîtrisé)
  const portalMat = new THREE.ShaderMaterial({
    uniforms: { uOpen: { value: 0 }, uGain: { value: 0 }, uTint: { value: new THREE.Color(pal.c.light) } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uOpen, uGain; uniform vec3 uTint; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(56.0, 34.0);
        float w = mix(0.08, 2.7, uOpen);
        float slit = exp(-pow(p.x / w, 2.0)) * exp(-pow(p.y / mix(6.0, 3.7, uOpen), 2.0));
        float wide = exp(-dot(p, p) / 42.0) * uOpen;
        vec3 col = uTint * (slit * 1.3 + wide * 0.28) * uGain;
        gl_FragColor = vec4(col, 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(56, 34), portalMat);
  portal.position.set(0, CY, -7.5);
  portal.renderOrder = 1;
  group.add(portal);

  // ---- logo en relief
  const logo = ctx.logo.group;
  logo.position.set(0, LOGO_Y, 0);
  scene.add(logo);
  const fronts = new Set(), sides = new Set();
  logo.traverse((o) => { if (o.isMesh) { fronts.add(o.material[0]); sides.add(o.material[1]); } });
  const official = new Map();
  for (const m of fronts) official.set(m, m.color.clone());
  const wordmark = logo.children.filter((m) => ["zone", "digits", "frame242"].includes(m.userData.kind));

  // reflet qui balaie le logo, masqué exactement par le PNG officiel
  const sheenMat = new THREE.ShaderMaterial({
    uniforms: { uMask: { value: ctx.logoTexture }, uPos: { value: -1 }, uGain: { value: 0 } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMask; uniform float uPos, uGain; varying vec2 vUv;
      void main(){
        float a = texture2D(uMask, vUv).a;
        float d = (vUv.x * 1.0 + (1.0 - vUv.y) * 0.55) - uPos;
        float band = exp(-d * d / 0.0012);
        gl_FragColor = vec4(vec3(1.0, 0.97, 1.0) * band * a * uGain, 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const sheen = new THREE.Mesh(new THREE.PlaneGeometry(2880 * PX, 1680 * PX), sheenMat);
  sheen.position.set((1440 - SYMBOL.cx) * PX, -(840 - SYMBOL.cy) * PX, 0.03);
  sheen.renderOrder = 20;
  logo.add(sheen);

  // lumière chaude de la révélation
  const warm = new THREE.PointLight(pal.c.orange, 0, 40, 1.6);
  warm.position.set(0, LOGO_Y, 3);
  scene.add(warm);

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s3 = new THREE.Vector3(), p3 = new THREE.Vector3();
  const zAxis = new THREE.Vector3(0, 0, 1);

  return {
    group,
    logo,
    bloom(t) {
      // pendant la révélation, seul le plus intense rayonne : le logo reste lisible
      const k = envelope(t, 4.4, 9.4, 0.8, 1.2);
      return { strength: 0.55 - 0.2 * k, threshold: 0.92 + 0.6 * k };
    },
    update(t, camera, colors) {
      const live = t < 10.6;
      group.visible = live;
      if (live) {
        glow.begin(camera, colors);
        fine.begin(camera, colors);
        const L = pal.light, Lt = [0.62, 0.58, 1.0];
        const fadeOut = 1 - smooth(seg(t, 7.2, 9.2));
        arms.forEach((a, i) => {
          const p = E.out3(seg(t, a.f.t, a.f.t + 0.9));
          const pb = E.out3(seg(t, a.f.t + 0.16, a.f.t + 1.2));
          const [cx, cy, cz] = a.c;
          const len = ARM * p;
          // arête lumineuse intérieure (face avant) + filet fin à l'arrière
          const ix = a.d[0] === 0 ? -a.sx * W * 0.5 : 0;
          const iy = a.d[1] === 0 ? -a.sy * W * 0.5 : 0;
          glow.add(cx + ix, cy + iy, cz + W * 0.52, cx + ix + a.d[0] * len, cy + iy + a.d[1] * len, cz + W * 0.52, L[0], L[1], L[2], 2.7 * fadeOut, 1.2 * fadeOut);
          fine.add(cx - ix, cy - iy, cz - W * 0.52, cx - ix + a.d[0] * len, cy - iy + a.d[1] * len, cz - W * 0.52, Lt[0], Lt[1], Lt[2], 0.55 * fadeOut);
          // volume métallique qui suit le tracé
          const blen = ARM * pb;
          q.setFromAxisAngle(zAxis, a.ang);
          if (pb > 0.001) s3.set(blen + W * 0.5, W, W);
          else s3.set(0.0001, 0.0001, 0.0001);
          p3.set(cx + a.d[0] * -W * 0.25, cy + a.d[1] * -W * 0.25, cz);
          m4.compose(p3, q, s3);
          bars.setMatrixAt(i, m4);
        });
        bars.instanceMatrix.needsUpdate = true;
        barMat.transparent = fadeOut < 0.999;
        barMat.opacity = fadeOut;
        bars.visible = fadeOut > 0.01;
        // cadre complet très fin de chaque portique (rythme architectural)
        for (const f of frames) {
          const p = E.inOut2(seg(t, f.t + 0.5, f.t + 1.6)) * fadeOut;
          if (p <= 0) continue;
          const h = H + 0.9, z = f.z - 0.35;
          const sq = [-h, CY - h, z, h, CY - h, z, h, CY + h, z, -h, CY + h, z];
          fine.addPolyline(sq, p, Lt[0], Lt[1], Lt[2], 0.22, true);
        }
        // rails longitudinaux + trame de sol
        const rail = E.inOut2(seg(t, 0.8, 3.4)) * fadeOut;
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
          const x = sx * (H + 0.9), y = CY + sy * (H + 0.9);
          fine.add(x, y, 96, x, y, 96 - 86 * rail, Lt[0], Lt[1], Lt[2], 0.6 * fadeOut, 0.2 * fadeOut);
        }
        const floor = E.out2(seg(t, 1.2, 4.0)) * fadeOut;
        for (let gx = -16; gx <= 16; gx += 2) fine.add(gx, -3.6, 98, gx, -3.6, 98 - 104 * floor, L[0], L[1], L[2], 0.42, 0.06);
        for (const f of frames) {
          const w = 17 * E.out3(seg(t, f.t + 0.25, f.t + 1.1));
          fine.add(-w, -3.6, f.z, w, -3.6, f.z, L[0], L[1], L[2], 0.45 * fadeOut);
        }
        glow.end();
        fine.end();
      }

      // --- la lumière s'ouvre (4,7 → 6,0), tient, puis se retire pendant la bascule
      const open = E.inOut3(seg(t, 4.7, 6.05));
      const gain = open * (1 - E.inOut2(seg(t, 7.4, 8.9)));
      portalMat.uniforms.uOpen.value = open;
      const distant = E.inOut2(seg(t, 0.6, 2.4)) * 0.55 * (1 - open);
      portalMat.uniforms.uGain.value = gain + distant;
      portal.visible = live && gain + distant > 0.002;

      // --- le logo : silhouette, puis couleurs officielles exactes
      const bright = E.inOut2(seg(t, 4.95, 6.0));
      const born = smooth(seg(t, 4.55, 5.05));
      for (const [m, c] of official) { m.color.copy(c).multiplyScalar(Math.max(bright, 0.03)); m.opacity = born; }
      for (const m of sides) { m.emissiveIntensity = 0.03 + 0.12 * bright; m.opacity = born; }
      logo.visible = born > 0.001;
      warm.intensity = 55 * envelope(t, 5.6, 9.8, 0.5, 1.8);
      sheenMat.uniforms.uPos.value = -0.35 + 2.0 * E.inOut2(seg(t, 6.35, 7.55));
      sheenMat.uniforms.uGain.value = 0.85 * envelope(t, 6.3, 7.6, 0.2, 0.2);
      sheen.visible = t > 6.3 && t < 7.6;

      // --- respiration, puis bascule : le symbole se couche et devient le plan des fondations
      const breathe = 1 + 0.014 * smooth(seg(t, 6.0, 7.8));
      const tilt = E.inOut3(seg(t, 7.8, 9.9));
      logo.position.set(0, LOGO_Y * (1 - tilt), 0);
      logo.rotation.set((-Math.PI / 2) * tilt, 0, 0);
      logo.scale.setScalar(breathe * (1 + 7 * tilt));
      // le mot-symbole se dissout (l'essaim naît de ses lettres)
      const wm = 1 - smooth(seg(t, 7.65, 8.2));
      for (const m of wordmark) {
        m.visible = wm > 0.002;
        m.material[0].opacity = wm * born;
        m.material[1].opacity = wm * born;
      }
    },
  };
}
