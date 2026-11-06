// node render.cjs out.png  -> 1080x1350 (Instagram 4:5)
const { chromium } = require('playwright'); const path = require('node:path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 735, height: 919 }, deviceScaleFactor: 1080 / 735 });
  await p.goto('file://' + path.resolve(__dirname, 'index.html'));
  await p.evaluate(() => window.ready);
  await p.locator('#poster').screenshot({ path: process.argv[2] || 'affiche.png' });
  await b.close();
})();
