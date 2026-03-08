FROM node:25 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

# 
FROM node:25 AS prod

WORKDIR /app

COPY --from=builder package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 80

CMD [ "npm", "run", "start:prod" ]
