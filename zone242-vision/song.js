// THE SONG — every sound of the ZONE 242 vision film, rendered from score.js into out/music.wav.
//   node song.js      (STEMS=1 also writes out/stem-*.wav, LUFS=-14 masters to a target loudness)
// An energetic corporate track at 120 BPM (follows score.js ENERGY), a piano hook, and one effect per event.
const path = require('path');
const { Bus, reverb, pingpong } = require('./engine/audio/dsp');
const { SR } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { T, BEAT, DURATION, m, ev, clock, chordAt } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), brass = bus(), fx = bus(), hits = bus();
const verb = bus(), dly = bus();
const kicks = [];

// ================= backing: energetic corporate =================
// driven by the score's energy map: four-on-the-floor kick, clap + snare on 2 and 4, 16th hats,
// a pumping octave bass, syncopated supersaw stabs, a 16th pluck arpeggio; snare rolls into
// every drop and a crash on the downbeat. The sound effects further down are unchanged.
const K = I.kick({ punch: 1, tail: 0.16 }), KS = I.kick({ punch: 0.6, tail: 0.25, seed: 5 });
const CL = I.clap({ spread: 0.9 }), SN = I.snare({ tone: 0.8, snap: 1.2, decay: 0.12 });
const HC = [I.hat(false, 31), I.hat(false, 32)], HO = I.hat(true, 33), SH = [I.shaker(1, 34), I.shaker(0.6, 35)];
const arp = bus(), saw = bus();
const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 3, 4, 3, 2, 1, 2];
const BASS8 = [0, 0, 12, 0, 0, 12, 0, 7];
clock.eachStep(2, 44, 16, (t, b, st) => {
  if (t >= sc.S.isaiah[0] && t < sc.S.final3d[0]) return;     // Isaiah keeps its own strings
  const c = chordAt(t);
  if (!c) return;
  const e = sc.energyAt(t), full = e >= 1, roll = sc.rolls.includes(b);
  // drums
  if (e >= 0.6 && !(roll && st >= 15)) {
    if (st % 4 === 0 && (full || st % 8 === 0) && !(roll && st >= 8)) { drums.addMono(full ? K : KS, t, full ? 0.85 : 0.55); kicks.push(t); }
    if (full && st % 8 === 4 && !roll) { drums.addMono(CL, t, 0.4); drums.addMono(SN, t, 0.22); verb.addMono(CL, t, 0.16); }
    if (full) drums.addMono(st % 4 === 2 ? HO : HC[st % 2], t, st % 4 === 2 ? 0.1 : (st % 2 ? 0.07 : 0.11), 0.25);
    else if (st % 2 === 0) drums.addMono(HC[st % 4 === 0 ? 0 : 1], t, 0.09, 0.25);
    if (full) drums.addMono(SH[st % 2], t, 0.04, -0.35);
  }
  // bass: pumping 8ths with octave jumps (long notes in the breakdown)
  if (st % 2 === 0 && e >= 0.6 && !(roll && st >= 14)) {
    bass.addMono(I.bass(c.bass + 12 + BASS8[st / 2], BEAT / 2 * 0.7, { bright: full ? 0.7 : 0.4, sub: 0.8 }), t, full ? 0.55 : 0.38);
  } else if (e < 0.6 && st === 0) bass.addMono(I.bass(c.bass + 12, BEAT * 3.8, { bright: 0.2, sub: 1 }), t, 0.35);
  // supersaw stabs on the 3-3-2 syncopation (16ths 0, 6, 12) in the full sections
  if (full && (st === 0 || st === 6 || st === 12)) {
    for (const n of c.notes) { const x = I.supersaw(n + 12, BEAT * 0.55, { cutoff: 4200, release: 0.12, seed: n }); saw.addStereo(x.L, x.R, t, 0.05); }
  }
  // pluck arpeggio, 16ths, through the chord and a ninth on top
  if (e >= 0.3) {
    const notes = [...c.notes, c.notes[0] + 12, c.notes[1] + 12];
    const n = notes[ARP[st]] + 12;
    const x = I.pluck(n, { decay: full ? 0.16 : 0.24, cutoff: full ? 4200 : 2400 });
    arp.addMono(x, t, (full ? 0.1 : 0.08) * (st % 4 === 0 ? 1.3 : 1), st % 2 ? 0.4 : -0.4);
    dly.addMono(x, t, 0.03);
  }
  // piano chords: on 1 in the full sections, held in the breakdown
  if (st === 0) for (const n of c.notes) keys.addMono(I.epiano(n + 12, full ? BEAT * 1.2 : BEAT * 3.5, { index: 0.8 }), t, full ? 0.06 : 0.09);
});
// snare rolls: 8ths, then 16ths, louder and louder, a 16th of air before the drop
for (const b of sc.rolls) {
  for (let st = 0; st < 15; st++) {
    if (st < 8 && st % 2) continue;
    const k = st / 15;
    drums.addMono(SN, T(b, st / 4), 0.12 + 0.3 * k, (st % 2 ? 0.15 : -0.15));
  }
  fx.addMono(I.noiseSweep(BEAT * 3.7, 300, 9000, { q: 0.9, shape: (x) => x * x, pink: true }), T(b), 0.22);
}
// drops: crash + sub on the downbeat (the 3D finale brings its own)
for (const t of sc.drops.filter((t) => t < sc.S.final3d[0])) { drums.addMono(I.crash(Math.round(t)), t, 0.4); hits.addMono(I.subBoom(1.4), t, 0.35); }
// the intro: a soft kick on 1 and 3 under the letters
for (let b = 0; b < 2; b++) for (const beat of [0, 2]) { drums.addMono(I.kick({ tail: 0.25 }), T(b, beat), 0.5); kicks.push(T(b, beat)); }

