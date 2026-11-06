import cv2, numpy as np
im=cv2.imread('assets/original.jpg'); H,W=im.shape[:2]
b,g,r=[im[...,i].astype(int) for i in range(3)]
m=(r>50)|((r>40)&(g>100)&(b<150))      # white / yellow / red elements
m=m.astype(np.uint8)*255
# only logo area in the top band, everything below y=235
keep=np.zeros_like(m); keep[:]=0
keep[235:,:]=255; keep[80:170,285:455]=255
m=cv2.bitwise_and(m,keep)
# navy text inside white/yellow boxes: close gaps, then grow
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_RECT,(15,15)))
# the frame lines & boxes interiors: fill enclosed holes
cnt,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
filled=np.zeros_like(m); cv2.drawContours(filled,cnt,-1,255,-1)
m=cv2.dilate(filled,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)))
cv2.imwrite('mask.png',m)
out=cv2.inpaint(im,m,7,cv2.INPAINT_TELEA)
# smooth the filled area and re-add grain so it matches the texture
bl=cv2.GaussianBlur(out,(0,0),6)
mf=cv2.GaussianBlur(m,(0,0),2).astype(float)/255
rng=np.random.default_rng(1)
grain=rng.normal(0,3.2,(H,W,1)); lowf=cv2.GaussianBlur(rng.normal(0,9,(H,W)),(0,0),18)[...,None]
res=out*(1-mf[...,None])+ (bl+grain+lowf*0.6)*mf[...,None]
# tame the glow inpainted from the bright top band: pull the fill toward the row-wise median of untouched pixels
un=(m==0)
tgt=np.zeros((H,3))
for y in range(H):
    row=im[y][un[y]]; tgt[y]=np.median(row,axis=0) if len(row)>40 else (0,36,126)
tgt=cv2.GaussianBlur(tgt.astype(np.float32),(0,0),sigmaX=0.1,sigmaY=14)
ramp=np.clip((np.arange(H)-235)/40,0,1)[:,None,None]
tg=np.repeat(tgt[:,None,:],W,axis=1)
res=res*(1-mf[...,None]*ramp*0.75)+(tg+grain+lowf*0.6)*(mf[...,None]*ramp*0.75)
cv2.imwrite('assets/bg_clean.png',np.clip(res,0,255).astype(np.uint8))
cv2.imwrite('bg_preview.jpg',np.clip(res,0,255).astype(np.uint8))
