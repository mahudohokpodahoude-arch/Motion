# Fond animé « fumée violette » — paroles d'adoration

- `fond-fumee-violette-boucle-10s.mp4` : la vidéo finale. 1920×1080, 30 i/s, 10 s, H.264, **sans piste audio**.
- **Boucle parfaite** : la dernière image raccorde avec la première ; dans le logiciel de projection, activez la lecture en boucle, la reprise est invisible.
- `apercu-lisibilite.jpg` : simple aperçu avec des paroles blanches (Psaume 150:6, Segond 1910) pour juger la lisibilité. Ce texte n'est **pas** dans la vidéo.

## Lisibilité du texte blanc

Les volutes les plus claires de l'image d'origine ne laissaient qu'un contraste de 3,2:1 avec du blanc (seuil de lisibilité : 4,5:1).
Le rendu adoucit uniquement ces hautes lumières en gardant leur teinte violette. Mesuré sur les images rendues, dans la zone où s'affichent les paroles :
contraste blanc ≈ 10,7:1 en médiane, **6,6:1 au pire point**.

## Modifier

Tout est dans `index.html` (shader WebGL, sans dépendance réseau) :

| Réglage | Où | Effet |
| --- | --- | --- |
| Durée de la boucle | `const LOOP = 10` + `data-duration="10"` (deux endroits) | garder les deux valeurs égales |
| Ampleur du mouvement | `0.0105 * big + 0.0022 * fine` | plus petit = plus calme |
| Lisibilité | `uKnee` (0,055) et `uSoft` (0,06) | plus bas = fumée plus discrète, texte encore plus lisible |
| Éclat des volutes | `uSat` (2,2) | 0 = volutes plus grises |

Rendu : `npx hyperframes render --quality delivery -o renders/fond.mp4` (Chrome est téléchargé au premier lancement : `npx hyperframes browser ensure`).

Image source : fournie par l'utilisateur (`assets/fumee-violette-2560.jpg`, réduite de 3936 px à 2560 px de large).
Bruit simplex 4D : Ian McEwan & Stefan Gustavson (Ashima Arts), licence MIT. three.js : licence MIT (`vendor/three/LICENSE`).
