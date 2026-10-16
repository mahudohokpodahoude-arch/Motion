// THE FILM — "La lumière au centre": the 2D part of the ZONE 242 vision film (16:9, 8 s → 82 s).
//
// One orange square (the light, the centre of the logo) travels through every scene: it is the full
// stop of the vision, the one person found in the crowd, the centre of Acts 2:42, the hub that
// connects, the one who climbs, the one who is sent, the day on the calendar, the first of the
// 2 420... and finally the sun that rises in Isaiah 60:1. Orange is kept for that square and for
// what it touches (the brand book: "la couleur est au centre"); blue, navy and white carry the rest.
//
// Every visual hit lands on an event of score.js, so the sound effects stay exactly in sync.
// No camera: the frame never zooms, shakes or pulses; only the elements inside it move.
// No icons, no photos: type and brand shapes only, sharp at any resolution.
// [0, 8) and [82, 90) are 3D: tools/build.sh replaces them with the three.js renders.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { ev } = S;
  const { clamp, lerp, ease } = U;
  const W = G.W, H = G.H;

  // ---------- brand ----------
  const BLUE = '#1900CF', ORANGE = '#FF5A36', NAVY = '#0D0838', WHITE = '#FFFFFF', INK = '#14122B', MUTE = '#5A5874';
  const SOFT = 'rgba(255,255,255,0.74)';
  const F = 'Mont', MONO = 'PlexMono';
  const X0 = 160, XR = W - 160, CX = W / 2;     // the grid: outer columns and centre

  // ---------- helpers ----------
  const prog = (t, a, d) => clamp((t - a) / d);
  const fit = (ctx, str, size, w, weight = 900) => {
    const m = G.measure(ctx, str, size, F, weight);
    return m > w ? (size * w) / m : size;
  };
  function bg(ctx, color) { ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); }

  // a line slides up out of a mask; an optional orange underline draws after it
  function reveal(ctx, str, x, y, size, t, t0, o = {}) {
    if (t < t0) return;
    const weight = o.weight ?? 900, align = o.align ?? 'left';
    const k = ease.outExpo(prog(t, t0, o.dur ?? 0.55));
    const w = G.measure(ctx, str, size, F, weight);
    const x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0 - 12, y - size * 0.8, w + 24, size * 1.6); ctx.clip();
    G.text(ctx, str, x, y + (1 - k) * size * 1.15, { size, fam: F, weight, color: o.color ?? WHITE, align, baseline: 'middle' });
    ctx.restore();
    if (o.underline) {
      const u = ease.inOutCubic(prog(t, t0 + 0.25, 0.45));
      if (u > 0) { ctx.fillStyle = o.underline; ctx.fillRect(x0, y + size * 0.62, w * u, Math.max(6, size * 0.09)); }
    }
  }
  // a hero word: every letter drops in, spinning upright with an overshoot
  function spin(ctx, str, x, y, size, t, t0, o = {}) {
    if (t < t0) return;
    const weight = o.weight ?? 900, align = o.align ?? 'left';
    const total = G.measure(ctx, str, size, F, weight);
    const x0 = align === 'left' ? x : align === 'right' ? x - total : x - total / 2;
    const stag = Math.min(0.035, 0.3 / str.length);
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === ' ') continue;
      const k = prog(t, t0 + i * stag, 0.42);
      if (k <= 0) continue;
      const px = x0 + G.measure(ctx, str.slice(0, i), size, F, weight), w = G.measure(ctx, ch, size, F, weight);
      const b = ease.outBack(k, 1.9);
      ctx.save();
      ctx.translate(px + w / 2, y - (1 - ease.outExpo(k)) * size * 0.9);
      ctx.rotate((1 - Math.min(b, 1.08)) * (i % 2 ? 0.9 : -0.9));
      const s = lerp(0.4, 1, Math.min(b, 1.1));
      ctx.scale(s, s);
      G.text(ctx, ch, 0, 0, { size, fam: F, weight, color: o.color ?? WHITE, align: 'center', baseline: 'middle', alpha: clamp(k * 4) });
      ctx.restore();
    }
  }
  // a mono kicker whose letter spacing tightens as it appears
  function kicker(ctx, str, x, y, t, t0, color = ORANGE, size = 28, align = 'left') {
    const k = prog(t, t0, 0.5);
    if (k <= 0) return;
    ctx.save();
    ctx.letterSpacing = `${lerp(16, 7, ease.outCubic(k))}px`;
    G.text(ctx, str, x, y, { size, fam: MONO, weight: 500, color, align, baseline: 'middle', alpha: k });
    ctx.restore();
  }
  // the first k (0..1) of a polyline, drawn
  function poly(ctx, pts, k, color, lw) {
    if (k <= 0) return;
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    let left = total * clamp(k);
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineJoin = 'miter'; ctx.lineCap = 'square';
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length && left > 0; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), f = Math.min(1, left / d);
      ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
      left -= d;
    }
    ctx.stroke(); ctx.restore();
  }
  const line = (ctx, x1, y1, x2, y2, k, color, lw = 4) => poly(ctx, [[x1, y1], [x2, y2]], k, color, lw);

  // the four corners of the ZONE symbol around (x, y); k[i] = how far corner i has flown in (0..1)
  function corners(ctx, x, y, size, color, k = [1, 1, 1, 1], fly = 520) {
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
  }
  // a large outline of the symbol turning slowly behind a scene
  function ghost(ctx, t, x, y, size, color, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.15 + t * 0.03); ctx.globalAlpha = alpha;
    corners(ctx, 0, 0, size, color);
    ctx.restore();
  }
  // viewfinder brackets on the corners of a box, flying in with a quarter turn
  function frame(ctx, x, y, w, h, k, color, arm = 70, th = 10) {
    if (k <= 0) return;
    const e = ease.outBack(clamp(k), 1.3);
    [[x, y, 1, 1], [x + w, y, -1, 1], [x + w, y + h, -1, -1], [x, y + h, 1, -1]].forEach(([px, py, sx, sy], i) => {
      ctx.save(); ctx.globalAlpha *= clamp(k * 3);
      ctx.translate(px - sx * (1 - e) * 160, py - sy * (1 - e) * 160);
      ctx.rotate((1 - e) * (i % 2 ? 1 : -1) * Math.PI / 2);
      ctx.fillStyle = color; ctx.fillRect(0, 0, sx * arm, sy * th); ctx.fillRect(0, 0, sx * th, sy * arm);
      ctx.restore();
    });
  }
  // a square that opens from (ox, oy), turning from 45° to square, and shows `inside` within it
  function opening(ctx, ox, oy, k, inside) {
    if (k <= 0) return;
    const h = Math.hypot(W, H) * 1.1 * k, ang = (1 - k) * Math.PI / 4, c = Math.cos(ang), s = Math.sin(ang);
    const pts = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([px, py]) => [ox + px * c - py * s, oy + px * s + py * c]);
    const path = () => { ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); };
    ctx.save(); path(); ctx.clip(); inside(); ctx.restore();
    if (k < 1) { ctx.save(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 3 + 7 * (1 - k); path(); ctx.stroke(); ctx.restore(); }
  }
  // the light jumps from stop to stop: an arc and a quarter turn, landing on the beat of each stop
  function hops(t, stops, dur = 0.3, lift = 80) {
    let i = 0;
    while (i + 1 < stops.length && t >= stops[i + 1].t - dur) i++;
    const b = stops[i];
    if (i === 0 || t >= b.t) return { x: b.x, y: b.y, s: b.s, r: 0, a: 1 };
    const a = stops[i - 1], q = ease.inOutCubic(prog(t, b.t - dur, dur));
    return { x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q) - Math.sin(Math.PI * q) * lift, s: lerp(a.s, b.s, q), r: (1 - q) * -Math.PI / 2, a: 1 };
  }
  function square(ctx, st) {
    if (!st || (st.a ?? 1) <= 0.01) return;
    ctx.save(); ctx.globalAlpha = st.a ?? 1; ctx.translate(st.x, st.y); ctx.rotate(st.r || 0);
    ctx.fillStyle = ORANGE; ctx.fillRect(-st.s / 2, -st.s / 2, st.s, st.s);
    ctx.restore();
  }

  // ---------- 01 · the vision ----------
  const V = { rows: [[300, 104, 900], [410, 104, 900], [505, 62, 800], [650, 220, 900], [800, 104, 900]] };
  const vision = {
    range: S.S.vision,
    draw(ctx, t) {
      bg(ctx, BLUE);
      const e = ev.vision;
      ghost(ctx, t, 1530, 575, 900, WHITE, 0.06);
      // "des milliers": a field of tiny squares fills the right side with the word MILLIERS
      if (t >= e.words[3]) {
        const fx0 = 1300, fy0 = 250, step = 26, cols = 18, rows = 25, ox = fx0 + ((cols - 1) * step) / 2, oy = fy0 + ((rows - 1) * step) / 2;
        ctx.fillStyle = WHITE;
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
          const x = fx0 + i * step, y = fy0 + j * step;
          const k = ease.outBack(prog(t, e.words[3] + Math.hypot(x - ox, y - oy) / 900, 0.3), 2.2);
          if (k <= 0) continue;
          const s = 6 * k;
          ctx.globalAlpha = 0.5 * clamp(k);
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
      }
      kicker(ctx, 'LA VISION', X0, 168, t, e.kicker);
      ['BÂTIR', 'À COTONOU', 'UNE ÉGLISE DE', 'MILLIERS', 'DE DISCIPLES'].forEach((w, i) => {
        const [y, size, weight] = V.rows[i];
        if (i === 3) spin(ctx, w, X0, y, size, t, e.words[i], { color: ORANGE });
        else reveal(ctx, w, X0, y, size, t, e.words[i], { weight });
      });
    },
    // the light lands as the full stop of the sentence
    sq(ctx, t) {
      const land = ev.vision.words[5];
      if (t < land - 0.35) return null;
      const x = X0 + G.measure(ctx, 'DE DISCIPLES', 104, F, 900) + 34, y = V.rows[4][0] + 24;
      const k = prog(t, land - 0.35, 0.35), q = ease.outBack(k, 1.6);
      return { x, y: lerp(y - 260, y, q), s: 30, r: (1 - k) * Math.PI * 1.5, a: clamp(k * 3) };
    },
  };

  // ---------- 02 · rooted ----------
  const R = { bx: X0 + 18, tx: X0 + 76, rows: [300, 520, 740] };
  const rooted = {
    range: S.S.rooted,
    draw(ctx, t) {
      bg(ctx, WHITE);
      const e = ev.rooted;
      ghost(ctx, t, 1500, 560, 760, BLUE, 0.05);
      // the root: on the hit an orange line joins the three statements
      line(ctx, R.bx, R.rows[0], R.bx, R.rows[2] + 170, ease.inOutCubic(prog(t, e.hit - 0.05, 0.5)), ORANGE, 6);
      // the light leaves a mark on each line it passes
      R.rows.forEach((y, i) => {
        if (i < 2 && t >= e.lines[i + 1] - 0.3) { ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.strokeRect(R.bx - 9, y - 9, 18, 18); }
      });
      [['PASSIONNÉS', 'DE JÉSUS,'], ['ENRACINÉS', 'DANS LA PAROLE,'], ['TRANSFORMÉS', 'PAR SA PRÉSENCE.']].forEach(([a, b], i) => {
        reveal(ctx, a, R.tx, R.rows[i], 116, t, e.lines[i], { color: INK });
        reveal(ctx, b, R.tx, R.rows[i] + 86, 52, t, e.lines[i] + 0.15, { color: BLUE, weight: 800 });
      });
    },
    sq(ctx, t) { return hops(t, ev.rooted.lines.map((tt, i) => ({ t: tt, x: R.bx, y: R.rows[i], s: 30 })), 0.3, 60); },
  };

  // ---------- 03 · a great church where everyone is known ----------
  const C = { x0: 900, y0: 140, step: 40, cols: 22, rows: 21 };
  C.tx = C.x0 + 10 * C.step; C.ty = C.y0 + 10 * C.step;
  const crowd = {
    range: S.S.crowd,
    draw(ctx, t) {
      bg(ctx, NAVY);
      const e = ev.crowd;
      const dim = prog(t, e.lock, 0.4);
      ctx.fillStyle = WHITE;
      for (let i = 0; i < C.cols; i++) for (let j = 0; j < C.rows; j++) {
        const x = C.x0 + i * C.step, y = C.y0 + j * C.step;
        if (x === C.tx && y === C.ty) continue;
        const k = ease.outBack(prog(t, e.fill + Math.hypot(x - C.tx, y - C.ty) / 1800, 0.3), 2);
        if (k <= 0) continue;
        ctx.globalAlpha = lerp(0.45, 0.14, dim) * clamp(k);
        const s = 12 * k;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      // the viewfinder closes in on one person, turning square as it locks
      const vk = prog(t, e.lock - 0.45, 0.45);
      if (vk > 0) {
        const q = ease.outCubic(vk);
        ctx.save(); ctx.translate(C.tx, C.ty); ctx.rotate((1 - q) * Math.PI / 4);
        corners(ctx, 0, 0, lerp(560, 120, q), WHITE);
        ctx.restore();
      }
      reveal(ctx, 'UNE GRANDE', X0, 330, 92, t, e.text1);
      reveal(ctx, 'ÉGLISE,', X0, 430, 92, t, e.text1 + 0.12);
      reveal(ctx, 'OÙ CHACUN', X0, 600, 92, t, e.text2);
      reveal(ctx, 'EST CONNU.', X0, 700, 92, t, e.text2 + 0.12, { underline: ORANGE });
    },
    sq(ctx, t) { return { x: C.tx, y: C.ty, s: lerp(12, 46, ease.outBack(prog(t, ev.crowd.lock - 0.25, 0.3), 2)), r: 0, a: 1 }; },
  };

  // ---------- 04 · Acts 2:42 ----------
  const A = { sx: 1360, sy: 540, size: 460 };
  const acts = {
    range: S.S.acts,
    draw(ctx, t) {
      bg(ctx, BLUE);
      const e = ev.acts;
      kicker(ctx, 'ACTES 2:42', X0, 168, t, e.ref);
      reveal(ctx, 'CE QUE NOUS VIVONS', X0, 262, 60, t, e.ref + 0.1);
      ['LA PAROLE', 'LA COMMUNION', 'LE PAIN PARTAGÉ', 'LA PRIÈRE'].forEach((l, i) => {
        const y = 400 + i * 100;
        kicker(ctx, `0${i + 1}`, X0, y, t, e.corners[i] - 0.05, ORANGE, 28);
        reveal(ctx, l, X0 + 84, y, 56, t, e.corners[i], { weight: 800 });
      });
      // the symbol assembles around the light, one practice at a time
      corners(ctx, A.sx, A.sy, A.size, WHITE, e.corners.map((c) => prog(t, c - 0.36, 0.36)));
      // the centre answers with a ring of light
      const rk = prog(t, e.center, 0.7);
      if (rk > 0 && rk < 1) {
        const r = lerp(105, 560, ease.outCubic(rk));
        ctx.save(); ctx.globalAlpha = 1 - rk; ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.strokeRect(A.sx - r / 2, A.sy - r / 2, r, r); ctx.restore();
      }
      reveal(ctx, 'TOUT COMMENCE AVEC JÉSUS.', X0, 860, 56, t, e.line, { underline: ORANGE });
    },
    sq(ctx, t) {
      const k = prog(t, ev.acts.center - 0.12, 0.45);
      return { x: A.sx, y: A.sy, s: A.size * 0.229 * (1 + 0.35 * Math.sin(Math.PI * k)), r: -ease.inOutCubic(k) * Math.PI / 2, a: 1 };
    },
  };

  // ---------- 05 · 06 · 07 · the three movements ----------
  function movementHead(ctx, t, e, bgc, num, word) {
    kicker(ctx, `MOUVEMENT ${num}`, X0, 168, t, e.word + 0.05);
    spin(ctx, word, X0, 292, fit(ctx, word, 150, XR - X0), t, e.word, { color: bgc === WHITE ? INK : WHITE });
  }
  function movementTag(ctx, t, e, bgc, a, b) {
    const c = bgc === WHITE ? INK : WHITE;
    reveal(ctx, a, X0, 700, 66, t, e.tag, { color: c });
    reveal(ctx, b, X0, 790, 66, t, e.tag + 0.12, { color: c, underline: ORANGE });
  }

  // connect: the light is the hub, three links reach out on the beat
  const N = { hx: 1400, hy: 640, nodes: [[1400, 420, 'À JÉSUS', -1], [1640, 830, 'À L’ÉGLISE', 1], [1160, 830, 'AUX AUTRES', 1]] };
  const connect = {
    range: S.S.connect,
    draw(ctx, t) {
      bg(ctx, NAVY);
      const e = ev.connect;
      movementHead(ctx, t, e, NAVY, 1, 'CONNECTER');
      // once all three are linked, a ring joins them: they belong to each other too
      const ring = ease.inOutCubic(prog(t, e.nodes[2] + 0.15, 0.6));
      const [p1, p2, p3] = N.nodes.map(([x, y]) => [x, y]);
      poly(ctx, [p1, p2, p3, p1], ring, 'rgba(255,255,255,0.35)', 3);
      N.nodes.forEach(([x, y, label, side], i) => {
        line(ctx, N.hx, N.hy, x, y, ease.inOutCubic(prog(t, e.nodes[i] - 0.3, 0.3)), ORANGE, 5);
        const p = ease.outBack(prog(t, e.nodes[i], 0.3), 2.6);
        if (p > 0) { const s = 30 * p; ctx.fillStyle = WHITE; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
        reveal(ctx, label, x, y + side * 58, 38, t, e.nodes[i], { weight: 800, align: 'center' });
      });
      movementTag(ctx, t, e, NAVY, 'CONNECTÉ', 'POUR APPARTENIR.');
    },
    sq() { return { x: N.hx, y: N.hy, s: 60, r: 0, a: 1 }; },
  };

  // transform: the light climbs the 242 staircase, one step per beat
  const St = { x0: 1010, w: 250, base: 900, h: [130, 260, 390] };
  const transform = {
    range: S.S.transform,
    draw(ctx, t) {
      bg(ctx, WHITE);
      const e = ev.transform;
      movementHead(ctx, t, e, WHITE, 2, 'TRANSFORMER');
      line(ctx, St.x0 - 140, St.base, St.x0 + 3 * St.w, St.base, ease.inOutCubic(prog(t, e.word + 0.2, 0.6)), BLUE, 4);
      ['LA PAROLE', 'LA COMMUNION', 'LA PRIÈRE'].forEach((name, i) => {
        const x = St.x0 + i * St.w, top = St.base - St.h[i];
        poly(ctx, [[x + 6, St.base], [x + 6, top], [x + St.w - 6, top], [x + St.w - 6, St.base]], ease.inOutCubic(prog(t, e.steps[i] - 0.32, 0.32)), BLUE, 8);
        reveal(ctx, name, x + St.w / 2, top + 44, fit(ctx, name, 28, St.w - 40, 800), t, e.steps[i], { color: INK, weight: 800, align: 'center' });
      });
      movementTag(ctx, t, e, WHITE, 'TRANSFORMÉ', 'POUR DEVENIR.');
    },
    sq(ctx, t) {
      const e = ev.transform;
      const stops = [{ t: e.word, x: St.x0 - 70, y: St.base - 28, s: 52 }]
        .concat(e.steps.map((tt, i) => ({ t: tt, x: St.x0 + i * St.w + St.w / 2, y: St.base - St.h[i] - 30, s: 52 })));
      return hops(t, stops, 0.32, 110);
    },
  };

  // send: from the light, three lines go out, each carrying a smaller light to its end
  const Sd = { hx: 1400, hy: 640, arrows: [[1140, 440, 'SERVIR', -1], [1660, 440, 'TÉMOIGNER', -1], [1400, 900, 'FAIRE DES DISCIPLES', 1]] };
  const send = {
    range: S.S.send,
    draw(ctx, t) {
      bg(ctx, BLUE);
      const e = ev.send;
      movementHead(ctx, t, e, BLUE, 3, 'ENVOYER');
      Sd.arrows.forEach(([x, y, label, side], i) => {
        const k = ease.inOutCubic(prog(t, e.arrows[i] - 0.3, 0.3));
        if (k <= 0) return;
        line(ctx, Sd.hx, Sd.hy, x, y, k, ORANGE, 6);
        ctx.save(); ctx.translate(lerp(Sd.hx, x, k), lerp(Sd.hy, y, k)); ctx.rotate((1 - k) * Math.PI);
        ctx.fillStyle = ORANGE; ctx.fillRect(-11, -11, 22, 22); ctx.restore();
        reveal(ctx, label, x, y + side * 56, 38, t, e.arrows[i], { weight: 800, align: 'center' });
      });
      movementTag(ctx, t, e, BLUE, 'ENVOYÉ', 'POUR IMPACTER.');
    },
    sq() { return { x: Sd.hx, y: Sd.hy, s: 60, r: 0, a: 1 }; },
  };

  // ---------- 08 · Sunday gathers, Monday sends ----------
  const Su = { sx: 1380, sy: 540, size: 380 };
  const sunday = {
    range: S.S.sunday,
    draw(ctx, t) {
      const e = ev.sunday;
      bg(ctx, WHITE);
      // they come from everywhere and gather around the light
      for (let i = 0; i < 44; i++) {
        const a = U.hash(5, i) * Math.PI * 2, r0 = 760 + U.hash(6, i) * 520;
        const k = ease.inCubic(prog(t, e.gather - 0.12 + U.hash(7, i) * 0.12, 0.55));
        if (k <= 0 || k >= 1) continue;
        const r = lerp(r0, 60, k), s = 14 + U.hash(8, i) * 10;
        ctx.globalAlpha = 1 - k * k; ctx.fillStyle = BLUE;
        ctx.fillRect(Su.sx + Math.cos(a) * r - s / 2, Su.sy + Math.sin(a) * r - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      const ck = prog(t, e.gather, 0.55);
      corners(ctx, Su.sx, Su.sy, Su.size, BLUE, [ck, ck, ck, ck]);
      reveal(ctx, 'LE DIMANCHE', X0, 420, 104, t, e.line1, { color: INK });
      reveal(ctx, 'RASSEMBLE.', X0, 560, 130, t, e.line1 + 0.25, { color: BLUE });
      // Monday: the frame opens from the light and everyone is sent out
      opening(ctx, Su.sx, Su.sy, ease.inOutCubic(prog(t, e.send - 0.15, 0.45)), () => {
        bg(ctx, BLUE);
        const k = ease.outExpo(prog(t, e.send, 1.1));
        for (let i = 0; i < 60; i++) {
          const a = U.hash(9, i) * Math.PI * 2, sp = 0.35 + U.hash(10, i) * 0.9, r = 80 + k * sp * 1300, s = 10 + U.hash(11, i) * 18;
          ctx.save(); ctx.translate(Su.sx + Math.cos(a) * r, Su.sy + Math.sin(a) * r); ctx.rotate(k * (U.hash(12, i) - 0.5) * 6);
          ctx.fillStyle = i % 3 ? WHITE : ORANGE; ctx.globalAlpha = 1 - k * 0.6; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
        }
        const fk = 1 + ease.outCubic(prog(t, e.send, 0.8)) * 2.5;   // the corners fly apart
        ctx.save(); ctx.globalAlpha = 1 - prog(t, e.send + 0.2, 0.5);
        corners(ctx, Su.sx, Su.sy, Su.size * fk, WHITE);
        ctx.restore();
        reveal(ctx, 'LE LUNDI', X0, 420, 104, t, e.line2 - 0.25);
        spin(ctx, 'ENVOIE.', X0, 572, 150, t, e.line2, { color: ORANGE });
      });
    },
    sq(ctx, t) {
      const k = prog(t, ev.sunday.send - 0.1, 0.4);
      return { x: Su.sx, y: Su.sy, s: Su.size * 0.229 * (1 + 0.4 * Math.sin(Math.PI * k)), r: -ease.inOutCubic(k) * Math.PI, a: 1 };
    },
  };

  // ---------- 09 · the week ----------
  const Wk = { lx: X0 + 14, y0: 390, dy: 110 };
  const week = {
    range: S.S.week,
    draw(ctx, t) {
      bg(ctx, NAVY);
      const e = ev.week;
      kicker(ctx, 'VIVRE LA ZONE', X0, 168, t, e.title);
      reveal(ctx, 'UNE SEMAINE, UNE VIE', X0, 262, 72, t, e.title + 0.05);
      line(ctx, Wk.lx, Wk.y0 - 30, Wk.lx, Wk.y0 + 4 * Wk.dy + 30, ease.inOutCubic(prog(t, e.title, 0.6)), 'rgba(255,255,255,0.25)', 3);
      [['DIM', 'CULTE ZONE', 'Toute la maison, chaque dimanche'],
        ['SEM. A', 'ZONE DE CROISSANCE', 'Environ 8 personnes autour d’un Berger'],
        ['SEM. B', 'ZONE FAMILY', 'La foi vécue à la maison'],
        ['VEN', 'PRIÈRE ENSEMBLE', '60 à 90 minutes pour apprendre à prier'],
        ['7/7', 'ZONE DIGITAL', 'L’application ZONE 242, chaque jour']].forEach(([d, n, s], i) => {
        const y = Wk.y0 + i * Wk.dy, t0 = e.items[i];
        kicker(ctx, d, X0 + 60, y, t, t0, ORANGE, 26);
        reveal(ctx, n, X0 + 250, y - 14, 42, t, t0);
        reveal(ctx, s, X0 + 250, y + 30, 26, t, t0 + 0.1, { color: SOFT, weight: 700 });
      });
      reveal(ctx, 'UNE FOI', 1110, 480, 72, t, e.tag);
      reveal(ctx, 'QUI SE VIT', 1110, 578, 72, t, e.tag + 0.12);
      reveal(ctx, 'CHAQUE JOUR.', 1110, 676, 72, t, e.tag + 0.24, { underline: ORANGE });
    },
    sq(ctx, t) { return hops(t, ev.week.items.map((tt, i) => ({ t: tt, x: Wk.lx, y: Wk.y0 + i * Wk.dy, s: 26 })), 0.28, 30); },
  };

  // ---------- 10 · all the generations ----------
  const Gn = { sx: 1430, sy: 520, size: 380 };
  const gens = {
    range: S.S.gens,
    draw(ctx, t) {
      bg(ctx, WHITE);
      const e = ev.gens;
      kicker(ctx, 'TOUTES LES GÉNÉRATIONS', X0, 168, t, e.title);
      reveal(ctx, 'UNE MÊME MISSION', X0, 262, 72, t, e.title + 0.05, { color: INK });
      const ck = prog(t, e.photo - 0.3, 0.42);
      corners(ctx, Gn.sx, Gn.sy, Gn.size, BLUE, [ck, ck, ck, ck]);
      // one line of life runs from the youngest to the oldest
      [['0–10', ['ZONE KIDS']], ['11–15', ['ZONE TEENS']], ['16 +', ['ZONE YOUTH']], ['TOUS', ['ADULTES', '& FAMILLES']]].forEach(([age, name], i) => {
        const x = X0 + i * 230, y = 470, t0 = e.items[i];
        line(ctx, x, y, x + 210, y, ease.inOutCubic(prog(t, t0 - 0.25, 0.4)), ORANGE, 5);
        spin(ctx, age, x, y + 76, 58, t, t0, { color: BLUE });
        name.forEach((n, j) => reveal(ctx, n, x, y + 146 + j * 36, 28, t, t0 + 0.1 + j * 0.06, { color: INK }));
      });
      reveal(ctx, 'CHAQUE GÉNÉRATION COMPTE.', X0, 840, 60, t, e.tag, { color: INK, underline: ORANGE });
    },
    sq(ctx, t) {
      const k = prog(t, ev.gens.photo - 0.1, 0.4);
      return { x: Gn.sx, y: Gn.sy, s: Gn.size * 0.229 * (1 + 0.3 * Math.sin(Math.PI * k)), r: -ease.inOutCubic(k) * Math.PI / 2, a: 1 };
    },
  };

  // ---------- 11 · 12 · 13 · two communities side by side ----------
  // marks drawn from type and squares: no icons
  const letterMark = (L) => (ctx, x, y, t, t0) => spin(ctx, L, x, y, 230, t, t0, { align: 'center' });
  const textMark = (str, size) => (ctx, x, y, t, t0) => spin(ctx, str, x, y, size, t, t0, { align: 'center' });
  // two squares come together; where they meet, the light
  const unionMark = (ctx, x, y, t, t0) => {
    const k = ease.outBack(prog(t, t0, 0.6), 1.4);
    if (k <= 0) return;
    const off = lerp(220, 52, k), s = 160;
    ctx.save(); ctx.globalAlpha = clamp(k * 3); ctx.strokeStyle = WHITE; ctx.lineWidth = 10;
    ctx.strokeRect(x - off - s / 2, y - s / 2, s, s); ctx.strokeRect(x + off - s / 2, y - s / 2, s, s);
    const ov = s - 2 * off;
    if (ov > 0) { ctx.fillStyle = ORANGE; ctx.fillRect(x - ov / 2, y - s / 2 + 5, ov, s - 10); }
    ctx.restore();
  };
  // one square, and a ring of others around it: a meeting
  const meetMark = (ctx, x, y, t, t0) => {
    const k = prog(t, t0, 0.8);
    if (k <= 0) return;
    ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = 8; ctx.globalAlpha = clamp(k * 3);
    const c = 64 * ease.outBack(clamp(k * 2), 2); ctx.strokeRect(x - c / 2, y - c / 2, c, c);
    ctx.fillStyle = WHITE;
    for (let i = 0; i < 8; i++) {
      const q = ease.outBack(prog(t, t0 + 0.1 + i * 0.05, 0.3), 2);
      if (q <= 0) continue;
      const a = (i / 8) * Math.PI * 2 + t * 0.4, r = 130, s = 28 * q;
      ctx.fillRect(x + Math.cos(a) * r - s / 2, y + Math.sin(a) * r - s / 2, s, s);
    }
    ctx.restore();
  };
  function pairScene(key, bgc, kick, cards, tag) {
    const cx = [X0, 990], cw = 770, y0 = 250, y1 = 820;
    return {
      range: S.S[key],
      draw(ctx, t) {
        bg(ctx, bgc);
        const e = ev[key];
        kicker(ctx, kick, X0, 168, t, e.a);
        cards.forEach((c, i) => {
          const t0 = i ? e.b : e.a, x = cx[i], mx = x + cw / 2;
          frame(ctx, x, y0, cw, y1 - y0, prog(t, t0 - 0.15, 0.4), WHITE);   // the frame lands with the thwack
          c.mark(ctx, mx, 445, t, t0 + 0.05);
          reveal(ctx, c.name, mx, 650, fit(ctx, c.name, 48, cw - 80), t, t0 + 0.2, { align: 'center' });
          reveal(ctx, c.sub, mx, 708, fit(ctx, c.sub, 28, cw - 80, 700), t, t0 + 0.3, { color: SOFT, weight: 700, align: 'center' });
        });
        reveal(ctx, tag, CX, 930, fit(ctx, tag, 52, XR - X0), t, e.tag, { align: 'center', underline: ORANGE });
      },
      sq(ctx, t) {
        const e = ev[key];
        return hops(t, [{ t: e.a + 0.2, x: cx[0] + cw / 2, y: 778, s: 22 }, { t: e.b + 0.2, x: cx[1] + cw / 2, y: 778, s: 22 }], 0.3, 120);
      },
    };
  }
  const menwomen = pairScene('menwomen', BLUE, 'DEUX UNIVERS · TOUTE L’ANNÉE', [
    { mark: letterMark('M'), name: 'ZONE MEN', sub: 'Des hommes de foi, de caractère et d’impact.' },
    { mark: letterMark('W'), name: 'ZONE WOMEN', sub: 'Des femmes de foi, d’influence et de destinée.' },
  ], 'FOI · IDENTITÉ · INFLUENCE · DESTINÉE.');
  const couples = pairScene('couples', NAVY, 'CHAQUE SAISON COMPTE', [
    { mark: unionMark, name: 'GALA DES COUPLES', sub: 'Honorer l’alliance. Célébrer l’amour.' },
    { mark: meetMark, name: 'RENCONTRE DES CÉLIBATAIRES', sub: 'Bien vivre sa saison, préparer son avenir.' },
  ], 'BÂTIR LA FAMILLE, PRÉPARER L’AVENIR.');
  const camps = pairScene('camps', BLUE, '242 CAMPS · IMMERSION', [
    { mark: textMark('11–15', 170), name: 'CAMP TEENS', sub: 'Une identité solide en Christ.' },
    { mark: textMark('16 +', 190), name: 'CAMP YOUTH', sub: 'Vocation, leadership, mission.' },
  ], 'UNE GÉNÉRATION QUI IMPACTE.');

  // ---------- 14 · signature programmes ----------
  const signature = {
    range: S.S.signature,
    draw(ctx, t) {
      bg(ctx, WHITE);
      const e = ev.signature;
      kicker(ctx, 'NOS PROGRAMMES SIGNATURE', X0, 168, t, e.title);
      reveal(ctx, 'TOUTE L’ANNÉE', X0, 262, 72, t, e.title + 0.05, { color: INK });
      [['CHAMBRE HAUTE', ['Présence, adoration,', 'intercession · 4 fois par an']],
        ['ZONE OUT', ['La Zone hors les murs,', 'des souvenirs ensemble']],
        ['ZONE SERVES', ['La Zone sort', 'pour servir la ville']],
        ['SERVE DAY', ['Découvrir un service,', 'trouver sa place']]].forEach(([name, sub], i) => {
        const x = X0 + i * 400, t0 = e.items[i];
        line(ctx, x, 380, x, 700, ease.inOutCubic(prog(t, t0 - 0.2, 0.45)), BLUE, 4);
        spin(ctx, `0${i + 1}`, x + 36, 452, 92, t, t0, { color: BLUE });
        reveal(ctx, name, x + 36, 562, fit(ctx, name, 40, 340), t, t0 + 0.1, { color: INK });
        sub.forEach((s, j) => reveal(ctx, s, x + 36, 616 + j * 36, fit(ctx, s, 25, 340, 700), t, t0 + 0.18 + j * 0.05, { color: MUTE, weight: 700 }));
      });
      reveal(ctx, 'MOINS DE PLATEFORME, PLUS DE PRÉSENCE.', X0, 850, 54, t, e.tag, { color: INK, underline: ORANGE });
    },
    sq(ctx, t) { return hops(t, ev.signature.items.map((tt, i) => ({ t: tt, x: X0 + i * 400, y: 380, s: 24 })), 0.28, 70); },
  };

  // ---------- 15 · the big gatherings: one stage, then they line up into a system ----------
  const GA = [['PUISSANCE & GUÉRISON', 'Deux séminaires pour rencontrer Dieu'],
    ['AIGLES & OUVRIERS', 'Célébrer ceux qui font vivre la Zone'],
    ['242 BUSINESS CONFERENCE', 'Foi · business · leadership · impact'],
    ['14 JOURS · 242 HOURS', 'Jeûne et prière, chaque janvier']];
  const gather = {
    range: S.S.gather,
    draw(ctx, t) {
      bg(ctx, NAVY);
      const e = ev.gather;
      ghost(ctx, t, 1560, 520, 820, WHITE, 0.05);
      kicker(ctx, 'LES GRANDS RASSEMBLEMENTS 242', X0, 168, t, e.title);
      reveal(ctx, 'UNE FOIS PAR AN', X0, 262, 72, t, e.title + 0.05);
      const leaveAt = (i) => (i < 3 ? e.items[i + 1] : e.tag) - 0.12;
      GA.forEach(([n, s], i) => {
        if (t < e.items[i] || t > leaveAt(i) + 0.35) return;
        const out = ease.inCubic(prog(t, leaveAt(i), 0.3));
        ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -out * 70);
        G.text(ctx, `0${i + 1}`, XR, 520, { size: 220, fam: F, weight: 900, color: WHITE, align: 'right', baseline: 'middle', alpha: 0.12 });
        spin(ctx, n, X0 + 60, 500, fit(ctx, n, 100, 1300), t, e.items[i]);
        reveal(ctx, s, X0 + 60, 590, 34, t, e.items[i] + 0.15, { color: SOFT, weight: 700 });
        ctx.restore();
      });
      // each event docks on the shelf as the next one takes the stage
      GA.forEach(([n], i) => {
        const k = ease.outCubic(prog(t, leaveAt(i), 0.4));
        if (k <= 0) return;
        const x = X0 + i * 404, y = 760 + (1 - k) * 40;
        ctx.save(); ctx.globalAlpha = k;
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(x, y, 384, 84);
        G.text(ctx, `0${i + 1}`, x + 22, y + 42, { size: 22, fam: MONO, weight: 500, color: ORANGE, baseline: 'middle' });
        G.text(ctx, n, x + 70, y + 42, { size: fit(ctx, n, 22, 296, 800), fam: F, weight: 800, color: WHITE, baseline: 'middle' });
        ctx.restore();
      });
      // and one line ties them together: a system, not a calendar
      line(ctx, X0, 900, X0 + 3 * 404 + 384, 900, ease.inOutCubic(prog(t, e.tag, 0.6)), ORANGE, 5);
      reveal(ctx, 'PAS UN CALENDRIER :', X0 + 60, 470, 84, t, e.tag);
      reveal(ctx, 'UN SYSTÈME.', X0 + 60, 572, 84, t, e.tag + 0.12, { underline: ORANGE });
    },
    // the light is the stage's bullet: a turn for each new event, then it marks the conclusion
    sq(ctx, t) {
      const e = ev.gather;
      return hops(t, e.items.map((tt) => ({ t: tt, x: X0 + 18, y: 500, s: 32 })).concat([{ t: e.tag, x: X0 + 18, y: 470, s: 32 }]), 0.3, 0);
    },
  };

  // ---------- 16 · the goal: 2 420, one square for every ten people ----------
  const Cp = { gx: 1018, gy: 300, cell: 28, step: 34, cols: 22, n: 242 };
  const cap = {
    range: S.S.cap,
    draw(ctx, t) {
      bg(ctx, BLUE);
      const e = ev.cap;
      kicker(ctx, 'LE CAP', X0, 168, t, e.start);
      const k = ease.inOutCubic(prog(t, e.countFrom, e.countTo - e.countFrom));
      const n = Math.round(lerp(50, 2420, k)), filled = Math.round(n / 10);
      const show = ease.outCubic(prog(t, e.start, 0.5));
      for (let i = 1; i < Cp.n; i++) {   // cell 0 is the light itself
        const x = Cp.gx + (i % Cp.cols) * Cp.step, y = Cp.gy + Math.floor(i / Cp.cols) * Cp.step;
        if (i < filled) { ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillRect(x, y, Cp.cell, Cp.cell); }
        else { ctx.strokeStyle = `rgba(255,255,255,${0.18 * show})`; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, Cp.cell - 2, Cp.cell - 2); }
      }
      if (t >= e.countFrom - 0.2) {
        const str = n.toLocaleString('fr-FR').replace(/\s/g, ' ');
        const pop = 1 + 0.08 * Math.sin(Math.PI * prog(t, e.countTo, 0.3));
        ctx.save(); ctx.translate(X0, 460); ctx.scale(pop, pop);
        G.text(ctx, str, 0, 0, { size: 200, fam: F, weight: 900, color: WHITE, baseline: 'middle', alpha: prog(t, e.countFrom - 0.2, 0.3) });
        ctx.restore();
      }
      reveal(ctx, 'PERSONNES ACTIVES,', X0, 620, 46, t, e.label);
      reveal(ctx, 'INTÉGRÉES ET ENGAGÉES', X0, 680, 46, t, e.label + 0.1);
      const sk = prog(t, e.stamp, 0.24);
      if (sk > 0) {
        const s = lerp(2.2, 1, ease.outBack(sk, 1.8)), label = 'EN 36 MOIS', ls = 52, lw = G.measure(ctx, label, ls, F, 900) + 70;
        ctx.save(); ctx.translate(X0 + lw / 2, 810); ctx.rotate(-0.07); ctx.scale(s, s); ctx.globalAlpha = clamp(sk * 4);
        ctx.fillStyle = ORANGE; ctx.fillRect(-lw / 2, -ls * 0.85, lw, ls * 1.7);
        G.text(ctx, label, 0, 0, { size: ls, fam: F, weight: 900, color: WHITE, align: 'center', baseline: 'middle' });
        ctx.restore();
      }
    },
    sq() { return { x: Cp.gx + Cp.cell / 2, y: Cp.gy + Cp.cell / 2, s: Cp.cell, r: 0, a: 1 }; },
  };

  // ---------- 17 · Isaiah 60:1: a sunrise over the water ----------
  // the light goes down behind the horizon, then rises as the sun while the verse lights up
  // line by line on the existing sound cues; its light then takes the whole frame
  const rgbOf = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mixHex = (a, b, k) => { const P = rgbOf(a), Q = rgbOf(b); return `rgb(${P.map((v, i) => Math.round(v + (Q[i] - v) * clamp(k))).join(',')})`; };
  const NIGHT = '#05031A', HY = H * 0.72;
  function lightLine(ctx, str, x, y, size, weight, t, t0) {
    if (t < t0) return;
    const total = G.measure(ctx, str, size, F, weight), x0 = x - total / 2;
    const gx = lerp(x0 - 30, x0 + total + 160, ease.outCubic(prog(t, t0, 0.45 + str.length * 0.012)));
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === ' ') continue;
      const c = x0 + G.measure(ctx, str.slice(0, i), size, F, weight) + G.measure(ctx, ch, size, F, weight) / 2;
      const k = clamp((gx - c) / 120);
      if (k <= 0) continue;
      const hot = Math.max(0, 1 - Math.abs(gx - c) / 180);
      ctx.save();
      ctx.shadowColor = 'rgba(255,170,110,0.85)'; ctx.shadowBlur = 8 + 34 * hot;
      G.text(ctx, ch, c, y + (1 - ease.outCubic(k)) * size * 0.3, { size, fam: F, weight, color: hot > 0.35 ? '#FFE9C9' : WHITE, align: 'center', baseline: 'middle', alpha: k });
      ctx.restore();
    }
  }
  const isaiah = {
    range: S.S.isaiah,
    draw(ctx, t) {
      const e = ev.isaiah, s0 = S.S.isaiah[0];
      const dawn = ease.inOutQuad(prog(t, s0 + 0.2, e.ref - s0));
      const rise = ease.inOutCubic(prog(t, s0 + 0.15, e.l3 - s0));
      const flood = ease.inExpo(prog(t, e.swell + 0.5, e.cut - e.swell - 0.5));
      const sx = CX, sy = lerp(HY + 120, H * 0.6, rise), ss = 116;
      const sky = ctx.createLinearGradient(0, 0, 0, HY);
      sky.addColorStop(0, mixHex(NIGHT, NAVY, dawn));
      sky.addColorStop(0.6, mixHex(NIGHT, BLUE, dawn));
      sky.addColorStop(1, mixHex('#140A45', ORANGE, dawn));
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HY);
      for (let i = 0; i < 70; i++) {
        const a = (1 - dawn) * (0.45 + 0.35 * Math.sin(t * 2.2 + i * 1.7)) * clamp((t - s0) / 0.3);
        if (a <= 0.01) continue;
        const r = 1 + U.hash(33, i) * 1.8;
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(U.hash(31, i) * W, U.hash(32, i) * HY * 0.8, r, r);
      }
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, HY); ctx.clip();
      const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, lerp(200, 640, dawn));
      halo.addColorStop(0, `rgba(255,214,170,${0.75 * rise})`);
      halo.addColorStop(0.4, `rgba(255,140,90,${0.28 * rise})`);
      halo.addColorStop(1, 'rgba(255,120,80,0)');
      ctx.fillStyle = halo; ctx.fillRect(0, 0, W, HY);
      ctx.translate(sx, sy); ctx.rotate(t * 0.05);
      ctx.fillStyle = `rgba(255,236,210,${0.08 * dawn})`;
      for (let i = 0; i < 18; i++) {
        ctx.rotate((Math.PI * 2) / 18);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-70, -W); ctx.lineTo(70, -W); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, HY); ctx.clip();
      ctx.shadowColor = 'rgba(255,120,70,0.95)'; ctx.shadowBlur = 70;
      ctx.fillStyle = ORANGE; ctx.fillRect(sx - ss / 2, sy - ss / 2, ss, ss);
      ctx.restore();
      ctx.fillStyle = mixHex(NIGHT, NAVY, dawn); ctx.fillRect(0, HY, W, H - HY);
      for (let j = 0; j < 9; j++) {
        const f = 1 - j / 9;
        const w = ss * (0.6 + 1.6 * f) * (0.75 + 0.25 * Math.sin(t * 3.1 + j * 1.9));
        ctx.fillStyle = `rgba(255,${Math.round(120 + 60 * f)},80,${0.55 * f * rise})`;
        ctx.fillRect(sx - w / 2 + Math.sin(t * 1.7 + j * 0.8) * 14, HY + 10 + j * 13, w, 5);
      }
      const hk = ease.outCubic(prog(t, s0, 0.8));
      ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.25 * dawn})`; ctx.fillRect(CX - (W / 2) * hk, HY - 1, W * hk, 2);
      [['« LÈVE-TOI,', e.l1, 124, 900, 0.165], ['SOIS ÉCLAIRÉ,', e.l2, 102, 900, 0.285],
        ['CAR TA LUMIÈRE ARRIVE,', e.l3, 64, 800, 0.385], ['ET LA GLOIRE DE L’ÉTERNEL SE LÈVE SUR TOI. »', e.l3 + 0.5, 45, 700, 0.455]]
        .forEach(([str, t0, size, weight, yy]) => lightLine(ctx, str, CX, H * yy, fit(ctx, str, size, XR - X0, weight), weight, t, t0));
      kicker(ctx, 'ÉSAÏE 60:1', CX, H * 0.9, t, e.ref, ORANGE, 40, 'center');
      if (flood > 0) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, lerp(ss, Math.hypot(W, H), flood));
        g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.75, `rgba(255,252,244,${flood})`); g.addColorStop(1, 'rgba(255,250,240,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const all = clamp((flood - 0.65) / 0.35);
        if (all > 0) { ctx.fillStyle = `rgba(255,255,255,${all})`; ctx.fillRect(0, 0, W, H); }
      }
    },
    sq: () => null,   // the scene draws its own sun
  };

  // ---------- the film ----------
  const blank = (range) => ({ range, is3d: true, draw: (ctx) => bg(ctx, '#000'), sq: () => null });
  const SCENES = [blank(S.S.open3d), vision, rooted, crowd, acts, connect, transform, send, sunday, week, gens,
    menwomen, couples, camps, signature, gather, cap, isaiah, blank(S.S.final3d)];
  const TRAVEL = [0.32, 0.08];   // the light leaves 0.32 s before a cut and lands 0.08 s after it
  const WIPE = [0.18, 0.32];     // the next scene opens from the light
  const FADE = 0.45;             // into Isaiah: a slow dissolve into the night
  let off = null;                // offscreen canvas for that dissolve

  function fadeCut(ctx, t, a, A, B) {
    A.draw(ctx, t);
    if (!off) { off = document.createElement('canvas'); off.width = ctx.canvas.width; off.height = ctx.canvas.height; }
    const o2 = off.getContext('2d');
    o2.setTransform(1, 0, 0, 1, 0, 0); o2.clearRect(0, 0, off.width, off.height);
    o2.setTransform(ctx.getTransform());
    B.draw(o2, t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = ease.inOutCubic(prog(t, a - FADE, 2 * FADE)); ctx.drawImage(off, 0, 0); ctx.restore();
  }

  Studio.film({
    async init() {
      await Studio.loadFont(F, 'assets/fonts/montserrat-latin-700-normal.woff2', 700);
      await Studio.loadFont(F, 'assets/fonts/montserrat-latin-800-normal.woff2', 800);
      await Studio.loadFont(F, 'assets/fonts/montserrat-latin-900-normal.woff2', 900);
      await Studio.loadFont(MONO, 'assets/fonts/ibm-plex-mono-latin-500-normal.woff2', 500);
    },
    draw(ctx, t) {
      let idx = SCENES.findIndex((sc) => t >= sc.range[0] && t < sc.range[1]);
      if (idx < 0) idx = SCENES.length - 1;
      const cur = SCENES[idx], prev = SCENES[idx - 1], next = SCENES[idx + 1];
      // the cut that matters now: the one that opened this scene, or the one coming next
      let cut = null;
      if (!cur.is3d && prev && !prev.is3d && t < cur.range[0] + FADE) cut = { a: cur.range[0], A: prev, B: cur };
      else if (!cur.is3d && next && !next.is3d && t >= next.range[0] - FADE) cut = { a: next.range[0], A: cur, B: next };
      const fade = cut && cut.B === isaiah;
      // where the light is: in its scene, or travelling across a cut
      let st = cur.sq(ctx, t);
      if (cut) {
        const tr = fade ? [FADE, 0.25] : TRAVEL;
        if (t >= cut.a - tr[0] && t < cut.a + tr[1]) {
          const p0 = cut.A.sq(ctx, cut.a - tr[0]);
          const p1 = fade ? { x: CX, y: HY + 30, s: 60, r: 0, a: 0 } : cut.B.sq(ctx, cut.a + tr[1]);
          if (p0 && p1) {
            const q = ease.inOutCubic(prog(t, cut.a - tr[0], tr[0] + tr[1]));
            st = { x: lerp(p0.x, p1.x, q), y: lerp(p0.y, p1.y, q) - Math.sin(Math.PI * q) * 160, s: lerp(p0.s, p1.s, q),
              r: (1 - q) * -Math.PI, a: lerp(p0.a ?? 1, p1.a ?? 1, q) };
          }
        }
      }
      // the picture
      if (cut && fade && t >= cut.a - FADE) fadeCut(ctx, t, cut.a, cut.A, cut.B);
      else if (cut && !fade && t >= cut.a - WIPE[0] && t < cut.a + WIPE[1]) {
        cut.A.draw(ctx, t);
        const o = st || { x: CX, y: H / 2 };
        opening(ctx, o.x, o.y, ease.inOutCubic(prog(t, cut.a - WIPE[0], WIPE[0] + WIPE[1])), () => cut.B.draw(ctx, t));
      } else cur.draw(ctx, t);
      square(ctx, st);
      // the strong moments: a white flash on the downbeat of each drop
      const fl = S.drops.reduce((m, d) => (t >= d && t < d + 0.4 ? Math.max(m, 0.6 * Math.exp(-(t - d) * 12)) : m), 0);
      if (fl > 0.01 && !cur.is3d) { ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.fillRect(0, 0, W, H); }
    },
    post: { paper: 0, vignette: 0.1, grain: 0.02 },
    fadeOut: 0,
  });
})();
