# -*- coding: utf-8 -*-
"""Contenu éditorial des 38 thèmes.

- Les thèmes « O<n> » reprennent les 10 questions du thème n du document d'origine
  (src/questions_originales.json), dans le même ordre.
- Les thèmes « N<n> » sont ajoutés dans cette édition et portent leurs propres questions.
- REFORMULATIONS : questions d'origine recentrées pour éviter les doublons
  (texte d'origine conservé dans le journal éditorial en annexe).
"""

PARTIES = [
    ("Se connaître et se laisser connaître",
     "On n'épouse pas une idée, mais une personne, avec son histoire, ses forces et ses fragilités. "
     "Cette première partie invite chacun à se regarder avec honnêteté avant de regarder le couple.",
     ["O1", "O8", "O9", "O18"]),
    ("Foi, vision et appel",
     "Partager la même foi ne veut pas dire la vivre de la même manière. "
     "Ces thèmes aident à nommer ce qui est essentiel, ce qui est secondaire, et la direction que vous souhaitez prendre ensemble.",
     ["O2", "O3", "O4", "O5"]),
    ("Communiquer, traverser les conflits, se respecter",
     "Les couples solides ne sont pas ceux qui ne se disputent jamais, mais ceux qui savent se parler, se réparer "
     "et rester en sécurité l'un avec l'autre. Cette partie est le cœur du parcours.",
     ["O6", "O7", "N1", "O28"]),
    ("Rôles, intimité et fidélité",
     "Comment partager l'autorité et les responsabilités ? Comment vivre une sexualité libre, respectueuse et fidèle ? "
     "Ces questions demandent de la délicatesse et beaucoup d'honnêteté.",
     ["O12", "O13", "O14", "N2", "O25"]),
    ("Santé, vulnérabilités et épreuves",
     "« Dans la santé et dans la maladie » : la promesse est facile à prononcer, plus difficile à préparer. "
     "Parler maintenant des fragilités permet de ne pas les découvrir seuls au pire moment.",
     ["O21", "N3", "N6"]),
    ("Travail et argent",
     "L'argent et le travail touchent à la sécurité, au pouvoir et à la confiance. "
     "La transparence se construit avant le mariage, pas après la première mauvaise surprise.",
     ["O10", "O11", "N4"]),
    ("Le quotidien du foyer",
     "Les grandes promesses se vivent dans les petites choses : les horaires, la vaisselle, le temps libre, "
     "les rituels. C'est souvent là que l'amour s'use ou se renouvelle.",
     ["O19", "O20", "O22", "O23", "O24"]),
    ("Familles, enfants et communauté",
     "Un mariage unit deux personnes, mais aussi deux histoires familiales, deux cultures et, peut-être, une génération à venir. "
     "Cette partie aide à poser des limites justes et à accueillir la vie, même quand elle ne ressemble pas à ce qui était prévu.",
     ["O17", "N7", "O26", "O15", "N5", "O16", "O27"]),
    ("S'engager en connaissance de cause",
     "Dernière étape : se préparer aux tempêtes, régler le concret, faire le bilan et vérifier que chacun peut dire oui "
     "librement, en connaissance de cause et sans peur.",
     ["N8", "O29", "O30"]),
]

REFORMULATIONS = {
    "O1.6": ("Comment le stress, la contrariété ou la déception se manifestent-ils chez toi (humeur, corps, paroles), et comment puis-je les reconnaître ?",
             "Distinguer les déclencheurs (question 5) des signes visibles de la tension (question 6)."),
    "O9.10": ("Quels signes de fatigue ou de détresse émotionnelle nous indiqueraient que l'un de nous, ou notre relation, a besoin d'un accompagnement ?",
              "Doublon avec l'ancienne question 30.7 : celle-ci est recentrée sur la santé émotionnelle."),
    "O12.6": ("Comment éviterons-nous qu'un écart de revenus, de diplômes ou d'expérience se transforme en rapport de pouvoir dans nos décisions ?",
              "La gestion des revenus différents est traitée en 11.10 ; ici, l'enjeu est le pouvoir dans le couple."),
    "O14.7": ("Quelles informations de santé sexuelle et reproductive devraient être partagées pour permettre un consentement éclairé et protéger la santé de chacun ?",
              "Doublon avec l'ancienne question 21.3 : celle-ci est recentrée sur la santé sexuelle."),
    "O15.7": ("Quelles méthodes disciplinaires jugeons-nous acceptables ou inacceptables, et que prévoit la loi de notre pays à ce sujet ?",
              "Recoupement avec 16.3 : ajout du cadre légal, absent du document d'origine."),
    "O17.7": ("Quelle aide pratique (temps, hébergement, garde d'enfants, accompagnement) souhaitons-nous apporter à nos familles, et dans quelles limites ?",
              "L'aide financière aux proches est déjà traitée en 11.7 ; ici, l'aide pratique."),
    "O17.8": ("Comment gérerons-nous les différences religieuses entre nos familles, par exemple si l'une n'est pas chrétienne ou appartient à une autre confession ?",
              "Doublon avec 26.5 (différences culturelles) : recentrée sur les différences religieuses."),
    "O19.10": ("Quelles petites routines pratiques (repas, coucher, messages dans la journée) pourraient nous aider à rester connectés chaque jour ?",
               "Recoupement avec 23.1 (rituels) : recentrée sur l'organisation pratique."),
    "O21.3": ("Y a-t-il des informations de santé physique ou psychique (diagnostic, traitement, suivi en cours) que nous devons aborder avant le mariage pour prendre des décisions éclairées ?",
              "Doublon avec 14.7 : recentrée sur la santé générale et mentale."),
    "O23.10": ("Quelle forme prendrait notre point de couple hebdomadaire ou mensuel (durée, moment, questions à se poser) ?",
               "Triple recoupement avec 22.10 et 30.4 : ici, la forme concrète du point régulier."),
    "O27.4": ("Combien de soirées ou de week-ends par mois sommes-nous prêts à consacrer aux activités d'Église, et comment réévaluerons-nous cet équilibre ?",
              "Doublon avec 5.7 (le ministère qui dévore le couple) : rendue concrète et mesurable."),
    "O29.5": ("Les dettes, engagements financiers et obligations évoqués dans le thème « Finances » sont-ils tous clarifiés, y compris les responsabilités légales (pensions, cautions, procédures en cours) ?",
              "Doublon avec 11.1 : transformée en question de vérification avant la cérémonie."),
    "O30.2": ("Sur quels sujets avons-nous encore des désaccords importants, et lesquels pourrons-nous porter durablement sans les résoudre ?",
              "Recoupement avec 29.9 : ajout de la notion de désaccord durable, présente dans tout couple."),
    "O30.4": ("À quelle fréquence souhaitons-nous faire un bilan approfondi de notre relation, par exemple chaque année autour de notre anniversaire de mariage ?",
              "Triple recoupement avec 22.10 et 23.10 : ici, le bilan annuel approfondi."),
    "O30.7": ("Quels signes nous montreront, dans les années à venir, que nous avons besoin d'un accompagnement extérieur, et nous engageons-nous dès maintenant à le demander ?",
              "Doublon avec 9.10 : ajout d'un engagement anticipé."),
}

# Recoupements volontairement conservés (pas de reformulation) : signalés dans le journal.
CONSERVES = [
    ("O29.1 / O29.10", "Ouverture et clôture du thème sur la liberté du consentement : la répétition est volontaire."),
    ("O7.10 / thème 11", "La question d'origine introduit le thème « Sécurité, respect et consentement », qui l'approfondit."),
    ("O22.3 / O23.2", "La première porte sur la protection de l'agenda, la seconde sur le rendez-vous lui-même."),
    ("O14.4 / O25.3", "Images intimes d'un côté, messages privés en général de l'autre."),
]

T = {}

