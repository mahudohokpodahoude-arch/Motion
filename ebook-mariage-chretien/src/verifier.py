# -*- coding: utf-8 -*-
"""Contrôles éditoriaux : aucune question perdue, 10 questions par thème, pas de doublon.

Usage : python3 src/verifier.py   (après python3 src/build.py ; contrôle les deux versions)
"""
import difflib
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from build import FORMATS, ORIG, THEMES, fr  # noqa: E402
from themes import REFORMULATIONS  # noqa: E402

erreurs = []

# 1. 38 thèmes de 10 questions
if len(THEMES) != 38:
    erreurs.append(f"{len(THEMES)} thèmes au lieu de 38")
for t in THEMES:
    if len(t["questions"]) != 10:
        erreurs.append(f"thème {t['num']} : {len(t['questions'])} questions")

# 2. Les 300 questions d'origine sont toutes présentes (telles quelles ou reformulées et tracées)
finales = {}
for t in THEMES:
    for i, q in enumerate(t["questions"], 1):
        finales[f"{t['num']}.{i}"] = q
conservees = reformulees = 0
for o in ORIG:
    t = next(x for x in THEMES if x["id"] == f"O{o['num']}")
    for i, q in enumerate(o["questions"], 1):
        cle = f"O{o['num']}.{i}"
        actuelle = t["questions"][i - 1]
        if actuelle == q:
            conservees += 1
        elif cle in REFORMULATIONS and actuelle == REFORMULATIONS[cle][0]:
            reformulees += 1
        else:
            erreurs.append(f"question d'origine {o['num']}.{i} introuvable")
if conservees + reformulees != 300:
    erreurs.append(f"{conservees + reformulees} questions d'origine retrouvées sur 300")

# 3. Doublons ou quasi-doublons entre questions finales
items = list(finales.items())
proches = []
for a in range(len(items)):
    for b in range(a + 1, len(items)):
        r = difflib.SequenceMatcher(None, items[a][1].lower(), items[b][1].lower()).ratio()
        if r > 0.8:  # 0.75-0.8 : mêmes tournures, sujets différents (vérifié à la main)
            proches.append((round(r, 2), items[a][0], items[b][0]))
for r, a, b in proches:
    erreurs.append(f"questions très proches ({r}) : {a} / {b}")

# 4. Chaque question figure bien dans chacun des deux PDF
norm = lambda s: re.sub(r"[\W_]+", "", s.replace("\u2010", "")).lower()  # noqa: E731
presence = {}
for nom in FORMATS.values():
    pdf = ROOT / "build" / f"{nom}.pdf"
    if not pdf.exists():
        presence[nom] = None
        continue
    texte = subprocess.run(["pdftotext", str(pdf), "-"], capture_output=True, text=True).stdout
    texte_n = norm(re.sub(r"-\n", "", texte))
    absentes = [k for k, q in finales.items() if norm(fr(q)) not in texte_n]
    presence[nom] = len(finales) - len(absentes)
    for k in absentes:
        erreurs.append(f"question {k} absente de {nom}.pdf")

print(f"Thèmes : {len(THEMES)} · questions : {len(finales)}")
print(f"Questions d'origine : {conservees} conservées telles quelles + {reformulees} reformulées = {conservees + reformulees}/300")
print(f"Questions nouvelles : {len(finales) - 300}")
for nom, n in presence.items():
    print(f"Présence dans {nom}.pdf :", "non vérifiée (PDF absent)" if n is None else f"{n}/{len(finales)}")
if erreurs:
    print("\nPROBLÈMES :")
    print("\n".join(" - " + e for e in erreurs))
    sys.exit(1)
print("Tout est conforme.")
