// LA BANDE-SON — musique électro-cinématique + sound design, synthétisés de zéro à partir de score.js.
// Aucun échantillon, aucune voix : tout est généré ici (droits d'usage commercial sans ambiguïté).
//   node sound/song.js            -> assets/audio/soundtrack.wav
//   STEMS=1 node sound/song.js    -> + sound/out/stem-*.wav (mesure par piste : node sound/engine/tools/levels.js ...)
const path = require('path');
const fs = require('fs');
const { Bus, reverb, pingpong, SR, TAU } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const { m, mtof } = require('./engine/music');
const sc = require('../score');
const { T, BEAT, DURATION, ev, ENERGY, PROG } = sc;
const S_ = sc.S;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), arp = bus(), saw = bus(), lead = bus(), keys = bus();
const fx = bus(), hits = bus(), verb = bus(), dly = bus();
const kicks = [];

// ---------- petits sons maison ----------
const buf = (sec) => new Float32Array(Math.max(1, Math.ceil(sec * SR)));
// balayage sinusoïdal (la ligne lumineuse, les tracés)
function sweepTone(len, f0, f1, { att = 0.05, rel = 0.25, harm = 0.25 } = {}) {
  const out = buf(len); let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR, x = t / len, f = f0 * Math.pow(f1 / f0, x);
    ph += f / SR;
    const env = Math.min(1, t / att) * Math.min(1, (len - t) / rel);
    out[i] = (Math.sin(TAU * ph) + harm * Math.sin(TAU * ph * 2.01)) * env * 0.6;
  }
  return out;
}
// « bloop » de bulle (icône WhatsApp)
function bloop(f0 = 420, f1 = 980, len = 0.16) {
  const out = buf(len); let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR, x = t / len;
    ph += (f0 + (f1 - f0) * Math.sqrt(x)) / SR;
    out[i] = Math.sin(TAU * ph) * Math.min(1, t / 0.004) * Math.exp(-t / 0.06) * 0.9;
  }
  return out;
}
// blip 8 bits (jeux vidéo)
function chipBlip(midi, len = 0.09) {
  const out = buf(len); let ph = 0; const f = mtof(midi);
  for (let i = 0; i < out.length; i++) { ph += f / SR; out[i] = ((ph % 1) < 0.25 ? 0.5 : -0.5) * Math.min(1, (len - i / SR) / 0.01); }
  return out;
}
const whoosh = (t, len = 0.4, down = true, g = 0.28, pan = 0) =>
  fx.addMono(I.noiseSweep(len, down ? 5200 : 420, down ? 480 : 5200, { q: 1.1, pink: true }), t - len * 0.8, g, pan);
const stamp = (t, g = 0.5, f = 105) => { hits.addMono(I.thud(f, 0.09), t, g); hits.addMono(I.woodTick(1.25), t, g * 0.35); };

// ---------- harmonie ----------
const CH = {
  Am: { notes: ['A3', 'C4', 'E4'], bass: 'A1' },
  F: { notes: ['A3', 'C4', 'F4'], bass: 'F1' },
  C: { notes: ['G3', 'C4', 'E4'], bass: 'C2' },
  G: { notes: ['G3', 'B3', 'D4'], bass: 'G1' },
};
for (const k in CH) { CH[k].notes = CH[k].notes.map(m); CH[k].bass = m(CH[k].bass); }
// accroche mélodique (croches : [note, début, durée]) — une cellule par accord
const HOOK = {
  Am: [['E5', 0, 1], ['A5', 1, 1], ['C6', 2, 1], ['B5', 3, 1], ['A5', 4, 2], ['E5', 6, 2]],
  F: [['F5', 0, 1], ['A5', 1, 1], ['C6', 2, 1], ['A5', 3, 1], ['G5', 4, 2], ['E5', 6, 2]],
  C: [['E5', 0, 1], ['G5', 1, 1], ['C6', 2, 1], ['G5', 3, 1], ['E5', 4, 2], ['G5', 6, 2]],
  G: [['D5', 0, 1], ['G5', 1, 1], ['B5', 2, 1], ['D6', 3, 1], ['B5', 4, 2], ['G5', 6, 2]],
};
const HOOK_BARS = [4, 5, 6, 7, 10, 15, 16, 19, 20];

