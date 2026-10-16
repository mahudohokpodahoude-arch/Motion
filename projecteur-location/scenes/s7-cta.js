// SCÈNE 7 — APPEL À L'ACTION (39 – 45 s)
// Le projecteur en haut ; hiérarchie typographique forte ; icône WhatsApp animée ; numéro révélé par un
// masque horizontal ; encadré jaune qui se trace. Tout est en place à 41,95 s : écran stable > 3 s.
window.SCENES.push({
  id: 's7',
  html: (V, FX) => {
    const nb = (s) => s.replace(/ /g, ' ');
    return `
      <div id="s7w" class="full">
        <div id="s7-head" class="abs center osw"><div class="lmask"><span class="a">ENVIE DE VIVRE</span></div><div class="lmask"><span class="b goldfx glow">L’EXPÉRIENCE ?</span></div></div>
        <div id="s7-price" class="abs center">LOCATION : <span class="gold">${nb(V.prix)}&nbsp;${V.devise}</span> / JOUR</div>
        <div id="s7-deliv" class="abs center"><span class="tk">${FX.svgIcon(FX.ICON.truck, '', 'currentColor', 2)}</span><span class="tx">${V.livraison}</span></div>
        <div id="s7-box">
          <div class="bgfill"></div>
          <svg class="frame" viewBox="0 0 956 326"><rect x="8" y="8" width="940" height="310" rx="30" fill="none" stroke="#ffbf1f" stroke-width="7" style="filter:drop-shadow(0 0 12px rgba(255,191,31,.85))"/></svg>
          <div class="cta-top"><div class="lmask"><span>RÉSERVEZ SUR WHATSAPP</span></div></div>
          <div class="wa-ring"></div>
          <div class="wa-wrap">${FX.WA}</div>
          <div class="num"><span class="nm">${V.telephone}</span></div>
        </div>
        <div id="s7-city" class="abs center"><span class="pn">${FX.svgIcon(FX.ICON.pin, '', 'currentColor', 2)}</span><span class="tx">${V.ville}</span></div>
      </div>`;
  },
  build(tl, A) {
    const { ev, S, FX } = A, c = ev.cta, $ = FX.$;
    const t0 = S.S.cta[0];
    // fente lumineuse : la scène s'ouvre depuis le centre
    tl.fromTo('#s7w', { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'expo.inOut' }, t0 - 0.05);
    // états initiaux
    tl.set(['#s7-head .a', '#s7-box .cta-top span'], { yPercent: 115 }, 0);
    const cb = FX.chars($('#s7-head .b'));
    tl.set('#s7-head .b', { yPercent: 0 }, 0);
    tl.set(cb, { yPercent: 120, opacity: 0 }, 0);
    tl.set('#s7-price', { clipPath: 'inset(0% 100% 0% 0%)', y: 20 }, 0);
    tl.set('#s7-deliv .tk', { x: -260, opacity: 0 }, 0);
    tl.set('#s7-deliv .tx', { clipPath: 'inset(0% 100% 0% 0%)' }, 0);
    tl.set('#s7-box .bgfill', { scaleY: 0, opacity: 0 }, 0);
    tl.set('#s7-box .frame rect', { drawSVG: '0% 0%' }, 0);
    tl.set('#s7-box .wa-wrap', { scale: 0, rotation: -30 }, 0);
    tl.set('#s7-box .wa-ring', { scale: 1, opacity: 0 }, 0);
    tl.set('#s7-box .num', { clipPath: 'inset(0% 100% 0% 0%)' }, 0);
    tl.set('#s7-city', { opacity: 0, y: 24 }, 0);

    // ENVIE DE VIVRE / L'EXPÉRIENCE ?
    A.lineIn('#s7-head .a', c.head + 0.05, 0.5);
    tl.fromTo(cb, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.025 }, c.head + 0.15);
    // LOCATION : prix / JOUR
    tl.fromTo('#s7-price', { clipPath: 'inset(0% 100% 0% 0%)', y: 20 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.45, ease: 'expo.out' }, c.price - 0.03);
    // LIVRAISON POSSIBLE : le camion entre, le texte suit
    tl.fromTo('#s7-deliv .tk', { x: -260, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }, c.delivery - 0.05);
    tl.fromTo('#s7-deliv .tx', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power3.out' }, c.delivery + 0.05);
    // encadré + RÉSERVEZ SUR WHATSAPP + icône
    tl.fromTo('#s7-box .bgfill', { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.35, ease: 'expo.out' }, c.whatsapp - 0.08);
    A.lineIn('#s7-box .cta-top span', c.whatsapp, 0.45);
    tl.fromTo('#s7-box .wa-wrap', { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1.1, 0.5)' }, c.whatsapp);
    tl.fromTo('#s7-box .wa-ring', { scale: 1, opacity: 0.9 }, { scale: 1.7, opacity: 0, duration: 0.55, ease: 'power2.out', repeat: 1 }, c.whatsapp + 0.15);
    // le numéro : masque horizontal, sur la signature sonore
    tl.fromTo('#s7-box .num', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'expo.out' }, c.number - 0.02);
    tl.fromTo('#s7-box .num', { x: -20 }, { x: 0, duration: 0.5, ease: 'expo.out' }, c.number - 0.02);
    A.flash(c.number, 0.22, 0.35);
    // encadré jaune animé + ville
    tl.fromTo('#s7-box .frame rect', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.42, ease: 'power2.inOut' }, c.frame - 0.02);
    tl.fromTo('#s7-city', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, c.city);
    // à partir de c.stable (41,95 s) plus aucun texte ne bouge jusqu'à la fin
  }
});
