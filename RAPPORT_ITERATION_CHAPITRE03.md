# L’AUTRE JOUEUR V2 — Itération de développement
## Prototype jouable du chapitre 3 : HÉSITATION

### Objectif de cette livraison
Ajouter un nouveau chapitre jouable, différent des chapitres 1 (traces), 2 (habitude) et 6 (distance / abandon), sans modifier les fichiers de la V1.

### Changements
- Ajout de `v2-chapter03.html` et `v2-chapter03.js`.
- Nouveau labyrinthe dessiné spécifiquement pour le chapitre : six salles, boucles et galeries hautes/basses, caméra qui suit le joueur et carte révélée progressivement.
- Énigme à trois symboles : la console centrale révèle l’ordre LUNE → CERCLE → ÉTOILE ; les symboles doivent être activés dans cet ordre.
- Piège à courant annoncé : il ferme temporairement le passage direct, tandis que les itinéraires nord et sud restent disponibles.
- Niche secrète facultative qui ouvre un raccourci.
- L’Autre suit le joueur par recherche de chemin, peut donner un indice si le joueur l’approche et mémorise les actions importantes dans la sauvegarde du chapitre.
- Sauvegarde dédiée au chapitre 3, avec copie de secours et empreinte de contrôle ; elle est séparée des sauvegardes V1 et des autres chapitres.
- Le chapitre 3 est désormais sélectionnable depuis les fiches de la campagne V2.
- Mise à jour des indications de lancement et du nombre de prototypes jouables.

### Contrôles exécutés
- `node --check` : `v2-chapter03.js`, `v2-prototype.js`, `v2-chapter01.js`, `v2-chapter02.js` et `game.js`.
- Contrôle des références de script et des identifiants HTML effectué séparément.
- Intégrité du ZIP et essai réel dans Safari/iPhone : à effectuer avant de qualifier cette version de candidate de production.

### Limites connues
- Les chapitres 1, 2, 3 et 6 sont jouables ; les 32 autres fiches restent à intégrer.
- Le comportement de l’Autre dans ce prototype est adaptatif mais demeure une IA locale à règles et recherche de chemin, pas un modèle d’IA général.
- Le prototype n’a pas encore été validé manuellement sur Safari mobile.
