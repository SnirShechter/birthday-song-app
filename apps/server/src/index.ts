import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { corsMiddleware } from './middleware/cors.js';
import ordersRoutes from './routes/orders.js';
import lyricsRoutes from './routes/lyrics.js';
import songsRoutes from './routes/songs.js';
import videoRoutes from './routes/video.js';
import checkoutRoutes from './routes/checkout.js';
import shareRoutes from './routes/share.js';
import adminRoutes from './routes/admin.js';

const app = new Hono();

// Global middleware
app.use('*', corsMiddleware);
app.use('*', logger());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    mockMode: process.env.MOCK_MODE === 'true',
  });
});

// API Routes
app.route('/api/orders', ordersRoutes);
app.route('/api/orders', lyricsRoutes);
app.route('/api/orders', songsRoutes);
app.route('/api/orders', videoRoutes);
app.route('/api/orders', checkoutRoutes);
app.route('/api/orders', shareRoutes);
app.route('/api/admin', adminRoutes);

// Webhook routes (separate from /api/orders prefix)
app.post('/api/webhooks/stripe', async (c) => {
  // Forward to checkout route handler
  const body = await c.req.json();
  const { handleWebhook } = await import('./services/mock-stripe.js');
  const { db } = await import('./db/client.js');

  const { sessionId } = body;
  if (!sessionId || typeof sessionId !== 'string') {
    return c.json({ error: 'Missing sessionId' }, 400);
  }

  const result = handleWebhook(sessionId);
  if (!result.success) {
    return c.json({ error: result.error }, 400);
  }

  const payment = await db.updatePayment(sessionId, {
    status: 'completed',
    stripePaymentIntent: result.paymentIntent,
  });

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

  return c.json({ success: true, payment, orderId: result.orderId });
});

// Mock checkout page (for demo purposes)
app.get('/mock-checkout', (c) => {
  const sessionId = c.req.query('session_id') || '';
  const orderId = c.req.query('order_id') || '';
  const amount = c.req.query('amount') || '0';
  const label = c.req.query('label') || 'Song';

  const amountFormatted = (parseInt(amount, 10) / 100).toFixed(2);

  const html = `<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mock Checkout</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: white; border-radius: 12px; padding: 40px; max-width: 400px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.1); text-align: center; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    .amount { font-size: 36px; font-weight: bold; color: #635bff; margin: 20px 0; }
    .label { color: #666; margin-bottom: 24px; }
    .btn { display: inline-block; padding: 14px 32px; background: #635bff; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; text-decoration: none; transition: background 0.2s; }
    .btn:hover { background: #4b45c7; }
    .btn.success { background: #10b981; }
    .btn.success:hover { background: #059669; }
    .info { color: #999; font-size: 12px; margin-top: 16px; }
    #result { margin-top: 20px; padding: 16px; border-radius: 8px; display: none; }
    .result-success { background: #ecfdf5; color: #065f46; }
    .result-error { background: #fef2f2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Mock Payment</h1>
    <p class="label">${label}</p>
    <div class="amount">${amountFormatted} ILS</div>
    <p class="label">Order: ${orderId.slice(0, 8)}...</p>
    <button class="btn success" onclick="completePayment()">Complete Payment</button>
    <div id="result"></div>
    <p class="info">This is a mock checkout for demo purposes.</p>
  </div>
  <script>
    async function completePayment() {
      const btn = document.querySelector('.btn');
      btn.textContent = 'Processing...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: '${sessionId}' })
        });
        const data = await res.json();
        const result = document.getElementById('result');
        if (data.success) {
          result.className = 'result-success';
          result.style.display = 'block';
          result.innerHTML = 'Payment successful! You can close this page.';
          btn.textContent = 'Paid';
          // Redirect back to the app after 2 seconds
          setTimeout(() => {
            window.location.href = '${process.env.CORS_ORIGIN || 'http://localhost:5173'}/order/${orderId}?paid=true';
          }, 2000);
        } else {
          result.className = 'result-error';
          result.style.display = 'block';
          result.innerHTML = 'Error: ' + (data.error || 'Unknown error');
          btn.textContent = 'Try Again';
          btn.disabled = false;
        }
      } catch (err) {
        const result = document.getElementById('result');
        result.className = 'result-error';
        result.style.display = 'block';
        result.innerHTML = 'Network error. Please try again.';
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>`;

  return c.html(html);
});

// Serve static mock assets
app.get('/mock-assets/*', async (c) => {
  const path = c.req.path;
  // In production this would serve real files; for dev we return a placeholder response
  return c.json({
    message: 'Mock asset placeholder',
    path,
    note: 'Place actual media files in the mock-assets directory for real playback',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('[Server] Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Start server
const PORT = parseInt(process.env.PORT || '3000', 10);

console.log('');
console.log('===========================================');
console.log('  Birthday Song App - Backend Server');
console.log('===========================================');
console.log(`  Port:       ${PORT}`);
console.log(`  Mock Mode:  ${process.env.MOCK_MODE || 'true'}`);
console.log(`  CORS:       ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
console.log(`  Database:   ${process.env.DATABASE_URL ? 'configured' : 'default (localhost)'}`);
console.log(`  Redis:      ${process.env.REDIS_URL || 'redis://localhost:6379'}`);
console.log('===========================================');
console.log('');

// Try to start BullMQ workers (will gracefully skip if Redis unavailable)
import('./queue/worker.js')
  .then(({ startWorkers }) => {
    startWorkers();
  })
  .catch((err) => {
    console.warn('[Server] Workers not started:', (err as Error).message);
  });

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`[Server] Listening on http://localhost:${PORT}`);
console.log('[Server] API docs: GET /health');
console.log('');

export default app;
