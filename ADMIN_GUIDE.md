# Instructions pour l'Installation et l'Utilisation du Panneau d'Administration

## Prérequis

1. **XAMPP** installé et démarré (Apache + MySQL)
2. **Node.js** installé
3. **npm** installé

## Installation

### 1. Configuration de la Base de Données

1. Démarrez XAMPP et assurez-vous que MySQL est en cours d'exécution
2. Ouvrez phpMyAdmin dans votre navigateur: `http://localhost/phpmyadmin`
3. Importez le fichier `api/schema.sql`:
   - Cliquez sur "Importer" dans phpMyAdmin
   - Sélectionnez le fichier `schema.sql`
   - Cliquez sur "Exécuter"

Cela créera automatiquement:
- La base de données `portfolio_db`
- Toutes les tables nécessaires
- Un utilisateur admin par défaut
- Les données existantes de votre portfolio

### 2. Configuration du Dossier Uploads

Créez un dossier `uploads` à la racine du projet et donnez-lui les permissions appropriées:

```bash
mkdir uploads
chmod 777 uploads
```

### 3. Démarrage de l'Application

```bash
npm install
npm run dev
```

## Utilisation

### Accès au Panneau d'Administration

1. Sur la page d'accueil de votre portfolio, cliquez sur l'icône de cadenas (🔒) dans la navigation
2. Utilisez les identifiants par défaut:
   - **Username**: `admin`
   - **Password**: `admin123`

### Fonctionnalités Disponibles

#### Dashboard
- Vue d'ensemble des statistiques (nombre de projets, formations, messages)

#### Gestion des Projets
- **Ajouter**: Cliquez sur "Ajouter", remplissez le formulaire
- **Modifier**: Cliquez sur l'icône crayon (✏️) sur un projet
- **Supprimer**: Cliquez sur l'icône poubelle (🗑️)
- **Upload d'image**: Utilisez le bouton "Uploader" dans le formulaire

#### Gestion des Formations
- Ajoutez, modifiez ou supprimez vos diplômes et formations

#### Gestion des Expériences
- Gérez vos expériences professionnelles
- Les descriptions supportent plusieurs lignes (une tâche par ligne)

#### Messages de Contact
- Consultez les messages reçus via le formulaire de contact
- Supprimez les messages traités

## Notes Importantes

### Sécurité

> **IMPORTANT**: Pour un environnement de production, vous devez:
> 1. Changer le mot de passe admin par défaut
> 2. Utiliser HTTPS
> 3. Implémenter un vrai système de hashing de mots de passe
> 4. Ajouter une protection CSRF

### URLs API

Les APIs sont configurées pour fonctionner avec:
```
http://localhost/portfolio---al-ghazaly-ahmed%20(1)/api/
```

Si votre projet est dans un autre dossier, vous devrez modifier:
- `LoginPage.tsx` (ligne 20)
- `AdminDashboard.tsx` (ligne 18)

### Upload d'Images

- Formats acceptés: JPG, PNG, GIF, WEBP
- Taille maximale: 5 MB
- Les images sont stockées dans `/uploads/`

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez les identifiants dans `api/db.php`

### Erreur CORS
- Assurez-vous que les headers CORS sont bien configurés dans les fichiers PHP
- Vérifiez que vous accédez via `localhost` et non `127.0.0.1`

### Images ne s'affichent pas
- Vérifiez les permissions du dossier `uploads/`
- Vérifiez que le chemin est correct dans la base de données

## Structure des Fichiers

```
portfolio/
├── api/
│   ├── auth.php          # Authentification
│   ├── db.php            # Connexion base de données
│   ├── projects.php      # CRUD projets
│   ├── education.php     # CRUD formations
│   ├── experiences.php   # CRUD expériences
│   ├── messages.php      # Gestion messages
│   ├── upload.php        # Upload d'images
│   └── schema.sql        # Schéma de la base de données
├── uploads/              # Dossier pour les images uploadées
├── App.tsx               # Application principale
├── AdminDashboard.tsx    # Interface admin
├── LoginPage.tsx         # Page de connexion
└── constants.tsx         # Données de fallback
```
