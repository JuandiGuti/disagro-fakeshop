# backend/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Copia todo el cod
COPY . .


ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

EXPOSE 3001

CMD ["node", "server.js"]
