const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const css = `
@font-face{font-family:Montserrat;font-weight:600;src:url(fonts/montserrat-latin-600-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:700;src:url(fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:800;src:url(fonts/montserrat-latin-800-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1920px;height:1080px;overflow:hidden}
:root{--gold:#ffc82e;--soft:#ffe08a}
body{font-family:Montserrat;color:#fff;position:relative;background:radial-gradient(1100px 800px at 50% 38%,#4a2fd0 0%,#2b1c9c 45%,#160e5c 100%)}
.shape{position:absolute;inset:0}.glow{position:absolute;border-radius:50%;filter:blur(60px);background:#7a5cff;opacity:.32}
.col{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.emb{width:230px;border-radius:18px;box-shadow:0 0 0 4px #ffc82e,0 14px 30px rgba(0,0,0,.5)}
.k{margin-top:34px;font-weight:700;font-size:38px;letter-spacing:.3em;padding-left:.3em;color:var(--soft)}
h1{margin-top:8px;font-weight:800;font-size:150px;line-height:1.05;text-shadow:0 6px 0 rgba(0,0,0,.25)}
.s{margin-top:18px;font-weight:600;font-size:48px}
.pill{margin-top:44px;display:inline-flex;font-weight:800;font-size:36px;letter-spacing:.06em;border-radius:6px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.4)}
.pill span{padding:13px 30px}.pill .a{background:var(--gold);color:#1a1240}.pill .b{background:#0f0a42}
.loc{position:absolute;left:0;right:0;bottom:34px;text-align:center;font-weight:600;font-size:28px;color:var(--soft);letter-spacing:.06em}.loc b{color:#fff;font-weight:800}
.grid{margin-top:50px;display:grid;grid-template-columns:repeat(3,520px);gap:26px 30px;justify-content:center}
.card{background:linear-gradient(180deg,#120b4a,#0b0733);border-top:8px solid var(--gold);border-radius:10px;padding:34px 20px;font-weight:800;font-size:44px;line-height:1.2;box-shadow:0 14px 30px rgba(0,0,0,.45)}
.card{display:flex;align-items:center;justify-content:center;min-height:150px}
.grid2{display:flex;gap:30px;margin-top:26px;justify-content:center}
.k+.big{margin-top:22px}
.big{font-weight:800;font-size:112px;line-height:1.05;text-shadow:0 6px 0 rgba(0,0,0,.25)}
`;
const shapes = `<svg class="shape" viewBox="0 0 1920 1080"><polygon points="0,0 560,0 0,380" fill="#ffc82e" opacity=".95"/><polygon points="0,0 400,0 0,270" fill="#1c1470"/><polygon points="1920,1080 1360,1080 1920,700" fill="#ffc82e" opacity=".95"/><polygon points="1920,1080 1520,1080 1920,810" fill="#1c1470"/></svg><div class="glow" style="left:120px;top:560px;width:420px;height:420px"></div><div class="glow" style="right:140px;top:120px;width:380px;height:380px"></div>`;
const loc = `<div class="loc"><b>MILMO AKPAKPA SACRÉ-CŒUR</b> &nbsp;•&nbsp; Cotonou</div>`;
const pages = {
 '01_remerciements': `<div class="col"><img class="emb" src="assets/emblem-ibuld.png"><div class="k">REMERCIEMENTS OFFICIELS</div><h1 style="font-size:130px">MERCI</h1><div class="s">Nos sincères remerciements à</div>
  <div class="grid"><div class="card">Les autorités</div><div class="card">Les enseignants</div><div class="card">Les familles</div></div>
  <div class="grid2"><div class="card" style="width:520px">Les diplômés</div><div class="card" style="width:520px">Les équipes d’organisation</div></div></div>${loc}`,
 '02_fin_ceremonie': `<div class="col"><img class="emb" src="assets/emblem-ibuld.png"><div class="k">CÉRÉMONIE DE GRADUATION</div><div class="big">FÉLICITATIONS</div><div class="big" style="color:var(--gold)">AUX DIPLÔMÉS</div><div class="s">Merci d’avoir suivi cette cérémonie</div><div class="pill"><span class="a">SAMEDI 21 NOVEMBRE 2026</span><span class="b">FIN DE LA CÉRÉMONIE</span></div></div>${loc}`,
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [k, body] of Object.entries(pages)) {
    fs.writeFileSync('_f.html', `<!doctype html><meta charset=utf-8><style>${css}</style>${shapes}${body}`);
    await p.goto('file://' + path.resolve(__dirname, '_f.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `out/${k}_1920x1080.png` });
  }
  fs.unlinkSync('_f.html'); await b.close();
})();
