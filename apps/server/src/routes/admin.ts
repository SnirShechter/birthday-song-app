import { Hono } from 'hono';
import { db } from '../db/client.js';
import { generalRateLimit } from '../middleware/rate-limit.js';

const admin = new Hono();

admin.use('*', generalRateLimit);

// GET /api/admin/stats - Return dashboard stats
admin.get('/stats', async (c) => {
  try {
    const stats = await db.getStats();

    return c.json({
      success: true,
      stats: {
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        totalRevenueFmt: `${(stats.totalRevenue / 100).toFixed(2)} ILS`,
        completedOrders: stats.completedOrders,
        conversionRate: Math.round(stats.conversionRate * 100),
        conversionRateFmt: `${Math.round(stats.conversionRate * 100)}%`,
        topStyles: stats.topStyles,
        recentOrders: stats.recentOrders.map((o) => ({
          id: o.id,
          recipientName: o.recipientName,
          language: o.language,
          selectedStyle: o.selectedStyle,
          status: o.status,
          createdAt: o.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error('[Admin] Stats error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default admin;
