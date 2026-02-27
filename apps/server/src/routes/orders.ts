import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { createOrderSchema, updateOrderSchema } from '@birthday-song/shared';
import { db } from '../db/client.js';
import { generalRateLimit } from '../middleware/rate-limit.js';

const orders = new Hono();

// Apply general rate limit to all order routes
orders.use('*', generalRateLimit);

// POST /api/orders - Create a new order from questionnaire data
orders.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = createOrderSchema.safeParse(body);

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

    const data = parsed.data;
    const id = uuidv4();

    const order = await db.createOrder({
      id,
      recipientName: data.recipientName,
      recipientNickname: data.recipientNickname,
      recipientGender: data.recipientGender,
      recipientAge: data.recipientAge,
      relationship: data.relationship,
      personalityTraits: data.personalityTraits,
      hobbies: data.hobbies,
      funnyStory: data.funnyStory,
      occupation: data.occupation,
      petPeeve: data.petPeeve,
      importantPeople: data.importantPeople,
      sharedMemory: data.sharedMemory,
      desiredMessage: data.desiredMessage,
      desiredTone: data.desiredTone,
      questionnaireRaw: data,
      language: data.language,
    });

    await db.createEvent({
      orderId: id,
      eventType: 'order_created',
      payload: { language: data.language, tone: data.desiredTone },
      ipAddress: c.req.header('x-forwarded-for') || undefined,
      userAgent: c.req.header('user-agent') || undefined,
    });

    return c.json({ success: true, order }, 201);
  } catch (err) {
    console.error('[Orders] Create error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/orders/:id - Get order with all related data
orders.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const order = await db.getOrder(id);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Fetch all related data in parallel
    const [lyrics, songs, video, payments] = await Promise.all([
      db.getLyrics(id),
      db.getSongs(id),
      db.getVideo(id),
      db.getPayments(id),
    ]);

    return c.json({
      success: true,
      order,
      lyrics,
      songs,
      video,
      payments,
    });
  } catch (err) {
    console.error('[Orders] Get error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// PATCH /api/orders/:id - Update order fields
orders.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = updateOrderSchema.safeParse(body);

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

    const existingOrder = await db.getOrder(id);
    if (!existingOrder) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const order = await db.updateOrder(id, parsed.data);

    if (!order) {
      return c.json({ error: 'Failed to update order' }, 500);
    }

    await db.createEvent({
      orderId: id,
      eventType: 'order_updated',
      payload: { fields: Object.keys(parsed.data) },
    });

    return c.json({ success: true, order });
  } catch (err) {
    console.error('[Orders] Update error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default orders;
