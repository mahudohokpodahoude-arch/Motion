// Génère le PDF à partir de src/index.html avec Chromium (Playwright).
// Usage : node tools/build.js
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "dist", "GODTALK_Vision_Ambition_Developpement.pdf");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("console", m => console.log("[page]", m.text()));
  page.on("pageerror", e => { console.error("[erreur]", e.message); process.exitCode = 1; });
  page.on("requestfailed", r => { console.error("[ressource manquante]", r.url()); process.exitCode = 1; });
  await page.emulateMedia({ media: "print" });
  await page.goto("file://" + path.join(root, "src", "index.html"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
  const qa = await page.evaluate(() => window.__qa);
  const n = await page.evaluate(() => document.querySelectorAll(".page").length);
  console.log(`Pages HTML : ${n}`);
  if (qa.length) { console.log("Contrôle de mise en page :"); qa.forEach(l => console.log("  - " + l)); }
  else console.log("Contrôle de mise en page : aucun débordement détecté.");
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true, outline: true });
  console.log("PDF : " + out);
  await browser.close();
})();
