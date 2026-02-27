import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Music,
  CreditCard,
  Shield,
  ArrowLeft,
} from "lucide-react";
import type { Order } from "@birthday-song/shared";
import { PRICING } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { TierSelector } from "@/components/checkout/TierSelector";
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

type Tier = "song" | "bundle" | "premium";

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const storeOrderId = useOrderStore((s) => s.orderId);
  const orderId = paramOrderId ?? storeOrderId;
  const lang = i18n.language === "he" ? "he" : "en";

  const [order, setOrder] = useState<Order | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier>("song");
  const [showStripe, setShowStripe] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch order details
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const data = await api.get<Order>(`/api/orders/${orderId}`);
        if (!cancelled) {
          setOrder(data);
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

  const handleProceed = useCallback(() => {
    setShowStripe(true);
  }, []);

  const handlePaymentSuccess = useCallback(async () => {
    if (!orderId) return;
    setProcessing(true);

    try {
      await api.post("/api/webhooks/stripe", {
        orderId,
        productType: selectedTier,
        amountCents: PRICING[selectedTier].amountCents,
        status: "completed",
      });

      navigate(`/success?orderId=${orderId}&tier=${selectedTier}`);
    } catch {
      setProcessing(false);
      setShowStripe(false);
    }
  }, [orderId, selectedTier, navigate]);

  const handlePaymentCancel = useCallback(() => {
    setShowStripe(false);
  }, []);

  const tierPricing = PRICING[selectedTier];
  const formattedPrice = `$${(tierPricing.amountCents / 100).toFixed(2)}`;

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
              {t("checkout.loading", "Loading checkout...")}
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
        <div className="mx-auto max-w-3xl">
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
              {t("checkout.back", "Back to preview")}
            </button>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10 text-center"
          >
            <GradientText
              as="h1"
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              {t("checkout.title", "Complete Your Order")}
            </GradientText>
            <p className="text-[var(--text-muted)]">
              {t(
                "checkout.subtitle",
                "Choose your plan and unlock the full experience"
              )}
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Tier Selector - left/main area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <TierSelector
                selectedTier={selectedTier}
                onSelect={(tier: string) => setSelectedTier(tier as Tier)}
              />
            </motion.div>

            {/* Order summary - sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card hoverable={false} className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {t("checkout.summary.title", "Order Summary")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order info */}
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-muted)]">
                        {t("checkout.summary.plan", "Plan")}
                      </span>
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {lang === "he"
                          ? tierPricing.labelHe
                          : tierPricing.label}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[var(--glass-border)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[var(--text)]">
                        {t("checkout.summary.total", "Total")}
                      </span>
                      <GradientText
                        as="span"
                        className="text-2xl font-extrabold"
                      >
                        {formattedPrice}
                      </GradientText>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    size="lg"
                    onClick={handleProceed}
                    loading={processing}
                    icon={<CreditCard className="h-5 w-5" />}
                    className="w-full"
                  >
                    {t("checkout.proceed", "Proceed to Payment")}
                  </Button>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-[var(--text-muted)]">
                      {t(
                        "checkout.secure",
                        "Secure payment. Satisfaction guaranteed."
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Mock Stripe overlay */}
        <MockStripe
          isOpen={showStripe}
          onClose={handlePaymentCancel}
          onSuccess={handlePaymentSuccess}
          amount={tierPricing.amountCents}
          itemLabel={lang === "he" ? tierPricing.labelHe : tierPricing.label}
        />
      </motion.div>
    </Shell>
  );
}
