// L'essaim des 2 420 points : les mêmes lumières traversent tout le film en changeant de formation.
// Chaque phase est une formation (fonction du temps) ; le passage d'une phase à l'autre est un vol échelonné.
import { PointCloud } from "../core/points.js";
import { clamp, ease as E } from "../core/util.js";

export const SWARM_N = 2420;

export function createSwarm(ctx, N = SWARM_N) {
  const cloud = new PointCloud(N, { name: "swarm", renderOrder: 12 });
  cloud.material.uniforms.uTwinkle.value = 0.18;
  cloud.material.uniforms.uMinPx.value = 1.8;
  ctx.scene.add(cloud.object);
  const phases = [];
  const pa = [0, 0, 0], pb = [0, 0, 0];
  const aa = [0, 0, 0, 0, 0], ab = [0, 0, 0, 0, 0];
  // direction d'arc propre à chaque point (pour des trajectoires courbes, pas des lignes droites)
  const arc = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const s = cloud.seed[i] * 6.2831, q = ((i * 0.7548776662) % 1) * 2 - 1;
    arc[i * 3] = Math.cos(s) * 0.8;
    arc[i * 3 + 1] = 0.6 + 0.4 * q;
    arc[i * 3 + 2] = Math.sin(s) * 0.8;
  }

  return {
    cloud,
    N,
    // phase : { t0, dur, spread, ease, lift, order(i)->[0,1], pos(i,t,o), attr(i,t,a)->[size,alpha,r,g,b] }
    phase(p) {
      phases.push({ dur: 1.5, spread: 1.0, lift: 2, ease: "inOut3", order: (i) => cloud.seed[i], ...p });
      phases.sort((a, b) => a.t0 - b.t0);
      return this;
    },
    update(t, camera, look, colors) {
      let k = -1;
      for (let j = 0; j < phases.length; j++) if (phases[j].t0 <= t) k = j;
      if (k < 0) {
        cloud.count = 0;
        cloud.commit(camera, t, { ...look, over: colors.over });
        return;
      }
      cloud.count = N;
      const B = phases[k], A = k > 0 ? phases[k - 1] : null;
      const ez = E[B.ease] || E.inOut3;
      const inMorph = A && t < B.t0 + B.dur + B.spread;
      for (let i = 0; i < N; i++) {
        B.pos(i, t, pb);
        B.attr(i, t, ab);
        if (inMorph) {
          const u = clamp((t - B.t0 - B.order(i) * B.spread) / B.dur);
          if (u < 1) {
            A.pos(i, t, pa);
            A.attr(i, t, aa);
            const e = ez(u);
            const lift = Math.sin(Math.PI * e) * B.lift;
            const x = pa[0] + (pb[0] - pa[0]) * e + arc[i * 3] * lift;
            const y = pa[1] + (pb[1] - pa[1]) * e + arc[i * 3 + 1] * lift;
            const z = pa[2] + (pb[2] - pa[2]) * e + arc[i * 3 + 2] * lift;
            cloud.set(i, x, y, z,
              aa[0] + (ab[0] - aa[0]) * e, aa[1] + (ab[1] - aa[1]) * e,
              aa[2] + (ab[2] - aa[2]) * e, aa[3] + (ab[3] - aa[3]) * e, aa[4] + (ab[4] - aa[4]) * e);
            continue;
          }
        }
        cloud.set(i, pb[0], pb[1], pb[2], ab[0], ab[1], ab[2], ab[3], ab[4]);
      }
      cloud.commit(camera, t, { ...look, over: colors.over });
    },
    // position courante d'un point (après update) — utile pour tendre des liens
    get(i, out) {
      out[0] = cloud.pos[i * 3]; out[1] = cloud.pos[i * 3 + 1]; out[2] = cloud.pos[i * 3 + 2];
      return out;
    },
  };
}
