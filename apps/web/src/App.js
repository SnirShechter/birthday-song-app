import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    transition: { duration: 0.3, ease: 'easeInOut' },
};
function AnimatedPage({ children }) {
    return (_jsx(motion.div, { initial: pageTransition.initial, animate: pageTransition.animate, exit: pageTransition.exit, transition: pageTransition.transition, children: children }));
}
export function App() {
    const location = useLocation();
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/", element: _jsx(AnimatedPage, { children: _jsx(Landing, {}) }) }), _jsx(Route, { path: "/create", element: _jsx(AnimatedPage, { children: _jsx(Questionnaire, {}) }) }), _jsx(Route, { path: "/create/style", element: _jsx(AnimatedPage, { children: _jsx(StylePicker, {}) }) }), _jsx(Route, { path: "/create/lyrics", element: _jsx(AnimatedPage, { children: _jsx(LyricsReview, {}) }) }), _jsx(Route, { path: "/create/preview", element: _jsx(AnimatedPage, { children: _jsx(SongPreview, {}) }) }), _jsx(Route, { path: "/checkout/:orderId", element: _jsx(AnimatedPage, { children: _jsx(Checkout, {}) }) }), _jsx(Route, { path: "/success", element: _jsx(AnimatedPage, { children: _jsx(Success, {}) }) }), _jsx(Route, { path: "/video/:orderId", element: _jsx(AnimatedPage, { children: _jsx(VideoUpload, {}) }) }), _jsx(Route, { path: "/share/:orderId", element: _jsx(AnimatedPage, { children: _jsx(SharePage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(AnimatedPage, { children: _jsx(NotFound, {}) }) })] }, location.pathname) }));
}
