// Assemble le film : remplit les scènes, construit LA timeline GSAP (une seule, en pause) et
// les éléments partagés (fond en parallaxe, caméra 2D, projecteur, transitions, flash, particules).
(function () {
  const S = window.SCORE, ev = S.ev, FX = window.FX, $ = FX.$;
  gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, CustomEase);

  // ---------- textes commerciaux (variables HyperFrames) ----------
  const hf = window.__hyperframes;
  const vars = (hf && typeof hf.getVariables === 'function' && hf.getVariables()) || {};
  const V = {
    prix: vars.prix || '5 000', devise: vars.devise || 'FCFA', telephone: vars.telephone || '0167326082',
    ville: vars.ville || 'COTONOU, BÉNIN', livraison: vars.livraison || 'LIVRAISON POSSIBLE'
  };
  // chaque scène injecte son HTML dans sa section (ou dans un conteneur d'une scène précédente : `into`)
  // (html peut aussi rendre { sélecteur: html } pour remplir plusieurs calques d'une scène partagée)
  for (const sc of window.SCENES) {
    const out = sc.html(V, FX);
    if (typeof out === 'string') document.querySelector(sc.into || '#' + sc.id).insertAdjacentHTML('beforeend', out);
    else for (const [sel, h] of Object.entries(out)) document.querySelector(sel).insertAdjacentHTML('beforeend', h);
  }

  // ---------- fond : grille et traînées lumineuses ----------
  (function buildBackground() {
    let g = '';
    for (let x = 0; x <= 1320; x += 66) g += `<line x1="${x}" y1="0" x2="${x}" y2="2160" stroke="rgba(120,160,255,0.07)" stroke-width="1.2"/>`;
    for (let y = 0; y <= 2160; y += 66) g += `<line x1="0" y1="${y}" x2="1320" y2="${y}" stroke="rgba(120,160,255,0.07)" stroke-width="1.2"/>`;
    const r = FX.rng(77);
    for (let x = 0; x <= 1320; x += 132) for (let y = 0; y <= 2160; y += 132) if (r() < 0.35) g += `<circle cx="${x}" cy="${y}" r="2.6" fill="rgba(255,191,31,0.35)"/>`;
    $('#bg-grid').innerHTML = g;
    let s = '<defs><linearGradient id="stk" x1="0" x2="1"><stop offset="0" stop-color="#ffbf1f" stop-opacity="0"/><stop offset=".5" stop-color="#ffd76a" stop-opacity=".55"/><stop offset="1" stop-color="#ffbf1f" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="stkb" x1="0" x2="1"><stop offset="0" stop-color="#4aa0ff" stop-opacity="0"/><stop offset=".5" stop-color="#7cc0ff" stop-opacity=".45"/><stop offset="1" stop-color="#4aa0ff" stop-opacity="0"/></linearGradient></defs>';
    for (let i = 0; i < 9; i++) {
      const y = 200 + i * 250 + r() * 80, h = 2 + r() * 5;
      s += `<rect x="0" y="${y.toFixed(0)}" width="1900" height="${h.toFixed(1)}" fill="url(#${i % 3 ? 'stk' : 'stkb'})" transform="rotate(-24 950 ${y.toFixed(0)})" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`;
    }
    $('#bg-streaks').innerHTML = s;
    // contour lumineux du projecteur (S2)
    const d = window.PROJECTOR.outline;
    $('#hero-outline').innerHTML = `<path id="ol-glow" d="${d}" stroke="#ffbf1f" stroke-width="16" opacity=".45" style="filter:blur(6px)"/>` +
      `<path id="ol-core" d="${d}" stroke="#fff1b8" stroke-width="4.5"/>` +
      `<path id="ol-comet" d="${d}" stroke="#ffffff" stroke-width="9" style="filter:drop-shadow(0 0 10px #ffd34d)"/>`;
    // transitions
    $('#tr').innerHTML =
      '<div class="bar" id="tr-b1" style="top:520px;background:linear-gradient(90deg,#e88f00,#ffbf1f 40%,#ffe37a)"></div>' +
      '<div class="bar" id="tr-b2" style="top:850px;background:linear-gradient(90deg,#0b2048,#163a74)"></div>' +
      '<div class="bar" id="tr-b3" style="top:1180px;background:linear-gradient(90deg,#ffe37a,#ffbf1f 60%,#e88f00)"></div>' +
      '<div id="sweep-line"></div>' +
      [0, 1, 2, 3].map((i) => `<div class="band ${i % 2 ? 'r' : 'l'}" id="tr-band${i}" style="top:${i * 480}px"></div>`).join('') +
      '<div id="iris-ring"><div></div></div><div id="split-line"></div>';
  })();

  async function build() {
    const fonts = ['500 80px Oswald', '600 80px Oswald', '700 80px Oswald', '500 40px Montserrat', '600 40px Montserrat', '700 40px Montserrat', '800 40px Montserrat', '900 40px Montserrat'];
    await Promise.all(fonts.map((f) => document.fonts.load(f, 'ÉÀÇ0123456789AZaz?')));
    // les photos (s'il y en a) doivent être décodées avant de construire
    await Promise.all(FX.$$('img').map((im) => (im.decode ? im.decode().catch(() => null) : null)));

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', immediateRender: false } });
    const A = {
      S, ev, V, FX, tl,
      // éclair lumineux plein cadre
      flash(t, a = 0.8, d = 0.5) { tl.fromTo('#flash', { opacity: a }, { opacity: 0, duration: d, ease: 'power2.out' }, t); },
      // révélation d'une ligne masquée (le span monte dans son masque)
      lineIn(el, t, d = 0.6, ease = 'expo.out') { tl.fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: d, ease }, t); },
      lineOut(el, t, d = 0.35, ease = 'power3.in') { tl.fromTo(el, { yPercent: 0 }, { yPercent: -115, duration: d, ease }, t); },
      // caméra 2D : #cam porte les mouvements lents, #cam2 les impacts (deux calques -> pas de conflit)
      cam(t0, t1, from, to, ease = 'sine.inOut') { tl.fromTo('#cam', from, { ...to, duration: t1 - t0, ease }, t0); },
      punch(t, amt = 0.03, d = 0.45, ease = 'power3.out') { tl.fromTo('#cam2', { scale: 1 + amt }, { scale: 1, duration: d, ease }, t); },
      shake(t, amp = 10, n = 6, step = 0.035) {
        const r = FX.rng(Math.round(t * 1000));
        for (let i = 0; i < n; i++) {
          const k = 1 - i / n;
          tl.to('#cam2', { x: (r() - 0.5) * 2 * amp * k, y: (r() - 0.5) * 2 * amp * k, duration: step, ease: 'none' }, t + i * step);
        }
        tl.to('#cam2', { x: 0, y: 0, duration: step, ease: 'none' }, t + n * step);
      },
      // flou de mouvement directionnel (filtre SVG partagé, une utilisation à la fois)
      mblur(sel, filterId, t, dur, amount) {
        const fe = `#${filterId} feGaussianBlur`;
        tl.set(sel, { filter: `url(#${filterId})` }, t);
        tl.fromTo(fe, { attr: { stdDeviation: filterId === 'mbx' ? `${amount} 0` : `0 ${amount}` } }, { attr: { stdDeviation: '0 0' }, duration: dur, ease: 'power2.out' }, t);
        tl.set(sel, { filter: 'none' }, t + dur + 0.01);
      },
    };
    tl.set('#flash', { opacity: 0 }, 0);
    tl.set(['#cam', '#cam2'], { scale: 1, x: 0, y: 0, rotation: 0, transformOrigin: '540px 960px' }, 0);

    // ---------- fond en parallaxe multicouche ----------
    tl.fromTo('#bg-grid', { y: 0 }, { y: -264, duration: S.DURATION, ease: 'none' }, 0);
    tl.fromTo('#bg-streaks', { x: -160 }, { x: 160, duration: S.DURATION, ease: 'none' }, 0);
    tl.fromTo('#bg-glow-a', { x: 0, y: 0 }, { x: 420, y: 520, duration: S.DURATION, ease: 'sine.inOut' }, 0);
    tl.fromTo('#bg-glow-b', { x: 0, y: 0 }, { x: -480, y: -640, duration: S.DURATION, ease: 'sine.inOut' }, 0);
    tl.fromTo('#bg', { opacity: 0.25 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, ev.hook.open);
    const bgcam = [[0, 1.0], [S.S.product[0], 1.07], [S.S.usages[0], 1.0], [S.S.streaming[0], 1.05], [S.S.features[0], 1.0], [S.S.price[0], 1.06], [S.S.delivery[0], 1.0], [S.S.cta[0], 1.04], [S.DURATION, 1.0]];
    for (let i = 0; i < bgcam.length - 1; i++) tl.fromTo('#bg', { scale: bgcam[i][1] }, { scale: bgcam[i + 1][1], duration: bgcam[i + 1][0] - bgcam[i][0], ease: 'sine.inOut' }, bgcam[i][0]);

    // ---------- caméra 2D (le contenu bouge plus vite que le fond -> profondeur) ----------
    buildCamera(A);
    // ---------- le projecteur ----------
    buildHero(A);
    // ---------- transitions entre scènes ----------
    buildTransitions(A);
    // ---------- scènes ----------
    for (const sc of window.SCENES) sc.build(tl, A);

    // ---------- particules (dessin = fonction pure du temps) ----------
    const draw = FX.particles($('#fx-back'), $('#fx-front'), S);
    const proxy = { t: 0 };
    tl.fromTo(proxy, { t: 0 }, { t: S.DURATION, duration: S.DURATION, ease: 'none', onUpdate: () => draw(proxy.t) }, 0);
    window.addEventListener('hf-seek', (e) => draw(Number(e.detail && e.detail.time) || 0));
    draw(0);

    return { tl }; // (une timeline GSAP est « thenable » : la renvoyer nue bloquerait la promesse)
  }

  // ======================================================================
  function buildCamera(A) {
    const { S, ev } = A, P = S.S;
    // mouvements lents, sans chevauchement sur #cam
    A.cam(0, ev.hook.open, { scale: 1.12 }, { scale: 1.12 }, 'none');
    A.cam(ev.hook.open, ev.hook.open + 1.3, { scale: 1.12 }, { scale: 1.0 }, 'expo.out');
    A.cam(ev.hook.open + 1.3, P.product[0] - 0.3, { scale: 1.0, y: 0 }, { scale: 1.045, y: -10 });
    A.cam(P.product[0] - 0.3, P.product[0] + 0.3, { scale: 1.045, y: -10 }, { scale: 1.0, y: 0 }, 'power3.inOut');
    A.cam(P.product[0] + 0.3, P.usages[0] - 0.25, { scale: 1.0 }, { scale: 1.05 });
    A.cam(P.usages[0] - 0.25, P.usages[0] + 0.35, { scale: 1.05 }, { scale: 1.0 }, 'power3.inOut');
    ev.usages.cuts.forEach((c, i) => {
      const xi = i % 2 ? 8 : -8, xp = (i - 1) % 2 ? 8 : -8;
      if (i > 0) A.cam(c, c + 0.35, { scale: 1.03, x: xp }, { scale: 1.0, x: 0 }, 'power3.out');
      A.cam(c + 0.35, c + 2, { scale: 1.0, x: 0 }, { scale: 1.03, x: xi });
    });
    A.cam(P.streaming[0], P.streaming[0] + 0.3, { scale: 1.03, x: 8 }, { scale: 1.0, x: 0 }, 'power3.out');
    A.cam(P.streaming[0] + 0.3, ev.streaming.click, { scale: 1.0 }, { scale: 1.04 });
    A.cam(ev.streaming.click, P.phone[0], { scale: 1.04 }, { scale: 1.0 }, 'power2.out');
    A.cam(P.phone[0], P.features[0] - 0.2, { scale: 1.0, rotation: 0 }, { scale: 1.035, rotation: -0.6 });
    A.cam(P.features[0] - 0.2, P.features[0] + 0.4, { scale: 1.035, rotation: -0.6 }, { scale: 1.0, rotation: 0 }, 'power3.inOut');
    A.cam(P.features[0] + 0.4, P.price[0] - 0.3, { scale: 1.0, y: 0 }, { scale: 1.02, y: -14 });
    A.cam(P.price[0] - 0.3, ev.price.countFrom, { scale: 1.02, y: -14 }, { scale: 1.0, y: 0 }, 'power3.inOut');
    A.cam(ev.price.countFrom, ev.price.drop, { scale: 1.0 }, { scale: 1.07 }, 'power2.in');
    A.cam(ev.price.drop, P.delivery[0], { scale: 1.07 }, { scale: 1.0 }, 'expo.out');
    A.cam(P.delivery[0], P.cta[0] - 0.2, { scale: 1.0 }, { scale: 1.04 });
    A.cam(P.cta[0] - 0.2, ev.cta.stable, { scale: 1.04 }, { scale: 1.0 }, 'expo.out');
    // impacts sur #cam2
    A.punch(ev.hook.open, 0.06, 0.6);
    ev.hook.words.slice(0, 4).forEach((t) => A.punch(t, 0.014, 0.3));
    A.punch(ev.hook.words[4], 0.035, 0.5);
    A.punch(ev.product.flare, 0.02, 0.4);
    ev.usages.cuts.forEach((c) => A.punch(c, 0.025, 0.4));
    A.punch(ev.usages.goal, 0.02, 0.35);
    A.punch(ev.streaming.click, 0.035, 0.45);
    A.punch(ev.phone.land, 0.04, 0.5);
    A.punch(ev.price.drop, 0.09, 0.9, 'elastic.out(1, 0.45)');
    A.shake(ev.price.drop + 0.02, 12, 7);
    A.punch(ev.delivery.pin, 0.03, 0.45);
    A.punch(ev.cta.number, 0.02, 0.4);
  }

  function buildHero(A) {
    const { tl, ev, S } = A;
    const P = '#hero', IN = '#hero-in';
    // centre de base (540, 1000). Positions par scène (décalage y, échelle)
    tl.set(P, { y: 210, scale: 1, opacity: 1 }, 0);
    tl.set(IN, { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' }, 0);
    tl.set('#hero-glow', { opacity: 0 }, 0);
    tl.set('#lens-flare > div', { opacity: 0, scale: 0 }, 0);
    tl.set(['#ol-glow', '#ol-core'], { drawSVG: '0% 0%', opacity: 1 }, 0);
    tl.set('#ol-comet', { drawSVG: '0% 0%', opacity: 0 }, 0);
    // S1 : ouverture en losange depuis le centre
    tl.fromTo(IN, { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' }, { clipPath: 'polygon(50% -70%, 170% 50%, 50% 170%, -70% 50%)', duration: 0.9, ease: 'expo.out' }, ev.hook.open);
    tl.fromTo(P, { scale: 0.8, rotation: -6 }, { scale: 1, rotation: 0, duration: 1.4, ease: 'expo.out' }, ev.hook.open);
    tl.fromTo('#hero-glow', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, ev.hook.open);
    flare(A, ev.hook.open + 0.15, 0.7);
    tl.fromTo(P, { y: 210 }, { y: 185, duration: 2, ease: 'sine.inOut' }, ev.hook.push);
    // S2 : au centre, légère inclinaison qui se redresse
    tl.fromTo(P, { y: 185, scale: 1, rotation: 0 }, { y: -80, scale: 1.0, rotation: -4, duration: 0.5, ease: 'power3.inOut' }, S.S.product[0] - 0.3);
    tl.fromTo(P, { rotation: -4 }, { rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)' }, S.S.product[0] + 0.2);
    // contour lumineux qui se dessine + comète
    const [a, b] = ev.product.trace;
    tl.fromTo(['#ol-glow', '#ol-core'], { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: b - a, ease: 'power2.inOut' }, a);
    tl.fromTo('#ol-comet', { drawSVG: '0% 4%', opacity: 1 }, { drawSVG: '96% 100%', duration: b - a, ease: 'power2.inOut' }, a);
    tl.to('#ol-comet', { opacity: 0, duration: 0.2 }, b);
    tl.to(['#ol-glow', '#ol-core'], { opacity: 0.2, duration: 0.6, ease: 'power2.inOut' }, b + 0.2);
    tl.to(['#ol-glow', '#ol-core'], { opacity: 0, duration: 0.3 }, S.S.usages[0] - 0.4);
    flare(A, ev.product.flare, 1.15);
    tl.fromTo('#hero-glow', { opacity: 1 }, { opacity: 0.55, duration: 1.5, ease: 'sine.inOut' }, ev.product.line2);
    // vers S3 : sortie par le bas avec flou de mouvement
    tl.fromTo(P, { y: -80, opacity: 1, filter: 'blur(0px)' }, { y: 1050, opacity: 0, filter: 'blur(12px)', duration: 0.42, ease: 'power3.in' }, S.S.usages[0] - 0.15);
    // S4 (grille) : petit, en bas
    tl.fromTo(P, { y: 1150, scale: 0.5, opacity: 1, filter: 'blur(10px)' }, { y: 500, scale: 0.5, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }, S.S.features[0] + 0.3);
    tl.fromTo(P, { y: 500 }, { y: 486, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: 1 }, S.S.features[0] + 1.1);
    tl.set(P, { opacity: 0 }, S.S.price[0]);
    // S7 : en haut, glisse depuis la gauche puis se pose (stable avant la fin)
    tl.fromTo(P, { x: -900, y: -570, scale: 0.62, rotation: -10, opacity: 1, filter: 'blur(12px)' },
      { x: 0, y: -570, scale: 0.62, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, ease: 'expo.out' }, S.S.cta[0] + 0.1);
    tl.fromTo('#hero-glow', { opacity: 0.4 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, S.S.cta[0] + 0.2);
    flare(A, ev.cta.number - 0.1, 0.7);
  }

  function flare(A, t, k = 1) {
    const { tl } = A;
    tl.fromTo('#lens-flare .flare-core', { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1.1 * k, duration: 0.18, ease: 'power2.out' }, t);
    tl.to('#lens-flare .flare-core', { opacity: 0, scale: 0.6 * k, duration: 0.9, ease: 'power2.inOut' }, t + 0.2);
    tl.fromTo('#lens-flare .flare-streak', { opacity: 0, scaleX: 0.1, scaleY: 1 }, { opacity: 1, scaleX: 1 * k, duration: 0.22, ease: 'expo.out' }, t);
    tl.to('#lens-flare .flare-streak', { opacity: 0, scaleX: 1.3 * k, duration: 0.8, ease: 'power2.in' }, t + 0.25);
    tl.fromTo('#lens-flare .flare-star', { opacity: 0, scale: 0.3, rotation: 0 }, { opacity: 1, scale: 1 * k, rotation: 45, duration: 0.35, ease: 'power2.out' }, t);
    tl.to('#lens-flare .flare-star', { opacity: 0, scale: 0.5, rotation: 90, duration: 0.7, ease: 'power2.in' }, t + 0.35);
  }

  function buildTransitions(A) {
    const { tl, S } = A;
    // S1 -> S2 : trois barres diagonales balaient le cadre
    tl.set(['#tr-b1', '#tr-b2', '#tr-b3'], { rotation: -24, x: 0, y: 2600 }, 0);
    ['#tr-b1', '#tr-b2', '#tr-b3'].forEach((b, i) => tl.fromTo(b, { y: 1700 + i * 120 }, { y: -2300 + i * 120, duration: 0.65, ease: 'power2.inOut' }, S.S.product[0] - 0.38 + i * 0.05));
    // S3 -> S4 : une ligne de lumière balaie de haut en bas
    tl.set('#sweep-line', { y: -40, opacity: 0 }, 0);
    tl.fromTo('#sweep-line', { y: -40, opacity: 1 }, { y: 1950, opacity: 1, duration: 0.55, ease: 'power2.inOut' }, S.S.features[0] - 0.25);
    tl.set('#sweep-line', { opacity: 0 }, S.S.features[0] + 0.31);
    // S4 -> S5 : quatre bandes claquent en rythme, puis s'ouvrent sur le bleu nuit
    for (let i = 0; i < 4; i++) {
      const from = i % 2 ? 1100 : -1100;
      tl.set(`#tr-band${i}`, { x: from }, 0);
      tl.fromTo(`#tr-band${i}`, { x: from }, { x: 0, duration: 0.25, ease: 'power4.out' }, S.S.price[0] - 0.5 + i * 0.0625);
      tl.fromTo(`#tr-band${i}`, { x: 0 }, { x: -from, duration: 0.4, ease: 'power3.in' }, S.S.price[0] + 0.02 + i * 0.05);
    }
    // S5 -> S6 : anneau doré qui suit l'ouverture en iris
    tl.set('#iris-ring', { y: -77 }, 0);
    tl.set('#iris-ring > div', { scale: 0, opacity: 0 }, 0);
    tl.fromTo('#iris-ring > div', { scale: 0, opacity: 1 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.inOut' }, S.S.delivery[0]);
    tl.to('#iris-ring > div', { opacity: 0, duration: 0.15 }, S.S.delivery[0] + 0.5);
    // S6 -> S7 : fente lumineuse verticale qui s'ouvre
    tl.set('#split-line', { scaleY: 0, opacity: 0 }, 0);
    tl.fromTo('#split-line', { scaleY: 0, opacity: 1 }, { scaleY: 1, opacity: 1, duration: 0.25, ease: 'expo.out' }, S.S.cta[0] - 0.2);
    tl.to('#split-line', { scaleX: 30, opacity: 0, duration: 0.45, ease: 'power2.in' }, S.S.cta[0] + 0.05);
  }

  window.__buildFilm = build;
})();
