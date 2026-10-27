# -*- coding: utf-8 -*-
"""Génère l'e-book (HTML puis PDF via WeasyPrint).

Usage : python3 src/build.py            -> build/avant-de-dire-oui.html + .pdf
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))

import pages as P  # noqa: E402
from themes import CONSERVES, PARTIES, REFORMULATIONS, T  # noqa: E402

ORIG = json.loads((ROOT / "src" / "questions_originales.json").read_text(encoding="utf-8"))
ROMAINS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]


# ------------------------------------------------------------------ données
def assembler():
    """Retourne la liste ordonnée des thèmes avec numéro, partie et questions."""
    themes, num = [], 0
    for ip, (ptitre, _, ids) in enumerate(PARTIES):
        for tid in ids:
            num += 1
            t = dict(T[tid])
            t["id"], t["num"], t["partie"] = tid, num, ip
            if tid.startswith("O"):
                o = ORIG[int(tid[1:]) - 1]
                t["orig_num"], t["orig_titre"] = o["num"], o["titre"]
                qs = []
                for i, q in enumerate(o["questions"], 1):
                    key = f"{tid}.{i}"
                    qs.append(REFORMULATIONS[key][0] if key in REFORMULATIONS else q)
                t["questions"] = qs
            assert len(t["questions"]) == 10, tid
            themes.append(t)
    return themes


THEMES = assembler()
NUM = {t["id"]: t["num"] for t in THEMES}


# ------------------------------------------------------------------ typo
def fr(s):
    """Typographie française : apostrophes courbes et espaces insécables."""
    s = s.replace("'", "\u2019")
    s = re.sub(r"\s+([?!;])", "\u202f\\1", s)
    s = re.sub(r"\s+:", "\u00a0:", s)
    s = re.sub(r"«\s*", "«\u00a0", s)
    s = re.sub(r"\s*»", "\u00a0»", s)
    s = re.sub(r"(\d) (\d{3})", "\\1\u00a0\\2", s)
    return s


def esc(s):
    return fr(html.escape(s, quote=False))


def lines(n, cls="wl"):
    return "".join(f'<div class="{cls}"></div>' for _ in range(n))


# ------------------------------------------------------------------ SVG
RINGS = """
<svg class="rings" viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
  <circle cx="86" cy="62" r="40" fill="none" stroke="#d9b779" stroke-width="3"/>
  <circle cx="134" cy="62" r="40" fill="none" stroke="#d9b779" stroke-width="3"/>
  <circle cx="86" cy="62" r="34" fill="none" stroke="#d9b779" stroke-width="0.8" opacity="0.6"/>
  <circle cx="134" cy="62" r="34" fill="none" stroke="#d9b779" stroke-width="0.8" opacity="0.6"/>
  <path d="M110 12 L110 0 M104 6 L116 6" stroke="#d9b779" stroke-width="1.6" fill="none"/>
  <path d="M40 128 Q110 100 180 128" stroke="#d9b779" stroke-width="1.2" fill="none"/>
  <g fill="#d9b779" opacity="0.9">
    <ellipse cx="60" cy="118" rx="7" ry="2.6" transform="rotate(-28 60 118)"/>
    <ellipse cx="76" cy="111" rx="7" ry="2.6" transform="rotate(-18 76 111)"/>
    <ellipse cx="92" cy="107" rx="7" ry="2.6" transform="rotate(-8 92 107)"/>
    <ellipse cx="128" cy="107" rx="7" ry="2.6" transform="rotate(8 128 107)"/>
    <ellipse cx="144" cy="111" rx="7" ry="2.6" transform="rotate(18 144 111)"/>
    <ellipse cx="160" cy="118" rx="7" ry="2.6" transform="rotate(28 160 118)"/>
    <ellipse cx="68" cy="124" rx="6" ry="2.2" transform="rotate(40 68 124)"/>
    <ellipse cx="152" cy="124" rx="6" ry="2.2" transform="rotate(-40 152 124)"/>
    <circle cx="110" cy="104" r="2.4"/>
  </g>
