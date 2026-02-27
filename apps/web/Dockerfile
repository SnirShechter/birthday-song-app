# ============================================================
# Birthday Song App - Web Dockerfile (Production)
# ============================================================

# --- Build stage ---
FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile || pnpm install

COPY packages/shared/ ./packages/shared/
COPY apps/web/ ./apps/web/

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm --filter @birthday-song/shared build 2>/dev/null || true
RUN pnpm --filter @birthday-song/web build

# --- Production stage ---
FROM nginx:alpine AS production

COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Nginx config: SPA routing + reverse proxy to backend
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # API reverse proxy to backend
    location /api/ {
        proxy_pass http://server:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Mock checkout proxy
    location /mock-checkout {
        proxy_pass http://server:3000/mock-checkout;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Webhook proxy
    location /api/webhooks/ {
        proxy_pass http://server:3000/api/webhooks/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Health check
    location /health {
        proxy_pass http://server:3000/health;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
