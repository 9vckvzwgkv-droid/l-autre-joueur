# Rapport d’itération — Chapitre 10 : MENSONGE

## Intention de conception
Respect du document `CONCEPTION_36_LABYRINTHES.md` : deux routes parallèles, trois indices environnementaux, un panneau trompeur qui mène à une boucle récupérable, une indication de l’Autre basée sur son observation incomplète, une salle facultative révélant l’origine du faux signal.

## Fonctionnalités intégrées
- Nouveau labyrinthe de 80 × 52 cellules, indépendant des cartes précédentes.
- Trois indices à examiner : traces au carrefour, flèche ancienne sur la route haute, marques sous le panneau de la route basse.
- Interaction avec l’Autre et choix explicite « Croire l’Autre » ou « Vérifier les indices ».
- Croire l’Autre mémorise la décision et signale la boucle basse ; la sortie reste accessible après retour au carrefour.
- Vérifier exige les trois indices, confirme la route haute et déverrouille la sortie.
- Salle du signal facultative, sauvegarde séparée et marque de complétion de campagne n°10.
- La V1 reste dans l’archive et son `game.js` n’a pas été modifié par cette itération.

## Vérifications
- Vérification syntaxique Node.js des scripts de campagne et du chapitre 10.
- Vérification des références `id` HTML/JavaScript et des chemins locaux.
- Vérification de l’intégrité ZIP après création.
- Les tests de gameplay complet et de rendu réel Safari/iPhone restent à faire ; ils ne sont pas présentés comme réussis.
