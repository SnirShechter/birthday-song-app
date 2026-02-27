import { Hono } from 'hono';
import { videoSchema } from '@birthday-song/shared';
import { db } from '../db/client.js';
import { startVideoGeneration, getVideoGenerationStatus } from '../services/mock-video.js';
import { generationRateLimit, generalRateLimit } from '../middleware/rate-limit.js';

const video = new Hono();

// POST /api/orders/:id/video - Start video generation
video.post('/:id/video', generationRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const parsed = videoSchema.safeParse(body);

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

    // Check if there's already an active video generation
    const existingVideo = await db.getVideo(orderId);
    if (existingVideo && (existingVideo.status === 'pending' || existingVideo.status === 'processing')) {
      return c.json(
        {
          error: 'Video generation already in progress',
          video: existingVideo,
        },
        409,
      );
    }

    // Create video clip record
    const videoClip = await db.createVideo({
      orderId,
      provider: 'runway',
      photoUrls: parsed.data.photoUrls || [],
      videoStyle: parsed.data.videoStyle,
    });

    // Start mock video generation (in-memory progress tracking)
    startVideoGeneration(orderId, videoClip.id);

    // Update status to processing after a brief moment
    setTimeout(async () => {
      try {
        await db.updateVideoStatus(videoClip.id, 'processing');
      } catch (err) {
        console.error('[Video] Failed to update status to processing:', err);
      }
    }, 2000);

    // Schedule completion
    setTimeout(async () => {
      try {
        const videoUrl = `/mock-assets/videos/demo-video.mp4`;
        await db.updateVideoStatus(videoClip.id, 'completed', videoUrl);
        await db.createEvent({
          orderId,
          eventType: 'video_generated',
          payload: { videoClipId: videoClip.id, videoStyle: parsed.data.videoStyle },
        });
      } catch (err) {
        console.error('[Video] Failed to complete video:', err);
      }
    }, 15000);

    await db.createEvent({
      orderId,
      eventType: 'video_started',
      payload: {
        videoClipId: videoClip.id,
        videoStyle: parsed.data.videoStyle,
        photoCount: parsed.data.photoUrls?.length || 0,
      },
    });

    return c.json({
      success: true,
      video: videoClip,
      message: 'Video generation started. Poll /video/status for progress.',
    }, 202);
  } catch (err) {
    console.error('[Video] Start error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/orders/:id/video/status - Poll video generation status
video.get('/:id/video/status', generalRateLimit, async (c) => {
  try {
    const orderId = c.req.param('id');

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const videoClip = await db.getVideo(orderId);
    if (!videoClip) {
      return c.json({ error: 'No video generation found for this order' }, 404);
    }

    // Get real-time progress from the in-memory tracker
    const statusResult = getVideoGenerationStatus(orderId, videoClip.id);

    // If the in-memory tracker says completed but DB doesn't reflect it yet, update DB
    if (statusResult.status === 'completed' && videoClip.status !== 'completed') {
      await db.updateVideoStatus(videoClip.id, 'completed', statusResult.videoUrl);
    }

    return c.json({
      success: true,
      video: {
        id: videoClip.id,
        orderId: videoClip.orderId,
        status: statusResult.status,
        progress: statusResult.progress,
        estimatedSecondsRemaining: statusResult.estimatedSecondsRemaining,
        videoUrl: statusResult.videoUrl || videoClip.videoUrl,
        videoStyle: videoClip.videoStyle,
        createdAt: videoClip.createdAt,
        completedAt: videoClip.completedAt,
      },
    });
  } catch (err) {
    console.error('[Video] Status error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default video;
