"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface MockStripeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number; // in cents
  currency?: string;
  itemLabel: string;
}

export function MockStripe({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency = "USD",
  itemLabel,
}: MockStripeProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const formattedAmount = (amount / 100).toFixed(2);

  const handlePay = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1000);
  }, [onSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-[61] w-full max-w-md -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl p-0 overflow-hidden",
              "bg-[var(--surface)] border border-[var(--glass-border)]",
              "shadow-2xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF]">
                  <span className="text-sm font-bold text-white">S</span>
                </div>
                <span className="text-sm font-semibold text-[var(--text)]">
                  Checkout
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={isProcessing}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="px-6 py-5">
              {/* Order summary */}
              <div className="mb-6 flex items-center justify-between rounded-xl bg-[var(--bg-secondary)] p-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Order summary
                  </p>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {itemLabel}
                  </p>
                </div>
                <span className="text-lg font-bold text-[var(--text)]">
                  ${formattedAmount}
                </span>
              </div>

              {/* Card details */}
              <div className="mb-4 flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Card information
                </label>

                {/* Card number */}
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-3",
                    "bg-[var(--surface)] border border-[var(--border)]"
                  )}
                >
                  <CreditCard className="h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value="4242 4242 4242 4242"
                    readOnly
                    className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none font-mono"
                    dir="ltr"
                  />
                  <div className="flex gap-1">
                    <div className="h-5 w-8 rounded bg-[#1A1F71] flex items-center justify-center">
                      <span className="text-[6px] font-bold text-white tracking-wider">VISA</span>
                    </div>
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={cn(
                      "flex items-center rounded-xl px-4 py-3",
                      "bg-[var(--surface)] border border-[var(--border)]"
                    )}
                  >
                    <input
                      type="text"
                      value="12/28"
                      readOnly
                      className="w-full bg-transparent text-sm text-[var(--text)] outline-none font-mono"
                      dir="ltr"
                    />
                  </div>
                  <div
                    className={cn(
                      "flex items-center rounded-xl px-4 py-3",
                      "bg-[var(--surface)] border border-[var(--border)]"
                    )}
                  >
                    <input
                      type="text"
                      value="424"
                      readOnly
                      className="w-full bg-transparent text-sm text-[var(--text)] outline-none font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Cardholder name */}
                <div
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3",
                    "bg-[var(--surface)] border border-[var(--border)]"
                  )}
                >
                  <input
                    type="text"
                    value="Test User"
                    readOnly
                    className="w-full bg-transparent text-sm text-[var(--text)] outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Pay button */}
              <motion.button
                whileTap={isProcessing ? undefined : { scale: 0.98 }}
                whileHover={isProcessing ? undefined : { filter: "brightness(1.1)" }}
                onClick={handlePay}
                disabled={isProcessing}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-3.5",
                  "bg-[image:var(--gradient-main)] text-white text-sm font-semibold",
                  "shadow-lg shadow-[var(--color-primary)]/30",
                  "hover:shadow-xl hover:brightness-110",
                  "disabled:opacity-70 disabled:cursor-not-allowed",
                  "transition-all duration-200 cursor-pointer"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay ${formattedAmount}
                  </>
                )}
              </motion.button>
            </div>

            {/* Footer branding */}
            <div className="flex items-center justify-center gap-1.5 border-t border-[var(--border)] px-6 py-3">
              <Lock className="h-3 w-3 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">
                Powered by{" "}
                <span className="font-semibold text-[#635BFF]">Stripe</span>{" "}
                (Mock)
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