# ---------------------------------------------------------------- PARTIE I
T["O1"] = dict(
    titre="Vie personnelle et connaissance de soi",
    objectif="Se présenter tel que l'on est, sans se vendre ni se dévaloriser : valeurs, forces, limites, réactions sous pression, besoins. "
             "On ne peut offrir à l'autre que ce que l'on connaît de soi.",
    conseils=[
        "Répondez d'abord seul, par écrit, avant d'échanger : vous serez moins influencé par la réponse de l'autre.",
        "Après la réponse de votre fiancé(e), dites ce que vous avez compris avant de commenter.",
        "Évitez les étiquettes (« tu es toujours… ») : décrivez des situations précises.",
    ],
    refs=[
        ("Psaume 139.23-24", "Une prière pour être examiné par Dieu : la connaissance de soi commence par l'humilité, pas par l'introspection seule."),
        ("Romains 12.3", "Paul invite chacun à avoir de lui-même une opinion « sobre » : ni orgueil ni mépris de soi."),
        ("Proverbes 20.5", "« Les pensées dans le cœur de l'homme sont des eaux profondes » : il faut du temps et de l'intelligence pour les faire remonter."),
    ],
    accomp="Observez l'écart entre l'image que chacun donne de lui-même et ce que l'autre en dit. Un fiancé incapable de nommer un seul défaut, ou qui n'en voit que chez l'autre, mérite une attention particulière.",
    voir=["O8", "O9"],
)

T["O8"] = dict(
    titre="Blessures du passé et histoire personnelle",
    objectif="Identifier les expériences passées qui influencent la confiance, l'attachement et les réactions, et décider ensemble de ce qui doit être "
             "partagé, soigné ou protégé.",
    conseils=[
        "Chacun reste maître de son récit : on peut dire « c'est important, mais je ne suis pas prêt à en parler aujourd'hui ».",
        "Ne cherchez pas à réparer l'autre pendant la discussion : écoutez, remerciez pour la confiance.",
        "Toute information importante pour la sécurité, la santé ou les engagements légaux doit être partagée avant le mariage.",
    ],
    refs=[
        ("Psaume 34.19", "« L'Éternel est près de ceux qui ont le cœur brisé » : la foi n'oblige pas à nier la douleur."),
        ("2 Corinthiens 5.17", "Être une « nouvelle création » concerne l'identité en Christ ; cela ne signifie pas que les blessures disparaissent instantanément."),
        ("Genèse 42-45", "Joseph pardonne à ses frères, mais il vérifie d'abord leur changement : pardon et confiance ne se rétablissent pas au même rythme."),
    ],
    accomp="Un traumatisme, des violences subies ou un deuil non traversé ne relèvent pas seulement de l'accompagnement pastoral. Proposez une orientation vers un professionnel qualifié, sans en faire une condition humiliante.",
    voir=["O9", "N1", "N6"],
)

T["O9"] = dict(
    titre="Santé émotionnelle et bien-être",
    objectif="Parler des émotions, de la fatigue et de la santé mentale sans honte, et convenir de la manière de se soutenir sans s'épuiser.",
    conseils=[
        "Normalisez le sujet : demander de l'aide pour sa santé mentale est un acte de responsabilité, pas un manque de foi.",
        "Distinguez ce que le conjoint peut porter (écoute, présence) de ce qui demande une aide extérieure.",
        "Notez ensemble les noms de deux ou trois personnes ou services à contacter en cas de besoin.",
    ],
    refs=[
        ("1 Rois 19.1-8", "Élie, épuisé, souhaite mourir. Dieu ne le sermonne pas : il le fait dormir et manger avant de lui parler."),
        ("Marc 6.31", "Jésus invite ses disciples au repos : le repos fait partie de la vie fidèle."),
        ("Galates 6.2 et 6.5", "Porter les fardeaux les uns des autres, et pourtant chacun porte sa propre charge : la solidarité ne supprime pas la responsabilité personnelle."),
    ],
    accomp="Soyez attentif aux signes de dépression, d'anxiété sévère ou d'idées suicidaires. En cas de doute, orientez immédiatement vers un médecin ou un service d'urgence : cela ne relève pas de la préparation au mariage.",
    voir=["O8", "O21", "N6"],
)

T["O18"] = dict(
    titre="Langages de l'amour, affection et reconnaissance",
    objectif="Découvrir ce qui fait concrètement se sentir aimé chacun de vous, et apprendre à le dire au lieu de l'attendre.",
    conseils=[
        "Les « langages de l'amour » sont une grille de lecture populaire (G. Chapman), pas une science : utilisez-la comme point de départ, pas comme verdict.",
        "Donnez des exemples très concrets (« quand tu m'envoies un message à midi »).",
        "Respectez les gestes d'affection que l'autre ne souhaite pas, en public comme en privé.",
    ],
    refs=[
        ("1 Corinthiens 13.4-7", "Écrit à une Église divisée, pas spécifiquement pour un mariage : l'amour y est décrit par des actes, ce qui convient bien au couple."),
        ("Cantique des cantiques 2.14", "« Fais-moi voir ta figure, fais-moi entendre ta voix » : le désir d'être vu et entendu fait partie de l'amour."),
        ("Romains 12.10", "« Par honneur, usez de prévenances réciproques » : la reconnaissance se pratique."),
    ],
    accomp="Écoutez ce qui n'est pas dit : un fiancé qui dit « je n'ai besoin de rien » peut avoir appris à ne rien demander.",
    voir=["O23", "O13"],
)

# ---------------------------------------------------------------- PARTIE II
T["O2"] = dict(
    titre="Foi, conversion et convictions chrétiennes",
    objectif="Partager son chemin de foi, distinguer les convictions essentielles des préférences, et repérer les désaccords qui peuvent peser sur la vie commune.",
    conseils=[
        "Racontez votre histoire de foi plutôt que de réciter des doctrines.",
        "Classez vos convictions en trois catégories : essentielles, importantes, secondaires.",
        "Un désaccord de fond n'est pas forcément rédhibitoire, mais il doit être nommé avant le mariage.",
    ],
    refs=[
        ("1 Corinthiens 7.39", "Paul demande à la veuve qui se remarie que ce soit « dans le Seigneur » : c'est le texte le plus direct sur le choix d'un conjoint croyant."),
        ("2 Corinthiens 6.14", "Souvent appliqué au mariage, le texte vise plus largement les alliances avec l'idolâtrie : à lire dans son contexte."),
        ("Amos 3.3", "« Deux hommes marchent-ils ensemble sans en être convenus ? » Dans son contexte, une série de questions sur les causes et les effets : une image parlante, pas un commandement sur le mariage."),
    ],
    accomp="Vérifiez que la foi de chacun est personnelle, et non une adaptation pour plaire à l'autre ou à la famille.",
    voir=["O3", "O27"],
)

T["O3"] = dict(
    titre="Prière, méditation et vie spirituelle du couple",
    objectif="Imaginer une vie spirituelle commune réaliste, qui nourrit le couple sans devenir une obligation ni un outil de pression.",
    conseils=[
        "Commencez petit : une pratique tenue vaut mieux qu'un programme ambitieux abandonné.",
        "Respectez les différences de tempérament spirituel (silence, louange, étude, action).",
        "Distinguez « Dieu m'a dit » d'une conviction personnelle soumise au dialogue.",
    ],
    refs=[
        ("1 Pierre 3.7", "Pierre appelle les maris à honorer leur femme comme « cohéritière de la grâce de la vie » : la qualité de la relation et la prière sont liées."),
        ("Philippiens 4.6-7", "Présenter ses besoins à Dieu dans la prière, avec reconnaissance."),
        ("Ecclésiaste 4.9-12", "« Deux valent mieux qu'un » ; la « corde à trois fils » parle d'abord de solidarité humaine. Y voir Dieu est une lecture chrétienne ultérieure, belle mais secondaire."),
    ],
    accomp="Méfiez-vous d'un fiancé qui utilise la prière ou des « révélations » pour clore une discussion.",
    voir=["O2", "O5"],
)

T["O4"] = dict(
    titre="Vision, valeurs et projet de vie",
    objectif="Mettre des mots sur la vie que vous imaginez, vérifier qu'elle est compatible et prévoir comment arbitrer entre rêves personnels et projet commun.",
    conseils=[
        "Écrivez chacun votre « journée idéale dans dix ans », puis comparez.",
        "Distinguez les rêves (souhaitables) des conditions (non négociables).",
        "Gardez une place aux projets personnels : l'unité n'est pas l'uniformité.",
    ],
    refs=[
        ("Proverbes 16.9", "« Le cœur de l'homme médite sa voie, mais c'est l'Éternel qui dirige ses pas » : faire des projets avec humilité."),
        ("Jacques 4.13-15", "Une mise en garde contre l'arrogance des plans, pas contre la planification."),
        ("Proverbes 29.18", "Souvent cité pour parler de « vision », le mot désigne la révélation prophétique : à ne pas utiliser comme slogan de projet de vie."),
    ],
    accomp="Repérez les projets incompatibles présentés comme « à voir plus tard » (pays de résidence, enfants, carrière) : ils reviennent toujours.",
    voir=["O5", "O22"],
)

