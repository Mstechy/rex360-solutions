import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

// --- LAYOUT (Load these immediately) ---
import Navbar from './components/Navbar';
import FloatingContact from './components/FloatingContact';
import Footer from './components/Footer';

// --- SECTIONS (Load immediately for Homepage speed) ---
import HeroSlider from './components/HeroSlider';
import AgentIntro from './components/AgentIntro'; // Capital "I" matches your file now
import ServicesSection from './components/ServicesSection';
import NewsSection from './components/NewsSection';
import FAQ from './components/FAQ';
import NigeriaSymbol from './components/NigeriaSymbol';

// --- PAGES (LAZY LOAD THESE - Only download when needed) ---
// This splits the code so the initial load is lighter and faster 🚀
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Registration = lazy(() => import('./pages/Registration'));
const NewsPage = lazy(() => import('./pages/NewsPage'));

const MainLayout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {!isAdminPage && <Navbar />}

      {/* The Suspense wrapper shows the Loading Screen while pages download */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* --- HOMEPAGE (Fastest) --- */}
          <Route path="/" element={
            <main className="flex-grow">
              <HeroSlider />
              <AgentIntro />
              <ServicesSection />
              <NewsSection />
              <FAQ />
              <NigeriaSymbol />
            </main>
          } />

          {/* --- LAZY PAGES --- */}
          <Route path="/news" element={<NewsPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/register/:selectedService" element={<Registration />} />

          {/* --- ADMIN PAGES --- */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>

      {!isAdminPage && <FloatingContact />}
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
}

export default App;