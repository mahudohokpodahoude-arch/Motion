# Voix off humaine : mode d'emploi

## 1. Enregistrer (téléphone ou micro, pièce calme, voix énergique « spot radio »)
Lire les 10 phrases dans l'ordre, **en marquant une vraie pause (1 seconde) entre chaque**. Un seul fichier suffit.

1. Votre casier judiciaire, en ligne, instantanément !
2. Rendez-vous sur service-public point B J.
3. Choisissez la délivrance du casier judiciaire.
4. Indiquez votre profil.
5. Saisissez le code reçu par e-mail.
6. Vérifiez vos informations.
7. Payez mille neuf cents francs C F A.
8. Et voilà : votre bulletin, tout de suite !
9. Aucune pièce. Aucun déplacement.
10. Rendez-vous maintenant sur le site !

Conseils : phrases courtes et punchy, sourire dans la voix, même distance au micro, pas de musique de fond.
Une voix de femme (phrases 1 à 8) et une voix d'homme (9 et 10) donnent le contraste du spot de référence ; une seule voix convient aussi.

## 2. Importer et refaire la vidéo
```
python3 voice/import_voice.py mon_enregistrement.wav   # découpe sur les silences + recale timeline.json
python3 sound.py sound.wav                              # musique + voix, calés sur la timeline
PLAYWRIGHT_PATH=<chemin de playwright> node render.mjs silent.mp4 30
ffmpeg -i silent.mp4 -i sound.wav -map 0:v -map 1:a -c:v copy -af volume=-1.5dB -c:a aac -b:a 224k -shortest Guide_voix_humaine.mp4
```
Si le script ne trouve pas 10 phrases, allonger les pauses entre les phrases.
Durée maximale : 63 temps à 128 BPM (≈ 29,5 s).
