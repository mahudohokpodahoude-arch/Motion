const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const f = 'file://' + path.resolve(__dirname, 'attente.html');
  for (const [q, out] of [['?t=00:00:15:00','attente_exemple_compteur'],['?nocount','attente_fond_sans_compteur']]) {
    await p.goto(f + q); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: `out/${out}_1920x1080.png` });
  }
  await b.close();
})();
