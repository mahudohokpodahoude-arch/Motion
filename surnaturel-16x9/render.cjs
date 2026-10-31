// Usage: node render.cjs --stills t1,t2,... outDir   |   node render.cjs out.mp4 [fps]
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const path = require('node:path'), fs = require('node:fs');
const args = process.argv.slice(2);
const url = 'file://' + path.resolve(__dirname, 'index.html') + '?render=1';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(url);
  await page.evaluate(() => window.ready);
  const shot = () => page.locator('#stage').screenshot({ type: 'png' });
  if (args[0] === '--stills') {
    const dir = args[2]; fs.mkdirSync(dir, { recursive: true });
    for (const t of args[1].split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      fs.writeFileSync(path.join(dir, `t${t.toFixed(2)}.png`), await shot());
    }
  } else {
    const out = args[0] || 'silent.mp4', fps = Number(args[1] || 30), DUR = 27;
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '17', '-movflags', '+faststart', out],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(DUR * fps);
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      const buf = await shot();
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('wrote', out);
  }
  await browser.close();
})();
