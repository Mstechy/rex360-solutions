import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added for navigation
import { Calendar, User, Loader, ArrowRight, Tag, ArrowLeft } from 'lucide-react'; // 2. Added ArrowLeft icon
import { supabase } from '../SupabaseClient'; 
import FloatingContact from '../components/FloatingContact';
import Footer from '../components/Footer';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 3. Initialize navigation

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

      {/* 1. Header Section - PRESERVED */}
      <div className="bg-cac-blue py-16 px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Official CAC Updates
            </h1>
            <p className="text-blue-200 font-bold uppercase tracking-widest text-xs">
            Archive of Policies, News & Announcements
            </p>
        </div>
      </div>

      {/* 2. News Grid - PRESERVED */}
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
          <div className="grid gap-10">
            {news.map((item) => (
              <article 
                key={item.id} 
                className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-cac-green group-hover:w-3 transition-all"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-2 bg-green-50 text-cac-green px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 md:mb-0 w-fit">
                    <Tag size={12} />
                    {item.category || 'Official Update'}
                  </span>
                  
                  <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase">
                    <span className="flex items-center"><Calendar size={14} className="mr-2"/> {item.date}</span>
                    <span className="flex items-center"><User size={14} className="mr-2"/> Admin</span>
                  </div>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 leading-tight">
                  {item.title}
                </h2>
                
                <p className="text-slate-600 leading-relaxed font-medium mb-8 whitespace-pre-line">
                  {item.content}
                </p>

                <div className="w-full h-px bg-slate-100 mb-6"></div>
                
                <div className="flex items-center text-cac-blue font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                   Verified Information <ArrowRight size={16} className="ml-2"/>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <FloatingContact />
      <Footer />
    </div>
  );
};

export default NewsPage;