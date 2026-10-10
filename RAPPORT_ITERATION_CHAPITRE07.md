# Itération — Chapitre 7 : CHOIX

## Changement réel de gameplay
- Le sol fissuré n’est plus un simple obstacle décoratif : la zone est traversable et déclenche un piège unique au premier passage. Le joueur est renvoyé au début du détour supérieur, reçoit une explication et peut reprendre son chemin.
- Le détour supérieur est une route praticable distincte de la zone dangereuse ; le piège ne condamne pas la progression.
- L’état du piège est sauvegardé/restauré et remis à zéro avec « Rejouer le chapitre ».
- Le plan asymétrique à trois branches, le choix initial, les trois indices, la préférence non contraignante de L’Autre et la niche secrète sont conservés.

## Vérifications effectuées
- `node --check` sur le JavaScript du chapitre 7.
- Vérification statique des identifiants HTML utilisés par le script.
- Reconstruction isolée de la grille réelle et parcours en largeur (BFS) : départ, carrefour, indices haut/central/bas, niche secrète, zone du piège, détour et salle de sortie sont tous accessibles dans la grille.
- Vérification des scripts JavaScript du projet, de l’intégrité de l’archive et de la présence des fichiers V1.

## Limites connues
Ces contrôles sont statiques. Aucun navigateur réel n’a été piloté ici : le déclenchement du piège, la sauvegarde/restauration et les trois variantes de raccourci doivent encore être parcourus manuellement. Le piège a une conséquence déterministe et ne se déclenche qu’une fois par partie.