// pads: the chords all the way, darker under the held moments
for (const c of sc.chords) {
  const held = c.t0 >= sc.S.isaiah[0] && c.t0 < sc.S.isaiah[1];
  const opts = held ? { cutoff: 1800, attack: 0.6, release: 1.4 } : { cutoff: 1500, attack: 0.3, release: 0.8 };
  for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0, opts); pad.addStereo(L, R, c.t0, held ? 0.14 : 0.07); }
}
// strings swell under Isaiah, into the light
for (const c of sc.chords.filter((c) => c.t0 >= sc.S.isaiah[0] && c.t0 < sc.S.isaiah[1])) {
  for (const n of c.notes) { const s = I.strings(n + 12, c.t1 - c.t0, { attack: 0.5, release: 0.6, bright: 0.7 }); pad.addStereo(s.L, s.R, c.t0, 0.1); verb.addStereo(s.L, s.R, c.t0, 0.08); }
}

// the hook: bright piano doubled by a pluck lead
for (const n of sc.hook) {
  const x = I.epiano(n.midi, n.dur * 1.6, { index: 1.4 }), p = I.pluck(n.midi + 12, { decay: 0.3, cutoff: 5200 });
  keys.addMono(x, n.t, 0.18, 0.1); keys.addMono(p, n.t, 0.12, -0.1); verb.addMono(x, n.t, 0.1); dly.addMono(p, n.t, 0.06);
}