T["O5"] = dict(
    titre="Appel, dons et ministère",
    objectif="Clarifier l'appel et les engagements de chacun, et décider comment le service s'articulera avec la vie conjugale.",
    conseils=[
        "Dites ce que vous attendez concrètement de l'autre, pas seulement ce que vous ressentez.",
        "Un appel personnel engage le couple : il se discerne à deux.",
        "Prévoyez dès maintenant des limites mesurables (soirées, déplacements, disponibilité).",
    ],
    refs=[
        ("1 Pierre 4.10", "Chacun a reçu un don à mettre au service des autres : les deux conjoints, pas un seul."),
        ("Actes 18.2-3, 18, 26 ; Romains 16.3-4", "Priscille et Aquilas travaillent, se déplacent, enseignent et risquent leur vie ensemble : un modèle de service en couple."),
        ("1 Corinthiens 7.32-35", "Paul reconnaît que le mariage partage l'attention, « à cause de la détresse présente » (v. 26) : le couple n'est pas un obstacle au service, mais une réalité à intégrer."),
    ],
    accomp="Les couples en ministère sont exposés à l'épuisement et à l'isolement. Interrogez le plan de repos et le réseau de soutien.",
    voir=["O27", "O21"],
)

# ---------------------------------------------------------------- PARTIE III
T["O6"] = dict(
    titre="Communication et écoute",
    objectif="Comprendre comment chacun parle, écoute et se protège, et établir des règles simples pour des échanges respectueux.",
    conseils=[
        "Pratiquez la reformulation : « Si je comprends bien, tu dis que… » avant de répondre.",
        "Parlez en « je » (ce que je ressens, ce dont j'ai besoin) plutôt qu'en « tu » accusateur.",
        "Fixez ensemble trois règles de communication et écrivez-les.",
    ],
    refs=[
        ("Jacques 1.19", "« Prompt à écouter, lent à parler, lent à se mettre en colère. »"),
        ("Proverbes 18.13", "Répondre avant d'avoir écouté est une folie : la reformulation a des racines bibliques."),
        ("Éphésiens 4.29", "Des paroles qui « édifient » et « communiquent une grâce » à ceux qui les entendent."),
    ],
    accomp="Observez le couple pendant qu'il échange : qui parle, qui se tait, qui interrompt, qui cède toujours.",
    voir=["O7", "N1"],
)

T["O7"] = dict(
    titre="Gestion des conflits et pardon",
    objectif="Comprendre ses réflexes en conflit, apprendre à faire une pause et à réparer, et distinguer pardon, confiance et réconciliation.",
    conseils=[
        "Convenez d'un signal de pause et d'un délai pour reprendre (par exemple 30 minutes à 24 heures).",
        "Une réparation sincère comprend : reconnaître, regretter, réparer, changer.",
        "Tous les désaccords ne se résolvent pas : certains se gèrent durablement avec respect.",
    ],
    refs=[
        ("Éphésiens 4.26-27", "« Si vous vous mettez en colère, ne péchez point. » Ne pas laisser la colère s'installer ne veut pas dire tout régler avant minuit."),
        ("Colossiens 3.13", "Se pardonner « comme le Seigneur vous a pardonné »."),
        ("Romains 12.18", "« S'il est possible, autant que cela dépend de vous » : la paix a des conditions, et la sécurité en fait partie."),
    ],
    accomp="Faites la différence entre un conflit (deux personnes en désaccord) et une emprise (l'une a peur de l'autre). Dans le second cas, ne proposez pas de médiation de couple : voir le thème suivant.",
    voir=["O6", "N1"],
)

T["N1"] = dict(
    titre="Sécurité, respect et consentement",
    nouveau=True,
    objectif="Nommer clairement ce qui rend une relation sûre, distinguer un désaccord d'un comportement violent ou contrôlant, et affirmer que "
             "chaque décision importante, y compris dans l'intimité, repose sur un consentement libre.",
    alerte="Lisez d'abord ces questions seul. Si l'une d'elles réveille de la peur vis-à-vis de votre fiancé(e), ne l'abordez pas en couple : "
           "parlez-en d'abord à une personne de confiance ou à un service spécialisé.",
    conseils=[
        "La violence ne se limite pas aux coups : menaces, humiliations, isolement, contrôle de l'argent ou du téléphone en font partie.",
        "Le mariage ne crée aucun droit à disposer du corps, du temps ou des biens de l'autre sans son accord.",
        "Mettez la sécurité avant la réconciliation : on ne demande jamais à une personne de rester en danger pour « sauver » un couple.",
    ],
    refs=[
        ("Éphésiens 5.28-29", "« Nourrir et prendre soin » de l'autre comme de son propre corps : ce texte exclut toute violence."),
        ("Colossiens 3.19", "« Maris, aimez vos femmes, et ne vous aigrissez pas contre elles » : la dureté est explicitement condamnée."),
        ("1 Corinthiens 7.3-5", "Une autorité réciproque sur le corps et une abstention « d'un commun accord ». Paul y répond à un ascétisme excessif : le texte ne justifie aucune contrainte."),
        ("Proverbes 22.3 ; 1 Samuel 19.11-12", "« L'homme prudent voit le mal et se cache » ; David fuit la violence de Saül avec l'aide de Mikal : se protéger est conforme à l'Écriture."),
    ],
    accomp="Prévoyez un entretien individuel avec chaque fiancé. Peur, isolement, jalousie contrôlante ou menaces sont des signaux d'alerte : orientez vers un service spécialisé, sans confronter l'auteur présumé.",
    questions=[
        "Pour toi, qu'est-ce qui distingue un désaccord, même vif, d'un comportement violent ou contrôlant ?",
        "Quels comportements considères-tu comme des violences, au-delà des coups : insultes, menaces, humiliations, isolement, contrôle de l'argent, du téléphone ou des déplacements ?",
        "As-tu grandi dans un foyer où la violence, la peur ou l'humiliation étaient présentes, et comment cela t'a-t-il marqué ?",
        "Te sens-tu libre, dans notre relation, de dire non, d'exprimer un désaccord ou de voir tes proches sans craindre ma réaction ?",
        "Comment vérifierons-nous que chacun consent librement aux décisions importantes, sans pression, chantage affectif ni menace de rupture ?",
        "Comment comprenons-nous le consentement dans l'intimité conjugale, y compris le droit de dire non sans culpabilité ni représailles ?",
        "Que ferions-nous si l'un de nous sentait sa colère devenir dangereuse : quel signal d'arrêt, quel lieu de retrait, quelle aide ?",
        "Quels comportements justifieraient, selon nous, de mettre la sécurité en priorité (éloignement temporaire, aide extérieure) avant toute tentative de réconciliation ?",
        "Connaissons-nous les numéros d'urgence et d'écoute de notre pays, ainsi que des personnes de confiance à contacter en cas de danger ?",
        "Si l'un de nous subissait des violences, quelle aide attendrions-nous de notre Église, et comment réagirions-nous si un responsable minimisait la situation ?",
    ],
    voir=["O7", "O13"],
)

T["O28"] = dict(
    titre="Éthique, intégrité et décisions difficiles",
    objectif="Clarifier ce que chacun entend par honnêteté, ce qui briserait la confiance, et comment prendre ensemble des décisions moralement difficiles.",
    conseils=[
        "Distinguez vie privée (légitime) et secret (qui trompe l'autre sur un point qui le concerne).",
        "Faites la liste des sujets qui, découverts après le mariage, changeraient votre décision : abordez-les maintenant.",
        "Pour une décision difficile, écrivez les options, les conséquences et les valeurs en jeu.",
    ],
    refs=[
        ("Proverbes 10.9", "« Celui qui marche dans l'intégrité marche avec assurance. »"),
        ("Michée 6.8", "Pratiquer la justice, aimer la miséricorde, marcher humblement : trois repères pour les décisions difficiles."),
        ("Luc 16.10", "La fidélité dans les petites choses annonce la fidélité dans les grandes."),
    ],
    accomp="La transparence ne donne pas un droit de contrôle. Repérez les demandes de « tout savoir » qui ressemblent à de la surveillance.",
    voir=["N4", "N2"],
)

