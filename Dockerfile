FROM node:22-slim AS deps
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci

  FROM node:22-slim AS build
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY package*.json ./
  COPY tsconfig.json tsup.config.ts ./
  COPY prisma ./prisma
  COPY src ./src

  # Gera o Prisma Client (necessário se você usa prisma)
  RUN npx prisma generate

  # Executa o build do projeto (gera /dist)
  RUN npm run build

  # Remove dependências de desenvolvimento para reduzir imagem final
  RUN npm prune --production

  # Stage para executar migrate/seed dentro do Docker (usa devDeps)
  FROM node:22-slim AS tools
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY package*.json ./
  COPY tsconfig.json tsup.config.ts ./
  COPY prisma ./prisma
  COPY src ./src
  RUN npx prisma generate

  FROM node:22-slim AS runner
  WORKDIR /app
  ENV NODE_ENV=production

  # Dependências necessárias em runtime para o Prisma
  RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

  # copia apenas o necessário da etapa de build
  COPY --from=build /app/dist ./dist
  COPY --from=build /app/node_modules ./node_modules
  COPY package*.json ./

  EXPOSE 3000
  CMD ["node", "dist/main/server.js"]
