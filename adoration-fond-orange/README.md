# Fond animé « braises » orange ZONE 242 — paroles d'adoration

- `fond-orange-braises-boucle-10s.mp4` : la vidéo finale. 1920×1080, 30 i/s, 10 s, H.264, **sans piste audio**.
- **Boucle parfaite** : la dernière image raccorde avec la première ; activez la lecture en boucle dans le logiciel de projection.
- `apercu-lisibilite.jpg` : aperçu avec des paroles blanches (Psaume 150:6, Segond 1910). Ce texte n'est **pas** dans la vidéo.

## Ce qui bouge

Une fumée qui monte et tourbillonne (générée, pas une photo), des braises qui s'élèvent à plusieurs vitesses (profondeur), de grandes lueurs floues sur les côtés, une lueur qui palpite par le bas.

## Couleur et lisibilité

Le blanc sur l'orange exact du logo (`#FF5A36`) ne donne que **3,1:1** de contraste : trop peu pour lire (seuil : 4,5:1).
Le fond utilise donc l'orange du logo **assombri dans la même teinte** derrière les paroles, et garde l'orange vif sur le pourtour, dans les volutes et les braises.

Mesuré sur les images rendues, dans la zone des paroles (10–90 % de la largeur, 20–80 % de la hauteur) :
contraste blanc ≈ 8:1 en médiane, ≥ 5,2:1 pour 99,9 % des pixels, ≥ 4,4:1 au pire pixel.

## Modifier

Tout est dans `index.html` :

| Réglage | Où | Effet |
| --- | --- | --- |
| Couleurs | objet `PALETTE` | `hot` = orange officiel ; `base0/base1` = fond |
| Lisibilité | `log(0.105)` dans la passe couleur | plus bas = centre plus sombre, texte encore plus lisible |
| Zone des paroles | fonction `textZone` (`vec2(0.42, 0.31)`) | demi-largeur / demi-hauteur protégées |
| Braises | fonction `makeEmbers` | nombre, vitesse, taille, éclat |
| Vitesse de la fumée | `F` et `RY` (doivent rester égaux pour une montée d'une hauteur d'écran par boucle) | |

Rendu : `npx hyperframes render --quality delivery -o renders/fond.mp4` (premier lancement : `npx hyperframes browser ensure`).

Bruits simplex et Perlin périodique : Ian McEwan & Stefan Gustavson (Ashima Arts), licence MIT. three.js : licence MIT (`vendor/three/LICENSE`).
