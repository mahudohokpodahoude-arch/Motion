const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const base = `
@font-face{font-family:Montserrat;font-weight:700;src:url(fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:800;src:url(fonts/montserrat-latin-800-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1920px;height:1080px;overflow:hidden}
body{position:relative;font-family:Montserrat;color:#fff}
.bg{position:absolute;inset:0}
.rays{position:absolute;left:210px;top:-760px;width:1500px;height:1500px;opacity:.9;
 background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,226,140,0) 0deg 9deg,rgba(255,226,140,.10) 11deg,rgba(255,226,140,0) 13deg);
 -webkit-mask-image:radial-gradient(circle,#000 0,transparent 66%);mask-image:radial-gradient(circle,#000 0,transparent 66%)}
.glow{position:absolute;border-radius:50%;filter:blur(70px)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.38) 100%)}
.f1{position:absolute;inset:40px;border:4px solid #e6b73a;border-radius:6px}
.f2{position:absolute;inset:62px;border:2px solid rgba(230,183,58,.55);border-radius:3px}
.c{position:absolute;width:70px;height:70px}.c svg{width:100%;height:100%}
.tl{left:30px;top:30px}.tr{right:30px;top:30px;transform:scaleX(-1)}.bl{left:30px;bottom:30px;transform:scaleY(-1)}.br{right:30px;bottom:30px;transform:scale(-1,-1)}
.dot{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px}
.dot i{display:block;width:140px;height:3px;background:linear-gradient(90deg,transparent,#e6b73a)}.dot i:last-child{transform:scaleX(-1)}
.dot s{width:12px;height:12px;transform:rotate(45deg);background:#e6b73a}
.logo{position:absolute;left:50%;bottom:92px;width:150px;transform:translateX(-50%);filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}
.txt{position:absolute;left:210px;right:210px;top:150px;bottom:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.v{font-weight:700;font-size:74px;line-height:1.3;text-shadow:0 4px 0 rgba(0,0,0,.35)}
.r{margin-top:40px;font-weight:800;font-size:46px;letter-spacing:.14em;color:#ffd24a;text-shadow:0 3px 0 rgba(0,0,0,.4)}
`;
const corner = `<div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c br"></div>`;
const cornerJS = `<script>document.querySelectorAll('.c').forEach(e=>e.innerHTML='<svg viewBox="0 0 70 70" fill="none" stroke="#e6b73a" stroke-width="4" stroke-linecap="round"><path d="M6 64V22Q6 6 22 6H64"/><circle cx="6" cy="6" r="5" fill="#e6b73a" stroke="none"/><path d="M26 26l7 7 7-7-7-7z" fill="#e6b73a" stroke="none"/></svg>')</script>`;
const green = (c1, c2, c3) => `<div class="bg" style="background:radial-gradient(1300px 900px at 50% 40%,${c1} 0%,${c2} 48%,${c3} 100%)"></div><div class="rays"></div><div class="glow" style="left:80px;top:640px;width:460px;height:460px;background:#3fe39a;opacity:.14"></div><div class="glow" style="right:90px;top:120px;width:420px;height:420px;background:#3fe39a;opacity:.12"></div><div class="vig"></div>`;
const frame = `<div class="f1"></div><div class="f2"></div>${corner}`;
const sample = `<div class="txt"><div class="v">« Si donc le Fils vous affranchit,<br>vous serez réellement libres. »</div><div class="r">JEAN 8.36</div></div>`;
const pages = {
  'verset_fond_vert': green('#12905a','#0a5e3a','#043320') + frame + cornerJS,
  'verset_fond_sombre': green('#0c6d43','#06402a','#021c11') + frame + cornerJS,
  'verset_EXEMPLE_avec_texte': green('#12905a','#0a5e3a','#043320') + frame + sample + cornerJS,
};
(async () => {
  fs.mkdirSync('out/versets', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [k, body] of Object.entries(pages)) {
    fs.writeFileSync('_v.html', `<!doctype html><meta charset=utf-8><style>${base}</style>${body}`);
    await p.goto('file://' + path.resolve(__dirname, '_v.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `out/versets/${k}_1920x1080.png` });
  }
  fs.unlinkSync('_v.html'); await b.close();
})();
