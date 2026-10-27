// Génère les PDF à partir des pages HTML avec Chromium (Playwright).
// Usage : node tools/build.js            (les deux documents)
//         node tools/build.js court      (un seul document, par son nom ci-dessous)
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const DOCS = {
  complet: { src: "index.html", out: "GODTALK_Vision_Ambition_Developpement.pdf" },
  court: { src: "court.html", out: "GODTALK_Synthese.pdf" }
};

(async () => {
  const wanted = process.argv[2] ? [process.argv[2]] : Object.keys(DOCS);
  const browser = await chromium.launch();
  for (const key of wanted) {
    const doc = DOCS[key];
    if (!doc) { console.error(`Document inconnu : ${key}`); process.exitCode = 1; continue; }
    const page = await browser.newPage();
    page.on("console", m => console.log("[page]", m.text()));
    page.on("pageerror", e => { console.error("[erreur]", e.message); process.exitCode = 1; });
    page.on("requestfailed", r => { console.error("[ressource manquante]", r.url()); process.exitCode = 1; });
    await page.emulateMedia({ media: "print" });
    await page.goto("file://" + path.join(root, "src", doc.src), { waitUntil: "load" });
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
    const qa = await page.evaluate(() => window.__qa);
    const n = await page.evaluate(() => document.querySelectorAll(".page").length);
    console.log(`[${key}] Pages HTML : ${n}`);
    if (qa.length) { console.log(`[${key}] Contrôle de mise en page :`); qa.forEach(l => console.log("  - " + l)); }
    else console.log(`[${key}] Contrôle de mise en page : aucun débordement détecté.`);
    const out = path.join(root, "dist", doc.out);
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true, outline: true });
    console.log(`[${key}] PDF : ${out}`);
    await page.close();
  }
  await browser.close();
})();
