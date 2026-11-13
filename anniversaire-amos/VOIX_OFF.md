# Voix off et voix de la communauté : guide d'enregistrement

La vidéo `ANNIVERSAIRE_Apotre_Amos_Elite.mp4` est livrée avec la musique, **sans voix**. Elle laisse des fenêtres vides pour des voix humaines. Je n'ai pas de moteur vocal naturel ici, et une voix robotique n'irait pas pour un message d'affection à un père spirituel.

La musique seule est dans `musique.wav`. Si tu veux plus de contrôle sur le mixage, utilise `silencieux.mp4` avec `musique.wav` dans CapCut ou un autre logiciel.

## Où placer les voix

| Temps | Ce qu'on voit | Quoi enregistrer |
|---|---|---|
| 4,5 – 10 s | « JOYEUX ANNIVERSAIRE · APÔTRE AMOS ELITE » | **Un seul porte-parole** : « Joyeux anniversaire, Apôtre Amos Elite. » |
| 10,7 – 19,5 s | « Notre père. Notre guide. L'Apôtre de la zone 242. » | Le porte-parole dit les 3 phrases, une par apparition (10,7 s · 12,9 s · 15,1 s). |
| 20 – 34 s | « MERCI pour votre amour / foi / exemple / lumière » | Voix posée du porte-parole. Texte libre, voir plus bas. |
| 34,6 – 41 s | Les bulles « Joyeux anniversaire Papa ! » | **Les clips de la communauté** : 7 à 10 clips de 2 à 3 s, un par bulle (toutes les 0,6 s environ). |
| 42,5 – 49 s | Le logo et « Avec tout notre amour » | Tout le monde en chœur : « Joyeux anniversaire Papa ! », puis silence. |

## Texte suggéré pour la fenêtre 20 – 34 s

Remplace-le par **des faits vrais** : une année, une œuvre, une phrase qu'il répète souvent. Un détail précis touche plus que dix compliments.

> « Merci pour votre amour, qui nous a accueillis.
> Merci pour votre foi, qui nous a relevés.
> Merci pour votre exemple, qui nous guide encore.
> Merci pour votre lumière, qui éclaire la zone 242. »

## Les clips de la communauté (message à envoyer ce soir)

> « Envoyez une vidéo ou un vocal de 3 secondes : "Joyeux anniversaire Papa [ton prénom] !"
> Téléphone à l'horizontale ou en vertical, endroit calme, pas de musique derrière.
> **Avant demain 10h, pas après.** »

Conseils d'enregistrement :
- Voix proche du micro (20 cm), pièce sans écho, pas de vent.
- Un clip par personne, énergie joyeuse, commencer à parler tout de suite.
- Baisse la musique de 6 à 8 dB pendant les voix (la fonction « ducking » de CapCut le fait en un clic).

## Changer les textes ou le « vous »

Tout est regroupé dans le bloc `CONFIG` en haut de `index.html` : date, titres, mots du « Merci pour votre… », messages des bulles. Les textes sont écrits au **vouvoiement** (« votre », « vous »), à adapter si la communauté le tutoie.

## Ajouter des photos

Dépose 3 à 7 photos (JPG, PNG ou WebP, de préférence verticales ou carrées) dans le dossier `photos/`, puis relance le rendu. Elles remplacent le texte « MERCI » dans la fenêtre 20 – 34 s, dans un cadre doré avec un léger travelling.
```
node render.mjs out/silencieux.mp4 30
ffmpeg -i out/silencieux.mp4 -i out/musique.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest ANNIVERSAIRE_Apotre_Amos_Elite.mp4
```
