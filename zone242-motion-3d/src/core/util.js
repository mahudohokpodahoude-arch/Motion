// Outils purs et déterministes : tout état visuel est une fonction du temps t.

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, u) => a + (b - a) * u;
export const mix3 = (out, a, b, u) => {
  out[0] = a[0] + (b[0] - a[0]) * u;
  out[1] = a[1] + (b[1] - a[1]) * u;
  out[2] = a[2] + (b[2] - a[2]) * u;
  return out;
};
// progression normalisée de t dans [a, b]
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const smooth = (u) => u * u * (3 - 2 * u);
export const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);

// courbes d'accélération (mêmes familles que GSAP)
export const ease = {
  linear: (u) => u,
  in2: (u) => u * u,
  out2: (u) => 1 - (1 - u) * (1 - u),
  inOut2: (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
  in3: (u) => u * u * u,
  out3: (u) => 1 - Math.pow(1 - u, 3),
  inOut3: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  out4: (u) => 1 - Math.pow(1 - u, 4),
  inOut4: (u) => (u < 0.5 ? 8 * u * u * u * u : 1 - Math.pow(-2 * u + 2, 4) / 2),
  out5: (u) => 1 - Math.pow(1 - u, 5),
  outExpo: (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u)),
  inExpo: (u) => (u <= 0 ? 0 : Math.pow(2, 10 * u - 10)),
  inOutExpo: (u) =>
    u <= 0 ? 0 : u >= 1 ? 1 : u < 0.5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2,
  inOutSine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
  outSine: (u) => Math.sin((u * Math.PI) / 2),
  outBack: (u, s = 1.4) => 1 + (s + 1) * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2),
};

// enveloppe d'apparition/disparition : 0 avant a, monte sur fi, tient, descend sur fo avant b
export const envelope = (t, a, b, fi = 0.4, fo = 0.4, e = smooth) => {
  if (t <= a || t >= b) return 0;
  const up = fi > 0 ? e(clamp((t - a) / fi)) : 1;
  const down = fo > 0 ? e(clamp((b - t) / fo)) : 1;
  return Math.min(up, down);
};

// générateur pseudo-aléatoire graine fixe (mulberry32)
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// bruit de valeur lisse 1D, déterministe
const hash1 = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};
export const noise1 = (x) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash1(i), hash1(i + 1), u) * 2 - 1;
};
export const fbm1 = (x, oct = 3) => {
  let v = 0;
  let amp = 0.5;
  let fr = 1;
  for (let i = 0; i < oct; i++) {
    v += amp * noise1(x * fr + i * 17.13);
    amp *= 0.5;
    fr *= 2.03;
  }
  return v;
};

// points répartis sur une sphère (spirale de Fibonacci)
export function fibonacciSphere(n, radius = 1) {
  const out = new Float32Array(n * 3);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = ga * i;
    out[i * 3] = Math.cos(th) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(th) * r * radius;
  }
  return out;
}

export const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
