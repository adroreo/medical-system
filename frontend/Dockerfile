# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json .
RUN npm install

# Copiar código fuente
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
