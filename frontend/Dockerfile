# Utiliser une image Node.js officielle
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code dans le conteneur
COPY . .

# Exposer le port de développement Next.js
EXPOSE 3000

# Commande pour démarrer Next.js
CMD ["npm", "run", "dev"]
