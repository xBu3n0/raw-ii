FROM node:25-alpine AS BUILDER

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 
FROM node:25-alpine AS PRODUCTION

WORKDIR /app

COPY --from=BUILDER package*.json ./
COPY --from=BUILDER /app/dist ./dist

EXPOSE 80

CMD [ "npm", "run", "start:prod" ]
