import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
          <Routes>
            {/* HOME ROUTE */}
            <Route path="/" element={
              <div className="flex flex-col">
                <HeroSlider />
                <AgentIntro /> 
                <ServicesSection />
                <NewsSection />
                <FAQ />
                <div className="w-full flex justify-center items-center py-16 bg-white">
                   <NigeriaSymbol />
                </div>
              </div>
            } />

            {/* REGISTRATION ROUTES */}
            <Route path="/register/:selectedService" element={<Registration />} />
            <Route path="/register" element={<Registration />} />
            
            {/* OTHER PAGES */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* 404 FALLBACK */}
            <Route path="*" element={<div className="p-20 text-center text-2xl font-bold">Page Not Found</div>} />
          </Routes>
        </main>

        <FloatingContact />
        <Footer />
      </div>
    </Router>
  );
}

export default App;