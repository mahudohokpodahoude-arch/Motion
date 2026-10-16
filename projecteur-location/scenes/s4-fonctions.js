// SCÈNE 4 — CARACTÉRISTIQUES (23 – 29 s)
// Une grille 2×4 lisible sur smartphone : chaque tuile arrive sur une croche, chacune avec sa propre
// animation d'icône (tracé, rebond, morphing trapèze → rectangle, ondes, arcs Wi-Fi, tracé Bluetooth,
// ports qui glissent, lecture), puis une lumière parcourt la grille en rythme.
(function () {
  const I = window.FX.ICON;
  const svg = (inner) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const TILES = [
    { icon: svg(`<path class="p" d="${I.fullhd}"/>`), t: '1080P', d: 'Résolution native' },
    { icon: svg(`<path class="p" d="${I.screen}"/>`), t: '150 POUCES', d: 'Image grande taille' },
    { icon: svg(`<path class="p" d="${I.trapeze}"/><path d="M9 12h6 M12 9v6" stroke-width="1.4" opacity=".7"/>`), t: 'TRAPÉZOÏDALE', d: 'Correction d’image' },
    { icon: svg(`<path d="${I.speaker}"/><path class="wv" d="${I.wave1}"/><path class="wv" d="${I.wave2}"/><path class="wv" d="${I.wave3}"/>`), t: 'HAUT-PARLEUR', d: 'Intégré' },
    { icon: svg(`<path class="wf" d="${I.wifi0}" stroke-width="2.6"/><path class="wf" d="${I.wifi1}"/><path class="wf" d="${I.wifi2}"/><path class="wf" d="${I.wifi3}"/>`), t: 'WI-FI', d: 'Intégré' },
    { icon: svg(`<path class="p" d="${I.bluetooth}" style="filter:drop-shadow(0 0 3px #ffbf1f)"/>`), t: 'BLUETOOTH', d: 'Intégré' },
    { icon: svg(`<path class="pt" d="${I.hdmi}"/><path class="pt" d="${I.usb}"/><path class="pt" d="${I.jack}"/>`), t: 'HDMI · USB', d: '+ audio 3,5 mm' },
    { icon: svg(`<path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path class="tri" d="M10 9l5 3-5 3Z" fill="currentColor"/>`), t: 'YOUTUBE &amp;<br>NETFLIX', d: 'Intégrés*', hot: true }
  ];

  window.SCENES.push({
    id: 's4',
    html: () => `
      <div id="s4w" class="full">
        <div id="s4-head" class="abs center osw"><div class="lmask"><span>CARACTÉRISTIQUES</span></div>
          <svg viewBox="0 0 520 24"><path d="M10 14 Q 260 2 510 14" fill="none" stroke="#ffbf1f" stroke-width="7" stroke-linecap="round"/></svg></div>
        <div id="s4-grid">${TILES.map((x, i) => `
          <div class="ft${x.hot ? ' hot' : ''}" id="ft${i}" style="left:${i % 2 ? 555 : 70}px;top:${398 + Math.floor(i / 2) * 218}px">
            <div class="ft-ic">${x.icon}</div>
            <div class="ft-tx"><div class="t">${x.t}</div><div class="d">${x.d}</div></div>
            <i class="ft-sh"></i>
          </div>`).join('')}</div>
        <div id="s4-note" class="abs center mont">*Connexion Internet requise · abonnement Netflix non inclus</div>
      </div>`,
    build(tl, A) {
      const { ev, S, FX } = A, f = ev.features, $$ = FX.$$;
      const t0 = S.S.features[0], end = S.S.price[0];
      // révélation par la ligne de lumière (synchronisée avec #sweep-line)
      tl.fromTo('#s4w', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power2.inOut' }, t0 - 0.25);
      // états initiaux
      tl.set('#s4-head span', { yPercent: 115 }, 0);
      tl.set('#s4-head path', { drawSVG: '50% 50%' }, 0);
      $$('#s4 .ft').forEach((el, i) => tl.set(el, { opacity: 0, x: i % 2 ? 140 : -140, rotation: i % 2 ? 6 : -6, scale: 0.8 }, 0));
      tl.set('#s4-note', { opacity: 0, y: 12 }, 0);
      tl.set('#s4 .ft-sh', { xPercent: -150, skewX: -18 }, 0);
      // titre
      A.lineIn('#s4-head span', t0 + 0.05, 0.5);
      tl.fromTo('#s4-head path', { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.5, ease: 'power3.out' }, t0 + 0.3);
      // tuiles : une par croche, alternées gauche / droite
      f.tiles.forEach((t, i) => tl.fromTo(`#ft${i}`, { opacity: 0, x: i % 2 ? 140 : -140, rotation: i % 2 ? 6 : -6, scale: 0.8 },
        { opacity: 1, x: 0, rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, t - 0.06));
      // animations d'icônes, toutes différentes
      const [a0, a1, a2, a3, a4, a5, a6, a7] = f.tiles;
      tl.set('#ft0 .p', { drawSVG: '0% 0%' }, 0);
      tl.fromTo('#ft0 .p', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power2.inOut' }, a0);
      tl.set('#ft1 .ico', { scale: 0.3 }, 0);
      tl.fromTo('#ft1 .ico', { scale: 0.3 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' }, a1);
      tl.set('#ft2 .p', { morphSVG: I.trapeze }, 0);
      tl.to('#ft2 .p', { morphSVG: I.rect, duration: 0.5, ease: 'back.out(1.8)' }, a2 + 0.2);
      tl.set('#ft3 .wv', { opacity: 0 }, 0);
      tl.fromTo('#ft3 .wv', { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.1 }, a3 + 0.05);
      tl.fromTo('#ft3 .wv', { opacity: 1 }, { opacity: 0.25, duration: 0.25, stagger: 0.1, yoyo: true, repeat: 5, ease: 'sine.inOut' }, a3 + 0.5);
      tl.set('#ft4 .wf', { opacity: 0, scale: 0.6, svgOrigin: '12 20' }, 0);
      tl.fromTo('#ft4 .wf', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2.5)', stagger: 0.1 }, a4);
      tl.set('#ft5 .p', { drawSVG: '0% 0%' }, 0);
      tl.fromTo('#ft5 .p', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.55, ease: 'power2.inOut' }, a5);
      tl.set('#ft6 .pt', { opacity: 0, x: -10 }, 0);
      tl.fromTo('#ft6 .pt', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out', stagger: 0.1 }, a6);
      tl.set('#ft7 .tri', { scale: 0, svgOrigin: '12.3 12' }, 0);
      tl.fromTo('#ft7 .tri', { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, a7 + 0.1);
      // une lumière parcourt la grille sur les temps
      for (let k = 0; k < 8; k++) {
        const t = f.tiles[7] + 0.25 + k * 0.4;
        if (t > end - 0.7) break;
        tl.fromTo(`#ft${k} .ft-sh`, { xPercent: -150 }, { xPercent: 250, duration: 0.5, ease: 'power2.inOut' }, t);
        tl.fromTo(`#ft${k}`, { scale: 1 }, { scale: 1.04, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, t);
      }
      // mention lisible
      tl.fromTo('#s4-note', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, f.note - 1.4);
    }
  });
})();
