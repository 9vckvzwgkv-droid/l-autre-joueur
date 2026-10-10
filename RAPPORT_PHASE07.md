# L’AUTRE JOUEUR V2 — Phase 07
## Ouverture de la fenêtre en cliquant sur une fiche de chapitre

### Changements

- Suppression des boutons dédiés « Choisir le chapitre » dans les fiches de la campagne.
- Les fiches jouables 1, 2 et 6 sont désormais entièrement cliquables : cliquer sur le numéro, le titre, l’objectif ou le statut ouvre la fenêtre du chapitre.
- La fenêtre conserve les deux choix demandés : « Jouer le chapitre » lance le niveau ; « Fermer » revient à la liste.
- Les fiches jouables restent utilisables au clavier avec Entrée ou Espace et affichent leur focus clairement.
- Le statut des prototypes indique qu’il faut cliquer pour ouvrir la fiche.

### Contrôles effectués

- Campagne et chapitre 6 : **39/39 contrôles simulés réussis**, dont clic sur la fiche, suppression des boutons, ouverture au clavier, fermeture et lancement.
- Chapitre 1 : **13/13 contrôles simulés réussis**.
- Chapitre 2 : **13/13 contrôles simulés réussis**.
- Total : **65/65 contrôles simulés réussis**.
- Syntaxe JavaScript, liens locaux, identifiants HTML, CSS et intégrité ZIP : réussis.
- Les fichiers principaux de la V1 restent identiques à l’archive de référence.

Les contrôles de jeu utilisent un DOM et un Canvas simulés. **Aucun essai réel dans Safari n’a été effectué dans cette étape.**

### État de la campagne

Les chapitres 1, 2 et 6 sont jouables. Les 33 autres chapitres ont leur thème et leur objectif, mais leurs niveaux restent à construire.

### Lancement

Décompresse l’archive et ouvre `v2-prototype.html`. Dans la liste, clique directement sur une fiche verte pour ouvrir ses options.
