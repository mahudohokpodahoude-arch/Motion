import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import http from 'node:http'; import path from 'node:path'; import fs from 'node:fs';
const here=path.dirname(fileURLToPath(import.meta.url));
const fonts=path.resolve(here,'../milmo-zone242/fonts');
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://x').pathname;
  const p=u==='/'?path.join(here,'index.html'):u.startsWith('/fonts/')?path.join(fonts,u.slice(7)):path.join(here,u);
  if(!fs.existsSync(p)){res.writeHead(404);return res.end()}
  res.writeHead(200,{'content-type':p.endsWith('.html')?'text/html':p.endsWith('.png')?'image/png':p.endsWith('.woff2')?'font/woff2':'application/octet-stream'});fs.createReadStream(p).pipe(res)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const [mode,...rest]=process.argv.slice(2);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1920,height:1080}});
page.on('pageerror',e=>console.error(e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.evaluate(()=>window.ready);
const shot=()=>page.locator('#c').screenshot({type:'jpeg',quality:96});
if(mode==='stills'){const dir=rest[1];fs.mkdirSync(dir,{recursive:true});
  for(const t of rest[0].split(',').map(Number)){await page.evaluate(t=>render(t),t);fs.writeFileSync(`${dir}/t${t}.png`,await shot())}}
else{const out=rest[0],fps=30,[f0,f1]=(rest[1]||'0,600').split(',').map(Number),n=f1-f0;
  const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','16','-preset','medium',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<n;i++){await page.evaluate(t=>render(t),(f0+i)/fps);const b=await shot();if(!ff.stdin.write(b))await new Promise(r=>ff.stdin.once('drain',r))}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));}
await browser.close();server.close();
