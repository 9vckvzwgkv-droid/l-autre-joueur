# Rapport d’itération — Chapitre 6 : DISTANCE / ABANDON

## Modifications de cette itération
- L’énigme des relais est désormais séquentielle : le relais nord doit être synchronisé avant le relais sud. Une tentative dans le mauvais ordre fournit un indice plutôt que de bloquer définitivement le joueur.
- Le passage central est devenu un piège temporisé explicite : une grille visuellement signalée alterne entre fenêtre sûre et danger. Une traversée hors fenêtre renvoie le joueur au seuil et consigne l’événement.
- Le miroir fendu ouvre maintenant un véritable tunnel caché vers la galerie sud, plutôt qu’une simple récompense textuelle.
- La décision relationnelle (coopérer ou partir seul), la sauvegarde du chapitre et l’intégration à la campagne sont conservées.
- Corrections de textes de chapitre : objectifs, instructions, pause et bouton de rejouabilité.

## Contrôles statiques
- Syntaxe JavaScript contrôlée avec Node.js.
- Identifiants HTML référencés par le script comparés automatiquement.
- Connectivité de la grille vérifiée par parcours BFS sur une reconstruction des salles, routes, obstacles et tunnel secret.
- Références au chapitre 6, clé de sauvegarde et complétion de campagne vérifiées.
- Intégrité de l’archive ZIP vérifiée après création.

## Limites connues
Ces contrôles ne remplacent pas un test manuel complet dans Safari/iPhone ou un navigateur de bureau. Le comportement réel des contrôles tactiles, les deux fins, la navigation de l’Autre et la restauration de sauvegarde restent à tester en jeu. La grille est distincte dans sa structure et sa boucle de temporalité, mais l’audit comparatif des 36 cartes n’est pas encore achevé.
