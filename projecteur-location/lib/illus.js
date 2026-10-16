// Illustrations vectorielles 2D (repli quand aucune photo n'est fournie) :
// v1..v4 = contenu de l'écran (cinéma, football, jeux vidéo, présentations), 940×529
// f1..f4 = silhouettes au premier plan (salon, supporters, manette, public), 1080×420
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


  // ---------- repli « documentaire » (lecture après le clic) : savane au coucher du soleil ----------
  function savanna() {
    const r = R(41);
    let grass = '';
    for (let i = 0; i < 60; i++) { const x = r() * 940, h = 8 + r() * 18; grass += `<path d="M${x.toFixed(0)} 529 l${(r() * 6 - 3).toFixed(1)} -${h.toFixed(0)}" stroke="#2a1608" stroke-width="2"/>`; }
    return `<svg viewBox="0 0 940 529" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="svsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1b4a"/><stop offset=".45" stop-color="#c2552c"/><stop offset=".8" stop-color="#f6a23a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
        <radialGradient id="svsun"><stop offset="0" stop-color="#fff3c2"/><stop offset=".5" stop-color="#ffc35a" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient></defs>
      <rect width="940" height="529" fill="url(#svsky)"/>
      <circle class="sv-glow" cx="600" cy="360" r="210" fill="url(#svsun)"/><circle class="sv-sun" cx="600" cy="360" r="70" fill="#ffe08a"/>
      <path class="sv-hills" d="M-40 529 L-40 400 Q 160 360 330 392 T 700 380 T 1000 396 L1000 529Z" fill="#5a2a1c"/>
      <g class="sv-tree" fill="#1d0f08"><rect x="214" y="300" width="12" height="130"/><path d="M110 300 Q 220 250 340 300 Q 300 318 220 312 Q 150 318 110 300Z"/><path d="M150 270 Q 220 238 300 268 Q 260 282 220 280 Q 180 282 150 270Z"/></g>
      <g class="sv-herd" fill="#1d0f08">
        <path d="M640 438 q10 -34 50 -34 q30 0 44 18 l12 -6 q8 18 -4 30 l0 26 l-10 0 l-2 -20 l-30 0 l-2 20 l-10 0 l0 -22 q-20 6 -30 -2 l-4 24 l-10 0 Z"/>
        <path d="M770 446 q8 -26 38 -26 q24 0 34 14 l9 -5 q6 14 -3 23 l0 20 l-8 0 l-2 -15 l-23 0 l-1 15 l-8 0 l0 -17 q-15 5 -23 -2 l-3 19 l-8 0 Z"/>
      </g>
      <g>${grass}</g>
      <rect y="0" width="940" height="34" fill="#000"/><rect y="495" width="940" height="34" fill="#000"/>
    </svg>`;
  }
  // ---------- repli « photo partagée » (téléphone -> grand écran) : fête entre amis ----------
  function party() {
    const r = R(43);
    let bokeh = '';
    for (let i = 0; i < 26; i++) bokeh += `<circle cx="${(r() * 940).toFixed(0)}" cy="${(r() * 300).toFixed(0)}" r="${(8 + r() * 30).toFixed(0)}" fill="${['#ffd34d', '#ff7a59', '#6ad0ff', '#ffffff'][i % 4]}" opacity="${(0.15 + r() * 0.35).toFixed(2)}"/>`;
    const guy = (x, s, up) => `<g fill="#120a1c"><circle cx="${x}" cy="${330 - 30 * s}" r="${30 * s}"/><path d="M${x - 46 * s} 529 L${x - 40 * s} ${390 - 20 * s} Q${x} ${360 - 30 * s} ${x + 40 * s} ${390 - 20 * s} L${x + 46 * s} 529Z"/>${up ? `<path d="M${x - 30 * s} ${400 - 20 * s} L${x - 70 * s} ${250 - 30 * s}" stroke="#120a1c" stroke-width="${18 * s}" stroke-linecap="round"/><path d="M${x + 30 * s} ${400 - 20 * s} L${x + 66 * s} ${255 - 30 * s}" stroke="#120a1c" stroke-width="${18 * s}" stroke-linecap="round"/>` : ''}</g>`;
    let confetti = '';
    for (let i = 0; i < 40; i++) confetti += `<rect class="pt-cf" x="${(r() * 940).toFixed(0)}" y="${(r() * 420).toFixed(0)}" width="8" height="14" rx="2" fill="${['#ffd34d', '#ff5f7e', '#5fe0ff', '#ffffff'][i % 4]}" transform="rotate(${(r() * 180).toFixed(0)} 0 0)" opacity=".9"/>`;
    return `<svg viewBox="0 0 940 529" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="ptsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1460"/><stop offset=".6" stop-color="#c2366e"/><stop offset="1" stop-color="#ff9a4a"/></linearGradient></defs>
      <rect width="940" height="529" fill="url(#ptsky)"/>${bokeh}
      <g class="pt-cfs">${confetti}</g>
      ${guy(170, 1.0, true)}${guy(330, 1.15, false)}${guy(500, 1.1, true)}${guy(660, 1.2, false)}${guy(820, 1.0, true)}
    </svg>`;
  }
  // ---------- vignettes de repli pour la rangée « À regarder » ----------
  function thumb(i) {
    const P = [['#0b1d4a', '#3a7bd5', 'M0 112 L50 60 L90 92 L140 40 L200 100 L200 112Z'], ['#1b0b33', '#c2366e', 'M0 112 L0 80 L40 80 L40 50 L70 50 L70 70 L110 70 L110 30 L140 30 L140 90 L200 90 L200 112Z'],
      ['#06121f', '#18a0a8', 'M0 80 Q 50 60 100 80 T 200 80 L200 112 L0 112Z'], ['#2a1405', '#f0a03a', 'M0 112 Q 60 70 120 96 T 200 90 L200 112Z']][i % 4];
    return `<svg viewBox="0 0 200 112" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="th${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P[0]}"/><stop offset="1" stop-color="${P[1]}"/></linearGradient></defs><rect width="200" height="112" fill="url(#th${i})"/><circle cx="${140 - i * 20}" cy="38" r="16" fill="#ffffff" opacity=".7"/><path d="${P[2]}" fill="#000" opacity=".45"/></svg>`;
  }

  window.ILLUS = { v1, v2, v3, v4, f1, f2, f3, f4, savanna, party, thumb };
})();
