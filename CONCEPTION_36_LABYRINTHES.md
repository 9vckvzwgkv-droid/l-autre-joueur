# L’AUTRE JOUEUR V2.0 — Phase 01
## Conception des 36 labyrinthes

**Statut : document de conception évolutif. Les chapitres 1 à 13 possèdent des prototypes séparés dans cette archive ; les chapitres 14 à 36 restent à intégrer. Le verrouillage séquentiel et une première cinématique de fin sont présents côté V2, mais la cinématique ne peut être atteinte normalement qu’une fois les 36 chapitres jouables.**

Cette proposition conserve les 36 chapitres et leur ordre. Chaque chapitre garde son identité narrative et reçoit son propre labyrinthe, conçu à la main. Le projet ne devient pas un labyrinthe unique partagé par toute la campagne.

Les tailles indiquées sont des estimations en cellules, à confirmer dans le prototype. Elles donnent une progression de l’exploration sans imposer des cartes interminables. Chaque labyrinthe aura plusieurs itinéraires, des repères reconnaissables et une route principale que le joueur peut retrouver. Les secrets resteront facultatifs.

## Règles de conception communes

- Les plans seront déterministes et dessinés spécifiquement pour le chapitre ; aucune génération aléatoire ne modifiera la solution des énigmes.
- Les indices importants seront présents dans le décor, les dialogues ou le comportement observable de l’Autre. Les énigmes dépendant d’une ancienne sauvegarde auront un indice de remplacement si le souvenir requis manque.
- Les pièges annonceront leur danger par un signal lisible et auront une issue de récupération. Ils ne tueront pas le joueur et ne pourront pas fermer toutes les routes sans avertissement.
- L’Autre respectera les murs, les portes et les informations qu’il a réellement observées. L’IA pourra proposer ou tenter une action ; le joueur conservera un moyen de comprendre ce qui s’est passé.
- Chaque niveau aura une route principale testable, au moins un détour significatif et un secret facultatif. Les niveaux coopératifs auront une solution de secours plus coûteuse ou plus longue afin de ne pas bloquer la campagne.
- La relation modifiera les dialogues, la confiance accordée, les risques et certaines solutions. Elle ne verrouillera jamais arbitrairement la progression principale.
- La caméra suivra le joueur dans les grandes cartes. Les zones hors écran ne seront pas dessinées à pleine résolution ; les énigmes et états continueront d’être simulés de façon prévisible.

## Progression des chapitres

Les chapitres 1 à 6 enseignent les déplacements, les repères et la coopération simple. Les chapitres 7 à 18 développent les choix et la relation. Les chapitres 19 à 24 explorent le silence, l’identité et les conséquences. Les chapitres 25 à 30 font du labyrinthe un monde réactif. Les chapitres 31 à 36 réutilisent les souvenirs et les décisions accumulées.

## Fiches des 36 labyrinthes

### 01 — TRACE (`follow`)

- **Ambiance et structure :** dédale d’accueil, environ 48 × 36 cellules, quatre salles reliées par un couloir en boucle ; murs bas et repères visuels simples.
- **Mission et énigme :** suivre trois empreintes lumineuses dans l’ordre pour comprendre que les traces de l’Autre indiquent un itinéraire, puis rejoindre sa salle.
- **Piège :** une dalle fait clignoter une fausse trace ; le motif s’interrompt avant la dalle et permet de l’éviter sans sanction durable.
- **Autre et relation :** l’Autre reproduit une partie du trajet du joueur, puis attend à une bifurcation. Le joueur peut l’attendre ou avancer seul ; l’attente améliore légèrement la confiance.
- **Secret et sortie :** alcôve visible derrière un embranchement facultatif. La sortie commune s’ouvre après le parcours et les retrouvailles ; transition vers l’habitude du joueur.

### 02 — HABITUDE (`habit`)

- **Ambiance et structure :** labyrinthe en Y avec deux boucles de longueurs différentes, environ 56 × 40 cellules, cinq salles.
- **Mission et énigme :** choisir un itinéraire et reconnaître ensuite le symbole associé à ce choix pour ouvrir un raccourci. L’Autre observe le choix plutôt que de simplement le copier.
- **Piège :** une porte se referme lentement derrière le joueur ; une ouverture latérale reste accessible et le mécanisme est annoncé par une lumière qui décroît.
- **Autre et relation :** le joueur peut montrer à l’Autre la bonne branche ou le laisser décider. L’Autre retient le trajet choisi ; une première visite sans mémoire utilise un symbole neutre.
- **Secret et sortie :** une salle facultative révèle un raccourci entre les boucles. La sortie mène à un espace calme où l’hésitation devient le thème suivant.

### 03 — HÉSITATION (`hesitate`)

