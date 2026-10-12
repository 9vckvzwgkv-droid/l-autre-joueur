# Rapport de livraison — Chapitre 14 : COOPÉRATION

## Implémentation
- Labyrinthe déterministe de 92 × 58 cellules avec neuf salles, deux zones de levier éloignées, une passerelle centrale et une boucle de secours.
- Objectif coopératif : le joueur active A pendant que l’Autre rejoint et maintient B après réception d’un signal explicite.
- Solution de secours solo : B reste actif pendant 18 secondes, ce qui permet d’atteindre A par la boucle inférieure.
- Voyants de passerelle, alcôve secrète, sauvegarde indépendante `otherPlayerChapter14SaveV2`, faits mémorisés et sortie de chapitre.
- Le chapitre 14 est ajouté au menu de campagne et à la liste des prototypes jouables.

## Vérifications réalisées
- Syntaxe JavaScript contrôlée avec `node --check`.
- Références locales des pages HTML contrôlées.
- Connectivité de base du plan vérifiée par parcours de grille ; le levier B et la sortie sont accessibles via le détour inférieur lorsque le pont central est verrouillé.
- Lancement en navigateur réel et test manuel des commandes non exécutés dans cet environnement.

## Limites connues
Les chapitres 15 à 36 restent à intégrer. Le chapitre 14 doit encore être essayé dans un navigateur pour confirmer les sensations de déplacement, les timings et le déblocage séquentiel avec les sauvegardes de campagne réelles.
