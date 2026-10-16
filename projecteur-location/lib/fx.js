// Outils partagés par les scènes : PRNG déterministe, découpe typographique, icônes, particules.
// Tout est fonction du temps HyperFrames (aucune horloge, aucun Math.random).
(function () {
  const FX = {};

  // PRNG déterministe (mulberry32)
  FX.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  FX.$ = (sel, root = document) => root.querySelector(sel);
  FX.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // découpe un élément en lettres (span.ch inline-block), les espaces restent insécables
  // (le dégradé doré passe sur chaque lettre : background-clip:text ne suit pas les enfants transformés)
  FX.chars = function (el) {
    const gold = el.classList.contains('goldfx');
    if (gold) el.classList.remove('goldfx');
    const text = el.textContent;
    el.textContent = '';
    const out = [];
    for (const c of text) {
      const s = document.createElement('span');
      s.className = gold ? 'ch goldfx' : 'ch';
      s.textContent = c === ' ' ? ' ' : c;
      el.appendChild(s);
      out.push(s);
    }
    return out;
  };
  // découpe en mots, chaque mot dans un masque (révélation par le bas)
  FX.words = function (el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    return words.map((w, i) => {
      const m = document.createElement('span'); m.className = 'wmask';
      const s = document.createElement('span'); s.className = 'w'; s.textContent = w;
      m.appendChild(s); el.appendChild(m);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });
  };

  // ---------- icônes vectorielles (traits 24×24, d'après Lucide — licence ISC) ----------
  FX.ICON = {
    clapper: 'M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z M6.2 5.3l3.1 3.9 M12.4 3.4l3.1 4 M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
    ball: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Z M12 7.5l4.3 3.1-1.6 5H9.3l-1.6-5Z M12 7.5V2.2 M16.3 10.6l5.1-1.6 M14.7 15.6l3.1 4.3 M9.3 15.6l-3.1 4.3 M7.7 10.6L2.6 9',
    gamepad: 'M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5Z M6 11h4 M8 9v4 M15 12h.01 M18 10h.01',
    board: 'M2 3h20 M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3 M7 21l5-5 5 5 M8 12V9 M12 12V7 M16 12v-2',
    fullhd: 'M2 5h20v14H2Z M6 9v6 M6 12h4 M10 9v6 M13 9v6h2a3 3 0 0 0 0-6Z',
    screen: 'M2 4h20v13H2Z M8 21h8 M12 17v4 M7 13.5l10-6 M7 13.5h3.2 M7 13.5l1.6-2.8 M17 7.5h-3.2 M17 7.5l-1.6 2.8',
    trapeze: 'M5 6h14l-3 12H8Z',
    rect: 'M4 6h16v12H4Z',
    speaker: 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298Z',
    wave1: 'M15 9a4.5 4.5 0 0 1 0 6',
    wave2: 'M18 6.5a8.5 8.5 0 0 1 0 11',
    wave3: 'M21 4a12.5 12.5 0 0 1 0 16',
    wifi0: 'M12 20h.01', wifi1: 'M8.5 16.429a5 5 0 0 1 7 0', wifi2: 'M5 12.859a10 10 0 0 1 14 0', wifi3: 'M2 8.82a15 15 0 0 1 20 0',
    bluetooth: 'M7 7l10 10-5 5V2l5 5L7 17',
    hdmi: 'M2 8h9v3l-1.5 1.5h-6L2 11Z', usb: 'M13 8h8v4.5h-8Z M15 9.8h1.2 M17.8 9.8H19', jack: 'M12 15.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5Z M12 18h.01',
    truck: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2 M15 18H9 M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14 M17 16a2 2 0 1 0 0 4a2 2 0 1 0 0-4Z M7 16a2 2 0 1 0 0 4a2 2 0 1 0 0-4Z',
    pin: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0 M12 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z',
    calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3'
  };
  FX.svgIcon = function (d, cls = '', stroke = 'currentColor', sw = 1.7) {
    return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  };
  // pictogramme type WhatsApp (bulle + combiné), dessiné ici
  FX.WA = '<svg class="wa" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#25D366"/>' +
    '<path d="M50 22a27 27 0 0 0-23.3 40.6L23 77l14.8-3.7A27 27 0 1 0 50 22Z" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>' +
    '<path d="M40.5 36.5c-1.2 0-2.6 1.5-2.6 4 0 6.5 8.4 15.8 15.6 18.4 3.2 1.2 5.6.3 6.4-1.6l.8-2.2c.3-.8-.1-1.5-.8-1.9l-4.9-2.4c-.7-.3-1.4-.1-1.8.5l-1.7 2.2c-3.4-1.3-6.6-4.4-8-7.8l2.2-1.7c.6-.5.8-1.2.5-1.9l-2.3-5c-.3-.7-1-1.1-1.8-.9Z" fill="#fff"/></svg>';

  // ---------- particules (deux calques canvas, dessin = fonction pure de t) ----------
  FX.particles = function (backCanvas, frontCanvas, S) {
    const W = S.W, H = S.H;
    const r = FX.rng(2401);
    const dust = Array.from({ length: 110 }, () => ({
      x: r() * W, y: r() * H, z: 0.25 + r() * 0.75, s: 0.6 + r() * 2.2, ph: r() * 6.283, gold: r() < 0.55, tw: 0.5 + r() * 1.5
    }));
    // éclats : un jeu de particules par impact
    const bursts = [];
    const addBurst = (t, x, y, n, speed, seed, life = 1.6, gold = 0.8) => {
      const rr = FX.rng(seed);
      for (let i = 0; i < n; i++) {
        const a = rr() * 6.283, v = speed * (0.25 + rr() * 0.75);
        bursts.push({ t, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.15, s: 1 + rr() * 3.2, life: life * (0.5 + rr() * 0.5), gold: rr() < gold });
      }
    };
    const e = S.ev;
    addBurst(e.hook.open, 540, 1200, 70, 900, 11);
    addBurst(e.product.flare, 0, 0, 0, 0, 12);
    addBurst(e.price.drop, 540, 900, 140, 1300, 13, 1.8, 0.9);
    addBurst(e.delivery.pin, 800, 840, 40, 520, 14, 1.2);
    addBurst(e.cta.number, 540, 1240, 60, 700, 15, 1.4);
    // la ligne d'ouverture laisse une traînée d'étincelles
    const sparks = Array.from({ length: 60 }, (_, i) => {
      const k = i / 60, rr = FX.rng(300 + i);
      return { k, vx: (rr() - 0.5) * 140, vy: -40 - rr() * 160, s: 1 + rr() * 2.5, life: 0.6 + rr() * 0.6 };
    });
    const ctxB = backCanvas.getContext('2d'), ctxF = frontCanvas.getContext('2d');
    const GOLD = '255,196,40', WHITE = '235,242,255';
    // densité de poussière par moment du film
    const dens = (t) => (t < 1 ? 0.25 : t < S.S.price[0] ? 0.8 : t < S.S.price[1] ? 1 : 0.8);
    function lineY(x) { return 980 - (x - 540) * 0.12; } // la ligne d'ouverture est légèrement inclinée
    FX.lineY = lineY;
    return function draw(t) {
      ctxB.clearRect(0, 0, W, H); ctxF.clearRect(0, 0, W, H);
      // poussière lumineuse qui monte (parallaxe : les plus proches montent plus vite)
      const d = dens(t);
      for (const p of dust) {
        const y = ((p.y - t * 38 * p.z) % H + H) % H;
        const x = p.x + Math.sin(t * 0.6 * p.tw + p.ph) * 14 * p.z;
        const a = (0.18 + 0.5 * p.z) * (0.6 + 0.4 * Math.sin(t * 2.2 * p.tw + p.ph)) * d;
        ctxB.fillStyle = `rgba(${p.gold ? GOLD : WHITE},${a.toFixed(3)})`;
        ctxB.beginPath(); ctxB.arc(x, y, p.s * p.z, 0, 6.283); ctxB.fill();
      }
      // étincelles de la ligne (0,15 – 1,6 s)
      const l0 = e.hook.line, l1 = e.hook.lineEnd;
      for (const s of sparks) {
        const born = l0 + s.k * (l1 - l0), age = t - born;
        if (age < 0 || age > s.life) continue;
        const x0 = -60 + s.k * (W + 120), y0 = lineY(x0);
        const x = x0 + s.vx * age, y = y0 + s.vy * age + 260 * age * age;
        const a = 1 - age / s.life;
        ctxF.fillStyle = `rgba(${GOLD},${(a * 0.95).toFixed(3)})`;
        ctxF.beginPath(); ctxF.arc(x, y, s.s * (0.5 + a * 0.5), 0, 6.283); ctxF.fill();
      }
      // éclats
      ctxF.globalCompositeOperation = 'lighter';
      for (const b of bursts) {
        const age = t - b.t;
        if (age < 0 || age > b.life) continue;
        const k = age / b.life, drag = (1 - Math.exp(-age * 2.4)) / 2.4;
        const x = b.x + b.vx * drag, y = b.y + b.vy * drag + 120 * age * age;
        const a = (1 - k) * (1 - k);
        ctxF.fillStyle = `rgba(${b.gold ? GOLD : WHITE},${(a * 0.9).toFixed(3)})`;
        ctxF.beginPath(); ctxF.arc(x, y, b.s * (1 - k * 0.5), 0, 6.283); ctxF.fill();
      }
      ctxF.globalCompositeOperation = 'source-over';
    };
  };

  window.FX = FX;
})();
