# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependências
RUN npm ci 

# Copiar código fonte
COPY src/ ./src/
COPY prisma/ ./prisma/

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar arquivos necessários do estágio de build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"] 