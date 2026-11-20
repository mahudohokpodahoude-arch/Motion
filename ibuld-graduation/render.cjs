const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [,, page = 'invitation', out = page] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(__dirname, page + '.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.resolve(__dirname, 'out', out + '.png'), clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  await b.close();
})();
