import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  CreditCard,
  Shield,
  ArrowLeft,
} from "lucide-react";
import type { Order } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Shell } from "@/components/layout/Shell";
import { MockStripe } from "@/components/checkout/MockStripe";
import { GradientText } from "@/components/shared/GradientText";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const storeOrderId = useOrderStore((s) => s.orderId);
  const orderId = paramOrderId ?? storeOrderId;
  const lang = i18n.language === "he" ? "he" : "en";

  const [order, setOrder] = useState<Order | null>(null);
  const [showStripe, setShowStripe] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch order details
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const data = await api.get<{ success: boolean; order: Order }>(`/api/orders/${orderId}`);
        if (!cancelled) {
          setOrder(data.order);
          setFetching(false);
        }
      } catch {
        if (!cancelled) setFetching(false);
      }
    };

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handlePaymentSuccess = useCallback(async () => {
    if (!orderId) return;
    setProcessing(true);

    try {
      const checkoutRes = await api.post<{
        success: boolean;
        sessionId: string;
        checkoutUrl: string;
      }>(`/api/orders/${orderId}/checkout`, { tier: "song" });

      await api.post("/api/webhooks/stripe", {
        sessionId: checkoutRes.sessionId,
      });

      navigate(`/success?orderId=${orderId}&tier=song`);
    } catch {
      setProcessing(false);
    }
  }, [orderId, navigate]);

  if (fetching) {
    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[image:var(--gradient-main)]"
            >
              <ShoppingCart className="h-6 w-6 text-white" />
            </motion.div>
            <p className="text-[var(--text-muted)]">
              {t("checkout.loading", "Processing...")}
            </p>
          </motion.div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen px-4 py-12"
      >
        <div className="mx-auto max-w-md">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("checkout.back", "Back")}
            </button>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-8 text-center"
          >
            <GradientText
              as="h1"
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              {t("checkout.title", "Get the Full Song")}
            </GradientText>
            <div className="mt-2">
              <GradientText as="span" className="text-4xl font-extrabold">
                $9.99
              </GradientText>
            </div>
          </motion.div>

          {/* Payment buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Google Pay */}
            <button
              type="button"
              onClick={handlePaymentSuccess}
              disabled={processing}
              className={cn(
                "flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--glass-border)] bg-black px-6 py-4 text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              )}
            >
              {t("checkout.googlePay", "Pay with Google Pay")}
            </button>

            {/* Apple Pay */}
            <button
              type="button"
              onClick={handlePaymentSuccess}
              disabled={processing}
              className={cn(
                "flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--glass-border)] bg-black px-6 py-4 text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              )}
            >
              {t("checkout.applePay", "Pay with Apple Pay")}
            </button>

            {/* PayPal */}
            <button
              type="button"
              onClick={handlePaymentSuccess}
              disabled={processing}
              className={cn(
                "flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[#0070ba] px-6 py-4 text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              )}
            >
              {t("checkout.paypal", "Pay with PayPal")}
            </button>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5"
          >
            <h3 className="mb-3 text-sm font-bold text-[var(--text)]">
              {t("checkout.summary.title", "Order Summary")}
            </h3>
            <div className="space-y-2">
              {order?.recipientName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    {t("checkout.summary.recipient", "For")}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {order.recipientName}
                  </span>
                </div>
              )}
              {order?.selectedStyle && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    {t("checkout.summary.style", "Style")}
                  </span>
                  <span className="text-sm font-semibold capitalize text-[var(--text)]">
                    {order.selectedStyle}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-2">
                <span className="text-sm font-bold text-[var(--text)]">
                  {t("checkout.summary.total", "Total")}
                </span>
                <GradientText as="span" className="text-xl font-extrabold">
                  $9.99
                </GradientText>
              </div>
            </div>
          </motion.div>

          {/* Credit card link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowStripe(true)}
              className="text-sm font-medium text-[var(--text-muted)] underline transition-colors hover:text-[var(--text)]"
            >
              <CreditCard className="mr-1 inline h-4 w-4" />
              {t("checkout.payWith", "Pay with credit card")}
            </button>
          </div>

          {/* Trust badge */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-xs text-[var(--text-muted)]">
              {t("checkout.secure", "Secure payment. Satisfaction guaranteed.")}
            </span>
          </div>
        </div>

        {/* Mock Stripe overlay */}
        <MockStripe
          isOpen={showStripe}
          onClose={() => setShowStripe(false)}
          onSuccess={handlePaymentSuccess}
          amount={999}
          itemLabel={lang === "he" ? "שיר בלבד" : "Song Only"}
        />
      </motion.div>
    </Shell>
  );
}