// ================= le groove, mesure par mesure =================
const K = I.kick({ punch: 1, tail: 0.2 }), KS = I.kick({ punch: 0.55, tail: 0.3, seed: 4 });
const CL = I.clap({ decay: 0.14 }), SN = I.snare({ tone: 0.8, snap: 1.2, decay: 0.12 });
const HC = [I.hat(false, 31), I.hat(false, 32)], HO = I.hat(true, 33);
const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 3, 4, 3, 2, 1, 2];
const BASS8 = [0, 0, 12, 0, 0, 12, 0, 7];
for (let b = 0; b <= 20; b++) {
  const e = ENERGY[b], c = CH[PROG[b]], build = b === 14;
  for (let st = 0; st < 16; st++) {
    const t = T(b, st / 4);
    if (build && t >= ev.price.breath) break;           // une croche de silence avant la chute
    // --- batterie
    if (e >= 0.75 || build) {
      if (st % 4 === 0) { drums.addMono(e >= 0.8 ? K : KS, t, e >= 0.8 ? 0.85 : 0.6); kicks.push(t); }
      if (e >= 0.85 && st % 8 === 4) { drums.addMono(CL, t, 0.42); drums.addMono(SN, t, 0.18); verb.addMono(CL, t, 0.12); }
      if (st % 4 === 2) drums.addMono(HO, t, e >= 1 ? 0.11 : 0.08, 0.2);
      else if (e >= 1 || st % 2 === 0) drums.addMono(HC[st % 2], t, st % 2 ? 0.05 : 0.08, -0.2);
    } else if (e > 0 && (st === 0 || st === 8)) { drums.addMono(KS, t, 0.5); kicks.push(t); }
    // --- basse : croches pompées (pulsation discrète en intro)
    if (st % 2 === 0) {
      const full = e >= 0.75;
      const n = c.bass + 12 + (full ? BASS8[st / 2] : 0);
      bass.addMono(I.bass(n, BEAT / 2 * 0.7, { bright: full ? 0.65 : 0.25, sub: 0.8 }), t, full ? 0.5 : 0.32);
    }
    // --- arpège pluck en doubles-croches
    if (e >= 0.45) {
      const notes = [...c.notes, c.notes[0] + 12, c.notes[1] + 12];
      const x = I.pluck(notes[ARP[st]] + 12, { decay: e >= 1 ? 0.15 : 0.22, cutoff: e >= 0.8 ? 3800 : 1900 });
      arp.addMono(x, t, (e >= 0.8 ? 0.09 : 0.07) * (st % 4 === 0 ? 1.3 : 1), st % 2 ? 0.4 : -0.4);
      dly.addMono(x, t, 0.025);
    }
    // --- stabs supersaw (3-3-2) dans les sections pleines
    if (e >= 1 && (st === 0 || st === 6 || st === 12)) {
      for (const n of c.notes) { const s = I.supersaw(n + 12, BEAT * 0.55, { cutoff: 4200, release: 0.12, seed: n }); saw.addStereo(s.L, s.R, t, 0.045); }
    }
  }
  // --- nappes : l'accord tenu toute la mesure
  for (const n of c.notes) {
    const p = I.padNote(n, sc.BAR, { cutoff: build ? 2600 : 1500, attack: 0.25, release: 0.8 });
    pad.addStereo(p.L, p.R, T(b), build ? 0.1 : 0.065);
  }
  // --- accroche mélodique
  if (HOOK_BARS.includes(b)) for (const [n, s, d] of HOOK[PROG[b]]) {
    const t = T(b, s / 2);
    const x = I.pluck(m(n), { decay: 0.32, cutoff: 5200 }), y = I.epiano(m(n), d * BEAT / 2 * 1.4, { index: 1.2 });
    lead.addMono(x, t, 0.12, 0.12); lead.addMono(y, t, 0.1, -0.12); dly.addMono(x, t, 0.05); verb.addMono(y, t, 0.05);
  }
}

