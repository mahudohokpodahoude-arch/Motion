---
workflow: general-video
flow: automation
storyboard: no
message: "Un fond animé qui reprend le design des chevrons rouges fourni, pour afficher des paroles de chanson en blanc sans gêner leur lecture."
destination: projection des paroles de chanson (en boucle)
aspect: 1920x1080
language: fr
length: 10s
angle: boucle d'arrière-plan animée, fidèle à l'image fournie (chevrons rouges sur bleu nuit)
---

## Intent

« Anime cette image, comme une background d'animation en suivant le design de l'image. Elle est destinée à servir de background animé pour des paroles de chanson. Juste une vidéo de 10 s. »

Même usage que les fonds précédents (`../adoration-fond-fumee`, `../adoration-fond-orange`) : 10 s, 1920×1080, sans musique, paroles blanches par-dessus.

## Assets

- `assets/reference-chevrons.jpg` — l'image fournie (5000×3334 à l'origine, réduite à 1920 px), référence de design. Elle n'est pas incrustée : le motif est redessiné en shader pour pouvoir bouger.

## Customizations

- Mouvement dicté par le design : les chevrons sont des flèches pointées vers le centre, ils avancent donc vers le centre, en continu (deux crans par boucle).
- En avançant, chaque bande s'épaissit en arrivant à la place du grand chevron, puis sa pointe s'éteint vers le centre et ses branches restent en rayures dans les coins — la structure exacte de l'image, mise en mouvement.
- Le mouchetis (taches claires sur les bandes, bombage bordeaux autour) avance avec les bandes.
- Boucle parfaite de 10 s : à 10 s, chaque bande a pris exactement la place de celle de devant.

## Notes

- Mesures de l'image : fond #16232B, rouge vif #E2091E (dégradé vers la pointe), apex à 22 % de la largeur, côté droit en miroir exact.
- Format : l'image est en 3:2 ; elle est mise à l'échelle sur la largeur (les chevrons gardent leur place, 22 % de chaque côté), le haut et le bas sont recadrés.
- Le texte affiché par-dessus sera BLANC : le centre reste le bleu nuit de l'image ; sur le rouge vif des chevrons, le blanc garde ≈ 4,9:1.
- Aucune piste audio. Aucun texte incrusté.
