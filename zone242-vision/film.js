// THE FILM — the 2D scenes of the ZONE 242 vision, a pure function of t.
// [0, 8) and [52, 60) are 3D: compose.mjs replaces them with the three.js renders.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { ev, clock, T } = S;
  const { clamp, lerp, ease } = U;
  const W = G.W, H = G.H, SAFE = S.SAFE, WIDE = S.WIDE;

  // ---------- brand ----------
  const BLUE = '#1900CF', ORANGE = '#FF5A36', NAVY = '#0D0838', WHITE = '#FFFFFF', INK = '#14122B';
  const F = 'Mont', MONO = 'PlexMono';
  const cx = SAFE.x + SAFE.w / 2;
  const cy = SAFE.y + SAFE.h / 2;
  const maxW = SAFE.w * 0.94;
  // vertical room is what limits the landscape cut: scale the stacked layouts to fit
  const VS = Math.min(1, SAFE.h / 1180);

  // ---------- small helpers ----------
  const prog = (t, a, d) => clamp((t - a) / d);
  const fit = (ctx, str, size, w = maxW, weight = 900) => {
    const m = G.measure(ctx, str, size, F, weight);
    return m > w ? size * w / m : size;
  };
  function bg(ctx, color) { ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); }

  // a word that lands on its beat: drops in from above-scale, overshoots, settles
  function stamp(ctx, str, x, y, size, t, t0, o = {}) {
    const k = prog(t, t0, 0.24);
    if (k <= 0) return;
    const s = lerp(o.from ?? 1.6, 1, ease.outBack(k, 2.2));
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    if (o.rot) ctx.rotate(o.rot);
    G.text(ctx, str, 0, 0, { size, fam: o.fam ?? F, weight: o.weight ?? 900, color: o.color ?? WHITE,
      align: o.align ?? 'center', baseline: 'middle', alpha: clamp(k * 4) * (o.alpha ?? 1) });
    ctx.restore();
  }
  // a line that rises out of a mask
  function rise(ctx, str, x, y, size, t, t0, o = {}) {
    const k = prog(t, t0, 0.42);
    if (k <= 0) return;
    const w = G.measure(ctx, str, size, o.fam ?? F, o.weight ?? 900) + 40;
    const x0 = o.align === 'left' ? x - 20 : x - w / 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, y - size * 0.75, w, size * 1.5); ctx.clip();
    G.text(ctx, str, x, y + (1 - ease.outExpo(k)) * size * 1.3, { size, fam: o.fam ?? F, weight: o.weight ?? 900,
      color: o.color ?? WHITE, align: o.align ?? 'center', baseline: 'middle', alpha: o.alpha ?? 1 });
    ctx.restore();
  }
  // mono kicker with letter spacing
  function kicker(ctx, str, x, y, t, t0, color = ORANGE, size = 36) {
    const k = prog(t, t0, 0.5);
    if (k <= 0) return;
    ctx.save();
    ctx.letterSpacing = `${lerp(18, 8, ease.outCubic(k))}px`;
    G.text(ctx, str, x, y, { size, fam: MONO, weight: 500, color, align: 'center', baseline: 'middle', alpha: k });
    ctx.restore();
  }
  // the ZONE symbol: four corners + centre. spread 1 = closed, >1 = open
  function symbol(ctx, x, y, size, o = {}) {
    const th = size * 0.127, arm = size * 0.382, c = size * 0.229;
    const spread = o.spread ?? 1, cs = o.center ?? 1;
    ctx.save();
    ctx.translate(x, y);
    if (o.rot) ctx.rotate(o.rot);
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.fillStyle = o.color ?? BLUE;
    const show = o.corners ?? [1, 1, 1, 1];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy], i) => {
      const k = show[i];
      if (k <= 0) return;
      ctx.save();
      ctx.translate(sx * size / 2 * spread, sy * size / 2 * spread);
      ctx.scale(-sx * k, -sy * k);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(arm, 0); ctx.lineTo(arm, th); ctx.lineTo(th, th); ctx.lineTo(th, arm); ctx.lineTo(0, arm);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    if (cs > 0) { ctx.fillStyle = o.centerColor ?? ORANGE; ctx.fillRect(-c / 2 * cs, -c / 2 * cs, c * cs, c * cs); }
    ctx.restore();
  }
  // drifting background squares, a quiet texture that keeps the frame alive
  function drift(ctx, t, color, alpha, seed) {
    ctx.save();
    ctx.fillStyle = color;
    for (let i = 0; i < 26; i++) {
      const r = U.hash(seed, i), r2 = U.hash(seed, i, 2), r3 = U.hash(seed, i, 3);
      const s = 8 + r3 * 26;
      const x = ((r * W + t * (20 + r2 * 40)) % (W + 80)) - 40;
      const y = (r2 * H + Math.sin(t * 0.8 + i) * 30);
      ctx.globalAlpha = alpha * (0.4 + r3 * 0.6);
      ctx.fillRect(x, y, s, s);
    }
    ctx.restore();
  }
  const beatPunch = (t) => 1 + 0.018 * Math.exp(-clock.phase(t) * 7);

  // ---------- scenes ----------
  function vision(ctx, t) {
    bg(ctx, BLUE);
    drift(ctx, t, WHITE, 0.08, 1);
    symbol(ctx, cx, cy, Math.min(W, H) * 0.95, { color: WHITE, alpha: 0.06, center: 0, rot: (t - T(4)) * 0.04 });
    const e = ev.vision;
    const sz = (s) => s * VS;
    kicker(ctx, 'LA VISION', cx, cy - sz(420), t, e.kicker);
    const rows = [
      ['BÂTIR', 120, WHITE, -300], ['À COTONOU', 120, WHITE, -165], ['UNE ÉGLISE DE', 82, WHITE, -40],
      ['MILLIERS', 210, ORANGE, 110], ['DE DISCIPLES', 120, WHITE, 270],
    ];
    rows.forEach(([w, s, c, dy], i) => stamp(ctx, w, cx, cy + sz(dy), fit(ctx, w, sz(s)), t, e.words[i], { color: c }));
  }

  function rooted(ctx, t) {
    bg(ctx, WHITE);
    drift(ctx, t, BLUE, 0.06, 2);
    const e = ev.rooted;
    const blocks = [
      ['PASSIONNÉS', 'DE JÉSUS,', ORANGE],
      ['ENRACINÉS', 'DANS LA PAROLE,', BLUE],
      ['TRANSFORMÉS', 'PAR SA PRÉSENCE.', BLUE],
    ];
    const gap = 250 * VS;
    blocks.forEach(([a, b, c], i) => {
      const y = cy + (i - 1) * gap;
      const sA = fit(ctx, a, 104 * VS), sB = fit(ctx, b, 80 * VS);
      rise(ctx, a, cx, y - 50 * VS, sA, t, e.lines[i], { color: INK });
      rise(ctx, b, cx, y + 45 * VS, sB, t, e.lines[i] + 0.12, { color: c });
    });
    // the hit: an orange bar sweeps under the three lines
    const k = ease.outExpo(prog(t, e.hit, 0.4));
    if (k > 0) { ctx.fillStyle = ORANGE; ctx.fillRect(cx - maxW / 2, cy + gap * 1.5 + 10, maxW * k, 14); ctx.fillRect(cx + maxW / 2 - maxW * k, cy - gap * 1.5 - 70 * VS, maxW * k, 14); }
  }

  function crowd(ctx, t) {
    bg(ctx, WHITE);
    const e = ev.crowd;
    const step = 46, sq = 16;
    const cols = Math.ceil(W / step) + 1, rows = Math.ceil(H / step) + 1;
    // the chosen one: one square near the centre of the frame
    const tx = Math.round(cx / step) * step, ty = Math.round((cy + 60 * VS) / step) * step;
    const lock = ease.outBack(prog(t, e.lock, 0.35), 1.6);
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const x = i * step, y = j * step;
      const d = Math.hypot(x - tx, y - ty);
      const k = ease.outBack(prog(t, e.fill + d / 2200, 0.3), 2);
      if (k <= 0) continue;
      const me = x === tx && y === ty;
      ctx.globalAlpha = me ? 1 : lerp(0.9, 0.22, prog(t, e.lock, 0.4));
      ctx.fillStyle = me && t >= e.lock ? ORANGE : BLUE;
      const s = sq * k * (me ? lerp(1, 2.6, lock) : 1) * (1 + 0.15 * Math.exp(-clock.phase(t) * 6) * (t < e.lock ? 1 : 0));
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    // the viewfinder finds them
    if (t >= e.lock - 0.35) {
      const k = ease.outExpo(prog(t, e.lock - 0.35, 0.5));
      symbol(ctx, tx, ty, lerp(900, 170, k), { color: BLUE, center: 0, alpha: clamp(k * 3) });
    }
    // white plates behind the words so they read over the grid
    const plate = (y, h) => { ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillRect(0, y - h / 2, W, h); };
    if (t >= e.text1) plate(cy - 330 * VS, 150 * VS);
    if (t >= e.text2) plate(cy + 400 * VS, 150 * VS);
    rise(ctx, 'UNE GRANDE ÉGLISE,', cx, cy - 330 * VS, fit(ctx, 'UNE GRANDE ÉGLISE,', 84 * VS), t, e.text1, { color: INK });
    stamp(ctx, 'OÙ CHACUN EST CONNU.', cx, cy + 400 * VS, fit(ctx, 'OÙ CHACUN EST CONNU.', 84 * VS), t, e.text2, { color: ORANGE });
  }

  function acts(ctx, t) {
    bg(ctx, NAVY);
    drift(ctx, t, WHITE, 0.05, 4);
    const e = ev.acts;
    const size = (WIDE ? 380 : 360) * VS;
    const sy = cy - 20 * VS;
    kicker(ctx, 'ACTES 2:42', cx, cy - 470 * VS, t, e.ref, ORANGE, 40);
    const ck = e.corners.map((c) => ease.outBack(prog(t, c, 0.3), 2));
    symbol(ctx, cx, sy, size, { color: WHITE, corners: ck, center: ease.outBack(prog(t, e.center, 0.35), 2.4) });
    // labels sit outside each corner
    // two-line labels beside each corner, aligned away from the symbol
    const labels = [['LA', 'PAROLE'], ['LA', 'COMMUNION'], ['LE PAIN', 'PARTAGÉ'], ['LA', 'PRIÈRE']];
    const lx = size / 2 + 26, ly = size * 0.33;
    const room = (W - size) / 2 - 40 - (WIDE ? 0 : 70);
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy2], i) => {
      const ls = Math.min(...labels[i].map((w) => fit(ctx, w, 44 * VS, room, 800)));
      const align = sx < 0 ? 'right' : 'left';
      labels[i].forEach((w, j) => stamp(ctx, w, cx + sx * lx, sy + sy2 * ly + (j - 0.5) * ls * 1.15, ls, t, e.corners[i] + j * 0.05,
        { weight: 800, from: 1.3, align, color: j ? WHITE : 'rgba(255,255,255,0.7)' }));
    });
    rise(ctx, 'TOUT COMMENCE AVEC JÉSUS.', cx, cy + 440 * VS, fit(ctx, 'TOUT COMMENCE AVEC JÉSUS.', 56 * VS), t, e.line, { color: ORANGE });
  }

  function movement(ctx, t, o) {
    bg(ctx, o.bg);
    drift(ctx, t, WHITE, 0.07, o.seed);
    const e = o.e;
    // the big word whips in from the side, then breathes on the beat
    const k = ease.outExpo(prog(t, e.word, 0.45));
    const ws = fit(ctx, o.word, 170 * VS, maxW);
    ctx.save();
    ctx.translate(cx + (1 - k) * W * o.dir, cy - 390 * VS);
    const p = beatPunch(t);
    ctx.scale(p, p);
    G.text(ctx, o.word, 0, 0, { size: ws, fam: F, weight: 900, color: WHITE, align: 'center', baseline: 'middle', alpha: clamp(k * 3) });
    ctx.restore();
    kicker(ctx, o.kicker, cx, cy - 510 * VS, t, e.word + 0.1, o.kickerColor, 32);
    o.draw(ctx, t);
    // tagline
    const tag = o.tag;
    const ts = fit(ctx, tag, 62 * VS);
    rise(ctx, tag, cx, cy + 440 * VS, ts, t, e.tag, { color: o.tagColor ?? WHITE });
    const u = ease.outExpo(prog(t, e.tag + 0.15, 0.4));
    if (u > 0) { const tw = G.measure(ctx, tag, ts, F, 900); ctx.fillStyle = o.lineColor ?? ORANGE; ctx.fillRect(cx - tw / 2, cy + 440 * VS + ts * 0.62, tw * u, 10); }
  }

  function connect(ctx, t) {
    const e = ev.connect;
    movement(ctx, t, { bg: BLUE, seed: 5, word: 'CONNECTER', dir: -1, e, kicker: 'MOUVEMENT 1', kickerColor: ORANGE,
      tag: 'CONNECTÉ POUR APPARTENIR.', draw(ctx, t) {
        const r = 240 * VS, y0 = cy + 50 * VS;
        const pts = [[cx, y0 - r], [cx + r * 0.95, y0 + r * 0.55], [cx - r * 0.95, y0 + r * 0.55]];
        const names = ['À JÉSUS', 'À L’ÉGLISE', 'AUX AUTRES'];
        // lines from the centre to each node, drawn on the node's beat
        ctx.strokeStyle = WHITE; ctx.lineWidth = 6; ctx.lineCap = 'round';
        pts.forEach(([x, y], i) => {
          const k = ease.outCubic(prog(t, e.nodes[i] - 0.1, 0.3));
          if (k <= 0) return;
          ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(lerp(cx, x, k), lerp(y0, y, k)); ctx.stroke();
        });
        // ring connecting all three once they are there
        const ring = ease.inOutCubic(prog(t, e.nodes[2] + 0.2, 0.6));
        if (ring > 0) { ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(...pts[0]); const segs = [pts[1], pts[2], pts[0]]; const n = ring * 3; for (let i = 0; i < Math.ceil(n); i++) { const a = i === 0 ? pts[0] : segs[i - 1]; const b = segs[i]; const f = Math.min(1, n - i); ctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); } ctx.stroke(); ctx.globalAlpha = 1; }
        symbol(ctx, cx, y0, 90 * VS, { color: WHITE, center: 1 });
        pts.forEach(([x, y], i) => {
          const k = ease.outBack(prog(t, e.nodes[i], 0.3), 2.5);
          if (k <= 0) return;
          ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x, y, 26 * k, 0, Math.PI * 2); ctx.fill();
          const ly = i === 0 ? y - 70 * VS : y + 75 * VS;
          stamp(ctx, names[i], x, ly, fit(ctx, names[i], 46 * VS, W * 0.42, 800), t, e.nodes[i], { weight: 800, from: 1.3 });
        });
      } });
  }

  function transform(ctx, t) {
    const e = ev.transform;
    movement(ctx, t, { bg: ORANGE, seed: 6, word: 'TRANSFORMER', dir: 1, e, kicker: 'MOUVEMENT 2', kickerColor: NAVY,
      tag: 'TRANSFORMÉ POUR DEVENIR.', tagColor: WHITE, lineColor: NAVY, draw(ctx, t) {
        // the 242 staircase: three steps, one per beat, a person climbing them
        const sw = Math.min(290 * VS, maxW / 3), sh = 140 * VS, x0 = cx - sw * 1.5, yb = cy + 310 * VS;
        const names = ['LA PAROLE', 'LA COMMUNION', 'LA PRIÈRE'];
        ctx.lineWidth = 12; ctx.strokeStyle = WHITE; ctx.lineJoin = 'miter';
        for (let i = 0; i < 3; i++) {
          const k = ease.outBack(prog(t, e.steps[i], 0.3), 1.8);
          if (k <= 0) continue;
          const h = sh * (i + 1) * k;
          ctx.strokeRect(x0 + i * sw + 6, yb - h, sw - 12, h);
          const ls = fit(ctx, names[i], 38 * VS, sw - 30, 800);
          G.text(ctx, names[i], x0 + i * sw + sw / 2, yb - h + 40 * VS, { size: ls, fam: F, weight: 800, color: NAVY, align: 'center', baseline: 'middle', alpha: clamp(k) });
        }
        // the climber hops onto each step on its beat
        let step = -1;
        e.steps.forEach((s, i) => { if (t >= s) step = i; });
        if (step >= 0) {
          const since = t - e.steps[step];
          const hop = Math.sin(Math.PI * clamp(since / 0.3)) * 60 * VS * (since < 0.3 ? 1 : 0);
          const px = x0 + step * sw + sw / 2, py = yb - sh * (step + 1) - 34 - hop;
          ctx.fillStyle = BLUE; ctx.fillRect(px - 26, py - 26, 52, 52);
        }
      } });
  }

  function send(ctx, t) {
    const e = ev.send;
    movement(ctx, t, { bg: NAVY, seed: 7, word: 'ENVOYER', dir: -1, e, kicker: 'MOUVEMENT 3', kickerColor: ORANGE,
      tag: 'ENVOYÉ POUR IMPACTER.', draw(ctx, t) {
        const y0 = cy - 20 * VS;
        symbol(ctx, cx, y0, 120 * VS, { color: WHITE, center: 1 });
        const names = ['SERVIR', 'TÉMOIGNER', 'FAIRE DES DISCIPLES'];
        const dirs = [[-1, -0.55], [1, -0.55], [0, 1]];
        dirs.forEach(([dx, dy], i) => {
          const k = ease.outExpo(prog(t, e.arrows[i] - 0.08, 0.35));
          if (k <= 0) return;
          const len = 170 * VS * k, n = Math.hypot(dx, dy);
          const ux = dx / n, uy = dy / n;
          const sx = cx + ux * 95 * VS, sy = y0 + uy * 95 * VS;
          const ex = sx + ux * len, ey = sy + uy * len;
          ctx.strokeStyle = ORANGE; ctx.lineWidth = 10; ctx.lineCap = 'square';
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
          const a = Math.atan2(uy, ux);
          ctx.fillStyle = ORANGE; ctx.beginPath();
          ctx.moveTo(ex + Math.cos(a) * 26, ey + Math.sin(a) * 26);
          ctx.lineTo(ex + Math.cos(a + 2.4) * 26, ey + Math.sin(a + 2.4) * 26);
          ctx.lineTo(ex + Math.cos(a - 2.4) * 26, ey + Math.sin(a - 2.4) * 26); ctx.fill();
          const fx = cx + ux * (95 + 170) * VS, fy = y0 + uy * (95 + 170) * VS;
          const ly = i === 2 ? fy + 60 * VS : fy - 55 * VS;
          const ls = fit(ctx, names[i], 46 * VS, i === 2 ? maxW : SAFE.w * 0.44, 800);
          stamp(ctx, names[i], i === 2 ? cx : fx, ly, ls, t, e.arrows[i], { weight: 800, from: 1.3 });
        });
      } });
  }

  function sunday(ctx, t) {
    const e = ev.sunday;
    const out = t >= e.send;
    bg(ctx, out ? BLUE : WHITE);
    const y0 = cy - 20 * VS;
    if (!out) {
      const k = ease.outExpo(prog(t, e.gather, 0.6));
      symbol(ctx, cx, y0, 300 * VS, { color: BLUE, spread: lerp(4, 1, k), center: ease.outBack(prog(t, e.gather + 0.35, 0.3), 2) });
      rise(ctx, 'LE DIMANCHE', cx, cy - 360 * VS, fit(ctx, 'LE DIMANCHE', 110 * VS), t, e.line1, { color: INK });
      rise(ctx, 'RASSEMBLE.', cx, cy + 330 * VS, fit(ctx, 'RASSEMBLE.', 130 * VS), t, e.line1 + 0.25, { color: BLUE });
    } else {
      const k = ease.outExpo(prog(t, e.send, 0.9));
      symbol(ctx, cx, y0, 300 * VS, { color: WHITE, spread: lerp(1, 6, k), center: 1 - prog(t, e.send, 0.2) });
      // the people go out in every direction
      for (let i = 0; i < 40; i++) {
        const a = U.hash(9, i) * Math.PI * 2, sp = 0.4 + U.hash(9, i, 1) * 0.9;
        const r = k * sp * Math.max(W, H) * 0.7;
        const s = 10 + U.hash(9, i, 2) * 22;
        ctx.fillStyle = i % 3 ? ORANGE : WHITE;
        ctx.fillRect(cx + Math.cos(a) * r - s / 2, y0 + Math.sin(a) * r - s / 2, s, s);
      }
      rise(ctx, 'LE LUNDI', cx, cy - 360 * VS, fit(ctx, 'LE LUNDI', 110 * VS), t, e.line2 - 0.25);
      stamp(ctx, 'ENVOIE.', cx, cy + 330 * VS, fit(ctx, 'ENVOIE.', 150 * VS), t, e.line2, { color: ORANGE });
    }
  }

  function cap(ctx, t) {
    bg(ctx, BLUE);
    const e = ev.cap;
    kicker(ctx, 'LE CAP', cx, cy - 470 * VS, t, e.start);
    const k = ease.inOutCubic(prog(t, e.countFrom, e.countTo - e.countFrom));
    const n = Math.round(lerp(50, 2420, k));
    // the grid fills as the number climbs: one square per ten people
    const cells = Math.round(n / 10), cols = WIDE ? 44 : 22, cell = WIDE ? 40 : 44;
    const gw = cols * cell, gh = Math.ceil(242 / cols) * cell;
    const gx = cx - gw / 2, gy = cy - gh / 2 - 10 * VS;
    ctx.fillStyle = WHITE;
    for (let i = 0; i < cells; i++) {
      ctx.globalAlpha = 0.16;
      ctx.fillRect(gx + (i % cols) * cell + 6, gy + Math.floor(i / cols) * cell + 6, cell - 12, cell - 12);
    }
    ctx.globalAlpha = 1;
    const str = n.toLocaleString('fr-FR').replace(/\s/g, ' ');
    const done = t >= e.countTo;
    const p = done ? ease.outBack(prog(t, e.countTo, 0.3), 3) : 1;
    ctx.save(); ctx.translate(cx, cy - 40 * VS); ctx.scale(lerp(1.15, 1, p), lerp(1.15, 1, p));
    G.text(ctx, str, 0, 0, { size: fit(ctx, '2 420', 300 * VS), fam: F, weight: 900, color: WHITE, align: 'center', baseline: 'middle' });
    ctx.restore();
    rise(ctx, 'PERSONNES ACTIVES,', cx, cy + 190 * VS, fit(ctx, 'PERSONNES ACTIVES,', 58 * VS), t, e.label);
    rise(ctx, 'INTÉGRÉES ET ENGAGÉES', cx, cy + 260 * VS, fit(ctx, 'INTÉGRÉES ET ENGAGÉES', 58 * VS), t, e.label + 0.12);
    // the stamp: an orange tag that slams on
    const sk = prog(t, e.stamp, 0.22);
    if (sk > 0) {
      const s = lerp(2.2, 1, ease.outBack(sk, 1.8));
      ctx.save(); ctx.translate(cx, cy + 400 * VS); ctx.rotate(-0.06); ctx.scale(s, s);
      const label = 'EN 36 MOIS', ls = 64 * VS, lw = G.measure(ctx, label, ls, F, 900) + 70;
      ctx.globalAlpha = clamp(sk * 4);
      ctx.fillStyle = ORANGE; ctx.fillRect(-lw / 2, -ls * 0.85, lw, ls * 1.7);
      G.text(ctx, label, 0, 0, { size: ls, fam: F, weight: 900, color: WHITE, align: 'center', baseline: 'middle' });
      ctx.restore();
    }
  }

  function isaiah(ctx, t) {
    const e = ev.isaiah;
    bg(ctx, NAVY);
    // the light rises from the centre, then floods the frame into the 3D finale
    const grow = ease.inCubic(prog(t, S.S.isaiah[0], S.S.isaiah[1] - S.S.isaiah[0]));
    const flood = ease.inExpo(prog(t, e.swell, e.cut - e.swell));
    const r = lerp(120, Math.max(W, H) * 0.8, grow);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(255,250,220,0.95)');
    g.addColorStop(0.35, 'rgba(255,232,150,0.35)');
    g.addColorStop(1, 'rgba(255,232,150,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const textAlpha = 1 - prog(t, e.cut - 0.5, 0.4);
    const lines = [['« LÈVE-TOI,', e.l1, 120], ['SOIS ÉCLAIRÉ,', e.l2, 100], ['CAR TA LUMIÈRE', e.l3, 86], ['ARRIVE. »', e.l3 + 0.25, 86]];
    lines.forEach(([s, t0, size], i) => {
      const y = cy + (i - 1.5) * 150 * VS;
      // white text while the room is dark, ink once the light is bright
      const c = WHITE;
      rise(ctx, s, cx, y, fit(ctx, s, size * VS), t, t0, { color: c, alpha: textAlpha });
    });
    kicker(ctx, 'ÉSAÏE 60:1', cx, cy + 380 * VS, t, e.ref, ORANGE, 40);
    if (flood > 0) { ctx.fillStyle = `rgba(255,253,240,${flood})`; ctx.fillRect(0, 0, W, H); }
  }

  // ---------- assets: icons (Lucide, ISC) ----------
  const IMG = {}, ICON = {};
  const ICONS = ['sun', 'users', 'house', 'flame', 'smartphone', 'baby', 'star', 'rocket', 'party-popper', 'hand-heart',
    'hand-helping', 'zap', 'trophy', 'briefcase', 'calendar-clock', 'heart-handshake', 'tent'];
  async function loadIcon(name, color) {
    const svg = (await (await fetch(`assets/icons/${name}.svg`)).text()).replace(/currentColor/g, color).replace(/<!--.*?-->/s, '');
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await img.decode();
    ICON[`${name}|${color}`] = img;
  }
  function icon(ctx, name, color, x, y, size, alpha = 1) {
    const img = ICON[`${name}|${color}`];
    if (!img || alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(img, x - size / 2, y - size / 2, size, size); ctx.restore();
  }
  // a brand panel: colour field, drifting ghost symbols, and one big mark (an icon or a letter)
  function panel(ctx, x, y, w, h, k, o) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = o.color; ctx.fillRect(x, y, w, h);
    for (let j = 0; j < 4; j++) {
      const sx = x + w * (0.1 + 0.3 * j) + Math.sin(k * 2 + j) * 20 - k * 60, sy = y + h * (j % 2 ? 0.7 : 0.3);
      symbol(ctx, sx, sy, h * 0.55, { color: WHITE, alpha: 0.07, center: 0, rot: k * 0.3 * (j % 2 ? 1 : -1) });
    }
    const mx = x + w * (o.markX ?? 0.75), my = y + h * 0.42, ms = h * 0.5 * (1 + 0.05 * k);
    if (o.letter) G.text(ctx, o.letter, mx, my, { size: ms * 1.3, fam: F, weight: 900, color: WHITE, align: 'center', baseline: 'middle', alpha: 0.9 });
    else if (o.icon) icon(ctx, o.icon, WHITE, mx, my, ms);
    ctx.restore();
  }
  function tagLine(ctx, str, t, t0, color = WHITE, lineColor = ORANGE, y = cy + 470 * VS) {
    const ts = fit(ctx, str, 54 * VS);
    rise(ctx, str, cx, y, ts, t, t0, { color });
    const u = ease.outExpo(prog(t, t0 + 0.15, 0.4));
    if (u > 0) { const tw = G.measure(ctx, str, ts, F, 900); ctx.fillStyle = lineColor; ctx.fillRect(cx - tw / 2, y + ts * 0.62, tw * u, 9); }
  }
  function title(ctx, small, big, t, t0, colors) {
    kicker(ctx, small, cx, cy - 560 * VS, t, t0, colors[0], 32);
    stamp(ctx, big, cx, cy - 480 * VS, fit(ctx, big, 76 * VS), t, t0 + 0.05, { color: colors[1] });
  }

  // the week: one row per rhythm, landing on the beat
  function week(ctx, t) {
    bg(ctx, WHITE);
    drift(ctx, t, BLUE, 0.05, 11);
    const e = ev.week;
    title(ctx, 'VIVRE LA ZONE', 'UNE SEMAINE, UNE VIE', t, e.title, [ORANGE, INK]);
    const rows = [
      ['DIM', 'sun', 'CULTE ZONE', 'Toute la maison'],
      ['SEM. A', 'users', 'ZONE DE CROISSANCE', '≈ 8 personnes autour d’un Berger'],
      ['SEM. B', 'house', 'ZONE FAMILY', 'La foi vécue à la maison'],
      ['VEN', 'flame', 'PRIÈRE ENSEMBLE', '60 à 90 minutes'],
      ['7/7', 'smartphone', 'ZONE DIGITAL', 'L’application ZONE 242'],
    ];
    const rw = Math.min(maxW, 860), rh = 128 * VS, x0 = cx - rw / 2, y0 = cy - 360 * VS;
    rows.forEach(([day, ic, name, sub], i) => {
      const k = ease.outExpo(prog(t, e.items[i], 0.4));
      if (k <= 0) return;
      const y = y0 + i * (rh + 16 * VS);
      const x = x0 - (1 - k) * W;
      ctx.fillStyle = i % 2 ? '#EEF0FF' : '#F4F4F8'; ctx.fillRect(x, y, rw, rh);
      ctx.fillStyle = i === 0 ? ORANGE : BLUE; ctx.fillRect(x, y, 150 * VS, rh);
      G.text(ctx, day, x + 75 * VS, y + rh / 2, { size: fit(ctx, day, 38 * VS, 130 * VS, 900), fam: F, weight: 900, color: WHITE, align: 'center', baseline: 'middle' });
      icon(ctx, ic, BLUE, x + 210 * VS, y + rh / 2, 62 * VS);
      const tx = x + 270 * VS, room = rw - 290 * VS;
      G.text(ctx, name, tx, y + rh * 0.38, { size: fit(ctx, name, 40 * VS, room, 900), fam: F, weight: 900, color: INK, baseline: 'middle' });
      G.text(ctx, sub, tx, y + rh * 0.72, { size: fit(ctx, sub, 27 * VS, room, 700), fam: F, weight: 700, color: '#5A5874', baseline: 'middle' });
    });
    tagLine(ctx, 'UNE FOI QUI SE VIT CHAQUE JOUR.', t, e.tag, BLUE, ORANGE);
  }

  // all the generations: the symbol and four age groups
  function gens(ctx, t) {
    bg(ctx, BLUE);
    drift(ctx, t, WHITE, 0.07, 12);
    const e = ev.gens;
    title(ctx, 'TOUTES LES GÉNÉRATIONS', 'UNE MÊME MISSION', t, e.title, [ORANGE, WHITE]);
    const pk = ease.outBack(prog(t, e.photo, 0.5), 1.4);
    const ps = (WIDE ? 380 : 440) * VS * Math.max(pk, 0);
    if (pk > 0) {
      const px = cx - ps / 2, py = cy - 150 * VS - ps / 2;
      symbol(ctx, px + ps / 2, py + ps / 2, ps * 0.9, { color: WHITE, spread: lerp(1.6, 1, pk), rot: (1 - Math.min(pk, 1)) * 0.6 });
    }
    const items = [['baby', 'ZONE KIDS', '0 – 10 ANS'], ['star', 'ZONE TEENS', '11 – 15 ANS'], ['rocket', 'ZONE YOUTH', '16 ANS ET +'], ['house', 'ADULTES', '& FAMILLES']];
    const cw = Math.min(maxW / 4, 230 * VS), yy = cy + 230 * VS;
    items.forEach(([ic, a, b], i) => {
      const k = ease.outBack(prog(t, e.items[i], 0.3), 2.2);
      if (k <= 0) return;
      const x = cx + (i - 1.5) * cw;
      ctx.save(); ctx.translate(x, yy); ctx.scale(k, k);
      ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(0, -40 * VS, 52 * VS, 0, Math.PI * 2); ctx.fill();
      icon(ctx, ic, BLUE, 0, -40 * VS, 56 * VS);
      G.text(ctx, a, 0, 48 * VS, { size: fit(ctx, a, 30 * VS, cw - 12, 900), fam: F, weight: 900, color: WHITE, align: 'center', baseline: 'middle' });
      G.text(ctx, b, 0, 84 * VS, { size: fit(ctx, b, 22 * VS, cw - 12, 500), fam: MONO, weight: 500, color: '#C9C4FF', align: 'center', baseline: 'middle' });
      ctx.restore();
    });
    tagLine(ctx, 'CHAQUE GÉNÉRATION COMPTE.', t, e.tag, WHITE, ORANGE);
  }

  // two panels, two communities: stacked in 9:16, side by side in 16:9
  function pair(ctx, t, o) {
    bg(ctx, NAVY);
    drift(ctx, t, WHITE, 0.05, o.seed);
    const e = o.e;
    kicker(ctx, o.kicker, cx, cy - 560 * VS, t, e.a, ORANGE, 32);
    const cards = [[o.A, e.a, -1], [o.B, e.b, 1]];
    cards.forEach(([c, t0, side], i) => {
      const k = ease.outExpo(prog(t, t0, 0.55));
      if (k <= 0) return;
      let x, y, w, h;
      if (WIDE) { w = (maxW - 40) / 2; h = 600 * VS; x = cx - maxW / 2 + i * (w + 40); y = cy - 470 * VS; }
      else { w = W; h = 400 * VS; x = 0; y = cy - 480 * VS + i * (h + 90 * VS); }
      const dx = (1 - k) * W * side;
      panel(ctx, x + dx, y, w, h, prog(t, t0, 4), { color: i ? ORANGE : BLUE, icon: c.icon, letter: c.letter, markX: WIDE ? 0.5 : 0.78 });
      // label plate over the panel's lower edge
      const name = c.name, sub = c.sub;
      const ns = fit(ctx, name, 66 * VS, w - 150), ss = fit(ctx, sub, 28 * VS, w - 150, 700);
      const ph = ns * 1.1 + ss * 1.5 + 30;
      const py = y + h - ph * 0.55;
      const pw = Math.max(G.measure(ctx, name, ns, F, 900), G.measure(ctx, sub, ss, F, 700)) + 60;
      const plx = (WIDE ? x + 24 : x + 40) + dx;
      const lk = ease.outExpo(prog(t, t0 + 0.2, 0.4));
      ctx.fillStyle = WHITE; ctx.fillRect(plx, py, pw * lk, ph);
      if (lk > 0.6) {
        G.text(ctx, name, plx + 30, py + ns * 0.72 + 8, { size: ns, fam: F, weight: 900, color: i ? ORANGE : BLUE, baseline: 'middle' });
        G.text(ctx, sub, plx + 30, py + ns * 1.1 + ss + 10, { size: ss, fam: F, weight: 700, color: INK, baseline: 'middle' });
      }
    });
    tagLine(ctx, o.tag, t, e.tag, WHITE, ORANGE, cy + (WIDE ? 330 : 590) * VS);
  }
  const menwomen = (ctx, t) => pair(ctx, t, { e: ev.menwomen, seed: 13, kicker: 'DEUX UNIVERS · TOUTE L’ANNÉE',
    A: { letter: 'M', name: 'ZONE MEN', sub: 'Des hommes de foi, de caractère et d’impact.' },
    B: { letter: 'W', name: 'ZONE WOMEN', sub: 'Des femmes de foi, d’influence et de destinée.' },
    tag: 'FOI · IDENTITÉ · INFLUENCE · DESTINÉE.' });
  const couples = (ctx, t) => pair(ctx, t, { e: ev.couples, seed: 14, kicker: 'CHAQUE SAISON COMPTE',
    A: { name: 'GALA DES COUPLES', sub: 'Honorer l’alliance. Célébrer l’amour.', icon: 'heart-handshake' },
    B: { name: 'RENCONTRE DES CÉLIBATAIRES', sub: 'Bien vivre sa saison, préparer son avenir.', icon: 'users' },
    tag: 'BÂTIR LA FAMILLE, PRÉPARER L’AVENIR.' });
  const camps = (ctx, t) => pair(ctx, t, { e: ev.camps, seed: 15, kicker: '242 CAMPS · IMMERSION',
    A: { name: 'CAMP TEENS · 11–15 ANS', sub: 'Une identité solide en Christ.', icon: 'tent' },
    B: { name: 'CAMP YOUTH · 16 ANS ET +', sub: 'Vocation, leadership, mission.', icon: 'rocket' },
    tag: 'UNE GÉNÉRATION QUI IMPACTE.' });

  // signature programmes: four tiles
  function signature(ctx, t) {
    bg(ctx, ORANGE);
    drift(ctx, t, WHITE, 0.08, 16);
    const e = ev.signature;
    title(ctx, 'NOS PROGRAMMES SIGNATURE', 'TOUTE L’ANNÉE', t, e.title, [NAVY, WHITE]);
    const tiles = [['flame', 'CHAMBRE HAUTE', 'Présence · adoration · 4 fois par an'], ['party-popper', 'ZONE OUT', 'La Zone hors les murs'],
      ['hand-heart', 'ZONE SERVES', 'Servir la ville'], ['hand-helping', 'SERVE DAY', 'Découvrir un service']];
    const cols = WIDE ? 4 : 2, gap = 26;
    const tw = (Math.min(maxW, WIDE ? 1500 : 860) - gap * (cols - 1)) / cols, th = 330 * VS;
    const gx = cx - (tw * cols + gap * (cols - 1)) / 2, gy = WIDE ? cy - 200 * VS : cy - 360 * VS;
    tiles.forEach(([ic, name, sub], i) => {
      const k = ease.outBack(prog(t, e.items[i], 0.35), 1.8);
      if (k <= 0) return;
      const x = gx + (i % cols) * (tw + gap), y = gy + Math.floor(i / cols) * (th + gap);
      ctx.save(); ctx.translate(x + tw / 2, y + th / 2); ctx.scale(k, k); ctx.rotate((1 - Math.min(k, 1)) * 0.2);
      ctx.fillStyle = WHITE; ctx.fillRect(-tw / 2, -th / 2, tw, th);
      ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(0, -th * 0.2, 62 * VS, 0, Math.PI * 2); ctx.fill();
      icon(ctx, ic, WHITE, 0, -th * 0.2, 64 * VS);
      G.text(ctx, name, 0, th * 0.12, { size: fit(ctx, name, 40 * VS, tw - 30, 900), fam: F, weight: 900, color: INK, align: 'center', baseline: 'middle' });
      G.text(ctx, sub, 0, th * 0.3, { size: fit(ctx, sub, 24 * VS, tw - 30, 700), fam: F, weight: 700, color: '#5A5874', align: 'center', baseline: 'middle' });
      ctx.restore();
    });
    tagLine(ctx, 'MOINS DE PLATEFORME, PLUS DE PRÉSENCE.', t, e.tag, WHITE, NAVY, WIDE ? cy + 300 * VS : cy + 470 * VS);
  }

  // the big gatherings: a stack of cards, each one slams over the last
  function gather(ctx, t) {
    bg(ctx, NAVY);
    drift(ctx, t, WHITE, 0.05, 17);
    const e = ev.gather;
    title(ctx, 'LES GRANDS RASSEMBLEMENTS 242', 'UNE FOIS PAR AN', t, e.title, [ORANGE, WHITE]);
    const cards = [
      { name: 'PUISSANCE & GUÉRISON', sub: 'Deux séminaires pour rencontrer Dieu', icon: 'zap', col: BLUE },
      { name: 'AIGLES & OUVRIERS', sub: 'Célébrer ceux qui font vivre la Zone', icon: 'trophy', col: ORANGE },
      { name: '242 BUSINESS CONFERENCE', sub: 'Foi · business · leadership · impact', icon: 'briefcase', col: '#0B7FD8' },
      { name: '14 JOURS · 242 HOURS', sub: 'Jeûne et prière en chaîne, chaque janvier', icon: 'calendar-clock', col: BLUE },
    ];
    const cw = Math.min(maxW, WIDE ? 1100 : 900), ch = (WIDE ? 560 : 640) * VS;
    const x0 = cx - cw / 2, y0 = cy - ch / 2 - 40 * VS;
    let shown = -1;
    e.items.forEach((s, i) => { if (t >= s) shown = i; });
    for (let i = Math.max(0, shown - 1); i <= shown; i++) {
      const c = cards[i];
      const k = ease.outExpo(prog(t, e.items[i], 0.45));
      const under = i < shown ? ease.outCubic(prog(t, e.items[shown], 0.45)) : 0;
      ctx.save();
      ctx.translate(cx, y0 + ch / 2);
      ctx.scale(1 - under * 0.08, 1 - under * 0.08);
      ctx.translate(-cx + (1 - k) * W * (i % 2 ? -1 : 1), -(y0 + ch / 2));
      ctx.globalAlpha = 1 - under * 0.5;
      const ph = ch * 0.66;
      { ctx.fillStyle = c.col; ctx.fillRect(x0, y0, cw, ph); for (let j = 0; j < 3; j++) symbol(ctx, x0 + cw * (0.2 + j * 0.3), y0 + ph / 2, ph * 0.5, { color: WHITE, alpha: 0.07, center: 0 }); icon(ctx, c.icon, WHITE, cx, y0 + ph / 2, ph * 0.42); }
      ctx.fillStyle = WHITE; ctx.fillRect(x0, y0 + ph, cw, ch - ph);
      ctx.fillStyle = c.col; ctx.fillRect(x0, y0 + ph, 16, ch - ph);
      G.text(ctx, c.name, x0 + 50, y0 + ph + (ch - ph) * 0.38, { size: fit(ctx, c.name, 58 * VS, cw - 100), fam: F, weight: 900, color: INK, baseline: 'middle' });
      G.text(ctx, c.sub, x0 + 50, y0 + ph + (ch - ph) * 0.7, { size: fit(ctx, c.sub, 30 * VS, cw - 100, 700), fam: F, weight: 700, color: '#5A5874', baseline: 'middle' });
      G.text(ctx, `0${i + 1}/04`, x0 + cw - 30, y0 + 46, { size: 30, fam: MONO, weight: 500, color: WHITE, align: 'right', baseline: 'middle' });
      ctx.restore();
    }
    tagLine(ctx, 'PAS UN CALENDRIER : UN SYSTÈME.', t, e.tag, WHITE, ORANGE, cy + (WIDE ? 380 : 470) * VS);
  }

  function placeholder3d(ctx) { bg(ctx, '#000'); }

  const SCENES = [
    [S.S.open3d, placeholder3d], [S.S.vision, vision], [S.S.rooted, rooted], [S.S.crowd, crowd], [S.S.acts, acts],
    [S.S.connect, connect], [S.S.transform, transform], [S.S.send, send], [S.S.sunday, sunday],
    [S.S.week, week], [S.S.gens, gens], [S.S.menwomen, menwomen], [S.S.couples, couples], [S.S.camps, camps],
    [S.S.signature, signature], [S.S.gather, gather], [S.S.cap, cap],
    [S.S.isaiah, isaiah], [S.S.final3d, placeholder3d],
  ];
  const WIPE = 0.26;

  Studio.film({
    async init() {
      await Studio.loadFont(F, 'assets/fonts/montserrat-latin-700-normal.woff2', 700);
      await Studio.loadFont(F, 'assets/fonts/montserrat-latin-800-normal.woff2', 800);
      await Studio.loadFont(F, 'assets/fonts/montserrat-latin-900-normal.woff2', 900);
      await Studio.loadFont(MONO, 'assets/fonts/ibm-plex-mono-latin-500-normal.woff2', 500);
      for (const n of ICONS) for (const c of [BLUE, WHITE, ORANGE]) await loadIcon(n, c);
    },
    draw(ctx, t) {
      const i = SCENES.findIndex(([[a, b]]) => t >= a && t < b);
      const idx = i < 0 ? SCENES.length - 1 : i;
      const [[a], fn] = SCENES[idx];
      const prev = idx > 1 && idx < SCENES.length - 1 ? SCENES[idx - 1][1] : null;
      // a slight push-in over each scene keeps the frame moving
      const push = 1 + 0.03 * clamp((t - a) / 4);
      const drawScene = (f) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2); f(ctx, t); ctx.restore(); };
      if (prev && t < a + WIPE) {
        // wipe: the new scene slides over the old one, led by an orange edge
        prev(ctx, t);
        const k = ease.inOutCubic((t - a) / WIPE);
        const dir = idx % 2 ? 1 : -1;
        const edge = dir > 0 ? W * k : W * (1 - k);
        ctx.save(); ctx.beginPath();
        if (dir > 0) ctx.rect(0, 0, edge, H); else ctx.rect(edge, 0, W - edge, H);
        ctx.clip(); drawScene(fn); ctx.restore();
        ctx.fillStyle = ORANGE; ctx.fillRect(edge - (dir > 0 ? 24 : 0), 0, 24, H);
      } else drawScene(fn);
    },
    post: { paper: 0, vignette: 0.12, grain: 0.025 },
    fadeOut: 0,
  });
})();
