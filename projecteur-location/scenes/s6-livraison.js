// SCÈNE 6 — LIVRAISON ET LOCALISATION (35 – 39 s) — v2 : la caméra suit le scooter
// Ouverture en iris doré ; plan de ville abstrait (aucune géographie réelle n'est affirmée) ;
// un scooter de livraison suit un trajet en pointillés qui se dessine ; le repère tombe sur l'impact ;
// « LIVRAISON POSSIBLE » et « COTONOU, BÉNIN ». Aucun délai, frais ou zone n'est promis.
window.SCENES.push({
  id: 's6',
  html: (V) => {
    const ROUTE = 'M170 1185 C 300 1150, 330 1045, 450 1012 S 640 1000, 650 922 S 720 792, 800 792';
    const [w1, ...rest] = V.livraison.split(' ');
    const roads = ['M-40 700 L1120 830', 'M-40 905 L1120 985', 'M-40 1120 L1120 1175', 'M205 600 L265 1290', 'M520 600 L560 1290', 'M860 600 L880 1290', 'M-40 1265 C 300 1190, 700 1250, 1120 1110']
      .map((d, i) => `<path class="road" d="${d}" fill="none" stroke="#1f4180" stroke-width="${i === 6 ? 16 : 7}" stroke-linecap="round"/>`).join('');
    const r = window.FX.rng(66);
    let blocks = '';
    for (let i = 0; i < 26; i++) blocks += `<rect class="blk" x="${(r() * 1000).toFixed(0)}" y="${(620 + r() * 620).toFixed(0)}" width="${(40 + r() * 70).toFixed(0)}" height="${(30 + r() * 50).toFixed(0)}" rx="6" fill="#123063" opacity="${(0.35 + r() * 0.4).toFixed(2)}"/>`;
    return `
      <div id="s6w" class="full">
        <div id="s6-big" class="bigword osw">COTONOU</div>
        <div id="s6-world" class="full">
        <svg id="s6-map" viewBox="0 0 1080 1920">
          <defs>
            <radialGradient id="s6rg" cx="540" cy="950" r="620" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
            <mask id="s6fade"><rect x="0" y="0" width="1080" height="1920" fill="url(#s6rg)"/></mask>
            <mask id="s6rm" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><path id="s6-route-mask" d="${ROUTE}" stroke="#fff" stroke-width="34" fill="none" stroke-linecap="round"/></mask>
          </defs>
          <g id="s6-city-map" mask="url(#s6fade)">
            <path d="M640 1300 C 760 1170, 960 1210, 1120 1130 L1120 1320 L640 1320Z" fill="#0f3b78" opacity=".55"/>
            ${blocks}${roads}
          </g>
          <path id="s6-route-glow" d="${ROUTE}" fill="none" stroke="#ffbf1f" stroke-width="18" opacity=".3" stroke-linecap="round" style="filter:blur(7px)"/>
          <path id="s6-route" d="${ROUTE}" fill="none" stroke="#ffd34d" stroke-width="8" stroke-dasharray="1 22" stroke-linecap="round" mask="url(#s6rm)"/>
          <circle id="s6-start" cx="170" cy="1185" r="14" fill="#ffbf1f"/>
          <g id="s6-ripples">${[0, 1, 2].map((i) => `<ellipse class="rip" cx="800" cy="792" rx="70" ry="22" fill="none" stroke="#ffbf1f" stroke-width="${5 - i}"/>`).join('')}</g>
          <g id="s6-pin"><ellipse cx="800" cy="796" rx="30" ry="9" fill="rgba(0,0,0,.45)"/>
            <path d="M800 792 C 772 748, 742 718, 742 682 A 58 58 0 1 1 858 682 C 858 718, 828 748, 800 792Z" fill="#ffbf1f" stroke="#fff3c4" stroke-width="4" style="filter:drop-shadow(0 0 16px rgba(255,191,31,.8))"/>
            <circle cx="800" cy="682" r="23" fill="#0a1a3a"/></g>
          <path id="s6-path" d="${ROUTE}" fill="none" stroke="none"/>
        </svg>
        <div id="s6-moto"><svg viewBox="0 0 170 120">
          <g class="lines" stroke="#ffbf1f" stroke-width="4" stroke-linecap="round" opacity=".8"><line x1="-46" y1="50" x2="-8" y2="50"/><line x1="-60" y1="68" x2="-14" y2="68"/><line x1="-40" y1="86" x2="-10" y2="86"/></g>
          <rect x="6" y="20" width="56" height="46" rx="8" fill="#ffbf1f" stroke="#0a1530" stroke-width="3"/><path d="M14 34 H54 M14 44 H44" stroke="#0a1530" stroke-width="4" stroke-linecap="round"/>
          <path d="M30 78 Q 70 60 104 76 L130 76 L138 60 L124 30" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M58 64 L96 64" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
          <path d="M118 28 L142 24" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
          <g class="wh"><circle cx="38" cy="94" r="20" fill="#0a1530" stroke="#ffbf1f" stroke-width="6"/><path d="M38 80 V108 M24 94 H52" stroke="#ffbf1f" stroke-width="3"/></g>
          <g class="wh"><circle cx="134" cy="94" r="20" fill="#0a1530" stroke="#ffbf1f" stroke-width="6"/><path d="M134 80 V108 M120 94 H148" stroke="#ffbf1f" stroke-width="3"/></g>
        </svg></div>
        </div>
        <div id="s6-title" class="abs center osw"><div class="lmask"><span class="a">${w1}</span></div><div class="lmask"><span class="b goldfx glow">${rest.join(' ')}</span></div></div>
        <div id="s6-city" class="abs center osw"><div class="lmask"><span>${V.ville}</span></div></div>
      </div>`;
  },
  build(tl, A) {
    const { ev, S, FX } = A, d = ev.delivery, $$ = FX.$$;
    const t0 = S.S.delivery[0];
    // iris doré
    tl.fromTo('#s6w', { clipPath: 'circle(0% at 50% 46%)' }, { clipPath: 'circle(75% at 50% 46%)', duration: 0.55, ease: 'power3.inOut' }, t0);
    // états initiaux
    tl.set('#s6 .road', { drawSVG: '0% 0%' }, 0);
    tl.set('#s6 .blk', { opacity: 0 }, 0);
    tl.set(['#s6-route-mask', '#s6-route-glow'], { drawSVG: '0% 0%' }, 0);
    tl.set('#s6-start', { scale: 0, svgOrigin: '170 1185' }, 0);
    tl.set('#s6-pin', { y: -150, opacity: 0 }, 0);
    tl.set('#s6 .rip', { opacity: 0, scale: 0.3, svgOrigin: '800 792' }, 0);
    tl.set('#s6-moto', { opacity: 0 }, 0);
    tl.set(['#s6-title .a', '#s6-title .b', '#s6-city span'], { yPercent: 115 }, 0);
    // le plan se dessine
    tl.fromTo('#s6 .road', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.out', stagger: 0.05 }, t0 + 0.05);
    tl.fromTo('#s6 .blk', { opacity: 0 }, { opacity: (i, el) => el.getAttribute('opacity'), duration: 0.4, stagger: 0.015 }, t0 + 0.2);
    // titre
    A.lineIn('#s6-title .a', d.title - 0.1, 0.5);
    A.lineIn('#s6-title .b', d.title + 0.02, 0.55);
    tl.fromTo('#s6-title .b', { scale: 1.2 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, d.title + 0.02);
    // départ, trajet en pointillés et scooter (le trajet se dessine sous ses roues)
    const [a, b] = d.drive;
    tl.fromTo('#s6-start', { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, a - 0.15);
    tl.fromTo(['#s6-route-mask', '#s6-route-glow'], { drawSVG: '0% 0%' }, { drawSVG: '0% 92%', duration: b - a - 0.05, ease: 'power1.inOut' }, a);
    tl.set('#s6-moto', { opacity: 1 }, a);
    tl.fromTo('#s6-moto', { opacity: 1 }, { motionPath: { path: '#s6-path', align: '#s6-path', alignOrigin: [0.5, 0.9], start: 0, end: 0.82 }, duration: b - a - 0.05, ease: 'power1.inOut' }, a);
    $$('#s6-moto .wh').forEach((w) => tl.fromTo(w, { rotation: 0, transformOrigin: '50% 50%' }, { rotation: 720, duration: b - a, ease: 'power1.inOut' }, a));
    tl.to(['#s6-route-mask', '#s6-route-glow'], { drawSVG: '0% 100%', duration: 0.25, ease: 'power2.out' }, b - 0.05);
    // le repère tombe pile sur l'impact
    tl.fromTo('#s6-pin', { y: -150, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: 'power3.in' }, d.pin - 0.28);
    tl.fromTo('#s6-pin', { scaleY: 0.75, scaleX: 1.15, svgOrigin: '800 792' }, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' }, d.pin);
    $$('#s6 .rip').forEach((r, i) => tl.fromTo(r, { opacity: 1, scale: 0.3 }, { opacity: 0, scale: 2.2 + i * 0.4, duration: 0.9, ease: 'power2.out' }, d.pin + i * 0.12));
    tl.to('#s6-moto', { x: '+=26', opacity: 0, duration: 0.35, ease: 'power2.in' }, d.pin + 0.25);
    // la caméra suit le scooter : le « monde » (plan + scooter + repère) glisse en sens inverse
    tl.set('#s6-world', { x: 110, y: -50 }, 0);
    tl.fromTo('#s6-world', { x: 110, y: -50 }, { x: -70, y: 50, duration: b - t0, ease: 'power1.inOut' }, t0);
    tl.fromTo('#s6-world', { x: -70, y: 50 }, { x: -40, y: 30, duration: 0.6, ease: 'expo.out' }, b);
    // grand mot en contour qui dérive derrière (parallaxe typographique)
    tl.set('#s6-big', { opacity: 0, x: 320 }, 0);
    tl.fromTo('#s6-big', { x: 320 }, { x: -320, duration: S.S.cta[0] - t0, ease: 'none' }, t0);
    tl.fromTo('#s6-big', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, t0 + 0.2);
    tl.to('#s6-big', { opacity: 0, duration: 0.3 }, S.S.cta[0] - 0.15);
    A.flash(d.pin, 0.25, 0.4);
    // ville
    tl.fromTo('#s6-city span', { yPercent: 115, letterSpacing: '0.3em' }, { yPercent: 0, letterSpacing: '0.02em', duration: 0.6, ease: 'expo.out' }, d.city - 0.05);
    // sortie : les éléments s'écartent pendant que la fente lumineuse ouvre la scène 7
    const out = S.S.cta[0] - 0.15;
    tl.to('#s6-title', { x: -260, opacity: 0, duration: 0.35, ease: 'power3.in' }, out);
    tl.to('#s6-city', { x: 260, opacity: 0, duration: 0.35, ease: 'power3.in' }, out);
    tl.to('#s6-map', { scale: 1.12, opacity: 0, transformOrigin: '540px 950px', duration: 0.4, ease: 'power3.in' }, out);
  }
});
