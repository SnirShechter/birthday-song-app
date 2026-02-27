import { Hono } from 'hono';
import { generateLyricsSchema, updateLyricsSchema } from '@birthday-song/shared';
import type { QuestionnaireAnswers } from '@birthday-song/shared';
import { db } from '../db/client.js';
import { generateMockLyrics } from '../services/mock-lyrics.js';
import { generationRateLimit, generalRateLimit } from '../middleware/rate-limit.js';

const lyrics = new Hono();

// POST /api/orders/:id/generate-lyrics - Generate 3 lyric variations
lyrics.post('/:id/generate-lyrics', generationRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const parsed = generateLyricsSchema.safeParse(body);

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

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const { style } = parsed.data;
    const answers: QuestionnaireAnswers = order.questionnaireRaw;

    // Generate lyrics directly (no queue for demo)
    const variations = await generateMockLyrics(style, answers);

    // Save all variations to DB
    const savedLyrics = [];
    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      const saved = await db.createLyrics({
        orderId,
        model: variation.model,
        styleVariant: style,
        content: variation.content,
        selected: i === 0, // First variation selected by default
      });
      savedLyrics.push(saved);
    }

    // Update order status and selected style
    await db.updateOrder(orderId, {
      status: 'lyrics_ready',
      selectedStyle: style,
    });

    await db.createEvent({
      orderId,
      eventType: 'lyrics_generated',
      payload: { style, count: variations.length },
    });

    return c.json({
      success: true,
      lyrics: savedLyrics,
    });
  } catch (err) {
    console.error('[Lyrics] Generate error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/orders/:id/lyrics - Get all lyric variations for an order
lyrics.get('/:id/lyrics', generalRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const allLyrics = await db.getLyrics(orderId);

    return c.json({
      success: true,
      lyrics: allLyrics,
    });
  } catch (err) {
    console.error('[Lyrics] Get error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// PATCH /api/orders/:id/lyrics/:lyricsId - Update edited content
lyrics.patch('/:id/lyrics/:lyricsId', generalRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');
    const lyricsId = parseInt(c.req.param('lyricsId'), 10);

    if (isNaN(lyricsId)) {
      return c.json({ error: 'Invalid lyrics ID' }, 400);
    }

    const body = await c.req.json();
    const parsed = updateLyricsSchema.safeParse(body);

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

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const updated = await db.updateLyrics(lyricsId, orderId, {
      editedContent: parsed.data.editedContent,
    });

    if (!updated) {
      return c.json({ error: 'Lyrics variation not found' }, 404);
    }

    await db.createEvent({
      orderId,
      eventType: 'lyrics_edited',
      payload: { lyricsId },
    });

    return c.json({
      success: true,
      lyrics: updated,
    });
  } catch (err) {
    console.error('[Lyrics] Update error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default lyrics;
