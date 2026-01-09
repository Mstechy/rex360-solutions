import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowUpRight, Bell } from 'lucide-react';
// IMPORT FIXED: Matching your Capital 'S' filename
import { supabase } from '../SupabaseClient';

const NewsSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from('news').select('*').order('id', { ascending: false }).limit(2);
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <section className="py-24 bg-white px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b-2 border-slate-100 pb-6">
          <div>
            <span className="text-cac-green font-black uppercase tracking-[0.3em] text-xs flex items-center gap-2 mb-2">
              <Bell size={14} className="animate-pulse"/> Latest Insights
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-cac-blue uppercase tracking-tighter">CAC News & Updates</h2>
          </div>
          <Link to="/news" className="hidden md:flex items-center text-cac-green font-black uppercase text-sm">View All <ArrowUpRight size={20}/></Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {news.map((item) => (
            <div key={item.id} className="group bg-slate-50 p-8 rounded-[2rem] border hover:border-cac-green hover:shadow-xl transition-all">
              <div className="flex items-center space-x-3 mb-4 text-xs font-bold uppercase text-slate-400">
                <Calendar size={12} className="mr-1" /> {item.date}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-500 mb-6 text-sm line-clamp-2">{item.content}</p>
              <Link to="/news" className="font-black text-cac-green uppercase text-xs">Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;