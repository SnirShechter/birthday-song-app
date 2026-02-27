import type { MiddlewareHandler, Context, Next } from 'hono';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store: Map<string, RateLimitEntry> = new Map();

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 60_000);

function getClientIp(c: Context): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    'unknown'
  );
}

function createRateLimiter(maxRequests: number, windowMs: number): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const ip = getClientIp(c);
    const key = `${ip}:${maxRequests}`;
    const now = Date.now();

    let entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    entry.count++;

    // Set rate limit headers
    const remaining = Math.max(0, maxRequests - entry.count);
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());
    c.header('X-RateLimit-Reset', resetSeconds.toString());

    if (entry.count > maxRequests) {
      return c.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${resetSeconds} seconds.`,
          retryAfter: resetSeconds,
        },
        429,
      );
    }

    await next();
  };
}

// General rate limit: 30 requests per minute per IP
export const generalRateLimit: MiddlewareHandler = createRateLimiter(30, 60_000);

// Generation rate limit: 10 requests per minute per IP (for AI generation endpoints)
export const generationRateLimit: MiddlewareHandler = createRateLimiter(10, 60_000);
