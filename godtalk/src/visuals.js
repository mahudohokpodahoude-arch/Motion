/* Visuels générés en code (SVG) : schémas de principe et compositions graphiques.
   Ils ne représentent ni du matériel possédé, ni des réalisations. */

const GOLD = "#C8A96A", PAPER = "#F3F0E8", INK = "#0B0B0C";

function rng(seed) {            // mulberry32 : rendu identique à chaque génération
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = n => n.toFixed(2);

/* Diaphragme d'objectif — pôle Photographie */
function aperture(w = 840, h = 472) {
  const cx = w * 0.62, cy = h * 0.52, R = 190, r = 74, N = 8;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="ap-glow" cx="${f(cx / w)}" cy="${f(cy / h)}" r="0.55">
      <stop offset="0" stop-color="${GOLD}" stop-opacity=".34"/><stop offset=".35" stop-color="${GOLD}" stop-opacity=".07"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0"/></radialGradient>
    <radialGradient id="ap-core" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#FFF6E2" stop-opacity=".95"/><stop offset=".6" stop-color="${GOLD}" stop-opacity=".45"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#101113"/><rect width="${w}" height="${h}" fill="url(#ap-glow)"/>`;
  // bagues de l'objectif
  [R + 70, R + 46, R + 20, R].forEach((rr, i) => {
    s += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${PAPER}" stroke-opacity="${[.08, .14, .22, .5][i]}" stroke-width="${i === 3 ? 1.4 : 0.8}"/>`;
  });
  // graduations
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2, l = i % 10 === 0 ? 12 : 5, r1 = R + 46, r2 = r1 - l;
    s += `<line x1="${f(cx + r1 * Math.cos(a))}" y1="${f(cy + r1 * Math.sin(a))}" x2="${f(cx + r2 * Math.cos(a))}" y2="${f(cy + r2 * Math.sin(a))}" stroke="${PAPER}" stroke-opacity="${i % 10 === 0 ? .45 : .18}" stroke-width=".8"/>`;
  }
  // lamelles : chaque arête de l'ouverture prolongée jusqu'au fût
  const pts = [...Array(N)].map((_, i) => {
    const a = (i / N) * Math.PI * 2 + 0.2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  for (let i = 0; i < N; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % N];
    let dx = x2 - x1, dy = y2 - y1; const L = Math.hypot(dx, dy); dx /= L; dy /= L;
    const fx = x1 - cx, fy = y1 - cy, b = fx * dx + fy * dy, c = fx * fx + fy * fy - R * R;
    const t = -b + Math.sqrt(b * b - c);
    const ex = x1 + dx * t, ey = y1 + dy * t;
    s += `<path d="M${f(x1)},${f(y1)} L${f(ex)},${f(ey)} A${R},${R} 0 0 0 ${f(cx + R * Math.cos(Math.atan2(y1 - cy, x1 - cx) - 0.62))},${f(cy + R * Math.sin(Math.atan2(y1 - cy, x1 - cx) - 0.62))} Z"
      fill="${PAPER}" fill-opacity="${(0.03 + (i % 3) * 0.018).toFixed(3)}" stroke="${GOLD}" stroke-opacity=".55" stroke-width=".9"/>`;
  }
  s += `<polygon points="${pts.map(p => p.map(f).join(",")).join(" ")}" fill="url(#ap-core)" stroke="${GOLD}" stroke-width="1.2"/>`;
  s += `<text x="${cx - R - 64}" y="${cy + 4}" fill="${PAPER}" fill-opacity=".55" font-family="Outfit" font-size="9" letter-spacing="2.5" text-anchor="end">f/2.8</text>`;
  s += `<line x1="${cx - R - 58}" y1="${cy}" x2="${cx - R - 12}" y2="${cy}" stroke="${GOLD}" stroke-width=".8"/>`;
  return s + "</svg>";
}

/* Plan de principe d'une salle équipée — pôle Intégration */
function roomPlan(w = 300, h = 1114) {
  const T = (x, y, txt, a = "start", o = .62) =>
    `<text x="${x}" y="${y}" fill="${PAPER}" fill-opacity="${o}" font-family="Outfit" font-size="8.4" letter-spacing="1.6" text-anchor="${a}">${txt}</text>`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="${PAPER}" stroke-opacity=".05" stroke-width=".6"/></pattern>
  <linearGradient id="fov" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${GOLD}" stop-opacity=".28"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="#121316"/><rect width="${w}" height="${h}" fill="url(#grid)"/>`;
  const x0 = 34, x1 = w - 34, top = 150, bot = 1000;
  s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}" fill="none" stroke="${PAPER}" stroke-opacity=".5" stroke-width="1.4"/>`;
  // écran + scène
  s += `<rect x="${x0 + 46}" y="${top + 14}" width="${x1 - x0 - 92}" height="7" fill="${PAPER}" fill-opacity=".85"/>` + T(w / 2, top + 40, "ÉCRAN / AFFICHAGE", "middle", .7);
  s += `<rect x="${x0 + 22}" y="${top + 56}" width="${x1 - x0 - 44}" height="96" fill="${PAPER}" fill-opacity=".05" stroke="${PAPER}" stroke-opacity=".3" stroke-dasharray="3 3"/>` + T(w / 2, top + 110, "SCÈNE", "middle", .55);
  s += `<rect x="${w / 2 - 9}" y="${top + 120}" width="18" height="12" fill="none" stroke="${GOLD}" stroke-width="1"/>`;
  // enceintes
  [[x0 + 8, top + 64], [x1 - 22, top + 64], [x0 + 8, top + 430], [x1 - 22, top + 430]].forEach(([x, y]) => {
    s += `<rect x="${x}" y="${y}" width="14" height="22" fill="${GOLD}" fill-opacity=".9"/>`;
    const dir = x < w / 2 ? 1 : -1, cx = x + 7, cy = y + 11;
    [16, 26, 36].forEach(r => s += `<path d="M${cx + dir * r * .5},${cy - r * .7} A${r},${r} 0 0 ${dir > 0 ? 1 : 0} ${cx + dir * r * .5},${cy + r * .7}" fill="none" stroke="${GOLD}" stroke-opacity=".45" stroke-width=".8"/>`);
  });
  // public
  for (let row = 0; row < 15; row++) for (let c = 0; c < 9; c++) {
    if (c === 4) continue;
    s += `<circle cx="${x0 + 34 + c * 24}" cy="${top + 196 + row * 30}" r="3.2" fill="${PAPER}" fill-opacity=".22"/>`;
  }
  T; s += T(w / 2, top + 182, "PUBLIC", "middle", .45);
  // caméras + champs
  const cams = [[w / 2, top + 690, -90, "CAM 1"], [x0 + 16, top + 300, -60, "CAM 2"], [x1 - 16, top + 300, -120, "CAM 3"]];
  cams.forEach(([x, y, ang, lab]) => {
    const a = ang * Math.PI / 180, L = ang === -90 ? 540 : 200, sp = .26;
    s += `<path d="M${x},${y} L${f(x + L * Math.cos(a - sp))},${f(y + L * Math.sin(a - sp))} L${f(x + L * Math.cos(a + sp))},${f(y + L * Math.sin(a + sp))} Z" fill="url(#fov)"/>`;
    s += `<rect x="${x - 7}" y="${y - 5}" width="14" height="10" fill="${GOLD}" transform="rotate(${ang + 90} ${x} ${y})"/>`;
    s += T(x + (x < w / 2 ? 12 : x > w / 2 + 1 ? -12 : 0), y + 22, lab, x < w / 2 ? "start" : x > w / 2 + 1 ? "end" : "middle", .8);
  });
  // régie + câblage
  const ry = bot - 92;
  s += `<rect x="${w / 2 - 70}" y="${ry}" width="140" height="44" fill="${PAPER}" fill-opacity=".07" stroke="${GOLD}" stroke-width="1"/>` + T(w / 2, ry + 26, "RÉGIE", "middle", .9);
  s += `<path d="M${w / 2},${ry} V${top + 702}" stroke="${GOLD}" stroke-width=".9" stroke-dasharray="4 4"/>`;
  s += `<path d="M${w / 2 - 70},${ry + 22} H${x0 + 16} V${top + 312}" fill="none" stroke="${GOLD}" stroke-width=".9" stroke-dasharray="4 4"/>`;
  s += `<path d="M${w / 2 + 70},${ry + 22} H${x1 - 16} V${top + 312}" fill="none" stroke="${GOLD}" stroke-width=".9" stroke-dasharray="4 4"/>`;
  s += `<path d="M${w / 2},${ry + 44} V${bot + 40}" stroke="${PAPER}" stroke-opacity=".5" stroke-width=".9" stroke-dasharray="2 3"/>` + T(w / 2 + 8, bot + 56, "DIFFUSION EN LIGNE", "start", .6);
  // titre
  s += T(x0, 74, "SCHÉMA DE PRINCIPE", "start", .5);
  s += `<text x="${x0}" y="104" fill="${PAPER}" font-family="Outfit" font-weight="300" font-size="19">Salle équipée</text>`;
  s += T(x0, 124, "image · son · captation · diffusion", "start", .5);
  return s + "</svg>";
}

