import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Home, Music } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Shell } from "@/components/layout/Shell";
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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const noteVariants = {
  animate: (i: number) => ({
    y: [0, -30, 0],
    x: [0, i % 2 === 0 ? 10 : -10, 0],
    rotate: [0, i % 2 === 0 ? 20 : -20, 0],
    opacity: [0.15, 0.5, 0.15],
    transition: {
      duration: 3 + i * 0.7,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.4,
    },
  }),
};

const notes = [
  { char: "♪", left: "10%", top: "20%", size: 32 },
  { char: "♫", left: "85%", top: "15%", size: 40 },
  { char: "♩", left: "20%", top: "70%", size: 28 },
  { char: "♬", left: "75%", top: "65%", size: 36 },
  { char: "♪", left: "50%", top: "10%", size: 24 },
  { char: "♫", left: "30%", top: "85%", size: 30 },
  { char: "♩", left: "65%", top: "80%", size: 26 },
  { char: "♬", left: "90%", top: "45%", size: 34 },
];

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
      >
        {/* Decorative floating music notes */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {notes.map((note, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={noteVariants}
              animate="animate"
              className="absolute text-[var(--color-primary)]"
              style={{
                left: note.left,
                top: note.top,
                fontSize: `${note.size}px`,
              }}
            >
              {note.char}
            </motion.span>
          ))}
        </div>

        {/* Gradient mesh background */}
        <div className="pointer-events-none absolute inset-0 -z-20">
          <motion.div
            className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* 404 number */}
          <motion.div variants={fadeUp}>
            <GradientText
              as="h1"
              className="text-[8rem] font-black leading-none sm:text-[10rem] md:text-[12rem]"
            >
              404
            </GradientText>
          </motion.div>

          {/* Music icon */}
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--glass-bg)] backdrop-blur-sm"
            >
              <Music className="h-8 w-8 text-[var(--color-primary)]" />
            </motion.div>
          </motion.div>

          {/* Messages */}
          <motion.h2
            variants={fadeUp}
            className="mb-3 text-2xl font-bold text-[var(--text)] sm:text-3xl"
          >
            {t("notFound.title", "Page Not Found")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mb-8 text-lg text-[var(--text-muted)]"
          >
            {t(
              "notFound.message",
              "This song hasn't been written yet."
            )}
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Button
              size="lg"
              onClick={() => navigate("/")}
              icon={<Home className="h-5 w-5" />}
              className="px-8"
            >
              {t("notFound.goHome", "Go Home")}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Shell>
  );
}
