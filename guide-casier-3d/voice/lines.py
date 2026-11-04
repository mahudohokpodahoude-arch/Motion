"""Texte de la voix off et calage de la timeline (partagé par make_voice.py et import_voice.py)."""
import os, json, math
BT = 60 / 128
HERE = os.path.dirname(os.path.abspath(__file__))
LINES = [  # (voix de synthèse, texte, temps minimum en temps musicaux à 128 BPM)
  ('F', "Votre casier judiciaire, en ligne, instantanément !", 6),
  ('F', "Rendez-vous sur service-public point B J.", 4),
  ('F', "Choisissez la délivrance du casier judiciaire.", 4),
  ('F', "Indiquez votre profil.", 4),
  ('F', "Saisissez le code reçu par e-mail.", 5),
  ('F', "Vérifiez vos informations.", 4),
  ('F', "Payez mille neuf cents francs C F A.", 6),
  ('F', "Et voilà : votre bulletin, tout de suite !", 6),
  ('M', "Aucune pièce. Aucun déplacement.", 6),
  ('M', "Rendez-vous maintenant sur le site !", 10),
]
def write_timeline(durations, max_beats=63):
    """durations : durée (s) de chaque phrase. Retourne les temps musicaux ; écrit timeline.json."""
    beats = [max(LINES[i][2], math.ceil((d + .30) / BT)) for i, d in enumerate(durations)]
    assert sum(beats) <= max_beats, f'trop long : {sum(beats) * BT:.1f} s'
    cum = [0]
    for b in beats: cum.append(cum[-1] + b)
    json.dump({'BPM': 128, 'beats': cum, 'TT': [b * BT for b in cum], 'lines': [{'voice': v, 'text': t} for v, t, _ in LINES]},
              open(os.path.join(HERE, '..', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    return beats
