# Avant de dire oui — e-book de préparation au mariage chrétien

- **PDF final** : `build/avant-de-dire-oui.pdf` (A4, 154 pages)
- **Plan éditorial et analyse** : `PLAN_EDITORIAL.md`
- **Contenu** : `src/themes.py` (38 thèmes), `src/pages.py` (pages liminaires et finales), `src/questions_originales.json` (les 300 questions d'origine)
- **Mise en page** : `src/style.css`

## Régénérer le PDF

```
pip install weasyprint
python3 src/build.py      # produit build/avant-de-dire-oui.html et .pdf
python3 src/verifier.py   # contrôle : 300/300 questions d'origine, 10 par thème, présence dans le PDF
```

Polices : EB Garamond et Source Serif 4 (licence SIL Open Font License), Inter.
