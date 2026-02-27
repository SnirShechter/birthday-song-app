import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Video,
  Upload,
  Download,
  ArrowLeft,
  CheckCircle,
  Image,
  Sparkles,
} from "lucide-react";
import { VIDEO_STYLES } from "@birthday-song/shared";
import type { VideoClip } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Shell } from "@/components/layout/Shell";
import { PhotoUploader } from "@/components/video/PhotoUploader";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { StyleGrid } from "@/components/video/StyleGrid";
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

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

type VideoState = "upload" | "generating" | "complete";

export default function VideoUpload() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [videoState, setVideoState] = useState<VideoState>("upload");
  const [videoData, setVideoData] = useState<VideoClip | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadingMessages = [
    t("video.loading.processing", "Processing your photos..."),
    t("video.loading.transitions", "Creating transitions..."),
    t("video.loading.syncing", "Syncing with the music..."),
    t("video.loading.effects", "Adding visual effects..."),
    t("video.loading.rendering", "Rendering your video..."),
    t("video.loading.almost", "Almost ready to watch..."),
  ];

  // Rotate loading messages
  useEffect(() => {
    if (videoState !== "generating") return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [videoState, loadingMessages.length]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handlePhotosChange = useCallback((files: File[]) => {
    setPhotos(files);
  }, []);

  const handleStyleSelect = useCallback((styleId: string) => {
    setSelectedStyle(styleId);
  }, []);

  const pollVideoStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const res = await api.get<{ success: boolean; video: VideoClip }>(
        `/api/orders/${orderId}/video/status`
      );
      const status = res.video;

      if (status.status === "completed") {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setVideoData(status);
        setVideoState("complete");
        setGenerating(false);
      } else if (status.status === "failed") {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setVideoState("upload");
        setGenerating(false);
      }
    } catch {
      // Keep polling on transient errors
    }
  }, [orderId]);

  const handleGenerate = useCallback(async () => {
    if (!orderId || photos.length === 0 || !selectedStyle) return;

    setGenerating(true);
    setVideoState("generating");

    try {
      // Create FormData with photos
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });
      formData.append("videoStyle", selectedStyle);

      await api.post(`/api/orders/${orderId}/video`, {
        videoStyle: selectedStyle,
        photoUrls: photos.map((_, i) => `/mock-assets/photos/upload-${i + 1}.jpg`),
      });

      // Start polling for completion
      pollIntervalRef.current = setInterval(pollVideoStatus, 3000);
    } catch {
      setVideoState("upload");
      setGenerating(false);
    }
  }, [orderId, photos, selectedStyle, pollVideoStatus]);

  if (videoState === "generating") {
    return (
      <LoadingScreen
        messages={loadingMessages}
        currentIndex={loadingMessageIndex}
      />
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
              {t("video.back", "Back")}
            </button>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--glass-bg)] px-4 py-2 backdrop-blur-sm">
              <Video className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-sm font-medium text-[var(--text-muted)]">
                {t("video.badge", "Video Creation")}
              </span>
            </div>
            <GradientText
              as="h1"
              className="mb-3 text-3xl font-extrabold sm:text-4xl"
            >
              {videoState === "complete"
                ? t("video.titleComplete", "Your Video is Ready!")
                : t("video.title", "Create Your Video")}
            </GradientText>
            <p className="mx-auto max-w-md text-[var(--text-muted)]">
              {videoState === "complete"
                ? t(
                    "video.subtitleComplete",
                    "Watch your personalized birthday video below."
                  )
                : t(
                    "video.subtitle",
                    "Upload photos and choose a style to create a stunning music video."
                  )}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {videoState === "upload" && (
              <motion.div
                key="upload"
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Photo Uploader */}
                <motion.div variants={fadeUp}>
                  <Card hoverable={false} className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Image className="h-5 w-5 text-[var(--color-primary)]" />
                      <h3 className="text-lg font-bold text-[var(--text)]">
                        {t("video.photos.title", "Upload Photos")}
                      </h3>
                      <span className="ml-auto text-sm text-[var(--text-muted)]">
                        {t("video.photos.count", "{{count}}/10", {
                          count: photos.length,
                        })}
                      </span>
                    </div>
                    <PhotoUploader
                      maxPhotos={10}
                      photos={photos}
                      onChange={handlePhotosChange}
                    />
                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      {t(
                        "video.photos.hint",
                        "Drag & drop up to 10 photos. Best results with clear, well-lit images."
                      )}
                    </p>
                  </Card>
                </motion.div>

                {/* Style Grid */}
                <motion.div variants={fadeUp}>
                  <Card hoverable={false} className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
                      <h3 className="text-lg font-bold text-[var(--text)]">
                        {t("video.style.title", "Choose a Style")}
                      </h3>
                    </div>
                    <StyleGrid
                      styles={VIDEO_STYLES as unknown as Array<{ id: string; emoji: string; nameEn: string; nameHe: string }>}
                      selectedId={selectedStyle}
                      onSelect={handleStyleSelect}
                    />
                  </Card>
                </motion.div>

                {/* Generate button */}
                <motion.div variants={fadeUp} className="text-center">
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={photos.length === 0 || !selectedStyle}
                    loading={generating}
                    icon={<Video className="h-5 w-5" />}
                    className="px-10 py-5 text-lg font-bold"
                  >
                    {t("video.generate", "Generate Video")}
                  </Button>
                  {(photos.length === 0 || !selectedStyle) && (
                    <p className="mt-3 text-sm text-[var(--text-muted)]">
                      {photos.length === 0 && !selectedStyle
                        ? t(
                            "video.generateHint.both",
                            "Upload photos and select a style to continue"
                          )
                        : photos.length === 0
                          ? t(
                              "video.generateHint.photos",
                              "Upload at least one photo to continue"
                            )
                          : t(
                              "video.generateHint.style",
                              "Select a video style to continue"
                            )}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {videoState === "complete" && videoData && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Completion badge */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-green-400"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {t("video.complete", "Video generated successfully!")}
                    </span>
                  </motion.div>
                </div>

                {/* Video Player */}
                <Card hoverable={false} className="overflow-hidden p-0">
                  {videoData.videoUrl && (
                    <VideoPlayer src={videoData.videoUrl} />
                  )}
                </Card>

                {/* Download */}
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() =>
                      navigate(`/checkout/${orderId}?type=video&price=1999`)
                    }
                    icon={<Download className="h-5 w-5" />}
                  >
                    {t("video.getFullVideo", "Get the Full Video — $19.99")}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate(`/success?orderId=${orderId}`)}
                  >
                    {t("video.backToSuccess", "Back to Song")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Shell>
  );
}