# ---------------------------------------------------------------- PARTIE IV
T["O12"] = dict(
    titre="Vie maritale, rôles et décisions",
    objectif="Exprimer sa compréhension des rôles dans le mariage chrétien, s'accorder sur la façon de prendre les décisions, et exclure toute lecture qui justifierait la domination.",
    conseils=[
        "Les chrétiens lisent différemment Éphésiens 5 (lectures dites complémentarienne et égalitaire) : nommez votre lecture et écoutez celle de l'autre.",
        "Quelle que soit votre lecture, vérifiez qu'elle se traduit par du service, de la protection et de la consultation réelle.",
        "Listez les décisions qui exigent l'accord des deux.",
    ],
    refs=[
        ("Genèse 1.27-28", "L'homme et la femme sont créés ensemble à l'image de Dieu et reçoivent ensemble la mission de gérer la création."),
        ("Genèse 2.18", "« Une aide semblable à lui » : le mot hébreu (ʿézer) est aussi employé pour Dieu lui-même (Psaume 121.2). Il n'indique pas l'infériorité."),
        ("Éphésiens 5.21-33", "Le passage s'ouvre sur la soumission mutuelle (v. 21) et décrit l'amour du mari sur le modèle du Christ qui se donne. Il ne fonde aucun droit de contrainte."),
        ("Marc 10.42-45", "Jésus oppose la domination des chefs des nations au service : « il n'en est pas de même au milieu de vous »."),
    ],
    accomp="Peu importe la lecture théologique du couple : demandez des exemples concrets de décisions passées. Qui a tranché ? L'autre a-t-il été écouté ?",
    voir=["N1", "O11"],
)

T["O13"] = dict(
    titre="Sexualité, intimité et attentes avant le mariage",
    objectif="Parler de sexualité avec respect et sans honte : attentes, craintes, limites avant le mariage, consentement et ajustements dans la durée.",
    conseils=[
        "Choisissez un moment calme et privé ; utilisez des mots simples et respectueux.",
        "Vérifiez vos idées auprès de sources fiables (médecin, sage-femme, livre recommandé) plutôt que de la pornographie ou de rumeurs.",
        "Le passé sexuel se partage dans la mesure utile à la confiance et à la santé, sans détails humiliants.",
    ],
    refs=[
        ("Cantique des cantiques", "Un livre entier qui célèbre le désir, la beauté et le plaisir partagé, dans la réciprocité."),
        ("1 Corinthiens 7.2-5", "Une sexualité conjugale mutuelle, où chacun se donne à l'autre et où l'abstention se décide d'un commun accord."),
        ("Proverbes 5.18-19", "« Fais ta joie de la femme de ta jeunesse » : la joie sexuelle dans le mariage est bénie."),
    ],
    accomp="La douleur, l'anxiété ou des blocages persistants relèvent souvent d'une aide médicale ou d'un sexologue. Proposez une orientation sans dramatiser.",
    voir=["O14", "N1", "N2"],
)

T["O14"] = dict(
    titre="Santé sexuelle, limites et sécurité intime",
    objectif="Aborder les aspects médicaux, numériques et relationnels de la sexualité pour protéger la santé, la confiance et l'intimité de chacun.",
    conseils=[
        "Un dépistage proposé aux deux est un acte de soin mutuel, pas une accusation.",
        "Parlez de la pornographie en termes de conséquences sur la relation, pas seulement de culpabilité.",
        "Décidez ensemble de ce qui reste strictement entre vous.",
    ],
    refs=[
        ("1 Corinthiens 6.18-20", "Le corps est « le temple du Saint-Esprit » ; dans son contexte, Paul s'adresse à des chrétiens qui fréquentaient la prostitution à Corinthe."),
        ("1 Thessaloniciens 4.3-5", "Savoir posséder son corps « dans la sainteté et l'honnêteté », sans convoitise passionnée."),
        ("Hébreux 13.4", "« Que le mariage soit honoré de tous, et le lit conjugal exempt de souillure. »"),
    ],
    accomp="Un usage compulsif de la pornographie relève aussi du thème « Dépendances ». Ne le traitez pas seulement comme un péché ponctuel.",
    voir=["O13", "N3", "O25"],
)

T["N2"] = dict(
    titre="Fidélité, infidélité et restauration de la confiance",
    nouveau=True,
    objectif="Parler de la fidélité avant qu'elle ne soit menacée : comment se protéger, comment réagir à une trahison et ce que suppose la reconstruction de la confiance.",
    conseils=[
        "Ces questions ne sont pas un soupçon : elles préparent le couple à ce qui fragilise beaucoup de mariages.",
        "Un passé de trahison (subie ou commise) se partage sans détail inutile, mais il se partage.",
        "Aucun manque dans le couple n'excuse une infidélité ; mais nommer ses besoins aide à la prévenir.",
    ],
    refs=[
        ("Malachie 2.14-15", "Le mariage est une alliance dont Dieu est témoin : « que personne ne soit infidèle à la femme de sa jeunesse »."),
        ("2 Samuel 11", "La chute de David suit une pente : oisiveté, regard, renseignement, invitation. La plupart des infidélités commencent par de petites étapes."),
        ("Matthieu 19.3-9 ; 1 Corinthiens 7.10-15", "Jésus et Paul abordent le divorce ; les Églises en tirent des positions différentes. Renseignez-vous sur celle de votre communauté."),
        ("Osée 1-3", "Une image prophétique de la fidélité de Dieu malgré l'infidélité de son peuple. Ce n'est pas une obligation imposée au conjoint trompé de tout supporter."),
    ],
    accomp="Après une infidélité révélée, ne pressez pas le pardon. Proposez un accompagnement spécialisé et un dépistage médical ; vérifiez qu'aucune violence n'accompagne la crise.",
    questions=[
        "Quelles petites étapes (confidences, rencontres seul à seul, messages, secrets) peuvent préparer une infidélité, et comment les repérer tôt ?",
        "As-tu déjà été trompé, ou as-tu déjà trompé quelqu'un ? Qu'en as-tu appris, et quelles fragilités cela laisse-t-il ?",
        "Quelles protections concrètes voulons-nous adopter (transparence, déplacements, relations professionnelles) sans tomber dans la surveillance ?",
        "Si l'un de nous ressentait une attirance pour une autre personne, comment souhaiterions-nous en parler, et à qui ?",
        "Si l'un de nous découvrait une infidélité, quelles premières étapes suivrions-nous, et quelles décisions éviterions-nous de prendre dans l'urgence ?",
        "Quelle différence faisons-nous entre pardonner une trahison, rétablir la confiance et décider de poursuivre la vie commune ?",
        "Quels actes concrets attendrions-nous d'un conjoint infidèle pour reconstruire la confiance (vérité complète, rupture du lien, accompagnement, patience) ?",
        "Que comprenons-nous de l'enseignement biblique sur l'adultère, le pardon et le divorce, et quelle est la position de notre Église ?",
        "Comment protégerions-nous la santé de chacun (dépistage, suivi médical) si une infidélité sexuelle survenait ?",
        "Quels besoins non exprimés (solitude, manque de reconnaissance, routine) voulons-nous surveiller pour qu'ils ne deviennent pas une brèche, sans jamais en faire une excuse ?",
    ],
    voir=["O25", "O28", "O14"],
)

T["O25"] = dict(
    titre="Amis, réseaux sociaux et limites relationnelles",
    objectif="Préserver des amitiés saines et une vie sociale, tout en fixant des limites claires qui protègent la confiance et l'intimité du couple.",
    conseils=[
        "Parlez de situations précises (un ami du sexe opposé, un ex, un collègue) plutôt que de principes généraux.",
        "La jalousie se dit, elle ne se transforme pas en contrôle du téléphone.",
        "Décidez ensemble de ce qui peut être publié sur votre couple.",
    ],
    refs=[
        ("Proverbes 13.20", "« Celui qui fréquente les sages devient sage » : nos amitiés nous façonnent."),
        ("Proverbes 27.17", "« Comme le fer aiguise le fer » : de bons amis font grandir, y compris le couple."),
        ("Proverbes 4.23", "« Garde ton cœur plus que toute autre chose » : vigilance sur ce qui nourrit nos attachements."),
    ],
    accomp="Un fiancé qui exige d'isoler l'autre de tous ses amis présente un signal d'alerte (voir thème « Sécurité »).",
    voir=["N2", "N1"],
)

