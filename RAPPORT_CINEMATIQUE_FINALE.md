# Rapport — cinématique de fin de campagne V2

## Livré dans cette itération
- Ajout d'une cinématique d'épilogue en cinq scènes narratives, avec transition automatique, progression visuelle et navigation manuelle.
- Commandes : continuer, mettre en pause/reprendre, passer la cinématique, activer/désactiver un motif sonore synthétique, revoir la cinématique et retourner à la campagne.
- Le mouvement automatique est désactivé lorsque la préférence système « réduire les animations » est active ; la progression manuelle reste disponible.
- La cinématique n'est accessible que si les 36 numéros de chapitres figurent dans la progression. Une URL `#finale` incomplète renvoie à la campagne.
- Ajout d'un bouton de rejeu dans la campagne lorsque les 36 chapitres sont marqués terminés.
- La page `v2-prototype.html` (qui contient à la fois l’accès campagne et le prototype du chapitre 6) bloque aussi le lancement du prototype 6 tant que le chapitre 5 n’est pas terminé ; son marqueur refuse d’enregistrer une fin hors ordre.
- Les fonctions de fin des chapitres 1 à 14 utilisent maintenant un marqueur central qui refuse d'enregistrer un chapitre si le précédent n'est pas terminé. Lorsqu'un futur chapitre 36 enregistre sa fin avec ce marqueur, la navigation est dirigée vers la cinématique.

## Limites connues
- Les chapitres 15 à 36 n'ont toujours pas de prototypes jouables ; la cinématique ne peut donc pas être atteinte par une partie normale complète tant que ces chapitres ne sont pas intégrés.
- Le suivi reste stocké côté navigateur dans `localStorage`, sans validation serveur. Une modification manuelle des données locales peut falsifier la progression.
- Le son est un motif synthétique minimal, pas encore une bande originale ni un mixage narratif.
- La cinématique utilise actuellement une narration générale. La personnalisation détaillée par les choix enregistrés reste une amélioration à réaliser.
- Les tests réalisés ici sont des contrôles statiques et des tests isolés de la logique de verrouillage. Aucun test dans un navigateur réel n'est revendiqué.

## Contrôles exécutés
- `node --check` sur les scripts V2 du prototype, des chapitres 1 à 14 et du garde de campagne.
- Vérification des identifiants HTML nécessaires à la cinématique et de l'absence d'identifiants dupliqués.
- Tests isolés du marqueur central : refuse de terminer le chapitre 2 sans le chapitre 1 ; accepte la progression 1 puis 2 ; n'ouvre pas la fin si tous les chapitres ne sont pas terminés.
- Vérification de l'intégrité de l'archive ZIP.
- Les fichiers V1 `index.html`, `game.js` et `style.css` sont conservés depuis l'archive de départ.
