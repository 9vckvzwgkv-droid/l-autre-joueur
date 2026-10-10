# Rapport d’itération — Chapitre 4 : ATTENTE

## Ajouts
- Labyrinthe distinct de 6 salles avec des couloirs, des obstacles de visibilité et une progression en plusieurs zones.
- Énigme coopérative : rester sur la dalle du carrefour afin que l’Autre lise le signal et rejoigne la seconde dalle.
- IA de navigation A* qui cible la seconde dalle lorsque le joueur tient sa position, puis reprend le suivi si le joueur s’éloigne.
- Portes battantes à cycle de 8 secondes, avec indication lumineuse du passage ouvert.
- Refuge secret et passage de contournement facultatif.
- Sauvegarde indépendante du chapitre 4, intégration de sa complétion dans la campagne V2, commandes clavier et tactiles conservées.

## Contrôles effectués
- Vérification syntaxique JavaScript avec Node.js.
- Vérification de la présence des identifiants HTML utilisés par le script.
- Vérification d’intégrité de l’archive ZIP.

## Limites connues
- La validation effectuée ici est statique ; le jeu doit encore être ouvert dans un navigateur pour une session de test manuelle.
- Le cycle des portes et le comportement de navigation doivent être testés en jeu sur différents navigateurs avant de considérer le chapitre comme finalisé.
