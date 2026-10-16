# Publicité motion design 2D — Location de projecteur Home Cinéma

Film publicitaire **100 % 2D** (aucune 3D), construit avec **HyperFrames** (HTML + GSAP rendu en vidéo).

| | |
|---|---|
| Fichier final | `final/Location_Projecteur_9x16.mp4` |
| Format | 1080 × 1920 (vertical 9:16), 30 i/s, H.264 + AAC |
| Durée | 45,0 s |
| Son | musique électro-cinématique + effets, **synthétisés de zéro** (aucune voix, aucun échantillon externe) |
| Tarif affiché | 5 000 FCFA la journée (le 7 000 F de l'affiche n'apparaît nulle part) |
| Contact | WhatsApp 0167326082 · Cotonou, Bénin · Livraison possible |

> **Format :** le brief indiquait « 1080 × 1920 » et « 16:9 », deux consignes contradictoires. 1080 × 1920 correspond au 9:16 vertical.
> Le 9:16 a été retenu (lisibilité smartphone, Reels/Status/TikTok). Une version 16:9 demanderait de recomposer les scènes, pas un simple recadrage.

## Modifier les textes commerciaux (sans toucher au code)

Les infos commerciales sont des **variables** déclarées en haut de `index.html` :

| Variable | Valeur par défaut |
|---|---|
| `prix` | `5 000` |
| `devise` | `FCFA` |
| `telephone` | `0167326082` |
| `ville` | `COTONOU, BÉNIN` |
| `livraison` | `LIVRAISON POSSIBLE` |

Deux façons de les changer :
1. Éditer les valeurs `default` dans `index.html`, puis relancer `sh tools/build.sh`.
2. Sans rien éditer : `VARS='{"prix":"6 000","telephone":"0100000000"}' OUT=final/variante.mp4 sh tools/build.sh`

Le compteur du prix s'adapte au nouveau montant (le rouleau des milliers s'arrête sur le bon chiffre).
Pour un numéro beaucoup plus long, vérifier qu'il tient dans l'encadré (`#s7-box .num` dans `scenes/scenes.css`).

Les autres textes (titres, usages, caractéristiques) sont dans `scenes/sN-*.js`, en clair dans le HTML de chaque scène.

## Structure

```
index.html            composition HyperFrames : calques, variables, audio, chargement des scènes
score.js              LA partition : tempo (120 BPM), temps de chaque scène et de chaque impact
main.js               timeline GSAP unique : fond en parallaxe, projecteur, transitions, particules
lib/fx.js             outils : découpe typographique, icônes vectorielles, particules déterministes
scenes/
  s1-accroche.js      0–5 s    ligne jaune, ouverture géométrique, titre cinétique
  s2-produit.js       5–11 s   contour lumineux, éclat d'objectif, messages, faisceau
  s3-usages.js        11–21 s  4 vignettes illustrées (cinéma, foot, jeux, présentations) + récap 2×2
  s4-fonctions.js     21–29 s  7 caractéristiques, chacune avec sa propre animation
  s5-prix.js          29–35 s  compteur à rouleaux, impact sur la musique, « LA JOURNÉE »
  s6-livraison.js     35–39 s  trajet en pointillés, scooter, repère, Cotonou
  s7-cta.js           39–45 s  appel à l'action, WhatsApp, numéro, encadré (stable dès 41,95 s)
  scenes.css          mise en page des scènes
sound/song.js         synthèse de la bande-son à partir de score.js (moteur dans sound/engine/)
assets/               projecteur détouré, polices, GSAP, bande-son générée
tools/
  build.sh            chaîne complète : son -> lint -> rendu -> vérifications
  verify.py           contrôle format, durée, synchro son/image, loudness
  cutout.py           détourage du projecteur depuis l'affiche (source/affiche-originale.jpg)
```

**Principe clé :** `score.js` est la seule source de temps. La musique (`sound/song.js`) et l'image (scènes) lisent les mêmes instants, donc elles ne peuvent pas se décaler.
Pour retimer, modifier `score.js`, puis relancer le build.

## Reconstruire / prévisualiser

Prérequis : Node 22+, ffmpeg, Python 3 + numpy (pour `verify.py`).

```sh
npm install                 # hyperframes + gsap (versions figées)
npx hyperframes preview     # studio de prévisualisation (édition possible dans le navigateur)
sh tools/build.sh           # rendu complet + vérifications
```

## Vérifications du rendu livré

Sortie de `python3 tools/verify.py final/Location_Projecteur_9x16.mp4` :
- format 1080×1920, 30 i/s, H.264 High, AAC 48 kHz stéréo, 45,000 s ;
- synchronisation contrôlée sur 13 marqueurs : son à ±20 ms ; image à ±1 image sur les 5 impacts visuels (ouverture, cinéma, prix, repère, numéro) ;
- loudness ≈ −15 LUFS intégrés, pic vrai ≈ −2 dBTP (pas d'écrêtage).

Le son a été vérifié par mesure (spectrogramme, niveaux, attaques), pas à l'écoute : à valider à l'oreille.

## Crédits et licences

- Photo du projecteur : extraite de l'affiche fournie par le client (détourage sans retouche du produit).
- Polices Oswald et Montserrat : SIL Open Font License (`assets/fonts/OFL-*.txt`).
- GSAP 3.13 (+ DrawSVG, MorphSVG, MotionPath) : licence standard GreenSock « no charge », usage commercial autorisé.
- Pictogrammes : dessinés d'après Lucide (ISC). Le pictogramme WhatsApp est un dessin simplifié servant à indiquer le canal de réservation.
- Musique et effets : générés par code dans ce projet, sans échantillon tiers.
