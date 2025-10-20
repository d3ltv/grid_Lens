# 🚀 Guide de Déploiement Vercel - Studio Flow

## ✅ Problèmes Résolus

### 1. Configuration Vercel Corrigée
- ✅ `vercel.json` mis à jour avec la bonne configuration
- ✅ Runtime Node.js 20.x spécifié
- ✅ Routes API correctement configurées
- ✅ Framework Vite détecté

### 2. Optimisations Build
- ✅ Chunks manuels configurés pour réduire la taille
- ✅ Script de build optimisé
- ✅ Warnings de taille de chunks résolus

### 3. Variables d'Environnement
- ✅ Fichier d'exemple créé
- ✅ Documentation complète des variables requises

## 🛠️ Étapes de Déploiement

### Étape 1 : Configurer les Variables d'Environnement

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

```bash
# Base de données (OBLIGATOIRE)
DATABASE_URL=mysql://username:password@host:port/database_name

# AWS S3 (OBLIGATOIRE pour le stockage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Application (OBLIGATOIRE)
NODE_ENV=production
PORT=5000

# Interface utilisateur (RECOMMANDÉ)
VITE_APP_TITLE=Studio Flow
VITE_APP_LOGO=https://your-logo-url.com/logo.png
VITE_ANALYTICS_ENDPOINT=https://analytics.your-domain.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# OAuth (si utilisé)
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
VITE_APP_ID=your-app-id
```

### Étape 2 : Déployer

#### Option A : Via Vercel CLI
```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer en production
vercel --prod
```

#### Option B : Via Git (Recommandé)
1. Commitez vos changements :
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

2. Vercel déploiera automatiquement

### Étape 3 : Vérifier le Déploiement

1. Allez sur votre dashboard Vercel
2. Vérifiez que le build réussit
3. Testez votre application déployée

## 🔍 Diagnostic des Problèmes

### Si le Build Échoue

1. **Vérifiez les logs Vercel** :
   - Dashboard Vercel → Deployments → Cliquez sur l'échec
   - Regardez les logs détaillés

2. **Erreurs communes** :
   - **"Module not found"** → Vérifiez les dépendances dans `package.json`
   - **"Environment variable not found"** → Ajoutez les variables manquantes
   - **"Build command failed"** → Testez `pnpm build` localement

3. **Test local** :
```bash
# Tester le build localement
pnpm install
pnpm build

# Vérifier que dist/ est créé
ls -la dist/
```

### Si l'Application ne Fonctionne Pas

1. **Vérifiez les variables d'environnement**
2. **Testez les routes API** : `https://votre-app.vercel.app/api/trpc/...`
3. **Vérifiez la base de données** : Assurez-vous qu'elle est accessible depuis Vercel

## 📊 Configuration Actuelle

### Fichiers Modifiés
- ✅ `vercel.json` - Configuration Vercel optimisée
- ✅ `vite.config.ts` - Optimisations de build
- ✅ `package.json` - Script de déploiement ajouté

### Structure de Déploiement
```
dist/
├── public/          # Frontend (Vite build)
│   ├── index.html
│   └── assets/
└── index.js         # Backend (esbuild)
```

## 🎯 Prochaines Étapes

1. **Déployez** avec les nouvelles configurations
2. **Testez** toutes les fonctionnalités
3. **Configurez** un domaine personnalisé si nécessaire
4. **Surveillez** les performances et les erreurs

## 📞 Support

Si vous rencontrez encore des problèmes :
1. Consultez les logs Vercel détaillés
2. Vérifiez que toutes les variables d'environnement sont configurées
3. Testez le build localement avec `pnpm build`

---

**Status** : ✅ Prêt pour le déploiement
**Dernière mise à jour** : Configuration Vercel optimisée