# ---------------------------------------------------------------- PARTIE V
T["O21"] = dict(
    titre="Santé, hygiène et mode de vie",
    objectif="Partager les informations de santé utiles, s'accorder sur un mode de vie qui prend soin du corps, et se préparer aux périodes de maladie.",
    conseils=[
        "Un bilan médical avant le mariage est une bonne pratique, pas un examen de passage.",
        "Respectez l'autonomie de chacun dans ses décisions de santé.",
        "Parlez de la santé mentale comme de la santé physique : sans honte.",
    ],
    refs=[
        ("1 Corinthiens 6.19-20", "Glorifier Dieu dans son corps : prendre soin de soi a une dimension spirituelle."),
        ("1 Timothée 5.23", "Paul conseille à Timothée un remède pour son estomac : la foi et les soins ne s'opposent pas."),
        ("Luc 5.31", "« Ce ne sont pas ceux qui se portent bien qui ont besoin de médecin » : Jésus prend l'image médicale comme une évidence."),
    ],
    accomp="Si un fiancé cache une maladie importante, encouragez la révélation avant le mariage, avec l'aide d'un médecin si nécessaire.",
    voir=["N3", "N6", "O9"],
)

T["N3"] = dict(
    titre="Dépendances et comportements compulsifs",
    nouveau=True,
    objectif="Parler sans tabou de l'alcool, des drogues, des jeux d'argent, de la pornographie, des écrans ou des achats compulsifs, repérer les signes d'une dépendance "
             "et convenir de l'aide à rechercher.",
    conseils=[
        "Une dépendance est à la fois une question spirituelle, psychologique et médicale : aucune de ces dimensions ne suffit seule.",
        "La honte pousse à cacher ; l'honnêteté sur une rechute est une force, pas un échec.",
        "Le conjoint n'est ni le policier ni le thérapeute de l'autre.",
    ],
    refs=[
        ("1 Corinthiens 6.12", "« Je ne me laisserai asservir par quoi que ce soit » : la liberté chrétienne refuse toute servitude."),
        ("Proverbes 23.29-35", "Une description saisissante de l'ivrognerie : ses dégâts et son cercle vicieux (« j'en veux encore », v. 35)."),
        ("Jacques 5.16", "« Confessez vos péchés les uns aux autres, et priez les uns pour les autres, afin que vous soyez guéris. »"),
    ],
    accomp="Une dépendance active (alcool, drogue, jeu) justifie en général de reporter la date du mariage jusqu'à une période de stabilité accompagnée. Orientez vers un addictologue ou un groupe d'entraide.",
    questions=[
        "As-tu, ou as-tu eu, une relation difficile avec l'alcool, le tabac, une drogue, un médicament, les jeux d'argent, la pornographie, les écrans ou les achats ?",
        "Y a-t-il dans ta famille des dépendances qui ont marqué ton enfance ou ta manière de réagir aujourd'hui ?",
        "Quels signes nous indiqueraient qu'une habitude devient une dépendance (perte de contrôle, mensonges, dépenses cachées, irritabilité, isolement) ?",
        "Comment parler d'une rechute ou d'une difficulté sans qu'elle soit cachée par honte, ni minimisée ?",
        "Quel accompagnement accepterais-tu si une dépendance apparaissait : médecin, addictologue, groupe d'entraide, accompagnement pastoral ?",
        "Quelles limites posons-nous dès maintenant (alcool à la maison, paris, jeux en ligne, achats à crédit) ?",
        "Comment éviterons-nous que l'un devienne le surveillant ou le sauveur de l'autre ?",
        "Que ferions-nous si une dépendance mettait en danger la sécurité, les finances ou les enfants du foyer ?",
        "Comment distinguons-nous la lutte spirituelle, la responsabilité personnelle et le besoin de soins médicaux ?",
        "Si l'un de nous lutte actuellement contre une dépendance, quelles conditions (stabilité, suivi, transparence) jugeons-nous nécessaires avant de nous engager ?",
    ],
    voir=["O21", "O14", "N4"],
)

T["N6"] = dict(
    titre="Deuil, handicap et maladie au long cours",
    nouveau=True,
    objectif="Partager la manière dont chacun vit la perte et la souffrance, préparer le couple à traverser un deuil, un handicap ou une maladie durable, "
             "et protéger le conjoint qui devient aidant.",
    conseils=[
        "Chacun vit le deuil à son rythme : il n'y a pas de bonne durée ni de bonne manière.",
        "Si l'un de vous vit avec un handicap ou une maladie, laissez-le décrire lui-même son quotidien.",
        "Parler de la fin de vie n'attire pas le malheur : c'est un acte d'amour envers celui qui restera.",
    ],
    refs=[
        ("Jean 11.33-35", "Jésus pleure devant la tombe de Lazare, alors même qu'il va le ressusciter : la tristesse n'est pas un manque de foi."),
        ("1 Thessaloniciens 4.13", "Ne pas être triste « comme les autres qui n'ont point d'espérance » : l'espérance transforme le deuil, elle ne l'interdit pas."),
        ("Jean 9.1-3", "Jésus refuse de lier le handicap à une faute : « ni lui ni ses parents n'ont péché »."),
        ("2 Samuel 9", "David accueille Mephibosheth, infirme, à sa table « comme l'un des fils du roi » : la dignité n'est pas conditionnée par la santé."),
    ],
    accomp="Le deuil compliqué (tristesse invalidante après de longs mois) et l'épuisement de l'aidant sont fréquents et relèvent d'un soutien professionnel.",
    questions=[
        "Quels deuils as-tu traversés, et qu'est-ce qui t'a aidé ou blessé à ce moment-là ?",
        "Comment exprimes-tu ta tristesse : larmes, silence, activité, besoin de parler ou de solitude ?",
        "Comment soutiendrons-nous l'autre lors du décès d'un parent ou d'un proche, sans imposer notre propre rythme de deuil ?",
        "Si tu vis avec un handicap, une maladie chronique ou un trouble invisible, que souhaites-tu que je comprenne de ton quotidien ?",
        "Comment éviterons-nous que l'un devienne seulement « l'aidant » et l'autre seulement « l'aidé », en restant d'abord des époux ?",
        "Quelles adaptations (logement, travail, finances, intimité) envisagerions-nous si un handicap survenait après un accident ou une maladie ?",
        "Comment prendrons-nous soin de celui qui aide, pour éviter l'épuisement ?",
        "Avons-nous parlé de nos souhaits concernant la fin de vie, les soins, le don d'organes et les funérailles ?",
        "Quelles dispositions (testament, assurance, tutelle des enfants, accès aux comptes) protégeraient le conjoint survivant ?",
        "Comment notre espérance chrétienne nous aidera-t-elle à traverser la souffrance sans nier la tristesse ni presser l'autre de « tourner la page » ?",
    ],
    voir=["O21", "O8", "N8"],
)

# ---------------------------------------------------------------- PARTIE VI
T["O10"] = dict(
    titre="Vie professionnelle, études et carrière",
    objectif="Partager ses ambitions professionnelles, anticiper les arbitrages entre carrière et vie de couple, et se préparer aux changements imprévus.",
    conseils=[
        "Parlez du sens que le travail a pour vous, pas seulement du poste visé.",
        "Envisagez des scénarios concrets : mutation, chômage, reprise d'études, création d'entreprise.",
        "Une carrière n'a pas automatiquement priorité sur l'autre : décidez des critères d'arbitrage.",
    ],
    refs=[
        ("Genèse 2.15", "Le travail existe avant la chute : il fait partie de la vocation humaine."),
        ("Colossiens 3.23", "Travailler « de bon cœur, comme pour le Seigneur »."),
        ("Exode 20.8-10 ; Psaume 127.2", "Le repos est commandé ; il est vain de « se lever matin et se coucher tard » par anxiété."),
    ],
    accomp="Interrogez les déséquilibres probables (horaires, déplacements, travail de nuit) et les attentes implicites sur qui « s'adaptera ».",
    voir=["O11", "O22", "O24"],
)

