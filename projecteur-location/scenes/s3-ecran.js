// SCÈNE 3 — LE GRAND ÉCRAN (8 – 23 s) : la « scène » partagée par les usages, YouTube & Netflix et le
// téléphone. Le faisceau du projecteur l'allume à 8 s (petit format), il s'agrandit à 9 s et reste en place
// jusqu'au balayage lumineux de 23 s. Les sous-scènes (s3-usages, s3-streaming, s3-telephone) remplissent
// ses calques : #scr .scr-in (contenu projeté), #s3-fg (premier plan), #s3-labels (textes).
window.SCENES.push({
  id: 's3',
  html: () => `
    <div id="s3w" class="full">
      <div id="s3-halo"></div>
      <div id="scr">
        <div class="scr-in">
          <div class="scr-l" id="Lu0"></div><div class="scr-l" id="Lu1"></div><div class="scr-l" id="Lu2"></div><div class="scr-l" id="Lu3"></div>
          <div class="scr-l" id="Lstream"></div><div class="scr-l" id="Lplay"></div>
          <div class="scr-l" id="Lwait"></div><div class="scr-l" id="Lmirror"></div>
          <div class="scr-glare"></div>
          <div class="scr-flash"></div>
        </div>
        <svg class="frame" viewBox="0 0 960 549"><rect x="10" y="10" width="940" height="529" rx="16" fill="none" stroke="#ffbf1f" stroke-width="7" style="filter:drop-shadow(0 0 14px rgba(255,191,31,.9))"/></svg>
      </div>
      <div id="s3-lights"></div>
      <div id="s3-fg"></div>
      <div id="s3-badge"><svg viewBox="0 0 24 24" fill="none" stroke="#0a1530" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path id="s3-morph" d="${window.FX.ICON.clapper}"/></svg></div>
      <div id="s3-labels"></div>
      <div id="s3-dots"><i></i><i></i><i></i><i></i></div>
      <div id="s3-phone"></div>
    </div>`,
  build(tl, A) {
    const { ev, S } = A, p = ev.product;
    const small = { scale: 710 / 940, y: 436 - 544.5 };
    tl.set('#scr', { ...small, opacity: 0 }, 0);
    tl.set('#scr .frame rect', { drawSVG: '0% 0%' }, 0);
    tl.set('#scr .scr-flash', { opacity: 0 }, 0);
    tl.set('#scr .scr-l', { opacity: 0 }, 0);
    tl.set('#scr .scr-glare', { xPercent: -160, skewX: -18 }, 0);
    tl.set('#s3-halo', { opacity: 0 }, 0);
    // 8 s : le faisceau trace et allume l'écran (format réduit au-dessus du projecteur)
    tl.set('#scr', { opacity: 1 }, p.beam - 0.05);
    tl.fromTo('#scr .frame rect', { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.5, ease: 'power2.inOut' }, p.beam - 0.05);
    tl.fromTo('#scr .scr-flash', { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.in' }, p.beam + 0.2);
    // 9 s : l'écran grandit et devient la scène
    tl.fromTo('#scr', small, { scale: 1, y: 0, duration: 0.65, ease: 'expo.inOut' }, S.S.usages[0] - 0.02);
    tl.fromTo('#scr .scr-flash', { opacity: 1 }, { opacity: 0, duration: 0.55, ease: 'power2.out' }, S.S.usages[0] + 0.12);
    tl.fromTo('#s3-halo', { opacity: 0 }, { opacity: 1, duration: 0.8 }, S.S.usages[0] + 0.1);
    A.flash(S.S.usages[0], 0.3, 0.4);
    // reflet de verre qui traverse l'écran à chaque changement d'image
    [...ev.usages.cuts, ev.streaming.cut, ev.streaming.click, ev.phone.land].forEach((t) =>
      tl.fromTo('#scr .scr-glare', { xPercent: -160 }, { xPercent: 260, duration: 0.6, ease: 'power2.inOut' }, t + 0.05));
    // 23 s : la ligne de lumière efface la scène de haut en bas
    tl.fromTo('#s3w', { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.55, ease: 'power2.inOut' }, S.S.features[0] - 0.25);
  }
});
