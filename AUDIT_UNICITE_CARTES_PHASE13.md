# L’Autre Joueur V2 — Audit d’unicité des cartes (itération suivante)

## Travail effectué

Le chapitre 4 — **ATTENTE** a reçu une nouvelle géométrie manuelle. L’ancienne succession de six chambres proches d’un axe horizontal a été remplacée par un anneau asymétrique de neuf chambres : vestibule ouest, refuge nord-ouest, archive des impulsions au nord, galerie suspendue, chambre de l’horloge à l’est, salle du dernier écho au sud-est, archive méridienne, galerie du retour et carrefour central.

Les éléments de gameplay existants sont conservés : synchronisation des deux dalles, porte cyclique, refuge secret et sauvegarde propre au chapitre. Les coordonnées de la dalle du joueur, de la dalle de l’Autre, du refuge et de la sortie ont été contrôlées sur la nouvelle grille.

## Contrôles réellement effectués

- `node --check` réussi sur `v2-chapter04.js`.
- Parcours de grille effectué sur une reproduction des salles, couloirs et piliers du chapitre 4.
- Les points départ, dalle du joueur, dalle de l’Autre, niche secrète, sortie et galeries nord/sud sont accessibles dans le contrôle de connectivité statique.
- La porte est et la porte cyclique restent des verrous de gameplay ; le test de grille ne remplace pas un test de déplacement en navigateur.

## État de l’audit global

Cette passe ne permet **pas** de certifier l’unicité des 36 labyrinthes. Les chapitres 3 à 6 possédaient auparavant une structure spatiale très proche malgré leurs objectifs différents ; le chapitre 4 est maintenant retravaillé, mais les chapitres 3, 5 et 6 doivent encore faire l’objet d’une comparaison et, si nécessaire, d’une refonte de leur topologie. Les chapitres 7 à 12 doivent aussi être comparés entre eux sur leurs graphes de salles, pas uniquement sur leurs titres et leurs coordonnées.

Depuis cet audit, le chapitre 13 — TRAHISON a été ajouté. Les chapitres 14 à 36 restent à intégrer ; le chapitre 13 doit encore recevoir un test manuel complet en jeu. La règle du projet reste : aucune carte ne compte comme unique si elle ne possède pas sa propre géométrie, son énigme, son piège et son secret facultatif.

## Prochaine tâche recommandée

Refondre le chapitre 5 — **MIROIR** autour d’un véritable graphe en huit avec deux croisements obligatoires et routes indépendantes pour le joueur et l’Autre, puis vérifier que son plan diffère du chapitre 4 et des chapitres 3 et 6.
