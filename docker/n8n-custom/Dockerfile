FROM n8nio/n8n:latest

# Créer un répertoire temporaire avec les bonnes permissions dès le départ
RUN mkdir -p /tmp/n8n-module && chown -R node:node /tmp/n8n-module

# Copier les fichiers en tant qu'utilisateur node
USER node
WORKDIR /tmp/n8n-module

# Nous allons installer les dépendances et construire à partir de zéro
COPY --chown=node:node ./n8n-linkedin-node/package.json ./
COPY --chown=node:node ./n8n-linkedin-node/tsconfig.json ./
COPY --chown=node:node ./n8n-linkedin-node/index.js ./
COPY --chown=node:node ./n8n-linkedin-node/src ./src
COPY --chown=node:node ./n8n-linkedin-node/gulpfile.js ./

# Installer les dépendances et construire
RUN pnpm install && pnpm run build

# Revenir à l'utilisateur root pour l'installation globale
USER root
RUN npm install -g /tmp/n8n-module

# Nettoyage
RUN rm -rf /tmp/n8n-module

# Revenir à l'utilisateur node et au répertoire standard
USER node
WORKDIR /data