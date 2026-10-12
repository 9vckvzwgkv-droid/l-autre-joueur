# Déploiement GitHub Pages — L’Autre Joueur V2

## Entrées du site
- `index.html` : accueil V2 avec des liens explicites vers la campagne, le chapitre 1 et la V1.
- `v2-prototype.html#campagne` : ouvre le menu de campagne des 36 chapitres.
- `v2-chapter01.html` à `v2-chapter13.html` : les 13 prototypes de chapitre présents dans cette archive.
- `v1.html` : accès à la version V1 conservée.

## Publier l’archive
1. Décompresse le ZIP.
2. Ouvre le dépôt GitHub `9vckvzwgkv-droid/l-autre-joueur`.
3. Téléverse le **contenu** décompressé directement dans la racine de la branche publiée. Ne téléverse pas le ZIP lui-même ni un dossier parent.
4. Vérifie que `index.html`, `v2-prototype.html`, `v2-prototype.js` et `v2-prototype.css` sont à la racine.
5. Valide les changements par un commit.
6. Dans **Settings → Pages**, vérifie la branche et le dossier source réellement publiés.
7. Attends que le workflow de publication se termine dans **Actions**.
8. Teste en navigation privée ou avec un rechargement forcé.

## URLs de contrôle
- Accueil : https://9vckvzwgkv-droid.github.io/l-autre-joueur/
- Campagne : https://9vckvzwgkv-droid.github.io/l-autre-joueur/v2-prototype.html#campagne
- Chapitre 1 : https://9vckvzwgkv-droid.github.io/l-autre-joueur/v2-chapter01.html
- Chapitre 13 : https://9vckvzwgkv-droid.github.io/l-autre-joueur/v2-chapter13.html
- V1 : https://9vckvzwgkv-droid.github.io/l-autre-joueur/v1.html

## Diagnostic si l’ancienne version apparaît
- Contrôle d’abord la source réellement publiée dans **Settings → Pages** et le dernier déploiement réussi dans **Actions**.
- Si l’accueil est ancien mais les URL directes V2 fonctionnent, teste en navigation privée et vérifie le cache.
- Si `v2-prototype.html` ou les chapitres renvoient une 404, vérifie que les fichiers sont bien présents dans la racine publiée.

## Limites des contrôles
Le contrôle syntaxique JavaScript et la vérification des références locales ne remplacent pas un test manuel en navigateur. Cette archive contient les chapitres 1 à 13 ; les chapitres 14 à 36 restent à développer et à valider individuellement. Le dépôt GitHub n’est pas modifié automatiquement par la création de cette archive.
