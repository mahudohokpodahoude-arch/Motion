const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const S = [
 {n:1,t:"Devant la Parole de Dieu",p:[
  "Je m’engage à demeurer fidèle à la Parole de Dieu, à poursuivre son étude, de l’Ancien au Nouveau Testament, de la Loi à la grâce, en gardant Jésus-Christ au centre de toute l’Écriture.",
  "Je m’engage à l’interpréter avec rigueur, dans son contexte et à la lumière de l’Alliance, sans jamais la déformer ni l’utiliser pour mon profit."]},
 {n:2,t:"Devant l’Évangile de la grâce",p:[
  "Je reconnais que mon salut est un don de Dieu : instantané, personnel, gratuit et éternel, reçu par la foi seule, sur la base de l’œuvre accomplie de Christ à la croix.",
  "Je m’engage à proclamer cet Évangile avec clarté, à affermir les croyants dans leur identité d’enfants et d’héritiers de Dieu, et à ne jamais les ramener sous la condamnation, la peur, la manipulation ou la servitude religieuse."]},
 {n:3,t:"Sur le terrain : mon ministère",p:[
  "Je m’engage à conduire les hommes vers Jésus-Christ, et non vers ma personne ni mes intérêts.",
  "Je m’engage à prêcher, enseigner et prier dans la liberté de la victoire de Christ, sans peur du diable ni commerce de la délivrance, et à résister aux faux enseignements et aux traditions qui prennent la place de Christ.",
  "Je m’engage, selon les responsabilités confiées, à implanter, édifier et gérer des Églises et des cellules, à former des disciples capables d’en former d’autres, et à conduire les transitions avec sagesse, sans division."]},
 {n:4,t:"Sur le terrain : mon intégrité",p:[
  "Je m’engage à vivre ce que j’enseigne : à porter le fruit de l’Esprit, à gérer avec honnêteté les personnes, les offrandes et les biens qui me seront confiés, à rester humble, et à demeurer sous l’accompagnement de responsables spirituels."]},
 {n:5,t:"Mon engagement envers l’IBULD",p:[
  "Je m’engage à honorer l’Institut qui m’a formé, à préserver sa vision, ses valeurs et son ADN spirituel, et à ne pas utiliser son nom ni mon diplôme de manière contraire à l’enseignement reçu.",
  "Je m’engage à rester en lien avec l’IBULD, à l’informer de mon ministère, à contribuer selon mes moyens à son œuvre, et à recommander sa formation à d’autres serviteurs."]},
 {n:6,t:"Déclaration finale",p:[
  "Je reconnais que ce diplôme n’est pas une fin, mais le début d’une responsabilité devant Dieu. Ce que je promets, je le promets par la grâce qui m’a été faite, et non pour la mériter.",
  "Je prends cet engagement librement, solennellement et avec conviction, devant Dieu et devant les témoins de cette cérémonie."]},
];
const slides = [{type:'title'}];
S.forEach(s => s.p.forEach((txt,i) => slides.push({type:'p',n:s.n,t:s.t,txt,i:i+1,of:s.p.length})));
slides.push({type:'sign'});
const total = slides.length;
const html = (s,idx) => {
  const hl = x => x.replace(/^(Je m’engage|Je reconnais|Je prends)/,'<b>$1</b>');
  let body='', head='';
  if (s.type==='title') {
    body=`<div class="center"><div class="k">CÉRÉMONIE DE GRADUATION</div><h1>ENGAGEMENT SOLENNEL<br>DES DIPLÔMÉS</h1><div class="rule"></div><div class="sub">Fidélité à Christ, à la Parole, à l’Évangile de la grâce et à l’IBULD</div><div class="rit">Le responsable lit chaque paragraphe,<br>puis les diplômés le répètent à haute voix.</div></div>`;
    head=`<div class="hd solo"></div>`;
  } else if (s.type==='p') {
    const L=s.txt.length, fs=L<110?86:L<170?76:L<215?70:66;
    head=`<div class="hd"><div class="num">${s.n}</div><div class="ht">${s.t}</div></div>`;
    body=`<div class="bodyp"><div class="bar"></div><p style="font-size:${fs}px">${hl(s.txt)}</p></div><div class="cnt">${s.of>1?`Paragraphe ${s.i} / ${s.of}`:''}</div>`;
  } else {
    head=`<div class="hd solo"></div>`;
    body=`<div class="center"><div class="k">ENGAGEMENT SOLENNEL</div><div class="fait">Fait à ………………………………………, le ………………………………………</div><div class="sigs"><div><div class="line"></div>Nom et signature du diplômé</div><div><div class="line"></div>Le Directeur de l’IBULD</div></div></div>`;
  }
  return `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Cinzel;font-weight:700;src:url(fonts/cinzel-latin-700-normal.woff2)}
@font-face{font-family:Cinzel;font-weight:600;src:url(fonts/cinzel-latin-600-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1920px;height:1080px;overflow:hidden}
:root{--g:#0b4429;--gd:#06301c;--au:#c9a227;--au2:#e6c556;--cream:#fffdf3;--ink:#10261b}
body{background:var(--cream);font-family:'Liberation Serif','Times New Roman',serif;color:var(--ink);position:relative}
.logo{position:absolute;left:60px;top:26px;height:118px;border-radius:14px;box-shadow:0 0 0 3px var(--au2)}
.hd{position:absolute;left:0;right:0;top:0;height:170px;background:linear-gradient(180deg,var(--g),var(--gd));border-bottom:10px solid var(--au);display:flex;align-items:center;padding-left:260px}
.hd.solo{padding-left:0}
.num{width:96px;height:96px;border-radius:50%;background:var(--au);color:var(--gd);font-weight:700;font-size:64px;display:grid;place-items:center;margin-right:36px}
.ht{font-weight:700;font-size:66px;color:#fff}
.bodyp{position:absolute;left:150px;right:150px;top:200px;bottom:120px;display:flex;align-items:center;gap:44px}
.bar{width:14px;align-self:stretch;margin:50px 0;background:linear-gradient(var(--au2),var(--au));border-radius:7px}
p{line-height:1.45;text-align:left;color:var(--ink)}p b{color:var(--g);font-weight:700}
.cnt{position:absolute;right:150px;bottom:96px;font-size:30px;font-weight:700;color:var(--au);font-family:Cinzel,serif;letter-spacing:.08em;display:none}
.ft{position:absolute;left:0;right:0;bottom:0;height:78px;background:var(--g);border-top:8px solid var(--au);display:flex;align-items:center;justify-content:space-between;padding:0 70px;font-family:Cinzel,serif;font-weight:600;font-size:28px;letter-spacing:.5em;color:var(--au2)}
.ft span:last-child{letter-spacing:.1em;font-size:26px}
.center{position:absolute;left:0;right:0;top:170px;bottom:78px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.k{font-family:Cinzel,serif;font-weight:600;font-size:34px;letter-spacing:.4em;color:var(--au);margin-bottom:26px}
h1{font-family:Cinzel,serif;font-weight:700;font-size:100px;line-height:1.15;letter-spacing:.04em;color:var(--g)}
.rule{width:420px;height:8px;background:linear-gradient(90deg,transparent,var(--au),transparent);margin:34px 0 30px}
.sub{font-style:italic;font-size:48px;color:#8a6d0b;max-width:1500px;line-height:1.3}
.rit{margin-top:44px;font-size:42px;color:#33463b;line-height:1.4}
.fait{font-size:54px;margin:20px 0 120px}
.sigs{display:flex;gap:140px;font-size:42px}.sigs>div{width:620px}.line{height:6px;background:var(--au);margin-bottom:20px;border-radius:3px}
</style>${head}<img class="logo" src="assets/logo-ibuld-crop.png">${body}<div class="ft"><span>EXCELLENCE • LEADERSHIP • IMPACT</span><span>${idx+1} / ${total}</span></div>`;
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  fs.mkdirSync('out/engagement',{recursive:true});
  const names=['titre'];
  for (const [i,s] of slides.entries()) {
    fs.writeFileSync('_slide.html', html(s,i));
    await p.goto('file://'+path.resolve(__dirname,'_slide.html')); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(120);
    const over = await p.evaluate(()=>{const e=document.querySelector('.bodyp p');return e?e.scrollHeight>e.parentElement.clientHeight-20:false});
    const nm = s.type==='title'?'titre':s.type==='sign'?'signature':`s${s.n}_p${s.i}`;
    await p.screenshot({ path:`out/engagement/${String(i+1).padStart(2,'0')}_${nm}.png` });
    if(over) console.log('OVERFLOW',nm);
  }
  fs.unlinkSync('_slide.html'); await b.close(); console.log(total,'slides');
})();
