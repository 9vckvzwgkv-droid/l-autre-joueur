# Rapport — Chapitre 17 : ÉCHO

## Mécanique ajoutée
- Trois balises distinctes dans un labyrinthe navigable.
- La direction d’approche (nord, sud, est, ouest) est traitée comme un geste.
- Le joueur doit répéter le premier geste à la deuxième balise, puis choisir une direction différente à la troisième pour rompre la boucle.
- Une variation prématurée réinitialise le motif avec le nouveau geste appris.
- Secret facultatif accessible après résolution, sauvegarde locale séparée et progression de campagne au chapitre 17.

## Vérifications statiques
- `node --check` réussi sur `v2-chapter17.js` et `v2-prototype.js`.
- Contrôle des références : aucun identifiant utilisé par le script n’est absent du HTML ; aucun identifiant HTML dupliqué.
- Les anciens libellés du chapitre 15/16 ont été retirés de la page du chapitre 17.
- Vérification du ZIP : archive valide.
- Aucun test réel dans un navigateur n’est revendiqué.
