import cv2, numpy as np
rng=np.random.default_rng(3)
img=cv2.imread('assets/cover.jpg'); H,W=img.shape[:2]
f=img.astype(np.float32)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
# the golden ring: protect the real ring (outer radius ~ 478 x 556 around (928, 992)) with a small margin
ring=(((xx-928)/505)**2+((yy-992)/578)**2<1).astype(np.float32)
xm=110
LV=cv2.GaussianBlur(np.concatenate([f[:, :xm],f[:,W-xm:]],axis=1).mean(axis=1)[None],(0,0),30)[0]
lift=1+0.10*np.exp(-(((xx-905)/520)**2))[...,None]
def region(f,y0,y1,fe,ring_protect=True):
    m=np.zeros((H,W),np.float32); m[y0:y1]=1
    if ring_protect: m*=(1-ring)
    m=cv2.GaussianBlur(m,(0,0),fe)[...,None]
    fill=LV[:,None,:]*lift+rng.normal(0,1.4,(H,W,1)).astype(np.float32)
    return f*(1-m)+fill*m
# old title: its swash reaches y~490 around x 600-1500, while the doves' wings start at y~540 on the sides
f=region(f,150,500,16)
# the stray golden crescent right of the ring (title swash tip)
m=np.zeros((H,W),np.float32); m[395:490,1135:1250]=1; m*=(1-ring)
m=cv2.GaussianBlur(m,(0,0),6)[...,None]
f=f*(1-m)+(LV[:,None,:]*lift+rng.normal(0,1.4,(H,W,1)).astype(np.float32))*m
f=region(f,1672,H,14,ring_protect=False)   # MADAM, name, dates, closing line
cv2.imwrite('assets/cover-clean.png',np.clip(f,0,255).astype(np.uint8))
