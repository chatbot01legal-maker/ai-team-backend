# Dockerfile para Render - Node 20 Alpine
FROM node:20-alpine

# Crear carpeta de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev

# Copiar todo el resto del proyecto
COPY . .

# Exponer puerto de la app
EXPOSE 10000

# Comando de arranque
CMD ["node", "server.cjs"]
