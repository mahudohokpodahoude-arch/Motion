// LA PARTITION (v2) — source unique de vérité pour l'image ET le son.
// 120 BPM, 1 temps = 0,5 s, 1 mesure = 2 s. La mesure 0 commence à t = 1 s (1 s de pré-roll :
// la ligne jaune traverse l'écran sur une montée sonore). Chaque scène commence sur une barre ou une demi-barre.
// Lu par index.html (navigateur : globalThis.SCORE) et par sound/song.js (Node : require).
(function () {
  const BPM = 120, BEAT = 60 / BPM, BAR = 4 * BEAT, OFFSET = 1;
  const T = (bar, beat = 0) => +(OFFSET + bar * BAR + beat * BEAT).toFixed(4);
  const FPS = 30, W = 1080, H = 1920;
  const DURATION = 45;

  // ---------- scènes (secondes) ----------
  const S = {
    hook:      [0, T(2)],          //  0 – 5   accroche
    product:   [T(2), T(4)],       //  5 – 9   présentation produit
    usages:    [T(4), T(8)],       //  9 – 17  quatre usages (photos dans l'écran)
    streaming: [T(8), T(9, 2)],    // 17 – 20  YouTube & Netflix intégrés
    phone:     [T(9, 2), T(11)],   // 20 – 23  l'écran du téléphone sur le grand écran
    features:  [T(11), T(14)],     // 23 – 29  caractéristiques (grille)
    price:     [T(14), T(17)],     // 29 – 35  révélation du prix
    delivery:  [T(17), T(19)],     // 35 – 39  livraison & localisation
    cta:       [T(19), DURATION]   // 39 – 45  appel à l'action
  };

  // ---------- évènements (chaque son et chaque mouvement clé lisent ces temps) ----------
  const ev = {
    hook: {
      line: 0.15, lineEnd: 0.95,   // la ligne jaune file puis sort
      open: T(0),                  // 1.0 impact : les panneaux s'ouvrent, le projecteur apparaît
      words: [T(0, 2), T(0, 3), T(1, 0), T(1, 1), T(1, 2)], // ET SI LE / CINÉMA / VENAIT / CHEZ VOUS / ?
      push: T(1, 0)
    },
    product: {
      cut: T(2),                   // 5.0
      trace: [T(2), T(2, 2)],      // contour lumineux 5.0 – 6.0
      flare: T(2, 2),              // 6.0 éclat sur l'objectif
      line1: T(2, 1),              // 5.5 VOTRE GRAND ÉCRAN, PARTOUT
      line2: T(3),                 // 7.0 UNE EXPÉRIENCE IMMERSIVE À PORTÉE DE MAIN
      beam: T(3, 2)                // 8.0 le faisceau allume l'écran
    },
    usages: {
      cuts: [T(4), T(5), T(6), T(7)],                       // 9, 11, 13, 15
      labels: [T(4, 0.5), T(5, 0.5), T(6, 0.5), T(7, 0.5)], // libellés un demi-temps après la coupe
      goal: T(5, 2.5)                                       // 12.25 le ballon touche le filet
    },
    streaming: {
      cut: T(8),                   // 17.0 l'écran d'accueil (applis) apparaît
      tiles: [T(8, 0.25), T(8, 0.5), T(8, 0.75), T(8, 1)],
      title: T(8, 0.5),            // YOUTUBE & NETFLIX
      note: T(8, 1.5),             // mention : connexion et abonnement non inclus
      focus: T(8, 2),              // 18.0 la sélection se pose sur une appli
      click: T(8, 3),              // 18.5 « clic » : la lecture démarre plein écran
    },
    phone: {
      cut: T(9, 2),                // 20.0 le téléphone entre
      tap: T(9, 3),                // 20.5 une photo s'affiche sur le téléphone
      cast: T(10),                 // 21.0 ondes : envoi vers le projecteur
      land: T(10, 1),              // 21.5 l'image arrive sur le grand écran
      out: T(10, 3.5)              // 22.75 sortie
    },
    features: {
      cut: T(11),                  // 23.0
      tiles: Array.from({ length: 8 }, (_, i) => T(11, 0.5 + i * 0.5)), // 23.25 … 25.0 : une tuile par croche
      note: T(13),                 // 27.0 mention sous la grille
    },
    price: {
      cut: T(14),                  // 29.0
      title: T(14, 0.5),           // TARIF UNIQUE
      countFrom: T(14, 1),         // le compteur démarre
      breath: T(14, 3.5),          // une croche de silence
      drop: T(15),                 // 31.0 : 5 000 FCFA tombe
      perDay: T(15, 2)             // LA JOURNÉE
    },
    delivery: {
      cut: T(17),                  // 35.0
      title: T(17, 1),             // LIVRAISON POSSIBLE
      drive: [T(17, 1), T(18, 0)], // le scooter suit le trajet
      pin: T(18),                  // 37.0 : le repère tombe
      city: T(18, 1)               // COTONOU, BÉNIN
    },
    cta: {
      cut: T(19),                  // 39.0
      head: T(19),                 // ENVIE DE VIVRE L'EXPÉRIENCE ?
      price: T(19, 1),             // LOCATION : 5 000 FCFA / JOUR
      delivery: T(19, 2),          // LIVRAISON POSSIBLE
      whatsapp: T(19, 3),          // RÉSERVEZ SUR WHATSAPP + icône
      number: T(20, 0),            // 41.0 : le numéro (signature sonore)
      frame: T(20, 1),             // 41.5 : encadré jaune + COTONOU, BÉNIN
      city: T(20, 1),
      stable: T(20, 1) + 0.45,     // 41.95 : plus aucun texte ne bouge jusqu'à 45 s (> 3 s)
      lastChord: T(21)             // 43.0
    }
  };

  // ---------- énergie de la musique (0 = silence, 1 = plein) par mesure ----------
  const ENERGY = { 0: 0.45, 1: 0.5, 2: 0.85, 3: 0.85, 4: 1, 5: 1, 6: 1, 7: 1, 8: 0.85, 9: 0.9, 10: 1,
    11: 0.8, 12: 0.8, 13: 0.85, 14: 0.6, 15: 1, 16: 1, 17: 0.8, 18: 0.8, 19: 1, 20: 1, 21: 0 };
  const energyAt = (t) => (t < OFFSET ? 0 : ENERGY[Math.floor((t - OFFSET) / BAR)] ?? 0);

  // ---------- harmonie : la mineur / do majeur, cadence IV–V–I vers le prix ----------
  const PROG = ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'C', 'G', 'Am', 'F', 'C', 'G', 'C'];

  // marqueurs de synchronisation (vérifiés après rendu : son ±20 ms partout, image ±1 image sur les « coups »)
  const markers = {
    open: ev.hook.open, product: ev.product.cut, cinema: ev.usages.cuts[0], foot: ev.usages.cuts[1],
    games: ev.usages.cuts[2], talks: ev.usages.cuts[3], streaming: ev.streaming.cut, click: ev.streaming.click,
    phone: ev.phone.cut, mirror: ev.phone.land, features: ev.features.cut, drop: ev.price.drop,
    delivery: ev.delivery.cut, pin: ev.delivery.pin, cta: ev.cta.cut, number: ev.cta.number
  };
  // marqueurs où l'image a un vrai « coup » (flash, impact) : vérifiés à ±1 image ; les autres sont des
  // transitions progressives (balayages, iris) dont seul le son est vérifié à ±20 ms
  const visualHits = ['open', 'click', 'mirror', 'drop', 'pin', 'number'];

  const SCORE = { BPM, BEAT, BAR, OFFSET, T, FPS, W, H, DURATION, S, ev, ENERGY, energyAt, PROG, markers, visualHits };
  if (typeof module !== 'undefined') module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
