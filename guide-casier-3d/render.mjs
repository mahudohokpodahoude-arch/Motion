// Renders index.html frame by frame (WebGL) and pipes the frames into ffmpeg.
// Usage: node render.mjs out.mp4 [fps]   |   node render.mjs --stills t1,t2,... outDir
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH ?? 'playwright');
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
// serve the parent folder over http (ES modules and fonts are blocked on file://)
const root = path.resolve(here, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] ?? 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0);
const url = `http://127.0.0.1:${server.address().port}/guide-casier-3d/index.html?render=1`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.goto(url);
await page.evaluate(() => window.ready);
const shot = () => page.locator('#stage').screenshot({ type: 'png' });

if (args[0] === '--stills') {
  const outDir = args[2]; fs.mkdirSync(outDir, { recursive: true });
  for (const t of args[1].split(',').map(Number)) {
    await page.evaluate(t => window.render(t), t);
    fs.writeFileSync(path.join(outDir, `t${t.toFixed(1).padStart(4, '0')}.png`), await shot());
  }
} else {
  const out = args[0] ?? path.join(here, 'silent.mp4');
  const fps = Number(args[1] ?? 30);
  const DUR = await page.evaluate(() => window.DUR);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '17', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(DUR * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await shot();
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
server.close();
