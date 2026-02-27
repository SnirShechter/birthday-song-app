import { Hono } from 'hono';
import { generateSongsSchema } from '@birthday-song/shared';
import type { MusicStyle } from '@birthday-song/shared';
import { db } from '../db/client.js';
import { generateMockSongs } from '../services/mock-music.js';
import { generationRateLimit, generalRateLimit } from '../middleware/rate-limit.js';

const songs = new Hono();

// POST /api/orders/:id/generate-songs - Generate 2-3 song variations
songs.post('/:id/generate-songs', generationRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const parsed = generateSongsSchema.safeParse(body);

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

    // Verify that the specified lyrics exist
    const allLyrics = await db.getLyrics(orderId);
    const selectedLyrics = allLyrics.find((l) => l.id === parsed.data.lyricsId);
    if (!selectedLyrics) {
      return c.json({ error: 'Lyrics variation not found' }, 404);
    }

    const style: MusicStyle = order.selectedStyle || selectedLyrics.styleVariant;

    // Generate songs directly (no queue for demo)
    const songResults = await generateMockSongs(orderId, style, order.language);

    // Save all song variations to DB
    const savedSongs = [];
    for (let i = 0; i < songResults.length; i++) {
      const song = songResults[i];
      const saved = await db.createSong({
        orderId,
        provider: song.provider,
        providerId: song.providerId,
        stylePrompt: song.stylePrompt,
        audioUrl: song.audioUrl,
        previewUrl: song.previewUrl,
        durationSeconds: song.durationSeconds,
        selected: i === 0,
      });
      savedSongs.push(saved);
    }

    // Update order status and selected lyrics
    await db.updateOrder(orderId, {
      status: 'song_ready',
      selectedLyricsId: parsed.data.lyricsId,
    });

    await db.createEvent({
      orderId,
      eventType: 'song_generated',
      payload: { style, count: songResults.length, lyricsId: parsed.data.lyricsId },
    });

    return c.json({
      success: true,
      songs: savedSongs,
    });
  } catch (err) {
    console.error('[Songs] Generate error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/orders/:id/songs - Get all song variations for an order
songs.get('/:id/songs', generalRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const allSongs = await db.getSongs(orderId);

    return c.json({
      success: true,
      songs: allSongs,
    });
  } catch (err) {
    console.error('[Songs] Get error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/orders/:id/preview/:songId - Redirect to preview URL
songs.get('/:id/preview/:songId', generalRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');
    const songId = parseInt(c.req.param('songId'), 10);

    if (isNaN(songId)) {
      return c.json({ error: 'Invalid song ID' }, 400);
    }

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const allSongs = await db.getSongs(orderId);
    const song = allSongs.find((s) => s.id === songId);

    if (!song) {
      return c.json({ error: 'Song variation not found' }, 404);
    }

    if (!song.previewUrl) {
      return c.json({ error: 'Preview not available' }, 404);
    }

    // Track preview play event
    await db.createEvent({
      orderId,
      eventType: 'preview_played',
      payload: { songId },
    });

    // Update order status if it hasn't been marked yet
    if (order.status === 'song_ready') {
      await db.updateOrder(orderId, { status: 'preview_played' });
    }

    return c.redirect(song.previewUrl);
  } catch (err) {
    console.error('[Songs] Preview error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default songs;
