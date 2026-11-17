# Annonce Week-end Zone Women · animation calquée sur la vidéo de référence (concert « Lagos »)
40,2 s · 1920×1080 · pas de voix. Source graphique : photos HD des intervenantes détourées (assets/photos) ; flyer officiel en final.
Même découpage que la référence (au temps près, calé sur la grille de 0,6 s du morceau) :
0-1,8 s accroche sur fond gris (« FEMMES / ÊTES-VOUS / PRÊTES ? », trait rouge, croix) · 1,8-3,6 carte « WEEK-END ZONE WOMEN » · 3,6-8,4 titre sur coupes rapides + échos · 8,4-20,4 carrousel des intervenantes (voisines floutées en gris, bandeau rouge, nom à droite, 1,2 s chacune) · 20,4-24 date · 24-28,2 adresse (lettres qui tournent) · 28,2-32,4 entrée gratuite + contact · 32,4-35,4 « NE MANQUE PAS » + glitch · 35,4-40,2 flyer.
Musique : « Rejoice » (fichier fourni par l'équipe), extrait 35,44 s → 75,64 s ; sound design `tools/sfx.py` mixé sous le morceau (environ −14 dB). Mixage : voir la commande du teaser (`teaser-wzw-reels/BRIEF.md`), avec -t 40.2 et fondu de sortie 2,5 s.
Limites : résolution des visages = celle du flyer ; 11 intervenantes (… Richmelle puis Madame Tossou), 1,2 s chacune. Scènes de fin raccourcies (date 3 s, adresse 3,6 s) pour garder 40,2 s. Restent sans photo : Docteures Sylvie et Majolaine, Murielle, Imalia.
Rendu : `npx hyperframes render --quality delivery -o renders/annonce.mp4`

Mise à jour : 13 intervenantes (… Madame Tossou, Dr Sylvie, Dr Marjolaine), 1,2 s chacune de 8,4 s à 24,0 s ; date 2,4 s, adresse 3,0 s, entrée gratuite 3,0 s ; durée 40,0 s. musique.mp3 recomposé à partir du mix précédent (1 mesure ajoutée dans le carrousel, 2,4 s retirées dans les infos) car le morceau source n’est plus disponible.
