FROM node:18-alpine
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL verbose

# Installer concurrently globalement
RUN npm install -g concurrently

# Copier les fichiers package.json
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Copier les modules préinstallés
COPY npm_modules_cache/frontend ./frontend/node_modules
COPY npm_modules_cache/backend ./backend/node_modules

COPY . .

EXPOSE 3001 5173

CMD ["npm", "run", "dev"]