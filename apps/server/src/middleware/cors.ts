import { cors } from 'hono/cors';
import type { MiddlewareHandler } from 'hono';

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const corsMiddleware: MiddlewareHandler = cors({
  origin: CORS_ORIGIN.split(',').map((o) => o.trim()),
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
});
