from pypdf import PdfReader, PdfWriter, PageObject, Transformation
import pathlib
d = pathlib.Path(__file__).resolve().parent
src = PdfReader(d/'livret-A5.pdf'); n = len(src.pages)
assert n % 4 == 0, n
W, H = 841.89, 595.28   # A4 landscape
pw, ph = float(src.pages[0].mediabox.width), float(src.pages[0].mediabox.height)
out = PdfWriter()
def sheet(left, right):
    pg = PageObject.create_blank_page(width=W, height=H)
    for page_no, x0 in ((left, 0), (right, W/2)):
        p = src.pages[page_no-1]
        pg.merge_transformed_page(p, Transformation().translate(x0 + (W/2 - pw)/2, (H - ph)/2))
    out.add_page(pg)
for i in range(n//4):
    sheet(n-2*i, 1+2*i)        # outer face (recto of the sheet)
    sheet(2+2*i, n-1-2*i)      # inner face (verso)
out.write(d/'livret-A4-impression.pdf')
print('imposed sheets:', n//2, 'faces; order:', [(n-2*i,1+2*i,2+2*i,n-1-2*i) for i in range(n//4)])
