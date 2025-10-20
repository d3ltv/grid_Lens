#!/bin/bash

# 🚀 Script de Déploiement Studio Flow
# Usage: ./scripts/deploy.sh

set -e

echo "🎬 Studio Flow - Déploiement Vercel"
echo "=================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le dossier project/"
    exit 1
fi

# Vérifier Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="20.19.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "⚠️  Attention: Node.js $NODE_VERSION détecté. Version recommandée: 20.19+"
    echo "   Le build peut échouer avec cette version."
fi

echo "📦 Installation des dépendances..."
pnpm install

echo "🔍 Vérification des fichiers de configuration..."
if [ ! -f "vercel.json" ]; then
    echo "❌ Erreur: vercel.json manquant"
    exit 1
fi

if [ ! -f ".vercelignore" ]; then
    echo "❌ Erreur: .vercelignore manquant"
    exit 1
fi

echo "🏗️  Build de l'application..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "🔍 Vérification des fichiers de build..."
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Dossier dist/ non créé"
    exit 1
fi

if [ ! -f "dist/index.js" ]; then
    echo "❌ Erreur: dist/index.js manquant"
    exit 1
fi

if [ ! -d "dist/public" ]; then
    echo "❌ Erreur: dist/public/ manquant"
    exit 1
fi

echo "✅ Fichiers de build vérifiés!"

echo ""
echo "🚀 Prêt pour le déploiement Vercel!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. vercel login"
echo "2. vercel"
echo "3. Configurer les variables d'environnement dans Vercel"
echo ""
echo "📚 Consultez README-DEPLOYMENT.md pour plus de détails"
echo ""
echo "🎬 Studio Flow - Déploiement prêt!"
