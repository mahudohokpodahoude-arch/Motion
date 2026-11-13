// Copie dans vendor/ et assets/fonts/ les fichiers tiers dont le film a besoin
// (le réseau de rendu ne peut pas joindre les CDN : tout doit être local).
// Usage : npm install && node tools/vendor.mjs
import { copyFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const nm = join(root, "node_modules");
const copy = (src, dst) => { mkdirSync(dirname(dst), { recursive: true }); copyFileSync(src, dst); };

// three.js : build + addons utilisés (dépendances relatives suivies automatiquement)
const threeRoot = join(nm, "three");
copy(join(threeRoot, "build/three.module.js"), join(root, "vendor/three/build/three.module.js"));
copy(join(threeRoot, "build/three.core.js"), join(root, "vendor/three/build/three.core.js"));
copy(join(threeRoot, "LICENSE"), join(root, "vendor/three/LICENSE"));
const addons = [
  "postprocessing/EffectComposer.js", "postprocessing/RenderPass.js", "postprocessing/UnrealBloomPass.js",
  "postprocessing/ShaderPass.js", "postprocessing/OutputPass.js", "postprocessing/BokehPass.js",
  "loaders/SVGLoader.js", "lines/Line2.js", "lines/LineMaterial.js", "lines/LineGeometry.js",
  "lines/LineSegments2.js", "lines/LineSegmentsGeometry.js", "utils/BufferGeometryUtils.js",
  "geometries/RoundedBoxGeometry.js", "environments/RoomEnvironment.js",
];
const jsm = join(threeRoot, "examples/jsm");
const seen = new Set();
const visit = (rel) => {
  if (seen.has(rel)) return; seen.add(rel);
  const src = join(jsm, rel);
  copy(src, join(root, "vendor/three/examples/jsm", rel));
  const code = readFileSync(src, "utf8");
  for (const m of code.matchAll(/(?:import|export)[^'"]*?from\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
    visit(relative(jsm, resolve(dirname(src), m[1])));
  }
};
addons.forEach(visit);

// GSAP
copy(join(nm, "gsap/dist/gsap.min.js"), join(root, "vendor/gsap/gsap.min.js"));
for (const f of ["LICENSE.md", "README.md"]) if (existsSync(join(nm, "gsap", f))) copy(join(nm, "gsap", f), join(root, "vendor/gsap", f));

// Polices (OFL) : Montserrat 300–900, IBM Plex Mono 400–500
for (const w of [300, 400, 500, 600, 700, 800, 900]) copy(join(nm, `@fontsource/montserrat/files/montserrat-latin-${w}-normal.woff2`), join(root, `assets/fonts/montserrat-latin-${w}-normal.woff2`));
for (const w of [400, 500]) copy(join(nm, `@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-${w}-normal.woff2`), join(root, `assets/fonts/ibm-plex-mono-latin-${w}-normal.woff2`));
copy(join(nm, "@fontsource/montserrat/LICENSE"), join(root, "assets/fonts/LICENSE-Montserrat-OFL.txt"));
copy(join(nm, "@fontsource/ibm-plex-mono/LICENSE"), join(root, "assets/fonts/LICENSE-IBM-Plex-Mono-OFL.txt"));
console.log(`vendored three addons: ${seen.size} files`);