- **Ambiance et structure :** quatre salles concentriques reliées par des passages courbes, environ 52 × 38 cellules ; la salle centrale est visible mais pas directement accessible.
- **Mission et énigme :** observer trois lumières et s’arrêter dans l’alcôve correspondant à leur séquence. L’arrêt fait réagir l’Autre et révèle la bonne porte.
- **Piège :** un couloir à courant pousse doucement vers une fausse sortie ; les particules indiquent le sens du courant et une zone d’abri permet de reprendre le contrôle.
- **Autre et relation :** le joueur peut attendre que l’Autre montre son hésitation ou le rejoindre immédiatement. L’Autre apprend si le joueur sait lui laisser du temps.
- **Secret et sortie :** une alcôve de repos contient un fragment de dialogue. La porte centrale mène au chapitre de l’attente.

### 04 — ATTENTE (`wait`)

- **Ambiance et structure :** labyrinthe à cinq salles autour d’un mécanisme sonore, environ 60 × 40 cellules ; un anneau de couloirs rejoint deux entrées du mécanisme.
- **Mission et énigme :** synchroniser deux dalles : le joueur en occupe une, l’Autre doit comprendre et atteindre l’autre. Les impulsions lumineuses donnent le rythme.
- **Piège :** les portes battantes se déplacent à intervalles réguliers ; leur cadence est montrée par des marques au sol et elles ne blessent pas les personnages.
- **Autre et relation :** une consigne contextuelle permet de demander « reste ici » ou « viens ». Sans instruction, l’Autre peut proposer une solution après avoir observé le motif.
- **Secret et sortie :** attendre un cycle supplémentaire ouvre un passage facultatif. La sortie se déverrouille lorsque les deux dalles sont occupées.

### 05 — MIROIR (`mirror`)

- **Ambiance et structure :** parcours en huit avec deux croisements et six salles, environ 68 × 44 cellules ; les routes du joueur et de l’Autre se croisent réellement.
- **Mission et énigme :** faire se rencontrer deux trajectoires aux intersections marquées, puis ouvrir la porte en suivant la séquence des marques communes.
- **Piège :** les miroirs renvoient une silhouette trompeuse, mais le reflet ne laisse pas de traces au sol ; cette différence est l’indice.
- **Autre et relation :** l’Autre choisit son propre chemin entre les croisements. Le joueur peut le suivre ou le laisser arriver seul ; les retrouvailles influencent son initiative future.
- **Secret et sortie :** un miroir fissuré révèle une pièce latérale. La sortie se trouve à la jonction des deux boucles.

### 06 — DISTANCE / ABANDON (`abandon`)

- **Ambiance et structure :** deux ailes séparées par une porte à temporisation, six salles sur environ 68 × 44 cellules ; une galerie supérieure permet un détour.
- **Mission et énigme :** activer deux commandes éloignées, l’une dans chaque aile, puis décider comment rejoindre l’Autre.
- **Piège :** la porte centrale commence à se fermer après le premier déclenchement. Un indicateur lumineux prévient du cycle ; une traversée au mauvais moment repousse le joueur au seuil. Le détour reste ouvert.
- **Autre et relation :** le joueur peut demander à l’Autre de tenir une commande, se séparer de lui, ou revenir le chercher. Continuer sans lui reste possible et produit un souvenir d’abandon distinct d’un retour volontaire.
- **Secret et sortie :** un miroir fendu ouvre un tunnel caché vers la galerie sud et révèle une trace facultative. Les deux personnages peuvent sortir ensemble, ou le joueur peut choisir la route solitaire.

### 07 — CHOIX (`choice`)

- **Ambiance et structure :** embranchement à trois branches inégales, sept salles sur environ 76 × 48 cellules ; les branches se rejoignent sans effacer le choix.
- **Mission et énigme :** retrouver une porte à partir d’indices répartis dans les trois branches. Une décision prise tôt détermine le raccourci final.
- **Piège :** une fausse impasse contient un sol friable annoncé par des fissures ; contourner la zone est toujours possible.
- **Autre et relation :** l’Autre observe le choix du joueur et peut indiquer sa préférence sans imposer de branche. Le souvenir est associé au chapitre, pas seulement à une jauge.
- **Secret et sortie :** une niche sur la branche la plus longue montre une version différente du choix. La sortie rejoint le thème du blocage.

### 08 — BLOCAGE / PUNITION (`punish`)

- **Ambiance et structure :** six salles autour d’un passage étroit, environ 72 × 48 cellules ; un corridor principal et deux détours réels.
- **Mission et énigme :** libérer une porte obstruée en actionnant deux leviers accessibles par des routes différentes.
- **Piège :** pousser une caisse contre la porte bloque temporairement le passage, sans enfermer l’Autre ; un levier de récupération est visible depuis la salle.
- **Autre et relation :** le joueur peut volontairement gêner l’Autre ou coordonner son passage. L’Autre pourra ensuite choisir de se protéger et d’emprunter le détour, plutôt que de traverser le joueur.
- **Secret et sortie :** le détour utilisé par l’Autre mène à une petite pièce de mémoire. La sortie récompense le franchissement du blocage, pas la punition.

