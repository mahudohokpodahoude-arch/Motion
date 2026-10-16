// SCÈNE 3b — YOUTUBE & NETFLIX INTÉGRÉS (17 – 20 s), sur le grand écran partagé.
// L'écran affiche un écran d'accueil d'applications générique (les noms, jamais les logos officiels),
// la sélection glisse de YouTube à Netflix, « clic », la lecture démarre plein écran.
// Mention obligatoire et lisible : connexion Internet requise, abonnement Netflix non inclus.
(function () {
  const PLAY = 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M10 9l5 3-5 3Z';
  const WIFI = 'M12 20h.01 M8.5 16.429a5 5 0 0 1 7 0 M5 12.859a10 10 0 0 1 14 0 M2 8.82a15 15 0 0 1 20 0';
  const tri = '<svg class="pl" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z" fill="#ffbf1f"/></svg>';

  window.SCENES.push({
    id: 's3-streaming',
    html: (V, FX) => {
      const L = window.ILLUS;
      const thumbs = [0, 1, 2, 3].map((i) => `<div class="thumb" id="th${i}">${FX.photo('thumb' + i, L.thumb(i))}</div>`).join('');
      return {
        '#Lstream': `
          <div class="lch">
            <div class="lch-top"><span class="lch-t">Applications</span><span class="lch-r"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="${WIFI}"/></svg>20:30</span></div>
            <div class="app" id="app1"><div class="app-in">${tri}<b>YouTube</b></div></div>
            <div class="app" id="app2"><div class="app-in">${tri}<b>Netflix</b></div></div>
            <div class="row-t">À regarder</div>
            ${thumbs}
            <div class="focus" id="lch-focus"></div>
          </div>`,
        '#Lplay': `${FX.photo('streaming', `<div class="ill">${L.savanna()}</div>`)}
          <div class="player"><div class="pl-grad"></div><svg class="pl-ic" viewBox="0 0 24 24"><path d="M7 5h3v14H7Z M14 5h3v14h-3Z" fill="#fff"/></svg><div class="pl-bar"><i></i></div><span class="pl-time">0:12</span></div>`,
        '#s3-labels': `
          <div class="lab osw" id="labS" data-layout-allow-overlap>
            <div class="lmask"><span class="a">YOUTUBE &amp; NETFLIX</span></div>
            <div class="lmask"><span class="b goldfx glow">INTÉGRÉS*</span></div>
            <div class="note mont">*Connexion Internet requise.<br>Abonnement Netflix non inclus.</div>
          </div>`
      };
    },
    build(tl, A) {
      const { ev, S, FX } = A, s = ev.streaming;
      const end = S.S.phone[0];
      // états initiaux
      tl.set('#Lstream', { scale: 1.25, opacity: 0 }, 0);
      tl.set(['#app1', '#app2', '#Lstream .thumb'], { opacity: 0, scale: 0.6, y: 30 }, 0);
      tl.set('#lch-focus', { opacity: 0, x: 0, scale: 1.1 }, 0);
      tl.set('#Lplay', { opacity: 0, clipPath: 'inset(14.4% 4.3% 47.8% 52.1% round 18px)' }, 0);
      tl.set('#Lplay .pl-bar i', { scaleX: 0, transformOrigin: '0% 50%' }, 0);
      tl.set('#labS .a, #labS .b', { yPercent: 115 }, 0);
      tl.set('#labS .note', { opacity: 0, y: 14 }, 0);

      // 17 s : l'accueil des applications remplace le dernier usage (zoom arrière)
      tl.fromTo('#Lstream', { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'expo.out' }, s.cut - 0.05);
      tl.to('#Lu3', { opacity: 0, duration: 0.2 }, s.cut + 0.1);
      // tuiles : une par double-croche
      [['#app1', s.tiles[0]], ['#app2', s.tiles[1]]].forEach(([el, t]) => tl.fromTo(el, { opacity: 0, scale: 0.6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, t));
      tl.fromTo('#Lstream .thumb', { opacity: 0, scale: 0.6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.06 }, s.tiles[2]);
      // la sélection : sur YouTube, puis glisse sur Netflix, « clic »
      tl.fromTo('#lch-focus', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' }, s.tiles[3]);
      tl.fromTo('#app1', { scale: 1 }, { scale: 1.05, duration: 0.2, ease: 'power2.out' }, s.tiles[3]);
      tl.to('#app1', { scale: 1, duration: 0.2, ease: 'power2.inOut' }, s.focus - 0.05);
      tl.fromTo('#lch-focus', { x: 0 }, { x: 450, duration: 0.3, ease: 'power3.inOut' }, s.focus - 0.05);
      tl.fromTo('#app2', { scale: 1 }, { scale: 1.06, duration: 0.25, ease: 'power2.out' }, s.focus + 0.15);
      tl.to(['#app2', '#lch-focus'], { scale: 0.94, duration: 0.08, ease: 'power2.in' }, s.click - 0.08);
      // 18,5 s : la lecture s'ouvre depuis la tuile jusqu'au plein écran
      tl.set('#Lplay', { opacity: 1 }, s.click);
      tl.fromTo('#Lplay', { clipPath: 'inset(14.4% 4.3% 47.8% 52.1% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.42, ease: 'expo.inOut' }, s.click);
      tl.fromTo('#scr .scr-flash', { opacity: 0.55 }, { opacity: 0, duration: 0.35, ease: 'power2.out' }, s.click);
      tl.fromTo('#Lplay .pl-bar i', { scaleX: 0 }, { scaleX: 0.42, duration: end - s.click, ease: 'none' }, s.click);
      if (FX.hasPhoto('streaming')) tl.fromTo('#Lplay .ph img', { scale: 1.2 }, { scale: 1.04, duration: end - s.click + 0.6, ease: 'sine.out' }, s.click);
      else {
        tl.fromTo('#Lplay .sv-sun', { y: 20 }, { y: -10, duration: 2, ease: 'sine.out' }, s.click);
        tl.fromTo('#Lplay .sv-herd', { x: 0 }, { x: -60, duration: 2, ease: 'none' }, s.click);
        tl.fromTo('#Lplay .sv-tree', { x: 0 }, { x: 25, duration: 2, ease: 'none' }, s.click);
      }
      tl.set('#Lstream', { opacity: 0 }, s.click + 0.45);
      // le salon regarde (premier plan des usages, repris)
      tl.fromTo('#f1', { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, s.cut + 0.1);
      tl.to('#f1', { y: 260, opacity: 0, duration: 0.28, ease: 'power3.in' }, end - 0.3);
      // pastille : l'icône devient « lecture »
      tl.to('#s3-badge', { rotation: 360 * 4, duration: 0.5, ease: 'back.out(1.6)' }, s.cut - 0.05);
      tl.to('#s3-morph', { morphSVG: PLAY, duration: 0.4, ease: 'power2.inOut' }, s.cut - 0.05);
      tl.to('#s3-badge', { scale: 0, duration: 0.25, ease: 'back.in(2)' }, end - 0.3);
      // textes
      A.lineIn('#labS .a', s.title - 0.1, 0.45);
      A.lineIn('#labS .b', s.title + 0.05, 0.5);
      tl.fromTo('#labS .b', { scale: 1.3 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, s.title + 0.05);
      tl.fromTo('#labS .note', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, s.note);
      A.lineOut('#labS .a', end - 0.28, 0.26); A.lineOut('#labS .b', end - 0.24, 0.26);
      tl.to('#labS .note', { opacity: 0, duration: 0.2 }, end - 0.25);
    }
  });
})();
