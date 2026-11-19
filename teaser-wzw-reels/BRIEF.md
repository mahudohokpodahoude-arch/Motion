# Teaser « Coming soon » · Week-end Zone Women (reels)
12 s · 1080×1920 (9:16) · pas de voix.
Musique de fond : morceau « Rejoice » fourni par l'équipe (extrait 35,54 s → 47,54 s du fichier source, le temps fort tombe à 3,5 s ; fondu de sortie 1,2 s), niveau d'ensemble environ −16 LUFS.
Sound design : `tools/sfx.py` (tics, coups, notes courtes), mixé sous le morceau (environ −13 dB).
Mixage : `ffmpeg -ss 35.54 -t 12 -i morceau.mp3 -i sfx.wav -filter_complex "[0:a]afade=t=in:st=0:d=0.15,afade=t=out:st=10.8:d=1.2,volume=0.62[m];[1:a]volume=0.22[s];[m][s]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=9" assets/musique.mp3`
Animation calée sur le tempo du morceau (100 bpm, un temps = 0,6 s) : logo W 3,5 · Z 4,1 · W 4,7 s, mots 5,3 · 5,9 · 6,5 s, dates 7,7 s, annonce 10,1 s.
« Inscriptions bientôt ouvertes » à remplacer par le lien/QR quand le formulaire est prêt.
Rendu : `npx hyperframes render --quality delivery -o renders/teaser.mp4`
