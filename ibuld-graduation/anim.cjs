const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
(async () => {
  const FPS = 30, DUR = 6, N = FPS * DUR;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(__dirname, 'anim.html')); await p.evaluate(() => document.fonts.ready);
  const ff = spawn('ffmpeg', ['-y','-f','image2pipe','-framerate',String(FPS),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','16','-preset','medium','-movflags','+faststart','out/IBULD_intro_logo_1920x1080.mp4'], { stdio: ['pipe','ignore','inherit'] });
  for (let i = 0; i < N; i++) {
    await p.evaluate(t => window.setT(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i === 24 || i === 54 || i === 84 || i === 120) fs.writeFileSync(`/tmp/claude-0/-home-user-Motion/2ff3526d-c6ad-558d-a833-962ad8784ad0/scratchpad/f${i}.jpg`, buf);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('ok');
})();
