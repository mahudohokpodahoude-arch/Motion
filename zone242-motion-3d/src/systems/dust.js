// Poussière de lumière : profondeur permanente du monde (dérive lente, scintillement, bokeh).
import { PointCloud } from "../core/points.js";
import { rng, envelope } from "../core/util.js";

export function createDust(ctx, n = 7000) {
  const cloud = new PointCloud(n, { name: "dust", renderOrder: 2 });
  cloud.material.uniforms.uTwinkle.value = 0.45;
  cloud.material.uniforms.uMinPx.value = 1.2;
  ctx.scene.add(cloud.object);
  const r = rng(4242);
  const base = new Float32Array(n * 3);
  const amp = new Float32Array(n);
  const tint = new Float32Array(n);
  const sz = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    // volume étiré le long du couloir puis au-dessus de l'édifice
    const zone = r();
    if (zone < 0.5) {
      base[i * 3] = (r() - 0.5) * 70;
      base[i * 3 + 1] = (r() - 0.35) * 36;
      base[i * 3 + 2] = -10 + r() * 120;
    } else {
      const a = r() * Math.PI * 2, rad = 6 + Math.pow(r(), 0.6) * 70;
      base[i * 3] = Math.cos(a) * rad;
      base[i * 3 + 1] = -6 + r() * 70;
      base[i * 3 + 2] = Math.sin(a) * rad;
    }
    amp[i] = 0.15 + r() * 0.5;
    tint[i] = r();
    sz[i] = 0.012 + Math.pow(r(), 3) * 0.05;
  }
  const { blueGlow } = ctx.pal;
  return {
    cloud,
    update(t, camera, look, colors) {
      const light = [colors.dust.r, colors.dust.g, colors.dust.b];
      // apparition dans le noir (0,3–2,2 s), présence continue, retrait pendant la signature finale
      const presence = envelope(t, 0.0, 87.2, 1.2, 0.9);
      const gain = presence * (1 - 0.45 * colors.over);
      for (let i = 0; i < n; i++) {
        const k = i * 3, s = cloud.seed[i];
        const x = base[k] + Math.sin(t * 0.07 + s * 50) * amp[i];
        const y = base[k + 1] + Math.sin(t * 0.05 + s * 31) * amp[i] * 0.8 + t * 0.012;
        const z = base[k + 2] + Math.cos(t * 0.06 + s * 23) * amp[i];
        const c = tint[i] < 0.72 || colors.over > 0.5 ? light : blueGlow;
        cloud.set(i, x, y, z, sz[i], gain * (0.35 + 0.65 * tint[i]), c[0], c[1], c[2]);
      }
      cloud.commit(camera, t, { ...look, over: colors.over });
    },
  };
}
