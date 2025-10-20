# 📁 Organisation du Projet - Outil de Pré-Production Vidéo

## 🎯 Structure Actuelle

```
📁 Review Development Project Documents Before Proceeding with Code/
├── 📁 project/                    # 🚀 CODE SOURCE PRINCIPAL
│   ├── client/                    # Frontend React + TypeScript
│   ├── server/                    # Backend Node.js + tRPC
│   ├── drizzle/                   # Base de données (Drizzle ORM)
│   ├── package.json               # Dépendances et scripts
│   └── vite.config.ts            # Configuration Vite
│
└── 📁 Fichiers_Non_Necessaires/   # 📚 Documentation et Archives
    ├── 🎬OutildePré-ProductionVidéo-GuideDéveloppeur.md
    ├── 🗺️Roadmap-OutildePré-ProductionVidéo.md
    ├── *.zip, *.tar.gz           # Archives du projet
    ├── *.md                      # Documentation
    ├── Améliorations UX/         # Dossier UX/UI
    └── ...                       # Autres fichiers non essentiels
```

## 🚀 Pour Démarrer le Développement

### 1. Naviguer vers le projet
```bash
cd "/Users/marrhynwassen/Downloads/Review Development Project Documents Before Proceeding with Code/project"
```

### 2. Installer les dépendances
```bash
pnpm install
```

### 3. Configurer la base de données
```bash
pnpm db:push
```

### 4. Démarrer en mode développement
```bash
pnpm dev
```

### 5. Accéder à l'application
- **Frontend** : http://localhost:5000
- **API Backend** : http://localhost:5000/api

## 📋 Scripts Disponibles

- `pnpm dev` - Mode développement (hot reload)
- `pnpm build` - Build pour production
- `pnpm start` - Démarrer en production
- `pnpm check` - Vérifier les types TypeScript
- `pnpm format` - Formater le code
- `pnpm test` - Lancer les tests
- `pnpm db:push` - Pousser le schéma vers la BDD

## 🎨 Architecture

- **Frontend** : React 19 + TypeScript + Vite + TailwindCSS
- **Backend** : Node.js + tRPC (API type-safe)
- **Base de données** : TiDB Cloud + Drizzle ORM
- **UI Components** : shadcn/ui
- **Routing** : Wouter

## 📚 Documentation

Toute la documentation détaillée se trouve dans le dossier `Fichiers_Non_Necessaires/` :
- Guide développeur complet
- Roadmap et backlog
- Stratégie UX/UI 2025
- Principes de conception
- Archives du projet

## ✅ Avantages de cette Organisation

1. **Code Source Propre** : Seul le code nécessaire au fonctionnement
2. **Documentation Séparée** : Accès facile aux guides et stratégies
3. **Développement Efficace** : Focus sur le code source principal
4. **Maintenance Simplifiée** : Structure claire et organisée

---
**Date de réorganisation** : Octobre 2025  
**Projet** : Outil de Pré-Production Vidéo
