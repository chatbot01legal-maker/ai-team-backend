# Usa la imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de dependencia y los instala
COPY package*.json ./
RUN npm ci --production

# Copia el resto de los archivos de la aplicación
COPY . .

# Comando de inicio: FUERZA la ejecución del script de diagnóstico
CMD ["node", "test_server.js"]
