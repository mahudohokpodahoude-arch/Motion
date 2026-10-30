import re, zipfile, pathlib, html
root = pathlib.Path(__file__).resolve().parent
# ---- tribute text, verbatim from the docx ----
z = zipfile.ZipFile('/root/.claude/uploads/6ec7674e-28d5-5d9b-96df-1be1e7ee9249/f7c17cdf-TRIBUTE-SISTER-ADJO.docx')
x = z.read('word/document.xml').decode('utf8')
paras = []
for p in re.findall(r'<w:p[ >].*?</w:p>', x, flags=re.S):
    t = html.unescape(''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, flags=re.S)))
    t = re.sub(r'\s+', ' ', t).strip()
    if t: paras.append(t)
def is_quote(t): return t.startswith('“') and re.search(r'—\s*[1-3]?\s*[A-Z][a-z]+', t) is not None
def render(t):
    cls = 'q' if (t.startswith('“') and '—' in t) else 'p'
    return '<p class="%s">%s</p>' % (cls, html.escape(t))
# split into 3 pages at paragraph boundaries
idx = {k: next(i for i,t in enumerate(paras) if t.startswith(k)) for k in ['Sister Adjo was a woman of prayer','We have the assurance']}
chunks = [paras[1:idx['Sister Adjo was a woman of prayer']], paras[idx['Sister Adjo was a woman of prayer']:idx['We have the assurance']], paras[idx['We have the assurance']:]]
title = paras[0]
assert sum(len(c) for c in chunks)+1 == len(paras)
def tribute_page(i, c):
    head = '<div class="ttl"><span>Tribute to</span><b>Sister Adjo</b><em>By Her Children</em></div>' if i == 0 else ''
    return '<section class="page text">%s%s</section>' % (head, ''.join(render(t) for t in c))

def ent(n, r=None): return '<p><b>%s</b>%s</p>' % (n, (', <span>%s</span>' % r) if r else '')
FATHER = [("TOGBE KOMLA KUNDE V","Chief of Alavanyo Abehenease"),("MR ROBERT ADZRAKU","Rtd Educationist"),("MR SAI ADZRAKUTSE ATSU",None),("TOGBE ADJOS ASANGO",None),("PHILOMENA BONNIE",None),("MAMA FAFA MEDINAWO AGBO II",None),("MADAM VERONICA KOFIYAO",None),("CHRISTINE ADRAKU",None),("REGINA KOFIYAO",None),("ELISA ADZRAKU",None),("NESTOR ADZRAKU",None)]
MOTHER = [("TOGBE KEH XII","Divisional Chief of Gbi Wegbe"),("TOGBE KATABUA IV","Dzabe Sub-Divisional Chief"),("KPUKPOTOR JOHN KUBI","Gbi Wegbe"),("MR MANKRA MATHIAS","Fiator Nyive"),("MR ANTHONY ALAYI","Clan Head Nyive"),("MAMA AMETORWOYOR","Queen Mother Nyive"),("AFETOR KOKU SOGLO","Fiatefenorla Nyive"),("MADAM BERNICE BRAHENE",None),("ME KOFI ADUSU","Fiatefenorla Dzabe")]

pages = []
pages.append('<section class="page cover"><img src="assets/cover.jpg"></section>')
pages.append('''<section class="page"><div class="frame"></div>
 <img class="dove l" src="assets/dove-l.png"><img class="dove r" src="assets/dove-r.png">
 <div class="center top">
  <div class="cross">✝</div><div class="kicker">IN LOVING MEMORY</div>
  <div class="ring"><div class="ph"></div></div>
  <div class="madam">MADAM</div><div class="name">Ruth BONNEY OUSSA</div>
  <div class="aka">(a.k.a Da Adzo)</div>
  <div class="dates">Aged 63 &nbsp;·&nbsp; Called to rest on 26th October 2026</div>
  <div class="rule"></div>
  <div class="script small">A life well lived, a heart full of love, a legacy that will forever remain.</div>
 </div></section>''')
pages.append('''<section class="page"><div class="frame"></div><div class="center">
  <div class="cross">✝</div><div class="script h">Funeral Programme</div><div class="sub">Ewegbe-Hohoe, Volta Region, Ghana</div><div class="rule"></div>
  <div class="ev"><span class="pill">Friday, 6 November 2026</span><h3>Wake-Keeping</h3><p>at the family residence</p></div>
  <div class="ev"><span class="pill">Saturday, 7 November 2026</span><h3>Funeral Service and Burial</h3><p>at the cemetery in Ewegbe-Hohoe</p></div>
  <div class="ev"><span class="pill">Sunday, 8 November 2026</span><h3>Thanksgiving Service</h3></div>
 </div></section>''')
