import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Music,
  Cake,
  User,
  Heart,
  Laugh,
  Briefcase,
  Users,
  Star,
  Link,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  type QuestionnaireAnswers,
  type Gender,
  type Tone,
  type SocialProfile,
} from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import api from "@/lib/api";
import { useOrderStore } from "@/stores/order";
import { Button } from "@/components/ui/Button";
import { Shell } from "@/components/layout/Shell";

const STORAGE_KEY = "birthday-song-questionnaire";

const TONE_OPTIONS: { value: Tone; emoji: string; labelKey: string; fallback: string }[] = [
  { value: "funny", emoji: "😂", labelKey: "tone.funny", fallback: "Funny" },
  { value: "emotional", emoji: "🥹", labelKey: "tone.emotional", fallback: "Emotional" },
  { value: "mixed", emoji: "🎭", labelKey: "tone.mixed", fallback: "Mixed" },
];

const GENDER_OPTIONS: { value: Gender; labelKey: string; fallback: string }[] = [
  { value: "male", labelKey: "gender.male", fallback: "Male / זכר" },
  { value: "female", labelKey: "gender.female", fallback: "Female / נקבה" },
  { value: "other", labelKey: "gender.other", fallback: "Other / אחר" },
];

interface SuggestionChip {
  icon: React.ElementType;
  labelKey: string;
  fallback: string;
  placeholder: string;
}

const SUGGESTION_CHIPS: SuggestionChip[] = [
  { icon: Heart, labelKey: "chips.personality", fallback: "Personality traits", placeholder: "e.g., Always laughing, super stubborn, heart of gold..." },
  { icon: Star, labelKey: "chips.hobbies", fallback: "Hobbies & interests", placeholder: "e.g., Cooking, gaming, surfing, yoga..." },
  { icon: Laugh, labelKey: "chips.funny", fallback: "Funny story", placeholder: "e.g., That time they fell asleep at their own party..." },
  { icon: Briefcase, labelKey: "chips.work", fallback: "What they do", placeholder: "e.g., Software developer who never sleeps..." },
  { icon: Users, labelKey: "chips.people", fallback: "Important people", placeholder: "e.g., Best friend Maya, dog named Cookie..." },
  { icon: Music, labelKey: "chips.message", fallback: "Special message", placeholder: "e.g., You're the best sister in the world..." },
];

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "from-pink-500 to-purple-600" },
  { id: "tiktok", label: "TikTok", color: "from-gray-800 to-gray-900" },
  { id: "facebook", label: "Facebook", color: "from-blue-500 to-blue-700" },
  { id: "linkedin", label: "LinkedIn", color: "from-blue-600 to-blue-800" },
];