/* Timeline de montage — pôle Postproduction */
function timeline(w = 840, h = 472) {
  const R = rng(11);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="tl-a" x1="0" x2="1"><stop offset="0" stop-color="${GOLD}" stop-opacity=".8"/><stop offset="1" stop-color="${GOLD}" stop-opacity=".45"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="#111215"/>`;
  const left = 70, right = w - 30, top = 114;
  // règle de timecode
  for (let x = left, i = 0; x <= right; x += 15, i++) {
    s += `<line x1="${x}" y1="${top - 22}" x2="${x}" y2="${top - (i % 5 ? 16 : 8)}" stroke="${PAPER}" stroke-opacity=".3" stroke-width=".7"/>`;
    if (i % 10 === 0) s += `<text x="${x + 3}" y="${top - 26}" fill="${PAPER}" fill-opacity=".4" font-family="Outfit" font-size="7.5" letter-spacing="1">00:0${Math.floor(i / 10)}:${String((i * 3) % 60).padStart(2, "0")}:00</text>`;
  }
  const tracks = ["V3", "V2", "V1", "A1", "A2"];
  tracks.forEach((name, ti) => {
    const y = top + ti * 46, isA = name[0] === "A";
    s += `<text x="${left - 40}" y="${y + 22}" fill="${PAPER}" fill-opacity=".45" font-family="Outfit" font-size="9" letter-spacing="1.5">${name}</text>`;
    s += `<line x1="${left}" y1="${y + 38}" x2="${right}" y2="${y + 38}" stroke="${PAPER}" stroke-opacity=".06"/>`;
    let x = left + (ti === 0 ? 120 : ti === 1 ? 40 : 0);
    while (x < right - 30) {
      const cw = Math.min(right - x, 50 + R() * 150);
      if (ti < 2 && R() < .35) { x += cw * .6; continue; }
      if (isA) {
        s += `<rect x="${f(x)}" y="${y}" width="${f(cw - 3)}" height="32" rx="2" fill="${PAPER}" fill-opacity=".07" stroke="${PAPER}" stroke-opacity=".18" stroke-width=".7"/>`;
        for (let k = x + 3; k < x + cw - 6; k += 2.6) {
          const a = (Math.sin(k * .07) * .5 + .5) * (0.3 + R() * .7) * 12;
          s += `<line x1="${f(k)}" y1="${f(y + 16 - a)}" x2="${f(k)}" y2="${f(y + 16 + a)}" stroke="${PAPER}" stroke-opacity=".4" stroke-width=".9"/>`;
        }
      } else {
        const g = ti === 2;
        s += `<rect x="${f(x)}" y="${y}" width="${f(cw - 3)}" height="32" rx="2" fill="${g ? "url(#tl-a)" : PAPER}" fill-opacity="${g ? 1 : .14}" stroke="${g ? GOLD : PAPER}" stroke-opacity=".5" stroke-width=".7"/>`;
        s += `<rect x="${f(x + 4)}" y="${y + 4}" width="${f(Math.min(34, cw - 12))}" height="24" fill="${INK}" fill-opacity=".35"/>`;
      }
      x += cw;
    }
  });
  // tête de lecture
  const px = left + (right - left) * .58;
  s += `<line x1="${px}" y1="${top - 30}" x2="${px}" y2="${top + 5 * 46}" stroke="${PAPER}" stroke-width="1.2"/>`;
  s += `<path d="M${px - 6},${top - 36} h12 v6 l-6,6 l-6,-6 Z" fill="${PAPER}"/>`;
  // roues d'étalonnage
  [["LIFT", 0], ["GAMMA", 1], ["GAIN", 2]].forEach(([lab, i]) => {
    const cx = left + 40 + i * 92, cy = top + 5 * 46 + 50;
    s += `<circle cx="${cx}" cy="${cy}" r="25" fill="none" stroke="${PAPER}" stroke-opacity=".25"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="${PAPER}" stroke-opacity=".1"/>`;
    s += `<circle cx="${f(cx + [-6, 4, 9][i])}" cy="${f(cy + [5, -3, -7][i])}" r="3" fill="${GOLD}"/>`;
    s += `<text x="${cx}" y="${cy + 40}" fill="${PAPER}" fill-opacity=".45" font-family="Outfit" font-size="7.5" letter-spacing="2" text-anchor="middle">${lab}</text>`;
  });
  return s + "</svg>";
}

