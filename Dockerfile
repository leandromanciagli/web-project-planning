# Etapa 1: compilar Angular
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --project web-project-planning --configuration production

# Etapa 2: servir con Nginx
FROM nginx:alpine

# Copiar la build de Angular al contenedor Nginx
COPY --from=build /app/dist/web-project-planning/browser /usr/share/nginx/html

# Copiar config de Nginx (para manejar rutas en Angular)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
