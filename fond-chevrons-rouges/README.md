# Fond animé « chevrons rouges » — paroles de chanson

- `fond-chevrons-rouges-boucle-10s.mp4` : la vidéo finale. 1920×1080, 30 i/s, 10 s, H.264, **sans piste audio**.
- **Boucle parfaite** : la dernière image raccorde avec la première ; activez la lecture en boucle dans le logiciel de projection.
- `apercu-lisibilite.jpg` : aperçu avec des paroles blanches (Psaume 96:1, Segond 1910). Ce texte n'est **pas** dans la vidéo.
- `assets/reference-chevrons.jpg` : l'image fournie, qui sert de modèle.

## Ce qui bouge

Le design de l'image est redessiné tel quel : même bleu nuit (#16232B), même rouge, mêmes chevrons, même mouchetis. Comme ce sont des flèches pointées vers le centre, **elles avancent vers le centre**, en continu :

- une petite flèche naît au bord, grandit et prend la place de la suivante ; chaque bande s'épaissit en arrivant à la place du grand chevron ;
- en continuant, sa pointe s'éteint dans le bleu nuit et ses branches restent en rayures dans les coins, comme sur l'image ;
- les taches (claires sur le rouge, bordeaux autour) avancent avec les bandes.

Chaque bande prend la place de celle de devant en 5 s. À 10 s, tout est revenu exactement à la première image.

## Fidélité à l'image

Mesurée sur l'image fournie (5000×3334) :

- **Pointe du grand chevron** : à 22 % de la largeur ; côté droit en miroir.
- **Branches** : pas tout à fait à 45° (pente 0,94 en haut, 1,01 en bas), reproduites telles quelles.
- **Dégradé** : le rouge s'éclaircit vers la pointe et les rayures extérieures s'éteignent vers le centre, avec les mêmes valeurs à ±0,03 près.
- **Mouchetis** : même densité (≈ 60 taches pour 100×100 px près du bord, aucune au centre) et même taille (rayon médian ≈ 1,3 px).

L'image est en 3:2 et la vidéo en 16:9 : le motif est mis à l'échelle sur la largeur (les chevrons gardent leur place), le haut et le bas sont un peu recadrés.

## Lisibilité du texte blanc

Mesurée sur les 300 images de la vidéo, dans la zone des paroles (10–90 % de la largeur, 20–80 % de la hauteur) :

- **Médiane** : contraste ≈ 16:1.
- **Au centre** (30–70 % de la largeur) : ≥ 16:1 partout.
- **Sur le rouge le plus vif** (pointes des chevrons) : le blanc garde ≥ 4,8:1 pour 99,9 % des pixels, et 4,35:1 au pire pixel. C'est au-dessus du seuil de 3:1 pour le texte de grande taille ; les paroles projetées en font toujours partie.

## Modifier

Tout est dans `index.html` :

| Réglage | Où | Effet |
| --- | --- | --- |
| Vitesse | `SLOTS` (2) | crans parcourus par boucle : 1 = deux fois plus calme ; doit rester un entier pour que la boucle raccorde |
| Couleurs | `BG`, `RED` (shader) | fond bleu nuit, rouge des chevrons |
| Place des chevrons | `APEX` | pointe de chaque bande, en pixels de l'image de 5000 px de large |
| Épaisseur des bandes | `FILL` | épaisseur / pas, cran par cran |
| Portée des rayures vers le centre | `1500.0` dans `bandAlpha` | plus petit = centre plus dégagé |
| Mouchetis | `0.0060` (fond), `0.0085` (bandes) | taches par pixel² ; 0 = sans taches |

Rendu : `npx hyperframes render --quality delivery -o renders/fond.mp4` (premier lancement : `npx hyperframes browser ensure`).

Hachage sans sinus : Dave Hoskins, licence MIT. three.js : licence MIT (`vendor/three/LICENSE`).