/* Champ génératif — pôle Création vidéo assistée par IA */
function iaField(w = 300, h = 1114) {
  const R = rng(5);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs><radialGradient id="ia-g" cx=".55" cy=".46" r=".6"><stop offset="0" stop-color="${GOLD}" stop-opacity=".22"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></radialGradient></defs>
  <rect width="${w}" height="${h}" fill="#0E0F11"/><rect width="${w}" height="${h}" fill="url(#ia-g)"/>`;
  const step = 11;
  for (let y = step; y < h; y += step) for (let x = step / 2; x < w; x += step) {
    const v = Math.sin(x * .021 + y * .006) + Math.sin(y * .011 - x * .013 + 1.7) + Math.cos(Math.hypot(x - 170, y - 520) * .018);
    const n = (v + 3) / 6;
    const r = Math.max(0, (n - .38) * 6.2);
    if (r < .25) continue;
    const gold = n > .7 || R() < .04;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(Math.min(r, 3.8))}" fill="${gold ? GOLD : PAPER}" fill-opacity="${f(gold ? .85 : .16 + n * .3)}"/>`;
  }
  // cadres d'images « générées »
  [[40, 236, 150, 84], [118, 640, 150, 84], [26, 868, 108, 61]].forEach(([x, y, fw, fh], i) => {
    s += `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" fill="none" stroke="${PAPER}" stroke-opacity=".7" stroke-width="1"/>`;
    s += `<text x="${x}" y="${y - 7}" fill="${PAPER}" fill-opacity=".55" font-family="Outfit" font-size="7.6" letter-spacing="1.6">FRAME ${String(i * 24 + 12).padStart(3, "0")}</text>`;
    [[x, y], [x + fw, y], [x, y + fh], [x + fw, y + fh]].forEach(([cx, cy]) => s += `<rect x="${cx - 2}" y="${cy - 2}" width="4" height="4" fill="${GOLD}"/>`);
  });
  s += `<text x="26" y="${h - 150}" fill="${PAPER}" fill-opacity=".5" font-family="Outfit" font-size="8" letter-spacing="2">PROMPT → STORYBOARD → ANIMATIQUE → FILM</text>`;
  return s + "</svg>";
}

