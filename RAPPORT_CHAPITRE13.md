# Rapport — Chapitre 13 : TRAHISON

## Implémentation
- Labyrinthe déterministe en huit, avec deux ailes ouest, un carrefour central, deux galeries est et une sortie.
- Deux pièces distinctes (△ et ○) à récupérer dans l’aile nord et l’aile sud.
- Deux plaques gravées à observer pour confirmer l’ordre △ puis ○ avant l’assemblage du pont principal.
- Pont principal fermé jusqu’à la résolution de l’énigme.
- Pont provisoire au sud : une balise avertit de la rétraction après environ 4,2 secondes. Si le joueur est encore sur le pont, il est ramené sur la berge sans perdre ses objets ni sa progression.
- Secret facultatif sous le pont : une note révèle que le verrou était déjà grippé, ce qui nuance l’impression de trahison.
- L’Autre se dirige vers le mécanisme, peut échouer à tenir sa promesse si les marques ne lui ont pas été montrées, puis peut corriger son erreur après observation. Les faits sont mémorisés dans l’historique du chapitre.
- Sauvegarde propre au chapitre 13 ; V1 et sauvegardes des autres chapitres non modifiées.
- Le chapitre marque la progression de campagne avec `v2MarkCampaignChapterComplete(13)` et reste soumis au verrou séquentiel.

## Contrôles effectués
- À exécuter : contrôle syntaxique JavaScript, références locales et vérification de cohérence des liens de campagne.
- Non revendiqué : test manuel complet en navigateur et test de publication GitHub Pages.
