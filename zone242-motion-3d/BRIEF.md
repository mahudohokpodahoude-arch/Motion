---
workflow: general-video
flow: automation
storyboard: no
message: "ZONE 242 : une vision centrée sur Jésus, structurée, moderne et prête à changer d'échelle — connecter, transformer, envoyer, multiplier."
destination: projection grand écran (lancement officiel) + diffusion web
aspect: 1920x1080
language: fr
audience: direction, partenaires, responsables et public de ZONE 242 by MILMO
length: 90s
angle: film institutionnel premium, motion design 3D, sans voix
---

## Intent

Film institutionnel premium de 90 s présentant ZONE 242 by MILMO : vision spirituelle centrée sur Jésus (Actes 2:42), fondations (Parole, prière, communion, partage), trois mouvements (CONNECTER, TRANSFORMER, ENVOYER), culture de discipulat, organisation moderne (ZONE DIGITAL, ZONE SYSTEM) et cap des 2 420 personnes actives, intégrées et engagées en 36 mois. Ton : ambitieux, structuré, moderne, crédible, spirituel sans emphase. Chaque scène est une séquence de film (composition, mouvement de caméra, intention, rythme, transition), jamais un diaporama.

Concept retenu (décision autonome) : une seule lumière orange — le carré central du logo, « Jésus au centre » — traverse un monde d'architecture bleue. Elle fonde, relie, transforme, envoie, puis multiplie, jusqu'à redevenir le cœur du logo final. Un monde 3D continu, une caméra qui le parcourt de bout en bout ; les transitions sont des métamorphoses (particules → connexions → parcours → trajectoires → croissance).

## Assets

- assets/logo/zone242_logo.png — logo officiel ZONE 242 (copie de zone242-vision/assets/zone242_logo.png), référence absolue, jamais déformé.
- assets/logo/zone_blue.svg, assets/logo/zone_orange.svg — tracés vectoriels du logo officiel (repris de milmo-zone242/v3-3d), pour l'extrusion 3D.
- Le PDF de présentation (32 pages) n'a pas été trouvé dans le dépôt ni dans l'environnement : les textes à l'écran sont ceux du brief, qui les spécifie mot pour mot.

## Customizations

- Typographie cinétique française, textes exacts du brief, scènes 01 à 09 chronométrées (00:00–01:30).
- Compteur 3D 50 → 242 → 350 → 500 → 2 420, valeurs intermédiaires présentées comme jalons indicatifs.
- Musique instrumentale cinématographique + sound design synchronisé, composés en code (originaux, sans sample tiers).
- Master modifiable : textes et couleurs en variables HyperFrames, timings centralisés.

## Notes

- AUCUNE voix : ni voix off, ni dialogue, ni narration, ni voix IA. (La consigne « version avec voix off » de la section 6 du brief est annulée par la consigne absolue finale.)
- INTERDIT : la formulation « VOUS N'ÊTES PAS SEUL » et toute variante, partout.
- Pas de personnages 3D, pas d'images IA, pas de glitch gratuit, pas de transitions préfabriquées, pas de diaporama.
- Interfaces de la scène 07 : abstraites, jamais présentées comme une capture d'un produit existant.
- 1920×1080, 30 i/s, 2 700 images, MP4 H.264 haute qualité, marges de sécurité respectées, lisible sur grand écran.
- Blender n'est pas installé ; pas de GPU (4 cœurs CPU). Pipeline choisi après mesure (voir README).
