import { Hono } from 'hono';
import type { ShareData } from '@birthday-song/shared';
import { db } from '../db/client.js';
import { generalRateLimit } from '../middleware/rate-limit.js';

const share = new Hono();

share.use('*', generalRateLimit);

// GET /api/orders/:id/share - Return public share data
share.get('/:id/share', async (c) => {
  try {
    const orderId = c.req.param('id');

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Only allow sharing for paid/completed orders
    if (order.status !== 'paid' && order.status !== 'completed') {
      return c.json(
        {
          error: 'Not available',
          message: 'This order is not available for sharing yet.',
        },
        403,
      );
    }

    // Get the selected song and video
    const allSongs = await db.getSongs(orderId);
    const selectedSong = allSongs.find((s) => s.selected) || allSongs[0];
    const videoClip = await db.getVideo(orderId);

    const shareData: ShareData = {
      orderId: order.id,
      recipientName: order.recipientName,
      audioUrl: selectedSong?.previewUrl || selectedSong?.audioUrl,
      videoUrl: videoClip?.status === 'completed' ? videoClip.videoUrl : undefined,
      style: order.selectedStyle,
      createdAt: order.createdAt,
    };

    await db.createEvent({
      orderId,
      eventType: 'share_viewed',
      payload: { hasAudio: !!shareData.audioUrl, hasVideo: !!shareData.videoUrl },
      ipAddress: c.req.header('x-forwarded-for') || undefined,
      userAgent: c.req.header('user-agent') || undefined,
    });

    return c.json({
      success: true,
      share: shareData,
    });
  } catch (err) {
    console.error('[Share] Error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default share;
