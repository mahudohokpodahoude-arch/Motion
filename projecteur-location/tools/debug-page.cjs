// Ouvre la composition dans Chromium headless et affiche les erreurs console (outil de débogage).
const http = require('http'), fs = require('fs'), path = require('path');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.json': 'application/json' };
const srv = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0, async () => {
  const port = srv.address().port;
  const b = await puppeteer.launch({ executablePath: process.env.HYPERFRAMES_BROWSER_PATH, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.evaluateOnNewDocument(() => { window.__timelines = {}; window.addEventListener('unhandledrejection', (e) => console.error('UNHANDLED', e.reason && (e.reason.stack || e.reason))); });
  p.on('console', (m) => console.log('console.' + m.type(), m.text()));
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('requestfailed', (r) => console.log('REQFAIL', r.url()));
  await p.setViewport({ width: 1080, height: 1920 });
  await p.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 1500));
  console.log('fonts', await p.evaluate(async () => { const out = []; for (const f of ['500 80px Oswald', '600 80px Oswald', '700 80px Oswald', '500 40px Montserrat', '600 40px Montserrat', '700 40px Montserrat', '800 40px Montserrat', '900 40px Montserrat']) { const r = await Promise.race([document.fonts.load(f, 'ÉÀÇ0123456789AZaz?').then(x => 'ok ' + x.length), new Promise(r => setTimeout(() => r('timeout'), 2000))]); out.push(f + ':' + r); } return out.join(' | '); }));
  console.log('probe', await p.evaluate(async () => { const log = []; const o = console.log; window.__dbg = (m) => log.push(m); try { const r = await Promise.race([window.__buildFilm().then(f => 'built ' + f.tl.duration()), new Promise(r => setTimeout(() => r('timeout'), 6000))]); return r + ' :: ' + log.join(' > '); } catch (e) { return 'ERR ' + e.stack + ' :: ' + log.join(' > '); } }));
  const info = await p.evaluate(() => ({ tl: !!(window.__timelines && window.__timelines.main), dur: window.__timelines && window.__timelines.main && window.__timelines.main.duration() }));
  console.log('timeline', JSON.stringify(info));
  await b.close(); srv.close();
});
