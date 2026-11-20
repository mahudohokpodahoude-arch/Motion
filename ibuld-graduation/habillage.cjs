const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
// fenêtres transparentes : [nom, x, y, w, h]  (toutes en 16:9)
const L = {
  A_verset_grand_orateur_petit: { win: [['VERSET',60,175,1200,675],['ORATEUR',1300,175,560,315]], panel: [1300,520,560,330] },
  B_50_50: { win: [['VERSET',40,285,910,512],['ORATEUR',970,285,910,512]], panel: null },
};
const rr=(x,y,w,h,r)=>`M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
const B=7;
function html(cfg){
  const holes=cfg.win.map(([,x,y,w,h])=>`<path d="${rr(x,y,w,h,16)}" fill="black"/>`).join('');
  const rings=cfg.win.map(([,x,y,w,h])=>`<path fill-rule="evenodd" d="${rr(x-B,y-B,w+2*B,h+2*B,16+B)} ${rr(x,y,w,h,16)}" fill="#ffc82e"/>`).join('');
  const p=cfg.panel;
  const panel=p?`<div class="panel" style="left:${p[0]}px;top:${p[1]}px;width:${p[2]}px;height:${p[3]}px"><div class="k">CÉRÉMONIE DE</div><div class="g">GRADUATION</div><div class="d">Remise des diplômes</div></div>`:'';
  const labels=cfg.win.map(([n,x,y,w,h])=>'').join('');
  return `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Montserrat;font-weight:700;src:url(fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:800;src:url(fonts/montserrat-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1920px;height:1080px;background:transparent;overflow:hidden}
svg{position:absolute;inset:0}
.hd{position:absolute;left:60px;top:38px;font-family:Montserrat;font-weight:800;font-size:46px;letter-spacing:.14em;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.35)}
.hd2{position:absolute;right:60px;top:46px;font-family:Montserrat;font-weight:800;font-size:34px;letter-spacing:.3em;color:#ffc82e}
.ft{position:absolute;left:0;right:0;bottom:0;height:74px;background:#043320;border-top:6px solid #ffc82e;display:flex;align-items:center;justify-content:center;font-family:Montserrat;font-weight:700;font-size:28px;letter-spacing:.5em;color:#ffe08a}
.panel{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:Montserrat;color:#fff;border:${B}px solid #ffc82e;border-radius:${16+B}px;background:linear-gradient(180deg,#06452b,#032a1a);box-shadow:0 10px 24px rgba(0,0,0,.4)}
.k{font-weight:800;font-size:30px;letter-spacing:.22em;color:#ffe08a}.g{font-weight:800;font-size:68px;margin-top:6px;text-shadow:0 4px 0 rgba(0,0,0,.35)}.d{font-weight:700;font-size:32px;margin-top:14px}
</style>
<svg viewBox="0 0 1920 1080"><defs><radialGradient id="g" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#12905a"/><stop offset=".5" stop-color="#0a5e3a"/><stop offset="1" stop-color="#043320"/></radialGradient>
<mask id="m"><rect width="1920" height="1080" fill="white"/>${holes}</mask></defs>
<rect width="1920" height="1080" fill="url(#g)" mask="url(#m)"/>${rings}</svg>
<div class="hd">CÉRÉMONIE DE GRADUATION</div><div class="hd2">IBULD</div>${panel}<div class="ft">EXCELLENCE • LEADERSHIP • IMPACT</div>`;
}
(async () => {
  fs.mkdirSync('out/habillage', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [k, cfg] of Object.entries(L)) {
    fs.writeFileSync('_h.html', html(cfg));
    await p.goto('file://' + path.resolve(__dirname, '_h.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `out/habillage/habillage_${k}_1920x1080.png`, omitBackground: true });
  }
  fs.unlinkSync('_h.html'); await b.close();
  fs.writeFileSync('out/habillage/_coords.json', JSON.stringify(L));
})();
