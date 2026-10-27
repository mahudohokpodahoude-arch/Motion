# -*- coding: utf-8 -*-
"""Génère l'e-book (HTML puis PDF via WeasyPrint), format A5.

Usage : python3 src/build.py            -> build/avant-de-dire-oui.html + .pdf
        python3 src/build.py --html     -> HTML seulement
"""
import html
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))

import pages as P  # noqa: E402
from themes import CLES, CONSERVES, PARTIES, REFORMULATIONS, T  # noqa: E402

ORIG = json.loads((ROOT / "src" / "questions_originales.json").read_text(encoding="utf-8"))
ROMAINS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]

# Une couleur et une icône par partie (contraste du blanc ≥ 4,5:1 sur chaque couleur)
COULEURS = ["#2e6b5e", "#3b5f8f", "#b4553a", "#a0445f", "#5a7834", "#9a6a1f", "#2f7f8a", "#7b5791", "#23463c"]
ICONES_PARTIES = ["user", "cross", "message", "heart", "pulse", "coins", "home", "users", "rings"]
SAPIN, OR = "#23463c", "#c39a55"


# ------------------------------------------------------------------ données
def assembler():
    """Retourne la liste ordonnée des thèmes avec numéro, partie et questions."""
    themes, num = [], 0
    for ip, (ptitre, _, ids) in enumerate(PARTIES):
        for tid in ids:
            num += 1
            t = dict(T[tid])
            t["id"], t["num"], t["partie"], t["cle"] = tid, num, ip, CLES[tid]
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


def lines(n):
    return '<div class="wl"></div>' * n


def teinte(hexa, f):
    """Mélange une couleur avec du blanc (f = part de la couleur)."""
    r, g, b = (int(hexa[i:i + 2], 16) for i in (1, 3, 5))
    return "#%02x%02x%02x" % tuple(round(c * f + 255 * (1 - f)) for c in (r, g, b))


def fonce(hexa, f=0.72):
    r, g, b = (int(hexa[i:i + 2], 16) for i in (1, 3, 5))
    return "#%02x%02x%02x" % tuple(round(c * f) for c in (r, g, b))


# ------------------------------------------------------------------ icônes (trait, 24×24)
ICONES = {
    "user": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "cross": '<path d="M12 2.5v19M6.5 8h11"/>',
    "message": '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/>',
    "heart": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    "pulse": '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    "coins": '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.3 18"/><path d="M7 6h1v4"/><path d="M16.7 13.9l.7.7-2.8 2.8"/>',
    "home": '<path d="M3 9.5 12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    "users": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    "rings": '<circle cx="8.5" cy="14" r="6"/><circle cx="15.5" cy="14" r="6"/><path d="M10 5.5 12 3l2 2.5-2 1.5z"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "bulb": '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.1 14c.2-1 .7-1.7 1.4-2.5A4.7 4.7 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.4 2.5"/>',
    "book": '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    "compass": '<circle cx="12" cy="12" r="10"/><polygon points="16.2 7.8 14.1 14.1 7.8 16.2 9.9 9.9 16.2 7.8"/>',
    "alert": '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    "link": '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    "pen": '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    "check": '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    "question": '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    "map": '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
}


def icone(nom, couleur, taille="5mm", trait=1.8, cls="ic"):
    return (f'<svg class="{cls}" style="width:{taille};height:{taille}" viewBox="0 0 24 24" fill="none" '
            f'stroke="{couleur}" stroke-width="{trait}" stroke-linecap="round" stroke-linejoin="round" '
            f'xmlns="http://www.w3.org/2000/svg">{ICONES[nom]}</svg>')


