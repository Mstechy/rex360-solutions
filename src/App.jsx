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
import HowItWorks from './components/HowItWorks.jsx';
import ProofOfDelivery from './components/ProofOfDelivery.jsx';
import WhyChooseUs from './components/WhyChooseUs.jsx';
import Testimonials from './components/Testimonials.jsx';
import NewsSection from './components/NewsSection.jsx';
import FAQ from './components/FAQ.jsx';
import LegitimacyHub from './components/LegitimacyHub.jsx';
import NigeriaSymbol from './components/NigeriaSymbol.jsx';

// 3. PAGES (Lazy load - only load when needed)
const Registration = lazy(() => import('./pages/Registration.jsx'));
const RegistrationWizard = lazy(() => import('./pages/RegistrationWizard.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Apply = lazy(() => import('./pages/Apply.jsx'));
const NewsPage = lazy(() => import('./pages/NewsPage.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

// 4. RESPONSIVE HOOKS
import { useIsMobile, useIsDesktop, premiumEasings, pageTransitionVariants } from './hooks/useResponsiveMotion.js';
import { useAutoScrollSections, enhancedAnimationVariants, useScrollAnimation } from './hooks/useEnhancedAnimations.js';

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

  // Define sections for auto-scroll
  const sections = [
    { id: 'hero-slider', name: 'Hero' },
    { id: 'agent-intro', name: 'About' },
    { id: 'services-section', name: 'Services' },
    { id: 'how-it-works', name: 'Process' },
    { id: 'proof-of-delivery', name: 'Proof' },
    { id: 'why-choose-us', name: 'Why Choose Us' },
    { id: 'testimonials', name: 'Testimonials' },
    { id: 'news-section', name: 'News' },
    { id: 'faq', name: 'FAQ' },
    { id: 'legitimacy-hub', name: 'Legitimacy' }
  ];

  const { currentSection, isAutoScrolling, scrollToSection, toggleAutoScroll } = useAutoScrollSections(sections, true, 10000);

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
                  {/* Auto-scroll indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="fixed top-24 right-4 z-50 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg"
                  >
                    <button
                      onClick={toggleAutoScroll}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        isAutoScrolling ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                      }`}
                      title={isAutoScrolling ? 'Disable auto-scroll' : 'Enable auto-scroll'}
                    />
                  </motion.div>

                  <motion.div
                    id="hero-slider"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.6, 0, 0) }}
                    whileInView={{ ...enhancedAnimationVariants.parallax(-20) }}
                    viewport={{ once: true }}
                  >
                    <HeroSlider />
                  </motion.div>
                  <motion.div
                    id="agent-intro"
                    initial={{ opacity: 0, x: -getOffset() }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.05, 0.1) }}
                    whileInView={{ ...enhancedAnimationVariants.slideInRotate('left') }}
                    viewport={{ once: true }}
                  >
                    <AgentIntro />
                  </motion.div>
                  <motion.div
                    id="services-section"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.1, 0.2) }}
                    whileInView={{ ...enhancedAnimationVariants.fadeInUpBounce }}
                    viewport={{ once: true }}
                  >
                    <ServicesSection />
                  </motion.div>
                  <motion.div
                    id="how-it-works"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.15, 0.25) }}
                    whileInView={{ ...enhancedAnimationVariants.slideInRotate('right') }}
                    viewport={{ once: true }}
                  >
                    <HowItWorks />
                  </motion.div>
                  <motion.div
                    id="proof-of-delivery"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.2, 0.3) }}
                    whileInView={{ ...enhancedAnimationVariants.scaleGlow }}
                    viewport={{ once: true }}
                  >
                    <ProofOfDelivery />
                  </motion.div>
                  <motion.div
                    id="why-choose-us"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.25, 0.35) }}
                    whileInView={{ ...enhancedAnimationVariants.fadeInUpBounce }}
                    viewport={{ once: true }}
                  >
                    <WhyChooseUs />
                  </motion.div>
                  <motion.div
                    id="testimonials"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.2, 0.3) }}
                    whileInView={{ ...enhancedAnimationVariants.slideInRotate('left') }}
                    viewport={{ once: true }}
                  >
                    <Testimonials />
                  </motion.div>
                  <motion.div
                    id="news-section"
                    initial={{ opacity: 0, x: getOffset() }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.2, 0.3) }}
                    whileInView={{ ...enhancedAnimationVariants.parallax(30) }}
                    viewport={{ once: true }}
                  >
                    <NewsSection />
                  </motion.div>
                  <motion.div
                    id="faq"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.25, 0.4) }}
                    whileInView={{ ...enhancedAnimationVariants.scaleGlow }}
                    viewport={{ once: true }}
                  >
                    <FAQ />
                  </motion.div>
                  <motion.div
                    id="legitimacy-hub"
                    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.3, 0.45) }}
                    whileInView={{ ...enhancedAnimationVariants.fadeInUpBounce }}
                    viewport={{ once: true }}
                  >
                    <LegitimacyHub />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...getAnimationSettings(0.4, 0.8, 0.35, 0.5) }}
                    whileInView={{ ...enhancedAnimationVariants.magnetic }}
                    viewport={{ once: true }}
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
                <RegistrationWizard />
              </motion.div>
            } />
            <Route path="/register" element={
              <motion.div
                initial={{ opacity: 0, x: isMobile ? 30 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? -30 : -100 }}
                transition={{ duration: isMobile ? 0.4 : 0.8, ease: premiumEasings.elegant }}
              >
                <RegistrationWizard />
              </motion.div>
            } />

            {/* SERVICES ROUTE - Full Services Listing */}
            <Route path="/services" element={
              <motion.div
                initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isMobile ? -20 : -30 }}
                transition={{ duration: isMobile ? 0.4 : 0.6, ease: premiumEasings.elegant }}
              >
                <Services />
              </motion.div>
            } />

            {/* APPLY ROUTE - Service Application Form */}
            <Route path="/apply" element={
              <motion.div
                initial={{ opacity: 0, x: isMobile ? 30 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? -30 : -100 }}
                transition={{ duration: isMobile ? 0.4 : 0.8, ease: premiumEasings.elegant }}
              >
                <Apply />
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
