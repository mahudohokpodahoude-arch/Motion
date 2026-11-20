const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Montserrat;font-weight:700;src:url(fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:800;src:url(fonts/montserrat-latin-800-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:900;src:url(fonts/montserrat-latin-900-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1280px;height:720px;overflow:hidden}
body{position:relative;font-family:Montserrat;color:#fff;background:radial-gradient(900px 620px at 72% 45%,#14a468 0%,#0a6a41 42%,#043320 100%)}
svg.bg{position:absolute;inset:0}
.glow{position:absolute;right:20px;top:360px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(255,235,150,.28),rgba(255,214,90,0) 68%)}
.live{position:absolute;left:50px;top:44px;display:flex;align-items:center;gap:14px;background:#e11d2a;border-radius:10px;padding:10px 26px 10px 20px;font-weight:900;font-size:36px;letter-spacing:.06em;box-shadow:0 8px 0 rgba(0,0,0,.3)}
.live i{width:22px;height:22px;border-radius:50%;background:#fff}
.t{position:absolute;left:50px;top:136px;width:1200px}
.k{font-weight:800;font-size:44px;letter-spacing:.14em;color:#ffd24a;text-shadow:0 4px 0 rgba(0,0,0,.35)}
.g{margin-top:4px;font-weight:900;font-size:158px;line-height:1;letter-spacing:-.01em;text-shadow:0 8px 0 rgba(0,0,0,.4),0 14px 30px rgba(0,0,0,.4)}
.d{margin-top:10px;font-weight:800;font-size:54px;line-height:1.1;text-shadow:0 4px 0 rgba(0,0,0,.35)}
.pill{position:absolute;left:50px;bottom:46px;display:inline-flex;border-radius:10px;overflow:hidden;font-weight:900;font-size:40px;box-shadow:0 8px 0 rgba(0,0,0,.3)}
.pill span{padding:12px 26px}.pill .a{background:#ffc82e;color:#06301c}.pill .b{background:#04301c}
.logo{position:absolute;left:56px;top:455px;width:300px;border-radius:24px;box-shadow:0 0 0 7px #ffc82e,0 22px 40px rgba(0,0,0,.55)}
.loc{position:absolute;left:50px;bottom:150px;width:auto;text-align:center;font-weight:800;font-size:27px;letter-spacing:.04em;text-shadow:0 3px 0 rgba(0,0,0,.4)}
</style>
<svg class="bg" viewBox="0 0 1280 720"><polygon points="1280,0 1280,150 1130,0" fill="#ffc82e"/><polygon points="1280,0 1280,80 1200,0" fill="#053d25"/></svg>
<div class="glow"></div>
<div class="live"><i></i>EN DIRECT</div>
<div class="t"><div class="k">CÉRÉMONIE DE</div><div class="g">GRADUATION</div><div class="d">Remise des diplômes</div></div>
<svg class="cap" viewBox="0 0 420 300" style="position:absolute;left:auto;right:300px;top:400px;width:400px;height:auto;filter:drop-shadow(0 18px 24px rgba(0,0,0,.5))">
 <path d="M105 140 L105 205 Q210 255 315 205 L315 140 Z" fill="#15191c" stroke="#ffc82e" stroke-width="4" stroke-linejoin="round"/>
 <polygon points="210,30 405,110 210,190 15,110" fill="#20262a" stroke="#ffc82e" stroke-width="5" stroke-linejoin="round"/>
 <polygon points="210,30 405,110 210,190 15,110" fill="url(#hl)"/>
 <defs><linearGradient id="hl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
 <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#d49a14"/></linearGradient></defs>
 <path d="M210 110 Q320 120 350 150" fill="none" stroke="url(#gd)" stroke-width="7" stroke-linecap="round"/>
 <circle cx="210" cy="110" r="11" fill="url(#gd)" stroke="#8a6205" stroke-width="2"/>
 <rect x="341" y="148" width="18" height="30" rx="4" fill="url(#gd)"/>
 <path d="M338 176 h24 l5 62 h-34 z" fill="url(#gd)"/>
 <path d="M341 190 h18 M340 205 h20 M339 220 h22" stroke="#8a6205" stroke-width="2"/>
</svg>
<svg class="scr" viewBox="0 0 320 170" style="position:absolute;right:52px;top:500px;width:300px;height:auto;transform:rotate(-12deg);filter:drop-shadow(0 16px 20px rgba(0,0,0,.5))">
 <rect x="40" y="38" width="240" height="94" fill="#fff6dc"/>
 <rect x="40" y="38" width="240" height="14" fill="#f2e2b0"/>
 <ellipse cx="40" cy="85" rx="24" ry="47" fill="#f2e2b0" stroke="#d2b86a" stroke-width="3"/><ellipse cx="40" cy="85" rx="11" ry="30" fill="#d9bf74"/>
 <ellipse cx="280" cy="85" rx="24" ry="47" fill="#fff6dc" stroke="#d2b86a" stroke-width="3"/><ellipse cx="280" cy="85" rx="11" ry="30" fill="#ead69a"/>
 <rect x="68" y="62" width="150" height="7" rx="3" fill="#c9a94f" opacity=".7"/><rect x="68" y="78" width="120" height="7" rx="3" fill="#c9a94f" opacity=".5"/><rect x="68" y="94" width="140" height="7" rx="3" fill="#c9a94f" opacity=".5"/>
 <rect x="226" y="36" width="26" height="98" fill="#d6202f"/><rect x="226" y="36" width="8" height="98" fill="#fff" opacity=".18"/>
 <path d="M239 85 C200 40 190 80 239 88 C190 96 200 130 239 90" fill="#e5303f" stroke="#a5121f" stroke-width="2"/>
 <path d="M239 85 C278 40 288 80 239 88 C288 96 278 130 239 90" fill="#e5303f" stroke="#a5121f" stroke-width="2"/>
 <circle cx="239" cy="88" r="9" fill="#b3131f"/>
</svg>
<img class="logo" src="assets/logo-ibuld-crop.png">
`;
(async () => {
  fs.writeFileSync('_m.html', html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + path.resolve(__dirname, '_m.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: 'out/miniature_youtube_1280x720.png' });
  fs.unlinkSync('_m.html'); await b.close();
})();
