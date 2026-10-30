const { chromium } = require('playwright'); const path = require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080},deviceScaleFactor:2});
await p.goto('file://'+path.join(__dirname,'affiche.html'));await p.waitForSelector('body[data-ready="1"]');await p.waitForTimeout(500);
await p.locator('.p').screenshot({path:path.join(__dirname,'affiche-culte-zone242-carre.png')});await b.close();})();
