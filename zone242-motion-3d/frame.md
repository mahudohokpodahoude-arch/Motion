# frame.md — Direction artistique ZONE 242 (film 3D, 90 s)

Vérité de design du film. Toute composition s'y conforme ; en cas de doute, ce fichier gagne.

## Concept

**Une seule lumière orange traverse un monde d'architecture bleue.**
Le carré orange au centre du viseur du logo, c'est « Jésus au centre ». Cette lumière fonde (scène 02), relie (03), transforme (04), envoie (05), anime une Église structurée (06–07), puis se multiplie en 2 420 points (08) avant de redevenir le cœur du logo (09).
Le symbole du logo (quatre équerres + carré central) est aussi le plan de l'architecture : les équerres deviennent les quatre fondations, le carré devient le centre.

## Palette (relevée sur le logo officiel)

| Rôle | Valeur | Usage |
| --- | --- | --- |
| Bleu ZONE (officiel) | `#1900CF` | faces du logo, matières structurelles, texte sur fond clair |
| Orange ZONE (officiel) | `#FF5A36` | la lumière centrale, accents, signatures, ponctuation |
| Nuit | `#04031A` (centre) → `#020110` (bords) | fond de toutes les scènes sombres, teinté vers le bleu |
| Brume | `#0A0730` | brouillard de profondeur |
| Bleu lumière | `#4B3BFF` / `#7A6FFF` | émission des tracés et structures (le bleu officiel est trop sombre pour émettre sur la nuit) |
| Lumière | `#F2F0FF` | particules, lignes fines, texte sur fond sombre |
| Chaux | `#F7F6FB` | champ de lumière de la signature finale |

Règles : jamais de noir pur ni de blanc pur ; une seule couleur d'accent (l'orange) ; pas de dégradé linéaire plein écran sur le sombre (banding H.264) — fond uni + halos localisés + grain.

## Typographie

- **Montserrat** (OFL, locale) — la géométrie du logo. Deux registres à contraste extrême :
  - Titres de mouvement : 800, capitales, 132–150 px, interlettrage −0,02 em.
  - Lignes d'énoncé : 300, capitales, 34–44 px, interlettrage +0,16 em.
  - Signatures : 700, capitales, 56–64 px, point final orange.
- **IBM Plex Mono** 500 (OFL, locale) — la voix « structure / donnée » : repères (MOUVEMENT 01), étiquettes 3D (PAROLE, FAMILLES…), jalons. 20–24 px, capitales, interlettrage +0,22 em.
- Typographie française : apostrophe ’, espace fine insécable dans 2 420, accents conservés sur les capitales.
- Marges de sécurité : aucun texte hors de x ∈ [144, 1776], y ∈ [96, 984] (≈ 7,5 % / 9 %).
- Temps de lecture : toute ligne reste ≥ 2,2 s à l'écran pleinement lisible.

## Matières et lumière (three.js, rendu WebGL déterministe)

- **Tracés** : lignes lumineuses fines (Line2, 1,5–3 px) en Bleu lumière / Lumière, qui se dessinent (dash offset).
- **Points** : sprites ronds doux, additifs, scintillement lent, bokeh simulé (taille et opacité croissent avec l'écart à la mise au point).
- **Volumes** : blocs sombres satinés (bleu nuit, métal/rugosité moyens) ourlés d'arêtes lumineuses ; jamais de texture photo.
- **Le cœur orange** : cube émissif `#FF5A36`, halo par bloom ; c'est la seule source chaude du film.
- **Éclairage** : clé froide en surplomb, contre-jour bleu, remplissage hémisphérique bleu nuit, la lumière orange comme source pratique.
- **Post** : bloom (seuil haut), vignettage, grain fin déterministe, légère aberration chromatique en bord de cadre, tonemapping ACES.

## Caméra

Un seul monde continu, une seule caméra. Chaque mouvement est motivé ; on varie les verbes (traversée, bascule, grue, plongée, travelling latéral, ouverture, orbite, élévation, convergence). Arrivées en `power4.out`, repositionnements en `power2.inOut`, jamais de rebond sur la caméra. Micro-dérive permanente très faible pour que les tenues ne meurent pas.

## Transitions

Uniquement par continuité : le logo devient le plan des fondations ; les particules deviennent les nœuds du réseau ; les nœuds deviennent des modules et des parcours ; le parcours s'ouvre en trajectoires ; les trajectoires dessinent les univers ; le réseau devient le système numérique ; le système devient le globe des 2 420 ; le globe converge vers la lumière finale. Aucune transition de bibliothèque.

## Son

Pas de voix. Musique originale composée en code, 120 BPM ressentis en demi-temps (pulsation calme, énergie possible), tonalité ré mineur → fa majeur à la révélation du cap. Effets sonores synthétisés et calés sur les mêmes repères que l'image (`src/cues.json`).

## À ne pas faire

Diaporama, titre seul sur fond noir, effets glitch, particules envahissantes, personnages 3D, images IA, interfaces présentées comme un produit réel, la formule « VOUS N'ÊTES PAS SEUL » ou toute variante.