### 09 — OBSERVATION (`observe`)

- **Ambiance et structure :** sept salles avec balcons, passages opaques et fenêtres intérieures, environ 78 × 50 cellules.
- **Mission et énigme :** observer l’Autre depuis trois postes et recopier sa séquence de déplacement sur un panneau de symboles.
- **Piège :** une galerie semble sûre mais se ferme lorsqu’on la traverse ; un témoin lumineux révèle le cycle et une porte de retour reste ouverte.
- **Autre et relation :** l’Autre patrouille un itinéraire qu’il croit sûr, peut se tromper et demander de l’aide. Le joueur peut le laisser agir ou lui montrer une observation.
- **Secret et sortie :** un poste d’observation caché montre l’envers du panneau. La sortie s’ouvre quand la séquence observée est correctement reproduite.

### 10 — MENSONGE (`lie`)

- **Ambiance et structure :** sept salles et deux routes parallèles, environ 80 × 52 cellules ; la signalétique de l’une des routes est volontairement suspecte.
- **Mission et énigme :** déterminer quelle indication est fausse en comparant trois indices environnementaux avant d’ouvrir la sortie.
- **Piège :** suivre le mauvais panneau mène à une boucle avec une porte de retour, pas à un piège sans issue. Les symboles gravés contredisent le panneau.
- **Autre et relation :** l’Autre donne une indication selon ce qu’il a réellement observé et son souvenir d’événements passés. Il peut se tromper ; ses hésitations sont perceptibles.
- **Secret et sortie :** une salle facultative expose la source du faux signal. Le choix de croire l’Autre ou de vérifier nourrit le souvenir de confiance.

### 11 — SOUVENIR (`memory`)

- **Ambiance et structure :** huit salles organisées en boucle avec trois repères repris du labyrinthe 7, environ 84 × 54 cellules.
- **Mission et énigme :** retrouver le symbole de la branche choisie au chapitre 7 et l’associer à son repère. Sans sauvegarde correspondante, une courte scène d’introduction fournit un symbole de remplacement.
- **Piège :** des portes de mémoire se ressemblent ; seules les marques observées précédemment correspondent. Une salle de retour évite toute impasse.
- **Autre et relation :** l’Autre se souvient aussi du choix enregistré, mais peut en donner une interprétation différente. Le joueur peut corriger ou accepter son souvenir.
- **Secret et sortie :** un souvenir non choisi reste visible derrière une vitre, sans bloquer la progression. Le bon repère ouvre un corridor vers la confiance.

### 12 — CONFIANCE (`trust`)

- **Ambiance et structure :** huit salles, dont une zone d’observation et une voie directe, environ 86 × 54 cellules.
- **Mission et énigme :** l’Autre indique un itinéraire praticable qu’il a lui-même exploré. Le joueur peut le suivre ou vérifier les balises avant d’emprunter un raccourci.
- **Piège :** des dalles ralentissent le déplacement ; leur motif sonore et visuel annonce lesquelles sont stables. L’Autre n’en connaît que celles qu’il a observées.
- **Autre et relation :** accepter son aide améliore la coopération si son indication est confirmée ; vérifier n’est pas puni. Une faible confiance n’empêche pas l’Autre de proposer une aide prudente.
- **Secret et sortie :** le chemin long comporte un indice relationnel, le chemin direct un raccourci. Les deux mènent à la même porte.

### 13 — TRAHISON (`betray`)

- **Ambiance et structure :** huit salles divisées par deux ponts, environ 88 × 56 cellules ; un pont est fermé au départ, l’autre exige un détour.
- **Mission et énigme :** réunir deux éléments de pont et vérifier leur ordre à l’aide de marques réciproques.
- **Piège :** un pont provisoire se rétracte après le passage ; une balise lumineuse donne le délai et une passerelle de récupération demeure accessible.
- **Autre et relation :** l’Autre promet de tenir un mécanisme mais n’y parvient pas toujours. Le joueur peut l’aider, attendre, ou poursuivre vers une solution individuelle ; le souvenir enregistre les faits et non une accusation abstraite.
- **Secret et sortie :** une cache sous le pont révèle pourquoi la promesse a échoué. Les deux solutions principales convergent sans effacer la conséquence relationnelle.

### 14 — COOPÉRATION (`cooperate`)

- **Ambiance et structure :** neuf salles en réseau avec deux zones éloignées et une passerelle centrale, environ 92 × 58 cellules.
- **Mission et énigme :** maintenir une commande dans chaque zone pour déplacer la passerelle. Le joueur et l’Autre doivent réellement se répartir les rôles.
- **Piège :** la passerelle bouge par paliers ; des voyants affichent le prochain mouvement avant qu’il ne commence.
- **Autre et relation :** une commande contextuelle demande à l’Autre de tenir ou de relâcher un levier. S’il ne comprend pas, il peut demander un signal et le joueur peut lui montrer le mécanisme.
- **Secret et sortie :** la coordination simultanée ouvre une alcôve bonus. La sortie principale fonctionne aussi avec un levier à action retardée, plus lent mais accessible seul.

