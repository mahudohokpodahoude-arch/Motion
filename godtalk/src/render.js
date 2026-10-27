/* Assemblage du document : pages des pôles, mosaïque, matrice, pictogrammes,
   illustrations, en-têtes, pagination, typographie française et contrôle des débordements. */
(function () {
  const V = window.GT_VISUALS, POLES = window.GT_POLES;
  const LOGO = { white: "../assets/logo/godtalk-logo-blanc.svg", black: "../assets/logo/godtalk-logo-noir.svg" };
  const MATRIX = {          // Concevoir, Produire, Installer, Diffuser (2 = cœur, 1 = contribution)
    photo: [0, 2, 0, 1], video: [1, 2, 0, 1], live: [0, 2, 1, 2], integration: [2, 0, 2, 1],
    evenements: [1, 2, 1, 2], cinema: [2, 2, 0, 1], postprod: [0, 2, 0, 1], ia: [2, 2, 0, 0]
  };
  const STEPS = ["Fondation", "Premières prestations", "Structuration", "Envergure"];
  const pad = n => String(n).padStart(2, "0");
  const visualOf = p => p.visual.img
    ? `<img src="../assets/images/${p.visual.img}" alt="" style="object-position:${p.visual.pos || "50% 50%"}">`
    : V[p.visual.svg]();

  // ---- pages des pôles : A (visuel + titre) et B (détail)
  const anchor = document.getElementById("poles-anchor");
  POLES.forEach((p, i) => {
    const n = pad(i + 1);
    const a = document.createElement("section");
    a.className = "page pole-a";
    a.id = "pole-" + p.id;
    a.dataset.chapter = `05 — Pôle ${n}`;
    a.dataset.hd = p.visual.img ? "photo" : "light";
    a.innerHTML = `
      <div class="photo ${p.visual.img ? "shade" : ""}">${visualOf(p)}<span class="tag ${p.visual.img ? "" : "light"}">${p.tag}</span></div>
      <div class="inner">
        <div class="top">
          <div class="num">${n}<small>Pôle ${n} / 08</small></div>
          <div><h1>${p.titre}</h1><p class="acc">${p.accroche}</p></div>
        </div>
        <div class="who"><h4>Pour qui</h4>${p.qui.map(q => `<span class="chip">${q}</span>`).join("")}</div>
      </div>`;
    anchor.before(a);

    const b = document.createElement("section");
    b.className = `page pole-b ${p.bg}`;
    b.id = `pole-${p.id}-b`;
    b.dataset.chapter = `05 — Pôle ${n} · ${p.court}`;
    const gauge = STEPS.map((s, k) => `<div class="${p.horizon.includes(k + 1) ? "on" : ""}"><i>Étape ${k + 1}</i>${s}</div>`).join("");
    b.innerHTML = `
      <div class="inner">
        <div class="kicker">Pôle ${n} — ${p.court}</div>
        <h2>Ce que nous <em>ferons</em></h2>
        <div class="faire ${p.faire.length > 4 ? "many" : ""}">${p.faire.map((x, k) => `<div class="card"><b>${pad(k + 1)}</b><span>${x}</span></div>`).join("")}</div>
        <div class="need ${p.bg === "cream" ? "mist" : ""}"><h4>Ce qu'il faut pour y arriver</h4><ul class="check">${p.besoin.map(x => `<li>${x}</li>`).join("")}</ul></div>
        ${p.note ? `<div class="note-ia"><div class="badge" data-icon="shieldok"></div><p>${p.note}</p></div>` : ""}
        <div class="horizon push"><h4>Horizon envisagé</h4><div class="gauge">${gauge}</div><p>${p.horizonTxt}</p></div>
      </div>`;
    anchor.before(b);
  });
  anchor.remove();

  // ---- mosaïque d'ouverture, sommaire des pôles, matrice
  const mosaic = document.getElementById("mosaic");
  const tocPoles = document.getElementById("toc-poles");
  const tb = document.querySelector("#pole-matrix tbody");
  POLES.forEach((p, i) => {
    const n = pad(i + 1);
    mosaic.insertAdjacentHTML("beforeend",
      `<a href="#pole-${p.id}"><div class="tile">${visualOf(p)}<b>${n}</b></div><div class="name">${p.court}</div></a>`);
    tocPoles.insertAdjacentHTML("beforeend",
      `<a href="#pole-${p.id}"><span class="t">${n} · ${p.court}</span><span class="p" data-ref="pole-${p.id}"></span></a>`);
    const cells = MATRIX[p.id].map(v => `<td>${v === 2 ? '<span class="dot"></span>' : v === 1 ? '<span class="dot o"></span>' : ""}</td>`).join("");
    tb.insertAdjacentHTML("beforeend",
      `<tr><td><a href="#pole-${p.id}"><span class="k">${n}</span><span class="t">${p.court}</span></a></td>${cells}</tr>`);
  });

  // ---- pictogrammes et illustrations
  document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = V.icon(el.dataset.icon); });
  document.querySelectorAll("[data-visual]").forEach(el => {
    const d = el.dataset;
    el.innerHTML = d.visual === "rays" ? V.rays(840, 1188, +(d.seed || 3), d.color, +(d.op || .25)) : V[d.visual]();
  });

  // ---- en-têtes, pieds de page, pagination
  const pages = [...document.querySelectorAll(".page")];
  const total = pages.length;
  pages.forEach((pg, idx) => {
    pg.dataset.no = idx + 1;
    if (pg.hasAttribute("data-noheader")) return;
    const onDark = pg.classList.contains("navy") || pg.dataset.hd === "photo";
    pg.insertAdjacentHTML("beforeend",
      `<div class="hd ${pg.dataset.hd === "photo" ? "on-photo" : ""}"><img src="${onDark ? LOGO.white : LOGO.black}" alt="GODTALK"><span>${pg.dataset.chapter || ""}</span></div>
       <div class="ft"><span>GODTALK — Vision, ambition et projet de développement</span><span class="n">${pad(idx + 1)} / ${total}</span></div>`);
  });
  document.querySelectorAll("[data-ref]").forEach(el => {
    el.textContent = pad(document.getElementById(el.dataset.ref).dataset.no);
  });

  // ---- typographie française : espaces insécables fines, apostrophes typographiques
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const NNBSP = " ";
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest("script,style")) continue;
    node.nodeValue = node.nodeValue
      .replace(/ ([:;!?»])/g, NNBSP + "$1").replace(/« /g, "«" + NNBSP).replace(/'/g, "’");
  }

  // ---- contrôle qualité : débordements
  window.__qa = [];
  const check = () => {
    pages.forEach(pg => {
      const inner = pg.querySelector(".inner");
      if (inner && inner.scrollHeight > inner.clientHeight + 1)
        window.__qa.push(`page ${pg.dataset.no} (${pg.id}) : contenu trop haut de ${((inner.scrollHeight - inner.clientHeight) / 3.78).toFixed(1)} mm`);
      const pr = pg.getBoundingClientRect();
      pg.querySelectorAll(".inner *:not(svg *)").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > pr.right - 15 * 3.78 + 2)
          window.__qa.push(`page ${pg.dataset.no} (${pg.id}) : ${el.className || el.tagName} dépasse à droite`);
      });
    });
    window.__ready = true;
  };
  document.fonts.ready
    .then(() => Promise.all([...document.images].map(im => im.complete ? 1 : new Promise(r => { im.onload = im.onerror = r; }))))
    .then(check);
})();
