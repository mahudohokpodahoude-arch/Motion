# Passation de session · Communication et design Zone 242

Dossier écrit pour qu'une nouvelle session (Claude Code) reprenne le travail sans rien perdre.
**Première consigne à donner à la nouvelle session :** « Lis `zone242-com-session/CONTEXTE.md`, puis continue. »
Dépôt : `mahudohokpodahoude-arch/Motion`, branche `claude/heygen-hyperframes-skill-daqjej`.

## 1. Qui, quoi, comment travailler
- Utilisateur : équipe communication de **Zone 242** (Sikècodji, Cotonou), mission **MILMO**. Réponses **en français**, directes, structurées, une idée à la fois. Dire clairement quand une chose est impossible ou incertaine ; ne pas inventer d'informations (prix, liens, noms).
- Outil vidéo : **HyperFrames** (HTML + GSAP, rendu MP4). Chaque projet vidéo a son dossier à la racine du dépôt. Pas d'accès CDN : bibliothèques et polices sont copiées en local (`gsap/`, `assets/`).
- Les visuels fixes sont faits en HTML rendu par Chromium (Playwright). Les scripts générateurs sont dans `livrables/scripts-sources/`.
- Je ne peux pas créer de Google Form : un script Apps Script le fait (voir `livrables/formulaire/`).

## 2. Charte
- Marque Zone 242 : bleu `#1900CF`, orange `#FF5A36`, polices Montserrat (génériques bleus). Logo : `zone242-motion-3d/assets/logo/` (SVG bleu et orange).
- **Affiche du week-end (référence couleurs)** : dégradé `#EE1A02 → #F12E04 → #F5541A → #FB7A2A`, formes anguleuses claires/foncées, bleu `#0260A6` pour dates et repères, blanc, crème `#FFE3CF`. Titre « WZW » + script « WEEK-END ZONE WOMEN » (extraits de l'affiche d'origine). Polices : Bebas Neue (titres), Montserrat (détails).
- Règles vidéo : **aucune voix** ; sound design et musique **synthétisés** (originaux) ; niveau doux (pic −9 dBFS pour les effets ; musique à environ −18 LUFS). Horaires écrits « 9h00 » (h minuscule).

