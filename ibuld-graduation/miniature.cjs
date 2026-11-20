const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Montserrat;font-weight:700;src:url(fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:800;src:url(fonts/montserrat-latin-800-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:900;src:url(fonts/montserrat-latin-900-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1280px;height:720px;overflow:hidden}
body{position:relative;font-family:Montserrat;color:#fff;background:radial-gradient(900px 620px at 72% 45%,#14a468 0%,#0a6a41 42%,#043320 100%)}
svg{position:absolute;inset:0}
.glow{position:absolute;right:-20px;top:340px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(255,214,90,.55),rgba(255,214,90,0) 68%)}
.live{position:absolute;left:50px;top:44px;display:flex;align-items:center;gap:14px;background:#e11d2a;border-radius:10px;padding:10px 26px 10px 20px;font-weight:900;font-size:36px;letter-spacing:.06em;box-shadow:0 8px 0 rgba(0,0,0,.3)}
.live i{width:22px;height:22px;border-radius:50%;background:#fff}
.t{position:absolute;left:50px;top:136px;width:1200px}
.k{font-weight:800;font-size:44px;letter-spacing:.14em;color:#ffd24a;text-shadow:0 4px 0 rgba(0,0,0,.35)}
.g{margin-top:4px;font-weight:900;font-size:158px;line-height:1;letter-spacing:-.01em;text-shadow:0 8px 0 rgba(0,0,0,.4),0 14px 30px rgba(0,0,0,.4)}
.d{margin-top:10px;font-weight:800;font-size:54px;line-height:1.1;text-shadow:0 4px 0 rgba(0,0,0,.35)}
.pill{position:absolute;left:50px;bottom:46px;display:inline-flex;border-radius:10px;overflow:hidden;font-weight:900;font-size:40px;box-shadow:0 8px 0 rgba(0,0,0,.3)}
.pill span{padding:12px 26px}.pill .a{background:#ffc82e;color:#06301c}.pill .b{background:#04301c}
.logo{position:absolute;right:56px;top:430px;width:330px;border-radius:24px;box-shadow:0 0 0 7px #ffc82e,0 22px 40px rgba(0,0,0,.55)}
.loc{position:absolute;left:50px;bottom:150px;width:auto;text-align:center;font-weight:800;font-size:27px;letter-spacing:.04em;text-shadow:0 3px 0 rgba(0,0,0,.4)}
</style>
<svg viewBox="0 0 1280 720"><polygon points="1280,0 1280,150 1130,0" fill="#ffc82e"/><polygon points="1280,0 1280,80 1200,0" fill="#053d25"/></svg>
<div class="glow"></div>
<div class="live"><i></i>EN DIRECT</div>
<div class="t"><div class="k">CÉRÉMONIE DE</div><div class="g">GRADUATION</div><div class="d">Remise des diplômes</div></div>
<div class="pill"><span class="a">SAMEDI 21 NOV. 2026</span><span class="b">09H00</span></div>
<img class="logo" src="assets/logo-ibuld-crop.png">
`;
(async () => {
  fs.writeFileSync('_m.html', html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + path.resolve(__dirname, '_m.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: 'out/miniature_youtube_1280x720.png' });
  fs.unlinkSync('_m.html'); await b.close();
})();
