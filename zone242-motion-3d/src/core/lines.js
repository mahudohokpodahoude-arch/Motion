// Tracés lumineux épais (Line2 / LineSegments2) remplis à chaque image.
// Couleurs prémultipliées par l'opacité (mélange additif) ; brume calculée côté CPU.
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

export class SegmentBatch {
  constructor(capacity, { width = 2, name = "segments", renderOrder = 5, fog = 0.02, additive = true } = {}) {
    this.capacity = capacity;
    this.fog = fog;
    const geo = new LineSegmentsGeometry();
    this.posArr = new Float32Array(capacity * 6);
    this.colArr = new Float32Array(capacity * 6);
    const pb = new THREE.InstancedInterleavedBuffer(this.posArr, 6, 1).setUsage(THREE.DynamicDrawUsage);
    const cb = new THREE.InstancedInterleavedBuffer(this.colArr, 6, 1).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("instanceStart", new THREE.InterleavedBufferAttribute(pb, 3, 0));
    geo.setAttribute("instanceEnd", new THREE.InterleavedBufferAttribute(pb, 3, 3));
    geo.setAttribute("instanceColorStart", new THREE.InterleavedBufferAttribute(cb, 3, 0));
    geo.setAttribute("instanceColorEnd", new THREE.InterleavedBufferAttribute(cb, 3, 3));
    geo.instanceCount = 0;
    this.pb = pb;
    this.cb = cb;
    this.geometry = geo;
    this.material = new LineMaterial({
      linewidth: width,
      worldUnits: false,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    this.material.opacity = 0;
    void additive;
    this.material.resolution.set(1920, 1080);
    this.object = new LineSegments2(geo, this.material);
    this.object.name = name;
    this.object.frustumCulled = false;
    this.object.renderOrder = renderOrder;
    this.n = 0;
    this.cam = new THREE.Vector3();
    this.near0 = 1.2;
    this.near1 = 7;
    this.over = 0;
    this.bg = [1, 1, 1];
  }
  // over : 0 = lumière additive (fond sombre), 1 = encre opaque fondue dans le fond clair `bg`
  begin(camera, colors) {
    this.n = 0;
    this.cam.copy(camera.position);
    if (colors) {
      this.over = colors.over;
      this.bg[0] = colors.fog.r; this.bg[1] = colors.fog.g; this.bg[2] = colors.fog.b;
    }
    this.material.opacity = this.over;
  }
  // segment a→b, couleur (r,g,b) × alpha ; alphaB optionnel pour un dégradé le long du segment
  add(ax, ay, az, bx, by, bz, r, g, b, alpha, alphaB = alpha) {
    if (this.n >= this.capacity || (alpha <= 0.0005 && alphaB <= 0.0005)) return;
    const c = this.cam;
    const da = Math.hypot(ax - c.x, ay - c.y, az - c.z), db = Math.hypot(bx - c.x, by - c.y, bz - c.z);
    const near = (d) => (d < this.near1 ? Math.max(0, (d - this.near0) / (this.near1 - this.near0)) : 1);
    const fa = (this.fog > 0 ? Math.exp(-Math.pow(this.fog * da, 2)) : 1) * near(da);
    const fb = (this.fog > 0 ? Math.exp(-Math.pow(this.fog * db, 2)) : 1) * near(db);
    const k = this.n * 6;
    const P = this.posArr, C = this.colArr;
    P[k] = ax; P[k + 1] = ay; P[k + 2] = az; P[k + 3] = bx; P[k + 4] = by; P[k + 5] = bz;
    const a1 = alpha * fa, a2 = alphaB * fb;
    const o = this.over, bg = this.bg;
    if (o <= 0) {
      C[k] = r * a1; C[k + 1] = g * a1; C[k + 2] = b * a1;
      C[k + 3] = r * a2; C[k + 4] = g * a2; C[k + 5] = b * a2;
    } else {
      const m1 = Math.min(a1, 1), m2 = Math.min(a2, 1);
      C[k] = r * a1 * (1 - o) + (bg[0] + (r - bg[0]) * m1) * o;
      C[k + 1] = g * a1 * (1 - o) + (bg[1] + (g - bg[1]) * m1) * o;
      C[k + 2] = b * a1 * (1 - o) + (bg[2] + (b - bg[2]) * m1) * o;
      C[k + 3] = r * a2 * (1 - o) + (bg[0] + (r - bg[0]) * m2) * o;
      C[k + 4] = g * a2 * (1 - o) + (bg[1] + (g - bg[1]) * m2) * o;
      C[k + 5] = b * a2 * (1 - o) + (bg[2] + (b - bg[2]) * m2) * o;
    }
    this.n++;
  }
  // polyligne [x,y,z,...] tracée jusqu'à la fraction `progress` de sa longueur
  addPolyline(pts, progress, r, g, b, alpha, closed = false) {
    if (progress <= 0 || alpha <= 0) return;
    const n = pts.length / 3;
    const segs = closed ? n : n - 1;
    let total = 0;
    const L = [];
    for (let i = 0; i < segs; i++) {
      const j = (i + 1) % n;
      const l = Math.hypot(pts[j * 3] - pts[i * 3], pts[j * 3 + 1] - pts[i * 3 + 1], pts[j * 3 + 2] - pts[i * 3 + 2]);
      L.push(l);
      total += l;
    }
    let remain = total * Math.min(progress, 1);
    for (let i = 0; i < segs && remain > 0; i++) {
      const j = (i + 1) % n;
      const u = Math.min(1, remain / (L[i] || 1e-6));
      const ax = pts[i * 3], ay = pts[i * 3 + 1], az = pts[i * 3 + 2];
      this.add(ax, ay, az, ax + (pts[j * 3] - ax) * u, ay + (pts[j * 3 + 1] - ay) * u, az + (pts[j * 3 + 2] - az) * u, r, g, b, alpha);
      remain -= L[i];
    }
  }
  end() {
    this.geometry.instanceCount = this.n;
    this.pb.needsUpdate = true;
    this.cb.needsUpdate = true;
    this.object.visible = this.n > 0;
  }
}
