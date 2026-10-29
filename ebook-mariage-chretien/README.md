# Avant de dire oui — e-book de préparation au mariage chrétien

Auteur : Géofroyd KPODAHOUDE

## Les deux fichiers à livrer
- **`build/avant-de-dire-oui-telephone.pdf`** : la version principale, à lire sur téléphone (pages 108 × 192 mm, format écran 9:16, 283 pages). Texte lisible sans zoom, questions en cartes, pas de lignes d'écriture.
- **`build/avant-de-dire-oui-imprimable.pdf`** : la version à imprimer (A5, 290 pages ; s'imprime aussi en A4 avec « ajuster à la page »). Lignes d'écriture, fiches de suivi à remplir, engagement à signer.

La version téléphone renvoie à la version imprimable pour les fiches à remplir : les deux fichiers doivent être vendus ensemble.

## Sources
- **Plan éditorial et analyse** : `PLAN_EDITORIAL.md`
- **Contenu** : `src/themes.py` (38 thèmes), `src/pages.py` (pages liminaires et finales), `src/questions_originales.json` (les 300 questions d'origine)
- **Mise en page** : `src/style.css` (base, version imprimable), `src/telephone.css` (ajustements téléphone), couleurs par partie générées dans `src/build.py`

## Régénérer les PDF

```
pip install weasyprint
python3 src/build.py      # produit les deux versions dans build/
python3 src/verifier.py   # contrôle : 300/300 questions d'origine, 10 par thème, présence dans les deux PDF
```

Polices : EB Garamond et Source Serif 4 (licence SIL Open Font License), Inter.