# ------------------------------------------------------------------ illustration de couverture
def couronne(cx=110, cy=110, r=84, c="#d9b779"):
    """Couronne d'olivier et alliances entrelacées, générées en SVG."""
    out = []
    for debut, fin, sens in ((106, 252, 1), (74, -72, -1)):
        x1, y1 = cx + r * math.cos(math.radians(debut)), cy + r * math.sin(math.radians(debut))
        x2, y2 = cx + r * math.cos(math.radians(fin)), cy + r * math.sin(math.radians(fin))
        out.append(f'<path d="M{x1:.1f} {y1:.1f} A{r} {r} 0 0 {1 if sens > 0 else 0} {x2:.1f} {y2:.1f}" '
                   f'stroke="{c}" stroke-width="1.3" fill="none"/>')
        pas = 9 * sens
        a = debut + 4 * sens
        k = 0
        while (a < fin - 6) if sens > 0 else (a > fin + 6):
            rad = math.radians(a)
            px, py = cx + r * math.cos(rad), cy + r * math.sin(rad)
            tangente = a + 90 * sens
            for cote in (1, -1):
                ang = tangente + cote * 38 * sens
                dx, dy = 6 * math.cos(math.radians(ang)), 6 * math.sin(math.radians(ang))
                op = 0.95 if (k + (cote > 0)) % 2 else 0.7
                out.append(f'<ellipse cx="{px + dx:.1f}" cy="{py + dy:.1f}" rx="7.2" ry="2.7" fill="{c}" opacity="{op}" '
                           f'transform="rotate({ang:.1f} {px + dx:.1f} {py + dy:.1f})"/>')
            if k % 3 == 1:
                bx, by = cx + (r - 9) * math.cos(rad), cy + (r - 9) * math.sin(rad)
                out.append(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="1.6" fill="{c}"/>')
            a += pas
            k += 1
    # petite croix au sommet
    out.append(f'<path d="M{cx} {cy - r - 8} V{cy - r + 8} M{cx - 5} {cy - r - 3} H{cx + 5}" stroke="{c}" stroke-width="1.6"/>')
    # alliances entrelacées
    ra, d, fond = 27, 15, "#1d3a31"
    out.append(f'<circle cx="{cx - d}" cy="{cy + 6}" r="{ra}" stroke="{c}" stroke-width="4.2" fill="none"/>')
    out.append(f'<circle cx="{cx + d}" cy="{cy + 6}" r="{ra}" stroke="{c}" stroke-width="4.2" fill="none"/>')
    def arc(ccx, a1, a2):
        p1 = (ccx + ra * math.cos(math.radians(a1)), cy + 6 + ra * math.sin(math.radians(a1)))
        p2 = (ccx + ra * math.cos(math.radians(a2)), cy + 6 + ra * math.sin(math.radians(a2)))
        return f"M{p1[0]:.1f} {p1[1]:.1f} A{ra} {ra} 0 0 1 {p2[0]:.1f} {p2[1]:.1f}"
    seg = arc(cx - d, -80, -38)
    out.append(f'<path d="{seg}" stroke="{fond}" stroke-width="8" fill="none"/>')
    out.append(f'<path d="{seg}" stroke="{c}" stroke-width="4.2" fill="none"/>')
    out.append(f'<circle cx="{cx - d}" cy="{cy + 6}" r="{ra - 4.5}" stroke="{c}" stroke-width="0.6" fill="none" opacity="0.5"/>')
    out.append(f'<circle cx="{cx + d}" cy="{cy + 6}" r="{ra - 4.5}" stroke="{c}" stroke-width="0.6" fill="none" opacity="0.5"/>')
    return f'<svg class="wreath" viewBox="0 0 220 215" xmlns="http://www.w3.org/2000/svg">{"".join(out)}</svg>'


ORNEMENT = """<svg class="orn" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
<line x1="0" y1="6" x2="86" y2="6" stroke="{c}" stroke-width="0.9"/>
<path d="M100 1 L105 6 L100 11 L95 6 Z" fill="{c}"/>
<circle cx="90" cy="6" r="1.4" fill="{c}"/><circle cx="110" cy="6" r="1.4" fill="{c}"/>
<line x1="114" y1="6" x2="200" y2="6" stroke="{c}" stroke-width="0.9"/></svg>"""


def orn(c=OR):
    return ORNEMENT.replace("{c}", c)


# ------------------------------------------------------------------ CSS généré par partie
def css_parties():
    out = []
    for i, c in enumerate(COULEURS, 1):
        cd = fonce(c)
        out.append(f"""
.p{i} {{ --c: {c}; --cd: {cd}; --t1: {teinte(c, .07)}; --t2: {teinte(c, .16)}; --t3: {teinte(c, .35)}; }}
.p{i} .band, .o{i} {{ background: linear-gradient(135deg, {c} 0%, {cd} 100%); }}
.p{i} .qn {{ background: {c}; }}
.theme.p{i} {{ page: part{i}; }}
@page part{i} {{
  @bottom-left {{ content: string(run); font-family: Inter; font-size: 7.4pt; font-weight: 600; color: {c}; }}
  @bottom-right {{ content: counter(page); font-family: Inter; font-size: 8pt; font-weight: 700; color: {c}; }}
  @right-middle {{ content: "{ROMAINS[i - 1]}"; background: {c}; color: #fff; font-family: Inter; font-size: 6.5pt;
                   font-weight: 700; text-align: center; vertical-align: middle; width: 5mm; height: 22mm; margin-left: 11mm; }}
}}
.opener.o{i} {{ page: opener{i}; }}
@page opener{i} {{ margin: 0; background: {cd}; }}""")
    return "\n".join(out)


# ------------------------------------------------------------------ blocs communs
def band(kicker, titre, num="", meta="", icon=None, sub=""):
    ic = f'<span class="band-icon">{icone(icon, "#ffffff", "6.5mm", 1.6)}</span>' if icon else ""
    numh = f'<div class="band-num">{num}</div>' if num else ""
    return f"""<header class="band"><div class="band-top">{ic}<span class="band-kicker">{esc(kicker)}</span></div>
{numh}<h1 class="band-title">{esc(titre)}</h1>{f'<div class="band-sub">{esc(sub)}</div>' if sub else ''}{f'<div class="band-meta">{meta}</div>' if meta else ''}</header>"""


def chapitre(sid, kicker, titre, corps, cls="", icon="book"):
    return f"""
<section class="chap {cls}" id="{sid}">
  <div class="run">{esc(titre)}</div>
  {band(kicker, titre, icon=icon)}
  <div class="prose">{fr(corps)}</div>
</section>"""


def couverture():
    return f"""
<section class="cover">
  <div class="cover-frame"></div>
  <div class="cover-top">Édition enrichie</div>
  {couronne()}
  <div class="seal"><div class="seal-n">380</div><div class="seal-t">questions</div></div>
  <h1 class="cover-title">Avant de dire<br><em>oui</em></h1>
  <div class="cover-sub">{esc(P.SOUS_TITRE)}</div>
  <div class="cover-orn">{orn("#d9b779")}</div>
  <div class="cover-tag">{esc(P.ACCROCHE)}</div>
  <div class="cover-aud">Pour les fiancés · les pasteurs · les accompagnateurs</div>
  <div class="cover-author">[Nom de l\u2019auteur]</div>
</section>"""


def page_titre():
    return f"""
<section class="titlepage">
  <div class="tp-title">Avant de dire <em>oui</em></div>
  <div class="tp-sub">{esc(P.SOUS_TITRE)}</div>
  <div class="orn-wrap">{orn()}</div>
  <div class="tp-meta">{esc(P.MENTION_EDITION)}</div>
  <div class="mentions">{fr(P.MENTIONS)}</div>
</section>"""


def sommaire():
    def row(href, label, cls=""):
        return f'<li class="{cls}"><a href="#{href}">{label}</a></li>'

    out = ['<section class="toc" id="sommaire"><div class="run">Sommaire</div>', band("Sommaire", "Table des matières", icon="map"), "<ul>"]
    for sid, lab in [("parcours", "Votre parcours en un coup d'œil"), ("introduction", "Introduction"),
                     ("ne-mesure-pas", "Ce que ce guide ne mesure pas"), ("mode-emploi", "Mode d'emploi pour le couple"),
                     ("accompagnateurs", "Pour les pasteurs et accompagnateurs"), ("lire-bible", "Lire la Bible avec justesse"),
                     ("engagement", "Notre engagement de dialogue")]:
        out.append(row(sid, esc(lab), "t-front"))
    for ip, (ptitre, _, ids) in enumerate(PARTIES):
        c = COULEURS[ip]
        out.append(f'<li class="t-part" style="color:{c}"><a href="#partie-{ip+1}"><span class="pill" style="background:{c}">{ROMAINS[ip]}</span>{esc(ptitre)}</a></li>')
        for tid in ids:
            t = THEMES[NUM[tid] - 1]
            badge = ' <span class="tag sm">Nouveau</span>' if t.get("nouveau") else ""
            out.append(f'<li class="t-theme"><a href="#theme-{t["num"]}"><span class="tn" style="color:{c}">{t["num"]}</span>{esc(t["titre"])}{badge}</a></li>')
    out.append(f'<li class="t-part" style="color:{SAPIN}"><a href="#fin"><span class="pill" style="background:{OR}">+</span>Pour la suite du chemin</a></li>')
    for sid, lab in [("conclusion", "Conclusion"), ("accompagnement-pro", "Quand demander un accompagnement professionnel"),
                     ("fiches", "Fiches de suivi"), ("concordance", "Annexe : concordance et journal éditorial"), ("sources", "Sources")]:
        out.append(row(sid, esc(lab), "t-front"))
    out.append("</ul></section>")
    return "\n".join(out)


def parcours():
    etapes = []
    for ip, (ptitre, intro, ids) in enumerate(PARTIES):
        c = COULEURS[ip]
        nums = f"Thèmes {NUM[ids[0]]} à {NUM[ids[-1]]}"
        etapes.append(f"""<div class="step">
  <div class="step-dot" style="background:{c}">{icone(ICONES_PARTIES[ip], "#ffffff", "6mm", 1.7)}</div>
  <div class="step-body"><div class="step-k" style="color:{c}">Partie {ROMAINS[ip]} · {nums}</div>
  <div class="step-t">{esc(ptitre)}</div></div></div>""")
    return f"""
<section class="chap parcours" id="parcours">
  <div class="run">Votre parcours</div>
  {band("Votre parcours", "Neuf étapes vers un oui libre", icon="map")}
  <p class="lead">{esc("De la connaissance de soi jusqu'à la préparation concrète du mariage : chaque partie s'appuie sur la précédente.")}</p>
  <div class="steps-map">{''.join(etapes)}</div>
  <div class="chiffres">
    <div><b>9</b><span>parties</span></div><div><b>38</b><span>thèmes</span></div>
    <div><b>380</b><span>questions</span></div><div><b>6</b><span>fiches de suivi</span></div>
  </div>
</section>"""


def ouverture_partie(ip):
    ptitre, intro, ids = PARTIES[ip]
    c = COULEURS[ip]
    items = "".join(
        f'<li><span class="op-n">{NUM[i]}</span><span class="op-tt">{esc(T[i]["titre"])}</span>'
        f'{"<span class=\"tag light\">Nouveau</span>" if T[i].get("nouveau") else ""}</li>' for i in ids)
    dots = "".join(f'<span class="dot{" on" if k == ip else ""}"></span>' for k in range(9))
    return f"""
<section class="opener o{ip+1}" id="partie-{ip+1}">
  <div class="op-icon">{icone(ICONES_PARTIES[ip], "#ffffff", "13mm", 1.3)}</div>
  <div class="op-label">Partie {ROMAINS[ip]}</div>
  <h1 class="op-title">{esc(ptitre)}</h1>
  <div class="op-orn">{orn("#ffffff")}</div>
  <p class="op-intro">{esc(intro)}</p>
  <ul class="op-list">{items}</ul>
  <div class="op-dots">{dots}<span class="op-step">Étape {ip+1} sur 9</span></div>
</section>"""


def lignes_ecriture(questions, budget=150, car_ligne=50):
    """Nombre de lignes d'écriture par question pour que 5 questions tiennent sur une page A5.

    Hauteurs estimées en mm : 5,85 par ligne de texte, 7,4 par ligne d'écriture, 4,6 d'espacement."""
    res = []
    for page in (questions[:5], questions[5:]):
        nb = [math.ceil(len(q) / car_ligne) for q in page]
        k = [2] * len(page)
        hauteur = lambda: sum(n * 5.85 + x * 7.4 + 4.6 for n, x in zip(nb, k))  # noqa: E731
        for i in sorted(range(len(page)), key=lambda j: -nb[j]):
            if hauteur() <= budget:
                break
            k[i] = 1
        res += k
    return res


def bloc_theme(t):
    n, ip = t["num"], t["partie"]
    c = COULEURS[ip]
    meta = '<span class="tag light">Nouveau thème</span>' if t.get("nouveau") else (
        f'<span class="origin">Thème {t["orig_num"]} de l\u2019édition précédente</span>')
    conseils = "".join(f"<li>{esc(x)}</li>" for x in t["conseils"])
    refs = "".join(f'<div class="ref"><div class="ref-k">{esc(r)}</div><div class="ref-n">{esc(note)}</div></div>'
                   for r, note in t["refs"])
    alerte = (f'<div class="alerte"><div class="card-h">{icone("alert", "#a8402a", "4.4mm", 2)} Attention</div><p>{esc(t["alerte"])}</p></div>'
              if t.get("alerte") else "")
    voir = " · ".join(f'<a href="#theme-{NUM[v]}">{NUM[v]}. {esc(T[v]["titre"])}</a>' for v in t.get("voir", []))
    nl = lignes_ecriture(t["questions"])
    qs = "".join(
        f'<li><div class="q"><span class="qn">{i}</span><span class="qt">{esc(q)}</span></div>{lines(k)}</li>'
        for i, (q, k) in enumerate(zip(t["questions"], nl), 1))
    prompts = ["Ce que j'ai découvert, sur moi ou sur l'autre", "Ce qui me questionne ou m'inquiète", "Ce que je m'engage à faire"]
    personne = "".join(f'<div class="rp"><div class="rp-k">{esc(p)}</div>{lines(2)}</div>' for p in prompts)
    bilan = "".join(f'<div class="br"><div class="br-k">{esc(b)}</div>{lines(2)}</div>'
                    for b in ["Nos points d'accord", "Nos différences", "Nos décisions et actions", "Personne ou ressource à consulter"])
    return f"""
<section class="theme p{ip+1}" id="theme-{n}">
  <div class="run">{n} · {esc(t["titre"])}</div>
  {band(f"Partie {ROMAINS[ip]} · {PARTIES[ip][0]}", t["titre"], num=f"{n:02d}", meta=meta, icon=ICONES_PARTIES[ip])}
  <div class="cle"><span class="qm">“</span><p>{esc(t["cle"])}</p></div>
  <div class="card obj"><div class="card-h">{icone("target", c, "4.4mm", 2)} Objectif</div><p>{esc(t["objectif"])}</p></div>
  {alerte}
  <h3 class="sec">{icone("bulb", c, "4.6mm", 2)} Pour mener la discussion</h3>
  <ol class="conseils">{conseils}</ol>
  <h3 class="sec">{icone("book", c, "4.6mm", 2)} Repères bibliques</h3>
  <div class="refs">{refs}</div>
  <div class="card acc"><div class="card-h">{icone("compass", c, "4.4mm", 2)} Repère pour l\u2019accompagnateur</div><p>{esc(t["accomp"])}</p></div>
  <div class="voir">{icone("link", c, "3.6mm", 2)} <span>Voir aussi</span> {voir}</div>

  <div class="qpage">
    <div class="pghead"><span class="pg-num">{n:02d}</span><div><div class="pg-k">Les dix questions</div><div class="pg-t">{esc(t["titre"])}</div></div></div>
    <ol class="questions">{qs}</ol>
  </div>

  <div class="rpage">
    <div class="pghead"><span class="pg-ic">{icone("pen", "#ffffff", "5mm", 2)}</span><div><div class="pg-k">Thème {n}</div><div class="pg-t">Espace de réflexion personnelle</div></div></div>
    <p class="hint">Chacun écrit pour soi, avant ou après la rencontre. Vous pourrez ensuite partager ce que vous souhaitez.</p>
    <div class="person"><div class="who">Prénom <span class="blank"></span></div>{personne}</div>
    <div class="person"><div class="who">Prénom <span class="blank"></span></div>{personne}</div>
  </div>

  <div class="bpage">
    <div class="pghead"><span class="pg-ic">{icone("check", "#ffffff", "5mm", 2)}</span><div><div class="pg-k">Thème {n}</div><div class="pg-t">Bilan du thème</div></div></div>
    <div class="bilan">
      <div class="br-date">Date de la rencontre <span class="blank s"></span></div>
      {bilan}
      <div class="statut"><div class="br-k">Où en sommes-nous ?</div>
        <div><span class="box"></span>Sujet apaisé</div>
        <div><span class="box"></span>À reprendre le <span class="blank s"></span></div>
        <div><span class="box"></span>Nous souhaitons un accompagnement</div></div>
    </div>
  </div>
</section>"""


# ------------------------------------------------------------------ fiches
def fiche_entete(k, titre, icon):
    return (f'<div class="pghead"><span class="pg-ic">{icone(icon, "#ffffff", "5mm", 2)}</span>'
            f'<div><div class="pg-k">{esc(k)}</div><div class="pg-t">{esc(titre)}</div></div></div>')


def fiches():
    rows = "".join(
        f'<tr><td class="c"><span class="mini" style="background:{COULEURS[t["partie"]]}">{t["num"]}</span></td><td>{esc(t["titre"])}</td><td></td>'
        f'<td class="c"><span class="box"></span></td><td class="c"><span class="box"></span></td><td class="c"><span class="box"></span></td></tr>'
        for t in THEMES)
    tableau = f"""
<div class="fiche" id="fiches">{fiche_entete("Fiche 1", "Tableau de bord du parcours", "map")}
  <p class="hint">Cochez le statut de chaque thème à la fin de la rencontre. Revenez en priorité sur les thèmes « à reprendre ».</p>
  <table class="grid dash"><thead><tr><th>N°</th><th>Thème</th><th>Date</th><th>Apaisé</th><th>À reprendre</th><th>Accomp.</th></tr></thead>
  <tbody>{rows}</tbody></table>
</div>"""

    bloc = ('<div class="dis"><div class="k">Sujet du désaccord</div>' + lines(1)
            + '<div class="k">Ma position, et ce qui compte pour moi derrière elle</div>' + lines(2)
            + '<div class="k">Sa position, et ce qui compte pour lui ou pour elle</div>' + lines(2)
            + '<div class="k">Ce que nous pouvons essayer, ou comment porter ce désaccord</div>' + lines(2)
            + '<div class="k">Personne à consulter · Date pour en reparler</div>' + lines(1) + "</div>")
    desaccords = f"""
<div class="fiche">{fiche_entete("Fiche 2", "Nos désaccords à approfondir", "message")}
  <p class="hint">Un désaccord bien décrit est déjà à moitié apaisé. Cherchez le besoin derrière la position.</p>{bloc}</div>
<div class="fiche">{fiche_entete("Fiche 2 (suite)", "Nos désaccords à approfondir", "message")}{bloc}</div>"""

    reg_rows = "".join("<tr><td></td><td></td><td></td><td></td></tr>" for _ in range(10))
    registre = f"""
<div class="fiche">{fiche_entete("Fiche 3", "Registre de nos décisions", "check")}
  <p class="hint">Notez ici les décisions prises au fil du parcours. Une décision pourra toujours être revue.</p>
  <table class="grid reg"><thead><tr><th>Date</th><th>Décision</th><th>Thème</th><th>À revoir le</th></tr></thead><tbody>{reg_rows}</tbody></table>
</div>"""

    def questionnaire(k, titre, intro, qs, icon, n=3):
        items = "".join(f'<div class="fq"><div class="fq-q">{esc(q)}</div>{lines(n)}</div>' for q in qs)
        return f'<div class="fiche">{fiche_entete(k, titre, icon)}<p class="hint">{esc(intro)}</p>{items}</div>'

    mi = questionnaire("Fiche 4", "Bilan à mi-parcours", "À remplir ensemble après la partie IV.", [
        "Qu'avons-nous découvert l'un sur l'autre que nous ignorions ?",
        "Quels thèmes ont été les plus faciles ? Les plus difficiles ? Pourquoi ?",
        "Notre manière de dialoguer s'est-elle améliorée ? Sur quoi devons-nous encore progresser ?",
        "Y a-t-il un sujet que l'un de nous évite ? Comment l'aborder ?",
        "Avons-nous besoin d'un accompagnement pour la suite du parcours ?",
    ], "pulse", 2)

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
<div class="fiche">{fiche_entete("Fiche 5", "Pouvons-nous dire oui librement ?", "rings")}
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
    ], "heart", 2)
    return tableau + desaccords + registre + mi + final + an


