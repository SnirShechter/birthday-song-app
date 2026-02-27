import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { RefreshCw, FileText, Sparkles } from "lucide-react";
import type { LyricsVariation } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Shell } from "@/components/layout/Shell";
import { LyricsCarousel } from "@/components/lyrics/LyricsCarousel";
import { LyricsCard } from "@/components/lyrics/LyricsCard";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { GradientText } from "@/components/shared/GradientText";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function LyricsReview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const orderId = useOrderStore((s) => s.orderId);

  const [lyrics, setLyrics] = useState<LyricsVariation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const songLoadingMessages = [
    t("lyrics.generating.composing", "Composing your song..."),
    t("lyrics.generating.vocals", "Adding vocals..."),
    t("lyrics.generating.mixing", "Mixing the track..."),
    t("lyrics.generating.mastering", "Mastering the audio..."),
    t("lyrics.generating.finalTouches", "Final touches..."),
    t("lyrics.generating.almost", "Almost ready to play..."),
  ];

  // Rotate generating messages
  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % songLoadingMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [generating, songLoadingMessages.length]);

  // Fetch lyrics on mount
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const fetchLyrics = async () => {
      try {
        const data = await api.get<LyricsVariation[]>(
          `/api/orders/${orderId}/lyrics`
        );
        if (!cancelled) {
          setLyrics(data);
          setFetching(false);
        }
      } catch {
        if (!cancelled) setFetching(false);
      }
    };

    fetchLyrics();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleRefresh = useCallback(async () => {
    if (!orderId) return;
    setRefreshing(true);
    try {
      await api.post(`/api/orders/${orderId}/generate-lyrics`, {});
      const data = await api.get<LyricsVariation[]>(
        `/api/orders/${orderId}/lyrics`
      );
      setLyrics(data);
      setSelectedId(null);
    } finally {
      setRefreshing(false);
    }
  }, [orderId]);

  const handleSelect = useCallback(
    async (lyricsId: number) => {
      if (!orderId) return;
      setSelectedId(lyricsId);
      setGenerating(true);

      try {
        // Patch order with selected lyrics
        await api.patch(`/api/orders/${orderId}`, {
          selectedLyricsId: lyricsId,
        });

        // Generate songs
        await api.post(`/api/orders/${orderId}/generate-songs`, {
          lyricsId,
        });

        navigate("/create/preview");
      } catch {
        setGenerating(false);
        setSelectedId(null);
      }
    },
    [orderId, navigate]
  );

  if (generating) {
    return (
      <LoadingScreen
        messages={songLoadingMessages}
        currentIndex={loadingMessageIndex}
      />
    );
  }

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
              <FileText className="h-6 w-6 text-white" />
            </motion.div>
            <p className="text-[var(--text-muted)]">
              {t("lyrics.fetching", "Loading your lyrics...")}
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
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--glass-bg)] px-4 py-2 backdrop-blur-sm">
              <FileText className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-sm font-medium text-[var(--text-muted)]">
                {t("lyrics.badge", "Step 3 of 4")}
              </span>
            </div>
            <GradientText
              as="h1"
              className="mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl"
            >
              {t("lyrics.title", "Choose Your Lyrics")}
            </GradientText>
            <p className="mx-auto max-w-md text-[var(--text-muted)]">
              {t(
                "lyrics.subtitle",
                "We created 3 unique variations. Pick the one you love most, or regenerate for fresh options."
              )}
            </p>
          </motion.div>

          {/* Lyrics Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LyricsCarousel>
              {lyrics.map((variation) => (
                <LyricsCard
                  key={variation.id}
                  variation={variation}
                  isSelected={selectedId === variation.id}
                  onSelect={() => handleSelect(variation.id)}
                />
              ))}
            </LyricsCarousel>
          </motion.div>

          {/* Refresh button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <Button
              variant="secondary"
              onClick={handleRefresh}
              loading={refreshing}
              icon={
                <RefreshCw
                  className={cn("h-4 w-4", refreshing && "animate-spin")}
                />
              }
            >
              {t("lyrics.refresh", "Generate New Variations")}
            </Button>
            <p className="text-xs text-[var(--text-muted)]">
              {t(
                "lyrics.refreshHint",
                "Each refresh creates 3 brand new lyrics variations"
              )}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </Shell>
  );
}
