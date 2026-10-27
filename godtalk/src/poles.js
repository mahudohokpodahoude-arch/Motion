/* Contenu des huit pôles d'activité.
   Modifier les textes ici : les deux pages de chaque pôle sont générées automatiquement.
   visual : photo (img + pos) ou illustration (svg) · ico : pictogramme · horizon : étapes 1 à 4. */

window.GT_POLES = [
  {
    id: "photo", visual: { svg: "aperture" }, tag: "Illustration", ico: "camera", bg: "cream",
    titre: "Photographie <em>professionnelle</em>", court: "Photographie",
    accroche: "Fixer l'instant juste : celui qui raconte, en une seule image, ce qu'un événement, une personne ou une marque a d'essentiel.",
    faire: ["Mariages, cérémonies et événements familiaux", "Événements d'entreprise, conférences et cérémonies officielles", "Portraits, photographie corporate, produits et campagnes", "Reportages, couverture documentaire et banques d'images"],
    qui: ["Particuliers", "Entreprises et marques", "Institutions", "ONG et associations"],
    besoin: ["Maîtrise de l'exposition, de la lumière et de la composition", "Un boîtier et des optiques adaptés aux prestations vendues", "Un flux de retouche, de sauvegarde et d'archivage fiable", "Un portfolio constitué avant la première vente"],
    horizon: [1, 2], horizonTxt: "L'un des premiers pôles accessibles, avec un investissement maîtrisé."
  },
  {
    id: "video", visual: { img: "studio-talk.jpg", pos: "50% 64%" }, tag: "Visuel d'illustration", ico: "video", bg: "mist",
    titre: "Vidéographie et <em>production de contenus</em>", court: "Vidéographie et contenus",
    accroche: "Transformer un message, un lieu ou un moment en récit filmé, pensé pour le public qui le regardera.",
    faire: ["Captation d'événements et aftermovies", "Vidéos institutionnelles, publicitaires et de présentation", "Clips musicaux, contenus pour artistes et créateurs", "Interviews, reportages et mini-documentaires", "Formats courts pour les réseaux sociaux", "Contenus réguliers pour les entreprises"],
    qui: ["Entreprises et institutions", "Artistes et créateurs", "Organisateurs d'événements", "ONG"],
    besoin: ["Cadrage, prise de son et éclairage maîtrisés", "Caméra, micros et lumières, en location au départ", "Un poste de montage et un stockage sécurisé", "Une méthode : brief, repérage, tournage, validation"],
    horizon: [2], horizonTxt: "Premières prestations vidéo, en louant le matériel manquant."
  },
  {
    id: "live", visual: { img: "melangeur-live.jpg", pos: "50% 45%" }, tag: "Visuel d'illustration", ico: "live", bg: "cream",
    titre: "Live streaming et <em>réalisation multicaméra</em>", court: "Live streaming et multicaméra",
    accroche: "Faire vivre un événement au-delà de la salle : plusieurs caméras, une régie, une diffusion stable, en direct.",
    faire: ["Retransmission d'événements, conférences, cultes et cérémonies", "Production multicaméra et réalisation en direct", "Diffusion sur les plateformes numériques", "Habillage graphique, enregistrement et livraison d'archives"],
    qui: ["Églises", "Centres de conférence et hôtels", "Institutions", "Entreprises", "Organisateurs d'événements"],
    besoin: ["Réalisation multicaméra et gestion des imprévus en direct", "Mélangeur vidéo, interfaces de capture, encodeur", "Connexion stable et solutions de secours (réseau, énergie)", "Des cadreurs et un technicien régie fiables"],
    horizon: [3], horizonTxt: "Lancé une fois la captation maîtrisée et les premiers revenus réinvestis."
  },
  {
    id: "integration", visual: { svg: "roomPlan" }, tag: "Schéma de principe", ico: "integration", bg: "mist",
    titre: "Intégration et <em>installation audiovisuelle</em>", court: "Intégration audiovisuelle",
    accroche: "Concevoir des espaces où l'image et le son servent la parole : salles de conférence, églises, auditoriums, centres événementiels.",
    faire: ["Étude des besoins techniques d'une salle ou d'un espace", "Fourniture et coordination du matériel", "Installation et configuration : caméras, son, lumière, affichage", "Équipement de salles de conférence, lieux de culte et écoles", "Équipement d'auditoriums et de centres événementiels", "Formation des utilisateurs, maintenance et assistance"],
    qui: ["Églises et lieux de culte", "Entreprises et administrations", "Écoles et universités", "Hôtels et centres événementiels"],
    besoin: ["Conception technique, acoustique de base et câblage", "Sécurité électrique et règles d'installation", "Des fournisseurs et distributeurs fiables", "Des spécialistes qualifiés, au cas par cas"],
    horizon: [3], horizonTxt: "D'abord en coordination avec des partenaires spécialisés."
  },
  {
    id: "evenements", visual: { img: "regie-multicam.jpg", pos: "50% 40%" }, tag: "Visuel d'illustration", ico: "stage", bg: "cream",
    titre: "Couverture des <em>grands événements</em>", court: "Grands événements",
    accroche: "Concerts, festivals, conventions, conférences internationales : être à la hauteur des moments qui rassemblent des milliers de personnes.",
    faire: ["Captation multicaméra de concerts et de festivals", "Couverture de conventions, sommets et grandes conférences", "Diffusion sur écrans géants et en ligne", "Contenus dérivés : aftermovies, temps forts, archives"],
    qui: ["Festivals et promoteurs culturels", "Organisations internationales", "Grandes églises et conventions", "Agences événementielles"],
    besoin: ["Une équipe nombreuse et coordonnée", "Un parc de matériel important, en propre ou en partenariat", "Des procédures rodées : plan de caméras, intercom, redondance", "Des références acquises sur des projets plus modestes"],
    horizon: [3, 4], horizonTxt: "Préparé dès l'étape 3 aux côtés de partenaires expérimentés, pleinement visé à l'étape 4."
  },
  {
    id: "cinema", visual: { img: "tournage-cinema.jpg", pos: "40% 45%" }, tag: "Visuel d'illustration", ico: "clap", bg: "mist",
    titre: "Cinéma et <em>productions originales</em>", court: "Cinéma et productions originales",
    accroche: "Écrire, réaliser et produire des histoires capables de toucher des publics au-delà des frontières.",
    faire: ["Développement d'idées, écriture et préparation de tournage", "Courts métrages et documentaires", "Films d'entreprise et publicités", "Clips musicaux à forte ambition artistique", "Direction artistique et réalisation", "À terme, des formats originaux GODTALK : talk-shows, séries, documentaires"],
    qui: ["Publics locaux et internationaux", "Plateformes et festivals", "Marques et institutions", "Artistes et coproducteurs"],
    besoin: ["Réalisation, direction artistique et production", "Scénaristes, comédiens et techniciens partenaires", "Recherche de financements et de coproductions", "Maîtrise des droits, contrats et circuits de diffusion"],
    horizon: [4], horizonTxt: "Productions d'envergure à l'étape 4 ; des courts formats sont possibles plus tôt."
  },
  {
    id: "postprod", visual: { svg: "timeline" }, tag: "Illustration", ico: "timeline", bg: "cream",
    titre: "Postproduction et <em>motion design</em>", court: "Postproduction et motion design",
    accroche: "Là où le récit prend sa forme définitive : rythme, couleur, son et graphisme.",
    faire: ["Montage vidéo et étalonnage", "Motion design, titrage et habillage graphique", "Nettoyage et mixage audio, sous-titrage", "Exports multiformats : web, réseaux sociaux, écrans"],
    qui: ["Clients de GODTALK", "Créateurs et producteurs", "Agences de communication", "Entreprises"],
    besoin: ["Maîtrise des logiciels de montage, d'étalonnage et d'animation", "Un ordinateur performant et un stockage redondant", "Une gestion rigoureuse des médias et des versions", "Une sensibilité narrative autant que technique"],
    horizon: [1, 2], horizonTxt: "Une compétence accessible dès le départ, qui exige surtout de la pratique."
  },
  {
    id: "ia", visual: { svg: "iaField" }, tag: "Illustration", ico: "ai", bg: "mist",
    titre: "Création vidéo <em>assistée par IA</em>", court: "Création vidéo assistée par IA",
    accroche: "Films, clips et motion design : l'intelligence artificielle générative comme nouvel outil de création, au service d'une vision humaine.",
    faire: ["Films et courts métrages réalisés ou enrichis par IA", "Clips musicaux et visualiseurs générés par IA", "Motion design et animations assistés par IA", "Storyboards, moodboards et animatiques pour préparer les tournages", "Hybridation : prises de vue réelles et éléments générés", "Vidéos explicatives et contenus de marque"],
    qui: ["Artistes et labels", "Marques et agences", "Porteurs de projets de films", "Entreprises et institutions"],
    besoin: ["Veille et maîtrise d'outils génératifs qui évoluent vite", "Abonnements logiciels et puissance de calcul", "Maîtrise des droits d'auteur, licences et droit à l'image", "Une charte d'usage : transparence, consentement, aucun contenu trompeur"],
    note: "Notre principe : l'IA accélère la création. Elle ne remplace ni le regard, ni la responsabilité.",
    horizon: [1, 2], horizonTxt: "Investissement matériel limité ; la montée en compétence est la priorité."
  }
];