// ================= 0 – 5 s : accroche =================
const h = ev.hook;
fx.addMono(sweepTone(h.lineEnd - h.line, 220, 2400, { att: 0.05, rel: 0.12 }), h.line, 0.16, -0.6);
fx.addMono(I.noiseSweep(h.open - h.line, 300, 9000, { q: 0.9, shape: (x) => x * x, pink: true }), h.line, 0.32);
hits.addMono(I.subBoom(2.4), h.open, 0.9);
drums.addMono(I.crash(7), h.open, 0.38);
hits.addMono(I.thwack(), h.open, 0.45);
for (const n of [m('A2'), m('E3'), m('A3')]) { const s = I.strings(n, 3.6, { attack: 0.02, release: 1.2, bright: 0.6 }); pad.addStereo(s.L, s.R, h.open, 0.12); verb.addStereo(s.L, s.R, h.open, 0.06); }
whoosh(h.open + 0.35, 0.5, true, 0.18);                  // les formes s'ouvrent
h.words.forEach((t, i) => stamp(t, i === h.words.length - 1 ? 0.7 : 0.5, 100 + i * 8));
keys.addMono(I.bell(mtof(m('E6')), 1.4), h.words[h.words.length - 1], 0.1);

// ================= 5 – 9 s : le produit =================
const p = ev.product;
whoosh(p.cut, 0.45, true, 0.3); drums.addMono(I.crash(11), p.cut, 0.32); hits.addMono(I.subBoom(1.2), p.cut, 0.4);
fx.addMono(sweepTone(p.trace[1] - p.trace[0], 600, 3200, { att: 0.2, rel: 0.4, harm: 0.4 }), p.trace[0], 0.07, 0.3);
fx.addMono(I.noiseSweep(p.trace[1] - p.trace[0], 1800, 9000, { q: 5, pink: false }), p.trace[0], 0.09, -0.3);
fx.addMono(I.glass(5, { size: 0.5 }), p.flare, 0.09, 0.4);
keys.addMono(I.bell(mtof(m('E7')), 1.2, 1.5), p.flare, 0.07, 0.4); verb.addMono(I.bell(mtof(m('B6')), 1.2), p.flare + 0.02, 0.07);
for (const t of [p.line1, p.line2]) { stamp(t, 0.55); hits.addMono(I.pop(1500), t, 0.3); whoosh(t, 0.3, false, 0.14, 0.4); }
fx.addMono(I.noiseSweep(0.9, 500, 3000, { q: 2, pink: true }), p.beam, 0.14);

// ================= 9 – 17 s : les usages =================
const u = ev.usages;
u.cuts.forEach((t, i) => { whoosh(t, 0.4, i % 2 === 0, 0.3, i % 2 ? 0.5 : -0.5); hits.addMono(I.thwack(), t, 0.36); drums.addMono(I.crash(20 + i), t, 0.2); });
u.labels.forEach((t) => stamp(t, 0.5));
hits.addMono(I.tvClick(), u.cuts[0] + 0.02, 0.25);                                        // cinéma : déclic du projecteur
fx.addMono(I.whistle(0.32), u.labels[1] + 0.2, 0.1, 0.3);                                  // foot : sifflet
fx.addMono(I.noiseSweep(1.1, 400, 2600, { q: 0.7, pink: true, shape: (x) => Math.sin(Math.PI * Math.min(1, x * 1.6)) * (1 - x * 0.6) }), u.goal - 0.1, 0.22); // clameur du stade
[0, 4, 7, 12].forEach((d, i) => fx.addMono(chipBlip(m('C6') + d), u.labels[2] + 0.2 + i * 0.07, 0.06, 0.2)); // jeux : blips 8 bits
[0, 1, 2, 3, 4].forEach((k) => hits.addMono(I.clap({ decay: 0.1, seed: 40 + k }), u.labels[3] + 0.2 + k * 0.09 + (k % 2) * 0.03, 0.1, (k % 2 ? 0.5 : -0.5))); // présentations : applaudissements

