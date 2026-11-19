---
message: "ZONE 242 : une vision centrée sur Jésus, structurée, moderne et prête à changer d'échelle."
audience: direction, partenaires, responsables et public de ZONE 242 by MILMO
mode: autonomous
fps: 30
duration: 90
---

# Storyboard — ZONE 242, film institutionnel 3D (90 s)

Un seul monde three.js continu (`src/`), une seule caméra (`src/core/camera.js`), une couche typographique GSAP (`index.html`). Grille musicale : 120 BPM (temps = 0,5 s, mesure = 2 s). Repères partagés image/son : `src/cues.json`.
Forme de chaque scène : blueprint `camera-journey` (sous-forme B, vol sans curseur) pour le fil continu, plus le blueprint ou les règles cités par scène.

## Frame 1
- status: outline
- src: src/scenes/s1-eveil.js
- window: 00:00–00:08
- shape: `logo-assemble-lockup` (caméra qui traverse l'espace négatif) + règles `svg-path-draw` (tracés), `waterfall-entry` (triplet de titres)
- beat: Nuit, poussière de lumière. Des lignes dessinent un couloir monumental de viseurs (les équerres du logo à l'échelle d'une architecture). La caméra le traverse. « UNE VISION. / UNE MISSION. / UN MOUVEMENT. » tombent sur les temps. Au bout, la lumière s'ouvre et révèle le logo en relief ; il respire.

## Frame 2
- status: outline
- src: src/scenes/s2-fondations.js
- window: 00:08–00:18
- shape: `grid-card-assemble` (assemblage échelonné) + `multi-phase-camera` (grue ascendante)
- beat: Le mot-symbole se dissout en poussière ; le viseur se couche et devient le plan des fondations : quatre équerres = PAROLE, PRIÈRE, COMMUNION, PARTAGE, le carré orange au centre. Les piliers s'élèvent, reliés au centre. « INSPIRÉE D'ACTES 2:42 », puis « JÉSUS AU CENTRE. UNE FOI QUI SE VIT. » La caméra monte et traverse la trame lumineuse que les piliers portent.

## Frame 3
- status: outline
- src: src/scenes/s3-connecter.js
- window: 00:18–00:30
- shape: `constellation-hub` (nœuds autour d'un centre) + `center-outward-expansion`
- beat: Les nœuds de la trame deviennent des points isolés qui se rapprochent et se lient. Un nœud central rayonne vers trois pôles qui s'allument au rythme du texte : « À JÉSUS. À L'ÉGLISE. AUX AUTRES. » Recul : le réseau déborde du bâtiment vers FAMILLES, QUARTIERS, ENTREPRISES, NUMÉRIQUE. Signature « CONNECTÉ POUR APPARTENIR. »

## Frame 4
- status: outline
- src: src/scenes/s4-transformer.js
- window: 00:30–00:43
- shape: `spatial-pan-stations` en 3D (travelling latéral ascendant) + `depth-scatter-assemble`
- beat: Plongée dans un nœud. Les points se cristallisent en modules sur un chemin qui monte : PREMIERS PAS → FONDEMENTS → DISCIPULAT → LEADERSHIP → FORMATION, du plus simple au plus complexe, reliés par une impulsion lumineuse. « PAR LA PRÉSENCE DE DIEU. / LA PAROLE. LE DISCIPULAT. LA PRIÈRE. » Signature « TRANSFORMÉ POUR DEVENIR. »

## Frame 5
- status: outline
- src: src/scenes/s5-envoyer.js
- window: 00:43–00:55
- shape: `center-outward-expansion` + `svg-path-draw` (trajectoires) + orbite lente
- beat: La structure s'ouvre ; des trajectoires partent d'un centre commun vers SERVICE, ÉVANGÉLISATION, FAMILLES, ENTREPRISES, MÉDIAS, COMMUNAUTÉS, puis se ramifient sans perdre leur origine. « SERVIR. TÉMOIGNER. FAIRE DES DISCIPLES. » Signature « ENVOYÉ POUR IMPACTER. »

## Frame 6
- status: outline
- src: src/scenes/s6-eglise.js
- window: 00:55–01:06
- shape: `constellation-hub` (orbite autour du centre) + `grid-card-assemble` (modules)
- beat: Les destinations deviennent cinq univers modulaires reliés par des ponts de lumière : Zones de Croissance & soin pastoral, ZONE Academy & formation, prière & rassemblements, partage & service de la ville, générations & familles & programmes signature. Recul large : « UNE VISION. DES PARCOURS. UNE COMMUNAUTÉ EN MOUVEMENT. »

## Frame 7
- status: outline
- src: src/scenes/s7-digital.js
- window: 01:06–01:17
- shape: `camera-journey` B + `device-surface-showcase` (panneaux abstraits flottants, jamais un produit réel)
- beat: Un plan de balayage numérise le monde. Panneaux abstraits — parcours, connexions, notifications, suivi, ressources, espaces numériques — autour d'un réseau central ; les données vont jusqu'aux personnes. « ZONE DIGITAL. ZONE SYSTEM. » puis « LA TECHNOLOGIE AU SERVICE DE LA PROXIMITÉ. »

## Frame 8
- status: outline
- src: src/scenes/s8-cap.js
- window: 01:17–01:26
- shape: `dataviz-countup` + règle `counting-dynamic-scale`
- beat: Élévation. Le réseau devient un globe monumental dont le nombre de points allumés suit le compteur, jalons indicatifs 50 → 242 → 350 → 500 → 2 420. Impact sur 2 420. « PERSONNES ACTIVES, INTÉGRÉES ET ENGAGÉES » — « CAP À 36 MOIS ».

## Frame 9
- status: outline
- src: src/scenes/s9-signature.js
- window: 01:26–01:30
- shape: `logo-assemble-lockup` (convergence puis verrouillage)
- beat: Tout converge vers la lumière ; éclat ; champ clair ; le logo officiel, net, au centre. « ZONE 242 by MILMO » — « CONNECTER. TRANSFORMER. ENVOYER. MULTIPLIER. » Tenue finale.
