# 🚂 Guide de Déploiement Railway - Studio Flow

## ✅ Configuration Railway Prête

### Fichiers Créés
- ✅ `railway.json` - Configuration Railway
- ✅ `Dockerfile` - Image Docker optimisée
- ✅ `.dockerignore` - Optimisation du build
- ✅ `railway-env-example.md` - Variables d'environnement

## 🚀 Étapes de Déploiement

### Étape 1 : Créer un Projet Railway

1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez sur **"New Project"**
4. Sélectionnez **"Deploy from GitHub repo"**
5. Choisissez votre repository `grid_Lens`

### Étape 2 : Configurer les Variables d'Environnement

1. Dans votre projet Railway
2. Allez dans l'onglet **"Variables"**
3. Ajoutez les variables suivantes :

#### Variables Obligatoires
```bash
# Base de données
DATABASE_URL=mysql://username:password@host:port/database_name

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Application
NODE_ENV=production
PORT=3000
```

#### Variables Optionnelles
```bash
# Interface utilisateur
VITE_APP_TITLE=Studio Flow
VITE_APP_LOGO=https://your-logo-url.com/logo.png
VITE_ANALYTICS_ENDPOINT=https://analytics.your-domain.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# OAuth (si utilisé)
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
VITE_APP_ID=your-app-id
```

### Étape 3 : Base de Données (Optionnel)

Si vous n'avez pas de base de données MySQL :

1. Dans votre projet Railway
2. Cliquez sur **"+ New"**
3. Sélectionnez **"Database"** → **"MySQL"**
4. Railway créera automatiquement `DATABASE_URL`

### Étape 4 : Déploiement Automatique

Railway déploiera automatiquement quand vous poussez sur GitHub :

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

## 🔧 Configuration Technique

### Railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Dockerfile
- Node.js 20 Alpine
- pnpm pour la gestion des dépendances
- Build optimisé avec cache des layers
- Port 3000 exposé

## 🔍 Monitoring et Debugging

### Logs en Temps Réel
1. Dans Railway Dashboard
2. Cliquez sur votre service
3. Onglet **"Deployments"** → **"View Logs"**

### Health Check
- Railway vérifie automatiquement `GET /`
- Timeout de 100ms
- Redémarrage automatique en cas d'échec

### Métriques
- CPU, RAM, Network
- Logs d'erreurs
- Temps de réponse

## 🎯 Avantages Railway vs Vercel

### Railway ✅
- **Full-stack** : Frontend + Backend Node.js
- **Base de données** intégrée
- **Websockets** supportés
- **Variables d'environnement** faciles
- **Logs** détaillés
- **Scaling** automatique

### Vercel ❌ (pour votre cas)
- Frontend seulement
- Pas de backend Node.js persistant
- Pas de base de données intégrée

## 🚨 Résolution de Problèmes

### Build Échoue
1. Vérifiez les logs Railway
2. Assurez-vous que `pnpm-lock.yaml` existe
3. Vérifiez les variables d'environnement

### Application ne Démarre Pas
1. Vérifiez `DATABASE_URL`
2. Vérifiez les variables AWS S3
3. Regardez les logs de démarrage

### Erreurs de Base de Données
1. Vérifiez la connexion MySQL
2. Assurez-vous que la base existe
3. Vérifiez les permissions

## 📊 Structure de Déploiement

```
Railway Service
├── Frontend (Vite build) → /dist/public/
├── Backend (Express) → /dist/index.js
├── Base de données MySQL (optionnel)
└── Variables d'environnement
```

## 🎉 Prochaines Étapes

1. **Déployez** sur Railway
2. **Testez** toutes les fonctionnalités
3. **Configurez** un domaine personnalisé
4. **Surveillez** les performances
5. **Configurez** les backups de base de données

## 📞 Support

- **Railway Docs** : [docs.railway.app](https://docs.railway.app)
- **Community** : [Railway Discord](https://discord.gg/railway)
- **Status** : [status.railway.app](https://status.railway.app)

---

**Status** : ✅ Prêt pour le déploiement Railway
**Dernière mise à jour** : Configuration complète Railway
