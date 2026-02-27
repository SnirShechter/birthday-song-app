FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy workspace config
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./

# Copy package.json files for all workspace packages
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source files
COPY packages/shared/ ./packages/shared/
COPY apps/web/ ./apps/web/

EXPOSE 5173

# Dev mode
CMD ["pnpm", "--filter", "@birthday-song/web", "dev", "--host"]
