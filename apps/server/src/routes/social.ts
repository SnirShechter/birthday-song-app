import { Hono } from 'hono';
import { socialScanSchema } from '@birthday-song/shared';
import { scanSocialProfile } from '../services/mock-social.js';
import { generalRateLimit } from '../middleware/rate-limit.js';

const social = new Hono();

social.use('*', generalRateLimit);

// POST /api/social/autofill - Scan a social profile and return autofill data
social.post('/autofill', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = socialScanSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          error: 'Validation error',
          details: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        400,
      );
    }

    const profile = await scanSocialProfile(parsed.data.url);

    return c.json({ success: true, profile });
  } catch (err) {
    console.error('[Social] Autofill error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default social;
