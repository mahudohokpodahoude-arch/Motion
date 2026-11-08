// node render.cjs slide1.html out.png  -> 1080x1350
const { chromium } = require('playwright'); const path = require('node:path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + path.resolve(__dirname, process.argv[2])); await p.evaluate(() => window.ready);
  await p.locator('#slide').screenshot({ path: process.argv[3] }); await b.close(); })();
