# 🚀 Guide de Déploiement Vercel - Studio Flow

## 📋 Prérequis

1. **Compte Vercel** : [vercel.com](https://vercel.com)
2. **Node.js 20.19+** (recommandé 22.12+)
3. **pnpm** installé globalement
4. **Base de données** configurée (TiDB Cloud ou MySQL)

## 🛠️ Configuration Vercel

### 1. Fichiers de Configuration Créés

- ✅ `vercel.json` - Configuration Vercel
- ✅ `.vercelignore` - Fichiers à ignorer
- ✅ `env.example` - Variables d'environnement
- ✅ `package.json` - Scripts de build

### 2. Variables d'Environnement Requises

Dans le dashboard Vercel, ajoutez ces variables :

```bash
# Base de données
DATABASE_URL=mysql://username:password@host:port/database_name

# AWS S3 (pour les images)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Application
NODE_ENV=production
VITE_APP_TITLE=Studio Flow
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

## 🚀 Étapes de Déploiement

### 1. Préparer le Projet

```bash
# Naviguer vers le projet
cd "/Users/marrhynwassen/Downloads/Review Development Project Documents Before Proceeding with Code/project"

# Installer les dépendances
pnpm install

# Tester le build local
pnpm build
```

### 2. Déployer sur Vercel

**Option A : Via CLI Vercel**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les instructions
```

**Option B : Via Dashboard Vercel**
1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer "New Project"
3. Importer depuis GitHub (recommandé)
4. Sélectionner le dossier `project/`
5. Configurer les variables d'environnement
6. Déployer

### 3. Configuration du Build

Vercel détectera automatiquement :
- **Framework** : Vite
- **Build Command** : `pnpm build`
- **Output Directory** : `dist/public`
- **Install Command** : `pnpm install`

## 🔧 Résolution des Problèmes

### Erreur 404 NOT_FOUND

**Cause** : Vercel ne trouve pas les fichiers
**Solution** :
1. Vérifier que le déploiement pointe vers le dossier `project/`
2. S'assurer que `vercel.json` est présent
3. Vérifier que le build fonctionne localement

### Erreur de Build

**Cause** : Variables d'environnement manquantes
**Solution** :
1. Ajouter toutes les variables dans Vercel
2. Redéployer après ajout des variables

### Erreur de Base de Données

**Cause** : Connexion BDD échouée
**Solution** :
1. Vérifier `DATABASE_URL` dans Vercel
2. S'assurer que la BDD accepte les connexions externes
3. Tester la connexion localement

## 📊 Monitoring

### Logs Vercel
```bash
# Voir les logs en temps réel
vercel logs

# Logs d'une fonction spécifique
vercel logs --function=server/_core/index.ts
```

### Métriques
- **Performance** : Vercel Analytics
- **Erreurs** : Vercel Functions Logs
- **Usage** : Dashboard Vercel

## 🎯 URLs de Déploiement

- **Production** : `https://your-project.vercel.app`
- **Preview** : `https://your-project-git-branch.vercel.app`
- **API** : `https://your-project.vercel.app/api`

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Build local fonctionne (`pnpm build`)
- [ ] Base de données accessible
- [ ] AWS S3 configuré
- [ ] Domaine personnalisé (optionnel)
- [ ] SSL/HTTPS activé (automatique)

## 🆘 Support

En cas de problème :
1. Vérifier les logs Vercel
2. Tester le build local
3. Vérifier les variables d'environnement
4. Consulter la documentation Vercel

---
**Projet** : Studio Flow - Outil de Pré-Production Vidéo  
**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2025
