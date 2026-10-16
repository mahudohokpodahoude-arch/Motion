// SCÈNE 3 — LES USAGES (11 – 21 s)
// L'écran allumé en scène 2 s'agrandit et devient la scène : 4 vignettes illustrées en 2D
// (cinéma, football, jeux vidéo, présentations & événements), chacune révélée par un masque différent,
// silhouettes au premier plan, pastille d'icône qui se transforme (morphing), puis récapitulatif 2×2.
// Aucune mention de console, d'ordinateur ou de plateforme : on illustre des usages, rien n'est promis.
(function () {
  const R = (seed) => window.FX.rng(seed);

  // ---------------- vignettes (contenu de l'écran, 940×529) ----------------
  function v1() {
    const r = R(31);
    let stars = '';
    for (let i = 0; i < 40; i++) stars += `<circle class="v1-star" cx="${(r() * 940).toFixed(0)}" cy="${(50 + r() * 220).toFixed(0)}" r="${(0.8 + r() * 1.8).toFixed(1)}" fill="#fff" opacity="${(0.3 + r() * 0.7).toFixed(2)}"/>`;
    return `<svg viewBox="0 0 940 529">
      <defs>
        <linearGradient id="v1sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120a35"/><stop offset=".5" stop-color="#4b1f66"/><stop offset=".78" stop-color="#c2507a"/><stop offset="1" stop-color="#f6a04a"/></linearGradient>
        <radialGradient id="v1sun"><stop offset="0" stop-color="#fff6c8"/><stop offset=".5" stop-color="#ffc85a" stop-opacity=".8"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="940" height="529" fill="url(#v1sky)"/>
      <g class="v1-stars">${stars}</g>
      <circle class="v1-glow" cx="470" cy="400" r="230" fill="url(#v1sun)"/>
      <circle class="v1-sun" cx="470" cy="400" r="92" fill="#ffd36b"/>
      <path class="v1-m1" d="M-80 529 L-80 330 L40 270 L150 320 L280 220 L400 300 L520 240 L640 310 L760 250 L880 320 L1020 280 L1020 529Z" fill="#5a2a6e"/>
      <path class="v1-m2" d="M-80 529 L-80 400 L90 350 L230 410 L360 360 L520 420 L660 370 L800 430 L1020 380 L1020 529Z" fill="#2a1442"/>
      <path class="v1-m3" d="M-80 529 L-80 462 Q 200 412 420 456 T 1020 440 L1020 529Z" fill="#130a26"/>
      <g class="v1-birds" fill="none" stroke="#1a0f2e" stroke-width="3" stroke-linecap="round"><path d="M600 150 q8 -8 16 0 q8 -8 16 0"/><path d="M640 175 q6 -6 12 0 q6 -6 12 0"/><path d="M575 185 q5 -5 10 0 q5 -5 10 0"/></g>
      <rect y="0" width="940" height="42" fill="#000"/><rect y="487" width="940" height="42" fill="#000"/>
    </svg>`;
  }
  function v2() {
    let stripes = '';
    for (let i = 0; i < 8; i++) stripes += `<rect x="${i * 118}" y="0" width="59" height="529" fill="#24924a"/>`;
    const players = [[260, 200, '#ffbf1f'], [380, 330, '#ffbf1f'], [560, 220, '#ffbf1f'], [640, 320, '#1b3d7a'], [740, 200, '#1b3d7a'], [830, 300, '#1b3d7a']]
      .map(([x, y, c], i) => `<g class="v2-p" data-i="${i}"><ellipse cx="${x}" cy="${y + 16}" rx="16" ry="6" fill="rgba(0,0,0,.25)"/><circle cx="${x}" cy="${y}" r="13" fill="${c}" stroke="#fff" stroke-width="3"/></g>`).join('');
    return `<svg viewBox="0 0 940 529">
      <defs><radialGradient id="v2l"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <rect width="940" height="529" fill="#1e7d3c"/>${stripes}
      <g fill="none" stroke="#fff" stroke-width="4" opacity=".9">
        <rect x="40" y="40" width="860" height="449"/><line x1="470" y1="40" x2="470" y2="489"/><circle cx="470" cy="264" r="70"/>
        <rect x="40" y="150" width="120" height="229"/><rect x="780" y="150" width="120" height="229"/>
      </g>
      <circle cx="470" cy="264" r="5" fill="#fff"/>
      <g class="v2-goal"><rect x="900" y="210" width="28" height="108" fill="none" stroke="#fff" stroke-width="5"/>
        <path d="M904 222 H926 M904 236 H926 M904 250 H926 M904 264 H926 M904 278 H926 M904 292 H926 M904 306 H926 M912 212 V316 M920 212 V316" stroke="#fff" stroke-width="1.5" opacity=".7"/></g>
      ${players}
      <path id="v2-path" d="M300 380 Q 640 90 912 262" fill="none" stroke="none"/>
      <g class="v2-ball"><circle r="17" fill="#fff" stroke="#1a1a1a" stroke-width="2"/><path d="M0 -7 L6.6 -2.2 L4.1 5.7 L-4.1 5.7 L-6.6 -2.2Z" fill="#1a1a1a"/></g>
      <circle cx="0" cy="0" r="420" fill="url(#v2l)"/><circle cx="940" cy="0" r="420" fill="url(#v2l)"/>
      <rect class="v2-flash" width="940" height="529" fill="#fff" opacity="0"/>
    </svg>`;
  }
  function v3() {
    let v = '';
    for (let x = -840; x <= 1780; x += 130) v += `<line x1="470" y1="322" x2="${x}" y2="529" stroke="#ff3fa0" stroke-width="2.5" opacity=".75"/>`;
    let h = '';
    for (let k = 0; k < 7; k++) h += `<line class="v3-h" data-k="${k}" x1="0" x2="940" y1="322" y2="322" stroke="#ff3fa0" stroke-width="2.5" opacity=".8"/>`;
    const r = R(33);
    let st = '';
    for (let i = 0; i < 14; i++) st += `<rect class="v3-streak" x="${(r() * 900).toFixed(0)}" y="${(60 + r() * 220).toFixed(0)}" width="${(60 + r() * 120).toFixed(0)}" height="2" fill="#7df3ff" opacity="${(0.3 + r() * 0.5).toFixed(2)}"/>`;
    return `<svg viewBox="0 0 940 529">
      <defs>
        <linearGradient id="v3sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0224"/><stop offset=".55" stop-color="#3b0b5e"/><stop offset="1" stop-color="#ff3f8e"/></linearGradient>
        <linearGradient id="v3sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe66b"/><stop offset="1" stop-color="#ff3fa0"/></linearGradient>
        <mask id="v3m"><rect width="940" height="529" fill="#fff"/><rect x="0" y="262" width="940" height="7" fill="#000"/><rect x="0" y="282" width="940" height="9" fill="#000"/><rect x="0" y="302" width="940" height="11" fill="#000"/></mask>
      </defs>
      <rect width="940" height="529" fill="url(#v3sky)"/>
      <g class="v3-streaks">${st}</g>
      <circle class="v3-sun" cx="470" cy="250" r="118" fill="url(#v3sun)" mask="url(#v3m)"/>
      <path d="M-20 324 L110 258 L220 302 L330 222 L470 312 L600 232 L720 292 L830 244 L960 324Z" fill="#160433" stroke="#35e4ff" stroke-width="3" stroke-linejoin="round"/>
      <rect x="0" y="322" width="940" height="207" fill="#14031f"/>
      ${v}${h}
      <g class="v3-ship"><path d="M470 420 L424 466 L470 452 L516 466Z" fill="#35e4ff" style="filter:drop-shadow(0 0 10px #35e4ff)"/><path d="M462 462 L470 488 L478 462Z" fill="#ffd34d"/></g>
    </svg>`;
  }
  function v4() {
    const bars = [[520, 92], [600, 150], [680, 196], [760, 262]].map(([x, hh], i) => `<rect class="v4-bar" x="${x}" y="${452 - hh}" width="54" height="${hh}" rx="6" fill="${i % 2 ? '#ffbf1f' : '#0f2a57'}"/>`).join('');
    const bul = [[140, 230], [190, 180], [240, 250], [290, 200]].map(([y, w]) => `<circle cx="64" cy="${y}" r="8" fill="#ffbf1f"/><rect class="v4-txt" x="84" y="${y - 8}" width="${w}" height="16" rx="8" fill="#c5d0e3"/>`).join('');
    return `<svg viewBox="0 0 940 529">
      <rect width="940" height="529" fill="#eef3fb"/>
      <rect width="940" height="78" fill="#0f2a57"/><rect x="30" y="24" width="44" height="30" rx="6" fill="#ffbf1f"/>
      <rect x="92" y="31" width="230" height="16" rx="8" fill="#ffffff" opacity=".85"/><rect x="92" y="53" width="140" height="8" rx="4" fill="#ffffff" opacity=".45"/>
      ${bul}
      <circle cx="170" cy="420" r="62" fill="none" stroke="#d6deec" stroke-width="22"/>
      <circle class="v4-donut" cx="170" cy="420" r="62" fill="none" stroke="#ffbf1f" stroke-width="22" transform="rotate(-90 170 420)"/>
      <line x1="490" y1="452" x2="900" y2="452" stroke="#9fb0cc" stroke-width="3"/><line x1="490" y1="140" x2="490" y2="452" stroke="#9fb0cc" stroke-width="3"/>
      ${bars}
      <path class="v4-line" d="M510 400 L590 352 L670 318 L750 240 L860 168" fill="none" stroke="#e63c6c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle class="v4-dot" cx="860" cy="168" r="10" fill="#e63c6c"/>
    </svg>`;
  }

  // ---------------- premiers plans (silhouettes, 1080×420, posés à y=640) ----------------
  const SIL = 'fill="#040913" stroke="rgba(150,195,255,.55)" stroke-width="2.5"';
  function f1() {
    const head = (x, y, s = 1) => `<g class="f1-p"><ellipse cx="${x}" cy="${y + 66 * s}" rx="${78 * s}" ry="${46 * s}" ${SIL}/><circle cx="${x}" cy="${y}" r="${42 * s}" ${SIL}/></g>`;
    return `<svg viewBox="0 0 1080 420">
      <defs><linearGradient id="f1b" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#9cc8ff" stop-opacity="0"/></linearGradient></defs>
      <polygon class="f1-beam" points="525,420 555,420 990,150 90,150" fill="url(#f1b)" opacity=".35"/>
      <g class="f1-lamp"><rect x="96" y="150" width="8" height="270" fill="#040913"/><path d="M60 150 L140 150 L120 100 L80 100Z" fill="#ffcf6a" opacity=".9"/><ellipse cx="100" cy="155" rx="70" ry="22" fill="#ffcf6a" opacity=".25"/></g>
      <g class="f1-plant" fill="#040913" stroke="rgba(150,195,255,.45)" stroke-width="2"><path d="M985 420 C 960 330, 930 280, 900 250 C 950 270, 985 320, 995 380Z"/><path d="M995 420 C 1000 320, 1030 260, 1060 230 C 1050 290, 1020 350, 1010 420Z"/><path d="M990 420 C 980 340, 990 270, 1000 200 C 1015 270, 1010 350, 1000 420Z"/></g>
      ${head(390, 222)}${head(545, 210, 1.05)}${head(700, 226)}
      <path class="f1-sofa" d="M170 420 L170 300 Q170 268 204 268 L876 268 Q910 268 910 300 L910 420Z" ${SIL}/>
      <path d="M130 420 L130 330 Q130 300 160 300 L200 300 L200 420Z M880 420 L880 300 L920 300 Q950 300 950 330 L950 420Z" ${SIL}/>
    </svg>`;
  }
  function f2() {
    const fan = (x, s, i) => `<g class="f2-p" data-i="${i}">
      <path d="M${x - 34 * s} ${250 * 1} L${x - 70 * s} ${150}" stroke="#040913" stroke-width="${22 * s}" stroke-linecap="round"/>
      <path d="M${x + 34 * s} 250 L${x + 70 * s} 150" stroke="#040913" stroke-width="${22 * s}" stroke-linecap="round"/>
      <path d="M${x - 62 * s} 420 L${x - 50 * s} 262 Q${x} 236 ${x + 50 * s} 262 L${x + 62 * s} 420Z" ${SIL}/>
      <circle cx="${x}" cy="${222}" r="${36 * s}" ${SIL}/></g>`;
    return `<svg viewBox="0 0 1080 420">
      ${fan(130, 1, 0)}${fan(300, 1.08, 1)}${fan(780, 1.08, 4)}${fan(950, 1, 5)}
      <g class="f2-scarf"><rect x="380" y="128" width="320" height="56" rx="6" fill="#ffbf1f"/><rect x="380" y="128" width="40" height="56" fill="#0f2a57"/><rect x="460" y="128" width="40" height="56" fill="#0f2a57"/><rect x="580" y="128" width="40" height="56" fill="#0f2a57"/><rect x="660" y="128" width="40" height="56" fill="#0f2a57"/></g>
      ${fan(460, 1.12, 2)}${fan(620, 1.12, 3)}
    </svg>`;
  }
  function f3() {
    const d = window.FX.ICON.gamepad.split(' M6 11h4')[0];
    let rays = '';
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r0 = 250, r1 = 320 + (i % 3) * 30; rays += `<line class="f3-ray" x1="${(540 + Math.cos(a) * r0).toFixed(0)}" y1="${(230 + Math.sin(a) * r0 * 0.62).toFixed(0)}" x2="${(540 + Math.cos(a) * r1).toFixed(0)}" y2="${(230 + Math.sin(a) * r1 * 0.62).toFixed(0)}" stroke="${i % 2 ? '#ffbf1f' : '#35e4ff'}" stroke-width="5" stroke-linecap="round"/>`; }
    return `<svg viewBox="0 0 1080 420">
      ${rays}
      <g transform="translate(540 236) scale(19) translate(-12 -12)">
        <path class="f3-pad" d="${d}" fill="#0b1a3a" stroke="#ffbf1f" stroke-width=".22" stroke-linejoin="round"/>
        <path class="f3-cross" d="M6 11h4 M8 9v4" stroke="#ffffff" stroke-width=".7" stroke-linecap="round"/>
        <circle class="f3-btn" cx="15.2" cy="12" r=".75" fill="#ff3fa0"/><circle class="f3-btn" cx="17.6" cy="10" r=".75" fill="#35e4ff"/><circle class="f3-btn" cx="17.6" cy="13.6" r=".75" fill="#ffbf1f"/><circle class="f3-btn" cx="19.8" cy="11.8" r=".75" fill="#ffffff"/>
      </g>
    </svg>`;
  }
  function f4() {
    const I = window.FX.ICON;
    let back = '', front = '';
    for (let i = 0; i < 8; i++) { const x = 150 + i * 112; back += `<g class="f4-b"><ellipse cx="${x}" cy="${300}" rx="46" ry="30" ${SIL}/><circle cx="${x}" cy="${256}" r="26" ${SIL}/></g>`; }
    for (let i = 0; i < 6; i++) { const x = 205 + i * 134; front += `<g class="f4-f"><ellipse cx="${x}" cy="${392}" rx="66" ry="44" ${SIL}/><circle cx="${x}" cy="${330}" r="36" ${SIL}/></g>`; }
    const badge = (cls, x, y, d) => `<g class="${cls}" transform="translate(${x} ${y})"><circle r="40" fill="#ffbf1f"/><g transform="translate(-18 -18) scale(1.5)"><path d="${d}" fill="none" stroke="#0a1530" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
    return `<svg viewBox="0 0 1080 420">
      <g class="f4-presenter"><circle cx="980" cy="150" r="30" ${SIL}/><path d="M950 420 L948 222 Q980 196 1012 222 L1010 420Z" ${SIL}/><path d="M952 236 L880 196" stroke="#040913" stroke-width="16" stroke-linecap="round"/><path d="M878 195 L820 160" stroke="#ffbf1f" stroke-width="5" stroke-linecap="round"/></g>
      ${back}${front}
      ${badge('f4-ic1', 80, 120, I.mic)}${badge('f4-ic2', 80, 225, I.calendar)}
    </svg>`;
  }

  const I = window.FX.ICON;
  const LABELS = [['SOIRÉE', 'CINÉMA'], ['MATCHS DE', 'FOOTBALL'], ['JEUX', 'VIDÉO'], ['PRÉSENTATIONS', '& ÉVÉNEMENTS']];
  const TILES = [[I.clapper, 'CINÉMA', ''], [I.ball, 'FOOTBALL', ''], [I.gamepad, 'JEUX VIDÉO', ''], [I.board, 'PRÉSENTATIONS', '& ÉVÉNEMENTS']];

  window.SCENES.push({
    id: 's3',
    html: (V, FX) => `
      <div id="s3w" class="full">
        <div id="s3-halo"></div>
        <div id="s3-screen">
          <div class="scr-in">
            <div class="vig" id="v1">${v1()}</div><div class="vig" id="v2">${v2()}</div><div class="vig" id="v3">${v3()}</div><div class="vig" id="v4">${v4()}</div>
            <div class="scr-flash"></div>
          </div>
          <svg class="frame" viewBox="0 0 960 549"><rect x="10" y="10" width="940" height="529" rx="16" fill="none" stroke="#ffbf1f" stroke-width="7" style="filter:drop-shadow(0 0 14px rgba(255,191,31,.9))"/></svg>
        </div>
        <div id="s3-lights">
          <svg viewBox="0 0 1080 1920" style="position:absolute;inset:0;width:1080px;height:1920px;overflow:visible">
            <defs><linearGradient id="s3lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8dc" stop-opacity=".3"/><stop offset="1" stop-color="#fff8dc" stop-opacity="0"/></linearGradient></defs>
            <g class="tw tw-l"><polygon class="lb" points="120,250 190,250 620,980 -200,980" fill="url(#s3lb)"/>
              <rect x="70" y="208" width="170" height="64" rx="10" fill="#0b1a3a" stroke="#ffbf1f" stroke-width="3"/>
              ${[0, 1, 2, 3].map((i) => `<circle cx="${100 + i * 37}" cy="240" r="13" fill="#fffbe6" style="filter:drop-shadow(0 0 10px #fff)"/>`).join('')}</g>
            <g class="tw tw-r"><polygon class="lb" points="890,250 960,250 1280,980 460,980" fill="url(#s3lb)"/>
              <rect x="840" y="208" width="170" height="64" rx="10" fill="#0b1a3a" stroke="#ffbf1f" stroke-width="3"/>
              ${[0, 1, 2, 3].map((i) => `<circle cx="${870 + i * 37}" cy="240" r="13" fill="#fffbe6" style="filter:drop-shadow(0 0 10px #fff)"/>`).join('')}</g>
          </svg>
        </div>
        <div id="s3-fg"><div class="fg" id="f1">${f1()}</div><div class="fg" id="f2">${f2()}</div><div class="fg" id="f3">${f3()}</div><div class="fg" id="f4">${f4()}</div></div>
        <div id="s3-badge"><svg viewBox="0 0 24 24" fill="none" stroke="#0a1530" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path id="s3-morph" d="${I.clapper}"/></svg></div>
        <div id="s3-labels">${LABELS.map(([a, b], i) => `<div class="lab osw" id="lab${i}"><div class="lmask"><span class="a">${a}</span></div><div class="lmask"><span class="b goldfx glow">${b}</span></div></div>`).join('')}</div>
        <div id="s3-dots"><i></i><i></i><i></i><i></i></div>
        <div id="s3-recap">
          ${TILES.map(([d, t, s], i) => `<div class="tile" id="tile${i}" style="left:${i % 2 ? 570 : 70}px;top:${i < 2 ? 300 : 665}px"><div class="ti">${FX.svgIcon(d, 'tico', 'currentColor', 1.6)}</div><div class="tl">${t}${s ? `<small>${s}</small>` : ''}</div></div>`).join('')}
          <div class="title osw"><div class="lmask"><span class="a">IDÉAL POUR</span></div><div class="lmask"><span class="b goldfx glow">TOUS VOS MOMENTS</span></div></div>
        </div>
      </div>`,
    build(tl, A) {
      const { ev, S, FX } = A, u = ev.usages, $ = FX.$, $$ = FX.$$;
      const t0 = S.S.usages[0], cuts = u.cuts;
      const BAR = S.BAR;
      // ---- états initiaux
      tl.set(['#v2', '#v3', '#v4'], { opacity: 0 }, 0);
      tl.set('#s3-screen', { scale: 710 / 940, y: 436 - 544.5 }, 0);
      tl.set('#s3-halo', { opacity: 0 }, 0);
      tl.set(['#f1', '#f2', '#f3', '#f4'], { opacity: 0, y: 260 }, 0);
      tl.set('#s3-lights', { opacity: 0 }, 0);
      tl.set('#s3-badge', { scale: 0, rotation: 0 }, 0);
      tl.set('#s3-morph', { drawSVG: '0% 0%' }, 0);
      tl.set('#s3-labels .a, #s3-labels .b', { yPercent: 115 }, 0);
      tl.set('#s3-dots i', { opacity: 0, y: 20 }, 0);
      tl.set('#s3-recap .tile', { opacity: 0, scale: 0.6 }, 0);
      tl.set('#s3-recap .tico path', { drawSVG: '0% 0%' }, 0);
      tl.set('#s3-recap .title .a, #s3-recap .title .b', { yPercent: 115 }, 0);

      // ---- 11 s : l'écran de la scène 2 grandit et devient la scène (raccord dans le mouvement)
      tl.fromTo('#s3-screen', { scale: 710 / 940, y: 436 - 544.5 }, { scale: 1, y: 0, duration: 0.65, ease: 'expo.inOut' }, t0 - 0.02);
      tl.fromTo('#s3-screen .scr-flash', { opacity: 1 }, { opacity: 0, duration: 0.55, ease: 'power2.out' }, t0 + 0.12);
      tl.fromTo('#s3-halo', { opacity: 0 }, { opacity: 1, duration: 0.8 }, t0 + 0.1);
      A.flash(t0, 0.3, 0.4);
      // pastille + points de progression
      tl.fromTo('#s3-badge', { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, t0 + 0.3);
      tl.fromTo('#s3-morph', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.45, ease: 'power2.out' }, t0 + 0.4);
      tl.set('#s3-morph', { strokeDasharray: 'none', strokeDashoffset: 0 }, t0 + 0.9); // le morphing change la longueur du tracé
      tl.fromTo('#s3-dots i', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, t0 + 0.35);

      // ---- les 4 usages
      const fgs = ['#f1', '#f2', '#f3', '#f4'], vigs = ['#v1', '#v2', '#v3', '#v4'];
      const morphs = [I.clapper, I.ball, I.gamepad, I.board];
      const dots = $$('#s3-dots i');
      const reveals = [
        null,
        [{ clipPath: 'polygon(-30% 0%, -30% 0%, -60% 100%, -60% 100%)' }, { clipPath: 'polygon(-30% 0%, 160% 0%, 130% 100%, -60% 100%)' }],  // diagonale
        [{ clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }],                                                            // ouverture centrale
        [{ clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)' }]                                                        // iris depuis le coin
      ];
      cuts.forEach((c, i) => {
        // contenu de l'écran
        if (i > 0) {
          tl.set(vigs[i], { opacity: 1 }, c - 0.12);
          tl.fromTo(vigs[i], reveals[i][0], { ...reveals[i][1], duration: 0.5, ease: 'power3.inOut' }, c - 0.12);
          tl.set(vigs[i - 1], { opacity: 0 }, c + 0.4);
          // premier plan sortant
          tl.to(fgs[i - 1], { y: 260, opacity: 0, duration: 0.3, ease: 'power3.in' }, c - 0.25);
          // libellé sortant
          A.lineOut(`#lab${i - 1} .a`, c - 0.2, 0.28);
          A.lineOut(`#lab${i - 1} .b`, c - 0.16, 0.28);
          // pastille : rotation + morphing de l'icône
          tl.to('#s3-badge', { rotation: 360 * i, duration: 0.55, ease: 'back.out(1.6)' }, c - 0.05);
          tl.to('#s3-morph', { morphSVG: morphs[i], duration: 0.45, ease: 'power2.inOut' }, c - 0.05);
        }
        // premier plan entrant
        tl.fromTo(fgs[i], { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, c + 0.05);
        // libellé entrant (mot du haut, puis mot doré)
        A.lineIn(`#lab${i} .a`, u.labels[i] - 0.12, 0.5);
        A.lineIn(`#lab${i} .b`, u.labels[i] - 0.02, 0.55);
        tl.fromTo(`#lab${i} .b`, { scale: 1.15 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, u.labels[i] - 0.02);
        // points de progression
        dots.forEach((d, k) => tl.to(d, { width: k === i ? 92 : 46, backgroundColor: k === i ? '#ffbf1f' : 'rgba(255,255,255,0.28)', duration: 0.35, ease: 'power3.out' }, c));
      });

      // ---- animations internes des vignettes
      // V1 cinéma : soleil couchant, montagnes en parallaxe, étoiles qui scintillent
      tl.fromTo('#v1 .v1-sun', { y: 40 }, { y: -40, duration: 2.4, ease: 'sine.out' }, t0);
      tl.fromTo('#v1 .v1-glow', { y: 40, scale: 0.9, transformOrigin: '470px 400px' }, { y: -40, scale: 1.1, duration: 2.4, ease: 'sine.out' }, t0);
      tl.fromTo('#v1 .v1-m1', { x: -30 }, { x: 30, duration: 2.4, ease: 'none' }, t0);
      tl.fromTo('#v1 .v1-m2', { x: 40 }, { x: -40, duration: 2.4, ease: 'none' }, t0);
      tl.fromTo('#v1 .v1-m3', { x: -60 }, { x: 60, duration: 2.4, ease: 'none' }, t0);
      tl.fromTo('#v1 .v1-birds', { x: -60, y: 10 }, { x: 80, y: -20, duration: 2.4, ease: 'none' }, t0);
      tl.fromTo('#v1 .v1-star', { opacity: 0.2 }, { opacity: 1, duration: 0.5, ease: 'sine.inOut', stagger: { each: 0.05, repeat: 1, yoyo: true } }, t0);
      tl.fromTo('#f1 .f1-beam', { opacity: 0.15 }, { opacity: 0.45, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: 1 }, t0 + 0.2);
      // V2 football : le ballon file au but, filet, éclair, les supporters sautent
      tl.set('#v2 .v2-ball', { x: 300, y: 380 }, 0);
      tl.to('#v2 .v2-ball', { motionPath: { path: '#v2-path', align: '#v2-path', alignOrigin: [0.5, 0.5] }, rotation: 720, duration: 1.0, ease: 'power1.in' }, cuts[1] + 0.3);
      tl.fromTo('#v2 .v2-goal', { scaleX: 1, transformOrigin: '900px 264px' }, { scaleX: 1.5, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1 }, cuts[1] + 1.3);
      tl.fromTo('#v2 .v2-flash', { opacity: 0.6 }, { opacity: 0, duration: 0.5, ease: 'power2.out' }, cuts[1] + 1.3);
      $$('#v2 .v2-p').forEach((p, i) => tl.fromTo(p, { x: 0, y: 0 }, { x: (i < 3 ? 1 : -1) * (30 + i * 6), y: (i % 2 ? -18 : 14), duration: 1.6, ease: 'sine.inOut' }, cuts[1]));
      $$('#f2 .f2-p').forEach((p, i) => {
        tl.fromTo(p, { y: 0 }, { y: -16, duration: BAR / 8, ease: 'sine.out', yoyo: true, repeat: 3 }, cuts[1] + 0.1 + (i % 2) * 0.06);
        tl.fromTo(p, { y: 0 }, { y: -48, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, cuts[1] + 1.3 + i * 0.03);
      });
      tl.fromTo('#f2 .f2-scarf', { rotation: -3, transformOrigin: '540px 156px' }, { rotation: 3, duration: BAR / 4, ease: 'sine.inOut', yoyo: true, repeat: 3 }, cuts[1]);
      // projecteurs de stade (hors écran)
      tl.fromTo('#s3-lights', { opacity: 0 }, { opacity: 1, duration: 0.3 }, cuts[1]);
      tl.fromTo('#s3-lights .tw-l .lb', { rotation: -10, transformOrigin: '155px 250px' }, { rotation: 8, duration: 1.8, ease: 'sine.inOut' }, cuts[1]);
      tl.fromTo('#s3-lights .tw-r .lb', { rotation: 10, transformOrigin: '925px 250px' }, { rotation: -8, duration: 1.8, ease: 'sine.inOut' }, cuts[1]);
      tl.to('#s3-lights', { opacity: 0, duration: 0.25 }, cuts[2] - 0.2);
      // V3 jeux vidéo : sol en grille qui défile, vaisseau, traînées de vitesse
      $$('#v3 .v3-h').forEach((ln) => {
        const k = +ln.dataset.k, y = (q) => 322 + 207 * Math.pow(q / 7, 2);
        tl.fromTo(ln, { attr: { y1: y(k), y2: y(k) } }, { attr: { y1: y(k + 1), y2: y(k + 1) }, duration: 0.5, ease: 'none', repeat: 3 }, cuts[2]);
      });
      tl.fromTo('#v3 .v3-ship', { x: -40, rotation: -6, transformOrigin: '470px 450px' }, { x: 40, rotation: 6, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 3 }, cuts[2]);
      tl.fromTo('#v3 .v3-streak', { x: 300 }, { x: -500, duration: 0.6, ease: 'none', stagger: { each: 0.04, repeat: 2 } }, cuts[2]);
      tl.set('#f3 .f3-pad', { drawSVG: '0% 0%', fillOpacity: 0 }, 0);
      tl.set(['#f3 .f3-cross', '#f3 .f3-btn', '#f3 .f3-ray'], { opacity: 0 }, 0);
      tl.fromTo('#f3 .f3-pad', { drawSVG: '0% 0%', fillOpacity: 0 }, { drawSVG: '0% 100%', duration: 0.55, ease: 'power2.inOut' }, cuts[2] + 0.1);
      tl.to('#f3 .f3-pad', { fillOpacity: 1, duration: 0.3 }, cuts[2] + 0.55);
      tl.fromTo('#f3 .f3-cross', { opacity: 0 }, { opacity: 1, duration: 0.2 }, cuts[2] + 0.6);
      tl.fromTo('#f3 .f3-btn', { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.06 }, cuts[2] + 0.65);
      tl.fromTo('#f3 .f3-ray', { opacity: 0, drawSVG: '0% 0%' }, { opacity: 1, drawSVG: '0% 100%', duration: 0.25, ease: 'power2.out', stagger: 0.02 }, cuts[2] + 0.5);
      tl.to('#f3 .f3-ray', { drawSVG: '100% 100%', duration: 0.3, ease: 'power2.in', stagger: 0.02 }, cuts[2] + 0.95);
      // V4 présentations : graphiques qui se construisent, public, intervenant
      tl.set('#v4 .v4-bar', { scaleY: 0, transformOrigin: '50% 100%' }, 0);
      tl.set('#v4 .v4-line', { drawSVG: '0% 0%' }, 0);
      tl.set('#v4 .v4-donut', { drawSVG: '0% 0%' }, 0);
      tl.set('#v4 .v4-dot', { scale: 0, transformOrigin: '860px 168px' }, 0);
      tl.set('#v4 .v4-txt', { scaleX: 0, transformOrigin: '0% 50%' }, 0);
      tl.fromTo('#v4 .v4-bar', { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.12 }, cuts[3] + 0.3);
      tl.fromTo('#v4 .v4-line', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.inOut' }, cuts[3] + 0.6);
      tl.fromTo('#v4 .v4-dot', { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, cuts[3] + 1.25);
      tl.fromTo('#v4 .v4-donut', { drawSVG: '0% 0%' }, { drawSVG: '0% 72%', duration: 0.8, ease: 'power2.out' }, cuts[3] + 0.4);
      tl.fromTo('#v4 .v4-txt', { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, cuts[3] + 0.25);
      tl.set(['#f4 .f4-b', '#f4 .f4-f'], { y: 0 }, 0);
      tl.fromTo('#f4 .f4-b', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.03 }, cuts[3] + 0.1);
      tl.fromTo('#f4 .f4-f', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.04 }, cuts[3] + 0.15);
      tl.fromTo('#f4 .f4-presenter', { x: 160 }, { x: 0, duration: 0.6, ease: 'expo.out' }, cuts[3] + 0.2);
      tl.fromTo(['#f4 .f4-ic1', '#f4 .f4-ic2'], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.2 }, cuts[3] + 0.6);

      // ---- 19 s : récapitulatif 2×2
      const rc = u.recap;
      tl.to('#s3-screen', { scale: 0.35, y: -80, opacity: 0, duration: 0.35, ease: 'power3.in' }, rc - 0.3);
      tl.to('#s3-halo', { opacity: 0, duration: 0.3 }, rc - 0.3);
      tl.to('#f4', { y: 260, opacity: 0, duration: 0.3, ease: 'power3.in' }, rc - 0.3);
      A.lineOut('#lab3 .a', rc - 0.25, 0.28); A.lineOut('#lab3 .b', rc - 0.2, 0.28);
      tl.to('#s3-badge', { scale: 0, duration: 0.3, ease: 'back.in(2)' }, rc - 0.3);
      tl.to('#s3-dots i', { opacity: 0, y: 20, duration: 0.25, stagger: 0.03 }, rc - 0.3);
      u.tiles.forEach((t, i) => {
        tl.fromTo(`#tile${i}`, { opacity: 0, scale: 0.6, rotation: i % 2 ? 8 : -8, y: 40 }, { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.55, ease: 'back.out(1.8)' }, t);
        tl.fromTo(`#tile${i} .tico path`, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power2.inOut' }, t + 0.08);
      });
      A.lineIn('#s3-recap .title .a', u.recapTitle - 0.1, 0.5);
      A.lineIn('#s3-recap .title .b', u.recapTitle, 0.55);
      tl.fromTo('#s3-recap .tile', { boxShadow: '0 20px 50px rgba(0,0,0,.45), 0 0 30px rgba(255,191,31,.18)' }, { boxShadow: '0 20px 50px rgba(0,0,0,.45), 0 0 60px rgba(255,191,31,.6)', duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1, stagger: 0.06 }, u.recapTitle);
      // ---- 21 s : la ligne de lumière efface la scène de haut en bas
      tl.fromTo('#s3w', { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.55, ease: 'power2.inOut' }, S.S.features[0] - 0.25);
    }
  });
})();
