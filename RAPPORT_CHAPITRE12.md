# Rapport — Chapitre 12 : Confiance

## Géométrie du labyrinthe
Le chapitre 12 dispose maintenant de sa propre disposition : un vestibule d'entrée, une salle de décision, deux ailes d'archives, une chambre centrale, deux passerelles de retour et une salle du reflet. Les passages forment plusieurs boucles de vérification et un détour vertical asymétrique. Cette géométrie remplace la disposition reprise du chapitre 11.

Les points d'intérêt essentiels restent accessibles : départ, panneau de décision, trois repères, reflet secret et sortie. Une vérification de connectivité par parcours de grille a confirmé que chacun de ces points est atteignable depuis le départ dans la géométrie générée.

## Mécanique et continuité
- La décision enregistrée au chapitre 11 sert de référence pour l'association de mémoire.
- Les trois repères doivent être observés avant de valider la branche.
- Une réponse incorrecte ne déverrouille pas la sortie.
- Le chapitre possède une clé de sauvegarde distincte et appelle la progression de campagne pour le chapitre 12.

## Intégration campagne
- Le chapitre 12 reste accessible depuis sa fiche de campagne lorsque le chapitre est débloqué.
- Le bouton de poursuite de campagne utilise le prochain chapitre non terminé, au lieu de renvoyer systématiquement au chapitre 12.
- La progression séquentielle et la sauvegarde V1 sont préservées.

## Contrôles réalisés
- Vérification syntaxique Node.js des scripts JavaScript du projet.
- Vérification de la connectivité des points de jeu principaux sur la nouvelle grille.
- Vérification des routes HTML/JS, de la clé de sauvegarde et du callback de fin.
- Vérification d'intégrité de l'archive ZIP.

## Limites
Cette itération rend la géométrie du chapitre 12 distincte de celle du chapitre 11. Elle ne signifie pas que les 36 labyrinthes sont déjà tous uniques : les chapitres restants doivent être conçus et vérifiés individuellement. Aucun test visuel en navigateur réel n'est revendiqué.
