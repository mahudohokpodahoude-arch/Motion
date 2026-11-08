const { chromium } = require('playwright'); const path = require('node:path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => window.ready);
  await p.locator('#stage').screenshot({ path: process.argv[2] || 'bienvenue.png' }); await b.close(); })();
