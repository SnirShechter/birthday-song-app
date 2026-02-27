"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Facebook,
  Search,
  CheckCircle2,
  AlertCircle,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { SocialProfile } from "@birthday-song/shared";

type Platform = "instagram" | "tiktok" | "facebook";

interface PlatformConfig {
  id: Platform;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    color: "from-gray-900 to-gray-700 dark:from-white dark:to-gray-300",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    color: "from-blue-600 to-blue-400",
  },
];

const MOCK_PROFILE: SocialProfile = {
  status: "found",
  name: "Alex Johnson",
  estimatedAge: 28,
  personalityTraits: ["Funny", "Adventurous", "Creative"],
  hobbies: ["Photography", "Hiking", "Cooking"],
  humorStyle: "Sarcastic and witty",
  funnyThings: ["Always loses keys", "Terrible at parking"],
  occupationHints: "Works in tech / design",
  favoriteFood: "Sushi",
  travelPlaces: ["Japan", "Iceland"],
  keyPhrases: ["Living my best life", "Coffee first"],
  suggestedSongTone: "funny",
  songMaterial: [
    "Always late but worth the wait",
    "Sushi obsession is real",
    "Camera roll has 10k photos",
  ],
};

export interface SocialAutofillProps {
  onAutofill: (data: SocialProfile) => void;
}

export function SocialAutofill({ onAutofill }: SocialAutofillProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleScan = useCallback(() => {
    if (!url.trim()) return;

    setStatus("loading");
    setProgress(0);
    setProfile(null);
    setErrorMessage("");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      if (url.toLowerCase().includes("private")) {
        setStatus("error");
        setErrorMessage("Profile is private. We can't scan private profiles.");
      } else {
        setStatus("success");
        setProfile(MOCK_PROFILE);
      }
    }, 2000);
  }, [url]);

  const handleUseData = useCallback(() => {
    if (profile) {
      onAutofill(profile);
    }
  }, [profile, onAutofill]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setProfile(null);
    setUrl("");
    setErrorMessage("");
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Platform selector */}
      <div className="flex gap-2">
        {PLATFORMS.map((p) => (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedPlatform(p.id);
              if (status !== "idle") handleReset();
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
              "border transition-all duration-200 cursor-pointer",
              selectedPlatform === p.id
                ? "bg-[var(--surface-elevated)] border-[var(--color-primary)] text-[var(--text)] shadow-md"
                : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border)]"
            )}
          >
            {p.icon}
            <span className="hidden sm:inline">{p.label}</span>
          </motion.button>
        ))}
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`Enter ${PLATFORMS.find((p) => p.id === selectedPlatform)?.label} URL or username...`}
          dir="ltr"
          className={cn(
            "flex-1 rounded-xl px-4 py-3 text-sm",
            "bg-[var(--surface)] text-[var(--text)]",
            "border border-[var(--border)]",
            "placeholder:text-[var(--text-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]",
            "transition-colors duration-200"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleScan();
          }}
          disabled={status === "loading"}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={handleScan}
          disabled={!url.trim() || status === "loading"}
          className={cn(
            "flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold",
            "bg-[image:var(--gradient-main)] text-white",
            "shadow-lg shadow-[var(--color-primary)]/25",
            "hover:shadow-xl hover:brightness-110",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
            "transition-all duration-200 cursor-pointer"
          )}
        >
          <Search className="h-4 w-4" />
          Scan
        </motion.button>
      </div>

      {/* Loading state */}
      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="h-4 w-4" />
                </motion.div>
                Scanning profile...
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div
                  className="h-full rounded-full bg-[image:var(--gradient-main)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {progress}% complete
              </p>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-500">
                {errorMessage}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                Try a different profile or fill in the form manually.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              Try again
            </motion.button>
          </motion.div>
        )}

        {/* Success state - Profile card */}
        {status === "success" && profile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass rounded-2xl p-5"
          >
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[image:var(--gradient-main)]">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text)]">
                  {profile.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  {profile.estimatedAge && `~${profile.estimatedAge} years old`}
                  {profile.occupationHints &&
                    ` | ${profile.occupationHints}`}
                </p>
              </div>
              <CheckCircle2 className="ml-auto h-5 w-5 text-[var(--color-success)]" />
            </div>

            {/* Data grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.personalityTraits &&
                profile.personalityTraits.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Personality
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {profile.personalityTraits.map((trait) => (
                        <span
                          key={trait}
                          className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              {profile.hobbies && profile.hobbies.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Hobbies
                  </p>
                  <p className="text-sm text-[var(--text)]">
                    {profile.hobbies.join(", ")}
                  </p>
                </div>
              )}
              {profile.humorStyle && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Humor Style
                  </p>
                  <p className="text-sm text-[var(--text)]">
                    {profile.humorStyle}
                  </p>
                </div>
              )}
              {profile.funnyThings && profile.funnyThings.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Funny Things
                  </p>
                  <p className="text-sm text-[var(--text)]">
                    {profile.funnyThings.join("; ")}
                  </p>
                </div>
              )}
              {profile.songMaterial && profile.songMaterial.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Song Material
                  </p>
                  <ul className="list-inside list-disc text-sm text-[var(--text)]">
                    {profile.songMaterial.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={handleUseData}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                  "bg-[image:var(--gradient-main)] text-white",
                  "shadow-lg shadow-[var(--color-primary)]/25",
                  "hover:shadow-xl hover:brightness-110",
                  "transition-all duration-200 cursor-pointer"
                )}
              >
                <Sparkles className="h-4 w-4" />
                Use this data
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] transition-colors cursor-pointer"
              >
                Rescan
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
