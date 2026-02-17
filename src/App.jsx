import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 1. LAYOUT & UTILITIES (Keep static - needed on every page)
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import FloatingContact from './components/FloatingContact.jsx';
import SkipLink from './components/SkipLink.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

// 2. HOMEPAGE SECTIONS (Keep static - needed on homepage)
import HeroSlider from './components/HeroSlider.jsx';
import AgentIntro from './components/AgentIntro.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import ProofOfDelivery from './components/ProofOfDelivery.jsx';
import Testimonials from './components/Testimonials.jsx';
import NewsSection from './components/NewsSection.jsx';
import FAQ from './components/FAQ.jsx';
import LegitimacyHub from './components/LegitimacyHub.jsx';
import NigeriaSymbol from './components/NigeriaSymbol.jsx';

// 3. PAGES (Lazy load - only load when needed)
const Registration = lazy(() => import('./pages/Registration.jsx'));
const NewsPage = lazy(() => import('./pages/NewsPage.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

// 4. RESPONSIVE HOOKS
import { useIsMobile, useIsDesktop, premiumEasings, pageTransitionVariants } from './hooks/useResponsiveMotion.js';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingScreen />
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminDashboard = location.pathname === '/admin/dashboard';
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  // Responsive animation settings
  const getAnimationSettings = (mobileDuration = 0.4, desktopDuration = 0.6, mobileDelay = 0.05, desktopDelay = 0.1) => ({
    duration: isMobile ? mobileDuration : desktopDuration,
    delay: isMobile ? mobileDelay : desktopDelay,
    ease: premiumEasings.elegant
  });

  // Get responsive offset values
  const getOffset = (mobile = 15, desktop = 30) => isMobile ? mobile : desktop;

  // Page transition settings
  const getPageTransition = () => isMobile 
    ? pageTransitionVariants.pageIn(false) 
    : pageTransitionVariants.pageIn(false);

  return (
    <div className="flex flex-col min-h-screen bg-white relative" lang="en">
      {!isAdminDashboard && <SkipLink />}
      {!isAdminDashboard && <Navbar />}

      <main 
        id="main-content" 
        tabIndex="-1" 
        className={`flex-grow ${!isAdminDashboard ? 'pt-[85px] md:pt-[90px]' : ''}`}
        role="main"
        aria-label="Main content"
      >
        <AnimatePresence>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
            {/* HOME ROUTE */}
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: isMobile ? 15 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isMobile ? -15 : -20 }}
                transition={{ duration: isMobile ? 0.3 : 0.5, ease: premiumEasings.elegant }}
              >
                <div className="flex flex-col">
                  <motion.div
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.6, 0, 0) }}
                  >
                    <HeroSlider />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -getOffset() }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.05, 0.1) }}
                  >
                    <AgentIntro />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.1, 0.2) }}
                  >
                    <ServicesSection />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.15, 0.25) }}
                  >
                    <ProofOfDelivery />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.2, 0.3) }}
                  >
                    <Testimonials />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: getOffset() }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.2, 0.3) }}
                  >
                    <NewsSection />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.25, 0.4) }}
                  >
                    <FAQ />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.3, 0.45) }}
                  >
                    <LegitimacyHub />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.35, 0.5) }}
                  >
                    <div className="w-full flex justify-center items-center py-16 bg-white">
                       <NigeriaSymbol />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            } />

            {/* REGISTRATION ROUTES */}
            <Route path="/register/:selectedService" element={
              <motion.div
                initial={{ opacity: 0, x: isMobile ? 30 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? -30 : -100 }}
                transition={{ duration: isMobile ? 0.4 : 0.8, ease: premiumEasings.elegant }}
              >
                <Registration />
              </motion.div>
            } />
            <Route path="/register" element={
              <motion.div
                initial={{ opacity: 0, x: isMobile ? 30 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? -30 : -100 }}
                transition={{ duration: isMobile ? 0.4 : 0.8, ease: premiumEasings.elegant }}
              >
                <Registration />
              </motion.div>
            } />

            {/* OTHER PAGES */}
            <Route path="/news" element={
              <motion.div
                initial={{ opacity: 0, scale: isMobile ? 0.98 : 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: isMobile ? 1.02 : 1.05 }}
                transition={{ duration: isMobile ? 0.3 : 0.5, ease: premiumEasings.elegant }}
              >
                <NewsPage />
              </motion.div>
            } />
            <Route path="/admin" element={
              <motion.div
                initial={{ opacity: 0, y: isMobile ? -10 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isMobile ? 10 : 20 }}
                transition={{ duration: isMobile ? 0.3 : 0.5, ease: premiumEasings.elegant }}
              >
                <AdminLogin />
              </motion.div>
            } />
            <Route path="/admin/dashboard" element={
              <motion.div
                initial={{ opacity: 0, x: isMobile ? -30 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? 30 : 100 }}
                transition={{ duration: isMobile ? 0.3 : 0.5, ease: premiumEasings.elegant }}
              >
                <div className="min-h-screen bg-slate-50">
                  <AdminDashboard />
                </div>
              </motion.div>
            } />

            {/* 404 FALLBACK */}
            <Route path="*" element={
              <motion.div
                initial={{ opacity: 0, scale: isMobile ? 0.9 : 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: isMobile ? 0.9 : 0.8 }}
                transition={{ duration: isMobile ? 0.3 : 0.5, ease: premiumEasings.elegant }}
              >
                <div className="p-20 text-center text-2xl font-bold">Page Not Found</div>
              </motion.div>
            } />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {!isAdminDashboard && <FloatingContact />}
      {!isAdminDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <SkipLink />
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
