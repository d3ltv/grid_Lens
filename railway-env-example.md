# 🚂 Variables d'Environnement Railway

## Variables Requises pour le Déploiement

Ajoutez ces variables dans votre dashboard Railway (Variables tab) :

### Base de Données (OBLIGATOIRE)
```bash
DATABASE_URL=mysql://username:password@host:port/database_name
```

### AWS S3 (OBLIGATOIRE pour le stockage de fichiers)
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Configuration Application (OBLIGATOIRE)
```bash
NODE_ENV=production
PORT=3000
```

### OAuth (si utilisé)
```bash
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
VITE_APP_ID=your-app-id
```

### Interface Utilisateur (RECOMMANDÉ)
```bash
VITE_APP_TITLE=Studio Flow
VITE_APP_LOGO=https://your-logo-url.com/logo.png
VITE_ANALYTICS_ENDPOINT=https://analytics.your-domain.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Instructions d'Installation

1. Allez sur [railway.app](https://railway.app)
2. Créez un nouveau projet
3. Connectez votre repository GitHub
4. Allez dans **Variables** tab
5. Ajoutez chaque variable avec sa valeur
6. Railway déploiera automatiquement

## Base de Données Railway

Railway peut aussi héberger votre base de données MySQL :

1. Dans votre projet Railway
2. Cliquez sur **+ New**
3. Sélectionnez **Database** → **MySQL**
4. Railway créera automatiquement la variable `DATABASE_URL`

## Notes Importantes

- Railway détecte automatiquement Node.js et pnpm
- Le port est automatiquement assigné par Railway
- Les variables `VITE_*` sont accessibles côté client
- Les autres variables sont uniquement côté serveur
- Railway gère automatiquement les redémarrages en cas d'erreur
