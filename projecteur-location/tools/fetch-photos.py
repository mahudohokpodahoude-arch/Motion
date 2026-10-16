"""Photos réelles des écrans (Pexels). Deux étapes, avec un contrôle visuel entre les deux.

  python3 -I tools/fetch-photos.py download
      télécharge tous les candidats de tools/photos.json dans assets/photos/_dl/ (dossier dédié),
      vérifie que ce sont de vraies images et crée une planche de contrôle _dl/planche.jpg.
  python3 -I tools/fetch-photos.py use cinema=3980728 football=10512973 ...
      prépare les photos choisies (1920 px max) dans assets/photos/<emplacement>.jpg,
      écrit assets/photos/manifest.js (lu par la composition) et assets/photos/CREDITS.md.

Les fichiers téléchargés sont traités comme des données : seulement ouverts par Pillow, jamais exécutés."""
import io, json, os, sys, urllib.request
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTOS = os.path.join(ROOT, 'assets', 'photos')
DL = os.path.join(PHOTOS, '_dl')
CANDS = json.load(open(os.path.join(ROOT, 'tools', 'photos.json'), encoding='utf-8'))
URL = 'https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1920'
POS = {'cinema': '50% 55%', 'football': '50% 45%', 'gaming': '50% 50%', 'presentation': '50% 40%', 'streaming': '50% 45%', 'phone': '50% 35%'}


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (projecteur-location ad build)'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def download():
    os.makedirs(DL, exist_ok=True)
    got = []
    for slot, items in CANDS.items():
        if slot.startswith('_'):
            continue
        for it in items:
            dest = os.path.join(DL, f"{slot}-{it['id']}.jpg")
            try:
                data = fetch(URL.format(id=it['id']))
                im = Image.open(io.BytesIO(data)); im.verify()
                im = Image.open(io.BytesIO(data)).convert('RGB')
                im.save(dest, quality=90)
                got.append((slot, it['id'], im.size))
                print(f'ok   {slot:<13} {it["id"]:<10} {im.size[0]}x{im.size[1]}')
            except Exception as e:  # réseau bloqué, 404, fichier invalide…
                print(f'ECHEC {slot:<13} {it["id"]:<10} {type(e).__name__}: {e}')
    if got:  # planche de contrôle
        W, H = 384, 216
        cols = 4; rows = (len(got) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * W, rows * (H + 26)), (12, 16, 30)); d = ImageDraw.Draw(sheet)
        for i, (slot, pid, _) in enumerate(got):
            im = Image.open(os.path.join(DL, f'{slot}-{pid}.jpg')); im.thumbnail((W, H))
            x, y = (i % cols) * W, (i // cols) * (H + 26)
            sheet.paste(im, (x + (W - im.width) // 2, y)); d.text((x + 6, y + H + 6), f'{slot} {pid}', fill=(255, 200, 40))
        sheet.save(os.path.join(DL, 'planche.jpg'), quality=85)
        print('planche :', os.path.join(DL, 'planche.jpg'))


def use(pairs):
    chosen = dict(p.split('=') for p in pairs)
    manifest, credits = {}, ['# Crédits photos', '', 'Photos Pexels (licence Pexels : usage commercial autorisé). Les personnes photographiées ne cautionnent pas le service.', '']
    for slot, pid in chosen.items():
        meta = next(it for it in CANDS[slot] if str(it['id']) == pid)
        im = Image.open(os.path.join(DL, f'{slot}-{pid}.jpg')).convert('RGB')
        if im.width > 1920:
            im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
        im.save(os.path.join(PHOTOS, f'{slot}.jpg'), quality=88, optimize=True)
        manifest[slot] = {'src': f'assets/photos/{slot}.jpg', 'pos': POS.get(slot, '50% 50%'), 'credit': f"{meta['by']} / Pexels #{pid}"}
        credits.append(f"- **{slot}** : {meta['what']} — {meta['by']}, https://www.pexels.com/photo/{pid}/")
    with open(os.path.join(PHOTOS, 'manifest.js'), 'w', encoding='utf-8') as f:
        f.write("// Photos réelles affichées dans les écrans (généré par tools/fetch-photos.py).\n")
        f.write("// Clé absente -> la scène utilise son illustration vectorielle.\n")
        f.write('window.PHOTOS = ' + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n')
    open(os.path.join(PHOTOS, 'CREDITS.md'), 'w', encoding='utf-8').write('\n'.join(credits) + '\n')
    print('manifest :', ', '.join(manifest))


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'download':
        download()
    elif len(sys.argv) > 2 and sys.argv[1] == 'use':
        use(sys.argv[2:])
    else:
        print(__doc__)
