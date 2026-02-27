import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Headphones,
  Lock,
  Check,
  Music,
  Volume2,
} from "lucide-react";
import type { SongVariation } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { usePlayerStore } from "@/stores/player";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { Waveform } from "@/components/player/Waveform";
import { GradientText } from "@/components/shared/GradientText";
import { Badge } from "@/components/ui/Badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerList = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const variationLabels = [
  { label: "Energetic", icon: "lightning" },
  { label: "Smooth", icon: "waves" },
  { label: "Classic", icon: "sparkle" },
];

export default function SongPreview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const orderId = useOrderStore((s) => s.orderId);

  const [songs, setSongs] = useState<SongVariation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);

  // Fetch songs on mount
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const fetchSongs = async () => {
      try {
        const res = await api.get<{ success: boolean; songs: SongVariation[] }>(
          `/api/orders/${orderId}/songs`
        );
        if (!cancelled) {
          setSongs(res.songs ?? []);
          setFetching(false);
        }
      } catch {
        if (!cancelled) setFetching(false);
      }
    };

    fetchSongs();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleSelect = useCallback(
    async (songId: number) => {
      if (!orderId) return;
      setSelectedId(songId);
      try {
        await api.patch(`/api/orders/${orderId}`, {
          selectedSongId: songId,
        });
      } catch {
        // Selection persists locally even if patch fails
      }
    },
    [orderId]
  );

  const handleCheckout = useCallback(() => {
    if (!orderId || selectedId === null) return;
    navigate(`/checkout/${orderId}`);
  }, [orderId, selectedId, navigate]);

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
              <Headphones className="h-6 w-6 text-white" />
            </motion.div>
            <p className="text-[var(--text-muted)]">
              {t("preview.fetching", "Loading your songs...")}
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
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--glass-bg)] px-4 py-2 backdrop-blur-sm">
              <Headphones className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-sm font-medium text-[var(--text-muted)]">
                {t("preview.badge", "Step 4 of 4")}
              </span>
            </div>
            <GradientText
              as="h1"
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              {t("preview.title", "Listen to Your Song")}
            </GradientText>
            <p className="mx-auto max-w-md text-[var(--text-muted)]">
              {t(
                "preview.subtitle",
                "We composed multiple variations. Listen and choose your favorite."
              )}
            </p>
          </motion.div>

          {/* Song Variations */}
          <motion.div
            variants={staggerList}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {songs.map((song, index) => {
              const isSelected = selectedId === song.id;
              const labelInfo = variationLabels[index] ?? {
                label: `Variation ${index + 1}`,
              };

              return (
                <motion.div key={song.id} variants={fadeUp}>
                  <Card
                    hoverable
                    onClick={() => handleSelect(song.id)}
                    className={cn(
                      "relative overflow-hidden p-5 transition-all duration-300",
                      isSelected && [
                        "ring-2 ring-transparent",
                        "shadow-xl shadow-[var(--color-primary)]/20",
                      ]
                    )}
                    style={
                      isSelected
                        ? {
                            background:
                              "linear-gradient(var(--glass-bg), var(--glass-bg)) padding-box, var(--gradient-main) border-box",
                            borderColor: "transparent",
                          }
                        : undefined
                    }
                  >
                    {/* Selected checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[image:var(--gradient-main)] text-white shadow-lg"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}

                    {/* Variation label */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)]">
                        <Volume2
                          className={cn(
                            "h-5 w-5",
                            isSelected
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--text-muted)]"
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text)]">
                          {t(
                            `preview.variation.${index + 1}`,
                            `Variation ${index + 1}`
                          )}{" "}
                          <span className="font-normal text-[var(--text-muted)]">
                            &mdash;{" "}
                            {t(
                              `preview.variationLabel.${index}`,
                              labelInfo.label
                            )}
                          </span>
                        </h3>
                        {song.durationSeconds && (
                          <span className="text-xs text-[var(--text-muted)]">
                            {Math.floor(song.durationSeconds / 60)}:
                            {String(
                              Math.round(song.durationSeconds % 60)
                            ).padStart(2, "0")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Player + Waveform */}
                    <div className="space-y-3">
                      {song.previewUrl && (
                        <MiniPlayer
                          src={song.previewUrl}
                          title={t(
                            `preview.variation.${index + 1}`,
                            `Variation ${index + 1}`
                          )}
                        />
                      )}
                      {song.previewUrl && (
                        <Waveform src={song.previewUrl} height={40} />
                      )}
                    </div>

                    {/* Select button */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant={isSelected ? "primary" : "secondary"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(song.id);
                        }}
                        icon={
                          isSelected ? (
                            <Check className="h-4 w-4" />
                          ) : undefined
                        }
                      >
                        {isSelected
                          ? t("preview.selected", "Selected")
                          : t("preview.select", "Select")}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Preview note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <Lock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">
              {t(
                "preview.previewNote",
                "You're hearing a 10-second preview"
              )}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-center"
          >
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={selectedId === null}
              icon={<Lock className="h-5 w-5" />}
              className="px-10 py-5 text-lg font-bold"
            >
              {t("preview.unlock", "I want this song!")}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Shell>
  );
}
