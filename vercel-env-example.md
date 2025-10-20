# 🔧 Variables d'Environnement Vercel

## Variables Requises pour le Déploiement

Ajoutez ces variables dans votre dashboard Vercel (Settings → Environment Variables) :

### Base de Données
```bash
DATABASE_URL=mysql://username:password@host:port/database_name
```

### AWS S3 (pour le stockage de fichiers)
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Configuration Application
```bash
NODE_ENV=production
PORT=5000
```

### OAuth (si utilisé)
```bash
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
VITE_APP_ID=your-app-id
```

### Interface Utilisateur
```bash
VITE_APP_TITLE=Studio Flow
VITE_APP_LOGO=https://your-logo-url.com/logo.png
VITE_ANALYTICS_ENDPOINT=https://analytics.your-domain.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Instructions d'Installation

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez chaque variable avec sa valeur
5. Redéployez votre application

## Notes Importantes

- Les variables commençant par `VITE_` sont accessibles côté client
- Les autres variables sont uniquement côté serveur
- Assurez-vous que votre base de données MySQL est accessible depuis Vercel
- Configurez votre bucket S3 avec les bonnes permissions