def concordance():
    rows = []
    for o in ORIG:
        new = THEMES[NUM["O%d" % o["num"]] - 1]
        c = COULEURS[new["partie"]]
        rows.append(f'<tr><td class="c">{o["num"]}</td><td>{esc(o["titre"])}</td><td class="c"><span class="mini" style="background:{c}">{new["num"]}</span></td></tr>')
    nouveaux = "".join(f'<li><span class="mini" style="background:{COULEURS[t["partie"]]}">{t["num"]}</span> {esc(t["titre"])}</li>'
                       for t in THEMES if t.get("nouveau"))
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
  <div class="run">Concordance et journal éditorial</div>
  {band("Annexe", "Concordance et journal éditorial", icon="map")}
  <div class="prose">
  <p>Cette édition conserve <strong>les 300 questions</strong> de la version précédente. Chaque ancien thème garde ses dix questions, dans le même ordre :
  la question <em>a.b</em> de l\u2019ancienne édition devient la question <em>c.b</em>, où <em>c</em> est le nouveau numéro du thème.</p>
  <h3>Correspondance des thèmes</h3>
  <table class="grid conc"><thead><tr><th>Ancien</th><th>Thème</th><th>Nouveau</th></tr></thead><tbody>{''.join(rows)}</tbody></table>
  <h3>Thèmes ajoutés (80 questions nouvelles)</h3>
  <ul class="plain">{nouveaux}</ul>
  <h3>Questions reformulées pour éviter les répétitions</h3>
  <p>{len(REFORMULATIONS)} questions ont été légèrement recentrées pour qu\u2019elles ne fassent plus doublon avec une autre. L\u2019intention d\u2019origine est conservée.</p>
  {''.join(journal)}
  <h3>Recoupements conservés volontairement</h3>
  <ul>{conserves}</ul>
  </div>
