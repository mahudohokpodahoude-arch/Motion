// Rend index.html image par image vers ffmpeg.
//   node render.mjs --stills 2,8,15 outDir      -> captures PNG
//   node render.mjs silent.mp4 [fps]             -> vidéo sans son
// Les photos déposées dans ./photos (jpg, png, webp) sont intégrées automatiquement, par ordre alphabétique.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/home/user/node-tools/node_modules/playwright'); }
const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const photosDir = path.join(here, 'photos');
const photos = fs.existsSync(photosDir) ? fs.readdirSync(photosDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort().map((f) => pathToFileURL(path.join(photosDir, f)).href) : [];
console.log(photos.length ? `${photos.length} photo(s) trouvée(s)` : 'aucune photo : scène « Merci pour votre… » en texte');
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.addInitScript((p) => { window.PHOTOS = p; }, photos);
await page.goto(pathToFileURL(path.join(here, 'index.html')).href + '?render=1');
await page.evaluate(() => window.ready);
const shot = (type = 'png') => page.locator('#stage').screenshot(type === 'jpeg' ? { type, quality: 96 } : { type });
if (args[0] === '--stills') {
  const out = args[2]; fs.mkdirSync(out, { recursive: true });
  for (const t of args[1].split(',').map(Number)) { await page.evaluate((x) => window.render(x), t); fs.writeFileSync(path.join(out, `t${t.toFixed(1).padStart(4, '0')}.png`), await shot()); }
} else {
  const out = args[0] ?? 'out/silent.mp4', fps = Number(args[1] ?? 30), DUR = await page.evaluate(() => window.DUR);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '15', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(DUR * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate((x) => window.render(x), i / fps);
    if (!ff.stdin.write(await shot('jpeg'))) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`${i}/${n}`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); console.log('écrit', out);
}
await browser.close();