### 15 — PRÉDICTION (`predict`)

- **Ambiance et structure :** neuf salles avec une boucle centrale et deux couloirs d’anticipation, environ 94 × 60 cellules.
- **Mission et énigme :** comprendre la prédiction affichée par l’Autre, puis choisir une route qui la déjoue en activant deux repères dans un ordre différent.
- **Piège :** un corridor se referme derrière le joueur après un signal d’anticipation ; une boucle latérale permet de revenir sans perte.
- **Autre et relation :** l’Autre apprend les habitudes, mais sa prédiction est probabiliste et peut échouer. Le joueur peut suivre la prédiction, la contredire ou lui fournir un faux indice.
- **Secret et sortie :** une salle cachée révèle les routes qu’il avait envisagées. La sortie s’ouvre après l’activation du contre-parcours.

### 16 — REFUS (`refuse`)

- **Ambiance et structure :** huit salles conduisant à une porte que l’Autre refuse d’actionner, avec une route de contournement, environ 90 × 58 cellules.
- **Mission et énigme :** comprendre le signal de refus et décider si l’on respecte sa limite ou si l’on cherche un autre accès.
- **Piège :** le mécanisme de la porte se désactive s’il est forcé ; un indicateur signale le risque et une commande de remise à zéro se trouve sur la route alternative.
- **Autre et relation :** l’Autre explique ce qu’il redoute s’il l’a observé, ou exprime son incertitude. Respecter son refus ouvre une coopération future ; contourner la porte reste possible et laisse une conséquence durable.
- **Secret et sortie :** l’alcôve derrière la route alternative présente l’origine de sa décision. Les deux chemins rejoignent le chapitre de l’écho.

### 17 — ÉCHO (`echo`)

- **Ambiance et structure :** neuf salles en séquence avec deux itinéraires qui se répondent, environ 94 × 60 cellules.
- **Mission et énigme :** rejouer une séquence de trois gestes observée plus tôt, mais identifier le geste à modifier pour briser la répétition.
- **Piège :** des dalles rejouent un mouvement après un délai ; leur lumière précède l’écho et une voie latérale reste libre.
- **Autre et relation :** l’Autre reconnaît une habitude réelle de la campagne, ou montre une séquence neutre au premier parcours. Le joueur peut répéter ou modifier le motif avec lui.
- **Secret et sortie :** un passage s’ouvre si les deux personnages produisent des séquences différentes. La porte finale s’ouvre quand le motif est compris.

### 18 — PROTECTION (`protect`)

- **Ambiance et structure :** dix salles comprenant un refuge central, des galeries en hauteur et deux voies basses, environ 100 × 62 cellules.
- **Mission et énigme :** guider l’Autre et le joueur vers des abris alternés pour franchir une zone balayée par un faisceau.
- **Piège :** le faisceau suit un cycle lent, annoncé sur les murs. Toucher le faisceau renvoie au dernier refuge, sans effacer les étapes résolues.
- **Autre et relation :** l’Autre peut prendre l’initiative et signaler un refuge déjà observé. Le joueur peut accepter sa protection, lui montrer un abri ou refuser et prendre une route plus longue.
- **Secret et sortie :** protéger l’Autre dans une section facultative révèle une mémoire de son point de vue. L’issue principale demande que les deux atteignent le dernier refuge.

### 19 — RETOUR (`question`)

- **Ambiance et structure :** huit salles en boucle, avec le point de départ reconnaissable depuis plusieurs angles, environ 92 × 58 cellules.
- **Mission et énigme :** retrouver le lieu de la première rencontre en suivant des repères dans l’ordre inverse.
- **Piège :** un couloir circulaire ramène au même carrefour ; une marque au mur permet de le repérer et de sortir de la boucle.
- **Autre et relation :** le joueur peut revenir vers l’Autre après avoir exploré ou l’attendre. L’Autre commente le retour à partir de son souvenir d’abandon et de réunion.
- **Secret et sortie :** revenir au point de départ avec l’Autre ouvre un souvenir facultatif. La porte suivante s’active dans la salle où la question initiale a été posée.

### 20 — SILENCE (`silence`)

- **Ambiance et structure :** huit salles feutrées, sans bulles d’aide pendant l’énigme, environ 94 × 60 cellules ; les indices sont visuels et tactiles à l’écran.
- **Mission et énigme :** déduire l’ordre de trois portes par les formes, les ombres et leurs positions, sans dépendre du son.
- **Piège :** un sol silencieux efface temporairement les traces du joueur ; des repères muraux permettent de continuer et le retour restaure le tracé.
- **Autre et relation :** l’Autre n’emploie pas de dialogue, mais observe et peut pointer du regard un indice qu’il a réellement vu. Le joueur décide de suivre le signal ou de vérifier.
- **Secret et sortie :** une salle cachée montre une marque faite par l’Autre. L’ordre correct ouvre un passage vers l’identité.

