# Utilise une image Node.js légère
FROM node:latest

# Définit le répertoire de travail
WORKDIR /app

# Copie package.json et package-lock.json pour optimiser le cache
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Installe ts-node et ts-node-dev globalement
RUN npm install -g ts-node ts-node-dev

# Copie le reste du code
COPY . .

# Expose le port de l'API
EXPOSE 5000

# Commande par défaut pour le développement
CMD ["npm", "run", "dev"]