</section>"""


# ------------------------------------------------------------------ assemblage
def document():
    sign = ('<div class="sign"><div><div class="k">Prénom et signature</div><div class="wl"></div><div class="k">Date</div><div class="wl"></div></div>'
            '<div><div class="k">Prénom et signature</div><div class="wl"></div><div class="k">Date</div><div class="wl"></div></div></div>')
    parts = [couverture(), page_titre(), sommaire(), parcours(),
             chapitre("introduction", "Ouverture", "Introduction", P.INTRODUCTION, icon="heart"),
             chapitre("ne-mesure-pas", "Avant de commencer", "Ce que ce guide ne mesure pas", P.NE_MESURE_PAS, icon="question"),
             chapitre("mode-emploi", "Avant de commencer", "Mode d'emploi pour le couple", P.MODE_EMPLOI, icon="map"),
             chapitre("accompagnateurs", "Avant de commencer", "Pour les pasteurs et accompagnateurs", P.ACCOMPAGNATEURS, icon="compass"),
             chapitre("lire-bible", "Avant de commencer", "Lire la Bible avec justesse", P.LIRE_BIBLE, icon="book"),
             chapitre("engagement", "Avant de commencer", "Notre engagement de dialogue", P.ENGAGEMENT + sign, cls="engage", icon="pen")]
    for ip in range(len(PARTIES)):
        parts.append(ouverture_partie(ip))
        for tid in PARTIES[ip][2]:
            parts.append(bloc_theme(THEMES[NUM[tid] - 1]))
    parts.append(f"""<section class="opener ofin" id="fin"><div class="op-icon">{icone("rings", "#ffffff", "13mm", 1.3)}</div>