T["O11"] = dict(
    titre="Finances, budget et patrimoine",
    objectif="Mettre à plat la situation financière de chacun, choisir une organisation commune et fixer des règles de décision claires.",
    conseils=[
        "Apportez des chiffres réels (revenus, charges, dettes) : les impressions ne suffisent pas.",
        "Parlez de l'histoire familiale de l'argent : elle explique beaucoup de réactions.",
        "Établissez un premier budget mensuel ensemble avant le mariage.",
    ],
    refs=[
        ("Luc 14.28-30", "Calculer la dépense avant de bâtir : Jésus parle du coût du disciple, mais l'image suppose une planification réaliste."),
        ("Proverbes 22.7", "« Celui qui emprunte est l'esclave de celui qui prête » : la dette limite la liberté."),
        ("1 Timothée 6.6-10 ; 2 Corinthiens 9.7", "Le contentement, la mise en garde contre l'amour de l'argent et la générosité joyeuse."),
    ],
    accomp="Un refus de montrer ses comptes ou une gestion exclusive par un seul conjoint sont des signaux à explorer (voir thème suivant).",
    voir=["N4", "O17", "O12"],
)

T["N4"] = dict(
    titre="Transparence financière et secrets d'argent",
    nouveau=True,
    objectif="Prévenir les secrets financiers et le contrôle économique : savoir ce qui doit être partagé, comment garantir l'accès de chacun aux ressources "
             "et comment réagir à une mauvaise découverte.",
    conseils=[
        "Avoir un peu d'argent personnel est légitime ; cacher une dette ou un compte ne l'est pas.",
        "Le contrôle économique (priver l'autre d'argent, l'empêcher de travailler, exiger des justificatifs humiliants) est une forme de violence.",
        "Chacun doit pouvoir gérer seul les finances du foyer en cas de besoin.",
    ],
    refs=[
        ("Actes 5.1-11", "Le péché d'Ananias et Saphira n'est pas d'avoir gardé une part (« s'il n'avait pas été vendu, ne te restait-il pas ? », v. 4), mais d'avoir menti ensemble."),
        ("Proverbes 6.1-5", "Une mise en garde urgente contre le fait de se porter caution à la légère."),
        ("Luc 16.10-11", "La fidélité dans la gestion de l'argent révèle la fidélité dans le reste."),
    ],
    accomp="Proposez un échange de documents (relevés, contrats de crédit) en présence d'un conseiller si la confiance est fragile. Un contrôle économique doit être traité comme un signal de violence.",
    questions=[
        "Serais-tu d'accord pour que nous échangions nos documents financiers (relevés, contrats de crédit, échéanciers) avant le mariage ?",
        "As-tu déjà caché une dépense, un compte, un revenu ou une dette à un proche ? Pourquoi ?",
        "Quelle différence fais-tu entre une autonomie financière légitime et un secret qui fragilise la confiance ?",
        "Que considérerais-tu comme une trahison financière ?",
        "Qui aura accès aux comptes, codes, contrats et documents, et comment éviter qu'un seul de nous contrôle tout ?",
        "Comment nous engageons-nous à refuser toute forme de contrôle économique : priver l'autre d'argent, l'empêcher de travailler, exiger des justificatifs humiliants ?",
        "As-tu envers ta famille des engagements financiers (envois réguliers, soutien d'un parent, études d'un frère ou d'une sœur) que tu n'as pas encore mentionnés ?",
        "Comment réagirions-nous si l'un de nous découvrait une dette ou une dépense cachée après le mariage ?",
        "Quelles règles adopterons-nous avant de prêter de l'argent, de nous porter caution ou d'investir dans un projet proposé par un proche ?",
        "Chacun de nous serait-il capable de connaître et de gérer seul la situation financière du foyer si l'autre était indisponible (maladie, décès, absence) ?",
    ],
    voir=["O11", "O28", "N1"],
)

# ---------------------------------------------------------------- PARTIE VII
T["O19"] = dict(
    titre="Préférences, habitudes et vie quotidienne",
    objectif="Découvrir les habitudes, rythmes et préférences de chacun pour anticiper les frictions ordinaires de la vie commune.",
    conseils=[
        "Ce thème est plus léger : profitez-en pour rire de vos différences.",
        "Les petits agacements répétés usent un couple : nommez-les tôt et sans mépris.",
        "Cherchez des arrangements pratiques plutôt qu'un « vainqueur ».",
    ],
    refs=[
        ("Romains 14.1-5", "Sur les questions secondaires, chacun peut avoir sa conviction sans juger l'autre."),
        ("Romains 15.7", "« Accueillez-vous donc les uns les autres, comme Christ vous a accueillis. »"),
        ("Colossiens 3.12-14", "Douceur, patience, support mutuel : des vertus très quotidiennes."),
    ],
    accomp="Les différences de rythme sont rarement graves ; le mépris envers ces différences l'est davantage.",
    voir=["O20", "O23"],
)

T["O20"] = dict(
    titre="Ménage, tâches domestiques et organisation",
    objectif="Répartir les tâches visibles et invisibles de manière juste, révisable et adaptée aux saisons de la vie.",
    conseils=[
        "Faites la liste complète des tâches, y compris la « charge mentale » (penser, prévoir, rappeler).",
        "Répartissez selon les compétences, les disponibilités et l'équité, pas seulement selon les habitudes familiales.",
        "Prévoyez une date pour réviser la répartition.",
    ],
    refs=[
        ("Jean 13.12-15", "Jésus lave les pieds de ses disciples : aucune tâche n'est indigne de celui qui aime."),
        ("Philippiens 2.3-4", "Regarder aussi aux intérêts des autres."),
        ("Proverbes 31.10-31", "Un poème acrostiche qui célèbre une femme sage et entreprenante. Ce n'est ni une liste de tâches imposées aux épouses ni un idéal inaccessible."),
    ],
    accomp="Interrogez les modèles familiaux : celui qui n'a jamais vu son père cuisiner, par exemple, risque de reproduire ce schéma sans y penser.",
    voir=["O19", "O22"],
)

T["O22"] = dict(
    titre="Temps, priorités et équilibre",
    objectif="Hiérarchiser ses priorités, protéger du temps pour le couple et apprendre à dire non aux sollicitations qui épuisent.",
    conseils=[
        "Comparez vos agendas réels de la semaine passée avec les priorités que vous affichez.",
        "Choisissez un critère simple pour accepter un nouvel engagement.",
        "Planifiez le repos comme un rendez-vous.",
    ],
    refs=[
        ("Ecclésiaste 3.1-8", "« Il y a un temps pour tout » : les priorités changent selon les saisons de la vie."),
        ("Psaume 90.12", "« Enseigne-nous à bien compter nos jours. »"),
        ("Éphésiens 5.15-16", "Marcher avec sagesse en « rachetant le temps »."),
    ],
    accomp="L'écart entre priorités déclarées et agenda réel est souvent révélateur.",
    voir=["O10", "O23", "O5"],
)

T["O23"] = dict(
    titre="Routines, rituels et rendez-vous de couple",
    objectif="Créer des habitudes simples qui entretiennent la relation : rituels quotidiens, rendez-vous, célébrations, réconciliations.",
    conseils=[
        "Choisissez un rituel quotidien de cinq minutes et un rendez-vous mensuel.",
        "Les rituels de réparation après un conflit sont aussi importants que les rituels de fête.",
        "Adaptez vos rituels aux saisons (naissance, maladie, déménagement) plutôt que de les abandonner.",
    ],
    refs=[
        ("Josué 4.1-7", "Les pierres du Jourdain servent de mémorial : se souvenir ensemble de la fidélité de Dieu."),
        ("Deutéronome 6.6-7", "Transmettre au fil des gestes quotidiens : en se levant, en se couchant, en marchant."),
        ("Ecclésiaste 9.9", "« Jouis de la vie avec la femme que tu aimes » : la joie partagée est un don."),
    ],
    accomp="Un couple sans aucun rituel commun avant le mariage en aura rarement après sans effort délibéré.",
    voir=["O18", "O22", "O30"],
)

T["O24"] = dict(
    titre="Voyages, mobilité et changements de lieu",
    objectif="Préciser ses attentes sur les voyages, les déménagements et les séparations temporaires, et décider ensemble des conditions d'un changement de lieu.",
    conseils=[
        "Distinguez le désir de voyager du projet de s'installer ailleurs.",
        "Évaluez un déménagement selon ses effets sur chacun, pas seulement sur celui qui en profite.",
        "Prévoyez comment garder le lien pendant les séparations.",
    ],
    refs=[
        ("Genèse 12.1-5", "Abram part avec Saraï : l'appel engage le couple entier."),
        ("Ruth 1.16-17", "Souvent lu lors des mariages, ce serment est celui de Ruth à sa belle-mère Naomi : un bel exemple de fidélité, pas un vœu conjugal."),
        ("Jérémie 29.7", "Rechercher le bien de la ville où l'on vit, même loin de chez soi."),
    ],
    accomp="Un projet d'expatriation ou de migration mérite une discussion approfondie (statut légal, réseau, emploi du conjoint).",
    voir=["O10", "O5"],
)

