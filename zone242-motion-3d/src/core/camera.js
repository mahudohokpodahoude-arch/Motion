// Caméra virtuelle unique : une suite de mouvements (« legs ») contigus, chacun une fonction pure du temps.
import * as THREE from "three";
import { clamp, ease as E, fbm1 } from "./util.js";

const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const bez = (out, p0, p1, p2, p3, u) => {
  const v = 1 - u;
  const a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
  return out.set(
    a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    a * p0.y + b * p1.y + c * p2.y + d * p3.y,
    a * p0.z + b * p1.z + c * p2.z + d * p3.z,
  );
};

export class CameraRig {
  constructor(start) {
    this.legs = [];
    this.cur = {
      t: 0,
      pos: V(start.pos),
      look: V(start.look),
      fov: start.fov ?? 38,
      roll: start.roll ?? 0,
    };
    this.drift = []; // [t0, t1, amplitude]
  }

  // déplacement du pose courant vers `to` entre t0 et t1 (courbe de Bézier si c1/c2 fournis)
  move(t0, t1, to, o = {}) {
    const from = { pos: this.cur.pos.clone(), look: this.cur.look.clone(), fov: this.cur.fov, roll: this.cur.roll };
    const dst = {
      pos: to.pos ? V(to.pos) : from.pos.clone(),
      look: to.look ? V(to.look) : from.look.clone(),
      fov: to.fov ?? from.fov,
      roll: to.roll ?? from.roll,
    };
    const third = (a, b, k) => a.clone().lerp(b, k);
    const c1 = o.c1 ? V(o.c1) : third(from.pos, dst.pos, 1 / 3);
    const c2 = o.c2 ? V(o.c2) : third(from.pos, dst.pos, 2 / 3);
    const l1 = o.l1 ? V(o.l1) : third(from.look, dst.look, 1 / 3);
    const l2 = o.l2 ? V(o.l2) : third(from.look, dst.look, 2 / 3);
    const ez = typeof o.ease === "function" ? o.ease : E[o.ease || "inOut2"];
    const lookEase = o.lookEase ? (typeof o.lookEase === "function" ? o.lookEase : E[o.lookEase]) : ez;
    this.legs.push({
      t0, t1,
      pose(u, out) {
        const k = ez(u);
        const kl = lookEase(u);
        bez(out.pos, from.pos, c1, c2, dst.pos, k);
        bez(out.look, from.look, l1, l2, dst.look, kl);
        out.fov = from.fov + (dst.fov - from.fov) * k;
        out.roll = from.roll + (dst.roll - from.roll) * k;
      },
    });
    Object.assign(this.cur, { t: t1, ...dst });
    return this;
  }

  // orbite autour d'un centre : azimut / élévation / rayon interpolés (les angles en degrés)
  orbit(t0, t1, o) {
    const c = V(o.center);
    const rel = this.cur.pos.clone().sub(c);
    const r0 = rel.length();
    const az0 = Math.atan2(rel.x, rel.z);
    const el0 = Math.asin(clamp(rel.y / r0, -1, 1));
    const az1 = az0 + THREE.MathUtils.degToRad(o.daz ?? 0);
    const el1 = o.el != null ? THREE.MathUtils.degToRad(o.el) : el0;
    const r1 = o.r ?? r0;
    const look0 = this.cur.look.clone();
    const look1 = o.look ? V(o.look) : c.clone();
    const fov0 = this.cur.fov, fov1 = o.fov ?? fov0;
    const roll0 = this.cur.roll, roll1 = o.roll ?? roll0;
    const ez = typeof o.ease === "function" ? o.ease : E[o.ease || "inOut2"];
    const sph = (az, el, r, out) =>
      out.set(c.x + Math.sin(az) * Math.cos(el) * r, c.y + Math.sin(el) * r, c.z + Math.cos(az) * Math.cos(el) * r);
    this.legs.push({
      t0, t1,
      pose(u, out) {
        const k = ez(u);
        sph(az0 + (az1 - az0) * k, el0 + (el1 - el0) * k, r0 + (r1 - r0) * k, out.pos);
        out.look.copy(look0).lerp(look1, k);
        out.fov = fov0 + (fov1 - fov0) * k;
        out.roll = roll0 + (roll1 - roll0) * k;
      },
    });
    const end = new THREE.Vector3();
    sph(az1, el1, r1, end);
    Object.assign(this.cur, { t: t1, pos: end, look: look1.clone(), fov: fov1, roll: roll1 });
    return this;
  }

  // micro-dérive (respiration de la caméra), amplitude en mètres
  breathe(t0, t1, amp) {
    this.drift.push([t0, t1, amp]);
    return this;
  }

  sample(t, out) {
    let leg = null;
    for (const l of this.legs) {
      if (t >= l.t0 && t <= l.t1) { leg = l; break; }
      if (t > l.t1) leg = l;
    }
    if (!leg) leg = this.legs[0]; // avant le premier mouvement : pose initiale
    leg.pose(t <= leg.t0 ? 0 : clamp((t - leg.t0) / (leg.t1 - leg.t0)), out);
    // dérive lente et déterministe
    let amp = 0;
    for (const [a, b, m] of this.drift) {
      if (t >= a && t <= b) amp = Math.max(amp, m * Math.min(1, (t - a) / 0.8, (b - t) / 0.8));
    }
    if (amp > 0) {
      out.pos.x += fbm1(t * 0.23 + 3.1) * amp;
      out.pos.y += fbm1(t * 0.19 + 7.7) * amp * 0.7;
      out.pos.z += fbm1(t * 0.17 + 1.3) * amp * 0.5;
      out.look.x += fbm1(t * 0.21 + 9.9) * amp * 0.6;
      out.look.y += fbm1(t * 0.16 + 4.4) * amp * 0.4;
    }
    return out;
  }
}

const _pose = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 38, roll: 0 };
const _fwd = new THREE.Vector3();
export function applyPose(camera, rig, t) {
  rig.sample(t, _pose);
  camera.position.copy(_pose.pos);
  camera.up.set(0, 1, 0);
  camera.lookAt(_pose.look);
  if (_pose.roll) {
    camera.getWorldDirection(_fwd);
    camera.rotateOnWorldAxis(_fwd, THREE.MathUtils.degToRad(_pose.roll));
  }
  if (camera.fov !== _pose.fov) {
    camera.fov = _pose.fov;
    camera.updateProjectionMatrix();
  }
  camera.updateMatrixWorld();
  return _pose;
}
