// node render.cjs out.png -> 1080x1080 (square, Facebook / Instagram)
const { chromium } = require('playwright'); const path = require('node:path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => window.ready);
  await p.locator('#f').screenshot({ path: process.argv[2] || 'flyer.png' }); await b.close(); })();
