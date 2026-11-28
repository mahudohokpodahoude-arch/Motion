// Fond plein cadre : dégradé radial (jamais de dégradé linéaire, qui « bande » en H.264), couleurs du script couleur.
import * as THREE from "three";

export function createBackdrop() {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uCenter: { value: new THREE.Color() },
      uEdge: { value: new THREE.Color() },
      uPos: { value: new THREE.Vector2(0.5, 0.52) },
      uSpread: { value: 0.95 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.9999, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uCenter, uEdge; uniform vec2 uPos; uniform float uSpread; varying vec2 vUv;
      void main() {
        vec2 d = (vUv - uPos) * vec2(1.7778, 1.0);
        float k = smoothstep(0.0, uSpread, length(d));
        gl_FragColor = vec4(mix(uCenter, uEdge, k * k * (3.0 - 2.0 * k)), 1.0);
      }
    `,
    depthTest: false,
    depthWrite: false,
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  mesh.name = "backdrop";
  return {
    mesh,
    set(c) {
      mat.uniforms.uCenter.value.copy(c.center);
      mat.uniforms.uEdge.value.copy(c.edge);
    },
  };
}
