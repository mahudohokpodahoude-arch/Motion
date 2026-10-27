/* Contenu des huit pôles d'activité.
   Modifier les textes ici : la mise en page est générée automatiquement.
   horizon = étapes de la feuille de route (1 à 4) où le pôle est envisagé. */

window.GT_POLES = [
  {
    id: "photo", layout: "A", theme: "dark", visual: { svg: "aperture" }, tag: "Composition graphique",
    titre: "Photographie <em>professionnelle</em>", court: "Photographie",
    resume: "Événements, portraits, corporate, reportage",
    accroche: "Fixer l'instant juste : celui qui raconte, en une seule image, ce qu'un événement, une personne ou une marque a d'essentiel.",
    faire: ["Mariages, cérémonies et événements familiaux", "Événements d'entreprise, conférences et cérémonies officielles", "Portraits, photographie corporate, produits et campagnes", "Reportages, couverture documentaire et banques d'images"],
    qui: ["Particuliers", "Entreprises et marques", "Institutions et organisations", "ONG et associations"],
    besoin: ["Maîtrise de l'exposition, de la lumière et de la composition", "Un boîtier et des optiques adaptés aux prestations réellement vendues", "Un flux de retouche, de sauvegarde et d'archivage fiable", "Un portfolio constitué avant la première vente"],
    horizon: [1, 2], horizonTxt: "Étapes 1 et 2 : l'un des premiers pôles accessibles, avec un investissement maîtrisé."
  },
  {
    id: "video", layout: "B", theme: "light", visual: { img: "studio-talk.jpg", pos: "50% 62%" }, tag: "Visuel d'illustration",
    titre: "Vidéographie et <em>production de contenus</em>", court: "Vidéographie et contenus",
    resume: "Captation, institutionnel, clips, réseaux sociaux",
    accroche: "Transformer un message, un lieu ou un moment en récit filmé, pensé pour le public qui le regardera.",
    faire: ["Captation d'événements et aftermovies", "Vidéos institutionnelles, publicitaires et de présentation", "Clips musicaux, contenus pour artistes et créateurs", "Interviews, reportages et mini-documentaires", "Formats courts pour les réseaux sociaux", "Contenus récurrents pour les entreprises"],
    qui: ["Entreprises, marques et institutions", "Artistes et créateurs de contenus", "Organisateurs d'événements", "ONG et partenaires de développement"],
    besoin: ["Cadrage, prise de son et éclairage maîtrisés", "Caméra, micros et lumières, en location au départ", "Un poste de montage et un stockage sécurisé", "Une méthode : brief, repérage, tournage, validation"],
    horizon: [2], horizonTxt: "Étape 2 : premières prestations vidéo, en louant le matériel manquant."
  },
  {
    id: "live", layout: "A", theme: "dark", visual: { img: "melangeur-live.jpg", pos: "50% 45%" }, tag: "Visuel d'illustration",
    titre: "Live streaming et <em>réalisation multicaméra</em>", court: "Live streaming et multicaméra",
    resume: "Régie vidéo, retransmission, diffusion en ligne",
    accroche: "Faire vivre un événement au-delà de la salle : plusieurs caméras, une régie, une diffusion stable, en direct.",
    faire: ["Retransmission d'événements, conférences, cultes et cérémonies", "Production multicaméra et réalisation en direct", "Diffusion sur les plateformes numériques", "Habillage graphique, enregistrement et livraison d'archives"],
    qui: ["Églises et organisations communautaires", "Centres de conférence, hôtels et institutions", "Organisateurs d'événements", "Entreprises : assemblées, lancements, webinaires"],
    besoin: ["Réalisation multicaméra et gestion des imprévus en direct", "Mélangeur vidéo, interfaces de capture, encodeur", "Connexion stable et solutions de secours (réseau, énergie)", "Des cadreurs et un technicien régie fiables"],
    horizon: [3], horizonTxt: "Étape 3 : lancé une fois les compétences de captation solides et les premiers revenus réinvestis."
  },
  {
    id: "integration", layout: "B", theme: "light", visual: { svg: "roomPlan" }, tag: "",
    titre: "Intégration et <em>installation audiovisuelle</em>", court: "Intégration audiovisuelle",
    resume: "Étude, fourniture, installation, formation",
    accroche: "Concevoir des espaces où l'image et le son servent la parole : salles de conférence, églises, auditoriums, centres événementiels.",
    faire: ["Étude des besoins techniques d'une salle ou d'un espace", "Fourniture et coordination du matériel", "Installation et configuration : caméras, son, lumière, affichage", "Solutions pour salles de conférence, lieux de culte et écoles", "Équipement d'auditoriums et de centres événementiels", "Formation des utilisateurs, maintenance et assistance"],
    qui: ["Églises et lieux de culte", "Entreprises et administrations", "Écoles, universités, auditoriums", "Hôtels et centres événementiels"],
    besoin: ["Conception technique, acoustique de base et câblage", "Sécurité électrique et règles d'installation", "Des fournisseurs et distributeurs fiables", "Des spécialistes qualifiés, au cas par cas"],
    horizon: [3], horizonTxt: "Étape 3 : d'abord en coordination avec des partenaires spécialisés."
  },
  {
    id: "evenements", layout: "A", theme: "dark", visual: { img: "regie-multicam.jpg", pos: "50% 40%" }, tag: "Visuel d'illustration",
    titre: "Couverture des <em>grands événements</em>", court: "Grands événements",
    resume: "Concerts, festivals, conventions, sommets",
    accroche: "Concerts, festivals, conventions, conférences internationales : être à la hauteur des moments qui rassemblent des milliers de personnes.",
    faire: ["Captation multicaméra de concerts et de festivals", "Couverture de conventions, sommets et grandes conférences", "Diffusion sur écrans géants et en ligne", "Contenus dérivés : aftermovies, temps forts, archives"],
    qui: ["Promoteurs culturels et festivals", "Institutions et organisations internationales", "Grandes églises et conventions", "Agences événementielles"],
    besoin: ["Une équipe nombreuse et coordonnée", "Un parc de matériel important, en propre ou en partenariat", "Des procédures rodées : plan de caméras, intercom, redondance", "Des références acquises sur des projets plus modestes"],
    horizon: [3, 4], horizonTxt: "Étape 4, préparée dès l'étape 3 en intervenant aux côtés de partenaires expérimentés."
  },
  {
    id: "cinema", layout: "B", theme: "light", visual: { img: "tournage-cinema.jpg", pos: "16% 50%" }, tag: "Visuel d'illustration",
    titre: "Cinéma et <em>productions originales</em>", court: "Cinéma et productions originales",
    resume: "Films, documentaires, clips, formats originaux",
    accroche: "Écrire, réaliser et produire des histoires capables de toucher des publics au-delà des frontières.",
    faire: ["Développement d'idées, écriture et préparation de tournage", "Courts métrages et documentaires", "Films d'entreprise et publicités", "Clips musicaux à forte ambition artistique", "Direction artistique et réalisation", "À terme, des formats originaux GODTALK : talk-shows, séries, documentaires"],
    qui: ["Publics locaux et internationaux", "Plateformes de diffusion et festivals", "Marques et institutions (films de commande)", "Artistes et coproducteurs"],
    besoin: ["Réalisation, direction artistique et production", "Scénaristes, comédiens et techniciens partenaires", "Recherche de financements et de coproductions", "Maîtrise des droits, contrats et circuits de diffusion"],
    horizon: [4], horizonTxt: "Étape 4 pour les productions d'envergure ; des courts formats sont possibles plus tôt."
  },
  {
    id: "postprod", layout: "A", theme: "light", visual: { svg: "timeline" }, tag: "Composition graphique",
    titre: "Postproduction et <em>motion design</em>", court: "Postproduction et motion design",
    resume: "Montage, étalonnage, son, habillage",
    accroche: "Là où le récit prend sa forme définitive : rythme, couleur, son et graphisme.",
    faire: ["Montage vidéo et étalonnage", "Motion design, titrage et habillage graphique", "Nettoyage et mixage audio, sous-titrage", "Exports multiformats : web, réseaux sociaux, écrans"],
    qui: ["Les clients de GODTALK (prestation intégrée)", "Créateurs et producteurs ayant déjà leurs images", "Agences de communication", "Entreprises pour leurs contenus récurrents"],
    besoin: ["Maîtrise des logiciels de montage, d'étalonnage et d'animation", "Un ordinateur performant et un stockage redondant", "Une gestion rigoureuse des médias et des versions", "Une sensibilité narrative autant que technique"],
    horizon: [1, 2], horizonTxt: "Étape 1 : une compétence accessible dès le départ, qui exige surtout de la pratique."
  },
  {
    id: "ia", layout: "B", theme: "dark", visual: { svg: "iaField" }, tag: "Composition graphique",
    titre: "Création vidéo <em>assistée par IA</em>", court: "Création vidéo assistée par IA",
    resume: "Films, clips et motion design par IA",
    accroche: "Films, clips et motion design : l'intelligence artificielle générative comme nouvel outil de création, au service d'une vision humaine.",
    faire: ["Films et courts métrages réalisés ou enrichis par IA", "Clips musicaux et visualiseurs générés par IA", "Motion design et animations assistés par IA", "Storyboards, moodboards et animatiques pour préparer les tournages", "Hybridation : prises de vue réelles et éléments générés", "Vidéos explicatives et contenus de marque"],
    qui: ["Artistes et labels", "Marques et agences", "Porteurs de projets de films (pitch, prévisualisation)", "Entreprises et institutions"],
    besoin: ["Veille et maîtrise d'outils génératifs qui évoluent vite", "Abonnements logiciels et puissance de calcul", "Maîtrise des droits d'auteur, licences et droit à l'image", "Une charte d'usage : transparence, consentement, aucun contenu trompeur"],
    note: "Notre principe : l'IA accélère la création. Elle ne remplace ni le regard, ni la responsabilité.",
    horizon: [1, 2], horizonTxt: "Étapes 1 et 2 : investissement matériel limité ; la montée en compétence est la priorité."
  }
];
