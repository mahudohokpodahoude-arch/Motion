import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const W = 1920, H = 1080, S = 1 / 80;           // 1 unité = 80 px du lockup
const CX = 832, CY = 403;                        // centre du lockup (px)
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, d) => clamp((t - a) / d);
const eOut = (x) => 1 - Math.pow(1 - x, 3);
const eOut5 = (x) => 1 - Math.pow(1 - x, 5);
const eBack = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const eIO = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const P = (px, py) => [(px - CX) * S, -(py - CY) * S];

export async function buildWorld({ canvas }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, stencil: false, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.NoToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 200);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;

  // ---------- fond : dégradé de l'affiche ----------
  const bgMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: `varying vec2 vUv; uniform float uT;
      void main(){
        vec3 a=vec3(.933,.102,.008), b=vec3(.945,.18,.016), c=vec3(.96,.33,.10), d=vec3(.984,.478,.165);
        float g=clamp(vUv.y*.75+ (vUv.x-.5)*.35 + .08,0.,1.);
        vec3 col = g<.33? mix(a,b,g/.33) : g<.66? mix(b,c,(g-.33)/.33) : mix(c,d,(g-.66)/.34);
        float v=distance(vUv,vec2(.5,.52)); col*=1.-.38*smoothstep(.35,.95,v);
        col += .05*smoothstep(.5,0.,v);
        gl_FragColor=vec4(pow(col,vec3(2.2)),1.); }`,
    depthWrite: false,
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(260, 150), bgMat);
  bg.position.z = -60; scene.add(bg);
  // sortie en espace linéaire → OutputPass reconvertit en sRGB (pow 2.2 ci-dessus)

  // ---------- dalles anguleuses (parallaxe) ----------
  const slabs = [];
  const slabDefs = [
    // [x,y,z, w,h, rot, couleur, opacité, vitesse]
    [-14, 4, -34, 26, 9, .42, 0xff7a2a, .55, 1.0],
    [13, -6, -30, 30, 8, -.5, 0xb00d00, .45, -1.0],
    [2, 9, -42, 40, 10, .22, 0xffb070, .35, .6],
    [-6, -10, -26, 28, 7, -.28, 0xc41500, .5, -.8],
    [18, 8, -22, 14, 6, .6, 0x0260a6, .3, .9],
    [-19, -7, -20, 12, 5, -.55, 0x0260a6, .25, -.7],
  ];
  for (const [x, y, z, w, h, r, col, op, v] of slabDefs) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false }));
    m.position.set(x, y, z); m.rotation.z = r; scene.add(m); slabs.push({ m, x, y, v, op });
  }

  // ---------- lettres extrudées ----------
  const contours = await (await fetch("./src/contours.json")).json();
  const matFront = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .3, metalness: .1, envMapIntensity: 1.0 });
  const matSide = new THREE.MeshStandardMaterial({ color: 0x0a6cc0, roughness: .35, metalness: .25 });
  const letters = {};
  for (const key of ["W1", "Z", "W2"]) {
    const g = new THREE.Group(); const shapes = [];
    for (const ring of contours[key]) {
      const pts = ring.map(([x, y]) => new THREE.Vector2(...P(x, y)));
      const sh = new THREE.Shape(pts); shapes.push(sh);
    }
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1.1, bevelEnabled: true, bevelThickness: .07, bevelSize: .05, bevelSegments: 2, curveSegments: 1 });
    geo.translate(0, 0, -.55);
    const mesh = new THREE.Mesh(geo, [matFront, matSide]);
    // pivot au centre de la pièce
    const box = new THREE.Box3().setFromObject(mesh); const c = box.getCenter(new THREE.Vector3());
    mesh.position.set(-c.x, -c.y, 0); g.add(mesh); g.position.set(c.x, c.y, 0);
    scene.add(g); letters[key] = { g, c };
  }

  // ---------- mots (plans à révélation) ----------
  const loader = new THREE.TextureLoader();
  const pieces = await (await fetch("./tools/pieces.json")).json();
  const words = {};
  for (const key of ["WEEKEND", "ZONE", "WOMEN"]) {
    const tex = await loader.loadAsync(`./assets/${key}.png`); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const [x, y, w, h] = pieces[key];
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: tex }, uP: { value: 0 }, uShine: { value: -1 } },
      transparent: true, depthWrite: false,
      vertexShader: "varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: `varying vec2 vUv; uniform sampler2D map; uniform float uP, uShine;
        void main(){
          vec4 t=texture2D(map,vUv);
          float edge=vUv.x*.85+(1.-vUv.y)*.15;
          float a=smoothstep(uP*1.25-.25, uP*1.25, 1.-edge+.0) ;
          a = 1.-smoothstep(uP*1.3-.3, uP*1.3, edge);
          float sh=smoothstep(.12,0.,abs(edge-uShine))*.9;
          vec3 col=vec3(1.,.95,.9)+sh*.5;
          gl_FragColor=vec4(pow(col,vec3(2.2)), t.a*a); }`,
    });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w * S, h * S), mat);
    const [px, py] = P(x + w / 2, y + h / 2); m.position.set(px, py, .55 + .0); scene.add(m);
    words[key] = { m, mat, baseY: py, baseX: px };
  }

  // ---------- anneaux de choc ----------
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(new THREE.RingGeometry(.96, 1, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
    scene.add(m); rings.push(m);
  }
  const ringAt = [[0.5, "W1"], [1.0, "Z"], [1.5, "W2"], [2.0, null]];

  // ---------- étincelles (déterministes) ----------
  const NS = 140; const sparkGeo = new THREE.BufferGeometry();
  const seeds = []; let s = 242;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < NS; i++) seeds.push({ a: rnd() * Math.PI * 2, sp: 3 + rnd() * 9, z: (rnd() - .5) * 8, sz: 2 + rnd() * 4, t0: 2.0 + rnd() * .08 });
  const pos = new Float32Array(NS * 3); sparkGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const sparkMat = new THREE.PointsMaterial({ color: 0xffe3cf, size: .16, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const sparks = new THREE.Points(sparkGeo, sparkMat); sparks.frustumCulled = false; scene.add(sparks);

  // ---------- lumières ----------
  scene.add(new THREE.AmbientLight(0xffe8d8, .7));
  const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(-6, 9, 14); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fc4ff, .6); rim.position.set(10, -4, -6); scene.add(rim);
  const mover = new THREE.PointLight(0xfff0e0, 0, 40, 1.4); scene.add(mover);

  // ---------- post-traitement ----------
  const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), .35, .5, 1.0); composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const beats = { W1: .5, Z: 1.0, W2: 1.5 };
  const zStart = { W1: -26, Z: -30, W2: -26 };
  const rotStart = { W1: -1.4, Z: 1.2, W2: 1.4 };

  function renderAt(t) {
    t = clamp(t, 0, 5);
    // lettres : arrivée sur le temps
    for (const k of ["W1", "Z", "W2"]) {
      const { g, c } = letters[k]; const b = beats[k];
      const p = prog(t, b - .22, .5); const e = eBack(p);
      g.visible = t >= b - .22;
      g.position.set(c.x, c.y, zStart[k] * (1 - eOut5(p)));
      g.rotation.y = rotStart[k] * (1 - eOut(p));
      g.rotation.x = .5 * (1 - eOut(p));
      const sc = .55 + .45 * e; g.scale.setScalar(Math.max(.01, sc));
      // pulsation sur le coup 2.0 et 4.0
      const pulse = (t >= 2 ? Math.exp(-(t - 2) * 6) * .05 : 0) + (t >= 4 ? Math.exp(-(t - 4) * 5) * .06 : 0);
      g.scale.multiplyScalar(1 + pulse);
      // léger balancement vivant
      const tw = prog(t, 2.2, 1.3);
      g.rotation.y += Math.sin(t * 2.2 + c.x) * .06 * eIO(tw) * (1 - prog(t, 3.6, .9));
      g.position.z += Math.sin(t * 3 + c.x) * .12 * eIO(tw);
    }
    // mots
    const wStart = { WEEKEND: 2.0, ZONE: 2.5, WOMEN: 3.0 };
    for (const k of Object.keys(words)) {
      const w = words[k]; const p = prog(t, wStart[k], .55);
      w.m.visible = p > 0; w.mat.uniforms.uP.value = eOut(p);
      w.m.position.y = w.baseY - .35 * (1 - eOut(p));
      w.mat.uniforms.uShine.value = t >= 3.5 && t < 4.3 ? -.3 + (t - 3.5) / .8 * 1.6 : -1;
    }
    // anneaux
    rings.forEach((m, i) => {
      const [at, k] = ringAt[i]; const p = prog(t, at, .75);
      const c = k ? letters[k].c : new THREE.Vector3(0, 0, 0);
      m.position.set(c.x, c.y, -.4); m.visible = p > 0 && p < 1;
      m.scale.setScalar(.5 + eOut(p) * (i === 3 ? 20 : 11)); m.material.opacity = (1 - p) * (i === 3 ? .7 : .55);
    });
    // étincelles
    const tp = t - 2.0;
    for (let i = 0; i < NS; i++) {
      const q = seeds[i]; const age = Math.max(0, t - q.t0); const d = q.sp * (1 - Math.exp(-age * 2.2));
      pos[i * 3] = Math.cos(q.a) * d * 1.6 + .5 * Math.sin(age * 3 + i); pos[i * 3 + 1] = Math.sin(q.a) * d * .9 - age * .6; pos[i * 3 + 2] = q.z + 3;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkMat.opacity = tp < 0 ? 0 : Math.max(0, 1 - tp / 1.6); sparkMat.size = .14 + .05 * Math.sin(t * 20);
    // fond
    slabs.forEach(({ m, x, y, v, op }) => {
      m.position.x = x + v * (t - 2.5) * 0.9; m.position.y = y + v * .25 * Math.sin(t * .9);
      m.material.opacity = op * eOut(prog(t, 0, .8));
    });
    // lumière mobile (reflet 3.5 s) et éclats
    const sp = prog(t, 3.5, .9);
    mover.intensity = sp > 0 && sp < 1 ? 70 * Math.sin(sp * Math.PI) : 0;
    mover.position.set(-12 + sp * 24, 3 + 2 * Math.sin(sp * Math.PI), 6);
    // bloom
    bloom.strength = .22 + (t >= 2 ? .35 * Math.exp(-(t - 2) * 5) : 0) + (t >= 4 ? .25 * Math.exp(-(t - 4) * 5) : 0) + (sp > 0 && sp < 1 ? .12 * Math.sin(sp * Math.PI) : 0);
    // caméra : orbite lente puis arrêt de face, poussée finale
    const o = eIO(prog(t, 0, 4.0));
    const dist = 43 - 12.5 * o - 1.2 * prog(t, 4, 1);
    const ang = (1 - o) * -.38, el = (1 - o) * .14;
    let shake = 0; for (const b of [.5, 1.0, 1.5, 2.0, 4.0]) if (t >= b) shake += Math.exp(-(t - b) * 14) * .12 * Math.sin((t - b) * 70);
    camera.position.set(Math.sin(ang) * dist + shake, Math.sin(el) * dist + shake * .7, Math.cos(ang) * dist);
    camera.lookAt(0, -.6 * 0, 0);
    bgMat.uniforms.uT.value = t;
    composer.render();
  }
  return { renderAt };
}
