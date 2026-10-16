// Exporte l'affiche HTML en image haute définition (2160×2700 par défaut) avec Chromium headless.
//   node tools/render-affiche.cjs [scale=2] [sortie=affiche/Affiche_Location_Projecteur_4x5.png]
const http = require('http'), fs = require('fs'), path = require('path');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const scale = +(process.argv[2] || 2);
const out = path.resolve(root, process.argv[3] || 'affiche/Affiche_Location_Projecteur_4x5.png');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const exe = process.env.HYPERFRAMES_BROWSER_PATH || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const srv = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1', async () => {
  const b = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
  try {
    const p = await b.newPage();
    p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
    await p.setViewport({ width: 1080, height: 1350, deviceScaleFactor: scale });
    await p.goto(`http://127.0.0.1:${srv.address().port}/affiche/affiche.html`, { waitUntil: 'networkidle0' });
    await p.evaluate(() => window.__ready);
    const el = await p.$('#poster');
    await el.screenshot({ path: out });
    console.log('écrit', path.relative(root, out));
  } finally { await b.close(); srv.close(); }
});
