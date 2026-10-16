// Traces the logo masks into SVG path data (assets/*.svg) with potrace.
import potrace from 'potrace';
import fs from 'node:fs';
const jobs = [['mask_zone_blue', 'zone_blue'], ['mask_zone_orange', 'zone_orange'], ['mask_milmo', 'milmo']];
for (const [src, out] of jobs) {
  const svg = await new Promise((res, rej) => potrace.trace(`assets/${src}.png`,
    { threshold: 128, turdSize: 40, optTolerance: 0.4, alphaMax: 1.0 }, (e, s) => e ? rej(e) : res(s)));
  fs.writeFileSync(`assets/${out}.svg`, svg);
  console.log(out, svg.length);
}