// ================= 17 – 20 s : YouTube & Netflix =================
const st = ev.streaming;
whoosh(st.cut, 0.45, false, 0.28); drums.addMono(I.crash(25), st.cut, 0.18);
st.tiles.forEach((t, i) => { hits.addMono(I.pop(1600 + i * 220), t, 0.32, -0.45 + i * 0.3); keys.addMono(I.marimba(m(['E5', 'G5', 'B5', 'D6'][i])), t, 0.18, -0.45 + i * 0.3); });
stamp(st.title, 0.5);
hits.addMono(I.woodTick(1.4), st.note, 0.12);
fx.addMono(I.noiseSweep(0.28, 1800, 5200, { q: 2.5 }), st.focus - 0.05, 0.1, 0.5);       // la sélection glisse
hits.addMono(I.woodTick(1.9), st.focus + 0.22, 0.22, 0.5);
hits.addMono(I.pop(2200), st.click, 0.5); hits.addMono(I.thud(140, 0.06), st.click, 0.45); // « clic »
fx.addMono(I.noiseSweep(0.45, 600, 7000, { q: 1.2, pink: true, shape: (x) => x }), st.click - 0.4, 0.16); // aspiration vers le plein écran
hits.addMono(I.subBoom(1.6), st.click, 0.5);
for (const n of ['A3', 'E4', 'A4']) { const s2 = I.strings(m(n), 1.6, { attack: 0.03, release: 0.8, bright: 0.6 }); pad.addStereo(s2.L, s2.R, st.click, 0.08); }

// ================= 20 – 23 s : le téléphone sur grand écran =================
const ph = ev.phone;
whoosh(ph.cut + 0.15, 0.45, false, 0.3, -0.2);                                             // le téléphone monte
hits.addMono(I.woodTick(2.1), ph.tap, 0.3); fx.addMono(I.glass(13, { size: 0.3 }), ph.tap, 0.05);   // « tap »
[0, 1, 2].forEach((i) => fx.addMono(sweepTone(0.16, 900 + i * 300, 2400 + i * 500, { att: 0.01, rel: 0.08 }), ph.cast + i * 0.08, 0.07, 0.1)); // ondes
fx.addMono(I.noiseSweep(ph.land - ph.cast - 0.1, 500, 8000, { q: 1, pink: true, shape: (x) => x * x }), ph.cast + 0.1, 0.24); // l'image s'envole
hits.addMono(I.thwack(), ph.land, 0.45); hits.addMono(I.subBoom(1.4), ph.land, 0.5);       // arrivée
keys.addMono(I.bell(mtof(m('E6')), 1.4), ph.land, 0.09); verb.addMono(I.bell(mtof(m('B6')), 1.4), ph.land + 0.02, 0.06);
drums.addMono(I.crash(27), ph.land, 0.22);
whoosh(ph.out + 0.1, 0.35, true, 0.2, 0.3);

