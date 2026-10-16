// SCÈNE 1 — ACCROCHE (0 – 5 s) — v2 : caméra 2D (zoom arrière à l'ouverture, impacts sur chaque mot)
// Écran presque noir, une ligne jaune traverse, les panneaux s'ouvrent le long de la ligne et révèlent
// le projecteur ; titre cinétique « ET SI LE CINÉMA VENAIT CHEZ VOUS ? » mot par mot sur les temps.
window.SCENES.push({
  id: 's1',
  html: () => {
    const ly = (x) => 980 - (x - 540) * 0.12; // la ligne d'ouverture (même formule que lib/fx.js)
    const topPoly = `polygon(0px 0px, 1080px 0px, 1080px ${ly(1080)}px, 0px ${ly(0)}px)`;
    const botPoly = `polygon(0px ${ly(0)}px, 1080px ${ly(1080)}px, 1080px 1920px, 0px 1920px)`;
    const ang = Math.atan2(ly(1080) - ly(0), 1080) * 180 / Math.PI;
    // formes géométriques (losanges et hexagone) qui s'ouvrent autour du produit
    const cx = 540, cy = 1210;
    const dia = (r) => `M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy} Z`;
    const hex = (r) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ') + ' Z';
    return `
      <div id="s1-big" class="bigword osw">CINÉMA</div>
      <svg id="s1-geo" viewBox="0 0 1080 1920">
        <path class="g1" d="${dia(300)}" fill="none" stroke="#ffbf1f" stroke-width="5"/>
        <path class="g2" d="${hex(420)}" fill="none" stroke="#ffbf1f" stroke-width="3" opacity=".8"/>
        <path class="g3" d="${dia(560)}" fill="none" stroke="#6aa8ff" stroke-width="3" opacity=".7"/>
        <path class="g4" d="${hex(700)}" fill="none" stroke="#ffbf1f" stroke-width="2" opacity=".5"/>
      </svg>
      <div id="s1-title" class="abs center osw">
        <div class="lmask"><span class="l1">ET SI LE</span></div>
        <div class="lmask"><span class="l2 goldfx glow">CINÉMA</span></div>
        <div class="lmask"><span class="l3">VENAIT</span></div>
        <div class="lmask"><span class="l4"><span class="goldfx">CHEZ VOUS</span><span class="q">?</span></span></div>
      </div>
      <div class="panel" id="s1-top" style="clip-path:${topPoly}"><div class="edge" style="top:${ly(540) - 3}px;transform:rotate(${ang}deg)"></div></div>
      <div class="panel" id="s1-bot" style="clip-path:${botPoly}"><div class="edge" style="top:${ly(540) - 3}px;transform:rotate(${ang}deg)"></div></div>
      <svg id="s1-line" viewBox="0 0 1080 1920">
        <defs><linearGradient id="s1lg" x1="0" x2="1"><stop offset="0" stop-color="#ffbf1f" stop-opacity="0"/><stop offset=".85" stop-color="#ffd34d"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
        <line id="s1-ln-glow" x1="-60" y1="${ly(-60)}" x2="1140" y2="${ly(1140)}" stroke="#ffbf1f" stroke-width="18" stroke-linecap="round" opacity=".5" style="filter:blur(8px)"/>
        <line id="s1-ln" x1="-60" y1="${ly(-60)}" x2="1140" y2="${ly(1140)}" stroke="url(#s1lg)" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
  },
  build(tl, A) {
    const { ev, FX } = A, h = ev.hook, $ = FX.$, $$ = FX.$$;
    // la ligne : la tête file de gauche à droite, la queue suit puis tout s'efface dans l'ouverture
    tl.set(['#s1-ln', '#s1-ln-glow'], { drawSVG: '0% 0%' }, 0);
    tl.fromTo(['#s1-ln', '#s1-ln-glow'], { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: h.lineEnd - h.line, ease: 'power2.in' }, h.line);
    tl.to(['#s1-ln', '#s1-ln-glow'], { drawSVG: '100% 100%', duration: 0.3, ease: 'power2.in' }, h.lineEnd - 0.05);
    // les panneaux s'écartent le long de la ligne
    tl.set('#s1-top', { y: 0 }, 0); tl.set('#s1-bot', { y: 0 }, 0);
    tl.set('#s1-top .edge, #s1-bot .edge', { opacity: 0 }, 0);
    tl.set('#s1-top .edge, #s1-bot .edge', { opacity: 1 }, h.open - 0.06);
    tl.fromTo('#s1-top', { y: 0 }, { y: -1150, duration: 1.1, ease: 'expo.inOut' }, h.open - 0.05);
    tl.fromTo('#s1-bot', { y: 0 }, { y: 1150, duration: 1.1, ease: 'expo.inOut' }, h.open - 0.05);
    A.flash(h.open, 0.65, 0.6);
    // formes géométriques : tracé puis expansion
    const geo = ['.g1', '.g2', '.g3', '.g4'].map((s) => '#s1-geo ' + s);
    tl.set(geo, { drawSVG: '50% 50%', scale: 0.4, transformOrigin: '540px 1210px', opacity: 0 }, 0);
    geo.forEach((g, i) => {
      tl.fromTo(g, { drawSVG: '50% 50%', opacity: 1, scale: 0.4 }, { drawSVG: '0% 100%', scale: 1, duration: 0.7, ease: 'expo.out' }, h.open + 0.05 + i * 0.08);
      tl.to(g, { scale: 1.6 + i * 0.2, opacity: 0, duration: 1.4, ease: 'power2.in' }, h.open + 0.9 + i * 0.1);
    });
    // titre cinétique, un mot par temps
    const l1 = $('#s1-title .l1'), l2 = $('#s1-title .l2'), l3 = $('#s1-title .l3'), l4 = $('#s1-title .l4');
    const c2 = FX.chars(l2);
    const c4 = FX.chars(l4.querySelector('.goldfx'));
    const q = l4.querySelector('.q');
    tl.set([l1, l3], { yPercent: 115 }, 0);
    tl.set(c2, { yPercent: -120, opacity: 0 }, 0);
    tl.set(c4, { yPercent: 120, opacity: 0 }, 0);
    tl.set(q, { scale: 0, rotation: -40, opacity: 0 }, 0);
    // ET SI LE
    A.lineIn(l1, h.words[0] - 0.05, 0.55);
    // CINÉMA : les lettres tombent en cascade, le mot claque (échelle + flou -> net)
    tl.fromTo(c2, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.03 }, h.words[1] - 0.06);
    tl.fromTo(l2, { scale: 1.35, filter: 'blur(8px)' }, { scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, h.words[1]);
    // grand mot en contour qui dérive derrière (parallaxe typographique)
    tl.set('#s1-big', { opacity: 0, x: 260 }, 0);
    tl.fromTo('#s1-big', { x: 260 }, { x: -220, duration: A.S.S.product[0] - h.open, ease: 'none' }, h.open);
    tl.fromTo('#s1-big', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, h.open + 0.2);
    // VENAIT : balayage horizontal avec inclinaison
    tl.fromTo(l3, { yPercent: 0, clipPath: 'inset(0% 100% 0% 0%)', skewX: -14, x: -40 }, { clipPath: 'inset(0% 0% 0% 0%)', skewX: 0, x: 0, duration: 0.5, ease: 'expo.out' }, h.words[2] - 0.05);
    // CHEZ VOUS : les lettres montent
    tl.fromTo(c4, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.03 }, h.words[3] - 0.08);
    // ? : rebond maîtrisé
    tl.fromTo(q, { scale: 0, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(3)' }, h.words[4] - 0.02);
    // léger travelling : le titre recule, les formes avancent (parallaxe)
    tl.fromTo('#s1-title', { y: 0, scale: 1 }, { y: -18, scale: 0.98, duration: 1.8, ease: 'sine.inOut' }, h.push);
    // sortie du titre vers le haut, ligne par ligne, avec flou de mouvement
    [l1, l2, l3, l4].forEach((el, i) => tl.to(el, { yPercent: -120, filter: 'blur(6px)', duration: 0.3, ease: 'power3.in' }, A.S.S.product[0] - 0.4 + i * 0.04));
    tl.to('#s1-big', { opacity: 0, duration: 0.3 }, A.S.S.product[0] - 0.3);
  }
});