// ================= 3D opening (0 – 8 s) =================
const o = ev.open;
o.letters.forEach((t, i) => {
  fx.addMono(I.noiseSweep(0.3, 600, 3500, { q: 1.4, pink: true }), t - 0.28, 0.25, -0.45 + i * 0.25);
  hits.addMono(I.thud(85 + i * 6, 0.12), t, 0.7, -0.45 + i * 0.25);
});
hits.addMono(I.pop(1100), o.globePop, 0.5, 0.5);
keys.addMono(I.bell(m('D6'), 1.8), o.globePop + 0.02, 0.12, 0.5);
for (let i = 0; i < 4; i++) fx.addMono(I.noiseSweep(0.6, 3200, 300, { q: 1.2, pink: true }), o.exit + i * 0.05, 0.14, -0.5 + i * 0.3);
fx.addMono(I.noiseSweep(o.cut - o.climax, 200, 9000, { q: 0.9, shape: (x) => x * x, pink: true }), o.climax, 0.45);
for (let t = 2.5, k = 0; t < o.cut - 0.02; k++) { drums.addMono(I.snare({ snap: 0.6 }), t, 0.12 + 0.25 * (t - 2.5) / 1.4, 0.05); t += t < 3.0 ? BEAT / 2 : t < 3.5 ? BEAT / 4 : BEAT / 8; }
// the birth
const birth = (t) => {
  hits.addMono(I.subBoom(2.4), t, 0.95);
  drums.addMono(I.crash(21), t, 0.45, -0.2);
  keys.addMono(I.bell(m('D5'), 3.2), t, 0.22, -0.2); verb.addMono(I.bell(m('A5'), 3.2), t + 0.015, 0.2);
  for (let i = 0; i < 24; i++) keys.addMono(I.bell(m('A6') + [0, 2, 4, 7, 9, 12][i % 6], 0.5), t + 0.03 + (i / 24) ** 1.6 * 1.2, 0.035, ((i * 37) % 17) / 8.5 - 1);
};
const assemble = (cue) => {
  hits.addMono(I.pop(1600), cue.cube, 0.45);
  fx.addMono(I.noiseSweep(0.9, 700, 4500, { q: 1.8, pink: true }), cue.cube + 0.13, 0.18, 0.15);
  cue.corners.forEach((t, i) => { hits.addMono(I.thwack(), t, 0.42, [-0.7, 0.7, 0.7, -0.7][i]); hits.addMono(I.woodTick(1.6 + i * 0.12), t, 0.3, [-0.7, 0.7, 0.7, -0.7][i]); });
  cue.zne.forEach((t, i) => hits.addMono(I.thud(110, 0.1), t, 0.55, -0.5 + i * 0.2));
  fx.addMono(I.noiseSweep(0.65, 1200, 7000, { q: 3, pink: false }), cue.frame - 0.35, 0.12, 0.45);
  hits.addMono(I.thwack(), cue.frame, 0.3, 0.45);
  cue.digits.forEach((t, i) => { hits.addMono(I.pop(1500 + i * 300), t, 0.4, 0.3 + i * 0.12); keys.addMono(I.marimba(m('D6') + [0, 4, 7][i]), t, 0.2); });
  fx.addMono(I.noiseSweep(2, 250, 2400, { q: 0.9, pink: true }), cue.swing, 0.24);
};
birth(o.birth);
assemble({ cube: o.cube, corners: o.corners, zne: o.zne, frame: o.frame, digits: o.digits, swing: o.swing });

