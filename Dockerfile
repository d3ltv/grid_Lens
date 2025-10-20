# Utiliser Node.js 20 LTS
FROM node:20-alpine

# Installer pnpm
RUN npm install -g pnpm

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Construire l'application
RUN pnpm build

# Exposer le port
EXPOSE 3000

# Définir la variable d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Commande de démarrage
CMD ["pnpm", "start"]
