import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Music, ArrowRight, Gift, Heart } from "lucide-react";
import type { ShareData } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { AudioPlayer } from "@/components/player/AudioPlayer";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { GradientText } from "@/components/shared/GradientText";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const floatingNoteVariants = {
  animate: (i: number) => ({
    y: [0, -20, 0],
    rotate: [0, i % 2 === 0 ? 15 : -15, 0],
    opacity: [0.3, 0.7, 0.3],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.8,
    },
  }),
};

export default function SharePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  // Fetch share data
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        const data = await api.get<ShareData>(`/api/orders/${orderId}/share`);
        if (!cancelled) {
          setShareData(data);
          setFetching(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setFetching(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

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
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[image:var(--gradient-main)] text-white shadow-2xl"
            >
              <Gift className="h-8 w-8" />
            </motion.div>
            <p className="text-lg text-[var(--text-muted)]">
              {t("share.loading", "Unwrapping your gift...")}
            </p>
          </motion.div>
        </div>
      </Shell>
    );
  }

  if (error || !shareData) {
    return (
      <Shell>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="mb-4 block text-6xl">🎵</span>
            <h1 className="mb-2 text-2xl font-bold text-[var(--text)]">
              {t("share.notFound", "Song not found")}
            </h1>
            <p className="mb-6 text-[var(--text-muted)]">
              {t(
                "share.notFoundDesc",
                "This song may have been removed or the link is incorrect."
              )}
            </p>
            <Button onClick={() => navigate("/")}>
              {t("share.goHome", "Go Home")}
            </Button>
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
        transition={{ duration: 0.4 }}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Decorative floating music notes */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={floatingNoteVariants}
              animate="animate"
              className="absolute text-[var(--color-primary)]/20"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                fontSize: `${24 + i * 8}px`,
              }}
            >
              {i % 2 === 0 ? "♪" : "♫"}
            </motion.div>
          ))}

          {/* Gradient mesh */}
          <motion.div
            className="absolute -top-1/2 left-1/4 h-[600px] w-[600px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
            }}
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)",
            }}
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full max-w-lg"
          >
            {/* Gift icon */}
            <motion.div
              variants={fadeUp}
              className="mb-6 flex justify-center"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[image:var(--gradient-main)] text-white shadow-2xl shadow-[var(--color-primary)]/30"
              >
                <Gift className="h-10 w-10" />
              </motion.div>
            </motion.div>

            {/* Recipient name */}
            <motion.div variants={fadeUp} className="mb-2 text-center">
              <p className="mb-1 text-sm font-medium text-[var(--color-primary)]">
                {t("share.dedicatedTo", "A song dedicated to")}
              </p>
              <GradientText
                as="h1"
                className="text-4xl font-extrabold sm:text-5xl md:text-6xl"
              >
                {shareData.recipientName}
              </GradientText>
            </motion.div>

            {/* Heart */}
            <motion.div
              variants={fadeUp}
              className="mb-8 flex justify-center"
            >
              <Heart className="h-6 w-6 fill-[var(--color-primary)] text-[var(--color-primary)]" />
            </motion.div>

            {/* Audio Player */}
            {shareData.audioUrl && (
              <motion.div variants={fadeUp} className="mb-6">
                <Card hoverable={false} className="overflow-hidden p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Music className="h-4 w-4 text-[var(--color-primary)]" />
                    <span className="text-sm font-medium text-[var(--text)]">
                      {t("share.listenNow", "Listen to the birthday song")}
                    </span>
                  </div>
                  <AudioPlayer
                    src={shareData.audioUrl}
                    title={t("share.songTitle", "Birthday Song for {{name}}", {
                      name: shareData.recipientName,
                    })}
                  />
                </Card>
              </motion.div>
            )}

            {/* Video Player */}
            {shareData.videoUrl && (
              <motion.div variants={fadeUp} className="mb-6">
                <Card hoverable={false} className="overflow-hidden p-0">
                  <VideoPlayer src={shareData.videoUrl} />
                </Card>
              </motion.div>
            )}

            {/* Style badge */}
            {shareData.style && (
              <motion.div
                variants={fadeUp}
                className="mb-8 flex justify-center"
              >
                <span className="rounded-full bg-[var(--glass-bg)] px-4 py-1.5 text-sm font-medium text-[var(--text-muted)] backdrop-blur-sm">
                  {t("share.madeWith", "Made with")} {shareData.style}{" "}
                  {t("share.style", "style")}
                </span>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div variants={fadeUp} className="text-center">
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                {t(
                  "share.cta.subtitle",
                  "Want to surprise someone with a personalized birthday song?"
                )}
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/")}
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
                className="px-8"
              >
                {t("share.cta.button", "Create Your Own Birthday Song")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Shell>
  );
}