pages.append('''<section class="page"><div class="frame"></div><div class="center">
  <div class="cross">✝</div><div class="script h">The Beloved Family</div><div class="rule"></div>
  <div class="sur">ADZRAKUTSE • BONNEY • OUSSA • HOUSSOU • OROUNLA • AGOUNKPE</div>
  <h4>Children</h4>
  <p class="nm"><b>Huldah</b> OROUNLA</p><p class="nm"><b>Michèle</b> OUSSA</p><p class="nm"><b>Godwill</b> OUSSA</p><p class="nm"><b>Anne Marie</b> OUSSA</p><p class="nm"><b>Jean Claude</b> OUSSA</p>
  <h4>Siblings</h4>
  <p class="nm"><b>TERESA</b> VIDEKPUE</p><p class="nm"><b>NOAH</b> VIDEKPUR</p><p class="nm"><b>MAWUNI</b> ADZRAKUTSE</p><p class="nm"><b>EMMANUEL</b> ADZRAKUTSE</p><p class="nm"><b>DAVID</b> AIIZRI</p><p class="nm"><b>FLORENCE</b> ADZEI</p><p class="nm"><b>ABUYA</b></p>
  <div class="rule"></div>
  <p class="nm"><b>KOFI BRAHENE</b>, <span>Vinor</span></p><p class="nm"><b>ADJOS ADZRAKUTSE</b>, <span>Vitor</span></p>
 </div></section>''')
pages.append('<section class="page"><div class="frame"></div><div class="center"><div class="cross">✝</div><div class="script h">Chief Mourners</div><div class="side">Father’s side</div><div class="rule"></div><div class="list">%s</div></div></section>' % ''.join(ent(*e) for e in FATHER))
pages.append('<section class="page"><div class="frame"></div><div class="center"><div class="cross">✝</div><div class="script h">Chief Mourners</div><div class="side">Mother’s side</div><div class="rule"></div><div class="list">%s</div></div></section>' % ''.join(ent(*e) for e in MOTHER))

def hymn_page(num, title, sub, path):
    f = root/path
    if f.exists():
        blocks = [b for b in f.read_text(encoding='utf-8').strip().split('\n\n')]
        body = ''.join('<div class="st%s">%s</div>' % (' rf' if b.startswith('~') else '', '<br>'.join(html.escape(l.lstrip('~')) for l in b.split('\n'))) for b in blocks)
    else:
        body = '<div class="st">(lyrics to come)</div>'
    return ('<section class="page hymn"><div class="frame"></div><div class="center"><div class="cross">✝</div><div class="kicker sm">HYMN %d</div>'
            '<div class="script h">%s</div><div class="sub">%s</div><div class="rule"></div>%s</div></section>') % (num, title, sub, body)
hy1 = hymn_page(1, 'It Is Well with My Soul', 'When peace like a river', 'hymn1.txt')
hy2 = hymn_page(2, 'The Old Rugged Cross', 'On a hill far away', 'hymn2.txt')
tribute = [tribute_page(i, c) for i, c in enumerate(chunks)]
cover, dedication, programme, family, father, mother = pages[0], pages[1], pages[2], pages[3], pages[4], pages[5]
back = '''<section class="page back"><div class="frame"></div><img class="dove l" src="assets/dove-l.png"><img class="dove r" src="assets/dove-r.png"><div class="center mid">
  <div class="verse">“Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.”</div><div class="jn">JOHN 11:25</div>
  <div class="rule"></div>
  <div class="script big">Rest in peace dear Mother</div><div class="sub">She will always be in our hearts</div>
 </div></section>'''
blank = '<section class="page blank"><div class="frame"></div></section>'
pages = [cover, dedication, programme, hy1, hy2] + tribute + [blank, blank, blank, back]
assert len(pages) == 12
pages = [p if (i in (0, len(pages)-1) or 'page blank' in p) else p.replace('</section>', '<div class="pn">%d</div></section>' % (i+1)) for i, p in enumerate(pages)]
css = (root/'livret.css').read_text()
(root/'livret.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>In Loving Memory – Madam Ruth Bonney Oussa</title><style>%s</style></head><body>%s</body></html>' % (css, '\n'.join(pages)), encoding='utf-8')
print('pages', len(pages), 'tribute paras', len(paras))
