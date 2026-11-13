// node render_stage.cjs out.png  -> 1080x1080 3D background (served over HTTP: ES modules / textures)
const { chromium } = require('playwright'); const http = require('node:http'), path = require('node:path'), fs = require('node:fs');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const p = path.join(__dirname, decodeURIComponent(new URL(q.url, 'http://x').pathname));
  if (!p.startsWith(__dirname) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': T[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); });
(async () => { await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  p.on('pageerror', e => console.error('page error:', e.message)); p.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await p.goto(`http://127.0.0.1:${srv.address().port}/stage3d.html`); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  await p.locator('canvas').screenshot({ path: process.argv[2] || 'stage.png' }); await b.close(); srv.close(); })();