</svg>"""

ORNEMENT = """<svg class="orn" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
<line x1="0" y1="6" x2="86" y2="6" stroke="currentColor" stroke-width="0.8"/>
<path d="M100 1 L105 6 L100 11 L95 6 Z" fill="currentColor"/>
<circle cx="90" cy="6" r="1.4" fill="currentColor"/><circle cx="110" cy="6" r="1.4" fill="currentColor"/>
<line x1="114" y1="6" x2="200" y2="6" stroke="currentColor" stroke-width="0.8"/></svg>"""


# ------------------------------------------------------------------ blocs
def page_section(sid, kicker, titre, corps, cls=""):
    return f"""
<section class="chap {cls}" id="{sid}">
  <div class="chap-kicker">{esc(kicker)}</div>
  <h1 class="chap-title">{esc(titre)}</h1>
  <div class="orn-wrap">{ORNEMENT}</div>
  <div class="prose">{fr(corps)}</div>
</section>"""


def couverture():
    return f"""
<section class="cover">
  <div class="cover-frame">
    <div class="cover-top">Édition enrichie</div>
    {RINGS}
    <h1 class="cover-title">Avant de dire <em>oui</em></h1>
    <div class="cover-sub">{esc(P.SOUS_TITRE)}</div>
    <div class="cover-orn">{ORNEMENT}</div>
    <div class="cover-meta">9 parties · 38 thèmes · 380 questions</div>
    <div class="cover-bottom">
      <div class="cover-tag">{esc(P.ACCROCHE)}</div>
      <div class="cover-aud">Pour les fiancés, les pasteurs et les accompagnateurs</div>
      <div class="cover-author">[Nom de l'auteur]</div>
    </div>
  </div>
</section>"""


def page_titre():
    return f"""
<section class="titlepage">
  <div class="tp-title">Avant de dire <em>oui</em></div>
  <div class="tp-sub">{esc(P.SOUS_TITRE)}</div>
  <div class="orn-wrap">{ORNEMENT}</div>
  <div class="tp-meta">{esc(P.MENTION_EDITION)}</div>
  <div class="mentions">{fr(P.MENTIONS)}</div>
</section>"""


def sommaire():
    def row(href, label, cls=""):
        return f'<li class="{cls}"><a href="#{href}">{label}</a></li>'

    out = ['<section class="toc" id="sommaire"><div class="chap-kicker">Sommaire</div>'
           '<h1 class="chap-title">Table des matières</h1><div class="orn-wrap">' + ORNEMENT + '</div><ul>']
    for sid, lab in [("introduction", "Introduction"), ("ne-mesure-pas", "Ce que ce guide ne mesure pas"),
                     ("mode-emploi", "Mode d'emploi pour le couple"), ("accompagnateurs", "Pour les pasteurs et accompagnateurs"),
                     ("lire-bible", "Lire la Bible avec justesse"), ("engagement", "Notre engagement de dialogue")]:
        out.append(row(sid, esc(lab), "t-front"))
    for ip, (ptitre, _, ids) in enumerate(PARTIES):
        out.append(row(f"partie-{ip+1}", f'<span class="tn">Partie {ROMAINS[ip]}</span>{esc(ptitre)}', "t-part"))
        for tid in ids:
            t = THEMES[NUM[tid] - 1]
            badge = ' <span class="tag sm">Nouveau</span>' if t.get("nouveau") else ""
            out.append(row(f"theme-{t['num']}", f'<span class="tn">{t["num"]}</span>{esc(t["titre"])}{badge}', "t-theme"))
    out.append(row("fin", "<span class=\"tn\"></span>Pour la suite du chemin", "t-part"))
    for sid, lab in [("conclusion", "Conclusion"), ("accompagnement-pro", "Quand demander un accompagnement professionnel"),
                     ("fiches", "Fiches de suivi"), ("concordance", "Annexe : concordance et journal éditorial"),
                     ("sources", "Sources")]:
        out.append(row(sid, esc(lab), "t-front"))
    out.append("</ul></section>")
    return "\n".join(out)


def ouverture_partie(ip):
    ptitre, intro, ids = PARTIES[ip]
    nouveau = ' <span class="tag sm light">Nouveau</span>'
    items = "".join(
        f'<li><span class="pn">{NUM[i]}</span>{esc(T[i]["titre"])}{nouveau if T[i].get("nouveau") else ""}</li>'
        for i in ids)
    return f"""
<section class="part-open" id="partie-{ip+1}">
  <div class="po-label">Partie</div>
  <div class="po-num">{ROMAINS[ip]}</div>
  <h1 class="po-title">{esc(ptitre)}</h1>
  <div class="po-orn">{ORNEMENT}</div>
  <p class="po-intro">{esc(intro)}</p>
  <ul class="po-list">{items}</ul>
</section>"""


def bloc_theme(t):
    n = t["num"]
    ip = t["partie"]
    tag = '<span class="tag">Nouveau thème</span>' if t.get("nouveau") else (
        f'<span class="origin">Thème {t["orig_num"]} de l\u2019édition précédente</span>')
    conseils = "".join(f"<li>{esc(c)}</li>" for c in t["conseils"])
    refs = "".join(f'<div class="ref"><div class="ref-k">{esc(r)}</div><div class="ref-n">{esc(note)}</div></div>'
                   for r, note in t["refs"])
    alerte = (f'<div class="alerte"><div class="alerte-k">Attention</div><p>{esc(t["alerte"])}</p></div>'
              if t.get("alerte") else "")
    voir = ", ".join(f'<a href="#theme-{NUM[v]}">{NUM[v]}. {esc(T[v]["titre"])}</a>' for v in t.get("voir", []))
    qs = "".join(
        f'<li><div class="q"><span class="qn">{n}.{i}</span><span class="qt">{esc(q)}</span></div><div class="ql"></div></li>'
        for i, q in enumerate(t["questions"], 1))
    prompts = ["Ce que j'ai découvert sur moi", "Ce que j'ai découvert sur l'autre",
               "Ce qui me questionne ou m'inquiète", "Ce que je m'engage à faire"]
    col = "".join(f'<div class="rp"><div class="rp-k">{esc(p)}</div>{lines(2)}</div>' for p in prompts)
    bilan_rows = ["Nos points d'accord", "Nos différences", "Décisions et actions", "Personne ou ressource à consulter"]
    bilan = "".join(f'<div class="br"><div class="br-k">{esc(b)}</div>{lines(2)}</div>' for b in bilan_rows)
    qc = sum(len(q) for q in t["questions"])
    ic = (len(t["objectif"]) + sum(map(len, t["conseils"])) + sum(len(a) + len(b) for a, b in t["refs"])
          + len(t["accomp"]) + len(t.get("alerte", "")))
    dense = (" dense-i" if ic > 1150 else "") + (" dense-q" if qc > 1000 else "")
    return f"""
<section class="theme{dense}" id="theme-{n}">
  <div class="th-run">{n} · {esc(t["titre"])}</div>
  <header class="th-head">
    <div class="th-kicker">Partie {ROMAINS[ip]} · {esc(PARTIES[ip][0])}</div>
    <div class="th-num">{n:02d}</div>
    <h2 class="th-title">{esc(t["titre"])}</h2>
    <div class="th-meta">{tag}</div>
  </header>
  <div class="objectif"><div class="lab">Objectif</div><p>{esc(t["objectif"])}</p></div>
  {alerte}
  <h3 class="sec">Pour mener la discussion</h3>
  <ol class="conseils">{conseils}</ol>
  <h3 class="sec">Repères bibliques</h3>
  <div class="refs">{refs}</div>
  <div class="accomp"><div class="lab">Repère pour l'accompagnateur</div><p>{esc(t["accomp"])}</p></div>
  <div class="voir"><span>Voir aussi</span> {voir}</div>

  <div class="qpage">
    <div class="qp-head"><span class="qp-num">{n:02d}</span><span class="qp-t">Les dix questions</span></div>
    <ol class="questions">{qs}</ol>
  </div>

  <div class="rpage">
    <div class="qp-head"><span class="qp-num">{n:02d}</span><span class="qp-t">Espace de réflexion personnelle</span></div>
    <div class="reflexion">
      <div class="rcol"><div class="who">Prénom : <span class="blank"></span></div>{col}</div>
      <div class="rcol"><div class="who">Prénom : <span class="blank"></span></div>{col}</div>
    </div>
    <div class="bilan">
      <div class="bilan-h">Bilan du thème <span class="date">Date : <span class="blank s"></span></span></div>
      {bilan}
      <div class="statut"><span class="st-k">Statut</span>
        <span class="box"></span>Sujet apaisé <span class="box"></span>À reprendre le <span class="blank s"></span>
        <span class="box"></span>Accompagnement souhaité</div>
    </div>
  </div>
</section>"""


# ------------------------------------------------------------------ fiches
def fiches():
    rows = "".join(
        f'<tr><td class="c">{t["num"]}</td><td>{esc(t["titre"])}</td><td></td>'
        f'<td class="c"><span class="box"></span></td><td class="c"><span class="box"></span></td><td class="c"><span class="box"></span></td></tr>'
        for t in THEMES)
    tableau = f"""
<div class="fiche" id="fiches">
  <div class="fiche-k">Fiche 1</div><h2 class="fiche-t">Tableau de bord du parcours</h2>
  <p class="small">Cochez le statut de chaque thème à la fin de la rencontre. Revenez en priorité sur les thèmes « à reprendre ».</p>
  <table class="grid dash"><thead><tr><th>N°</th><th>Thème</th><th>Date</th><th>Apaisé</th><th>À reprendre</th><th>Accomp.</th></tr></thead>
  <tbody>{rows}</tbody></table>
</div>"""

    desaccord_bloc = """
<div class="dis">
  <div class="dis-row"><span class="k">Sujet</span><span class="blank l"></span><span class="k">Thème n°</span><span class="blank s"></span></div>
  <div class="dis-2">
    <div><div class="k">Ma position et ce qui compte pour moi derrière elle</div>""" + lines(3) + """</div>
    <div><div class="k">Sa position et ce qui compte pour lui ou elle</div>""" + lines(3) + """</div>
  </div>
  <div class="k">Ce que nous pouvons essayer, ou comment porter ce désaccord</div>""" + lines(2) + """
  <div class="dis-row"><span class="k">Personne à consulter</span><span class="blank l"></span><span class="k">Reprendre le</span><span class="blank s"></span></div>
</div>"""
    desaccords = f"""
<div class="fiche">
  <div class="fiche-k">Fiche 2</div><h2 class="fiche-t">Nos désaccords à approfondir</h2>
  <p class="small">Un désaccord bien décrit est déjà à moitié apaisé. Cherchez le besoin derrière la position.</p>
  {desaccord_bloc}{desaccord_bloc}
</div>"""

    reg_rows = "".join("<tr><td></td><td></td><td></td><td></td></tr>" for _ in range(15))
    registre = f"""
<div class="fiche">
  <div class="fiche-k">Fiche 3</div><h2 class="fiche-t">Registre de nos décisions</h2>
  <p class="small">Notez ici les décisions prises au fil du parcours. Elles pourront être revues : une décision n'est pas gravée dans le marbre.</p>
  <table class="grid reg"><thead><tr><th>Date</th><th>Décision</th><th>Thème</th><th>À revoir le</th></tr></thead><tbody>{reg_rows}</tbody></table>
</div>"""

    def questionnaire(k, titre, intro, qs, n=3):
        items = "".join(f'<div class="fq"><div class="fq-q">{esc(q)}</div>{lines(n)}</div>' for q in qs)
        return f'<div class="fiche"><div class="fiche-k">{k}</div><h2 class="fiche-t">{esc(titre)}</h2><p class="small">{esc(intro)}</p>{items}</div>'

    mi = questionnaire("Fiche 4", "Bilan à mi-parcours", "À remplir ensemble après la partie IV.", [
        "Qu'avons-nous découvert l'un sur l'autre que nous ignorions ?",
        "Quels thèmes ont été les plus faciles ? Les plus difficiles ? Pourquoi ?",
        "Notre manière de dialoguer s'est-elle améliorée ? Sur quoi devons-nous encore progresser ?",
        "Y a-t-il un sujet que l'un de nous évite ? Comment l'aborder ?",
        "Avons-nous besoin d'un accompagnement pour la suite du parcours ?",
    ])

    affirmations = [
        "Je me sens libre de dire non, ou de demander à reporter le mariage, sans craindre la réaction de l'autre ni de mon entourage.",
        "Je n'ai pas peur de mon fiancé ou de ma fiancée, ni de ses colères.",
        "Je connais sa situation financière, ses dettes et ses engagements, et il ou elle connaît les miens.",
        "Nous avons partagé les informations de santé importantes pour notre vie commune.",
        "Nous sommes d'accord sur le fait d'avoir ou non des enfants, ou nous savons comment porter notre différence.",
        "Je sais comment nous prendrons les décisions importantes, et j'y aurai réellement ma place.",
        "Aucun secret important ne pourrait, s'il était découvert, changer ma décision.",
        "Nos familles respectent notre décision, ou nous savons comment poser des limites.",
        "Je choisis ce mariage pour l'autre, et non pour échapper à une situation, plaire à quelqu'un ou obéir à une pression.",
        "Je sais vers qui me tourner si un jour je ne me sens plus en sécurité.",
    ]
    aff = "".join(f'<tr><td>{esc(a)}</td><td class="c"><span class="box"></span></td><td class="c"><span class="box"></span></td><td class="c"><span class="box"></span></td></tr>' for a in affirmations)
    final = f"""
<div class="fiche">
  <div class="fiche-k">Fiche 5</div><h2 class="fiche-t">Bilan final : pouvons-nous dire oui librement ?</h2>
  <div class="callout"><p><strong>À remplir chacun séparément</strong>, puis à partager si vous le souhaitez, ou avec votre accompagnateur.
  Une réponse « non » ou « pas sûr » n'est pas un échec : c'est une information précieuse à prendre au sérieux avant de fixer ou de maintenir une date.</p></div>
  <table class="grid aff"><thead><tr><th>Affirmation</th><th>Oui</th><th>Pas sûr</th><th>Non</th></tr></thead><tbody>{aff}</tbody></table>
  <div class="fq"><div class="fq-q">Ce dont j'ai encore besoin avant de m'engager :</div>{lines(4)}</div>
</div>"""

    an = questionnaire("Fiche 6", "Bilan après un an de mariage", "Reprenez ce bilan autour de votre premier anniversaire, puis chaque année si vous le souhaitez.", [
        "Qu'est-ce qui nous a le plus rapprochés cette année ?",
        "Qu'est-ce qui a été plus difficile que prévu ?",
        "Quelles décisions du registre devons-nous revoir ?",
        "Chacun se sent-il en sécurité, respecté et libre de grandir dans ce mariage ?",
        "Quels thèmes de ce guide voulons-nous reprendre cette année ?",
        "Pour quoi voulons-nous dire merci, l'un à l'autre et à Dieu ?",
    ])
    return tableau + desaccords + registre + mi + final + an


def concordance():
    rows = []
    for o in ORIG:
        new = THEMES[NUM["O%d" % o["num"]] - 1]
        rows.append(f'<tr><td class="c">{o["num"]}</td><td>{esc(o["titre"])}</td><td class="c">{new["num"]}</td><td>{esc(PARTIES[new["partie"]][0])}</td></tr>')
    nouveaux = "".join(f'<li><strong>{t["num"]}.</strong> {esc(t["titre"])}</li>' for t in THEMES if t.get("nouveau"))
    journal = []
    for key, (texte, raison) in REFORMULATIONS.items():
        tid, qi = key.split(".")
        o = ORIG[int(tid[1:]) - 1]
        journal.append(f"""<div class="jr"><div class="jr-h">Ancienne {o['num']}.{qi} → nouvelle {NUM[tid]}.{qi}</div>
<div class="jr-o"><span>Avant</span> {esc(o['questions'][int(qi)-1])}</div>
<div class="jr-n"><span>Après</span> {esc(texte)}</div>
<div class="jr-r">{esc(raison)}</div></div>""")
    conserves = "".join(f"<li><strong>{esc(a)}</strong> : {esc(b)}</li>" for a, b in CONSERVES)
    return f"""
<section class="chap annex" id="concordance">
  <div class="chap-kicker">Annexe</div>
  <h1 class="chap-title">Concordance et journal éditorial</h1>
  <div class="orn-wrap">{ORNEMENT}</div>
  <div class="prose">
  <p>Cette édition conserve <strong>les 300 questions</strong> de la version précédente. Chaque ancien thème garde ses dix questions, dans le même ordre :
  la question <em>a.b</em> de l'ancienne édition devient la question <em>c.b</em>, où <em>c</em> est le nouveau numéro du thème.</p>
  <h3>Correspondance des thèmes</h3>
  <table class="grid conc"><thead><tr><th>Ancien n°</th><th>Thème</th><th>Nouveau n°</th><th>Partie</th></tr></thead><tbody>{''.join(rows)}</tbody></table>
  <h3>Thèmes ajoutés (80 questions nouvelles)</h3>
  <ul class="cols2">{nouveaux}</ul>
  <h3>Questions reformulées pour éviter les répétitions</h3>
  <p>{len(REFORMULATIONS)} questions ont été légèrement recentrées pour qu'elles ne fassent plus doublon avec une autre. L'intention d'origine est conservée.</p>
  {''.join(journal)}
  <h3>Recoupements conservés volontairement</h3>
  <ul>{conserves}</ul>
  </div>
</section>"""


# ------------------------------------------------------------------ assemblage
def document():
    parts = [couverture(), page_titre(), sommaire(),
             page_section("introduction", "Ouverture", "Introduction", P.INTRODUCTION),
             page_section("ne-mesure-pas", "Avant de commencer", "Ce que ce guide ne mesure pas", P.NE_MESURE_PAS),
             page_section("mode-emploi", "Avant de commencer", "Mode d'emploi pour le couple", P.MODE_EMPLOI),
             page_section("accompagnateurs", "Avant de commencer", "Pour les pasteurs et accompagnateurs", P.ACCOMPAGNATEURS),
             page_section("lire-bible", "Avant de commencer", "Lire la Bible avec justesse", P.LIRE_BIBLE),
             page_section("engagement", "Avant de commencer", "Notre engagement de dialogue",
                          P.ENGAGEMENT + '<div class="sign"><div><div class="k">Prénom et signature</div><div class="wl"></div><div class="k">Date</div><div class="wl"></div></div>'
                          '<div><div class="k">Prénom et signature</div><div class="wl"></div><div class="k">Date</div><div class="wl"></div></div></div>',
                          cls="engage")]
    for ip in range(len(PARTIES)):
        parts.append(ouverture_partie(ip))
        for tid in PARTIES[ip][2]:
            parts.append(bloc_theme(THEMES[NUM[tid] - 1]))
    parts.append(f"""<section class="part-open fin" id="fin"><div class="po-label">Pour la suite</div><div class="po-num">∞</div>
<h1 class="po-title">Pour la suite du chemin</h1><div class="po-orn">{ORNEMENT}</div>
<p class="po-intro">Conclusion, ressources pour demander de l'aide, fiches de suivi et annexes.</p></section>""")
    parts.append(page_section("conclusion", "Pour la suite", "Conclusion", P.CONCLUSION))
    parts.append(page_section("accompagnement-pro", "Ressources", "Quand demander un accompagnement professionnel", P.ACCOMPAGNEMENT_PRO))
    parts.append(f'<section class="chap fiches-wrap"><div class="chap-kicker">Outils</div><h1 class="chap-title">Fiches de suivi</h1>'
                 f'<div class="orn-wrap">{ORNEMENT}</div><div class="prose"><p class="lead">Six fiches à imprimer ou à remplir à l\u2019écran pour garder la trace de votre parcours.</p></div>{fr(fiches())}</section>')
    parts.append(concordance())
    parts.append(page_section("sources", "Annexe", "Sources", P.SOURCES))
    parts.append(f'<section class="back"><div class="back-in"><div class="back-title">Avant de dire <em>oui</em></div>'
                 f'<div class="orn-wrap">{ORNEMENT}</div>'
                 f'<p>{esc("Un guide pour aborder, avant le mariage, tout ce qui compte vraiment : la foi, la communication, la sexualité, l'argent, les familles, les enfants, et aussi les sujets que l'on évite : sécurité, infidélité, dépendances, deuil, crises.")}</p>'
                 f'<p>{esc("380 questions, 38 thèmes, des repères bibliques lus dans leur contexte et des fiches de suivi, pour des fiancés qui veulent dire oui librement, et pour ceux qui les accompagnent.")}</p></div></section>')
    css = (ROOT / "src" / "style.css").read_text(encoding="utf-8")
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Avant de dire oui — 300 questions pour préparer un mariage chrétien</title>
<meta name="author" content="[Nom de l'auteur]"><meta name="description" content="Guide de préparation au mariage chrétien">
<style>{css}</style></head><body>{''.join(parts)}</body></html>"""


def main():
    out = ROOT / "build"
    out.mkdir(exist_ok=True)
    doc = document()
    (out / "avant-de-dire-oui.html").write_text(doc, encoding="utf-8")
    if "--html" in sys.argv:
        return
    from weasyprint import HTML
    HTML(string=doc, base_url=str(ROOT)).write_pdf(out / "avant-de-dire-oui.pdf")
    print("PDF :", out / "avant-de-dire-oui.pdf")


if __name__ == "__main__":
    main()
