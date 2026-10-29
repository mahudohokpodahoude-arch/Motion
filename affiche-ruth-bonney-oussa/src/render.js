const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch();
  for (const lang of process.argv.slice(2).length ? process.argv.slice(2) : ['en','fr']) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 2200 }, deviceScaleFactor: 2 });
    await page.goto('file://' + path.join(root, 'src', `affiche-${lang}.html`));
    await page.waitForSelector('body[data-ready="1"]');
    await page.waitForTimeout(500);
    await page.locator('.poster').screenshot({ path: path.join(root, `affiche-ruth-bonney-oussa-${lang}.png`) });
    // overflow diagnostics
    const issues = await page.evaluate(() => {
      const out = [];
      const poster = document.querySelector('.poster').getBoundingClientRect();
      const fam = document.querySelector('.family .card').getBoundingClientRect();
      const foot = document.querySelector('footer').getBoundingClientRect();
      const left = document.querySelector('.left').getBoundingClientRect();
      const prog = document.querySelector('.prog').getBoundingClientRect();
      const verse = document.querySelector('.verse').getBoundingClientRect();
      const progCard = document.querySelector('.prog .card').getBoundingClientRect();
      const tl = document.querySelector('.timeline').getBoundingClientRect();
      out.push({left:[left.top,left.bottom], prog:[prog.top,prog.bottom], progCardBottom:progCard.bottom, timelineBottom:tl.bottom, verse:[verse.top,verse.bottom], famCard:[fam.top,fam.bottom], footerTop:foot.top});
      const h1 = document.querySelector('h1').getBoundingClientRect(); out.push({h1w:h1.width, leftw:left.width});
      return out;
    });
    console.log(lang, JSON.stringify(issues));
    await page.close();
  }
  await browser.close();
})();
