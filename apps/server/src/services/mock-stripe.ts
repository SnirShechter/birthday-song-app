import type { ProductType, CheckoutSession } from '@birthday-song/shared';
import { PRICING } from '@birthday-song/shared';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for mock checkout sessions
const sessions: Map<
  string,
  {
    orderId: string;
    tier: ProductType;
    amountCents: number;
    currency: string;
    status: 'open' | 'complete' | 'expired';
    createdAt: number;
  }
> = new Map();

export function createCheckoutSession(
  orderId: string,
  tier: ProductType,
): CheckoutSession {
  const sessionId = `cs_mock_${uuidv4().replace(/-/g, '').slice(0, 24)}`;
  const pricing = PRICING[tier];

  sessions.set(sessionId, {
    orderId,
    tier,
    amountCents: pricing.amountCents,
    currency: 'ILS',
    status: 'open',
    createdAt: Date.now(),
  });

  const checkoutUrl = `http://localhost:3000/mock-checkout?session_id=${sessionId}&order_id=${orderId}&amount=${pricing.amountCents}&label=${encodeURIComponent(pricing.label)}`;

  return {
    sessionId,
    checkoutUrl,
  };
}

export function handleWebhook(sessionId: string): {
  success: boolean;
  orderId?: string;
  tier?: ProductType;
  amountCents?: number;
  currency?: string;
  paymentIntent?: string;
  error?: string;
} {
  const session = sessions.get(sessionId);

  if (!session) {
    return { success: false, error: 'Session not found' };
  }

  if (session.status === 'complete') {
    return { success: false, error: 'Session already completed' };
  }

  if (session.status === 'expired') {
    return { success: false, error: 'Session expired' };
  }

  // Mark session as complete
  session.status = 'complete';
  const paymentIntent = `pi_mock_${uuidv4().replace(/-/g, '').slice(0, 24)}`;

  return {
    success: true,
    orderId: session.orderId,
    tier: session.tier,
    amountCents: session.amountCents,
    currency: session.currency,
    paymentIntent,
  };
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId) || null;
}