# ---------------------------------------------------------------- PARTIE VIII
T["O17"] = dict(
    titre="Famille élargie et belle-famille",
    objectif="Clarifier la place des familles d'origine, organiser les relations avec la belle-famille et poser des limites respectueuses.",
    conseils=[
        "Parlez de votre famille avec respect, même quand vous évoquez ses défauts.",
        "Chacun est en principe le premier interlocuteur de sa propre famille.",
        "Les limites protègent les relations : elles ne sont pas un rejet.",
    ],
    refs=[
        ("Genèse 2.24", "« L'homme quittera son père et sa mère et s'attachera à sa femme » : une nouvelle priorité, pas une rupture."),
        ("Exode 20.12", "Honorer ses parents reste un commandement tout au long de la vie."),
        ("Exode 18.13-24", "Jéthro conseille son gendre Moïse avec sagesse ; Moïse écoute, puis décide : un modèle de relation saine avec la belle-famille."),
    ],
    accomp="Écoutez la manière dont chacun parle de sa belle-famille future : mépris, peur ou soumission totale sont à explorer.",
    voir=["N7", "O26", "O11"],
)

T["N7"] = dict(
    titre="Limites familiales, loyautés et familles recomposées",
    nouveau=True,
    objectif="Repérer les loyautés familiales qui pourraient concurrencer le couple, préparer la réponse aux pressions de l'entourage et organiser, le cas échéant, "
             "la vie d'une famille recomposée.",
    conseils=[
        "« Honorer » ses parents ne signifie pas leur obéir dans ce qui relève désormais du foyer.",
        "Préparez à l'avance des phrases simples pour poser une limite avec respect.",
        "En famille recomposée, l'intérêt des enfants et la relation avec l'autre parent demandent une attention particulière.",
    ],
    refs=[
        ("Marc 7.9-13", "Jésus reproche d'utiliser une règle religieuse pour ne pas aider ses parents : honorer, c'est aussi soutenir concrètement."),
        ("Genèse 31", "Jacob et Laban : manipulations, dettes et loyautés familiales. Rachel et Léa finissent par choisir leur foyer (v. 14-16)."),
        ("Éphésiens 6.1-3", "L'obéissance est demandée aux enfants ; l'honneur dû aux parents demeure à l'âge adulte, sous une autre forme."),
    ],
    accomp="Une famille qui s'oppose au mariage, exige une contrepartie financière excessive ou menace un fiancé est un facteur de risque à prendre au sérieux, y compris pour la sécurité.",
    questions=[
        "Que signifie pour toi « quitter son père et sa mère », concrètement, dans notre culture ?",
        "Envers qui ressens-tu une dette ou une loyauté qui pourrait entrer en concurrence avec notre couple ?",
        "Ta famille approuve-t-elle notre union ? Sinon, comment cela pèse-t-il sur toi et sur ta décision ?",
        "Envisages-tu de vivre avec un membre de ta famille, ou tout près ? À quelles conditions ?",
        "Comment réagirons-nous si un parent exige d'être consulté pour nos décisions (logement, enfants, argent, travail) ?",
        "Quelles attentes pèsent, dans nos cultures, sur le rôle de « belle-fille » ou de « gendre », et lesquelles acceptons-nous ?",
        "Comment ferons-nous face à un membre de la famille violent, manipulateur ou dépendant ?",
        "Qui de nous deux parlera à sa propre famille en cas de difficulté avec elle ?",
        "Comment honorerons-nous nos parents sans leur obéir dans ce qui relève désormais de notre foyer ?",
        "Si l'un de nous a déjà des enfants, comment organiserons-nous la vie de famille recomposée et la relation avec l'autre parent ?",
    ],
    voir=["O17", "O26", "O8"],
)

T["O26"] = dict(
    titre="Culture, traditions et identité du foyer",
    objectif="Identifier les traditions et attentes culturelles de chaque famille, et choisir ensemble ce que votre foyer garde, adapte ou laisse de côté.",
    conseils=[
        "Valorisez vos cultures : l'Évangile ne les efface pas, il les éclaire.",
        "Distinguez ce qui relève de la foi de ce qui relève de la coutume.",
        "Fixez un budget pour les obligations coutumières avant qu'elles ne s'imposent.",
    ],
    refs=[
        ("Actes 15", "Le concile de Jérusalem distingue l'essentiel de l'Évangile des usages culturels : une méthode utile pour les couples."),
        ("Galates 3.28", "En Christ, les différences d'origine ne créent aucune hiérarchie."),
        ("Apocalypse 7.9", "Une foule de toutes nations et de toutes langues : la diversité culturelle a sa place jusque dans l'adoration finale."),
    ],
    accomp="Les exigences liées à la dot ou aux cérémonies peuvent créer dettes et tensions. Encouragez le couple à négocier ensemble et à l'avance.",
    voir=["O17", "N7", "O29"],
)

T["O15"] = dict(
    titre="Enfants, fertilité et parentalité",
    objectif="Partager son désir (ou non) d'enfants, anticiper les imprévus et poser les bases d'une parentalité partagée.",
    conseils=[
        "Un désaccord sur le fait d'avoir des enfants est majeur : il ne doit pas être reporté après le mariage.",
        "Parlez de la répartition concrète (nuits, congés, carrière) et pas seulement des valeurs.",
        "Renseignez-vous sur la loi de votre pays en matière d'éducation et de protection de l'enfance.",
    ],
    refs=[
        ("Psaume 127.3", "« Les fils sont un héritage de l'Éternel » : les enfants sont un don, non un dû."),
        ("Marc 10.13-16", "Jésus accueille les enfants et s'indigne qu'on les écarte."),
        ("Genèse 1.28", "La bénédiction « soyez féconds » est adressée à l'humanité ; elle ne fait pas de l'infertilité une faute."),
    ],
    accomp="Vérifiez que les deux fiancés ont exprimé leur propre désir, et pas seulement celui de leur famille.",
    voir=["N5", "O16"],
)

T["N5"] = dict(
    titre="Infertilité, deuil périnatal et autres chemins de fécondité",
    nouveau=True,
    objectif="Se préparer ensemble à l'éventualité d'une infertilité, d'une fausse couche ou de la perte d'un enfant, et réfléchir aux autres formes de fécondité.",
    conseils=[
        "L'infertilité concerne le couple : elle n'est la « faute » de personne.",
        "Les remarques de l'entourage peuvent blesser profondément : préparez une réponse commune.",
        "Les décisions médicales se prennent avec un médecin et dans le respect des convictions de chacun.",
    ],
    refs=[
        ("1 Samuel 1.1-20", "Anne pleure et prie ; son mari Elqana l'aime mais minimise sa peine (« ne suis-je pas pour toi mieux que dix fils ? », v. 8). L'amour ne suffit pas à consoler : il faut aussi écouter."),
        ("Genèse 30.1-2", "Rachel accuse Jacob, qui répond avec colère : un exemple de la manière dont la souffrance peut dresser les époux l'un contre l'autre."),
        ("Luc 1.6-7, 25", "Zacharie et Élisabeth sont « justes devant Dieu » et pourtant sans enfant : l'infertilité n'est pas un jugement. Élisabeth parle de « l'opprobre » social qu'elle a subi."),
        ("Ésaïe 56.3-5", "Dieu promet à l'eunuque « un nom meilleur que des fils et des filles » : la valeur d'une vie ne dépend pas de sa descendance."),
    ],
    accomp="Proposez des ressources spécialisées (gynécologue, psychologue, associations de parents endeuillés) et protégez le couple des injonctions communautaires.",
    questions=[
        "Comment notre mariage garderait-il tout son sens si nous ne pouvions pas avoir d'enfant ?",
        "Comment nous soutiendrions-nous lors d'une fausse couche ou de la perte d'un enfant ?",
        "Comment éviterons-nous de faire porter la « faute » à l'un de nous en cas d'infertilité ?",
        "Comment répondrions-nous aux remarques ou pressions de la famille, de l'Église ou de la communauté sur l'absence d'enfant ?",
        "Quelle place l'adoption, le parrainage, l'accueil familial ou d'autres formes de fécondité pourraient-ils avoir dans notre projet ?",
        "Que ferions-nous si l'un de nous désirait un enfant beaucoup plus fortement que l'autre, ou changeait d'avis avec le temps ?",
        "Comment protégerions-nous notre intimité pendant des démarches médicales longues et éprouvantes ?",
        "Quelles limites financières, physiques et émotionnelles fixerions-nous pour d'éventuels traitements ?",
        "Comment accueillerions-nous un enfant porteur d'un handicap ou d'une maladie grave ?",
        "Qui pourrait nous accompagner dans ces épreuves (médecin, psychologue, couple ayant vécu la même chose, pasteur) ?",
    ],
    voir=["O15", "N6", "O13"],
)

