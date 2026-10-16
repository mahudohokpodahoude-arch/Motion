// THE SCORE — single source of truth for the music AND the picture of the ZONE 242 vision film.
// 120 BPM, bar 0 at t = 0: one bar = 2 s, every scene starts on a bar line.
// Two scenes are 3D (rendered by ../milmo-zone242/v3-3d, composited in compose.mjs):
//   open3d  [0, 8)   = 3D film time 0..8   (MILMO gives birth to ZONE 242)
//   final3d [52, 60) = 3D film time 4..12  (the flash, the logo assembles, "Bienvenue dans la Zone")
// Their cue times below are copied from v3-3d/index.html so song.js can score them.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock, placeBar, makeChords } = MU;

  const FPS = 30;
  const STYLE = 'flat';
  const FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const WIDE = W / H > 1.2;
  const clock = makeClock({ bpm: 120, offset: 0 });
  const { T, BEAT } = clock;
  const DURATION = 90;

  // ---------- scenes (bar lines) ----------
  const S = {
    open3d: [0, T(4)],
    vision: [T(4), T(6)],
    rooted: [T(6), T(8)],
    crowd: [T(8), T(10)],
    acts: [T(10), T(12)],
    connect: [T(12), T(14)],
    transform: [T(14), T(16)],
    send: [T(16), T(18)],
    sunday: [T(18), T(20)],
    // the life of the Zone: the week, the generations, the communities, the events
    week: [T(20), T(22)],
    gens: [T(22), T(24)],
    menwomen: [T(24), T(26)],
    couples: [T(26), T(28)],
    camps: [T(28), T(30)],
    signature: [T(30), T(32)],
    gather: [T(32), T(35)],
    cap: [T(35), T(38)],
    isaiah: [T(38), T(41)],
    final3d: [T(41), DURATION],
  };
  const D3_OFFSET = { open3d: 0, final3d: T(41) - 4 }; // film time - 3D time

  // ---------- harmony: D major, warm and lifting ----------
  const { chords, chordAt } = makeChords(clock, {
    D: { notes: ['F#3', 'A3', 'D4'], bass: 'D2' },
    Bm: { notes: ['F#3', 'B3', 'D4'], bass: 'B1' },
    G: { notes: ['G3', 'B3', 'D4'], bass: 'G1' },
    A: { notes: ['E3', 'A3', 'C#4'], bass: 'A1' },
    Gmaj7: { notes: ['F#3', 'B3', 'D4'], bass: 'G1' },
    Dadd9: { notes: ['F#3', 'A3', 'E4'], bass: 'D2' },
  }, (() => {
    const rows = [];
    const prog = ['D', 'A', 'Bm', 'G'];
    for (let b = 0; b < 45; b++) rows.push([b, 0, 4, b >= 38 && b < 41 ? ['Gmaj7', 'A', 'Bm'][b - 38] : prog[b % 4]]);
    rows[44] = [44, 0, 4, 'Dadd9'];
    return rows;
  })());

  // hook, played by marimba / brass on the groove sections (8th-note grid)
  const HOOK = {
    a: [['F#5', 0, 1], ['A5', 1, 1], ['B5', 2, 2], ['A5', 4, 1], ['F#5', 5, 1], ['E5', 6, 2]],
    b: [['D5', 0, 1], ['F#5', 1, 1], ['A5', 2, 2], ['B5', 4, 1], ['A5', 5, 1], ['F#5', 6, 1], ['E5', 7, 1]],
  };
  const hookBars = [4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 20, 21, 24, 25, 28, 29, 30, 31];
  const hook = hookBars.flatMap((b, i) => placeBar(clock, i % 2 ? HOOK.b : HOOK.a, b));

  // ---------- events ----------
  const ev = {
    // 3D opening (3D time = film time)
    open: { letters: [0.15, 0.27, 0.39, 0.51].map((a) => a + 0.22), globePop: 0.86, exit: 2.33, climax: 2.55,
      cut: 3.93, birth: 4.0, cube: 4.12, corners: [5.15, 5.22, 5.29, 5.36], zne: [5.55, 5.7, 5.82], frame: 6.05,
      digits: [6.2, 6.32, 6.44], swing: 6.6 },
    // 2D
    vision: { kicker: T(4), words: [T(4, 1), T(4, 2), T(4, 3), T(5, 0), T(5, 1), T(5, 2)] },
    rooted: { lines: [T(6, 0), T(6, 2), T(7, 0)], hit: T(7, 2) },
    crowd: { fill: T(8), text1: T(8, 1), lock: T(9, 0), text2: T(9, 1) },
    acts: { ref: T(10), corners: [T(10, 1), T(10, 2), T(10, 3), T(11, 0)], center: T(11, 1), line: T(11, 2) },
    connect: { word: T(12), nodes: [T(12, 2), T(12, 3), T(13, 0)], tag: T(13, 2) },
    transform: { word: T(14), steps: [T(14, 2), T(14, 3), T(15, 0)], tag: T(15, 2) },
    send: { word: T(16), arrows: [T(16, 2), T(16, 3), T(17, 0)], tag: T(17, 2) },
    sunday: { gather: T(18), line1: T(18, 1), send: T(19), line2: T(19, 1) },
    week: { title: T(20), items: [T(20, 1), T(20, 2), T(20, 3), T(21, 0), T(21, 1)], tag: T(21, 2) },
    gens: { title: T(22), photo: T(22, 0.5), items: [T(22, 2), T(22, 3), T(23, 0), T(23, 1)], tag: T(23, 2) },
    menwomen: { a: T(24), b: T(24, 2), tag: T(25, 2) },
    couples: { a: T(26), b: T(26, 2), tag: T(27, 2) },
    camps: { a: T(28), b: T(28, 2), tag: T(29, 2) },
    signature: { title: T(30), items: [T(30, 1), T(30, 2), T(30, 3), T(31, 0)], tag: T(31, 2) },
    gather: { title: T(32), items: [T(32, 1), T(32, 3), T(33, 1), T(33, 3)], tag: T(34, 1) },
    cap: { start: T(35), countFrom: T(35, 1), countTo: T(37), label: T(37, 1), stamp: T(37, 2) },
    isaiah: { l1: T(38, 1), l2: T(39, 0), l3: T(39, 2), ref: T(40, 0), swell: T(40, 0), cut: T(40, 3.85) },
    // 3D finale (film time = 3D time + D3_OFFSET.final3d)
    fin: (() => { const o = D3_OFFSET.final3d; return { birth: 4.0 + o, cube: 4.12 + o, corners: [5.15, 5.22, 5.29, 5.36].map((x) => x + o),
      zne: [5.55, 5.7, 5.82].map((x) => x + o), frame: 6.05 + o, digits: [6.2, 6.32, 6.44].map((x) => x + o),
      swing: 6.6 + o, tag: 8.0 + o, welcome: 10.3 + o }; })(),
  };

  const markers = {
    birth: { t: ev.open.birth, sync: 'a' },
    vision: { t: T(4), sync: 'av' },
    lock: { t: ev.crowd.lock, sync: 'av' },
    acts: { t: T(10), sync: 'av' },
    connect: { t: T(12), sync: 'av' },
    transform: { t: T(14), sync: 'av' },
    send: { t: T(16), sync: 'av' },
    sunday: { t: T(18), sync: 'av' },
    week: { t: T(20), sync: 'av' },
    menwomen: { t: T(24), sync: 'av' },
    signature: { t: T(30), sync: 'av' },
    gather: { t: T(32), sync: 'av' },
    stamp: { t: ev.cap.stamp, sync: 'av' },
    isaiah: { t: T(38), sync: 'v' },
    final: { t: T(41), sync: 'a' },
  };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, WIDE, DURATION, clock, T, BEAT, S, D3_OFFSET, m, chords, chordAt, HOOK, hook, ev, markers };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
