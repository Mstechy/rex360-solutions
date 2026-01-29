import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added for navigation
import { Calendar, User, Loader, ArrowRight, Tag, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'; // 2. Updated icons for navigation
import { motion, AnimatePresence } from 'framer-motion'; // 3. Added Framer Motion
import { supabase } from '../SupabaseClient';
import FloatingContact from '../components/FloatingContact';
import Footer from '../components/Footer';
import newsImage from '/newsimage.png.jpg'; // Import the news image

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0); // State for current news index
  const navigate = useNavigate(); // 3. Initialize navigation

  // Navigation functions
  const nextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % news.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  // FETCH ALL NEWS (No Limit) - PRESERVED
  useEffect(() => {
    const fetchAllNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false });
      
      if (data) setNews(data);
      setLoading(false);
    };

    fetchAllNews();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-28">
      
      {/* ADDED: BACK BUTTON (Styled like Registration Page) */}
      <div className="max-w-5xl mx-auto px-6 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-500 hover:text-cac-blue font-black text-xs uppercase transition-all"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      {/* 1. Header Section - Compact Professional Image */}
      <div className="relative overflow-hidden h-96 md:h-[500px] flex items-center justify-center bg-slate-50">
        <img
          src={newsImage}
          alt="News Image"
          className="w-full h-full object-contain"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* 2. Sequential News Display */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin text-cac-green mx-auto mb-4" size={40} />
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading Archive...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold">No updates have been published yet.</p>
          </div>
        ) : (
          <>
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={prevNews}
                className="flex items-center gap-2 bg-cac-blue text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-bold uppercase text-xs tracking-widest"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                {currentNewsIndex + 1} of {news.length}
              </div>
              <button
                onClick={nextNews}
                className="flex items-center gap-2 bg-cac-blue text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-bold uppercase text-xs tracking-widest"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            {/* Single News Item Display */}
            <AnimatePresence mode="wait">
              <motion.article
                key={currentNewsIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="mb-4">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 leading-tight">
                    {news[currentNewsIndex].title}
                  </h2>
                  <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase mb-6">
                    <span className="flex items-center"><Calendar size={14} className="mr-1"/> {news[currentNewsIndex].date}</span>
                    <span className="flex items-center"><User size={14} className="mr-1"/> Admin</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-2 bg-green-50 text-cac-green px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-4 md:mb-0 w-fit">
                      <Tag size={14} />
                      {news[currentNewsIndex].category || 'Official Update'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line text-lg">
                    {news[currentNewsIndex].content}
                  </p>
                  <div className="flex items-center text-cac-blue font-black text-xs uppercase tracking-widest mt-6">
                    Verified Information <ArrowRight size={16} className="ml-2"/>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </>
        )}
      </div>

      <FloatingContact />
      <Footer />
    </div>
  );
};

export default NewsPage;