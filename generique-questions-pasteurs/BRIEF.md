---
workflow: general-video
flow: automation
storyboard: no
message: "Le générique de la série « Question à l’Apôtre Amos » de la Zone 242."
destination: réseaux sociaux (Reels, Stories, TikTok), ouverture de chaque épisode
aspect: 1080x1920
language: fr
length: 4s
angle: générique réutilisable, texte de la question modifiable, sound design original
---

## Intent
Refonte du premier générique (5 s, blanc, quasi statique, tête coupée) : même identité (bulle « ? », badge bleu « L’APÔTRE AMOS », logo Zone 242), mais en mouvement, mieux composé, avec sound design.

## Customizations
- Variable `question` : texte affiché dans la carte finale (le reste est fixe).
- Sound design 100 % synthétisé (`tools/sound.py`) : pop, whoosh, impact, cloches, nappe, final. Aucune voix.