### 21 — IDENTITÉ (`identity`)

- **Ambiance et structure :** deux moitiés symétriques mais non identiques, neuf salles sur environ 100 × 62 cellules.
- **Mission et énigme :** comparer des symboles dans les deux moitiés pour identifier les différences qui appartiennent au joueur et celles que l’Autre a ajoutées.
- **Piège :** un faux miroir inverse les commandes visuelles de la salle, mais des repères de bord maintiennent l’orientation du joueur.
- **Autre et relation :** l’Autre peut explorer l’autre moitié et rapporter un indice incomplet. Le joueur choisit de le croire, de le rejoindre ou de vérifier le reflet.
- **Secret et sortie :** réunir les deux différences ouvre une salle commune où les silhouettes se superposent. La suite introduit la fracture du monde.

### 22 — FRACTURE (`fracture`)

- **Ambiance et structure :** dix salles séparées par des fissures franchissables, environ 104 × 64 cellules ; certaines connexions changent d’état.
- **Mission et énigme :** stabiliser deux points de la fracture dans un ordre indiqué par des lignes lumineuses.
- **Piège :** un passage s’ouvre et se ferme après une fissure sonore ; une zone sûre permet d’attendre le cycle et aucune fermeture ne coupe le retour.
- **Autre et relation :** l’Autre peut tenir un point pendant que le joueur rejoint l’autre. S’il hésite, l’interface montre ce qu’il a compris ; le joueur peut revenir le rassurer.
- **Secret et sortie :** un détour facultatif permet de lire la fracture depuis l’autre côté. Les deux points stabilisés ouvrent la suite.

### 23 — DEUX SORTIES (`choice2`)

- **Ambiance et structure :** dix salles aboutissant à deux ailes distinctes, environ 106 × 66 cellules ; les deux sorties sont visibles avant le choix final.
- **Mission et énigme :** recueillir trois indices relationnels et comprendre ce que chaque sortie implique, puis choisir l’issue.
- **Piège :** les portes se referment une fois le choix engagé, mais un mécanisme d’annulation est accessible avant la validation définitive.
- **Autre et relation :** l’Autre exprime sa préférence selon les événements mémorisés. Le joueur peut le laisser décider ou choisir lui-même ; aucune jauge seule ne sélectionne le résultat.
- **Secret et sortie :** une salle entre les deux ailes révèle une troisième nuance sans imposer un choix caché. La décision est conservée dans la mémoire de campagne.

### 24 — SEUIL (`final`)

- **Ambiance et structure :** dix salles en spirale autour d’un seuil, environ 108 × 68 cellules ; la route du joueur et celle de l’Autre partent séparément puis convergent.
- **Mission et énigme :** retrouver trois marques liées aux choix précédents et rejoindre l’Autre au seuil.
- **Piège :** une porte se ferme après le passage d’un personnage ; une commande accessible depuis les deux côtés permet de rouvrir le lien.
- **Autre et relation :** il peut attendre, avancer ou proposer une voie selon sa relation et son expérience, sans connaître les zones qu’il n’a pas vues.
- **Secret et sortie :** le détour facultatif explique pourquoi le seuil semble familier. La sortie déclenche la nouvelle phase du monde et mène aux portes.

### 25 — DISTORSION (`distort`)

- **Ambiance et structure :** neuf salles bâties autour d’un axe décentré, environ 104 × 64 cellules ; une partie de la géométrie varie selon les décisions antérieures, de façon déterministe.
- **Mission et énigme :** comparer la carte visible à trois repères persistants et trouver le passage dont la position a changé.
- **Piège :** un couloir distordu mène à une boucle, signalée par des repères répétés ; le joueur peut revenir au dernier carrefour.
- **Autre et relation :** l’Autre connaît uniquement les changements qu’il a observés. Il peut avertir le joueur ou confondre deux repères ; explorer ensemble confirme l’information.
- **Secret et sortie :** une salle conserve la forme antérieure du chapitre. La porte de sortie se trouve au point de jonction des deux versions.

### 26 — PORTES (`doors`)

- **Ambiance et structure :** dix salles et trois portes thématiques, environ 110 × 68 cellules ; chaque porte conduit à une boucle différente, puis les routes reviennent au hub.
- **Mission et énigme :** observer les indices de chaque porte et en choisir une ; la décision change le chemin et un souvenir de l’Autre.
- **Piège :** une porte se verrouille après activation, mais chaque boucle contient une sortie de retour clairement indiquée.
- **Autre et relation :** l’Autre peut expliquer pourquoi il préfère une porte, sur la base de ses observations. Le joueur peut lui confier le choix ou le garder ; la route reste finissable dans les deux cas.
- **Secret et sortie :** les trois boucles contiennent chacune un fragment différent. Un raccourci s’ouvre au second passage ; la route choisie est sauvegardée.

