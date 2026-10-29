const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch();
  for (const lang of process.argv.slice(2).length ? process.argv.slice(2) : ['en','fr']) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 2 });
    await page.goto('file://' + path.join(root, 'src', `affiche-${lang}-square.html`));
    await page.waitForSelector('body[data-ready="1"]');
    await page.waitForTimeout(500);
    await page.locator('.poster').screenshot({ path: path.join(root, `affiche-ruth-bonney-oussa-${lang}-carre.png`) });
    const m = await page.evaluate(() => {
      const r = s => { const b = document.querySelector(s).getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.left), Math.round(b.right)]; };
      return { left: r('.left'), prog: r('.prog'), family: r('.family .card'), footer: r('footer'), h1: r('h1'),
               famCols: [...document.querySelectorAll('.family .col')].map(c => Math.round(c.getBoundingClientRect().height)),
               surn: document.querySelector('.surnames').scrollWidth + '/' + document.querySelector('.surnames').clientWidth };
    });
    console.log(lang, JSON.stringify(m));
    await page.close();
  }
  await browser.close();
})();
