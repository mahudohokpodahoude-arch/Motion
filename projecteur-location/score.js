// LA PARTITION — source unique de vérité pour l'image ET le son.
// 120 BPM, 1 temps = 0,5 s, 1 mesure = 2 s. La mesure 0 commence à t = 1 s (1 s de pré-roll :
// la ligne jaune traverse l'écran sur une montée sonore). Chaque scène commence sur une barre de mesure.
// Lu par index.html (navigateur : globalThis.SCORE) et par sound/song.js (Node : require).
(function () {
  const BPM = 120, BEAT = 60 / BPM, BAR = 4 * BEAT, OFFSET = 1;
  const T = (bar, beat = 0) => +(OFFSET + bar * BAR + beat * BEAT).toFixed(4);
  const FPS = 30, W = 1080, H = 1920;
  const DURATION = 45;

  // ---------- scènes (secondes) ----------
  const S = {
    hook:     [0, T(2)],        //  0 – 5   accroche
    product:  [T(2), T(5)],     //  5 – 11  présentation produit
    usages:   [T(5), T(10)],    // 11 – 21  usages
    features: [T(10), T(14)],   // 21 – 29  fonctionnalités
    price:    [T(14), T(17)],   // 29 – 35  révélation du prix
    delivery: [T(17), T(19)],   // 35 – 39  livraison & localisation
    cta:      [T(19), DURATION] // 39 – 45  appel à l'action
  };

  // ---------- évènements (chaque son et chaque mouvement clé lisent ces temps) ----------
  const ev = {
    hook: {
      line: 0.15,              // la ligne jaune part
      lineEnd: 0.95,           // ... et sort de l'écran
      open: T(0),              // impact : les formes s'ouvrent, le projecteur apparaît (t = 1)
      words: [T(0, 2), T(0, 3), T(1, 0), T(1, 1), T(1, 2)], // ET SI LE / CINÉMA / VENAIT / CHEZ VOUS / ?
      push: T(1, 0)            // léger travelling 2D des calques
    },
    product: {
      cut: T(2),               // 5.0
      trace: [T(2), T(2, 3)],  // le contour lumineux se dessine
      flare: T(2, 3),          // éclat sur l'objectif
      line1: T(3),             // VOTRE GRAND ÉCRAN, PARTOUT
      line2: T(4),             // UNE EXPÉRIENCE IMMERSIVE À PORTÉE DE MAIN
      beam: T(4, 2)            // faisceau stylisé
    },
    usages: {
      cuts: [T(5), T(6), T(7), T(8)],            // cinéma, foot, jeux, présentations
      labels: [T(5, 1), T(6, 1), T(7, 1), T(8, 1)],
      recap: T(9),                                 // grille récapitulative
      tiles: [T(9), T(9, 0.5), T(9, 1), T(9, 1.5)],
      recapTitle: T(9, 2)
    },
    features: {
      pages: [T(10), T(12)],
      items: [[T(10, 1), T(10, 2.5), T(11, 0), T(11, 1.5)], [T(12, 1), T(12, 2.5), T(13, 0)]]
    },
    price: {
      cut: T(14),              // 29.0
      title: T(14, 0.5),       // TARIF UNIQUE
      countFrom: T(14, 1),     // le compteur démarre
      breath: T(14, 3.5),      // une croche de silence
      drop: T(15),             // 31.0 : 5 000 FCFA tombe
      perDay: T(15, 2)         // LA JOURNÉE
    },
    delivery: {
      cut: T(17),              // 35.0
      title: T(17, 1),         // LIVRAISON POSSIBLE
      drive: [T(17, 1), T(18, 0)], // le véhicule suit le trajet
      pin: T(18),              // 37.0 : le repère tombe
      city: T(18, 1)           // COTONOU, BÉNIN
    },
    cta: {
      cut: T(19),              // 39.0
      head: T(19),             // ENVIE DE VIVRE L'EXPÉRIENCE ?
      price: T(19, 1),         // LOCATION : 5 000 FCFA / JOUR
      delivery: T(19, 2),      // LIVRAISON POSSIBLE
      whatsapp: T(19, 3),      // RÉSERVEZ SUR WHATSAPP + icône
      number: T(20, 0),        // 41.0 : le numéro (signature sonore)
      frame: T(20, 1),         // 41.5 : encadré jaune + COTONOU, BÉNIN
      city: T(20, 1),
      stable: T(20, 1) + 0.45, // 41.95 : plus aucun texte ne bouge jusqu'à 45 s (> 3 s)
      lastChord: T(21)         // 43.0
    }
  };

  // ---------- énergie de la musique (0 = silence, 1 = plein) par mesure ----------
  const ENERGY = { 0: 0.45, 1: 0.5, 2: 0.8, 3: 0.85, 4: 0.85, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
    10: 0.75, 11: 0.75, 12: 0.75, 13: 0.8, 14: 0.6, 15: 1, 16: 1, 17: 0.8, 18: 0.8, 19: 1, 20: 1, 21: 0 };
  const energyAt = (t) => (t < OFFSET ? 0 : ENERGY[Math.floor((t - OFFSET) / BAR)] ?? 0);

  // ---------- harmonie : la mineur / do majeur, cadence IV–V–I vers le prix ----------
  const PROG = ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'C', 'G', 'Am', 'F', 'C', 'G', 'C'];

  // marqueurs de synchronisation (vérifiés après rendu : image ±1 image, son ±20 ms)
  const markers = {
    open: ev.hook.open, product: ev.product.cut, cinema: ev.usages.cuts[0], foot: ev.usages.cuts[1],
    games: ev.usages.cuts[2], talks: ev.usages.cuts[3], features: ev.features.pages[0],
    connect: ev.features.pages[1], drop: ev.price.drop, delivery: ev.delivery.cut, pin: ev.delivery.pin,
    cta: ev.cta.cut, number: ev.cta.number
  };

  // marqueurs où l'image a un vrai « coup » (flash, impact) : vérifiés à ±1 image ; les autres sont des
  // transitions progressives (balayages, iris) dont seul le son est vérifié à ±20 ms
  const visualHits = ['open', 'cinema', 'drop', 'pin', 'number'];

  const SCORE = { BPM, BEAT, BAR, OFFSET, T, FPS, W, H, DURATION, S, ev, ENERGY, energyAt, PROG, markers, visualHits };
  if (typeof module !== 'undefined') module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
