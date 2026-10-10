# Rapport d’itération — Chapitre 11 : SOUVENIR

## Conception appliquée
- Labyrinthe de 84 × 54 cellules organisé en boucle, avec trois branches-repères et une salle de vitre facultative.
- Trois repères distincts : triangle (branche haute), losange (branche centrale), cercle (branche basse).
- Le chapitre lit `otherPlayerChapter7SaveV2` et récupère la décision `upper`, `middle` ou `lower` depuis son payload.
- Si aucune sauvegarde du chapitre 7 exploitable n’existe, la branche centrale est proposée comme indice de secours et cette situation est affichée.
- L’Autre peut se souvenir d’une autre branche ; le joueur peut corriger ce souvenir en sélectionnant le bon symbole.
- La sortie ne s’ouvre qu’après observation des trois repères et association correcte.
- Une salle derrière une vitre fournit un indice facultatif.
- Sauvegarde propre au chapitre 11 ; la V1 et ses fichiers principaux ne sont pas modifiés.

## Contrôles réalisés
- Vérification de syntaxe JavaScript avec `node --check` (rapport généré après construction).
- Vérification de l’intégrité du ZIP.
- Contrôle des références locales et des IDs du panneau de mémoire. La sauvegarde sérialise aussi le choix associé et le recours éventuel à l’indice de secours.

## À tester manuellement
- Jouer le chapitre 7 et vérifier les trois valeurs de décision, puis ouvrir le chapitre 11 dans le même navigateur/origine.
- Vérifier le scénario sans sauvegarde du chapitre 7.
- Tester les trois branches, la salle secrète, la sauvegarde/reprise et le rendu mobile Safari.
