# Rapport d’itération — chapitre 14 : COOPÉRATION

## Intégration
- Ajout de `v2-chapter14.html` et `v2-chapter14.js`, avec sauvegarde locale indépendante `otherPlayerChapter14SaveV2`.
- Ajout du chapitre 14 à la liste de campagne et à la route de lancement.
- Carte déterministe en neuf salles reliées par des passages, deux zones de commande éloignées et une passerelle centrale à trois paliers.

## Mécaniques implémentées
- Commande ouest activée par le joueur et levier est tenu par L’Autre après interaction/signal.
- Trois paliers de passerelle, avec voyant rouge pendant la phase d’avertissement.
- Solution de secours solo via la console centrale, après délai de sept secondes.
- Cache facultative révélée après au moins deux paliers de coopération.
- Sauvegarde dédiée au chapitre et marquage de fin dans la progression de campagne.

## Validation effectuée
- Contrôle de syntaxe JavaScript via Node.js.
- Contrôle des références d’éléments DOM utilisées dans le script.
- Contrôle de connectivité de la carte, à portes ouvertes, par parcours de grille.
- Contrôle d’intégrité de l’archive ZIP.

## Limites restantes
- Aucun test complet en navigateur réel n’est déclaré dans ce rapport.
- La validation manuelle doit vérifier les commandes tactiles, les sauvegardes après rechargement, l’accès à la cache et les trois paliers en mode coopératif et solo.
- Le comportement de L’Autre est déterministe dans ce prototype ; l’apprentissage plus riche de ses habitudes reste à développer dans les itérations suivantes.
