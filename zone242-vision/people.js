// THE CAST of the ZONE 242 vision film.
// People drawn with Path2D shapes and form shading (light from the top left), sharp at any size:
// tapered limbs, hands with a thumb, shoes with soles, minimal faces that blink and smile, and a
// wardrobe for Cotonou (wax prints, gele headwraps, kaftans) next to tees, hoodies and blazers.
//
// A person is built in units — feet at (0, 0), about 300 units tall, facing us — and scaled to the
// height asked: P.person(ctx, x, y, h, o). Hands are placed with a two-bone arm whose elbow bends
// outward; poses are named (P.POSE) or given as hand targets in units.
(function () {
  const U = globalThis.U, K = globalThis.K;
  const { clamp, lerp } = U;
  const P = {};
  const TAU = Math.PI * 2;
  let SCALE = 1;   // pixels per unit of the person being drawn: decides how much detail a face gets

  // ---------- palette ----------
  P.SKIN = ['#4A2C1D', '#5C3624', '#6E412A', '#835034', '#9A6243', '#B07650'];
  P.HAIR = '#17100E';
  P.GREY = '#CFCAD6';
  const dark = (c, k) => K.mix(c, '#0B0520', k);
  const light = (c, k) => K.mix(c, '#FFFFFF', k);

  // ---------- bodies (units) ----------
  const BUILD = {
    m: { hy: -266, hrx: 22.5, hry: 26, shY: -224, shX: 40, waY: -160, waX: 31, hiY: -124, hiX: 33, aX: 33, aY: -212, up: 58, fo: 53, ar: [11.8, 9.6, 7.6], lgX: 16, lr: [13.5, 11.5, 9], nw: 17 },
    f: { hy: -266, hrx: 21.5, hry: 25, shY: -224, shX: 36, waY: -162, waX: 26.5, hiY: -122, hiX: 34, aX: 30, aY: -213, up: 56, fo: 51, ar: [10.4, 8.6, 6.9], lgX: 15, lr: [13, 10.5, 8.2], nw: 15 },
    kid: { hy: -250, hrx: 28, hry: 31, shY: -203, shX: 32, waY: -152, waX: 27, hiY: -114, hiX: 28, aX: 27, aY: -194, up: 46, fo: 42, ar: [9.6, 8, 6.6], lgX: 13, lr: [11.5, 10, 8], nw: 14 },
  };

  // ---------- geometry ----------
  // a tapered capsule from A (radius ra) to B (radius rb), added to the path p
  function capsule(p, ax, ay, bx, by, ra, rb) {
    const d = Math.hypot(bx - ax, by - ay) || 1e-3, ux = (bx - ax) / d, uy = (by - ay) / d, nx = -uy, ny = ux, ang = Math.atan2(uy, ux);
    p.moveTo(ax + nx * ra, ay + ny * ra);
    p.lineTo(bx + nx * rb, by + ny * rb);
    p.arc(bx, by, rb, ang + Math.PI / 2, ang - Math.PI / 2, true);
    p.lineTo(ax - nx * ra, ay - ny * ra);
    p.arc(ax, ay, ra, ang - Math.PI / 2, ang + Math.PI / 2, true);
    p.closePath();
    return p;
  }
  // two-bone limb: root S, target T, lengths a, b; the joint bends toward `out` (a unit-ish direction)
  function ik(S, T, a, b, outX, outY) {
    let dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy);
    const max = a + b - 0.3;
    if (d > max) { dx *= max / d; dy *= max / d; d = max; }
    d = Math.max(d, 1e-3);
    const ang = Math.atan2(dy, dx), A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    const E1 = [S[0] + Math.cos(ang + A) * a, S[1] + Math.sin(ang + A) * a];
    const E2 = [S[0] + Math.cos(ang - A) * a, S[1] + Math.sin(ang - A) * a];
    const s1 = (E1[0] - S[0]) * outX + (E1[1] - S[1]) * outY, s2 = (E2[0] - S[0]) * outX + (E2[1] - S[1]) * outY;
    return { J: s1 >= s2 ? E1 : E2, E: [S[0] + dx, S[1] + dy] };
  }
  const fillP = (ctx, p, c) => { ctx.fillStyle = c; ctx.fill(p); };
  // two-tone fill for shapes made of overlapping pieces (limbs, hands): no seams at the joints
  const fill2 = (ctx, p, base, sil, dx = -4, dy = -2, k = 0.24) => {
    if (sil) { fillP(ctx, p, sil); return; }
    fillP(ctx, p, K.mix(base, '#0B0520', k));
    ctx.save(); ctx.clip(p); ctx.translate(dx, dy); fillP(ctx, p, base); ctx.restore();
  };
  const ellP = (x, y, rx, ry, rot = 0, p = new Path2D()) => { p.ellipse(x, y, rx, ry, rot, 0, TAU); return p; };

  // ---------- poses: hand targets as offsets from the shoulder, in arm lengths (side-mirrored) ----------
  // a pose returns [[dx, dy] for the screen-left arm, [dx, dy] for the screen-right arm] in arm lengths,
  // or absolute unit targets when marked { abs: true }
  const POSE = P.POSE = {
    down: () => [[-0.12, 0.97], [0.12, 0.97]],
    relaxed: () => [[-0.2, 0.92], [0.2, 0.92]],
    up: (p) => [[-0.48 - 0.03 * Math.sin(p), -1.1], [0.48 + 0.03 * Math.sin(p + 1), -1.1]],
    upHigh: () => [[-0.16, -1.2], [0.16, -1.2]],
    cheer: (p) => [[-0.55, -0.85 - 0.06 * Math.sin(p * 3)], [0.55, -0.85 - 0.06 * Math.sin(p * 3 + 1)]],
    upOne: (p) => [[-0.12, 0.97], [0.42, -1.1 - 0.03 * Math.sin(p)]],
    wave: (p) => [[-0.12, 0.97], [0.62 + 0.12 * Math.sin(p * 2.6), -0.72]],
    hips: () => [[0.02, 0.62], [-0.02, 0.62]],
    cross: () => [[0.58, 0.33], [-0.58, 0.4]],
    point: () => [[-0.12, 0.97], [1, -0.08]],
    open: () => [[-0.62, 0.5], [0.62, 0.5]],
    pocket: () => [[0.02, 0.84], [-0.02, 0.84]],
    pray: () => ({ abs: true, L: [-3, -192], R: [3, -192] }),
    hold: () => ({ abs: true, L: [-18, -150], R: [18, -150] }),
    mic: () => ({ abs: true, L: null, R: [9, -244] }),
    talk: (p) => ({ abs: true, L: null, R: [50 + 6 * Math.sin(p * 3), -150 + 7 * Math.sin(p * 2.1)] }),
    clap: (p) => ({ abs: true, L: [-(3 + 7 * Math.abs(Math.sin(p * 4))), -186], R: [3 + 7 * Math.abs(Math.sin(p * 4)), -186] }),
    selfie: () => ({ abs: true, L: null, R: [100, -318] }),
    chin: () => ({ abs: true, L: null, R: [6, -236] }),
  };
  P.mix = (A, B, q) => [[lerp(A[0][0], B[0][0], q), lerp(A[0][1], B[0][1], q)], [lerp(A[1][0], B[1][0], q), lerp(A[1][1], B[1][1], q)]];
  // a named pose → absolute hand targets (units) for a build; mix them with P.mix to animate between poses
  P.hands = (build, name, p = 0) => {
    const b = BUILD[build || 'm'], L = b.up + b.fo, S = [[-b.aX, b.aY], [b.aX, b.aY]];
    const pose = (POSE[name] || POSE.down)(p);
    return [0, 1].map((i) => {
      if (pose.abs) { const a = i ? pose.R : pose.L; return a || [S[i][0] + (i ? 0.12 : -0.12) * L, S[i][1] + 0.97 * L]; }
      return [S[i][0] + pose[i][0] * L, S[i][1] + pose[i][1] * L];
    });
  };
  // a point in pixels → units of a person standing at (x, y), h pixels tall
  P.u = (x, y, h, px, py, flip) => [((px - x) / (h / 300)) * (flip ? -1 : 1), (py - y) / (h / 300)];

  // ---------- wax prints ----------
  function wax(ctx, kind, col, x0, y0, x1, y1) {
    ctx.fillStyle = col; ctx.strokeStyle = col;
    if (kind === 'stripe') {
      ctx.lineWidth = 4;
      for (let x = x0 - (y1 - y0); x < x1; x += 13) { ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x + (y1 - y0), y0); ctx.stroke(); }
      return;
    }
    const step = kind === 'rings' ? 21 : 17;
    for (let r = 0, y = y0; y < y1 + step; r++, y += step) {
      for (let x = x0 + (r % 2) * step / 2; x < x1 + step; x += step) {
        ctx.beginPath();
        if (kind === 'dots') ctx.arc(x, y, 3.6, 0, TAU);
        else if (kind === 'diamond') { ctx.moveTo(x, y - 5.5); ctx.lineTo(x + 5.5, y); ctx.lineTo(x, y + 5.5); ctx.lineTo(x - 5.5, y); ctx.closePath(); }
        else if (kind === 'leaf') { ctx.ellipse(x, y, 7, 3, (r % 2 ? 0.7 : -0.7), 0, TAU); }
        if (kind === 'rings') { ctx.lineWidth = 2.4; ctx.arc(x, y, 6.5, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 2.2, 0, TAU); ctx.fill(); }
        else ctx.fill();
      }
    }
  }

  // ---------- the person ----------
  // o: k (entrance 0..1+), t, seed, build (m | f | kid), skin, hair, hairCol, mood (smile | grin | calm | o | none),
  //    outfit (tee | shirt | blazer | hoodie | dress | gown | kaftan | skirt), top, bottom, shoes, sole, pattern, patCol,
  //    flare, sleeve (short | long | none), collar, tie, bowtie, square (pocket square), trim, gele, capCol, beanie,
  //    glasses, beard, earrings, pack, phones, headset, medal, badge, item, pose | hands, legs (stand | wide | walk | jump),
  //    walk (cycle phase), flip, lean, tilt, look, back, bow, bust, sil (one colour: a silhouette), rim (rim-light colour)
  P.person = (ctx, x, y, h, o = {}) => {
    const k = o.k ?? 1;
    if (k <= 0.001 || h <= 0) return;
    if (o.sil && o.rim) P.person(ctx, x - h * 0.008, y - h * 0.006, h, Object.assign({}, o, { sil: o.rim, rim: null }));
    ctx.save();
    ctx.translate(x, y + (1 - Math.min(k, 1)) * h * 0.22 - (o.hop || 0) * h / 300);
    ctx.globalAlpha *= clamp(k * 3);
    const s = (h / 300) * (k > 1 ? 1 + (k - 1) * 0.25 : 1);
    ctx.scale((o.flip ? -1 : 1) * s, s);
    const stanceLean = o.stance === 'l' ? 0.014 : o.stance === 'r' ? -0.014 : 0;
    if (o.lean || stanceLean) ctx.rotate((o.lean || 0) + stanceLean);
    SCALE = s * (globalThis.G && G.scale ? G.scale : 1);
    draw(ctx, o);
    ctx.restore();
  };

  function draw(ctx, o) {
    const b = BUILD[o.build || 'm'], sil = o.sil || null, t = o.t ?? 0, seed = o.seed ?? 1;
    const skin = sil || o.skin || P.SKIN[2], skinD = sil || K.mix(skin, '#1A0710', 0.3), skinL = sil || K.mix(skin, '#FFE2CC', 0.14);
    const hairC = sil || o.hairCol || (o.hair === 'gray' ? P.GREY : P.HAIR);
    const fit = o.outfit || 'tee', hair = o.hair || 'short';
    const top = sil || o.top || K.C.BLUE, bottom = sil || o.bottom || K.C.NAVY;
    const shoeC = sil || o.shoes || '#1E1A33', soleC = sil || o.sole || '#F1EFF8';
    const kid = o.build === 'kid';
    const ph = o.ph ?? seed * 1.37;
    const SH = (p, a = 0.24, dx = -7, dy = -3) => { if (!sil) K.form(ctx, p, a, dx, dy); };
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // walking: the body bobs twice a cycle, feet lift in turn
    let bob = 0, lift = [0, 0];
    if (o.legs === 'walk') { const w = TAU * (o.walk ?? t * 1.6); bob = -Math.abs(Math.sin(w)) * 5; lift = [Math.max(0, Math.sin(w)) * 18, Math.max(0, -Math.sin(w)) * 18]; }
    if (o.legs === 'jump') lift = [34, 34];
    ctx.translate(0, bob);

    // ---------- hands: where they go ----------
    const L = b.up + b.fo;
    const S = [[-b.aX, b.aY], [b.aX, b.aY]];
    let pose = o.hands ? null : (POSE[o.pose || 'down'] || POSE.down)(t * 2 + ph);
    const tgt = [0, 1].map((i) => {
      if (o.hands) return o.hands[i] || [S[i][0] + (i ? 0.12 : -0.12) * L, S[i][1] + 0.97 * L];
      if (pose.abs) { const a = i ? pose.R : pose.L; return a || [S[i][0] + (i ? 0.12 : -0.12) * L, S[i][1] + 0.97 * L]; }
      return [S[i][0] + pose[i][0] * L, S[i][1] + pose[i][1] * L];
    });
    const arms = [0, 1].map((i) => {
      const side = i ? 1 : -1, r = ik(S[i], tgt[i], b.up, b.fo, side, 0.35);
      return { side, S: S[i], E: r.J, H: r.E };
    });

    // ---------- behind the body ----------
    if (!o.back) backHair(ctx, b, hair, hairC, sil, t, seed);
    if (o.pack) fillP(ctx, K.rrPath(-b.shX - 7, b.shY - 10, 2 * b.shX + 14, 104, 22), sil || o.pack);
    if (fit === 'hoodie' && !o.back) { const p = ellP(0, b.shY - 6, b.nw + 15, 15); fillP(ctx, p, sil || dark(top, 0.18)); }

    // ---------- legs and shoes ----------
    if (!o.bust) {
      const skirt = fit === 'dress' || fit === 'skirt' || fit === 'gown' || fit === 'kaftan';
      const legC = fit === 'dress' || fit === 'skirt' ? skin : bottom;
      const hipY = b.hiY - 2, ankY = -12, Lt = (Math.abs(hipY) + ankY) / 2 + 0.6;
      const wideX = o.legs === 'wide' ? 9 : 0;
      for (const [i, sd] of [[0, -1], [1, 1]]) {
        const relaxed = (o.stance === 'l' && sd > 0) || (o.stance === 'r' && sd < 0);
        const Hj = [sd * b.lgX, hipY], F = [sd * (b.lgX + 2 + wideX - (relaxed ? 5 : 0)), ankY - lift[i] - (relaxed ? 7 : 0)];
        const r = ik(Hj, F, Lt, Lt, sd, -0.2), Kn = r.J, A = r.E;
        if (fit !== 'gown') {
          const lp = new Path2D();
          capsule(lp, Hj[0], Hj[1], Kn[0], Kn[1], b.lr[0], b.lr[1]); capsule(lp, Kn[0], Kn[1], A[0], A[1], b.lr[1], b.lr[2]);
          fill2(ctx, lp, legC, sil, -6, -1, 0.22);
          if (!sil && !skirt && !o.shorts) {   // a crease, and jeans stitching
            ctx.strokeStyle = fit === 'kaftan' ? dark(legC, 0.12) : K.rgba('#0B0520', 0.18); ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(Hj[0] + sd * 2, Hj[1] + 26); ctx.lineTo(A[0] + sd * 1, A[1] - 6); ctx.stroke();
          }
          if (o.shorts && !sil) {   // shorts: skin below the knee
            const sk = new Path2D(); capsule(sk, Kn[0], Kn[1] + 8, A[0], A[1], b.lr[1] - 1.5, b.lr[2] - 1); fill2(ctx, sk, skin, sil, -5, -1, 0.26);
          }
        }
        // shoe
        const fx = A[0] + sd * 3, fy = A[1] + 12;
        const shoe = K.rrPath(fx - 14, fy - 14, 28, 14, 7);
        fillP(ctx, shoe, shoeC);
        if (!sil) { fillP(ctx, K.rrPath(fx - 14, fy - 4.5, 28, 4.5, 2.2), soleC); SH(shoe, 0.25, -5, -2); }
      }
    }

    // ---------- arms behind the back (rare) ----------
    // (all arms are drawn over the body below)

    // ---------- neck ----------
    const neckTop = b.hy + b.hry - 12;
    const neck = K.rrPath(-b.nw / 2, neckTop, b.nw, b.shY - neckTop + 8, 5);
    fillP(ctx, neck, skin);
    if (!sil) { ctx.save(); ctx.clip(neck); K.ell(ctx, 0, neckTop + 4, b.nw, 9, K.rgba('#1A0710', 0.32)); ctx.restore(); }

    // ---------- body ----------
    const hemY = fit === 'gown' ? -2 : fit === 'dress' ? -66 : fit === 'skirt' ? -70 : fit === 'kaftan' ? -82 : null;
    const flare = o.flare ?? (fit === 'gown' ? 66 : fit === 'kaftan' ? 44 : fit === 'skirt' ? 44 : 52);
    const body = torsoPath(b, hemY, flare);
    fillP(ctx, body, top);
    if (!sil && o.pattern) { ctx.save(); ctx.clip(body); wax(ctx, o.pattern, o.patCol || K.C.WHITE, -90, b.shY - 6, 90, hemY ?? b.hiY); ctx.restore(); }
    if (fit === 'skirt' && !sil) {   // a top over the skirt
      const tp = torsoPath(b, null, 0, b.waY + 8);
      fillP(ctx, tp, o.blouse || K.C.WHITE); SH(tp, 0.2);
    }
    SH(body, 0.22, -8, -3);
    if (!sil) {
      ctx.save(); ctx.clip(body);
      const g = ctx.createLinearGradient(0, b.shY, 0, hemY ?? b.hiY);
      g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(11,5,32,0.08)');
      ctx.fillStyle = g; ctx.fillRect(-120, b.shY - 10, 240, (hemY ?? b.hiY) - b.shY + 20);
      for (const sd of [-1, 1]) K.ell(ctx, sd * (b.shX - 5), b.shY + 30, 7, 17, 'rgba(11,5,32,0.14)');
      if (fit === 'tee' || fit === 'hoodie' || fit === 'shirt') {
        ctx.strokeStyle = 'rgba(11,5,32,0.12)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-b.waX + 5, b.waY + 16); ctx.quadraticCurveTo(-b.waX + 14, b.waY + 24, -6, b.waY + 27); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(b.waX - 4, b.waY + 8); ctx.quadraticCurveTo(b.waX - 14, b.waY + 15, 10, b.waY + 17); ctx.stroke();
      }
      ctx.restore();
      details(ctx, b, fit, top, o, skin, t);
    }

    // seen from behind, long hair falls over the back
    if (o.back && ['long', 'braids', 'locs'].includes(hair)) backHair(ctx, b, hair, hairC, sil, t, seed);

    // ---------- head ----------
    ctx.save();
    if (o.tilt) { ctx.translate(0, b.hy + b.hry); ctx.rotate(o.tilt); ctx.translate(0, -(b.hy + b.hry)); }
    head(ctx, b, o, { skin, skinD, skinL, hairC, hair, sil, t, seed, kid });
    ctx.restore();

    // ---------- what is held in front of the body ----------
    const hand = (i) => arms[i].H;
    if (o.item === 'guitar') guitar(ctx, sil);
    if (o.item === 'book') { const p = K.rrPath(-27, -176, 54, 36, 4); fillP(ctx, p, sil || o.itemCol || K.C.NAVY); if (!sil) { fillP(ctx, K.rrPath(-23, -173, 46, 30, 2), '#F7F5F1'); ctx.fillStyle = K.rgba('#0B0520', 0.25); ctx.fillRect(-1.2, -173, 2.4, 30); } }
    if (o.item === 'tablet') { fillP(ctx, K.rrPath(-29, -180, 58, 40, 6), sil || '#1E1A33'); if (!sil) fillP(ctx, K.rrPath(-24, -175, 48, 30, 3), K.C.BLUE_L); }
    if (o.item === 'box') { const p = K.rrPath(-30, -186, 60, 44, 3); fillP(ctx, p, sil || '#E9B48A'); if (!sil) { ctx.fillStyle = K.rgba('#FFFFFF', 0.5); ctx.fillRect(-4, -186, 8, 44); SH(p, 0.2); } }

    // ---------- arms and hands ----------
    const longSl = o.sleeve ? o.sleeve === 'long' : ['shirt', 'blazer', 'hoodie', 'kaftan'].includes(fit);
    const noSl = o.sleeve === 'none';
    const sleeveC = sil || o.sleeveCol || (fit === 'skirt' ? (o.blouse || K.C.WHITE) : top);
    arms.forEach(({ side, S: Sh, E, H: Hd }) => {
      const ap = new Path2D();
      capsule(ap, Sh[0], Sh[1], E[0], E[1], b.ar[0], b.ar[1]); capsule(ap, E[0], E[1], Hd[0], Hd[1], b.ar[1], b.ar[2]);
      fill2(ctx, ap, skin, sil, -4, -2, 0.28);
      if (!noSl) {
        const sp = new Path2D(), wide = fit === 'kaftan' ? 3.5 : 2.2;
        if (longSl) {
          const C = [lerp(E[0], Hd[0], 0.8), lerp(E[1], Hd[1], 0.8)];
          capsule(sp, Sh[0], Sh[1], E[0], E[1], b.ar[0] + wide, b.ar[1] + wide); capsule(sp, E[0], E[1], C[0], C[1], b.ar[1] + wide, b.ar[2] + wide + (fit === 'kaftan' ? 2.5 : 0.6));
          fill2(ctx, sp, sleeveC, sil, -4, -2, 0.2);
          if (!sil && fit !== 'kaftan') {   // cuff
            const cf = new Path2D(), C0 = [lerp(E[0], Hd[0], 0.7), lerp(E[1], Hd[1], 0.7)];
            capsule(cf, C0[0], C0[1], C[0], C[1], b.ar[2] + wide + 0.4, b.ar[2] + wide + 0.6);
            fillP(ctx, cf, fit === 'hoodie' ? dark(sleeveC, 0.14) : fit === 'shirt' ? light(sleeveC, 0.12) : dark(sleeveC, 0.08));
          }
        } else {
          const C = [lerp(Sh[0], E[0], 0.55), lerp(Sh[1], E[1], 0.55)];
          capsule(sp, Sh[0], Sh[1], C[0], C[1], b.ar[0] + 3, b.ar[1] + 3.6);
          fill2(ctx, sp, sleeveC, sil, -4, -2, 0.2);
        }
      }
      handShape(ctx, Hd, E, side, skin, sil, b);
    });

    // ---------- what is held in a hand ----------
    const R = hand(1), Lh = hand(0);
    if (o.item === 'mic') { fillP(ctx, K.rrPath(R[0] - 4, R[1] - 32, 8, 28, 3), sil || '#241D3D'); K.circ(ctx, R[0], R[1] - 34, 8, sil || '#4A4466'); }
    if (o.item === 'cup') { const p = K.rrPath(R[0] - 9, R[1] - 25, 18, 25, 3); fillP(ctx, p, sil || K.C.WHITE); if (!sil) { ctx.fillStyle = K.C.ORANGE; ctx.fillRect(R[0] - 9, R[1] - 17, 18, 6); SH(p, 0.15, -3, 0); } }
    if (o.item === 'phone') fillP(ctx, K.rrPath(R[0] - 8, R[1] - 31, 16, 29, 4), sil || '#1E1A33');
    if (o.item === 'flag') {
      ctx.strokeStyle = sil || '#F1EFF8'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(R[0], R[1] + 10); ctx.lineTo(R[0], R[1] - 96); ctx.stroke();
      const pts = []; for (let i = 0; i <= 8; i++) pts.push([R[0] + i * 7, R[1] - 96 + Math.sin(t * 7 - i * 0.7) * 2.5 * i / 8]);
      for (let i = 8; i >= 0; i--) pts.push([R[0] + i * 7, R[1] - 66 + Math.sin(t * 7 - i * 0.7) * 2.5 * i / 8]);
      K.poly(ctx, pts, sil || o.itemCol || K.C.ORANGE);
    }
    if (o.item === 'stick') {
      const a = o.stickA ?? -0.3, len = 120, ex = R[0] + Math.cos(a) * len, ey = R[1] + Math.sin(a) * len;
      ctx.strokeStyle = sil || '#6B3A1E'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(R[0], R[1]); ctx.lineTo(ex, ey); ctx.stroke();
      fillP(ctx, K.rrPath(ex - 7, ey - 7, 14, 14, 5), sil || '#FFF1EA');
    }
    if (o.item === 'cane') { ctx.strokeStyle = sil || '#5B3A22'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Lh[0], Lh[1] - 10); ctx.lineTo(Lh[0] - 5, -4); ctx.stroke(); ctx.beginPath(); ctx.arc(Lh[0] + 6, Lh[1] - 10, 6, Math.PI, 0); ctx.stroke(); }
  }

  // the body outline: shoulders, waist, then hips — or a skirt that flares to `hem`
  function torsoPath(b, hem, flare, cutY) {
    const p = new Path2D(), { shY, shX, waY, waX, hiY, hiX } = b;
    p.moveTo(-shX, shY + 15);
    p.quadraticCurveTo(-shX, shY, -shX + 15, shY);
    p.lineTo(shX - 15, shY);
    p.quadraticCurveTo(shX, shY, shX, shY + 15);
    p.quadraticCurveTo(shX + 1.5, (shY + waY) / 2, waX, waY);
    if (cutY != null) { p.lineTo(waX + 1, cutY); p.quadraticCurveTo(0, cutY + 6, -waX - 1, cutY); }
    else if (hem == null) { p.quadraticCurveTo(waX + 1, (waY + hiY) / 2, hiX, hiY); p.lineTo(-hiX, hiY); p.quadraticCurveTo(-waX - 1, (waY + hiY) / 2, -waX, waY); }
    else {
      p.quadraticCurveTo(waX + (flare - waX) * 0.15, (waY + hem) / 2, flare, hem);
      p.quadraticCurveTo(0, hem + 9, -flare, hem);
      p.quadraticCurveTo(-waX - (flare - waX) * 0.15, (waY + hem) / 2, -waX, waY);
    }
    p.quadraticCurveTo(-shX - 1.5, (shY + waY) / 2, -shX, shY + 15);
    p.closePath();
    return p;
  }

  // collars, buttons, lapels, pockets: what makes each garment read
  function details(ctx, b, fit, top, o, skin, t) {
    const { shY, waY, hiY } = b;
    const seam = dark(top, 0.2);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (fit === 'tee' || fit === 'gown' || fit === 'dress' || fit === 'skirt') {
      const neckC = fit === 'skirt' ? (o.blouse || K.C.WHITE) : top;
      if (o.vneck || fit === 'gown') { K.poly(ctx, [[-11, shY - 1], [11, shY - 1], [0, shY + 17]], skin); ctx.strokeStyle = dark(neckC, 0.22); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, shY); ctx.lineTo(0, shY + 18); ctx.lineTo(12, shY); ctx.stroke(); }
      else { ctx.strokeStyle = dark(neckC, 0.24); ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(0, shY + 1, 12, 7.5, 0, 0.06 * Math.PI, 0.94 * Math.PI); ctx.stroke(); }
      if (fit === 'dress' || fit === 'gown') { ctx.strokeStyle = K.rgba('#0B0520', 0.16); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-b.waX + 1, waY); ctx.quadraticCurveTo(0, waY + 5, b.waX - 1, waY); ctx.stroke(); }
      if (o.logo) { K.fillRR(ctx, 9, shY + 22, 12, 12, 1, o.logo); }
    }
    if (fit === 'shirt') {
      const col = o.collar || K.light(top, 0.85);
      K.poly(ctx, [[-15, shY - 2], [-1, shY + 2], [-9, shY + 15]], col); K.poly(ctx, [[15, shY - 2], [1, shY + 2], [9, shY + 15]], col);
      ctx.strokeStyle = seam; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, shY + 4); ctx.lineTo(0, hiY - 2); ctx.stroke();
      for (let yy = shY + 20; yy < hiY - 6; yy += 22) K.circ(ctx, 4, yy, 2.2, dark(top, 0.35));
      K.fillRR(ctx, -27, shY + 26, 15, 14, 2, K.rgba('#0B0520', 0.1));
    }
    if (fit === 'blazer') {
      const shirt = o.shirtCol || (top === K.C.WHITE ? K.C.CLOUD : K.C.WHITE);
      K.poly(ctx, [[-14, shY - 1], [14, shY - 1], [0, shY + 48]], shirt);
      if (o.bowtie) { K.poly(ctx, [[0, shY + 4], [-12, shY - 2], [-12, shY + 10]], o.bowtie); K.poly(ctx, [[0, shY + 4], [12, shY - 2], [12, shY + 10]], o.bowtie); K.circ(ctx, 0, shY + 4, 3, dark(o.bowtie, 0.2)); }
      else if (o.tie !== false) K.poly(ctx, [[-4.5, shY + 2], [4.5, shY + 2], [7, shY + 32], [0, shY + 44], [-7, shY + 32]], o.tie || K.C.ORANGE);
      const lap = dark(top, 0.22);
      K.poly(ctx, [[-14, shY - 1], [-23, shY + 12], [-9, shY + 40], [0, shY + 48]], lap);
      K.poly(ctx, [[14, shY - 1], [23, shY + 12], [9, shY + 40], [0, shY + 48]], lap);
      K.circ(ctx, 0, shY + 62, 2.6, dark(top, 0.4)); K.circ(ctx, 0, shY + 80, 2.6, dark(top, 0.4));
      if (o.square) K.poly(ctx, [[-30, shY + 34], [-18, shY + 34], [-24, shY + 25]], o.square);
    }
    if (fit === 'hoodie') {
      K.fillRR(ctx, -27, hiY - 46, 54, 32, 11, dark(top, 0.12));
      ctx.strokeStyle = K.C.WHITE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-8, shY + 2); ctx.lineTo(-9, shY + 28); ctx.moveTo(8, shY + 2); ctx.lineTo(9, shY + 28); ctx.stroke();
      K.circ(ctx, -9, shY + 30, 2.4, K.C.WHITE); K.circ(ctx, 9, shY + 30, 2.4, K.C.WHITE);
      ctx.fillStyle = dark(top, 0.14); ctx.fillRect(-b.hiX + 1, hiY - 9, 2 * b.hiX - 2, 8);
    }
    if (fit === 'kaftan') {
      const tr = o.trim || K.C.ORANGE;
      ctx.strokeStyle = tr; ctx.lineWidth = 3.6;
      ctx.beginPath(); ctx.moveTo(-15, shY - 1); ctx.lineTo(0, shY + 30); ctx.lineTo(15, shY - 1); ctx.moveTo(0, shY + 30); ctx.lineTo(0, shY + 74); ctx.stroke();
      for (let i = 0; i < 4; i++) K.fillRR(ctx, -3.2, shY + 38 + i * 9, 6.4, 6.4, 1, tr);
    }
    if (o.badge) {
      ctx.strokeStyle = K.C.NAVY; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-12, shY + 1); ctx.lineTo(0, shY + 34); ctx.lineTo(12, shY + 1); ctx.stroke();
      K.fillRR(ctx, -10, shY + 32, 20, 25, 3, K.C.WHITE); K.fillRR(ctx, -6, shY + 38, 12, 5, 1, K.C.BLUE); K.fillRR(ctx, -6, shY + 46, 8, 3, 1, K.C.HAZE);
    }
    if (o.medal) {
      ctx.strokeStyle = K.C.WHITE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-13, shY); ctx.lineTo(0, shY + 34); ctx.lineTo(13, shY); ctx.stroke();
      K.circ(ctx, 0, shY + 42, 10.5, '#FFB13B'); K.circ(ctx, 0, shY + 42, 5.5, '#FFD27A');
    }
    if (o.pack) { K.fillRR(ctx, -31, shY - 1, 9, 74, 4, dark(o.pack, 0.12)); K.fillRR(ctx, 22, shY - 1, 9, 74, 4, dark(o.pack, 0.12)); }
  }

  // ---------- heads, faces, hair ----------
  function backHair(ctx, b, hair, col, sil, t, seed) {
    const { hy, hrx, hry } = b;
    if (hair === 'afro') {
      const p = ellP(0, hy - 8, hrx + 13, hry + 10);
      fillP(ctx, p, col);
      if (!sil) { ctx.save(); ctx.clip(p); for (let i = 0; i < 26; i++) K.circ(ctx, (U.hash(seed, i) - 0.5) * 2 * (hrx + 12), hy - 8 + (U.hash(seed + 1, i) - 0.5) * 2 * (hry + 9), 2.2, K.rgba('#FFFFFF', 0.06)); ctx.restore(); }
    }
    if (hair === 'puffs') { for (const sd of [-1, 1]) { fillP(ctx, ellP(sd * (hrx + 1), hy - hry * 0.72, 14, 14), col); } }
    if (hair === 'long') fillP(ctx, K.rrPath(-hrx - 7, hy - 14, 2 * hrx + 14, hry + 66, 24), col);
    if (hair === 'braids' || hair === 'locs') {
      const n = hair === 'braids' ? 9 : 7, w = hair === 'braids' ? 7 : 9.5, len = hair === 'braids' ? 104 : 92;
      for (let i = 0; i < n; i++) {
        const f = i / (n - 1) - 0.5, x = f * (2 * hrx + 10), sway = Math.sin(t * 2 + i) * 1.2;
        fillP(ctx, K.rrPath(x - w / 2 + sway, hy - 10, w, len - Math.abs(f) * 30, w / 2), col);
        if (hair === 'braids' && !sil) K.circ(ctx, x + sway, hy - 10 + len - Math.abs(f) * 30, 3.4, K.C.ORANGE);
      }
    }
    if (hair === 'bun') fillP(ctx, ellP(0, hy - hry - 9, 13, 12), col);
  }

  function head(ctx, b, o, c) {
    const { hy, hrx, hry } = b, { skin, skinD, hairC, hair, sil, t, seed } = c;
    // ears
    for (const sd of [-1, 1]) {
      fillP(ctx, ellP(sd * (hrx - 0.5), hy + 3, 4.8, 6.8), skin);
      if (!sil) K.ell(ctx, sd * (hrx + 0.3), hy + 3.5, 2.2, 3.6, skinD);
      if (o.earrings && !sil) K.circ(ctx, sd * (hrx + 0.5), hy + 12, 2.6, o.earrings);
    }
    const hp = ellP(0, hy, hrx, hry);
    if (o.back) { fillP(ctx, hp, hair === 'bald' ? skin : hairC); if (hair === 'gele') gele(ctx, b, o, sil, t); return; }
    fillP(ctx, hp, skin);
    if (!sil) {
      K.form(ctx, hp, 0.26, -6, -2, '#1A0710');
      ctx.save(); ctx.clip(hp); K.ell(ctx, -hrx * 0.35, hy - hry * 0.45, hrx * 0.5, hry * 0.32, K.rgba('#FFE7D6', 0.08)); ctx.restore();
      face(ctx, b, o, skin, skinD, hairC, t, seed);
    }
    // front hair and hats
    const cap = (col, line) => {
      const p = new Path2D();
      p.moveTo(-hrx - 1.5, hy + 3);
      p.bezierCurveTo(-hrx - 4, hy - hry * 1.42, hrx + 4, hy - hry * 1.42, hrx + 1.5, hy + 3);
      p.bezierCurveTo(hrx - 2, hy - 5, hrx * 0.5, hy - hry * line, 0, hy - hry * line);
      p.bezierCurveTo(-hrx * 0.5, hy - hry * line, -hrx + 2, hy - 5, -hrx - 1.5, hy + 3);
      p.closePath();
      fillP(ctx, p, col);
      if (!sil) { K.form(ctx, p, 0.2, -5, -2); ctx.save(); ctx.clip(p); ctx.strokeStyle = K.rgba('#FFFFFF', 0.09); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-3, hy - 2, hrx * 0.95, Math.PI * 1.2, Math.PI * 1.45); ctx.stroke(); ctx.restore(); }
      return p;
    };
    if (['short', 'afro', 'puffs', 'bun', 'long', 'braids', 'locs', 'gray'].includes(hair)) {
      const p = cap(hairC, hair === 'short' || hair === 'gray' ? 0.56 : 0.5);
      if (hair === 'braids' && !sil) { ctx.save(); ctx.clip(p); ctx.strokeStyle = K.rgba('#FFFFFF', 0.1); ctx.lineWidth = 2; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 7, hy - hry * 0.5); ctx.quadraticCurveTo(i * 9, hy - hry * 1.1, i * 6, hy - hry * 1.3); ctx.stroke(); } ctx.restore(); }
      if (hair === 'puffs' && !sil) for (const sd of [-1, 1]) K.fillRR(ctx, sd * (hrx - 3) - 4, hy - hry * 0.5 - 4, 8, 8, 2, o.tieCol || K.C.ORANGE);
      if (hair === 'bun' && !sil) K.fillRR(ctx, -9, hy - hry - 1, 18, 5, 2, o.tieCol || K.C.ORANGE);
    }
    if (hair === 'bald' && !sil) K.ell(ctx, -6, hy - hry * 0.62, 8, 4, K.rgba('#FFFFFF', 0.16), -0.3);
    if (hair === 'cap') {
      const cc = sil || o.capCol || K.C.BLUE;
      const p = cap(cc, 0.32);
      K.ell(ctx, 0, hy - hry * 0.32 + 1, hrx + 10, 6.5, sil || dark(cc, 0.28));
      if (!sil) K.circ(ctx, 0, hy - hry * 1.05, 3, dark(cc, 0.2));
      void p;
    }
    if (hair === 'beanie') {
      const bc = sil || o.capCol || K.C.ORANGE;
      const p = new Path2D(); p.moveTo(-hrx - 2, hy - hry * 0.25); p.bezierCurveTo(-hrx - 3, hy - hry * 1.5, hrx + 3, hy - hry * 1.5, hrx + 2, hy - hry * 0.25); p.closePath();
      fillP(ctx, p, bc); if (!sil) K.form(ctx, p, 0.2, -5, -2);
      K.fillRR(ctx, -hrx - 3, hy - hry * 0.45, 2 * hrx + 6, 11, 5, sil || dark(bc, 0.15));
    }
    if (hair === 'gele') gele(ctx, b, o, sil, t);
    if (o.glasses && !sil) {
      ctx.strokeStyle = '#1A1430'; ctx.lineWidth = 2.2;
      for (const sd of [-1, 1]) ctx.stroke(K.rrPath(sd * 8.5 - 7, hy - 1, 14, 10.5, 3.5));
      ctx.beginPath(); ctx.moveTo(-1.5, hy + 3); ctx.lineTo(1.5, hy + 3); ctx.stroke();
    }
  }

  function face(ctx, b, o, skin, skinD, hairC, t, seed) {
    const { hy, hrx, hry } = b;
    const lx = clamp(o.look ?? 0, -1, 1) * 2.4, ly = (o.lookY ?? 0) * 1.5;
    // a blink every few seconds
    const period = 2.8 + U.hash(seed, 7) * 1.8, ph = ((t + U.hash(seed, 8) * period) % period) / period;
    const blink = o.eyes === 'closed' ? 1 : ph > 0.955 ? Math.sin((ph - 0.955) / 0.045 * Math.PI) : 0;
    const ey = hy + 2.5 + ly, ex = hrx * 0.39, mood = o.mood || 'smile', mx0 = lx * 0.4, my = hy + 17;
    const hi = hrx * SCALE >= 9.5;   // enough pixels for a detailed face
    // eyes
    for (const sd of [-1, 1]) {
      const cx = sd * ex + lx * 0.45;
      if (o.eyes === 'happy') { ctx.strokeStyle = '#170B07'; ctx.lineWidth = 2.3; ctx.beginPath(); ctx.arc(cx, ey + 1.8, 3.6, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke(); continue; }
      if (!hi) {
        K.ell(ctx, cx, ey, 2.5, Math.max(0.4, 3.3 * (1 - 0.88 * blink)), '#170B07');
        if (blink < 0.5) K.circ(ctx, cx - 0.7, ey - 1.1, 0.8, K.rgba('#FFFFFF', 0.75));
        continue;
      }
      const open = 1 - blink, ry = 3.6 * open;
      if (ry > 0.5) {
        const sc = ellP(cx, ey, 4.6, ry);
        fillP(ctx, sc, '#FBF6F0');
        ctx.save(); ctx.clip(sc);
        K.circ(ctx, cx + lx * 0.8, ey + 0.4, 2.9, '#3B1E10');
        K.circ(ctx, cx + lx * 0.8, ey + 0.4, 1.45, '#0C0503');
        K.circ(ctx, cx + lx * 0.8 - 1.1, ey - 0.8, 0.95, 'rgba(255,255,255,0.92)');
        K.ell(ctx, cx, ey - ry - 0.4, 5.4, 1.9, 'rgba(26,7,16,0.28)');
        ctx.restore();
      }
      ctx.strokeStyle = '#120706'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.ellipse(cx, ey + (1 - open) * 0.8, 4.8, Math.max(0.5, ry + 0.25), 0, Math.PI * 1.04, Math.PI * 1.96); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + sd * 4.4, ey - 0.8); ctx.lineTo(cx + sd * 5.9, ey - 2); ctx.stroke();
    }
    // brows
    ctx.strokeStyle = o.hair === 'gray' ? P.GREY : '#1B110D'; ctx.lineWidth = hi ? 2.6 : 2.3;
    const raise = mood === 'grin' || mood === 'o' ? 1.6 : 0;
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * (ex - 4.4) + lx * 0.45, hy - 6.4 - raise); ctx.quadraticCurveTo(sd * ex + lx * 0.45, hy - 9.4 - raise, sd * (ex + 4.8) + lx * 0.45, hy - 6.6 - raise); ctx.stroke(); }
    // nose: the bridge catches the light, the underside and nostrils fall into shade
    const nx = lx * 0.5, ny = hy + 10.5;
    if (hi) {
      ctx.strokeStyle = K.rgba('#1A0710', 0.34); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(nx + 1.6, hy + 1.5); ctx.quadraticCurveTo(nx + 3.3, ny - 3, nx + 3.8, ny); ctx.stroke();
      K.ell(ctx, nx, ny + 0.6, 4.8, 2.6, K.rgba('#1A0710', 0.2));
      K.circ(ctx, nx - 2.2, ny + 0.9, 0.95, K.rgba('#1A0710', 0.5)); K.circ(ctx, nx + 2.2, ny + 0.9, 0.95, K.rgba('#1A0710', 0.5));
      K.circ(ctx, nx - 0.9, ny - 2, 1.1, K.rgba('#FFE7D6', 0.24));
    } else K.ell(ctx, nx, hy + 11, 3.3, 2.2, K.rgba('#1A0710', 0.3));
    // mouth
    const lipC = K.mix(skin, '#4A1219', 0.42), lipL = K.mix(skin, '#7A2E30', 0.32), line = '#2A0A0E';
    if (!hi) {
      ctx.strokeStyle = K.mix(skin, '#1A0710', 0.62); ctx.lineWidth = 2.2;
      if (mood === 'grin' || mood === 'o') { const p = ellP(mx0, my - 1.5, mood === 'grin' ? 5.6 : 3.4, mood === 'grin' ? 3.6 : 4.2); fillP(ctx, p, '#3A0F12'); }
      else { ctx.beginPath(); ctx.arc(mx0, my - 5, mood === 'calm' ? 3.8 : 5.6, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
    } else if (mood === 'grin' || mood === 'o') {
      const m = new Path2D();
      if (mood === 'grin') { m.moveTo(mx0 - 7.6, my - 3); m.quadraticCurveTo(mx0, my - 1.2, mx0 + 7.6, my - 3); m.quadraticCurveTo(mx0, my + 8.4, mx0 - 7.6, my - 3); m.closePath(); }
      else m.ellipse(mx0, my - 0.5, 3.8, 4.6 + Math.sin(t * 6) * 0.8, 0, 0, TAU);
      fillP(ctx, m, '#33090E');
      ctx.save(); ctx.clip(m);
      if (mood === 'grin') { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(mx0 - 8, my - 4, 16, 3.4); }
      K.ell(ctx, mx0, my + 5.5, 4.4, 2.6, '#B8444A');
      ctx.restore();
      ctx.strokeStyle = lipC; ctx.lineWidth = 1.8; ctx.stroke(m);
    } else {
      const w = mood === 'smile' ? 7.4 : 5.8, up = mood === 'smile' ? 2.4 : 1;
      const lo = new Path2D(); lo.moveTo(mx0 - w * 0.78, my - up * 0.4); lo.quadraticCurveTo(mx0, my + 4.6, mx0 + w * 0.78, my - up * 0.4); lo.quadraticCurveTo(mx0, my + 1.4, mx0 - w * 0.78, my - up * 0.4); lo.closePath();
      fillP(ctx, lo, lipL);
      const ul = new Path2D(); ul.moveTo(mx0 - w, my - up); ul.quadraticCurveTo(mx0 - w * 0.45, my - 3.9, mx0 - 1.1, my - 2.8); ul.lineTo(mx0, my - 2.3); ul.lineTo(mx0 + 1.1, my - 2.8); ul.quadraticCurveTo(mx0 + w * 0.45, my - 3.9, mx0 + w, my - up); ul.quadraticCurveTo(mx0, my + 1.7, mx0 - w, my - up); ul.closePath();
      fillP(ctx, ul, lipC);
      ctx.strokeStyle = line; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(mx0 - w, my - up); ctx.quadraticCurveTo(mx0, my + 2.2, mx0 + w, my - up); ctx.stroke();
      K.ell(ctx, mx0 - 1.5, my + 2.8, 2, 0.9, K.rgba('#FFFFFF', 0.18));
    }
    // cheeks
    for (const sd of [-1, 1]) K.ell(ctx, sd * (ex + 3.5) + lx, hy + 11.5, 4.2, 2.6, K.rgba('#FF5A36', 0.1));
    // beard: a groomed band along the jaw, a moustache; the mouth stays clear
    if (o.beard) {
      const bc = o.beard === true ? (o.hair === 'gray' ? P.GREY : P.HAIR) : o.beard;
      const hp = ellP(0, hy, hrx + 0.6, hry + 0.6), band = new Path2D();
      band.rect(-hrx - 2, hy + 2, 2 * hrx + 4, hry + 4);
      band.ellipse(0, hy - 3, hrx - 5.5, hry - 6, 0, 0, TAU);
      ctx.save(); ctx.clip(hp); ctx.fillStyle = bc; ctx.fill(band, 'evenodd');
      K.ell(ctx, lx * 0.4, my + 4.5, 6.5, 4.5, bc);
      ctx.restore();
      K.fillRR(ctx, -7.5 + lx * 0.4, my - 9.6, 15, 4.2, 2.1, bc);
      if (o.mood !== 'grin') { ctx.strokeStyle = K.mix(skin, '#1A0710', 0.62); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lx * 0.4, my - 5, 5, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
    }
  }

  // the gele: a sculpted headwrap, folds rising above the head
  function gele(ctx, b, o, sil, t) {
    const { hy, hrx, hry } = b, col = sil || o.gele || K.C.ORANGE, fold = sil || dark(col, 0.22), hi = sil || light(col, 0.2);
    // the fan: stiff pleats opening above the head, wider than it, alternating light and shade
    const cx = 2, cy = hy - hry * 0.7, rx = hrx + 15, ry = hry + 16, n = 7, a0 = -Math.PI * 0.94, a1 = -Math.PI * 0.08;
    for (let i = 0; i < n; i++) {
      const s0 = lerp(a0, a1, i / n), s1 = lerp(a0, a1, (i + 1) / n), sm = (s0 + s1) / 2;
      const p = new Path2D();
      p.moveTo(cx, cy);
      p.lineTo(cx + Math.cos(s0) * rx, cy + Math.sin(s0) * ry);
      p.quadraticCurveTo(cx + Math.cos(sm) * rx * 1.13, cy + Math.sin(sm) * ry * 1.13, cx + Math.cos(s1) * rx, cy + Math.sin(s1) * ry);
      p.closePath();
      fillP(ctx, p, sil || (i % 2 ? light(col, 0.14) : col));
    }
    if (!sil) {
      ctx.strokeStyle = fold; ctx.lineWidth = 1.6;
      for (let i = 1; i < n; i++) { const sa = lerp(a0, a1, i / n); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sa) * rx, cy + Math.sin(sa) * ry); ctx.stroke(); }
    }
    // the band around the head, tied low at the back
    const band = new Path2D();
    band.moveTo(-hrx - 3, hy + 1);
    band.bezierCurveTo(-hrx - 6, hy - hry * 1.36, hrx + 6, hy - hry * 1.36, hrx + 3, hy + 1);
    band.bezierCurveTo(hrx - 1, hy - 4, hrx * 0.5, hy - hry * 0.46, 0, hy - hry * 0.48);
    band.bezierCurveTo(-hrx * 0.5, hy - hry * 0.46, -hrx + 1, hy - 4, -hrx - 3, hy + 1);
    band.closePath();
    fillP(ctx, band, col);
    if (!sil) {
      if (o.gelePat) { ctx.save(); ctx.clip(band); wax(ctx, o.gelePat, o.gelePatCol || K.C.WHITE, -40, hy - hry * 1.3, 40, hy + 4); ctx.restore(); }
      K.form(ctx, band, 0.22, -5, -2);
      ctx.strokeStyle = fold; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(-hrx + 1, hy - hry * 0.66); ctx.quadraticCurveTo(0, hy - hry * 1.02, hrx - 1, hy - hry * 0.66); ctx.stroke();
    }
  }

  function handShape(ctx, Hd, E, side, skin, sil, b) {
    const ang = Math.atan2(Hd[1] - E[1], Hd[0] - E[0]), s = b.ar[2] / 7;
    const p = ellP(Hd[0] + Math.cos(ang) * 3 * s, Hd[1] + Math.sin(ang) * 3 * s, 9 * s, 7.4 * s, ang);
    // the thumb sits on the side that faces the body
    const n1 = [-Math.sin(ang), Math.cos(ang)], inward = (n1[0] * -side) >= 0 ? 1 : -1;
    p.ellipse(Hd[0] + n1[0] * 6 * s * inward + Math.cos(ang) * 0.5, Hd[1] + n1[1] * 6 * s * inward + Math.sin(ang) * 0.5, 4.2 * s, 3.2 * s, ang + 0.6 * inward, 0, TAU);
    fill2(ctx, p, skin, sil, -2.5, -1.5, 0.3);
  }

  function guitar(ctx, sil) {
    ctx.save(); ctx.translate(-12, -150); ctx.rotate(0.95);
    fillP(ctx, K.rrPath(-4, -118, 8, 100, 3), sil || '#3B2416');
    fillP(ctx, K.rrPath(-6.5, -132, 13, 17, 3), sil || '#3B2416');
    const body = ellP(0, 0, 27, 28); body.ellipse(0, -26, 21, 21, 0, 0, TAU);
    fillP(ctx, body, sil || '#E8833A');
    if (!sil) { K.form(ctx, body, 0.22); K.circ(ctx, 0, -13, 7, '#3B2416'); ctx.fillStyle = '#3B2416'; ctx.fillRect(-9, 8, 18, 4); }
    ctx.restore();
  }

  // a person seen from above (around a table); faces -y before the rotation `ang`
  P.top = (ctx, x, y, ang, s, o = {}) => {
    const k = o.k ?? 1;
    if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s * Math.min(k, 1.15), s * Math.min(k, 1.15)); ctx.globalAlpha *= clamp(k * 3);
    K.ell(ctx, 3, 7, 29, 18, 'rgba(13,8,56,0.12)');
    const top = o.top || K.C.BLUE, skin = o.skin || P.SKIN[2];
    for (const sd of [-1, 1]) {
      const ap = new Path2D(); capsule(ap, sd * 19, -2, sd * 12, -22, 6.5, 5.2); fillP(ctx, ap, top);
      K.ell(ctx, sd * 11.5, -26, 5.6, 6.2, skin);
    }
    const sh = ellP(0, 0, 26, 14.5); fillP(ctx, sh, top); K.form(ctx, sh, 0.18, -5, -2);
    const hd = ellP(0, 2, 12.5, 12.5); fillP(ctx, hd, o.gele || P.HAIR);
    if (o.gele) K.ell(ctx, 5, 9, 6, 4.5, dark(o.gele, 0.2));
    else K.ell(ctx, -3, -2, 4.5, 3, K.rgba('#FFFFFF', 0.08));
    ctx.restore();
  };

  globalThis.P = P;
})();
