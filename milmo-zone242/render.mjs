// Renders index.html frame by frame and pipes the frames into ffmpeg.
// Usage: node render.mjs [--page file.html] [out.mp4] [fps]      |  node render.mjs [--page file.html] --stills t1,t2,... outDir
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
let args = process.argv.slice(2);
let pageFile = 'index.html';
if (args[0] === '--page') { pageFile = args[1]; args = args.slice(2); }
const url = pathToFileURL(path.resolve(here, pageFile)).href + '?render=1';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(url);
await page.evaluate(() => window.ready);
const shot = () => page.locator('#stage').screenshot({ type: 'png' });

if (args[0] === '--stills') {
  const times = args[1].split(',').map(Number);
  const outDir = args[2];
  fs.mkdirSync(outDir, { recursive: true });
  for (const t of times) {
    await page.evaluate(t => window.render(t), t);
    fs.writeFileSync(path.join(outDir, `t${t.toFixed(2)}.png`), await shot());
  }
} else {
  const out = args[0] ?? path.join(here, 'MILMO_ZONE242_vertical.mp4');
  const fps = Number(args[1] ?? 60);
  const DUR = 10;
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '16',
    '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(DUR * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await shot();
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
