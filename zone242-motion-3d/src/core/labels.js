// Étiquettes typographiques ancrées à des points 3D (DOM net, projeté à chaque image ; opacité fonction du temps).
import * as THREE from "three";
import { envelope } from "./util.js";

const _v = new THREE.Vector3();

export class Labels {
  constructor(layer) {
    this.layer = layer;
    this.items = [];
  }
  // o : { text, anchor: [x,y,z] | (t) => Vector3, t0, t1, fi, fo, dx, dy, align: "left"|"center"|"right", cls, tick }
  add(o) {
    const el = document.createElement("div");
    el.className = "lbl " + (o.cls || "");
    if (o.tick !== false) {
      const dot = document.createElement("i");
      dot.className = "lbl-dot";
      el.appendChild(dot);
    }
    const span = document.createElement("span");
    span.className = "lbl-txt";
    span.textContent = o.text;
    el.appendChild(span);
    el.dataset.align = o.align || "left";
    this.layer.appendChild(el);
    this.items.push({ ...o, el, fi: o.fi ?? 0.45, fo: o.fo ?? 0.45, dx: o.dx ?? 0, dy: o.dy ?? 0 });
    return el;
  }
  update(t, camera) {
    for (const it of this.items) {
      const a = envelope(t, it.t0, it.t1, it.fi, it.fo);
      if (a <= 0.001) {
        if (it.el.style.opacity !== "0") it.el.style.opacity = "0";
        continue;
      }
      if (typeof it.anchor === "function") _v.copy(it.anchor(t));
      else _v.set(it.anchor[0], it.anchor[1], it.anchor[2]);
      _v.project(camera);
      const behind = _v.z > 1;
      const x = (_v.x * 0.5 + 0.5) * 1920 + it.dx;
      const y = (-_v.y * 0.5 + 0.5) * 1080 + it.dy;
      it.el.style.opacity = behind ? "0" : a.toFixed(3);
      it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  }
}
