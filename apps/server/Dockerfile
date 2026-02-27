# ============================================================
# Birthday Song App - Server Dockerfile
# ============================================================

# --- Base stage ---
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# --- Dependencies stage ---
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* turbo.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/
RUN pnpm install --frozen-lockfile || pnpm install

# --- Build stage ---
FROM deps AS build
ARG CACHE_BUST=1
COPY packages/shared/ packages/shared/
COPY apps/server/ apps/server/
RUN pnpm --filter @birthday-song/shared build 2>/dev/null || true
RUN pnpm --filter @birthday-song/server build

# --- Development stage ---
FROM deps AS development
COPY packages/shared/ packages/shared/
COPY apps/server/ apps/server/
COPY mock-assets/ mock-assets/

ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "--filter", "@birthday-song/server", "dev"]

# --- Production stage (must be last for default docker build) ---
FROM node:22-alpine AS production
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/

# Copy built artifacts
COPY --from=build /app/packages/shared/ packages/shared/
COPY --from=build /app/apps/server/dist/ apps/server/dist/
COPY --from=build /app/node_modules/ node_modules/
COPY --from=build /app/apps/server/node_modules/ apps/server/node_modules/
COPY --from=build /app/packages/shared/node_modules/ packages/shared/node_modules/

# Copy mock assets
COPY mock-assets/ mock-assets/

# Copy SQL files for database initialization
COPY apps/server/src/db/schema.sql apps/server/src/db/schema.sql
COPY apps/server/src/db/seed.sql apps/server/src/db/seed.sql

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "apps/server/dist/index.js"]