/* Faisceaux lumineux — manifeste et 4e de couverture */
function beams(w = 840, h = 1188, seed = 3, ox = .78, oy = -.04) {
  const R = rng(seed);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
  <defs><radialGradient id="bm-${seed}" cx="${ox}" cy="${oy + .02}" r=".9"><stop offset="0" stop-color="${GOLD}" stop-opacity=".22"/><stop offset=".5" stop-color="${GOLD}" stop-opacity=".03"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></radialGradient>
  <linearGradient id="bl-${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4DC" stop-opacity=".2"/><stop offset="1" stop-color="#FFF4DC" stop-opacity="0"/></linearGradient>
  <filter id="bf-${seed}"><feGaussianBlur stdDeviation="7"/></filter></defs>
  <rect width="${w}" height="${h}" fill="url(#bm-${seed})"/>`;
  const X = w * ox, Y = h * oy;
  for (let i = 0; i < 7; i++) {
    const a = Math.PI / 2 + (R() - .5) * 1.1, sp = .015 + R() * .03, L = h * 1.15;
    s += `<path filter="url(#bf-${seed})" d="M${X},${Y} L${f(X + L * Math.cos(a - sp))},${f(Y + L * Math.sin(a - sp))} L${f(X + L * Math.cos(a + sp))},${f(Y + L * Math.sin(a + sp))} Z" fill="url(#bl-${seed})" opacity="${f(.45 + R() * .5)}"/>`;
  }
  return s + "</svg>";
}

/* Anneaux concentriques — page vision (écho du « g » du logo) */
function rings() {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" style="width:100%;height:100%">`;
  [196, 170, 140, 104, 62].forEach((r, i) =>
    s += `<circle cx="200" cy="200" r="${r}" fill="none" stroke="${i === 2 ? GOLD : PAPER}" stroke-opacity="${i === 2 ? .7 : .1 + i * .03}" stroke-width="${i === 2 ? .8 : .6}"/>`);
  s += `<circle cx="200" cy="200" r="140" fill="none" stroke="${GOLD}" stroke-width="2.2" stroke-dasharray="132 748" stroke-dashoffset="-40"/>`;
  return s + "</svg>";
}