### 27 — FANTÔME (`ghost`)

- **Ambiance et structure :** onze salles, dont des couloirs invisibles depuis le point d’entrée, environ 116 × 70 cellules.
- **Mission et énigme :** repérer une présence à partir du regard de l’Autre, de traces temporaires et de sons visuels représentés par des ondes.
- **Piège :** suivre une fausse silhouette mène à une pièce en boucle ; l’absence de réaction de l’Autre et l’absence de traces donnent un indice de vérification.
- **Autre et relation :** l’Autre perçoit une zone que le joueur ne voit pas encore et peut la signaler. Le joueur peut le suivre, lui demander de rester ou explorer l’autre route.
- **Secret et sortie :** la présence révèle un passage facultatif et n’est pas une entité omnisciente. Le point observé par les deux ouvre la sortie.

### 28 — RETOUR IMPOSSIBLE (`return`)

- **Ambiance et structure :** onze salles à repères mobiles, environ 118 × 72 cellules ; certaines salles pivotent autour d’un hub, mais le plan reste compréhensible.
- **Mission et énigme :** retrouver une coordonnée familière à partir de trois repères qui changent de position lors d’un cycle annoncé.
- **Piège :** un changement de salle peut renvoyer vers une variante déjà visitée ; un panneau indique le cycle et un raccourci revient au hub.
- **Autre et relation :** l’Autre mémorise les repères qu’il a vus et peut corriger une fausse piste. Le joueur peut lui demander de conduire ou vérifier son trajet.
- **Secret et sortie :** une salle facultative révèle le premier plan. Atteindre la coordonnée reconnue ouvre le lien vers l’effondrement.

### 29 — EFFONDREMENT (`collapse`)

- **Ambiance et structure :** douze salles avec trois routes de fuite, environ 122 × 74 cellules ; certains passages changent d’état au fil de l’exploration.
- **Mission et énigme :** atteindre l’Autre et ouvrir une issue en activant des stabilisateurs dans un ordre lisible.
- **Piège :** des sections se ferment après un compte à rebours annoncé par des fissures et des sons visuels. Les sections fermées sont récupérables par un détour ; aucun chronomètre ne condamne une partie entière.
- **Autre et relation :** l’Autre peut choisir un stabilisateur et prévenir le joueur de son risque. Le joueur peut l’aider, le laisser choisir ou partir vers une route plus sûre.
- **Secret et sortie :** stabiliser toutes les sections ouvre une salle facultative. Le seuil principal reste accessible après un échec partiel.

### 30 — LE MONDE CHOISIT (`threshold`)

- **Ambiance et structure :** dix salles connectées à un carrefour central, environ 116 × 70 cellules ; plusieurs chemins s’ouvrent selon les états du monde.
- **Mission et énigme :** interpréter les marques du carrefour pour trouver la route choisie par le monde et rejoindre l’Autre.
- **Piège :** les voies changent une seule fois après un avertissement ; une carte murale conserve l’ancien tracé pour permettre le retour.
- **Autre et relation :** l’Autre propose une route fondée sur ses souvenirs, mais le monde n’obéit pas toujours à sa préférence. Le joueur peut lui faire confiance ou comparer les signes.
- **Secret et sortie :** les routes secondaires exposent des conséquences différentes de la campagne. Le seuil se forme au point où leurs cartes convergent.

### 31 — SECRET (`secret`)

- **Ambiance et structure :** neuf salles accessibles depuis un passage caché, environ 112 × 68 cellules ; le chemin principal reste identifiable même sans trouver le secret.
- **Mission et énigme :** découvrir comment les murs du niveau dissimulent une seconde carte et ouvrir un accès non obligatoire.
- **Piège :** une fausse porte secrète ramène au début de la zone ; des marques cohérentes distinguent le vrai passage.
- **Autre et relation :** l’Autre peut remarquer une couture du décor si son exploration l’y conduit. Le joueur peut partager la découverte ou la garder pour lui ; le souvenir porte sur l’acte observé.
- **Secret et sortie :** la seconde carte livre une scène facultative importante pour les fins. La route principale ne dépend pas de cette découverte.

### 32 — DOUBLE (`double`)

- **Ambiance et structure :** deux labyrinthes miroirs de onze salles chacun, environ 118 × 72 cellules ; des fenêtres et signaux relient certaines pièces.
- **Mission et énigme :** transmettre une séquence de symboles d’un côté à l’autre et retrouver l’Autre au seul passage commun.
- **Piège :** une porte s’ouvre dans un labyrinthe et se ferme dans l’autre ; un signal annonce chaque bascule et une liaison de retour demeure.
- **Autre et relation :** les deux personnages explorent des zones différentes. L’Autre doit transmettre ce qu’il a observé ; le joueur peut répondre avec un signal, le suivre ou continuer seul.
- **Secret et sortie :** une salle cachée n’apparaît que si les deux séquences correspondent. Le passage commun mène à la vérité.

