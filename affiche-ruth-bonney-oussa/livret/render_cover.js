const { chromium } = require('playwright'); const path = require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:905,height:1280},deviceScaleFactor:2});
await p.goto('file://'+path.join(__dirname,'cover-fr.html'));await p.waitForSelector('body[data-ready="1"]');await p.waitForTimeout(400);
await p.locator('.c').screenshot({path:path.join(__dirname,'assets','cover-fr.png')});await b.close();})();