/* Cercles d'ambition — Bénin, Afrique, monde */
function ambitionCircles() {
  const T = (x, y, t, o = .85, sz = 9, c = PAPER) => `<text x="${x}" y="${y}" fill="${c}" fill-opacity="${o}" font-family="Outfit" font-size="${sz}" letter-spacing="2.2" text-anchor="middle">${t}</text>`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340">
  <defs><radialGradient id="am" cx=".5" cy=".72" r=".5"><stop offset="0" stop-color="${GOLD}" stop-opacity=".55"/><stop offset="1" stop-color="${GOLD}" stop-opacity=".08"/></radialGradient></defs>
  <circle cx="170" cy="170" r="166" fill="none" stroke="${PAPER}" stroke-opacity=".28" stroke-dasharray="2 4"/>
  <circle cx="170" cy="216" r="118" fill="${PAPER}" fill-opacity=".03" stroke="${PAPER}" stroke-opacity=".38"/>
  <circle cx="170" cy="262" r="70" fill="url(#am)" stroke="${GOLD}" stroke-width="1.2"/>`;
  s += T(170, 30, "INTERNATIONAL", .7) + T(170, 132, "AFRIQUE DE L'OUEST", .75) + T(170, 262, "BÉNIN", 1, 11) + T(170, 278, "BASE", .6, 7);
  return s + "</svg>";
}

window.GT_VISUALS = { aperture, roomPlan, timeline, iaField, beams, rings, ambitionCircles };