### 33 — VÉRITÉ (`truth`)

- **Ambiance et structure :** douze salles en trois archives, environ 124 × 76 cellules ; les pièces représentent des souvenirs de la campagne.
- **Mission et énigme :** sélectionner trois événements réellement enregistrés parmi des variantes plausibles, puis les remettre dans l’ordre.
- **Piège :** une archive mal choisie ferme la salle, mais une inscription permet de corriger le choix et de réessayer sans perdre les preuves déjà trouvées.
- **Autre et relation :** l’Autre apporte ses souvenirs, qui peuvent être incomplets. Le joueur peut le croire ou confronter son souvenir aux traces conservées.
- **Secret et sortie :** les événements facultatifs enrichissent le récit, mais un jeu neuf reçoit une séquence complète de remplacement. L’accord sur les trois faits ouvre la sortie.

### 34 — ABSENCE (`absence`)

- **Ambiance et structure :** huit salles silencieuses avec des traces de pas, environ 108 × 68 cellules ; l’Autre n’est pas présent physiquement.
- **Mission et énigme :** suivre les traces pour atteindre la sortie, tout en déterminant si elles sont anciennes ou laissées pendant cette partie.
- **Piège :** les traces s’effacent dans une zone balayée ; les repères de murs indiquent comment retrouver l’itinéraire.
- **Autre et relation :** l’absence n’est pas annulable et ne bloque pas le joueur. Les choix consistent à chercher, continuer ou protéger une trace laissée derrière soi.
- **Secret et sortie :** un lieu de pause contient un message de l’Autre basé sur son historique, avec variante neutre sans sauvegarde. La sortie prépare l’origine.

### 35 — ORIGINE (`origin`)

- **Ambiance et structure :** douze salles en trois anneaux autour d’un centre, environ 128 × 78 cellules ; les anneaux reprennent des formes de chapitres précédents.
- **Mission et énigme :** rassembler trois indices d’origine et les placer dans l’ordre qui décrit la naissance de la relation.
- **Piège :** un anneau ramène au carrefour s’il est parcouru à l’envers ; des marques de progression rendent le sens lisible.
- **Autre et relation :** l’Autre peut proposer un ordre à partir de sa mémoire, mais le joueur doit comparer les indices. Les souvenirs enregistrés changent le dialogue, pas la possibilité de finir.
- **Secret et sortie :** une chambre optionnelle révèle une origine alternative. Atteindre le centre permet de choisir la dernière épreuve.

### 36 — DERNIER CHOIX (`choiceFinal`)

- **Ambiance et structure :** treize salles et deux parcours finaux, environ 132 × 80 cellules ; les routes expriment respectivement confiance partagée et contrôle solitaire.
- **Mission et énigme :** réutiliser trois mécaniques apprises et décider si le joueur laisse l’Autre choisir la sortie ou garde la décision.
- **Piège :** le parcours comporte un dernier mécanisme réversible avant la validation ; il avertit clairement que la sortie rend le choix définitif.
- **Autre et relation :** l’Autre formule son propre choix à partir des événements observés et mémorisés. Le joueur peut l’accepter ou prendre le contrôle ; les deux issues sont complètes et cohérentes.
- **Secret et sortie :** les fins varient selon les souvenirs, les décisions et la relation, pas selon un seul score. Un dernier détour facultatif donne une conclusion silencieuse avant le générique.

## Contrat de réalisation obligatoire — référence du plan ChatGPT Work

Ce contrat s’applique **séparément aux 36 chapitres** et prévaut sur toute accélération de production. Un chapitre ne sera pas déclaré terminé parce que son écran s’ouvre ou que son texte a été changé.

Pour chaque chapitre, la fiche et le niveau jouable doivent inclure :

1. **Labyrinthe unique :** géométrie et graphe de salles conçus pour ce chapitre, avec une signature spatiale distincte des autres niveaux. Les changements de thème, de couleur, d’ennemis ou de texte ne comptent pas comme une nouvelle carte.
2. **Énigme unique et déterministe :** objectif clair, indices perceptibles, solution vérifiable, réponse incorrecte gérée sans blocage et indices de secours si une sauvegarde antérieure manque.
3. **Piège spécifique :** déclencheur et avertissement compréhensibles, conséquence cohérente, méthode d’évitement ou de récupération. Aucun piège ne doit condamner définitivement une partie.
4. **Secret facultatif :** détour ou condition de découverte propre au niveau, récompensant l’observation sans empêcher d’atteindre la sortie principale.
5. **Autre et relation :** comportements limités à ce que l’Autre a observé et peut atteindre ; décisions et souvenirs influencent ses dialogues ou stratégies sans rendre le niveau insoluble.
6. **Validation technique :** départ, sortie, étapes de l’énigme, portes, itinéraires alternatifs et accès au secret vérifiés sur la carte réelle ; progression et sauvegarde testées.
7. **Revue anti-duplication :** comparaison avec les 35 autres plans afin de détecter une carte clonée ou une énigme/piège/secret simplement renommés.

