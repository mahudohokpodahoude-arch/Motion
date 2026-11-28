// Moteur de rendu : WebGL + post-production (bloom, étalonnage, vignettage, grain déterministe).
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

// Étalonnage final, appliqué dans l'espace d'affichage (après tonemapping).
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uRes: { value: new THREE.Vector2(1920, 1080) },
    uFrame: { value: 0 },
    uGrain: { value: 0.026 },
    uVignette: { value: 0.32 },
    uCA: { value: 1.4 },
    uFade: { value: 1 }, // 0 = noir, 1 = image
    uFlash: { value: 0 }, // 0..1 vers la couleur d'éclat
    uFlashColor: { value: new THREE.Vector3(0.969, 0.965, 0.984) }, // sRGB
    uVigColor: { value: new THREE.Vector3(0.043, 0.027, 0.2) }, // sRGB
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uFrame, uGrain, uVignette, uCA, uFade, uFlash;
    uniform vec3 uFlashColor, uVigColor;
    varying vec2 vUv;
    float hash(vec2 p) {
      p = fract(p * vec2(443.897, 441.423));
      p += dot(p, p.yx + 19.19);
      return fract((p.x + p.y) * p.x);
    }
    void main() {
      vec2 c = vUv - 0.5;
      float r = length(c * vec2(uRes.x / uRes.y, 1.0));
      // aberration chromatique radiale, nulle au centre
      vec2 off = c * (uCA / uRes.x) * smoothstep(0.15, 0.95, r) * 2.0;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - off).b;
      // vignettage doux, teinté vers la couleur de bord (jamais vers le noir)
      col = mix(col, uVigColor, uVignette * smoothstep(0.42, 1.2, r));
      // grain fin, déterministe par image
      float g = hash(floor(vUv * uRes) + vec2(uFrame * 17.0, uFrame * 31.0)) - 0.5;
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col += g * uGrain * (0.55 + 0.9 * lum * (1.0 - lum));
      col = mix(col, uFlashColor, clamp(uFlash, 0.0, 1.0));
      col *= uFade;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export function createRenderer(canvas, { width = 1920, height = 1080, msaa = 4 } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    stencil: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  // pas de tonemapping : les couleurs officielles (#1900CF, #FF5A36…) sortent à l'identique ; le bloom gère les hautes lumières
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: msaa });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(1);
  composer.setSize(width, height);

  const renderPass = new RenderPass(null, null);
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.85, 0.55, 0.62);
  const output = new OutputPass();
  const grade = new ShaderPass(GradeShader);
  grade.uniforms.uRes.value.set(width, height);
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(output);
  composer.addPass(grade);

  return {
    renderer,
    composer,
    bloom,
    grade,
    render(scene, camera, frame) {
      renderPass.scene = scene;
      renderPass.camera = camera;
      grade.uniforms.uFrame.value = frame;
      composer.render();
    },
  };
}
