# 1. Usar una imagen base oficial de Node.js (versión 18, ligera)
FROM node:18-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiar los archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./

# 4. Instalar las dependencias del proyecto
RUN npm install

# 5. Copiar el resto de los archivos de la aplicación (en este caso, server.js)
COPY . .

# 6. Exponer el puerto en el que corre el servidor (según server.js)
EXPOSE 3001

# 7. Definir el comando para iniciar la aplicación (usa el script de package.json)
CMD [ "npm", "start" ]