const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
// [slug, horaire, titre, sous-titre, étiquette, noms[]]
const E = [
 ['entree_diplomes','09H00 – 09H05','Entrée solennelle des diplômés','','PROTOCOLE',['Apôtre Amos']],
 ['priere_ouverture','09H05 – 09H10','Prière d’ouverture','','INTERVENANT',['Apôtre Achille']],
 ['louange_adoration','09H10 – 09H20','Louange et adoration','','INTERVENANTS',['Équipe musicale / Chorale']],
 ['mot_bienvenue','09H20 – 09H25','Mot de bienvenue','','INTERVENANTE',['Dr Mary Favour TONGSI']],
 ['mot_recteur','09H25 – 09H35','Mot du Recteur','Parcours de formation et vœux','INTERVENANT',['Pasteur Benoît GANKPIN']],
 ['allocution_institutionnelle','09H35 – 09H45','Allocution institutionnelle','Vision et perspectives de iBuild','INTERVENANT',['Dr Augustin K. TONGSI']],
 ['temoignages','09H45 – 09H55','Témoignages des diplômés','','INTERVENANTS',['Caleb et Jacqueline']],
 ['hommage_enseignants','09H55 – 10H05','Hommage aux enseignants et distinctions honorifiques','','INTERVENANT',['Dr Augustin K. TONGSI']],
 ['offrandes','10H05 – 10H10','Offrandes','','INTERVENANT',['Apôtre Achille']],
 ['intermede_musical','10H10 – 10H15','Intermède musical','','INTERVENANTS',['Équipe musicale / Chorale']],
 ['discours_magistral','10H15 – 10H30','Discours magistral','','INTERVENANT',['GNANHOUI SAMUEL KODJO']],
 ['presentation_promotion','10H30 – 10H40','Présentation officielle de la promotion','','VICE-RECTEUR',['Pasteur Pierre YEHOUENOU']],
 ['remise_diplomes','10H40 – 11H05','Remise officielle des diplômes','','INTERVENANTS',['Dr Augustin K. TONGSI','Dr Taye Moïse Vitegni']],
 ['engagement_solennel','11H05 – 11H10','Engagement solennel des diplômés','','INTERVENANTS',['Le Recteur et le Vice-Recteur']],
 ['priere_benediction','11H10 – 11H15','Prière de bénédiction et d’envoi','','INTERVENANT',['Dr Taye Moïse Vitegni']],
 ['remerciements','11H15 – 11H20','Remerciements officiels','','INTERVENANT',['Apôtre Georges EHAHOUN']],
 ['photo_officielle','11H20 – 11H25','Photo officielle','','PROTOCOLE',['Apôtre Amos']],
 ['cloture','11H25 – 11H30','Clôture et fin de la cérémonie','','INTERVENANTS',['Maître de cérémonie / Protocole']],
];
const N = E.length;
const css = `
@font-face{font-family:Montserrat;font-weight:600;src:url(fonts/montserrat-latin-600-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:700;src:url(fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:Montserrat;font-weight:800;src:url(fonts/montserrat-latin-800-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1920px;height:1080px;overflow:hidden}
:root{--gold:#ffc82e;--soft:#ffe08a}
body{font-family:Montserrat;color:#fff;position:relative;background:radial-gradient(1200px 850px at 50% 42%,#12905a 0%,#0a5e3a 45%,#043320 100%)}
.shape{position:absolute;inset:0}.glow{position:absolute;border-radius:50%;filter:blur(60px);background:#3fe39a;opacity:.22}
.top{position:absolute;left:70px;right:70px;top:48px;display:flex;align-items:center;justify-content:space-between}
.logo{height:104px;border-radius:14px;box-shadow:0 0 0 3px #ffc82e,0 10px 24px rgba(0,0,0,.45)}
.ev{text-align:right;font-weight:700;font-size:26px;letter-spacing:.2em;color:#fff;line-height:1.6;text-shadow:0 2px 0 rgba(0,0,0,.35)}
.col{position:absolute;left:140px;right:140px;top:190px;bottom:170px;display:flex;flex-direction:column;justify-content:center}
.time{align-self:flex-start;display:inline-flex;align-items:center;gap:16px;background:var(--gold);color:#1a1240;font-weight:800;font-size:44px;letter-spacing:.08em;padding:12px 34px;border-radius:6px;box-shadow:0 10px 24px rgba(0,0,0,.4)}
.title{margin-top:0;font-weight:800;font-size:132px;line-height:1.08;color:#fff;text-shadow:0 5px 0 rgba(0,0,0,.35),0 10px 30px rgba(0,0,0,.45)}
.sub{margin-top:20px;font-weight:700;font-size:56px;color:#fff;text-shadow:0 3px 0 rgba(0,0,0,.35)}
.who{margin-top:46px;display:flex;align-items:stretch;gap:0;align-self:flex-start;box-shadow:0 14px 30px rgba(0,0,0,.45);border-radius:8px;overflow:hidden}
.lab{background:#0f0a42;display:flex;align-items:center;font-weight:800;font-size:26px;letter-spacing:.22em;color:var(--gold);padding:0 30px;writing-mode:horizontal-tb;white-space:nowrap}
.nm{background:linear-gradient(100deg,#fff,#f1ecff);color:#17104f;font-weight:800;font-size:68px;line-height:1.15;padding:20px 54px 22px 40px;border-left:10px solid var(--gold)}
.pg{position:absolute;left:140px;right:140px;bottom:62px}
.seg{display:flex;gap:8px}.seg i{flex:1;height:14px;border-radius:7px;background:rgba(255,255,255,.25)}
.seg i.d{background:#fff;opacity:.7}.seg i.c{background:var(--gold);height:14px;box-shadow:0 0 14px rgba(255,200,46,.8)}
.cnt{margin-top:16px;display:flex;justify-content:space-between;font-weight:700;font-size:26px;letter-spacing:.2em;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.35)}
`;
const shapes = `<svg class="shape" viewBox="0 0 1920 1080"><polygon points="0,1080 0,930 150,1080" fill="#ffc82e"/></svg><div class="glow" style="left:80px;top:600px;width:420px;height:420px"></div><div class="glow" style="right:140px;top:100px;width:380px;height:380px"></div>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  fs.mkdirSync('out/etapes', { recursive: true });
  for (const [i, [slug, time, title, sub, lab, names]] of E.entries()) {
    const seg = E.map((_, j) => `<i class="${j < i ? 'd' : j === i ? 'c' : ''}"></i>`).join('');
    const html = `<!doctype html><meta charset=utf-8><style>${css}</style>${shapes}
<div class="top"><img class="logo" src="assets/logo-ibuld-crop.png"><div class="ev">CÉRÉMONIE DE GRADUATION</div></div>
<div class="col"><div class="title">${title}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
<div class="pg"><div class="seg">${seg}</div><div class="cnt"><span>ÉTAPE ${i + 1} / ${N}</span><span>IBULD</span></div></div>`;
    fs.writeFileSync('_e.html', html);
    await p.goto('file://' + path.resolve(__dirname, '_e.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120);
    const bad = await p.evaluate(() => { const c = document.querySelector('.col'); return c.scrollHeight > c.clientHeight + 2; });
    if (bad) console.log('OVERFLOW', slug);
    await p.screenshot({ path: `out/etapes/${String(i + 1).padStart(2, '0')}_${slug}.png` });
  }
  fs.unlinkSync('_e.html'); await b.close(); console.log(N, 'écrans');
})();
