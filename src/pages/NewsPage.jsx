import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added for navigation
import { Calendar, User, Loader, ArrowRight, Tag, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'; // 2. Added ArrowLeft icon and chevrons
import { supabase } from '../SupabaseClient';
import FloatingContact from '../components/FloatingContact';
import Footer from '../components/Footer';
import newsImage from '/newsimage.png.jpg'; // Import the news image

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // State for expanded news item
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

      {/* 1. Header Section - Full Screen Image */}
      <div className="relative overflow-hidden h-screen flex items-center justify-center">
        <img
          src={newsImage}
          alt="News Image"
          className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
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
          <>
            <div className="grid gap-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 leading-tight">
                      {item.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase mb-4">
                      <span className="flex items-center"><Calendar size={14} className="mr-1"/> {item.date}</span>
                      <span className="flex items-center"><User size={14} className="mr-1"/> Admin</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium mb-4 line-clamp-3">
                      {item.content.substring(0, 150)}...
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="ml-4 p-2 bg-cac-green text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {expandedId === item.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-2 bg-green-50 text-cac-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 md:mb-0 w-fit">
                        <Tag size={12} />
                        {item.category || 'Official Update'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                      {item.content}
                    </p>
                    <div className="flex items-center text-cac-blue font-black text-xs uppercase tracking-widest mt-4">
                      Verified Information <ArrowRight size={16} className="ml-2"/>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
          </>
        )}
      </div>

      <FloatingContact />
      <Footer />
    </div>
  );
};

export default NewsPage;