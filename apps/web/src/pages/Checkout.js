import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, CreditCard, Shield, ArrowLeft, } from "lucide-react";
import { PRICING } from "@birthday-song/shared";
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
        transition: { duration: 0.5, ease: "easeOut" },
    },
};
export default function Checkout() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { orderId: paramOrderId } = useParams();
    const storeOrderId = useOrderStore((s) => s.orderId);
    const orderId = paramOrderId ?? storeOrderId;
    const lang = i18n.language === "he" ? "he" : "en";
    const [order, setOrder] = useState(null);
    const [selectedTier, setSelectedTier] = useState("song");
    const [showStripe, setShowStripe] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [fetching, setFetching] = useState(true);
    // Fetch order details
    useEffect(() => {
        if (!orderId)
            return;
        let cancelled = false;
        const fetchOrder = async () => {
            try {
                const data = await api.get(`/api/orders/${orderId}`);
                if (!cancelled) {
                    setOrder(data);
                    setFetching(false);
                }
            }
            catch {
                if (!cancelled)
                    setFetching(false);
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
        if (!orderId)
            return;
        setProcessing(true);
        try {
            await api.post("/api/webhooks/stripe", {
                orderId,
                productType: selectedTier,
                amountCents: PRICING[selectedTier].amountCents,
                status: "completed",
            });
            navigate(`/success?orderId=${orderId}&tier=${selectedTier}`);
        }
        catch {
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
        return (_jsx(Shell, { children: _jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-center", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: "linear" }, className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[image:var(--gradient-main)]", children: _jsx(ShoppingCart, { className: "h-6 w-6 text-white" }) }), _jsx("p", { className: "text-[var(--text-muted)]", children: t("checkout.loading", "Loading checkout...") })] }) }) }));
    }
    return (_jsx(Shell, { children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "min-h-screen px-4 py-12", children: [_jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: "mb-8", children: _jsxs("button", { type: "button", onClick: () => navigate(-1), className: "flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), t("checkout.back", "Back to preview")] }) }), _jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "visible", className: "mb-10 text-center", children: [_jsx(GradientText, { as: "h1", className: "mb-3 text-3xl font-extrabold sm:text-4xl", children: t("checkout.title", "Complete Your Order") }), _jsx("p", { className: "text-[var(--text-muted)]", children: t("checkout.subtitle", "Choose your plan and unlock the full experience") })] }), _jsxs("div", { className: "grid gap-8 lg:grid-cols-5", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "lg:col-span-3", children: _jsx(TierSelector, { selectedTier: selectedTier, onSelect: (tier) => setSelectedTier(tier) }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "lg:col-span-2", children: _jsxs(Card, { hoverable: false, className: "sticky top-24", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: t("checkout.summary.title", "Order Summary") }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [order?.recipientName && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[var(--text-muted)]", children: t("checkout.summary.recipient", "For") }), _jsx("span", { className: "text-sm font-semibold text-[var(--text)]", children: order.recipientName })] })), order?.selectedStyle && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[var(--text-muted)]", children: t("checkout.summary.style", "Style") }), _jsx("span", { className: "text-sm font-semibold capitalize text-[var(--text)]", children: order.selectedStyle })] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-[var(--text-muted)]", children: t("checkout.summary.plan", "Plan") }), _jsx("span", { className: "text-sm font-semibold text-[var(--text)]", children: lang === "he"
                                                                            ? tierPricing.labelHe
                                                                            : tierPricing.label })] })] }), _jsx("div", { className: "border-t border-[var(--glass-border)] pt-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-base font-bold text-[var(--text)]", children: t("checkout.summary.total", "Total") }), _jsx(GradientText, { as: "span", className: "text-2xl font-extrabold", children: formattedPrice })] }) }), _jsx(Button, { size: "lg", onClick: handleProceed, loading: processing, icon: _jsx(CreditCard, { className: "h-5 w-5" }), className: "w-full", children: t("checkout.proceed", "Proceed to Payment") }), _jsxs("div", { className: "flex items-center justify-center gap-2 pt-2", children: [_jsx(Shield, { className: "h-4 w-4 text-green-400" }), _jsx("span", { className: "text-xs text-[var(--text-muted)]", children: t("checkout.secure", "Secure payment. Satisfaction guaranteed.") })] })] })] }) })] })] }), _jsx(MockStripe, { isOpen: showStripe, onClose: handlePaymentCancel, onSuccess: handlePaymentSuccess, amount: tierPricing.amountCents, itemLabel: lang === "he" ? tierPricing.labelHe : tierPricing.label })] }) }));
}
