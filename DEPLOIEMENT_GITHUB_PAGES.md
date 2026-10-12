# Déploiement GitHub Pages — L’Autre Joueur V2

## Point d’entrée
- `index.html` est la page d’accueil publiée : elle redirige vers `v2-prototype.html`.
- `v2-prototype.html` ouvre le prototype V2 et son menu de campagne.
- `v2-chapter01.html` à `v2-chapter12.html` sont les 12 prototypes de chapitre présents.
- `v1.html` permet d’ouvrir la V1 conservée.

## Publier cette archive
1. Décompresse l’archive sur ton ordinateur.
2. Ouvre le dépôt GitHub `l-autre-joueur`.
3. Téléverse **le contenu** de l’archive directement dans la racine de la branche publiée. Ne téléverse ni le ZIP seul, ni un dossier parent.
4. Vérifie que `index.html`, `v2-prototype.html`, `v2-prototype.js` et `v2-prototype.css` sont côte à côte à la racine.
5. Valide les modifications par un commit.
6. Dans **Settings → Pages**, vérifie la branche et le dossier réellement publiés.
7. Attends la réussite du déploiement dans **Actions**.
8. Ouvre le site en navigation privée ou force le rechargement.

## URLs de contrôle
- Accueil : https://9vckvzwgkv-droid.github.io/l-autre-joueur/
- Prototype V2 : https://9vckvzwgkv-droid.github.io/l-autre-joueur/v2-prototype.html
- Chapitre 12 : https://9vckvzwgkv-droid.github.io/l-autre-joueur/v2-chapter12.html
- V1 conservée : https://9vckvzwgkv-droid.github.io/l-autre-joueur/v1.html

## Si le site semble encore afficher la V1
- Si l’accueil affiche l’écran « VERSION 2 · CAMPAGNE », `index.html` V2 est publié.
- Si l’URL directe `v2-prototype.html` fonctionne, mais pas la redirection, teste en navigation privée et vérifie l’URL finale du navigateur.
- Si l’URL directe renvoie une 404, le fichier est absent de la source publiée ou le déploiement n’a pas abouti.
- Vérifie que GitHub Pages publie bien la branche/dossier où les fichiers ont été copiés.

## Limites
Les contrôles syntaxiques et références locales ne remplacent pas un test de jeu dans un navigateur réel. Les chapitres 13 à 36 restent à créer et valider ; la présence de leurs thèmes dans la campagne ne signifie pas qu’ils sont jouables.
