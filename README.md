# Portfolio Admin Panel - Next.js

## 🚀 Déploiement sur Vercel

Ce projet est maintenant prêt pour le déploiement sur Vercel !

### Migration Complète

✅ **Backend migré de PHP vers Next.js API Routes**
- Toutes les APIs sont maintenant des serverless functions
- Stockage des données via fichiers JSON (peut être migré vers une vraie DB plus tard)
- Pas besoin de serveur PHP ou MySQL

### Structure du Projet

```
portfolio/
├── app/
│   ├── api/                # API Routes (serverless)
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── education/
│   │   ├── experiences/
│   │   ├── messages/
│   │   └── upload/
│   ├── page.tsx            # Page principale
│   ├── layout.tsx          # Layout racine
│   └── globals.css         # Styles globaux
├── components/             # Composants React
│   ├── AdminDashboard.tsx
│   ├── LoginPage.tsx
│   ├── constants.tsx
│   └── types.ts
├── lib/
│   └── db.ts              # Utilitaire base de données JSON
├── public/
│   └── uploads/           # Images uploadées
└── data/
    └── db.json            # Base de données JSON
```

### Démarrage Local

```bash
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

### Déploiement sur Vercel

#### Option 1: Via GitHub (Recommandé)

1. Poussez votre code sur GitHub:
```bash
git init
git add .
git commit -m "Migration to Next.js"
git remote add origin <votre-repo-github>
git push -u origin main
```

2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur "New Project"
4. Importez votre repository GitHub
5. Vercel détectera automatiquement Next.js
6. Cliquez sur "Deploy"

#### Option 2: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Suivez les instructions à l'écran.

### Fonctionnalités

- ✅ **Authentification** - Login admin sécurisé
- ✅ **Gestion des Projets** - CRUD complet
- ✅ **Gestion des Formations** - CRUD complet
- ✅ **Gestion des Expériences** - CRUD complet
- ✅ **Messages de Contact** - Consultation et suppression
- ✅ **Upload d'Images** - Stockage local
- ✅ **API Serverless** - Pas besoin de serveur backend
- ✅ **Responsive Design** - Fonctionne sur tous les appareils

### Accès Admin

- **URL**: `https://votre-site.vercel.app` → Cliquez sur 🔒
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Important**: Changez le mot de passe par défaut en production !

### Base de Données

Actuellement, les données sont stockées dans `data/db.json`. Pour une application en production, vous pouvez migrer vers:

- **Vercel Postgres** (déprécié, utilisez Neon)
- **MongoDB Atlas** (gratuit jusqu'à 512MB)
- **Supabase** (PostgreSQL gratuit)
- **PlanetScale** (MySQL serverless)

### Variables d'Environnement

Si vous migrez vers une vraie base de données, ajoutez dans Vercel:

```
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_URL=https://votre-site.vercel.app
```

### Prochaines Étapes

1. ✅ Migration PHP → Next.js (Terminé)
2. ⏳ Tester localement
3. ⏳ Déployer sur Vercel
4. ⏳ (Optionnel) Migrer vers une vraie base de données
5. ⏳ Changer le mot de passe admin

### Support

Pour toute question, consultez:
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Guide de déploiement](https://nextjs.org/learn/basics/deploying-nextjs-app)

---

**Développé avec ❤️ pour Ahmed Al Ghazaly**
