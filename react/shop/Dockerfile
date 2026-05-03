FROM node:18-alpine as build

WORKDIR /app

# 1. Указываем порт 8000, где реально сидит бэкенд
ENV REACT_APP_URL="http://localhost:8000/api"
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:stable-alpine
# Копируем билд в папку, которую Nginx раздает по умолчанию
COPY --from=build /app/build /usr/share/nginx/html

# 2. Возвращаем порт 80, так как Nginx в этом образе настроен на него
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]