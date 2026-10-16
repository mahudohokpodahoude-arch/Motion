// Renders the 3D page frame by frame (WebGL) and pipes the frames into ffmpeg.
// Usage: node render.mjs [--size 1920x1080] [--range from,to] [--query k=v] [out.mp4] [fps]   |   node render.mjs [--size WxH] --stills t1,t2,... outDir
// The page is served over a local HTTP server: ES modules and fetch() do not work from file://.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');   // so ../fonts resolves
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));

let args = process.argv.slice(2);
let [VW, VH] = [1080, 1920];
let FROM = 0, TO = 10, EXTRA = '';
for (;;) {
  if (args[0] === '--size') { [VW, VH] = args[1].split('x').map(Number); args = args.slice(2); }
  else if (args[0] === '--range') { [FROM, TO] = args[1].split(',').map(Number); args = args.slice(2); }
  else if (args[0] === '--query') { EXTRA = '&' + args[1]; args = args.slice(2); }
  else break;
}
const url = `http://127.0.0.1:${server.address().port}/v3-3d/index.html?render=1&w=${VW}&h=${VH}${EXTRA}`;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('page error:', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
await page.goto(url);
await page.evaluate(() => window.ready);
const shot = () => page.locator('#stage').screenshot({ type: 'png' });

if (args[0] === '--stills') {
  const outDir = args[2];
  fs.mkdirSync(outDir, { recursive: true });
  console.log(await page.evaluate(() => JSON.stringify(window.debugParts)));
  for (const t of args[1].split(',').map(Number)) {
    await page.evaluate(t => window.render(t), t);
    fs.writeFileSync(path.join(outDir, `t${t.toFixed(2)}.png`), await shot());
  }
} else {
  const out = args[0] ?? path.join(here, 'silent.mp4');
  const fps = Number(args[1] ?? 60);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '16', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((TO - FROM) * fps);
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), FROM + i / fps);
    const buf = await shot();
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`frame ${i}/${n} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
server.close();
