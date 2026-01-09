import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// --- PAGES ---
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Registration from './pages/Registration';
import NewsPage from './pages/NewsPage';

// --- SECTIONS ---
import HeroSlider from './components/HeroSlider';
import AgentIntro from './components/Agentintro'; // Ensure filename matches exactly
import ServicesSection from './components/ServicesSection';
import NewsSection from './components/NewsSection';
import FAQ from './components/FAQ';
import NigeriaSymbol from './components/NigeriaSymbol';

// --- LAYOUT ---
import Navbar from './components/Navbar';
import FloatingContact from './components/FloatingContact';
import Footer from './components/Footer';

// This helper component decides when to show the Navbar/Footer
const MainLayout = () => {
  const location = useLocation();
  
  // We hide the public Navbar/Footer if we are on an "/admin" page
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* 1. Only show Public Navbar if NOT on Admin page */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* --- PUBLIC HOMEPAGE --- */}
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

        {/* --- PUBLIC PAGES --- */}
        <Route path="/news" element={<NewsPage />} />
        {/* Note: Added optional parameter handling by using two routes or ensuring link matches */}
        <Route path="/register" element={<Registration />} />
        <Route path="/register/:selectedService" element={<Registration />} />

        {/* --- ADMIN PAGES (Secure) --- */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* 2. Global Widgets (Hide on Admin) */}
      {!isAdminPage && <FloatingContact />}
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* SCROLL FIX: Placed here to watch over the whole app */}
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
}

export default App;