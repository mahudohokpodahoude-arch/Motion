// SCÈNE 5 — RÉVÉLATION DU PRIX (29 – 35 s)
// Fond bleu nuit, « TARIF UNIQUE », compteur à rouleaux qui tourne puis se bloque sur le prix pile sur
// l'impact musical (31 s), éclat doré, rayons et ondes ; « LA JOURNÉE » ; puis une pause pour mémoriser.
// Le rouleau des milliers ne dépasse jamais le chiffre final : aucun autre tarif ne s'affiche.
window.SCENES.push({
  id: 's5',
  html: (V) => {
    const chars = [...V.prix];
    const wheel = (c, first) => {
      if (!/\d/.test(c)) return '<span class="gap"></span>';
      const d = +c, seq = first ? Array.from({ length: d + 1 }, (_, i) => i) : [...Array(30).keys()].map((i) => i % 10).concat(Array.from({ length: d + 1 }, (_, i) => i));
      return `<span class="wheel"><span class="strip" data-n="${seq.length - 1}">${seq.map((n) => `<span>${n}</span>`).join('')}</span></span>`;
    };
    let firstDone = false;
    const wheels = chars.map((c) => { const w = wheel(c, !firstDone && /\d/.test(c)); if (/\d/.test(c)) firstDone = true; return w; }).join('');
    let rings = '';
    for (let i = 0; i < 4; i++) rings += `<circle class="ring" cx="540" cy="830" r="230" fill="none" stroke="${i % 2 ? '#6aa8ff' : '#ffbf1f'}" stroke-width="${i % 2 ? 3 : 5}"/>`;
    return `
      <style>
        #s5-day .box { position: relative; overflow: hidden; }
        #s5-day .sweep { position: absolute; top: -20%; left: -40%; width: 30%; height: 140%; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0)); transform: skewX(-20deg); }
      </style>
      <div id="s5w" class="full">
        <div id="s5-rays"></div>
        <svg id="s5-rings" viewBox="0 0 1080 1920">${rings}</svg>
        <div id="s5-top" class="abs center"><div class="pill">LOCATION</div><div class="tag">TARIF UNIQUE</div></div>
        <div id="s5-price" class="abs center"><span class="odo">${wheels}</span></div>
        <div id="s5-cur" class="abs center osw"><div class="lmask"><span>${V.devise}</span></div></div>
        <div id="s5-day" class="abs center"><div class="box">LA JOURNÉE<i class="sweep"></i></div></div>
      </div>`;
  },
  build(tl, A) {
    const { ev, S, FX } = A, p = ev.price, $$ = FX.$$;
    const t0 = S.S.price[0], H = 330;
    tl.set('#s5-rays', { opacity: 0, rotation: 0 }, 0);
    tl.set('#s5-rings .ring', { opacity: 0, scale: 0.6, svgOrigin: '540 830' }, 0);
    tl.set('#s5-top .pill', { scale: 0, opacity: 0 }, 0);
    tl.set('#s5-top .tag', { opacity: 0 }, 0);
    tl.set('#s5-price', { opacity: 0, scale: 0.85 }, 0);
    tl.set('#s5-price .odo', { color: '#ffffff' }, 0);
    tl.set('#s5-cur span', { yPercent: 115 }, 0);
    tl.set('#s5-day .box', { opacity: 0 }, 0);
    tl.set('#s5-day .sweep', { x: 0 }, 0);

    // TARIF UNIQUE
    tl.fromTo('#s5-top .pill', { scale: 0, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.5)' }, t0 + 0.05);
    tl.fromTo('#s5-top .tag', { opacity: 0, letterSpacing: '0.9em' }, { opacity: 1, letterSpacing: '0.32em', duration: 0.7, ease: 'expo.out' }, p.title);
    // le compteur apparaît et tourne (flou de mouvement), anticipation, puis impact
    tl.fromTo('#s5-price', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, p.countFrom - 0.1);
    $$('#s5-price .strip').forEach((st, i) => {
      const n = +st.dataset.n;
      tl.set(st, { y: 0 }, 0);
      tl.fromTo(st, { y: 0 }, { y: -n * H, duration: p.breath + 0.2 - p.countFrom, ease: i === 0 ? 'power2.inOut' : 'power3.inOut' }, p.countFrom);
    });
    tl.fromTo('#s5-price .wheel', { filter: 'blur(0px)' }, { filter: 'blur(7px)', duration: 0.25, ease: 'power2.in' }, p.countFrom + 0.05);
    tl.to('#s5-price .wheel', { filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }, p.breath - 0.2);
    tl.to('#s5-price', { scale: 0.93, duration: p.drop - p.breath, ease: 'power2.in' }, p.breath);
    // 31 s : IMPACT
    tl.fromTo('#s5-price', { scale: 1.3 }, { scale: 1, duration: 0.7, ease: 'back.out(3)' }, p.drop);
    tl.set('#s5-price .odo', { color: '#ffc21f' }, p.drop);
    A.flash(p.drop, 0.95, 0.7);
    tl.fromTo('#s5-rays', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, p.drop);
    tl.fromTo('#s5-rays', { rotation: 0 }, { rotation: 32, duration: S.S.price[1] - p.drop + 0.5, ease: 'none' }, p.drop);
    $$('#s5-rings .ring').forEach((r, i) => tl.fromTo(r, { scale: 0.6, opacity: 0.85 }, { scale: 2.8, opacity: 0, duration: 2, ease: 'power2.out', repeat: 1 }, p.drop + i * 0.5));
    // FCFA
    tl.fromTo('#s5-cur span', { yPercent: 115, letterSpacing: '0.4em' }, { yPercent: 0, letterSpacing: '0.06em', duration: 0.6, ease: 'expo.out' }, p.drop + 0.15);
    // LA JOURNÉE
    tl.fromTo('#s5-day .box', { opacity: 1, clipPath: 'inset(0% 50% 0% 50% round 18px)', scale: 1.25 }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', scale: 1, duration: 0.5, ease: 'back.out(2)' }, p.perDay - 0.05);
    tl.fromTo('#s5-day .sweep', { x: 0 }, { x: 1100, duration: 0.7, ease: 'power2.inOut' }, p.perDay + 0.5);
    tl.fromTo('#s5-day .sweep', { x: 0 }, { x: 1100, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, p.perDay + 1.9);
  }
});
