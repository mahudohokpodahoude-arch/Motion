/* Illustrations et pictogrammes générés en code (SVG).
   Ils ne représentent ni du matériel possédé, ni des réalisations.
   Palette : crème · or ocre · bleu nuit · bleu brume · terre cuite. */

const C = {
  paper: "#FBF8F2", cream: "#F5EFE4", sand: "#EFE5D3", sand2: "#E2D2B4",
  gold: "#C9973F", goldSoft: "#E9C982", goldText: "#A3742A",
  navy: "#1D2742", navy2: "#2D3B5E", mist: "#E9EDF4", mist2: "#D5DDEA", clay: "#C0643F", white: "#FFFFFF"
};

function rng(seed) {            // mulberry32 : rendu identique à chaque génération
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = n => n.toFixed(1);
const svgOpen = (w, h, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" ${extra}>`;
const txt = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.fill || C.navy}" fill-opacity="${o.op ?? 1}" font-family="${o.font || "Outfit"}" font-size="${o.size || 11}" font-weight="${o.weight || 500}" letter-spacing="${o.ls ?? 2}" text-anchor="${o.anchor || "start"}">${s}</text>`;

/* ------------------------------------------------------------------ */
/* Pictogrammes (grille 48 × 48, trait)                                */
/* ------------------------------------------------------------------ */
const ICONS = {
  camera: `<rect x="5" y="15" width="38" height="25" rx="4"/><path d="M16 15l3.5-5h9l3.5 5"/><circle cx="24" cy="27.5" r="7.5"/><circle cx="24" cy="27.5" r="3"/><circle cx="36.5" cy="20.5" r="1.2" fill="currentColor"/>`,
  video: `<rect x="4" y="14" width="28" height="20" rx="3.5"/><path d="M32 21l12-6v18l-12-6z"/><circle cx="11" cy="20" r="1.6" fill="currentColor"/>`,
  live: `<circle cx="24" cy="24" r="4" fill="currentColor"/><path d="M16 16a11.3 11.3 0 0 0 0 16M32 16a11.3 11.3 0 0 1 0 16M10 10a19.8 19.8 0 0 0 0 28M38 10a19.8 19.8 0 0 1 0 28"/>`,
  integration: `<rect x="10" y="6" width="28" height="18" rx="2"/><path d="M24 24v6M18 30h12"/><rect x="4" y="30" width="7" height="13" rx="1.5"/><rect x="37" y="30" width="7" height="13" rx="1.5"/><circle cx="7.5" cy="38.5" r="1.6"/><circle cx="40.5" cy="38.5" r="1.6"/>`,
  stage: `<path d="M4 42h40"/><rect x="8" y="35" width="32" height="7" rx="1"/><rect x="8" y="4" width="7" height="5" rx="1"/><rect x="33" y="4" width="7" height="5" rx="1"/><path d="M11.5 9L6 35M11.5 9L19 35M36.5 9L29 35M36.5 9L42 35" stroke-opacity=".55"/><circle cx="24" cy="24" r="3"/><path d="M19.5 35v-3a4.5 4.5 0 0 1 9 0v3"/>`,
  clap: `<path d="M6 13L40 6l2 7L8 20z"/><path d="M15 11.2l4 6M24 9.4l4 6M33 7.6l4 6"/><rect x="6" y="20" width="36" height="22" rx="2.5"/><path d="M6 28h36"/>`,
  timeline: `<rect x="5" y="10" width="15" height="7" rx="1.5"/><rect x="22" y="10" width="21" height="7" rx="1.5"/><rect x="5" y="21" width="25" height="7" rx="1.5"/><rect x="32" y="21" width="11" height="7" rx="1.5"/><path d="M5 37q2.5-6 5 0t5 0t5 0t5 0t5 0t5 0t5 0"/><path d="M27 6v38" stroke-width="2.2"/>`,
  ai: `<path d="M21 7l3.2 10.8L35 21l-10.8 3.2L21 35l-3.2-10.8L7 21l10.8-3.2z"/><path d="M36 29l1.6 4.4L42 35l-4.4 1.6L36 41l-1.6-4.4L30 35l4.4-1.6z"/><circle cx="37" cy="11" r="2.2"/>`,
  diamond: `<path d="M14 8h20l8 10-18 22L6 18z"/><path d="M6 18h36M17 18l7 22 7-22M18 8l6 10 6-10"/>`,
  bulb: `<path d="M24 5a12 12 0 0 1 7 21.7V31H17v-4.3A12 12 0 0 1 24 5z"/><path d="M18 36h12M20 41h8M24 31v-8l-3-3M24 23l3-3"/>`,
  shield: `<path d="M24 5l16 6v11c0 10-7 17-16 21-9-4-16-11-16-21V11z"/><path d="M17 24l5 5 9-10"/>`,
  scale: `<path d="M24 7v34M15 41h18M9 13h30"/><circle cx="24" cy="9" r="2"/><path d="M9 13L4 26M9 13l5 13M4 26a5 3.2 0 0 0 10 0M39 13l-5 13M39 13l5 13M34 26a5 3.2 0 0 0 10 0"/>`,
  book: `<path d="M24 12c-5-4-13-4-18-2v28c5-2 13-2 18 2 5-4 13-4 18-2V10c-5-2-13-2-18 2z"/><path d="M24 12v28"/>`,
  target: `<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="10.5"/><circle cx="24" cy="24" r="4" fill="currentColor"/>`,
  megaphone: `<path d="M7 20v8h6l17 9V11l-17 9z"/><path d="M13 28l3 11h5l-2.6-9.5M36 18a8 8 0 0 1 0 12M40 14a13 13 0 0 1 0 20"/>`,
  flow: `<circle cx="24" cy="24" r="15" stroke-dasharray="3 4"/><circle cx="24" cy="9" r="4" fill="currentColor"/><circle cx="39" cy="24" r="4"/><circle cx="24" cy="39" r="4" fill="currentColor"/><circle cx="9" cy="24" r="4"/>`,
  globe: `<circle cx="24" cy="24" r="17"/><ellipse cx="24" cy="24" rx="7.5" ry="17"/><path d="M7 24h34M9.5 15h29M9.5 33h29"/>`,
  layers: `<path d="M24 7l18 9-18 9-18-9z"/><path d="M6 24l18 9 18-9M6 32l18 9 18-9"/>`,
  modules: `<rect x="7" y="7" width="15" height="15" rx="2.5"/><rect x="26" y="7" width="15" height="15" rx="2.5"/><rect x="7" y="26" width="15" height="15" rx="2.5"/><rect x="26" y="26" width="15" height="15" rx="2.5" stroke-dasharray="3 3"/>`,
  story: `<path d="M8 9h32a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H21l-9 7v-7H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z"/><path d="M13 17h22M13 24h15"/>`,
  checklist: `<rect x="10" y="6" width="28" height="37" rx="3"/><path d="M15 16l2.5 2.5 4-5M25 16h8M15 26l2.5 2.5 4-5M25 26h8M16 35h3M25 35h8"/>`,
  network: `<circle cx="24" cy="10" r="4.5"/><circle cx="10" cy="36" r="4.5"/><circle cx="38" cy="36" r="4.5"/><circle cx="24" cy="27" r="3.4" fill="currentColor"/><path d="M24 14.5v9.5M13.5 33l7.6-4.5M34.5 33l-7.6-4.5M14.5 36h19"/>`,
  chip: `<rect x="13" y="13" width="22" height="22" rx="3"/><rect x="19" y="19" width="10" height="10" rx="1.5"/><path d="M19 7v6M24 7v6M29 7v6M19 35v6M24 35v6M29 35v6M7 19h6M7 24h6M7 29h6M35 19h6M35 24h6M35 29h6"/>`,
  building: `<path d="M5 42h38"/><rect x="10" y="8" width="20" height="34"/><path d="M30 18h9v24"/><path d="M15 14h3M22 14h3M15 21h3M22 21h3M15 28h3M22 28h3M18 42v-7h4v7"/>`,
  calendar: `<rect x="7" y="10" width="34" height="31" rx="3"/><path d="M7 18h34M15 6v8M33 6v8"/><path d="M24 23l2 4.2 4.6.6-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.6z" fill="currentColor" stroke="none"/>`,
  church: `<path d="M24 3v9M20 7h8M11 42V24l13-10 13 10v18z"/><path d="M20 42v-8a4 4 0 0 1 8 0v8M5 42h38"/>`,
  music: `<path d="M18 35V11l20-4v24"/><circle cx="13.5" cy="35" r="4.5"/><circle cx="33.5" cy="31" r="4.5"/><path d="M18 17l20-4"/>`,
  rings: `<circle cx="18.5" cy="28" r="10.5"/><circle cx="29.5" cy="28" r="10.5"/><path d="M26 12l3.5-5 3.5 5-3.5 3z"/>`,
  heart: `<path d="M24 40C11 31 6 24 6 17a8.5 8.5 0 0 1 18-3.5A8.5 8.5 0 0 1 42 17c0 7-5 14-18 23z"/><path d="M15 22h5l2.5-4 3 8 2.5-4H33"/>`,
  school: `<path d="M3 18L24 9l21 9-21 9z"/><path d="M12 22v10c6 5 18 5 24 0V22M45 18v12"/>`,
  tag: `<path d="M25 6h15a2 2 0 0 1 2 2v15L24 41 7 24z"/><circle cx="34" cy="14" r="3"/>`,
  cycle: `<path d="M38 18A15 15 0 0 0 10.5 15.5M10 30a15 15 0 0 0 27.5 2.5"/><path d="M10 8v8h8M38 40v-8h-8"/>`,
  wrench: `<path d="M30.5 6.5a9.5 9.5 0 0 0-8.4 12.7L7 34.3a3.9 3.9 0 0 0 5.6 5.6l15.1-15.1a9.5 9.5 0 0 0 12.7-8.4l-6 6-6-1.6-1.6-6z"/>`,
  venn: `<circle cx="18" cy="24" r="12"/><circle cx="30" cy="24" r="12"/>`,
  key: `<circle cx="15" cy="24" r="8"/><circle cx="15" cy="24" r="2.5"/><path d="M23 24h19M35 24v6M41 24v5"/>`,
  box: `<path d="M24 5l17 9v20l-17 9-17-9V14z"/><path d="M7 14l17 9 17-9M24 23v20M15.5 9.5l17 9"/>`,
  growth: `<path d="M5 41h38M9 33l9-9 7 6 14-15"/><path d="M31 15h8v8"/>`,
  people: `<circle cx="17" cy="16" r="5.5"/><path d="M7 38a10 10 0 0 1 20 0"/><circle cx="33" cy="19" r="4.5"/><path d="M28 30a8.5 8.5 0 0 1 14 8"/>`,
  person: `<circle cx="24" cy="15" r="7"/><path d="M10 42a14 14 0 0 1 28 0"/>`,
  search: `<circle cx="21" cy="21" r="12.5"/><path d="M30.5 30.5L42 42M15 21a6 6 0 0 1 6-6"/>`,
  compass: `<circle cx="24" cy="24" r="17"/><path d="M30.5 17.5l-4 9-9 4 4-9z"/><circle cx="24" cy="24" r="1.5" fill="currentColor"/>`,
  flag: `<path d="M10 43V6"/><path d="M10 8c8-4 14 4 24 0v17c-10 4-16-4-24 0"/>`,
  shieldok: `<path d="M24 5l16 6v11c0 10-7 17-16 21-9-4-16-11-16-21V11z"/><path d="M18 22h12M18 28h8"/>`
};
function icon(name) {
  return `<svg class="ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

/* ------------------------------------------------------------------ */
/* Illustrations des pôles (840 × 600)                                 */
/* ------------------------------------------------------------------ */

/* Diaphragme et tirages photo — Photographie */
function aperture(w = 840, h = 600) {
  const cx = 575, cy = 320, R = 168, r = 62, N = 8;
  let s = svgOpen(w, h) + `<defs>
    <linearGradient id="ap-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.mist}"/><stop offset="1" stop-color="${C.sand}"/></linearGradient>
    <radialGradient id="ap-glass" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="${C.navy2}"/><stop offset="1" stop-color="${C.navy}"/></radialGradient>
    <radialGradient id="ap-core" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF4D8"/><stop offset=".55" stop-color="${C.goldSoft}"/><stop offset="1" stop-color="${C.gold}"/></radialGradient>
    <filter id="ap-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="${C.navy}" flood-opacity=".18"/></filter>
  </defs><rect width="${w}" height="${h}" fill="url(#ap-bg)"/>`;
  // tirages photo
  const prints = [[70, 250, -8, "a"], [190, 200, 6, "b"], [120, 380, 3, "c"]];
  prints.forEach(([x, y, rot, k], i) => {
    const pw = 170, ph = 130;
    s += `<g transform="rotate(${rot} ${x + pw / 2} ${y + ph / 2})" filter="url(#ap-sh)">
      <rect x="${x}" y="${y}" width="${pw}" height="${ph + 26}" rx="3" fill="${C.white}"/>
      <rect x="${x + 9}" y="${y + 9}" width="${pw - 18}" height="${ph - 10}" fill="${[C.mist2, C.sand, C.mist][i]}"/>
      <circle cx="${x + pw - 46}" cy="${y + 42}" r="${14}" fill="${[C.gold, C.clay, C.goldSoft][i]}"/>
      <path d="M${x + 9} ${y + ph - 1} L${x + 52} ${y + 70} L${x + 86} ${y + 100} L${x + 120} ${y + 62} L${x + pw - 9} ${y + 104} V${y + ph - 1} Z" fill="${[C.navy2, C.navy, C.navy2][i]}"/>
    </g>`;
  });
  // objectif
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 64}" fill="${C.navy}" filter="url(#ap-sh)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 64}" fill="none" stroke="${C.gold}" stroke-width="3"/>`;
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2, l = i % 8 === 0 ? 14 : 6, r1 = R + 54, r2 = r1 - l;
    s += `<line x1="${f(cx + r1 * Math.cos(a))}" y1="${f(cy + r1 * Math.sin(a))}" x2="${f(cx + r2 * Math.cos(a))}" y2="${f(cy + r2 * Math.sin(a))}" stroke="${C.goldSoft}" stroke-opacity="${i % 8 === 0 ? .9 : .45}" stroke-width="1.4"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 22}" fill="none" stroke="${C.goldSoft}" stroke-opacity=".35" stroke-width="1.2"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#ap-glass)"/>`;
  const pts = [...Array(N)].map((_, i) => { const a = (i / N) * Math.PI * 2 + .2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  for (let i = 0; i < N; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % N];
    let dx = x2 - x1, dy = y2 - y1; const L = Math.hypot(dx, dy); dx /= L; dy /= L;
    const fx = x1 - cx, fy = y1 - cy, b = fx * dx + fy * dy, c = fx * fx + fy * fy - R * R, t = -b + Math.sqrt(b * b - c);
    const a0 = Math.atan2(y1 - cy, x1 - cx) - .62;
    s += `<path d="M${f(x1)},${f(y1)} L${f(x1 + dx * t)},${f(y1 + dy * t)} A${R},${R} 0 0 0 ${f(cx + R * Math.cos(a0))},${f(cy + R * Math.sin(a0))} Z" fill="${C.white}" fill-opacity="${(.06 + (i % 3) * .04).toFixed(2)}" stroke="${C.goldSoft}" stroke-opacity=".7" stroke-width="1.3"/>`;
  }
  s += `<polygon points="${pts.map(p => p.map(f).join(",")).join(" ")}" fill="url(#ap-core)"/>`;
  s += `<circle cx="${cx - 60}" cy="${cy - 70}" r="26" fill="${C.white}" fill-opacity=".08"/>`;
  return s + "</svg>";
}

/* Plan de principe d'une salle équipée — Intégration */
function roomPlan(w = 840, h = 600) {
  const x0 = 150, x1 = 690, top = 92, bot = 548, mid = (x0 + x1) / 2;
  let s = svgOpen(w, h) + `<defs>
    <pattern id="rp-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${C.navy}" stroke-opacity=".06"/></pattern>
    <linearGradient id="rp-fov" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.gold}" stop-opacity=".42"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></linearGradient>
    <filter id="rp-sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="${C.navy}" flood-opacity=".14"/></filter>
  </defs><rect width="${w}" height="${h}" fill="${C.mist}"/><rect width="${w}" height="${h}" fill="url(#rp-grid)"/>`;
  s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}" rx="8" fill="${C.white}" filter="url(#rp-sh)"/>`;
  // écran + scène
  s += `<rect x="${mid - 150}" y="${top + 16}" width="300" height="12" rx="3" fill="${C.navy}"/>` + txt(mid, top + 48, "ÉCRAN", { size: 10, anchor: "middle", op: .6 });
  s += `<rect x="${x0 + 50}" y="${top + 60}" width="${x1 - x0 - 100}" height="78" rx="6" fill="${C.sand}"/>` + txt(mid, top + 104, "SCÈNE", { size: 10, anchor: "middle", op: .6 });
  s += `<rect x="${mid - 12}" y="${top + 110}" width="24" height="16" rx="2" fill="none" stroke="${C.navy}" stroke-width="2"/>`;
  // enceintes
  [[x0 + 16, top + 62], [x1 - 34, top + 62], [x0 + 16, top + 300], [x1 - 34, top + 300]].forEach(([x, y]) => {
    s += `<rect x="${x}" y="${y}" width="18" height="30" rx="3" fill="${C.gold}"/>`;
    const d = x < mid ? 1 : -1, cx = x + 9, cy = y + 15;
    [18, 30].forEach(r => s += `<path d="M${cx + d * r * .55},${cy - r * .7} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${cx + d * r * .55},${cy + r * .7}" fill="none" stroke="${C.gold}" stroke-opacity=".6" stroke-width="1.6"/>`);
  });
  // public
  for (let row = 0; row < 7; row++) for (let c = 0; c < 14; c++) {
    if (c === 6 || c === 7) continue;
    s += `<rect x="${x0 + 80 + c * 28}" y="${top + 176 + row * 30}" width="16" height="12" rx="3" fill="${C.mist2}"/>`;
  }
  // caméras
  const cams = [[mid, top + 404, -90, 300, "CAM 1"], [x0 + 22, top + 236, -40, 190, "CAM 2"], [x1 - 22, top + 236, -140, 190, "CAM 3"]];
  cams.forEach(([x, y, ang, L, lab]) => {
    const a = ang * Math.PI / 180, sp = .24;
    s += `<path d="M${x},${y} L${f(x + L * Math.cos(a - sp))},${f(y + L * Math.sin(a - sp))} L${f(x + L * Math.cos(a + sp))},${f(y + L * Math.sin(a + sp))} Z" fill="url(#rp-fov)"/>`;
    s += `<g transform="rotate(${ang + 90} ${x} ${y})"><rect x="${x - 11}" y="${y - 8}" width="22" height="16" rx="3" fill="${C.clay}"/><rect x="${x - 5}" y="${y - 14}" width="10" height="7" rx="1.5" fill="${C.clay}"/></g>`;
    s += txt(x + (x < mid - 5 ? 20 : x > mid + 5 ? -20 : 0), y + 30, lab, { size: 10, anchor: x < mid - 5 ? "start" : x > mid + 5 ? "end" : "middle", weight: 600 });
  });
  // régie + câblage + diffusion
  const ry = bot - 70;
  s += `<rect x="${mid - 80}" y="${ry}" width="160" height="48" rx="6" fill="${C.navy}"/>` + txt(mid, ry + 30, "RÉGIE", { size: 12, anchor: "middle", fill: C.goldSoft, weight: 600, ls: 3 });
  s += `<path d="M${mid - 80},${ry + 24} H${x0 + 22} V${top + 258}" fill="none" stroke="${C.gold}" stroke-width="2" stroke-dasharray="6 6"/>`;
  s += `<path d="M${mid + 80},${ry + 24} H${x1 - 22} V${top + 258}" fill="none" stroke="${C.gold}" stroke-width="2" stroke-dasharray="6 6"/>`;
  s += `<path d="M${x1},${ry + 24} H${x1 + 70}" stroke="${C.navy}" stroke-width="2"/><path d="M${x1 + 64},${ry + 17} l9 7 -9 7" fill="none" stroke="${C.navy}" stroke-width="2"/>`;
  s += `<circle cx="${x1 + 100}" cy="${ry + 24}" r="22" fill="${C.white}" filter="url(#rp-sh)"/><path d="M${x1 + 88},${ry + 24} a12 12 0 0 1 24 0 M${x1 + 93},${ry + 24} a7 7 0 0 1 14 0" fill="none" stroke="${C.gold}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x1 + 100}" cy="${ry + 26}" r="2.6" fill="${C.navy}"/>`;
  s += txt(x1 + 100, ry + 66, "EN LIGNE", { size: 10, anchor: "middle", op: .7 });
  return s + "</svg>";
}

/* Logiciel de montage stylisé — Postproduction */
function timeline(w = 840, h = 600) {
  const R = rng(11);
  let s = svgOpen(w, h) + `<defs>
    <linearGradient id="tl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.goldSoft}"/><stop offset=".62" stop-color="#E8A26E"/><stop offset="1" stop-color="${C.clay}"/></linearGradient>
    <filter id="tl-sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="${C.navy}" flood-opacity=".2"/></filter>
  </defs><rect width="${w}" height="${h}" fill="${C.sand}"/>`;
  const X = 64, Y = 80, W = 712, H = 470;
  s += `<rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="12" fill="${C.white}" filter="url(#tl-sh)"/>`;
  s += `<path d="M${X} ${Y + 12} a12 12 0 0 1 12 -12 h${W - 24} a12 12 0 0 1 12 12 v22 h-${W} z" fill="${C.navy}"/>`;
  [C.clay, C.gold, C.mist2].forEach((col, i) => s += `<circle cx="${X + 22 + i * 18}" cy="${Y + 17}" r="5" fill="${col}"/>`);
  // image dans la visionneuse
  const vx = X + 24, vy = Y + 56, vw = 400, vh = 225;
  s += `<clipPath id="tl-clip"><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="4"/></clipPath><g clip-path="url(#tl-clip)">
    <rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#tl-sky)"/>
    <circle cx="${vx + 270}" cy="${vy + 130}" r="44" fill="#FFF1CF" fill-opacity=".95"/>
    <path d="M${vx} ${vy + 170} Q${vx + 90} ${vy + 120} ${vx + 180} ${vy + 160} T${vx + 400} ${vy + 150} V${vy + vh} H${vx} Z" fill="${C.navy2}"/>
    <path d="M${vx} ${vy + 200} Q${vx + 120} ${vy + 165} ${vx + 250} ${vy + 195} T${vx + 400} ${vy + 190} V${vy + vh} H${vx} Z" fill="${C.navy}"/>
  </g>`;
  // roues d'étalonnage
  [["LIFT", C.mist2], ["GAMMA", C.sand2], ["GAIN", C.goldSoft]].forEach(([lab, col], i) => {
    const cx = vx + vw + 70 + i * 90, cy = vy + 80;
    s += `<circle cx="${cx}" cy="${cy}" r="34" fill="${col}" fill-opacity=".45" stroke="${C.navy}" stroke-opacity=".25" stroke-width="1.5"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="${C.navy}" stroke-opacity=".15"/>`;
    s += `<circle cx="${cx + [-8, 5, 11][i]}" cy="${cy + [7, -4, -9][i]}" r="5" fill="${C.clay}"/>`;
    s += txt(cx, cy + 56, lab, { size: 10, anchor: "middle", op: .6, weight: 600 });
  });
  // courbes
  s += `<rect x="${vx + vw + 36}" y="${vy + 160}" width="250" height="64" rx="4" fill="${C.mist}"/>`;
  s += `<path d="M${vx + vw + 46} ${vy + 216} C${vx + vw + 110} ${vy + 214} ${vx + vw + 170} ${vy + 168} ${vx + vw + 276} ${vy + 168}" fill="none" stroke="${C.gold}" stroke-width="3"/>`;
  // pistes
  const left = vx + 40, right = X + W - 24, top = vy + vh + 30;
  const cols = [C.mist2, C.gold, C.navy2];
  ["V2", "V1", "A1", "A2"].forEach((name, ti) => {
    const y = top + ti * 34;
    s += txt(vx, y + 18, name, { size: 10, op: .5, weight: 600, ls: 1 });
    let x = left + (ti === 0 ? 70 : 0);
    while (x < right - 20) {
      const cw = Math.min(right - x, 60 + R() * 130);
      if (ti === 0 && R() < .3) { x += cw * .5; continue; }
      if (ti >= 2) {
        s += `<rect x="${f(x)}" y="${y}" width="${f(cw - 4)}" height="24" rx="4" fill="${C.mist}"/>`;
        for (let k = x + 4; k < x + cw - 8; k += 3.2) {
          const a = (Math.sin(k * .08) * .5 + .5) * (.35 + R() * .65) * 9;
          s += `<line x1="${f(k)}" y1="${f(y + 12 - a)}" x2="${f(k)}" y2="${f(y + 12 + a)}" stroke="${C.navy2}" stroke-opacity=".55" stroke-width="1.4"/>`;
        }
      } else {
        s += `<rect x="${f(x)}" y="${y}" width="${f(cw - 4)}" height="24" rx="4" fill="${cols[ti]}" fill-opacity="${ti === 1 ? .9 : 1}"/>`;
      }
      x += cw;
    }
  });
  const px = left + (right - left) * .56;
  s += `<line x1="${px}" y1="${top - 12}" x2="${px}" y2="${top + 4 * 34}" stroke="${C.clay}" stroke-width="2.4"/><path d="M${px - 7},${top - 20} h14 v6 l-7,7 l-7,-7 Z" fill="${C.clay}"/>`;
  return s + "</svg>";
}

/* Création générative — IA */
function iaField(w = 840, h = 600) {
  const R = rng(5);
  let s = svgOpen(w, h) + `<defs>
    <linearGradient id="ia-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.mist}"/><stop offset="1" stop-color="${C.cream}"/></linearGradient>
    <linearGradient id="ia-f1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.goldSoft}"/><stop offset="1" stop-color="${C.clay}"/></linearGradient>
    <linearGradient id="ia-f2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.mist2}"/><stop offset="1" stop-color="${C.navy2}"/></linearGradient>
    <filter id="ia-sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${C.navy}" flood-opacity=".18"/></filter>
  </defs><rect width="${w}" height="${h}" fill="url(#ia-bg)"/>`;
  const step = 16;
  for (let y = step; y < h; y += step) for (let x = step / 2; x < w; x += step) {
    const v = Math.sin(x * .012 + y * .004) + Math.sin(y * .014 - x * .007 + 1.7) + Math.cos(Math.hypot(x - 470, y - 300) * .016);
    const n = (v + 3) / 6, r = Math.max(0, (n - .42) * 9);
    if (r < .5) continue;
    const gold = n > .66 || R() < .05;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(Math.min(r, 5))}" fill="${gold ? C.gold : C.navy2}" fill-opacity="${f(gold ? .75 : .18 + n * .25)}"/>`;
  }
  // storyboard : trois images générées
  const frames = [[110, 120, -4, "ia-f1"], [330, 170, 3, "ia-f2"], [550, 112, -2, "ia-f1"]];
  frames.forEach(([x, y, rot, g], i) => {
    const fw = 200, fh = 126;
    s += `<g transform="rotate(${rot} ${x + fw / 2} ${y + fh / 2})" filter="url(#ia-sh)">
      <rect x="${x - 8}" y="${y - 8}" width="${fw + 16}" height="${fh + 40}" rx="6" fill="${C.white}"/>
      <rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="3" fill="url(#${g})"/>
      ${i === 1 ? `<circle cx="${x + 140}" cy="${y + 44}" r="20" fill="${C.goldSoft}"/><path d="M${x} ${y + fh} L${x + 60} ${y + 70} L${x + 110} ${y + 100} L${x + 150} ${y + 80} L${x + fw} ${y + 110} V${y + fh} Z" fill="${C.navy}"/>`
        : `<circle cx="${x + 70}" cy="${y + 52}" r="24" fill="#FFF3D6" fill-opacity=".9"/><path d="M${x} ${y + fh} Q${x + 100} ${y + 70} ${x + fw} ${y + 104} V${y + fh} Z" fill="${C.navy2}"/>`}
      ${txt(x, y + fh + 22, `IMAGE ${String(i * 24 + 12).padStart(3, "0")}`, { size: 10, op: .6, weight: 600 })}
    </g>`;
  });
  // invite (prompt)
  const py = 430, pw = 560, pxx = (w - pw) / 2;
  s += `<rect x="${pxx}" y="${py}" width="${pw}" height="58" rx="29" fill="${C.navy}" filter="url(#ia-sh)"/>`;
  s += `<path d="M${pxx + 30} ${py + 20} l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 z" fill="${C.goldSoft}"/>`;
  s += txt(pxx + 56, py + 35, "Lever de soleil sur la lagune, plan large, lumière dorée…", { size: 15, fill: C.white, weight: 400, ls: 0, font: "Inter" });
  s += `<circle cx="${pxx + pw - 30}" cy="${py + 29}" r="17" fill="${C.gold}"/><path d="M${pxx + pw - 37} ${py + 29} h13 M${pxx + pw - 30} ${py + 22} l7 7 -7 7" stroke="${C.navy}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += txt(w / 2, py + 92, "PROMPT  →  STORYBOARD  →  ANIMATIQUE  →  FILM", { size: 10.5, anchor: "middle", op: .6, weight: 600 });
  return s + "</svg>";
}

/* ------------------------------------------------------------------ */
/* Illustrations de mise en page                                       */
/* ------------------------------------------------------------------ */

/* Faisceaux lumineux (fond de page) */
function rays(w = 840, h = 1188, seed = 3, color = C.gold, op = .25, ox = .82, oy = -.05) {
  const R = rng(seed);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
  <defs><linearGradient id="ry-${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>
  <filter id="ryb-${seed}"><feGaussianBlur stdDeviation="8"/></filter></defs>`;
  const X = w * ox, Y = h * oy;
  for (let i = 0; i < 7; i++) {
    const a = Math.PI / 2 + (R() - .45) * 1.15, sp = .018 + R() * .034, L = h * 1.2;
    s += `<path filter="url(#ryb-${seed})" d="M${X},${Y} L${f(X + L * Math.cos(a - sp))},${f(Y + L * Math.sin(a - sp))} L${f(X + L * Math.cos(a + sp))},${f(Y + L * Math.sin(a + sp))} Z" fill="url(#ry-${seed})" opacity="${f(.5 + R() * .5)}"/>`;
  }
  return s + "</svg>";
}

/* Anneaux concentriques — page vision (écho du « g » du logo) */
function rings() {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" style="width:100%;height:100%">`;
  s += `<circle cx="200" cy="200" r="196" fill="${C.mist}"/><circle cx="200" cy="200" r="140" fill="${C.sand}"/><circle cx="200" cy="200" r="72" fill="${C.goldSoft}" fill-opacity=".7"/>`;
  [196, 170, 140, 104, 72].forEach((r, i) => s += `<circle cx="200" cy="200" r="${r}" fill="none" stroke="${C.navy}" stroke-opacity="${.08 + i * .03}" stroke-width="1"/>`);
  s += `<circle cx="200" cy="200" r="140" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linecap="round" stroke-dasharray="150 730" stroke-dashoffset="-40"/>`;
  s += `<circle cx="200" cy="200" r="22" fill="${C.navy}"/>`;
  return s + "</svg>";
}

/* Cercles d'ambition — Bénin, Afrique de l'Ouest, international */
function ambitionCircles() {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340">
  <circle cx="170" cy="170" r="166" fill="${C.mist}"/>
  <circle cx="170" cy="216" r="118" fill="${C.sand}"/>
  <circle cx="170" cy="262" r="70" fill="${C.gold}"/>
  <circle cx="170" cy="170" r="166" fill="none" stroke="${C.navy}" stroke-opacity=".2" stroke-dasharray="3 5"/>`;
  s += txt(170, 36, "INTERNATIONAL", { anchor: "middle", size: 10.5, weight: 600, op: .75 });
  s += txt(170, 134, "AFRIQUE DE L'OUEST", { anchor: "middle", size: 10.5, weight: 600, op: .75 });
  s += txt(170, 262, "BÉNIN", { anchor: "middle", size: 15, weight: 600, fill: C.white, ls: 3 });
  s += txt(170, 280, "BASE", { anchor: "middle", size: 8.5, weight: 600, fill: C.white, op: .85 });
  return s + "</svg>";
}

/* Route — feuille de route en quatre étapes */
function road(w = 840, h = 540) {
  const P = "M40 430 C 180 430 200 330 300 320 S 450 330 480 250 S 600 150 660 140 S 780 110 800 80";
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <defs><filter id="rd-sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="${C.navy}" flood-opacity=".18"/></filter></defs>
  <g transform="translate(0 70)">
  <path d="M0 600 L0 380 Q 160 300 330 360 T 640 300 T ${w} 250 V 600 Z" fill="${C.mist}"/>
  <path d="M0 600 L0 430 Q 220 380 420 420 T ${w} 380 V 600 Z" fill="${C.sand}"/>
  <path d="${P}" fill="none" stroke="${C.navy}" stroke-width="30" stroke-linecap="round"/>
  <path d="${P}" fill="none" stroke="${C.goldSoft}" stroke-width="2.6" stroke-dasharray="14 12" stroke-linecap="round"/>
  <path d="M800 80 V18" stroke="${C.navy}" stroke-width="3"/><path d="M800 20 c12 -6 20 6 34 0 v24 c-14 6 -22 -6 -34 0" fill="${C.clay}"/>`;
  // [x, y du jalon, x, y de l'étiquette, alignement, n, libellé]
  const stops = [[150, 418, 120, 352, "middle", "1", "Fondation"], [372, 314, 405, 376, "start", "2", "Premières prestations"],
    [565, 165, 590, 222, "start", "3", "Structuration"], [742, 112, 712, 52, "end", "4", "Envergure et international"]];
  stops.forEach(([x, y, lx, ly, anchor, n, lab]) => {
    s += `<circle cx="${x}" cy="${y}" r="27" fill="${C.gold}" stroke="${C.white}" stroke-width="5" filter="url(#rd-sh)"/>`;
    s += txt(x, y + 8, n, { anchor: "middle", size: 23, weight: 400, fill: C.white, ls: 0 });
    s += txt(lx, ly - 26, `ÉTAPE ${n}`, { anchor, size: 13, weight: 600, fill: C.goldText, ls: 2.6 });
    s += txt(lx, ly, lab, { anchor, size: 22, weight: 500, ls: 0 });
  });
  return s + "</g></svg>";
}

window.GT_VISUALS = { icon, aperture, roomPlan, timeline, iaField, rays, rings, ambitionCircles, road, C };
