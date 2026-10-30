import cv2, numpy as np
rng=np.random.default_rng(11)
img=cv2.imread('ref/modele.jpg')[:801]; H,W=img.shape[:2]
f=img.astype(np.float32)
def grain(h,w,s=6.5):
    n=rng.normal(0,s,(h,w)).astype(np.float32); return (cv2.GaussianBlur(n,(0,0),0.7)*1.6)[...,None]
S=5
def diffuse_fill(f,rect,mask_rects,feather=5,gs=6.0):
    m=np.zeros((H,W),np.uint8)
    for a,b,c,d in mask_rects: m[b:d,a:c]=255
    small=cv2.resize(f.astype(np.uint8),(W//S,H//S),interpolation=cv2.INTER_AREA)
    ms=cv2.dilate(cv2.resize(m,(W//S,H//S),interpolation=cv2.INTER_NEAREST),np.ones((3,3),np.uint8))
    filled=cv2.inpaint(small,ms,6,cv2.INPAINT_NS)
    filled=cv2.GaussianBlur(cv2.resize(filled,(W,H),interpolation=cv2.INTER_CUBIC).astype(np.float32),(0,0),4)+grain(H,W,gs)
    x0,y0,x1,y1=rect
    r=np.zeros((H,W),np.float32); r[y0:y1,x0:x1]=1; r=cv2.GaussianBlur(r,(0,0),feather)[...,None]
    return f*(1-r)+filled*r
f=diffuse_fill(f,(268,60,472,140),[(268,60,472,140)])
f=diffuse_fill(f,(152,478,596,614),[(152,478,596,614)],feather=4)
f=diffuse_fill(f,(184,636,540,686),[(184,636,540,686),(60,686,700,790)],feather=3)
# title: Prière and the dark chest below are excluded from the colour sources
f=diffuse_fill(f,(122,172,606,310),[(122,172,606,310),(118,310,614,480)],feather=6)
f=diffuse_fill(f,(140,619,612,645),[(140,619,612,645),(60,686,700,790)],feather=3)
out=np.clip(f,0,255).astype(np.uint8); sq=out[66:801]
cv2.imwrite('ref/base-clean.png',sq)
cv2.imwrite('/tmp/claude-0/-home-user-Motion/6ec7674e-28d5-5d9b-96df-1be1e7ee9249/scratchpad/clean.png',sq)
