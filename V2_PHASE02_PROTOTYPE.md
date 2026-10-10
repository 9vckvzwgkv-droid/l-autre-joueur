# L’AUTRE JOUEUR V2.0 — Phase 02
## Architecture et prototype du chapitre 6

**État : prototype technique réalisé dans une copie séparée.** La V1 d’origine n’a pas été modifiée. Le prototype démontre les fondations ; il ne constitue pas encore une version complète du chapitre 6 ni une version candidate V2.0.

## Sauvegarde de référence

- Source conservée : dossier `L_Autre_Joueur_Safari_V1.0 2`.
- Archive de sauvegarde : `L_Autre_Joueur_V1.0_reference_backup.zip`.
- Intégrité ZIP vérifiée avant les changements : 63 fichiers.
- SHA-256 : `0b3b031d08ef0a1009eaaa15399fa8c388fedc8e431e392295817ca1bb778d4f`.
- La copie V2 est `L_Autre_Joueur_V2.0_Prototype`. Les fichiers V1 d’origine qu’elle contient ont été comparés à la source et sont identiques.

## Contenu du prototype

La page `v2-prototype.html` ouvre un labyrinthe dédié au chapitre 6, sans remplacer la page `index.html` ni le jeu V1.

- Carte quadrillée de 88 × 48 cellules, construite à partir de sept salles et de corridors à embranchements ; les murs et connexions sont définis de façon déterministe.
- Caméra centrée sur le joueur ; rendu Canvas limité à la partie visible de la carte.
- Découverte progressive des salles et mini-carte révélée au fil de l’exploration.
- Déplacements clavier et joystick tactile ; collision contre les murs et mouvement découpé pour éviter de traverser les obstacles lors d’un grand pas.
- Navigation A* de l’Autre sur la grille. Au départ il suit le joueur ; après une demande au terminal il rejoint le relais B et le maintient.
- Énigme à deux voies : demander à l’Autre de maintenir le relais B, ou rejoindre B pour l’activer soi-même, puis maintenir A ; les deux solutions ouvrent la sortie.
- Le chapitre mémorise la séparation, les retrouvailles, le choix solo ou coopératif et la sortie ensemble ou seul. Un refuge caché se révèle durant une séparation.
- Porte à fermeture temporaire avec marqueur visuel, délai et détour praticable ; le piège ne tue pas et ne ferme pas la progression.
- Accueil V2 avec démarrage et reprise de la progression sauvegardée.
- Menu latéral inspiré de l’interface V1.1 : objectif, état de l’Autre et de la porte, progression de la carte, commandes, pause, redémarrage et retour à la V1.
- Écrans d’accueil, de pause et de fin de chapitre ; le menu met le labyrinthe en pause et reprend sans saut de temps.
- Sauvegarde de prototype versionnée avec checksum et copie de secours. Elle mémorise positions, commande de l’Autre, porte, exploration et événements.
- La clé V2 est `otherPlayerMemoryV2Prototype1`. Le code prototype ne lit ni n’écrit les clés V15 de la sauvegarde V1.

## Résultats des vérifications

**Contrôles statiques :** `node --check` sur `v2-prototype.js` réussi ; analyse HTML réussie ; 41 identifiants uniques, références locales et accolades CSS vérifiés.

**Simulation Node avec DOM et Canvas simulés : 23/23 contrôles réussis.** En plus du déplacement et des mécanismes, elle couvre l’accueil, le menu latéral, la pause, le retour à l’accueil, les deux solutions de relais, la séparation, le refuge, les retrouvailles et la sauvegarde. Ces simulations ne constituent pas un essai Safari.

**Essai navigateur réel : non effectué.** Le lancement de Chromium headless a quitté avec `SIGABRT`. Safari WebDriver s’est arrêté avant de créer une session. Le moteur Canvas et les contrôles tactiles n’ont donc pas été observés dans un vrai navigateur ou sur iPhone ; les simulations ne remplacent pas cette validation.

## Limites connues

- Un seul labyrinthe prototype est implémenté ; les 36 labyrinthes restent à concevoir et développer individuellement.
- Le menu est intégré au prototype V2 isolé ; il n’a pas été inséré dans le jeu V1.
- L’Autre exécute une tâche de navigation simple. Il ne résout pas encore des énigmes de façon autonome et n’apprend pas encore de cette partie dans la mémoire de campagne V1.
- La simulation de sauvegarde couvre l’état du prototype, pas la migration des anciennes sauvegardes V1.
- Le prototype n’a pas encore subi de contrôle visuel réel, de mesure de performance ou d’essai Safari mobile.
- Les commandes à l’écran sont prévues pour le tactile, mais leur ergonomie doit être confirmée sur appareil.

## Procédure de lancement et de retour arrière

Dans le dossier du projet, ouvrir `v2-prototype.html` pour lancer le prototype. `index.html` reste l’entrée du jeu V1. Pour revenir entièrement à la V1, ouvrir l’archive de sauvegarde V1 ou supprimer les quatre fichiers V2 ajoutés (`v2-prototype.html`, `v2-prototype.css`, `v2-prototype.js` et ce rapport). Aucune migration ni suppression de sauvegarde V1 n’est nécessaire.

## Étape suivante proposée

Avant de généraliser les labyrinthes, il faut valider dans un vrai navigateur la caméra, la taille des commandes, les collisions, le trajet de l’Autre, la coopération et la sauvegarde après rechargement. Après cette validation, le chapitre 6 pourra être complété et stabilisé ; les autres labyrinthes ne seront pas généralisés automatiquement à partir de cette carte.
