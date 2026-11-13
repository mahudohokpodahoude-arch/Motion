# Annonce Week-end Zone Women · animation calquée sur la vidéo de référence (concert « Lagos »)
40,2 s · 1920×1080 · pas de voix. Source graphique : le flyer officiel (visages des intervenantes détourés du flyer en vignettes).
Même découpage que la référence (au temps près, calé sur la grille de 0,6 s du morceau) :
0-1,8 s accroche sur fond gris (« FEMMES / ÊTES-VOUS / PRÊTES ? », trait rouge, croix) · 1,8-3,6 carte « WEEK-END ZONE WOMEN » · 3,6-8,4 titre sur coupes rapides + échos · 8,4-20,4 carrousel des intervenantes (voisines floutées en gris, bandeau rouge, nom à droite, 1,2 s chacune) · 20,4-24 date · 24-28,2 adresse (lettres qui tournent) · 28,2-32,4 entrée gratuite + contact · 32,4-35,4 « NE MANQUE PAS » + glitch · 35,4-40,2 flyer.
Musique : « Rejoice » (fichier fourni par l'équipe), extrait 35,44 s → 75,64 s ; sound design `tools/sfx.py` mixé sous le morceau (environ −14 dB). Mixage : voir la commande du teaser (`teaser-wzw-reels/BRIEF.md`), avec -t 40.2 et fondu de sortie 2,5 s.
Limites : résolution des visages = celle du flyer ; 10 intervenantes seulement (celles du flyer).
Rendu : `npx hyperframes render --quality delivery -o renders/annonce.mp4`