// ================= 2D scenes =================
// every word stamp is a soft knock; every scene cut a whoosh
for (const t of Object.values(sc.S).map((r) => r[0]).filter((t) => t > 0 && t < sc.S.final3d[0])) fx.addMono(I.noiseSweep(0.3, 4000, 600, { q: 1.2, pink: true }), t - 0.05, 0.2);
ev.vision.words.forEach((t, i) => hits.addMono(I.thud(140 - i * 6, 0.07), t, i === 3 ? 0.75 : 0.45));
drums.addMono(I.crash(9), ev.vision.words[3], 0.25, 0.3);
ev.rooted.lines.forEach((t) => fx.addMono(I.paperFwip(1, Math.round(t * 10)), t, 0.25));
fx.addMono(I.noiseSweep(0.35, 900, 6000, { q: 2, pink: true }), ev.rooted.hit, 0.2);
// the crowd fills, then the viewfinder finds one person
for (let i = 0; i < 12; i++) hits.addMono(I.woodTick(1 + i * 0.08), ev.crowd.fill + i * 0.05, 0.12, ((i * 7) % 5) / 2.5 - 1);
fx.addMono(I.noiseSweep(0.35, 300, 3000, { q: 1.5, pink: true }), ev.crowd.lock - 0.35, 0.25);
hits.addMono(I.thwack(), ev.crowd.lock, 0.55);
keys.addMono(I.bell(m('A5'), 2.4), ev.crowd.lock, 0.2);
hits.addMono(I.thud(100, 0.1), ev.crowd.text2, 0.5);
// Acts 2:42: four corners, then the centre
ev.acts.corners.forEach((t, i) => { hits.addMono(I.woodTick(1.2 + i * 0.15), t, 0.4, [-0.6, 0.6, 0.6, -0.6][i]); keys.addMono(I.marimba(m('D5') + [0, 4, 7, 11][i]), t, 0.25, [-0.6, 0.6, 0.6, -0.6][i]); });
hits.addMono(I.pop(1400), ev.acts.center, 0.5);
keys.addMono(I.bell(m('D6'), 2.5), ev.acts.center, 0.16);
// the three movements: each starts with a crash and a brass stab
for (const [mv, notes] of [[ev.connect, [m('D4'), m('F#4'), m('A4')]], [ev.transform, [m('G4'), m('B4'), m('D5')]], [ev.send, [m('A4'), m('C#5'), m('E5')]]]) {
  drums.addMono(I.crash(Math.round(mv.word)), mv.word, 0.35);
  fx.addMono(I.noiseSweep(0.45, 5000, 500, { q: 1.1, pink: true }), mv.word - 0.02, 0.3);
  for (const n of notes) { const b = I.brassNote(n, 0.35, { stab: 1 }); brass.addStereo(b.L, b.R, mv.word, 0.14); }
  const steps = mv.nodes || mv.steps || mv.arrows;
  steps.forEach((t, i) => { keys.addMono(I.marimba(notes[i] + 12), t, 0.3, -0.4 + i * 0.4); hits.addMono(I.pop(1300 + i * 250), t, 0.5, -0.4 + i * 0.4); hits.addMono(I.thud(120, 0.06), t, 0.35, -0.4 + i * 0.4); });
  for (const n of notes) { const b = I.brassNote(n + 12, 0.6); brass.addStereo(b.L, b.R, mv.tag, 0.12); verb.addStereo(b.L, b.R, mv.tag, 0.05); }
}
// ---------- the life of the Zone ----------
// the week: each row slides in with a whoosh and a marimba note climbing the scale
const scale = ['D5', 'E5', 'F#5', 'A5', 'B5'].map(m);
ev.week.items.forEach((t, i) => { fx.addMono(I.noiseSweep(0.22, 900, 5000, { q: 2, pink: true }), t - 0.15, 0.14, -0.5); keys.addMono(I.marimba(scale[i]), t, 0.3, -0.3 + i * 0.15); hits.addMono(I.thud(120, 0.06), t, 0.35); });
// generations: the photo pops, then four bubbles
hits.addMono(I.pop(1100), ev.gens.photo, 0.45); fx.addMono(I.noiseSweep(0.4, 600, 4000, { q: 1.5, pink: true }), ev.gens.photo - 0.3, 0.16);
ev.gens.items.forEach((t, i) => { hits.addMono(I.pop(1400 + i * 250), t, 0.45, -0.45 + i * 0.3); keys.addMono(I.bell(scale[i] + 12, 0.8), t, 0.06, -0.45 + i * 0.3); });
// the photo pairs: each photo sweeps in, its label slams on
for (const e of [ev.menwomen, ev.couples, ev.camps]) {
  [e.a, e.b].forEach((t, i) => {
    fx.addMono(I.noiseSweep(0.5, i ? 5000 : 400, i ? 500 : 5000, { q: 1.1, pink: true }), t - 0.08, 0.28, i ? 0.6 : -0.6);
    hits.addMono(I.thwack(), t + 0.2, 0.35, i ? 0.4 : -0.4);
    hits.addMono(I.thud(90, 0.1), t + 0.2, 0.45);
  });
  drums.addMono(I.crash(Math.round(e.a * 3)), e.a, 0.22);
  for (const n of ['D4', 'F#4', 'A4']) { const b = I.brassNote(m(n) + 12, 0.55); brass.addStereo(b.L, b.R, e.tag, 0.1); verb.addStereo(b.L, b.R, e.tag, 0.04); }
}
// signature programmes: four tiles flip in
drums.addMono(I.crash(61), ev.signature.title, 0.3);
ev.signature.items.forEach((t, i) => { hits.addMono(I.woodTick(1.3 + i * 0.12), t, 0.4, [-0.5, 0.5, -0.5, 0.5][i]); hits.addMono(I.pop(1200 + i * 200), t, 0.35, [-0.5, 0.5, -0.5, 0.5][i]); keys.addMono(I.marimba(scale[i] + 12), t, 0.2); });
for (const n of ['G4', 'B4', 'D5']) { const b = I.brassNote(m(n), 0.6); brass.addStereo(b.L, b.R, ev.signature.tag, 0.12); }
// the big gatherings: each card slams over the last, heavier and heavier
drums.addMono(I.crash(71), ev.gather.title, 0.3);
ev.gather.items.forEach((t, i) => {
  fx.addMono(I.noiseSweep(0.35, i % 2 ? 6000 : 300, i % 2 ? 400 : 6000, { q: 1, pink: true }), t - 0.2, 0.26, i % 2 ? 0.5 : -0.5);
  hits.addMono(I.subBoom(0.9), t, 0.3 + i * 0.08);
  hits.addMono(I.thwack(), t, 0.35);
  const b = I.brassNote(m(['D4', 'F#4', 'A4', 'D5'][i]), 0.45, { stab: 1 }); brass.addStereo(b.L, b.R, t, 0.13);
});
for (const n of ['A4', 'C#5', 'E5']) { const b = I.brassNote(m(n), 0.8); brass.addStereo(b.L, b.R, ev.gather.tag, 0.12); verb.addStereo(b.L, b.R, ev.gather.tag, 0.05); }

