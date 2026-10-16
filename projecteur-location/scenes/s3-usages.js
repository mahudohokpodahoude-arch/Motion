// SCÈNE 3a — LES USAGES (9 – 17 s), sur le grand écran partagé (s3-ecran.js).
// Quatre plans de 2 s : soirée cinéma, football, jeux vidéo, présentations & événements.
// Contenu de l'écran : photo réelle si assets/photos/manifest.js en fournit une, sinon illustration 2D.
// Transitions toutes différentes : coup de fouet horizontal, masque diagonal + zoom, coup de fouet vertical.
// Aucune console, ordinateur ou abonnement n'est promis : on illustre des usages.
(function () {
  const I = window.FX.ICON;
  const KEYS = ['cinema', 'football', 'gaming', 'presentation'];
  const LABELS = [['SOIRÉE', 'CINÉMA'], ['MATCHS DE', 'FOOTBALL'], ['JEUX', 'VIDÉO'], ['PRÉSENTATIONS', '& ÉVÉNEMENTS']];

  window.SCENES.push({
    id: 's3-usages',
    html: (V, FX) => {
      const L = window.ILLUS;
      const vig = [L.v1, L.v2, L.v3, L.v4];
      const out = {};
      KEYS.forEach((k, i) => { out['#Lu' + i] = FX.photo(k, `<div class="ill">${vig[i]()}</div>`); });
      out['#s3-fg'] = [L.f1, L.f2, L.f3, L.f4].map((f, i) => `<div class="fg" id="f${i + 1}">${f()}</div>`).join('');
      out['#s3-labels'] = LABELS.map(([a, b], i) => `<div class="lab osw" id="lab${i}" data-layout-allow-overlap><div class="lmask"><span class="a">${a}</span></div><div class="lmask"><span class="b goldfx glow">${b}</span></div></div>`).join('');
      out['#s3-lights'] = `
        <svg viewBox="0 0 1080 1920" style="position:absolute;inset:0;width:1080px;height:1920px;overflow:visible">
          <defs><linearGradient id="s3lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8dc" stop-opacity=".3"/><stop offset="1" stop-color="#fff8dc" stop-opacity="0"/></linearGradient></defs>
          <g class="tw tw-l"><polygon class="lb" points="120,250 190,250 620,980 -200,980" fill="url(#s3lb)"/>
            <rect x="70" y="208" width="170" height="64" rx="10" fill="#0b1a3a" stroke="#ffbf1f" stroke-width="3"/>
            ${[0, 1, 2, 3].map((i) => `<circle cx="${100 + i * 37}" cy="240" r="13" fill="#fffbe6" style="filter:drop-shadow(0 0 10px #fff)"/>`).join('')}</g>
          <g class="tw tw-r"><polygon class="lb" points="890,250 960,250 1280,980 460,980" fill="url(#s3lb)"/>
            <rect x="840" y="208" width="170" height="64" rx="10" fill="#0b1a3a" stroke="#ffbf1f" stroke-width="3"/>
            ${[0, 1, 2, 3].map((i) => `<circle cx="${870 + i * 37}" cy="240" r="13" fill="#fffbe6" style="filter:drop-shadow(0 0 10px #fff)"/>`).join('')}</g>
        </svg>`;
      return out;
    },
    build(tl, A) {
      const { ev, S, FX } = A, u = ev.usages, $$ = FX.$$;
      const cuts = u.cuts, BAR = S.BAR, end = S.S.streaming[0];
      const LU = ['#Lu0', '#Lu1', '#Lu2', '#Lu3'], FG = ['#f1', '#f2', '#f3', '#f4'];
      const morphs = [I.clapper, I.ball, I.gamepad, I.board];
      const dots = $$('#s3-dots i');
      // ---- états initiaux
      tl.set(LU, { xPercent: 0, yPercent: 0, scale: 1 }, 0);
      tl.set(FG, { opacity: 0, y: 260 }, 0);
      tl.set('#s3-lights', { opacity: 0 }, 0);
      tl.set('#s3-badge', { scale: 0, rotation: 0 }, 0);
      tl.set('#s3-morph', { drawSVG: '0% 0%' }, 0);
      tl.set('#s3-labels .lab .a, #s3-labels .lab .b', { yPercent: 115 }, 0);
      tl.set('#s3-dots i', { opacity: 0, y: 20 }, 0);

      // ---- 9 s : premier plan visible sous l'éclair de l'écran
      tl.set(LU[0], { opacity: 1 }, cuts[0] - 0.05);
      tl.fromTo('#s3-badge', { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, cuts[0] + 0.2);
      tl.fromTo('#s3-morph', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.4, ease: 'power2.out' }, cuts[0] + 0.3);
      tl.set('#s3-morph', { strokeDasharray: 'none', strokeDashoffset: 0 }, cuts[0] + 0.75); // le morphing change la longueur du tracé
      tl.fromTo('#s3-dots i', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 }, cuts[0] + 0.3);

      // ---- transitions de l'écran (toutes différentes)
      // 11 s : coup de fouet horizontal + flou de mouvement directionnel
      tl.set(LU[1], { opacity: 1, xPercent: 100 }, cuts[1] - 0.2);
      tl.fromTo(LU[0], { xPercent: 0 }, { xPercent: -100, duration: 0.36, ease: 'power3.inOut' }, cuts[1] - 0.2);
      tl.fromTo(LU[1], { xPercent: 100 }, { xPercent: 0, duration: 0.36, ease: 'power3.inOut' }, cuts[1] - 0.2);
      A.mblur('#scr .scr-in', 'mbx', cuts[1] - 0.2, 0.42, 34);
      tl.set(LU[0], { opacity: 0 }, cuts[1] + 0.2);
      // 13 s : masque diagonal + léger zoom
      tl.set(LU[2], { opacity: 1 }, cuts[2] - 0.15);
      tl.fromTo(LU[2], { clipPath: 'polygon(-30% 0%, -30% 0%, -60% 100%, -60% 100%)', scale: 1.18 }, { clipPath: 'polygon(-30% 0%, 160% 0%, 130% 100%, -60% 100%)', scale: 1, duration: 0.5, ease: 'power3.inOut' }, cuts[2] - 0.15);
      tl.set(LU[1], { opacity: 0 }, cuts[2] + 0.4);
      // 15 s : coup de fouet vertical
      tl.set(LU[3], { opacity: 1, yPercent: 100 }, cuts[3] - 0.2);
      tl.fromTo(LU[2], { yPercent: 0 }, { yPercent: -100, duration: 0.36, ease: 'power3.inOut' }, cuts[3] - 0.2);
      tl.fromTo(LU[3], { yPercent: 100 }, { yPercent: 0, duration: 0.36, ease: 'power3.inOut' }, cuts[3] - 0.2);
      A.mblur('#scr .scr-in', 'mby', cuts[3] - 0.2, 0.42, 30);
      tl.set(LU[2], { opacity: 0 }, cuts[3] + 0.2);

      // ---- premiers plans, libellés, pastille, points
      cuts.forEach((c, i) => {
        if (i > 0) {
          tl.to(FG[i - 1], { y: 260, opacity: 0, duration: 0.28, ease: 'power3.in' }, c - 0.25);
          A.lineOut(`#lab${i - 1} .a`, c - 0.22, 0.26);
          A.lineOut(`#lab${i - 1} .b`, c - 0.18, 0.26);
          tl.to('#s3-badge', { rotation: 360 * i, duration: 0.5, ease: 'back.out(1.6)' }, c - 0.05);
          tl.to('#s3-morph', { morphSVG: morphs[i], duration: 0.4, ease: 'power2.inOut' }, c - 0.05);
        }
        tl.fromTo(FG[i], { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, c + 0.05);
        A.lineIn(`#lab${i} .a`, u.labels[i] - 0.15, 0.45);
        A.lineIn(`#lab${i} .b`, u.labels[i] - 0.05, 0.5);
        tl.fromTo(`#lab${i} .b`, { scale: 1.25, letterSpacing: '0.12em' }, { scale: 1, letterSpacing: '0.005em', duration: 0.7, ease: 'expo.out' }, u.labels[i] - 0.05);
        dots.forEach((d, k) => tl.to(d, { width: k === i ? 92 : 46, backgroundColor: k === i ? '#ffbf1f' : 'rgba(255,255,255,0.28)', duration: 0.3, ease: 'power3.out' }, c));
        // photo : lent travelling avant (Ken Burns 2D) pendant tout le plan
        if (FX.hasPhoto(KEYS[i])) tl.fromTo(`${LU[i]} .ph img`, { scale: 1.09, xPercent: i % 2 ? 1.5 : -1.5 }, { scale: 1.0, xPercent: 0, duration: 2.5, ease: 'sine.out' }, c - 0.2);
      });
      // ---- 17 s : sortie (le streaming prend l'écran)
      tl.to(FG[3], { y: 260, opacity: 0, duration: 0.28, ease: 'power3.in' }, end - 0.25);
      A.lineOut('#lab3 .a', end - 0.22, 0.26); A.lineOut('#lab3 .b', end - 0.18, 0.26);
      tl.to('#s3-dots i', { opacity: 0, y: 20, duration: 0.25, stagger: 0.03 }, end - 0.25);

      // ---- animations internes des illustrations (seulement sans photo)
      if (!FX.hasPhoto('cinema')) {
        const t0 = cuts[0];
        tl.fromTo('#Lu0 .v1-sun', { y: 40 }, { y: -40, duration: 2.4, ease: 'sine.out' }, t0);
        tl.fromTo('#Lu0 .v1-glow', { y: 40, scale: 0.9, transformOrigin: '470px 400px' }, { y: -40, scale: 1.1, duration: 2.4, ease: 'sine.out' }, t0);
        tl.fromTo('#Lu0 .v1-m1', { x: -30 }, { x: 30, duration: 2.4, ease: 'none' }, t0);
        tl.fromTo('#Lu0 .v1-m2', { x: 40 }, { x: -40, duration: 2.4, ease: 'none' }, t0);
        tl.fromTo('#Lu0 .v1-m3', { x: -60 }, { x: 60, duration: 2.4, ease: 'none' }, t0);
        tl.fromTo('#Lu0 .v1-birds', { x: -60, y: 10 }, { x: 80, y: -20, duration: 2.4, ease: 'none' }, t0);
        tl.fromTo('#Lu0 .v1-star', { opacity: 0.2 }, { opacity: 1, duration: 0.5, ease: 'sine.inOut', stagger: { each: 0.05, repeat: 1, yoyo: true } }, t0);
      }
      if (!FX.hasPhoto('football')) {
        tl.set('#Lu1 .v2-ball', { x: 300, y: 380 }, 0);
        tl.to('#Lu1 .v2-ball', { motionPath: { path: '#v2-path', align: '#v2-path', alignOrigin: [0.5, 0.5] }, rotation: 720, duration: u.goal - cuts[1] - 0.15, ease: 'power1.in' }, cuts[1] + 0.15);
        tl.fromTo('#Lu1 .v2-goal', { scaleX: 1, transformOrigin: '900px 264px' }, { scaleX: 1.5, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1 }, u.goal);
        tl.fromTo('#Lu1 .v2-flash', { opacity: 0.6 }, { opacity: 0, duration: 0.5, ease: 'power2.out' }, u.goal);
        $$('#Lu1 .v2-p').forEach((p, i) => tl.fromTo(p, { x: 0, y: 0 }, { x: (i < 3 ? 1 : -1) * (30 + i * 6), y: (i % 2 ? -18 : 14), duration: 1.6, ease: 'sine.inOut' }, cuts[1]));
      }
      if (!FX.hasPhoto('gaming')) {
        $$('#Lu2 .v3-h').forEach((ln) => {
          const k = +ln.dataset.k, y = (q) => 322 + 207 * Math.pow(q / 7, 2);
          tl.fromTo(ln, { attr: { y1: y(k), y2: y(k) } }, { attr: { y1: y(k + 1), y2: y(k + 1) }, duration: 0.5, ease: 'none', repeat: 3 }, cuts[2]);
        });
        tl.fromTo('#Lu2 .v3-ship', { x: -40, rotation: -6, transformOrigin: '470px 450px' }, { x: 40, rotation: 6, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 3 }, cuts[2]);
        tl.fromTo('#Lu2 .v3-streak', { x: 300 }, { x: -500, duration: 0.6, ease: 'none', stagger: { each: 0.04, repeat: 2 } }, cuts[2]);
      }
      if (!FX.hasPhoto('presentation')) {
        tl.set('#Lu3 .v4-bar', { scaleY: 0, transformOrigin: '50% 100%' }, 0);
        tl.set('#Lu3 .v4-line', { drawSVG: '0% 0%' }, 0);
        tl.set('#Lu3 .v4-donut', { drawSVG: '0% 0%' }, 0);
        tl.set('#Lu3 .v4-dot', { scale: 0, transformOrigin: '860px 168px' }, 0);
        tl.set('#Lu3 .v4-txt', { scaleX: 0, transformOrigin: '0% 50%' }, 0);
        tl.fromTo('#Lu3 .v4-bar', { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.12 }, cuts[3] + 0.2);
        tl.fromTo('#Lu3 .v4-line', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.inOut' }, cuts[3] + 0.5);
        tl.fromTo('#Lu3 .v4-dot', { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, cuts[3] + 1.15);
        tl.fromTo('#Lu3 .v4-donut', { drawSVG: '0% 0%' }, { drawSVG: '0% 72%', duration: 0.8, ease: 'power2.out' }, cuts[3] + 0.3);
        tl.fromTo('#Lu3 .v4-txt', { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, cuts[3] + 0.15);
      }

      // ---- premiers plans animés
      tl.fromTo('#f1 .f1-beam', { opacity: 0.15 }, { opacity: 0.45, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: 1 }, cuts[0] + 0.2);
      $$('#f2 .f2-p').forEach((p, i) => {
        tl.fromTo(p, { y: 0 }, { y: -16, duration: BAR / 8, ease: 'sine.out', yoyo: true, repeat: 3 }, cuts[1] + 0.1 + (i % 2) * 0.06);
        tl.fromTo(p, { y: 0 }, { y: -48, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, u.goal + i * 0.03);
      });
      tl.fromTo('#f2 .f2-scarf', { rotation: -3, transformOrigin: '540px 156px' }, { rotation: 3, duration: BAR / 4, ease: 'sine.inOut', yoyo: true, repeat: 3 }, cuts[1]);
      tl.fromTo('#s3-lights', { opacity: 0 }, { opacity: 1, duration: 0.3 }, cuts[1]);
      tl.fromTo('#s3-lights .tw-l .lb', { rotation: -10, transformOrigin: '155px 250px' }, { rotation: 8, duration: 1.8, ease: 'sine.inOut' }, cuts[1]);
      tl.fromTo('#s3-lights .tw-r .lb', { rotation: 10, transformOrigin: '925px 250px' }, { rotation: -8, duration: 1.8, ease: 'sine.inOut' }, cuts[1]);
      tl.to('#s3-lights', { opacity: 0, duration: 0.25 }, cuts[2] - 0.2);
      tl.set('#f3 .f3-pad', { drawSVG: '0% 0%', fillOpacity: 0 }, 0);
      tl.set(['#f3 .f3-cross', '#f3 .f3-btn', '#f3 .f3-ray'], { opacity: 0 }, 0);
      tl.fromTo('#f3 .f3-pad', { drawSVG: '0% 0%', fillOpacity: 0 }, { drawSVG: '0% 100%', duration: 0.5, ease: 'power2.inOut' }, cuts[2] + 0.05);
      tl.to('#f3 .f3-pad', { fillOpacity: 1, duration: 0.3 }, cuts[2] + 0.45);
      tl.fromTo('#f3 .f3-cross', { opacity: 0 }, { opacity: 1, duration: 0.2 }, cuts[2] + 0.5);
      tl.fromTo('#f3 .f3-btn', { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.06 }, cuts[2] + 0.55);
      tl.fromTo('#f3 .f3-ray', { opacity: 0, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.25, ease: 'power2.out', stagger: 0.02 }, cuts[2] + 0.45);
      tl.to('#f3 .f3-ray', { drawSVG: '100% 100%', duration: 0.3, ease: 'power2.in', stagger: 0.02 }, cuts[2] + 0.9);
      tl.set(['#f4 .f4-b', '#f4 .f4-f'], { y: 0 }, 0);
      tl.fromTo('#f4 .f4-b', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.03 }, cuts[3] + 0.1);
      tl.fromTo('#f4 .f4-f', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.04 }, cuts[3] + 0.15);
      tl.fromTo('#f4 .f4-presenter', { x: 160 }, { x: 0, duration: 0.6, ease: 'expo.out' }, cuts[3] + 0.2);
      tl.fromTo(['#f4 .f4-ic1', '#f4 .f4-ic2'], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.2 }, cuts[3] + 0.6);
    }
  });
})();
