FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate


FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl \
	&& npm install -g pm2

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/generated ./generated
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
COPY swagger.json ./
COPY ecosystem.config.cjs ./ecosystem.config.cjs
COPY pm2-entry.mjs ./pm2-entry.mjs
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh \
	&& mkdir -p uploads

EXPOSE 8031

ENTRYPOINT ["./docker-entrypoint.sh"]
