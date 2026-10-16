// THE ILLUSTRATIONS of the ZONE 242 vision film: flat, faceless people and the places where the Zone lives.
// Everything is a canvas path (no bitmap), so it stays sharp at any size.
//
// A person is drawn in "units": feet at (0, 0), 300 units tall, facing us; IL.person scales it to the
// height asked. Hands are placed with a two-bone arm whose elbow always bends outward.
// Each illustration is a function (ctx, w, h, t, t0) that fills a w × h panel; t0 is when it appears.
// Illustrations that hold the travelling light expose `.spot = [fx, fy, size]` (fractions of the panel).
(function () {
  const U = globalThis.U, G = globalThis.G;
  const { clamp, lerp, ease } = U;
  const IL = {};

  // ---------- palette ----------
  const C = IL.C = {
    BLUE: '#1900CF', ORANGE: '#FF5A36', NAVY: '#0D0838', WHITE: '#FFFFFF', INK: '#14122B',
    LILAC: '#8C82F5', MIST: '#EEEBFF', PEACH: '#FFD3C7', SAND: '#F8E5D2', HAIR: '#1A0F0C',
    GREY: '#D6D2DE', SHOE: '#1C1533', DENIM: '#3A2FB8', NIGHT: '#0A0540',
  };
  const SKIN = IL.SKIN = ['#5A3522', '#6E4229', '#7F4E31', '#93603D', '#A8714A'];
  const MONT = 'Mont';

  // ---------- small helpers ----------
  const prog = (t, a, d) => clamp((t - a) / d);
  const pop = IL.pop = (t, t0, d = 0.4, s = 1.7) => { const k = prog(t, t0, d); return k <= 0 ? 0 : ease.outBack(k, s); };
  const rgb = (hx) => [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16));
  const rgba = IL.rgba = (hx, a) => `rgba(${rgb(hx).join(',')},${a})`;
  const shade = (hx, k) => `rgb(${rgb(hx).map((v) => Math.round(v * k)).join(',')})`;
  const rr = IL.rr = (ctx, x, y, w, h, r) => {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };
  const fillRR = (ctx, x, y, w, h, r, c) => { rr(ctx, x, y, w, h, r); ctx.fillStyle = c; ctx.fill(); };
  const circ = (ctx, x, y, r, c) => { if (r <= 0) return; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); };
  const ell = (ctx, x, y, rx, ry, c, rot = 0) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); };
  const tri = (ctx, a, b, c, col) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  const shape = (ctx, pts, col) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  const vgrad = (ctx, y0, y1, stops) => { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const sky = (ctx, w, h, stops) => { const g = vgrad(ctx, 0, h, stops); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); return g; };
  const glow = IL.glow = (ctx, x, y, r, hx, a = 1) => {
    if (a <= 0 || r <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(hx, a)); g.addColorStop(1, rgba(hx, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  };
  // the first k (0..1) of a polyline
  const poly = IL.poly = (ctx, pts, k, color, lw, dash) => {
    if (k <= 0) return;
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let left = total * clamp(k);
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length && left > 0; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / d);
      ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
      left -= d;
    }
    ctx.stroke(); ctx.restore();
  };
  const text = (ctx, str, x, y, size, color, o = {}) => G.text(ctx, str, x, y, { size, fam: MONT, weight: o.weight ?? 800, color, align: o.align ?? 'center', baseline: 'middle', alpha: o.alpha ?? 1 });

  // the ZONE symbol: four corners and the light
  IL.symbol = (ctx, x, y, size, col, sqCol) => {
    const th = size * 0.127, arm = size * 0.382;
    ctx.fillStyle = col;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
      ctx.save(); ctx.translate(x + sx * size / 2, y + sy * size / 2); ctx.scale(-sx, -sy);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(arm, 0); ctx.lineTo(arm, th); ctx.lineTo(th, th); ctx.lineTo(th, arm); ctx.lineTo(0, arm);
      ctx.closePath(); ctx.fill(); ctx.restore();
    });
    if (sqCol) { const q = size * 0.229; ctx.fillStyle = sqCol; ctx.fillRect(x - q / 2, y - q / 2, q, q); }
  };
  IL.stars = (ctx, w, h, t, n, seed, yMax = 0.6) => {
    for (let i = 0; i < n; i++) {
      const x = U.hash(seed, i) * w, y = U.hash(seed + 1, i) * h * yMax, s = 1.6 + U.hash(seed + 2, i) * 2.4;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * (1.5 + U.hash(seed + 3, i) * 2) + i))})`;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
  };
  // a crescent: a full moon bitten by the sky itself (fill = the sky's gradient)
  IL.moon = (ctx, x, y, r, skyFill) => { circ(ctx, x, y, r, '#FFFFFF'); circ(ctx, x + r * 0.45, y - r * 0.3, r * 0.86, skyFill); };
  // a pill label that pops in with a turn
  IL.badge = (ctx, x, y, str, k, bgc = C.ORANGE, fg = C.WHITE, size = 20) => {
    if (k <= 0) return;
    const tw = G.measure(ctx, str, size, MONT, 800), bw = tw + size * 1.5, bh = size * 1.75;
    ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.scale(k, k); ctx.rotate((1 - Math.min(k, 1)) * 0.6);
    fillRR(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2, bgc);
    text(ctx, str, 0, 1, size, fg);
    ctx.restore();
  };

  // a rounded panel that holds an illustration; k = entrance (0..1+), style = how it enters
  IL.panel = (ctx, x, y, w, h, k, style, draw, r = 22, shadow = 0) => {
    if (k <= 0) return;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    if (style === 'rise') { ctx.translate(0, (1 - k) * 110); ctx.rotate((1 - k) * -0.14); ctx.globalAlpha *= clamp(k * 3); }
    else if (style === 'flip') { ctx.scale(Math.max(0.02, k), 1); }
    else if (style === 'slideL' || style === 'slideR') { const sd = style === 'slideL' ? -1 : 1; ctx.translate(sd * (1 - k) * 620, 0); ctx.rotate(sd * (1 - k) * 0.22); }
    else if (style === 'slam') { const s = lerp(1.35, 1, clamp(k)); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 4); }
    ctx.translate(-w / 2, -h / 2);
    if (shadow) fillRR(ctx, 0, shadow, w, h, r, 'rgba(13,8,56,0.12)');
    rr(ctx, 0, 0, w, h, r); ctx.clip();
    draw(ctx, w, h);
    ctx.restore();
  };

  // ---------- people ----------
  // two-bone arm: shoulder S, hand target P; the elbow bends outward (side -1 = screen left, +1 = screen right)
  function arm(S, P, side, a = 62, b = 58) {
    let dx = P[0] - S[0], dy = P[1] - S[1], d = Math.hypot(dx, dy);
    const max = a + b - 0.5;
    if (d > max) { dx *= max / d; dy *= max / d; d = max; }
    d = Math.max(d, 1e-3);
    const ang = Math.atan2(dy, dx), A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    const E1 = [S[0] + Math.cos(ang + A) * a, S[1] + Math.sin(ang + A) * a];
    const E2 = [S[0] + Math.cos(ang - A) * a, S[1] + Math.sin(ang - A) * a];
    return { E: side * E1[0] >= side * E2[0] ? E1 : E2, H: [S[0] + dx, S[1] + dy] };
  }
  // hand targets [screen-left hand, screen-right hand] in units; p = a phase for the moving poses
  const POSE = IL.POSE = {
    down: () => [[-48, -108], [48, -108]],
    up: (p = 0) => [[-86 - 4 * Math.sin(p), -350], [86 + 4 * Math.sin(p + 1), -350]],
    upOne: (p = 0) => [[-48, -108], [80 + 4 * Math.sin(p), -352]],
    wave: (p = 0) => [[-48, -108], [84 + 12 * Math.sin(p * 2.6), -318]],
    hips: () => [[-62, -146], [62, -146]],
    cross: () => [[22, -178], [-22, -170]],
    pray: () => [[-3, -206], [3, -206]],
    hold: () => [[-20, -152], [20, -152]],
    mic: () => [[-48, -108], [12, -258]],
    talk: (p = 0) => [[-48, -108], [60 + 7 * Math.sin(p * 3), -200 + 9 * Math.sin(p * 2)]],
    selfie: () => [[-48, -108], [104, -318]],
    pocket: () => [[-40, -126], [40, -126]],
  };
  const mixPt = (a, b, q) => [lerp(a[0], b[0], q), lerp(a[1], b[1], q)];
  IL.mix = (A, B, q) => [mixPt(A[0], B[0], q), mixPt(A[1], B[1], q)];
  // a point in panel pixels → units of a person standing at (x, y) and h tall
  IL.u = (x, y, h, px, py, flip) => [((px - x) / (h / 300)) * (flip ? -1 : 1), (py - y) / (h / 300)];

  function wax(ctx, col, bottomY) {   // a small wax-print motif, clipped by the caller
    ctx.fillStyle = col;
    for (let r = 0, yy = -226; yy < bottomY + 12; r++, yy += 20) {
      for (let xx = -84 + (r % 2) * 11; xx < 84; xx += 22) {
        ctx.beginPath(); ctx.moveTo(xx, yy - 5); ctx.lineTo(xx + 5, yy); ctx.lineTo(xx, yy + 5); ctx.lineTo(xx - 5, yy); ctx.closePath(); ctx.fill();
      }
    }
  }

  // o: k (entrance), t, ph, pose | hands, flip, lean, back, kid, bow, sil (one colour for all: a silhouette),
  //    skin, hair (short | afro | long | puffs | bun | gray | bald | wrap | cap), hairCol, wrap, capCol,
  //    outfit (tee | shirt | suit | dress | gown | hoodie | kaftan), top, bottom, shoe, pattern, flare, sleeve,
  //    tie, bowtie, trim, pack, phones, headset, medal, badge, item (mic | cup | book | phone | stick | cane | guitar | tablet)
  IL.person = (ctx, x, y, h, o = {}) => {
    const k = o.k ?? 1;
    if (k <= 0.001 || h <= 0) return;
    const sil = o.sil, t = o.t ?? 0, ph = o.ph ?? 0;
    const skin = sil || o.skin || SKIN[2], hairC = sil || o.hairCol || C.HAIR;
    const top = sil || o.top || C.BLUE, bottom = sil || o.bottom || C.NAVY, shoe = sil || o.shoe || C.SHOE;
    const fit = o.outfit || 'tee', style = o.hair || 'short', kid = !!o.kid;
    ctx.save();
    ctx.translate(x, y + (1 - k) * h * 0.4);
    ctx.globalAlpha *= clamp(k * 3);
    ctx.scale((o.flip ? -1 : 1) * h / 300, h / 300);
    if (o.lean) ctx.rotate(o.lean);
    const hr = kid ? 31 : 25, hy = (kid ? -266 : -272) + (o.bow ? 7 : 0);

    // behind: the bag, the hood, hair that falls behind the head
    if (o.pack) fillRR(ctx, -47, -236, 94, 100, 20, sil || o.pack);
    if (fit === 'hoodie') ell(ctx, 0, -233, 34, 15, sil || shade(top, 0.8));
    if (style === 'afro') circ(ctx, 0, hy - 7, hr + 11, hairC);
    if (style === 'long') fillRR(ctx, -hr - 6, hy - 18, 2 * hr + 12, 98, 24, hairC);
    if (style === 'puffs') { circ(ctx, -hr - 1, hy - hr * 0.55, 13, hairC); circ(ctx, hr + 1, hy - hr * 0.55, 13, hairC); }

    // legs and shoes
    if (fit !== 'gown') {
      const dress = fit === 'dress', lw = dress ? 17 : 25, top0 = dress ? -92 : -142;
      for (const sd of [-1, 1]) {
        fillRR(ctx, sd * 16 - lw / 2, top0, lw, -top0 - 4, 7, dress ? skin : bottom);
        fillRR(ctx, sd * 16 - 14 + sd * 4, -13, 28, 13, 6, shoe);
      }
    }
    // neck
    fillRR(ctx, -9, hy + hr - 8, 18, -224 - (hy + hr - 8), 4, skin);
    // body: a shirt, or a dress that flares from the waist
    const hemY = fit === 'gown' ? -2 : fit === 'dress' ? -64 : fit === 'kaftan' ? -74 : null;
    const flare = o.flare ?? (fit === 'gown' ? 68 : fit === 'kaftan' ? 48 : 54);
    const body = () => {
      ctx.beginPath();
      ctx.moveTo(-40, -216); ctx.quadraticCurveTo(-40, -234, -22, -234); ctx.lineTo(22, -234); ctx.quadraticCurveTo(40, -234, 40, -216);
      if (hemY == null) { ctx.lineTo(35, -126); ctx.lineTo(-35, -126); }
      else { ctx.lineTo(32, -152); ctx.lineTo(flare, hemY); ctx.quadraticCurveTo(0, hemY + 10, -flare, hemY); ctx.lineTo(-32, -152); }
      ctx.closePath();
    };
    body(); ctx.fillStyle = top; ctx.fill();
    if (o.pattern && !sil) { ctx.save(); body(); ctx.clip(); wax(ctx, o.pattern, hemY ?? -126); ctx.restore(); }

    // details that make the clothes read
    if (!sil) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (fit === 'tee' || fit === 'dress' || fit === 'gown') {
        ctx.beginPath(); ctx.arc(0, -238, 12, 0.12 * Math.PI, 0.88 * Math.PI); ctx.strokeStyle = shade(top, 0.75); ctx.lineWidth = 3.5; ctx.stroke();
      }
      if (fit === 'shirt') {
        tri(ctx, [-15, -236], [0, -234], [-8, -219], o.collar || C.WHITE); tri(ctx, [15, -236], [0, -234], [8, -219], o.collar || C.WHITE);
        [-206, -186, -166].forEach((by) => circ(ctx, 0, by, 2.4, shade(top, 0.65)));
      }
      if (fit === 'suit') {
        tri(ctx, [-14, -234], [14, -234], [0, -184], o.shirtCol || (top === C.WHITE ? '#E7E3F4' : C.WHITE));
        if (o.bowtie) { tri(ctx, [0, -226], [-12, -233], [-12, -219], o.bowtie); tri(ctx, [0, -226], [12, -233], [12, -219], o.bowtie); }
        else if (o.tie !== false) shape(ctx, [[-4, -229], [4, -229], [7, -200], [0, -188], [-7, -200]], o.tie || C.ORANGE);
        ctx.strokeStyle = shade(top === C.WHITE ? '#D9D4EC' : top, 0.72); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-14, -234); ctx.lineTo(-3, -184); ctx.moveTo(14, -234); ctx.lineTo(3, -184); ctx.stroke();
      }
      if (fit === 'hoodie') {
        fillRR(ctx, -26, -174, 52, 30, 10, shade(top, 0.86));
        ctx.strokeStyle = C.WHITE; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-8, -230); ctx.lineTo(-9, -206); ctx.moveTo(8, -230); ctx.lineTo(9, -206); ctx.stroke();
      }
      if (fit === 'kaftan') {
        ctx.strokeStyle = o.trim || C.ORANGE; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(-15, -234); ctx.lineTo(0, -204); ctx.lineTo(15, -234); ctx.moveTo(0, -204); ctx.lineTo(0, -168); ctx.stroke();
      }
      if (o.pack) { fillRR(ctx, -31, -234, 9, 72, 4, shade(o.pack, 0.85)); fillRR(ctx, 22, -234, 9, 72, 4, shade(o.pack, 0.85)); }
      if (o.medal) {
        ctx.strokeStyle = C.WHITE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-13, -233); ctx.lineTo(0, -198); ctx.lineTo(13, -233); ctx.stroke();
        circ(ctx, 0, -190, 10, C.ORANGE); circ(ctx, 0, -190, 4.5, '#FFB39F');
      }
      if (o.badge) {
        ctx.strokeStyle = C.NAVY; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-12, -233); ctx.lineTo(0, -200); ctx.lineTo(12, -233); ctx.stroke();
        fillRR(ctx, -10, -201, 20, 24, 3, C.WHITE); fillRR(ctx, -6, -195, 12, 5, 1, C.BLUE);
      }
    }

    // head and hair
    if (o.back) circ(ctx, 0, hy, hr + 1.5, hairC);
    else circ(ctx, 0, hy, hr, skin);
    const capOn = (col, cut) => {
      ctx.save(); ctx.beginPath(); ctx.rect(-hr - 24, hy - hr - 34, 2 * hr + 48, 34 + hr - cut); ctx.clip();
      circ(ctx, 0, hy - 1, hr + 2, col); ctx.restore();
    };
    if (!o.back) {
      if (['short', 'afro', 'long', 'puffs', 'bun'].includes(style)) capOn(hairC, 9);
      if (style === 'gray') capOn(sil || C.GREY, 9);
    }
    if (style === 'bun') circ(ctx, 0, hy - hr - 8, 12, hairC);
    if (style === 'wrap') {
      const wc = sil || o.wrap || C.ORANGE;
      ctx.beginPath();
      ctx.moveTo(-hr - 3, hy - 3);
      ctx.bezierCurveTo(-hr - 11, hy - 40, -8, hy - 57, 6, hy - 53);
      ctx.bezierCurveTo(hr + 4, hy - 49, hr + 13, hy - 30, hr + 3, hy - 3);
      ctx.quadraticCurveTo(0, hy - 13, -hr - 3, hy - 3);
      ctx.closePath(); ctx.fillStyle = wc; ctx.fill();
      ell(ctx, hr * 0.55, hy - 48, 11, 7, wc, -0.6);
      if (!sil) {
        ctx.strokeStyle = shade(wc, 0.78); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-hr - 2, hy - 20); ctx.quadraticCurveTo(0, hy - 34, hr + 2, hy - 20); ctx.stroke();
      }
    }
    if (style === 'cap') {
      const cc = sil || o.capCol || C.BLUE;
      capOn(cc, 6);
      ell(ctx, 0, hy - 7, hr + 8, 6, sil || shade(cc, 0.72));
    }
    if (o.phones) {
      const pc = sil || o.phones;
      ctx.strokeStyle = pc; ctx.lineWidth = 6; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.arc(0, hy, hr + 5, Math.PI * 1.06, Math.PI * 1.94); ctx.stroke();
      fillRR(ctx, -hr - 9, hy - 10, 12, 22, 5, pc); fillRR(ctx, hr - 3, hy - 10, 12, 22, 5, pc);
      if (o.headset) { ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hr + 3, hy + 8); ctx.quadraticCurveTo(hr, hy + 22, 8, hy + 20); ctx.stroke(); }
    }

    // what is held in front of the body (the hands come over it)
    const P = o.hands || (POSE[o.pose || 'down'] || POSE.down)(t * 2 + ph);
    if (o.item === 'guitar') {
      ctx.save(); ctx.translate(-14, -150); ctx.rotate(0.95);
      fillRR(ctx, -4, -112, 8, 96, 3, sil || '#3B2416'); fillRR(ctx, -6, -124, 12, 16, 3, sil || '#3B2416');
      circ(ctx, 0, 0, 27, sil || '#E8833A'); circ(ctx, 0, -25, 21, sil || '#E8833A'); circ(ctx, 0, -12, 7, sil || '#3B2416');
      ctx.restore();
    }
    if (o.item === 'book') { fillRR(ctx, -26, -172, 52, 34, 4, sil || o.bookCol || C.NAVY); if (!sil) fillRR(ctx, -1.5, -170, 3, 30, 0, C.WHITE); }
    if (o.item === 'tablet') { fillRR(ctx, -28, -176, 56, 38, 5, sil || C.NAVY); if (!sil) fillRR(ctx, -23, -171, 46, 28, 3, '#8C82F5'); }

    // arms (on top of the body) and hands
    const longSl = o.sleeve ? o.sleeve === 'long' : ['shirt', 'suit', 'hoodie', 'kaftan'].includes(fit);
    const sleeveC = sil || o.sleeveCol || top;
    const H = {};
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [[-1, P[0]], [1, P[1]]].forEach(([side, target]) => {
      const S0 = [side * 32, -222];
      const { E, H: hand } = arm(S0, target, side);
      ctx.strokeStyle = skin; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(S0[0], S0[1]); ctx.lineTo(E[0], E[1]); ctx.lineTo(hand[0], hand[1]); ctx.stroke();
      if (o.sleeve !== 'none') {
        ctx.strokeStyle = sleeveC; ctx.lineWidth = fit === 'kaftan' ? 24 : 19;
        ctx.beginPath(); ctx.moveTo(S0[0], S0[1]);
        if (longSl) { ctx.lineTo(E[0], E[1]); ctx.lineTo(lerp(E[0], hand[0], 0.78), lerp(E[1], hand[1], 0.78)); }
        else ctx.lineTo(lerp(S0[0], E[0], 0.5), lerp(S0[1], E[1], 0.5));
        ctx.stroke();
      }
      circ(ctx, hand[0], hand[1], 9.5, skin);
      H[side] = hand;
    });
    // what is held in a hand
    const R = H[1], L = H[-1];
    if (o.item === 'mic') { fillRR(ctx, R[0] - 4, R[1] - 30, 8, 26, 3, sil || '#241D3D'); circ(ctx, R[0], R[1] - 32, 7.5, sil || '#4A4466'); }
    if (o.item === 'cup') { fillRR(ctx, R[0] - 9, R[1] - 24, 18, 24, 3, sil || C.WHITE); if (!sil) fillRR(ctx, R[0] - 9, R[1] - 16, 18, 6, 0, C.ORANGE); }
    if (o.item === 'phone') { fillRR(ctx, R[0] - 8, R[1] - 30, 16, 28, 3, sil || C.NAVY); }
    if (o.item === 'stick') {
      const a = o.stickA ?? -0.3, len = 120, ex = R[0] + Math.cos(a) * len, ey = R[1] + Math.sin(a) * len;
      ctx.strokeStyle = sil || '#6B3A1E'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(R[0], R[1]); ctx.lineTo(ex, ey); ctx.stroke();
      fillRR(ctx, ex - 7, ey - 7, 14, 14, 4, sil || '#FFF1EA');
    }
    if (o.item === 'cane') { ctx.strokeStyle = sil || '#5B3A22'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(L[0], L[1] - 8); ctx.lineTo(L[0] - 6, -4); ctx.stroke(); }
    ctx.restore();
  };

  // a person seen from above (for a circle around a table); faces -y before the rotation `ang`
  IL.topPerson = (ctx, x, y, ang, s, o = {}) => {
    const k = o.k ?? 1;
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s * Math.min(k, 1.2), s * Math.min(k, 1.2)); ctx.globalAlpha *= clamp(k * 3);
    ell(ctx, 3, 6, 28, 17, 'rgba(13,8,56,0.13)');
    ctx.lineCap = 'round'; ctx.strokeStyle = o.top || C.BLUE; ctx.lineWidth = 10;
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 20, -2); ctx.lineTo(sd * 13, -21); ctx.stroke(); circ(ctx, sd * 12, -25, 5.5, o.skin || SKIN[2]); }
    ell(ctx, 0, 0, 25, 14, o.top || C.BLUE);
    circ(ctx, 0, 1, 12.5, o.wrap || C.HAIR);
    if (o.wrap) circ(ctx, 6, 9, 5, shade(o.wrap, 0.8));
    ctx.restore();
  };

  // ======================= THE WEEK =======================
  // Sunday: the whole house worships, seen from among the people
  IL.culte = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#3B24F2'], [0.65, '#1A0BB4'], [1, '#100678']]);
    const sy = h * 0.6;
    glow(ctx, w / 2, sy - h * 0.12, w * 0.75, '#FFFFFF', 0.42);
    [[0.18, 0], [0.82, 2.1]].forEach(([fx, p]) => {
      ctx.save(); ctx.translate(w * fx, -6); ctx.rotate(Math.sin(t * 1.4 + p) * 0.26 + (fx < 0.5 ? -0.18 : 0.18));
      const g = ctx.createLinearGradient(0, 0, 0, h * 0.8); g.addColorStop(0, 'rgba(255,255,255,0.34)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.lineTo(w * 0.22, h * 0.8); ctx.lineTo(-w * 0.22, h * 0.8); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle = 'rgba(255,255,255,0.24)'; ctx.fillRect(w * 0.12, sy, w * 0.76, 5);
    IL.person(ctx, w / 2, sy, h * 0.3, { k: pop(t, t0, 0.45), pose: 'mic', item: 'mic', top: C.WHITE, bottom: C.NAVY, skin: SKIN[1], hands: [[-84, -350], [12, -258]], t });
    for (let i = 0; i < 6; i++) {
      const px = w * (0.05 + i * 0.18), hh = h * (0.56 + (i % 2) * 0.07), p = t * 2 + i;
      const lift = ease.inOutCubic(prog(t, t0 + 0.3 + U.hash(41, i) * 0.35, 0.45));
      const hands = IL.mix(POSE.down(p), i % 3 === 2 ? POSE.upOne(p) : POSE.up(p), lift);
      IL.person(ctx, px, h * 1.16, hh, { k: pop(t, t0 + 0.06 + i * 0.04, 0.4), sil: '#0B0636', hands, hair: i === 1 ? 'wrap' : i === 4 ? 'bun' : 'short', t });
    }
  };

  // a growth group: about eight people around a Berger (in orange), seen from above
  IL.groupe = (ctx, w, h, t, t0) => {
    ctx.fillStyle = '#EEEBFF'; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * 0.5;
    circ(ctx, cx, cy, R * 0.9 * clamp(ease.outBack(prog(t, t0 - 0.1, 0.5), 1.3)), '#DED8FF');
    const tk = pop(t, t0, 0.4);
    circ(ctx, cx + 4, cy + 7, R * 0.38 * tk, 'rgba(13,8,56,0.10)');
    circ(ctx, cx, cy, R * 0.38 * tk, C.WHITE);
    const rot = -0.8 * (1 - ease.outCubic(prog(t, t0, 0.9)));
    const tops = [C.ORANGE, C.BLUE, C.LILAC, C.NAVY, '#FF9C85', C.BLUE, C.LILAC, C.NAVY, '#FF9C85'];
    const wraps = { 2: C.ORANGE, 5: C.LILAC, 7: C.BLUE };
    for (let i = 0; i < 9; i++) {
      const a = rot + (i / 9) * Math.PI * 2 - Math.PI / 2, k = pop(t, t0 + 0.1 + i * 0.035, 0.35, 2);
      // a cup, or an open Bible, on the table in front of each one
      if (k > 0) {
        const ix = cx + Math.cos(a) * R * 0.25, iy = cy + Math.sin(a) * R * 0.25;
        ctx.save(); ctx.translate(ix, iy); ctx.rotate(a + Math.PI / 2); ctx.globalAlpha *= clamp(k * 3);
        if (i === 0 || i % 3 === 0) { fillRR(ctx, -13, -8, 26, 16, 2, C.BLUE); ctx.fillStyle = C.WHITE; ctx.fillRect(-11, -6, 10, 12); ctx.fillRect(1, -6, 10, 12); }
        else { circ(ctx, 0, 0, 6.5, '#C9C2FF'); circ(ctx, 0, 0, 3.5, C.WHITE); }
        ctx.restore();
      }
      IL.topPerson(ctx, cx + Math.cos(a) * R * 0.66, cy + Math.sin(a) * R * 0.66, a - Math.PI / 2, R / 150,
        { k, top: tops[i], skin: SKIN[i % 5], wrap: wraps[i] });
    }
  };

  // Zone Family: a home draws itself around a family, hand in hand
  IL.famille = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#FFF5EF'], [1, '#FFE0D3']]);
    const fy = h * 0.86;
    ctx.fillStyle = '#FFD0BF'; ctx.fillRect(0, fy, w, h - fy);
    poly(ctx, [[w * 0.1, fy], [w * 0.1, h * 0.4], [w * 0.5, h * 0.1], [w * 0.9, h * 0.4], [w * 0.9, fy]], ease.inOutCubic(prog(t, t0 - 0.1, 0.6)), C.BLUE, 7);
    const wk = pop(t, t0 + 0.35, 0.35, 2);
    glow(ctx, w / 2, h * 0.3, 40 * clamp(wk), C.ORANGE, 0.35);
    ctx.save(); ctx.translate(w / 2, h * 0.3); ctx.rotate((1 - Math.min(wk, 1)) * 1.6); ctx.fillStyle = C.ORANGE; ctx.fillRect(-11 * wk, -11 * wk, 22 * wk, 22 * wk); ctx.restore();
    const fx = w * 0.32, kx = w * 0.5, mx = w * 0.68, fh = h * 0.5, kh = h * 0.28, mh = h * 0.47;
    const m1 = [(fx + kx) / 2, fy - h * 0.15], m2 = [(kx + mx) / 2, fy - h * 0.15];
    IL.person(ctx, fx, fy, fh, { k: pop(t, t0 + 0.05), outfit: 'shirt', top: C.BLUE, bottom: C.NAVY, skin: SKIN[1], hands: [POSE.down()[0], IL.u(fx, fy, fh, ...m1)], t });
    IL.person(ctx, mx, fy, mh, { k: pop(t, t0 + 0.1), outfit: 'dress', top: C.LILAC, pattern: C.WHITE, skin: SKIN[3], hair: 'wrap', wrap: C.ORANGE, hands: [IL.u(mx, fy, mh, ...m2), POSE.down()[1]], t });
    IL.person(ctx, kx, fy, kh, { k: pop(t, t0 + 0.16), kid: true, top: C.ORANGE, bottom: C.NAVY, skin: SKIN[2], hair: 'puffs', hands: [IL.u(kx, fy, kh, ...m1), IL.u(kx, fy, kh, ...m2)], t });
  };

  // Friday: praying together at night, hands joined, then lifted
  IL.priere = (ctx, w, h, t, t0) => {
    const g = sky(ctx, w, h, [[0, '#2414D2'], [1, '#0D0838']]);
    IL.stars(ctx, w, h, t, 16, 51, 0.5);
    IL.moon(ctx, w * 0.84, h * 0.15, 15, g);
    glow(ctx, w / 2, h * 0.6, w * 0.66, '#FFFFFF', 0.6 * ease.outCubic(prog(t, t0 - 0.1, 0.6)));
    const fy = h * 0.93, ph = h * 0.5, xs = [0.17, 0.39, 0.61, 0.83].map((f) => w * f);
    const up = ease.inOutCubic(prog(t, t0 + 0.45, 0.55));
    const jy = lerp(fy - ph * 0.37, fy - ph * 1.1, up);
    const ppl = [
      { top: C.WHITE, skin: SKIN[2], bottom: C.NAVY },
      { outfit: 'dress', top: C.ORANGE, pattern: '#FFD3C7', skin: SKIN[4], hair: 'wrap', wrap: C.BLUE },
      { outfit: 'shirt', top: C.BLUE, skin: SKIN[0], hair: 'bald', bottom: C.NAVY },
      { outfit: 'dress', top: C.LILAC, skin: SKIN[3], hair: 'afro' },
    ];
    ppl.forEach((p, i) => {
      const x = xs[i];
      const left = i > 0 ? IL.u(x, fy, ph, (xs[i - 1] + x) / 2, jy) : mixPt([-48, -108], [-82, -345], up);
      const right = i < 3 ? IL.u(x, fy, ph, (xs[i + 1] + x) / 2, jy) : mixPt([48, -108], [82, -345], up);
      IL.person(ctx, x, fy, ph, Object.assign({ k: pop(t, t0 + 0.05 + i * 0.05), hands: [left, right], bow: up < 0.5, t }, p));
    });
  };

  // Zone Digital: the app, every day
  IL.digital = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#F2F0FF'], [1, '#D8D2FF']]);
    circ(ctx, w / 2, h * 0.56, w * 0.36 * clamp(pop(t, t0, 0.5, 1.4)), 'rgba(255,255,255,0.75)');
    const k = pop(t, t0, 0.55, 1.4), pw = Math.min(w, h) * 0.38, phh = pw * 2;
    ctx.save(); ctx.translate(w / 2, h * 0.58 + (1 - k) * h * 0.55); ctx.rotate((1 - k) * -0.35 + Math.sin(t * 1.6) * 0.03);
    fillRR(ctx, -pw / 2, -phh / 2, pw, phh, pw * 0.17, C.NAVY);
    const sx = -pw / 2 + 7, sy = -phh / 2 + 7, sw = pw - 14, sh = phh - 14;
    fillRR(ctx, sx, sy, sw, sh, pw * 0.12, C.WHITE);
    ctx.save(); rr(ctx, sx, sy, sw, sh, pw * 0.12); ctx.clip();
    ctx.fillStyle = C.BLUE; ctx.fillRect(sx, sy, sw, sh * 0.2);
    IL.symbol(ctx, sx + sw * 0.16, sy + sh * 0.115, sh * 0.07, C.WHITE, C.ORANGE);
    const ns = Math.min(sh * 0.055, (sw * 0.6) / (G.measure(ctx, 'ZONE 242', 100, MONT, 900) / 100));
    text(ctx, 'ZONE 242', sx + sw * 0.3, sy + sh * 0.115, ns, C.WHITE, { weight: 900, align: 'left' });
    [[0.25, 0.17, 'verse'], [0.46, 0.22, 'video'], [0.72, 0.09, 'row'], [0.84, 0.09, 'row']].forEach(([fy, fh, kind], i) => {
      const q = ease.outCubic(prog(t, t0 + 0.22 + i * 0.08, 0.35));
      if (q <= 0) return;
      ctx.save(); ctx.globalAlpha *= q; ctx.translate((1 - q) * sw * 0.6, 0);
      const x = sx + sw * 0.08, y = sy + sh * fy, cw = sw * 0.84, ch = sh * fh;
      if (kind === 'verse') {
        fillRR(ctx, x, y, cw, ch, 6, C.MIST);
        [0.82, 0.62, 0.7].forEach((f, j) => fillRR(ctx, x + cw * 0.1, y + ch * (0.24 + j * 0.24), cw * 0.8 * f, ch * 0.12, 2, j ? '#B9B2F5' : C.BLUE));
      } else if (kind === 'video') {
        fillRR(ctx, x, y, cw, ch, 6, C.BLUE);
        tri(ctx, [x + cw / 2 - 7, y + ch / 2 - 9], [x + cw / 2 - 7, y + ch / 2 + 9], [x + cw / 2 + 10, y + ch / 2], C.WHITE);
      } else {
        circ(ctx, x + ch * 0.5, y + ch * 0.5, ch * 0.42, i === 2 ? C.ORANGE : C.LILAC);
        fillRR(ctx, x + ch * 1.2, y + ch * 0.22, cw * 0.55, ch * 0.2, 2, '#C9C2FF');
        fillRR(ctx, x + ch * 1.2, y + ch * 0.58, cw * 0.38, ch * 0.18, 2, '#E3DFFF');
      }
      ctx.restore();
    });
    ctx.restore();
    fillRR(ctx, -pw * 0.14, -phh / 2 + 10, pw * 0.28, 6, 3, C.NAVY);
    ctx.restore();
    // notifications float out of it
    [[0.03, 0.22, 0.5, C.ORANGE], [0.67, 0.4, 0.66, C.BLUE]].forEach(([fx, fy, d, dot], i) => {
      const q = pop(t, t0 + d, 0.35, 2);
      if (q <= 0) return;
      const bw = w * 0.3, bh = h * 0.11;
      ctx.save(); ctx.translate(w * fx + bw / 2, h * fy + bh / 2 + Math.sin(t * 2 + i) * 3); ctx.scale(q, q);
      fillRR(ctx, -bw / 2 + 2, -bh / 2 + 4, bw, bh, bh * 0.3, 'rgba(13,8,56,0.12)');
      fillRR(ctx, -bw / 2, -bh / 2, bw, bh, bh * 0.3, C.WHITE);
      circ(ctx, -bw / 2 + bh * 0.5, 0, bh * 0.22, dot);
      fillRR(ctx, -bw / 2 + bh * 0.95, -bh * 0.2, bw * 0.5, bh * 0.15, 2, '#C9C2FF');
      fillRR(ctx, -bw / 2 + bh * 0.95, bh * 0.07, bw * 0.34, bh * 0.13, 2, '#E3DFFF');
      ctx.restore();
    });
  };

  // ======================= THE COMMUNITIES =======================
  // a group standing together in front of a huge letter
  function groupShot(ctx, w, h, t, t0, letter, people) {
    sky(ctx, w, h, [[0, '#F5F3FF'], [1, '#D7D1FF']]);
    const lk = ease.outCubic(prog(t, t0 - 0.1, 0.6));
    G.text(ctx, letter, w / 2, h * 1.03 + (1 - lk) * 80, { size: h * 1.06, fam: MONT, weight: 900, color: '#C9C2FF', align: 'center', baseline: 'alphabetic', alpha: lk });
    ell(ctx, w / 2, h * 0.96, w * 0.42, 14, 'rgba(25,0,207,0.08)');
    const order = people.map((p, i) => i).sort((a, b) => people[a].row - people[b].row);
    order.forEach((i, n) => {
      const p = people[i], front = p.row === 1;
      IL.person(ctx, w / 2 + p.dx * w, front ? h * 0.97 : h * 0.87, front ? h * 0.8 : h * 0.72,
        Object.assign({ k: pop(t, t0 + 0.08 + n * 0.06, 0.42), t, ph: i * 1.3 }, p));
    });
  }
  IL.men = (ctx, w, h, t, t0) => groupShot(ctx, w, h, t, t0, 'M', [
    { dx: -0.3, row: 1, outfit: 'suit', top: C.NAVY, bottom: C.NAVY, tie: C.ORANGE, skin: SKIN[1], pose: 'pocket' },
    { dx: -0.15, row: 0, outfit: 'shirt', top: C.BLUE, bottom: C.NAVY, skin: SKIN[3], hair: 'bald' },
    { dx: 0, row: 1, outfit: 'kaftan', top: C.ORANGE, bottom: C.ORANGE, trim: C.WHITE, skin: SKIN[0], pose: 'cross' },
    { dx: 0.15, row: 0, outfit: 'hoodie', top: C.NAVY, bottom: C.DENIM, hair: 'cap', capCol: C.BLUE, skin: SKIN[2] },
    { dx: 0.3, row: 1, top: C.LILAC, bottom: C.DENIM, skin: SKIN[4], pose: 'hips' },
  ]);
  IL.women = (ctx, w, h, t, t0) => groupShot(ctx, w, h, t, t0, 'W', [
    { dx: -0.3, row: 1, outfit: 'dress', top: C.BLUE, pattern: C.WHITE, hair: 'wrap', wrap: C.ORANGE, skin: SKIN[2], pose: 'hold', item: 'book', bookCol: C.ORANGE },
    { dx: -0.15, row: 0, outfit: 'suit', top: C.NAVY, bottom: C.NAVY, tie: false, hair: 'long', skin: SKIN[4] },
    { dx: 0, row: 1, outfit: 'dress', top: C.ORANGE, pattern: '#FFD3C7', hair: 'afro', skin: SKIN[1], pose: 'hips' },
    { dx: 0.15, row: 0, top: C.LILAC, bottom: C.DENIM, hair: 'bun', skin: SKIN[3] },
    { dx: 0.3, row: 1, outfit: 'dress', top: C.NAVY, pattern: C.ORANGE, hair: 'long', skin: SKIN[0], pose: 'wave' },
  ]);

  // the couples' gala: a dance under the string lights
  IL.gala = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#26119F'], [1, '#0D0838']]);
    glow(ctx, w / 2, h * 0.62, h * 0.9, '#FFFFFF', 0.3);
    for (let i = 0; i < 12; i++) circ(ctx, U.hash(81, i) * w, U.hash(82, i) * h * 0.75, 6 + U.hash(83, i) * 12, i % 3 ? 'rgba(255,255,255,0.07)' : 'rgba(255,90,54,0.14)');
    [0, 1].forEach((s) => {
      const y0 = h * (0.08 + s * 0.07), sag = 34 - s * 8, yAt = (x) => y0 + sag * (1 - Math.pow((x - w / 2) / (w / 2), 2));
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let x = 0; x <= w; x += 10) (x ? ctx.lineTo(x, yAt(x)) : ctx.moveTo(x, yAt(x)));
      ctx.stroke();
      for (let j = 0, x = 16 + s * 21; x < w; j++, x += 42) {
        const q = clamp((t - t0 - j * 0.02) / 0.2), a = 0.65 + 0.35 * Math.sin(t * 3 + j * 1.7 + s);
        if (q <= 0) continue;
        const col = (j + s) % 2 ? C.ORANGE : '#FFE9E2';
        glow(ctx, x, yAt(x) + 6, 16 * q, col, 0.45 * a);
        circ(ctx, x, yAt(x) + 6, 4.5 * q, col);
      }
    });
    ell(ctx, w / 2, h * 0.95, w * 0.26, 12, 'rgba(255,255,255,0.1)');
    const fy = h * 0.95, mx = w / 2 - 40, wx = w / 2 + 38, mh = h * 0.8, wh = h * 0.76;
    const meet = [w / 2 + 4, fy - wh * 1.06], sway = Math.sin(t * 2.4) * 0.045;
    IL.person(ctx, mx, fy, mh, { k: pop(t, t0 + 0.05), outfit: 'suit', top: C.WHITE, bottom: C.NAVY, bowtie: C.ORANGE, skin: SKIN[1], hands: [[-40, -128], IL.u(mx, fy, mh, ...meet)], t });
    IL.person(ctx, wx, fy, wh, { k: pop(t, t0 + 0.12), outfit: 'gown', top: C.ORANGE, flare: 66 + 10 * Math.sin(t * 4.8), lean: sway, skin: SKIN[3], hair: 'bun', hands: [IL.u(wx, fy, wh, ...meet), [72, -150]], t });
    for (let i = 0; i < 6; i++) {
      const a = 0.5 + 0.5 * Math.sin(t * 4 + i * 2), x = w * (0.2 + U.hash(84, i) * 0.6), y = h * (0.25 + U.hash(85, i) * 0.4), s = 5 * a;
      if (prog(t, t0 + 0.3, 0.3) <= 0) continue;
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.4, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.4, y); ctx.closePath(); ctx.fill();
    }
  };

  // singles: people meeting, talking, laughing
  function bubble(ctx, x, y, bw, bh, col, k, kind, t, tailDx = -0.25) {
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    fillRR(ctx, -bw / 2, -bh / 2, bw, bh, bh * 0.45, col);
    tri(ctx, [bw * tailDx - 8, bh / 2 - 2], [bw * tailDx + 8, bh / 2 - 2], [bw * tailDx - 10, bh / 2 + 12], col);
    const fg = col === C.WHITE ? C.BLUE : C.WHITE;
    if (kind === 'dots') for (let i = 0; i < 3; i++) circ(ctx, (i - 1) * bh * 0.38, -Math.max(0, Math.sin(t * 8 - i)) * 3, bh * 0.12, fg);
    else { fillRR(ctx, -bw * 0.32, -bh * 0.2, bw * 0.64, bh * 0.14, 2, fg); fillRR(ctx, -bw * 0.32, bh * 0.06, bw * 0.4, bh * 0.14, 2, fg); }
    ctx.restore();
  }
  IL.singles = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#FFF6F2'], [1, '#FFDCCF']]);
    for (let i = 0; i < 8; i++) circ(ctx, U.hash(91, i) * w, U.hash(92, i) * h * 0.6, 10 + U.hash(93, i) * 22, 'rgba(140,130,245,0.13)');
    ell(ctx, w / 2, h * 0.96, w * 0.44, 12, 'rgba(255,90,54,0.1)');
    const fy = h * 0.95, ph = h * 0.78, tx = w * 0.31;
    const tk = pop(t, t0, 0.4);
    if (tk > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(tk * 3);
      fillRR(ctx, tx - 3, h * 0.62, 6, fy - h * 0.62, 3, C.NAVY); ell(ctx, tx, fy - 2, 22, 5, C.NAVY); ell(ctx, tx, h * 0.62, 46, 9, C.NAVY);
      [-18, 16].forEach((dx) => { fillRR(ctx, tx + dx - 7, h * 0.62 - 20, 14, 18, 3, C.WHITE); ctx.fillStyle = C.ORANGE; ctx.fillRect(tx + dx - 7, h * 0.62 - 14, 14, 5); });
      ctx.restore();
    }
    IL.person(ctx, w * 0.15, fy, ph, { k: pop(t, t0 + 0.05), top: C.BLUE, bottom: C.NAVY, skin: SKIN[2], pose: 'talk', ph: 0, t });
    IL.person(ctx, w * 0.45, fy, ph * 0.95, { k: pop(t, t0 + 0.1), outfit: 'dress', top: C.ORANGE, pattern: '#FFD3C7', hair: 'wrap', wrap: C.BLUE, skin: SKIN[4], hands: [[-48, -108], [44, -198]], item: 'cup', t });
    IL.person(ctx, w * 0.68, fy, ph, { k: pop(t, t0 + 0.15), outfit: 'hoodie', top: C.LILAC, bottom: C.DENIM, hair: 'cap', capCol: C.NAVY, skin: SKIN[0], pose: 'pocket', lean: -0.03 + 0.025 * Math.sin(t * 5), t });
    IL.person(ctx, w * 0.87, fy, ph * 0.95, { k: pop(t, t0 + 0.2), top: C.NAVY, bottom: C.DENIM, hair: 'afro', skin: SKIN[3], pose: 'talk', flip: true, ph: 2, t });
    bubble(ctx, w * 0.2, h * 0.11, 64, 34, C.BLUE, pop(t, t0 + 0.35, 0.35, 2), 'dots', t);
    bubble(ctx, w * 0.5, h * 0.08, 70, 34, C.WHITE, pop(t, t0 + 0.55, 0.35, 2), 'lines', t);
    bubble(ctx, w * 0.8, h * 0.1, 64, 34, C.ORANGE, pop(t, t0 + 0.75, 0.35, 2), 'lines', t, 0.25);
  };

  // ======================= THE CAMPS =======================
  function pine(ctx, x, y, s, col) {
    for (let i = 0; i < 3; i++) tri(ctx, [x - s * (0.5 - i * 0.1), y - s * i * 0.42], [x + s * (0.5 - i * 0.1), y - s * i * 0.42], [x, y - s * (0.75 + i * 0.42)], col);
    ctx.fillStyle = col; ctx.fillRect(x - s * 0.06, y, s * 0.12, s * 0.2);
  }
  function flame(ctx, x, y, hh, ww, col, sk) {
    ctx.beginPath(); ctx.moveTo(x - ww / 2, y);
    ctx.bezierCurveTo(x - ww / 2, y - hh * 0.45, x + sk - ww * 0.15, y - hh * 0.7, x + sk, y - hh);
    ctx.bezierCurveTo(x + sk + ww * 0.1, y - hh * 0.6, x + ww / 2, y - hh * 0.45, x + ww / 2, y);
    ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  IL.campTeens = (ctx, w, h, t, t0) => {
    const g = sky(ctx, w, h, [[0, '#2918DA'], [1, '#0D0838']]);
    IL.stars(ctx, w, h, t, 34, 61, 0.55);
    IL.moon(ctx, w * 0.9, h * 0.17, 18, g);
    const fy = h * 0.9, fx = w * 0.44, fk = ease.outCubic(prog(t, t0, 0.5));
    glow(ctx, fx, fy - 30, h * 1.0, C.ORANGE, 0.45 * fk);
    [[0.03, 0.5], [0.1, 0.38], [0.97, 0.44]].forEach(([px, s]) => pine(ctx, w * px, fy, h * s, '#0A0560'));
    ctx.fillStyle = '#090447'; ctx.fillRect(0, fy, w, h - fy);
    const tk = pop(t, t0 + 0.1, 0.4);
    if (tk > 0) {
      ctx.save(); ctx.translate(w * 0.8, fy); ctx.scale(tk, tk);
      tri(ctx, [-70, 0], [70, 0], [0, -112], C.ORANGE); tri(ctx, [0, -112], [70, 0], [22, 0], '#D9431F'); tri(ctx, [-20, 0], [20, 0], [0, -62], '#4A1006');
      ctx.restore();
    }
    const ph = h * 0.6;
    IL.person(ctx, w * 0.33, fy - h * 0.06, ph * 0.86, { k: pop(t, t0 + 0.2), top: C.WHITE, bottom: C.NAVY, skin: SKIN[3], hair: 'bun', pose: 'up', t, ph: 1 });
    IL.person(ctx, w * 0.2, fy, ph, { k: pop(t, t0 + 0.12), top: C.LILAC, bottom: C.DENIM, skin: SKIN[2], hair: 'cap', capCol: C.ORANGE, hands: [[-48, -108], [70, -170]], item: 'stick', stickA: 0.25, t });
    IL.person(ctx, w * 0.62, fy, ph, { k: pop(t, t0 + 0.16), top: C.ORANGE, bottom: C.NAVY, skin: SKIN[4], hair: 'puffs', item: 'guitar', hands: [[-14 + 4 * Math.sin(t * 9), -150], [74, -196]], t });
    // the fire, in front of everything
    const fireK = pop(t, t0 + 0.05, 0.4);
    if (fireK > 0) {
      ctx.save(); ctx.translate(fx, fy); ctx.scale(fireK, fireK);
      ctx.save(); ctx.rotate(0.35); fillRR(ctx, -32, -7, 64, 14, 6, '#6B3A1E'); ctx.restore();
      ctx.save(); ctx.rotate(-0.35); fillRR(ctx, -32, -7, 64, 14, 6, '#7E4524'); ctx.restore();
      const fl = (n) => 1 + 0.16 * Math.sin(t * 13 + n) * Math.sin(t * 7.3 + n * 2);
      flame(ctx, 0, -4, 70 * fl(0), 46, C.ORANGE, Math.sin(t * 9) * 7);
      flame(ctx, 0, -4, 48 * fl(1), 32, '#FF9A6B', Math.sin(t * 11 + 1) * 5);
      flame(ctx, 0, -4, 26 * fl(2), 18, '#FFE6DD', Math.sin(t * 12 + 2) * 3);
      ctx.restore();
      for (let i = 0; i < 7; i++) {
        const q = (t * 0.7 + U.hash(66, i)) % 1, sx = fx + Math.sin(t * 3 + i * 2) * 14 + (U.hash(67, i) - 0.5) * 30, sy = fy - 40 - q * h * 0.5;
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * 4 + i); ctx.globalAlpha *= (1 - q) * fireK; ctx.fillStyle = i % 2 ? C.ORANGE : '#FFD3C7'; ctx.fillRect(-2.5, -2.5, 5, 5); ctx.restore();
      }
    }
    IL.badge(ctx, 18, 16, '11–15 ANS', pop(t, t0 + 0.3, 0.35, 2));
  };
  IL.campYouth = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#6E60F0'], [0.6, '#C8B9FF'], [1, '#FFD0BF']]);
    const sk = ease.outCubic(prog(t, t0 - 0.1, 0.8));
    glow(ctx, w * 0.24, h * (0.75 - 0.15 * sk), h * 0.6, '#FFFFFF', 0.7);
    circ(ctx, w * 0.24, h * (0.75 - 0.15 * sk), 30, '#FFFFFF');
    shape(ctx, [[0, h * 0.76], [w * 0.12, h * 0.5], [w * 0.25, h * 0.66], [w * 0.38, h * 0.44], [w * 0.5, h * 0.6], [w * 0.78, h * 0.4], [w, h * 0.62], [w, h], [0, h]], '#A79DFF');
    const top = [w * 0.62, h * 0.26], ridge = (x) => h - ((x - w * 0.18) / (top[0] - w * 0.18)) * (h - top[1]);
    shape(ctx, [[w * 0.18, h], top, [w * 1.02, h]], C.BLUE);
    shape(ctx, [[w * 0.74, h], [w * 0.9, h * 0.55], [w * 1.05, h]], '#12078F');
    shape(ctx, [top, [top[0] + 50, top[1] + 44], [top[0] + 28, top[1] + 34], [top[0] + 12, top[1] + 46], [top[0] - 6, top[1] + 34], [top[0] - 26, top[1] + 46], [top[0] - 55, top[1] + 44]], C.WHITE);
    poly(ctx, [[w * 0.3, h], [w * 0.42, h * 0.9], [w * 0.36, h * 0.8], [w * 0.345, ridge(w * 0.345) + 2]], ease.inOutCubic(prog(t, t0, 0.8)), 'rgba(255,255,255,0.75)', 3, [7, 8]);
    // the flag climbs the pole on the summit
    const fk = ease.outCubic(prog(t, t0 + 0.35, 0.6));
    ctx.strokeStyle = C.WHITE; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(top[0], top[1] + 2); ctx.lineTo(top[0], top[1] - 66); ctx.stroke();
    if (fk > 0) {
      const py = top[1] - 66 + (1 - fk) * 40, pts = [];
      for (let i = 0; i <= 10; i++) pts.push([top[0] + i * 5.5, py + Math.sin(t * 7 - i * 0.6) * 3 * (i / 10)]);
      for (let i = 10; i >= 0; i--) pts.push([top[0] + i * 5.5, py + 28 + Math.sin(t * 7 - i * 0.6) * 3 * (i / 10)]);
      shape(ctx, pts, C.ORANGE);
    }
    [[0.37, C.ORANGE, SKIN[1], 'short', 0], [0.42, C.WHITE, SKIN[3], 'wrap', 1], [0.47, C.LILAC, SKIN[0], 'afro', 2]].forEach(([fx2, col, sk2, hair, i]) => {
      const x = w * fx2;
      IL.person(ctx, x, ridge(x) + 3, h * 0.32, { k: pop(t, t0 + 0.2 + i * 0.07), top: col, bottom: C.NAVY, skin: sk2, hair, wrap: C.NAVY, pose: i === 1 ? 'upOne' : 'up', t, ph: i });
    });
    IL.badge(ctx, 18, 16, '16 ANS +', pop(t, t0 + 0.3, 0.35, 2));
  };

  // ======================= SIGNATURE PROGRAMMES =======================
  // Chambre Haute: the light in the upper room
  IL.chambre = (ctx, w, h, t, t0) => {
    const g = sky(ctx, w, h, [[0, '#2616D8'], [1, '#0D0838']]);
    IL.stars(ctx, w, h, t, 22, 71, 0.45);
    IL.moon(ctx, w * 0.12, h * 0.16, 12, g);
    const [sx, sy, ss] = IL.chambre.spot, wx = w * sx, wy = h * sy, lk = ease.outCubic(prog(t, t0, 0.6));
    ctx.save(); ctx.translate(wx, wy); ctx.rotate(t * 0.25);
    for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.fillStyle = `rgba(255,214,203,${0.1 * lk})`; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(h * 0.9, -14); ctx.lineTo(h * 0.9, 14); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    glow(ctx, wx, wy, h * 0.6, C.ORANGE, 0.5 * lk);
    const x0 = w * 0.32, x1 = w * 0.68, eave = h * 0.3, fy = h * 0.92;
    shape(ctx, [[x0 - 14, eave], [w / 2, h * 0.12], [x1 + 14, eave]], C.NIGHT);
    ctx.fillStyle = C.NIGHT; ctx.fillRect(x0, eave, x1 - x0, fy - eave);
    fillRR(ctx, wx - ss * 0.75, wy - ss * 0.75, ss * 1.5, ss * 1.5, 4, '#1E1478');
    fillRR(ctx, w / 2 - 14, fy - h * 0.2, 28, h * 0.2, 4, '#241A8C');
    [-1, 1].forEach((sd) => fillRR(ctx, w / 2 + sd * 40 - 11, fy - h * 0.18, 22, 22, 3, '#241A8C'));
    const steps = [[x1 + 60, fy]];
    for (let i = 0; i < 6; i++) { const [px, py] = steps[steps.length - 1]; steps.push([px, py - 14], [px - 10, py - 14]); }
    poly(ctx, steps, 1, '#3A2AE0', 3);
    ctx.fillStyle = '#080430'; ctx.fillRect(0, fy, w, h - fy);
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(wx - ss / 2, wy - ss / 2, ss, ss); }
  };
  IL.chambre.spot = [0.5, 0.44, 40];

  // Zone Out: the Zone outside the walls, memories together at the beach
  IL.zoneOut = (ctx, w, h, t, t0) => {
    sky(ctx, w, h * 0.56, [[0, '#FFC9B8'], [1, '#FFF0EA']]);
    const [sx, sy, ss] = IL.zoneOut.spot;
    ctx.fillStyle = C.BLUE; ctx.fillRect(0, h * 0.56, w, h * 0.2);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(255,90,54,0.55)'; const rw = ss * (1.4 - i * 0.22); ctx.fillRect(w * sx - rw / 2, h * (0.585 + i * 0.03), rw, 3); }
    for (let i = 0; i < 9; i++) { const x = ((U.hash(101, i) * w + t * 18) % (w + 40)) - 20, y = h * (0.6 + U.hash(102, i) * 0.13); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(x, y, 18, 2.5); }
    ctx.fillStyle = C.SAND; ctx.fillRect(0, h * 0.76, w, h * 0.24);
    // a palm tree
    const px = w * 0.9, py = h * 0.3, pk = pop(t, t0 + 0.05, 0.45);
    if (pk > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(pk * 3);
      ctx.strokeStyle = '#120A5C'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(w * 0.96, h * 1.02); ctx.quadraticCurveTo(w * 0.94, h * 0.6, px, py); ctx.stroke();
      ctx.translate(px, py); ctx.rotate(Math.sin(t * 1.5) * 0.06); ctx.scale(pk, pk);
      [-2.7, -2.1, -1.35, -0.6, 0.05, 0.6].forEach((a) => { ctx.save(); ctx.rotate(a); ell(ctx, 30, 0, 32, 8, '#120A5C', 0.25); ctx.restore(); });
      ctx.restore();
    }
    const fy = h * 0.98, ph = h * 0.62, xs = [0.36, 0.5, 0.64].map((f) => w * f);
    IL.person(ctx, xs[0], fy, ph * 0.96, { k: pop(t, t0 + 0.1), top: C.LILAC, bottom: C.NAVY, skin: SKIN[2], pose: 'upOne', t });
    IL.person(ctx, xs[1], fy, ph * 0.92, { k: pop(t, t0 + 0.15), outfit: 'dress', top: C.BLUE, pattern: C.WHITE, hair: 'wrap', wrap: C.ORANGE, skin: SKIN[4], pose: 'hips', t });
    IL.person(ctx, xs[2], fy, ph, { k: pop(t, t0 + 0.2), top: C.NAVY, bottom: C.DENIM, hair: 'cap', capCol: C.BLUE, skin: SKIN[0], pose: 'selfie', item: 'phone', t });
    const fl = prog(t, t0 + 0.6, 0.35);
    if (fl > 0 && fl < 1) glow(ctx, xs[2] + 104 * ph / 300, fy - 334 * ph / 300, 60 * (0.4 + fl), '#FFFFFF', 1 - fl);
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(w * sx - ss / 2, h * sy - ss / 2, ss, ss); }
  };
  IL.zoneOut.spot = [0.2, 0.46, 34];

  // Zone Serves: the Zone goes out to serve the city
  IL.serves = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#F5F3FF'], [1, '#E2DDFF']]);
    [[0.02, 0.4, 0.12], [0.15, 0.6, 0.1], [0.27, 0.32, 0.14], [0.44, 0.52, 0.09], [0.56, 0.7, 0.12], [0.7, 0.42, 0.11], [0.83, 0.58, 0.15]].forEach(([fx, fh, fw], i) => {
      const bx = w * fx, bw = w * fw, bh = h * fh, by = h * 0.9 - bh;
      ctx.fillStyle = '#D6D0FF'; ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (let yy = by + 10; yy < h * 0.86; yy += 16) for (let xx = bx + 7; xx < bx + bw - 8; xx += 13) if (U.hash(111, i * 97 + xx + yy) > 0.35) ctx.fillRect(xx, yy, 5, 7);
    });
    ctx.fillStyle = '#CBC3FF'; ctx.fillRect(0, h * 0.9, w, h * 0.1);
    for (let i = 0; i < 3; i++) {
      const bk = pop(t, t0 + 0.05 + i * 0.05, 0.35, 2);
      if (bk <= 0) continue;
      const bx = w * 0.1, by = h * 0.9 - (i + 1) * 26;
      ctx.save(); ctx.translate(bx, by + 13); ctx.scale(bk, bk);
      fillRR(ctx, -20 + (i % 2) * 4, -13, 40, 26, 3, '#FFB8A6'); ctx.fillStyle = C.ORANGE; ctx.fillRect(-3 + (i % 2) * 4, -13, 6, 26);
      ctx.restore();
    }
    const [sx, sy, ss] = IL.serves.spot, bx = w * sx, by = h * sy, fy = h * 0.95, ph = h * 0.64;
    const ax = w * 0.32, rx = w * 0.69, kx = w * 0.84;
    IL.person(ctx, ax, fy, ph, { k: pop(t, t0 + 0.08), top: C.BLUE, bottom: C.NAVY, skin: SKIN[1], hair: 'cap', capCol: C.ORANGE, badge: true, hands: [[-48, -108], IL.u(ax, fy, ph, bx - ss / 2, by + 4)], t });
    IL.person(ctx, rx, fy, ph * 0.94, { k: pop(t, t0 + 0.14), outfit: 'dress', top: C.LILAC, pattern: C.WHITE, hair: 'wrap', wrap: C.NAVY, skin: SKIN[3], hands: [IL.u(rx, fy, ph * 0.94, bx + ss / 2, by + 4), [48, -112]], t });
    IL.person(ctx, kx, fy, ph * 0.5, { k: pop(t, t0 + 0.2), kid: true, top: C.ORANGE, bottom: C.NAVY, skin: SKIN[2], hair: 'puffs', pose: 'wave', t });
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(bx - ss / 2, by - ss / 2, ss, ss); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(bx - 3, by - ss / 2, 6, ss); }
  };
  IL.serves.spot = [0.5, 0.56, 34];

  // Serve Day: a team, and one empty place waiting for someone
  IL.serveDay = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#F2F0FF'], [1, '#DCD6FF']]);
    ctx.fillStyle = '#D0C9FF'; ctx.fillRect(0, h * 0.9, w, h * 0.1);
    const fy = h * 0.93, ph = h * 0.62, xs = [0.13, 0.37, 0.6, 0.85].map((f) => w * f);
    xs.forEach((x, i) => ell(ctx, x, fy, 34, 7, i === 3 ? 'rgba(255,90,54,0.3)' : 'rgba(25,0,207,0.1)'));
    // a camera on its tripod
    const ck = pop(t, t0 + 0.05, 0.4);
    if (ck > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(ck * 3);
      const cx = xs[0] + 40, cy = fy - ph * 0.62;
      ctx.strokeStyle = C.NAVY; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 16, fy); ctx.moveTo(cx, cy); ctx.lineTo(cx + 16, fy); ctx.moveTo(cx, cy); ctx.lineTo(cx, fy); ctx.stroke();
      fillRR(ctx, cx - 20, cy - 26, 40, 26, 4, C.NAVY); circ(ctx, cx + 20, cy - 13, 9, '#3A2FB8'); circ(ctx, cx + 20, cy - 13, 4, '#8C82F5');
      ctx.restore();
    }
    IL.person(ctx, xs[0], fy, ph, { k: pop(t, t0 + 0.08), top: C.BLUE, bottom: C.NAVY, skin: SKIN[2], hands: [[-48, -108], IL.u(xs[0], fy, ph, xs[0] + 22, fy - ph * 0.7)], t });
    IL.person(ctx, xs[1], fy, ph * 0.95, { k: pop(t, t0 + 0.12), top: C.LILAC, bottom: C.DENIM, hair: 'long', skin: SKIN[4], phones: C.NAVY, headset: true, pose: 'hold', item: 'tablet', t });
    IL.person(ctx, xs[2], fy, ph, { k: pop(t, t0 + 0.16), top: C.ORANGE, bottom: C.NAVY, skin: SKIN[0], badge: true, pose: 'wave', t });
    // the empty place: a ghost of someone, waiting
    IL.person(ctx, xs[3], fy, ph * 0.97, { k: pop(t, t0 + 0.2), sil: '#CCC5FF', t });
    const [sx, sy, ss] = IL.serveDay.spot;
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(w * sx - ss / 2, h * sy - ss / 2, ss, ss); }
  };
  IL.serveDay.spot = [0.85, 0.57, 30];

  // ======================= THE BIG GATHERINGS =======================
  function crowd(ctx, w, h, t, t0, rows) {
    rows.forEach(({ n, y, hh, col }, r) => {
      for (let i = 0; i < n; i++) {
        const x = w * ((i + 0.5 + (r % 2) * 0.5) / n) - w * 0.04, p = t * 2 + i + r;
        const lift = ease.inOutCubic(prog(t, t0 + 0.25 + U.hash(121 + r, i) * 0.4, 0.45));
        const hands = IL.mix(POSE.down(p), (i + r) % 3 === 1 ? POSE.upOne(p) : POSE.up(p), lift * (U.hash(131 + r, i) > 0.2 ? 1 : 0));
        IL.person(ctx, x, y, hh * (0.94 + U.hash(141 + r, i) * 0.12), { k: pop(t, t0 + 0.04 * r + U.hash(151 + r, i) * 0.12, 0.4), sil: col, hands, hair: U.hash(161 + r, i) > 0.7 ? 'wrap' : 'short', t });
      }
    });
  }
  // Puissance & Guérison: an arena, a stage, a crowd lifting its hands
  IL.arena = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#2B15E8'], [1, '#0D0838']]);
    glow(ctx, w / 2, h * 0.5, w * 0.55, '#FFFFFF', 0.38);
    const sk = pop(t, t0, 0.45, 1.4);
    if (sk > 0) {
      ctx.save(); ctx.translate(w / 2, h * 0.23); ctx.scale(sk, sk);
      fillRR(ctx, -w * 0.2, -h * 0.15, w * 0.4, h * 0.3, 10, '#3622FF');
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 3; rr(ctx, -w * 0.2, -h * 0.15, w * 0.4, h * 0.3, 10); ctx.stroke();
      IL.symbol(ctx, 0, 0, h * 0.17, C.WHITE, C.ORANGE);
      ctx.restore();
    }
    [[0.04, 1.02, -1, 0], [0.96, 1.02, 1, 1.3], [0.22, -0.02, -1, 2.6], [0.78, -0.02, 1, 3.9]].forEach(([fx, fy, sd, p]) => {
      const up = fy > 0.5;
      ctx.save(); ctx.translate(w * fx, h * fy); ctx.rotate((up ? Math.PI : 0) + sd * (0.35 + Math.sin(t * 1.2 + p) * 0.25) * (up ? -1 : 1));
      const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(w * 0.12, h * 1.1); ctx.lineTo(-w * 0.12, h * 1.1); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(w * 0.12, h * 0.52, w * 0.76, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(w * 0.12, h * 0.52 + 7, w * 0.76, h * 0.06);
    IL.person(ctx, w / 2, h * 0.52, h * 0.26, { k: pop(t, t0 + 0.1), outfit: 'suit', top: C.WHITE, bottom: C.NAVY, tie: C.ORANGE, skin: SKIN[0], item: 'mic', hands: [[-84, -350], [12, -258]], t });
    for (let i = 0; i < 10; i++) {
      const q = (t * 0.35 + U.hash(171, i)) % 1, x = w * (0.15 + U.hash(172, i) * 0.7), y = h * (0.55 - q * 0.5);
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); ctx.globalAlpha *= Math.sin(Math.PI * q) * clamp((t - t0) * 3); ctx.fillStyle = i % 3 ? C.WHITE : C.ORANGE; ctx.fillRect(-3, -3, 6, 6); ctx.restore();
    }
    crowd(ctx, w, h, t, t0, [{ n: 11, y: h * 1.0, hh: h * 0.34, col: '#180D80' }, { n: 10, y: h * 1.12, hh: h * 0.42, col: '#100760' }, { n: 8, y: h * 1.28, hh: h * 0.52, col: '#070330' }]);
  };

  // Aigles & Ouvriers: the eagle above, the workers of the Zone celebrated
  const EAGLE = [[0, -0.44], [0.08, -0.38], [0.065, -0.3], [0.16, -0.25], [0.42, -0.37], [0.7, -0.41], [1, -0.35], [0.86, -0.25], [0.96, -0.19],
    [0.8, -0.13], [0.9, -0.06], [0.7, -0.03], [0.78, 0.05], [0.5, 0.01], [0.18, 0.06], [0.12, 0.22], [0.17, 0.36], [0, 0.3]];
  IL.eagle = (ctx, x, y, s, flap, col) => {
    const pts = EAGLE.map(([px, py]) => [px, py - flap * px * px * 0.3]);
    const all = pts.concat(pts.slice(1, -1).reverse().map(([px, py]) => [-px, py]));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    shape(ctx, all, col);
    tri(ctx, [0.05, -0.41], [0.15, -0.38], [0.05, -0.34], C.ORANGE);
    ctx.restore();
  };
  IL.eagles = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#2B15E8'], [1, '#12077A']]);
    const ek = pop(t, t0, 0.5, 1.5), ex = w / 2, ey = h * 0.3;
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(t * 0.2);
    for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.fillStyle = `rgba(255,255,255,${0.06 * clamp(ek)})`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, -26); ctx.lineTo(w, 26); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    if (ek > 0) IL.eagle(ctx, ex, ey + (1 - ek) * 60, w * 0.25 * ek, Math.sin(t * 4.5) * 0.7, C.WHITE);
    glow(ctx, w / 2, h * 0.74, h * 0.5, '#FFFFFF', 0.3);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(w * 0.22, h * 0.86, w * 0.56, 7);
    [[0.37, C.WHITE, SKIN[2], 'wrap', 'upOne', 'dress'], [0.5, C.ORANGE, SKIN[0], 'short', 'up', 'tee'], [0.63, C.LILAC, SKIN[4], 'bald', 'wave', 'shirt']].forEach(([fx, col, sk, hair, pose, outfit], i) => {
      IL.person(ctx, w * fx, h * 0.86, h * (i === 1 ? 0.4 : 0.36), { k: pop(t, t0 + 0.15 + i * 0.06), top: col, outfit, pattern: outfit === 'dress' ? C.LILAC : null, bottom: C.NAVY, skin: sk, hair, wrap: C.ORANGE, pose, medal: true, t, ph: i });
    });
    for (let i = 0; i < 44; i++) {
      const sp = 110 + U.hash(181, i) * 90, y = (U.hash(182, i) * 1.4 - 0.5) * h + (t - t0) * sp, x = U.hash(183, i) * w + Math.sin(t * 3 + i) * 10;
      if (t < t0 || y < -10 || y > h + 10) continue;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 5 * (U.hash(184, i) - 0.5) * 2 + i);
      ctx.fillStyle = [C.ORANGE, C.WHITE, '#FFD3C7', C.LILAC][i % 4]; ctx.fillRect(-5, -2.5, 10, 5); ctx.restore();
    }
  };

  // 242 Business Conference: a speaker, a screen, an audience
  IL.business = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#F5F3FF'], [1, '#DDD7FF']]);
    const scx = w * 0.06, scy = h * 0.07, scw = w * 0.6, sch = h * 0.55, sk = pop(t, t0, 0.45, 1.4);
    if (sk > 0) {
      ctx.save(); ctx.translate(scx + scw / 2, scy + sch / 2); ctx.scale(sk, sk); ctx.translate(-scx - scw / 2, -scy - sch / 2);
      fillRR(ctx, scx, scy, scw, sch, 14, C.BLUE);
      fillRR(ctx, scx + 24, scy + 22, scw * 0.3, 10, 4, 'rgba(255,255,255,0.75)'); fillRR(ctx, scx + 24, scy + 40, scw * 0.18, 8, 4, 'rgba(255,255,255,0.4)');
      const base = scy + sch * 0.88, ch = sch * 0.62, bw = scw * 0.11, tops = [];
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(scx + scw * 0.1, base, scw * 0.8, 3);
      [0.28, 0.44, 0.62, 0.86].forEach((f, i) => {
        const q = clamp(ease.outBack(prog(t, t0 + 0.15 + i * 0.09, 0.4), 1.6), 0, 1.1), bx = scx + scw * (0.16 + i * 0.19), bh = ch * f * q;
        ctx.fillStyle = i === 3 ? C.WHITE : 'rgba(255,255,255,0.78)'; ctx.fillRect(bx, base - bh, bw, bh);
        tops.push([bx + bw / 2, base - ch * f - 22]);
      });
      const lk = ease.inOutCubic(prog(t, t0 + 0.45, 0.5));
      poly(ctx, tops, lk, C.ORANGE, 6);
      if (lk >= 1) { const [ax, ay] = tops[3], [bx2, by2] = tops[2], a = Math.atan2(ay - by2, ax - bx2); ctx.save(); ctx.translate(ax, ay); ctx.rotate(a); tri(ctx, [12, 0], [-8, -10], [-8, 10], C.ORANGE); ctx.restore(); }
      ctx.restore();
    }
    const lx = w * 0.82, fy = h * 0.9;
    IL.person(ctx, lx, fy, h * 0.58, { k: pop(t, t0 + 0.12), outfit: 'suit', top: C.NAVY, bottom: C.NAVY, tie: C.ORANGE, skin: SKIN[1], pose: 'talk', flip: true, t });
    const lk2 = pop(t, t0 + 0.08, 0.4);
    if (lk2 > 0) {
      ctx.save(); ctx.translate(lx, fy); ctx.scale(1, lk2);
      shape(ctx, [[-w * 0.075, -h * 0.34], [w * 0.075, -h * 0.34], [w * 0.06, 0], [-w * 0.06, 0]], '#2E2A5C');
      fillRR(ctx, -w * 0.085, -h * 0.36, w * 0.17, h * 0.035, 4, '#3D3870');
      IL.symbol(ctx, 0, -h * 0.2, h * 0.08, C.WHITE, C.ORANGE);
      ctx.restore();
    }
    const tops2 = [C.BLUE, C.NAVY, C.LILAC, C.ORANGE, C.BLUE, C.NAVY, C.LILAC];
    for (let i = 0; i < 7; i++) {
      IL.person(ctx, w * (0.07 + i * 0.145), h * 1.34, h * 0.62, { k: pop(t, t0 + 0.05 + i * 0.03), back: true, top: tops2[i], hair: i % 3 === 1 ? 'wrap' : 'short', wrap: [C.ORANGE, C.BLUE][i % 2], t });
    }
  };

  // 14 jours · 242 hours: fourteen days crossed off, a ring that fills
  IL.fasting = (ctx, w, h, t, t0) => {
    sky(ctx, w, h, [[0, '#1F10C2'], [1, '#0D0838']]);
    IL.stars(ctx, w, h, t, 26, 191, 0.9);
    const ck = pop(t, t0, 0.45, 1.4), x = w * 0.07, y = h * 0.13, cw = w * 0.45, ch = h * 0.74;
    if (ck > 0) {
      ctx.save(); ctx.translate(x + cw / 2, y + ch / 2); ctx.rotate((1 - Math.min(ck, 1)) * -0.3); ctx.scale(ck, ck); ctx.translate(-x - cw / 2, -y - ch / 2);
      fillRR(ctx, x, y, cw, ch, 18, C.WHITE);
      ctx.save(); rr(ctx, x, y, cw, ch, 18); ctx.clip(); ctx.fillStyle = C.ORANGE; ctx.fillRect(x, y, cw, ch * 0.24); ctx.restore();
      [0.3, 0.7].forEach((f) => fillRR(ctx, x + cw * f - 6, y - 12, 12, 26, 6, C.NAVY));
      text(ctx, 'JANVIER', x + cw / 2, y + ch * 0.13, ch * 0.1, C.WHITE, { weight: 900 });
      const cell = cw * 0.1, gap = cw * 0.025, gx = x + cw * 0.075, gy = y + ch * 0.36;
      for (let i = 0; i < 14; i++) {
        const cx = gx + (i % 7) * (cell + gap), cy = gy + Math.floor(i / 7) * (cell + gap);
        fillRR(ctx, cx, cy, cell, cell, 5, C.MIST);
        const q = pop(t, t0 + 0.12 + i * 0.055, 0.25, 2);
        if (q > 0) {
          ctx.save(); ctx.translate(cx + cell / 2, cy + cell / 2); ctx.scale(Math.min(q, 1.15), Math.min(q, 1.15));
          fillRR(ctx, -cell / 2, -cell / 2, cell, cell, 5, C.ORANGE);
          ctx.strokeStyle = C.WHITE; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath(); ctx.moveTo(-cell * 0.22, 0); ctx.lineTo(-cell * 0.05, cell * 0.17); ctx.lineTo(cell * 0.24, -cell * 0.18); ctx.stroke();
          ctx.restore();
        }
      }
      text(ctx, '14 JOURS', x + cw / 2, y + ch * 0.83, ch * 0.1, C.BLUE, { weight: 900 });
      ctx.restore();
    }
    const rx = w * 0.76, ry = h * 0.5, R = h * 0.3, rk = ease.inOutCubic(prog(t, t0 + 0.1, 0.9));
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(rx, ry, R, 0, Math.PI * 2); ctx.stroke();
    if (rk > 0) { ctx.strokeStyle = C.ORANGE; ctx.beginPath(); ctx.arc(rx, ry, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rk); ctx.stroke(); }
    text(ctx, String(Math.round(242 * rk)), rx, ry - R * 0.08, R * 0.62, C.WHITE, { weight: 900, alpha: clamp((t - t0) * 4) });
    text(ctx, 'HOURS', rx, ry + R * 0.42, R * 0.2, 'rgba(255,255,255,0.74)', { weight: 800, alpha: clamp((t - t0) * 4) });
  };

  globalThis.IL = IL;
})();
