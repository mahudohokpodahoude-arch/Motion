// Nuages de points lumineux : sprites ronds additifs, scintillement, bokeh simulé (flou de profondeur), brume.
import * as THREE from "three";

const vert = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  attribute float aSeed;
  uniform float uTime, uFocus, uAperture, uScale, uFog, uTwinkle, uMinPx, uMaxPx, uGain;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSharp;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = max(-mv.z, 0.001);
    float px = max(aSize * uScale / d, uMinPx);
    float coc = abs(d - uFocus) / d * uAperture;
    float total = min(px + coc, uMaxPx);
    float energy = (px * px) / (total * total);
    float tw = 1.0 - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(uTime * (0.9 + aSeed * 1.7) + aSeed * 43.0));
    float fog = exp(-uFog * uFog * d * d);
    vAlpha = aAlpha * tw * fog * max(energy, 0.05) * uGain * smoothstep(0.6, 3.0, d);
    vSharp = clamp(px / total, 0.0, 1.0);
    vColor = aColor;
    gl_PointSize = total;
    gl_Position = projectionMatrix * mv;
    if (aAlpha <= 0.0001 || mv.z > -0.05) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform float uOver;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSharp;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p) * 2.0;
    if (r > 1.0) discard;
    float core = exp(-r * r * 5.5);
    float disc = smoothstep(1.0, 0.82, r) * (0.5 + 0.5 * smoothstep(0.35, 0.95, r));
    float a = mix(disc * 0.85, core, vSharp);
    float k = clamp(a * vAlpha, 0.0, 1.0);
    gl_FragColor = vec4(vColor * a * vAlpha, k * uOver);
  }
`;

export class PointCloud {
  constructor(capacity, { name = "points", renderOrder = 10 } = {}) {
    this.capacity = capacity;
    this.count = capacity;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(capacity * 3);
    this.col = new Float32Array(capacity * 3).fill(1);
    this.size = new Float32Array(capacity).fill(0.05);
    this.alpha = new Float32Array(capacity);
    this.seed = new Float32Array(capacity);
    for (let i = 0; i < capacity; i++) this.seed[i] = ((i * 0.6180339887) % 1 + (i % 7) * 0.013) % 1;
    const dyn = (arr, n) => new THREE.BufferAttribute(arr, n).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("position", dyn(this.pos, 3));
    g.setAttribute("aColor", dyn(this.col, 3));
    g.setAttribute("aSize", dyn(this.size, 1));
    g.setAttribute("aAlpha", dyn(this.alpha, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(this.seed, 1));
    this.geometry = g;
    this.material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTime: { value: 0 },
        uFocus: { value: 20 },
        uAperture: { value: 0 },
        uScale: { value: 1080 / (2 * Math.tan((38 * Math.PI) / 360)) },
        uFog: { value: 0.02 },
        uTwinkle: { value: 0.25 },
        uMinPx: { value: 1.6 },
        uMaxPx: { value: 160 },
        uGain: { value: 1 },
        uOver: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    this.object = new THREE.Points(g, this.material);
    this.object.name = name;
    this.object.frustumCulled = false;
    this.object.renderOrder = renderOrder;
  }
  set(i, x, y, z, size, alpha, r = 1, g = 1, b = 1) {
    const k = i * 3;
    this.pos[k] = x; this.pos[k + 1] = y; this.pos[k + 2] = z;
    this.col[k] = r; this.col[k + 1] = g; this.col[k + 2] = b;
    this.size[i] = size;
    this.alpha[i] = alpha;
  }
  // à appeler une fois par image après les écritures
  commit(camera, t, { focus, aperture, over } = {}) {
    const a = this.geometry.attributes;
    a.position.needsUpdate = true;
    a.aColor.needsUpdate = true;
    a.aSize.needsUpdate = true;
    a.aAlpha.needsUpdate = true;
    this.geometry.setDrawRange(0, this.count);
    const u = this.material.uniforms;
    u.uTime.value = t;
    u.uScale.value = 1080 / (2 * Math.tan((camera.fov * Math.PI) / 360));
    if (focus != null) u.uFocus.value = focus;
    if (aperture != null) u.uAperture.value = aperture;
    if (over != null) u.uOver.value = over;
  }
}