export default function Questionnaire() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = (i18n.language === "he" ? "he" : "en") as "en" | "he";
  const isRTL = lang === "he";
  const setOrder = useOrderStore((s) => s.setOrder);
  const setOrderId = useOrderStore((s) => s.setOrderId);

  // Social autofill state
  const [showSocial, setShowSocial] = useState(true);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [socialUrl, setSocialUrl] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialSuccess, setSocialSuccess] = useState(false);

  // Step 1: basics
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [relationship, setRelationship] = useState("");
  const [tone, setTone] = useState<Tone>("mixed");

  // Step 2: free text
  const [freeText, setFreeText] = useState("");
  const [activeChip, setActiveChip] = useState<number | null>(null);

  // Flow
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canProceed = name.trim().length > 0 && gender !== "";

  const handleSocialConnect = useCallback(async () => {
    if (!activePlatform || !socialUrl.trim()) return;
    setSocialLoading(true);

    try {
      const res = await api.post<{ success: boolean; profile: SocialProfile }>(
        "/api/social/autofill",
        { url: socialUrl.trim() }
      );

      const profile = res.profile;
      if (profile.status === "found") {
        // Auto-fill form fields with animation delay
        if (profile.name) setName(profile.name);
        if (profile.estimatedAge) setAge(String(profile.estimatedAge));
        if (profile.suggestedSongTone) setTone(profile.suggestedSongTone);

        // Build free text from profile data
        const parts: string[] = [];
        if (profile.personalityTraits?.length) {
          parts.push(profile.personalityTraits.join(", "));
        }
        if (profile.hobbies?.length) {
          parts.push(profile.hobbies.join(", "));
        }
        if (profile.funnyThings?.length) {
          parts.push(profile.funnyThings[0]);
        }
        if (profile.occupationHints) {
          parts.push(profile.occupationHints);
        }
        if (profile.petInfo) {
          parts.push(profile.petInfo);
        }
        if (parts.length > 0) {
          setFreeText(parts.join(". "));
        }

        setSocialSuccess(true);
        // Move to form after short delay
        setTimeout(() => {
          setShowSocial(false);
        }, 1500);
      }
    } catch {
      // Silently fail and let user fill manually
    } finally {
      setSocialLoading(false);
    }
  }, [activePlatform, socialUrl]);

  const handleChipClick = useCallback((index: number, placeholder: string) => {
    setActiveChip(index);
    // Focus textarea and add a hint
    if (textareaRef.current) {
      textareaRef.current.focus();
      if (!freeText.trim()) {
        textareaRef.current.placeholder = placeholder;
      }
    }
  }, [freeText]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const finalAnswers: QuestionnaireAnswers = {
        recipientName: name.trim(),
        recipientGender: gender as Gender,
        recipientAge: age ? parseInt(age, 10) : undefined,
        relationship: relationship.trim() || undefined,
        desiredTone: tone,
        language: lang,
        // Pack free text into multiple fields for better lyrics generation
        hobbies: freeText.trim() || undefined,
        personalityTraits: [],
        desiredMessage: freeText.trim() || undefined,
      };

      const response = await api.post<{
        success: boolean;
        order: { id: string } & Record<string, unknown>;
      }>("/api/orders", finalAnswers);

      if (response.success && response.order) {
        setOrderId(response.order.id);
        setOrder(response.order as never);
        localStorage.removeItem(STORAGE_KEY);
        navigate("/create/style");
      } else {
        setError(t("questionnaire.error", "Something went wrong. Please try again."));
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(t("questionnaire.error", "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }, [name, age, gender, relationship, tone, freeText, lang, navigate, setOrder, setOrderId, submitting, t]);

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen flex-col"
      >
        {/* Progress indicator */}
        <div className="mx-auto w-full max-w-lg px-4 pt-6">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all",
                "bg-[image:var(--gradient-main)] text-white shadow-lg shadow-[var(--color-primary)]/25"
              )}
            >
              1
            </div>
            <div
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                step >= 2
                  ? "bg-[image:var(--gradient-main)]"
                  : "bg-[var(--glass-border)]"
              )}
            />
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all",
                step >= 2
                  ? "bg-[image:var(--gradient-main)] text-white shadow-lg shadow-[var(--color-primary)]/25"
                  : "bg-[var(--glass-bg)] text-[var(--text-muted)] border border-[var(--glass-border)]"
              )}
            >
              2
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Social Connect Card — shown before Step 1 */}
          {showSocial && step === 1 && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="mx-auto w-full max-w-lg px-4 pt-6"
            >
              <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Link className="h-5 w-5 text-[var(--color-primary)]" />
                  <h3 className="text-base font-bold text-[var(--text)]">
                    {t("questionnaire.social.title", "Skip the form? Connect a profile")}
                  </h3>
                </div>
                <p className="mb-4 text-sm text-[var(--text-muted)]">
                  {t("questionnaire.social.subtitle", "We'll auto-fill the details")}
                </p>

                {socialSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-3 text-green-400"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {t("questionnaire.social.success", "Profile connected! Review the details below")}
                    </span>
                  </motion.div>
                ) : (
                  <>
                    {/* Platform buttons */}
                    <div className="mb-3 flex flex-wrap gap-2">
                      {SOCIAL_PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setActivePlatform(activePlatform === p.id ? null : p.id)}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                            activePlatform === p.id
                              ? "bg-[image:var(--gradient-main)] text-white border-transparent shadow-md"
                              : "bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)] hover:border-[var(--border)]"
                          )}
                        >
                          {t(`questionnaire.social.${p.id}`, p.label)}
                        </button>
                      ))}
                    </div>

                    {/* URL input — shown when a platform is selected */}
                    <AnimatePresence>
                      {activePlatform && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={socialUrl}
                              onChange={(e) => setSocialUrl(e.target.value)}
                              placeholder={t("questionnaire.social.placeholder", "Enter profile URL or username")}
                              className="flex-1 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSocialConnect();
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={handleSocialConnect}
                              disabled={!socialUrl.trim() || socialLoading}
                              className="shrink-0 px-4"
                            >
                              {socialLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                t("questionnaire.social.connect", "Connect")
                              )}
                            </Button>
                          </div>
                          {socialLoading && (
                            <p className="mt-2 text-xs text-[var(--color-primary)]">
                              {t("questionnaire.social.connecting", "Getting profile info...")}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {/* Skip link */}
                {!socialSuccess && (
                  <button
                    type="button"
                    onClick={() => setShowSocial(false)}
                    className="mt-3 block w-full text-center text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                  >
                    {t("questionnaire.social.skip", "Fill manually instead")}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto w-full max-w-lg flex-1 px-4 py-8"
            >
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] text-white shadow-lg shadow-[var(--color-primary)]/25"
                >
                  <Cake className="h-8 w-8" />
                </motion.div>
                <h1 className="text-2xl font-bold text-[var(--text)]">
                  {t("questionnaire.step1Title", "Who's the birthday star? 🌟")}
                </h1>
                <p className="mt-2 text-[var(--text-muted)]">
                  {t("questionnaire.step1Subtitle", "Just the basics — we'll make it personal in the next step")}
                </p>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                    {t("questionnaire.nameLabel", "Their name")} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("questionnaire.namePlaceholder", "e.g., Sarah")}
                    className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                    autoFocus
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                    {t("questionnaire.ageLabel", "Age they're turning")}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 30"
                    min={1}
                    max={120}
                    className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                    {t("questionnaire.genderLabel", "Gender")} *
                  </label>
                  <div className="flex gap-2">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGender(opt.value)}
                        className={cn(
                          "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                          gender === opt.value
                            ? "bg-[image:var(--gradient-main)] text-white border-transparent shadow-lg shadow-[var(--color-primary)]/25"
                            : "bg-[var(--glass-bg)] text-[var(--text)] border-[var(--glass-border)] hover:border-[var(--border)]"
                        )}
                      >
                        {t(`questionnaire.${opt.labelKey}`, opt.fallback)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Relationship */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                    {t("questionnaire.relationshipLabel", "Your relationship")}
                  </label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder={t("questionnaire.relationshipPlaceholder", "e.g., Best friend, sister, mom...")}
                    className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                  />
                </div>

                {/* Tone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                    {t("questionnaire.toneLabel", "Song vibe")}
                  </label>
                  <div className="flex gap-2">
                    {TONE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTone(opt.value)}
                        className={cn(
                          "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                          tone === opt.value
                            ? "bg-[image:var(--gradient-main)] text-white border-transparent shadow-lg shadow-[var(--color-primary)]/25"
                            : "bg-[var(--glass-bg)] text-[var(--text)] border-[var(--glass-border)] hover:border-[var(--border)]"
                        )}
                      >
                        <span>{opt.emoji}</span>
                        <span>{t(`questionnaire.${opt.labelKey}`, opt.fallback)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next button */}
              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!canProceed}
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                  className="w-full py-4 text-base font-bold"
                >
                  {t("questionnaire.next", "Next — Make It Personal")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto w-full max-w-lg flex-1 px-4 py-8"
            >
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] text-white shadow-lg shadow-[var(--color-primary)]/25"
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
                <h1 className="text-2xl font-bold text-[var(--text)]">
                  {t("questionnaire.step2Title", "Tell us about {{name}}", { name: name.trim() || "them" })}
                </h1>
                <p className="mt-2 text-[var(--text-muted)]">
                  {t("questionnaire.step2Subtitle", "Write anything you want — the more details, the better the song! Tap a topic for inspiration 👇")}
                </p>
              </div>

              {/* Suggestion chips */}
              <div className="mb-4 flex flex-wrap gap-2 justify-center">
                {SUGGESTION_CHIPS.map((chip, index) => {
                  const Icon = chip.icon;
                  return (
                    <motion.button
                      key={index}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleChipClick(index, chip.placeholder)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        activeChip === index
                          ? "bg-[image:var(--gradient-main)] text-white border-transparent shadow-md"
                          : "bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)] hover:border-[var(--border)] hover:text-[var(--text)]"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t(`questionnaire.${chip.labelKey}`, chip.fallback)}
                    </motion.button>
                  );
                })}
              </div>

              {/* Free text area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder={
                    activeChip !== null
                      ? SUGGESTION_CHIPS[activeChip].placeholder
                      : t("questionnaire.freeTextPlaceholder", "Write whatever comes to mind... their personality, funny stories, hobbies, inside jokes, what makes them special...")
                  }
                  rows={6}
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all resize-none"
                />
                <div className="absolute bottom-3 end-3 text-xs text-[var(--text-muted)]">
                  {freeText.length > 0 && `${freeText.length}/1000`}
                </div>
              </div>

              <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
                {t("questionnaire.freeTextHint", "💡 This is optional but makes the song WAY more personal")}
              </p>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="px-6"
                >
                  {t("questionnaire.back", "Back")}
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  loading={submitting}
                  icon={<Sparkles className="h-5 w-5" />}
                  iconPosition="right"
                  className="flex-1 py-4 text-base font-bold"
                >
                  {t("questionnaire.createSong", "Create Song ✨")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Shell>
  );
}
