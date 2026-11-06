# Builds 8 phone-screen textures (1080x2340, 9:19.5) from key frames of the original vertical video.
import numpy as np, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src=sys.argv[1]; out='assets/screens/'
W,H=1080,2340
F=ImageFont.truetype('/home/user/Motion/zone242-vision/engine/fonts/Inter-700.ttf',46)
for i in range(8):
    fr=Image.open(f'{src}/k{i}.png').convert('RGB'); a=np.array(fr).astype(float)
    top=a[:6].mean((0,1)); bot=a[-6:].mean((0,1))
    ys=np.linspace(0,1,H)[:,None,None]
    canvas=(top*(1-ys)+bot*ys)*np.ones((H,W,3))
    fr2=fr.resize((W,1920),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2,60,2))
    off=(H-1920)//2
    # feather the seam
    m=np.ones((1920,1),float); n=70; m[:n,0]=np.linspace(0,1,n); m[-n:,0]=np.linspace(1,0,n)
    reg=canvas[off:off+1920]; canvas[off:off+1920]=reg*(1-m[...,None])+np.array(fr2).astype(float)*m[...,None]
    im=Image.fromarray(np.clip(canvas,0,255).astype('uint8')); d=ImageDraw.Draw(im)
    # status bar + dynamic island + home indicator
    d.rounded_rectangle((W/2-165,40,W/2+165,40+96),radius=48,fill=(0,0,0))
    d.text((110,62),'9:41',font=F,fill=(255,255,255))
    bx=W-250; d.rectangle((bx,72,bx+14,98),fill='white'); d.rectangle((bx+24,62,bx+38,98),fill='white'); d.rectangle((bx+48,50,bx+62,98),fill='white')
    d.rounded_rectangle((W-150,64,W-70,98),radius=10,outline=(255,255,255),width=4); d.rounded_rectangle((W-144,70,W-84,92),radius=6,fill='white')
    d.rounded_rectangle((W/2-190,H-52,W/2+190,H-40),radius=6,fill=(255,255,255))
    im.save(f'{out}s{i}.png')
print('ok')
