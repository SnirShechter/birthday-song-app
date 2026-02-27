import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Copy,
  Share2,
  Video,
  Music,
  ExternalLink,
  PartyPopper,
} from "lucide-react";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { Confetti } from "@/components/shared/Confetti";
import { GradientText } from "@/components/shared/GradientText";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const checkmarkVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.3,
    },
  },
};

export default function Success() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeOrderId = useOrderStore((s) => s.orderId);

  const orderId = searchParams.get("orderId") ?? storeOrderId;
  const socialProfilePhoto = useOrderStore((s) => s.socialProfilePhoto);

  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Fire confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const shareUrl = `${window.location.origin}/share/${orderId}`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      t(
        "success.share.whatsappText",
        "Check out this personalized birthday song I made! {{url}}",
        { url: shareUrl }
      )
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [t, shareUrl]);

  const handleTelegram = useCallback(() => {
    const text = encodeURIComponent(
      t(
        "success.share.telegramText",
        "Check out this personalized birthday song I made!"
      )
    );
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://t.me/share/url?url=${url}&text=${text}`,
      "_blank"
    );
  }, [t, shareUrl]);

  const downloadUrl = `/api/orders/${orderId}/download`;

  return (
    <Shell>
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-lg text-center"
        >
          {/* Checkmark */}
          <motion.div
            variants={checkmarkVariants}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[image:var(--gradient-main)] shadow-2xl shadow-[var(--color-primary)]/30"
          >
            <CheckCircle className="h-12 w-12 text-white" />
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp}>
            <GradientText
              as="h1"
              className="mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl"
            >
              {t("success.title", "Your Song is Ready!")}
            </GradientText>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mb-10 text-lg text-[var(--text-muted)]"
          >
            {t(
              "success.subtitle",
              "Your personalized birthday song has been created. Time to celebrate!"
            )}
          </motion.p>

          {/* Video CTA — always shown */}
          <motion.div variants={fadeUp}>
            <Card hoverable className="mb-6 overflow-hidden p-6">
              <div className="mb-3 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] text-white shadow-lg">
                  <Video className="h-7 w-7" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-[var(--text)]">
                {t("success.video.title", "Want a video clip too?")}
              </h3>
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                {t(
                  "success.video.description",
                  "Turn your song into a stunning music video with photos and effects."
                )}
              </p>

              {socialProfilePhoto && (
                <div className="mb-4 overflow-hidden rounded-xl">
                  <video
                    className="w-full rounded-xl"
                    poster={socialProfilePhoto}
                    src={`${socialProfilePhoto}&blur=2`}
                    muted
                    playsInline
                    controls={false}
                  />
                  <p className="mt-1 text-center text-xs text-[var(--text-muted)]">
                    {t("success.video.preview", "10-second preview")}
                  </p>
                </div>
              )}

              <Button
                size="lg"
                onClick={() => navigate(`/video/${orderId}`)}
                icon={<Video className="h-5 w-5" />}
                iconPosition="right"
                className="w-full py-4 text-base font-bold"
              >
                {t("success.video.cta", "Create a Video Clip")}
              </Button>
            </Card>
          </motion.div>

          {/* Download buttons */}
          <motion.div variants={fadeUp}>
            <Card hoverable={false} className="mb-6 p-6">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[var(--text)]">
                <Download className="h-5 w-5 text-[var(--color-primary)]" />
                {t("success.download.title", "Download Your Song")}
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(`${downloadUrl}?format=mp3`, "_blank")
                  }
                  icon={<Music className="h-5 w-5" />}
                  className="flex-1 sm:flex-initial"
                >
                  {t("success.download.mp3", "Download MP3")}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() =>
                    window.open(`${downloadUrl}?format=wav`, "_blank")
                  }
                  icon={<Music className="h-5 w-5" />}
                  className="flex-1 sm:flex-initial"
                >
                  {t("success.download.wav", "Download WAV")}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Share section */}
          <motion.div variants={fadeUp}>
            <Card hoverable={false} className="mb-6 p-6">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[var(--text)]">
                <Share2 className="h-5 w-5 text-[var(--color-primary)]" />
                {t("success.share.title", "Share the Song")}
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="secondary"
                  onClick={handleCopyLink}
                  icon={
                    copied ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )
                  }
                  className="flex-1 sm:flex-initial"
                >
                  {copied
                    ? t("success.share.copied", "Copied!")
                    : t("success.share.copyLink", "Copy Link")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleWhatsApp}
                  icon={<ExternalLink className="h-4 w-4" />}
                  className="flex-1 sm:flex-initial"
                >
                  {t("success.share.whatsapp", "WhatsApp")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleTelegram}
                  icon={<ExternalLink className="h-4 w-4" />}
                  className="flex-1 sm:flex-initial"
                >
                  {t("success.share.telegram", "Telegram")}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Create another */}
          <motion.div variants={fadeUp} className="mt-4">
            <button
              type="button"
              onClick={() => navigate("/create")}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:underline"
            >
              <PartyPopper className="h-4 w-4" />
              {t("success.createAnother", "Create another song")}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Shell>
  );
}
