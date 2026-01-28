import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 1. LAYOUT & UTILITIES
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import FloatingContact from './components/FloatingContact.jsx';

// 2. HOMEPAGE SECTIONS
import HeroSlider from './components/HeroSlider.jsx';
import AgentIntro from './components/AgentIntro.jsx'; 
import ServicesSection from './components/ServicesSection.jsx';
import NewsSection from './components/NewsSection.jsx';
import FAQ from './components/FAQ.jsx';
import NigeriaSymbol from './components/NigeriaSymbol.jsx'; 

// 3. PAGES
import Registration from './pages/Registration.jsx';
import NewsPage from './pages/NewsPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      
      <div className="flex flex-col min-h-screen bg-white relative">
        <Navbar />

        {/* ONLY FIX: Changed mobile padding from 70px to 85px to clear the logo on phones */}
        <main className="flex-grow pt-[85px] md:pt-[90px]">
            <AnimatePresence>
            <Routes>
              {/* HOME ROUTE */}
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <HeroSlider />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <AgentIntro />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <ServicesSection />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <NewsSection />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <FAQ />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
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
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Registration />
                </motion.div>
              } />
              <Route path="/register" element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Registration />
                </motion.div>
              } />

              {/* OTHER PAGES */}
              <Route path="/news" element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <NewsPage />
                </motion.div>
              } />
              <Route path="/admin" element={
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <AdminLogin />
                </motion.div>
              } />
              <Route path="/admin/dashboard" element={
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <AdminDashboard />
                </motion.div>
              } />

              {/* 404 FALLBACK */}
              <Route path="*" element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-20 text-center text-2xl font-bold">Page Not Found</div>
                </motion.div>
              } />
              </Routes>
            </AnimatePresence>
        </main>

        <FloatingContact />
        <Footer />
      </div>
    </Router>
  );
}

export default App;