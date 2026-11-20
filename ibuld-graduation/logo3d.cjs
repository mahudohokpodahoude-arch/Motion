const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { spawn } = require('child_process'), http = require('http');
const mime = {'.html':'text/html','.js':'text/javascript','.png':'image/png','.woff2':'font/woff2'};
const srv = http.createServer((q, s) => { const f = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, {'content-type': mime[path.extname(f)] || 'application/octet-stream'}); s.end(b); } }); }).listen(8765);
(async () => {
  const FPS = 30, DUR = 6, N = FPS * DUR;
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  for (const alpha of (process.env.ONLY_ALPHA ? [true] : [false, true])) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
    p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('http://localhost:8765/logo3d.html' + (alpha ? '?alpha' : '')); await p.waitForFunction('window.ready===true', null, { timeout: 30000 });
    const out = alpha ? 'out/IBULD_logo3D_transparent_1920x1080.webm' : 'out/IBULD_logo3D_1920x1080.mp4';
    const args = alpha ? ['-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-crf','24','-b:v','0','-auto-alt-ref','0',out]
                       : ['-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','16','-movflags','+faststart',out];
    const ff = spawn('ffmpeg', args, { stdio: ['pipe','ignore','ignore'] });
    for (let i = 0; i < N; i++) {
      await p.evaluate(t => window.setT(t), i / FPS);
      const buf = await p.screenshot({ type: 'png', omitBackground: alpha });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (!alpha && [15, 45, 75, 120].includes(i)) fs.writeFileSync(`/tmp/claude-0/-home-user-Motion/2ff3526d-c6ad-558d-a833-962ad8784ad0/scratchpad/l${i}.png`, buf);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); await p.close(); console.log('done', out);
  }
  await b.close(); srv.close();
})();
