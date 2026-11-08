// node render_all.cjs  -> SLIDE_01..08.png (1080x1350)
const { chromium } = require('playwright'); const path = require('node:path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let n = 1; n <= 8; n++) {
    await p.goto('file://' + path.resolve(__dirname, 'slides.html') + '?n=' + n); await p.evaluate(() => window.ready);
    await p.locator('#slide').screenshot({ path: `SLIDE_0${n}.png` });
  } await b.close(); })();