// sunday gathers, monday sends
fx.addMono(I.noiseSweep(0.6, 6000, 300, { q: 1, pink: true }), ev.sunday.gather, 0.3);
hits.addMono(I.thud(80, 0.14), ev.sunday.gather + 0.55, 0.6);
hits.addMono(I.subBoom(1.6), ev.sunday.send, 0.6);
drums.addMono(I.crash(31), ev.sunday.send, 0.4);
fx.addMono(I.noiseSweep(1, 300, 9000, { q: 0.8, pink: true }), ev.sunday.send, 0.28);
for (let i = 0; i < 16; i++) keys.addMono(I.bell(m('D6') + [0, 2, 4, 7, 9][i % 5], 0.4), ev.sunday.send + 0.05 + i * 0.04, 0.03, (i % 2 ? 1 : -1) * (i / 16));
// the goal: the counter ticks faster and faster, then the stamp
{
  const a = ev.cap.countFrom, b = ev.cap.countTo;
  let t = a, i = 0;
  while (t < b) { hits.addMono(I.woodTick(1.8 + (t - a) / (b - a)), t, 0.16, 0.2); t += lerpStep((t - a) / (b - a)); i++; }
  fx.addMono(I.noiseSweep(b - a, 300, 7000, { q: 1, shape: (x) => x * x, pink: true }), a, 0.18);
  hits.addMono(I.pop(1200), b, 0.5);
  hits.addMono(I.thwack(), ev.cap.stamp, 0.6); hits.addMono(I.subBoom(1.4), ev.cap.stamp, 0.6);
  drums.addMono(I.crash(41), ev.cap.stamp, 0.35);
}
function lerpStep(k) { return BEAT / 2 - (BEAT / 2 - BEAT / 8) * k; }
// Isaiah: a voice of light, the riser into the finale, then silence
[ev.isaiah.l1, ev.isaiah.l2, ev.isaiah.l3].forEach((t, i) => { const v = I.voice(m('A4') + [0, 2, 4][i], 1.6, { syl: 'o', type: 'alto', vib: 0.5 }); keys.addMono(v, t, 0.12); verb.addMono(v, t, 0.16); });
keys.addMono(I.bell(m('A5'), 2.5), ev.isaiah.ref, 0.14);
fx.addMono(I.noiseSweep(ev.isaiah.cut - ev.isaiah.swell, 200, 10000, { q: 0.8, shape: (x) => x * x * x, pink: true }), ev.isaiah.swell, 0.5);

// ================= 3D finale (52 – 60 s) =================
const f = ev.fin;
birth(f.birth);
assemble({ cube: f.cube, corners: f.corners, zne: f.zne, frame: f.frame, digits: f.digits, swing: f.swing });
drums.addMono(I.crash(51), f.tag, 0.35);
hits.addMono(I.subBoom(2), f.tag, 0.45);
for (const n of ['D5', 'F#5', 'A5']) keys.addMono(I.bell(m(n), 3), f.tag + 0.03 * ['D5', 'F#5', 'A5'].indexOf(n), 0.14);
keys.addMono(I.bell(m('D6'), 2), f.welcome, 0.12);

// ================= mix =================
MIX.sidechain([pad, bass, arp, saw], kicks.filter((t) => t >= T(4)), { depth: 0.55 });
const stems = {
  drums, bass, pad, keys, arp, saw, brass, fx, hits,
  verb: reverb(verb, { room: 0.85, damp: 0.35 }),
  dly: pingpong(dly, BEAT * 0.75, 0.35, 3500),
};
const GAIN = { saw: 10, arp: 2, drums: 0.6, bass: 0.5, pad: 1.8, keys: 0.9, brass: 1.6, fx: 0.8, hits: 0.9, verb: 1, dly: 1 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 24);
MIX.gate(mix, ev.open.cut, ev.open.birth);     // the held breath before the birth
MIX.gate(mix, ev.isaiah.cut, ev.fin.birth);    // and before the finale
MIX.fadeOut(mix, DURATION - 1.5, DURATION);
const M = MIX.master(mix, 0.8, undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