## 3. Week-end Zone Women · 27-29 novembre 2026 · Zone 242, Sikècodji
Thème : **Restaurée · Ointe · Envoyée**. Slogan : « Les femmes prennent le contrôle de la Zone ». Contact (sur l'affiche) : contact.zone242@gmail.com · 0141627777. Hashtags : #ZoneWoman #Restaurée #Ointe #Envoyée. Rue de Golf.FM.

**Programme : version « Organisation WZW 2026 » (reçue le 8 nov., remplace l'ancienne ; seules les dates ont changé).** Voir `livrables/documents/Plan_Com_Week-end_Zone_Women.pdf` (annexe) pour le détail.
- Message fort : pendant tout le week-end, les femmes tiennent l'accueil, la louange, l'animation et l'organisation.

**Décisions prises**
- **150 places** pour le week-end, **participation gratuite** (confirmé par l'utilisateur le 8 nov.), inscription obligatoire. Aucun prix ni zone VIP à afficher. Plus de Women's Night ni d'atelier jeunes filles : le PDF « Organisation WZW 2026 » est la version **finale** du programme (dates 27-29 nov.).
- Programme résumé : ven. 27 19h45 lancement · sam. 28 Women's Experience Day (relaxation, Panel 1, Belle et en bonne santé, Panels 2 à 4, table ronde 17h15-18h15) · dim. 29 culte 8h45 + Agapè des Femmes 11h30.
- Suivi des créations pour le graphiste : Google Sheet « Suivi des créations · Week-end Zone Women 2026 » (https://docs.google.com/spreadsheets/d/1Mno6iyDza4z_s1iIU5NTFxetD6Ya5WsQqNesR9YwURQ/edit) (copie xlsx dans `livrables/documents/`).
- Orthographes imposées : **Jessie Vanessa**, **Pasteure Veronica**, **Pasteure Anne-Laure**, « 9h00 ».
- Dr Hestia SEGBEY DAOUDOU : docteur en médecine, consultante bien-être en périnatalité et parentalité, leader de la TDM (Tour de Mariage) ; intervient au Panel 2 et au Panel 4.
- Formulaire d'inscription : **Google Forms** (retenu). En-tête 1600×400 prêt.

## 4. Ce qui est fait
| Livrable | Où |
|---|---|
| Plan de com et de design (PDF, 10 p., 22 idées vidéo) | `livrables/documents/` |
| Brief graphiste mis à jour (avec « Save the date », échéance 4 nov.) | `livrables/documents/` |
| Script du Google Form (mis à jour : programme final, 27-29 nov., Agapè, gratuit) | `livrables/formulaire/` |
| En-tête Google Form 1600×400 et 3200×800 (dates 27-29 nov.) | `livrables/entetes/` |
| Carrousel programme carré 1080×1080 (8 diapos, programme final, 27-29 nov.) | `livrables/carrousels/Programme_WZW_carre_*.png` |
| Carrousel « 4 raisons de venir » carré (6 diapos, 1080×1080) | `livrables/carrousels/4_raisons_WZW_*.png` |
| Présentation vidéo de Dr Hestia (10 s, 1920×1080, musique) | `presentation-dr-hestia/` (modèle réutilisable pour les autres intervenantes) |
| Génériques « Question à l'Apôtre Amos » : début et fin, 4 s, formats 9:16, 4:3, 16:9, sound design doux | `generique-questions-pasteurs/`, `generique-fin-zone242/` (sous-dossiers `formats/`) |
| Génériques de rubriques : « Je déclare » (3 s), « L'essentiel à retenir du Message » (3 s, vibe motion) | `generique-je-declare/`, `generique-essentiel-message/` |
| Logo animé WZW « Week-end Zone Women » (5 s, 1920×1080, jingle original) ; lettres et mots découpés dans `assets/` | `logo-wzw-anime/` |
| Logo WZW en 3D (5 s, 1920×1080, extrusion réelle, musique sans gong) : remplace la version 2D | `logo-wzw-3d/` |
| Quotes Apôtre Amos Elite (5 citations, portrait et carré) ; affiches retouchées ; miniatures YouTube | `livrables/quotes/`, `livrables/affiches/`, `livrables/miniatures/` |
| Fonds animés boucle 10 s pour paroles (violet, orange, chevrons rouges) | `adoration-fond-fumee/`, `adoration-fond-orange/`, `fond-chevrons-rouges/` |
| Film 3D ZONE 242 (en pause à la scène 1/9) | `zone242-motion-3d/` |

## 5. Points encore ouverts
1. ~~Orthographe du nom~~ : tranché, « Zone Women » partout (hashtag #ZoneWoman conservé).
2. ~~Zone VIP~~ : supprimée, participation gratuite.
3. **Lien d'inscription / QR code** : le formulaire n'est pas encore créé. Lancer le script sur script.google.com, puis demander le QR code et l'ajouter sur la diapo 8 du programme carré, l'affiche et les flyers.
4. **Palette et logo « Zone Women »** pour le graphiste ; **photos HD** des 12 autres intervenantes (déjà reçue : Dr Hestia) ; photo de la Prophétesse.
5. **Affiche baptême** : brouillon sans illustration (fond « eau », « BAPTÊME », logo, adresse « Cotonou Sikecodji rue Golf FM », 1920×1080). Manque la personne plongée dans l'eau : demander une photo à détourer ou valider une silhouette stylisée.
6. Textes à corriger côté programme : « Mme Tossou / Dr Hestia » (slash), « etc… », « L'équipe du MD » (préciser).
7. Idées vidéo à produire ensuite : save the date, teaser du thème, annonce officielle, spot Women's Night, compte à rebours J-7 à J-1, récap (voir le plan de com PDF).

- **12 nov. :** affiche « Coming soon » publiée le 11 nov. ; plan de com refait à J-15 (calendrier jour par jour du 11 nov. au 30 nov., sans Women's Night ni atelier jeunes filles, règle « aucune captation de la table ronde »). Source : `livrables/scripts-sources/build_plan_com.py`.

## 6. Pièges techniques déjà rencontrés
- Le dossier temporaire de session disparaît : tout livrable doit être copié dans le dépôt puis poussé.
- `hyperframes lint` refuse les tweens GSAP sur `left`/`top` (utiliser `x`/`y`) et signale deux `fromTo` sur le même élément (mettre `immediateRender: false` sur le second).
- Bebas Neue n'a que des capitales : pour un « h » minuscule dans les horaires, utiliser Montserrat.
- Détourage : modèles ONNX (ISNet) à retélécharger depuis les versions de `danielgatis/rembg` sur GitHub ; matting fin avec `pymatting`.
- Les photos d'origine envoyées par l'utilisateur ne sont pas dans le dépôt (seulement les copies redimensionnées utilisées) : les redemander si besoin.

---

## 7. Mise à jour du 19 novembre 2026 (J-8) · à lire en premier dans une nouvelle fenêtre

### 7.1 Règles et choix validés par l'utilisateur
- Écrire en français, direct, structuré, une idée à la fois ; ne rien inventer (prix, liens, noms) ; dire clairement ce qui n'a pas été vérifié (musique non écoutée, etc.).
- Orthographes imposées : **Pasteure Veronica** (l'utilisateur a écrit « Pasteur Véronica » une fois : à reconfirmer), **Jessie Vanessa**, **Servante Manne** (pas « Prophétesse »), **Pasteure Anne-Laure**, **Week-end Zone Women**, **Dr Sylvie**, **Dr Marjolaine**, **Servante Roukiyatou PIWO**, « Madame Tossou ». Prophétesse **Mary TONGSI** (invitée d'honneur, écrit « INVITÉE » comme sur l'affiche). Horaires « 9h00 ».
- Pas de PR sans demande. Branche : `claude/heygen-hyperframes-skill-daqjej`. Pas de bandes rouges ni de notes en bas des PDF de planning. PDF lisibles : paysage, police Montserrat 14 px.
- Il faut **varier le style des contenus** : l'utilisateur ne veut pas que tout se ressemble.

### 7.2 Planning de publication (PDF : `livrables/documents/Planning_publication_WZW.pdf`, source `livrables/scripts-sources/build_planning_scripts.py`)
- Jeu 19 : carrousel « 4 raisons » à 16h (publié). Ven 20 : vidéo motion des panélistes à 16h ; vidéo de la Prophétesse Mary à tourner.
- Dès sam 21 : 2 bios par jour (12h30 et 16h00), en commençant par Pasteure Veronica. Ordre : 21 Veronica + Anne-Laure ; 22 Hestia + Pélagie ; 23 Sylvie + Marjolaine ; 24 Manne + Richmelle ; 25 Jessie + Espérance ; 26 Huldah + Tossou ; 27 matin Roukiyatou, Murielle, Imalia.
- Contenus d'inscription 1 à 6 (scripts fournis par l'utilisateur, sous le tableau du PDF) : 2 sam 21 18h ; 3 dim 22 18h ; 1 lun 23 18h ; 4 mar 24 10h ; 6 mer 25 10h ; 5 jeu 26 10h. Vidéo Mary (mar 24 20h) et vidéo de Pasteure Delmica (mer 25 20h, orthographe à confirmer).
- Décomptes J-5 à J-1 en stories à 7h30. Les vidéos tournées « Restaurée / Ointe / Envoyée » ont été retirées du planning.
- Heures proposées par l'assistant sauf vendredi 16h et 20h (à corriger avec les statistiques de la page).

### 7.3 Vidéos et visuels produits (tous poussés)
| Livrable | Dossier / fichier |
|---|---|
| Annonce 40 s, 14 intervenantes, 16:9 et 9:16 (fin 9:16 = affiche story) | `annonce-wzw-reference/`, `annonce-wzw-reels/` |
| Profil 1080 + couverture Facebook | `zone242-com-session/livrables/reseaux-sociaux/` |
| Carrousel « 4 raisons » carré épuré (6 diapos) | `livrables/carrousels/4_Raisons_WZW_carre_0*.png` |
| « Un mot, une session » 36,4 s, style Vibe motion (cartes blanches, légende mot à mot, fond de l'affiche), musique Deborah Lukalu | `un-mot-une-session-vibe-reels/` (anciennes versions : `un-mot-une-session-reels/`) |
| « Le week-end en chiffres » 24 s (grands chiffres, aplats, bande défilante, scène Prophétesse Mary) | `week-end-en-chiffres-reels/` |
| « Invite une amie » conversation de messagerie, finances (Panel 3) | `invite-une-amie-reels/` |
| « Invite une amie » conversation, blessures (Panel 1), musique « BOBO » de Sam BHLU à partir de 0:46 | `invite-une-amie-blessures-reels/` |
| PDF d'idées de vidéos (cartes, puis texte continu) | `livrables/documents/Idees_videos_simples_WZW.pdf`, `Idees_videos_texte_WZW.pdf` |

### 7.4 Légendes proposées (à copier)
- **Carrousel « 4 raisons »** et **« Le week-end en chiffres »** : voir les textes ci-dessous, avec le lien https://milmo-zone242.vercel.app/wzw.html#programme (à vérifier : mène-t-il à l'inscription ?). Instagram : lien dans la bio.
- « En chiffres » : « 3 jours. 6 sessions. 14 intervenantes. 150 places. Du vendredi 27 au dimanche 29 novembre 2026, rendez-vous au WEEK-END ZONE WOMEN, à Zone 242 – Sikècodji (rue de Golf FM, Cotonou). Soirée de lancement vendredi 19h45 avec la Prophétesse Mary TONGSI ; panels, « Belle et en bonne santé » et grande table ronde samedi ; culte de clôture dimanche 8h45 puis Agapè 11h30. Gratuit, inscription obligatoire. #ZoneWoman #Restaurée #Ointe #Envoyée »
- Le chiffre **14 intervenantes** n'est pas confirmé (Murielle et Imalia animent la table ronde).

### 7.5 Musique : ce qu'il faut savoir
- Morceau d'origine « Rejoice » **perdu** (non rechargeable). Morceaux fournis ensuite : Deborah Lukalu « Restauré · Trust in the Storm » (extrait à partir de 19,1 s ou 87 s) ; Sam BHLU « BOBO » (104 bpm, grille de temps : 0,24 s + k × 0,5767 s). Droits d'auteur à vérifier avant publication.
- La reconnaissance de la parole est **inaccessible** (téléchargement Hugging Face bloqué) : l'emplacement de « Voici mon bobo / Jésus guéris mon bobo » vient du choix de l'utilisateur (extrait 2 = 0:46).
- Musiques synthétisées de secours dans chaque projet (`tools/musique*.py`) : l'utilisateur les a refusées.

### 7.6 Reste à faire / questions ouvertes
1. Graphie « Pasteure Veronica » ; ordre des bios ; rôle de Roukiyatou (absente du programme) ; noms de famille (Sylvie, Marjolaine, Tossou, Murielle, Imalia) ; orthographe « Delmica ».
2. Contenu de la vidéo de la Prophétesse Mary et qui la tourne.
3. Lien d'inscription réel + QR code ; formulaire Google (script prêt).
4. Affiche officielle à jour avec les 14 intervenantes (l'affiche story actuelle en montre 11).
5. Quel passage exact de « BOBO » sur le reste des vidéos ; appliquer ou non cette musique aux autres vidéos.
6. Présentations de panélistes en motion (style photo plein cadre) : à produire.
7. Légendes Facebook : annonce 40 s, « un mot, une session », conversations (finances et blessures).

### 7.7 Pièges techniques ajoutés
- `rm -rf` / `rm` avec variable shell est bloqué par la sécurité : utiliser des chemins littéraux.
- `fromTo` GSAP rend l'état de départ immédiatement : mettre `immediateRender: false` pour les flashs et éléments qui ne doivent pas être visibles au début.
- `hyperframes lint` refuse les polices système (ex. Noto Color Emoji) citées dans `font-family` ; les emojis s'affichent quand même au rendu local.
- Scratchpad vidé à chaque reprise : polices, logos et lockup se retrouvent dans `teaser-wzw-reels/assets/` (lockup_masque.png, polices) et `presentation-dr-hestia/assets/logos_alpha.png` ; modèle ISNet à retélécharger depuis GitHub (rembg v0.0.0).
- « /reverse-motion » n'existe pas comme commande : analyser la vidéo de référence image par image (`ffmpeg`).
