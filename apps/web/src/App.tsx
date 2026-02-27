import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from '@/pages/Landing';
import Questionnaire from '@/pages/Questionnaire';
import StylePicker from '@/pages/StylePicker';
import LyricsReview from '@/pages/LyricsReview';
import SongPreview from '@/pages/SongPreview';
import Checkout from '@/pages/Checkout';
import Success from '@/pages/Success';
import VideoUpload from '@/pages/VideoUpload';
import SharePage from '@/pages/SharePage';
import NotFound from '@/pages/NotFound';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: 'easeInOut' as const },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}

export function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <Landing />
            </AnimatedPage>
          }
        />
        <Route
          path="/create"
          element={
            <AnimatedPage>
              <Questionnaire />
            </AnimatedPage>
          }
        />
        <Route
          path="/create/style"
          element={
            <AnimatedPage>
              <StylePicker />
            </AnimatedPage>
          }
        />
        <Route
          path="/create/lyrics"
          element={
            <AnimatedPage>
              <LyricsReview />
            </AnimatedPage>
          }
        />
        <Route
          path="/create/preview"
          element={
            <AnimatedPage>
              <SongPreview />
            </AnimatedPage>
          }
        />
        <Route
          path="/checkout/:orderId"
          element={
            <AnimatedPage>
              <Checkout />
            </AnimatedPage>
          }
        />
        <Route
          path="/success"
          element={
            <AnimatedPage>
              <Success />
            </AnimatedPage>
          }
        />
        <Route
          path="/video/:orderId"
          element={
            <AnimatedPage>
              <VideoUpload />
            </AnimatedPage>
          }
        />
        <Route
          path="/share/:orderId"
          element={
            <AnimatedPage>
              <SharePage />
            </AnimatedPage>
          }
        />
        <Route
          path="*"
          element={
            <AnimatedPage>
              <NotFound />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
