# Utilisation d'une image Node.js légère
FROM node:20-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY package*.json ./
COPY . .

# Installation des dépendances
RUN npm install

# Exposition des ports si nécessaire (ex: API locale)
# EXPOSE 3000

# Commande pour exécuter le script
CMD ["node", "proxy_for_adguarddns.js"]