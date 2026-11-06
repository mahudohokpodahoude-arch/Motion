// node render3d.cjs --stills t1,t2,... outDir   |   node render3d.cjs out.mp4 [fps]
// The page is served over local HTTP (ES modules / textures do not load from file://).
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const http = require('node:http'), path = require('node:path'), fs = require('node:fs');
const root = __dirname;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const args = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('page error:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto(`http://127.0.0.1:${server.address().port}/phone3d.html${process.env.Q ? '?' + process.env.Q : ''}`);
  await page.waitForFunction(() => window.render && window.ready, null, { timeout: 60000 });
  const shot = () => page.locator('#stage').screenshot({ type: 'png' });
  if (args[0] === '--stills') {
    fs.mkdirSync(args[2], { recursive: true });
    for (const t of args[1].split(',').map(Number)) { const T0=Date.now(); await page.evaluate(t => window.render(t), t); fs.writeFileSync(path.join(args[2], `p${t.toFixed(2)}.png`), await shot()); console.log('t',t,'ms',Date.now()-T0); }
  } else {
    const out = args[0] || 'phone3d.mp4', fps = Number(args[1] || 30);
    const DUR = await page.evaluate(() => window.DUR);
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '16', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(DUR * fps);
    for (let i = 0; i < n; i++) { await page.evaluate(t => window.render(t), i / fps); const b = await shot(); if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('wrote', out);
  }
  await browser.close(); server.close();
})();
