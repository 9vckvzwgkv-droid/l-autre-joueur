# Rapport de livraison — Chapitre 15 : PRÉDICTION

## Mécaniques du prototype
- Labyrinthe déterministe distinct, avec trois balises de bifurcation.
- L’Autre construit une prédiction simple à partir de la fréquence des choix gauche/droite mémorisés dans la sauvegarde du chapitre.
- À chaque balise, le joueur peut lire le pari de L’Autre puis choisir une branche. Une branche différente déjoue la prédiction ; suivre la prédiction déclenche un avertissement et un bref ralentissement narratif, sans bloquer la route.
- Une cache facultative s’ouvre après deux prédictions déjouées.
- La progression du chapitre est sauvegardée indépendamment et le chapitre 15 est relié au menu de campagne.

## Vérifications
- Contrôle syntaxique JavaScript avec Node.js.
- Vérification des chemins locaux référencés dans le HTML.
- Contrôle de connectivité de la grille et des points de départ/objectifs.
- Pas de test complet dans un navigateur réel réalisé dans cette livraison ; les interactions doivent être validées en jeu avant de déclarer le chapitre terminé.
