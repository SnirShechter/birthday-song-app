import { Hono } from 'hono';
import { checkoutSchema, PRICING } from '@birthday-song/shared';
import type { ProductType } from '@birthday-song/shared';
import { db } from '../db/client.js';
import { createCheckoutSession, handleWebhook } from '../services/mock-stripe.js';
import { generalRateLimit } from '../middleware/rate-limit.js';

const checkout = new Hono();

checkout.use('*', generalRateLimit);

// POST /api/orders/:id/checkout - Create a mock checkout session
checkout.post('/:id/checkout', async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    const parsed = checkoutSchema.safeParse(body);

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

    const { tier } = parsed.data;
    const pricing = PRICING[tier as ProductType];

    // Create mock Stripe checkout session
    const session = createCheckoutSession(orderId, tier as ProductType);

    // Create pending payment record in DB
    await db.createPayment({
      orderId,
      productType: tier,
      amountCents: pricing.amountCents,
      currency: 'ILS',
      stripeSessionId: session.sessionId,
    });

    await db.createEvent({
      orderId,
      eventType: 'checkout_started',
      payload: { tier, amountCents: pricing.amountCents, sessionId: session.sessionId },
    });

    return c.json({
      success: true,
      sessionId: session.sessionId,
      checkoutUrl: session.checkoutUrl,
    });
  } catch (err) {
    console.error('[Checkout] Create error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/webhooks/stripe - Handle mock Stripe webhook
checkout.post('/webhooks/stripe', async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return c.json({ error: 'Missing sessionId' }, 400);
    }

    const result = handleWebhook(sessionId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    // Update payment record
    const payment = await db.updatePayment(sessionId, {
      status: 'completed',
      stripePaymentIntent: result.paymentIntent,
    });

    // Update order status to paid
    if (result.orderId) {
      await db.updateOrder(result.orderId, { status: 'paid' });

      await db.createEvent({
        orderId: result.orderId,
        eventType: 'payment_completed',
        payload: {
          tier: result.tier,
          amountCents: result.amountCents,
          paymentIntent: result.paymentIntent,
        },
      });
    }

    return c.json({
      success: true,
      payment,
      orderId: result.orderId,
    });
  } catch (err) {
    console.error('[Checkout] Webhook error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/orders/:id/download - Get download URLs (403 if not paid)
checkout.get('/:id/download', async (c) => {
  try {
    const orderId = c.req.param('id');

    const order = await db.getOrder(orderId);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Check if order is paid
    if (order.status !== 'paid' && order.status !== 'completed') {
      return c.json(
        {
          error: 'Payment required',
          message: 'You must complete payment before downloading.',
        },
        403,
      );
    }

    // Get the selected song
    const allSongs = await db.getSongs(orderId);
    const selectedSong = allSongs.find((s) => s.selected) || allSongs[0];

    // Get video if available
    const videoClip = await db.getVideo(orderId);

    const downloads: {
      type: string;
      label: string;
      url: string;
      format: string;
    }[] = [];

    if (selectedSong?.audioUrl) {
      downloads.push({
        type: 'audio',
        label: 'Full Song (MP3)',
        url: selectedSong.audioUrl,
        format: 'mp3',
      });
      downloads.push({
        type: 'audio',
        label: 'Full Song (WAV)',
        url: selectedSong.audioUrl.replace('.mp3', '.wav'),
        format: 'wav',
      });
    }

    if (videoClip?.videoUrl && videoClip.status === 'completed') {
      downloads.push({
        type: 'video',
        label: 'Video Clip (MP4)',
        url: videoClip.videoUrl,
        format: 'mp4',
      });
    }

    // Mark order as completed if not already
    if (order.status === 'paid') {
      await db.updateOrder(orderId, { status: 'completed' });
      await db.createEvent({
        orderId,
        eventType: 'download_accessed',
        payload: { downloadCount: downloads.length },
      });
    }

    return c.json({
      success: true,
      downloads,
      order: {
        id: order.id,
        recipientName: order.recipientName,
        status: 'completed',
      },
    });
  } catch (err) {
    console.error('[Checkout] Download error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default checkout;
