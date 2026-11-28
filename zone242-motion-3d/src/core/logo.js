// Logo officiel ZONE 242 en relief : extrusion des tracés vectoriels du logo (fidélité mesurée : IoU 0,998 bleu, 1,000 orange).
// Faces avant en couleurs officielles exactes (non éclairées, sans tonemapping) ; flancs éclairés pour la profondeur.
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

// Repères dans l'espace du fichier officiel (2880 × 1680 px)
export const LOGO_BOX = { x0: 970, y0: 360, x1: 1910, y1: 1320 }; // emprise utile
export const SYMBOL = { cx: 1440, cy: 558, half: 198 }; // viseur : centre du carré orange, demi-côté extérieur
export const PX = 1 / 960 * 4.2; // échelle : le logo mesure 4,2 m de haut

async function loadShapes(url) {
  const txt = await (await fetch(url)).text();
  const data = new SVGLoader().parse(txt);
  const shapes = [];
  for (const p of data.paths) shapes.push(...SVGLoader.createShapes(p));
  return shapes;
}

// Sépare les formes en : équerres du viseur (4), carré central, mot « ZONE », cadre « 242 » et chiffres.
function classify(shape, color) {
  const pts = shape.getPoints(8);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  if (color === "orange") return cy < 700 ? "core" : "frame242";
  if (cy < 800) return "bracket";
  return cx < 1430 ? "zone" : "digits";
}

export async function buildLogo({ blue, orange }, base = "assets/logo/") {
  const [blueShapes, orangeShapes] = await Promise.all([loadShapes(base + "zone_blue.svg"), loadShapes(base + "zone_orange.svg")]);
  const group = new THREE.Group();
  group.name = "logo3d";
  const parts = { bracket: [], core: [], zone: [], frame242: [], digits: [] };
  const depth = 26; // px d'extrusion
  const mk = (shapes, color, kind) => {
    const front = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), toneMapped: false, transparent: true });
    const side = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color).multiplyScalar(0.55),
      roughness: 0.38,
      metalness: 0.35,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.12,
      transparent: true,
    });
    for (const s of shapes) {
      const k = classify(s, kind);
      const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.2, bevelSegments: 1, curveSegments: 10 });
      // repère : Y vers le haut, origine au centre du carré orange, face avant vers +Z
      geo.translate(-SYMBOL.cx, -SYMBOL.cy, -depth);
      geo.scale(PX, -PX, PX);
      geo.computeVertexNormals();
      // l'inversion d'axe Y retourne les faces : on remet l'ordre des triangles à l'endroit
      const idx = geo.index;
      if (idx) for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i + 1); idx.setX(i + 1, idx.getX(i + 2)); idx.setX(i + 2, a); }
      else {
        const pos = geo.attributes.position, nrm = geo.attributes.normal, uv = geo.attributes.uv;
        for (let i = 0; i < pos.count; i += 3) {
          for (const att of [pos, nrm]) { const t = [att.getX(i + 1), att.getY(i + 1), att.getZ(i + 1)]; att.setXYZ(i + 1, att.getX(i + 2), att.getY(i + 2), att.getZ(i + 2)); att.setXYZ(i + 2, t[0], t[1], t[2]); }
          if (uv) { const u0 = uv.getX(i + 1), v0 = uv.getY(i + 1); uv.setXY(i + 1, uv.getX(i + 2), uv.getY(i + 2)); uv.setXY(i + 2, u0, v0); }
        }
      }
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, [front, side]);
      mesh.userData.kind = k;
      mesh.userData.shape = s;
      geo.computeBoundingBox();
      mesh.userData.center = geo.boundingBox.getCenter(new THREE.Vector3());
      parts[k].push(mesh);
      group.add(mesh);
    }
  };
  mk(blueShapes, blue, "blue");
  mk(orangeShapes, orange, "orange");
  return { group, parts };
}

// Échantillonne des points à la surface des lettres (pour la dissolution du mot-symbole en poussière).
export async function sampleWordmark(n, rand, base = "assets/logo/") {
  const shapes = [...(await loadShapes(base + "zone_blue.svg")), ...(await loadShapes(base + "zone_orange.svg"))];
  const tris = [];
  let area = 0;
  for (const s of shapes) {
    const k = classify(s, "blue");
    const pts = s.getPoints(6);
    let cy = 0;
    for (const p of pts) cy += p.y;
    cy /= pts.length;
    if (cy < 800) continue; // uniquement « ZONE » et « 242 »
    const holes = s.holes.map((h) => h.getPoints(6));
    const faces = THREE.ShapeUtils.triangulateShape(pts, holes);
    const all = pts.concat(...holes);
    for (const f of faces) {
      const a = all[f[0]], b = all[f[1]], c = all[f[2]];
      const ar = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
      area += ar;
      tris.push([a, b, c, area]);
    }
    void k;
  }
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = rand() * area;
    let lo = 0, hi = tris.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (tris[m][3] < r) lo = m + 1; else hi = m; }
    const [a, b, c] = tris[lo];
    let u = rand(), v = rand();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const x = a.x + (b.x - a.x) * u + (c.x - a.x) * v;
    const y = a.y + (b.y - a.y) * u + (c.y - a.y) * v;
    out[i * 3] = (x - SYMBOL.cx) * PX;
    out[i * 3 + 1] = -(y - SYMBOL.cy) * PX;
    out[i * 3 + 2] = (rand() - 0.5) * 26 * PX;
  }
  return out;
}
