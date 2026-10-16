// THE KIT: the design system of the ZONE 242 vision film.
// Palette, type roles, motion curves, text reveals, cards, the logo mark and the signature transition.
// One rule for everything: motion curves come from K.ez, colours from K.C, type from K.F.
(function () {
  const U = globalThis.U, G = globalThis.G;
  const { clamp, lerp, ease } = U;
  const W = G.W, H = G.H;
  const K = {};

  // ---------- palette: the brand blue and orange, with tints, and a deep night for depth ----------
  K.C = {
    BLUE: '#1900CF', BLUE_D: '#12009A', BLUE_M: '#3B2BE6', BLUE_L: '#6F64F2', BLUE_XL: '#A9A2FF', MIST: '#EEECFF', HAZE: '#DCD8FF',
    ORANGE: '#FF5A36', ORANGE_D: '#E0431F', ORANGE_L: '#FF8A6B', PEACH: '#FFD3C7', BLUSH: '#FFE9E2',
    NIGHT: '#0B0733', NAVY: '#14104A', INK: '#14122B', SLATE: '#3B3F63', MUTE: '#5D5B76',
    PAPER: '#F7F5F1', WHITE: '#FFFFFF', SAND: '#EDE0CF', CLOUD: '#F1EFF8',
  };
  K.F = { DISPLAY: 'Mont', TEXT: 'Inter', MONO: 'PlexMono' };
  const { ORANGE } = K.C;

  // ---------- colour helpers (hex in, hex out, so they compose) ----------
  const rgbOf = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const toHex = (c) => '#' + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  const memo = new Map();
  K.mix = (a, b, k) => {
    const key = `${a}${b}${k}`;
    let r = memo.get(key);
    if (!r) { const A = rgbOf(a), B = rgbOf(b); r = toHex(A.map((v, i) => v + (B[i] - v) * clamp(k))); memo.set(key, r); }
    return r;
  };
  K.rgba = (h, a) => `rgba(${rgbOf(h).join(',')},${a})`;
  K.dark = (h, k) => K.mix(h, '#0B0520', k);
  K.light = (h, k) => K.mix(h, '#FFFFFF', k);

  // ---------- motion: cubic-bezier curves, like a motion designer's graph editor ----------
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (s) => ((ax * s + bx) * s + cx) * s, sy = (s) => ((ay * s + by) * s + cy) * s, dx = (s) => (3 * ax * s + 2 * bx) * s + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let s = x;
      for (let i = 0; i < 6; i++) { const e = sx(s) - x, d = dx(s); if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break; s -= e / d; }
      return sy(clamp(s));
    };
  }
  K.bezier = bezier;
  K.ez = {
    out: bezier(0.16, 1, 0.3, 1),      // long, soft landing: entrances
    inOut: bezier(0.83, 0, 0.17, 1),   // decisive moves
    io: bezier(0.65, 0, 0.35, 1),      // gentle moves
    in: bezier(0.7, 0, 0.84, 0),       // exits
    snap: bezier(0.2, 0.9, 0.1, 1),    // quick and crisp
    back: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : ease.outBack(x, 1.6)),
  };
  K.prog = (t, a, d) => clamp((t - a) / d);
  K.pop = (t, t0, d = 0.45, s = 1.7) => { const k = clamp((t - t0) / d); return k <= 0 ? 0 : ease.outBack(k, s); };

  // ---------- shapes ----------
  K.rrPath = (x, y, w, h, r, p = new Path2D()) => {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r);
    p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath();
    return p;
  };
  K.fillRR = (ctx, x, y, w, h, r, c) => { ctx.fillStyle = c; ctx.fill(K.rrPath(x, y, w, h, r)); };
  K.circ = (ctx, x, y, r, c) => { if (r <= 0) return; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); };
  K.ell = (ctx, x, y, rx, ry, c, rot = 0) => { if (rx <= 0 || ry <= 0) return; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); };
  K.poly = (ctx, pts, c) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  K.vgrad = (ctx, y0, y1, stops) => { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  K.glow = (ctx, x, y, r, hx, a = 1) => {
    if (a <= 0.002 || r <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, K.rgba(hx, a)); g.addColorStop(0.45, K.rgba(hx, a * 0.42)); g.addColorStop(1, K.rgba(hx, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  };
  // form shading: a dark crescent on the side away from the light (top left), over any fill
  K.form = (ctx, path, a = 0.22, dx = -7, dy = -3, col = '#0B0520') => {
    if (a <= 0) return;
    const p = new Path2D(); p.addPath(path); p.addPath(path, new DOMMatrix().translate(dx, dy));
    ctx.save(); ctx.clip(path); ctx.fillStyle = K.rgba(col, a); ctx.fill(p, 'evenodd'); ctx.restore();
  };
  // the first k (0..1) of a polyline
  K.trace = (ctx, pts, k, color, lw, o = {}) => {
    if (k <= 0) return;
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let left = total * clamp(k);
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineJoin = o.join || 'round'; ctx.lineCap = o.cap || 'round';
    if (o.dash) { ctx.setLineDash(o.dash); ctx.lineDashOffset = o.dashOffset || 0; }
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length && left > 0; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / d);
      ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
      left -= d;
    }
    ctx.stroke(); ctx.restore();
  };

  // ---------- type ----------
  const famOf = (f) => (f === 'text' ? K.F.TEXT : f === 'mono' ? K.F.MONO : f || K.F.DISPLAY);
  K.measure = (ctx, str, size, fam, weight = 900) => G.measure(ctx, str, size, famOf(fam), weight);
  K.fit = (ctx, str, size, w, fam, weight = 900) => { const m = K.measure(ctx, str, size, fam, weight); return m > w ? (size * w) / m : size; };
  K.text = (ctx, str, x, y, size, color, o = {}) => G.text(ctx, str, x, y, {
    size, fam: famOf(o.fam), weight: o.weight ?? 900, color, align: o.align ?? 'left', baseline: o.baseline ?? 'middle', alpha: o.alpha ?? 1,
  });
  // a line rises out of a mask, word by word; an underline can sweep under it
  K.line = (ctx, str, x, y, size, t, t0, o = {}) => {
    const fam = famOf(o.fam), weight = o.weight ?? 900, align = o.align ?? 'left';
    const total = G.measure(ctx, str, size, fam, weight);
    const x0 = align === 'left' ? x : align === 'right' ? x - total : x - total / 2;
    if (t < t0) return { w: total, x0 };
    const out = o.out != null ? K.ez.in(K.prog(t, o.out, 0.35)) : 0;
    const words = str.split(' '), sp = G.measure(ctx, ' ', size, fam, weight);
    ctx.save();
    ctx.beginPath(); ctx.rect(x0 - size, y - size * 0.98, total + size * 2, size * 1.8); ctx.clip();
    let cx = x0;
    words.forEach((wd, i) => {
      const ww = G.measure(ctx, wd, size, fam, weight);
      const k = K.ez.out(K.prog(t, t0 + i * (o.stagger ?? 0.05), o.dur ?? 0.75));
      if (k > 0) G.text(ctx, wd, cx, y + (1 - k) * size * 1.25 - out * size * 1.25, { size, fam, weight, color: o.color ?? K.C.WHITE, align: 'left', baseline: 'middle' });
      cx += ww + sp;
    });
    ctx.restore();
    if (o.underline) {
      const u = K.ez.inOut(K.prog(t, t0 + (o.uDelay ?? 0.3), 0.55)) * (1 - out);
      if (u > 0) { ctx.fillStyle = o.underline; ctx.fillRect(x0, y + size * 0.6, total * u, Math.max(5, size * 0.085)); }
    }
    return { w: total, x0 };
  };
  // a hero word: letters drop in, turning upright with an overshoot
  K.hero = (ctx, str, x, y, size, t, t0, o = {}) => {
    if (t < t0) return;
    const fam = famOf(o.fam), weight = o.weight ?? 900, align = o.align ?? 'left';
    const total = G.measure(ctx, str, size, fam, weight);
    const x0 = align === 'left' ? x : align === 'right' ? x - total : x - total / 2;
    const stag = Math.min(0.035, 0.3 / str.length);
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === ' ') continue;
      const k = K.prog(t, t0 + i * stag, 0.5);
      if (k <= 0) continue;
      const px = x0 + G.measure(ctx, str.slice(0, i), size, fam, weight), cw = G.measure(ctx, ch, size, fam, weight);
      const b = ease.outBack(k, 1.8);
      ctx.save();
      ctx.translate(px + cw / 2, y - (1 - K.ez.out(k)) * size * 0.85);
      ctx.rotate((1 - Math.min(b, 1.06)) * (i % 2 ? 0.8 : -0.8));
      const s = lerp(0.45, 1, Math.min(b, 1.08)); ctx.scale(s, s);
      G.text(ctx, ch, 0, 0, { size, fam, weight, color: o.color ?? K.C.WHITE, align: 'center', baseline: 'middle', alpha: clamp(k * 4) });
      ctx.restore();
    }
  };
  // a mono kicker: a small square, then letters whose spacing tightens
  K.kicker = (ctx, str, x, y, t, t0, o = {}) => {
    const k = K.prog(t, t0, 0.55);
    if (k <= 0) return;
    const size = o.size ?? 24, color = o.color ?? ORANGE, align = o.align ?? 'left';
    const q = K.ez.out(k);
    ctx.save();
    ctx.globalAlpha *= clamp(k * 2.5);
    let tx = x;
    if (align === 'left' && o.dot !== false) {
      const s = size * 0.42 * K.ez.back(clamp(k * 1.6));
      ctx.save(); ctx.translate(x + size * 0.21, y); ctx.rotate((1 - q) * Math.PI); ctx.fillStyle = color; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
      tx = x + size * 0.95;
    }
    ctx.letterSpacing = `${lerp(18, 6, q) * size / 24}px`;
    G.text(ctx, str, tx, y, { size, fam: K.F.MONO, weight: 500, color, align, baseline: 'middle' });
    ctx.restore();
  };

  // ---------- the logo mark ----------
  // the four corners of the ZONE symbol around (x, y); k[i] = how far corner i has flown in (0..1)
  K.corners = (ctx, x, y, size, color, k = [1, 1, 1, 1], fly = 480) => {
    const th = size * 0.127, arm = size * 0.382;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy], i) => {
      const q = clamp(k[i]);
      if (q <= 0) return;
      const e = ease.outBack(q, 1.3), d = (1 - e) * fly;
      ctx.save();
      ctx.globalAlpha *= clamp(q * 3);
      ctx.translate(x + sx * (size / 2 + d), y + sy * (size / 2 + d));
      ctx.rotate((1 - e) * (i % 2 ? 1 : -1) * Math.PI / 2);
      ctx.scale(-sx, -sy);
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(arm, 0); ctx.lineTo(arm, th); ctx.lineTo(th, th); ctx.lineTo(th, arm); ctx.lineTo(0, arm);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    });
  };
  K.SQ = 0.229;   // the centre square, as a share of the symbol's size

  // ---------- cards ----------
  // a rounded card that enters (rise | flip | slideL | slideR | slam | pop), with a soft drop shadow
  K.card = (ctx, x, y, w, h, k, style, draw, o = {}) => {
    if (k <= 0) return;
    const r = o.r ?? 22;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    const kk = clamp(k);
    if (style === 'rise') { ctx.translate(0, (1 - k) * 120); ctx.rotate((1 - k) * -0.12); ctx.globalAlpha *= clamp(k * 3); }
    else if (style === 'flip') ctx.scale(Math.max(0.02, k), 1);
    else if (style === 'slideL' || style === 'slideR') { const sd = style === 'slideL' ? -1 : 1; ctx.translate(sd * (1 - k) * 640, 0); ctx.rotate(sd * (1 - k) * 0.2); }
    else if (style === 'slam') { const s = lerp(1.3, 1, kk); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 4); }
    else if (style === 'pop') { ctx.scale(Math.max(0.01, k), Math.max(0.01, k)); ctx.rotate((1 - Math.min(k, 1)) * 0.3); }
    ctx.translate(-w / 2, -h / 2);
    if (o.shadow !== false) {
      ctx.save();
      ctx.shadowColor = o.shadowColor ?? 'rgba(8,4,40,0.32)'; ctx.shadowBlur = o.blur ?? 46; ctx.shadowOffsetY = o.drop ?? 22;
      K.fillRR(ctx, 0, 0, w, h, r, o.bg ?? '#FFFFFF');
      ctx.restore();
    }
    ctx.clip(K.rrPath(0, 0, w, h, r));
    draw(ctx, w, h);
    if (o.edge) { ctx.strokeStyle = o.edge; ctx.lineWidth = 2; ctx.stroke(K.rrPath(1, 1, w - 2, h - 2, r)); }
    ctx.restore();
  };

  // ---------- the signature transition: the light opens the next scene ----------
  // an orange square turns from 45° to square as it grows from (ox, oy); the next scene grows inside it
  K.square = (ox, oy, q) => {
    const h = Math.hypot(W, H) * 1.06 * q, a = (1 - q) * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
    const p = new Path2D();
    [[-h, -h], [h, -h], [h, h], [-h, h]].forEach(([px, py], i) => { const X = ox + px * c - py * s, Y = oy + px * s + py * c; if (i) p.lineTo(X, Y); else p.moveTo(X, Y); });
    p.closePath();
    return p;
  };
  K.wipe = (ctx, ox, oy, k, inside, o = {}) => {
    if (k <= 0) return;
    const q1 = K.ez.inOut(clamp(k / 0.9)), q2 = K.ez.inOut(clamp((k - 0.06) / 0.94));
    if (q1 > 0 && q2 < 1) { ctx.fillStyle = o.band ?? ORANGE; ctx.fill(K.square(ox, oy, q1)); }
    if (q2 > 0) { ctx.save(); ctx.clip(K.square(ox, oy, q2)); inside(); ctx.restore(); }
  };

  globalThis.K = K;
})();
