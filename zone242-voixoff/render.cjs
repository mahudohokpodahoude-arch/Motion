// node render.cjs stills t1,t2,... outDir   |   node render.cjs video out.mp4 [workers]   |   node render.cjs mux
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('node:child_process');
const path = require('node:path'), fs = require('node:fs');
const url = 'file://' + path.resolve(__dirname, 'index.html');
const FPS = 30, DUR = 125.65, N = Math.round(DUR * FPS);
async function open(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(url); await page.evaluate(() => window.ready); return page;
}
const shot = page => page.locator('#c').screenshot({ type: 'png' });
(async () => {
  const [mode, a1, a2] = process.argv.slice(2);
  const browser = await chromium.launch();
  if (mode === 'stills') {
    const dir = a2 || 'out/stills'; fs.mkdirSync(dir, { recursive: true });
    const page = await open(browser);
    for (const t of a1.split(',').map(Number)) { await page.evaluate(t => window.render(t), t); fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`), await shot(page)); }
  } else if (mode === 'video') {
    const out = a1 || 'out/silent.mp4', W = Number(a2 || 4), parts = [];
    const per = Math.ceil(N / W);
    await Promise.all([...Array(W)].map(async (_, w) => {
      const from = w * per, to = Math.min(N, from + per); if (from >= to) return;
      const f = path.resolve(path.dirname(out), `part${w}.mp4`); parts.push([w, f]);
      const page = await open(browser);
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'fast', '-crf', '17', f], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let i = from; i < to; i++) {
        await page.evaluate(t => window.render(t), i / FPS);
        const buf = await shot(page); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        if (i % 150 === 0) console.log('worker', w, i, '/', to);
      }
      ff.stdin.end(); await new Promise(r => ff.on('close', r));
    }));
    parts.sort((x, y) => x[0] - y[0]);
    fs.writeFileSync(path.resolve(path.dirname(out), 'parts.txt'), parts.map(p => `file '${p[1]}'`).join('\n'));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.resolve(path.dirname(out), 'parts.txt'), '-c', 'copy', out]);
    console.log('wrote', out);
  }
  await browser.close();
})();
