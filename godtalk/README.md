# GODTALK — Vision, ambition et projet de développement

Document fondateur (PDF A4, 22 pages) du projet d'entreprise audiovisuelle GODTALK.

- **PDF final** : `dist/GODTALK_Vision_Ambition_Developpement.pdf`
- **Contenu source** : `content/` (cahier des charges Word d'origine)

## Modifier le document

| Quoi | Où |
|---|---|
| Textes des pages (manifeste, vision, clients, feuille de route…) | `src/index.html` |
| Textes des 8 pôles d'activité | `src/poles.js` |
| Couleurs, typographies, mise en page | `src/style.css` |
| Schémas et compositions graphiques (SVG générés) | `src/visuals.js` |
| Logo (noir / blanc, vectorisé depuis le logo fourni) | `assets/logo/` |
| Photos étalonnées / originaux | `assets/images/` · `assets/images/originaux/` |

## Régénérer le PDF

```bash
node tools/build.js                                   # HTML -> PDF via Chromium (Playwright)
python3 tools/grade_images.py assets/images/originaux assets/images   # ré-étalonner les photos
python3 tools/vectorize_logo.py assets/logo/logo-source.jpg assets/logo  # re-vectoriser le logo (pip install potracer)
```

Le script de génération signale tout débordement de texte détecté.

## Points à compléter

- Coordonnées du fondateur : 4e de couverture (bloc `.contact-back`) dans `src/index.html`.
- Les photographies sont des visuels d'illustration : vérifier leurs droits d'usage avant diffusion publique, et les remplacer progressivement par des réalisations GODTALK.
