// THE FILM — ZONE 242, la vision (16:9, the 2D part from 8 s to 82 s).
//
// One orange square — the light at the centre of the logo — travels through every scene: the full stop
// of the vision, the fruit of the tree, the heart of the one person found in the crowd, Jesus at the
// centre of Acts 2:42, the hub that connects and sends... and finally the sun of Isaiah 60:1.
// The people are illustrated (people.js), the places too (illus.js); the design system is kit.js.
//
// Every visual hit lands on an event of score.js, so the sound effects stay exactly in sync.
// No camera: the frame never zooms, shakes or pulses; only what is inside it moves.
// [0, 8) and [82, 90) are 3D: tools/build.sh replaces them with the three.js renders.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio;
  const K = globalThis.K, P = globalThis.P, IL = globalThis.IL;
  const { ev } = S;
  const { clamp, lerp, ease } = U;
  const W = G.W, H = G.H, C = K.C, ez = K.ez, prog = K.prog;
  const X0 = 160, XR = W - 160, CX = W / 2;
  const MB = 4;   // motion-blur samples per frame (1 while drafting, 4 for the final render)

  // ---------- backgrounds: a soft key light from the top left keeps every flat colour alive ----------
  function bgBlue(ctx, t) {
    ctx.fillStyle = C.BLUE; ctx.fillRect(0, 0, W, H);
    K.glow(ctx, W * 0.16 + Math.sin(t * 0.35) * 50, H * 0.05, W * 0.8, '#4A38FF', 0.5);
    K.glow(ctx, W * 0.98, H * 1.05, W * 0.62, '#0D0084', 0.55);
  }
  function bgNavy(ctx, t, grid = true) {
    ctx.fillStyle = C.NIGHT; ctx.fillRect(0, 0, W, H);
    K.glow(ctx, W * 0.18 + Math.sin(t * 0.3) * 40, H * 0.02, W * 0.85, '#2B1F96', 0.62);
    if (grid) { ctx.fillStyle = 'rgba(255,255,255,0.055)'; for (let y = 24; y < H; y += 48) for (let x = 24; x < W; x += 48) ctx.fillRect(x - 1, y - 1, 2, 2); }
  }
  function bgPaper(ctx, t) {
    ctx.fillStyle = C.PAPER; ctx.fillRect(0, 0, W, H);
    K.glow(ctx, W * 0.86, H * 0.12, W * 0.62, '#E2DDFF', 0.75);
    K.glow(ctx, W * 0.08, H * 0.98, W * 0.5, '#FFE6DC', 0.6);
  }

  // the light jumps from stop to stop: an arc and a quarter turn, landing on the beat of each stop
  function hops(t, stops, dur = 0.3, lift = 80) {
    let i = 0;
    while (i + 1 < stops.length && t >= stops[i + 1].t - dur) i++;
    const b = stops[i];
    if (i === 0 || t >= b.t) return { x: b.x, y: b.y, s: b.s, r: 0, a: b.a ?? 1 };
    const a = stops[i - 1], q = ez.inOut(prog(t, b.t - dur, dur));
    return { x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q) - Math.sin(Math.PI * q) * lift, s: lerp(a.s, b.s, q), r: (1 - q) * -Math.PI / 2, a: lerp(a.a ?? 1, b.a ?? 1, q) };
  }
  function square(ctx, st) {
    if (!st || (st.a ?? 1) <= 0.01) return;
    ctx.save(); ctx.globalAlpha = st.a ?? 1;
    K.glow(ctx, st.x, st.y, st.s * 2.6, C.ORANGE, 0.22);
    ctx.translate(st.x, st.y); ctx.rotate(st.r || 0);
    ctx.fillStyle = C.ORANGE; ctx.fillRect(-st.s / 2, -st.s / 2, st.s, st.s);
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(-st.s / 2, -st.s / 2, st.s, st.s * 0.18);
    ctx.restore();
  }

  // ======================= 01 · THE VISION: Cotonou rises, its lights come on =======================
  const VIS = { y: [300, 392, 528, 660], s: [96, 54, 196, 96] };
  const vision = {
    range: S.S.vision,
    draw(ctx, t) {
      const e = ev.vision;
      bgBlue(ctx, t);
      IL.cotonou(ctx, t, { rise: e.words[1], lights: e.words[3] });
      K.kicker(ctx, 'LA VISION', X0, 150, t, e.kicker);
      const w1 = K.measure(ctx, 'BÂTIR ', VIS.s[0]);
      K.line(ctx, 'BÂTIR', X0, VIS.y[0], VIS.s[0], t, e.words[0]);
      K.line(ctx, 'À COTONOU', X0 + w1, VIS.y[0], VIS.s[0], t, e.words[1]);
      K.line(ctx, 'UNE ÉGLISE DE', X0, VIS.y[1], VIS.s[1], t, e.words[2], { weight: 800, color: C.HAZE });
      K.hero(ctx, 'MILLIERS', X0 - 8, VIS.y[2], VIS.s[2], t, e.words[3], { color: C.ORANGE });
      K.line(ctx, 'DE DISCIPLES', X0, VIS.y[3], VIS.s[3], t, e.words[4]);
    },
    // the light falls from above and lands as the full stop of the sentence
    sq(ctx, t) {
      const land = ev.vision.words[5];
      if (t < land - 0.4) return null;
      const x = X0 + K.measure(ctx, 'DE DISCIPLES', VIS.s[3]) + 30, y = VIS.y[3] + 26;
      const k = prog(t, land - 0.4, 0.4), q = ease.outBack(k, 1.6);
      return { x, y: lerp(y - 300, y, q), s: 28, r: (1 - k) * Math.PI * 1.5, a: clamp(k * 3) };
    },
  };

  // ======================= 02 · ROOTED: a seed, roots in the Word, a tree full of fruit =======================
  const RT = { bx: X0 + 16, tx: X0 + 70, rows: [292, 512, 732], tree: { x: 1400, gy: 800 } };
  const rooted = {
    range: S.S.rooted,
    draw(ctx, t) {
      const e = ev.rooted;
      bgPaper(ctx, t);
      IL.tree(ctx, t, { x: RT.tree.x, gy: RT.tree.gy, sprout: e.lines[0], roots: e.lines[1], grow: e.lines[2], hit: e.hit });
      K.trace(ctx, [[RT.bx, RT.rows[0]], [RT.bx, RT.rows[2] + 112]], ez.inOut(prog(t, e.hit - 0.05, 0.5)), C.ORANGE, 6, { cap: 'butt' });
      RT.rows.forEach((y, i) => { if (i < 2 && t >= e.lines[i + 1] - 0.3) { ctx.strokeStyle = C.ORANGE; ctx.lineWidth = 4; ctx.strokeRect(RT.bx - 10, y - 10, 20, 20); } });
      [['PASSIONNÉS', 'DE JÉSUS,'], ['ENRACINÉS', 'DANS LA PAROLE,'], ['TRANSFORMÉS', 'PAR SA PRÉSENCE.']].forEach(([a, b], i) => {
        K.line(ctx, a, RT.tx, RT.rows[i], 112, t, e.lines[i], { color: C.INK });
        K.line(ctx, b, RT.tx, RT.rows[i] + 84, 46, t, e.lines[i] + 0.15, { color: C.BLUE, weight: 800 });
      });
    },
    // the light is the bullet of each statement, then the brightest fruit of the tree
    sq(ctx, t) {
      const e = ev.rooted;
      const stops = e.lines.map((tt, i) => ({ t: tt, x: RT.bx, y: RT.rows[i], s: 28 })).concat([{ t: e.hit, x: RT.tree.x + 4, y: RT.tree.gy + IL.TREE_TOP + 20, s: 44 }]);
      return hops(t, stops, 0.32, 90);
    },
  };

  // ======================= 03 · A GREAT CHURCH WHERE EVERYONE IS KNOWN =======================
  const CR = { home: [1330, 360] };
  const crowd = {
    range: S.S.crowd,
    draw(ctx, t) {
      const e = ev.crowd;
      bgNavy(ctx, t);
      IL.crowd(ctx, t, { fill: e.fill, lock: e.lock });
      // the viewfinder: the logo's four corners close in on one person and frame them
      const f = IL.crowdFocus(), vk = prog(t, e.lock - 0.5, 0.5);
      if (vk > 0) {
        const q = ez.inOut(vk), size = lerp(900, f.h * 0.78, q);
        ctx.save(); ctx.translate(lerp(CR.home[0], f.x, q), lerp(CR.home[1], f.chest - 18, q)); ctx.rotate((1 - q) * Math.PI / 4);
        K.corners(ctx, 0, 0, size, C.WHITE); ctx.restore();
      }
      K.line(ctx, 'UNE GRANDE', X0, 330, 92, t, e.text1);
      K.line(ctx, 'ÉGLISE,', X0, 432, 92, t, e.text1 + 0.12);
      K.line(ctx, 'OÙ CHACUN', X0, 600, 92, t, e.text2);
      K.line(ctx, 'EST CONNU.', X0, 702, 92, t, e.text2 + 0.12, { underline: C.ORANGE });
    },
    // the light hovers over the crowd, then becomes the centre of the frame: the heart of the one found
    sq(ctx, t) {
      const e = ev.crowd, f = IL.crowdFocus(), q = ez.inOut(prog(t, e.lock - 0.5, 0.5));
      return { x: lerp(CR.home[0], f.x, q), y: lerp(CR.home[1] + Math.sin(t * 2) * 6, f.chest - 18, q), s: lerp(40, f.h * 0.78 * K.SQ * 0.55, q), r: 0, a: 1 };
    },
  };

  // ======================= 04 · ACTS 2:42: four practices become the four corners, Jesus at the centre =======================
  const AC = { x: 1380, y: 556, S: 640 };
  const acts = {
    range: S.S.acts,
    draw(ctx, t) {
      const e = ev.acts;
      bgBlue(ctx, t);
      K.kicker(ctx, 'ACTES 2:42', X0, 150, t, e.ref);
      K.line(ctx, 'CE QUE NOUS VIVONS', X0, 232, 64, t, e.ref + 0.1);
      ['LA PAROLE', 'LA COMMUNION', 'LE PAIN PARTAGÉ', 'LA PRIÈRE'].forEach((l, i) => {
        const y = 392 + i * 104, t0 = e.corners[i];
        K.kicker(ctx, `0${i + 1}`, X0, y, t, t0 - 0.05, { size: 26, dot: false });
        K.line(ctx, l, X0 + 74, y, 54, t, t0, { weight: 800 });
      });
      K.line(ctx, 'TOUT COMMENCE AVEC JÉSUS.', X0, 862, 50, t, e.line, { underline: C.ORANGE });
      const arm = AC.S * 0.382, th = AC.S * 0.127, morph = ez.inOut(prog(t, e.center - 0.22, 0.5));
      [[-1, -1, IL.parole], [1, -1, IL.communion], [1, 1, IL.pain], [-1, 1, IL.priere]].forEach(([sx, sy, art], i) => {
        const t0 = e.corners[i], k = K.pop(t, t0 - 0.14, 0.45, 1.3);
        if (k <= 0) return;
        const ox = AC.x + sx * AC.S / 2, oy = AC.y + sy * AC.S / 2;
        const x0 = sx < 0 ? ox : ox - arm, y0 = sy < 0 ? oy : oy - arm;
        ctx.save();
        ctx.translate(ox, oy); ctx.rotate((1 - Math.min(k, 1)) * sx * sy * -0.6); ctx.scale(k, k); ctx.translate(-ox, -oy);
        const cut = (arm - th) * morph, r = 18 * (1 - morph);
        const clip = K.rrPath(x0, y0, arm, arm, r);
        if (cut > 0.5) clip.rect(sx < 0 ? x0 + arm - cut : x0, sy < 0 ? y0 + arm - cut : y0, cut, cut);
        if (morph < 1) { ctx.save(); ctx.shadowColor = `rgba(6,0,60,${0.35 * (1 - morph)})`; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = '#FFFFFF'; ctx.fill(clip, 'evenodd'); ctx.restore(); }
        ctx.save(); ctx.clip(clip, 'evenodd');
        ctx.translate(x0, y0); art(ctx, arm, arm, t, t0);
        if (morph > 0) { ctx.fillStyle = K.rgba('#FFFFFF', morph); ctx.fillRect(0, 0, arm, arm); }
        ctx.restore();
        ctx.restore();
      });
      // Jesus at the centre: a ring of light goes out from it
      const rk = prog(t, e.center, 0.8);
      if (rk > 0 && rk < 1) {
        const r = lerp(150, 760, ez.out(rk));
        ctx.save(); ctx.globalAlpha = 1 - rk; ctx.strokeStyle = C.ORANGE; ctx.lineWidth = 6; ctx.strokeRect(AC.x - r / 2, AC.y - r / 2, r, r); ctx.restore();
      }
    },
    sq(ctx, t) {
      const k = prog(t, ev.acts.center - 0.15, 0.5);
      return { x: AC.x, y: AC.y, s: lerp(54, AC.S * K.SQ, ez.back(k)), r: -ez.inOut(k) * Math.PI / 2, a: 1 };
    },
  };

  // ======================= 05 · 06 · 07 · THE THREE MOVEMENTS =======================
  function movementHead(ctx, t, e, dark, num, word) {
    K.kicker(ctx, `MOUVEMENT 0${num}`, X0, 150, t, e.word + 0.05);
    K.hero(ctx, word, X0 - 6, 286, 128, t, e.word, { color: dark ? C.INK : C.WHITE });
  }
  function movementTag(ctx, t, e, dark, a, b) {
    const col = dark ? C.INK : C.WHITE;
    K.line(ctx, a, X0, 760, 62, t, e.tag, { color: col });
    K.line(ctx, b, X0, 846, 62, t, e.tag + 0.12, { color: col, underline: C.ORANGE });
  }
  // three nodes on an arc — left, centre, right, in the order the sound pans them
  const ND = { hub: [1370, 800], pts: [[1080, 470], [1370, 330], [1660, 470]], r: 104, ring: [1370, 700.4, 370.4] };
  const nodeLabel = (ctx, t, t0, i, str, dark) => {
    const [x, y] = ND.pts[i], ly = i === 1 ? y - ND.r - 42 : y + ND.r + 46;
    K.line(ctx, str, x, ly, 30, t, t0 + 0.05, { weight: 800, align: 'center', color: dark ? C.INK : C.WHITE });
  };

  // connect: three links come to you — Jesus, the Church, the others — and then to each other
  const connect = {
    range: S.S.connect,
    draw(ctx, t) {
      const e = ev.connect, [hx, hy] = ND.hub;
      bgNavy(ctx, t);
      movementHead(ctx, t, e, false, 1, 'CONNECTER');
      const ring = ez.inOut(prog(t, e.nodes[2] + 0.2, 0.7));
      if (ring > 0) {
        const [rx, ry, rr] = ND.ring, a0 = Math.atan2(ND.pts[0][1] - ry, ND.pts[0][0] - rx), a1 = Math.atan2(ND.pts[2][1] - ry, ND.pts[2][0] - rx);
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3; ctx.setLineDash([2, 12]); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(rx, ry, rr, a0, lerp(a0, a1, ring)); ctx.stroke(); ctx.restore();
      }
      ND.pts.forEach(([x, y], i) => {
        const t0 = e.nodes[i];
        K.trace(ctx, [[hx, hy], [x, y]], ez.inOut(prog(t, t0 - 0.32, 0.32)), C.ORANGE, 5);
        if (t > t0 + 0.1) for (let j = 0; j < 3; j++) {
          const q = ((t - t0) * 0.8 + j / 3) % 1;
          ctx.save(); ctx.translate(lerp(x, hx, q), lerp(y, hy, q)); ctx.rotate(q * 3); ctx.fillStyle = '#FFD3C7'; ctx.fillRect(-4.5, -4.5, 9, 9); ctx.restore();
        }
      });
      IL.node(ctx, hx, hy, 96, K.pop(t, e.word + 0.25, 0.5, 1.5), C.ORANGE, (c, r) => IL.vYou(c, r, t), C.ORANGE);
      K.line(ctx, 'TOI', hx + 132, hy + 4, 30, t, e.word + 0.4, { fam: 'mono', weight: 500, color: C.ORANGE_L });
      [[IL.vJesus, C.BLUE, 'À JÉSUS'], [IL.vEglise, C.PEACH, 'À L’ÉGLISE'], [IL.vAutres, C.MIST, 'AUX AUTRES']].forEach(([art, bg, label], i) => {
        const t0 = e.nodes[i], [x, y] = ND.pts[i];
        IL.node(ctx, x, y, ND.r, K.pop(t, t0 - 0.05, 0.45, 1.6), bg, (c, r) => art(c, r, t));
        nodeLabel(ctx, t, t0, i, label, false);
      });
      movementTag(ctx, t, e, false, 'CONNECTÉ', 'POUR APPARTENIR.');
    },
    // the light is the heart of the person at the centre
    sq() { return { x: ND.hub[0], y: ND.hub[1] + 30, s: 22, r: 0, a: 1 }; },
  };

  // transform: one person climbs three steps and is changed on each one
  const ST = { x0: 1050, w: 236, base: 902, h: [150, 290, 430], d: 22, cols: [C.BLUE_M, C.BLUE, '#12009A'] };
  const climbStops = (e) => [{ t: e.word, x: 975, y: ST.base }].concat(e.steps.map((tt, i) => ({ t: tt, x: ST.x0 + i * ST.w + ST.w / 2 - 3, y: ST.base - ST.h[i] })));
  const LOOK = [
    { top: '#B7B4C6', bottom: '#6E6B85', shoes: '#57546B', mood: 'calm' },
    { top: C.BLUE_L, bottom: C.NAVY, shoes: '#1E1A33', mood: 'smile' },
    { top: C.BLUE, bottom: C.NAVY, shoes: C.ORANGE, mood: 'smile' },
    { top: C.ORANGE, bottom: C.NAVY, shoes: C.ORANGE, mood: 'grin' },
  ];
  const transform = {
    range: S.S.transform,
    draw(ctx, t) {
      const e = ev.transform;
      bgPaper(ctx, t);
      movementHead(ctx, t, e, true, 2, 'TRANSFORMER');
      K.trace(ctx, [[940, ST.base], [XR, ST.base]], ez.out(prog(t, e.word + 0.1, 0.6)), C.INK, 3);
      ['LA PAROLE', 'LA COMMUNION', 'LA PRIÈRE'].forEach((name, i) => {
        const k = ez.out(prog(t, e.steps[i] - 0.6, 0.45));
        if (k <= 0) return;
        const x = ST.x0 + i * ST.w, hgt = ST.h[i] * k, top = ST.base - hgt, w = ST.w - 6, col = ST.cols[i];
        ctx.fillStyle = col; ctx.fillRect(x, top, w, hgt);
        ctx.fillStyle = K.dark(col, 0.18); ctx.fillRect(x + w - 26, top, 26, hgt);
        K.poly(ctx, [[x, top], [x + w, top], [x + w - 10, top - ST.d], [x + 10, top - ST.d]], K.light(col, 0.3));
        ctx.save(); ctx.globalAlpha *= clamp((k - 0.6) / 0.4);
        K.text(ctx, name, x + w / 2 - 13, top + 42, K.fit(ctx, name, 25, w - 50, 'text', 800), C.WHITE, { fam: 'text', weight: 800, align: 'center' });
        K.text(ctx, `0${i + 1}`, x + w / 2 - 13, top + 78, 20, K.rgba('#FFFFFF', 0.6), { fam: 'mono', weight: 500, align: 'center' });
        ctx.restore();
      });
      // the climber
      const stops = climbStops(e), pos = hops(t, stops, 0.34, 110);
      const stage = e.steps.filter((tt) => t >= tt).length, last = stage ? e.steps[stage - 1] : null;
      const air = stops.some((s0, i) => i > 0 && t >= s0.t - 0.34 && t < s0.t);
      const land = last != null ? Math.max(0, 1 - (t - last) / 0.2) : 0;
      if (last != null && t - last < 0.5) { const q = (t - last) / 0.5; ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = C.ORANGE; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(pos.x, pos.y - 110, 40 + q * 120, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      if (stage === 3) K.glow(ctx, pos.x, pos.y - 130, 240, C.ORANGE, 0.28 * ez.out(prog(t, e.steps[2], 0.4)));
      const lk = LOOK[stage], hk = K.pop(t, e.word + 0.15, 0.45, 1.5);
      ctx.save(); ctx.translate(pos.x, pos.y); ctx.scale(1 + 0.07 * land, 1 - 0.09 * land);
      P.person(ctx, 0, 0, 236, Object.assign({ k: hk, t, seed: 120, build: 'f', skin: P.SKIN[3], hair: 'braids', outfit: 'tee', pose: stage === 3 ? 'cheer' : air ? 'up' : 'relaxed', legs: air ? 'jump' : 'stand', look: 0.5, lookY: -0.6 }, lk));
      ctx.restore();
      movementTag(ctx, t, e, true, 'TRANSFORMÉ', 'POUR DEVENIR.');
    },
    // the light waits at the top of the steps
    sq(ctx, t) {
      const top = ST.x0 + 2 * ST.w + ST.w / 2 - 3, p = 1 + 0.3 * Math.max(0, 1 - Math.abs(t - ev.transform.steps[2]) / 0.25);
      return { x: top, y: ST.base - ST.h[2] - 300 + Math.sin(t * 2.2) * 6, s: 40 * p, r: 0, a: 1 };
    },
  };

  // send: from the light, three go out — to serve, to witness, to make disciples
  const send = {
    range: S.S.send,
    draw(ctx, t) {
      const e = ev.send, [hx, hy] = ND.hub;
      bgBlue(ctx, t);
      movementHead(ctx, t, e, false, 3, 'ENVOYER');
      [[IL.vServir, C.MIST, 'SERVIR'], [IL.vTemoigner, C.PEACH, 'TÉMOIGNER'], [IL.vDisciples, C.MIST, 'FAIRE DES DISCIPLES']].forEach(([art, bg, label], i) => {
        const t0 = e.arrows[i], [x, y] = ND.pts[i], lk = ez.inOut(prog(t, t0 - 0.42, 0.42));
        if (lk > 0) {
          K.trace(ctx, [[hx, hy], [x, y]], 1, 'rgba(255,255,255,0.28)', 3, { dash: [3, 11] });
          // an envoy of light runs along the path and arrives on the beat
          if (lk < 1) {
            const px = lerp(hx, x, lk), py = lerp(hy, y, lk);
            for (let j = 1; j < 6; j++) { const q = Math.max(0, lk - j * 0.04); ctx.globalAlpha = 0.4 * (1 - j / 6); ctx.fillStyle = C.ORANGE_L; ctx.fillRect(lerp(hx, x, q) - 6, lerp(hy, y, q) - 6, 12, 12); }
            ctx.globalAlpha = 1; ctx.save(); ctx.translate(px, py); ctx.rotate(lk * 6); ctx.fillStyle = C.ORANGE; ctx.fillRect(-9, -9, 18, 18); ctx.restore();
          }
        }
        const rk = prog(t, t0 - 0.42, 0.5);
        if (rk > 0 && rk < 1) { ctx.save(); ctx.globalAlpha = 1 - rk; ctx.strokeStyle = C.WHITE; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(hx, hy, 40 + rk * 90, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        IL.node(ctx, x, y, ND.r, K.pop(t, t0 - 0.03, 0.45, 1.6), bg, (c, r) => art(c, r, t));
        nodeLabel(ctx, t, t0, i, label, false);
      });
      movementTag(ctx, t, e, false, 'ENVOYÉ', 'POUR IMPACTER.');
    },
    // the light is where they are sent from
    sq(ctx, t) {
      const pulse = ev.send.arrows.reduce((m, a) => Math.max(m, 1 - Math.abs(t - (a - 0.42)) / 0.2), 0);
      return { x: ND.hub[0], y: ND.hub[1], s: 56 * (1 + 0.25 * Math.max(0, pulse)), r: 0, a: 1 };
    },
  };

  // ======================= 08 · SUNDAY GATHERS, MONDAY SENDS =======================
  const SU = { x: 1390, y: 540, size: 470, gy: 760 };
  const FOLK = Array.from({ length: 13 }, (_, i) => {
    const fem = i % 2 === 0, hairs = ['gele', 'short', 'braids', 'cap', 'puffs', 'bald', 'bun', 'afro', 'long', 'short', 'gele', 'locs', 'gray'];
    return {
      sx: [120, 360, 620, 1880, 1700, 900, 40, 1500, 1820, 260, 1100, 1960, 760][i], sy: 980 + (i % 3) * 30,
      tx: SU.x - 190 + (i % 7) * 63 + (i > 6 ? 30 : 0), ty: SU.gy + (i > 6 ? 40 : 0), h: i > 6 ? 150 : 128, delay: U.hash(501, i) * 0.25,
      o: { build: i === 4 ? 'kid' : fem ? 'f' : 'm', skin: P.SKIN[(i * 5) % 6], hair: hairs[i], gele: [C.ORANGE, C.BLUE, '#FFB13B'][i % 3], capCol: C.NAVY,
        outfit: ['dress', 'shirt', 'tee', 'hoodie', 'tee', 'blazer', 'gown', 'tee', 'skirt', 'kaftan', 'dress', 'tee', 'shirt'][i], top: [C.ORANGE, C.WHITE, C.BLUE, C.NAVY, C.ORANGE, C.SLATE, C.BLUE_L, C.ORANGE_L, C.NAVY, C.WHITE, C.BLUE, C.PEACH, C.BLUE_M][i],
        pattern: i % 4 === 0 ? 'dots' : null, patCol: C.WHITE, seed: 200 + i, beard: i === 9 || i === 12 },
    };
  });
  const sunday = {
    range: S.S.sunday,
    draw(ctx, t) {
      const e = ev.sunday;
      bgPaper(ctx, t);
      const ck = prog(t, e.gather - 0.25, 0.6);
      K.corners(ctx, SU.x, SU.y, SU.size, C.BLUE, [ck, ck, ck, ck]);
      // they come from everywhere and gather inside the frame
      FOLK.slice().sort((a, b) => a.ty - b.ty).forEach((f) => {
        const k = ez.out(prog(t, e.gather + f.delay * 0.6, 0.6));
        if (k <= 0) return;
        const x = lerp(f.sx, f.tx, k), y = lerp(f.sy, f.ty, k), moving = k < 0.98;
        P.person(ctx, x, y, f.h, Object.assign({ t, legs: moving ? 'walk' : 'stand', walk: x / 70, flip: f.tx < f.sx, pose: moving ? 'relaxed' : 'down', look: (SU.x - x) / 400 }, f.o));
      });
      K.line(ctx, 'LE DIMANCHE', X0, 296, 104, t, e.line1, { color: C.INK });
      K.line(ctx, 'RASSEMBLE.', X0, 420, 132, t, e.line1 + 0.22, { color: C.BLUE });
      // Monday: the light opens the frame and everyone is sent out
      K.wipe(ctx, SU.x, SU.y, prog(t, e.send - 0.16, 0.5), () => {
        bgBlue(ctx, t);
        const bk = ez.out(prog(t, e.send, 1.3));
        for (let i = 0; i < 70; i++) {
          const a = U.hash(9, i) * Math.PI * 2, sp = 0.3 + U.hash(10, i) * 0.9, r = 70 + bk * sp * 1300, s2 = 9 + U.hash(11, i) * 16;
          ctx.save(); ctx.translate(SU.x + Math.cos(a) * r, SU.y + Math.sin(a) * r); ctx.rotate(bk * (U.hash(12, i) - 0.5) * 7);
          ctx.fillStyle = i % 3 ? C.WHITE : C.ORANGE; ctx.globalAlpha = 1 - bk * 0.5; ctx.fillRect(-s2 / 2, -s2 / 2, s2, s2); ctx.restore();
        }
        const fk = 1 + ez.out(prog(t, e.send, 0.9)) * 2.4;
        ctx.save(); ctx.globalAlpha = 1 - prog(t, e.send + 0.25, 0.5); K.corners(ctx, SU.x, SU.y, SU.size * fk, C.WHITE); ctx.restore();
        FOLK.forEach((f, i) => {
          const a = -Math.PI / 2 + (i / FOLK.length - 0.5) * Math.PI * 1.7, q = ez.out(prog(t, e.send + U.hash(502, i) * 0.12, 1.1));
          const x = f.tx + Math.cos(a) * q * 1100, y = f.ty + Math.sin(a) * q * 520 - Math.sin(Math.PI * Math.min(1, q * 1.4)) * 120;
          P.person(ctx, x, y, f.h, Object.assign({ t, pose: 'cheer', legs: 'jump', lean: Math.cos(a) * 0.25 * q }, f.o));
        });
        K.line(ctx, 'LE LUNDI', X0, 296, 104, t, e.line2 - 0.25);
        K.hero(ctx, 'ENVOIE.', X0 - 6, 432, 168, t, e.line2, { color: C.ORANGE });
      });
    },
    // the light waits above the gathered church, then bursts out with it
    sq(ctx, t) {
      const k = prog(t, ev.sunday.send - 0.1, 0.45);
      return { x: SU.x, y: SU.y - 70, s: SU.size * K.SQ * 0.5 * (1 + 0.5 * Math.sin(Math.PI * k)), r: -ez.inOut(k) * Math.PI, a: 1 };
    },
  };

  // viewfinder brackets on the corners of a box, flying in with a quarter turn
  function brackets(ctx, x, y, w, h, k, color, arm = 70, th = 10) {
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
  function ghost(ctx, t, x, y, size, color, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.15 + t * 0.03); ctx.globalAlpha = alpha; K.corners(ctx, 0, 0, size, color); ctx.restore();
  }

  // ======================= 09 · THE WEEK: five moments, five pictures on one line =======================
  const Wk = { pw: 296, gap: 30, py: 318, ph: 300, ly: 664 };
  const wkX = (i) => X0 + i * (Wk.pw + Wk.gap);
  const WEEK = [
    ['DIM', 'CULTE ZONE', ['Toute la maison,', 'chaque dimanche'], IL.wCulte],
    ['SEM. A', 'ZONE DE CROISSANCE', ['Environ 8 personnes', 'autour d’un Berger'], IL.wGroupe],
    ['SEM. B', 'ZONE FAMILY', ['La foi vécue', 'à la maison'], IL.wFamille],
    ['VEN', 'PRIÈRE ENSEMBLE', ['60 à 90 minutes pour', 'apprendre à prier'], IL.wPriere],
    ['7/7', 'ZONE DIGITAL', ['L’application ZONE 242,', 'chaque jour'], IL.wDigital],
  ];
  const week = {
    range: S.S.week,
    draw(ctx, t) {
      const e = ev.week;
      bgNavy(ctx, t);
      K.kicker(ctx, 'VIVRE LA ZONE', X0, 150, t, e.title);
      K.line(ctx, 'UNE SEMAINE, UNE VIE', X0, 232, 64, t, e.title + 0.05);
      K.trace(ctx, [[X0, Wk.ly], [XR, Wk.ly]], ez.inOut(prog(t, e.title, 0.7)), 'rgba(255,255,255,0.22)', 3, { cap: 'butt' });
      WEEK.forEach(([d, n, sub, art], i) => {
        const x = wkX(i), t0 = e.items[i];
        K.card(ctx, x, Wk.py, Wk.pw, Wk.ph, K.pop(t, t0 - 0.15, 0.45, 1.5), 'rise', (c, w, h) => art(c, w, h, t, t0), { r: 20, shadowColor: 'rgba(0,0,0,0.45)' });
        const nk = K.pop(t, t0 - 0.05, 0.3, 2);
        if (nk > 0) { ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(x + 12 - 5 * nk, Wk.ly - 5 * nk, 10 * nk, 10 * nk); }
        K.kicker(ctx, d, x, Wk.ly + 40, t, t0, { size: 22, dot: false });
        K.line(ctx, n, x, Wk.ly + 86, K.fit(ctx, n, 30, Wk.pw), t, t0 + 0.06);
        sub.forEach((sl, j) => K.line(ctx, sl, x, Wk.ly + 128 + j * 30, 20, t, t0 + 0.12 + j * 0.05, { fam: 'text', weight: 700, color: 'rgba(255,255,255,0.72)' }));
      });
      K.line(ctx, 'UNE FOI QUI SE VIT CHAQUE JOUR.', X0, 948, 54, t, e.tag, { underline: C.ORANGE });
    },
    sq(ctx, t) { return hops(t, ev.week.items.map((tt, i) => ({ t: tt, x: wkX(i) + 12, y: Wk.ly, s: 24 })), 0.28, 40); },
  };

  // ======================= 10 · ALL THE GENERATIONS: they grow up side by side, the light over each =======================
  const GY = 628, genX = (i) => X0 + 200 + i * 400;
  const GEN = [
    { age: '0–10', names: ['ZONE KIDS'], halo: 122, head: 178, hx: 0,
      draw(ctx, x, t, t0) {
        const bk = K.pop(t, t0 + 0.1, 0.5, 1.4), bx = x - 78, by = GY - 300 + Math.sin(t * 2.2) * 6 + (1 - Math.min(bk, 1)) * 120;
        if (bk > 0) {
          ctx.strokeStyle = C.MUTE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 56, GY - 158); ctx.quadraticCurveTo(bx - 10, by + 80, bx, by + 38); ctx.stroke();
          ctx.save(); ctx.globalAlpha *= clamp(bk * 3); K.ell(ctx, bx, by, 30, 37, C.BLUE_L); K.ell(ctx, bx - 10, by - 13, 6, 10, 'rgba(255,255,255,0.5)', -0.5); K.poly(ctx, [[bx - 5, by + 37], [bx + 5, by + 37], [bx, by + 44]], C.BLUE_L); ctx.restore();
        }
        P.person(ctx, x, GY, 182, { k: K.pop(t, t0, 0.42), t, seed: 500, build: 'kid', top: C.ORANGE, bottom: C.NAVY, shorts: true, skin: P.SKIN[2], hair: 'puffs', mood: 'grin', hands: [[-62, -232], null], look: -0.6, lookY: -0.6 });
      } },
    { age: '11–15', names: ['ZONE TEENS'], halo: 142, head: 244, hx: 0,
      draw(ctx, x, t, t0) { P.person(ctx, x, GY, 250, { k: K.pop(t, t0, 0.42), t, seed: 501, top: C.BLUE_L, bottom: C.DENIM, skin: P.SKIN[1], hair: 'cap', capCol: C.ORANGE, pack: C.BLUE, pose: 'wave', mood: 'grin', stance: 'l' }); } },
    { age: '16 +', names: ['ZONE YOUTH'], halo: 162, head: 292, hx: 0,
      draw(ctx, x, t, t0) { P.person(ctx, x, GY, 296, { k: K.pop(t, t0, 0.42), t, seed: 502, build: 'f', outfit: 'hoodie', top: C.BLUE, bottom: C.NAVY, skin: P.SKIN[3], hair: 'braids', phones: C.NAVY, pose: 'pocket', mood: 'smile', stance: 'r' }); } },
    { age: 'TOUS', names: ['ADULTES', '& FAMILLES'], halo: 186, head: 302, hx: -45,
      draw(ctx, x, t, t0) {
        const fx = x - 95, mx = x + 5, gx = x + 114, meet = [x - 45, GY - 112];
        P.person(ctx, gx, GY, 262, { k: K.pop(t, t0 + 0.12, 0.42), t, seed: 503, build: 'f', outfit: 'gown', top: C.BLUE_L, hair: 'gele', gele: C.NAVY, skin: P.SKIN[4], item: 'cane', flip: true, glasses: true, mood: 'smile' });
        P.person(ctx, fx, GY, 306, { k: K.pop(t, t0, 0.42), t, seed: 504, outfit: 'shirt', top: C.NAVY, bottom: C.NAVY, collar: C.WHITE, skin: P.SKIN[0], beard: true, hands: [null, P.u(fx, GY, 306, ...meet)], mood: 'smile' });
        P.person(ctx, mx, GY, 288, { k: K.pop(t, t0 + 0.06, 0.42), t, seed: 505, build: 'f', outfit: 'dress', top: C.ORANGE, pattern: 'rings', patCol: C.PEACH, hair: 'gele', gele: C.BLUE, skin: P.SKIN[2], hands: [P.u(mx, GY, 288, ...meet), null], mood: 'grin', earrings: '#FFD27A' });
      } },
  ];
  const gens = {
    range: S.S.gens,
    draw(ctx, t) {
      const e = ev.gens;
      bgPaper(ctx, t);
      K.kicker(ctx, 'TOUTES LES GÉNÉRATIONS', X0, 150, t, e.title);
      K.line(ctx, 'UNE MÊME MISSION', X0, 232, 64, t, e.title + 0.05, { color: C.INK });
      K.trace(ctx, [[X0, GY], [XR, GY]], ez.inOut(prog(t, e.photo - 0.05, 0.5)), '#D7D2EC', 4, { cap: 'butt' });
      GEN.forEach((g, i) => {
        const t0 = e.items[i], x = genX(i), hk = K.pop(t, t0 - 0.06, 0.4, 2);
        if (hk > 0) { ctx.fillStyle = '#ECE9FF'; ctx.beginPath(); ctx.arc(x, GY - g.halo, g.halo * hk, Math.PI, 0); ctx.lineTo(x + g.halo * hk, GY); ctx.lineTo(x - g.halo * hk, GY); ctx.closePath(); ctx.fill(); }
        g.draw(ctx, x, t, t0);
        K.hero(ctx, g.age, x, GY + 80, 58, t, t0, { color: C.BLUE, align: 'center' });
        g.names.forEach((n, j) => K.line(ctx, n, x, GY + 142 + j * 34, 26, t, t0 + 0.1 + j * 0.06, { color: C.INK, align: 'center' }));
      });
      K.line(ctx, 'CHAQUE GÉNÉRATION COMPTE.', X0, 930, 56, t, e.tag, { color: C.INK, underline: C.ORANGE });
    },
    sq(ctx, t) { return hops(t, ev.gens.items.map((tt, i) => ({ t: tt, x: genX(i) + GEN[i].hx, y: GY - GEN[i].head - 48, s: 26 })), 0.3, 70); },
  };

  // ======================= 11 · 12 · 13 · two communities side by side, each in its own picture =======================
  function pairScene(key, bg, kick, cards, tag) {
    const cx = [X0, 990], cw = 770, y0 = 250, y1 = 820, win = { dx: 40, y: 282, w: 690, h: 326 };
    return {
      range: S.S[key],
      draw(ctx, t) {
        const e = ev[key];
        bg(ctx, t);
        K.kicker(ctx, kick, X0, 168, t, e.a);
        cards.forEach((c, i) => {
          const t0 = i ? e.b : e.a, x = cx[i], mx = x + cw / 2;
          brackets(ctx, x, y0, cw, y1 - y0, prog(t, t0 - 0.15, 0.4), C.WHITE);
          K.card(ctx, x + win.dx, win.y, win.w, win.h, ez.out(prog(t, t0 - 0.1, 0.5)), i ? 'slideR' : 'slideL', (c2, w, h) => c.art(c2, w, h, t, t0 + 0.15), { r: 16, shadowColor: 'rgba(0,0,0,0.4)' });
          K.line(ctx, c.name, mx, 668, K.fit(ctx, c.name, 46, cw - 80), t, t0 + 0.2, { align: 'center' });
          K.line(ctx, c.sub, mx, 722, K.fit(ctx, c.sub, 26, cw - 80, 'text', 700), t, t0 + 0.3, { fam: 'text', color: 'rgba(255,255,255,0.75)', weight: 700, align: 'center' });
        });
        K.line(ctx, tag, CX, 930, K.fit(ctx, tag, 52, XR - X0), t, e.tag, { align: 'center', underline: C.ORANGE });
      },
      sq(ctx, t) {
        const e = ev[key];
        return hops(t, [{ t: e.a + 0.2, x: cx[0] + cw / 2, y: 778, s: 22 }, { t: e.b + 0.2, x: cx[1] + cw / 2, y: 778, s: 22 }], 0.3, 120);
      },
    };
  }
  const menwomen = pairScene('menwomen', bgBlue, 'DEUX UNIVERS · TOUTE L’ANNÉE', [
    { art: IL.men, name: 'ZONE MEN', sub: 'Des hommes de foi, de caractère et d’impact.' },
    { art: IL.women, name: 'ZONE WOMEN', sub: 'Des femmes de foi, d’influence et de destinée.' },
  ], 'FOI · IDENTITÉ · INFLUENCE · DESTINÉE.');
  const couples = pairScene('couples', bgNavy, 'CHAQUE SAISON COMPTE', [
    { art: IL.gala, name: 'GALA DES COUPLES', sub: 'Honorer l’alliance. Célébrer l’amour.' },
    { art: IL.singles, name: 'RENCONTRE DES CÉLIBATAIRES', sub: 'Bien vivre sa saison, préparer son avenir.' },
  ], 'BÂTIR LA FAMILLE, PRÉPARER L’AVENIR.');
  const camps = pairScene('camps', bgBlue, '242 CAMPS · IMMERSION', [
    { art: IL.campTeens, name: 'CAMP TEENS', sub: 'Une identité solide en Christ.' },
    { art: IL.campYouth, name: 'CAMP YOUTH', sub: 'Vocation, leadership, mission.' },
  ], 'UNE GÉNÉRATION QUI IMPACTE.');

  // ======================= 14 · SIGNATURE PROGRAMMES: four pictures, and the light lands in each =======================
  const SG = { y: 316, w: 370, h: 250, step: 410 };
  const sgX = (i) => X0 + i * SG.step;
  const SIG = [
    ['CHAMBRE HAUTE', ['Présence, adoration,', 'intercession · 4 fois par an'], IL.chambre],
    ['ZONE OUT', ['La Zone hors les murs,', 'des souvenirs ensemble'], IL.zoneOut],
    ['ZONE SERVES', ['La Zone sort', 'pour servir la ville'], IL.serves],
    ['SERVE DAY', ['Découvrir un service,', 'trouver sa place'], IL.serveDay],
  ];
  const signature = {
    range: S.S.signature,
    draw(ctx, t) {
      const e = ev.signature;
      bgPaper(ctx, t);
      K.kicker(ctx, 'NOS PROGRAMMES SIGNATURE', X0, 150, t, e.title);
      K.line(ctx, 'TOUTE L’ANNÉE', X0, 232, 64, t, e.title + 0.05, { color: C.INK });
      SIG.forEach(([name, sub, art], i) => {
        const x = sgX(i), t0 = e.items[i];
        K.card(ctx, x, SG.y, SG.w, SG.h, K.pop(t, t0 - 0.12, 0.4, 1.6), 'flip', (c, w, h) => art(c, w, h, t, t0), { r: 18, shadowColor: 'rgba(13,8,56,0.2)', drop: 16 });
        K.hero(ctx, `0${i + 1}`, x, 628, 40, t, t0 + 0.05, { color: C.BLUE });
        K.line(ctx, name, x + 66, 628, K.fit(ctx, name, 34, SG.w - 66), t, t0 + 0.1, { color: C.INK });
        sub.forEach((sl, j) => K.line(ctx, sl, x, 678 + j * 32, K.fit(ctx, sl, 22, SG.w, 'text', 700), t, t0 + 0.16 + j * 0.05, { fam: 'text', color: C.MUTE, weight: 700 }));
      });
      K.line(ctx, 'MOINS DE PLATEFORME, PLUS DE PRÉSENCE.', X0, 856, 54, t, e.tag, { color: C.INK, underline: C.ORANGE });
    },
    sq(ctx, t) {
      return hops(t, ev.signature.items.map((tt, i) => { const [fx, fy, sz] = SIG[i][2].spot; return { t: tt, x: sgX(i) + fx * SG.w, y: SG.y + fy * SG.h, s: sz }; }), 0.3, 90);
    },
  };

  // ======================= 15 · THE BIG GATHERINGS: each slams onto the stage, then docks into one system =======================
  const GA = [
    ['PUISSANCE & GUÉRISON', 'Deux séminaires pour rencontrer Dieu', IL.arena, ['PUISSANCE', '& GUÉRISON']],
    ['AIGLES & OUVRIERS', 'Célébrer ceux qui font vivre la Zone', IL.eagles, ['AIGLES', '& OUVRIERS']],
    ['242 BUSINESS CONFERENCE', 'Foi · business · leadership · impact', IL.business, ['242 BUSINESS', 'CONFERENCE']],
    ['14 JOURS · 242 HOURS', 'Jeûne et prière, chaque janvier', IL.fasting, ['14 JOURS', '242 HOURS']],
  ];
  const GS = { x: 960, y: 300, w: 800, h: 440 }, CH = { y: 790, w: 384, h: 104, step: 405 };
  const gather = {
    range: S.S.gather,
    draw(ctx, t) {
      const e = ev.gather;
      bgNavy(ctx, t);
      ghost(ctx, t, 1560, 520, 820, C.WHITE, 0.04);
      K.kicker(ctx, 'LES GRANDS RASSEMBLEMENTS 242', X0, 150, t, e.title);
      K.line(ctx, 'UNE FOIS PAR AN', X0, 232, 64, t, e.title + 0.05);
      const leaveAt = (i) => (i < 3 ? e.items[i + 1] : e.tag) - 0.12;
      GA.forEach(([n, sl, art], i) => {
        const t0 = e.items[i];
        if (t < t0 - 0.2 || t > leaveAt(i) + 0.35) return;
        const out = ease.inCubic(prog(t, leaveAt(i), 0.3));
        ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -out * 70);
        K.kicker(ctx, `0${i + 1} / 04`, X0 + 60, 410, t, t0, { size: 24, dot: false });
        K.hero(ctx, n, X0 + 60, 500, K.fit(ctx, n, 76, 690), t, t0);
        K.line(ctx, sl, X0 + 60, 580, 30, t, t0 + 0.15, { fam: 'text', weight: 700, color: 'rgba(255,255,255,0.75)' });
        K.card(ctx, GS.x, GS.y, GS.w, GS.h, ez.out(prog(t, t0 - 0.2, 0.2)), 'slam', (c, w, h) => art(c, w, h, t, t0), { r: 22, shadowColor: 'rgba(0,0,0,0.5)' });
        ctx.restore();
      });
      GA.forEach(([, , art, lines], i) => {
        const k = ez.out(prog(t, leaveAt(i), 0.4));
        if (k <= 0) return;
        const x = X0 + i * CH.step, y = CH.y + (1 - k) * 40, th = CH.h - 16, tw = 150;
        ctx.save(); ctx.globalAlpha = k;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; ctx.strokeRect(x, y, CH.w, CH.h);
        K.card(ctx, x + 8, y + 8, tw, th, 1, null, (c) => { c.scale(th / GS.h, th / GS.h); art(c, GS.w, GS.h, t, e.items[i]); }, { r: 8, shadow: false });
        K.text(ctx, `0${i + 1}`, x + 176, y + 26, 20, C.ORANGE, { fam: 'mono', weight: 500 });
        lines.forEach((l, j) => K.text(ctx, l, x + 176, y + 56 + j * 28, K.fit(ctx, l, 22, CH.w - 190, null, 800), C.WHITE, { weight: 800 }));
        ctx.restore();
      });
      K.trace(ctx, [[X0, 926], [X0 + 3 * CH.step + CH.w, 926]], ez.inOut(prog(t, e.tag, 0.6)), C.ORANGE, 5, { cap: 'butt' });
      K.line(ctx, 'PAS UN CALENDRIER :', CX, 450, 96, t, e.tag, { align: 'center' });
      K.line(ctx, 'UN SYSTÈME.', CX, 566, 96, t, e.tag + 0.12, { align: 'center', underline: C.ORANGE });
    },
    sq(ctx, t) {
      const e = ev.gather;
      return hops(t, e.items.map((tt) => ({ t: tt, x: X0 + 18, y: 410, s: 28 })).concat([{ t: e.tag, x: CX, y: 340, s: 36 }]), 0.3, 60);
    },
  };
  // ======================= 16 · THE GOAL: 2 420 people — one figure for every ten =======================
  const CP = { gx: 1016, gy: 296, step: 34, cols: 22, n: 242 };
  const cellXY = (i) => [CP.gx + (i % CP.cols) * CP.step, CP.gy + Math.floor(i / CP.cols) * CP.step];
  const ORDER = (() => { const o = Array.from({ length: CP.n }, (_, i) => i).slice(1); o.sort((a, b) => ((a % CP.cols) + Math.floor(a / CP.cols) * 1.6 + U.hash(601, a) * 3) - ((b % CP.cols) + Math.floor(b / CP.cols) * 1.6 + U.hash(601, b) * 3)); return [0].concat(o); })();
  const RANK = (() => { const r = []; ORDER.forEach((c, i) => { r[c] = i; }); return r; })();
  function glyph(ctx, x, y, fill, col) {
    ctx.save(); ctx.beginPath(); ctx.rect(x - 15, y - 15, 30, 30); ctx.clip();
    const p = new Path2D(); p.arc(x, y - 5, 6, 0, Math.PI * 2); p.ellipse(x, y + 13, 11, 9, 0, Math.PI, 0); p.closePath();
    if (fill > 0) { ctx.fillStyle = col; ctx.globalAlpha *= fill; ctx.fill(p); }
    else { ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.6; ctx.stroke(p); }
    ctx.restore();
  }
  const cap = {
    range: S.S.cap,
    draw(ctx, t) {
      const e = ev.cap;
      bgBlue(ctx, t);
      K.kicker(ctx, 'LE CAP', X0, 150, t, e.start);
      const k = ez.inOut(prog(t, e.countFrom, e.countTo - e.countFrom)), n = Math.round(lerp(50, 2420, k)), filled = n / 10;
      const show = ez.out(prog(t, e.start, 0.6));
      for (let i = 1; i < CP.n; i++) {
        const [x, y] = cellXY(i), r = RANK[i], f = clamp(filled - r);
        ctx.save(); ctx.globalAlpha *= show;
        glyph(ctx, x, y, f, U.hash(602, i) > 0.92 ? C.ORANGE : C.WHITE);
        ctx.restore();
      }
      if (t >= e.countFrom - 0.2) {
        const str = n.toLocaleString('fr-FR').replace(/\s/g, ' '), pop = 1 + 0.08 * Math.sin(Math.PI * prog(t, e.countTo, 0.3));
        ctx.save(); ctx.translate(X0, 452); ctx.scale(pop, pop);
        K.text(ctx, str, 0, 0, 210, C.WHITE, { alpha: prog(t, e.countFrom - 0.2, 0.3) });
        ctx.restore();
      }
      // thirty-six months, filling with the count
      const bk = ez.out(prog(t, e.start + 0.2, 0.5));
      if (bk > 0) {
        const bx = X0, by = 600, bw = 760 * bk;
        ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(bx, by, bw, 8);
        ctx.fillStyle = C.ORANGE; ctx.fillRect(bx, by, 760 * k, 8);
        for (let m = 0; m <= 36; m += 6) { const mx = bx + 760 * m / 36; if (mx <= bx + bw) { ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(mx - 1, by + 14, 2, 10); K.text(ctx, String(m), mx, by + 42, 18, 'rgba(255,255,255,0.6)', { fam: 'mono', weight: 500, align: 'center' }); } }
      }
      K.line(ctx, 'PERSONNES ACTIVES,', X0, 712, 46, t, e.label);
      K.line(ctx, 'INTÉGRÉES ET ENGAGÉES', X0, 772, 46, t, e.label + 0.1);
      const sk = prog(t, e.stamp, 0.24);
      if (sk > 0) {
        const sc = lerp(2.2, 1, ease.outBack(sk, 1.8)), label = 'EN 36 MOIS', ls = 54, lw = K.measure(ctx, label, ls) + 72;
        ctx.save(); ctx.translate(X0 + lw / 2, 900); ctx.rotate(-0.07); ctx.scale(sc, sc); ctx.globalAlpha = clamp(sk * 4);
        ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
        K.fillRR(ctx, -lw / 2, -ls * 0.86, lw, ls * 1.72, 10, C.ORANGE); ctx.shadowColor = 'transparent';
        K.text(ctx, label, 0, 0, ls, C.WHITE, { align: 'center' });
        ctx.restore();
      }
    },
    sq() { const [x, y] = cellXY(0); return { x, y: y + 2, s: 24, r: 0, a: 1 }; },
  };

  // ======================= 17 · ISAIAH 60:1: the sun rises behind a people standing up =======================
  const NIGHT = '#05031A', HY = H * 0.74;
  const RISE = Array.from({ length: 17 }, (_, i) => ({ x: 70 + i * 112 + (U.hash(701, i) - 0.5) * 40, h: ((i % 5 === 2 ? 150 : 230) + U.hash(702, i) * 60) * 0.84, b: i % 5 === 2 ? 'kid' : i % 2 ? 'f' : 'm', hair: ['short', 'gele', 'afro', 'bun', 'cap', 'braids', 'puffs', 'short', 'long'][i % 9], d: U.hash(703, i) }));
  const hillY = (x) => HY + 30 + Math.sin(x / 260) * 16 + Math.sin(x / 90 + 1) * 4;
  function lightLine(ctx, str, x, y, size, weight, t, t0) {
    if (t < t0) return;
    const fam = K.F.DISPLAY, total = G.measure(ctx, str, size, fam, weight), x0 = x - total / 2;
    const gx = lerp(x0 - 30, x0 + total + 160, ez.out(prog(t, t0, 0.45 + str.length * 0.012)));
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === ' ') continue;
      const c = x0 + G.measure(ctx, str.slice(0, i), size, fam, weight) + G.measure(ctx, ch, size, fam, weight) / 2, k = clamp((gx - c) / 120);
      if (k <= 0) continue;
      const hot = Math.max(0, 1 - Math.abs(gx - c) / 180);
      ctx.save(); ctx.shadowColor = 'rgba(255,170,110,0.85)'; ctx.shadowBlur = 8 + 34 * hot;
      G.text(ctx, ch, c, y + (1 - ez.out(k)) * size * 0.3, { size, fam, weight, color: hot > 0.35 ? '#FFE9C9' : C.WHITE, align: 'center', baseline: 'middle', alpha: k });
      ctx.restore();
    }
  }
  const isaiah = {
    range: S.S.isaiah,
    draw(ctx, t) {
      const e = ev.isaiah, s0 = S.S.isaiah[0];
      const dawn = ez.io(prog(t, s0 + 0.2, e.ref - s0)), rise = ez.inOut(prog(t, s0 + 0.15, e.l3 - s0));
      const flood = ease.inExpo(prog(t, e.swell + 0.5, e.cut - e.swell - 0.5));
      const sx = CX, sy = lerp(HY + 140, H * 0.56, rise), ss = 120;
      const sky = ctx.createLinearGradient(0, 0, 0, HY + 40);
      sky.addColorStop(0, K.mix(NIGHT, C.NAVY, dawn)); sky.addColorStop(0.55, K.mix(NIGHT, C.BLUE, dawn)); sky.addColorStop(1, K.mix('#140A45', C.ORANGE, dawn));
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 80; i++) {
        const a = (1 - dawn) * (0.45 + 0.35 * Math.sin(t * 2.2 + i * 1.7)) * clamp((t - s0) / 0.3);
        if (a <= 0.01) continue;
        const r = 1 + U.hash(33, i) * 1.8; ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(U.hash(31, i) * W, U.hash(32, i) * HY * 0.8, r, r);
      }
      // the sun: the light of the whole film, rising behind the hill
      const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, lerp(220, 720, dawn));
      halo.addColorStop(0, `rgba(255,214,170,${0.8 * rise})`); halo.addColorStop(0.4, `rgba(255,140,90,${0.3 * rise})`); halo.addColorStop(1, 'rgba(255,120,80,0)');
      ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * 0.05); ctx.fillStyle = `rgba(255,236,210,${0.09 * dawn})`;
      for (let i = 0; i < 18; i++) { ctx.rotate(Math.PI * 2 / 18); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-70, -W); ctx.lineTo(70, -W); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.shadowColor = 'rgba(255,120,70,0.95)'; ctx.shadowBlur = 80; ctx.fillStyle = C.ORANGE; ctx.fillRect(sx - ss / 2, sy - ss / 2, ss, ss); ctx.restore();
      // the hill, and a people on it: heads bowed, then standing up with their hands lifted
      const hill = new Path2D(); hill.moveTo(0, H); for (let x = 0; x <= W; x += 20) hill.lineTo(x, hillY(x)); hill.lineTo(W, H); hill.closePath();
      ctx.fillStyle = K.mix('#07031C', '#1A0D3A', dawn * 0.4); ctx.fill(hill);
      ctx.strokeStyle = `rgba(255,170,120,${0.5 * rise})`; ctx.lineWidth = 2; ctx.beginPath(); for (let x = 0; x <= W; x += 20) (x ? ctx.lineTo(x, hillY(x)) : ctx.moveTo(x, hillY(x))); ctx.stroke();
      RISE.forEach((p, i) => {
        const up = ez.inOut(prog(t, e.l1 + p.d * (e.l3 - e.l1), 0.7)), b = p.b;
        const hands = P.mix(P.hands(b, 'down'), P.hands(b, i % 3 ? 'up' : 'upOne', t * 2 + i), up);
        P.person(ctx, p.x, hillY(p.x) + 8, p.h, { t, seed: 710 + i, build: b, hair: p.hair, sil: '#07031C', rim: K.mix('#3A2A8F', '#FF9A6B', rise), hands, tilt: (1 - up) * 0.18 * (i % 2 ? 1 : -1), outfit: b === 'f' && i % 4 === 1 ? 'dress' : 'tee' });
      });
      // the verse, lit line by line
      [['« LÈVE-TOI,', e.l1, 124, 900, 0.165], ['SOIS ÉCLAIRÉ,', e.l2, 102, 900, 0.285],
        ['CAR TA LUMIÈRE ARRIVE,', e.l3, 64, 800, 0.385], ['ET LA GLOIRE DE L’ÉTERNEL SE LÈVE SUR TOI. »', e.l3 + 0.5, 45, 700, 0.455]]
        .forEach(([str, t0, size, weight, yy]) => lightLine(ctx, str, CX, H * yy, K.fit(ctx, str, size, XR - X0, null, weight), weight, t, t0));
      K.kicker(ctx, 'ÉSAÏE 60:1', CX, H * 0.07, t, e.ref, { size: 30, align: 'center', dot: false });
      if (flood > 0) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, lerp(ss, Math.hypot(W, H), flood));
        g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.75, `rgba(255,252,244,${flood})`); g.addColorStop(1, 'rgba(255,250,240,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const all = clamp((flood - 0.65) / 0.35);
        if (all > 0) { ctx.fillStyle = `rgba(255,255,255,${all})`; ctx.fillRect(0, 0, W, H); }
      }
    },
    sq: () => null,
  };

  // ======================= the film =======================
  const blank = (range) => ({ range, is3d: true, draw: (ctx) => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }, sq: () => null });
  const SCENES = [blank(S.S.open3d), vision, rooted, crowd, acts, connect, transform, send, sunday, week, gens,
    menwomen, couples, camps, signature, gather, cap, isaiah, blank(S.S.final3d)];
  const TRAVEL = [0.32, 0.08];   // the light leaves 0.32 s before a cut and lands 0.08 s after it
  const WIPE = [0.2, 0.36];      // the next scene opens from the light
  const FADE = 0.45;             // into Isaiah: a slow dissolve into the night
  let off = null;

  function fadeCut(ctx, t, a, A, B) {
    A.draw(ctx, t);
    if (!off) off = document.createElement('canvas');
    if (off.width !== ctx.canvas.width || off.height !== ctx.canvas.height) { off.width = ctx.canvas.width; off.height = ctx.canvas.height; }
    const o2 = off.getContext('2d');
    o2.setTransform(1, 0, 0, 1, 0, 0); o2.clearRect(0, 0, off.width, off.height);
    o2.setTransform(ctx.getTransform());
    B.draw(o2, t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = ez.io(prog(t, a - FADE, 2 * FADE)); ctx.drawImage(off, 0, 0); ctx.restore();
  }

  function frame(ctx, t) {
    let idx = SCENES.findIndex((sc) => t >= sc.range[0] && t < sc.range[1]);
    if (idx < 0) idx = SCENES.length - 1;
    const cur = SCENES[idx], prev = SCENES[idx - 1], next = SCENES[idx + 1];
    let cut = null;
    if (!cur.is3d && prev && !prev.is3d && t < cur.range[0] + FADE) cut = { a: cur.range[0], A: prev, B: cur };
    else if (!cur.is3d && next && !next.is3d && t >= next.range[0] - FADE) cut = { a: next.range[0], A: cur, B: next };
    const fade = cut && cut.B === isaiah;
    let st = cur.sq(ctx, t);
    if (cut) {
      const tr = fade ? [FADE, 0.25] : TRAVEL;
      if (t >= cut.a - tr[0] && t < cut.a + tr[1]) {
        const p0 = cut.A.sq(ctx, cut.a - tr[0]);
        const p1 = fade ? { x: CX, y: H * 0.8, s: 60, r: 0, a: 0 } : cut.B.sq(ctx, cut.a + tr[1]);
        if (p0 && p1) {
          const q = ez.inOut(prog(t, cut.a - tr[0], tr[0] + tr[1]));
          st = { x: lerp(p0.x, p1.x, q), y: lerp(p0.y, p1.y, q) - Math.sin(Math.PI * q) * 160, s: lerp(p0.s, p1.s, q), r: (1 - q) * -Math.PI, a: lerp(p0.a ?? 1, p1.a ?? 1, q) };
        }
      }
    }
    if (cut && fade && t >= cut.a - FADE) fadeCut(ctx, t, cut.a, cut.A, cut.B);
    else if (cut && !fade && t >= cut.a - WIPE[0] && t < cut.a + WIPE[1]) {
      cut.A.draw(ctx, t);
      const o = st || { x: CX, y: H / 2 };
      K.wipe(ctx, o.x, o.y, prog(t, cut.a - WIPE[0], WIPE[0] + WIPE[1]), () => cut.B.draw(ctx, t));
    } else cur.draw(ctx, t);
    square(ctx, st);
    // the strong moments: a white flash on the downbeat of each drop
    const fl = S.drops.reduce((m, d) => (t >= d && t < d + 0.4 ? Math.max(m, 0.6 * Math.exp(-(t - d) * 12)) : m), 0);
    if (fl > 0.01 && !cur.is3d) { ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.fillRect(0, 0, W, H); }
  }

  // motion blur: the average of a few instants inside a 180° shutter
  let acc = null;
  function draw(ctx, t) {
    if (MB <= 1) { frame(ctx, t); return; }
    const cv = ctx.canvas;
    if (!acc) acc = document.createElement('canvas');
    if (acc.width !== cv.width || acc.height !== cv.height) { acc.width = cv.width; acc.height = cv.height; }
    const a2 = acc.getContext('2d'), shutter = 0.5 / S.FPS;
    for (let i = 0; i < MB; i++) {
      a2.setTransform(ctx.getTransform()); a2.globalAlpha = 1; a2.globalCompositeOperation = 'source-over';
      frame(a2, t + ((i + 0.5) / MB - 0.5) * shutter);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 / (i + 1); ctx.drawImage(acc, 0, 0); ctx.restore();
    }
  }

  Studio.film({
    async init() {
      await Studio.loadFont(K.F.DISPLAY, 'assets/fonts/montserrat-latin-700-normal.woff2', 700);
      await Studio.loadFont(K.F.DISPLAY, 'assets/fonts/montserrat-latin-800-normal.woff2', 800);
      await Studio.loadFont(K.F.DISPLAY, 'assets/fonts/montserrat-latin-900-normal.woff2', 900);
      await Studio.loadFont(K.F.MONO, 'assets/fonts/ibm-plex-mono-latin-500-normal.woff2', 500);
      await Studio.loadFont(K.F.TEXT, 'engine/fonts/Inter-700.ttf', 700);
      await Studio.loadFont(K.F.TEXT, 'engine/fonts/Inter-800.ttf', 800);
    },
    draw,
    post: { paper: 0, vignette: 0.12, grain: 0.025 },
    fadeOut: 0,
  });
})();