// ================= 23 – 29 s : caractéristiques =================
const f = ev.features;
fx.addMono(I.noiseSweep(0.55, 900, 9500, { q: 3, pink: false }), f.cut - 0.4, 0.13); hits.addMono(I.thwack(), f.cut, 0.26); drums.addMono(I.crash(33), f.cut, 0.18);
const SCALE = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
f.tiles.forEach((t, i) => {
  hits.addMono(I.pop(1300 + i * 120), t, 0.3, i % 2 ? 0.35 : -0.35);
  keys.addMono(I.marimba(m(SCALE[i])), t, 0.22, i % 2 ? 0.35 : -0.35);
});
for (let k = 0; k < 8; k++) { const t = f.tiles[7] + 0.25 + k * 0.4; if (t > S_.price[0] - 0.7) break; fx.addMono(I.noiseSweep(0.3, 3000, 9000, { q: 3 }), t, 0.035, k % 2 ? 0.4 : -0.4); }
hits.addMono(I.woodTick(1.3), f.note - 1.4, 0.12);

// ================= 29 – 35 s : le prix =================
const pr = ev.price;
whoosh(pr.cut, 0.55, true, 0.34); hits.addMono(I.thwack(), pr.cut, 0.4);
stamp(pr.title, 0.45);
{ // compteur : tics de plus en plus rapides + roulement + montée
  let t = pr.countFrom; const a = pr.countFrom, b = pr.breath;
  while (t < b - 0.02) { const k = (t - a) / (b - a); hits.addMono(I.woodTick(1.5 + k), t, 0.12 + 0.1 * k, 0.15); t += BEAT / 2 - (BEAT / 2 - BEAT / 8) * k; }
  for (let st = 0; st < 10; st++) { const tt = T(14, 1 + st / 4); if (tt >= b) break; drums.addMono(SN, tt, 0.1 + 0.03 * st, st % 2 ? 0.15 : -0.15); }
  fx.addMono(I.noiseSweep(b - pr.cut, 250, 9000, { q: 0.9, shape: (x) => x * x * x, pink: true }), pr.cut, 0.4);
  fx.addMono(sweepTone(b - pr.countFrom, 200, 1600, { att: 0.3, rel: 0.02 }), pr.countFrom, 0.05);
}
// LA CHUTE
hits.addMono(I.subBoom(2.6), pr.drop, 1.0);
drums.addMono(I.crash(41), pr.drop, 0.45);
hits.addMono(I.thwack(), pr.drop, 0.5);
for (const n of ['C4', 'E4', 'G4', 'C5']) { const b = I.brassNote(m(n), 0.7, { stab: 1 }); keys.addStereo(b.L, b.R, pr.drop, 0.12); verb.addStereo(b.L, b.R, pr.drop, 0.05); }
['C6', 'E6', 'G6', 'C7'].forEach((n, i) => { keys.addMono(I.bell(mtof(m(n)), 1.2, 1.6), pr.drop + 0.04 + i * 0.05, 0.05, -0.4 + i * 0.27); });
fx.addMono(I.glass(9, { size: 0.6 }), pr.drop + 0.02, 0.07);
stamp(pr.perDay, 0.6); keys.addMono(I.bell(mtof(m('G6')), 1.6), pr.perDay, 0.09); verb.addMono(I.bell(mtof(m('G6')), 1.6), pr.perDay, 0.06);

// ================= 35 – 39 s : livraison =================
const d = ev.delivery;
whoosh(d.cut, 0.45, false, 0.3); drums.addMono(I.crash(51), d.cut, 0.22); hits.addMono(I.thwack(), d.cut, 0.3);
stamp(d.title, 0.5);
{ // le trajet : un souffle qui traverse de gauche à droite
  const [a, b] = d.drive, n = 8, len = (b - a) / n;
  for (let k = 0; k < n; k++) fx.addMono(I.noiseSweep(len * 1.3, 260 + k * 60, 520 + k * 90, { q: 2.2, pink: true, seed: 60 + k }), a + k * len, 0.09, -0.8 + 1.6 * k / (n - 1));
}
hits.addMono(I.thud(80, 0.12), d.pin, 0.55); hits.addMono(I.pop(1100), d.pin, 0.4);
keys.addMono(I.bell(mtof(m('A5')), 1.6), d.pin, 0.1); verb.addMono(I.bell(mtof(m('E6')), 1.6), d.pin + 0.03, 0.06);
stamp(d.city, 0.4); keys.addMono(I.marimba(m('E5')), d.city, 0.22);

