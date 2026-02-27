FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* bun.lockb* ./
RUN npm install -g bun && bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g bun && bun run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
RUN npm install -g bun

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy drizzle migrations + config + deps for migrate
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/lib/db ./src/lib/db

EXPOSE 3000
CMD ["node", "server.js"]