<div class="op-label">Pour la suite</div><h1 class="op-title">Pour la suite du chemin</h1><div class="op-orn">{orn("#ffffff")}</div>
<p class="op-intro">Conclusion, ressources pour demander de l\u2019aide, fiches de suivi et annexes.</p></section>""")
    parts.append(chapitre("conclusion", "Pour la suite", "Conclusion", P.CONCLUSION, icon="heart"))
    parts.append(chapitre("accompagnement-pro", "Ressources", "Quand demander un accompagnement professionnel", P.ACCOMPAGNEMENT_PRO, icon="compass"))
    parts.append(f'<section class="chap fiches-wrap"><div class="run">Fiches de suivi</div>{band("Outils", "Fiches de suivi", icon="check")}'
                 f'<div class="prose"><p class="lead">Six fiches à imprimer ou à remplir à l\u2019écran pour garder la trace de votre parcours.</p></div>{fr(fiches())}</section>')
    parts.append(concordance())
    parts.append(chapitre("sources", "Annexe", "Sources", P.SOURCES, icon="book"))
    parts.append(f'<section class="back"><div class="back-in"><div class="back-title">Avant de dire <em>oui</em></div>'
                 f'<div class="orn-wrap">{orn("#d9b779")}</div>'
                 f'<p>{esc("Un guide pour aborder, avant le mariage, tout ce qui compte vraiment : la foi, la communication, la sexualité, l'argent, les familles, les enfants, et aussi les sujets que l'on évite : sécurité, infidélité, dépendances, deuil, crises.")}</p>'
                 f'<div class="chiffres light"><div><b>38</b><span>thèmes</span></div><div><b>380</b><span>questions</span></div><div><b>6</b><span>fiches</span></div></div>'
                 f'<p>{esc("Des repères bibliques lus dans leur contexte et des outils concrets, pour des fiancés qui veulent dire oui librement, et pour ceux qui les accompagnent.")}</p></div></section>')
    css = (ROOT / "src" / "style.css").read_text(encoding="utf-8") + css_parties()
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