T["O16"] = dict(
    titre="Éducation, discipline et transmission",
    objectif="S'accorder sur les grandes lignes de l'éducation : autorité, encouragement, foi, écrans, sexualité, place des grands-parents.",
    conseils=[
        "Partez de vos propres souvenirs d'enfance : ce que vous voulez reproduire, ce que vous voulez éviter.",
        "Aucune méthode éducative ne justifie la violence ou l'humiliation.",
        "Prévoyez comment trancher un désaccord éducatif sans vous opposer devant l'enfant.",
    ],
    refs=[
        ("Éphésiens 6.4 ; Colossiens 3.21", "« N'irritez pas vos enfants, de peur qu'ils ne se découragent » : l'autorité parentale a une limite claire."),
        ("Proverbes 22.6", "« Instruis l'enfant selon la voie qu'il doit suivre » : un proverbe énonce une sagesse générale, pas une garantie de résultat."),
        ("2 Timothée 1.5", "La foi de Timothée lui a été transmise par sa grand-mère Loïs et sa mère Eunice : la transmission passe par l'exemple."),
        ("Proverbes 13.24", "Le mot « verge » y est lu littéralement par certains, comme une image de la correction par d'autres. Aucune lecture n'autorise à frapper ou humilier un enfant ; en France, la loi interdit les violences éducatives (loi du 10 juillet 2019)."),
    ],
    accomp="Si un fiancé défend des châtiments corporels, ouvrez le dialogue sur la loi, le développement de l'enfant et les alternatives, sans caricaturer sa position.",
    voir=["O15", "O27"],
)

T["O27"] = dict(
    titre="Église, communauté et service",
    objectif="Choisir une communauté, fixer la place de l'engagement ecclésial et garder une liberté de conscience face aux responsables.",
    conseils=[
        "Si vous venez d'Églises différentes, visitez ensemble chacune d'elles avant de décider.",
        "Un bon conseil spirituel éclaire votre décision ; il ne la prend pas à votre place.",
        "Parlez aussi des blessures éventuelles vécues dans une Église.",
    ],
    refs=[
        ("Hébreux 10.24-25", "Ne pas abandonner l'assemblée : s'exhorter mutuellement à l'amour et aux bonnes œuvres."),
        ("1 Pierre 5.2-3", "Les responsables doivent paître le troupeau « non en dominant », mais en étant des modèles."),
        ("3 Jean 9-10 ; Actes 17.11", "Diotrèphe abuse de son autorité ; les Béréens vérifient ce qu'on leur enseigne : l'Écriture prévoit le discernement face aux responsables."),
    ],
    accomp="Respectez la liberté du couple. Si votre rôle de pasteur crée une pression (mariage dans votre Église, engagement attendu), nommez-la.",
    voir=["O2", "O5", "O3"],
)

# ---------------------------------------------------------------- PARTIE IX
T["N8"] = dict(
    titre="Crises, urgences et imprévus de la vie",
    nouveau=True,
    objectif="Se préparer à traverser ensemble les crises (accident, perte de logement, crise de foi, crise de couple) avec un minimum d'organisation et un engagement clair.",
    conseils=[
        "Préparer une crise ne la provoque pas : c'est une manière de s'aimer à l'avance.",
        "Rassemblez les informations essentielles dans un dossier connu des deux.",
        "En cas de crise de couple, convenez dès maintenant des étapes à suivre avant toute décision définitive.",
    ],
    refs=[
        ("Matthieu 7.24-27", "La maison bâtie sur le roc subit la même tempête que l'autre : la foi ne supprime pas les crises, elle aide à les traverser."),
        ("Genèse 41.33-36", "Joseph organise des réserves pendant les années d'abondance : la prévoyance est une sagesse."),
        ("Proverbes 24.6", "« Le salut est dans le grand nombre des conseillers » : on ne traverse pas une crise seul."),
        ("Psaume 46.2", "« Dieu est pour nous un refuge et un appui, un secours qui ne manque jamais dans la détresse. »"),
    ],
    accomp="Aidez le couple à identifier son réseau de soutien concret. Un couple isolé est plus vulnérable dans les crises.",
    questions=[
        "Quelle a été la crise la plus difficile de ta vie, et comment l'as-tu traversée ?",
        "Lorsqu'une crise survient, de quoi as-tu besoin de la part de ton conjoint dans les premières heures ?",
        "Quelles assurances et protections sont nécessaires dans notre situation (santé, logement, responsabilité, décès), et qui s'en charge ?",
        "Où rangerons-nous les documents essentiels (identité, contrats, comptes, dossiers médicaux) pour qu'ils soient accessibles à tous les deux ?",
        "Comment prendrons-nous une décision urgente si nous ne sommes pas d'accord et qu'il faut agir vite ?",
        "Que ferions-nous face à une crise majeure : accident grave, perte de logement, catastrophe naturelle, instabilité politique, accusation grave ?",
        "Comment traverserions-nous une crise de foi chez l'un de nous (doutes profonds, éloignement de l'Église) ?",
        "Si notre relation traversait une crise grave, quelles étapes nous engageons-nous à suivre avant toute décision définitive ?",
        "Comment protégerons-nous les enfants, s'il y en a, pendant une crise familiale (information adaptée, stabilité, sécurité) ?",
        "Après une crise, comment ferons-nous le bilan pour en tirer des leçons et réparer ce qui doit l'être ?",
    ],
    voir=["N6", "N1", "O30"],
)

T["O29"] = dict(
    titre="Préparation concrète du mariage et aspects légaux",
    objectif="Vérifier que la décision est libre, régler les démarches civiles, religieuses et coutumières, et clarifier les questions juridiques et matérielles.",
    conseils=[
        "Faites une liste datée des démarches, avec un responsable pour chacune.",
        "Consultez un juriste ou un notaire local sur le régime matrimonial : les règles varient beaucoup selon les pays.",
        "Reporter une date est toujours préférable à se marier sous la pression.",
    ],
    refs=[
        ("Genèse 24.57-58", "Avant le départ de Rebecca, sa famille lui demande : « Veux-tu aller avec cet homme ? » Elle répond : « J'irai. » Le texte porte sur le départ, mais sa parole est recherchée."),
        ("Luc 14.28", "Calculer la dépense avant de commencer : valable aussi pour la cérémonie."),
        ("Romains 13.1-7", "Le respect des autorités civiles invite à accomplir sérieusement les formalités légales."),
    ],
    accomp="La question 10 de ce thème mérite d'être posée à chaque fiancé seul : « Peux-tu dire oui librement, sans peur ? » Toute hésitation sur la liberté doit être prise au sérieux.",
    voir=["O11", "O26", "O30"],
)

T["O30"] = dict(
    titre="Croissance, projets communs et bilan du couple",
    objectif="Faire le point sur le chemin parcouru, nommer les forces et les désaccords restants, et prévoir comment continuer à grandir après le mariage.",
    conseils=[
        "Relisez vos fiches de suivi avant de répondre.",
        "Nommez honnêtement les désaccords restants : un désaccord connu est moins dangereux qu'un désaccord caché.",
        "Terminez par la gratitude.",
    ],
    refs=[
        ("Philippiens 1.6", "Celui qui a commencé une bonne œuvre la rendra parfaite : la croissance est un chemin."),
        ("Colossiens 3.12-17", "Revêtir la bonté, l'humilité, le pardon et la reconnaissance."),
        ("Lamentations 3.22-23", "Les bontés de l'Éternel « se renouvellent chaque matin » : chaque jour offre un nouveau départ."),
    ],
    accomp="Proposez un rendez-vous de suivi six mois ou un an après le mariage : beaucoup de couples n'osent pas revenir seuls.",
    voir=["O29", "O23"],
)
