
# Guide de Déploiement Vercel (Important)

Pour que votre panel administrateur fonctionne correctement sur Vercel (sauvegarde des données), vous devez connecter une base de données **Vercel Postgres**.
Le système de fichiers de Vercel est en lecture seule, donc l'ancienne méthode (fichier JSON) ne pouvait pas fonctionner.

## Étape 1 : Créer la Base de Données
1. Allez sur votre tableau de bord Vercel.
2. Cliquez sur votre projet "portfolio-...".
3. Allez dans l'onglet **Storage**.
4. Cliquez sur **Connect Store** -> **Postgres** -> **Create New**.
5. Acceptez les conditions, choisissez la région (ex: frankfurt ou paris si disponible), et cliquez sur **Create**.
6. Une fois créé, assurez-vous que les variables d'environnement (`POSTGRES_URL`, etc.) sont bien ajoutées à votre projet (Vercel le fait automatiquement).

## Étape 2 : Initialiser la Base de Données
Une fois votre site redéployé avec la base de données connectée :
1. Ouvrez votre navigateur.
2. Allez sur l'URL de votre site suivi de `/api/admin/init-db`
   - Exemple : `https://mon-portfolio.vercel.app/api/admin/init-db`
3. Vous devriez voir un message : `{"success":true,"message":"Database initialized successfully"}`.

Cela va créer toutes les tables nécessaires (Projets, Compétences, etc.) et ajouter l'utilisateur admin par défaut.

## Admin
- **URL** : `/admin`
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

## Note sur les Images et le CV
Actuellement, l'upload d'images et de CV ne fonctionnera pas parfaitement sur Vercel car le stockage de fichiers local est impossible.
Pour corriger cela, il faudrait utiliser **Vercel Blob** (service de stockage de fichiers).
En attendant, vous pouvez :
- Héberger vos images ailleurs (Imgur, Cloudinary...) et coller l'URL directement.
- Mettre votre CV dans le dossier `public` avant de déployer.
