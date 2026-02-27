"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { PRICING } from "@birthday-song/shared";
import { useUIStore } from "@/stores/uiStore";
import type { ProductType } from "@birthday-song/shared";

export interface TierSelectorProps {
  selectedTier?: ProductType;
  onSelect: (tier: ProductType) => void;
}

const DISPLAY_TIERS: {
  key: ProductType;
  popular: boolean;
  features: { en: string[]; he: string[] };
}[] = [
  {
    key: "song",
    popular: false,
    features: {
      en: [
        "Full song (2-3 min)",
        "MP3 + WAV download",
        "No watermark",
        "3 lyrics variations",
      ],
      he: [
        "שיר מלא (2-3 דק')",
        "הורדה MP3 + WAV",
        "ללא watermark",
        "3 גרסאות מילים",
      ],
    },
  },
  {
    key: "bundle",
    popular: true,
    features: {
      en: [
        "Everything in Song",
        "30s video clip",
        "Sharing page + QR",
        "5 lyrics variations",
      ],
      he: [
        "הכל מ-Song",
        "וידאו קליפ 30 שניות",
        "עמוד שיתוף + QR",
        "5 גרסאות מילים",
      ],
    },
  },
  {
    key: "premium",
    popular: false,
    features: {
      en: [
        "Everything in Bundle",
        "3 song versions",
        "HD video clip",
        "Priority support",
      ],
      he: [
        "הכל מ-Bundle",
        "3 גרסאות שיר",
        "וידאו HD",
        "תמיכה עדיפות",
      ],
    },
  },
];

export function TierSelector({ selectedTier, onSelect }: TierSelectorProps) {
  const language = useUIStore((s) => s.language);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {DISPLAY_TIERS.map((tier) => {
        const pricing = PRICING[tier.key];
        const isSelected = selectedTier === tier.key;
        const price = (pricing.amountCents / 100).toFixed(2);
        const label = language === "he" ? pricing.labelHe : pricing.label;
        const features =
          language === "he" ? tier.features.he : tier.features.en;

        return (
          <motion.button
            key={tier.key}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -4 }}
            onClick={() => onSelect(tier.key)}
            className={cn(
              "relative flex flex-col rounded-2xl p-5 text-left",
              "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]",
              "border transition-all duration-300 cursor-pointer",
              isSelected
                ? "border-transparent shadow-xl shadow-[var(--color-primary)]/25"
                : tier.popular
                  ? "border-[var(--color-primary)]/30 shadow-lg shadow-[var(--color-primary)]/10"
                  : "border-[var(--glass-border)] shadow-[var(--glass-shadow)]"
            )}
          >
            {/* Gradient border when selected */}
            {isSelected && (
              <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent bg-clip-border [background:var(--gradient-main)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] p-[2px]" />
            )}

            {/* Glow effect when selected */}
            {isSelected && (
              <div className="pointer-events-none absolute inset-0 rounded-2xl animate-pulse-glow" />
            )}

            {/* Popular badge */}
            {tier.popular && (
              <motion.div
                initial={{ y: -4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1",
                    "bg-[image:var(--gradient-main)] text-white",
                    "text-xs font-bold shadow-lg shadow-[var(--color-primary)]/30"
                  )}
                >
                  <Star className="h-3 w-3" fill="currentColor" />
                  {language === "he" ? "פופולרי" : "Popular"}
                </span>
              </motion.div>
            )}

            {/* Tier name */}
            <h3
              className={cn(
                "text-lg font-bold",
                tier.popular ? "mt-2" : "",
                "text-[var(--text)]"
              )}
            >
              {label}
            </h3>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[var(--text)]">
                ${price}
              </span>
            </div>

            {/* Features */}
            <ul className="mt-4 flex flex-col gap-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                  <span className="text-[var(--text-secondary)]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Selection indicator */}
            <div className="mt-auto pt-4">
              <div
                className={cn(
                  "flex items-center justify-center rounded-xl py-2.5 text-sm font-semibold",
                  "transition-all duration-200",
                  isSelected
                    ? "bg-[image:var(--gradient-main)] text-white shadow-md shadow-[var(--color-primary)]/25"
                    : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
                )}
              >
                {isSelected ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    {language === "he" ? "נבחר" : "Selected"}
                  </span>
                ) : (
                  <span>{language === "he" ? "בחר" : "Select"}</span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
