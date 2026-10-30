const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = __dirname;
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.join(dir, 'livret.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const over = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg, i) => {
    const c = pg.querySelector('.center') || pg; const r = c.getBoundingClientRect(); const kids = [...c.children]; const last = kids.length ? kids[kids.length-1].getBoundingClientRect().bottom : 0;
    const t = pg.classList.contains('text'); const lastEl = t ? pg.querySelector('.pn') : null;
    const pgr = pg.getBoundingClientRect(); const bottomLimit = pgr.bottom - 14*3.7795;
    const content = t ? [...pg.querySelectorAll('.ttl,.p,.q')].pop().getBoundingClientRect().bottom : last;
    return [i+1, Math.round(content - pgr.top), Math.round(bottomLimit - pgr.top)];
  }));
  console.log('page, content bottom, limit (px):', JSON.stringify(over));
  await p.pdf({ path: path.join(dir, 'livret-A5.pdf'), width: '148mm', height: '210mm', printBackground: true });
  await p.screenshot({ path: path.join(dir, 'preview.png'), fullPage: true });
  await b.close();
})();
