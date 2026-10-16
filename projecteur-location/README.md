# Publicité motion design 2D — Location de projecteur Home Cinéma (v2)

Film publicitaire **100 % 2D** (aucune 3D), construit avec **HyperFrames** (HTML + GSAP rendu en vidéo).

| | |
|---|---|
| Fichier final | `final/Location_Projecteur_9x16.mp4` (v1 conservée : `final/Location_Projecteur_9x16_v1.mp4`) |
| Format | 1080 × 1920 (vertical 9:16), 30 i/s, H.264 + AAC |
| Durée | 45,0 s |
| Son | musique électro-cinématique + effets, **synthétisés de zéro** (aucune voix, aucun échantillon externe) |
| Tarif affiché | 5 000 FCFA la journée (le 7 000 F de l'affiche n'apparaît nulle part) |
| Contact | WhatsApp 0167326082 · Cotonou, Bénin · Livraison possible |

> **Format :** le brief indiquait « 1080 × 1920 » et « 16:9 », deux consignes contradictoires. 1080 × 1920 correspond au 9:16 vertical.
> Le 9:16 a été retenu (lisibilité smartphone, Reels/Status/TikTok). Une version 16:9 demanderait de recomposer les scènes.

## Déroulé (v2)

| Temps | Scène | Fichier |
|---|---|---|
| 0–5 s | Accroche : ligne jaune, ouverture géométrique, « ET SI LE CINÉMA VENAIT CHEZ VOUS ? » | `scenes/s1-accroche.js` |
| 5–9 s | Produit : contour lumineux, éclat, « VOTRE GRAND ÉCRAN, PARTOUT », « UNE EXPÉRIENCE IMMERSIVE… », le faisceau allume l'écran | `scenes/s2-produit.js` |
| 9–17 s | 4 usages dans le grand écran (cinéma, football, jeux vidéo, présentations & événements) | `scenes/s3-ecran.js`, `scenes/s3-usages.js` |
| 17–20 s | **YouTube & Netflix intégrés*** (écran d'accueil d'applications, sélection, lecture) | `scenes/s3-streaming.js` |
| 20–23 s | **Votre téléphone sur grand écran** (recopie d'écran sans fil) | `scenes/s3-telephone.js` |
| 23–29 s | Caractéristiques en grille (8 tuiles) | `scenes/s4-fonctions.js` |
| 29–35 s | Prix : compteur, impact sur la musique, « LA JOURNÉE » | `scenes/s5-prix.js` |
| 35–39 s | Livraison possible, Cotonou (la caméra suit le scooter) | `scenes/s6-livraison.js` |
| 39–45 s | Appel à l'action, stable à partir de 41,95 s | `scenes/s7-cta.js` |

\* Mention affichée à l'écran : « Connexion Internet requise. Abonnement Netflix non inclus. » Les applications sont présentées comme
**intégrées au projecteur**, sur déclaration du client. Seuls les noms apparaissent : ni logos officiels, ni captures de leurs interfaces ou de leurs films.

## Photos dans les écrans

- `assets/photos/manifest.js` liste les photos réelles ; une scène sans photo affiche son illustration vectorielle.
- Actuellement : **football** et **présentation** = images fournies par le client, déclarées libres de droits (voir `assets/photos/CREDITS.md`).
- L'affiche Netflix « Ad Vitam » fournie n'est **pas** utilisée : logo Netflix (marque), acteurs identifiables, œuvre protégée.
- Pour compléter avec des photos libres (Pexels) : autoriser `images.pexels.com` dans le réseau de l'environnement, puis
  `python3 -I tools/fetch-photos.py download` (candidats dans `tools/photos.json`), vérifier la planche `assets/photos/_dl/planche.jpg`,
  et `python3 -I tools/fetch-photos.py use cinema=<id> gaming=<id> ...`.
- Pour utiliser tes propres photos : les déposer en `assets/photos/<emplacement>.jpg` (emplacements : `cinema`, `football`, `gaming`,
  `presentation`, `streaming`, `phone`, `thumb0`…`thumb3`) et les déclarer dans `manifest.js`.

## Modifier les textes commerciaux (sans toucher au code)

Variables déclarées en haut de `index.html` : `prix` (`5 000`), `devise` (`FCFA`), `telephone` (`0167326082`), `ville` (`COTONOU, BÉNIN`),
`livraison` (`LIVRAISON POSSIBLE`).

```sh
VARS='{"prix":"6 000","telephone":"0100000000"}' OUT=final/variante.mp4 sh tools/build.sh
```

## Structure technique

```
index.html            composition : calques, caméra 2D (#cam / #cam2), variables, audio, chargement des scènes
score.js              LA partition : tempo (120 BPM), temps de chaque scène et de chaque impact (image ET son)
main.js               timeline GSAP unique : fond en parallaxe, caméra 2D, projecteur, transitions, particules
lib/fx.js             outils : découpe typographique, icônes vectorielles, photos, particules déterministes
lib/illus.js          illustrations 2D de repli (écrans, silhouettes)
scenes/               une scène = un fichier (+ scenes.css)
sound/song.js         synthèse de la bande-son depuis score.js (moteur dans sound/engine/)
tools/build.sh        chaîne complète : son -> lint -> rendu -> vérifications
tools/verify.py       contrôle format, durée, synchro son/image, loudness
tools/fetch-photos.py photos Pexels (téléchargement + préparation + crédits)
tools/cutout.py       détourage du projecteur depuis l'affiche (source/affiche-originale.jpg)
```

`score.js` est la seule source de temps : la musique et l'image lisent les mêmes instants, elles ne peuvent pas se décaler.

## Reconstruire / prévisualiser

Prérequis : Node 22+, ffmpeg, Python 3 + numpy + Pillow.

```sh
npm install                 # hyperframes + gsap (versions figées)
npx hyperframes preview     # studio de prévisualisation
sh tools/build.sh           # rendu complet + vérifications
```

## Crédits et licences

- Photo du projecteur : extraite de l'affiche du client (détourage sans retouche du produit).
- Photos d'écran : voir `assets/photos/CREDITS.md`.
- Polices Oswald et Montserrat : SIL Open Font License (`assets/fonts/OFL-*.txt`).
- GSAP 3.13 (+ DrawSVG, MorphSVG, MotionPath) : licence standard GreenSock « no charge », usage commercial autorisé.
- Pictogrammes : dessinés d'après Lucide (ISC). Le pictogramme WhatsApp est un dessin simplifié indiquant le canal de réservation.
- Musique et effets : générés par code dans ce projet, sans échantillon tiers.
