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
- Suivi des créations pour le graphiste : Google Sheet « Suivi des créations · Week-end Zone Women 2026 » (copie xlsx dans `livrables/documents/`).
- Orthographes imposées : **Jessie Vanessa**, **Pasteure Veronica**, **Pasteure Anne-Laure**, « 9h00 ».
- Dr Hestia SEGBEY DAOUDOU : docteur en médecine, consultante bien-être en périnatalité et parentalité, leader de la TDM (Tour de Mariage) ; intervient au Panel 2 et au Panel 4.
- Formulaire d'inscription : **Google Forms** (retenu). En-tête 1600×400 prêt.

## 4. Ce qui est fait
| Livrable | Où |
|---|---|
| Plan de com et de design (PDF, 10 p., 22 idées vidéo) | `livrables/documents/` |
| Brief graphiste mis à jour (avec « Save the date », échéance 4 nov.) | `livrables/documents/` |
| Script du Google Form (16 questions, 150 places) | `livrables/formulaire/` |
| En-tête Google Form 1600×400 et 3200×800 | `livrables/entetes/` |
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
1. **Orthographe du nom** : l'affiche dit « Zone **Women** », le brief graphiste et le formulaire disent « Zone **Woman** ». À trancher partout.
2. **Zone VIP** : existe-t-elle encore (sans prix) ? Les choix du formulaire proposent « zone normale » et « zone VIP ».
3. **Lien d'inscription / QR code** : le formulaire n'est pas encore créé. Lancer le script sur script.google.com, puis demander le QR code et l'ajouter sur la diapo 6 du programme, l'affiche et les flyers.
4. **Palette et logo « Zone Women »** pour le graphiste ; **photos HD** des 12 autres intervenantes (déjà reçue : Dr Hestia) ; photo de la Prophétesse.
5. **Affiche baptême** : brouillon sans illustration (fond « eau », « BAPTÊME », logo, adresse « Cotonou Sikecodji rue Golf FM », 1920×1080). Manque la personne plongée dans l'eau : demander une photo à détourer ou valider une silhouette stylisée.
6. Textes à corriger côté programme : « Mme Tossou / Dr Hestia » (slash), « etc… », « L'équipe du MD » (préciser).
7. Idées vidéo à produire ensuite : save the date, teaser du thème, annonce officielle, spot Women's Night, compte à rebours J-7 à J-1, récap (voir le plan de com PDF).

## 6. Pièges techniques déjà rencontrés
- Le dossier temporaire de session disparaît : tout livrable doit être copié dans le dépôt puis poussé.
- `hyperframes lint` refuse les tweens GSAP sur `left`/`top` (utiliser `x`/`y`) et signale deux `fromTo` sur le même élément (mettre `immediateRender: false` sur le second).
- Bebas Neue n'a que des capitales : pour un « h » minuscule dans les horaires, utiliser Montserrat.
- Détourage : modèles ONNX (ISNet) à retélécharger depuis les versions de `danielgatis/rembg` sur GitHub ; matting fin avec `pymatting`.
- Les photos d'origine envoyées par l'utilisateur ne sont pas dans le dépôt (seulement les copies redimensionnées utilisées) : les redemander si besoin.
