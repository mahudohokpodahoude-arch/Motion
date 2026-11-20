const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const L = [
 ["entree_diplomes","Entrée solennelle des diplômés","Apôtre Amos","Protocole"],
 ["priere_ouverture","Prière d’ouverture","Apôtre Achille",""],
 ["louange_adoration","Louange et adoration","Équipe musicale / Chorale",""],
 ["mot_bienvenue","Mot de bienvenue","Dr Mary Favour TONGSI",""],
 ["mot_recteur","Mot du Recteur","Pasteur Benoît GANKPIN","Recteur"],
 ["allocution_institutionnelle","Allocution institutionnelle","Dr Augustin K. TONGSI","Vision et perspectives de iBuild"],
 ["temoignages","Témoignages des diplômés","Caleb et Jacqueline",""],
 ["hommage_enseignants","Hommage aux enseignants et distinctions honorifiques","Dr Augustin K. TONGSI",""],
 ["offrandes","Offrandes","Apôtre Achille",""],
 ["intermede_musical","Intermède musical","Équipe musicale / Chorale",""],
 ["discours_magistral","Discours magistral","GNANHOUI SAMUEL KODJO",""],
 ["presentation_promotion","Présentation officielle de la promotion","Pasteur Pierre YEHOUENOU","Vice-Recteur"],
 ["remise_diplomes","Remise officielle des diplômes","Dr Augustin K. TONGSI","et De Taye Moïse Vitegni"],
 ["engagement_solennel","Engagement solennel des diplômés","Le Recteur et le Vice-Recteur",""],
 ["priere_benediction","Prière de bénédiction et d’envoi","De Taye Moïse Vitegni",""],
 ["remerciements","Remerciements officiels","Apôtre Georges EHAHOUN",""],
 ["photo_officielle","Photo officielle","Apôtre Amos","Protocole"],
 ["cloture","Clôture de la cérémonie","Maître de cérémonie / Protocole",""],
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  
  for (const th of ['royal','rubis']) { fs.mkdirSync(`out/titres_${th}`,{recursive:true});
  for (const [i,[k,tag,name,role]] of L.entries()) {
    await p.goto('file://'+path.resolve(__dirname,'titres.html'));
    await p.evaluate(([t,n,r,th])=>{document.body.className=th;document.getElementById('tag').textContent=t;document.getElementById('name').textContent=n;const ro=document.getElementById('role');ro.textContent=r;ro.style.display=r?'block':'none';},[tag,name,role,th]);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `out/titres_${th}/${String(i+1).padStart(2,'0')}_${k}.png`, omitBackground: true });
  } }
  await b.close();
})();
