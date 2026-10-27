---
workflow: general-video
flow: automation
storyboard: no
message: "Un fond vivant et apaisant pour projeter les paroles d'adoration, sans jamais gêner leur lecture."
destination: projection des paroles (logiciel de culte, en boucle)
aspect: 1920x1080
language: fr
length: 10s
angle: boucle d'arrière-plan animée à partir d'une image fournie
---

## Intent

Fond animé de 10 s (au plus), 1920×1080, sans musique, à partir de l'image de fumée violette fournie, pour afficher les paroles des chants d'adoration par-dessus.

## Assets

- assets/fumee-violette-2560.jpg — l'image fournie (3936×2624), réduite à 2560 px de large pour le rendu 1080p.

## Customizations

- Boucle parfaite : tout le mouvement est périodique sur 10 s, la dernière image raccorde avec la première (le logiciel de projection peut la répéter sans saut).
- Mouvement : la fumée ondule comme de l'encre dans l'eau (courant à divergence nulle, deux échelles), légère dérive de caméra, une lumière douce traverse la fumée une fois par boucle.

## Notes

- Le texte affiché par-dessus sera BLANC et doit rester lisible (demande explicite) : hautes lumières de la fumée adoucies, contraste blanc mesuré ≥ 6,6:1 au pire point de la zone de texte, ≈ 10,7:1 en médiane.
- Aucune piste audio. Aucun texte incrusté dans la vidéo.
