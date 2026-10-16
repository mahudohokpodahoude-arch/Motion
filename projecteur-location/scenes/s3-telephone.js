// SCÈNE 3c — LE TÉLÉPHONE SUR GRAND ÉCRAN (20 – 23 s), sur le grand écran partagé.
// L'écran passe en attente de connexion ; un téléphone arrive, affiche une photo, des ondes partent vers le
// projecteur, l'image s'envole du téléphone et se pose en grand sur l'écran (raccord dans le mouvement).
(function () {
  const CAST = 'M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6 M2 12a9 9 0 0 1 8 8 M2 16a5 5 0 0 1 4 4 M2 20h.01';
  // téléphone (paysage) : 560×276 centré sur (540, 1010) ; écran intérieur 532×248 en (274, 886)
  const PH = { x: 260, y: 872, w: 560, h: 276 }, DISP = { x: 274, y: 886, w: 532, h: 248 };
  const SCR = { x: 70, y: 280, w: 940, h: 529 };

  window.SCENES.push({
    id: 's3-telephone',
    html: (V, FX) => {
      const L = window.ILLUS;
      const img = () => FX.photo('phone', `<div class="ill">${L.party()}</div>`);
      return {
        '#Lwait': `<div class="wait"><svg viewBox="0 0 24 24" fill="none" stroke="#ffbf1f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${CAST}"/></svg><span>En attente de connexion…</span></div>`,
        '#Lmirror': img(),
        '#s3-phone': `
          <svg id="ph-waves" viewBox="0 0 1080 1920">${[0, 1, 2].map((i) => `<path class="wv" d="M${540 - 70 - i * 50} 862 A ${70 + i * 50} ${70 + i * 50} 0 0 1 ${540 + 70 + i * 50} 862" fill="none" stroke="#ffbf1f" stroke-width="${7 - i * 1.5}" stroke-linecap="round"/>`).join('')}</svg>
          <div id="phone" style="left:${PH.x}px;top:${PH.y}px;width:${PH.w}px;height:${PH.h}px">
            <div class="ph-body"></div>
            <div class="ph-disp" style="left:${DISP.x - PH.x}px;top:${DISP.y - PH.y}px;width:${DISP.w}px;height:${DISP.h}px">
              <div class="ph-off"></div><div class="ph-img">${img()}</div>
            </div>
            <i class="ph-cam"></i>
          </div>
          <div id="fly" style="left:${DISP.x}px;top:${DISP.y}px;width:${DISP.w}px;height:${DISP.h}px">${img()}</div>
          <div id="ph-text" class="abs center" data-layout-allow-overlap>
            <div class="lmask osw"><span class="a goldfx glow">VOTRE TÉLÉPHONE</span></div>
            <div class="lmask osw"><span class="b">SUR GRAND ÉCRAN</span></div>
            <div class="lmask"><span class="c">Recopie d'écran sans fil</span></div>
          </div>`
      };
    },
    build(tl, A) {
      const { ev, S } = A, p = ev.phone;
      const end = S.S.features[0];
      tl.set(['#Lwait', '#Lmirror'], { opacity: 0 }, 0);
      tl.set('#phone', { y: 1150, rotation: -14, opacity: 0 }, 0);
      tl.set('#phone .ph-img', { opacity: 0 }, 0);
      tl.set('#ph-waves .wv', { opacity: 0, scale: 0.5, svgOrigin: '540 862' }, 0);
      tl.set('#fly', { opacity: 0 }, 0);
      tl.set('#ph-text .a, #ph-text .b, #ph-text .c', { yPercent: 115 }, 0);
      tl.set('#Lwait svg', { scale: 1, opacity: 1 }, 0);

      // 20 s : l'écran se met en attente, le téléphone arrive
      tl.set('#Lwait', { opacity: 1 }, p.cut - 0.05);
      tl.to('#Lplay', { opacity: 0, duration: 0.2 }, p.cut - 0.05);
      tl.fromTo('#Lwait svg', { scale: 1, opacity: 1 }, { scale: 1.15, opacity: 0.55, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 3 }, p.cut);
      tl.set('#phone', { opacity: 1 }, p.cut);
      tl.fromTo('#phone', { y: 1150, rotation: -14 }, { y: 0, rotation: -4, duration: 0.5, ease: 'expo.out' }, p.cut);
      A.lineIn('#ph-text .a', p.cut + 0.08, 0.45);
      A.lineIn('#ph-text .b', p.cut + 0.18, 0.45);
      A.lineIn('#ph-text .c', p.cut + 0.3, 0.45);
      // 20,5 s : « tap » — la photo s'affiche sur le téléphone, qui se redresse
      tl.fromTo('#phone .ph-img', { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, p.tap);
      tl.fromTo('#phone', { rotation: -4 }, { rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, p.tap);
      // 21 s : ondes vers le projecteur
      [0, 1, 2].forEach((i) => tl.fromTo(`#ph-waves .wv:nth-child(${i + 1})`, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.05, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, p.cast + i * 0.08));
      // l'image s'envole du téléphone et se pose sur le grand écran (raccord dans le mouvement)
      tl.set('#fly', { opacity: 1 }, p.cast + 0.15);
      tl.fromTo('#fly', { left: DISP.x, top: DISP.y, width: DISP.w, height: DISP.h, borderRadius: 18 },
        { left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h, borderRadius: 16, duration: p.land - p.cast - 0.15, ease: 'power3.in' }, p.cast + 0.15);
      A.mblur('#fly', 'mby', p.cast + 0.15, p.land - p.cast - 0.1, 14);
      // 21,5 s : arrivée — l'écran affiche l'image, éclair
      tl.set('#Lmirror', { opacity: 1 }, p.land);
      tl.set('#Lwait', { opacity: 0 }, p.land);
      tl.set('#fly', { opacity: 0 }, p.land + 0.02);
      tl.fromTo('#scr .scr-flash', { opacity: 0.7 }, { opacity: 0, duration: 0.45, ease: 'power2.out' }, p.land);
      A.flash(p.land, 0.35, 0.4);
      tl.fromTo('#Lmirror .ph img, #Lmirror .ill', { scale: 1.08 }, { scale: 1, duration: 1.2, ease: 'expo.out' }, p.land);
      // 22,75 s : sortie
      tl.to('#phone', { y: 700, rotation: 8, duration: 0.35, ease: 'power3.in' }, p.out);
      tl.to('#ph-text', { opacity: 0, y: 40, duration: 0.25, ease: 'power3.in' }, p.out);
    }
  });
})();
