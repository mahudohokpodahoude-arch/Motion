// cast sheet: the people of the film, big and small
(() => {
  const ctx = document.getElementById('c').getContext('2d');
  const C = K.C, S = P.SKIN, t = 1.3;
  ctx.fillStyle = C.PAPER; ctx.fillRect(0, 0, 1920, 1080);
  ctx.fillStyle = C.MIST; ctx.fillRect(0, 560, 1920, 520);
  const cast = [
    { build: 'm', skin: S[1], outfit: 'blazer', top: C.NAVY, bottom: C.NAVY, tie: C.ORANGE, square: C.ORANGE, hair: 'short', beard: true, pose: 'pocket', stance: 'l' },
    { build: 'f', skin: S[3], outfit: 'dress', top: C.BLUE, pattern: 'rings', patCol: C.ORANGE, hair: 'gele', gele: C.ORANGE, gelePat: 'dots', earrings: '#FFB13B', pose: 'hold', item: 'book', itemCol: C.ORANGE, stance: 'r' },
    { build: 'm', skin: S[0], outfit: 'kaftan', top: C.WHITE, bottom: C.WHITE, trim: C.BLUE, hair: 'bald', beard: true, pose: 'cross', mood: 'calm' },
    { build: 'f', skin: S[4], outfit: 'skirt', top: C.NAVY, blouse: C.WHITE, hair: 'braids', pose: 'wave', mood: 'grin' },
    { build: 'm', skin: S[2], outfit: 'hoodie', top: C.ORANGE, bottom: '#2D2A8F', hair: 'cap', capCol: C.NAVY, phones: C.NAVY, pose: 'hips', mood: 'grin', stance: 'l' },
    { build: 'f', skin: S[5], outfit: 'gown', top: C.ORANGE, hair: 'bun', pose: 'upOne', mood: 'grin' },
    { build: 'm', skin: S[3], outfit: 'shirt', top: C.BLUE_L, bottom: C.NAVY, hair: 'gray', beard: true, glasses: true, item: 'cane', pose: 'down' },
    { build: 'kid', skin: S[2], top: C.ORANGE, bottom: C.NAVY, shorts: true, hair: 'puffs', pose: 'cheer', mood: 'grin' },
  ];
  cast.forEach((o, i) => P.person(ctx, 140 + i * 235, 520, o.build === 'kid' ? 300 : 440, Object.assign({ t, seed: i + 1 }, o)));
  // small: a crowd row, and silhouettes with rim light
  for (let i = 0; i < 12; i++) P.person(ctx, 90 + i * 110, 1000, 170, Object.assign({ t: t + i, seed: 20 + i }, cast[i % cast.length], { k: 1 }));
  for (let i = 0; i < 6; i++) P.person(ctx, 1420 + i * 85, 1060, 230, { t, seed: 40 + i, sil: '#0D0838', rim: '#FFB59E', hair: ['short', 'gele', 'afro', 'bun', 'cap', 'braids'][i], pose: i % 2 ? 'up' : 'upOne', build: i % 2 ? 'f' : 'm' });
})();
