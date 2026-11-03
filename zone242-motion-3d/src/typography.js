// Typographie cinétique : un seul timeline GSAP en pause, piloté par HyperFrames.
// Les textes viennent des variables de composition (modifiables dans Studio ou via --variables).

// Remplit l'élément avec le texte de sa variable et le découpe en mots / lettres animables.
export function fillText(el, vars) {
  const key = el.dataset.text;
  const txt = (key && vars[key] != null ? String(vars[key]) : el.textContent).trim();
  el.textContent = "";
  el.setAttribute("aria-label", txt);
  const chars = [];
  const words = txt.split(" ");
  words.forEach((w, wi) => {
    const ws = document.createElement("span");
    ws.className = "w";
    for (const ch of w) {
      const c = document.createElement("span");
      c.className = "ch" + (/[.:]/.test(ch) && el.classList.contains("dotted") ? " dot" : "");
      c.textContent = ch;
      c.setAttribute("aria-hidden", "true");
      ws.appendChild(c);
      chars.push(c);
    }
    el.appendChild(ws);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return chars;
}

export function buildTypography(gsap, vars, cues) {
  const tl = gsap.timeline({ paused: true });
  const q = (s) => document.querySelector(s);
  const all = (s) => Array.from(document.querySelectorAll(s));
  const chars = new Map();
  for (const el of all("[data-text]")) chars.set(el, fillText(el, vars));
  const C = (sel) => chars.get(q(sel)) || [];
  const at = (id, d = 0) => {
    const e = cues.events.find((x) => x.id === id);
    return (e ? e.t : 0) + d;
  };

  // --- motifs d'entrée / sortie (toujours fromTo : sûrs au seek dans les deux sens)
  const rise = (sel, t, o = {}) =>
    tl.fromTo(C(sel), { yPercent: 118, opacity: 1 }, {
      yPercent: 0, duration: o.dur ?? 0.75, ease: o.ease ?? "power4.out", stagger: o.stagger ?? 0.022,
      immediateRender: o.first ?? true,
    }, t);
  const focusIn = (sel, t, o = {}) =>
    tl.fromTo(sel, { opacity: 0, filter: "blur(14px)", y: o.y ?? 14 }, {
      opacity: 1, filter: "blur(0px)", y: 0, duration: o.dur ?? 0.9, ease: o.ease ?? "power3.out", immediateRender: false,
    }, t);
  const focusOut = (sel, t, o = {}) =>
    tl.fromTo(sel, { opacity: 1, filter: "blur(0px)", y: 0 }, {
      opacity: 0, filter: `blur(${o.blur ?? 12}px)`, y: o.y ?? -16, duration: o.dur ?? 0.6, ease: o.ease ?? "power2.in",
      stagger: o.stagger ?? 0, immediateRender: false,
    }, t);
  const show = (sel, t) => tl.set(sel, { opacity: 1 }, t);

  // ===== SCÈNE 01 — triplet sur les temps 2,0 / 3,0 / 4,0
  ["#s1-l1", "#s1-l2", "#s1-l3"].forEach((s, i) => rise(s, at(`s1.title${i + 1}`, -0.08)));
  focusOut(["#s1-l1", "#s1-l2", "#s1-l3"], 4.5, { stagger: 0.07, dur: 0.5 });

  return tl;
}
