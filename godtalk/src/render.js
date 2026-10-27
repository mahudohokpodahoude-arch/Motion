/* Assemblage du document : pages des pôles, visuels, en-têtes, pagination,
   typographie française et contrôle des débordements. */
(function () {
  const V = window.GT_VISUALS, POLES = window.GT_POLES;
  const LOGO = { dark: "../assets/logo/godtalk-logo-blanc.svg", light: "../assets/logo/godtalk-logo-noir.svg" };
  const MATRIX = {          // Concevoir, Produire, Installer, Diffuser (2 = cœur, 1 = contribution)
    photo: [0, 2, 0, 1], video: [1, 2, 0, 1], live: [0, 2, 1, 2], integration: [2, 0, 2, 1],
    evenements: [1, 2, 1, 2], cinema: [2, 2, 0, 1], postprod: [0, 2, 0, 1], ia: [2, 2, 0, 0]
  };
  const li = a => a.map(x => `<li>${x}</li>`).join("");

  // ---- pages des pôles
  const anchor = document.getElementById("poles-anchor");
  POLES.forEach((p, i) => {
    const n = String(i + 1).padStart(2, "0");
    const vis = p.visual.img
      ? `<img src="../assets/images/${p.visual.img}" alt="" style="object-position:${p.visual.pos || "50% 50%"}">`
      : V[p.visual.svg]();
    const steps = [1, 2, 3, 4].map(s => `<i class="${p.horizon.includes(s) ? "on" : ""}"></i>`).join("");
    const sec = document.createElement("section");
    sec.className = `page pole ${p.layout} ${p.theme}`;
    sec.id = "pole-" + p.id;
    sec.dataset.chapter = "05 — Pôle " + n;
    sec.dataset.hdTheme = p.layout === "A" ? "dark" : p.theme;
    sec.innerHTML = `
      <div class="vis">${vis}</div>${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
      <div class="txt">
        <div class="head">
          <div class="num">${n}<small>Pôle ${n} / 08</small></div>
          <div><h2>${p.titre}</h2><p class="accroche">${p.accroche}</p></div>
        </div>
        <div class="cols">
          <div class="c1"><div class="label">Ce que nous ferons</div><ul class="dash">${li(p.faire)}</ul></div>
          <div><div class="label">Pour qui</div><ul class="dash">${li(p.qui)}</ul></div>
          <div class="need"><div class="label">Ce qu'il faut pour y arriver</div><ul class="dash">${li(p.besoin)}</ul></div>
        </div>
        ${p.note ? `<div class="note">${p.note}</div>` : ""}
        <div class="horizon"><b>Horizon</b><span class="steps">${steps}</span><span>${p.horizonTxt}</span></div>
      </div>`;
    anchor.before(sec);
  });
  anchor.remove();

  // ---- matrice des pôles
  const tb = document.querySelector("#pole-matrix tbody");
  POLES.forEach((p, i) => {
    const n = String(i + 1).padStart(2, "0");
    const cells = MATRIX[p.id].map(v => `<td>${v === 2 ? '<span class="dot"></span>' : v === 1 ? '<span class="dot o"></span>' : ""}</td>`).join("");
    tb.insertAdjacentHTML("beforeend",
      `<tr><td><a href="#pole-${p.id}"><span class="k">${n}</span><span class="t">${p.court}<small>${p.resume}</small></span></a></td>${cells}</tr>`);
  });

  // ---- visuels génériques
  document.querySelectorAll("[data-visual]").forEach(el => {
    const name = el.dataset.visual;
    el.innerHTML = name === "beams" ? V.beams(840, 1188, +(el.dataset.seed || 3)) : V[name]();
  });

  // ---- en-têtes, pieds de page, pagination
  const pages = [...document.querySelectorAll(".page")];
  const total = pages.length;
  pages.forEach((pg, idx) => {
    pg.dataset.no = idx + 1;
    if (pg.hasAttribute("data-noheader")) return;
    const theme = pg.dataset.hdTheme || (pg.classList.contains("light") ? "light" : "dark");
    pg.insertAdjacentHTML("beforeend",
      `<div class="hd"><img src="${LOGO[theme]}" alt="GODTALK"><span class="hr">${pg.dataset.chapter || ""}</span></div>
       <div class="ft"><span class="t">GODTALK — Vision, ambition et projet de développement</span><span class="n"><b>${String(idx + 1).padStart(2, "0")}</b> / ${total}</span></div>`);
  });
  document.querySelectorAll("[data-ref]").forEach(el => {
    const t = document.getElementById(el.dataset.ref);
    el.textContent = String(t.dataset.no).padStart(2, "0");
  });

  // ---- typographie française : espaces insécables fines
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const NNBSP = " ";
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest("script,svg,style")) continue;
    let t = node.nodeValue;
    t = t.replace(/ ([:;!?»])/g, NNBSP + "$1").replace(/« /g, "«" + NNBSP).replace(/'/g, "’");
    node.nodeValue = t;
  }

  // ---- contrôle qualité : débordements
  window.__qa = [];
  const check = () => {
    pages.forEach(pg => {
      const pr = pg.getBoundingClientRect();
      pg.querySelectorAll(".inner > *, .txt > *, .txt .cols > div, .letter > *, .horizon, .ft, .hd, .cover .bottom").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom > pr.bottom - 9 * 3.78 && !el.matches(".ft") || r.right > pr.right + .5)
          window.__qa.push(`page ${pg.dataset.no} (${pg.id}) : ${el.className || el.tagName} dépasse (bas ${Math.round((r.bottom - pr.top) / 3.78)} mm)`);
      });
      // chevauchement texte / bloc ancré en bas
      const bottomBlock = pg.querySelector(".objectif, .band, .etude, .principe, .disclaimer, .impact, .horizon, .p-raison .inner > p.mute");
      if (bottomBlock) {
        const bb = bottomBlock.getBoundingClientRect();
        const container = bottomBlock.parentElement;
        [...container.children].filter(c => c !== bottomBlock && getComputedStyle(c).position !== "absolute").forEach(c => {
          const r = c.getBoundingClientRect();
          if (r.bottom > bb.top - 2) window.__qa.push(`page ${pg.dataset.no} (${pg.id}) : ${c.className || c.tagName} chevauche le bloc bas (${Math.round(r.bottom - bb.top)} px)`);
        });
      }
    });
    window.__ready = true;
  };
  document.fonts.ready.then(() => Promise.all([...document.images].map(im => im.complete ? 1 : new Promise(r => { im.onload = im.onerror = r; })))).then(check);
})();
