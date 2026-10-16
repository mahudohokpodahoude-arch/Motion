// THE ILLUSTRATIONS of the ZONE 242 vision film (v2): the places and moments of the Zone, drawn with
// the kit (K) and the cast (P). Every function is a pure function of t; times come from the score.
(function () {
  const U = globalThis.U, K = globalThis.K, P = globalThis.P, G = globalThis.G;
  const { clamp, lerp } = U;
  const W = G.W, H = G.H, C = K.C;
  const TAU = Math.PI * 2;
  const IL = {};
  const prog = K.prog, ez = K.ez;

  // a tapered branch from A to B, grown to k
  function branch(ctx, ax, ay, bx, by, wa, wb, k, col) {
    if (k <= 0) return;
    const ex = lerp(ax, bx, k), ey = lerp(ay, by, k), w2 = lerp(wa, wb, k);
    const d = Math.hypot(ex - ax, ey - ay) || 1e-3, nx = -(ey - ay) / d, ny = (ex - ax) / d;
    ctx.beginPath();
    ctx.moveTo(ax + nx * wa / 2, ay + ny * wa / 2); ctx.lineTo(ex + nx * w2 / 2, ey + ny * w2 / 2);
    ctx.arc(ex, ey, w2 / 2, Math.atan2(ny, nx), Math.atan2(-ny, -nx), true);
    ctx.lineTo(ax - nx * wa / 2, ay - ny * wa / 2); ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
  }
  IL.branch = branch;

  // ======================= COTONOU: the skyline of the city, then its lights =======================
  const CITY = (() => {
    const far = [], near = [], palms = [], motos = [];
    for (let x = -30, i = 0; x < W + 40; i++) { const w = 46 + U.hash(301, i) * 96; far.push({ x, w, h: 60 + U.hash(302, i) * 120 + (x > 1300 ? 120 : 0) * U.hash(306, i), i }); x += w + 4; }
    for (let x = -20, i = 0; x < W + 40; i++) {
      const w = 64 + U.hash(303, i) * 130, right = clamp((x - 1150) / 500);
      near.push({ x, w, h: 84 + U.hash(304, i) * 150 + right * (110 + U.hash(305, i) * 170), i, tank: U.hash(307, i) > 0.55, ant: U.hash(308, i) > 0.7, step: U.hash(309, i) > 0.75 });
      x += w + 8 + U.hash(310, i) * 26;
    }
    [70, 420, 760, 1080, 1520, 1840].forEach((x, i) => palms.push({ x: x + U.hash(311, i) * 60, h: 150 + U.hash(312, i) * 70, lean: (U.hash(313, i) - 0.5) * 0.5 }));
    for (let i = 0; i < 11; i++) motos.push({ x0: U.hash(321, i) * (W + 200), v: (50 + U.hash(322, i) * 90) * (i % 2 ? 1 : -1), lane: i % 2 });
    return { far, near, palms, motos };
  })();
  const LIT = ['#FFF3E6', '#FFF3E6', '#FFF3E6', '#FF8A6B', '#B9B2FF'];
  function moto(ctx, x, y, dir, lit) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    if (lit > 0) K.glow(ctx, 15, -7, 26, '#FFF3E6', 0.35 * lit);
    K.circ(ctx, -9, -4.5, 4.5, '#07004A'); K.circ(ctx, 10, -4.5, 4.5, '#07004A');
    K.fillRR(ctx, -11, -11, 24, 6, 3, '#07004A');
    K.fillRR(ctx, -5, -23, 7, 13, 3, '#07004A'); K.circ(ctx, -1.5, -26, 4, '#07004A');
    ctx.strokeStyle = '#07004A'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(1, -19); ctx.lineTo(9, -13); ctx.stroke();
    if (lit > 0) K.circ(ctx, 13, -9, 2.2, K.rgba('#FFF3E6', lit));
    ctx.restore();
  }
  function palm(ctx, x, gy, h, lean, t, k) {
    if (k <= 0) return;
    const tx = x + Math.sin(lean) * h, ty = gy - h * k;
    ctx.strokeStyle = '#0A006B'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, gy); ctx.quadraticCurveTo(x + (tx - x) * 0.2, gy - h * 0.6 * k, tx, ty); ctx.stroke();
    if (k < 0.9) return;
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(Math.sin(t * 1.3 + x) * 0.05);
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i - 3.5) * 0.42, len = 58 + (i % 2) * 14, droop = 26;
      const ex = Math.cos(a) * len, ey = Math.sin(a) * len + droop * Math.abs(Math.cos(a));
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(a) * len * 0.55, Math.sin(a) * len * 0.55 - 12, ex, ey);
      ctx.quadraticCurveTo(Math.cos(a) * len * 0.5, Math.sin(a) * len * 0.5 - 2, 0, 4);
      ctx.fillStyle = '#0A006B'; ctx.fill();
    }
    ctx.restore();
  }
  // o: rise (time the city rises), lights (time the lights come on)
  IL.cotonou = (ctx, t, o) => {
    const gy = 1004, light = (x, d = 0) => ez.out(prog(t, o.lights + d + Math.abs(x - 1100) / 1900, 0.35));
    CITY.far.forEach((b) => {
      const k = ez.out(prog(t, o.rise - 0.2 + (b.x / W) * 0.45, 0.8));
      if (k <= 0) return;
      const h = b.h * k, y = gy - 40 - h;
      ctx.fillStyle = '#2F1EE6'; ctx.fillRect(b.x, y, b.w, h + 40);
      const lk = light(b.x, 0.15);
      if (lk > 0) for (let yy = y + 10; yy < gy - 50; yy += 15) for (let xx = b.x + 8; xx < b.x + b.w - 6; xx += 12) {
        if (U.hash(b.i * 131 + xx, yy) > 0.42) continue;
        ctx.fillStyle = K.rgba('#FFF3E6', 0.55 * lk); ctx.fillRect(xx, yy, 3, 4);
      }
    });
    CITY.near.forEach((b) => {
      const k = ez.out(prog(t, o.rise - 0.1 + (b.x / W) * 0.5 + U.hash(314, b.i) * 0.08, 0.75));
      if (k <= 0) return;
      const h = b.h * k, y = gy - h;
      ctx.fillStyle = '#12009C'; ctx.fillRect(b.x, y, b.w, h);
      ctx.fillStyle = '#0E0089'; ctx.fillRect(b.x + b.w * 0.72, y, b.w * 0.28, h);
      if (b.step) { ctx.fillStyle = '#12009C'; ctx.fillRect(b.x + b.w * 0.2, y - 26 * k, b.w * 0.5, 26 * k); }
      if (b.tank && k > 0.95) { K.fillRR(ctx, b.x + b.w * 0.15, y - 20, 22, 14, 3, '#0B0077'); ctx.fillStyle = '#0B0077'; ctx.fillRect(b.x + b.w * 0.15 + 4, y - 6, 3, 6); ctx.fillRect(b.x + b.w * 0.15 + 15, y - 6, 3, 6); }
      if (b.ant && k > 0.95) { ctx.strokeStyle = '#0B0077'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.7, y); ctx.lineTo(b.x + b.w * 0.7, y - 34); ctx.stroke(); K.circ(ctx, b.x + b.w * 0.7, y - 35, 2.5, K.rgba(C.ORANGE, 0.5 + 0.5 * Math.sin(t * 4 + b.i))); }
      for (let yy = y + 14, r = 0; yy < gy - 16; yy += 19, r++) for (let xx = b.x + 10, c = 0; xx < b.x + b.w - 12; xx += 15, c++) {
        const hsh = U.hash(b.i * 977 + c, r), lk = light(xx, hsh * 0.35);
        ctx.fillStyle = lk > 0 && hsh < 0.72 ? K.rgba(LIT[Math.floor(hsh * 7) % 5], lk * (0.75 + 0.25 * Math.sin(t * 2 + hsh * 20))) : 'rgba(255,255,255,0.06)';
        ctx.fillRect(xx, yy, 7, 9);
      }
    });
    CITY.palms.forEach((p, i) => palm(ctx, p.x, gy, p.h, p.lean, t, ez.out(prog(t, o.rise + 0.25 + i * 0.05, 0.6))));
    const rk = ez.out(prog(t, o.rise - 0.3, 0.6));
    ctx.fillStyle = '#0C007A'; ctx.fillRect(W / 2 - W / 2 * rk, gy, W * rk, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; for (let x = 0; x < W * rk; x += 60) ctx.fillRect(W / 2 - W / 2 * rk + x, gy + 9, 26, 2);
    const ml = light(W / 2, 0.1), mk = prog(t, o.rise + 0.3, 0.4);
    if (mk > 0) { ctx.save(); ctx.globalAlpha *= mk; CITY.motos.forEach((m) => { const span = W + 200, x = ((m.x0 + m.v * t) % span + span) % span - 100; moto(ctx, x, gy + (m.lane ? 18 : 10), Math.sign(m.v), ml); }); ctx.restore(); }
    ctx.fillStyle = K.vgrad(ctx, gy + 20, H, [[0, '#0E0086'], [1, '#08005E']]); ctx.fillRect(W / 2 - W / 2 * rk, gy + 20, W * rk, H - gy - 20);
    const rl = light(W / 2, 0.2);
    if (rl > 0) for (let i = 0; i < 46; i++) {
      const x = U.hash(331, i) * W, y = gy + 28 + U.hash(332, i) * 46, w = 10 + U.hash(333, i) * 34;
      ctx.fillStyle = K.rgba(i % 4 ? '#FFF3E6' : C.ORANGE_L, rl * (0.25 + 0.2 * Math.sin(t * 3 + i)));
      ctx.fillRect(x + Math.sin(t * 1.4 + i) * 6, y, w, 2);
    }
    // lights rise from the city: thousands of lives
    const pk = prog(t, o.lights, 0.3);
    if (pk > 0) for (let i = 0; i < 90; i++) {
      const life = 2.4 + U.hash(341, i) * 1.6, q = ((t - o.lights) / life + U.hash(342, i)) % 1;
      const x = U.hash(343, i) * W + Math.sin(t * 0.8 + i) * 18, y = gy - 40 - q * 560 * (0.6 + U.hash(344, i) * 0.6), s = 3 + U.hash(345, i) * 5;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * (U.hash(346, i) - 0.5) * 3); ctx.globalAlpha *= pk * Math.sin(Math.PI * q) * 0.85;
      ctx.fillStyle = i % 3 ? '#FFF3E6' : C.ORANGE; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
    }
    K.kicker(ctx, 'COTONOU · BÉNIN', W - 160, 1046, t, o.rise + 0.4, { size: 18, align: 'right', color: K.rgba('#FFFFFF', 0.7), dot: false });
  };

  // ======================= THE TREE: a seed, roots in the Word, a crown full of fruit =======================
  const ROOTS = [
    [[0, 0], [-18, 40], [-60, 78], [-96, 104], [-120, 138]],
    [[0, 0], [10, 46], [-6, 92], [-22, 128]],
    [[0, 0], [22, 38], [58, 80], [96, 112], [126, 140]],
    [[-18, 40], [-34, 70], [-30, 118]],
    [[22, 38], [30, 86], [24, 124]],
    [[-60, 78], [-58, 120]],
    [[58, 80], [56, 122]],
  ];
  const CROWN = [
    [-118, -298, 74, 0], [118, -318, 80, 0], [0, -398, 94, 0], [-60, -352, 70, 1], [74, -372, 76, 1], [-150, -230, 56, 1], [150, -246, 60, 1],
    [-10, -300, 84, 2], [-96, -276, 60, 2], [96, -292, 64, 2], [36, -420, 58, 2], [-46, -428, 52, 2],
  ];
  const CROWN_C = ['#12009A', C.BLUE, '#3B2BE6'];
  const FRUIT = [[-130, -300], [-70, -250], [10, -330], [80, -280], [140, -330], [-20, -420], [50, -380], [-100, -370], [120, -230], [-150, -250], [30, -250], [-40, -360]];
  IL.TREE_TOP = -470;
  // o: x, gy (ground), sprout, roots, grow, hit
  IL.tree = (ctx, t, o) => {
    const { x, gy } = o;
    const sk = ez.out(prog(t, o.sprout - 0.35, 0.7));
    if (sk > 0) {
      const soil = new Path2D(); soil.ellipse(x, gy, 300 * sk, 236 * sk, 0, 0, Math.PI); soil.closePath();
      const sg = ctx.createRadialGradient(x, gy, 20, x, gy, 300);
      sg.addColorStop(0, '#EADFCF'); sg.addColorStop(0.85, '#EFE6DA'); sg.addColorStop(1, '#F3ECE3');
      ctx.fillStyle = sg; ctx.fill(soil);
      ctx.save(); ctx.clip(soil); ctx.strokeStyle = K.rgba('#B9A58C', 0.22); ctx.lineWidth = 2;
      [44, 98, 156].forEach((d, i) => { ctx.beginPath(); ctx.moveTo(x - 300, gy + d); ctx.quadraticCurveTo(x, gy + d + (i % 2 ? 10 : -8), x + 300, gy + d); ctx.stroke(); });
      for (let i = 0; i < 26; i++) K.circ(ctx, x + (U.hash(271, i) - 0.5) * 520, gy + 14 + U.hash(272, i) * 200, 2 + U.hash(273, i) * 3, K.rgba('#B9A58C', 0.25));
      ctx.restore();
    }
    const gl = ez.out(prog(t, o.sprout - 0.3, 0.6));
    ctx.fillStyle = C.INK; ctx.fillRect(x - 330 * gl, gy - 2, 660 * gl, 4);
    const bk = ez.out(prog(t, o.roots - 0.15, 0.5)), by = gy + 150;
    if (bk > 0) {
      const hit = Math.max(0, 1 - Math.abs(t - o.hit - 0.15) / 0.5);
      K.glow(ctx, x, by, 120 + 60 * hit, C.ORANGE, (0.18 + 0.3 * hit) * bk);
      ctx.save(); ctx.translate(x, by); ctx.scale(bk, bk);
      K.fillRR(ctx, -66, -8, 132, 40, 5, C.BLUE);
      for (const sd of [-1, 1]) { const pg = new Path2D(); pg.moveTo(0, -4); pg.quadraticCurveTo(sd * 30, -14, sd * 62, -6); pg.lineTo(sd * 62, 26); pg.quadraticCurveTo(sd * 30, 18, 0, 28); pg.closePath(); ctx.fillStyle = '#FFFFFF'; ctx.fill(pg); }
      ctx.fillStyle = K.rgba(C.INK, 0.14); for (let i = 0; i < 4; i++) { ctx.fillRect(-54, 2 + i * 6, 42, 2); ctx.fillRect(12, 2 + i * 6, 42, 2); }
      ctx.restore();
    }
    ROOTS.forEach((r, i) => {
      const k = ez.io(prog(t, o.roots + i * 0.06, 0.55)), hit = Math.max(0, 1 - Math.abs(t - o.hit - 0.1) / 0.45);
      K.trace(ctx, r.map(([dx, dy]) => [x + dx, gy + dy]), k, C.ORANGE, (i < 3 ? 7 : 4.5) + hit * 3);
    });
    const sp = ez.back(prog(t, o.sprout, 0.5)), gk = ez.out(prog(t, o.grow - 0.1, 0.8));
    if (sp > 0 && gk < 0.3) {
      ctx.save(); ctx.globalAlpha *= 1 - clamp(gk / 0.3); ctx.translate(x, gy); ctx.scale(sp, sp);
      K.glow(ctx, 0, -8, 50, C.ORANGE, 0.35);
      branch(ctx, 0, 0, 0, -58, 7, 5, 1, '#3B2BE6');
      K.ell(ctx, -16, -58, 17, 8, '#3B2BE6', -0.5); K.ell(ctx, 16, -64, 17, 8, C.BLUE, 0.5);
      ctx.restore();
    }
    if (gk > 0) {
      const trunk = '#1B1260';
      branch(ctx, x, gy, x + 4, gy - 300, 40, 18, gk, trunk);
      branch(ctx, x, gy - 150, x - 116, gy - 268, 18, 9, ez.out(prog(t, o.grow + 0.1, 0.6)), trunk);
      branch(ctx, x + 2, gy - 186, x + 124, gy - 296, 18, 9, ez.out(prog(t, o.grow + 0.15, 0.6)), trunk);
      branch(ctx, x + 3, gy - 260, x - 30, gy - 380, 12, 7, ez.out(prog(t, o.grow + 0.2, 0.6)), trunk);
      ctx.fillStyle = K.rgba('#FFFFFF', 0.08); ctx.fillRect(x - 16, gy - 300 * gk, 6, 300 * gk);
      CROWN.forEach(([dx, dy, r, layer], i) => {
        const q = ez.back(prog(t, o.grow + 0.2 + layer * 0.08 + i * 0.025, 0.45));
        if (q <= 0) return;
        const sw = Math.sin(t * 1.6 + i) * 3;
        K.circ(ctx, x + dx + sw, gy + dy, r * q, CROWN_C[layer]);
        if (layer === 2) K.circ(ctx, x + dx + sw - r * 0.3, gy + dy - r * 0.32, r * 0.42 * q, K.rgba('#FFFFFF', 0.1));
      });
      FRUIT.forEach(([dx, dy], i) => {
        const q = ez.back(prog(t, o.grow + 0.55 + i * 0.03, 0.35));
        if (q <= 0) return;
        const hit = Math.max(0, 1 - Math.abs(t - o.hit - i * 0.02) / 0.4);
        if (hit > 0) K.glow(ctx, x + dx, gy + dy, 30, C.ORANGE, 0.5 * hit);
        K.circ(ctx, x + dx, gy + dy, 11 * q, C.ORANGE); K.circ(ctx, x + dx - 3.5, gy + dy - 3.5, 3.2 * q, K.rgba('#FFFFFF', 0.5));
      });
    }
  };

  // ======================= THE CROWD: everyone, then one person found =======================
  const CROWD = (() => {
    const rows = [[8, 150, 600], [7, 190, 690], [6, 240, 800], [5, 300, 930], [4, 380, 1090]];
    const outfits = ['tee', 'shirt', 'dress', 'hoodie', 'blazer', 'tee', 'dress', 'shirt'];
    const tops = [C.ORANGE, C.WHITE, C.BLUE_L, C.NAVY, '#2D2A8F', C.PEACH, C.BLUE, '#FFFFFF', C.ORANGE_L, C.SLATE];
    const hairs = ['short', 'gele', 'afro', 'braids', 'bald', 'puffs', 'long', 'cap', 'bun', 'locs', 'short', 'gray'];
    const list = [];
    let n = 0;
    rows.forEach(([cnt, h, y], r) => {
      for (let i = 0; i < cnt; i++, n++) {
        const x = 900 + (i + 0.5 + (r % 2 ? 0.35 : 0)) * (900 / cnt) + (U.hash(401, n) - 0.5) * 30;
        const hair = hairs[(n * 5) % hairs.length], fem = ['gele', 'braids', 'puffs', 'long', 'bun'].includes(hair) || (hair === 'afro' && n % 2 === 1);
        list.push({ x, y: y + (U.hash(402, n) - 0.5) * 16, h: h * (0.94 + U.hash(403, n) * 0.1), row: r, n,
          o: { build: fem ? 'f' : 'm', skin: P.SKIN[(n * 7) % 6], hair, gele: [C.ORANGE, C.BLUE, '#FFB13B', C.BLUE_L][n % 4], capCol: [C.NAVY, C.ORANGE][n % 2],
            outfit: fem && outfits[n % 8] === 'blazer' ? 'dress' : outfits[n % 8], top: tops[(n * 3) % tops.length], pattern: n % 3 === 0 && fem ? 'dots' : null, patCol: C.WHITE,
            beard: !fem && n % 4 === 1, glasses: n % 7 === 3, mood: ['smile', 'grin', 'smile', 'calm'][n % 4], seed: 60 + n, pose: 'relaxed' } });
      }
    });
    return list;
  })();
  IL.CROWD_FOCUS = 17;   // the person the viewfinder finds (middle row)
  IL.crowdFocus = () => { const f = CROWD[IL.CROWD_FOCUS]; return { x: f.x, chest: f.y - f.h * 0.62, top: f.y - f.h * 0.98, h: f.h }; };
  // o: fill (first pop), lock (the viewfinder locks)
  IL.crowd = (ctx, t, o) => {
    const dim = ez.out(prog(t, o.lock, 0.35)), f = CROWD[IL.CROWD_FOCUS];
    const popAt = (p, i) => K.pop(t, o.fill + (i % 12) * 0.05 + p.row * 0.01, 0.4, 1.6);
    CROWD.forEach((p, i) => {
      if (i === IL.CROWD_FOCUS) return;
      P.person(ctx, p.x, p.y, p.h, Object.assign({ k: popAt(p, i), t, look: Math.sin(t * 0.7 + i) * 0.6 }, p.o));
    });
    if (dim > 0) { ctx.fillStyle = K.rgba(C.NIGHT, 0.68 * dim); ctx.fillRect(0, 0, W, H); K.glow(ctx, f.x, f.y - f.h * 0.7, 300, '#6F64F2', 0.5 * dim); }
    const wave = ez.out(prog(t, o.lock + 0.1, 0.4));
    P.person(ctx, f.x, f.y, f.h, Object.assign({}, f.o, { k: popAt(f, IL.CROWD_FOCUS), t, mood: dim > 0.5 ? 'grin' : f.o.mood, look: dim > 0.5 ? -0.5 : 0,
      hands: wave > 0 ? P.mix(P.hands(f.o.build, 'relaxed'), P.hands(f.o.build, 'wave', t * 2), wave) : null }));
  };

  // ======================= ACTS 2:42: four practices in four tiles =======================
  IL.parole = (ctx, w, h, t, t0) => {
    ctx.fillStyle = C.MIST; ctx.fillRect(0, 0, w, h);
    K.glow(ctx, w / 2, h * 0.45, w * 0.6, '#FFFFFF', 0.9);
    const k = ez.out(prog(t, t0 + 0.05, 0.6));
    ctx.save(); ctx.translate(w / 2, h * 0.6); ctx.scale(lerp(0.7, 1, k), lerp(0.7, 1, k)); ctx.globalAlpha *= clamp(k * 2);
    ctx.save(); ctx.rotate(t * 0.15);
    for (let i = 0; i < 10; i++) { ctx.rotate(TAU / 10); ctx.fillStyle = K.rgba(C.ORANGE, 0.12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -w); ctx.lineTo(10, -w); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    K.fillRR(ctx, -84, -10, 168, 64, 8, C.BLUE);
    for (const sd of [-1, 1]) {
      const pg = new Path2D(); pg.moveTo(0, -4); pg.quadraticCurveTo(sd * 40, -22, sd * 80, -12); pg.lineTo(sd * 80, 48); pg.quadraticCurveTo(sd * 40, 36, 0, 52); pg.closePath();
      ctx.fillStyle = '#FFFFFF'; ctx.fill(pg); K.form(ctx, pg, 0.08, sd * 6, 0);
      ctx.fillStyle = K.rgba(C.INK, 0.16); for (let i = 0; i < 5; i++) ctx.fillRect(sd > 0 ? 12 : -70, 4 + i * 8, 58, 2.4);
    }
    const turn = ((t - t0) * 0.9) % 1.6;
    if (turn < 1) { ctx.save(); ctx.scale(Math.cos(turn * Math.PI), 1); const pg = new Path2D(); pg.moveTo(0, -4); pg.quadraticCurveTo(40, -22, 78, -12); pg.lineTo(78, 46); pg.quadraticCurveTo(40, 34, 0, 50); pg.closePath(); ctx.fillStyle = '#F4F1FF'; ctx.fill(pg); ctx.restore(); }
    K.fillRR(ctx, -3, 46, 6, 34, 2, C.ORANGE);
    ctx.restore();
  };
  IL.communion = (ctx, w, h, t, t0) => {
    ctx.fillStyle = C.PEACH; ctx.fillRect(0, 0, w, h);
    K.glow(ctx, w / 2, h * 0.3, w * 0.7, '#FFFFFF', 0.6);
    const ppl = [
      { x: 0.22, o: { build: 'f', skin: P.SKIN[4], hair: 'gele', gele: C.BLUE, outfit: 'dress', top: C.ORANGE, pattern: 'dots', mood: 'grin', eyes: 'happy' } },
      { x: 0.5, o: { build: 'm', skin: P.SKIN[1], hair: 'short', outfit: 'shirt', top: C.WHITE, mood: 'grin', beard: true } },
      { x: 0.78, o: { build: 'f', skin: P.SKIN[3], hair: 'braids', outfit: 'tee', top: C.BLUE, mood: 'grin', eyes: 'happy' } },
    ];
    const sx = ppl.map((p) => p.x * w), hh = h * 1.0, y = h * 1.45;
    // arms over each other's shoulders: drawn back to front so the arms cross the neighbours
    [0, 2, 1].forEach((i) => {
      const x = sx[i], p = ppl[i];
      const L = i > 0 ? P.u(x, y, hh, sx[i - 1] + hh * 0.06, y - hh * 0.74) : null;
      const R = i < 2 ? P.u(x, y, hh, sx[i + 1] - hh * 0.06, y - hh * 0.74) : null;
      P.person(ctx, x, y + Math.sin(t * 5 + i) * 2, hh, Object.assign({ k: K.pop(t, t0 + 0.05 + i * 0.07, 0.45), t, seed: 80 + i, hands: [L, R], tilt: (i - 1) * -0.08, bust: true }, p.o));
    });
  };
  IL.pain = (ctx, w, h, t, t0) => {
    ctx.fillStyle = '#FFF5EE'; ctx.fillRect(0, 0, w, h);
    K.circ(ctx, w / 2, h / 2, w * 0.44, '#F2D9C4');
    K.circ(ctx, w / 2, h / 2, w * 0.4, '#F7E6D7');
    const k = ez.out(prog(t, t0 + 0.05, 0.5)), split = ez.inOut(prog(t, t0 + 0.4, 0.6));
    ctx.save(); ctx.translate(w / 2, h * 0.52); ctx.scale(lerp(0.6, 1, k), lerp(0.6, 1, k)); ctx.globalAlpha *= clamp(k * 2);
    for (const sd of [-1, 1]) {
      // the hands that hold each half, coming in from the sides
      const hx = sd * (64 + split * 16), skin = sd < 0 ? P.SKIN[2] : P.SKIN[4];
      ctx.save(); ctx.translate(hx, 6); ctx.rotate(sd < 0 ? 0 : Math.PI);
      K.fillRR(ctx, -84, -10, 72, 20, 10, sd < 0 ? C.BLUE : C.ORANGE);
      K.ell(ctx, -8, 0, 14, 11, skin); K.ell(ctx, 1, -9, 7, 4.2, skin);
      ctx.restore();
      ctx.save(); ctx.translate(sd * (2 + split * 16), 0); ctx.rotate(sd * split * 0.25);
      const half = new Path2D(); half.ellipse(0, 0, 52, 22, 0, sd > 0 ? -Math.PI / 2 : Math.PI / 2, sd > 0 ? Math.PI / 2 : Math.PI * 1.5); half.closePath();
      ctx.fillStyle = '#D98A45'; ctx.fill(half); K.form(ctx, half, 0.2, -5, -3);
      ctx.strokeStyle = K.rgba('#FFFFFF', 0.35); ctx.lineWidth = 2.4; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(sd * (14 + i * 16) - 4, -12); ctx.lineTo(sd * (14 + i * 16) + 4, -2); ctx.stroke(); }
      if (split > 0.05) K.ell(ctx, 0, 0, 2 + 3 * split, 16, '#FFE3C2');
      ctx.restore();
    }
    ctx.restore();
    const ck = ez.out(prog(t, t0 + 0.45, 0.6));
    for (let i = 0; i < 8; i++) K.circ(ctx, w / 2 + (U.hash(91, i) - 0.5) * 80 * ck, h * 0.52 + (U.hash(92, i) - 0.3) * 50 * ck, 2.2 * ck, '#C7793A');
    K.circ(ctx, w * 0.8, h * 0.2, 20, '#FFFFFF'); K.circ(ctx, w * 0.8, h * 0.2, 15, '#7A1E2E'); K.circ(ctx, w * 0.8 - 4, h * 0.2 - 4, 4, K.rgba('#FFFFFF', 0.3));
  };
  IL.priere = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#2A1ACF'], [1, '#12008F']]); ctx.fillRect(0, 0, w, h);
    const k = ez.out(prog(t, t0, 0.6));
    K.glow(ctx, w / 2, -h * 0.05, h * 1.0, '#FFFFFF', 0.5 * k);
    ctx.save(); ctx.globalAlpha *= 0.35 * k; ctx.translate(w / 2, -h * 0.1);
    for (let i = -3; i <= 3; i++) { ctx.fillStyle = K.rgba('#FFFFFF', 0.25); ctx.beginPath(); ctx.moveTo(i * 8, 0); ctx.lineTo(i * 46 - 20, h * 1.2); ctx.lineTo(i * 46 + 20, h * 1.2); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    P.person(ctx, w / 2, h * 1.42, h * 1.05, { k: K.pop(t, t0 + 0.05, 0.5), t, seed: 90, build: 'f', skin: P.SKIN[3], hair: 'gele', gele: C.ORANGE, outfit: 'dress', top: C.WHITE, pattern: 'diamond', patCol: C.BLUE_XL, eyes: 'closed', mood: 'calm', pose: 'pray', tilt: -0.08, bust: true });
  };

  // ======================= VIGNETTES: round pictures for the three movements =======================
  IL.node = (ctx, x, y, r, k, bg, draw, ring = '#FFFFFF') => {
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.save(); ctx.shadowColor = 'rgba(4,0,40,0.38)'; ctx.shadowBlur = 44; ctx.shadowOffsetY = 18; K.circ(ctx, 0, 0, r, bg); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip(); K.circ(ctx, 0, 0, r, bg); draw(ctx, r); ctx.restore();
    ctx.lineWidth = Math.max(4, r * 0.055); ctx.strokeStyle = ring; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    ctx.restore();
  };
  const bustAt = (ctx, x, r, h, t, o) => P.person(ctx, x, r * 1.6, h, Object.assign({ t }, o));
  IL.vJesus = (ctx, r, t) => {
    ctx.fillStyle = K.vgrad(ctx, -r, r, [[0, '#3B2BE6'], [1, '#12009A']]); ctx.fillRect(-r, -r, 2 * r, 2 * r);
    ctx.save(); ctx.rotate(t * 0.2);
    for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-r * 0.12, -r * 1.4); ctx.lineTo(r * 0.12, -r * 1.4); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    K.glow(ctx, 0, -r * 0.08, r * 0.9, '#FFFFFF', 0.55);
    ctx.save(); ctx.shadowColor = 'rgba(255,214,203,0.9)'; ctx.shadowBlur = 26;
    K.fillRR(ctx, -r * 0.085, -r * 0.62, r * 0.17, r * 1.12, r * 0.03, '#FFFFFF');
    K.fillRR(ctx, -r * 0.36, -r * 0.33, r * 0.72, r * 0.17, r * 0.03, '#FFFFFF');
    ctx.restore();
  };
  IL.vEglise = (ctx, r, t) => {
    ctx.fillStyle = C.PEACH; ctx.fillRect(-r, -r, 2 * r, 2 * r); K.glow(ctx, 0, -r * 0.5, r * 1.2, '#FFFFFF', 0.5);
    bustAt(ctx, -r * 0.5, r, r * 1.9, t, { build: 'f', skin: P.SKIN[3], hair: 'gele', gele: C.BLUE, outfit: 'dress', top: C.ORANGE, pattern: 'dots', mood: 'grin', seed: 101, pose: 'relaxed' });
    bustAt(ctx, r * 0.5, r, r * 2.0, t, { build: 'm', skin: P.SKIN[1], hair: 'short', outfit: 'shirt', top: C.WHITE, mood: 'smile', beard: true, seed: 102, pose: 'relaxed' });
    bustAt(ctx, 0, r * 1.05, r * 1.45, t, { build: 'kid', skin: P.SKIN[2], hair: 'puffs', top: C.BLUE, mood: 'grin', seed: 103, pose: 'relaxed' });
  };
  IL.vAutres = (ctx, r, t) => {
    ctx.fillStyle = C.MIST; ctx.fillRect(-r, -r, 2 * r, 2 * r); K.glow(ctx, 0, -r * 0.4, r * 1.2, '#FFFFFF', 0.6);
    const h = r * 2.05, xl = -r * 0.42, xr = r * 0.42, y = r * 1.6;
    P.person(ctx, xr, y, h, { t, build: 'm', skin: P.SKIN[4], hair: 'cap', capCol: C.ORANGE, outfit: 'hoodie', top: C.BLUE, mood: 'grin', eyes: 'happy', seed: 104, tilt: -0.08, pose: 'relaxed' });
    P.person(ctx, xl, y, h * 0.97, { t, build: 'm', skin: P.SKIN[1], hair: 'afro', outfit: 'tee', top: C.ORANGE, mood: 'grin', seed: 105, tilt: 0.06, hands: [null, P.u(xl, y, h * 0.97, xr + r * 0.12, y - h * 0.74)] });
  };
  IL.vYou = (ctx, r, t) => {
    ctx.fillStyle = K.vgrad(ctx, -r, r, [[0, '#FFB59E'], [1, C.ORANGE]]); ctx.fillRect(-r, -r, 2 * r, 2 * r); K.glow(ctx, 0, -r * 0.3, r * 1.1, '#FFFFFF', 0.45);
    bustAt(ctx, 0, r, r * 2.1, t, { build: 'f', skin: P.SKIN[2], hair: 'braids', outfit: 'hoodie', top: C.NAVY, mood: 'smile', seed: 106, look: 0, lookY: -1, pose: 'relaxed' });
  };
  IL.vServir = (ctx, r, t) => {
    ctx.fillStyle = C.MIST; ctx.fillRect(-r, -r, 2 * r, 2 * r); K.glow(ctx, 0, -r * 0.4, r * 1.2, '#FFFFFF', 0.6);
    const h = r * 2, y = r * 1.62, xa = -r * 0.42, xb = r * 0.48;
    P.person(ctx, xb, y, h * 0.95, { t, build: 'f', skin: P.SKIN[4], hair: 'gele', gele: C.ORANGE, outfit: 'dress', top: C.BLUE_L, mood: 'grin', seed: 107, hands: [P.u(xb, y, h * 0.95, r * 0.05, y - h * 0.52), null] });
    P.person(ctx, xa, y, h, { t, build: 'm', skin: P.SKIN[1], hair: 'short', top: C.ORANGE, badge: true, mood: 'smile', seed: 108, hands: [null, P.u(xa, y, h, -r * 0.02, y - h * 0.52)] });
    ctx.save(); ctx.translate(r * 0.02, y - h * 0.56); K.fillRR(ctx, -26, -20, 52, 38, 4, '#E9B48A'); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(-4, -20, 8, 38); ctx.restore();
  };
  IL.vTemoigner = (ctx, r, t) => {
    ctx.fillStyle = C.PEACH; ctx.fillRect(-r, -r, 2 * r, 2 * r); K.glow(ctx, 0, -r * 0.4, r * 1.2, '#FFFFFF', 0.5);
    const h = r * 2, y = r * 1.62;
    P.person(ctx, r * 0.45, y, h * 0.96, { t, build: 'm', skin: P.SKIN[3], hair: 'locs', outfit: 'tee', top: C.WHITE, mood: 'calm', seed: 109, look: -0.8, pose: 'relaxed' });
    P.person(ctx, -r * 0.42, y, h, { t, build: 'f', skin: P.SKIN[2], hair: 'bun', outfit: 'tee', top: C.BLUE, mood: 'grin', seed: 110, look: 0.8, pose: 'talk' });
    const bk = 0.92 + 0.08 * Math.sin(t * 4);
    ctx.save(); ctx.translate(-r * 0.05, -r * 0.62); ctx.scale(bk, bk);
    K.fillRR(ctx, -r * 0.3, -r * 0.2, r * 0.6, r * 0.4, r * 0.14, '#FFFFFF');
    K.poly(ctx, [[-r * 0.16, r * 0.18], [-r * 0.02, r * 0.18], [-r * 0.2, r * 0.34]], '#FFFFFF');
    K.fillRR(ctx, -r * 0.03, -r * 0.14, r * 0.06, r * 0.28, 2, C.ORANGE); K.fillRR(ctx, -r * 0.11, -r * 0.07, r * 0.22, r * 0.06, 2, C.ORANGE);
    ctx.restore();
  };
  IL.vDisciples = (ctx, r, t) => {
    ctx.fillStyle = C.MIST; ctx.fillRect(-r, -r, 2 * r, 2 * r); K.glow(ctx, 0, -r * 0.4, r * 1.2, '#FFFFFF', 0.6);
    const y = r * 1.62;
    P.person(ctx, 0, y + r * 0.05, r * 2.05, { t, build: 'm', skin: P.SKIN[0], hair: 'gray', beard: true, glasses: true, outfit: 'shirt', top: C.BLUE, mood: 'smile', seed: 111, pose: 'hold', item: 'book', itemCol: C.ORANGE });
    P.person(ctx, -r * 0.62, y + r * 0.28, r * 1.75, { t, build: 'f', skin: P.SKIN[4], hair: 'puffs', outfit: 'tee', top: C.ORANGE, mood: 'smile', seed: 112, look: 0.7, pose: 'relaxed' });
    P.person(ctx, r * 0.62, y + r * 0.28, r * 1.75, { t, build: 'm', skin: P.SKIN[2], hair: 'cap', capCol: C.NAVY, outfit: 'tee', top: C.WHITE, mood: 'smile', seed: 113, look: -0.7, pose: 'relaxed' });
  };

  // ======================= THE LIFE OF THE ZONE: pictures for the week, the communities, the events =======================
  const H_ = (b, n, p) => P.hands(b, n, p);
  const crowdBack = (ctx, w, h, t, t0, rows) => rows.forEach(({ n, y, hh, col, rim }, r) => {
    for (let i = 0; i < n; i++) {
      const x = w * ((i + 0.5 + (r % 2) * 0.5) / n) - w * 0.04, p = t * 2 + i + r, b = U.hash(141 + r, i) > 0.5 ? 'f' : 'm';
      const lift = K.ez.inOut(prog(t, t0 + 0.25 + U.hash(121 + r, i) * 0.4, 0.45)) * (U.hash(131 + r, i) > 0.2 ? 1 : 0);
      const hands = P.mix(H_(b, 'down'), H_(b, (i + r) % 3 === 1 ? 'upOne' : 'up', p), lift);
      P.person(ctx, x, y, hh * (0.94 + U.hash(151 + r, i) * 0.12), { k: K.pop(t, t0 + 0.04 * r + U.hash(161 + r, i) * 0.12, 0.4), sil: col, rim, back: true, build: b, hands, t,
        hair: ['short', 'gele', 'afro', 'bun', 'cap', 'braids', 'short', 'puffs'][(i * 3 + r) % 8] });
    }
  });
  const stageLight = (ctx, w, h, t, sy) => {
    [[0.18, 0], [0.82, 2.1]].forEach(([fx, ph]) => {
      ctx.save(); ctx.translate(w * fx, -6); ctx.rotate(Math.sin(t * 1.4 + ph) * 0.26 + (fx < 0.5 ? -0.2 : 0.2));
      const g = ctx.createLinearGradient(0, 0, 0, h * 0.85); g.addColorStop(0, 'rgba(255,255,255,0.32)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.lineTo(w * 0.22, h * 0.85); ctx.lineTo(-w * 0.22, h * 0.85); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
  };
  // Sunday: the whole house worships
  IL.wCulte = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#3B24F2'], [0.62, '#1A0BB4'], [1, '#100678']]); ctx.fillRect(0, 0, w, h);
    const sy = h * 0.6;
    K.glow(ctx, w / 2, sy - h * 0.14, w * 0.75, '#FFFFFF', 0.4);
    K.fillRR(ctx, w * 0.25, h * 0.08, w * 0.5, h * 0.25, 8, '#4A38FF');
    K.corners(ctx, w * 0.5, h * 0.205, h * 0.15, '#FFFFFF'); ctx.fillStyle = C.ORANGE; ctx.fillRect(w * 0.5 - h * 0.017, h * 0.205 - h * 0.017, h * 0.034, h * 0.034);
    stageLight(ctx, w, h, t, sy);
    ctx.fillStyle = 'rgba(255,255,255,0.26)'; ctx.fillRect(w * 0.12, sy, w * 0.76, 4);
    P.person(ctx, w / 2, sy, h * 0.3, { k: K.pop(t, t0, 0.45), t, seed: 301, skin: P.SKIN[1], outfit: 'shirt', top: C.WHITE, bottom: C.NAVY, item: 'mic', mood: 'grin', hands: [H_('m', 'up')[0], [9, -244]] });
    crowdBack(ctx, w, h, t, t0, [{ n: 6, y: h * 1.16, hh: h * 0.6, col: '#0B0636', rim: '#FFB59E' }]);
  };
  // a growth group: about eight people around a Berger (in orange), seen from above
  IL.wGroupe = (ctx, w, h, t, t0) => {
    ctx.fillStyle = C.MIST; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * 0.5;
    const rug = clamp(K.ez.back(prog(t, t0 - 0.1, 0.5)));
    K.circ(ctx, cx, cy, R * 0.92 * rug, '#DCD6FF');
    ctx.save(); ctx.globalAlpha *= rug; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.setLineDash([4, 7]); ctx.beginPath(); ctx.arc(cx, cy, R * 0.84, 0, TAU); ctx.stroke(); ctx.restore();
    const tk = K.pop(t, t0, 0.4);
    K.circ(ctx, cx + 4, cy + 7, R * 0.38 * tk, 'rgba(13,8,56,0.12)'); K.circ(ctx, cx, cy, R * 0.38 * tk, C.WHITE);
    const rot = -0.8 * (1 - K.ez.out(prog(t, t0, 0.9)));
    const tops = [C.ORANGE, C.BLUE, C.BLUE_L, C.NAVY, C.ORANGE_L, C.BLUE, C.SLATE, C.NAVY, C.BLUE_L], geles = { 2: C.ORANGE, 5: C.BLUE_XL, 7: '#FFB13B' };
    for (let i = 0; i < 9; i++) {
      const a = rot + (i / 9) * TAU - Math.PI / 2, k = K.pop(t, t0 + 0.1 + i * 0.035, 0.35, 2);
      if (k > 0) {
        const ix = cx + Math.cos(a) * R * 0.25, iy = cy + Math.sin(a) * R * 0.25;
        ctx.save(); ctx.translate(ix, iy); ctx.rotate(a + Math.PI / 2); ctx.globalAlpha *= clamp(k * 3);
        if (i === 0 || i % 3 === 0) { K.fillRR(ctx, -13, -8, 26, 16, 2, C.BLUE); ctx.fillStyle = C.WHITE; ctx.fillRect(-11, -6, 10, 12); ctx.fillRect(1, -6, 10, 12); }
        else { K.circ(ctx, 0, 0, 6.5, '#C9C2FF'); K.circ(ctx, 0, 0, 3.5, C.WHITE); }
        ctx.restore();
      }
      P.top(ctx, cx + Math.cos(a) * R * 0.66, cy + Math.sin(a) * R * 0.66, a - Math.PI / 2, R / 150, { k, top: tops[i], skin: P.SKIN[i % 6], gele: geles[i] });
    }
  };
  // Zone Family: a home draws itself around a family, hand in hand
  IL.wFamille = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#FFF5EF'], [1, '#FFE0D3']]); ctx.fillRect(0, 0, w, h);
    const fy = h * 0.88;
    ctx.fillStyle = '#FFD0BF'; ctx.fillRect(0, fy, w, h - fy);
    K.trace(ctx, [[w * 0.08, fy], [w * 0.08, h * 0.4], [w * 0.5, h * 0.08], [w * 0.92, h * 0.4], [w * 0.92, fy]], K.ez.inOut(prog(t, t0 - 0.1, 0.6)), C.BLUE, 7, { join: 'miter', cap: 'butt' });
    const wk = K.pop(t, t0 + 0.35, 0.35, 2);
    K.glow(ctx, w / 2, h * 0.28, 50 * clamp(wk), C.ORANGE, 0.4);
    ctx.save(); ctx.translate(w / 2, h * 0.28); ctx.rotate((1 - Math.min(wk, 1)) * 1.6); ctx.fillStyle = C.ORANGE; ctx.fillRect(-11 * wk, -11 * wk, 22 * wk, 22 * wk); ctx.restore();
    const fx = w * 0.3, kx = w * 0.5, mx = w * 0.7, fh = h * 0.56, kh = h * 0.33, mh = h * 0.53;
    const m1 = [(fx + kx) / 2, fy - h * 0.17], m2 = [(kx + mx) / 2, fy - h * 0.17];
    P.person(ctx, fx, fy, fh, { k: K.pop(t, t0 + 0.05), t, seed: 311, skin: P.SKIN[1], outfit: 'shirt', top: C.BLUE, bottom: C.NAVY, beard: true, hands: [null, P.u(fx, fy, fh, ...m1)] });
    P.person(ctx, mx, fy, mh, { k: K.pop(t, t0 + 0.1), t, seed: 312, build: 'f', skin: P.SKIN[3], outfit: 'dress', top: C.BLUE_L, pattern: 'dots', patCol: C.WHITE, hair: 'gele', gele: C.ORANGE, hands: [P.u(mx, fy, mh, ...m2), null] });
    P.person(ctx, kx, fy, kh, { k: K.pop(t, t0 + 0.16), t, seed: 313, build: 'kid', skin: P.SKIN[2], top: C.ORANGE, bottom: C.NAVY, shorts: true, hair: 'puffs', mood: 'grin', hands: [P.u(kx, fy, kh, ...m1), P.u(kx, fy, kh, ...m2)] });
  };
  // Friday: praying together at night, hands joined, then lifted
  IL.wPriere = (ctx, w, h, t, t0) => {
    const g = K.vgrad(ctx, 0, h, [[0, '#2414D2'], [1, '#0D0838']]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) { const a = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + i)); ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(U.hash(51, i) * w, U.hash(52, i) * h * 0.45, 2.5, 2.5); }
    K.circ(ctx, w * 0.84, h * 0.15, 15, '#FFFFFF'); K.circ(ctx, w * 0.84 + 7, h * 0.15 - 4, 13, '#2414D2');
    K.glow(ctx, w / 2, h * 0.62, w * 0.7, '#FFFFFF', 0.6 * K.ez.out(prog(t, t0 - 0.1, 0.6)));
    const fy = h * 0.95, ph = h * 0.56, xs = [0.16, 0.39, 0.61, 0.84].map((f) => w * f);
    const up = K.ez.inOut(prog(t, t0 + 0.45, 0.55)), jy = lerp(fy - ph * 0.36, fy - ph * 1.08, up);
    const ppl = [
      { skin: P.SKIN[2], outfit: 'tee', top: C.WHITE, bottom: C.NAVY },
      { build: 'f', outfit: 'dress', top: C.ORANGE, pattern: 'diamond', patCol: C.PEACH, skin: P.SKIN[4], hair: 'gele', gele: C.BLUE },
      { outfit: 'shirt', top: C.BLUE, skin: P.SKIN[0], hair: 'bald', bottom: C.NAVY, beard: true },
      { build: 'f', outfit: 'dress', top: C.BLUE_L, skin: P.SKIN[3], hair: 'afro' },
    ];
    ppl.forEach((o, i) => {
      const x = xs[i];
      const L = i > 0 ? P.u(x, fy, ph, (xs[i - 1] + x) / 2, jy) : P.mix([H_(o.build, 'down')[0], H_(o.build, 'down')[1]], H_(o.build, 'up'), up)[0];
      const R = i < 3 ? P.u(x, fy, ph, (xs[i + 1] + x) / 2, jy) : P.mix(H_(o.build, 'down'), H_(o.build, 'up'), up)[1];
      P.person(ctx, x, fy, ph, Object.assign({ k: K.pop(t, t0 + 0.05 + i * 0.05), t, seed: 320 + i, hands: [L, R], eyes: up < 0.5 ? 'closed' : null, mood: up < 0.5 ? 'calm' : 'smile', tilt: up < 0.5 ? (i % 2 ? 0.08 : -0.08) : 0, lookY: -1 }, o));
    });
  };
  // Zone Digital: the app, every day
  IL.wDigital = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#F2F0FF'], [1, '#D8D2FF']]); ctx.fillRect(0, 0, w, h);
    K.circ(ctx, w / 2, h * 0.56, w * 0.38 * clamp(K.pop(t, t0, 0.5, 1.4)), 'rgba(255,255,255,0.75)');
    const k = K.pop(t, t0, 0.55, 1.4), pw = Math.min(w, h) * 0.38, phh = pw * 2;
    ctx.save(); ctx.translate(w / 2, h * 0.58 + (1 - k) * h * 0.55); ctx.rotate((1 - k) * -0.35 + Math.sin(t * 1.6) * 0.03);
    ctx.save(); ctx.shadowColor = 'rgba(13,8,56,0.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; K.fillRR(ctx, -pw / 2, -phh / 2, pw, phh, pw * 0.17, C.NAVY); ctx.restore();
    const sx = -pw / 2 + 7, sy = -phh / 2 + 7, sw = pw - 14, sh = phh - 14;
    K.fillRR(ctx, sx, sy, sw, sh, pw * 0.12, C.WHITE);
    ctx.save(); ctx.clip(K.rrPath(sx, sy, sw, sh, pw * 0.12));
    ctx.fillStyle = C.BLUE; ctx.fillRect(sx, sy, sw, sh * 0.2);
    K.corners(ctx, sx + sw * 0.16, sy + sh * 0.115, sh * 0.07, C.WHITE); ctx.fillStyle = C.ORANGE; const q = sh * 0.07 * K.SQ; ctx.fillRect(sx + sw * 0.16 - q / 2, sy + sh * 0.115 - q / 2, q, q);
    const ns = Math.min(sh * 0.055, (sw * 0.6) / (K.measure(ctx, 'ZONE 242', 100) / 100));
    K.text(ctx, 'ZONE 242', sx + sw * 0.3, sy + sh * 0.115, ns, C.WHITE);
    [[0.25, 0.17, 'verse'], [0.46, 0.22, 'video'], [0.72, 0.09, 'row'], [0.84, 0.09, 'row']].forEach(([fy, fh, kind], i) => {
      const qk = K.ez.out(prog(t, t0 + 0.22 + i * 0.08, 0.35));
      if (qk <= 0) return;
      ctx.save(); ctx.globalAlpha *= qk; ctx.translate((1 - qk) * sw * 0.6, 0);
      const x = sx + sw * 0.08, y = sy + sh * fy, cw = sw * 0.84, ch = sh * fh;
      if (kind === 'verse') { K.fillRR(ctx, x, y, cw, ch, 6, C.MIST); [0.82, 0.62, 0.7].forEach((f, j) => K.fillRR(ctx, x + cw * 0.1, y + ch * (0.24 + j * 0.24), cw * 0.8 * f, ch * 0.12, 2, j ? '#B9B2F5' : C.BLUE)); }
      else if (kind === 'video') { K.fillRR(ctx, x, y, cw, ch, 6, C.BLUE); K.poly(ctx, [[x + cw / 2 - 7, y + ch / 2 - 9], [x + cw / 2 - 7, y + ch / 2 + 9], [x + cw / 2 + 10, y + ch / 2]], C.WHITE); }
      else { K.circ(ctx, x + ch * 0.5, y + ch * 0.5, ch * 0.42, i === 2 ? C.ORANGE : C.BLUE_L); K.fillRR(ctx, x + ch * 1.2, y + ch * 0.22, cw * 0.55, ch * 0.2, 2, '#C9C2FF'); K.fillRR(ctx, x + ch * 1.2, y + ch * 0.58, cw * 0.38, ch * 0.18, 2, '#E3DFFF'); }
      ctx.restore();
    });
    ctx.restore();
    K.fillRR(ctx, -pw * 0.14, -phh / 2 + 10, pw * 0.28, 6, 3, C.NAVY);
    ctx.restore();
    [[0.03, 0.22, 0.5, C.ORANGE], [0.67, 0.4, 0.66, C.BLUE]].forEach(([fx, fy, d, dot], i) => {
      const qk = K.pop(t, t0 + d, 0.35, 2);
      if (qk <= 0) return;
      const bw = w * 0.3, bh = h * 0.11;
      ctx.save(); ctx.translate(w * fx + bw / 2, h * fy + bh / 2 + Math.sin(t * 2 + i) * 3); ctx.scale(qk, qk);
      K.fillRR(ctx, -bw / 2 + 2, -bh / 2 + 4, bw, bh, bh * 0.3, 'rgba(13,8,56,0.12)');
      K.fillRR(ctx, -bw / 2, -bh / 2, bw, bh, bh * 0.3, C.WHITE);
      K.circ(ctx, -bw / 2 + bh * 0.5, 0, bh * 0.22, dot);
      K.fillRR(ctx, -bw / 2 + bh * 0.95, -bh * 0.2, bw * 0.5, bh * 0.15, 2, '#C9C2FF'); K.fillRR(ctx, -bw / 2 + bh * 0.95, bh * 0.07, bw * 0.34, bh * 0.13, 2, '#E3DFFF');
      ctx.restore();
    });
  };

  // ======================= THE COMMUNITIES =======================
  function groupShot(ctx, w, h, t, t0, letter, people) {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#F5F3FF'], [1, '#D7D1FF']]); ctx.fillRect(0, 0, w, h);
    const lk = K.ez.out(prog(t, t0 - 0.1, 0.6));
    G.text(ctx, letter, w / 2, h * 1.03 + (1 - lk) * 80, { size: h * 1.06, fam: K.F.DISPLAY, weight: 900, color: '#C9C2FF', align: 'center', baseline: 'alphabetic', alpha: lk });
    K.ell(ctx, w / 2, h * 0.96, w * 0.42, 14, 'rgba(25,0,207,0.08)');
    people.map((p, i) => i).sort((a, b) => people[a].row - people[b].row).forEach((i, n) => {
      const p = people[i], front = p.row === 1;
      P.person(ctx, w / 2 + p.dx * w, front ? h * 0.99 : h * 0.89, front ? h * 0.8 : h * 0.72, Object.assign({ k: K.pop(t, t0 + 0.08 + n * 0.06, 0.42), t, seed: 330 + i }, p));
    });
  }
  IL.men = (ctx, w, h, t, t0) => groupShot(ctx, w, h, t, t0, 'M', [
    { dx: -0.3, row: 1, outfit: 'blazer', top: C.NAVY, bottom: C.NAVY, tie: C.ORANGE, square: C.ORANGE, skin: P.SKIN[1], pose: 'pocket', beard: true, stance: 'l' },
    { dx: -0.15, row: 0, outfit: 'shirt', top: C.BLUE, bottom: C.NAVY, skin: P.SKIN[4], hair: 'bald', glasses: true },
    { dx: 0, row: 1, outfit: 'kaftan', top: C.ORANGE, bottom: C.ORANGE, trim: C.WHITE, skin: P.SKIN[0], pose: 'cross', mood: 'smile' },
    { dx: 0.15, row: 0, outfit: 'hoodie', top: C.NAVY, bottom: C.DENIM, hair: 'cap', capCol: C.BLUE, skin: P.SKIN[2] },
    { dx: 0.3, row: 1, outfit: 'tee', top: C.BLUE_L, bottom: '#2D2A8F', skin: P.SKIN[3], hair: 'short', beard: true, pose: 'hips', mood: 'grin', stance: 'r' },
  ]);
  IL.women = (ctx, w, h, t, t0) => groupShot(ctx, w, h, t, t0, 'W', [
    { dx: -0.3, row: 1, build: 'f', outfit: 'dress', top: C.BLUE, pattern: 'rings', patCol: C.ORANGE, hair: 'gele', gele: C.ORANGE, skin: P.SKIN[2], pose: 'hold', item: 'book', itemCol: C.ORANGE, earrings: '#FFB13B', stance: 'r' },
    { dx: -0.15, row: 0, build: 'f', outfit: 'blazer', top: C.NAVY, bottom: C.NAVY, tie: false, hair: 'long', skin: P.SKIN[5] },
    { dx: 0, row: 1, build: 'f', outfit: 'dress', top: C.ORANGE, pattern: 'diamond', patCol: C.PEACH, hair: 'afro', skin: P.SKIN[1], pose: 'hips', mood: 'grin' },
    { dx: 0.15, row: 0, build: 'f', outfit: 'tee', top: C.BLUE_L, bottom: C.DENIM, hair: 'bun', skin: P.SKIN[3] },
    { dx: 0.3, row: 1, build: 'f', outfit: 'skirt', top: C.NAVY, blouse: C.WHITE, hair: 'braids', skin: P.SKIN[0], pose: 'wave', mood: 'grin', stance: 'l' },
  ]);
  // the couples' gala: a dance under the string lights
  IL.gala = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#26119F'], [1, '#0D0838']]); ctx.fillRect(0, 0, w, h);
    K.glow(ctx, w / 2, h * 0.62, h * 0.95, '#FFFFFF', 0.32);
    for (let i = 0; i < 12; i++) K.circ(ctx, U.hash(81, i) * w, U.hash(82, i) * h * 0.75, 6 + U.hash(83, i) * 12, i % 3 ? 'rgba(255,255,255,0.07)' : 'rgba(255,90,54,0.14)');
    [0, 1].forEach((s2) => {
      const y0 = h * (0.08 + s2 * 0.07), sag = 34 - s2 * 8, yAt = (x) => y0 + sag * (1 - Math.pow((x - w / 2) / (w / 2), 2));
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let x = 0; x <= w; x += 10) (x ? ctx.lineTo(x, yAt(x)) : ctx.moveTo(x, yAt(x)));
      ctx.stroke();
      for (let j = 0, x = 16 + s2 * 21; x < w; j++, x += 42) {
        const q = clamp((t - t0 - j * 0.02) / 0.2), a = 0.65 + 0.35 * Math.sin(t * 3 + j * 1.7 + s2);
        if (q <= 0) continue;
        const col = (j + s2) % 2 ? C.ORANGE : '#FFE9E2';
        K.glow(ctx, x, yAt(x) + 6, 16 * q, col, 0.45 * a); K.circ(ctx, x, yAt(x) + 6, 4.5 * q, col);
      }
    });
    K.ell(ctx, w / 2, h * 0.95, w * 0.26, 12, 'rgba(255,255,255,0.1)');
    const fy = h * 0.96, mx = w / 2 - 42, wx = w / 2 + 40, mh = h * 0.82, wh = h * 0.78;
    const meet = [w / 2 + 4, fy - wh * 1.07], sway = Math.sin(t * 2.4) * 0.045;
    P.person(ctx, mx, fy, mh, { k: K.pop(t, t0 + 0.05), t, seed: 340, outfit: 'blazer', top: C.WHITE, bottom: C.NAVY, bowtie: C.ORANGE, skin: P.SKIN[1], mood: 'grin', look: 0.6, hands: [null, P.u(mx, fy, mh, ...meet)] });
    P.person(ctx, wx, fy, wh, { k: K.pop(t, t0 + 0.12), t, seed: 341, build: 'f', outfit: 'gown', top: C.ORANGE, flare: 64 + 10 * Math.sin(t * 4.8), lean: sway, skin: P.SKIN[4], hair: 'bun', earrings: '#FFD27A', mood: 'grin', eyes: 'happy', hands: [P.u(wx, fy, wh, ...meet), [76, -150]] });
    for (let i = 0; i < 6; i++) {
      if (prog(t, t0 + 0.3, 0.3) <= 0) continue;
      const a = 0.5 + 0.5 * Math.sin(t * 4 + i * 2), x = w * (0.2 + U.hash(84, i) * 0.6), y = h * (0.25 + U.hash(85, i) * 0.4), sz = 5 * a;
      K.poly(ctx, [[x, y - sz], [x + sz * 0.4, y], [x, y + sz], [x - sz * 0.4, y]], `rgba(255,255,255,${a})`);
    }
  };
  function bubble(ctx, x, y, bw, bh, col, k, kind, t, tailDx = -0.25) {
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.save(); ctx.shadowColor = 'rgba(13,8,56,0.18)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
    K.fillRR(ctx, -bw / 2, -bh / 2, bw, bh, bh * 0.45, col); ctx.restore();
    K.poly(ctx, [[bw * tailDx - 8, bh / 2 - 2], [bw * tailDx + 8, bh / 2 - 2], [bw * tailDx - 10, bh / 2 + 12]], col);
    const fg = col === C.WHITE ? C.BLUE : C.WHITE;
    if (kind === 'dots') for (let i = 0; i < 3; i++) K.circ(ctx, (i - 1) * bh * 0.38, -Math.max(0, Math.sin(t * 8 - i)) * 3, bh * 0.12, fg);
    else if (kind === 'heart') { ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, bh * 0.22); ctx.bezierCurveTo(-bh * 0.5, -bh * 0.08, -bh * 0.18, -bh * 0.42, 0, -bh * 0.14); ctx.bezierCurveTo(bh * 0.18, -bh * 0.42, bh * 0.5, -bh * 0.08, 0, bh * 0.22); ctx.fill(); }
    else { K.fillRR(ctx, -bw * 0.32, -bh * 0.2, bw * 0.64, bh * 0.14, 2, fg); K.fillRR(ctx, -bw * 0.32, bh * 0.06, bw * 0.4, bh * 0.14, 2, fg); }
    ctx.restore();
  }
  // singles: people meeting, talking, laughing
  IL.singles = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#FFF6F2'], [1, '#FFDCCF']]); ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) K.circ(ctx, U.hash(91, i) * w, U.hash(92, i) * h * 0.6, 10 + U.hash(93, i) * 22, 'rgba(140,130,245,0.13)');
    K.ell(ctx, w / 2, h * 0.97, w * 0.44, 12, 'rgba(255,90,54,0.1)');
    const fy = h * 0.97, ph = h * 0.8, tx = w * 0.31, tk = K.pop(t, t0, 0.4);
    P.person(ctx, w * 0.15, fy, ph, { k: K.pop(t, t0 + 0.05), t, seed: 350, outfit: 'shirt', top: C.BLUE, bottom: C.NAVY, skin: P.SKIN[2], pose: 'talk', mood: 'grin', look: 0.8 });
    if (tk > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(tk * 3);
      K.fillRR(ctx, tx - 3, h * 0.6, 6, fy - h * 0.6, 3, C.NAVY); K.ell(ctx, tx, fy - 2, 22, 5, C.NAVY); K.ell(ctx, tx, h * 0.6, 46, 9, C.NAVY);
      [-18, 16].forEach((dx) => { K.fillRR(ctx, tx + dx - 7, h * 0.6 - 20, 14, 18, 3, C.WHITE); ctx.fillStyle = C.ORANGE; ctx.fillRect(tx + dx - 7, h * 0.6 - 14, 14, 5); });
      ctx.restore();
    }
    P.person(ctx, w * 0.45, fy, ph * 0.95, { k: K.pop(t, t0 + 0.1), t, seed: 351, build: 'f', outfit: 'dress', top: C.ORANGE, pattern: 'dots', patCol: C.PEACH, hair: 'gele', gele: C.BLUE, skin: P.SKIN[4], hands: [null, [42, -196]], item: 'cup', mood: 'grin', eyes: 'happy' });
    P.person(ctx, w * 0.68, fy, ph, { k: K.pop(t, t0 + 0.15), t, seed: 352, outfit: 'hoodie', top: C.BLUE_L, bottom: C.DENIM, hair: 'cap', capCol: C.NAVY, skin: P.SKIN[0], pose: 'pocket', mood: 'grin', lean: -0.03 + 0.025 * Math.sin(t * 5) });
    P.person(ctx, w * 0.87, fy, ph * 0.95, { k: K.pop(t, t0 + 0.2), t, seed: 353, build: 'f', outfit: 'tee', top: C.NAVY, bottom: C.DENIM, hair: 'afro', skin: P.SKIN[3], pose: 'talk', flip: true, ph: 2, mood: 'smile', look: 0.8 });
    bubble(ctx, w * 0.2, h * 0.11, 64, 34, C.BLUE, K.pop(t, t0 + 0.35, 0.35, 2), 'dots', t);
    bubble(ctx, w * 0.5, h * 0.08, 70, 34, C.WHITE, K.pop(t, t0 + 0.55, 0.35, 2), 'lines', t);
    bubble(ctx, w * 0.8, h * 0.1, 64, 34, C.ORANGE, K.pop(t, t0 + 0.75, 0.35, 2), 'heart', t, 0.25);
  };

  // ======================= THE CAMPS =======================
  function pine(ctx, x, y, s2, col) {
    for (let i = 0; i < 3; i++) K.poly(ctx, [[x - s2 * (0.5 - i * 0.1), y - s2 * i * 0.42], [x + s2 * (0.5 - i * 0.1), y - s2 * i * 0.42], [x, y - s2 * (0.75 + i * 0.42)]], col);
    ctx.fillStyle = col; ctx.fillRect(x - s2 * 0.06, y, s2 * 0.12, s2 * 0.2);
  }
  function flame(ctx, x, y, hh, ww, col, sk) {
    ctx.beginPath(); ctx.moveTo(x - ww / 2, y);
    ctx.bezierCurveTo(x - ww / 2, y - hh * 0.45, x + sk - ww * 0.15, y - hh * 0.7, x + sk, y - hh);
    ctx.bezierCurveTo(x + sk + ww * 0.1, y - hh * 0.6, x + ww / 2, y - hh * 0.45, x + ww / 2, y);
    ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  const badge = (ctx, x, y, str, k) => {
    if (k <= 0) return;
    const size = 20, tw = K.measure(ctx, str, size, 'text', 800), bw = tw + size * 1.5, bh = size * 1.75;
    ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.scale(k, k); ctx.rotate((1 - Math.min(k, 1)) * 0.6);
    K.fillRR(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2, C.ORANGE);
    K.text(ctx, str, 0, 1, size, C.WHITE, { fam: 'text', weight: 800, align: 'center' });
    ctx.restore();
  };
  IL.campTeens = (ctx, w, h, t, t0) => {
    const g = K.vgrad(ctx, 0, h, [[0, '#2918DA'], [1, '#0D0838']]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 34; i++) { const a = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.4 + i)); ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(U.hash(61, i) * w, U.hash(62, i) * h * 0.55, 2.4, 2.4); }
    K.circ(ctx, w * 0.9, h * 0.17, 18, '#FFFFFF'); K.circ(ctx, w * 0.9 + 8, h * 0.17 - 5, 15.5, '#2717D4');
    const fy = h * 0.9, fx = w * 0.44, fk = K.ez.out(prog(t, t0, 0.5));
    K.glow(ctx, fx, fy - 30, h * 1.05, C.ORANGE, 0.45 * fk);
    [[0.03, 0.5], [0.1, 0.38], [0.97, 0.44]].forEach(([px, sc]) => pine(ctx, w * px, fy, h * sc, '#0A0560'));
    ctx.fillStyle = '#090447'; ctx.fillRect(0, fy, w, h - fy);
    const tk = K.pop(t, t0 + 0.1, 0.4);
    if (tk > 0) { ctx.save(); ctx.translate(w * 0.8, fy); ctx.scale(tk, tk); K.poly(ctx, [[-70, 0], [70, 0], [0, -112]], C.ORANGE); K.poly(ctx, [[0, -112], [70, 0], [22, 0]], '#D9431F'); K.poly(ctx, [[-20, 0], [20, 0], [0, -62]], '#4A1006'); ctx.restore(); }
    const ph = h * 0.62;
    P.person(ctx, w * 0.34, fy - h * 0.06, ph * 0.86, { k: K.pop(t, t0 + 0.2), t, seed: 360, build: 'f', top: C.WHITE, bottom: C.NAVY, skin: P.SKIN[3], hair: 'bun', pose: 'up', mood: 'o' });
    P.person(ctx, w * 0.2, fy, ph, { k: K.pop(t, t0 + 0.12), t, seed: 361, top: C.BLUE_L, bottom: C.DENIM, skin: P.SKIN[2], hair: 'cap', capCol: C.ORANGE, hands: [null, [70, -170]], item: 'stick', stickA: 0.25, mood: 'grin' });
    P.person(ctx, w * 0.62, fy, ph, { k: K.pop(t, t0 + 0.16), t, seed: 362, build: 'f', top: C.ORANGE, bottom: C.NAVY, skin: P.SKIN[4], hair: 'puffs', item: 'guitar', mood: 'grin', eyes: 'happy', hands: [[-16 + 4 * Math.sin(t * 9), -150], [72, -196]] });
    const fireK = K.pop(t, t0 + 0.05, 0.4);
    if (fireK > 0) {
      ctx.save(); ctx.translate(fx, fy); ctx.scale(fireK, fireK);
      ctx.save(); ctx.rotate(0.35); K.fillRR(ctx, -32, -7, 64, 14, 6, '#6B3A1E'); ctx.restore();
      ctx.save(); ctx.rotate(-0.35); K.fillRR(ctx, -32, -7, 64, 14, 6, '#7E4524'); ctx.restore();
      const fl = (n) => 1 + 0.16 * Math.sin(t * 13 + n) * Math.sin(t * 7.3 + n * 2);
      flame(ctx, 0, -4, 70 * fl(0), 46, C.ORANGE, Math.sin(t * 9) * 7);
      flame(ctx, 0, -4, 48 * fl(1), 32, '#FF9A6B', Math.sin(t * 11 + 1) * 5);
      flame(ctx, 0, -4, 26 * fl(2), 18, '#FFE6DD', Math.sin(t * 12 + 2) * 3);
      ctx.restore();
      for (let i = 0; i < 7; i++) {
        const q = (t * 0.7 + U.hash(66, i)) % 1, sx2 = fx + Math.sin(t * 3 + i * 2) * 14 + (U.hash(67, i) - 0.5) * 30, sy2 = fy - 40 - q * h * 0.5;
        ctx.save(); ctx.translate(sx2, sy2); ctx.rotate(t * 4 + i); ctx.globalAlpha *= (1 - q) * fireK; ctx.fillStyle = i % 2 ? C.ORANGE : '#FFD3C7'; ctx.fillRect(-2.5, -2.5, 5, 5); ctx.restore();
      }
    }
    badge(ctx, 18, 16, '11–15 ANS', K.pop(t, t0 + 0.3, 0.35, 2));
  };
  IL.campYouth = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#6E60F0'], [0.6, '#C8B9FF'], [1, '#FFD0BF']]); ctx.fillRect(0, 0, w, h);
    const sk = K.ez.out(prog(t, t0 - 0.1, 0.8));
    K.glow(ctx, w * 0.24, h * (0.75 - 0.15 * sk), h * 0.6, '#FFFFFF', 0.7); K.circ(ctx, w * 0.24, h * (0.75 - 0.15 * sk), 30, '#FFFFFF');
    K.poly(ctx, [[0, h * 0.76], [w * 0.12, h * 0.5], [w * 0.25, h * 0.66], [w * 0.38, h * 0.44], [w * 0.5, h * 0.6], [w * 0.78, h * 0.4], [w, h * 0.62], [w, h], [0, h]], '#A79DFF');
    const top = [w * 0.62, h * 0.26], ridge = (x) => h - ((x - w * 0.18) / (top[0] - w * 0.18)) * (h - top[1]);
    K.poly(ctx, [[w * 0.18, h], top, [w * 1.02, h]], C.BLUE);
    K.poly(ctx, [top, [top[0] + 50, top[1] + 44], [top[0] + 28, top[1] + 34], [top[0] + 12, top[1] + 46], [top[0] - 6, top[1] + 34], [top[0] - 26, top[1] + 46], [top[0] - 55, top[1] + 44]], C.WHITE);
    K.poly(ctx, [[w * 0.74, h], [w * 0.9, h * 0.55], [w * 1.05, h]], '#12078F');
    K.trace(ctx, [[w * 0.3, h], [w * 0.42, h * 0.9], [w * 0.36, h * 0.8], [w * 0.345, ridge(w * 0.345) + 2]], K.ez.inOut(prog(t, t0, 0.8)), 'rgba(255,255,255,0.75)', 3, { dash: [7, 8] });
    const fk = K.ez.out(prog(t, t0 + 0.35, 0.6));
    ctx.strokeStyle = C.WHITE; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(top[0], top[1] + 2); ctx.lineTo(top[0], top[1] - 66); ctx.stroke();
    if (fk > 0) {
      const py = top[1] - 66 + (1 - fk) * 40, pts = [];
      for (let i = 0; i <= 10; i++) pts.push([top[0] + i * 5.5, py + Math.sin(t * 7 - i * 0.6) * 3 * (i / 10)]);
      for (let i = 10; i >= 0; i--) pts.push([top[0] + i * 5.5, py + 28 + Math.sin(t * 7 - i * 0.6) * 3 * (i / 10)]);
      K.poly(ctx, pts, C.ORANGE);
    }
    [[0.37, 'f', C.ORANGE, P.SKIN[1], 'braids'], [0.42, 'm', C.WHITE, P.SKIN[3], 'cap'], [0.47, 'f', C.BLUE_L, P.SKIN[0], 'afro']].forEach(([fx2, b, col, sk2, hair], i) => {
      const x = w * fx2;
      P.person(ctx, x, ridge(x) + 3, h * 0.34, { k: K.pop(t, t0 + 0.2 + i * 0.07), t, seed: 370 + i, build: b, top: col, bottom: C.NAVY, skin: sk2, hair, capCol: C.ORANGE, pose: i === 1 ? 'upOne' : 'up', mood: 'grin' });
    });
    badge(ctx, 18, 16, '16 ANS +', K.pop(t, t0 + 0.3, 0.35, 2));
  };

  // ======================= SIGNATURE PROGRAMMES (each holds the light at its spot) =======================
  IL.chambre = (ctx, w, h, t, t0) => {
    const g = K.vgrad(ctx, 0, h, [[0, '#2616D8'], [1, '#0D0838']]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 22; i++) { const a = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + i)); ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(U.hash(71, i) * w, U.hash(72, i) * h * 0.45, 2.2, 2.2); }
    const [sx, sy, ss] = IL.chambre.spot, wx = w * sx, wy = h * sy, lk = K.ez.out(prog(t, t0, 0.6));
    ctx.save(); ctx.translate(wx, wy); ctx.rotate(t * 0.25);
    for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.fillStyle = `rgba(255,214,203,${0.1 * lk})`; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(h * 0.9, -14); ctx.lineTo(h * 0.9, 14); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    K.glow(ctx, wx, wy, h * 0.6, C.ORANGE, 0.5 * lk);
    const x0 = w * 0.32, x1 = w * 0.68, eave = h * 0.3, fy = h * 0.92;
    K.poly(ctx, [[x0 - 14, eave], [w / 2, h * 0.12], [x1 + 14, eave]], C.NIGHT);
    ctx.fillStyle = C.NIGHT; ctx.fillRect(x0, eave, x1 - x0, fy - eave);
    K.fillRR(ctx, wx - ss * 0.75, wy - ss * 0.75, ss * 1.5, ss * 1.5, 4, '#1E1478');
    K.fillRR(ctx, w / 2 - 14, fy - h * 0.2, 28, h * 0.2, 4, '#241A8C');
    [-1, 1].forEach((sd) => K.fillRR(ctx, w / 2 + sd * 40 - 11, fy - h * 0.18, 22, 22, 3, '#241A8C'));
    const steps = [[x1 + 60, fy]];
    for (let i = 0; i < 6; i++) { const [px, py] = steps[steps.length - 1]; steps.push([px, py - 14], [px - 10, py - 14]); }
    K.trace(ctx, steps, 1, '#3A2AE0', 3, { join: 'miter', cap: 'butt' });
    ctx.fillStyle = '#080430'; ctx.fillRect(0, fy, w, h - fy);
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(wx - ss / 2, wy - ss / 2, ss, ss); }
  };
  IL.chambre.spot = [0.5, 0.44, 40];
  IL.zoneOut = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h * 0.56, [[0, '#FFC9B8'], [1, '#FFF0EA']]); ctx.fillRect(0, 0, w, h * 0.56);
    const [sx, sy, ss] = IL.zoneOut.spot;
    ctx.fillStyle = C.BLUE; ctx.fillRect(0, h * 0.56, w, h * 0.2);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(255,90,54,0.55)'; const rw = ss * (1.4 - i * 0.22); ctx.fillRect(w * sx - rw / 2, h * (0.585 + i * 0.03), rw, 3); }
    for (let i = 0; i < 9; i++) { const x = ((U.hash(101, i) * w + t * 18) % (w + 40)) - 20, y = h * (0.6 + U.hash(102, i) * 0.13); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(x, y, 18, 2.5); }
    ctx.fillStyle = C.SAND; ctx.fillRect(0, h * 0.76, w, h * 0.24);
    const px = w * 0.9, py = h * 0.3, pk = K.pop(t, t0 + 0.05, 0.45);
    if (pk > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(pk * 3);
      ctx.strokeStyle = '#120A5C'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(w * 0.96, h * 1.02); ctx.quadraticCurveTo(w * 0.94, h * 0.6, px, py); ctx.stroke();
      ctx.translate(px, py); ctx.rotate(Math.sin(t * 1.5) * 0.06); ctx.scale(pk, pk);
      [-2.7, -2.1, -1.35, -0.6, 0.05, 0.6].forEach((a) => { ctx.save(); ctx.rotate(a); K.ell(ctx, 30, 0, 32, 8, '#120A5C', 0.25); ctx.restore(); });
      ctx.restore();
    }
    const fy = h * 0.99, ph = h * 0.64, xs = [0.36, 0.5, 0.64].map((f) => w * f);
    P.person(ctx, xs[0], fy, ph * 0.96, { k: K.pop(t, t0 + 0.1), t, seed: 380, top: C.BLUE_L, bottom: C.NAVY, skin: P.SKIN[2], pose: 'upOne', mood: 'grin' });
    P.person(ctx, xs[1], fy, ph * 0.92, { k: K.pop(t, t0 + 0.15), t, seed: 381, build: 'f', outfit: 'dress', top: C.BLUE, pattern: 'dots', patCol: C.WHITE, hair: 'gele', gele: C.ORANGE, skin: P.SKIN[4], pose: 'hips', mood: 'grin', eyes: 'happy' });
    P.person(ctx, xs[2], fy, ph, { k: K.pop(t, t0 + 0.2), t, seed: 382, outfit: 'tee', top: C.NAVY, bottom: C.DENIM, hair: 'cap', capCol: C.BLUE, skin: P.SKIN[0], pose: 'selfie', item: 'phone', mood: 'grin' });
    const fl = prog(t, t0 + 0.6, 0.35);
    if (fl > 0 && fl < 1) K.glow(ctx, xs[2] + 100 * ph / 300, fy - 334 * ph / 300, 60 * (0.4 + fl), '#FFFFFF', 1 - fl);
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(w * sx - ss / 2, h * sy - ss / 2, ss, ss); }
  };
  IL.zoneOut.spot = [0.2, 0.46, 34];
  IL.serves = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#F5F3FF'], [1, '#E2DDFF']]); ctx.fillRect(0, 0, w, h);
    [[0.02, 0.4, 0.12], [0.15, 0.6, 0.1], [0.27, 0.32, 0.14], [0.44, 0.52, 0.09], [0.56, 0.7, 0.12], [0.7, 0.42, 0.11], [0.83, 0.58, 0.15]].forEach(([fx, fh, fw], i) => {
      const bx = w * fx, bw = w * fw, bh = h * fh, by = h * 0.9 - bh;
      ctx.fillStyle = '#D6D0FF'; ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (let yy = by + 10; yy < h * 0.86; yy += 16) for (let xx = bx + 7; xx < bx + bw - 8; xx += 13) if (U.hash(111, i * 97 + xx + yy) > 0.35) ctx.fillRect(xx, yy, 5, 7);
    });
    ctx.fillStyle = '#CBC3FF'; ctx.fillRect(0, h * 0.9, w, h * 0.1);
    for (let i = 0; i < 3; i++) {
      const bk = K.pop(t, t0 + 0.05 + i * 0.05, 0.35, 2);
      if (bk <= 0) continue;
      ctx.save(); ctx.translate(w * 0.1, h * 0.9 - (i + 1) * 26 + 13); ctx.scale(bk, bk);
      K.fillRR(ctx, -20 + (i % 2) * 4, -13, 40, 26, 3, '#FFB8A6'); ctx.fillStyle = C.ORANGE; ctx.fillRect(-3 + (i % 2) * 4, -13, 6, 26);
      ctx.restore();
    }
    const [sx, sy, ss] = IL.serves.spot, bx = w * sx, by = h * sy, fy = h * 0.96, ph = h * 0.66;
    const ax = w * 0.32, rx = w * 0.69, kx = w * 0.85;
    P.person(ctx, ax, fy, ph, { k: K.pop(t, t0 + 0.08), t, seed: 390, top: C.BLUE, bottom: C.NAVY, skin: P.SKIN[1], hair: 'cap', capCol: C.ORANGE, badge: true, mood: 'grin', hands: [null, P.u(ax, fy, ph, bx - ss / 2, by + 4)] });
    P.person(ctx, rx, fy, ph * 0.94, { k: K.pop(t, t0 + 0.14), t, seed: 391, build: 'f', outfit: 'dress', top: C.BLUE_L, pattern: 'leaf', patCol: C.WHITE, hair: 'gele', gele: C.NAVY, skin: P.SKIN[3], mood: 'smile', hands: [P.u(rx, fy, ph * 0.94, bx + ss / 2, by + 4), null] });
    P.person(ctx, kx, fy, ph * 0.52, { k: K.pop(t, t0 + 0.2), t, seed: 392, build: 'kid', top: C.ORANGE, bottom: C.NAVY, shorts: true, skin: P.SKIN[2], hair: 'puffs', pose: 'wave', mood: 'grin' });
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(bx - ss / 2, by - ss / 2, ss, ss); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(bx - 3, by - ss / 2, 6, ss); }
  };
  IL.serves.spot = [0.5, 0.56, 34];
  IL.serveDay = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#F2F0FF'], [1, '#DCD6FF']]); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#D0C9FF'; ctx.fillRect(0, h * 0.9, w, h * 0.1);
    const fy = h * 0.94, ph = h * 0.64, xs = [0.13, 0.37, 0.6, 0.85].map((f) => w * f);
    xs.forEach((x, i) => K.ell(ctx, x, fy, 34, 7, i === 3 ? 'rgba(255,90,54,0.3)' : 'rgba(25,0,207,0.1)'));
    const ck = K.pop(t, t0 + 0.05, 0.4);
    if (ck > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(ck * 3);
      const cx = xs[0] + 40, cy = fy - ph * 0.62;
      ctx.strokeStyle = C.NAVY; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 16, fy); ctx.moveTo(cx, cy); ctx.lineTo(cx + 16, fy); ctx.moveTo(cx, cy); ctx.lineTo(cx, fy); ctx.stroke();
      K.fillRR(ctx, cx - 20, cy - 26, 40, 26, 4, C.NAVY); K.circ(ctx, cx + 20, cy - 13, 9, '#3A2FB8'); K.circ(ctx, cx + 20, cy - 13, 4, '#8C82F5');
      ctx.restore();
    }
    P.person(ctx, xs[0], fy, ph, { k: K.pop(t, t0 + 0.08), t, seed: 400, top: C.BLUE, bottom: C.NAVY, skin: P.SKIN[2], hands: [null, P.u(xs[0], fy, ph, xs[0] + 24, fy - ph * 0.7)], look: 1 });
    P.person(ctx, xs[1], fy, ph * 0.95, { k: K.pop(t, t0 + 0.12), t, seed: 401, build: 'f', top: C.BLUE_L, bottom: C.DENIM, hair: 'long', skin: P.SKIN[4], phones: C.NAVY, headset: true, pose: 'hold', item: 'tablet', mood: 'smile' });
    P.person(ctx, xs[2], fy, ph, { k: K.pop(t, t0 + 0.16), t, seed: 402, top: C.ORANGE, bottom: C.NAVY, skin: P.SKIN[0], badge: true, pose: 'wave', mood: 'grin' });
    P.person(ctx, xs[3], fy, ph * 0.97, { k: K.pop(t, t0 + 0.2), t, sil: '#CCC5FF' });
    const [sx, sy, ss] = IL.serveDay.spot;
    if (t >= t0) { ctx.fillStyle = C.ORANGE; ctx.fillRect(w * sx - ss / 2, h * sy - ss / 2, ss, ss); }
  };
  IL.serveDay.spot = [0.85, 0.57, 30];

  // ======================= THE BIG GATHERINGS =======================
  IL.arena = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#2B15E8'], [1, '#0D0838']]); ctx.fillRect(0, 0, w, h);
    K.glow(ctx, w / 2, h * 0.5, w * 0.55, '#FFFFFF', 0.36);
    const sk = K.pop(t, t0, 0.45, 1.4);
    if (sk > 0) {
      ctx.save(); ctx.translate(w / 2, h * 0.23); ctx.scale(sk, sk);
      K.fillRR(ctx, -w * 0.2, -h * 0.15, w * 0.4, h * 0.3, 10, '#3622FF');
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 3; ctx.stroke(K.rrPath(-w * 0.2, -h * 0.15, w * 0.4, h * 0.3, 10));
      K.corners(ctx, 0, 0, h * 0.17, C.WHITE); const q = h * 0.17 * K.SQ; ctx.fillStyle = C.ORANGE; ctx.fillRect(-q / 2, -q / 2, q, q);
      ctx.restore();
    }
    [[0.04, 1.02, -1, 0], [0.96, 1.02, 1, 1.3], [0.22, -0.02, -1, 2.6], [0.78, -0.02, 1, 3.9]].forEach(([fx, fy, sd, ph]) => {
      const up = fy > 0.5;
      ctx.save(); ctx.translate(w * fx, h * fy); ctx.rotate((up ? Math.PI : 0) + sd * (0.35 + Math.sin(t * 1.2 + ph) * 0.25) * (up ? -1 : 1));
      const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(w * 0.12, h * 1.1); ctx.lineTo(-w * 0.12, h * 1.1); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(w * 0.12, h * 0.52, w * 0.76, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(w * 0.12, h * 0.52 + 7, w * 0.76, h * 0.06);
    P.person(ctx, w / 2, h * 0.52, h * 0.27, { k: K.pop(t, t0 + 0.1), t, seed: 410, outfit: 'blazer', top: C.WHITE, bottom: C.NAVY, tie: C.ORANGE, skin: P.SKIN[0], item: 'mic', mood: 'grin', hands: [H_('m', 'up')[0], [9, -244]] });
    for (let i = 0; i < 10; i++) {
      const q = (t * 0.35 + U.hash(171, i)) % 1, x = w * (0.15 + U.hash(172, i) * 0.7), y = h * (0.55 - q * 0.5);
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); ctx.globalAlpha *= Math.sin(Math.PI * q) * clamp((t - t0) * 3); ctx.fillStyle = i % 3 ? C.WHITE : C.ORANGE; ctx.fillRect(-3, -3, 6, 6); ctx.restore();
    }
    crowdBack(ctx, w, h, t, t0, [{ n: 11, y: h * 1.0, hh: h * 0.34, col: '#180D80', rim: '#8F86FF' }, { n: 10, y: h * 1.12, hh: h * 0.42, col: '#100760', rim: '#B9B2FF' }, { n: 8, y: h * 1.28, hh: h * 0.52, col: '#070330', rim: '#FFB59E' }]);
  };
  const EAGLE = [[0, -0.44], [0.08, -0.38], [0.065, -0.3], [0.16, -0.25], [0.42, -0.37], [0.7, -0.41], [1, -0.35], [0.86, -0.25], [0.96, -0.19],
    [0.8, -0.13], [0.9, -0.06], [0.7, -0.03], [0.78, 0.05], [0.5, 0.01], [0.18, 0.06], [0.12, 0.22], [0.17, 0.36], [0, 0.3]];
  IL.eagle = (ctx, x, y, sc, flap, col) => {
    const pts = EAGLE.map(([px, py]) => [px, py - flap * px * px * 0.3]);
    const all = pts.concat(pts.slice(1, -1).reverse().map(([px, py]) => [-px, py]));
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    K.poly(ctx, all, col); K.poly(ctx, [[0.05, -0.41], [0.15, -0.38], [0.05, -0.34]], C.ORANGE);
    ctx.restore();
  };
  IL.eagles = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#2B15E8'], [1, '#12077A']]); ctx.fillRect(0, 0, w, h);
    const ek = K.pop(t, t0, 0.5, 1.5), ex = w / 2, ey = h * 0.28;
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(t * 0.2);
    for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.fillStyle = `rgba(255,255,255,${0.06 * clamp(ek)})`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, -26); ctx.lineTo(w, 26); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    if (ek > 0) IL.eagle(ctx, ex, ey + (1 - ek) * 60, w * 0.24 * ek, Math.sin(t * 4.5) * 0.7, C.WHITE);
    K.glow(ctx, w / 2, h * 0.76, h * 0.5, '#FFFFFF', 0.3);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(w * 0.22, h * 0.9, w * 0.56, 7);
    [[0.37, 'f', C.WHITE, P.SKIN[2], 'gele', 'upOne', 'dress'], [0.5, 'm', C.ORANGE, P.SKIN[0], 'short', 'up', 'tee'], [0.63, 'm', C.BLUE_L, P.SKIN[4], 'bald', 'wave', 'shirt']].forEach(([fx, b, col, sk, hair, pose, outfit], i) => {
      P.person(ctx, w * fx, h * 0.9, h * (i === 1 ? 0.44 : 0.4), { k: K.pop(t, t0 + 0.15 + i * 0.06), t, seed: 420 + i, build: b, top: col, outfit, pattern: outfit === 'dress' ? 'dots' : null, patCol: C.BLUE_L, bottom: C.NAVY, skin: sk, hair, gele: C.ORANGE, pose, medal: true, mood: 'grin' });
    });
    for (let i = 0; i < 44; i++) {
      const sp = 110 + U.hash(181, i) * 90, y = (U.hash(182, i) * 1.4 - 0.5) * h + (t - t0) * sp, x = U.hash(183, i) * w + Math.sin(t * 3 + i) * 10;
      if (t < t0 || y < -10 || y > h + 10) continue;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 5 * (U.hash(184, i) - 0.5) * 2 + i);
      ctx.fillStyle = [C.ORANGE, C.WHITE, C.PEACH, C.BLUE_XL][i % 4]; ctx.fillRect(-5, -2.5, 10, 5); ctx.restore();
    }
  };
  IL.business = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#F5F3FF'], [1, '#DDD7FF']]); ctx.fillRect(0, 0, w, h);
    const scx = w * 0.06, scy = h * 0.07, scw = w * 0.6, sch = h * 0.55, sk = K.pop(t, t0, 0.45, 1.4);
    if (sk > 0) {
      ctx.save(); ctx.translate(scx + scw / 2, scy + sch / 2); ctx.scale(sk, sk); ctx.translate(-scx - scw / 2, -scy - sch / 2);
      K.fillRR(ctx, scx, scy, scw, sch, 14, C.BLUE);
      K.fillRR(ctx, scx + 24, scy + 22, scw * 0.3, 10, 4, 'rgba(255,255,255,0.75)'); K.fillRR(ctx, scx + 24, scy + 40, scw * 0.18, 8, 4, 'rgba(255,255,255,0.4)');
      const base = scy + sch * 0.88, ch = sch * 0.62, bw = scw * 0.11, tops = [];
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(scx + scw * 0.1, base, scw * 0.8, 3);
      [0.28, 0.44, 0.62, 0.86].forEach((f, i) => {
        const q = clamp(U.ease.outBack(prog(t, t0 + 0.15 + i * 0.09, 0.4), 1.6), 0, 1.1), bx = scx + scw * (0.16 + i * 0.19), bh = ch * f * q;
        ctx.fillStyle = i === 3 ? C.WHITE : 'rgba(255,255,255,0.78)'; ctx.fillRect(bx, base - bh, bw, bh);
        tops.push([bx + bw / 2, base - ch * f - 22]);
      });
      const lk = K.ez.inOut(prog(t, t0 + 0.45, 0.5));
      K.trace(ctx, tops, lk, C.ORANGE, 6);
      if (lk >= 1) { const [ax, ay] = tops[3], [bx2, by2] = tops[2], a = Math.atan2(ay - by2, ax - bx2); ctx.save(); ctx.translate(ax, ay); ctx.rotate(a); K.poly(ctx, [[12, 0], [-8, -10], [-8, 10]], C.ORANGE); ctx.restore(); }
      ctx.restore();
    }
    const lx = w * 0.82, fy = h * 0.9;
    P.person(ctx, lx, fy, h * 0.6, { k: K.pop(t, t0 + 0.12), t, seed: 430, outfit: 'blazer', top: C.NAVY, bottom: C.NAVY, tie: C.ORANGE, skin: P.SKIN[1], pose: 'talk', flip: true, mood: 'grin', glasses: true });
    const lk2 = K.pop(t, t0 + 0.08, 0.4);
    if (lk2 > 0) {
      ctx.save(); ctx.translate(lx, fy); ctx.scale(1, lk2);
      K.poly(ctx, [[-w * 0.075, -h * 0.34], [w * 0.075, -h * 0.34], [w * 0.06, 0], [-w * 0.06, 0]], '#2E2A5C');
      K.fillRR(ctx, -w * 0.085, -h * 0.36, w * 0.17, h * 0.035, 4, '#3D3870');
      K.corners(ctx, 0, -h * 0.2, h * 0.08, C.WHITE); const q = h * 0.08 * K.SQ; ctx.fillStyle = C.ORANGE; ctx.fillRect(-q / 2, -h * 0.2 - q / 2, q, q);
      ctx.restore();
    }
    const tops2 = [C.BLUE, C.NAVY, C.BLUE_L, C.ORANGE, C.BLUE, C.NAVY, C.BLUE_L];
    for (let i = 0; i < 7; i++) P.person(ctx, w * (0.07 + i * 0.145), h * 1.36, h * 0.64, { k: K.pop(t, t0 + 0.05 + i * 0.03), t, seed: 431 + i, back: true, build: i % 2 ? 'f' : 'm', top: tops2[i], hair: ['short', 'gele', 'afro', 'short', 'braids', 'cap', 'bun'][i], gele: [C.ORANGE, C.BLUE][i % 2], capCol: C.NAVY });
  };
  IL.fasting = (ctx, w, h, t, t0) => {
    ctx.fillStyle = K.vgrad(ctx, 0, h, [[0, '#1F10C2'], [1, '#0D0838']]); ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { const a = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + i)); ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(U.hash(191, i) * w, U.hash(192, i) * h * 0.9, 2.2, 2.2); }
    const ck = K.pop(t, t0, 0.45, 1.4), x = w * 0.07, y = h * 0.13, cw = w * 0.45, ch = h * 0.74;
    if (ck > 0) {
      ctx.save(); ctx.translate(x + cw / 2, y + ch / 2); ctx.rotate((1 - Math.min(ck, 1)) * -0.3); ctx.scale(ck, ck); ctx.translate(-x - cw / 2, -y - ch / 2);
      K.fillRR(ctx, x, y, cw, ch, 18, C.WHITE);
      ctx.save(); ctx.clip(K.rrPath(x, y, cw, ch, 18)); ctx.fillStyle = C.ORANGE; ctx.fillRect(x, y, cw, ch * 0.24); ctx.restore();
      [0.3, 0.7].forEach((f) => K.fillRR(ctx, x + cw * f - 6, y - 12, 12, 26, 6, C.NAVY));
      K.text(ctx, 'JANVIER', x + cw / 2, y + ch * 0.13, ch * 0.1, C.WHITE, { align: 'center' });
      const cell = cw * 0.1, gap = cw * 0.025, gx = x + cw * 0.075, gy = y + ch * 0.36;
      for (let i = 0; i < 14; i++) {
        const cx = gx + (i % 7) * (cell + gap), cy = gy + Math.floor(i / 7) * (cell + gap);
        K.fillRR(ctx, cx, cy, cell, cell, 5, C.MIST);
        const q = K.pop(t, t0 + 0.12 + i * 0.055, 0.25, 2);
        if (q > 0) {
          ctx.save(); ctx.translate(cx + cell / 2, cy + cell / 2); ctx.scale(Math.min(q, 1.15), Math.min(q, 1.15));
          K.fillRR(ctx, -cell / 2, -cell / 2, cell, cell, 5, C.ORANGE);
          ctx.strokeStyle = C.WHITE; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath(); ctx.moveTo(-cell * 0.22, 0); ctx.lineTo(-cell * 0.05, cell * 0.17); ctx.lineTo(cell * 0.24, -cell * 0.18); ctx.stroke();
          ctx.restore();
        }
      }
      K.text(ctx, '14 JOURS', x + cw / 2, y + ch * 0.83, ch * 0.1, C.BLUE, { align: 'center' });
      ctx.restore();
    }
    const rx = w * 0.76, ry = h * 0.5, R = h * 0.3, rk = K.ez.inOut(prog(t, t0 + 0.1, 0.9));
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(rx, ry, R, 0, TAU); ctx.stroke();
    if (rk > 0) { ctx.strokeStyle = C.ORANGE; ctx.beginPath(); ctx.arc(rx, ry, R, -Math.PI / 2, -Math.PI / 2 + TAU * rk); ctx.stroke(); }
    K.text(ctx, String(Math.round(242 * rk)), rx, ry - R * 0.08, R * 0.62, C.WHITE, { align: 'center', alpha: clamp((t - t0) * 4) });
    K.text(ctx, 'HOURS', rx, ry + R * 0.42, R * 0.2, 'rgba(255,255,255,0.74)', { weight: 800, align: 'center', alpha: clamp((t - t0) * 4) });
  };

  globalThis.IL = IL;
})();
