// ZONE 242 · « Voir l'invisible » : chaque image est une fonction pure de t (pas de Math.random, pas de Date).
(function () {
  const W = 1080, H = 1920, CX = W / 2;
  const C = {
    NIGHT: '#0B0733', NAVY: '#14104A', BLUE: '#1900CF', BLUE_M: '#3B2BE6', BLUE_L: '#6F64F2', BLUE_XL: '#A9A2FF',
    ORANGE: '#FF5A36', ORANGE_L: '#FF8A6B', PEACH: '#FFD3C7', PAPER: '#F7F5F1', WHITE: '#FFFFFF',
    GREY: '#3A3D63', GREY_M: '#5A5E88', GREY_L: '#8A8EB5', RED: '#E8452C',
  };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    out: k => 1 - Math.pow(1 - k, 3),
    inOut: k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    back: k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
    bounce: k => { const n = 7.5625, d = 2.75; if (k < 1 / d) return n * k * k; if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75; if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375; return n * (k -= 2.625 / d) * k + 0.984375; },
  };
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const FONT = (w, s) => `${w} ${s}px Montserrat, sans-serif`;

  let ctx;
  // ---------- primitives ----------
  function rr(x, y, w, h, r, fill, stroke, lw = 4) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }
  function txt(s, x, y, o = {}) {
    const { size = 60, weight = 800, color = C.WHITE, align = 'center', alpha = 1, ls = 0, stroke, sw = 8, base = 'middle' } = o;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.font = FONT(weight, size); ctx.textAlign = align; ctx.textBaseline = base;
    ctx.letterSpacing = ls + 'px'; ctx.lineJoin = 'round';
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.strokeText(s, x, y); }
    ctx.fillStyle = color; ctx.fillText(s, x, y); ctx.restore();
  }
  function outline(s, x, y, o = {}) {
    const { size = 200, color = C.WHITE, lw = 5, alpha = 1, align = 'center', ls = 0 } = o;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.font = FONT(900, size); ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.letterSpacing = ls + 'px'; ctx.fillStyle = color; ctx.globalAlpha *= 0.22; ctx.fillText(s, x, y); ctx.restore();
  }
  function glow(x, y, r, color, a = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  function typed(s, k) { return s.slice(0, Math.round(s.length * clamp(k))); }

  // Le symbole ZONE 242 : quatre coins + carré orange (géométrie du logo officiel)
  function symbol(cx, cy, size, o = {}) {
    const { spread = 0, alpha = 1, col = C.BLUE_M, sq = 1, rot = 0 } = o;
    const u = size / 965, th = 124 * u, arm = 372 * u, half = 482.5 * u, s = 223 * u * sq;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(cx, cy); ctx.rotate(rot); ctx.fillStyle = col;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const ox = sx * (half + spread), oy = sy * (half + spread);
      // coin extérieur à (ox, oy), bras vers l'intérieur
      ctx.fillRect(Math.min(ox, ox - sx * arm), Math.min(oy, oy - sy * th), arm, th);
      ctx.fillRect(Math.min(ox, ox - sx * th), Math.min(oy, oy - sy * arm), th, arm);
    }
    ctx.fillStyle = C.ORANGE; ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.restore();
  }

  // Œil : amande qui s'ouvre, iris lumineux
  function eye(cx, cy, w, open, o = {}) {
    const { look = 0, glowK = 1, iris = C.ORANGE, line = C.WHITE } = o;
    const h = w * 0.34 * open;
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath(); ctx.moveTo(-w / 2, 0);
    ctx.bezierCurveTo(-w * 0.25, -h * 1.5, w * 0.25, -h * 1.5, w / 2, 0);
    ctx.bezierCurveTo(w * 0.25, h * 1.5, -w * 0.25, h * 1.5, -w / 2, 0); ctx.closePath();
    if (open > 0.04) {
      ctx.save(); ctx.clip(); ctx.fillStyle = '#FFF8F2'; ctx.fillRect(-w, -w, 2 * w, 2 * w);
      const ix = look * w * 0.13;
      ctx.fillStyle = iris; ctx.beginPath(); ctx.arc(ix, 0, w * 0.2, 0, 7); ctx.fill();
      ctx.fillStyle = C.NIGHT; ctx.beginPath(); ctx.arc(ix, 0, w * 0.09, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ix - w * 0.06, -w * 0.06, w * 0.035, 0, 7); ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = line; ctx.lineWidth = Math.max(4, w * 0.03); ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
    if (open > 0.5 && glowK > 0) glow(cx, cy, w * 0.9, 'rgba(255,90,54,0.55)', glowK * (open - 0.5) * 2);
  }

  // Une personne simple (tête + corps), style aplat de la charte
  function person(x, y, s, o = {}) {
    const { body = C.BLUE_L, head = C.PEACH, alpha = 1, lean = 0 } = o;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(lean);
    ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(-34 * s, -150 * s, 68 * s, 150 * s, [34 * s, 34 * s, 8 * s, 8 * s]); ctx.fill();
    ctx.fillStyle = head; ctx.beginPath(); ctx.arc(0, -190 * s, 30 * s, 0, 7); ctx.fill();
    ctx.restore();
  }

  // ---------- fond commun : nuit + poussière lumineuse ----------
  function background(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0E0A3E'); g.addColorStop(0.55, C.NIGHT); g.addColorStop(1, '#070422');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 46; i++) {
      const sp = 8 + hash(i * 3) * 18;
      const x = hash(i) * W + Math.sin(t * 0.4 + i) * 22;
      const y = (H + 40 - ((hash(i + 50) * H + t * sp) % (H + 80)));
      const r = 1.5 + hash(i + 9) * 3.2;
      ctx.globalAlpha = 0.10 + hash(i + 20) * 0.2; ctx.fillStyle = i % 5 === 0 ? C.ORANGE_L : C.BLUE_XL;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ---------- sous-titres ----------
  let CAPS = null;
  function buildCaptions() {
    CAPS = [];
    const m = document.createElement('canvas').getContext('2d'); m.font = FONT(800, 56);
    for (const [a, b, text] of SEGMENTS) {
      const words = text.split(' ');
      const chunks = []; let cur = [], len = 0;
      for (const w of words) {
        if (cur.length && (len + w.length > 40 || cur.length >= 8)) { chunks.push(cur); cur = []; len = 0; }
        cur.push(w); len += w.length + 1;
      }
      if (cur.length) chunks.push(cur);
      const wt = w => w.length + 2 + (/[,.:;?!…»]$/.test(w) ? 3 : 0);
      const total = words.reduce((s, w) => s + wt(w), 0);
      let acc = 0;
      for (const ch of chunks) {
        const items = [];
        for (const w of ch) { const s0 = a + (b - a) * acc / total; acc += wt(w); items.push({ w, s: s0, e: a + (b - a) * acc / total }); }
        // coupe en lignes (largeur max 900 px)
        const lines = []; let line = [], lw = 0; const sp = m.measureText(' ').width;
        for (const it of items) {
          const wd = m.measureText(it.w).width;
          if (line.length && lw + sp + wd > 900) { lines.push(line); line = []; lw = 0; }
          it.wd = wd; line.push(it); lw += (line.length > 1 ? sp : 0) + wd;
        }
        lines.push(line);
        CAPS.push({ s: items[0].s, e: items[items.length - 1].e, lines, sp });
      }
    }
    for (let i = 0; i < CAPS.length; i++) { CAPS[i].show0 = CAPS[i].s - 0.08; CAPS[i].show1 = Math.min(CAPS[i].e + 0.35, i + 1 < CAPS.length ? CAPS[i + 1].s - 0.02 : 999); }
  }
  function captions(t) {
    if (NO_CAPTIONS.some(([a, b]) => t >= a && t < b)) return;
    const c = CAPS.find(c => t >= c.show0 && t < c.show1); if (!c) return;
    const a = clamp((t - c.show0) / 0.12) * clamp((c.show1 - t) / 0.12);
    const lh = 70, y0 = 1470 - (c.lines.length - 1) * lh;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - E.out(clamp((t - c.show0) / 0.18))) * 14);
    c.lines.forEach((line, li) => {
      const total = line.reduce((s, it) => s + it.wd, 0) + c.sp * (line.length - 1);
      let x = CX - total / 2; const y = y0 + li * lh;
      for (const it of line) {
        const cur = t >= it.s && t < it.e, past = t >= it.e;
        txt(it.w, x, y, { size: 56, align: 'left', color: cur ? C.ORANGE_L : C.WHITE, alpha: past || cur ? 1 : 0.42, stroke: 'rgba(7,4,34,0.9)', sw: 12 });
        x += it.wd + c.sp;
      }
    });
    ctx.restore();
  }

  // ---------- scènes ----------
  const SC = {};

  // 1 · Le visible n'a pas le dernier mot
  SC.s1 = (t) => {
    const k = E.out(prog(t, 0.15, 1.1));
    outline('LE DERNIER', CX, 400 - (1 - k) * 40, { size: 118, alpha: k * 0.9, lw: 4, color: C.BLUE_XL });
    outline('MOT', CX, 560 - (1 - k) * 40, { size: 230, alpha: k * 0.9, lw: 5, color: C.BLUE_XL });
    const slabs = [['MALADIE', 3.25, 1180], ['DETTE', 4.35, 1030], ['BLOCAGE', 5.2, 880]];
    slabs.forEach(([name, t0, ty], i) => {
      const k2 = prog(t, t0, t0 + 0.7); if (k2 <= 0) return;
      const fall = E.bounce(k2); let y = lerp(-200, ty, fall);
      const dtc = t - 7.0; // effritement sur « passager »
      const shake = t > 6.3 && t < 7.0 ? Math.sin(t * 90 + i) * 5 * prog(t, 6.3, 7.0) : 0;
      const w = 780, h = 130, x = CX - w / 2 + shake;
      if (dtc < 0) {
        rr(x, y - h / 2, w, h, 18, C.GREY, C.GREY_M, 3);
        txt(name, CX + shake, y, { size: 62, color: C.GREY_L, ls: 6 });
        const cr = prog(t, 6.0, 6.9);
        if (cr > 0) { ctx.strokeStyle = C.NIGHT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 120 + i * 90, y - h / 2); ctx.lineTo(x + 150 + i * 90, y - h / 2 + 50 * cr); ctx.lineTo(x + 130 + i * 90, y - h / 2 + 80 * cr); ctx.lineTo(x + 170 + i * 90, y + h / 2 * cr); ctx.stroke(); }
      } else {
        for (let j = 0; j < 28; j++) {
          const sx = x + (j % 14) * (w / 14) + w / 28, sy = y - h / 4 + Math.floor(j / 14) * (h / 2);
          const vx = (hash(j + i * 40) - 0.5) * 420, vy = -260 - hash(j + 7 + i * 40) * 320;
          const px = sx + vx * dtc, py = sy + vy * dtc + 520 * dtc * dtc * (0.4 + 0.6 * hash(j + 3));
          const al = clamp(1 - dtc / 1.1); if (al <= 0) continue;
          ctx.globalAlpha = al; ctx.fillStyle = dtc > 0.35 ? C.PEACH : C.GREY_L;
          const z = 20 + hash(j + 11) * 16; ctx.fillRect(px - z / 2, py - z / 2, z, z * 0.7);
        }
        ctx.globalAlpha = 1; glow(CX, y, 360, 'rgba(255,138,107,0.35)', clamp(1 - dtc / 1.2));
      }
    });
  };

  // 2 · Dimanche à la Zone
  SC.s2 = (t) => {
    const k = E.out(prog(t, 8.5, 9.9));
    glow(CX, 560, 420, 'rgba(25,0,207,0.55)', k);
    symbol(CX, 560, 430, { spread: (1 - k) * 420, alpha: k, sq: E.back(prog(t, 9.4, 10.1)) });
    const pill = (label, y, t0, fill) => {
      const kk = E.out(prog(t, t0, t0 + 0.45)); if (kk <= 0) return;
      ctx.font = FONT(700, 34); ctx.letterSpacing = '5px'; const w = ctx.measureText(label).width + 80;
      ctx.save(); ctx.globalAlpha = kk; rr(CX - w / 2, y - 36, w, 72, 36, fill, null);
      txt(label, CX, y + 1, { size: 34, weight: 700, ls: 5, color: C.WHITE }); ctx.restore();
    };
    pill('DIMANCHE · ENSEIGNEMENT', 905, 9.0, C.BLUE_M);
    pill('APÔTRE AMOS', 1005, 10.6, C.ORANGE);
    const tk = prog(t, 12.2, 13.6);
    txt(typed('LE SURNATUREL', tk * 2), CX, 1130, { size: 92, ls: 2, align: 'center' });
    txt(typed('DE DIEU', clamp(tk * 2 - 1)), CX, 1235, { size: 92, color: C.ORANGE_L, ls: 2 });
  };

  // 3 · Le verset 2 Corinthiens 4:18 (karaoké)
  const VERSE = [
    [15.66, 19.69, 'Nous regardons non pas aux choses visibles, mais à celles qui sont invisibles,'],
    [20.01, 23.76, 'car les choses visibles sont passagères et les invisibles sont éternelles.'],
  ];
  let VW = null;
  function verseWords() {
    const m = document.createElement('canvas').getContext('2d'); m.font = FONT(800, 66); const sp = m.measureText(' ').width;
    const words = [];
    for (const [a, b, s] of VERSE) {
      const ws = s.split(' '); const tot = ws.reduce((q, w) => q + w.length + 1, 0); let acc = 0;
      for (const w of ws) { words.push({ w, s: a + (b - a) * acc / tot, e: a + (b - a) * (acc + w.length + 1) / tot, wd: m.measureText(w).width }); acc += w.length + 1; }
    }
    const lines = []; let line = [], lw = 0;
    for (const it of words) { if (line.length && lw + sp + it.wd > 860) { lines.push(line); line = []; lw = 0; } line.push(it); lw += (line.length > 1 ? sp : 0) + it.wd; }
    lines.push(line); return { lines, sp };
  }
  SC.s3 = (t) => {
    if (!VW) VW = verseWords();
    const k = E.back(prog(t, 15.5, 16.1));
    ctx.save(); ctx.translate(CX, 300); ctx.scale(k, k);
    rr(-260, -44, 520, 88, 44, C.ORANGE); txt('2 CORINTHIENS 4:18', 0, 2, { size: 36, ls: 4 }); ctx.restore();
    const lh = 104, y0 = 700 - (VW.lines.length - 1) * lh / 2;
    VW.lines.forEach((line, li) => {
      const total = line.reduce((s, it) => s + it.wd, 0) + VW.sp * (line.length - 1); let x = CX - total / 2; const y = y0 + li * lh;
      for (const it of line) {
        const sp = prog(t, it.s - 0.05, it.s + 0.25); const w = it.w.replace(/[,.]/g, '');
        let col = C.WHITE, al = 0.2 + 0.8 * sp, sc = 1;
        if (/^visibles$|^passagères$/.test(w)) { col = C.GREY_L; if (sp > 0) al = lerp(1, 0.4, prog(t, it.e, it.e + 1.2)); }
        if (/^invisibles$/.test(w)) { col = C.PEACH; }
        if (/^éternelles$/.test(w)) { col = C.ORANGE_L; sc = 1 + 0.12 * E.out(sp); }
        ctx.save(); ctx.translate(x + it.wd / 2, y); ctx.scale(sc, sc);
        if (/^(invisibles|éternelles)/.test(w) && sp > 0) glow(0, 0, it.wd, 'rgba(255,90,54,0.45)', sp);
        txt(it.w, 0, 0, { size: 66, color: col, alpha: al });
        ctx.restore(); x += it.wd + VW.sp;
      }
    });
    const f = prog(t, 22.3, 23.6);
    if (f > 0) { glow(CX, 1180, 380, 'rgba(255,138,107,0.5)', f); txt('ÉTERNELLES', CX, 1180, { size: 96, color: C.ORANGE_L, alpha: f, ls: 4 }); }
  };

  // mur gris (scènes 4–5)
  function wall(cx, cy, w, h, cracks = 0) {
    rr(cx - w / 2, cy - h / 2, w, h, 22, C.GREY, C.GREY_M, 3);
    ctx.save(); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 22); ctx.clip();
    ctx.strokeStyle = 'rgba(11,7,51,0.55)'; ctx.lineWidth = 3;
    for (let r = 1; r < 6; r++) { ctx.beginPath(); ctx.moveTo(cx - w / 2, cy - h / 2 + r * h / 6); ctx.lineTo(cx + w / 2, cy - h / 2 + r * h / 6); ctx.stroke(); }
    for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) { const off = r % 2 ? w / 10 : 0; ctx.beginPath(); ctx.moveTo(cx - w / 2 + c * w / 5 + off, cy - h / 2 + r * h / 6); ctx.lineTo(cx - w / 2 + c * w / 5 + off, cy - h / 2 + (r + 1) * h / 6); ctx.stroke(); }
    if (cracks > 0) {
      ctx.strokeStyle = C.NIGHT; ctx.lineWidth = 7; ctx.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const x0 = cx - w / 2 + (0.12 + i * 0.19) * w, y0 = cy - h / 2; ctx.beginPath(); ctx.moveTo(x0, y0);
        let x = x0, y = y0; const n = Math.floor(8 * clamp(cracks * 1.4 - i * 0.12) + 0.001);
        for (let j = 0; j < n; j++) { x += (hash(i * 9 + j) - 0.5) * 70; y += h / 8; ctx.lineTo(x, y); } ctx.stroke();
      }
    }
    ctx.restore();
  }

  // 4 · Regarder l'invisible : les yeux physiques ne voient que le naturel
  SC.s4 = (t) => {
    const cy = 740, w = 800, h = 640;
    wall(CX, cy, w, h, prog(t, 34.04, 35.4));
    const lit = prog(t, 32.4, 32.9) * (1 - prog(t, 34.4, 35.4) * 0.5);
    txt('LE NATUREL', CX, cy, { size: 84, color: lerp(0, 1, lit) > 0 ? C.WHITE : C.GREY_L, alpha: 0.35 + 0.65 * lit, ls: 4 });
    // la lentille balaye le mur et ne trouve rien
    const sk = prog(t, 27.4, 31.5);
    if (sk > 0 && sk < 1.01) {
      const lx = CX + Math.sin(sk * Math.PI * 2.2) * 250, ly = cy + Math.cos(sk * Math.PI * 1.6) * 170;
      const a = clamp(sk * 6) * clamp((1 - sk) * 8);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.BLUE_XL; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lx, ly, 120, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lx - 150, ly); ctx.lineTo(lx - 95, ly); ctx.moveTo(lx + 95, ly); ctx.lineTo(lx + 150, ly); ctx.moveTo(lx, ly - 150); ctx.lineTo(lx, ly - 95); ctx.moveTo(lx, ly + 95); ctx.lineTo(lx, ly + 150); ctx.stroke(); ctx.restore();
    }
    // les yeux physiques
    const ek = E.out(prog(t, 29.8, 30.5)); const look = Math.sin(sk * Math.PI * 2.2);
    ctx.save(); ctx.globalAlpha = ek; eye(CX - 150, 1190, 230, 1, { look, glowK: 0, iris: C.BLUE_L }); eye(CX + 150, 1190, 230, 1, { look, glowK: 0, iris: C.BLUE_L }); ctx.restore();
    const rk = E.back(prog(t, 24.1, 24.7)) * (1 - prog(t, 26.9, 27.4));
    if (rk > 0) { ctx.save(); ctx.translate(CX, 320); ctx.scale(rk, rk); rr(-190, -40, 380, 80, 40, C.ORANGE); txt('2 CO 4:18', 0, 2, { size: 38, ls: 4 }); ctx.restore(); }
  };

  // 5 · La foi, ce sont des yeux
  SC.s5 = (t) => {
    // le point d'interrogation
    const qk = E.back(prog(t, 36.0, 36.7)) * (1 - prog(t, 38.3, 38.8));
    if (qk > 0.01) { glow(CX, 700, 500, 'rgba(255,90,54,0.45)', qk); ctx.save(); ctx.translate(CX, 700); ctx.scale(qk, qk); txt('?', 0, 0, { size: 820, color: C.ORANGE_L, weight: 900 }); ctx.restore(); }
    const rk = E.back(prog(t, 38.8, 39.4)) * (1 - prog(t, 42.0, 42.5));
    if (rk > 0.01) { ctx.save(); ctx.translate(CX, 640); ctx.scale(rk, rk); rr(-260, -46, 520, 92, 46, C.ORANGE); txt('2 CORINTHIENS 5:7', 0, 2, { size: 36, ls: 4 }); ctx.restore(); }
    // par la foi / non par la vue
    const a1 = E.out(prog(t, 42.7, 43.4)) * (1 - prog(t, 44.55, 44.95));
    const a2 = E.out(prog(t, 43.9, 44.5)) * (1 - prog(t, 44.55, 44.95));
    txt('PAR LA FOI', CX, 560 + (1 - a1) * 40, { size: 120, color: C.ORANGE_L, alpha: a1 });
    glow(CX, 560, 420, 'rgba(255,90,54,0.35)', a1);
    txt('NON PAR LA VUE', CX, 820 + (1 - a2) * 40, { size: 84, color: C.GREY_L, alpha: a2 });
    // le mur, puis l'œil de la foi
    const wk = E.out(prog(t, 45.0, 45.5));
    const open = E.out(prog(t, 45.3, 46.3));
    if (wk > 0) {
      const lensR = lerp(250, 760, E.inOut(prog(t, 47.2, 48.8)));
      ctx.save(); ctx.globalAlpha *= wk; wall(CX, 740, 840, 760, 0);
      ctx.beginPath(); ctx.arc(CX, 740, lensR * E.out(prog(t, 46.0, 46.6)), 0, 7); ctx.clip();
      ctx.fillStyle = '#10094A'; ctx.fillRect(0, 0, W, H);
      for (let r = 0; r < 18; r++) { ctx.strokeStyle = `rgba(255,${120 + r * 4},${80 + r * 6},${0.55 - r * 0.025})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(CX, 740, 60 + r * 46 + Math.sin(t * 2 + r) * 6, 0, 7); ctx.stroke(); }
      for (let i = 0; i < 36; i++) { const an = i / 36 * 6.283 + t * 0.15; ctx.strokeStyle = 'rgba(255,200,170,0.35)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(CX + Math.cos(an) * 90, 740 + Math.sin(an) * 90); ctx.lineTo(CX + Math.cos(an) * 800, 740 + Math.sin(an) * 800); ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= wk; eye(CX, 740, lerp(520, 640, open), open, { look: Math.sin(t * 1.3) * 0.4 }); ctx.restore();
      txt('LA FOI', CX, 1210, { size: 72, color: C.ORANGE_L, alpha: wk * open, ls: 12 });
    }
  };

  // 6 · Élisée : même montagne, deux regards
  function mountain(alpha) {
    ctx.save(); ctx.globalAlpha *= alpha;
    const g = ctx.createLinearGradient(0, 420, 0, 1180); g.addColorStop(0, C.BLUE_M); g.addColorStop(1, C.NAVY);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(40, 1180); ctx.lineTo(540, 430); ctx.lineTo(1040, 1180); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.BLUE_L; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
  }
  SC.s6 = (t) => {
    const same = prog(t, 55.3, 56.0);
    ctx.fillStyle = C.NAVY; ctx.fillRect(0, 1180, W, 120);
    mountain(1);
    // calque « armée » (serviteur) : visible à gauche, s'efface quand on voit la même montagne
    const armyA = (1 - 0.55 * prog(t, 56.8, 58.0)) * E.out(prog(t, 49.7, 50.4));
    ctx.save(); ctx.globalAlpha *= armyA; ctx.beginPath(); ctx.rect(0, 0, lerp(CX, W, same), H); ctx.clip();
    for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
      const y = 1130 - r * 95, xs = 330 - r * 40 + c * 60 - 120 + (r % 2) * 30; if (xs > 700 && same < 1) continue;
      const x = xs + Math.sin(t * 2 + c + r) * 3; const y2 = y - (540 - Math.abs(x - 540)) * 0.0;
      ctx.fillStyle = C.RED; ctx.fillRect(x - 11, y2 - 40, 22, 40); ctx.beginPath(); ctx.arc(x, y2 - 50, 11, 0, 7); ctx.fill();
      ctx.fillRect(x + 12, y2 - 70, 4, 52);
    }
    ctx.restore();
    // calque « chars de feu » (Élisée)
    const fireA = E.out(prog(t, 52.2, 53.2));
    ctx.save(); ctx.globalAlpha *= fireA; ctx.beginPath(); ctx.rect(lerp(CX, 0, same), 0, W, H); ctx.clip();
    for (let i = 0; i < 5; i++) {
      const u = ((t * 0.18 + i * 0.2) % 1), x = lerp(780 + (i % 2) * 80, 520 + i * 25, u) + (i - 2) * 22, y = lerp(1140, 640, E.out(u)) - (i % 3) * 20;
      ctx.strokeStyle = C.ORANGE_L; ctx.lineWidth = 6; ctx.fillStyle = 'rgba(255,90,54,0.3)';
      ctx.beginPath(); ctx.arc(x, y, 26, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 70, y, 26, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x - 10, y - 62, 110, 44, 10); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = C.PEACH; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 20, y - 40); ctx.bezierCurveTo(x - 90, y - 70, x - 130, y - 20, x - 200, y - 50); ctx.stroke();
      glow(x + 40, y - 40, 120, 'rgba(255,138,107,0.5)', 0.8);
    }
    ctx.restore();
    // séparation
    const dv = (1 - same) * E.out(prog(t, 49.8, 50.4));
    if (dv > 0) { ctx.save(); ctx.globalAlpha *= dv; ctx.fillStyle = C.WHITE; ctx.fillRect(CX - 3, 380, 6, 880); ctx.restore(); }
    // personnages
    person(190, 1230, 1.1, { body: C.BLUE_L, alpha: E.out(prog(t, 49.6, 50.3)) });
    person(890, 1230, 1.1, { body: C.ORANGE, alpha: E.out(prog(t, 52.0, 52.7)) });
    txt('LE SERVITEUR', 190, 1330, { size: 28, ls: 4, color: C.BLUE_XL, alpha: E.out(prog(t, 49.8, 50.5)) });
    txt('ÉLISÉE', 890, 1330, { size: 28, ls: 4, color: C.ORANGE_L, alpha: E.out(prog(t, 52.2, 52.9)) });
    const l1 = E.out(prog(t, 50.0, 50.8)) * (1 - same);
    txt('ARMÉE ENNEMIE', 290, 360, { size: 40, ls: 3, color: C.RED, alpha: l1 });
    txt('CHARS DE FEU', 790, 360, { size: 40, ls: 3, color: C.ORANGE_L, alpha: E.out(prog(t, 52.6, 53.4)) * (1 - same) });
    const sm = E.back(prog(t, 55.35, 55.9)) * (1 - prog(t, 56.5, 56.9));
    if (sm > 0.01) { ctx.save(); ctx.translate(CX, 300); ctx.scale(sm, sm); txt('LA MÊME MONTAGNE', 0, 0, { size: 62, ls: 3 }); ctx.restore(); }
    // problème de vue : la lentille se pose sur le serviteur
    const pv = E.out(prog(t, 59.0, 59.7));
    if (pv > 0) {
      ctx.save(); ctx.globalAlpha *= pv; ctx.strokeStyle = C.ORANGE_L; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(190, 1040, 130 - (1 - pv) * -40, 0, 7); ctx.stroke(); ctx.restore();
      txt('UN PROBLÈME', CX, 280, { size: 56, ls: 4, color: C.GREY_L, alpha: pv });
      txt('DE VUE', CX, 380, { size: 130, color: C.ORANGE_L, alpha: pv, ls: 4 }); glow(CX, 380, 380, 'rgba(255,90,54,0.35)', pv);
    }
  };

  // 7 · Trop préoccupés par le visible ; Pierre et le vent
  function card(label, cy, t0, t1, t) {
    const k = E.out(prog(t, t0, t0 + 0.5)) * (1 - prog(t, t1, t1 + 0.5)); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * -120, 0);
    rr(CX - 400, cy - 70, 800, 140, 20, C.GREY, C.GREY_M, 3); txt(label, CX, cy + 2, { size: 54, color: C.GREY_L, ls: 5 }); ctx.restore();
  }
  SC.s7 = (t) => {
    const tk = E.out(prog(t, 60.9, 61.6)) * (1 - prog(t, 67.8, 68.3));
    txt('TROP PRÉOCCUPÉS', CX, 330, { size: 60, ls: 3, alpha: tk }); txt('PAR LE VISIBLE', CX, 420, { size: 76, color: C.GREY_L, ls: 3, alpha: tk });
    card('DIAGNOSTIC', 640, 64.35, 68.0, t); card('COMPTE EN BANQUE', 820, 65.15, 68.0, t); card('OPINION DES GENS', 1000, 66.4, 68.0, t);
    // Pierre sur l'eau
    const sk = prog(t, 68.0, 68.8); if (sk <= 0) return;
    const sink = E.inOut(prog(t, 71.8, 74.2)), vent = prog(t, 71.5, 72.2);
    ctx.save(); ctx.globalAlpha *= sk;
    const wave = (yy, amp, ph, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 1380); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, yy + Math.sin(x * 0.012 + t * 2 + ph) * amp * (1 + vent * 1.6)); ctx.lineTo(W, 1380); ctx.closePath(); ctx.fill(); };
    // Jésus : l'étoile fixe
    const star = (1 - prog(t, 71.5, 72.0)); const sx = 800, sy = 520;
    if (star > 0) { glow(sx, sy, 320, 'rgba(255,138,107,0.6)', star); ctx.save(); ctx.globalAlpha *= star; ctx.translate(sx, sy); ctx.rotate(t * 0.3); ctx.fillStyle = C.PEACH; for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(14, -14); ctx.lineTo(0, 0); ctx.lineTo(-14, -14); ctx.closePath(); ctx.fill(); } ctx.restore(); txt('JÉSUS', sx, sy + 130, { size: 30, ls: 6, color: C.PEACH, alpha: star }); }
    wave(1040, 14, 0, '#1B1A66');
    const px = lerp(240, 520, E.inOut(prog(t, 68.3, 71.5))) + (vent > 0 ? Math.sin(t * 14) * 5 * vent : 0);
    const py = 1030 + sink * 420 + Math.sin(t * 5) * 4 * (1 - sink);
    // pas de lumière sous ses pieds
    if (sink < 0.1) for (let i = 0; i < 5; i++) { const sxx = px - i * 90; ctx.fillStyle = `rgba(255,211,199,${0.7 - i * 0.14})`; ctx.beginPath(); ctx.ellipse(sxx, 1042, 40, 11, 0, 0, 7); ctx.fill(); }
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1040 + sink * 440); ctx.clip(); person(px, py, 1.7, { body: C.BLUE_L, lean: vent * 0.12 }); ctx.restore();
    wave(1066, 16, 2, 'rgba(25,0,207,0.55)'); wave(1140, 20, 4, '#14104A');
    for (let i = 0; i < 9 && vent > 0; i++) { const y = 700 + i * 70, x = ((t * 900 + i * 230) % 1500) - 200; ctx.strokeStyle = `rgba(169,162,255,${0.5 * vent})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W - x, y); ctx.lineTo(W - x - 160, y + 10); ctx.stroke(); }
    if (vent > 0) txt('LE VENT', 300, 460, { size: 86, ls: 6, color: C.GREY_L, alpha: vent });
    ctx.restore();
  };

  // 8 · Contrarier la tendance ; Naaman
  SC.s8 = (t) => {
    const flow = (1 - prog(t, 80.6, 81.4));
    const sk = E.out(prog(t, 75.1, 75.8));
    if (flow > 0) for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      const x = ((c * 240 + t * 160) % 1500) - 200, y = 420 + r * 190; ctx.save(); ctx.globalAlpha *= flow * sk * 0.65; ctx.strokeStyle = C.GREY_M; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(x, y - 50); ctx.lineTo(x + 50, y); ctx.lineTo(x, y + 50); ctx.stroke(); ctx.restore();
    }
    const ak = prog(t, 76.0, 77.6);
    if (ak > 0) {
      const x = lerp(1000, 150, E.inOut(ak)), y = 940; ctx.save(); ctx.globalAlpha *= 1 - prog(t, 80.6, 81.4) * 0.6; glow(x, y, 220, 'rgba(255,90,54,0.5)', 1);
      ctx.strokeStyle = C.ORANGE; ctx.fillStyle = C.ORANGE; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 220, y); ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 60, y); ctx.lineTo(x + 20, y - 70); ctx.lineTo(x + 20, y + 70); ctx.fill(); ctx.restore();
    }
    const t1 = E.out(prog(t, 76.4, 77.0)) * (1 - prog(t, 80.7, 81.3));
    txt('CONTRARIER', CX, 1090, { size: 98, color: C.ORANGE_L, alpha: t1, ls: 4 }); txt('LA TENDANCE', CX, 1190, { size: 84, alpha: t1, ls: 4 });
    // puissance intérieure
    const pk = E.out(prog(t, 77.6, 78.6)) * (1 - prog(t, 80.7, 81.3));
    if (pk > 0) { glow(CX, 570, 300 + Math.sin(t * 4) * 20, 'rgba(255,138,107,0.8)', pk); ctx.save(); ctx.globalAlpha *= pk; ctx.strokeStyle = C.PEACH; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(CX, 570, 90 + Math.sin(t * 4) * 8, 0, 7); ctx.stroke(); ctx.restore(); txt('PUISSANCE', CX, 360, { size: 58, ls: 6, alpha: pk, color: C.PEACH }); txt('INTÉRIEURE', CX, 790, { size: 58, ls: 6, alpha: pk, color: C.PEACH }); }
    // Naaman, lépreux
    const nk = E.out(prog(t, 81.8, 82.5)); const spots = Math.min(14, Math.floor(prog(t, 82.3, 83.8) * 14));
    if (nk > 0) {
      person(CX, 1060, 2.2, { body: C.BLUE_L, alpha: nk });
      for (let i = 0; i < spots; i++) { const a = hash(i) * 6.28, r = hash(i + 4) * 60; ctx.fillStyle = 'rgba(138,52,60,0.9)'; ctx.beginPath(); ctx.arc(CX + Math.cos(a) * r * 1.0, 1060 - 130 * 2.2 / 2 + Math.sin(a) * r * 2.0, 9 + hash(i + 8) * 9, 0, 7); ctx.fill(); }
      txt('NAAMAN', CX, 300, { size: 86, ls: 8, alpha: nk }); txt('LÉPREUX', CX, 390, { size: 54, ls: 8, color: C.GREY_L, alpha: nk * E.out(prog(t, 83.0, 83.6)) });
    }
  };

  // 9 · Naaman guéri ; les aveugles de Jéricho
  SC.s9 = (t) => {
    // a) Naaman : il se lève, la peau redevient celle d'un enfant
    const pa = 1 - prog(t, 88.7, 89.2);
    if (pa > 0) {
      const rise = E.out(prog(t, 84.4, 85.4)), heal = prog(t, 86.4, 88.4), child = E.inOut(prog(t, 87.6, 88.6));
      ctx.save(); ctx.globalAlpha *= pa;
      const s = lerp(2.2, 1.45, child); const lean = (1 - rise) * 0.45;
      glow(CX, 1060 - 150 * s / 2, 420 * heal + 1, 'rgba(255,211,199,0.8)', heal);
      person(CX, 1060, s, { body: C.BLUE_L, lean });
      const spots = Math.floor(14 * (1 - E.out(heal)));
      for (let i = 0; i < spots; i++) { const a = hash(i) * 6.28, r = hash(i + 4) * 60; ctx.fillStyle = 'rgba(138,52,60,0.9)'; ctx.beginPath(); ctx.arc(CX + Math.cos(a) * r * (s / 2.2), 1060 - 130 * s / 2 + Math.sin(a) * r * (s / 1.1), 9 + hash(i + 8) * 9, 0, 7); ctx.fill(); }
      txt('NAAMAN', CX, 300, { size: 86, ls: 8 }); txt(heal > 0.6 ? 'COMME UN ENFANT' : 'IL OBÉIT', CX, 390, { size: 54, ls: 8, color: C.ORANGE_L });
      ctx.restore();
    }
    // b) les deux aveugles de Jéricho
    const pb = E.out(prog(t, 89.0, 89.7)); if (pb <= 0) return;
    ctx.save(); ctx.globalAlpha *= pb;
    txt('JÉRICHO', CX, 300, { size: 86, ls: 8 }); txt('AU BORD DU CHEMIN', CX, 390, { size: 46, ls: 6, color: C.GREY_L });
    ctx.fillStyle = C.NAVY; ctx.fillRect(0, 1140, W, 80); ctx.strokeStyle = C.GREY_M; ctx.lineWidth = 4; ctx.setLineDash([40, 30]); ctx.beginPath(); ctx.moveTo(0, 1180); ctx.lineTo(W, 1180); ctx.stroke(); ctx.setLineDash([]);
    const cry = prog(t, 96.4, 98.9), openK = E.out(prog(t, 97.5, 98.2));
    const blind = [[270, 1160], [810, 1160]];
    // la foule (points gris) avance puis est repoussée par les cris
    const crowd = prog(t, 94.7, 96.3) * (1 - E.out(prog(t, 96.4, 97.4)) * 1.0);
    for (let i = 0; i < 34; i++) { const side = i % 2 ? 1 : -1; const dist = lerp(520, 150 + (i % 7) * 18, crowd) ; const x = CX + side * (60 + dist - (i % 5) * 26), y = 1180 - (i % 4) * 28; ctx.fillStyle = C.GREY_M; ctx.beginPath(); ctx.arc(x, y - 96, 22, 0, 7); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 22, y - 74, 44, 74, [16, 16, 4, 4]); ctx.fill(); }
    for (const [x, y] of blind) {
      person(x, y, 1.9, { body: C.BLUE_L });
      // yeux fermés → ouverts
      ctx.strokeStyle = C.NIGHT; ctx.lineWidth = 6; if (openK < 0.1) { ctx.beginPath(); ctx.moveTo(x - 20, y - 362); ctx.lineTo(x + 20, y - 362); ctx.stroke(); }
      for (let r = 0; r < 4; r++) { const rk = (cry * 3 + r * 0.25) % 1; if (cry > 0 && cry < 1.0) { ctx.strokeStyle = `rgba(255,138,107,${0.7 * (1 - rk)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y - 340, 40 + rk * 420, 0, 7); ctx.stroke(); } }
    }
    if (openK > 0) { glow(CX, 520, 700 * openK, 'rgba(255,138,107,0.5)', 1 - prog(t, 98.5, 99.4)); eye(CX - 190, 520, 330, openK, {}); eye(CX + 190, 520, 330, openK, {}); }
    ctx.restore();
  };

  // 10 · C'est comme ça → Ce n'est pas fini
  SC.s10 = (t) => {
    const k1 = E.out(prog(t, 99.5, 100.0)), strike = E.out(prog(t, 101.55, 101.85)), k2 = E.back(prog(t, 101.7, 102.3));
    if (strike < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - prog(t, 101.8, 102.0);
      txt("C'EST", CX, 480, { size: 190, color: C.GREY_L, alpha: k1, ls: 4 }); txt('COMME', CX, 680, { size: 190, color: C.GREY_L, alpha: k1, ls: 4 }); txt('ÇA', CX, 880, { size: 190, color: C.GREY_L, alpha: k1, ls: 4 });
      ctx.restore();
    }
    if (strike > 0 && strike < 1) { ctx.save(); ctx.fillStyle = C.ORANGE; ctx.shadowColor = C.ORANGE; ctx.shadowBlur = 50; ctx.fillRect(-20, 640 - 18, (W + 40) * strike, 36); ctx.restore(); }
    if (k2 > 0) {
      glow(CX, 700, 700, 'rgba(255,90,54,0.35)', k2); ctx.save(); ctx.translate(CX, 0); ctx.scale(0.8 + 0.2 * k2, 0.8 + 0.2 * k2);
      txt("CE N'EST", 0, 560 / (0.8 + 0.2 * k2), { size: 170, color: C.WHITE, ls: 3, alpha: clamp(k2) }); txt('PAS FINI', 0, 790 / (0.8 + 0.2 * k2), { size: 200, color: C.ORANGE_L, ls: 3, alpha: clamp(k2) }); ctx.restore();
    }
  };

  // 11 · Les 7 canaux ; la rediffusion ; dimanche prochain
  SC.s11 = (t) => {
    const a = (1 - prog(t, 108.2, 108.8));
    if (a > 0) {
      const k = E.out(prog(t, 104.3, 105.2)) * a, split = E.inOut(prog(t, 105.4, 106.6));
      ctx.save(); ctx.globalAlpha *= k;
      txt('7', CX, 600 - split * 60, { size: 900, weight: 900, color: 'rgba(0,0,0,0)', alpha: 1 - split }); outline('7', CX, 600 - split * 60, { size: 900, lw: 6, color: C.BLUE_XL, alpha: 1 - split });
      for (let i = 0; i < 7; i++) {
        const x = lerp(CX, 150 + i * 130, split), on = clamp((t - (106.0 + i * 0.27)) * 4);
        ctx.strokeStyle = on > 0 ? C.ORANGE_L : C.GREY_M; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.globalAlpha = k * split; ctx.beginPath(); ctx.moveTo(x, 420); ctx.lineTo(x, 960); ctx.stroke();
        if (on > 0) for (let j = 0; j < 5; j++) { const yy = 420 + ((t * 420 + j * 120 + i * 60) % 540); glow(x, yy, 50, 'rgba(255,200,170,0.9)', on); }
      }
      ctx.globalAlpha = k * split; person(CX, 1290, 1.2, { body: C.BLUE_L }); ctx.restore();
      txt('7 CANAUX', CX, 300, { size: 80, ls: 10, color: C.PEACH, alpha: k * split });
    }
    // rediffusion YouTube
    const b = E.out(prog(t, 108.7, 109.5)) * (1 - prog(t, 115.6, 116.1));
    if (b > 0) {
      ctx.save(); ctx.globalAlpha *= b; ctx.translate(0, (1 - b) * 60);
      rr(CX - 400, 380, 800, 460, 28, C.NAVY, C.BLUE_L, 4);
      const pulse = 1 + Math.sin(t * 5) * 0.04; ctx.save(); ctx.translate(CX, 610); ctx.scale(pulse, pulse);
      rr(-120, -80, 240, 160, 36, C.ORANGE); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-26, -42); ctx.lineTo(48, 0); ctx.lineTo(-26, 42); ctx.closePath(); ctx.fill(); ctx.restore();
      txt('REDIFFUSION DU CULTE', CX, 760, { size: 40, ls: 4 });
      txt('CHAÎNE YOUTUBE', CX, 960, { size: 76, color: C.ORANGE_L, ls: 3, alpha: E.out(prog(t, 111.3, 112.0)) });
      const lk = E.back(prog(t, 114.4, 115.0)); ctx.save(); ctx.translate(CX, 1130); ctx.scale(lk, lk);
      rr(-340, -60, 680, 120, 60, C.BLUE_M); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-310, -26, 76, 52, 12); ctx.fill(); ctx.beginPath(); ctx.moveTo(-290, 26); ctx.lineTo(-300, 46); ctx.lineTo(-270, 26); ctx.fill();
      txt('LIEN EN COMMENTAIRE', 40, 2, { size: 38, ls: 3 }); ctx.restore();
      ctx.restore();
    }
    // dimanche prochain
    const d = E.out(prog(t, 116.0, 116.7));
    if (d > 0) {
      ctx.save(); ctx.globalAlpha *= d * (1 - prog(t, 120.4, 120.9));
      txt('DIMANCHE', CX, 380, { size: 130, ls: 4 }); txt('PROCHAIN', CX, 520, { size: 130, color: C.ORANGE_L, ls: 4 });
      txt('APÔTRE AMOS', CX, 650, { size: 44, ls: 8, color: C.PEACH });
      const door = E.inOut(prog(t, 118.6, 120.0));
      const dx = CX - 130, dy = 760, dw = 260, dh = 420;
      glow(CX, dy + dh / 2, 420 * door + 1, 'rgba(255,200,170,0.9)', door);
      ctx.fillStyle = '#FFE9D8'; ctx.beginPath(); ctx.roundRect(dx, dy, dw, dh, [130, 130, 0, 0]); ctx.globalAlpha *= clamp(door * 3); ctx.fill(); ctx.globalAlpha /= clamp(door * 3) || 1;
      ctx.strokeStyle = C.BLUE_XL; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(dx, dy, dw, dh, [130, 130, 0, 0]); ctx.stroke();
      ctx.fillStyle = C.BLUE_M; ctx.beginPath(); ctx.moveTo(dx, dy + 120); ctx.quadraticCurveTo(dx + 130 * (1 - door), dy + 20, dx + 130 * (1 - door), dy + 20); ctx.lineTo(dx + dw * (1 - door) * 0.5, dy + dh); ctx.lineTo(dx, dy + dh); ctx.closePath();
      ctx.fillStyle = C.BLUE_M; ctx.globalAlpha *= 1; ctx.beginPath(); ctx.roundRect(dx, dy, dw * (1 - door * 0.82), dh, [130 * (1 - door * 0.5), 0, 0, 0]); ctx.fill();
      txt('LE SURNATUREL', CX, 1300, { size: 52, ls: 6, alpha: E.out(prog(t, 118.0, 118.8)) });
      ctx.restore();
    }
  };

  // 12 · Viens le vivre ; carte finale
  SC.s12 = (t) => {
    const up = E.out(prog(t, 120.9, 122.0));
    const fade = 1 - prog(t, 122.7, 123.1);
    ctx.save(); ctx.globalAlpha *= fade;
    txt('VIENS', CX, 720 + (1 - up) * 90, { size: 200, alpha: up, ls: 6 });
    txt('LE VIVRE', CX, 930 + (1 - up) * 90, { size: 190, color: C.ORANGE_L, alpha: up, ls: 4 });
    glow(CX, 930, 600, 'rgba(255,90,54,0.35)', up);
    const ls = E.out(prog(t, 122.9, 123.7));
    if (ls > 0) symbol(CX, 640, lerp(430, 1100, ls), { spread: 0, alpha: 1 - ls * 0.3 });
    ctx.restore();
    // carte finale : le rideau Chaux s'ouvre depuis le centre
    const wipe = E.inOut(prog(t, 123.5, 124.4));
    if (wipe > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(CX, 780, wipe * 1500, 0, 7); ctx.clip(); ctx.fillStyle = C.PAPER; ctx.fillRect(0, 0, W, H);
      const lk = E.out(prog(t, 124.1, 124.9)); const sw = 860, sh = sw * (1010 / 990);
      if (window.LOGO) ctx.drawImage(window.LOGO, 940, 340, 990, 1010, CX - sw / 2, 720 - sh / 2 + (1 - lk) * 30, sw, sh);
      ctx.globalAlpha = lk; txt('SIKÈCODJI', CX, 1215, { size: 60, color: C.BLUE, ls: 18 });
      ctx.fillStyle = C.ORANGE; ctx.fillRect(CX - 60, 1275, 120, 10);
      ctx.restore();
    }
  };

  // ---------- chronologie des scènes ----------
  const SCENES = [
    ['s1', 0, 8.2], ['s2', 8.2, 15.45], ['s3', 15.45, 23.95], ['s4', 23.95, 35.8], ['s5', 35.8, 49.25], ['s6', 49.25, 60.55],
    ['s7', 60.55, 74.95], ['s8', 74.95, 84.2], ['s9', 84.2, 99.2], ['s10', 99.2, 104.0], ['s11', 104.0, 120.65], ['s12', 120.65, 125.8],
  ];
  function drawFrame(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; background(t);
    for (const [name, a, b] of SCENES) {
      if (t < a - 0.25 || t > b + 0.25) continue;
      const al = clamp((t - (a - 0.25)) / 0.4) * (name === 's12' ? 1 : clamp(((b + 0.25) - t) / 0.4));
      ctx.save(); ctx.globalAlpha = al; SC[name](t); ctx.restore();
    }
    ctx.globalAlpha = 1; captions(t);
  }

  window.ready = (async () => {
    const c = document.getElementById('c'); c.width = W; c.height = H; ctx = c.getContext('2d');
    await Promise.all([500, 700, 800, 900].map(w => document.fonts.load(`${w} 40px Montserrat`)));
    await new Promise(r => { const im = new Image(); im.onload = () => { window.LOGO = im; r(); }; im.onerror = r; im.src = 'assets/zone242_logo.png'; });
    buildCaptions(); drawFrame(0);
  })();
  window.render = t => { drawFrame(t); };
})();
