// SCÈNE 2 — PRÉSENTATION DU PRODUIT (5 – 9 s)
// Le projecteur au centre, son contour se dessine en lumière, éclat sur l'objectif ; deux messages
// typographiques rapides ; puis un faisceau stylisé allume le grand écran de la scène 3 (raccord).
window.SCENES.push({
  id: 's2',
  html: () => `
    <div id="s2-head" class="abs center">
      <div class="pill" id="s2-pill">LOCATION</div>
      <div class="osw h1"><div class="lmask"><span>PROJECTEUR</span></div></div>
      <div class="osw h2"><div class="lmask"><span class="shine glow">HOME CINÉMA</span></div></div>
    </div>
    <div id="s2-l1" class="abs center osw" data-layout-allow-overlap>
      <div class="lmask"><span class="a">VOTRE GRAND ÉCRAN,</span></div>
      <div class="lmask"><span class="b shine glow">PARTOUT</span></div>
    </div>
    <svg id="s2-under" viewBox="0 0 500 30"><path d="M10 18 Q 250 4 490 18" fill="none" stroke="#ffbf1f" stroke-width="8" stroke-linecap="round"/></svg>
    <div id="s2-l2" class="abs center" data-layout-allow-overlap>
      <div class="lmask osw"><span class="a">UNE EXPÉRIENCE</span></div>
      <div class="lmask osw"><span class="b goldfx glow">IMMERSIVE</span></div>
      <div class="lmask"><span class="c">À portée de main</span></div>
    </div>`,
  build(tl, A) {
    const { ev, S, FX } = A, p = ev.product, $ = FX.$;
    const t0 = S.S.product[0], end = S.S.usages[0];
    // états initiaux
    tl.set('#s2-pill', { scale: 0, opacity: 0 }, 0);
    tl.set(['#s2-head .h1 span', '#s2-head .h2 span', '#s2-l1 .a', '#s2-l1 .b', '#s2-l2 .a', '#s2-l2 .c'], { yPercent: 115 }, 0);
    tl.set('#s2-under path', { drawSVG: '0% 0%' }, 0);

    // en-tête « LOCATION / PROJECTEUR / HOME CINÉMA » (repris de l'affiche)
    tl.fromTo('#s2-pill', { scale: 0, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.5)' }, t0 + 0.05);
    A.lineIn('#s2-head .h1 span', t0 + 0.12, 0.5);
    A.lineIn('#s2-head .h2 span', t0 + 0.22, 0.5);
    tl.fromTo('#s2-head .h2 span', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 0.9, ease: 'power2.inOut' }, t0 + 0.5);

    // message 1 : VOTRE GRAND ÉCRAN, PARTOUT
    A.lineIn('#s2-l1 .a', p.line1 - 0.05, 0.45);
    tl.fromTo('#s2-l1 .b', { yPercent: 115, scaleY: 1.5, transformOrigin: '50% 100%' }, { yPercent: 0, scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' }, p.line1 + 0.07);
    tl.fromTo('#s2-l1 .b', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 0.8, ease: 'power2.inOut' }, p.line1 + 0.4);
    tl.fromTo('#s2-under path', { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.45, ease: 'power3.out' }, p.line1 + 0.35);
    A.lineOut('#s2-l1 .a', p.line2 - 0.28, 0.26);
    A.lineOut('#s2-l1 .b', p.line2 - 0.24, 0.26);
    tl.to('#s2-under path', { drawSVG: '100% 100%', duration: 0.26, ease: 'power2.in' }, p.line2 - 0.28);

    // message 2 : UNE EXPÉRIENCE IMMERSIVE À PORTÉE DE MAIN
    A.lineIn('#s2-l2 .a', p.line2 - 0.02, 0.45);
    const c2 = FX.chars($('#s2-l2 .b'));
    tl.set('#s2-l2 .b', { yPercent: 0 }, 0);
    tl.set(c2, { opacity: 0, scale: 2.2, filter: 'blur(10px)' }, 0);
    tl.fromTo(c2, { opacity: 0, scale: 2.2, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out', stagger: 0.035 }, p.line2 + 0.1);
    tl.fromTo('#s2-l2 .c', { yPercent: 115, letterSpacing: '0.6em' }, { yPercent: 0, letterSpacing: '0.14em', duration: 0.8, ease: 'expo.out' }, p.line2 + 0.35);

    // l'en-tête libère le haut, le faisceau allume l'écran de la scène 3
    A.lineOut('#s2-head .h1 span', p.beam - 0.45, 0.3);
    A.lineOut('#s2-head .h2 span', p.beam - 0.4, 0.3);
    tl.to('#s2-pill', { scale: 0, opacity: 0, duration: 0.25, ease: 'back.in(2)' }, p.beam - 0.4);
    // faisceau (calque global #beam) : du centre de l'objectif vers le bas de l'écran (format réduit)
    const lens = { x: 160 + 292, y: 740 - 80 + 192 };
    $('#beam').innerHTML = `<defs><linearGradient id="bmg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#eaf4ff" stop-opacity=".95"/><stop offset=".5" stop-color="#9cc8ff" stop-opacity=".45"/><stop offset="1" stop-color="#6aa8ff" stop-opacity=".12"/></linearGradient></defs>` +
      `<polygon id="beam-poly" points="${lens.x - 8},${lens.y} ${185},${636} ${895},${636} ${lens.x + 8},${lens.y}" fill="url(#bmg)" style="filter:blur(3px)"/>` +
      `<polygon id="beam-core" points="${lens.x - 3},${lens.y} ${330},${636} ${750},${636} ${lens.x + 3},${lens.y}" fill="#ffffff" opacity=".35" style="filter:blur(8px)"/>`;
    tl.set('#beam', { opacity: 0 }, 0);
    tl.set(['#beam-poly', '#beam-core'], { scaleY: 0, transformOrigin: `${lens.x}px ${lens.y}px` }, 0);
    tl.set('#beam', { opacity: 1 }, p.beam);
    tl.fromTo(['#beam-poly', '#beam-core'], { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: 'expo.out' }, p.beam);
    tl.to('#beam', { opacity: 0, duration: 0.25, ease: 'power2.in' }, end - 0.15);
    // sortie du message 2
    tl.to(['#s2-l2 .a', '#s2-l2 .b', '#s2-l2 .c'], { yPercent: 120, opacity: 0, duration: 0.26, ease: 'power3.in', stagger: 0.03 }, end - 0.3);
  }
});
