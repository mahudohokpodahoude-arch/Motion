import json, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
tpl = (root/'src'/'template.html').read_text(encoding='utf-8')
sprigs = (root/'src'/'sprigs.js').read_text(encoding='utf-8') if (root/'src'/'sprigs.js').exists() else ''

L = {
 'en': dict(lang='en', title='In Loving Memory – Madam Ruth Bonney Oussa',
  memory='IN LOVING MEMORY', of='of a beloved wife, mother, grandmother, sister, aunt and friend',
  madam='Madam', aka='(a.k.a. Da Adzo)', aged='Aged 63', called='Called to rest on 26th October 2026',
  lifequote='A life well lived, a heart full of love, a legacy that will forever remain.',
  prog_title='FUNERAL PROGRAMME', prog_place='Ewegbe-Hohoe, Volta Region, Ghana',
  d1='FRIDAY, 6 NOVEMBER 2026', t1='Wake-Keeping', p1='at the family residence',
  d2='SATURDAY, 7 NOVEMBER 2026', t2='Funeral Service and Burial', p2='at the cemetery in <span style="white-space:nowrap">Ewegbe-Hohoe</span>',
  d3='SUNDAY, 8 NOVEMBER 2026', t3='Thanksgiving Service', p3='at the cemetery',
  lovequote='Your love, your strength, your kindness will forever live in our hearts.',
  family_title='THE BELOVED FAMILY', h_mourners='Chief Mourners',
  m1='Head of Gbi-Wegbe Division', m2='Fiator de Nyive', m3='Head of Nyive',
  h_husband='Husband', h_son='Son', h_children='Children', h_siblings='Brothers and Sisters',
  rip='Rest in peace, dear mother.', rip2='She will always be in our hearts',
  john='“Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live.”',
  john_ref='JOHN 11:25'),
 'fr': dict(lang='fr', title='En mémoire de Madame Ruth Bonney Oussa',
  memory='EN MÉMOIRE DE', of='notre très chère épouse, maman, grand-mère, sœur, tante et amie',
  madam='Madame', aka='(alias Da Adzo)', aged='63 ans', called='Rappelée à Dieu le 26 octobre 2026',
  lifequote='Une vie bien vécue, un cœur plein d’amour, un héritage qui restera à jamais.',
  prog_title='PROGRAMME DES OBSÈQUES', prog_place='Ewegbe-Hohoe, Région de la Volta, Ghana',
  d1='VENDREDI 6 NOVEMBRE 2026', t1='Veillée mortuaire', p1='à la résidence familiale',
  d2='SAMEDI 7 NOVEMBRE 2026', t2='Messe d’enterrement et inhumation', p2='au cimetière d’<span style="white-space:nowrap">Ewegbe-Hohoe</span>',
  d3='DIMANCHE 8 NOVEMBRE 2026', t3='Culte d’action de grâce', p3='au cimetière',
  lovequote='Ton amour, ta force, ta bonté vivront à jamais dans nos cœurs.',
  family_title='LA FAMILLE', h_mourners='Chefs de collectivité',
  m1='Chef de la division Gbi-Wegbe', m2='Fiator de Nyive', m3='Chef de Nyive',
  h_husband='Époux', h_son='Fils', h_children='Enfants', h_siblings='Frères et sœurs',
  rip='Repose en paix, chère maman.', rip2='Elle restera à jamais dans nos cœurs',
  john='« Jésus lui dit : Je suis la résurrection et la vie. Celui qui croit en moi vivra, quand même il serait mort. »',
  john_ref='JEAN 11:25'),
}
VARIANTS = [('template.html', 'affiche-{code}.html'), ('template-square.html', 'affiche-{code}-square.html')]
for code, d in L.items():
    for tname, oname in VARIANTS:
        t = (root/'src'/tname).read_text(encoding='utf-8')
        html = t
        for k, v in d.items():
            html = html.replace('{{%s}}' % k, v)
        html = html.replace('{{sprigs}}', sprigs)
        assert '{{' not in html, html.split('{{')[1][:40]
        (root/'src'/oname.format(code=code)).write_text(html, encoding='utf-8')
        print('built', oname.format(code=code))