// ================= 39 – 45 s : appel à l'action =================
const c = ev.cta;
whoosh(c.cut, 0.5, true, 0.32); drums.addMono(I.crash(61), c.cut, 0.32); hits.addMono(I.subBoom(1.4), c.cut, 0.45);
stamp(c.head, 0.5);
[[c.price, 'C5'], [c.delivery, 'E5']].forEach(([t, n]) => { hits.addMono(I.pop(1500), t, 0.38); keys.addMono(I.marimba(m(n)), t, 0.26); });
fx.addMono(bloop(), c.whatsapp, 0.3, 0.2); hits.addMono(I.pop(1800), c.whatsapp, 0.25);
// signature sonore sur le numéro : arpège de cloches + scintillement
['C6', 'E6', 'G6', 'C7', 'E7'].forEach((n, i) => { const x = I.bell(mtof(m(n)), 1.4, 1.4); keys.addMono(x, c.number + i * 0.06, 0.07, -0.5 + i * 0.25); verb.addMono(x, c.number + i * 0.06, 0.05); });
fx.addMono(I.noiseSweep(0.6, 3000, 11000, { q: 4 }), c.number, 0.06);
hits.addMono(I.thud(120, 0.08), c.number, 0.45);
fx.addMono(I.noiseSweep(0.3, 1200, 6000, { q: 2 }), c.frame - 0.05, 0.12); hits.addMono(I.woodTick(1.6), c.frame, 0.2);
// accord final : do majeur tenu
for (const n of ['C3', 'G3', 'C4', 'E4', 'G4']) { const s = I.strings(m(n), 2.2, { attack: 0.05, release: 1, bright: 0.7 }); pad.addStereo(s.L, s.R, c.lastChord, 0.11); verb.addStereo(s.L, s.R, c.lastChord, 0.06); }
for (const n of ['C4', 'E4', 'G4', 'C5']) keys.addMono(I.epiano(m(n), 1.8, { index: 0.9 }), c.lastChord, 0.08);
drums.addMono(I.crash(71), c.lastChord, 0.26); hits.addMono(I.subBoom(2), c.lastChord, 0.55);
bass.addMono(I.bass(m('C2'), 1.6, { bright: 0.3, sub: 1 }), c.lastChord, 0.4);

// ================= mixage =================
MIX.sidechain([pad, bass, arp, saw], kicks.filter((t) => t >= T(2)), { depth: 0.5 });
const stems = {
  drums, bass, pad, arp, saw, lead, keys, fx, hits,
  verb: reverb(verb, { room: 0.82, damp: 0.35 }),
  dly: pingpong(dly, BEAT * 0.75, 0.33, 3800),
};
const GAIN = { drums: 0.5, bass: 0.55, pad: 2.6, arp: 1.9, saw: 9, lead: 1.25, keys: 1.0, fx: 1.35, hits: 0.95, verb: 1.1, dly: 1 };
const outDir = path.join(__dirname, 'out');
if (process.env.STEMS) fs.mkdirSync(outDir, { recursive: true });
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? outDir : null });
MIX.highpass(mix, 26);
MIX.gate(mix, ev.price.breath, ev.price.drop);    // la croche de silence avant le prix
MIX.fadeOut(mix, DURATION - 1.2, DURATION - 0.05);
const M = MIX.master(mix, 0.8, undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
const dest = path.join(__dirname, '..', 'assets', 'audio', 'soundtrack.wav');
fs.mkdirSync(path.dirname(dest), { recursive: true });
MIX.writeWav(dest, mix);
console.log(`wrote ${path.relative(process.cwd(), dest)} (${DURATION}s, ${M.lufs !== undefined ? M.lufs.toFixed(1) + ' LUFS' : ''})`);
