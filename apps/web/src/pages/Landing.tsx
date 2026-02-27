import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Music, MessageSquareText, Headphones, Star, ArrowRight } from "lucide-react";
import { MUSIC_STYLES } from "@birthday-song/shared";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { SocialProof } from "@/components/shared/SocialProof";
import { GradientText } from "@/components/shared/GradientText";
import { Shell } from "@/components/layout/Shell";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const demoStyles = MUSIC_STYLES.filter((s) =>
  ["pop", "rap", "mizrachi"].includes(s.id)
);

const steps = [
  { icon: MessageSquareText, key: "questionnaire" },
  { icon: Music, key: "style" },
  { icon: Headphones, key: "song" },
] as const;

const testimonials = [
  { name: "Sarah M.", rating: 5, key: "testimonial1" },
  { name: "David K.", rating: 5, key: "testimonial2" },
  { name: "Maya L.", rating: 5, key: "testimonial3" },
];

export default function Landing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language === "he" ? "he" : "en";
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Animated gradient mesh background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)",
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 60, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
          <motion.div
            className="absolute -right-1/4 top-1/4 h-[600px] w-[600px] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)",
            }}
            animate={{
              x: [0, -80, 40, 0],
              y: [0, 60, -100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-[700px] w-[700px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
            }}
            animate={{
              x: [0, 60, -80, 0],
              y: [0, -40, 80, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
        </div>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 text-center"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl"
          >
            <motion.div variants={fadeUp}>
              <GradientText
                as="h1"
                className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {t("landing.hero.title", "The Most Personal Birthday Gift")}
              </GradientText>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-lg text-[var(--text-muted)] sm:text-xl"
            >
              {t(
                "landing.hero.subtitle",
                "AI creates a unique, personalized birthday song in minutes. Funny, emotional, unforgettable."
              )}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10">
              <Button
                size="lg"
                onClick={() => navigate("/create")}
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
                className="px-10 py-5 text-lg font-bold"
              >
                {t("landing.hero.cta", "Create a Birthday Song — Free!")}
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <SocialProof
                count={2347}
                label={t("landing.hero.socialProof", "songs created this week")}
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Demo Section */}
        <section className="relative px-4 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto max-w-5xl"
          >
            <motion.h2
              variants={fadeUp}
              className="mb-4 text-center text-3xl font-bold text-[var(--text)] sm:text-4xl"
            >
              {t("landing.demo.title", "Hear the Magic")}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mb-12 text-center text-[var(--text-muted)]"
            >
              {t(
                "landing.demo.subtitle",
                "Listen to real songs created by our AI"
              )}
            </motion.p>

            {/* Main demo player */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-12 max-w-md"
            >
              <Card className="p-6">
                <p className="mb-3 text-center text-sm font-medium text-[var(--color-primary)]">
                  {t("landing.demo.featured", "Featured Demo")}
                </p>
                <MiniPlayer
                  url="/demo/birthday-demo.mp3"
                  label={t("landing.demo.demoTitle", "Happy Birthday, Sarah!")}
                />
              </Card>
            </motion.div>

            {/* Style preview cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {demoStyles.map((style) => (
                <motion.div key={style.id} variants={fadeUp}>
                  <Card className="p-5 text-center">
                    <span className="mb-3 block text-4xl">{style.emoji}</span>
                    <h3 className="mb-1 text-lg font-bold text-[var(--text)]">
                      {lang === "he" ? style.nameHe : style.nameEn}
                    </h3>
                    <p className="mb-4 text-sm text-[var(--text-muted)]">
                      {lang === "he" ? style.descriptionHe : style.descriptionEn}
                    </p>
                    <MiniPlayer
                      url={`/demo/${style.id}-preview.mp3`}
                      label={style.nameEn}
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="relative px-4 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto max-w-4xl"
          >
            <motion.h2
              variants={fadeUp}
              className="mb-4 text-center text-3xl font-bold text-[var(--text)] sm:text-4xl"
            >
              {t("landing.howItWorks.title", "How It Works")}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mb-16 text-center text-[var(--text-muted)]"
            >
              {t(
                "landing.howItWorks.subtitle",
                "Three simple steps to an unforgettable gift"
              )}
            </motion.p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div key={step.key} variants={fadeUp}>
                    <Card
                      hoverable={false}
                      className="relative flex flex-col items-center p-8 text-center"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] text-white shadow-lg shadow-[var(--color-primary)]/25">
                        <Icon className="h-8 w-8" />
                      </div>
                      <span className="mb-2 text-sm font-bold text-[var(--color-primary)]">
                        {t("landing.howItWorks.stepLabel", "Step {{num}}", {
                          num: index + 1,
                        })}
                      </span>
                      <h3 className="mb-2 text-xl font-bold text-[var(--text)]">
                        {t(
                          `landing.howItWorks.step${index + 1}.title`,
                          index === 0
                            ? "Answer Questions"
                            : index === 1
                              ? "Choose a Style"
                              : "Get Your Song"
                        )}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {t(
                          `landing.howItWorks.step${index + 1}.description`,
                          index === 0
                            ? "Tell us about the birthday person — their personality, hobbies, funny stories."
                            : index === 1
                              ? "Pick from Pop, Rap, Rock, Mizrachi and more. Each style crafted uniquely."
                              : "AI creates a professional-quality song in minutes. Listen, love it, share it."
                        )}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="relative px-4 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto max-w-5xl"
          >
            <motion.h2
              variants={fadeUp}
              className="mb-12 text-center text-3xl font-bold text-[var(--text)] sm:text-4xl"
            >
              {t("landing.testimonials.title", "What People Are Saying")}
            </motion.h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((review, index) => (
                <motion.div key={review.key} variants={fadeUp}>
                  <Card hoverable={false} className="p-6">
                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-[var(--text)]">
                      {t(
                        `landing.testimonials.${review.key}.text`,
                        index === 0
                          ? "My best friend literally cried when she heard her song. It mentioned her cat, her obsession with sushi, everything! Best birthday gift ever."
                          : index === 1
                            ? "I chose the rap style for my dad's 60th birthday. The whole family couldn't stop laughing. The lyrics were so spot-on!"
                            : "Ordered it at 11pm the night before the party. Had a professional song ready in 15 minutes. Absolute lifesaver!"
                      )}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[image:var(--gradient-main)] text-sm font-bold text-white">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {review.name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {t(
                            `landing.testimonials.${review.key}.role`,
                            index === 0
                              ? "Best Friend"
                              : index === 1
                                ? "Daughter"
                                : "Office Manager"
                          )}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer CTA */}
        <section className="relative px-4 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="mb-6 text-3xl font-bold text-[var(--text)] sm:text-4xl"
            >
              {t("landing.footerCta.title", "Ready?")}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mb-8 text-lg text-[var(--text-muted)]"
            >
              {t(
                "landing.footerCta.subtitle",
                "Create your personalized birthday song now. It's free to try!"
              )}
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                size="lg"
                onClick={() => navigate("/create")}
                icon={<Music className="h-5 w-5" />}
                className="px-10 py-5 text-lg font-bold"
              >
                {t("landing.footerCta.cta", "Create Your Song Now")}
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </motion.div>
    </Shell>
  );
}
