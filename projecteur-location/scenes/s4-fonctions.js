// SCÈNE 4 — FONCTIONNALITÉS (21 – 29 s)
// Deux pages courtes pour rester lisible sur smartphone : « IMAGE & SON » (4 points) puis
// « CONNECTIVITÉ » (3 points). Chaque caractéristique a sa propre animation : tracé d'icône + frappe,
// compteur, morphing trapèze → rectangle + balayage lumineux, ondes sonores + glissé, arcs Wi-Fi + lettres,
// tracé Bluetooth + masque, ports qui glissent + mots qui claquent.
(function () {
  const I = window.FX.ICON;
  const svg = (inner) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const ROWS_A = [
    { id: 'fa0', icon: svg(`<path class="p" d="${I.fullhd}"/>`), t: '1080P NATIF<span class="cursor"></span>', d: 'Résolution native Full HD' },
    { id: 'fa1', icon: svg(`<path class="p" d="${I.screen}"/>`), t: 'JUSQU’À <span class="num">150</span> POUCES', d: 'Image grande taille' },
    { id: 'fa2', icon: svg(`<path class="p" d="${I.trapeze}"/><path d="M9 12h6 M12 9v6" stroke-width="1.4" opacity=".7"/>`), t: '<span class="shine-w">CORRECTION TRAPÉZOÏDALE</span>', d: 'Une image bien droite' },
    { id: 'fa3', icon: svg(`<path d="${I.speaker}"/><path class="wv" d="${I.wave1}"/><path class="wv" d="${I.wave2}"/><path class="wv" d="${I.wave3}"/>`), t: 'HAUT-PARLEUR INTÉGRÉ', d: 'Pour un son clair et immersif' }
  ];
  const ROWS_B = [
    { id: 'fb0', icon: svg(`<path class="wf" d="${I.wifi0}" stroke-width="2.6"/><path class="wf" d="${I.wifi1}"/><path class="wf" d="${I.wifi2}"/><path class="wf" d="${I.wifi3}"/>`), t: 'WI-FI INTÉGRÉ', d: 'Connectivité sans fil' },
    { id: 'fb1', icon: svg(`<path class="p" d="${I.bluetooth}" style="filter:drop-shadow(0 0 3px #ffbf1f)"/>`), t: 'BLUETOOTH INTÉGRÉ', d: 'Appairage sans fil' },
    { id: 'fb2', icon: svg(`<path class="pt" d="${I.hdmi}"/><path class="pt" d="${I.usb}"/><path class="pt" d="${I.jack}"/>`), t: '<span class="wd">HDMI</span> · <span class="wd">USB</span> · <span class="wd">AUDIO</span>', d: 'Prise audio 3,5 mm' }
  ];
  const row = (r, y) => `<div class="row" id="${r.id}" style="top:${y}px"><div class="tile">${r.icon}</div><div class="txt"><div class="t">${r.t}</div><div class="d">${r.d}</div></div></div>`;

  window.SCENES.push({
    id: 's4',
    html: () => `
      <style>
        .shine-w { background: linear-gradient(100deg, #fff 0%, #fff 42%, #ffe37a 50%, #fff 58%, #fff 100%); background-size: 300% 100%; background-position: 100% 0; -webkit-background-clip: text; background-clip: text; color: transparent; }
        #s4 .wd { display: inline-block; }
        #s4 .t .ch { display: inline-block; }
      </style>
      <div id="s4w" class="full">
        <div id="s4-top" class="abs center"><div class="pill">CARACTÉRISTIQUES</div></div>
        <div class="s4-head osw" id="s4-headA"><div class="lmask"><span>IMAGE <span class="gold">&amp;</span> SON</span></div></div>
        <div class="s4-head osw" id="s4-headB"><div class="lmask"><span>CONNECTIVITÉ</span></div></div>
        <div class="s4-list" id="s4-listA" style="top:0">${ROWS_A.map((r, i) => row(r, 548 + i * 196)).join('')}</div>
        <div class="s4-list" id="s4-listB" style="top:0">${ROWS_B.map((r, i) => row(r, 590 + i * 216)).join('')}</div>
      </div>`,
    build(tl, A) {
      const { ev, S, FX } = A, f = ev.features, $ = FX.$, $$ = FX.$$;
      const t0 = S.S.features[0];
      // révélation par la ligne de lumière (synchronisée avec #sweep-line)
      tl.fromTo('#s4w', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power2.inOut' }, t0 - 0.25);
      // états initiaux
      tl.set('#s4-top .pill', { scale: 0, opacity: 0 }, 0);
      tl.set(['#s4-headA span', '#s4-headB span'], { yPercent: 115 }, 0);
      tl.set('#s4 .row .tile', { scale: 0.4, opacity: 0, rotation: -12 }, 0);
      tl.set('#s4 .row .d', { opacity: 0, y: 16 }, 0);
      tl.fromTo('#s4-top .pill', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.5)' }, t0 + 0.05);
      A.lineIn('#s4-headA > .lmask > span', t0 + 0.1, 0.55);

      const tileIn = (id, t) => {
        tl.fromTo(`#${id} .tile`, { scale: 0.4, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.2)' }, t - 0.08);
        tl.fromTo(`#${id} .d`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, t + 0.25);
      };
      const [a0, a1, a2, a3] = f.items[0], [b0, b1, b2] = f.items[1];

      // A0 — 1080p : tracé de l'icône + frappe au clavier
      tileIn('fa0', a0);
      tl.set('#fa0 .p', { drawSVG: '0% 0%' }, 0);
      tl.fromTo('#fa0 .p', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power2.inOut' }, a0);
      const tA0 = $('#fa0 .t'), cur = tA0.querySelector('.cursor'); cur.remove();
      const cA0 = FX.chars(tA0); tA0.appendChild(cur);
      tl.set(cA0, { opacity: 0 }, 0); tl.set(cur, { opacity: 0 }, 0);
      tl.set(cur, { opacity: 1 }, a0);
      cA0.forEach((c, i) => tl.set(c, { opacity: 1 }, a0 + 0.05 + i * 0.045));
      tl.set(cur, { opacity: 0 }, a0 + 0.75); tl.set(cur, { opacity: 1 }, a0 + 0.95); tl.set(cur, { opacity: 0 }, a0 + 1.15);

      // A1 — 150 pouces : l'écran grandit, le chiffre compte
      tileIn('fa1', a1);
      tl.set('#fa1 .ico', { scale: 0.35 }, 0);
      tl.fromTo('#fa1 .ico', { scale: 0.35 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, a1);
      tl.set('#fa1 .t', { clipPath: 'inset(0% 100% 0% 0%)' }, 0);
      tl.fromTo('#fa1 .t', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power3.out' }, a1 + 0.02);
      tl.set('#fa1 .num', { innerText: 0 }, 0);
      tl.fromTo('#fa1 .num', { innerText: 0 }, { innerText: 150, snap: { innerText: 1 }, duration: 0.7, ease: 'power2.out' }, a1 + 0.05);
      tl.set('#fa1 .num', { color: '#ffbf1f' }, 0);

      // A2 — trapézoïdale : le trapèze se redresse en rectangle, balayage lumineux sur le titre
      tileIn('fa2', a2);
      tl.set('#fa2 .p', { morphSVG: I.trapeze }, 0);
      tl.to('#fa2 .p', { morphSVG: I.rect, duration: 0.55, ease: 'back.out(1.8)' }, a2 + 0.25);
      tl.set('#fa2 .t', { opacity: 0, x: 0 }, 0);
      tl.fromTo('#fa2 .t', { opacity: 0, skewX: -12, x: -20 }, { opacity: 1, skewX: 0, x: 0, duration: 0.35, ease: 'power3.out' }, a2);
      tl.fromTo('#fa2 .shine-w', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 0.8, ease: 'power2.inOut' }, a2 + 0.15);

      // A3 — haut-parleur : ondes qui pulsent, titre qui glisse depuis la droite avec flou
      tileIn('fa3', a3);
      tl.set('#fa3 .wv', { opacity: 0 }, 0);
      tl.fromTo('#fa3 .wv', { opacity: 0, x: -2 }, { opacity: 1, x: 0, duration: 0.18, stagger: 0.12 }, a3 + 0.05);
      tl.fromTo('#fa3 .wv', { opacity: 1 }, { opacity: 0.25, duration: 0.25, stagger: 0.1, yoyo: true, repeat: 3, ease: 'sine.inOut' }, a3 + 0.5);
      tl.set('#fa3 .t', { opacity: 0 }, 0);
      tl.fromTo('#fa3 .t', { opacity: 0, x: 160, filter: 'blur(8px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'expo.out' }, a3);

      // page A -> page B
      const pg = f.pages[1];
      ['#fa0', '#fa1', '#fa2', '#fa3'].forEach((id, i) => tl.to(id, { x: -180, opacity: 0, duration: 0.3, ease: 'power3.in' }, pg - 0.32 + i * 0.04));
      A.lineOut('#s4-headA > .lmask > span', pg - 0.3, 0.3);
      A.lineIn('#s4-headB > .lmask > span', pg + 0.02, 0.55);

      // B0 — Wi-Fi : arcs qui s'allument l'un après l'autre, lettres qui montent
      tileIn('fb0', b0);
      tl.set('#fb0 .wf', { opacity: 0, scale: 0.6, svgOrigin: '12 20' }, 0);
      tl.fromTo('#fb0 .wf', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2.5)', stagger: 0.12 }, b0);
      const cB0 = FX.chars($('#fb0 .t'));
      tl.set(cB0, { yPercent: 110, opacity: 0 }, 0);
      tl.fromTo(cB0, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.03 }, b0);

      // B1 — Bluetooth : le symbole se trace, le titre se dévoile par masque
      tileIn('fb1', b1);
      tl.set('#fb1 .p', { drawSVG: '0% 0%' }, 0);
      tl.fromTo('#fb1 .p', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power2.inOut' }, b1);
      tl.set('#fb1 .t', { clipPath: 'inset(0% 100% 0% 0%)' }, 0);
      tl.fromTo('#fb1 .t', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'expo.out' }, b1 + 0.05);

      // B2 — connectique : les trois ports glissent, chaque mot claque
      tileIn('fb2', b2);
      tl.set('#fb2 .pt', { opacity: 0, x: -10 }, 0);
      tl.fromTo('#fb2 .pt', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out', stagger: 0.1 }, b2);
      tl.set('#fb2 .t', { opacity: 0 }, 0);
      tl.set('#fb2 .t', { opacity: 1 }, b2);
      tl.set('#fb2 .wd', { scale: 0, opacity: 0 }, 0);
      tl.fromTo('#fb2 .wd', { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.2)', stagger: 0.14 }, b2);

      tl.set('#s4-listB .row', { x: 0 }, 0);
    }
  });
})();
