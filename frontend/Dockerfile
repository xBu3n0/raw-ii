FROM node:25 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

# 
FROM nginx:1.29-alpine AS prod

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/out ./

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