**Ordre et périmètre :** conserver les 36 titres et leur ordre actuel. Les chapitres 2 à 36 restent verrouillés tant que le précédent n’est pas terminé. La fiche de chapitre doit afficher son nom, sa description complète, « Jouer le chapitre » et « Fermer ». La cinématique finale n’est accessible qu’après la réussite des 36 chapitres. La V1.0 doit rester préservée.

**Règle de statut :** distinguer explicitement « conçu », « intégré », « contrôles statiques réussis » et « testé en navigateur ». Ne jamais qualifier les 36 labyrinthes d’uniques et validés tant que chaque niveau n’a pas passé cette revue individuelle.

## Conditions de validation de cette conception

Avant le développement des 36 niveaux, chaque fiche devra être traduite en plan de salle et en graphe de connexions. La revue de conception vérifiera que :

1. les 36 formes de labyrinthe sont reconnaissables et ne sont pas des duplications avec un décor différent ;
2. la route principale est connectée du départ à la sortie et ses verrous sont ouvrables ;
3. chaque énigme a des indices observables, une solution déterminée et une procédure de reprise ;
4. chaque piège a un déclencheur, un avertissement, une conséquence réversible et un moyen d’évitement ;
5. les actions de l’Autre respectent sa perception, sa navigation et sa relation avec le joueur ;
6. les souvenirs absents ou les sauvegardes anciennes ont un chemin de remplacement ;
7. les choix d’aide, de séparation et d’abandon ont des conséquences compréhensibles sans rendre la progression impossible.

## Prototype proposé pour la phase suivante

Le chapitre 6 (DISTANCE / ABANDON) est le meilleur prototype : il combine grande carte, séparation contrôlée, itinéraires alternatifs, mécanisme à deux personnages, sauvegarde d’un événement relationnel et récupération après fermeture d’une porte. Il éprouve les fondations sans engager immédiatement le final de la campagne. Le prototype sera comparé au chapitre 1 pour vérifier que le système reste assez simple pour l’introduction.

## Décisions à approuver avant le prototype

- La progression conserve les 36 chapitres actuels, avec les titres et événements comme base narrative.
- Chaque chapitre reçoit un labyrinthe séparé, fait à la main et plus vaste ; il ne s’agit pas d’un seul monde continu partagé par la campagne.
- Les pièges créent de la tension mais ne tuent pas le joueur et ne provoquent pas de blocage sans récupération.
- Les énigmes coopératives auront une résolution réellement à deux, avec une solution de secours moins directe pour préserver l’accessibilité de la campagne.
- Le chapitre 6 est le prototype principal proposé pour éprouver séparation, coopération et mémoire.

**Cette conception reste la référence pour les niveaux à intégrer. Les prototypes 1 à 13, le verrouillage séquentiel et l’infrastructure initiale de cinématique sont implémentés séparément ; ils ne valident pas encore la réalisation complète des 36 labyrinthes.**

## État de réalisation — mise à jour chapitre 12
- **Chapitre 12 — Confiance : géométrie dédiée réalisée.** Vestibule, salle de décision, ailes d'archives, chambre centrale, passerelles et salle du reflet organisés en boucles asymétriques. Les points de gameplay ont été contrôlés comme atteignables depuis le départ.
- Cette mention ne valide pas les 36 chapitres : chaque autre chapitre doit conserver une signature spatiale distincte, être contrôlé contre les cartes précédentes et faire l'objet d'un test de connectivité. Une variation de texte ou de couleur ne compte pas comme un labyrinthe unique.


## Audit anti-duplication — itération suivante

- **Chapitre 4 — Attente : géométrie refondue.** La carte utilise maintenant un anneau asymétrique de neuf chambres, avec carrefour central, aile nord, galerie suspendue, aile est et retour sud. Les dalles synchronisées, la porte cyclique et le refuge secret sont conservés. Les points de gameplay principaux ont passé un contrôle statique de connectivité.
- **Limite importante :** l’audit global des 36 cartes n’est pas terminé. Les chapitres 3, 5 et 6 doivent être comparés à cette nouvelle carte, puis les 36 graphes devront être validés individuellement. Voir `AUDIT_UNICITE_CARTES_PHASE13.md`.


## Journal de réalisation — itération chapitre 5

- **Chapitre 5 — MIROIR :** prototype enrichi avec un piège de faux reflet à effet temporaire et une alcôve secrète spatialement reliée au miroir fissuré. Instructions, sauvegarde et mini-carte mises à jour.
- **Statut :** intégration et contrôles statiques effectués ; test en navigateur et audit comparatif complet de la topologie encore requis. Cette étape ne valide pas les 36 chapitres dans leur ensemble.
