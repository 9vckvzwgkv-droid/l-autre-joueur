# Rapport — progression séquentielle V2 (itération suivante)

## Modifications intégrées
- Restauration des fichiers du chapitre 10 dans l’archive de travail à partir de la version Chapitre 10 déjà disponible.
- Ajout de `v2-campaign-guard.js`, chargé avant le code de chaque chapitre existant (01 à 12), pour renvoyer à la campagne si le chapitre n’est ni le premier, ni déjà terminé, ni débloqué par l’achèvement du précédent.
- Mise à jour du menu de campagne : les 36 fiches peuvent afficher leur titre et leur description ; les chapitres verrouillés restent consultables mais le bouton de lancement est désactivé. Les chapitres 15 à 36 sont explicitement marqués « à intégrer ».
- Le bouton principal du menu vise le premier chapitre non terminé, plutôt que de sauter systématiquement au chapitre 11.
- Ajout de styles de verrouillage et de limites de hauteur/défilement pour la fenêtre de détail.

## Limites
- La cinématique finale n’est pas implémentée dans cette itération.
- Le contrôle est côté navigateur (HTML/JavaScript/localStorage) : il empêche la navigation directe normale, mais n’est pas une protection serveur contre une modification manuelle du stockage.
- Les chapitres 15 à 36 ne disposent pas encore de prototypes jouables.
- Vérifications réalisées dans cette passe : contrôle syntaxique JavaScript, contrôle des références de fichiers et intégrité ZIP. Aucun test navigateur réel n’est revendiqué.
- Les fichiers de la V1 (`index.html`, `game.js`, `style.css`) ont été conservés sans modification par rapport à l’archive de base, hormis copie de travail des fichiers V2.
